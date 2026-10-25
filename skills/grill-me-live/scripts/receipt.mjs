// The session receipt: every decision in the tree, settled or dropped, and how it was decided.
// Built from .grill/state.json plus the answer history the page leaves in .grill/history/.

import fs from "node:fs";
import path from "node:path";

// How a decision was made, from the answers archived each round.
const HOW = {
  accepted: { tag: "REC ✓", md: "recommendation accepted" },
  own: { tag: "YOURS", md: "your words" },
  dropped: { tag: "YOU DROPPED", md: "you dropped it" },
  chat: { tag: "IN CHAT", md: "answered in chat" },
  found: { tag: "LOOKED UP", md: "looked up" },
};

function readHistory(dir) {
  const byId = {};
  let files = [];
  try { files = fs.readdirSync(dir).filter((f) => /^round-\d+-answers\.json$/.test(f)); } catch { return byId; }
  files.sort((a, b) => Number(a.match(/\d+/)[0]) - Number(b.match(/\d+/)[0]));
  for (const f of files) {
    try {
      const a = JSON.parse(fs.readFileSync(path.join(dir, f), "utf8"));
      for (const [id, ans] of Object.entries(a.answers || {})) byId[id] = ans; // later rounds win
    } catch {}
  }
  return byId;
}

export function buildReceipt(state, historyDir) {
  const session = state.session || {};
  const raw = state.nodes || {};
  const nodes = Array.isArray(raw)
    ? Object.fromEntries(raw.filter((n) => n && n.id).map((n) => [String(n.id), n]))
    : raw;
  const history = readHistory(historyDir);

  const isPruned = (id, seen = new Set()) => {
    const n = nodes[id];
    if (!n || !n.parent || seen.has(id)) return false;
    seen.add(id);
    const p = nodes[n.parent];
    return Boolean(p) && (p.status === "dropped" || isPruned(n.parent, seen));
  };
  const how = (id, n) => {
    const h = history[id];
    if (h && h.choice === "accept") return "accepted";
    if (h && h.choice === "answer") return "own";
    if (h && h.choice === "drop") return "dropped";
    return n.q != null ? "chat" : "found";
  };
  const order = (a, b) => (a.round ?? 99) - (b.round ?? 99) || (a.q ?? 99) - (b.q ?? 99) || (a.seq ?? 0) - (b.seq ?? 0);
  const item = (id, n) => ({ id, title: n.title || id, question: n.question || "", round: n.round ?? null, q: n.q ?? null, seq: n.seq ?? 0 });

  const settled = [], dropped = [], pruned = [], open = [], waiting = [];
  for (const [id, n] of Object.entries(nodes)) {
    if (!n) continue;
    if (n.status === "dropped") dropped.push({ ...item(id, n), reason: n.reason || "", how: how(id, n) === "dropped" ? "dropped" : null });
    else if (isPruned(id)) pruned.push({ ...item(id, n), parent: nodes[n.parent]?.title || n.parent });
    else if (n.status === "settled") settled.push({ ...item(id, n), answer: n.answer || "", how: how(id, n) });
    else if (n.status === "open" || n.status === "research") open.push({ ...item(id, n), status: n.status, recommendation: n.recommendation || "" });
    else waiting.push({ ...item(id, n), blockedBy: n.blockedBy || "" });
  }
  [settled, dropped, pruned, open, waiting].forEach((l) => l.sort(order));

  const times = (state.events || []).map((e) => Date.parse(e.at)).filter(Boolean).sort((a, b) => a - b);
  const count = (h) => settled.filter((s) => s.how === h).length;
  return {
    topic: session.topic || "Untitled idea",
    summary: session.summary || "",
    status: session.status || "grilling",
    rounds: Number(session.round) || 0,
    startedAt: times.length ? new Date(times[0]) : null,
    endedAt: times.length ? new Date(times[times.length - 1]) : null,
    printedAt: new Date(),
    number: receiptNumber(session.topic || ""),
    settled, dropped, pruned, open, waiting,
    totals: {
      settled: settled.length, dropped: dropped.length, pruned: pruned.length, open: open.length, waiting: waiting.length,
      accepted: count("accepted"), own: count("own"), chat: count("chat"), found: count("found"),
    },
  };
}

