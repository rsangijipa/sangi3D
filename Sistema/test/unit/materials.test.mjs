import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

function installCanvasStub() {
  const prevDoc = globalThis.document;
  globalThis.document = {
    createElement(tag) {
      if (tag !== 'canvas') return {};
      const canvas = {
        width: 256,
        height: 256,
        getContext() {
          return {
            fillStyle: '#000',
            strokeStyle: '#000',
            lineWidth: 1,
            fillRect() {},
            strokeRect() {},
            beginPath() {},
            moveTo() {},
            lineTo() {},
            stroke() {},
            createImageData(w, h) {
              return { width: w, height: h, data: new Uint8ClampedArray(w * h * 4) };
            },
            putImageData() {}
          };
        }
      };
      return canvas;
    }
  };
  return () => { globalThis.document = prevDoc; };
}

describe('Material composition helpers (shared/engine/materials.js)', () => {
  it('exports createGlassMaterial, createWoodMaterial, createClayMaterial, createMetalMaterial and attaches to MaterialFactory', async () => {
    const restore = installCanvasStub();
    try {
      const mod = await import('../../shared/engine/materials.js');
      for (const fn of ['createGlassMaterial', 'createWoodMaterial', 'createClayMaterial', 'createMetalMaterial']) {
        assert.equal(typeof mod[fn], 'function', `${fn} must be exported`);
        assert.equal(typeof mod.MaterialFactory[fn], 'function', `MaterialFactory.${fn} must be attached`);
      }
    } finally {
      restore();
    }
  });

  it('createGlassMaterial adapts transmission/dispersion between ULTRA and LOW', async () => {
    const restore = installCanvasStub();
    try {
      const { createGlassMaterial } = await import('../../shared/engine/materials.js');
      const ultra = createGlassMaterial({ tint: 0xdff4ff, transmission: 0.94, thickness: 0.35, dispersion: 0.04, quality: 'ULTRA' });
      const low = createGlassMaterial({ tint: 0xdff4ff, transmission: 0.94, thickness: 0.35, dispersion: 0.04, quality: 'LOW' });

      assert.equal(ultra.isMeshPhysicalMaterial, true);
      assert.ok(ultra.transmission > 0.8);
      assert.equal(ultra.dispersion, 0.04);
      assert.equal(low.transmission ?? 0, 0);
      assert.equal(low.transparent, true);
    } finally {
      restore();
    }
  });

  it('caches procedural CanvasTextures across repeated calls with matching parameters', async () => {
    const restore = installCanvasStub();
    try {
      const { createWoodMaterial, createClayMaterial, createMetalMaterial } = await import('../../shared/engine/materials.js');
      const woodA = createWoodMaterial({ color: 0xb87a4b, grain: 1.0, varnish: 0.4, seed: 77, quality: 'HIGH' });
      const woodB = createWoodMaterial({ color: 0x9c6239, grain: 1.0, varnish: 0.4, seed: 77, quality: 'HIGH' });
      assert.ok(woodA.map);
      assert.strictEqual(woodA.map, woodB.map, 'Wood texture with same seed/quality should be cached');

      const clayA = createClayMaterial({ color: 0xc27050, moisture: 0.7, plasticity: 0.8, seed: 11, quality: 'HIGH' });
      const clayB = createClayMaterial({ color: 0xc27050, moisture: 0.7, plasticity: 0.8, seed: 11, quality: 'HIGH' });
      assert.ok(clayA.bumpMap);
      assert.strictEqual(clayA.bumpMap, clayB.bumpMap, 'Clay texture with same seed/quality should be cached');
      assert.ok(clayA.roughness < 0.65, 'High moisture clay should have lower roughness than dry clay');

      const metalBrass = createMetalMaterial({ type: 'brass', scratches: 0.3, quality: 'HIGH' });
      const metalBrass2 = createMetalMaterial({ type: 'brass', scratches: 0.3, quality: 'HIGH' });
      assert.ok(metalBrass.roughnessMap);
      assert.strictEqual(metalBrass.roughnessMap, metalBrass2.roughnessMap, 'Metal scratch texture should be cached');
      assert.ok(metalBrass.metalness >= 0.85);
    } finally {
      restore();
    }
  });
});
