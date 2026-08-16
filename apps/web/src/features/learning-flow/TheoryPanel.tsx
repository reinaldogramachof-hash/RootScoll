import type { TheoryContent } from './types';

export interface TheoryPanelProps {
  readonly theory: TheoryContent;
  readonly onStart: () => void;
}

/**
 * Etapa de teoria: substitui o terminal (que só fica ativo na
 * prática/avaliação — regra explícita desta tarefa) pelo conteúdo teórico do
 * bloco, dentro da mesma janela de terminal (preserva o visual fullscreen
 * aprovado). Texto local, sem markdown/HTML, sem IA.
 */
function TheoryPanel({ theory, onStart }: TheoryPanelProps) {
  return (
    <div className="step-panel step-panel--theory">
      <h2 className="step-panel__title">{theory.title}</h2>
      {theory.paragraphs.map((paragraph, index) => (
        <p className="step-panel__paragraph" key={index}>
          {paragraph}
        </p>
      ))}
      <button type="button" className="step-panel__action" onClick={onStart}>
        Começar prática →
      </button>
    </div>
  );
}

export default TheoryPanel;
