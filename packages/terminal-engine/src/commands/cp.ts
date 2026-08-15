import { getNode, insertNode } from '../filesystem/tree';
import { resolvePath } from '../filesystem/path';
import type { TerminalFilesystemState } from '../filesystem/types';
import type { TerminalCommandOutcome } from './types';

function isSameOrInsideSource(sourcePath: string, targetPath: string): boolean {
  return targetPath === sourcePath || targetPath.startsWith(`${sourcePath}/`);
}

/**
 * `cp <origem> <destino>` — copia um arquivo ou diretório (recursivamente,
 * incluindo seu conteúdo — "diretório simples" aqui significa apenas "sem
 * exigir a flag -r", não "só diretórios vazios"; ver Implementation Report,
 * seção "Decisões técnicas"). Como a árvore é imutável, a cópia reaproveita
 * a mesma referência do nó de origem na nova posição (nenhuma mutação futura
 * pode invalidar essa partilha estrutural) — não há necessidade de clonar
 * profundamente. Se `destino` já existir como diretório, copia para dentro
 * dele com o nome original de `origem` (comportamento real do bash).
 */
export function cp(
  state: TerminalFilesystemState,
  args: readonly string[],
): TerminalCommandOutcome {
  const source = args[0];
  const target = args[1];

  if (source === undefined) {
    return { filesystem: state, stdout: '', stderr: 'cp: missing file operand\n', exitCode: 1 };
  }
  if (target === undefined) {
    return {
      filesystem: state,
      stdout: '',
      stderr: `cp: missing destination file operand after '${source}'\n`,
      exitCode: 1,
    };
  }
  if (args.length > 2) {
    return {
      filesystem: state,
      stdout: '',
      stderr: `cp: multiplos operandos nao suportados nesta fatia: ${args.join(' ')}\n`,
      exitCode: 1,
    };
  }

  const resolvedSource = resolvePath(state.cwd, source);
  const sourceNode = getNode(state.root, resolvedSource);
  if (sourceNode === undefined) {
    return {
      filesystem: state,
      stdout: '',
      stderr: `cp: cannot stat '${source}': No such file or directory\n`,
      exitCode: 1,
    };
  }

  const resolvedTargetRaw = resolvePath(state.cwd, target);
  const targetNode = getNode(state.root, resolvedTargetRaw);

  if (targetNode?.kind === 'file' && sourceNode.kind === 'dir') {
    return {
      filesystem: state,
      stdout: '',
      stderr: `cp: cannot overwrite non-directory '${target}' with directory '${source}'\n`,
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
        stderr: "cp: '/' nao pode ser copiado nesta fatia\n",
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
      stderr: `cp: '${source}' and '${target}' are not distinct paths\n`,
      exitCode: 1,
    };
  }

  const result = insertNode(state.root, resolvedTarget, sourceNode, { overwrite: true });
  if (!result.ok) {
    const detail =
      result.reason === 'parent-not-directory' ? 'Not a directory' : 'No such file or directory';
    return {
      filesystem: state,
      stdout: '',
      stderr: `cp: cannot create '${target}': ${detail}\n`,
      exitCode: 1,
    };
  }

  return { filesystem: { root: result.root, cwd: state.cwd }, stdout: '', stderr: '', exitCode: 0 };
}
