#!/usr/bin/env bash
# Two company folders: northwind-bank and contoso-bank
set -euo pipefail
cp -R "@FIXTURE@/company/grc" ./grc
cp -R ./grc/northwind-bank ./grc/contoso-bank
