# Duties

The starting activities for each scope, each tied to the duty it serves. Read only the scopes you need. Drop a framework's refs when it is not in scope; keep a row when any of its frameworks is. Where you are not sure a clause fits the user's case, write "clause to confirm" rather than guess another.

## Default roles

Use these when `grc/roles.md` and the policies name none. Rename to the org's titles.

| Role | Plain words |
|---|---|
| Board | The management body: CEO, executive committee or board |
| CISO | Head of security |
| CIO | Head of IT |
| IT Ops lead | Runs systems, accounts and patches |
| SOC | Watches alerts, first response (often a supplier) |
| Risk manager | Second line: risk method and register |
| DPO | Data protection officer |
| Legal | Legal and regulatory counsel |
| Internal audit | Third line: independent review |
| Asset owner | The business manager who owns the system or data |
| HR | People, joiners and leavers |
| Comms | Internal and external communication |

## Governance (security programme)

| ID | Activity | Duty |
|---|---|---|
| G1 | Approve the security policy | ISO 27001 5.2, A.5.1 · NIS2 Art. 20(1) · DORA Art. 5(2)(b) |
| G2 | Assign security roles and authorities | ISO 27001 5.3, A.5.2 · DORA Art. 5(2)(c) |
| G3 | Set the risk appetite | ISO 27001 6.1.2 · DORA Art. 6(8)(b) |
| G4 | Run the risk assessment | ISO 27001 6.1.2, 8.2 · NIS2 Art. 21(2)(a) · DORA Art. 8 |
| G5 | Approve risk treatment and residual risks | ISO 27001 6.1.3(f) · NIS2 Art. 20(1) · DORA Art. 5(2) |
| G6 | Train management on cyber risk | NIS2 Art. 20(2) · DORA Art. 5(4) |
| G7 | Run awareness training for staff | ISO 27001 7.3, A.6.3 · NIS2 Art. 21(2)(g) |
| G8 | Audit the security programme | ISO 27001 9.2, A.5.35 · DORA Art. 6(6) |
| G9 | Hold the management review | ISO 27001 9.3 |
| G10 | Fix nonconformities | ISO 27001 10.2 |

## Incident response

| ID | Activity | Duty |
|---|---|---|
| I1 | Detect and log security events | ISO 27001 A.8.15, A.8.16 · DORA Art. 10 |
| I2 | Report a suspected incident | ISO 27001 A.6.8 |
| I3 | Triage and classify the incident | ISO 27001 A.5.25 · DORA Art. 18 |
| I4 | Contain and recover | ISO 27001 A.5.26 · NIS2 Art. 21(2)(b) · DORA Art. 11 |
| I5 | Collect and keep evidence | ISO 27001 A.5.28 |
| I6 | Send the 24h early warning to the authority | NIS2 Art. 23(4)(a) |
| I7 | Notify a major ICT incident to the authority | DORA Art. 19 |
| I8 | Notify a personal data breach within 72h | GDPR Art. 33 |
| I9 | Tell affected people or clients | GDPR Art. 34 · NIS2 Art. 23(1) · DORA Art. 19(3) |
| I10 | Run the post-incident review | ISO 27001 A.5.27 · DORA Art. 13 |

## Access management

| ID | Activity | Duty |
|---|---|---|
| AC1 | Set the access control policy | ISO 27001 A.5.15 · NIS2 Art. 21(2)(i) |
| AC2 | Request access for a person | ISO 27001 A.5.18 |
| AC3 | Approve access | ISO 27001 A.5.18, A.5.3 |
| AC4 | Grant access in the system | ISO 27001 A.5.16, A.5.18 |
| AC5 | Grant and watch admin rights | ISO 27001 A.8.2 |
| AC6 | Enforce MFA | ISO 27001 A.8.5 · NIS2 Art. 21(2)(j) |
| AC7 | Review access rights | ISO 27001 A.5.18 · DORA Art. 9(4)(c) |
| AC8 | Remove access of leavers | ISO 27001 A.5.18, A.6.5 |

## Vulnerabilities and change

| ID | Activity | Duty |
|---|---|---|
| V1 | Keep the asset inventory | ISO 27001 A.5.9 · NIS2 Art. 21(2)(i) · DORA Art. 8(4) |
| V2 | Scan for vulnerabilities | ISO 27001 A.8.8 · NIS2 Art. 21(2)(e) |
| V3 | Rate and prioritise vulnerabilities | ISO 27001 A.8.8 |
| V4 | Patch | ISO 27001 A.8.8 |
| V5 | Accept a patch delay (exception) | ISO 27001 A.8.8, 6.1.3 |
| V6 | Approve a change | ISO 27001 A.8.32 · DORA Art. 9(4)(e) |
| V7 | Make the change | ISO 27001 A.8.32 |
| V8 | Run security tests and pentests | ISO 27001 A.8.29 · DORA Art. 24, 25 |

## Suppliers

| ID | Activity | Duty |
|---|---|---|
| S1 | Set the supplier security policy | ISO 27001 A.5.19 · NIS2 Art. 21(2)(d) · DORA Art. 28(2) |
| S2 | Assess a supplier before signing | ISO 27001 A.5.19 · DORA Art. 28(4) |
| S3 | Put security clauses in the contract | ISO 27001 A.5.20 · DORA Art. 30 · GDPR Art. 28(3) |
| S4 | Keep the register of ICT suppliers | DORA Art. 28(3) |
| S5 | Monitor the supplier's service | ISO 27001 A.5.22 |
| S6 | Plan the exit from a critical supplier | DORA Art. 28(8) |

## Continuity

| ID | Activity | Duty |
|---|---|---|
| C1 | Run the business impact analysis | ISO 27001 A.5.30 · DORA Art. 11(5) |
| C2 | Approve the continuity plan | ISO 27001 A.5.29 · NIS2 Art. 21(2)(c) · DORA Art. 11 |
| C3 | Run backups | ISO 27001 A.8.13 · DORA Art. 12 |
| C4 | Test restore and the plan | ISO 27001 A.5.30 · DORA Art. 11(6) |
| C5 | Declare a crisis | ISO 27001 A.5.29 |

## Personal data

| ID | Activity | Duty |
|---|---|---|
| P1 | Keep the record of processing | GDPR Art. 30 |
| P2 | Decide a new processing | GDPR Art. 24, 25 |
| P3 | Run a DPIA | GDPR Art. 35 |
| P4 | Advise on the DPIA | GDPR Art. 35(2), 39(1)(c) |
| P5 | Answer data subject requests | GDPR Art. 12 to 22 |
| P6 | Secure personal data | GDPR Art. 32 · ISO 27001 A.5.34 |
| P7 | Notify a personal data breach within 72h | GDPR Art. 33 |

## Review pairs

Pairs the **conflict** check reads: the same person R or A on both sides is a conflict.

| Does | Checks |
|---|---|
| G4, G5 | G8 |
| AC2, AC4 | AC3, AC7 |
| V7 | V6 |
| V4 | V5 |
| P2 | P4 |
| any activity | G8 |
