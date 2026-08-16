import { describe, expect, it } from 'vitest';
import { createInitialFilesystemState, runCommand } from '@codechat/terminal-engine';
import { LESSONS } from './lessons';

// ---------------------------------------------------------------------------
// Testes — validadores locais das lições-piloto, contra o filesystem virtual
// real de @codechat/terminal-engine (prova o fluxo licao -> comando ->
// filesystem virtual -> validacao local, ponta a ponta, sem UI).
// ---------------------------------------------------------------------------

describe('LESSONS', () => {
  it('define exatamente as 2 licoes-piloto aprovadas, com ids estaveis', () => {
    expect(LESSONS.map((lesson) => lesson.id)).toEqual([
      'piloto-01-criar-pasta',
      'piloto-02-criar-readme',
    ]);
  });
});

describe('Licao 1 — criar pasta projetos', () => {
  const lesson = LESSONS[0];
  if (lesson === undefined) {
    throw new Error('Licao 1 nao encontrada em LESSONS');
  }

  it('nao esta completa no estado inicial', () => {
    const initial = createInitialFilesystemState();
    expect(lesson.isComplete(initial)).toBe(false);
  });

  it('fica completa apos "mkdir projetos"', () => {
    const initial = createInitialFilesystemState();
    const afterMkdir = runCommand(initial, 'mkdir projetos');
    expect(afterMkdir.exitCode).toBe(0);
    expect(lesson.isComplete(afterMkdir.filesystem)).toBe(true);
  });

  it('nao fica completa com um arquivo de mesmo nome (precisa ser diretorio)', () => {
    const initial = createInitialFilesystemState();
    const afterTouch = runCommand(initial, 'touch projetos');
    expect(afterTouch.exitCode).toBe(0);
    expect(lesson.isComplete(afterTouch.filesystem)).toBe(false);
  });

  it('comandos de exploracao (pwd, ls) sozinhos nao completam a licao', () => {
    const initial = createInitialFilesystemState();
    const afterPwd = runCommand(initial, 'pwd');
    const afterLs = runCommand(afterPwd.filesystem, 'ls');
    expect(lesson.isComplete(afterLs.filesystem)).toBe(false);
  });
});

describe('Licao 2 — criar README.md', () => {
  const lesson = LESSONS[1];
  if (lesson === undefined) {
    throw new Error('Licao 2 nao encontrada em LESSONS');
  }

  it('nao esta completa no estado inicial', () => {
    const initial = createInitialFilesystemState();
    expect(lesson.isComplete(initial)).toBe(false);
  });

  it('fica completa apos "touch README.md"', () => {
    const initial = createInitialFilesystemState();
    const afterTouch = runCommand(initial, 'touch README.md');
    expect(afterTouch.exitCode).toBe(0);
    expect(lesson.isComplete(afterTouch.filesystem)).toBe(true);
  });

  it('nao fica completa com um diretorio de mesmo nome (precisa ser arquivo)', () => {
    const initial = createInitialFilesystemState();
    const afterMkdir = runCommand(initial, 'mkdir README.md');
    expect(afterMkdir.exitCode).toBe(0);
    expect(lesson.isComplete(afterMkdir.filesystem)).toBe(false);
  });

  it('permanece completa apos cat (comando de leitura, nao remove o arquivo)', () => {
    const initial = createInitialFilesystemState();
    const afterTouch = runCommand(initial, 'touch README.md');
    const afterCat = runCommand(afterTouch.filesystem, 'cat README.md');
    expect(afterCat.exitCode).toBe(0);
    expect(lesson.isComplete(afterCat.filesystem)).toBe(true);
  });
});
