---
id: pci-dss
name: PCI DSS v4.0.1
source: https://www.pcisecuritystandards.org/document_library/ (PCI DSS v4.0.1, June 2024)
checked: 2026-10-30
status: draft, to review by a GRC practitioner
---

# PCI DSS

Protects payment card data in the cardholder data environment (CDE). Cited at requirement level (`Req. 8`); sub-requirements (`Req. 8.4.2`) only after checking the text, else "clause to confirm". The scope is the CDE, not the whole ISMS scope.

## Mapping

One row per clause. **Fit** `full`: the ISO 27001 refs meet the clause. `partial`: they help, and the rest is in Extras.

| Clause | Requirement | ISO 27001 | Fit |
|---|---|---|---|
| Req. 1 | Install and maintain network security controls | A.8.20, A.8.21, A.8.22 | full |
| Req. 2 | Apply secure configurations to all system components | A.8.9 | full |
| Req. 3 | Protect stored account data | A.5.12, A.5.33, A.8.10, A.8.11, A.8.24 | partial |
| Req. 4 | Protect cardholder data with strong cryptography during transmission over open, public networks | A.5.14, A.8.24 | full |
| Req. 5 | Protect all systems and networks from malicious software | A.8.7 | full |
| Req. 6 | Develop and maintain secure systems and software | A.8.8, A.8.25, A.8.26, A.8.28, A.8.29, A.8.32 | partial |
| Req. 7 | Restrict access by business need to know | A.5.15, A.5.18, A.8.3 | full |
| Req. 8 | Identify users and authenticate access | A.5.16, A.5.17, A.8.5 | partial |
| Req. 9 | Restrict physical access to cardholder data | A.7.1, A.7.2, A.7.10, A.7.14 | full |
| Req. 10 | Log and monitor all access to system components and cardholder data | A.8.15, A.8.16, A.8.17 | partial |
| Req. 11 | Test security of systems and networks regularly | A.8.8, A.8.29 | partial |
| Req. 12 | Support information security with organizational policies and programs | 5.2, 6.1.2, A.5.1, A.5.19, A.5.24, A.6.3 | partial |

## Extras

Duties the pivot does not carry. **gap-analysis** checks them on their own; a risk touches one when its feared event would trigger it.

| Clause | Duty | Why ISO 27001 misses it |
|---|---|---|
| Req. 3.3 | Never store sensitive authentication data (full track, CVV, PIN) after authorization | Card-specific rule |
| Req. 3.4, Req. 3.5 | Mask PAN when displayed, render it unreadable wherever stored | Card-specific rule |
| Req. 6.4.3 | Inventory, authorize and check integrity of every script on payment pages | Card-specific rule (e-skimming) |
| Req. 8.4.2 | MFA for all access into the CDE | ISO asks for secure authentication, not MFA everywhere |
| Req. 10.5.1 | Keep audit logs at least 12 months, 3 months immediately available | ISO sets no retention period |
| Req. 11.3.2 | External vulnerability scans by an Approved Scanning Vendor (ASV) every three months | ISO sets no cadence or scanner |
| Req. 11.4 | Internal and external penetration tests at least once every 12 months, plus segmentation tests | ISO doesn't require pen tests |
| Req. 11.6.1 | Detect unauthorized changes to payment pages | Card-specific rule |
| Req. 12.3.1 | Targeted risk analysis for each requirement with a flexible frequency | A PCI-specific analysis |
| Req. 12.5.2 | Confirm the PCI DSS scope at least once every 12 months | ISO scope is set once and reviewed, not this cadence |
| Report | Annual assessment: Report on Compliance by a QSA, or a Self-Assessment Questionnaire, per the card brands' levels | An assessment format |
