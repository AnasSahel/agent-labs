#!/usr/bin/env node
// grill-me-live: a local server that draws a grilling session as a live tree,
// plus the helpers the agent uses to collect answers from the page.
//
//   node grill.mjs serve [--open] [--port 4747]   start the page (run in the background)
//   node grill.mjs wait [--timeout 540]           block until the user presses Send, print answers
//   node grill.mjs answers [--consume]            print answers saved on the page so far
//   node grill.mjs snapshot [--out file.html]     write a self-contained, read-only copy of the tree
//   node grill.mjs receipt                        write .grill/receipt.html + .md: every decision and how it was made
//   node grill.mjs deck                           write .grill/deck.html: the session as slides for the people who were not in the room
//   node grill.mjs status | stop
//
// Every command takes --dir (default: .grill in the current directory).
// The agent owns state.json; the page owns answers.json. Nothing here edits state.json.

import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { buildReceipt, receiptHtml, receiptMarkdown } from "./receipt.mjs";
import { buildDeck, deckHtml } from "./deck.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ASSETS = path.join(HERE, "..", "assets");

const [cmd = "help", ...rest] = process.argv.slice(2);
const flags = {};
for (let i = 0; i < rest.length; i++) {
  const m = rest[i].match(/^--([^=]+)(?:=(.*))?$/);
  if (!m) continue;
  if (m[2] !== undefined) flags[m[1]] = m[2];
  else if (rest[i + 1] !== undefined && !rest[i + 1].startsWith("--")) flags[m[1]] = rest[++i];
  else flags[m[1]] = true;
}

const DIR = path.resolve(String(flags.dir || ".grill"));
const STATE = path.join(DIR, "state.json");
const ANSWERS = path.join(DIR, "answers.json");
const SERVER = path.join(DIR, "server.json");
const WAITER = path.join(DIR, "wait.pid");
const HISTORY = path.join(DIR, "history");

const CHOICES = new Set(["accept", "answer", "drop"]);
const MAX_TEXT = 4000;

// ---------- files ----------

function readJSON(file, fallback) {
  try { return JSON.parse(fs.readFileSync(file, "utf8")); } catch { return fallback; }
}

