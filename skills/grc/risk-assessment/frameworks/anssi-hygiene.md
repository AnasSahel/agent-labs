---
id: anssi-hygiene
name: ANSSI, Guide d'hygiène informatique (v2.0, 2017, 42 measures)
source: https://cyber.gouv.fr/publications/guide-dhygiene-informatique
checked: 2026-10-30
status: draft, to review by a GRC practitioner
---

# ANSSI hygiene guide

The 42 basic measures ANSSI recommends to every French organization, in ten chapters. Cited at chapter level (`Ch. V`); measure numbers only after checking the guide, else "clause to confirm". Voluntary, but often required by contracts and by French public buyers. SecNumCloud (ANSSI's cloud qualification) is a separate scheme, not mapped yet.

## Mapping

One row per clause. **Fit** `full`: the ISO 27001 refs meet the clause. `partial`: they help, and the rest is in Extras.

| Clause | Requirement | ISO 27001 | Fit |
|---|---|---|---|
| Ch. I | Raise awareness and train (staff, IT teams, security clauses with suppliers) | A.6.3, A.5.20 | full |
| Ch. II | Know the information system (assets, privileged accounts, arrivals and departures) | A.5.9, A.5.12, A.5.16, A.6.5 | full |
| Ch. III | Authenticate and control access (accounts, passwords, default credentials, MFA) | A.5.15, A.5.17, A.5.18, A.8.2, A.8.5 | full |
| Ch. IV | Secure workstations (baseline, removable media, central management, local firewall, encryption) | A.8.1, A.8.7, A.8.9, A.7.10, A.8.24 | full |
| Ch. V | Secure the network (segmentation, Wi-Fi, filtering, secure protocols, DMZ) | A.8.20, A.8.21, A.8.22, A.8.23 | full |
| Ch. VI | Secure administration (dedicated admin network and workstations, no Internet from admin accounts) | A.8.2, A.8.18, A.8.22 | partial |
| Ch. VII | Manage mobile working (physical security, encryption, VPN, phones) | A.6.7, A.7.9, A.8.1, A.8.24 | full |
| Ch. VIII | Keep the information system up to date (patching, end-of-life software) | A.8.8, A.8.19 | full |
| Ch. IX | Supervise, audit, react (logs, backups, audits, incident procedure, CERT-FR contacts) | A.8.13, A.8.15, A.8.16, A.5.5, A.5.24, A.5.26, A.5.35 | full |
| Ch. X | Go further (risk analysis approach, qualified products and services) | 6.1.2 | partial |

## Extras

Duties the pivot does not carry. **gap-analysis** checks them on their own; a risk touches one when its feared event would trigger it.

| Clause | Duty | Why ISO 27001 misses it |
|---|---|---|
| Ch. VI | Administer from a dedicated network and dedicated hardened workstations, never browsing the Internet | ISO restricts privileged access, not the admin architecture |
| Ch. X | Prefer ANSSI-qualified products and services (e.g. PASSI auditors, PRIS incident responders) | A French qualification scheme |
