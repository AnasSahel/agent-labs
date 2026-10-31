# Theme

The one look of every **visual** asset this skill makes, taken from anassahel.com's DESIGN.md. Sober, print-like and calm. html follows the system light/dark setting; files (pdf, pptx, xlsx, docx, images) stay light because they are printed and shared.

- **Themed**: html, pdf, pptx, xlsx, docx, images (png, svg), the attack path, and the drawing shown inline in the chat (visualize tool, widget, Artifact or canvas).
- **Not themed**: text-only files (md, json, csv, yaml, Jira issues). Keep them plain: no colors, no styling hints.

## Rules

- **One accent.** Electric blue `#2F5BFF` is the only brand color, with its ink and tint shades (the site's identity topic set). The site's other topic colors (GRC green, orange, violet) are for the blog only: never use them here. Everything else is gray.
- **Risk colors are signals, not decoration.** Use them only for a risk level, a severity, a weak spot or a control status.
- **Three levels, three colors.** Every heat map, bar and tag uses one level rule (high when G3+ with V3+, or G4 with V2+; low when both ≤ 2; medium otherwise) and exactly `low`, `medium`, `high`: no fourth "low-medium" color, no shades in between, the same in every run.
- **Every color has a key.** Wherever status or level colors appear (heat map, coverage bars, Annex A map, charts), print a legend beside them. Status colors: met `low` · partial `medium` · missing `high` · unknown `muted` · n/a `surface`.
- **Flat and square.** No gradients, no shadows, square corners everywhere (0px; 6px and 12px were tried and declined). No pills, no rounded cards. The ▶ start circle is the one round shape.
- **Thin rules** (`#E3E5E8`, 1px) separate sections instead of boxes.
- **Borders agree.** Every border uses `line` (or `line-strong` for section rules). An accent border is only for a selected state; never an accent bar on a box.
- **Upright type.** Never italic.
- **Eyebrows** (section labels, IDs, dates): Geist Mono, uppercase, `0.08em` tracking, muted.

## Tokens

| Token | Light | Dark (html only) | Use |
| --- | --- | --- | --- |
| `accent` | `#2F5BFF` | `#8AA4FF` | Eyebrows, links, the business asset, headline highlight, section numbers |
| `accent-ink` | `#1A2F80` | `#DBE3FF` | Text on `accent-soft` (the In short box, the next fix) |
| `accent-soft` | `#EBEFFF` | `#1B2340` | The In short box, selected rows |
| `bg` | `#FFFFFF` | `#141516` | Page and slide background |
| `surface` | `#F4F5F7` | `#1C1D1F` | Tiles, cards, table headers, code, tags |
| `ink` | `#111418` | `#ECEEF1` | Text, the risk source |
| `ink-2` | `#3D434C` | `#B6BCC6` | Descriptions |
| `muted` | `#62686F` | `#868C95` | Meta, dates, sources |
| `line` / `line-strong` | `#E3E5E8` / `#111418` | `#2C2E31` / `#ECEEF1` | Rules |
| `on-solid` | `#FFFFFF` | `#141516` | Icons and text on a solid `ink`, `accent` or `high` fill |
| `high` / `high-soft` | `#C4314B` / `#F8E6E9` | `#F2788C` / `#3A1E25` | High risk, high severity, weak spots, the impact |
| `medium` / `medium-soft` | `#A86400` / `#F7EEDF` | `#E3A64B` / `#33270F` | Medium risk |
| `low` / `low-soft` | `#2E7D4F` / `#E4F1E9` | `#62C48E` / `#16291E` | Low risk, controls |

**Dark mode (html only).** Bare `:root` holds the light values; `@media (prefers-color-scheme: dark)` on `:root:not([data-theme="light"])` and `:root[data-theme="dark"]` redefine every token with the dark column and set `color-scheme: dark`. No literal color in components: always a token.

## Type

| Role | Font |
| --- | --- |
| Headlines | Geist 600, tracking `-0.02em` |
| Body | Geist 400/500, line-height 1.6 |
| Eyebrows, IDs, refs (A.8.5), scores (G4·V3) | Geist Mono 400/500 |

In html, load both from Google Fonts (`family=Geist:wght@400;500;600&family=Geist+Mono:wght@400;500`) with `system-ui` and `ui-monospace` fallbacks. In pptx, xlsx and docx, Geist is rarely installed and Office then falls back to a serif. So write the Office files with a sans that is always there: Aptos (Office 2023+) for Geist, else Arial; Consolas for Geist Mono. Say once, in the chat, that installing Geist and Geist Mono gives the exact look.

## Layout ("Newsroom")

Every page and the first slide open the same way, like anassahel.com:

1. **Eyebrow**: mono, accent, words joined by ` · ` (`RISK · R-002 · ATTACK PATH`).
2. **Two-line headline**: the claim in ink, then the verdict in accent (`Admin login phished despite SMS codes` / `High today, medium after fixes.`).
3. **In short** (the executive summary): right after the headline, a box with `accent-soft` fill, `accent-ink` text and no border, 48rem wide; the four lines from the report template, each led by its label in Geist Mono `accent`.
4. **Sections**: a strong rule (1px `ink`), a number in Geist Mono `accent` and a small bold label (`01  Attack path`), a light rule, then the content. Numbers run 01, 02… in page order.

Container 76rem max, 1.25rem side padding (2rem from 40rem up), compact rhythm.

## Per format

- **html report**: the Newsroom layout above; sections Executive summary, Scenario, Attack path, Score (with the heat map), Treatment, Decisions. Tables: `surface` header with a 1px `ink` rule, rows on `bg` with 1px `line` rules. Level tags are square, mono, colored text on the soft fill.
- **Mermaid** (report only): `%%{init: {"theme":"base","themeVariables":{"fontFamily":"Geist, system-ui","primaryColor":"#F4F5F7","primaryBorderColor":"#E3E5E8","lineColor":"#111418"}}}%%` and the classDefs in the path template.
- **pptx**: exactly the deck in **PowerPoint** below.
- **xlsx**: exactly the workbook in **Excel** below.
- **pdf**: render the html report to pdf (A4, same layout), or build it with the same tokens and fonts.
- **docx**: Geist body, Geist Mono eyebrows, accent eyebrow and headline second line, 1px rules between sections, tables as in xlsx.
- **images** (png, svg): screenshot of the themed html, or drawn with the same tokens.
- **Icons**: every node tile in every format shows its icon (the SVG set in `attack-path.html`, stroke 1.8, ink on gray tiles, white on the black source and blue asset). An empty tile is a bug.
- **Inline drawing** (visualize and the like): same colors, shapes and fonts as `attack-path.html`; the tool's own default palette never wins.
- **attack path**: `attack-path.html` already uses this theme.

**The heat map is never dropped.** Every visual format (html, pdf, pptx, docx, xlsx) shows it: the 4×4 grid, severity G4 to G1 top to bottom, likelihood V1 to V4 left to right, each cell in its level color, `●` today and `○` after fixes.

## Excel

Five sheets, in this order, with these exact names. Nothing else.

**Everywhere**: Geist 10pt (Geist Mono for IDs, refs, scores, dates), text `ink`. Gridlines off. Header rows: fill `surface`, Geist 500, 1px `ink` bottom border, frozen. Body rows: 1px `line` bottom border, wrapped text, top-aligned. No other fills except level cells and the heat map. Level cells: soft fill, colored text, Geist Mono uppercase (`HIGH`). Landscape, fit to one page wide. The Summary tab colored accent, the others none.

1. **Summary**
   - A1: eyebrow `RISK · <ID> · <date>`, Geist Mono 9pt, accent. A2: the title, Geist 600 18pt. A3: the verdict (`High today, medium after fixes.`), Geist 600 14pt, accent.
   - Rows 5 to 8: the executive summary. A = label (`What could happen`, `Why now`, `Where we stand`, `What we need`) in Geist Mono 9pt muted; B:F merged = the line.
   - From row 10, a two-column table `Field | Value`: ID, Scenario, Risk source, Feared event, Asset, Owner, Status, Due, Inherent (score + level cell), Residual (score + level cell), Appetite, Treatment, Updated, Trace.
   - Widths: A 22, B to F 18.
2. **Heat map**
   - A1 eyebrow, A2 title `Heat map`.
   - The grid from B4: row labels G4, G3, G2, G1 in A5:A8; column labels V1 to V4 in B4:E4 (Geist Mono, muted). Cells B5:E8 are squares (width 14, height 60pt), filled by the level rule (high, medium, low soft colors), 1px `bg`-colored border so they read as tiles.
   - The inherent cell shows `● TODAY`, the residual cell `○ AFTER FIXES`, Geist Mono bold in the level color. When both land on one cell: `● ○ TODAY = AFTER`.
   - A9 `Severity ↑ · Likelihood →`. A11 the rule: `High when G3+ with V3+, or G4 with V2+. Low when both ≤ 2. Medium otherwise.` A12 the one-line reading (`Severity stays G4; the controls cut the likelihood.`).
   - Real cells with fills, never a picture or a chart, so it prints and filters.
3. **Attack path**
   - The screenshot of the filled `<id>-attack-path.html` anchored at A1, scaled to about 900px wide.
   - Below it, the table: `Route | Step | Node | Type | Attacker action | Severity | Weak spots | Control | ISO 27001 | Status`. One row per hop, route 1 first, weak spots one per line in the cell, severity and status as level cells (`planned` amber soft, `in place` green soft).
4. **Controls**
   - `# | Control | Status | Owner | Due | ISO 27001 | <one column per framework in scope>`, then the triggered extras below. Planned first, then in place (numbered E1, E2…). Refs in Geist Mono. Widths: Control 48, others 14.
5. **Decisions**
   - The grill trace: `# | Field | Question | Recommended (citation) | Answer | Settled by`. `Settled by` as text (`user`, `yes`, `call`, `fact: <source>`), `user` rows bold.

## PowerPoint

The **Split** layout: the point on the left, the evidence on the right. Reference: [examples/deck-split.png](examples/deck-split.png). 16:9 (13.333 × 7.5 in), `bg` background, six slides in this order. Nothing else.

**Grid** (every slide but the title):
- Left column: x 0.67 in, width 3.9 in. Eyebrow (Geist Mono 10pt, accent, uppercase, `0.08em`), then the **action title** (Geist 600, 30pt, tracking −2%, ink), a full sentence that states the point. Below it, 1 to 3 takeaways in Geist 14pt `ink-2`, each above a 1px `line` rule.
- Divider: one vertical 1px `line` at x 5.0 in, from y 0.6 to 6.6 in.
- Right panel: x 5.5 in to 12.67 in (0.5 in clear of the divider), vertically centred. The evidence only.
- Footer: y 7.0 in, Geist Mono 9pt muted, uppercase: `<organisation> · Risk review` left, `<n> / 6` right.
- No shadows, no rounded shapes, no clip art, no emoji. Corners square.

**Slides**:
1. **Title**: left, eyebrow `RISK REVIEW · <ID> · <date>` at the top and `OWNER · DUE · TREATMENT` in Geist Mono at the bottom; a 1px `ink` divider at x 4.6 in; right, the title (Geist 600, 50pt) with the verdict in accent below it.
2. **Executive summary**: title states the risk in one sentence; one takeaway = the ask. Right: the 4 lines as a two-column table (labels in Geist Mono 10pt muted, text Geist 16pt), 1px `line` rules between rows; risk levels as level tags.
3. **Attack path**: title `<n> steps from <entry> to <impact>`, or `<n> ways in, the easiest is <route>` with several routes; takeaways = the key weak spot and how many protections are planned, and with several routes the one left open after the fixes. Right: the screenshot of the filled `<id>-attack-path.html` (icons and ▶ included), as wide as the panel.
4. **Score**: title `<Likely> today, <unlikely> after fixes`; takeaways = why severity stays or moves, why likelihood moves, appetite. Right: the 4×4 heat map as real table cells (not an image), full-strength soft fills, `● TODAY` and `○ AFTER FIXES` in Geist Mono bold, the axis labels `SEVERITY ↑ · LIKELIHOOD →`.
5. **Treatment**: title `<n> fixes, <k> by <date>`; takeaways = cost and the main framework refs. Right: table `Protection | Due | ISO 27001 | Status`, header `surface` with a 1px `ink` rule, status as level tags (planned amber, in place green).
6. **Decision**: title = the ask (`Approve the plan today.`); takeaway = the result (`High → medium, within appetite`). Right: the numbered decisions, Geist 22pt.
