const path = require('path');
const { checkFileExists, checkFileContains, reportResults } = require('../../../../../global/validators-utils/validator-utils.cjs');

const targetFile = path.resolve('rootscoll/sandbox/react-app/CardStatus.jsx');

const checks = [
  checkFileExists(targetFile),
  checkFileContains(targetFile, 'useState'),
  checkFileContains(targetFile, 'CardStatus'),
];

reportResults('Trilha 04 - Submódulo 4d: React (UI Declarativa)', checks);
