import { describe, expect, it } from 'vitest';
import type { ExecutionRequestRef } from '@codechat/types';
import { buildExecutionResult, createInitialFilesystemState, getNode, runCommand } from './index';

// ---------------------------------------------------------------------------
// Testes — Comandos de arquivos e manipulação básica (Fase 1, fatia 2)
//
// Cobre touch, cat, echo, cp, mv, rm, tree sobre o filesystem virtual em
// memória: comportamento esperado, imutabilidade do estado anterior, erros
// controlados (nunca throw) e a ponte com ExecutionResult (@codechat/types).
// ---------------------------------------------------------------------------

describe('touch', () => {
  it('cria um arquivo vazio quando ele nao existe', () => {
    const initial = createInitialFilesystemState();
    const outcome = runCommand(initial, 'touch notas.txt');

    expect(outcome.exitCode).toBe(0);
    expect(outcome.stderr).toBe('');
    expect(getNode(initial.root, '/home/aluno/notas.txt')).toBeUndefined();

    const created = getNode(outcome.filesystem.root, '/home/aluno/notas.txt');
    expect(created?.kind).toBe('file');
    if (created?.kind === 'file') {
      expect(created.content).toBe('');
    }
  });

  it('e um no-op bem-sucedido quando o arquivo ja existe (nao e erro)', () => {
    const initial = createInitialFilesystemState();
    const afterFirst = runCommand(initial, 'touch notas.txt');
    const afterSecond = runCommand(afterFirst.filesystem, 'touch notas.txt');

    expect(afterSecond.exitCode).toBe(0);
    expect(afterSecond.stderr).toBe('');
  });

  it('retorna erro controlado se faltar o operando', () => {
    const initial = createInitialFilesystemState();
    const outcome = runCommand(initial, 'touch');
    expect(outcome.exitCode).not.toBe(0);
    expect(outcome.stderr).toBe('touch: missing file operand\n');
    expect(outcome.filesystem).toBe(initial);
  });

  it('retorna erro controlado se o diretorio pai nao existir', () => {
    const initial = createInitialFilesystemState();
    const outcome = runCommand(initial, 'touch a/b/c.txt');
    expect(outcome.exitCode).not.toBe(0);
    expect(outcome.filesystem).toBe(initial);
  });
});

describe('cat', () => {
  it('le o conteudo de um arquivo vazio recem-criado por touch', () => {
    const initial = createInitialFilesystemState();
    const afterTouch = runCommand(initial, 'touch notas.txt');
    const outcome = runCommand(afterTouch.filesystem, 'cat notas.txt');

    expect(outcome.exitCode).toBe(0);
    expect(outcome.stdout).toBe('');
    expect(outcome.stderr).toBe('');
  });

  it('le o conteudo exato de um arquivo com texto (esta fatia nao tem redirecionamento — estado construido diretamente para o teste)', () => {
    const withFile = {
      root: {
        kind: 'dir' as const,
        children: {
          home: {
            kind: 'dir' as const,
            children: {
              aluno: {
                kind: 'dir' as const,
                children: {
                  'notas.txt': { kind: 'file' as const, content: 'ola mundo\n' },
                },
              },
            },
          },
        },
      },
      cwd: '/home/aluno',
    };

    const outcome = runCommand(withFile, 'cat notas.txt');
    expect(outcome.exitCode).toBe(0);
    expect(outcome.stdout).toBe('ola mundo\n');
    expect(outcome.stderr).toBe('');
  });

  it('retorna erro controlado se o arquivo nao existir', () => {
    const initial = createInitialFilesystemState();
    const outcome = runCommand(initial, 'cat nao-existe.txt');
    expect(outcome.exitCode).not.toBe(0);
    expect(outcome.stderr).toBe('cat: nao-existe.txt: No such file or directory\n');
    expect(outcome.filesystem).toBe(initial);
  });

  it('retorna erro controlado se o caminho for um diretorio', () => {
    const initial = createInitialFilesystemState();
    const afterMkdir = runCommand(initial, 'mkdir projetos');
    const outcome = runCommand(afterMkdir.filesystem, 'cat projetos');
    expect(outcome.exitCode).not.toBe(0);
    expect(outcome.stderr).toBe('cat: projetos: Is a directory\n');
  });
});

