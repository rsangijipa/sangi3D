import * as THREE from '../vendor/three.module.js';

/**
 * shared/engine/materials.js
 * Fábrica de materiais PBR e texturas procedurais com cache e adaptação de qualidade para Sangi3D
 */

const textureCache = new Map();

function applyColorSpace(tex) {
  if ('SRGBColorSpace' in THREE && THREE.SRGBColorSpace) {
    tex.colorSpace = THREE.SRGBColorSpace;
  }
  return tex;
}

function qualityConfig(quality = 'HIGH') {
  const q = String(quality || 'HIGH').toUpperCase();
  switch (q) {
    case 'ULTRA':
      return { tier: 'ULTRA', texSize: 512, anisotropy: 8, physical: true, transmission: true, dispersion: true };
    case 'BALANCED':
      return { tier: 'BALANCED', texSize: 256, anisotropy: 2, physical: true, transmission: true, dispersion: false };
    case 'LOW':
      return { tier: 'LOW', texSize: 128, anisotropy: 1, physical: false, transmission: false, dispersion: false };
    case 'HIGH':
    default:
      return { tier: 'HIGH', texSize: 512, anisotropy: 4, physical: true, transmission: true, dispersion: false };
  }
}

function getOrCreateCachedTexture(key, factory) {
  if (textureCache.has(key)) return textureCache.get(key);
  const tex = factory();
  textureCache.set(key, tex);
  return tex;
}

function clamp01(v) {
  return Math.max(0, Math.min(1, Number(v) || 0));
}

function hash2D(x, y, seed) {
  let value = Math.imul(x + seed, 1597334677) ^ Math.imul(y, 3812015801);
  value = Math.imul(value ^ (value >>> 16), 0x45d9f3b);
  return ((value ^ (value >>> 16)) >>> 0) / 4294967295;
}

function valueNoise2D(x, y, seed) {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const a = x - ix;
  const b = y - iy;
  const u = a * a * (3 - 2 * a);
  const v = b * b * (3 - 2 * b);
  const lo = hash2D(ix, iy, seed) * (1 - u) + hash2D(ix + 1, iy, seed) * u;
  const hi = hash2D(ix, iy + 1, seed) * (1 - u) + hash2D(ix + 1, iy + 1, seed) * u;
  return lo * (1 - v) + hi * v;
}

function makeCanvas(width, height) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  return canvas;
}

function buildWoodCanvasTexture(width, height, seed, grainStrength = 1, wear = 0, anisotropy = 4) {
  const canvas = makeCanvas(width, height);
  const context = canvas.getContext('2d');
  const image = context.createImageData(width, height);
  for (let y = 0; y < height; y++) {
    const v = y / height;
    for (let x = 0; x < width; x++) {
      const u = x / width;
      const curve = v + (valueNoise2D(u * 4, v * 8, seed) - 0.5) * 0.075 * grainStrength;
      const rings = Math.sin((curve * 18 + valueNoise2D(u * 3, curve * 10, seed) * 1.3) * Math.PI * 2);
      const fibers = valueNoise2D(u * 12, curve * 205, seed);
      const pores = valueNoise2D(u * 32, curve * 98, seed) ** 6;
      const scuff = wear > 0 ? (valueNoise2D(u * 20, v * 20, seed + 99) - 0.5) * 28 * wear : 0;
      const tone = 225 + 28 * (valueNoise2D(u * 3, v * 12, seed) - 0.5) * grainStrength
        - 22 * Math.max(0, rings) ** 7 - 22 * pores + 15 * (fibers - 0.5) + scuff;
      const offset = (y * width + x) * 4;
      image.data[offset] = Math.max(0, Math.min(255, tone + 4));
      image.data[offset + 1] = Math.max(0, Math.min(255, tone));
      image.data[offset + 2] = Math.max(0, Math.min(255, tone - 7));
      image.data[offset + 3] = 255;
    }
  }
  context.putImageData(image, 0, 0);
  const texture = new THREE.CanvasTexture(canvas);
  applyColorSpace(texture);
  texture.wrapS = THREE.MirroredRepeatWrapping;
  texture.wrapT = THREE.MirroredRepeatWrapping;
  texture.anisotropy = anisotropy;
  return texture;
}

