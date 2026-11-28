/**
 * Terreno Florestal e Leito do Riacho
 * Projeto: 02. Trilha do Mestre Mandou
 */

import * as THREE from 'three';

export function createForestTerrain() {
  const group = new THREE.Group();
  group.name = 'terreno_florestal';

  const width = 64;
  const depth = 64;
  const segments = 96;
  const geo = new THREE.PlaneGeometry(width, depth, segments, segments);
  geo.rotateX(-Math.PI / 2);

  const pos = geo.attributes.position;
  // Modelagem da topografia: vale fluvial central, colinas suaves nas margens e platôs para estruturas
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const z = pos.getZ(i);

    // Canal do riacho que serpenteia pelo parque (de z = -32 a +32 perto de x = -2 a +2)
    const riverCenter = Math.sin(z * 0.12) * 5.0 - 2.0;
    const distToRiver = Math.abs(x - riverCenter);

    let height = 0;
    if (distToRiver < 5.0) {
      // Depressão suave do leito do riacho
      const t = distToRiver / 5.0;
      height = -1.2 + (t * t) * 1.2;
    } else {
      // Colinas florestais e platôs
      const hill1 = Math.sin(x * 0.08) * Math.cos(z * 0.08) * 2.2;
      const hill2 = Math.cos(x * 0.15 + 1.0) * Math.sin(z * 0.12) * 1.1;

      // Platô elevado para o Sino Azul (x: 14, z: -6)
      const distToBell = Math.hypot(x - 14.0, z - (-6.0));
      const bellPlateau = Math.max(0, 3.2 * (1.0 - distToBell / 7.0));

      // Platô para a Cabana (x: -14, z: 10)
      const distToCabin = Math.hypot(x - (-14.0), z - 10.0);
      const cabinHill = Math.max(0, 3.8 * (1.0 - distToCabin / 8.0));

      height = Math.max(0, hill1 + hill2) + bellPlateau + cabinHill;
    }

    pos.setY(i, height);
  }
  geo.computeVertexNormals();

  // Textura procedural de solo florestal (terra batida, grama verde-musgo e líquen)
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#365a43'; // verde floresta profundo
  ctx.fillRect(0, 0, 512, 512);

  for (let i = 0; i < 400; i++) {
    const rx = Math.random() * 512;
    const ry = Math.random() * 512;
    const rr = 8 + Math.random() * 24;
    ctx.fillStyle = (i % 2 === 0) ? 'rgba(129, 148, 91, 0.45)' : 'rgba(154, 112, 74, 0.35)';
    ctx.beginPath();
    ctx.arc(rx, ry, rr, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(12, 12);

  const mat = new THREE.MeshStandardMaterial({
    map: texture,
    roughness: 0.88,
    metalness: 0.05
  });

  const terrainMesh = new THREE.Mesh(geo, mat);
  terrainMesh.receiveShadow = true;
  terrainMesh.name = 'chao_floresta';
  group.add(terrainMesh);

  // Seixos fluviais arredondados no leito do riacho
  const pebbleGeo = new THREE.DodecahedronGeometry(0.35, 1);
  pebbleGeo.scale(1.2, 0.6, 1.0);
  const pebbleMat = new THREE.MeshStandardMaterial({
    color: 0x6e766d,
    roughness: 0.65
  });
  const pebbles = new THREE.InstancedMesh(pebbleGeo, pebbleMat, 60);
  pebbles.name = 'seixos_riacho';
  const dummy = new THREE.Object3D();

  for (let i = 0; i < 60; i++) {
    const z = -28 + (i / 60) * 56;
    const riverCenter = Math.sin(z * 0.12) * 5.0 - 2.0;
    const x = riverCenter + (Math.random() - 0.5) * 4.0;
    const y = -0.6 + Math.random() * 0.2;

    dummy.position.set(x, y, z);
    dummy.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
    const s = 0.6 + Math.random() * 0.8;
    dummy.scale.set(s, s * 0.6, s);
    dummy.updateMatrix();
    pebbles.setMatrixAt(i, dummy.matrix);
  }
  pebbles.instanceMatrix.needsUpdate = true;
  pebbles.receiveShadow = true;
  group.add(pebbles);

  return { group, terrainMesh };
}

/**
 * Função utilitária para obter a altura do terreno em coordenadas (x, z)
 */
export function getTerrainHeightAt(x: number, z: number): number {
  const riverCenter = Math.sin(z * 0.12) * 5.0 - 2.0;
  const distToRiver = Math.abs(x - riverCenter);

  if (distToRiver < 5.0) {
    const t = distToRiver / 5.0;
    return -1.2 + (t * t) * 1.2;
  }

  const hill1 = Math.sin(x * 0.08) * Math.cos(z * 0.08) * 2.2;
  const hill2 = Math.cos(x * 0.15 + 1.0) * Math.sin(z * 0.12) * 1.1;

  const distToBell = Math.hypot(x - 14.0, z - (-6.0));
  const bellPlateau = Math.max(0, 3.2 * (1.0 - distToBell / 7.0));

  const distToCabin = Math.hypot(x - (-14.0), z - 10.0);
  const cabinHill = Math.max(0, 3.8 * (1.0 - distToCabin / 8.0));

  return Math.max(0, hill1 + hill2) + bellPlateau + cabinHill;
}
