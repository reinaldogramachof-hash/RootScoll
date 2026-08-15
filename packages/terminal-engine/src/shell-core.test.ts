import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import type { ExecutionRequestRef } from '@codechat/types';
import {
  buildExecutionResult,
  createInitialFilesystemState,
  resolvePath,
  runCommand,
  toFilesystemSnapshot,
} from './index';

// ---------------------------------------------------------------------------
// Testes — Shell Core / Terminal Engine Mínimo (Fase 1)
//
// Cobre o comportamento mínimo exigido para os 4 comandos aprovados nesta
// fatia (pwd, ls, cd, mkdir) sobre o filesystem virtual em memória, mais a
// ponte com ExecutionResult (@codechat/types) e uma guarda de dependências.
// ---------------------------------------------------------------------------

describe('estado inicial do filesystem', () => {
  it('comeca em /home/aluno, com a arvore home/aluno ja criada e vazia', () => {
    const state = createInitialFilesystemState();
    expect(state.cwd).toBe('/home/aluno');
    expect(state.root.kind).toBe('dir');
    expect(Object.keys(state.root.children)).toEqual(['home']);

    const home = state.root.children['home'];
    expect(home?.kind).toBe('dir');
    if (home?.kind === 'dir') {
      expect(Object.keys(home.children)).toEqual(['aluno']);
      const aluno = home.children['aluno'];
      expect(aluno?.kind).toBe('dir');
      if (aluno?.kind === 'dir') {
        expect(Object.keys(aluno.children)).toEqual([]);
      }
    }
  });
});

describe('pwd', () => {
  it('retorna o diretorio atual, sem erro', () => {
    const state = createInitialFilesystemState();
    const outcome = runCommand(state, 'pwd');
    expect(outcome.stdout).toBe('/home/aluno\n');
    expect(outcome.stderr).toBe('');
    expect(outcome.exitCode).toBe(0);
    expect(outcome.filesystem).toBe(state); // pwd nao muta o filesystem
  });
});

describe('mkdir + ls', () => {
  it('mkdir cria um diretorio, e ls o lista em seguida', () => {
    const initial = createInitialFilesystemState();

    const afterMkdir = runCommand(initial, 'mkdir projetos');
    expect(afterMkdir.exitCode).toBe(0);
    expect(afterMkdir.stderr).toBe('');

    const afterLs = runCommand(afterMkdir.filesystem, 'ls');
    expect(afterLs.exitCode).toBe(0);
    expect(afterLs.stdout).toBe('projetos\n');
    expect(afterLs.stderr).toBe('');

    // Imutabilidade: o estado inicial nao foi alterado pela criacao do novo.
    const lsInitial = runCommand(initial, 'ls');
    expect(lsInitial.stdout).toBe('');
  });

  it('ls lista multiplas entradas em ordem alfabetica', () => {
    const initial = createInitialFilesystemState();
    const afterZ = runCommand(initial, 'mkdir zebra');
    const afterA = runCommand(afterZ.filesystem, 'mkdir abacaxi');
    const result = runCommand(afterA.filesystem, 'ls');
    expect(result.stdout).toBe('abacaxi\nzebra\n');
  });

  it('ls com argumento retorna erro controlado nesta fatia minima', () => {
    const initial = createInitialFilesystemState();
    const outcome = runCommand(initial, 'ls projetos');
    expect(outcome.exitCode).toBe(1);
    expect(outcome.stdout).toBe('');
    expect(outcome.stderr).toBe('ls: argumentos nao suportados nesta fatia: projetos\n');
    expect(outcome.filesystem).toBe(initial);
  });
});

describe('cd para diretorio existente', () => {
  it('muda o cwd quando o destino existe e e diretorio (relativo)', () => {
    const initial = createInitialFilesystemState();
    const afterMkdir = runCommand(initial, 'mkdir projetos');
    const afterCd = runCommand(afterMkdir.filesystem, 'cd projetos');

    expect(afterCd.exitCode).toBe(0);
    expect(afterCd.stderr).toBe('');
    expect(afterCd.filesystem.cwd).toBe('/home/aluno/projetos');

    const pwdResult = runCommand(afterCd.filesystem, 'pwd');
    expect(pwdResult.stdout).toBe('/home/aluno/projetos\n');
  });

  it('cd com multiplos argumentos retorna erro controlado', () => {
    const initial = createInitialFilesystemState();
    const outcome = runCommand(initial, 'cd a b');
    expect(outcome.exitCode).toBe(1);
    expect(outcome.stderr).toBe('bash: cd: too many arguments\n');
    expect(outcome.filesystem).toBe(initial);
  });
});

