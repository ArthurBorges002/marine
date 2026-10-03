# Backup e restauração do banco

Regra da migração: **antes de cada etapa** que mexe no banco, criar um branch do Neon e um
backup com `pg_dump` guardado fora do Neon. Só então rodar migrations em produção.

## 1. Pré-requisito: cliente do PostgreSQL

`pg_dump` e `pg_restore` precisam ser da mesma versão do servidor do Neon ou mais nova (use 17).

- **Windows:** instalador do PostgreSQL 17 (EDB). No instalador, pode desmarcar *PostgreSQL Server*
  e manter só *Command Line Tools*. Depois adicione `C:\Program Files\PostgreSQL\17\bin` ao `PATH`.
- **macOS:** `brew install libpq` · **Linux:** `apt install postgresql-client-17`

Confira: `pg_dump --version`.

## 2. Ponto de restauração no Neon (branch)

No console do Neon: **Branches → Create branch**, a partir de `main`, nome `antes-etapa-N`
(ex.: `antes-etapa-1`). O branch é uma cópia instantânea; se a etapa der errado, dá para
restaurar o `main` a partir dele (**Restore**) ou apontar a aplicação para ele.

Branches ocupam armazenamento: apague os antigos quando a etapa seguinte estiver estável.

## 3. Backup com pg_dump

```bash
scripts/backup-banco.sh                # salva em ~/integra-backups
scripts/backup-banco.sh /outra/pasta   # destino escolhido
```

O script lê `DATABASE_URL` do ambiente ou de `backend/.env`, troca o endpoint `-pooler` pelo
direto, gera `integra-AAAAMMDD-HHMMSS.dump` e confere se o arquivo é legível.

O arquivo contém dados pessoais (CPF, salários): **nunca** o coloque no repositório
(`*.dump` está no `.gitignore`); guarde em local com acesso restrito.

## 4. Teste de restauração

Um backup só vale se já foi restaurado alguma vez. Para testar sem tocar na produção:

1. No Neon, crie um branch vazio ou um banco novo (ex.: `restauracao_teste`) e copie a
   connection string **direta** dele.
2. Restaure:
   ```bash
   pg_restore --no-owner --no-privileges --dbname="<url do banco de teste>" ~/integra-backups/integra-....dump
   ```
3. Compare as contagens com a produção, por exemplo:
   ```sql
   select 'usuarios', count(*) from usuarios union all
   select 'funcionarios', count(*) from funcionarios union all
   select 'projetos', count(*) from projetos;
   ```
4. Apague o banco/branch de teste.
