import { useCallback, useReducer, useState } from 'react';
import { createInitialNavState, navigationReducer } from './navigation-reducer';
import {
  MOCK_CLASSROOMS,
  MOCK_PARTNER,
  MOCK_PARTNER_COMPANY,
  MOCK_TALENT_POOL,
  MOCK_TEACHER,
  MOCK_USER,
  TRACKS,
} from './mock-data';
import type { UserRole } from './types';

/**
 * Hook de orquestração do shell — compõe `navigationReducer` (máquina de
 * estados pura) com os dados mock (`MOCK_USER`/`MOCK_TEACHER`/`MOCK_PARTNER`/`TRACKS`)
 * e expõe ações nomeadas em vez de `dispatch` cru.
 */
export function useAppNavigation() {
  const [state, dispatch] = useReducer(navigationReducer, undefined, createInitialNavState);
  const [activeRole, setActiveRole] = useState<UserRole>('aluno');

  const login = useCallback((role: UserRole = 'aluno') => {
    setActiveRole(role);
    dispatch({ type: 'login', role });
  }, []);

  const logout = useCallback(() => {
    setActiveRole('aluno');
    dispatch({ type: 'logout' });
  }, []);

  const openProfile = useCallback(() => dispatch({ type: 'open-profile' }), []);
  const openTracks = useCallback(() => dispatch({ type: 'open-tracks' }), []);
  const backToDashboard = useCallback(() => dispatch({ type: 'back-to-dashboard' }), []);
  const enterClassroom = useCallback(() => dispatch({ type: 'enter-classroom' }), []);

  const openTeacherDashboard = useCallback(() => dispatch({ type: 'open-teacher-dashboard' }), []);
  const openClassroomDetail = useCallback(
    (classroomId: string) => dispatch({ type: 'open-classroom-detail', classroomId }),
    [],
  );

  const openPartnerDashboard = useCallback(() => dispatch({ type: 'open-partner-dashboard' }), []);
  const openTalentDetail = useCallback(
    (talentId: string) => dispatch({ type: 'open-talent-detail', talentId }),
    [],
  );

  const activeUser =
    activeRole === 'professor'
      ? MOCK_TEACHER
      : activeRole === 'parceiro'
        ? MOCK_PARTNER
        : MOCK_USER;

  const selectedClassroom = state.selectedClassroomId
    ? MOCK_CLASSROOMS.find((c) => c.id === state.selectedClassroomId)
    : undefined;

  const selectedTalent = state.selectedTalentId
    ? MOCK_TALENT_POOL.find((t) => t.id === state.selectedTalentId)
    : undefined;

  return {
    screen: state.screen,
    activeRole,
    user: activeUser,
    tracks: TRACKS,
    classrooms: MOCK_CLASSROOMS,
    talentPool: MOCK_TALENT_POOL,
    partnerCompany: MOCK_PARTNER_COMPANY,
    selectedClassroom,
    selectedTalent,
    login,
    logout,
    openProfile,
    openTracks,
    backToDashboard,
    enterClassroom,
    openTeacherDashboard,
    openClassroomDetail,
    openPartnerDashboard,
    openTalentDetail,
  };
}
