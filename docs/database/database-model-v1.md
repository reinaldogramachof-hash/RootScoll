# Database Model v1 — Supabase / Postgres Planning

> Documento conceitual de planejamento. **Nenhuma migration, SQL, tabela real, policy
> real ou Supabase client foi criado nesta etapa.** Nenhum comando do Supabase CLI
> (`supabase login`, `init`, `link`, `db`, `migration`) foi executado. Este documento
> mapeia o `docs/product/domain-model-v1.md` e o `docs/architecture/engine-contracts-v1.md`
> para candidatos a tabela em Postgres/Supabase — é o insumo para uma futura etapa de
> implementação (migrations reais), não a implementação em si.
>
> Sobre o projeto Supabase já provisionado pelo usuário (Project ref
> `chbbztqlxqahyrrprxxa`): este documento **não registra nenhuma credencial**. A
> connection string informada contém um placeholder de senha (`[YOUR-PASSWORD]`) e não
> deve ser usada nem completada aqui — nunca com senha real em texto plano em
> documentação versionada. A publishable key é mencionada apenas como uma configuração
> futura de frontend (variável de ambiente), sem que seu valor seja transcrito neste
> documento e sem criação de `.env`/`.env.local` nesta etapa. Nenhuma
> `service_role key` é mencionada por valor em nenhum lugar deste repositório — isso
> é reforçado tecnicamente em `docs/security/rls-planning-v1.md`.

## Como ler este documento

Para cada tabela candidata:

- **Nome sugerido** — em `snake_case`, plural, convenção padrão de Postgres/Supabase.
- **Entidade/domínio de origem** — a entidade correspondente no Domain Model v1.
- **Propósito** — por que a tabela existiria.
- **Colunas conceituais** — atributos prováveis, **sem tipo SQL, sem constraint,
  sem chave primária/estrangeira formal** — apenas nome e intenção.
- **Relações** — com quais outras tabelas candidatas, em linguagem natural.
- **Owner conceitual** — mesmo conceito de "Owner" do Domain Model v1: qual módulo do
  monorepo é responsável pela regra de negócio associada a essa tabela (mesmo que a
  tabela em si viva só no banco).
- **Exposição esperada** — uma de quatro categorias, usada como insumo direto para
  `rls-planning-v1.md`:
  - **privada**: nunca exposta a nenhum cliente, nem mesmo ao dono do dado, via API
    pública — só acessível internamente (ex.: por uma função de banco ou processo
    de backend confiável).
  - **authenticated**: qualquer usuário autenticado pode ler/escrever seus próprios
    registros (ownership), mas não os de terceiros.
  - **teacher/admin**: authenticated, mas com leitura (e eventualmente escrita
    limitada) estendida a professores/administradores dentro do escopo de sua
    `Organization`/`Classroom`.
  - **service/internal**: só escrita por um processo de confiança (ex.: futura Edge
    Function, `apps/runner`, ou outro backend interno) — nunca diretamente pelo
    cliente, mesmo autenticado.
- **Riscos de RLS** — o que pode dar errado se a política de RLS for mal desenhada
  para essa tabela especificamente.
- **Observações de MVP** — se a tabela é essencial para um primeiro recorte funcional,
  se pode ser adiada, ou se deveria nem existir como tabela relacional.

Nomes de tabela, colunas e tipos aqui são **candidatos**, não definitivos — ficam
sujeitos a aprovação e possível ajuste antes de qualquer migration real.

---

## 0. Fora do escopo deste documento: `auth.users`

O Supabase Auth já gerencia sua própria tabela `auth.users` (schema `auth`, gerenciado
pela plataforma, fora do nosso controle direto). A entidade `User` do Domain Model v1
mapeia para `auth.users`, não para uma tabela nova que criaríamos — não a listamos como
candidata abaixo. Toda tabela nossa que precisar referenciar "o usuário" referencia
conceitualmente `auth.users.id`, tipicamente através da tabela `profiles` (ver seção 1),
seguindo o padrão comum do Supabase de estender `auth.users` com uma tabela `profiles`
1:1 em vez de duplicar dados de autenticação.

---

## 1. Identidade e acesso

### `profiles`

- **Entidade de origem**: `Profile` (Domain Model v1, seção 1).
- **Propósito**: dados de perfil pedagógico/social do usuário, estendendo
  `auth.users` 1:1.
- **Colunas conceituais**: referência ao usuário (`auth.users.id`), nome de exibição,
  avatar, idioma preferido, fuso horário, `EnvironmentProfile` padrão preferido
  (referência conceitual — ver seção 3 sobre se `environment_profiles` vira tabela).
- **Relações**: 1 `profiles` → 1 `auth.users`. Referenciada por praticamente todas as
  demais tabelas que precisam apontar "qual usuário".
- **Owner conceitual**: produto (`apps/web`).
- **Exposição esperada**: **authenticated** (o próprio usuário lê/edita seu perfil);
  campos específicos podem precisar de leitura por **teacher/admin** dentro do escopo
  de uma `Classroom`/`Organization` (ex.: nome de exibição de um aluno, para o painel
  do professor) — mas não o perfil completo de um estranho.
- **Riscos de RLS**: se a política permitir leitura ampla de `profiles` a qualquer
  autenticado, qualquer aluno passa a enxergar dados de perfil de qualquer outro
  aluno do sistema, mesmo fora de sua turma. Ownership (linha só editável pelo próprio
  dono) e uma política de leitura mais restrita para não-donos são necessárias.
- **Observações de MVP**: essencial desde o início — sem `profiles`, não há como
  associar progresso a um nome de exibição no painel do professor.

### `roles`

