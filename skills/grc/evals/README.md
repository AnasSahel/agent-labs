# GRC evals

24 cases for the 12 GRC skills, run with `claude plugin eval` against the Acme Pay sample in [fixture/grc](fixture/grc).

```bash
skills/grc/evals/run.sh --runs 3 --keep-temp -j 6 --max-cost-usd 100
skills/grc/evals/check-citations.py skills/grc/evals/results/<timestamp>
```

- `run.sh` wraps the skills in a throwaway plugin `grc` (so they call each other as `grc:<skill>`), and each case's `scaffold.sh` copies the fixture into its sandbox.
- `check-citations.py` flags every ISO 27001 ref or NIS2, DORA, GDPR article the agent cited that `frameworks/` doesn't hold. It reads the run traces, so pass `--keep-temp`.
- Cases are generated: edit `gen-cases.py`, run it from this folder. Grilling skills are judged on their first turn (one question, `Q1/<budget>`, a recommendation cited to a clause, nothing `grc/context.md` already answers); `grill-resume` scaffolds an in-progress trace.
- Results go to `results/` (git-ignored). Runs use your own Claude login.
