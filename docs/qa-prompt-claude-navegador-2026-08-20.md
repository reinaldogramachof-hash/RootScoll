# Prompt de QA de UI/UX — CodeChat / RootScoll (Claude no Navegador)

Cole isto no Claude do navegador (Claude in Chrome) com o servidor de dev do projeto
rodando em `http://127.0.0.1:5173/` (comando `pnpm --filter @codechat/web dev` já
deixa isso ativo). Se a porta estiver diferente, ajuste a URL abaixo antes de colar.

---

```
Você vai atuar como QA de UI/UX no app CodeChat (RootScoll), rodando local em
http://127.0.0.1:5173/. O objetivo é achar problemas visuais reais — não é uma
demonstração, é auditoria. Não pule etapas, não resuma "está tudo bem" sem ter
efetivamente rolado a página e trocado o tema em cada tela.

CONTEXTO TÉCNICO (para você não se perder na navegação):
- O app tem 3 papéis de usuário, sem troca dentro do app: Aluno, Professor,
  Parceiro (RH). Para testar cada papel, é preciso sair (botão "Sair" no canto
  superior direito) e entrar de novo escolhendo a aba correspondente na tela de
  login.
- Existe um alternador de tema claro/escuro no canto superior direito da barra de
  navegação (ícone de sol/lua) — só aparece DEPOIS de logado, não existe na tela
  de login.
- Rotas internas por papel:
  - Aluno: /app (painel), /app/trilhas (trilhas), /app/trilhas/:id (detalhe da
    trilha), /app/perfil (perfil), e o botão "Iniciar"/"Entrar na Sala Terminal"
    abre a sala de aula (/app/sala/terminal/...).
  - Professor: /app/professor (cockpit), clicar em "Gerenciar Turma & Alunos" abre
    /app/professor/turmas/:id (detalhe da turma).
  - Parceiro: /app/parceiro (portal de talentos), clicar em um card de talento
    abre /app/parceiro/talentos/:id (detalhe do talento).
  - Perfil (/app/perfil) é compartilhado pelos 3 papéis mas muda de conteúdo.

ROTEIRO — repita para CADA tela visitada, nesta ordem: (1) screenshot no tema
atual, (2) rolar a página inteira até o fim devagar, observando se algo quebra,
sobrepõe, corta texto, ou fica ilegível durante o scroll, (3) clicar no alternador
de tema, (4) screenshot no novo tema, (5) rolar de novo até o fim no tema novo,
(6) voltar ao tema original antes de navegar para a próxima tela. Em toda tela,
leia o console do navegador (read_console_messages) procurando erros/warnings.

FASE 1 — Tela de Login (sem estar logado)
1. Abra http://127.0.0.1:5173/. Deve cair direto na tela de login (split-screen:
   painel esquerdo claro de boas-vindas + terminal animado, painel direito escuro
   com o formulário e chuva de código no fundo).
2. Confirme que NÃO existe nenhuma barra de navegação interna (com "Meu Painel",
   "Trilhas", "Perfil", alternador de tema, etc.) aparecendo por cima ou atrás do
   formulário de login. Se aparecer qualquer barra desse tipo, é um bug crítico —
   registre com screenshot e a URL exata que a reproduz.
3. Clique nas 3 abas de sessão (Aluno, Professor, Parceiros RH) e confirme que o
   texto de título/subtítulo e o placeholder do e-mail mudam corretamente para
   cada uma, sem quebrar layout.
4. Role a página (se a viewport for pequena) e confirme que os dois painéis
   (boas-vindas claro / login escuro) continuam legíveis e não se sobrepõem.
5. Teste o botão "Mostrar/Ocultar" senha e o link "Esqueceu a senha?".
6. Redimensione a janela para um tamanho estreito (tipo tablet, ~768px) e depois
   bem estreito (~375px, mobile) e veja se o layout split-screen quebra, se o
   formulário fica inacessível, ou se algum texto é cortado.

FASE 2 — Painel do Aluno
1. Faça login na aba "Aluno" (qualquer e-mail/senha, é mock — só clique em
   "Entrar na Sala do Aluno").
2. No painel principal (/app): confirme card de cabeçalho "Olá, Aluno...", métricas,
   trilha atual, timeline de módulos. Role até o fim da página nos dois temas.
3. Clique no que abrir o "Extrato de Integridade" (modal). Confirme que o modal
   abre corretamente nos dois temas — texto legível, fundo com contraste correto,
   os valores de pontos ganhos/perdidos em verde/vermelho legíveis. Role a lista
   de registros dentro do modal se houver scroll interno. Feche o modal.
4. Vá em "Trilhas" (/app/trilhas): confirme grid de trilhas, role até o fim,
   troque tema, role de novo.
5. Abra o detalhe de uma trilha (/app/trilhas/:id): confirme lista de módulos/
   lições, role, troque tema, role de novo.
6. Vá em "Perfil" (/app/perfil): confirme dados do aluno, role, troque tema.
7. Volte ao painel e clique para "Iniciar"/entrar na Sala Terminal. Confirme que
   o terminal abre corretamente (esse é um componente que deve permanecer sempre
   com aparência de terminal escuro/estilo código, independente do tema do app —
   não marque isso como bug, é intencional). Saia da sala.
8. Confirme que a barra de navegação superior (app-nav) fica fixa no topo ao
   rolar qualquer uma dessas telas (comportamento sticky) e que o item ativo
   ("Meu Painel", "Trilhas" ou "Perfil") fica destacado corretamente conforme a
   tela atual.

FASE 3 — Painel do Professor
1. Clique em "Sair", faça login de novo na aba "Professor".
2. No cockpit (/app/professor): confirme métricas, badge "Modo Docente Ativo",
   seção "Gargalos de Aprendizagem Detectados" (cards com borda colorida por
   severidade — alta/média/baixa) e a lista de turmas. Role até o fim nos dois
   temas.
   ATENÇÃO ESPECÍFICA: veja se os badges de severidade ("Taxa de Falha: X%") e o
   badge "Modo Docente Ativo" aparecem com alguma cor/destaque, ou se aparecem
   sem nenhuma cor distintiva (cinza genérico/sem contorno) — isso é um problema
   suspeito conhecido, confirme se acontece e em qual tema.
3. Clique em "Gerenciar Turma & Alunos" para abrir o detalhe de uma turma. Role a
   tabela de alunos até o fim, teste os filtros/abas se houver, troque tema, role
   de novo. Confirme se a tabela mantém contraste de texto e hover legível nos
   dois temas.
4. Vá em "Perfil" pelo mesmo fluxo da Fase 2.

FASE 4 — Painel do Parceiro (RH)
1. Clique em "Sair", faça login de novo na aba "Parceiros (RH)".
2. No portal (/app/parceiro): confirme métricas, o banner "Talentos Formados no
   Modo Raiz" (verifique que o fundo dele acompanha o tema — não deve ficar um
   bloco escuro fixo dentro de um dashboard claro), e a seção de busca de
   talentos. Role até o fim nos dois temas.
3. TESTE ESPECÍFICO: nos 3 selects/dropdowns de filtro da busca de talentos
   (senioridade, disponibilidade, etc.), clique para abrir cada um nos dois
   temas e verifique se o texto das opções é legível — esse é um ponto que já
   quebrou antes (fundo do select ficando escuro com texto escuro em cima no
   tema claro). Reporte com screenshot se ainda estiver ruim.
4. Role o grid de cards de talento até o fim, troque tema, role de novo. Verifique
   se os badges de skill dentro dos cards continuam visíveis nos dois temas (não
   devem "sumir" por falta de contraste).
5. Clique em um card de talento para abrir o detalhe. Confirme os dois badges de
   score no topo (Prontidão e Integridade) — mesma checagem de cor/contorno sem
   cor do item 2 da Fase 3 se aplica aqui também. Role a página de evidências até
   o fim nos dois temas.
6. Vá em "Perfil" pelo mesmo fluxo da Fase 2.

FASE 5 — Checagem cruzada final
1. Com o tema em modo claro, navegue rapidamente por todas as telas visitadas
   (login não entra aqui, ele é sempre split claro/escuro fixo por design) e
   tire uma screenshot final de cada uma lado a lado mentalmente — o objetivo é
   confirmar que NENHUMA tela tem um "bloco escuro perdido" isolado dentro de um
   layout majoritariamente claro (esse é o padrão de bug mais comum neste app).
2. Repita rapidamente em modo escuro para garantir que nada regrediu.
3. Liste todos os erros e warnings coletados do console durante todo o teste,
   mesmo que pareçam não relacionados a CSS.

FORMATO DO RELATÓRIO FINAL:
Para cada problema encontrado, reporte:
- Papel + tela + rota (ex.: "Parceiro, Detalhe do Talento, /app/parceiro/talentos/1")
- Tema em que ocorre (claro, escuro, ou os dois)
- O que exatamente está errado (contraste, elemento cortado, sobreposição,
  elemento sem estilo, comportamento de scroll quebrado, erro de console)
- Screenshot de evidência
- Severidade: crítico (ilegível/quebrado/bloqueia uso), médio (destoa visualmente
  mas não impede uso), cosmético (perceptível só em inspeção próxima)

Não invente problemas nem generalize ("o tema claro tem inconsistências") sem
apontar a tela e o elemento exato. Se uma tela estiver 100% ok nos dois temas,
diga isso explicitamente em vez de omitir.
```
