/**
 * Modelagem Procedural dos Objetos Sensoriais e Cenário
 * Projeto: 02. Mesa dos Objetos que Acalmam
 */

import * as THREE from 'three';
import { createHammeredBronzeTexture, createBrocadeTexture } from './textures.js';

/**
 * Cria o tampo da mesa, pernas, parede de fundo, janela com persiana e planta
 */
export function createTableEnvironment(textures) {
  const group = new THREE.Group();
  group.name = 'ambiente_escritorio';

  // 1. Tampo da Mesa de Nogueira Escura (1.95m x 1.25m x 0.05m)
  const deskGeo = new THREE.BoxGeometry(1.95, 0.05, 1.25, 4, 1, 4);
  const deskMat = new THREE.MeshStandardMaterial({
    map: textures.walnut.diffuseMap,
    normalMap: textures.walnut.normalMap,
    roughnessMap: textures.walnut.roughnessMap,
    roughness: 0.42,
    metalness: 0.02
  });
  const desk = new THREE.Mesh(deskGeo, deskMat);
  desk.position.set(0.1, -0.025, 0.05);
  desk.receiveShadow = true;
  desk.castShadow = true;
  desk.name = 'tampo_mesa';
  group.add(desk);

  // Bordas chanfradas da mesa para realismo tátil
  const bevelGeo = new THREE.CylinderGeometry(0.025, 0.025, 1.95, 16);
  const frontBevel = new THREE.Mesh(bevelGeo, deskMat);
  frontBevel.rotation.z = Math.PI / 2;
  frontBevel.position.set(0.1, -0.025, 0.675);
  frontBevel.receiveShadow = true;
  group.add(frontBevel);

  // Pernas da mesa em nogueira maciça
  const legGeo = new THREE.CylinderGeometry(0.035, 0.028, 0.75, 16);
  const legPositions = [
    [-0.78, -0.42, -0.48],
    [0.98, -0.42, -0.48],
    [-0.78, -0.42, 0.58],
    [0.98, -0.42, 0.58]
  ];
  legPositions.forEach((pos, idx) => {
    const leg = new THREE.Mesh(legGeo, deskMat);
    leg.position.set(pos[0], pos[1], pos[2]);
    leg.castShadow = true;
    leg.receiveShadow = true;
    leg.name = `perna_mesa_${idx + 1}`;
    group.add(leg);
  });

  // 2. Parede de Fundo e Peitoril da Janela
  const wallGeo = new THREE.PlaneGeometry(6.0, 3.8);
  const wallMat = new THREE.MeshStandardMaterial({
    color: 0xede4d5,
    roughness: 0.92,
    metalness: 0.01
  });
  const wall = new THREE.Mesh(wallGeo, wallMat);
  wall.position.set(0.2, 0.9, -0.72);
  wall.receiveShadow = true;
  wall.name = 'parede_fundo';
  group.add(wall);

  // Peitoril da janela em madeira clara
  const sillGeo = new THREE.BoxGeometry(2.4, 0.04, 0.22);
  const sillMat = new THREE.MeshStandardMaterial({
    color: 0xf5f0e8,
    roughness: 0.6
  });
  const sill = new THREE.Mesh(sillGeo, sillMat);
  sill.position.set(0.7, 0.38, -0.66);
  sill.receiveShadow = true;
  sill.castShadow = true;
  sill.name = 'peitoril_janela';
  group.add(sill);

  // 3. Persiana Veneziana com lâminas que projetam faixas de sombra diagonais autênticas
  const blindsGroup = new THREE.Group();
  blindsGroup.name = 'persiana_janela';
  const numSlats = 26;
  const slatGeo = new THREE.BoxGeometry(2.2, 0.003, 0.08);
  const slatMat = new THREE.MeshStandardMaterial({
    color: 0xf5eee4,
    roughness: 0.45,
    metalness: 0.05
  });

  for (let i = 0; i < numSlats; i++) {
    const slat = new THREE.Mesh(slatGeo, slatMat);
    slat.position.set(0.65, 0.25 + i * 0.052, -0.48);
    slat.rotation.x = 0.54; // inclinação das palhetas da persiana (~31 graus)
    slat.rotation.y = -0.18;
    slat.castShadow = true;
    slat.receiveShadow = true;
    blindsGroup.add(slat);
  }
  group.add(blindsGroup);

  // 4. Planta Decorativa de Interior à Esquerda (vaso de cerâmica + folhagem orgânica)
  const plantGroup = new THREE.Group();
  plantGroup.name = 'planta_decorativa';
  plantGroup.position.set(-0.85, 0.0, -0.22);

  // Vaso de cerâmica escura
  const potGeo = new THREE.CylinderGeometry(0.09, 0.065, 0.22, 24);
  const potMat = new THREE.MeshStandardMaterial({
    color: 0x3d352e,
    roughness: 0.8
  });
  const pot = new THREE.Mesh(potGeo, potMat);
  pot.position.y = 0.11;
  pot.castShadow = true;
  pot.receiveShadow = true;
  plantGroup.add(pot);

  // Folhas largas que emolduram a lateral esquerda
  const leafMat = new THREE.MeshStandardMaterial({
    color: 0x2d422a,
    roughness: 0.38,
    metalness: 0.05,
    side: THREE.DoubleSide
  });

  const leafGeo = new THREE.SphereGeometry(0.14, 16, 12);
  leafGeo.scale(0.55, 1.4, 0.08); // formato de folha oval alongada

  const leafConfigs = [
    { pos: [-0.05, 0.28, 0.08], rot: [0.3, 0.4, -0.5], scale: 1.1 },
    { pos: [0.08, 0.38, -0.05], rot: [-0.4, 0.8, 0.4], scale: 1.25 },
    { pos: [-0.12, 0.44, -0.02], rot: [0.5, -0.6, -0.6], scale: 1.15 },
    { pos: [0.04, 0.52, 0.06], rot: [0.2, 0.2, 0.3], scale: 1.3 },
    { pos: [-0.02, 0.62, -0.04], rot: [-0.3, 0.5, -0.2], scale: 1.0 }
  ];

  leafConfigs.forEach((cfg, idx) => {
    const leaf = new THREE.Mesh(leafGeo, leafMat);
    leaf.position.set(cfg.pos[0], cfg.pos[1], cfg.pos[2]);
    leaf.rotation.set(cfg.rot[0], cfg.rot[1], cfg.rot[2]);
    leaf.scale.multiplyScalar(cfg.scale);
    leaf.castShadow = true;
    leaf.name = `folha_planta_${idx + 1}`;
    plantGroup.add(leaf);
  });

  group.add(plantGroup);

  return group;
}

