import { describe, expect, it } from 'vitest';
import type { MentorHint } from './types';
import { selectHint } from './mentor';

const HINTS: readonly MentorHint[] = [
  { afterAttempts: 1, text: 'dica 1' },
  { afterAttempts: 2, text: 'dica 2' },
  { afterAttempts: 3, text: 'dica 3' },
];

describe('selectHint', () => {
  it('retorna undefined antes da primeira dica ser desbloqueada', () => {
    expect(selectHint(HINTS, 0)).toBeUndefined();
  });

  it('retorna a primeira dica assim que afterAttempts e alcancado', () => {
    expect(selectHint(HINTS, 1)?.text).toBe('dica 1');
  });

  it('retorna a dica mais avancada ja desbloqueada, nao a primeira', () => {
    expect(selectHint(HINTS, 2)?.text).toBe('dica 2');
    expect(selectHint(HINTS, 3)?.text).toBe('dica 3');
  });

  it('permanece na ultima dica apos exceder o maior afterAttempts', () => {
    expect(selectHint(HINTS, 10)?.text).toBe('dica 3');
  });

  it('retorna undefined para uma lista vazia de dicas', () => {
    expect(selectHint([], 5)).toBeUndefined();
  });

  it('funciona mesmo se as dicas nao estiverem em ordem', () => {
    const shuffled = [HINTS[2], HINTS[0], HINTS[1]].filter(
      (hint): hint is MentorHint => hint !== undefined,
    );
    expect(selectHint(shuffled, 2)?.text).toBe('dica 2');
  });
});
