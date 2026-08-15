import baseConfig from './packages/config/eslint/base.js';

// Aplica a configuração compartilhada a todo o workspace.
// Regras específicas por app/package poderão ser adicionadas aqui conforme necessário,
// sem duplicar a base.
export default [...baseConfig];
