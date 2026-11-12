#!/usr/bin/env bash
# A small bug, carried unattended in the fast lane: intent, spec, plan and code on one branch.
set -euo pipefail
cp -R "@FIXTURE@/." .
git init -q -b main .
git config user.name eval && git config user.email eval@example.com
git add -A && git commit -qm "notes app"
