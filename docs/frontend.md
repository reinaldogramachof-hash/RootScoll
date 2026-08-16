# RootScoll Frontend Design System v1

> Fonte oficial de verdade visual para o frontend da RootScoll.
>
> Marca: **RootScoll**
> Tagline: **Learn by doing. Think from the Root.**
> Expressao metodologica: **Modo Raiz**
>
> Este documento orienta landing page, plataforma autenticada, dashboards,
> sala Terminal, materiais digitais e qualquer agente que altere UI/UX do
> projeto.

## 1. Essencia

RootScoll e a escola onde o conhecimento tecnico comeca pela raiz. A marca
combina:

- **Root**: fundamento, profundidade, sistema, base tecnica.
- **Scoll**: escola, formacao, pratica e evolucao.

A plataforma deve transmitir pratica real, raciocinio tecnico e autonomia
profissional. Ela nao deve parecer escola infantil, curso generico,
infoproduto, interface gamer, cyberpunk ou experimento sem maturidade.

## 2. Principios Visuais

Todo componente deve parecer pertencer a uma plataforma:

- tecnica;
- confiavel;
- moderna;
- pratica;
- objetiva;
- profissional;
- adequada para alunos, universidades, empresas e programas corporativos.

Elementos de terminal, grafos, redes, circuitos, diretorios, Git, codigo,
debugging, infraestrutura e deploy podem aparecer como linguagem visual, mas
nunca como decoracao excessiva.

## 3. Logotipo E Simbolo

O simbolo oficial combina:

- estrutura geometrica superior;
- prompt de terminal `>_`;
- raizes ou ramificacoes;
- nos conectados.

Variações previstas:

- logo principal: simbolo + RootScoll;
- icone: simbolo isolado;
- monocromatico;
- dark;
- light.

Uso preferencial no produto: versao dark sobre fundo escuro.

Regras:

- Nao redesenhar o simbolo em codigo.
- Nao substituir por placeholder.
- Preservar area de protecao de pelo menos `0.5x` a altura do simbolo.
- Logo completo minimo: `120px`; preferencial em navbar desktop: `150px` a
  `175px`.
- Simbolo isolado minimo: `24px`; recomendado: `32px`, `40px` ou `48px`.

Assets locais conhecidos nesta fase:

- `apps/web/src/images/logo.png`
- `apps/web/src/images/identidade1.png`
- `apps/web/src/images/identidade2.png`

SVG deve ser o formato preferencial quando os assets finais forem preparados
para interface/PWA.

## 4. Paleta Oficial

### Cores Fisicas

```css
:root {
  --root-black: #0b1020;
  --terminal-slate: #141b2d;

  --mint-signal: #36e6a5;
  --cyan-logic: #3ab8ff;
  --craft-amber: #f2a93b;

  --cloud-white: #f5f7fb;
  --steel-gray: #9aa4b2;
  --border-gray: #263042;
  --danger: #ff5c6c;
}
```

Uso:

- Root Black: fundo principal, terminal, paginas autenticadas.
- Terminal Slate: paineis, cards, sidebar, campos.
- Mint Signal: CTA, progresso, sucesso, links principais, prompt.
- Cyan Logic: informacao, graficos, links secundarios, icones tecnicos.
- Craft Amber: alerta, progresso parcial, indicador avancado.
- Cloud White: texto principal.
- Steel Gray: texto secundario.
- Border Gray: bordas e divisores.
- Danger: erros e estados destrutivos.

### Tokens Semanticos

Componentes devem preferir tokens semanticos em vez de cores fisicas.

```css
:root {
  --background: var(--root-black);
  --background-secondary: var(--terminal-slate);

  --surface: var(--terminal-slate);
  --surface-hover: #192236;

  --border: var(--border-gray);
  --border-hover: #344158;

  --text-primary: var(--cloud-white);
  --text-secondary: var(--steel-gray);
  --text-muted: #6f7a89;

  --primary: var(--mint-signal);
  --primary-hover: #48edb2;
  --secondary: var(--cyan-logic);
  --warning: var(--craft-amber);
  --error: var(--danger);
}
```

## 5. Gradiente Oficial

```css
background: linear-gradient(135deg, #36e6a5 0%, #3ab8ff 100%);
```

Uso permitido:

- logo e icones;
- borda especial;
- indicador de progresso;
- highlights;
- pequenos detalhes de marca.

Evitar gradientes grandes como fundo dominante.

