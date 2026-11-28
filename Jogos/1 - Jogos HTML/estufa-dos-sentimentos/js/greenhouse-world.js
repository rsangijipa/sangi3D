/**
 * js/greenhouse-world.js
 * Estufa botânica acolhedora em vidro e madeira:
 *  - Estrutura arquitetônica com vigas, piso em pedra, vasos de apoio, regador em latão
 *  - Bancada central com vaso focal, etiqueta em branco personalizável e 4 espécies botânicas procedurais
 *  - Iluminação filtrada pelo vidro e partículas opcionais de chuva/névoa em passo fixo
 */
import * as THREE from 'three';
import { PLANT_SPECIES, WEATHER_MODES, mulberry32 } from './state.js';

export function buildGreenhouseWorld(scene, mats, seed = 7104) {
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
  // 1. ESTUFA ENVIDRAÇADA E JARDIM EXTERNO AO REDOR
  // ============================================================================
  const lawn = new THREE.Mesh(track(new THREE.PlaneGeometry(46, 46)), mats.bgLeafMat);
  lawn.rotation.x = -Math.PI / 2;
  lawn.position.y = -0.04;
  lawn.receiveShadow = true;
  scene.add(lawn);

  // Piso em lajotas de pedra dentro da estufa (9m × 11m)
  addBox(scene, 9.0, 0.10, 11.0, mats.floorMat, 0, 0.0, 0, false, true);

  // Estrutura em madeira e ferro da estufa (paredes baixas + pilares + telhado duas águas)
  const gh = new THREE.Group();
  scene.add(gh);
  addBox(gh, 9.0, 0.72, 0.22, mats.cedarMat, 0, 0.36, -5.4);
  addBox(gh, 0.22, 0.72, 10.8, mats.cedarMat, -4.4, 0.36, 0);
  addBox(gh, 0.22, 0.72, 10.8, mats.cedarMat, 4.4, 0.36, 0);

  for (let z = -5.4; z <= 5.4; z += 2.7) {
    addBox(gh, 0.14, 3.1, 0.14, mats.ironMat, -4.4, 1.55, z);
    addBox(gh, 0.14, 3.1, 0.14, mats.ironMat, 4.4, 1.55, z);
    // Tesouras inclinadas do teto até cumeeira (y = 4.4)
    const rL = addBox(gh, 4.65, 0.10, 0.10, mats.cedarMat, -2.2, 3.72, z, true, false);
    rL.rotation.z = 0.28;
    const rR = addBox(gh, 4.65, 0.10, 0.10, mats.cedarMat, 2.2, 3.72, z, true, false);
    rR.rotation.z = -0.28;
  }
  addBox(gh, 0.14, 0.16, 11.0, mats.cedarMat, 0, 4.38, 0);

  // Vidros translúcidos laterais e cobertura filtrada
  const wallL = new THREE.Mesh(track(new THREE.PlaneGeometry(10.8, 2.4)), mats.glassMat);
  wallL.rotation.y = Math.PI / 2;
  wallL.position.set(-4.4, 1.9, 0);
  gh.add(wallL);

  const wallR = new THREE.Mesh(track(new THREE.PlaneGeometry(10.8, 2.4)), mats.glassMat);
  wallR.rotation.y = -Math.PI / 2;
  wallR.position.set(4.4, 1.9, 0);
  gh.add(wallR);

  const wallN = new THREE.Mesh(track(new THREE.PlaneGeometry(8.8, 2.5)), mats.glassMat);
  wallN.position.set(0, 1.95, -5.4);
  gh.add(wallN);

  const roofGlassL = new THREE.Mesh(track(new THREE.PlaneGeometry(4.7, 10.9)), mats.glassMat);
  roofGlassL.rotation.x = Math.PI / 2;
  roofGlassL.rotation.y = -0.28;
  roofGlassL.position.set(-2.22, 3.74, 0);
  gh.add(roofGlassL);

  const roofGlassR = new THREE.Mesh(track(new THREE.PlaneGeometry(4.7, 10.9)), mats.glassMat);
  roofGlassR.rotation.x = Math.PI / 2;
  roofGlassR.rotation.y = 0.28;
  roofGlassR.position.set(2.22, 3.74, 0);
  gh.add(roofGlassR);

  // Prateleiras laterais com vasinhos de apoio ambientando a estufa
  addBox(gh, 1.1, 0.08, 8.0, mats.cedarMat, -3.65, 0.85, -0.5);
  addBox(gh, 1.1, 0.08, 8.0, mats.cedarMat, 3.65, 0.85, -0.5);
  const sidePotGeo = track(new THREE.CylinderGeometry(0.16, 0.11, 0.24, 12));
  const sideCrownGeo = track(new THREE.IcosahedronGeometry(0.22, 1));
  const sidePotInst = new THREE.InstancedMesh(sidePotGeo, mats.potMat, 12);
  const sidePlantInst = new THREE.InstancedMesh(sideCrownGeo, mats.bgLeafMat, 12);
  const dummy = new THREE.Object3D();
  for (let i = 0; i < 12; i++) {
    const sx = i < 6 ? -3.65 : 3.65;
    const sz = -3.8 + (i % 6) * 1.35 + (rnd() - 0.5) * 0.2;
    dummy.position.set(sx, 1.01, sz);
    dummy.scale.setScalar(0.9 + rnd() * 0.35);
    dummy.updateMatrix();
    sidePotInst.setMatrixAt(i, dummy.matrix);

    dummy.position.set(sx, 1.24, sz);
    dummy.scale.set(1.0 + rnd() * 0.4, 0.8 + rnd() * 0.5, 1.0 + rnd() * 0.4);
    dummy.updateMatrix();
    sidePlantInst.setMatrixAt(i, dummy.matrix);
  }
  sidePotInst.castShadow = true;
  sidePlantInst.castShadow = true;
  sidePotInst.instanceMatrix.needsUpdate = true;
  sidePlantInst.instanceMatrix.needsUpdate = true;
  gh.add(sidePotInst, sidePlantInst);

  // ============================================================================
  // 2. BANCADA CENTRAL COM VASO FOCAL, ETIQUETA EM BRANCO E REGADOR EM LATÃO
  // ============================================================================
  const bench = new THREE.Group();
  scene.add(bench);
  addBox(bench, 2.4, 0.08, 1.3, mats.cedarMat, 0, 0.78, 0);
  [[-1.05, -0.52], [1.05, -0.52], [-1.05, 0.52], [1.05, 0.52]].forEach(([lx, lz]) => {
    addBox(bench, 0.09, 0.76, 0.09, mats.cedarMat, lx, 0.38, lz);
  });

  // Regador em latão ao lado do vaso principal
  const canGrp = new THREE.Group();
  canGrp.position.set(0.76, 0.82, 0.18);
  canGrp.rotation.y = -0.55;
  const canBody = new THREE.Mesh(track(new THREE.CylinderGeometry(0.11, 0.13, 0.24, 14)), mats.brassMat);
  canBody.position.y = 0.12;
  canBody.castShadow = true;
  const spout = new THREE.Mesh(track(new THREE.CylinderGeometry(0.016, 0.028, 0.26, 8)), mats.brassMat);
  spout.position.set(-0.16, 0.17, 0);
  spout.rotation.z = 0.85;
  spout.castShadow = true;
  canGrp.add(canBody, spout);
  bench.add(canGrp);

  // Vaso focal de terracota/cerâmica + terra + etiqueta em branco espetada
  const heroPot = new THREE.Mesh(track(new THREE.CylinderGeometry(0.28, 0.20, 0.34, 24)), mats.potMat);
  heroPot.position.set(0, 0.99, 0);
  heroPot.castShadow = true;
  heroPot.receiveShadow = true;
  bench.add(heroPot);

  const heroRim = new THREE.Mesh(track(new THREE.TorusGeometry(0.285, 0.025, 10, 28)), mats.potMat);
  heroRim.rotation.x = Math.PI / 2;
  heroRim.position.set(0, 1.15, 0);
  bench.add(heroRim);

  const soilDisc = new THREE.Mesh(track(new THREE.CylinderGeometry(0.26, 0.26, 0.03, 20)), mats.soilMat);
  soilDisc.position.set(0, 1.13, 0);
  soilDisc.receiveShadow = true;
  bench.add(soilDisc);

  // Etiqueta personalizável em branco cravada no solo do vaso
  const tagStick = addBox(bench, 0.018, 0.18, 0.008, mats.cedarMat, -0.17, 1.18, 0.14);
  tagStick.rotation.x = -0.22;
  tagStick.rotation.z = 0.16;
  const tagCard = new THREE.Mesh(track(new THREE.BoxGeometry(0.22, 0.11, 0.012)), mats.tagMat);
  tagCard.position.set(-0.18, 1.28, 0.16);
  tagCard.rotation.set(-0.32, 0.25, 0.08);
  tagCard.castShadow = true;
  bench.add(tagCard);

  // ============================================================================
  // 3. PLANTA FOCAL PROCEDURAL (4 ESPÉCIES INTERATIVAS)
  // ============================================================================
  const plantGroup = new THREE.Group();
  plantGroup.position.set(0, 1.14, 0);
  bench.add(plantGroup);
  let plantGeos = [];

  function rebuildPlant(speciesId) {
    while (plantGroup.children.length) {
      plantGroup.remove(plantGroup.children[0]);
    }
    plantGeos.forEach((g) => g.dispose());
    plantGeos = [];
    const pTrack = (g) => (plantGeos.push(g), g);

    const spec = PLANT_SPECIES[speciesId] || PLANT_SPECIES.samambaia;
    mats.potMat.color.setHex(spec.potTone);

    if (speciesId === 'samambaia') {
      const frondGeo = pTrack(new THREE.ConeGeometry(0.09, 0.56, 6));
      frondGeo.scale(1.0, 1.0, 0.22);
      for (let i = 0; i < 14; i++) {
        const ring = i < 6 ? 0.42 : 0.78;
        const ang = (i * 2.39996); // ângulo áureo filotaxia
        const frond = new THREE.Mesh(frondGeo, i % 3 === 0 ? mats.accentBloomMat : mats.foliageMat);
        frond.position.set(Math.cos(ang) * 0.08, 0.18 + (1 - ring) * 0.14, Math.sin(ang) * 0.08);
        frond.rotation.order = 'YXZ';
        frond.rotation.y = -ang;
        frond.rotation.x = ring * 0.95;
        frond.castShadow = true;
        plantGroup.add(frond);
      }
    } else if (speciesId === 'girassol') {
      const stem = new THREE.Mesh(pTrack(new THREE.CylinderGeometry(0.022, 0.032, 0.54, 10)), mats.stemMat);
      stem.position.y = 0.27;
      stem.castShadow = true;
      plantGroup.add(stem);

      const leafGeo = pTrack(new THREE.SphereGeometry(0.11, 10, 8));
      leafGeo.scale(1.3, 0.2, 0.75);
      [-1, 1].forEach((side, idx) => {
        const lf = new THREE.Mesh(leafGeo, mats.foliageMat);
        lf.position.set(side * 0.12, 0.18 + idx * 0.10, 0);
        lf.rotation.z = side * -0.4;
        lf.castShadow = true;
        plantGroup.add(lf);
      });

      const head = new THREE.Group();
      head.position.set(0, 0.56, 0.02);
      head.rotation.x = 0.28;
      const core = new THREE.Mesh(pTrack(new THREE.CylinderGeometry(0.11, 0.11, 0.05, 16)), mats.soilMat);
      core.rotation.x = Math.PI / 2;
      head.add(core);
      const petalGeo = pTrack(new THREE.ConeGeometry(0.042, 0.16, 6));
      petalGeo.scale(1, 1, 0.35);
      for (let p = 0; p < 14; p++) {
        const a = (p / 14) * Math.PI * 2;
        const pet = new THREE.Mesh(petalGeo, mats.accentBloomMat);
        pet.position.set(Math.cos(a) * 0.15, Math.sin(a) * 0.15, 0);
        pet.rotation.z = a - Math.PI / 2;
        pet.castShadow = true;
        head.add(pet);
      }
      plantGroup.add(head);
    } else if (speciesId === 'lotus') {
      const padGeo = pTrack(new THREE.CylinderGeometry(0.16, 0.16, 0.018, 16));
      for (let p = 0; p < 3; p++) {
        const a = p * 2.1 + 0.4;
        const pad = new THREE.Mesh(padGeo, mats.foliageMat);
        pad.position.set(Math.cos(a) * 0.11, 0.04 + p * 0.015, Math.sin(a) * 0.11);
        pad.receiveShadow = true;
        plantGroup.add(pad);
      }
      const stalk = new THREE.Mesh(pTrack(new THREE.CylinderGeometry(0.015, 0.02, 0.34, 8)), mats.stemMat);
      stalk.position.y = 0.17;
      plantGroup.add(stalk);

      const petGeo = pTrack(new THREE.SphereGeometry(0.09, 10, 8));
      petGeo.scale(0.65, 1.4, 0.32);
      for (let layer = 0; layer < 2; layer++) {
        const count = layer === 0 ? 8 : 6;
        for (let i = 0; i < count; i++) {
          const a = (i / count) * Math.PI * 2 + layer * 0.3;
          const pet = new THREE.Mesh(petGeo, mats.accentBloomMat);
          pet.position.set(Math.cos(a) * (0.09 - layer * 0.03), 0.34 + layer * 0.04, Math.sin(a) * (0.09 - layer * 0.03));
          pet.rotation.y = -a;
          pet.rotation.z = 0.55 - layer * 0.25;
          pet.castShadow = true;
          plantGroup.add(pet);
        }
      }
    } else {
      // Bonsai escultural com tronco sinuoso e copas em nuvem
      const trunkCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(-0.08, 0.18, 0.02),
        new THREE.Vector3(0.09, 0.36, -0.04),
        new THREE.Vector3(0.02, 0.52, 0.0),
      ]);
      const trunk = new THREE.Mesh(pTrack(new THREE.TubeGeometry(trunkCurve, 18, 0.035, 8, false)), mats.cedarMat);
      trunk.castShadow = true;
      plantGroup.add(trunk);

      const padPos = [[-0.14, 0.26, 0.04, 0.14], [0.16, 0.40, -0.04, 0.16], [0.02, 0.56, 0.0, 0.19]];
      padPos.forEach(([x, y, z, r], idx) => {
        const crown = new THREE.Mesh(pTrack(new THREE.IcosahedronGeometry(r, 1)), idx === 2 ? mats.accentBloomMat : mats.foliageMat);
        crown.scale.set(1.25, 0.55, 1.05);
        crown.position.set(x, y, z);
        crown.castShadow = true;
        plantGroup.add(crown);
      });
    }
  }

  // ============================================================================
  // 4. GOTAS DE CHUVA SUAVE / REGA & LUZ SOLAR FILTRADA
  // ============================================================================
  const MAX_RAIN = 150;
  const rainPos = new Float32Array(MAX_RAIN * 3);
  for (let i = 0; i < MAX_RAIN; i++) {
    rainPos[i * 3] = (rnd() - 0.5) * 14;
    rainPos[i * 3 + 1] = 0.5 + rnd() * 6.5;
    rainPos[i * 3 + 2] = (rnd() - 0.5) * 14;
  }
  const rainGeo = track(new THREE.BufferGeometry());
  rainGeo.setAttribute('position', new THREE.BufferAttribute(rainPos, 3).setUsage(THREE.DynamicDrawUsage));
  const rainMat = track(
    new THREE.PointsMaterial({ color: 0xd9ecff, size: 0.045, transparent: true, opacity: 0.55, depthWrite: false })
  );
  const rainPts = new THREE.Points(rainGeo, rainMat);
  rainPts.visible = false;
  scene.add(rainPts);

  const hemi = new THREE.HemisphereLight(0xeef6f2, 0x6f5e4d, 0.85);
  scene.add(hemi);

  const sun = new THREE.DirectionalLight(0xfff3de, 2.2);
  sun.position.set(5.5, 8.2, 4.5);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.camera.near = 1;
  sun.shadow.camera.far = 26;
  sun.shadow.camera.left = -6.5;
  sun.shadow.camera.right = 6.5;
  sun.shadow.camera.top = 6.5;
  sun.shadow.camera.bottom = -6.5;
  sun.shadow.bias = -0.0004;
  sun.shadow.normalBias = 0.018;
  scene.add(sun);

  function applyAtmosphere(state) {
    const wSpec = WEATHER_MODES[state.weather] || WEATHER_MODES.sun;
    sun.intensity = wSpec.sunInt;
    sun.color.setHex(state.weather === 'breeze' ? 0xffe4bd : state.weather === 'rain' ? 0xdbe6f0 : 0xfff5e4);
    scene.background.setHex(wSpec.skyHex);
    if (scene.fog) {
      scene.fog.color.setHex(wSpec.skyHex);
      scene.fog.density = wSpec.fogDensity;
    }
    rainPts.visible = wSpec.rainRate > 0;
  }

  function stepPhysics(fixedDt, state) {
    state.simTime += fixedDt;
    if (state.waterPulse > 0) state.waterPulse = Math.max(0, state.waterPulse - fixedDt * 1.4);

    // Escala simbólica reversível baseada em crescimento e pulso suave de rega
    const gScale = state.growth + (state.reducedMotion ? 0 : Math.sin(state.waterPulse * Math.PI) * 0.06);
    plantGroup.scale.setScalar(gScale);
    plantGroup.rotation.z = state.reducedMotion ? 0 : Math.sin(state.simTime * 1.1) * 0.018;

    const wSpec = WEATHER_MODES[state.weather] || WEATHER_MODES.sun;
    if (wSpec.rainRate > 0 && !state.reducedMotion) {
      const fall = 5.4 * fixedDt;
      for (let i = 0; i < MAX_RAIN; i++) {
        rainPos[i * 3 + 1] -= fall;
        if (rainPos[i * 3 + 1] < 0.1) rainPos[i * 3 + 1] = 7.0;
      }
      rainGeo.attributes.position.needsUpdate = true;
    }
  }

  function applyQuality(profile) {
    sun.castShadow = profile.shadows;
    if (sun.shadow.mapSize.width !== profile.shadowMap) {
      sun.shadow.mapSize.set(profile.shadowMap, profile.shadowMap);
      if (sun.shadow.map) { sun.shadow.map.dispose(); sun.shadow.map = null; }
    }
    rainGeo.setDrawRange(0, Math.min(MAX_RAIN, profile.rainCount));
  }

  return {
    plantGroup,
    heroPot,
    rebuildPlant,
    applyAtmosphere,
    stepPhysics,
    applyQuality,
    dispose() {
      disposables.forEach((g) => g.dispose());
      plantGeos.forEach((g) => g.dispose());
    },
  };
}
