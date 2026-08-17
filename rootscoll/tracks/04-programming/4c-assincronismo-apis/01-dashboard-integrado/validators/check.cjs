const path = require('path');
const { checkFileExists, checkFileContains, reportResults } = require('../../../../../global/validators-utils/validator-utils.cjs');

const targetFile = path.resolve('rootscoll/sandbox/dashboard/api.js');

const checks = [
  checkFileExists(targetFile),
  checkFileContains(targetFile, 'async'),
  checkFileContains(targetFile, 'fetch'),
  checkFileContains(targetFile, 'try'),
  checkFileContains(targetFile, 'catch'),
];

reportResults('Trilha 04 - Submódulo 4c: Assincronismo e Consumo de APIs', checks);
