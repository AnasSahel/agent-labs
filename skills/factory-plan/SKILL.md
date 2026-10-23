---
name: factory-plan
description: Plan phase. Turn a bug, idea or request into an intent — the problem in the originator's words, brainstormed until concrete — committed to the repo as intent/<id>-<slug>.md and tracked by an issue in any tracker (GitHub, Linear, Plane, a folder in the repo…), one per feature that ships on its own, after the user's go. Use when someone brings a new bug, idea or request.
metadata:
  author: Anas Sahel
  version: 2.0.0
  credits: Plan phase of Anthropic's AI-native SDLC playbook (https://claude.com/resources/articles/the-ai-native-sdlc-playbook)
---

Turn a **request** into an **intent**: the problem, not the solution, in the originator's words, brainstormed until it's concrete. Once the user says **go**, the intent is committed to the repo as `intent/<id>-<slug>.md`, the reference every later step reads, and an **issue** tracks it. A request that holds several features that ship apart becomes one intent per feature.

The intent goes wherever the repo goes: it never says how the project could be attacked.

The skill works with any **tracker**. It needs four operations: list open issues, create one, comment on one, and set labels (or the tracker's own fields for kind, priority and size). Use whatever tool reaches it:

| Tracker | Tool |
|---|---|
| GitHub | `gh` CLI, with `--repo <owner/name>` |
| Linear, Plane, Jira… | its MCP server or CLI, when one is connected |
| Files | the intent file is the issue: labels and `status` in its front matter; comment by appending a `## Comment` section |

When the tracker has no tool in this session, say so and stop.

## Steps

1. **Find the tracker.** Use the tracker and project the request names; otherwise the one the repo's `AGENTS.md`, `CLAUDE.md` or README points to; otherwise files, when the repo has an `intent/` folder; otherwise ask, offering what's connected in this session. Done when you know the repo, the tracker, the project in it, and the tool for each operation.

2. **Brainstorm.** Restate the request as the **problem**: who is affected and what goes wrong. When the request proposes a solution, keep it as evidence. Fill **title**, **problem**, **why now**, **success looks like** (what the affected people can do once it's solved, observable, never a solution), **out of scope**, **evidence** (logs, links, screenshots) and **source** (`user`, or `agent:<name>`). Keep the originator's words wherever they're clear.

   When the user made the request, ask what the request and the code can't answer: at most 3 questions per round, each with a proposed default, and the draft built on those defaults beside them, so one answer settles both. Go round after round until each field is concrete; stop asking when the user says go. When another agent made the request, ask nothing: leave what it didn't say as `[to fill]`.

   When the request holds several problems that each ship on their own, draft one intent each and carry each through the next steps. Done when each problem fits in three sentences without naming a solution, and success looks like something you could check.

3. **Check for duplicates.** List the project's open issues and compare problems: same users and same failure means duplicate. On a duplicate, comment the new evidence on the existing issue and stop. Done when you've compared against every open issue.

4. **Triage.** Set **kind** (`bug`, `feature`, `improvement`, `chore`), **priority** (`urgent`, `high`, `normal`, `low`) and **size** from the code it touches (`S` one file, `M` a few files, `L` several areas or a migration). Read the code when it is at hand; pick the bigger size when unsure. Give one line of reasoning for each.

5. **Ask for go.** When the user made the request, show the draft intents and ask for **go**: they review and correct them, and what's committed is in their words. A go covers every intent shown, and the user can merge them back into one. On a change, apply it and show it again. On no, publish nothing and stop. When another agent made the request, skip the question: publish the issue with the draft as its body and the extra label (or status) `needs-go`, and stop at step 6; when the user later says go on that issue, take its body as the draft and run step 7.

6. **Publish the issue.** Create each issue with its kind, priority and size: the tracker's native field when it has one (Linear's priority, for instance), labels `kind:<kind>`, `priority:<priority>`, `size:<size>` otherwise. Reuse existing labels; create only the missing ones, so existing ones keep their colors. Done when each issue exists and you have its id.

7. **Commit the intent.** Write `intent/<id>-<slug>.md` with the template below, and commit it on the default branch. Name it this way:
   - `<id>`: the issue's id as the tracker shows it, without `#`: `42` on GitHub, `ENG-42` on Linear or Jira, `WEB-42` on Plane. For files, the next free 3-digit number in `intent/` (`007`).
   - `<slug>`: from the title, lowercase, accents dropped (`é` → `e`), punctuation dropped, filler words dropped (a, the, of, le, la, de…), at most 5 words joined by `-`. "Notes are lost when the page is reloaded" → `notes-lost-page-reloaded`.

   When the repo's rules or a protected branch forbid committing on the default branch, open a pull request with it instead: its merge is the acceptance. Then replace the issue's body with a pointer: the problem's first sentence and the link to the intent. Done when the intent is committed (or its PR is open) and the issue links it.

Reply with each issue's link and its intent's, or `needs-go` when it waits for the user.

<intent-template>

---
issue: <tracker reference>
title: <title>
source: <source>
kind: <kind>
priority: <priority>
size: <size>
status: <files only: open>
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

</intent-template>
