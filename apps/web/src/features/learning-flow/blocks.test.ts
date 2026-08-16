import { describe, expect, it } from 'vitest';
import { createInitialFilesystemState, runCommand } from '@codechat/terminal-engine';
import { LEARNING_BLOCKS } from './blocks';

// ---------------------------------------------------------------------------
// Testes — validadores locais dos blocos-piloto, contra o filesystem virtual
// real de @codechat/terminal-engine (mesma cobertura de
// ../lessons/lessons.test.ts, agora sobre `assessment.isComplete`).
// ---------------------------------------------------------------------------

describe('LEARNING_BLOCKS', () => {
  it('define exatamente os 2 blocos-piloto aprovados, com ids estaveis', () => {
    expect(LEARNING_BLOCKS.map((block) => block.id)).toEqual([
      'piloto-01-criar-pasta',
      'piloto-02-criar-readme',
    ]);
  });

  it('todo bloco tem ao menos 1 paragrafo de teoria e 1 dica de mentor', () => {
    for (const block of LEARNING_BLOCKS) {
      expect(block.theory.paragraphs.length).toBeGreaterThan(0);
      expect(block.mentorHints.length).toBeGreaterThan(0);
    }
  });

  it('dicas de mentor de cada bloco estao em ordem crescente de afterAttempts', () => {
    for (const block of LEARNING_BLOCKS) {
      const attempts = block.mentorHints.map((hint) => hint.afterAttempts);
      const sorted = [...attempts].sort((a, b) => a - b);
      expect(attempts).toEqual(sorted);
    }
  });
});

describe('Bloco 1 — criar pasta projetos', () => {
  const block = LEARNING_BLOCKS[0];
  if (block === undefined) {
    throw new Error('Bloco 1 nao encontrado em LEARNING_BLOCKS');
  }

  it('avaliacao nao esta completa no estado inicial', () => {
    const initial = createInitialFilesystemState();
    expect(block.assessment.isComplete(initial)).toBe(false);
  });

  it('avaliacao fica completa apos "mkdir projetos"', () => {
    const initial = createInitialFilesystemState();
    const afterMkdir = runCommand(initial, 'mkdir projetos');
    expect(afterMkdir.exitCode).toBe(0);
    expect(block.assessment.isComplete(afterMkdir.filesystem)).toBe(true);
  });

  it('avaliacao nao fica completa com um arquivo de mesmo nome (precisa ser diretorio)', () => {
    const initial = createInitialFilesystemState();
    const afterTouch = runCommand(initial, 'touch projetos');
    expect(afterTouch.exitCode).toBe(0);
    expect(block.assessment.isComplete(afterTouch.filesystem)).toBe(false);
  });

  it('comandos de exploracao (pwd, ls) sozinhos nao completam a avaliacao', () => {
    const initial = createInitialFilesystemState();
    const afterPwd = runCommand(initial, 'pwd');
    const afterLs = runCommand(afterPwd.filesystem, 'ls');
    expect(block.assessment.isComplete(afterLs.filesystem)).toBe(false);
  });
});

describe('Bloco 2 — criar README.md', () => {
  const block = LEARNING_BLOCKS[1];
  if (block === undefined) {
    throw new Error('Bloco 2 nao encontrado em LEARNING_BLOCKS');
  }

  it('avaliacao nao esta completa no estado inicial', () => {
    const initial = createInitialFilesystemState();
    expect(block.assessment.isComplete(initial)).toBe(false);
  });

  it('avaliacao fica completa apos "touch README.md"', () => {
    const initial = createInitialFilesystemState();
    const afterTouch = runCommand(initial, 'touch README.md');
    expect(afterTouch.exitCode).toBe(0);
    expect(block.assessment.isComplete(afterTouch.filesystem)).toBe(true);
  });

  it('avaliacao nao fica completa com um diretorio de mesmo nome (precisa ser arquivo)', () => {
    const initial = createInitialFilesystemState();
    const afterMkdir = runCommand(initial, 'mkdir README.md');
    expect(afterMkdir.exitCode).toBe(0);
    expect(block.assessment.isComplete(afterMkdir.filesystem)).toBe(false);
  });

  it('permanece completa apos cat (comando de leitura, nao remove o arquivo)', () => {
    const initial = createInitialFilesystemState();
    const afterTouch = runCommand(initial, 'touch README.md');
    const afterCat = runCommand(afterTouch.filesystem, 'cat README.md');
    expect(afterCat.exitCode).toBe(0);
    expect(block.assessment.isComplete(afterCat.filesystem)).toBe(true);
  });
});
