#!/usr/bin/env bash
# A new request to build end to end goes to factory-run.
set -euo pipefail
cp -R "@FIXTURE@/." .
git init -q -b main .
git config user.name eval && git config user.email eval@example.com
git add -A && git commit -qm "notes app"
