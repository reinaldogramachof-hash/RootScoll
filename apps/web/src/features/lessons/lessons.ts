import { getNode } from '@codechat/terminal-engine';
import type { Lesson } from './types';

/**
 * Lições-piloto da Fase 0, Nível 2 (Arquivos e diretórios) — ver
 * `docs/product/curriculum-phase-0.md`. Objetivo desta fatia: provar o fluxo
 * fim-a-fim (lição -> comando -> filesystem virtual -> validação local ->
 * painel), não reproduzir o schema completo de lição
 * (`docs/product/lesson-schema-v1.md`) nem o catálogo formal
 * (Learning Catalog v1, `@codechat/types`).
 *
 * Caminhos usam `/home/aluno` (não `/home/student`) porque
 * `createInitialFilesystemState` de `@codechat/terminal-engine` já fixa esse
 * `cwd` inicial, alinhado à convenção real do currículo
 * (`docs/product/curriculum-phase-0.md`, seção 3: `usuario: aluno`). Ver
 * Implementation Report, seção "Decisões técnicas", para essa divergência
 * deliberada do texto literal da tarefa (que mencionava `/home/student`).
 */
export const LESSONS: readonly Lesson[] = [
  {
    id: 'piloto-01-criar-pasta',
    title: 'Lição 1 — Criar uma pasta',
    objective: "Crie uma pasta chamada 'projetos' no seu diretório pessoal.",
    suggestedCommands: ['mkdir projetos', 'ls', 'pwd'],
    successMessage: "[ok] pasta 'projetos' criada em /home/aluno.",
    isComplete: (filesystem) => getNode(filesystem.root, '/home/aluno/projetos')?.kind === 'dir',
  },
  {
    id: 'piloto-02-criar-readme',
    title: 'Lição 2 — Criar um arquivo',
    objective: "Crie um arquivo chamado 'README.md' no seu diretório pessoal.",
    suggestedCommands: ['touch README.md', 'ls', 'cat README.md'],
    successMessage: "[ok] arquivo 'README.md' criado em /home/aluno.",
    isComplete: (filesystem) => getNode(filesystem.root, '/home/aluno/README.md')?.kind === 'file',
  },
];
