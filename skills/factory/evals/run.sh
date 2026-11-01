#!/usr/bin/env bash
# Run the Factory skills' eval suite with `claude plugin eval`.
# The skills are wrapped in one throwaway plugin, `factory`, so they call each other as `factory:<skill>`.
# Each case's scaffold copies evals/fixture/notes-app (and the intents it needs) into its sandbox.
# Extra arguments pass through, e.g. --runs 1 --case 'run-*'.
set -euo pipefail
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
WRAP="$(mktemp -d)"
trap 'rm -rf "$WRAP"' EXIT
mkdir -p "$WRAP/.claude-plugin" "$WRAP/skills"
printf '{ "name": "factory", "description": "Eval wrapper for skills/factory" }\n' > "$WRAP/.claude-plugin/plugin.json"
for s in "$DIR"/*/SKILL.md; do cp -R "$(dirname "$s")" "$WRAP/skills/"; done
cp -R "$DIR/evals" "$WRAP/evals"
rm -rf "$WRAP/evals/results" "$WRAP/evals/run.sh"
find "$WRAP/evals" -name scaffold.sh -exec sed -i.bak "s|@FIXTURE@|$WRAP/evals/fixture|g" {} +
find "$WRAP/evals" -name '*.bak' -delete
OUT="$DIR/evals/results/$(date -u +%Y%m%dT%H%M%SZ)"
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
