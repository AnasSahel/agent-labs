// The client deck: the session as slides, built only from .grill/state.json (plus the answer
// history the page leaves in .grill/history/, for the "where did this answer come from" tags).
// One self-contained HTML file: arrow keys and clicks move between slides, "Print to PDF" gives one page per slide.
//
// Slides: title · the whole tree (the snapshot page, embedded read-only) · one per top-level decision ·
// dropped decisions · next steps.

import { buildReceipt, esc } from "./receipt.mjs";

// Deck wording for the receipt's attribution of each settled answer.
const SOURCE = {
  accepted: "Recommendation accepted",
  own: "Own words",
  chat: "Answered in chat",
  found: "Looked up",
};

// A settled decision "looks like an action" when its title or answer carries an explicit marker
// (next step, deadline, to do…) or opens with an imperative verb. English and French.
const MARKER = /(?<![\p{L}\d])(next steps?|actions?|to-?dos?|deadline|due|owner|prochaines? étapes?|à faire|échéance|responsable)(?![\p{L}\d])/iu;
const IMPERATIVE = /^(?:[-•*]\s*)?(set ?up|implement|build|write|draft|send|book|hire|recruit|launch|ship|start|create|define|decide|review|contact|schedule|plan|prepare|test|deploy|migrate|train|assess|audit|document|publish|measure|appoint|notify|register|sign|approve|validate|procure|configure|install|enable|roll ?out|escalate|run|organi[sz]e|order|mettre en place|définir|rédiger|lancer|planifier|déployer|former|nommer|désigner|contacter|envoyer|préparer|tester|auditer|documenter|publier|mesurer|notifier|déclarer|valider|configurer|installer|migrer|recruter|signer|approuver|organiser|commander|réaliser|faire)(?![\p{L}])/iu;
const looksLikeAction = (s) => {
  for (const part of String(s || "").split(/[.;\n]/)) {
    const t = part.trim();
    if (t && (MARKER.test(t) || IMPERATIVE.test(t))) return true;
  }
  return false;
};

const day = (d) => (d ? d.toISOString().slice(0, 10) : "");

export function buildDeck(state, historyDir) {
  const r = buildReceipt(state, historyDir);
  const raw = state.nodes || {};
  const nodes = Array.isArray(raw)
    ? Object.fromEntries(raw.filter((n) => n && n.id).map((n) => [String(n.id), n]))
    : raw;
  const settledById = new Map(r.settled.map((s) => [s.id, s]));
  const bySeq = (a, b) => (nodes[a].seq ?? 0) - (nodes[b].seq ?? 0) || a.localeCompare(b);

  const children = {};
  for (const [id, n] of Object.entries(nodes)) {
    if (!n) continue;
    const p = n.parent && n.parent !== id && nodes[n.parent] ? n.parent : null;
    (children[p || ""] ||= []).push(id);
  }
  for (const list of Object.values(children)) list.sort(bySeq);

  // One slide per top-level decision: its settled subtree, depth first. No settled node, no slide.
  const decisions = [];
  for (const top of children[""] || []) {
    const items = [];
    const walk = (id, depth, seen) => {
      if (seen.has(id)) return;
      seen.add(id);
      const s = settledById.get(id);
      if (s) items.push({ ...s, depth, source: SOURCE[s.how] || "" });
      for (const c of children[id] || []) walk(c, depth + 1, seen);
    };
    walk(top, 0, new Set());
    if (items.length) decisions.push({ id: top, title: nodes[top].title || top, items });
  }

  const actions = r.settled.filter((s) => looksLikeAction(s.title) || looksLikeAction(s.answer));
  let next = actions, nextFrom = "actions";
  if (!next.length) {
    const rounds = r.settled.map((s) => s.round).filter((x) => x != null);
    const last = rounds.length ? Math.max(...rounds) : null;
    next = last == null ? r.settled.slice(-6) : r.settled.filter((s) => s.round === last);
    nextFrom = "last-round";
  }

  return {
    topic: r.topic, summary: r.summary, status: r.status, rounds: r.rounds,
    date: day(r.endedAt || r.printedAt), generated: day(r.printedAt),
    totals: { settled: r.totals.settled, dropped: r.totals.dropped + r.totals.pruned, open: r.totals.open + r.totals.waiting },
    decisions,
    dropped: r.dropped.map((d) => ({ ...d })),
    pruned: r.pruned.map((p) => p.title),
    next: next.map((s) => ({ ...s, source: SOURCE[s.how] || "" })),
    nextFrom,
  };
}

