import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { levelOf, parseScore, parseRegister, parseRiskFile, loadGrc, loadFrameworks } from '../src/parse.js';
import { portfolio, isoStatus, coverage } from '../src/model.js';
import { createApp, frameworksDir, withBase } from '../src/app.js';
import { fsSource, githubSource, safeRel } from '../src/source.js';

const SAMPLE = fileURLToPath(new URL('../sample/grc', import.meta.url));
const src = () => fsSource(SAMPLE);

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
  const data = await loadGrc(src());
  assert.equal(data.context.org, 'Acme Pay');
  assert.deepEqual(data.context.frameworks.map((f) => f.id), ['iso27001', 'nis2', 'dora', 'gdpr']);
  const p = portfolio(data);
  assert.deepEqual(p.above.map((r) => r.id).sort(), ['R-002', 'R-003', 'R-004', 'R-005', 'R-007']);
  assert.equal(p.dropping.length, 5);
});

test('coverage maps ISO status onto framework clauses', async () => {
  const data = await loadGrc(src());
  const fws = await loadFrameworks(frameworksDir());
  assert.equal(fws.iso27001.clauses.length, 93);
  const cov = coverage(fws.nis2, isoStatus(data.risks));
  const j = cov.clauses.find((c) => c.clause === 'Art. 21(2)(j)');
  assert.equal(j.status, 'in place'); // A.8.20 via treated R-001
  assert.ok(j.risks.includes('R-002'));
});

test('raw files never leave the grc folder', async () => {
  const app = await createApp();
  assert.equal(await app.file(src(), '../../package.json'), null);
  assert.equal(await app.file(src(), '../README.md'), null);
  assert.equal(await app.file(src(), '/etc/passwd'), null);
  assert.ok(await app.file(src(), 'risks/R-002-attack-path.html'));
  assert.equal(safeRel('../x'), null);
});

test('every page renders', async () => {
  const app = await createApp();
  for (const p of ['/', '/risks', '/risks/R-002', '/risks/R-008', '/frameworks', '/frameworks/nis2']) {
    const { status, html } = await app.render(src(), p, {});
    assert.equal(status, 200, p);
    assert.match(html, /<h1>/);
  }
  assert.equal((await app.render(src(), '/risks/R-999', {})).status, 404);
});

test('withBase prefixes workspace links but not shared assets', () => {
  const html = '<a href="/risks">x</a><link href="/style.css"><iframe src="/file/a.html"></iframe><a href="/app">r</a><a href="https://x.io/y">e</a>';
  assert.equal(withBase(html, '/demo'), '<a href="/demo/risks">x</a><link href="/style.css"><iframe src="/demo/file/a.html"></iframe><a href="/app">r</a><a href="https://x.io/y">e</a>');
});

// A tiny fake GitHub: one repo with the sample grc/ folder under grc/.
async function fakeGithub() {
  const { readFile, readdir } = await import('node:fs/promises');
  const { join } = await import('node:path');
  const walk = async (d, rel = '') => (await Promise.all((await readdir(d, { withFileTypes: true })).map((e) => e.isDirectory() ? walk(join(d, e.name), `${rel}${e.name}/`) : [`${rel}${e.name}`]))).flat();
  const files = await walk(SAMPLE);
  const blobs = {};
  const tree = [];
  for (const f of files) { const sha = 'sha' + tree.length; blobs[sha] = await readFile(join(SAMPLE, f)); tree.push({ type: 'blob', path: `grc/${f}`, sha }); }
  const calls = [];
  const json = (o, status = 200) => ({ ok: status < 400, status, json: async () => o });
  const fetchImpl = async (url, init = {}) => {
    const u = new URL(url); calls.push(u.pathname);
    const auth = init.headers?.authorization;
    if (u.pathname === '/login/oauth/access_token') return json({ access_token: 'tok123' });
    if (auth !== 'Bearer tok123') return json({}, 401);
    if (u.pathname === '/user') return json({ login: 'dana', avatar_url: 'https://a/b?v=4' });
    if (u.pathname === '/user/installations') return json({ installations: [{ id: 1 }] });
    if (u.pathname === '/user/installations/1/repositories') return json({ repositories: [{ full_name: 'acme/compliance', private: true, default_branch: 'main' }] });
    if (u.pathname === '/repos/acme/compliance') return json({ full_name: 'acme/compliance', default_branch: 'main', html_url: 'https://github.com/acme/compliance' });
    if (u.pathname.startsWith('/repos/acme/compliance/commits/')) return json({ sha: 'abcdef1234', commit: { tree: { sha: 'T' }, committer: { date: new Date().toISOString() } } });
    if (u.pathname.startsWith('/repos/acme/compliance/commits')) return json([{ sha: 'abcdef1234', commit: { author: { name: 'Dana', date: new Date().toISOString() }, message: 'Add R-002\n\nbody' } }]);
    if (u.pathname === '/repos/acme/compliance/git/trees/T') return json({ tree });
    const b = /\/git\/blobs\/(sha\d+)$/.exec(u.pathname);
    if (b) return json({ encoding: 'base64', content: blobs[b[1]].toString('base64') });
    return json({}, 404);
  };
  return { fetchImpl, calls };
}

