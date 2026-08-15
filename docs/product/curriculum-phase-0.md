# Curriculum — Phase 0

> Documento de produto/conteúdo. **Nenhuma linha de código foi escrita a partir deste
> documento.** A Fase 0 produz conteúdo e contrato de dados que o código de uma futura
> Fase 1 (implementação de `terminal-engine`, `lesson-engine`, `execution-engine`) vai
> apenas executar — não o contrário. Este documento incorpora, como documentação
> oficial do projeto, o conteúdo do arquivo externo `fase-0-curriculo-terminal.md`
> (fornecido pelo usuário fora do repositório), organizado e relacionado à arquitetura
> já aprovada (`docs/product/domain-model-v1.md`,
> `docs/architecture/engine-contracts-v1.md`).
>
> **Não entra na Fase 0**: login, skins, voz, painel do professor, WASM, banco de
> dados. Essas áreas já têm planejamento conceitual próprio em etapas anteriores
> (Domain Model v1, Engine Contracts v1, Database Model v1, RLS Planning v1) e não são
> alteradas por este documento.

## Status

Conteúdo definido (Fase 0). Implementação de código (Fase 1) não iniciada — aguarda
aprovação explícita do Arquiteto antes de começar.

## 1. Entregáveis da Fase 0

| #   | Entregável                                        | Onde está                                    | Pronto quando                                                         |
| --- | ------------------------------------------------- | -------------------------------------------- | --------------------------------------------------------------------- |
| 1   | Lista fechada de comandos do MVP                  | Seção 2 deste documento                      | Nenhum comando novo entra sem tirar outro                             |
| 2   | Modelo do filesystem virtual (formato de autoria) | Seção 3 deste documento                      | Um autor de conteúdo consegue escrever um setup sem perguntar nada    |
| 3   | Gramática de validadores                          | `docs/architecture/validation-grammar-v1.md` | Todo objetivo das 10 lições é expressável sem inventar validador novo |
| 4   | Schema da lição                                   | `docs/product/lesson-schema-v1.md`           | Versionado com `schema_version`                                       |
| 5   | 10 lições completas                               | Seção 4 deste documento                      | Revisadas por 1 pessoa que não é o autor                              |
| 6   | Eventos de telemetria                             | Seção 5 deste documento                      | Definidos antes do código existir                                     |
| 7   | Critérios de aceite                               | Seção 6 deste documento                      | Números escritos **antes** do piloto                                  |

## 2. Comandos do MVP (21 comandos + 3 operadores)

Lista **fechada**. Cada comando existe porque uma das 10 lições depende dele. Nenhum
comando novo deve ser adicionado à Fase 1 sem que uma lição correspondente já exista
aqui, e nenhum comando desta lista deve ser removido sem revisar as lições que
dependem dele.

### Nível 1 — Orientação

| Comando | Flags no MVP                       | Ensina                          |
| ------- | ---------------------------------- | ------------------------------- |
| `pwd`   | —                                  | Onde estou                      |
| `ls`    | `-l`, `-a`                         | O que existe aqui               |
| `cd`    | `..`, `~`, `-`, relativo, absoluto | Movimento                       |
| `clear` | —                                  | Controle da tela                |
| `man`   | — (texto curto interno)            | Autonomia: aprender a consultar |

### Nível 2 — Arquivos e diretórios

| Comando | Flags no MVP | Ensina                            |
| ------- | ------------ | --------------------------------- |
| `mkdir` | `-p`         | Criar estrutura                   |
| `touch` | —            | Criar arquivo vazio               |
| `cat`   | —            | Ler conteúdo                      |
| `echo`  | —            | Gerar conteúdo                    |
| `cp`    | `-r`         | Copiar                            |
| `mv`    | —            | Mover e renomear (mesmo comando!) |
| `rm`    | `-r`, `-f`   | Destruir com consciência          |
| `tree`  | —            | Visualizar hierarquia             |

### Nível 3 — Conteúdo e fluxo

| Comando | Flags no MVP     | Ensina                |
| ------- | ---------------- | --------------------- |
| `head`  | `-n`             | Leitura parcial       |
| `tail`  | `-n`             | Leitura parcial       |
| `grep`  | `-i`, `-r`       | Busca em conteúdo     |
| `find`  | `-name`, `-type` | Busca em estrutura    |
| `wc`    | `-l`             | Contagem / composição |

### Nível 4 — Sistema

| Comando   | Flags no MVP | Ensina                 |
| --------- | ------------ | ---------------------- |
| `chmod`   | modo octal   | Permissões             |
| `whoami`  | —            | Identidade e contexto  |
| `history` | —            | O terminal tem memória |

