// HTML for every screen. Server-rendered strings, no framework, no client JS needed.
import { levelRank } from './parse.js';
import { todayScore, nextFix, firstDate, portfolio, isoStatus, coverage } from './model.js';

// ---------- helpers ----------

export const esc = (s = '') => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
/** Escaped inline markdown: **bold**, `code`. */
const md = (s = '') => esc(s).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/`([^`]+)`/g, '<code>$1</code>');
const cap = (s = '') => s.charAt(0).toUpperCase() + s.slice(1);
const plural = (n, one, many = one + 's') => `${n} ${n === 1 ? one : many}`;

const tag = (score, withLevel = true) => score
  ? `<span class="tag ${score.level}">${withLevel ? `${score.level.toUpperCase()} · ` : ''}${score.label}</span>`
  : '<span class="muted">—</span>';
const statusTag = (s) => `<span class="tag ${s === 'in place' ? 'low' : s === 'planned' ? 'medium' : 'none'}">${esc(s === 'none' ? 'no control' : s).toUpperCase()}</span>`;

/** Short title for a risk: the part before " through " / " because ", trimmed. */
export function shortTitle(r) {
  const t = r.detail?.title || r.scenario || r.id;
  const cut = t.split(/\s+(?:through|because|via)\s+/i)[0];
  return cut.length > 90 ? cut.slice(0, 87).replace(/\s+\S*$/, '') + '…' : cut;
}

const section = (n, label, right = '', body = '') => `
<section class="sec">
  <header class="sec-head"><span class="num">${n}</span><h2>${label}</h2>${right ? `<span class="eyebrow right">${right}</span>` : ''}</header>
  ${body}
</section>`;

const logo = `<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M4 2h11l5 5v15H4z" fill="var(--accent)"/><path d="M15 2v5h5" fill="var(--accent-ink)"/><path d="M8 12h8M8 15.5h8M8 19h5" stroke="var(--on-solid)" stroke-width="1.6"/></svg>`;

// ---------- layout ----------

export function layout({ title, active, data, repo, body, crumbs = '', account = '' }) {
  const nav = [
    ['/', 'Portfolio', 'portfolio', ''],
    ['/risks', 'Risks', 'risks', data.risks.length],
    ['/frameworks', 'Frameworks', 'frameworks', data.context.frameworks.length],
  ];
  const sync = repo.git
    ? `<span class="sync"><i class="dot ${repo.dirty ? 'warn' : ''}"></i>${repo.dirty ? 'UNCOMMITTED CHANGES' : 'COMMITTED'} · ${esc(repo.hash)} · ${esc(repo.ago.toUpperCase())}</span>`
    : '<span class="sync"><i class="dot off"></i>LOCAL FOLDER · NOT A GIT REPO</span>';
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)} · Plainfile</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600&family=Geist+Mono:wght@400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/style.css">
</head>
<body>
<div class="app">
  <aside class="side">
    <a class="brand" href="/">${logo}<span>Plainfile</span></a>
    <div class="repo"><svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><circle cx="6" cy="5" r="2"/><circle cx="6" cy="19" r="2"/><circle cx="18" cy="8" r="2"/><path d="M6 7v10M18 10c0 4-6 3-12 7"/></svg><div><div class="repo-name">${esc(repo.name || data.context.org)}</div><div class="branch">${esc(repo.branch || 'local folder')}</div></div></div>
    <div class="eyebrow nav-label">Workspace</div>
    <nav>${nav.map(([href, label, key, n]) => `<a href="${href}" class="${active === key ? 'on' : ''}">${label}${n !== '' ? `<span>${n}</span>` : ''}</a>`).join('')}</nav>
    <div class="eyebrow nav-label">In the repo</div>
    <nav class="quiet">
      <span>Policies<span>${data.counts.policies}</span></span>
      <span>Evidence<span>${data.counts.evidence}</span></span>
      <span>Decision traces<span>${data.counts.traces}</span></span>
    </nav>
    <div class="side-foot eyebrow">Read-only · v1</div>
  </aside>
  <div class="main">
    <header class="top">
      <div class="crumbs">${crumbs}</div>
      ${sync}
      ${repo.web ? `<a class="btn" href="${esc(repo.web)}" rel="noopener">View in ${/gitlab/.test(repo.web) ? 'GitLab' : 'GitHub'}</a>` : ''}
      ${account}
    </header>
    <main class="page">${body}</main>
    <script>addEventListener('message',function(e){var h=e.data&&e.data.plainfileHeight;if(typeof h!=='number'||h<100||h>6000)return;document.querySelectorAll('iframe.attack').forEach(function(f){if(f.contentWindow===e.source)f.style.height=h+'px'})})</script>
  </div>
