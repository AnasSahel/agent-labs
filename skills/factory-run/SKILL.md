---
name: factory-run
argument-hint: "A request to build, an item id to carry on, \"status\", or nothing for the board"
description: "Driver of the factory. Takes a bug, idea or feature request all the way to a pull request with working code, running factory-plan, factory-design and factory-build itself and stopping for the user as few times as the change's size allows: once for a small change, twice for a normal one, three times for a large one. With no request, shows the board (where each item stands, what waits for whom) and moves on every item whose stop was passed. Use this, instead of calling the factory skills one by one, when the user wants a new request built end to end (\"build me…\", \"take this to a pull request\", \"run the factory on…\", \"fix this and open a PR\"), asks where things stand (\"factory status\", \"what's waiting for me?\"), or says to carry on after merging a factory pull request. Not for filing a request to deal with later (that's factory-plan), nor for one station on an item that exists (\"spec out 12\", \"plan issue 12\", \"build issue 12\": factory-design, factory-build)."
metadata:
  author: Anas Sahel
  version: 1.0.0 # x-release-please-version
---

Take a **request** to working code with as few **stops** as its size allows. A stop is a gate that needs the user, and the only moment they are needed: one pull request to merge. Between two stops you **carry** the item: call each station with the Skill tool (`factory-plan`, `factory-design`, `factory-build`), tell it you carry the item, and name the lane and the branch. A carried station writes on that branch, opens no pull request of its own and waits at no gate of its own (its "Carried by factory-run" section).

While you carry, ask nothing: take every recommended answer and keep it as an **assumption**. The user corrects assumptions at the stop, in one place, instead of answering them one by one. The only questions asked before a stop are the intake's brainstorm, when the user is in the conversation.

## Lanes

| Lane | For | Stops | Branch |
|---|---|---|---|
| `fast` | size `S` | 1: the code pull request, which also carries the intent, the spec and the plan | `<id>-<slug>` |
| `standard` | size `M` | 2: the **proposal** (intent, spec and plan in one pull request), then the code | `proposal/<id>-<slug>`, then `<id>-<slug>` |
| `full` | size `L` | 3: the intent, then the proposal (spec and plan), then the code | `intent/<id>-<slug>`, `proposal/<id>-<slug>`, then `<id>-<slug>` |

Every lane runs every station: a small change still gets its criteria, its reviewers and its verifier. Lanes only move the stops.

The lane comes from, in this order: the user's word ("fast lane", "full lane"); `factory-run: lane <lane>` in the repo's `AGENTS.md` or `CLAUDE.md`; the size from the intake's triage. It's written in the intent's front matter (`lane:`), or the spec's when there's no intent.

**Bump.** A `fast` item becomes `standard` when, once its plan is drafted, any of these holds: a finding is `high`, a question is `needs-decision`, a split is proposed, or the tech lead must accept the plan. Rename its branch to `proposal/<id>-<slug>` (`git branch -m`: nothing was pushed yet), and say the bump and its reason in the reply. A lane is never bumped down.

**Public repo**: factory-design's public-repo rule holds for the proposal too: no finding is named, and each question is worded as a plain decision.

**No code host**: there's no pull request, so a stop is the user's yes, in the conversation or on the issue. Show what the pull request would hold; on yes, merge the proposal's branch into the default branch yourself. The code branch stays the delivery, as factory-build says. Unattended, stop there and say what waits.

## Steps

1. **Read the board.** Find the tracker and the code host as the stations do (named in the request → the repo's `AGENTS.md`, `CLAUDE.md` or README → an `intent/` folder → none). List the open items: issues that carry a factory state (`needs-go`, `needs-design`, `designed`, `split`, `needs-plan`, `planned`, `building`, `blocked`, `built`; with files, each intent's `status`), and the open pull requests on `intent/…`, `spec/…`, `proposal/…` and code branches. For each: its lane, where it stands, and who it waits for. Then:
   - a new request: step 2;
   - an item named: step 3 when it never reached a stop, step 4 otherwise;
   - nothing named: show the board, then run step 4 on every item whose stop was passed, highest priority first, one at a time;
   - "status" only: show the board and stop.

   Done when the board is shown, or the item to carry is known.

