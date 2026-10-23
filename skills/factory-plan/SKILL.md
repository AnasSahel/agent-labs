---
name: factory-plan
description: Plan phase. Turn a bug, idea or request into an intent — the problem in the originator's words, brainstormed until concrete — committed to the repo as intent/<id>-<slug>.md and tracked by an issue in any tracker (GitHub, Linear, Plane, a folder in the repo…), one per feature that ships on its own, after the user's go. Use when someone brings a new bug, idea or request.
metadata:
  author: Anas Sahel
  version: 1.0.0 # x-release-please-version
  credits: Plan phase of Anthropic's AI-native SDLC playbook (https://claude.com/resources/articles/the-ai-native-sdlc-playbook)
---

Turn a **request** into an **intent**: the problem, not the solution, in the originator's words, brainstormed until it's concrete. Once the user says **go**, the intent is committed to the repo as `intent/<id>-<slug>.md`, the reference every later step reads, and an **issue** tracks it. When a request asks for several things that could each go live on its own, write one intent for each.

The intent goes wherever the repo goes: it never says how the project could be attacked.

The skill works with any **tracker**. It needs four operations: list open issues, create one, comment on one, and set labels (or the tracker's own fields for kind, priority and size). Use whatever tool reaches it:

| Tracker | Tool |
|---|---|
| GitHub | `gh` CLI, with `--repo <owner/name>` |
| Linear, Plane, Jira… | its MCP server or CLI, when one is connected |
| Files | the intent file is the issue: labels and `status` in its front matter; comment by appending a `## Comment` section. Steps 6 and 7 are one: publishing is writing and committing the intent, with `status: needs-go` while it waits for the user's go and `open` after it; there is no body to replace |

When the tracker has no tool in this session, say so and stop.

## Steps

1. **Find the tracker.** Use the tracker and project the request names; otherwise the one the repo's `AGENTS.md`, `CLAUDE.md` or README points to; otherwise files, when the repo has an `intent/` folder; otherwise ask, offering what's connected in this session. Done when you know the repo, the tracker, the project in it, and the tool for each operation.

2. **Brainstorm.** Restate the request as the **problem**: who is affected and what goes wrong. When the request proposes a solution, keep it as evidence. Fill **title**, **problem**, **why now**, **success looks like** (what the affected people can do once it's solved, observable, never a solution), **out of scope**, **evidence** (logs, links, screenshots) and **source** (`user`, or `agent:<name>`). Keep the originator's words wherever they're clear.

   When the user made the request and the `factory-brainstorm` skill is installed, call it with these fields as its destination, no trace path (the file name needs the issue's id: keep the trace it hands back as a draft and write it at step 7), scope inside (the problem lives in this project) and approaches skipped (an intent names no solution), and take its summary as the draft. Otherwise, run this short version: ask what the request and the code can't answer: at most 3 questions per round, each with a proposed default, and the draft built on those defaults beside them, so one answer settles both. Go round after round until each field is concrete; stop asking when the user says go. When another agent made the request (a Claude session or a bot, not a person), ask nothing, but still look up the facts the code answers (what goes wrong today, where) and put them in the problem and the evidence; only decisions it didn't state (who matters most, why now, success, out of scope) stay `[to fill]`.

   When the request asks for several things that could each go live on its own, draft one intent each and carry each through the next steps. Done when each problem fits in three sentences without naming a solution, and success looks like something you could check, or, for another agent's request, is `[to fill]`.

3. **Check for duplicates.** List the project's open issues and compare problems: same users and same failure means duplicate. On a duplicate, comment the new evidence on the existing issue and stop. Done when you've compared against every open issue.

4. **Triage.** Set **kind** (`bug`, `feature`, `improvement`, `chore`), **priority** (`urgent`, `high`, `normal`, `low`) and **size** from the code it touches (`S` one file, `M` a few files, `L` several areas or a migration). Read the code when it is at hand; pick the bigger size when unsure. Give one line of reasoning for each.

5. **Ask for go.** When the user made the request, show the draft intents and ask for **go**: they review and correct them, and what's committed is in their words. A go covers every intent shown, and the user can merge them back into one. On a change, apply it and show it again. On no, publish nothing and stop. When another agent made the request, skip the question: publish the issue with the draft as its body and the extra label `needs-go` (with files, `status: needs-go`), and stop at step 6; when the user later says go on that issue, take its body as the draft and run step 7.

6. **Publish the issue.** Create each issue with its kind, priority and size: the tracker's native field when it has one (Linear's priority, for instance), labels `kind:<kind>`, `priority:<priority>`, `size:<size>` otherwise. Reuse existing labels; create only the missing ones, so existing ones keep their colors. Done when each issue exists and you have its id.

7. **Commit the intent.** Write `intent/<id>-<slug>.md` with the template below and, when factory-brainstorm ran, its trace next to it as `intent/<id>-<slug>.decisions.md`, linked from the intent's `## Decisions`. Commit them on the default branch. Name it this way:
   - `<id>`: the issue's id as the tracker shows it, without `#`: `42` on GitHub, `ENG-42` on Linear or Jira, `WEB-42` on Plane. For files, the next free 3-digit number in `intent/` (`007`).
   - `<slug>`: from the title, lowercase, accents dropped (`é` → `e`), punctuation dropped, filler words dropped (articles, prepositions, auxiliaries: a, the, of, is, when, le, de, est…), at most 5 words joined by `-`. "Notes are lost when the page is reloaded" → `notes-lost-page-reloaded`.

   When the repo's rules or a protected branch forbid committing on the default branch, open a pull request with it instead: its merge is the acceptance. Then replace the issue's body with a pointer: the problem's first sentence and the link to the intent. Done when the intent (and its trace) is committed, or its PR is open, and the issue links it.

Reply with each issue's link and its intent's, or `needs-go` when it waits for the user.

<intent-template>

---
issue: <tracker reference>
title: <title>
source: <source>
kind: <kind>
priority: <priority>
size: <size>
status: <files only: needs-go | open>
---

# <title>

## Problem

<who is affected, what goes wrong>

## Why now

<value or cost of waiting>

## Success looks like

<what the affected people can do once it's solved, observable>

## Out of scope

<what this intent doesn't cover>

## Evidence

<logs, links, screenshots; the original proposal when the request came as a solution>

## Decisions

<link to intent/<id>-<slug>.decisions.md, when factory-brainstorm ran; otherwise drop this section>

</intent-template>
