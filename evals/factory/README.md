# Factory evals

14 cases for the five factory skills, run with `claude plugin eval` against a tiny notes app in [fixture](fixture): files tracker (`intent/`), no remote, no code host, so nothing needs GitHub.

```bash
evals/factory/run.sh --runs 1 --case 'trigger-*'    # cheap: which skill fires
evals/factory/run.sh --runs 3 -j 4 --max-cost-usd 40
```

| Case | Checks |
|---|---|
| `trigger-file-request` | a new bug to track goes to factory-plan |
| `trigger-spec-intent` | "spec out intent 002" goes to factory-design |
| `trigger-plan-and-build` | "plan issue 001 and build it" goes to factory-build, never factory-plan |
| `trigger-run-request` | a new request to build end to end goes to factory-run |
| `trigger-run-status` | "what's waiting for me?" goes to factory-run, which shows both items and builds nothing |
| `run-fast-lane` | a small bug carried unattended: intent, spec, plan and code on one branch, one stop at the end |
| `design-reads-lessons` | a line marked for design in `factory/lessons.md` shapes the spec |
| `plan-agent-request` | another agent's request: nothing asked, intent committed at `needs-go` |
| `design-no-intent` | no issue, no intent: a spec is still written, numbered from `specs/` |
| `design-public-repo` | public repo: no Findings section, the questions stay |
| `build-no-issue` | a spec with no issue: plan written at `needs-plan`, no code touched |
| `build-merged-spec` | issue stuck at `needs-design` with a `designed` spec: build heals it and plans |
| `build-split-part` | a part of a split: plan built from the parent's spec, its own criteria only |
| `build-split-part-waits` | a part that comes after an unbuilt part: stops |

- Every design and build case runs unattended, so it ends at the first gate: one turn, nothing to answer. `run-fast-lane` is the one case that goes from a request to code: it is the longest and the most expensive (allow 30 minutes).
- File graders match the `Write` call (the plan lives in a worktree whose path isn't known ahead), so an agent that writes a file with a shell heredoc fails them: read the LLM grader's verdict before calling it a bug.
- Not covered: state labels on GitHub (one state at a time, missing labels created) and pull requests, which need a real remote. So the `standard` and `full` lanes' proposal, and the lessons factory-build writes after a review, have no case yet.
- The cases that plan or build need a shell (git, worktrees), so they need the sandbox backend: macOS has it, Linux needs bubblewrap and socat. Without it, `ALLOW_TOOLS='Write Edit' evals/factory/run.sh --case 'trigger-*'` still runs the trigger cases.
- On macOS, `run.sh` puts `/opt/homebrew/bin` first on PATH when Homebrew git is installed (`brew install git`): `/usr/bin/git` is a launcher into Xcode that the sandbox cannot run, so plan and build cases fail without it.
- Results go to `results/` (git-ignored). Runs use your own Claude login.
