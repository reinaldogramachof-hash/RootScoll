// Configuração ESLint base compartilhada do monorepo (flat config, ESLint 9+).
// Prioriza: erros reais, problemas de tipos, imports inconsistentes, código morto.
// Evita regras excessivamente opinativas nesta etapa (sem estilo — isso é papel do Prettier).
import js from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['**/dist/**', '**/build/**', '**/coverage/**', '**/node_modules/**', '**/.vite/**'],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  },
);
