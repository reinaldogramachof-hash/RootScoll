# Curriculum Research Notes v1

> Documento de registro da pesquisa realizada para a construção da jornada "Zero to Junior" do CodeChat/RootScoll.
> Data da pesquisa: Agosto de 2026.

## 1. Fontes Consultadas

A pesquisa foi baseada em roadmaps modernos de tecnologia, exigências de mercado e tendências educacionais focadas na formação de novos desenvolvedores (2024-2026).

- **roadmap.sh (Full Stack, Frontend, Backend)**: Padrão ouro comunitário para trilhas de aprendizado visual. Fornece uma progressão clara de fundamentos (Internet, HTML/CSS/JS) para frameworks (React) e backend (Node.js, Bancos de Dados Relacionais, APIs).
- **Artigos e análises de mercado (Medium, Dev.to)**: Foco no que o mercado espera de um dev júnior hoje, especialmente na "Era da IA". Há uma transição clara de "apenas codificar" para "entender sistemas, depurar e dar manutenção".
- **freeCodeCamp e certificações da indústria**: Validação da necessidade de projetos práticos reais em vez de tutoriais passivos.

## 2. O Cenário do Desenvolvedor Júnior na Era da IA

O mercado mudou drasticamente com a proliferação de assistentes de IA (Copilot, Claude, ChatGPT). O papel do júnior não é mais apenas produzir blocos básicos de código (algo que a IA faz rapidamente), mas sim:

- **Ler e compreender código existente**: A habilidade de depurar (debugging), ler logs e entender fluxos tornou-se mais valiosa do que escrever código do zero.
- **Entendimento de Sistemas (System Thinking)**: Saber como o frontend se conecta com o backend, como a rede funciona, e onde as coisas quebram em produção (deploy, CI/CD).
- **Fundamentos Sólidos**: A abstração excessiva gera profissionais dependentes. Entender JavaScript profundo, SQL real e terminal/Linux é o que diferencia o profissional "raiz" do "copia-e-cola".

## 3. Decisões Pedagógicas Derivadas (O "Modo Raiz")

Para alinhar a pesquisa de mercado com a visão do produto RootScoll ("Learn by doing. Think from the root"):

1. **Terminal Primeiro**: A jornada não começa com HTML visual, começa no terminal. É preciso tirar o medo da tela preta cedo. Isso constrói confiança.
2. **Sem Muletas Iniciais**: Ensinar JavaScript puro antes de qualquer framework. Ensinar SQL antes de ORMs.
3. **Debugging como Cidadão de Primeira Classe**: Em vez de apenas ensinar a "fazer funcionar", o currículo deve propositalmente apresentar sistemas quebrados para o aluno consertar. O `erros_comuns` do nosso schema de lição é o coração disso.
4. **Segurança desde o Dia 1**: Em vez de ser um tópico isolado avançado, noções de segurança (não expor chaves, injeção de dependência básica) permeiam a prática.
5. **Deploy Realista**: O júnior precisa saber colocar a aplicação no ar, entendendo o mínimo de infraestrutura (ambientes, variáveis de ambiente).

## 4. O que foi incorporado vs. O que foi descartado

**Incorporado:**

- Trilha densa de fundamentos da web (HTTP, APIs).
- Foco em TypeScript como padrão (não mais um extra opcional).
- Trilha específica para testes e qualidade de software.
- Trilha específica para segurança (em alinhamento com a Trilha 06 já vislumbrada no catálogo atual).

**Descartado:**

- "Aprender 3 frameworks diferentes": O currículo focará em profundidade num stack consolidado (JS/TS + React/Node) em vez de superficialidade em vários.
- Ferramentas de DevOps avançadas (Kubernetes, AWS avançado): Fora do escopo de um júnior. O foco será em Docker básico e CI/CD simples.
- Computação em Nuvem teórica: Substituída por deployments práticos.

## 5. Conflitos com o Catálogo Atual (Fase 1)

O catálogo atual (`docs/product/learning-catalog-v1.md`) possui 6 grandes trilhas genéricas (Terminal/SO, Git, Web, Programação, Prática Profissional, Segurança).
O currículo ideal detalhado no `zero-to-junior-curriculum-v1.md` expande isso para **14 trilhas granulares**.
**Decisão pendente**: O catálogo precisará ser atualizado (Fase 2 ou 3) para suportar essa nova granularidade, transformando as trilhas macro atuais em "Fases" (ou coleções) e implementando as 14 trilhas como os verdadeiros caminhos de aprendizado. Por enquanto, o novo currículo atua como a **visão ideal/futura**, não invalidando a execução da Fase 1 atual.
