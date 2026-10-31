---
date: 2026-10-30
frameworks: iso27001, nis2
scope: Northwind Payroll SaaS platform and its support teams (fictional sample)
target: 2027-06-30, ISO 27001 certification audit; NIS2 applies now
previous: none
trace: traces/2026-10-30-gap-analysis.md
---

# Gap analysis · ISO 27001, NIS2 · 2026-10-30

**80% of ISO 27001 is met, but only 22% of NIS2: the gaps are incident reporting and suppliers.**

## Executive summary
- **Where we stand**: ISO 27001 80% met (93 of 116 lines), NIS2 22% met (6 of 27). 28 gaps.
- **What changed**: baseline, no previous analysis.
- **What is most urgent**: we can't report a serious incident to the authority within 24 hours (NIS2 legal duty, G-01), and our critical suppliers were never checked (behind high risk R-004, G-06, G-07).
- **What we need**: owners confirmed for G-01 to G-09, budget for security keys (G-09) and a failover test (G-23), and the 2 exclusions confirmed (A.7.12, A.8.30).

## Coverage
| Framework | Lines | Met | Partial | Missing | Unknown | N/a | % met |
|---|---|---|---|---|---|---|---|
| ISO 27001 | 118 | 93 | 11 | 7 | 5 | 2 | 80% |
| NIS2 (16 + 12 extras) | 28 | 6 | 7 | 12 | 2 | 1 | 22% |

