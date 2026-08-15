# RLS Planning v1 — Row Level Security Strategy

> Documento conceitual de planejamento de segurança. **Nenhuma policy real, nenhum
> `CREATE POLICY`, nenhuma função `SECURITY DEFINER`, nenhum `ALTER TABLE ... ENABLE
ROW LEVEL SECURITY` foi executado ou escrito como SQL nesta etapa.** Este documento
> estabelece princípios e estratégia por domínio, a partir das tabelas candidatas
> descritas em `docs/database/database-model-v1.md`, para orientar a implementação
> real de RLS em uma etapa futura.
>
> Nenhuma credencial do projeto Supabase (`chbbztqlxqahyrrprxxa`) é registrada aqui.
> Este documento assume que a autenticação real será feita via Supabase Auth, mas não
> configura nada — ver seção final "O que depende de Supabase Auth real".

## Princípios gerais de RLS

1. **RLS habilitado por padrão em toda tabela do schema `public`.** Nenhuma tabela
   listada em `database-model-v1.md` deve ficar sem RLS habilitado assim que for
   criada — mesmo tabelas de exposição `service/internal`, que terão zero policies de
   acesso pelo `anon`/`authenticated` (RLS habilitado sem nenhuma policy permissiva
   equivale, na prática, a "ninguém do cliente acessa", que é exatamente o
   comportamento desejado para essas tabelas).
2. **Toda policy parte de ownership ou de escopo explícito, nunca de "qualquer
   autenticado".** Ver seção "nunca autorizar só com `TO authenticated`" abaixo — este
   é o princípio mais importante deste documento e o que mais frequentemente é violado
   por engano em implementações apressadas de RLS.
3. **Policies são por operação (`SELECT`, `INSERT`, `UPDATE`, `DELETE`), nunca uma
   política única "tudo ou nada".** Uma tabela pode (e frequentemente deve) permitir
   `SELECT` mais amplo que `INSERT`/`UPDATE`, e proibir `DELETE` inteiramente (ver
   "tabelas append-only").
4. **A regra de autorização vive no banco (via RLS), não apenas na aplicação.** A UI
   pode e deve esconder ações que o usuário não tem permissão de fazer, mas isso é
   apenas UX — a garantia real de segurança é a policy de RLS, porque qualquer cliente
   pode, em teoria, chamar a API do Supabase diretamente, ignorando a UI.
5. **Nenhuma policy deve ser escrita "genérica e depois refinada"** — cada tabela
   listada em `database-model-v1.md` recebe, na implementação futura, uma policy
   desenhada para o risco específico já identificado naquele documento (coluna
   "Riscos de RLS").

## Ownership por usuário

O padrão dominante neste sistema é **ownership direto ou indireto**: a maioria das
tabelas (`terminal_sessions`, `command_attempts`, `execution_requests`,
`execution_results`, `enrollments`, `lesson_progress`, `challenge_progress`,
`attempt_history`, `achievements`, `virtual_filesystem_snapshots`) pertence, em algum
nível de indireção, a um usuário específico via `auth.uid()`.

- **Ownership direto**: a tabela tem uma coluna que referencia diretamente o usuário
  (ex.: `terminal_sessions.user_id`). A policy compara essa coluna a `auth.uid()`.
- **Ownership indireto**: a tabela referencia outra tabela que tem ownership direto
  (ex.: `command_attempts` não tem `user_id` diretamente listado como obrigatório no
  planejamento, mas referencia `terminal_sessions`, que tem). A policy precisa
  verificar a cadeia completa — um erro comum é a policy verificar apenas o primeiro
  nível e assumir (incorretamente) que a integridade referencial garante o ownership
  correto.
- **Regra geral**: **um usuário só lê/escreve linhas onde ele é, direta ou
  indiretamente, o dono** — nunca uma tabela de progresso/execução deve ser legível
  por qualquer autenticado sem essa verificação.

## Escopo por organization/classroom

Para o bloco professor/admin (`classrooms`, `classroom_memberships`, `assignments`,
`review_events`) e para leitura agregada de progresso por `teacher`/`admin`
(`enrollments`, `lesson_progress`, `challenge_progress`, `attempt_history` quando lidos
por um professor, não pelo próprio aluno), ownership direto não é suficiente — é
necessário **escopo por organização/turma**.

- Um `teacher` só deve enxergar dados de alunos que estão em uma `classroom` da qual
  ele também é membro (via `classroom_memberships`, ou via `roles` escopado a
  `classroom`, dependendo de qual das duas tabelas for a fonte de verdade —
  `ARCHITECTURAL QUESTION` ainda aberta em `database-model-v1.md`).
