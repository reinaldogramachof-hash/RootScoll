import { useState } from 'react';
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
  IconShieldCheck,
  IconCoins,
  IconZap,
  IconHistory,
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

function getIntegrityLevelBadge(score: number) {
  if (score >= 900) {
    return (
      <span className="badge badge--mint" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px' }}>
        🩵 Excelente (Top Talent)
      </span>
    );
  }
  if (score >= 800) {
    return (
      <span className="badge badge--cyan" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px' }}>
        🟩 Bom
      </span>
    );
  }
  if (score >= 600) {
    return (
      <span className="badge badge--amber" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px' }}>
        🟧 Em Atenção
      </span>
    );
  }
  return (
    <span className="badge badge--danger" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px' }}>
      🟥 Crítico
    </span>
  );
}

/**
 * Painel do aluno: cockpit local pós-login, sem persistência real. Mostra a
 * rota até a Sala Terminal, score de integridade e gamificação de produtos.
 */
function StudentDashboard({
  user,
  currentTrack,
  onOpenTracks: _onOpenTracks,
  onOpenProfile: _onOpenProfile,
  onEnterClassroom,
}: StudentDashboardProps) {
  const [showIntegrityModal, setShowIntegrityModal] = useState(false);

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

      {/* Seção Principal de Gamificação & Integridade */}
      <section className="dashboard__section integrity-card" style={{ marginBottom: '24px', background: 'var(--bg-surface-elevated, #161b22)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <IconShieldCheck size={20} className="text-mint" />
              <h2 className="dashboard__section-title" style={{ margin: 0, fontSize: '18px' }}>Garantia de Integridade & Reputação</h2>
            </div>
            <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-muted)' }}>
              Sua pontuação é visível para as empresas parceiras no Painel de Talentos. Mantenha as boas práticas no modo F11 para destacar seu perfil.
            </p>
          </div>

          <button
            type="button"
            className="btn btn-secondary btn--sm"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            onClick={() => setShowIntegrityModal(true)}
          >
            <IconHistory size={14} />
            Ver Extrato Completo
          </button>
        </div>

        <div className="dashboard__metrics" style={{ margin: 0, gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
          <div className="dashboard__metric" style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(0,255,200,0.15)' }}>
            <div className="metric-header-row">
              <span className="dashboard__metric-label">Score de Confiança</span>
              <IconShieldCheck size={16} className="text-mint" />
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
              <strong style={{ fontSize: '24px', color: 'var(--color-mint, #00ffd0)' }}>{user.integrityScore ?? 980}</strong>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>/ 1000 pts</span>
            </div>
            <div style={{ marginTop: '6px' }}>
              {getIntegrityLevelBadge(user.integrityScore ?? 980)}
            </div>
          </div>

          <div className="dashboard__metric" style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,200,0,0.15)' }}>
            <div className="metric-header-row">
              <span className="dashboard__metric-label">Moedas Virtuais</span>
              <IconCoins size={16} className="text-amber" />
            </div>
            <strong style={{ fontSize: '24px', color: '#ffc107' }}>🪙 {user.coins ?? 450}</strong>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Recompensas por disciplina</span>
          </div>

          <div className="dashboard__metric" style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(0,200,255,0.15)' }}>
            <div className="metric-header-row">
              <span className="dashboard__metric-label">Experiência (XP)</span>
              <IconZap size={16} className="text-cyan" />
            </div>
            <strong style={{ fontSize: '24px', color: '#00d8ff' }}>⚡ {user.xp ?? 1250} XP</strong>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Evolução pedagógica</span>
          </div>
        </div>
      </section>

      {/* Métricas pedagógicas legadas */}
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

      {/* Modal de Extrato de Integridade */}
      {showIntegrityModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="integrity-modal-title"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(5, 8, 17, 0.88)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            padding: '20px',
            boxSizing: 'border-box',
          }}
          onClick={() => setShowIntegrityModal(false)}
        >
          <div
            style={{
              maxWidth: '620px',
              width: '100%',
              maxHeight: '85vh',
              display: 'flex',
              flexDirection: 'column',
              padding: '28px',
              borderRadius: '16px',
              background: 'var(--bg-surface-elevated, #161b22)',
              border: '1px solid rgba(0, 255, 200, 0.2)',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6), 0 0 30px rgba(0, 255, 200, 0.08)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <IconShieldCheck size={24} className="text-mint" />
                <h3 id="integrity-modal-title" style={{ margin: 0, fontSize: '20px', fontWeight: 600, color: '#fff' }}>
                  Extrato de Integridade & Transparência
                </h3>
              </div>
              <button
                type="button"
                className="btn btn-secondary btn--sm"
                style={{ padding: '4px 12px', fontSize: '13px' }}
                onClick={() => setShowIntegrityModal(false)}
              >
                ✕ Fechar
              </button>
            </div>

            <p style={{ fontSize: '13px', color: 'var(--text-muted, #8b949e)', marginBottom: '20px', lineHeight: '1.5' }}>
              Abaixo estão os registros detalhados das suas ações de disciplina, boas práticas no modo F11 imersivo e sinalizações de integridade computadas pelo sistema anti-cheat.
            </p>

            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', paddingRight: '6px', marginBottom: '20px' }}>
              {(user.integrityLogs ?? []).map((log) => (
                <div
                  key={log.id}
                  style={{
                    padding: '14px 16px',
                    borderRadius: '10px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: `1px solid ${log.type === 'gain' ? 'rgba(0, 255, 200, 0.2)' : 'rgba(255, 80, 80, 0.25)'}`,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '12px',
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                      <strong style={{ fontSize: '14px', color: '#fff', fontWeight: 600 }}>{log.action}</strong>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted, #8b949e)' }}>{log.date}</span>
                    </div>
                    <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted, #8b949e)', lineHeight: '1.4' }}>{log.reason}</p>
                  </div>
                  <span
                    style={{
                      fontWeight: 700,
                      fontSize: '15px',
                      color: log.type === 'gain' ? '#00ffd0' : '#ff5555',
                      padding: '4px 10px',
                      borderRadius: '6px',
                      background: log.type === 'gain' ? 'rgba(0, 255, 208, 0.12)' : 'rgba(255, 85, 85, 0.12)',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {log.change > 0 ? `+${log.change}` : log.change} pts
                  </span>
                </div>
              ))}
            </div>

            <div style={{ paddingTop: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-muted, #8b949e)' }}>
                🔒 Seu Score atual é compartilhado com recrutadores parceiros.
              </span>
              <button
                type="button"
                className="btn btn-primary"
                style={{ padding: '8px 20px' }}
                onClick={() => setShowIntegrityModal(false)}
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StudentDashboard;