- **Entidade de origem**: `Role` (Domain Model v1, seção 1).
- **Propósito**: papel de autorização atribuído a um usuário, opcionalmente escopado a
  uma `organization` ou `classroom`.
- **Colunas conceituais**: referência ao usuário, tipo de papel (`student`, `teacher`,
  `admin` — conjunto ainda não aprovado formalmente, ver Domain Model v1), tipo de
  escopo (global / organization / classroom), referência ao escopo (nula quando
  global), data de concessão.
- **Relações**: N `roles` → 1 `profiles`/`auth.users`; N `roles` → 0..1
  `organizations`/`classrooms` (dependendo do tipo de escopo).
- **Owner conceitual**: produto/autenticação.
- **Exposição esperada**: **authenticated** para leitura do próprio papel (um usuário
  precisa saber seus próprios papéis para a UI se adaptar); **service/internal** para
  escrita — atribuir/revogar um papel nunca deveria ser uma operação que o próprio
  cliente executa livremente sobre si mesmo (um aluno não pode se autopromover a
  `admin`).
- **Riscos de RLS**: este é o candidato de **maior risco de todo o documento**. Se a
  policy de `INSERT`/`UPDATE` em `roles` não for extremamente restrita, um usuário mal-
  intencionado pode conceder a si mesmo um papel de `admin`/`teacher`. Ver
  `rls-planning-v1.md`, seção "cuidado com `service_role`" e "nunca autorizar só com
  `TO authenticated`".
- **Observações de MVP**: essencial. Sem `roles`, não há diferenciação
  student/teacher/admin em lugar nenhum do sistema.

### `organizations`

- **Entidade de origem**: `Organization` (Domain Model v1, seção 1 — nota: o Domain
  Model v1 já registra como `ARCHITECTURAL QUESTION` em aberto se `Organization`,
  `School` e `Cohort` serão hierárquicos ou uma entidade única; este documento assume,
  para efeito de planejamento de tabela, a simplificação de uma única entidade,
  consistente com a decisão (não definitiva) do Domain Model v1).
- **Propósito**: agrupamento institucional opcional acima do usuário individual.
- **Colunas conceituais**: nome, tipo (escola/empresa/curso avulso), responsável
  administrativo (referência a `profiles`), data de criação.
- **Relações**: 1 `organizations` → N `roles` (escopados); 1 `organizations` → N
  `classrooms`.
- **Owner conceitual**: produto.
- **Exposição esperada**: **teacher/admin** para leitura/escrita de metadados da
  própria organização; **authenticated** apenas para leitura do nome (ex.: um aluno
  vendo "você pertence à Organização X").
- **Riscos de RLS**: vazamento de metadados administrativos de uma organização para
  membros de outra, se o filtro de escopo não usar corretamente a relação via `roles`.
- **Observações de MVP**: pode ser adiada se o MVP focar em uso individual/autodidata
  sem contexto institucional — o Domain Model v1 já registra que uso sem
  `Organization` deve ser suportado. Recomendo manter no schema desde já (mesmo que
  vazia/sem uso no MVP) para não exigir migration disruptiva depois.

### `classrooms`

- **Entidade de origem**: `Classroom` (Domain Model v1, seção 5).
- **Propósito**: turma — agrupamento de alunos sob responsabilidade de um ou mais
  professores, dentro de uma `organization`.
- **Colunas conceituais**: nome, referência à `organization`, data de criação.
- **Relações**: N `classrooms` → 1 `organizations`; 1 `classrooms` → N
  `classroom_memberships`; 1 `classrooms` → N `assignments`.
- **Owner conceitual**: produto.
- **Exposição esperada**: **teacher/admin** para gestão; **authenticated** para leitura
  limitada por quem é membro (via `classroom_memberships`).
- **Riscos de RLS**: um professor de uma turma enxergando/gerenciando turmas de outra
  organização, se o escopo não for verificado via `organizations`/`roles`.
- **Observações de MVP**: pode ser adiada junto com `organizations` se o MVP for
  individual; caso contrário, essencial para o painel do professor (Etapa 003, seção
  5 do Domain Model v1).

### `classroom_memberships`

- **Entidade de origem**: implementação concreta de `Role` escopado a `Classroom`
  (Domain Model v1 não tinha uma entidade separada para isso — introduzida aqui por
  necessidade prática de consulta eficiente; ver observação abaixo).
- **Propósito**: associa um usuário a uma `classroom` com um papel específico dentro
  dela (aluno ou professor daquela turma), de forma consultável diretamente sem
  precisar filtrar toda a tabela `roles` por tipo de escopo.
- **Colunas conceituais**: referência à `classroom`, referência ao usuário, papel
  dentro da turma (`student` | `teacher`), data de entrada.
- **Relações**: N `classroom_memberships` → 1 `classrooms`; N `classroom_memberships`
  → 1 `profiles`.
- **Owner conceitual**: produto.
- **Exposição esperada**: **teacher/admin** para gestão de matrícula na turma;
  **authenticated** para o próprio usuário ler suas próprias associações.
- **Riscos de RLS**: exatamente o mesmo risco de `roles` — inserir a própria linha
  livremente permitiria autoassociação indevida a uma turma como `teacher`.
- **Observações de MVP**: **`ARCHITECTURAL QUESTION` candidata** — há sobreposição
  conceitual real entre `classroom_memberships` e `roles` escopado a `classroom`.
  Manter as duas é uma decisão de conveniência de consulta (desnormalização
  intencional), não uma exigência do Domain Model v1. O Arquiteto pode preferir manter
  apenas `roles` com escopo `classroom` e eliminar esta tabela, ou o inverso. Sinalizado
  para decisão explícita antes da migration real.

---

## 2. Conteúdo pedagógico

### `courses`

