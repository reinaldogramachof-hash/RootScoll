import type { MockTalentProfile, MockUser, PartnerCompany } from './types';
import TalentSearchResults from './TalentSearchResults';

export interface PartnerDashboardProps {
  readonly user: MockUser;
  readonly partnerCompany: PartnerCompany;
  readonly talentPool: readonly MockTalentProfile[];
  readonly onSelectTalent: (talentId: string) => void;
  readonly onOpenProfile: () => void;
}

/**
 * Painel Principal dos Parceiros (RH & Empresas Contratantes).
 * Central de busca de talentos com evidências técnicas comprovadas pelo Modo Raiz.
 */
function PartnerDashboard({
  user,
  partnerCompany,
  talentPool,
  onSelectTalent,
}: PartnerDashboardProps) {
  const readyForHireCount = talentPool.filter((t) => t.readinessScore >= 85).length;
  const totalEvidences = talentPool.reduce((acc, t) => acc + t.evidenceCount, 0);

  return (
    <div className="screen dashboard partner-dashboard">
      <header className="screen__header dashboard__header">
        <div className="screen__title-wrap">
          <p className="screen__eyebrow">
            {partnerCompany.name} • {partnerCompany.segment}
          </p>
          <h1 className="screen__title">Portal de Talentos: {user.name}</h1>
        </div>

        <div className="partner-dashboard__header-badge">
          <span className="badge badge--secondary">Acesso RH Parceiro</span>
        </div>
      </header>

      {/* Métricas do Ecossistema */}
      <div className="dashboard__metrics" aria-label="Métricas do banco de talentos">
        <div className="dashboard__metric">
          <span className="dashboard__metric-label">Talentos Disponíveis</span>
          <strong>{talentPool.length}</strong>
          <span className="partner-dashboard__metric-sub">No radar de contratação</span>
        </div>
        <div className="dashboard__metric dashboard__metric--accent">
          <span className="dashboard__metric-label">Prontos para Júnior (85%+)</span>
          <strong>{readyForHireCount}</strong>
          <span className="partner-dashboard__metric-sub text-mint">Alta prontidão técnica</span>
        </div>
        <div className="dashboard__metric">
          <span className="dashboard__metric-label">Evidências Auditadas</span>
          <strong>{totalEvidences}</strong>
          <span className="partner-dashboard__metric-sub">Scripts e projetos validados</span>
        </div>
        <div className="dashboard__metric dashboard__metric--secondary">
          <span className="dashboard__metric-label">Vagas Ativas na Empresa</span>
          <strong>{partnerCompany.activeSearches}</strong>
          <span className="partner-dashboard__metric-sub">
            {partnerCompany.shortlistedCount} na shortlist
          </span>
        </div>
      </div>

      {/* Banner de Diferencial Técnico */}
      <section className="card partner-manifesto" aria-label="Diferencial dos talentos RootScoll">
        <div className="partner-manifesto__content">
          <span className="partner-manifesto__tag">Metodologia RootScoll</span>
          <h2>Talentos Formados no Modo Raiz</h2>
          <p>
            Diferente de cursos tradicionais onde o aluno copia código ou depende de respostas
            automáticas de IA, os profissionais da RootScoll aprendem a{' '}
            <strong>operar sistemas de arquivos reais</strong>,
            <strong>escrever e ler logs de terminal</strong>,{' '}
            <strong>versionar com disciplina no Git</strong> e
            <strong>construir arquiteturas limpas</strong>.
          </p>
        </div>
      </section>

      {/* Busca e Lista de Talentos */}
      <section className="partner-search-section">
        <TalentSearchResults talentPool={talentPool} onSelectTalent={onSelectTalent} />
      </section>
    </div>
  );
}

export default PartnerDashboard;
