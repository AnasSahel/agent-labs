#!/usr/bin/env bash
# 'Spec out intent 002' goes to factory-design.
set -euo pipefail
cp -R "@FIXTURE@/." .
git init -q -b main .
git config user.name eval && git config user.email eval@example.com
git add -A && git commit -qm "notes app"
