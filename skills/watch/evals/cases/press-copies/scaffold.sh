#!/usr/bin/env bash
set -euo pipefail
mkdir -p sources
cat > sources/scoop.md <<'EOF'
# The Ledger, 10 Nov 2026
According to an anonymous source, Tailspin Bank suffered a ransomware attack last week. The bank did not respond to requests for comment.
EOF
cat > sources/rewrite.md <<'EOF'
# Finance Today, 11 Nov 2026
As reported by The Ledger, Tailspin Bank was hit by ransomware last week, citing an anonymous source.
EOF
