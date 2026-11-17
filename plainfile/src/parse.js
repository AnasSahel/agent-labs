// Reads a grc/ folder of markdown files into plain objects. No dependencies.
// The files stay the source of truth: this module only reads them.
import { readFile, readdir } from 'node:fs/promises';
import { join, basename } from 'node:path';

const LEVELS = ['low', 'medium', 'high'];

/** The one level rule from theme.md: high when G3+ with V3+, or G4 with V2+; low when both <= 2; medium otherwise. */
export function levelOf(g, v) {
  if ((g >= 3 && v >= 3) || (g === 4 && v >= 2)) return 'high';
  if (g <= 2 && v <= 2) return 'low';
  return 'medium';
}

export const levelRank = (level) => LEVELS.indexOf(level);

/** "G4·V3 high" -> { g: 4, v: 3, level: 'high', label: 'G4·V3' }. The level is recomputed, never trusted. */
export function parseScore(text = '') {
  const m = /G\s*([1-4])\s*[·.\-\s]?\s*V\s*([1-4])/i.exec(text);
  if (!m) return null;
  const g = Number(m[1]);
  const v = Number(m[2]);
  return { g, v, level: levelOf(g, v), label: `G${g}·V${v}` };
}

/** Every pipe table in a markdown string, as arrays of row objects keyed by header. */
export function parseTables(md) {
  const lines = md.split('\n');
  const tables = [];
  for (let i = 0; i < lines.length - 1; i++) {
    if (!isRow(lines[i]) || !/^\s*\|?\s*:?-{2,}/.test(lines[i + 1])) continue;
    const headers = cells(lines[i]);
    const rows = [];
    let j = i + 2;
    for (; j < lines.length && isRow(lines[j]); j++) {
      const c = cells(lines[j]);
      rows.push(Object.fromEntries(headers.map((h, k) => [h, c[k] ?? ''])));
    }
    tables.push({ headers, rows, line: i });
    i = j - 1;
  }
  return tables;
}
const isRow = (l) => /^\s*\|.*\|\s*$/.test(l);
const cells = (l) => l.trim().replace(/^\||\|$/g, '').split('|').map((c) => c.trim());

/** Split markdown into { title, intro, sections: { 'Scenario': '...' } } by H1 / H2. */
export function parseSections(md) {
  const out = { title: '', intro: '', sections: {} };
  let current = null;
  for (const line of md.split('\n')) {
    const h1 = /^#\s+(.+)/.exec(line);
    const h2 = /^##\s+(.+)/.exec(line);
    if (h1 && !out.title) { out.title = h1[1].trim(); continue; }
    if (h2) { current = h2[1].trim(); out.sections[current] = ''; continue; }
    if (current) out.sections[current] += line + '\n';
    else out.intro += line + '\n';
  }
  return out;
}

/** "- **Label**: text" bullets -> [{ label, text }]. */
export function parseLabelledBullets(text = '') {
  const items = [];
  for (const line of text.split('\n')) {
    const m = /^\s*[-*]\s+\*\*(.+?)\*\*\s*:?\s*(.*)$/.exec(line);
    if (m) items.push({ label: m[1].replace(/:$/, ''), text: m[2] });
  }
  return items;
}

export const isoRefs = (text = '') => [...new Set(text.match(/\bA\.\d+\.\d+\b|\b\d+\.\d+(?:\.\d+)?\b(?=[,)\s]|$)/g) || [])]
  .filter((r) => r.startsWith('A.') || /^(4|5|6|7|8|9|10)\./.test(r));

// ---------- grc/context.md ----------

const FRAMEWORK_ALIASES = [
  [/ISO\s*\/?\s*(IEC\s*)?27001/i, 'iso27001'], [/ISO\s*\/?\s*(IEC\s*)?27701/i, 'iso27701'],
  [/ISO\s*\/?\s*(IEC\s*)?22301/i, 'iso22301'], [/ISO\s*\/?\s*(IEC\s*)?42001/i, 'iso42001'],
  [/\bNIS\s*2\b/i, 'nis2'], [/\bDORA\b/i, 'dora'], [/\bGDPR\b|\bRGPD\b/i, 'gdpr'],
  [/AI\s*Act/i, 'ai-act'], [/\bCRA\b|Cyber\s*Resilience/i, 'cra'], [/NIST/i, 'nist-csf'],
  [/\bCIS\b/i, 'cis'], [/ANSSI/i, 'anssi-hygiene'], [/PCI/i, 'pci-dss'], [/SOC\s*2/i, 'soc2'], [/\bHDS\b/i, 'hds'],
];

