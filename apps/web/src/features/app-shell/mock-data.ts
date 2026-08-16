import type { MockUser, Track } from './types';

/**
 * Dados mock locais do shell: sem backend, sem Supabase, sem persistencia.
 * A UI usa 6 macrotrilhas como navegacao executiva e preserva as 14 trilhas
 * granulares do curriculo v2 como direcao pedagogica interna.
 */

const TERMINAL_TRACK_ID = 'terminal-os';

export const MOCK_USER: MockUser = {
  name: 'Aluno Piloto',
  email: 'aluno.piloto@codechat.dev',
  role: 'aluno',
  currentPhase: 'Fase 0 - Fundamentos operacionais',
  currentCompetency: 'Ler, navegar e explicar o sistema de arquivos pelo terminal.',
  evidenceCount: 2,
  currentTrackId: TERMINAL_TRACK_ID,
  overallProgress: 15,
};

export const TRACKS: readonly Track[] = [
  {
    id: TERMINAL_TRACK_ID,
    title: 'Terminal e Sistemas Operacionais',
    description: 'Base de linha de comando: navegacao, arquivos, diretorios, stdout e stderr.',
    phase: 'Fase 0',
    progress: 34,
    competencies: ['Navegar entre pastas', 'Criar arquivos', 'Explicar stdout/stderr'],
    evidence: 'Registro de comandos executados e explicados em linguagem natural.',
    status: 'available',
    modules: [
      {
        id: 'terminal-os-orientacao',
        title: 'Orientacao teorica: shell, caminho e diretorio atual',
        status: 'available',
        mode: 'teoria',
      },
      {
        id: 'terminal-os-navegacao',
        title: 'Pratica guiada: pwd, ls e cd',
        status: 'available',
        mode: 'pratica',
      },
      {
        id: 'terminal-os-criar-pasta',
        title: 'Criar uma pasta com mkdir',
        status: 'available',
        mode: 'pratica',
      },
      {
        id: 'terminal-os-criar-arquivo',
        title: 'Criar um arquivo com touch',
        status: 'available',
        mode: 'pratica',
      },
      {
        id: 'terminal-os-avaliacao',
        title: 'Avaliacao curta: explicar e repetir o fluxo',
        status: 'available',
        mode: 'avaliacao',
      },
    ],
  },
  {
    id: 'git-github',
    title: 'Git e GitHub',
    description: 'Versionamento, leitura de diff, commits pequenos e fluxo profissional.',
    phase: 'Fase 1',
    progress: 0,
    competencies: ['Registrar historico', 'Criar commits pequenos', 'Ler diffs'],
    evidence: 'Repositorio local com commits explicados.',
    status: 'coming-soon',
    modules: [
      {
        id: 'git-github-em-breve',
        title: 'Conteudo em desenvolvimento',
        status: 'coming-soon',
        mode: 'planejado',
      },
    ],
  },
  {
    id: 'web',
    title: 'Desenvolvimento Web',
    description: 'HTML, CSS, JavaScript, componentes simples e publicacao de paginas.',
    phase: 'Fase 2',
    progress: 0,
    competencies: ['Estruturar paginas', 'Estilizar interfaces', 'Publicar paginas simples'],
    evidence: 'Primeira pagina publicada e revisada.',
    status: 'coming-soon',
    modules: [
      {
        id: 'web-em-breve',
        title: 'Conteudo em desenvolvimento',
        status: 'coming-soon',
        mode: 'planejado',
      },
    ],
  },
  {
    id: 'programming',
    title: 'Programacao',
    description: 'Logica, funcoes, estruturas de dados basicas e leitura de erros.',
    phase: 'Fase 3',
    progress: 0,
    competencies: ['Modelar problemas', 'Criar funcoes', 'Depurar fluxo logico'],
    evidence: 'Colecao de exercicios resolvidos com explicacao.',
    status: 'coming-soon',
    modules: [
      {
        id: 'programming-em-breve',
        title: 'Conteudo em desenvolvimento',
        status: 'coming-soon',
        mode: 'planejado',
      },
    ],
  },
  {
    id: 'database',
    title: 'Banco de Dados',
    description: 'Modelagem, consultas, relacoes e operacao basica de dados.',
    phase: 'Fase 4',
    progress: 0,
    competencies: ['Modelar dados', 'Consultar registros', 'Explicar relacoes'],
    evidence: 'Mini banco consultado por comandos e documentacao curta.',
    status: 'coming-soon',
    modules: [
      {
        id: 'database-em-breve',
        title: 'Conteudo em desenvolvimento',
        status: 'coming-soon',
        mode: 'planejado',
      },
    ],
  },
  {
    id: 'security',
    title: 'Seguranca Cibernetica e da Informacao',
    description:
      'Radar estrategico aprovado: trilha futura e isolada, sem laboratorios ou validadores formalizados.',
    phase: 'Radar futuro',
    progress: 0,
    competencies: ['Higiene digital', 'Leitura de riscos', 'Postura defensiva'],
    evidence: 'Checklist de boas praticas, quando a trilha for formalizada.',
    status: 'coming-soon',
    modules: [
      {
        id: 'security-em-breve',
        title: 'Curriculo ainda nao formalizado',
        status: 'coming-soon',
        mode: 'planejado',
      },
    ],
  },
];