</div>
</body>
</html>`;
}

// ---------- heat map ----------

function heatmap(grid, { link = true, small = false } = {}) {
  const rows = [];
  for (let g = 4; g >= 1; g--) {
    const cells = [];
    for (let v = 1; v <= 4; v++) {
      const c = grid[`${g}${v}`];
      const level = levelOf(g, v);
      const parts = [];
      if (c.today.length) parts.push(`<b>●${small ? '' : ' ' + c.today.length}</b>`);
      if (c.after.length) parts.push(`<span>○${small ? '' : ' ' + c.after.length}</span>`);
      const title = [c.today.length && `Today: ${c.today.join(', ')}`, c.after.length && `After fixes: ${c.after.join(', ')}`].filter(Boolean).join(' · ');
      const inner = parts.join(' ') || '&nbsp;';
      cells.push(link && (c.today.length || c.after.length)
        ? `<a class="cell ${level}" href="/risks?cell=G${g}V${v}" title="${esc(title)}">${inner}</a>`
        : `<div class="cell ${level}" title="${esc(title)}">${inner}</div>`);
    }
    rows.push(`<div class="axis">G${g}</div>${cells.join('')}`);
  }
  return `<div class="heat ${small ? 'small' : ''}">${rows.join('')}<div></div>${[1, 2, 3, 4].map((v) => `<div class="axis x">V${v}</div>`).join('')}</div>
