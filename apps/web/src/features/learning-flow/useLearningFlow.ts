import { useCallback, useMemo, useReducer } from 'react';
import { useTerminalSession } from '../terminal/useTerminalSession';
import { LEARNING_BLOCKS } from './blocks';
import { selectHint } from './mentor';
import { createInitialFlowState, flowReducer, isFlowFinished } from './flow-reducer';
import type { FlowEvent, FlowState } from './flow-reducer';
import type { MentorHint } from './types';

function reduceFlow(state: FlowState, event: FlowEvent): FlowState {
  return flowReducer(state, event, LEARNING_BLOCKS.length);
}

/**
 * Hook de orquestração do fluxo de aprendizagem: compõe `useTerminalSession`
 * (mecânica de terminal, agnóstica de lição) com `flowReducer` (máquina de
 * estados teoria -> prática -> avaliação -> conclusão) e `selectHint`
 * (mentor determinístico). Único ponto do app que conhece `LEARNING_BLOCKS`.
 *
 * Compõe `useTerminalSession` chamando `terminal.submitCommand()` e
 * inspecionando o `TerminalCommandOutcome` retornado — não injeta um
 * callback em `useTerminalSession` (ver comentário desse hook: evita a
 * dependência circular "hook precisa do próprio retorno de outro hook").
 */
export function useLearningFlow() {
  const terminal = useTerminalSession();
  const [flowState, dispatch] = useReducer(reduceFlow, undefined, createInitialFlowState);

  const currentBlock = LEARNING_BLOCKS[flowState.blockIndex];
  if (currentBlock === undefined) {
    throw new Error(`Bloco pedagógico inexistente no índice ${flowState.blockIndex}`);
  }

  const startPractice = useCallback(() => {
    dispatch({ type: 'start-practice' });
    terminal.pushLine('comment', `# ${currentBlock.title}`);
    terminal.pushLine('comment', `# Objetivo: ${currentBlock.practice.objective}`);
  }, [currentBlock, terminal]);

  const submitCommand = useCallback(() => {
    const outcome = terminal.submitCommand();
    if (outcome === undefined) {
      return;
    }
    dispatch({ type: 'command-run' });

    if (flowState.step === 'practice' && currentBlock.assessment.isComplete(outcome.filesystem)) {
      dispatch({ type: 'assessment-passed' });
      terminal.pushLine('success', currentBlock.assessment.successMessage);
    }
  }, [terminal, flowState.step, currentBlock]);

  const concludeAssessment = useCallback(() => {
    dispatch({ type: 'conclude' });
  }, []);

  const goToNextBlock = useCallback(() => {
    dispatch({ type: 'next-block' });
  }, []);

  const mentorHint: MentorHint | undefined = useMemo(
    () => selectHint(currentBlock.mentorHints, flowState.attemptCount),
    [currentBlock, flowState.attemptCount],
  );

  const progress = useMemo(
    () => ({ current: flowState.blockIndex + 1, total: LEARNING_BLOCKS.length }),
    [flowState.blockIndex],
  );

  const finished = isFlowFinished(flowState, LEARNING_BLOCKS.length);
  const hasNextBlock = flowState.blockIndex + 1 < LEARNING_BLOCKS.length;

  return {
    step: flowState.step,
    block: currentBlock,
    progress,
    finished,
    hasNextBlock,
    attemptCount: flowState.attemptCount,
    mentorHint,
    startPractice,
    concludeAssessment,
    goToNextBlock,
    terminal: {
      lines: terminal.lines,
      inputValue: terminal.inputValue,
      setInputValue: terminal.setInputValue,
      submitCommand,
      prompt: terminal.prompt,
    },
  };
}
