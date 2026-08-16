import type { AppScreen } from './types';
import logo from '../../images/logo.svg';

export interface AppNavigationProps {
  readonly screen: AppScreen;
  readonly userName: string;
  readonly onOpenDashboard: () => void;
  readonly onOpenProfile: () => void;
  readonly onOpenTracks: () => void;
  readonly onLogout: () => void;
}

const NAV_LABELS: Partial<Record<AppScreen, string>> = {
  dashboard: 'Painel',
  profile: 'Perfil',
  tracks: 'Trilhas',
};

/**
 * Navegacao superior do shell autenticado. A Sala Terminal segue fullscreen e
 * nao recebe esta barra para manter o foco do ambiente de pratica.
 */
function AppNavigation({
  screen,
  userName,
  onOpenDashboard,
  onOpenProfile,
  onOpenTracks,
  onLogout,
}: AppNavigationProps) {
  return (
    <nav className="app-nav" aria-label="Navegacao principal">
      <span className="app-nav__brand">
        <img className="app-nav__brand-logo" src={logo} alt="" aria-hidden="true" />
        <span>
          RootScoll
          <small>Escola Raiz</small>
        </span>
      </span>

      <div className="app-nav__links">
        <button
          type="button"
          className={`app-nav__link ${screen === 'dashboard' ? 'app-nav__link--active' : ''}`}
          onClick={onOpenDashboard}
        >
          {NAV_LABELS.dashboard}
        </button>
        <button
          type="button"
          className={`app-nav__link ${screen === 'tracks' ? 'app-nav__link--active' : ''}`}
          onClick={onOpenTracks}
        >
          {NAV_LABELS.tracks}
        </button>
        <button
          type="button"
          className={`app-nav__link ${screen === 'profile' ? 'app-nav__link--active' : ''}`}
          onClick={onOpenProfile}
        >
          {NAV_LABELS.profile}
        </button>
      </div>

      <span className="app-nav__status">MVP local</span>
      <span className="app-nav__user">{userName}</span>
      <button type="button" className="app-nav__logout" onClick={onLogout}>
        Sair
      </button>
    </nav>
  );
}

export default AppNavigation;
