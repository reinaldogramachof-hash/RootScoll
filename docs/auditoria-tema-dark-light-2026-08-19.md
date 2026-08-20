# Auditoria Técnica — Sistema de Tema Dark/Light (CodeChat / RootScoll)

**Data:** 19/08/2026
**Escopo:** `apps/web/src` — validação do resumo executivo do Agente Antigravity sobre a implementação do White Mode / alternador de tema.
**Método:** leitura direta dos arquivos-fonte (`tokens.css`, `app.css`, componentes de `features/app-shell`), grep de cores fixas (`#hex`, `rgba(...)`), comparação de `mtime` dos arquivos para reconstruir o que foi de fato tocado na sessão, e tentativa de reexecução de `typecheck`/`test`.

## Veredito resumido

O resumo executivo está **correto no que descreve, mas incompleto no que implica**. Os itens 1 a 4 do resumo (tokens, botão alternador, navbar, header do dashboard) foram implementados de verdade e funcionam. O item 5 ("Análise de Módulos e Painéis — Aluno, Professor e Parceiro") é só isso: uma *análise*, não uma implementação — e o texto do resumo não deixa isso claro, o que é o motivo mais provável de você "sentir" que Professor e Parceiro ficaram pra trás. Eles ficaram mesmo. Isso não é impressão sua.

## Evidência objetiva: o que a sessão tocou de fato

Comparando o horário de modificação (`mtime`) dos arquivos, dá para reconstruir com precisão o que entrou na rodada de "modo claro":

**Tocados nesta sessão** (mtimes entre ~13:56 e ~15:32 do dia mais recente):
`tokens.css`, `app.css` (parcialmente — ver abaixo), `AppNavigation.tsx`, `AppShell.tsx`, `icons.tsx`, `StudentDashboard.tsx`, `ProfileScreen.tsx`, `TracksScreen.tsx`.

**Não tocados** (mtimes de ~2 a ~3 dias antes):
`TeacherDashboard.tsx`, `PartnerDashboard.tsx`, `ClassroomDetailScreen.tsx`, `TalentDetailScreen.tsx`, `TalentSearchResults.tsx`, `LoginScreen.tsx`, `TrackDetailScreen.tsx`.

Ou seja: praticamente **todo o ecossistema Professor e todo o ecossistema Parceiro (RH) ficaram fora da lapidação de tema**. Só o Aluno (dashboard, perfil, trilhas) e o shell de navegação foram revisados.

## Por que isso quebra visualmente

`tokens.css` define corretamente o bloco `[data-theme='light']` remapeando as variáveis semânticas (`--surface`, `--background`, `--text-primary` etc.). Isso é a fundação certa. O problema é que **esse é o único lugar do projeto com uma regra `[data-theme='light']`** — confirmei via grep em `app.css` (70KB, ~3500 linhas): zero ocorrências de `data-theme` fora de `tokens.css`.

Isso significa que qualquer regra em `app.css` (ou `style={{}}` inline em componentes) que usa uma cor física direta — hex ou `rgba(...)` — em vez de `var(--token)`, **não reage à troca de tema**. E encontrei mais de 150 ocorrências desse padrão em `app.css`, além de vários `style={{}}` inline nos componentes. A maioria é decoração legítima que só existe no dark (glows, sombras, terminal), mas uma parte relevante está em componentes visíveis e centrais — inclusive alguns que **quebram de forma feia e concreta**, listados abaixo.

## Achados críticos (quebra visual real, não cosmética)

### 1. Dropdowns de busca do Portal de Parceiros ficam pretos com texto ilegível no modo claro
`apps/web/src/styles/app.css`, classe `.talent-search__select` (~linha 2796):
```css
.talent-search__select {
  cursor: pointer;
  background: var(--root-black);   /* cor física fixa, ignora o tema */
  color: var(--text-primary);       /* no light mode vira #0f172a (quase preto) */
  ...
}
```
`--root-black` é a paleta física (`#0b1020`), não o token semântico `--surface`. Os 3 selects de filtro em `TalentSearchResults.tsx` (linhas 64, 78, 91 — o controle principal da tela de busca de talentos, a tela mais importante do Parceiro) ficam com fundo preto fixo em qualquer tema. No light mode, `--text-primary` é escuro (`#0f172a`) — texto escuro sobre fundo preto: contraste próximo de zero, praticamente ilegível.

