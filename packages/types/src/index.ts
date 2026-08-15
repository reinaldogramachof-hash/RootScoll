/**
 * @codechat/types
 *
 * Contratos e tipos compartilhados entre engines e apps (ver
 * docs/architecture/dependency-rules.md, seção "Types").
 *
 * Fatia mínima da Fase 1 (Etapa aprovada pelo Arquiteto): apenas os tipos
 * necessários para representar o fluxo
 *   CommandAttempt -> ExecutionRequest -> ExecutionResult -> ValidationRule
 * descrito em docs/architecture/engine-contracts-v1.md e o vocabulário de
 * validadores descrito em docs/architecture/validation-grammar-v1.md.
 *
 * Explicitamente FORA de escopo nesta fatia (ver Cérebro Operacional.md):
 * parser real, terminal real, execução real de comandos, filesystem
 * mutável, validadores reais (funções), Supabase, migrations, UI.
 *
 * Decisão arquitetural vigente (aprovada nesta etapa):
 * - `ExecutionResult` nunca referencia `Challenge`, `ChallengeProgress` ou
 *   `ValidationRule` — ver seção "O que não pode vazar para a regra
 *   pedagógica" em engine-contracts-v1.md, seção 2.
 * - Na Fase 1 inicial, cada lição da Fase 0 mapeia para uma `Lesson` com um
 *   `Challenge` principal implícito; `Step` permanece reservado para
 *   evolução futura e não é modelado como tipo operacional nesta fatia.
 */

// ---------------------------------------------------------------------------
// Identificadores de ambiente e adapter de execução
// ---------------------------------------------------------------------------

/**
 * Perfis de ambiente simulado suportados pelo terminal-engine.
 * Ver docs/product/domain-model-v1.md, seção "EnvironmentProfile", e
 * packages/terminal-engine/src/profiles.
 */
export type EnvironmentProfileId = 'linux' | 'macos' | 'windows-cmd' | 'powershell';

/**
 * Adapters de execução suportados pela execution-engine.
 * Ver docs/architecture/execution-engine.md e
 * packages/execution-engine/src/adapters.
 */
export type ExecutionAdapterId = 'virtual-shell' | 'pyodide' | 'webcontainer' | 'remote-runner';

// ---------------------------------------------------------------------------
// Referências de origem (fronteira terminal-engine <-> execution-engine)
// ---------------------------------------------------------------------------

/**
 * Referência opaca a um `CommandAttempt` (owner: terminal-engine).
 * Apenas o identificador é modelado aqui — o registro completo (texto
 * digitado, timestamp) pertence a terminal-engine e não é duplicado em
 * `@codechat/types` nesta fatia.
 */
export interface CommandAttemptRef {
  readonly commandAttemptId: string;
}

/**
 * Referência opaca a uma `ExecutionRequest` — o contrato puramente técnico
 * entre terminal-engine e execution-engine (engine-contracts-v1.md, seção 1).
 * Não representa progresso pedagógico e não conhece `Challenge`.
 */
export interface ExecutionRequestRef {
  readonly executionRequestId: string;
  readonly commandAttempt: CommandAttemptRef;
  /** EnvironmentProfile vigente no momento do pedido de execução. */
  readonly environmentProfileId: EnvironmentProfileId;
}

// ---------------------------------------------------------------------------
// Filesystem virtual (recorte exposto dentro de ExecutionResult)
// ---------------------------------------------------------------------------

/** Entrada individual do snapshot do filesystem virtual. */
export interface VirtualFileEntry {
  readonly path: string;
  readonly kind: 'file' | 'dir';
  /** Conteúdo textual — aplicável somente quando `kind === 'file'`. */
  readonly content?: string;
  /** Representação textual de permissão (ex.: '755'), quando aplicável. */
  readonly permissions?: string;
}

/**
 * Recorte do `VirtualFileSystemState` (owner: terminal-engine) relevante
 * para validação, embutido em `ExecutionResult`. Não é o filesystem inteiro
 * persistido — é dado suficiente para que uma `ValidationRule` avalie os
 * tipos "existe" / "conteudo" / "linhas" / "cwd" / "permissao" da
 * validation-grammar-v1.md sem acessar `VirtualFileSystemState` bruto.
 */