## Gaps
| ID | Gap | Fix | Closes | Leverage | Owner | Due | Effort | Priority |
|---|---|---|---|---|---|---|---|---|
| G-01 | No procedure to report a significant incident within 24 h, 72 h and 1 month (missing) | Write the 24 h / 72 h / 1 month notification procedure, with templates | NIS2 Art. 23(4)(a), NIS2 Art. 23(4)(b), NIS2 Art. 23(4)(c), NIS2 Art. 23(4)(d), NIS2 Art. 23(4)(e) | 5 | CISO | 2026-12-31 | S | legal duty |
| G-02 | No way for outsiders to report a flaw (no security.txt) (missing) | Publish security.txt and a disclosure process | NIS2 Art. 21(2)(e) | 1 | CTO | 2026-12-31 | S | legal duty |
| G-03 | 2 of 5 board members trained (partial) | Train the 3 remaining board members | NIS2 Art. 20(2) | 1 | CEO | 2026-12-31 | S | legal duty |
| G-04 | No proof of registration with ANSSI (unknown) | Confirm registration with ANSSI | NIS2 Art. 3(4), Art. 27 | 1 | Legal | 2026-12-15 | S | legal duty |
| G-05 | No way to warn clients about a threat (missing) | Write a client threat-advisory template and owner | NIS2 Art. 23(2) | 1 | CISO | 2026-12-31 | S | legal duty |
| G-06 | Supplier policy drafted, not approved (policies/suppliers-draft.md) (partial) | Approve the supplier security policy | ISO A.5.19, NIS2 Art. 21(2)(d), NIS2 Art. 21(3) | 3 | CISO | 2027-01-31 | S | behind R-004 (high) |
| G-07 | Cloud and payroll-engine suppliers never assessed (audit-2026-05.md, finding 5) (missing) | Assess the 6 critical suppliers, cloud and payroll engine first | ISO A.5.21, NIS2 Art. 21(2)(d), NIS2 Art. 21(3) | 3 | Head of Procurement | 2027-01-31 | M | behind R-004 (high) |
| G-08 | Backups run, restore never tested (risks/R-002) (partial) | Test a full restore every quarter | ISO A.8.13, NIS2 Art. 21(2)(c) | 2 | CTO | 2027-01-31 | S | behind R-002 (high) |
| G-09 | SMS codes for admins, no phishing-resistant MFA (risks/R-002) (partial) | Move admins to security keys (FIDO2) | ISO A.8.5, NIS2 Art. 21(2)(j) | 2 | IT Manager | 2027-01-31 | M | behind R-002 (high) |
| G-10 | Plan has no step to tell clients or authorities (partial) | Add who tells clients and authorities, and when | ISO A.5.26, NIS2 Art. 21(2)(b), NIS2 Art. 23(1) | 3 | CISO | 2027-03-31 | S | leverage |
| G-11 | Training done by 61% of staff in 2026 (evidence/training-2026.csv) (partial) | Get training to 95% and repeat it yearly | ISO A.6.3, NIS2 Art. 20(2), NIS2 Art. 21(2)(g) | 3 | HR Director | 2027-03-31 | S | leverage |
| G-12 | Incident plan written in 2023, never tested (policies/incident-response.md) (partial) | Update the incident plan and run a tabletop test | ISO A.5.24, NIS2 Art. 21(2)(b), NIS2 Art. 23(1) | 3 | CISO | 2027-03-31 | M | leverage |
| G-13 | Continuity plan covers offices, not the payroll platform (partial) | Extend the continuity plan to the payroll platform | ISO A.5.29, NIS2 Art. 21(2)(c), NIS2 Art. 21(2)(j) | 3 | COO | 2027-03-31 | M | leverage |
| G-14 | Treatment plans exist for 5 of 9 risks (risk-register.md) (partial) | Finish treatment plans for the 4 open risks | ISO 6.1.3, NIS2 Art. 21(1) | 2 | CISO | 2027-03-31 | S | leverage |
| G-15 | One management review in 2025; none in 2026 (evidence/mgmt-review-2025.pdf) (partial) | Hold the 2026 management review | ISO 9.3, NIS2 Art. 21(2)(f) | 2 | CEO | 2027-03-31 | S | leverage |
| G-16 | No list of authorities to call in an incident (audit-2026-05.md, finding 3) (missing) | List the authorities to call (CSIRT, ANSSI, CNIL, police) | ISO A.5.5, NIS2 Art. 23(1) | 2 | CISO | 2027-03-31 | S | leverage |
| G-17 | No yearly supplier review (missing) | Review critical suppliers once a year, first round in Q1 | ISO A.5.22, NIS2 Art. 21(2)(d) | 2 | Head of Procurement | 2027-03-31 | S | leverage |
| G-18 | No secure coding standard found (unknown) | Confirm or adopt a secure coding standard | ISO A.8.28, NIS2 Art. 21(2)(e) | 2 | CTO | 2026-12-15 | S | leverage |
| G-19 | No internal audit done or planned (evidence/ empty for audit) (missing) | Plan and run a first internal audit | ISO 9.2, NIS2 Art. 21(2)(f) | 2 | CISO | 2027-03-31 | M | leverage |
| G-20 | Security clauses in 3 of 11 key contracts (evidence/contracts-review.xlsx) (partial) | Add security clauses to the 8 remaining key contracts | ISO A.5.20, NIS2 Art. 21(2)(d) | 2 | Legal | 2027-03-31 | M | leverage |
| G-21 | No doc on how cloud services are chosen and exited (unknown) | Write how cloud services are chosen, run and exited | ISO A.5.23, NIS2 Art. 21(2)(d) | 2 | CTO | 2026-12-15 | M | leverage |
| G-22 | Monthly scans, but 14 critical findings older than 60 days (evidence/vuln-scan-2026-10.pdf) (partial) | Fix critical flaws within 30 days and track it | ISO A.8.8, NIS2 Art. 21(2)(e) | 2 | CTO | 2027-03-31 | M | leverage |
| G-23 | No recovery target or failover test for the platform (missing) | Set recovery targets and test a failover | ISO A.5.30, NIS2 Art. 21(2)(c) | 2 | CTO | 2027-03-31 | L | leverage |
| G-24 | No threat intelligence source or watch (missing) | Subscribe to a threat feed (CERT-FR) and review monthly | ISO A.5.7 | 1 | CISO | 2027-03-31 | S | leverage |
| G-25 | No doc says how data is classified (unknown) | Confirm or write the data classification scheme | ISO A.5.12 | 1 | CISO | 2026-12-15 | S | leverage |
| G-26 | No doc on labelling (unknown) | Confirm or write how data is labelled | ISO A.5.13 | 1 | CISO | 2026-12-15 | S | leverage |
| G-27 | No doc on masking test data (unknown) | Confirm whether test data is masked | ISO A.8.11 | 1 | CTO | 2026-12-15 | S | leverage |
| G-28 | No alerting on unusual admin activity (missing) | Alert on unusual admin logins and actions | ISO A.8.16 | 1 | IT Manager | 2027-03-31 | M | leverage |

