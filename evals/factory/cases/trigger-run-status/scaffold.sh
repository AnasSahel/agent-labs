#!/usr/bin/env bash
# Asking where things stand goes to factory-run, which shows the board.
set -euo pipefail
cp -R "@FIXTURE@/." .
git init -q -b main .
git config user.name eval && git config user.email eval@example.com
git add -A && git commit -qm "notes app"
