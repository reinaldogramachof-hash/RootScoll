import { describe, expect, it } from 'vitest';
import { createInitialNavState, navigationReducer, type NavState } from './navigation-reducer';

describe('createInitialNavState', () => {
  it('comeca na tela de login', () => {
    expect(createInitialNavState()).toEqual({ screen: 'login' });
  });
});

describe('navigationReducer', () => {
  it('login leva login -> dashboard', () => {
    const next = navigationReducer(createInitialNavState(), { type: 'login' });
    expect(next.screen).toBe('dashboard');
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
    ];
    for (const state of screens) {
      expect(navigationReducer(state, { type: 'logout' })).toEqual({ screen: 'login' });
    }
  });

  it('open-profile leva dashboard -> profile', () => {
    const next = navigationReducer({ screen: 'dashboard' }, { type: 'open-profile' });
    expect(next.screen).toBe('profile');
  });

  it('open-profile fora de dashboard e ignorado', () => {
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

  it('back-to-dashboard leva profile/tracks/terminal-classroom de volta a dashboard', () => {
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
