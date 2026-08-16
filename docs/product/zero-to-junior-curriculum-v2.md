# Zero to Junior Curriculum v2

> Currículo pedagógico estratégico da RootScoll para levar o aluno do zero absoluto à prontidão
> prática de Desenvolvedor Júnior.
>
> Esta versão incorpora a pesquisa externa `Currículo Dev Júnior RootScoll.md` e a curadoria
> `docs/product/curriculum-research-notes-v2.md`.

## Status

- **Estado**: referência pedagógica oficial em revisão.
- **Substitui conceitualmente**: `zero-to-junior-curriculum-v1.md`, que permanece como histórico.
- **Não altera automaticamente**: `Learning Catalog v1`, contratos TypeScript ou blocos executáveis
  já publicados.
- **Uso imediato**: guiar telas do sistema, painéis de progresso, catálogo visual, sala Terminal,
  critérios de avaliação e roadmap de implementação.

## Princípio central

A RootScoll forma o aluno pelo **Modo Raiz**: teoria suficiente, prática real, erro autêntico,
avaliação objetiva e reflexão. O objetivo não é ensinar atalhos para "parecer dev", mas construir
autonomia técnica progressiva.

O aluno deve aprender a:

- entender o que está fazendo;
- executar no ambiente técnico real ou simulado;
- errar e depurar;
- explicar decisões;
- produzir evidência;
- revisar código próprio e de IA;
- construir portfólio com substância.

## Perfil de entrada

Aluno iniciante pode:

- usar computador e navegador, mas não entende terminal;
- confundir ferramenta, linguagem e aplicação;
- ter medo de "quebrar algo";
- consumir vídeos/tutoriais sem conseguir criar sozinho;
- não saber pesquisar erro;
- não entender como internet, código, servidor e banco se conectam.

## Perfil de saída

Um Desenvolvedor Júnior RootScoll deve conseguir:

- navegar e operar terminal com segurança;
- versionar trabalho com Git/GitHub;
- construir páginas HTML/CSS acessíveis e responsivas;
- escrever JavaScript e TypeScript básicos com clareza;
- consumir e criar APIs simples;
- modelar dados relacionais e escrever SQL básico/intermediário;
- escrever testes e ler falhas;
- depurar com método;
- usar logs sem vazar dados sensíveis;
- fazer deploy simples;
- reconhecer riscos comuns de segurança;
- usar IA como ferramenta auditada, não como muleta;
- explicar decisões técnicas em README, PR e entrevista.

## Macroestrutura

| Fase | Nome                         | Resultado principal                                                    |
| ---: | ---------------------------- | ---------------------------------------------------------------------- |
|    0 | Orientação e Mentalidade     | Aluno entende a jornada, o Modo Raiz e como aprender com erro.         |
|    1 | Máquina e Terminal           | Aluno perde medo da CLI e manipula filesystem com segurança.           |
|    2 | Git e Comunicação Técnica    | Aluno registra trabalho, lê diffs e colabora com histórico rastreável. |
|    3 | Web Base                     | Aluno constrói páginas semânticas, responsivas e acessíveis.           |
|    4 | JavaScript e DOM             | Aluno cria interatividade real sem framework.                          |
|    5 | TypeScript e Qualidade       | Aluno usa tipos, testes e debugging para reduzir erro.                 |
|    6 | Backend, HTTP e Dados        | Aluno entende APIs, Node.js, SQL e integração frontend/backend.        |
|    7 | Segurança, Deploy e Operação | Aluno publica com cuidado, lê logs e aplica segurança básica.          |
|    8 | Projeto Final e Carreira     | Aluno entrega portfólio defendível e se prepara para entrevistas.      |

## As 14 trilhas granulares

As 14 trilhas continuam válidas como progressão pedagógica interna:

1. Fundamentos digitais e mentalidade de desenvolvedor.
2. Terminal, sistema operacional e filesystem.
3. Git e GitHub.
4. Web fundamentos: HTML, CSS, acessibilidade e responsividade.
5. JavaScript e lógica de programação.
6. TypeScript para aplicações reais.
7. Node.js e backend introdutório.
8. Banco de dados e SQL.
9. APIs, HTTP e integração frontend/backend.
10. Testes, debugging, logs e qualidade.
11. Segurança básica para dev júnior.
12. Deploy, ambientes e noções de produção.
13. Projeto final guiado.
14. Preparação profissional: portfólio, GitHub, entrevistas e rotina de trabalho.

