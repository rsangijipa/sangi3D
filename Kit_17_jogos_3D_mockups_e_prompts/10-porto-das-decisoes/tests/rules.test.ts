import { describe, it, expect } from 'vitest';
import {
  isEdgeConnected,
  getAdjacentNodes,
  calculateRouteDistance,
  validateAdjacency,
  simulateVoyage,
  findAlternativeValidRoute
} from '../src/game/rules';
import { BOATS_CATALOG, MISSIONS } from '../src/game/content';

describe('Harbor Graph and Adjacency Rules', () => {
  it('identifies valid and invalid edges correctly', () => {
    // node_harbor connects to node_channel_1
    expect(isEdgeConnected('node_harbor', 'node_channel_1')).toBe(true);
    expect(isEdgeConnected('node_channel_1', 'node_harbor')).toBe(true);

    // node_harbor does NOT connect directly to node_lighthouse
    expect(isEdgeConnected('node_harbor', 'node_lighthouse')).toBe(false);
  });

  it('retrieves adjacent neighbors properly', () => {
    const harborNeighbors = getAdjacentNodes('node_harbor');
    expect(harborNeighbors).toContain('node_channel_1');

    const crossingNeighbors = getAdjacentNodes('node_crossing');
    expect(crossingNeighbors).toContain('node_channel_1');
    expect(crossingNeighbors).toContain('node_quay_south');
    expect(crossingNeighbors).toContain('node_outpost_east');
    expect(crossingNeighbors).toContain('node_bay_north');
  });

  it('validates connected route and detects disconnected jumps', () => {
    const validRoute = ['node_harbor', 'node_channel_1', 'node_crossing', 'node_quay_south'];
    expect(validateAdjacency(validRoute).valid).toBe(true);

    const brokenRoute = ['node_harbor', 'node_lighthouse']; // Pulo impossível
    const result = validateAdjacency(brokenRoute);
    expect(result.valid).toBe(false);
    expect(result.errorMsg).toBeDefined();
  });

  it('computes route distances accurately', () => {
    const route = ['node_harbor', 'node_channel_1', 'node_crossing'];
    const dist = calculateRouteDistance(route);
    expect(dist).toBeGreaterThan(4.0);
    expect(dist).toBeLessThan(6.0);
  });
});

describe('Simulation and Capacity Rules', () => {
  const mission1 = MISSIONS[0];
  const boatBlue = BOATS_CATALOG.blue; // capacity 3
  const boatRed = BOATS_CATALOG.red;   // capacity 5

  it('successfully simulates valid delivery to required dock', () => {
    const route = ['node_harbor', 'node_channel_1', 'node_crossing', 'node_quay_south'];
    const cargo = mission1.cargoSet.slice(0, 3); // 3 caixas para node_quay_south no barco azul (cap 3)

    const sim = simulateVoyage(route, cargo, boatBlue, mission1);
    expect(sim.valid).toBe(true);
    expect(sim.canExecute).toBe(true);
    expect(sim.unvisitedDestinations.length).toBe(0);
    expect(sim.deliveries.length).toBe(1);
    expect(sim.deliveries[0].unloadedCargo.length).toBe(3);
    expect(sim.capacityExceeded).toBe(false);
  });

  it('detects boat capacity overflow gracefully without throwing', () => {
    const route = ['node_harbor', 'node_channel_1', 'node_crossing', 'node_quay_south'];
    // 4 caixas no barco azul (capacidade 3)
    const excessCargo = [
      { id: 'c1', name: 'A', destinationNodeId: 'node_quay_south', weight: 1 },
      { id: 'c2', name: 'B', destinationNodeId: 'node_quay_south', weight: 1 },
      { id: 'c3', name: 'C', destinationNodeId: 'node_quay_south', weight: 1 },
      { id: 'c4', name: 'D', destinationNodeId: 'node_quay_south', weight: 1 }
    ];

    const sim = simulateVoyage(route, excessCargo, boatBlue, mission1);
    expect(sim.valid).toBe(false);
    expect(sim.canExecute).toBe(false);
    expect(sim.capacityExceeded).toBe(true);
    expect(sim.excessCratesCount).toBe(1);
    expect(sim.explanation).toContain('comporta 3 caixas');

    // Com o barco vermelho (capacidade 5), as 4 caixas devem passar
    const simRed = simulateVoyage(route, excessCargo, boatRed, mission1);
    expect(simRed.capacityExceeded).toBe(false);
    expect(simRed.valid).toBe(true);
  });

  it('warns about missing required destinations', () => {
    // Rota para na encruzilhada sem chegar na doca sul
    const shortRoute = ['node_harbor', 'node_channel_1', 'node_crossing'];
    const cargo = mission1.cargoSet.slice(0, 3);

    const sim = simulateVoyage(shortRoute, cargo, boatBlue, mission1);
    expect(sim.valid).toBe(false);
    expect(sim.canExecute).toBe(false);
    expect(sim.unvisitedDestinations).toContain('node_quay_south');
    expect(sim.explanation).toContain('não visita');
  });

  it('discovers at least one alternative valid route for missions', () => {
    const routeA = ['node_harbor', 'node_channel_1', 'node_crossing', 'node_quay_south'];
    const altRoute = findAlternativeValidRoute(routeA, ['node_quay_south']);
    expect(altRoute.length).toBeGreaterThanOrEqual(3);
    expect(altRoute.join('->')).not.toBe(routeA.join('->'));
    expect(altRoute[0]).toBe('node_harbor');
    expect(altRoute).toContain('node_quay_south');
  });

  it('correctly handles circuit routes returning to harbor (Mission 3 edge case)', () => {
    const loopRoute = [
      'node_harbor',
      'node_channel_1',
      'node_crossing',
      'node_outpost_east',
      'node_lighthouse',
      'node_bay_north',
      'node_harbor'
    ];
    const alt = findAlternativeValidRoute(loopRoute, ['node_lighthouse', 'node_harbor']);
    expect(alt.length).toBeGreaterThan(2);
    expect(alt[0]).toBe('node_harbor');
    expect(alt[alt.length - 1]).toBe('node_harbor');
    expect(alt).toContain('node_lighthouse');
    expect(alt.join('->')).not.toBe(loopRoute.join('->'));
  });

  it('guarantees every mission in catalog has alternative valid paths', () => {
    for (const mission of MISSIONS) {
      const dummyRoute = ['node_harbor', 'node_channel_1'];
      const alt = findAlternativeValidRoute(dummyRoute, mission.requiredDestinations);
      expect(alt.length).toBeGreaterThanOrEqual(2);
      expect(alt[0]).toBe('node_harbor');
      for (const req of mission.requiredDestinations) {
        expect(alt).toContain(req);
      }
    }
  });
});
