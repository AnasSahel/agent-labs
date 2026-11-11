---
id: hds
name: HDS, Hébergeur de Données de Santé (référentiel de certification v2, 2024)
source: https://esante.gouv.fr/produits-services/hds (référentiel v2); Code de la santé publique, Art. L.1111-8 and R.1111-8-8 to R.1111-11
checked: 2026-10-30
status: draft, to review by a GRC practitioner
---

# HDS

French certification for anyone hosting personal health data on behalf of others. Built on ISO 27001: the certification requires an ISO 27001 ISMS on the hosting scope, plus HDS-specific requirements. Rows cite the six hosting activities of Art. R.1111-9; the référentiel's own chapter numbers are cited only after checking it, else "clause to confirm".

## Mapping

One row per clause. **Fit** `full`: the ISO 27001 refs meet the clause. `partial`: they help, and the rest is in Extras.

| Clause | Requirement | ISO 27001 | Fit |
|---|---|---|---|
| L.1111-8 | An ISO 27001 ISMS certified on the scope of the hosting activities | 4.3, 4.4 | full |
| R.1111-9 1° | Provide and maintain the physical sites hosting the infrastructure | A.7.1, A.7.2, A.7.3, A.7.4, A.7.5, A.7.11, A.7.12 | full |
| R.1111-9 2° | Provide and maintain the hardware infrastructure | A.7.8, A.7.13, A.7.14, A.8.6, A.8.14 | full |
| R.1111-9 3° | Provide and maintain the virtual infrastructure | A.5.23, A.8.9, A.8.20, A.8.22 | full |
| R.1111-9 4° | Provide and maintain the application hosting platform | A.8.9, A.8.19, A.8.31 | full |
| R.1111-9 5° | Administer and operate the information system holding health data | A.5.37, A.8.2, A.8.5, A.8.15, A.8.16 | full |
| R.1111-9 6° | Back up health data | A.8.13 | full |
| R.1111-11 | Hosting contract with the content the code sets | A.5.20 | partial |
| Référentiel HDS v2 | Health data hosted only in the European Economic Area | A.5.31 | partial |
| Référentiel HDS v2 | Transparency on any risk of access by a non-EEA authority | A.5.31 | partial |

## Extras

Duties the pivot does not carry. **gap-analysis** checks them on their own; a risk touches one when its feared event would trigger it.

| Clause | Duty | Why ISO 27001 misses it |
|---|---|---|
| R.1111-11 | Contract states the activities hosted, location, security, reversibility, subcontractors, incident notification to the client | A list set by law |
| Référentiel HDS v2 | Store and access health data only from the EEA (chapter to confirm) | A data residency rule |
| Référentiel HDS v2 | Map and publish any exposure to extraterritorial laws, and tell the client (chapter to confirm) | A sovereignty rule |
| L.1111-8 | Certification by an accredited body, renewed every 3 years with yearly surveillance audits | A certification scheme |
