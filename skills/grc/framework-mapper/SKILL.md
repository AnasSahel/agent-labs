---
name: framework-mapper
description: Map security controls and compliance clauses across ISO 27001 and the frameworks mapped to it (NIS2, DORA, GDPR, AI Act, CRA, ISO 27701, ISO 22301, ISO 42001, SOC 2, PCI DSS, HDS, NIST CSF, CIS, ANSSI hygiene) from fixed mapping files, never from memory, without grilling. Use when the user asks which clauses a control covers, what ISO 27001 controls meet a clause of another framework (a NIS2 or DORA article, a SOC 2 criterion, a PCI DSS requirement), wants a crosswalk or coverage matrix between frameworks, asks which of two overlapping frameworks applies or wins (NIS2 or DORA for a financial entity, for incidents or risk management), or wants to know which clauses the controls in their risk register touch and which they leave untouched.
metadata:
  author: Anas Sahel
  version: 1.0.0 # x-release-please-version
  frameworks: [ai-act, anssi-hygiene, cis, cra, dora, gdpr, hds, iso22301, iso27001, iso27701, iso42001, nis2, nist-csf, pci-dss, soc2]
---

Answer "what does this control cover?" and "what meets this clause?" from the **files** in [frameworks/](frameworks/), and nothing else. ISO 27001 is the **pivot**: every other framework maps to its refs, so every answer goes through an ISO 27001 ref. Act at once, no grilling.

**The files are the only source.** Run [crosswalk.py](crosswalk.py) for every lookup and give its rows as they come: it reads the files, so no clause is recalled and no row is skipped. A clause, ref or framework the files don't hold is `not mapped`, said plainly, never filled from memory.

## Steps

1. **Scope.** Read the frameworks in scope from `grc/context.md` (every file in `frameworks/` when it is missing or names none; the user's request wins). A framework in scope without a file in `frameworks/`: say `<framework>: not mapped yet` and carry on with the others. When `grc/context.md` names a national law for NIS2, say its article numbers win and these are the EU reference. Done when you know the framework ids to pass.

2. **Resolve** what the user named into the script's terms:
   - An ISO 27001 ref (`A.8.5`, `6.1.2`): as is.
   - A control in words ("MFA", "backups"): `crosswalk.py find <word>` and pick the ref whose title fits, saying which (`MFA → A.8.5 Secure authentication`). When two titles fit as well, ask once which one; that is the only question you may ask.
   - A framework clause ("DORA Art. 19", "NIS2 21(2)(b)"): framework id and clause as the file writes it (`dora "Art. 19"`, `nis2 "Art. 21(2)(b)"`).
   - "Our register", "what we cover": `grc/risk-register.md`.
   - "Everything", "a crosswalk", "a matrix": the full matrix.

   Done when every item maps to one query, or is `not mapped`.

3. **Look up.** Run from this skill's folder, with `--frameworks` from step 1:
   - `crosswalk.py --frameworks <ids> ref <refs>`: the clauses each ref meets.
   - `crosswalk.py --frameworks <ids> clause <id> "<clause>"`: its ISO refs and fit, its **extras**, and the clauses of the other frameworks sharing those refs.
   - `crosswalk.py --frameworks <ids> register grc/risk-register.md`: per clause, `touched` (a register control meets it), `touched, extras open` (partial: the extras still need their own work), or `untouched`.
   - `crosswalk.py --frameworks <ids> matrix`: every ISO ref, one column per framework, then every extra.

   The script prints each file's `checked` date and `status` on stderr: keep them. Done when every query has run and its rows are in hand.

4. **Show** in the chat, the answer first, in plain words:
   - One line that answers the question (`A.8.5 meets NIS2 Art. 21(2)(j) and DORA Art. 9; no GDPR clause cites it`).
   - The rows as a table. A `partial` fit always comes with its **extras** under the table: a fit is never shown as full when the file says partial.
   - For a register run: per framework, `<n> of <m> clauses touched`, then the untouched ones, then the open extras. Untouched means no risk control meets it, not that the organisation fails it: say proving it is `gap-analysis`'s job.
   - A last line from the files' front matter when any is `status: draft`: `Mappings are drafts (checked <date>), to review by a practitioner.`

   Every clause and every number in the answer comes from the rows the script printed: count the list you show, and a clause it did not print (a recital, a scope article, another law) is `not mapped`, even when the answer is a no. Done when the user has the answer, every row, every triggered extra and the draft line.

5. **Write** only when the user asks for a file, or for a `matrix` or `register` run (more than 30 rows): then ask the format once, recommending `xlsx`, and save to `grc/mappings/<YYYY-MM-DD>-<query>.<ext>`.
   - `md`, `csv`, `json`: the script's `--format` output, as is.
   - `xlsx`: call the Skill tool with `xlsx`. Sheets: `Matrix` (or `Coverage`: frozen header, filters on, `partial` and `untouched` cells tinted), `Extras`, `Sources` (each file, its `checked` date and `status`). Empty cells are `None`, never `""`: openpyxl saves `""` as an empty inline string and Excel then calls the whole file corrupt.
   - `html`, `pdf`: an eyebrow `FRAMEWORK MAP · <date>`, a headline with the one-line answer, then the tables.

   Visual formats (xlsx, html, pdf) follow `theme.md` of the `risk-assessment` skill: read it from that skill's folder; when it is not installed, electric blue `#2F5BFF` the only accent, white background, grays, Geist, flat, square corners; html follows the system light/dark setting, files (pdf, pptx, xlsx, docx) stay light. Text formats stay plain. Done when every file is listed with its path.

## Route

- "Do we comply?", evidence, audit findings: `gap-analysis` checks what the organisation does against the clauses; you only say which clauses map to which controls.
- A missing or wrong row in a mapping file: the fix goes in `frameworks/<id>.md` at the repo root, then `scripts/sync-agents` and `scripts/check-frameworks`. Never patch this skill's copy, and never answer with the row you think is right.
