#!/usr/bin/env bash
# No issue and no intent: design still writes a spec, numbered from specs/, and its status is the state.
set -euo pipefail
cp -R "@FIXTURE@/." .
rm -rf intent
printf '# Agent instructions\n\n- This repo has no tracker, no remote and no code host.\n- Test with `npm test`, lint with `npm run lint`. There is no build step.\n' > AGENTS.md
rm -rf specs
git init -q -b main .
git config user.name eval && git config user.email eval@example.com
git add -A && git commit -qm "notes app"
