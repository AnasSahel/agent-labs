---
id: cis
name: CIS Critical Security Controls v8.1
source: https://www.cisecurity.org/controls/v8-1 (CIS publishes a mapping to ISO 27001:2022)
checked: 2026-10-30
status: draft, to review by a GRC practitioner
---

# CIS Controls v8.1

18 controls, 153 safeguards in three implementation groups (IG1 basic hygiene, IG2, IG3). Cited at control level (`CIS 5`); safeguards (`CIS 5.3`) only after checking the text, else "clause to confirm".

## Mapping

One row per clause. **Fit** `full`: the ISO 27001 refs meet the clause. `partial`: they help, and the rest is in Extras.

| Clause | Requirement | ISO 27001 | Fit |
|---|---|---|---|
| CIS 1 | Inventory and control of enterprise assets | A.5.9, A.8.1 | partial |
| CIS 2 | Inventory and control of software assets | A.5.9, A.8.19 | partial |
| CIS 3 | Data protection | A.5.12, A.5.13, A.5.14, A.8.10, A.8.11, A.8.12, A.8.24 | full |
| CIS 4 | Secure configuration of enterprise assets and software | A.8.9, A.8.1 | full |
| CIS 5 | Account management | A.5.16, A.5.18 | full |
| CIS 6 | Access control management | A.5.15, A.5.18, A.8.2, A.8.5 | full |
| CIS 7 | Continuous vulnerability management | A.8.8 | full |
| CIS 8 | Audit log management | A.8.15, A.8.17 | full |
| CIS 9 | Email and web browser protections | A.8.23, A.8.7 | full |
| CIS 10 | Malware defenses | A.8.7 | full |
| CIS 11 | Data recovery | A.8.13 | full |
| CIS 12 | Network infrastructure management | A.8.20, A.8.21, A.8.22 | full |
| CIS 13 | Network monitoring and defense | A.8.16, A.8.20 | full |
| CIS 14 | Security awareness and skills training | A.6.3 | full |
| CIS 15 | Service provider management | A.5.19, A.5.20, A.5.22 | full |
| CIS 16 | Application software security | A.8.25, A.8.26, A.8.27, A.8.28, A.8.29, A.8.31 | full |
| CIS 17 | Incident response management | A.5.24, A.5.25, A.5.26, A.5.27, A.6.8 | full |
| CIS 18 | Penetration testing | A.8.8, A.8.29 | partial |

## Extras

Duties the pivot does not carry. **gap-analysis** checks them on their own; a risk touches one when its feared event would trigger it.

| Clause | Duty | Why ISO 27001 misses it |
|---|---|---|
| CIS 1 | Active and passive discovery of assets on the network, with unauthorized assets handled | ISO asks for an inventory, not automated discovery |
| CIS 2 | Allowlist of authorized software and libraries | ISO restricts installation, not by allowlist |
| CIS 18 | Regular external and internal penetration tests, with findings remediated | ISO asks for vulnerability management, not pen tests |
| IG1, IG2, IG3 | Pick the implementation group that fits the organization's size and risk | A CIS scoping rule |
