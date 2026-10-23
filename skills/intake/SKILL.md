---
name: intake
description: Turn a bug, idea or request from the conversation into triaged GitHub issues, one per feature that ships on its own, published after the user's go. Use when someone brings a new bug, idea or request for a repo.
metadata:
  author: Anas Sahel
  version: 1.0.0
---

Turn a **request** into one **issue**: the problem, not the solution, triaged and published once the user says **go**. A request that holds several features that ship apart becomes one issue per feature.

Issues live on GitHub. Use the `gh` CLI, always with `--repo <owner/name>`.

## Steps

1. **Find the repo.** Use the repo the request names; otherwise the current folder's (`gh repo view --json nameWithOwner`); otherwise ask. Done when you know where the issue will be published.

2. **Capture the problem.** Restate the request as the **problem**: who is affected and what goes wrong. When the request proposes a solution, keep it as evidence. Fill **title**, **problem**, **why now** (`[to fill]` when unknown), **evidence** (logs, links, screenshots) and **source** (`user`, or `agent:<name>`). When the request holds several problems that each ship on their own, draft one issue each and carry each through the next steps. Done when each problem fits in three sentences without naming a solution.

3. **Check for duplicates.** List open issues (`gh issue list --repo <repo> --state open --limit 200 --json number,title,body,labels`) and compare problems: same users and same failure means duplicate. On a duplicate, comment the new evidence on the existing issue (`gh issue comment`) and stop. Done when you've compared against every open issue.

4. **Triage.** Set **kind** (`bug`, `feature`, `improvement`, `chore`), **priority** (`urgent`, `high`, `normal`, `low`) and **size** from the code it touches (`S` one file, `M` a few files, `L` several areas or a migration). Read the code when it is at hand; pick the bigger size when unsure. Give one line of reasoning for each.

5. **Ask for go.** When the user made the request, show the draft issues and ask for **go**: a go covers every issue shown, and the user can merge them back into one. On a change, apply it and show it again. On no, publish nothing and stop. When another agent made the request, skip the question: publish with the extra label `needs-go`, for the user to decide later.

6. **Publish.** List the repo's labels (`gh label list --repo <repo> --limit 200 --json name`) and create only the missing ones (`gh label create`), so existing labels keep their colors. Then `gh issue create --repo <repo> --title "…" --body-file <file> --label "kind:<kind>,priority:<priority>,size:<size>"`, with the template below. Done when each issue exists and you have its link.

Reply with each issue's link, and `needs-go` when it waits for the user.

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