## Checklist
### ISO 27001
| Ref | Requirement | Status | Evidence or gap |
|---|---|---|---|
| 4.1 | Understanding the organization and its context | met | policies/isms-manual.md, evidence/ |
| 4.2 | Understanding the needs and expectations of interested parties | met | policies/isms-manual.md, evidence/ |
| 4.3 | Determining the scope of the information security management system | met | policies/isms-manual.md, evidence/ |
| 4.4 | Information security management system | met | policies/isms-manual.md, evidence/ |
| 5.1 | Leadership and commitment | met | policies/isms-manual.md, evidence/ |
| 5.2 | Policy | met | policies/isms-manual.md, evidence/ |
| 5.3 | Organizational roles, responsibilities and authorities | met | policies/isms-manual.md, evidence/ |
| 6.1 | Actions to address risks and opportunities | met | policies/isms-manual.md, evidence/ |
| 6.1.2 | Information security risk assessment | met | policies/isms-manual.md, evidence/ |
| 6.1.3 | Information security risk treatment | partial | Treatment plans exist for 5 of 9 risks (risk-register.md) |
| 6.2 | Information security objectives and planning to achieve them | met | policies/isms-manual.md, evidence/ |
| 6.3 | Planning of changes | met | policies/isms-manual.md, evidence/ |
| 7.1 | Resources | met | policies/isms-manual.md, evidence/ |
| 7.2 | Competence | met | policies/isms-manual.md, evidence/ |
| 7.3 | Awareness | met | policies/isms-manual.md, evidence/ |
| 7.4 | Communication | met | policies/isms-manual.md, evidence/ |
| 7.5 | Documented information | met | policies/isms-manual.md, evidence/ |
| 8.1 | Operational planning and control | met | policies/isms-manual.md, evidence/ |
| 8.2 | Information security risk assessment | met | policies/isms-manual.md, evidence/ |
| 8.3 | Information security risk treatment | met | policies/isms-manual.md, evidence/ |
| 9.1 | Monitoring, measurement, analysis and evaluation | met | policies/isms-manual.md, evidence/ |
| 9.2 | Internal audit | missing | No internal audit done or planned (evidence/ empty for audit) |
| 9.3 | Management review | partial | One management review in 2025; none in 2026 (evidence/mgmt-review-2025.pdf) |
| 10.1 | Continual improvement | met | policies/isms-manual.md, evidence/ |
| 10.2 | Nonconformity and corrective action | met | policies/isms-manual.md, evidence/ |
| A.5.1 | Policies for information security | met | policies/isms-manual.md, evidence/ |
| A.5.2 | Information security roles and responsibilities | met | policies/isms-manual.md, evidence/ |
| A.5.3 | Segregation of duties | met | policies/isms-manual.md, evidence/ |
| A.5.4 | Management responsibilities | met | policies/isms-manual.md, evidence/ |
| A.5.5 | Contact with authorities | missing | No list of authorities to call in an incident (audit-2026-05.md, finding 3) |
| A.5.6 | Contact with special interest groups | met | policies/isms-manual.md, evidence/ |
| A.5.7 | Threat intelligence | missing | No threat intelligence source or watch |
| A.5.8 | Information security in project management | met | policies/isms-manual.md, evidence/ |
| A.5.9 | Inventory of information and other associated assets | met | policies/isms-manual.md, evidence/ |
| A.5.10 | Acceptable use of information and other associated assets | met | policies/isms-manual.md, evidence/ |
| A.5.11 | Return of assets | met | policies/isms-manual.md, evidence/ |
| A.5.12 | Classification of information | unknown | No doc says how data is classified |
| A.5.13 | Labelling of information | unknown | No doc on labelling |
| A.5.14 | Information transfer | met | policies/isms-manual.md, evidence/ |
| A.5.15 | Access control | met | policies/isms-manual.md, evidence/ |
| A.5.16 | Identity management | met | policies/isms-manual.md, evidence/ |
| A.5.17 | Authentication information | met | policies/isms-manual.md, evidence/ |
| A.5.18 | Access rights | met | policies/isms-manual.md, evidence/ |
| A.5.19 | Information security in supplier relationships | partial | Supplier policy drafted, not approved (policies/suppliers-draft.md) |
| A.5.20 | Addressing information security within supplier agreements | partial | Security clauses in 3 of 11 key contracts (evidence/contracts-review.xlsx) |
| A.5.21 | Managing information security in the ICT supply chain | missing | Cloud and payroll-engine suppliers never assessed (audit-2026-05.md, finding 5) |
| A.5.22 | Monitoring, review and change management of supplier services | missing | No yearly supplier review |
| A.5.23 | Information security for use of cloud services | unknown | No doc on how cloud services are chosen and exited |
| A.5.24 | Information security incident management planning and preparation | partial | Incident plan written in 2023, never tested (policies/incident-response.md) |
| A.5.25 | Assessment and decision on information security events | met | policies/isms-manual.md, evidence/ |
| A.5.26 | Response to information security incidents | partial | Plan has no step to tell clients or authorities |
| A.5.27 | Learning from information security incidents | met | policies/isms-manual.md, evidence/ |
| A.5.28 | Collection of evidence | met | policies/isms-manual.md, evidence/ |
| A.5.29 | Information security during disruption | partial | Continuity plan covers offices, not the payroll platform |
| A.5.30 | ICT readiness for business continuity | missing | No recovery target or failover test for the platform |
| A.5.31 | Legal, statutory, regulatory and contractual requirements | met | policies/isms-manual.md, evidence/ |
| A.5.32 | Intellectual property rights | met | policies/isms-manual.md, evidence/ |
| A.5.33 | Protection of records | met | policies/isms-manual.md, evidence/ |
| A.5.34 | Privacy and protection of PII | met | policies/isms-manual.md, evidence/ |
| A.5.35 | Independent review of information security | met | policies/isms-manual.md, evidence/ |
| A.5.36 | Compliance with policies, rules and standards for information security | met | policies/isms-manual.md, evidence/ |
| A.5.37 | Documented operating procedures | met | policies/isms-manual.md, evidence/ |
| A.6.1 | Screening | met | policies/isms-manual.md, evidence/ |
| A.6.2 | Terms and conditions of employment | met | policies/isms-manual.md, evidence/ |
| A.6.3 | Information security awareness, education and training | partial | Training done by 61% of staff in 2026 (evidence/training-2026.csv) |
| A.6.4 | Disciplinary process | met | policies/isms-manual.md, evidence/ |
| A.6.5 | Responsibilities after termination or change of employment | met | policies/isms-manual.md, evidence/ |
| A.6.6 | Confidentiality or non-disclosure agreements | met | policies/isms-manual.md, evidence/ |
| A.6.7 | Remote working | met | policies/isms-manual.md, evidence/ |
| A.6.8 | Information security event reporting | met | policies/isms-manual.md, evidence/ |
| A.7.1 | Physical security perimeters | met | policies/isms-manual.md, evidence/ |
| A.7.2 | Physical entry | met | policies/isms-manual.md, evidence/ |
| A.7.3 | Securing offices, rooms and facilities | met | policies/isms-manual.md, evidence/ |
| A.7.4 | Physical security monitoring | met | policies/isms-manual.md, evidence/ |
| A.7.5 | Protecting against physical and environmental threats | met | policies/isms-manual.md, evidence/ |
| A.7.6 | Working in secure areas | met | policies/isms-manual.md, evidence/ |
| A.7.7 | Clear desk and clear screen | met | policies/isms-manual.md, evidence/ |
| A.7.8 | Equipment siting and protection | met | policies/isms-manual.md, evidence/ |
| A.7.9 | Security of assets off-premises | met | policies/isms-manual.md, evidence/ |
| A.7.10 | Storage media | met | policies/isms-manual.md, evidence/ |
| A.7.11 | Supporting utilities | met | policies/isms-manual.md, evidence/ |
| A.7.12 | Cabling security | n/a | No own server room; cloud only (context.md, Scope) |
| A.7.13 | Equipment maintenance | met | policies/isms-manual.md, evidence/ |
| A.7.14 | Secure disposal or re-use of equipment | met | policies/isms-manual.md, evidence/ |
| A.8.1 | User endpoint devices | met | policies/isms-manual.md, evidence/ |
| A.8.2 | Privileged access rights | met | policies/isms-manual.md, evidence/ |
| A.8.3 | Information access restriction | met | policies/isms-manual.md, evidence/ |
| A.8.4 | Access to source code | met | policies/isms-manual.md, evidence/ |
| A.8.5 | Secure authentication | partial | SMS codes for admins, no phishing-resistant MFA (risks/R-002) |
| A.8.6 | Capacity management | met | policies/isms-manual.md, evidence/ |
| A.8.7 | Protection against malware | met | policies/isms-manual.md, evidence/ |
| A.8.8 | Management of technical vulnerabilities | partial | Monthly scans, but 14 critical findings older than 60 days (evidence/vuln-scan-2026-10.pdf) |
| A.8.9 | Configuration management | met | policies/isms-manual.md, evidence/ |
| A.8.10 | Information deletion | met | policies/isms-manual.md, evidence/ |
| A.8.11 | Data masking | unknown | No doc on masking test data |
| A.8.12 | Data leakage prevention | met | policies/isms-manual.md, evidence/ |
| A.8.13 | Information backup | partial | Backups run, restore never tested (risks/R-002) |
| A.8.14 | Redundancy of information processing facilities | met | policies/isms-manual.md, evidence/ |
| A.8.15 | Logging | met | policies/isms-manual.md, evidence/ |
| A.8.16 | Monitoring activities | missing | No alerting on unusual admin activity |
| A.8.17 | Clock synchronization | met | policies/isms-manual.md, evidence/ |
| A.8.18 | Use of privileged utility programs | met | policies/isms-manual.md, evidence/ |
| A.8.19 | Installation of software on operational systems | met | policies/isms-manual.md, evidence/ |
| A.8.20 | Networks security | met | policies/isms-manual.md, evidence/ |
| A.8.21 | Security of network services | met | policies/isms-manual.md, evidence/ |
| A.8.22 | Segregation of networks | met | policies/isms-manual.md, evidence/ |
| A.8.23 | Web filtering | met | policies/isms-manual.md, evidence/ |
| A.8.24 | Use of cryptography | met | policies/isms-manual.md, evidence/ |
| A.8.25 | Secure development life cycle | met | policies/isms-manual.md, evidence/ |
| A.8.26 | Application security requirements | met | policies/isms-manual.md, evidence/ |
| A.8.27 | Secure system architecture and engineering principles | met | policies/isms-manual.md, evidence/ |
| A.8.28 | Secure coding | unknown | No secure coding standard found |
| A.8.29 | Security testing in development and acceptance | met | policies/isms-manual.md, evidence/ |
| A.8.30 | Outsourced development | n/a | No outsourced development (context.md, Scope) |
| A.8.31 | Separation of development, test and production environments | met | policies/isms-manual.md, evidence/ |
| A.8.32 | Change management | met | policies/isms-manual.md, evidence/ |
| A.8.33 | Test information | met | policies/isms-manual.md, evidence/ |
| A.8.34 | Protection of information systems during audit testing | met | policies/isms-manual.md, evidence/ |
### NIS2
| Clause | Requirement | ISO 27001 | Fit | Status | Why |
|---|---|---|---|---|---|
| Art. 20(1) | Management body approves the risk-management measures and oversees them | 5.1, A.5.4 | partial | partial | controls met; extra Art. 20(2) not met |
| Art. 20(2) | Management body follows cybersecurity training; staff offered it regularly | 7.2, A.6.3 | partial | partial | A.6.3 partial |
| Art. 21(1) | Appropriate and proportionate measures, all-hazards approach | 6.1.2, 6.1.3, 8.2, 8.3 | full | partial | 6.1.3 partial |
| Art. 21(2)(a) | Policies on risk analysis and information system security | 5.2, A.5.1, 6.1.2 | full | met | all mapped controls met |
| Art. 21(2)(b) | Incident handling | A.5.24, A.5.25, A.5.26, A.5.27, A.5.28, A.6.8 | full | partial | A.5.24 partial, A.5.26 partial |
| Art. 21(2)(c) | Business continuity (backup, disaster recovery) and crisis management | A.5.29, A.5.30, A.8.13, A.8.14 | full | missing | A.5.29 partial, A.5.30 missing, A.8.13 partial |
| Art. 21(2)(d) | Supply chain security, with direct suppliers and service providers | A.5.19, A.5.20, A.5.21, A.5.22, A.5.23 | full | missing | A.5.19 partial, A.5.20 partial, A.5.21 missing, A.5.22 missing, A.5.23 unknown |
| Art. 21(2)(e) | Security in network and information systems acquisition, development and maintenance, incl. vulnerability handling and disclosure | A.8.8, A.8.9, A.8.25, A.8.26, A.8.27, A.8.28, A.8.29, A.8.32 | partial | unknown | A.8.8 partial, A.8.28 unknown |
| Art. 21(2)(f) | Policies and procedures to assess the effectiveness of the measures | 9.1, 9.2, 9.3, A.5.35, A.5.36 | full | missing | 9.2 missing, 9.3 partial |
| Art. 21(2)(g) | Basic cyber hygiene and cybersecurity training | A.6.3, A.5.10, A.8.1, A.8.7 | full | partial | A.6.3 partial |
| Art. 21(2)(h) | Cryptography and, where appropriate, encryption | A.8.24 | full | met | all mapped controls met |
| Art. 21(2)(i) | Human resources security, access control policies, asset management | A.6.1, A.6.2, A.6.4, A.6.5, A.5.15, A.5.16, A.5.18, A.8.2, A.5.9, A.5.10, A.5.11 | full | met | all mapped controls met |
| Art. 21(2)(j) | Multi-factor or continuous authentication; secured voice, video, text and emergency communications | A.8.5, A.5.14, A.8.20, A.8.21, A.5.29 | full | partial | A.8.5 partial, A.5.29 partial |
| Art. 21(3) | For supply chain measures, take account of each direct supplier's vulnerabilities, product quality and secure development practices | A.5.19, A.5.21, A.8.30 | full | missing | A.5.19 partial, A.5.21 missing |
| Art. 21(4) | Corrective measures without undue delay when a measure of Art. 21(2) is not met | 10.2 | full | met | all mapped controls met |
| Art. 23(1) | Notify significant incidents to the CSIRT or authority, and service recipients where needed | A.5.5, A.5.24, A.5.26 | partial | missing | A.5.5 missing, A.5.24 partial, A.5.26 partial |

