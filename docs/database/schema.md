# Database Schema

> Documento em construção. **Nenhum schema definitivo, migration, SQL ou tabela real
> foi criado nesta etapa.** Este arquivo funciona apenas como ponto de entrada,
> apontando para o planejamento conceitual detalhado.

## Status

Planejamento conceitual concluído (Etapa 004 — Database Model / Supabase Planning).
Implementação real (migrations em `supabase/migrations`) aguarda aprovação explícita
do Arquiteto antes de ser iniciada — nenhuma migration foi criada até o momento.

## Onde está o planejamento

- **`docs/product/domain-model-v1.md`** — vocabulário e fronteiras de domínio
  (Etapa 003), ponto de partida de tudo abaixo.
- **`docs/architecture/engine-contracts-v1.md`** — contratos conceituais entre
  `terminal-engine`, `execution-engine` e `lesson-engine` (Etapa 003.1/003.2).
- **`docs/database/database-model-v1.md`** — mapeamento das entidades do Domain
  Model v1 para tabelas candidatas em Postgres/Supabase, sem SQL: nome sugerido,
  colunas conceituais, relações, exposição esperada e riscos de RLS por tabela
  (Etapa 004).
- **`docs/security/rls-planning-v1.md`** — estratégia de Row Level Security por
  domínio: ownership, escopo por organização/turma, tabelas append-only, tabelas
  nunca expostas ao cliente, riscos de views e cuidados com `service_role`/claims
  (Etapa 004).

## O que ainda não existe

- Nenhuma migration em `supabase/migrations` (o diretório continua com apenas o
  `README.md` da Etapa 001).
- Nenhuma tabela, coluna, chave, índice ou constraint real.
- Nenhuma policy de RLS real.
- Nenhuma conexão com o projeto Supabase provisionado (`chbbztqlxqahyrrprxxa`) foi
  estabelecida a partir deste repositório — nenhum comando do Supabase CLI
  (`login`/`init`/`link`/`db`/`migration`) foi executado.

## Próximo passo

Quando autorizado pelo Arquiteto, a implementação real (migrations + RLS) deve seguir
diretamente o mapeamento já feito em `database-model-v1.md` e `rls-planning-v1.md`,
resolvendo primeiro as `ARCHITECTURAL QUESTION`s neles registradas (ex.: se
`classroom_memberships` e `roles` escopado coexistem ou se uma delas é eliminada; se
`execution_requests` precisa mesmo ser persistida; se `environment_profiles` vira
tabela ou permanece como enum/constante).
