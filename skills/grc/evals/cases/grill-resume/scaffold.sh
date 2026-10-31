#!/usr/bin/env bash
# Acme Pay sample org (evals/fixture/grc), plus an in-progress grill trace
set -euo pipefail
cp -R "@FIXTURE@/grc" ./grc
cat > grc/traces/2026-10-31-backup-scope.md <<'MD'
---
topic: Backup policy scope
date: 2026-10-31
caller: standalone
intensity: light
status: in progress
subject: which systems the backup policy covers and how often they are backed up
framework: ISO 27001:2022, NIS2, DORA, GDPR
---

| # | Field | Question | Recommended (citation) | Answer | Settled by |
|---|---|---|---|---|---|
| Q1 | Scope | Does the backup policy cover AWS production and Microsoft 365? | Yes, both (ISO 27001 A.8.13) | yes | yes |
| Q2 | Owner | Who owns the backup policy? | The CTO (ISO 27001 A.5.2) | "Karim B., head of infra" | user |
MD
