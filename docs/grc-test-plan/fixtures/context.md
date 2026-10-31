# Context

Fictional test organisation for the GRC skills test plan. Not a real company.

## Organisation
- **Name**: Northwind Payroll
- **Sector**: payroll SaaS for mid-size companies, and a licensed payment institution (pays salaries on behalf of clients)
- **Size**: 180 staff, offices in Lyon and Lisbon, hosted on AWS eu-west-3
- **Management body**: the executive committee (CEO, CFO, CTO, CISO)

## Frameworks in scope
- ISO 27001:2022 (certification audit on 2027-06-30)
- NIS2 (essential entity, French transposition)
- DORA (financial entity: payment institution)
- GDPR (processor for client payroll data, controller for staff data)

## ISMS scope
The payroll platform, its payment flows, and the teams that build, run and support it.

## Statement of applicability
All Annex A controls apply, except:
- A.7.5 Protecting against physical and environmental threats: no own data centre (AWS)
- A.7.11 Supporting utilities: no own data centre (AWS)

## Risk scales
Default EBIOS RM / ISO 27005 scales: severity G1 to G4, likelihood V1 to V4.

## Risk appetite
- **Low**: accepted by the risk owner.
- **Medium**: accepted by the CISO, reviewed every 6 months.
- **High**: never accepted without the executive committee's decision, quoted in the minutes.

## People
| Role | Person |
|---|---|
| CEO | Camille Durand |
| CFO | Hugo Lefevre |
| CTO | Ines Costa |
| CISO | Lea Martin |
| DPO | Marc Petit |
| IT Ops lead | Sofia Almeida |
| Head of Payroll Ops | Julien Moreau |
| Managed service provider (24/7 monitoring) | BlueShield MSP |

## Committees
- Security committee: monthly, chaired by the CISO
- Executive committee: quarterly, takes risk decisions above appetite
