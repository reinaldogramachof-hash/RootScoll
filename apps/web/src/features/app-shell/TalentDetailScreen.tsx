import { useState } from 'react';
import type { MockTalentProfile } from './types';
import { IconArrowLeft, IconShieldCheck, IconCheckCircle, IconFileText } from './icons';

export interface TalentDetailScreenProps {
  readonly talent: MockTalentProfile;
  readonly onBack: () => void;
}

/**
 * Tela de detalhe aprofundado do perfil de um talento do ecossistema RootScoll.
 * Exibe competências comprovadas no terminal, portfólio de evidências e ações de recrutamento.
 */
function TalentDetailScreen({ talent, onBack }: TalentDetailScreenProps) {
  const [shortlisted, setShortlisted] = useState(false);
  const [invited, setInvited] = useState(false);

  return (
    <div className="screen talent-detail-screen">
      <header className="screen__header">
        <div>
          <button type="button" className="btn btn-secondary btn--sm" onClick={onBack}>
            <IconArrowLeft size={16} style={{ marginRight: 6 }} />
            Voltar para Busca de Talentos
          </button>
          <div className="screen__title-wrap" style={{ marginTop: '0.75rem' }}>
            <p className="screen__eyebrow">Ecossistema RootScoll • {talent.currentPhase}</p>
            <h1 className="screen__title">{talent.name}</h1>
            <p className="talent-detail__headline">{talent.headline}</p>
            <span className="talent-detail__location">📍 {talent.location}</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <div className="talent-detail__score-badge card">
            <span className="score-badge__title">Score de Prontidão</span>
            <strong className="score-badge__number">{talent.readinessScore}%</strong>
            <span className="badge badge--primary">{talent.availability}</span>
          </div>

          <div className="talent-detail__score-badge card">
            <span className="score-badge__title" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <IconShieldCheck size={14} className="text-mint" />
              Score de Integridade
            </span>
            <strong className="score-badge__number text-mint">
              {talent.integrityScore ?? 980} <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 'normal' }}>/1000</span>
            </strong>
            <span className="badge badge--mint" style={{ textTransform: 'capitalize' }}>
              🩵 {talent.integrityLevel ?? 'excelente'}
            </span>
          </div>
        </div>
      </header>

      <div className="talent-detail__layout">
        {/* Coluna Principal */}
        <div className="talent-detail__main">
          {/* Apresentação & Perfil */}
          <section className="card talent-detail__section">
            <h2 className="talent-detail__section-title">Resumo do Desenvolvedor</h2>
            <p className="talent-detail__bio">{talent.bio}</p>

            <h3 className="talent-detail__sub-title">Principais Competências Comprovadas</h3>
            <div className="talent-detail__chips">
              {talent.topSkills.map((skill) => (
                <span key={skill} className="badge badge--secondary">
                  {skill}
                </span>
              ))}
            </div>
          </section>

          {/* Progresso por Trilha */}
          <section className="card talent-detail__section">
            <h2 className="talent-detail__section-title">Progresso nas Macrotrilhas</h2>
            <div className="talent-detail__tracks-list">
              {talent.trackProgresses.map((tp) => (
                <div key={tp.trackId} className="talent-track-progress">
                  <div className="talent-track-progress__header">
                    <span>{tp.title}</span>
                    <strong>{tp.progress}%</strong>
                  </div>
                  <div className="dashboard__meter" aria-hidden="true">
                    <span style={{ width: `${tp.progress}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Dossiê de Evidências */}
          <section className="card talent-detail__section">
            <div className="talent-detail__section-header">
              <div>
                <h2 className="talent-detail__section-title">Dossiê de Evidências Práticas</h2>
                <p className="talent-detail__section-desc">
                  Projetos, scripts e laboratórios resolvidos com verificação determinística de
                  integridade.
                </p>
              </div>
              <span className="badge badge--accent">{talent.evidenceCount} Registros</span>
            </div>

            <div className="talent-evidence-list">
              {talent.evidences.map((ev, index) => (
                <article key={index} className="talent-evidence-card">
                  <div className="talent-evidence-card__header">
                    <span className="evidence-tag">{ev.track}</span>
                    <span className="evidence-date">{ev.date}</span>
                  </div>
                  <h3 className="talent-evidence-card__title">{ev.title}</h3>
                  <p className="talent-evidence-card__desc">{ev.description}</p>
                </article>
              ))}
            </div>
          </section>
        </div>

        {/* Coluna Lateral de Ações do RH */}
        <aside className="talent-detail__sidebar">
          <div className="card talent-actions-card">
            <h3>Ações de Recrutamento</h3>
            <p className="talent-actions__desc">
              Conecte-se diretamente com o talento ou adicione à lista de avaliação da sua equipe.
            </p>

            <button
              type="button"
              className={`btn btn--block ${shortlisted ? 'btn-secondary' : 'btn-primary btn-primary--glow'}`}
              onClick={() => setShortlisted(!shortlisted)}
            >
              {shortlisted ? (
                <>
                  <IconCheckCircle size={16} style={{ marginRight: 6 }} />
                  Salvo na Shortlist
                </>
              ) : (
                '★ Adicionar à Shortlist'
              )}
            </button>

            <button
              type="button"
              className="btn btn-secondary btn--block"
              style={{ marginTop: '0.75rem' }}
              onClick={() => {
                setInvited(true);
                alert(`Convite para entrevista técnica enviado com sucesso para ${talent.name}!`);
              }}
            >
              {invited ? (
                <>
                  <IconCheckCircle size={16} style={{ marginRight: 6 }} />
                  Convite Enviado
                </>
              ) : (
                '✉ Convidar para Entrevista'
              )}
            </button>

            <button
              type="button"
              className="btn btn-neutral btn--block"
              style={{ marginTop: '0.75rem' }}
              onClick={() => alert('Dossiê técnico exportado em PDF formatado (simulação).')}
            >
              <IconFileText
                size={16}
                style={{ marginRight: 6, display: 'inline-block', verticalAlign: 'middle' }}
              />
              Exportar Dossiê de Evidências
            </button>

            <div className="talent-actions__guarantee">
              <IconShieldCheck size={20} className="text-mint" style={{ flexShrink: 0 }} />
              <small>
                Validação RootScoll: Código executado no ambiente de terminal com verificação de
                saída e histórico de comandos.
              </small>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default TalentDetailScreen;
