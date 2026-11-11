---
type: Regulation Scope
title: "Regulations for {{name}}"
description: Which regulations probably apply to {{name}}, with status and confidence.
tags: [regulations, scope]
group: produced
status: draft
confidence: low
generated: { by: "{{actor}}", at: "{{now}}" }
sources: []
---

# Directly applies

The law binds the company itself, because of what it is (activity, size, licence). Each row is one regulation.

| Regulation | Status | Decided by | Confidence | Would change if |
|---|---|---|---|---|
| NIS2 | unknown | no fact yet | low | the activity and size are known |
| GDPR | unknown | no fact yet | low | the activity is known |
| DORA | unknown | no fact yet | low | the licence status is known |

Status is `applies`, `likely`, `unlikely`, `does not apply` or `unknown`. `applies` needs a fact from an official register or the company's own documents. Confidence is `high` (register entry), `medium` (company statement) or `low` (inference). Never "possible", "subject to" or "compliant": this is a read from public data, not a legal opinion.

# Reaches you through others

Indirect exposure. The law does not bind the company itself: its clients are in scope and pass duties down by contract (NIS2 Art. 21(2)(d) and 21(3); DORA Art. 28 and 30). It is a contract duty, never a legal status. A company can sit in both parts at once.

| Client segment | Why it is in scope | Duty passed down | Evidence | Confidence |
|---|---|---|---|---|
| not assessed yet | | | | low |

# Open questions

1. Which regulations has the client already confirmed with its lawyers?
2. Which named clients ask for security clauses, audit rights or incident deadlines in their contracts?
