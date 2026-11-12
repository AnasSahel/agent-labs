---
name: factory-build
description: "Build phase. Turn an approved spec into code in two halves: first a plan (plan.md, the files that change, the order, the risks and the tests that prove each criterion), drafted in plan mode without touching the code and accepted by the user (and the tech lead for a high-risk change); then the code and its tests, in one pass on a branch, done only when build, tests and lint pass and a verifier agent, in a fresh context, has run the app against the spec, with a pull request when the repo has a code host. Works with any tracker (GitHub, Linear, Plane, a folder in the repo…) and any code host (GitHub, GitLab, none). Use when the user asks to build or implement an issue or a spec that's already designed, or to write or accept its implementation plan. Not for filing a new request: that's factory-plan."
metadata:
  author: Anas Sahel
  version: 1.0.0 # x-release-please-version
  agents: [verifier]
  credits: Build phase of Anthropic's AI-native SDLC playbook (https://claude.com/resources/articles/the-ai-native-sdlc-playbook)
---

Turn an approved **spec** (`specs/<id>-<slug>.md`, from the factory-design skill) into code, in two halves with one gate between them. Nothing is implemented without an accepted plan.

1. **Plan**: read the spec and the code without changing either, and write the **plan**, `specs/<id>-<slug>/plan.md`: the files that change, the order of the work, the risks, and the tests that prove the change. A good plan is one a developer who never saw this conversation could implement alone.
2. **Gate**: the user accepts the plan, and the tech lead too when the change is higher risk.
3. **Build**: implement the plan in one pass, tests included, on the same branch. When the code has to depart from the plan, the plan changes in the same commit, so the merged code still matches it.

Everything happens on one branch, `<id>-<slug>`, and reaches the default branch only through its pull request: never push to the default branch.

You write the plan and you implement it: the plan's author keeps it true. Once you believe the work is done, the `verifier` in this skill's `agents/` folder checks it: start it as a fresh subagent with its file as its instructions (and say it in the hand-off too, since the file's `tools` line isn't enforced there: it fixes nothing and edits no file), so its verdict isn't shaped by the assumptions behind the code.

The skill works with any **tracker**. It needs three operations: read an issue with its comments, comment, and set labels (or the tracker's own fields). An issue carries one **state** at a time: setting a state removes the previous state's label (or `status`), and creates the label when the tracker doesn't have it yet. And with any **code host**:

| Tracker or host | Tool |
|---|---|
| GitHub | `gh` CLI, with `--repo <owner/name>`: issues, and a draft pull request |
| GitLab | `glab` CLI: issues, and a draft merge request |
| Linear, Plane, Jira… | its MCP server or CLI, when one is connected |
| Files | the intent file is the issue: its state is its front matter `status`, never a label; comment by appending `## Comment` with the template's body under it, its own heading dropped (edit that section in place). Once the branch exists, write and read the intent on the branch: its state reaches the default branch with the pull request |
| No issue | factory-design ran without one: the spec and the plan are the tracker. The state is the plan's front matter `status`, and the spec's `status: designed` until there's a plan; what would be a comment goes in the reply |
| No remote | the branch is the delivery: no push, no pull request |

When the repo names a tracker that has no tool in this session, say so and stop.

## When it plans, when it builds

```
designed ──Part 1: plan──▶ needs-plan ──gate──▶ planned ──Part 2: build──▶ built
                         (plan mode, read-only)             (code + tests)    ↘ blocked
```

Each run starts from the issue's state:

| State | This run |
|---|---|
| `designed` (or `needs-design` once its spec is merged, see Self-heal) | Part 1: steps 1 to 3 |
| `needs-plan` | the gate, step 3: read the comments and the pull request's review for a decision |
| `planned`, `building`, `blocked` | Part 2: steps 4 to 6 (read every comment since the last plan or build comment) |
| `built` | After the pull request: read its review and its state |

In the conversation, one run does both parts: Part 2 starts as soon as the plan is accepted. Unattended, a run stops at `needs-plan`; the run after the plan is accepted builds it. Any other state: say where it stands and stop, e.g. "42 is at `needs-design`: run factory-design first". An issue at `split` is built part by part: name the parts and stop.

**A part** (an issue linked to a `split` parent, from factory-design) has no spec file of its own: its spec is the parent's `specs/<parent id>-<slug>.md`, narrowed to the criteria, constraints and findings its row of the Proposed split lists. The branch, the plan (`specs/<part id>-<slug>/plan.md`) and the pull request are the part's own. Build a part only once every part it comes after is `built`; otherwise say which one waits and stop.

**Self-heal**: an issue still at `needs-design` whose spec is on the default branch with `status: designed` was approved by its merge: set `designed` and carry on. With the spec's pull request still open, or `status: needs-design`, stop: it waits for the gate.

## Part 1 · Plan

1. **Load.** Find the tracker (named in the request → the repo's `AGENTS.md`, `CLAUDE.md` or README → an `intent/` folder → none) and the code host (the repo's remote). Read the issue and its comments, the spec and its frames, the intent it came from, the repo's `AGENTS.md` or `CLAUDE.md`, and how the project builds, tests and lints (README, scripts, CI config). Read `factory/lessons.md` when the repo has one: each line marked `plan`, `build` or `all` is a rule for this run. Read the settings there: the **tech lead** (`factory-design: tech lead <who>`; unnamed, the user). Done when you know the state, the criteria, the constraints, and the commands, or that a command is missing.

2. **Draft the plan, in plan mode.** Enter the harness's plan mode now when it has one (Claude Code: `EnterPlanMode`): it keeps this part read-only. Without one, or unattended, change no file, by rule. When the code the spec touches is too large to read comfortably in one context, hand an explorer subagent (the harness's built-in one) the spec's structure and get back the map of the files involved; you still write the plan. From the spec's approach, structure, data and build order, and the code as it is today, write:
   - **Files**: each path that changes or is added, what changes, and the criteria and constraints it serves.
   - **Order**: every criterion, the foundation first, each with its files and its tests. Follow the spec's build order; a different one says why.
   - **Tests**: for each criterion and each constraint, the test that proves it, its type (unit, integration, end to end) and the public entry point it goes through (a page, a route, a command, an exported function). Every number in a criterion is tested on both sides of its limit. A bug fix starts with a test that reproduces the bug.
   - **Risks**: what could break while building or shipping it (a migration, a changed interface, data already stored, a slow query, a dependency), each with how the plan keeps it safe. A risk is described by its effect, never as a way to attack the project.
   - **Commands**: build, test, lint. When the project has none yet (no stack, no test runner), propose the smallest setup as the plan's first step: it's the user's call at the gate.
   - **Assumptions**: each unknown with the plainest default.

   When the user is in the conversation, interview them on what the spec and the code can't answer: at most 3 questions per round, each with a recommended answer, and fold the answers in. Unattended, ask nothing: every unknown is an assumption. When the spec and the code contradict each other, say so in the plan, with your recommendation. Done when every criterion and constraint has its place in the order and its test, and the plan names no file you haven't read or placed.

