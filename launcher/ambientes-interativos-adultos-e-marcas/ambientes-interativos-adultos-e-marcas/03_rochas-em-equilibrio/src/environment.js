import * as THREE from 'three';

/**
 * Cria o vale fluvial com bambuzal denso, folhagem, névoa matinal
 * e seixos com musgo natural inspirados no mockup fotorrealista.
 */
export function createBambooGrove(count = 140) {
  const group = new THREE.Group();
  group.name = 'bambuzal_fundo';

  // 1. Colmos de bambu (InstancedMesh)
  const height = 8.5;
  const radius = 0.052;
  const radialSegments = 10;
  const heightSegments = 24;

  const geo = new THREE.CylinderGeometry(radius * 0.75, radius * 1.2, height, radialSegments, heightSegments);
  const pos = geo.attributes.position;

  // Nós salientes nos colmos
  for (let i = 0; i < pos.count; i++) {
    const y = pos.getY(i);
    const nodeInterval = 0.58;
    const distToNode = Math.abs(((y + height / 2) % nodeInterval) - nodeInterval / 2);
    if (distToNode < 0.045) {
      const expansion = (1 - distToNode / 0.045) * 0.24;
      pos.setX(i, pos.getX(i) * (1 + expansion));
      pos.setZ(i, pos.getZ(i) * (1 + expansion));
    }
  }
  geo.computeVertexNormals();

  const mat = new THREE.MeshStandardMaterial({
    color: 0x4a633a,
    roughness: 0.32,
    metalness: 0.04,
  });

  const instancedBamboos = new THREE.InstancedMesh(geo, mat, count);
  instancedBamboos.castShadow = true;
  instancedBamboos.receiveShadow = true;

  const dummy = new THREE.Object3D();
  const color = new THREE.Color();
  const palette = [0x3c522d, 0x4a633a, 0x567344, 0x66824d, 0x768f56, 0x8a995e, 0x2e4222];

  let seed = 88;
  const rnd = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };

  for (let i = 0; i < count; i++) {
    // Distribuir em densidade contínua cobrindo toda a extensão horizontal do horizonte
    const angleRatio = i / count;
    const x = (angleRatio - 0.5) * 22.0 + (rnd() - 0.5) * 2.5;
    const z = -2.2 - rnd() * 8.5;
    const y = height / 2 - 0.4 + (rnd() - 0.5) * 1.4;

    dummy.position.set(x, y, z);
    dummy.scale.set(
      0.85 + rnd() * 0.45,
      0.85 + rnd() * 0.4,
      0.85 + rnd() * 0.45
    );
    dummy.rotation.set(
      (rnd() - 0.5) * 0.12,
      rnd() * Math.PI * 2,
      (rnd() - 0.5) * 0.12
    );
    dummy.updateMatrix();

    instancedBamboos.setMatrixAt(i, dummy.matrix);
    color.setHex(palette[Math.floor(rnd() * palette.length)]);
    instancedBamboos.setColorAt(i, color);
  }

  instancedBamboos.instanceMatrix.needsUpdate = true;
  if (instancedBamboos.instanceColor) instancedBamboos.instanceColor.needsUpdate = true;
  group.add(instancedBamboos);

  // 2. Folhagem densa do bambuzal (folhas lanceoladas em tufos)
  const leafGeo = new THREE.PlaneGeometry(1.1, 0.55);
  const leafCanvas = document.createElement('canvas');
  leafCanvas.width = leafCanvas.height = 128;
  const lctx = leafCanvas.getContext('2d');
  lctx.fillStyle = '#3f5d2d';
  lctx.beginPath();
  lctx.ellipse(64, 64, 58, 24, -0.25, 0, Math.PI * 2);
  lctx.fill();
  lctx.fillStyle = '#55783f';
  lctx.beginPath();
  lctx.ellipse(64, 64, 48, 16, -0.25, 0, Math.PI * 2);
  lctx.fill();

  const leafTex = new THREE.CanvasTexture(leafCanvas);
  const leafMat = new THREE.MeshStandardMaterial({
    map: leafTex,
    transparent: true,
    opacity: 0.94,
    roughness: 0.38,
    side: THREE.DoubleSide,
    alphaTest: 0.12,
  });

  const leafCount = 140;
  const instancedLeaves = new THREE.InstancedMesh(leafGeo, leafMat, leafCount);
  for (let i = 0; i < leafCount; i++) {
    const isLeft = i < leafCount * 0.55;
    const x = isLeft ? -1.8 - rnd() * 5.2 : 1.8 + rnd() * 5.2;
    const z = -1.8 - rnd() * 7.5;
    const y = 1.6 + rnd() * 5.2;

    dummy.position.set(x, y, z);
    const s = 1.2 + rnd() * 1.6;
    dummy.scale.set(s, s * 0.65, s);
    dummy.rotation.set(rnd() * 0.5 - 0.25, rnd() * Math.PI * 2, rnd() * 0.6);
    dummy.updateMatrix();

    instancedLeaves.setMatrixAt(i, dummy.matrix);
  }
  instancedLeaves.instanceMatrix.needsUpdate = true;
  group.add(instancedLeaves);

  // 3. Facho de luz matinal volumétrico suave (God-Rays ao fundo)
  const rayGeo = new THREE.PlaneGeometry(14, 12);
  const rayCanvas = document.createElement('canvas');
  rayCanvas.width = 256;
  rayCanvas.height = 256;
  const rctx = rayCanvas.getContext('2d');
  const grad = rctx.createRadialGradient(128, 50, 10, 128, 128, 128);
  grad.addColorStop(0, 'rgba(255, 248, 220, 0.42)');
  grad.addColorStop(0.35, 'rgba(255, 240, 190, 0.2)');
  grad.addColorStop(0.7, 'rgba(220, 240, 225, 0.08)');
  grad.addColorStop(1, 'rgba(200, 230, 215, 0)');
  rctx.fillStyle = grad;
  rctx.fillRect(0, 0, 256, 256);

  const rayTex = new THREE.CanvasTexture(rayCanvas);
  const rayMat = new THREE.MeshBasicMaterial({
    map: rayTex,
    transparent: true,
    opacity: 0.52,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    side: THREE.DoubleSide,
  });

  const sunRay = new THREE.Mesh(rayGeo, rayMat);
  sunRay.position.set(0.5, 4.2, -5.8);
  sunRay.rotation.set(0.12, -0.15, -0.08);
  group.add(sunRay);

  return group;
}

