---
type: Authority List
title: French authorities with a cybersecurity or data-protection duty
description: Fixed list of the French authorities a company can answer to for cybersecurity, so grc-init never has to recall or search for them.
country: FR
status: draft
confidence: medium
as-of: 2026-11-09
verification: not verified against official texts yet; every row carries its own `Checked` flag
---

# How to use

One row per authority, only when it has a cybersecurity or data-protection duty (supervision, incident notification, certification). A company gets the rows whose regulation its `REGULATIONS.md` marks `likely` or `possible`. Never add an authority from memory: add the row here, with its source, in a PR.

# Authorities

| Authority | Covers | Regulation it enforces | Cyber duty | Checked | Source |
|---|---|---|---|---|---|
| ANSSI | essential and important entities (NIS2), critical operators (OIV, OSE), public bodies | NIS2 (national competent authority under the resilience bill), LPM / NIS1 for OIV and OSE | supervision, security rules, incident notification, SecNumCloud and product qualifications; CERT-FR runs incident response | partly: NIS2 role depends on the resilience bill, still going through Parliament in the sources read | https://cyber.gouv.fr |
| CNIL | every controller and processor | GDPR | personal data breach notification (Art. 33, 72 hours), security of processing (Art. 32), sanctions | no | https://www.cnil.fr |
| ACPR | credit institutions, insurers, payment and e-money institutions | DORA (financial sector supervisor) | ICT risk supervision, major ICT incident reporting | no: split ACPR / AMF comes from secondary guides | https://acpr.banque-france.fr |
| Banque de France | banks, payment systems and schemes | DORA (with ACPR), oversight of payment systems | TIBER-FR threat-led testing with ACPR, oversight of payment system security | no | https://www.banque-france.fr |
| AMF | investment firms, asset managers, market infrastructures | DORA (financial sector supervisor) | ICT risk supervision, major ICT incident reporting | no | https://www.amf-france.org |
| ECB (SSM) | significant banks | DORA, banking supervision | direct supervision of significant institutions (EU level) | no | https://www.bankingsupervision.europa.eu |
| ARCEP | electronic communications operators | NIS2 telecom sector, electronic communications code | security and integrity obligations of networks and services | no | https://www.arcep.fr |
| ANS (Agence du Numérique en Santé) | health data hosts, health establishments | HDS certification framework, health information security | defines the HDS referential, runs the health incident reporting portal | no | https://esante.gouv.fr |
| ARS | health establishments | health code | receives health incident reports alongside ANS | no | https://www.ars.sante.fr |
| HFDS (ministry high officials for defence and security) | operators in each ministry's sector | LPM / NIS1 | sector coordination for critical operators | no | https://cyber.gouv.fr |

# To verify before status `stable`

1. NIS2 national authority: confirm the date the resilience bill is promulgated, and whether ANSSI is the only competent authority (sources disagree on sector authorities).
2. DORA: confirm which authority receives incident reports for each entity type (ACPR or AMF) in the Regulation (EU) 2022/2554 and the national acts, not secondary guides.
3. Sectors not listed yet, to add only with an official source: energy (CRE or ministry), transport, water, pharmaceuticals, defence industry, Cyber Resilience Act market surveillance authority.
4. Confirm the HFDS and ARS rows: both come from general knowledge, not from a source read.
