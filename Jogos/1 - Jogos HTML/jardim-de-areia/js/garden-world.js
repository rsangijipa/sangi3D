/**
 * js/garden-world.js
 * Cenário Karesansui realista: tanque delimitado em cedro e granito,
 * pavilhão tradicional japonês (engawa, shoji translúcido e telhado cerâmico),
 * rochas basálticas esculpidas com colar de musgo, lanterna tōrō e rastelo articulado.
 */
import * as THREE from 'three';
import {
  BASIN_D,
  BASIN_W,
  INITIAL_ROCKS,
  RAKE_WIDTHS,
  mulberry32,
} from './state.js';

function createSculptedRockGeo(seedOffset, radius, height) {
  const rnd = mulberry32(9100 + seedOffset * 137);
  const geo = new THREE.IcosahedronGeometry(1, 2);
  const pos = geo.attributes.position;
  const cols = new Float32Array(pos.count * 3);

  const ax = rnd() * 3.14;
  const az = rnd() * 3.14;
  const tiltX = (rnd() - 0.5) * 0.45;
  const tiltZ = (rnd() - 0.5) * 0.45;
  for (let i = 0; i < pos.count; i++) {
    let vx = pos.getX(i);
    let vy = pos.getY(i);
    let vz = pos.getZ(i);

    // Fraturas naturais angulares e planos de clivagem basálticos
    const strata = Math.sin(vx * 3.6 + vy * 2.2 + ax) * Math.cos(vz * 3.1 + az) * 0.14;
    const planeA = Math.abs(vx * 0.72 + vy * 0.48 - vz * 0.42) * 0.22;
    const planeB = Math.abs(-vx * 0.45 + vy * 0.55 + vz * 0.65) * 0.16;
    const scaleN = Math.max(0.55, 0.96 + strata - planeA - planeB * 0.5);

    vx = vx * radius * scaleN + Math.max(0, vy) * tiltX * radius * 0.45;
    vy = vy > -0.10 ? vy * height * (0.86 + strata * 0.65) : vy * height * 0.22;
    vz = vz * radius * (0.88 - strata * 0.35 - planeB * 0.3) + Math.max(0, vy) * tiltZ * radius * 0.45;
    pos.setXYZ(i, vx, vy, vz);

    // Veios minerais escuros na base úmida e topo levemente aclarado
    const hNorm = Math.max(0, Math.min(1, (vy / Math.max(0.2, height) + 0.15) * 0.85));
    const shade = 0.44 + hNorm * 0.50 + (rnd() - 0.5) * 0.09;
    cols[i * 3] = shade * 0.93;
    cols[i * 3 + 1] = shade * 0.96;
    cols[i * 3 + 2] = shade;
  }
  geo.setAttribute('color', new THREE.BufferAttribute(cols, 3));
  geo.computeVertexNormals();
  return geo;
}

function createOrganicMossCollarGeo(seedOffset) {
  const rnd = mulberry32(4200 + seedOffset * 97);
  const geo = new THREE.TorusGeometry(0.95, 0.22, 8, 28);
  geo.rotateX(Math.PI / 2);
  const pos = geo.attributes.position;
  const ph1 = rnd() * 6.28;
  const ph2 = rnd() * 6.28;
  for (let i = 0; i < pos.count; i++) {
    let x = pos.getX(i);
    let y = pos.getY(i);
    let z = pos.getZ(i);
    const ang = Math.atan2(z, x);
    const radialWarp = 1 + Math.sin(ang * 3 + ph1) * 0.12 + Math.cos(ang * 5 + ph2) * 0.08;
    const heightWarp = Math.max(0, 0.7 + Math.sin(ang * 4 + ph2) * 0.35);
    x *= radialWarp;
    z *= radialWarp;
    y = y > 0 ? y * 0.28 * heightWarp : y * 0.10;
    pos.setXYZ(i, x, y, z);
  }
  geo.computeVertexNormals();
  return geo;
}

