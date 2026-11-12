# Carried by factory-run

When the factory-run skill says it **carries** the item, it owns the stops and names the lane and the branch. Then:

- **Part 1**: write the plan on that branch and commit it as `Plan · <title>`. Open no pull request and run no gate: set the state `needs-plan` and hand back whether the tech lead must accept (step 3's rule), with the assumptions.
- **`fast` lane**: Part 2 follows at once on the same branch, which is the code branch `<id>-<slug>` and already holds the intent, the spec and the plan. The plan's `accepted` is `with the pull request`. Step 5 opens the pull request, ready for review, its body starting with: "Fast lane: this pull request also carries the intent, the spec and the plan. Merging it approves them."
- **`standard` and `full` lanes**: Part 2 starts once factory-run says the proposal's pull request is merged. That merge accepted the plan: create the code branch `<id>-<slug>` from the default branch, write who merged and when in the plan's `accepted` as its first commit, and build.
