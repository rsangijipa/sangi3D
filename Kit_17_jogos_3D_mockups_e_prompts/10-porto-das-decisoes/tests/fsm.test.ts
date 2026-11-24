import { describe, it, expect } from 'vitest';
import { createInitialState, gameReducer } from '../src/game/state';

describe('Game State FSM and Reducer', () => {
  it('creates initial state correctly', () => {
    const state = createInitialState('m1');
    expect(state.missionId).toBe('m1');
    expect(state.step).toBe('routing');
    expect(state.route).toEqual(['node_harbor']);
    expect(state.undoStack).toEqual([]);
    expect(state.cargoOnboard).toEqual([]);
  });

  it('manages route addition and undoing seamlessly', () => {
    let state = createInitialState('m1');

    state = gameReducer(state, { type: 'ADD_NODE_TO_ROUTE', payload: 'node_channel_1' });
    expect(state.route).toEqual(['node_harbor', 'node_channel_1']);
    expect(state.undoStack.length).toBe(1);

    state = gameReducer(state, { type: 'ADD_NODE_TO_ROUTE', payload: 'node_crossing' });
    expect(state.route).toEqual(['node_harbor', 'node_channel_1', 'node_crossing']);
    expect(state.undoStack.length).toBe(2);

    // Desfazer último nó
    state = gameReducer(state, { type: 'UNDO_LAST_NODE' });
    expect(state.route).toEqual(['node_harbor', 'node_channel_1']);
    expect(state.undoStack.length).toBe(1);

    // Limpar rota
    state = gameReducer(state, { type: 'CLEAR_ROUTE' });
    expect(state.route).toEqual(['node_harbor']);
  });

  it('prevents cargo item duplication and preserves crate count', () => {
    let state = createInitialState('m1');
    const crate = { id: 'crate_1', name: 'Suprimentos', destinationNodeId: 'node_quay_south', weight: 1 };
    state.availableCargo = [crate];

    // Carregar
    state = gameReducer(state, { type: 'LOAD_CARGO', payload: crate });
    expect(state.cargoOnboard.length).toBe(1);
    expect(state.availableCargo.length).toBe(0);

    // Tentar carregar a mesma caixa novamente
    state = gameReducer(state, { type: 'LOAD_CARGO', payload: crate });
    expect(state.cargoOnboard.length).toBe(1);

    // Descarregar
    state = gameReducer(state, { type: 'UNLOAD_CARGO', payload: 'crate_1' });
    expect(state.cargoOnboard.length).toBe(0);
    expect(state.availableCargo.length).toBe(1);
  });

  it('switches boats and preserves validity lifecycle', () => {
    let state = createInitialState('m1');
    expect(state.selectedBoatId).toBe('blue');

    state = gameReducer(state, { type: 'SELECT_BOAT', payload: 'green' });
    expect(state.selectedBoatId).toBe('green');

    state = gameReducer(state, { type: 'SELECT_BOAT', payload: 'red' });
    expect(state.selectedBoatId).toBe('red');
  });

  it('resets mission without losing initial anchor', () => {
    let state = createInitialState('m1');
    state = gameReducer(state, { type: 'ADD_NODE_TO_ROUTE', payload: 'node_channel_1' });
    state = gameReducer(state, { type: 'RESET_MISSION' });

    expect(state.route).toEqual(['node_harbor']);
    expect(state.step).toBe('routing');
    expect(state.isSimulating).toBe(false);
  });

  it('prevents simulation deadlock when simulation cannot execute', () => {
    let state = createInitialState('m1');
    const invalidSim = {
      valid: false,
      canExecute: false,
      totalDistance: 0,
      estimatedTimeSec: 0,
      unvisitedDestinations: ['node_quay_south'],
      capacityExceeded: true,
      excessCratesCount: 2,
      deliveries: [],
      explanation: 'Capacidade excedida!',
      alternativeRoutePossible: false
    };

    state = gameReducer(state, { type: 'START_SIMULATION', payload: invalidSim });
    // isSimulating DEVE ser false para não travar a UI!
    expect(state.isSimulating).toBe(false);
    expect(state.step).toBe('routing');
    expect(state.feedbackMessage?.type).toBe('warning');
    expect(state.feedbackMessage?.text).toBe('Capacidade excedida!');

    // Usuário continua capaz de adicionar nós ou desfazer
    state = gameReducer(state, { type: 'ADD_NODE_TO_ROUTE', payload: 'node_channel_1' });
    expect(state.route).toEqual(['node_harbor', 'node_channel_1']);
  });

  it('transitions to sim_ready when valid simulation finishes', () => {
    let state = createInitialState('m1');
    const validSim = {
      valid: true,
      canExecute: true,
      totalDistance: 5.5,
      estimatedTimeSec: 5.0,
      unvisitedDestinations: [],
      capacityExceeded: false,
      excessCratesCount: 0,
      deliveries: [],
      explanation: 'Rota excelente!',
      alternativeRoutePossible: false
    };

    state = gameReducer(state, { type: 'START_SIMULATION', payload: validSim });
    expect(state.isSimulating).toBe(true);
    expect(state.step).toBe('simulating');

    state = gameReducer(state, { type: 'END_SIMULATION' });
    expect(state.isSimulating).toBe(false);
    expect(state.step).toBe('sim_ready');
  });

  it('executes waypoint delivery and alternative route loading properly', () => {
    let state = createInitialState('m1');
    const c1 = { id: 'c1', name: 'Peixe', destinationNodeId: 'node_quay_south', weight: 1 };
    const c2 = { id: 'c2', name: 'Óleo', destinationNodeId: 'node_outpost_east', weight: 1 };
    state.cargoOnboard = [c1, c2];

    // Descarregar apenas c1 na doca sul
    state = gameReducer(state, { type: 'DELIVER_CARGO_AT_NODE', payload: { nodeId: 'node_quay_south' } });
    expect(state.deliveredCargo.length).toBe(1);
    expect(state.deliveredCargo[0].id).toBe('c1');
    expect(state.cargoOnboard.length).toBe(1);
    expect(state.cargoOnboard[0].id).toBe('c2');

    // Carregar rota alternativa
    const alt = ['node_harbor', 'node_channel_1', 'node_quay_south'];
    state = gameReducer(state, { type: 'APPLY_ALTERNATIVE_ROUTE', payload: alt });
    expect(state.route).toEqual(alt);
    expect(state.metrics.lastRouteAlternativeCompared).toBe(true);
  });
});
