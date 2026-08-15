import { getNode } from '../filesystem/tree';
import { resolvePath } from '../filesystem/path';
import type { TerminalFilesystemState } from '../filesystem/types';
import type { TerminalCommandOutcome } from './types';

/**
 * `cd <path>` — muda o diretório atual se `path` existir e for diretório.
 * Suporta caminhos relativos simples e `..` (ver `../filesystem/path.ts`).
 * `cd` sem argumento e `~`/`-` NÃO são suportados nesta fatia — dependem de
 * um conceito de "home"/histórico que ainda não existe; retornam erro
 * controlado em vez de silenciosamente não fazer nada.
 */
export function cd(
  state: TerminalFilesystemState,
  args: readonly string[],
): TerminalCommandOutcome {
  const target = args[0];
  if (target === undefined) {
    return {
      filesystem: state,
      stdout: '',
      stderr: 'bash: cd: destino obrigatório nesta fatia (sem suporte a HOME/~ ainda)\n',
      exitCode: 1,
    };
  }
  if (args.length > 1) {
    return {
      filesystem: state,
      stdout: '',
      stderr: 'bash: cd: too many arguments\n',
      exitCode: 1,
    };
  }

  const resolved = resolvePath(state.cwd, target);
  const node = getNode(state.root, resolved);

  if (node === undefined) {
    return {
      filesystem: state,
      stdout: '',
      stderr: `bash: cd: ${target}: No such file or directory\n`,
      exitCode: 1,
    };
  }
  if (node.kind !== 'dir') {
    return {
      filesystem: state,
      stdout: '',
      stderr: `bash: cd: ${target}: Not a directory\n`,
      exitCode: 1,
    };
  }

  return {
    filesystem: { root: state.root, cwd: resolved },
    stdout: '',
    stderr: '',
    exitCode: 0,
  };
}
