import type { Track } from './types';

export interface TracksScreenProps {
  readonly tracks: readonly Track[];
  readonly onBack: () => void;
  readonly onEnterClassroom: () => void;
}

/**
 * Catálogo executivo local. A tela preserva as 6 macrotrilhas de navegação e
 * mostra sinais das trilhas granulares do curriculo v2 sem criar rotas reais.
 */
function TracksScreen({ tracks, onBack, onEnterClassroom }: TracksScreenProps) {
  return (
    <div className="screen tracks-screen">
      <div className="screen__header">
        <div>
          <p className="screen__eyebrow">Catalogo de aprendizado</p>
          <h1 className="screen__title">Trilhas</h1>
        </div>
        <span className="screen__status">6 macrotrilhas</span>
      </div>

      <p className="screen__lead">
        Navegação executiva em seis áreas, com aprofundamento interno orientado pelo currículo Zero
        to Junior v2.
      </p>

      <ul className="tracks-screen__list">
        {tracks.map((track) => (
          <li key={track.id} className={`track-row track-row--${track.status}`}>
            <div className="track-row__header">
              <div>
                <span className="track-row__phase">{track.phase}</span>
                <h2 className="track-row__title">{track.title}</h2>
              </div>
              <span className={`track-row__status track-row__status--${track.status}`}>
                {track.status === 'available' ? 'Disponivel' : 'Em breve'}
              </span>
            </div>

            <p className="track-row__description">{track.description}</p>

            <div className="track-row__progress" aria-label={`Progresso de ${track.title}`}>
              <span>
                <strong>{track.progress}%</strong> concluido
              </span>
              <span className="dashboard__meter" aria-hidden="true">
                <span style={{ width: `${track.progress}%` }} />
              </span>
            </div>

            <ul className="track-row__competencies">
              {track.competencies.map((competency) => (
                <li key={competency}>{competency}</li>
              ))}
            </ul>

            <p className="track-row__evidence">{track.evidence}</p>

            <ul className="track-row__modules">
              {track.modules.map((module) => (
                <li key={module.id} className={`track-module track-module--${module.status}`}>
                  <span>{module.mode}</span>
                  {module.title}
                </li>
              ))}
            </ul>

            {track.status === 'available' && (
              <button type="button" className="track-row__action" onClick={onEnterClassroom}>
                Entrar na Sala Terminal
              </button>
            )}
          </li>
        ))}
      </ul>

      <button type="button" className="screen__back" onClick={onBack}>
        Voltar ao painel
      </button>
    </div>
  );
}

export default TracksScreen;
