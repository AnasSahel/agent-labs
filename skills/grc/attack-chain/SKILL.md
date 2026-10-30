---
name: attack-chain
description: Chain risks from the register into one compound attack, where what the attacker holds at the end of one risk is the way in to the next (a phishing email, then an old server, then payroll), score the chain by its hardest step and its final impact, name the one fix that breaks it, and draw it for managers, after a short grill. Use when the user asks how an attacker could get from one foothold to an asset, wants to combine, link or chain risks or attack paths, asks for the worst case across risks, or when risk-assessment reports that a new risk completes a chain.
metadata:
  author: Anas Sahel
  version: 1.0.0 # x-release-please-version
---

Turn risks already in `grc/risk-register.md` into one **chain**: what the attacker holds at the end of one risk is the way in to the next. Risks link through **footholds** from the fixed list in [footholds.md](footholds.md): a route `needs` one, a risk `gives` one. You link, score and draw; you never score a single risk (that is `risk-assessment`).

## Steps

1. **Find.** Load the register, each risk's `grc/risks/<id>-attack-path.html` JSON (its routes with `needs`, its `gives`), `grc/context.md` (appetite) and `grc/chains/`. Build every chain of 2 to 4 links that ends at the asked impact, or, with none asked, at an impact of Serious (G3) or worse: start from routes that need `outside`, then follow `gives` to a route of another risk that `needs` it. A risk without `needs` or `gives` (assessed before chains existed): read its report and propose them, marked `proposed`.
   - A chain in `grc/chains/` with the same links: this run **updates** it, same id.
   - A missing link (no risk gives what the next one needs): keep it as an **assumed step**, `"assumed": true`.
   - Pick the chain with the highest level; keep up to 2 others as alternatives for the grill.

   Then draw it as a **draft chain** (see Draw), titled `Draft`, before any question. Done when the user has seen the draft and you know whether it is new.

2. **Grill.** Call the Skill tool with `grc-grill`:
   - intensity: `light`
   - destination: the final impact, the links (keep, drop, or take an alternative chain), the **step likelihood** of each link whose own score assumed an outsider, each gap (assess now or keep assumed), owner, due date
   - docs: `grc/context.md`, `grc/risk-register.md`, `grc/risks/`, `grc/chains/`
   - framework: the frameworks in scope; scoring by ISO 27005 and EBIOS RM (a chain is a strategic scenario built from operational ones)
   - output default: `html`

   Ask each link in plain words: "Once they hold the staff laptop, how easy is reaching the file server?", with the 4 likelihood words and one example each. A gap the user wants assessed: call the Skill tool with `risk-assessment` for it, then come back. Redraw after each answer that changes a link, a step or a gap. Done when it hands back every field and the formats.

3. **Score.** Same scales and level rule as `risk-assessment` (from `grc/context.md` when set):
   - **Step likelihood**: how easy a link is **once the attacker holds the foothold**: the highest likelihood among that risk's routes that start from it, or the grill's answer. The first link counts its routes from `outside`.
   - **Chain likelihood** = the **lowest** step: every step must work. No extra drop for long chains.
   - **Chain severity** = the severity of the last link's impact.
   - **Residual**: the same, with each route's likelihood after its planned fixes.
   - **Hidden risk**: the chain's level is above every link's own current level. Say it in the headline ("Three medium risks add up to one high risk") and offer to reassess the last risk with `risk-assessment`, as its own score underrates it.
   - **Break here**: pushing any one step to Unlikely (V1) drops the whole chain. Name one fix: on the link shared by the most chains in `grc/chains/`, then a control already planned in that risk's treatment, then the one the user picks. One sentence for managers: "Patch the file server and the whole chain breaks."

   Residual above appetite with no fix planned: say so; the treatment belongs to the linked risks, so route it to `risk-assessment` on the break-here risk. Done when inherent, residual and break here are set.

