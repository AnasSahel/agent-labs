# Carried by factory-run

When the factory-run skill says it **carries** the item, it owns the stops and names a branch. Then:

- **Step 1**: the go is the intent on that branch or on the default branch. Don't wait for a merge.
- **Step 8**: commit the spec, the mockup and its image on that branch as `Spec · <title>`, in its worktree. Open no pull request. Comment on the issue and set `needs-design` as written.
- **Step 9**: no gate here. Apply the user's own questions as step 9 says, so they don't wait. Set the spec's `status: designed` when no finding is `needs-decision`. Hand back the highest finding level, the questions that still wait for someone else with their owners, the questions applied, the assumptions, and the split when one is proposed: factory-run puts them in front of the user at its stop. When it later brings an answer or a review comment, settle it as step 9 says, on the same branch.

The public-repo rule of step 8 holds in every lane.
