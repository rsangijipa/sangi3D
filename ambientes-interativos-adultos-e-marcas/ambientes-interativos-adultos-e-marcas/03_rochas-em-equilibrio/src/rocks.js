import * as THREE from 'three';

// 3D Noise para escultura procedural
function hash(x, y, z) {
  let h = Math.imul(x * 374761393 + y * 668265263 + z * 951214213, 1274126177);
  h = Math.imul(h ^ (h >>> 13), 1103515245);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}

function smoothNoise3D(x, y, z) {
  const iX = Math.floor(x), iY = Math.floor(y), iZ = Math.floor(z);
  const fx = x - iX, fy = y - iY, fz = z - iZ;
  const u = fx * fx * (3 - 2 * fx);
  const v = fy * fy * (3 - 2 * fy);
  const w = fz * fz * (3 - 2 * fz);

  const n000 = hash(iX, iY, iZ);
  const n100 = hash(iX + 1, iY, iZ);
  const n010 = hash(iX, iY + 1, iZ);
  const n110 = hash(iX + 1, iY + 1, iZ);
  const n001 = hash(iX, iY, iZ + 1);
  const n101 = hash(iX + 1, iY, iZ + 1);
  const n011 = hash(iX, iY + 1, iZ + 1);
  const n111 = hash(iX + 1, iY + 1, iZ + 1);

  const x00 = n000 + u * (n100 - n000);
  const x10 = n010 + u * (n110 - n010);
  const x01 = n001 + u * (n101 - n001);
  const x11 = n011 + u * (n111 - n011);

  const y0 = x00 + v * (x10 - x00);
  const y1 = x01 + v * (x11 - x01);

  return y0 + w * (y1 - y0);
}

function fbm3D(x, y, z, octaves = 3) {
  let val = 0, amp = 0.5, freq = 1;
  for (let i = 0; i < octaves; i++) {
    val += amp * smoothNoise3D(x * freq, y * freq, z * freq);
    freq *= 2.05;
    amp *= 0.5;
  }
  return val;
}

/**
 * Cria a geometria procedural de um seixo de rio (smooth river stone).
 */
export function createRiverRockGeometry(dimensions = [0.42, 0.16, 0.32], seed = 1, options = {}) {
  const [rx, ry, rz] = dimensions;
  const detail = options.detail ?? 3;
  const geo = new THREE.IcosahedronGeometry(1, detail);
  const pos = geo.attributes.position;
  const count = pos.count;

  const sX = seed * 13.71;
  const sY = seed * 29.33;
  const sZ = seed * 47.19;

  for (let i = 0; i < count; i++) {
    let x = pos.getX(i);
    let y = pos.getY(i);
    let z = pos.getZ(i);

    let px = x * rx;
    let py = y * ry;
    let pz = z * rz;

    const nx = (x + sX) * 2.2;
    const ny = (y + sY) * 2.2;
    const nz = (z + sZ) * 2.2;
    const noise = fbm3D(nx, ny, nz, 3) - 0.5;

    // Aplainamento superior e inferior para criar facetas de empilhamento estáveis
    const flattenFactor = options.flattenTopBottom ? (options.flattenTopBottom ?? 0.8) : 0.82;
    const normY = py / ry;
    if (Math.abs(normY) > flattenFactor) {
      const sign = Math.sign(normY);
      const excess = Math.abs(normY) - flattenFactor;
      py = sign * (flattenFactor * ry + excess * ry * 0.3);
    }

    const asymmetry = Math.sin(px * 3.0 + sX) * 0.02 * rx;
    px += px * noise * 0.25 + asymmetry;
    py += py * noise * 0.2;
    pz += pz * noise * 0.25;

    pos.setXYZ(i, px, py, pz);
  }

  geo.computeVertexNormals();
  geo.computeBoundingBox();
  geo.computeBoundingSphere();

  let cmX = 0, cmY = 0, cmZ = 0;
  for (let i = 0; i < count; i++) {
    cmX += pos.getX(i);
    cmY += pos.getY(i);
    cmZ += pos.getZ(i);
  }
  geo.userData.centerOfMass = new THREE.Vector3(cmX / count, cmY / count, cmZ / count);
  geo.userData.dimensions = [rx, ry, rz];

  return geo;
}

