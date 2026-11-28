import { describe, it, expect } from 'vitest';
import { MISSIONS, BOATS_CATALOG } from '../src/game/content';
import { simulateVoyage } from '../src/game/rules';
import { createInitialState, gameReducer } from '../src/game/state';

describe('Simulation Fidelity and Mission Edge Cases', () => {
  it('ensures simulation does NOT alter real confirmed state', () => {
    let state = createInitialState('m1');
    const mission = MISSIONS[0];
    state.cargoOnboard = mission.cargoSet.slice(0, 3);
    const initialCargoCount = state.cargoOnboard.length;
    const initialDeliveredCount = state.deliveredCargo.length;

    const route = ['node_harbor', 'node_channel_1', 'node_crossing', 'node_quay_south'];
    const sim = simulateVoyage(route, state.cargoOnboard, BOATS_CATALOG.blue, mission);

    expect(sim.deliveries.length).toBe(1);
    expect(sim.deliveries[0].unloadedCargo.length).toBe(3);

    // Estado real NÃO deve ter mudado
    expect(state.cargoOnboard.length).toBe(initialCargoCount);
    expect(state.deliveredCargo.length).toBe(initialDeliveredCount);
  });

  it('verifies all 6 mission definitions exist and have valid configuration', () => {
    expect(MISSIONS.length).toBeGreaterThanOrEqual(6);

    for (const mission of MISSIONS) {
      expect(mission.id).toBeDefined();
      expect(mission.cargoSet.length).toBeGreaterThan(0);
      expect(mission.requiredDestinations.length).toBeGreaterThan(0);
      expect(mission.targetBoxes).toBe(mission.cargoSet.length);
      expect(BOATS_CATALOG[mission.initialBoatId]).toBeDefined();

      // Verificar que os destinos requeridos são nós válidos com doca
      for (const destId of mission.requiredDestinations) {
        expect(['node_quay_south', 'node_outpost_east', 'node_lighthouse', 'node_harbor']).toContain(destId);
      }
    }
  });

  it('handles multi-destination deliveries correctly in sequence', () => {
    const mission2 = MISSIONS[1]; // 4 caixas: 2 para pescadores, 2 para entreposto
    const route = [
      'node_harbor',
      'node_channel_1',
      'node_crossing',
      'node_quay_south',
      'node_outpost_east'
    ];

    const sim = simulateVoyage(route, mission2.cargoSet, BOATS_CATALOG.green, mission2);
    expect(sim.valid).toBe(true);
    expect(sim.deliveries.length).toBe(2);
    expect(sim.deliveries[0].nodeId).toBe('node_quay_south');
    expect(sim.deliveries[0].unloadedCargo.length).toBe(2);
    expect(sim.deliveries[1].nodeId).toBe('node_outpost_east');
    expect(sim.deliveries[1].unloadedCargo.length).toBe(2);
    expect(sim.unvisitedDestinations.length).toBe(0);
  });

  it('completes voyage confirmation and transitions state properly', () => {
    let state = createInitialState('m1');
    const mission = MISSIONS[0];
    state.cargoOnboard = mission.cargoSet.slice(0, 3);

    // Simular
    const route = ['node_harbor', 'node_channel_1', 'node_crossing', 'node_quay_south'];
    state.route = route;
    const sim = simulateVoyage(route, state.cargoOnboard, BOATS_CATALOG.blue, mission);

    state = gameReducer(state, { type: 'START_SIMULATION', payload: sim });
    expect(state.isSimulating).toBe(true);
    expect(state.step).toBe('simulating');

    state = gameReducer(state, { type: 'CONFIRM_VOYAGE' });
    expect(state.isVoyaging).toBe(true);
    expect(state.step).toBe('confirmed_voyage');

    // Ao terminar viagem
    const allDelivered = sim.deliveries.flatMap(d => d.unloadedCargo);
    state = gameReducer(state, { type: 'COMPLETE_VOYAGE', payload: { delivered: allDelivered } });

    expect(state.step).toBe('review');
    expect(state.deliveredCargo.length).toBe(3);
    expect(state.cargoOnboard.length).toBe(0);
    expect(state.metrics.voyagesCompleted).toBe(1);
  });

  it('validates Mission 4 capacity challenge (5 crates on Blue Boat vs Red Boat)', () => {
    const mission4 = MISSIONS[3]; // Mission 4
    expect(mission4.id).toBe('m4');
    expect(mission4.cargoSet.length).toBe(5);

    const route = [
      'node_harbor',
      'node_channel_1',
      'node_crossing',
      'node_quay_south',
      'node_outpost_east'
    ];

    // Tentar 5 caixas no Barco Azul (capacidade 3)
    const simBlue = simulateVoyage(route, mission4.cargoSet, BOATS_CATALOG.blue, mission4);
    expect(simBlue.valid).toBe(false);
    expect(simBlue.canExecute).toBe(false);
    expect(simBlue.capacityExceeded).toBe(true);
    expect(simBlue.excessCratesCount).toBe(2);
    expect(simBlue.explanation).toContain('comporta 3 caixas');

    // Tentar as mesmas 5 caixas no Rebocador Vermelho (capacidade 5)
    const simRed = simulateVoyage(route, mission4.cargoSet, BOATS_CATALOG.red, mission4);
    expect(simRed.valid).toBe(true);
    expect(simRed.canExecute).toBe(true);
    expect(simRed.capacityExceeded).toBe(false);
    expect(simRed.excessCratesCount).toBe(0);
  });
});
