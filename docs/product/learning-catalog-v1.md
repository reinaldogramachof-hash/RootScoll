# Learning Catalog v1

> Documento de planejamento e contrato de dados. Formaliza como o CodeChat
> organiza conteúdo por trilha, curso, módulo, lição e desafio. Não implementa
> Supabase, migrations, UI, parser real, terminal real, execução real ou IA
> executável — ver seção "O que este documento não é" ao final.

Este documento formaliza a pendência registrada em
`docs/product/product-vision-v1.md` ("Decisões em aberto antes de
implementação" → Learning Catalog v1) e serve de referência conceitual para os
contratos TypeScript mínimos adicionados em `packages/types/src/index.ts`
(seção "Learning Catalog v1").

## Status

Contrato de dados e documentação de planejamento. Não há armazenamento
persistente, seed de banco de dados, UI de catálogo, parser real de comandos
ou motor de execução associado a este documento — apenas tipos TypeScript
puros (`LearningTrack`, `CourseCatalogEntry`, `ModuleCatalogEntry`,
`LessonCatalogEntry`, `ChallengeCatalogEntry` e tipos de apoio) e os testes que
comprovam a consistência do modelo.

## Por que uma camada `Track` acima de `Course`

`docs/product/domain-model-v1.md` já define `Course → Module → Lesson → Step
→ Challenge` como hierarquia pedagógica. Esse modelo permanece válido e não é
alterado aqui. O que faltava era uma camada de organização comercial e de
navegação **acima** de `Course`, capaz de agrupar cursos relacionados por
área de conhecimento (ex.: todos os cursos de terminal/SO, todos os cursos de
programação) — é isso que `docs/product/product-vision-v1.md` chama de
"trilhas estratégicas".

Decisão arquitetural desta fase: **`Track` é a camada acima de `Course`**.
Uma `Track` agrupa `LearningSegment`s (a taxonomia de conteúdo — ver abaixo);
cada `Course` pertence a exatamente uma `Track` via `CourseCatalogEntry.trackId`.
A `Track` não referencia a lista de `Course`s diretamente, para não duplicar
essa associação em dois lugares.

## Hierarquia do catálogo

```
LearningTrack
  └─ CourseCatalogEntry (trackId)
       └─ ModuleCatalogEntry (courseId)
            └─ LessonCatalogEntry (moduleId)
                 └─ ChallengeCatalogEntry (lessonId)
```

Esta fase modela apenas a camada de **catálogo** — o "índice" do conteúdo, não
o conteúdo executável em si. Ela não substitui nem redefine
`Course`/`Module`/`Lesson`/`Step`/`Challenge` de `domain-model-v1.md`; apenas
acrescenta `Track` acima e expõe, para cada entidade, os campos mínimos
necessários para montar um índice navegável do catálogo.

Consistente com a decisão já registrada na fatia mínima da Fase 1 (contratos
`ExecutionResult`/`ValidationRule` em `packages/types/src/index.ts`): nesta
fase, cada lição mapeia para uma `Lesson` com um `Challenge` principal
implícito. `Step` permanece **fora do catálogo** — é detalhe de execução
pedagógica dentro de uma `Lesson`, não um nível de índice/navegação, e
continua reservado para evolução futura.

### Track

- **Propósito**: agrupa `LearningSegment`s relacionados; é o nível mais alto de
  navegação do catálogo (ex.: "Terminal e Sistemas Operacionais").
- **Campos**: `trackId`, `name`, `description`, `segments` (lista de
  `LearningSegment`).
- **Tipo**: `LearningTrack` (`packages/types/src/index.ts`).

### Course

- **Propósito**: idêntico ao já definido em `domain-model-v1.md` — a maior
  unidade de conteúdo, um percurso completo.
- **Campos de catálogo**: `courseId`, `trackId`, `title`, `description`,
  `difficulty` (`DifficultyLevel`), `technologies` (`TechnologyTag[]`),
  `moduleIds` (ordem dos módulos), `publicationStatus` (`'draft' |
'published'`).
- **Tipo**: `CourseCatalogEntry`.

### Module

- **Propósito**: idêntico ao já definido em `domain-model-v1.md` —
  agrupamento intermediário de lições dentro de um curso.
- **Campos de catálogo**: `moduleId`, `courseId`, `title`, `description`,
  `order`, `lessonIds`.
- **Tipo**: `ModuleCatalogEntry`.

### Lesson

- **Propósito**: idêntico ao já definido em `domain-model-v1.md` — unidade de
  ensino específica dentro de um módulo.
- **Campos de catálogo**: `lessonId`, `moduleId`, `title`,
  `learningObjective`, `order`, `segment` (`LearningSegment`), `difficulty`
  (`DifficultyLevel`), `runtime` (`RuntimeRequirement`), `challengeIds`,
  `sourceLevel?` (preserva o `nivel` numérico 1–4 original das lições da Fase
  0, quando aplicável — ver seção "Mapeamento da Fase 0").
- **Tipo**: `LessonCatalogEntry`.

### Challenge

- **Propósito**: idêntico ao já definido em `domain-model-v1.md` — o desafio
  prático associado a uma lição.
- **Campos de catálogo**: `challengeId`, `lessonId`, `prompt`,
  `expectedOutcome`, `validationRules` (`ValidationRule[]`, reaproveitando o
  vocabulário já definido na fatia mínima da Fase 1 — o catálogo não introduz
  um segundo vocabulário de validação), `environmentProfileId?`,
  `maxAttempts?`.
- **Tipo**: `ChallengeCatalogEntry`.

## Trilhas e segmentos (Fase 1 vs Currículo Ideal)

As 6 trilhas estratégicas de `docs/product/product-vision-v1.md` são
modeladas na **Fase 1** como `LearningTrackId`:

| `trackId`               | Nome                                  | Segmentos (`LearningSegment`)                                                 |
| ----------------------- | ------------------------------------- | ----------------------------------------------------------------------------- |
| `terminal-os`           | Terminal e Sistemas Operacionais      | `linux`, `macos`, `windows-cmd`, `powershell`                                 |
| `git-github`            | Git e GitHub                          | `git`                                                                         |
| `web`                   | Desenvolvimento Web                   | `html`, `css`, `javascript`                                                   |
| `programming`           | Programação                           | `python`, `java`, `php`, `nodejs`                                             |
| `professional-practice` | Prática Profissional                  | `database`, `deploy`, `testing`, `debugging`                                  |
| `cybersecurity`         | Segurança Cibernética e da Informação | `cybersecurity`, `information-security`, `secure-development`, `digital-risk` |

> **Decisão Pendente (Codex/Usuário)**: A pesquisa profunda de currículo gerou o documento ideal `docs/product/zero-to-junior-curriculum-v1.md`, que expande essas 6 trilhas genéricas em **14 trilhas granulares**. Por enquanto, este catálogo v1 (em código) permanece com as 6 trilhas para permitir a execução da Fase 1, mas precisará ser refatorado futuramente para comportar as 14 trilhas do currículo ideal.

`LearningSegment` é a taxonomia de granularidade mais fina, usada tanto para
compor `LearningTrack.segments` quanto para decidir o requisito de runtime de
uma lição (`LessonCatalogEntry.segment` → `RuntimeRequirement`). O conjunto
de 20 segmentos é fechado nesta fase e deriva literalmente da lista de trilhas
de `product-vision-v1.md`; crescer esse conjunto (ex.: adicionar `react`,
`docker` ou especializações avançadas de segurança) é decisão de produto
futura, não coberta aqui.

`cybersecurity` é a **Trilha 06** aprovada como radar estratégico para fechar o
bloco de formação. Nesta fase ela é reconhecida no catálogo, mas ainda não
inclui currículo executável, laboratórios, política ética de simulação,
ambientes isolados ou validadores específicos. Esses pontos deverão ser
formalizados antes de qualquer implementação prática de segurança.

`ProgrammingLanguageId` (`'python' | 'java' | 'php' | 'javascript' |
'nodejs'`) é um recorte à parte, específico da trilha `programming` — não deve
ser confundido com `LearningSegment`: `LearningSegment` é a taxonomia ampla
usada para runtime/trilha; `ProgrammingLanguageId` identifica a linguagem
ensinada por um `CourseCatalogEntry` de programação especificamente.

## Tags de tecnologia, dificuldade e runtime

- **`TechnologyTag`** (`{ id, label }`): tag de tecnologia associada a um
  curso/lição — dado estruturado e aberto (não uma união fechada de strings),
  para permitir novas tecnologias sem alterar o pacote de tipos a cada tag
  nova.
- **`DifficultyLevel`** (`'beginner' | 'intermediate' | 'advanced'`):
  reaproveita literalmente o campo conceitual "nível
  (iniciante/intermediário/avançado)" já aprovado para `Course` em
  `domain-model-v1.md`.
- **`RuntimeRequirement`** (`{ adapterId, environmentProfileId? }`): declara
  qual `ExecutionAdapterId` (já definido na fatia mínima da Fase 1) uma lição
  exige, e opcionalmente qual `EnvironmentProfileId`. É dado puro — não decide
  roteamento nem executa nada; a decisão de roteamento real pertence a
  `execution-engine` e está fora de escopo aqui. O raciocínio completo de
  quando usar cada adapter e as restrições conceituais que cada um carrega
  (rede, filesystem, execução de processo, persistência, isolamento) estão
  formalizados em `docs/architecture/runtime-requirements-v1.md`.

Tabela de referência usada nos testes (`RUNTIME_BY_SEGMENT` em
`packages/types/src/learning-catalog.test.ts`) — apenas ilustrativa, não é um
contrato exportado do pacote de tipos:

| Segmento                                                                                                                                             | `adapterId`     |
| ---------------------------------------------------------------------------------------------------------------------------------------------------- | --------------- |
| `linux`, `macos`, `windows-cmd`, `powershell`, `git`                                                                                                 | `virtual-shell` |
| `html`, `css`, `javascript`                                                                                                                          | `webcontainer`  |
| `python`                                                                                                                                             | `pyodide`       |
| `java`, `php`, `nodejs`, `database`, `deploy`, `testing`, `debugging`, `cybersecurity`, `information-security`, `secure-development`, `digital-risk` | `remote-runner` |

## Mapeamento da Fase 0

A Fase 0 (`docs/product/curriculum-phase-0.md`) já existe como currículo
concreto e não é reescrita por este documento — apenas mapeada para o novo
modelo de catálogo, preservando integralmente seus dados:

- **Track**: `terminal-os`.
- **Course**: `fundamentos-terminal` (`publicationStatus: 'draft'`,
  `difficulty: 'beginner'`).
- **Modules**: os 4 níveis de comando da Fase 0 viram 4 `ModuleCatalogEntry`,
  na mesma ordem:
  1. `fundamentos-terminal-modulo-1` — Orientação (`pwd`, `ls`, `cd`, `clear`,
     `man`).
  2. `fundamentos-terminal-modulo-2` — Arquivos e diretórios (`mkdir`,
     `touch`, `cat`, `echo`, `cp`, `mv`, `rm`, `tree`).
  3. `fundamentos-terminal-modulo-3` — Conteúdo e fluxo (`head`, `tail`,
     `grep`, `find`, `wc`, pipe).
  4. `fundamentos-terminal-modulo-4` — Sistema (`chmod`, `whoami`,
     `history`).
- **Lessons**: as 10 lições da Fase 0 viram 10 `LessonCatalogEntry`, com o
  **mesmo `lessonId`** já usado no currículo (ex.: `01-onde-estou`,
  `02-navegando`, ..., `10-permissoes`), mesma ordem, e `sourceLevel` igual ao
  `nivel` (1–4) original. O `nivel` numérico não é descartado — vira também um
  `DifficultyLevel` via a regra `nivel ≤ 2 → beginner`, `nivel === 3 →
intermediate`, `nivel === 4 → advanced` (testada em
  `learning-catalog.test.ts`).
- **Challenges**: cada lição gera um `ChallengeCatalogEntry` com pelo menos
  uma `ValidationRule` reaproveitada do vocabulário da fatia mínima da Fase 1
  (ex.: `{ kind: 'exit-code', value: 0 }`), reforçando que o catálogo não
  duplica o vocabulário de validação.

Este mapeamento é validado por teste (`learning-catalog.test.ts`, describe
"Learning Catalog v1"): a lista de 10 `lessonId`s, a ordem, os `sourceLevel`s
e a contagem de módulos/lições são todos verificados contra os valores
concretos do currículo existente, para impedir que uma refatoração futura
alinhe silenciosamente esses dados.

## Exemplo ilustrativo: trilha Programação/Python

Para comprovar que o modelo funciona além do caso Terminal/SO, os testes
incluem um curso `fundamentos-python` (trilha `programming`, segmento
`python`) com 1 módulo, 1 lição e 1 desafio. Este curso é **explicitamente
ilustrativo** — não é currículo real aprovado, apenas prova de que o mesmo
grafo `Course → Module → Lesson → Challenge` funciona para uma trilha com
runtime (`pyodide`) diferente de `virtual-shell`.

## A IA e o catálogo

Consistente com `docs/product/product-vision-v1.md` ("Decisões em aberto
antes de implementação"), a IA **não é modelada como parte do catálogo
executável** nesta fase. Nenhum tipo aqui referencia mentor de IA, política de
ajuda ou telemetria pedagógica — isso é escopo da futura "AI Pedagogy Policy
v1", citada em `product-vision-v1.md` como pendência separada. Este documento
só formaliza a organização de conteúdo (trilha/curso/módulo/lição/desafio);
quando a AI Pedagogy Policy v1 for formalizada, ela deverá referenciar este
catálogo, não o contrário.

## O que este documento não é

- Não é um schema de banco de dados — não há Supabase, migrations, tabelas ou
  RLS definidos aqui.
- Não é uma implementação de UI — nenhum componente de catálogo/vitrine foi
  criado ou alterado.
- Não é um parser, terminal ou motor de execução real — `RuntimeRequirement`
  apenas declara um requisito, não executa nada.
- Não é dado semeado em produção — os cursos/módulos/lições/desafios usados
  nos testes (`learning-catalog.test.ts`) são fixtures de teste, não uma carga
  inicial de banco de dados.
- Não introduz um segundo vocabulário de validação — `ChallengeCatalogEntry`
  reaproveita `ValidationRule` já definido na fatia mínima da Fase 1.
- Não modela IA executável, mentor pedagógico ou telemetria — ver seção "A IA
  e o catálogo".
