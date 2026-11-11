#!/usr/bin/env bash
# 'Plan issue 001 and build it' goes to factory-build, never to factory-plan: the word plan belongs to one skill.
set -euo pipefail
cp -R "@FIXTURE@/." .
git init -q -b main .
git config user.name eval && git config user.email eval@example.com
git add -A && git commit -qm "notes app"
