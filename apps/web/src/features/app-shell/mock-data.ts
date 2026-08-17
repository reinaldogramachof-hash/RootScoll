import type { MockClassroom, MockTalentProfile, MockUser, PartnerCompany, Track } from './types';

/**
 * Dados mock locais do shell: sem backend, sem Supabase, sem persistência.
 * A UI usa 6 macrotrilhas como navegação executiva e preserva as 14 trilhas
 * granulares do currículo v2 como direção pedagógica interna.
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

export const MOCK_TEACHER: MockUser = {
  name: 'Prof. Carlos Mendes',
  email: 'carlos.mendes@rootscoll.edu',
  role: 'professor',
  currentPhase: 'Gestão Didática — 3 Turmas Ativas',
  currentCompetency: 'Supervisão de turmas, diagnóstico de gargalos e mentoria técnica.',
  evidenceCount: 148,
  currentTrackId: TERMINAL_TRACK_ID,
  overallProgress: 100,
};

export const MOCK_PARTNER: MockUser = {
  name: 'Mariana Silva',
  email: 'mariana.silva@techrecruit.io',
  role: 'parceiro',
  currentPhase: 'Mapeamento de Talentos Técnicos',
  currentCompetency: 'Busca ativa de desenvolvedores júnior com comprovação prática.',
  evidenceCount: 42,
  currentTrackId: TERMINAL_TRACK_ID,
  overallProgress: 100,
};

export const MOCK_PARTNER_COMPANY: PartnerCompany = {
  name: 'TechRecruit Talent Solutions',
  segment: 'Consultoria de RH & Recrutamento Tech',
  activeSearches: 5,
  shortlistedCount: 8,
};

export const TRACKS: readonly Track[] = [
  {
    id: TERMINAL_TRACK_ID,
    title: 'Terminal e Sistemas Operacionais',
    description: 'Base de linha de comando: navegação, arquivos, diretórios, stdout e stderr.',
    phase: 'Fase 0',
    progress: 34,
    competencies: ['Navegar entre pastas', 'Criar arquivos', 'Explicar stdout/stderr'],
    evidence: 'Registro de comandos executados e explicados em linguagem natural.',
    status: 'available',
    modules: [
      {
        id: 'terminal-os-orientacao',
        title: 'Orientação teórica: shell, caminho e diretório atual',
        status: 'available',
        mode: 'teoria',
      },
      {
        id: 'terminal-os-navegacao',
        title: 'Prática guiada: pwd, ls e cd',
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
        title: 'Avaliação curta: explicar e repetir o fluxo',
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
    description: 'HTML, CSS, JavaScript, componentes simples e publicação de páginas.',
    phase: 'Fase 2',
    progress: 0,
    competencies: ['Estruturar páginas', 'Estilizar interfaces', 'Publicar páginas simples'],
    evidence: 'Primeira página publicada e revisada.',
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
    title: 'Programação',
    description: 'Lógica, funções, estruturas de dados básicas e leitura de erros.',
    phase: 'Fase 3',
    progress: 0,
    competencies: ['Modelar problemas', 'Criar funções', 'Depurar fluxo lógico'],
    evidence: 'Coleção de exercícios resolvidos com explicação.',
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
    description: 'Modelagem, consultas, relações e operação básica de dados.',
    phase: 'Fase 4',
    progress: 0,
    competencies: ['Modelar dados', 'Consultar registros', 'Explicar relações'],
    evidence: 'Mini banco consultado por comandos e documentação curta.',
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
    title: 'Segurança Cibernética e da Informação',
    description:
      'Radar estrategico aprovado: trilha futura e isolada, sem laboratorios ou validadores formalizados.',
    phase: 'Radar futuro',
    progress: 0,
    competencies: ['Higiene digital', 'Leitura de riscos', 'Postura defensiva'],
    evidence: 'Checklist de boas práticas, quando a trilha for formalizada.',
    status: 'coming-soon',
    modules: [
      {
        id: 'security-em-breve',
        title: 'Currículo ainda não formalizado',
        status: 'coming-soon',
        mode: 'planejado',
      },
    ],
  },
];

/* ==========================================================================
   Dados Mock do Professor (Turmas, Alunos, Gargalos)
   ========================================================================== */

