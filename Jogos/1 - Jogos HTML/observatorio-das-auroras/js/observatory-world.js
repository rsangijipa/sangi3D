/**
 * js/observatory-world.js
 * Cenário realista do Observatório das Auroras:
 *  - Terreno nevado esculpido e cadeia de picos alpinos ao norte
 *  - Cabana nórdica em madeira e vidro panorâmico inclinado, varanda, lareira e telescópio
 *  - Pinheiros nevados instanciados e neve soprada pelo vento (passo fixo)
 *  - Cúpula celeste + estrelas + 3 cortinas GLSL de Aurora Boreal presas ao infinito (T03)
 */
import * as THREE from 'three';
import { AURORA_PATTERNS, QUALITY_PROFILES, mulberry32 } from './state.js';
import {
  createAuroraCurtainMaterial,
  createNightSkyMaterial,
  createStarfieldMaterial,
} from './shaders.js';

function createTerrainHeight(x, z) {
  const r = Math.hypot(x, z);
  // Platô nivelado sob a cabana e varanda (r < 7.5m)
  if (r < 7.2) return 0;

  const tPlateau = Math.min(1, (r - 7.2) / 14.0);
  // Leve vale descendente à frente (-Z) antes dos picos ao longe
  const valleyDip = -Math.exp(-Math.pow((z + 24) / 16, 2)) * 2.2 * tPlateau;
  const rolling =
    (Math.sin(x * 0.08) * Math.cos(z * 0.07) * 1.4 +
      Math.sin(x * 0.19 - z * 0.15) * 0.45) *
    tPlateau;

  // Cadeia alpina recortada ao norte (-Z) e flancos (picos com cristas agudas)
  let ridge = 0;
  if (r > 36) {
    const m = Math.min(1, (r - 36) / 24);
    const ang = Math.atan2(z, x);
    const northWeight = 0.52 + 0.58 * Math.max(0, -Math.sin(ang));
    const r1 = 1.0 - Math.abs(Math.sin(x * 0.075 + z * 0.035));
    const r2 = 1.0 - Math.abs(Math.sin(x * 0.14 - z * 0.12 + 1.1));
    const r3 = 1.0 - Math.abs(Math.cos(ang * 7.0 + 0.4));
    const crag = r1 * r1 * 12.5 + r2 * r2 * 6.2 + r3 * 4.5;
    ridge = m * m * northWeight * (4.2 + crag);
  }

  return valleyDip + rolling + ridge;
}

function createAuroraRibbonGeometry(radius, height, arcSpan, segX = 120, segY = 26) {
  const geo = new THREE.PlaneGeometry(1, 1, segX, segY);
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const u = pos.getX(i) + 0.5; // 0..1 ao longo da faixa
    const v = pos.getY(i) + 0.5; // 0..1 altura da cortina
    const theta = -Math.PI * 0.5 + (u - 0.5) * arcSpan;
    const rad = radius + Math.sin(u * Math.PI * 3.0) * 5.5;
    const x = Math.cos(theta) * rad;
    const z = Math.sin(theta) * rad;
    const y = 11.0 + v * height + Math.sin(u * Math.PI * 2.0) * 2.2;
    pos.setXYZ(i, x, y, z);
  }
  geo.computeVertexNormals();
  return geo;
}