// Write to a temp file and rename, so readers never see half a file.
function writeJSON(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const tmp = `${file}.${process.pid}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(value, null, 2) + "\n");
  fs.renameSync(tmp, file);
}

function emptyState() {
  return { session: { topic: "", round: 0, status: "grilling" }, nodes: {}, events: [] };
}

function emptyAnswers(round = 0) {
  return { round, submittedAt: null, answers: {} };
}

function ensureDir() {
  fs.mkdirSync(DIR, { recursive: true });
  if (!fs.existsSync(STATE)) writeJSON(STATE, emptyState());
  if (!fs.existsSync(ANSWERS)) writeJSON(ANSWERS, emptyAnswers());
}

function nodesOf(state) {
  const raw = state && state.nodes;
  if (Array.isArray(raw)) return Object.fromEntries(raw.filter((n) => n && n.id).map((n) => [String(n.id), n]));
  return raw && typeof raw === "object" ? raw : {};
}

function roundOf(state) {
  return (state && state.session && Number(state.session.round)) || 0;
}

// Answers saved during an earlier round are stale once the agent posts a new round.
function currentAnswers(state) {
  const a = readJSON(ANSWERS, emptyAnswers());
  const round = roundOf(state);
  if (a.round !== round) return emptyAnswers(round);
  a.answers = a.answers && typeof a.answers === "object" ? a.answers : {};
  return a;
}

function pidAlive(pid) {
  try { process.kill(pid, 0); return true; } catch { return false; }
}

// ---------- answers, as the agent reads them ----------

function describeAnswers(state, a) {
  const nodes = nodesOf(state);
  return Object.entries(a.answers)
    .map(([id, ans]) => {
      const n = nodes[id] || {};
      return {
        id,
        q: n.q ?? null,
        title: n.title || id,
        choice: ans.choice,
        // "accept" means the user took the recommendation shown on the page.
        answer: ans.choice === "accept" ? n.recommendation || "" : ans.text || "",
        recommendation: n.recommendation || "",
      };
    })
    .sort((x, y) => (x.q ?? 99) - (y.q ?? 99));
}

function printAnswers(state, a) {
  const list = describeAnswers(state, a);
  const open = Object.entries(nodesOf(state)).filter(([, n]) => n && n.status === "open").map(([id]) => id);
  const unanswered = open.filter((id) => !a.answers[id]);
  const lines = [`Round ${roundOf(state)} answers from the page (${list.length} of ${open.length} open questions):`];
  for (const x of list) {
    const verb = x.choice === "accept" ? "ACCEPTED" : x.choice === "drop" ? "DROP" : "ANSWERED";
    lines.push(`- Q${x.q ?? "?"} ${x.title} [${x.id}]: ${verb}${x.answer ? ` - ${x.answer}` : ""}`);
  }
  if (unanswered.length) lines.push(`Not answered on the page: ${unanswered.join(", ")}`);
  lines.push("", "JSON: " + JSON.stringify({ round: roundOf(state), answers: list, unanswered }));
  console.log(lines.join("\n"));
}

// The answers stay on the page, locked, until the agent posts the next round.
function consume(state, a) {
  const done = { ...a, round: roundOf(state), consumedAt: new Date().toISOString() };
  writeJSON(path.join(HISTORY, `round-${done.round}-answers.json`), done);
  writeJSON(ANSWERS, done);
}

// ---------- commands ----------

const commands = {
  async serve() {
    ensureDir();
    const running = readJSON(SERVER, null);
    if (running && pidAlive(running.pid)) {
      console.log(`grill-me-live already running: ${running.url}`);
      return;
    }

    const clients = new Set();
    let last = "";
    const payload = () => {
      const state = readJSON(STATE, null);
      if (!state) return null; // mid-write or invalid: keep showing the last good tree
      return { state, answers: currentAnswers(state) };
    };
    const broadcast = (force = false) => {
      const p = payload();
      if (!p) return;
      const body = JSON.stringify(p);
      if (body === last && !force) return;
      last = body;
      for (const res of clients) res.write(`data: ${body}\n\n`);
    };
    // Polling is dull but works on every filesystem and editor save strategy.
    setInterval(() => broadcast(), 250).unref();
    setInterval(() => { for (const res of clients) res.write(": ping\n\n"); }, 15000).unref();

    let port = Number(flags.port) || 4747;
    const server = http.createServer((req, res) => handle(req, res, { clients, payload, broadcast, port: () => port }));
    for (let attempt = 0; ; attempt++) {
      try {
        await new Promise((resolve, reject) => {
          server.once("error", reject);
          server.listen(port, "127.0.0.1", resolve);
        });
        break;
      } catch (e) {
        if (e.code !== "EADDRINUSE" || attempt >= 20) throw e;
        port++;
      }
    }
    const url = `http://localhost:${port}`;
    writeJSON(SERVER, { pid: process.pid, port, url, dir: DIR, startedAt: new Date().toISOString() });
    console.log(`grill-me-live is live: ${url}`);
    console.log(`Watching ${path.relative(process.cwd(), DIR) || "."}/state.json. Stop with: node ${path.relative(process.cwd(), fileURLToPath(import.meta.url))} stop`);

    const shutdown = () => {
      const s = readJSON(SERVER, null);
      if (s && s.pid === process.pid) fs.rmSync(SERVER, { force: true });
      process.exit(0);
    };
    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);

    if (flags.open) openBrowser(url);
  },

  async wait() {
    ensureDir();
    // One waiter at a time: a new wait replaces a stale one from an earlier round.
    const old = Number(readJSON(WAITER, null));
    if (old && old !== process.pid && pidAlive(old)) { try { process.kill(old); } catch {} }
    writeJSON(WAITER, process.pid);
    const cleanup = () => { if (Number(readJSON(WAITER, null)) === process.pid) fs.rmSync(WAITER, { force: true }); };
    process.on("SIGTERM", () => { cleanup(); process.exit(143); });

    const timeout = Number(flags.timeout ?? 540) * 1000;
    const started = Date.now();
    for (;;) {
      const state = readJSON(STATE, null);
      if (state) {
        const a = currentAnswers(state);
        if (a.submittedAt && !a.consumedAt) {
          printAnswers(state, a);
          consume(state, a);
          cleanup();
          return;
        }
      }
      if (timeout > 0 && Date.now() - started > timeout) {
        console.log(`No answers sent yet (waited ${Math.round(timeout / 1000)}s). Run wait again to keep waiting.`);
        cleanup();
        process.exit(2);
      }
      await new Promise((r) => setTimeout(r, 400));
    }
  },

  async answers() {
    ensureDir();
    const state = readJSON(STATE, emptyState());
    const a = currentAnswers(state);
    printAnswers(state, a);
    if (flags.consume) consume(state, a);
  },

  async snapshot() {
    ensureDir();
    const state = readJSON(STATE, null);
    if (!state) throw new Error(`Can't read ${STATE}`);
    const html = snapshotHtml(state);
    const out = path.resolve(String(flags.out || path.join(DIR, `grill-tree-round-${roundOf(state)}.html`)));
    fs.writeFileSync(out, html);
    console.log(`Snapshot written: ${out}`);
  },

  async receipt() {
    ensureDir();
    const state = readJSON(STATE, null);
    if (!state) throw new Error(`Can't read ${STATE}`);
    const r = buildReceipt(state, HISTORY);
    fs.writeFileSync(path.join(DIR, "receipt.html"), receiptHtml(r));
    fs.writeFileSync(path.join(DIR, "receipt.md"), receiptMarkdown(r));
    console.log(receiptMarkdown(r));
    console.log(`Receipt written: ${path.join(DIR, "receipt.html")} and receipt.md`);
  },

  async deck() {
    ensureDir();
    const state = readJSON(STATE, null);
    if (!state) throw new Error(`Can't read ${STATE}`);
    const out = path.join(DIR, "deck.html");
    fs.writeFileSync(out, deckHtml(buildDeck(state, HISTORY), snapshotHtml(state, { embed: true })));
    console.log(`Deck written: ${out} (open it in a browser; arrow keys move, Print gives one page per slide)`);
  },

  async status() {
    const s = readJSON(SERVER, null);
    if (s && pidAlive(s.pid)) console.log(`Running: ${s.url} (pid ${s.pid})`);
    else console.log("Not running.");
  },

  async stop() {
    const s = readJSON(SERVER, null);
    if (s && pidAlive(s.pid)) { process.kill(s.pid); console.log(`Stopped ${s.url}`); }
    else console.log("Not running.");
    fs.rmSync(SERVER, { force: true });
  },

  async help() {
    console.log(fs.readFileSync(fileURLToPath(import.meta.url), "utf8").split("\n").slice(1, 12).map((l) => l.replace(/^\/\/ ?/, "")).join("\n"));
  },
};