### Operadores (features do parser, não comandos)

| Operador | Ensina                                          |
| -------- | ----------------------------------------------- |
| `\|`     | Composição — o conceito mais importante do Unix |
| `>`      | Redirecionar, sobrescrevendo                    |
| `>>`     | Redirecionar, acrescentando                     |

> **Decisão de conteúdo travada na Fase 0**: o parser (quando implementado por
> `terminal-engine`) nasce com pipeline e redirecionamento. Adicionar depois
> significaria reescrever o interpretador. Esta é uma restrição que a Fase 0 impõe à
> futura implementação técnica, não uma decisão técnica em si — cabe a
> `packages/terminal-engine/src/parser` honrá-la quando implementado.

### Comportamentos de terminal exigidos no MVP

Não são comandos, mas definem a sensação de realismo esperada da futura implementação
de `terminal-engine`:

- Histórico navegável com seta ↑ / ↓
- `Tab` completa caminhos e nomes de arquivo
- `Ctrl+C` cancela a linha atual, `Ctrl+L` limpa a tela
- Prompt dinâmico: `aluno@plena:~/projeto$`
- Mensagens de erro reais: `bash: cd: xyz: No such file or directory`

## 3. Modelo do filesystem virtual (formato de autoria)

Formato **plano** (lista de caminhos), não árvore aninhada — mais fácil de escrever à
mão, gera diff limpo no Git e evita indentação errada em YAML.

```yaml
setup:
  usuario: aluno
  host: plena
  cwd: /home/aluno
  fs:
    - { caminho: /home/aluno, tipo: dir }
    - { caminho: /home/aluno/documentos, tipo: dir }
    - { caminho: /home/aluno/notas.txt, tipo: arquivo, conteudo: "primeira linha\nsegunda linha" }
    - { caminho: /home/aluno/script.sh, tipo: arquivo, conteudo: 'echo ola', permissao: '644' }
```

**Campos:**

- `caminho` — absoluto, obrigatório
- `tipo` — `dir` | `arquivo`
- `conteudo` — string, só para `arquivo`. Padrão: vazio
- `permissao` — octal em string. Padrão: `755` para dir, `644` para arquivo

Diretórios pai são criados implicitamente se não declarados.

> **Nota de alinhamento arquitetural**: este é o **formato de autoria de conteúdo**
> (como um autor de lição descreve o filesystem inicial de um exercício) — não é,
> necessariamente, o formato de runtime do `VirtualFileSystemState`
> (`docs/product/domain-model-v1.md`, seção 3), que `terminal-engine` manterá durante
> uma `TerminalSession` real. Os dois podem coincidir na implementação, mas isso é uma
> decisão técnica de Fase 1, não assumida aqui. O que a Fase 0 fixa é: todo `setup` de
> lição parte de um estado inicial descrito neste formato plano.

## 4. As 10 lições do protótipo

> O schema completo usado em cada lição abaixo (campos, tipos, regras de escrita) está
> documentado separadamente em `docs/product/lesson-schema-v1.md`. As lições abaixo são
> reproduzidas integralmente como conteúdo de produto — são exemplos completos e
> aprovados do schema em uso, não pseudocódigo.

### Lição 1

```yaml
schema_version: 1
id: 01-onde-estou
titulo: 'Onde estou?'
nivel: 1
duracao_estimada_min: 4
conceitos: [pwd, ls, clear]
pre_requisitos: []
setup:
  cwd: /home/aluno
  fs:
    - { caminho: /home/aluno, tipo: dir }
    - { caminho: /home/aluno/documentos, tipo: dir }
    - { caminho: /home/aluno/downloads, tipo: dir }
    - { caminho: /home/aluno/leiame.txt, tipo: arquivo, conteudo: 'Bem-vindo ao terminal.' }
briefing: |
  No terminal não existe janela mostrando onde você está. Todo comando que
  você digita acontece a partir de um lugar — o diretório atual. Errar esse
  lugar é a causa nº 1 de comandos que "não funcionam".
tarefa: |
  Descubra em qual diretório você está e liste tudo o que existe dentro dele.
validadores:
  - { tipo: comando_executado, padrao: "^pwd\\s*$", min_vezes: 1 }
  - { tipo: comando_executado, padrao: "^ls(\\s|$)", min_vezes: 1 }
dicas:
  - {
      apos_tentativas: 2,
      texto: 'Dois comandos de 2 e 3 letras. Um diz o caminho, outro mostra o conteúdo.',
    }
  - { apos_tentativas: 4, texto: 'print working directory... e list.', revela_resposta: false }
  - { apos_tentativas: 6, texto: 'Use: pwd e depois ls', revela_resposta: true }
erros_comuns:
  - gatilho: comando
    padrao: "^dir\\s*$"
    mensagem: 'dir é do Windows. No mundo Unix o comando é ls.'
  - gatilho: comando
    padrao: "^LS\\s*$"
    mensagem: 'O terminal diferencia maiúsculas de minúsculas. Tente ls.'
sucesso: |
  pwd te diz onde você está, ls te diz o que existe ali. Esses dois comandos
  vão te acompanhar por toda a carreira.
```

