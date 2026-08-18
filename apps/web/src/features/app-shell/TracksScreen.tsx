import type { Track } from './types';
import { IconArrowLeft, IconTerminal, IconTarget, IconCheckCircle, IconChart } from './icons';

export interface TracksScreenProps {
  readonly tracks: readonly Track[];
  readonly onBack: () => void;
  readonly onEnterClassroom: () => void;
  readonly onSelectTrack?: (trackId: string) => void;
}

/**
 * Catálogo executivo local. A tela preserva as 6 macrotrilhas de navegação e
 * mostra sinais das trilhas granulares do currículo v2 sem criar rotas reais.
 */
function TracksScreen({ tracks, onBack, onEnterClassroom, onSelectTrack }: TracksScreenProps) {
  return (
    <div className="screen dashboard tracks-screen">
      <div className="screen__header dashboard__header">
        <div className="screen__title-wrap">
          <p className="screen__eyebrow">Catálogo de aprendizado</p>
          <h1 className="screen__title">Trilhas Formativas</h1>
        </div>
        <div className="teacher-dashboard__header-badge">
          <span className="badge badge--primary">6 macrotrilhas</span>
        </div>
      </div>

      <p className="screen__lead" style={{ marginBottom: '24px' }}>
        Navegação executiva em seis áreas, com aprofundamento interno orientado pelo currículo Zero
        to Junior v2.
      </p>

      <ul className="tracks-screen__list">
        {tracks.map((track) => (
          <li key={track.id} className={`card track-row track-row--${track.status}`}>
            <div className="track-row__header">
              <div>
                <span className="track-row__phase text-mint">{track.phase}</span>
                <h2 className="track-row__title" style={{ fontSize: '18px', marginBottom: '4px' }}>{track.title}</h2>
              </div>
              <span className={`badge badge--${track.status === 'available' ? 'mint' : 'secondary'}`}>
                {track.status === 'available' ? 'Disponível' : 'Em breve'}
              </span>
            </div>

            <p className="track-row__description" style={{ marginBottom: '16px' }}>{track.description}</p>

            <div className="track-row__progress-wrap" style={{ marginBottom: '16px' }}>
              <div className="classroom-card__progress-label">
                <span>Progresso</span>
                <strong>
                  <IconChart size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} className="text-mint" />
                  {track.progress}%
                </strong>
              </div>
              <div className="dashboard__meter" aria-hidden="true">
                <span style={{ width: `${track.progress}%` }} />
              </div>
            </div>

            <h3 style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '8px' }}>Competências</h3>
            <ul className="dashboard__chips" style={{ marginBottom: '16px' }}>
              {track.competencies.map((competency) => (
                <li key={competency} className="dashboard__chip--validated">
                  <IconCheckCircle size={14} style={{ marginRight: '6px' }} />
                  {competency}
                </li>
              ))}
            </ul>

            <div className="track-row__evidence-box" style={{ background: 'rgba(255, 171, 0, 0.08)', border: '1px solid rgba(255, 171, 0, 0.2)', padding: '12px', borderRadius: 'var(--radius-md)', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
                <IconTarget size={16} className="text-amber" style={{ marginRight: '6px' }} />
                <strong className="text-amber" style={{ fontSize: '12px' }}>Evidência Esperada</strong>
              </div>
              <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)' }}>{track.evidence}</p>
            </div>

            <h3 style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '8px' }}>Módulos</h3>
            <ul className="track-row__modules">
              {track.modules.map((module) => (
                <li key={module.id} className={`track-module track-module--${module.status}`}>
                  <span className="badge badge--secondary" style={{ marginRight: '8px' }}>{module.mode}</span>
                  {module.title}
                </li>
              ))}
            </ul>

            {track.status === 'available' && (
              <div style={{ marginTop: '20px', display: 'flex', gap: '12px' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => onSelectTrack && onSelectTrack(track.id)}
                >
                  Ver Módulos & Lições
                </button>
                <button type="button" className="btn btn-primary btn-primary--glow" onClick={onEnterClassroom}>
                  <IconTerminal size={18} style={{ marginRight: '8px' }} />
                  Entrar na Sala Terminal
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>

      <div style={{ marginTop: '24px' }}>
        <button type="button" className="btn btn-secondary" onClick={onBack}>
          <IconArrowLeft size={16} style={{ marginRight: '8px' }} />
          Voltar ao painel
        </button>
      </div>
    </div>
  );
}

export default TracksScreen;
