---
name: factory-design
description: Design phase. Turn an intent or an issue into a spec, what to build and how, in one unattended session, reviewed while it's written by specialized agents (security by OWASP, risk by EBIOS RM and ISO 27005, privacy by GDPR, and each of the project's own rules), then one pull request the user merges to approve it. Works with any tracker (GitHub, Linear, Plane, a folder in the repo…). Use when the user asks to design, spec, scope or split an intent or an issue.
model: opus
metadata:
  author: Anas Sahel
  version: 1.1.0 # x-release-please-version
  credits: Design phase of Anthropic's AI-native SDLC playbook (https://claude.com/resources/articles/the-ai-native-sdlc-playbook)
  agents: [ui-designer, security, risk, privacy, rule-reviewer]
---

Turn an **intent** (or an issue) into a **spec**: what to build and how, in one session, with the project's rules applied while it's written. Work unattended: never ask anyone anything before the gate. That's why another skill or a job (a CI run when an intent's pull request is merged, for instance) can start it. Each unknown gets the plainest default, written down as an **assumption** the user can correct at the gate.

The spec is written by you, the **designer**. Specialized agents in this skill's `agents/` folder do the rest: the `ui-designer` draws frames, the reviewers (`security`, `risk`, `privacy`, `rule-reviewer`) raise **findings**. Start each as a fresh subagent with its file as its instructions. Reviewers never write fixes and you never judge your own: that keeps the review independent.

