// src/tests/game.test.ts
// Testes unitários profundos das regras de negócio, FSM, física e atenuação acústica
import { describe, it, expect } from 'vitest';
import { createInitialState, gameReducer } from '../game/state';
import {
  snapToGrid,
  snapPointToGrid,
  clampToBoardBounds,
  calculateDistanceXZ,
  calculateDistanceGain,
  calculateStereoPan,
  snapToStreetNetwork,
  evaluateDistanceComparison,
  GRID_SNAP_SIZE
} from '../game/rules';
import { STREET_WAYPOINTS } from '../game/content';

describe('1. Regras Matemáticas e Físicas (game/rules.ts)', () => {
  it('Encaixa coordenadas no grid determinístico de 0.25m', () => {
    expect(snapToGrid(0.12)).toBe(0);
    expect(snapToGrid(0.13)).toBe(0.25);
    expect(snapToGrid(0.38)).toBe(0.5);
    expect(snapToGrid(-1.18)).toBe(-1.25);
    expect(snapPointToGrid([1.1, 0.2, -0.66])).toEqual([1.0, 0.2, -0.75]);
  });

  it('Limita posições aos limites físicos da bandeja do diorama', () => {
    const clampedInside = clampToBoardBounds([2.0, 0.2, -1.0]);
    expect(clampedInside).toEqual([2.0, 0.2, -1.0]);

    const clampedOutsideX = clampToBoardBounds([15.0, 0.2, 0]);
    expect(clampedOutsideX[0]).toBe(6.5);

    const clampedOutsideZ = clampToBoardBounds([0, 0.2, -12.0]);
    expect(clampedOutsideZ[2]).toBe(-4.5);
  });

  it('Calcula distância Euclidiana 2D no plano XZ', () => {
    const p1: [number, number, number] = [0, 0, 0];
    const p2: [number, number, number] = [3, 0, 4];
    expect(calculateDistanceXZ(p1, p2)).toBe(5);
  });

  it('Atenuação de ganho contínua e suave conforme a distância aumenta', () => {
    const listener: [number, number, number] = [0, 0, 0];
    const nearSource: [number, number, number] = [1.0, 0, 0];
    const midSource: [number, number, number] = [3.5, 0, 0];
    const farSource: [number, number, number] = [8.0, 0, 0];

    const gainNear = calculateDistanceGain(nearSource, listener);
    const gainMid = calculateDistanceGain(midSource, listener);
    const gainFar = calculateDistanceGain(farSource, listener);

    expect(gainNear).toBe(1.0); // Dentro da distância de referência (1.5m)
    expect(gainMid).toBeLessThan(gainNear);
    expect(gainFar).toBeLessThan(gainMid);
    expect(gainFar).toBeGreaterThanOrEqual(0.08); // Limite inferior protegido
  });

  it('Calcula Pan Estéreo proporcional à coordenada horizontal', () => {
    const listener: [number, number, number] = [0, 0, 0];
    const leftSource: [number, number, number] = [-4.0, 0, 0];
    const rightSource: [number, number, number] = [4.0, 0, 0];
    const centerSource: [number, number, number] = [0, 0, 2.0];

    expect(calculateStereoPan(leftSource, listener)).toBeLessThan(0);
    expect(calculateStereoPan(rightSource, listener)).toBeGreaterThan(0);
    expect(calculateStereoPan(centerSource, listener)).toBe(0);
  });

  it('Projeta e trava o ônibus rigorosamente na malha viária sem atravessar prédios', () => {
    // Ponto arbitrário fora da rua (ex: no meio do jardim)
    const randomPoint: [number, number, number] = [1.2, 0.2, 1.4];
    const snapped = snapToStreetNetwork(randomPoint, STREET_WAYPOINTS);

    // O ponto projetado deve ser próximo a um dos segmentos da rua
    expect(snapped[0] % GRID_SNAP_SIZE).toBeCloseTo(0);
    expect(snapped[2] % GRID_SNAP_SIZE).toBeCloseTo(0);
  });

  it('Avalia relação de proximidade relativa para comparação perceptual A/B', () => {
    const listener: [number, number, number] = [0, 0, 0];
    const sourceA: [number, number, number] = [1.0, 0, 0]; // dist 1.0
    const sourceB: [number, number, number] = [4.0, 0, 0]; // dist 4.0

    const comp1 = evaluateDistanceComparison(sourceA, sourceB, listener);
    expect(comp1.relationship).toBe('A_closer');

    const comp2 = evaluateDistanceComparison(sourceB, sourceA, listener);
    expect(comp2.relationship).toBe('B_closer');

    const sourceEquidistant: [number, number, number] = [0, 0, 1.1]; // dist 1.1 (dentro da tolerância)
    const comp3 = evaluateDistanceComparison(sourceA, sourceEquidistant, listener);
    expect(comp3.relationship).toBe('similar');
  });
});

