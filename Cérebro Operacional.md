# Cerebro Operacional

> Documento vivo de continuidade do CodeChat. Deve ser atualizado ao fim de cada
> sessao para que o proximo inicio tenha contexto, estado real, decisoes pendentes e
> proximas acoes sem depender do historico do chat.

## Como usar

### Inicio de sessao

1. Ler este arquivo antes de qualquer alteracao.
2. Confirmar `git status -sb`.
3. Confirmar ausencia de `.git/index.lock`.
4. Conferir o ultimo commit local/remoto.
5. Retomar a partir de `Proximos passos ativos`.

### Fim de sessao

1. Registrar data e hora local.
2. Registrar commits criados/publicados.
3. Registrar validacoes executadas.
4. Registrar decisoes tomadas.
5. Atualizar `Proximos passos ativos`.
6. Registrar bloqueios, riscos ou perguntas arquiteturais.

## Snapshot atual

- Projeto: CodeChat
- Diretorio oficial: `C:\Dev\CodeChat`
- Branch: `main`
- Remote: `origin/main`
- Estado Git no ultimo registro: com alteracoes locais prontas para commit (Cérebro Operacional.md modificado; packages/types/src/index.ts modificado; packages/types/src/index.test.ts novo — 3 arquivos no total; ver Registro de sessoes, 2026-08-15 12:52, correcao de 2026-08-15 13:10 e fechamento de 2026-08-15 13:20)
- Lock Git no ultimo registro: `.git/index.lock` ausente apos remocao pelo Codex em ambiente PowerShell nativo (ver fechamento de 2026-08-15 13:20)
- Servidor local visual: `http://127.0.0.1:5174/`
- Ultimo commit funcional publicado: `bd82a83 feat: add fullscreen terminal visual prototype`

## Grafo operacional

```text
Fundacao monorepo
  -> Domain Model v1
  -> Engine Contracts v1
  -> Database Model / RLS Planning
  -> Curriculum Phase 0
  -> Visual Prototype fullscreen terminal
  -> Proximas decisoes arquiteturais
     -> granularidade Lesson/Step/Challenge
     -> telemetria: derivada, tabela propria ou pipeline
     -> payload de ExecutionResult para validadores
     -> estrategia Supabase real antes de migrations
```

## Marcos confirmados

| Commit  | Descricao                                      | Estado    |
| ------- | ---------------------------------------------- | --------- |
| bc52763 | Fundacao do monorepo CodeChat                  | Publicado |
| e3ab4af | Domain Model v1 e Engine Contracts v1          | Publicado |
| c09bf74 | Planejamento de database e RLS                 | Publicado |
| 3ca2096 | Curriculo Fase 0 e contratos de conteudo       | Publicado |
| bd82a83 | Prototipo visual fullscreen focado no terminal | Publicado |

## Decisoes de governanca

- ChatGPT / Work atua como Arquiteto, Tech Lead e Revisor.
- Claude Code atua como executor/desenvolvedor senior.
- Usuario atua como direcao de produto e decisor de negocio.
- Commits/pushes somente com autorizacao explicita.
- Supabase so deve ser usado apos aprovacao arquitetural da etapa correspondente.
- `service_role` e segredos nunca devem ser gravados em frontend ou documentacao versionada.

## Proximos passos ativos

1. Revisar e decidir a granularidade da Fase 0:
   - manter uma licao curta como um `Challenge` implicito;
   - ou formalizar `Step`s ja na Fase 1.
2. Definir estrategia de telemetria:
   - eventos derivados das entidades existentes;
   - tabela propria de analytics;
   - ou pipeline/event store fora do Postgres.
3. Detalhar o payload de `ExecutionResult` necessario para validadores de filesystem:
   - existencia;
   - conteudo;
   - linhas;
   - permissoes;
   - cwd;
   - codigo de saida;
   - stdout/stderr.
4. Preparar a proxima etapa tecnica:
   - especificacao do shell-core/terminal-engine;
   - sem implementar 21 comandos de uma vez;
   - preferir fatias pequenas e testaveis.
5. Preparar a proxima instrucao para Claude Code:
   - resolver as decisoes arquiteturais acima;
   - manter escopo documental/contratual antes de implementacao pesada;
   - se implementar, comecar por fatia minima do contrato `ExecutionResult` + validadores.

## Registro de sessoes

### 2026-08-15 12:52:00 -03:00

**Execução: fatia mínima de contratos TypeScript — Fase 1**

- Tarefa aprovada pelo Arquiteto Codex, escopo: `packages/types/src/index.ts` +
  teste mínimo de contrato compatível com Vitest.
- `git status -sb` antes desta sessão: `## main...origin/main` (limpo).
- `.git/index.lock`: ausente no início da sessão.