/**
 * Cria os seixos fluviais arredondados e pedras cobertas de musgo.
 */
export function createRiverbedPebbles(count = 280) {
  const geo = new THREE.IcosahedronGeometry(0.13, 2);
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    pos.setY(i, pos.getY(i) * 0.52);
  }
  geo.computeVertexNormals();

  const mat = new THREE.MeshStandardMaterial({
    color: 0x5a5e5c,
    roughness: 0.65,
    metalness: 0.03,
  });

  const instancedPebbles = new THREE.InstancedMesh(geo, mat, count);
  instancedPebbles.name = 'margem_seixos';
  instancedPebbles.receiveShadow = true;
  instancedPebbles.castShadow = true;

  const dummy = new THREE.Object3D();
  const color = new THREE.Color();

  const palette = [
    0x343836, // ardósia escura
    0x4f5452, // cinza rio
    0x6b706e, // cinza médio
    0x8a7b64, // ocre terroso
    0x9e8766, // ocre claro arenoso
    0x465c3b, // seixo musgoso verde escuro
    0x58734a, // seixo musgoso vivo
    0x2c332f, // basalto
  ];

  let seed = 412;
  const rnd = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };

  for (let i = 0; i < count; i++) {
    const isLeftShore = i < count * 0.44;
    const isRightShore = i >= count * 0.44 && i < count * 0.84;

    let x, z;
    if (isLeftShore) {
      x = -1.2 - rnd() * 3.8;
      z = 0.5 + (rnd() - 0.5) * 4.2;
    } else if (isRightShore) {
      x = 1.4 + rnd() * 3.2;
      z = 0.2 + (rnd() - 0.5) * 4.0;
    } else {
      x = (rnd() - 0.5) * 3.4;
      z = -1.2 + (rnd() - 0.5) * 3.5;
    }

    const y = -0.15 + (rnd() - 0.5) * 0.08;

    dummy.position.set(x, y, z);
    const s = 0.5 + rnd() * 1.8;
    dummy.scale.set(
      s * (0.85 + rnd() * 0.35),
      s * (0.45 + rnd() * 0.3),
      s * (0.85 + rnd() * 0.35)
    );
    dummy.rotation.set((rnd() - 0.5) * 0.35, rnd() * Math.PI * 2, (rnd() - 0.5) * 0.35);
    dummy.updateMatrix();

    instancedPebbles.setMatrixAt(i, dummy.matrix);
    color.setHex(palette[Math.floor(rnd() * palette.length)]);
    instancedPebbles.setColorAt(i, color);
  }

  instancedPebbles.instanceMatrix.needsUpdate = true;
  if (instancedPebbles.instanceColor) instancedPebbles.instanceColor.needsUpdate = true;

  return instancedPebbles;
}