<div class="heat-key eyebrow"><span>Severity ↑ · Likelihood →</span><span>● today · ○ after fixes</span></div>
<div class="legend"><span><i class="sw high"></i>High</span><span><i class="sw medium"></i>Medium</span><span><i class="sw low"></i>Low</span></div>`;
}
const levelOf = (g, v) => ((g >= 3 && v >= 3) || (g === 4 && v >= 2) ? 'high' : g <= 2 && v <= 2 ? 'low' : 'medium');

// ---------- coverage bars ----------

function coverageBar(cov) {
  return `<div class="bar" role="img" aria-label="${cov.inPlace} in place, ${cov.planned} planned, ${cov.none} with no control yet"><i class="low" style="width:${cov.pctInPlace}%"></i><i class="medium" style="width:${cov.pctPlanned}%"></i></div>`;
}
const coverageLegend = '<div class="legend"><span><i class="sw low"></i>In place</span><span><i class="sw medium"></i>Planned</span><span><i class="sw none"></i>No control in any risk yet</span></div>';

function frameworkRows(data, frameworks) {
  const iso = isoStatus(data.risks);
  return data.context.frameworks.map((f) => {
    const fw = frameworks[f.id];
    if (!fw) return `<div class="cov"><div class="cov-head"><span>${esc(f.label)}</span><span class="muted mono">no mapping file</span></div></div>`;
    const cov = coverage(fw, iso);
    return `<a class="cov" href="/frameworks/${fw.id}">
      <div class="cov-head"><span>${esc(f.label)} <span class="muted">· ${plural(cov.total, fw.pivot ? 'control' : 'clause')}</span></span><span class="mono">${cov.pctInPlace}% <span class="muted">+${cov.pctPlanned}%</span></span></div>
      ${coverageBar(cov)}
    </a>`;
  }).join('');
}

// ---------- screens ----------

export function portfolioPage(data, frameworks) {
  const p = portfolio(data);
  const { context } = data;
  const fwNames = context.frameworks.map((f) => f.label.replace(/\s*\(.*\)|:\d{4}/g, '').toUpperCase());
  const headline = p.above.length
    ? `${plural(p.above.length, 'risk sits', 'risks sit')} above appetite`
    : 'Every risk sits within appetite';
  const verdict = p.above.length
    ? (p.dropping.length === p.above.length ? `All ${p.dropping.length === 1 ? 'of it drops' : p.dropping.length + ' drop'} within appetite once the planned fixes land.` : `${p.dropping.length} of ${p.above.length} drop within appetite once the planned fixes land.`)
    : 'Nothing to escalate today.';

  const rows = p.above.map((r) => {
    const fix = nextFix(r);
    return `<tr>
      <td class="mono"><a href="/risks/${esc(r.id)}">${esc(r.id)}</a></td>
      <td><a href="/risks/${esc(r.id)}">${esc(shortTitle(r))}</a></td>
      <td>${esc(r.owner)}</td>
      <td>${tag(todayScore(r))}</td>
      <td>${tag(r.residual)}</td>
      <td>${fix ? esc(fix.control.split(/[:(;]/)[0].trim()) : r.controls?.length ? `<span class="muted">Controls </span><span class="mono">${esc(r.controls.join(', '))}</span>` : '<span class="muted">No plan yet</span>'}</td>
      <td class="mono">${esc(firstDate(fix?.due) || firstDate(r.due) || '—')}</td>
    </tr>`;
  }).join('');

  return `
<div class="eyebrow accent">PORTFOLIO · ${esc(context.org.toUpperCase())}${fwNames.length ? ' · ' + esc(fwNames.join(' · ')) : ''}</div>
<h1>${esc(headline)}<br><span class="accent">${esc(verdict)}</span></h1>

${section('01', 'This quarter', 'FROM grc/risk-register.md', `
<div class="stats">
  <div><b>${p.open.length}</b><span>Open risks · ${data.risks.length} in the register</span></div>
  <div><b class="${p.above.length ? 'c-high' : ''}">${p.above.length}</b><span>Above appetite (${esc(context.appetite)} max)</span></div>
  <div><b>${p.dropping.length}</b><span>Back within appetite after planned fixes</span></div>
  <div><b class="${p.overdue.length ? 'c-high' : p.dueSoon.length ? 'c-medium' : ''}">${p.dueSoon.length}</b><span>Due in the next 30 days${p.overdue.length ? ` · ${p.overdue.length} overdue` : ''}</span></div>
</div>`)}

<div class="two">
  ${section('02', 'Heat map', '', heatmap(p.grid))}
  ${section('03', 'Framework coverage', 'FROM frameworks/*.md', `${frameworkRows(data, frameworks)}${coverageLegend}<p class="note">Read from the controls your risks put in place or plan. A clause counts as in place when any ISO 27001 control it maps to is in place.</p>`)}
</div>

${section('04', 'Above appetite', `${p.above.length} OF ${data.risks.length}`, p.above.length ? `
<div class="scroll"><table>
  <thead><tr><th>ID</th><th>Risk</th><th>Owner</th><th>Today</th><th>After fixes</th><th>Next fix</th><th>Due</th></tr></thead>
  <tbody>${rows}</tbody>
</table></div>` : '<p class="muted">No risk above appetite.</p>')}`;
}

export function risksPage(data, { cell } = {}) {
  let risks = [...data.risks];
  let filter = '';
  const m = /^G([1-4])V([1-4])$/.exec(cell || '');
  if (m) {
    const g = Number(m[1]); const v = Number(m[2]);
    risks = risks.filter((r) => { const t = todayScore(r); return (t && t.g === g && t.v === v) || (r.residual && r.residual.g === g && r.residual.v === v); });
    filter = `<p class="filter">Showing risks today or after fixes at <span class="mono">G${g}·V${v}</span> · <a href="/risks">show all</a></p>`;
  }
  risks.sort((a, b) => levelRank(todayScore(b)?.level) - levelRank(todayScore(a)?.level) || a.id.localeCompare(b.id));
  const rows = risks.map((r) => `<tr>
    <td class="mono"><a href="/risks/${esc(r.id)}">${esc(r.id)}</a></td>
    <td><a href="/risks/${esc(r.id)}">${esc(shortTitle(r))}</a><div class="sub">${esc(r.asset || '')}</div></td>
    <td>${esc(r.owner)}</td>
    <td>${tag(r.inherent)}</td>
    <td>${tag(r.residual)}</td>
    <td>${esc(cap(r.treatment || ''))}</td>
    <td>${esc(r.status)}</td>
    <td class="mono">${esc(firstDate(r.due) || '—')}</td>
  </tr>`).join('');
  return `
<div class="eyebrow accent">RISKS · ${esc(data.context.org.toUpperCase())}</div>
<h1>${plural(data.risks.length, 'risk')} in the register<br><span class="accent">Sorted by today's level.</span></h1>
${section('01', 'Register', 'FROM grc/risk-register.md', `${filter}
<div class="scroll"><table>
  <thead><tr><th>ID</th><th>Risk</th><th>Owner</th><th>Inherent</th><th>Residual</th><th>Treatment</th><th>Status</th><th>Due</th></tr></thead>
  <tbody>${rows}</tbody>
</table></div>`)}`;
}

export function riskPage(data, r, history, repo) {
  const d = r.detail;
  const appetite = data.context.appetite;
  const t = todayScore(r);
  const closed = t === r.residual && r.residual && t !== r.inherent;
  const verdict = !t ? 'Not scored yet.'
    : r.residual && !closed && r.residual.level !== t.level ? `${cap(t.level)} today, ${r.residual.level} after fixes.`
    : `${cap(t.level)}${closed ? ', treated' : ' today'}.`;
  const within = (s) => (s && levelRank(s.level) > levelRank(appetite) ? 'above appetite' : 'within appetite');

  // In short: the risk file's executive summary when it has one, else built from the register.
  const fix = nextFix(r);
  const planned = (d?.controls || []).filter((c) => c.status === 'planned');
  const placed = (d?.controls || []).filter((c) => c.status === 'in place');
  const summary = d?.summary?.length ? d.summary : [
    { label: 'What could happen', text: r.scenario || d?.title || '' },
    { label: 'Where we stand', text: t ? `${cap(r.inherent?.level || t.level)} (${(r.inherent || t).label}) today, ${within(r.inherent || t)}${r.residual ? ` → ${r.residual.level} (${r.residual.label}) after fixes, ${within(r.residual)}` : ''}.` : 'Not scored yet.' },
    ...(planned.length ? [{ label: 'What we need', text: `${plural(planned.length, 'fix', 'fixes')} planned${fix ? `, the first by ${firstDate(fix.due) || 'a date to set'}: ${fix.control.split(/[:(]/)[0].trim()}` : ''}. ${plural(placed.length, 'protection')} already in place.` }] : []),
  ];

  const controls = d?.controls || [];
  const fwCols = [...new Set(controls.flatMap((c) => Object.keys(c.refs)))];
  const controlRows = controls.map((c) => `<tr>
    <td>${md(c.control)}</td>
    <td class="mono">${esc(c.iso.join(', ') || '—')}</td>
    ${fwCols.map((k) => `<td class="mono">${esc(c.refs[k] || '—')}</td>`).join('')}
    <td class="mono">${esc(firstDate(c.due) || '—')}</td>
    <td>${statusTag(c.status)}</td>
  </tr>`).join('');

  const grid = {};
  for (let g = 1; g <= 4; g++) for (let v = 1; v <= 4; v++) grid[`${g}${v}`] = { today: [], after: [] };
  if (r.inherent) grid[`${r.inherent.g}${r.inherent.v}`].today.push(r.id);
  if (r.residual) grid[`${r.residual.g}${r.residual.v}`].after.push(r.id);

  const fileLink = (path, label) => path ? `<a href="/file/${esc(path)}">${esc(label || path)}</a>` : '—';
  const details = [
    ['Inherent', tag(r.inherent)],
    ['Residual', tag(r.residual)],
    ['Appetite', esc(cap(appetite))],
    ['Treatment', esc(cap(r.treatment || '—'))],
    ['Status', esc(r.status || d?.status || '—')],
    ['Asset', esc(r.asset || '—')],
    ['Method', 'EBIOS RM · ISO 27005'],
    ['Report', d?.report ? fileLink(d.report, 'Full report') : '—'],
    ['Decisions', d?.trace ? fileLink(d.trace.replace(/^\.\.\//, ''), 'Grill trace') : (r.trace && r.trace !== '—' ? fileLink(r.trace, 'Grill trace') : '—')],
  ];

  const commitLink = (h) => repo.web ? `<a class="mono" href="${esc(repo.web)}/commit/${esc(h)}" rel="noopener">${esc(h)}</a>` : `<span class="mono accent">${esc(h)}</span>`;
  const historyHtml = history.length
    ? history.map((c) => `<div class="hist">${commitLink(c.hash)}<div><div>${esc(c.subject)}</div><div class="muted">${esc(c.author)} · ${esc(c.ago)}</div></div></div>`).join('')
    : `<p class="muted">${repo.git ? 'Not committed yet.' : 'Not a git repo: no history.'}</p>`;

  const owner = r.owner || d?.owner || '—';
  return `
<div class="eyebrow accent">RISK · ${esc(r.id)} · OWNER ${esc(owner.toUpperCase())} · DUE ${esc(firstDate(r.due || d?.due) || '—')}</div>
<h1>${esc(shortTitle(r))}<br><span class="accent">${esc(verdict)}</span></h1>
<div class="inshort">${summary.map((s) => `<div><span class="eyebrow">${esc(s.label)}</span><p>${md(s.text)}</p></div>`).join('')}</div>

${section('01', 'Attack path', d?.attackPath ? `<a href="/file/${esc(d.attackPath)}">OPEN FULL SIZE</a>` : '', d?.attackPath
  ? `<iframe class="attack" src="/file/${esc(d.attackPath)}" title="Attack path for ${esc(r.id)}" sandbox="allow-scripts" loading="lazy"></iframe>`
  : '<p class="muted">No attack path drawn yet. Run the risk-assessment skill on this risk to draw one.</p>')}

<div class="detail">
  <div>
    ${section('02', 'Scenario', '', d?.scenario?.length
      ? `<dl class="kv">${d.scenario.map((s) => `<dt class="eyebrow">${esc(s.label)}</dt><dd>${md(s.text)}</dd>`).join('')}</dl>`
      : `<p>${md(r.scenario || '')}</p><p class="muted">No risk file yet: this risk lives in the register only.</p>`)}
  </div>
  <aside>
    ${section('', 'Details', '', `<dl class="facts">${details.map(([k, v]) => `<dt class="eyebrow">${k}</dt><dd>${v}</dd>`).join('')}</dl>`)}
    ${section('', 'Score', '', `${heatmap(grid, { link: false, small: true })}${d?.scoreNote ? `<p class="note">${md(d.scoreNote)}</p>` : ''}`)}
    ${section('', 'History', 'GIT LOG', historyHtml)}
  </aside>
</div>
    ${section('03', 'Treatment', d ? esc(`grc/${d.file} § Treatment`) : 'FROM grc/risk-register.md', controls.length ? `
      ${d.treatmentWhy ? `<p class="lead">${md(d.treatmentWhy)}</p>` : ''}
      <div class="scroll"><table class="controls">
        <thead><tr><th>Protection</th><th>ISO 27001</th>${fwCols.map((k) => `<th>${esc(k)}</th>`).join('')}<th>Due</th><th>Status</th></tr></thead>
        <tbody>${controlRows}</tbody>
      </table></div>` : `<p>${esc(cap(r.treatment || 'No treatment set'))} with <span class="mono">${esc(r.controls.join(', ') || 'no control listed')}</span>.</p><p class="muted">The register names the controls; a risk file with the plan comes from the risk-assessment skill.</p>`)}`;
}

export function frameworksPage(data, frameworks) {
  const inScope = new Set(data.context.frameworks.map((f) => f.id));
  const others = Object.values(frameworks).filter((f) => !inScope.has(f.id)).sort((a, b) => a.name.localeCompare(b.name));
  return `
<div class="eyebrow accent">FRAMEWORKS · ${esc(data.context.org.toUpperCase())}</div>
<h1>${plural(data.context.frameworks.length, 'framework')} in scope<br><span class="accent">ISO 27001 is the pivot; the others map to it.</span></h1>
${section('01', 'In scope', 'FROM grc/context.md', `${frameworkRows(data, frameworks)}${coverageLegend}`)}
${section('02', 'Also mapped', 'NOT IN SCOPE', `<div class="chips">${others.map((f) => `<a href="/frameworks/${f.id}">${esc(f.name.split(',')[0])}</a>`).join('')}</div>`)}`;
}

export function frameworkPage(data, fw) {
  const cov = coverage(fw, isoStatus(data.risks));
  const rows = cov.clauses.map((c) => `<tr>
    <td class="mono">${esc(c.clause)}</td>
    <td>${esc(c.requirement)}${c.fit === 'partial' ? ' <span class="tag none">PARTIAL FIT</span>' : ''}</td>
    ${fw.pivot ? '' : `<td class="mono wrap">${esc(c.iso.join(', '))}</td>`}
    <td>${statusTag(c.status)}</td>
    <td class="mono wrap">${c.risks.map((id) => `<a href="/risks/${esc(id)}">${esc(id)}</a>`).join(' ') || '—'}</td>
  </tr>`).join('');
  return `
<div class="eyebrow accent">FRAMEWORK · ${esc(fw.id.toUpperCase())} · ${esc((fw.status.split(',')[0] || '').toUpperCase())}${fw.checked ? ' · CHECKED ' + esc(fw.checked) : ''}</div>
<h1>${esc(fw.name)}<br><span class="accent">${cov.inPlace} of ${cov.total} ${fw.pivot ? 'controls' : 'clauses'} in place, ${cov.planned} planned.</span></h1>
${section('01', 'Coverage', `FROM frameworks/${esc(fw.id)}.md`, `${coverageBar(cov)}${coverageLegend}`)}
${section('02', fw.pivot ? 'Annex A controls' : 'Clauses', '', `<div class="scroll"><table>
  <thead><tr><th>${fw.pivot ? 'Ref' : 'Clause'}</th><th>${fw.pivot ? 'Control' : 'Requirement'}</th>${fw.pivot ? '' : '<th>ISO 27001</th>'}<th>Status</th><th>Risks</th></tr></thead>
  <tbody>${rows}</tbody>
</table></div>`)}`;
}

export function notFoundPage(what) {
  return `<div class="eyebrow accent">NOT FOUND</div><h1>${esc(what)}<br><span class="accent">Nothing in the repo by that name.</span></h1><p><a href="/">Back to the portfolio</a></p>`;
}

// ---------- SaaS pages (no workspace sidebar) ----------

export function shell({ title, body, account = '' }) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600&family=Geist+Mono:wght@400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/style.css">
</head>
<body>
<header class="top bare"><a class="brand" href="/">${logo}<span>Plainfile</span></a><span class="grow"></span>${account}</header>
<main class="page narrow">${body}</main>
</body>
</html>`;
}

