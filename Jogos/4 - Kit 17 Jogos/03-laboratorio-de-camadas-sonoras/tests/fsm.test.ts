import { describe, it, expect } from 'vitest';
import { createInitialState, gameReducer } from '../src/game/state';

describe('Laboratório de Camadas Sonoras — FSM and Reducer', () => {
  it('creates initial state matching the mockup with footstep channel focused and soloed', () => {
    const state = createInitialState();
    expect(state.channels.length).toBe(5);
    expect(state.focusedChannelId).toBe('footsteps');
    expect(state.soloId).toBe('footsteps');
    expect(state.audioStarted).toBe(false); // Sempre começa silencioso
    expect(state.masterMute).toBe(false);
  });

  it('updates channel level smoothly and marks mix as custom', () => {
    let state = createInitialState();
    state = gameReducer(state, {
      type: 'SET_CHANNEL_LEVEL',
      payload: { id: 'fan', level: 0.75 }
    });

    const fan = state.channels.find(c => c.id === 'fan');
    expect(fan?.level).toBe(0.75);
    expect(state.activeMixPreset).toBe('custom');
    expect(state.focusedChannelId).toBe('fan');
    expect(state.metrics.adjustmentsCount).toBe(1);
  });

  it('toggles solo state on and off cleanly without side effects', () => {
    let state = createInitialState();
    // Initially footsteps is soloed
    expect(state.soloId).toBe('footsteps');

    // Desativar solo
    state = gameReducer(state, { type: 'TOGGLE_SOLO', payload: 'footsteps' });
    expect(state.soloId).toBeNull();

    // Ativar solo na música
    state = gameReducer(state, { type: 'TOGGLE_SOLO', payload: 'music' });
    expect(state.soloId).toBe('music');
    expect(state.metrics.solosTested).toBe(2);
  });

  it('handles mute all and unmute all without erasing individual channel levels', () => {
    let state = createInitialState();
    state = gameReducer(state, {
      type: 'SET_CHANNEL_LEVEL',
      payload: { id: 'speech', level: 0.6 }
    });

    // Silenciar tudo
    state = gameReducer(state, { type: 'MUTE_ALL' });
    expect(state.masterMute).toBe(true);
    expect(state.channels.find(c => c.id === 'speech')?.level).toBe(0.6);

    // Reativar tudo
    state = gameReducer(state, { type: 'UNMUTE_ALL' });
    expect(state.masterMute).toBe(false);
    expect(state.channels.find(c => c.id === 'speech')?.level).toBe(0.6);
  });

  it('saves and loads mix snapshots A and B for instant comparison', () => {
    let state = createInitialState();
    state = gameReducer(state, {
      type: 'SET_CHANNEL_LEVEL',
      payload: { id: 'city', level: 0.9 }
    });
    state = gameReducer(state, { type: 'SAVE_MIX_SNAPSHOT', payload: 'A' });
    expect(state.mixA.city).toBe(0.9);

    // Modificar e carregar A
    state = gameReducer(state, {
      type: 'SET_CHANNEL_LEVEL',
      payload: { id: 'city', level: 0.1 }
    });
    expect(state.channels.find(c => c.id === 'city')?.level).toBe(0.1);

    state = gameReducer(state, { type: 'LOAD_MIX_SNAPSHOT', payload: 'A' });
    expect(state.channels.find(c => c.id === 'city')?.level).toBe(0.9);
  });

  it('verifies challenge progression and answer checking', () => {
    let state = createInitialState();
    state = gameReducer(state, {
      type: 'START_CHALLENGE',
      payload: { targetId: 'fan' }
    });

    expect(state.step).toBe('challenge');
    expect(state.targetId).toBe('fan');
    expect(state.challengeSolved).toBe(false);

    // Resposta errada
    state = gameReducer(state, {
      type: 'CHECK_CHALLENGE_ANSWER',
      payload: 'city'
    });
    expect(state.challengeSolved).toBe(false);

    // Resposta certa
    state = gameReducer(state, {
      type: 'CHECK_CHALLENGE_ANSWER',
      payload: 'fan'
    });
    expect(state.challengeSolved).toBe(true);
    expect(state.metrics.challengesCompleted).toBe(1);
  });
});
