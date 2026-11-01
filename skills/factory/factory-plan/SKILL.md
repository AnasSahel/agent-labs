---
name: factory-plan
description: Plan phase. Turn a bug, idea or request into an intent — the problem in the originator's words, brainstormed until concrete — proposed to the repo as intent/<id>-<slug>.md in a pull request, whose merge is the user's go, and tracked by an issue in any tracker (GitHub, Linear, Plane, a folder in the repo…), one per feature that ships on its own. Use when someone brings a new bug, idea or request.
model: sonnet
metadata:
  author: Anas Sahel
  version: 1.2.0 # x-release-please-version
  credits: Plan phase of Anthropic's AI-native SDLC playbook (https://claude.com/resources/articles/the-ai-native-sdlc-playbook)
---

Turn a **request** into an **intent**: the problem, not the solution, in the originator's words, brainstormed until it's concrete. The intent reaches the repo as `intent/<id>-<slug>.md` through a **pull request**: merging it is the user's **go**, closing it is a no. Once merged, it's the reference every later step reads, and an **issue** tracks it. When a request asks for several things that could each go live on its own, write one intent for each.

The intent goes wherever the repo goes: it never says how the project could be attacked.

The skill works with any **tracker**. It needs four operations: list open issues, create one, comment on one, and set labels (or the tracker's own fields for kind, priority and size). Use whatever tool reaches it:

| Tracker | Tool |
|---|---|
| GitHub | `gh` CLI, with `--repo <owner/name>` |
| Linear, Plane, Jira… | its MCP server or CLI, when one is connected |
| Files | the intent file is the issue: labels and `status` in its front matter; comment by appending a `## Comment` section. Steps 6 and 7 are one: publishing is the intent's pull request, the file at `status: open` since its merge is the go; with no code host, committing it, with `status: open` after the user's go, or `status: needs-go` when another agent made the request (step 5). There is no body to replace and no pointer to write |

When the tracker has no tool in this session, say so and stop.

The go needs a **code host**: the repo's remote, with a tool that opens pull requests (`gh` for GitHub, `glab` for GitLab, an MCP server). With none, the user says go in the conversation and the intent is committed on the default branch.

## Steps

1. **Find the tracker.** Use the tracker and project the request names; otherwise the one the repo's `AGENTS.md`, `CLAUDE.md` or README points to; otherwise files, when the repo has an `intent/` folder; otherwise ask, offering what's connected in this session. Done when you know the repo, the tracker, the project in it, and the tool for each operation.

2. **Brainstorm.** Restate the request as the **problem**: who is affected, which systems, what goes wrong. A solution in the request is evidence, not the problem. Fill **title**, **problem**, **why now**, **success looks like** (what affected people can do once solved: observable, never a solution), **out of scope**, **constraints** (a deadline, budget, rule or system any solution must respect), **open questions** (for the spec to answer), **evidence** (logs, links, screenshots) and **source** (`user` or `agent:<name>`). A repo's own `intent/TEMPLATE.md` replaces these sections and fields, `source` aside. Keep the originator's words wherever they're clear.

   When the user made the request and `factory-brainstorm` is installed, call it with these fields as its destination, no trace path (the file name needs the issue's id: keep the trace as a draft and write it at step 7), scope inside, and approaches skipped (an intent names no solution); take its summary as the draft. Otherwise run a short version: ask only what the request and the code can't answer, at most 3 questions per round, each with a proposed default and the draft built on the defaults, so one answer settles both. Repeat until each field is concrete or the user says it's ready. When another agent made the request (a Claude session or bot), ask nothing, but look up what the code answers (what goes wrong today, where) and put it in problem and evidence; decisions it didn't state (who matters most, why now, success, out of scope, constraints) stay `[to fill]`.

   For a request with several parts that could each go live alone, draft one intent each and carry each through the next steps. Done when each problem fits in three sentences without naming a solution, and success is checkable (or `[to fill]` for another agent's request).

3. **Check for duplicates.** Compare the problem with every open issue: same users and same failure is a duplicate. Comment the new evidence on the existing issue and stop. Done when you've compared against all of them.

4. **Triage.** Set **kind** (`bug`, `feature`, `improvement`, `chore`), **priority** (`urgent`, `high`, `normal`, `low`) and **size** from the code touched (`S` one file, `M` a few files, `L` several areas or a migration; the bigger when unsure), each with one line of reasoning.

5. **Prepare the go.** With a code host the go is the merge of the intent's pull request, so don't ask for it. When the user made the request, show the draft intents so they correct them (or merge drafts into one): on a change, apply and show again; on no, publish nothing and stop; otherwise publish (steps 6 and 7). When another agent made the request, publish without showing: the user fills the `[to fill]` fields in the review.

   With no code host, ask for **go**; one go covers every intent shown. On a change, apply and show again; on no, stop. For another agent's request, skip the question: publish the issue with the draft as its body and the label `needs-go` (files: `status: needs-go`) and stop at step 6; when the user later says go on that issue, take its body as the draft and run step 7.

6. **Publish the issue.** Create each issue with kind, priority and size: the tracker's native field when it has one (Linear's priority), labels `kind:<kind>`, `priority:<priority>`, `size:<size>` otherwise. With a code host add `needs-go`: the issue waits for its intent's merge. Reuse existing labels; create only missing ones. Done when each issue exists and you have its id.

7. **Propose the intent.** Write `intent/<id>-<slug>.md` from the repo's `intent/TEMPLATE.md` (fill only its sections and fields, plus `status` with files and `## Decisions` at the end when there's a trace) or else `intent-template`; when factory-brainstorm ran, put its trace beside it as `intent/<id>-<slug>.decisions.md`, linked from `## Decisions`.
   - `<id>`: the issue's id without `#` (`42` GitHub, `ENG-42` Linear or Jira, `WEB-42` Plane); with files, the next free 3-digit number in `intent/` (`007`).
   - `<slug>`: the title lowercased, accents and punctuation dropped, filler words dropped (a, the, of, is, when, le, de, est…), at most 5 words joined by `-`: "Notes are lost when the page is reloaded" → `notes-lost-page-reloaded`.

   With a code host, create branch `intent/<id>-<slug>` from the default branch in its own worktree (`git worktree add`), commit the intent and trace, push, open a pull request `Intent · <title>`, then remove the worktree. Its body: the problem's first sentence, the triage, "Merge = go · close = reject", and the issue reference without a closing keyword (`Refs #42`, never `Closes #42`), so merging doesn't close the issue. With none, commit on the default branch.

   Except with files, replace the issue's body with the problem's first sentence and a link to the pull request (or the intent). Done when each intent's pull request is open (or the intent committed) and its issue links it (with files, the intent is the issue).

Reply with each issue's link and its intent's pull request (with files, the pull request once), waiting for the user's merge. With no code host: the intent's link (with files, its path once), or `needs-go` when it waits for the user.

## After the pull request

A later run on an issue whose intent pull request exists reads the decision from it:

- **review comments**: apply them on its branch, push, and answer each comment.
- **merged**: the go. Remove `needs-go`; the Design phase comes next.
- **closed without merge**: a no. Close the issue with the reason from the pull request, when there's one.
- **open, nothing new**: it waits for the user's merge; say so.

## Templates

Read [references/templates.md](references/templates.md) when a step writes one: `intent-template`.