### 2. Banner "Metodologia RootScoll" do Parceiro fica um bloco escuro dentro de um dashboard claro
`app.css`, `.partner-manifesto` (~linha 2728):
```css
background: linear-gradient(135deg, rgba(58, 184, 255, 0.08), rgba(11, 16, 32, 0.95));
```
`rgba(11,16,32,0.95)` é quase opaco e escuro — fixo. No light mode isso cria um card escuro isolado dentro do `PartnerDashboard`, destoando de todos os outros cards que já usam `var(--surface)` corretamente.

### 3. Modal "Extrato de Integridade" do Aluno é 100% hardcoded e nunca muda de tema
`StudentDashboard.tsx`, linhas 314–427. Alguns exemplos:
- `color: '#fff'` no título e nos valores dos logs (linhas 355, 390)
- `background: 'var(--bg-surface-elevated, #161b22)'` (linha 346) — **`--bg-surface-elevated` não existe em `tokens.css`**, então essa variável nunca resolve e o fallback `#161b22` é usado sempre. Isso é um bug sutil e perigoso: parece que está "usando token", mas na prática está hardcoded porque o nome do token está errado/não foi criado.
- `color: log.type === 'gain' ? '#00ffd0' : '#ff5555'` (linha 399) — cores neon fixas.

Esse modal é acessado direto do painel do Aluno (o perfil que você mais revisou) e é o exemplo mais claro de "peça esquecida" dentro de uma tela que supostamente já foi lapidada.

### 4. Badge de pontuação no Detalhe do Talento (Parceiro) é hardcoded
`TalentDetailScreen.tsx`, linhas 41–46:
```tsx
<div className="talent-detail__score-badge card" style={{ background: 'rgba(0,0,0,0.25)', borderColor: 'rgba(0,255,200,0.25)' }}>
  <strong className="score-badge__number" style={{ color: '#00ffd0' }}>
```
Mesmo problema: badge de destaque sempre escuro/neon, independente do tema, na tela de detalhe do talento.

## Achados de severidade média (não quebram, mas destoam)

- **Padrão de "painel recesso" com preto fixo**: `.bottleneck-card__action` (Professor), `.classroom-card__stats` (Professor), `.talent-card__metrics` (Parceiro) usam `background: rgba(0, 0, 0, 0.2)` a `rgba(0,0,0,0.25)`. No dark mode isso funciona como "afundar" o painel; no light mode vira uma mancha acinzentada sobre fundo branco, porque preto translúcido não tem o mesmo efeito visual em fundo claro. O certo é um token dedicado (ex.: `--surface-recessed`) que troque de valor por tema.
- **`.badge--neutral` / `.badge--accent`** usam `background: rgba(255, 255, 255, 0.04)` — quase invisível em fundo escuro e ainda mais invisível (branco sobre branco) em fundo claro. As badges de skill nos cards de talento praticamente perdem o contorno no light mode.
- **Falta um token de input/select**. `tokens.css` tem o comentário "não redefinir estes valores fora deste arquivo — componentes devem sempre consumir as variáveis semânticas". O próprio código do projeto já viola essa regra (`var(--root-black)` direto em `.talent-search__select`), o que sugere que falta um token tipo `--surface-input` para esse caso de uso.

## Achados de higiene (baixa prioridade, mas reais)

- **Mojibake de encoding em `app.css`**: vários comentários em português estão com UTF-8 codificado em dobro (ex.: `n├úo` em vez de `não`, `┬║17` em vez de `§17`). Não quebra o CSS (fica dentro de comentários), mas indica que o arquivo foi salvo/reaberto com a codificação errada em algum momento — risco de piorar a cada nova edição automatizada se a ferramenta que edita não estiver em UTF-8.