- **Entidade de origem**: `Course` (Domain Model v1, seção 2).
- **Propósito**: maior unidade de conteúdo pedagógico.
- **Colunas conceituais**: título, descrição, nível, tecnologias abordadas (lista
  conceitual), estado de publicação, autor/responsável (referência a `profiles`), data
  de criação/atualização.
- **Relações**: 1 `courses` → N `modules`; 1 `courses` → N `enrollments`.
- **Owner conceitual**: `lesson-engine`.
- **Exposição esperada**: **authenticated** para leitura de cursos publicados;
  **teacher/admin** (autores de conteúdo) para leitura/escrita de rascunhos.
- **Riscos de RLS**: aluno enxergando `courses` não publicados se a policy de leitura
  não filtrar por estado de publicação (ou por autoria, para autores verem seus
  próprios rascunhos).
- **Observações de MVP**: essencial.

### `modules`

- **Entidade de origem**: `Module` (Domain Model v1, seção 2).
- **Propósito**: agrupamento intermediário de `lessons` dentro de um `course`.
- **Colunas conceituais**: referência ao `course`, título, ordem, descrição curta.
- **Relações**: N `modules` → 1 `courses`; 1 `modules` → N `lessons`.
- **Owner conceitual**: `lesson-engine`.
- **Exposição esperada**: **authenticated** (herda a visibilidade do `course` pai).
- **Riscos de RLS**: se a visibilidade de `modules` não for derivada corretamente da
  visibilidade de `courses` (curso não publicado, mas módulo exposto isoladamente).
- **Observações de MVP**: essencial.

### `lessons`

- **Entidade de origem**: `Lesson` (Domain Model v1, seção 2).
- **Propósito**: unidade de ensino específica.
- **Colunas conceituais**: referência ao `module`, título, objetivo de aprendizagem,
  conteúdo teórico (markdown/texto), ordem, referência a `EnvironmentProfile`
  recomendado (ver seção 3 sobre se isso é FK para tabela ou um valor de enum).
- **Relações**: N `lessons` → 1 `modules`; 1 `lessons` → N `steps`; 1 `lessons` → N
  `lesson_progress`.
- **Owner conceitual**: `lesson-engine`.
- **Exposição esperada**: **authenticated** (herdando visibilidade do `course`).
- **Riscos de RLS**: mesmo padrão de `modules`.
- **Observações de MVP**: essencial.

### `steps`

- **Entidade de origem**: `Step` (Domain Model v1, seção 2).
- **Propósito**: menor unidade sequencial dentro de uma `lesson`.
- **Colunas conceituais**: referência à `lesson`, tipo (instrução/teoria, prático,
  checkpoint), ordem, conteúdo.
- **Relações**: N `steps` → 1 `lessons`; 0..1 `steps` → 0..1 `challenges`.
- **Owner conceitual**: `lesson-engine`.
- **Exposição esperada**: **authenticated**.
- **Riscos de RLS**: nenhum além do já coberto por `lessons`.
- **Observações de MVP**: essencial.

### `challenges`

- **Entidade de origem**: `Challenge` (Domain Model v1, seção 2).
- **Propósito**: desafio prático associado a um `step`.
- **Colunas conceituais**: referência ao `step`, enunciado, objetivo esperado
  (descrito em texto, não em regra executável — a regra executável vive em
  `validation_rules`), referência a `EnvironmentProfile` exigido, número máximo de
  tentativas (se limitado).
- **Relações**: N `challenges` → 1 `steps`; 1 `challenges` → N `hints`; 1 `challenges`
  → N `validation_rules`; 1 `challenges` → N `challenge_progress`.
- **Owner conceitual**: `lesson-engine` (definição do desafio — nunca a execução, ver
  `engine-contracts-v1.md`).
- **Exposição esperada**: **authenticated** para leitura do enunciado; escrita restrita
  a **teacher/admin**/autores.
- **Riscos de RLS**: nenhum além do já coberto por `lessons`/`courses`. Atenção
  específica: o enunciado pode ser lido por qualquer autenticado, mas isso **não deve
  incluir a solução** — se uma futura coluna de "resposta esperada" for adicionada,
  ela não pertence a esta tabela exposta ao cliente (ver risco espelhado em
  `validation_rules` abaixo).
- **Observações de MVP**: essencial.

### `hints`

- **Entidade de origem**: `Hint` (Domain Model v1, seção 2).
- **Propósito**: dica progressiva para um `challenge`.
- **Colunas conceituais**: referência ao `challenge`, nível da dica, conteúdo, custo
  (se aplicável a gamificação).
- **Relações**: N `hints` → 1 `challenges`.
- **Owner conceitual**: `lesson-engine`.
- **Exposição esperada**: **authenticated**, mas **revelação progressiva** — a policy
  de leitura sozinha não impede um cliente malicioso de consultar todas as dicas de
  uma vez via API direta; a revelação progressiva é regra de produto, não de RLS
  (ver risco abaixo).
- **Riscos de RLS**: RLS por si só não impõe "revele só a dica de nível N depois que o
  aluno pediu N-1" — isso é lógica de aplicação/negócio. Se `hints` for exposta
  diretamente via API pública do Supabase sem uma camada intermediária (função RPC ou
  view filtrada por progresso), um cliente pode ler todas as dicas de um desafio de
  uma vez. **Risco relevante para decisão futura**: pode exigir uma function/RPC em vez
  de leitura direta de tabela.
- **Observações de MVP**: pode nascer simples (RLS básica de leitura por
  `authenticated`) e evoluir para RPC controlada quando a revelação progressiva virar
  requisito rígido de produto.

### `validation_rules`