export const MOCK_CLASSROOMS: readonly MockClassroom[] = [
  {
    id: 'turma-alfa-2026',
    name: 'Turma Alfa — Matutino',
    code: 'TURMA-2026-A',
    trackTitle: 'Terminal & Sistemas Operacionais (Fase 0/1)',
    studentsCount: 24,
    averageProgress: 72,
    activeCount: 20,
    atRiskCount: 3,
    bottlenecks: [
      {
        id: 'bot-1',
        trackTitle: 'Terminal e SO',
        moduleTitle: 'Criação de arquivos e paths relativos com touch/cat',
        failureRate: 38,
        impactedStudentsCount: 6,
        severity: 'alta',
        recommendedAction:
          'Revisar exercício prático sobre caminhos relativos "../" antes da avaliação.',
      },
      {
        id: 'bot-2',
        trackTitle: 'Terminal e SO',
        moduleTitle: 'Redirecionamento stdout/stderr e pipes',
        failureRate: 22,
        impactedStudentsCount: 4,
        severity: 'media',
        recommendedAction: 'Demonstrar exemplos de visualização de logs com grep e pipe.',
      },
    ],
    students: [
      {
        id: 'std-1',
        name: 'Lucas Ferreira',
        email: 'lucas.f@exemplo.com',
        currentPhase: 'Fase 0 — Terminal',
        currentTrack: 'Terminal e SO',
        progress: 88,
        evidenceCount: 6,
        status: 'ativo',
        lastActive: 'Hoje, às 19:40',
        completedCompetencies: [
          'Navegação em CLI',
          'Estruturação de arquivos',
          'Comandos touch/mkdir',
        ],
        pendingCompetencies: ['Leitura de stderr', 'Versionamento com Git'],
      },
      {
        id: 'std-2',
        name: 'Beatriz Costa',
        email: 'beatriz.c@exemplo.com',
        currentPhase: 'Fase 0 — Terminal',
        currentTrack: 'Terminal e SO',
        progress: 65,
        evidenceCount: 4,
        status: 'ativo',
        lastActive: 'Ontem, às 21:15',
        completedCompetencies: ['Navegação básica', 'Comandos pwd/ls/cd'],
        pendingCompetencies: ['Criação e remoção segura', 'Scripts de automação'],
      },
      {
        id: 'std-3',
        name: 'Gabriel Santana',
        email: 'gabriel.s@exemplo.com',
        currentPhase: 'Fase 0 — Terminal',
        currentTrack: 'Terminal e SO',
        progress: 32,
        evidenceCount: 1,
        status: 'em-risco',
        lastActive: 'Há 5 dias',
        completedCompetencies: ['Conceito de Shell'],
        pendingCompetencies: [
          'Navegação relativa',
          'Manipulação de arquivos',
          'Explicação técnica',
        ],
        currentBottleneck: 'Travado em caminhos relativos (.. / subpastas)',
      },
      {
        id: 'std-4',
        name: 'Camila Rocha',
        email: 'camila.rocha@exemplo.com',
        currentPhase: 'Fase 0 — Terminal',
        currentTrack: 'Terminal e SO',
        progress: 95,
        evidenceCount: 8,
        status: 'concluido',
        lastActive: 'Hoje, às 16:20',
        completedCompetencies: [
          'CLI Avançada',
          'Manipulação completa de FS',
          'Diagnóstico de logs',
        ],
        pendingCompetencies: ['Próxima trilha: Git e GitHub'],
      },
      {
        id: 'std-5',
        name: 'Rodrigo Alves',
        email: 'rodrigo.alves@exemplo.com',
        currentPhase: 'Fase 0 — Terminal',
        currentTrack: 'Terminal e SO',
        progress: 40,
        evidenceCount: 2,
        status: 'em-risco',
        lastActive: 'Há 4 dias',
        completedCompetencies: ['Comando pwd', 'Listagem simples'],
        pendingCompetencies: ['Criação de diretórios aninhados', 'Depuração de erros'],
        currentBottleneck: 'Dificuldade com flag -p em subpastas',
      },
    ],
  },
  {
    id: 'turma-beta-2026',
    name: 'Turma Beta — Noturno',
    code: 'TURMA-2026-B',
    trackTitle: 'Git, GitHub e Fluxo Profissional (Fase 1)',
    studentsCount: 18,
    averageProgress: 54,
    activeCount: 15,
    atRiskCount: 2,
    bottlenecks: [
      {
        id: 'bot-3',
        trackTitle: 'Git e GitHub',
        moduleTitle: 'Resolução de Conflitos e Rebase',
        failureRate: 45,
        impactedStudentsCount: 7,
        severity: 'alta',
        recommendedAction: 'Disponibilizar workshop guiado no terminal sobre 3-way merge.',
      },
    ],
    students: [
      {
        id: 'std-6',
        name: 'Juliana Paiva',
        email: 'juliana.p@exemplo.com',
        currentPhase: 'Fase 1 — Git',
        currentTrack: 'Git e GitHub',
        progress: 78,
        evidenceCount: 5,
        status: 'ativo',
        lastActive: 'Hoje, às 20:10',
        completedCompetencies: ['Branching', 'Commits semânticos', 'Pull Requests'],
        pendingCompetencies: ['Rebase interativo'],
      },
      {
        id: 'std-7',
        name: 'Felipe Neves',
        email: 'felipe.neves@exemplo.com',
        currentPhase: 'Fase 1 — Git',
        currentTrack: 'Git e GitHub',
        progress: 25,
        evidenceCount: 1,
        status: 'em-risco',
        lastActive: 'Há 6 dias',
        completedCompetencies: ['git init e git add'],
        pendingCompetencies: ['Leitura de diff', 'Tratamento de conflitos'],
        currentBottleneck: 'Insegurança com git merge e perda de código',
      },
    ],
  },
  {
    id: 'turma-gamma-2026',
    name: 'Turma Gamma — Transição de Carreira',
    code: 'TURMA-2026-C',
    trackTitle: 'Desenvolvimento Web & Fundamentos (Fase 2)',
    studentsCount: 28,
    averageProgress: 84,
    activeCount: 26,
    atRiskCount: 1,
    bottlenecks: [
      {
        id: 'bot-4',
        trackTitle: 'Web',
        moduleTitle: 'Manipulação de DOM com Vanilla JS e Event Loop',
        failureRate: 18,
        impactedStudentsCount: 3,
        severity: 'baixa',
        recommendedAction: 'Exercícios adicionais de async/await no console.',
      },
    ],
    students: [
      {
        id: 'std-8',
        name: 'Ana Beatriz Souza',
        email: 'ana.souza@exemplo.com',
        currentPhase: 'Fase 2 — Web',
        currentTrack: 'Desenvolvimento Web',
        progress: 92,
        evidenceCount: 9,
        status: 'concluido',
        lastActive: 'Hoje, às 18:05',
        completedCompetencies: ['HTML Semântico', 'Flexbox/Grid', 'DOM Events', 'Fetch API'],
        pendingCompetencies: ['Testes de interface com Vitest'],
      },
    ],
  },
];

