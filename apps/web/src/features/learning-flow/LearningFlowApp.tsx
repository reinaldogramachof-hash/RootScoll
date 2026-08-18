import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import '../../styles/app.css';
import TerminalScreen from '../terminal/TerminalScreen';
import ProgressBar from './ProgressBar';
import TheoryPanel from './TheoryPanel';
import ConclusionPanel from './ConclusionPanel';
import Sidebar from './Sidebar';
import MentorWidget from './MentorWidget';
import { LEARNING_BLOCKS } from './blocks';
import { useLearningFlow } from './useLearningFlow';
import { IconShieldCheck, IconAlertTriangle, IconTerminal, IconFocusMode } from '../app-shell/icons';

export interface LearningFlowAppProps {
  /**
   * Chamado quando o aluno escolhe "Sair da sala" no painel de controle (`Sidebar`).
   */
  readonly onExitClassroom?: () => void;
}

function LearningFlowApp({ onExitClassroom }: LearningFlowAppProps) {
  const { lessonId } = useParams<{ lessonId?: string }>();
  const initialIndex = lessonId ? Math.max(0, LEARNING_BLOCKS.findIndex((b) => b.id === lessonId)) : 0;
  const flow = useLearningFlow(initialIndex >= 0 ? initialIndex : 0);

  const isPractical = flow.step === 'practice' || flow.step === 'assessment';

  // Controle de Integridade & Modo Foco (Proctoring)
  const [preflightPassed, setPreflightPassed] = useState(false);
  const [focusBlocked, setFocusBlocked] = useState(false);
  const [infractionCount, setInfractionCount] = useState(0);

  // Função para solicitar Tela Cheia ao navegador
  const requestFullScreenMode = useCallback(async () => {
    try {
      if (!document.fullscreenElement && document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
      }
    } catch {
      // Ignorar erros de rejeição de permissão se o navegador restringir
    }
  }, []);

  const handleStartFocusMode = async () => {
    await requestFullScreenMode();
    setPreflightPassed(true);
    setFocusBlocked(false);
  };

  const handleRestoreFocusMode = async () => {
    await requestFullScreenMode();
    setFocusBlocked(false);
  };

  // Detector de Quebra de Regra (Saída de tela cheia, troca de aba ou desfoco)
  const handleFocusLoss = useCallback(() => {
    if (!isPractical || !preflightPassed) return;

    setInfractionCount((prev) => {
      const nextCount = prev + 1;

      // Na 1ª infração: Reiniciar o exercício por segurança de integridade
      if (nextCount === 1) {
        flow.restartBlock();
      }

      return nextCount;
    });

    setFocusBlocked(true);
  }, [isPractical, preflightPassed, flow]);

  useEffect(() => {
    if (!isPractical || !preflightPassed) return;

    const onFullScreenChange = () => {
      if (!document.fullscreenElement) {
        handleFocusLoss();
      }
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        handleFocusLoss();
      }
    };

    const onWindowBlur = () => {
      handleFocusLoss();
    };

    document.addEventListener('fullscreenchange', onFullScreenChange);
    document.addEventListener('visibilitychange', onVisibilityChange);
    window.addEventListener('blur', onWindowBlur);

    return () => {
      document.removeEventListener('fullscreenchange', onFullScreenChange);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      window.removeEventListener('blur', onWindowBlur);
    };
  }, [isPractical, preflightPassed, handleFocusLoss]);

  // Se trocar de bloco ou voltar para teoria, resetar preflight
  useEffect(() => {
    if (!isPractical) {
      setPreflightPassed(false);
      setFocusBlocked(false);
    }
  }, [isPractical]);

  return (
    <main
      className={`terminal-app ${isPractical ? 'focus-mode-protected' : ''}`}
      aria-label="RootScoll aprendizagem em tela cheia"
      onContextMenu={isPractical ? (e) => e.preventDefault() : undefined}
      onCopy={isPractical ? (e) => e.preventDefault() : undefined}
      onPaste={isPractical ? (e) => e.preventDefault() : undefined}
    >
      <section
        className={`terminal-window ${isPractical ? 'terminal-window--practical' : ''}`}
        aria-label="Bloco pedagógico atual"
      >
        <div className="terminal-titlebar" aria-hidden="true">
          <span />
          <span />
          <span />
          <strong>aluno@plena:~</strong>

          {isPractical && (
            <div
              className={`focus-indicator-badge ${preflightPassed && !focusBlocked ? 'focus-indicator-badge--active' : ''}`}
              title="Modo Foco em Tela Cheia Ativo"
            >
              <span className="focus-indicator-badge__pulse" />
              <IconFocusMode size={14} className="focus-indicator-badge__icon" />
              <span>Modo Foco {preflightPassed && !focusBlocked ? 'Ativo' : 'Pausado'}</span>
            </div>
          )}
        </div>

        <ProgressBar current={flow.progress.current} total={flow.progress.total} step={flow.step} />

        <div className="step-content">
          {flow.step !== 'conclusion' && (
            <>
              {/* Modal de Pré-requisito de Foco (Tela Cheia) */}
              {isPractical && !preflightPassed && (
                <div className="focus-modal-overlay">
                  <div className="focus-modal">
                    <div className="focus-modal__icon focus-modal__icon--primary">
                      <IconShieldCheck size={36} />
                    </div>
                    <h3 className="focus-modal__title">Ambiente de Prática de Foco Total</h3>
                    <p className="focus-modal__description">
                      Esta etapa avaliativa exige <strong>tela cheia contínua</strong>. Uso de abas secundárias, IAs externas ou divisão de tela não são permitidos.
                    </p>
                    <div className="focus-modal__callout">
                      💡 <em>Sua pontuação de integridade fica visível para os recrutadores parceiros. Pontuações elevadas aceleram contratações!</em>
                    </div>
                    <button
                      type="button"
                      className="btn-primary btn-primary--glow focus-modal__action"
                      onClick={handleStartFocusMode}
                    >
                      <IconTerminal size={18} style={{ marginRight: 8 }} />
                      Ativar Modo Foco (Tela Cheia) & Iniciar
                    </button>
                  </div>
                </div>
              )}

              {/* Modal de Bloqueio de Infração */}
              {isPractical && preflightPassed && focusBlocked && (
                <div className="focus-modal-overlay">
                  <div className="focus-modal focus-modal--warning">
                    <div className="focus-modal__icon focus-modal__icon--warning">
                      <IconAlertTriangle size={36} />
                    </div>
                    <h3 className="focus-modal__title">
                      {infractionCount === 1 ? 'Quebra de Foco Detectada!' : `Infração #${infractionCount}: Tutor Notificado`}
                    </h3>
                    <p className="focus-modal__description">
                      {infractionCount === 1
                        ? 'Você saiu do modo de tela cheia ou trocou de janela. Por regras de integridade, seu exercício foi REINICIADO.'
                        : 'Atenção extrema: Foi emitida uma notificação de inconformidade didática ao Tutor Responsável. Sua pontuação de integridade foi adjusted (-50 pts).'}
                    </p>
                    <div className="focus-modal__stats">
                      <span className="badge badge--warning">Total de Infrações: {infractionCount}</span>
                      <span className="badge badge--error">Alerta ao Tutor: {infractionCount >= 2 ? 'ENVIADO' : 'PENDENTE'}</span>
                    </div>
                    <button
                      type="button"
                      className="btn-primary focus-modal__action"
                      onClick={handleRestoreFocusMode}
                    >
                      Reestabelecer Foco (Tela Cheia)
                    </button>
                  </div>
                </div>
              )}

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
