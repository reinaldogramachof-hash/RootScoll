/**
 * @codechat/terminal-engine
 *
 * Fatia mínima da Fase 1 — Shell Core / Terminal Engine Mínimo (Etapa aprovada
 * pelo Arquiteto): núcleo real de execução simulada para 4 comandos da Fase 0
 * (`pwd`, `ls`, `cd`, `mkdir`) sobre um filesystem virtual em memória.
 *
 * Explicitamente FORA de escopo nesta fatia (ver Cérebro Operacional.md):
 * os outros 17 comandos + 3 operadores da Fase 0, parser com pipe/redirect,
 * UI, Supabase, migrations, IA, persistência em disco, sessão real de
 * terminal (`TerminalSession`/histórico/autocomplete — pastas `history` e
 * `autocomplete` do scaffold seguem vazias).
 *
 * Regra vigente: `terminal-engine` só importa tipos de `@codechat/types`
 * (nunca de `apps/web` ou de outra engine) — ver
 * docs/architecture/dependency-rules.md.
 */

export type { TerminalCommandName, TerminalCommandOutcome } from './commands/types';
export type {
  TerminalFilesystemState,
  VirtualDirectoryNode,
  VirtualFileNode,
  VirtualFsNode,
} from './filesystem/types';

export { createInitialFilesystemState } from './filesystem/initial-state';
export { resolvePath } from './filesystem/path';
export {
  createDirectory,
  getNode,
  listDirectory,
  type CreateDirectoryResult,
  type ListDirectoryResult,
} from './filesystem/tree';

export { cd } from './commands/cd';
export { ls } from './commands/ls';
export { mkdir } from './commands/mkdir';
export { pwd } from './commands/pwd';

export { tokenizeCommandLine } from './parser/tokenize';
export { runCommand } from './core/run-command';

export { buildExecutionResult, toFilesystemSnapshot } from './contracts/execution-result';
