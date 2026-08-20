import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useParams, Navigate, useLocation, Outlet } from 'react-router-dom';
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

function roleToTargetPath(role: UserRole): string {
  if (role === 'professor') return '/app/professor';
  if (role === 'parceiro') return '/app/parceiro';
  return '/app';
}

function AppShell() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeRole, setActiveRole] = useState<UserRole>('aluno');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // Papel escolhido no login, aguardando a URL confirmar a navegação antes de
  // montar a árvore autenticada (ver useEffect abaixo — comentário completo lá).
  const [pendingRole, setPendingRole] = useState<UserRole | null>(null);
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
    // Só navegamos aqui. isLoggedIn continua false, então a árvore
    // autenticada (<Routes>) nem existe ainda — nada pode casar com uma
    // location errada nesse meio-tempo.
    setPendingRole(role);
    navigate(roleToTargetPath(role), { replace: true });
  };

  // Confirmação: só viramos isLoggedIn=true (o que monta <Routes> pela
  // primeira vez) depois que location.pathname já reflete de fato a URL de
  // destino do papel escolhido. Investigação ao vivo (stack trace de
  // history.replaceState) mostrou que, ao virar isLoggedIn e navegar no MESMO
  // handler síncrono, o primeiro render de <Routes> por vezes ainda enxergava
  // a location antiga ("/"), casava com <Route path="/"> e o próprio
  // <Navigate to="/app"> (código interno do react-router) disparava seu
  // efeito de montagem sobrescrevendo nossa navegação ~30-150ms depois — daí
  // Professor/Parceiro sempre caírem de volta em /app com o StudentDashboard.
  // Esperar a confirmação via useLocation() antes de montar a árvore elimina
  // essa corrida, não importa se a atualização interna do router é síncrona,
  // em batch ou adiada (transition).
  useEffect(() => {
    if (!pendingRole) return;
    if (location.pathname === roleToTargetPath(pendingRole)) {
      setActiveRole(pendingRole);
      setIsLoggedIn(true);
      setPendingRole(null);
    }
  }, [pendingRole, location.pathname]);

  const handleLogout = () => {
    setIsLoggedIn(false);
    navigate('/login');
  };

  if (!isLoggedIn) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  // ATENÇÃO: apenas um único <Routes> na árvore autenticada (nunca aninhar um
  // segundo <Routes> dentro do elemento de uma rota "*"). Um <Routes> filho
  // renderizado assim herda como "pathnameBase" o match da rota "*" pai — que,
  // por ser um wildcard puro, não tem prefixo fixo — e por isso a rota
  // <Route path="/"> do filho casava com QUALQUER pathname (inclusive
  // /app/professor ou /app/parceiro logo após o login), disparando o
  // <Navigate to="/app" replace /> e sobrescrevendo a navegação de papel
  // correta ~150ms depois (StrictMode chega a montar/rodar o efeito duas
  // vezes, daí os dois `replace` para /app vistos no log de navegação).
  // A correção estrutural é achatar tudo em UM <Routes>, usando uma rota de
  // layout (sem "path", com <Outlet />) para compartilhar a <AppNavigation />
  // entre as telas autenticadas — o padrão suportado nativamente pelo
  // React Router, em vez de instanciar <Routes> aninhado manualmente.
  return (
    <Routes>
      <Route
        path="/app/sala/terminal/:lessonId?"
        element={<LearningFlowApp onExitClassroom={() => navigate('/app/trilhas')} />}
      />

      <Route path="/" element={<Navigate to="/app" replace />} />
      {/* Usuário já autenticado navegando manualmente para /login (ex.: link antigo,
          botão voltar do navegador): redireciona em vez de renderizar LoginScreen
          dentro do shell autenticado, o que vazava a AppNavigation por cima do login. */}
      <Route path="/login" element={<Navigate to="/app" replace />} />

      <Route
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
            <Outlet />
          </div>
        }
      >
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
      </Route>
    </Routes>
  );
}

export default AppShell;
