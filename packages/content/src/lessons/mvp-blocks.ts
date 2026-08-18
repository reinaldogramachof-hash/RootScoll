import type { RichLessonCatalogEntry } from '../types.js';

export const MVP_LESSONS: readonly RichLessonCatalogEntry[] = [
  // 1. Bem-vindo ao Modo Raiz
  {
    lessonId: '01-bem-vindo',
    moduleId: 'fundamentos-terminal-modulo-1',
    title: 'Bem-vindo ao Modo Raiz',
    learningObjective: 'Compreender o ciclo de aprendizagem Modo Raiz (Teoria, Prática, Erro e Avaliação).',
    order: 1,
    segment: 'linux',
    difficulty: 'beginner',
    sourceLevel: 1,
    runtime: { adapterId: 'virtual-shell', environmentProfileId: 'linux' },
    challengeIds: ['c-01-bem-vindo'],
    briefing: 'O Modo Raiz ensina através da prática real e do entendimento profundo, sem atalhos ou ilusões de conhecimento.',
    theoryMarkdown: `
# O Modo Raiz

Na RootScoll, você não apenas assiste a vídeos — você **constrói**, **erra**, **depura** e **domina**.

### Ciclo de Aprendizagem:
1. **Contexto & Teoria Curta**: Entenda *por que* aquilo importa no trabalho real.
2. **Prática Guiada**: Experimente os comandos no terminal interativo.
3. **Avaliação Objetiva**: O sistema verifica o estado real do seu sistema/arquivos.
4. **Reflexão**: Registre o que aprendeu e como superou os erros.
    `,
    taskText: 'Digite o comando `whoami` no terminal para identificar quem é o usuário atual do sistema.',
    setup: { cwd: '/home/aluno' },
    hints: [
      { afterAttempts: 1, text: 'Digite `whoami` e pressione Enter.' }
    ],
    commonErrors: [
      { trigger: 'command', pattern: 'who am i', message: 'No terminal, os comandos costumam ser uma palavra só sem espaços: use `whoami`.' }
    ],
    successMessage: 'Parabéns! Você deu o seu primeiro passo no Modo Raiz.',
    challenge: {
      challengeId: 'c-01-bem-vindo',
      lessonId: '01-bem-vindo',
      prompt: 'Execute o comando whoami para confirmar sua identidade no terminal.',
      expectedOutcome: 'Retornar o nome do usuário logado.',
      validationRules: [{ kind: 'exit-code', value: 0 }]
    }
  },

  // 2. O que é terminal
  {
    lessonId: '02-o-que-e-terminal',
    moduleId: 'fundamentos-terminal-modulo-1',
    title: 'O que é o Terminal?',
    learningObjective: 'Compreender a interface de linha de comando (CLI) e interpretar a saída do terminal.',
    order: 2,
    segment: 'linux',
    difficulty: 'beginner',
    sourceLevel: 1,
    runtime: { adapterId: 'virtual-shell', environmentProfileId: 'linux' },
    challengeIds: ['c-02-o-que-e-terminal'],
    briefing: 'O terminal é uma conversa direta com o sistema operacional através de texto puro, sem botões gráficos.',
    theoryMarkdown: `
# Interface de Linha de Comando (CLI)

Antes dos mouses e janelas coloridas, os computadores eram operados por texto. Desenvolvedores profissionais usam o terminal porque ele é:
- **Muito mais rápido** para tarefas repetitivas.
- **Rastreável e automatizável**.
- **O único meio de operar servidores remotos** na nuvem.

O **Prompt** (o texto que aparece antes do cursor, ex: \`aluno@rootscoll:~$ \`) indica que o terminal está pronto para ouvir sua instrução.
    `,
    taskText: 'Limpe o terminal usando o comando `clear` para manter seu ambiente organizado.',
    setup: { cwd: '/home/aluno' },
    hints: [
      { afterAttempts: 1, text: 'Digite `clear` e aperte Enter.' }
    ],
    successMessage: 'Excelente! Manter o terminal limpo é um ótimo hábito.',
    challenge: {
      challengeId: 'c-02-o-que-e-terminal',
      lessonId: '02-o-que-e-terminal',
      prompt: 'Limpe a tela do terminal.',
      expectedOutcome: 'Tela do terminal limpa.',
      validationRules: [{ kind: 'command-executed', pattern: '^clear$' }]
    }
  },

  // 3. Onde estou? (pwd)
  {
    lessonId: '03-onde-estou',
    moduleId: 'fundamentos-terminal-modulo-1',
    title: 'Onde estou?',
    learningObjective: 'Identificar o diretório de trabalho atual com o comando pwd.',
    order: 3,
    segment: 'linux',
    difficulty: 'beginner',
    sourceLevel: 1,
    runtime: { adapterId: 'virtual-shell', environmentProfileId: 'linux' },
    challengeIds: ['c-03-onde-estou'],
    briefing: 'No terminal não há pastas visíveis na tela. Você precisa perguntar ao sistema onde está localizado.',
    theoryMarkdown: `
# Print Working Directory (\`pwd\`)

No terminal, você sempre está posicionado dentro de algum diretório (pasta). Esse diretório é chamado de **Current Working Directory (CWD)**.

O comando \`pwd\` significa *Print Working Directory* (Imprimir Diretório de Trabalho). Ele exibe o caminho absoluto desde a raiz do sistema (\`/\`).
    `,
    taskText: 'Descubra seu diretório atual executando o comando `pwd`.',
    setup: { cwd: '/home/aluno' },
    hints: [
      { afterAttempts: 1, text: 'Digite `pwd` no terminal e aperte Enter.' }
    ],
    commonErrors: [
      { trigger: 'command', pattern: 'pwd .*', message: 'O comando `pwd` normalmente é usado sem argumentos.' }
    ],
    successMessage: 'Muito bem! Você descobriu que está em /home/aluno.',
    challenge: {
      challengeId: 'c-03-onde-estou',
      lessonId: '03-onde-estou',
      prompt: 'Imprima o caminho completo do seu diretório atual.',
      expectedOutcome: 'Caminho absoluto impresso na saída.',
      validationRules: [
        { kind: 'exit-code', value: 0 },
        { kind: 'output-contains', text: '/home/aluno' }
      ]
    }
  },

  // 4. O que existe aqui? (ls)
  {
    lessonId: '04-o-que-existe-aqui',
    moduleId: 'fundamentos-terminal-modulo-1',
    title: 'O que existe aqui?',
    learningObjective: 'Listar arquivos e diretórios usando o comando ls com flags básicas.',
    order: 4,
    segment: 'linux',
    difficulty: 'beginner',
    sourceLevel: 1,
    runtime: { adapterId: 'virtual-shell', environmentProfileId: 'linux' },
    challengeIds: ['c-04-o-que-existe-aqui'],
    briefing: 'Listar o conteúdo de uma pasta é o equivalente a abri-la no File Explorer.',
    theoryMarkdown: `
# List Directory Contents (\`ls\`)

O comando \`ls\` lista todos os arquivos e pastas visíveis no seu diretório atual.

### Flags úteis:
- \`ls -a\`: Mostra **todos** os arquivos, incluindo arquivos ocultos (que começam com um ponto, ex: \`.gitignore\`).
- \`ls -l\`: Exibe no formato detalhado (permissões, tamanho, data de modificação).
    `,
    taskText: 'Execute o comando `ls` para listar os arquivos presentes no seu diretório atual.',
    setup: {
      cwd: '/home/aluno',
      files: [
        { path: '/home/aluno/README.md', content: '# Meu Projeto' },
        { path: '/home/aluno/projetos', content: '' }
      ]
    },
    hints: [
      { afterAttempts: 1, text: 'Digite `ls` e pressione Enter.' }
    ],
    successMessage: 'Ótimo! Você visualizou os arquivos do seu diretório.',
    challenge: {
      challengeId: 'c-04-o-que-existe-aqui',
      lessonId: '04-o-que-existe-aqui',
      prompt: 'Liste o conteúdo do diretório atual com ls.',
      expectedOutcome: 'Lista de arquivos e pastas impressa na saída.',
      validationRules: [{ kind: 'exit-code', value: 0 }]
    }
  },

  // 5. Caminhando por pastas (cd)
  {
    lessonId: '05-caminhando-por-pastas',
    moduleId: 'fundamentos-terminal-modulo-1',
    title: 'Caminhando por Pastas',
    learningObjective: 'Navegar entre diretórios usando caminhos relativos e absolutos com cd.',
    order: 5,
    segment: 'linux',
    difficulty: 'beginner',
    sourceLevel: 1,
    runtime: { adapterId: 'virtual-shell', environmentProfileId: 'linux' },
    challengeIds: ['c-05-caminhando-por-pastas'],
    briefing: 'Para trabalhar em um projeto, você precisa navegar até a pasta dele.',
    theoryMarkdown: `
# Change Directory (\`cd\`)

O comando \`cd\` permite mudar de diretório.

- \`cd projetos\`: Entra na pasta "projetos" (caminho relativo).
- \`cd ..\`: Sobe um nível (volta para a pasta pai).
- \`cd ~\`: Vai direto para o seu diretório pessoal (Home).
- \`cd /\`: Vai para a raiz absoluta do sistema operacional.
    `,
    taskText: 'Navegue para dentro do diretório `projetos` usando o comando `cd projetos`.',
    setup: {
      cwd: '/home/aluno',
      files: [{ path: '/home/aluno/projetos/notas.txt', content: 'Minhas anotações' }]
    },
    hints: [
      { afterAttempts: 1, text: 'Digite `cd projetos` e aperte Enter.' }
    ],
    commonErrors: [
      { trigger: 'command', pattern: 'cdprojetos', message: 'É preciso colocar um espaço entre o comando `cd` e o nome da pasta.' }
    ],
    successMessage: 'Excelente! Seu CWD agora é /home/aluno/projetos.',
    challenge: {
      challengeId: 'c-05-caminhando-por-pastas',
      lessonId: '05-caminhando-por-pastas',
      prompt: 'Navegue até a pasta projetos.',
      expectedOutcome: 'O diretório atual (cwd) deve ser /home/aluno/projetos.',
      validationRules: [{ kind: 'cwd', path: '/home/aluno/projetos' }]
    }
  },

  // 6. Criando diretórios (mkdir)
  {
    lessonId: '06-criando-diretorios',
    moduleId: 'fundamentos-terminal-modulo-2',
    title: 'Criando Diretórios',
    learningObjective: 'Criar novas pastas simples e aninhadas usando mkdir.',
    order: 6,
    segment: 'linux',
    difficulty: 'beginner',
    sourceLevel: 2,
    runtime: { adapterId: 'virtual-shell', environmentProfileId: 'linux' },
    challengeIds: ['c-06-criando-diretorios'],
    briefing: 'Organizar projetos exige a criação de pastas para código, imagens e documentação.',
    theoryMarkdown: `
# Make Directory (\`mkdir\`)

O comando \`mkdir\` cria novas pastas.

- \`mkdir src\`: Cria a pasta \`src\` no diretório atual.
- \`mkdir -p src/components\`: A flag \`-p\` (parents) cria toda a árvore de diretórios pai caso ela não exista.
    `,
    taskText: 'Crie uma nova pasta chamada `codigo` no seu diretório atual.',
    setup: { cwd: '/home/aluno' },
    hints: [
      { afterAttempts: 1, text: 'Digite `mkdir codigo`.' }
    ],
    successMessage: 'Pasta `codigo` criada com sucesso!',
    challenge: {
      challengeId: 'c-06-criando-diretorios',
      lessonId: '06-criando-diretorios',
      prompt: 'Crie o diretório chamado codigo.',
      expectedOutcome: 'Diretório /home/aluno/codigo deve existir.',
      validationRules: [{ kind: 'file-exists', path: '/home/aluno/codigo', as: 'dir' }]
    }
  },

  // 7. Criando arquivos (touch)
  {
    lessonId: '07-criando-arquivos',
    moduleId: 'fundamentos-terminal-modulo-2',
    title: 'Criando Arquivos',
    learningObjective: 'Criar arquivos vazios rapidamente com o comando touch.',
    order: 7,
    segment: 'linux',
    difficulty: 'beginner',
    sourceLevel: 2,
    runtime: { adapterId: 'virtual-shell', environmentProfileId: 'linux' },
    challengeIds: ['c-07-criando-arquivos'],
    briefing: 'Criar arquivos vazios é útil para estruturar código antes de editá-lo.',
    theoryMarkdown: `
# O comando \`touch\`

O comando \`touch\` é usado para criar arquivos vazios instantaneamente ou atualizar a data de modificação de um arquivo existente.

Exemplo: \`touch index.html\`
    `,
    taskText: 'Crie um arquivo vazio chamado `app.js` no seu diretório atual.',
    setup: { cwd: '/home/aluno' },
    hints: [
      { afterAttempts: 1, text: 'Digite `touch app.js` e pressione Enter.' }
    ],
    successMessage: 'Arquivo `app.js` criado com sucesso!',
    challenge: {
      challengeId: 'c-07-criando-arquivos',
      lessonId: '07-criando-arquivos',
      prompt: 'Crie o arquivo app.js.',
      expectedOutcome: 'O arquivo /home/aluno/app.js deve existir.',
      validationRules: [{ kind: 'file-exists', path: '/home/aluno/app.js', as: 'file' }]
    }
  },

  // 8. Lendo arquivos (cat)
  {
    lessonId: '08-lendo-arquivos',
    moduleId: 'fundamentos-terminal-modulo-2',
    title: 'Lendo Arquivos',
    learningObjective: 'Exibir o conteúdo de arquivos de texto no terminal com cat.',
    order: 8,
    segment: 'linux',
    difficulty: 'beginner',
    sourceLevel: 2,
    runtime: { adapterId: 'virtual-shell', environmentProfileId: 'linux' },
    challengeIds: ['c-08-lendo-arquivos'],
    briefing: 'Inspecionar scripts, logs e documentações rapidamente sem abrir um editor pesado.',
    theoryMarkdown: `
# Concatenate & Print (\`cat\`)

O comando \`cat\` imprime o conteúdo inteiro de um arquivo texto diretamente na tela do terminal.

Exemplo: \`cat README.md\`
    `,
    taskText: 'Leia o conteúdo do arquivo `mensagem.txt` usando o comando `cat`.',
    setup: {
      cwd: '/home/aluno',
      files: [{ path: '/home/aluno/mensagem.txt', content: 'Bem-vindo ao CodeChat!' }]
    },
    hints: [
      { afterAttempts: 1, text: 'Digite `cat mensagem.txt` e pressione Enter.' }
    ],
    successMessage: 'Leitura concluída com sucesso!',
    challenge: {
      challengeId: 'c-08-lendo-arquivos',
      lessonId: '08-lendo-arquivos',
      prompt: 'Exiba a mensagem contida no arquivo mensagem.txt.',
      expectedOutcome: 'Saída contendo o texto do arquivo.',
      validationRules: [
        { kind: 'exit-code', value: 0 },
        { kind: 'output-contains', text: 'Bem-vindo ao CodeChat!' }
      ]
    }
  },

  // 9. Escrevendo conteúdo (echo + redirecionamento)
  {
    lessonId: '09-escrevendo-conteudo',
    moduleId: 'fundamentos-terminal-modulo-2',
    title: 'Escrevendo Conteúdo',
    learningObjective: 'Escrever texto em arquivos usando echo e operadores de redirecionamento (> e >>).',
    order: 9,
    segment: 'linux',
    difficulty: 'beginner',
    sourceLevel: 2,
    runtime: { adapterId: 'virtual-shell', environmentProfileId: 'linux' },
    challengeIds: ['c-09-escrevendo-conteudo'],
    briefing: 'Você pode criar e editar pequenos arquivos de configuração usando apenas o terminal.',
    theoryMarkdown: `
# \`echo\` e Redirecionamento

O comando \`echo\` imprime um texto na saída padrão. Quando combinado com o operador \`>\`, o texto é gravado dentro de um arquivo (sobrescrevendo seu conteúdo).

- \`echo "Olá" > notas.txt\` (Cria ou sobrescreve notas.txt com "Olá")
- \`echo "Mundo" >> notas.txt\` (Adiciona "Mundo" ao final do arquivo)
    `,
    taskText: 'Crie o arquivo `versao.txt` contendo o texto `1.0.0` usando `echo "1.0.0" > versao.txt`.',
    setup: { cwd: '/home/aluno' },
    hints: [
      { afterAttempts: 1, text: 'Digite `echo "1.0.0" > versao.txt` e aperte Enter.' }
    ],
    successMessage: 'Arquivo de versão gravado com sucesso!',
    challenge: {
      challengeId: 'c-09-escrevendo-conteudo',
      lessonId: '09-escrevendo-conteudo',
      prompt: 'Grave o texto 1.0.0 no arquivo versao.txt.',
      expectedOutcome: 'Arquivo versao.txt contendo 1.0.0.',
      validationRules: [
        { kind: 'file-exists', path: '/home/aluno/versao.txt', as: 'file' },
        { kind: 'file-content', path: '/home/aluno/versao.txt', match: 'contains', value: '1.0.0' }
      ]
    }
  },

  // 10. Movendo e Copiando (cp / mv)
  {
    lessonId: '10-movendo-e-copiando',
    moduleId: 'fundamentos-terminal-modulo-2',
    title: 'Movendo e Copiando Arquivos',
    learningObjective: 'Copiar (cp) e mover/renomear (mv) arquivos e diretórios.',
    order: 10,
    segment: 'linux',
    difficulty: 'beginner',
    sourceLevel: 2,
    runtime: { adapterId: 'virtual-shell', environmentProfileId: 'linux' },
    challengeIds: ['c-10-movendo-e-copiando'],
    briefing: 'Aprenda a fazer backups de segurança com cp e reorganizar arquivos com mv.',
    theoryMarkdown: `
# Copy (\`cp\`) e Move (\`mv\`)

- \`cp origem.txt destino.txt\`: Cria uma cópia duplicada do arquivo.
- \`mv antigo.txt novo.txt\`: Renomeia o arquivo.
- \`mv arquivo.txt pasta/\`: Move o arquivo para dentro da pasta especificada.
    `,
    taskText: 'Renomeie o arquivo `rascunho.txt` para `final.txt` usando o comando `mv rascunho.txt final.txt`.',
    setup: {
      cwd: '/home/aluno',
      files: [{ path: '/home/aluno/rascunho.txt', content: 'Texto do rascunho' }]
    },
    hints: [
      { afterAttempts: 1, text: 'Use `mv rascunho.txt final.txt`.' }
    ],
    successMessage: 'Arquivo renomeado com sucesso!',
    challenge: {
      challengeId: 'c-10-movendo-e-copiando',
      lessonId: '10-movendo-e-copiando',
      prompt: 'Renomeie rascunho.txt para final.txt.',
      expectedOutcome: 'rascunho.txt não existe mais e final.txt está presente.',
      validationRules: [
        { kind: 'file-not-exists', path: '/home/aluno/rascunho.txt' },
        { kind: 'file-exists', path: '/home/aluno/final.txt', as: 'file' }
      ]
    }
  },

  // 11. Removendo com cuidado (rm)
  {
    lessonId: '11-removendo-com-cuidado',
    moduleId: 'fundamentos-terminal-modulo-2',
    title: 'Removendo com Cuidado',
    learningObjective: 'Excluir arquivos e diretórios de forma segura com o comando rm.',
    order: 11,
    segment: 'linux',
    difficulty: 'beginner',
    sourceLevel: 2,
    runtime: { adapterId: 'virtual-shell', environmentProfileId: 'linux' },
    challengeIds: ['c-11-removendo-com-cuidado'],
    briefing: 'Atenção: No terminal não existe "Lixeira"! O comando rm exclui os dados permanentemente.',
    theoryMarkdown: `
# Remove (\`rm\`)

- \`rm arquivo.txt\`: Deleta um arquivo individual.
- \`rm -r pasta/\`: Deleta recursivamente uma pasta e todo o seu conteúdo interno.
    `,
    taskText: 'Remova o arquivo temporário `temp.log` com o comando `rm temp.log`.',
    setup: {
      cwd: '/home/aluno',
      files: [{ path: '/home/aluno/temp.log', content: 'log temporario' }]
    },
    hints: [
      { afterAttempts: 1, text: 'Digite `rm temp.log` e confirme com Enter.' }
    ],
    successMessage: 'Arquivo temporário removido!',
    challenge: {
      challengeId: 'c-11-removendo-com-cuidado',
      lessonId: '11-removendo-com-cuidado',
      prompt: 'Remova o arquivo temp.log.',
      expectedOutcome: 'temp.log deletado.',
      validationRules: [{ kind: 'file-not-exists', path: '/home/aluno/temp.log' }]
    }
  },

  // 12. Vendo a árvore (tree)
  {
    lessonId: '12-vendo-a-arvore',
    moduleId: 'fundamentos-terminal-modulo-2',
    title: 'Vendo a Árvore de Diretórios',
    learningObjective: 'Visualizar a estrutura hierárquica do projeto com o comando tree.',
    order: 12,
    segment: 'linux',
    difficulty: 'beginner',
    sourceLevel: 2,
    runtime: { adapterId: 'virtual-shell', environmentProfileId: 'linux' },
    challengeIds: ['c-12-vendo-a-arvore'],
    briefing: 'Ter uma visão panorâmica da organização das pastas melhora o entendimento do projeto.',
    theoryMarkdown: `
# O comando \`tree\`

O comando \`tree\` desenha um diagrama visual em formato de árvore de todos os diretórios e subdiretórios a partir da pasta atual.
    `,
    taskText: 'Execute o comando `tree` para inspecionar a árvore de diretórios do ambiente.',
    setup: {
      cwd: '/home/aluno',
      files: [
        { path: '/home/aluno/src/index.js', content: '' },
        { path: '/home/aluno/src/styles.css', content: '' }
      ]
    },
    hints: [
      { afterAttempts: 1, text: 'Digite `tree` e aperte Enter.' }
    ],
    successMessage: 'Visualização da árvore gerada!',
    challenge: {
      challengeId: 'c-12-vendo-a-arvore',
      lessonId: '12-vendo-a-arvore',
      prompt: 'Exiba a estrutura do projeto com tree.',
      expectedOutcome: 'Estrutura desenhada na tela.',
      validationRules: [{ kind: 'exit-code', value: 0 }]
    }
  },

  // 13. Diário de bordo técnico
  {
    lessonId: '13-diario-de-bordo',
    moduleId: 'fundamentos-terminal-modulo-2',
    title: 'Diário de Bordo Técnico',
    learningObjective: 'Documentar aprendizados e reflexões em Markdown.',
    order: 13,
    segment: 'git',
    difficulty: 'beginner',
    sourceLevel: 2,
    runtime: { adapterId: 'virtual-shell', environmentProfileId: 'linux' },
    challengeIds: ['c-13-diario-de-bordo'],
    briefing: 'Desenvolvedores sêniores mantêm anotações claras sobre o que aprenderam e como corrigiram bugs.',
    theoryMarkdown: `
# Comunicação Técnica e Documentação

Documentar o aprendizado fixa o conhecimento e cria evidências reais para o seu portfólio.
    `,
    taskText: 'Crie o arquivo `DIARIO.md` com o título `# Diário de Bordo` usando `echo "# Diário de Bordo" > DIARIO.md`.',
    setup: { cwd: '/home/aluno' },
    hints: [
      { afterAttempts: 1, text: 'Execute `echo "# Diário de Bordo" > DIARIO.md`.' }
    ],
    successMessage: 'Seu primeiro diário de bordo técnico foi iniciado!',
    challenge: {
      challengeId: 'c-13-diario-de-bordo',
      lessonId: '13-diario-de-bordo',
      prompt: 'Crie DIARIO.md com um título em Markdown.',
      expectedOutcome: 'DIARIO.md contendo # Diário de Bordo.',
      validationRules: [
        { kind: 'file-exists', path: '/home/aluno/DIARIO.md', as: 'file' },
        { kind: 'file-content', path: '/home/aluno/DIARIO.md', match: 'contains', value: '# Diário de Bordo' }
      ]
    }
  },

  // 14. O que é Git
  {
    lessonId: '14-o-que-e-git',
    moduleId: 'fundamentos-terminal-modulo-2',
    title: 'O que é Git?',
    learningObjective: 'Compreender o papel do controle de versão e os estados do Git (Working Directory, Staging, Commit).',
    order: 14,
    segment: 'git',
    difficulty: 'beginner',
    sourceLevel: 2,
    runtime: { adapterId: 'virtual-shell', environmentProfileId: 'linux' },
    challengeIds: ['c-14-o-que-e-git'],
    briefing: 'O Git é uma máquina do tempo para o seu código. Ele registra cada alteração com autoria e explicação.',
    theoryMarkdown: `
# Controle de Versão

Sem o Git, desenvolvedores fariam pastas como \`projeto_final_v2_finalissimo.zip\`. Com Git, você tem um histórico limpo e rastreável.

### Os 3 Estados do Git:
1. **Working Directory**: Onde você edita seus arquivos.
2. **Staging Area (Index)**: A "lista de espera" onde você prepara as fotos do seu código (\`git add\`).
3. **Repository (Commit)**: O histórico oficial permanente gravado (\`git commit\`).
    `,
    taskText: 'Verifique se o Git está instalado no sistema executando `git --version`.',
    setup: { cwd: '/home/aluno' },
    hints: [
      { afterAttempts: 1, text: 'Digite `git --version`.' }
    ],
    successMessage: 'Git verificado e pronto para uso!',
    challenge: {
      challengeId: 'c-14-o-que-e-git',
      lessonId: '14-o-que-e-git',
      prompt: 'Verifique a versão do Git instalado.',
      expectedOutcome: 'Versão do Git exibida.',
      validationRules: [{ kind: 'exit-code', value: 0 }]
    }
  },

  // 15. Primeiro repositório (git init / status)
  {
    lessonId: '15-primeiro-repositorio',
    moduleId: 'fundamentos-terminal-modulo-2',
    title: 'Primeiro Repositório Git',
    learningObjective: 'Inicializar um repositório Git local e verificar seu status.',
    order: 15,
    segment: 'git',
    difficulty: 'beginner',
    sourceLevel: 2,
    runtime: { adapterId: 'virtual-shell', environmentProfileId: 'linux' },
    challengeIds: ['c-15-primeiro-repositorio'],
    briefing: 'Transforme uma pasta comum em um repositório rastreado pelo Git.',
    theoryMarkdown: `
# Initializing Git (\`git init\`)

O comando \`git init\` cria uma pasta oculta chamada \`.git\` dentro do diretório atual. A partir desse momento, o Git começa a monitorar as alterações da pasta.

O comando \`git status\` mostra em qual estado cada arquivo se encontra.
    `,
    taskText: 'Inicialize um repositório Git executando o comando `git init`.',
    setup: { cwd: '/home/aluno/meu-projeto' },
    hints: [
      { afterAttempts: 1, text: 'Digite `git init` no terminal.' }
    ],
    successMessage: 'Repositório Git inicializado!',
    challenge: {
      challengeId: 'c-15-primeiro-repositorio',
      lessonId: '15-primeiro-repositorio',
      prompt: 'Inicialize o repositório git.',
      expectedOutcome: 'Diretório .git criado.',
      validationRules: [{ kind: 'file-exists', path: '/home/aluno/meu-projeto/.git', as: 'dir' }]
    }
  },

  // 16. Primeiro commit
  {
    lessonId: '16-primeiro-commit',
    moduleId: 'fundamentos-terminal-modulo-2',
    title: 'Primeiro Commit',
    learningObjective: 'Adicionar arquivos ao Staging e gravar o primeiro commit semântico.',
    order: 16,
    segment: 'git',
    difficulty: 'beginner',
    sourceLevel: 2,
    runtime: { adapterId: 'virtual-shell', environmentProfileId: 'linux' },
    challengeIds: ['c-16-primeiro-commit'],
    briefing: 'Criar um ponto de restauração oficial com uma mensagem clara sobre o que mudou.',
    theoryMarkdown: `
# \`git add\` e \`git commit\`

- \`git add README.md\`: Prepara o arquivo na Staging Area.
- \`git commit -m "docs: adiciona readme inicial"\`: Grava o snapshot com a mensagem descritiva.
    `,
    taskText: 'Adicione o `README.md` ao staging com `git add README.md` e faça o commit com `git commit -m "feat: commit inicial"`.',
    setup: {
      cwd: '/home/aluno/meu-projeto',
      files: [
        { path: '/home/aluno/meu-projeto/.git/HEAD', content: 'ref: refs/heads/main' },
        { path: '/home/aluno/meu-projeto/README.md', content: '# Meu Projeto' }
      ]
    },
    hints: [
      { afterAttempts: 1, text: 'Rode `git add README.md` e depois `git commit -m "feat: commit inicial"`.' }
    ],
    successMessage: 'Seu primeiro commit foi gravado na história!',
    challenge: {
      challengeId: 'c-16-primeiro-commit',
      lessonId: '16-primeiro-commit',
      prompt: 'Realize o commit do arquivo README.md.',
      expectedOutcome: 'Commit realizado com sucesso.',
      validationRules: [{ kind: 'command-executed', pattern: 'git commit' }]
    }
  },

  // 17. Lendo diferenças (git diff)
  {
    lessonId: '17-lendo-diferencas',
    moduleId: 'fundamentos-terminal-modulo-2',
    title: 'Lendo Diferenças',
    learningObjective: 'Inspecionar alterações não salvas com o comando git diff.',
    order: 17,
    segment: 'git',
    difficulty: 'beginner',
    sourceLevel: 2,
    runtime: { adapterId: 'virtual-shell', environmentProfileId: 'linux' },
    challengeIds: ['c-17-lendo-diferencas'],
    briefing: 'Revise exatamente o que você adicionou ou removeu antes de fazer um commit.',
    theoryMarkdown: `
# \`git diff\`

O comando \`git diff\` compara o seu **Working Directory** atual com a última versão gravada no **Staging** ou no último **Commit**.

- Linhas com \`+\` (verde): foram adicionadas.
- Linhas com \`-\` (vermelho): foram removidas.
    `,
    taskText: 'Execute `git diff` para ver quais modificações foram feitas nos arquivos.',
    setup: { cwd: '/home/aluno/meu-projeto' },
    hints: [
      { afterAttempts: 1, text: 'Digite `git diff`.' }
    ],
    successMessage: 'Diferenças inspecionadas com sucesso!',
    challenge: {
      challengeId: 'c-17-lendo-diferencas',
      lessonId: '17-lendo-diferencas',
      prompt: 'Execute git diff no terminal.',
      expectedOutcome: 'Diferenças exibidas.',
      validationRules: [{ kind: 'exit-code', value: 0 }]
    }
  },

  // 18. Branch de experimento
  {
    lessonId: '18-branch-de-experimento',
    moduleId: 'fundamentos-terminal-modulo-2',
    title: 'Branch de Experimento',
    learningObjective: 'Criar e alternar entre branches de desenvolvimento seguro.',
    order: 18,
    segment: 'git',
    difficulty: 'beginner',
    sourceLevel: 2,
    runtime: { adapterId: 'virtual-shell', environmentProfileId: 'linux' },
    challengeIds: ['c-18-branch-de-experimento'],
    briefing: 'Desenvolva novas funcionalidades em isolamento sem quebrar a versão principal (main) em produção.',
    theoryMarkdown: `
# Branches no Git

Uma **Branch** é uma ramificação do seu histórico. 

- \`git checkout -b minha-feature\` (ou \`git switch -c minha-feature\`): Cria e muda para a nova branch.
- \`git checkout main\`: Volta para a linha principal.
    `,
    taskText: 'Crie e mude para a branch `experimento` usando o comando `git checkout -b experimento`.',
    setup: { cwd: '/home/aluno/meu-projeto' },
    hints: [
      { afterAttempts: 1, text: 'Digite `git checkout -b experimento`.' }
    ],
    successMessage: 'Você agora está trabalhando em uma branch isolada!',
    challenge: {
      challengeId: 'c-18-branch-de-experimento',
      lessonId: '18-branch-de-experimento',
      prompt: 'Crie a branch experimento.',
      expectedOutcome: 'Mudança de branch efetuada.',
      validationRules: [{ kind: 'command-executed', pattern: 'git (checkout -b|switch -c) experimento' }]
    }
  },

  // 19. HTML como estrutura
  {
    lessonId: '19-html-como-estrutura',
    moduleId: 'fundamentos-web-modulo-1',
    title: 'HTML como Estrutura Semântica',
    learningObjective: 'Entender a estrutura básica de um documento HTML5 acessível.',
    order: 19,
    segment: 'html',
    difficulty: 'beginner',
    sourceLevel: 2,
    runtime: { adapterId: 'virtual-shell', environmentProfileId: 'linux' },
    challengeIds: ['c-19-html-como-estrutura'],
    briefing: 'O HTML define a hierarquia e o significado do conteúdo da Web.',
    theoryMarkdown: `
# HTML5 Semântico

Páginas Web profissionais usam tags semânticas para permitir acessibilidade e bom ranqueamento em buscadores:
- \`<header>\`: Cabeçalho.
- \`<main>\`: Conteúdo principal.
- \`<footer>\`: Rodapé.
    `,
    taskText: 'Crie o arquivo `index.html` com uma tag `<main>` contendo `<h1>RootScoll</h1>`.',
    setup: { cwd: '/home/aluno/web' },
    hints: [
      { afterAttempts: 1, text: 'Escreva um HTML simples contendo <h1>RootScoll</h1> em index.html.' }
    ],
    successMessage: 'Página HTML5 criada com sucesso!',
    challenge: {
      challengeId: 'c-19-html-como-estrutura',
      lessonId: '19-html-como-estrutura',
      prompt: 'Crie o index.html semântico.',
      expectedOutcome: 'index.html contendo <h1>RootScoll</h1>.',
      validationRules: [
        { kind: 'file-exists', path: '/home/aluno/web/index.html', as: 'file' },
        { kind: 'file-content', path: '/home/aluno/web/index.html', match: 'contains', value: '<h1>RootScoll</h1>' }
      ]
    }
  },

  // 20. CSS Box Model
  {
    lessonId: '20-css-box-model',
    moduleId: 'fundamentos-web-modulo-1',
    title: 'CSS Box Model',
    learningObjective: 'Compreender o Box Model (margin, border, padding, content) para estilização.',
    order: 20,
    segment: 'css',
    difficulty: 'beginner',
    sourceLevel: 2,
    runtime: { adapterId: 'virtual-shell', environmentProfileId: 'linux' },
    challengeIds: ['c-20-css-box-model'],
    briefing: 'Todo elemento na Web é visualizado pelo navegador como uma caixa retangular.',
    theoryMarkdown: `
# O CSS Box Model

Cada caixa possui:
- **Content**: O conteúdo real (texto/imagem).
- **Padding**: O espaçamento interno.
- **Border**: A borda ao redor do padding.
- **Margin**: O espaçamento externo entre caixas.
    `,
    taskText: 'Crie o arquivo `styles.css` adicionando a regra `.card { padding: 16px; }`.',
    setup: { cwd: '/home/aluno/web' },
    hints: [
      { afterAttempts: 1, text: 'Grave `.card { padding: 16px; }` em styles.css.' }
    ],
    successMessage: 'Estilo CSS Box Model gravado com sucesso!',
    challenge: {
      challengeId: 'c-20-css-box-model',
      lessonId: '20-css-box-model',
      prompt: 'Crie o arquivo styles.css.',
      expectedOutcome: 'styles.css com regra de padding.',
      validationRules: [
        { kind: 'file-exists', path: '/home/aluno/web/styles.css', as: 'file' },
        { kind: 'file-content', path: '/home/aluno/web/styles.css', match: 'contains', value: 'padding' }
      ]
    }
  }
];

export function getLessonById(lessonId: string): RichLessonCatalogEntry | undefined {
  return MVP_LESSONS.find((l) => l.lessonId === lessonId);
}
