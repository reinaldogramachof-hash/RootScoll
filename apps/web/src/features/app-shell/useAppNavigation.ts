import { useCallback, useReducer } from 'react';
import { createInitialNavState, navigationReducer } from './navigation-reducer';
import { MOCK_USER, TRACKS } from './mock-data';

/**
 * Hook de orquestração do shell — compõe `navigationReducer` (máquina de
 * estados pura) com os dados mock (`MOCK_USER`/`TRACKS`) e expõe ações
 * nomeadas em vez de `dispatch` cru, mesmo padrão de
 * `../learning-flow/useLearningFlow.ts`.
 */
export function useAppNavigation() {
  const [state, dispatch] = useReducer(navigationReducer, undefined, createInitialNavState);

  const login = useCallback(() => dispatch({ type: 'login' }), []);
  const logout = useCallback(() => dispatch({ type: 'logout' }), []);
  const openProfile = useCallback(() => dispatch({ type: 'open-profile' }), []);
  const openTracks = useCallback(() => dispatch({ type: 'open-tracks' }), []);
  const backToDashboard = useCallback(() => dispatch({ type: 'back-to-dashboard' }), []);
  const enterClassroom = useCallback(() => dispatch({ type: 'enter-classroom' }), []);

  return {
    screen: state.screen,
    user: MOCK_USER,
    tracks: TRACKS,
    login,
    logout,
    openProfile,
    openTracks,
    backToDashboard,
    enterClassroom,
  };
}
