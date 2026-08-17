const path = require('path');
const { checkFileExists, checkFileContains, reportResults } = require('../../../../global/validators-utils/validator-utils.cjs');

const targetFile = path.resolve('rootscoll/sandbox/api-biblioteca/server.js');

const checks = [
  checkFileExists(targetFile),
  checkFileContains(targetFile, '/health'),
  checkFileContains(targetFile, 'express'),
];

reportResults('Trilha 05 - Módulo 01: API REST de Biblioteca', checks);
