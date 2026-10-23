// End-to-end check of grill.mjs without a browser: node skills/grill-me-live/test/smoke.mjs
import { spawn, execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";

const SCRIPT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "scripts", "grill.mjs");
const dir = fs.mkdtempSync(path.join(os.tmpdir(), "grill-smoke-"));
const port = 4800 + Math.floor(Math.random() * 100);
const grill = (...args) => execFileSync(process.execPath, [SCRIPT, ...args, "--dir", dir], { encoding: "utf8" });

const state = {
  session: { topic: "Smoke test idea", round: 1, status: "grilling" },
  nodes: {
    a: { title: "First", recommendation: "Yes", status: "open", parent: null, round: 1, q: 1, seq: 1 },
    b: { title: "Second", recommendation: "No", status: "open", parent: null, round: 1, q: 2, seq: 2 },
    c: { title: "Later", status: "waiting", parent: "a", seq: 3 },
  },
  events: [{ seq: 1, round: 1, kind: "asked", text: "Round 1", at: new Date().toISOString() }],
};
fs.mkdirSync(dir, { recursive: true });
fs.writeFileSync(path.join(dir, "state.json"), JSON.stringify(state));

const server = spawn(process.execPath, [SCRIPT, "serve", "--dir", dir, "--port", String(port)], { stdio: ["ignore", "pipe", "inherit"] });
const base = await new Promise((resolve, reject) => {
  server.stdout.on("data", (d) => { const m = String(d).match(/http:\/\/localhost:(\d+)/); if (m) resolve(`http://localhost:${m[1]}`); });
  server.on("exit", (code) => reject(new Error(`server exited ${code}`)));
});
const json = { "content-type": "application/json" };
let failed = false;