// `treeHtml` is the snapshot page (self-contained); it goes in an iframe so the tree is drawn by the same code as the live page.
export function deckHtml(d, treeHtml) {
  const slides = [];
  const add = (cls, body) => slides.push({ cls, body });
  const counts = [
    `${d.rounds} round${d.rounds === 1 ? "" : "s"}`,
    `${d.totals.settled} decision${d.totals.settled === 1 ? "" : "s"} settled`,
    `${d.totals.dropped} dropped`,
    d.totals.open ? `${d.totals.open} still open` : null,
  ].filter(Boolean);

  add("s-title", `  <p class="eyebrow">Decision deck</p>
  <h1>${esc(d.topic)}</h1>
  ${d.summary ? `<p class="summary">${esc(d.summary)}</p>` : ""}
  <ul class="facts">${counts.map((c) => `<li>${esc(c)}</li>`).join("")}</ul>
  <p class="date">${esc(d.date)}</p>`);

  add("s-tree", `  <header><h2>The decision tree</h2><p class="hint">${esc(String(d.totals.settled))} settled, ${esc(String(d.totals.dropped))} dropped. Drag to pan, scroll to zoom, click a card for details.</p></header>
  <iframe class="tree" title="Decision tree" sandbox="allow-scripts allow-same-origin" srcdoc="${esc(treeHtml)}"></iframe>`);

  const item = (s) => `<li class="d lvl-${Math.min(s.depth ?? 0, 3)}">
      <div class="dt">${esc(s.title)}</div>
      <div class="da">${esc(s.answer || "Settled")}</div>
      ${s.source ? `<span class="how how-${esc(s.how)}">${esc(s.source)}</span>` : ""}
    </li>`;

  for (const dec of d.decisions) {
    add("s-decision", `  <header><p class="eyebrow">Decision</p><h2>${esc(dec.title)}</h2></header>
  <ul class="list ${dec.items.length > 6 ? "long" : ""}">${dec.items.map(item).join("")}</ul>`);
  }

  if (d.dropped.length || d.pruned.length) {
    add("s-dropped", `  <header><p class="eyebrow">Out of scope</p><h2>Dropped decisions</h2></header>
  <ul class="list ${d.dropped.length > 6 ? "long" : ""}">${d.dropped.map((x) => `<li class="d">
      <div class="dt strike">${esc(x.title)}</div>
      <div class="da why">${esc(x.reason || "No reason given")}</div>
    </li>`).join("")}</ul>
  ${d.pruned.length ? `<p class="note">Also dropped with their parent: ${d.pruned.map(esc).join("; ")}.</p>` : ""}`);
  }

  add("s-next", `  <header><p class="eyebrow">${d.nextFrom === "actions" ? "Actions decided" : "Latest decisions"}</p><h2>Next steps</h2></header>
  ${d.next.length ? `<ol class="list steps ${d.next.length > 6 ? "long" : ""}">${d.next.map((s) => `<li class="d">
      <div class="dt">${esc(s.title)}</div>
      <div class="da">${esc(s.answer || "Settled")}</div>
      ${s.source ? `<span class="how how-${esc(s.how)}">${esc(s.source)}</span>` : ""}
    </li>`).join("")}</ol>` : `<p class="note">Nothing settled yet.</p>`}`);

  const n = slides.length;
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Deck: ${esc(d.topic)}</title>
<style>
/* Slides are 1280×720 px (13.333 × 7.5 in at 96 dpi), scaled to the window on screen, one per page in print. */
:root { --desk: #E6E9ED; --paper: #FFFFFF; --ink: #1B1F24; --muted: #5D6A77; --line: #D3D9DF; --soft: #F3F5F7;
  --green: #11795A; --red: #B0443A; --blue: #2E4BDB; --amber: #9A6400; color-scheme: light; }
* { box-sizing: border-box; }
html, body { height: 100%; margin: 0; }
body { background: var(--desk); color: var(--ink); font: 16px/1.45 "IBM Plex Sans", "Segoe UI", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif; overflow: hidden; }
.deck { position: fixed; inset: 0; }
.stage { width: 1280px; height: 720px; position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); transform-origin: center center; background: var(--paper); box-shadow: 0 1px 2px rgba(0,0,0,.08), 0 14px 40px rgba(0,0,0,.14); }
.slide { position: absolute; inset: 0; padding: 56px 72px 64px; visibility: hidden; display: flex; flex-direction: column; gap: 20px; overflow: hidden; }
.slide.current { visibility: visible; }
.slide::after { content: attr(data-n) " / ${n}"; position: absolute; right: 36px; bottom: 22px; font: 500 12px ui-monospace, "SFMono-Regular", Menlo, monospace; color: var(--muted); letter-spacing: .06em; }
.slide::before { content: "${esc(d.topic).replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"; position: absolute; left: 36px; bottom: 22px; right: 140px; font: 500 12px ui-monospace, "SFMono-Regular", Menlo, monospace; color: var(--muted); letter-spacing: .06em; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.s-title::before { content: none; }
header { display: grid; gap: 4px; }
.eyebrow { margin: 0; font: 500 12px ui-monospace, "SFMono-Regular", Menlo, monospace; letter-spacing: .14em; text-transform: uppercase; color: var(--muted); }
h1 { margin: 10px 0 0; font-size: 50px; line-height: 1.1; font-weight: 650; letter-spacing: -.01em; text-wrap: balance; overflow-wrap: anywhere; max-width: 1000px; }
h2 { margin: 0; font-size: 34px; line-height: 1.15; font-weight: 650; letter-spacing: -.01em; text-wrap: balance; overflow-wrap: anywhere; }
.hint { margin: 0; color: var(--muted); font-size: 14px; }
.s-title { justify-content: center; }
.summary { margin: 6px 0 0; font-size: 21px; color: var(--muted); max-width: 900px; overflow-wrap: anywhere; }
.facts { list-style: none; margin: 28px 0 0; padding: 0; display: flex; flex-wrap: wrap; gap: 10px; }
.facts li { border: 1px solid var(--line); border-radius: 999px; padding: 6px 14px; font-size: 15px; font-variant-numeric: tabular-nums; }
.date { margin: 36px 0 0; font: 500 13px ui-monospace, "SFMono-Regular", Menlo, monospace; color: var(--muted); letter-spacing: .08em; }
.s-tree { padding: 40px 48px 56px; gap: 12px; }
.tree { flex: 1; width: 100%; border: 1px solid var(--line); border-radius: 6px; background: var(--soft); }
.list { list-style: none; margin: 0; padding: 0; display: grid; gap: 14px; align-content: start; overflow: hidden; }
.list.long { display: block; column-count: 2; column-gap: 48px; }
.list.long .d { break-inside: avoid; margin-bottom: 14px; }
.steps { counter-reset: step; }
.d { display: grid; grid-template-columns: minmax(0, 1fr) auto; grid-template-areas: "t how" "a how"; column-gap: 16px; row-gap: 2px; align-items: start;
  padding: 10px 14px; border: 1px solid var(--line); border-radius: 6px; background: var(--paper); }
.steps .d { grid-template-columns: 28px minmax(0, 1fr) auto; grid-template-areas: "n t how" "n a how"; }
.steps .d::before { counter-increment: step; content: counter(step); grid-area: n; font: 600 15px ui-monospace, "SFMono-Regular", Menlo, monospace; color: var(--blue); line-height: 1.5; }
.lvl-1 { margin-left: 28px; } .lvl-2 { margin-left: 56px; } .lvl-3 { margin-left: 84px; }
.list.long .lvl-1, .list.long .lvl-2, .list.long .lvl-3 { margin-left: 0; }
.dt { grid-area: t; font-weight: 600; font-size: 17px; line-height: 1.3; overflow-wrap: anywhere; }
.da { grid-area: a; color: var(--ink); font-size: 15px; line-height: 1.4; overflow-wrap: anywhere; display: -webkit-box; -webkit-line-clamp: 4; -webkit-box-orient: vertical; overflow: hidden; }
.long .da { font-size: 14px; -webkit-line-clamp: 3; }
.how { grid-area: how; align-self: start; font: 500 10.5px ui-monospace, "SFMono-Regular", Menlo, monospace; letter-spacing: .06em; text-transform: uppercase; border: 1px solid currentColor; border-radius: 3px; padding: 2px 6px; white-space: nowrap; }
.how-accepted { color: var(--green); } .how-own { color: var(--blue); } .how-chat { color: var(--muted); } .how-found { color: var(--amber); }
.strike { text-decoration: line-through; text-decoration-color: var(--red); color: var(--muted); }
.why { color: var(--red); }
.note { margin: 0; color: var(--muted); font-size: 14px; overflow-wrap: anywhere; }
.nav { position: fixed; left: 50%; bottom: 10px; transform: translateX(-50%); display: flex; gap: 6px; align-items: center; }
.nav button { font: 500 12px ui-monospace, "SFMono-Regular", Menlo, monospace; padding: 5px 12px; border: 1px solid var(--line); background: var(--paper); color: var(--ink); border-radius: 4px; cursor: pointer; }
.nav button:hover { border-color: var(--ink); }
.nav button:focus-visible { outline: 2px solid var(--blue); outline-offset: 2px; }
.nav .count { font: 500 12px ui-monospace, "SFMono-Regular", Menlo, monospace; color: var(--muted); min-width: 56px; text-align: center; font-variant-numeric: tabular-nums; }
@page { size: 13.333in 7.5in; margin: 0; }
@media print {
  html, body { height: auto; overflow: visible; background: #fff; }
  .deck { position: static; }
  .stage { position: static; transform: none !important; box-shadow: none; width: auto; height: auto; }
  .slide { position: relative; visibility: visible; width: 1280px; height: 720px; break-after: page; page-break-after: always; }
  .slide:last-child { break-after: auto; page-break-after: auto; }
  .nav { display: none; }
}
</style>
</head>
<body>
<div class="deck" id="deck">
  <div class="stage" id="stage" data-slides="${n}">
${slides.map((s, i) => `<section class="slide ${s.cls}" data-n="${i + 1}">\n${s.body}\n</section>`).join("\n")}
  </div>
</div>
<div class="nav" role="group" aria-label="Slides">
  <button type="button" id="prev" aria-label="Previous slide">←</button>
  <span class="count" id="count" aria-live="polite">1 / ${n}</span>
  <button type="button" id="next" aria-label="Next slide">→</button>
  <button type="button" id="print" title="One page per slide">Print</button>
</div>
<script>
(() => {
  const slides = [...document.querySelectorAll(".slide")];
  const n = slides.length;
  let i = 0;
  const fromHash = () => { const m = location.hash.match(/^#(\\d+)$/); return m ? Math.min(n, Math.max(1, Number(m[1]))) - 1 : 0; };
  function show(k, push = true) {
    i = Math.min(n - 1, Math.max(0, k));
    slides.forEach((s, j) => s.classList.toggle("current", j === i));
    document.getElementById("count").textContent = (i + 1) + " / " + n;
    if (push && location.hash !== "#" + (i + 1)) history.replaceState(null, "", "#" + (i + 1));
  }
  function fit() {
    const k = Math.min((innerWidth - 32) / 1280, (innerHeight - 72) / 720);
    document.getElementById("stage").style.transform = "translate(-50%, -50%) scale(" + k + ")";
  }
  addEventListener("resize", fit);
  addEventListener("hashchange", () => show(fromHash(), false));
  const keys = (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if (["ArrowRight", "ArrowDown", "PageDown", " ", "Enter"].includes(e.key)) { e.preventDefault(); show(i + 1); }
    else if (["ArrowLeft", "ArrowUp", "PageUp", "Backspace"].includes(e.key)) { e.preventDefault(); show(i - 1); }
    else if (e.key === "Home") { e.preventDefault(); show(0); }
    else if (e.key === "End") { e.preventDefault(); show(n - 1); }
  };
  addEventListener("keydown", keys);
  // The tree keeps the focus after a pan or a click on a card: its keys still move the deck.
  for (const f of document.querySelectorAll("iframe")) {
    const hook = () => { try { f.contentWindow.addEventListener("keydown", keys); } catch (_) {} };
    f.addEventListener("load", hook);
    hook();
  }
  // Click the left quarter of a slide to go back, anywhere else to go forward. The tree slide pans instead; use the keys or the buttons there.
  document.getElementById("deck").addEventListener("click", (e) => {
    if (e.target.closest("a, button, iframe")) return;
    show(e.clientX < innerWidth / 4 ? i - 1 : i + 1);
  });
  document.getElementById("prev").onclick = () => show(i - 1);
  document.getElementById("next").onclick = () => show(i + 1);
  document.getElementById("print").onclick = () => print();
  fit();
  show(fromHash(), false);
})();
</script>
</body>
</html>
`;
}
