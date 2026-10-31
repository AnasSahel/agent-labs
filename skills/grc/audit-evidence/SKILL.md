---
name: audit-evidence
description: Collect audit evidence into `grc/evidence/`, file each piece against the ISO 27001 controls it proves, show which controls in scope are evidenced, stale or missing for ISO 27001, NIS2, DORA or GDPR from fixed mapping files, catch controls the register calls in place with nothing to prove it, draft the requests to fill the holes, build the pack for the auditor, and record the audit's findings, without grilling. Use when the user adds or sends evidence (screenshots, exports, logs, signed policies), prepares an audit or certification, asks what is missing or out of date before an audit, wants evidence requests for control owners, wants an audit pack or evidence index, or comes back with an auditor's findings or nonconformities.
metadata:
  author: Anas Sahel
  version: 1.0.0 # x-release-please-version
  frameworks: [iso27001, nis2, dora, gdpr]
---

Keep `grc/evidence/` the proof that controls work, ready for the auditor any day. Each **evidence** is one dated file, filed against the ISO 27001 controls it proves, and the **coverage** says, per control in scope, whether the proof is there and still valid. Act at once, no grilling: you file, compute and show. Scores and treatments are not yours: they come from `risk-assessment`.

## Steps

1. **Read.** Load `grc/context.md` (frameworks in scope, the audit date and scope, the **SoA**: the controls declared applicable and why the others are not), `grc/evidence/index.md` (create it from the template when missing), `grc/risk-register.md` and each report in `grc/risks/` (the controls claimed `in place`), and the latest audit in `grc/evidence/audits/`. Look refs up in [frameworks/](frameworks/), never from memory: a ref missing from `iso27001.md` does not exist. No SoA: the scope is every clause 4 to 10 and all 93 Annex A controls of `iso27001.md`; say so in one line. Done when you know every control in scope and every evidence on file.

2. **Act** on what the user asked, one of:
   - **Collect**: for each file, link or pasted export, read it and write one index row: what it shows in plain words, its **kind** (`design`: a policy, procedure or plan that says what should happen; `operating`: a dated record that it did happen, such as a log, ticket, signed review, scan report or test result), the ISO 27001 refs it proves **by its content, not its file name**, the period it covers, `Valid until`, owner and source. Copy it to `grc/evidence/files/<E-id>-<slug>.<ext>` (never move or edit the original) and store its SHA-256. A file whose hash is already on file is a duplicate: say which evidence it repeats. A screenshot or export with no visible date is `design` at best; say what would make it operating evidence.
   - **Coverage**: give each control in scope one status from the rows of `grc/evidence/index.md` only: a risk report, trace or policy elsewhere in `grc/` is not evidence until it is collected (offer to collect it). `evidenced` (operating evidence valid today), `design only` (a policy, no record yet), `stale` (its newest operating evidence is past `Valid until`, or will be before the audit date), `missing` (nothing), `not applicable` (excluded in the SoA, with its reason; an exclusion without a reason counts as `missing`). Then flag each **unproven** control: `in place` in the register or a risk report, but `missing`, `stale` or `design only` here. For another framework in scope, a clause is covered when every ISO 27001 ref of its row in `<id>.md` is `evidenced`, and each of its **extras** needs its own evidence (a breach register, a 72-hour notification record), listed as its own line. Done when every control and clause in scope has a status.
   - **Request**: one request per `missing`, `stale`, `design only` or unproven control, unproven first: owner, the exact proof to send (`export of the Q3 admin access review, signed and dated`, not `access control evidence`), and a due date one week before the audit date when there is one. Batch them by owner.
   - **Pack**: for an audit (date, framework, scope): the coverage, then per control its evidence ids, files and hashes, in `grc/evidence/packs/<YYYY-MM-DD>-<framework>/`. Only valid evidence goes in; the rest is listed as a hole, never padded with something weaker. Call the Skill tool with `grc-grill` at intensity `none`, output default `xlsx`, for the format.
   - **Record**: write the audit's findings to `grc/evidence/audits/<YYYY-MM-DD>-<auditor>.md` from the template, each with its ISO 27001 ref, **in the auditor's words**. Never record a finding the user did not report.

   Valid until: the date in `grc/context.md` for that control, else 3 months after the period covered for A.5.18, A.8.2, A.8.8, A.8.13, A.8.15 and A.8.16 (reviews, scans, backups and logs auditors expect each quarter), else 12 months. Done when the asked action is applied to the files or shown.

