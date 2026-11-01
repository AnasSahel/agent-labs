<plan-template>

---
issue: <tracker reference>
spec: specs/<id>-<slug>.md
status: <needs-plan | planned>
accepted: <who, date; for a higher-risk change, the tech lead too>
---

# Plan · <title>

**Approach**: <the spec's chosen option, in one or two sentences>

## Files

| Path | Change | For |
|---|---|---|
| <path> | <add, change, remove: what> | AC1, C2 |

## Order

1. **AC1 · <name>**: <files> · tests: <test names>

## Tests

| For | Test | Type | Entry point |
|---|---|---|---|
| AC1 | <test name: case> | <unit, integration, end to end> | <page, route, command, function> |

## Risks

| Risk | Effect | Kept safe by |
|---|---|---|

"None." when there's none.

## Commands

- Build: `<command>`
- Test: `<command>`
- Lint: `<command>`

## Assumptions

## Departures

<written while building: each change to this plan, and why; "None." until then>

</plan-template>

<plan-comment>

## Plan

**Steps** <n> · **Tests** <n> · **Risks** <n> · **Plan** <link or path>

<details>
<summary>Order (<n>)</summary>

1. **AC1 · <name>**: <files>

</details>

**Waiting for** <who accepts, mentioned in the tracker's way>: reply "yes", or what to change.

</plan-comment>

<pr-template>

Closes <issue reference>. Spec: <link> · Plan: <link>

## Criteria

- [x] **AC1 · <name>** · `<test file>`

## Check it

```
<the build, test and lint commands, and their summary lines>
```

## Departures from the plan

<each line from the plan's Departures, or "None.">

## Not covered by tests

<what no automated test can check, or "Nothing.">

## Verifier

**Verdict** <pass | fail> · **Checks** <n> · **App** <started | not started: why>

<each failed check: what it saw, and the commit that fixed it>

## For AGENTS.md or CLAUDE.md

<each line proposed in step 4, or drop the section>

</pr-template>

<build-comment>

## Build

**Criteria** <n> · **Branch** `<branch>` · **Pull request** <link, or "none (no remote)"> · **Departures** <n>

</build-comment>

<blocked-comment>

## Blocked in Build

**Stopped at** <AC<n> · <name>, or "setup"> · **Branch** `<branch>`

<the question, with your recommended answer>

Answer here, then run the skill again.

</blocked-comment>
