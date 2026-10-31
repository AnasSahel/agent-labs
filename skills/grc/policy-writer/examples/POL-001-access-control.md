---
id: POL-001
title: Access control policy
version: 1.0
status: draft
owner: Head of IT
approver: Executive committee
approved: pending
effective: 2026-12-01
next review: 2027-12-01
frameworks: ISO 27001:2022, NIS2, GDPR
trace: traces/2026-10-30-access-control-policy.md
---

# Access control policy

**Everyone gets only the access their job needs, and loses it the day they no longer need it.**

## Executive summary
- **Why this policy**: an admin login phished despite SMS codes (R-002) and an ex-developer who kept write access to payment code (R-004) are our two top risks.
- **Who it applies to**: every employee, contractor and supplier with an account on our systems, in every office and remotely.
- **What changes for people**: phishing-proof sign-in for admins by 2027-03-31, access removed within one working day of leaving, and managers confirm their team's access every quarter.
- **What we need**: approval by the executive committee on 2026-11-12; one gap to accept (shared accounts on the warehouse scanners until 2027-06-30).

## Scope
All people (employees, contractors, interns, supplier staff) and all systems that hold company or client data: the payroll platform, Microsoft 365, GitHub, AWS and the office network.

## Roles
| Role | Accountable for |
|---|---|
| Head of IT | This policy, the identity system, removing access |
| Managers | Asking for and confirming their team's access |
| HR | Telling IT about arrivals, moves and departures the same day |
| System owners | Deciding who may access their system |
| Everyone | Keeping their sign-in details to themselves |

## Rules
| # | Rule | ISO 27001 | NIS2 | GDPR | Risks |
|---|---|---|---|---|---|
| AC-01 | System owners must grant access only for a job need, approved by the person's manager. | A.5.15, A.5.18 | Art. 21(2)(i) | Art. 5(1)(f), Art. 32(1)(b) | R-004 |
| AC-02 | Each person must have their own named account; shared accounts need an approved exception. | A.5.16 | Art. 21(2)(i) | | |
| AC-03 | Everyone must sign in with a second factor; admins must use a phishing-proof one (security key or passkey). | A.8.5, A.5.17 | Art. 21(2)(j) | Art. 32(1)(b) | R-002 |
| AC-04 | Admins must use a separate admin account, only for admin work. | A.8.2 | Art. 21(2)(i) | | R-002 |
| AC-05 | HR must tell IT about every departure or move the same day; IT must remove or change access within one working day. | A.5.18, A.6.5 | Art. 21(2)(i) | | R-004 |
| AC-06 | Managers must confirm their team's access every quarter; admin rights every month. | A.5.18, A.8.2 | Art. 21(2)(i) | | R-004 |
| AC-07 | System owners must limit client payroll data to the people who serve that client. | A.8.3 | Art. 21(2)(i) | Art. 5(1)(f), Art. 32(1)(b) | |
| AC-08 | No one may share, write down or reuse a work password. | A.5.17 | | | R-002 |

## Exceptions
The Head of IT grants exceptions in writing, for 6 months at most, each logged in `grc/policies/exceptions.md` with an owner and an end date. Exceptions above 6 months go to the executive committee.

## Review
Every year, and early after a major incident, a new framework in scope or an audit finding on access.

## Coverage
| Duty | ISO 27001 | Covered by | NIS2 | GDPR |
|---|---|---|---|---|
| Access control rules | A.5.15 | AC-01 | Art. 21(2)(i) | Art. 5(1)(f), 32(1)(b) |
| Identity management | A.5.16 | AC-02 | Art. 21(2)(i) | |
| Authentication information | A.5.17 | AC-03, AC-08 | | |
| Access rights | A.5.18 | AC-01, AC-05, AC-06 | Art. 21(2)(i) | |
| After leaving or moving | A.6.5 | AC-05 | Art. 21(2)(i) | |
| Privileged access | A.8.2 | AC-04, AC-06 | Art. 21(2)(i) | |
| Information access restriction | A.8.3 | AC-07 | | Art. 5(1)(f), 32(1)(b) |
| Secure authentication | A.8.5 | AC-03 | Art. 21(2)(j) | Art. 32(1)(b) |

Gaps: warehouse scanners keep a shared account until 2027-06-30 (AC-02), decided by the COO (user, Q6). Conflicts: AC-03 asks for phishing-proof sign-in for admins; R-002 records SMS codes in place until 2027-03-31.

## Version history
| Version | Date | Change | Why |
|---|---|---|---|
| 1.0 | 2026-10-30 | First version | NIS2 in scope; R-002 and R-004 |