export function parseContext(md) {
  const { title, intro, sections } = parseSections(md);
  const all = md;
  // Organisation name: "- **Name**: X" wins, else the H1 unless it is just "Context".
  const nameBullet = /\*\*Name\*\*\s*:\s*(.+)/.exec(all);
  const org = nameBullet ? nameBullet[1].trim() : (title && !/^context$/i.test(title) ? title : 'Your organisation');

  // Frameworks in scope: an inline "Frameworks in scope: a, b" line or a "## Frameworks in scope" list.
  let scopeText = '';
  const inline = /Frameworks in scope\s*:\s*(.+)/i.exec(all);
  if (inline) scopeText = inline[1];
  const sectionKey = Object.keys(sections).find((k) => /frameworks/i.test(k));
  if (sectionKey) scopeText += '\n' + sections[sectionKey];
  const frameworks = [];
  for (const line of scopeText.split(/\n|,|;/)) {
    for (const [re, id] of FRAMEWORK_ALIASES) {
      if (re.test(line) && !frameworks.some((f) => f.id === id)) frameworks.push({ id, label: line.replace(/^[\s\-*]+/, '').replace(/\*\*/g, '').replace(/\.$/, '').trim() });
    }
  }

  // Appetite: the highest level that may stay as residual without escalation. Default medium.
  let appetite = 'medium';
  const appetiteText = (sections[Object.keys(sections).find((k) => /appetite/i.test(k))] || '') + '\n' +
    ((/appetite\s*:\s*(.+)/i.exec(all) || [])[1] || '');
  const above = /above\s+"?(low|medium|high)"?/i.exec(appetiteText);
  if (above) appetite = above[1].toLowerCase();
  else if (/\*\*High\*\*\s*:\s*never accepted/i.test(appetiteText)) appetite = 'medium';

  return { org, frameworks, appetite, appetiteText: appetiteText.trim(), intro: intro.trim() };
}

// ---------- grc/risk-register.md ----------

const pick = (row, ...names) => {
  for (const n of names) {
    const key = Object.keys(row).find((k) => k.toLowerCase() === n.toLowerCase());
    if (key && row[key] && row[key] !== '—') return row[key];
  }
  return '';
};

export function parseRegister(md) {
  const table = parseTables(md).find((t) => t.headers.some((h) => /^id$/i.test(h)));
  if (!table) return [];
  return table.rows.filter((r) => pick(r, 'ID')).map((r) => ({
    id: pick(r, 'ID'),
    scenario: pick(r, 'Scenario', 'Risk', 'Title'),
    asset: pick(r, 'Asset'),
    owner: pick(r, 'Owner', 'Risk owner'),
    inherent: parseScore(pick(r, 'Inherent', 'Today')),
    treatment: pick(r, 'Treatment'),
    controls: isoRefs(pick(r, 'Controls (ISO 27001)', 'Controls', 'ISO 27001')),
    residual: parseScore(pick(r, 'Residual', 'After fixes')),
    status: pick(r, 'Status') || 'open',
    due: pick(r, 'Due', 'Target date'),
    updated: pick(r, 'Updated'),
    trace: pick(r, 'Trace'),
  }));
}

// ---------- grc/risks/R-xxx-*.md ----------

