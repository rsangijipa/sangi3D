import assert from 'node:assert/strict';
import test from 'node:test';
import {createSimulation, radius, specimens} from './simulation.js';

test('T01: cinco organismos permanecem no volume durante quinze minutos simulados', () => {
  const model = createSimulation();
  for (let frame = 0; frame < 60 * 60 * 15; frame++) {
    if (frame % 900 === 0) {
      const ciliate = model.agents[0];
      const angle = frame * .17;
      model.dropFood(ciliate.x + Math.cos(angle) * 2.4, ciliate.y + Math.sin(angle) * 2.4);
    }
    model.update();
    for (const agent of model.agents) {
      assert.ok(Math.hypot(agent.x, agent.y) + agent.size / 2 <= radius + 0.000001);
      assert.ok(Math.abs(agent.z - specimens[agent.index].z) <= .33);
    }
  }
  assert.ok(model.time > 899.9);
});

test('T03: o alimento atrai o ciliado e é removido quando ingerido', () => {
  const fed = createSimulation();
  const baseline = createSimulation();
  const agent = fed.agents[0];
  assert.equal(fed.dropFood(agent.x + 2, agent.y + .5), true);
  fed.update();
  baseline.update();
  assert.equal(agent.target, fed.food[0]);
  assert.equal(baseline.agents[0].target, null);
  let eaten;
  for (let frame = 0; frame < 360 && !eaten; frame++) {
    eaten = fed.update();
    baseline.update();
  }
  assert.equal(eaten, agent);
  assert.equal(agent.energy, 1);
  assert.equal(fed.food.length, 0);
  assert.ok(Math.abs(agent.x - baseline.agents[0].x) > .7);
  assert.equal(fed.agents[1].energy, 0);
});

test('T-STATE: nova lâmina restaura as condições iniciais com evolução determinística', () => {
  const pristine = createSimulation();
  const played = createSimulation();
  assert.equal(played.dropFood(radius, radius), false);
  for (let i = 0; i < 5; i++) assert.equal(played.dropFood(1, 1 + i / 10), true);
  assert.equal(played.dropFood(1, 1), false);
  for (let i = 0; i < 1800; i++) played.update();
  assert.notDeepEqual(played.agents, pristine.agents);
  const reset = createSimulation();
  assert.deepEqual(reset.agents, pristine.agents);
  assert.deepEqual(reset.food, []);
  for (let i = 0; i < 1800; i++) {
    pristine.update();
    reset.update();
  }
  assert.deepEqual(reset.agents, pristine.agents);
  assert.equal(reset.time, pristine.time);
});
