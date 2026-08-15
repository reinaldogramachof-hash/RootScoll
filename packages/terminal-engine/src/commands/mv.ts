import { getNode, insertNode, removeNode } from '../filesystem/tree';
import { resolvePath } from '../filesystem/path';
import type { TerminalFilesystemState } from '../filesystem/types';
import type { TerminalCommandOutcome } from './types';

function isSameOrInsideSource(sourcePath: string, targetPath: string): boolean {
  return targetPath === sourcePath || targetPath.startsWith(`${sourcePath}/`);
}

/**
 * `mv <origem> <destino>` — move/renomeia um arquivo ou diretório dentro da
 * árvore virtual. Implementado como "copiar (por referência, ver `cp.ts`)
 * para o destino, depois remover a origem" — nunca lança exceção; se
 * `destino` já existir como diretório, move para dentro dele com o nome
 * original de `origem` (comportamento real do bash).
 */
export function mv(
  state: TerminalFilesystemState,
  args: readonly string[],
): TerminalCommandOutcome {
  const source = args[0];
  const target = args[1];

  if (source === undefined) {
    return { filesystem: state, stdout: '', stderr: 'mv: missing file operand\n', exitCode: 1 };
  }
  if (target === undefined) {
    return {
      filesystem: state,
      stdout: '',
      stderr: `mv: missing destination file operand after '${source}'\n`,
      exitCode: 1,
    };
  }
  if (args.length > 2) {
    return {
      filesystem: state,
      stdout: '',
      stderr: `mv: multiplos operandos nao suportados nesta fatia: ${args.join(' ')}\n`,
      exitCode: 1,
    };
  }

  const resolvedSource = resolvePath(state.cwd, source);
  const sourceNode = getNode(state.root, resolvedSource);
  if (sourceNode === undefined) {
    return {
      filesystem: state,
      stdout: '',
      stderr: `mv: cannot stat '${source}': No such file or directory\n`,
      exitCode: 1,
    };
  }

  const resolvedTargetRaw = resolvePath(state.cwd, target);
  const targetNode = getNode(state.root, resolvedTargetRaw);

  if (targetNode?.kind === 'file' && sourceNode.kind === 'dir') {
    return {
      filesystem: state,
      stdout: '',
      stderr: `mv: cannot overwrite non-directory '${target}' with directory '${source}'\n`,
      exitCode: 1,
    };
  }

  let resolvedTarget = resolvedTargetRaw;
  if (targetNode?.kind === 'dir') {
    const baseName = resolvedSource
      .split('/')
      .filter((segment) => segment.length > 0)
      .at(-1);
    if (baseName === undefined) {
      return {
        filesystem: state,
        stdout: '',
        stderr: "mv: '/' nao pode ser movido nesta fatia\n",
        exitCode: 1,
      };
    }
    resolvedTarget =
      resolvedTargetRaw === '/' ? `/${baseName}` : `${resolvedTargetRaw}/${baseName}`;
  }

  if (isSameOrInsideSource(resolvedSource, resolvedTarget)) {
    return {
      filesystem: state,
      stdout: '',
      stderr: `mv: cannot move '${source}' to '${target}': not distinct paths\n`,
      exitCode: 1,
    };
  }

  const insertResult = insertNode(state.root, resolvedTarget, sourceNode, { overwrite: true });
  if (!insertResult.ok) {
    const detail =
      insertResult.reason === 'parent-not-directory'
        ? 'Not a directory'
        : 'No such file or directory';
    return {
      filesystem: state,
      stdout: '',
      stderr: `mv: cannot move '${source}' to '${target}': ${detail}\n`,
      exitCode: 1,
    };
  }

  const removeResult = removeNode(insertResult.root, resolvedSource);
  if (!removeResult.ok) {
    // Não deveria acontecer: `sourceNode` foi confirmado existente acima, e
    // esta fatia não suporta mover um diretório para dentro de si mesmo (o
    // que poderia invalidar o caminho de origem antes da remoção). Erro
    // controlado como rede de segurança, nunca `throw`.
    return {
      filesystem: state,
      stdout: '',
      stderr: `mv: cannot remove '${source}' after copying to '${target}'\n`,
      exitCode: 1,
    };
  }

  return {
    filesystem: { root: removeResult.root, cwd: state.cwd },
    stdout: '',
    stderr: '',
    exitCode: 0,
  };
}
