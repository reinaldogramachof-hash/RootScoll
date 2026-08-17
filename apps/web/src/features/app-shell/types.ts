/**
 * Modelo local do shell de aplicação (App Navigation v1 — ver
 * `docs/product/app-navigation-v1.md`). Tipos deliberadamente locais a
 * `apps/web`, sem importar de `@codechat/types`: o Learning Catalog v1
 * (`LearningTrack`/`CourseCatalogEntry`/...) modela um catálogo real,
 * versionável, com IDs cruzados entre `Track -> Course -> Module -> Lesson ->
 * Challenge` — pesado demais para o catálogo mock desta fatia (6 trilhas
 * estáticas, sem persistência). `packages/types` não foi alterado por esta
 * fatia.
 */

/** As telas locais do shell — sem roteador real, navegação em memória. */
export type AppScreen =
  | 'login'
  | 'dashboard'
  | 'profile'
  | 'tracks'
  | 'terminal-classroom'
  | 'teacher-dashboard'
  | 'teacher-classroom-detail'
  | 'partner-dashboard'
  | 'partner-talent-detail';

/**
 * Papéis previstos pelo produto (ver `docs/product/app-navigation-v1.md`,
 * seção "Papéis previstos").
 */
export type UserRole = 'aluno' | 'professor' | 'admin' | 'mentor-ia' | 'parceiro';

/** Usuário mock local — sem autenticação real, sem Supabase. */
export interface MockUser {
  readonly name: string;
  readonly email: string;
  readonly role: UserRole;
  /** Marco pedagógico local usado nas telas mock do shell. */
  readonly currentPhase: string;
  /** Competência em foco nesta retomada local. */
  readonly currentCompetency: string;
  /** Evidências mock registradas no portfólio local. */
  readonly evidenceCount: number;
  /** `Track.id` da trilha em andamento. */
  readonly currentTrackId: string;
  /** Progresso geral do aluno, 0–100. Número mock, não calculated. */
  readonly overallProgress: number;
  /** Pontuação de Integridade/Confiança Comercial (0-1000). */
  readonly integrityScore: number;
  /** Nível derivado do score. */
  readonly integrityLevel: 'ruim' | 'atencao' | 'bom' | 'excelente';
  /** Saldo de moedas virtuais acumuladas por boas práticas. */
  readonly coins: number;
  /** Pontos de experiência (XP) pedagógicos. */
  readonly xp: number;
  /** Histórico de extrato de integridade/pontuação. */
  readonly integrityLogs?: readonly IntegrityLogEntry[];
}

export interface IntegrityLogEntry {
  readonly id: string;
  readonly date: string;
  readonly action: string;
  readonly change: number;
  readonly type: 'gain' | 'penalty';
  readonly reason: string;
}

export type TrackStatus = 'available' | 'coming-soon';

export interface TrackModule {
  readonly id: string;
  readonly title: string;
  readonly status: TrackStatus;
  readonly mode: 'teoria' | 'pratica' | 'avaliacao' | 'projeto' | 'planejado';
}

export interface Track {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly phase: string;
  readonly progress: number;
  readonly competencies: readonly string[];
  readonly evidence: string;
  readonly status: TrackStatus;
  readonly modules: readonly TrackModule[];
}

/* ==========================================================================
   Tipos para o Painel do Professor (Gestão Didática)
   ========================================================================== */

export interface MockStudentSummary {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly currentPhase: string;
  readonly currentTrack: string;
  readonly progress: number;
  readonly evidenceCount: number;
  readonly status: 'ativo' | 'em-risco' | 'concluido' | 'inativo';
  readonly lastActive: string;
  readonly completedCompetencies: readonly string[];
  readonly pendingCompetencies: readonly string[];
  readonly currentBottleneck?: string;
}

export interface MockBottleneck {
  readonly id: string;
  readonly trackTitle: string;
  readonly moduleTitle: string;
  readonly failureRate: number; // Porcentagem (ex: 42%)
  readonly impactedStudentsCount: number;
  readonly severity: 'alta' | 'media' | 'baixa';
  readonly recommendedAction: string;
}

export interface MockClassroom {
  readonly id: string;
  readonly name: string;
  readonly code: string;
  readonly trackTitle: string;
  readonly studentsCount: number;
  readonly averageProgress: number;
  readonly activeCount: number;
  readonly atRiskCount: number;
  readonly students: readonly MockStudentSummary[];
  readonly bottlenecks: readonly MockBottleneck[];
}

/* ==========================================================================
   Tipos para o Painel do Parceiro (Recrutamento de Talentos / RH)
   ========================================================================== */

export interface MockTalentEvidence {
  readonly title: string;
  readonly description: string;
  readonly date: string;
  readonly track: string;
}

export interface MockTalentTrackProgress {
  readonly trackId: string;
  readonly title: string;
  readonly progress: number;
}

export interface MockTalentProfile {
  readonly id: string;
  readonly name: string;
  readonly headline: string;
  readonly location: string;
  readonly currentPhase: string;
  readonly overallProgress: number;
  readonly evidenceCount: number;
  readonly readinessScore: number; // 0-100 (Prontidão para Júnior)
  readonly integrityScore: number; // 0-1000 (Score de Integridade Comercial)
  readonly integrityLevel: 'ruim' | 'atencao' | 'bom' | 'excelente';
  readonly availability:
    'Disponível imediatamente' | 'Em formação (estágio)' | 'Em transição de carreira';
  readonly topSkills: readonly string[];
  readonly bio: string;
  readonly trackProgresses: readonly MockTalentTrackProgress[];
  readonly evidences: readonly MockTalentEvidence[];
}

export interface PartnerCompany {
  readonly name: string;
  readonly segment: string;
  readonly activeSearches: number;
  readonly shortlistedCount: number;
}