### Lição 2

```yaml
schema_version: 1
id: 02-navegando
titulo: 'Navegando entre diretórios'
nivel: 1
duracao_estimada_min: 6
conceitos: [cd, 'caminho relativo', 'caminho absoluto', '..', '~']
pre_requisitos: [01-onde-estou]
setup:
  cwd: /home/aluno
  fs:
    - { caminho: /home/aluno, tipo: dir }
    - { caminho: /home/aluno/projetos, tipo: dir }
    - { caminho: /home/aluno/projetos/site, tipo: dir }
    - { caminho: /home/aluno/projetos/site/css, tipo: dir }
    - { caminho: /home/aluno/projetos/api, tipo: dir }
briefing: |
  Navegar é mover o "ponto de partida" dos seus comandos. Existem dois jeitos
  de dizer para onde ir: o caminho relativo (a partir de onde você está) e o
  absoluto (a partir da raiz). Os dois são certos em situações diferentes.
tarefa: |
  Vá até a pasta css, dentro de site, dentro de projetos.
validadores:
  - { tipo: cwd, caminho: /home/aluno/projetos/site/css }
dicas:
  - {
      apos_tentativas: 2,
      texto: 'Você pode ir um passo por vez, ou tudo de uma vez separando com /',
    }
  - { apos_tentativas: 4, texto: 'cd aceita caminhos compostos: pasta/subpasta' }
  - { apos_tentativas: 6, texto: 'Use: cd projetos/site/css', revela_resposta: true }
erros_comuns:
  - gatilho: comando
    padrao: "^cd\\s+css\\s*$"
    mensagem: 'css não está aqui — está dentro de site. Confira com ls antes de andar.'
  - gatilho: comando
    padrao: "^cd\\s*$"
    mensagem: 'cd sozinho te leva de volta para a sua pasta pessoal. Informe um destino.'
sucesso: |
  cd .. sobe um nível, cd ~ volta para casa, cd - volta para onde você estava.
  Guarde esses três: economizam horas.
```

### Lição 3

```yaml
schema_version: 1
id: 03-criando-estrutura
titulo: 'Criando estrutura de pastas'
nivel: 2
duracao_estimada_min: 6
conceitos: [mkdir, '-p', hierarquia]
pre_requisitos: [02-navegando]
setup:
  cwd: /home/aluno
  fs:
    - { caminho: /home/aluno, tipo: dir }
briefing: |
  Todo projeto começa com uma estrutura de pastas. Fazer isso pelo terminal
  leva segundos e é reproduzível — você pode transformar em script depois.
tarefa: |
  Crie a estrutura meu-app/src/components de uma só vez.
validadores:
  - { tipo: existe, caminho: /home/aluno/meu-app, como: dir }
  - { tipo: existe, caminho: /home/aluno/meu-app/src, como: dir }
  - { tipo: existe, caminho: /home/aluno/meu-app/src/components, como: dir }
dicas:
  - {
      apos_tentativas: 2,
      texto: 'mkdir sozinho só cria um nível. Existe uma flag que cria os pais que faltam.',
    }
  - { apos_tentativas: 4, texto: 'A flag é -p, de parents.' }
  - { apos_tentativas: 6, texto: 'Use: mkdir -p meu-app/src/components', revela_resposta: true }
erros_comuns:
  - gatilho: comando
    padrao: "^mkdir\\s+[^-].*/"
    mensagem: 'Sem a flag -p, o mkdir não cria pastas intermediárias que ainda não existem.'
  - gatilho: comando
    padrao: "^mkdir\\s+.*\\.(txt|js|html)$"
    mensagem: 'mkdir cria diretórios. Para criar um arquivo, você usará touch na próxima lição.'
sucesso: |
  mkdir -p é idempotente: rodar duas vezes não quebra nada. Por isso ele aparece
  em praticamente todo script de setup de projeto.
```

