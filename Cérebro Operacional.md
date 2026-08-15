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
- Estado Git no ultimo registro: limpo
- Lock Git no ultimo registro: `.git/index.lock` ausente
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