/**
 * Cria o Pêndulo de Areia (Bandeja redonda, areia zen, tripé de madeira e pêndulo de latão)
 */
export function createSandPendulum(textures, sandSystem) {
  const group = new THREE.Group();
  group.name = 'pendulo_areia_grupo';
  group.position.set(-0.06, 0.0, 0.12);

  // 1. Bandeja Redonda de Madeira Escura (diâmetro 0.54m)
  const trayRimGeo = new THREE.CylinderGeometry(0.27, 0.265, 0.038, 48, 1, true);
  const trayWoodMat = new THREE.MeshStandardMaterial({
    color: 0x382316,
    roughness: 0.48,
    metalness: 0.04
  });
  const trayRim = new THREE.Mesh(trayRimGeo, trayWoodMat);
  trayRim.position.y = 0.019;
  trayRim.castShadow = true;
  trayRim.receiveShadow = true;
  trayRim.name = 'borda_bandeja';
  group.add(trayRim);

  const trayBottomGeo = new THREE.CylinderGeometry(0.265, 0.265, 0.012, 48);
  const trayBottom = new THREE.Mesh(trayBottomGeo, trayWoodMat);
  trayBottom.position.y = 0.006;
  trayBottom.receiveShadow = true;
  group.add(trayBottom);

  // 2. Disco de Areia Zen com CanvasTexture interativo
  const sandGeo = new THREE.CircleGeometry(0.262, 64);
  sandGeo.rotateX(-Math.PI / 2);
  const sandMat = new THREE.MeshStandardMaterial({
    map: sandSystem.texture,
    roughness: 0.94,
    metalness: 0.01,
    bumpMap: sandSystem.texture,
    bumpScale: 0.004
  });
  const sandMesh = new THREE.Mesh(sandGeo, sandMat);
  sandMesh.position.y = 0.024;
  sandMesh.receiveShadow = true;
  sandMesh.name = 'areia_disco';
  group.add(sandMesh);

  // 3. Tripé de Madeira e Latão
  const tripodGroup = new THREE.Group();
  tripodGroup.name = 'tripe_pendulo';

  const apexHeight = 0.46;
  const legRadius = 0.23;
  const legAngleOffset = Math.PI / 6;

  // Hub superior de latão
  const hubGeo = new THREE.CylinderGeometry(0.022, 0.026, 0.035, 16);
  const brassMat = new THREE.MeshStandardMaterial({
    color: 0xd4a548,
    metalness: 0.88,
    roughness: 0.22
  });
  const hub = new THREE.Mesh(hubGeo, brassMat);
  hub.position.y = apexHeight;
  hub.castShadow = true;
  tripodGroup.add(hub);

  const finialGeo = new THREE.SphereGeometry(0.012, 16, 16);
  const finial = new THREE.Mesh(finialGeo, brassMat);
  finial.position.y = apexHeight + 0.024;
  finial.castShadow = true;
  tripodGroup.add(finial);

  // 3 Pernas de madeira escura
  for (let i = 0; i < 3; i++) {
    const angle = legAngleOffset + (i * Math.PI * 2) / 3;
    const footX = Math.cos(angle) * legRadius;
    const footZ = Math.sin(angle) * legRadius;

    // Calcular vetor da perna do pé até o ápice
    const start = new THREE.Vector3(footX, 0.024, footZ);
    const end = new THREE.Vector3(0, apexHeight, 0);
    const length = start.distanceTo(end);

    const legGeo = new THREE.CylinderGeometry(0.006, 0.010, length, 12);
    const legMesh = new THREE.Mesh(legGeo, trayWoodMat);

    // Posicionar no ponto médio e orientar para o ápice
    legMesh.position.copy(start).lerp(end, 0.5);
    legMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), end.clone().sub(start).normalize());
    legMesh.castShadow = true;
    legMesh.name = `perna_tripe_${i + 1}`;
    tripodGroup.add(legMesh);

    // Sapata de latão no pé
    const footGeo = new THREE.CylinderGeometry(0.011, 0.013, 0.014, 12);
    const foot = new THREE.Mesh(footGeo, brassMat);
    foot.position.set(footX, 0.028, footZ);
    foot.castShadow = true;
    tripodGroup.add(foot);
  }
  group.add(tripodGroup);

  // 4. Pêndulo Suspenso (Pivô no ápice)
  const pendulumPivot = new THREE.Group();
  pendulumPivot.name = 'pendulo_pivot';
  pendulumPivot.position.set(0, apexHeight - 0.01, 0);

  // Fio de suspensão
  const cordLength = 0.39;
  const cordGeo = new THREE.CylinderGeometry(0.001, 0.001, cordLength, 8);
  const cordMat = new THREE.MeshStandardMaterial({ color: 0x887766, roughness: 0.8 });
  const cord = new THREE.Mesh(cordGeo, cordMat);
  cord.position.y = -cordLength / 2;
  cord.castShadow = true;
  pendulumPivot.add(cord);

  // Peso de latão formato gota/bolota com estilete fino
  const bobGroup = new THREE.Group();
  bobGroup.name = 'peso_pendulo';
  bobGroup.position.y = -cordLength;

  // Corpo bojudo do pêndulo
  const bobBodyGeo = new THREE.SphereGeometry(0.022, 24, 24);
  bobBodyGeo.scale(1.0, 1.4, 1.0);
  const bobBody = new THREE.Mesh(bobBodyGeo, brassMat);
  bobBody.castShadow = true;
  bobGroup.add(bobBody);

  // Anel decorativo de latão usinado
  const ringGeo = new THREE.TorusGeometry(0.022, 0.003, 12, 24);
  ringGeo.rotateX(Math.PI / 2);
  const ring = new THREE.Mesh(ringGeo, brassMat);
  ring.castShadow = true;
  bobGroup.add(ring);

  // Ponta afilada do estilete que toca a areia
  const tipGeo = new THREE.ConeGeometry(0.012, 0.038, 20);
  tipGeo.rotateX(Math.PI);
  const tip = new THREE.Mesh(tipGeo, brassMat);
  tip.position.y = -0.028;
  tip.castShadow = true;
  tip.name = 'ponta_estilete';
  bobGroup.add(tip);

  // Hitbox invisível generosa para facilitar clique/toque
  const hitGeo = new THREE.SphereGeometry(0.055, 12, 12);
  const hitMat = new THREE.MeshBasicMaterial({ visible: false });
  const hitbox = new THREE.Mesh(hitGeo, hitMat);
  hitbox.name = 'hitbox_pendulo';
  bobGroup.add(hitbox);

  pendulumPivot.add(bobGroup);
  group.add(pendulumPivot);

  return {
    group,
    pendulumPivot,
    bobGroup,
    hitbox,
    sandMesh,
    brassMat
  };
}

