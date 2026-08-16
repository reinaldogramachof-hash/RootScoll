/**
 * Utilitários puros de formatação do terminal — sem React, sem estado,
 * facilmente testáveis com Vitest puro (sem DOM/testing-library). Usados por
 * `useTerminalSession` para transformar o resultado de `runCommand`
 * (`@codechat/terminal-engine`) em linhas exibíveis e no prompt dinâmico.
 */

const HOME = '/home/aluno';

/**
 * Prompt dinâmico no estilo exigido pelo currículo
 * (`docs/product/curriculum-phase-0.md`: "Prompt dinâmico:
 * aluno@plena:~/projeto$"). Abrevia o `cwd` para `~` quando for o diretório
 * pessoal do aluno, ou `~/<resto>` quando estiver dentro dele.
 */
export function promptLabel(cwd: string): string {
  let shortCwd = cwd;
  if (cwd === HOME) {
    shortCwd = '~';
  } else if (cwd.startsWith(`${HOME}/`)) {
    shortCwd = `~${cwd.slice(HOME.length)}`;
  }
  return `aluno@plena:${shortCwd}$`;
}

/**
 * Divide `stdout`/`stderr` de um `TerminalCommandOutcome` em linhas de
 * exibição. Comandos desta fatia sempre terminam a saída não-vazia com um
 * `\n` final (convenção de `packages/terminal-engine`); essa função remove
 * apenas esse `\n` final (não quebras de linha internas), preservando linhas
 * em branco no meio do conteúdo.
 */
export function splitLines(text: string): string[] {
  if (text.length === 0) {
    return [];
  }
  const parts = text.split('\n');
  if (parts.length > 0 && parts[parts.length - 1] === '') {
    parts.pop();
  }
  return parts;
}