/**
 * Cria a imponente rocha fluvial de base (como no mockup),
 * com camadas de estratificação horizontal e topo plano para empilhamento.
 */
export function createBaseRiverRockGeometry() {
  const geo = new THREE.CylinderGeometry(1.35, 1.55, 0.52, 48, 12);
  const pos = geo.attributes.position;
  const count = pos.count;

  for (let i = 0; i < count; i++) {
    let x = pos.getX(i);
    let y = pos.getY(i);
    let z = pos.getZ(i);

    // Formato elíptico natural do leito
    x *= 1.15;
    z *= 0.95;

    const rad = Math.hypot(x, z);
    const angle = Math.atan2(z, x);

    // Camadas de estratificação geológica horizontal (fissuras de erosão fluvial)
    const strataNoise = Math.sin(y * 28.0 + Math.cos(angle * 4.0) * 1.5) * 0.035;
    const flankNoise = (fbm3D(Math.cos(angle) * 1.8, y * 3.5, Math.sin(angle) * 1.8, 3) - 0.5) * 0.22;

    if (rad > 0.3) {
      const scale = 1 + (strataNoise + flankNoise) * Math.min(1, rad / 1.1);
      x *= scale;
      z *= scale;
    }

    // Topo plano ligeiramente abaulado com micro-relevo
    if (y > 0.18) {
      const topRelief = (fbm3D(x * 2.2 + 1.5, 0.4, z * 2.2 + 3.2, 2) - 0.5) * 0.025;
      y = 0.25 - (rad * rad) * 0.025 + topRelief;
    }

    pos.setXYZ(i, x, y, z);
  }

  geo.computeVertexNormals();
  geo.computeBoundingBox();
  geo.computeBoundingSphere();
  return geo;
}

/**
 * Gera texturas PBR procedurais em CanvasTexture para rochas.
 */
