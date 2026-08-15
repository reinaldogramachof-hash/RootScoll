import { getNode, removeNode } from '../filesystem/tree';
import { resolvePath } from '../filesystem/path';
import type { TerminalFilesystemState } from '../filesystem/types';
import type { TerminalCommandOutcome } from './types';

/**
 * `rm <caminho>` — remove um arquivo ou um diretório VAZIO. Nesta fatia,
 * diretório não-vazio é erro controlado (equivalente a `rm` sem `-r`/`-f` —
 * essas flags ficam para uma fatia futura, fora do escopo aprovado aqui).
 */
export function rm(
  state: TerminalFilesystemState,
  args: readonly string[],
): TerminalCommandOutcome {
  const target = args[0];
  if (target === undefined) {
    return { filesystem: state, stdout: '', stderr: 'rm: missing operand\n', exitCode: 1 };
  }
  if (args.length > 1) {
    return {
      filesystem: state,
      stdout: '',
      stderr: `rm: multiplos operandos nao suportados nesta fatia: ${args.join(' ')}\n`,
      exitCode: 1,
    };
  }

  const resolved = resolvePath(state.cwd, target);
  if (resolved === '/') {
    return {
      filesystem: state,
      stdout: '',
      stderr: "rm: cannot remove '/': Operation not permitted\n",
      exitCode: 1,
    };
  }

  const node = getNode(state.root, resolved);
  if (node === undefined) {
    return {
      filesystem: state,
      stdout: '',
      stderr: `rm: cannot remove '${target}': No such file or directory\n`,
      exitCode: 1,
    };
  }
  if (node.kind === 'dir' && Object.keys(node.children).length > 0) {
    return {
      filesystem: state,
      stdout: '',
      stderr: `rm: cannot remove '${target}': Directory not empty\n`,
      exitCode: 1,
    };
  }

  const result = removeNode(state.root, resolved);
  if (!result.ok) {
    // Não deveria acontecer: `node` foi confirmado existente acima.
    return {
      filesystem: state,
      stdout: '',
      stderr: `rm: cannot remove '${target}': No such file or directory\n`,
      exitCode: 1,
    };
  }

  return { filesystem: { root: result.root, cwd: state.cwd }, stdout: '', stderr: '', exitCode: 0 };
}
