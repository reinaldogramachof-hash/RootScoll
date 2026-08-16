import { useState } from 'react';
import type { LearningBlock, LearningStep } from './types';
import { STEP_LABELS } from './step-labels';

export interface SidebarProps {
  readonly blocks: readonly LearningBlock[];
  readonly currentBlockIndex: number;
  readonly step: LearningStep;
  readonly attemptCount: number;
  /** Ausente quando a sala roda fora do app-shell (ex.: standalone/testes). */
  readonly onExitClassroom?: () => void;
}

/**
 * Sidebar lateral direita, oculta/recolhível, painel de controle da operação
 * de aprendizado (App Navigation v1 — ver
 * `docs/product/app-navigation-v1.md`, seção "Menu lateral oculto da sala
 * Terminal"). Nasce recolhida (`open` começa `false`) e fica fixa fora do
 * fluxo de documento (`position: fixed`), sem afetar o layout do
 * `.terminal-window` nem competir com o terminal — só uma aba fina, sempre
 * visível, na borda direita, que o aluno pode abrir quando quiser.
 *
 * Implementa de verdade os itens com dado real disponível nesta fatia
 * (índice do bloco atual, progresso, tentativas, sair da sala). Os demais
 * itens planejados no documento de navegação (histórico de comandos, dicas
 * desbloqueadas, configurações do terminal, reiniciar exercício, dúvida ao
 * professor/mentor IA) aparecem como entradas estáticas "em breve" — dão a
 * forma final do menu sem fingir uma funcionalidade que ainda não existe
 * (nenhuma dessas 5 tem estado rastreado hoje).
 */
function Sidebar({ blocks, currentBlockIndex, step, attemptCount, onExitClassroom }: SidebarProps) {
  const [open, setOpen] = useState(false);

  return (
    <aside className={`sidebar ${open ? 'sidebar--open' : ''}`} aria-label="Painel de controle">
      <button
        type="button"
        className="sidebar__toggle"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-controls="learning-flow-sidebar-panel"
      >
        {open ? '›' : '‹'}
      </button>
      <div className="sidebar__panel" id="learning-flow-sidebar-panel">
        <h3 className="sidebar__title">Blocos</h3>
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
                {block.title}
              </li>
            );
          })}
        </ol>

        <h3 className="sidebar__title">Progresso</h3>
        <p className="sidebar__step">Etapa atual: {STEP_LABELS[step]}</p>
        <p className="sidebar__step">Tentativas nesta etapa: {attemptCount}</p>

        <h3 className="sidebar__title">Em breve</h3>
        <ul className="sidebar__planned">
          <li>Histórico de comandos</li>
          <li>Dicas desbloqueadas</li>
          <li>Configurações do terminal</li>
          <li>Reiniciar exercício</li>
          <li>Dúvida ao professor / mentor IA</li>
        </ul>

        {onExitClassroom !== undefined && (
          <button type="button" className="sidebar__exit" onClick={onExitClassroom}>
            ← Sair da sala
          </button>
        )}
      </div>
    </aside>
  );
}

export default Sidebar;