export interface VirtualFileSystemSnapshot {
  readonly cwd: string;
  readonly entries: readonly VirtualFileEntry[];
}

// ---------------------------------------------------------------------------
// ExecutionResult
// ---------------------------------------------------------------------------

/**
 * Formato estável e engine-agnóstico pelo qual `lesson-engine` "enxerga" o
 * que aconteceu no terminal (engine-contracts-v1.md, seção 2). Produzido
 * por execution-engine sem qualquer conhecimento de `Challenge`.
 *
 * Nunca deve carregar: referência a `Challenge`, `ChallengeProgress` ou
 * `ValidationRule`; detalhes internos de sandboxing/processos/rede.
 */
export interface ExecutionResult {
  /** Referência à ExecutionRequest/CommandAttempt de origem. */
  readonly origin: ExecutionRequestRef;
  /** Texto do comando efetivamente executado (uso restrito ao validador de exceção `comando_executado`). */
  readonly command: string;
  readonly stdout: string;
  readonly stderr: string;
  readonly exitCode: number;
  readonly durationMs: number;
  readonly adapterId: ExecutionAdapterId;
  readonly filesystem: VirtualFileSystemSnapshot;
  /** Timestamp de conclusão em formato ISO 8601. */
  readonly completedAt: string;
}

// ---------------------------------------------------------------------------
// ValidationRule — vocabulário técnico para docs/architecture/validation-grammar-v1.md
// ---------------------------------------------------------------------------

/** Categoria "estrutura" — `{ tipo: existe, caminho, como }`. */
export interface ValidationRuleFileExists {
  readonly kind: 'file-exists';
  readonly path: string;
  readonly as: 'file' | 'dir';
}

/** Categoria "estrutura" — `{ tipo: nao_existe, caminho }`. */
export interface ValidationRuleFileNotExists {
  readonly kind: 'file-not-exists';
  readonly path: string;
}

/** Categoria "estrutura" — `{ tipo: contagem, caminho, glob, min, max }`. */
export interface ValidationRuleFileCount {
  readonly kind: 'file-count';
  readonly path: string;
  readonly glob: string;
  readonly min?: number;
  readonly max?: number;
}

/**
 * Categoria "conteúdo" — `{ tipo: conteudo, caminho, contem|igual|regex }`.
 * O grammar de conteúdo autoral aceita exatamente uma das três formas de
 * comparação por bloco; modelado aqui como sub-união discriminada por `match`.
 */
export type ValidationRuleFileContent = {
  readonly kind: 'file-content';
  readonly path: string;
} & (
  | { readonly match: 'contains'; readonly value: string }
  | { readonly match: 'equals'; readonly value: string }
  | { readonly match: 'regex'; readonly pattern: string }
);

/** Categoria "conteúdo" — `{ tipo: linhas, caminho, min }`. */
export interface ValidationRuleLineCount {
  readonly kind: 'line-count';
  readonly path: string;
  readonly min?: number;
  readonly max?: number;
}

/** Categoria "contexto" — `{ tipo: cwd, caminho }`. */
export interface ValidationRuleCwd {
  readonly kind: 'cwd';
  readonly path: string;
}

/** Categoria "contexto" — `{ tipo: permissao, caminho, modo }`. */
export interface ValidationRulePermission {
  readonly kind: 'permission';
  readonly path: string;
  readonly mode: string;
}

/** Categoria "execução" (validação de saída) — `{ tipo: saida_contem, texto, ultimo_comando }`. */
export interface ValidationRuleOutputContains {
  readonly kind: 'output-contains';
  readonly text: string;
  readonly lastCommandOnly?: boolean;
}

/** Categoria "execução" (validação de código de saída) — `{ tipo: codigo_saida, valor }`. */
export interface ValidationRuleExitCode {
  readonly kind: 'exit-code';
  readonly value: number;
}

