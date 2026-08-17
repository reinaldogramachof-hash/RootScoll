const path = require('path');
const { checkDirectoryExists, checkFileExists, checkFileContains, reportResults } = require('../../../../global/validators-utils/validator-utils.cjs');

const targetDir = path.resolve('rootscoll/sandbox/diario-de-bordo');

const checks = [
  checkDirectoryExists(targetDir),
  checkDirectoryExists(path.join(targetDir, '.git')),
  checkFileExists(path.join(targetDir, 'diario.md')),
  checkFileContains(path.join(targetDir, 'diario.md'), 'Diário de Bordo'),
];

reportResults('Trilha 02 - Módulo 01: Git e Diário de Bordo', checks);