/* ==========================================================================
   Dados Mock de Parceiros (Recrutamento & Pool de Talentos)
   ========================================================================== */

export const MOCK_TALENT_POOL: readonly MockTalentProfile[] = [
  {
    id: 'talent-1',
    name: 'Ana Beatriz Souza',
    headline: 'Desenvolvedora Júnior | Foco em Web Semântica, JavaScript & Linux CLI',
    location: 'São Paulo, SP (Remoto / Híbrido)',
    currentPhase: 'Fase 2 — Desenvolvimento Web Concluído',
    overallProgress: 92,
    evidenceCount: 9,
    readinessScore: 94,
    availability: 'Disponível imediatamente',
    topSkills: [
      'Linux Terminal',
      'Git Workflow',
      'HTML5/CSS3',
      'JavaScript ES6+',
      'Consumo de APIs REST',
    ],
    bio: 'Profissional em transição para tecnologia com forte rigor metodológico no Modo Raiz. Domina operações de terminal sem medo da CLI, versionamento rastreável no GitHub e construção de páginas acessíveis sem dependência excessiva de frameworks.',
    trackProgresses: [
      { trackId: 'terminal-os', title: 'Terminal e Sistemas Operacionais', progress: 100 },
      { trackId: 'git-github', title: 'Git e GitHub', progress: 95 },
      { trackId: 'web', title: 'Desenvolvimento Web', progress: 90 },
      { trackId: 'programming', title: 'Programação', progress: 85 },
    ],
    evidences: [
      {
        title: 'Script de automação de logs em Bash',
        description:
          'Construiu script local com pipes, redirecionamentos e filtros de erro para monitoramento simulado.',
        date: '14/08/2026',
        track: 'Terminal e SO',
      },
      {
        title: 'Landing page acessível com teste de teclado',
        description:
          'Desenvolvimento semântico 100% aderente a WCAG 2.1 AA com CSS Vanilla estruturado.',
        date: '10/08/2026',
        track: 'Web',
      },
      {
        title: 'Pull Request com histórico de commits convencionais',
        description:
          'Fluxo de feature branch, resolução de conflitos e documentação clara em README.',
        date: '02/08/2026',
        track: 'Git e GitHub',
      },
    ],
  },
  {
    id: 'talent-2',
    name: 'Lucas Ferreira',
    headline: 'Dev Júnior Backend & Infra | Linux, Scripts de Terminal & Git',
    location: 'Belo Horizonte, MG (Remoto)',
    currentPhase: 'Fase 1 — Git & Fundamentos Operacionais',
    overallProgress: 88,
    evidenceCount: 7,
    readinessScore: 89,
    availability: 'Disponível imediatamente',
    topSkills: [
      'Shell Scripting',
      'Manipulação de Filesystem',
      'Git/GitHub',
      'Lógica de Programação',
      'Docker Basics',
    ],
    bio: 'Foco em estabilidade e disciplina técnica. Sólida compreensão de sistemas de arquivos, resolução de problemas no terminal e boas práticas de commits atômicos.',
    trackProgresses: [
      { trackId: 'terminal-os', title: 'Terminal e Sistemas Operacionais', progress: 100 },
      { trackId: 'git-github', title: 'Git e GitHub', progress: 85 },
      { trackId: 'programming', title: 'Programação', progress: 80 },
    ],
    evidences: [
      {
        title: 'Laboratório de diagnóstico de permissões e processos',
        description:
          'Análise de saída de processos e permissões no terminal simulado com documentação de post-mortem.',
        date: '15/08/2026',
        track: 'Terminal e SO',
      },
      {
        title: 'Repositório de algoritmos com cobertura de testes unitários',
        description: 'Implementação de funções puras com asserções em TypeScript.',
        date: '05/08/2026',
        track: 'Programação',
      },
    ],
  },
  {
    id: 'talent-3',
    name: 'Camila Rocha',
    headline: 'Desenvolvedora Júnior Fullstack | JavaScript, TypeScript & SQL',
    location: 'Curitiba, PR (Remoto / Presencial)',
    currentPhase: 'Fase 3 — Programação & Banco de Dados',
    overallProgress: 95,
    evidenceCount: 11,
    readinessScore: 96,
    availability: 'Disponível imediatamente',
    topSkills: ['TypeScript', 'Node.js', 'SQL / Postgres', 'HTML/CSS/JS', 'Testes Automatizados'],
    bio: 'Destaque acadêmico no ecossistema RootScoll. Capacidade comprovada de depuração metódica, modelagem relacional limpa e explicação de arquitetura técnica em entrevistas simuladas.',
    trackProgresses: [
      { trackId: 'terminal-os', title: 'Terminal e Sistemas Operacionais', progress: 100 },
      { trackId: 'git-github', title: 'Git e GitHub', progress: 100 },
      { trackId: 'web', title: 'Desenvolvimento Web', progress: 95 },
      { trackId: 'programming', title: 'Programação', progress: 90 },
      { trackId: 'database', title: 'Banco de Dados', progress: 90 },
    ],
    evidences: [
      {
        title: 'Modelagem de schema relacional e queries analíticas',
        description: 'Projeto de banco de dados com joins, índices e transações documentadas.',
        date: '12/08/2026',
        track: 'Banco de Dados',
      },
      {
        title: 'API REST estruturada com validação de payload',
        description: 'Serviço com separação de camadas, tratamento de erros e tipagem estrita.',
        date: '01/08/2026',
        track: 'Programação',
      },
    ],
  },
  {
    id: 'talent-4',
    name: 'Juliana Paiva',
    headline: 'Desenvolvedora Júnior Frontend | React, CSS Moderno & Git',
    location: 'Rio de Janeiro, RJ (Híbrido / Remoto)',
    currentPhase: 'Fase 2 — Desenvolvimento Web Avançado',
    overallProgress: 78,
    evidenceCount: 6,
    readinessScore: 82,
    availability: 'Em formação (estágio)',
    topSkills: [
      'React',
      'JavaScript Moderno',
      'CSS Grid & Flexbox',
      'Git Colaborativo',
      'Figma to Code',
    ],
    bio: 'Atenção aos detalhes de usabilidade e fidelidade de design system. Compreende o ciclo de vida de componentes e depura problemas no DevTools com agilidade.',
    trackProgresses: [
      { trackId: 'terminal-os', title: 'Terminal e Sistemas Operacionais', progress: 90 },
      { trackId: 'git-github', title: 'Git e GitHub', progress: 85 },
      { trackId: 'web', title: 'Desenvolvimento Web', progress: 80 },
    ],
    evidences: [
      {
        title: 'Componente de dashboard responsivo com tokens de design',
        description: 'Implementação de interface com variáveis CSS semânticas e acessibilidade.',
        date: '11/08/2026',
        track: 'Web',
      },
    ],
  },
  {
    id: 'talent-5',
    name: 'Matheus Henrique',
    headline: 'Desenvolvedor Júnior | Python, Automação & Análise de Dados',
    location: 'Recife, PE (Remoto)',
    currentPhase: 'Fase 3 — Programação & Dados',
    overallProgress: 81,
    evidenceCount: 6,
    readinessScore: 85,
    availability: 'Em transição de carreira',
    topSkills: ['Python', 'SQL', 'Bash', 'Tratamento de Dados', 'Git'],
    bio: 'Experiência prévia em operações e logística migrando para desenvolvimento de software. Alta habilidade em automação de tarefas rotineiras e manipulação de arquivos de dados.',
    trackProgresses: [
      { trackId: 'terminal-os', title: 'Terminal e Sistemas Operacionais', progress: 95 },
      { trackId: 'git-github', title: 'Git e GitHub', progress: 80 },
      { trackId: 'programming', title: 'Programação', progress: 85 },
      { trackId: 'database', title: 'Banco de Dados', progress: 75 },
    ],
    evidences: [
      {
        title: 'Pipeline de parsing de CSV e carga no SQLite via CLI',
        description: 'Script determinístico para higienização e validação de registros tabulares.',
        date: '08/08/2026',
        track: 'Banco de Dados',
      },
    ],
  },
  {
    id: 'talent-6',
    name: 'Larissa Albuquerque',
    headline: 'Desenvolvedora Júnior | QA, Testes Automatizados & Node.js',
    location: 'Porto Alegre, RS (Remoto / Presencial)',
    currentPhase: 'Fase 3 — Qualidade & Testes',
    overallProgress: 86,
    evidenceCount: 8,
    readinessScore: 90,
    availability: 'Disponível imediatamente',
    topSkills: ['Vitest / Jest', 'TypeScript', 'Node.js', 'Linux CLI', 'Casos de Teste'],
    bio: 'Foco total em qualidade e prevenção de bugs. Escreve testes unitários e de integração com cobertura de cenários de borda e documenta falhas detalhadamente.',
    trackProgresses: [
      { trackId: 'terminal-os', title: 'Terminal e Sistemas Operacionais', progress: 100 },
      { trackId: 'git-github', title: 'Git e GitHub', progress: 90 },
      { trackId: 'web', title: 'Desenvolvimento Web', progress: 85 },
      { trackId: 'programming', title: 'Programação', progress: 85 },
    ],
    evidences: [
      {
        title: 'Suite de testes unitários para validador de formulários',
        description: 'Mais de 25 testes cobrindo edge cases de validação semântica e tipagem.',
        date: '09/08/2026',
        track: 'Programação',
      },
    ],
  },
];
