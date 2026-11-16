#!/usr/bin/env bash
set -euo pipefail
mkdir -p sources
cat > sources/blog-analysis.md <<'EOF'
# Aurora Labs threat research, 12 Nov 2026
We analysed a ransomware intrusion at a mid-size European retailer that began with a phished VPN credential. Encryption started on 6 November. We have seen the actor's negotiation chat.
EOF
cat > sources/leak-entry.md <<'EOF'
# Leak site entry
Wide World Retail - 1.2 TB - published by Velvet Crow
EOF
