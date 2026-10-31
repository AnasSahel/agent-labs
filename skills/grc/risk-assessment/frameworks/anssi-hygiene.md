---
id: anssi-hygiene
name: ANSSI, Guide d'hygiène informatique (v2.0, September 2017, 42 measures)
source: https://messervices.cyber.gouv.fr/guides/guide-dhygiene-informatique
checked: 2026-10-30
status: draft, to review by a GRC practitioner
---

# ANSSI hygiene guide

The 42 basic measures ANSSI recommends to every French organization, in ten chapters. Cited at chapter level (`Ch. V`); the measure numbers (`M19`) each row covers are in its Requirement, checked against the guide's own tracking table (*outil de suivi*) on 2026-10-30. Voluntary, but often required by contracts and by French public buyers. SecNumCloud (ANSSI's cloud qualification) is a separate scheme, not mapped yet.

## Mapping

One row per clause. **Fit** `full`: the ISO 27001 refs meet the clause. `partial`: they help, and the rest is in Extras.

| Clause | Requirement | ISO 27001 | Fit |
|---|---|---|---|
| Ch. I | M1 to M3: train IT teams, make users aware of basic good practice, control the risks of outsourcing (*infogérance*) | 7.2, A.6.3, A.5.19, A.5.20 | full |
| Ch. II | M4 to M7: know the sensitive information and servers and keep a network diagram, inventory privileged accounts, run arrival, departure and role-change procedures, let only managed devices connect | A.5.9, A.5.12, A.5.16, A.5.18, A.6.5, A.8.1, A.8.20 | full |
| Ch. III | M8 to M13: one named account per person with user and admin roles apart, right access to sensitive resources, password rules, protected stored passwords, default credentials changed, strong authentication where possible | A.5.15, A.5.16, A.5.17, A.5.18, A.8.2, A.8.3, A.8.5 | full |
| Ch. IV | M14 to M18: minimum security on every workstation, removable media, central management of security policies, local firewall, encrypt sensitive data sent over the Internet | A.8.1, A.8.7, A.8.9, A.7.10, A.8.20, A.8.24 | full |
| Ch. V | M19 to M26: segmentation, Wi-Fi security, secure protocols, secure Internet gateway, Internet-facing services set apart, email protection, secured partner interconnections, physical access to server rooms | A.8.20, A.8.21, A.8.22, A.8.23, A.8.7, A.5.14, A.7.1, A.7.2, A.7.3 | full |
| Ch. VI | M27 to M29: no Internet from admin workstations or servers, a dedicated and segregated admin network, admin rights on workstations kept to the strict need | A.8.2, A.8.18, A.8.22 | partial |
| Ch. VII | M30 to M33: physical security of mobile devices, encryption of sensitive data on them, secure remote connection, dedicated policies for smartphones | A.6.7, A.7.9, A.8.1, A.8.20, A.8.24 | full |
| Ch. VIII | M34 to M35: update policy for all components, plan for end of support and limit software lock-in | A.8.8, A.8.19, A.8.32 | full |
| Ch. IX | M36 to M40: logs on the main components, backup policy, regular security audits with corrective actions, a named security referent known to staff, an incident procedure | A.8.13, A.8.15, A.8.16, A.5.2, A.5.24, A.5.26, A.5.35, 10.2 | full |
| Ch. X | M41 to M42: formal risk analysis, prefer ANSSI-qualified products and services | 6.1.2 | partial |

## Extras

Duties the pivot does not carry. **gap-analysis** checks them on their own; a risk touches one when its feared event would trigger it.

| Clause | Duty | Why ISO 27001 misses it |
|---|---|---|
| Ch. VI | M27, M28: administer from a dedicated, segregated network and workstations that never reach the Internet | ISO restricts privileged access, not the admin architecture |
| Ch. X | M42: prefer ANSSI-qualified products and services (e.g. PASSI auditors, PRIS incident responders) | A French qualification scheme |
