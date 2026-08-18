import type { LearningStep } from './types';

/**
 * Máquina de estados pura do fluxo de aprendizagem — teoria -> prática ->
 * avaliação -> conclusão, com progressão entre múltiplos blocos
 * (`LEARNING_BLOCKS`). Pura e diretamente testável (sem DOM/React), seguindo
 * o padrão já usado em `../terminal/terminal-format.ts`: toda a lógica não
 * trivial fica fora do componente/hook React.
 *
 * Prática e avaliação usam o MESMO terminal (mesma sessão/filesystem
 * contínuos) — ver `docs/architecture` (protótipo visual fullscreen
 * aprovado) e o Implementation Report desta fatia, seção "Decisões
 * técnicas": a etapa 'assessment' representa o momento em que
 * `assessment.isComplete` (ver `./blocks.ts`) passou a ser verdadeiro dentro
 * da prática, não uma tela separada. Quem decide *quando* isso acontece é
 * `useLearningFlow` (chamando `assessment.isComplete` a cada comando) — este
 * reducer só modela as transições de estado a partir de eventos já
 * decididos.
 */

export interface FlowState {
  readonly blockIndex: number;
  readonly step: LearningStep;
  /** Tentativas de comando dentro da prática/avaliação do bloco atual. */
  readonly attemptCount: number;
  /** Se a avaliação do bloco atual já foi concluída com sucesso. */
  readonly assessmentPassed: boolean;
}

export type FlowEvent =
  | { readonly type: 'start-practice' }
  | { readonly type: 'command-run' }
  | { readonly type: 'assessment-passed' }
  | { readonly type: 'conclude' }
  | { readonly type: 'next-block' };

export function createInitialFlowState(blockIndex: number = 0): FlowState {
  return { blockIndex, step: 'theory', attemptCount: 0, assessmentPassed: false };
}

/**
 * Transição pura de estado. `blockCount` é o total de blocos disponíveis
 * (`LEARNING_BLOCKS.length`), usado só para saber se existe um próximo
 * bloco em `next-block`. Eventos fora de contexto (ex.: `command-run`
 * durante `theory`) são ignorados, retornando o mesmo `state` — guarda
 * defensiva, já que a UI não deve emiti-los fora de contexto, mas o reducer
 * não deve corromper o estado se isso acontecer.
 */
export function flowReducer(state: FlowState, event: FlowEvent, blockCount: number): FlowState {
  switch (event.type) {
    case 'start-practice': {
      if (state.step !== 'theory') {
        return state;
      }
      return { ...state, step: 'practice' };
    }

    case 'command-run': {
      if (state.step !== 'practice' && state.step !== 'assessment') {
        return state;
      }
      return { ...state, attemptCount: state.attemptCount + 1 };
    }

    case 'assessment-passed': {
      if (state.step !== 'practice') {
        return state;
      }
      return { ...state, step: 'assessment', assessmentPassed: true };
    }

    case 'conclude': {
      if (state.step !== 'assessment') {
        return state;
      }
      return { ...state, step: 'conclusion' };
    }

    case 'next-block': {
      if (state.step !== 'conclusion') {
        return state;
      }
      const nextIndex = state.blockIndex + 1;
      if (nextIndex >= blockCount) {
        return state;
      }
      return { blockIndex: nextIndex, step: 'theory', attemptCount: 0, assessmentPassed: false };
    }

    default:
      return state;
  }
}

/** Se o bloco atual é o último e já foi concluído (não há próximo bloco). */
export function isFlowFinished(state: FlowState, blockCount: number): boolean {
  return state.step === 'conclusion' && state.blockIndex + 1 >= blockCount;
}
