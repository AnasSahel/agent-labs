# Plainfile

A GRC dashboard over a git repo of markdown files. Your `grc/` folder stays the database: risks, the register, policies and framework mappings are plain `.md` files you own, and git is the audit trail.

**v1 is read-only.** Three screens, all read from the files on every request:

| Screen | Reads | Shows |
|---|---|---|
| **Portfolio** | `grc/context.md`, `grc/risk-register.md` | Risks above appetite, the 4×4 heat map (● today, ○ after fixes), framework coverage |
| **Risk** | `grc/risks/R-xxx-*.md`, `R-xxx-attack-path.html` | In short, attack path, scenario, treatment with framework refs, score, git history |
| **Frameworks** | `frameworks/*.md` (fixed mappings, ISO 27001 as the pivot) | Each clause in scope: in place, planned, or no control in any risk yet, and which risks touch it |

## Run it

Node 20+, no dependencies.

```sh
cd plainfile
npm start                          # sample data → http://127.0.0.1:4300
node src/cli.js serve ~/acme/grc   # your own grc/ folder
node src/cli.js build ~/acme/grc --out dist   # static HTML for any web server
npm test
```

Options: `--port`, `--host`, `PLAINFILE_FRAMEWORKS=<dir>` (defaults to the `frameworks/` folder next to it in agent-labs).

## How it reads the files

- **Levels** are recomputed from the G·V score with the one rule from `theme.md` (high when G3+ with V3+, or G4 with V2+; low when both ≤ 2; medium otherwise), never trusted from the text.
- **Today** is the inherent score while a risk is open, the residual once it is `treated`, `closed` or `accepted`.
- **Appetite** comes from `context.md` (`no residual risk above "medium"` → medium).
- **Coverage** is read from the risks: an ISO 27001 control is *in place* when a risk lists it under "Already in place" (or a treated risk carries it), *planned* when a treatment plans it. A framework clause takes the best status of the ISO controls it maps to.
- **History** is `git log` on the file. Not a git repo? It still works, without history.
- Repo files shown in the app (attack paths, reports) are served sandboxed, and nothing outside the `grc/` folder is ever served.

The format is the one the GRC skills in `skills/grc/` write, so Claude does the work in the repo and Plainfile shows it.

## Next

1. Edits as pull requests (approve = PR review), with GitHub App / GitLab OAuth sign-in.
2. Policies, evidence and controls (statement of applicability) screens.
3. Docker image for self-hosted and air-gapped installs.

Sample data in `sample/grc` is fictional (see `sample/README.md`).
