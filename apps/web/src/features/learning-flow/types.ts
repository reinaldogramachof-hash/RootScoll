import type { TerminalFilesystemState } from '@codechat/terminal-engine';

/**
 * Estrutura de Bloco Pedagógico Local (Fase 1, sequência de aprendizagem).
 * Evolui `../lessons` (Fase 1 — Primeira Lição Executável Local) para um
 * fluxo de 4 etapas por bloco: teoria -> prática -> avaliação ->
 * feedback/conclusão. Continua sendo, deliberadamente, OUTRO tipo do que
 * `LessonCatalogEntry`/`ChallengeCatalogEntry` (`@codechat/types`, Learning
 * Catalog v1) — mesma justificativa registrada em `../lessons/types.ts` e no
 * Implementation Report da Fase 1: aquele modelo representa um catálogo
 * completo (Track -> Course -> Module -> Lesson -> Challenge) e não tem
 * avaliador implementado; esta fatia continua usando validação local ad hoc,
 * agora só reorganizada em 4 etapas nomeadas. `packages/types` não foi
 * alterado por esta fatia.
 */

/** As 4 etapas do fluxo de um bloco pedagógico, na ordem em que ocorrem. */
export type LearningStep = 'theory' | 'practice' | 'assessment' | 'conclusion';

/** Conteúdo teórico exibido antes da prática — texto local, sem IA. */
export interface TheoryContent {
  readonly title: string;
  /** Parágrafos curtos exibidos em sequência (sem markdown/HTML). */
  readonly paragraphs: readonly string[];
}

/** Conteúdo da etapa prática: o objetivo e comandos sugeridos no terminal. */
export interface PracticeContent {
  readonly objective: string;
  readonly suggestedCommands: readonly string[];
}

/**
 * Avaliação local do bloco: mesma validação pura usada em `../lessons`
 * (`isComplete`), agora nomeada como `assessment` para refletir a etapa
 * dedicada do fluxo. Continua lendo apenas o estado do filesystem virtual
 * produzido por `@codechat/terminal-engine` — nenhuma chamada de rede/IA.
 */
export interface AssessmentContent {
  readonly successMessage: string;
  readonly isComplete: (filesystem: TerminalFilesystemState) => boolean;
}

/**
 * Dica determinística do mentor discreto, revelada progressivamente conforme
 * o aluno tenta comandos na prática/avaliação sem sucesso — sem IA real, só
 * regras locais (ver `./mentor.ts`, `selectHint`). Formato inspirado no
 * campo `dicas` do schema real de lição
 * (`docs/product/curriculum-phase-0.md`: `{ apos_tentativas, texto,
 * revela_resposta? }`).
 */
export interface MentorHint {
  /** Dica exibida somente após este número de tentativas de comando (>= 1). */
  readonly afterAttempts: number;
  readonly text: string;
}

/** Um bloco pedagógico completo: teoria -> prática -> avaliação -> mentor. */
export interface LearningBlock {
  readonly id: string;
  readonly title: string;
  readonly theory: TheoryContent;
  readonly practice: PracticeContent;
  readonly assessment: AssessmentContent;
  /** Dicas do mentor, em ordem crescente de `afterAttempts`. */
  readonly mentorHints: readonly MentorHint[];
}
