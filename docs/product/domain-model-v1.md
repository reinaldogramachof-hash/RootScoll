# Domain Model v1

> Documento conceitual. Nenhuma entidade aqui descrita corresponde a uma tabela de banco
> de dados definitiva, a uma migration ou a uma classe/interface TypeScript já
> implementada. O objetivo é alinhar vocabulário e fronteiras de domínio **antes** de
> qualquer modelagem de banco (Supabase), autenticação, UI ou engine funcional.
>
> Convenção usada abaixo: **Owner** indica o módulo do monorepo (ver
> `docs/architecture/dependency-rules.md`) que será responsável pela regra de negócio da
> entidade quando ela for implementada — não necessariamente onde o dado será
> persistido. A persistência (Supabase/Postgres) é tratada separadamente em
> `docs/database/schema.md`, que permanece sem SQL nesta etapa.

## Como ler este documento

Cada entidade é descrita com:

- **Propósito** — por que a entidade existe.
- **Campos conceituais** — atributos que a entidade provavelmente terá, em nível de
  ideia, não de coluna de banco (sem tipos SQL, sem constraints).
- **Relações** — com quais outras entidades ela se conecta e a cardinalidade aproximada.
- **Owner** — módulo do monorepo responsável pela regra de negócio.
- **Regras de negócio** — invariantes conceituais que a entidade deve respeitar.
- **Riscos / observações** — pontos em aberto, ambiguidades ou decisões que o Arquiteto
  ainda precisa tomar.

---

## 1. Identidade e acesso

Este bloco define quem usa o sistema e com que papel. Pertence, em termos de regra de
negócio, ao produto (`apps/web`) e à futura camada de autenticação — **não** a nenhuma
engine. Nenhuma engine (`terminal-engine`, `lesson-engine`, `execution-engine`) deve
depender diretamente da implementação de identidade; quando precisarem saber "quem é o
usuário", devem receber essa informação via contrato/tipo compartilhado
(`@codechat/types`), nunca resolvendo autenticação por conta própria.

### User

- **Propósito**: representa uma conta autenticada no sistema — a identidade técnica
  (credenciais, e-mail, estado da conta), independente de papel pedagógico.
- **Campos conceituais**: identificador único, e-mail, estado da conta (ativo,
  suspenso, pendente de verificação), data de criação, data do último acesso,
  provedor de autenticação (ex.: e-mail/senha, OAuth — a decidir).
- **Relações**: 1 User → 1 Profile (ao menos nesta v1); 1 User → N Role (um usuário pode
  acumular papéis, ex.: professor que também é administrador de uma Organization).
- **Owner**: produto (`apps/web`), futura camada de autenticação. Persistência real
  tende a ser delegada ao Supabase Auth (fora do escopo desta etapa).
- **Regras de negócio**: um `User` não tem, por si só, nenhuma permissão — permissões
  vêm de `Role`. Um `User` sem `Role` ativo não deve conseguir acessar conteúdo
  pedagógico.
- **Riscos / observações**: decidir se `User` e `Profile` serão de fato duas entidades
  separadas ou se serão fundidas — mantidas separadas aqui por precaução (é comum
  separar dados de autenticação de dados de perfil editável pelo usuário).

### Profile

- **Propósito**: dados de perfil pedagógico/social do usuário — o que aparece para
  outros usuários e para o próprio sistema de progresso (nome de exibição, avatar,
  preferências).
- **Campos conceituais**: nome de exibição, avatar, idioma preferido, fuso horário,
  preferências de terminal (ex.: perfil de SO padrão — linux/macos/windows-cmd/
  powershell), preferências de acessibilidade.
- **Relações**: 1 Profile → 1 User (fronteira 1:1 nesta v1).
- **Owner**: produto (`apps/web`).
- **Regras de negócio**: `Profile` não carrega nenhuma informação de autorização — é
  puramente descritivo/preferencial.
- **Riscos / observações**: o "perfil de SO padrão" citado aqui é uma preferência de
  produto, não deve ser confundido com `EnvironmentProfile` (seção 3), que é técnico e
  pertence ao `terminal-engine`.

### Role

- **Propósito**: representa um papel de autorização atribuído a um `User`, dentro de um
  escopo (global ou de uma `Organization`/`Classroom` específica).
- **Campos conceituais**: tipo de papel (ex.: `student`, `teacher`, `admin`), escopo ao
  qual o papel se aplica (global, uma `Organization`, uma `Classroom`), data de
  concessão.
- **Relações**: N Role → 1 User; N Role → 0..1 Organization/Classroom (quando o papel é
  escopado).
- **Owner**: produto/autenticação.
- **Regras de negócio**: um `User` pode ter papéis diferentes em escopos diferentes
  (ex.: `student` na Organization A e `teacher` na Organization B). Nenhuma engine deve
  tomar decisões de autorização por conta própria — decisões de "o que este `Role` pode
  fazer" pertencem ao produto/segurança, não à `lesson-engine` ou `execution-engine`.
