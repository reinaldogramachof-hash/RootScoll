import { describe, expect, it } from 'vitest';
import type {
  ChallengeCatalogEntry,
  CourseCatalogEntry,
  DifficultyLevel,
  ExecutionAdapterId,
  LearningSegment,
  LearningTrack,
  LearningTrackId,
  LessonCatalogEntry,
  ModuleCatalogEntry,
  PhaseZeroSourceLevel,
  ProgrammingLanguageId,
  RuntimeRequirement,
  TechnologyTag,
  ValidationRule,
} from './index';

// ---------------------------------------------------------------------------
// Fixtures — Learning Catalog v1
//
// Este arquivo cobre o contrato de catálogo aprovado nesta fase. Os dados
// abaixo (trilhas, cursos, módulos, lições, desafios) são fixtures de teste,
// não conteúdo de produto publicado. O curso `fundamentos-terminal` reflete
// fielmente as 10 lições de docs/product/curriculum-phase-0.md (mesmos ids,
// mesma ordem, mesmo `nivel`), preservando o modelo já aprovado da Fase 0.
// O curso `fundamentos-python` é um exemplo ILUSTRATIVO do contrato para a
// trilha `programming` — não é currículo real aprovado (ver
// docs/product/learning-catalog-v1.md).
// ---------------------------------------------------------------------------

/**
 * Requisito de runtime recomendado por segmento — fixture de teste (não
 * exportado do pacote de tipos; a decisão de roteamento real pertence a
 * `execution-engine`, fora de escopo aqui). Espelha a tabela de referência
 * documentada em docs/product/learning-catalog-v1.md.
 */
const RUNTIME_BY_SEGMENT: Record<LearningSegment, RuntimeRequirement> = {
  linux: { adapterId: 'virtual-shell', environmentProfileId: 'linux' },
  macos: { adapterId: 'virtual-shell', environmentProfileId: 'macos' },
  'windows-cmd': { adapterId: 'virtual-shell', environmentProfileId: 'windows-cmd' },
  powershell: { adapterId: 'virtual-shell', environmentProfileId: 'powershell' },
  git: { adapterId: 'virtual-shell' },
  html: { adapterId: 'webcontainer' },
  css: { adapterId: 'webcontainer' },
  javascript: { adapterId: 'webcontainer' },
  python: { adapterId: 'pyodide' },
  java: { adapterId: 'remote-runner' },
  php: { adapterId: 'remote-runner' },
  nodejs: { adapterId: 'remote-runner' },
  database: { adapterId: 'remote-runner' },
  deploy: { adapterId: 'remote-runner' },
  testing: { adapterId: 'remote-runner' },
  debugging: { adapterId: 'remote-runner' },
  cybersecurity: { adapterId: 'remote-runner' },
  'information-security': { adapterId: 'remote-runner' },
  'secure-development': { adapterId: 'remote-runner' },
  'digital-risk': { adapterId: 'remote-runner' },
};

const TERMINAL_OS_TRACK: LearningTrack = {
  trackId: 'terminal-os',
  name: 'Terminal e Sistemas Operacionais',
  description: 'Linux, macOS, Windows CMD e PowerShell — a base do modo raiz.',
  segments: ['linux', 'macos', 'windows-cmd', 'powershell'],
};

const PROGRAMMING_TRACK: LearningTrack = {
  trackId: 'programming',
  name: 'Programação',
  description: 'Python, Java, PHP, Node.js e outras linguagens.',
  segments: ['python', 'java', 'php', 'nodejs'],
};

const CYBERSECURITY_TRACK: LearningTrack = {
  trackId: 'cybersecurity',
  name: 'Segurança Cibernética e da Informação',
  description:
    'Base estruturada para navegar, criar e distribuir aplicações com consciência de risco.',
  segments: ['cybersecurity', 'information-security', 'secure-development', 'digital-risk'],
};

// --- Curso Fase 0: fundamentos-terminal (Track terminal-os) ---------------