- Um `admin` escopado a uma `organization` só deve enxergar dados dentro dessa
  `organization` — **não é um super-admin global** por padrão. Se existir um papel de
  administrador de plataforma (acima de qualquer `organization`), ele deve ser
  modelado como um caso à parte, explicitamente, não como consequência acidental de
  uma policy mal escoped.
- **Padrão de policy recomendado** (conceitual, sem SQL): "permita a operação se existe
  uma linha em `classroom_memberships`/`roles` que associa `auth.uid()` à
  `classroom`/`organization` da linha sendo acessada, com o papel apropriado para a
  operação". Isso normalmente significa uma subconsulta ou `EXISTS` dentro da policy —
  decisão de implementação futura, não expandida aqui.

## Diferença entre `student`, `teacher` e `admin`

Este documento assume, como no Domain Model v1, que o conjunto de papéis
(`student`/`teacher`/`admin`, possivelmente `content-author`) ainda não foi aprovado
formalmente pelo Arquiteto — a distinção abaixo é para efeito de planejamento de RLS,
não uma decisão final de produto.

- **`student`**: ownership estrito. Lê/escreve apenas o que é seu (perfil,
  progresso, sessões de terminal, tentativas). Lê conteúdo pedagógico publicado. Nunca
  escreve em `validation_rules`, `challenge_progress` (estado de conclusão),
  `execution_results`, `roles`, `audit_events`, `security_events`.
- **`teacher`**: ownership estrito sobre seus próprios dados (é também um usuário),
  mais leitura escopada (e, para `assignments`/`review_events`, escrita escopada)
  sobre dados de alunos dentro de suas `classrooms`. Nunca deveria ter acesso amplo a
  dados fora do seu escopo, mesmo sendo `teacher` — o papel não é hierarquicamente
  "acima de todos os alunos", é "responsável pelos alunos de suas turmas".
- **`admin`**: leitura/escrita mais ampla, mas **ainda escopada à sua
  `organization`**, a menos que exista uma decisão explícita e documentada de um papel
  de administrador de plataforma sem escopo — decisão que este documento não toma,
  apenas identifica como possível necessidade futura (ex.: para suporte técnico da
  equipe do CodeChat em si, não de uma escola cliente).
- **Risco explícito de confundir os três**: escrever uma única policy do tipo "se
  `role` é `teacher` ou `admin`, libera tudo" é o erro mais comum e mais perigoso de
  se cometer aqui — sempre combinar o papel com o escopo (seção anterior).

## Tabelas que devem ser append-only

As seguintes tabelas, listadas em `database-model-v1.md`, devem ter policies de
`UPDATE` e `DELETE` **inexistentes** (nenhuma policy = nenhuma operação permitida,
nem para o dono, nem para `admin`) na implementação futura:

- `command_attempts` — registro histórico do que o aluno digitou; corrigir um erro de
  digitação não apaga a tentativa, o aluno só tenta de novo.
- `attempt_history` — histórico de tentativas avaliadas; nunca reescrito.
- `audit_events` — por definição, um log de auditoria que pode ser editado não é mais
  confiável como auditoria.
- `review_events` — uma revisão de professor, uma vez registrada, não deve ser
  apagada; uma correção deveria gerar um novo `review_event`, não substituir o
  anterior.
- `security_events` — mesma lógica de `audit_events`.

Se, no futuro, houver necessidade genuína de "correção" nessas tabelas (ex.: um bug
gravou dado errado), a estratégia recomendada é um processo administrativo fora do
caminho normal de RLS (ex.: acesso direto via papel de banco privilegiado, fora do
alcance de `authenticated`), nunca uma policy de `UPDATE` liberada a qualquer papel de
aplicação.

## Tabelas que não devem ser expostas ao cliente

Retomando `database-model-v1.md`, as tabelas abaixo devem ter, na implementação
futura, **RLS habilitado sem nenhuma policy de `SELECT` para `authenticated`/`anon`**
(exposição `privada` ou `service/internal`):

- `validation_rules` — contém o gabarito do desafio; exposição ao cliente permitiria
  ler a resposta certa sem resolver o `challenge`.
- `execution_results` (escrita) — leitura pode ser liberada ao dono (ownership), mas
  **escrita nunca** deve vir diretamente do cliente.
- `challenge_progress` (escrita da transição para "concluído") — mesma lógica.
- `security_events` — não deveria ser lido nem pelo próprio autor de uma tentativa
  suspeita, nem por `teacher` comum.
- `runner_execution_logs`, se vier a existir em Postgres — puramente operacional, sem
  necessidade de acesso via API pública em nenhuma circunstância.