### Lição 4

```yaml
schema_version: 1
id: 04-criando-arquivos
titulo: 'Criando e preenchendo arquivos'
nivel: 2
duracao_estimada_min: 7
conceitos: [touch, echo, '>']
pre_requisitos: [03-criando-estrutura]
setup:
  cwd: /home/aluno/meu-app
  fs:
    - { caminho: /home/aluno/meu-app, tipo: dir }
    - { caminho: /home/aluno/meu-app/src, tipo: dir }
briefing: |
  Existem duas formas de criar arquivo no terminal: vazio (touch) ou já com
  conteúdo (echo com redirecionamento). O símbolo > pega a saída de um comando
  e joga dentro de um arquivo em vez da tela.
tarefa: |
  Crie um arquivo vazio chamado src/index.js e um arquivo README.md contendo
  exatamente o texto: Meu App
validadores:
  - { tipo: existe, caminho: /home/aluno/meu-app/src/index.js, como: arquivo }
  - { tipo: conteudo, caminho: /home/aluno/meu-app/README.md, contem: 'Meu App' }
dicas:
  - {
      apos_tentativas: 2,
      texto: 'Um comando cria vazio. Para o outro, imprima o texto e desvie a saída para o arquivo.',
    }
  - {
      apos_tentativas: 4,
      texto: 'echo imprime na tela. O símbolo > muda o destino dessa impressão.',
    }
  - {
      apos_tentativas: 6,
      texto: 'Use: touch src/index.js e depois echo "Meu App" > README.md',
      revela_resposta: true,
    }
erros_comuns:
  - gatilho: comando
    padrao: "^echo\\s+[^>]*$"
    mensagem: 'Isso imprimiu na tela. Para gravar em arquivo, redirecione com >'
  - gatilho: comando
    padrao: "^touch\\s+README\\.md.*Meu App"
    mensagem: 'touch só cria o arquivo, não escreve dentro dele.'
sucesso: |
  Atenção: > sobrescreve o arquivo inteiro, sem avisar. Já >> acrescenta no final.
  Confundir os dois já apagou muito trabalho por aí.
```

### Lição 5

```yaml
schema_version: 1
id: 05-lendo-arquivos
titulo: 'Lendo arquivos sem abrir editor'
nivel: 2
duracao_estimada_min: 6
conceitos: [cat, head, tail, '-n']
pre_requisitos: [04-criando-arquivos]
setup:
  cwd: /home/aluno
  fs:
    - { caminho: /home/aluno, tipo: dir }
    - {
        caminho: /home/aluno/servidor.log,
        tipo: arquivo,
        conteudo: "linha 1 inicio\nlinha 2 ok\nlinha 3 ok\nlinha 4 ok\nlinha 5 ok\nlinha 6 ok\nlinha 7 ok\nlinha 8 ok\nlinha 9 aviso\nlinha 10 erro: falha ao conectar",
      }
briefing: |
  Arquivos de log podem ter milhões de linhas. Abrir no editor trava a máquina.
  Por isso todo desenvolvedor lê logs pelo terminal — e quase sempre só o final,
  que é onde está o erro mais recente.
tarefa: |
  Salve as 3 últimas linhas de servidor.log em um arquivo chamado ultimas.txt
validadores:
  - { tipo: existe, caminho: /home/aluno/ultimas.txt, como: arquivo }
  - { tipo: conteudo, caminho: /home/aluno/ultimas.txt, contem: 'linha 10 erro' }
  - { tipo: linhas, caminho: /home/aluno/ultimas.txt, min: 3, max: 3 }
dicas:
  - {
      apos_tentativas: 2,
      texto: 'cat mostra tudo. Existe um comando específico para o final do arquivo.',
    }
  - { apos_tentativas: 4, texto: 'tail mostra o fim. A quantidade de linhas se controla com -n.' }
  - {
      apos_tentativas: 6,
      texto: 'Use: tail -n 3 servidor.log > ultimas.txt',
      revela_resposta: true,
    }
erros_comuns:
  - gatilho: comando
    padrao: "^head\\s+-n\\s+3"
    mensagem: 'head mostra o começo do arquivo. Você quer o final.'
  - gatilho: comando
    padrao: "^tail\\s+-n\\s+3\\s+servidor\\.log\\s*$"
    mensagem: 'Certo, mas o resultado foi para a tela. Falta gravar em ultimas.txt.'
sucesso: |
  tail -f (de follow) acompanha um log em tempo real enquanto a aplicação roda.
  É o comando mais usado em plantão de produção.
```

