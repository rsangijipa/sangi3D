import assert from 'node:assert/strict';
import test from 'node:test';
import { FeatherState, BARBS, spanAt } from '../feather-state.mjs';

test('T01 — flexão limitada retorna a zero ao soltar', () => {
  const feather = new FeatherState();
  feather.flex(9);
  for (let i = 0; i < 60; i++) feather.step(1 / 120);
  assert.ok(feather.bend > 0.45 && feather.bend <= 0.85);
  feather.release();
  for (let i = 0; i < 180; i++) feather.step(1 / 120);
  assert.ok(Math.abs(feather.bend) < 0.002);
});

test('T02 — abrir, recompor e restaurar os dois lados', () => {
  const feather = new FeatherState();
  feather.edit(0.5, -1, true);
  feather.edit(0.66, 1, true);
  assert.ok(feather.openCount > 8);
  assert.ok(feather.opening(0.5, -1) > 0.8);
  assert.equal(feather.opening(0.5, 1), 0);
  feather.edit(0.5, -1, false);
  assert.equal(feather.opening(0.5, -1), 0);
  assert.ok(feather.opening(0.66, 1) > 0.8);
  feather.recompose();
  for (let i = 0; i < 120; i++) feather.step(1 / 120);
  assert.equal(feather.openCount, 0);
  assert.equal(feather.opening(0.66, 1), 0);
  assert.equal(feather.snapshot().fibers.length, BARBS * 2);
});

test('T03 — a vane tem dois lados assimétricos e afunila no ápice', () => {
  assert.ok(spanAt(0.50, 1) > spanAt(0.50, -1));
  assert.ok(spanAt(0.98, 1) < spanAt(0.50, 1) * 0.38);
  assert.equal(spanAt(0.10, 1), 0);
});
