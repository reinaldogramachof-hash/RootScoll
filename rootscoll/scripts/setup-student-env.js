#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

/**
 * Script de inicialização do ambiente do aluno RootScoll
 */

console.log('🌱 Inicializando ambiente de aprendizagem RootScoll (Modo Raiz)...');

const workspaceDirs = [
  'rootscoll/sandbox',
  'rootscoll/student-output',
];

workspaceDirs.forEach(dir => {
  const fullPath = path.resolve(dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
    console.log(`  [+] Criado diretório de trabalho: ${dir}`);
  }
});

console.log('✅ Ambiente pronto para estudo! Bons treinos.');
