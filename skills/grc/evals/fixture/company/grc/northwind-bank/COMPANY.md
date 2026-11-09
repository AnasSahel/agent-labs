---
type: Company
title: "Northwind Bank"
description: Who Northwind Bank is, what it does and how big it is, from public data.
tags: [company, profile]
group: produced
status: draft
confidence: medium
generated: { by: "grc-init/1.0.0", at: "2026-11-02T09:00:00Z" }
sources:
  - id: registry
    resource: https://recherche-entreprises.api.gouv.fr
    title: French company registry
    last_modified: 2026-11-02T00:00:00Z
  - id: urd
    resource: https://example.com/northwind-registration-document-2025.pdf
    title: Northwind Bank registration document 2025
---

# Identity

| Field | Value |
|---|---|
| Legal name | Northwind Bank SA[^registry] |
| Registration number (SIREN) | 123 456 789[^registry] |
| Legal form | SA[^registry] |
| Head office | Lyon[^registry] |
| Created | 1987-03-01[^registry] |
| Administrative status | active[^registry] |

# Activity

- Activity code (NAF) and label: 64.19Z other monetary intermediation[^registry]
- What the company does, in one line: retail bank for individuals and small businesses[^urd]

# Size

- Headcount band (year): 1000-1999 (2024)[^registry]
- Turnover and net result (year): EUR 1.1bn, net result EUR 90M (2025)[^urd]
- Balance sheet total: not found
- Establishments (open / total): 41 / 44[^registry]

# Group

Parent company, if any: none found

## Subsidiaries

Entities controlled by the company, from its own published documents. A list from public data is never complete: it stays `to confirm` until the client signs it off.

| Entity | Registration no. | Country | Relation (% held) | Activity | Regulated? | Source |
|---|---|---|---|---|---|---|
| Northwind Payments | not found | France | 100% | payment services | yes: payment institution | [^urd] |
| Northwind IT Services | not found | France | 100% | runs the group IT | no | [^urd] |
| Northwind Immo | not found | France | 60% | real estate | no | [^urd] |

`Regulated?` names a licence or sector that changes the scope (payment institution, insurer, health data host). Scope questions about that entity go in Open questions.

# Open questions

1. Which legal entity is in scope (the group parent or a subsidiary)?
2. Which countries does it operate in?
3. Is the subsidiaries list complete? Which entities hold the IT, the data or a licence?
4. Is the balance sheet total available?

[^registry]: French company registry, fetched 2026-11-02
[^urd]: Northwind Bank registration document 2025
