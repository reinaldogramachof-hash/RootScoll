import type { TerminalFilesystemState } from '@codechat/terminal-engine';

/**
 * Estrutura de Bloco Pedagógico Local (Fase 1, sequência de aprendizagem).
 * Evolui `../lessons` (Fase 1 — Primeira Lição Executável Local) para um
 * fluxo de 4 etapas por bloco: teoria -> prática -> avaliação ->
 * feedback/conclusão.
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
 * Passo de prática individual dentro de um bloco pedagógico (suporta lições ativas com múltiplos passos).
 */
export interface PracticeStep {
  readonly id: string;
  readonly stepNumber: number;
  readonly title?: string;
  readonly objective: string;
  readonly successMessage: string;
  readonly isComplete: (filesystem: TerminalFilesystemState) => boolean;
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
 * regras locais.
 */
export interface MentorHint {
  /** Dica exibida somente após este número de tentativas de comando (>= 1). */
  readonly afterAttempts: number;
  readonly text: string;
}

/** Um bloco pedagógico completo: teoria -> prática (com múltiplos passos) -> avaliação -> mentor. */
export interface LearningBlock {
  readonly id: string;
  readonly title: string;
  readonly theory: TheoryContent;
  readonly practice: PracticeContent;
  readonly steps: readonly PracticeStep[];
  readonly assessment: AssessmentContent;
  /** Dicas do mentor, em ordem crescente de `afterAttempts`. */
  readonly mentorHints: readonly MentorHint[];
}