### Lição 6

```yaml
schema_version: 1
id: 06-copiar-mover
titulo: 'Copiar, mover e renomear'
nivel: 2
duracao_estimada_min: 6
conceitos: [cp, '-r', mv]
pre_requisitos: [05-lendo-arquivos]
setup:
  cwd: /home/aluno/site
  fs:
    - { caminho: /home/aluno/site, tipo: dir }
    - { caminho: /home/aluno/site/index.html, tipo: arquivo, conteudo: '<h1>site</h1>' }
    - { caminho: /home/aluno/site/assets, tipo: dir }
    - { caminho: /home/aluno/site/assets/logo.png, tipo: arquivo, conteudo: 'PNG' }
    - { caminho: /home/aluno/backup, tipo: dir }
briefing: |
  No terminal, renomear e mover são o mesmo comando: mv. Isso confunde no início
  e faz todo sentido depois — renomear é mover o arquivo para outro nome.
tarefa: |
  Copie a pasta assets inteira para dentro de /home/aluno/backup e renomeie
  index.html para home.html.
validadores:
  - { tipo: existe, caminho: /home/aluno/backup/assets/logo.png, como: arquivo }
  - { tipo: existe, caminho: /home/aluno/site/assets/logo.png, como: arquivo }
  - { tipo: existe, caminho: /home/aluno/site/home.html, como: arquivo }
  - { tipo: nao_existe, caminho: /home/aluno/site/index.html }
dicas:
  - {
      apos_tentativas: 2,
      texto: "Copiar pasta exige uma flag que diz 'inclua tudo que está dentro'.",
    }
  - { apos_tentativas: 4, texto: 'A flag é -r, de recursivo. E renomear usa mv com dois nomes.' }
  - {
      apos_tentativas: 6,
      texto: 'Use: cp -r assets /home/aluno/backup e mv index.html home.html',
      revela_resposta: true,
    }
erros_comuns:
  - gatilho: comando
    padrao: "^cp\\s+assets"
    mensagem: 'Sem -r, o cp se recusa a copiar diretórios.'
  - gatilho: comando
    padrao: "^mv\\s+assets\\s+/home/aluno/backup"
    mensagem: 'mv move — a pasta sairia daqui. Você precisa de uma cópia, mantendo a original.'
sucesso: |
  Copiar é seguro, mover não tem volta. Quando estiver em dúvida sob pressão,
  copie primeiro e apague depois.
```

### Lição 7

```yaml
schema_version: 1
id: 07-removendo
titulo: 'Removendo com consciência'
nivel: 2
duracao_estimada_min: 5
conceitos: [rm, '-r', risco]
pre_requisitos: [06-copiar-mover]
setup:
  cwd: /home/aluno/projeto
  fs:
    - { caminho: /home/aluno/projeto, tipo: dir }
    - { caminho: /home/aluno/projeto/src, tipo: dir }
    - { caminho: /home/aluno/projeto/src/app.js, tipo: arquivo, conteudo: 'console.log(1)' }
    - { caminho: /home/aluno/projeto/temp, tipo: dir }
    - { caminho: /home/aluno/projeto/temp/cache.tmp, tipo: arquivo, conteudo: 'lixo' }
    - { caminho: /home/aluno/projeto/rascunho.txt, tipo: arquivo, conteudo: 'notas antigas' }
briefing: |
  O terminal não tem lixeira. O que rm apaga, some. Essa lição é menos sobre
  o comando e mais sobre o hábito: olhar antes de apagar.
tarefa: |
  Apague o arquivo rascunho.txt e a pasta temp inteira. Não toque em src.
validadores:
  - { tipo: nao_existe, caminho: /home/aluno/projeto/rascunho.txt }
  - { tipo: nao_existe, caminho: /home/aluno/projeto/temp }
  - { tipo: existe, caminho: /home/aluno/projeto/src/app.js, como: arquivo }
dicas:
  - {
      apos_tentativas: 2,
      texto: 'Rode ls antes de cada rm. Esse é o hábito que a lição quer criar.',
    }
  - { apos_tentativas: 4, texto: 'Pasta com conteúdo dentro exige a flag recursiva.' }
  - { apos_tentativas: 6, texto: 'Use: rm rascunho.txt e rm -r temp', revela_resposta: true }
erros_comuns:
  - gatilho: comando
    padrao: "^rm\\s+temp\\s*$"
    mensagem: 'rm sozinho não apaga diretórios. Falta a flag -r.'
  - gatilho: comando
    padrao: "^rm\\s+-rf?\\s+\\*"
    mensagem: 'PARE. Isso apagaria tudo nesta pasta, inclusive src. Seja específico no alvo.'
sucesso: |
  rm -rf / é o comando mais famoso da história por destruir sistemas inteiros.
  Nunca digite -f no automático: a flag existe para silenciar avisos.
```