/**
 * Cria o vale fluvial com extensão ampla (36m x 32m) sem bordas visíveis.
 */
export function createRiverBedTerrain() {
  const geo = new THREE.PlaneGeometry(38, 34, 64, 64);
  geo.rotateX(-Math.PI / 2);

  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const z = pos.getZ(i);

    // Canal central do rio raso
    const riverAxis = x + z * 0.25;
    let y = -0.28 + Math.min(0.24, Math.abs(riverAxis) * 0.08);

    // Margem esquerda subindo suavemente
    if (x < -1.8) {
      y += Math.pow((Math.abs(x) - 1.8) * 0.35, 1.3);
    }
    // Margem direita
    if (x > 1.9) {
      y += Math.pow((x - 1.9) * 0.32, 1.3);
    }
    // Elevação ao fundo
    if (z < -3.0) {
      y += (Math.abs(z) - 3.0) * 0.14;
    }

    // Ondulação suave de cascalho
    y += Math.sin(x * 2.8 + z * 1.8) * 0.025 + Math.cos(x * 5.5 - z * 3.0) * 0.012;

    pos.setY(i, y);
  }

  geo.computeVertexNormals();

  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 512;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#4c5248';
  ctx.fillRect(0, 0, 512, 512);

  const imgData = ctx.getImageData(0, 0, 512, 512);
  const d = imgData.data;
  for (let i = 0; i < d.length; i += 4) {
    const n = (Math.random() - 0.5) * 35;
    const isMoss = Math.random() < 0.32;
    if (isMoss) {
      d[i] = Math.min(255, Math.max(0, 64 + n));
      d[i + 1] = Math.min(255, Math.max(0, 88 + n));
      d[i + 2] = Math.min(255, Math.max(0, 48 + n));
    } else {
      d[i] = Math.min(255, Math.max(0, 92 + n));
      d[i + 1] = Math.min(255, Math.max(0, 88 + n));
      d[i + 2] = Math.min(255, Math.max(0, 78 + n));
    }
  }
  ctx.putImageData(imgData, 0, 0);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(16, 16);

  const mat = new THREE.MeshStandardMaterial({
    map: tex,
    roughness: 0.85,
    metalness: 0.02,
  });

  const mesh = new THREE.Mesh(geo, mat);
  mesh.name = 'leito_rio';
  mesh.receiveShadow = true;
  return mesh;
}
