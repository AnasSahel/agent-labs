#!/usr/bin/env bash
# Notes sample app (evals/fixture/notes-app)
set -euo pipefail
cp -R "@FIXTURE@/notes-app/." .
mkdir -p intent specs