**Arquivos alterados**

- `packages/types/src/index.ts` — reescrito (de `export {};` para os tipos da
  fatia mínima).
- `packages/types/src/index.test.ts` — novo (teste de contrato).
- `Cérebro Operacional.md` — este registro.

**Tipos criados** (todos exportados de `packages/types/src/index.ts`)

`EnvironmentProfileId`, `ExecutionAdapterId`, `CommandAttemptRef`,
`ExecutionRequestRef`, `VirtualFileEntry`, `VirtualFileSystemSnapshot`,
`ExecutionResult`, `ValidationRule` (união: `ValidationRuleFileExists`,
`ValidationRuleFileNotExists`, `ValidationRuleFileCount`,
`ValidationRuleFileContent`, `ValidationRuleLineCount`, `ValidationRuleCwd`,
`ValidationRulePermission`, `ValidationRuleOutputContains`,
`ValidationRuleExitCode`, `ValidationRuleCommandExecuted`, mais composição
`ValidationCompositeRule` com `kind: 'any' | 'none'`), `ValidationVerdict`,
`ValidationOutcome`.

**Decisões locais tomadas** (dentro do escopo aprovado, para revisão do Codex)

1. `ExecutionResult.filesystem` foi modelado como **snapshot** (`cwd` +
   lista de `VirtualFileEntry`), não como delta/diff do que mudou. O
   `engine-contracts-v1.md` (seção 2) sugeria "descrição do que mudou", mas
   deixava o formato de campo a campo em aberto para esta etapa; um snapshot
   é o formato mínimo capaz de responder a qualquer `ValidationRule` de
   `existe`/`conteudo`/`linhas`/`cwd`/`permissao` sobre um caminho arbitrário
   — um delta não seria suficiente sem acoplar o vocabulário de validação ao
   que mudou especificamente naquele comando. **Pede revisão do Codex.**
2. `exitCode` tipado como `number` simples (não um tipo POSIX mais rico) —
   decisão mínima deliberada, já que `engine-contracts-v1.md` marcava esse
   campo como "a decidir tecnicamente".
3. `ValidationRule` modela apenas a FORMA/parâmetros da regra (dado), não a
   função pura de avaliação — a função `(ExecutionResult, ValidationRule) ->
ValidationOutcome` fica para implementação futura de `lesson-engine`
   (fora de escopo desta etapa).
4. O "E lógico" da gramática (lista de validadores) não ganhou um wrapper
   `all`/`kind: 'and'` — é representado apenas por `readonly ValidationRule[]`
   no `Challenge`, já que a gramática nunca aninha um "E" explícito, só
   "OU" (`qualquer_um` → `kind: 'any'`) e "NÃO" (`nenhum` → `kind: 'none'`).
5. Vocabulário de `kind` traduzido para inglês (`file-exists`,
   `output-contains`, etc.) mantendo JSDoc com o termo original em
   português da gramática, para consistência com o resto do código-base em
   inglês.
6. `EnvironmentProfileId` foi anexado a `ExecutionRequestRef` (não a
   `CommandAttemptRef`) para representar "EnvironmentProfile vigente no
   momento do pedido" (domain-model-v1.md) sem duplicar o campo nos dois refs.

**Comandos executados**

- Leitura completa de `Cérebro Operacional.md`,
  `docs/architecture/engine-contracts-v1.md`,
  `docs/architecture/validation-grammar-v1.md`,
  `docs/architecture/dependency-rules.md`,
  `docs/product/domain-model-v1.md` (trechos relevantes),
  `packages/types/package.json`, `packages/types/tsconfig.json`,
  `packages/config/typescript/{base,library}.json`,
  `packages/config/eslint/base.js`, `.prettierrc.json`, `vitest.config.ts`,
  `packages/config/testing/vitest.base.ts`.
- `git status -sb`, checagem de `.git/index.lock`, `git branch -vv`,
  `git remote -v`, `git log --oneline -5`.

**Validações executadas e resultados — ver observação de ambiente abaixo**

Não foi possível rodar `pnpm typecheck`/`lint`/`test`/`format:check`
diretamente contra este repositório a partir do ambiente de execução usado
nesta sessão, por duas limitações técnicas do ambiente (não do repositório):

1. O bridge de arquivos deste ambiente monta `C:\Dev\CodeChat` num container
   Linux; os pacotes do `pnpm` ficam em `node_modules/.pnpm` e são
   referenciados por symlinks/junctions do Windows. Esses links não resolvem
   através da montagem (`Input/output error` ao ler
   `node_modules/typescript`), então `tsc`/`eslint`/`prettier`/`vitest`
   instalados no projeto não puderam ser executados neste bridge.
