import { createFile, getNode } from '../filesystem/tree';
import { resolvePath } from '../filesystem/path';
import type { TerminalFilesystemState } from '../filesystem/types';
import type { TerminalCommandOutcome } from './types';

/**
 * `touch <arquivo>` — cria um arquivo vazio em `arquivo` se ele ainda não
 * existir. Segue o comportamento real do bash: se já existir algo nesse
 * caminho (arquivo OU diretório), `touch` não é erro — apenas não faz nada
 * nesta fatia (o bash real atualizaria o timestamp; esta fatia não modela
 * tempo, então o resultado é um no-op bem-sucedido).
 */
export function touch(
  state: TerminalFilesystemState,
  args: readonly string[],
): TerminalCommandOutcome {
  const name = args[0];
  if (name === undefined) {
    return { filesystem: state, stdout: '', stderr: 'touch: missing file operand\n', exitCode: 1 };
  }
  if (args.length > 1) {
    return {
      filesystem: state,
      stdout: '',
      stderr: `touch: multiplos operandos nao suportados nesta fatia: ${args.join(' ')}\n`,
      exitCode: 1,
    };
  }

  const resolved = resolvePath(state.cwd, name);
  if (getNode(state.root, resolved) !== undefined) {
    return { filesystem: state, stdout: '', stderr: '', exitCode: 0 };
  }

  const result = createFile(state.root, resolved);
  if (!result.ok) {
    const detail =
      result.reason === 'parent-not-directory' ? 'Not a directory' : 'No such file or directory';
    return {
      filesystem: state,
      stdout: '',
      stderr: `touch: cannot touch '${name}': ${detail}\n`,
      exitCode: 1,
    };
  }

  return { filesystem: { root: result.root, cwd: state.cwd }, stdout: '', stderr: '', exitCode: 0 };
}
