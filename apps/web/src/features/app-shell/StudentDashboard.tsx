import type { MockUser, Track } from './types';
import {
  IconChart,
  IconTrendingUp,
  IconFileText,
  IconTerminal,
  IconCheckCircle,
  IconTarget,
  IconLightbulb,
  IconAward,
  IconChevronRight,
} from './icons';

export interface StudentDashboardProps {
  readonly user: MockUser;
  readonly currentTrack: Track | undefined;
  readonly onOpenTracks: () => void;
  readonly onOpenProfile: () => void;
  readonly onEnterClassroom: () => void;
}

function getModuleIcon(mode: string) {
  switch (mode) {
    case 'teoria':
      return <IconFileText size={16} className="text-cyan" />;
    case 'pratica':
      return <IconTerminal size={16} className="text-mint" />;
    case 'avaliacao':
      return <IconAward size={16} className="text-amber" />;
    default:
      return <IconLightbulb size={16} className="text-muted" />;
  }
}

/**
 * Painel do aluno: cockpit local pós-login, sem persistência real. Mostra a
 * rota até a Sala Terminal e os sinais pedagógicos necessários para a próxima
 * lapidação de produto.
 */
function StudentDashboard({
  user,
  currentTrack,
  onOpenTracks: _onOpenTracks,
  onOpenProfile: _onOpenProfile,
  onEnterClassroom,
}: StudentDashboardProps) {
  const availableModules =
    currentTrack?.modules.filter((module) => module.status === 'available') ?? [];
  const nextModules = availableModules.slice(0, 4);

  const completedCompetenciesCount = Math.ceil(
    ((currentTrack?.competencies.length ?? 0) * (currentTrack?.progress ?? 0)) / 100,
  );

  return (
    <div className="screen dashboard student-dashboard">
      <header className="screen__header dashboard__header">
        <div className="screen__title-wrap">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <p className="screen__eyebrow" style={{ margin: 0 }}>{user.currentPhase}</p>
            <span
              className="badge badge--mint"
              style={{ fontSize: '10px', display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '2px 6px' }}
              title="Para máxima imersão e integridade, use a plataforma em tela cheia"
            >
              <kbd style={{ background: 'rgba(0,0,0,0.2)', padding: '0 3px', borderRadius: '2px', fontFamily: 'monospace' }}>F11</kbd>
              Imersão Reativa
            </span>
          </div>
          <h1 className="screen__title">Olá, {user.name}</h1>
        </div>

        <button
          type="button"
          className="dashboard__action dashboard__action--primary dashboard__action--header btn-primary--glow"
          onClick={onEnterClassroom}
          disabled={currentTrack?.status !== 'available'}
        >
          <IconTerminal size={18} style={{ marginRight: 8, display: 'inline-block' }} />
          Entrar na Sala Terminal
        </button>
      </header>

      <div className="dashboard__metrics" aria-label="Resumo de progresso">
        <div className="dashboard__metric">
          <div className="metric-header-row">
            <span className="dashboard__metric-label">Progresso geral</span>
            <IconChart size={16} className="metric-icon text-mint" />
          </div>
          <strong>{user.overallProgress}%</strong>
          <span className="dashboard__meter" aria-hidden="true">
            <span style={{ width: `${user.overallProgress}%` }} />
          </span>
        </div>
        <div className="dashboard__metric">
          <div className="metric-header-row">
            <span className="dashboard__metric-label">Trilha atual</span>
            <IconTrendingUp size={16} className="metric-icon text-cyan" />
          </div>
          <strong>{currentTrack?.progress ?? 0}%</strong>
          <span className="dashboard__meter" aria-hidden="true">
            <span style={{ width: `${currentTrack?.progress ?? 0}%` }} />
          </span>
        </div>
        <div className="dashboard__metric dashboard__metric--accent">
          <div className="metric-header-row">
            <span className="dashboard__metric-label">Evidências</span>
            <IconFileText size={16} className="metric-icon text-amber" />
          </div>
          <strong>{user.evidenceCount}</strong>
          <span>registros locais validados</span>
        </div>
      </div>

      <div className="dashboard__grid">
        <section className="dashboard__section dashboard__section--primary">
          <div className="dashboard__section-header-wrap">
            <p className="dashboard__section-eyebrow">Trilha em Andamento</p>
            <h2 className="dashboard__section-title" style={{ fontSize: '20px', marginBottom: '8px' }}>
              {currentTrack?.title ?? 'Nenhuma trilha selecionada'}
            </h2>
            <p className="dashboard__section-text" style={{ marginBottom: '16px' }}>
              {currentTrack?.status === 'available'
                ? `Foco desta retomada: ${user.currentCompetency}. Sequência atual: teoria curta, prática guiada e avaliação no terminal.`
                : 'Nenhuma trilha disponível ainda para prática guiada.'}
            </p>
          </div>

          {currentTrack && (
            <div className="dashboard__section-progress-card">
              <div className="classroom-card__progress-label">
                <span>Progresso da Trilha</span>
                <strong>{currentTrack.progress}%</strong>
              </div>
              <div className="dashboard__meter" aria-hidden="true" style={{ marginBottom: '16px' }}>
                <span style={{ width: `${currentTrack.progress}%` }} />
              </div>

              <button
                type="button"
                className="btn btn-primary btn--block btn-primary--glow"
                onClick={onEnterClassroom}
                disabled={currentTrack.status !== 'available'}
              >
                <IconTerminal size={16} style={{ marginRight: 8 }} />
                Continuar Prática Guiada
              </button>
            </div>
          )}
        </section>

        <section className="dashboard__section dashboard__section--secondary">
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h2 className="dashboard__section-title">Competências</h2>
              <span className="badge badge--mint">{completedCompetenciesCount}/{currentTrack?.competencies.length ?? 0} Dominadas</span>
            </div>
            <ul className="dashboard__chips">
              {currentTrack?.competencies.map((competency, idx) => {
                const isValidated = idx < completedCompetenciesCount;
                return (
                  <li
                    key={competency}
                    className={isValidated ? 'dashboard__chip--validated' : 'dashboard__chip--pending'}
                  >
                    {isValidated ? (
                      <IconCheckCircle size={14} style={{ marginRight: 6 }} />
                    ) : (
                      <IconTarget size={14} style={{ marginRight: 6 }} />
                    )}
                    {competency}
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        <section className="dashboard__section" style={{ gridColumn: '1 / -1' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <h2 className="dashboard__section-title" style={{ fontSize: '18px' }}>Próximos Blocos de Aprendizagem</h2>
              <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-muted)' }}>
                Siga a sequência pedagógica para avançar na trilha ativa
              </p>
            </div>
            <span className="badge badge--secondary">{nextModules.length} blocos prontos</span>
          </div>

          <ol className="dashboard__timeline">
            {nextModules.map((module, idx) => (
              <li key={module.id} className="dashboard__timeline-item">
                <div className="dashboard__timeline-step-badge">{idx + 1}</div>
                <div className="dashboard__timeline-icon">
                  {getModuleIcon(module.mode)}
                </div>
                <div className="dashboard__timeline-content">
                  <div className="dashboard__timeline-meta">
                    <span className="badge badge--secondary" style={{ textTransform: 'capitalize' }}>{module.mode}</span>
                  </div>
                  <strong className="dashboard__timeline-title">{module.title}</strong>
                </div>
                <button
                  type="button"
                  className="btn btn-secondary btn--sm dashboard__timeline-action"
                  onClick={onEnterClassroom}
                  disabled={module.status !== 'available'}
                >
                  Iniciar <IconChevronRight size={14} style={{ marginLeft: 4 }} />
                </button>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </div>
  );
}

export default StudentDashboard;