## Sobre a validação "0 erros / 135/135 testes"

Não consegui reexecutar `pnpm typecheck` / `pnpm test` a partir daqui: o `node_modules` do monorepo é montado via symlinks do pnpm que apontam para o store local do Windows, e esses links não resolvem através da ponte remota (`Input/output error` ao seguir `node_modules/typescript`). Não estou dizendo que o resultado reportado é falso — só que **não pude confirmar de forma independente**, e mais importante: mesmo que 100% verdadeiro, isso não prova nada sobre o tema visual. Typecheck e testes unitários não cobrem contraste de cor, renderização em `[data-theme='light']` nem uso de `var()` — nenhum dos bugs acima quebraria um teste. Se quiser uma validação real de tema, o próximo passo é um teste visual (Playwright + screenshot, ou revisão manual tela a tela nos dois temas), não typecheck/vitest.

---

# Prompts prontos para o Agente Antigravity

Use-os em sequência (cada um é independente, mas a ordem reduz retrabalho).

## Prompt 1 — Corrigir as quebras críticas (Aluno + Parceiro)

```
Contexto: o modo claro (light mode / [data-theme='light']) do CodeChat foi implementado
em tokens.css, mas vários componentes usam cores fixas (hex/rgba) em vez de var(--token),
então não respondem à troca de tema. Corrija os 4 pontos abaixo sem alterar o dark mode
atual (ele deve continuar exatamente igual).

1. apps/web/src/styles/app.css, classe `.talent-search__select`: troque
   `background: var(--root-black);` por `background: var(--surface);` (ou crie um novo
   token semântico `--surface-input` em tokens.css, definido igual a --surface no dark
   e no light, e use-o aqui). Verifique se o contraste do texto (`--text-primary`) fica
   legível nos dois temas depois da troca.

2. apps/web/src/styles/app.css, classe `.partner-manifesto`: troque
   `background: linear-gradient(135deg, rgba(58, 184, 255, 0.08), rgba(11, 16, 32, 0.95));`
   por uma versão que use `var(--surface)` como base em vez do rgba(11,16,32,0.95) fixo,
   mantendo o leve tingimento azul (rgba(58,184,255,0.08)) por cima.

3. apps/web/src/features/app-shell/StudentDashboard.tsx, modal "Extrato de Integridade"
   (linhas ~314-427): substitua todos os estilos inline hardcoded por tokens:
   - `color: '#fff'` -> `color: 'var(--text-primary)'`
   - `background: 'var(--bg-surface-elevated, #161b22)'` -> `background: 'var(--surface)'`
     (o token --bg-surface-elevated não existe em tokens.css, por isso o fallback
     escuro sempre era usado — não recrie esse token, use --surface que já existe)
   - `'#00ffd0'` / `'#ff5555'` (cores de ganho/perda de pontos) -> use var(--success) e
     var(--error), que já existem em tokens.css e já têm valores calibrados para os
     dois temas
   - os overlays `rgba(255,255,255,0.03)`, `rgba(255,255,255,0.08)` etc. usados como
     fundo/borda dos itens da lista -> troque por var(--surface-hover) e var(--border)
   Teste abrindo o modal nos dois temas e confira legibilidade.

4. apps/web/src/features/app-shell/TalentDetailScreen.tsx, linhas ~41-46: remova o
   style inline hardcoded do badge de pontuação (`rgba(0,0,0,0.25)`, `rgba(0,255,200,0.25)`,
   `#00ffd0`) e substitua por classes/tokens equivalentes ao que já é usado no
   `.score-value` de TalentSearchResults.tsx (var(--surface-hover), var(--mint-signal)
   ou var(--primary)), garantindo que o badge acompanhe o tema ativo.

