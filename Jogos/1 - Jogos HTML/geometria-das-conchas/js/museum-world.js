/**
 * js/museum-world.js
 * Ambiente museológico tridimensional de história natural marinha:
 *  - Bancada de madeira nobre escura com veios naturais e molduras de latão envelhecido
 *  - 4 estações de trabalho especializadas:
 *      1. Bancada de Morfologia (bandeja de ardósia, leito de areia mineral e fragmentos fósseis)
 *      2. Estação de Anatomia (feltro de veludo escuro e suportes de exposição)
 *      3. Laboratório de Microscopia & Medições (paquímetro de latão, balança digital e microscópio)
 *      4. Estúdio Fotográfico (luminária articulada 3D, refletores e controles de luz)
 *  - Tanque hidrostático experimental de flutuabilidade em acrílico com água 3D
 *  - Luminária articulada com braços de latão e foco ajustável
 *  - Partículas de poeira luminosa em suspensão no feixe de luz
 */
import * as THREE from 'three';
import { mulberry32, LIGHT_PRESETS } from './state.js';

export function buildMuseumWorld(scene, mats, seed = 2509) {
  const rnd = mulberry32(seed);
  const disposables = [];
  const track = (g) => (disposables.push(g), g);

  const worldGroup = new THREE.Group();
  scene.add(worldGroup);

  const boxGeo = track(new THREE.BoxGeometry(1, 1, 1));
  const cylGeo = track(new THREE.CylinderGeometry(1, 1, 1, 24));

  function addBox(parent, w, h, d, mat, x, y, z, cast = true, receive = true) {
    const m = new THREE.Mesh(boxGeo, mat);
    m.scale.set(w, h, d);
    m.position.set(x, y, z);
    m.castShadow = cast;
    m.receiveShadow = receive;
    parent.add(m);
    return m;
  }

  function addCyl(parent, rt, rb, h, mat, x, y, z, cast = true, receive = true) {
    const m = new THREE.Mesh(cylGeo, mat);
    m.scale.set(rt, h, rb);
    m.position.set(x, y, z);
    m.castShadow = cast;
    m.receiveShadow = receive;
    parent.add(m);
    return m;
  }

  // ==========================================================================
  // 1. MESA PRINCIPAL DE MADEIRA NOBRE & MOLDURAS DE ARDÓSIA E LATÃO
  // ==========================================================================
  const desk = addBox(worldGroup, 18, 0.45, 12, mats.woodDeskMat, 0, -0.32, 0, false, true);
  desk.receiveShadow = true;

  // Bandeja de ardósia da estação principal (Morfologia)
  addBox(worldGroup, 5.4, 0.14, 4.4, mats.slateMat, 0, -0.09, 0, false, true);
  addBox(worldGroup, 5.48, 0.05, 0.06, mats.brassMat, 0, 0.0, 2.22, true, false);
  addBox(worldGroup, 5.48, 0.05, 0.06, mats.brassMat, 0, 0.0, -2.22, true, false);
  addBox(worldGroup, 0.06, 0.05, 4.5, mats.brassMat, -2.72, 0.0, 0, true, false);
  addBox(worldGroup, 0.06, 0.05, 4.5, mats.brassMat, 2.72, 0.0, 0, true, false);

  // Leito de areia fina moldada sob a concha
  const sandGeo = track(new THREE.PlaneGeometry(5.2, 4.2, 48, 40));
  sandGeo.rotateX(-Math.PI / 2);
  const sPos = sandGeo.attributes.position;
  for (let i = 0; i < sPos.count; i++) {
    const x = sPos.getX(i);
    const z = sPos.getZ(i);
    const r = Math.hypot(x, z);
    const basin = -0.022 * Math.exp(-r * r * 0.45);
    const ripple = Math.sin(x * 3.2 + z * 1.5) * 0.01 * Math.min(1.0, r / 1.4);
    sPos.setY(i, basin + ripple);
  }
  sandGeo.computeVertexNormals();
  const sandBed = new THREE.Mesh(sandGeo, mats.sandMat);
  sandBed.position.y = 0.01;
  sandBed.receiveShadow = true;
  worldGroup.add(sandBed);

  // Fragmentos de concha e fósseis secundários na areia (instanced)
  const pebbleGeo = track(new THREE.IcosahedronGeometry(0.018, 0));
  const pebbles = new THREE.InstancedMesh(pebbleGeo, mats.cutRimMat, 42);
  const dummy = new THREE.Object3D();
  for (let i = 0; i < 42; i++) {
    const ang = rnd() * Math.PI * 2;
    const rad = 0.95 + rnd() * 1.35;
    dummy.position.set(Math.cos(ang) * rad, 0.014, Math.sin(ang) * rad * 0.85);
    dummy.rotation.set(rnd() * 3, rnd() * 3, rnd() * 3);
    dummy.scale.set(0.7 + rnd() * 1.0, 0.4 + rnd() * 0.4, 0.7 + rnd() * 1.0);
    dummy.updateMatrix();
    pebbles.setMatrixAt(i, dummy.matrix);
  }
  pebbles.receiveShadow = true;
  pebbles.castShadow = true;
  pebbles.instanceMatrix.needsUpdate = true;
  worldGroup.add(pebbles);

  // Suporte em anel de latão para pouso da concha
  const cradleRing = new THREE.Mesh(track(new THREE.TorusGeometry(0.44, 0.012, 8, 32)), mats.brassMat);
  cradleRing.rotation.x = Math.PI / 2;
  cradleRing.position.set(0, 0.02, 0);
  cradleRing.receiveShadow = true;
  worldGroup.add(cradleRing);

  // ==========================================================================
  // 2. ESTAÇÃO DE MICROSCOPIA & MEDIÇÕES (À ESQUERDA)
  // ==========================================================================
  const labStationGroup = new THREE.Group();
  labStationGroup.position.set(-3.6, 0.0, 0.5);
  worldGroup.add(labStationGroup);

  // Base da estação em ardósia com forro de veludo
  addBox(labStationGroup, 2.2, 0.08, 2.6, mats.slateMat, 0, -0.04, 0, true, true);
  addBox(labStationGroup, 2.0, 0.02, 2.4, mats.velvetMat, 0, 0.01, 0, false, true);

  // Paquímetro de latão móvel com graduação métrica
  const caliperGroup = new THREE.Group();
  caliperGroup.position.set(0, 0.03, 1.55);
  addBox(caliperGroup, 2.8, 0.018, 0.12, mats.brassMat, 0, 0, 0, true, true);
  for (let gx = -1.25; gx <= 1.25; gx += 0.25) {
    const isMajor = Math.abs(Math.round(gx * 2) - gx * 2) < 0.01;
    addBox(caliperGroup, 0.012, 0.008, isMajor ? 0.095 : 0.055, mats.slateMat, gx, 0.012, -0.005, false, false);
  }
  addBox(caliperGroup, 0.055, 0.032, 0.32, mats.brassMat, -1.35, 0.006, -0.1, true, false);
  const jawMobile = addBox(caliperGroup, 0.065, 0.036, 0.32, mats.brassMat, 0.9, 0.007, -0.1, true, false);
  worldGroup.add(caliperGroup);

  // Balança digital de precisão
  const scaleGroup = new THREE.Group();
  scaleGroup.position.set(-3.5, 0.02, 0.8);
  addBox(scaleGroup, 0.65, 0.08, 0.75, mats.slateMat, 0, 0.04, 0, true, true);
  const scalePan = addCyl(scaleGroup, 0.26, 0.26, 0.016, mats.steelMat, 0, 0.09, -0.08, true, true);
  // Display LCD da balança
  const scaleScreen = addBox(scaleGroup, 0.24, 0.01, 0.12, mats.velvetMat, 0, 0.085, 0.22, false, false);
  worldGroup.add(scaleGroup);

  // Lupa de mão científica com aro de latão e cabo de madeira nobre
  const magGroup = new THREE.Group();
  magGroup.position.set(-1.8, 0.04, 1.4);
  magGroup.rotation.y = 0.45;
  const magRim = new THREE.Mesh(track(new THREE.TorusGeometry(0.18, 0.014, 8, 32)), mats.brassMat);
  magRim.rotation.x = Math.PI / 2;
  const magLens = new THREE.Mesh(track(new THREE.CylinderGeometry(0.17, 0.17, 0.008, 32)), mats.glassMat);
  magGroup.add(magRim, magLens);
  addCyl(magGroup, 0.015, 0.015, 0.28, mats.woodDeskMat, 0, 0, 0.32, true, false).rotation.x = Math.PI / 2;
  worldGroup.add(magGroup);

  // Microscópio digital de bancada
  const microscopeGroup = new THREE.Group();
  microscopeGroup.position.set(-3.6, 0.02, -0.4);
  addBox(microscopeGroup, 0.55, 0.06, 0.65, mats.slateMat, 0, 0.03, 0, true, true);
  addCyl(microscopeGroup, 0.04, 0.04, 0.65, mats.brassMat, 0, 0.35, -0.18, true, false);
  const scopeHead = addCyl(microscopeGroup, 0.08, 0.06, 0.35, mats.steelMat, 0, 0.52, 0.02, true, false);
  scopeHead.rotation.x = 0.35;
  worldGroup.add(microscopeGroup);

  // Instrumentos acessórios: pinça e pincel de cerdas
  const tweezerGroup = new THREE.Group();
  tweezerGroup.position.set(-2.5, 0.02, 1.2);
  tweezerGroup.rotation.y = -0.3;
  addBox(tweezerGroup, 0.02, 0.008, 0.32, mats.steelMat, 0, 0.004, 0, true, false);
  worldGroup.add(tweezerGroup);

  // Caderno de anotações taxonômicas aberto
  const notebookGroup = new THREE.Group();
  notebookGroup.position.set(-2.2, 0.02, -1.2);
  notebookGroup.rotation.y = 0.18;
  addBox(notebookGroup, 0.65, 0.03, 0.48, mats.cutRimMat, 0, 0.015, 0, true, true);
  worldGroup.add(notebookGroup);

  // ==========================================================================
  // 3. TANQUE DE FLUTUABILIDADE EXPERIMENTAL DO NÁUTILO (À DIREITA)
  // ==========================================================================
  const tankGroup = new THREE.Group();
  tankGroup.position.set(3.4, 0.0, -0.2);
  worldGroup.add(tankGroup);

  // Base do aquário em ardósia e molduras de latão
  addBox(tankGroup, 2.2, 0.1, 2.2, mats.slateMat, 0, -0.05, 0, true, true);
  addBox(tankGroup, 2.24, 0.04, 0.04, mats.brassMat, 0, 0.01, 1.1, true, false);
  addBox(tankGroup, 2.24, 0.04, 0.04, mats.brassMat, 0, 0.01, -1.1, true, false);
  addBox(tankGroup, 0.04, 0.04, 2.24, mats.brassMat, 1.1, 0.01, 0, true, false);
  addBox(tankGroup, 0.04, 0.04, 2.24, mats.brassMat, -1.1, 0.01, 0, true, false);

  // Paredes de vidro transparente do aquário
  const tankGlass = addBox(tankGroup, 2.0, 1.4, 2.0, mats.glassMat, 0, 0.7, 0, false, false);

  // Bloco de água 3D transparente com índice de refração e densidade realista
  const waterMesh = addBox(tankGroup, 1.94, 1.1, 1.94, mats.waterMat, 0, 0.55, 0, false, false);

  // Indicador de nível da água graduado na parede do tanque
  addBox(tankGroup, 0.015, 0.95, 0.08, mats.brassMat, 1.0, 0.55, 0.5, false, false);

  // Suporte de imersão no tanque
  const tankCradle = new THREE.Mesh(track(new THREE.TorusGeometry(0.38, 0.01, 8, 32)), mats.brassMat);
  tankCradle.rotation.x = Math.PI / 2;
  tankCradle.position.set(0, 0.45, 0);
  tankGroup.add(tankCradle);

  // Vetor de Empuxo (verde azulado ascendente) e Peso (vermelho escuro descendente)
  const arrowBuoyancy = new THREE.ArrowHelper(new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0.5, 0), 0.45, 0x38b8d0, 0.1, 0.06);
  const arrowGravity = new THREE.ArrowHelper(new THREE.Vector3(0, -1, 0), new THREE.Vector3(0, 0.5, 0), 0.45, 0xd05038, 0.1, 0.06);
  tankGroup.add(arrowBuoyancy, arrowGravity);

  // ==========================================================================
  // 4. LUMINÁRIA ARTICULADA 3D & ILUMINAÇÃO CINEMATOGRÁFICA
  // ==========================================================================
  const lampGroup = new THREE.Group();
  lampGroup.position.set(2.4, 0.0, 1.8);
  worldGroup.add(lampGroup);

  // Base da luminária
  addCyl(lampGroup, 0.22, 0.25, 0.06, mats.brassMat, 0, 0.03, 0, true, true);
  // Braço articulado inferior e superior
  const arm1 = addCyl(lampGroup, 0.018, 0.018, 1.1, mats.brassMat, -0.2, 0.55, -0.15, true, false);
  arm1.rotation.z = 0.32;
  const arm2 = addCyl(lampGroup, 0.016, 0.016, 0.95, mats.brassMat, -0.55, 1.35, -0.35, true, false);
  arm2.rotation.z = -0.45;
  // Cúpula / abajur cônico da luminária
  const shade = addCyl(lampGroup, 0.08, 0.22, 0.26, mats.brassMat, -0.85, 1.65, -0.55, true, false);
  shade.rotation.z = -0.65;

  // Fonte de luz local da luminária articulada
  const lampSpot = new THREE.SpotLight(0xffeed4, 1.8, 8.0, Math.PI / 4, 0.35, 1.5);
  lampSpot.position.set(-0.85, 1.65, -0.55);
  lampSpot.target.position.set(0, 0.2, 0);
  lampGroup.add(lampSpot);
  lampGroup.add(lampSpot.target);

  // Luzes principais da cena (Key, Rim, Fill, Hemi)
  const hemi = new THREE.HemisphereLight(0x9fb8d8, 0x2a231c, 0.65);
  scene.add(hemi);

  const keyLight = new THREE.DirectionalLight(0xffeed4, 2.35);
  keyLight.position.set(3.8, 5.6, 3.4);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.set(2048, 2048);
  keyLight.shadow.camera.near = 1.0;
  keyLight.shadow.camera.far = 16.0;
  keyLight.shadow.camera.left = -3.8;
  keyLight.shadow.camera.right = 3.8;
  keyLight.shadow.camera.top = 3.8;
  keyLight.shadow.camera.bottom = -3.8;
  keyLight.shadow.bias = -0.0004;
  keyLight.shadow.normalBias = 0.015;
  scene.add(keyLight);

  const rimLight = new THREE.DirectionalLight(0x90b8f0, 0.95);
  rimLight.position.set(-4.2, 3.0, -3.6);
  scene.add(rimLight);

  const fillLight = new THREE.PointLight(0xffe2c0, 0.85, 7.5, 1.6);
  fillLight.position.set(0.4, 2.4, 0.6);
  scene.add(fillLight);

  // ==========================================================================
  // 5. POEIRA LUMINOSA EM SUSPENSÃO
  // ==========================================================================
  const MAX_DUST = 150;
  const dustPos = new Float32Array(MAX_DUST * 3);
  const dustPhase = new Float32Array(MAX_DUST);
  for (let i = 0; i < MAX_DUST; i++) {
    dustPos[i * 3] = (rnd() - 0.5) * 5.4;
    dustPos[i * 3 + 1] = 0.15 + rnd() * 2.8;
    dustPos[i * 3 + 2] = (rnd() - 0.5) * 4.6;
    dustPhase[i] = rnd() * 6.28;
  }
  const dustGeo = track(new THREE.BufferGeometry());
  dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3).setUsage(THREE.DynamicDrawUsage));
  const dustMat = track(
    new THREE.PointsMaterial({
      color: 0xf4ead8,
      size: 0.016,
      transparent: true,
      opacity: 0.38,
      depthWrite: false,
    })
  );
  const dustPts = new THREE.Points(dustGeo, dustMat);
  worldGroup.add(dustPts);

  // ==========================================================================
  // FUNÇÕES DE SINCRONIZAÇÃO E CONTROLE
  // ==========================================================================
  function syncCaliperToShellWidth(widthMeters) {
    const halfSpan = Math.min(1.32, Math.max(0.22, widthMeters * 0.5));
    jawMobile.position.x = halfSpan;
  }

  function applyLightPreset(presetKey) {
    const p = LIGHT_PRESETS[presetKey] || LIGHT_PRESETS.museum;
    keyLight.color.setHex(p.keyColor);
    keyLight.intensity = p.keyIntensity;
    keyLight.position.set(p.keyPos[0], p.keyPos[1], p.keyPos[2]);
    rimLight.color.setHex(p.rimColor);
    rimLight.intensity = p.rimIntensity;
    fillLight.color.setHex(p.fillColor);
    fillLight.intensity = p.fillIntensity;
    scene.environmentIntensity = p.envIntensity;
  }

  function stepAnimation(fixedDt, state) {
    state.simTime += fixedDt;
    if (state.reducedMotion) return;

    // Movimento browniano suave das partículas de poeira
    for (let i = 0; i < MAX_DUST; i++) {
      dustPos[i * 3 + 1] += Math.sin(state.simTime * 0.65 + dustPhase[i]) * 0.035 * fixedDt;
      dustPos[i * 3] += Math.cos(state.simTime * 0.45 + dustPhase[i]) * 0.025 * fixedDt;
    }
    dustGeo.attributes.position.needsUpdate = true;

    // Marolas leves na superfície da água do aquário
    if (waterMesh && waterMesh.material) {
      waterMesh.position.y = 0.55 + Math.sin(state.simTime * 1.8) * 0.005;
    }

    // Atualização dos vetores de flutuabilidade
    if (state.buoyancyActive) {
      const gasF = state.buoyancyGasRatio ?? 0.62;
      const netBuoyancy = (gasF - 0.5) * 0.6; // positivo = sobe, negativo = afunda
      arrowBuoyancy.setLength(0.25 + gasF * 0.35, 0.08, 0.05);
      arrowGravity.setLength(0.42, 0.08, 0.05);
    }
  }

  function applyQuality(profile) {
    keyLight.castShadow = profile.shadows;
    if (keyLight.shadow.mapSize.width !== profile.shadowMap) {
      keyLight.shadow.mapSize.set(profile.shadowMap, profile.shadowMap);
      if (keyLight.shadow.map) {
        keyLight.shadow.map.dispose();
        keyLight.shadow.map = null;
      }
    }
    dustGeo.setDrawRange(0, Math.min(MAX_DUST, profile.dustCount));
  }

  return {
    worldGroup,
    tankGroup,
    scaleGroup,
    lampGroup,
    lampSpot,
    keyLight,
    rimLight,
    fillLight,
    syncCaliperToShellWidth,
    applyLightPreset,
    stepAnimation,
    applyQuality,
    dispose() {
      disposables.forEach((g) => g.dispose());
    },
  };
}
