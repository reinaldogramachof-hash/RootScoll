# Zero to Junior Curriculum v1

> Documento pedagógico estratégico oficial da RootScoll.
> Define a jornada completa de aprendizado, do absoluto zero à prontidão para o mercado de trabalho como Desenvolvedor Júnior, operando no **Modo Raiz**.

## 1. Visão Geral da Jornada Zero -> Desenvolvedor Júnior

A jornada RootScoll não é um curso; é uma simulação imersiva da realidade profissional. O currículo foi desenhado para desconstruir abstrações e ensinar os fundamentos da computação e do desenvolvimento web moderno de baixo para cima (bottom-up). Começamos no terminal, dominamos a rede e a web, e finalmente construímos aplicações completas com engenharia de software rigorosa.

## 2. Perfil Inicial do Aluno

- **Conhecimento**: Zero absoluto em programação ou computação avançada. Usuário comum de tecnologia.
- **Medos Comuns**: A "tela preta" (terminal), quebrar o computador, matemática avançada, não ser "inteligente o suficiente", a velocidade com que a tecnologia muda, a ameaça da Inteligência Artificial roubar vagas iniciantes.
- **Lacunas**: Não entende como a internet funciona por baixo dos panos, confunde ferramentas (editor de texto) com linguagem (código), não sabe pesquisar erros.
- **Objetivos**: Conseguir o primeiro emprego em tecnologia, fazer transição de carreira, construir independência financeira, entender o mundo digital.

## 3. Perfil Final Esperado (O Desenvolvedor Júnior "Raiz")

Ao final da jornada, o aluno não é um "copiador de tutoriais". As competências mínimas reais incluem:

- **Autonomia em Resolução de Problemas**: Sabe ler mensagens de erro, analisar logs e formular pesquisas técnicas eficazes.
- **Fluência de Terminal**: Navega, manipula arquivos, roda scripts e gerencia processos sem depender de interfaces gráficas.
- **Entendimento Sistêmico**: Compreende o fluxo completo da requisição: do clique no botão no navegador, roteamento DNS, recebimento na API, consulta no banco de dados e devolução do response.
- **Código Limpo e Seguro**: Escreve TypeScript validado, entende injeção de SQL (e como evitá-la), aplica testes de unidade básicos.
- **Maturidade de Ferramental**: Usa Git em equipe (branches, PRs, merge conflicts), entende CI/CD básico e faz deploy de containers/aplicações na nuvem.

## 4. Mapa Macro da Jornada por Fases

A jornada é dividida em 5 Grandes Fases:

1. **Fase de Fundação (Desmistificando a Máquina)**: Terminal, SO, Git e Mentalidade.
2. **Fase de Superfície (A Web que se Vê)**: HTML, CSS, Acessibilidade e a tríade inicial.
3. **Fase de Lógica e Estrutura (A Mente da Aplicação)**: JavaScript, Lógica Algorítmica e a transição vital para TypeScript.
4. **Fase de Profundidade (Dados e Servidores)**: Node.js, Bancos de Dados Relacionais, APIs e HTTP.
5. **Fase de Engenharia e Mercado (A Realidade Prática)**: Testes, Segurança, Deploy, Projeto Final e Preparação Profissional.

## 5. Trilhas Principais e Subtrilhas (As 14 Trilhas)

As fases acima são compostas por 14 trilhas curriculares obrigatórias:

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

## 6. Sequência Recomendada de Aprendizado

A sequência é **estritamente linear e bloqueante** entre fases maiores, mas pode permitir flexibilidade dentro de uma mesma trilha. A ordem segue a lista de 1 a 14 rigorosamente. Não se ensina Web sem antes dominar Git e Terminal. Não se ensina Backend sem antes dominar Typescript.

## 7. Pré-requisitos entre Trilhas

- Trilha 2 exige Trilha 1.
- Trilha 3 exige Trilha 2 (Git usa Terminal).
- Trilha 4 exige Trilha 3 (Código versão desde o primeiro arquivo HTML).
- Trilha 5 exige Trilha 4.
- Trilha 6 exige Trilha 5.
- Trilhas 7 e 8 exigem Trilha 6.
- Trilha 9 exige 7 e 8.
- Trilha 10 exige Trilha 9.
- Trilha 11, 12 e 13 exigem Trilha 10.
- Trilha 14 consolida todas.

