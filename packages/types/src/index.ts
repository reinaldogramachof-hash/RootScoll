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
