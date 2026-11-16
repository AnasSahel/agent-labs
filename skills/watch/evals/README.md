# Watch evals

5 cases for `incident-fact-check`, run with `claude plugin eval`. Companies and sources are invented; each case's `scaffold.sh` writes the cited pages into `./sources`, so nothing is fetched.

```bash
skills/watch/evals/run.sh --runs 3 --keep-temp -j 5
```

`run.sh` wraps the skills in a throwaway plugin `watch`. Results go to `results/` (git-ignored); runs use your own Claude login. Cases need no shell grant, so no sandbox is required.