describe('echo', () => {
  it('imprime o texto informado, seguido de nova linha, sem mutar o filesystem', () => {
    const initial = createInitialFilesystemState();
    const outcome = runCommand(initial, 'echo ola mundo');

    expect(outcome.exitCode).toBe(0);
    expect(outcome.stdout).toBe('ola mundo\n');
    expect(outcome.stderr).toBe('');
    expect(outcome.filesystem).toBe(initial);
  });

  it('sem argumentos imprime apenas uma linha vazia (comportamento real do bash, nao e erro)', () => {
    const initial = createInitialFilesystemState();
    const outcome = runCommand(initial, 'echo');
    expect(outcome.exitCode).toBe(0);
    expect(outcome.stdout).toBe('\n');
  });
});

describe('cp', () => {
  it('copia um arquivo para um novo caminho, preservando a origem', () => {
    const initial = createInitialFilesystemState();
    const afterTouch = runCommand(initial, 'touch original.txt');
    const afterCp = runCommand(afterTouch.filesystem, 'cp original.txt copia.txt');

    expect(afterCp.exitCode).toBe(0);
    expect(afterCp.stderr).toBe('');

    const lsAfterCp = runCommand(afterCp.filesystem, 'ls');
    expect(lsAfterCp.stdout).toBe('copia.txt\noriginal.txt\n');

    const catOriginal = runCommand(afterCp.filesystem, 'cat original.txt');
    expect(catOriginal.exitCode).toBe(0);
  });

  it('copia um diretorio (com conteudo) recursivamente', () => {
    const initial = createInitialFilesystemState();
    const afterMkdir = runCommand(initial, 'mkdir projetos');
    const afterTouch = runCommand(afterMkdir.filesystem, 'touch projetos/notas.txt');
    const afterCp = runCommand(afterTouch.filesystem, 'cp projetos copia-projetos');

    expect(afterCp.exitCode).toBe(0);
    const copiedNode = getNode(afterCp.filesystem.root, '/home/aluno/copia-projetos');
    expect(copiedNode?.kind).toBe('dir');
    if (copiedNode?.kind === 'dir') {
      expect(Object.keys(copiedNode.children)).toEqual(['notas.txt']);
    }
    // Origem preservada.
    expect(getNode(afterCp.filesystem.root, '/home/aluno/projetos/notas.txt')?.kind).toBe('file');
  });

  it('retorna erro controlado se a origem nao existir', () => {
    const initial = createInitialFilesystemState();
    const outcome = runCommand(initial, 'cp nao-existe.txt copia.txt');
    expect(outcome.exitCode).not.toBe(0);
    expect(outcome.stderr).toBe("cp: cannot stat 'nao-existe.txt': No such file or directory\n");
    expect(outcome.filesystem).toBe(initial);
  });

  it('bloqueia copia de um diretorio para dentro dele mesmo', () => {
    const initial = createInitialFilesystemState();
    const afterMkdir = runCommand(initial, 'mkdir projetos');
    const afterChild = runCommand(afterMkdir.filesystem, 'mkdir projetos/app');
    const outcome = runCommand(afterChild.filesystem, 'cp projetos projetos/app');

    expect(outcome.exitCode).not.toBe(0);
    expect(outcome.stderr).toBe("cp: 'projetos' and 'projetos/app' are not distinct paths\n");
    expect(outcome.filesystem).toBe(afterChild.filesystem);
  });
});