/**
 * Categoria "execução" (validação de comando executado) — `{ tipo:
 * comando_executado, padrao, min_vezes }`. Uso restrito à exceção
 * pedagógica consciente descrita na "regra de ouro" (validation-grammar-v1.md,
 * seção 1) — validar pelo comando digitado em vez do resultado é erro de
 * conteúdo fora desse caso.
 */
export interface ValidationRuleCommandExecuted {
  readonly kind: 'command-executed';
  readonly pattern: string;
  readonly minTimes?: number;
}

/** Um validador "folha" — corresponde a um único bloco YAML sem composição. */
export type ValidationLeafRule =
  | ValidationRuleFileExists
  | ValidationRuleFileNotExists
  | ValidationRuleFileCount
  | ValidationRuleFileContent
  | ValidationRuleLineCount
  | ValidationRuleCwd
  | ValidationRulePermission
  | ValidationRuleOutputContains
  | ValidationRuleExitCode
  | ValidationRuleCommandExecuted;

/**
 * Composição lógica (validation-grammar-v1.md, seção 3). O "E lógico" da
 * gramática é a própria lista de `ValidationRule`s de um `Challenge` — não
 * precisa de um wrapper próprio. Apenas "OU" (`qualquer_um`) e "NÃO"
 * (`nenhum`) são construções compostas explícitas.
 */
export type ValidationCompositeRule =
  | { readonly kind: 'any'; readonly rules: readonly ValidationRule[] }
  | { readonly kind: 'none'; readonly rules: readonly ValidationRule[] };

/**
 * Regra que determina se um `ExecutionResult` satisfaz o objetivo de um
 * `Challenge` (domain-model-v1.md, seção "ValidationRule"). Modela apenas a
 * FORMA/parâmetros da regra — o dado consumido por uma função pura
 * `(ExecutionResult, ValidationRule) -> ValidationOutcome` a ser
 * implementada por `lesson-engine` em etapa futura (fora de escopo aqui).
 * O conjunto de regras de um `Challenge` é `readonly ValidationRule[]`
 * (lista = E lógico, ver acima).
 */
export type ValidationRule = ValidationLeafRule | ValidationCompositeRule;

// ---------------------------------------------------------------------------
// Veredito de validação
// ---------------------------------------------------------------------------

/**
 * Veredito conceitual de uma validação (engine-contracts-v1.md, seção 3):
 * sucesso, falha, ou parcial quando aplicável.
 */
export type ValidationVerdict = 'success' | 'failure' | 'partial';

/**
 * Resultado completo da avaliação de uma `ValidationRule`: o veredito mais
 * a mensagem/feedback associada (ex.: usada para decidir se um `Hint` deve
 * ser oferecido).
 */
export interface ValidationOutcome {
  readonly verdict: ValidationVerdict;
  readonly message?: string;
}

// =============================================================================
// Learning Catalog v1
// =============================================================================
//
// Fase completa aprovada pelo Arquiteto: contratos mínimos para organizar o
// CodeChat por trilhas, cursos, módulos, lições e desafios (ver
// docs/product/learning-catalog-v1.md e docs/product/product-vision-v1.md).
//
// Hierarquia (docs/product/domain-model-v1.md, seções "Course"/"Module"/
// "Lesson"/"Challenge"): Track (nova camada, acima de Course) -> Course ->
// Module -> Lesson -> Challenge. `Step` permanece fora do catálogo nesta
// fase, consistente com a decisão já registrada na fatia mínima da Fase 1
// ("Lesson com Challenge principal implícito; Step reservado para evolução
// futura").
//
// Explicitamente FORA de escopo nesta fase: parser real, terminal real,
// execução real, filesystem mutável, validadores reais (funções), Supabase,
// migrations, UI, e qualquer IA executável — IA aparece apenas como
// referência futura em docs/product/product-vision-v1.md, nunca como tipo
// ou contrato de catálogo executável aqui.

// ---------------------------------------------------------------------------
// Segmentos, trilhas e linguagens
// ---------------------------------------------------------------------------

