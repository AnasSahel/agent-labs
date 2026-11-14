---
topic: R-002 · AWS admin login phished despite SMS codes
date: 2026-10-30
caller: risk-assessment
intensity: hard
framework: ISO 27001:2022, ISO 27005, EBIOS RM, NIS2, DORA, GDPR
---

| # | Field | Question | Recommended (citation) | Answer | Settled by |
|---|---|---|---|---|---|
| — | Frameworks, appetite | — | — | ISO 27001, NIS2 (important), DORA, GDPR; residual ≤ medium unless CISO (Sarah M.) accepts in writing | fact: grc/context.md |
| — | Existing controls | — | — | MFA for all staff, SMS allowed; privileged accounts reviewed every 6 months | fact: grc/policies/access-control.md v2.1 |
| Q1 | Path | Do admins reach AWS directly or via Entra ID SSO? Include SIM swap? | Real-time phishing relay as main path, SIM swap as secondary route (ISO 27001 A.5.17, A.8.5; NIS2 Art. 21(2)(j)) | "Through Entra ID (SSO)" / "Yes but for me the likelyhood is low" | user |
| Q2 | Existing controls | Conditional Access? Risky sign-in detection? PIM? Separate admin accounts? | Score as none beyond SMS if unknown (ISO 27005; ISO 27001 A.8.2, A.8.5) | "No" / "Don't know" / "Yes" / "Yes" | user |
| Q3 | Asset, severity | What does AWS production carry, worst case? | G4: payments + customer data, backups deletable (DORA Art. 18–19, NIS2 Art. 23, GDPR Art. 33–34) | "Agree" | yes |
| Q4 | Likelihood | Likelihood with today's controls? | V3 → inherent G4·V3 high (ISO 27005 §8.3.3, clause to confirm) | "Agree" | yes |
| Q5 | Treatment | Reduce with 5 controls? | Reduce: FIDO2/passkeys, compliant-device CA, PIM with key + approval, immutable backups in separate account, risky sign-in alerts (DORA Art. 9(4)(d), NIS2 Art. 21(2)(j)) | "Reduce" | yes |
| — | Residual | — | G4·V1 medium, within appetite | G4·V1 medium | call |
| Q6 | Owner | Who is accountable? | Head of IT/infra, CISO assures (ISO 27001 cl. 6.1.2(c)) | "CTO" | user |
| Q7 | Due date | When? | 2026-11-30 controls 1–3; 2026-12-31 controls 4–5 (DORA Art. 9, NIS2 Art. 21(1)) | "Agreed" | yes |

Output: html, xlsx, pptx (md always)
