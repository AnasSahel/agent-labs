#!/usr/bin/env bash
# A part that comes after another waits until that one is built.
set -euo pipefail
cp -R "@FIXTURE@/." .
sed -i.bak 's/^status: designed$/status: split/' intent/001-list-newest-first.md && rm intent/001-list-newest-first.md.bak
cat >> specs/001-list-newest-first.md <<'MD'

## Proposed split

| Part | Title | Criteria | Findings | Size | After |
|---|---|---|---|---|---|
| 003 | The newest note comes first | AC1 | none | S | none |
| 004 | The list can be limited | AC2 | none | S | 003 |
MD
for p in "003|newest-note-comes-first|The newest note comes first|People who just added a note find it at the bottom of the list." "004|list-can-be-limited|The list can be limited|People with many notes can't see only the last few."; do
  IFS='|' read -r id slug title problem <<<"$p"
  cat > "intent/$id-$slug.md" <<MD
---
issue: $id
parent: 001
title: $title
source: user
kind: improvement
priority: normal
size: S
status: designed
---

# $title

## Problem

$problem
MD
done
git init -q -b main .
git config user.name eval && git config user.email eval@example.com
git add -A && git commit -qm "notes app"