const FASE_0_LESSONS: ReadonlyArray<{
  id: string;
  titulo: string;
  nivel: PhaseZeroSourceLevel;
  moduleId: string;
}> = [
  {
    id: '01-onde-estou',
    titulo: 'Onde estou?',
    nivel: 1,
    moduleId: 'fundamentos-terminal-modulo-1',
  },
  {
    id: '02-navegando',
    titulo: 'Navegando entre diretórios',
    nivel: 1,
    moduleId: 'fundamentos-terminal-modulo-1',
  },
  {
    id: '03-criando-estrutura',
    titulo: 'Criando estrutura de pastas',
    nivel: 2,
    moduleId: 'fundamentos-terminal-modulo-2',
  },
  {
    id: '04-criando-arquivos',
    titulo: 'Criando e preenchendo arquivos',
    nivel: 2,
    moduleId: 'fundamentos-terminal-modulo-2',
  },
  {
    id: '05-lendo-arquivos',
    titulo: 'Lendo arquivos sem abrir editor',
    nivel: 2,
    moduleId: 'fundamentos-terminal-modulo-2',
  },
  {
    id: '06-copiar-mover',
    titulo: 'Copiar, mover e renomear',
    nivel: 2,
    moduleId: 'fundamentos-terminal-modulo-2',
  },
  {
    id: '07-removendo',
    titulo: 'Removendo com consciência',
    nivel: 2,
    moduleId: 'fundamentos-terminal-modulo-2',
  },
  {
    id: '08-buscando',
    titulo: 'Encontrando o que você não sabe onde está',
    nivel: 3,
    moduleId: 'fundamentos-terminal-modulo-3',
  },
  {
    id: '09-encadeando',
    titulo: 'Encadeando comandos com pipe',
    nivel: 3,
    moduleId: 'fundamentos-terminal-modulo-3',
  },
  {
    id: '10-permissoes',
    titulo: 'Permissões: por que o script não roda',
    nivel: 4,
    moduleId: 'fundamentos-terminal-modulo-4',
  },
];

function difficultyFromNivel(nivel: number): DifficultyLevel {
  if (nivel <= 2) return 'beginner';
  if (nivel === 3) return 'intermediate';
  return 'advanced';
}

const FUNDAMENTOS_TERMINAL_MODULES: ModuleCatalogEntry[] = [
  {
    moduleId: 'fundamentos-terminal-modulo-1',
    courseId: 'fundamentos-terminal',
    title: 'Orientação',
    description: 'pwd, ls, cd, clear, man — onde estou e como me movo.',
    order: 1,
    lessonIds: ['01-onde-estou', '02-navegando'],
  },
  {
    moduleId: 'fundamentos-terminal-modulo-2',
    courseId: 'fundamentos-terminal',
    title: 'Arquivos e diretórios',
    description: 'mkdir, touch, cat, echo, cp, mv, rm, tree — criar, ler, copiar, remover.',
    order: 2,
    lessonIds: [
      '03-criando-estrutura',
      '04-criando-arquivos',
      '05-lendo-arquivos',
      '06-copiar-mover',
      '07-removendo',
    ],
  },
  {
    moduleId: 'fundamentos-terminal-modulo-3',
    courseId: 'fundamentos-terminal',
    title: 'Conteúdo e fluxo',
    description: 'head, tail, grep, find, wc, pipe — buscar e compor.',
    order: 3,
    lessonIds: ['08-buscando', '09-encadeando'],
  },
  {
    moduleId: 'fundamentos-terminal-modulo-4',
    courseId: 'fundamentos-terminal',
    title: 'Sistema',
    description: 'chmod, whoami, history — permissões e identidade.',
    order: 4,
    lessonIds: ['10-permissoes'],
  },
];

const FUNDAMENTOS_TERMINAL_LESSONS: LessonCatalogEntry[] = FASE_0_LESSONS.map((lesson, index) => ({
  lessonId: lesson.id,
  moduleId: lesson.moduleId,
  title: lesson.titulo,
  learningObjective: `Concluir o objetivo prático da lição "${lesson.titulo}" no terminal virtual.`,
  order: index + 1,
  segment: 'linux',
  difficulty: difficultyFromNivel(lesson.nivel),
  runtime: RUNTIME_BY_SEGMENT.linux,
  challengeIds: [`${lesson.id}-challenge`],
  sourceLevel: lesson.nivel,
}));

const FUNDAMENTOS_TERMINAL_CHALLENGES: ChallengeCatalogEntry[] = FASE_0_LESSONS.map((lesson) => {
  const rule: ValidationRule = { kind: 'exit-code', value: 0 };
  return {
    challengeId: `${lesson.id}-challenge`,
    lessonId: lesson.id,
    prompt: `Resolva a tarefa prática da lição "${lesson.titulo}".`,
    expectedOutcome: 'Estado final do terminal/filesystem corresponde ao esperado pela lição.',
    validationRules: [rule],
    environmentProfileId: 'linux',
  };
});

const FUNDAMENTOS_TERMINAL_COURSE: CourseCatalogEntry = {
  courseId: 'fundamentos-terminal',
  trackId: 'terminal-os',
  title: 'Fundamentos de Terminal',
  description: 'As 10 lições da Fase 0, organizadas como o primeiro curso do Learning Catalog v1.',
  difficulty: 'beginner',
  technologies: [
    { id: 'linux', label: 'Linux' },
    { id: 'shell', label: 'Shell' },
  ],
  moduleIds: FUNDAMENTOS_TERMINAL_MODULES.map((m) => m.moduleId),
  publicationStatus: 'draft',
};

