---
id: dora
name: DORA, Regulation (EU) 2022/2554
source: https://eur-lex.europa.eu/eli/reg/2022/2554/oj (Chapters II to V)
checked: 2026-10-30
status: draft, to review by a GRC practitioner
---

# DORA

Digital operational resilience of EU financial entities, applicable since 17 January 2025. Mapped at article level, with paragraph numbers in Extras. Detail sits in the RTS/ITS: Delegated Regulation (EU) 2024/1774 (ICT risk management framework), 2024/1772 (incident classification) and 2025/301 (incident report content and time limits).

Checked line by line against the EUR-Lex texts on 2026-10-30.

## Mapping

One row per article. **Fit** `full`: the ISO 27001 refs meet the article. `partial`: they help, and the rest is in Extras.

| Clause | Requirement | ISO 27001 | Fit |
|---|---|---|---|
| Art. 5 | Governance and organisation: management body defines, approves and is accountable for ICT risk management | 5.1, 5.3, A.5.1, A.5.2, A.5.4 | partial |
| Art. 6 | ICT risk management framework, documented, reviewed at least yearly, internally audited, with a digital operational resilience strategy | 4.4, 6.1.2, 6.1.3, 6.2, 7.5, 9.2, 9.3, 10.2 | partial |
| Art. 7 | ICT systems, protocols and tools: reliable, with sufficient capacity, resilient | A.8.6, A.8.14 | full |
| Art. 8 | Identification: business functions, information and ICT assets, their dependencies and risk sources | 6.1.2, A.5.9, A.5.12 | full |
| Art. 9 | Protection and prevention: access, authentication, network, encryption, patching, change management | A.5.15, A.5.18, A.8.2, A.8.5, A.8.8, A.8.9, A.8.20, A.8.22, A.8.24, A.8.32, A.5.37 | full |
| Art. 10 | Detection of anomalous activities | A.8.15, A.8.16, A.5.25 | full |
| Art. 11 | Response and recovery: ICT business continuity policy, BIA, response and recovery plans, tested, crisis management function | A.5.24, A.5.26, A.5.29, A.5.30 | partial |
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
| Art. 5(4) | Management body members follow specific ICT risk training on a regular basis | ISO asks for commitment, not training of the board |
| Art. 5(2)(g) | Management body allocates and reviews the digital operational resilience budget | ISO asks for resources, not a board-set budget |
| Art. 5(3) | A role (or a senior manager) monitors arrangements with ICT third-party providers | A role the regulation defines |
| Art. 6(4) | Independent ICT risk control function, segregated from internal audit (not microenterprises) | ISO asks for roles, not this independence |
| Art. 6(5), Art. 6(8) | Framework reviewed at least yearly and after major incidents; a resilience strategy with ICT risk tolerance and impact tolerance | ISO sets no yearly review or impact tolerance |
| Art. 11(5), Art. 11(6) | Business impact analysis; BCP and response and recovery plans tested at least yearly, with cyber-attack and switchover scenarios | ISO asks for ICT readiness, not this cadence |
| Art. 11(7), Art. 11(10) | Crisis management function; report yearly costs and losses of major incidents on request | A function and a report the regulation defines |
| Art. 16(1) | Only the entities listed in Art. 16(1) may use the simplified framework; check eligibility first | Scope rule of the regulation |
| Art. 24(4), Art. 24(6) | Tests run by independent parties (internal or external); all systems and applications supporting critical or important functions tested at least yearly | ISO asks for testing, not this cadence |
| Art. 18(1) | Classify incidents with the regulation's criteria (clients and counterparts, reputational impact, duration, geographical spread, data losses, criticality of services, economic impact), thresholds in Delegated Regulation (EU) 2024/1772 | Criteria are set by the RTS, not by the entity |
| Art. 19(4) | Initial notification within 4 hours of classifying the incident as major and no later than 24 hours after awareness; intermediate report within 72 hours of the initial one; final report within one month of the last intermediate report (Delegated Regulation (EU) 2025/301, Art. 5) | ISO sets no deadline or template |
| Art. 19(3) | Inform clients without undue delay when a major incident hits their financial interests, with the mitigation taken | A duty to customers |
| Art. 26(1), Art. 27 | TLPT at least every 3 years for entities the authority identifies, on live production systems, with testers meeting Art. 27 | ISO asks for testing, not TLPT |
| Art. 28(3) | Keep the register of information on all ICT third-party contracts, report new arrangements at least yearly, give the full register on request | A regulatory register with a set format |
| Art. 28(2) | Strategy on ICT third-party risk, with a policy on ICT services for critical or important functions (not microenterprises or Art. 16 entities) | ISO asks for a supplier policy, not this strategy |
| Art. 28(7) | Contracts can be terminated in the four cases Art. 28(7) lists | ISO asks for security clauses, not termination rights |
| Art. 28(8) | Documented, tested exit strategy and transition plan for each ICT service supporting a critical or important function | ISO does not require exit plans |
| Art. 29(1), Art. 29(2) | Before contracting for a critical or important function: substitutability, multiple contracts with one provider, subcontracting chains, insolvency law, third-country providers | ISO does not look at concentration |
| Art. 30(2), Art. 30(3) | Mandatory contract clauses in Art. 30(2) (services, locations, data protection and return, SLAs, incident help, cooperation with authorities, termination, training); more in Art. 30(3) for critical or important functions (precise SLA targets, notice and reporting duties, provider BCP tests, TLPT participation, unrestricted audit rights, exit transition period) | ISO asks for security clauses, not this list |
