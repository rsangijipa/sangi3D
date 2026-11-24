import * as THREE from '../vendor/three.module.js';

/**
 * shared/engine/materials.js
 * Fábrica de materiais PBR e texturas procedurais para Sangi3D
 */

export class MaterialFactory {
  static #grain(canvas, seed) {
    const context = canvas.getContext('2d');
    const { width, height } = canvas;
    const image = context.createImageData(width, height);
    const hash = (x, y) => {
      let value = Math.imul(x + seed, 1597334677) ^ Math.imul(y, 3812015801);
      value = Math.imul(value ^ (value >>> 16), 0x45d9f3b);
      return ((value ^ (value >>> 16)) >>> 0) / 4294967295;
    };
    const noise = (x, y) => {
      const ix = Math.floor(x);
      const iy = Math.floor(y);
      const a = x - ix;
      const b = y - iy;
      const u = a * a * (3 - 2 * a);
      const v = b * b * (3 - 2 * b);
      const lo = hash(ix, iy) * (1 - u) + hash(ix + 1, iy) * u;
      const hi = hash(ix, iy + 1) * (1 - u) + hash(ix + 1, iy + 1) * u;
      return lo * (1 - v) + hi * v;
    };
    for (let y = 0; y < height; y++) {
      const v = y / height;
      for (let x = 0; x < width; x++) {
        const u = x / width;
        const curve = v + (noise(u * 4, v * 8) - 0.5) * 0.075;
        const rings = Math.sin((curve * 18 + noise(u * 3, curve * 10) * 1.3) * Math.PI * 2);
        const fibers = noise(u * 12, curve * 205);
        const pores = noise(u * 32, curve * 98) ** 6;
        const tone = 225 + 28 * (noise(u * 3, v * 12) - 0.5)
          - 22 * Math.max(0, rings) ** 7 - 22 * pores + 15 * (fibers - 0.5);
        const offset = (y * width + x) * 4;
        image.data[offset] = tone + 4;
        image.data[offset + 1] = tone;
        image.data[offset + 2] = tone - 7;
        image.data[offset + 3] = 255;
      }
    }
    context.putImageData(image, 0, 0);
  }

  static createNoiseTexture(width = 256, height = 256, scale = 16) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
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
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    this.#grain(canvas, seed);
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.wrapS = THREE.MirroredRepeatWrapping;
    texture.wrapT = THREE.MirroredRepeatWrapping;
    texture.anisotropy = 4;
    return texture;
  }

  static wood(color = 0xd4a373, roughness = 0.72) {
    const grain = this.createWoodTexture();
    return new THREE.MeshStandardMaterial({
      color: color,
      roughness: roughness,
      map: grain,
      bumpMap: grain,
      bumpScale: 0.009
    });
  }

  static brass(roughness = 0.32, metalness = 0.88) {
    return new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      roughness: roughness,
      metalness: metalness
    });
  }

  static metal(color = 0xcccccc, roughness = 0.28, metalness = 0.95) {
    return new THREE.MeshStandardMaterial({
      color: color,
      roughness: roughness,
      metalness: metalness
    });
  }

  static glass(color = 0xffffff, opacity = 0.35, roughness = 0.1) {
    // Vidro realista com transparência controlada compatível com mobile
    return new THREE.MeshPhysicalMaterial({
      color: color,
      transparent: true,
      opacity: opacity,
      roughness: roughness,
      metalness: 0.1,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      transmission: 0.85,
      ior: 1.52
    });
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