## 6. Tipografia

Sistema recomendado:

- Heading: **Space Grotesk**
- Body/UI: **Inter**
- Mono: **IBM Plex Mono**

Fallbacks:

```css
:root {
  --font-heading: 'Space Grotesk', 'Inter', system-ui, sans-serif;
  --font-ui: 'Inter', system-ui, sans-serif;
  --font-mono: 'IBM Plex Mono', 'Cascadia Code', Consolas, monospace;
}
```

Hierarquia:

```css
.text-display {
  font-family: var(--font-heading);
  font-size: clamp(3rem, 6vw, 5.5rem);
  font-weight: 600;
  line-height: 0.98;
}

.text-h1 {
  font-family: var(--font-heading);
  font-size: clamp(2.5rem, 5vw, 4.5rem);
  font-weight: 600;
  line-height: 1.05;
}

.text-h2 {
  font-family: var(--font-heading);
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 600;
  line-height: 1.1;
}

.text-h3 {
  font-family: var(--font-heading);
  font-size: 1.5rem;
  font-weight: 600;
}

.text-body {
  font-family: var(--font-ui);
  font-size: 1rem;
  line-height: 1.7;
}

.text-small {
  font-size: 0.875rem;
  line-height: 1.5;
}

.text-terminal {
  font-family: var(--font-mono);
  font-size: 0.875rem;
  line-height: 1.7;
}
```

Pesos preferenciais: `400` body, `500` UI, `600` heading, `700` apenas para
destaque excepcional.

## 7. Layout, Espacamento E Bordas

Containers:

- maximo amplo: `1440px`;
- conteudo principal: `1280px`;
- padding desktop: `32px`;
- tablet: `24px`;
- mobile: `20px`.

Escala de espacamento baseada em `4px`:

```text
4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 128
```

Radius:

```css
:root {
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 14px;
  --radius-xl: 18px;
}
```

Diretrizes:

- botoes: `8px` a `10px`;
- cards: `12px` a `16px`;
- paineis grandes: `16px` a `20px`;
- evitar interfaces excessivamente arredondadas.

Bordas e sombras:

```css
border: 1px solid var(--border);
box-shadow: 0 12px 40px rgba(0, 0, 0, 0.28);
```

O design deve depender mais de bordas e contraste do que de sombras pesadas.

## 8. Background E Grid Tecnico

Background principal:

```css
background: radial-gradient(circle at 50% 0%, rgba(54, 230, 165, 0.07), transparent 35%), #0b1020;
```

Grid tecnico discreto:

```css
background-image:
  linear-gradient(rgba(58, 184, 255, 0.035) 1px, transparent 1px),
  linear-gradient(90deg, rgba(58, 184, 255, 0.035) 1px, transparent 1px);
background-size: 40px 40px;
```

Usar em hero, terminal, CTA e fundos institucionais com baixa opacidade.

## 9. Componentes Base

### Botao Primario

```css
.btn-primary {
  min-height: 48px;
  padding: 0 22px;
  border: 1px solid var(--primary);
  border-radius: var(--radius-md);
  background: var(--primary);
  color: var(--root-black);
  font-weight: 600;
  transition:
    color 180ms ease,
    border-color 180ms ease,
    background-color 180ms ease,
    transform 180ms ease;
}

.btn-primary:hover {
  background: var(--primary-hover);
  transform: translateY(-1px);
}
```

### Botao Secundario

```css
.btn-secondary {
  min-height: 44px;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  background: transparent;
  color: var(--text-primary);
}

.btn-secondary:hover {
  border-color: var(--primary);
  color: var(--primary);
}
```

### Card

```css
.card {
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  background: var(--surface);
  padding: 24px;
}

.card:hover {
  border-color: rgba(54, 230, 165, 0.4);
  transform: translateY(-2px);
}
```

Cards devem ser usados para itens repetidos, paineis delimitados e conteudo
operacional. Evitar empilhar cards dentro de cards.

### Badge

```css
.badge {
  display: inline-flex;
  min-height: 26px;
  align-items: center;
  padding: 0 10px;
  border-radius: var(--radius-sm);
  font-family: var(--font-mono);
  font-size: 12px;
}
```

### Inputs

```css
.input {
  min-height: 44px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--root-black);
  color: var(--text-primary);
}

.input:focus-visible {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(54, 230, 165, 0.12);
}
```

## 10. Terminal

