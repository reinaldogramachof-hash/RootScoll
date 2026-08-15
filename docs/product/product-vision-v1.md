# Product Vision v1

> Documento estrategico de produto. Nao implementa IA, catalogo, UI, engines,
> banco de dados ou qualquer funcionalidade executavel. Define o norte comercial
> e pedagogico que deve guiar as proximas decisoes do CodeChat.

## Posicionamento

CodeChat sera uma plataforma completa de aprendizagem tecnica, do basico ao
avancado, com foco em levar o aluno do zero absoluto ate prontidao real para o
mercado de desenvolvimento.

O diferencial do produto e o **modo raiz**: pratica real, terminal realista,
erros reais, raciocinio tecnico e construcao progressiva de autonomia. A
experiencia principal deve ensinar o aluno a pensar, tentar, errar, depurar e
resolver como um desenvolvedor de verdade.

## Norte comercial

O produto deve atender mais de um mercado sem perder a identidade:

- **B2C**: alunos iniciantes que querem entrar no mercado de tecnologia.
- **Escolas e cursos**: reforco pratico para formacoes de programacao.
- **Empresas**: onboarding tecnico de estagiarios, juniors e profissionais em
  transicao.
- **Governo e ONGs**: formacao profissionalizante com trilhas objetivas e
  mensuraveis.

A promessa comercial nao deve ser "aprenda com IA" como centro. A promessa
deve ser: **aprenda desenvolvimento do jeito raiz, com pratica real e um mentor
IA que ajuda sem substituir sua pratica**.

## Trilhas estrategicas

O catalogo futuro deve permitir evolucao por trilhas e segmentos:

- **Terminal e sistemas operacionais**: Linux, macOS, Windows CMD e PowerShell.
- **Git e GitHub**: versionamento, branching, colaboracao, pull requests e
  fluxo profissional.
- **Desenvolvimento Web**: HTML, CSS, JavaScript, React, APIs e publicacao.
- **Programacao**: Python, Java, PHP, Node.js e outras linguagens conforme
  prioridade de produto.
- **Pratica profissional**: debugging, logs, banco de dados, deploy, testes,
  Docker e projetos de portfolio.
- **Seguranca cibernetica e da informacao**: fundamentos de risco digital,
  boas praticas de protecao, desenvolvimento seguro, privacidade, ameacas
  comuns, uso responsavel de credenciais e consciencia de superficie de ataque
  desde as primeiras licoes.

Essas trilhas devem se apoiar no modelo pedagogico ja existente
(`Course -> Module -> Lesson -> Challenge`) e nao devem acoplar conteudo
pedagogico diretamente a uma engine especifica. O terminal pode continuar sendo
o palco principal, mas cada segmento podera exigir runtime diferente:
`virtual-shell`, `pyodide`, `webcontainer` ou `remote-runner`.

## Politica de IA pedagogica

A IA deve existir como **mentor pedagogico controlado**, nao como muleta.

Uso permitido:

- explicar erros depois de uma tentativa do aluno;
- oferecer dicas progressivas sem entregar a resposta diretamente;
- adaptar dificuldade conforme desempenho;
- revisar o aprendizado ao fim de uma licao ou modulo;
- simular entrevistas tecnicas e revisoes de prontidao;
- apoiar professores e administradores na leitura de gargalos da turma.

Uso proibido:

- resolver desafios pelo aluno;
- substituir a tentativa pratica;
- entregar comandos ou codigo finais sem processo pedagogico;
- virar chat generico de programacao desconectado da licao;
- tornar a validacao dependente de resposta livre de IA quando houver regra
  deterministica possivel.

Regra de produto: **modo raiz primeiro; IA como mentor, nao como muleta**.

## Decisoes em aberto antes de implementacao

Antes de qualquer implementacao de IA, ainda sera necessario formalizar:

- **AI Pedagogy Policy v1**: niveis de ajuda, limites de resposta, momentos em
  que a IA pode intervir, telemetria pedagogica e criterios de seguranca.
- **Runtime Requirements v1**: quais trilhas rodam em `virtual-shell`,
  `pyodide`, `webcontainer` ou `remote-runner`.

Ja formalizado: **Learning Catalog v1** (`Track`, `Course`, `Module`,
`Lesson`, `Challenge`, tags de tecnologia, segmento, linguagem, runtime e
perfil de ambiente) — ver `docs/product/learning-catalog-v1.md` e os
contratos minimos em `packages/types/src/index.ts`.

Radar aprovado: **Trilha 06 — Seguranca cibernetica e da informacao** deve
fechar o bloco estrategico de estudos. O catalogo reconhece a trilha e seus
segmentos iniciais, mas o curriculo detalhado, politicas de laboratorio,
limites eticos e validadores especificos ainda devem ser formalizados antes de
qualquer implementacao executavel.

Nenhuma dessas decisoes autoriza Supabase, migrations, UI, parser, comandos ou
IA executavel nesta etapa.