## 8. Competências por Fase

- **Fundação**: Fluência CLI, controle de versão, mentalidade de engenharia.
- **Superfície**: Criação de layouts responsivos, estruturação semântica, domínio do DOM.
- **Lógica**: Manipulação de dados, assincronismo, tipagem estática, estruturação de código.
- **Profundidade**: Modelagem de dados (MER/DER), CRUD, arquitetura RESTful, autenticação stateless básica.
- **Engenharia**: CI/CD básico, conteinerização conceitual, segurança preventiva, portfólio acionável.

## 9. Projetos Práticos por Fase

- **Fase de Fundação**: Sistema de diário de bordo via terminal e Git (Markdown versionado).
- **Fase de Superfície**: Landing page responsiva e acessível para um produto fictício, hospedada no GitHub Pages.
- **Fase de Lógica**: Aplicação interativa complexa (ex: Calculadora financeira ou Kanban board local) tipada com TS.
- **Fase de Profundidade**: API RESTful completa de um sistema de gestão (ex: Gestão de Biblioteca) conectada a um banco PostgreSQL.
- **Fase de Engenharia**: O Projeto Final (Trilha 13), que integra frontend e backend num monorepo (ou repositórios conectados), com CI/CD, testes automatizados e deploy em produção (ex: Vercel/Render).

## 10. Avaliações Teóricas e Práticas por Bloco

Todo módulo adota a estrutura: `Teoria -> Prática -> Avaliação -> Conclusão`.

- **Teórica**: Compreensão do "Porquê". (Validada através de blocos teóricos e perguntas de contexto no ambiente).
- **Prática**: Execução do "Como". (Validada pelo _Execution Engine_ do terminal, ex: verificar se o arquivo existe, se o JSON retornado pela API tem o formato X, se a tipagem TS compila).

## 11. Critérios de Aprovação

A RootScoll não usa "notas" (0 a 10). O critério é binário e formativo:

- **Não Passou**: O código não compila, a saída está incorreta, a API retorna erro, ou o teste falhou.
- **Passou**: Os validadores automáticos do bloco pedagógico confirmaram a execução correta da tarefa proposta e o aluno obteve a mensagem de Sucesso.

## 12. Erros Esperados e Orientação do Mentor (A Regra de Ouro)

O Mentor IA existe para ler o erro, analisar o contexto da lição e **dar dicas progressivas**.
**Regra**: O Mentor NUNCA entrega a resposta pronta (`console.log('x')`).
**Como orientar**:

- _Tentativa 1_: Erro genérico. Mentor: "Parece que você tem um erro de sintaxe. Verifique a linha 4. Esqueceu algo no final da linha?"
- _Tentativa 2_: "Em JavaScript, arrays começam no índice 0, não 1."
- _Tentativa 3_: Mostra um exemplo análogo: "Veja como acesso o primeiro item de uma lista: `lista[0]`. Como seria na sua variável?"

## 13. Como cada fase conversa com a Sala Terminal

A "Sala Terminal" não é apenas para a Fase de Fundação. Ela evolui:

- **Trilha 1-3**: Terminal raiz puro.
- **Trilha 4-6**: Webcontainer. O terminal roda `npm run dev` e exibe um preview do browser ao lado ou numa aba.
- **Trilha 7-9**: Remote-runner ou ambientes onde o terminal mostra logs de servidor e executa queries SQL (`psql`).
- **Trilha 10-12**: O terminal é usado para rodar suites de teste (`jest`, `vitest`) e comandos de deploy, reforçando que o mercado profissional usa o terminal do começo ao fim.

## 14. Como cada fase conversa com Teoria -> Prática -> Avaliação

A engrenagem do aprendizado é padronizada no catálogo:

