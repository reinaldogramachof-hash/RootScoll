import { defineConfig } from 'vitest/config';

/**
 * Configuração base do Vitest, reaproveitável pelos packages/apps do monorepo.
 * Nenhum teste de funcionalidade de produto é definido aqui — apenas infraestrutura.
 */
export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts', 'src/**/*.spec.ts'],
    passWithNoTests: true,
  },
});
