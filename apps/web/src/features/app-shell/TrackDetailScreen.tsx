import {
  getCoursesByTrackId,
  getModulesByCourseId,
  getLessonsByModuleId,
  getTrackById,
} from '@codechat/content';
import { IconArrowLeft, IconTerminal, IconCheckCircle, IconFileText } from './icons';

export interface TrackDetailScreenProps {
  readonly trackId: string;
  readonly onBack: () => void;
  readonly onSelectLesson: (lessonId: string) => void;
}

export function TrackDetailScreen({ trackId, onBack, onSelectLesson }: TrackDetailScreenProps) {
  const track = getTrackById(trackId);
  const courses = getCoursesByTrackId(trackId);

  if (!track) {
    return (
      <div className="screen dashboard">
        <h2>Trilha não encontrada</h2>
        <button type="button" className="btn btn-secondary" onClick={onBack}>
          Voltar
        </button>
      </div>
    );
  }

  return (
    <div className="screen dashboard track-detail-screen">
      <div className="screen__header dashboard__header">
        <div className="screen__title-wrap">
          <p className="screen__eyebrow">Trilha de Aprendizado</p>
          <h1 className="screen__title">{track.name}</h1>
        </div>
        <span className="badge badge--mint">{track.segments.join(', ')}</span>
      </div>

      <p className="screen__lead" style={{ marginBottom: '24px' }}>
        {track.description}
      </p>

      {courses.length === 0 ? (
        <div className="card" style={{ padding: '24px', textAlign: 'center' }}>
          <IconFileText size={32} className="text-muted" style={{ marginBottom: '12px' }} />
          <p style={{ margin: 0, color: 'var(--text-muted)' }}>
            Conteúdo executável em preparação para esta trilha.
          </p>
        </div>
      ) : (
        courses.map((course) => {
          const modules = getModulesByCourseId(course.courseId);

          return (
            <div key={course.courseId} className="card course-card" style={{ marginBottom: '24px', padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div>
                  <span className="badge badge--secondary" style={{ marginBottom: '4px' }}>Curso Raiz</span>
                  <h2 style={{ fontSize: '20px', margin: '4px 0' }}>{course.title}</h2>
                  <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '14px' }}>{course.description}</p>
                </div>
                <span className="badge badge--primary">{course.difficulty}</span>
              </div>

              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', margin: '16px 0' }}>
                {course.technologies.map((tech) => (
                  <span key={tech.id} className="dashboard__chip--validated" style={{ fontSize: '12px', padding: '4px 8px' }}>
                    {tech.label}
                  </span>
                ))}
              </div>

              <div className="modules-list" style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px' }}>
                {modules.map((mod) => {
                  const lessons = getLessonsByModuleId(mod.moduleId);

                  return (
                    <div
                      key={mod.moduleId}
                      style={{
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: 'var(--radius-md)',
                        padding: '16px',
                      }}
                    >
                      <h3 style={{ fontSize: '16px', marginBottom: '4px', color: 'var(--text-primary)' }}>{mod.title}</h3>
                      <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '12px' }}>{mod.description}</p>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '12px' }}>
                        {lessons.map((lesson) => (
                          <div
                            key={lesson.lessonId}
                            style={{
                              background: 'var(--surface-color, rgba(0,0,0,0.2))',
                              border: '1px solid var(--border-color, rgba(255,255,255,0.1))',
                              borderRadius: 'var(--radius-sm)',
                              padding: '12px',
                              display: 'flex',
                              flexDirection: 'column',
                              justifyContent: 'space-between',
                            }}
                          >
                            <div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                                <IconCheckCircle size={14} className="text-mint" />
                                <strong style={{ fontSize: '14px' }}>{lesson.order}. {lesson.title}</strong>
                              </div>
                              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0 }}>{lesson.briefing}</p>
                            </div>

                            <button
                              type="button"
                              className="btn btn-primary"
                              style={{ marginTop: '12px', padding: '6px 12px', fontSize: '12px' }}
                              onClick={() => onSelectLesson(lesson.lessonId)}
                            >
                              <IconTerminal size={14} style={{ marginRight: '4px' }} />
                              Iniciar Prática
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })
      )}

      <div style={{ marginTop: '24px' }}>
        <button type="button" className="btn btn-secondary" onClick={onBack}>
          <IconArrowLeft size={16} style={{ marginRight: '8px' }} />
          Voltar às Trilhas
        </button>
      </div>
    </div>
  );
}

export default TrackDetailScreen;
