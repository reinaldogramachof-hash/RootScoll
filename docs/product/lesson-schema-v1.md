# Lesson Schema v1

> Documento de conteúdo/produto. **Define o formato de autoria de uma lição em YAML —
> não define uma tabela de banco de dados, não define um parser, não define código de
> `lesson-engine`.** É o contrato de escrita que todo autor de conteúdo da Fase 0 segue.

## Status

Formato proposto na Fase 0 (Etapa 005), derivado do arquivo de insumo
`fase-0-curriculo-terminal.md`. As 10 lições completas que seguem este schema estão em
`docs/product/curriculum-phase-0.md` (seção 4).

## Escopo deste documento

- Definir os campos do schema de lição usado nesta fase.
- Registrar as regras de escrita que todo autor de conteúdo deve seguir.
- Relacionar explicitamente este schema às entidades `Lesson`, `Step`, `Challenge` e
  `Hint` já definidas em `docs/product/domain-model-v1.md`, sinalizando onde há
  alinhamento direto e onde há uma diferença de granularidade que ainda precisa de
  decisão do Arquiteto.

Este documento **não** decide como o schema abaixo vira tabelas em Postgres — essa
tradução, se e quando fizer sentido, é trabalho de uma etapa futura de database
model, não desta.

## 1. Schema

```yaml
schema_version: 1
id: 03-criando-estrutura # imutável, usado na telemetria e no progresso
titulo: 'Criando estrutura de pastas'
nivel: 2 # 1 a 4, conforme docs/product/curriculum-phase-0.md (seção 2)
duracao_estimada_min: 6
conceitos: [mkdir, '-p', hierarquia]
pre_requisitos: [02-navegando]

setup:
  cwd: /home/aluno
  fs: [...] # conforme docs/product/curriculum-phase-0.md (seção 3)

briefing: | # o "porquê" — máximo 4 linhas
tarefa: | # o "o quê" — 1 ou 2 frases, imperativo
validadores: [...] # conforme docs/architecture/validation-grammar-v1.md

dicas: # liberadas progressivamente
  - { apos_tentativas: 2, texto: '...' }
  - { apos_tentativas: 4, texto: '...' }
  - { apos_tentativas: 6, texto: '...', revela_resposta: true }

erros_comuns:
  - gatilho: comando # comando | saida
    padrao: "mkdir .*\\.txt$"
    mensagem: '...'

sucesso: | # fecha o conceito, 2 linhas
```

### Campos

| Campo                    | Propósito                                                                                                               |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------------- |
| `schema_version`         | versão do schema de lição usado; permite evoluir o formato sem quebrar lições antigas.                                  |
| `id`                     | identificador imutável da lição, usado em `pre_requisitos`, progresso e telemetria.                                     |
| `titulo`                 | título exibido ao aluno.                                                                                                |
| `nivel`                  | 1 a 4, conforme os níveis de comando descritos em `curriculum-phase-0.md`.                                              |
| `duracao_estimada_min`   | estimativa de duração, usada para dosar o currículo — máximo 8 min (regra 5).                                           |
| `conceitos`              | lista de conceitos/comandos ensinados nesta lição.                                                                      |
| `pre_requisitos`         | lista de `id`s de lições que devem ser concluídas antes desta.                                                          |
| `setup.cwd` / `setup.fs` | estado inicial do filesystem virtual e diretório de trabalho, no formato descrito em `curriculum-phase-0.md` (seção 3). |
| `briefing`               | explica por que o conceito importa no trabalho real.                                                                    |
| `tarefa`                 | descreve o resultado desejado, sem citar o comando literal.                                                             |
| `validadores`            | lista de `ValidationRule`s de conteúdo, no formato de `validation-grammar-v1.md`.                                       |
| `dicas`                  | dicas progressivas, liberadas após N tentativas.                                                                        |
| `erros_comuns`           | padrões de erro conhecidos, com mensagem pedagógica associada.                                                          |
| `sucesso`                | mensagem de fechamento do conceito ao concluir a lição.                                                                 |

## 2. Regras de escrita

Regras que valem para todo autor de conteúdo, preservadas do insumo original:

1. `briefing` responde **por que** isso importa no trabalho real. Sem isso, vira
   decoreba.
2. `tarefa` nunca contém o comando literal. Descreve o resultado desejado.
3. Toda lição tem no mínimo **2 `erros_comuns`**. Esse campo é o que faz o produto
   parecer inteligente — e é 100% trabalho de conteúdo, não de engine.
4. Mensagem de erro comum ensina o conceito, não entrega a resposta.
5. Máximo 8 minutos por lição (`duracao_estimada_min`).

## 3. Alinhamento arquitetural com o Domain Model v1

`docs/product/domain-model-v1.md` já define quatro entidades pedagógicas com uma
relação hierárquica explícita:

- `Lesson` (N `Lesson` → 1 `Module`; 1 `Lesson` → N `Step`)
- `Step` (N `Step` → 1 `Lesson`; 0..1 `Step` → 0..1 `Challenge`)
- `Challenge` (N `Challenge` → 0..1 `Step`; 1 `Challenge` → N `ValidationRule`; 1
  `Challenge` → N `Hint`)
- `Hint` (N `Hint` → 1 `Challenge`)

O schema de lição desta Fase 0 é **mais achatado** do que essa hierarquia: cada arquivo
de lição combina, num único nível, o que o Domain Model v1 modela como `Lesson` +
`Step` + `Challenge` + `Hint` juntos.

### Onde o mapeamento é direto

- `titulo`, `conceitos`, `duracao_estimada_min`, `pre_requisitos` → campos conceituais
  de `Lesson`.
- `dicas` → lista de `Hint`, na mesma ideia de revelação progressiva já registrada como
  regra de negócio de `Hint` no Domain Model v1.
- `validadores` → lista de `ValidationRule`, associada ao desafio descrito por
  `tarefa`.

### Onde há uma diferença de granularidade não resolvida

- O Domain Model v1 modela `Step` como a menor unidade sequencial dentro de uma
  `Lesson`, podendo haver múltiplos `Step`s (alguns de instrução/teoria, outros
  contendo um `Challenge` prático) por lição.
- O schema desta Fase 0 não tem um conceito de `Step` explícito: `briefing` + `tarefa` +
  `validadores` formam, na prática, **uma única lição = um único `Challenge`**, sem
  decomposição em múltiplos passos sequenciais.

Este documento **não decide** se isso é aceitável em definitivo (uma lição de Fase 0
sempre mapeia para exatamente um `Challenge`, e `Step` seria uma camada futura para
lições mais longas) ou se `Step`s implícitos precisam ser introduzidos já na Fase 1. A
decisão é registrada como pergunta arquitetural (ver `curriculum-phase-0.md`, seção de
alinhamento arquitetural, e a lista de ARCHITECTURAL QUESTIONS desta etapa).

## O que este documento não é

- Não é uma definição de tabela de banco de dados. `docs/database/database-model-v1.md`
  é o único documento autorizado a propor mapeamento de entidades para tabelas.
- Não é um parser ou validador de schema executável. Nenhum código foi escrito para
  validar lições contra este schema.
- Não substitui `docs/product/domain-model-v1.md` — este documento descreve um formato
  de autoria de conteúdo que ainda precisa ser reconciliado com as entidades já
  definidas lá.