export function accountBar(user) {
  if (!user) return '';
  return `<span class="who">${user.avatar ? `<img src="${esc(user.avatar)}&s=48" alt="" width="22" height="22">` : ''}${esc(user.login)}</span>
<a class="btn" href="/app">Repos</a>
<form method="post" action="/auth/logout"><button class="btn" type="submit">Sign out</button></form>`;
}

export function landingPage({ configured, error }) {
  return shell({ title: 'Plainfile · GRC in plain files', body: `
<div class="eyebrow accent">PLAINFILE · GRC AS CODE</div>
<h1>Your risks, policies and evidence live in plain files.<br><span class="accent">Plainfile shows them to everyone who needs them.</span></h1>
${error ? `<p class="alert">${esc(error)}</p>` : ''}
<div class="cta">
  ${configured ? '<a class="btn solid" href="/auth/login">Sign in with GitHub</a>' : '<span class="btn disabled" title="Set GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET">GitHub sign-in not configured</span>'}
  <a class="btn" href="/demo">See the demo workspace</a>
</div>
${section('01', 'How it works', '', `<div class="steps">
  <div><span class="eyebrow accent">01</span><h3>Your repo is the database</h3><p>The <code>grc/</code> folder of markdown files stays in your own GitHub repo. Nothing is copied into Plainfile.</p></div>
  <div><span class="eyebrow accent">02</span><h3>Claude does the work</h3><p>The GRC skills write risks, attack paths, policies and decision traces into that folder, as commits.</p></div>
  <div><span class="eyebrow accent">03</span><h3>Everyone sees the same truth</h3><p>CISOs, risk owners and auditors get the portfolio, the heat map and framework coverage, with git as the audit trail.</p></div>
</div>`)}
${section('02', 'What it reads', '', `<p class="lead">Plainfile only reads the repos you install it on, with your own GitHub permissions. Read-only today: edits as pull requests come next.</p>`)}` });
}

