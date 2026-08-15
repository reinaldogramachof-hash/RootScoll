# Dependency Rules

Este documento registra as regras de dependência entre os módulos do monorepo.
Vale a partir da Etapa 002 e deve ser preservado durante todo o projeto.

## Apps

`apps/web` e `apps/runner` podem realizar **composição** dos módulos de `packages/*`.
São os únicos pontos autorizados a decidir _quais_ engines usar e _como_ combiná-las.

## Engines (`terminal-engine`, `lesson-engine`, `execution-engine`)

Devem preservar **independência** entre si. Nenhuma engine pode depender diretamente da
implementação interna de outra engine. Especificamente, são proibidas:

- `terminal-engine → lesson-engine`
- `lesson-engine → terminal-engine`
- `execution-engine → implementação interna de terminal-engine`
- qualquer variação equivalente entre as três engines

Quando duas engines precisarem se comunicar, isso deverá ocorrer através de:

- contratos (interfaces públicas expostas por cada package);
- eventos;
- tipos compartilhados (`@codechat/types`);
- composição feita pela aplicação (`apps/web` ou `apps/runner`), nunca pelas engines entre si.

## Shared (`@codechat/shared`)

Deve conter **somente** código genuinamente compartilhado entre múltiplos módulos.
Não deve se tornar um depósito genérico de utilitários. Antes de adicionar algo a
`shared`, verificar se pertence, em vez disso, a um dos packages de domínio.

## Types (`@codechat/types`)

Contratos e tipos compartilhados entre engines e aplicações. Pode ser consumido
livremente pelas engines e pelas apps, pois representa apenas formas de dados, não
comportamento.

## Config (`@codechat/config`)

Infraestrutura de configuração (TypeScript, ESLint, testes). Não contém lógica de
negócio nem é consumido em runtime pelas engines ou apps — apenas em tempo de build/lint/test.

## Runner (`apps/runner`)

Executa workloads isolados futuramente. Nunca deverá compartilhar diretamente o mesmo
ambiente de execução do frontend (`apps/web`). A comunicação entre `execution-engine` e
`apps/runner` deverá ocorrer por meio de contratos definidos em `execution-engine/src/contracts`
e/ou `@codechat/types`, nunca por acoplamento direto a detalhes internos do runner.

## Regra geral

**Dependências circulares são proibidas** em todo o monorepo, entre quaisquer packages
ou apps. Nenhum módulo deve depender diretamente da implementação interna de outro —
sempre priorizar contratos públicos.

## Estado atual (Etapa 002)

Nenhuma dependência de workspace (`workspace:*`) foi adicionada entre `terminal-engine`,
`lesson-engine` e `execution-engine`. Não há ainda necessidade funcional para isso, e a
adição prematura de dependências entre engines violaria a regra acima.
