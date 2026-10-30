---
id: dora
name: DORA, Regulation (EU) 2022/2554
source: https://eur-lex.europa.eu/eli/reg/2022/2554/oj (Chapters II to V)
checked: 2026-10-30
status: draft, to review by a GRC practitioner
---

# DORA

Digital operational resilience of EU financial entities, applicable since 17 January 2025. Cited at article level: paragraph numbers and the RTS/ITS that detail them (e.g. Delegated Regulation (EU) 2024/1774 on the ICT risk management framework) are cited only after checking the text, else "clause to confirm".

## Mapping

One row per article. **Fit** `full`: the ISO 27001 refs meet the article. `partial`: they help, and the rest is in Extras.

| Clause | Requirement | ISO 27001 | Fit |
|---|---|---|---|
| Art. 5 | Governance and organisation: management body defines, approves and is accountable for ICT risk management | 5.1, 5.3, A.5.1, A.5.2, A.5.4 | partial |
| Art. 6 | ICT risk management framework, documented and reviewed, with internal audit | 4.4, 6.1.2, 6.1.3, 7.5, 9.2, 9.3 | full |
| Art. 7 | ICT systems, protocols and tools: reliable, with sufficient capacity, resilient | A.8.6, A.8.14 | full |
| Art. 8 | Identification: business functions, information and ICT assets, their dependencies and risk sources | 6.1.2, A.5.9, A.5.12 | full |
| Art. 9 | Protection and prevention: access, authentication, network, encryption, patching, change management | A.5.15, A.5.18, A.8.2, A.8.5, A.8.8, A.8.9, A.8.20, A.8.22, A.8.24, A.8.32, A.5.37 | full |
| Art. 10 | Detection of anomalous activities | A.8.15, A.8.16, A.5.25 | full |
| Art. 11 | Response and recovery: ICT business continuity policy and plans, tested | A.5.24, A.5.26, A.5.29, A.5.30 | full |
| Art. 12 | Backup policies, restoration and recovery procedures | A.8.13, A.8.14 | full |
| Art. 13 | Learning and evolving: post-incident reviews, staff training, threat watch | A.5.7, A.5.27, A.6.3, 10.1 | full |
| Art. 14 | Communication plans for incidents, to staff, clients and the public | A.5.24, A.5.26, 7.4 | full |
| Art. 16 | Simplified ICT risk management framework (small entities) | 6.1.2, 6.1.3 | partial |
| Art. 17 | ICT-related incident management process | A.5.24, A.5.25, A.5.26, A.5.27, A.5.28, A.6.8 | full |
| Art. 18 | Classification of ICT-related incidents and cyber threats | A.5.25 | partial |
| Art. 19 | Reporting of major ICT-related incidents to the competent authority | A.5.5, A.5.26 | partial |
| Art. 24 | Digital operational resilience testing programme | A.8.8, A.8.29, A.5.35 | partial |
| Art. 25 | Testing of ICT tools and systems (vulnerability scans, penetration tests...) | A.8.8, A.8.29 | full |
| Art. 26 | Threat-led penetration testing (TLPT) | A.8.8 | partial |
| Art. 28 | ICT third-party risk: policy, due diligence, monitoring, exit strategies | A.5.19, A.5.20, A.5.21, A.5.22, A.5.23 | partial |
| Art. 29 | Preliminary assessment of ICT concentration risk | A.5.19 | partial |
| Art. 30 | Key contractual provisions with ICT providers | A.5.20 | partial |
| Art. 45 | Sharing cyber threat information and intelligence | A.5.6, A.5.7 | full |

## Extras

Duties the pivot does not carry. **gap-analysis** checks them on their own; a risk touches one when its feared event would trigger it.

| Clause | Duty | Why ISO 27001 misses it |
|---|---|---|
| Art. 5 | Management body keeps up its ICT risk knowledge and sets the budget for it | ISO asks for commitment, not training of the board |
| Art. 16 | Only the entities listed in Art. 16(1) may use the simplified framework; check eligibility first | Scope rule of the regulation |
| Art. 24 | Testing programme run by independent testers, with systems supporting critical or important functions tested at least yearly (clause to confirm) | ISO asks for testing, not this cadence |
| Art. 18 | Classify incidents with the regulator's criteria (clients, duration, spread, data, criticality, economic impact) | Criteria are set by the RTS, not by the entity |
| Art. 19 | Initial, intermediate and final reports of major incidents, on the RTS/ITS timelines and templates (clause to confirm) | ISO sets no deadline or template |
| Art. 26, Art. 27 | TLPT at least every 3 years for designated entities, with qualified testers | ISO asks for testing, not TLPT |
| Art. 28(3) | Keep the register of information on all ICT third-party contracts and report it to the authority | A regulatory register with a set format |
| Art. 28 | Exit strategy for each ICT service supporting a critical or important function | ISO does not require exit plans |
| Art. 29 | Assess concentration risk before contracting for a critical or important function | ISO does not look at concentration |
| Art. 30 | Mandatory contract clauses (service locations, audit rights, termination rights, exit...) | ISO asks for security clauses, not this list |
