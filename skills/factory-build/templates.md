# Templates

Fill a template as it is: keep its headings, their order and its front matter fields.

<plan-template>

---
issue: <tracker reference>
spec: specs/<id>-<slug>.md
status: <needs-plan | planned; with no issue, then building | built | blocked>
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

<runs: <n>. Each failed check: what it saw, and the commit that fixed it>

## Lessons

<each line added to `factory/lessons.md` or raised, a line at `Seen` 2 with "make it a rule in `rules/`?", and each `factory` lesson; or drop the section>

## For AGENTS.md or CLAUDE.md

<each line proposed in step 4, or drop the section>

</pr-template>

<lessons-template>

# Lessons

What the factory learned on this project. Each station reads the lines marked for it before it starts. Delete a line that's wrong.

| Lesson | For | From | Seen |
|---|---|---|---|
| <what to do next time, one line> | <intake · design · plan · build · all> | <issue ids> | <n> |

</lessons-template>

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
