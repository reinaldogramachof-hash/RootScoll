/**
 * @codechat/terminal-engine
 *
 * Fase 1 do terminal-engine, construída em duas fatias aprovadas pelo
 * Arquiteto:
 * 1. Shell Core / Terminal Engine Mínimo — `pwd`, `ls`, `cd`, `mkdir`.
 * 2. Comandos de arquivos e manipulação básica (esta fatia) — `touch`,
 *    `cat`, `echo`, `cp`, `mv`, `rm`, `tree`.
 *
 * Tudo sobre o mesmo filesystem virtual em memória, 100% imutável
 * (copy-on-write) — ver `./filesystem`.
 *
 * Explicitamente FORA de escopo nesta fatia (ver Cérebro Operacional.md):
 * os 10 comandos + 3 operadores restantes da Fase 0, pipe, redirecionamento,
 * permissões/chmod, UI, Supabase, migrations, IA, persistência em disco,
 * sessão real de terminal (`TerminalSession`/histórico/autocomplete —
 * pastas `history` e `autocomplete` do scaffold seguem vazias).
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
  createFile,
  getNode,
  insertNode,
  listDirectory,
  removeNode,
  type CreateDirectoryResult,
  type CreateFileResult,
  type InsertNodeResult,
  type ListDirectoryResult,
  type RemoveNodeResult,
} from './filesystem/tree';

export { cat } from './commands/cat';
export { cd } from './commands/cd';
export { cp } from './commands/cp';
export { echo } from './commands/echo';
export { ls } from './commands/ls';
export { mkdir } from './commands/mkdir';
export { mv } from './commands/mv';
export { pwd } from './commands/pwd';
export { rm } from './commands/rm';
export { touch } from './commands/touch';
export { tree } from './commands/tree';

export { tokenizeCommandLine } from './parser/tokenize';
export { runCommand } from './core/run-command';

export { buildExecutionResult, toFilesystemSnapshot } from './contracts/execution-result';
