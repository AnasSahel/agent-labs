#!/usr/bin/env bash
# Run this skill's eval suite with `claude plugin eval`.
# agent-labs is a skills repo, not a plugin, so this wraps the skill in a
# throwaway plugin first. Extra arguments pass through, e.g. --runs 1 --case asks-first.
# Needs Claude Code 2.1.269+.
set -euo pipefail
SKILL_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
WRAP="$(mktemp -d)"
trap 'rm -rf "$WRAP"' EXIT
mkdir -p "$WRAP/.claude-plugin" "$WRAP/skills"
printf '{ "name": "write-meeting-notes", "description": "Eval wrapper for skills/write-meeting-notes" }\n' > "$WRAP/.claude-plugin/plugin.json"
# The eval tool won't read cases from inside skills/, so they sit beside it.
cp -R "$SKILL_DIR" "$WRAP/skills/write-meeting-notes"
mv "$WRAP/skills/write-meeting-notes/evals" "$WRAP/evals"
rm -rf "$WRAP/evals/results" "$WRAP/evals/run.sh"
OUT="$SKILL_DIR/evals/results/$(date -u +%Y%m%dT%H%M%SZ)"
mkdir -p "$OUT"
claude plugin eval "$WRAP" \
  --output-dir "$OUT" \
  --report "$OUT/report.html" \
  --no-publish \
  --scaffold \
  --trust-plugin \
  --ablation none \
  --judge-model sonnet \
  --allow-tools Read Write \
  "$@"