describe('mv', () => {
  it('renomeia um arquivo dentro do mesmo diretorio', () => {
    const initial = createInitialFilesystemState();
    const afterTouch = runCommand(initial, 'touch original.txt');
    const afterMv = runCommand(afterTouch.filesystem, 'mv original.txt renomeado.txt');

    expect(afterMv.exitCode).toBe(0);
    expect(afterMv.stderr).toBe('');

    const catRenamed = runCommand(afterMv.filesystem, 'cat renomeado.txt');
    expect(catRenamed.exitCode).toBe(0);

    const catOriginal = runCommand(afterMv.filesystem, 'cat original.txt');
    expect(catOriginal.exitCode).not.toBe(0);
    expect(catOriginal.stderr).toBe('cat: original.txt: No such file or directory\n');
  });

  it('move um arquivo para dentro de um diretorio existente', () => {
    const initial = createInitialFilesystemState();
    const afterMkdir = runCommand(initial, 'mkdir projetos');
    const afterTouch = runCommand(afterMkdir.filesystem, 'touch notas.txt');
    const afterMv = runCommand(afterTouch.filesystem, 'mv notas.txt projetos');

    expect(afterMv.exitCode).toBe(0);
    expect(getNode(afterMv.filesystem.root, '/home/aluno/projetos/notas.txt')?.kind).toBe('file');
    expect(getNode(afterMv.filesystem.root, '/home/aluno/notas.txt')).toBeUndefined();
  });

  it('retorna erro controlado se a origem nao existir', () => {
    const initial = createInitialFilesystemState();
    const outcome = runCommand(initial, 'mv nao-existe.txt destino.txt');
    expect(outcome.exitCode).not.toBe(0);
    expect(outcome.filesystem).toBe(initial);
  });

  it('bloqueia movimento de um diretorio para dentro dele mesmo', () => {
    const initial = createInitialFilesystemState();
    const afterMkdir = runCommand(initial, 'mkdir projetos');
    const afterChild = runCommand(afterMkdir.filesystem, 'mkdir projetos/app');
    const outcome = runCommand(afterChild.filesystem, 'mv projetos projetos/app');

    expect(outcome.exitCode).not.toBe(0);
    expect(outcome.stderr).toBe(
      "mv: cannot move 'projetos' to 'projetos/app': not distinct paths\n",
    );
    expect(outcome.filesystem).toBe(afterChild.filesystem);
    expect(getNode(outcome.filesystem.root, '/home/aluno/projetos/app')?.kind).toBe('dir');
  });
});

describe('rm', () => {
  it('remove um arquivo existente', () => {
    const initial = createInitialFilesystemState();
    const afterTouch = runCommand(initial, 'touch notas.txt');
    const afterRm = runCommand(afterTouch.filesystem, 'rm notas.txt');

    expect(afterRm.exitCode).toBe(0);
    expect(afterRm.stderr).toBe('');
    expect(getNode(afterRm.filesystem.root, '/home/aluno/notas.txt')).toBeUndefined();

    // Imutabilidade: o estado anterior a remocao nao foi alterado.
    expect(getNode(afterTouch.filesystem.root, '/home/aluno/notas.txt')?.kind).toBe('file');
  });

  it('remove um diretorio vazio', () => {
    const initial = createInitialFilesystemState();
    const afterMkdir = runCommand(initial, 'mkdir vazio');
    const afterRm = runCommand(afterMkdir.filesystem, 'rm vazio');

    expect(afterRm.exitCode).toBe(0);
    expect(getNode(afterRm.filesystem.root, '/home/aluno/vazio')).toBeUndefined();
  });

  it('retorna erro controlado ao tentar remover um diretorio nao vazio', () => {
    const initial = createInitialFilesystemState();
    const afterMkdir = runCommand(initial, 'mkdir projetos');
    const afterTouch = runCommand(afterMkdir.filesystem, 'touch projetos/notas.txt');
    const afterRm = runCommand(afterTouch.filesystem, 'rm projetos');

    expect(afterRm.exitCode).not.toBe(0);
    expect(afterRm.stderr).toBe("rm: cannot remove 'projetos': Directory not empty\n");
    // Estado nao foi alterado pela tentativa (mesma referencia).
    expect(afterRm.filesystem).toBe(afterTouch.filesystem);
    expect(getNode(afterRm.filesystem.root, '/home/aluno/projetos/notas.txt')?.kind).toBe('file');
  });

  it('retorna erro controlado se o caminho nao existir', () => {
    const initial = createInitialFilesystemState();
    const outcome = runCommand(initial, 'rm nao-existe.txt');
    expect(outcome.exitCode).not.toBe(0);
    expect(outcome.filesystem).toBe(initial);
  });
});

describe('tree', () => {
  it('imprime uma estrutura deterministica a partir do cwd', () => {
    const initial = createInitialFilesystemState();
    const afterMkdirA = runCommand(initial, 'mkdir zebra');
    const afterMkdirB = runCommand(afterMkdirA.filesystem, 'mkdir abacaxi');
    const afterTouch = runCommand(afterMkdirB.filesystem, 'touch nota.txt');
    const afterTouchNested = runCommand(afterTouch.filesystem, 'touch abacaxi/dentro.txt');

    const outcome = runCommand(afterTouchNested.filesystem, 'tree');
    expect(outcome.exitCode).toBe(0);
    expect(outcome.stdout).toBe(
      ['.', '|-- abacaxi', '|   `-- dentro.txt', '|-- nota.txt', '`-- zebra', ''].join('\n'),
    );
  });

  it('retorna erro controlado se receber argumentos nesta fatia', () => {
    const initial = createInitialFilesystemState();
    const outcome = runCommand(initial, 'tree algo');
    expect(outcome.exitCode).not.toBe(0);
    expect(outcome.filesystem).toBe(initial);
  });
});

