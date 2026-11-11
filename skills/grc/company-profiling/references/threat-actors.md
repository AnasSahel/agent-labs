---
name: threat-actors
purpose: Rules for listing plausible threat actors for a company from its sector and size, to feed the profile and later risk-assessment
status: draft, general knowledge of public threat reporting, NOT yet validated. Every rule marked (?) is a question for Anas
---

# Threat actor rules

Edit this file to change the skill's reasoning. The list is **hypotheses**: plausible actors for a sector and size, never observed ones. Never state that an actor attacked or targets a named company. Group names are examples only; vendors name and merge groups differently, so prefer the actor **type** and give at most one example name, marked "example".

## 1. Actor types

| Code | Type | Goal | Typical way in |
|---|---|---|---|
| RW | Ransomware and extortion crews | Money, by encrypting or leaking data | Phished credentials, exposed VPN/RDP, unpatched edge devices, supplier access |
| FIN | Financial-crime crews and fraudsters | Direct theft, payment and card fraud | Phishing, web skimmers, account takeover, social engineering of support staff |
| APT | State-linked espionage or sabotage | Intelligence, long access, disruption | Spear-phishing, zero-days on edge devices, cloud identity abuse |
| DPRK | DPRK-linked financial theft | Funds for the state | Fake recruiter lures, crypto and bank targeting |
| HKT | Hacktivists | Disruption, visibility | DDoS, defacement |
| INS | Insiders and negligent staff | Money, grievance, mistakes | Legitimate access |
| SUP | Supply-chain attackers | Reach many victims through one | Compromised software, MSP or vendor access |
| IAB | Initial-access brokers and infostealer markets | Resell access | Stolen credentials and sessions |
| DATA | Data thieves and scrapers | Resell personal data | Web flaws, API abuse, credential stuffing |

## 2. Baseline for every company

- RW, IAB and INS apply to any company with staff and IT. Always listed.
- SUP applies when the company depends on software or IT providers (nearly always); the question is which.

## 3. Sector signals (NAF is a hint only, see regulatory-scope.md section 5)

| Signal | Add actors | Reason |
|---|---|---|
| Banking, payment, e-money, prepaid (64.xx, 66.19x, DORA signal) | FIN, HKT, APT, DPRK | Direct monetisation; public sites attract DDoS; (?) DPRK only when crypto or payment services are exposed |
| Insurance (65.xx) | RW, DATA, FIN | Large personal and health data; claims fraud |
| Health or health software (86.xx, 62.0x with health clients) | RW, DATA, APT, HKT | Sensitive data, public-health impact |
| Retail and e-commerce (47.xx) | DATA, FIN | Customer accounts (credential stuffing), card skimming |
| Software, IT services, cloud (62.xx, 63.11Z) | APT, SUP, IAB | Customers' access and data; cloud identity |
| Energy, transport, water, telecom (NIS2 Annex I) | APT, HKT, RW | Disruption and sabotage value; (?) which ones France reports most |
| Public sector, defence suppliers | APT, HKT | Espionage and disruption |
| Holding or group head office (70.10Z, 64.20Z) | follow the group activity | NAF hides it: ask which entities carry the business |

## 4. Size and exposure modifiers

- Large (GE) or well-known brand: add HKT and phishing impersonation (FIN).
- Many sites or stores: INS and SUP rise.
- Millions of consumers: DATA rises.

## 5. Output rules

- Rank at most 6 actors, most likely first. One line each: type, goal, likely way in, and the reason from the table above.
- Confidence is `low` for every actor unless the interview confirms the activity.
- Each unknown becomes a question for the scoping interview (suppliers, group entities, real activity, past incidents).
- No claims about real incidents. If the user asks about one, say it is out of scope here.

## 6. Open questions for Anas

1. Keep named example groups, or only actor types?
2. Which public sources can later back this (ANSSI CTI reports, CERT-FR)? Not used in v1.
3. DPRK: keep only for payment and crypto, or drop?
