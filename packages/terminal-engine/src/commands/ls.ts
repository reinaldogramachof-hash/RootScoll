import { listDirectory } from '../filesystem/tree';
import type { TerminalFilesystemState } from '../filesystem/types';
import type { TerminalCommandOutcome } from './types';

/**
 * `ls` — lista as entradas do diretório atual. Sem suporte a argumento de
 * caminho nesta fatia mínima (`ls` sempre lista `state.cwd`) — decisão
 * deliberada de escopo; ver Implementation Report.
 */
export function ls(
  state: TerminalFilesystemState,
  args: readonly string[] = [],
): TerminalCommandOutcome {
  const target = args[0];
  if (target !== undefined) {
    return {
      filesystem: state,
      stdout: '',
      stderr: `ls: argumentos nao suportados nesta fatia: ${args.join(' ')}\n`,
      exitCode: 1,
    };
  }

  const result = listDirectory(state.root, state.cwd);
  if (!result.ok) {
    // Invariante: `state.cwd` deveria sempre apontar para um diretório válido
    // (é mantido por `cd`, que só troca `cwd` após validar o destino). Se
    // isso falhar mesmo assim, ainda respondemos como erro controlado, nunca
    // lançando exceção para o fluxo do aluno.
    return {
      filesystem: state,
      stdout: '',
      stderr: `ls: cannot access '${state.cwd}': No such file or directory\n`,
      exitCode: 1,
    };
  }
  const stdout = result.entries.length > 0 ? `${result.entries.join('\n')}\n` : '';
  return { filesystem: state, stdout, stderr: '', exitCode: 0 };
}
