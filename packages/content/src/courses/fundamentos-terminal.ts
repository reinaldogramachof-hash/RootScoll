import type { CourseCatalogEntry, ModuleCatalogEntry } from '@codechat/types';

export const COURSE_FUNDAMENTOS_TERMINAL: CourseCatalogEntry = {
  courseId: 'fundamentos-terminal',
  trackId: 'terminal-os',
  title: 'Fundamentos de Terminal e Sistemas Operacionais',
  description: 'Aprenda a operar a linha de comando do zero absoluto, sem medo de errar, manipulando arquivos e repositórios.',
  difficulty: 'beginner',
  technologies: [
    { id: 'bash', label: 'Bash' },
    { id: 'linux', label: 'Linux CLI' },
    { id: 'git', label: 'Git' },
    { id: 'html', label: 'HTML5' },
    { id: 'css', label: 'CSS3' },
  ],
  moduleIds: [
    'fundamentos-terminal-modulo-1',
    'fundamentos-terminal-modulo-2',
    'fundamentos-web-modulo-1',
  ],
  publicationStatus: 'published',
};

export const MODULES_FUNDAMENTOS_TERMINAL: readonly ModuleCatalogEntry[] = [
  {
    moduleId: 'fundamentos-terminal-modulo-1',
    courseId: 'fundamentos-terminal',
    title: 'Módulo 1: Orientação e Navegação',
    description: 'Aprenda o que é o terminal, como descobrir sua localização e como navegar entre diretórios com segurança.',
    order: 1,
    lessonIds: [
      '01-bem-vindo',
      '02-o-que-e-terminal',
      '03-onde-estou',
      '04-o-que-existe-aqui',
      '05-caminhando-por-pastas',
    ],
  },
  {
    moduleId: 'fundamentos-terminal-modulo-2',
    courseId: 'fundamentos-terminal',
    title: 'Módulo 2: Arquivos, Git e Comunicação',
    description: 'Crie, edite e remova arquivos, mantenha diários de bordo e controle versões de código com Git.',
    order: 2,
    lessonIds: [
      '06-criando-diretorios',
      '07-criando-arquivos',
      '08-lendo-arquivos',
      '09-escrevendo-conteudo',
      '10-movendo-e-copiando',
      '11-removendo-com-cuidado',
      '12-vendo-a-arvore',
      '13-diario-de-bordo',
      '14-o-que-e-git',
      '15-primeiro-repositorio',
      '16-primeiro-commit',
      '17-lendo-diferencas',
      '18-branch-de-experimento',
    ],
  },
  {
    moduleId: 'fundamentos-web-modulo-1',
    courseId: 'fundamentos-terminal',
    title: 'Módulo 3: Introdução à Web Base',
    description: 'Crie suas primeiras páginas HTML5 semânticas e folhas de estilo CSS3.',
    order: 3,
    lessonIds: [
      '19-html-como-estrutura',
      '20-css-box-model',
    ],
  },
];
