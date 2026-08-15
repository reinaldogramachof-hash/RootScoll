import { cat } from '../commands/cat';
import { cd } from '../commands/cd';
import { cp } from '../commands/cp';
import { echo } from '../commands/echo';
import { ls } from '../commands/ls';
import { mkdir } from '../commands/mkdir';
import { mv } from '../commands/mv';
import { pwd } from '../commands/pwd';
import { rm } from '../commands/rm';
import { touch } from '../commands/touch';
import { tree } from '../commands/tree';
import type { TerminalCommandName, TerminalCommandOutcome } from '../commands/types';
import type { TerminalFilesystemState } from '../filesystem/types';
import { tokenizeCommandLine } from '../parser/tokenize';

function isSupportedCommand(name: string): name is TerminalCommandName {
  return (
    name === 'pwd' ||
    name === 'ls' ||
    name === 'cd' ||
    name === 'mkdir' ||
    name === 'touch' ||
    name === 'cat' ||
    name === 'echo' ||
    name === 'cp' ||
    name === 'mv' ||
    name === 'rm' ||
    name === 'tree'
  );
}

/**
 * Dispatcher central: tokeniza uma linha de comando e roteia para a
 * implementação pura correspondente. Comando desconhecido retorna erro
 * controlado (`exitCode: 127`, convenção real de shell para "command not
 * found") — nunca lança exceção. Linha vazia é um no-op silencioso (`exitCode:
 * 0`), como pressionar Enter num terminal real.
 */
export function runCommand(
  state: TerminalFilesystemState,
  commandLine: string,
): TerminalCommandOutcome {
  const tokens = tokenizeCommandLine(commandLine);
  const name = tokens[0];
  const args = tokens.slice(1);

  if (name === undefined) {
    return { filesystem: state, stdout: '', stderr: '', exitCode: 0 };
  }

  if (!isSupportedCommand(name)) {
    return {
      filesystem: state,
      stdout: '',
      stderr: `bash: ${name}: command not found\n`,
      exitCode: 127,
    };
  }

  switch (name) {
    case 'pwd':
      return pwd(state);
    case 'ls':
      return ls(state, args);
    case 'cd':
      return cd(state, args);
    case 'mkdir':
      return mkdir(state, args);
    case 'touch':
      return touch(state, args);
    case 'cat':
      return cat(state, args);
    case 'echo':
      return echo(state, args);
    case 'cp':
      return cp(state, args);
    case 'mv':
      return mv(state, args);
    case 'rm':
      return rm(state, args);
    case 'tree':
      return tree(state, args);
  }
}