### Lição 8

```yaml
schema_version: 1
id: 08-buscando
titulo: 'Encontrando o que você não sabe onde está'
nivel: 3
duracao_estimada_min: 7
conceitos: [grep, '-r', find, '-name']
pre_requisitos: [07-removendo]
setup:
  cwd: /home/aluno/api
  fs:
    - { caminho: /home/aluno/api, tipo: dir }
    - { caminho: /home/aluno/api/src, tipo: dir }
    - {
        caminho: /home/aluno/api/src/auth.js,
        tipo: arquivo,
        conteudo: "const TOKEN = 'abc'\nfunction login() {}",
      }
    - {
        caminho: /home/aluno/api/src/db.js,
        tipo: arquivo,
        conteudo: "const conn = 'postgres'\nconsole.log(conn)",
      }
    - { caminho: /home/aluno/api/config, tipo: dir }
    - { caminho: /home/aluno/api/config/prod.env, tipo: arquivo, conteudo: 'TOKEN=xyz' }
    - { caminho: /home/aluno/api/config/dev.env, tipo: arquivo, conteudo: 'DEBUG=true' }
briefing: |
  Em um projeto real você herda código que nunca viu. Duas perguntas se repetem:
  "onde está o arquivo X?" (find) e "onde essa palavra aparece?" (grep).
tarefa: |
  Encontre todas as ocorrências da palavra TOKEN em qualquer arquivo do projeto
  e grave o resultado em achados.txt
validadores:
  - { tipo: existe, caminho: /home/aluno/api/achados.txt, como: arquivo }
  - { tipo: conteudo, caminho: /home/aluno/api/achados.txt, contem: 'auth.js' }
  - { tipo: conteudo, caminho: /home/aluno/api/achados.txt, contem: 'prod.env' }
dicas:
  - { apos_tentativas: 2, texto: 'Buscar dentro do conteúdo dos arquivos é trabalho do grep.' }
  - {
      apos_tentativas: 4,
      texto: "Para descer por todas as subpastas, use -r. O ponto . significa 'a partir daqui'.",
    }
  - { apos_tentativas: 6, texto: 'Use: grep -r TOKEN . > achados.txt', revela_resposta: true }
erros_comuns:
  - gatilho: comando
    padrao: "^find\\s+.*TOKEN"
    mensagem: 'find procura por nome de arquivo, não pelo conteúdo. Para conteúdo, use grep.'
  - gatilho: comando
    padrao: "^grep\\s+TOKEN\\s*$"
    mensagem: 'Falta dizer ao grep onde procurar. Ex: grep -r TOKEN .'
sucesso: |
  grep -r é como se encontra qualquer coisa em base de código legada. Junto do
  find, resolve 90% das buscas do dia a dia.
```

### Lição 9

```yaml
schema_version: 1
id: 09-encadeando
titulo: 'Encadeando comandos com pipe'
nivel: 3
duracao_estimada_min: 8
conceitos: ['|', wc, '-l', '>>']
pre_requisitos: [08-buscando]
setup:
  cwd: /home/aluno
  fs:
    - { caminho: /home/aluno, tipo: dir }
    - {
        caminho: /home/aluno/acessos.log,
        tipo: arquivo,
        conteudo: "GET /home 200\nGET /login 200\nPOST /login 500\nGET /home 200\nGET /api 500\nGET /home 404\nPOST /api 500",
      }
    - { caminho: /home/aluno/relatorio.txt, tipo: arquivo, conteudo: 'RELATORIO DIARIO' }
briefing: |
  Esta é a ideia central do Unix: comandos pequenos que fazem uma coisa bem, e
  se encaixam. O pipe | pega a saída de um comando e entrega como entrada do
  próximo. Quem entende pipe, entende terminal.
tarefa: |
  Conte quantas linhas de acessos.log contêm o erro 500 e acrescente esse
  número ao final de relatorio.txt, sem apagar o que já existe lá.
validadores:
  - { tipo: conteudo, caminho: /home/aluno/relatorio.txt, contem: 'RELATORIO DIARIO' }
  - { tipo: conteudo, caminho: /home/aluno/relatorio.txt, regex: '3' }
dicas:
  - {
      apos_tentativas: 2,
      texto: 'Primeiro filtre as linhas, depois conte. Dois comandos ligados por |',
    }
  - { apos_tentativas: 4, texto: 'wc -l conta linhas. E acrescentar sem apagar usa >> em vez de >' }
  - {
      apos_tentativas: 6,
      texto: 'Use: grep 500 acessos.log | wc -l >> relatorio.txt',
      revela_resposta: true,
    }
erros_comuns:
  - gatilho: comando
    padrao: "\\|\\s*wc\\s+-l\\s*>\\s"
    mensagem: 'Com um > só você apagou o conteúdo anterior do relatório. Use >> para acrescentar.'
  - gatilho: comando
    padrao: "^wc\\s+-l\\s+acessos\\.log"
    mensagem: 'Isso conta todas as linhas. Filtre primeiro com grep e passe o resultado pelo pipe.'
sucesso: |
  Você acabou de compor uma ferramenta nova a partir de duas existentes, sem
  escrever uma linha de código. É assim que o terminal escala.
```

