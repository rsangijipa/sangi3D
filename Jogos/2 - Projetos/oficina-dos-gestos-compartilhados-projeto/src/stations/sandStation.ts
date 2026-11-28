import * as THREE from 'three';
import { createSandGrainTexture, createWoodTextures } from '../core/textures';
import { HeightmapField, HeightmapSnapshot, SculptOp } from '../physics/kernels';

export interface SandStationHandle {
  group: THREE.Group;
  sandMesh: THREE.Mesh;
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

export function createSandStation(scene: THREE.Scene): SandStationHandle {
  const group = new THREE.Group();
  group.position.set(3.15, 0, 0.55);
  group.rotation.y = -0.26;
  scene.add(group);

  const woodTex = createWoodTextures(2, 2);
  const sandTex = createSandGrainTexture();

  const woodMat = new THREE.MeshStandardMaterial({
    map: woodTex.map,
    roughnessMap: woodTex.roughnessMap,
    roughness: 0.82
  });

  // Raised Wooden Sand Tray Legs & Frame
  for (const lx of [-0.88, 0.88]) {
    for (const lz of [-0.52, 0.52]) {
      const leg = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.72, 0.1), woodMat);
      leg.position.set(lx, 0.36, lz);
      leg.castShadow = true;
      group.add(leg);
    }
  }

  const trayBase = new THREE.Mesh(new THREE.BoxGeometry(1.94, 0.08, 1.24), woodMat);
  trayBase.position.y = 0.73;
  trayBase.castShadow = true;
  trayBase.receiveShadow = true;
  group.add(trayBase);

  // Wooden tray rims
  const rimFB = new THREE.BoxGeometry(1.94, 0.14, 0.08);
  const rimLR = new THREE.BoxGeometry(0.08, 0.14, 1.08);
  const rimF = new THREE.Mesh(rimFB, woodMat);
  rimF.position.set(0, 0.82, 0.58);
  const rimB = rimF.clone();
  rimB.position.z = -0.58;
  const rimL = new THREE.Mesh(rimLR, woodMat);
  rimL.position.set(-0.93, 0.82, 0);
  const rimR = rimL.clone();
  rimR.position.x = 0.93;
  [rimF, rimB, rimL, rimR].forEach((r) => {
    r.castShadow = true;
    r.receiveShadow = true;
    group.add(r);
  });

  // Decorative smooth river stones & wooden rake on tray rim
  const stoneMat = new THREE.MeshStandardMaterial({ color: '#979188', roughness: 0.65 });
  const stone1 = new THREE.Mesh(new THREE.SphereGeometry(0.085, 16, 12), stoneMat);
  stone1.scale.set(1.2, 0.55, 0.95);
  stone1.position.set(-0.36, 0.83, -0.18);
  stone1.castShadow = true;
  const stone2 = stone1.clone();
  stone2.scale.set(0.95, 0.5, 0.8);
  stone2.position.set(0.32, 0.825, -0.24);
  group.add(stone1, stone2);

  const rakeHandle = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.42, 8), woodMat);
  rakeHandle.rotation.z = Math.PI / 2;
  rakeHandle.position.set(0.65, 0.9, 0.28);
  const rakeHead = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.03, 0.24), woodMat);
  rakeHead.position.set(0.45, 0.9, 0.28);
  group.add(rakeHandle, rakeHead);

  // Deformable Sand Heightmap (68x48)
  const COLS = 68;
  const ROWS = 48;
  const field = new HeightmapField({
    cols: COLS,
    rows: ROWS,
    baseHeight: 0.055,
    minHeight: 0.008,
    maxHeight: 0.14
  });

  const seedInitialWaves = () => {
    field.reset((nx, ny) => {
      const wave = Math.sin(nx * Math.PI * 10 + Math.cos(ny * Math.PI * 3) * 1.4) * 0.012;
      return 0.055 + wave;
    });
  };
  seedInitialWaves();

  const sandGeo = new THREE.PlaneGeometry(1.76, 1.06, COLS - 1, ROWS - 1);
  sandGeo.rotateX(-Math.PI / 2);
  const sandMat = new THREE.MeshStandardMaterial({
    map: sandTex,
    color: '#E6D6BC',
    roughness: 0.94,
    metalness: 0.0
  });
  const sandMesh = new THREE.Mesh(sandGeo, sandMat);
  sandMesh.position.set(0, 0.775, 0);
  sandMesh.receiveShadow = true;
  sandMesh.name = 'sand_surface';
  group.add(sandMesh);

  const syncGeometry = () => {
    const posAttr = sandGeo.getAttribute('position') as THREE.BufferAttribute;
    for (let i = 0; i < field.heights.length; i++) {
      posAttr.setY(i, field.heights[i]);
    }
    posAttr.needsUpdate = true;
    sandGeo.computeVertexNormals();
  };
  syncGeometry();

  const undoStack: HeightmapSnapshot[] = [];
  const redoStack: HeightmapSnapshot[] = [];

  return {
    group,
    sandMesh,
    cameraTarget: new THREE.Vector3(3.15, 0.84, 0.5),
    cameraPosition: new THREE.Vector3(2.95, 2.12, 1.95),
    handlePointer(uv, prevUv, phase, toolId, participant, mirror) {
      if (phase === 'start') {
        undoStack.push(field.snapshot());
        if (undoStack.length > 24) undoStack.shift();
        redoStack.length = 0;
      }
      if (phase === 'end') return;

      const ownerId = participant === 'A' ? 1 : 2;
      let op: SculptOp = 'rake';
      let radius = 0.09;
      let strength = 0.014;
      let tines = 5;

      if (toolId === 'rastelo_largo') {
        op = 'rake';
        radius = 0.14;
        strength = 0.016;
        tines = 7;
      } else if (toolId === 'pedra') {
        op = 'stamp';
        radius = 0.085;
        strength = 0.022;
      } else if (toolId === 'pincel_areia') {
        op = 'press';
        radius = 0.06;
        strength = 0.015;
      } else if (toolId === 'nivelar') {
        op = 'level';
        radius = 0.16;
        strength = 0.12;
      }

      field.applyBrush({
        u: uv.x,
        v: 1 - uv.y,
        prevU: prevUv ? prevUv.x : uv.x,
        prevV: prevUv ? 1 - prevUv.y : 1 - uv.y,
        radius,
        strength,
        op,
        ownerId,
        tines
      });
      if (mirror) {
        field.applyBrush({
          u: 1 - uv.x,
          v: 1 - uv.y,
          prevU: prevUv ? 1 - prevUv.x : 1 - uv.x,
          prevV: prevUv ? 1 - prevUv.y : 1 - uv.y,
          radius,
          strength,
          op,
          ownerId,
          tines
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
      field.reset();
      syncGeometry();
    },
    dispose() {
      woodTex.map.dispose();
      woodTex.roughnessMap.dispose();
      sandTex.dispose();
      sandGeo.dispose();
      sandMat.dispose();
    }
  };
}