/**
 * Segmento de conteúdo — a granularidade usada para decidir requisitos de
 * runtime (ver `RuntimeRequirement`) e para compor `LearningTrack.segments`.
 * Conjunto fechado, derivado literalmente da lista de expansão registrada em
 * `docs/product/product-vision-v1.md` ("Trilhas estrategicas") e nas regras
 * de produto desta etapa.
 */
export type LearningSegment =
  | 'linux'
  | 'macos'
  | 'windows-cmd'
  | 'powershell'
  | 'git'
  | 'html'
  | 'css'
  | 'javascript'
  | 'python'
  | 'java'
  | 'php'
  | 'nodejs'
  | 'database'
  | 'deploy'
  | 'testing'
  | 'debugging'
  | 'cybersecurity'
  | 'information-security'
  | 'secure-development'
  | 'digital-risk';

/**
 * Identificador das 6 trilhas estratégicas registradas em
 * `docs/product/product-vision-v1.md` ("Trilhas estrategicas").
 */
export type LearningTrackId =
  'terminal-os' | 'git-github' | 'web' | 'programming' | 'professional-practice' | 'cybersecurity';

/**
 * Trilha — camada acima de `Course` (decisão arquitetural desta fase: "Track
 * é a camada acima de Course"). Agrupa `LearningSegment`s relacionados; não
 * agrupa `CourseCatalogEntry`s diretamente — essa associação é feita por
 * `CourseCatalogEntry.trackId` (evita duplicar a lista de cursos em dois
 * lugares).
 */
export interface LearningTrack {
  readonly trackId: LearningTrackId;
  readonly name: string;
  readonly description: string;
  readonly segments: readonly LearningSegment[];
}

/**
 * Linguagens de programação previstas para a trilha `programming`
 * (`docs/product/product-vision-v1.md`: "Python, Java, PHP, Node.js e outras
 * linguagens conforme prioridade de produto"). Conjunto inicial, deve
 * crescer por decisão de produto — não é o mesmo conjunto que
 * `LearningSegment`: `ProgrammingLanguageId` identifica a linguagem
 * ensinada por um `CourseCatalogEntry`; `LearningSegment` é a taxonomia mais
 * ampla usada para runtime/trilha.
 */
export type ProgrammingLanguageId = 'python' | 'java' | 'php' | 'javascript' | 'nodejs';

// ---------------------------------------------------------------------------
// Tags, dificuldade e requisitos de runtime
// ---------------------------------------------------------------------------

/**
 * Tag de tecnologia associada a um `CourseCatalogEntry`/`LessonCatalogEntry`
 * (domain-model-v1.md, `Course`: "tecnologias abordadas ... etc." — conjunto
 * explicitamente aberto). Modelada como dado estruturado (não como união
 * fechada de string) para permitir novas tecnologias sem alterar este
 * arquivo a cada tag — ao custo de não ter checagem exaustiva em tempo de
 * compilação; ver decisão local no Implementation Report.
 */
export interface TechnologyTag {
  readonly id: string;
  readonly label: string;
}

/**
 * Nível de dificuldade — 3 níveis, herdado literalmente do campo conceitual
 * já aprovado em domain-model-v1.md (`Course`: "nível
 * (iniciante/intermediário/avançado)"). Não é o mesmo campo que o `nivel`
 * numérico (1 a 4) usado por lição em `docs/product/curriculum-phase-0.md`
 * — ver `LessonCatalogEntry.sourceLevel` para a preservação desse dado
 * original.
 */
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

/**
 * Nivel numerico original das licoes da Fase 0. Mantido apenas como dado de
 * origem em `LessonCatalogEntry.sourceLevel`; a dificuldade semantica do
 * catalogo continua em `DifficultyLevel`.
 */
export type PhaseZeroSourceLevel = 1 | 2 | 3 | 4;

/**
 * Requisito de runtime de um `LessonCatalogEntry` — qual adapter de
 * `execution-engine` (`ExecutionAdapterId`, já definido na fatia mínima da
 * Fase 1) e, quando aplicável, qual `EnvironmentProfileId` uma lição exige.
 * Dado puro: não decide roteamento nem executa nada — apenas declara o
 * requisito, consistente com "ExecutionRequest é um contrato puramente
 * técnico" (engine-contracts-v1.md).
 */
