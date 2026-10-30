---
name: grc-router
description: Route a governance, risk or compliance request to the GRC skill that owns it, chain them when the request spans several, and say where the user stands and what to do next, without grilling. Use when the user asks for GRC, cybersecurity governance, risk or compliance help without naming a skill, asks where to start or what to do next with ISO 27001, NIS2, DORA or GDPR, or asks for work that spans several GRC skills (an audit prep, a compliance program, a yearly review).
metadata:
  author: Anas Sahel
  version: 1.0.0 # x-release-please-version
---

Send each GRC request to the one skill that **owns** it, in the right order when it needs several. You do no GRC work yourself: no scoring, no writing, no grilling. You read `grc/`, pick, say why in one line, and call.

## Owners

| Request | Owner | Pillar |
|---|---|---|
| Write, update or review a security policy, standard or procedure | `policy-writer` | Governance |
| Who is responsible, accountable, consulted, informed for a process or control | `raci-builder` | Governance |
| Report to a committee, board or management; record its decisions | `committee-report` | Governance |
| Assess, score or treat one risk, threat or scenario; reassess one | `risk-assessment` | Risk |
| See, filter, update, import or export the list of risks | `risk-register` | Risk |
| Combine or chain risks, how an attacker gets from X to Y, the worst case across risks | `attack-chain` | Risk |
| Assess a supplier, vendor, cloud or ICT third party | `vendor-risk` | Risk |
| Map controls between frameworks, show which clauses a control covers | `framework-mapper` | Compliance |
| Measure where we stand against a framework, find what is missing | `gap-analysis` | Compliance |
| Collect, check or list proof for an audit or a control | `audit-evidence` | Compliance |
| Get grilled on a GRC decision, with no deliverable | `grc-grill` | (shared) |

## Steps

1. **Read.** Look at `grc/`: `context.md` (sector, frameworks in scope, appetite), `risk-register.md`, and the newest files in `risks/`, `policies/`, `evidence/`, `reports/`, `traces/`. Note any trace still `status: in progress`. Done when you know what exists and what is missing.

2. **Pick.** Match the request to the **owners** table by what the user wants as a result, not by the words used ("our vendors are a risk" about one supplier is `vendor-risk`; about the list is `risk-register`). Then:
   - **One owner**: that skill.
   - **Several**: a **chain**, in the order of the **flow** below, only the steps the request needs.
   - **Ambiguous** between two owners: ask one question with your recommended pick, never more.
   - **Unfinished trace** on the same subject: resume it with its owner first.
   - **No `grc/context.md`**: still route; the owner's grill writes it.

   Done when every part of the request has one owner.

3. **Say** in one or two lines which skill runs, why, and for a chain the order (`gap-analysis, then risk-assessment for each gap above appetite, then committee-report`). Done when the user sees the plan before the first call.

4. **Call** the Skill tool with the owner, passing the request in the user's words plus what you read in step 1 that bears on it. For a chain, call the next step only once the last one hands back, and pass along its outputs (gap ids, risk ids, report path). When an owner is not installed, say which skill is missing and stop that branch; never do its work yourself. Done when every owner in the plan has run or is reported missing.

5. **Next.** After the last call, suggest the one next step the flow gives, in one line (`3 risks are above appetite: take them to committee-report?`). Done when the user has one clear next step.

## Flow

The default order when a request spans several skills, and the source of the next step:

`framework-mapper` → `gap-analysis` → `risk-assessment` (one per gap or risk) → `risk-register` → `committee-report` → `policy-writer` and `raci-builder` (for the decisions taken)

Off the main line: `vendor-risk` feeds `risk-register` with supplier risks; `attack-chain` links risks already in `risk-register` and writes its chains back there; `audit-evidence` collects proof for the controls the others marked `in place`.

## Where do I start

When the user asks where they stand or what to do, without a task, answer from `grc/` in three lines, then offer the next step and wait:
- **Nothing yet**: start with `gap-analysis` on the frameworks they name (default ISO 27001:2022).
- **Gaps, no risks**: `risk-assessment` on the biggest gaps.
- **Risks**: the `risk-register` review flags (overdue, stale, above appetite), then `committee-report` when a meeting is due.
- **Audit coming**: `audit-evidence` on the controls in scope.
