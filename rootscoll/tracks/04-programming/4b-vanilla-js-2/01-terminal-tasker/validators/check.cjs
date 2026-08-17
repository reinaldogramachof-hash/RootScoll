const path = require('path');
const { checkFileExists, checkFileContains, reportResults } = require('../../../../../global/validators-utils/validator-utils.cjs');

const targetDir = path.resolve('rootscoll/sandbox/terminal-tasker');
const htmlFile = path.join(targetDir, 'index.html');
const jsFile = path.join(targetDir, 'app.js');

const checks = [
  checkFileExists(htmlFile),
  checkFileExists(jsFile),
  checkFileContains(jsFile, 'localStorage'),
  checkFileContains(jsFile, 'tasker_items'),
];

reportResults('Trilha 04 - Submódulo 4b: Vanilla JS II (DOM & Terminal Tasker)', checks);
