import assert from 'node:assert/strict';
import test from 'node:test';
import {createEcosystemSimulation, SLIDE_RADIUS, Z_LIMIT, FIXED_STEP} from '../js/ecosystem.js';

test('Ecossistema mantém contenção, limites Z, ausência de NaN e teto populacional em simulação longa', () => {
  const sim = createEcosystemSimulation({sampleId: 'infusao', maxAgents: 32, seed: 12345});
  const ids = new Set(sim.agents.map((a) => a.id));
  assert.equal(ids.size, sim.agents.length, 'IDs devem ser únicos');

  // 10 minutos simulados (36.000 passos)
  for (let frame = 0; frame < 60 * 60 * 10; frame++) {
    if (frame % 1200 === 0) {
      sim.dropFood(1.5, -1.2, 'organic');
    }
    sim.update(FIXED_STEP);
    assert.ok(sim.agents.length <= 32, 'População não pode exceder maxAgents');
    for (const a of sim.agents) {
      assert.ok(Number.isFinite(a.x) && Number.isFinite(a.y) && Number.isFinite(a.z), 'Coordenadas devem ser finitas');
      assert.ok(Math.abs(a.z) <= Z_LIMIT + 0.001, 'Profundidade Z fora do limite');
      assert.ok(Math.hypot(a.x, a.y) <= SLIDE_RADIUS + 0.01, 'Agente fora do raio da lâmina');
    }
  }
});

test('Ameba conserva aproximadamente a área celular durante deformação de pseudópodes', () => {
  const sim = createEcosystemSimulation({sampleId: 'lago', seed: 29611});
  const amoeba = sim.agents.find((a) => a.speciesId === 'amoeba');
  assert.ok(amoeba && Array.isArray(amoeba.lobes));
  sim.dropFood(amoeba.x + 1.5, amoeba.y + 0.5, 'organic');
  for (let i = 0; i < 300; i++) sim.update(FIXED_STEP);
  const areaSum = amoeba.lobes.reduce((acc, r) => acc + r * r, 0);
  assert.ok(Math.abs(areaSum - amoeba.lobes.length) < 0.05, `Área não conservada: ${areaSum}`);
});

test('Determinismo garantido para mesma amostra e seed', () => {
  const s1 = createEcosystemSimulation({sampleId: 'algas', seed: 83419});
  const s2 = createEcosystemSimulation({sampleId: 'algas', seed: 83419});
  for (let i = 0; i < 600; i++) {
    s1.update(FIXED_STEP);
    s2.update(FIXED_STEP);
  }
  assert.equal(s1.agents.length, s2.agents.length);
  for (let i = 0; i < s1.agents.length; i++) {
    assert.equal(s1.agents[i].id, s2.agents[i].id);
    assert.equal(s1.agents[i].x, s2.agents[i].x);
    assert.equal(s1.agents[i].y, s2.agents[i].y);
    assert.equal(s1.agents[i].z, s2.agents[i].z);
  }
});

test('Alimentação forma vacúolo alimentar e eleva energia', () => {
  const sim = createEcosystemSimulation({sampleId: 'lago', seed: 29611});
  const para = sim.agents.find((a) => a.speciesId === 'paramecium');
  assert.ok(para);
  para.energy = 0.3;
  assert.equal(sim.dropFood(para.x + 0.2, para.y + 0.2, 'bacteria', para.z), true);
  let eaten = null;
  for (let i = 0; i < 300 && !eaten; i++) {
    eaten = sim.update(FIXED_STEP);
  }
  assert.ok(eaten, 'Organismo deveria ingerir o alimento próximo');
  assert.ok(eaten.vacuoles.length >= 1, 'Deveria formar vacúolo alimentar');
});