2. O controle remoto de tela (computer-use) só permite clicar em terminais,
   não digitar comandos — não é um caminho viável para rodar `pnpm` real.

Como mitigação, montei um ambiente isolado equivalente (mesma versão do
TypeScript resolvida no `pnpm-lock.yaml` — `typescript@5.9.3` — mesmas
versões de `eslint`/`typescript-eslint`/`prettier`/`vitest` do
`package.json` raiz, e os mesmos arquivos de config —
`config/typescript/{base,library}.json`, `config/eslint/base.js`,
`.prettierrc.json`) e rodei as 4 validações apenas sobre os dois arquivos
desta fatia:

- `tsc --noEmit` → **passou** (exit 0).
- `eslint .` → **passou**, 0 erros/avisos (exit 0).
- `prettier --check .` → **passou**, "All matched files use Prettier code
  style!" (exit 0).
- `vitest run` → **passou**, 3/3 testes (`index.test.ts`) (exit 0).

Isso é uma **aproximação válida, não a validação real do monorepo completo**
(não roda contra os outros packages, não usa a resolução real do
`pnpm-workspace.yaml`). **Pendência explícita:** rodar `pnpm typecheck &&
pnpm lint && pnpm test && pnpm format:check` de verdade, num terminal nativo
no Windows (fora deste bridge), antes de considerar esta etapa
definitivamente fechada.

**Riscos / bloqueios**

- ⚠️ **`.git/index.lock` ficou travado nesta pasta** após operações de
  leitura do Git feitas através deste bridge nesta sessão (`git status`
  aparentemente tentou atualizar o index e falhou ao liberar o lock: `warning:
unable to unlink '.git/index.lock': Operation not permitted`). As
  ferramentas deste ambiente não conseguem apagar arquivos no bridge (`rm`/
  `mv` também falharam com "Operation not permitted" — limitação conhecida
  da ferramenta, não corrupção real do repositório). `git status` ainda
  funciona (modo leitura), mas `git add`/`commit`/`checkout` provavelmente
  vão falhar até o lock ser removido. **Ação necessária do usuário:** apagar
  manualmente `C:\Dev\CodeChat\.git\index.lock` (Explorer ou terminal nativo
  no Windows) antes de qualquer commit — é seguro apagar, nenhum processo
  Git real está com o lock ativo.
- Validações rodaram em ambiente-proxy, não no monorepo real (ver acima).

**Decisões tomadas nesta sessão**

- Granularidade Fase 1 confirmada conforme aprovado: `Lesson` com um
  `Challenge` principal implícito; `Step` não é modelado como tipo
  operacional nesta fatia (fica reservado para evolução futura).
- Nenhuma decisão sobre telemetria, Supabase ou parser foi tomada — seguem
  em aberto, fora de escopo desta etapa.

**Nenhum commit ou push foi realizado** (fora de autorização explícita,
conforme regra de governança).

**Próxima retomada**

1. Ler este arquivo primeiro.
2. **Remover manualmente `.git/index.lock`** (ver risco acima) antes de
   qualquer operação de escrita no Git.
3. Rodar `pnpm typecheck && pnpm lint && pnpm test && pnpm format:check`
   nativamente (terminal real no Windows) para confirmar as 4 validações
   contra o monorepo completo.
4. Levar `packages/types/src/index.ts` para revisão do Codex — em especial
   os 6 pontos listados em "Decisões locais tomadas" acima.
5. Após aprovação e validação real, aguardar autorização explícita do
   usuário para `git add` + `commit` + `push`.

**Correção (2026-08-15 13:10:00 -03:00) — revisão do Codex recebida**

- Codex (Arquiteto) revisou o retorno acima e aprovou a implementação técnica
  de `packages/types/src/index.ts`.
- Decisão arquitetural fechada: `ExecutionResult.filesystem` como **snapshot**
  (não delta) é a decisão definitiva para esta fase — não fica mais em aberto
  para revisão, conforme aprovação explícita do Codex. As demais 5 decisões
  locais desta sessão não foram objetadas.
- Validação real (não apenas o ambiente-proxy) foi confirmada: Antigravity
  rodou `typecheck`/`lint`/`test`/`format:check` nativamente no Windows e os
  4 passaram.
- **Imprecisão documental corrigida:** o snapshot acima, na primeira versão
  deste registro, listava só `packages/types/src/index.ts` e
  `packages/types/src/index.test.ts` como pendentes — mas o próprio
  `Cérebro Operacional.md` também estava (e continua) modificado nesta
  sessão. Corrigido acima.
