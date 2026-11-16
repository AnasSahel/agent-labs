#!/usr/bin/env bash
# Run the Watch skills' eval suite with `claude plugin eval`.
# The skills are wrapped in one throwaway plugin, `watch`, so they are called as `watch:<skill>`.
# Extra arguments pass through, e.g. --runs 1 --case 'attacker-*'.
set -euo pipefail
W="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
WRAP="$(mktemp -d)"
trap 'rm -rf "$WRAP"' EXIT
mkdir -p "$WRAP/.claude-plugin" "$WRAP/skills"
printf '{ "name": "watch", "description": "Eval wrapper for skills/watch" }\n' > "$WRAP/.claude-plugin/plugin.json"
for s in "$W"/*/SKILL.md; do cp -R "$(dirname "$s")" "$WRAP/skills/"; done
cp -R "$W/evals" "$WRAP/evals"
rm -rf "$WRAP/evals/results" "$WRAP/evals/run.sh"
OUT="$W/evals/results/$(date -u +%Y%m%dT%H%M%SZ)"
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
  --allow-tools Read Glob Grep \
  "$@"
echo "$OUT"