- **Riscos / observações**: o conjunto definitivo de papéis (`student`, `teacher`,
  `admin`, e possivelmente `content-author`) ainda não foi aprovado pelo Arquiteto —
  listados aqui como hipótese de trabalho.

### Organization / School / Cohort

- **Propósito**: agrupamento institucional opcional acima do usuário individual — uma
  escola, empresa ou turma que agrupa `User`s sob um mesmo contexto administrativo.
  Nomeada de forma genérica como `Organization` nesta v1; `School` e `Cohort` são
  variações conceituais que podem ou não virar entidades distintas.
- **Campos conceituais**: nome, tipo (escola, empresa, curso avulso), data de criação,
  responsável administrativo.
- **Relações**: 1 Organization → N User (via Role escopado); 1 Organization → N
  Classroom (seção 5).
- **Owner**: produto.
- **Regras de negócio**: uso de `Organization` é opcional — o sistema deve suportar um
  `User` sem nenhuma `Organization` associada (uso individual/autodidata), conforme o
  contexto educacional descrito no `system-overview.md`.
- **Riscos / observações**: **ARCHITECTURAL QUESTION candidata, não decidida aqui** —
  se `Organization`, `School` e `Cohort` serão três entidades hierárquicas
  (Organization > School > Cohort) ou uma simplificação para o MVP. Mantido como uma
  única entidade guarda-chuva nesta v1; ver seção "Architectural Questions" no relatório
  desta etapa.

---

## 2. Estrutura pedagógica

Define o conteúdo educacional em si — cursos, aulas, desafios. Pertence a
`packages/lesson-engine`. Por regra de dependência já registrada em
`dependency-rules.md`, nada aqui deve depender da implementação interna de
`terminal-engine` ou `execution-engine`; quando uma `Challenge` precisar validar algo
que o aluno digitou no terminal, isso deve ocorrer via contrato/evento, nunca por
acesso direto ao estado interno do terminal.

### Course