export interface RuntimeRequirement {
  readonly adapterId: ExecutionAdapterId;
  readonly environmentProfileId?: EnvironmentProfileId;
}

// ---------------------------------------------------------------------------
// Catálogo: Course -> Module -> Lesson -> Challenge
// ---------------------------------------------------------------------------

/**
 * Entrada de catálogo de um `Course` (domain-model-v1.md, `Course`: "a
 * maior unidade de conteúdo — um percurso completo"). Pertence a exatamente
 * uma `LearningTrack` via `trackId`. `moduleIds` preserva a ordem dos
 * módulos (mesma convenção de "ordem de módulos" do campo conceitual de
 * `Course`), sem embutir os módulos inteiros — cada `ModuleCatalogEntry` é
 * uma entidade de catálogo independente, referenciada por id.
 */
export interface CourseCatalogEntry {
  readonly courseId: string;
  readonly trackId: LearningTrackId;
  readonly title: string;
  readonly description: string;
  readonly difficulty: DifficultyLevel;
  readonly technologies: readonly TechnologyTag[];
  readonly moduleIds: readonly string[];
  readonly publicationStatus: 'draft' | 'published';
}

/**
 * Entrada de catálogo de um `Module` (domain-model-v1.md, `Module`:
 * "agrupamento intermediário de Lessons dentro de um Course"). `order`
 * expressa a progressão sugerida dentro do `Course` (não necessariamente
 * obrigatória — ver Domain Model v1, "Riscos/observações" de `Module`).
 */
export interface ModuleCatalogEntry {
  readonly moduleId: string;
  readonly courseId: string;
  readonly title: string;
  readonly description: string;
  readonly order: number;
  readonly lessonIds: readonly string[];
}

/**
 * Entrada de catálogo de uma `Lesson` (domain-model-v1.md, `Lesson`:
 * "unidade de ensino específica dentro de um Module"). `challengeIds` é
 * tipicamente um único id nesta fase, refletindo a decisão já registrada na
 * fatia mínima da Fase 1 ("cada lição da Fase 0 mapeia para uma Lesson com
 * um Challenge principal implícito"); o tipo permite mais de um para não
 * fechar a porta a `Lesson`s compostas por múltiplos desafios no futuro.
 * `sourceLevel` preserva o `nivel` (1 a 4) original de
 * `docs/product/curriculum-phase-0.md` quando a lição vem da Fase 0 — ver
 * `DifficultyLevel` para o campo semântico equivalente de 3 níveis.
 */
export interface LessonCatalogEntry {
  readonly lessonId: string;
  readonly moduleId: string;
  readonly title: string;
  readonly learningObjective: string;
  readonly order: number;
  readonly segment: LearningSegment;
  readonly difficulty: DifficultyLevel;
  readonly runtime: RuntimeRequirement;
  readonly challengeIds: readonly string[];
  readonly sourceLevel?: PhaseZeroSourceLevel;
}

/**
 * Entrada de catálogo de um `Challenge` (domain-model-v1.md, `Challenge`:
 * "um desafio prático que exige uma ação do aluno no terminal").
 * `validationRules` reaproveita `ValidationRule` (já definido na fatia
 * mínima da Fase 1), reafirmando que o catálogo não introduz um segundo
 * vocabulário de validação — apenas referencia o já aprovado.
 */
export interface ChallengeCatalogEntry {
  readonly challengeId: string;
  readonly lessonId: string;
  readonly prompt: string;
  readonly expectedOutcome: string;
  readonly validationRules: readonly ValidationRule[];
  readonly environmentProfileId?: EnvironmentProfileId;
  readonly maxAttempts?: number;
}

