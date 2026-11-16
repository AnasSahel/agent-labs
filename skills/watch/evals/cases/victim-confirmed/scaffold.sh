#!/usr/bin/env bash
set -euo pipefail
mkdir -p sources
cat > sources/status-update.md <<'EOF'
# Fabrikam Cloud status update, 12 Nov 2026
On 9 November we detected unauthorised access to a customer support database. About 210,000 customer email addresses were affected. No passwords or payment data were involved. We have notified the data protection authority.
EOF
cat > sources/news-article.md <<'EOF'
# Daily Wire, 13 Nov 2026
Fabrikam Cloud confirmed a breach on its support system. The company says 2.1 million customers had their email addresses exposed.
EOF
