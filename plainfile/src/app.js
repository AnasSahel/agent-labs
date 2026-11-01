// Routes -> HTML for one workspace. Shared by the local server, the static build and the SaaS.
import { resolve, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadGrc, loadFrameworks } from './parse.js';
import * as view from './render.js';

const here = fileURLToPath(new URL('.', import.meta.url));
export const PUBLIC_DIR = resolve(here, '../public');

/** Frameworks ship with Plainfile (fixed, reviewed files). Override with PLAINFILE_FRAMEWORKS. */
export function frameworksDir() {
  return process.env.PLAINFILE_FRAMEWORKS || resolve(here, '../../frameworks');
}

/** Pages link with root paths ("/risks"); a workspace mounted under a prefix rewrites them. */
export function withBase(html, base) {
  if (!base) return html;
  return html.replace(/\b(href|src)="\/(?!\/|style\.css|auth\/|app\b)/g, `$1="${base}/`);
}

export async function createApp() {
  const frameworks = await loadFrameworks(frameworksDir());

  async function page(source, pathname, query = {}) {
    // Files are the database: read them fresh on every request.
    const [data, repo] = await Promise.all([loadGrc(source), source.info()]);
    const base = { data, repo };
    const parts = pathname.split('/').filter(Boolean).map(decodeURIComponent);

    if (parts.length === 0) {
      return { title: 'Portfolio', active: 'portfolio', crumbs: '<b>Portfolio</b> · grc/', body: view.portfolioPage(data, frameworks), ...base };
    }
    if (parts[0] === 'risks' && parts.length === 1) {
      return { title: 'Risks', active: 'risks', crumbs: '<b>Risks</b> · grc/risk-register.md', body: view.risksPage(data, query), ...base };
    }
    if (parts[0] === 'risks' && parts.length === 2) {
      const r = data.risks.find((x) => x.id === parts[1]);
      if (!r) return { status: 404, title: 'Not found', active: 'risks', body: view.notFoundPage(parts[1]), ...base };
      const file = r.detail?.file || 'risk-register.md';
      const history = await source.history(file);
      return { title: r.id, active: 'risks', crumbs: `<a href="/risks">Risks</a> / <b>${view.esc(r.id)}</b> · grc/${view.esc(file)}`, body: view.riskPage(data, r, history, repo), ...base };
    }
    if (parts[0] === 'frameworks' && parts.length === 1) {
      return { title: 'Frameworks', active: 'frameworks', crumbs: '<b>Frameworks</b> · frameworks/', body: view.frameworksPage(data, frameworks), ...base };
    }
    if (parts[0] === 'frameworks' && parts.length === 2 && frameworks[parts[1]]) {
      const fw = frameworks[parts[1]];
      return { title: fw.name, active: 'frameworks', crumbs: `<a href="/frameworks">Frameworks</a> / <b>${view.esc(fw.id)}</b>`, body: view.frameworkPage(data, fw), ...base };
    }
    return { status: 404, title: 'Not found', active: '', body: view.notFoundPage(pathname), ...base };
  }

  /** opts.base: URL prefix of the workspace; opts.account: html for the top bar (signed-in user). */
  async function render(source, pathname, query, opts = {}) {
    const p = await page(source, pathname, query);
    return { status: p.status || 200, html: withBase(view.layout({ ...p, account: opts.account || '' }), opts.base || '') };
  }

  /** A raw file from the grc/ folder (attack paths, reports, md). Never outside it. */
  async function file(source, relPath) {
    if (!ALLOWED.includes(extname(relPath))) return null;
    const body = await source.readBytes(relPath);
    if (body === null) return null;
    return { body: extname(relPath) === '.html' ? withHeightPing(body.toString('utf8')) : body, type: TYPES[extname(relPath)] || 'text/plain; charset=utf-8' };
  }

  return { render, file, frameworks };
}

const ALLOWED = ['.html', '.md', '.png', '.svg', '.csv', '.json', '.yaml', '.yml'];

export const TYPES = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.md': 'text/plain; charset=utf-8',
  '.png': 'image/png', '.svg': 'image/svg+xml', '.csv': 'text/plain; charset=utf-8', '.json': 'application/json',
  '.yaml': 'text/plain; charset=utf-8', '.yml': 'text/plain; charset=utf-8',
};

/** Lets an embedded repo page tell the dashboard its height, so the iframe fits it with no inner scroll. */
export function withHeightPing(html) {
  const ping = `<script>(function(){function s(){parent.postMessage({plainfileHeight:document.documentElement.scrollHeight},'*')}addEventListener('load',s);if(window.ResizeObserver)new ResizeObserver(s).observe(document.documentElement)})()</script>`;
  return /<\/body>/i.test(html) ? html.replace(/<\/body>/i, ping + '</body>') : html + ping;
}