// =============================================================================
// Runtime Requirements v1
// =============================================================================
//
// Fase aprovada pelo Arquiteto: formaliza, como dado puro, as restrições
// conceituais de cada ExecutionAdapterId (já definido na fatia mínima da
// Fase 1) e complementa RuntimeRequirement (Learning Catalog v1), que já
// declarava qual adapter uma Lesson exige. Ver
// docs/architecture/runtime-requirements-v1.md para o raciocínio completo,
// a tabela de restrições e a nota sobre Segurança Cibernética.
//
// Explicitamente FORA de escopo nesta fase: implementação real de sandbox,
// rede, filesystem, roteamento de execução, parser, comandos, terminal real,
// Supabase, migrations, UI ou IA executável. Os tipos abaixo declaram
// requisitos/restrições — não os aplicam nem os fazem cumprir.

/**
 * Acesso de rede declarado para um adapter — dado descritivo, não imposição
 * real (a aplicação de fato pertence a `execution-engine`, fora de escopo
 * aqui). Ver docs/architecture/runtime-requirements-v1.md, seção "Restrições
 * conceituais por adapter".
 */
export type RuntimeNetworkAccess = 'none' | 'restricted' | 'full';

/**
 * Mutabilidade do filesystem exposto ao aluno por um adapter.
 * `'none'`: sem escrita. `'ephemeral'`: grava mas descarta ao fim da
 * execução. `'session-persistent'`: grava e mantém durante a sessão do
 * aluno, nunca entre sessões (persistência entre sessões exigiria storage
 * real, fora de escopo).
 */
export type RuntimeFilesystemMutability = 'none' | 'ephemeral' | 'session-persistent';

/**
 * Como um adapter executa o "processo" do comando do aluno. `'simulated'`:
 * nenhum processo real — um parser/simulador interpreta (ex.:
 * `virtual-shell`). `'sandboxed'`: processo real, porém isolado (WASM ou
 * container de navegador). `'delegated'`: executado fora do processo do
 * cliente, por um serviço controlado (ex.: `remote-runner` via
 * `apps/runner`).
 */
export type RuntimeProcessExecution = 'simulated' | 'sandboxed' | 'delegated';

/**
 * Persistência de estado entre execuções distintas do mesmo aluno.
 * `'durable'` (mantido entre sessões) não é usado por nenhum adapter nesta
 * fase — implicaria storage real (Supabase ou equivalente), fora de escopo.
 */
export type RuntimePersistence = 'none' | 'session' | 'durable';

/** Mecanismo de isolamento/sandbox declarado para um adapter. */
export type RuntimeSandboxIsolation =
  'interpreter' | 'wasm' | 'browser-container' | 'remote-service';

/**
 * Restrições conceituais declaradas para um `ExecutionAdapterId` — dado
 * puro, documentação em forma de tipo. Não implementa sandbox, rede,
 * filesystem ou qualquer mecanismo real; apenas declara o que cada adapter
 * deve respeitar quando `execution-engine` for implementada de fato. Ver
 * docs/architecture/runtime-requirements-v1.md para a tabela completa, a
 * justificativa de cada valor e a nota específica sobre a trilha
 * `cybersecurity` (que exige restrições adicionais além deste piso mínimo
 * antes de qualquer exercício prático).
 */
export interface RuntimeAdapterProfile {
  readonly adapterId: ExecutionAdapterId;
  readonly networkAccess: RuntimeNetworkAccess;
  readonly filesystemMutability: RuntimeFilesystemMutability;
  readonly processExecution: RuntimeProcessExecution;
  readonly persistence: RuntimePersistence;
  readonly sandboxIsolation: RuntimeSandboxIsolation;
  /**
   * Hooks de telemetria previstos para o futuro — apenas identificadores
   * nominais (ex.: `'execution-duration'`, `'sandbox-violation'`); nenhuma
   * coleta real é implementada nesta fase. Campo ausente/lista vazia
   * significa "nenhum hook definido ainda", não "telemetria desabilitada por
   * decisão de produto" — essa decisão pertence à futura estratégia de
   * telemetria já registrada como pendência em `Cérebro Operacional.md`.
   */
  readonly telemetryHooksPlanned?: readonly string[];
}