/**
 * Cria o Berço de Newton (5 esferas cromadas com arcos tubulares)
 */
export function createNewtonsCradle() {
  const group = new THREE.Group();
  group.name = 'berco_newton';
  group.position.set(0.27, 0.0, -0.17);

  // Base com chanfro em nogueira e frisos cromados
  const baseGeo = new THREE.BoxGeometry(0.24, 0.022, 0.13, 2, 1, 2);
  const baseMat = new THREE.MeshStandardMaterial({
    color: 0x24160e,
    roughness: 0.35,
    metalness: 0.05
  });
  const base = new THREE.Mesh(baseGeo, baseMat);
  base.position.y = 0.011;
  base.castShadow = true;
  base.receiveShadow = true;
  group.add(base);

  // Arcos tubulares cromados invertidos em U
  const chromeMat = new THREE.MeshStandardMaterial({
    color: 0xeeeeee,
    metalness: 0.98,
    roughness: 0.04
  });

  const frameWidth = 0.19;
  const frameHeight = 0.19;
  const barRadius = 0.0035;

  [-0.05, 0.05].forEach((zPos, fIdx) => {
    // Duas colunas verticais
    [-frameWidth / 2, frameWidth / 2].forEach(xPos => {
      const colGeo = new THREE.CylinderGeometry(barRadius, barRadius, frameHeight, 16);
      const col = new THREE.Mesh(colGeo, chromeMat);
      col.position.set(xPos, 0.02 + frameHeight / 2, zPos);
      col.castShadow = true;
      group.add(col);
    });

    // Barra horizontal superior
    const barGeo = new THREE.CylinderGeometry(barRadius, barRadius, frameWidth, 16);
    barGeo.rotateZ(Math.PI / 2);
    const bar = new THREE.Mesh(barGeo, chromeMat);
    bar.position.set(0, 0.02 + frameHeight, zPos);
    bar.castShadow = true;
    group.add(bar);
  });

  // 5 Esferas cromadas suspensas em V
  const sphereCount = 5;
  const sphereRadius = 0.013;
  const sphereSpacing = sphereRadius * 2.02;
  const wireLength = 0.145;
  const suspensionY = 0.02 + frameHeight;

  const spherePivots = [];
  const sphereMeshes = [];

  const startX = -((sphereCount - 1) * sphereSpacing) / 2;

  for (let i = 0; i < sphereCount; i++) {
    const sphereX = startX + i * sphereSpacing;

    // Pivô de oscilação no topo
    const pivot = new THREE.Group();
    pivot.position.set(sphereX, suspensionY, 0);
    pivot.name = `pivo_esfera_${i + 1}`;

    // Fios duplos em V
    const wireMat = new THREE.MeshBasicMaterial({ color: 0x999999 });
    const wireGeo = new THREE.CylinderGeometry(0.0007, 0.0007, wireLength, 6);

    [-0.05, 0.05].forEach(zTop => {
      const start = new THREE.Vector3(0, 0, zTop);
      const end = new THREE.Vector3(0, -wireLength, 0);
      const wMesh = new THREE.Mesh(wireGeo, wireMat);
      wMesh.position.copy(start).lerp(end, 0.5);
      wMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), end.clone().sub(start).normalize());
      pivot.add(wMesh);
    });

    // Esfera cromada
    const sphereGeo = new THREE.SphereGeometry(sphereRadius, 32, 32);
    const sphere = new THREE.Mesh(sphereGeo, chromeMat);
    sphere.position.y = -wireLength;
    sphere.castShadow = true;
    sphere.name = `esfera_newton_${i + 1}`;
    pivot.add(sphere);

    // Hitbox invisível
    const hitGeo = new THREE.SphereGeometry(0.022, 12, 12);
    const hit = new THREE.Mesh(hitGeo, new THREE.MeshBasicMaterial({ visible: false }));
    hit.position.y = -wireLength;
    hit.name = `hitbox_esfera_${i + 1}`;
    hit.userData = { sphereIndex: i };
    pivot.add(hit);

    group.add(pivot);
    spherePivots.push(pivot);
    sphereMeshes.push(sphere);
  }

  return { group, spherePivots, sphereMeshes, chromeMat };
}

