import { describe, it, expect } from 'vitest';
import {
  calculateEffectiveGain,
  calculateAllEffectiveGains,
  compareMixProfiles,
  validateChannelsIntegrity
} from '../src/game/rules';
import { createInitialState } from '../src/game/state';
import { DEFAULT_CHANNELS } from '../src/game/state';

describe('Mixer Gain Rules and Solo Math', () => {
  it('validates integrity of all 5 mandatory channels', () => {
    expect(validateChannelsIntegrity(DEFAULT_CHANNELS)).toBe(true);
    expect(validateChannelsIntegrity(DEFAULT_CHANNELS.slice(0, 4))).toBe(false);
  });

  it('calculates normal nominal gain when no solo or mute is active', () => {
    const ch = { id: 'music' as const, name: 'Música', icon: 'music', level: 0.75, mute: false };
    const gain = calculateEffectiveGain(ch, null, false);
    expect(gain).toBe(0.75);
  });

  it('silences everything immediately when masterMute is active', () => {
    const ch = { id: 'music' as const, name: 'Música', icon: 'music', level: 0.8, mute: false };
    expect(calculateEffectiveGain(ch, null, true)).toBe(0.0);
    expect(calculateEffectiveGain(ch, 'music', true)).toBe(0.0);
  });

  it('isolates the solo channel and mutes all others without destroying their nominal levels', () => {
    const state = createInitialState();
    state.channels[0].level = 0.5; // speech
    state.channels[1].level = 0.8; // footsteps
    state.channels[4].level = 0.6; // music
    state.soloId = 'footsteps';

    const gains = calculateAllEffectiveGains(state);
    expect(gains.footsteps).toBe(0.8);
    expect(gains.speech).toBe(0.0);
    expect(gains.fan).toBe(0.0);
    expect(gains.city).toBe(0.0);
    expect(gains.music).toBe(0.0);

    // Verificação de não destruição de valores anteriores:
    expect(state.channels[0].level).toBe(0.5);
    expect(state.channels[4].level).toBe(0.6);
  });

  it('enforces volume ceiling in accompanied mode', () => {
    const ch = { id: 'fan' as const, name: 'Ventilador', icon: 'fan', level: 0.9, mute: false };
    const gain = calculateEffectiveGain(ch, null, false, 0.7);
    expect(gain).toBe(0.7);
  });

  it('calculates profile deltas accurately for A/B comparison', () => {
    const mixA = { speech: 0.2, footsteps: 0.8, fan: 0.1, city: 0.0, music: 0.5 };
    const mixB = { speech: 0.5, footsteps: 0.3, fan: 0.1, city: 0.0, music: 0.5 };

    const comparison = compareMixProfiles(mixA, mixB);
    expect(comparison.totalDelta).toBe(0.8);
    expect(comparison.mostChangedChannel).toBe('footsteps');
  });
});
