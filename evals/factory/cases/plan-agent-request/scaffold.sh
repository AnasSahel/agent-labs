#!/usr/bin/env bash
# A request from another agent, with the files tracker and no code host: nothing is asked, the intent is committed at needs-go.
set -euo pipefail
cp -R "@FIXTURE@/." .
git init -q -b main .
git config user.name eval && git config user.email eval@example.com
git add -A && git commit -qm "notes app"
