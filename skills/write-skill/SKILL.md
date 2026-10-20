---
name: write-skill
description: Draft a new skill, or rewrite an existing one, short and built on leading words.
argument-hint: "What should the skill do? (or a path to an existing SKILL.md)"
disable-model-invocation: true
metadata:
  author: Anas Sahel
  version: 1.0.0
  credits: Method adapted from Matt Pocock's writing-for-agents (https://github.com/mattpocock/skills)
---

Write a `SKILL.md` the agent follows the same way every run, in as few lines as it takes. The method is Matt Pocock's [writing-for-agents](https://github.com/mattpocock/skills/tree/main/skills/productivity/writing-for-agents).

If the argument is a path to an existing skill, read it: this run is a **rewrite**, and the version gets bumped.

## Steps

1. **Pin the job.** Write two sentences: the skill's job, and its **defining constraint** (the one thing it does differently from the obvious default). Ask the user only for what you cannot infer, in one batch. Done when both sentences exist.

2. **Choose invocation.** User-invoked by default: `disable-model-invocation: true` and a one-line human description. Make it model-invoked only when the agent or another skill must reach it alone; then the description opens with the leading word, then "Use when" and one trigger per distinct case.

3. **Find the leading words.** One to three words the model already knows that carry the behaviour (_tracer bullet_, _frontier_, _seam_, _relentless_). Bold each at first use, then repeat it as a token. Done when every idea that recurs is one word.

4. **Draft the body.**
   - Ordered steps when the skill has a sequence, flat reference when it does not, both when it needs both.
   - Every step ends on a checkable **completion criterion**.
   - State the target behaviour. Keep a prohibition only as a hard guardrail, paired with what to do instead.
   - Templates go in XML-style tags (`<ticket-template>`).
   - What every run needs stays inline. What only some branches need goes to a sibling file, behind one line saying when to read it.
   - Reuse another skill by calling it ("Call the Skill tool with X"), never by copying its content.

5. **Prune.** Go sentence by sentence and delete the whole sentence when it:
   - is a **no-op**: the model would do it anyway;
   - restates the environment (folder layout, scripts, config) or another doc (CLAUDE.md, another skill);
   - no longer bears on the job.

   Done when a full pass deletes nothing.

6. **Show.** Present the draft, its line count before and after pruning, and the leading words. Save it only once the user approves, where the user says.

## Frontmatter

<frontmatter-template>
---
name: <kebab-case, verb first, the word the user would type>
description: <user-invoked: one human line | model-invoked: leading word, then "Use when" + one trigger per branch>
argument-hint: "<only if the skill takes arguments>"
disable-model-invocation: true   # user-invoked only
metadata:
  author: Anas Sahel
  version: 1.0.0
---
</frontmatter-template>

`version` is semver. A new skill starts at `1.0.0`. On a rewrite: patch when only wording changes, minor when a step or branch is added, major when invocation, arguments or output change.

## Rules

- No H1 unless the skill has several sections. No em-dashes: use a comma, colon, period or parentheses.
- Bold marks a leading word, nothing else.
- Past about 100 lines, split by branch or move reference to a sibling file.
