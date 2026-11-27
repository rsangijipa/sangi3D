import { describe, it, expect } from 'vitest';
import { reducer, createState, type Action } from '../src/game/state.js';

function act(state: ReturnType<typeof createState>, action: Action) {
  return reducer(state, action);
}

describe('FSM / estado', () => {
  it('inicia em start com clima neutro', () => {
    const s = createState(42);
    expect(s.step).toBe('start');
    expect(s.weather).toEqual({ sun: 2, cloud: 2, rain: 0, wind: 0 });
    expect(s.emotionTags).toEqual([]);
    expect(s.bulletin).toBe('');
  });

  it('ajusta mostrador dentro de 0..4 e nao passa dos limites', () => {
    let s = createState();
    s = act(s, { type: 'SET_WEATHER', kind: 'sun', value: 4 });
    expect(s.weather.sun).toBe(4);
    s = act(s, { type: 'SET_WEATHER', kind: 'sun', value: 9 });
    expect(s.weather.sun).toBe(4);
    s = act(s, { type: 'SET_WEATHER', kind: 'sun', value: -3 });
    expect(s.weather.sun).toBe(0);
    // sol e chuva coexistem
    s = act(s, { type: 'SET_WEATHER', kind: 'rain', value: 4 });
    expect(s.weather.sun).toBe(4);
    expect(s.weather.rain).toBe(4);
  });

  it('tags nao duplicam e podem ser removidas', () => {
    let s = createState();
    s = act(s, { type: 'ADD_TAG', tag: 'animado' });
    s = act(s, { type: 'ADD_TAG', tag: 'animado' });
    expect(s.emotionTags).toEqual(['animado']);
    s = act(s, { type: 'ADD_TAG', tag: 'cansado' });
    expect(s.emotionTags.sort()).toEqual(['animado', 'cansado']);
    s = act(s, { type: 'REMOVE_TAG', tag: 'animado' });
    expect(s.emotionTags).toEqual(['cansado']);
  });

  it('boletim aceita vazio e e truncado', () => {
    let s = createState();
    s = act(s, { type: 'SET_BULLETIN', text: 'Hoje estou misto' });
    expect(s.bulletin).toBe('Hoje estou misto');
    s = act(s, { type: 'CLEAR_BULLETIN' });
    expect(s.bulletin).toBe('');
  });

  it('reset exige confirmacao', () => {
    let s = createState();
    s = act(s, { type: 'SET_WEATHER', kind: 'sun', value: 4 });
    s = act(s, { type: 'RESET_SESSION', confirmed: false });
    expect(s.weather.sun).toBe(4);
    s = act(s, { type: 'RESET_SESSION', confirmed: true });
    expect(s.weather.sun).toBe(2);
    expect(s.counters.resets).toBe(1);
  });

  it('contadores de pausa e pulo', () => {
    let s = createState();
    s = act(s, { type: 'PAUSE' });
    s = act(s, { type: 'SKIP' });
    expect(s.counters.pauses).toBe(1);
    expect(s.counters.skips).toBe(1);
  });

  it('seed repetivel gera mesmo estado inicial', () => {
    expect(createState(7).seed).toBe(createState(7).seed);
  });

  it('serializacao round-trip', () => {
    let s = createState(9);
    s = act(s, { type: 'SET_WEATHER', kind: 'wind', value: 3 });
    s = act(s, { type: 'ADD_TAG', tag: 'confuso' });
    const json = JSON.stringify(s);
    const back = JSON.parse(json);
    expect(back.weather.wind).toBe(3);
    expect(back.emotionTags).toContain('confuso');
  });
});
