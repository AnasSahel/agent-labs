---
id: cra
name: Cyber Resilience Act, Regulation (EU) 2024/2847
source: https://eur-lex.europa.eu/eli/reg/2024/2847/oj
checked: 2026-10-30
status: draft, to review by a GRC practitioner
---

# Cyber Resilience Act

Cybersecurity of products with digital elements (hardware and software sold in the EU), for manufacturers mainly. Reporting duties (Art. 14) apply from 11 September 2026, conformity assessment bodies (Chapter IV) from 11 June 2026, the rest from 11 December 2027 (Art. 71). It regulates the product, not the organization, so ISO 27001 covers the secure development process and the product requirements land in Extras.

Checked line by line against the EUR-Lex text on 2026-10-30.

## Mapping

One row per clause. **Fit** `full`: the ISO 27001 refs meet the clause. `partial`: they help, and the rest is in Extras.

| Clause | Requirement | ISO 27001 | Fit |
|---|---|---|---|
| Art. 13 | Manufacturer designs, develops and produces products per Annex I, with a cybersecurity risk assessment | 6.1.2, A.8.25, A.8.26 | partial |
| Art. 14 | Report actively exploited vulnerabilities and severe incidents to the CSIRT and ENISA | A.5.5, A.5.26 | partial |
| Annex I Part I (1) | Products designed, developed and produced for a level of cybersecurity fit to the risks | A.8.25, A.8.27 | partial |
| Annex I Part I (2)(a) | Made available without known exploitable vulnerabilities | A.8.8, A.8.29 | full |
| Annex I Part I (2)(b) | Secure by default configuration, with reset to original state | A.8.9 | full |
| Annex I Part I (2)(c) | Vulnerabilities fixable through security updates, automatic by default where fit | A.8.8 | partial |
| Annex I Part I (2)(d) | Protection from unauthorized access (authentication, identity, access management) | A.8.5, A.5.15 | full |
| Annex I Part I (2)(e) | Confidentiality of data stored, transmitted or processed (encryption) | A.8.24 | full |
| Annex I Part I (2)(f) | Integrity of data, commands, programs and configuration | A.8.24, A.8.9 | full |
| Annex I Part I (2)(g) | Process only the data needed (data minimisation) | A.8.11 | partial |
| Annex I Part I (2)(h) | Availability of essential functions, resilience against denial of service | A.8.6, A.8.14 | full |
| Annex I Part I (2)(i) | Minimize negative impact on other devices or networks | A.8.20 | full |
| Annex I Part I (2)(j) | Limit attack surfaces, including external interfaces | A.8.27 | full |
| Annex I Part I (2)(k) | Reduce the impact of an incident with exploitation mitigation | A.8.27 | full |
| Annex I Part I (2)(l) | Record and monitor relevant internal activity, with an opt-out for users | A.8.15, A.8.16 | full |
| Annex I Part I (2)(m) | Let users securely and permanently remove all data and settings | A.8.10 | full |
| Annex I Part II (1) | Identify and document vulnerabilities and components, including a software bill of materials | A.8.8, A.5.9 | partial |
| Annex I Part II (2) | Address and remediate vulnerabilities without delay, with security updates | A.8.8 | full |
| Annex I Part II (3) | Apply effective and regular tests and reviews of security | A.8.29 | full |
| Annex I Part II (4) | Publicly disclose fixed vulnerabilities with a description and remediation | A.8.8 | partial |
| Annex I Part II (5) | Put in place a coordinated vulnerability disclosure policy | A.8.8 | partial |
| Annex I Part II (6) | Share information on potential vulnerabilities, with a contact address | A.5.6 | partial |
| Annex I Part II (7) | Distribute updates securely | A.8.32 | full |
| Annex I Part II (8) | Security updates free of charge and without delay, with advisory messages | A.8.8 | partial |

## Extras

Duties the pivot does not carry. **gap-analysis** checks them on their own; a risk touches one when its feared event would trigger it.

| Clause | Duty | Why ISO 27001 misses it |
|---|---|---|
| Art. 13(8), Art. 13(19) | Support period of at least 5 years (shorter only if the product's expected use is shorter); its end date, at least month and year, stated at purchase | A product commitment |
| Art. 13(9) | Each security update stays available for at least 10 years after release, or the rest of the support period if longer | A product commitment |
| Art. 13(3), Art. 13(4) | Cybersecurity risk assessment documented, updated during the support period, and put in the technical documentation | A product file |
| Art. 13(5), Art. 13(6) | Due diligence on third-party components, including open source; report a vulnerability found in a component to whoever maintains it | ISO looks at suppliers, not components |
| Art. 13(17) | Single point of contact for users, including for vulnerability reports | A product commitment |
| Art. 14(2), Art. 14(4) | Actively exploited vulnerability or severe incident, to the coordinator CSIRT and ENISA at once: early warning within 24 hours, notification within 72 hours, final report within 14 days of a fix being available (vulnerabilities) or one month after the notification (incidents) | ISO sets no deadline |
| Art. 14(8) | Inform impacted users, and where fit all users, of the vulnerability or incident and of mitigations | A duty to customers |
| Art. 28, Art. 30, Art. 32 | EU declaration of conformity, CE marking, conformity assessment (third party for important and critical products) | Product compliance |
| Annex I Part I (1) | Level of cybersecurity set by the product's risk assessment (Art. 13(2)), which decides which Part I (2) points apply | A product file |
| Annex I Part I (2)(c) | Users can opt out of automatic updates and are told of available updates | A product feature |
| Annex I Part I (2)(g) | Minimise the data the product processes | Product design |
| Annex I Part II (1) | SBOM in a common machine-readable format, covering at least top-level dependencies | ISO has no SBOM |
| Annex I Part II (4), Annex I Part II (5), Annex I Part II (6) | Publish advisories, a CVD policy and a contact for reporting vulnerabilities | A.8.8 handles vulnerabilities internally only |
| Annex I Part II (8) | Updates free of charge for the support period, separate from feature updates where possible | A product commitment |
