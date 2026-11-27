import * as THREE from '../vendor/three.module.js';

// A low-resolution light probe with broad window and bounce sources, in linear HDR.
export function createStudioEnvironment(renderer) {
  const width = 128;
  const height = 64;
  const pixels = new Uint16Array(width * height * 4);
  for (let y = 0; y < height; y++) {
    const elevation = (0.5 - (y + 0.5) / height) * Math.PI;
    for (let x = 0; x < width; x++) {
      const azimuth = (x + 0.5) * 2 * Math.PI / width;
      const window = Math.exp(-((elevation - 0.25) ** 2 * 5 + (azimuth - 4.85) ** 2 * 5)) * 2.8;
      const bounce = Math.exp(-((elevation - 0.5) ** 2 * 4 + (azimuth - 1.8) ** 2 * 3)) * 1.7;
      const floor = 0.14 + 0.1 * Math.sin(elevation);
      const offset = (y * width + x) * 4;
      pixels[offset] = THREE.DataUtils.toHalfFloat(floor + window + bounce * 0.55);
      pixels[offset + 1] = THREE.DataUtils.toHalfFloat(floor * 0.93 + window * 0.83 + bounce * 0.72);
      pixels[offset + 2] = THREE.DataUtils.toHalfFloat(floor * 0.87 + window * 0.62 + bounce);
      pixels[offset + 3] = THREE.DataUtils.toHalfFloat(1);
    }
  }
  const texture = new THREE.DataTexture(pixels, width, height, THREE.RGBAFormat, THREE.HalfFloatType);
  texture.mapping = THREE.EquirectangularReflectionMapping;
  texture.needsUpdate = true;
  const generator = new THREE.PMREMGenerator(renderer);
  try {
    return generator.fromEquirectangular(texture);
  } finally {
    texture.dispose();
    generator.dispose();
  }
}
