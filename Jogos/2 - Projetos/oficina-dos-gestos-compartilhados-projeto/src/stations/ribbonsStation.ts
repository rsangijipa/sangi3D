import * as THREE from 'three';
import { PALETTE } from '../core/textures';
import { VerletRibbon } from '../physics/kernels';

export interface RibbonsStationHandle {
  group: THREE.Group;
  hitPlane: THREE.Mesh;
  cameraTarget: THREE.Vector3;
  cameraPosition: THREE.Vector3;
  applyGesture: (worldPoint: THREE.Vector3, velocity: THREE.Vector3, toolId: string, mirror: boolean) => void;
  update: (time: number, reducedMotion: boolean) => void;
  setVisibleMaterialsCount: (count: number) => void;
  clear: () => void;
  dispose: () => void;
}

export function createRibbonsStation(scene: THREE.Scene): RibbonsStationHandle {
  const group = new THREE.Group();
  group.position.set(0, 0, -1.85);
  scene.add(group);

  const ringMat = new THREE.MeshStandardMaterial({
    color: PALETTE.wood,
    roughness: 0.65,
    metalness: 0.12
  });

  // Suspended wooden hoop & cords to rafters
  const hoop = new THREE.Mesh(new THREE.TorusGeometry(0.92, 0.032, 12, 40), ringMat);
  hoop.rotation.x = Math.PI / 2;
  hoop.position.y = 4.35;
  hoop.castShadow = true;
  group.add(hoop);

  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * Math.PI * 2 + 0.35;
    const cord = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 2.25, 6), ringMat);
    cord.position.set(Math.cos(a) * 0.88, 5.45, Math.sin(a) * 0.88);
    group.add(cord);
  }

  const ribbonColors = ['#7D5EA8', PALETTE.mustard, PALETTE.terracotta, '#C46874', PALETTE.petrol];
  const SEGMENTS = 18;
  const SEG_LEN = 0.15;
  const WIDTH = 0.16;

  interface RibbonEntry {
    sim: VerletRibbon;
    mesh: THREE.Mesh;
    geo: THREE.BufferGeometry;
    mat: THREE.MeshPhysicalMaterial;
  }

  const ribbons: RibbonEntry[] = [];

  ribbonColors.forEach((col, i) => {
    const angle = -Math.PI * 0.72 + (i / (ribbonColors.length - 1)) * Math.PI * 0.9;
    const ax = Math.cos(angle) * 0.84;
    const az = Math.sin(angle) * 0.48;
    const sim = new VerletRibbon({ x: ax, y: 4.32, z: az }, SEGMENTS, SEG_LEN, 0.972, -0.0075);

    const geo = new THREE.PlaneGeometry(WIDTH, SEGMENTS * SEG_LEN, 1, SEGMENTS);
    const mat = new THREE.MeshPhysicalMaterial({
      color: col,
      roughness: 0.45,
      metalness: 0.04,
      transparent: true,
      opacity: 0.88,
      side: THREE.DoubleSide
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.castShadow = true;
    group.add(mesh);
    ribbons.push({ sim, mesh, geo, mat });
  });

  // Invisible raycast plane for air gesture capture
  const hitPlane = new THREE.Mesh(
    new THREE.PlaneGeometry(2.8, 2.8),
    new THREE.MeshBasicMaterial({ visible: false, side: THREE.DoubleSide })
  );
  hitPlane.position.set(0, 2.6, 0.2);
  hitPlane.name = 'ribbons_surface';
  group.add(hitPlane);

  // 3D trajectory ribbon trail
  const maxTrailPts = 48;
  const trailPositions = new Float32Array(maxTrailPts * 3);
  const trailGeo = new THREE.BufferGeometry();
  trailGeo.setAttribute('position', new THREE.BufferAttribute(trailPositions, 3));
  const trailMat = new THREE.LineBasicMaterial({
    color: PALETTE.mustard,
    transparent: true,
    opacity: 0.78
  });
  const trailLine = new THREE.Line(trailGeo, trailMat);
  let trailCount = 0;
  group.add(trailLine);

  const syncRibbonMeshes = () => {
    for (const r of ribbons) {
      const pos = r.geo.getAttribute('position') as THREE.BufferAttribute;
      for (let i = 0; i <= SEGMENTS; i++) {
        const n = r.sim.nodes[i];
        const halfW = WIDTH * 0.5 * (1 - i * 0.012);
        const leftIdx = i * 2;
        const rightIdx = i * 2 + 1;
        pos.setXYZ(leftIdx, n.x - halfW, n.y, n.z);
        pos.setXYZ(rightIdx, n.x + halfW, n.y, n.z);
      }
      pos.needsUpdate = true;
      r.geo.computeVertexNormals();
    }
  };
  syncRibbonMeshes();

  return {
    group,
    hitPlane,
    cameraTarget: new THREE.Vector3(0, 2.65, -1.85),
    cameraPosition: new THREE.Vector3(0, 2.55, 1.35),
    applyGesture(worldPoint, velocity, toolId, mirror) {
      const localPt = group.worldToLocal(worldPoint.clone());
      const mult = toolId === 'onda_ampla' ? 1.8 : toolId === 'espiral' ? 1.5 : 1.0;

      for (const r of ribbons) {
        for (let i = 2; i < r.sim.nodes.length; i++) {
          const n = r.sim.nodes[i];
          const d = Math.hypot(n.x - localPt.x, n.y - localPt.y);
          if (d < 1.1) {
            const influence = (1 - d / 1.1) * 0.045 * mult;
            const swirlX = toolId === 'espiral' ? -(n.y - localPt.y) * 0.03 : 0;
            r.sim.applyImpulse(i, velocity.x * influence + swirlX, velocity.y * influence * 0.6, velocity.z * influence + 0.012);
          }
          if (mirror) {
            const dm = Math.hypot(n.x + localPt.x, n.y - localPt.y);
            if (dm < 1.1) {
              const inf = (1 - dm / 1.1) * 0.045 * mult;
              r.sim.applyImpulse(i, -velocity.x * inf, velocity.y * inf * 0.6, velocity.z * inf + 0.012);
            }
          }
        }
      }

      // Append 3D trajectory point
      if (trailCount < maxTrailPts) {
        trailPositions[trailCount * 3] = localPt.x;
        trailPositions[trailCount * 3 + 1] = localPt.y;
        trailPositions[trailCount * 3 + 2] = localPt.z;
        trailCount++;
      } else {
        trailPositions.copyWithin(0, 3);
        trailPositions[(maxTrailPts - 1) * 3] = localPt.x;
        trailPositions[(maxTrailPts - 1) * 3 + 1] = localPt.y;
        trailPositions[(maxTrailPts - 1) * 3 + 2] = localPt.z;
      }
      trailGeo.setDrawRange(0, trailCount);
      (trailGeo.getAttribute('position') as THREE.BufferAttribute).needsUpdate = true;
    },
    update(time, reducedMotion) {
      if (reducedMotion) return;
      ribbons.forEach((r, idx) => {
        const breezeX = Math.sin(time * 0.9 + idx * 1.1) * 0.00055;
        const breezeZ = Math.cos(time * 0.7 + idx * 0.8) * 0.00045;
        r.sim.step(breezeX, breezeZ, 5);
      });
      syncRibbonMeshes();
    },
    setVisibleMaterialsCount(count) {
      ribbons.forEach((r, i) => {
        r.mesh.visible = i < Math.max(2, count);
      });
    },
    clear() {
      trailCount = 0;
      trailGeo.setDrawRange(0, 0);
      ribbons.forEach((r) => r.sim.reset());
      syncRibbonMeshes();
    },
    dispose() {
      ribbons.forEach((r) => {
        r.geo.dispose();
        r.mat.dispose();
      });
      trailGeo.dispose();
      trailMat.dispose();
    }
  };
}
