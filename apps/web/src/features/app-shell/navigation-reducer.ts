import type { AppScreen } from './types';

/**
 * Máquina de estados pura da navegação do shell — mesma filosofia de
 * `../learning-flow/flow-reducer.ts`: pura, testável sem DOM/React, guarda
 * transições fora de contexto em vez de corromper o estado.
 *
 * Não é um roteador real (sem `history`/URL) — a navegação "por rota" descrita
 * em `docs/product/app-navigation-v1.md` (`/login`, `/app`, `/app/perfil`,
 * `/app/trilhas`, `/app/sala/terminal/:blockId`) é o plano de produto; esta
 * fatia implementa o equivalente em memória, um passo estrutural antes de
 * introduzir um roteador real.
 */

export interface NavState {
  readonly screen: AppScreen;
}

export type NavEvent =
  | { readonly type: 'login' }
  | { readonly type: 'logout' }
  | { readonly type: 'open-profile' }
  | { readonly type: 'open-tracks' }
  | { readonly type: 'back-to-dashboard' }
  | { readonly type: 'enter-classroom' };

export function createInitialNavState(): NavState {
  return { screen: 'login' };
}

export function navigationReducer(state: NavState, event: NavEvent): NavState {
  switch (event.type) {
    case 'login': {
      if (state.screen !== 'login') {
        return state;
      }
      return { screen: 'dashboard' };
    }

    case 'logout': {
      return { screen: 'login' };
    }

    case 'open-profile': {
      if (state.screen !== 'dashboard') {
        return state;
      }
      return { screen: 'profile' };
    }

    case 'open-tracks': {
      if (state.screen !== 'dashboard') {
        return state;
      }
      return { screen: 'tracks' };
    }

    case 'back-to-dashboard': {
      if (state.screen === 'login') {
        return state;
      }
      return { screen: 'dashboard' };
    }

    case 'enter-classroom': {
      if (state.screen !== 'dashboard' && state.screen !== 'tracks') {
        return state;
      }
      return { screen: 'terminal-classroom' };
    }

    default:
      return state;
  }
}
