#!/usr/bin/env bash
# A spec with no issue behind it: build plans from the spec, and the plan's status is the state.
set -euo pipefail
cp -R "@FIXTURE@/." .
rm -rf intent
printf '# Agent instructions\n\n- This repo has no tracker, no remote and no code host.\n- Test with `npm test`, lint with `npm run lint`. There is no build step.\n' > AGENTS.md
git init -q -b main .
git config user.name eval && git config user.email eval@example.com
git add -A && git commit -qm "notes app"
