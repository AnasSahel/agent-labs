// Git is the audit trail. Read-only: Plainfile v1 never writes to the repo.
import { execFile } from 'node:child_process';

function git(cwd, args) {
  return new Promise((resolve) => {
    execFile('git', args, { cwd, timeout: 5000, maxBuffer: 1 << 20 }, (err, stdout) => resolve(err ? null : stdout.trim()));
  });
}

export async function repoInfo(dir) {
  const head = await git(dir, ['log', '-1', '--format=%h%x09%cr%x09%ci']);
  if (!head) return { git: false };
  const [hash, ago, date] = head.split('\t');
  const branch = await git(dir, ['rev-parse', '--abbrev-ref', 'HEAD']);
  const remote = await git(dir, ['remote', 'get-url', 'origin']);
  const dirty = await git(dir, ['status', '--porcelain', '--', '.']);
  const name = remote ? remote.replace(/\.git$/, '').replace(/^.*[/:]([^/]+\/[^/]+)$/, '$1') : null;
  const web = remote && /github\.com|gitlab/.test(remote)
    ? remote.replace(/^git@([^:]+):/, 'https://$1/').replace(/\.git$/, '').replace(/^https:\/\/[^@]+@/, 'https://')
    : null;
  return { git: true, hash, ago, date, branch, name, web, dirty: Boolean(dirty) };
}

/** Commits that touched a file, newest first. */
export async function fileHistory(dir, file, limit = 8) {
  const out = await git(dir, ['log', `-${limit}`, '--follow', '--format=%h%x09%an%x09%cr%x09%s', '--', file]);
  if (!out) return [];
  return out.split('\n').map((l) => { const [hash, author, ago, subject] = l.split('\t'); return { hash, author, ago, subject }; });
}

/** Path of dir relative to the repo root, to build links to the web UI. */
export async function repoPrefix(dir) {
  return (await git(dir, ['rev-parse', '--show-prefix'])) ?? '';
}
