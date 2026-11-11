#!/usr/bin/env bash
# The spec is on the default branch at designed but the issue still says needs-design: build heals the state and plans.
set -euo pipefail
cp -R "@FIXTURE@/." .
sed -i.bak 's/^status: designed$/status: needs-design/' intent/001-list-newest-first.md && rm intent/001-list-newest-first.md.bak
git init -q -b main .
git config user.name eval && git config user.email eval@example.com
git add -A && git commit -qm "notes app"
