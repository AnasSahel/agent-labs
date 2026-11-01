// Turns parsed files into what the screens show. Pure functions, no I/O.
import { levelRank } from './parse.js';

const CLOSED = /^(treated|closed|accepted|done)$/i;

/** Where a risk sits today: residual once treated, inherent while fixes are still planned. */
export function todayScore(r) {
  return CLOSED.test(r.status) ? (r.residual || r.inherent) : (r.inherent || r.residual);
}

export const firstDate = (s = '') => (/\d{4}-\d{2}-\d{2}/.exec(s) || [''])[0];

export function nextFix(r) {
  const planned = (r.detail?.controls || []).filter((c) => c.status !== 'in place');
  if (!planned.length) return null;
  return [...planned].sort((a, b) => (firstDate(a.due) || '9').localeCompare(firstDate(b.due) || '9'))[0];
}

export function portfolio(data) {
  const { risks, context } = data;
  const appetite = levelRank(context.appetite);
  const open = risks.filter((r) => !CLOSED.test(r.status));
  const above = risks
    .filter((r) => todayScore(r) && levelRank(todayScore(r).level) > appetite)
    .sort((a, b) => (todayScore(b).g * 4 + todayScore(b).v) - (todayScore(a).g * 4 + todayScore(a).v) || a.id.localeCompare(b.id));
  const dropping = above.filter((r) => r.residual && levelRank(r.residual.level) <= appetite);
  const in30 = new Date(Date.now() + 30 * 864e5).toISOString().slice(0, 10);
  const today = new Date().toISOString().slice(0, 10);
  const dueSoon = open.filter((r) => { const d = firstDate(r.due); return d && d <= in30; });
  const overdue = open.filter((r) => { const d = firstDate(r.due); return d && d < today; });

  // 4x4 grid: [g][v] -> { today: [ids], after: [ids] }
  const grid = {};
  for (let g = 1; g <= 4; g++) for (let v = 1; v <= 4; v++) grid[`${g}${v}`] = { today: [], after: [] };
  for (const r of risks) {
    const t = todayScore(r);
    if (t) grid[`${t.g}${t.v}`].today.push(r.id);
    if (r.residual && !CLOSED.test(r.status)) grid[`${r.residual.g}${r.residual.v}`].after.push(r.id);
  }
  return { open, above, dropping, dueSoon, overdue, grid };
}

/**
 * Framework coverage, read from the risks: an ISO 27001 ref is "in place" when a risk lists it under
 * "Already in place" (or a treated risk carries it), "planned" when a treatment plans it.
 * A clause of another framework takes the best status of the ISO refs it maps to.
 */
export function isoStatus(risks) {
  const status = new Map();
  const set = (ref, s, id) => {
    const cur = status.get(ref) || { status: 'none', risks: new Set() };
    if (s === 'in place' || cur.status === 'none') cur.status = s === 'in place' ? 'in place' : (cur.status === 'in place' ? 'in place' : 'planned');
    cur.risks.add(id);
    status.set(ref, cur);
  };
  for (const r of risks) {
    const treated = CLOSED.test(r.status);
    for (const c of r.detail?.controls || []) for (const ref of c.iso) set(ref, c.status === 'in place' || treated ? 'in place' : 'planned', r.id);
    for (const ref of r.controls || []) set(ref, treated ? 'in place' : 'planned', r.id);
  }
  return status;
}

export function coverage(framework, iso) {
  const clauses = framework.clauses.map((c) => {
    const hits = c.iso.map((ref) => iso.get(ref)).filter(Boolean);
    const s = hits.some((h) => h.status === 'in place') ? 'in place' : hits.length ? 'planned' : 'none';
    const risks = [...new Set(hits.flatMap((h) => [...h.risks]))].sort();
    return { ...c, status: s, risks };
  });
  const n = clauses.length || 1;
  const inPlace = clauses.filter((c) => c.status === 'in place').length;
  const planned = clauses.filter((c) => c.status === 'planned').length;
  return { clauses, total: clauses.length, inPlace, planned, none: clauses.length - inPlace - planned, pctInPlace: Math.round((inPlace / n) * 100), pctPlanned: Math.round((planned / n) * 100) };
}
