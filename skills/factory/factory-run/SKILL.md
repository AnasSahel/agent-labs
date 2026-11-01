---
name: factory-run
description: Run a request through the factory (plan, design, build) in one go, stopping only where a person must decide. Use when the user brings a bug, idea, issue or intent and wants it built, says "run the factory", "take it from here" or "what's next on 42", or asks where an issue stands.
model: sonnet
metadata:
  author: Anas Sahel
  version: 1.0.0 # x-release-please-version
  agents: []
---

Carry one request through **factory-plan**, **factory-design** and **factory-build** without the user running each phase by hand. The run stops at a **real stop** only: a decision nobody else can make, a gate the lane requires, or a blocked step. Everything else is decided, written down as an assumption, and the next phase starts.

Call each phase with the Skill tool. Never copy its content here.

## Steps

1. **Find the state.** With an issue or intent, read its state (`needs-go`, `needs-design`, `designed`, `needs-plan`, `planned`, `building`, `built`, `blocked`, `split`) from the tracker, or from `intent/` and `specs/` with files. With a new request, the state is `new`. Done when you can say which phase is next.

2. **Pick the lane.** Size the change as factory-plan does (`S` one file, `M` a few files, `L` several areas or a migration), and look for anything that makes it risky: a migration, a public interface, personal data, auth, money, or a repo rule that says so.
   - **Fast lane**: size `S` and nothing risky. No intent pull request, no plan gate: the issue is the intent, the plan is written and followed. The spec's pull request stays the gate.
   - **Full lane**: anything else. Every gate stays.

   Design's review can still raise a `high` finding: that moves the run to the full lane, and the plan gate comes back. Done when the lane is named with its reason in one line.

3. **Ask once.** Gather every question the phases would ask (plan's brainstorm, design's unknowns, build's plan questions) that the request and the code cannot answer. Ask them in one list, each with a recommended answer. "yes" accepts every recommendation. Unknowns the user leaves open become assumptions. Done when no phase has a question left to ask.

4. **Run the phases.** From the current state, call the next phase and, when it ends at a state the lane does not stop at, call the one after, until a real stop.

   | Phase ends at | Full lane | Fast lane |
   |---|---|---|
   | intent pull request open | **stop**: merge = go | skipped |
   | `designed` (spec pull request open) | **stop**: merge = approve | **stop**: merge = approve |
   | `needs-plan` | **stop**: plan gate | accept the plan, go on |
   | `built` | **stop**: code review | **stop**: code review |

   A merged intent or spec pull request is the go for the next phase: when the harness can start it (a CI job, a watched pull request), start it; otherwise say the exact command. Done when the run is at a stop in the table or blocked.

5. **Say where it stands.** End every reply with this block, so nobody opens the tracker to find out:

   <status-block>
   **Issue**: <id> · <title>
   **Lane**: <fast | full>, because <reason>
   **State**: <state>
   **Next**: <what happens next>
   **Waiting on**: <who, for what, with the link> or "nobody"
   </status-block>

## Models

factory-run itself only routes, so it runs on `sonnet`. Each phase brings its own model (see its Models section); pass a repo's `factory: model <step> <model>` overrides to the phase you call. In the fast lane the build's code step stays on `sonnet`; the plan and the verifier stay on `opus`.

## Rules

- A stop is real only when the table says so or a decision belongs to a person. Do not stop to report progress, confirm a default or ask permission for the next phase.
- Do not skip a gate the lane requires, whatever the user's tone. To skip one, the user says so for this issue.
- A phase that fails or blocks ends the run: report it in the status block, never retry past it.
