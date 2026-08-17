import type { MockUser } from './types';
import {
  IconArrowLeft,
  IconAward,
  IconChart,
  IconFileText,
  IconTrendingUp,
  IconTarget,
  IconShieldCheck,
  IconUsers,
} from './icons';

export interface ProfileScreenProps {
  readonly user: MockUser;
  readonly onBack: () => void;
}

const ROLE_LABELS: Record<MockUser['role'], string> = {
  aluno: 'Aluno',
  professor: 'Professor',
  admin: 'Admin/Instituição',
  'mentor-ia': 'Mentor IA',
  parceiro: 'Parceiro (RH)',
};

/**
 * Perfil de aprendizado local: cockpit de identificação e portfólio pedagógico do aluno.
 */
function ProfileScreen({ user, onBack }: ProfileScreenProps) {
  return (
    <div className="screen dashboard profile-screen">
      <header className="screen__header dashboard__header">
        <div className="screen__title-wrap">
          <p className="screen__eyebrow">Perfil do Estudante</p>
          <h1 className="screen__title">{user.name}</h1>
        </div>
        <div className="teacher-dashboard__header-badge">
          <span className="badge badge--mint">{ROLE_LABELS[user.role]}</span>
        </div>
      </header>

      <div className="dashboard__metrics" aria-label="Resumo do perfil">
        <div className="dashboard__metric">
          <div className="metric-header-row">
            <span className="dashboard__metric-label">Fase Atual</span>
            <IconAward size={16} className="metric-icon text-cyan" />
          </div>
          <strong>{user.currentPhase}</strong>
          <span>Etapa do currículo</span>
        </div>

        <div className="dashboard__metric">
          <div className="metric-header-row">
            <span className="dashboard__metric-label">Progresso Geral</span>
            <IconChart size={16} className="metric-icon text-mint" />
          </div>
          <strong>{user.overallProgress}%</strong>
          <span className="dashboard__meter" aria-hidden="true">
            <span style={{ width: `${user.overallProgress}%` }} />
          </span>
        </div>

        <div className="dashboard__metric dashboard__metric--accent">
          <div className="metric-header-row">
            <span className="dashboard__metric-label">Evidências</span>
            <IconFileText size={16} className="metric-icon text-amber" />
          </div>
          <strong>{user.evidenceCount}</strong>
          <span>Registros validados</span>
        </div>
      </div>

      <div className="dashboard__grid">
        <section className="dashboard__section dashboard__section--primary">
          <div>
            <p className="dashboard__section-eyebrow">Informações de Aprendizado</p>
            <h2 className="dashboard__section-title" style={{ fontSize: '18px', marginBottom: '16px' }}>
              Foco & Credenciais
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <IconUsers size={16} className="text-cyan" />
                <div>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block' }}>E-mail institucional</span>
                  <strong style={{ color: 'var(--text-primary)', fontSize: '14px' }}>{user.email}</strong>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <IconTrendingUp size={16} className="text-mint" />
                <div>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block' }}>Trilha ativa</span>
                  <strong style={{ color: 'var(--text-primary)', fontSize: '14px' }}>{user.currentTrackId}</strong>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <IconTarget size={16} className="text-amber" />
                <div>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block' }}>Competência em foco</span>
                  <strong style={{ color: 'var(--text-primary)', fontSize: '14px' }}>{user.currentCompetency}</strong>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="dashboard__section dashboard__section--secondary">
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h2 className="dashboard__section-title">Portfólio Local</h2>
              <span className="badge badge--secondary">Em preparação</span>
            </div>

            <div style={{ background: 'rgba(54, 230, 165, 0.05)', border: '1px solid rgba(54, 230, 165, 0.15)', borderRadius: 'var(--radius-md)', padding: '14px', marginTop: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <IconShieldCheck size={18} className="text-mint" />
                <strong style={{ fontSize: '13px', color: 'var(--text-primary)' }}>Evidências de Prática</strong>
              </div>
              <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                As evidências desta versão consolidam registros dos comandos executados na Sala Terminal, justificativas pedagógicas e diagnósticos do Mentor IA.
              </p>
            </div>
          </div>
        </section>
      </div>

      <div style={{ marginTop: '24px' }}>
        <button type="button" className="btn btn-secondary" onClick={onBack}>
          <IconArrowLeft size={16} style={{ marginRight: '8px' }} />
          Voltar ao painel
        </button>
      </div>
    </div>
  );
}

export default ProfileScreen;
