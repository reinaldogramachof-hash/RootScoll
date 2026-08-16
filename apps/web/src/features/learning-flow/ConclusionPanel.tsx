import type { LearningBlock } from './types';

export interface ConclusionPanelProps {
  readonly block: LearningBlock;
  readonly hasNextBlock: boolean;
  readonly finished: boolean;
  readonly onNext: () => void;
}

/**
 * Etapa de conclusão: recapitula o bloco concluído e oferece avanço para o
 * próximo (ou encerra o fluxo local, sem dashboard/landing — só uma
 * mensagem final dentro da mesma janela de terminal).
 */
function ConclusionPanel({ block, hasNextBlock, finished, onNext }: ConclusionPanelProps) {
  return (
    <div className="step-panel step-panel--conclusion">
      <h2 className="step-panel__title">{block.title} — concluído</h2>
      <p className="step-panel__paragraph">{block.assessment.successMessage}</p>
      {hasNextBlock && (
        <button type="button" className="step-panel__action" onClick={onNext}>
          Próximo bloco →
        </button>
      )}
      {finished && (
        <p className="step-panel__paragraph step-panel__paragraph--muted">
          Você concluiu todos os blocos disponíveis nesta versão local.
        </p>
      )}
    </div>
  );
}

export default ConclusionPanel;