Extras:

| Clause | Duty | Status | Evidence or gap |
|---|---|---|---|
| Art. 20(1) | Management body members can be held liable for infringements | met | Board briefed on liability, 2026-09-12 (evidence/board-minutes-2026-09.pdf) |
| Art. 23(4)(a) | Early warning within 24 hours of becoming aware of a significant incident | missing | No procedure to warn the CSIRT within 24 h |
| Art. 23(4)(b) | Incident notification within 72 hours, with a first assessment and indicators of compromise | missing | No procedure to notify within 72 h |
| Art. 23(4)(c) | Intermediate report when the CSIRT or authority asks | missing | No owner for the authority's follow-up requests |
| Art. 23(4)(d) | Final report within one month of the incident notification: description, severity and impact, root cause, mitigation, cross-border impact | missing | No final-report step in the incident plan |
| Art. 23(4)(e) | Incident still ongoing at the final report date: progress report then, final report within one month of handling it | missing | No progress-report step for long incidents |
| Art. 23(4) | Trust service providers: incident notification within 24 hours instead of 72 | n/a | Not a trust service provider (context.md, Sector) |
| Art. 23(2) | Tell service recipients hit by a significant cyber threat what measures they can take, and where fit the threat itself | missing | No way to warn clients about a threat |
| Art. 21(3) | Take account of the EU coordinated risk assessments of critical supply chains (Art. 22(1)) | met | EU supply-chain assessments tracked by Procurement (policies/suppliers-draft.md, §4) |
| Art. 21(2)(e) | Coordinated vulnerability disclosure (reporting channel for outsiders) | missing | No way for outsiders to report a flaw (no security.txt) |
| Art. 20(2) | Management body members must follow training themselves, not only approve it | partial | 2 of 5 board members trained |
| Art. 3(4), Art. 27 | Register with the national authority (entity list, or registry for digital providers) | unknown | No proof of registration with ANSSI |

