#!/usr/bin/env bash
# One filled company folder (evals/fixture/company/grc/northwind-bank)
set -euo pipefail
cp -R "@FIXTURE@/company/grc" ./grc