2. **Intake.** Call `factory-plan`, carried. After its triage it gives you the size: name the lane. In the `full` lane it opens the intent's pull request, the first stop: go to the reply. Otherwise it commits the intent on the lane's branch: go on. An issue or an intent that exists skips this step; its lane comes from its size (`standard` when it has none). Done when the item has an id, a lane, and its intent on a branch or in a pull request.

3. **Carry to the next stop.** On the lane's branch (`proposal/<id>-<slug>`; `<id>-<slug>` in the `fast` lane), created from the default branch when it doesn't exist:
   1. Call `factory-design`, carried. It hands back the highest finding level, the questions that wait, the assumptions and the split.
   2. When a split is proposed, skip the plan: the proposal holds the spec alone. Otherwise call `factory-build`, carried, for Part 1: it hands back whether the tech lead must accept.
   3. Check the bump.
   4. `fast`: let `factory-build` go on with Part 2 on the same branch. Its pull request, ready for review, is the one stop.
   5. `standard` and `full`: push the branch and open the proposal's pull request, titled `Proposal · <title>`, with the proposal template as its body. It stays a draft while a question waits, so it can't be merged. Set the state `needs-plan` (`needs-design` when the proposal holds the spec alone).

   Done when the item's pull request for this stop is open, or the item is `blocked` with its question.

4. **After a stop.** Read the pull request the item waits on:
   - **review comments, or an answer to a question**: hand each to the station that owns the file it is about (the intent: factory-plan; the spec: factory-design, step 9; the plan: factory-build, step 3), still carried and on the same branch. Push, and answer each comment. Mark the proposal ready for review once no question waits.
   - **proposal merged**: the go for all it holds. Remove `needs-go`. With a plan: set `planned` and call `factory-build`, carried, for Part 2; its pull request is the next stop. With a split: create the parts as factory-design's step 9 says, the parent `split`, and carry each part in build order through step 3, items 2 to 4, in the `fast` lane.
   - **intent merged** (`full`): step 3.
   - **code pull request**: factory-build's "After the pull request".
   - **closed without merge**: a no. Close the issue with the reason from the pull request (a code pull request: factory-build decides).
   - **open, nothing new**: it waits for the user; say so.

   Done when the item stands at its next stop, is shipped, or is closed.

Reply with one board line per item you touched, each with its link, then the assumptions you made (count, and where to read them), and any bump.

<board-template>

| Item | Lane | Stands at | Waits for | Next |
|---|---|---|---|---|
| <id> · <title> | <lane> | <state, or "proposal open", "code in review", "shipped"> | <who: the user, an owner, the tech lead, or "nobody"> | <the one thing that moves it: "merge <link>", "answer Q1 in <link>", "running now"> |

<n> items wait for you · <n> can move now.

</board-template>

<proposal-template>

<the problem's first sentence>. Refs <issue reference, without a closing keyword>.

**Lane** <lane> · **Size** <size> · **Criteria** <n> · **Constraints** <n> · **Questions** <n>

Merge = go for <the intent, the spec and the plan | the spec and the plan> · close = reject · review comments = changes.

## Read in this order

1. [Intent](<path>): the problem <drop the line in the `full` lane>
2. [Spec](<path>): what gets built, and how
3. [Plan](<path>): the files, the order, the tests <drop the line with a split>

## Questions

<each question that waits: **Q1 · @owner**: the question, your recommended answer; or "None.">

## Assumptions

<every recommended answer you took while carrying, one line each, with the station it came from; or "None.">

<when a split is proposed:> **Split proposed** into <n> parts: <part titles>. Each part gets its own code pull request.

</proposal-template>
