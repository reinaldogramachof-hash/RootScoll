# Database Schema

> Documento em construção. Nenhum schema definitivo foi criado nesta etapa. Nenhuma
> tabela, coluna, tipo SQL, chave ou constraint foi decidida aqui — apenas uma
> referência conceitual ao Domain Model v1.

## Status

Aguardando definição arquitetural do schema pelo Arquiteto antes da criação de
migrations em `supabase/migrations`.

## Referência conceitual

O vocabulário de entidades que eventualmente precisará de persistência real
(Supabase/Postgres) está descrito, em nível puramente conceitual, em
`docs/product/domain-model-v1.md`. Esse documento não deve ser lido como um schema —
ele existe para alinhar nomes e fronteiras de domínio antes de qualquer modelagem de
banco. Quando a modelagem de banco desta etapa futura começar, ela deve:

- decidir quais entidades do Domain Model v1 viram tabelas reais, e quais permanecem
  apenas conceituais (ex.: `RunnerExecutionLog`, explicitamente marcado como
  "apenas conceitual" no Domain Model v1);
- decidir estratégia de RLS (Row Level Security) por entidade, em conjunto com
  `docs/security/security-model.md`;
- resolver as `ARCHITECTURAL QUESTION`s abertas no Domain Model v1 (ex.: hierarquia de
  `Organization`/`School`/`Cohort`; persistência ou não de `VirtualFileSystemState`
  entre sessões).

Nenhuma dessas decisões foi tomada nesta etapa.
