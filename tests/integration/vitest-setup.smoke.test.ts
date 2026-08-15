import { describe, expect, it } from 'vitest';

/**
 * Teste mínimo de infraestrutura.
 *
 * Objetivo: validar que o Vitest está corretamente configurado e operacional no
 * workspace. Não testa nenhuma funcionalidade de produto — isso ainda não existe.
 * Deverá ser removido/substituído quando os primeiros testes de integração reais
 * forem escritos.
 */
describe('infrastructure: vitest runner', () => {
  it('executes a basic assertion', () => {
    expect(1 + 1).toBe(2);
  });
});
