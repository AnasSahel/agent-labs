---
name: threat-actors-sources
purpose: Sourced example groups per sector for the threat actors section, from MITRE ATT&CK
status: draft. Source checked 2026-11-11. NOT yet cross-checked with ANSSI / CERT-FR (blocked in the build session), so French relevance is unknown
---

# Example groups per sector (MITRE ATT&CK)

Source: MITRE ATT&CK Enterprise, v20.1 (collection modified 2026-11-05), `intrusion-set` objects, STIX data from `github.com/mitre-attack/attack-stix-data`. Every row below is backed by the group's own ATT&CK description (quoted in short). Page: `https://attack.mitre.org/groups/<ID>/`.

How to use: in the profile's threat actors table, pick the example for an actor type from this file, write "(example: NAME, ATT&CK ID)". Add no group that is not in this file. If a sector has no row, write the type with no example.

**What this source does not say:** how often a group hits French companies, or whether it is active today. ATT&CK describes known behaviour, mostly from US, Asian and English-language reporting. Say "France relevance to confirm" in the profile.

## Rows

| Sector signal | Actor type | Example (ATT&CK ID) | Support from the description |
|---|---|---|---|
| Banking, payment, e-money | FIN | Carbanak (G0008) | Targets financial institutions since at least 2013 |
| Banking, payment, e-money | FIN | FIN7 (G0046) | Targeted retail, hospitality, financial services, software and more; financially motivated |
| Banking, crypto | DPRK | APT38 (G0082) | DPRK state group for financial operations: banks, SWIFT endpoints, ATMs, crypto exchanges |
| Retail, hospitality, cards | FIN | FIN6 (G0037) | Stole payment card data, attacked PoS systems in hospitality and retail |
| Retail, hospitality, insurance | FIN | FIN8 (G0061) | Hospitality, retail, insurance, technology, financial sectors |
| Telecom, IT services, BPO | RW / extortion | Scattered Spider (G1015) | Native English-speaking crime group: CRM and BPO providers, telecom, technology, then hospitality, retail and more; social engineering |
| Any size, social engineering | RW / extortion | LAPSUS$ (G1004) | Large-scale social engineering and extortion, including destructive attacks |
| Healthcare | RW | INC Ransom (G1032) | Ransomware and extortion, mostly industrial, healthcare and education in the US and Europe |
| Healthcare, critical infrastructure | RW | Play (G1040) | Double extortion against business, government, critical infrastructure, healthcare, media in Europe and the Americas |
| Healthcare | RW | Wizard Spider (G0102) | Ransomware against corporations and hospitals |
| Healthcare | APT | Orangeworm (G0071) | Targeted healthcare in the US, Europe and Asia, likely corporate espionage |
| Any, VPN credentials | RW | Akira (G1024) | Ransomware using compromised credentials on single-factor VPNs |
| Any, help-desk phishing | RW | Storm-1811 (G1046) | Black Basta-linked; email flooding then fake help-desk contact |
| Telecom | APT | Salt Typhoon (G1045) | PRC state group: network edge devices of telecom and ISP providers |
| Telecom, tech, edge devices | APT | UNC3886 (G1048) | China-nexus: defense, technology, telecom; edge and virtualisation devices |
| Technology, healthcare, finance, telecom | APT | APT41 (G0096) | Chinese state espionage plus financially motivated operations; healthcare, telecom, tech, finance, retail |
| Energy, transport, critical infrastructure | APT | Sandworm Team (G0034) | Destructive group attributed to Russia's GRU |
| Energy, critical infrastructure | APT | Volt Typhoon (G1017) | PRC state actor pre-positioning in critical infrastructure |
| Energy, aviation | APT | APT33 (G0064) | Suspected Iranian; aviation and energy sectors |
| Finance, energy, telecom, chemical | APT | OilRig (G0049) | Suspected Iranian; supply chain attacks leveraging trust relationships |
| IT, cloud, software supply chain | APT | HAFNIUM (G0125) | China-based; many US sectors, including defence contractors and law firms |
| Pharma, research | APT | Turla (G0010) | Russia FSB; government, embassies, research, pharmaceutical |
| Banking, any | RW | Indrik Spider (G0119) | Russia-based; Dridex banking trojan then ransomware |

## Verification notes
- Descriptions were read for each row on 2026-11-11. "Support" is a paraphrase, not a quote; check the ATT&CK page for the exact wording before citing it to a client.
- ATT&CK versions change. Re-check the version before reusing this file.
- Open: add ANSSI / CERT-FR reports (French sector relevance) once reachable. Add ENISA threat landscape for EU context.