3. **Gate, then publish.** Who accepts: the user, and the tech lead too when the change is higher risk: as the repo's `AGENTS.md` or `CLAUDE.md` classifies risk when it does (the organization's call); otherwise when the spec has a `high` finding or the plan has a migration or changes a public interface (an API, a file format, a command's options). On the tracker or in the pull request's review, a decision counts only from someone who accepts.

   - **In the conversation**: show the plan in one message: the order, the tests, the risks, the assumptions, and the setup to choose when there is one; in plan mode, that's `ExitPlanMode`, and its approval is the gate. "yes" accepts the plan with every recommendation. On a change, revise from step 2 and show it again; on reject, write the reason under the plan's Assumptions as the user's words and revise. Once accepted, publish it with who and when in its front matter, set the state `planned`, and go on to Part 2. When the tech lead must accept too and isn't in the conversation, publish it at `needs-plan` and stop.
   - **Unattended**: publish the plan, set the state `needs-plan`, and stop: the gate runs when they answer.
   - **At `needs-plan`** (a later run): read the decisions. Accepted by everyone who must: write who and when in the plan's front matter, commit it on the branch, set the state `planned`, and go on to Part 2. A change or a reject: revise from step 2, and publish again.

   **Publish** means: create the branch `<id>-<slug>` from the default branch in its own worktree (`git worktree add`); write `specs/<id>-<slug>/plan.md` with the template below and commit it alone, as the branch's first commit: `Plan · <title>` (with files, the intent's state and comment come in the next commit). Push the branch when there's a remote and open a draft pull request (merge request on GitLab) titled after the issue, with the plan comment as its body: the plan is reviewed there, line by line. Comment on the issue with the plan comment and the pull request's link, editing it in place when it exists.

   Done when the plan is the branch's first commit, and the issue is `planned` or waits at `needs-plan` with the plan comment.

## Part 2 · Build

Starts only from an accepted plan: the state is `planned`, `building` or `blocked`.