// --- Curso ilustrativo: fundamentos-python (Track programming) ------------

const FUNDAMENTOS_PYTHON_MODULE: ModuleCatalogEntry = {
  moduleId: 'fundamentos-python-modulo-1',
  courseId: 'fundamentos-python',
  title: 'Primeiros passos em Python',
  description: 'Exemplo ilustrativo do contrato — não é currículo real aprovado.',
  order: 1,
  lessonIds: ['py-01-ola-mundo'],
};

const FUNDAMENTOS_PYTHON_LESSON: LessonCatalogEntry = {
  lessonId: 'py-01-ola-mundo',
  moduleId: 'fundamentos-python-modulo-1',
  title: 'Olá, mundo em Python',
  learningObjective: 'Executar o primeiro script Python no runtime pyodide.',
  order: 1,
  segment: 'python',
  difficulty: 'beginner',
  runtime: RUNTIME_BY_SEGMENT.python,
  challengeIds: ['py-01-ola-mundo-challenge'],
};

const FUNDAMENTOS_PYTHON_CHALLENGE: ChallengeCatalogEntry = {
  challengeId: 'py-01-ola-mundo-challenge',
  lessonId: 'py-01-ola-mundo',
  prompt: 'Escreva um script que imprima "ola, mundo".',
  expectedOutcome: 'stdout contém "ola, mundo".',
  validationRules: [{ kind: 'output-contains', text: 'ola, mundo' }],
};

const FUNDAMENTOS_PYTHON_COURSE: CourseCatalogEntry = {
  courseId: 'fundamentos-python',
  trackId: 'programming',
  title: 'Fundamentos de Python (exemplo)',
  description:
    'Exemplo ilustrativo do contrato de catálogo para a trilha Programação — não publicado.',
  difficulty: 'beginner',
  technologies: [{ id: 'python', label: 'Python' } satisfies TechnologyTag],
  moduleIds: [FUNDAMENTOS_PYTHON_MODULE.moduleId],
  publicationStatus: 'draft',
};

// ---------------------------------------------------------------------------
// Helper de integridade referencial (apenas neste arquivo de teste — não faz
// parte de @codechat/types, que deve permanecer sem lógica de runtime).
// ---------------------------------------------------------------------------

function assertCourseGraphIsConsistent(
  course: CourseCatalogEntry,
  modules: readonly ModuleCatalogEntry[],
  lessons: readonly LessonCatalogEntry[],
  challenges: readonly ChallengeCatalogEntry[],
): void {
  const moduleIds = new Set(modules.map((m) => m.moduleId));
  const lessonIds = new Set(lessons.map((l) => l.lessonId));
  const challengeIds = new Set(challenges.map((c) => c.challengeId));

  for (const moduleId of course.moduleIds) {
    expect(moduleIds.has(moduleId)).toBe(true);
  }
  for (const module of modules) {
    expect(module.courseId).toBe(course.courseId);
    for (const lessonId of module.lessonIds) {
      expect(lessonIds.has(lessonId)).toBe(true);
    }
  }
  for (const lesson of lessons) {
    expect(moduleIds.has(lesson.moduleId)).toBe(true);
    for (const challengeId of lesson.challengeIds) {
      expect(challengeIds.has(challengeId)).toBe(true);
    }
  }
  for (const challenge of challenges) {
    expect(lessonIds.has(challenge.lessonId)).toBe(true);
  }
}

