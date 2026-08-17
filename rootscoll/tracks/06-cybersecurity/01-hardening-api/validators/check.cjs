const path = require('path');
const { checkFileExists, checkFileContains, reportResults } = require('../../../../global/validators-utils/validator-utils.cjs');

const targetDir = path.resolve('rootscoll/sandbox/cyber-hardening');

const checks = [
  checkFileExists(path.join(targetDir, '.env.example')),
  checkFileExists(path.join(targetDir, 'hardening.js')),
  checkFileContains(path.join(targetDir, 'hardening.js'), 'process.env'),
];

reportResults('Trilha 06 - Módulo 01: Hardening de API e Segurança OWASP', checks);
