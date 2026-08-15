# Engine Contracts v1

> Documento conceitual. Nenhuma `interface`/`type` TypeScript foi criada a partir deste
> documento, nenhum arquivo em `packages/*/src` foi alterado, e nenhum contrato aqui é
> definitivo em nível de código — apenas em nível de vocabulário e forma. O objetivo é
> preparar o terreno para que, quando os contratos forem implementados de fato (em
> `packages/*/src/contracts` e/ou `@codechat/types`), a forma e as fronteiras já
> estejam acordadas entre Arquiteto e execução.
>
> Este documento assume como lidas e válidas as regras já registradas em
> `docs/architecture/dependency-rules.md` — não as repete integralmente, apenas as
> aplica ao caso concreto do fluxo terminal → execução → validação → progresso descrito
> no `docs/product/domain-model-v1.md`.

## Por que este documento existe

O Domain Model v1 (`docs/product/domain-model-v1.md`) identificou um ponto de tensão
explícito: `Challenge` (pedagógico, em `lesson-engine`) precisa saber o que o aluno fez
no terminal (técnico, em `terminal-engine`/`execution-engine`) para poder validar um
desafio — mas nenhuma das duas engines pode depender da implementação interna da outra.
O Domain Model v1 deixou o formato exato desse contrato como pendência ("fica para a
etapa de contratos entre engines"). Este documento é essa etapa.

Ele também prepara terreno para a modelagem de banco (Etapa seguinte, Database Model /
Supabase Planning): entidades como `ExecutionResult` e `AttemptHistory` só podem ser
desenhadas como tabela depois que se sabe exatamente que campos elas carregam e quem as
escreve/lê — o que este documento começa a fixar, ainda em nível conceitual.

---

## 1. Fluxo conceitual

Sequência conceitual de um aluno resolvendo um `Challenge` prático, do ponto de vista
de quais entidades participam e em qual ordem. Não é um diagrama de sequência técnico
(sem chamadas de função, sem nomes de método) — é a ordem em que os conceitos do
Domain Model v1 se relacionam.

1. **`TerminalSession`** já existe (o aluno tem uma sessão de terminal ativa,
   associada a um `EnvironmentProfile`).
2. O aluno digita algo → nasce um **`CommandAttempt`** (registro imutável do que foi
   digitado, pertencente a `terminal-engine`).
3. `terminal-engine` decide que aquele `CommandAttempt` precisa ser executado e produz
   uma **`ExecutionRequest`** — a intenção de execução, endereçada à `execution-engine`.
   Esta é uma entidade nova em relação ao Domain Model v1, introduzida aqui porque o
   Domain Model v1 tratava a transição `CommandAttempt` → `ExecutionResult` como
   direta; na prática, entre os dois existe uma etapa de "pedido de execução" que
   `execution-engine` recebe, roteia (virtual-shell, pyodide, webcontainer,
   remote-runner) e só então resolve.
4. `execution-engine` processa a `ExecutionRequest` (potencialmente delegando a
   `apps/runner`) e produz um **`ExecutionResult`** — o formato estável que
   `lesson-engine` está autorizada a consumir (ver seção 2).
5. Se o `CommandAttempt` está associado a um `Challenge` (via `Step`/`Lesson` ativos),
   `lesson-engine` aplica as **`ValidationRule`**s daquele `Challenge` sobre o
   `ExecutionResult` recebido (ver seção 3) e produz um veredito (passou/falhou/parcial).
6. `lesson-engine` atualiza **`ChallengeProgress`** com base nesse veredito.
7. Cada tentativa avaliada — independentemente do veredito — gera uma entrada em
   **`AttemptHistory`**, associando o `ExecutionResult` avaliado ao resultado da
   validação.

```
TerminalSession
      │
      ▼
CommandAttempt          (terminal-engine)
      │
      ▼
ExecutionRequest         (terminal-engine → execution-engine)
      │
      ▼
ExecutionResult          (execution-engine)
      │
      ▼
ValidationRule           (lesson-engine consome ExecutionResult)
      │
      ▼
ChallengeProgress        (lesson-engine)
      │
      ▼
AttemptHistory            (lesson-engine)
```

Nenhuma seta acima volta "para trás" na forma de uma engine chamando diretamente a
implementação interna da engine anterior — cada seta é uma passagem de dado imutável
(`ExecutionRequest`, `ExecutionResult`) ou um evento (seção 4), nunca uma chamada direta
a função/classe interna de outro package.

---

## 2. Contrato `ExecutionResult`

### Propósito

`ExecutionResult` é o único formato pelo qual `lesson-engine` "enxerga" o que aconteceu
no terminal. É o contrato mais importante deste documento porque é a fronteira exata
entre o mundo técnico (`terminal-engine`/`execution-engine`/`apps/runner`) e o mundo
pedagógico (`lesson-engine`).

### Campos conceituais

- referência ao `CommandAttempt`/`ExecutionRequest` de origem;
- saída padrão (stdout conceitual) — texto produzido pela execução;
- saída de erro (stderr conceitual) — texto de erro, se houver;
- código de saída (conceito de sucesso/falha do comando, não necessariamente um
  inteiro POSIX — a decidir tecnicamente);
- duração da execução;
- adapter/ambiente que executou (virtual-shell, pyodide, webcontainer, remote-runner);
- estado resultante relevante do `VirtualFileSystemState` (ex.: "o diretório `projeto`
  passou a existir"), representado de forma abstrata — uma descrição do que mudou, não
  o filesystem inteiro;
- timestamp de conclusão.

### O que pode ser consumido pela `lesson-engine`

- Os campos acima, na íntegra — é exatamente para isso que `ExecutionResult` existe
  como contrato: ser um dado estável e completo o suficiente para qualquer
  `ValidationRule` avaliar um `Challenge`, sem que `lesson-engine` precise pedir mais
  informação à `execution-engine`.
- `lesson-engine` pode ler `ExecutionResult` quantas vezes quiser e derivar dele
  qualquer veredito de validação — é dado imutável, seguro para reuso.

### O que não pode vazar para a regra pedagógica

- **Qual adapter executou o comando não deve virar critério de validação pedagógica.**
  Uma `ValidationRule` não pode dizer "só aceito se rodou no `remote-runner`" — isso
  amarraria conteúdo pedagógico a decisões de infraestrutura de execução, que a
  `execution-engine` deve poder trocar livremente (essa é a razão de existir do
  roteamento descrito em `execution-engine.md`).
- **Detalhes internos de sandboxing, processos, rede ou limites de recursos** (o que
  pertenceria a um futuro `RunnerExecutionLog`, marcado como "apenas conceitual" no
  Domain Model v1) não fazem parte de `ExecutionResult` e não devem ser adicionados a
  ele só porque seria "conveniente" para depuração — isso pertence a observabilidade
  técnica, um contrato separado, fora de `lesson-engine`.
- **Nenhuma referência a `Challenge`/`ValidationRule`/`ChallengeProgress`.**
  `ExecutionResult` é produzido pela `execution-engine` sem saber que existe um
  `Challenge` em jogo — do ponto de vista dela, um comando foi executado, ponto. Quem
  decide que aquele resultado importa para um desafio é `lesson-engine`, depois do
  fato. Isso preserva a regra de que `execution-engine` nunca decide progresso de aluno
  (seção 5).

---

## 3. Contrato `ValidationRule`

### Tipos conceituais de validação

Ainda sem vocabulário técnico definitivo (isso é trabalho de uma etapa de
implementação, não desta), mas o Domain Model v1 e o fluxo desta etapa sugerem pelo
menos estas categorias conceituais:

- **validação de saída** — o `stdout`/`stderr` do `ExecutionResult` corresponde (ou
  casa com um padrão) ao esperado;
- **validação de código de saída** — sucesso/falha do comando corresponde ao esperado;
- **validação de estado do filesystem virtual** — o estado resultante descrito no
  `ExecutionResult` (ex.: "arquivo X existe com conteúdo Y") corresponde ao esperado;
- **validação de comando executado** — o comando em si (não só seu resultado)
  corresponde a um padrão esperado (ex.: "o aluno deve ter usado `mkdir`, não copiado um
  diretório pronto").

### Entrada esperada

Uma `ValidationRule` recebe exclusivamente um `ExecutionResult` (mais seus próprios
parâmetros de configuração, definidos junto ao `Challenge` — ex.: "o padrão esperado é
X"). Não recebe acesso a `TerminalSession`, `VirtualFileSystemState` completo,
`CommandAttempt` bruto fora do que já está refletido em `ExecutionResult`, nem a
nenhum estado interno de `terminal-engine`/`execution-engine`.

### Saída esperada

Um veredito — conceitualmente: sucesso, falha, ou parcial (quando aplicável) — mais uma
mensagem/feedback associado (usada, por exemplo, para decidir se um `Hint` deve ser
oferecido). O veredito é sempre determinístico dado o mesmo `ExecutionResult` e os
mesmos parâmetros da regra — já registrado como regra de negócio no Domain Model v1.

### Separação entre regra pedagógica e execução técnica

- **`ValidationRule` nunca executa nada.** Ela é uma função pura, conceitualmente
  falando: `ExecutionResult` + parâmetros → veredito. Ela não pede à `execution-engine`
  para rodar mais um comando, não inspeciona o `VirtualFileSystemState` fora do que já
  veio no `ExecutionResult`.
- **`ValidationRule` pertence a `lesson-engine`, é definida junto ao `Challenge`,
  e nunca é definida ou interpretada por `terminal-engine`/`execution-engine`.** Essas
  duas engines não sabem que `ValidationRule` existe — para elas, existe apenas
  `ExecutionRequest`/`ExecutionResult`.

---

## 4. Eventos entre engines

Além da passagem de dado direta (`ExecutionRequest`/`ExecutionResult`) descrita na
seção 1, o fluxo entre engines também pode ser modelado como uma sequência de eventos
— relevante principalmente para o caso em que a UI (`apps/web`) precisa reagir em tempo
real (ex.: mostrar "executando..." enquanto aguarda). Os quatro eventos abaixo são
conceituais: não definem nome de classe, payload exato ou mecanismo de transporte
(callback, event bus, subscription — não decidido nesta etapa).

1. **Comando submetido** — emitido por `terminal-engine` quando um `CommandAttempt` é
   criado e uma `ExecutionRequest` é despachada para `execution-engine`. Consumidores
   esperados: `apps/web` (para feedback visual imediato).
2. **Execução concluída** — emitido por `execution-engine` quando um `ExecutionResult`
   fica disponível. Consumidores esperados: `terminal-engine` (para renderizar a saída
   no terminal visual) e `lesson-engine` (para disparar validação, quando aplicável).
3. **Validação concluída** — emitido por `lesson-engine` depois de aplicar as
   `ValidationRule`s de um `Challenge` sobre um `ExecutionResult`. Consumidores
   esperados: `apps/web` (para mostrar feedback de acerto/erro) e a própria
   `lesson-engine` internamente (para decidir se atualiza `ChallengeProgress`).
4. **Progresso atualizado** — emitido por `lesson-engine` depois de atualizar
   `ChallengeProgress`/`LessonProgress`/`Enrollment`. Consumidores esperados: `apps/web`
   (painel do aluno) e, indiretamente, `StudentProgressView` (painel do
   professor/admin, que é uma projeção — ver Domain Model v1, seção 5).

Nenhum desses eventos é emitido ou consumido diretamente entre as três engines sem
passar por um destes formatos — nenhuma engine deve "escutar" o estado interno de
outra por fora dessa sequência de eventos/contratos.

---

## 5. Boundaries

Reafirmando, no contexto concreto deste fluxo, as regras já registradas em
`docs/architecture/dependency-rules.md`:

- **`lesson-engine` nunca executa comando.** Ela recebe `ExecutionResult` já pronto;
  não tem acesso a nenhum mecanismo de disparar execução (`ExecutionRequest` é
  produzida e consumida inteiramente dentro de `terminal-engine`/`execution-engine`).
- **`terminal-engine` nunca decide validação pedagógica.** Ela produz
  `CommandAttempt`/`ExecutionRequest` e renderiza `ExecutionResult` de volta para o
  aluno, mas não sabe se aquele comando "passou" em algum `Challenge` — isso é decidido
  inteiramente por `lesson-engine` via `ValidationRule`.
- **`execution-engine` nunca decide progresso de aluno.** Ela produz `ExecutionResult`
  de forma cega a qualquer `Challenge`/`ChallengeProgress` — não sabe, e não precisa
  saber, se está sendo usada dentro de um contexto pedagógico ou de exploração livre do
  terminal.
- **`apps/web` compõe os módulos.** É a única camada autorizada a, por exemplo, saber
  que "o aluno está numa `TerminalSession` dentro de um `Challenge` de um `Course`
  específico" e orquestrar a leitura dos eventos da seção 4 vindos de todas as três
  engines — nenhuma engine faz essa orquestração sozinha, conforme já registrado em
  `dependency-rules.md` ("Apps podem realizar composição dos módulos... São os únicos
  pontos autorizados a decidir quais engines usar e como combiná-las").

---

## O que este documento não é

- Não cria nenhuma `interface`/`type` TypeScript. Nenhum arquivo em `packages/*/src`
  foi tocado.
- Não define mecanismo de transporte de eventos (event bus, callback, pub/sub) — isso é
  uma decisão técnica de implementação, não uma decisão de contrato conceitual.
- Não define o schema de banco de `ExecutionResult`/`AttemptHistory` — isso é trabalho
  da próxima etapa (Database Model / Supabase Planning), que pode agora se apoiar nos
  campos conceituais listados aqui.
- Não resolve as `ARCHITECTURAL QUESTION`s já abertas no Domain Model v1 (hierarquia de
  `Organization`; persistência de `VirtualFileSystemState`; formato de `AuditEvent`) —
  são independentes deste documento.