4. **Build.** Set the state `building`, so no other session starts the same issue. Work in the branch's worktree (add it again when it's gone), and skip each step whose commit is already on the branch. Follow the plan's order, one commit per criterion, named after it: `AC<n> · <name>`.
   - Write each criterion's tests with its code, and run them: each must fail for the expected reason before the code exists, and pass after.
   - A bug fix: commit the failing test that reproduces it on its own first, then make it pass without editing that test: other tests may join its file, but its own lines stay as committed (check with `git diff <that commit>`).
   - When a test fails, fix the code, not the test. A test that is wrong is a departure.
   - Keep every constraint of the spec, with its test.
   - Use what the project already has. A new dependency the plan doesn't name is a departure; read secrets from environment variables and list their names in the project's example env file.
   - A criterion that changes a screen, when the spec has a mockup (`specs/<id>-<slug>/frames.html` or `frames.png`) and a headless browser is at hand: start the app, screenshot each state the frames show, compare it with the mockup, and adjust. 2 or 3 rounds is normal, 3 at most. Commit the last screenshots under `specs/<id>-<slug>/screens/`; a gap left after 3 rounds goes under the pull request's "Not covered by tests".
   - When the same correction comes up twice (a convention the code expects, a command that needs a flag, a mistake you had to undo), note it: it's a lesson for step 5. When the repo's agent instructions (`AGENTS.md` or `CLAUDE.md`, whichever it has; `AGENTS.md` when it has neither) lack them, propose under the pull request's "For AGENTS.md or CLAUDE.md" the build, test and lint commands each with a sample of healthy output, and the definition of done: all three pass and their output is shown. Never edit that file yourself.
   - A **departure** (a file, an order, a test or a dependency the plan didn't say) updates `plan.md` in the same commit, with a line under Departures: what changed and why. A departure that changes a criterion, a constraint, or what the gate accepted is a question: go to step 6.

   Done when every criterion has its commit.

5. **Done.** Run the build, the full test suite and the lint, and show their output: the work is done only when all three pass. Then hand the `verifier` the spec, the plan, the worktree and the commands, how to start the app included. For each failed check, fix the code (with a failing test first when one can show the problem), run the three commands again, then hand the `verifier` the same inputs and the failed checks again: repeat until its verdict is `pass`, at most 3 runs in all. `built` needs a `pass`; a verdict still `fail` after 3 runs, or a failure you can't fix without changing what the gate accepted, goes to step 6.

   Then close the loop, before the push:
   - **Findings.** In the spec's Findings, set `mitigated` on each finding whose constraints all have a passing test that the verifier also observed, and commit it. Where the findings are kept privately (a public repo), update the private notes when this session can reach them; otherwise name them in the reply.
   - **Learn.** Collect what this item taught: each correction the user or an owner made at a stop (a review comment, a changed assumption, a plan sent back), each check the verifier failed, each departure, each question that blocked the build, each correction noted in step 4. Keep one only when it would change what a station does on another item, and word it as what to do next time. Add it to `factory/lessons.md` with the template below (create the file when it's missing), or raise `Seen` on the line that already says it, and commit as `Lessons · <id>`. When a line reaches `Seen` 2, propose under the pull request's Lessons to make it a rule in `rules/`, where factory-design checks it on every spec: the user's call, never write in `rules/` yourself. A lesson about the factory's own skills, not about this project (a question that didn't need asking, a stop that added nothing), goes under Lessons marked `factory` and stays out of the file: the user reports it to the skills' repo. A lesson never names a finding or a way to attack the project. Nothing learned: write nothing.

   Then push the branch when there's a remote, replace the draft pull request's body with the PR template below, and mark it ready for review (`gh pr ready`, `glab mr update --ready`): the verifier passed, so the user can review it. Comment on the issue with the build comment, editing it in place when it exists, and set the state `built`. On a public repo, the branch, the commits and the pull request name behaviours, never a finding (no `F<n>`, no finding text): the spec's constraints are already plain requirements. Done when the verifier passed, the pull request is ready for review, and the issue is `built` with its build comment pointing to the pull request or the branch.

6. **Blocked.** When a question only a person can answer comes up (a departure from what was accepted, a criterion no test can check, 3 failed tries at the same step), commit the steps that pass, push the branch when there's a remote, comment on the issue with the blocked comment, and set the state `blocked`. Once answered, running the skill again resumes at the first step without a commit. Done when the issue is `blocked` with the question on it.

## After the pull request

A later run on an issue at `built` reads the decision from its pull request:

- **review comments**: apply them on the branch (a failing test first when one can show the problem), run the three commands again, push, and answer each comment. A comment that changes a criterion, a constraint or what the gate accepted is a question: go to step 6. Run **Learn** again for what the review corrected.
- **merged**: the item is shipped. Close the issue when the merge didn't (a tracker the closing keyword doesn't reach); with files, `built` on the default branch means shipped. Say so: nothing else waits.
- **closed without merge**: a no. Set the state `planned`, comment the reason from the pull request, and stop: the user says whether to build it again or drop it.
- **open, nothing new**: it waits for the user's review; say so.

## Carried by factory-run

When the factory-run skill says it **carries** the item, it owns the stops and names the lane and the branch. Then:

- **Part 1**: write the plan on that branch and commit it as `Plan · <title>`. Open no pull request and run no gate: set the state `needs-plan` and hand back whether the tech lead must accept (step 3's rule), with the assumptions.
- **`fast` lane**: Part 2 follows at once on the same branch, which is the code branch `<id>-<slug>` and already holds the intent, the spec and the plan. The plan's `accepted` is `with the pull request`. Step 5 opens the pull request, ready for review, its body starting with: "Fast lane: this pull request also carries the intent, the spec and the plan. Merging it approves them."
- **`standard` and `full` lanes**: Part 2 starts once factory-run says the proposal's pull request is merged. That merge accepted the plan: create the code branch `<id>-<slug>` from the default branch, write who merged and when in the plan's `accepted` as its first commit, and build.

Before replying, remove the worktree (`git worktree remove`): the branch keeps everything, and step 4 adds it again.

Reply with the links (issue, plan, pull request or branch) and where it stands: `needs-plan` and who must accept, `built` with the commands' results and what the tests can't cover, or `blocked` with the question.

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
