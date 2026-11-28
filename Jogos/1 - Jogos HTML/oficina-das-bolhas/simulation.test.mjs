import assert from 'node:assert/strict';
import { test } from 'node:test';
import { bubbleSimulation } from './simulation.js';

const source = { x: -.5, y: 1.2, z: .7 };

function release(simulation) {
  simulation.dip();
  return simulation.release(source);
}

function advance(simulation, steps = 120) {
  for (let frame = 0; frame < steps; frame++) simulation.step(1 / 60);
}

test('the ring must be dipped for each release and stronger breath changes the result', () => {
  const simulation = bubbleSimulation();
  assert.deepEqual(simulation.release(source), []);
  simulation.state.settings.breath = 10;
  const gentle = release(simulation);
  assert.equal(simulation.state.wet, false);
  simulation.state.settings.breath = 100;
  const strong = release(simulation);
  assert.ok(strong.length > gentle.length);
  assert.ok(strong[0].radius > gentle[0].radius);
  simulation.state.settings.mode = 'giant';
  const giant = release(simulation);
  assert.equal(giant.length, 1);
  assert.ok(giant[0].radius > strong[0].radius * 2);
});

test('released bubbles rise and travel in the direction of the wind', () => {
  for (const wind of [-80, 80]) {
    const simulation = bubbleSimulation();
    simulation.state.settings.wind = wind;
    const [bubble] = release(simulation);
    const { x, y } = bubble;
    advance(simulation);
    assert.ok(bubble.y > y);
    assert.equal(Math.sign(bubble.x - x), Math.sign(wind));
  }
});

test('a pop targets one id and reset restores the same starting state', () => {
  const simulation = bubbleSimulation();
  const initial = structuredClone(simulation.state);
  const [first, second] = release(simulation);
  assert.equal(simulation.pop(first.id), first);
  assert.equal(simulation.state.popped, 1);
  assert.ok(simulation.state.bubbles.includes(second));
  simulation.reset();
  assert.deepEqual(simulation.state, initial);
});

test('contact fuses two created bubbles and conserves spherical volume', () => {
  const simulation = bubbleSimulation();
  simulation.state.settings.mode = 'giant';
  const [first] = release(simulation);
  const [second] = release(simulation);
  const volume = first.radius ** 3 + second.radius ** 3;
  advance(simulation);
  assert.equal(simulation.state.merges, 1);
  assert.ok(Math.abs(first.radius ** 3 - volume) < 1e-12);
  assert.ok(!simulation.state.bubbles.includes(second));
});
