import type { MockUser } from './types';

export interface ProfileScreenProps {
  readonly user: MockUser;
  readonly onBack: () => void;
}

const ROLE_LABELS: Record<MockUser['role'], string> = {
  aluno: 'Aluno',
  professor: 'Professor',
  admin: 'Admin/Instituição',
  'mentor-ia': 'Mentor IA',
};

/**
 * Tela de perfil — dados do usuário mock, somente leitura nesta fatia (sem
 * edição/persistência: seria estado local perdido ao recarregar, o que
 * confundiria mais do que ajudaria).
 */
function ProfileScreen({ user, onBack }: ProfileScreenProps) {
  return (
    <div className="screen profile-screen">
      <h1 className="screen__title">Perfil</h1>

      <dl className="profile-screen__list">
        <div className="profile-screen__row">
          <dt>Nome</dt>
          <dd>{user.name}</dd>
        </div>
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
          <dt>Progresso geral</dt>
          <dd>{user.overallProgress}%</dd>
        </div>
      </dl>

      <button type="button" className="screen__back" onClick={onBack}>
        ← Voltar ao painel
      </button>
    </div>
  );
}

export default ProfileScreen;
