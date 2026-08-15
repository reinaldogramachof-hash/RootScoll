/**
 * Estado interno do filesystem virtual em memória — owner conceitual:
 * `terminal-engine` (docs/product/domain-model-v1.md, seção `VirtualFileSystemState`:
 * "a representação/estrutura do FS virtual, em `packages/terminal-engine/src/filesystem`").
 *
 * Tipos puramente internos a esta package — não exportados de `@codechat/types`.
 * A ponte com o contrato agnóstico `VirtualFileSystemSnapshot` (já definido em
 * `@codechat/types`) é feita por `../contracts/execution-result.ts`, nunca ao
 * contrário: o filesystem interno não conhece `ExecutionResult`.
 *
 * Representação escolhida: árvore imutável (`readonly`), copy-on-write em toda
 * mutação (ver `./tree.ts`) — favorece funções puras e testes determinísticos,
 * conforme regra arquitetural desta fatia.
 */

/** Diretório — nó com filhos nomeados (arquivos ou subdiretórios). */
export interface VirtualDirectoryNode {
  readonly kind: 'dir';
  readonly children: Readonly<Record<string, VirtualFsNode>>;
}

/**
 * Arquivo — nesta fatia mínima, nenhum comando cria ou lê arquivos (apenas
 * `mkdir`, que cria diretórios). O tipo já existe para que o filesystem inicial
 * de futuras fatias (ex.: `touch`, `cat`) possa incluir arquivos sem redesenhar
 * a árvore, e para que `toFilesystemSnapshot` (ver `../contracts`) já saiba
 * flatten-ar arquivos quando existirem.
 */
export interface VirtualFileNode {
  readonly kind: 'file';
  readonly content: string;
}

export type VirtualFsNode = VirtualDirectoryNode | VirtualFileNode;

/** Estado completo do filesystem virtual de uma sessão simulada. */
export interface TerminalFilesystemState {
  readonly root: VirtualDirectoryNode;
  /** Diretório de trabalho atual — sempre um caminho absoluto (ex.: '/home/aluno'). */
  readonly cwd: string;
}