export function buildGardenWorld(scene, mats) {
  const rnd = mulberry32(5377);
  const disposables = [];
  const track = (g) => (disposables.push(g), g);

  const cubeGeo = track(new THREE.BoxGeometry(1, 1, 1));
  function addBox(parent, w, h, d, mat, x, y, z, cast = true, receive = true) {
    const m = new THREE.Mesh(cubeGeo, mat);
    m.scale.set(w, h, d);
    m.position.set(x, y, z);
    m.castShadow = cast;
    m.receiveShadow = receive;
    parent.add(m);
    return m;
  }

  // ============================================================================
  // 1. PISO DO QUINTAL & BORDA DE MADEIRA DO TANQUE DE AREIA
  // ============================================================================
  const yard = new THREE.Mesh(
    track(new THREE.PlaneGeometry(54, 46)),
    mats.darkCedarMat
  );
  yard.rotation.x = -Math.PI / 2;
  yard.position.y = -0.09;
  yard.receiveShadow = true;
  scene.add(yard);

  const frameGroup = new THREE.Group();
  const hw = BASIN_W * 0.5;
  const hd = BASIN_D * 0.5;
  // Vigas perimetrais de cedro encaixadas com cantoneiras metálicas
  addBox(frameGroup, BASIN_W + 0.36, 0.22, 0.18, mats.darkCedarMat, 0, 0.04, hd + 0.09);
  addBox(frameGroup, BASIN_W + 0.36, 0.22, 0.18, mats.darkCedarMat, 0, 0.04, -hd - 0.09);
  addBox(frameGroup, 0.18, 0.22, BASIN_D + 0.36, mats.darkCedarMat, -hw - 0.09, 0.04, 0);
  addBox(frameGroup, 0.18, 0.22, BASIN_D + 0.36, mats.darkCedarMat, hw + 0.09, 0.04, 0);
  [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([sx, sz]) => {
    addBox(frameGroup, 0.22, 0.23, 0.22, mats.brassMat, sx * (hw + 0.09), 0.045, sz * (hd + 0.09));
  });
  scene.add(frameGroup);

  // ============================================================================
  // 2. PAVILHÃO JAPONÊS (ENGAWA, PORTAS SHOJI, PILARES & BEIRAL) AO FUNDO ESQUERDA
  // ============================================================================
  const pavilion = new THREE.Group();
  pavilion.position.set(-1.4, 0, -5.05);
  scene.add(pavilion);

  // Base em pedra e deck da varanda engawa (tábuas alinhadas)
  addBox(pavilion, 11.4, 0.36, 2.8, mats.plasterMat, 0, 0.10, -0.35, true, true);
  for (let i = 0; i < 6; i++) {
    addBox(pavilion, 11.4, 0.055, 0.28, mats.weatheredDeckMat, 0, 0.32, 0.72 - i * 0.30, true, true);
  }
  // Degrau de granito natural conectando a varanda ao jardim
  addBox(pavilion, 1.35, 0.16, 0.55, mats.rockMat, 1.6, 0.04, 1.16, true, true);

  // Pilares estruturais sobre sapatas de pedra + painel Shoji translúcido
  for (let p = -4.8; p <= 4.8; p += 2.4) {
    addBox(pavilion, 0.22, 0.08, 0.22, mats.rockMat, p, 0.38, 0.72, false, true);
    addBox(pavilion, 0.15, 2.72, 0.15, mats.darkCedarMat, p, 1.72, 0.72, true, true);
    if (p < 4.5) {
      // Painéis Shoji com quadriculado em hinoki
      const midX = p + 1.2;
      addBox(pavilion, 2.25, 2.15, 0.03, mats.shojiMat, midX, 1.44, -0.78, false, false);
      addBox(pavilion, 2.28, 0.08, 0.06, mats.darkCedarMat, midX, 0.38, -0.78);
      addBox(pavilion, 2.28, 0.08, 0.06, mats.darkCedarMat, midX, 2.52, -0.78);
      for (let gx = -0.65; gx <= 0.65; gx += 0.65) {
        addBox(pavilion, 0.035, 2.1, 0.045, mats.hinokiMat, midX + gx, 1.44, -0.77, false, false);
      }
      for (let gy = 0.85; gy <= 2.05; gy += 0.58) {
        addBox(pavilion, 2.24, 0.035, 0.045, mats.hinokiMat, midX, gy, -0.77, false, false);
      }
    }
  }

  // Beiral inclinado e caibros aparentes lançando sombra arquitetônica no tanque
  addBox(pavilion, 12.2, 0.16, 0.20, mats.darkCedarMat, 0, 3.04, 0.72);
  for (let rx = -5.4; rx <= 5.4; rx += 0.54) {
    const rafter = addBox(pavilion, 0.07, 0.09, 3.3, mats.hinokiMat, rx, 3.24, -0.1, true, false);
    rafter.rotation.x = 0.22;
  }
  const roof = addBox(pavilion, 12.6, 0.10, 3.5, mats.roofTileMat, 0, 3.32, -0.1, true, true);
  roof.rotation.x = 0.22;

  // ============================================================================
  // 3. MURO PERIMETRAL TERROSO (KABE) LATERAL, MUSGO RENTE & LANTERNA TŌRŌ
  // ============================================================================
  // Muro direito e ala direita dos fundos (mantendo o pavilhão Shoji aberto à varanda)
  addBox(scene, 0.32, 2.15, 13.5, mats.plasterMat, hw + 1.35, 1.0, -1.8, true, true);
  addBox(scene, 0.44, 0.14, 13.7, mats.roofTileMat, hw + 1.35, 2.12, -1.8, true, false);
  addBox(scene, 3.0, 2.15, 0.32, mats.plasterMat, hw + 0.02, 1.0, -hd - 1.45, true, true);
  addBox(scene, 3.2, 0.14, 0.44, mats.roofTileMat, hw + 0.02, 2.12, -hd - 1.45, true, false);

  // Lanterna tradicional Tōrō no canto direito de fundo
  const toro = new THREE.Group();
  toro.position.set(hw + 0.65, 0, -hd - 0.65);
  const cylGeo = track(new THREE.CylinderGeometry(0.18, 0.24, 0.45, 8));
  const toroBase = new THREE.Mesh(cylGeo, mats.rockMat); toroBase.position.y = 0.22; toroBase.castShadow = true;
  toro.add(toroBase);
  addBox(toro, 0.34, 0.36, 0.34, mats.rockMat, 0, 0.62, 0);
  addBox(toro, 0.22, 0.26, 0.22, mats.shojiMat, 0, 0.94, 0, false, false);
  const toroRoof = new THREE.Mesh(track(new THREE.ConeGeometry(0.42, 0.26, 6)), mats.roofTileMat);
  toroRoof.position.y = 1.20; toroRoof.castShadow = true;
  toro.add(toroRoof);
  scene.add(toro);

  // Tufos baixos de musgo nas bordas do jardim + arvoredo de bambus além do muro
  const mossGeo = track(new THREE.IcosahedronGeometry(1, 2));
  const dummy = new THREE.Object3D();
  const borderMoss = new THREE.InstancedMesh(mossGeo, mats.mossMat, 48);
  let bm = 0;
  for (let i = 0; i < 48; i++) {
    const alongRight = i < 24;
    const x = alongRight ? hw + 0.42 + rnd() * 0.62 : -hw + rnd() * (BASIN_W + 1.0);
    const z = alongRight ? -hd + rnd() * BASIN_D : hd + 0.36 + rnd() * 0.65;
    dummy.position.set(x, -0.06, z);
    dummy.rotation.set(0, rnd() * 6.28, 0);
    dummy.scale.set(0.36 + rnd() * 0.46, 0.055 + rnd() * 0.045, 0.32 + rnd() * 0.42);
    dummy.updateMatrix();
    borderMoss.setMatrixAt(bm++, dummy.matrix);
  }
  borderMoss.receiveShadow = true;
  borderMoss.instanceMatrix.needsUpdate = true;
  scene.add(borderMoss);

  // Colmos elegantes de bambu + folhagem delicada além do muro
  const bambooStemGeo = track(new THREE.CylinderGeometry(0.036, 0.048, 4.6, 8));
  const bambooMat = track(new THREE.MeshStandardMaterial({ color: 0x5c7742, roughness: 0.46 }));
  const bambooInst = new THREE.InstancedMesh(bambooStemGeo, bambooMat, 22);
  const leafClusterGeo = track(new THREE.IcosahedronGeometry(0.42, 1));
  const leafInst = new THREE.InstancedMesh(leafClusterGeo, mats.mossMat, 44);
  for (let i = 0; i < 22; i++) {
    const isBack = i % 2 === 0;
    const x = isBack ? 3.2 + rnd() * 4.5 : hw + 1.75 + rnd() * 1.4;
    const z = isBack ? -hd - 2.0 - rnd() * 1.2 : -3.5 + rnd() * 7.5;
    const tiltA = (rnd() - 0.5) * 0.12;
    const tiltB = (rnd() - 0.5) * 0.12;
    dummy.position.set(x, 2.2, z);
    dummy.rotation.set(tiltA, rnd() * 3, tiltB);
    dummy.scale.setScalar(0.8 + rnd() * 0.45);
    dummy.updateMatrix();
    bambooInst.setMatrixAt(i, dummy.matrix);

    for (let lf = 0; lf < 2; lf++) {
      dummy.position.set(x + (rnd() - 0.5) * 0.35, 3.1 + lf * 0.75 + rnd() * 0.3, z + (rnd() - 0.5) * 0.35);
      dummy.rotation.set(rnd() * 0.5, rnd() * 6.28, rnd() * 0.5);
      dummy.scale.set(0.95, 0.34, 0.65);
      dummy.updateMatrix();
      leafInst.setMatrixAt(i * 2 + lf, dummy.matrix);
    }
  }
  bambooInst.castShadow = true;
  bambooInst.instanceMatrix.needsUpdate = true;
  leafInst.castShadow = true;
  leafInst.instanceMatrix.needsUpdate = true;
  scene.add(bambooInst, leafInst);

  // ============================================================================
  // 4. PEDRAS ESCULPIDAS SUISEKI + COLAR DE MUSGO + ANEL DE SELEÇÃO
  // ============================================================================
  const rocks = INITIAL_ROCKS.map((r) => ({ ...r }));
  const rockMeshes = [];
  const rockPickables = [];

  const selectionRingGeo = track(new THREE.RingGeometry(1.04, 1.14, 36));
  selectionRingGeo.rotateX(-Math.PI / 2);
  const selectionRingMat = track(new THREE.MeshBasicMaterial({
    color: 0xe8d9b8,
    transparent: true,
    opacity: 0.85,
    side: THREE.DoubleSide,
  }));
  const selectionRing = new THREE.Mesh(selectionRingGeo, selectionRingMat);
  selectionRing.position.y = 0.04;
  selectionRing.visible = false;
  scene.add(selectionRing);

  rocks.forEach((rk) => {
    const grp = new THREE.Group();
    grp.position.set(rk.x, 0, rk.z);
    grp.rotation.y = rk.rotY;

    const rGeo = track(createSculptedRockGeo(rk.variant, rk.r, rk.h));
    const rMesh = new THREE.Mesh(rGeo, mats.rockMat);
    rMesh.position.y = rk.h * 0.14;
    rMesh.castShadow = true;
    rMesh.receiveShadow = true;
    rMesh.userData.rockId = rk.id;
    grp.add(rMesh);

    // Colar orgânico baixo de musgo abraçando a base da pedra na areia
    const collarGeo = track(createOrganicMossCollarGeo(rk.variant));
    const collar = new THREE.Mesh(collarGeo, mats.mossMat);
    collar.scale.set(rk.mossR * 0.88, 0.85, rk.mossR * 0.82);
    collar.position.y = 0.008;
    collar.receiveShadow = true;
    grp.add(collar);

    scene.add(grp);
    rockMeshes.push(grp);
    rockPickables.push(rMesh);
  });

  function syncRockTransform(rock) {
    const grp = rockMeshes[rock.id];
    if (!grp) return;
    grp.position.set(rock.x, 0, rock.z);
    grp.rotation.y = rock.rotY;
  }

  function setSelectedRock(rockId, highlight = true) {
    if (rockId === null || rockId === undefined || !highlight) {
      selectionRing.visible = false;
      return;
    }
    const rk = rocks[rockId];
    if (!rk) { selectionRing.visible = false; return; }
    selectionRing.visible = true;
    selectionRing.position.set(rk.x, 0.042, rk.z);
    selectionRing.scale.setScalar(rk.r + 0.16);
  }

  // ============================================================================
  // 5. RASTELO DE MADEIRA HINOKI ARTICULADO (LARGURA DINÂMICA 3 / 5 / 7 DENTES)
  // ============================================================================
  const rakeGroup = new THREE.Group();
  scene.add(rakeGroup);

  // Cabo comprido inclinado naturalmente (~1.42m)
  const shaft = new THREE.Mesh(
    track(new THREE.CylinderGeometry(0.017, 0.021, 1.44, 10)),
    mats.hinokiMat
  );
  shaft.position.set(0, 0.56, 0.54);
  shaft.rotation.x = 0.80;
  shaft.castShadow = true;
  rakeGroup.add(shaft);

  // Barra transversal e suporte de dentes reconstruídos ao mudar "Largura"
  const rakeHeadGroup = new THREE.Group();
  rakeGroup.add(rakeHeadGroup);

  const toothGeo = track(new THREE.ConeGeometry(0.022, 0.11, 4));
  toothGeo.rotateX(Math.PI); // ponta voltada para baixo na areia
  let currentHeadBar = null;

  function buildRakeHead(widthKey) {
    while (rakeHeadGroup.children.length) {
      const c = rakeHeadGroup.children.pop();
      if (c.geometry && c.geometry !== toothGeo) c.geometry.dispose();
    }
    const spec = RAKE_WIDTHS[widthKey] || RAKE_WIDTHS.medio;
    const barGeo = new THREE.BoxGeometry(spec.headWidth, 0.055, 0.058);
    currentHeadBar = new THREE.Mesh(barGeo, mats.hinokiMat);
    currentHeadBar.position.y = 0.11;
    currentHeadBar.castShadow = true;
    rakeHeadGroup.add(currentHeadBar);

    const peg = new THREE.Mesh(new THREE.BoxGeometry(0.045, 0.075, 0.075), mats.brassMat);
    peg.position.y = 0.11;
    rakeHeadGroup.add(peg);

    const startX = -((spec.tines - 1) * spec.spacing) * 0.5;
    for (let t = 0; t < spec.tines; t++) {
      const tooth = new THREE.Mesh(toothGeo, mats.darkCedarMat);
      tooth.position.set(startX + t * spec.spacing, 0.042, 0);
      tooth.castShadow = true;
      rakeHeadGroup.add(tooth);
    }
  }
  buildRakeHead('medio');

  const rakePose = {
    x: 0.4,
    z: 1.55,
    yaw: 0.15,
    y: 0.015,
    targetX: 0.4,
    targetZ: 1.55,
    targetYaw: 0.15,
    activeDrag: false,
  };
  rakeGroup.position.set(rakePose.x, rakePose.y, rakePose.z);
  rakeGroup.rotation.y = rakePose.yaw;

  // ============================================================================
  // 6. ILUMINAÇÃO SOLAR RASANTE DE ALTO CONTRASTE + POEIRA MINERAL SUTIL
  // ============================================================================
  const hemi = new THREE.HemisphereLight(0xdfe8f0, 0x8d826e, 0.72);
  scene.add(hemi);

  const sun = new THREE.DirectionalLight(0xfff1d6, 2.35);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.camera.near = 1;
  sun.shadow.camera.far = 42;
  sun.shadow.camera.left = -13.0;
  sun.shadow.camera.right = 13.0;
  sun.shadow.camera.top = 11.0;
  sun.shadow.camera.bottom = -11.0;
  sun.shadow.bias = -0.0003;
  sun.shadow.normalBias = 0.016; // preserva micro-sombras nas cristas de 3cm da areia!
  scene.add(sun, sun.target);
  sun.target.position.set(0, 0, -0.4);

  const lanternPt = new THREE.PointLight(0xffcb82, 1.35, 7.5, 1.8);
  lanternPt.position.set(hw + 0.65, 0.96, -hd - 0.65);
  scene.add(lanternPt);

  // Grãos sutis suspensos levantados pelo rastelo (limitado e respeitando Movimento Reduzido)
  const MAX_DUST = 80;
  const dustPos = new Float32Array(MAX_DUST * 3);
  const dustVel = new Float32Array(MAX_DUST * 3);
  const dustLife = new Float32Array(MAX_DUST);
  const dustGeo = track(new THREE.BufferGeometry());
  dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3).setUsage(THREE.DynamicDrawUsage));
  const dustMat = track(new THREE.PointsMaterial({
    color: 0xe6dfd0,
    size: 0.04,
    transparent: true,
    opacity: 0.45,
    depthWrite: false,
  }));
  const dustPts = new THREE.Points(dustGeo, dustMat);
  dustPts.frustumCulled = false;
  scene.add(dustPts);
  let dustCursor = 0;

  function emitSandGrains(x, z, speed) {
    if (speed < 0.35) return;
    const spawnCount = Math.min(3, Math.ceil(speed * 0.8));
    for (let s = 0; s < spawnCount; s++) {
      const i = dustCursor % MAX_DUST;
      dustCursor++;
      dustPos[i * 3] = x + (rnd() - 0.5) * 0.45;
      dustPos[i * 3 + 1] = 0.04 + rnd() * 0.05;
      dustPos[i * 3 + 2] = z + (rnd() - 0.5) * 0.45;
      dustVel[i * 3] = (rnd() - 0.5) * 0.35;
      dustVel[i * 3 + 1] = 0.18 + rnd() * 0.25;
      dustVel[i * 3 + 2] = (rnd() - 0.5) * 0.35;
      dustLife[i] = 0.55 + rnd() * 0.35;
    }
  }

  function updateSunLighting(sunAngle01) {
    // Ângulo rasante (manhã baixa -> tarde suave -> dourado rasante oposto)
    const az = -1.15 + sunAngle01 * 2.25;
    const el = 0.28 + Math.sin(sunAngle01 * Math.PI) * 0.34;
    const dist = 16;
    sun.position.set(
      Math.cos(az) * Math.cos(el) * dist,
      Math.sin(el) * dist,
      Math.sin(az) * Math.cos(el) * dist
    );
    const warmness = Math.abs(sunAngle01 - 0.5) * 2.0;
    sun.color.setRGB(1.0, 0.95 - warmness * 0.09, 0.86 - warmness * 0.18);
    sun.intensity = 2.15 + (1 - warmness) * 0.45;
    lanternPt.intensity = 0.9 + warmness * 1.4;
  }

  function stepAnimation(dt, state) {
    // Interpolação suave da posição do rastelo (repousa suavemente elevado quando fora de uso)
    const damp = state.reducedMotion ? 1.0 : Math.min(1, dt * 16);
    rakePose.x += (rakePose.targetX - rakePose.x) * damp;
    rakePose.z += (rakePose.targetZ - rakePose.z) * damp;

    // Caminho mais curto angular
    let dYaw = rakePose.targetYaw - rakePose.yaw;
    while (dYaw > Math.PI) dYaw -= Math.PI * 2;
    while (dYaw < -Math.PI) dYaw += Math.PI * 2;
    rakePose.yaw += dYaw * damp;

    const restLift = state.tool === 'rastelo' ? (rakePose.activeDrag ? -0.012 : 0.045) : 0.11;
    rakePose.y += (restLift - rakePose.y) * damp;

    rakeGroup.position.set(rakePose.x, rakePose.y, rakePose.z);
    rakeGroup.rotation.y = rakePose.yaw;
    rakeGroup.visible = state.tool === 'rastelo' || !rakePose.activeDrag;

    // Poeira sutil dos grãos
    let activeDust = false;
    for (let i = 0; i < MAX_DUST; i++) {
      if (dustLife[i] <= 0) {
        dustPos[i * 3 + 1] = -5;
        continue;
      }
      activeDust = true;
      dustLife[i] -= dt;
      dustPos[i * 3] += dustVel[i * 3] * dt;
      dustPos[i * 3 + 1] += dustVel[i * 3 + 1] * dt;
      dustPos[i * 3 + 2] += dustVel[i * 3 + 2] * dt;
      dustVel[i * 3 + 1] -= 0.72 * dt; // gravidade nos grãos
    }
    if (activeDust) dustGeo.attributes.position.needsUpdate = true;

    // Balanço sutil dos bambus com a brisa (desligado em Movimento Reduzido)
    bambooInst.rotation.z = state.reducedMotion ? 0 : Math.sin(state.simTime * 0.9) * 0.012;
  }

  function applyQuality(profile) {
    sun.castShadow = profile.shadows;
    if (sun.shadow.mapSize.width !== profile.shadowMap) {
      sun.shadow.mapSize.set(profile.shadowMap, profile.shadowMap);
      if (sun.shadow.map) { sun.shadow.map.dispose(); sun.shadow.map = null; }
    }
    dustGeo.setDrawRange(0, Math.min(MAX_DUST, profile.dustCount));
  }

  return {
    rocks,
    rockPickables,
    rakePose,
    buildRakeHead,
    syncRockTransform,
    setSelectedRock,
    emitSandGrains,
    updateSunLighting,
    stepAnimation,
    applyQuality,
    dispose() {
      disposables.forEach((g) => g.dispose());
      if (currentHeadBar && currentHeadBar.geometry) currentHeadBar.geometry.dispose();
    },
  };
}
