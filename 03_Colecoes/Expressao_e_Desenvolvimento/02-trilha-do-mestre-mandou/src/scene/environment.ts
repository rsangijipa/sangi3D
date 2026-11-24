/**
 * Passarelas, Ponte Suspensa, Cabana, Barco e Árvores do Parque
 * Projeto: 02. Trilha do Mestre Mandou
 */

import * as THREE from 'three';

export function createParkEnvironment() {
  const group = new THREE.Group();
  group.name = 'ambiente_parque';

  const woodMat = new THREE.MeshStandardMaterial({
    color: 0x6d4930, // madeira rústica de passarela
    roughness: 0.76,
    metalness: 0.04
  });

  const ropeMat = new THREE.MeshStandardMaterial({
    color: 0xc8b082, // corda de cânhamo
    roughness: 0.85
  });

  // 1. Ponte Suspensa Arqueada sobre o Riacho
  // Liga o lado esquerdo (x: 0, z: -2) ao platô do Sino Azul (x: 10, z: -5)
  const bridgeGroup = new THREE.Group();
  bridgeGroup.name = 'ponte_suspensa';

  const plankCount = 28;
  const plankGeo = new THREE.BoxGeometry(0.28, 0.06, 1.4);
  const startP = new THREE.Vector3(0.0, 1.4, -2.0);
  const endP = new THREE.Vector3(10.5, 2.9, -5.2);

  for (let i = 0; i <= plankCount; i++) {
    const t = i / plankCount;
    const p = new THREE.Vector3().lerpVectors(startP, endP, t);
    // Arco catenário suave da ponte suspensa
    p.y += Math.sin(t * Math.PI) * 0.45;

    const plank = new THREE.Mesh(plankGeo, woodMat);
    plank.position.copy(p);
    plank.rotation.y = -0.32;
    plank.castShadow = true;
    plank.receiveShadow = true;
    bridgeGroup.add(plank);
  }

  // Cordas do corrimão duplo
  [-0.65, 0.65].forEach(zOffset => {
    const ropeCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(startP.x, startP.y + 0.75, startP.z + zOffset),
      new THREE.Vector3((startP.x + endP.x) * 0.5, (startP.y + endP.y) * 0.5 + 1.1, (startP.z + endP.z) * 0.5 + zOffset),
      new THREE.Vector3(endP.x, endP.y + 0.75, endP.z + zOffset)
    ]);
    const ropeGeo = new THREE.TubeGeometry(ropeCurve, 24, 0.025, 8, false);
    const ropeMesh = new THREE.Mesh(ropeGeo, ropeMat);
    ropeMesh.name = 'corda';
    ropeMesh.castShadow = true;
    bridgeGroup.add(ropeMesh);
  });

  group.add(bridgeGroup);

  // 2. Plataformas com Símbolos Pintados
  // A) Plataforma Estrela
  const platStarGroup = new THREE.Group();
  platStarGroup.position.set(2.0, 2.2, -8.0);
  platStarGroup.name = 'plataforma_estrela';

  const deckGeo = new THREE.CylinderGeometry(1.8, 1.8, 0.16, 24);
  const deck = new THREE.Mesh(deckGeo, woodMat);
  deck.receiveShadow = true;
  deck.castShadow = true;
  platStarGroup.add(deck);

  // Símbolo da estrela dourada
  const starShape = new THREE.Shape();
  const numPts = 5;
  for (let i = 0; i < numPts * 2; i++) {
    const r = i % 2 === 0 ? 0.75 : 0.35;
    const a = (i * Math.PI) / numPts;
    const x = Math.cos(a) * r;
    const y = Math.sin(a) * r;
    if (i === 0) starShape.moveTo(x, y);
    else starShape.lineTo(x, y);
  }
  const starGeo = new THREE.ShapeGeometry(starShape);
  starGeo.rotateX(-Math.PI / 2);
  const starMat = new THREE.MeshStandardMaterial({
    color: 0xe5bc58, // dourado
    roughness: 0.4
  });
  const starMesh = new THREE.Mesh(starGeo, starMat);
  starMesh.position.y = 0.085;
  starMesh.receiveShadow = true;
  platStarGroup.add(starMesh);

  // Pilares de sustentação da plataforma
  const legGeo = new THREE.CylinderGeometry(0.1, 0.12, 2.8, 8);
  for (let a = 0; a < Math.PI * 2; a += Math.PI / 2) {
    const leg = new THREE.Mesh(legGeo, woodMat);
    leg.position.set(Math.cos(a) * 1.3, -1.3, Math.sin(a) * 1.3);
    leg.castShadow = true;
    platStarGroup.add(leg);
  }
  group.add(platStarGroup);

  // B) Plataforma Espiral
  const platSpiralGroup = new THREE.Group();
  platSpiralGroup.position.set(-4.0, 1.2, 4.0);
  platSpiralGroup.name = 'plataforma_espiral';

  const spiralDeck = new THREE.Mesh(deckGeo, woodMat);
  spiralDeck.receiveShadow = true;
  spiralDeck.castShadow = true;
  platSpiralGroup.add(spiralDeck);

  // Espiral pintada em verde sálvia
  const spiralMat = new THREE.MeshStandardMaterial({ color: 0x81945b, roughness: 0.5 });
  const ring1 = new THREE.Mesh(new THREE.TorusGeometry(0.4, 0.06, 6, 24).rotateX(Math.PI / 2), spiralMat);
  ring1.position.y = 0.085;
  platSpiralGroup.add(ring1);
  const ring2 = new THREE.Mesh(new THREE.TorusGeometry(0.75, 0.06, 6, 24).rotateX(Math.PI / 2), spiralMat);
  ring2.position.y = 0.085;
  platSpiralGroup.add(ring2);

  group.add(platSpiralGroup);

  // 3. Portão Rústico de Entrada da Trilha
  const gateGroup = new THREE.Group();
  gateGroup.name = 'portao_trilha';
  gateGroup.position.set(0.0, 0.5, -20.0);

  const gatePostGeo = new THREE.CylinderGeometry(0.18, 0.22, 4.0, 12);
  [-1.6, 1.6].forEach(x => {
    const post = new THREE.Mesh(gatePostGeo, woodMat);
    post.position.set(x, 2.0, 0);
    post.castShadow = true;
    post.receiveShadow = true;
    gateGroup.add(post);

    // Lanterna rústica no topo do poste
    const lanternGeo = new THREE.CylinderGeometry(0.12, 0.08, 0.32, 8);
    const lanternMat = new THREE.MeshStandardMaterial({
      color: 0xe5bc58,
      emissive: 0xe5bc58,
      emissiveIntensity: 0.4
    });
    const lantern = new THREE.Mesh(lanternGeo, lanternMat);
    lantern.position.set(x, 4.2, 0);
    gateGroup.add(lantern);
  });

  const gateLintelGeo = new THREE.BoxGeometry(3.8, 0.35, 0.28);
  const lintel = new THREE.Mesh(gateLintelGeo, woodMat);
  lintel.position.set(0, 3.8, 0);
  lintel.castShadow = true;
  gateGroup.add(lintel);

  group.add(gateGroup);

  // 4. Cabana de Madeira do Mirante
  const cabinGroup = new THREE.Group();
  cabinGroup.name = 'cabana_mirante';
  cabinGroup.position.set(-14.0, 3.8, 10.0);

  // Paredes de toras de madeira
  const wallsGeo = new THREE.BoxGeometry(4.2, 2.8, 3.8);
  const wallsMat = new THREE.MeshStandardMaterial({ color: 0x5a3d28, roughness: 0.8 });
  const walls = new THREE.Mesh(wallsGeo, wallsMat);
  walls.position.y = 1.4;
  walls.castShadow = true;
  walls.receiveShadow = true;
  cabinGroup.add(walls);

  // Telhado de duas águas
  const roofGeo = new THREE.ConeGeometry(3.5, 1.6, 4);
  roofGeo.rotateY(Math.PI / 4);
  const roofMat = new THREE.MeshStandardMaterial({ color: 0x365a43, roughness: 0.7 });
  const roof = new THREE.Mesh(roofGeo, roofMat);
  roof.position.y = 3.6;
  roof.castShadow = true;
  cabinGroup.add(roof);

  // Varanda com tábuas e mastro
  const porchGeo = new THREE.BoxGeometry(4.2, 0.15, 1.6);
  const porch = new THREE.Mesh(porchGeo, woodMat);
  porch.position.set(0, 0.1, 2.4);
  porch.castShadow = true;
  cabinGroup.add(porch);

  group.add(cabinGroup);

  // 5. Barco do Remanso
  const boatGroup = new THREE.Group();
  boatGroup.name = 'barco_remanso';
  boatGroup.position.set(4.0, -0.15, 18.0);
  boatGroup.rotation.y = 0.45;

  const hullGeo = new THREE.BoxGeometry(1.4, 0.6, 3.2);
  const boat = new THREE.Mesh(hullGeo, woodMat);
  boat.position.y = 0.2;
  boat.castShadow = true;
  boatGroup.add(boat);

  // Remos de madeira
  const oarGeo = new THREE.CylinderGeometry(0.025, 0.035, 2.2, 8);
  [-0.75, 0.75].forEach(x => {
    const oar = new THREE.Mesh(oarGeo, woodMat);
    oar.position.set(x, 0.45, 0);
    oar.rotation.z = x > 0 ? 0.6 : -0.6;
    boatGroup.add(oar);
  });

  group.add(boatGroup);

  // 6. Povoamento Vegetal: Instanced Árvores e Rochas
  const treeGroup = new THREE.Group();
  treeGroup.name = 'arvores_e_rochas';

  // Tronco de pinheiro
  const trunkGeo = new THREE.CylinderGeometry(0.18, 0.32, 2.5, 8);
  const trunkMat = new THREE.MeshStandardMaterial({ color: 0x4a3320, roughness: 0.9 });
  const trunkMesh = new THREE.InstancedMesh(trunkGeo, trunkMat, 100);

  // Copa cônica de conífera
  const canopyGeo = new THREE.ConeGeometry(1.6, 4.2, 8);
  const canopyMat = new THREE.MeshStandardMaterial({ color: 0x365a43, roughness: 0.65 });
  const canopyMesh = new THREE.InstancedMesh(canopyGeo, canopyMat, 100);

  const dummy = new THREE.Object3D();
  const dummyCanopy = new THREE.Object3D();

  let treeIdx = 0;
  for (let i = 0; i < 100; i++) {
    const angle = Math.random() * Math.PI * 2;
    const dist = 14 + Math.random() * 16;
    const tx = Math.cos(angle) * dist;
    const tz = Math.sin(angle) * dist;

    // Evitar plantar dentro da calha do rio central
    if (Math.abs(tx) < 4.0 && Math.abs(tz) < 16.0) continue;

    const ty = 0.5 + Math.random() * 1.2;

    dummy.position.set(tx, ty + 1.25, tz);
    dummy.scale.set(1, 1 + Math.random() * 0.5, 1);
    dummy.updateMatrix();
    trunkMesh.setMatrixAt(treeIdx, dummy.matrix);

    dummyCanopy.position.set(tx, ty + 3.8, tz);
    const cs = 0.8 + Math.random() * 0.6;
    dummyCanopy.scale.set(cs, cs * 1.2, cs);
    dummyCanopy.updateMatrix();
    canopyMesh.setMatrixAt(treeIdx, dummyCanopy.matrix);

    treeIdx++;
  }

  trunkMesh.count = treeIdx;
  canopyMesh.count = treeIdx;
  trunkMesh.instanceMatrix.needsUpdate = true;
  canopyMesh.instanceMatrix.needsUpdate = true;
  trunkMesh.castShadow = true;
  canopyMesh.castShadow = true;

  treeGroup.add(trunkMesh);
  treeGroup.add(canopyMesh);
  group.add(treeGroup);

  return group;
}
