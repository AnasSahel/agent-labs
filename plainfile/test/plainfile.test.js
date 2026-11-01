import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { levelOf, parseScore, parseRegister, parseRiskFile, loadGrc, loadFrameworks } from '../src/parse.js';
import { portfolio, isoStatus, coverage } from '../src/model.js';
import { createApp, frameworksDir } from '../src/app.js';

const SAMPLE = fileURLToPath(new URL('../sample/grc', import.meta.url));

test('level rule matches theme.md', () => {
  assert.equal(levelOf(4, 2), 'high');
  assert.equal(levelOf(3, 3), 'high');
  assert.equal(levelOf(3, 2), 'medium');
  assert.equal(levelOf(4, 1), 'medium');
  assert.equal(levelOf(2, 2), 'low');
  assert.equal(levelOf(1, 4), 'medium');
});

test('scores are recomputed, not trusted', () => {
  assert.deepEqual(parseScore('G4·V3 medium'), { g: 4, v: 3, level: 'high', label: 'G4·V3' });
  assert.equal(parseScore('—'), null);
});

test('register rows parse by header name', () => {
  const rows = parseRegister('| ID | Scenario | Owner | Inherent | Residual | Status | Due |\n|---|---|---|---|---|---|---|\n| R-9 | X | CTO | G3·V3 high | G3·V1 medium | open | 2026-12-01 |');
  assert.equal(rows[0].id, 'R-9');
  assert.equal(rows[0].inherent.level, 'high');
  assert.equal(rows[0].residual.level, 'medium');
});

test('risk file: planned and in-place controls', () => {
  const r = parseRiskFile('# R-1 · Title\n\n**Owner** CTO · **Status** open · **Due** 2026-12-31\n\n## Treatment\n**Reduce.** Why.\n\n| # | Control | Due | ISO 27001 | NIS2 |\n|---|---|---|---|---|\n| 1 | Keys | 2026-11-30 | A.8.5 | Art. 21(2)(j) |\n\nAlready in place: separate admin accounts (A.8.2), PIM (A.8.2). Follow-up: x.\n');
  assert.equal(r.id, 'R-1');
  assert.equal(r.owner, 'CTO');
  assert.deepEqual(r.controls.map((c) => [c.status, c.iso.join()]), [['planned', 'A.8.5'], ['in place', 'A.8.2'], ['in place', 'A.8.2']]);
  assert.equal(r.controls[0].refs.NIS2, 'Art. 21(2)(j)');
});

test('sample portfolio', async () => {
  const data = await loadGrc(SAMPLE);
  assert.equal(data.context.org, 'Acme Pay');
  assert.deepEqual(data.context.frameworks.map((f) => f.id), ['iso27001', 'nis2', 'dora', 'gdpr']);
  const p = portfolio(data);
  assert.deepEqual(p.above.map((r) => r.id).sort(), ['R-002', 'R-003', 'R-004', 'R-005', 'R-007']);
  assert.equal(p.dropping.length, 5);
});

test('coverage maps ISO status onto framework clauses', async () => {
  const data = await loadGrc(SAMPLE);
  const fws = await loadFrameworks(frameworksDir());
  assert.equal(fws.iso27001.clauses.length, 93);
  const cov = coverage(fws.nis2, isoStatus(data.risks));
  const j = cov.clauses.find((c) => c.clause === 'Art. 21(2)(j)');
  assert.equal(j.status, 'in place'); // A.8.20 via treated R-001
  assert.ok(j.risks.includes('R-002'));
});

test('raw files never leave the grc folder', async () => {
  const app = await createApp(SAMPLE);
  assert.equal(await app.file('../../package.json'), null);
  assert.equal(await app.file('/etc/passwd'), null);
  assert.ok(await app.file('risks/R-002-attack-path.html'));
});

test('every page renders', async () => {
  const app = await createApp(SAMPLE);
  for (const p of ['/', '/risks', '/risks/R-002', '/risks/R-008', '/frameworks', '/frameworks/nis2']) {
    const { status, html } = await app.render(p, {});
    assert.equal(status, 200, p);
    assert.match(html, /<h1>/);
  }
  assert.equal((await app.render('/risks/R-999', {})).status, 404);
});