4. **Draw.** Plain words for managers ("once inside the laptop", not "post-exploitation"). Fill a fresh copy of [chain.html](chain.html) from this skill's folder into `grc/chains/<id>-chain.html` (only its JSON), every draw and redraw:
   - `title`: the claim, with the chain's level next to the links' levels; `verdict`: the break-here sentence; `summary`: what could happen, one or two sentences.
   - `links`, in order: `risk`, a 4 to 8 word `title`, its own `score` and `level`, `routes` (count), 2 or 3 `icons` from the risk's path (the same icon names as `attack-path.html`), `report` (relative link to its attack path), and `gives` (`id`, the `label` from footholds.md, the next link's `step`). The last link has no `gives`. A gap: `{"assumed": true, "title": ..., "gives": ...}`.
   - `impact` (`label`, `severity`), `breakHere` (`link`: the index of the link whose step it lowers, `control`, `ref`, `status`), `score` (`alone`, `today`, `after`, each with a short note).

   **Look**: the look of `theme.md` in the `risk-assessment` skill's folder ([example](examples/chain-sample.png)). A play circle, then one row of framed **chapters** (one per risk: id, level tag, title, its path as icons only), joined by black **handoff tags** naming the foothold and the next step's likelihood word, a dashed empty chapter for a gap, the break-here fix as a green box under the handoff it cuts, the impact as a dashed red tile. Under it: each risk alone, the chain today, after the fix. One column on narrow screens.

   Show it the way `risk-assessment` shows an attack path: the visualize tool first (drawn inline in this look), else the saved copy in a browser, else a screenshot, else the ASCII template. Never paste HTML or Mermaid into the reply. Done when the user has seen the final chain.

5. **Write.**
   - Add or update the row in the **Chains** table of `grc/risk-register.md` (create the table from the template under the risks table when missing; ids `C-001`, `C-002`…).
   - Write `grc/chains/<id>-<slug>.md` from the report template, then each format picked, as `risk-assessment` renders its own: text formats plain, visual formats in `theme.md` via the `pdf`, `pptx`, `xlsx` or `docx` skill, with a screenshot of the filled `chain.html` as the picture.
   - Log the answers in `grc/traces/<id>-<date>.md` (the grill's trace).

   Done when the register row exists and every requested file is listed with its path.

## Templates

<chains-template>
## Chains

| ID | Goal | Links | Owner | Inherent | Break here | Residual | Status | Updated | Trace |
|---|---|---|---|---|---|---|---|---|---|
| C-001 | <final impact> | R-003 → R-007 → R-002 | <owner> | G4·V3 high | R-007: A.8.8 | G4·V1 medium | open | <date> | traces/<file> |
</chains-template>

Status is `open`, `broken` (a break-here fix is in place), or `closed`. Links list the risk ids in order, `?` for a gap.

<ascii-template>
```
▶ ─▶ [R-003 Fake invoice email] ─▶ (Staff laptop · Likely) ─▶ [R-007 Old file server] ─▶ (Admin account · Likely) ─▶ [R-002 Payroll changed] ─▶ ⚠ Salaries paid · G4
                                                                                        🛡 Break here: patch within 14 days · A.8.8
```
</ascii-template>

<report-template>
# <ID> · <goal>

**Owner** <owner> · **Status** <open | broken | closed> · **Updated** <date>

## Executive summary
Four short lines, plain words, 120 words at most:
- **What could happen**: the final impact and the steps in one sentence.
- **Why it matters**: the chain's level against each risk alone (hidden risk when higher).
- **Where we stand**: level today → after fixes, against the appetite.
- **What we need**: the break-here fix, its owner and due date.

## Chain
Visual: `<id>-chain.html`

| # | Risk | Needs | Gives | Step likelihood | After fixes |
|---|---|---|---|---|---|
| 1 | R-003 <title> | From outside | Staff laptop | Likely (V3) | Likely (V3) |

## Score
| | Severity | Likelihood | Level |
|---|---|---|---|
| Each risk alone | | | |
| Chain today | | | |
| Chain after fixes | | | |

## Break here
<control> on <risk>, ISO 27001 <ref>: why this link, and what it changes.

## Gaps and alternatives
Assumed steps and the other chains found, or none.

## Decisions
Link to the trace, and the calls made without the user.
</report-template>
