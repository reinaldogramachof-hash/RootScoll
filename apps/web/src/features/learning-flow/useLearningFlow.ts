import { useCallback, useMemo, useReducer, useState, useEffect } from 'react';
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
 * com `flowReducer` e suporte a múltiplos passos de prática contínua no terminal.
 */
export function useLearningFlow(initialBlockIndex: number = 0) {
  const terminal = useTerminalSession();
  const [flowState, dispatch] = useReducer(
    reduceFlow,
    undefined,
    () => createInitialFlowState(initialBlockIndex)
  );

  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const currentBlock = LEARNING_BLOCKS[flowState.blockIndex];
  if (currentBlock === undefined) {
    throw new Error(`Bloco pedagógico inexistente no índice ${flowState.blockIndex}`);
  }

  const activeStep = currentBlock.steps[currentStepIndex] || currentBlock.steps[0];

  const startPractice = useCallback(() => {
    dispatch({ type: 'start-practice' });
    setCurrentStepIndex(0);

    // Impressão limpa da Teoria e Contexto no próprio Terminal
    terminal.pushLine('system', `\n=== CODECHAT :: ${currentBlock.title} ===`);
    currentBlock.theory.paragraphs.forEach((p) => {
      terminal.pushLine('comment', p);
    });

    const firstStep = currentBlock.steps[0];
    if (firstStep) {
      terminal.pushLine(
        'system',
        `\n➜ [Passo 1/${currentBlock.steps.length}] ${firstStep.title ? firstStep.title + ': ' : ''}${firstStep.objective}`
      );
    }
  }, [currentBlock, terminal]);

  // Imprimir teoria ao carregar o bloco pela primeira vez
  useEffect(() => {
    if (flowState.step === 'theory') {
      startPractice();
    }
  }, [flowState.blockIndex]); // eslint-disable-line react-hooks/exhaustive-deps

  const submitCommand = useCallback(() => {
    const outcome = terminal.submitCommand();
    if (outcome === undefined) {
      return;
    }
    dispatch({ type: 'command-run' });

    if (flowState.step === 'practice' && activeStep) {
      const stepPassed = activeStep.isComplete(outcome.filesystem);

      if (stepPassed) {
        terminal.pushLine('success', `✓ ${activeStep.successMessage}`);

        const nextStepIdx = currentStepIndex + 1;
        if (nextStepIdx < currentBlock.steps.length) {
          setCurrentStepIndex(nextStepIdx);
          const nextStep = currentBlock.steps[nextStepIdx];
          if (nextStep) {
            terminal.pushLine(
              'system',
              `➜ [Passo ${nextStepIdx + 1}/${currentBlock.steps.length}] ${nextStep.title ? nextStep.title + ': ' : ''}${nextStep.objective}`
            );
          }
        } else {
          // Todos os passos concluídos!
          dispatch({ type: 'assessment-passed' });
          terminal.pushLine('success', `★ ${currentBlock.assessment.successMessage}`);
        }
      }
    }
  }, [terminal, flowState.step, activeStep, currentStepIndex, currentBlock]);

  const restartBlock = useCallback(() => {
    dispatch({ type: 'start-practice' });
    setCurrentStepIndex(0);
    terminal.pushLine('system', '\n--- Exercício Reiniciado por Regra de Integridade ---');
    terminal.pushLine('comment', `# ${currentBlock.title}`);
    const firstStep = currentBlock.steps[0];
    if (firstStep) {
      terminal.pushLine('system', `➜ [Passo 1/${currentBlock.steps.length}] ${firstStep.objective}`);
    }
  }, [currentBlock, terminal]);

  const concludeAssessment = useCallback(() => {
    dispatch({ type: 'conclude' });
  }, []);

  const goToNextBlock = useCallback(() => {
    dispatch({ type: 'next-block' });
    setCurrentStepIndex(0);
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
    activeStep,
    currentStepIndex,
    totalSteps: currentBlock.steps.length,
    progress,
    finished,
    hasNextBlock,
    attemptCount: flowState.attemptCount,
    mentorHint,
    startPractice,
    restartBlock,
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