- **Entidade de origem**: `ValidationRule` (Domain Model v1, seção 2).
- **Propósito**: regra que determina se uma tentativa satisfaz um `challenge`.
- **Colunas conceituais**: referência ao `challenge`, tipo de validação, parâmetros da
  validação, mensagem de erro associada.
- **Relações**: N `validation_rules` → 1 `challenges`.
- **Owner conceitual**: `lesson-engine`.
- **Exposição esperada**: **service/internal** — nunca exposta diretamente ao cliente.
- **Riscos de RLS**: **risco alto se exposta por engano**. Os parâmetros de uma
  `validation_rule` (ex.: "a saída esperada é exatamente `X`") são, na prática, o
  gabarito do desafio. Se esta tabela tiver RLS que permita leitura por
  `authenticated`, qualquer aluno pode consultar a resposta certa diretamente pela API
  do Supabase, contornando o terminal inteiramente. Deve ser tratada como dado
  sensível de conteúdo, avaliada apenas server-side (função/RPC/Edge Function futura),
  nunca lida diretamente pelo cliente.
- **Observações de MVP**: essencial para a validação funcionar, mas **a decisão de
  exposição (`service/internal`) é a mais importante deste bloco** e deve ser
  confirmada explicitamente pelo Arquiteto antes de qualquer implementação.

---

## 3. Execução e terminal

### `terminal_sessions`

- **Entidade de origem**: `TerminalSession` (Domain Model v1, seção 3).
- **Propósito**: sessão ativa/encerrada de uso do terminal visual.
- **Colunas conceituais**: referência ao usuário, `EnvironmentProfile` ativo (ver
  discussão de `environment_profiles` abaixo), timestamp de início, timestamp de
  última atividade, estado.
- **Relações**: N `terminal_sessions` → 1 `profiles`; 1 `terminal_sessions` → N
  `command_attempts`; 1 `terminal_sessions` → 0..1
  `virtual_filesystem_snapshots`/alternativa (ver abaixo).
- **Owner conceitual**: `terminal-engine`.
- **Exposição esperada**: **authenticated** (ownership — só o próprio usuário lê/cria
  suas sessões); **teacher/admin** pode precisar de leitura agregada (não
  necessariamente da sessão bruta) para `student_progress_view`.
- **Riscos de RLS**: vazamento de sessões de um aluno para outro se ownership não for
  estritamente aplicado.
- **Observações de MVP**: essencial, mas ver observação de política de retenção/
  expiração — o Domain Model v1 já registra isso como ponto em aberto.

### `command_attempts`

- **Entidade de origem**: `CommandAttempt` (Domain Model v1, seção 3).
- **Propósito**: comando individual digitado pelo aluno.
- **Colunas conceituais**: referência à `terminal_session`, texto do comando (bruto),
  `EnvironmentProfile` no momento, timestamp.
- **Relações**: N `command_attempts` → 1 `terminal_sessions`; 1 `command_attempts` →
  0..1 `execution_requests`.
- **Owner conceitual**: `terminal-engine`.
- **Exposição esperada**: **authenticated** (ownership via `terminal_session` →
  usuário).
- **Riscos de RLS**: mesmo padrão de `terminal_sessions`. Também **append-only** — ver
  `rls-planning-v1.md`.
- **Observações de MVP**: essencial. Volume de escrita pode ser alto (um registro por
  comando digitado) — relevante para uma futura decisão de particionamento/retenção,
  fora do escopo desta etapa.

### `execution_requests`

- **Entidade de origem**: `ExecutionRequest` (Domain Model v1, seção 3, incorporado na
  Etapa 003.2; `engine-contracts-v1.md`, seções 1 e 2).
- **Propósito**: intenção de execução de um `command_attempt`, contrato técnico entre
  `terminal-engine` e `execution-engine`.
- **Colunas conceituais**: referência ao `command_attempt`, `EnvironmentProfile`
  vigente, timestamp de despacho, estado (pendente/em processamento/resolvido).
- **Relações**: 1 `execution_requests` → 1 `command_attempts`; 1 `execution_requests`
  → 0..1 `execution_results`.
- **Owner conceitual**: fronteira `terminal-engine`/`execution-engine` (nenhuma das
  duas é dona isolada — ver `engine-contracts-v1.md`).
- **Exposição esperada**: **authenticated** para leitura (ownership indireto via
  `command_attempt` → `terminal_session` → usuário); escrita tende a ser
  **service/internal** se o despacho de execução passar por uma função de borda em vez
  de `INSERT` direto do cliente (decisão técnica futura, não tomada aqui).
- **Riscos de RLS**: se a escrita for liberada diretamente ao cliente sem validação,
  um cliente malicioso poderia forjar `execution_requests` desconectadas de um
  `command_attempt` legítimo. Recomendação de planejamento: escrita via função/RPC de
  confiança, não `INSERT` bruto do cliente — decisão a confirmar na etapa de
  implementação.
- **Observações de MVP**: **`ARCHITECTURAL QUESTION` candidata** — pode não precisar
  ser uma tabela persistida separadamente no MVP mais simples (poderia ser um estado
  transitório, nunca persistido, se `terminal-engine`/`execution-engine` rodarem
  síncronos no mesmo processo do navegador para os adapters locais como
  `virtual-shell`). Persistir como tabela passa a fazer mais sentido quando a execução
  se torna assíncrona/distribuída (ex.: `remote-runner`). Sinalizado para decisão do
  Arquiteto.

### `execution_results`

- **Entidade de origem**: `ExecutionResult` (Domain Model v1, seção 3;
  `engine-contracts-v1.md`, seção 2).
- **Propósito**: resultado de uma `execution_request`, único formato que
  `lesson-engine` está autorizada a consumir.
