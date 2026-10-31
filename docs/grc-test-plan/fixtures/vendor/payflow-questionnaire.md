# PayFlow HR: security questionnaire (answers received 2026-10-15)

Fictional vendor for the GRC skills test plan.

**Service we buy**: time and absence tracking, synced every night to our payroll platform by API. Holds names, contracts, absences and sick leave of our clients' employees.

| # | Question | PayFlow's answer |
|---|---|---|
| 1 | Certification | SOC 2 Type II report, period 2025-07-01 to 2026-06-30, covers the PayFlow SaaS platform (attached) |
| 2 | MFA for customer users | SSO (SAML) available on the Enterprise plan; MFA by authenticator app on all plans |
| 3 | Admin access | Admins use hardware keys; access logged and reviewed quarterly |
| 4 | Data location | AWS Frankfurt (eu-central-1); support team in Morocco has read access to tickets only |
| 5 | Encryption | AES-256 at rest, TLS 1.2+ in transit |
| 6 | Deletion at end of contract | Data deleted within 90 days, certificate on request |
| 7 | DPA | Standard DPA available; **not signed yet** |
| 8 | Breach notification | "Without undue delay" (no deadline in the contract) |
| 9 | Breaches in the last 12 months | None |
| 10 | Last pentest | April 2025 (summary attached) |
| 11 | Backups and continuity | Daily backups, continuity plan tested 2026-03 |
| 12 | Sub-processors | AWS, Sendgrid, Zendesk (list on their website) |
| 13 | Exit | CSV export of all data at any time |

Note from the sales call (2026-10-20, not in writing): "We did a new pentest this summer, all clean."