test('github source reads the grc folder through the API', async () => {
  const { fetchImpl } = await fakeGithub();
  const source = githubSource({ token: 'tok123', owner: 'acme', repo: 'compliance', fetchImpl });
  assert.deepEqual(await source.findGrcDirs(), ['grc']);
  const data = await loadGrc(source);
  assert.equal(data.context.org, 'Acme Pay');
  assert.equal(data.risks.length, 8);
  assert.equal(await source.read('../README.md'), null);
  assert.equal((await source.info()).name, 'acme/compliance');
  assert.equal((await source.history('risk-register.md'))[0].subject, 'Add R-002');
});

test('saas: sign in, list repos, open a workspace, sealed cookie', async () => {
  const { seal, unseal, createSaas } = await import('../src/saas.js');
  assert.deepEqual(unseal(seal({ a: 1 }, 'x'.repeat(20)), 'x'.repeat(20)), { a: 1 });
  assert.equal(unseal(seal({ a: 1 }, 'x'.repeat(20)), 'y'.repeat(20)), null);

  const { fetchImpl } = await fakeGithub();
  const env = { SESSION_SECRET: 's'.repeat(32), GITHUB_CLIENT_ID: 'id', GITHUB_CLIENT_SECRET: 'sec', GITHUB_API: 'https://api.test', GITHUB_WEB: 'https://web.test' };
  const handler = await createSaas(env, { fetchImpl });
  const call = (path, { method = 'GET', cookie = '' } = {}) => new Promise((resolve) => {
    const res = { status: 0, headers: {}, writeHead(s, h) { this.status = s; this.headers = h || {}; return this; }, end(b) { resolve({ status: this.status, headers: this.headers, body: String(b ?? '') }); } };
    handler({ url: path, method, headers: { cookie } }, res);
  });

  assert.match((await call('/')).body, /Sign in with GitHub/);
  assert.equal((await call('/app')).status, 302);                 // signed out
  assert.equal((await call('/w/acme/compliance/')).status, 302);   // signed out
  const demo = await call('/demo/risks/R-002');
  assert.equal(demo.status, 200);
  assert.match(demo.body, /href="\/demo\/risks"/);

  const login = await call('/auth/login');
  const stateCookie = login.headers['set-cookie'][0].split(';')[0];
  const state = new URL(login.headers.location).searchParams.get('state');
  assert.equal((await call(`/auth/callback?code=c&state=wrong`, { cookie: stateCookie })).status, 400);
  const cb = await call(`/auth/callback?code=c&state=${state}`, { cookie: stateCookie });
  assert.equal(cb.status, 302);
  const session = cb.headers['set-cookie'][0].split(';')[0];
  assert.match(cb.headers['set-cookie'][0], /HttpOnly/);
  assert.ok(!session.includes('tok123'));                          // token is sealed, never readable

  assert.match((await call('/app', { cookie: session })).body, /acme\/compliance/);
  const ws = await call('/w/acme/compliance/', { cookie: session });
  assert.equal(ws.status, 200);
  assert.match(ws.body, /above appetite/);
  assert.match(ws.body, /href="\/w\/acme\/compliance\/risks"/);
  const risk = await call('/w/acme/compliance/risks/R-002', { cookie: session });
  assert.match(risk.body, /src="\/w\/acme\/compliance\/file\/risks\/R-002-attack-path.html"/);
  const f = await call('/w/acme/compliance/file/risks/R-002-attack-path.html', { cookie: session });
  assert.equal(f.status, 200);
  assert.match(f.headers['content-security-policy'], /sandbox/);
  assert.equal((await call('/w/acme/compliance/file/..%2f..%2fx.md', { cookie: session })).status, 404);
  assert.equal((await call('/w/acme/nope/', { cookie: session })).status, 404);
});
