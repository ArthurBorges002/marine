#!/usr/bin/env bash
# Backup do banco (Neon) com pg_dump, em formato custom (restaurável com pg_restore).
# Uso:  scripts/backup-banco.sh [pasta-destino]
# A URL vem de DATABASE_URL no ambiente ou em backend/.env. Nenhuma credencial é impressa.
# O destino padrão fica FORA do repositório: o dump contém dados pessoais.
set -euo pipefail

RAIZ="$(cd "$(dirname "$0")/.." && pwd)"
DESTINO="${1:-$HOME/integra-backups}"

for cmd in pg_dump pg_restore; do
  command -v "$cmd" >/dev/null || {
    echo "Erro: $cmd não encontrado. Instale o cliente do PostgreSQL 17 (ver docs/BACKUP.md)." >&2
    exit 1
  }
done

URL="${DATABASE_URL:-}"
if [ -z "$URL" ] && [ -f "$RAIZ/backend/.env" ]; then
  URL="$(grep -E '^DATABASE_URL=' "$RAIZ/backend/.env" | head -1 | cut -d= -f2- | sed -e 's/^"//' -e 's/"$//')"
fi
[ -n "$URL" ] || { echo "Erro: DATABASE_URL não definido (ambiente ou backend/.env)." >&2; exit 1; }

# pg_dump deve usar o endpoint direto do Neon, não o pooler (PgBouncer).
URL="${URL/-pooler./.}"

mkdir -p "$DESTINO"
ARQUIVO="$DESTINO/integra-$(date +%Y%m%d-%H%M%S).dump"

echo "Gerando backup..."
pg_dump --format=custom --no-owner --no-privileges --dbname="$URL" --file="$ARQUIVO"

# Confere que o arquivo é legível e mostra um resumo
TABELAS="$(pg_restore --list "$ARQUIVO" | grep -c ' TABLE DATA ' || true)"
echo "Backup salvo em: $ARQUIVO ($(du -h "$ARQUIVO" | cut -f1), $TABELAS tabelas com dados)"