- **Colunas conceituais**: referência à `execution_request`, stdout, stderr, código de
  saída, duração, adapter utilizado, resumo do estado resultante do filesystem virtual
  (referência conceitual a `virtual_filesystem_snapshots`, não o snapshot inteiro
  embutido), timestamp de conclusão.
- **Relações**: 1 `execution_results` → 1 `execution_requests`; 0..1
  `execution_results` → 1..N `attempt_history` (quando avaliado contra um
  `challenge`).
- **Owner conceitual**: `execution-engine`.
- **Exposição esperada**: **authenticated** para leitura (ownership indireto); escrita
  **service/internal** — só o processo de execução (potencialmente `apps/runner` para
  adapters remotos) deve poder gravar um resultado, nunca o cliente diretamente
  (senão um aluno poderia forjar um `ExecutionResult` de sucesso sem ter executado
  nada).
- **Riscos de RLS**: **risco alto se a escrita for liberada ao cliente.** Este é,
  depois de `roles` e `validation_rules`, o candidato mais sensível do documento —
  `execution_results` é a fonte de verdade que `lesson-engine` usa para decidir se um
  desafio foi cumprido; se o cliente puder inserir/editar livremente, todo o sistema de
  validação pode ser contornado.
- **Observações de MVP**: essencial, mas a exposição **service/internal** para escrita
  precisa ser confirmada como requisito não-negociável desde o primeiro protótipo
  funcional, não algo a "reforçar depois".

### `virtual_filesystem_snapshots` (alternativa conceitual)

- **Entidade de origem**: `VirtualFileSystemState` (Domain Model v1, seção 3).
- **Propósito**: estado do filesystem virtual em um dado momento.
- **Colunas conceituais**: referência à `terminal_session`, estrutura de
  diretórios/arquivos (conceitual — provavelmente um documento/JSON, não linhas
  relacionais normalizadas), diretório de trabalho atual, timestamp do snapshot.
- **Relações**: N `virtual_filesystem_snapshots` → 1 `terminal_sessions` (pode haver
  mais de um snapshot por sessão ao longo do tempo, ou só o mais recente, a decidir).
- **Owner conceitual**: `terminal-engine` (representação), com mutações orquestradas
  pela `execution-engine`.
- **Exposição esperada**: **authenticated** (ownership via `terminal_session`).
- **Riscos de RLS**: mesmo padrão de `terminal_sessions`; risco adicional se o
  filesystem virtual de um usuário puder crescer sem limite (relevante para política
  de tamanho/retenção, fora do escopo de RLS em si).
- **Observações de MVP**: **`ARCHITECTURAL QUESTION` candidata, herdada do Domain
  Model v1** — se o FS virtual deve persistir entre sessões (favorecendo uma tabela
  relacional em Postgres) ou ser efêmero por sessão (favorecendo um formato fora do
  Postgres, ex.: em memória no navegador ou em um cache volátil como Redis, sem
  necessidade de tabela). Nomeada aqui como candidata a tabela **condicional** a essa
  decisão — se o FS for efêmero, esta tabela pode nem existir. Não decidido nesta
  etapa.

### `environment_profiles` (avaliação: provavelmente não deveria ser tabela)

- **Entidade de origem**: `EnvironmentProfile` (Domain Model v1, seção 3).
- **Propósito conceitual**: identificar qual "sistema operacional simulado" está
  ativo (linux, macos, windows-cmd, powershell).
- **Avaliação**: o conjunto de perfis é pequeno, conhecido e definido em
  `packages/terminal-engine/src/profiles` (código, não dado de usuário). Isso é um
  forte indicativo de que `EnvironmentProfile` **não precisa ser uma tabela em
  Postgres** — um tipo enumerado (`ENUM` do Postgres) ou mesmo uma constante
  compartilhada em `@codechat/types`, referenciada por outras tabelas
  (`terminal_sessions.environment_profile`, `lessons.recommended_environment_profile`,
  etc.) como uma coluna de texto/enum, é suficiente e evita uma tabela de
  "lookup" com uma junção desnecessária.
- **Recomendação**: **não criar `environment_profiles` como tabela candidata**, a
  menos que surja um requisito concreto de extensibilidade em runtime (ex.: permitir
  que administradores criem novos perfis sem deploy de código) — o que não está
  previsto em nenhum documento aprovado até aqui. Listada nesta seção apenas para
  registrar que foi avaliada, conforme pedido explicitamente no escopo desta etapa
  ("se realmente fizer sentido como tabela").

---

## 4. Progresso e avaliação

### `enrollments`

- **Entidade de origem**: `Enrollment` (Domain Model v1, seção 4).
- **Propósito**: matrícula de um usuário em um `course`.
- **Colunas conceituais**: referência ao usuário, referência ao `course`, data de
  início, estado, progresso agregado (percentual — possivelmente calculado, não
  armazenado; decisão técnica futura).
- **Relações**: N `enrollments` → 1 `profiles`; N `enrollments` → 1 `courses`; 1
  `enrollments` → N `lesson_progress`.
- **Owner conceitual**: `lesson-engine`.
- **Exposição esperada**: **authenticated** (ownership); **teacher/admin** para leitura
  agregada dentro do escopo de sua `classroom`.
- **Riscos de RLS**: vazamento de matrícula/progresso de um aluno para outro aluno, ou
  para um professor fora do escopo da turma daquele aluno.
- **Observações de MVP**: essencial.

### `lesson_progress`

- **Entidade de origem**: `LessonProgress` (Domain Model v1, seção 4).
- **Propósito**: avanço de um usuário em uma `lesson`.
- **Colunas conceituais**: referência à `enrollment`, referência à `lesson`, estado,
  timestamp de início/conclusão, referência ao `step` atual.
