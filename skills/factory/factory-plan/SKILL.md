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

2. **Brainstorm.** Restate the request as the **problem**: who is affected, which systems are involved, and what goes wrong. When the request proposes a solution, keep it as evidence. Fill **title**, **problem**, **why now**, **success looks like** (what the affected people can do once it's solved, observable, never a solution), **out of scope**, **constraints** (what any solution must respect: a deadline, a budget, a rule, a system it can't change), **open questions** (what the brainstorm left unknown, for the spec to answer), **evidence** (logs, links, screenshots) and **source** (`user`, or `agent:<name>`). When the repo has its own `intent/TEMPLATE.md`, its sections and front matter fields replace these, `source` aside: the team chose them. Keep the originator's words wherever they're clear.

   When the user made the request and the `factory-brainstorm` skill is installed, call it with these fields as its destination, no trace path (the file name needs the issue's id: keep the trace it hands back as a draft and write it at step 7), scope inside (the problem lives in this project) and approaches skipped (an intent names no solution), and take its summary as the draft. Otherwise, run this short version: ask what the request and the code can't answer: at most 3 questions per round, each with a proposed default, and the draft built on those defaults beside them, so one answer settles both. Go round after round until each field is concrete; stop asking when the user says it's ready. When another agent made the request (a Claude session or a bot, not a person), ask nothing, but still look up the facts the code answers (what goes wrong today, where) and put them in the problem and the evidence; only decisions it didn't state (who matters most, why now, success, out of scope, constraints) stay `[to fill]`.

   When the request asks for several things that could each go live on its own, draft one intent each and carry each through the next steps. Done when each problem fits in three sentences without naming a solution, and success looks like something you could check, or, for another agent's request, is `[to fill]`.

3. **Check for duplicates.** List the project's open issues and compare problems: same users and same failure means duplicate. On a duplicate, comment the new evidence on the existing issue and stop. Done when you've compared against every open issue.

4. **Triage.** Set **kind** (`bug`, `feature`, `improvement`, `chore`), **priority** (`urgent`, `high`, `normal`, `low`) and **size** from the code it touches (`S` one file, `M` a few files, `L` several areas or a migration). Read the code when it is at hand; pick the bigger size when unsure. Give one line of reasoning for each.

5. **Prepare the go.** With a code host, the go is the merge of the intent's pull request, so don't ask for it here. When the user made the request, show the draft intents: they correct them, so what's proposed is in their words, and they can merge drafts back into one. On a change, apply it and show it again; on no, publish nothing and stop; otherwise publish (steps 6 and 7). When another agent made the request, publish without showing anything: the user fills the `[to fill]` fields in the pull request's review.

   With no code host, ask for **go** instead. A go covers every intent shown; on a change, apply it and show it again; on no, publish nothing and stop. When another agent made the request, skip the question: publish the issue with the draft as its body and the extra label `needs-go` (with files, `status: needs-go`), and stop at step 6; when the user later says go on that issue, take its body as the draft and run step 7.

6. **Publish the issue.** Create each issue with its kind, priority and size: the tracker's native field when it has one (Linear's priority, for instance), labels `kind:<kind>`, `priority:<priority>`, `size:<size>` otherwise. With a code host, add `needs-go`: the issue waits for its intent's merge. Reuse existing labels; create only the missing ones, so existing ones keep their colors. Done when each issue exists and you have its id.

7. **Propose the intent.** Write `intent/<id>-<slug>.md` with the repo's own `intent/TEMPLATE.md` when it has one (the organization's template: fill only its sections and fields, plus `status` with files and `## Decisions` at the end when there's a trace), otherwise the template below, and, when factory-brainstorm ran, its trace next to it as `intent/<id>-<slug>.decisions.md`, linked from the intent's `## Decisions`. Name it this way:
   - `<id>`: the issue's id as the tracker shows it, without `#`: `42` on GitHub, `ENG-42` on Linear or Jira, `WEB-42` on Plane. For files, the next free 3-digit number in `intent/` (`007`).
   - `<slug>`: from the title, lowercase, accents dropped (`é` → `e`), punctuation dropped, filler words dropped (articles, prepositions, auxiliaries: a, the, of, is, when, le, de, est…), at most 5 words joined by `-`. "Notes are lost when the page is reloaded" → `notes-lost-page-reloaded`.

   With a code host, create the branch `intent/<id>-<slug>` from the default branch in its own worktree (`git worktree add`), commit the intent and its trace there, push, and open a pull request titled `Intent · <title>`. Its body: the problem's first sentence, the triage, "Merge = go · close = reject", and the issue's reference without a closing keyword (`Refs #42`, never `Closes #42`): merging the intent must not close the issue. Then remove the worktree. With no code host, commit them on the default branch.

   Except with files, replace the issue's body with a pointer: the problem's first sentence and the link to the pull request (with no code host, to the intent). Done when each intent's pull request is open, or the intent is committed, and its issue links it (with files, the intent is the issue).

Reply with each issue's link and its intent's pull request (with files, the pull request once), waiting for the user's merge. With no code host: the intent's link (with files, its path once), or `needs-go` when it waits for the user.

## After the pull request

A later run on an issue whose intent pull request exists reads the decision from it:

- **review comments**: apply them on its branch, push, and answer each comment.
- **merged**: the go. Remove `needs-go`; the Design phase comes next.
- **closed without merge**: a no. Close the issue with the reason from the pull request, when there's one.
- **open, nothing new**: it waits for the user's merge; say so.

<intent-template>

---
issue: <tracker reference>
title: <title>
source: <source>
kind: <kind>
priority: <priority>
size: <size>
status: <files only: open; with no code host, needs-go | open>
---

# <title>

## Problem

<who is affected, which systems are involved, what goes wrong>

## Why now

<value or cost of waiting>

## Success looks like

<what the affected people can do once it's solved, observable>

## Out of scope

<what this intent doesn't cover>

## Constraints

<what any solution must respect: deadline, budget, rules, systems it can't change; "None known" when there are none>

## Open questions

<what's still unknown, for the spec to answer; "None" when there are none>

## Evidence

<logs, links, screenshots; the original proposal when the request came as a solution>

## Decisions

<link to intent/<id>-<slug>.decisions.md, when factory-brainstorm ran; otherwise drop this section>

</intent-template>