Decisão de produto recomendada: manter **6 macrotrilhas** para a UI principal e usar as **14 trilhas**
como trilhas pedagógicas internas. Isso evita uma navegação pesada para o aluno iniciante e mantém a
profundidade curricular.

## Competências por camada

| Camada            | Competências                                                                 |
| ----------------- | ---------------------------------------------------------------------------- |
| Fundamento mental | raciocínio lógico, decomposição, pesquisa, leitura de erro, persistência.    |
| Ferramental       | terminal, filesystem, Git, GitHub, documentação e comunicação assíncrona.    |
| Web base          | HTML, CSS, acessibilidade, responsividade, DOM e DevTools.                   |
| Programação       | JavaScript, TypeScript, módulos, async, testes e debugging.                  |
| Sistemas          | HTTP, APIs, Node.js, banco de dados, autenticação conceitual e logs.         |
| Operação          | deploy, ambientes, variáveis, observabilidade básica e incidentes simulados. |
| Segurança         | OWASP, input seguro, SQL injection, XSS, controle de acesso e segredos.      |
| Profissional      | portfólio, README, PR, post-mortem, entrevista e uso responsável de IA.      |

## Modelo de bloco pedagógico v2

Cada bloco deve seguir a sequência:

1. **Contexto**: por que o tema existe no trabalho real.
2. **Teoria curta**: conceito, vocabulário e modelo mental.
3. **Exemplo trabalhado**: demonstração guiada.
4. **Prática guiada**: aluno repete com variação leve.
5. **Prática independente**: aluno resolve sem passo a passo.
6. **Erro esperado**: sistema induz ou observa uma falha comum.
7. **Mentor**: dica progressiva, sem resposta pronta.
8. **Avaliação objetiva**: regra, teste, estado final, saída ou rubrica.
9. **Reflexão**: aluno registra o que errou, corrigiu e aprendeu.

## Avaliações por competência

| Avaliação               | Quando usar                      | Evidência gerada                                  |
| ----------------------- | -------------------------------- | ------------------------------------------------- |
| Validação de filesystem | Terminal e Git inicial           | Estado final de arquivos/pastas.                  |
| Teste automatizado      | JS, TS, API e regras de negócio  | Suíte passando e relatório de falha.              |
| Auditoria de HTML/CSS   | Web base                         | Semântica, acessibilidade e responsividade.       |
| Script de interação     | DOM e frontend                   | Interação reproduzível por teste.                 |
| Query checker           | SQL                              | Resultado correto e schema esperado.              |
| Log review              | Backend/operação                 | Logs úteis sem vazamento de segredo.              |
| Security probe          | Segurança básica                 | Payload bloqueado ou risco explicado.             |
| Post-mortem             | Debugging                        | Causa raiz, correção e prevenção.                 |
| Code review             | Projetos intermediários e finais | Comentários, decisões e refatorações.             |
| Entrevista simulada     | Preparação profissional          | Explicação oral/escrita de decisões técnicas.     |
| Auditoria de IA         | Uso responsável de IA            | Registro do prompt, resposta, riscos e correções. |

## Progressão de IA

| Fase             | Política de IA                                   |
| ---------------- | ------------------------------------------------ |
| Terminal inicial | IA bloqueada ou apenas dica conceitual.          |
| Git inicial      | IA não escreve comandos; mentor explica estados. |
| Web base         | IA pode explicar conceito, não gerar solução.    |
| JS/TS            | IA pode explicar erro após tentativa.            |
| Projetos         | IA pode revisar, aluno precisa justificar.       |
| Segurança        | IA auxilia em checklist, validação é objetiva.   |
| Projeto final    | Uso permitido, documentado e auditado.           |

## Primeiros 20 blocos MVP