- **Relações**: N `lesson_progress` → 1 `enrollments`; N `lesson_progress` → 1
  `lessons`; 1 `lesson_progress` → N `challenge_progress`.
- **Owner conceitual**: `lesson-engine`.
- **Exposição esperada**: **authenticated** (ownership indireto via `enrollment`);
  **teacher/admin** para leitura agregada.
- **Riscos de RLS**: mesmo padrão de `enrollments`.
- **Observações de MVP**: essencial.

### `challenge_progress`

- **Entidade de origem**: `ChallengeProgress` (Domain Model v1, seção 4).
- **Propósito**: avanço/resultado de um usuário em um `challenge`.
- **Colunas conceituais**: referência ao `lesson_progress`, referência ao `challenge`,
  estado, número de tentativas, dicas utilizadas, timestamp de conclusão.
- **Relações**: N `challenge_progress` → 1 `lesson_progress`; N `challenge_progress` →
  1 `challenges`; 1 `challenge_progress` → N `attempt_history`.
- **Owner conceitual**: `lesson-engine`.
- **Exposição esperada**: **authenticated** (ownership indireto); **teacher/admin**
  para leitura agregada; escrita da transição para "concluído" tende a ser
  **service/internal** (decidida por uma função que aplica `validation_rules` sobre
  `execution_results`, não diretamente pelo cliente — ver risco abaixo).
- **Riscos de RLS**: se o cliente puder escrever diretamente o estado "concluído" em
  `challenge_progress`, o aluno pode se autodeclarar aprovado em qualquer desafio sem
  de fato resolvê-lo. Mesma classe de risco de `execution_results`.
- **Observações de MVP**: essencial; a restrição de escrita é tão importante quanto a
  de `execution_results`.

### `attempt_history`

- **Entidade de origem**: `AttemptHistory` (Domain Model v1, seção 4).
- **Propósito**: histórico append-only de tentativas avaliadas.
- **Colunas conceituais**: referência ao `challenge_progress`, referência ao
  `execution_result` avaliado, resultado da validação, timestamp.
- **Relações**: N `attempt_history` → 1 `challenge_progress`; N `attempt_history` → 1
  `execution_results`.
- **Owner conceitual**: `lesson-engine` (decide passou/falhou), consumindo
  `execution_results` técnico.
- **Exposição esperada**: **authenticated** (ownership indireto, leitura do próprio
  histórico); **teacher/admin** para leitura agregada; escrita **service/internal**.
- **Riscos de RLS**: deve ser **append-only** de fato — nenhuma policy de `UPDATE`/
  `DELETE` deveria existir para linhas já escritas, nem para o próprio dono (ver
  `rls-planning-v1.md`).
- **Observações de MVP**: essencial para qualquer forma de feedback histórico ao
  aluno ("suas tentativas anteriores").

### `achievements`

- **Entidade de origem**: `Achievement`/`Reward` (Domain Model v1, seção 4).
- **Propósito**: conquista/recompensa de gamificação.
- **Colunas conceituais**: referência ao usuário, tipo de conquista, critério que a
  desbloqueou, timestamp, referência opcional a `course`/`lesson`/`challenge`.
- **Relações**: N `achievements` → 1 `profiles`; 0..1 `achievements` → 0..1
  `courses`/`lessons`/`challenges`.
- **Owner conceitual**: `lesson-engine`.
- **Exposição esperada**: **authenticated** (ownership); leitura pública/agregada
  eventual para elementos sociais de gamificação é uma decisão de produto futura, não
  assumida aqui.
- **Riscos de RLS**: baixo relativo às demais tabelas deste bloco — o pior caso de
  vazamento é social (ver quais conquistas alguém tem), não pedagógico/de segurança.
  Ainda assim, escrita deve ser **service/internal** (o cliente não deve poder se
  autoconceder conquistas).
- **Observações de MVP**: pode ser adiada — o sistema de gamificação em si está fora
  do escopo do Domain Model v1 e desta etapa; a tabela é citada para completude do
  mapeamento pedido.

---

## 5. Professor / admin

### `assignments`

- **Entidade de origem**: `Assignment` (Domain Model v1, seção 5).
- **Propósito**: tarefa atribuída por um professor a uma `classroom`.
- **Colunas conceituais**: referência à `classroom`, tipo/referência do alvo
  (`course`/`module`/`lesson`), prazo, instruções adicionais, referência ao professor
  que criou.
- **Relações**: N `assignments` → 1 `classrooms`; N `assignments` → 1
  `courses`/`modules`/`lessons` (alvo).
- **Owner conceitual**: produto, consumindo `lesson-engine`.
- **Exposição esperada**: **teacher/admin** para escrita; **authenticated** (membros
  da `classroom`) para leitura.
- **Riscos de RLS**: aluno de uma turma enxergando `assignments` de outra turma, se o
  filtro de escopo não usar `classroom_memberships`/`roles` corretamente.
- **Observações de MVP**: pode ser adiada junto com o bloco de `classrooms`.

### `review_events`

- **Entidade de origem**: `ReviewEvent` (Domain Model v1, seção 5).
- **Propósito**: ação de revisão manual de um professor sobre o progresso de um
  aluno.
- **Colunas conceituais**: referência ao professor (usuário) que realizou a ação,
  referência ao alvo (`challenge_progress`/`lesson_progress`), tipo de ação,
  justificativa/comentário, timestamp.
- **Relações**: N `review_events` → 1 `profiles` (professor); N `review_events` → 1
  `challenge_progress`/`lesson_progress` (alvo).
- **Owner conceitual**: produto (ação), mas a alteração de estado resultante em
  `challenge_progress`/`lesson_progress` permanece responsabilidade de
  `lesson-engine`.
