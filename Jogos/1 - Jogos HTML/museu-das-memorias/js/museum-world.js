/**
 * js/museum-world.js
 * Galeria íntima de madeira em # 072 — Museu das Memórias:
 *  - Assoalho em madeira, rodapés em nogueira, 4 pedestais com vitrine em vidro e 3 molduras vazias
 *  - Objetos simbólicos genéricos procedurais encaixados em pedestais + placas com legenda editável
 *  - Carregamento de textura local para molduras com descarte limpo da memória GPU (T02/T03)
 */
import * as THREE from 'three';
import { GALLERY_SLOTS } from './state.js';

export function buildMemoryMuseumWorld(scene, mats) {
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
  // 1. GALERIA ÍNTIMA DE MADEIRA (ASSOALHO, PAREDES E TRILHOS DE LUZ)
  // ============================================================================
  const floor = addBox(scene, 9.6, 0.16, 9.6, mats.woodFloorMat, 0, -0.08, 0, false, true);
  floor.receiveShadow = true;

  // Paredes norte, oeste e leste com lambris de madeira escura
  addBox(scene, 9.6, 3.8, 0.24, mats.plasterMat, 0, 1.9, -4.5, false, true);
  addBox(scene, 9.5, 0.85, 0.28, mats.walnutMat, 0, 0.42, -4.48, false, true);

  addBox(scene, 0.24, 3.8, 9.2, mats.plasterMat, -4.7, 1.9, 0, false, true);
  addBox(scene, 0.28, 0.85, 9.1, mats.walnutMat, -4.68, 0.42, 0, false, true);

  addBox(scene, 0.24, 3.8, 9.2, mats.plasterMat, 4.7, 1.9, 0, false, true);
  addBox(scene, 0.28, 0.85, 9.1, mats.walnutMat, 4.68, 0.42, 0, false, true);

  // Banco central de madeira para contemplação da galeria
  addBox(scene, 1.9, 0.08, 0.56, mats.walnutMat, 0.0, 0.46, 0.95);
  addBox(scene, 0.10, 0.44, 0.48, mats.walnutMat, -0.75, 0.22, 0.95);
  addBox(scene, 0.10, 0.44, 0.48, mats.walnutMat, 0.75, 0.22, 0.95);

  // ============================================================================
  // 2. PEDESTAIS COM VITRINE, MOLDURAS DE PAREDE & PLACAS DE LEGENDA
  // ============================================================================
  const pickables = [];
  const slotGroups = {};
  const frameCanvases = {}; // slotId -> { mesh, customTex, defaultMat }
  const slotPlaques = {};   // slotId -> { mesh, tex, mat }
  const dynamicObjectResources = {}; // slotId -> { grp, geos }

  const selGeo = track(new THREE.RingGeometry(0.42, 0.48, 32));
  selGeo.rotateX(-Math.PI / 2);
  const selMat = track(new THREE.MeshBasicMaterial({ color: 0xe6c37a, transparent: true, opacity: 0.9, side: THREE.DoubleSide }));
  const selectionRing = new THREE.Mesh(selGeo, selMat);
  selectionRing.position.y = 0.02;
  selectionRing.visible = false;
  scene.add(selectionRing);

  const blankFrameMat = mats.makePlaqueMaterial('Moldura livre');
  disposables.push(blankFrameMat.tex, blankFrameMat.mat);

  GALLERY_SLOTS.forEach((slot) => {
    const grp = new THREE.Group();
    scene.add(grp);

    if (slot.kind === 'pedestal') {
      // Coluna de madeira nogueira + topo em latão + campânula de vidro vitrine
      addBox(grp, 0.64, 0.96, 0.64, mats.walnutMat, slot.x, 0.48, slot.z);
      addBox(grp, 0.68, 0.06, 0.68, mats.brassMat, slot.x, 0.99, slot.z);
      const vitrine = new THREE.Mesh(track(new THREE.BoxGeometry(0.56, 0.56, 0.56)), mats.glassMat);
      vitrine.position.set(slot.x, 1.30, slot.z);
      grp.add(vitrine);

      // Placa frontal com legenda
      const pInfo = mats.makePlaqueMaterial('');
      const plaque = new THREE.Mesh(track(new THREE.PlaneGeometry(0.48, 0.18)), pInfo.mat);
      plaque.position.set(slot.x, 0.78, slot.z + 0.33);
      grp.add(plaque);
      slotPlaques[slot.id] = { mesh: plaque, tex: pInfo.tex, mat: pInfo.mat };

      const hit = addBox(grp, 0.72, 1.55, 0.72, mats.glassMat, slot.x, 0.78, slot.z, false, false);
      hit.visible = false;
      hit.userData.slotId = slot.id;
      pickables.push(hit);
    } else {
      // Moldura na parede norte + tela vazia + placa abaixo
      addBox(grp, 1.44, 1.06, 0.07, mats.walnutMat, slot.x, slot.y, slot.z);
      addBox(grp, 1.30, 0.92, 0.04, mats.brassMat, slot.x, slot.y, slot.z + 0.03);
      const artPlane = new THREE.Mesh(track(new THREE.PlaneGeometry(1.18, 0.82)), blankFrameMat.mat);
      artPlane.position.set(slot.x, slot.y, slot.z + 0.06);
      artPlane.userData.slotId = slot.id;
      grp.add(artPlane);
      pickables.push(artPlane);
      frameCanvases[slot.id] = { mesh: artPlane, customTex: null, customMat: null };

      const pInfo = mats.makePlaqueMaterial('');
      const plaque = new THREE.Mesh(track(new THREE.PlaneGeometry(0.68, 0.24)), pInfo.mat);
      plaque.position.set(slot.x, slot.y - 0.72, slot.z + 0.04);
      grp.add(plaque);
      slotPlaques[slot.id] = { mesh: plaque, tex: pInfo.tex, mat: pInfo.mat };
    }

    slotGroups[slot.id] = grp;
  });

  function createSymbolicObjectGroup(type) {
    const grp = new THREE.Group();
    const geos = [];
    const oTrack = (g) => (geos.push(g), g);

    if (type === 'bussola') {
      const body = new THREE.Mesh(oTrack(new THREE.CylinderGeometry(0.14, 0.14, 0.05, 20)), mats.brassMat);
      body.position.y = 0.03;
      const dial = new THREE.Mesh(oTrack(new THREE.CylinderGeometry(0.11, 0.11, 0.055, 18)), mats.paperMat);
      dial.position.y = 0.032;
      const needle = new THREE.Mesh(oTrack(new THREE.BoxGeometry(0.02, 0.015, 0.16)), mats.walnutMat);
      needle.position.y = 0.065;
      needle.rotation.y = 0.5;
      grp.add(body, dial, needle);
    } else if (type === 'chave') {
      const bow = new THREE.Mesh(oTrack(new THREE.TorusGeometry(0.065, 0.014, 8, 18)), mats.brassMat);
      bow.rotation.x = Math.PI / 2;
      bow.position.set(-0.08, 0.04, 0);
      const shaft = new THREE.Mesh(oTrack(new THREE.CylinderGeometry(0.012, 0.012, 0.22, 8)), mats.brassMat);
      shaft.rotation.z = Math.PI / 2;
      shaft.position.set(0.05, 0.04, 0);
      const bit = new THREE.Mesh(oTrack(new THREE.BoxGeometry(0.04, 0.016, 0.04)), mats.brassMat);
      bit.position.set(0.13, 0.04, 0.02);
      grp.add(bow, shaft, bit);
    } else if (type === 'ampulheta') {
      const base = new THREE.Mesh(oTrack(new THREE.CylinderGeometry(0.11, 0.11, 0.03, 14)), mats.walnutMat);
      base.position.y = 0.015;
      const top = base.clone();
      top.position.y = 0.31;
      const coneA = new THREE.Mesh(oTrack(new THREE.ConeGeometry(0.085, 0.14, 14)), mats.glassMat);
      coneA.rotation.x = Math.PI; coneA.position.y = 0.23;
      const coneB = new THREE.Mesh(oTrack(new THREE.ConeGeometry(0.085, 0.14, 14)), mats.glassMat);
      coneB.position.y = 0.10;
      const sand = new THREE.Mesh(oTrack(new THREE.ConeGeometry(0.065, 0.075, 12)), mats.brassMat);
      sand.position.y = 0.065;
      grp.add(base, top, coneA, coneB, sand);
    } else if (type === 'barco') {
      const hull = new THREE.Mesh(oTrack(new THREE.ConeGeometry(0.11, 0.28, 4)), mats.paperMat);
      hull.rotation.z = Math.PI / 2;
      hull.scale.set(0.65, 1, 0.85);
      hull.position.y = 0.05;
      const sail = new THREE.Mesh(oTrack(new THREE.ConeGeometry(0.08, 0.18, 3)), mats.paperMat);
      sail.position.y = 0.14;
      grp.add(hull, sail);
    } else if (type === 'xicara') {
      const saucer = new THREE.Mesh(oTrack(new THREE.CylinderGeometry(0.13, 0.09, 0.022, 18)), mats.ceramicMat);
      saucer.position.y = 0.011;
      const cup = new THREE.Mesh(oTrack(new THREE.CylinderGeometry(0.085, 0.065, 0.11, 18)), mats.ceramicMat);
      cup.position.y = 0.07;
      const handle = new THREE.Mesh(oTrack(new THREE.TorusGeometry(0.036, 0.01, 8, 14)), mats.ceramicMat);
      handle.position.set(0.08, 0.07, 0);
      grp.add(saucer, cup, handle);
    } else {
      const book = new THREE.Mesh(oTrack(new THREE.BoxGeometry(0.20, 0.045, 0.26)), mats.linenMat);
      book.position.y = 0.025;
      const pages = new THREE.Mesh(oTrack(new THREE.BoxGeometry(0.18, 0.036, 0.24)), mats.paperMat);
      pages.position.set(0.012, 0.025, 0);
      grp.add(book, pages);
    }

    grp.traverse((c) => {
      if (c.isMesh) { c.castShadow = true; c.receiveShadow = true; }
    });
    return { grp, geos };
  }

  function clearSlotVisual(slotId) {
    if (dynamicObjectResources[slotId]) {
      const res = dynamicObjectResources[slotId];
      scene.remove(res.grp);
      res.geos.forEach((g) => g.dispose());
      delete dynamicObjectResources[slotId];
    }
    if (frameCanvases[slotId]) {
      const fc = frameCanvases[slotId];
      if (fc.customTex) { fc.customTex.dispose(); fc.customTex = null; }
      if (fc.customMat) { fc.customMat.dispose(); fc.customMat = null; }
      fc.mesh.material = blankFrameMat.mat;
    }
  }

  function updatePlaqueVisual(slotId, captionText) {
    const p = slotPlaques[slotId];
    if (!p) return;
    p.tex.dispose();
    p.mat.dispose();
    const next = mats.makePlaqueMaterial(captionText);
    p.mesh.material = next.mat;
    p.tex = next.tex;
    p.mat = next.mat;
  }

  function syncAllSlots(itemsMap, selectedSlotId) {
    GALLERY_SLOTS.forEach((slot) => {
      clearSlotVisual(slot.id);
      const item = itemsMap[slot.id];
      updatePlaqueVisual(slot.id, item ? item.caption : '');

      if (!item) return;

      if (slot.kind === 'pedestal') {
        const res = createSymbolicObjectGroup(item.type || 'bussola');
        res.grp.position.set(slot.x, slot.y, slot.z);
        scene.add(res.grp);
        dynamicObjectResources[slot.id] = res;
      } else if (slot.kind === 'frame') {
        const fc = frameCanvases[slot.id];
        if (item.localImageUrl) {
          const img = new Image();
          img.onload = () => {
            if (!fc) return;
            const tex = new THREE.Texture(img);
            tex.colorSpace = THREE.SRGBColorSpace;
            tex.needsUpdate = true;
            const mat = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.45 });
            fc.customTex = tex;
            fc.customMat = mat;
            fc.mesh.material = mat;
          };
          img.src = item.localImageUrl;
        }
      }
    });

    const selSlot = GALLERY_SLOTS[selectedSlotId];
    if (selSlot) {
      selectionRing.visible = true;
      selectionRing.position.set(selSlot.x, 0.015, selSlot.kind === 'pedestal' ? selSlot.z : -3.95);
    } else {
      selectionRing.visible = false;
    }
  }

  // ============================================================================
  // 3. ILUMINAÇÃO QUENTE DE GALERIA
  // ============================================================================
  const hemi = new THREE.HemisphereLight(0xffe9cc, 0x3b2a1e, 0.78);
  scene.add(hemi);

  const keyLight = new THREE.DirectionalLight(0xffe6c2, 1.85);
  keyLight.position.set(2.5, 5.2, 3.2);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.set(2048, 2048);
  keyLight.shadow.camera.near = 1;
  keyLight.shadow.camera.far = 16;
  keyLight.shadow.camera.left = -5.5;
  keyLight.shadow.camera.right = 5.5;
  keyLight.shadow.camera.top = 5.5;
  keyLight.shadow.camera.bottom = -5.5;
  keyLight.shadow.bias = -0.0004;
  scene.add(keyLight);

  const wallSpot = new THREE.PointLight(0xffdfb0, 2.2, 11, 1.4);
  wallSpot.position.set(0, 3.2, -2.5);
  scene.add(wallSpot);

  function applyQuality(profile) {
    keyLight.castShadow = profile.shadows;
    if (keyLight.shadow.mapSize.width !== profile.shadowMap) {
      keyLight.shadow.mapSize.set(profile.shadowMap, profile.shadowMap);
      if (keyLight.shadow.map) { keyLight.shadow.map.dispose(); keyLight.shadow.map = null; }
    }
  }

  return {
    pickables,
    syncAllSlots,
    applyQuality,
    dispose() {
      Object.keys(dynamicObjectResources).forEach(clearSlotVisual);
      Object.values(slotPlaques).forEach((p) => { p.tex.dispose(); p.mat.dispose(); });
      disposables.forEach((g) => g.dispose());
    },
  };
}
