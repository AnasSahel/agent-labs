---
name: regulatory-scope
purpose: Rules for judging, from public data, whether NIS2, GDPR or DORA probably apply to a French company
status: draft, written from the legal texts as known, NOT yet re-checked line by line against EUR-Lex. Every rule marked (?) is a question for Anas
---

# Regulatory scope rules

Edit this file to change the skill's reasoning. Each rule cites its source. A rule marked **(?)** is unsure: the skill must lower confidence to `low` and list it as an open question. Status is always `likely`, `possible` or `unlikely`, never a verdict.

Article numbers for duties (NIS2 Art. 21 and 23, DORA Art. 5 to 23, GDPR) are in the skill's `frameworks/` files. The **scope** articles below are not there yet.

## 1. Size (EU SME definition)

Source: Commission Recommendation 2003/361/EC, Annex, Art. 2, referred to by NIS2 Art. 2(1).

| Class | Headcount | and | Turnover | or | Balance sheet total |
|---|---|---|---|---|---|
| Micro | < 10 | | ≤ €2M | | ≤ €2M |
| Small | < 50 | | ≤ €10M | | ≤ €10M |
| Medium | < 250 | | ≤ €50M | | ≤ €43M |
| Large | otherwise | | | | |

- A company is **not small** when headcount is 50 or more, or when turnover and balance sheet both exceed €10M. It is **large** when headcount is 250 or more, or when turnover exceeds €50M and balance sheet exceeds €43M.
- A class changes only when a ceiling is exceeded for two consecutive years (Annex, Art. 4(2)).
- Partner and linked enterprises add their figures (Annex, Art. 3 and 6). Public data cannot settle this: always an open question for companies with a group hint.
- Headcount from the API is a **band** of salaried staff at year end, not full-time equivalents. If a band straddles a limit (`20-49`, `200-249`, `250-499`), the class is `possible`, not `likely`.
- The API field `categorie_entreprise` (PME / ETI / GE) is INSEE's statistical category. Use it as a hint only. **(?)** Does Anas want to rely on it when the balance sheet is missing?
- **Balance sheet total is never in the API.** Without it, a company is classed by headcount and turnover only, and the profile says so.

## 2. NIS2

Source: Directive (EU) 2022/2555 (NIS2), Art. 2, 3 and Annexes I and II. France transposes it by national law; **(?)** which French law and what status on this date? Until Anas names it, say "NIS2 as in the Directive; French transposition to confirm".

### 2.1 Reading order

1. Sector: is the activity in Annex I or Annex II (table 2.3)?
2. Size: medium or large (Art. 2(1))? If no, go to 2.2 for the cases in scope regardless of size.
3. Class: **essential** or **important** (2.4).
4. Place: the company must provide the services or carry out its activity in the EU (Art. 2(1)). A French legal entity does.

### 2.2 In scope regardless of size (Art. 2(2))

If the activity matches, status `possible` at least, confidence `low` unless noted: public data rarely settles these.

- Providers of public electronic communications networks or services, trust service providers, TLD name registries and DNS service providers: Art. 2(2)(a). **Size does not matter.** NAF 61.10Z, 61.20Z, 61.30Z, 61.90Z hint at telecom; whether the offer is *public* is a question.
- Sole provider in a Member State of a service essential for societal or economic activities: Art. 2(2)(b).
- Disruption could have a significant impact on public safety, public security or public health: Art. 2(2)(c).
- Disruption could induce a significant systemic risk, notably cross-border: Art. 2(2)(d).
- Entity critical because of its importance at national or regional level for the sector or type of service: Art. 2(2)(e).
- Public administration entities: Art. 2(2)(f) **(?)** the exact scope for French local authorities.
- Entities identified as critical entities under Directive (EU) 2022/2557 (CER): Art. 2(3). Not detectable from public data: a question.
- Sector-specific act with equivalent duties: NIS2 Art. 4. For financial entities in DORA scope, DORA replaces the NIS2 risk-management and incident-reporting duties. Say so in the table.

### 2.3 Sectors and NAF hints

Annex sectors from Annex I and II. NAF codes are **hints**: `clear` means the code matches the sector wording well, `uncertain` means the code is broader or narrower than the Annex.

