#!/usr/bin/env bash
# A lesson marked for design in factory/lessons.md shapes the spec.
set -euo pipefail
cp -R "@FIXTURE@/." .
rm -rf intent specs
printf '# Agent instructions\n\n- This repo has no tracker, no remote and no code host.\n- Test with `npm test`, lint with `npm run lint`. There is no build step.\n' > AGENTS.md
mkdir -p factory
cat > factory/lessons.md <<'MD'
# Lessons

| Lesson | For | From | Seen |
|---|---|---|---|
| Every command that prints something also takes `--json` and prints the same data as JSON | design | 001 | 1 |
MD
git init -q -b main .
git config user.name eval && git config user.email eval@example.com
git add -A && git commit -qm "notes app"
