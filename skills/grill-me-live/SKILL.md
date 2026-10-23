---
name: grill-me-live
description: Grill an idea relentlessly while its decision tree grows live in the browser, where you can also answer.
argument-hint: "What idea should we grill?"
disable-model-invocation: true
metadata:
  author: Anas Sahel
  version: 1.0.0 # x-release-please-version
  credits: Interview method from Matt Pocock's grilling (https://github.com/mattpocock/skills), MIT. Tree drawn with D3 (ISC). See THIRD_PARTY_NOTICES.md.
---

# Grill me, live

A relentless interview that turns a loose idea into decisions, drawn as a live tree in the browser. The interview method is Matt Pocock's [grilling](https://github.com/mattpocock/skills/tree/main/skills/productivity/grilling) skill (MIT); this skill adds the tree.

## The interview

Interview the user relentlessly until you reach a shared understanding. Map this as a **design tree**: every decision branches into the decisions that hang off it.

Work the tree in **rounds**. The **frontier** is every decision whose prerequisites are already settled: the questions you can ask _now_ without guessing at answers you haven't heard yet. Ask the whole frontier in one round: number each question and give your recommended answer. Then wait for the user's answers before the next round.

Format a round in chat like so:

```
❓ **Q1** - **<question title>**: <question body, might be multiple paragraphs, including multiple choices>

➡️ <your recommended answer>

---

❓ **Q2** - **<question title>**: <question body>

➡️ <your recommended answer>
```

Word each question so "yes" accepts your recommended answer.

Each round the user answers reshapes the tree: settled decisions push the frontier outward and unblock questions that depended on them. Recompute the frontier and ask the next round. A question whose answer depends on another question still open in this round belongs to a _later_ round, not this one.

Finding _facts_ is your job, never the user's. When a frontier question needs a fact from the environment (filesystem, docs, the web), dispatch a sub-agent to find it; don't ask the user for anything you could look up yourself. Don't block on it: a running exploration is an unsettled prerequisite, so only the questions downstream of it wait for the sub-agent to report; ask the rest of the frontier now. The _decisions_ are the user's: put each to them and wait.

The session is done when the frontier is empty: every branch of the design tree visited, nothing left silently assumed. Do not act on it until the user confirms you have reached a shared understanding.

## The live tree

The tree lives in `.grill/state.json` in the current directory. A small local server (`scripts/grill.mjs`, next to this file) shows it at `http://localhost:4747` and redraws whenever the file changes. The user can answer on the page; their answers come back to you through the same script.

Below, `grill.mjs` means `node <this skill's directory>/scripts/grill.mjs`, with the absolute path.

### Start

1. Check `node --version` works (18 or newer). If it doesn't, say once that the live tree needs Node, and run the interview in chat only.
2. Start the server **in the background** (it runs until stopped): `grill.mjs serve --open`. It prints the URL; give it to the user. If `.grill/state.json` already holds an earlier session, ask whether to continue it or start fresh (move the old `.grill` folder aside rather than deleting it).
3. If you are running somewhere the user's browser can't reach `localhost` (a cloud or remote session), say so, run the interview in chat, keep `state.json` updated anyway, and offer a snapshot at the end.

### Every round

1. **Write the tree first.** Rewrite `.grill/state.json` with the new round: bump `session.round`; settle or drop what the user just answered; mark this round's frontier `open` with `round` and `q` numbers matching the chat; add the decisions you can already see downstream as `waiting` with `blockedBy`; mark facts being looked up as `research`; append events. The format is in [reference/state-format.md](reference/state-format.md). Read it before the first write.
2. **Post the round in chat**, in the format above, and add one line: they can answer here or on the page and press **Send answers**.
3. **Collect answers.** Run `grill.mjs wait`. It returns when the user presses Send on the page, printing each answer with its question, and clears the page for the next round.
   - In Claude Code, run it in the background: you are woken when it exits, and the user can still type in chat meanwhile.
   - Elsewhere, run it in the foreground. It exits after `--timeout` seconds (default 540) with code 2 and "No answers sent yet"; run it again.
   - If the user answers in chat instead, use their chat answers, then run `grill.mjs answers --consume` to pick up anything they also saved on the page. Chat wins where the two disagree.
4. **Interpret the answers.**
   - `ACCEPTED`: the user took your recommendation.
   - `ANSWERED`: their own words. Treat them as a real answer, and often as pushback that reshapes the tree, with new branches and moved prerequisites.
   - `DROP`: mark the node `dropped` with their reason. Its subtree is pruned on the page automatically.
   - Unanswered questions stay `open` and are asked again next round.
5. Recompute the frontier and go back to step 1.

When a sub-agent reports a fact, settle the `research` node with what it found, and unblock or reshape what depended on it.

### Finish

- When the frontier is empty, set `session.status` to `confirming`, summarise the decisions in chat, and ask the user to confirm shared understanding. After they confirm, set it to `done`.
- Offer a shareable copy: `grill.mjs snapshot` writes one self-contained HTML file with the whole tree, read-only and offline.
- Stop the server: `grill.mjs stop`.

### Rules for the tree

- Every question you ask in chat is an `open` node with the same `Q` number, so the chat and the page always agree.
- Node ids are stable. Never delete a node; drop it.
- Keep `title` short (about 40 characters) and the card `recommendation` short (about 80). Put the full text in `question`.
- `.grill/` is the record of the session. Don't put secrets in it.
