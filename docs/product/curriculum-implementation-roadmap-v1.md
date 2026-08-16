# Curriculum Implementation Roadmap v1

> Documento de planejamento da implementação técnica e de produto do currículo "Zero to Junior" (14 trilhas) na plataforma RootScoll.
> Regra de Ouro: Funcionalidades complexas (Supabase, Backend Real, IA) devem sempre respeitar a validação das fundações locais antes de qualquer desenvolvimento.

O currículo ideal detalhado em `zero-to-junior-curriculum-v1.md` exige uma evolução gradual da arquitetura atual (que hoje foca apenas em mock de terminal e execução em memória).

## Fase 1: Documentação e Catálogo (Fase Atual)

- **Objetivo**: Ter o norte pedagógico perfeitamente delineado antes de escrever motores complexos.
- **Entregas**:
  - Homologação visual oficial (`docs/frontend.md`).
  - Documentação da jornada completa Zero to Junior.
  - Ajuste do `learning-catalog-v1.md` (no nível documental) para comportar a visão das 14 trilhas.
- **Limites**: Sem banco de dados, sem auth real, sem chamadas a LLMs.

## Fase 2: Blocos Executáveis Locais

- **Objetivo**: Provar que o currículo é executável sem depender de infraestrutura externa complexa.
- **Entregas**:
  - Implementação real de um avaliador (comparar `ExecutionResult` com `ValidationRule`) funcionando no client-side.
  - Expansão do `terminal-engine` para suportar `pipe` (|) e redirecionamentos (`>`, `>>`) necessários para finalizar a Trilha de Terminal.
  - Interface do "Painel Operacional" (Sidebar densa) na Sala Terminal.
- **Limites**: Persistência restrita a `localStorage` ou variáveis em memória. O aluno perde o progresso se limpar o cache.

## Fase 3: Validadores Mais Ricos e Runtimes Variados

- **Objetivo**: Suportar o currículo além do "bash em memória", alcançando a Trilha 4 (Web) e Trilha 5 (JS).
- **Entregas**:
  - Integração inicial com runtimes como `webcontainer` ou `pyodide` para rodar código TS/JS diretamente no navegador, mas agindo como um backend local.
  - Gramática de validação expandida: validadores de rede (ex: a requisição retornou status 200?) e validadores de AST (Abstract Syntax Tree) para TypeScript.
- **Limites**: Tudo ainda ocorre no navegador do cliente (client-side execution).

## Fase 4: Dashboard Pedagógico e Persistência Real (Supabase)

- **Objetivo**: Lançar a plataforma para uso contínuo (Beta).
- **Entregas**:
  - Ativação do Supabase: Autenticação, Banco de Dados Relacional e RLS (Row Level Security).
  - O progresso do aluno, tentativas de comando e tempos de resolução passam a ser sincronizados na nuvem.
  - PWA Offline-first: O aluno pode abrir o app, ler teoria e até rodar terminal básico sem rede, sincronizando depois.
- **Gatekeeper**: Esta fase requer aprovação explícita de arquitetura de banco de dados (schema).

## Fase 5: Mentor IA Controlado

- **Objetivo**: Substituir o "mentor determinístico de regras fixas" pelo motor inteligente idealizado no Produto.
- **Entregas**:
  - Integração via API (Claude/OpenAI/Gemini).
  - Criação do "AI Pedagogy Policy System" (Prompting rígido) para garantir que a IA leia a saída do terminal (via telemetria), cruze com o erro e gere dicas graduais sem dar a resposta.
  - Simulação de Entrevistas Técnicas no terminal.
- **Gatekeeper**: IA nunca é o validador do acerto. O acerto é matemático/sistêmico (Fase 3). A IA atua apenas no feedback do erro.

## Fase 6: Visão Professor/Admin

- **Objetivo**: Habilitar a venda B2B e o uso em universidades/empresas.
- **Entregas**:
  - Dashboards institucionais (Visão de Turma, Alunos em Risco de Evasão, Gargalos em Comandos Específicos).
  - Criação de Trilhas Customizadas pelas instituições (Catálogo Enterprise).
  - Automação de gestão de licenças.

---

> **Nota de Risco de Execução:** Tentativas de antecipar a Fase 5 (IA) antes da consolidação da Fase 3 (Validadores Ricos) transformarão o produto em apenas "mais um chat enfeitado". A força motriz da RootScoll é a validação determinística determinando o sucesso, e a IA operando exclusivamente como apoio lateral na falha.
