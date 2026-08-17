import type { MockUser } from './types';

export interface ProfileScreenProps {
  readonly user: MockUser;
  readonly onBack: () => void;
}

const ROLE_LABELS: Record<MockUser['role'], string> = {
  aluno: 'Aluno',
  professor: 'Professor',
  admin: 'Admin/Instituicao',
  'mentor-ia': 'Mentor IA',
  parceiro: 'Parceiro (RH)',
};

/**
 * Perfil de aprendizado local: somente leitura nesta fatia. Nao edita dados
 * porque ainda nao existe persistencia ou autenticacao real.
 */
function ProfileScreen({ user, onBack }: ProfileScreenProps) {
  return (
    <div className="screen profile-screen">
      <div className="screen__header">
        <div>
          <p className="screen__eyebrow">Perfil de aprendizado</p>
          <h1 className="screen__title">{user.name}</h1>
        </div>
        <span className="screen__status">{ROLE_LABELS[user.role]}</span>
      </div>

      <div className="profile-screen__summary">
        <div>
          <span>Fase atual</span>
          <strong>{user.currentPhase}</strong>
        </div>
        <div>
          <span>Progresso geral</span>
          <strong>{user.overallProgress}%</strong>
        </div>
        <div>
          <span>Evidencias</span>
          <strong>{user.evidenceCount}</strong>
        </div>
      </div>

      <dl className="profile-screen__list">
        <div className="profile-screen__row">
          <dt>E-mail</dt>
          <dd>{user.email}</dd>
        </div>
        <div className="profile-screen__row">
          <dt>Papel</dt>
          <dd>{ROLE_LABELS[user.role]}</dd>
        </div>
        <div className="profile-screen__row">
          <dt>Trilha atual</dt>
          <dd>{user.currentTrackId}</dd>
        </div>
        <div className="profile-screen__row">
          <dt>Competencia em foco</dt>
          <dd>{user.currentCompetency}</dd>
        </div>
      </dl>

      <section className="profile-screen__panel">
        <h2>Portfolio local</h2>
        <p>
          As evidencias desta fatia ainda sao registros mock. A meta visual e preparar o espaco para
          comandos executados, explicacoes do aluno e avaliacoes por bloco.
        </p>
      </section>

      <button type="button" className="screen__back" onClick={onBack}>
        Voltar ao painel
      </button>
    </div>
  );
}

export default ProfileScreen;
