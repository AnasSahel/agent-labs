#!/usr/bin/env bash
# Acme Pay sample org (evals/fixture/grc), plus an MFA config export in inbox/
set -euo pipefail
cp -R "@FIXTURE@/grc" ./grc
mkdir -p inbox && cat > inbox/mfa-conditional-access-export.txt <<'TXT'
Entra ID Conditional Access export, 2026-10-28
Policy: Require MFA for all users. State: On. Grant: Require authentication strength "Phishing-resistant MFA" for admin roles, "MFA" for all others.
Exclusions: break-glass-01 (monitored).
TXT