export function parseRiskFile(md) {
  const { title, intro, sections } = parseSections(md);
  const [idPart, ...rest] = title.split('·');
  const meta = {};
  for (const m of intro.matchAll(/\*\*(\w[\w ]*)\*\*\s+([^·\n]+)/g)) meta[m[1].toLowerCase()] = m[2].trim();

  const summaryKey = Object.keys(sections).find((k) => /executive summary|in short/i.test(k));
  const treatmentText = sections.Treatment || '';
  const controlTable = parseTables(treatmentText).find((t) => t.headers.some((h) => /control/i.test(h)));
  const planned = (controlTable?.rows || []).map((r) => ({
    n: pick(r, '#'),
    control: pick(r, 'Control', 'Protection'),
    due: pick(r, 'Due'),
    iso: isoRefs(pick(r, 'ISO 27001')),
    refs: Object.fromEntries(controlTable.headers.filter((h) => !/^(#|control|protection|due|iso 27001|status)$/i.test(h)).map((h) => [h, pick(r, h)])),
    status: /in place|done|implemented/i.test(pick(r, 'Status')) ? 'in place' : 'planned',
  }));
  // "Already in place: a (A.8.2), b (A.8.2)." -> controls in place with their refs.
  const inPlace = [];
  const already = /Already in place\s*:\s*(.+)$/m.exec(treatmentText);
  if (already) {
    const firstSentence = already[1].split(/\.\s+(?=[A-Z])/)[0];
    for (const part of firstSentence.split(/,\s*(?![^()]*\))/)) {
      const text = part.replace(/\.$/, '').trim();
      if (!text) continue;
      inPlace.push({ control: text.replace(/\s*\([^)]*\)\s*$/, '').replace(/^./, (c) => c.toUpperCase()), iso: isoRefs(text), status: 'in place', due: '', refs: {} });
    }
  }
  const treatmentLead = /\*\*(\w+)\.\*\*\s*(.*)/.exec(treatmentText);

  return {
    id: idPart.trim(),
    title: rest.join('·').trim() || idPart.trim(),
    owner: meta.owner || '',
    status: meta.status || '',
    due: meta.due || '',
    summary: parseLabelledBullets(sections[summaryKey]),
    scenario: parseLabelledBullets(sections.Scenario),
    scoreNote: (sections.Score || '').split('\n').filter((l) => l && !/^[|`\s]|^G\d|^\s+V/.test(l)).join(' ').trim(),
    treatmentWhy: treatmentLead ? treatmentLead[2].trim() : '',
    controls: [...planned, ...inPlace],
    trace: ((sections.Decisions || '').match(/`([^`]+\.md)`/) || [])[1] || '',
  };
}

// ---------- frameworks/*.md ----------

export function parseFramework(md, id) {
  const fm = {};
  const fmMatch = /^---\n([\s\S]*?)\n---/.exec(md);
  if (fmMatch) for (const l of fmMatch[1].split('\n')) { const m = /^(\w+):\s*(.*)$/.exec(l); if (m) fm[m[1]] = m[2]; }
  const tables = parseTables(md);
  if (id === 'iso27001') {
    const annex = tables.find((t, i) => i > 0 && t.rows.some((r) => /^A\./.test(r.Ref))) || { rows: [] };
    return {
      id, name: fm.name || id, status: fm.status || '', checked: fm.checked || '', pivot: true,
      clauses: annex.rows.filter((r) => /^A\./.test(r.Ref)).map((r) => ({ clause: r.Ref, requirement: r.Title, iso: [r.Ref], fit: 'full' })),
    };
  }
  const mapping = tables.find((t) => t.headers.includes('Clause') && t.headers.includes('ISO 27001')) || { rows: [] };
  return {
    id, name: fm.name || id, status: fm.status || '', checked: fm.checked || '', pivot: false,
    clauses: mapping.rows.map((r) => ({ clause: r.Clause, requirement: r.Requirement, iso: isoRefs(r['ISO 27001']), fit: r.Fit })),
  };
}

// ---------- the whole folder ----------

export async function loadFrameworks(dir) {
  const out = {};
  let files = [];
  try { files = (await readdir(dir)).filter((f) => f.endsWith('.md') && f !== 'README.md'); } catch { return out; }
  for (const f of files) {
    const id = basename(f, '.md');
    out[id] = parseFramework(await readFile(join(dir, f), 'utf8'), id);
  }
  return out;
}

/** Loads the whole grc/ folder from a source (see source.js): a local folder or a GitHub repo. */
export async function loadGrc(source) {
  const [contextMd, registerMd] = await Promise.all([source.read('context.md'), source.read('risk-register.md')]);
  if (contextMd === null && registerMd === null) {
    throw new Error(`No grc/ data found in ${source.label}: expected context.md or risk-register.md`);
  }
  const context = parseContext(contextMd || '');
  const register = parseRegister(registerMd || '');

  const riskFiles = await source.list('risks');
  const details = {};
  const mdFiles = riskFiles.filter((f) => f.endsWith('.md'));
  const texts = await Promise.all(mdFiles.map((f) => source.read(`risks/${f}`)));
  mdFiles.forEach((f, i) => {
    const d = parseRiskFile(texts[i] || '');
    d.file = `risks/${f}`;
    const attack = riskFiles.find((x) => x === `${d.id}-attack-path.html`);
    d.attackPath = attack ? `risks/${attack}` : '';
    const report = riskFiles.find((x) => x === f.replace(/\.md$/, '.html'));
    d.report = report ? `risks/${report}` : '';
    details[d.id] = d;
  });

  const risks = register.map((r) => ({ ...r, detail: details[r.id] || null }));
  // A risk file not yet in the register still shows up.
  for (const id of Object.keys(details)) if (!risks.some((r) => r.id === id)) risks.push({ id, scenario: details[id].title, owner: details[id].owner, status: details[id].status, due: details[id].due, controls: [], inherent: null, residual: null, detail: details[id] });

  const count = async (sub) => (await source.list(sub)).filter((f) => f.endsWith('.md')).length;
  return { context, risks, counts: { policies: await count('policies'), evidence: await count('evidence'), traces: await count('traces') } };
}