function buildClayCanvasTexture(size, seed, plasticity = 0.5, anisotropy = 4) {
  const canvas = makeCanvas(size, size);
  const ctx = canvas.getContext('2d');
  const img = ctx.createImageData(size, size);
  for (let y = 0; y < size; y++) {
    const v = y / size;
    for (let x = 0; x < size; x++) {
      const u = x / size;
      const groove = Math.sin(v * Math.PI * 34 + valueNoise2D(u * 8, v * 8, seed) * 2.5) * (0.3 + plasticity * 0.7);
      const grit = (valueNoise2D(u * 42, v * 42, seed + 13) - 0.5) * (1 - plasticity * 0.45);
      const val = Math.max(0, Math.min(255, 190 + groove * 16 + grit * 34));
      const idx = (y * size + x) * 4;
      img.data[idx] = val;
      img.data[idx + 1] = val;
      img.data[idx + 2] = val;
      img.data[idx + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.anisotropy = anisotropy;
  return texture;
}

function buildMetalScratchTexture(size, seed, scratches = 0.2, wear = 0.15, anisotropy = 4) {
  const canvas = makeCanvas(size, size);
  const ctx = canvas.getContext('2d');
  const img = ctx.createImageData(size, size);
  for (let y = 0; y < size; y++) {
    const v = y / size;
    for (let x = 0; x < size; x++) {
      const u = x / size;
      const brush = valueNoise2D(u * 6, v * 120, seed) * 0.65;
      const micro = valueNoise2D(u * 36, v * 36, seed + 51) * wear;
      const streak = Math.pow(valueNoise2D(u * 14, v * 90, seed + 29), 4) * scratches * 1.4;
      const val = Math.max(0, Math.min(255, Math.round((0.35 + brush * 0.35 + micro * 0.2 + streak * 0.3) * 255)));
      const idx = (y * size + x) * 4;
      img.data[idx] = val;
      img.data[idx + 1] = val;
      img.data[idx + 2] = val;
      img.data[idx + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.anisotropy = anisotropy;
  return texture;
}

const METAL_PRESETS = {
  steel: { color: 0xc8cfd6, roughness: 0.28, metalness: 0.94 },
  brass: { color: 0xd4af37, roughness: 0.30, metalness: 0.90 },
  copper: { color: 0xb87333, roughness: 0.27, metalness: 0.92 },
  iron: { color: 0x4b4f54, roughness: 0.56, metalness: 0.85 },
  aluminium: { color: 0xd9dfe4, roughness: 0.24, metalness: 0.93 },
  chrome: { color: 0xeef2f5, roughness: 0.12, metalness: 0.98 }
};

export function createGlassMaterial({
  color = 0xffffff,
  tint,
  transmission = 0.9,
  thickness = 0.25,
  roughness = 0.08,
  dispersion = 0.02,
  ior = 1.52,
  opacity = 0.35,
  attenuationColor,
  attenuationDistance = 1.2,
  quality = 'HIGH'
} = {}) {
  const q = qualityConfig(quality);
  const resolvedColor = tint !== undefined ? tint : color;

  if (!q.physical) {
    return new THREE.MeshStandardMaterial({
      color: resolvedColor,
      transparent: true,
      opacity: clamp01(opacity),
      roughness: Math.max(0.08, roughness),
      metalness: 0.08
    });
  }

  const params = {
    color: resolvedColor,
    transparent: true,
    opacity: clamp01(opacity),
    roughness: clamp01(roughness),
    metalness: 0.05,
    clearcoat: 1.0,
    clearcoatRoughness: Math.min(0.15, clamp01(roughness) + 0.03),
    ior,
    thickness,
    transmission: q.transmission ? clamp01(transmission) : 0
  };
  if (attenuationColor !== undefined) {
    params.attenuationColor = new THREE.Color(attenuationColor);
    params.attenuationDistance = attenuationDistance;
  }

  const mat = new THREE.MeshPhysicalMaterial(params);
  if (q.dispersion && 'dispersion' in mat) {
    mat.dispersion = dispersion;
  }
  return mat;
}

export function createWoodMaterial({
  color = 0xd4a373,
  grain = 1.0,
  varnish = 0.35,
  wear = 0.15,
  roughness = 0.62,
  seed = 31,
  repeat = [1, 1],
  quality = 'HIGH'
} = {}) {
  const q = qualityConfig(quality);
  const width = q.texSize;
  const height = Math.max(64, Math.round(q.texSize / 2));
  const key = `wood:${width}x${height}:${seed}:${Number(grain).toFixed(2)}:${Number(wear).toFixed(2)}:${q.tier}`;

  const map = getOrCreateCachedTexture(key, () =>
    buildWoodCanvasTexture(width, height, seed, grain, wear, q.anisotropy)
  );
  if (Array.isArray(repeat) && repeat.length >= 2) {
    map.repeat.set(repeat[0], repeat[1]);
  }

  const effRoughness = clamp01(roughness - varnish * 0.22 + wear * 0.14);
  if (q.physical && varnish > 0.05) {
    return new THREE.MeshPhysicalMaterial({
      color,
      map,
      bumpMap: map,
      bumpScale: 0.008 + wear * 0.006,
      roughness: effRoughness,
      metalness: 0.02,
      clearcoat: clamp01(varnish),
      clearcoatRoughness: clamp01(0.15 + wear * 0.35)
    });
  }

  return new THREE.MeshStandardMaterial({
    color,
    map,
    bumpMap: map,
    bumpScale: 0.008,
    roughness: effRoughness,
    metalness: 0.02
  });
}

export function createClayMaterial({
  color = 0xc97b5d,
  moisture = 0.25,
  plasticity = 0.5,
  roughness = 0.85,
  seed = 17,
  quality = 'HIGH'
} = {}) {
  const q = qualityConfig(quality);
  const m = clamp01(moisture);
  const p = clamp01(plasticity);
  const key = `clay:${q.texSize}:${seed}:${p.toFixed(2)}:${q.tier}`;

  const bumpMap = getOrCreateCachedTexture(key, () =>
    buildClayCanvasTexture(q.texSize, seed, p, q.anisotropy)
  );

  // Argila úmida reflete mais (roughness cai conforme umidade sobe)
  const effRoughness = clamp01(roughness * (1 - m * 0.55));
  if (q.physical) {
    return new THREE.MeshPhysicalMaterial({
      color,
      roughness: effRoughness,
      metalness: 0.0,
      bumpMap,
      bumpScale: 0.006 + (1 - p) * 0.008,
      clearcoat: m * 0.75,
      clearcoatRoughness: clamp01(0.45 - m * 0.3),
      sheen: (1 - m) * 0.25,
      sheenRoughness: 0.8
    });
  }

  return new THREE.MeshStandardMaterial({
    color,
    roughness: effRoughness,
    metalness: 0.0,
    bumpMap,
    bumpScale: 0.006
  });
}

export function createMetalMaterial({
  type = 'steel',
  color,
  roughness,
  scratches = 0.2,
  wear = 0.15,
  metalness,
  seed = 43,
  quality = 'HIGH'
} = {}) {
  const q = qualityConfig(quality);
  const preset = METAL_PRESETS[String(type || 'steel').toLowerCase()] || METAL_PRESETS.steel;
  const resolvedColor = color !== undefined ? color : preset.color;
  const resolvedMetalness = metalness !== undefined ? clamp01(metalness) : preset.metalness;
  const resolvedRoughness = roughness !== undefined ? clamp01(roughness) : clamp01(preset.roughness + wear * 0.12);

  const s = clamp01(scratches);
  const w = clamp01(wear);
  const key = `metal:${q.texSize}:${seed}:${s.toFixed(2)}:${w.toFixed(2)}:${q.tier}`;
  const roughnessMap = getOrCreateCachedTexture(key, () =>
    buildMetalScratchTexture(q.texSize, seed, s, w, q.anisotropy)
  );

  return new THREE.MeshStandardMaterial({
    color: resolvedColor,
    metalness: resolvedMetalness,
    roughness: resolvedRoughness,
    roughnessMap,
    bumpMap: roughnessMap,
    bumpScale: 0.002 + s * 0.004
  });
}

export function clearMaterialTextureCache() {
  for (const tex of textureCache.values()) {
    try { tex.dispose(); } catch {}
  }
  textureCache.clear();
}

export class MaterialFactory {
  static createNoiseTexture(width = 256, height = 256, scale = 16) {
    const canvas = makeCanvas(width, height);
    const ctx = canvas.getContext('2d');
    const imgData = ctx.createImageData(width, height);
    const data = imgData.data;

    for (let i = 0; i < data.length; i += 4) {
      const val = Math.floor(Math.random() * 255);
      data[i] = val;
      data[i + 1] = val;
      data[i + 2] = val;
      data[i + 3] = 255;
    }
    ctx.putImageData(imgData, 0, 0);

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(scale, scale);
    return texture;
  }

  static createWoodTexture(width = 512, height = 256, seed = 31) {
    const key = `wood:${width}x${height}:${seed}:1.00:0.00:HIGH`;
    return getOrCreateCachedTexture(key, () =>
      buildWoodCanvasTexture(width, height, seed, 1, 0, 4)
    );
  }

  static wood(color = 0xd4a373, roughness = 0.72) {
    return createWoodMaterial({ color, roughness, varnish: 0, wear: 0 });
  }

  static brass(roughness = 0.32, metalness = 0.88) {
    return createMetalMaterial({ type: 'brass', roughness, metalness, scratches: 0.1, wear: 0.05 });
  }

  static metal(color = 0xcccccc, roughness = 0.28, metalness = 0.95) {
    return createMetalMaterial({ type: 'steel', color, roughness, metalness, scratches: 0.1, wear: 0.05 });
  }

  static glass(color = 0xffffff, opacity = 0.35, roughness = 0.1) {
    return createGlassMaterial({ color, opacity, roughness, transmission: 0.85, ior: 1.52 });
  }

  static stone(color = 0x8a817c, roughness = 0.85) {
    return new THREE.MeshStandardMaterial({
      color: color,
      roughness: roughness,
      metalness: 0.02
    });
  }

  static paper(color = 0xfaf5e9, roughness = 0.9) {
    return new THREE.MeshStandardMaterial({
      color: color,
      roughness: roughness,
      metalness: 0.0
    });
  }

  static water(color = 0x3d7068, opacity = 0.75) {
    return new THREE.MeshPhysicalMaterial({
      color: color,
      transparent: true,
      opacity: opacity,
      roughness: 0.12,
      metalness: 0.05,
      clearcoat: 1.0,
      clearcoatRoughness: 0.08
    });
  }
}

MaterialFactory.createGlassMaterial = createGlassMaterial;
MaterialFactory.createWoodMaterial = createWoodMaterial;
MaterialFactory.createClayMaterial = createClayMaterial;
MaterialFactory.createMetalMaterial = createMetalMaterial;
