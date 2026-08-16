import type { MockUser, Track } from './types';

export interface StudentDashboardProps {
  readonly user: MockUser;
  readonly currentTrack: Track | undefined;
  readonly onOpenTracks: () => void;
  readonly onOpenProfile: () => void;
  readonly onEnterClassroom: () => void;
}

/**
 * Painel do aluno — ponto central do fluxo pós-login. Sóbrio e denso, não
 * um mosaico de cards decorativos: uma seção de estado (trilha atual,
 * progresso) e uma lista de próximas ações, texto realista, sem números
 * inventados além do progresso mock já declarado em `MOCK_USER`.
 */
function StudentDashboard({
  user,
  currentTrack,
  onOpenTracks,
  onOpenProfile,
  onEnterClassroom,
}: StudentDashboardProps) {
  return (
    <div className="screen dashboard">
      <h1 className="screen__title">Olá, {user.name}</h1>
      <p className="screen__lead">
        Progresso geral: {user.overallProgress}%. Trilha atual:{' '}
        {currentTrack?.title ?? 'nenhuma selecionada'}.
      </p>

      <section className="dashboard__section">
        <h2 className="dashboard__section-title">Continuar aprendendo</h2>
        <p className="dashboard__section-text">
          {currentTrack?.status === 'available'
            ? `Retome a sala de aula de "${currentTrack.title}" de onde parou.`
            : 'Nenhuma trilha disponível ainda para prática guiada.'}
        </p>
        <button
          type="button"
          className="dashboard__action dashboard__action--primary"
          onClick={onEnterClassroom}
          disabled={currentTrack?.status !== 'available'}
        >
          Ir para a Sala Terminal →
        </button>
      </section>

      <section className="dashboard__section">
        <h2 className="dashboard__section-title">Explorar</h2>
        <div className="dashboard__actions">
          <button type="button" className="dashboard__action" onClick={onOpenTracks}>
            Ver trilhas e módulos
          </button>
          <button type="button" className="dashboard__action" onClick={onOpenProfile}>
            Ver meu perfil
          </button>
        </div>
      </section>
    </div>
  );
}

export default StudentDashboard;
