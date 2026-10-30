# Theme

The one look of every **visual** asset this skill makes. Sober, print-like and calm. Light only.

- **Themed**: html, pdf, pptx, xlsx, docx, images (png, svg), the attack path, and the drawing shown inline in the chat (visualize tool, widget, Artifact or canvas).
- **Not themed**: text-only files (md, json, csv, yaml, Jira issues). Keep them plain: no colors, no styling hints.

## Rules

- **One accent.** Electric blue `#2F5BFF` is the only brand color. Everything else is gray.
- **Risk colors are signals, not decoration.** Use them only for a risk level, a severity, a weak spot or a control status.
- **Flat.** No gradients, no shadows. Corners 2 to 4px at most, no pills, no rounded cards.
- **Thin rules** (`#D9DBDE`, 1px) separate sections instead of boxes.
- **Upright type.** Never italic.
- **Eyebrows** (section labels, IDs, dates): Geist Mono, uppercase, `0.08em` tracking, muted.

## Tokens

| Token | Value | Use |
| --- | --- | --- |
| `accent` | `#2F5BFF` | Eyebrows, links, the business asset, headline highlight, table header rule |
| `accent-soft` | `#E6ECFF` | Accent fills |
| `bg` | `#F1F2F3` | Page and slide background |
| `surface` | `#FAFAFA` | Tiles, cards, table rows |
| `surface-2` | `#E7E8EA` | Table headers, code, tags |
| `ink` | `#111418` | Text, the risk source |
| `ink-2` | `#3D434C` | Descriptions |
| `muted` | `#6F757E` | Meta, dates, sources |
| `line` / `line-strong` | `#D9DBDE` / `#111418` | Rules |
| `high` / `high-soft` | `#C4314B` / `#F8E6E9` | High risk, high severity, weak spots, the impact |
| `medium` / `medium-soft` | `#A86400` / `#F7EEDF` | Medium risk |
| `low` / `low-soft` | `#2E7D4F` / `#E4F1E9` | Low risk, controls |

## Type

| Role | Font |
| --- | --- |
| Headlines | Geist 600, tracking `-0.02em` |
| Body | Geist 400/500, line-height 1.6 |
| Eyebrows, IDs, refs (A.8.5), scores (G4·V3) | Geist Mono 400/500 |

In html, load both from Google Fonts (`family=Geist:wght@400;500;600&family=Geist+Mono:wght@400;500`) with `system-ui` and `ui-monospace` fallbacks. In pptx and xlsx, set Geist and Geist Mono; Office falls back on its own when they aren't installed.

## Layout ("Newsroom")

Every page and the first slide open the same way, like anassahel.com:

1. **Eyebrow**: mono, accent, words joined by ` · ` (`RISK · R-002 · ATTACK PATH`).
2. **Two-line headline**: the claim in ink, then the verdict in accent (`Admin login phished despite SMS codes` / `High today, medium after fixes.`).
3. **Intro**: one paragraph in `ink-2`, 40rem wide.
4. **Sections**: a strong rule (1px `ink`), a small bold label with a dash (`— Attack path`), a light rule, then the content.

Container 76rem max, 1.25rem side padding (2rem from 40rem up), lots of air.

## Per format

- **html report**: the Newsroom layout above; sections Scenario, Attack path, Score, Treatment, Decisions. Tables: `surface-2` header, 1px `line` rows. Level tags are square (2px), mono, colored text on the soft fill.
- **Mermaid** (report only): `%%{init: {"theme":"base","themeVariables":{"fontFamily":"Geist, system-ui","primaryColor":"#FAFAFA","primaryBorderColor":"#D9DBDE","lineColor":"#111418"}}}%%` and the classDefs in the path template.
- **pptx**: 16:9, `bg` background; title slide in the Newsroom opening; every other slide has the eyebrow, a Geist 600 title and a thin rule below. No shadows, no rounded shapes. One idea per slide.
- **xlsx**: Geist 10pt, header row `surface-2` with a 1px `ink` bottom border, accent for the sheet title, risk level cells filled with the soft color and colored text. Freeze the header row.
- **pdf**: render the html report to pdf (A4, same layout), or build it with the same tokens and fonts.
- **docx**: Geist body, Geist Mono eyebrows, accent eyebrow and headline second line, 1px rules between sections, tables as in xlsx.
- **images** (png, svg): screenshot of the themed html, or drawn with the same tokens.
- **Inline drawing** (visualize and the like): same colors, shapes and fonts as `attack-path.html`; the tool's own default palette never wins.
- **attack path**: `attack-path.html` already uses this theme.
