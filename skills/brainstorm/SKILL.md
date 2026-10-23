---
name: brainstorm
description: Brainstorm an idea, plan or decision with the user until it's concrete. Widen to other framings and options first, then narrow in rounds of questions, each with a recommended answer, until the destination is settled. Use when the user wants to brainstorm, explore an idea, think something through or flesh it out, or before writing an intent or a spec.
metadata:
  author: Anas Sahel
  version: 1.0.0
  credits: Narrowing adapted from Matt Pocock's grilling (https://github.com/mattpocock/skills), MIT
---

Take an idea from vague to concrete with the user: **widen** to see the options, then **narrow** until the **destination** is settled.

The destination is what must be settled for the brainstorm to be done. A caller may set it (for example: "fill the intent fields: problem, who is affected, why now, success looks like, out of scope, evidence"). When none is set, propose one in a sentence and get the user's yes before anything else.

## Steps

1. **Widen.** Restate the problem in two or three other framings (whose problem it is, what really goes wrong, what it would look like solved). List 3 to 5 options, always including "do nothing", each with a one-line trade-off, and recommend one. Skip this step when the idea is already narrow and concrete, or when the caller says so. Done when the user has picked an option or framing, or the step was skipped.

2. **Narrow.** Map the decisions left before the destination as a **design tree**: each decision branches into the ones that hang off it. Work it in **rounds**. The **frontier** is every decision whose prerequisites are settled; ask the whole frontier in one round, never a question that depends on another one still open.

   Number each question, give your recommended answer, and word it so "yes" accepts the recommendation:

   <round-template>
   **Q1. <title>**: <question, with the choices when there are any>
   Recommended: <your answer>
   </round-template>

   **Facts** are your job: look them up in the code, docs or tools, or dispatch a subagent, and never ask the user for something you could find. Only the questions downstream of a running lookup wait for it. **Decisions** are the user's: put each to them and wait. After each round, recompute the frontier from the answers. Done when the frontier is empty for the destination: every branch visited, nothing silently assumed.

3. **Confirm.** Play back the shared understanding in a few lines and ask the user to confirm it. On a correction, go back to step 2 for what it reopens. Act on nothing before this yes. Done when the user confirms.

Reply with a short **summary**: each decision settled, and what was ruled out of scope. Write no files unless the caller asks.
