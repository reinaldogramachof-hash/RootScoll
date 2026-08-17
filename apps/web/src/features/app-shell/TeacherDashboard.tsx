import type { MockClassroom, MockUser } from './types';
import { IconUsers, IconTrendingUp, IconAlertTriangle, IconFileText, IconLightbulb } from './icons';

export interface TeacherDashboardProps {
  readonly user: MockUser;
  readonly classrooms: readonly MockClassroom[];
  readonly onOpenClassroom: (classroomId: string) => void;
  readonly onOpenProfile: () => void;
}

/**
 * Cockpit de Gestão Didática do Professor.
 * Permite supervisão de turmas, identificação em tempo real de gargalos de aprendizado
 * e leitura de prontidão dos alunos do ecossistema.
 */
function TeacherDashboard({ user, classrooms, onOpenClassroom }: TeacherDashboardProps) {
  const totalStudents = classrooms.reduce((acc, c) => acc + c.studentsCount, 0);
  const totalActive = classrooms.reduce((acc, c) => acc + c.activeCount, 0);
  const totalAtRisk = classrooms.reduce((acc, c) => acc + c.atRiskCount, 0);
  const avgProgress = Math.round(
    classrooms.reduce((acc, c) => acc + c.averageProgress, 0) / (classrooms.length || 1),
  );

  const allBottlenecks = classrooms.flatMap((c) =>
    c.bottlenecks.map((b) => ({ ...b, classroomName: c.name, classroomId: c.id })),
  );

  return (
    <div className="screen dashboard teacher-dashboard">
      <header className="screen__header dashboard__header">
        <div className="screen__title-wrap">
          <p className="screen__eyebrow">{user.currentPhase}</p>
          <h1 className="screen__title">Cockpit do Professor: {user.name}</h1>
        </div>

        <div className="teacher-dashboard__header-badge">
          <span className="badge badge--primary">Modo Docente Ativo</span>
        </div>
      </header>

      {/* Métricas Principais com Ícones Vetoriais */}
      <div className="dashboard__metrics" aria-label="Métricas pedagógicas das turmas">
        <div className="dashboard__metric">
          <div className="metric-header-row">
            <span className="dashboard__metric-label">Alunos em Supervisão</span>
            <IconUsers size={16} className="metric-icon text-cyan" />
          </div>
          <strong>{totalStudents}</strong>
          <span className="teacher-dashboard__metric-sub">{totalActive} ativos nesta semana</span>
        </div>

        <div className="dashboard__metric">
          <div className="metric-header-row">
            <span className="dashboard__metric-label">Progresso Médio</span>
            <IconTrendingUp size={16} className="metric-icon text-mint" />
          </div>
          <strong>{avgProgress}%</strong>
          <span className="dashboard__meter" aria-hidden="true">
            <span style={{ width: `${avgProgress}%` }} />
          </span>
        </div>

        <div className="dashboard__metric dashboard__metric--warning">
          <div className="metric-header-row">
            <span className="dashboard__metric-label">Alunos com Gargalos</span>
            <IconAlertTriangle size={16} className="metric-icon text-warning" />
          </div>
          <strong>{totalAtRisk}</strong>
          <span className="teacher-dashboard__metric-sub text-warning">
            Necessitam de intervenção
          </span>
        </div>

        <div className="dashboard__metric dashboard__metric--accent">
          <div className="metric-header-row">
            <span className="dashboard__metric-label">Evidências Práticas</span>
            <IconFileText size={16} className="metric-icon text-mint" />
          </div>
          <strong>{user.evidenceCount}</strong>
          <span className="teacher-dashboard__metric-sub">Validadas no Terminal</span>
        </div>
      </div>

      {/* Gargalos Pedagógicos Críticos */}
      {allBottlenecks.length > 0 && (
        <section
          className="teacher-section teacher-bottlenecks"
          aria-label="Gargalos críticos detectados"
        >
          <div className="teacher-section__header">
            <div>
              <h2 className="teacher-section__title">
                <IconAlertTriangle size={20} className="text-warning" style={{ marginRight: 6 }} />
                Gargalos de Aprendizagem Detectados
              </h2>
              <p className="teacher-section__desc">
                Módulos e exercícios práticos onde os alunos apresentaram alta taxa de falhas
                repetidas no terminal.
              </p>
            </div>
          </div>

          <div className="teacher-bottlenecks__grid">
            {allBottlenecks.map((bottleneck) => (
              <div
                key={bottleneck.id}
                className={`bottleneck-card bottleneck-card--${bottleneck.severity}`}
              >
                <div className="bottleneck-card__header">
                  <span className="bottleneck-card__tag">{bottleneck.trackTitle}</span>
                  <span
                    className={`badge badge--${bottleneck.severity === 'alta' ? 'danger' : 'warning'}`}
                  >
                    Taxa de Falha: {bottleneck.failureRate}%
                  </span>
                </div>
                <h3 className="bottleneck-card__title">{bottleneck.moduleTitle}</h3>
                <p className="bottleneck-card__classroom">
                  Turma: <strong>{bottleneck.classroomName}</strong> (
                  {bottleneck.impactedStudentsCount} alunos travados)
                </p>
                <div className="bottleneck-card__action">
                  <div className="bottleneck-card__action-title">
                    <IconLightbulb size={15} className="text-warning" style={{ marginRight: 4 }} />
                    <strong>Recomendação Pedagógica:</strong>
                  </div>
                  <p>{bottleneck.recommendedAction}</p>
                </div>
                <button
                  type="button"
                  className="btn btn-secondary btn--sm"
                  onClick={() => onOpenClassroom(bottleneck.classroomId)}
                >
                  Ver alunos afetados na turma →
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Lista de Turmas */}
      <section className="teacher-section" aria-label="Turmas ativas">
        <div className="teacher-section__header">
          <div>
            <h2 className="teacher-section__title">Turmas sob sua Gestão</h2>
            <p className="teacher-section__desc">
              Acompanhe a evolução de cada coorte e acesse o detalhe nominal dos alunos.
            </p>
          </div>
        </div>

        <div className="teacher-classrooms-grid">
          {classrooms.map((classroom) => (
            <article key={classroom.id} className="card classroom-card">
              <div className="classroom-card__head">
                <div>
                  <span className="classroom-card__code">{classroom.code}</span>
                  <h3 className="classroom-card__name">{classroom.name}</h3>
                </div>
                <span className="badge badge--secondary">{classroom.trackTitle}</span>
              </div>

              <div className="classroom-card__stats">
                <div>
                  <span>Matriculados:</span>
                  <strong>{classroom.studentsCount}</strong>
                </div>
                <div>
                  <span>Ativos:</span>
                  <strong className="text-mint">{classroom.activeCount}</strong>
                </div>
                <div>
                  <span>Travados:</span>
                  <strong className={classroom.atRiskCount > 0 ? 'text-warning' : ''}>
                    {classroom.atRiskCount}
                  </strong>
                </div>
              </div>

              <div className="classroom-card__progress-wrap">
                <div className="classroom-card__progress-label">
                  <span>Progresso Médio da Turma</span>
                  <strong>{classroom.averageProgress}%</strong>
                </div>
                <div className="dashboard__meter" aria-hidden="true">
                  <span style={{ width: `${classroom.averageProgress}%` }} />
                </div>
              </div>

              <div className="classroom-card__footer">
                <button
                  type="button"
                  className="btn btn-primary btn--block"
                  onClick={() => onOpenClassroom(classroom.id)}
                >
                  Gerenciar Turma & Alunos →
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

export default TeacherDashboard;