export function buildObservatoryWorld(scene, mats, seed = 5408) {
  const rnd = mulberry32(seed);
  const disposables = [];
  const track = (g) => (disposables.push(g), g);

  const boxGeo = track(new THREE.BoxGeometry(1, 1, 1));
  function addBox(parent, w, h, d, mat, x, y, z, cast = true, receive = true) {
    const m = new THREE.Mesh(boxGeo, mat);
    m.scale.set(w, h, d);
    m.position.set(x, y, z);
    m.castShadow = cast;
    m.receiveShadow = receive;
    parent.add(m);
    return m;
  }

  // ============================================================================
  // 1. CÚPULA CELESTE, ESTRELAS & CORTINAS DE AURORA (INDEPENDENTES DA CÂMERA - T03)
  // ============================================================================
  const skyGroup = new THREE.Group();
  scene.add(skyGroup);

  const skyMat = createNightSkyMaterial();
  const skyDome = new THREE.Mesh(track(new THREE.SphereGeometry(128, 48, 32)), skyMat);
  skyDome.renderOrder = -10;
  skyDome.frustumCulled = false;
  skyGroup.add(skyDome);

  // Lua fria ártica no quadrante sul-leste alto (motiva a luz direcional lunar)
  const moonMat = track(
    new THREE.MeshBasicMaterial({
      color: 0xe9f2ff,
      depthWrite: false,
      fog: false,
    })
  );
  const moonMesh = new THREE.Mesh(track(new THREE.CircleGeometry(2.6, 32)), moonMat);
  moonMesh.position.set(42, 54, 72);
  moonMesh.lookAt(0, 0, 0);
  moonMesh.renderOrder = -9;
  skyGroup.add(moonMesh);

  // Campo de estrelas instanciado por atributos na cúpula infinita
  const STAR_COUNT = 1800;
  const starGeo = track(new THREE.BufferGeometry());
  const starPos = new Float32Array(STAR_COUNT * 3);
  const starSizes = new Float32Array(STAR_COUNT);
  const starPhases = new Float32Array(STAR_COUNT);
  const starColors = new Float32Array(STAR_COUNT * 3);
  const cTmp = new THREE.Color();

  for (let i = 0; i < STAR_COUNT; i++) {
    const u = rnd();
    const v = rnd();
    const theta = u * Math.PI * 2;
    const phi = Math.acos(Math.max(0.03, v)); // hemisfério celeste superior
    const r = 108 + rnd() * 8;
    starPos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    starPos[i * 3 + 1] = r * Math.cos(phi);
    starPos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
    starSizes[i] = 1.2 + Math.pow(rnd(), 3.2) * 3.6;
    starPhases[i] = rnd();

    // Temperatura Planckiana sutil (azul-branco O/B, branco A, dourado suave K)
    const temp = rnd();
    if (temp < 0.35) cTmp.setRGB(0.76, 0.86, 1.0);
    else if (temp < 0.78) cTmp.setRGB(0.96, 0.97, 1.0);
    else cTmp.setRGB(1.0, 0.88, 0.74);
    starColors[i * 3] = cTmp.r;
    starColors[i * 3 + 1] = cTmp.g;
    starColors[i * 3 + 2] = cTmp.b;
  }
  starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
  starGeo.setAttribute('aSize', new THREE.BufferAttribute(starSizes, 1));
  starGeo.setAttribute('aPhase', new THREE.BufferAttribute(starPhases, 1));
  starGeo.setAttribute('aColor', new THREE.BufferAttribute(starColors, 3));
  const starMat = createStarfieldMaterial();
  const starPoints = new THREE.Points(starGeo, starMat);
  starPoints.renderOrder = -9;
  starPoints.frustumCulled = false;
  skyGroup.add(starPoints);

  // 3 cortinas sobrepostas de Aurora Boreal em arcos distintos atrás dos picos
  const auroraSpecs = [
    { radius: 84, height: 34, arcSpan: Math.PI * 0.86, seed: 0.0 },
    { radius: 91, height: 38, arcSpan: Math.PI * 0.96, seed: 1.7 },
    { radius: 97, height: 30, arcSpan: Math.PI * 0.74, seed: 3.4 },
  ];
  const auroraLayers = auroraSpecs.map((sp) => {
    const geo = track(createAuroraRibbonGeometry(sp.radius, sp.height, sp.arcSpan));
    const mat = createAuroraCurtainMaterial(sp.seed);
    const mesh = new THREE.Mesh(geo, mat);
    mesh.renderOrder = -8;
    mesh.frustumCulled = false;
    skyGroup.add(mesh);
    return { mesh, mat };
  });

  // ============================================================================
  // 2. TERRENO NEVADO & MONTANHAS ALPINAS AO NORTE
  // ============================================================================
  const terrainGeo = track(new THREE.PlaneGeometry(156, 156, 112, 112));
  terrainGeo.rotateX(-Math.PI / 2);
  const tPos = terrainGeo.attributes.position;
  const tCols = new Float32Array(tPos.count * 3);

  for (let i = 0; i < tPos.count; i++) {
    const x = tPos.getX(i);
    const z = tPos.getZ(i);
    const y = createTerrainHeight(x, z);
    tPos.setY(i, y);
  }
  terrainGeo.computeVertexNormals();
  const tNorm = terrainGeo.attributes.normal;

  for (let i = 0; i < tPos.count; i++) {
    const y = tPos.getY(i);
    const ny = tNorm.getY(i);
    // Encostas íngremes expõem granito escuro; topos/planícies acumulam neve limpa
    const snowCover = THREE.MathUtils.smoothstep(ny, 0.54, 0.84);
    const altTint = THREE.MathUtils.clamp(y / 22, 0, 1) * 0.14;
    const rockR = 0.22;
    const rockG = 0.26;
    const rockB = 0.34;
    const snowR = 0.82 + altTint;
    const snowG = 0.88 + altTint;
    const snowB = 0.95 + altTint * 0.4;

    tCols[i * 3] = rockR + (snowR - rockR) * snowCover;
    tCols[i * 3 + 1] = rockG + (snowG - rockG) * snowCover;
    tCols[i * 3 + 2] = rockB + (snowB - rockB) * snowCover;
  }
  terrainGeo.setAttribute('color', new THREE.BufferAttribute(tCols, 3));

  const terrainMesh = new THREE.Mesh(terrainGeo, mats.snowMat);
  terrainMesh.receiveShadow = true;
  scene.add(terrainMesh);

  // ============================================================================
  // 3. CABANA OBSERVATÓRIO PANORÂMICA COM VARANDA, LAREIRA & TELESCÓPIO
  // ============================================================================
  const cabin = new THREE.Group();
  scene.add(cabin);

  // Pilares de fundação fincados na neve
  const pierCoords = [
    [-4.8, 3.1], [-2.5, 3.1], [0.0, 3.1], [2.6, 3.1],
    [-4.8, -2.5], [-2.5, -2.5], [0.0, -2.5], [2.6, -2.5],
  ];
  pierCoords.forEach(([px, pz]) => {
    addBox(cabin, 0.32, 0.6, 0.32, mats.rockMat, px, -0.05, pz, false, true);
  });

  // Deck contínuo da varanda (-X e frente) + piso interno da cabana
  // Deck total: x [-5.0 .. +2.8], z [-2.7 .. +3.3]
  for (let iz = -2.6; iz <= 3.2; iz += 0.28) {
    addBox(cabin, 7.8, 0.08, 0.25, mats.pineMat, -1.1, 0.22, iz, true, true);
  }
  // Degraus da varanda no canto esquerdo
  addBox(cabin, 1.5, 0.14, 0.42, mats.pineMat, -4.1, 0.10, 3.55, true, true);
  addBox(cabin, 1.5, 0.12, 0.42, mats.darkTimberMat, -4.1, 0.01, 3.96, false, true);

  // Balaustrada da varanda (borda oeste e trecho frontal esquerdo)
  const railPosts = [
    [-4.92, -2.6], [-4.92, -0.8], [-4.92, 1.0], [-4.92, 3.18],
    [-3.1, 3.18], [-2.2, 3.18], [0.2, 3.18], [2.68, 3.18],
  ];
  railPosts.forEach(([rx, rz]) => {
    addBox(cabin, 0.11, 0.96, 0.11, mats.darkTimberMat, rx, 0.72, rz);
  });
  addBox(cabin, 0.12, 0.08, 5.9, mats.pineMat, -4.92, 1.18, 0.28);
  addBox(cabin, 1.6, 0.08, 0.12, mats.pineMat, -4.1, 1.18, 3.18);
  addBox(cabin, 4.9, 0.08, 0.12, mats.pineMat, 0.22, 1.18, 3.18);

  // Acúmulo sutil de neve no corrimão oeste
  addBox(cabin, 0.11, 0.04, 5.75, mats.snowPlainMat, -4.92, 1.24, 0.28, false, true);

  // Lanterna de latão acesa no poste da varanda (ponto focal próximo)
  addBox(cabin, 0.18, 0.05, 0.18, mats.ironMat, -3.1, 1.24, 3.18, true, false);
  addBox(cabin, 0.12, 0.22, 0.12, mats.emberMat, -3.1, 1.37, 3.18, false, false);
  addBox(cabin, 0.20, 0.04, 0.20, mats.ironMat, -3.1, 1.50, 3.18, true, false);

  // Estrutura fechada da Cabana Observatório: x [-2.3 .. +2.6] (4.9m), z [-2.4 .. +2.2] (4.6m)
  // Parede traseira (+Z = 2.2) com janela emoldurada voltada para a varanda sul + mureta frontal (-Z = -2.4)
  addBox(cabin, 5.0, 0.85, 0.18, mats.darkTimberMat, 0.15, 0.66, 2.22);
  addBox(cabin, 5.0, 0.42, 0.18, mats.darkTimberMat, 0.15, 2.52, 2.22);
  addBox(cabin, 1.65, 1.45, 0.18, mats.darkTimberMat, -1.5, 1.80, 2.22);
  addBox(cabin, 1.75, 1.45, 0.18, mats.darkTimberMat, 1.75, 1.80, 2.22);
  const southWindow = new THREE.Mesh(track(new THREE.PlaneGeometry(1.60, 1.22)), mats.glassMat);
  southWindow.position.set(0.12, 1.72, 2.22);
  cabin.add(southWindow);

  addBox(cabin, 5.0, 0.68, 0.16, mats.darkTimberMat, 0.15, 0.58, -2.40);
  addBox(cabin, 0.16, 0.68, 4.70, mats.darkTimberMat, -2.32, 0.58, -0.09);
  addBox(cabin, 0.16, 0.68, 4.70, mats.darkTimberMat, 2.62, 0.58, -0.09);

  // Pilares principais nivelados exatamente sob o beiral inclinado do teto de vidro
  [-2.32, -0.65, 0.98, 2.62].forEach((mx) => {
    addBox(cabin, 0.12, 2.12, 0.12, mats.darkTimberMat, mx, 1.94, -2.40);
    addBox(cabin, 0.12, 2.24, 0.12, mats.darkTimberMat, mx, 1.56, 2.20);
  });
  addBox(cabin, 5.15, 0.14, 0.14, mats.darkTimberMat, 0.15, 3.06, -2.40);
  addBox(cabin, 5.15, 0.14, 0.14, mats.darkTimberMat, 0.15, 2.74, 2.20);

  // Caibros inclinados do teto panorâmico de vidro
  [-2.32, -1.1, 0.15, 1.4, 2.62].forEach((rx) => {
    const beam = addBox(cabin, 0.10, 0.12, 4.95, mats.darkTimberMat, rx, 2.93, -0.10, true, false);
    beam.rotation.x = 0.07;
  });

  // Painéis de vidro panorâmico (frente norte, laterais e claraboia do teto)
  const frontGlass = new THREE.Mesh(track(new THREE.PlaneGeometry(4.82, 2.10)), mats.glassMat);
  frontGlass.position.set(0.15, 1.97, -2.39);
  cabin.add(frontGlass);

  const westGlass = new THREE.Mesh(track(new THREE.PlaneGeometry(4.52, 1.95)), mats.glassMat);
  westGlass.rotation.y = Math.PI / 2;
  westGlass.position.set(-2.31, 1.92, -0.10);
  cabin.add(westGlass);

  const eastGlass = new THREE.Mesh(track(new THREE.PlaneGeometry(4.52, 1.95)), mats.glassMat);
  eastGlass.rotation.y = Math.PI / 2;
  eastGlass.position.set(2.61, 1.92, -0.10);
  cabin.add(eastGlass);

  const roofGlass = new THREE.Mesh(track(new THREE.PlaneGeometry(4.88, 4.65)), mats.glassMat);
  roofGlass.rotation.x = Math.PI / 2 - 0.07;
  roofGlass.position.set(0.15, 2.91, -0.10);
  cabin.add(roofGlass);

  // Detalhes internos: tapete, banco de madeira, lareira aconchegante e telescópio
  addBox(cabin, 2.5, 0.025, 1.8, mats.rugMat, 0.1, 0.27, 0.1, false, true);
  // Banco de observação voltado para o norte
  addBox(cabin, 1.9, 0.07, 0.48, mats.pineMat, -0.45, 0.66, -1.35);
  addBox(cabin, 0.09, 0.38, 0.42, mats.darkTimberMat, -1.25, 0.45, -1.35);
  addBox(cabin, 0.09, 0.38, 0.42, mats.darkTimberMat, 0.35, 0.45, -1.35);

  // Lareira / fogão nórdico em ferro fundido no canto traseiro direito
  const stoveX = 1.85;
  const stoveZ = 1.48;
  addBox(cabin, 0.72, 0.78, 0.64, mats.ironMat, stoveX, 0.66, stoveZ);
  addBox(cabin, 0.34, 0.24, 0.12, mats.emberMat, stoveX, 0.62, stoveZ - 0.29, false, false);
  const flue = new THREE.Mesh(track(new THREE.CylinderGeometry(0.11, 0.11, 2.9, 12)), mats.ironMat);
  flue.position.set(stoveX, 2.35, stoveZ);
  flue.castShadow = true;
  cabin.add(flue);

  // Telescópio refrator sobre tripé apontando para a aurora ao norte
  const scopeGroup = new THREE.Group();
  scopeGroup.position.set(1.25, 0.26, -1.30);
  for (let l = 0; l < 3; l++) {
    const legAng = (l * Math.PI * 2) / 3 + 0.3;
    const leg = addBox(scopeGroup, 0.045, 1.18, 0.045, mats.darkTimberMat, Math.cos(legAng) * 0.22, 0.54, Math.sin(legAng) * 0.22);
    leg.rotation.z = Math.cos(legAng) * 0.24;
    leg.rotation.x = -Math.sin(legAng) * 0.24;
  }
  const tube = new THREE.Mesh(track(new THREE.CylinderGeometry(0.06, 0.085, 1.05, 14)), mats.ironMat);
  tube.position.set(0, 1.24, -0.05);
  tube.rotation.x = Math.PI * 0.30;
  tube.castShadow = true;
  scopeGroup.add(tube);
  cabin.add(scopeGroup);

  // ============================================================================
  // 4. PINHEIROS ÁRTICOS NEVADOS EM CAMADAS (INSTANCED MESH) & NEVE SOPRADA
  // ============================================================================
  const TREE_COUNT = 54;
  const trunkGeo = track(new THREE.CylinderGeometry(0.10, 0.16, 1.1, 6));
  const lowConeGeo = track(new THREE.ConeGeometry(1.15, 2.2, 7));
  const highConeGeo = track(new THREE.ConeGeometry(0.84, 1.9, 7));
  const capGeo = track(new THREE.ConeGeometry(0.62, 1.15, 7));

  const trunkInst = new THREE.InstancedMesh(trunkGeo, mats.darkTimberMat, TREE_COUNT);
  const spruceLowInst = new THREE.InstancedMesh(lowConeGeo, mats.spruceMat, TREE_COUNT);
  const spruceHighInst = new THREE.InstancedMesh(highConeGeo, mats.spruceMat, TREE_COUNT);
  const snowCapInst = new THREE.InstancedMesh(capGeo, mats.snowPlainMat, TREE_COUNT);
  const dummy = new THREE.Object3D();

  let placed = 0;
  let guard = 0;
  while (placed < TREE_COUNT && guard < 400) {
    guard++;
    const x = (rnd() - 0.5) * 86;
    const z = -6 - rnd() * 44;
    if (Math.abs(x) < 8.5 && z > -26) continue;
    const y = createTerrainHeight(x, z) - 0.18;
    const sc = 0.85 + rnd() * 1.10;
    const yaw = rnd() * 6.28;

    dummy.position.set(x, y + 0.55 * sc, z);
    dummy.rotation.set(0, yaw, 0);
    dummy.scale.setScalar(sc);
    dummy.updateMatrix();
    trunkInst.setMatrixAt(placed, dummy.matrix);

    dummy.position.set(x, y + 1.55 * sc, z);
    dummy.rotation.set(0, yaw, (rnd() - 0.5) * 0.04);
    dummy.scale.set(sc, sc, sc);
    dummy.updateMatrix();
    spruceLowInst.setMatrixAt(placed, dummy.matrix);

    dummy.position.set(x, y + 2.55 * sc, z);
    dummy.scale.set(sc, sc, sc);
    dummy.updateMatrix();
    spruceHighInst.setMatrixAt(placed, dummy.matrix);

    dummy.position.set(x, y + 3.05 * sc, z);
    dummy.scale.set(sc * 0.96, sc * 0.85, sc * 0.96);
    dummy.updateMatrix();
    snowCapInst.setMatrixAt(placed, dummy.matrix);
    placed++;
  }
  [trunkInst, spruceLowInst, spruceHighInst, snowCapInst].forEach((inst) => {
    inst.count = placed;
    inst.castShadow = true;
    inst.receiveShadow = true;
    inst.instanceMatrix.needsUpdate = true;
  });
  scene.add(trunkInst, spruceLowInst, spruceHighInst, snowCapInst);

  // Flocos de neve esparsos integrados no timestep fixo
  const MAX_SNOW = 160;
  const snowPos = new Float32Array(MAX_SNOW * 3);
  const snowSeed = new Float32Array(MAX_SNOW);
  for (let i = 0; i < MAX_SNOW; i++) {
    snowPos[i * 3] = (rnd() - 0.5) * 28;
    snowPos[i * 3 + 1] = 0.4 + rnd() * 11;
    snowPos[i * 3 + 2] = (rnd() - 0.5) * 28;
    snowSeed[i] = rnd() * 6.28;
  }
  const snowGeo = track(new THREE.BufferGeometry());
  snowGeo.setAttribute('position', new THREE.BufferAttribute(snowPos, 3).setUsage(THREE.DynamicDrawUsage));
  const snowPtMat = track(
    new THREE.PointsMaterial({
      color: 0xeaf3ff,
      size: 0.075,
      transparent: true,
      opacity: 0.72,
      depthWrite: false,
    })
  );
  const snowPts = new THREE.Points(snowGeo, snowPtMat);
  snowPts.frustumCulled = false;
  scene.add(snowPts);

  // ============================================================================
  // 5. ILUMINAÇÃO LUNAR, BOUNCE DA AURORA & LAREIRA INTERNA
  // ============================================================================
  const hemi = new THREE.HemisphereLight(0x2d4d70, 0x1a2233, 0.72);
  scene.add(hemi);

  const moonLight = new THREE.DirectionalLight(0xc2dcff, 1.35);
  moonLight.position.set(16, 22, 26);
  moonLight.castShadow = true;
  moonLight.shadow.mapSize.set(2048, 2048);
  moonLight.shadow.camera.near = 2;
  moonLight.shadow.camera.far = 75;
  moonLight.shadow.camera.left = -22;
  moonLight.shadow.camera.right = 22;
  moonLight.shadow.camera.top = 18;
  moonLight.shadow.camera.bottom = -18;
  moonLight.shadow.bias = -0.0005;
  moonLight.shadow.normalBias = 0.02;
  scene.add(moonLight);

  // Brilho aconchegante da lareira interna + lanterna da varanda
  const hearthLight = new THREE.PointLight(0xff9644, 3.8, 9.5, 1.5);
  hearthLight.position.set(1.25, 1.35, 0.95);
  scene.add(hearthLight);

  const porchLight = new THREE.PointLight(0xffb45c, 1.45, 7.2, 1.8);
  porchLight.position.set(-3.1, 1.45, 3.18);
  scene.add(porchLight);

  function updateAtmosphereUniforms(state) {
    const pattern = AURORA_PATTERNS[state.auroraPattern] || AURORA_PATTERNS.crown;
    const motionScale = state.reducedMotion ? 0.08 : 1.0;

    skyMat.uniforms.uHour.value = state.hourNorm;
    skyMat.uniforms.uIntensity.value = state.intensity;
    skyMat.uniforms.uSimTime.value = state.simTime;

    starMat.uniforms.uSimTime.value = state.simTime;
    starMat.uniforms.uMotionScale.value = state.reducedMotion ? 0.05 : 1.0;
    // Estrelas atenuam suavemente apenas nos extremos do crepúsculo/alvorada
    const nightWeight = 1.0 - Math.max(0, 1 - state.hourNorm / 0.25) * 0.45 - Math.max(0, (state.hourNorm - 0.78) / 0.22) * 0.45;
    const qProf = QUALITY_PROFILES[state.qualityMode === 'auto' ? state.resolvedQuality : state.qualityMode] || QUALITY_PROFILES.high;
    starMat.uniforms.uVisibility.value = Math.max(0.25, nightWeight) * qProf.starAlpha;

    // T01: intensity == 0 oculta/zera emissão nas cortinas e no bounce sobre a neve
    auroraLayers.forEach(({ mesh, mat }, idx) => {
      mesh.visible = state.intensity > 0.002;
      mat.uniforms.uSimTime.value = state.simTime;
      mat.uniforms.uPhase.value = state.curtainPhase;
      mat.uniforms.uIntensity.value = state.intensity;
      mat.uniforms.uWaveAmp.value = pattern.waveAmp * (1 + idx * 0.14);
      mat.uniforms.uWaveFreq.value = pattern.waveFreq;
      mat.uniforms.uVioletMix.value = pattern.violetMix;
      mat.uniforms.uMotionScale.value = motionScale;
    });

    // Reflexo esmeralda/violeta sutil das auroras na neve e neblina
    const aInt = Math.max(0, Math.min(1, state.intensity));
    hemi.color.setRGB(
      0.16 + aInt * 0.08 * pattern.violetMix,
      0.24 + aInt * 0.36,
      0.38 + aInt * 0.22
    );
    hemi.intensity = 0.58 + aInt * 0.42 + (1 - Math.abs(state.hourNorm - 0.5) * 2) * 0.05;

    // Luz lunar suave ajustada à hora da noite
    const twilightBoost = Math.abs(state.hourNorm - 0.5) * 2;
    moonLight.intensity = 1.15 + twilightBoost * 0.45;
    if (scene.fog) {
      scene.fog.color.setRGB(
        0.045 + twilightBoost * 0.08 + aInt * 0.02,
        0.075 + twilightBoost * 0.07 + aInt * 0.06,
        0.135 + twilightBoost * 0.10 + aInt * 0.04
      );
    }
  }

  /** Passo fixo determinístico (1/60s): vento, cintilação de lareira e partículas de neve. */
  function stepPhysics(fixedDt, state) {
    const motionFactor = state.reducedMotion ? 0.08 : 1.0;
    state.simTime += fixedDt;
    state.curtainPhase += fixedDt * 0.92 * motionFactor;
    state.gustSpeed = 0.35 + Math.sin(state.simTime * 0.28 * motionFactor) * 0.22;

    // Tremular orgânico mínimo da lareira interna (estável em reducedMotion)
    const flicker = state.reducedMotion
      ? 0
      : Math.sin(state.simTime * 9.3) * 0.18 + Math.cos(state.simTime * 15.7) * 0.10;
    hearthLight.intensity = 3.7 + flicker;

    // Deriva física da neve (sem dependência de FPS variável)
    if (!state.reducedMotion) {
      const windX = (0.55 + state.gustSpeed * 1.4) * fixedDt;
      const fallY = 1.15 * fixedDt;
      for (let i = 0; i < MAX_SNOW; i++) {
        snowPos[i * 3] += windX + Math.sin(state.simTime * 1.4 + snowSeed[i]) * 0.22 * fixedDt;
        snowPos[i * 3 + 1] -= fallY;
        snowPos[i * 3 + 2] += Math.cos(state.simTime * 1.1 + snowSeed[i]) * 0.18 * fixedDt;
        if (snowPos[i * 3 + 1] < 0.1) snowPos[i * 3 + 1] = 11.0;
        if (snowPos[i * 3] > 14.0) snowPos[i * 3] = -14.0;
      }
      snowGeo.attributes.position.needsUpdate = true;
    }
  }

  function applyQuality(profile) {
    moonLight.castShadow = profile.shadows;
    if (moonLight.shadow.mapSize.width !== profile.shadowMap) {
      moonLight.shadow.mapSize.set(profile.shadowMap, profile.shadowMap);
      if (moonLight.shadow.map) {
        moonLight.shadow.map.dispose();
        moonLight.shadow.map = null;
      }
    }
    snowGeo.setDrawRange(0, Math.min(MAX_SNOW, profile.snowCount));
  }

  function syncSkyToCamera(camera) {
    // T03: a cúpula celeste e as auroras mantêm posição centrada na câmera para simular infinito
    skyGroup.position.copy(camera.position);
  }

  return {
    skyGroup,
    skyDome,
    starPoints,
    auroraLayers,
    terrainMesh,
    cabin,
    updateAtmosphereUniforms,
    stepPhysics,
    applyQuality,
    syncSkyToCamera,
    dispose() {
      disposables.forEach((g) => g.dispose());
      skyMat.dispose();
      starMat.dispose();
      auroraLayers.forEach(({ mat }) => mat.dispose());
    },
  };
}