| Ordem | Bloco                   | Tipo principal | Critério de conclusão                          |
| ----: | ----------------------- | -------------- | ---------------------------------------------- |
|     1 | Bem-vindo ao Modo Raiz  | Teoria         | Explicar o ciclo teoria/prática/avaliação.     |
|     2 | O que é terminal        | Teoria/prática | Executar primeiro comando e interpretar saída. |
|     3 | Onde estou?             | Terminal       | `pwd` correto e explicação do caminho.         |
|     4 | O que existe aqui?      | Terminal       | `ls` e leitura de arquivos esperados.          |
|     5 | Caminhando por pastas   | Terminal       | `cd`, `.` e `..` sem erro.                     |
|     6 | Criando diretórios      | Terminal       | `mkdir` cria estrutura solicitada.             |
|     7 | Criando arquivos        | Terminal       | `touch` cria arquivos corretos.                |
|     8 | Lendo arquivos          | Terminal       | `cat` mostra conteúdo esperado.                |
|     9 | Escrevendo conteúdo     | Terminal       | `echo`/redirecionamento futuro gera conteúdo.  |
|    10 | Movendo e copiando      | Terminal       | `cp`/`mv` produzem estado final correto.       |
|    11 | Removendo com cuidado   | Terminal       | `rm` remove somente alvo solicitado.           |
|    12 | Vendo a árvore          | Terminal       | `tree` confirma organização.                   |
|    13 | Diário de bordo técnico | Comunicação    | Markdown com aprendizado e erro registrado.    |
|    14 | O que é Git             | Git            | Explicar working tree, stage e commit.         |
|    15 | Primeiro repositório    | Git            | `git init` e `status` interpretado.            |
|    16 | Primeiro commit         | Git            | Commit semântico simples.                      |
|    17 | Lendo diferenças        | Git            | `diff` explicado antes/depois.                 |
|    18 | Branch de experimento   | Git            | Branch criada e retorno seguro à main.         |
|    19 | HTML como estrutura     | Web            | Página com landmarks básicos.                  |
|    20 | CSS Box Model           | Web            | Card/layout simples sem framework.             |

## Projetos progressivos

### Projeto 1: Diário de Bordo Técnico

- **Fase**: terminal + Git.
- **Entrega**: repositório local/remoto com notas Markdown.
- **Avalia**: terminal, Git, commits, README e reflexão.

### Projeto 2: Landing Page Acessível

- **Fase**: HTML/CSS.
- **Entrega**: página responsiva sem framework.
- **Avalia**: semântica, acessibilidade, responsividade e organização visual.

### Projeto 3: Terminal Tasker

- **Fase**: JavaScript/DOM ou Node introdutório.
- **Entrega**: gerenciador de tarefas com persistência local/JSON.
- **Avalia**: arrays, objetos, eventos, estado e debugging.

### Projeto 4: Dashboard com API Pública

- **Fase**: JS/TS + HTTP.
- **Entrega**: dashboard que consome API e lida com erro/loading/empty.
- **Avalia**: async, fetch, tratamento de falhas, componentização e UX operacional.

### Projeto 5: API REST de Biblioteca

- **Fase**: Node + SQL.
- **Entrega**: CRUD com banco relacional, testes e logs.
- **Avalia**: API, SQL, validação, segurança básica e testes.

### Projeto 6: Produto Final Guiado

- **Fase**: consolidação.
- **Entrega**: sistema full-stack pequeno, deploy simples e documentação.
- **Avalia**: arquitetura, segurança, testes, operação, comunicação e entrevista.

## Conteúdos fora do MVP

Não entram no MVP Zero to Junior:

- Kubernetes.
- AWS avançado.
- microsserviços;
- mensageria avançada;
- observabilidade corporativa completa;
- IA geradora de solução;
- certificação profissional oficial;
- professor/admin completo;
- Supabase antes do schema/RLS aprovado.

## Implicações para as telas do sistema

As próximas telas devem representar a jornada como uma operação de aprendizagem:

- dashboard com fase atual, competência dominante e evidência gerada;
- trilhas macro com progresso interno pelas 14 trilhas granulares;
- sala de aula com teoria, prática, erro esperado, mentor, avaliação e reflexão;
- painel lateral de controle com tentativas, competências, dicas usadas e evidências;
- perfil com portfólio, projetos, competências e histórico de post-mortems;
- área futura de certificado/atestado apenas como placeholder sujeito ao documento regulatório.

## Próximo passo de implementação

Antes de expandir conteúdo para todas as trilhas, implementar no produto:

1. painel do aluno orientado a competências;
2. detalhe de trilha com fases, blocos e projetos;
3. sala Terminal exibindo evidência gerada por bloco;
4. primeiro conjunto de 20 blocos MVP apenas até HTML/CSS inicial;
5. modelo de avaliação reutilizável para filesystem, Git e HTML/CSS.