- **Exposição esperada**: **teacher/admin** para escrita (só dentro do escopo da
  própria `classroom`); **authenticated** para o aluno afetado ler os eventos que o
  afetam (transparência); **teacher/admin** para leitura ampla dentro do escopo.
- **Riscos de RLS**: professor de uma turma revisando/alterando progresso de aluno de
  outra turma, se o escopo não for verificado. Também: `review_events` deveria ser
  **append-only** (nunca editar/apagar uma revisão já feita) — mesma classe de risco
  de `attempt_history`/`audit_events`.
- **Observações de MVP**: pode ser adiada; relevante quando o painel do professor
  ganhar ações de revisão manual, não apenas leitura.

### `student_progress_view` (view/projeção conceitual — sem SQL)

- **Entidade de origem**: `StudentProgressView` (Domain Model v1, seção 5).
- **Propósito**: visão agregada e somente-leitura do progresso de um aluno/turma,
  para o painel do professor.
- **Natureza**: **não é uma tabela** — é uma projeção conceitual sobre `enrollments`,
  `lesson_progress`, `challenge_progress` e `attempt_history`. Quando implementada,
  provavelmente como uma `VIEW` (ou `MATERIALIZED VIEW`, se performance exigir) do
  Postgres — sem SQL definido nesta etapa, apenas a intenção.
- **Colunas conceituais (agregadas)**: percentual concluído, tempo gasto, desafios com
  mais tentativas, última atividade — todos derivados das tabelas de origem, nunca
  armazenados de forma independente/duplicada nesta etapa.
- **Owner conceitual**: produto (camada de apresentação/agregação), lendo dados de
  `lesson-engine`.
- **Exposição esperada**: **teacher/admin**, escopado à `classroom`/`organization`.
- **Riscos de RLS específicos de view**: uma `VIEW` no Postgres, por padrão, roda com
  os privilégios de quem a criou (`SECURITY DEFINER` implícito em versões antigas de
  view, ou comportamento a confirmar conforme versão do Postgres/Supabase) — se não
  configurada com cuidado (`security_invoker`, quando disponível), pode acabar
  **contornando** o RLS das tabelas de origem, expondo dados de progresso além do que
  as policies das tabelas base permitiriam. Ver `rls-planning-v1.md`, seção "riscos de
  usar views".
- **Observações de MVP**: pode ser adiada — o painel do professor pode inicialmente
  consultar as tabelas base diretamente com policies apropriadas, promovendo a view
  quando houver necessidade real de agregação performática.

---

## 6. Auditoria e segurança

### `audit_events`

- **Entidade de origem**: `AuditEvent` (Domain Model v1, seção 6).
- **Propósito**: registro genérico e append-only de ações relevantes no sistema.
- **Colunas conceituais**: ator (referência a `profiles`, nula para ações do sistema),
  tipo de ação, tipo/referência da entidade afetada (genérico), timestamp, metadados
  (antes/depois, quando aplicável).
- **Relações**: N `audit_events` → 0..1 `profiles` (ator); referência genérica a
  qualquer outra tabela (sem FK rígida, por natureza genérica — decisão técnica
  futura sobre como modelar essa referência polimórfica).
- **Owner conceitual**: transversal — mais próximo de `@codechat/shared`/
  `@codechat/types` (contratos de evento) e do produto do que de qualquer engine.
- **Exposição esperada**: **teacher/admin**, escopado (um professor só vê eventos
  relevantes à sua turma/organização) — nunca **authenticated** amplo, já que eventos
  de auditoria podem revelar ações administrativas sensíveis; **privada**/**
  service/internal** para os eventos mais sensíveis (ex.: mudança de `roles`).
- **Riscos de RLS**: **deve ser append-only sem exceção** — nenhuma policy de
  `UPDATE`/`DELETE`, nem para admin (correção de um evento de auditoria errado deveria
  gerar um novo evento corretivo, nunca apagar o original). Vazamento de eventos entre
  organizações se o escopo não for aplicado.
- **Observações de MVP**: pode nascer minimalista (poucos tipos de evento) e crescer
  conforme mais ações passem a exigir auditoria.

### `security_events`

- **Entidade de origem**: `SecurityEvent` (Domain Model v1, seção 6).
- **Propósito**: eventos especificamente de segurança (tentativas de login falhas,
  comandos bloqueados, violação de sandbox).
- **Colunas conceituais**: tipo de evento, severidade, ator (quando identificável),
  contexto técnico (referência a `terminal_session`/`command_attempt`), timestamp.
- **Relações**: 0..1 `security_events` → 1 `profiles`; 0..1 `security_events` → 1
  `terminal_sessions`/`command_attempts`.
- **Owner conceitual**: transversal, com forte relação com `execution-engine`/
  `apps/runner` (origem técnica) e produto (eventos de autenticação).
- **Exposição esperada**: **privada**/**service/internal** — não exposta a
  `authenticated` genérico nem, em geral, a `teacher`; possivelmente visível a
  `admin` de plataforma (não necessariamente o mesmo `admin` escopado a uma
  `organization` — distinção a esclarecer em `docs/security/security-model.md`, ainda
  pendente).
- **Riscos de RLS**: exposição indevida revelaria detalhes de tentativas de ataque/
  abuso a outros usuários, incluindo potencialmente ao próprio autor da tentativa
  suspeita, o que seria contraproducente para segurança.
- **Observações de MVP**: pode ser adiada até que haja mecanismo técnico real de
  detecção desses eventos (`execution-engine`/`apps/runner` ainda não implementados).

### `runner_execution_logs` (opcional / operacional — provavelmente fora do Postgres)