describe('cd ..', () => {
  it('sobe um nivel a partir de um subdiretorio', () => {
    const initial = createInitialFilesystemState();
    const afterMkdir = runCommand(initial, 'mkdir projetos');
    const afterCdIn = runCommand(afterMkdir.filesystem, 'cd projetos');
    const afterCdUp = runCommand(afterCdIn.filesystem, 'cd ..');

    expect(afterCdUp.exitCode).toBe(0);
    expect(afterCdUp.filesystem.cwd).toBe('/home/aluno');
  });

  it('cd .. na raiz e um no-op seguro (nao sai da arvore, nao lanca excecao)', () => {
    const initial = createInitialFilesystemState();
    const atRoot = runCommand(initial, 'cd ..');
    const atRootAgain = runCommand(atRoot.filesystem, 'cd ..');
    const atRootOnceMore = runCommand(atRootAgain.filesystem, 'cd ..');
    expect(atRootOnceMore.filesystem.cwd).toBe('/');
    // uma quarta vez nao deve lancar nem sair de '/'
    const stillRoot = runCommand(atRootOnceMore.filesystem, 'cd ..');
    expect(stillRoot.exitCode).toBe(0);
    expect(stillRoot.filesystem.cwd).toBe('/');
  });
});

describe('cd para diretorio inexistente', () => {
  it('retorna erro controlado, exitCode != 0, e nao muda o cwd', () => {
    const initial = createInitialFilesystemState();
    const outcome = runCommand(initial, 'cd nao-existe');

    expect(outcome.exitCode).not.toBe(0);
    expect(outcome.stderr).toBe('bash: cd: nao-existe: No such file or directory\n');
    expect(outcome.filesystem.cwd).toBe('/home/aluno');
  });

  it('retorna erro controlado ao tentar cd para dentro de um diretorio que nao existe', () => {
    const initial = createInitialFilesystemState();
    const outcome = runCommand(initial, 'cd a/b/c');
    expect(outcome.exitCode).not.toBe(0);
    expect(outcome.filesystem.cwd).toBe('/home/aluno');
  });
});

describe('mkdir duplicado', () => {
  it('retorna erro controlado na segunda tentativa, exitCode != 0', () => {
    const initial = createInitialFilesystemState();
    const first = runCommand(initial, 'mkdir projetos');
    expect(first.exitCode).toBe(0);

    const second = runCommand(first.filesystem, 'mkdir projetos');
    expect(second.exitCode).not.toBe(0);
    expect(second.stderr).toBe("mkdir: cannot create directory 'projetos': File exists\n");

    // Estado nao foi corrompido pela tentativa duplicada.
    const ls = runCommand(second.filesystem, 'ls');
    expect(ls.stdout).toBe('projetos\n');
  });

  it('mkdir com multiplos operandos retorna erro controlado nesta fatia minima', () => {
    const initial = createInitialFilesystemState();
    const outcome = runCommand(initial, 'mkdir a b');
    expect(outcome.exitCode).toBe(1);
    expect(outcome.stdout).toBe('');
    expect(outcome.stderr).toBe('mkdir: multiplos operandos nao suportados nesta fatia: a b\n');
    expect(outcome.filesystem).toBe(initial);
  });
});

describe('comando desconhecido', () => {
  it('retorna erro controlado com exitCode diferente de 0, sem lancar excecao', () => {
    const initial = createInitialFilesystemState();
    const outcome = runCommand(initial, 'sudo rm -rf /');

    expect(outcome.exitCode).not.toBe(0);
    expect(outcome.exitCode).toBe(127);
    expect(outcome.stderr).toBe('bash: sudo: command not found\n');
    expect(outcome.filesystem).toBe(initial);
  });

  it('linha de comando vazia e um no-op silencioso, nao um erro', () => {
    const initial = createInitialFilesystemState();
    const outcome = runCommand(initial, '   ');
    expect(outcome.exitCode).toBe(0);
    expect(outcome.stdout).toBe('');
    expect(outcome.stderr).toBe('');
  });
});

