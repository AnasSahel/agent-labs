# Factory evals

11 cases for the Factory skills, run with `claude plugin eval` against the Notes sample in [fixture/notes-app](fixture/notes-app).

```bash
skills/factory/evals/run.sh --runs 3 --keep-temp -j 4 --max-cost-usd 50
```

- `run.sh` wraps the skills in a throwaway plugin `factory` (so they call each other as `factory:<skill>`). Each case's `scaffold.sh` copies the sample app and the intents it needs from [fixture/intents](fixture/intents) into its sandbox.
- No code host and no tracker: the repo's `AGENTS.md` says files, so every case runs the Files tracker.
- Cases are generated: edit `gen-cases.py`, run it from this folder.
- Needs a sandbox backend (`bubblewrap` and `socat` on Linux); on macOS it works as is. Results go to `results/` (git-ignored). Runs use your own Claude login.

| Skill | Cases | What they check |
|---|---|---|
| factory-run | run-fast-lane, run-full-lane-size, run-full-lane-risky, run-where-is-it | lane choice and reason, status block, no asking for permission |
| factory-plan | plan-duplicate, plan-questions, plan-other-agent | duplicate caught, at most 3 questions, nothing asked of another agent |
| factory-design | design-intent-not-merged, design-unattended | stops before the go, no question before the gate |
| factory-build | build-wrong-state | refuses a state it can't build from |
| factory-brainstorm | brainstorm-round | one round, 3 questions, recommended answers |