**(?)** The codes below are NAF Rev. 2 (2008), which equals NACE Rev. 2 at 4 digits. From 1 Jan 2025 INSEE uses NAF 2025 (NACE Rev. 2.1) and the codes changed for some activities. Which revision does the API return, and do we map both? The script passes `naf_nomenclature` through when the API gives it. Until Anas decides: if the revision is unknown, every NAF-based status is `possible` at most.

**Annex I, sectors of high criticality**

| Annex I | Type of entity | NAF Rev. 2 hint | Match |
|---|---|---|---|
| 1 Energy, electricity | Producers, suppliers, network operators, market operators | 35.11Z, 35.12Z, 35.13Z, 35.14Z | uncertain |
| 1 Energy, district heating and cooling | Operators | 35.30Z | uncertain (also covers other steam supply) |
| 1 Energy, oil | Pipelines, production, refining, storage | 06.10Z, 19.20Z, 49.50Z | uncertain |
| 1 Energy, gas | Suppliers, distribution and storage operators, LNG | 35.21Z, 35.22Z, 35.23Z | uncertain |
| 1 Energy, hydrogen | Production, storage, transmission | none | no NAF code: question |
| 2 Transport, air | Carriers, airport managing bodies | 51.10Z, 51.21Z, 52.23Z | clear for 51.10Z, uncertain others |
| 2 Transport, rail | Infrastructure managers, railway undertakings | 49.10Z, 49.20Z, 52.21Z | uncertain |
| 2 Transport, water | Shipping companies, port managing bodies | 50.10Z, 50.20Z, 52.22Z | uncertain |
| 2 Transport, road | Road authorities, intelligent transport systems operators | none | carriers (49.31Z, 49.41Z) are not themselves listed: question |
| 3 Banking | Credit institutions | 64.19Z | uncertain (a licence, not a NAF code, decides). DORA applies instead of NIS2 duties |
| 4 Financial market infrastructure | Trading venues, central counterparties | 66.11Z | uncertain. DORA applies instead of NIS2 duties |
| 5 Health | Healthcare providers, EU reference labs, R&D of medicines, pharma manufacturing, critical medical devices | 86.10Z hospitals; 21.10Z, 21.20Z pharma; 72.11Z, 72.19Z R&D | clear for 86.10Z and 21.xx; uncertain for the rest |
| 6 Drinking water | Suppliers and distributors | 36.00Z | uncertain (covers non-drinking water too) |
| 7 Waste water | Collection, disposal, treatment | 37.00Z | clear |
| 8 Digital infrastructure | IXP, DNS, TLD, cloud, data centre, CDN, trust services, public e-comms | 63.11Z (hosting, data processing); 61.10Z to 61.90Z (telecom) | uncertain: only some 63.11Z firms are cloud or data centre |
| 9 ICT service management (B2B) | Managed service providers, managed security service providers | 62.03Z (infogérance), 62.02A, 62.09Z | uncertain: 62.01Z software publishing and development is **not** this |
| 10 Public administration | Central government and regional bodies | legal form code, not NAF (84.xx) | question |
| 11 Space | Operators of ground-based infrastructure | 51.22Z, 61.30Z | uncertain |

**Annex II, other critical sectors**

| Annex II | Type of entity | NAF Rev. 2 hint | Match |
|---|---|---|---|
| 1 Postal and courier | Postal service providers incl. couriers | 53.10Z, 53.20Z | clear |
| 2 Waste management | Entities whose principal activity is waste management | 38.11Z, 38.12Z, 38.21Z, 38.22Z, 38.31Z, 38.32Z | clear |
| 3 Chemicals | Manufacture, production, distribution | 20.11Z to 20.60Z, 46.75Z | uncertain: Annex ties it to REACH definitions of substances |
| 4 Food | Wholesale distribution, industrial production and processing | 10.xx, 11.xx, 46.31Z to 46.39Z | uncertain (retail is not listed) |
| 5 Manufacturing | Medical devices and IVD; computer, electronic, optical; electrical equipment; machinery n.e.c.; motor vehicles; other transport equipment | 26.xx, 27.xx, 28.xx, 29.xx, 30.xx, 32.50A, 32.50B | clear at division level, uncertain at class level |
| 6 Digital providers | Online marketplaces, search engines, social networking platforms | 63.12Z, 47.91A, 47.91B | uncertain: the NAF code rarely shows a marketplace or a platform |
| 7 Research | Research organisations (not education institutions) | 72.11Z, 72.19Z, 72.20Z | uncertain |

