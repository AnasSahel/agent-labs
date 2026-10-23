---
type: regex
pattern: '"session"\s*:\s*\{[^}]*"round"\s*:\s*1\b'
target: { source: file, path: .grill/state.json }
---
