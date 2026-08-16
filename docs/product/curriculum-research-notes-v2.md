# Curriculum Research Notes v2

> Curadoria Codex do relatório externo `Currículo Dev Júnior RootScoll.md`.
>
> Objetivo: transformar a pesquisa recebida em critérios práticos para a arquitetura curricular da
> RootScoll, separando evidência, interpretação e decisão de produto.

## Status

- **Estado**: referência curricular em revisão.
- **Substitui**: `docs/product/curriculum-research-notes-v1.md` como base de pesquisa mais rica.
- **Não substitui ainda**: contratos TypeScript, `Learning Catalog v1` ou blocos executáveis locais.
- **Uso recomendado**: orientar telas, módulos, painéis pedagógicos, validadores e próximos prompts
  de execução.

## Qualidade das fontes

### Fontes primárias ou fortes

- Stack Overflow Developer Survey 2025: evidência de mercado e uso de IA por desenvolvedores.
- OWASP Top 10 e OWASP API Security Top 10: referência para segurança web e API.
- TypeScript Handbook: referência oficial de tipagem, tipos cotidianos e inferência.
- CS50 / Harvard: referência acadêmica para sequência introdutória e web.
- freeCodeCamp curriculum: referência pública de currículo prático.
- Full Stack Open / University of Helsinki: referência forte para sequência full-stack moderna.

### Fontes úteis, mas secundárias

- Reviews de The Odin Project, Class Central e materiais de acompanhamento de currículo.
- Artigos de mercado sobre IA e empregabilidade.
- Materiais sobre Cognitive Load Theory aplicados à educação em computação.

### Fontes fracas ou apenas contextuais

- Medium, blogs comerciais, Scribd, rastreadores pessoais de currículo e posts opinativos.
- Essas fontes podem inspirar hipóteses, mas não devem sustentar claims estratégicos isoladamente.

## Síntese da pesquisa

O relatório reforça que o júnior de 2026 não deve ser treinado apenas para copiar sintaxe ou seguir
tutoriais guiados. O diferencial está em:

- ler documentação;
- usar terminal e Git com autonomia;
- entender HTML/CSS/JS antes de frameworks;
- depurar erros reais;
- escrever e ler testes;
- compreender HTTP, APIs, banco de dados e logs;
- usar IA como apoio crítico, não como substituto do raciocínio;
- demonstrar competência por evidências: commits, projetos, relatórios, testes e decisões técnicas.

## Decisões pedagógicas incorporadas

1. **Terminal primeiro permanece como hipótese RootScoll**: não é uma verdade universal, mas é uma
   escolha consciente de produto para reduzir medo operacional e construir autonomia.
2. **Git deve entrar cedo**: idealmente depois dos primeiros comandos de filesystem, antes de HTML/CSS
   ganhar volume.
3. **JavaScript antes de TypeScript**: TS deve entrar como correção de fragilidades reais percebidas
   em JS, não como sintaxe inicial.
4. **React depois de DOM e JS vanilla**: framework entra como abstração sobre uma base já vivida.
5. **Segurança é transversal**: existe uma trilha dedicada, mas segurança deve aparecer desde terminal,
   Git, inputs, APIs, banco, logs e deploy.
6. **Debugging é competência central**: projetos quebrados, stack traces e post-mortems devem ser
   parte normal do currículo.
7. **IA deve ser treinada como objeto de revisão**: o aluno aprende a auditar respostas e código de
   IA antes de depender dela.
8. **Projetos devem gerar evidência**: cada fase precisa produzir artefatos verificáveis, não apenas
   "aulas assistidas".

## Ajustes à hipótese das 14 trilhas

A hipótese de 14 trilhas continua válida, mas deve ser entendida como **camadas curriculares**. Algumas
competências não devem esperar sua trilha formal para aparecer.

| Tema                    | Decisão v2                                                                   |
| ----------------------- | ---------------------------------------------------------------------------- |
| Terminal                | Trilha inicial e presença permanente em todas as fases.                      |
| Git/GitHub              | Trilha inicial, depois prática contínua em todos os projetos.                |
| Segurança               | Trilha específica e tema transversal desde o começo.                         |
| Debugging/logs          | Deve aparecer cedo, não apenas após full-stack.                              |
| IA                      | Tema transversal com modos bloqueado, assistido e auditoria.                 |
| Comunicação técnica     | Deve acompanhar Git, PRs, README, post-mortem e projeto final.               |
| Deploy                  | Não antecipar infra pesada; começar com deploy simples e ambiente/variáveis. |
| DevOps avançado         | Fora do escopo Zero to Junior.                                               |
| Kubernetes/AWS avançado | Fora do MVP curricular; conteúdo futuro, não promessa de júnior.             |

## Competências mínimas v2

As competências abaixo formam a base do perfil RootScoll de Desenvolvedor Júnior:

1. Raciocínio lógico e decomposição de problemas.
2. Terminal, filesystem e permissões.
3. Git, GitHub, commits, branches, PRs e conflitos.
4. HTML semântico.
5. CSS, Box Model, Flexbox, Grid, responsividade e acessibilidade.
6. JavaScript: tipos, funções, arrays, objetos, DOM, eventos, async/await.
7. TypeScript: tipos, interfaces, unions, generics básicos, `strict`.
8. HTTP, status codes, headers, CORS e cURL.
9. APIs REST e tratamento de falhas.
10. React básico/intermediário após DOM.
11. Node.js, módulos, filesystem, servidores HTTP e APIs.
12. Banco de dados relacional e SQL.
13. Autenticação conceitual: sessões, cookies, JWT, hashing e autorização.
14. Testes unitários e integração básica.
15. Debugging com DevTools, breakpoints e stack traces.
16. Logs estruturados e cuidado com dados sensíveis.
17. Deploy simples, ambientes e variáveis.
18. Segurança básica: OWASP, input, SQL injection, XSS, access control.
19. Leitura de documentação oficial.
20. Uso responsável de IA.
21. Comunicação técnica: README, PR, post-mortem e explicação de decisões.
22. Portfólio e entrevista técnica.
23. Manutenção de código existente.

