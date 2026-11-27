import { describe, it, expect } from 'vitest';
import { CHANNELS_CATALOG, AUDIO_CHALLENGES, getChannelInfo } from '../src/game/content';
import { calculateEffectiveGain } from '../src/game/rules';

describe('Audio Layers Integrity and Challenges Catalog', () => {
  it('contains exactly the 5 specified audio channels in the exact order', () => {
    expect(CHANNELS_CATALOG.length).toBe(5);
    const ids = CHANNELS_CATALOG.map(c => c.id);
    expect(ids).toEqual(['speech', 'footsteps', 'fan', 'city', 'music']);
  });

  it('retrieves correct channel metadata with fallback', () => {
    const shoeInfo = getChannelInfo('footsteps');
    expect(shoeInfo.shortLabel).toBe('Passos');
    expect(shoeInfo.clocheIndex).toBe(1);

    const fanInfo = getChannelInfo('fan');
    expect(fanInfo.shortLabel).toBe('Ventilador');
    expect(fanInfo.clocheIndex).toBe(2);
  });

  it('verifies all 6 audio challenges have valid targets and non-empty configurations', () => {
    expect(AUDIO_CHALLENGES.length).toBeGreaterThanOrEqual(6);

    for (const challenge of AUDIO_CHALLENGES) {
      expect(challenge.id).toBeDefined();
      expect(challenge.title).toBeDefined();
      expect(['speech', 'footsteps', 'fan', 'city', 'music']).toContain(challenge.targetId);
      expect(challenge.backgroundChannels.length).toBeGreaterThanOrEqual(2);
      expect(challenge.hints.length).toBeGreaterThanOrEqual(1);
    }
  });

  it('proves that soloing one channel forces all other channel gains strictly to 0', () => {
    const channels = CHANNELS_CATALOG.map(c => ({
      id: c.id,
      name: c.name,
      icon: c.iconName,
      level: 0.8,
      mute: false
    }));

    const soloId = 'fan';
    const gains = channels.map(ch => calculateEffectiveGain(ch, soloId, false));

    // Apenas o ventilador (índice 2) deve ter ganho 0.8; todos os outros 0
    expect(gains[0]).toBe(0); // speech
    expect(gains[1]).toBe(0); // footsteps
    expect(gains[2]).toBe(0.8); // fan
    expect(gains[3]).toBe(0); // city
    expect(gains[4]).toBe(0); // music
  });
});