- **Bloco de Teoria**: O `briefing` no YAML define conceitos e sintaxe.
- **Bloco de Prática**: A `tarefa` define o desafio real sem entregar a resposta. O aluno usa o Terminal.
- **Bloco de Avaliação**: O _ExecutionResult_ é comparado contra as _ValidationRules_. O _Mentor_ reage com as _Hints_ baseadas no `erros_comuns`.

## 15. Lacunas Atuais (Currículo Ideal vs. Catálogo V1 Atual)

No momento (Fase 1), o repositório (`docs/product/learning-catalog-v1.md`) opera com **6 trilhas macro** e apenas a Fase 0 de terminal (10 lições) implementada/projetada concretamente.
As lacunas são gigantescas:

- Não temos o frontend web (Trilhas 4-6) mapeado em lições YAML.
- O catálogo v1 precisa ser refatorado futuramente para suportar as 14 trilhas deste documento.
- O runtime `webcontainer` e `remote-runner` existem apenas conceitualmente (`RuntimeRequirements`), não suportam execução real ainda.
- Os validadores de código e rede (para APIs e TS) ainda não existem na `validation-grammar-v1.md`.

---

## O Detalhamento das 14 Trilhas

### Trilha 1: Fundamentos Digitais e Mentalidade de Desenvolvedor

- **Objetivo**: Instalar o "sistema operacional do dev" no cérebro do aluno.
- **Por que existe**: Para combater o imediatismo. Ensinar a pesquisar, lidar com frustração e entender como computadores operam no nível lógico.
- **Antes / Depois**: Sabe nada -> Sabe como a internet funciona (cliente/servidor) e tem resiliência para errar.
- **Módulos/Aulas**: A internet por baixo dos panos; Hardware vs Software; Como formular perguntas (Google/StackOverflow/IA); O ciclo de vida do desenvolvimento.
- **Prática**: Exercícios de pesquisa guiada. Entregar resumos em texto puro usando o terminal.
- **Mentor**: Adapta-se ao pânico de quem está perdido. Incentiva a pesquisa.

### Trilha 2: Terminal, Sistema Operacional e Filesystem

- **Objetivo**: Dominar a interface de linha de comando.
- **Por que existe**: É a ferramenta mais ubíqua da tecnologia. GUI muda, CLI permanece.
- **Antes / Depois**: Medo da tela preta -> Cria, deleta, move arquivos e entende permissões.
- **Prática**: As 10 lições da Fase 0 (mkdir, cd, cat, grep, chmod).

### Trilha 3: Git e GitHub

- **Objetivo**: Controle de versão seguro e trabalho em equipe.
- **Por que existe**: Não existe desenvolvimento profissional moderno sem controle de versão distribuído.
- **Antes / Depois**: Salva como `vFinal_2` -> Sabe fazer branches, commits atômicos, push e resolver merge conflicts.
- **Prática**: Criar repositório, simular quebra, reverter commit, abrir PR.

### Trilha 4: Web Fundamentos (HTML, CSS, Acessibilidade, Responsividade)

- **Objetivo**: Construir a superfície estruturada da web.
- **Por que existe**: O frontend nasce aqui. Se a fundação for ruim, o app será ruim.
- **Antes / Depois**: Zero web -> Constrói layouts complexos (Grid/Flexbox) com semântica perfeita e acessível (a11y).
- **Prática**: Landing page responsiva apenas com HTML/CSS, validada por lighthouse via terminal.

### Trilha 5: JavaScript e Lógica de Programação

- **Objetivo**: A alma dinâmica. Lógica, algoritmos e manipulação de DOM.
- **Por que existe**: É a linguagem universal da web.
- **Antes / Depois**: Sites estáticos -> Aplicações que respondem a eventos, lidam com arrays, loops, condicionais e Promises.
- **Prática**: Jogo da Velha ou Todo-List vanilla. Validadores testam mudanças no DOM.

### Trilha 6: TypeScript para Aplicações Reais

