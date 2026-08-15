import { defineConfig } from 'vitest/config';

// Configuração raiz do Vitest: executa a infraestrutura de testes do workspace.
// Nenhum teste de funcionalidade de produto é definido aqui — apenas a validação de que
// o test runner está operacional (ver tests/integration/vitest-setup.smoke.test.ts).
export default defineConfig({
  test: {
    environment: 'node',
    include: ['tests/**/*.test.ts', 'packages/*/src/**/*.test.ts', 'apps/*/src/**/*.test.ts'],
    passWithNoTests: true,
  },
});
