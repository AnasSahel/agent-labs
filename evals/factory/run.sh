#!/usr/bin/env bash
# Run the factory skills' eval suite with `claude plugin eval`.
# The four skills are wrapped in one throwaway plugin, `factory`, so they call each other as they would installed.
# Each case's scaffold copies evals/factory/fixture (a tiny notes app, files tracker, no remote) into its sandbox.
# Extra arguments pass through, e.g. --runs 1 --case 'trigger-*'.
# On a machine with no sandbox backend the shell grant is refused: ALLOW_TOOLS='Write Edit' runs the trigger cases anyway.
set -euo pipefail
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(cd "$HERE/../.." && pwd)"
WRAP="$(mktemp -d)"
trap 'rm -rf "$WRAP"' EXIT
mkdir -p "$WRAP/.claude-plugin" "$WRAP/skills" "$WRAP/evals"
printf '{ "name": "factory", "description": "Eval wrapper for the factory skills" }\n' > "$WRAP/.claude-plugin/plugin.json"
for s in "$ROOT"/skills/factory-*/SKILL.md "$ROOT"/skills/factory/factory-*/SKILL.md; do
  [ -f "$s" ] && cp -R "$(dirname "$s")" "$WRAP/skills/"
done
cp -R "$HERE/cases" "$HERE/fixture" "$WRAP/evals/"
# Scaffolds find the fixture through this absolute path.
find "$WRAP/evals" -name scaffold.sh -exec sed -i.bak "s|@FIXTURE@|$WRAP/evals/fixture|g" {} +
find "$WRAP/evals" -name '*.bak' -delete
# macOS /usr/bin/git is a launcher the sandbox cannot run; Homebrew git has no launcher.
[ -x /opt/homebrew/bin/git ] && export PATH="/opt/homebrew/bin:$PATH"
OUT="$HERE/results/$(date -u +%Y%m%dT%H%M%SZ)"
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
  --allow-tools ${ALLOW_TOOLS:-Bash Write Edit} \
  "$@"
echo "$OUT"