export function reposPage({ user, repos, installUrl }) {
  const rows = repos.map((r) => `<a class="repo-row" href="/w/${esc(r.full_name)}"><span class="mono">${esc(r.full_name)}</span><span class="muted">${r.private ? 'private' : 'public'} · ${esc(r.default_branch)}</span></a>`).join('');
  return shell({ title: 'Your repos · Plainfile', account: accountBar(user), body: `
<div class="eyebrow accent">WORKSPACES · ${esc(user.login.toUpperCase())}</div>
<h1>Pick the repo that holds your grc/ folder<br><span class="accent">${repos.length ? `${plural(repos.length, 'repo')} Plainfile can read.` : 'Install Plainfile on a repo to start.'}</span></h1>
${section('01', 'Repos', installUrl ? `<a href="${esc(installUrl)}" rel="noopener">ADD A REPO ON GITHUB</a>` : '', repos.length ? `<div class="repo-list">${rows}</div>` : `<p class="lead">Plainfile is not installed on any repo you can see yet.</p>${installUrl ? `<a class="btn solid" href="${esc(installUrl)}" rel="noopener">Install on GitHub</a>` : ''}`)}` });
}

export function pickDirPage({ user, fullName, dirs }) {
  return shell({ title: `${fullName} · Plainfile`, account: accountBar(user), body: `
<div class="eyebrow accent">WORKSPACE · ${esc(fullName.toUpperCase())}</div>
<h1>${dirs.length ? `${plural(dirs.length, 'grc/ folder')} in this repo` : 'No grc/ folder in this repo yet'}<br><span class="accent">${dirs.length ? 'Pick the one to open.' : 'Run the GRC skills to create one.'}</span></h1>
${dirs.length ? `<div class="repo-list">${dirs.map((d) => `<a class="repo-row" href="/w/${esc(fullName)}/d/${encodeURIComponent(d)}/"><span class="mono">${esc(d)}/</span></a>`).join('')}</div>`
    : '<p class="lead">Plainfile looks for a folder named <code>grc</code> holding <code>context.md</code> or <code>risk-register.md</code>. Install the skills with <code>npx skills add AnasSahel/agent-labs</code> and ask Claude to assess a risk.</p>'}
<p><a class="accent" href="/app">← All repos</a></p>` });
}

export function errorPage({ user, title, message }) {
  return shell({ title: `${title} · Plainfile`, account: accountBar(user), body: `<div class="eyebrow accent">ERROR</div><h1>${esc(title)}<br><span class="accent">${esc(message)}</span></h1><p><a class="accent" href="/app">← All repos</a></p>` });
}
