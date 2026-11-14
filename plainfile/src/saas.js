// The hosted product: sign in with GitHub, pick a repo, see its grc/ folder.
// Stateless: the GitHub token lives in an encrypted, httpOnly cookie, nothing is stored on the server.
// Needs a GitHub App (user login): GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, SESSION_SECRET, optional
// BASE_URL (https://plainfile.example), GITHUB_APP_SLUG (for the "add a repo" link).
import { createCipheriv, createDecipheriv, createHash, randomBytes, timingSafeEqual } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createApp, PUBLIC_DIR } from './app.js';
import { fsSource, githubSource } from './source.js';
import * as view from './render.js';

const SAMPLE = fileURLToPath(new URL('../sample/grc', import.meta.url));
const SESSION_DAYS = 7;

// ---------- sealed cookies ----------

export function seal(value, secret) {
  const key = createHash('sha256').update(secret).digest();
  const iv = randomBytes(12);
  const c = createCipheriv('aes-256-gcm', key, iv);
  const enc = Buffer.concat([c.update(JSON.stringify(value), 'utf8'), c.final()]);
  return Buffer.concat([iv, c.getAuthTag(), enc]).toString('base64url');
}

export function unseal(text, secret) {
  try {
    const raw = Buffer.from(text, 'base64url');
    const key = createHash('sha256').update(secret).digest();
    const d = createDecipheriv('aes-256-gcm', key, raw.subarray(0, 12));
    d.setAuthTag(raw.subarray(12, 28));
    return JSON.parse(Buffer.concat([d.update(raw.subarray(28)), d.final()]).toString('utf8'));
  } catch { return null; }
}

const parseCookies = (h = '') => Object.fromEntries(h.split(';').map((p) => p.trim().split(/=(.*)/s).slice(0, 2)).filter(([k]) => k));
const same = (a, b) => { const x = Buffer.from(String(a)); const y = Buffer.from(String(b)); return x.length === y.length && timingSafeEqual(x, y); };

// ---------- the app ----------