- `.git/index.lock` **continua presente** em
  `C:\Dev\CodeChat\.git\index.lock` no momento desta correção — cada
  `git status` executado através do bridge remoto deste ambiente recria o
  lock e falha ao liberá-lo (`Operation not permitted`); `rm`/`mv` também
  falham pela mesma limitação de ferramenta. **Este ambiente (Claude, via
  bridge) não consegue remover esse arquivo.** Removê-lo requer uma
  ferramenta com acesso real de disco no Windows (Antigravity, Explorer, ou
  terminal nativo) — fora do que este ambiente pode executar.
- Nenhum commit ou push foi realizado. Aguardando: (1) remoção do lock por
  fora deste ambiente, (2) confirmação de `git status -sb` limpo do lock,
  (3) autorização explícita do usuário para `git add` + `commit` + `push`.

**Fechamento operacional (2026-08-15 13:20:00 -03:00) — Codex**

- Usuário autorizou aplicar as ações necessárias e realizar `commit` + `push`.
- Codex confirmou ausência de processo `git` ativo e removeu o lock stale
  `.git/index.lock` via PowerShell com permissão elevada.
- `.git/index.lock`: ausente após remoção.
- Validação real do monorepo já confirmada pelo Antigravity:
  `pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm format:check` passaram.
- Validação final pelo Codex antes do commit:
  `corepack pnpm@10.28.0 -r --if-present run typecheck`,
  `corepack pnpm@10.28.0 lint`, `corepack pnpm@10.28.0 test` e
  `corepack pnpm@10.28.0 format:check` passaram. Observação: o script raiz
  `pnpm typecheck` acionou um pnpm 11 intermediário neste ambiente; por isso o
  comando equivalente direto com `pnpm@10.28.0 -r --if-present run typecheck`
  foi usado como evidência final.
- Direção visual do protótipo fullscreen terminal aprovada pelo usuário em
  `http://127.0.0.1:5174/`.
- Próxima ação desta sessão: stage apenas dos 3 arquivos desta fatia, commit e
  push para `origin/main`.

### 2026-08-15 00:06:11 -03:00

**Encerramento de sessao**

- `git status -sb` antes deste registro: `## main...origin/main`
- `.git/index.lock`: ausente
- Ultimo commit publicado: `bd82a83 feat: add fullscreen terminal visual prototype`
- Prototipo visual aprovado pelo usuario como caminho correto:
  - terminal fullscreen;
  - menus/painel/sidebar ocultos;
  - paleta escura com verde/ambar mantida;
  - foco total na experiencia de terminal real.

**Decisoes tomadas nesta sessao**

- O visual base oficial deve parecer um terminal real em tela cheia.
- Interfaces auxiliares podem existir futuramente, mas nao devem competir com o terminal
  na experiencia principal.
- O superprompt de prototipagem deve ser tratado como referencia de experiencia e nao
  como implementacao integral direta dentro do monorepo.
- O Cérebro Operacional passa a ser o ponto de retomada obrigatorio para inicio/fim de
  sessoes do projeto.

**Proxima retomada**

1. Ler este arquivo primeiro.
2. Confirmar `git status -sb` e `.git/index.lock`.
3. Resolver as decisoes arquiteturais ativas:
   - granularidade `Lesson`/`Step`/`Challenge`;
   - estrategia de telemetria;
   - payload de `ExecutionResult`;
   - ordem correta antes de Supabase/migrations.
4. Preparar uma etapa pequena, testavel e revisavel para os contratos tecnicos iniciais.

**Observacoes para amanha**

- Nao iniciar implementacao ampla dos 21 comandos de uma vez.
- Nao iniciar Supabase/migrations sem resolver as perguntas de schema/RLS.
- O servidor local visual pode precisar ser reiniciado com `pnpm --filter @codechat/web dev -- --port 5174`.

### 2026-08-15 00:03:50 -03:00

**Estado inicial registrado**

- `git status -sb`: `## main...origin/main`
- `.git/index.lock`: ausente
- Ultimo commit: `bd82a83 feat: add fullscreen terminal visual prototype`
- Servidor local visual: `http://127.0.0.1:5174/`

**O que ficou consolidado**

- Monorepo base criado e publicado.
- Documentacao arquitetural inicial aprovada.
- Planejamento de database/RLS aprovado e publicado.
- Curriculo Fase 0 incorporado como documentacao oficial.
- Prototipo visual fullscreen terminal aprovado e publicado.

**Proximos passos sugeridos**

- Usar este arquivo como primeiro ponto de leitura nas proximas sessoes.
- Resolver as perguntas arquiteturais listadas em `Proximos passos ativos`.
- Em seguida, abrir uma etapa pequena para contrato tecnico de `ExecutionResult` e validadores.

**Observacoes**

- Este arquivo foi criado para funcionar como memoria operacional atualizavel por sessao.
- Manter entradas novas no topo ou em ordem cronologica, mas sempre atualizar o snapshot.
