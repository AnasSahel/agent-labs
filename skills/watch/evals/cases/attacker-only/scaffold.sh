#!/usr/bin/env bash
set -euo pipefail
mkdir -p sources
cat > sources/leak-post.md <<'EOF'
# Leak site post
NORTHWIND LOGISTICS has been breached by the Velvet Crow group. We hold 4 TB of data including customer contracts and payroll. Pay 3 BTC before 20 November or everything is published.
EOF