try {
  const page = await fetch(base + "/");
  assert.equal(page.status, 200);
  assert.match(await page.text(), /<title>Grill Tree<\/title>/);
  assert.equal((await fetch(base + "/d3.min.js")).status, 200);

  // First server-sent event carries the tree.
  const ctrl = new AbortController();
  const es = await fetch(base + "/api/events", { signal: ctrl.signal });
  const reader = es.body.getReader();
  let buf = "";
  while (!buf.includes("data: ")) buf += new TextDecoder().decode((await reader.read()).value);
  while (!buf.slice(buf.indexOf("data: ")).includes("\n\n")) buf += new TextDecoder().decode((await reader.read()).value);
  const first = JSON.parse(buf.slice(buf.indexOf("data: ") + 6).split("\n\n")[0]);
  assert.equal(first.state.session.topic, "Smoke test idea");

  // A file change reaches open pages.
  fs.writeFileSync(path.join(dir, "state.json"), JSON.stringify({ ...state, session: { ...state.session, topic: "Changed" } }));
  buf = "";
  while (!buf.includes("Changed")) buf += new TextDecoder().decode((await reader.read()).value);
  ctrl.abort();
  fs.writeFileSync(path.join(dir, "state.json"), JSON.stringify(state));
  await new Promise((r) => setTimeout(r, 400));

  // Guard rails.
  assert.equal((await fetch(base + "/api/answers", { method: "POST", headers: { ...json, origin: "https://evil.example" }, body: "{}" })).status, 403);
  assert.equal((await fetch(base + "/api/answers", { method: "POST", headers: { "content-type": "text/plain" }, body: "{}" })).status, 415);
  assert.equal((await fetch(base + "/api/answers", { method: "POST", headers: json, body: JSON.stringify({ id: "c", choice: "accept" }) })).status, 409);
  assert.equal((await fetch(base + "/api/answers", { method: "POST", headers: json, body: JSON.stringify({ id: "a", choice: "answer", text: " " }) })).status, 400);
  assert.equal((await fetch(base + "/api/send", { method: "POST", headers: json })).status, 400);
  const badHost = await new Promise((resolve) => {
    import("node:http").then(({ request }) => {
      const req = request({ host: "127.0.0.1", port: new URL(base).port, path: "/api/state", headers: { host: "evil.example" } }, (res) => resolve(res.statusCode));
      req.end();
    });
  });
  assert.equal(badHost, 403);

  // Answer, start a waiter, then send.
  let r = await fetch(base + "/api/answers", { method: "POST", headers: json, body: JSON.stringify({ id: "a", choice: "accept" }) });
  assert.equal(r.status, 200);
  r = await fetch(base + "/api/answers", { method: "POST", headers: json, body: JSON.stringify({ id: "b", choice: "answer", text: "Actually maybe" }) });
  assert.equal((await r.json()).answers.answers.b.text, "Actually maybe");

  const waiter = spawn(process.execPath, [SCRIPT, "wait", "--dir", dir, "--timeout", "20"], { stdio: ["ignore", "pipe", "inherit"] });
  let out = "";
  waiter.stdout.on("data", (d) => (out += d));
  await new Promise((r) => setTimeout(r, 600));
  assert.equal((await fetch(base + "/api/send", { method: "POST", headers: json })).status, 200);
  const code = await new Promise((resolve) => waiter.on("exit", resolve));
  assert.equal(code, 0);
  assert.match(out, /Q1 First \[a\]: ACCEPTED - Yes/);
  assert.match(out, /Q2 Second \[b\]: ANSWERED - Actually maybe/);
  assert.ok(fs.existsSync(path.join(dir, "history", "round-1-answers.json")));
  assert.ok(JSON.parse(fs.readFileSync(path.join(dir, "answers.json"), "utf8")).consumedAt);
  assert.equal((await fetch(base + "/api/answers", { method: "POST", headers: json, body: JSON.stringify({ id: "a", choice: "drop" }) })).status, 409);

  // A timed-out wait exits 2.
  const t = spawn(process.execPath, [SCRIPT, "wait", "--dir", dir, "--timeout", "1"], { stdio: "ignore" });
  assert.equal(await new Promise((resolve) => t.on("exit", resolve)), 2);

  // Snapshot is one self-contained file.
  const snapOut = path.join(dir, "snap.html");
  grill("snapshot", "--out", snapOut);
  const snap = fs.readFileSync(snapOut, "utf8");
  assert.ok(snap.includes("window.__GRILL_SNAPSHOT__"));
  assert.ok(!snap.includes('src="d3.min.js"'));

  // Receipt: settle the tree the way the agent would, then check how each decision is attributed.
  fs.writeFileSync(path.join(dir, "state.json"), JSON.stringify({
    ...state,
    session: { ...state.session, round: 2, status: "done" },
    nodes: {
      a: { ...state.nodes.a, status: "settled", answer: "Yes" },
      b: { ...state.nodes.b, status: "settled", answer: "Actually maybe" },
      c: { ...state.nodes.c, status: "dropped", reason: "Out of scope" },
      d: { title: "Under c", status: "waiting", parent: "c", seq: 4 },
    },
  }));
  const md = grill("receipt");
  assert.match(md, /# Receipt: Smoke test idea/);
  assert.match(md, /\*\*Q1·R1 First\*\*: Yes _\(recommendation accepted\)_/);
  assert.match(md, /\*\*Q2·R1 Second\*\*: Actually maybe _\(your words\)_/);
  assert.match(md, /~~Later~~: Out of scope/);
  assert.match(md, /Also dropped with their parent: Under c/);
  assert.ok(fs.existsSync(path.join(dir, "receipt.html")) && fs.existsSync(path.join(dir, "receipt.md")));
  const receiptPage = await fetch(base + "/receipt");
  assert.equal(receiptPage.status, 200);
  const receiptBody = await receiptPage.text();
  assert.match(receiptBody, /Decision receipt/);
  assert.match(receiptBody, /Shared understanding confirmed/);

  assert.match(grill("status"), /Running/);
  console.log("smoke test passed");
} catch (e) {
  failed = true;
  console.error(e);
} finally {
  try { grill("stop"); } catch {}
  server.kill();
  fs.rmSync(dir, { recursive: true, force: true });
  process.exit(failed ? 1 : 0);
}
