---
id: nis2
name: NIS2, Directive (EU) 2022/2555
source: https://eur-lex.europa.eu/eli/dir/2022/2555/oj (Art. 20, 21 and 23)
checked: 2026-10-30
status: draft, to review by a GRC practitioner
---

# NIS2

The cybersecurity duties of essential and important entities. Member states transpose it into national law (France: the *loi relative à la résilience*): when `grc/context.md` names the national law, its article numbers win and these stay as the EU reference. For digital infrastructure and digital providers (cloud, DNS, data centres, MSPs...), Implementing Regulation (EU) 2024/2690 details Art. 21(2) further.

## Mapping

One row per clause. **Fit** `full`: the ISO 27001 refs meet the clause. `partial`: they help, and the rest is in Extras.

| Clause | Requirement | ISO 27001 | Fit |
|---|---|---|---|
| Art. 20(1) | Management body approves the risk-management measures and oversees them | 5.1, A.5.4 | partial |
| Art. 20(2) | Management body follows cybersecurity training; staff offered it regularly | 7.2, A.6.3 | partial |
| Art. 21(1) | Appropriate and proportionate measures, all-hazards approach | 6.1.2, 6.1.3, 8.2, 8.3 | full |
| Art. 21(2)(a) | Policies on risk analysis and information system security | 5.2, A.5.1, 6.1.2 | full |
| Art. 21(2)(b) | Incident handling | A.5.24, A.5.25, A.5.26, A.5.27, A.5.28, A.6.8 | full |
| Art. 21(2)(c) | Business continuity (backup, disaster recovery) and crisis management | A.5.29, A.5.30, A.8.13, A.8.14 | full |
| Art. 21(2)(d) | Supply chain security, with direct suppliers and service providers | A.5.19, A.5.20, A.5.21, A.5.22, A.5.23 | full |
| Art. 21(2)(e) | Security in acquisition, development and maintenance, incl. vulnerability handling and disclosure | A.8.8, A.8.9, A.8.25, A.8.26, A.8.27, A.8.28, A.8.29, A.8.32 | partial |
| Art. 21(2)(f) | Policies and procedures to assess the effectiveness of the measures | 9.1, 9.2, 9.3, A.5.35, A.5.36 | full |
| Art. 21(2)(g) | Basic cyber hygiene and cybersecurity training | A.6.3, A.5.10, A.8.1, A.8.7 | full |
| Art. 21(2)(h) | Cryptography and, where appropriate, encryption | A.8.24 | full |
| Art. 21(2)(i) | Human resources security, access control policies, asset management | A.6.1, A.6.2, A.6.4, A.6.5, A.5.15, A.5.16, A.5.18, A.8.2, A.5.9, A.5.10, A.5.11 | full |
| Art. 21(2)(j) | Multi-factor or continuous authentication; secured voice, video, text and emergency communications | A.8.5, A.5.14, A.8.20, A.8.21, A.5.29 | full |
| Art. 21(3) | Take account of each supplier's vulnerabilities and secure development practices | A.5.19, A.5.21, A.8.30 | full |
| Art. 21(4) | Corrective measures without undue delay when a measure is not met | 10.2 | full |
| Art. 23(1) | Notify significant incidents to the CSIRT or authority, and service recipients where needed | A.5.5, A.5.24, A.5.26 | partial |

## Extras

Duties the pivot does not carry. **gap-analysis** checks them on their own; a risk touches one when its feared event would trigger it.

| Clause | Duty | Why ISO 27001 misses it |
|---|---|---|
| Art. 20(1) | Management body members can be held liable for infringements | A legal liability, not a control |
| Art. 23(4)(a) | Early warning within 24 hours of becoming aware of a significant incident | ISO sets no deadline |
| Art. 23(4)(b) | Incident notification within 72 hours, with a first assessment and indicators of compromise | ISO sets no deadline |
| Art. 23(4)(c) | Intermediate report when the CSIRT or authority asks | Regulator-driven |
| Art. 23(4)(d) | Final report within one month of the notification: root cause, mitigation, cross-border impact | ISO sets no deadline or content |
| Art. 21(2)(e) | Coordinated vulnerability disclosure (reporting channel for outsiders) | A.8.8 covers handling, not a public disclosure process |
| Art. 20(2) | Management body members must follow training themselves, not only approve it | ISO asks for staff competence, not board training |
| Art. 3(4), Art. 27 | Register with the national authority (entity list, or registry for digital providers) | Administrative duty |
