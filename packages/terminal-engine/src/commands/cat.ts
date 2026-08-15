import { getNode } from '../filesystem/tree';
import { resolvePath } from '../filesystem/path';
import type { TerminalFilesystemState } from '../filesystem/types';
import type { TerminalCommandOutcome } from './types';

/**
 * `cat <arquivo>` — imprime o conteúdo de `arquivo` no stdout, exatamente
 * como armazenado (sem adicionar `\n` extra — comportamento real do `cat`,
 * que emite os bytes do arquivo tal como estão). Erro controlado se o
 * caminho não existir ou se for um diretório.
 */
export function cat(
  state: TerminalFilesystemState,
  args: readonly string[],
): TerminalCommandOutcome {
  const name = args[0];
  if (name === undefined) {
    return { filesystem: state, stdout: '', stderr: 'cat: missing file operand\n', exitCode: 1 };
  }
  if (args.length > 1) {
    return {
      filesystem: state,
      stdout: '',
      stderr: `cat: multiplos operandos nao suportados nesta fatia: ${args.join(' ')}\n`,
      exitCode: 1,
    };
  }

  const resolved = resolvePath(state.cwd, name);
  const node = getNode(state.root, resolved);
  if (node === undefined) {
    return {
      filesystem: state,
      stdout: '',
      stderr: `cat: ${name}: No such file or directory\n`,
      exitCode: 1,
    };
  }
  if (node.kind !== 'file') {
    return {
      filesystem: state,
      stdout: '',
      stderr: `cat: ${name}: Is a directory\n`,
      exitCode: 1,
    };
  }

  return { filesystem: state, stdout: node.content, stderr: '', exitCode: 0 };
}