describe('imutabilidade entre comandos de arquivo', () => {
  it('nenhum comando desta fatia muta o estado anterior (touch, cp, mv, rm)', () => {
    const initial = createInitialFilesystemState();

    const afterTouch = runCommand(initial, 'touch a.txt');
    expect(getNode(initial.root, '/home/aluno/a.txt')).toBeUndefined();
    expect(getNode(afterTouch.filesystem.root, '/home/aluno/a.txt')).toBeDefined();

    const afterCp = runCommand(afterTouch.filesystem, 'cp a.txt b.txt');
    expect(getNode(afterTouch.filesystem.root, '/home/aluno/b.txt')).toBeUndefined();
    expect(getNode(afterCp.filesystem.root, '/home/aluno/b.txt')).toBeDefined();

    const afterMv = runCommand(afterCp.filesystem, 'mv b.txt c.txt');
    expect(getNode(afterCp.filesystem.root, '/home/aluno/b.txt')).toBeDefined();
    expect(getNode(afterCp.filesystem.root, '/home/aluno/c.txt')).toBeUndefined();
    expect(getNode(afterMv.filesystem.root, '/home/aluno/b.txt')).toBeUndefined();
    expect(getNode(afterMv.filesystem.root, '/home/aluno/c.txt')).toBeDefined();

    const afterRm = runCommand(afterMv.filesystem, 'rm c.txt');
    expect(getNode(afterMv.filesystem.root, '/home/aluno/c.txt')).toBeDefined();
    expect(getNode(afterRm.filesystem.root, '/home/aluno/c.txt')).toBeUndefined();
  });
});

describe('erros de comandos de arquivo nunca lancam excecao', () => {
  it('todos os cenarios de erro desta fatia retornam TerminalCommandOutcome, nunca throw', () => {
    const initial = createInitialFilesystemState();
    const commandLines = [
      'touch',
      'touch a b',
      'touch a/b/c.txt',
      'cat',
      'cat nao-existe.txt',
      'cp',
      'cp so-um-arg',
      'cp nao-existe.txt destino.txt',
      'mv',
      'mv so-um-arg',
      'mv nao-existe.txt destino.txt',
      'rm',
      'rm nao-existe.txt',
      'tree algo',
    ];

    for (const commandLine of commandLines) {
      expect(() => runCommand(initial, commandLine)).not.toThrow();
      const outcome = runCommand(initial, commandLine);
      expect(typeof outcome.exitCode).toBe('number');
      expect(outcome.exitCode).not.toBe(0);
      expect(outcome.filesystem).toBe(initial);
    }
  });
});

describe('ExecutionResult apos comandos de arquivo', () => {
  it('o snapshot de ExecutionResult reflete arquivos e diretorios atualizados por esta fatia', () => {
    const initial = createInitialFilesystemState();
    const afterMkdir = runCommand(initial, 'mkdir projetos');
    const afterTouch = runCommand(afterMkdir.filesystem, 'touch projetos/notas.txt');
    const afterCp = runCommand(afterTouch.filesystem, 'cp projetos/notas.txt raiz.txt');

    const origin: ExecutionRequestRef = {
      executionRequestId: 'req-2',
      commandAttempt: { commandAttemptId: 'attempt-2' },
      environmentProfileId: 'linux',
    };

    const result = buildExecutionResult(
      origin,
      'cp projetos/notas.txt raiz.txt',
      afterCp,
      '2026-08-15T19:00:00.000Z',
      2,
    );

    expect(result.adapterId).toBe('virtual-shell');
    expect(result.filesystem.cwd).toBe('/home/aluno');
    expect(result.filesystem.entries).toEqual([
      { path: '/home', kind: 'dir' },
      { path: '/home/aluno', kind: 'dir' },
      { path: '/home/aluno/projetos', kind: 'dir' },
      { path: '/home/aluno/projetos/notas.txt', kind: 'file', content: '' },
      { path: '/home/aluno/raiz.txt', kind: 'file', content: '' },
    ]);
  });
});