/**
 * Cria a Ampulheta Líquida (Cilindro com gotas em cascata)
 */
export function createLiquidHourglass() {
  const group = new THREE.Group();
  group.name = 'ampulheta_liquida';
  group.position.set(0.48, 0.11, -0.07);

  // Pivô central para rotação de 180 graus
  const flipPivot = new THREE.Group();
  flipPivot.name = 'ampulheta_flip_pivot';
  group.add(flipPivot);

  // Corpo de vidro transparente arredondado
  const glassGeo = new THREE.CylinderGeometry(0.035, 0.035, 0.22, 32, 1, true);
  const glassMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.28,
    roughness: 0.06,
    metalness: 0.05
  });
  const glass = new THREE.Mesh(glassGeo, glassMat);
  flipPivot.add(glass);

  // Tampas superior e inferior
  const capGeo = new THREE.CylinderGeometry(0.038, 0.038, 0.014, 32);
  const capMat = new THREE.MeshStandardMaterial({
    color: 0x3d2b20,
    roughness: 0.4
  });

  const topCap = new THREE.Mesh(capGeo, capMat);
  topCap.position.y = 0.11;
  topCap.castShadow = true;
  flipPivot.add(topCap);

  const bottomCap = new THREE.Mesh(capGeo, capMat);
  bottomCap.position.y = -0.11;
  bottomCap.castShadow = true;
  flipPivot.add(bottomCap);

  // Gotas de líquidos coloridos (Âmbar e Azul Oceano)
  const amberMat = new THREE.MeshStandardMaterial({
    color: 0xdf8437,
    roughness: 0.15,
    metalness: 0.05
  });
  const blueMat = new THREE.MeshStandardMaterial({
    color: 0x1b70a6,
    roughness: 0.15,
    metalness: 0.05
  });

  const dropMeshes = [];
  const dropGeo = new THREE.SphereGeometry(0.009, 16, 16);
  dropGeo.scale(1.0, 1.25, 1.0);

  for (let i = 0; i < 14; i++) {
    const isAmber = i % 2 === 0;
    const drop = new THREE.Mesh(dropGeo, isAmber ? amberMat : blueMat);
    // Distribuição inicial em zigue-zague suave
    const xOffset = Math.sin(i * 1.2) * 0.012;
    drop.position.set(xOffset, (i / 14) * 0.20 - 0.10, 0);
    drop.castShadow = true;
    flipPivot.add(drop);
    dropMeshes.push(drop);
  }

  // Hitbox para virar com clique
  const hitGeo = new THREE.CylinderGeometry(0.045, 0.045, 0.24, 16);
  const hitbox = new THREE.Mesh(hitGeo, new THREE.MeshBasicMaterial({ visible: false }));
  hitbox.name = 'hitbox_ampulheta';
  flipPivot.add(hitbox);

  return { group, flipPivot, dropMeshes, amberMat, blueMat, hitbox };
}

