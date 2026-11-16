#!/usr/bin/env bash
set -euo pipefail
mkdir -p sources
cat > sources/advisory.md <<'EOF'
# National CERT advisory, 14 Nov 2026
The Contoso Water utility reported a ransomware incident on 8 November affecting its billing systems. Water supply was not affected. Investigation is ongoing.
EOF