Depois de cada mudança, rode `pnpm --filter @codechat/web typecheck` e confirme
visualmente (dev server em http://127.0.0.1:5173/) nos dois temas antes de seguir
para o próximo item.
```

## Prompt 2 — Estender a cobertura de tema para Professor e Parceiro (o que ficou de fora)

```
Contexto: a lapidação de white mode cobriu apenas o ecossistema Aluno (StudentDashboard,
ProfileScreen, TracksScreen) e o AppNavigation/AppShell. TeacherDashboard.tsx,
PartnerDashboard.tsx, ClassroomDetailScreen.tsx, TalentDetailScreen.tsx,
TalentSearchResults.tsx e TrackDetailScreen.tsx nunca foram revisados para o tema claro
e ainda não têm nenhum teste visual nos dois temas.

Tarefa: percorrer cada um desses 6 arquivos e, para cada elemento estilizado, verificar
se a cor vem de var(--token) (correto) ou de um valor físico hex/rgba direto (precisa
virar token). Priorize nesta ordem, testando cada tela nos dois temas antes de seguir
para a próxima:

1. TeacherDashboard.tsx + ClassroomDetailScreen.tsx (ecossistema Professor)
2. PartnerDashboard.tsx + TalentSearchResults.tsx + TalentDetailScreen.tsx (ecossistema
   Parceiro/RH)
3. TrackDetailScreen.tsx (compartilhado)

Para cada tela, gere um diff mínimo: não redesenhe nada, apenas troque cor física por
var(--token) equivalente mais próxima semanticamente (fundo -> --surface ou
--background-secondary, texto -> --text-primary/--text-secondary/--text-muted,
bordas -> --border/--border-hover, estados de sucesso/alerta/erro -> --success/
--warning/--error). Se não existir um token semântico adequado (por exemplo, para o
padrão de "painel recesso" hoje feito com rgba(0,0,0,0.2) em .bottleneck-card__action,
.classroom-card__stats e .talent-card__metrics), proponha um novo token em tokens.css
seguindo o padrão existente (defina o valor para :root e para [data-theme='light']) em
vez de inventar uma cor solta no meio do componente.

Ao final, rode uma varredura de confirmação:
  grep -rn "#[0-9a-fA-F]\{3,6\}\|rgba(" apps/web/src/styles/app.css apps/web/src/features/app-shell/*.tsx
e revise manualmente cada ocorrência restante: ela deve ser uma decisão de design
deliberada e documentada (ex.: o terminal simulado que fica sempre escuro tipo
console, ou o painel de login que é split claro/escuro por design), não um esquecimento.
Comente no código (`/* intencional: sempre escuro, ver docs/frontend.md */`) toda
ocorrência que você decidir manter fixa, para não ser reaberta como bug depois.
```

## Prompt 3 — Fechar a malha: tokens faltantes, badges e verificação final

```
Contexto: dois problemas sistêmicos além dos pontuais já corrigidos:

1. .badge--neutral e .badge--accent em app.css usam
   `background: rgba(255, 255, 255, 0.04)`, que fica quase invisível tanto no dark
   quanto (pior) no light mode sobre fundo branco. Troque por var(--surface-hover)
   (ou um novo token --badge-surface se preferir separar do hover de navegação) e
   confirme que a borda/texto ainda têm contraste suficiente nos dois temas.

2. app.css tem comentários com problema de encoding (UTF-8 duplamente codificado,
   ex. "n├úo" em vez de "não"). Reabra e resalve o arquivo garantindo UTF-8 correto
   (sem BOM) antes de continuar editando, para não perpetuar o problema em novos commits.

Depois de tudo:
- rode `pnpm -w typecheck` e `pnpm test` e cole o resultado real (não resuma "0 erros"
  sem mostrar o output)
- tire screenshot de cada uma das 3 dashboards (Aluno, Professor, Parceiro) e da tela
  de detalhe de talento, nos dois temas (6 telas x 2 temas = 12 imagens), para
  validação visual objetiva — teste automatizado não substitui essa checagem para
  bug de cor/contraste
- atualize o implementation_plan.md marcando explicitamente quais telas já têm
  cobertura de tema confirmada visualmente e quais ainda não, em vez de tratar
  "análise" e "implementação" como a mesma coisa no resumo
```
