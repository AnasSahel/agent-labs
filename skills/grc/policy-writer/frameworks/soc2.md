---
id: soc2
name: SOC 2, AICPA Trust Services Criteria (2017, revised points of focus 2022)
source: https://www.aicpa-cima.com (TSP section 100); AICPA publishes a mapping to ISO 27001
checked: 2026-10-30
status: draft, to review by a GRC practitioner
---

# SOC 2

An attestation report by a CPA firm against the Trust Services Criteria: Security (the common criteria, always in scope), plus Availability, Confidentiality, Processing Integrity and Privacy when chosen. Cited at criterion level (`CC6.1`).

## Mapping

One row per clause. **Fit** `full`: the ISO 27001 refs meet the clause. `partial`: they help, and the rest is in Extras.

| Clause | Requirement | ISO 27001 | Fit |
|---|---|---|---|
| CC1 | Control environment: integrity, board oversight, structure, competence, accountability | 5.1, 5.3, 7.2, A.5.2, A.5.4, A.6.1, A.6.2, A.6.4 | full |
| CC2 | Communication and information: quality information, internal and external communication | 7.4, A.5.1, A.6.3, A.6.8 | full |
| CC3 | Risk assessment, including fraud risk and significant changes | 6.1.2, 8.2, 6.3 | partial |
| CC4 | Monitoring activities: evaluate controls, report deficiencies | 9.1, 9.2, 9.3, A.5.35, A.5.36 | full |
| CC5 | Control activities: selected, deployed through policies and procedures | 6.1.3, A.5.1, A.5.37 | full |
| CC6.1 | Logical access security: infrastructure, software, credentials, encryption | A.5.15, A.8.3, A.8.5, A.8.24 | full |
| CC6.2 | Register and authorize users before granting access | A.5.16, A.5.18 | full |
| CC6.3 | Grant, change and remove access by role, least privilege, segregation of duties | A.5.3, A.5.18, A.8.2 | full |
| CC6.4 | Restrict physical access to facilities and assets | A.7.1, A.7.2, A.7.3 | full |
| CC6.5 | Discontinue protections only after data is removed from disposed assets | A.7.14, A.8.10 | full |
| CC6.6 | Protect against threats from outside the system boundaries | A.8.20, A.8.21, A.8.22, A.8.23 | full |
| CC6.7 | Restrict and protect data in transmission, movement and removal | A.5.14, A.7.10, A.8.12, A.8.24 | full |
| CC6.8 | Prevent or detect unauthorized or malicious software | A.8.7, A.8.19 | full |
| CC7.1 | Detect configuration changes and new vulnerabilities | A.8.8, A.8.9 | full |
| CC7.2 | Monitor system components for anomalies | A.8.15, A.8.16 | full |
| CC7.3 | Evaluate security events to decide if they are incidents | A.5.25 | full |
| CC7.4 | Respond to incidents with a defined program | A.5.24, A.5.26, A.5.28 | full |
| CC7.5 | Recover from incidents | A.5.27, A.5.29, A.8.13 | full |
| CC8.1 | Change management: authorize, design, test, approve, implement changes | A.8.32, A.8.29, A.8.31 | full |
| CC9.1 | Mitigate risks from business disruption | A.5.29, A.5.30 | full |
| CC9.2 | Assess and manage risks from vendors and business partners | A.5.19, A.5.20, A.5.22 | full |
| A1 | Availability: capacity, environmental protections, backup and recovery, tested | A.8.6, A.8.13, A.8.14, A.7.5, A.7.11, A.5.30 | full |
| C1 | Confidentiality: identify, protect and dispose of confidential information | A.5.12, A.5.33, A.8.10 | full |
| PI1 | Processing integrity: complete, valid, accurate, timely processing | A.8.26 | partial |
| P1 to P8 | Privacy: notice, choice, collection, use, access, disclosure, quality, monitoring | A.5.34 | partial |

## Extras

Duties the pivot does not carry. **gap-analysis** checks them on their own; a risk touches one when its feared event would trigger it.

| Clause | Duty | Why ISO 27001 misses it |
|---|---|---|
| CC3 | Consider the potential for fraud when assessing risks (CC3.3) | ISO risk assessment doesn't name fraud |
| PI1 | Define processing specifications and check inputs, processing and outputs against them | Data quality of processing, not security |
| P1 to P8 | Privacy notice, consent, data subject access and correction, as the privacy criteria set | Privacy programme; see iso27701 |
| Report | Management's system description and assertion, and a Type 2 period (usually 3 to 12 months) of operating evidence | An attestation format, not a control |
