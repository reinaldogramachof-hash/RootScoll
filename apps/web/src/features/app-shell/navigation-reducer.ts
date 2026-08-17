import type { AppScreen, UserRole } from './types';

/**
 * Máquina de estados pura da navegação do shell — mesma filosofia de
 * `../learning-flow/flow-reducer.ts`: pura, testável sem DOM/React, guarda
 * transições fora de contexto em vez de corromper o estado.
 *
 * Não é um roteador real (sem `history`/URL) — a navegação "por rota" descrita
 * em `docs/product/app-navigation-v1.md` (`/login`, `/app`, `/app/perfil`,
 * `/app/trilhas`, `/app/sala/terminal/:blockId`, `/app/professor`, `/app/parceiro`)
 * é o plano de produto; esta fatia implementa o equivalente em memória.
 */

export interface NavState {
  readonly screen: AppScreen;
  readonly selectedClassroomId?: string;
  readonly selectedTalentId?: string;
}

export type NavEvent =
  | { readonly type: 'login'; readonly role?: UserRole }
  | { readonly type: 'logout' }
  | { readonly type: 'open-profile' }
  | { readonly type: 'open-tracks' }
  | { readonly type: 'back-to-dashboard' }
  | { readonly type: 'enter-classroom' }
  | { readonly type: 'open-teacher-dashboard' }
  | { readonly type: 'open-classroom-detail'; readonly classroomId: string }
  | { readonly type: 'open-partner-dashboard' }
  | { readonly type: 'open-talent-detail'; readonly talentId: string };

export function createInitialNavState(): NavState {
  return { screen: 'login' };
}

export function navigationReducer(state: NavState, event: NavEvent): NavState {
  switch (event.type) {
    case 'login': {
      if (state.screen !== 'login') {
        return state;
      }
      if (event.role === 'professor') {
        return { screen: 'teacher-dashboard' };
      }
      if (event.role === 'parceiro') {
        return { screen: 'partner-dashboard' };
      }
      return { screen: 'dashboard' };
    }

    case 'logout': {
      return { screen: 'login' };
    }

    case 'open-profile': {
      if (
        state.screen !== 'dashboard' &&
        state.screen !== 'teacher-dashboard' &&
        state.screen !== 'partner-dashboard'
      ) {
        return state;
      }
      return { ...state, screen: 'profile' };
    }

    case 'open-tracks': {
      if (state.screen !== 'dashboard') {
        return state;
      }
      return { ...state, screen: 'tracks' };
    }

    case 'open-teacher-dashboard': {
      return { ...state, screen: 'teacher-dashboard' };
    }

    case 'open-classroom-detail': {
      return {
        ...state,
        screen: 'teacher-classroom-detail',
        selectedClassroomId: event.classroomId,
      };
    }

    case 'open-partner-dashboard': {
      return { ...state, screen: 'partner-dashboard' };
    }

    case 'open-talent-detail': {
      return {
        ...state,
        screen: 'partner-talent-detail',
        selectedTalentId: event.talentId,
      };
    }

    case 'back-to-dashboard': {
      if (state.screen === 'login') {
        return state;
      }
      if (state.screen === 'teacher-classroom-detail') {
        return { ...state, screen: 'teacher-dashboard' };
      }
      if (state.screen === 'partner-talent-detail') {
        return { ...state, screen: 'partner-dashboard' };
      }
      return { ...state, screen: 'dashboard' };
    }

    case 'enter-classroom': {
      if (state.screen !== 'dashboard' && state.screen !== 'tracks') {
        return state;
      }
      return { ...state, screen: 'terminal-classroom' };
    }

    default:
      return state;
  }
}
