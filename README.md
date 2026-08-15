# CodeChat

Aplicação educacional PWA para ensino progressivo de desenvolvimento através de terminal.

> **Status: fase inicial.** O projeto está em fundação de engenharia (monorepo, TypeScript,
> lint, formatação, testes, dependency boundaries). Nenhuma funcionalidade de produto
> (terminal, autenticação, banco de dados, lições, execução) foi implementada ainda.

## Requisitos

- Node.js >= 18
- pnpm (gerenciador de pacotes oficial do monorepo) — versão fixada em `packageManager`
  no `package.json` raiz

## Estrutura

```
apps/        aplicações executáveis (web, runner)
packages/    pacotes compartilhados (terminal-engine, lesson-engine, execution-engine,
             shared, types, config)
supabase/    migrations, seed e functions
docs/        documentação de arquitetura, produto, segurança e roadmap
tests/       testes de integração e e2e
scripts/     scripts utilitários do repositório
```

Consulte `docs/architecture/system-overview.md` para a visão geral da arquitetura e
`docs/architecture/dependency-rules.md` para as regras de dependência entre módulos.

## Instalação

```bash
pnpm install
```

## Comandos de validação

```bash
pnpm typecheck     # TypeScript (project references)
pnpm lint          # ESLint
pnpm format:check  # Prettier (somente verificação)
pnpm format        # Prettier (aplica formatação)
pnpm test          # Vitest
```