function receiptNumber(s) {
  let h = 2166136261;
  for (const ch of s) h = Math.imul(h ^ ch.codePointAt(0), 16777619) >>> 0;
  return String(h % 1000000).padStart(6, "0");
}

const day = (d) => (d ? d.toISOString().slice(0, 10) : "");
const STATUS_LINE = { done: "Shared understanding confirmed", confirming: "Frontier empty, waiting for your confirmation", grilling: "Session in progress" };
const qLabel = (x) => [x.q != null ? `Q${x.q}` : null, x.round != null ? `R${x.round}` : null].filter(Boolean).join("·");

// ---------- Markdown ----------

export function receiptMarkdown(r) {
  const L = [];
  L.push(`# Receipt: ${r.topic}`, "");
  L.push(`${[day(r.startedAt), `${r.rounds} round${r.rounds === 1 ? "" : "s"}`, STATUS_LINE[r.status] || r.status].filter(Boolean).join(" · ")}`, "");
  if (r.summary) L.push(`> ${r.summary}`, "");
  L.push(`## Settled (${r.totals.settled})`, "");
  for (const s of r.settled) L.push(`- **${qLabel(s) ? qLabel(s) + " " : ""}${s.title}**: ${s.answer || "settled"} _(${HOW[s.how].md})_`);
  if (!r.settled.length) L.push("- Nothing settled yet.");
  if (r.dropped.length || r.pruned.length) {
    L.push("", `## Dropped (${r.totals.dropped})`, "");
    for (const d of r.dropped) L.push(`- ~~${d.title}~~: ${d.reason || "no reason given"}${d.how ? ` _(${HOW[d.how].md})_` : ""}`);
    if (r.pruned.length) L.push(`- Also dropped with their parent: ${r.pruned.map((p) => p.title).join("; ")}`);
  }
  if (r.open.length || r.waiting.length) {
    L.push("", `## Not decided yet (${r.totals.open + r.totals.waiting})`, "");
    for (const o of r.open) L.push(`- ${o.status === "research" ? "Looking up" : "Open"}: **${o.title}**${o.recommendation ? ` (recommended: ${o.recommendation})` : ""}`);
    for (const w of r.waiting) L.push(`- Waiting: ${w.title}${w.blockedBy ? ` (needs ${w.blockedBy})` : ""}`);
  }
  const t = r.totals;
  L.push("", "## Totals", "", "| Settled | Dropped | Not decided | Recommendations accepted | Your own words |", "|---:|---:|---:|---:|---:|");
  L.push(`| ${t.settled} | ${t.dropped + t.pruned} | ${t.open + t.waiting} | ${t.accepted} | ${t.own} |`);
  return L.join("\n") + "\n";
}

// ---------- HTML ----------

export const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

function barcode(seed) {
  let x = Number(seed) || 1;
  const bars = [];
  for (let i = 0, pos = 0; i < 42; i++) {
    x = (x * 1103515245 + 12345) % 2147483648;
    const w = 1 + (x % 3), gap = 1 + ((x >> 3) % 2);
    bars.push(`<rect x="${pos}" width="${w}" height="34"/>`);
    pos += w + gap;
  }
  return `<svg class="barcode" viewBox="0 0 140 34" preserveAspectRatio="none" aria-hidden="true">${bars.join("")}</svg>`;
}

