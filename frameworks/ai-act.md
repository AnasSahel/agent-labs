---
id: ai-act
name: AI Act, Regulation (EU) 2024/1689
source: https://eur-lex.europa.eu/eli/reg/2024/1689/oj
checked: 2026-10-30
status: draft, to review by a GRC practitioner
---

# AI Act

Rules by risk class: prohibited practices, high-risk systems (Annex III uses and safety components), transparency duties, general-purpose AI models. Duties differ for providers and deployers, and apply in phases (prohibitions since February 2025, GPAI since August 2025, high-risk from August 2026 or later): check the current dates before citing a deadline. Mostly not security, so most of it is in Extras; ISO 42001 carries it better.

## Mapping

One row per clause. **Fit** `full`: the ISO 27001 refs meet the clause. `partial`: they help, and the rest is in Extras.

| Clause | Requirement | ISO 27001 | Fit |
|---|---|---|---|
| Art. 4 | AI literacy of staff dealing with AI systems | A.6.3 | partial |
| Art. 9 | Risk management system for high-risk AI, across the life cycle | 6.1.2, 6.1.3 | partial |
| Art. 10 | Data and data governance for training, validation and testing | A.5.12, A.5.33 | partial |
| Art. 11 | Technical documentation of high-risk AI (Annex IV) | 7.5 | partial |
| Art. 12 | Record-keeping: automatic logs over the system's lifetime | A.8.15 | partial |
| Art. 15 | Accuracy, robustness and cybersecurity (incl. data poisoning, adversarial examples) | A.8.8, A.8.25, A.8.27, A.8.29 | partial |
| Art. 17 | Quality management system of the provider | 4.4, 7.5, 9.2, 10.2 | partial |
| Art. 26 | Deployer obligations: use per instructions, oversight, monitoring, logs kept | A.5.10, A.8.15, A.8.16 | partial |
| Art. 73 | Report serious incidents to the market surveillance authority | A.5.5, A.5.26 | partial |

## Extras

Duties the pivot does not carry. **gap-analysis** checks them on their own; a risk touches one when its feared event would trigger it.

| Clause | Duty | Why ISO 27001 misses it |
|---|---|---|
| Art. 4 | Ensure a sufficient level of AI literacy for staff and others operating AI on the organization's behalf | AI-specific training |
| Art. 5 | Never use prohibited practices (social scoring, manipulative techniques, untargeted facial scraping...) | A legal ban |
| Art. 6 | Classify each AI system: high-risk or not, with Annex III | A legal classification |
| Art. 9 | Risks to health, safety and fundamental rights, tested before market | Not information risk |
| Art. 10 | Training data relevant, representative, examined for bias | Data quality |
| Art. 11 | Technical documentation in the Annex IV content | A set content |
| Art. 12 | Logs that allow tracing the system's functioning, as Art. 12 lists | A set content |
| Art. 13, Art. 14 | Instructions for use for deployers, and effective human oversight | AI-specific |
| Art. 15 | Declared accuracy levels and resilience to errors and AI-specific attacks | AI-specific |
| Art. 17 | QMS covering regulatory compliance, data management and post-market monitoring | Broader than security |
| Art. 26 | Deployers keep logs at least 6 months, inform workers, and affected persons where required | AI-specific |
| Art. 27 | Fundamental rights impact assessment for certain deployers of high-risk AI | AI-specific |
| Art. 43, Art. 47, Art. 49 | Conformity assessment, EU declaration of conformity, CE marking, registration in the EU database | Product compliance |
| Art. 50 | Tell people they are talking to an AI, label deepfakes and AI-generated content | Transparency duty |
| Art. 53, Art. 55 | General-purpose AI models: documentation, copyright policy, training content summary; systemic-risk models: evaluations, incident reporting, cybersecurity | GPAI-specific |
| Art. 72 | Post-market monitoring plan for high-risk AI | Product monitoring |
| Art. 73 | Serious incident report within 15 days, shorter for widespread or fatal cases | ISO sets no deadline |
