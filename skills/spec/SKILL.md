---
name: spec
description: Turn an issue or a request into a spec — what to build and why, with Given/When/Then acceptance criteria, a security risk level and a sketch, and a split into smaller issues when parts can ship apart — then wait for the user's approval. Works with any tracker (GitHub, Linear, Plane, a folder in the repo…). Use when the user asks to spec, scope or split an issue.
metadata:
  author: Anas Sahel
  version: 1.0.0
---

Turn an **issue** into a **spec**: what to build and why, in the user's words. How to build it comes later; the spec never names a solution the user didn't ask for.

The skill works with any **tracker**. It needs five operations: read an issue with its comments, comment, set labels (or the tracker's own fields), create an issue, and link one to a parent. Use whatever tool reaches it:

| Tracker | Tool |
|---|---|
| GitHub | `gh` CLI, with `--repo <owner/name>` |
| Linear, Plane, Jira… | its MCP server or CLI, when one is connected |
| Files | one Markdown file per issue in the repo, `issues/<NNN>-<slug>.md`, labels as front matter; comment by appending a `## Comment` section; parent as `parent: <NNN>` |

When the tracker has no tool in this session, say so and stop. When the request has no issue yet, write the spec from the conversation and skip what touches the tracker.

## Steps

1. **Load.** Find the tracker (named in the request → the repo's `AGENTS.md`, `CLAUDE.md` or README → an `issues/` folder → ask). Read the issue and every comment, so you don't re-ask what's answered. Read the code it touches, the README and docs, and related issues. Done when you can name who is affected and which code areas change.

2. **Clarify.** List only what the code and docs can't answer: users, edge cases, constraints. At most 5 questions, each with a proposed default. Ask the user and wait; when no user is in the conversation, post them as one comment headed "Questions before the spec", label the issue `needs-info`, and stop. Done when every question has an answer or a safe default; the rest goes under Open questions.

3. **Define.** Write the problem and users in 2–4 sentences. When the issue is size `M` or bigger, add 2–5 goals and non-goals. Write acceptance criteria AC1, AC2… as Given / When / Then: one behaviour each, observable results, numbers instead of adjectives. Done when a test author could write a failing test for each criterion without asking anything.

4. **Assess risk.** Rate it apart from the solution: when you can start a subagent, hand it the draft, the code areas and the rubric below, so the rating stays independent of whoever wrote the spec. Number the risks R1, R2…, each with status `open`; add its open questions to the spec's. When there's no risk, write "No security risk found."

5. **Sketch.** When the issue is size `M` or bigger, or the risk is `high`: a text wireframe per state (empty, loading, error, success) with real labels when the change has a screen, a Mermaid `flowchart` (one `subgraph` per actor for a swimlane) when it's a process. Follow the project's existing screens. Tag each part with the criteria it supports. Rough on purpose.

6. **Propose a split.** Look for 2 to 4 groups of criteria that each give users something that works on its own. Propose a split when the issue is size `L`, or when the overall risk is `high` and a group carries none of it, so it can ship with less scrutiny. For each part, in build order (safest first): title, problem in one sentence, size, its criteria by ID, its risks by ID, and the parts it comes after. A criterion that spans parts is reworded so each part tests its share alone; write it in full and mark it `(reworded)`. Done when every criterion and every risk has a part, or there's no split to propose.

7. **Ask for approval.** Show the spec, the risks and any split, and ask the user to **approve**, change, or reject. On a split, they can approve it, reject it (the issue stays whole), or merge parts. On a change, revise and show it again. On reject, keep their reason and return to step 2. When no user is in the conversation, publish for them to decide later.

8. **Publish.** Write the spec where the repo keeps its docs, or `specs/<issue>-<slug>.md` by default, with the template below, and commit it. Comment on the issue with the comment template, criteria in full, so readers never need the file to know what `AC2` means; edit that comment in place when it exists. Label the issue `scoped` when the user approved, `needs-scope` otherwise, plus `risk:<level>`. On an approved split, create each part as its own issue, linked to the parent, with its share of the spec, labelled `scoped`; label the parent `split`.

   **Public repo or tracker**: keep risk details out of it. No risk label, no risk text in the comment or the committed spec; save the Risks section to a file outside the repo (ask the user where) and write only "Security notes kept privately."

Reply with the links (issue, spec, each part) and where it stands: `scoped`, `split`, or `needs-scope` with why it waits.

## Risk rubric

A risk is a **threat** exploiting a **vulnerability** to harm an **asset** (users' data, accounts, money or the system). List only risks where you can name all four, plus likelihood. Leave out what you checked and found safe, and product concerns (those are open questions). Describe each risk by its effect, never as a step-by-step attack.

- **Impact high**: credentials, payments, personal data, auth or permissions, or anything public that writes data. **Medium**: reads sensitive data, adds a dependency, or changes an API others rely on. **Low**: the rest.
- **Level**: `high` when impact is high and likelihood at least medium; `low` when both are low; `medium` otherwise. Torn between two, pick the higher and say why. The overall level is the highest single level.

<spec-template>

---
issue: <tracker reference>
title: <issue title>
risk: <low | medium | high>
---

# <issue title>

## Problem and users

## Goals · Non-goals

<size M or bigger>

## Acceptance criteria

**AC1 · <name>**
- Given <context>
- When <action>
- Then <observable result>

## Sketch

<Mermaid diagram or text wireframe, when step 5 applies>

## Risks

| ID | Risk | Asset | Likelihood | Impact | Level | Status |
|---|---|---|---|---|---|---|
| R1 | <threat> through <vulnerability> | <asset> | <likelihood> | <impact>: <what happens to users> | <level> | open |

Status is `open`, `mitigated` (with the test that proves it) or `accepted` (only by the user, with the date).

## Proposed split

<when step 6 proposes one>

| Part | Title | Criteria | Risks | Size | After |
|---|---|---|---|---|---|
| 1 | <title> | AC1, AC2 (reworded) | R1 | <size> | — |

## Open questions

</spec-template>

<comment-template>

## Spec

**Risk** <level> · **Criteria** <n> · **Spec** <link or path>

<details>
<summary>Criteria (<n>)</summary>

**AC1 · <name>**
- Given <context>
- When <action>
- Then <observable result>

</details>

<when a split is proposed:> **Split proposed** into <n> parts: <part titles>.

</comment-template>