Nestes casos, a escrita real (quando necessária) deve ocorrer por um caminho de
confiança — tipicamente uma função de borda (Edge Function) ou processo de backend
autenticado com uma chave de serviço mantida **fora do cliente**, nunca por `INSERT`/
`UPDATE` direto vindo do navegador do aluno, mesmo autenticado.

## Riscos de usar views

`student_progress_view` (Domain Model v1, seção 5; `database-model-v1.md`, seção 5) é
a candidata mais provável a virar uma `VIEW`/`MATERIALIZED VIEW`. Riscos a considerar
quando ela for implementada:

- **Views podem contornar RLS das tabelas base** se criadas sem o cuidado devido. O
  comportamento padrão histórico de views no Postgres tende a executar com os
  privilégios de quem definiu a view, não de quem a consulta — o que pode expor dados
  que as policies das tabelas de origem (`enrollments`, `lesson_progress`,
  `challenge_progress`, `attempt_history`) não permitiriam ver diretamente.
- **Mitigação planejada**: ao implementar, avaliar explicitamente a opção
  `security_invoker` (disponível em versões recentes de Postgres/Supabase) para que a
  view respeite as policies de RLS de quem está consultando, em vez de rodar com
  privilégio elevado. Esta é uma decisão técnica a confirmar no momento da
  implementação, não tomada aqui — mas já registrada como requisito de avaliação
  obrigatória, não opcional.
- **Alternativa mais simples para o MVP**: adiar a `VIEW` e fazer o painel do
  professor consultar as tabelas base diretamente, com policies de leitura escopada já
  corretas — elimina o risco de view completamente, ao custo de mais consultas no
  cliente/backend.

## Cuidado com `service_role`

- A `service_role key` do Supabase **ignora RLS inteiramente** — qualquer código que a
  utilize tem acesso irrestrito ao banco, como um superusuário.
- **Nunca deve ser usada no frontend (`apps/web`)**, nunca deve ser commitada,
  documentada com valor real, ou exposta em nenhum artefato deste repositório —
  princípio já reforçado no cabeçalho deste documento e em `database-model-v1.md`.
- Seu uso legítimo, quando existir, é restrito a processos de backend de confiança
  (ex.: uma futura Edge Function que precise, por exemplo, escrever em
  `execution_results` em nome do sistema após uma execução real, ou aplicar
  `validation_rules` e então atualizar `challenge_progress`) — nunca no cliente, e
  idealmente com o menor escopo de operação possível, não como padrão geral de acesso.
- Toda vez que uma tabela for marcada como `service/internal` em
  `database-model-v1.md`, isso significa "a escrita legítima passa por um processo
  de confiança que pode usar `service_role` (ou um papel de banco equivalente e mais
  restrito, a avaliar)", não "qualquer chave secreta serve".

## Nunca autorizar só com `TO authenticated` sem ownership

Este é o erro mais comum em implementações apressadas de RLS: escrever uma policy do
tipo "permita `SELECT`/`UPDATE` para `TO authenticated`" sem nenhuma condição adicional
de ownership/escopo — o que, na prática, significa "qualquer usuário logado pode ler/
editar a linha de qualquer outro usuário".

- **Toda policy deste sistema deve combinar `TO authenticated` (ou `TO
teacher`/`admin`, se papéis de banco chegarem a existir) com uma condição de
  ownership ou escopo** (`auth.uid() = user_id`, ou o padrão de `EXISTS` descrito na
  seção "escopo por organization/classroom").
- Nenhuma tabela deste planejamento tem uma policy legítima de "qualquer autenticado
  vê/edita qualquer linha" — mesmo tabelas de conteúdo pedagógico público
  (`courses`, `modules`, `lessons`, `steps`, `challenges`) têm, no mínimo, a condição
  "publicado = true" combinada a `TO authenticated`, não uma liberação incondicional.

## Uso futuro de `app_metadata`/claims — com cautela

- Se decisões de autorização vierem a depender de claims do JWT (ex.: `role` embutido
  no token via `app_metadata`), isso deve usar exclusivamente **`app_metadata`**,
  nunca **`user_metadata`** — `user_metadata` é editável pelo próprio usuário
  autenticado através da API padrão do Supabase Auth, então usá-lo para autorização
  permitiria que um usuário se autopromovesse simplesmente editando seu próprio
  perfil. `app_metadata` só é editável por processos com `service_role` (ou
  equivalente), o que o torna seguro para esse propósito — mas ainda assim é uma
  decisão a tomar com cautela.