export async function createSaas(env = process.env, { fetchImpl = fetch } = {}) {
  const secret = env.SESSION_SECRET;
  if (!secret || secret.length < 16) throw new Error('SESSION_SECRET (16+ characters) is required');
  const clientId = env.GITHUB_CLIENT_ID;
  const clientSecret = env.GITHUB_CLIENT_SECRET;
  const configured = Boolean(clientId && clientSecret);
  const baseUrl = (env.BASE_URL || '').replace(/\/$/, '');
  const secure = baseUrl.startsWith('https://');
  const installUrl = env.GITHUB_APP_SLUG ? `https://github.com/apps/${env.GITHUB_APP_SLUG}/installations/new` : '';
  const app = await createApp();
  const demo = fsSource(SAMPLE);
  const gh = env.GITHUB_API || 'https://api.github.com';
  const ghWeb = env.GITHUB_WEB || 'https://github.com';

  const cookie = (name, value, maxAge) =>
    `${name}=${value}; Path=/; HttpOnly; SameSite=Lax${secure ? '; Secure' : ''}; Max-Age=${maxAge}`;
  const redirect = (res, to, extra = []) => res.writeHead(302, { location: to, 'set-cookie': extra }).end();
  const send = (res, status, html, extra = {}) => res.writeHead(status, { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store', ...extra }).end(html);

  async function ghJson(path, token) {
    const r = await fetchImpl(`${gh}${path}`, { headers: { authorization: `Bearer ${token}`, accept: 'application/vnd.github+json', 'x-github-api-version': '2022-11-28', 'user-agent': 'plainfile' } });
    if (!r.ok) { const e = new Error(`GitHub ${r.status}`); e.status = r.status; throw e; }
    return r.json();
  }

  const sessionOf = (req) => {
    const s = unseal(parseCookies(req.headers.cookie).pf_session || '', secret);
    return s && s.exp > Date.now() ? s : null;
  };

  async function listRepos(token) {
    const { installations } = await ghJson('/user/installations?per_page=100', token);
    const repos = [];
    for (const i of installations || []) {
      const page = await ghJson(`/user/installations/${i.id}/repositories?per_page=100`, token);
      repos.push(...(page.repositories || []));
    }
    return repos.sort((a, b) => a.full_name.localeCompare(b.full_name));
  }

  return async function handler(req, res) {
    const url = new URL(req.url, 'http://x');
    const path = url.pathname;
    const headers = { 'x-content-type-options': 'nosniff', 'referrer-policy': 'same-origin', 'x-frame-options': 'SAMEORIGIN' };
    try {
      if (path === '/style.css') {
        return res.writeHead(200, { ...headers, 'content-type': 'text/css; charset=utf-8', 'cache-control': 'public, max-age=300' }).end(await readFile(join(PUBLIC_DIR, 'style.css')));
      }
      if (path === '/healthz') return res.writeHead(200, { 'content-type': 'text/plain' }).end('ok');

      const session = sessionOf(req);
      const user = session ? { login: session.login, avatar: session.avatar } : null;
      const account = view.accountBar(user);

      // ----- auth -----
      if (path === '/auth/login') {
        if (!configured) return send(res, 503, view.landingPage({ configured, error: 'GitHub sign-in is not configured on this server.' }));
        const state = randomBytes(16).toString('base64url');
        const q = new URLSearchParams({ client_id: clientId, state });
        if (baseUrl) q.set('redirect_uri', `${baseUrl}/auth/callback`);
        return redirect(res, `${ghWeb}/login/oauth/authorize?${q}`, [cookie('pf_state', seal({ state, exp: Date.now() + 600000 }, secret), 600)]);
      }
      if (path === '/auth/callback') {
        const st = unseal(parseCookies(req.headers.cookie).pf_state || '', secret);
        const code = url.searchParams.get('code');
        if (!st || st.exp < Date.now() || !same(st.state, url.searchParams.get('state') || '') || !code) {
          return send(res, 400, view.landingPage({ configured, error: 'Sign-in expired or was tampered with. Try again.' }), { 'set-cookie': cookie('pf_state', '', 0) });
        }
        const tr = await fetchImpl(`${ghWeb}/login/oauth/access_token`, {
          method: 'POST', headers: { accept: 'application/json', 'content-type': 'application/json', 'user-agent': 'plainfile' },
          body: JSON.stringify({ client_id: clientId, client_secret: clientSecret, code }),
        });
        const t = await tr.json();
        if (!t.access_token) return send(res, 400, view.landingPage({ configured, error: 'GitHub did not accept the sign-in. Try again.' }), { 'set-cookie': cookie('pf_state', '', 0) });
        const me = await ghJson('/user', t.access_token);
        const sealed = seal({ token: t.access_token, login: me.login, avatar: me.avatar_url, exp: Date.now() + SESSION_DAYS * 864e5 }, secret);
        return redirect(res, '/app', [cookie('pf_session', sealed, SESSION_DAYS * 86400), cookie('pf_state', '', 0)]);
      }
      if (path === '/auth/logout' && req.method === 'POST') return redirect(res, '/', [cookie('pf_session', '', 0)]);

      // ----- demo workspace: the sample data, no sign-in -----
      if (path === '/demo' || path.startsWith('/demo/')) {
        const rest = path.slice(5) || '/';
        if (rest.startsWith('/file/')) return serveFile(res, headers, demo, decodeURIComponent(rest.slice(6)));
        const { status, html } = await app.render(demo, rest, Object.fromEntries(url.searchParams), { base: '/demo', account: account || '<a class="btn solid" href="/auth/login">Sign in with GitHub</a>' });
        return send(res, status, html);
      }

      // ----- signed in -----
      if (path === '/app') {
        if (!session) return redirect(res, '/');
        try { return send(res, 200, view.reposPage({ user, repos: await listRepos(session.token), installUrl })); }
        catch (e) { return fail(res, e, user); }
      }
      const w = /^\/w\/([\w.-]+)\/([\w.-]+)(?:\/d\/([^/]+))?(\/.*)?$/.exec(path);
      if (w) {
        if (!session) return redirect(res, '/');
        const [, owner, repo, dirEnc, restRaw] = w;
        const rest = restRaw || '/';
        const base = `/w/${owner}/${repo}`;
        try {
          let dir = dirEnc ? decodeURIComponent(dirEnc) : null;
          const probe = githubSource({ token: session.token, owner, repo, dir: dir ?? 'grc', fetchImpl, api: gh });
          if (dir === null) {
            const dirs = await probe.findGrcDirs();
            if (dirs.length !== 1) return send(res, 200, view.pickDirPage({ user, fullName: `${owner}/${repo}`, dirs }));
            dir = dirs[0];
          }
          if (!/^[\w./-]+$/.test(dir) || dir.split('/').includes('..')) return send(res, 400, view.errorPage({ user, title: 'Bad folder', message: 'That folder name is not valid.' }));
          const source = githubSource({ token: session.token, owner, repo, dir, fetchImpl, api: gh });
          const wbase = dirEnc ? `${base}/d/${encodeURIComponent(dir)}` : base;
          if (rest.startsWith('/file/')) return serveFile(res, headers, source, decodeURIComponent(rest.slice(6)));
          const { status, html } = await app.render(source, rest, Object.fromEntries(url.searchParams), { base: wbase, account });
          return send(res, status, html);
        } catch (e) { return fail(res, e, user); }
      }

      if (path === '/') return send(res, 200, user ? view.reposPage({ user, repos: await listRepos(session.token).catch(() => []), installUrl }) : view.landingPage({ configured }));
      return send(res, 404, view.errorPage({ user, title: 'Not found', message: 'Nothing here.' }));
    } catch (err) {
      console.error(err);
      return send(res, 500, view.errorPage({ title: 'Something broke', message: 'We logged it. Try again in a minute.' }));
    }
  };

  function fail(res, e, user) {
    if (e.status === 401) return redirect(res, '/auth/login', ['pf_session=; Path=/; HttpOnly; Max-Age=0']);
    const msg = e.status === 403 ? 'GitHub is rate limiting this account. Try again in a minute.' : String(e.message || e);
    return send(res, e.status === 404 ? 404 : 502, view.errorPage({ user, title: 'Could not read the repo', message: msg }));
  }

  async function serveFile(res, headers, source, rel) {
    const f = await app.file(source, rel);
    if (!f) return res.writeHead(404, headers).end('Not found');
    // Repo files are content, not app code: sandboxed away from the app's origin and its cookie.
    return res.writeHead(200, { ...headers, 'content-type': f.type, 'content-security-policy': 'sandbox allow-scripts', 'cache-control': 'private, no-store' }).end(f.body);
  }
}
