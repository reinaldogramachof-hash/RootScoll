const path = require('path');
const { checkDirectoryExists, checkFileExists, checkFileContains, reportResults } = require('../../../../global/validators-utils/validator-utils.cjs');

const targetDir = path.resolve('rootscoll/sandbox/landing-page');

const checks = [
  checkDirectoryExists(targetDir),
  checkFileExists(path.join(targetDir, 'index.html')),
  checkFileExists(path.join(targetDir, 'style.css')),
  checkFileContains(path.join(targetDir, 'index.html'), '<header'),
  checkFileContains(path.join(targetDir, 'index.html'), '<main'),
  checkFileContains(path.join(targetDir, 'index.html'), '<footer'),
  checkFileContains(path.join(targetDir, 'index.html'), '<h1'),
];

reportResults('Trilha 03 - Módulo 01: Landing Page Acessível', checks);
