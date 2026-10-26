---
name: sail-fill-campaign
description: Fill the fields of a SailPoint Identity Security Cloud certification campaign (manager, source owner, search, role composition) from what the user wants to certify and the naming and filling rules of the project or tenant, show every field with where its value comes from, then create it with sail or walk through the UI. Use when someone wants to create, prepare or fill an ISC certification campaign or access review, or asks which campaign type fits a review.
metadata:
  author: Anas Sahel
  version: 1.0.0 # x-release-please-version
---

Turn a **certification intent** (who reviews what, and why) into a filled ISC campaign, as a **wizard**: one short screen per turn, each with your reading of the request and the next question, its options and a recommended answer. Every field carries its **origin**: `user`, `rule` (a written rule of the project), `tenant` (a pattern of existing campaigns), or `default`. Nothing is created before the user has seen the filled campaign and picked how to proceed.

A **wizard** screen:
- opens with your reading in one line ("Revue des comptes orphelins : campagne Source owner sur les comptes non corrélés"), so the user corrects it on the spot;
- asks one question, two when they're independent, with the AskUserQuestion tool: options from the tenant or the rules, recommended first, and "Other" for a correction;
- comes fast: before a screen, make only the calls its question needs; never scan the project or the tenant before the first screen.

Calls go through `sail api` with an explicit `--env`, never the CLI's current one. SailPoint's **API docs** are the reference for every call: https://developer.sailpoint.com/docs/api. Before a call, check its endpoint page there (path, scopes, body) and, for a body schema the page doesn't show, the OpenAPI spec it's built from (https://github.com/sailpoint-oss/api-specs, `idn/apis/<service>/`). Paths use per-service versioning, `/<service>/v<n>` (`/campaigns/v1`), not the legacy `/v3`, `/beta` or `/v2026` prefixes: on a 404 or a deprecation header, look up the current version in the mapping table (https://developer.sailpoint.com/docs/api/api-versioning-migration).

## Steps

1. **Read the request.** Deduce the type even from a vague request, and say it on the first screen with the env question (ask its name: `sail environment list` waits for Enter and loops forever without a terminal). Ask what the review must cover only when nothing in the request points to a type.

   | The request says | Type |
   |---|---|
   | orphan accounts, uncorrelated accounts, comptes orphelins | `SOURCE_OWNER` with `correlatedStatus: UNCORRELATED`: ISC attaches an uncorrelated account to an identity with no authoritative account, and this campaign reviews exactly those |
   | an application's or a source's access, its accounts or entitlements | `SOURCE_OWNER` |
   | each manager reviews their team, an annual access review | `MANAGER` |
   | a population (contractors, a department) or an access (admin rights, one entitlement) | `SEARCH` |
   | the content of roles | `ROLE_COMPOSITION` |

   Done when the user has confirmed the type, or corrected it, and named the env.

2. **Ask the scope.** The next screen asks what the type needs, with options read from the tenant: the sources for `SOURCE_OWNER` (`sail api get "/sources/v1?limit=250" --jsonpath "$[*].name" --env <env>`, the most likely first, from the request), the query with its count for `SEARCH`, the roles for `ROLE_COMPOSITION`, the campaign filters for `MANAGER`. Resolve each pick to an ID with an exact match; on near names (`Active Directory`, `Active Directory DEV`), show both and let the user pick. Done when the scope is a list of IDs.

3. **Fill the rest.** Read [fields.md](fields.md) for the type's fields and check them against the **API docs**; when they differ, follow the docs and say which field changed. Look for written rules on how campaigns are filled (naming, deadline, comments, auto revoke) in `AGENTS.md`, `CLAUDE.md`, `rules/` and `docs/` of the project, then in the tenant's last campaigns (`sail api get "/campaigns/v1?detail=FULL&limit=50&sorters=-created" --env <env>`), keeping only patterns seen in several. A written **rule** wins over a **tenant** pattern. Fill every field from the request, the rules, then the defaults in fields.md. Then one screen for the fields nothing filled (a reviewer, a remediator), each with a proposed value. Done when every required field has a value and an origin.

4. **Show the form.** Show the campaign as the ISC creation **form** shows it: its sections in its order, its labels and its options word for word, so the user can copy each value into the UI as is. Use the template below; every field gets a value (write a description, it's required) and its origin in a short note. Fields the form doesn't show (`recommendationsEnabled`, `sunsetCommentsRequired`, `correlatedStatus`) go in one line under it. Anything else to flag (a source whose accounts look badly correlated, a service account as owner) is one line each, after the form. Apply corrections and show it again. Done when the user accepts it.

   <form-template>
   **Campaign Details**
   - Campaign Name: <value>
   - Campaign Description: <value>
   - Email Notifications: On | Off
   - Campaign Filters: <filter name> | None

   **Campaign Reviewers**
   - Reviewer: Source Owner (<owner name>) | <the reviewer for other types>
   - Undecided Access: Maintain access to undecided items | Choose to maintain or revoke access to undecided items
   - Require Comments: No comments required | For all decisions | For decisions marked as revoked

   **Campaign Generation**
   - Campaign: Save | Generate Now | Schedule (<when>)
   - Due Date: Select due date at campaign start (<date>) | 1 week after campaign start | 2 weeks after campaign start | 30 days after campaign start
   </form-template>

   Each label maps to the API: Email Notifications `emailNotificationEnabled`, Campaign Filters `filter`, Undecided Access `autoRevokeAllowed` (`false` maintains), Require Comments `mandatoryCommentRequirement` (`NO_DECISIONS`, `ALL_DECISIONS`, `REVOKE_ONLY_DECISIONS`), Due Date the template's `deadlineDuration` (`P1W`, `P2W`, `P30D`). When the form on screen differs from this template, the form wins: follow its labels.

5. **Proceed.** Ask how to create it: **sail** or **UI**. The form builds a campaign **template**, so sail follows the Campaign choice:
   - **sail**: write the body to a temp file, show the command, run it once the user agrees (on a production env, only after an explicit yes in the previous turn). Save: `sail api post /campaign-templates/v1 --body-file <file> --env <env>`, the form's fields under `campaign`, Due Date as `deadlineDuration`. Generate Now: the same, then `sail api post /campaign-templates/v1/<id>/generate --env <env>`, which creates the campaign **staged**; poll `GET /campaigns/v1/<id>` until its status leaves `PENDING`. Schedule: the same, then `PUT /campaign-templates/v1/<id>/schedule`. Report the template's ID, and the campaign's ID and status when there is one.
   - **UI**: hand over the form above, filled. When the user wants you to fill it in their browser, call the Skill tool with `claude-in-chrome`, read each label on screen before typing, and stop before the last button.

   Activating a **staged** campaign sends emails to every reviewer and can't be undone: do it only when the user asks, with `sail api post /campaigns/v1/<id>/activate --body '{"timeZone":"<offset>"}' --env <env>` (an ISO 8601 offset such as `+01:00`; UTC when omitted). Done when the campaign exists **staged** (or activated on request), or the UI checklist is handed over.