/**
 * Cria a Tigela Tibetana de Bronze com Almofada de Brocado e Bastão
 */
export function createSingingBowl() {
  const group = new THREE.Group();
  group.name = 'tigela_tibetana_grupo';
  group.position.set(0.56, 0.0, 0.18);

  // 1. Almofada Redonda de Brocado Carmim
  const cushionGeo = new THREE.TorusGeometry(0.076, 0.024, 24, 36);
  cushionGeo.rotateX(Math.PI / 2);
  const brocadeTex = createBrocadeTexture('#932621', '#d4a047');
  const cushionMat = new THREE.MeshStandardMaterial({
    map: brocadeTex,
    color: 0x932621,
    roughness: 0.75,
    metalness: 0.08
  });
  const cushion = new THREE.Mesh(cushionGeo, cushionMat);
  cushion.position.y = 0.022;
  cushion.castShadow = true;
  cushion.receiveShadow = true;
  cushion.name = 'almofada_tigela';
  group.add(cushion);

  // 2. Tigela de Bronze Martelado
  // Perfil de torneamento elegante da tigela
  const points = [];
  points.push(new THREE.Vector2(0.02, 0.0));
  points.push(new THREE.Vector2(0.05, 0.008));
  points.push(new THREE.Vector2(0.082, 0.035));
  points.push(new THREE.Vector2(0.086, 0.072));
  points.push(new THREE.Vector2(0.088, 0.085)); // lábio externo
  points.push(new THREE.Vector2(0.084, 0.085));
  points.push(new THREE.Vector2(0.081, 0.070));
  points.push(new THREE.Vector2(0.076, 0.035));
  points.push(new THREE.Vector2(0.046, 0.012));
  points.push(new THREE.Vector2(0.018, 0.006));

  const bowlGeo = new THREE.LatheGeometry(points, 48);
  const bronzeTex = createHammeredBronzeTexture();
  const bronzeMat = new THREE.MeshStandardMaterial({
    map: bronzeTex.diffuseMap,
    normalMap: bronzeTex.normalMap,
    color: 0xc49a45,
    roughness: 0.32,
    metalness: 0.85
  });
  const bowl = new THREE.Mesh(bowlGeo, bronzeMat);
  bowl.position.y = 0.036;
  bowl.castShadow = true;
  bowl.receiveShadow = true;
  bowl.name = 'tigela_bronze';
  group.add(bowl);

  // 3. Bastão de Madeira e Camurça
  const strikerGroup = new THREE.Group();
  strikerGroup.name = 'bastao_madeira_grupo';
  strikerGroup.position.set(0.085, 0.065, 0.06);
  strikerGroup.rotation.set(-0.35, 0.4, 0.85);

  const handleGeo = new THREE.CylinderGeometry(0.010, 0.014, 0.16, 16);
  const woodMat = new THREE.MeshStandardMaterial({
    color: 0x482e1d,
    roughness: 0.45
  });
  const handle = new THREE.Mesh(handleGeo, woodMat);
  handle.castShadow = true;
  strikerGroup.add(handle);

  // Luva de camurça na ponta inferior do bastão
  const suedeGeo = new THREE.CylinderGeometry(0.0142, 0.0142, 0.07, 16);
  const suedeMat = new THREE.MeshStandardMaterial({
    color: 0xa83226,
    roughness: 0.85
  });
  const suede = new THREE.Mesh(suedeGeo, suedeMat);
  suede.position.y = -0.045;
  suede.castShadow = true;
  strikerGroup.add(suede);

  group.add(strikerGroup);

  // Hitbox invisível na borda superior da tigela para golpe e arrasto orbital
  const hitGeo = new THREE.TorusGeometry(0.088, 0.03, 16, 32);
  hitGeo.rotateX(Math.PI / 2);
  const hitMat = new THREE.MeshBasicMaterial({ visible: false });
  const hitbox = new THREE.Mesh(hitGeo, hitMat);
  hitbox.position.y = 0.085;
  hitbox.name = 'hitbox_tigela';
  group.add(hitbox);

  return { group, bowl, strikerGroup, hitbox, bronzeMat, cushionMat };
}