O terminal e elemento central da identidade RootScoll.

Estilo:

```css
.terminal {
  border: 1px solid var(--border);
  border-radius: 12px;
  background: #080d18;
  font-family: var(--font-mono);
}
```

Cores:

- prompt: `var(--primary)`;
- comando: `var(--text-primary)`;
- informacao: `var(--text-secondary)`;
- alerta: `var(--warning)`;
- erro: `var(--error)`.

Exemplo de linguagem:

```bash
root@rootscoll:~$ start
root@rootscoll:~$ build-skills
root@rootscoll:~$ deploy-career
```

Evitar comandos cenograficos complexos sem funcao.

## 11. Plataforma Autenticada

A plataforma autenticada deve derivar da landing page com menor intensidade
decorativa.

Prioridades:

- legibilidade;
- clareza;
- produtividade;
- informacao;
- hierarquia.

Estrutura desktop recomendada:

```text
Sidebar
Header
Content
```

Itens de sidebar planejados:

- Dashboard;
- Minha Jornada;
- Trilhas;
- Projetos;
- Desafios;
- Laboratorio;
- Certificados;
- Perfil.

Estado ativo:

```css
background: rgba(54, 230, 165, 0.08);
color: var(--primary);
border-left: 2px solid var(--primary);
```

## 12. Dashboard E Paineis Densos

Elementos recomendados:

- progresso geral;
- trilha atual;
- proximo desafio;
- projetos;
- streak;
- XP/evolucao;
- competencias;
- deploys;
- atividade Git;
- avaliacoes pendentes;
- alertas de bloqueio;
- recomendacoes de retomada.

Evitar transformar gamificacao no elemento dominante. O dashboard deve parecer
um centro de operacao de aprendizado tecnico, nao uma vitrine promocional.

## 13. Cards De Trilha

Estrutura:

- icone;
- titulo;
- descricao curta;
- nivel;
- progresso/modulos;
- status.

Cores por categoria:

- Terminal: Mint Signal;
- Git: Craft Amber;
- Web: Cyan Logic;
- Deploy: Cyan Logic / Mint Signal;
- Security: Mint Signal com Craft Amber para atencao.

## 14. Sala Terminal

A Sala Terminal deve preservar:

- terminal fullscreen como foco;
- teoria antes da pratica;
- pratica guiada;
- avaliacao;
- conclusao;
- mentor discreto;
- barra de progresso;
- sidebar direita recolhivel como painel de controle.

O painel lateral da sala deve funcionar como cockpit operacional, contendo:

- indice do bloco atual;
- modulos/aulas;
- progresso detalhado;
- tentativas;
- historico de comandos;
- dicas desbloqueadas;
- configuracoes do terminal;
- reiniciar exercicio;
- sair da sala;
- futuro: duvida ao professor / mentor IA.

## 15. Mentor

Mentor nesta fase significa **mentor deterministico/simulado**, sem IA real.

Diretrizes:

- discreto;
- flutuante;
- contextual;
- pequeno;
- nao competir com o terminal;
- nao parecer chat principal;
- nunca entregar resposta pronta.

Estados sugeridos:

- observando;
- dica leve;
- alerta de erro recorrente;
- sugestao de revisao.

IA real depende de politica pedagogica propria antes de qualquer integracao.

## 16. Movimento E Microinteracoes

Duração recomendada: `120ms` a `240ms`.

Usar para:

- cursor piscando;
- linhas de terminal;
- progresso;
- pequenas entradas de elemento;
- nos conectando;
- indicadores sendo preenchidos.

Evitar:

- parallax pesado;
- glitch constante;
- elementos piscando sem funcao;
- objetos flutuando decorativos.

## 17. Acessibilidade

Meta minima: WCAG 2.1 AA.

Regras:

- contraste de texto minimo `4.5:1`;
- contraste de elementos de interface minimo `3:1`;
- todo elemento navegavel deve ter `:focus-visible`;
- nunca depender apenas de cor para erro/sucesso/status;
- usar label, texto ou icone junto da cor;
- evitar texto menor que `14px` no mobile.

```css
:focus-visible {
  outline: 2px solid var(--primary);
  outline-offset: 3px;
}
```

## 18. Responsividade

Breakpoints recomendados:

```text
sm   640px
md   768px
lg   1024px
xl   1280px
2xl  1536px
```

Mobile:

