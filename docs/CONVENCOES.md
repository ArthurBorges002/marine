# Convenções do Integra

Valem para todo código novo e para o código antigo quando for tocado. O plano de migração
(etapas 0 a 15) está no documento "PLANO DE MIGRAÇÃO — NOVO SISTEMA".

## Fluxo de trabalho

- Uma branch por etapa (`etapa-N-descricao`), merge em `main` só com CI verde.
- Antes de rodar migrations em produção: branch do Neon + backup ([BACKUP.md](BACKUP.md)).
- Toda etapa termina com o sistema funcionando: quem altera uma tabela atualiza, na mesma etapa,
  tudo que a lê (inclusive o dashboard).
- Mudanças de banco seguem **expandir → migrar → alternar → contrair**: adicionar estrutura nova,
  copiar dados com comando idempotente e relatório de conferência, trocar o código, e só depois
  remover o antigo em migration separada.

## Banco de dados

- Migrations já executadas no Neon **nunca** são editadas; toda mudança é uma migration nova,
  com `down()` funcional.
- Tabelas e colunas em português, `snake_case`, tabelas no plural (`centros_custo`).
- FKs `<entidade>_id`; texto livre não substitui cadastro (fornecedor, cliente, cargo, setor...).
- Dinheiro: `decimal(14,2)` e cast `decimal:2` (nunca `float`).
- Status que depende de data (vencido, a vencer) é calculado, não gravado.
- Cadastros e registros financeiros usam soft delete.
- A partir da Etapa 2A, todo registro de negócio tem `organizacao_id` e o model usa o trait
  `PertenceAOrganizacao`; índices únicos de negócio são compostos com `organizacao_id`.

## Backend (Laravel)

- Controller fino → FormRequest (validação + `NormalizaEntrada`) → Service (regra de negócio)
  → Resource (JSON).
- Pastas por módulo quando crescerem: `Controllers/Api/Financeiro/DespesaController.php`.
- Autorização por Policy; permissões no formato `modulo.recurso.acao`
  (ex.: `financeiro.despesas.aprovar`).
- Rotas da API em minúsculas com hífen: `/financeiro/contas-pagar/{id}/baixar`.
- Listagens com `paginate()` e filtros por query string.
- Estilo: `vendor/bin/pint` (o CI roda `pint --test`).

## Frontend (React)

- Módulos novos em `src/modules/<modulo>/` (páginas, hooks de API, tipos).
- Chamadas HTTP sempre por `src/lib/api.ts`; dados com React Query; estados com `QueryState`.
- Rotas em minúsculas com hífen (`/financeiro/despesas/nova`), protegidas por permissão.
- Componentes visuais de `src/components/ui` (shadcn); nada de biblioteca nova sem justificativa.

## Testes

- Feature test para cada endpoint novo: sucesso, validação (422), sem permissão (403).
- A partir da Etapa 2A: teste de isolamento (outra organização recebe 404).
- `php artisan test` (SQLite) e `php artisan test -c phpunit.pgsql.xml` (PostgreSQL local).
  O `TestCase` aborta se o banco de teste não for local: os testes apagam as tabelas.
