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

/** As 5 telas locais do shell — sem roteador real, navegação em memória. */
export type AppScreen = 'login' | 'dashboard' | 'profile' | 'tracks' | 'terminal-classroom';

/**
 * Papéis previstos pelo produto (ver `docs/product/app-navigation-v1.md`,
 * seção "Papéis previstos"). Só `'aluno'` é usado pelo usuário mock desta
 * fatia — os demais existem no tipo para o shell já ser compatível quando
 * outros papéis chegarem, sem exigir uma migração de tipos depois.
 */
export type UserRole = 'aluno' | 'professor' | 'admin' | 'mentor-ia';

/** Usuário mock local — sem autenticação real, sem Supabase. */
export interface MockUser {
  readonly name: string;
  readonly email: string;
  readonly role: UserRole;
  /** `Track.id` da trilha em andamento. */
  readonly currentTrackId: string;
  /** Progresso geral do aluno, 0–100. Número mock, não calculado. */
  readonly overallProgress: number;
}

export type TrackStatus = 'available' | 'coming-soon';

export interface TrackModule {
  readonly id: string;
  readonly title: string;
  readonly status: TrackStatus;
}

export interface Track {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly status: TrackStatus;
  readonly modules: readonly TrackModule[];
}