- priorizar texto;
- reduzir decoracao;
- terminal ocupa largura total;
- cards em coluna;
- CTAs podem ocupar largura total;
- navbar reduzida;
- preservar margens laterais.

Desktop:

- transmitir amplitude;
- profundidade;
- organizacao;
- tecnologia;
- usar espaco negativo;
- nao preencher cada area com conteudo.

## 19. Linguagem Verbal

A RootScoll comunica de maneira direta, tecnica, humana, objetiva e pratica.

Preferir:

- Aprenda fazendo.
- Construa projetos reais.
- Entenda o que acontece por baixo da interface.
- Domine fundamentos antes de abstracoes.
- Do terminal ao deploy.
- Do zero a prontidao profissional.

Evitar:

- promessas financeiras;
- frases de infoproduto;
- claims institucionais sem prova;
- hype generico.

Vocabulário recomendado:

- Modo Raiz;
- Jornada;
- Trilha;
- Fundamentos;
- Pratica;
- Projeto;
- Desafio;
- Terminal;
- Deploy;
- Build;
- Debug;
- Prontidao;
- Competencia;
- Dominio;
- Evolucao.

## 20. Padroes Proibidos

Nao utilizar:

- roxo dominante;
- neon excessivo;
- gradientes aleatorios;
- glassmorphism excessivo;
- cyberpunk;
- fundos extremamente iluminados;
- excesso de glow;
- ilustracoes infantis;
- mascotes;
- emojis como linguagem principal;
- multiplas fontes;
- icones inconsistentes;
- sombras exageradas;
- cards totalmente arredondados;
- estetica generica de plataforma de curso.

## 21. Estrutura Recomendada De Arquivos

```text
src/
  styles/
    tokens.css
    typography.css
    globals.css
    animations.css
  components/
    ui/
    branding/
    terminal/
    navigation/
    cards/
  assets/
    brand/
      logo/
      icon/
      patterns/
  app/
```

O app atual ainda concentra estilos em `apps/web/src/styles/app.css`. A
implantacao do design system deve migrar gradualmente para arquivos de tokens
e componentes, sem quebrar a experiencia existente.

## 22. Criterio De Aceite Visual

Uma implementacao esta consistente quando:

- usa a paleta oficial;
- usa a hierarquia tipografica;
- possui contraste adequado;
- respeita espacamento, radius e bordas;
- usa iconografia compativel;
- tem hover/focus;
- funciona em desktop e mobile;
- preserva o conceito tecnico;
- evita excesso de efeitos;
- mantem coerencia com landing page e plataforma;
- preserva corretamente RootScoll e Modo Raiz.

## 23. Plano De Implantacao

### Fase A: Documentacao E Tokens

- Publicar este `docs/frontend.md` como fonte oficial.
- Criar tokens CSS em `apps/web/src/styles`.
- Mapear CSS atual para tokens semanticos.
- Preservar visual existente enquanto reduz cores hardcoded.

### Fase B: Tipografia E Base Global

- Aplicar `Space Grotesk`, `Inter` e `IBM Plex Mono` com fallbacks.
- Definir classes/utilitarios de titulo, corpo, small e terminal.
- Revisar tamanhos para mobile e desktop.

### Fase C: Componentes UI Base

- Consolidar botoes, inputs, badges, cards, paineis, progress bars e focus
  states.
- Evitar biblioteca visual externa ate a linguagem RootScoll estar estável.

### Fase D: Paineis Operacionais Densos

- Evoluir Dashboard, Perfil, Trilhas e Sala Terminal como paineis de controle
  completos, ainda com dados mock/local.
- Separar informacao primaria, secundaria, status e acoes de retomada.

### Fase E: Sala Terminal E Mentor

- Refinar sidebar da sala como cockpit operacional.
- Ampliar historico, dicas desbloqueadas, reset e preferencias.
- Manter mentor deterministico ate existir politica formal de IA.

### Fase F: Preparacao Para Produto Real

- Somente depois: roteador real, persistencia, auth, Supabase e IA real.
- Nenhuma dessas etapas deve comecar sem aprovacao arquitetural especifica.

## 24. Regra Para Agentes

Antes de criar ou alterar qualquer componente, perguntar:

```text
Este elemento parece pertencer a RootScoll?
```

A prioridade deve ser:

```text
Consistencia > Clareza > Usabilidade > Estetica decorativa
```

**RootScoll**
**Learn by doing. Think from the Root.**
**Do fundamento ao deploy.**