- **Entidade de origem**: `RunnerExecutionLog` (Domain Model v1, seção 6, já marcado
  como "apenas conceitual"; `engine-contracts-v1.md` reforça que não é consumido por
  `lesson-engine`).
- **Propósito**: log técnico/operacional de execuções via `apps/runner`.
- **Colunas conceituais**: referência conceitual ao `execution_result`, recursos
  consumidos (tempo, memória), adapter utilizado, estado do processo isolado,
  timestamp.
- **Avaliação**: dado de observabilidade operacional de alto volume e baixo valor
  para consulta relacional (ninguém faz `JOIN` pedagógico com isso). Candidatos mais
  adequados, fora do escopo desta etapa de decidir definitivamente: um sistema de
  logging/observability dedicado (ex.: serviço de logs, não Postgres), ou, se
  permanecer em Postgres, uma tabela sem RLS de leitura para clientes (só
  `service/internal`) e possivelmente fora do schema `public`, para reduzir
  superfície de exposição acidental.
- **Owner conceitual**: `apps/runner` / `execution-engine`.
- **Exposição esperada**: **service/internal** exclusivamente, se implementada em
  Postgres.
- **Riscos de RLS**: baixo risco de vazamento pedagógico (não tem dado de aluno
  diretamente sensível além de metadados técnicos), mas alto risco de **poluir** o
  schema público com uma tabela de alto volume e nenhuma necessidade de acesso via
  API pública — reforça a recomendação de mantê-la fora de `public` ou fora do
  Postgres.
- **Observações de MVP**: **não recomendado para o MVP**. Mantida aqui apenas para
  registrar que foi avaliada, conforme pedido no escopo desta etapa.

---

## Resumo de exposição por tabela

| Tabela                         | Exposição esperada                                                          | Observação-chave                                                     |
| ------------------------------ | --------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| `profiles`                     | authenticated (ownership) + leitura limitada teacher/admin                  | nome de exibição pode vazar entre alunos se leitura não for restrita |
| `roles`                        | authenticated (leitura própria) / service-internal (escrita)                | maior risco de escalonamento de privilégio de todo o documento       |
| `organizations`                | teacher/admin (gestão) / authenticated (leitura de nome)                    | —                                                                    |
| `classrooms`                   | teacher/admin (gestão) / authenticated (membros)                            | —                                                                    |
| `classroom_memberships`        | teacher/admin (gestão) / authenticated (leitura própria)                    | sobreposição conceitual com `roles` — decisão pendente               |
| `courses`                      | authenticated (publicados) / teacher/admin (rascunhos)                      | —                                                                    |
| `modules`                      | authenticated (herda `courses`)                                             | —                                                                    |
| `lessons`                      | authenticated (herda `courses`)                                             | —                                                                    |
| `steps`                        | authenticated (herda `lessons`)                                             | —                                                                    |
| `challenges`                   | authenticated (leitura) / teacher/admin (escrita)                           | não deve carregar gabarito                                           |
| `hints`                        | authenticated, revelação progressiva é regra de app, não de RLS             | pode exigir RPC no futuro                                            |
| `validation_rules`             | **service/internal — nunca exposta ao cliente**                             | contém o gabarito do desafio                                         |
| `terminal_sessions`            | authenticated (ownership)                                                   | —                                                                    |
| `command_attempts`             | authenticated (ownership)                                                   | append-only                                                          |
| `execution_requests`           | authenticated (leitura) / possivelmente service-internal (escrita)          | decisão de persistência ainda em aberto                              |
| `execution_results`            | authenticated (leitura) / **service/internal (escrita)**                    | fonte de verdade da validação — não pode ser forjada pelo cliente    |
| `virtual_filesystem_snapshots` | authenticated (ownership)                                                   | condicional a decisão de persistência do FS virtual                  |
| `environment_profiles`         | **não recomendado como tabela**                                             | usar enum/constante                                                  |
| `enrollments`                  | authenticated (ownership) / teacher/admin (agregado)                        | —                                                                    |
| `lesson_progress`              | authenticated (ownership) / teacher/admin (agregado)                        | —                                                                    |
| `challenge_progress`           | authenticated (leitura) / **service/internal (escrita de conclusão)**       | mesmo risco de `execution_results`                                   |
| `attempt_history`              | authenticated (leitura) / service/internal (escrita)                        | append-only                                                          |
| `achievements`                 | authenticated (ownership) / service/internal (escrita)                      | risco baixo, ainda assim sem autoconcessão                           |
| `assignments`                  | teacher/admin (escrita) / authenticated (leitura, membros)                  | —                                                                    |
| `review_events`                | teacher/admin (escrita, escopada) / authenticated (leitura do próprio alvo) | append-only                                                          |
| `student_progress_view`        | teacher/admin, escopado                                                     | view — cuidado com `security_invoker`                                |
| `audit_events`                 | teacher/admin (escopado) / privada para eventos sensíveis                   | append-only sem exceção                                              |
| `security_events`              | privada / service-internal                                                  | não expor a `authenticated` genérico                                 |
| `runner_execution_logs`        | service/internal, se existir em Postgres                                    | não recomendado para MVP                                             |

## O que este documento não é

- Não é uma migration. Nenhum `CREATE TABLE`, tipo de coluna, chave primária/
  estrangeira, índice ou constraint foi escrito.
- Não é uma policy de RLS — isso é aprofundado, ainda conceitualmente, em
  `docs/security/rls-planning-v1.md`.
- Não é uma decisão final sobre nomes de coluna/tabela — são candidatos para revisão
  do Arquiteto antes de qualquer migration real.
- Não conecta, autentica ou executa nada contra o projeto Supabase real
  (`chbbztqlxqahyrrprxxa`). Nenhum comando do Supabase CLI foi executado nesta etapa.
