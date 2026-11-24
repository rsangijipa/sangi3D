import { describe, it, expect } from 'vitest';
import { validWeather, clampWeather, maxSnapshotsReached, bulletinLengthOk } from '../src/game/rules.js';
import { createState } from '../src/game/state.js';

describe('regras do jogo', () => {
  it('aceita clima dentro dos limites 0..4', () => {
    expect(validWeather({ sun: 0, cloud: 4, rain: 2, wind: 1 })).toBe(true);
  });

  it('rejeita clima fora dos limites', () => {
    expect(validWeather({ sun: 5 } as any)).toBe(false);
    expect(validWeather({ rain: -1 } as any)).toBe(false);
    expect(validWeather({ sun: NaN } as any)).toBe(false);
  });

  it('clampWeather limita valores', () => {
    expect(clampWeather({ sun: -2, cloud: 9, rain: 2, wind: 4 })).toEqual({
      sun: 0,
      cloud: 4,
      rain: 2,
      wind: 4,
    });
  });

  it('limite de snapshots', () => {
    const s = createState();
    expect(maxSnapshotsReached(s)).toBe(false);
    s.snapshots = Array.from({ length: 12 }, (_, i) => ({ id: String(i), createdAt: 0, weather: { sun: 0, cloud: 0, rain: 0, wind: 0 }, emotionTags: [], bulletin: '', label: `s${i}` }));
    expect(maxSnapshotsReached(s)).toBe(true);
  });

  it('tamanho do boletim', () => {
    expect(bulletinLengthOk('x'.repeat(500))).toBe(true);
    expect(bulletinLengthOk('x'.repeat(501))).toBe(false);
  });
});
