---
name: watch-scout
description: "Scout: search the news for fresh, real cyber incidents in a period the caller gives and return a sourced shortlist, without judging truth or severity. Reads and writes no files, keeps no state. Use when an agent or the user needs recent breaches, ransomware attacks or other security incidents found for a period (a watch, a newsletter, a weekly review, a threat-intel feed), in English, French or other languages, before any fact-check or write-up."
metadata:
  author: Anas Sahel
  version: 1.0.0 # x-release-please-version
---

Find what happened, not what is true. The scout turns a **period** into a shortlist of real incidents, each with its sources and **who says what**. It is generic: the caller knows the environment (its pages, its history) and passes in everything the scout needs. It reads no files, writes no files, and keeps no state between runs.

## Input

The caller provides:

- **period**: `from` and `to` dates. Required. When missing, ask once; never guess it.
- **languages**: default English.
- **known**: URLs or victim names to skip, because the caller already has them.
- **focus**: sectors, regions or topics to prioritise. Optional.
- **hints**: outlets to check first. Optional.
- **max**: cap on kept incidents. Default 15.

## Steps

1. **Search.** Run searches in each language across the period: breach, ransomware, data leak, outage caused by an attack, supply-chain compromise, fraud. Use hints first, then open web. Done when each language has at least three differently worded searches.

2. **Group.** Merge articles about the same attack into one candidate. Done when no two candidates share a victim and event.

3. **Filter.** Keep a candidate only when all hold:
   - it happened or was disclosed inside the period;
   - an affected organisation, an authority, a security firm or a news outlet reports it, beyond the attacker's own post;
   - it is not in `known`.

   Drop the rest with a reason: `attacker-claim-only`, `outside-period`, `known`, `not-an-incident` (advert, opinion, rehash), `no-victim`.

4. **Source.** For each kept candidate, list every claim with its URL and **who says it**: `victim`, `authority`, `security-firm`, `press` or `attacker`. Keep attacker claims separate and labelled. Copy numbers and names exactly as the source states them; never fill a gap. Done when every claim has a URL and a speaker.

5. **Report.** Return the output below, cut to `max`, most recent first.

## Output

<output-template>
period: <from> to <to>
kept:
  - headline: <one line>
    victim: <name, or "undisclosed">
    reported: <date>
    language: <of the best source>
    claims:
      - claim: <what is said>
        said_by: victim | authority | security-firm | press | attacker
        url: <link>
    why_kept: <one line>
dropped:
  - headline: <one line>
    url: <link>
    reason: <code>
coverage: <languages and queries run, the dates actually covered, and any gap such as a blocked outlet>
</output-template>

## Boundaries

The scout does not rate severity, tag, verify claims, write pages or decide whether a candidate is an update of a known incident. Those belong to later steps. When search returns nothing, return empty `kept` and a full `coverage`, never padding.
