---
type: regex
pattern: '"status"\s*:\s*"open"'
target: { source: file, path: .grill/state.json }
---