Reading a NAF hint:
- `clear` and size medium or large: `likely`.
- `uncertain`, or size band straddles a limit: `possible`.
- No NAF hint and no regardless-of-size case: `unlikely`, confidence `medium` (NAF may not reflect the real activity, see 5).
- Size small or micro, no regardless-of-size case: `unlikely`, confidence `high` if the headcount band and turnover are both clearly below the limits, else `medium`.

### 2.4 Essential or important (Art. 3)

- **Essential**: Annex I entities above the medium ceilings, i.e. large (Art. 3(1)(a)); qualified trust service providers, TLD registries and DNS service providers, whatever their size (Art. 3(1)(b)); medium public e-comms providers (Art. 3(1)(c)); central public administration (Art. 3(1)(d)) **(?)** Art. 3(1)(e) entities designated by a Member State: not detectable.
- **Important**: every other in-scope entity (Art. 3(2)): Annex I medium, and Annex II medium or large.
- State it as "would be essential / important if in scope", with the French designation to confirm.

## 3. GDPR

Source: Regulation (EU) 2016/679, Art. 2 and 3 (scope), Art. 9 (special categories), Art. 30(5) (records), Art. 35 (DPIA), Art. 37 (DPO).

- Applies to any company processing personal data of people in the EU, in the context of an establishment in the EU (Art. 3(1)). Every French company with staff or customers qualifies: status **`likely`, confidence `high`**, always.
- Signals of **large-scale or sensitive processing** (raise the reason, not the status). Source: Art. 9, Art. 35(3), Art. 37(1)(b) and (c). NAF hints, all **(?)**: health and social care 86.xx, 87.xx, 88.xx; insurance 65.xx; banking 64.xx; HR, staffing and recruitment 78.xx; advertising and market research 73.xx; telecom 61.xx; hosting and data processing 63.11Z; online retail 47.91x; education 85.xx; security and investigation 80.xx; public administration 84.xx; credit reference and debt collection 82.91Z.
- Headcount < 250 can exempt from the records of processing (Art. 30(5)), but not if processing is regular, risky or involves special categories: the exemption is rarely safe. Do not claim it.
- DPO (Art. 37): required for public bodies, large-scale regular and systematic monitoring, or large-scale special categories. Public data cannot show it: a question.

## 4. DORA

Source: Regulation (EU) 2022/2554, Art. 2 (scope), Art. 3(19) (ICT third-party service provider), Art. 28 to 30 (contract duties), Art. 31 (critical ICT third-party providers).

### 4.1 Financial entities (Art. 2(1))

Credit institutions; payment institutions (incl. those exempted under PSD2); account information service providers; electronic money institutions; investment firms; crypto-asset service providers and issuers of asset-referenced tokens; central securities depositories; central counterparties; trading venues; trade repositories; managers of alternative investment funds; management companies (UCITS); data reporting service providers; insurance and reinsurance undertakings; insurance intermediaries, reinsurance intermediaries and ancillary insurance intermediaries; institutions for occupational retirement provision; credit rating agencies; administrators of critical benchmarks; crowdfunding service providers; securitisation repositories.

Excluded (Art. 2(3)), among others: insurance, reinsurance and ancillary intermediaries that are micro, small or medium enterprises (so only large ones are in scope); small IORPs; some fund managers under the Art. 3(2) AIFMD threshold. **(?)** Exact list of exclusions to check against the text.

| NAF Rev. 2 hint | Possible DORA entity type | Match |
|---|---|---|
| 64.19Z | Credit institution | uncertain: licence decides |
| 64.92Z, 64.91Z | Credit or leasing activity | uncertain: only if licensed as a credit institution or payment institution |
| 65.11Z, 65.12Z, 65.20Z | Insurance and reinsurance undertaking | clear |
| 65.30Z | Pension fund (IORP) | uncertain |
| 66.12Z | Investment firm | uncertain |
| 66.11Z | Trading venue | uncertain |
| 66.30Z | AIF manager, UCITS management company | uncertain |
| 66.22Z | Insurance intermediary | uncertain: in scope only if large |
| 66.19A, 66.19B, 64.99Z | Payment, e-money, crowdfunding, crypto or other | uncertain: the NAF code does not say which |

