---
id: nist-csf
name: NIST Cybersecurity Framework 2.0
source: https://doi.org/10.6028/NIST.CSWP.29 (functions and categories); NIST also publishes Informative References to ISO 27001 in its OLIR catalog
checked: 2026-10-30
status: draft, to review by a GRC practitioner
---

# NIST CSF 2.0

Six functions, 22 categories. Cited at category level (`PR.AA`); subcategories (`PR.AA-01`) only after checking the text, else "clause to confirm". Voluntary: no deadlines, so few extras.

## Mapping

One row per clause. **Fit** `full`: the ISO 27001 refs meet the clause. `partial`: they help, and the rest is in Extras.

| Clause | Requirement | ISO 27001 | Fit |
|---|---|---|---|
| GV.OC | Organizational context: mission, stakeholders, legal and regulatory requirements | 4.1, 4.2, A.5.31 | full |
| GV.RM | Risk management strategy: priorities, appetite, tolerance | 6.1.2, 6.1.3, 6.2 | partial |
| GV.RR | Roles, responsibilities and authorities; leadership accountable | 5.1, 5.3, A.5.2, A.5.4 | full |
| GV.PO | Cybersecurity policy established, communicated, reviewed | 5.2, A.5.1 | full |
| GV.OV | Oversight: results of the strategy reviewed and adjusted | 9.3, 10.1 | full |
| GV.SC | Cybersecurity supply chain risk management | A.5.19, A.5.20, A.5.21, A.5.22, A.5.23 | full |
| ID.AM | Asset management: hardware, software, services, data, flows | A.5.9, A.5.12, A.5.13 | full |
| ID.RA | Risk assessment: vulnerabilities, threat intelligence, impacts, likelihood | 6.1.2, 8.2, A.5.7, A.8.8 | full |
| ID.IM | Improvement from evaluations, tests, exercises and incidents | 10.1, 10.2, A.5.27 | full |
| PR.AA | Identity management, authentication and access control | A.5.15, A.5.16, A.5.17, A.5.18, A.8.2, A.8.3, A.8.5, A.7.2 | full |
| PR.AT | Awareness and training | 7.2, 7.3, A.6.3 | full |
| PR.DS | Data security: confidentiality, integrity, availability of data | A.5.14, A.8.10, A.8.11, A.8.12, A.8.13, A.8.24 | full |
| PR.PS | Platform security: configuration, software, logs, secure development | A.8.1, A.8.7, A.8.9, A.8.15, A.8.19, A.8.25, A.8.32 | full |
| PR.IR | Technology infrastructure resilience: networks, environment, capacity | A.8.6, A.8.14, A.8.20, A.8.22, A.7.5, A.7.11 | full |
| DE.CM | Continuous monitoring of networks, people, services and assets | A.8.16, A.7.4, A.8.7 | full |
| DE.AE | Adverse event analysis: correlate, assess, declare incidents | A.5.25, A.8.15, A.8.16 | full |
| RS.MA | Incident management: plan executed, triaged, escalated | A.5.24, A.5.26 | full |
| RS.AN | Incident analysis: root cause, evidence, magnitude | A.5.27, A.5.28 | full |
| RS.CO | Incident response reporting and communication | A.5.5, A.5.26, A.6.8 | full |
| RS.MI | Incident mitigation: contained and eradicated | A.5.26 | full |
| RC.RP | Incident recovery plan execution, restoring assets | A.5.29, A.5.30, A.8.13 | full |
| RC.CO | Incident recovery communication | A.5.26, 7.4 | full |

## Extras

Duties the pivot does not carry. **gap-analysis** checks them on their own; a risk touches one when its feared event would trigger it.

| Clause | Duty | Why ISO 27001 misses it |
|---|---|---|
| GV.RM | State risk appetite and tolerance as explicit statements, used across enterprise risk management | ISO asks for risk criteria, not an enterprise-wide appetite statement |
| Profiles, Tiers | Current and target profiles, and the tier of rigour, if the organization uses them | A CSF way of describing maturity, not a requirement |