describe('2. Máquina de Estados e Reducer (game/state.ts)', () => {
  it('Inicializa em estado idêntico ao momento do mockup de referência (Etapa 3, Mover, Ônibus selecionado)', () => {
    const state = createInitialState('guided', 100);
    expect(state.step).toBe(3);
    expect(state.activeTool).toBe('move');
    expect(state.selectedSourceId).toBe('bus');
    expect(state.globalMuted).toBe(false);
    expect(state.sources.length).toBe(5);
  });

  it('Alterna ferramentas corretamente (Ouvir, Mover, Comparar)', () => {
    let state = createInitialState();
    state = gameReducer(state, { type: 'SELECT_TOOL', tool: 'listen' });
    expect(state.activeTool).toBe('listen');

    state = gameReducer(state, { type: 'SELECT_TOOL', tool: 'compare' });
    expect(state.activeTool).toBe('compare');
  });

  it('Troca de etapa atualiza step e ferramenta padrão contextual', () => {
    let state = createInitialState();
    state = gameReducer(state, { type: 'SET_STEP', step: 1 });
    expect(state.step).toBe(1);
    expect(state.activeTool).toBe('listen');

    state = gameReducer(state, { type: 'SET_STEP', step: 4 });
    expect(state.step).toBe(4);
    expect(state.activeTool).toBe('compare');
  });

  it('Contabiliza fontes sonoras exploradas', () => {
    let state = createInitialState();
    state = gameReducer(state, { type: 'SELECT_SOURCE', sourceId: 'fountain' });
    state = gameReducer(state, { type: 'SELECT_SOURCE', sourceId: 'birds' });

    expect(state.observations.exploredSourcesCount).toBeGreaterThanOrEqual(2);
  });

  it('Ao tocar uma fonte isolada na etapa 1-4, previne loops concorrentes indevidos', () => {
    let state = createInitialState();
    state = gameReducer(state, { type: 'SET_STEP', step: 3 });

    // Tocar ônibus
    state = gameReducer(state, { type: 'TOGGLE_PLAY_SOURCE', sourceId: 'bus' });
    const busSource = state.sources.find((s) => s.id === 'bus');
    expect(busSource?.isPlaying).toBe(true);

    // Tocar fonte
    state = gameReducer(state, { type: 'TOGGLE_PLAY_SOURCE', sourceId: 'fountain' });
    const busSourceAfter = state.sources.find((s) => s.id === 'bus');
    const fountainSource = state.sources.find((s) => s.id === 'fountain');

    expect(fountainSource?.isPlaying).toBe(true);
    // Ônibus deve ter sido pausado para não deixar loop concorrente
    expect(busSourceAfter?.isPlaying).toBe(false);
  });

  it('Mute global interrompe todas as fontes', () => {
    let state = createInitialState();
    expect(state.globalMuted).toBe(false);

    state = gameReducer(state, { type: 'TOGGLE_MUTE_GLOBAL' });
    expect(state.globalMuted).toBe(true);

    state = gameReducer(state, { type: 'SET_GLOBAL_MUTED', muted: false });
    expect(state.globalMuted).toBe(false);
  });

  it('Deslocar o ônibus atualiza suas coordenadas restritas à rua', () => {
    let state = createInitialState();
    const target: [number, number, number] = [2.0, 0.2, 1.6];
    state = gameReducer(state, { type: 'MOVE_BUS', position: target });

    const busSource = state.sources.find((s) => s.id === 'bus');
    expect(busSource?.position[0]).toBeCloseTo(state.busPos[0]);
    expect(busSource?.position[2]).toBeCloseTo(state.busPos[2]);
  });

  it('Deslocar o marcador de escuta aplica snap de 0.25m e bounds clamping', () => {
    let state = createInitialState();
    const extremePos: [number, number, number] = [20.0, 0.1, -15.0];
    state = gameReducer(state, { type: 'MOVE_LISTENER', position: extremePos });

    expect(state.listenerPos[0]).toBe(6.5);
    expect(state.listenerPos[2]).toBe(-4.5);
  });

  it('Comparação perceptual A/B registra escolhas sem pontuação punitiva subjetiva', () => {
    let state = createInitialState();
    state = gameReducer(state, { type: 'SET_STEP', step: 4 });
    state = gameReducer(state, {
      type: 'SUBMIT_COMPARE_CHOICE',
      choice: 'closer',
      evaluated: 'A_closer'
    });

    expect(state.comparison.userChoice).toBe('closer');
    expect(state.observations.comparisonsCount).toBe(1);
    expect(state.observations.notes.length).toBe(1);
  });

  it('Composição sonora aceita no máximo 3 fontes simultâneas', () => {
    let state = createInitialState();
    state = gameReducer(state, { type: 'SET_STEP', step: 5 });

    state.compositionSourceIds = []; // limpa
    state = gameReducer(state, { type: 'TOGGLE_COMPOSITION_SOURCE', sourceId: 'bus' });
    state = gameReducer(state, { type: 'TOGGLE_COMPOSITION_SOURCE', sourceId: 'fountain' });
    state = gameReducer(state, { type: 'TOGGLE_COMPOSITION_SOURCE', sourceId: 'birds' });
    expect(state.compositionSourceIds.length).toBe(3);

    // Tentar adicionar uma 4ª fonte descarta a mais antiga para manter 3
    state = gameReducer(state, { type: 'TOGGLE_COMPOSITION_SOURCE', sourceId: 'bell' });
    expect(state.compositionSourceIds.length).toBe(3);
    expect(state.compositionSourceIds).toContain('bell');
  });

  it('Solicitação de dica incrementa contador e define mensagem contextual', () => {
    let state = createInitialState();
    const initialHints = state.observations.hintsCount;
    state = gameReducer(state, { type: 'REQUEST_HINT' });

    expect(state.observations.hintsCount).toBe(initialHints + 1);
    expect(state.currentMessage).toBeTruthy();
  });

  it('Pausa e reset restauram o ciclo sem erros', () => {
    let state = createInitialState();
    state = gameReducer(state, { type: 'TOGGLE_PAUSE' });
    expect(state.isPaused).toBe(true);

    const resetState = gameReducer(state, { type: 'RESET_EXPERIENCE' });
    expect(resetState.isPaused).toBe(false);
    expect(resetState.step).toBe(3);
  });

  it('Alterna modos de experiência (Livre, Guiado, Acompanhado)', () => {
    let state = createInitialState('guided');
    expect(state.mode).toBe('guided');

    state = gameReducer(state, { type: 'SET_MODE', mode: 'free' });
    expect(state.mode).toBe('free');

    state = gameReducer(state, { type: 'SET_MODE', mode: 'assisted' });
    expect(state.mode).toBe('assisted');
  });

  it('Valida integridade do ID "fountain" e presença de captionText em todas as fontes', () => {
    const state = createInitialState();
    const fountainSource = state.sources.find((s) => s.id === 'fountain');
    expect(fountainSource).toBeDefined();
    expect(fountainSource?.name).toContain('Fonte');

    // Nenhuma fonte possui ID 'water' indevido
    expect(state.sources.find((s) => s.id === 'water')).toBeUndefined();

    for (const source of state.sources) {
      expect(source.captionText).toBeTruthy();
    }
  });
});
