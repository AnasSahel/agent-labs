# Campaign fields (`POST /campaigns/v1`)

A snapshot of the API, checked against SailPoint's docs on 2026-10-26. The docs win when they differ: the endpoint page (https://developer.sailpoint.com/docs/api/create-campaign-v-1) for the path, scopes and responses, and the OpenAPI spec it's built from (https://github.com/sailpoint-oss/api-specs/tree/main/idn/apis/certification-campaigns, `schemas/campaign-2.yaml` and `schemas/slimcampaign.yaml`) for the body, since the page loads the schema dynamically.

Caller: `ORG_ADMIN` or `CERT_ADMIN`, token scope `idn:campaign:manage`, plus `idn:campaign-filter:read` when the body sets `filter`. Answer `202`: the campaign is accepted, created `PENDING`, then `STAGED`.

## Every type

| Field | Required | API default | Proposed when no rule | Notes |
|---|---|---|---|---|
| `name` | yes | | `<Type> - <scope> - <YYYY-MM>` | the naming rule wins |
| `description` | yes | | what is reviewed and why (audit, periodic review) | shown to reviewers |
| `type` | yes | | from step 1 | `MANAGER`, `SOURCE_OWNER`, `SEARCH`, `ROLE_COMPOSITION` (`MACHINE_ACCOUNT` exists, out of scope) |
| `deadline` | no | | 14 days from today, ISO 8601 (`2026-11-09T23:59:59Z`) | must be in the future at activation, else `400` |
| `emailNotificationEnabled` | no | `false` | `true` | |
| `autoRevokeAllowed` | no | `false` | `false` | `true` revokes on its own what the reviewer didn't keep at the deadline |
| `recommendationsEnabled` | no | `false` | `true` | accepted even without AI recommendations licensed |
| `mandatoryCommentRequirement` | no | no comment required | `REVOKE_ONLY_DECISIONS` | `ALL_DECISIONS`, `REVOKE_ONLY_DECISIONS`, `NO_DECISIONS` |
| `sunsetCommentsRequired` | no | `true` | `true` | comment required when a reviewer changes a sunset date |
| `filter` | no | the tenant's default campaign filter | none | `{ "type": "CAMPAIGN_FILTER", "id": "<id>" }`, the only type; excludes access from the review |
| `correlatedStatus` | no | | `CORRELATED` | `UNCORRELATED` only for `SOURCE_OWNER`: reviews identities with no account on an authoritative source |

## Per type

**MANAGER**: nothing more. Narrow the population with `filter`.

**SOURCE_OWNER**:

```json
"sourceOwnerCampaignInfo": { "sourceIds": ["<source id>"] }
```

**SEARCH**:

```json
"searchCampaignInfo": {
  "type": "IDENTITY",
  "description": "<the query and how many identities it selects>",
  "reviewer": { "type": "IDENTITY", "id": "<id>" },
  "query": "<search query>",
  "accessConstraints": [
    { "type": "ENTITLEMENT", "ids": ["<id>"], "operator": "SELECTED" }
  ]
}
```

- `type` is required: `IDENTITY` (review the access of the identities the query returns) or `ACCESS` (review who has the access the query returns).
- `reviewer` is optional: when set, `IDENTITY` or `GOVERNANCE_GROUP` reviews every certification.
- `query` or `identityIds` (a list): one of them is required. Test the query first: `sail api post /search/v1 --body '{"indices":["identities"],"query":{"query":"<query>"}}' --env <env>`, and show the count.
- `accessConstraints` is optional (up to 1000): `type` `ENTITLEMENT`, `ACCESS_PROFILE` or `ROLE` and `operator` `ALL` or `SELECTED` are required, `ids` with `SELECTED`.

**ROLE_COMPOSITION**:

```json
"roleCompositionCampaignInfo": {
  "roleIds": ["<role id>"],
  "remediatorRef": { "type": "IDENTITY", "id": "<id>" },
  "reviewer": { "type": "IDENTITY", "id": "<id>" },
  "description": "<what is reviewed>"
}
```

- `remediatorRef` is required: the identity that gets a remediation task for each revoke, a Role Admin or an Org Admin.
- `roleIds` or `query`, not both; neither includes every role.
- `reviewer` (`IDENTITY` or `GOVERNANCE_GROUP`) is optional; `reviewerId` is deprecated, never set it.

## Lookups

| Name to resolve | Call |
|---|---|
| identity | `sail api get "/public-identities/v1?filters=email eq \"<email>\"" --env <env>` |
| governance group | `sail api get "/workgroups/v1?filters=name eq \"<name>\"" --env <env>` |
| source | `sail api get "/sources/v1?filters=name eq \"<name>\"" --env <env>` |
| role | `sail api get "/roles/v1?filters=name eq \"<name>\"" --env <env>` |
| campaign filter | `sail api get /campaign-filters/v1 --env <env>`, match on `name` |

## Recurring review

When the user wants the review to repeat (every quarter, every year), say that a campaign is one-shot and that a template with a schedule repeats it (`/campaign-templates/v1`, then `/campaign-templates/v1/<id>/schedule`); fill the same fields in the template and ask which they want.