describe('resolucao de caminhos (nomes simples e ..)', () => {
  it('resolve caminhos relativos com multiplos segmentos e absolutos', () => {
    expect(resolvePath('/home/aluno', 'projetos')).toBe('/home/aluno/projetos');
    expect(resolvePath('/home/aluno', '..')).toBe('/home');
    expect(resolvePath('/home/aluno', '../..')).toBe('/');
    expect(resolvePath('/home/aluno', '/etc')).toBe('/etc');
    expect(resolvePath('/home/aluno', 'a/b/../c')).toBe('/home/aluno/a/c');
  });
});

describe('garantia de ausencia de dependencia de UI, Supabase ou IA', () => {
  it('package.json de terminal-engine so declara @codechat/types como dependencia', () => {
    const packageJsonPath = path.resolve(
      path.dirname(fileURLToPath(import.meta.url)),
      '../package.json',
    );
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8')) as {
      dependencies?: Record<string, string>;
      devDependencies?: Record<string, string>;
    };

    const dependencyNames = Object.keys(packageJson.dependencies ?? {});
    expect(dependencyNames).toEqual(['@codechat/types']);

    const allDeclaredNames = [
      ...dependencyNames,
      ...Object.keys(packageJson.devDependencies ?? {}),
    ];
    const forbiddenSubstrings = [
      'supabase',
      'react',
      'vue',
      'openai',
      'anthropic',
      '@codechat/web',
    ];
    for (const declaredName of allDeclaredNames) {
      for (const forbidden of forbiddenSubstrings) {
        expect(declaredName.toLowerCase()).not.toContain(forbidden);
      }
    }
  });
});

describe('geracao de ExecutionResult compativel', () => {
  it('buildExecutionResult produz adapterId virtual-shell, cwd, stdout, stderr, exitCode e snapshot corretos', () => {
    const initial = createInitialFilesystemState();
    const afterMkdir = runCommand(initial, 'mkdir projetos');

    const origin: ExecutionRequestRef = {
      executionRequestId: 'req-1',
      commandAttempt: { commandAttemptId: 'attempt-1' },
      environmentProfileId: 'linux',
    };

    const result = buildExecutionResult(
      origin,
      'mkdir projetos',
      afterMkdir,
      '2026-08-15T18:00:00.000Z',
      3,
    );

    expect(result.origin).toBe(origin);
    expect(result.command).toBe('mkdir projetos');
    expect(result.adapterId).toBe('virtual-shell');
    expect(result.stdout).toBe(afterMkdir.stdout);
    expect(result.stderr).toBe(afterMkdir.stderr);
    expect(result.exitCode).toBe(afterMkdir.exitCode);
    expect(result.durationMs).toBe(3);
    expect(result.completedAt).toBe('2026-08-15T18:00:00.000Z');
    expect(result.filesystem.cwd).toBe('/home/aluno');
    expect(result.filesystem.entries).toEqual([
      { path: '/home', kind: 'dir' },
      { path: '/home/aluno', kind: 'dir' },
      { path: '/home/aluno/projetos', kind: 'dir' },
    ]);

    // Nunca referencia Challenge/ChallengeProgress/Lesson/usuario — checagem
    // estrutural: o objeto so tem os campos do contrato ExecutionResult.
    expect(Object.keys(result).sort()).toEqual(
      [
        'origin',
        'command',
        'stdout',
        'stderr',
        'exitCode',
        'durationMs',
        'adapterId',
        'filesystem',
        'completedAt',
      ].sort(),
    );
  });

  it('toFilesystemSnapshot inclui arquivos (kind e content) quando presentes na arvore', () => {
    const state = createInitialFilesystemState();
    const withFile = {
      ...state,
      root: {
        kind: 'dir' as const,
        children: {
          ...state.root.children,
          'notas.txt': { kind: 'file' as const, content: 'ola' },
        },
      },
    };

    const snapshot = toFilesystemSnapshot(withFile.root, withFile.cwd);
    const fileEntry = snapshot.entries.find((entry) => entry.path === '/notas.txt');
    expect(fileEntry).toEqual({ path: '/notas.txt', kind: 'file', content: 'ola' });
  });
});
