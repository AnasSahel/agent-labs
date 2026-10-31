---
topic: R-003 · Breached payroll provider still connected to HR
date: 2026-10-30
caller: risk-assessment
intensity: hard
framework: ISO 27001:2022, ISO 27005, EBIOS RM, NIS2, DORA, GDPR
---

| # | Field | Question | Recommended (citation) | Answer | Settled by |
|---|---|---|---|---|---|
| — | Frameworks, appetite | — | — | ISO 27001, NIS2 (important), DORA, GDPR; residual ≤ medium unless CISO (Sarah M.) accepts in writing | fact: grc/context.md |
| — | Existing controls (policy) | — | — | MFA for all staff (SMS allowed); privileged accounts reviewed every 6 months; no rule on supplier access | fact: grc/policies/access-control.md v2.1 |
| — | Incident | — | — | Payroll provider hit by ransomware last month; live connection into HR system still open | user (opening request) |
| Q1 | Path | How does the provider connect to the HR system and what can it do? | b) automated link with write access incl. bank details (ISO 27001 A.5.19, A.5.22; DORA Art. 28; NIS2 Art. 21(2)(d)) | "b" | yes |
| Q2 | Path | Does the HR system create staff accounts automatically? | a) yes, assume until IT confirms (ISO 27001 A.5.16, A.5.18) | "a" | yes |
| Q3 | Existing controls | Key reset? Network restriction? Bank-change check? Hire approval? Alerts? | Score unknowns as no (ISO 27005; ISO 27001 A.5.19, A.8.5, A.8.16) | "1. No 2. Don't know 3. No 4. Yes 5. No" | user |
| Q4 | Severity | Worst realistic outcome? | G3: ~200 staff records leaked + one payroll diverted; fake-hire route gated by approval (ISO 27005; GDPR Art. 33–34; NIS2 Art. 23) | "Agree" | yes |
| Q5 | Likelihood | Likelihood with today's controls? | V3 → inherent G3·V3 high (ISO 27005, clause to confirm; EBIOS RM step 4) | "Agree" | yes |
| Q6 | Treatment | Reduce with 6 controls? | Reduce: pause link + reset key, address allowlist, read-only link, bank-change call-back, alerts, supplier-access policy (DORA Art. 28, NIS2 Art. 21(2)(d), GDPR Art. 28, 32) | "Reduce" | yes |
| — | Residual | — | G3·V1 medium, within appetite | G3·V1 medium | call |
| Q7 | Owner | Who is accountable? | HR Director; IT executes; CISO assures (ISO 27001 cl. 6.1.2(c); DORA Art. 28(1)) | "HR Director" | user |
| Q8 | Due dates | When? | 2026-11-02 control 1; 2026-11-20 controls 2–5; 2026-12-31 control 6 (NIS2 Art. 21(1); DORA Art. 28(2); GDPR Art. 32) | "Agree" | yes |

Output: html, pptx, xlsx (md always)
