import type { MentorHint } from './types';

/**
 * Seleção determinística de dica do mentor — sem IA real, regra local pura:
 * entre as dicas cujo `afterAttempts` já foi alcançado pelo número de
 * tentativas de comando na etapa prática/avaliação, retorna a de maior
 * `afterAttempts` (a mais avançada já desbloqueada). Retorna `undefined`
 * antes da primeira dica ser desbloqueada, ou se o bloco não tiver dicas.
 *
 * Assume `hints` já em ordem crescente de `afterAttempts` (garantido por
 * `blocks.ts`/`blocks.test.ts`), mas não depende disso: percorre todas e
 * mantém a de maior `afterAttempts` que já foi alcançada.
 */
export function selectHint(
  hints: readonly MentorHint[],
  attemptCount: number,
): MentorHint | undefined {
  let best: MentorHint | undefined;
  for (const hint of hints) {
    if (hint.afterAttempts <= attemptCount) {
      if (best === undefined || hint.afterAttempts > best.afterAttempts) {
        best = hint;
      }
    }
  }
  return best;
}
