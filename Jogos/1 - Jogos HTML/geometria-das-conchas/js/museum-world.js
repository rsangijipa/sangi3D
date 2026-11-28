/**
 * js/museum-world.js
 * Bancada de museu escuro, bandeja de ardósia, leito de areia fina moldada,
 * escala métrica em latão para comparação visual de proporções e iluminação macro.
 */
import * as THREE from 'three';
import { mulberry32 } from './state.js';

export function buildMuseumWorld(scene, mats, seed = 2509) {
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
  // 1. BANCADA ESCURA DE MUSEU & BANDEJA EM ARDÓSIA COM AREIA NATURAL
  // ============================================================================
  const desk = addBox(scene, 24, 0.4, 20, mats.slateMat, 0, -0.35, 0, false, true);
  desk.receiveShadow = true;

  // Moldura de latão e ardósia da bandeja de espécime
  addBox(scene, 5.2, 0.14, 4.2, mats.slateMat, 0, -0.09, 0, false, true);
  addBox(scene, 5.28, 0.06, 0.06, mats.brassMat, 0, 0.0, 2.12, true, false);
  addBox(scene, 5.28, 0.06, 0.06, mats.brassMat, 0, 0.0, -2.12, true, false);
  addBox(scene, 0.06, 0.06, 4.3, mats.brassMat, -2.62, 0.0, 0, true, false);
  addBox(scene, 0.06, 0.06, 4.3, mats.brassMat, 2.62, 0.0, 0, true, false);

  // Leito de areia fina com micro-dunas suaves sob a concha
  const sandGeo = track(new THREE.PlaneGeometry(5.05, 4.05, 56, 46));
  sandGeo.rotateX(-Math.PI / 2);
  const sPos = sandGeo.attributes.position;
  for (let i = 0; i < sPos.count; i++) {
    const x = sPos.getX(i);
    const z = sPos.getZ(i);
    const r = Math.hypot(x, z);
    // Leve depressão aconchegante ao centro onde repousa a concha + marolas suaves nas bordas
    const basin = -0.02 * Math.exp(-r * r * 0.45);
    const ripple = Math.sin(x * 3.1 + z * 1.4) * 0.012 * Math.min(1, r / 1.5);
    sPos.setY(i, basin + ripple);
  }
  sandGeo.computeVertexNormals();
  const sandBed = new THREE.Mesh(sandGeo, mats.sandMat);
  sandBed.position.y = 0.01;
  sandBed.receiveShadow = true;
  scene.add(sandBed);

  // Grãos maiores e fragmentinhos calcários esparsos na areia (instancing)
  const pebbleGeo = track(new THREE.IcosahedronGeometry(0.018, 0));
  const pebbles = new THREE.InstancedMesh(pebbleGeo, mats.cutRimMat, 48);
  const dummy = new THREE.Object3D();
  for (let i = 0; i < 48; i++) {
    const ang = rnd() * Math.PI * 2;
    const rad = 0.85 + rnd() * 1.35;
    dummy.position.set(Math.cos(ang) * rad, 0.012, Math.sin(ang) * rad * 0.8);
    dummy.rotation.set(rnd() * 3, rnd() * 3, rnd() * 3);
    dummy.scale.set(0.7 + rnd() * 1.1, 0.45 + rnd() * 0.4, 0.7 + rnd() * 1.1);
    dummy.updateMatrix();
    pebbles.setMatrixAt(i, dummy.matrix);
  }
  pebbles.receiveShadow = true;
  pebbles.castShadow = true;
  pebbles.instanceMatrix.needsUpdate = true;
  scene.add(pebbles);

  // ============================================================================
  // 2. RÉGUA / PAQUÍMETRO DE MUSEU EM LATÃO PARA COMPARAÇÃO DE PROPORÇÕES
  // ============================================================================
  const caliper = new THREE.Group();
  caliper.position.set(0, 0.025, 1.58);
  addBox(caliper, 2.8, 0.018, 0.11, mats.brassMat, 0, 0, 0, true, true);
  // Marcações graduadas de referência espacial a cada 0.25m
  for (let gx = -1.25; gx <= 1.25; gx += 0.25) {
    const isMajor = Math.abs(Math.round(gx * 2) - gx * 2) < 0.01;
    addBox(caliper, 0.012, 0.008, isMajor ? 0.095 : 0.055, mats.slateMat, gx, 0.012, -0.005, false, false);
  }
  // Bicos fixo e móvel do paquímetro
  addBox(caliper, 0.055, 0.032, 0.30, mats.brassMat, -1.35, 0.005, -0.10, true, false);
  const jawMobile = addBox(caliper, 0.065, 0.036, 0.30, mats.brassMat, 0.9, 0.006, -0.10, true, false);
  scene.add(caliper);

  // Suporte de acrílico/latão discreto lateral quando concha está erguida
  const cradleRing = new THREE.Mesh(track(new THREE.TorusGeometry(0.42, 0.012, 8, 32)), mats.brassMat);
  cradleRing.rotation.x = Math.PI / 2;
  cradleRing.position.set(0, 0.02, 0);
  cradleRing.receiveShadow = true;
  scene.add(cradleRing);

  // ============================================================================
  // 3. POEIRA LUMINOSA SUTIL NO FEIXE DE LUZ DO MUSEU
  // ============================================================================
  const MAX_DUST = 60;
  const dustPos = new Float32Array(MAX_DUST * 3);
  const dustPhase = new Float32Array(MAX_DUST);
  for (let i = 0; i < MAX_DUST; i++) {
    dustPos[i * 3] = (rnd() - 0.5) * 3.6;
    dustPos[i * 3 + 1] = 0.25 + rnd() * 2.2;
    dustPos[i * 3 + 2] = (rnd() - 0.5) * 3.2;
    dustPhase[i] = rnd() * 6.28;
  }
  const dustGeo = track(new THREE.BufferGeometry());
  dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3).setUsage(THREE.DynamicDrawUsage));
  const dustMat = track(
    new THREE.PointsMaterial({
      color: 0xf4ead8,
      size: 0.016,
      transparent: true,
      opacity: 0.36,
      depthWrite: false,
    })
  );
  const dustPts = new THREE.Points(dustGeo, dustMat);
  scene.add(dustPts);

  // ============================================================================
  // 4. ILUMINAÇÃO CONTROLADA DE MUSEU (KEY QUENTE, FILL FRIO & RIM NACARADO)
  // ============================================================================
  const hemi = new THREE.HemisphereLight(0x9fb8d8, 0x2a231c, 0.65);
  scene.add(hemi);

  const keyLight = new THREE.DirectionalLight(0xfff0d8, 2.35);
  keyLight.position.set(3.8, 5.6, 3.4);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.set(2048, 2048);
  keyLight.shadow.camera.near = 1.0;
  keyLight.shadow.camera.far = 16.0;
  keyLight.shadow.camera.left = -3.4;
  keyLight.shadow.camera.right = 3.4;
  keyLight.shadow.camera.top = 3.4;
  keyLight.shadow.camera.bottom = -3.4;
  keyLight.shadow.bias = -0.0004;
  keyLight.shadow.normalBias = 0.015;
  scene.add(keyLight);

  const rimLight = new THREE.DirectionalLight(0x90b8f0, 0.92);
  rimLight.position.set(-4.2, 3.0, -3.6);
  scene.add(rimLight);

  const nacreFill = new THREE.PointLight(0xffead2, 0.85, 6.5, 1.6);
  nacreFill.position.set(0.4, 2.4, 0.6);
  scene.add(nacreFill);

  function syncCaliperToShellWidth(widthMeters) {
    // Ajusta mordaça móvel do paquímetro proporcionalmente à largura medida da concha
    const halfSpan = Math.min(1.32, Math.max(0.25, widthMeters * 0.5));
    jawMobile.position.x = halfSpan;
  }

  function stepAnimation(fixedDt, state) {
    state.simTime += fixedDt;
    if (state.reducedMotion) return;
    for (let i = 0; i < MAX_DUST; i++) {
      dustPos[i * 3 + 1] += Math.sin(state.simTime * 0.7 + dustPhase[i]) * 0.04 * fixedDt;
      dustPos[i * 3] += Math.cos(state.simTime * 0.5 + dustPhase[i]) * 0.03 * fixedDt;
    }
    dustGeo.attributes.position.needsUpdate = true;
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
    syncCaliperToShellWidth,
    stepAnimation,
    applyQuality,
    dispose() {
      disposables.forEach((g) => g.dispose());
    },
  };
}
