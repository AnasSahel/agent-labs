---
name: intake
description: Turn a bug, idea or request from the conversation into triaged issues in the project's tracker (GitHub, Linear, Plane, a folder in the repo…), one per feature that ships on its own, published after the user's go. Use when someone brings a new bug, idea or request.
metadata:
  author: Anas Sahel
  version: 1.0.0
---

Turn a **request** into one **issue**: the problem, not the solution, triaged and published once the user says **go**. A request that holds several features that ship apart becomes one issue per feature.

The skill works with any **tracker**. It needs four operations: list open issues, create one, comment on one, and set labels (or the tracker's own fields for kind, priority and size). Use whatever tool reaches the tracker:

| Tracker | Tool |
|---|---|
| GitHub | `gh` CLI, with `--repo <owner/name>` |
| Linear, Plane, Jira… | its MCP server or CLI, when one is connected |
| Files | one Markdown file per issue in the repo, `issues/<NNN>-<slug>.md`, labels as front matter (`kind`, `priority`, `size`, `status`); comment by appending a `## Comment` section |

When the tracker has no tool in this session, say so and stop.

## Steps

1. **Find the tracker.** Use the tracker and project the request names; otherwise the one the repo's `AGENTS.md`, `CLAUDE.md` or README points to; otherwise an existing `issues/` folder; otherwise ask, offering what's connected in this session. Done when you know the tracker, the project in it, and the tool for each operation.

2. **Capture the problem.** Restate the request as the **problem**: who is affected and what goes wrong. When the request proposes a solution, keep it as evidence. Fill **title**, **problem**, **why now** (`[to fill]` when unknown), **evidence** (logs, links, screenshots) and **source** (`user`, or `agent:<name>`). When the request holds several problems that each ship on their own, draft one issue each and carry each through the next steps. Done when each problem fits in three sentences without naming a solution.

3. **Check for duplicates.** List the project's open issues and compare problems: same users and same failure means duplicate. On a duplicate, comment the new evidence on the existing issue and stop. Done when you've compared against every open issue.

4. **Triage.** Set **kind** (`bug`, `feature`, `improvement`, `chore`), **priority** (`urgent`, `high`, `normal`, `low`) and **size** from the code it touches (`S` one file, `M` a few files, `L` several areas or a migration). Read the code when it is at hand; pick the bigger size when unsure. Give one line of reasoning for each.

5. **Ask for go.** When the user made the request, show the draft issues and ask for **go**: a go covers every issue shown, and the user can merge them back into one. On a change, apply it and show it again. On no, publish nothing and stop. When another agent made the request, skip the question: publish with the extra label (or status) `needs-go`, for the user to decide later.

6. **Publish.** Create each issue with the template below and its kind, priority and size. Use the tracker's native field when it has one (Linear's priority, for instance), labels `kind:<kind>`, `priority:<priority>`, `size:<size>` otherwise. Reuse existing labels; create only the missing ones, so existing ones keep their colors. Done when each issue exists and you have its link, or its path for files.

Reply with each issue's link or path, and `needs-go` when it waits for the user.

<issue-template>

> *Raised by <source>.*

## Problem

<who is affected, what goes wrong>

## Why now

<value or cost of waiting>

## Evidence

<logs, links, screenshots; the original proposal when the request came as a solution>

**Kind** <kind> · **Priority** <priority> · **Size** <size>

</issue-template>
