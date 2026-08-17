import type { MockUser, Track } from './types';

export interface StudentDashboardProps {
  readonly user: MockUser;
  readonly currentTrack: Track | undefined;
  readonly onOpenTracks: () => void;
  readonly onOpenProfile: () => void;
  readonly onEnterClassroom: () => void;
}

/**
 * Painel do aluno: cockpit local pos-login, sem persistencia real. Mostra a
 * rota ate a Sala Terminal e os sinais pedagogicos necessarios para a proxima
 * lapidacao de produto.
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

  return (
    <div className="screen dashboard">
      <header className="screen__header dashboard__header">
        <div className="screen__title-wrap">
          <p className="screen__eyebrow">{user.currentPhase}</p>
          <h1 className="screen__title">Olá, {user.name}</h1>
        </div>

        <button
          type="button"
          className="dashboard__action dashboard__action--primary dashboard__action--header"
          onClick={onEnterClassroom}
          disabled={currentTrack?.status !== 'available'}
        >
          Entrar na Sala Terminal
        </button>
      </header>

      <div className="dashboard__metrics" aria-label="Resumo de progresso">
        <div className="dashboard__metric">
          <span className="dashboard__metric-label">Progresso geral</span>
          <strong>{user.overallProgress}%</strong>
          <span className="dashboard__meter" aria-hidden="true">
            <span style={{ width: `${user.overallProgress}%` }} />
          </span>
        </div>
        <div className="dashboard__metric">
          <span className="dashboard__metric-label">Trilha atual</span>
          <strong>{currentTrack?.progress ?? 0}%</strong>
          <span className="dashboard__meter" aria-hidden="true">
            <span style={{ width: `${currentTrack?.progress ?? 0}%` }} />
          </span>
        </div>
        <div className="dashboard__metric dashboard__metric--accent">
          <span className="dashboard__metric-label">Evidencias</span>
          <strong>{user.evidenceCount}</strong>
          <span>registros locais</span>
        </div>
      </div>

      <div className="dashboard__grid">
        <section className="dashboard__section dashboard__section--primary">
          <div>
            <p className="dashboard__section-eyebrow">Trilha atual</p>
            <h2 className="dashboard__section-title">
              {currentTrack?.title ?? 'Nenhuma trilha selecionada'}
            </h2>
            <p className="dashboard__section-text">
              {currentTrack?.status === 'available'
                ? `Foco desta retomada: ${user.currentCompetency}. Sequencia atual: teoria curta, pratica guiada e avaliacao no terminal.`
                : 'Nenhuma trilha disponivel ainda para pratica guiada.'}
            </p>
          </div>
        </section>

        <section className="dashboard__section dashboard__section--secondary">
          <h2 className="dashboard__section-title">Competencias em construcao</h2>
          <ul className="dashboard__chips">
            {currentTrack?.competencies.map((competency) => (
              <li key={competency}>{competency}</li>
            ))}
          </ul>
        </section>

        <section className="dashboard__section">
          <h2 className="dashboard__section-title">Proximos blocos</h2>
          <ol className="dashboard__timeline">
            {nextModules.map((module) => (
              <li key={module.id}>
                <span>{module.mode}</span>
                <strong>{module.title}</strong>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </div>
  );
}

export default StudentDashboard;
