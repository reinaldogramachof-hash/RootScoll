import '../../styles/app.css';
import TerminalScreen from '../terminal/TerminalScreen';
import ProgressBar from './ProgressBar';
import TheoryPanel from './TheoryPanel';
import ConclusionPanel from './ConclusionPanel';
import Sidebar from './Sidebar';
import MentorWidget from './MentorWidget';
import { LEARNING_BLOCKS } from './blocks';
import { useLearningFlow } from './useLearningFlow';

export interface LearningFlowAppProps {
  /**
   * Chamado quando o aluno escolhe "Sair da sala" no painel de controle
   * (`Sidebar`). Opcional: ausente quando `LearningFlowApp` roda standalone
   * (fora do app-shell — ex.: era a raiz direta de `App.tsx` até a Task 9),
   * caso em que o botão de saída simplesmente não aparece na sidebar.
   */
  readonly onExitClassroom?: () => void;
}

/**
 * Raiz da experiência de aprendizagem local (Estrutura de Bloco Pedagógico
 * Local): sucessora de `../terminal/TerminalApp.tsx` (Fase 1). Preserva a
 * mesma janela de terminal fullscreen já aprovada (titlebar com 3 pontos,
 * `.terminal-app`/`.terminal-window`) e, dentro dela, alterna uma etapa por
 * vez — Teoria -> Prática -> Avaliação -> Conclusão — via `useLearningFlow`.
 * O terminal (`TerminalScreen`) só é renderizado nas etapas
 * `practice`/`assessment`; nas demais, painéis de conteúdo ocupam o mesmo
 * espaço. Sidebar (painel de controle) e Mentor (dicas) são elementos
 * flutuantes fora do fluxo do documento, que não competem com o terminal.
 *
 * Desde a Task 9 (App Navigation v1), esta tela funciona como módulo interno
 * do shell (`../app-shell/AppShell.tsx`), que passa `onExitClassroom` para
 * devolver o aluno ao painel. Não há `onOpenControlPanel`: a sidebar já
 * gerencia sua própria visibilidade (aba de alternância sempre visível), não
 * precisa de um gatilho externo.
 */
function LearningFlowApp({ onExitClassroom }: LearningFlowAppProps) {
  const flow = useLearningFlow();

  const isPractical = flow.step === 'practice' || flow.step === 'assessment';

  return (
    <main className="terminal-app" aria-label="RootScoll aprendizagem em tela cheia">
      <section
        className={`terminal-window ${isPractical ? 'terminal-window--practical' : ''}`}
        aria-label="Bloco pedagógico atual"
      >
        <div className="terminal-titlebar" aria-hidden="true">
          <span />
          <span />
          <span />
          <strong>aluno@plena:~</strong>
        </div>

        <ProgressBar current={flow.progress.current} total={flow.progress.total} step={flow.step} />

        <div className="step-content">
          {flow.step === 'theory' && (
            <TheoryPanel theory={flow.block.theory} onStart={flow.startPractice} />
          )}

          {(flow.step === 'practice' || flow.step === 'assessment') && (
            <>
              <TerminalScreen
                lines={flow.terminal.lines}
                inputValue={flow.terminal.inputValue}
                onInputChange={flow.terminal.setInputValue}
                onSubmit={flow.terminal.submitCommand}
                prompt={flow.terminal.prompt}
              />
              {flow.step === 'assessment' && (
                <div className="assessment-banner" role="status">
                  <span className="assessment-banner__text">
                    {flow.block.assessment.successMessage}
                  </span>
                  <button
                    type="button"
                    className="assessment-banner__action"
                    onClick={flow.concludeAssessment}
                  >
                    Continuar →
                  </button>
                </div>
              )}
            </>
          )}

          {flow.step === 'conclusion' && (
            <ConclusionPanel
              block={flow.block}
              hasNextBlock={flow.hasNextBlock}
              finished={flow.finished}
              onNext={flow.goToNextBlock}
            />
          )}
        </div>
      </section>

      <Sidebar
        blocks={LEARNING_BLOCKS}
        currentBlockIndex={flow.progress.current - 1}
        step={flow.step}
        attemptCount={flow.attemptCount}
        onExitClassroom={onExitClassroom}
      />
      <MentorWidget hint={flow.mentorHint} visible={flow.step === 'practice'} />
    </main>
  );
}

export default LearningFlowApp;