## Técnicas pedagógicas recomendadas

- **Worked examples**: exemplos resolvidos antes de prática autônoma em tópicos novos.
- **Parsons Problems**: ordenar blocos lógicos antes de escrever código completo, especialmente no
  início.
- **Faded guidance**: reduzir ajuda progressivamente.
- **Projetos quebrados**: ensinar debugging por sistemas propositalmente com falha.
- **Post-mortem curto**: aluno registra erro, causa, correção e prevenção.
- **Rubrica de revisão**: clareza, funcionamento, segurança, testes, acessibilidade e manutenção.
- **Modos de IA**: bloqueado, dica conceitual, revisão crítica, auditoria de PR.

## Primeiros 20 blocos recomendados

Os primeiros blocos devem provar a metodologia e reduzir evasão por medo do terminal, sem diluir o
Modo Raiz.

| Ordem | Bloco                          | Competência central              | Avaliação objetiva                               |
| ----: | ------------------------------ | -------------------------------- | ------------------------------------------------ |
|     1 | O que é um computador para dev | Mentalidade e modelo mental      | Explicar arquivo, programa, terminal e processo. |
|     2 | Abrindo a sala Terminal        | Familiaridade com CLI            | Executar `pwd` e interpretar o diretório atual.  |
|     3 | Listando o mundo               | `ls`, árvore e leitura de saída  | Listar arquivos esperados.                       |
|     4 | Caminhos absolutos e relativos | `cd`, `.` e `..`                 | Navegar até um destino sem erro.                 |
|     5 | Criando estrutura              | `mkdir`                          | Criar árvore de pastas validada.                 |
|     6 | Criando arquivos               | `touch`                          | Arquivos existem no local correto.               |
|     7 | Lendo conteúdo                 | `cat`                            | Ler arquivo e responder pergunta simples.        |
|     8 | Escrevendo conteúdo            | `echo` e redirecionamento futuro | Conteúdo esperado no arquivo.                    |
|     9 | Copiando e movendo             | `cp`, `mv`                       | Estado final do filesystem.                      |
|    10 | Removendo com cuidado          | `rm` e risco operacional         | Remover apenas alvo correto.                     |
|    11 | Árvore do projeto              | `tree` e organização             | Estrutura bate com especificação.                |
|    12 | Diário de bordo                | Markdown e comunicação           | Criar nota técnica curta.                        |
|    13 | Git mental model               | working tree, stage, commit      | Classificar estados antes de usar comando.       |
|    14 | Primeiro repositório local     | `git init`, `status`             | Repositório inicializado e status interpretado.  |
|    15 | Primeiro commit                | `add`, `commit`                  | Commit com mensagem semântica simples.           |
|    16 | Histórico e reversão           | `log`, `diff`, recuperação       | Identificar mudança e explicar impacto.          |
|    17 | Branch de experimento          | `branch`, `switch`               | Criar branch e preservar main.                   |
|    18 | Merge conflict guiado          | conflito controlado              | Resolver conflito e registrar post-mortem.       |
|    19 | Primeiro HTML semântico        | estrutura e tags                 | Documento com landmarks básicos.                 |
|    20 | Primeiro CSS com Box Model     | caixa, spacing, cor e tipografia | Layout simples sem framework.                    |

## Projetos progressivos v2

1. **Diário de Bordo Técnico**: terminal + Markdown + Git local.
2. **Landing Page Acessível**: HTML/CSS puro, responsividade e Lighthouse.
3. **Terminal Tasker Local**: app simples que manipula tarefas/arquivos em JSON ou estado local.
4. **Dashboard Frontend com API Pública**: async/await, falhas de rede, loading/error/empty states.
5. **API REST de Biblioteca**: Node.js, SQL, validação, logs e testes.
6. **Projeto Final Guiado**: app full-stack com autenticação conceitual, testes, deploy simples e
   documentação.

## Política de IA no currículo

| Momento                 | Modo de IA                   | Regra                                                |
| ----------------------- | ---------------------------- | ---------------------------------------------------- |
| Fundamentos iniciais    | Bloqueado ou dica conceitual | IA não escreve comando/código.                       |
| Debugging inicial       | Dica progressiva             | IA explica tipo de erro, não entrega correção.       |
| Projetos intermediários | Revisão crítica              | IA pode revisar, aluno decide e justifica.           |
| Segurança               | Auditoria controlada         | IA pode sugerir riscos, validação é por teste/regra. |
| Projeto final           | Uso profissional documentado | Aluno declara onde usou IA e como auditou.           |

## O que não construir agora

- Kubernetes.
- AWS avançado.
- Microsserviços.
- Arquitetura distribuída complexa.
- Certificação profissional oficial.
- IA como validador de acerto.
- Sistema B2B institucional completo antes de validar o fluxo local.
- Currículo massivo antes dos primeiros blocos terem retenção e clareza.

## Próxima decisão curricular

A RootScoll deve decidir se a navegação de produto mostrará:

1. **6 trilhas macro** como no `Learning Catalog v1`, com 14 trilhas como subtrilhas; ou
2. **14 trilhas granulares** como navegação principal, agrupadas em fases.

Recomendação Codex: manter 6 macrotrilhas para navegação executiva e usar as 14 trilhas como
progressão pedagógica interna. Isso reduz complexidade de UI e preserva a profundidade curricular.
