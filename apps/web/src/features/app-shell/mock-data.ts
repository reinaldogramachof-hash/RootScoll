import type { MockUser, Track } from './types';

/**
 * Dados mock locais do shell — sem backend, sem Supabase, sem persistência
 * (em memória, recriados a cada carregamento da página).
 *
 * **Divergência deliberada da Learning Catalog v1 (`docs/product/learning-catalog-v1.md`),
 * pede revisão do Codex**: a lista de 6 trilhas aqui segue literalmente o
 * texto desta tarefa (Terminal e Sistemas Operacionais, Git/GitHub, Web,
 * Programação, Banco de Dados, Segurança). O catálogo formal já publicado
 * modela 6 trilhas DIFERENTES — a 5ª é `professional-practice` ("Prática
 * profissional": debugging, logs, banco de dados, deploy, testes, Docker),
 * não uma trilha dedicada de "Banco de Dados". Como este módulo é
 * deliberadamente local/mock (não importa `@codechat/types`, não altera o
 * catálogo real), a divergência foi preservada conforme o texto da tarefa em
 * vez de silenciosamente "corrigida" para bater com o catálogo — mas fica
 * registrada aqui e no Cérebro Operacional para o Codex decidir qual lista é
 * a fonte de verdade quando o catálogo mock virar catálogo real.
 */

const TERMINAL_TRACK_ID = 'terminal-os';

export const MOCK_USER: MockUser = {
  name: 'Aluno Piloto',
  email: 'aluno.piloto@codechat.dev',
  role: 'aluno',
  currentTrackId: TERMINAL_TRACK_ID,
  overallProgress: 15,
};

export const TRACKS: readonly Track[] = [
  {
    id: TERMINAL_TRACK_ID,
    title: 'Terminal e Sistemas Operacionais',
    description: 'Fundamentos de linha de comando — navegação, arquivos e diretórios, permissões.',
    status: 'available',
    modules: [
      { id: 'terminal-os-criar-pasta', title: 'Criar uma pasta (mkdir)', status: 'available' },
      { id: 'terminal-os-criar-arquivo', title: 'Criar um arquivo (touch)', status: 'available' },
    ],
  },
  {
    id: 'git-github',
    title: 'Git e GitHub',
    description: 'Versionamento, branching, colaboração e fluxo profissional.',
    status: 'coming-soon',
    modules: [
      { id: 'git-github-em-breve', title: 'Conteúdo em desenvolvimento', status: 'coming-soon' },
    ],
  },
  {
    id: 'web',
    title: 'Desenvolvimento Web',
    description: 'HTML, CSS, JavaScript e publicação de páginas.',
    status: 'coming-soon',
    modules: [{ id: 'web-em-breve', title: 'Conteúdo em desenvolvimento', status: 'coming-soon' }],
  },
  {
    id: 'programming',
    title: 'Programação',
    description: 'Lógica de programação e linguagens de propósito geral.',
    status: 'coming-soon',
    modules: [
      { id: 'programming-em-breve', title: 'Conteúdo em desenvolvimento', status: 'coming-soon' },
    ],
  },
  {
    id: 'database',
    title: 'Banco de Dados',
    description: 'Modelagem, consultas e operação de bancos de dados.',
    status: 'coming-soon',
    modules: [
      { id: 'database-em-breve', title: 'Conteúdo em desenvolvimento', status: 'coming-soon' },
    ],
  },
  {
    id: 'security',
    title: 'Segurança Cibernética e da Informação',
    description:
      'Radar estratégico aprovado (Trilha 06) — trilha futura e isolada, sem currículo executável, laboratórios ou validadores ainda formalizados.',
    status: 'coming-soon',
    modules: [
      { id: 'security-em-breve', title: 'Currículo ainda não formalizado', status: 'coming-soon' },
    ],
  },
];
