---
topic: R-004 · Former developer still has write access to the payment service repo
date: 2026-10-30
caller: risk-assessment
intensity: hard
status: done
subject: ex-developer's GitHub account still active with write access to the payment service code
framework: ISO 27001:2022, ISO 27005, EBIOS RM, NIS2, DORA, GDPR
---

| # | Field | Question | Recommended (citation) | Answer | Settled by |
|---|---|---|---|---|---|
| — | Frameworks, appetite | — | — | ISO 27001, NIS2 (important), DORA, GDPR; residual ≤ medium unless CISO (Sarah M.) accepts in writing | fact: grc/context.md |
| — | Existing controls (policy) | — | — | MFA for all staff (SMS allowed); privileged accounts reviewed every 6 months; no leaver rule | fact: grc/policies/access-control.md v2.1 |
| — | Incident | — | — | Former developer still has an active GitHub account with write access to the payment service repo | user (opening request) |
| Q1 | Path: review gate | Is a change to main on the payment repo blocked until a second person approves it, with no bypass for this account? | Assume no until checked: score as if one push reaches production (ISO 27001 A.8.4, A.8.32) | "No" — no review gate; one push can reach production | user |
| Q2 | Severity | If changed code runs in payments, how bad is it? (G1 minor · G2 significant · G3 serious · G4 critical) | Critical (G4): silent payment diversion, customer data, reportable major incident (DORA Art. 19, NIS2 Art. 23, GDPR Art. 33) | "G4" | user |
| Q3 | Likelihood (inherent) | How likely is it today, if nothing changes? (V1 unlikely · V2 possible · V3 likely · V4 near certain) | Likely (V3): no barrier on any hop, high-value target (EBIOS RM workshop 4; ISO 27005:2022, clause to confirm) | "V3" → inherent G4·V3 high | user |
| Q4 | Treatment | Reduce, with 6 controls: (1) remove account, revoke tokens/keys, audit pushes; (2) same-day leaver removal via SSO; (3) required second approval on payment repo, no bypass, folder owners; (4) security key or app MFA for GitHub; (5) quarterly code-access review; (6) alerts on payment repo pushes and settings | Reduce, all 6 (ISO 27001 A.5.18, A.8.32; NIS2 Art. 21(2)(i); DORA Art. 9(4)(c)) | "Reduce" | user |
| — | Controls | — | The 6 recommended controls | All 6 kept: the user chose reduce without dropping any | call |
| — | Residual score | — | — | G4·V1 medium: controls 1 and 3 close the entry and the release hop; severity unchanged; within appetite | call |
| Q5 | Risk owner | Who is accountable for closing this? | CTO: owns payment platform and GitHub org; HR Director contributes on the leaver process (ISO 27001 6.1.2(c)) | "CTO" | user |
| Q6 | Due date | When must the risk be back at medium? | 2026-11-30, staged: control 1 on 2026-10-30; controls 3, 6 by 2026-11-13; controls 2, 4, 5 by 2026-11-30 (ISO 27001 6.1.3(e); DORA Art. 9(4)(c)) | "Agree" | yes |
| — | Scenario and path | — | — | Draft scenario and path kept as drawn; the user corrected nothing | call |
| — | Asset and business value | — | — | Payment service: moves customer money; holds customer payment data | call |

Output: html, pptx, xlsx (user: "html,pptx,xlsx")
