/**
 * js/garden-world.js
 * Cenário 3D de # 073 — Jardim dos Caminhos Possíveis:
 *  - Jardim ensolarado com riacho sinuoso, pontes arqueadas em madeira, árvores instanciadas
 *  - Reconstrução dinâmica do grafo de trilhas, clareiras e placas personalizáveis em madeira
 *  - Marcador do caminhante suavemente interpolado em timestep fixo
 */
import * as THREE from 'three';
import { mulberry32 } from './state.js';

export function buildPathsGardenWorld(scene, mats, seed = 7305) {
  const rnd = mulberry32(seed);
  const staticDisposables = [];
  const track = (g) => (staticDisposables.push(g), g);

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
  // 1. GRAMADO SERENO, RIACHO TRANSPARENTE E ARVOREDO
  // ============================================================================
  const terrainGeo = track(new THREE.PlaneGeometry(52, 52, 64, 64));
  terrainGeo.rotateX(-Math.PI / 2);
  const tPos = terrainGeo.attributes.position;
  for (let i = 0; i < tPos.count; i++) {
    const x = tPos.getX(i);
    const z = tPos.getZ(i);
    // Leito raso do riacho passando em torno de z = 2.6
    const creekDist = Math.abs(z - 2.6 - Math.sin(x * 0.25) * 0.55);
    const dip = -0.34 * Math.exp(-creekDist * creekDist * 0.9);
    tPos.setY(i, dip);
  }
  terrainGeo.computeVertexNormals();
  const terrain = new THREE.Mesh(terrainGeo, mats.grassMat);
  terrain.receiveShadow = true;
  scene.add(terrain);

  // Água do riacho em z ≈ 2.6
  const creek = new THREE.Mesh(track(new THREE.PlaneGeometry(46, 2.2)), mats.creekMat);
  creek.rotation.x = -Math.PI / 2;
  creek.position.set(0, -0.14, 2.6);
  creek.receiveShadow = true;
  scene.add(creek);

  // Árvores nas bordas do jardim preservando visão clara das bifurcações
  const TREE_COUNT = 32;
  const trunkGeo = track(new THREE.CylinderGeometry(0.14, 0.20, 1.5, 7));
  const crownGeo = track(new THREE.IcosahedronGeometry(1.15, 1));
  const trunkInst = new THREE.InstancedMesh(trunkGeo, mats.woodMat, TREE_COUNT);
  const crownInst = new THREE.InstancedMesh(crownGeo, mats.foliageMat, TREE_COUNT);
  const dummy = new THREE.Object3D();
  let placed = 0;
  let guard = 0;
  while (placed < TREE_COUNT && guard < 240) {
    guard++;
    const x = (rnd() - 0.5) * 32;
    const z = (rnd() - 0.5) * 28;
    if (Math.hypot(x, z) < 8.5 || Math.abs(z - 2.6) < 2.2) continue;
    const sc = 0.8 + rnd() * 0.65;
    dummy.position.set(x, 0.72 * sc, z);
    dummy.rotation.set(0, rnd() * 6.28, 0);
    dummy.scale.setScalar(sc);
    dummy.updateMatrix();
    trunkInst.setMatrixAt(placed, dummy.matrix);

    dummy.position.set(x, 1.95 * sc, z);
    dummy.scale.set(sc * 1.1, sc * 0.95, sc * 1.1);
    dummy.updateMatrix();
    crownInst.setMatrixAt(placed, dummy.matrix);
    placed++;
  }
  trunkInst.count = placed;
  crownInst.count = placed;
  trunkInst.castShadow = true;
  crownInst.castShadow = true;
  trunkInst.instanceMatrix.needsUpdate = true;
  crownInst.instanceMatrix.needsUpdate = true;
  scene.add(trunkInst, crownInst);

  // ============================================================================
  // 2. GRUPO DINÂMICO DO GRAFO DE CAMINHOS (CLAREIRAS, PONTES E PLACAS)
  // ============================================================================
  const graphGroup = new THREE.Group();
  scene.add(graphGroup);
  const pickables = [];
  let dynDisposables = [];

  // Marcador luminoso sutil indicando onde o caminhante está no jardim
  const travelerGrp = new THREE.Group();
  const travRing = new THREE.Mesh(track(new THREE.CylinderGeometry(0.32, 0.36, 0.08, 20)), mats.lanternMat);
  travRing.position.y = 0.06;
  const travOrb = new THREE.Mesh(track(new THREE.SphereGeometry(0.16, 16, 12)), mats.blossomMat);
  travOrb.position.y = 0.42;
  travOrb.castShadow = true;
  travelerGrp.add(travRing, travOrb);
  scene.add(travelerGrp);

  function rebuildPathGraph(nodes, currentNodeId, visitedIds) {
    while (graphGroup.children.length) graphGroup.remove(graphGroup.children[0]);
    pickables.length = 0;
    dynDisposables.forEach((d) => d.dispose());
    dynDisposables = [];
    const dTrack = (d) => (dynDisposables.push(d), d);

    const byId = new Map(nodes.map((n) => [n.id, n]));

    // 1. Liga cada nó filho ao pai com trilha em cascalho e ponte sobre o riacho
    nodes.forEach((node) => {
      if (node.parentId === null) return;
      const parent = byId.get(node.parentId);
      if (!parent) return;

      const dx = node.x - parent.x;
      const dz = node.z - parent.z;
      const len = Math.hypot(dx, dz);
      const yaw = Math.atan2(dx, dz);
      const midX = (node.x + parent.x) * 0.5;
      const midZ = (node.z + parent.z) * 0.5;

      // Faixa contínua de cascalho claro conectando as clareiras
      const strip = addBox(graphGroup, 0.92, 0.04, len, mats.gravelMat, midX, 0.015, midZ, false, true);
      strip.rotation.y = yaw;

      // Se a trilha cruza o riacho (z ≈ 2.6), constrói ponte arqueada em madeira!
      const crossesCreek = (parent.z - 2.6) * (node.z - 2.6) <= 0;
      if (crossesCreek) {
        const tCross = (2.6 - parent.z) / (node.z - parent.z || 1e-4);
        const bx = parent.x + dx * tCross;
        const bridge = new THREE.Group();
        bridge.position.set(bx, 0.06, 2.6);
        bridge.rotation.y = yaw;
        addBox(bridge, 1.15, 0.12, 2.5, mats.woodMat, 0, 0.10, 0, true, true);
        [-0.54, 0.54].forEach((sx) => {
          addBox(bridge, 0.08, 0.52, 0.08, mats.woodMat, sx, 0.34, -1.0);
          addBox(bridge, 0.08, 0.52, 0.08, mats.woodMat, sx, 0.34, 1.0);
          addBox(bridge, 0.07, 0.06, 2.2, mats.woodMat, sx, 0.58, 0);
        });
        graphGroup.add(bridge);
      }
    });

    // 2. Desenha cada clareira em pedra, lanterna discreta e placa personalizável clicável
    nodes.forEach((node) => {
      const isCur = node.id === currentNodeId;
      const isVisited = visitedIds.includes(node.id);
      const padGeo = dTrack(new THREE.CylinderGeometry(1.05, 1.12, 0.06, 20));
      const pad = new THREE.Mesh(padGeo, isCur ? mats.gravelMat : mats.stoneMat);
      pad.position.set(node.x, 0.03, node.z);
      pad.receiveShadow = true;
      pad.userData.nodeId = node.id;
      graphGroup.add(pad);
      pickables.push(pad);

      // Placa de madeira personalizável na borda direita da clareira
      const post = addBox(graphGroup, 0.09, 0.92, 0.09, mats.woodMat, node.x + 0.88, 0.46, node.z - 0.55);
      post.userData.nodeId = node.id;
      const signInfo = mats.makeSignMaterial(node.title, isCur || isVisited);
      dTrack(signInfo.tex);
      dTrack(signInfo.mat);
      const boardGeo = dTrack(new THREE.BoxGeometry(0.96, 0.36, 0.05));
      const board = new THREE.Mesh(boardGeo, signInfo.mat);
      board.position.set(node.x + 0.88, 0.82, node.z - 0.52);
      board.castShadow = true;
      board.userData.nodeId = node.id;
      graphGroup.add(board);
      pickables.push(board);
    });
  }

  function syncTraveler(x, z, simTime, reduced) {
    // Eleva suavemente ao atravessar a ponte sobre o riacho
    const creekDist = Math.abs(z - 2.6);
    const bridgeLift = creekDist < 1.25 ? Math.cos((creekDist / 1.25) * Math.PI * 0.5) * 0.22 : 0;
    travelerGrp.position.set(x, bridgeLift, z);
    travOrb.position.y = 0.42 + (reduced ? 0 : Math.sin(simTime * 2.5) * 0.04);
  }

  // ============================================================================
  // 3. ILUMINAÇÃO DIURNA CALMA
  // ============================================================================
  const hemi = new THREE.HemisphereLight(0xeef5ec, 0x48563e, 0.92);
  scene.add(hemi);

  const sun = new THREE.DirectionalLight(0xfff4dd, 2.15);
  sun.position.set(8.5, 13.0, 9.5);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.camera.near = 2;
  sun.shadow.camera.far = 42;
  sun.shadow.camera.left = -14;
  sun.shadow.camera.right = 14;
  sun.shadow.camera.top = 14;
  sun.shadow.camera.bottom = -14;
  sun.shadow.bias = -0.0004;
  scene.add(sun);

  function applyQuality(profile) {
    sun.castShadow = profile.shadows;
    if (sun.shadow.mapSize.width !== profile.shadowMap) {
      sun.shadow.mapSize.set(profile.shadowMap, profile.shadowMap);
      if (sun.shadow.map) { sun.shadow.map.dispose(); sun.shadow.map = null; }
    }
  }

  return {
    pickables,
    rebuildPathGraph,
    syncTraveler,
    applyQuality,
    dispose() {
      staticDisposables.forEach((g) => g.dispose());
      dynDisposables.forEach((d) => d.dispose());
    },
  };
}
