import { describe, expect, it } from 'vitest';
import { createInitialFilesystemState, runCommand } from '@codechat/terminal-engine';
import { LEARNING_BLOCKS } from './blocks';

describe('LEARNING_BLOCKS (20 blocos MVP)', () => {
  it('define exatamente os 20 blocos MVP do @codechat/content', () => {
    expect(LEARNING_BLOCKS).toHaveLength(20);
    expect(LEARNING_BLOCKS[0]?.id).toBe('01-bem-vindo');
    expect(LEARNING_BLOCKS[19]?.id).toBe('20-css-box-model');
  });

  it('todo bloco tem ao menos 1 parágrafo de teoria e 1 dica de mentor', () => {
    for (const block of LEARNING_BLOCKS) {
      expect(block.theory.paragraphs.length).toBeGreaterThan(0);
      expect(block.mentorHints.length).toBeGreaterThan(0);
    }
  });

  it('dicas de mentor de cada bloco estão em ordem crescente de afterAttempts', () => {
    for (const block of LEARNING_BLOCKS) {
      const attempts = block.mentorHints.map((hint) => hint.afterAttempts);
      const sorted = [...attempts].sort((a, b) => a - b);
      expect(attempts).toEqual(sorted);
    }
  });
});

describe('Bloco 06 — Criando Diretórios (mkdir codigo)', () => {
  const block = LEARNING_BLOCKS.find((b) => b.id === '06-criando-diretorios');
  if (!block) {
    throw new Error('Bloco 06 não encontrado');
  }

  it('avaliação não está completa no estado inicial', () => {
    const initial = createInitialFilesystemState();
    expect(block.assessment.isComplete(initial)).toBe(false);
  });

  it('avaliação fica completa após "mkdir codigo"', () => {
    const initial = createInitialFilesystemState();
    const afterMkdir = runCommand(initial, 'mkdir codigo');
    expect(afterMkdir.exitCode).toBe(0);
    expect(block.assessment.isComplete(afterMkdir.filesystem)).toBe(true);
  });

  it('avaliação não fica completa com um arquivo de mesmo nome (precisa ser diretório)', () => {
    const initial = createInitialFilesystemState();
    const afterTouch = runCommand(initial, 'touch codigo');
    expect(afterTouch.exitCode).toBe(0);
    expect(block.assessment.isComplete(afterTouch.filesystem)).toBe(false);
  });
});

describe('Bloco 07 — Criando Arquivos (touch app.js)', () => {
  const block = LEARNING_BLOCKS.find((b) => b.id === '07-criando-arquivos');
  if (!block) {
    throw new Error('Bloco 07 não encontrado');
  }

  it('avaliação não está completa no estado inicial', () => {
    const initial = createInitialFilesystemState();
    expect(block.assessment.isComplete(initial)).toBe(false);
  });

  it('avaliação fica completa após "touch app.js"', () => {
    const initial = createInitialFilesystemState();
    const afterTouch = runCommand(initial, 'touch app.js');
    expect(afterTouch.exitCode).toBe(0);
    expect(block.assessment.isComplete(afterTouch.filesystem)).toBe(true);
  });

  it('avaliação não fica completa com um diretório de mesmo nome (precisa ser arquivo)', () => {
    const initial = createInitialFilesystemState();
    const afterMkdir = runCommand(initial, 'mkdir app.js');
    expect(afterMkdir.exitCode).toBe(0);
    expect(block.assessment.isComplete(afterMkdir.filesystem)).toBe(false);
  });
});

describe('Suporte a Múltiplos Passos (Active Practice Steps)', () => {
  it('todo bloco tem a propriedade steps preenchida com pelo menos 1 passo', () => {
    for (const block of LEARNING_BLOCKS) {
      expect(block.steps).toBeDefined();
      expect(block.steps.length).toBeGreaterThanOrEqual(1);
      const firstStep = block.steps[0];
      expect(firstStep).toBeDefined();
      expect(firstStep?.stepNumber).toBe(1);
      expect(firstStep?.isComplete).toBeTypeOf('function');
    }
  });
});


