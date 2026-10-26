---
name: sail-fill-campaign
description: Fill the fields of a SailPoint Identity Security Cloud certification campaign (manager, source owner, search, role composition) from what the user wants to certify and the naming and filling rules of the project or tenant, show every field with where its value comes from, then create it with sail or walk through the UI. Use when someone wants to create, prepare or fill an ISC certification campaign or access review, or asks which campaign type fits a review.
metadata:
  author: Anas Sahel
  version: 1.0.0 # x-release-please-version
---

Turn a **certification intent** (who reviews what, and why) into a filled ISC campaign. Every field carries its **origin**: `user`, `rule` (a written rule of the project), `tenant` (a pattern of existing campaigns), or `default`. Nothing is created before the user has seen the filled campaign and picked how to proceed.

Calls go through `sail api` with an explicit `--env`, never the CLI's current one. Paths use SailPoint's per-service versioning, `/<service>/v<n>` (`/campaigns/v1`), not the legacy `/v3`, `/beta` or `/v2026` prefixes: on a 404 or a deprecation header, look up the service's current version in the mapping table (https://developer.sailpoint.com/docs/api/api-versioning-migration).

## Steps

1. **Pin the intent.** When the request says what to certify, deduce the type; otherwise ask what the review must cover, then deduce it:

   | The user wants | Type |
   |---|---|
   | each manager to review their team's access | `MANAGER` |
   | the owner of one or more sources to review its accounts and entitlements | `SOURCE_OWNER` |
   | a population or an access picked by a query (a department, contractors, one entitlement) reviewed by a named reviewer | `SEARCH` |
   | the content of roles reviewed (which access each role grants) | `ROLE_COMPOSITION` |

   Ask also for the env when it's not stated. Done when the type is confirmed in one line ("Manager campaign, because…") and the env is known.

2. **Read the rules.** Look for written rules on how campaigns are filled, first in the project: `AGENTS.md`, `CLAUDE.md`, `rules/`, `docs/`, and any file matching `campaign|certification|campagne|revue`. Then in the tenant: existing campaigns (`sail api get "/campaigns/v1?detail=FULL&limit=50&sorters=-created" --env <env>`), templates (`/campaign-templates/v1`) and campaign filters (`/campaign-filters/v1`). From the tenant, keep only patterns seen in several campaigns: naming, deadline length, comment requirement, auto revoke, notifications. A written **rule** wins over a **tenant** pattern; say so when they disagree. Done when you can list each rule found with its file or the campaigns it comes from, or say none exist.

3. **Fill.** Read [fields.md](fields.md) for the type's fields. Fill each from the intent, then the rules, then the defaults there. Resolve every name to an ID (source, role, reviewer, governance group, filter, remediator) with an exact match; on zero or several matches, ask, never pick. Ask every required field still empty in one batch. Done when every required field has a value and an origin.

4. **Show.** Present one table: field, value, origin, plus the rules applied and anything that departs from them. Apply corrections and show it again. Done when the user accepts it.

5. **Proceed.** Ask how to create it: **sail** or **UI**.
   - **sail**: write the body to a temp file, show the command, run it once the user agrees (on a production env, only after an explicit yes in the previous turn): `sail api post /campaigns/v1 --body-file <file> --env <env>`. The campaign is created **staged**: poll `GET /campaigns/v1/<id>` until its status leaves `PENDING`, then report its ID and status.
   - **UI**: list the fields screen by screen in the order the creation form asks for them (Certifications > Campaigns > create), each with its value. When the user wants you to fill the form in their browser, call the Skill tool with `claude-in-chrome`, read each label on screen before typing, and stop before the last button.

   Activating a **staged** campaign sends emails to every reviewer and can't be undone: do it only when the user asks, with `sail api post /campaigns/v1/<id>/activate --body '{"timeZone":"<offset>"}' --env <env>` (an ISO 8601 offset such as `+01:00`; UTC when omitted). Done when the campaign exists **staged** (or activated on request), or the UI checklist is handed over.
