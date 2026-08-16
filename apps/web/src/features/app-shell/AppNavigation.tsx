import type { AppScreen } from './types';
import logo from '../../images/logo.png';

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
 * Barra de navegação superior do shell — visível em todas as telas
 * autenticadas (painel/perfil/trilhas), ausente no login e na sala Terminal
 * (que preserva o visual fullscreen próprio, sem competir com esta barra).
 * Simples, textual, sem menu hambúrguer nem mega-menu — "navegação clara,
 * mesmo que mock/local", não um produto de navegação em si.
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
    <nav className="app-nav" aria-label="Navegação principal">
      <span className="app-nav__brand">
        <img className="app-nav__brand-logo" src={logo} alt="" aria-hidden="true" />
        RootScoll
      </span>

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

      <span className="app-nav__user">{userName}</span>
      <button type="button" className="app-nav__logout" onClick={onLogout}>
        Sair
      </button>
    </nav>
  );
}

export default AppNavigation;
