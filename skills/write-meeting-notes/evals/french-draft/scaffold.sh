#!/usr/bin/env bash
# A French project committee draft, saved as a file the user points to.
set -euo pipefail
mkdir -p notes
cat > notes/comite-2026-10-22.md <<'MD'
comité projet 22/10 - Claire, Julien, Amine
- recette repoussée, l'env de test pas prêt
- on valide le passage à Postgres 16 (perf)
- Julien prépare l'env de test pour lundi 26
- Amine relance le fournisseur pour les licences
- question : on garde la démo client du 5/11 ? à voir avec Claire
MD
