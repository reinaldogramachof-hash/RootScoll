import type { Track } from './types';

export interface TracksScreenProps {
  readonly tracks: readonly Track[];
  readonly onBack: () => void;
  readonly onEnterClassroom: () => void;
}

/**
 * Catálogo local de trilhas e módulos — lista densa, não um mosaico de
 * cards. Só a trilha com módulos `available` permite entrar na Sala
 * Terminal; as demais aparecem como "em breve", sem prometer datas ou
 * números que não existem.
 */
function TracksScreen({ tracks, onBack, onEnterClassroom }: TracksScreenProps) {
  return (
    <div className="screen tracks-screen">
      <h1 className="screen__title">Trilhas</h1>

      <ul className="tracks-screen__list">
        {tracks.map((track) => (
          <li key={track.id} className={`track-row track-row--${track.status}`}>
            <div className="track-row__header">
              <span className="track-row__title">{track.title}</span>
              <span className={`track-row__status track-row__status--${track.status}`}>
                {track.status === 'available' ? 'Disponível' : 'Em breve'}
              </span>
            </div>
            <p className="track-row__description">{track.description}</p>
            <ul className="track-row__modules">
              {track.modules.map((module) => (
                <li key={module.id} className={`track-module track-module--${module.status}`}>
                  {module.title}
                </li>
              ))}
            </ul>
            {track.status === 'available' && (
              <button type="button" className="track-row__action" onClick={onEnterClassroom}>
                Entrar na Sala Terminal →
              </button>
            )}
          </li>
        ))}
      </ul>

      <button type="button" className="screen__back" onClick={onBack}>
        ← Voltar ao painel
      </button>
    </div>
  );
}

export default TracksScreen;