/**
 * Cria o Rastelo de Madeira para a animação "Alisar areia"
 */
export function createSandRake() {
  const group = new THREE.Group();
  group.name = 'rastelo_madeira';
  group.position.set(-0.38, 0.018, 0.32);
  group.rotation.y = 0.4;

  const rakeWoodMat = new THREE.MeshStandardMaterial({
    color: 0x8a5d3b,
    roughness: 0.55
  });

  // Cabo cilíndrico fino
  const handleGeo = new THREE.CylinderGeometry(0.005, 0.005, 0.22, 12);
  handleGeo.rotateX(Math.PI / 2);
  const handle = new THREE.Mesh(handleGeo, rakeWoodMat);
  handle.castShadow = true;
  group.add(handle);

  // Cabeça transversal com dentes
  const headGeo = new THREE.BoxGeometry(0.12, 0.012, 0.016);
  const head = new THREE.Mesh(headGeo, rakeWoodMat);
  head.position.z = -0.11;
  head.castShadow = true;
  group.add(head);

  // 5 dentes de madeira
  for (let i = 0; i < 5; i++) {
    const toothGeo = new THREE.CylinderGeometry(0.002, 0.003, 0.016, 8);
    const tooth = new THREE.Mesh(toothGeo, rakeWoodMat);
    tooth.position.set(-0.048 + i * 0.024, -0.01, -0.11);
    tooth.castShadow = true;
    group.add(tooth);
  }

  return group;
}