### Lição 10

```yaml
schema_version: 1
id: 10-permissoes
titulo: 'Permissões: por que o script não roda'
nivel: 4
duracao_estimada_min: 8
conceitos: ['ls -l', chmod, octal, whoami]
pre_requisitos: [09-encadeando]
setup:
  cwd: /home/aluno/deploy
  fs:
    - { caminho: /home/aluno/deploy, tipo: dir }
    - {
        caminho: /home/aluno/deploy/deploy.sh,
        tipo: arquivo,
        conteudo: 'echo iniciando deploy',
        permissao: '644',
      }
    - {
        caminho: /home/aluno/deploy/segredos.env,
        tipo: arquivo,
        conteudo: 'SENHA=123',
        permissao: '644',
      }
briefing: |
  "Permission denied" é o erro que mais trava iniciante em servidor. Todo arquivo
  tem três permissões (ler, escrever, executar) para três grupos (dono, grupo,
  outros). Um script só roda se tiver permissão de execução.
tarefa: |
  Torne deploy.sh executável e restrinja segredos.env para que apenas o dono
  possa ler e escrever, sem nenhum acesso para os demais.
validadores:
  - { tipo: permissao, caminho: /home/aluno/deploy/deploy.sh, modo: '755' }
  - { tipo: permissao, caminho: /home/aluno/deploy/segredos.env, modo: '600' }
dicas:
  - {
      apos_tentativas: 2,
      texto: 'Rode ls -l para ver as permissões atuais antes de mudar qualquer coisa.',
    }
  - {
      apos_tentativas: 4,
      texto: 'Cada dígito é dono/grupo/outros. Leitura=4, escrita=2, execução=1. Some.',
    }
  - {
      apos_tentativas: 6,
      texto: 'Use: chmod 755 deploy.sh e chmod 600 segredos.env',
      revela_resposta: true,
    }
erros_comuns:
  - gatilho: comando
    padrao: "^chmod\\s+777"
    mensagem: '777 libera tudo para todo mundo. Funciona, e é exatamente por isso que vira falha de segurança.'
  - gatilho: comando
    padrao: "^chmod\\s+.*segredos\\.env"
    mensagem: 'Confira o número: você precisa de leitura e escrita só para o dono, e zero para o resto.'
sucesso: |
  755 para o que precisa rodar, 644 para arquivo comum, 600 para segredo.
  Esses três números resolvem quase tudo no dia a dia.
```

## 5. Eventos de telemetria (definir agora, implementar na Fase 1)

Sem isso, o piloto vira opinião. São 5 eventos:

```
licao_iniciada    { licao_id, timestamp }
comando_digitado  { licao_id, comando_bruto, sucesso: bool, tentativa_n }
dica_solicitada   { licao_id, nivel_dica }
licao_concluida   { licao_id, duracao_seg, total_tentativas }
sessao_abandonada { licao_id, ultimo_comando, duracao_seg }
```

`comando_digitado` é o mais valioso: a lista dos comandos errados mais frequentes vira
diretamente a próxima leva de `erros_comuns`. É o loop de melhoria do produto.

Anonimize na Fase 1 (id de sessão, não de pessoa) — sem login, não há base legal nem
necessidade de identificar ninguém.

