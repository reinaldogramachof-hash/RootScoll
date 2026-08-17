import { useState } from 'react';
import type { MockClassroom } from './types';

export interface ClassroomDetailScreenProps {
  readonly classroom: MockClassroom;
  readonly onBack: () => void;
}

/**
 * Tela de detalhe da turma selecionada pelo professor.
 * Mostra visão nominal de progresso, status por aluno e matriz de competências.
 */
function ClassroomDetailScreen({ classroom, onBack }: ClassroomDetailScreenProps) {
  const [filter, setFilter] = useState<'todos' | 'em-risco' | 'ativo' | 'concluido'>('todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);

  const filteredStudents = classroom.students.filter((std) => {
    const matchesFilter = filter === 'todos' || std.status === filter;
    const matchesSearch =
      std.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      std.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="screen classroom-detail-screen">
      <header className="screen__header">
        <div>
          <button type="button" className="btn btn-secondary btn--sm" onClick={onBack}>
            ← Voltar para Todas as Turmas
          </button>
          <div className="screen__title-wrap" style={{ marginTop: '0.75rem' }}>
            <p className="screen__eyebrow">
              Código: {classroom.code} • {classroom.trackTitle}
            </p>
            <h1 className="screen__title">{classroom.name}</h1>
          </div>
        </div>

        <div className="classroom-detail__header-stats">
          <div className="classroom-detail__stat-chip">
            <span>Matriculados:</span>
            <strong>{classroom.studentsCount}</strong>
          </div>
          <div className="classroom-detail__stat-chip">
            <span>Média:</span>
            <strong>{classroom.averageProgress}%</strong>
          </div>
        </div>
      </header>

      {/* Gargalos da Turma */}
      {classroom.bottlenecks.length > 0 && (
        <section className="classroom-detail__bottlenecks" aria-label="Gargalos desta turma">
          <h2 className="classroom-detail__section-title">Gargalos Específicos Desta Turma</h2>
          <div className="classroom-detail__bottlenecks-list">
            {classroom.bottlenecks.map((bot) => (
              <div key={bot.id} className={`bottleneck-alert bottleneck-alert--${bot.severity}`}>
                <div className="bottleneck-alert__icon">⚠️</div>
                <div className="bottleneck-alert__content">
                  <strong>
                    {bot.moduleTitle} ({bot.failureRate}% falhas)
                  </strong>
                  <p>{bot.recommendedAction}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Gestão Nominal dos Alunos */}
      <section className="classroom-detail__students-section">
        <div className="classroom-detail__controls">
          <div className="classroom-detail__search">
            <input
              type="text"
              className="input"
              placeholder="Buscar aluno por nome ou e-mail..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="classroom-detail__filter-tabs">
            <button
              type="button"
              className={`filter-tab ${filter === 'todos' ? 'filter-tab--active' : ''}`}
              onClick={() => setFilter('todos')}
            >
              Todos ({classroom.students.length})
            </button>
            <button
              type="button"
              className={`filter-tab ${filter === 'em-risco' ? 'filter-tab--active' : ''}`}
              onClick={() => setFilter('em-risco')}
            >
              Travados / Em Risco (
              {classroom.students.filter((s) => s.status === 'em-risco').length})
            </button>
            <button
              type="button"
              className={`filter-tab ${filter === 'ativo' ? 'filter-tab--active' : ''}`}
              onClick={() => setFilter('ativo')}
            >
              Ativos ({classroom.students.filter((s) => s.status === 'ativo').length})
            </button>
            <button
              type="button"
              className={`filter-tab ${filter === 'concluido' ? 'filter-tab--active' : ''}`}
              onClick={() => setFilter('concluido')}
            >
              Concluídos ({classroom.students.filter((s) => s.status === 'concluido').length})
            </button>
          </div>
        </div>

        <div className="classroom-detail__table-wrap">
          <table className="classroom-detail__table">
            <thead>
              <tr>
                <th>Aluno</th>
                <th>Status</th>
                <th>Progresso</th>
                <th>Evidências</th>
                <th>Última Atividade</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((std) => (
                <tr key={std.id} className={std.status === 'em-risco' ? 'row--warning' : ''}>
                  <td>
                    <div className="student-cell">
                      <strong>{std.name}</strong>
                      <span>{std.email}</span>
                      {std.currentBottleneck && (
                        <span className="student-cell__bottleneck">
                          Gargalo: {std.currentBottleneck}
                        </span>
                      )}
                    </div>
                  </td>
                  <td>
                    <span
                      className={`badge badge--${std.status === 'em-risco' ? 'warning' : std.status === 'concluido' ? 'primary' : 'secondary'}`}
                    >
                      {std.status === 'em-risco'
                        ? 'Em Risco'
                        : std.status === 'concluido'
                          ? 'Concluído'
                          : 'Ativo'}
                    </span>
                  </td>
                  <td>
                    <div className="student-progress-cell">
                      <span>{std.progress}%</span>
                      <div className="dashboard__meter" aria-hidden="true">
                        <span style={{ width: `${std.progress}%` }} />
                      </div>
                    </div>
                  </td>
                  <td>
                    <strong>{std.evidenceCount}</strong> registros
                  </td>
                  <td>{std.lastActive}</td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-secondary btn--xs"
                      onClick={() =>
                        setSelectedStudentId(selectedStudentId === std.id ? null : std.id)
                      }
                    >
                      {selectedStudentId === std.id ? 'Fechar Detalhes' : 'Ver Competências'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredStudents.length === 0 && (
            <p className="classroom-detail__empty">
              Nenhum aluno encontrado para os filtros selecionados.
            </p>
          )}
        </div>

        {/* Modal / Card Expandido de Competências do Aluno */}
        {selectedStudentId && (
          <div className="student-competencies-card card">
            {(() => {
              const student = classroom.students.find((s) => s.id === selectedStudentId);
              if (!student) return null;
              return (
                <div>
                  <div className="student-competencies-card__header">
                    <div>
                      <h3>Matriz de Competências: {student.name}</h3>
                      <p>
                        {student.currentPhase} • {student.email}
                      </p>
                    </div>
                    <button
                      type="button"
                      className="btn btn-secondary btn--xs"
                      onClick={() => setSelectedStudentId(null)}
                    >
                      ✕ Fechar
                    </button>
                  </div>

                  <div className="student-competencies-card__grid">
                    <div>
                      <h4 className="text-mint">Competências Validadas no Terminal</h4>
                      <ul className="competency-list competency-list--done">
                        {student.completedCompetencies.map((comp) => (
                          <li key={comp}>✓ {comp}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-warning">Competências Pendentes / Em Foco</h4>
                      <ul className="competency-list competency-list--pending">
                        {student.pendingCompetencies.map((comp) => (
                          <li key={comp}>⏳ {comp}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </section>
    </div>
  );
}

export default ClassroomDetailScreen;
