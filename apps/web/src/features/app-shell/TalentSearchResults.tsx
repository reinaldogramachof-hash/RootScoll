import { useState, useMemo } from 'react';
import type { MockTalentProfile } from './types';
import { IconSearch, IconShieldCheck } from './icons';

export interface TalentSearchResultsProps {
  readonly talentPool: readonly MockTalentProfile[];
  readonly onSelectTalent: (talentId: string) => void;
}

/**
 * Motor de busca e filtragem de talentos técnicos para empresas de RH parceiras.
 */
function TalentSearchResults({ talentPool, onSelectTalent }: TalentSearchResultsProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState<string>('todos');
  const [minScore, setMinScore] = useState<number>(0);
  const [sortBy, setSortBy] = useState<'score' | 'progress' | 'evidence'>('score');

  const filteredTalents = useMemo(() => {
    return talentPool
      .filter((talent) => {
        const matchesSearch =
          talent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          talent.headline.toLowerCase().includes(searchTerm.toLowerCase()) ||
          talent.topSkills.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase())) ||
          talent.location.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesAvailability =
          availabilityFilter === 'todos' || talent.availability === availabilityFilter;

        const matchesScore = talent.readinessScore >= minScore;

        return matchesSearch && matchesAvailability && matchesScore;
      })
      .sort((a, b) => {
        if (sortBy === 'score') return b.readinessScore - a.readinessScore;
        if (sortBy === 'progress') return b.overallProgress - a.overallProgress;
        if (sortBy === 'evidence') return b.evidenceCount - a.evidenceCount;
        return 0;
      });
  }, [talentPool, searchTerm, availabilityFilter, minScore, sortBy]);

  return (
    <div className="talent-search-module">
      {/* Barra de Filtros e Busca com Ícones Vetoriais */}
      <div className="talent-search__filters-panel card">
        <div className="talent-search__search-bar search-input-wrapper">
          <IconSearch size={18} className="search-input-icon" />
          <input
            type="text"
            className="input search-input"
            placeholder="Buscar por habilidade (ex: Linux, React, TypeScript), nome ou cargo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="talent-search__filter-row">
          <div className="talent-search__filter-group">
            <label>Disponibilidade:</label>
            <select
              value={availabilityFilter}
              onChange={(e) => setAvailabilityFilter(e.target.value)}
              className="input talent-search__select"
            >
              <option value="todos">Todas as Disponibilidades</option>
              <option value="Disponível imediatamente">Disponível imediatamente</option>
              <option value="Em formação (estágio)">Em formação (estágio)</option>
              <option value="Em transição de carreira">Em transição de carreira</option>
            </select>
          </div>

          <div className="talent-search__filter-group">
            <label>Prontidão Mínima:</label>
            <select
              value={minScore}
              onChange={(e) => setMinScore(Number(e.target.value))}
              className="input talent-search__select"
            >
              <option value={0}>Qualquer Prontidão</option>
              <option value={80}>80%+ (Pronto para Júnior)</option>
              <option value={90}>90%+ (Destaque Técnico)</option>
            </select>
          </div>

          <div className="talent-search__filter-group">
            <label>Ordenar por:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'score' | 'progress' | 'evidence')}
              className="input talent-search__select"
            >
              <option value="score">Maior Prontidão Técnica</option>
              <option value="progress">Maior Progresso Geral</option>
              <option value="evidence">Mais Evidências Práticas</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid de Cards de Talentos */}
      <div className="talent-search__results-header">
        <h2>{filteredTalents.length} Talentos Encontrados</h2>
        <span className="talent-search__hint">
          <IconShieldCheck
            size={14}
            className="text-mint"
            style={{ marginRight: 4, display: 'inline-block', verticalAlign: 'middle' }}
          />
          Evidências de código validadas deterministicamente no terminal
        </span>
      </div>

      <div className="talent-cards-grid">
        {filteredTalents.map((talent) => (
          <article key={talent.id} className="card talent-card">
            <div className="talent-card__header">
              <div className="talent-card__avatar">
                {talent.name
                  .split(' ')
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join('')}
              </div>
              <div className="talent-card__info">
                <h3 className="talent-card__name">{talent.name}</h3>
                <p className="talent-card__headline">{talent.headline}</p>
                <span className="talent-card__location">📍 {talent.location}</span>
              </div>
              <div className="talent-card__score">
                <span className="score-label">Prontidão</span>
                <span className="score-value">{talent.readinessScore}%</span>
              </div>
            </div>

            <p className="talent-card__bio">{talent.bio}</p>

            <div className="talent-card__skills">
              {talent.topSkills.map((skill) => (
                <span key={skill} className="badge badge--neutral">
                  {skill}
                </span>
              ))}
            </div>

            <div className="talent-card__metrics">
              <div className="talent-metric">
                <span>Progresso</span>
                <strong>{talent.overallProgress}%</strong>
              </div>
              <div className="talent-metric">
                <span>Evidências</span>
                <strong>{talent.evidenceCount} itens</strong>
              </div>
              <div className="talent-metric">
                <span>Status</span>
                <strong className="text-mint">{talent.availability}</strong>
              </div>
            </div>

            <div className="talent-card__footer">
              <button
                type="button"
                className="btn btn-primary btn--block"
                onClick={() => onSelectTalent(talent.id)}
              >
                Ver Portfólio & Evidências →
              </button>
            </div>
          </article>
        ))}

        {filteredTalents.length === 0 && (
          <div className="card talent-search__empty">
            <IconSearch size={28} className="text-muted" style={{ marginBottom: 8 }} />
            <h3>Nenhum talento encontrado com os filtros atuais.</h3>
            <p>Tente ajustar os termos de pesquisa ou remover os filtros de prontidão.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default TalentSearchResults;