> **Nota de alinhamento arquitetural**: estes 5 eventos são conceitualmente próximos,
> mas **não idênticos**, a entidades já definidas em `docs/product/domain-model-v1.md`:
> `licao_iniciada`/`licao_concluida` se aproximam de transições de estado de
> `LessonProgress`; `comando_digitado` se aproxima fortemente de `CommandAttempt`
> (mas adiciona `sucesso`/`tentativa_n`, que dependem do resultado de validação, algo
> que `CommandAttempt` por si só não carrega); `dica_solicitada` se aproxima do uso de
> `Hint` (já implicitamente contado em `ChallengeProgress.hints_used` no planejamento
> de `docs/database/database-model-v1.md`); `sessao_abandonada` se aproxima de um
> estado de `TerminalSession`/`Enrollment` abandonada. Se telemetria será implementada
> como eventos derivados dessas tabelas, como uma tabela de analytics separada, ou como
> um pipeline totalmente fora do Postgres é uma decisão técnica de Fase 1, **não
> tomada neste documento** — ver ARCHITECTURAL QUESTIONS no relatório desta etapa.

## 6. Critérios de aceite

**Da Fase 0 (antes de escrever código):**

- As 10 lições existem, revisadas por alguém que não é o autor
- Nenhuma lição exigiu validador fora da gramática de
  `docs/architecture/validation-grammar-v1.md`
- Nenhuma lição exigiu comando fora da lista da seção 2 deste documento

Se algum dos dois últimos falhar, a gramática ou a lista de comandos estão
incompletas — a correção é neste documento e nos documentos relacionados, nunca no
código (que ainda não existe).

**Do piloto com a turma (definir o número ANTES de rodar):**

- ≥ 60% dos alunos concluem as 10 lições
- ≥ 3 alunos retornam ao sistema sem obrigação de nota, na semana 4
- Nenhuma lição com taxa de abandono acima de 40%

Sem critério escrito antes, qualquer resultado seria lido como sucesso — inclusive
pelo autor do conteúdo.

## Alinhamento arquitetural

Esta seção conecta explicitamente o conteúdo acima à arquitetura já aprovada.

- **A Fase 0 antecede qualquer implementação de engine.** Nada neste documento, em
  `lesson-schema-v1.md` ou em `validation-grammar-v1.md` constitui código de
  `terminal-engine`, `lesson-engine` ou `execution-engine` — são o **conteúdo e
  contrato de dados** que essas engines vão consumir quando implementadas (Fase 1),
  exatamente como o cabeçalho deste documento e o objetivo da Fase 0 estabelecem.
- **Compatibilidade com `docs/architecture/dependency-rules.md`**: o conteúdo de
  lição definido aqui não pressupõe nenhum acoplamento entre engines — uma
  `validation_rule` (seção de validadores de uma lição) continua sendo avaliada
  apenas contra o resultado de uma execução (`ExecutionResult`), nunca inspecionando
  o terminal diretamente, conforme já estabelecido em
  `docs/architecture/engine-contracts-v1.md`.
- **Compatibilidade com `engine-contracts-v1.md`**: os quatro tipos conceituais de
  validação já registrados em `engine-contracts-v1.md` (seção 3) — validação de
  saída, de código de saída, de estado do filesystem virtual, de comando executado —
  cobrem integralmente os tipos de validador concretos usados nas 10 lições (ver
  mapeamento detalhado em `docs/architecture/validation-grammar-v1.md`). Nenhum
  validador usado nas lições exige um tipo novo fora desses quatro.
- **Não transforma conteúdo pedagógico em schema de banco.** Os campos de uma lição
  (`briefing`, `tarefa`, `dicas`, `erros_comuns`, `sucesso`) são conteúdo de autor,
  não linhas de tabela — a relação com as tabelas candidatas já planejadas em
  `docs/database/database-model-v1.md` (`lessons`, `challenges`, `hints`,
  `validation_rules`) é de **origem de dado**, não de estrutura idêntica; ver
  `docs/product/lesson-schema-v1.md` para a discussão de granularidade.

## O que este documento não é

- Não é código. Nenhum parser, validador real ou terminal foi implementado.
- Não é um schema de banco de dados — isso permanece em
  `docs/database/database-model-v1.md`, não alterado por esta etapa.
- Não substitui `docs/roadmap/mvp.md` — a Fase 0 é o currículo/conteúdo que precede a
  implementação técnica; o escopo completo do MVP (autenticação, terminal
  funcional, etc.) continua a ser definido separadamente.
- Não é a fonte de verdade sobre o schema técnico de uma lição — isso está em
  `docs/product/lesson-schema-v1.md`, nem sobre a gramática de validadores — isso
  está em `docs/architecture/validation-grammar-v1.md`.
