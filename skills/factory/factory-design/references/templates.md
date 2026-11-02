<spec-template>

---
issue: <tracker reference>
intent: <path of the intent, when there is one>
title: <title>
size: <S | M | L>
status: <needs-design | designed>
---

# <title>

## Problem and users

## Goals · Non-goals

<size M or bigger>

## Acceptance criteria

**AC1 · <name>**
- Given <context>
- When <action>
- Then <observable result>

## Approach

**Chosen**: <option>. <why, in one or two sentences>

| Option | How | Cost | Risk |
|---|---|---|---|

## Structure

| Path | Holds | Criteria |
|---|---|---|

## Data

## Build order

1. **AC<n> · <name>**: <why it comes here>

## Frames

Mockup: [frames.html](<id>-<slug>/frames.html) <and its image, when rendered>

<the ui-designer's text frames, or the flowchart; drop the section when there's neither>

## Constraints

| ID | For | Constraint | Where | Test |
|---|---|---|---|---|
| C1 | F1 | <safe behaviour, one line> | <file or module> | <how a test checks it> |

A constraint you recommend in a question is listed too, its ID marked `(proposed, Q<n>)` until the question is settled.

## Findings

| ID | From | Finding | Level | Answer | Status |
|---|---|---|---|---|---|
| F1 | security | <effect, never an attack> | <level> | C1 | open |

Status is `open` (a constraint answers it, waiting for code), `needs-decision` (waits for its owner), `mitigated` (a test proves its constraint), `accepted` (by its owner, with the date, or "below threshold") or `dropped` (the scope changed). A finding partly answered carries both, e.g. `open (C1) · needs-decision (Q2)`. "No finding." when there's none.

## Questions

<one per decision: **Q1 · @owner** (and the tech lead, for a high finding): the question, the findings it settles, your recommended answer; "None." when nothing waits>

## Assumptions

## Proposed split

<when step 7 proposes one>

| Part | Title | Criteria | Findings | Size | After |
|---|---|---|---|---|---|

## Open questions

</spec-template>

<comment-template>

## Spec

**Criteria** <n> · **Constraints** <n> · **Questions** <n> · **Spec** <link or path>

<details>
<summary>Criteria (<n>)</summary>

**AC1 · <name>**
- Given <context>
- When <action>
- Then <observable result>

</details>

<when there's a mockup:> ![Frames](<link to frames.png>) · [mockup](<link to frames.html>)

<when questions wait:> **Waiting for** <each owner, mentioned in the tracker's way>: Q1, Q2…

<when a split is proposed:> **Split proposed** into <n> parts: <part titles>.

</comment-template>
