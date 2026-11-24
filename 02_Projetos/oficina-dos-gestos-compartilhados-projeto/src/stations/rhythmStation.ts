import * as THREE from 'three';
import { PALETTE, createWoodTextures } from '../core/textures';
import { AtelierAudioEngine } from '../core/audio';

export interface RhythmHitResult {
  instrument: 'xylophone' | 'chime' | 'drum' | 'djembe';
  noteIndex: number;
  label: string;
}

export interface RhythmStationHandle {
  group: THREE.Group;
  hitMeshes: THREE.Mesh[];
  cameraTarget: THREE.Vector3;
  cameraPosition: THREE.Vector3;
  triggerMesh: (mesh: THREE.Mesh, audio: AtelierAudioEngine) => RhythmHitResult | null;
  playDemoPattern: (audio: AtelierAudioEngine, stepIndex: number) => void;
  update: (time: number, reducedMotion: boolean) => void;
  clear: () => void;
  dispose: () => void;
}

export function createRhythmStation(scene: THREE.Scene): RhythmStationHandle {
  const group = new THREE.Group();
  group.position.set(2.5, 0, -3.25);
  group.rotation.y = -0.35;
  scene.add(group);

  const woodTex = createWoodTextures(2, 2);
  const woodMat = new THREE.MeshStandardMaterial({
    map: woodTex.map,
    roughnessMap: woodTex.roughnessMap,
    roughness: 0.78
  });

  const brassMat = new THREE.MeshStandardMaterial({
    color: '#CFA958',
    roughness: 0.28,
    metalness: 0.82
  });

  const skinMat = new THREE.MeshStandardMaterial({
    color: '#EADAC0',
    roughness: 0.85
  });

  const hitMeshes: THREE.Mesh[] = [];
  const animTargets: Array<{ mesh: THREE.Object3D; energy: number; baseY: number; baseRotX: number }> = [];

  // 1. Wooden Frame for Tubular Chimes & Frame Drum
  const postL = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 2.05, 10), woodMat);
  postL.position.set(-1.0, 1.025, -0.35);
  const postR = postL.clone();
  postR.position.x = 1.0;
  const topBar = new THREE.Mesh(new THREE.CylinderGeometry(0.038, 0.038, 2.18, 10), woodMat);
  topBar.rotation.z = Math.PI / 2;
  topBar.position.set(0, 2.0, -0.35);
  group.add(postL, postR, topBar);

  // 6 Hanging Brass Tubular Chimes
  for (let i = 0; i < 6; i++) {
    const len = 0.72 - i * 0.07;
    const chime = new THREE.Mesh(new THREE.CylinderGeometry(0.034, 0.034, len, 14), brassMat.clone());
    const cx = -0.68 + i * 0.16;
    const cy = 1.95 - len * 0.5;
    chime.position.set(cx, cy, -0.35);
    chime.castShadow = true;
    chime.userData = { instrument: 'chime', noteIndex: i, label: `Sino ${i + 1}` };
    group.add(chime);
    hitMeshes.push(chime);
    animTargets.push({ mesh: chime, energy: 0, baseY: cy, baseRotX: 0 });
  }

  // Large Frame Drum hanging on right side of frame
  const drumRing = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.36, 0.1, 28, 1, true), woodMat);
  drumRing.rotation.x = Math.PI / 2;
  drumRing.position.set(0.56, 1.48, -0.34);
  group.add(drumRing);

  const frameDrum = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.06, 28), skinMat.clone());
  frameDrum.rotation.x = Math.PI / 2;
  frameDrum.position.set(0.56, 1.48, -0.34);
  frameDrum.castShadow = true;
  frameDrum.userData = { instrument: 'drum', noteIndex: 0, label: 'Tambor de pele' };
  group.add(frameDrum);
  hitMeshes.push(frameDrum);
  animTargets.push({ mesh: frameDrum, energy: 0, baseY: 1.48, baseRotX: Math.PI / 2 });

  // 2. Low Bench + Wooden Xylophone (8 bars)
  const bench = new THREE.Mesh(new THREE.BoxGeometry(1.45, 0.07, 0.58), woodMat);
  bench.position.set(-0.15, 0.42, 0.25);
  bench.castShadow = true;
  group.add(bench);

  const barColors = ['#B86A4B', '#C9834E', '#D3AC57', '#95A274', '#829477', '#4D8B93', '#315E67', '#7D5EA8'];
  for (let i = 0; i < 8; i++) {
    const barLen = 0.44 - i * 0.025;
    const bar = new THREE.Mesh(
      new THREE.BoxGeometry(0.085, 0.032, barLen),
      new THREE.MeshStandardMaterial({ color: barColors[i], roughness: 0.55 })
    );
    const bx = -0.58 + i * 0.125;
    const by = 0.51;
    bar.position.set(bx, by, 0.25);
    bar.castShadow = true;
    bar.userData = { instrument: 'xylophone', noteIndex: i, label: `Xilofone ${i + 1}` };
    group.add(bar);
    hitMeshes.push(bar);
    animTargets.push({ mesh: bar, energy: 0, baseY: by, baseRotX: 0 });
  }

  // 3. Djembe Drum on right side
  const djembeBody = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.12, 0.62, 20), woodMat);
  djembeBody.position.set(0.82, 0.31, 0.25);
  djembeBody.castShadow = true;
  group.add(djembeBody);

  const djembeHead = new THREE.Mesh(new THREE.CylinderGeometry(0.21, 0.21, 0.04, 20), skinMat.clone());
  djembeHead.position.set(0.82, 0.63, 0.25);
  djembeHead.userData = { instrument: 'djembe', noteIndex: 1, label: 'Djembê' };
  group.add(djembeHead);
  hitMeshes.push(djembeHead);
  animTargets.push({ mesh: djembeHead, energy: 0, baseY: 0.63, baseRotX: 0 });

  return {
    group,
    hitMeshes,
    cameraTarget: new THREE.Vector3(2.5, 1.05, -3.25),
    cameraPosition: new THREE.Vector3(1.55, 1.85, -1.05),
    triggerMesh(mesh, audio) {
      const data = mesh.userData as RhythmHitResult | undefined;
      if (!data || !data.instrument) return null;
      audio.playInstrument(data.instrument, data.noteIndex, 0.9);
      const target = animTargets.find((t) => t.mesh === mesh);
      if (target) {
        target.energy = 1.0;
      }
      return data;
    },
    playDemoPattern(audio, stepIndex) {
      const idx = stepIndex % 4;
      const targetIndices = [6, 8, 10, 14]; // xylophone notes + djembe
      const m = hitMeshes[targetIndices[idx] % hitMeshes.length];
      if (m) {
        const data = m.userData as RhythmHitResult;
        audio.playInstrument(data.instrument, data.noteIndex, 0.8);
        const t = animTargets.find((a) => a.mesh === m);
        if (t) t.energy = 1.0;
      }
    },
    update(time, reducedMotion) {
      for (const t of animTargets) {
        if (t.energy > 0.005) {
          t.energy *= 0.88;
          if (!reducedMotion) {
            const instr = (t.mesh.userData as RhythmHitResult).instrument;
            if (instr === 'chime') {
              t.mesh.rotation.x = Math.sin(time * 18) * 0.14 * t.energy;
            } else if (instr === 'xylophone') {
              t.mesh.position.y = t.baseY - Math.sin(time * 28) * 0.014 * t.energy;
            } else {
              const s = 1 + Math.sin(time * 32) * 0.06 * t.energy;
              t.mesh.scale.set(s, 1, s);
            }
          }
          const mat = (t.mesh as THREE.Mesh).material as THREE.MeshStandardMaterial;
          if (mat && mat.emissive) {
            mat.emissive.set(PALETTE.mustard);
            mat.emissiveIntensity = t.energy * 0.45;
          }
        } else {
          t.mesh.position.y = t.baseY;
          t.mesh.rotation.x = t.baseRotX;
          t.mesh.scale.set(1, 1, 1);
          const mat = (t.mesh as THREE.Mesh).material as THREE.MeshStandardMaterial;
          if (mat && mat.emissive) {
            mat.emissiveIntensity = 0;
          }
        }
      }
    },
    clear() {
      animTargets.forEach((t) => {
        t.energy = 0;
      });
    },
    dispose() {
      woodTex.map.dispose();
      woodTex.roughnessMap.dispose();
    }
  };
}