3. **Route** what is not yours:
   - An unproven control, or a finding that a control does not work: call the Skill tool with `risk-register` to set that control back to `planned` on the risks that rely on it, with the finding or the coverage as the `fact` source.
   - A finding that shows a new risk, or "is this risk still right?": call the Skill tool with `risk-assessment`.
   - Done when nothing outside `grc/evidence/` and your trace was changed by you.

4. **Log** every change in `grc/traces/<YYYY-MM-DD>-evidence.md` (append): `| Time | Item | Change | Before | After | Settled by |`, **Settled by** one of `user` (quote the words), `fact: <source>` (a file, an audit report) or `call`. Done when each new or changed row has its line.

5. **Show** in the chat: the headline (`61 of 84 controls evidenced, 4 unproven.`), then the **coverage map**: one small square tile per control in scope, grouped in four rows by theme (clauses 4 to 10, Organizational, People, Physical, Technological), each tile its ref, colored by status (`evidenced` green, `design only` amber, `stale` amber with a dashed border, `missing` red, `not applicable` light gray), an unproven tile solid red with a black border and `!`, a legend with the counts ([examples/coverage-map.png](examples/coverage-map.png)). Then the holes as a table, unproven first. Draw it with the visualize tool when one exists, else as a markdown table by theme with counts. Done when the user sees the map and what is missing.

## Formats

Text-only (md, csv, json, yaml, Jira) stay plain. Visual ones (html, pdf, pptx, xlsx, docx) follow `theme.md` of the `risk-assessment` skill: read it from that skill's folder; when it is not installed, use its rules in short: electric blue `#2F5BFF` the only accent, grays, Geist, flat, light only. The status colors are the theme's `low`, `medium` and `high` on their soft fills.

- **html / pdf**: eyebrow `AUDIT EVIDENCE · <framework> · <date>`, headline `<x> of <y> controls evidenced` with `<k> missing, <u> unproven.` in accent, the executive summary (**Where we stand**, **What is unproven**, **What is late**, **What we need**), the coverage map, the requests by owner, then the coverage table.
- **xlsx**: sheets `Summary` (eyebrow, headline, executive summary, counts by status), `Coverage` (one row per control: ref, title, theme, status as a colored cell, evidence ids, valid until, owner; filters on), `Evidence` (the index), `Requests`, `Findings`. Frozen headers, gridlines off.
- **pptx**: the Split deck of `theme.md`, four slides: title, coverage map (title `<x> of <y> controls evidenced`), unproven and missing (`ID | Control | Status | Owner | Ask`), requests by owner with due dates.
- **zip**: the pack folder with its files, for an auditor portal.
- **Jira**: one issue per request, assigned to the owner; without a connector, say so and hand over the CSV.

## Templates

<index-template>
# Evidence index

| ID | Evidence | Kind | ISO 27001 | Period | Collected | Valid until | Owner | Source | File | SHA-256 |
|---|---|---|---|---|---|---|---|---|---|---|
| E-001 | <what it shows> | operating | A.5.18, A.8.2 | <YYYY-MM-DD> to <YYYY-MM-DD> | <YYYY-MM-DD> | <YYYY-MM-DD> | <owner> | <who sent it, or the tool it came from> | files/E-001-<slug>.<ext> | <hash> |
</index-template>

Ids `E-001`, `E-002`…, never reused. Dates always with the year. Replacing an evidence adds a row; the old one stays for the audit trail.

<audit-template>
---
auditor: <name or firm>
type: <internal | certification | surveillance | regulator | customer>
framework: <framework>
date: <YYYY-MM-DD>
report: <path or link to the auditor's report>
---

| # | Finding | Grade | ISO 27001 | Owner | Due | Status |
|---|---|---|---|---|---|---|
| F-01 | <the auditor's words> | <major NC · minor NC · observation · opportunity> | A.x.y | <owner> | <YYYY-MM-DD> | <open · fixed · closed> |
</audit-template>
