import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useParams, Navigate, useLocation } from 'react-router-dom';
import LearningFlowApp from '../learning-flow/LearningFlowApp';
import AppNavigation from './AppNavigation';
import LoginScreen from './LoginScreen';
import StudentDashboard from './StudentDashboard';
import ProfileScreen from './ProfileScreen';
import TracksScreen from './TracksScreen';
import TrackDetailScreen from './TrackDetailScreen';
import TeacherDashboard from './TeacherDashboard';
import ClassroomDetailScreen from './ClassroomDetailScreen';
import PartnerDashboard from './PartnerDashboard';
import TalentDetailScreen from './TalentDetailScreen';
import {
  MOCK_CLASSROOMS,
  MOCK_PARTNER,
  MOCK_PARTNER_COMPANY,
  MOCK_TALENT_POOL,
  MOCK_TEACHER,
  MOCK_USER,
  TRACKS,
} from './mock-data';
import type { AppScreen, UserRole } from './types';

function getScreenFromPath(pathname: string): AppScreen {
  if (pathname.startsWith('/app/trilhas')) return 'tracks';
  if (pathname.startsWith('/app/perfil')) return 'profile';
  if (pathname.startsWith('/app/professor/turmas')) return 'teacher-classroom-detail';
  if (pathname.startsWith('/app/professor')) return 'teacher-dashboard';
  if (pathname.startsWith('/app/parceiro/talentos')) return 'partner-talent-detail';
  if (pathname.startsWith('/app/parceiro')) return 'partner-dashboard';
  return 'dashboard';
}

function TrackDetailRouteWrapper({ onBack }: { readonly onBack: () => void }) {
  const { trackId } = useParams<{ trackId: string }>();
  const navigate = useNavigate();

  return (
    <TrackDetailScreen
      trackId={trackId ?? 'terminal-os'}
      onBack={onBack}
      onSelectLesson={(lessonId) => navigate(`/app/sala/terminal/${lessonId}`)}
    />
  );
}

function AppShell() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeRole, setActiveRole] = useState<UserRole>('aluno');
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem('rootscoll_theme') as 'dark' | 'light') || 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('rootscoll_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const currentScreen = getScreenFromPath(location.pathname);

  const activeUser =
    activeRole === 'professor'
      ? MOCK_TEACHER
      : activeRole === 'parceiro'
        ? MOCK_PARTNER
        : MOCK_USER;

  const currentTrack = TRACKS.find((track) => track.id === activeUser.currentTrackId);

  const handleLogin = (role: UserRole = 'aluno') => {
    setActiveRole(role);
    setIsLoggedIn(true);
    if (role === 'professor') navigate('/app/professor');
    else if (role === 'parceiro') navigate('/app/parceiro');
    else navigate('/app');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    navigate('/login');
  };

  if (!isLoggedIn) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <Routes>
      <Route
        path="/app/sala/terminal/:lessonId?"
        element={<LearningFlowApp onExitClassroom={() => navigate('/app/trilhas')} />}
      />

      <Route
        path="*"
        element={
          <div className="app-shell">
            <AppNavigation
              screen={currentScreen}
              role={activeRole}
              userName={activeUser.name}
              theme={theme}
              onToggleTheme={toggleTheme}
              onOpenDashboard={() => navigate('/app')}
              onOpenProfile={() => navigate('/app/perfil')}
              onOpenTracks={() => navigate('/app/trilhas')}
              onLogout={handleLogout}
            />



            <Routes>
              <Route path="/" element={<Navigate to="/app" replace />} />
              {/* Usuário já autenticado navegando manualmente para /login (ex.: link antigo,
                  botão voltar do navegador): redireciona em vez de renderizar LoginScreen
                  dentro do shell autenticado, o que vazava a AppNavigation por cima do login. */}
              <Route path="/login" element={<Navigate to="/app" replace />} />
              <Route
                path="/app"
                element={
                  <StudentDashboard
                    user={activeUser}
                    currentTrack={currentTrack}
                    onOpenTracks={() => navigate('/app/trilhas')}
                    onOpenProfile={() => navigate('/app/perfil')}
                    onEnterClassroom={() => navigate('/app/sala/terminal')}
                  />
                }
              />
              <Route
                path="/app/trilhas"
                element={
                  <TracksScreen
                    tracks={TRACKS}
                    onBack={() => navigate('/app')}
                    onEnterClassroom={() => navigate('/app/sala/terminal')}
                    onSelectTrack={(trackId) => navigate(`/app/trilhas/${trackId}`)}
                  />
                }
              />
              <Route
                path="/app/trilhas/:trackId"
                element={<TrackDetailRouteWrapper onBack={() => navigate('/app/trilhas')} />}
              />
              <Route
                path="/app/perfil"
                element={<ProfileScreen user={activeUser} onBack={() => navigate('/app')} />}
              />
              <Route
                path="/app/professor"
                element={
                  <TeacherDashboard
                    user={activeUser}
                    classrooms={MOCK_CLASSROOMS}
                    onOpenClassroom={(id) => navigate(`/app/professor/turmas/${id}`)}
                    onOpenProfile={() => navigate('/app/perfil')}
                  />
                }
              />
              <Route
                path="/app/professor/turmas/:classroomId"
                element={
                  <ClassroomDetailScreen
                    classroom={MOCK_CLASSROOMS[0]!}
                    onBack={() => navigate('/app/professor')}
                  />
                }
              />
              <Route
                path="/app/parceiro"
                element={
                  <PartnerDashboard
                    user={activeUser}
                    partnerCompany={MOCK_PARTNER_COMPANY}
                    talentPool={MOCK_TALENT_POOL}
                    onSelectTalent={(id) => navigate(`/app/parceiro/talentos/${id}`)}
                    onOpenProfile={() => navigate('/app/perfil')}
                  />
                }
              />
              <Route
                path="/app/parceiro/talentos/:talentId"
                element={
                  <TalentDetailScreen
                    talent={MOCK_TALENT_POOL[0]!}
                    onBack={() => navigate('/app/parceiro')}
                  />
                }
              />
            </Routes>
          </div>
        }
      />
    </Routes>
  );
}

export default AppShell;
