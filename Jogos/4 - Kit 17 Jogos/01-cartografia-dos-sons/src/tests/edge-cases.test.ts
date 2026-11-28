// src/tests/edge-cases.test.ts
// Testes exaustivos de casos de borda, robustez sob entradas anômalas e integridade dos dados
import { describe, it, expect } from 'vitest';
import { createInitialState, gameReducer } from '../game/state';
import {
  calculateDistanceGain,
  calculateStereoPan,
  clampToBoardBounds,
  evaluateDistanceComparison,
  snapToGrid,
  snapToStreetNetwork
} from '../game/rules';

describe('Casos de Borda e Robustez (Edge Cases)', () => {
  it('Atenuação de ganho quando a fonte e o ouvinte estão exatamente na mesma coordenada (distância zero)', () => {
    const pos: [number, number, number] = [1.5, 0.2, 0.6];
    const gain = calculateDistanceGain(pos, pos);
    expect(gain).toBe(1.0);
    expect(Number.isFinite(gain)).toBe(true);
  });

  it('Atenuação de ganho com distâncias extremamente longas permanece com piso audível seguro', () => {
    const listener: [number, number, number] = [0, 0, 0];
    const farAway: [number, number, number] = [1000, 0, 1000];
    const gain = calculateDistanceGain(farAway, listener);
    expect(gain).toBe(0.08); // Piso mínimo garantido para evitar corte abrupto
  });

  it('Pan Estéreo em limites extremos não ultrapassa [-1.0, 1.0]', () => {
    const listener: [number, number, number] = [0, 0, 0];
    const superLeft: [number, number, number] = [-500, 0, 0];
    const superRight: [number, number, number] = [500, 0, 0];

    expect(calculateStereoPan(superLeft, listener)).toBe(-1.0);
    expect(calculateStereoPan(superRight, listener)).toBe(1.0);
  });

  it('Snap to grid com números decimais arbitrários e negativos', () => {
    expect(snapToGrid(0.00001)).toBe(0);
    expect(snapToGrid(0.24999)).toBe(0.25);
    expect(snapToGrid(-0.24999)).toBe(-0.25);
    expect(snapToGrid(-0.26)).toBe(-0.25);
    expect(snapToGrid(-0.38)).toBe(-0.5);

    const clamped = clampToBoardBounds([100, 0, -100]);
    expect(clamped[0]).toBe(6.5);
    expect(clamped[2]).toBe(-4.5);
  });

  it('Volume master é limitado entre 0 e 1, ignorando valores anômalos', () => {
    let state = createInitialState();
    state = gameReducer(state, { type: 'SET_MASTER_VOLUME', volume: 5.5 });
    expect(state.masterVolume).toBe(1.0);

    state = gameReducer(state, { type: 'SET_MASTER_VOLUME', volume: -2.0 });
    expect(state.masterVolume).toBe(0.0);
  });

  it('Volume por fonte é limitado entre 0 e 1', () => {
    let state = createInitialState();
    state = gameReducer(state, { type: 'SET_SOURCE_VOLUME', sourceId: 'bus', gain: 3.0 });
    const bus = state.sources.find((s) => s.id === 'bus');
    expect(bus?.gain).toBe(1.0);

    state = gameReducer(state, { type: 'SET_SOURCE_VOLUME', sourceId: 'bus', gain: -1.5 });
    const busMin = state.sources.find((s) => s.id === 'bus');
    expect(busMin?.gain).toBe(0.0);
  });

  it('Ônibus nunca é projetado para coordenadas NaN ou fora do mapa', () => {
    const invalidTarget: [number, number, number] = [9999, 0, -9999];
    const snapped = snapToStreetNetwork(invalidTarget);
    expect(Number.isFinite(snapped[0])).toBe(true);
    expect(Number.isFinite(snapped[1])).toBe(true);
    expect(Number.isFinite(snapped[2])).toBe(true);
  });

  it('Comparação de distâncias idênticas retorna "similar"', () => {
    const listener: [number, number, number] = [0, 0, 0];
    const sourceA: [number, number, number] = [2, 0, 0];
    const sourceB: [number, number, number] = [0, 0, 2];

    const result = evaluateDistanceComparison(sourceA, sourceB, listener);
    expect(result.relationship).toBe('similar');
    expect(result.distA).toBeCloseTo(result.distB);
  });

  it('Concluir a experiência desativa loops contínuos de todas as fontes', () => {
    let state = createInitialState();
    state = gameReducer(state, { type: 'TOGGLE_PLAY_SOURCE', sourceId: 'bus' });
    expect(state.sources.find((s) => s.id === 'bus')?.isPlaying).toBe(true);

    state = gameReducer(state, { type: 'COMPLETE_EXPERIENCE' });
    expect(state.isCompleted).toBe(true);
    expect(state.sources.every((s) => !s.isPlaying)).toBe(true);
  });

  it('Transição com TICK_TIME acumula segundos de sessão corretamente', () => {
    let state = createInitialState();
    state = gameReducer(state, { type: 'TICK_TIME', deltaSeconds: 2.5 });
    state = gameReducer(state, { type: 'TICK_TIME', deltaSeconds: 3.5 });
    expect(state.observations.durationSeconds).toBe(6.0);
  });
});