- **Preferência deste planejamento**: a tabela `roles` (seção "Identidade e acesso" de
  `database-model-v1.md`) já modela isso de forma consultável diretamente via RLS
  (join/`EXISTS` contra `roles`), sem depender de sincronizar papéis para dentro do
  JWT. Usar claims é uma otimização de performance possível no futuro (evita uma
  consulta extra por policy), não um requisito — e só deve ser adotada com plano
  explícito de como manter `app_metadata` sincronizado com `roles` sem abrir brecha de
  inconsistência ou de escrita indevida.
- Reforçando o princípio já registrado nas SUPABASE SECURITY RULES: **autorização não
  deve depender de `user_metadata`** em nenhuma circunstância, nesta ou em etapas
  futuras.

## Sobre `auth.role()`, `SECURITY DEFINER` e `WITH CHECK`

- **`auth.role()` não deve ser usado como padrão de autorização.** Ele distingue
  apenas `anon` de `authenticated` (e alguns papéis internos do Supabase) — não
  carrega nenhuma noção de `student`/`teacher`/`admin` nem de ownership. Usá-lo
  sozinho como base de uma policy repete o erro já descrito acima ("qualquer
  autenticado"). A preferência deste planejamento é `TO authenticated` combinado
  sempre com uma condição de ownership/escopo derivada de `roles`/`classroom_memberships`,
  nunca `auth.role()` isolado como critério de decisão.
- **`SECURITY DEFINER` deve ser evitado, salvo decisão explícita futura.** Funções
  `SECURITY DEFINER` rodam com o privilégio de quem as criou, contornando RLS de
  propósito — útil em casos muito específicos (ex.: uma função controlada que aplica
  `validation_rules` e atualiza `challenge_progress` em nome do sistema), mas perigosa
  se usada por padrão ou sem revisão cuidadosa de cada caso. Nenhuma função
  `SECURITY DEFINER` foi criada nesta etapa; qualquer necessidade futura deve ser
  justificada e revisada individualmente pelo Arquiteto, não adotada como prática
  geral.
- **`UPDATE` sempre precisa de `SELECT` policy e `WITH CHECK`, na implementação
  futura.** No Postgres/Supabase, uma policy de `UPDATE` sem uma condição `USING`
  equivalente à de `SELECT` pode permitir atualizar uma linha que o usuário não
  deveria nem conseguir ler; e uma policy de `UPDATE`/`INSERT` sem `WITH CHECK` pode
  permitir que, após a edição, a linha resultante deixe de satisfazer a condição de
  ownership original (ex.: um usuário reatribuindo uma linha sua para outro
  `user_id`). Toda tabela com `UPDATE` liberado a qualquer papel de aplicação deve, na
  implementação futura, ter ambas as cláusulas revisadas explicitamente — não é
  suficiente copiar a condição de `SELECT` sem verificar `WITH CHECK` também.

## O que depende de Supabase Auth real

Estas decisões **não podem ser finalizadas neste documento** porque dependem de
Supabase Auth estar de fato configurado (fora do escopo desta etapa — nenhum
`supabase login`/`init`/`link` foi executado):

- O formato exato de `auth.uid()` disponível nas policies (garantido pela própria
  plataforma, mas só verificável com um projeto conectado).
- Se `app_metadata`/claims customizados serão usados (seção acima) — depende de como
  o fluxo de login/signup for implementado.
- Política de expiração de sessão do Supabase Auth em si (diferente, mas relacionada,
  da política de expiração de `terminal_sessions` já sinalizada como pendente no
  Domain Model v1).
- Estratégia de provedores de autenticação (e-mail/senha, OAuth) — o Domain Model v1
  já registra isso como "a decidir" para a entidade `User`.
- Qualquer teste real de uma policy de RLS — sem um projeto Supabase conectado e com
  usuários reais autenticados, políticas só podem ser revisadas por leitura, não
  validadas em execução. Nenhuma policy foi testada nesta etapa, porque nenhuma
  policy foi criada nesta etapa.

## O que este documento não é

- Não é uma implementação de RLS. Nenhum `CREATE POLICY`, `ENABLE ROW LEVEL SECURITY`
  ou função de banco foi escrito.
- Não é uma configuração do Supabase Auth (providers, redirect URLs, templates de
  e-mail) — fora de escopo desta etapa.
- Não substitui `docs/security/security-model.md`, que continua responsável pelo
  modelo de segurança mais amplo da aplicação (incluindo `apps/runner`), do qual RLS é
  apenas uma parte.
- Não registra nem referencia o valor de nenhuma credencial do projeto Supabase
  `chbbztqlxqahyrrprxxa` — nem a connection string (que, aliás, foi fornecida com
  placeholder de senha e não deve ser completada em nenhum documento), nem a
  publishable key, nem qualquer `service_role key`.