describe('Learning Catalog v1', () => {
  it('cria uma trilha Terminal/SO com os 4 segmentos de sistema operacional', () => {
    const trackId: LearningTrackId = 'terminal-os';
    expect(TERMINAL_OS_TRACK.trackId).toBe(trackId);
    expect(TERMINAL_OS_TRACK.segments).toEqual(['linux', 'macos', 'windows-cmd', 'powershell']);
  });

  it('cria uma trilha Programação/Python', () => {
    const languageId: ProgrammingLanguageId = 'python';
    expect(PROGRAMMING_TRACK.trackId).toBe('programming');
    expect(PROGRAMMING_TRACK.segments).toContain(languageId);
    expect(FUNDAMENTOS_PYTHON_COURSE.trackId).toBe('programming');
  });

  it('registra Segurança Cibernética como Trilha 06 estratégica', () => {
    const trackId: LearningTrackId = 'cybersecurity';
    expect(CYBERSECURITY_TRACK.trackId).toBe(trackId);
    expect(CYBERSECURITY_TRACK.segments).toEqual([
      'cybersecurity',
      'information-security',
      'secure-development',
      'digital-risk',
    ]);
  });

  it('associa Course -> Module -> Lesson -> Challenge sem ids orfãos (Terminal/SO)', () => {
    assertCourseGraphIsConsistent(
      FUNDAMENTOS_TERMINAL_COURSE,
      FUNDAMENTOS_TERMINAL_MODULES,
      FUNDAMENTOS_TERMINAL_LESSONS,
      FUNDAMENTOS_TERMINAL_CHALLENGES,
    );
  });

  it('associa Course -> Module -> Lesson -> Challenge sem ids orfãos (Programação/Python)', () => {
    assertCourseGraphIsConsistent(
      FUNDAMENTOS_PYTHON_COURSE,
      [FUNDAMENTOS_PYTHON_MODULE],
      [FUNDAMENTOS_PYTHON_LESSON],
      [FUNDAMENTOS_PYTHON_CHALLENGE],
    );
  });

  it('mapeia runtime compatível por segmento', () => {
    const linuxRuntime: RuntimeRequirement = RUNTIME_BY_SEGMENT.linux;
    const pythonRuntime: RuntimeRequirement = RUNTIME_BY_SEGMENT.python;
    const jsRuntime: RuntimeRequirement = RUNTIME_BY_SEGMENT.javascript;
    const javaRuntime: RuntimeRequirement = RUNTIME_BY_SEGMENT.java;
    const cybersecurityRuntime: RuntimeRequirement = RUNTIME_BY_SEGMENT.cybersecurity;
    const adapters: ExecutionAdapterId[] = [
      linuxRuntime.adapterId,
      pythonRuntime.adapterId,
      jsRuntime.adapterId,
      javaRuntime.adapterId,
    ];

    expect(linuxRuntime).toEqual({ adapterId: 'virtual-shell', environmentProfileId: 'linux' });
    expect(pythonRuntime).toEqual({ adapterId: 'pyodide' });
    expect(jsRuntime).toEqual({ adapterId: 'webcontainer' });
    expect(javaRuntime).toEqual({ adapterId: 'remote-runner' });
    expect(cybersecurityRuntime).toEqual({ adapterId: 'remote-runner' });
    expect(new Set(adapters).size).toBe(4);

    expect(
      FUNDAMENTOS_TERMINAL_LESSONS.every((lesson) => lesson.runtime.adapterId === 'virtual-shell'),
    ).toBe(true);
    expect(FUNDAMENTOS_PYTHON_LESSON.runtime.adapterId).toBe('pyodide');
  });

  it('preserva o modelo atual da Fase 0: 10 lições, mesmos ids, mesma ordem, mesmo nível', () => {
    expect(FUNDAMENTOS_TERMINAL_LESSONS).toHaveLength(10);
    expect(FUNDAMENTOS_TERMINAL_LESSONS.map((l) => l.lessonId)).toEqual([
      '01-onde-estou',
      '02-navegando',
      '03-criando-estrutura',
      '04-criando-arquivos',
      '05-lendo-arquivos',
      '06-copiar-mover',
      '07-removendo',
      '08-buscando',
      '09-encadeando',
      '10-permissoes',
    ]);
    expect(FUNDAMENTOS_TERMINAL_LESSONS.map((l) => l.sourceLevel)).toEqual([
      1, 1, 2, 2, 2, 2, 2, 3, 3, 4,
    ]);
    expect(FUNDAMENTOS_TERMINAL_MODULES).toHaveLength(4);
    expect(FUNDAMENTOS_TERMINAL_MODULES.flatMap((m) => m.lessonIds)).toHaveLength(10);

    // Nível 4 (Sistema) deve virar difficulty 'advanced'; nível 1-2 'beginner'.
    const licao10 = FUNDAMENTOS_TERMINAL_LESSONS.find((l) => l.lessonId === '10-permissoes');
    const licao01 = FUNDAMENTOS_TERMINAL_LESSONS.find((l) => l.lessonId === '01-onde-estou');
    expect(licao10?.difficulty).toBe('advanced');
    expect(licao01?.difficulty).toBe('beginner');

    // Interoperabilidade com os contratos da fatia mínima da Fase 1: um
    // ChallengeCatalogEntry carrega ValidationRule de verdade, sem precisar
    // de um segundo vocabulário de validação para o catálogo.
    const primeiroDesafio = FUNDAMENTOS_TERMINAL_CHALLENGES[0];
    expect(primeiroDesafio?.validationRules[0]?.kind).toBe('exit-code');
  });
});
