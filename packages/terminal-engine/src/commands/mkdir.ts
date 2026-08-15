import { createDirectory } from '../filesystem/tree';
import { resolvePath } from '../filesystem/path';
import type { TerminalFilesystemState } from '../filesystem/types';
import type { TerminalCommandOutcome } from './types';

/**
 * `mkdir <name>` — cria um diretório no local resolvido (por padrão, dentro
 * de `state.cwd`). Sem suporte à flag `-p` nesta fatia (fica para uma fatia
 * futura, quando o parser de flags for implementado) — diretório pai
 * inexistente é erro controlado, não criação implícita.
 */
export function mkdir(
  state: TerminalFilesystemState,
  args: readonly string[],
): TerminalCommandOutcome {
  const name = args[0];
  if (name === undefined) {
    return { filesystem: state, stdout: '', stderr: 'mkdir: missing operand\n', exitCode: 1 };
  }
  if (args.length > 1) {
    return {
      filesystem: state,
      stdout: '',
      stderr: `mkdir: multiplos operandos nao suportados nesta fatia: ${args.join(' ')}\n`,
      exitCode: 1,
    };
  }

  const resolved = resolvePath(state.cwd, name);
  const result = createDirectory(state.root, resolved);

  if (!result.ok) {
    const detail =
      result.reason === 'already-exists'
        ? 'File exists'
        : result.reason === 'parent-not-directory'
          ? 'Not a directory'
          : 'No such file or directory';
    return {
      filesystem: state,
      stdout: '',
      stderr: `mkdir: cannot create directory '${name}': ${detail}\n`,
      exitCode: 1,
    };
  }

  return {
    filesystem: { root: result.root, cwd: state.cwd },
    stdout: '',
    stderr: '',
    exitCode: 0,
  };
}