Not checked: none (DORA and GDPR are not in scope in context.md).

## Snapshot
| Line | Status |
|---|---|
| ISO 4.1 | met |
| ISO 4.2 | met |
| ISO 4.3 | met |
| ISO 4.4 | met |
| ISO 5.1 | met |
| ISO 5.2 | met |
| ISO 5.3 | met |
| ISO 6.1 | met |
| ISO 6.1.2 | met |
| ISO 6.1.3 | partial |
| ISO 6.2 | met |
| ISO 6.3 | met |
| ISO 7.1 | met |
| ISO 7.2 | met |
| ISO 7.3 | met |
| ISO 7.4 | met |
| ISO 7.5 | met |
| ISO 8.1 | met |
| ISO 8.2 | met |
| ISO 8.3 | met |
| ISO 9.1 | met |
| ISO 9.2 | missing |
| ISO 9.3 | partial |
| ISO 10.1 | met |
| ISO 10.2 | met |
| ISO A.5.1 | met |
| ISO A.5.2 | met |
| ISO A.5.3 | met |
| ISO A.5.4 | met |
| ISO A.5.5 | missing |
| ISO A.5.6 | met |
| ISO A.5.7 | missing |
| ISO A.5.8 | met |
| ISO A.5.9 | met |
| ISO A.5.10 | met |
| ISO A.5.11 | met |
| ISO A.5.12 | unknown |
| ISO A.5.13 | unknown |
| ISO A.5.14 | met |
| ISO A.5.15 | met |
| ISO A.5.16 | met |
| ISO A.5.17 | met |
| ISO A.5.18 | met |
| ISO A.5.19 | partial |
| ISO A.5.20 | partial |
| ISO A.5.21 | missing |
| ISO A.5.22 | missing |
| ISO A.5.23 | unknown |
| ISO A.5.24 | partial |
| ISO A.5.25 | met |
| ISO A.5.26 | partial |
| ISO A.5.27 | met |
| ISO A.5.28 | met |
| ISO A.5.29 | partial |
| ISO A.5.30 | missing |
| ISO A.5.31 | met |
| ISO A.5.32 | met |
| ISO A.5.33 | met |
| ISO A.5.34 | met |
| ISO A.5.35 | met |
| ISO A.5.36 | met |
| ISO A.5.37 | met |
| ISO A.6.1 | met |
| ISO A.6.2 | met |
| ISO A.6.3 | partial |
| ISO A.6.4 | met |
| ISO A.6.5 | met |
| ISO A.6.6 | met |
| ISO A.6.7 | met |
| ISO A.6.8 | met |
| ISO A.7.1 | met |
| ISO A.7.2 | met |
| ISO A.7.3 | met |
| ISO A.7.4 | met |
| ISO A.7.5 | met |
| ISO A.7.6 | met |
| ISO A.7.7 | met |
| ISO A.7.8 | met |
| ISO A.7.9 | met |
| ISO A.7.10 | met |
| ISO A.7.11 | met |
| ISO A.7.12 | n/a |
| ISO A.7.13 | met |
| ISO A.7.14 | met |
| ISO A.8.1 | met |
| ISO A.8.2 | met |
| ISO A.8.3 | met |
| ISO A.8.4 | met |
| ISO A.8.5 | partial |
| ISO A.8.6 | met |
| ISO A.8.7 | met |
| ISO A.8.8 | partial |
| ISO A.8.9 | met |
| ISO A.8.10 | met |
| ISO A.8.11 | unknown |
| ISO A.8.12 | met |
| ISO A.8.13 | partial |
| ISO A.8.14 | met |
| ISO A.8.15 | met |
| ISO A.8.16 | missing |
| ISO A.8.17 | met |
| ISO A.8.18 | met |
| ISO A.8.19 | met |
| ISO A.8.20 | met |
| ISO A.8.21 | met |
| ISO A.8.22 | met |
| ISO A.8.23 | met |
| ISO A.8.24 | met |
| ISO A.8.25 | met |
| ISO A.8.26 | met |
| ISO A.8.27 | met |
| ISO A.8.28 | unknown |
| ISO A.8.29 | met |
| ISO A.8.30 | n/a |
| ISO A.8.31 | met |
| ISO A.8.32 | met |
| ISO A.8.33 | met |
| ISO A.8.34 | met |
| NIS2 Art. 20(1) | partial |
| NIS2 Art. 20(2) | partial |
| NIS2 Art. 21(1) | partial |
| NIS2 Art. 21(2)(a) | met |
| NIS2 Art. 21(2)(b) | partial |
| NIS2 Art. 21(2)(c) | missing |
| NIS2 Art. 21(2)(d) | missing |
| NIS2 Art. 21(2)(e) | unknown |
| NIS2 Art. 21(2)(f) | missing |
| NIS2 Art. 21(2)(g) | partial |
| NIS2 Art. 21(2)(h) | met |
| NIS2 Art. 21(2)(i) | met |
| NIS2 Art. 21(2)(j) | partial |
| NIS2 Art. 21(3) | missing |
| NIS2 Art. 21(4) | met |
| NIS2 Art. 23(1) | missing |
| NIS2 extra Art. 20(1) | met |
| NIS2 extra Art. 23(4)(a) | missing |
| NIS2 extra Art. 23(4)(b) | missing |
| NIS2 extra Art. 23(4)(c) | missing |
| NIS2 extra Art. 23(4)(d) | missing |
| NIS2 extra Art. 21(2)(e) | missing |
| NIS2 extra Art. 20(2) | partial |
| NIS2 extra Art. 3(4), Art. 27 | unknown |
| NIS2 extra Art. 23(4)(e) | missing |
| NIS2 extra Art. 23(4) | n/a |
| NIS2 extra Art. 23(2) | missing |
| NIS2 extra Art. 21(3) | met |
