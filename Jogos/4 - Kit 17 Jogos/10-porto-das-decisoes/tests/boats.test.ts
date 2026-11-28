import { describe, it, expect } from 'vitest';
import { HarborBoatsManager, BoatModel } from '../src/scene/boats';
import { BOATS_CATALOG } from '../src/game/content';
import { CargoItem } from '../src/game/state';

describe('3D Boat Models and Berth Positioning', () => {
  it('prevents crate 3D mesh leaks when cargo is updated or cleared', () => {
    const boat = new BoatModel(BOATS_CATALOG.blue);
    const mockCrates: CargoItem[] = [
      { id: '1', name: 'A', destinationNodeId: 'node_quay_south', weight: 1 },
      { id: '2', name: 'B', destinationNodeId: 'node_quay_south', weight: 1 },
      { id: '3', name: 'C', destinationNodeId: 'node_quay_south', weight: 1 }
    ];

    // Carregar 3 caixas
    boat.updateCargoMeshes(mockCrates);
    // Deve ter 3 grupos de caixas
    const slotsGroup = (boat as any).cargoSlotsGroup;
    expect(slotsGroup.children.length).toBe(3);

    // Atualizar para 1 caixa (descarregou 2)
    boat.updateCargoMeshes([mockCrates[0]]);
    expect(slotsGroup.children.length).toBe(1);

    // Limpar todas as caixas
    boat.updateCargoMeshes([]);
    expect(slotsGroup.children.length).toBe(0);
  });

  it('guarantees separate non-overlapping berths for all 3 boats', () => {
    const manager = new HarborBoatsManager(BOATS_CATALOG);

    const checkNoCollisions = (activeId: 'blue' | 'green' | 'red') => {
      manager.positionIdleBoats(activeId);
      const bBlue = manager.getBoat('blue').group.position;
      const bGreen = manager.getBoat('green').group.position;
      const bRed = manager.getBoat('red').group.position;

      // Distância Blue-Green
      const distBG = Math.hypot(bBlue.x - bGreen.x, bBlue.z - bGreen.z);
      expect(distBG).toBeGreaterThan(1.5);

      // Distância Blue-Red
      const distBR = Math.hypot(bBlue.x - bRed.x, bBlue.z - bRed.z);
      expect(distBR).toBeGreaterThan(1.5);

      // Distância Green-Red
      const distGR = Math.hypot(bGreen.x - bRed.x, bGreen.z - bRed.z);
      expect(distGR).toBeGreaterThan(1.5);
    };

    checkNoCollisions('blue');
    checkNoCollisions('green');
    checkNoCollisions('red');
  });
});
