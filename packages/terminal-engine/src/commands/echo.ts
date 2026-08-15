import type { TerminalFilesystemState } from '../filesystem/types';
import type { TerminalCommandOutcome } from './types';

/**
 * `echo [texto...]` — imprime os argumentos, separados por espaço, seguidos
 * de nova linha. Nunca falha e nunca muta o filesystem. Sem argumentos,
 * imprime apenas uma linha vazia — comportamento real do bash (`echo` nunca
 * exige argumento); decisão documentada explicitamente no Implementation
 * Report desta fatia como ponto para revisão do Codex, já que a regra geral
 * da tarefa pede erro controlado para "argumentos ausentes" em outros
 * comandos (touch/cat/cp/mv/rm, que têm aridade fixa e obrigatória).
 */
export function echo(
  state: TerminalFilesystemState,
  args: readonly string[],
): TerminalCommandOutcome {
  return { filesystem: state, stdout: `${args.join(' ')}\n`, stderr: '', exitCode: 0 };
}