- Clear NAF hint (65.1x, 65.20Z) and a legal form that is an operating company: `likely`. Other hints: `possible`, confidence `low`.
- **Licence status is the real test** and is not in public data. Open question: licensed by ACPR or AMF? **(?)** Should a later version read the ACPR/AMF registers (REGAFI, ORIAS)?
- A financial entity in DORA scope: DORA's ICT risk and incident rules replace NIS2 Art. 21 and 23 (NIS2 Art. 4). Mark NIS2 as `possible` with that reason, not `likely`.

### 4.2 ICT third-party providers (Art. 3(19), 28 to 31)

- A company selling ICT services (cloud, hosting, software, managed services, data analytics) to financial entities is not itself a DORA financial entity, but its clients must put DORA contract terms on it (Art. 30) and may audit it. A very large provider can be designated critical (Art. 31) and then supervised directly.
- NAF hints: 62.01Z, 62.02A, 62.02B, 62.03Z, 62.09Z, 63.11Z, 63.12Z, 61.xx. The NAF code cannot show whether the clients are financial.
- Status: `possible`, confidence `low`, reason "serves financial clients? to confirm". Never `likely` from public data alone.

## 5. Known limits (state them in the profile when they matter)

1. **Group size.** Partner and linked enterprises count toward size (Annex to 2003/361, Art. 3 and 6). Public data shows at best a parent hint. Always a question when a group hint exists.
2. **Confidential accounts.** About half of French companies file confidential accounts: no turnover, sometimes no net result. The API then returns nothing. Say "confidential or not published", never 0.
3. **Balance sheet.** Not in this source. Future sources: INPI annual accounts (free account), INSEE Sirene (key), Pappers (paid).
4. **NAF code.** It records the main activity at registration; real activity may differ (holding companies are often coded 64.20Z or 70.10Z, group HQs 70.10Z). Say "NAF may not reflect real activity" for any `possible` that rests only on the code.
5. **Headcount.** Band of salaried staff, a given year, not FTE. Outsourced and temporary staff are missing.
6. **Legal entity only.** The SIREN is the French legal entity. Foreign group companies are invisible.

## 6. Other regimes: "worth checking" only

One line each, no analysis. Add only when a signal exists.

| Regime | Signal |
|---|---|
| HDS (health data hosting, French Public Health Code) | Hosting or software for health providers: NAF 63.11Z, 62.0x with health clients |
| PCI DSS | Card payments taken or processed: retail, e-commerce, payment NAF 66.19x |
| LPM / OIV, SIIV (French critical operators) | Large operator in energy, transport, health, water, finance, telecom |
| Regulation (EU) 2024/2847 CRA | Manufacturer of products with digital elements (26.xx, 62.01Z editor) |
| EU AI Act | Provides or uses AI systems: 62.01Z, 63.11Z, 72.19Z |
| SecNumCloud | Cloud provider selling to French public bodies |

## 7. Open questions for Anas

Collected from the (?) marks above:

1. French NIS2 transposition: which law, which date in force, and does it change Art. 2 and 3 for France?
2. NAF revision: does the API return NAF Rev. 2 or NAF 2025? Map both?
3. Use INSEE `categorie_entreprise` as a size hint when the balance sheet is missing?
4. Annex I and II NAF hints: validate the `clear` and `uncertain` calls, especially 62.03Z (MSP), 63.11Z (cloud / data centre), 35.xx (energy), 36.00Z.
5. Public administration (Annex I, 10): detect from legal form code? Which codes?
6. GDPR large-scale NAF list: keep, shorten or drop?
7. DORA: NAF to entity-type table, and the exact Art. 2(3) exclusions.
8. DORA: read ACPR / AMF registers in a later version?
9. All scope articles here were written from the texts as known, not yet checked line by line against EUR-Lex. Verify the same way as `frameworks/nis2.md` and `dora.md`, then add the scope articles to those files?
