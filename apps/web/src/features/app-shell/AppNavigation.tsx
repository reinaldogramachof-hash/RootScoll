import type { AppScreen, UserRole } from './types';
import logo from '../../images/logo.svg';

export interface AppNavigationProps {
  readonly screen: AppScreen;
  readonly role?: UserRole;
  readonly userName: string;
  readonly onOpenDashboard: () => void;
  readonly onOpenProfile: () => void;
  readonly onOpenTracks?: () => void;
  readonly onLogout: () => void;
}

/**
 * Navegacao superior do shell autenticado. Adapta-se ao papel ativo (aluno, professor, parceiro).
 */
function AppNavigation({
  screen,
  role = 'aluno',
  userName,
  onOpenDashboard,
  onOpenProfile,
  onOpenTracks,
  onLogout,
}: AppNavigationProps) {
  const isTeacher = role === 'professor';
  const isPartner = role === 'parceiro';

  const isDashboardActive =
    screen === 'dashboard' || screen === 'teacher-dashboard' || screen === 'partner-dashboard';
  const isDetailActive =
    screen === 'teacher-classroom-detail' || screen === 'partner-talent-detail';

  return (
    <nav className="app-nav" aria-label="Navegacao principal">
      <span className="app-nav__brand">
        <img className="app-nav__brand-logo" src={logo} alt="" aria-hidden="true" />
        <span>
          RootScoll
          <small>
            {isTeacher ? 'Gestão Didática' : isPartner ? 'Portal de Parceiros' : 'Escola Raiz'}
          </small>
        </span>
      </span>

      <div className="app-nav__links" role="tablist" aria-label="Painéis de navegação">
        <button
          type="button"
          className={`app-nav__link ${isDashboardActive || isDetailActive ? 'app-nav__link--active' : ''}`}
          onClick={onOpenDashboard}
          aria-selected={isDashboardActive || isDetailActive}
        >
          {isTeacher ? 'Turmas & Gargalos' : isPartner ? 'Buscar Talentos' : 'Meu Painel'}
        </button>

        {!isTeacher && !isPartner && onOpenTracks && (
          <button
            type="button"
            className={`app-nav__link ${screen === 'tracks' ? 'app-nav__link--active' : ''}`}
            onClick={onOpenTracks}
            aria-selected={screen === 'tracks'}
          >
            Trilhas
          </button>
        )}

        <button
          type="button"
          className={`app-nav__link ${screen === 'profile' ? 'app-nav__link--active' : ''}`}
          onClick={onOpenProfile}
          aria-selected={screen === 'profile'}
        >
          {isPartner ? 'Empresa' : 'Perfil'}
        </button>
      </div>

      <div className="app-nav__meta">
        <span className={`app-nav__status app-nav__status--${role}`}>
          {isTeacher ? 'Professor' : isPartner ? 'RH Parceiro' : 'Aluno'}
        </span>
        <span className="app-nav__user">{userName}</span>
        <button type="button" className="app-nav__logout" onClick={onLogout}>
          Sair
        </button>
      </div>
    </nav>
  );
}

export default AppNavigation;
