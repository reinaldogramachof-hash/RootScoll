#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * CLI Runner para os validadores de módulos da RootScoll
 * Uso: node rootscoll/scripts/run-validator.js <caminho-do-modulo>
 */

const targetModule = process.argv[2];

if (!targetModule) {
  console.error('❌ Erro: Por favor informe o caminho do módulo para validação.');
  console.log('Exemplo: node rootscoll/scripts/run-validator.js rootscoll/tracks/01-terminal-os/01-navegacao');
  process.exit(1);
}

const modulePath = path.resolve(targetModule);
const validatorFile = path.join(modulePath, 'validators', 'check.js');

if (!fs.existsSync(validatorFile)) {
  console.error(`❌ Validador não encontrado para este módulo em: ${validatorFile}`);
  process.exit(1);
}

console.log(`🚀 Executando validador do módulo: ${targetModule}...`);
try {
  execSync(`node "${validatorFile}"`, { stdio: 'inherit' });
} catch (err) {
  process.exit(err.status || 1);
}
