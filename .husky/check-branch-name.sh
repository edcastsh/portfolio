#!/bin/sh
# POSIX sh compatible — invocado con `sh .husky/check-branch-name.sh` desde el pre-push.
# No usar sintaxis exclusiva de bash ([[, =~).
#
# Valida el nombre de la rama actual contra la convención del equipo.
# El patrón está definido inline aquí. Si en el futuro se centralizan varias
# reglas (tipos de commit, ramas, etc.), mover a una única fuente de verdad.

local_branch_name="$(git rev-parse --abbrev-ref HEAD)"

# Ramas base protegidas: se ignoran (no aplican la convención).
protected="main stage development develop_v2"

# Patrón permitido. El Jira ID (ej. AD-1234-) es opcional.
valid_branch_regex="^(feat|feature|fix|hotfix|chore|refactor|docs|release)/([A-Z]+-[0-9]+-)?[a-z0-9._-]+$"

example="feature/AD-1234-descripcion-corta"

# HEAD desprendido (detached HEAD): no validar.
if [ "$local_branch_name" = "HEAD" ]; then
    exit 0
fi

# 1. Ignorar ramas protegidas.
for b in $protected; do
    if [ "$local_branch_name" = "$b" ]; then
        exit 0
    fi
done

# 2. Validar formato desde el patrón.
if ! printf '%s' "$local_branch_name" | grep -Eq "$valid_branch_regex"; then
    echo ""
    echo "❌ Nombre de rama inválido: '$local_branch_name'"
    echo ""
    echo "Formato requerido:"
    echo "  $valid_branch_regex"
    echo ""
    echo "Prefijos válidos: feat | feature | fix | hotfix | chore | refactor | docs | release"
    echo "El Jira ID (AD-1234-) es opcional."
    echo "Ejemplo: $example"
    echo ""
    exit 1
fi

exit 0
