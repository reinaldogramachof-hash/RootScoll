# App Navigation v1

> Documento de planejamento de produto/navegação. Define a arquitetura de
> acesso e navegação do CodeChat — como as telas se encaixam, o que cada uma
> responde ao usuário e como a Sala de Aula Terminal deixa de ser uma tela
> isolada para fazer parte de um fluxo completo. Não implementa autenticação
> real, Supabase, RLS, backend ou IA real — ver "Limites explícitos" ao final.
> A implementação local correspondente (shell mock em memória) está em
> `apps/web/src/features/app-shell/`.

## Visão do fluxo principal

```
Login / acesso
  -> Painel do usuário
       -> Perfil
       -> Trilhas e módulos
            -> Sala de Aula Terminal
       -> Sala de Aula Terminal (acesso direto, quando há progresso em andamento)
```

O aluno entra pelo login, cai no painel (ponto central do produto — não a
Sala Terminal, que é uma tela de trabalho, não a página inicial), e a partir
dali navega para perfil, para o catálogo de trilhas, ou direto para a sala em
que está com progresso em andamento. A Sala de Aula Terminal preserva sua
identidade visual fullscreen (a "cara" do produto), mas deixa de ser a única
tela: existe dentro de um fluxo maior de acesso, progresso e gestão da
própria jornada.

## Papéis previstos

- **Aluno**: consome o conteúdo, pratica na Sala Terminal, acompanha o
  próprio progresso (`MockUser.role === 'aluno'`).
- **Professor**: acompanha turmas, identifica gargalos de aprendizagem,
  supervisiona alunos e matriz de competências (`MockUser.role === 'professor'`).
- **Parceiro (RH / Empresas)**: busca e recruta talentos técnicos com
  comprovação prática no terminal e portfólio de evidências (`MockUser.role === 'parceiro'`).
- **Admin/instituição**: gestão de turmas, licenciamento, relatórios
  institucionais (mercados B2B/governo descritos em
  `docs/product/product-vision-v1.md`, "Norte comercial").
- **Mentor IA (futuro)**: não é um usuário humano — é o papel que a política
  de IA pedagógica (`product-vision-v1.md`, "Política de IA pedagógica";
  "AI Pedagogy Policy v1", ainda não formalizada) atribui a um mentor
  automatizado. Hoje representado apenas pelo mentor determinístico da Sala
  Terminal (`features/learning-flow/MentorWidget.tsx`), sem IA real.

## Rotas/telas planejadas

Não há roteador real nesta fase (sem `react-router`, sem URL sincronizada) —
a navegação é um estado local em memória
(`apps/web/src/features/app-shell/navigation-reducer.ts`, `AppScreen`). As
rotas abaixo são o **plano de produto**, o alvo para quando um roteador real
entrar; o mapeamento para os estados locais implementados está indicado
entre parênteses.

| Rota planejada                | Estado local (`AppScreen`) | Papel       | O que a tela responde ao usuário                                     |
| ----------------------------- | -------------------------- | ----------- | -------------------------------------------------------------------- |
| `/login`                      | `login`                    | Todos       | "Como eu entro no CodeChat/RootScoll e seleciono minha sessão?"      |
| `/app`                        | `dashboard`                | Aluno       | "Onde eu estou na minha jornada? O que eu faço agora?"               |
| `/app/perfil`                 | `profile`                  | Todos       | "Quem sou eu aqui, e qual meu progresso geral ou dados da empresa?"  |
| `/app/trilhas`                | `tracks`                   | Aluno       | "O que existe para eu aprender, e o que já está disponível?"         |
| `/app/sala/terminal/:blockId` | `terminal-classroom`       | Aluno       | "Deixe-me praticar, com o mínimo de distração possível."             |
| `/app/professor`              | `teacher-dashboard`        | Professor   | "Como estão minhas turmas e quais gargalos demandam atenção?"        |
| `/app/professor/turmas/:id`   | `teacher-classroom-detail` | Professor   | "Qual a situação nominal e matriz de competências desta turma?"      |
| `/app/parceiro`               | `partner-dashboard`        | Parceiro RH | "Quais talentos do ecossistema atendem às vagas abertas da empresa?" |
| `/app/parceiro/talentos/:id`  | `partner-talent-detail`    | Parceiro RH | "Quais as evidências práticas e score de prontidão deste talento?"   |

`/app/trilhas/:trackId` está descrita aqui como parte do plano de produto,
mas **não tem estado local próprio nesta fase** — o catálogo mock tem poucas
trilhas/módulos, e `tracks` já lista módulos por trilha inline; uma tela de
detalhe por trilha vale a pena quando o catálogo crescer.

## Como a Sala Terminal se encaixa no fluxo

A Sala de Aula Terminal (`features/learning-flow/LearningFlowApp.tsx`) é
renderizada como **módulo interno** do shell, não como página independente:
o aluno entra nela a partir do painel ou do catálogo de trilhas
(`onEnterClassroom`), e sai dela de volta ao painel pelo botão "Sair da sala"
no painel de controle lateral (`onExitClassroom`). Dentro da sala, o visual
fullscreen terminal já aprovado é preservado sem alteração — a barra de
navegação do shell (`AppNavigation`) **não** aparece ali, para não competir
com o terminal.

## Menu lateral oculto da sala Terminal

Painel de controle recolhível, nascendo fechado, na borda direita da sala
(`features/learning-flow/Sidebar.tsx`). Itens planejados:

- índice do bloco atual — **implementado** (lista de blocos com estado
  concluído/atual/bloqueado).
- módulos/aulas — **implementado** via o mesmo índice de blocos (o catálogo
  de módulos de verdade, por trilha, ainda é o mock de
  `features/app-shell/mock-data.ts`, fora da sala).
- progresso detalhado — **implementado** (bloco atual, etapa atual).
- tentativas — **implementado** (contador de tentativas de comando na etapa
  atual).
- histórico de comandos — planejado, não implementado (exigiria guardar o
  histórico de `TerminalCommandOutcome` por sessão; hoje só as linhas de
  exibição existem, sem estrutura própria de histórico consultável).
- dicas desbloqueadas — planejado, não implementado (hoje só a dica _atual_
  é calculada por `selectHint`; não há lista acumulada de dicas já vistas).
- configurações do terminal — planejado, não implementado (não há
  preferências de terminal ainda — cores, tamanho de fonte, etc.).
- reiniciar exercício — planejado, não implementado (reiniciar de verdade
  exigiria resetar tanto o estado do fluxo quanto o filesystem virtual da
  sessão de terminal; hoje `useTerminalSession` não expõe uma operação de
  reset).
- sair da sala — **implementado** (`onExitClassroom`, volta ao painel).
- futuro: dúvida ao professor / mentor IA — planejado, não implementado (sem
  IA real ou canal com professor nesta fase, por regra explícita da tarefa).

Os itens não implementados aparecem na sidebar como uma lista estática "Em
breve", para a forma final do menu já existir visualmente sem fingir
funcionalidade que não existe.

## Limites explícitos

- Sem autenticação real — o login é mock; qualquer submit do formulário
  entra.
- Sem Supabase.
- Sem migrations.
- Sem backend real — todo estado é local, em memória (`useState`/`useReducer`
  do React), perdido ao recarregar a página.
- Sem IA real — o mentor da Sala Terminal continua determinístico
  (`selectHint`), sem chamada de API externa.
- Tudo mock/local por enquanto — usuário, trilhas, módulos e progresso são
  dados fixos em `features/app-shell/mock-data.ts`, não vêm de nenhuma fonte
  real.