- **Propósito**: a maior unidade de conteúdo — um percurso completo (ex.: "Fundamentos
  de Terminal", "Git na prática").
- **Campos conceituais**: título, descrição, nível (iniciante/intermediário/avançado),
  tecnologias abordadas (filesystem, shell, Linux, macOS, Windows CMD, PowerShell, Git,
  Python, PHP, JavaScript, Node.js, etc. — ver `system-overview.md`), ordem de módulos,
  estado de publicação (rascunho/publicado).
- **Relações**: 1 Course → N Module.
- **Owner**: `lesson-engine`.
- **Regras de negócio**: um `Course` não publicado não deve aparecer para `student`s,
  apenas para `teacher`/`admin`/autores de conteúdo.
- **Riscos / observações**: nenhum.

### Module

- **Propósito**: agrupamento intermediário de `Lesson`s dentro de um `Course` (ex.:
  "Módulo 1 — Navegação no filesystem").
- **Campos conceituais**: título, ordem dentro do `Course`, descrição curta.
- **Relações**: N Module → 1 Course; 1 Module → N Lesson.
- **Owner**: `lesson-engine`.
- **Regras de negócio**: a ordem dos `Module`s define a progressão sugerida, mas não
  necessariamente obrigatória (ver `Enrollment`/`LessonProgress` para regras de
  desbloqueio).
- **Riscos / observações**: decidir se a progressão será linear obrigatória ou livre é
  uma decisão de produto ainda não tomada.

### Lesson

- **Propósito**: unidade de ensino específica dentro de um `Module` — combina teoria e
  prática.
- **Campos conceituais**: título, objetivo de aprendizagem, conteúdo teórico
  (texto/markdown), ordem dentro do `Module`, tecnologia/ferramenta associada,
  `EnvironmentProfile` recomendado (referência conceitual à seção 3).
- **Relações**: N Lesson → 1 Module; 1 Lesson → N Step.
- **Owner**: `lesson-engine`.
- **Regras de negócio**: uma `Lesson` é composta por `Step`s; a conclusão de uma
  `Lesson` depende da conclusão de todos os `Step`s obrigatórios que a compõem (regra a
  ser refinada quando `LessonProgress` for detalhado).
- **Riscos / observações**: nenhum.

### Step

- **Propósito**: menor unidade sequencial dentro de uma `Lesson` — uma instrução, uma
  explicação ou um `Challenge` específico.
- **Campos conceituais**: tipo do passo (instrução/teoria, `Challenge` prático,
  checkpoint), ordem dentro da `Lesson`, conteúdo.
- **Relações**: N Step → 1 Lesson; 0..1 Step → 0..1 Challenge (um `Step` pode conter um
  desafio prático, mas nem todo `Step` é um desafio).
- **Owner**: `lesson-engine`.
- **Regras de negócio**: `Step`s são sequenciais dentro de uma `Lesson`, mas a
  obrigatoriedade de completar cada um antes de avançar é uma regra de produto a
  refinar.
- **Riscos / observações**: nenhum.

### Challenge

- **Propósito**: um desafio prático que exige uma ação do aluno no terminal (executar
  um comando, produzir um resultado esperado). É o ponto de contato conceitual entre
  `lesson-engine` e `execution-engine`/`terminal-engine`, mas **sempre por contrato**,
  nunca por acoplamento direto.
- **Campos conceituais**: enunciado, objetivo esperado (descrito de forma abstrata —
  "o comando deve criar um diretório chamado `projeto`"), `ValidationRule`s associadas,
  `Hint`s disponíveis, `EnvironmentProfile` exigido, tentativas permitidas (se limitado).
- **Relações**: N Challenge → 0..1 Step; 1 Challenge → N ValidationRule; 1 Challenge → N
  Hint; 1 Challenge → N ChallengeProgress (seção 4).
- **Owner**: `lesson-engine` (a definição do desafio); a **execução** do comando do
  aluno pertence a `execution-engine`/`terminal-engine` — `lesson-engine` recebe de
  volta um `ExecutionResult` (seção 3) já processado, e é quem decide, com base nas
  `ValidationRule`s, se o desafio foi cumprido.
- **Regras de negócio**: `lesson-engine` nunca deve executar comandos diretamente nem
  manipular o filesystem virtual — ela consome o resultado já produzido pela
  `execution-engine`. Essa é a fronteira mais importante deste domínio e reflete
  diretamente a regra já registrada em `dependency-rules.md`.
- **Riscos / observações**: o contrato exato entre `Challenge`/`ValidationRule` e
  `ExecutionResult` (que campos, que formato de evento) ainda não foi desenhado — fica
  para uma etapa de "contratos entre engines", não para esta etapa de domínio.

### Hint

- **Propósito**: dica progressiva oferecida ao aluno quando ele está com dificuldade em
  um `Challenge`.
- **Campos conceituais**: nível de dica (1, 2, 3 — de mais sutil a mais explícita),
  conteúdo, "custo" (se dicas afetarem pontuação/gamificação).
- **Relações**: N Hint → 1 Challenge.
- **Owner**: `lesson-engine`.
- **Regras de negócio**: dicas devem ser reveladas progressivamente, nunca todas de uma
  vez; a lógica de "quando oferecer uma dica" (ex.: após N tentativas falhas) depende de
  `AttemptHistory` (seção 4).
- **Riscos / observações**: nenhum.

### ValidationRule

- **Propósito**: regra que determina se uma tentativa do aluno (um `CommandAttempt` /
  `ExecutionResult`) satisfaz o objetivo de um `Challenge`.
- **Campos conceituais**: tipo de validação (ex.: saída esperada, estado esperado do
  filesystem virtual, comando específico executado, código de saída esperado),
  parâmetros da validação, mensagem de erro associada.
- **Relações**: N ValidationRule → 1 Challenge.
- **Owner**: `lesson-engine` — a regra em si é pedagógica. Mas a `ValidationRule` só
  consegue avaliar algo depois de receber um `ExecutionResult` produzido pela
  `execution-engine`; ela nunca inspeciona o terminal ou o filesystem diretamente.
- **Regras de negócio**: uma `ValidationRule` deve ser determinística — dado o mesmo
  `ExecutionResult`, o resultado da validação deve ser sempre o mesmo.
- **Riscos / observações**: o "vocabulário" de validação (que tipos de regra existem)
  ainda não foi definido tecnicamente; listado aqui apenas em nível conceitual.

---

## 3. Execução e terminal

Define o que acontece quando o aluno interage com o terminal visual e o que é
efetivamente executado. Fronteira importante: **tudo nesta seção é técnico/de
execução**, não pedagógico. `terminal-engine` cuida da representação/interação visual e
do parsing; `execution-engine` decide onde/como um comando roda; `apps/runner` executa
o que não pode rodar no navegador. Nenhuma entidade aqui deve carregar regra
pedagógica (isso pertence à seção 2).

### TerminalSession

- **Propósito**: representa uma sessão ativa (ou encerrada) de uso do terminal visual
  por um usuário — o "estado de uma janela de terminal aberta".
- **Campos conceituais**: identificador da sessão, usuário associado, `EnvironmentProfile`
  ativo, timestamp de início, timestamp de última atividade, estado (ativa, encerrada,
  expirada).
- **Relações**: N TerminalSession → 1 User; 1 TerminalSession → N CommandAttempt; 1
  TerminalSession → 1 VirtualFileSystemState (o estado do FS "pertence" à sessão
  enquanto ela existe).
- **Owner**: `terminal-engine` (ciclo de vida da sessão do ponto de vista de
  interação); a decisão de onde os comandos daquela sessão efetivamente rodam é
  responsabilidade da `execution-engine`.
- **Regras de negócio**: uma `TerminalSession` não persiste indefinidamente — precisa de
  uma política de expiração (a definir). O encerramento de uma `Lesson`/`Challenge` não
  necessariamente encerra a `TerminalSession` (o aluno pode continuar explorando
  livremente).
- **Riscos / observações**: relação entre `TerminalSession` e `Challenge` ainda não
  está clara — uma sessão pode abranger múltiplos desafios, ou cada desafio pode abrir
  sua própria sessão isolada. Fica como ponto em aberto para a próxima etapa de
  contratos.

### CommandAttempt

- **Propósito**: representa um comando individual digitado/enviado pelo aluno dentro de
  uma `TerminalSession`.
- **Campos conceituais**: texto do comando (bruto, como digitado), timestamp,
  `EnvironmentProfile` no momento da execução, referência à `TerminalSession`.
- **Relações**: N CommandAttempt → 1 TerminalSession; 1 CommandAttempt → 0..1
  ExecutionRequest (um comando pode ainda não ter sido despachado para execução — ex.:
  erro de parsing detectado antes mesmo de gerar uma `ExecutionRequest`).
- **Owner**: `terminal-engine` (captura/parsing do comando); o despacho para execução
  (produção de uma `ExecutionRequest`) é responsabilidade de `terminal-engine`, mas o
  roteamento e a execução em si são responsabilidade da `execution-engine`.
- **Regras de negócio**: um `CommandAttempt` é imutável depois de criado — é um registro
  histórico do que o aluno efetivamente digitou, mesmo que o comando seja inválido.
- **Riscos / observações**: nenhum.

### ExecutionRequest

- **Propósito**: representa a intenção de execução de um `CommandAttempt` — o pedido
  que `terminal-engine` endereça à `execution-engine` para que um comando seja de fato
  processado. É a entidade que preenche, de forma explícita, o espaço entre "o aluno
  digitou algo" (`CommandAttempt`) e "o comando foi executado e temos um resultado"
  (`ExecutionResult`). Introduzida em `docs/architecture/engine-contracts-v1.md`
  (Etapa 003.1) e incorporada aqui para manter os dois documentos consistentes.
- **Campos conceituais**: referência ao `CommandAttempt` de origem, `EnvironmentProfile`
  vigente no momento do pedido, timestamp de despacho, estado do pedido (pendente, em
  processamento, resolvido — resolvido significa que já existe um `ExecutionResult`
  associado).
- **Relações**: 1 ExecutionRequest → 1 CommandAttempt (a `ExecutionRequest` nasce de um
  `CommandAttempt` específico); 1 ExecutionRequest → 0..1 ExecutionResult (uma
  `ExecutionRequest` pendente ainda não tem resultado; uma vez resolvida, tem exatamente
  um).
- **Owner**: fronteira entre `terminal-engine` (quem produz o pedido) e
  `execution-engine` (quem o consome, roteia e resolve). Nenhuma das duas é dona
  isolada desta entidade — ela é, por definição, o contrato técnico que as conecta,
  exatamente como descrito em `engine-contracts-v1.md`, seção 1.
- **Regras de negócio**:
  - `ExecutionRequest` **não representa progresso pedagógico** — não carrega, em
    nenhum campo, referência a `Challenge`, `ValidationRule` ou `ChallengeProgress`.
  - `ExecutionRequest` **não conhece `Challenge`** — do ponto de vista de quem produz e
    de quem consome esse pedido, não existe diferença entre um comando digitado dentro
    de um desafio pedagógico e um comando digitado em exploração livre do terminal;
    essa diferença só passa a existir depois, quando `lesson-engine` decide (por conta
    própria, fora deste contrato) que um `ExecutionResult` interessa a um `Challenge`.
  - `ExecutionRequest` é um contrato **puramente técnico** entre `terminal-engine` e
    `execution-engine` — `lesson-engine` nunca lê nem produz uma `ExecutionRequest`
    diretamente.
- **Riscos / observações**: o mecanismo de transporte do pedido (chamada direta,
  fila, evento) não é definido aqui nem em `engine-contracts-v1.md` — é decisão técnica
  de implementação, fora do escopo conceitual dos dois documentos.

### ExecutionResult

- **Propósito**: representa o resultado da execução de uma `ExecutionRequest`, já
  processado pela `execution-engine` (e, quando aplicável, pelo `apps/runner`).
- **Campos conceituais**: referência à `ExecutionRequest`/`CommandAttempt` de origem,
  saída padrão (stdout conceitual), saída de erro (stderr conceitual), código de saída,
  duração, adapter/ambiente que executou (virtual-shell, pyodide, webcontainer,
  remote-runner — ver `execution-engine.md`), estado resultante do filesystem virtual
  (referência a `VirtualFileSystemState`).
- **Relações**: 1 ExecutionResult → 1 ExecutionRequest (que por sua vez referencia 1
  CommandAttempt); 0..1 ExecutionResult → 1..N ChallengeProgress (quando o resultado é
  avaliado contra um `Challenge`, decisão tomada inteiramente por `lesson-engine`, fora
  deste contrato).
- **Owner**: `execution-engine` — é a entidade central dessa engine. É o único formato
  pelo qual `lesson-engine` "enxerga" o que aconteceu no terminal.
- **Regras de negócio**: `ExecutionResult` deve ser um formato estável e
  engine-agnóstico o suficiente para que `lesson-engine` nunca precise saber se o
  comando rodou em `virtual-shell`, `pyodide`, `webcontainer` ou `remote-runner` — essa
  é a essência do "roteamento" da `execution-engine` descrito em
  `execution-engine.md`. Assim como `ExecutionRequest`, `ExecutionResult` também não
  carrega referência a `Challenge`/`ValidationRule` — quem faz essa ponte é
  `lesson-engine`, depois do fato (ver `engine-contracts-v1.md`, seção 2, "o que não
  pode vazar para a regra pedagógica").
- **Riscos / observações**: o formato exato já tem um primeiro nível de detalhamento em
  `docs/architecture/engine-contracts-v1.md` (seção 2) — permanece sem tipos
  TypeScript/schema de banco definidos, isso fica para etapas de implementação e de
  Database Model, respectivamente.

### VirtualFileSystemState

- **Propósito**: representa o estado do filesystem virtual em um dado momento — o que
  existe, onde, com que conteúdo, dentro do ambiente simulado do aluno.
- **Campos conceituais**: estrutura de diretórios/arquivos (conceitual — árvore de
  nomes, sem persistência real definida), diretório de trabalho atual, referência à
  `TerminalSession`/`EnvironmentProfile` que o originou.
- **Relações**: 1 VirtualFileSystemState → 1 TerminalSession (nesta v1, um FS virtual
  por sessão).
- **Owner**: `terminal-engine` (a representação/estrutura do FS virtual, em
  `packages/terminal-engine/src/filesystem`) — mutações a esse estado, quando
  decorrentes de execução real de comandos, são orquestradas pela `execution-engine`.
- **Regras de negócio**: o filesystem virtual é isolado por sessão — não deve vazar
  estado entre sessões de usuários diferentes, nem entre sessões diferentes do mesmo
  usuário, a menos que exista uma decisão explícita de persistência entre sessões
  (não definida nesta v1).
- **Riscos / observações**: **ARCHITECTURAL QUESTION candidata**: se o filesystem
  virtual deve persistir entre sessões (para o aluno "continuar de onde parou") ou ser
  efêmero por sessão. Não decidido aqui.

### EnvironmentProfile

- **Propósito**: descreve qual "sistema operacional simulado" está ativo — linux,
  macos, windows-cmd ou powershell (ver `packages/terminal-engine/src/profiles`) — e
  quais comandos/sintaxes são válidos nesse contexto.
- **Campos conceituais**: identificador do perfil (linux/macos/windows-cmd/powershell),
  conjunto de comandos disponíveis nesse perfil, convenções de path, prompt visual.
- **Relações**: 1 EnvironmentProfile → N TerminalSession (um perfil pode ser usado por
  muitas sessões); 0..1 Lesson/Challenge → 1 EnvironmentProfile recomendado/exigido.
- **Owner**: `terminal-engine`.
- **Regras de negócio**: trocar de `EnvironmentProfile` no meio de uma `TerminalSession`
  é uma decisão de produto em aberto — pode exigir reiniciar a sessão ou pode ser
  suportado dinamicamente.
- **Riscos / observações**: nenhum.

---

## 4. Progresso e avaliação

Rastreia o avanço do aluno pelo conteúdo. Pertence majoritariamente a `lesson-engine`
(regra pedagógica de progresso), mas com forte dependência de dados vindos de
`execution-engine` (via `ExecutionResult`) e de identidade (`User`). Nenhuma entidade
aqui deve ser confundida com auditoria/segurança (seção 6) — progresso é
pedagógico, auditoria é técnico/segurança.

### Enrollment

- **Propósito**: representa a matrícula de um `User` em um `Course`.
- **Campos conceituais**: referência a `User` e `Course`, data de início, estado
  (ativa, concluída, abandonada), progresso agregado (percentual).
- **Relações**: N Enrollment → 1 User; N Enrollment → 1 Course; 1 Enrollment → N
  LessonProgress.
- **Owner**: `lesson-engine`.
- **Regras de negócio**: um `User` só tem `LessonProgress` em `Lesson`s de `Course`s nos
  quais tem `Enrollment` ativa (a definir se cursos totalmente abertos dispensam
  matrícula formal).
- **Riscos / observações**: nenhum.

### LessonProgress

- **Propósito**: rastreia o avanço de um `User` em uma `Lesson` específica.
- **Campos conceituais**: referência a `Enrollment`/`User` e `Lesson`, estado (não
  iniciada, em andamento, concluída), timestamp de início/conclusão, `Step` atual.
- **Relações**: N LessonProgress → 1 Enrollment; N LessonProgress → 1 Lesson; 1
  LessonProgress → N ChallengeProgress.
- **Owner**: `lesson-engine`.
- **Regras de negócio**: uma `Lesson` é considerada concluída quando todos os `Step`s
  obrigatórios (incluindo `Challenge`s) estiverem concluídos, conforme regra definida em
  `Lesson`/`Step`.
- **Riscos / observações**: nenhum.

### ChallengeProgress

- **Propósito**: rastreia o avanço/resultado de um `User` em um `Challenge` específico.
- **Campos conceituais**: referência a `User`/`LessonProgress` e `Challenge`, estado
  (não iniciado, tentando, concluído, desistiu), número de tentativas, dicas
  utilizadas, timestamp de conclusão.
- **Relações**: N ChallengeProgress → 1 LessonProgress; N ChallengeProgress → 1
  Challenge; 1 ChallengeProgress → N AttemptHistory.
- **Owner**: `lesson-engine`.
- **Regras de negócio**: o estado "concluído" só é setado quando uma `ValidationRule`
  associada ao `Challenge` retorna sucesso para um `ExecutionResult` do aluno.
- **Riscos / observações**: nenhum.

### AttemptHistory

- **Propósito**: histórico de tentativas de um aluno em um `Challenge` — cada tentativa
  associa um `ExecutionResult` ao resultado da validação (passou/falhou e por quê).
- **Campos conceituais**: referência a `ChallengeProgress`, referência ao
  `ExecutionResult` avaliado, resultado da validação, timestamp.
- **Relações**: N AttemptHistory → 1 ChallengeProgress; N AttemptHistory → 1
  ExecutionResult.
- **Owner**: `lesson-engine` (é quem decide "passou/falhou"), consumindo dado técnico
  produzido pela `execution-engine`.
- **Regras de negócio**: `AttemptHistory` é um log append-only — tentativas passadas não
  são apagadas nem sobrescritas, mesmo após o aluno acertar.
- **Riscos / observações**: possível sobreposição de propósito com `RunnerExecutionLog`
  (seção 6) — a diferença pretendida é que `AttemptHistory` é pedagógico (para o aluno e
  para `lesson-engine`), enquanto `RunnerExecutionLog` é técnico/operacional (para
  observabilidade do `apps/runner`). Ver observação na seção 6.

### Achievement / Reward

- **Propósito**: representa uma conquista/recompensa de gamificação obtida pelo aluno
  (ex.: badge, pontos, streak).
- **Campos conceituais**: tipo de conquista, critério que a desbloqueou, timestamp,
  referência ao `User`.
- **Relações**: N Achievement → 1 User; 0..1 Achievement → 0..1 Course/Lesson/Challenge
  (quando a conquista está associada a um conteúdo específico).
- **Owner**: `lesson-engine` (seção `rewards` do package, ver
  `packages/lesson-engine/src/rewards`).
- **Regras de negócio**: conquistas não devem afetar a validação de `Challenge`s — são
  consequência do progresso, nunca pré-requisito técnico.
- **Riscos / observações**: o sistema de gamificação em si (quais conquistas existem,
  como pontuação funciona) está fora do escopo desta etapa — aqui só se define a
  entidade que guarda o resultado.

---

## 5. Professor / admin

Funcionalidades voltadas a quem ensina/administra, não a quem aprende. Pertence
majoritariamente ao produto (`apps/web`, painel do professor/admin), consumindo dados
agregados de `lesson-engine` — nunca reimplementando regra pedagógica no lado do
professor.

### Classroom

- **Propósito**: representa uma turma — um agrupamento de `User`s (`student`s) sob a
  responsabilidade de um ou mais `User`s com `Role` `teacher`, dentro de uma
  `Organization`.
- **Campos conceituais**: nome, `Organization` associada, professor(es) responsável(is),
  lista de alunos (via `Role`/matrícula na turma), `Course`(s) associados.
- **Relações**: N Classroom → 1 Organization; N Classroom → N User (alunos, via papel
  escopado); 1 Classroom → N Assignment.
- **Owner**: produto.
- **Regras de negócio**: um `Classroom` não duplica dados de `Course`/`Lesson` — apenas
  referencia o conteúdo já existente em `lesson-engine` e agrega visões de progresso
  (`StudentProgressView`) dos alunos daquela turma.
- **Riscos / observações**: nenhum.

### Assignment

- **Propósito**: representa uma tarefa atribuída pelo professor a uma `Classroom` (ex.:
  "completar o Módulo 2 até sexta-feira").
- **Campos conceituais**: referência a `Classroom`, `Course`/`Module`/`Lesson` alvo,
  prazo, instruções adicionais do professor.
- **Relações**: N Assignment → 1 Classroom; N Assignment → 1 Course/Module/Lesson (alvo).
- **Owner**: produto (a atribuição em si) consumindo `lesson-engine` (o conteúdo
  referenciado).
- **Regras de negócio**: um `Assignment` não altera o conteúdo pedagógico nem cria
  variações de `Lesson` — é uma referência com metadados (prazo, instruções) sobre
  conteúdo já existente.
- **Riscos / observações**: nenhum.

### StudentProgressView

- **Propósito**: visão agregada e somente-leitura do progresso de um aluno (ou de uma
  turma inteira), pensada para o painel do professor/admin.
- **Campos conceituais**: agregações sobre `Enrollment`/`LessonProgress`/
  `ChallengeProgress` (percentual concluído, tempo gasto, desafios com mais tentativas,
  última atividade).
- **Relações**: deriva de `Enrollment`, `LessonProgress`, `ChallengeProgress`,
  `AttemptHistory` — não é uma entidade primária, é uma projeção/visão.
- **Owner**: produto (camada de apresentação/agregação), lendo dados de `lesson-engine`.
  Não deve conter nenhuma lógica de validação pedagógica própria — apenas leitura e
  agregação do que já existe.
- **Regras de negócio**: somente leitura — nenhuma ação de um professor sobre esta view
  deve escrever diretamente em `LessonProgress`/`ChallengeProgress` (ver `ReviewEvent`
  abaixo para ações do professor que de fato alteram estado).
- **Riscos / observações**: nenhum.

### ReviewEvent

- **Propósito**: representa uma ação de revisão manual do professor sobre o progresso de
  um aluno — ex.: liberar manualmente um `Challenge` travado, adicionar uma observação,
  invalidar uma tentativa suspeita.
- **Campos conceituais**: referência ao `User` (professor) que realizou a ação,
  referência ao aluno/entidade afetada (`ChallengeProgress`/`LessonProgress`), tipo de
  ação, justificativa/comentário, timestamp.
- **Relações**: N ReviewEvent → 1 User (professor); N ReviewEvent → 1
  ChallengeProgress/LessonProgress (alvo).
- **Owner**: produto (ação do professor), mas a alteração de estado resultante em
  `ChallengeProgress`/`LessonProgress` continua sendo responsabilidade de
  `lesson-engine` — o professor não escreve diretamente nessas entidades, dispara uma
  intenção que a `lesson-engine` aplica.
- **Regras de negócio**: toda `ReviewEvent` deve ser auditável — nunca uma alteração
  silenciosa de progresso de aluno. Está diretamente relacionada a `AuditEvent` (seção
  6): uma `ReviewEvent` provavelmente gera um `AuditEvent` correspondente.
- **Riscos / observações**: nenhum.

---

## 6. Auditoria e segurança

Camada técnica e de conformidade — não pedagógica. Existe para rastreabilidade,
depuração e segurança, e deve ser tratada como preocupação transversal (cross-cutting),
não como parte de nenhuma engine específica.

### AuditEvent

- **Propósito**: registro genérico e append-only de uma ação relevante realizada no
  sistema (ex.: mudança de `Role`, `ReviewEvent` de professor, alteração de dados
  sensíveis de `Profile`).
- **Campos conceituais**: ator (`User` ou sistema), tipo de ação, entidade afetada,
  timestamp, metadados da ação (antes/depois, quando aplicável).
- **Relações**: N AuditEvent → 0..1 User (ator); N AuditEvent → qualquer entidade do
  domínio (referência genérica ao "alvo" da ação).
- **Owner**: transversal — não pertence a nenhuma engine; conceitualmente mais próximo
  de `@codechat/shared`/`@codechat/types` (contratos de evento) e do produto, nunca de
  `lesson-engine`/`terminal-engine`/`execution-engine` diretamente.
- **Regras de negócio**: `AuditEvent` é imutável — nunca é editado ou apagado após
  criado.
- **Riscos / observações**: **ARCHITECTURAL QUESTION candidata**: se `AuditEvent` deve
  ser uma entidade única e genérica (como descrita aqui) ou uma família de eventos
  tipados por domínio. Mantido genérico nesta v1 por simplicidade conceitual.

### SecurityEvent

- **Propósito**: registro de eventos especificamente relacionados a segurança —
  distintos de auditoria de negócio (ex.: tentativa de login falha repetida, comando
  potencialmente perigoso bloqueado pela `execution-engine`/`apps/runner`, violação de
  política de sandbox).
- **Campos conceituais**: tipo de evento de segurança, severidade, ator (quando
  identificável), contexto técnico (ex.: `TerminalSession`/`CommandAttempt` envolvido),
  timestamp.
- **Relações**: 0..1 SecurityEvent → 1 User; 0..1 SecurityEvent → 1
  TerminalSession/CommandAttempt.
- **Owner**: transversal, com forte relação com `execution-engine`/`apps/runner`
  (é lá que a maioria dos eventos de segurança relacionados a execução de comandos
  seria originada) e com o produto (eventos de autenticação). Ver
  `docs/security/security-model.md`, que ainda está pendente de definição detalhada.
- **Regras de negócio**: eventos de severidade alta devem poder ser correlacionados a um
  `RunnerExecutionLog`, quando aplicável, para investigação técnica.
- **Riscos / observações**: nenhum.

### RunnerExecutionLog (apenas conceitual)

- **Propósito**: log técnico/operacional de execuções que passaram por `apps/runner`
  (execução isolada fora do navegador) — pensado para observabilidade e depuração, não
  para consumo pedagógico.
- **Campos conceituais**: referência conceitual ao `ExecutionResult`/`CommandAttempt`
  de origem, recursos consumidos (tempo, memória — conceitual), adapter utilizado,
  estado do processo isolado, timestamp.
- **Relações**: 0..1 RunnerExecutionLog → 1 ExecutionResult.
- **Owner**: `apps/runner` (execução) e `execution-engine` (contrato de origem do
  resultado). **Não** é consumido por `lesson-engine`.
- **Regras de negócio**: nenhuma regra de negócio pedagógica deve depender de
  `RunnerExecutionLog` — é puramente operacional. Isso reforça a fronteira já
  registrada em `dependency-rules.md`: "o runner nunca deverá compartilhar diretamente o
  mesmo ambiente de execução do frontend", e por extensão, seus logs técnicos não devem
  vazar para a camada pedagógica.
- **Riscos / observações**: **puramente conceitual nesta etapa** — nenhuma decisão
  sobre onde/como esse log seria armazenado foi tomada (nem que seria em banco
  relacional; poderia ser um sistema de observabilidade separado). Citado apenas para
  reforçar a fronteira com `AttemptHistory` (seção 4): `AttemptHistory` é pedagógico
  (o que o aluno tentou e se acertou), `RunnerExecutionLog` é operacional (como a
  execução técnica se comportou).

---

## Fronteiras entre domínios (resumo)

Este resumo não substitui `docs/architecture/dependency-rules.md` — apenas mapeia as
entidades acima às regras já aprovadas.

| Domínio               | Entidades                                                                                                      | Owner                                            | Nunca deve...                                                                                   |
| --------------------- | -------------------------------------------------------------------------------------------------------------- | ------------------------------------------------ | ----------------------------------------------------------------------------------------------- |
| Identidade e acesso   | User, Profile, Role, Organization                                                                              | Produto / Auth                                   | ...ter regra de autorização decidida dentro de uma engine                                       |
| Estrutura pedagógica  | Course, Module, Lesson, Step, Challenge, Hint, ValidationRule                                                  | `lesson-engine`                                  | ...executar comandos ou inspecionar o terminal/filesystem diretamente                           |
| Execução e terminal   | TerminalSession, CommandAttempt, ExecutionRequest, ExecutionResult, VirtualFileSystemState, EnvironmentProfile | `terminal-engine` / `execution-engine`           | ...carregar regra pedagógica (validação de desafio)                                             |
| Progresso e avaliação | Enrollment, LessonProgress, ChallengeProgress, AttemptHistory, Achievement                                     | `lesson-engine`                                  | ...ser confundido com log técnico (`RunnerExecutionLog`)                                        |
| Professor/admin       | Classroom, Assignment, StudentProgressView, ReviewEvent                                                        | Produto (lendo `lesson-engine`)                  | ...escrever diretamente em `LessonProgress`/`ChallengeProgress` sem passar pela `lesson-engine` |
| Auditoria e segurança | AuditEvent, SecurityEvent, RunnerExecutionLog                                                                  | Transversal / `execution-engine` / `apps/runner` | ...ser consumido como fonte de regra pedagógica                                                 |

## O que este documento não é

- Não é um schema de banco de dados. Nenhuma entidade acima tem tipo de coluna,
  chave primária definida, índice ou constraint SQL.
- Não é um contrato TypeScript. Nenhuma `interface`/`type` foi criada em
  `@codechat/types` a partir deste documento nesta etapa.
- Não é uma decisão final sobre RLS (Row Level Security) do Supabase — isso pertence a
  `docs/security/security-model.md`, ainda pendente.
- Não define o vocabulário técnico completo de `ValidationRule` nem o formato de
  `ExecutionRequest`/`ExecutionResult` em nível de contrato — isso é aprofundado em
  `docs/architecture/engine-contracts-v1.md` (Etapa 003.1), que este documento
  incorpora apenas na medida do necessário para manter os dois consistentes entre si.
