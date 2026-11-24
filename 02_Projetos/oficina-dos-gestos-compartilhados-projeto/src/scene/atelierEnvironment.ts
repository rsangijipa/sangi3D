import * as THREE from 'three';
import {
  PALETTE,
  createJuteRugTexture,
  createPlasterTextures,
  createSoftGlowTexture,
  createWoodTextures
} from '../core/textures';

export interface AtelierEnvironmentHandle {
  group: THREE.Group;
  sunLight: THREE.DirectionalLight;
  dustPoints: THREE.Points;
  update: (time: number, reducedMotion: boolean) => void;
  setQuality: (quality: 'cinema' | 'equilibrada' | 'leve') => void;
  dispose: () => void;
}

export function buildAtelierEnvironment(scene: THREE.Scene): AtelierEnvironmentHandle {
  const group = new THREE.Group();
  scene.add(group);

  const woodTex = createWoodTextures(6, 5);
  const plasterTex = createPlasterTextures();
  const juteTex = createJuteRugTexture();
  const glowTex = createSoftGlowTexture();

  const floorMat = new THREE.MeshStandardMaterial({
    map: woodTex.map,
    roughnessMap: woodTex.roughnessMap,
    bumpMap: woodTex.bumpMap,
    bumpScale: 0.015,
    roughness: 0.78,
    metalness: 0.04
  });

  const beamMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(PALETTE.wood),
    map: woodTex.map,
    roughness: 0.85,
    metalness: 0.02
  });

  const plasterMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(PALETTE.cream),
    map: plasterTex.map,
    bumpMap: plasterTex.bumpMap,
    bumpScale: 0.012,
    roughness: 0.92,
    metalness: 0.0
  });

  const terracottaMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(PALETTE.terracotta),
    roughness: 0.82,
    metalness: 0.02
  });

  const sageMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(PALETTE.sage),
    roughness: 0.78,
    metalness: 0.02
  });

  const brassMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#B8964C'),
    roughness: 0.32,
    metalness: 0.78
  });

  // 1. Floor
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(18, 16), floorMat);
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  group.add(floor);

  // Braided Jute Rugs (center under easel + back right under music)
  const rugMat = new THREE.MeshStandardMaterial({
    map: juteTex.map,
    bumpMap: juteTex.bumpMap,
    bumpScale: 0.025,
    roughness: 0.95
  });
  const centerRug = new THREE.Mesh(new THREE.CylinderGeometry(2.55, 2.55, 0.018, 48), rugMat);
  centerRug.position.set(0, 0.009, 0.45);
  centerRug.receiveShadow = true;
  group.add(centerRug);

  const musicRug = new THREE.Mesh(new THREE.CylinderGeometry(1.75, 1.75, 0.018, 40), rugMat);
  musicRug.position.set(2.5, 0.009, -3.25);
  musicRug.receiveShadow = true;
  group.add(musicRug);

  // 2. Walls (Back & Sides)
  const backWall = new THREE.Mesh(new THREE.BoxGeometry(18, 7.2, 0.3), plasterMat);
  backWall.position.set(0, 3.6, -6.2);
  backWall.receiveShadow = true;
  group.add(backWall);

  const leftWall = new THREE.Mesh(new THREE.BoxGeometry(0.3, 7.2, 16), plasterMat);
  leftWall.position.set(-7.2, 3.6, 0);
  leftWall.receiveShadow = true;
  group.add(leftWall);

  const rightWall = new THREE.Mesh(new THREE.BoxGeometry(0.3, 7.2, 16), plasterMat);
  rightWall.position.set(7.2, 3.6, 0);
  rightWall.receiveShadow = true;
  group.add(rightWall);

  // Warm terracotta alcove accents
  const rightAlcove = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 1.1, 0.12, 24, 1, false, 0, Math.PI), terracottaMat);
  rightAlcove.rotation.z = Math.PI / 2;
  rightAlcove.rotation.y = Math.PI / 2;
  rightAlcove.position.set(7.02, 1.4, -1.8);
  group.add(rightAlcove);

  // 3. Exposed Wooden Ceiling & Rafters
  const ceiling = new THREE.Mesh(new THREE.PlaneGeometry(18, 16), plasterMat);
  ceiling.rotation.x = Math.PI / 2;
  ceiling.position.y = 6.9;
  group.add(ceiling);

  const beamGeo = new THREE.BoxGeometry(15.2, 0.28, 0.24);
  for (let i = -2; i <= 2; i++) {
    const beam = new THREE.Mesh(beamGeo, beamMat);
    beam.position.set(0, 6.55, i * 2.5 - 0.8);
    beam.castShadow = true;
    group.add(beam);
  }

  // 4. Large Arched Windows (Back wall) with sunlit glass & garden backdrop
  const windowPositions = [-3.1, 1.8];
  const glassMat = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color('#FFF3D9'),
    emissive: new THREE.Color('#FFD9A0'),
    emissiveIntensity: 0.42,
    roughness: 0.15,
    transmission: 0.35,
    transparent: true,
    opacity: 0.88
  });

  for (const wx of windowPositions) {
    const winGroup = new THREE.Group();
    winGroup.position.set(wx, 0, -6.02);

    const pane = new THREE.Mesh(new THREE.PlaneGeometry(2.8, 3.8), glassMat);
    pane.position.set(0, 2.75, 0.01);
    winGroup.add(pane);

    const arch = new THREE.Mesh(new THREE.CircleGeometry(1.4, 28, 0, Math.PI), glassMat);
    arch.position.set(0, 4.65, 0.01);
    winGroup.add(arch);

    // Mullions
    const frameLeft = new THREE.Mesh(new THREE.BoxGeometry(0.12, 3.85, 0.14), beamMat);
    frameLeft.position.set(-1.4, 2.75, 0.06);
    const frameRight = frameLeft.clone();
    frameRight.position.x = 1.4;
    const sill = new THREE.Mesh(new THREE.BoxGeometry(3.05, 0.14, 0.24), beamMat);
    sill.position.set(0, 0.84, 0.08);
    winGroup.add(frameLeft, frameRight, sill);

    for (let m = -0.7; m <= 0.71; m += 0.7) {
      const bar = new THREE.Mesh(new THREE.BoxGeometry(0.05, 4.8, 0.08), beamMat);
      bar.position.set(m, 3.2, 0.05);
      winGroup.add(bar);
    }
    for (let h = 1.65; h <= 4.3; h += 0.85) {
      const cross = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.05, 0.08), beamMat);
      cross.position.set(0, h, 0.05);
      winGroup.add(cross);
    }

    group.add(winGroup);
  }

  // 5. Left Wall Shelves + Ceramic Pots + Cozy Bench with Cushions
  const shelfGeo = new THREE.BoxGeometry(2.2, 0.07, 0.42);
  for (const sy of [2.1, 2.95]) {
    const shelf = new THREE.Mesh(shelfGeo, beamMat);
    shelf.position.set(-6.85, sy, -1.9);
    shelf.rotation.y = Math.PI / 2;
    shelf.castShadow = true;
    group.add(shelf);
  }

  // Ceramic pots on shelves
  const potPositions: Array<[number, number, number, number, string]> = [
    [-6.82, 2.27, -2.5, 0.13, PALETTE.terracotta],
    [-6.82, 2.23, -2.0, 0.1, PALETTE.sage],
    [-6.82, 2.28, -1.4, 0.14, PALETTE.wood],
    [-6.82, 3.12, -2.3, 0.12, PALETTE.petrol],
    [-6.82, 3.10, -1.6, 0.11, PALETTE.terracotta]
  ];
  for (const [px, py, pz, r, col] of potPositions) {
    const pot = new THREE.Mesh(
      new THREE.CylinderGeometry(r * 0.82, r * 0.65, r * 2.1, 16),
      new THREE.MeshStandardMaterial({ color: col, roughness: 0.75 })
    );
    pot.position.set(px, py, pz);
    pot.castShadow = true;
    group.add(pot);
  }

  // Cozy bench under back-left window
  const benchGroup = new THREE.Group();
  benchGroup.position.set(-3.1, 0, -5.05);
  const benchTop = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.09, 0.72), beamMat);
  benchTop.position.y = 0.46;
  benchTop.castShadow = true;
  benchTop.receiveShadow = true;
  benchGroup.add(benchTop);

  for (const lx of [-1.1, 1.1]) {
    for (const lz of [-0.26, 0.26]) {
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.035, 0.45, 10), beamMat);
      leg.position.set(lx, 0.225, lz);
      leg.castShadow = true;
      benchGroup.add(leg);
    }
  }
  const cushionColors = [PALETTE.sage, PALETTE.terracotta, PALETTE.mustard];
  cushionColors.forEach((col, i) => {
    const cush = new THREE.Mesh(
      new THREE.BoxGeometry(0.46, 0.36, 0.16),
      new THREE.MeshStandardMaterial({ color: col, roughness: 0.9 })
    );
    cush.position.set(-0.7 + i * 0.45, 0.68, -0.18);
    cush.rotation.z = (i - 1) * 0.08;
    cush.rotation.x = -0.18;
    cush.castShadow = true;
    benchGroup.add(cush);
  });
  group.add(benchGroup);

  // 6. Instanced Foliage (Hanging vines & potted plants)
  const leafGeo = new THREE.SphereGeometry(0.075, 7, 6);
  leafGeo.scale(1.2, 0.45, 0.8);
  const leafMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(PALETTE.sage),
    roughness: 0.65
  });
  const leafCount = 160;
  const leafInst = new THREE.InstancedMesh(leafGeo, leafMat, leafCount);
  const dummy = new THREE.Object3D();
  for (let i = 0; i < leafCount; i++) {
    if (i < 70) {
      // Right potted ficus/plant
      const angle = (i / 70) * Math.PI * 10;
      const rad = 0.15 + (i % 7) * 0.08;
      dummy.position.set(4.8 + Math.cos(angle) * rad, 0.95 + (i / 70) * 1.45, -3.7 + Math.sin(angle) * rad);
      dummy.rotation.set(Math.sin(i) * 0.5, angle, Math.cos(i) * 0.4);
    } else if (i < 120) {
      // Hanging vines near left shelves
      const t = (i - 70) / 50;
      dummy.position.set(-6.6 + Math.sin(t * 14) * 0.14, 3.05 - t * 1.35, -2.5 + (i % 3) * 0.5);
      dummy.rotation.set(t * 2, i * 0.7, 0.2);
    } else {
      // Hanging vines near ceiling rafters
      const t = (i - 120) / 40;
      dummy.position.set(-1.5 + (i % 5) * 1.1, 5.9 - (i % 6) * 0.18, -5.5 + Math.sin(t * 9) * 0.2);
      dummy.rotation.set(0.3, i, 0.2);
    }
    const s = 0.8 + (i % 5) * 0.18;
    dummy.scale.set(s, s, s);
    dummy.updateMatrix();
    leafInst.setMatrixAt(i, dummy.matrix);
  }
  leafInst.castShadow = true;
  group.add(leafInst);

  // Terracotta planter for right plant
  const planter = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.27, 0.58, 20), terracottaMat);
  planter.position.set(4.8, 0.29, -3.7);
  planter.castShadow = true;
  group.add(planter);

  // 7. Woven basket beside sand tray
  const basket = new THREE.Mesh(
    new THREE.CylinderGeometry(0.34, 0.26, 0.44, 22, 1, true),
    new THREE.MeshStandardMaterial({ map: juteTex.map, roughness: 0.92, side: THREE.DoubleSide })
  );
  basket.position.set(3.95, 0.22, 1.45);
  basket.castShadow = true;
  group.add(basket);

  // 8. Lighting (Warm Golden Afternoon Sunlight + Ambient + Volumetric Sunbeams)
  const hemiLight = new THREE.HemisphereLight('#FFF5E2', '#8D725B', 0.82);
  group.add(hemiLight);

  const sunLight = new THREE.DirectionalLight('#FFE2B3', 1.65);
  sunLight.position.set(-3.2, 7.5, -7.8);
  sunLight.castShadow = true;
  sunLight.shadow.mapSize.set(2048, 2048);
  sunLight.shadow.camera.near = 1.0;
  sunLight.shadow.camera.far = 22.0;
  sunLight.shadow.camera.left = -7.5;
  sunLight.shadow.camera.right = 7.5;
  sunLight.shadow.camera.top = 7.5;
  sunLight.shadow.camera.bottom = -7.5;
  sunLight.shadow.bias = -0.0005;
  group.add(sunLight);

  const fillLight = new THREE.PointLight('#FFF0D4', 0.55, 16);
  fillLight.position.set(0.5, 4.4, 3.2);
  group.add(fillLight);

  // Pendant brass lamps
  for (const lx of [-2.8, 2.8]) {
    const cord = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 2.2, 8), brassMat);
    cord.position.set(lx, 5.7, -0.5);
    const shade = new THREE.Mesh(new THREE.ConeGeometry(0.24, 0.18, 18, 1, true), brassMat);
    shade.position.set(lx, 4.6, -0.5);
    group.add(cord, shade);
  }

  // Sunbeam cones
  const beamConeMat = new THREE.MeshBasicMaterial({
    color: '#FFE7BD',
    transparent: true,
    opacity: 0.045,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide
  });
  const sunBeam = new THREE.Mesh(new THREE.ConeGeometry(2.6, 8.2, 24, 1, true), beamConeMat);
  sunBeam.position.set(-1.4, 3.1, -2.8);
  sunBeam.rotation.x = 0.58;
  sunBeam.rotation.z = -0.25;
  group.add(sunBeam);

  // Floating dust motes
  const dustCount = 140;
  const dustPos = new Float32Array(dustCount * 3);
  for (let i = 0; i < dustCount; i++) {
    dustPos[i * 3] = (Math.random() - 0.5) * 10;
    dustPos[i * 3 + 1] = 0.5 + Math.random() * 4.5;
    dustPos[i * 3 + 2] = (Math.random() - 0.5) * 9 - 0.5;
  }
  const dustGeo = new THREE.BufferGeometry();
  dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
  const dustMat = new THREE.PointsMaterial({
    map: glowTex,
    size: 0.075,
    transparent: true,
    opacity: 0.55,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  });
  const dustPoints = new THREE.Points(dustGeo, dustMat);
  group.add(dustPoints);

  return {
    group,
    sunLight,
    dustPoints,
    update(time: number, reducedMotion: boolean) {
      if (reducedMotion) return;
      const posAttr = dustGeo.getAttribute('position') as THREE.BufferAttribute;
      for (let i = 0; i < dustCount; i++) {
        const y = posAttr.getY(i) + Math.sin(time * 0.45 + i) * 0.0012;
        const x = posAttr.getX(i) + Math.cos(time * 0.32 + i * 1.3) * 0.0008;
        posAttr.setXY(i, x, y > 5.2 ? 0.6 : y);
      }
      posAttr.needsUpdate = true;
    },
    setQuality(quality) {
      if (quality === 'cinema') {
        sunLight.castShadow = true;
        sunLight.shadow.mapSize.set(2048, 2048);
        sunBeam.visible = true;
        dustPoints.visible = true;
      } else if (quality === 'equilibrada') {
        sunLight.castShadow = true;
        sunLight.shadow.mapSize.set(1024, 1024);
        sunBeam.visible = true;
        dustPoints.visible = true;
      } else {
        sunLight.castShadow = false;
        sunBeam.visible = false;
        dustPoints.visible = false;
      }
      if (sunLight.shadow.map) {
        sunLight.shadow.map.dispose();
        sunLight.shadow.map = null;
      }
    },
    dispose() {
      woodTex.map.dispose();
      woodTex.roughnessMap.dispose();
      plasterTex.map.dispose();
      plasterTex.bumpMap.dispose();
      juteTex.map.dispose();
      juteTex.bumpMap.dispose();
      glowTex.dispose();
      dustGeo.dispose();
      dustMat.dispose();
      leafGeo.dispose();
      leafMat.dispose();
    }
  };
}
