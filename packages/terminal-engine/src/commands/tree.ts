import { getNode } from '../filesystem/tree';
import type { TerminalFilesystemState, VirtualDirectoryNode } from '../filesystem/types';
import type { TerminalCommandOutcome } from './types';

/** Monta as linhas de `tree` recursivamente, em ordem alfabetica (deterministico). */
function buildTreeLines(node: VirtualDirectoryNode, prefix: string): string[] {
  const names = Object.keys(node.children).sort();
  const lines: string[] = [];
  names.forEach((name, index) => {
    const isLast = index === names.length - 1;
    const connector = isLast ? '`-- ' : '|-- ';
    lines.push(`${prefix}${connector}${name}`);
    const child = node.children[name];
    if (child?.kind === 'dir') {
      const childPrefix = prefix + (isLast ? '    ' : '|   ');
      lines.push(...buildTreeLines(child, childPrefix));
    }
  });
  return lines;
}

/**
 * `tree` — imprime uma árvore simples a partir de `state.cwd` (sem flags
 * nesta fatia — sempre lista tudo, recursivamente). Determinístico: nomes
 * sempre em ordem alfabética em cada nível.
 */
export function tree(
  state: TerminalFilesystemState,
  args: readonly string[],
): TerminalCommandOutcome {
  if (args.length > 0) {
    return {
      filesystem: state,
      stdout: '',
      stderr: `tree: argumentos nao suportados nesta fatia: ${args.join(' ')}\n`,
      exitCode: 1,
    };
  }

  const node = getNode(state.root, state.cwd);
  if (node === undefined || node.kind !== 'dir') {
    // Invariante: `state.cwd` deveria sempre apontar para um diretório
    // válido (mantido por `cd`). Erro controlado como rede de segurança.
    return {
      filesystem: state,
      stdout: '',
      stderr: `tree: ${state.cwd}: No such file or directory\n`,
      exitCode: 1,
    };
  }

  const lines = ['.', ...buildTreeLines(node, '')];
  return { filesystem: state, stdout: `${lines.join('\n')}\n`, stderr: '', exitCode: 0 };
}
