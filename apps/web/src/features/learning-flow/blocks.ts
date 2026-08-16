import { getNode } from '@codechat/terminal-engine';
import type { LearningBlock } from './types';

/**
 * Blocos pedagógicos-piloto da Fase 0, Nível 2 (Arquivos e diretórios) — ver
 * `docs/product/curriculum-phase-0.md`. Reorganiza as 2 lições da fatia
 * anterior (`../lessons/lessons.ts`) no novo fluxo de 4 etapas (teoria ->
 * prática -> avaliação -> conclusão), acrescentando `theory` e `mentorHints`
 * novos — o `practice.objective`/`suggestedCommands` e o
 * `assessment.successMessage`/`isComplete` são os mesmos das lições
 * originais, só renomeados/reagrupados. Continua provando o fluxo fim-a-fim
 * local, não o schema completo de lição nem o Learning Catalog v1.
 *
 * Caminhos usam `/home/aluno` porque `createInitialFilesystemState` de
 * `@codechat/terminal-engine` já fixa esse `cwd` inicial — mesma decisão
 * documentada em `../lessons/lessons.ts` e no Implementation Report da Fase
 * 1.
 */
export const LEARNING_BLOCKS: readonly LearningBlock[] = [
  {
    id: 'piloto-01-criar-pasta',
    title: 'Bloco 1 — Criar uma pasta',
    theory: {
      title: 'Organizando arquivos com pastas',
      paragraphs: [
        'No terminal, uma pasta (diretório) agrupa arquivos e outras pastas, como uma gaveta dentro do seu espaço de trabalho.',
        "O comando 'mkdir' (make directory) cria uma pasta nova no lugar onde você está.",
        "Use 'ls' para listar o que existe no diretório atual e 'pwd' para confirmar em qual pasta você está.",
      ],
    },
    practice: {
      objective: "Crie uma pasta chamada 'projetos' no seu diretório pessoal.",
      suggestedCommands: ['mkdir projetos', 'ls', 'pwd'],
    },
    assessment: {
      successMessage: "[ok] pasta 'projetos' criada em /home/aluno.",
      isComplete: (filesystem) => getNode(filesystem.root, '/home/aluno/projetos')?.kind === 'dir',
    },
    mentorHints: [
      { afterAttempts: 1, text: "Dica: o comando para criar uma pasta é 'mkdir <nome>'." },
      { afterAttempts: 2, text: 'Tente exatamente: mkdir projetos' },
      {
        afterAttempts: 3,
        text: "Depois de criar, confira com 'ls' — a pasta 'projetos' deve aparecer na lista.",
      },
    ],
  },
  {
    id: 'piloto-02-criar-readme',
    title: 'Bloco 2 — Criar um arquivo',
    theory: {
      title: 'Criando arquivos vazios',
      paragraphs: [
        "O comando 'touch' cria um arquivo novo, vazio, se ele ainda não existir.",
        "Arquivos '.md' (Markdown) são comuns para documentação — 'README.md' costuma descrever um projeto.",
        "Depois de criar o arquivo, 'cat' mostra o conteúdo dele no terminal (mesmo que esteja vazio).",
      ],
    },
    practice: {
      objective: "Crie um arquivo chamado 'README.md' no seu diretório pessoal.",
      suggestedCommands: ['touch README.md', 'ls', 'cat README.md'],
    },
    assessment: {
      successMessage: "[ok] arquivo 'README.md' criado em /home/aluno.",
      isComplete: (filesystem) =>
        getNode(filesystem.root, '/home/aluno/README.md')?.kind === 'file',
    },
    mentorHints: [
      { afterAttempts: 1, text: "Dica: o comando para criar um arquivo vazio é 'touch <nome>'." },
      { afterAttempts: 2, text: 'Tente exatamente: touch README.md' },
      {
        afterAttempts: 3,
        text: "Depois de criar, confira com 'ls' — o arquivo 'README.md' deve aparecer na lista.",
      },
    ],
  },
];
