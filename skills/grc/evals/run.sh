#!/usr/bin/env bash
# Run the GRC skills' eval suite with `claude plugin eval`.
# The 12 skills are wrapped in one throwaway plugin, `grc`, so they call each other as they would installed.
# Each case's scaffold copies evals/fixture/grc (Acme Pay) into its sandbox.
# Extra arguments pass through, e.g. --runs 1 --case 'router-*'.
set -euo pipefail
GRC_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
WRAP="$(mktemp -d)"
trap 'rm -rf "$WRAP"' EXIT
mkdir -p "$WRAP/.claude-plugin" "$WRAP/skills"
printf '{ "name": "grc", "description": "Eval wrapper for skills/grc" }\n' > "$WRAP/.claude-plugin/plugin.json"
for s in "$GRC_DIR"/*/SKILL.md; do cp -R "$(dirname "$s")" "$WRAP/skills/"; done
cp -R "$GRC_DIR/evals" "$WRAP/evals"
rm -rf "$WRAP/evals/results" "$WRAP/evals/run.sh" "$WRAP/evals/check-citations.py"
# Scaffolds find the fixture through this absolute path.
find "$WRAP/evals" -name scaffold.sh -exec sed -i '' "s|@FIXTURE@|$WRAP/evals/fixture|g" {} +
OUT="$GRC_DIR/evals/results/$(date -u +%Y%m%dT%H%M%SZ)"
mkdir -p "$OUT"
claude plugin eval "$WRAP" \
  --output-dir "$OUT" \
  --report "$OUT/report.html" \
  --json "$OUT/result.json" \
  --no-publish \
  --scaffold \
  --trust-plugin \
  --ablation none \
  --judge-model sonnet \
  --allow-tools Bash Write Edit \
  "$@"
echo "$OUT"
