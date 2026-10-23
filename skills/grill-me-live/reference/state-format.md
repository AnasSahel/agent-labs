# `.grill/state.json`

You own this file. Rewrite the whole file each round; the page redraws within a second. Write valid JSON: the page keeps showing the last good version until the file parses again.

```json
{
  "session": {
    "topic": "Build an AI newsletter",
    "summary": "One or two sentences on what the user wants to make concrete.",
    "round": 2,
    "status": "grilling"
  },
  "nodes": {
    "what": {
      "title": "About AI, made by AI, or both?",
      "question": "The full question as you asked it in chat.",
      "recommendation": "Both: about AI, drafted by AI, edited by you",
      "answer": "Both: about AI, drafted by AI, edited by you",
      "status": "settled",
      "parent": null,
      "round": 1,
      "q": 1,
      "seq": 1
    },
    "money": {
      "title": "How it makes money",
      "status": "dropped",
      "reason": "Later: audience comes first (Q2)",
      "parent": "why",
      "seq": 6
    },
    "audience": {
      "title": "Narrow niche or general AI news?",
      "question": "…",
      "recommendation": "A narrow niche: AI for one profession you know",
      "status": "open",
      "parent": "why",
      "round": 2,
      "q": 1,
      "seq": 5
    },
    "sources": {
      "title": "Where stories come from",
      "status": "waiting",
      "blockedBy": "Q1 · niche",
      "parent": "audience",
      "seq": 7
    },
    "substack-api": {
      "title": "Can Substack send automatically?",
      "recommendation": "Checking whether Substack can publish posts programmatically",
      "status": "research",
      "parent": "platform",
      "round": 3,
      "seq": 17
    }
  },
  "events": [
    { "seq": 1, "round": 1, "kind": "started", "text": "Session started", "at": "2026-10-23T12:40:00Z" },
    { "seq": 2, "round": 1, "kind": "asked", "text": "Round 1: asked 4 questions, 6 waiting", "at": "2026-10-23T12:40:05Z" }
  ]
}
```

## `session`

| field | meaning |
|---|---|
| `topic` | The idea, in the user's words. Shown as the root of the tree. |
| `summary` | Optional. Shown when the root is clicked. |
| `round` | The current round number. Bump it every time you post a new round: answers saved on the page belong to one round, and a new number clears them. |
| `status` | `grilling` while rounds continue; `confirming` once the frontier is empty and you have asked the user to confirm shared understanding; `done` after they confirm. |

## `nodes`

Keyed by a stable id (lowercase, `a-z 0-9 -`). Never reuse or delete an id: a decision that no longer applies is `dropped`, so the history stays visible.

| field | meaning |
|---|---|
| `title` | Short label for the card, about 40 characters. |
| `question` | The full question. Shown in the detail panel. |
| `recommendation` | Your recommended answer, about 80 characters on the card. When the user presses Accept, this is their answer. For `research`, say what you are looking up. |
| `answer` | The settled answer, in the user's terms. |
| `reason` | Why it was dropped. |
| `status` | One of the five below. |
| `parent` | The id of the decision this one hangs off, or `null` for a top-level decision. Descendants of a dropped node are shown as pruned automatically. |
| `round`, `q` | The round it was asked in and its number in that round (`Q1`, `Q2`…). Set both when a node becomes `open`. |
| `seq` | Creation order. Sorts siblings. |
| `blockedBy` | For `waiting`: what it waits on, e.g. `Q1 · niche`. |

### Statuses

| status | when |
|---|---|
| `open` | On the frontier this round: asked in chat, answerable on the page. |
| `waiting` | Known decision whose prerequisites aren't settled yet. |
| `research` | A fact you (or a sub-agent) are looking up. Don't ask the user. |
| `settled` | Decided. Set `answer`. |
| `dropped` | Out of scope, rejected or made moot. Set `reason`. |

## `events`

Append-only activity log, newest shown first. `kind` is one of `started`, `asked`, `answered`, `dropped`, `research`, `found`, `reopened`, `done`, `note`. Keep `seq` increasing. One event per meaningful change is plenty; the page shows the latest 80.

## `answers.json` (the page owns this)

Don't edit it by hand. Read it with `grill.mjs wait` or `grill.mjs answers`, which print each answer with its question. `--consume` (and every `wait`) archives the round to `.grill/history/` and clears it.
