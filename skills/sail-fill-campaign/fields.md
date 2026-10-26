# Campaign fields (`POST /campaigns/v1`)

Check a field against the API reference when the tenant rejects it: https://developer.sailpoint.com/docs/api/certification-campaigns

## Every type

| Field | Required | Default when no rule | Notes |
|---|---|---|---|
| `name` | yes | `<Type> - <scope> - <YYYY-MM>` | the naming rule wins |
| `description` | yes | what is reviewed and why (audit, periodic review) | shown to reviewers |
| `type` | yes | from step 1 | `MANAGER`, `SOURCE_OWNER`, `SEARCH`, `ROLE_COMPOSITION` |
| `deadline` | no | 14 days from today, ISO 8601 (`2026-11-09T23:59:59Z`) | must be in the future |
| `emailNotificationEnabled` | no | `true` | |
| `autoRevokeAllowed` | no | `false` | `true` revokes on its own what the reviewer didn't keep at the deadline |
| `recommendationsEnabled` | no | `true` | needs AI recommendations licensed |
| `mandatoryCommentRequirement` | no | `REVOKE_ONLY_DECISIONS` | `ALL_DECISIONS`, `REVOKE_ONLY_DECISIONS`, `NO_DECISIONS` |
| `filter` | no | none | `{ "type": "CAMPAIGN_FILTER", "id": "<id>" }` or `{ "type": "RULE", "id": "<id>" }` (a certification rule); excludes access from the review |
| `correlatedStatus` | no | `CORRELATED` | `UNCORRELATED` reviews uncorrelated accounts |

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
  "description": "<what the search selects>",
  "reviewer": { "type": "IDENTITY", "id": "<id>" },
  "query": "<search query>",
  "accessConstraints": [
    { "type": "ENTITLEMENT", "ids": ["<id>"], "operator": "SELECTED" }
  ]
}
```

- `type`: `IDENTITY` (review the access of the identities the query returns) or `ACCESS` (review who has the access the query returns).
- `reviewer.type`: `IDENTITY` or `GOVERNANCE_GROUP`.
- `query` or `identityIds` (a list), not both. Test the query first: `sail api post /search/v1 --body '{"indices":["identities"],"query":{"query":"<query>"}}' --env <env>`, and show the count.
- `accessConstraints` is optional: `type` `ENTITLEMENT`, `ACCESS_PROFILE` or `ROLE`; `operator` `ALL` or `SELECTED` (with `ids`).

**ROLE_COMPOSITION**:

```json
"roleCompositionCampaignInfo": {
  "roleIds": ["<role id>"],
  "remediatorRef": { "type": "IDENTITY", "id": "<id>" },
  "reviewer": { "type": "IDENTITY", "id": "<id>" },
  "description": "<what is reviewed>"
}
```

- `remediatorRef` is required: who applies the revocations.
- `roleIds` or `query`, not both. Without `reviewer`, each role's owner reviews it.

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