// ---------- http ----------

function send(res, status, body, type = "application/json; charset=utf-8") {
  res.writeHead(status, { "content-type": type, "cache-control": "no-store", "x-content-type-options": "nosniff" });
  res.end(typeof body === "string" || Buffer.isBuffer(body) ? body : JSON.stringify(body));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on("data", (c) => {
      size += c.length;
      if (size > 64 * 1024) { reject(new Error("Body too large")); req.destroy(); return; }
      chunks.push(c);
    });
    req.on("end", () => {
      if (!chunks.length) return resolve({});
      try { resolve(JSON.parse(Buffer.concat(chunks).toString("utf8"))); } catch { reject(new Error("Body is not JSON")); }
    });
    req.on("error", reject);
  });
}

async function handle(req, res, ctx) {
  // Only this machine's browser, by name: blocks DNS-rebinding pages from reaching the API.
  const host = String(req.headers.host || "");
  const okHost = [`localhost:${ctx.port()}`, `127.0.0.1:${ctx.port()}`];
  if (!okHost.includes(host)) return send(res, 403, { error: "Unknown host" });
  const url = new URL(req.url, `http://${host}`);

  if (req.method === "GET") {
    if (url.pathname === "/" || url.pathname === "/index.html") {
      return send(res, 200, fs.readFileSync(path.join(ASSETS, "index.html")), "text/html; charset=utf-8");
    }
    if (url.pathname === "/d3.min.js") {
      return send(res, 200, fs.readFileSync(path.join(ASSETS, "d3.min.js")), "text/javascript; charset=utf-8");
    }
    if (url.pathname === "/receipt") {
      const state = readJSON(STATE, null);
      if (!state) return send(res, 409, "The tree is being updated. Reload in a moment.", "text/plain; charset=utf-8");
      return send(res, 200, receiptHtml(buildReceipt(state, HISTORY)), "text/html; charset=utf-8");
    }
    if (url.pathname === "/deck") {
      const state = readJSON(STATE, null);
      if (!state) return send(res, 409, "The tree is being updated. Reload in a moment.", "text/plain; charset=utf-8");
      return send(res, 200, deckHtml(buildDeck(state, HISTORY), snapshotHtml(state, { embed: true })), "text/html; charset=utf-8");
    }
    if (url.pathname === "/api/state") return send(res, 200, ctx.payload() || {});
    if (url.pathname === "/api/events") {
      res.writeHead(200, { "content-type": "text/event-stream", "cache-control": "no-store", connection: "keep-alive" });
      res.write("retry: 1500\n\n");
      const p = ctx.payload();
      if (p) res.write(`data: ${JSON.stringify(p)}\n\n`);
      ctx.clients.add(res);
      req.on("close", () => ctx.clients.delete(res));
      return;
    }
    return send(res, 404, { error: "Not found" });
  }

  // Writes: JSON only, and only from the page itself (a cross-site form can't set this content type).
  const origin = req.headers.origin;
  if (origin && !okHost.some((h) => origin === `http://${h}`)) return send(res, 403, { error: "Cross-origin request refused" });
  if (!String(req.headers["content-type"] || "").startsWith("application/json")) return send(res, 415, { error: "Send JSON" });

  try {
    const state = readJSON(STATE, null);
    if (!state) return send(res, 409, { error: "The tree is being updated. Try again in a moment." });
    const nodes = nodesOf(state);
    const a = currentAnswers(state);
    if (a.consumedAt) return send(res, 409, { error: "These answers are already with the AI. The next round will appear here shortly." });

    if (req.method === "POST" && url.pathname === "/api/answers") {
      const { id, choice, text = "" } = await readBody(req);
      const n = nodes[id];
      if (!n) return send(res, 404, { error: "That question is no longer in the tree." });
      if (n.status !== "open") return send(res, 409, { error: "That question isn't open any more." });
      if (!CHOICES.has(choice)) return send(res, 400, { error: "Choose accept, answer or drop." });
      if (typeof text !== "string" || text.length > MAX_TEXT) return send(res, 400, { error: `Keep answers under ${MAX_TEXT} characters.` });
      if (choice === "answer" && !text.trim()) return send(res, 400, { error: "Write an answer first." });
      a.answers[id] = { choice, text: text.trim(), at: new Date().toISOString() };
      a.submittedAt = null; // any change re-opens the round until Send
      writeJSON(ANSWERS, a);
    } else if (req.method === "DELETE" && url.pathname.startsWith("/api/answers/")) {
      delete a.answers[decodeURIComponent(url.pathname.slice("/api/answers/".length))];
      a.submittedAt = null;
      writeJSON(ANSWERS, a);
    } else if (req.method === "POST" && url.pathname === "/api/send") {
      if (!Object.keys(a.answers).length) return send(res, 400, { error: "Answer at least one question first." });
      a.submittedAt = new Date().toISOString();
      writeJSON(ANSWERS, a);
    } else {
      return send(res, 404, { error: "Not found" });
    }
    ctx.broadcast(true);
    return send(res, 200, ctx.payload());
  } catch (e) {
    return send(res, 400, { error: e.message });
  }
}

