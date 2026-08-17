const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * Validator Utilities for RootScoll Curriculum
 * Executável nativamente em Node.js (Windows, macOS, Linux)
 */

function checkFileExists(filePath) {
  const resolvedPath = path.resolve(filePath);
  if (!fs.existsSync(resolvedPath)) {
    return { success: false, message: `Arquivo não encontrado: ${filePath}` };
  }
  return { success: true, message: `Arquivo encontrado: ${filePath}` };
}

function checkDirectoryExists(dirPath) {
  const resolvedPath = path.resolve(dirPath);
  if (!fs.existsSync(resolvedPath) || !fs.statSync(resolvedPath).isDirectory()) {
    return { success: false, message: `Diretório não encontrado: ${dirPath}` };
  }
  return { success: true, message: `Diretório encontrado: ${dirPath}` };
}

function checkFileContains(filePath, pattern) {
  const fileCheck = checkFileExists(filePath);
  if (!fileCheck.success) return fileCheck;

  const content = fs.readFileSync(path.resolve(filePath), 'utf-8');
  const matches = typeof pattern === 'string' ? content.includes(pattern) : pattern.test(content);

  if (!matches) {
    return { success: false, message: `Conteúdo esperado não encontrado em ${filePath}: "${pattern}"` };
  }
  return { success: true, message: `Validação de conteúdo aprovada em ${filePath}` };
}

function runCommand(command, cwd = process.cwd()) {
  try {
    const stdout = execSync(command, { cwd, encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] });
    return { success: true, stdout, stderr: '' };
  } catch (error) {
    return { success: false, stdout: error.stdout ? error.stdout.toString() : '', stderr: error.stderr ? error.stderr.toString() : error.message };
  }
}

function reportResults(testName, checks) {
  console.log(`\n============== VALIDANDO: ${testName} ==============`);
  let allPassed = true;

  checks.forEach((check, index) => {
    if (check.success) {
      console.log(`  [✅ PASSED] Checagem ${index + 1}: ${check.message}`);
    } else {
      console.log(`  [❌ FAILED] Checagem ${index + 1}: ${check.message}`);
      allPassed = false;
    }
  });

  console.log(`====================================================`);
  if (allPassed) {
    console.log(`🎉 PARABÉNS! Todos os critérios do módulo foram atendidos com sucesso.\n`);
    process.exit(0);
  } else {
    console.log(`⚠️ ATENÇÃO: Verifique os itens com erro acima e tente novamente.\n`);
    process.exit(1);
  }
}

module.exports = {
  checkFileExists,
  checkDirectoryExists,
  checkFileContains,
  runCommand,
  reportResults,
};
