import { useState } from 'react';
import type { LearningBlock, LearningStep } from './types';
import { STEP_LABELS } from './step-labels';
import {
  IconChevronLeft,
  IconChevronRight,
  IconCheckCircle,
  IconTerminal,
  IconLock,
  IconLightbulb,
  IconAlertTriangle,
  IconUsers,
  IconArrowLeft,
} from '../app-shell/icons';

export interface SidebarProps {
  readonly blocks: readonly LearningBlock[];
  readonly currentBlockIndex: number;
  readonly step: LearningStep;
  readonly attemptCount: number;
  /** Ausente quando a sala roda fora do app-shell (ex.: standalone/testes). */
  readonly onExitClassroom?: () => void;
}

/**
 * Sidebar lateral direita, oculta/recolhível, cockpit de operação da aula.
 */
function Sidebar({ blocks, currentBlockIndex, step, attemptCount, onExitClassroom }: SidebarProps) {
  const [open, setOpen] = useState(false);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  function handleActionClick(actionName: string) {
    setActionFeedback(`Ação "${actionName}" executada.`);
    setTimeout(() => setActionFeedback(null), 3500);
  }

  return (
    <aside className={`sidebar ${open ? 'sidebar--open' : ''}`} aria-label="Painel de controle">
      <button
        type="button"
        className="sidebar__toggle"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-controls="learning-flow-sidebar-panel"
        title={open ? 'Recolher painel' : 'Expandir painel de controle'}
      >
        {open ? <IconChevronRight size={18} /> : <IconChevronLeft size={18} />}
      </button>

      <div className="sidebar__panel" id="learning-flow-sidebar-panel">
        <div className="sidebar__header">
          <h3 className="sidebar__title" style={{ margin: 0 }}>Cockpit da Aula</h3>
          <span className="badge badge--mint" style={{ fontSize: '10px' }}>Ativo</span>
        </div>

        {actionFeedback && (
          <div className="sidebar__toast" role="status">
            {actionFeedback}
          </div>
        )}

        <section className="sidebar__section">
          <h4 className="sidebar__section-title">Blocos da Trilha</h4>
          <ol className="sidebar__blocks">
            {blocks.map((block, index) => {
              const state =
                index < currentBlockIndex
                  ? 'done'
                  : index === currentBlockIndex
                    ? 'active'
                    : 'locked';

              return (
                <li key={block.id} className={`sidebar__block sidebar__block--${state}`}>
                  <span className="sidebar__block-icon">
                    {state === 'done' && <IconCheckCircle size={14} className="text-mint" />}
                    {state === 'active' && <IconTerminal size={14} className="text-cyan" />}
                    {state === 'locked' && <IconLock size={14} className="text-muted" />}
                  </span>
                  <span className="sidebar__block-title">{block.title}</span>
                </li>
              );
            })}
          </ol>
        </section>

        <section className="sidebar__section">
          <h4 className="sidebar__section-title">Progresso & Sessão</h4>
          <div className="sidebar__metric-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Etapa atual</span>
              <span className="badge badge--secondary" style={{ fontSize: '11px' }}>{STEP_LABELS[step]}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Tentativas realizadas</span>
              <strong style={{ fontSize: '13px', color: attemptCount > 2 ? 'var(--warning)' : 'var(--text-primary)' }}>
                {attemptCount} {attemptCount === 1 ? 'tentativa' : 'tentativas'}
              </strong>
            </div>
          </div>
        </section>

        <section className="sidebar__section">
          <h4 className="sidebar__section-title">Ações da Sala</h4>
          <div className="sidebar__actions">
            <button
              type="button"
              className="sidebar__action-btn"
              onClick={() => handleActionClick('Histórico de Comandos')}
            >
              <IconTerminal size={15} className="text-cyan" />
              <span>Histórico de comandos</span>
            </button>

            <button
              type="button"
              className="sidebar__action-btn"
              onClick={() => handleActionClick('Dicas da Etapa')}
            >
              <IconLightbulb size={15} className="text-amber" />
              <span>Dicas desbloqueadas</span>
            </button>

            <button
              type="button"
              className="sidebar__action-btn"
              onClick={() => handleActionClick('Consultar Mentor IA')}
            >
              <IconUsers size={15} className="text-mint" />
              <span>Dúvida ao Mentor IA</span>
            </button>

            <button
              type="button"
              className="sidebar__action-btn sidebar__action-btn--danger"
              onClick={() => handleActionClick('Reiniciar Exercício')}
            >
              <IconAlertTriangle size={15} />
              <span>Reiniciar exercício</span>
            </button>
          </div>
        </section>

        {onExitClassroom !== undefined && (
          <div className="sidebar__footer">
            <button type="button" className="sidebar__exit" onClick={onExitClassroom}>
              <IconArrowLeft size={16} />
              <span>Sair da sala de aula</span>
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}

export default Sidebar;
