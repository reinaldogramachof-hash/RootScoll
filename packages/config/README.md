# @codechat/config

Infraestrutura de configuração compartilhada do monorepo.

## Conteúdo

```
typescript/
├── base.json    configuração TypeScript comum a todos os packages (composite, strict)
├── react.json   estende base.json — usado por apps/web (React, sem emit)
└── node.json    estende base.json — usado por apps/runner (Node.js, sem emit)

eslint/
└── base.js      configuração ESLint compartilhada (flat config)

testing/
└── vitest.base.ts   configuração base do Vitest reaproveitável pelos packages
```

## Uso — TypeScript

Cada `tsconfig.json` de app/package estende o arquivo apropriado via caminho relativo:

```jsonc
{
  "extends": "../../packages/config/typescript/base.json",
}
```

Caminho relativo é utilizado nesta fase por simplicidade e confiabilidade — resolução via
node_modules (`@codechat/config/typescript/base.json`) depende de `pnpm install` já ter
sido executado e de os packages exportarem esses caminhos via `exports`. Ver
`docs/architecture/dependency-rules.md` para a decisão registrada.

## Uso — ESLint

O `eslint.config.js` da raiz importa `packages/config/eslint/base.js` e aplica a todo o
workspace.

## Uso — Prettier

Configuração do Prettier vive em `.prettierrc.json` na raiz (compartilhada para todo o
workspace, sem necessidade de indireção via este package nesta etapa).

## Futuro

Conforme os packages ganharem código real, esta configuração poderá evoluir para regras
mais específicas por ambiente (browser vs. node) sem quebrar os consumidores.
