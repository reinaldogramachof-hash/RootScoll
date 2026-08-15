# Runtime Requirements v1

> Documento conceitual e de contrato de dados. Não implementa sandbox, rede,
> filesystem, roteamento de execução, parser, terminal real, comandos,
> Supabase, migrations, UI ou IA. Formaliza **como** e **por que** cada
> segmento do Learning Catalog v1 se conecta a um dos 4 adapters de
> `execution-engine` (`ExecutionAdapterId`), e declara — apenas como dado —
> as restrições conceituais que cada adapter deve respeitar quando for
> implementado de fato (fora de escopo aqui).

Este documento formaliza a pendência "Runtime Requirements v1" registrada em
`docs/product/product-vision-v1.md` ("Decisões em aberto antes de
implementação"). Assume como lidas e válidas as regras de
`docs/architecture/dependency-rules.md` e a arquitetura ainda em construção de
`docs/architecture/execution-engine.md` — não as repete, apenas aplica seus
4 adapters já nomeados (`virtual-shell`, `pyodide`, `webcontainer`,
`remote-runner`) ao catálogo de conteúdo já formalizado em
`docs/product/learning-catalog-v1.md`.

## Fonte de verdade para o mapeamento segmento → adapter

A tabela "Segmento → `adapterId`" completa e atualizada vive em
`docs/product/learning-catalog-v1.md` (seção "Tags de tecnologia, dificuldade
e runtime") — não é duplicada aqui para evitar duas fontes divergentes. Este
documento explica **o raciocínio** por trás de cada adapter e declara suas
**restrições conceituais**; qualquer alteração ao mapeamento em si deve ser
feita lá primeiro.

## Os 4 adapters de execução

### `virtual-shell`

- **Quando usar**: segmentos de terminal/sistema operacional e Git — `linux`,
  `macos`, `windows-cmd`, `powershell`, `git`. É o adapter da Fase 0
  (`docs/product/curriculum-phase-0.md`) e o único hoje com currículo
  executável real aprovado.
- **Natureza**: nenhum processo de SO real é criado — um parser/simulador
  interpreta o comando contra um filesystem virtual em memória
  (`VirtualFileSystemSnapshot`, já definido na fatia mínima da Fase 1).
- **Por que este design**: é o adapter que precisa da maior fidelidade
  pedagógica ("modo raiz" de `product-vision-v1.md`) com o menor risco —
  simular em vez de executar elimina qualquer superfície real de ataque ou
  de efeito colateral no host.

### `pyodide`

- **Quando usar**: segmento `python`, na fase inicial de programação (curso
  ilustrativo `fundamentos-python` em `learning-catalog-v1.md`).
- **Natureza**: Python real compilado para WebAssembly, executado inteiramente
  no navegador do aluno — não é simulação de sintaxe, é um interpretador
  Python de verdade, mas isolado do sistema operacional do aluno e do
  servidor.
- **Por que este design**: permite prática real de Python (não apenas
  simulação de saída esperada) sem exigir infraestrutura de servidor por
  execução e sem expor rede/filesystem do host.

### `webcontainer`

- **Quando usar**: segmentos `html`, `css`, `javascript` — a trilha de
  Desenvolvimento Web.
- **Natureza**: ambiente Node.js real executado em sandbox no navegador
  (tecnologia de container em WASM/iframe), permitindo rodar um servidor de
  desenvolvimento, instalar pacotes de um registry controlado e servir
  páginas — sem processo real no host do aluno nem no servidor do CodeChat.
- **Por que este design**: web development realista exige um ambiente Node
  completo (bundlers, dev servers); rodar isso client-side evita custo de
  infraestrutura por aluno e mantém o isolamento no próprio navegador.

### `remote-runner`

- **Quando usar**: todo o restante — `java`, `php`, `nodejs` (quando fora do
  contexto web-only de `webcontainer`), `database`, `deploy`, `testing`,
  `debugging`, e toda a família de segurança (`cybersecurity`,
  `information-security`, `secure-development`, `digital-risk`) —
  **enquanto não houver runtime local seguro definido** para essas
  linguagens/segmentos.
- **Natureza**: execução delegada a um serviço controlado fora do processo do
  cliente (via `apps/runner`, conforme `docs/architecture/dependency-rules.md`
  — "a comunicação entre `execution-engine` e `apps/runner` deverá ocorrer
  por meio de contratos"). É o adapter com maior superfície de risco por
  rodar fora do navegador, e por isso o que exige a política mais restritiva
  por padrão (ver seção seguinte).
- **Por que este design é temporário por natureza**: `java`/`php`/`nodejs`
  poderiam, em tese, rodar em runtimes locais equivalentes a `pyodide`/
  `webcontainer` no futuro; `remote-runner` é o adapter padrão **enquanto**
  essa decisão de infraestrutura não for tomada — não é a escolha definitiva
  para essas linguagens, é a escolha segura disponível hoje.

## Restrições conceituais por adapter

As dimensões abaixo são modeladas como dado puro em
`packages/types/src/index.ts` (`RuntimeAdapterProfile` e os tipos de apoio
`RuntimeNetworkAccess`, `RuntimeFilesystemMutability`,
`RuntimeProcessExecution`, `RuntimePersistence`, `RuntimeSandboxIsolation`).
Nenhuma delas é aplicada/imposta por código nesta fase — são declarações de
requisito para quando `execution-engine` for implementada de fato.

| Adapter         | Acesso de rede (`networkAccess`)              | Mutabilidade de filesystem (`filesystemMutability`)     | Execução de processo (`processExecution`) | Persistência (`persistence`) | Isolamento (`sandboxIsolation`) |
| --------------- | --------------------------------------------- | ------------------------------------------------------- | ----------------------------------------- | ---------------------------- | ------------------------------- |
| `virtual-shell` | `none`                                        | `session-persistent` (filesystem virtual, só na sessão) | `simulated`                               | `session`                    | `interpreter`                   |
| `pyodide`       | `none`                                        | `ephemeral` (reinicia a cada execução)                  | `sandboxed`                               | `none`                       | `wasm`                          |
| `webcontainer`  | `restricted` (registry de pacotes controlado) | `session-persistent`                                    | `sandboxed`                               | `session`                    | `browser-container`             |
| `remote-runner` | `restricted` (egress controlado pelo serviço) | `ephemeral` (reinicia a cada execução)                  | `delegated`                               | `none`                       | `remote-service`                |

Definições de cada nível (ver JSDoc dos tipos para a versão normativa):

- **`networkAccess`**: `none` (nenhum acesso), `restricted` (allowlist
  controlado — ex.: registry de pacotes de uma linguagem), `full` (não usado
  por nenhum adapter nesta fase; reservado a cenário futuro de
  `remote-runner` totalmente controlado).
- **`filesystemMutability`**: `none` (sem escrita), `ephemeral` (grava mas
  descarta ao fim da execução), `session-persistent` (grava e mantém durante
  a sessão do aluno, nunca entre sessões — isso exigiria persistência real,
  fora de escopo).
- **`processExecution`**: `simulated` (nenhum processo real — parser
  interpreta), `sandboxed` (processo real, mas isolado — WASM ou container de
  navegador), `delegated` (executado fora do processo do cliente, por um
  serviço controlado).
- **`persistence`**: `none`, `session`, `durable` (não usado por nenhum
  adapter nesta fase — implicaria storage real/Supabase, fora de escopo).
- **`sandboxIsolation`**: `interpreter`, `wasm`, `browser-container`,
  `remote-service`.
- **`telemetryHooksPlanned`** (campo opcional, lista de nomes): identificadores
  nominais de hooks de telemetria previstos para o futuro (ex.:
  `'execution-duration'`, `'sandbox-violation'`). Nenhuma coleta real é
  implementada nesta fase; a ausência do campo significa apenas "nenhum hook
  definido ainda", não "telemetria desabilitada por decisão de produto" —
  essa decisão pertence à futura estratégia de telemetria já registrada como
  pendência em `Cérebro Operacional.md`.

## Segurança Cibernética: restrição adicional antes de qualquer exercício prático

A Trilha 06 (`cybersecurity`, `information-security`, `secure-development`,
`digital-risk`) está mapeada para `remote-runner` no Learning Catalog v1, mas
**isso não autoriza, por si só, nenhum exercício prático de segurança**. Antes
de qualquer laboratório executável nessa trilha, é necessário formalizar,
como pendência explícita e separada deste documento:

- **Política ética de uso**: o que um exercício de segurança pode e não pode
  simular (ex.: nunca contra alvos reais/externos; sempre contra ambiente
  fechado e descartável criado para o exercício).
- **Isolamento reforçado**: o perfil padrão de `remote-runner` acima
  (`networkAccess: restricted`, `filesystemMutability: ephemeral`,
  `persistence: none`) é o **piso mínimo**, não o suficiente — exercícios de
  segurança provavelmente exigirão `networkAccess: none` (nenhuma rede, nem
  restrita) e isolamento por execução (nunca compartilhar sandbox entre
  alunos ou entre tentativas).
- **Limites de escopo pedagógico**: até que essa política exista, nenhuma
  `Lesson`/`Challenge` executável deve ser criada para os segmentos de
  `cybersecurity` — o catálogo já reconhece a trilha (ver
  `docs/product/learning-catalog-v1.md`), mas ela permanece **sem currículo
  executável** por decisão consciente.

Este documento não define essa política — apenas explicita que ela é
pré-requisito, para que nenhuma etapa futura pule essa decisão por omissão.

## Como isso se encaixa no Learning Catalog v1

`LessonCatalogEntry.runtime` (`RuntimeRequirement`) já declarava, por lição,
qual `adapterId` ela exige — isso não muda. O que este documento e os novos
tipos acrescentam é uma camada **por adapter** (não por lição): que
restrições conceituais um adapter carrega, independentemente de qual lição o
está usando. As duas camadas são complementares:

```
LessonCatalogEntry.runtime.adapterId  →  aponta para um ExecutionAdapterId
                                            │
                                            ▼
                                  RuntimeAdapterProfile
                                  (restrições daquele adapter,
                                   independente da lição)
```

## O que este documento não é

- Não é uma implementação de `execution-engine`, sandbox, rede ou filesystem
  real — todos os tipos aqui são declarativos, não aplicados por código.
- Não é uma decisão de roteamento em runtime — qual adapter uma execução real
  usa continua sendo responsabilidade futura de `execution-engine`.
- Não é a política ética/de segurança da Trilha 06 — apenas explicita que ela
  é pré-requisito (ver seção acima).
- Não altera o mapeamento segmento → adapter já publicado em
  `docs/product/learning-catalog-v1.md` — apenas explica o raciocínio e
  declara restrições adicionais por adapter.
- Não é UI, Supabase, migration, parser, comando ou IA executável.