export function receiptHtml(r, { printable = true } = {}) {
  const t = r.totals;
  const line = (label, value, cls = "") => `<div class="tot ${cls}"><span>${esc(label)}</span><i></i><b>${esc(value)}</b></div>`;
  const settled = r.settled.map((s) => `
      <li><div class="row"><span class="q">${esc(qLabel(s))}</span><span class="t">${esc(s.title)}</span><span class="how how-${s.how}">${esc(HOW[s.how].tag)}</span></div>
        <p class="a">${esc(s.answer || "Settled")}</p></li>`).join("");
  const dropped = r.dropped.map((d) => `
      <li><div class="row"><span class="q">${esc(qLabel(d))}</span><span class="t strike">${esc(d.title)}</span>${d.how ? `<span class="how how-dropped">${esc(HOW.dropped.tag)}</span>` : ""}</div>
        <p class="a why">${esc(d.reason || "No reason given")}</p></li>`).join("");
  const pruned = r.pruned.length ? `<p class="note">Also dropped with their parent: ${r.pruned.map((p) => esc(p.title)).join("; ")}.</p>` : "";
  const notDecided = [...r.open.map((o) => `<li><div class="row"><span class="q">${esc(qLabel(o))}</span><span class="t">${esc(o.title)}</span><span class="how how-open">${o.status === "research" ? "LOOKING UP" : "OPEN"}</span></div>${o.recommendation ? `<p class="a">Recommended: ${esc(o.recommendation)}</p>` : ""}</li>`),
    ...r.waiting.map((w) => `<li><div class="row"><span class="q"></span><span class="t dim">${esc(w.title)}</span><span class="how how-open">WAITING</span></div>${w.blockedBy ? `<p class="a dim">Needs ${esc(w.blockedBy)}</p>` : ""}</li>`)].join("");

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Receipt: ${esc(r.topic)}</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&display=swap">
<style>
/* A thermal-paper receipt on a desk: the paper stays white in both themes, the desk follows the system. */
:root { --desk: #DDE2E7; --paper: #FFFFFF; --ink: #1B1F24; --faded: #6B7480; --rule: #9AA3AD; --green: #11795A; --red: #B0443A; --blue: #2E4BDB; color-scheme: light; }
@media (prefers-color-scheme: dark) { :root { --desk: #10151A; } }
* { box-sizing: border-box; }
body { margin: 0; background: var(--desk); color: var(--ink); font: 13px/1.45 "IBM Plex Mono", ui-monospace, "SFMono-Regular", Menlo, monospace; padding: 32px 16px 48px; }
.paper { max-width: 400px; margin: 0 auto; background: var(--paper); padding: 26px 24px 30px; position: relative;
  box-shadow: 0 1px 2px rgba(0,0,0,.08), 0 10px 30px rgba(0,0,0,.12);
  --tooth: 7px;
  -webkit-mask: conic-gradient(from 135deg at top, #0000, #000 1deg 89deg, #0000 90deg) top / calc(2 * var(--tooth)) 51% repeat-x,
                conic-gradient(from -45deg at bottom, #0000, #000 1deg 89deg, #0000 90deg) bottom / calc(2 * var(--tooth)) 51% repeat-x;
          mask: conic-gradient(from 135deg at top, #0000, #000 1deg 89deg, #0000 90deg) top / calc(2 * var(--tooth)) 51% repeat-x,
                conic-gradient(from -45deg at bottom, #0000, #000 1deg 89deg, #0000 90deg) bottom / calc(2 * var(--tooth)) 51% repeat-x; }
.center { text-align: center; }
.brand { font-weight: 600; letter-spacing: .28em; font-size: 12px; margin: 6px 0 2px; }
.kind { color: var(--faded); font-size: 11px; letter-spacing: .14em; text-transform: uppercase; margin: 0; }
h1 { font-size: 17px; font-weight: 600; line-height: 1.3; margin: 16px 0 6px; text-wrap: balance; overflow-wrap: anywhere; }
.summary { color: var(--faded); margin: 0 0 4px; font-size: 12px; overflow-wrap: anywhere; }
.meta { display: grid; grid-template-columns: auto 1fr; gap: 0 12px; font-size: 11.5px; margin-top: 12px; }
.meta dt { color: var(--faded); } .meta dd { margin: 0; text-align: right; font-variant-numeric: tabular-nums; }
hr { border: 0; border-top: 1.5px dashed var(--rule); margin: 16px 0; }
h2 { font-size: 11.5px; letter-spacing: .16em; margin: 0 0 8px; display: flex; justify-content: space-between; }
ul { list-style: none; margin: 0; padding: 0; display: grid; gap: 10px; }
.row { display: grid; grid-template-columns: 3.6em minmax(0, 1fr) auto; gap: 8px; align-items: baseline; }
.q { color: var(--faded); font-size: 10.5px; font-variant-numeric: tabular-nums; }
.t { font-weight: 500; overflow-wrap: anywhere; }
.strike { text-decoration: line-through; text-decoration-color: var(--red); }
.dim { color: var(--faded); }
.how { font-size: 9.5px; letter-spacing: .06em; border: 1px solid currentColor; padding: 0 4px; white-space: nowrap; }
.how-accepted { color: var(--green); } .how-own { color: var(--blue); } .how-chat, .how-found, .how-open { color: var(--faded); } .how-dropped { color: var(--red); }
.a { margin: 2px 0 0 calc(3.6em + 8px); overflow-wrap: anywhere; }
.why { color: var(--red); }
.note { margin: 10px 0 0; color: var(--faded); font-size: 11.5px; overflow-wrap: anywhere; }
.empty { color: var(--faded); margin: 0; }
.tot { display: grid; grid-template-columns: auto 1fr auto; gap: 6px; align-items: baseline; font-variant-numeric: tabular-nums; }
.tot i { border-bottom: 1.5px dotted var(--rule); transform: translateY(-3px); }
.tot.big { font-weight: 600; font-size: 14px; margin-top: 6px; }
.status { margin: 18px 0 4px; font-weight: 600; letter-spacing: .08em; text-transform: uppercase; font-size: 12px; }
.status.done { color: var(--green); }
.thanks { color: var(--faded); font-size: 11.5px; margin: 0; }
.barcode { display: block; width: 180px; height: 34px; margin: 16px auto 4px; fill: var(--ink); }
.no { font-size: 10.5px; letter-spacing: .3em; color: var(--faded); }
.actions { max-width: 400px; margin: 16px auto 0; display: flex; justify-content: center; }
.actions button { font: 500 12px "IBM Plex Mono", ui-monospace, monospace; padding: 6px 14px; border: 1px solid var(--rule); background: var(--paper); color: var(--ink); border-radius: 4px; cursor: pointer; }
.actions button:focus-visible { outline: 2px solid var(--blue); outline-offset: 2px; }
@media print { body { background: #fff; padding: 0; } .paper { box-shadow: none; -webkit-mask: none; mask: none; } .actions { display: none; } }
</style>
</head>
<body>
<main class="paper">
  <div class="center">
    <p class="brand">GRILL·ME·LIVE</p>
    <p class="kind">Decision receipt</p>
    <h1>${esc(r.topic)}</h1>
    ${r.summary ? `<p class="summary">${esc(r.summary)}</p>` : ""}
  </div>
  <dl class="meta">
    <dt>Started</dt><dd>${esc(day(r.startedAt) || "—")}</dd>
    <dt>Printed</dt><dd>${esc(day(r.printedAt))}</dd>
    <dt>Rounds</dt><dd>${r.rounds}</dd>
    <dt>Receipt no.</dt><dd>${r.number}</dd>
  </dl>
  <hr>
  <h2><span>SETTLED</span><span>${t.settled}</span></h2>
  ${settled ? `<ul>${settled}</ul>` : `<p class="empty">Nothing settled yet.</p>`}
  ${r.dropped.length || r.pruned.length ? `<hr><h2><span>DROPPED</span><span>${t.dropped + t.pruned}</span></h2>${dropped ? `<ul>${dropped}</ul>` : ""}${pruned}` : ""}
  ${notDecided ? `<hr><h2><span>NOT DECIDED YET</span><span>${t.open + t.waiting}</span></h2><ul>${notDecided}</ul>` : ""}
  <hr>
  ${line("Recommendations accepted", t.accepted)}
  ${line("Your own words", t.own)}
  ${t.chat ? line("Answered in chat", t.chat) : ""}
  ${t.found ? line("Looked up", t.found) : ""}
  ${line("Dropped", t.dropped + t.pruned)}
  ${line("Not decided yet", t.open + t.waiting)}
  ${line("Decisions settled", t.settled, "big")}
  <div class="center">
    <p class="status ${r.status === "done" ? "done" : ""}">${esc(STATUS_LINE[r.status] || r.status)}</p>
    <p class="thanks">Every decision, and why. Thank you for being grilled.</p>
    ${barcode(r.number)}
    <span class="no">${r.number}</span>
  </div>
</main>
${printable ? `<div class="actions"><button type="button" onclick="window.print()">Print</button></div>` : ""}
</body>
</html>
`;
}
