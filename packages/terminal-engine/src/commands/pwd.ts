import type { TerminalFilesystemState } from '../filesystem/types';
import type { TerminalCommandOutcome } from './types';

/** `pwd` — retorna o diretório de trabalho atual. Nunca falha. */
export function pwd(state: TerminalFilesystemState): TerminalCommandOutcome {
  return {
    filesystem: state,
    stdout: `${state.cwd}\n`,
    stderr: '',
    exitCode: 0,
  };
}
