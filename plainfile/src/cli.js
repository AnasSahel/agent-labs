#!/usr/bin/env node
// plainfile serve [grc-dir] [--port 4300]   live dashboard over a grc/ folder
// plainfile build [grc-dir] [--out dist]    static HTML, for any web server or an air-gapped share
import { createServer } from 'node:http';
import { readFile, writeFile, mkdir, cp, readdir } from 'node:fs/promises';
import { resolve, join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createApp, PUBLIC_DIR, withHeightPing } from './app.js';
import { loadGrc } from './parse.js';

const args = process.argv.slice(2);
const cmd = ['serve', 'build'].includes(args[0]) ? args.shift() : 'serve';
const flag = (name, dflt) => { const i = args.indexOf(`--${name}`); return i >= 0 ? args.splice(i, 2)[1] : dflt; };
const port = Number(flag('port', process.env.PORT || 4300));
const host = flag('host', process.env.HOST || '127.0.0.1');
const out = resolve(flag('out', 'dist'));
const here = dirname(fileURLToPath(import.meta.url));
const grcDir = resolve(args[0] || process.env.PLAINFILE_GRC || join(here, '../sample/grc'));

const app = await createApp(grcDir);

if (cmd === 'serve') {
  const server = createServer(async (req, res) => {
    const url = new URL(req.url, 'http://x');
    const headers = { 'x-content-type-options': 'nosniff', 'referrer-policy': 'no-referrer' };
    try {
      if (req.method !== 'GET' && req.method !== 'HEAD') { res.writeHead(405, headers).end(); return; }
      if (url.pathname === '/style.css') {
        res.writeHead(200, { ...headers, 'content-type': 'text/css; charset=utf-8' }).end(await readFile(join(PUBLIC_DIR, 'style.css')));
        return;
      }
      if (url.pathname.startsWith('/file/')) {
        const f = await app.file(decodeURIComponent(url.pathname.slice(6)));
        if (!f) { res.writeHead(404, headers).end('Not found'); return; }
        // Repo files are content, not app code: keep them away from the app's origin.
        res.writeHead(200, { ...headers, 'content-type': f.type, 'content-security-policy': 'sandbox allow-scripts' }).end(f.body);
        return;
      }
      const { status, html } = await app.render(url.pathname, Object.fromEntries(url.searchParams));
      res.writeHead(status, { ...headers, 'content-type': 'text/html; charset=utf-8' }).end(html);
    } catch (err) {
      console.error(err);
      res.writeHead(500, { ...headers, 'content-type': 'text/plain; charset=utf-8' }).end(String(err.message || err));
    }
  });
  server.listen(port, host, () => console.log(`Plainfile · reading ${grcDir}\n→ http://${host}:${port}`));
} else {
  const data = await loadGrc(grcDir);
  const pages = ['/', '/risks', '/frameworks', ...data.risks.map((r) => `/risks/${r.id}`), ...Object.keys(app.frameworks).map((id) => `/frameworks/${id}`)];
  for (const p of pages) {
    const { html } = await app.render(p, {});
    const dir = join(out, p);
    await mkdir(dir, { recursive: true });
    await writeFile(join(dir, 'index.html'), html);
  }
  await cp(join(PUBLIC_DIR, 'style.css'), join(out, 'style.css'));
  // The repo files the pages link to (attack paths, reports, traces).
  await cp(grcDir, join(out, 'file'), { recursive: true });
  try {
    for (const f of await readdir(join(out, 'file/risks'))) {
      if (f.endsWith('.html')) await writeFile(join(out, 'file/risks', f), withHeightPing(await readFile(join(out, 'file/risks', f), 'utf8')));
    }
  } catch { /* no risks folder */ }
  console.log(`Plainfile · ${pages.length} pages written to ${out}`);
}
