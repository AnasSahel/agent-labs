---
name: incident-fact-check
description: "Fact-check a cyber incident candidate before anything is written: open every cited source, confirm it really says the claim, grade each claim verified, unverified, contradicted or not found at source, mark attacker claims \"(unverified)\", and decide pass, hold or reject. Never fills a gap. Use when an incident from a scout, a news link or a draft page needs its claims checked, before writing it up or publishing it, or when new facts arrive for an incident already written."
arguments: candidate sources
metadata:
  author: Anas Sahel
  version: 1.0.0 # x-release-please-version
---

Decide what can be said, never what is nice to say. Each claim of an incident gets a **verdict** from its own source, and the incident gets a **decision**. You only judge: you never write the page and never fix a claim.

`candidate` is one incident: headline, victim, and claims each with a URL and who said it (victim, authority, security-firm, press, attacker). It can be the scout's `kept` entry, or a page or a link to read first. `sources` are extra links worth trusting. Several candidates: check each alone.

## Steps

1. **Open.** Fetch every cited URL, plus `sources`. Done when each URL is read, or marked `unreachable`.

2. **Match.** Look for the claim in its source. It matches only when the numbers, names and dates are the same; a rounded or merged figure does not match. Done when each claim has the sentence that supports it, quoted in a few words, or `not found`.

3. **Grade the source.** A claim is **solid** when one of these states it first-hand:
   - the victim (statement, filing, status page);
   - an authority (CERT, regulator, police, court);
   - a security firm that analysed it itself.

   Press is solid only as two outlets that reached the fact independently; copies of one origin count once. An attacker is never solid.

4. **Grade the claim.**
   - `verified`: matches a solid source.
   - `unverified`: matches only press once, or an attacker. Attacker claims are always labelled `(unverified)`.
   - `contradicted`: a solid source says otherwise. Quote it.
   - `not-at-source`: the cited page does not say it.

5. **Decide.**
   - `pass`: a solid source confirms the incident happened, names the victim, and the key facts are verified.
   - `hold`: the incident is solid but some facts are not. List them as `not public yet`. A victim named only by an attacker or a single press source also holds, with the victim as `undisclosed`.
   - `reject`: no solid source confirms the incident, or the victim or an authority denies it.

   Done when every claim has a verdict and the decision follows from them.

## Output

<output-template>
incident: <headline>
decision: pass | hold | reject
reason: <one line>
victim: <name, or "undisclosed" with why>
claims:
  - claim: <text>
    verdict: verified | unverified | contradicted | not-at-source
    source: <url of the source that settles it>
    evidence: <few quoted words, or "not found">
not_public_yet:
  - <fact that stays open>
</output-template>

Report only what the sources state. When two sources differ, report both as they are; never average, round or merge them.
