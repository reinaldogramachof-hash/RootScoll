const path = require('path');
const { checkFileExists, reportResults } = require('../../../../../global/validators-utils/validator-utils.cjs');

const targetFile = path.resolve('rootscoll/sandbox/js-logica/funcoes.js');

let fileCheck = checkFileExists(targetFile);
let logicCheck = { success: false, message: 'Função filtrarConcluidas não encontrada ou incorreta' };

if (fileCheck.success) {
  try {
    const { filtrarConcluidas } = require(targetFile);
    if (typeof filtrarConcluidas === 'function') {
      const mockData = [
        { id: 1, titulo: 'A1', concluida: true },
        { id: 2, titulo: 'A2', concluida: false },
        { id: 3, titulo: 'A3', concluida: true }
      ];
      const res = filtrarConcluidas(mockData);
      if (Array.isArray(res) && res.length === 2 && res[0].id === 1 && res[1].id === 3) {
        logicCheck = { success: true, message: 'Função pura filtrarConcluidas executou com sucesso' };
      }
    }
  } catch (err) {
    logicCheck = { success: false, message: `Erro ao importar/executar script: ${err.message}` };
  }
}

reportResults('Trilha 04 - Submódulo 4a: Vanilla JS I (Lógica Pura)', [fileCheck, logicCheck]);
