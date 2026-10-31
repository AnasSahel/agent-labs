---
id: gdpr
name: GDPR, Regulation (EU) 2016/679
source: https://eur-lex.europa.eu/eli/reg/2016/679/oj
checked: 2026-10-30
status: draft, to review by a GRC practitioner
---

# GDPR

Personal data protection. ISO 27001 carries its security side only; for a privacy programme, also cite `iso27701`, which carries the privacy side. Most of the GDPR is in Extras on purpose.

Checked line by line against the EUR-Lex text on 2026-10-30.

## Mapping

One row per clause. **Fit** `full`: the ISO 27001 refs meet the clause. `partial`: they help, and the rest is in Extras.

| Clause | Requirement | ISO 27001 | Fit |
|---|---|---|---|
| Art. 5(1)(e) | Storage limitation: keep data no longer than needed | A.5.33, A.8.10 | partial |
| Art. 5(1)(f) | Integrity and confidentiality: appropriate security of personal data | A.5.34, A.5.15, A.8.24 | full |
| Art. 5(2) | Accountability: be able to demonstrate compliance | A.5.31, A.5.34, 7.5 | partial |
| Art. 24 | Controller implements and reviews appropriate measures and policies | A.5.1, A.5.34 | partial |
| Art. 25 | Data protection by design and by default | A.8.25, A.8.26, A.8.11, A.5.34 | partial |
| Art. 28 | Processors give sufficient guarantees, under a contract with set terms | A.5.19, A.5.20, A.5.22 | partial |
| Art. 29 | People with access process data only on instructions | A.5.10, A.6.2, A.6.6 | full |
| Art. 30 | Records of processing activities | A.5.9 | partial |
| Art. 32(1)(a) | Pseudonymisation and encryption | A.8.11, A.8.24 | full |
| Art. 32(1)(b) | Ongoing confidentiality, integrity, availability and resilience | A.5.15, A.5.29, A.8.14 | full |
| Art. 32(1)(c) | Restore availability and access in a timely manner after an incident | A.8.13, A.5.30 | full |
| Art. 32(1)(d) | Regularly test and evaluate the effectiveness of the measures | 9.1, A.5.35, A.8.29 | full |
| Art. 32(4) | Staff with access act only on instructions | A.6.2, A.6.3 | full |
| Art. 33 | Notify a personal data breach to the supervisory authority | A.5.5, A.5.24, A.5.26 | partial |
| Art. 34 | Communicate a high-risk breach to the data subjects | A.5.26 | partial |
| Art. 35 | Data protection impact assessment for high-risk processing | 6.1.2 | partial |
| Art. 44 to 49 | Transfers outside the EEA only under an approved mechanism | A.5.14, A.5.20 | partial |

## Extras

Duties the pivot does not carry. **gap-analysis** checks them on their own; a risk touches one when its feared event would trigger it.

| Clause | Duty | Why ISO 27001 misses it |
|---|---|---|
| Art. 5 | The other principles: lawfulness, purpose limitation, data minimisation, accuracy, a retention period per purpose | Privacy principles, not security |
| Art. 24, Art. 25 | The measures and defaults cover every data protection principle (minimisation, purpose), not only security | ISO 27001 secures data; it doesn't limit what is collected |
| Art. 6, Art. 9 | A lawful basis for each processing, stricter for special categories | Legal basis, not security |
| Art. 12 to 22 | Data subject rights (information, access, rectification, erasure, restriction, portability, objection, automated decisions), answered within one month, extendable by two months (Art. 12(3)) | Not a security topic |
| Art. 28(3) | Processor contract must contain the clauses listed in Art. 28(3) | ISO asks for security clauses, not this list |
| Art. 30 | Records in the content Art. 30 sets, given to the authority on request | A.5.9 is an asset inventory, not a processing record |
| Art. 33(1) | Notify the authority without undue delay and where feasible within 72 hours of becoming aware of the breach, unless it is unlikely to result in a risk; give reasons for any delay | ISO sets no deadline |
| Art. 33(2) | A processor tells the controller without undue delay after becoming aware of a breach | ISO sets no deadline |
| Art. 33(5) | Document every breach, even unnotified ones | Partly A.5.27; the register is mandatory here |
| Art. 34 | Tell data subjects without undue delay when the risk to them is high | ISO sets no duty to inform individuals |
| Art. 35 | DPIA content and prior consultation with the authority (Art. 36) when the risk stays high | A risk assessment, but on people's rights, with a set content |
| Art. 37 to 39 | Appoint a DPO when required, with its independence | A role the law defines |
| Art. 44 to 49 | Transfer mechanism: adequacy decision (Art. 45), appropriate safeguards such as SCCs or BCRs (Art. 46, 47), or a derogation (Art. 49). The transfer impact assessment comes from the CJEU Schrems II ruling (C-311/18) and EDPB Recommendations 01/2020, not from the GDPR text | Legal mechanism, not a control |
