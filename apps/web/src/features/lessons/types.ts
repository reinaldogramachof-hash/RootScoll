import type { TerminalFilesystemState } from '@codechat/terminal-engine';

/**
 * Modelo local e mínimo de lição para esta primeira experiência executável
 * (Fase 1 — Primeira Lição Executável Local). Deliberadamente OUTRO tipo de
 * `LessonCatalogEntry`/`ChallengeCatalogEntry` (`@codechat/types`, Learning
 * Catalog v1): aqueles modelam um catálogo completo
 * (Track -> Course -> Module -> Lesson -> Challenge, com ids cruzados,
 * `trackId`/`moduleId` etc.) — pesado demais para uma única sessão local de
 * prática, sem catálogo/backend por trás. `packages/types` NÃO foi alterado
 * por esta fatia; ver Implementation Report, seção "Decisões técnicas", para
 * a justificativa completa de manter este tipo local a `apps/web`.
 */
export interface Lesson {
  readonly id: string;
  readonly title: string;
  readonly objective: string;
  readonly suggestedCommands: readonly string[];
  readonly successMessage: string;
  /**
   * Validação local, pura: lê o estado do filesystem virtual (produzido por
   * `@codechat/terminal-engine`) e diz se o objetivo foi cumprido. Não é o
   * `ValidationRule`/`(ExecutionResult, ValidationRule) -> ValidationOutcome`
   * de `@codechat/types` — essa gramática geral ainda não tem avaliador
   * implementado em nenhum lugar do monorepo (pendência separada, já
   * registrada em `Cérebro Operacional.md`, "Próximos passos ativos"); esta
   * fatia usa uma checagem local ad hoc, suficiente para provar o fluxo
   * fim-a-fim exigido pela tarefa.
   */
  readonly isComplete: (filesystem: TerminalFilesystemState) => boolean;
}

/** Status local de progresso do aluno na lição atual (em memória, por sessão). */
export type LessonStatus = 'pending' | 'success';
