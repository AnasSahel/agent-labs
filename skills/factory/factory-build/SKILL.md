---
name: factory-build
description: "Build phase. Turn an approved spec into code in two halves: first a plan (plan.md, the files that change, the order, the risks and the tests that prove each criterion), drafted in plan mode without touching the code and accepted by the user (and the tech lead for a high-risk change); then the code and its tests, in one pass on a branch, done only when build, tests and lint pass and a verifier agent, in a fresh context, has run the app against the spec, with a pull request when the repo has a code host. Works with any tracker (GitHub, Linear, Plane, a folder in the repo…) and any code host (GitHub, GitLab, none). Use when the user asks to plan or build an issue, a spec or an intent, or to implement a designed feature."
metadata:
  author: Anas Sahel
  version: 1.0.0 # x-release-please-version
  agents: [verifier]
  credits: Build phase of Anthropic's AI-native SDLC playbook (https://claude.com/resources/articles/the-ai-native-sdlc-playbook)
---

Turn an approved **spec** (`specs/<id>-<slug>.md`, from factory-design) into code, in two halves with one gate between them. Nothing is implemented without an accepted plan.

1. **Plan**: read the spec and the code, change neither, and write `specs/<id>-<slug>/plan.md`: files, order, risks, and the test that proves each criterion. A developer who never saw this conversation could implement it alone.
2. **Gate**: the user accepts the plan, and the tech lead too for a higher-risk change.
3. **Build**: implement the plan in one pass, tests included. A departure from the plan updates it in the same commit.

All work is on one branch, `<id>-<slug>`, and reaches the default branch only through its pull request. You write the plan and implement it; once you believe it's done, the `verifier` in `agents/` checks it as a fresh subagent, so its verdict isn't shaped by the code's assumptions.

