// Where the grc/ files come from. Same interface for a local folder and a GitHub repo:
//   read(rel) -> string | null      list(rel) -> [names]      info() -> repo/commit facts
//   history(rel) -> [{ hash, author, ago, subject }]          readBytes(rel) -> Buffer | null
// `rel` is always relative to the grc/ folder, and a source never returns anything outside it.
import { readFile, readdir } from 'node:fs/promises';
import { resolve, join, sep, posix } from 'node:path';
import { repoInfo, fileHistory } from './git.js';

/** Normalises a path inside grc/, or null when it tries to leave it. */
export function safeRel(rel = '') {
  const raw = String(rel).replace(/\\/g, '/');
  if (raw.includes('\0') || raw.split('/').includes('..')) return null;
  return posix.normalize('/' + raw).slice(1).replace(/\/$/, '');
}

export function fsSource(dir) {
  const root = resolve(dir);
  const full = (rel) => {
    const r = safeRel(rel);
    if (r === null) return null;
    const p = resolve(join(root, r));
    return p === root || p.startsWith(root + sep) ? p : null;
  };
  return {
    kind: 'fs',
    label: root,
    async readBytes(rel) { const p = full(rel); if (!p) return null; try { return await readFile(p); } catch { return null; } },
    async read(rel) { const b = await this.readBytes(rel); return b === null ? null : b.toString('utf8'); },
    async list(rel) { const p = full(rel); if (!p) return []; try { return await readdir(p); } catch { return []; } },
    info: () => repoInfo(root),
    history: (rel) => fileHistory(root, rel),
  };
}

const ago = (iso) => {
  const s = Math.max(1, Math.round((Date.now() - new Date(iso).getTime()) / 1000));
  for (const [n, u] of [[31536000, 'year'], [2592000, 'month'], [86400, 'day'], [3600, 'hour'], [60, 'minute']]) {
    if (s >= n) { const k = Math.floor(s / n); return `${k} ${u}${k > 1 ? 's' : ''} ago`; }
  }
  return `${s} seconds ago`;
};

/** Small LRU so a page view costs one tree call, not one call per file. Keyed by blob sha: never stale. */
const blobCache = new Map();
function cacheBlob(sha, buf) {
  blobCache.set(sha, buf);
  if (blobCache.size > 2000) blobCache.delete(blobCache.keys().next().value);
}

/**
 * A grc/ folder inside a GitHub repo, read with the signed-in user's token, so GitHub itself
 * decides what they may see. The tree is fetched once per source (one per request).
 */
export function githubSource({ token, owner, repo, ref, dir = 'grc', fetchImpl = fetch, api = 'https://api.github.com' }) {
  const headers = { authorization: `Bearer ${token}`, accept: 'application/vnd.github+json', 'x-github-api-version': '2022-11-28', 'user-agent': 'plainfile' };
  const gh = async (path) => {
    const res = await fetchImpl(`${api}${path}`, { headers });
    if (res.status === 404) return null;
    if (!res.ok) throw new Error(`GitHub ${res.status} on ${path.split('?')[0]}`);
    return res.json();
  };
  const repoPath = `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`;
  let treeP = null;
  const tree = () => (treeP ??= (async () => {
    const meta = await gh(repoPath);
    if (!meta) throw new Error(`Repo ${owner}/${repo} not found, or the Plainfile app is not installed on it`);
    const branch = ref || meta.default_branch;
    const commit = await gh(`${repoPath}/commits/${encodeURIComponent(branch)}`);
    const t = await gh(`${repoPath}/git/trees/${commit.commit.tree.sha}?recursive=1`);
    const files = new Map();
    const prefix = dir ? dir.replace(/\/$/, '') + '/' : '';
    for (const e of t?.tree || []) if (e.type === 'blob' && e.path.startsWith(prefix)) files.set(e.path.slice(prefix.length), e.sha);
    return { meta, branch, commit, files };
  })());

  return {
    kind: 'github',
    label: `${owner}/${repo}`,
    async readBytes(rel) {
      const r = safeRel(rel);
      if (r === null) return null;
      const sha = (await tree()).files.get(r);
      if (!sha) return null;
      if (blobCache.has(sha)) return blobCache.get(sha);
      const blob = await gh(`${repoPath}/git/blobs/${sha}`);
      const buf = Buffer.from(blob.content, blob.encoding === 'base64' ? 'base64' : 'utf8');
      cacheBlob(sha, buf);
      return buf;
    },
    async read(rel) { const b = await this.readBytes(rel); return b === null ? null : b.toString('utf8'); },
    async list(rel) {
      const r = safeRel(rel);
      if (r === null) return [];
      const pre = r ? r + '/' : '';
      const names = new Set();
      for (const p of (await tree()).files.keys()) if (p.startsWith(pre)) names.add(p.slice(pre.length).split('/')[0]);
      return [...names];
    },
    async info() {
      const { meta, branch, commit } = await tree();
      return {
        git: true, hash: commit.sha.slice(0, 7), ago: ago(commit.commit.committer.date), date: commit.commit.committer.date,
        branch, name: meta.full_name, web: meta.html_url, dirty: false,
      };
    },
    async history(rel, limit = 8) {
      const r = safeRel(rel);
      const list = await gh(`${repoPath}/commits?per_page=${limit}&sha=${encodeURIComponent((await tree()).branch)}&path=${encodeURIComponent((dir ? dir + '/' : '') + r)}`);
      return (list || []).map((c) => ({ hash: c.sha.slice(0, 7), author: c.commit.author.name, ago: ago(c.commit.author.date), subject: c.commit.message.split('\n')[0] }));
    },
    /** Every folder in the repo that looks like a grc/ folder (has context.md or risk-register.md). */
    async findGrcDirs() {
      const meta = await gh(repoPath);
      if (!meta) throw Object.assign(new Error(`Repo ${owner}/${repo} not found, or the Plainfile app is not installed on it`), { status: 404 });
      const commit = await gh(`${repoPath}/commits/${encodeURIComponent(ref || meta.default_branch)}`);
      const t = await gh(`${repoPath}/git/trees/${commit.commit.tree.sha}?recursive=1`);
      const dirs = new Set();
      for (const e of t?.tree || []) {
        const m = /^(.*?)\/?(context|risk-register)\.md$/.exec(e.path);
        if (e.type === 'blob' && m && /(^|\/)grc$/.test(m[1])) dirs.add(m[1]);
      }
      return [...dirs].sort((a, b) => a.length - b.length);
    },
  };
}