export function createProceduralRockMaterial(config = {}) {
  const {
    baseColor = '#6c7570',
    veinColor = '#9da39e',
    darkColor = '#3b423f',
    moss = false,
    roughness = 0.68,
    metalness = 0.04,
    size = 512,
  } = config;

  const cCanvas = document.createElement('canvas');
  cCanvas.width = cCanvas.height = size;
  const ctx = cCanvas.getContext('2d');
  ctx.fillStyle = baseColor;
  ctx.fillRect(0, 0, size, size);

  const cData = ctx.getImageData(0, 0, size, size);
  const pixels = cData.data;

  const baseRGB = hexToRgb(baseColor);
  const veinRGB = hexToRgb(veinColor);
  const darkRGB = hexToRgb(darkColor);

  const nCanvas = document.createElement('canvas');
  nCanvas.width = nCanvas.height = size;
  const nCtx = nCanvas.getContext('2d');
  const nData = nCtx.createImageData(size, size);
  const nPixels = nData.data;

  const rCanvas = document.createElement('canvas');
  rCanvas.width = rCanvas.height = size;
  const rCtx = rCanvas.getContext('2d');
  const rData = rCtx.createImageData(size, size);
  const rPixels = rData.data;

  const heights = new Float32Array(size * size);
  for (let y = 0; y < size; y++) {
    const ny = y / size;
    for (let x = 0; x < size; x++) {
      const nx = x / size;
      const idx = y * size + x;

      // Camadas estratificadas (veios longitudinais)
      const strata = Math.sin(ny * 32.0 + fbm3D(nx * 6.0, ny * 6.0, 1.2, 2) * 8.0) * 0.5 + 0.5;
      const micro = fbm3D(nx * 36.0, ny * 36.0, 2.7, 3);
      const coarse = fbm3D(nx * 9.0, ny * 9.0, 0.5, 2);

      const h = strata * 0.35 + micro * 0.45 + coarse * 0.2;
      heights[idx] = h;

      const pIdx = idx * 4;
      const t = Math.max(0, Math.min(1, h));
      let r = baseRGB.r * (1 - t) + veinRGB.r * t;
      let g = baseRGB.g * (1 - t) + veinRGB.g * t;
      let b = baseRGB.b * (1 - t) + veinRGB.b * t;

      if (micro < 0.34) {
        r = r * 0.75 + darkRGB.r * 0.25;
        g = g * 0.75 + darkRGB.g * 0.25;
        b = b * 0.75 + darkRGB.b * 0.25;
      }

      let roughVal = Math.floor(roughness * 255 + (micro - 0.5) * 45);
      if (moss) {
        const mossNoise = fbm3D(nx * 8.0 + 2.1, ny * 8.0 + 3.2, 4.0, 3);
        if (mossNoise > 0.54) {
          const mossT = Math.min(1, (mossNoise - 0.54) * 4.2);
          r = r * (1 - mossT) + 68 * mossT;
          g = g * (1 - mossT) + 115 * mossT;
          b = b * (1 - mossT) + 52 * mossT;
          roughVal = Math.min(255, roughVal + 55);
        }
      }

      pixels[pIdx] = Math.min(255, Math.max(0, r));
      pixels[pIdx + 1] = Math.min(255, Math.max(0, g));
      pixels[pIdx + 2] = Math.min(255, Math.max(0, b));
      pixels[pIdx + 3] = 255;

      rPixels[pIdx] = roughVal;
      rPixels[pIdx + 1] = roughVal;
      rPixels[pIdx + 2] = roughVal;
      rPixels[pIdx + 3] = 255;
    }
  }

  ctx.putImageData(cData, 0, 0);
  rCtx.putImageData(rData, 0, 0);

  const bumpStrength = 2.5;
  for (let y = 0; y < size; y++) {
    const ym1 = (y - 1 + size) % size;
    const yp1 = (y + 1) % size;
    for (let x = 0; x < size; x++) {
      const xm1 = (x - 1 + size) % size;
      const xp1 = (x + 1) % size;

      const idx = y * size + x;
      const dx = (heights[y * size + xp1] - heights[y * size + xm1]) * bumpStrength;
      const dy = (heights[yp1 * size + x] - heights[ym1 * size + x]) * bumpStrength;

      const len = Math.hypot(dx, dy, 1.0);
      const nx = (-dx / len) * 0.5 + 0.5;
      const ny = (-dy / len) * 0.5 + 0.5;
      const nz = (1.0 / len) * 0.5 + 0.5;

      const pIdx = idx * 4;
      nPixels[pIdx] = Math.floor(nx * 255);
      nPixels[pIdx + 1] = Math.floor(ny * 255);
      nPixels[pIdx + 2] = Math.floor(nz * 255);
      nPixels[pIdx + 3] = 255;
    }
  }
  nCtx.putImageData(nData, 0, 0);

  const mapTex = new THREE.CanvasTexture(cCanvas);
  mapTex.colorSpace = THREE.SRGBColorSpace;
  mapTex.wrapS = mapTex.wrapT = THREE.RepeatWrapping;

  const normalTex = new THREE.CanvasTexture(nCanvas);
  normalTex.wrapS = normalTex.wrapT = THREE.RepeatWrapping;

  const roughTex = new THREE.CanvasTexture(rCanvas);
  roughTex.wrapS = roughTex.wrapT = THREE.RepeatWrapping;

  return new THREE.MeshStandardMaterial({
    map: mapTex,
    normalMap: normalTex,
    normalScale: new THREE.Vector2(0.7, 0.7),
    roughnessMap: roughTex,
    roughness,
    metalness,
  });
}

function hexToRgb(hex) {
  let c = hex.replace('#', '');
  if (c.length === 3) c = c.split('').map((x) => x + x).join('');
  const num = parseInt(c, 16);
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
}
