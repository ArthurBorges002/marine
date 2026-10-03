# Integra

SaaS de gestão administrativa, financeira, operacional e de RH: despesas, custos fixos,
contratos, notas fiscais, folha e obrigações, funcionários, férias e folgas, EPI, equipamentos
mobilizados, passagens, documentos e vencimentos, políticas de RH, aprovações, auditoria e
relatórios.

> **Em migração.** O sistema está sendo transformado a partir do protótipo "Marine Ops"
> (gestão de mergulho), em etapas, conforme o *Plano de Migração*. Enquanto isso, parte do
> que está descrito abaixo (ex.: orçamentos) ainda é do sistema antigo e será removido.
> Regras de trabalho: [docs/CONVENCOES.md](docs/CONVENCOES.md) · backup: [docs/BACKUP.md](docs/BACKUP.md).

```
Frontend (React + Vite)  →  API Laravel 13 (Sanctum)  →  PostgreSQL (Neon)
       /frontend                   /backend
```

> **Os dados já estão no banco.** Os dados iniciais (usuários, funcionários, equipamentos,
> projetos, orçamentos, contas, fluxo de caixa, configuração de cadastro e imagens de
> papel timbrado) foram migrados uma única vez para o PostgreSQL do Neon. O sistema **não**
> usa seeders nem dados fictícios: não existe `php artisan db:seed` para rodar, e o frontend
> não tem mais mocks — tudo vem da API.

---

## Requisitos

- PHP 8.3+ com as extensões `pdo_pgsql`, `pgsql`, `mbstring`, `gd`, `intl`, `zip`, `fileinfo`, `openssl`, `curl`
  (e `pdo_sqlite` para rodar os testes)
- Composer 2
- Node.js 20+ e npm

## 1. Backend (Laravel)

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
```

### Configurar o `.env` e conectar ao Neon

No `backend/.env`, preencha `DATABASE_URL` com a connection string do painel do Neon
(**Connection Details → Connection string**):

```dotenv
DB_CONNECTION=pgsql
DATABASE_URL="postgresql://USUARIO:SENHA@HOST.neon.tech/neondb?sslmode=require&channel_binding=require"
FRONTEND_URL=http://localhost:8080
```

- Use aspas, porque a URL contém `&`.
- Pode ser o endpoint **com pooler** (`-pooler` no host) ou o direto. Com o pooler (PgBouncer),
  a conexão usa *prepared statements* emulados (`DB_EMULATE_PREPARES=true`, padrão em
  `config/database.php`); sem isso o pooler aborta transações.
- `FRONTEND_URL` define as origens liberadas no CORS (várias separadas por vírgula).
- **Nunca** commite o `.env` (já está no `.gitignore`). O `.env.example` não contém credenciais.

Para conferir a conexão: `php artisan db:show`.

### Migrations

A estrutura do banco é criada **somente** pelas migrations:

```bash
php artisan migrate
```

No Neon atual as migrations já foram executadas (`php artisan migrate:status`). Em um banco
novo e vazio, `migrate` cria todas as tabelas — mas vazias: os dados de negócio vivem no
Neon, não em arquivos do projeto. Para levar os dados para outro banco, copie-os do Neon
(ex.: *branch* do Neon ou `pg_dump`/`pg_restore`).

### Iniciar a API

```bash
php artisan serve        # http://localhost:8000  (API em http://localhost:8000/api)
```

## 2. Frontend (React)

```bash
cd frontend
npm install
cp .env.example .env     # VITE_API_URL=http://localhost:8000/api
npm run dev              # http://localhost:8080
```

Build de produção: `npm run build` (gera `frontend/dist`). Em produção, defina
`VITE_API_URL` com a URL pública da API **antes** do build, e inclua a URL do frontend
em `FRONTEND_URL` no backend.

### Acesso

Os usuários existentes foram migrados com as mesmas credenciais de antes (agora com senha
em hash bcrypt): `admin@mergulho.com` (admin) e `joao@mergulho.com` (usuário).
**Troque essas senhas** — elas eram as senhas de demonstração do protótipo.

## 3. Testes

```bash
cd backend
php artisan test
```

Os testes usam SQLite em memória (forçado no `phpunit.xml`) e **nunca** acessam o Neon.
Para rodar a mesma suíte em PostgreSQL (o banco de produção), com um PostgreSQL local em
`127.0.0.1` e o banco `integra_testes`:

```bash
php artisan test -c phpunit.pgsql.xml
```

O `TestCase` aborta a execução se o banco de teste não for local, porque os testes apagam
as tabelas. O CI (`.github/workflows/ci.yml`) roda Pint, os testes em SQLite e em
PostgreSQL, e o build do frontend a cada push em `main` e em pull requests.
Cobrem autenticação, orçamentos (CRUD, filtros, paginação, status, PDF), funcionários
(cadastro/edição com máscaras, validação), modelos, upload de templates, configuração de
cadastro, dashboard e finanças.

Frontend: `npm run build` / `npx tsc -p tsconfig.app.json --noEmit`.

---

## Estrutura

```
backend/
  app/
    Http/
      Controllers/Api/   Controllers finos (um por recurso)
      Requests/          Validação + normalização da entrada (datas dd/mm/aaaa, valores 1.500,00)
      Resources/         Formato JSON devolvido ao frontend
    Models/              Eloquent (Usuario, Funcionario, Orcamento, ...)
    Services/            Regras de negócio (OrcamentoService, PdfService, TemplatePdfService, DashboardService)
  database/
    migrations/          Estrutura completa do banco
    factories/           Apenas para testes
  lang/pt_BR/            Mensagens de validação
  routes/api.php         Todas as rotas da API
  tests/Feature/         Testes da API
