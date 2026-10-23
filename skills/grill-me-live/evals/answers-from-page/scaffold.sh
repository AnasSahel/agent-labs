#!/usr/bin/env bash
# Round 1 of a habit-tracker session, answered on the page and sent.
set -euo pipefail
mkdir -p .grill
cat > .grill/state.json <<'JSON'
{
  "session": { "topic": "A habit tracker app just for myself", "round": 1, "status": "grilling" },
  "nodes": {
    "why": { "title": "Why build instead of using an existing app?", "recommendation": "Own your data, exactly your workflow, fun to build", "status": "open", "parent": null, "round": 1, "q": 1, "seq": 1 },
    "form": { "title": "Web app, CLI, or phone?", "recommendation": "A local web app that works on a phone screen", "status": "open", "parent": null, "round": 1, "q": 2, "seq": 2 },
    "types": { "title": "What counts as a habit?", "recommendation": "Done/not done only for v1", "status": "open", "parent": null, "round": 1, "q": 3, "seq": 3 },
    "schedule": { "title": "Daily or flexible schedules?", "recommendation": "Support daily and x times per week", "status": "open", "parent": null, "round": 1, "q": 4, "seq": 4 },
    "streaks": { "title": "How streaks work", "status": "waiting", "blockedBy": "Q3 · Q4", "parent": "types", "seq": 5 },
    "reminders": { "title": "Reminders", "status": "waiting", "blockedBy": "Q2 · platform", "parent": "form", "seq": 6 },
    "storage": { "title": "Where data lives", "status": "waiting", "blockedBy": "Q1 · Q2", "parent": "why", "seq": 7 }
  },
  "events": [
    { "seq": 1, "round": 1, "kind": "started", "text": "Session started", "at": "2026-10-23T12:00:00Z" },
    { "seq": 2, "round": 1, "kind": "asked", "text": "Round 1: asked 4 questions, 3 waiting", "at": "2026-10-23T12:00:05Z" }
  ]
}
JSON
cat > .grill/answers.json <<'JSON'
{
  "round": 1,
  "submittedAt": "2026-10-23T12:05:00Z",
  "answers": {
    "why": { "choice": "accept", "text": "", "at": "2026-10-23T12:03:00Z" },
    "form": { "choice": "answer", "text": "A phone-first PWA I can add to my home screen; no CLI", "at": "2026-10-23T12:03:30Z" },
    "types": { "choice": "accept", "text": "", "at": "2026-10-23T12:04:00Z" },
    "schedule": { "choice": "drop", "text": "Everything is daily for me", "at": "2026-10-23T12:04:30Z" }
  }
}
JSON
