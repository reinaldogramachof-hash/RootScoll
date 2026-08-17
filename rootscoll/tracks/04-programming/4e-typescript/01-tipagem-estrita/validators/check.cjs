const path = require('path');
const { checkFileExists, checkFileContains, reportResults } = require('../../../../../global/validators-utils/validator-utils.cjs');

const targetFile = path.resolve('rootscoll/sandbox/ts-app/types.ts');

const checks = [
  checkFileExists(targetFile),
  checkFileContains(targetFile, 'interface Livro'),
  checkFileContains(targetFile, 'verificarDisponibilidade'),
];

reportResults('Trilha 04 - Submódulo 4e: TypeScript (Tipagem Estrita)', checks);