frontend/
  src/
    lib/api.ts           Cliente HTTP (URL da API, token, erros)
    contexts/AuthContext Login/logout via API
    types/               Tipos das entidades retornadas pela API
    pages/, components/  Telas
```

## Principais endpoints

Todos sob `/api`. Exceto `login` e a imagem de template, exigem `Authorization: Bearer <token>`.

| Método | Rota | Descrição |
|---|---|---|
| POST | `/login` | `{email, senha}` → `{token, usuario}` |
| POST | `/logout` | Revoga o token atual |
| GET | `/me` | Usuário autenticado |
| GET | `/dashboard` | Estatísticas, alertas e projetos |
| GET | `/funcionarios` | Lista (com certificações) |
| POST | `/funcionarios` | Cadastro (multipart) |
| GET / PUT | `/funcionarios/{id}` | Detalhe / edição |
| GET / PUT | `/configuracoes-cadastro/{tela}` | Campos visíveis no cadastro (tela 1 = funcionário) |
| GET | `/orcamentos?page&search&status&data_inicial&data_final` | Lista paginada (`{data, hasMore}`) |
| GET | `/orcamentos/proximo-numero` | Próximo número |
| POST | `/orcamentos` | Criação (gera `ORC-AAAA-NNNN`) |
| GET / PUT / DELETE | `/orcamentos/{id}` | Detalhe / edição / exclusão |
| PATCH | `/orcamentos/{id}/status` | `{status: A\|E\|R}` |
| GET | `/orcamentos/{id}/pdf` | PDF do orçamento salvo |
| POST | `/pdf/documento`, `/pdf/capa` | Pré-visualização em PDF do conteúdo dos editores |
| GET / POST | `/modelos-orcamento`, GET / PUT `/modelos-orcamento/{id}` | Modelos de orçamento |
| GET / POST | `/modelos-capa`, GET / PUT `/modelos-capa/{id}` | Modelos de capa |
| GET | `/templates-pdf/capas`, `/templates-pdf/documentos` | Templates de papel timbrado |
| POST | `/templates-pdf` | Upload (`arquivo`, `nomeModelo`, `tipo`) |
| GET | `/templates-pdf/imagem/{arquivo}` | Imagem do template (pública) |
| GET | `/equipamentos`, `/projetos`, `/financas` | Listagens |

Erros seguem o padrão do Laravel: `422 {message, errors}` para validação,
`401` sem token, `404` para registro inexistente.

## Banco de dados

Tabelas: `usuarios`, `funcionarios`, `funcionario_certificacoes`, `projetos`, `equipamentos`,
`orcamentos`, `modelos_orcamento`, `modelos_capa`, `templates_pdf` (imagem guardada no banco),
`contas_receber`, `contas_pagar`, `fluxo_caixa`, `configuracoes_cadastro`, além das tabelas
do framework (`migrations`, `personal_access_tokens`, `cache`, `jobs`, `sessions`, ...).

Relacionamentos: projeto → funcionário responsável; equipamento → projeto atual;
conta a receber → projeto; certificação → funcionário; orçamento → usuário criador,
último editor, modelo de orçamento e modelo de capa.