The skill works with any **tracker**. It needs five operations: read an issue with its comments, comment, set labels (or the tracker's own fields), create an issue, and link one to a parent.

| Tracker | Tool |
|---|---|
| GitHub | `gh` CLI, with `--repo <owner/name>` |
| Linear, Plane, Jira… | its MCP server or CLI, when one is connected |
| Files | the intent file is the issue: its state (`needs-design`, `designed`, `split`) is its front matter `status`, never a label; comment by appending `## Comment` with the template's body under it, its own heading dropped (edit that section in place); a part is its own intent file with `parent: <id>`. With a code host, write the intent's state and comment on the spec's branch: they reach the default branch with its merge |

When the tracker has no tool in this session, say so and stop. With no issue, design from the intent or the conversation and skip the tracker.

The approval needs a **code host**: the repo's remote, with a tool that opens pull requests (`gh` for GitHub, `glab` for GitLab, an MCP server). With none, the spec is committed on the default branch and the user approves it in the conversation or on the issue.

## Models

Each step runs on the model that fits its cost of error. Defaults: the spec (this skill) and the `security`, `risk` and `privacy` reviewers on `opus`; the `ui-designer` and `rule-reviewer` on `sonnet`. A repo overrides one in its `AGENTS.md` or `CLAUDE.md` with `factory: model <step> <opus | sonnet | haiku>`; read those lines at Load and pass the model when starting a subagent. Say in the reply when a step ran on a weaker model than its default.

## Steps

1. **Load.** Find the tracker (named in the request → the repo's `AGENTS.md`, `CLAUDE.md` or README → an `intent/` folder → none). Check the **go**: the intent must be on the default branch. In the **fast lane** (factory-run found a size `S`, non-risky change) there is no intent: the issue is the intent, and its problem and comments bind the spec the same way. While its pull request is open, stop: it waits for the user's merge; closed without merge, stop: it was rejected. When the issue still carries `needs-go` with its intent merged, remove the label. When the spec's pull request (`spec/<id>-<slug>`) already exists, load what it holds and go to step 9. Read the intent (`intent/<id>-<slug>.md`, from the factory-plan skill): its problem, success, scope and constraints bind the spec, and its open questions are yours to answer. Read the issue and every comment, the code it touches, the README, docs, existing screens and related specs in `specs/`. Collect the **rules**: the built-in security, risk and privacy reviewers, every rule the repo's `AGENTS.md` or `CLAUDE.md` names, and each file in `rules/` (`rules/risk-context.md` aside: it's the risk agent's context, not a rule). Read the settings there too: the review **rounds** (`factory-design: review rounds <n>`, 1 by default), the **threshold** (`factory-design: ask from <low | medium | high>`, `medium` by default), the **frames** (`factory-design: frames text` for text only, text and mockup by default), and the **owners**: who settles each reviewer's questions (`factory-design: owner <security | risk | privacy> <who>`, or `owner:` in a rule file's front matter) and the **tech lead** (`factory-design: tech lead <who>`). Anyone unnamed is the user. Done when you can name who is affected, which code areas change, and every rule.

2. **Define what.** Problem and users in 2 to 4 sentences. When the change is size `M` or bigger, 2 to 5 goals and non-goals. Acceptance criteria AC1, AC2… as Given / When / Then: one behaviour each, observable results, numbers instead of adjectives. Done when a test author could write a failing test for each without asking anything.

3. **Define how.** For the main choice, 2 or 3 options with what each costs and risks; pick one and say why. Weigh what each would leave for the user to decide: prefer the option that leaves fewer decisions, when it meets the intent as well. Follow the stack and conventions already in the code; an option that changes them says so. Then the **structure** (files or modules to add or change, the criteria each serves), the **data** (tables, fields, routes, settings, with names and types, or "None."), and the **build order** (every criterion, the foundation first, one line on why). Done when a developer knows where each criterion's code goes, and in which order.

4. **Frames.** When the change adds or alters a screen, hand the `ui-designer` the criteria, the approach, the paths of the existing screens and their styles, and, unless frames are text only, the mockup path `specs/<id>-<slug>/frames.html`. Add its assumptions to yours. When a headless browser is at hand (Playwright, Chrome), render the mockup to `specs/<id>-<slug>/frames.png`. When an answer in step 6 changes a screen, hand the `ui-designer` the change to redraw it. For a process with several actors, draw a Mermaid `flowchart` yourself, one `subgraph` per actor. Done when each screen state a criterion names has a frame, or there's no screen.

5. **Review.** Hand every reviewer, in parallel, the **draft** (steps 2 to 4) and the code paths: `security`, `risk` (with `rules/risk-context.md` when it exists) and `privacy` always, `rule-reviewer` once per repo rule with that rule's text. Number the findings F1, F2… in one list, each with the reviewer it came from. Findings that describe the same harm are one finding, its `From` naming each reviewer and its level the highest: each of them checks its answer. Add their notes to your assumptions or open questions. Done when every reviewer has answered.

6. **Answer.** For each finding, either:
   - a **constraint** C1, C2…: the safe behaviour the code must keep, where it lives, and the test that checks it through a public entry point (a page, a route, a command, a file); fold any change it needs into steps 2 to 4; status `open`.
   - `needs-decision`, with the question and your recommended answer, when only a person can settle it (a retention period, a legal basis, a trade-off with the intent).

   A constraint that closes only part of a finding is kept, and the rest is `needs-decision`.

   A finding below the threshold that no simple constraint closes is `accepted` by default, with "below threshold": the user set that bar, and can reopen it at the gate.

   Then fold every answer into the draft, and hand each reviewer, as a fresh subagent, the revised draft and its findings answered by a constraint (its check mode). A merged finding is closed only when each of its reviewers closes it. Revise the answers it marks not closed and check again, up to the rounds from step 1; a new finding raised in check mode is answered like the others; a finding still not closed, or answered after the last check, becomes `needs-decision` with that answer as your recommendation (below the threshold: `accepted`, "below threshold"). Done when every finding is `open` with a closed constraint, or `needs-decision`.

7. **Split.** Look for 2 to 4 groups of criteria that each give users something that works on its own. Propose a split when the change is size `L`, or when the change has a `high` finding and a group carries none, so it could ship with less scrutiny. For each part, in build order (safest first): title, problem in one sentence, size, its criteria and findings by ID, the parts it comes after. A criterion that spans parts is reworded so each part tests its share alone, written in full and marked `(reworded)`. Done when every criterion and finding has a part, or there's no split.

8. **Publish.** Write `specs/<id>-<slug>.md`, with the intent's id and slug, using the template below. With a code host, create the branch `spec/<id>-<slug>` from the default branch in its own worktree (`git worktree add`), commit the spec with the mockup and its image there, push, and open a **draft** pull request titled `Spec · <title>`, its body the comment template and the issue's reference without a closing keyword (`Refs #42`, never `Closes #42`). With no code host, commit them on the default branch. Comment on the issue with the comment template and the pull request's link, criteria in full, the mockup's image when there is one, editing that comment in place when it exists, and label it `needs-design`.

   **Public repo or tracker** (or unknown): no finding ever reaches it. The committed spec, the pull request and the comment keep the constraints as plain requirements, with no `For` column, but drop the Findings section and the questions, and say "Review notes kept privately."; write the findings to the private path the repo's `AGENTS.md` or `CLAUDE.md` names, otherwise `~/.claude/factory-design/<repo>/<id>-<slug>.md`, and say where in the reply.

   Done when the spec's pull request is open, or the spec committed, and the issue shows the comment and `needs-design`.

9. **Gate.** The spec's pull request is the gate: merge = approve, close = reject, review comments = changes. When the user is in the conversation, show in one message: the pull request's link, the criteria, the chosen approach, the frames, then four lists: **assumptions**, the **questions** (one per decision, covering every finding it settles, each with its owner and your recommended answer), findings accepted below the threshold, and the split. A question's **owners** are the owners of the reviewers that raised its findings; a `high` finding's question also goes to the tech lead, who must agree. Each owner answers their own questions in the pull request's review, in the conversation or on the issue (read them all); the user answers the rest and decides the spec: approve, change, or reject. "yes" takes every recommended answer the speaker owns. A settled finding becomes a constraint, a scope change, or `accepted` (with the date and who accepted it: only an owner accepts a risk). On a change (a review comment or a message), revise from the step it touches, commit it to the spec's branch, push, answer each comment, and show again. While a finding is `needs-decision`, the pull request stays a draft, so it can't be merged; once none is left, set the spec's `status: designed`, commit, and mark it ready for review. The user approves by merging it, or by saying so here: then merge it yourself. On reject, close the pull request when the user said it here, keep their reason under Open questions, and when they want another design, return to step 2 on the same branch with the pull request reopened. Once it's merged, label the issue `designed` (an approved split: create each part as its own issue linked to the parent, labelled `designed`, and the parent `split`). When no one is in the conversation, stop at `needs-design`: the owners answer in the pull request, the user merges or closes it, and a later run reads its review and its state.

   With no code host, the user approves or rejects in the conversation or on the issue; on approval, commit the updated spec on the default branch and label the issue as above.

Reply with the links (issue, spec pull request or spec, each part) and where it stands: `designed`, `split`, or `needs-design` with what waits, and for whom.

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
