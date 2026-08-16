import { describe, expect, it } from 'vitest';
import {
  createInitialFlowState,
  flowReducer,
  isFlowFinished,
  type FlowState,
} from './flow-reducer';

const BLOCK_COUNT = 2;

describe('createInitialFlowState', () => {
  it('comeca no bloco 0, etapa theory, sem tentativas', () => {
    expect(createInitialFlowState()).toEqual({
      blockIndex: 0,
      step: 'theory',
      attemptCount: 0,
      assessmentPassed: false,
    });
  });
});

describe('flowReducer', () => {
  it('start-practice leva theory -> practice', () => {
    const state = createInitialFlowState();
    const next = flowReducer(state, { type: 'start-practice' }, BLOCK_COUNT);
    expect(next.step).toBe('practice');
  });

  it('start-practice fora de theory e ignorado', () => {
    const state: FlowState = { ...createInitialFlowState(), step: 'practice' };
    const next = flowReducer(state, { type: 'start-practice' }, BLOCK_COUNT);
    expect(next).toEqual(state);
  });

  it('command-run incrementa attemptCount durante practice', () => {
    const state: FlowState = { ...createInitialFlowState(), step: 'practice' };
    const next = flowReducer(state, { type: 'command-run' }, BLOCK_COUNT);
    expect(next.attemptCount).toBe(1);
  });

  it('command-run incrementa attemptCount durante assessment', () => {
    const state: FlowState = {
      ...createInitialFlowState(),
      step: 'assessment',
      assessmentPassed: true,
      attemptCount: 2,
    };
    const next = flowReducer(state, { type: 'command-run' }, BLOCK_COUNT);
    expect(next.attemptCount).toBe(3);
  });

  it('command-run durante theory ou conclusion e ignorado', () => {
    const theoryState = createInitialFlowState();
    expect(flowReducer(theoryState, { type: 'command-run' }, BLOCK_COUNT)).toEqual(theoryState);

    const conclusionState: FlowState = { ...createInitialFlowState(), step: 'conclusion' };
    expect(flowReducer(conclusionState, { type: 'command-run' }, BLOCK_COUNT)).toEqual(
      conclusionState,
    );
  });

  it('assessment-passed leva practice -> assessment e marca assessmentPassed', () => {
    const state: FlowState = { ...createInitialFlowState(), step: 'practice', attemptCount: 3 };
    const next = flowReducer(state, { type: 'assessment-passed' }, BLOCK_COUNT);
    expect(next.step).toBe('assessment');
    expect(next.assessmentPassed).toBe(true);
    expect(next.attemptCount).toBe(3);
  });

  it('assessment-passed fora de practice e ignorado', () => {
    const state = createInitialFlowState();
    expect(flowReducer(state, { type: 'assessment-passed' }, BLOCK_COUNT)).toEqual(state);
  });

  it('conclude leva assessment -> conclusion', () => {
    const state: FlowState = {
      ...createInitialFlowState(),
      step: 'assessment',
      assessmentPassed: true,
    };
    const next = flowReducer(state, { type: 'conclude' }, BLOCK_COUNT);
    expect(next.step).toBe('conclusion');
  });

  it('conclude fora de assessment e ignorado', () => {
    const state: FlowState = { ...createInitialFlowState(), step: 'practice' };
    expect(flowReducer(state, { type: 'conclude' }, BLOCK_COUNT)).toEqual(state);
  });

  it('next-block avanca para o proximo bloco, resetando etapa/tentativas', () => {
    const state: FlowState = {
      blockIndex: 0,
      step: 'conclusion',
      attemptCount: 5,
      assessmentPassed: true,
    };
    const next = flowReducer(state, { type: 'next-block' }, BLOCK_COUNT);
    expect(next).toEqual({
      blockIndex: 1,
      step: 'theory',
      attemptCount: 0,
      assessmentPassed: false,
    });
  });

  it('next-block no ultimo bloco e ignorado (nao ha proximo)', () => {
    const state: FlowState = {
      blockIndex: 1,
      step: 'conclusion',
      attemptCount: 0,
      assessmentPassed: true,
    };
    const next = flowReducer(state, { type: 'next-block' }, BLOCK_COUNT);
    expect(next).toEqual(state);
  });

  it('next-block fora de conclusion e ignorado', () => {
    const state: FlowState = { ...createInitialFlowState(), step: 'practice' };
    expect(flowReducer(state, { type: 'next-block' }, BLOCK_COUNT)).toEqual(state);
  });
});

describe('isFlowFinished', () => {
  it('falso antes do ultimo bloco concluir', () => {
    const state: FlowState = {
      blockIndex: 0,
      step: 'conclusion',
      attemptCount: 0,
      assessmentPassed: true,
    };
    expect(isFlowFinished(state, BLOCK_COUNT)).toBe(false);
  });

  it('verdadeiro no ultimo bloco, etapa conclusion', () => {
    const state: FlowState = {
      blockIndex: 1,
      step: 'conclusion',
      attemptCount: 0,
      assessmentPassed: true,
    };
    expect(isFlowFinished(state, BLOCK_COUNT)).toBe(true);
  });

  it('falso se ainda nao chegou em conclusion', () => {
    const state: FlowState = {
      blockIndex: 1,
      step: 'assessment',
      attemptCount: 0,
      assessmentPassed: true,
    };
    expect(isFlowFinished(state, BLOCK_COUNT)).toBe(false);
  });
});
