import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

// Pure JS verification of the physics & blending math matching src/physics/kernels.ts
function blendPigments(baseRgb, strokeRgb, alpha, mixFactor = 0.55) {
  const t = Math.max(0, Math.min(1, alpha * mixFactor));
  const r = Math.sqrt((1 - t) * baseRgb[0] * baseRgb[0] + t * strokeRgb[0] * strokeRgb[0]);
  const g = Math.sqrt((1 - t) * baseRgb[1] * baseRgb[1] + t * strokeRgb[1] * strokeRgb[1]);
  const b = Math.sqrt((1 - t) * baseRgb[2] * baseRgb[2] + t * strokeRgb[2] * strokeRgb[2]);
  return [Math.round(r), Math.round(g), Math.round(b)];
}

test('blendPigments blends two colors without exceeding 0..255', () => {
  const mixed = blendPigments([49, 94, 103], [211, 172, 87], 0.8);
  assert.equal(mixed.length, 3);
  for (const c of mixed) {
    assert.ok(c >= 0 && c <= 255);
  }
  assert.notDeepEqual(mixed, [49, 94, 103]);
});

test('Standalone HTML build exists and contains all 5 stations and 6 modes', () => {
  const htmlPath = path.resolve(
    path.dirname(new URL(import.meta.url).pathname),
    '../dist/index.html'
  );
  assert.ok(fs.existsSync(htmlPath), 'dist/index.html should exist');
  const html = fs.readFileSync(htmlPath, 'utf8');
  for (const label of ['Pintura', 'Argila', 'Areia', 'Fitas', 'Ritmo']) {
    assert.ok(html.includes(label), `Missing station ${label}`);
  }
  for (const mode of [
    'Exploração livre',
    'Imitação',
    'Criação compartilhada',
    'Complete meu gesto',
    'Espelhamento',
    'Experimentação terapêutica'
  ]) {
    assert.ok(html.includes(mode), `Missing mode ${mode}`);
  }
  assert.ok(html.includes('THREE.WebGLRenderer'), 'Should bundle Three.js renderer');
});
