# Validation Grammar v1

> Documento de conteúdo/arquitetura conceitual. **Define a gramática de autoria dos
> validadores usados nas lições da Fase 0 — não define um parser real, não define
> código de `lesson-engine`, não é o contrato técnico definitivo de `ValidationRule`.**

## Status

Gramática proposta na Fase 0 (Etapa 005), derivada do arquivo de insumo
`fase-0-curriculo-terminal.md`, e relacionada explicitamente ao contrato conceitual
`ValidationRule` já definido em `docs/architecture/engine-contracts-v1.md`.

## Escopo deste documento

- Registrar a regra de ouro de validação e sua exceção única.
- Descrever os tipos de validador disponíveis para autores de conteúdo na Fase 0.
- Descrever as regras de composição (E / OU / NÃO lógico).
- Relacionar esses tipos aos quatro tipos conceituais de validação já registrados em
  `engine-contracts-v1.md`.

Este documento **não** implementa nenhum desses validadores como código. Os blocos YAML
abaixo são formato de autoria de conteúdo, avaliados manualmente por quem escreve a
lição — não por um executor real.

## 1. Regra de ouro

**Valide o estado final, nunca a string digitada.** Existe mais de um caminho certo
para quase todo objetivo, e punir o caminho alternativo é o oposto de ensinar.

### Exceção única e consciente

Quando o objetivo pedagógico **é** o comando em si (ex.: "consulte o manual do `ls`"),
aí `comando_executado` é legítimo. Fora desse caso, validar pelo comando digitado em
vez de pelo resultado é considerado um erro de conteúdo.

## 2. Tipos disponíveis

```yaml
# Estrutura
- { tipo: existe, caminho: /home/aluno/src, como: dir }
- { tipo: existe, caminho: /home/aluno/src/index.js, como: arquivo }
- { tipo: nao_existe, caminho: /home/aluno/temp.txt }
- { tipo: contagem, caminho: /home/aluno/logs, glob: '*.log', min: 3, max: 3 }

# Conteúdo
- { tipo: conteudo, caminho: /home/aluno/notas.txt, contem: 'plena' }
- { tipo: conteudo, caminho: /home/aluno/notas.txt, igual: 'linha unica' }
- { tipo: conteudo, caminho: /home/aluno/notas.txt, regex: '^erro:' }
- { tipo: linhas, caminho: /home/aluno/saida.txt, min: 2 }

# Contexto
- { tipo: cwd, caminho: /home/aluno/projeto }
- { tipo: permissao, caminho: /home/aluno/script.sh, modo: '755' }

# Execução
- { tipo: saida_contem, texto: 'aluno', ultimo_comando: true }
- { tipo: codigo_saida, valor: 0 }
- { tipo: comando_executado, padrao: "^man\\s+ls", min_vezes: 1 }
```

## 3. Composição

```yaml
validadores: # lista = E lógico (todos precisam passar)
  - { tipo: existe, caminho: /home/aluno/src, como: dir }
  - qualquer_um: # OU lógico
      - { tipo: conteudo, caminho: /home/aluno/a.txt, contem: 'ok' }
      - { tipo: conteudo, caminho: /home/aluno/b.txt, contem: 'ok' }
  - nenhum: # NÃO lógico
      - { tipo: existe, caminho: /home/aluno/rascunho.txt }
```

## 4. Quando cada validador roda

Após **cada** comando executado. A lição é concluída no instante em que todos os
validadores passam — o aluno não precisa clicar em "verificar". Isso é o que faz o
sistema parecer vivo.

## 5. Alinhamento arquitetural com `ValidationRule`

`docs/architecture/engine-contracts-v1.md` (seção 3) já define `ValidationRule` como
contrato conceitual: uma função pura que recebe um `ExecutionResult` (mais parâmetros
de configuração definidos junto ao `Challenge`) e devolve um veredito
(sucesso/falha/parcial). Esse documento também lista quatro categorias conceituais de
validação, ainda sem vocabulário técnico definitivo. Esta gramática de conteúdo propõe
o primeiro vocabulário concreto para essas categorias:

| Categoria conceitual (`engine-contracts-v1.md`) | Tipos desta gramática                                                        |
| ----------------------------------------------- | ---------------------------------------------------------------------------- |
| validação de saída                              | `saida_contem`                                                               |
| validação de código de saída                    | `codigo_saida`                                                               |
| validação de estado do filesystem virtual       | `existe`, `nao_existe`, `contagem`, `conteudo`, `linhas`, `cwd`, `permissao` |
| validação de comando executado                  | `comando_executado` (uso restrito à exceção pedagógica da seção 1)           |

### Compatibilidade confirmada

- Todo tipo de validador desta gramática cabe em uma das quatro categorias já previstas
  em `engine-contracts-v1.md` — nenhum tipo novo de validação é introduzido.
- `comando_executado` já era esperado como categoria conceitual ("comando em si, não só
  seu resultado") em `engine-contracts-v1.md`; esta gramática apenas formaliza que seu
  uso deve ser a exceção, não a regra, alinhado à regra de ouro da seção 1.
- Como `ValidationRule` recebe exclusivamente um `ExecutionResult` (mais os parâmetros
  da própria regra) e nunca acesso direto a `VirtualFileSystemState` ou
  `CommandAttempt` bruto, os tipos de "estrutura"/"conteúdo"/"contexto" acima assumem
  que o `ExecutionResult` carrega, de alguma forma, o estado do filesystem virtual
  suficiente para respondê-los — algo já registrado como esperado em
  `engine-contracts-v1.md` ("o que o `ExecutionResult` deve conter para que qualquer
  `ValidationRule` avaliar um `Challenge`"), mas ainda sem o detalhamento de campo a
  campo. Esse detalhamento fica como trabalho de uma etapa técnica futura, não desta.

### O que esta gramática não decide

- Não decide a implementação real de nenhum tipo de validador (parser, matcher de
  regex, comparação de permissão Unix, etc.).
- Não decide se os tipos acima viram um enum, uma união discriminada, ou outro
  mecanismo técnico em código — isso é trabalho de implementação de `lesson-engine`,
  fora do escopo desta etapa de documentação.
- Não decide o formato exato de payload de `ExecutionResult` necessário para suportar
  cada tipo — apenas assume, de forma consistente com `engine-contracts-v1.md`, que tal
  payload deve existir.

## O que este documento não é

- Não é um parser de validadores. Nenhum código foi escrito para interpretar os blocos
  YAML acima.
- Não substitui `docs/architecture/engine-contracts-v1.md` — esta gramática é uma
  proposta de vocabulário concreto para as categorias já conceitualmente definidas lá,
  não uma revisão daquele documento.
