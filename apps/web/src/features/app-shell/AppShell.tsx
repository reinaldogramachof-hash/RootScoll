import LearningFlowApp from '../learning-flow/LearningFlowApp';
import AppNavigation from './AppNavigation';
import LoginScreen from './LoginScreen';
import StudentDashboard from './StudentDashboard';
import ProfileScreen from './ProfileScreen';
import TracksScreen from './TracksScreen';
import { useAppNavigation } from './useAppNavigation';

/**
 * Raiz do shell de aplicação (App Navigation v1 — ver
 * `docs/product/app-navigation-v1.md`): sucessora de
 * `../learning-flow/LearningFlowApp.tsx` como componente raiz de
 * `apps/web/src/App.tsx`. Login mock -> Painel do Aluno -> Perfil/Trilhas ->
 * Sala de Aula Terminal, tudo em memória via `useAppNavigation`.
 *
 * A Sala Terminal (`LearningFlowApp`) é renderizada SEM a `AppNavigation`
 * ao redor — preserva o visual fullscreen terminal já aprovado, que não deve
 * competir com a barra de navegação do shell. Todas as outras telas
 * (painel/perfil/trilhas) ficam dentro do wrapper `.app-shell`, com a barra
 * de navegação sempre visível no topo.
 */
function AppShell() {
  const nav = useAppNavigation();

  if (nav.screen === 'login') {
    return <LoginScreen onLogin={nav.login} />;
  }

  if (nav.screen === 'terminal-classroom') {
    return <LearningFlowApp onExitClassroom={nav.backToDashboard} />;
  }

  const currentTrack = nav.tracks.find((track) => track.id === nav.user.currentTrackId);

  return (
    <div className="app-shell">
      <AppNavigation
        screen={nav.screen}
        userName={nav.user.name}
        onOpenDashboard={nav.backToDashboard}
        onOpenProfile={nav.openProfile}
        onOpenTracks={nav.openTracks}
        onLogout={nav.logout}
      />

      {nav.screen === 'dashboard' && (
        <StudentDashboard
          user={nav.user}
          currentTrack={currentTrack}
          onOpenTracks={nav.openTracks}
          onOpenProfile={nav.openProfile}
          onEnterClassroom={nav.enterClassroom}
        />
      )}

      {nav.screen === 'profile' && <ProfileScreen user={nav.user} onBack={nav.backToDashboard} />}

      {nav.screen === 'tracks' && (
        <TracksScreen
          tracks={nav.tracks}
          onBack={nav.backToDashboard}
          onEnterClassroom={nav.enterClassroom}
        />
      )}
    </div>
  );
}

export default AppShell;
