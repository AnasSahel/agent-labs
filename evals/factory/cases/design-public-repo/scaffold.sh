#!/usr/bin/env bash
# On a public repo no finding reaches the spec, but the questions stay, reworded as plain decisions.
set -euo pipefail
cp -R "@FIXTURE@/." .
printf '%s\n' '- This repository is public.' >> AGENTS.md
git init -q -b main .
git config user.name eval && git config user.email eval@example.com
git add -A && git commit -qm "notes app"
