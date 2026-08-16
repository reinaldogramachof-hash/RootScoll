import type { LearningStep } from './types';

/** Ordem fixa das 4 etapas de um bloco pedagógico. */
export const STEP_ORDER: readonly LearningStep[] = [
  'theory',
  'practice',
  'assessment',
  'conclusion',
];

/** Rótulos em pt-BR das etapas, compartilhados por `ProgressBar` e `Sidebar`. */
export const STEP_LABELS: Record<LearningStep, string> = {
  theory: 'Teoria',
  practice: 'Prática',
  assessment: 'Avaliação',
  conclusion: 'Conclusão',
};
