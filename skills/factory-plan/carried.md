# Carried by factory-run

When the factory-run skill says it **carries** the request, it owns the stops. After step 4, give it the size and take the **lane** it names:

- `full`: go on as written. The intent has its own pull request, and its merge is the go.
- `fast` or `standard`: skip step 5 (show nothing, ask for no go). Publish the issue (step 6) without `needs-go`. Then write the intent and its trace (step 7's names and template, with `lane: <lane>` added to the front matter) on the branch factory-run names, created from the default branch in its own worktree, and commit them there as `Intent · <title>`. Open no pull request: the go comes with the lane's stop. The issue's pointer links the intent on that branch.