The **tracker** needs three operations: read an issue with its comments, comment, and set labels (or the tracker's own fields). With no tool for it in this session, say so and stop.

| Tracker or host | Tool |
|---|---|
| GitHub | `gh` CLI with `--repo <owner/name>`: issues, draft pull request |
| GitLab | `glab` CLI: issues, draft merge request |
| Linear, Plane, Jira… | its MCP server or CLI, when connected |
| Files | the intent file is the issue: its state is its front matter `status`, never a label; comment by appending `## Comment` (template body, own heading dropped; edit in place). Once the branch exists, read and write the intent there: its state reaches the default branch with the pull request |
| No remote | the branch is the delivery: no push, no pull request |

## Models

Defaults: the plan on `opus`; the code, tests and `verifier` on `sonnet`. In the fast lane the plan is on `sonnet` too. A weaker session at Part 1 drafts the plan in an `opus` subagent; an `opus` session at Part 2 may hand the code to a `sonnet` subagent. A repo overrides with `factory: model <step> <opus | sonnet | haiku>` in its `AGENTS.md` or `CLAUDE.md`. Say when a step ran below its default.

## States

```
designed ──Part 1: plan──▶ needs-plan ──gate──▶ planned ──Part 2: build──▶ built
                         (plan mode, read-only)             (code + tests)    ↘ blocked
```

| State | This run |
|---|---|
| `designed` | Part 1, steps 1 to 3 |
| `needs-plan` | the gate (step 3): read the comments and the pull request's review for a decision |
| `planned`, `building`, `blocked` | Part 2, steps 4 to 6, reading every comment since the last plan or build comment |

In the conversation one run does both parts. Unattended, it stops at `needs-plan` and the next run builds. Any other state: say where it stands and stop ("42 is at `needs-design`: run factory-design first"). At `split`, name the parts and stop.

## Part 1 · Plan

1. **Load.** Find the tracker (the request → `AGENTS.md`, `CLAUDE.md` or README → an `intent/` folder → none) and the code host (the remote). Read the issue and comments, the spec and its frames, the intent, `AGENTS.md` or `CLAUDE.md`, and how the project builds, tests and lints. Read the **tech lead** (`factory-design: tech lead <who>`; unnamed, the user). Done when you know the state, criteria, constraints and commands, or that a command is missing.

2. **Draft the plan.** Enter plan mode when the harness has it (`EnterPlanMode`); otherwise, and unattended, change no file. When the code is too large for one context, have the built-in explorer subagent map the files; you still write the plan. Write:
   - **Files**: each path changed or added, what changes, the criteria and constraints it serves.
   - **Order**: every criterion, foundation first, with its files and tests. Follow the spec's build order; a different one says why.
   - **Tests**: per criterion and constraint, the test, its type and the public entry point it goes through (page, route, command, exported function). Test every number on both sides of its limit. A bug fix starts with a test that reproduces it.
   - **Risks**: what could break while building or shipping (migration, changed interface, stored data, slow query, dependency), each with how the plan keeps it safe. Describe effects, never ways to attack the project.
   - **Commands**: build, test, lint. With none, make the smallest setup the plan's first step, for the user to decide at the gate.
   - **Assumptions**: each unknown with the plainest default.

   In the conversation, ask only what the spec and code can't answer: at most 3 questions per round, each with a recommended answer. Unattended, ask nothing. If the spec and the code contradict, say so with your recommendation. Done when every criterion and constraint has a place in the order and a test, and no file is named that you haven't read or placed.

3. **Gate, then publish.** In the **fast lane** (factory-run found a size `S`, non-risky change) publish the plan without acceptance, set `planned` and go to Part 2; a migration or public-interface change leaves the fast lane and takes the gate below.

   The user accepts, and the tech lead too when the change is higher risk: as the repo's `AGENTS.md` or `CLAUDE.md` classifies it, otherwise when the spec has a `high` finding or the plan has a migration or changes a public interface (API, file format, command options). A decision counts only from someone who accepts.
   - **In the conversation**: show the order, tests, risks, assumptions and any setup to choose, in one message (in plan mode, `ExitPlanMode` is the gate). "yes" accepts every recommendation. A change: revise from step 2. A reject: write the reason under Assumptions as the user's words and revise. Once accepted, publish with who and when in the front matter, set `planned`, go to Part 2. If the tech lead must accept and isn't here, publish at `needs-plan` and stop.
   - **Unattended**: publish, set `needs-plan`, stop.
   - **At `needs-plan`**: read the decisions. All accepted: record who and when, commit, set `planned`, go to Part 2. Otherwise revise from step 2 and publish again.

   **Publish**: create branch `<id>-<slug>` from the default branch in its own worktree (`git worktree add`); write `specs/<id>-<slug>/plan.md` from `plan-template` and commit it alone, first on the branch, as `Plan · <title>` (with files, the intent's state and comment come in the next commit). Push when there's a remote and open a draft pull request (merge request on GitLab) titled after the issue, the plan comment as its body. Comment on the issue with the plan comment and the link, editing in place.

   Done when the plan is the branch's first commit and the issue is `planned` or at `needs-plan` with the plan comment.

## Part 2 · Build

Starts only from `planned`, `building` or `blocked`.

4. **Build.** Set `building`, so no other session takes the issue. Work in the branch's worktree (re-add it if gone) and skip steps whose commit exists. Follow the plan's order, one commit per criterion: `AC<n> · <name>`.
   - Write each criterion's tests with its code. Each fails for the expected reason before the code and passes after.
   - Bug fix: commit the reproducing failing test alone first, then make it pass without editing its lines (check `git diff <that commit>`).
   - A failing test means fix the code. A wrong test is a departure.
   - Keep every constraint of the spec, with its test.
   - Use what the project has. A dependency the plan doesn't name is a departure. Read secrets from environment variables and list their names in the example env file.
   - For a screen with a mockup (`specs/<id>-<slug>/frames.html` or `.png`) and a headless browser: start the app, screenshot each state, compare, adjust, at most 3 rounds. Commit the last screenshots to `specs/<id>-<slug>/screens/`; a gap left goes under "Not covered by tests".
   - A correction needed twice (a convention, a command flag, a mistake undone) belongs in `AGENTS.md` or `CLAUDE.md` (`AGENTS.md` when neither exists): propose the line under the pull request's "For AGENTS.md or CLAUDE.md", with the build, test and lint commands (each with sample healthy output) and the definition of done (all three pass, output shown) when missing. Never edit that file yourself.
   - A **departure** (a file, order, test or dependency the plan didn't say) updates `plan.md` in the same commit with a line under Departures: what and why. One that changes a criterion, a constraint or what the gate accepted is a question: go to step 6.

   Done when every criterion has its commit.

5. **Done.** Run build, the full tests and lint, and show the output: all three must pass. Then hand the `verifier` the spec, plan, worktree and commands (how to start the app included). It runs once. Fix each failed check (with a failing test first when one can show it), rerun the three commands, and don't rerun the verifier. A failure you can't fix without changing what the gate accepted goes to step 6. Then push, replace the draft pull request's body with `pr-template` (it stays a draft until verified), comment on the issue with `build-comment` (edit in place) and set `built`. On a public repo, branch, commits and pull request name behaviours, never a finding (no `F<n>`, no finding text). Done when the issue is `built` with its comment pointing to the pull request or branch.

6. **Blocked.** When only a person can answer (a departure from what was accepted, a criterion no test can check, 3 failed tries at one step), commit what passes, push, comment with `blocked-comment`, and set `blocked`. Running the skill again resumes at the first step without a commit. Done when the issue is `blocked` with the question on it.

Reply with the links (issue, plan, pull request or branch) and where it stands: `needs-plan` and who must accept, `built` with the commands' results and what the tests can't cover, or `blocked` with the question.

## Templates

Read [references/templates.md](references/templates.md) when a step writes one: `plan-template`, `plan-comment`, `pr-template`, `build-comment`, `blocked-comment`.
