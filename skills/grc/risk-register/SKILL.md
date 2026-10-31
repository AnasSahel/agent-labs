---
name: risk-register
description: "Keep the risk register, `grc/risk-register.md`, as the one source of truth for every risk: list, filter and review it, update a row's status, owner, due date or control progress, import risks from a spreadsheet or Jira, and export it with a portfolio heat map, without grilling. Use when the user wants to see, sort or filter their risks, find overdue or stale ones, change a risk's status, owner, due date or control status, close a risk, import or export the register, or show it to management."
metadata:
  author: Anas Sahel
  version: 1.0.0 # x-release-please-version
---

Keep `grc/risk-register.md` the **register**: the one source of truth every GRC skill reads and writes. Act at once, no grilling: read, change, show. Scores and treatments are not yours to change: they come from `risk-assessment`.

## Steps

1. **Read.** Load `grc/risk-register.md` (create it from the template when missing), the appetite in `grc/context.md`, and each row's report in `grc/risks/` for its controls' status. Work out each risk's **current level**: the residual once every treatment control is `in place`, else the inherent. Done when you know every row, its current level and the appetite.

2. **Act** on what the user asked, one of:
   - **View**: the rows they asked for, filtered and sorted (by level, owner, status, due date, or framework: the register holds ISO 27001 refs only, so read the other frameworks from each row's report in `grc/risks/`; a row without a report counts as `framework unknown`, never as not concerned). Default: open risks, highest residual first.
   - **Review**: flag each row that needs attention: **overdue** (due date passed, not closed), **stale** (not updated in 90 days), **above appetite** (current level above it and not accepted, even when the residual will be within it; ask for an interim acceptance until the fixes land), **acceptance to renew** (accepted more than a year ago). Then name **shared root causes**: one policy gap or missing control behind several risks, fixed once. Flag each row of the **Chains** table above appetite, and each chain whose linked risk was updated after it (refresh it with `attack-chain`). Done when every flagged row has its reason.
   - **Update**: change only status, owner, due date, a control's status, or the trace link. Then set `Updated` to today.
   - **Import**: read the user's CSV, xlsx or Jira issues, map their columns to the register's (say which you mapped and which you dropped), give each new risk the next id (`R-00n`), and mark unscored ones `to assess`. Never overwrite an existing row without showing the change.
   - **Export**: the formats the user names, else none (the chat view is enough).

   Done when the asked action is applied to the file or shown.

3. **Route** what is not yours:
   - A new score, a new treatment, a new or reworded scenario, or "is this still right?": call the Skill tool with `risk-assessment` on that row (a **reassessment**, same id).
   - Status `accepted`, or closing a risk whose residual is above appetite: only with the owner's words, quoted. Ask once when you don't have them.
   - Done when nothing outside your list in step 2 was changed by you.

4. **Log** every change in `grc/traces/<YYYY-MM-DD>-register.md` (append): `| Time | ID | Field | Before | After | Settled by |`, with **Settled by** one of `user` (quote the words), `fact: <source>` (an import, a Jira status) or `call`. Done when each changed cell has its row.

5. **Show** in the chat, in every action (view, review, update, import): the affected rows as a table, levels in words first with the codes ("High (G4·V3)", never "🔴 high" alone), then the **portfolio heat map** whenever more than one risk is shown, the same in every action: the 4×4 grid, severity **down** (rows G4, G3, G2, G1 from the top) and likelihood **across** (columns V1, V2, V3, V4 from the left), all 4 rows and 4 columns drawn even when empty, each risk's id in the cell of its current level, with `R-001 →` pointing to its residual cell while fixes are planned. Each cell is colored by the level rule of `risk-assessment` (G×V to high, medium or low), so exactly 3 colors from `theme.md`, never a fourth such as "low-medium"; print the color key under the map (high · medium · low). Dates always with the year. Draw it with the visualize tool when one exists, else as a markdown table. Done when the user sees the rows and the map.

## Formats

Text-only (md, csv, json, yaml, Jira) stay plain. Visual ones (html, pdf, pptx, xlsx, docx) follow `theme.md` of the `risk-assessment` skill: read it from that skill's folder; when it is not installed, use its rules in short: electric blue `#2F5BFF` the only accent, white background, grays, Geist, flat, square corners; html follows the system light/dark setting, files (pdf, pptx, xlsx, docx) stay light, the heat map as real colored cells.

- **html / pdf**: eyebrow `RISK REGISTER · <date>`, headline `<n> open risks` with `<k> above appetite.` in accent, the review flags as a short list, the portfolio heat map, then the table.
- **xlsx**: sheets `Register` (every column, frozen header, level cells colored, filters on), `Heat map` (ids in the grid cells), `Review` (flagged rows and their reason). Empty cells are `None`, never `""`: openpyxl saves `""` as an empty inline string and Excel then calls the whole file corrupt.
- **pptx**: the Split deck of `theme.md`, four slides: title, heat map, what needs attention, the top five risks.
- **Jira**: one issue per open risk without one, or update the status of linked ones; without a connector, say so and hand over the CSV.

## Templates

<register-template>
# Risk register

| ID | Scenario | Asset | Owner | Inherent | Treatment | Controls (ISO 27001) | Residual | Status | Due | Updated | Trace |
|---|---|---|---|---|---|---|---|---|---|---|---|
| R-001 | <scenario> | <asset> | <owner> | G3·V3 high | reduce | A.5.19, A.8.13 | G3·V1 medium | open | <date> | <date> | traces/<file> |
</register-template>

Status is one of `to assess`, `open`, `treated`, `accepted`, `closed`, and nothing else: an acceptance waiting for a committee is `open`, with `acceptance pending <body>` in the trace. The columns are the ones `risk-assessment` writes: keep them in this order.

The register may end with a **Chains** table (`C-001`…), written by `attack-chain`: show it after the risks when it exists, review it as above, and change only its status, owner or trace link; links and scores go back to `attack-chain`.
