import type { AppScreen, UserRole } from './types';
import logo from '../../images/logo.svg';
import { IconChevronRight, IconSun, IconMoon } from './icons';

export interface AppNavigationProps {
  readonly screen: AppScreen;
  readonly role?: UserRole;
  readonly userName: string;
  readonly theme?: 'dark' | 'light';
  readonly onToggleTheme?: () => void;
  readonly onOpenDashboard: () => void;
  readonly onOpenProfile: () => void;
  readonly onOpenTracks?: () => void;
  readonly onLogout: () => void;
}

/**
 * Navegação superior do shell autenticado. Adapta-se ao papel ativo (aluno, professor, parceiro).
 */
function AppNavigation({
  screen,
  role = 'aluno',
  userName,
  theme = 'dark',
  onToggleTheme,
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
    <nav className="app-nav" aria-label="Navegação principal">
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

        {isDetailActive && (
          <span className="app-nav__breadcrumb-item" title="Visualizando detalhe">
            <IconChevronRight size={14} className="text-muted" />
            <span className="text-mint">Detalhes</span>
          </span>
        )}

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
        {onToggleTheme && (
          <button
            type="button"
            className="app-nav__theme-toggle"
            onClick={onToggleTheme}
            title={theme === 'dark' ? 'Alternar para Modo Claro' : 'Alternar para Modo Escuro'}
            aria-label={theme === 'dark' ? 'Alternar para Modo Claro' : 'Alternar para Modo Escuro'}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '6px 10px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border)',
              background: 'var(--surface)',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              fontSize: '12px',
              transition: 'all 0.2s ease',
            }}
          >
            {theme === 'dark' ? <IconSun size={14} /> : <IconMoon size={14} />}
            <span>{theme === 'dark' ? 'Claro' : 'Escuro'}</span>
          </button>
        )}
        <span
          className="badge badge--secondary"
          title="Pressione F11 para melhor experiência imersiva"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px', padding: '3px 8px' }}
        >
          <kbd style={{ background: 'var(--border)', border: '1px solid var(--border-hover)', color: 'var(--text-primary)', borderRadius: '3px', padding: '1px 5px', fontFamily: 'monospace', fontSize: '10px' }}>F11</kbd>
          <span>Tela cheia</span>
        </span>
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
