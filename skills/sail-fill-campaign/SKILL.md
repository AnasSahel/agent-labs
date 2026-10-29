---
name: sail-fill-campaign
description: Fill the fields of a SailPoint Identity Security Cloud certification campaign (manager, source owner, search, role composition) from what the user wants to certify and the naming and filling rules of the project or tenant, show every field with where its value comes from, then hand over the sail commands to run, or the filled form for the UI. Use when someone wants to create, prepare or fill an ISC certification campaign or access review, or asks which campaign type fits a review.
metadata:
  author: Anas Sahel
  version: 1.0.0 # x-release-please-version
---

Turn a **certification intent** (who reviews what, and why) into a filled ISC campaign, as a **wizard**: one short screen per turn, each with your reading of the request and the next question, its options and a recommended answer. Every field carries its **origin**: `user`, `rule` (a written rule of the project), `tenant` (a pattern of existing campaigns), or `default`. Nothing is created before the user has seen the filled campaign and picked how to proceed.

A **wizard** screen:
- opens with your reading in one line ("Revue des comptes orphelins : campagne Source owner sur les comptes non corrélés"), so the user corrects it on the spot;
- asks one question, two when they're independent, with the AskUserQuestion tool: options from the tenant or the rules, recommended first, and "Other" for a correction;
- comes fast: before a screen, make only the calls its question needs; never scan the project or the tenant before the first screen.

Calls go through `sail api` with an explicit `--env`, never the CLI's current one. Pass query parameters with `-q 'key=value'`, one per parameter: sail encodes them, while spaces and quotes typed in the path (`?filters=name eq "x"`) get a `400`. Put `--jsonpath` in single quotes (zsh reads `$[` in double quotes as arithmetic), and add `2>/dev/null` when you only need the jsonpath result: sail also prints the whole response on stderr. To count without paging, add `-q count=true -q limit=1 --debug` and read the `X-Total-Count` header. SailPoint's **API docs** are the reference for every call: https://developer.sailpoint.com/docs/api. Before a call, check its endpoint page there (path, scopes, body) and, for a body schema the page doesn't show, the OpenAPI spec it's built from (https://github.com/sailpoint-oss/api-specs, `idn/apis/<service>/`). Paths use per-service versioning, `/<service>/v<n>` (`/campaigns/v1`), not the legacy `/v3`, `/beta` or `/v2026` prefixes: on a 404 or a deprecation header, look up the current version in the mapping table (https://developer.sailpoint.com/docs/api/api-versioning-migration).

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

2. **Ask the scope.** The next screen asks what the type needs, with options read from the tenant: the sources for `SOURCE_OWNER` (`sail api get /sources/v1 -q limit=250 --env <env> --jsonpath '$[*].name' 2>/dev/null`, the most likely first, from the request), the query with its count for `SEARCH`, the roles for `ROLE_COMPOSITION`, the campaign filters for `MANAGER`. Resolve each pick to an ID with an exact match; on near names (`Active Directory`, `Active Directory DEV`), show both and let the user pick. For a `SOURCE_OWNER` review of an application, ask on the same screen whether it covers its correlated accounts (recommended) or its orphans, with both counts (`/accounts/v1`, `-q 'filters=sourceId eq "<id>" and uncorrelated eq true'`, counted as above). Done when the scope is a list of IDs.

3. **Fill the rest.** Read [fields.md](fields.md) for the type's fields and check them against the **API docs**; when they differ, follow the docs and say which field changed. Look for written rules on how campaigns are filled (naming, deadline, comments, auto revoke) in `AGENTS.md`, `CLAUDE.md`, `rules/` and `docs/` of the project, then in the tenant's last campaigns (`sail api get "/campaigns/v1?detail=FULL&limit=50&sorters=-created" --env <env>`), keeping only patterns seen in several. A written **rule** wins over a **tenant** pattern. Fill every field from the request, the rules, then the defaults in fields.md. Then one screen for the fields nothing filled (a reviewer, a remediator), each with a proposed value. Done when every required field has a value and an origin.

4. **Show the form.** Show the campaign as the ISC creation **form** shows it: its sections in its order, its labels and its options word for word, so the user can copy each value into the UI as is. Use the template below; every field gets a value (write a description, it's required) and its origin in a short note. Fields the form doesn't show (`recommendationsEnabled`, `sunsetCommentsRequired`, `correlatedStatus`) go in one line under it. Anything else to flag is one line each, after the form, with what to do about it. Check at least:
   - **the reviewer is a person**: a source owner or reviewer that is a service account (a technical name, an `@sailpoint.com` email, an unregistered identity) means nobody reviews; propose changing the source owner first, naming the source's `managementWorkgroup` when it has one;
   - **the filter keeps the scope**: a campaign filter taken from a rule or the tenant's habits can remove what the campaign targets (a filter excluding uncorrelated identities empties an orphan review); drop it, say why;
   - **the orphans are orphans**: when most of a source's accounts are uncorrelated (more than half), correlation is likely broken; say so before the review sends thousands of false orphans to the reviewer. Apply corrections and show it again. Done when the user accepts it.

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

5. **Hand over the commands.** Ask how the user will create it: **sail** or **UI**. Either way, the user runs the writes: never run a `post`, `put` or `patch` yourself.
   - **sail**: generate the **commands** and show them, one per `bash` block, in the order to run, each under one line saying what it does. Each one runs as is, from any folder: an explicit `--env`, the body inline in a quoted heredoc (no temp file to keep), placeholders only for an ID an earlier command returns, named after it (`<template-id>`). The form builds a campaign **template**, so the commands follow the Campaign choice:

     <commands-template>
     # 1. Create the template (every choice). The form's fields go under "campaign", Due Date as "deadlineDuration".
     sail api post /campaign-templates/v1 --env <env> --jsonpath '$.id' --body "$(cat <<'JSON'
     { "name": "...", "description": "...", "deadlineDuration": "P1W", "campaign": { ... } }
     JSON
     )"

     # 2a. Generate Now: generate the campaign from the template; it's created staged. Returns the campaign's ID.
     sail api post /campaign-templates/v1/<template-id>/generate --env <env> --jsonpath '$.id'

     # 2b. Schedule: set the template's schedule.
     sail api put /campaign-templates/v1/<template-id>/schedule --env <env> --body '<schedule>'

     # 3. Check: the campaign's status leaves PENDING for STAGED.
     sail api get /campaigns/v1/<campaign-id> --env <env> --jsonpath '$.status' 2>/dev/null
     </commands-template>

     Show only the blocks the Campaign choice needs. The template's campaign `name` and `description` treat `%` as a date placeholder at generation (`%Y` gives the year): write a literal `%` as `%%`. Activation comes last, in its own block, behind one line warning that it sends emails to every reviewer and can't be undone: `sail api post /campaigns/v1/<campaign-id>/activate --env <env> --body '{"timeZone":"+01:00"}'` (an ISO 8601 offset; UTC when omitted).
   - **UI**: hand over the form above, filled. When the user wants you to fill it in their browser, call the Skill tool with `claude-in-chrome`, read each label on screen before typing, and stop before the last button.

   Done when the commands, or the filled form, are handed over.
