import LearningFlowApp from '../learning-flow/LearningFlowApp';
import AppNavigation from './AppNavigation';
import LoginScreen from './LoginScreen';
import StudentDashboard from './StudentDashboard';
import ProfileScreen from './ProfileScreen';
import TracksScreen from './TracksScreen';
import TeacherDashboard from './TeacherDashboard';
import ClassroomDetailScreen from './ClassroomDetailScreen';
import PartnerDashboard from './PartnerDashboard';
import TalentDetailScreen from './TalentDetailScreen';
import { useAppNavigation } from './useAppNavigation';

/**
 * Raiz do shell de aplicação (App Navigation v1): renderiza telas conforme o papel
 * do usuário ativo (aluno, professor, parceiro) e o estado da navegação.
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
        role={nav.activeRole}
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

      {nav.screen === 'teacher-dashboard' && (
        <TeacherDashboard
          user={nav.user}
          classrooms={nav.classrooms}
          onOpenClassroom={nav.openClassroomDetail}
          onOpenProfile={nav.openProfile}
        />
      )}

      {nav.screen === 'teacher-classroom-detail' && nav.selectedClassroom && (
        <ClassroomDetailScreen
          classroom={nav.selectedClassroom}
          onBack={nav.openTeacherDashboard}
        />
      )}

      {nav.screen === 'partner-dashboard' && (
        <PartnerDashboard
          user={nav.user}
          partnerCompany={nav.partnerCompany}
          talentPool={nav.talentPool}
          onSelectTalent={nav.openTalentDetail}
          onOpenProfile={nav.openProfile}
        />
      )}

      {nav.screen === 'partner-talent-detail' && nav.selectedTalent && (
        <TalentDetailScreen talent={nav.selectedTalent} onBack={nav.openPartnerDashboard} />
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