- **Objetivo**: Engenharia sólida no frontend e backend.
- **Por que existe**: A indústria não constrói mais em JS puro de forma madura; tipos evitam bugs de produção.
- **Antes / Depois**: Bugs silenciosos (undefined) -> Tipagem estrita, Interfaces, Generics.
- **Prática**: Refatorar o projeto da Trilha 5 inteiramente para TS. O validador será o `tsc --noEmit`.

### Trilha 7: Node.js e Backend Introdutório

- **Objetivo**: Rodar código no servidor, entender o ecossistema V8 fora do browser.
- **Por que existe**: Para conectar o cliente aos dados.
- **Antes / Depois**: Apenas frontend -> Cria scripts de servidor, lê arquivos nativos, sobe um servidor HTTP rudimentar.
- **Prática**: Um CLI em Node.js e um servidor puro HTTP.

### Trilha 8: Banco de Dados e SQL

- **Objetivo**: Persistência estruturada.
- **Por que existe**: Dados são o maior ativo de sistemas. Modelagem errada custa caro.
- **Antes / Depois**: Arrays em memória -> Queries complexas, Joins, Constraints em PostgreSQL.
- **Prática**: Criar schemas, inserir dados, testar selects complexos no terminal interativo do BD.

### Trilha 9: APIs, HTTP e Integração Frontend/Backend

- **Objetivo**: A ponte. Padrões REST, status codes, CORS.
- **Por que existe**: Aplicações modernas são sistemas distribuídos que conversam via rede.
- **Antes / Depois**: Apps isolados -> Fullstack local integrado. Postman/cURL para testes.
- **Prática**: Construir uma API REST em Express/Fastify e consumi-la via Fetch no frontend React.

### Trilha 10: Testes, Debugging, Logs e Qualidade

- **Objetivo**: Garantia de software.
- **Por que existe**: O júnior moderno deve saber ler logs de produção e evitar quebrar sistemas com TDD/BDD.
- **Antes / Depois**: Testa clicando -> Escreve testes unitários (Vitest/Jest) e usa o debugger do node/browser.
- **Prática**: Lições de "quebra proposital" onde o aluno precisa ler uma stack trace real de 50 linhas e consertar a linha 3.

### Trilha 11: Segurança Básica para Dev Júnior

- **Objetivo**: Não ser um risco para a empresa.
- **Por que existe**: OWASP Top 10 existe. Senhas não se guardam em plain text.
- **Antes / Depois**: Ignora segurança -> Entende hashing, JWT seguro, SQL Injection, CSRF, XSS.
- **Prática**: Identificar e corrigir vulnerabilidades em um projeto Node.js fornecido.

### Trilha 12: Deploy, Ambientes e Noções de Produção

- **Objetivo**: Levar o código para a internet de verdade.
- **Por que existe**: Software só tem valor em produção.
- **Antes / Depois**: `localhost:3000` -> Deploy automatizado, `.env` files, Dockerfile básico.
- **Prática**: Fazer deploy de banco + api + frontend.

### Trilha 13: Projeto Final Guiado

- **Objetivo**: O Masterpiece.
- **Por que existe**: Prova de competência total integrando as 12 trilhas anteriores.
- **Prática**: Um sistema de complexidade média (ex: clone simplificado de um SaaS ou E-commerce), construído do zero, com CI/CD, testes, TS, BD e deploy.

### Trilha 14: Preparação Profissional (Portfólio, Entrevistas)

- **Objetivo**: Conseguir a vaga.
- **Por que existe**: Habilidade técnica sem marketing pessoal e soft skills muitas vezes resulta em desemprego.
- **Prática**: Refinar currículo, formatar o GitHub (Readmes de qualidade), simular entrevistas técnicas no terminal (mentor IA atua como recrutador).

## Diretrizes de Adaptação (Ritmo do Aluno)

- **Aluno Lento**: O Mentor diminui a curva de dificuldade, liberando dicas mais explícitas após 5+ erros no mesmo bloco. Incentiva a repetição de conceitos fundamentais através de novos blocos gerados dinamicamente (futuro).
- **Aluno Avançado**: Pula explicações longas. O Mentor oferece "desafios bônus" (ex: "Muito bem. Agora, faça isso usando apenas um comando com `&&`").
