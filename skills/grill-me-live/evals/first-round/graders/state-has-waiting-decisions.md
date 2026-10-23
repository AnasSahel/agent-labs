---
type: regex
pattern: '"status"\s*:\s*"waiting"[^}]*"blockedBy"|"blockedBy"[^}]*"status"\s*:\s*"waiting"'
target: { source: file, path: .grill/state.json }
---
