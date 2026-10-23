---
name: factory-brainstorm
description: Brainstorm an idea, plan or decision with the user until it's concrete enough to write down, in short rounds of questions with recommended answers, then a builder check that ends it, and keeps a trace of every question and answer. Works inside the current project's limits or outside them. Use when the user wants to brainstorm, explore an idea, think something through or flesh it out, or before writing an intent or a spec.
metadata:
  author: Anas Sahel
  version: 1.0.0 # x-release-please-version
  credits: Structure and stop rules adapted from obra's superpowers brainstorming (https://github.com/obra/superpowers), MIT. Rounds with recommended answers from Matt Pocock's grilling (https://github.com/mattpocock/skills), MIT.
---

Find out what the user actually wants, and why, before anything gets built. The brainstorm has an end: it asks only what changes what gets built, decides the small things itself and says so, and stops after one builder check.

A caller may set four things: the **trace** path, the **destination** (what must be settled, e.g. "fill the intent fields: problem, who is affected, why now, success looks like, out of scope, evidence"), the **scope**, and whether to **skip approaches**. Ask for an unset destination or scope in your first round; the trace path is offered at the end.

**Scope** decides what counts as a limit:
- **Inside**: the current project bounds the answers. Read its code, docs, `CLAUDE.md`, `AGENTS.md`, glossary and decision records first. Use its terms, and call out a word that clashes with them or a claim the code contradicts. Every option fits what the project already uses. Recommend it when the idea changes an existing project.
- **Outside**: no project bounds the answers. Look at prior art, other tools, the web (offer the search; the user decides). When an option would break a limit of the current project, say which one. Recommend it for a new product, or when the user asks what's possible.

## Steps

1. **Check.** When the request already holds everything that matters, skip the brainstorm: say what you understood in two lines and stop. Otherwise read what the user pointed at and, inside, the project, until you can say how the relevant parts work today. Never ask what that reading answers. Done when you know what's missing.

2. **Converse in rounds.** Each round asks at most 3 questions, numbered, each with your recommended answer, worded so "yes" accepts it:

   <round-template>
   **Q1. <title>**: <question, built on their last answer or on what you found>
   Recommended: <your answer, and why when it isn't plain>
   </round-template>

   Ask only what's **theirs**: a decision that changes what gets built. A **fact** is yours to look up, never to ask. A **minor** choice a sensible builder could settle is yours: decide it and say so. Open questions first ("what should someone do when they land on it?"); menus only when they're stuck. The first round also offers one way out: "Or say go and I'll work with my recommendations." As soon as one part is clear, play it back in a few lines, theirs as theirs and your fills as your proposals, then move on. Done when the destination is covered.

3. **Lay out approaches.** Skip it when the caller says so. Otherwise give 2 or 3 real ways to do it, each grounded in the scope and with its trade-off, recommend one, and let the user pick. When there's one sensible way, say why the others don't fit.

4. **Builder check.** Start a fresh subagent (or read it yourself without one) with the summary and this brief: "You must build from this and can't ask its author. List only the questions where a wrong guess would matter, most important first, or say nothing important is left." Sort what comes back: **answered** (fill it in), **minor** (decide, mark as your call), **theirs**. Ask the theirs pile in one last round. Done when that round is answered: there is no other round.

Reply with the **summary**: the destination's fields as settled, the approach picked, out of scope, and the list of calls you made, so the user can check them.

## Trace

Keep a **trace** as you go: every question, its recommended answer, the answer and who settled it, so anyone can see later why the result is what it is. Write it to the path the caller gives; standalone, offer to save it to `docs/brainstorms/<YYYY-MM-DD>-<slug>.md`. Number questions across rounds (Q1, Q2…), and give each the questions it depends on, so the table reads as the decision tree. **Settled by** is one of: `user` (in their words), `yes` (accepted the recommendation), `call` (minor, you decided), `fact` (looked up, with its source), `builder` (raised by the builder check).

<trace-template>

---
topic: <title>
date: <YYYY-MM-DD>
scope: <inside | outside>
destination: <what had to be settled>
---

# Decisions · <title>

| # | Round | Question | Recommended | Answer | Settled by | Depends on |
|---|---|---|---|---|---|---|
| Q1 | 1 | <question> | <recommended> | <answer> | <user · yes · call · fact: source · builder> | — |

## Approaches

| Approach | Trade-off | Picked |
|---|---|---|

## Out of scope

- <item>: <why>

</trace-template>
