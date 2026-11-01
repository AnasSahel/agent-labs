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

Turn an **intent** (or an issue) into a **spec**: what to build and how, with the project's rules applied while it's written. Work unattended: ask nobody anything before the gate, so another skill or a job (CI on an intent's merge, say) can start it. Each unknown gets the plainest default, written down as an **assumption** the user can correct at the gate.

You are the **designer** and write the spec. Agents in `agents/` do the rest, each started as a fresh subagent with its file as instructions: the `ui-designer` draws frames; the reviewers (`security`, `risk`, `privacy`, `rule-reviewer`) raise **findings**. Reviewers never write fixes and you never judge your own work, which keeps the review independent.

The **tracker** needs five operations: read an issue with comments, comment, set labels (or the tracker's own fields), create an issue, link one to a parent. With no tool for it in this session, say so and stop. With no issue, design from the intent or the conversation and skip the tracker.

| Tracker | Tool |
|---|---|
| GitHub | `gh` CLI with `--repo <owner/name>` |
| Linear, Plane, Jira… | its MCP server or CLI, when connected |
| Files | the intent file is the issue: its state (`needs-design`, `designed`, `split`) is its front matter `status`, never a label; comment by appending `## Comment` (template body, own heading dropped; edit in place); a part is its own intent file with `parent: <id>`. With a code host, write state and comment on the spec's branch: they reach the default branch with its merge |

The approval needs a **code host**: the remote, with a tool that opens pull requests (`gh`, `glab`, an MCP server). With none, the spec is committed on the default branch and the user approves in the conversation or on the issue.

## Models

Defaults: the spec on `opus`; every agent on `sonnet`. A `high` finding's check round may be rerun by that reviewer on `opus`. In the fast lane the spec is written by a `sonnet` subagent. A repo overrides with `factory: model <step> <opus | sonnet | haiku>` in its `AGENTS.md` or `CLAUDE.md`; pass the model when starting a subagent. Say when a step ran below its default.

## Steps

1. **Load.** Find the tracker (the request → `AGENTS.md`, `CLAUDE.md` or README → an `intent/` folder → none). Check the **go**: the intent must be on the default branch. In the **fast lane** (factory-run found a size `S`, non-risky change) there is no intent: the issue is the intent and binds the spec the same way. While the intent's pull request is open, stop (it waits for the user's merge); closed unmerged, stop (rejected). If the issue carries `needs-go` and the intent is merged, remove the label. If the spec's pull request `spec/<id>-<slug>` exists, load it and go to step 9.

   Read the intent (`intent/<id>-<slug>.md`): its problem, success, scope and constraints bind the spec, and you answer its open questions. Read the issue and comments, the code it touches, README, docs, existing screens, related `specs/`. Collect the **rules**: the built-in reviewers, every rule `AGENTS.md` or `CLAUDE.md` names, each file in `rules/` (not `rules/risk-context.md`, the risk agent's context). Read the settings: review **rounds** (`factory-design: review rounds <n>`, default 1), **threshold** (`factory-design: ask from <low | medium | high>`, default `medium`), **frames** (`factory-design: frames text` for text only; default text and mockup), **owners** who settle each reviewer's questions (`factory-design: owner <security | risk | privacy> <who>`, or `owner:` in a rule's front matter) and the **tech lead** (`factory-design: tech lead <who>`). Anyone unnamed is the user. Done when you can name who is affected, which code areas change, and every rule.

2. **Define what.** Problem and users in 2 to 4 sentences. For size `M` or bigger, 2 to 5 goals and non-goals. Acceptance criteria AC1, AC2… as Given / When / Then: one behaviour each, observable results, numbers instead of adjectives. Done when a test author could write a failing test for each without asking.

3. **Define how.** For the main choice, 2 or 3 options with cost and risk; pick one and say why, preferring the option that leaves the user fewer decisions when it meets the intent equally. Follow the stack and conventions in the code; an option that changes them says so. Then the **structure** (files or modules, the criteria each serves), the **data** (tables, fields, routes, settings, with names and types, or "None."), and the **build order** (every criterion, foundation first, one line on why). Done when a developer knows where each criterion's code goes and in which order.

4. **Frames.** For a change that adds or alters a screen, hand the `ui-designer` the criteria, approach, paths of existing screens and styles and, unless frames are text only, the mockup path `specs/<id>-<slug>/frames.html`. Add its assumptions to yours. With a headless browser (Playwright, Chrome), render the mockup to `specs/<id>-<slug>/frames.png`. When a step 6 answer changes a screen, have it redraw. For a process with several actors, draw a Mermaid `flowchart` yourself, one `subgraph` per actor. Done when each screen state a criterion names has a frame, or there's no screen.

5. **Review.** Hand every reviewer, in parallel, the **draft** (steps 2 to 4) and the code paths: `security`, `risk` (with `rules/risk-context.md` if present) and `privacy` always, `rule-reviewer` once per repo rule with its text. Number findings F1, F2… in one list, each with its reviewer. Findings describing the same harm merge into one: `From` names each reviewer, the level is the highest, and each checks its answer. Add reviewers' notes to your assumptions or open questions. Done when every reviewer has answered.

6. **Answer.** Each finding becomes either:
   - a **constraint** C1, C2…: the safe behaviour the code must keep, where it lives, and the test that checks it through a public entry point; fold any change it needs into steps 2 to 4; status `open`.
   - `needs-decision`, with the question and your recommended answer, when only a person can settle it (retention period, legal basis, a trade-off with the intent).

   A constraint closing only part of a finding is kept and the rest is `needs-decision`. A finding below the threshold that no simple constraint closes is `accepted` by default as "below threshold": the user can reopen it at the gate.

   Fold every answer into the draft and hand each reviewer, as a fresh subagent, the revised draft and its findings answered by a constraint (check mode). A merged finding closes only when each of its reviewers closes it. Revise answers marked not closed and check again, up to the rounds; a new finding in check mode is answered the same way. A finding still not closed after the last check becomes `needs-decision` with your answer as the recommendation (below the threshold: `accepted`, "below threshold"). Done when every finding is `open` with a closed constraint, or `needs-decision`.

7. **Split.** Look for 2 to 4 groups of criteria that each give users something working on its own. Propose a split for size `L`, or when a `high` finding sits in one group and another carries none (so it ships with less scrutiny). Per part, safest first: title, problem in one sentence, size, criteria and findings by ID, the parts it follows. A criterion spanning parts is reworded in full so each part tests its share alone, marked `(reworded)`. Done when every criterion and finding has a part, or there's no split.

8. **Publish.** Write `specs/<id>-<slug>.md` (the intent's id and slug) from `spec-template`. With a code host, create branch `spec/<id>-<slug>` from the default branch in its own worktree (`git worktree add`), commit the spec with the mockup and its image, push, and open a **draft** pull request `Spec · <title>`, its body `comment-template` plus the issue reference without a closing keyword (`Refs #42`, never `Closes #42`). With none, commit on the default branch. Comment on the issue with `comment-template` and the link (criteria in full, the mockup image if any, edited in place), and label it `needs-design`.

   **Public repo or tracker** (or unknown): no finding ever reaches it. The spec, pull request and comment keep constraints as plain requirements with no `For` column, drop the Findings section and the questions, and say "Review notes kept privately." Write the findings to the private path `AGENTS.md` or `CLAUDE.md` names, otherwise `~/.claude/factory-design/<repo>/<id>-<slug>.md`, and say where in the reply.

   Done when the spec's pull request is open (or the spec committed) and the issue shows the comment and `needs-design`.

9. **Gate.** The spec's pull request is the gate: merge = approve, close = reject, review comments = changes. In the conversation, show in one message the link, criteria, approach, frames, then four lists: **assumptions**; **questions** (one per decision, covering every finding it settles, each with its owner and your recommended answer); findings accepted below the threshold; the split. A question's **owners** are the owners of the reviewers that raised its findings; a `high` finding's question also goes to the tech lead, who must agree. Owners answer their own questions in the review, the conversation or the issue (read all); the user answers the rest and decides: approve, change or reject. "yes" takes every recommended answer the speaker owns. A settled finding becomes a constraint, a scope change, or `accepted` (with date and who: only an owner accepts a risk).

   On a change, revise from the step it touches, commit to the spec's branch, push, answer each comment, show again. While any finding is `needs-decision` the pull request stays a draft and can't merge; when none is left, set `status: designed`, commit, mark it ready. The user approves by merging, or by saying so here, then you merge it. On reject, close the pull request if the user said so here and keep their reason under Open questions; for a new design, reopen it and return to step 2 on the same branch. Once merged, label the issue `designed` (an approved split: each part its own issue linked to the parent, labelled `designed`; the parent `split`). With nobody in the conversation, stop at `needs-design`: owners answer in the pull request, the user merges or closes, a later run reads it.

   With no code host, the user approves or rejects in the conversation or on the issue; on approval commit the updated spec on the default branch and label the issue as above.

Reply with the links (issue, spec pull request or spec, each part) and where it stands: `designed`, `split`, or `needs-design` with what waits and for whom.

## Templates

Read [references/templates.md](references/templates.md) when a step writes one: `spec-template`, `comment-template`.
