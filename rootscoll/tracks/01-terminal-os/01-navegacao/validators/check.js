const path = require('path');
const { checkDirectoryExists, reportResults } = require('../../../global/validators-utils/validator-utils');

const sandboxPath = path.resolve('rootscoll/sandbox');

const checks = [
  checkDirectoryExists(path.join(sandboxPath, 'projeto-alpha')),
  checkDirectoryExists(path.join(sandboxPath, 'projeto-beta')),
];

reportResults('Trilha 01 - Módulo 01: Navegação no Terminal', checks);
