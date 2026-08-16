import type { LearningStep } from './types';
import { STEP_LABELS, STEP_ORDER } from './step-labels';

export interface ProgressBarProps {
  /** Bloco atual, 1-indexado (ex.: 1 de 2). */
  readonly current: number;
  readonly total: number;
  readonly step: LearningStep;
}

/**
 * Barra de progresso visual do bloco pedagógico atual (etapa dentro do
 * bloco: Teoria -> Prática -> Avaliação -> Conclusão) e do avanço entre
 * blocos (Bloco N/total). Puramente apresentacional, fina, não compete com o
 * terminal — fica entre a titlebar e o conteúdo, dentro do mesmo
 * `.terminal-window`.
 */
function ProgressBar({ current, total, step }: ProgressBarProps) {
  const stepIndex = STEP_ORDER.indexOf(step);

  return (
    <div className="progress-bar" aria-label="Progresso do bloco atual">
      <span className="progress-bar__count">
        Bloco {current}/{total}
      </span>
      <ol className="progress-bar__steps">
        {STEP_ORDER.map((candidate, index) => {
          const state = index < stepIndex ? 'done' : index === stepIndex ? 'active' : 'pending';
          return (
            <li key={candidate} className={`progress-bar__step progress-bar__step--${state}`}>
              {STEP_LABELS[candidate]}
            </li>
          );
        })}
      </ol>
    </div>
  );
}

export default ProgressBar;
