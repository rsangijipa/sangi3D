import * as THREE from 'three';
import { PALETTE, createWoodTextures } from '../core/textures';
import { HeightmapField, HeightmapSnapshot, SculptOp } from '../physics/kernels';

export interface ClayStationHandle {
  group: THREE.Group;
  clayMesh: THREE.Mesh;
  cameraTarget: THREE.Vector3;
  cameraPosition: THREE.Vector3;
  handlePointer: (
    uv: THREE.Vector2,
    prevUv: THREE.Vector2 | null,
    phase: 'start' | 'move' | 'end',
    toolId: string,
    participant: 'A' | 'B',
    mirror: boolean
  ) => void;
  undo: () => boolean;
  redo: () => boolean;
  clear: () => void;
  dispose: () => void;
}

export function createClayStation(scene: THREE.Scene): ClayStationHandle {
  const group = new THREE.Group();
  group.position.set(-3.15, 0, 0.55);
  group.rotation.y = 0.28;
  scene.add(group);

  const woodTex = createWoodTextures(2, 2);
  const woodMat = new THREE.MeshStandardMaterial({
    map: woodTex.map,
    roughnessMap: woodTex.roughnessMap,
    roughness: 0.85
  });

  // Rustic Workbench
  const tableTop = new THREE.Mesh(new THREE.BoxGeometry(1.75, 0.1, 1.05), woodMat);
  tableTop.position.y = 0.78;
  tableTop.castShadow = true;
  tableTop.receiveShadow = true;
  group.add(tableTop);

  for (const lx of [-0.72, 0.72]) {
    for (const lz of [-0.38, 0.38]) {
      const leg = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.78, 0.1), woodMat);
      leg.position.set(lx, 0.39, lz);
      leg.castShadow = true;
      group.add(leg);
    }
  }

  // Wooden Stool in front
  const stoolSeat = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.06, 20), woodMat);
  stoolSeat.position.set(-0.2, 0.46, 0.88);
  stoolSeat.castShadow = true;
  group.add(stoolSeat);
  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * Math.PI * 2 + 0.4;
    const sleg = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.02, 0.46, 8), woodMat);
    sleg.position.set(-0.2 + Math.cos(a) * 0.15, 0.23, 0.88 + Math.sin(a) * 0.15);
    sleg.castShadow = true;
    group.add(sleg);
  }

  // Terracotta cloth draped on table edge
  const cloth = new THREE.Mesh(
    new THREE.BoxGeometry(0.45, 0.04, 0.52),
    new THREE.MeshStandardMaterial({ color: PALETTE.terracotta, roughness: 0.92 })
  );
  cloth.position.set(0.38, 0.835, 0.36);
  cloth.castShadow = true;
  group.add(cloth);

  // Water bowl & tool jar
  const waterBowl = new THREE.Mesh(
    new THREE.CylinderGeometry(0.13, 0.09, 0.09, 18),
    new THREE.MeshStandardMaterial({ color: '#9BA598', roughness: 0.55 })
  );
  waterBowl.position.set(0.62, 0.875, -0.15);
  waterBowl.castShadow = true;
  group.add(waterBowl);

  const toolJar = new THREE.Mesh(
    new THREE.CylinderGeometry(0.085, 0.08, 0.22, 16),
    new THREE.MeshStandardMaterial({ color: '#C4AA8B', roughness: 0.72 })
  );
  toolJar.position.set(-0.66, 0.94, -0.22);
  toolJar.castShadow = true;
  group.add(toolJar);

  // Turntable / Banding wheel
  const wheel = new THREE.Mesh(
    new THREE.CylinderGeometry(0.44, 0.46, 0.07, 32),
    new THREE.MeshStandardMaterial({ color: '#8A674D', roughness: 0.7 })
  );
  wheel.position.set(-0.02, 0.865, 0.02);
  wheel.castShadow = true;
  wheel.receiveShadow = true;
  group.add(wheel);

  // Deformable Clay Heightmap Mesh (52x52)
  const COLS = 52;
  const ROWS = 52;
  const field = new HeightmapField({
    cols: COLS,
    rows: ROWS,
    baseHeight: 0.14,
    minHeight: 0.015,
    maxHeight: 0.48
  });

  const seedOrganicClay = () => {
    field.reset((nx, ny) => {
      const dx = nx - 0.5;
      const dy = ny - 0.5;
      const r = Math.hypot(dx, dy);
      if (r > 0.46) return 0.015;
      const dome = Math.cos((r / 0.46) * (Math.PI / 2));
      return 0.03 + dome * 0.24;
    });
  };
  seedOrganicClay();

  const clayGeo = new THREE.PlaneGeometry(0.76, 0.76, COLS - 1, ROWS - 1);
  clayGeo.rotateX(-Math.PI / 2);
  const colors = new Float32Array(COLS * ROWS * 3);
  clayGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const clayMat = new THREE.MeshStandardMaterial({
    vertexColors: true,
    roughness: 0.78,
    metalness: 0.02
  });

  const clayMesh = new THREE.Mesh(clayGeo, clayMat);
  clayMesh.position.set(-0.02, 0.9, 0.02);
  clayMesh.castShadow = true;
  clayMesh.receiveShadow = true;
  clayMesh.name = 'clay_surface';
  group.add(clayMesh);

  const syncGeometry = () => {
    const posAttr = clayGeo.getAttribute('position') as THREE.BufferAttribute;
    const colAttr = clayGeo.getAttribute('color') as THREE.BufferAttribute;
    const colBase = new THREE.Color('#B57958');
    const colA = new THREE.Color('#B86A4B');
    const colB = new THREE.Color('#D39C62');

    for (let y = 0; y < ROWS; y++) {
      for (let x = 0; x < COLS; x++) {
        const idx = y * COLS + x;
        posAttr.setY(idx, field.heights[idx]);
        const owner = field.owners[idx];
        const c = owner === 1 ? colA : owner === 2 ? colB : colBase;
        colAttr.setXYZ(idx, c.r, c.g, c.b);
      }
    }
    posAttr.needsUpdate = true;
    colAttr.needsUpdate = true;
    clayGeo.computeVertexNormals();
  };
  syncGeometry();

  const undoStack: HeightmapSnapshot[] = [];
  const redoStack: HeightmapSnapshot[] = [];

  const mapToolToOp = (toolId: string): SculptOp => {
    if (toolId === 'puxar') return 'pull';
    if (toolId === 'acrescentar') return 'add';
    if (toolId === 'remover') return 'remove';
    if (toolId === 'achatar') return 'flatten';
    if (toolId === 'alisar') return 'smooth';
    return 'press';
  };

  return {
    group,
    clayMesh,
    cameraTarget: new THREE.Vector3(-3.15, 1.02, 0.55),
    cameraPosition: new THREE.Vector3(-1.95, 2.05, 2.35),
    handlePointer(uv, prevUv, phase, toolId, participant, mirror) {
      if (phase === 'start') {
        undoStack.push(field.snapshot());
        if (undoStack.length > 24) undoStack.shift();
        redoStack.length = 0;
      }
      if (phase === 'end') return;

      const op = mapToolToOp(toolId);
      const ownerId = participant === 'A' ? 1 : 2;
      const strength = op === 'smooth' || op === 'flatten' ? 0.08 : 0.022;
      field.applyBrush({
        u: uv.x,
        v: 1 - uv.y,
        prevU: prevUv ? prevUv.x : uv.x,
        prevV: prevUv ? 1 - prevUv.y : 1 - uv.y,
        radius: 0.12,
        strength,
        op,
        ownerId
      });
      if (mirror) {
        field.applyBrush({
          u: 1 - uv.x,
          v: 1 - uv.y,
          prevU: prevUv ? 1 - prevUv.x : 1 - uv.x,
          prevV: prevUv ? 1 - prevUv.y : 1 - uv.y,
          radius: 0.12,
          strength,
          op,
          ownerId
        });
      }
      syncGeometry();
    },
    undo() {
      const prev = undoStack.pop();
      if (!prev) return false;
      redoStack.push(field.snapshot());
      field.restore(prev);
      syncGeometry();
      return true;
    },
    redo() {
      const next = redoStack.pop();
      if (!next) return false;
      undoStack.push(field.snapshot());
      field.restore(next);
      syncGeometry();
      return true;
    },
    clear() {
      undoStack.push(field.snapshot());
      seedOrganicClay();
      syncGeometry();
    },
    dispose() {
      woodTex.map.dispose();
      woodTex.roughnessMap.dispose();
      clayGeo.dispose();
      clayMat.dispose();
    }
  };
}
