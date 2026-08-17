import { describe, expect, it } from 'vitest';
import { createInitialNavState, navigationReducer, type NavState } from './navigation-reducer';

describe('createInitialNavState', () => {
  it('comeca na tela de login', () => {
    expect(createInitialNavState()).toEqual({ screen: 'login' });
  });
});

describe('navigationReducer', () => {
  it('login padrao leva login -> dashboard', () => {
    const next = navigationReducer(createInitialNavState(), { type: 'login' });
    expect(next.screen).toBe('dashboard');
  });

  it('login como professor leva login -> teacher-dashboard', () => {
    const next = navigationReducer(createInitialNavState(), { type: 'login', role: 'professor' });
    expect(next.screen).toBe('teacher-dashboard');
  });

  it('login como parceiro leva login -> partner-dashboard', () => {
    const next = navigationReducer(createInitialNavState(), { type: 'login', role: 'parceiro' });
    expect(next.screen).toBe('partner-dashboard');
  });

  it('login fora de login e ignorado', () => {
    const state: NavState = { screen: 'dashboard' };
    expect(navigationReducer(state, { type: 'login' })).toEqual(state);
  });

  it('logout leva qualquer tela de volta a login', () => {
    const screens: NavState[] = [
      { screen: 'dashboard' },
      { screen: 'profile' },
      { screen: 'tracks' },
      { screen: 'terminal-classroom' },
      { screen: 'teacher-dashboard' },
      { screen: 'teacher-classroom-detail', selectedClassroomId: 'turma-1' },
      { screen: 'partner-dashboard' },
      { screen: 'partner-talent-detail', selectedTalentId: 'talent-1' },
    ];
    for (const state of screens) {
      expect(navigationReducer(state, { type: 'logout' })).toEqual({ screen: 'login' });
    }
  });

  it('open-profile leva dashboard, teacher-dashboard e partner-dashboard -> profile', () => {
    expect(navigationReducer({ screen: 'dashboard' }, { type: 'open-profile' }).screen).toBe(
      'profile',
    );
    expect(
      navigationReducer({ screen: 'teacher-dashboard' }, { type: 'open-profile' }).screen,
    ).toBe('profile');
    expect(
      navigationReducer({ screen: 'partner-dashboard' }, { type: 'open-profile' }).screen,
    ).toBe('profile');
  });

  it('open-profile fora de dashboards e ignorado', () => {
    const state: NavState = { screen: 'tracks' };
    expect(navigationReducer(state, { type: 'open-profile' })).toEqual(state);
  });

  it('open-tracks leva dashboard -> tracks', () => {
    const next = navigationReducer({ screen: 'dashboard' }, { type: 'open-tracks' });
    expect(next.screen).toBe('tracks');
  });

  it('open-tracks fora de dashboard e ignorado', () => {
    const state: NavState = { screen: 'profile' };
    expect(navigationReducer(state, { type: 'open-tracks' })).toEqual(state);
  });

  it('open-classroom-detail define selectedClassroomId e muda para teacher-classroom-detail', () => {
    const next = navigationReducer(
      { screen: 'teacher-dashboard' },
      { type: 'open-classroom-detail', classroomId: 'turma-alfa' },
    );
    expect(next.screen).toBe('teacher-classroom-detail');
    expect(next.selectedClassroomId).toBe('turma-alfa');
  });

  it('open-talent-detail define selectedTalentId e muda para partner-talent-detail', () => {
    const next = navigationReducer(
      { screen: 'partner-dashboard' },
      { type: 'open-talent-detail', talentId: 'talent-123' },
    );
    expect(next.screen).toBe('partner-talent-detail');
    expect(next.selectedTalentId).toBe('talent-123');
  });

  it('back-to-dashboard retorna ao dashboard correto por contexto', () => {
    expect(
      navigationReducer(
        { screen: 'teacher-classroom-detail', selectedClassroomId: 'turma-1' },
        { type: 'back-to-dashboard' },
      ),
    ).toEqual({ screen: 'teacher-dashboard', selectedClassroomId: 'turma-1' });

    expect(
      navigationReducer(
        { screen: 'partner-talent-detail', selectedTalentId: 't-1' },
        { type: 'back-to-dashboard' },
      ),
    ).toEqual({ screen: 'partner-dashboard', selectedTalentId: 't-1' });

    for (const screen of ['profile', 'tracks', 'terminal-classroom'] as const) {
      expect(navigationReducer({ screen }, { type: 'back-to-dashboard' })).toEqual({
        screen: 'dashboard',
      });
    }
  });

  it('back-to-dashboard a partir de login e ignorado (precisa logar primeiro)', () => {
    const state: NavState = { screen: 'login' };
    expect(navigationReducer(state, { type: 'back-to-dashboard' })).toEqual(state);
  });

  it('enter-classroom a partir de dashboard ou tracks leva a terminal-classroom', () => {
    expect(navigationReducer({ screen: 'dashboard' }, { type: 'enter-classroom' })).toEqual({
      screen: 'terminal-classroom',
    });
    expect(navigationReducer({ screen: 'tracks' }, { type: 'enter-classroom' })).toEqual({
      screen: 'terminal-classroom',
    });
  });

  it('enter-classroom fora de dashboard/tracks e ignorado', () => {
    const state: NavState = { screen: 'profile' };
    expect(navigationReducer(state, { type: 'enter-classroom' })).toEqual(state);
  });
});