// The live page with the tree baked in: one file, no server, no network. `extra` rides along in the payload (the deck sets embed: true).
function snapshotHtml(state, extra = {}) {
  const safe = (s) => s.replace(/<\/script/gi, "<\\/script");
  const data = JSON.stringify({ state, answers: emptyAnswers(roundOf(state)), ...extra }).replace(/</g, "\\u003c");
  let html = fs.readFileSync(path.join(ASSETS, "index.html"), "utf8");
  if (extra.embed) html = html.replace(/<link rel="(?:preconnect|stylesheet)"[^>]*>\n?/g, ""); // the deck is shown offline: no font fetch
  const d3 = fs.readFileSync(path.join(ASSETS, "d3.min.js"), "utf8");
  return html.replace('<script src="d3.min.js"></script>', () => `<script>${safe(d3)}</script>\n<script>window.__GRILL_SNAPSHOT__ = ${data};</script>`);
}

function openBrowser(url) {
  const [bin, args] = process.platform === "darwin" ? ["open", [url]]
    : process.platform === "win32" ? ["cmd", ["/c", "start", "", url]]
    : ["xdg-open", [url]];
  try {
    const child = spawn(bin, args, { stdio: "ignore", detached: true });
    child.on("error", () => {});
    child.unref();
  } catch {}
}

const run = commands[cmd] || commands.help;
run().catch((e) => {
  console.error(`grill-me-live: ${e.message}`);
  process.exit(1);
});
