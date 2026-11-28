import assert from 'node:assert/strict';
import { ITEMS, POCKETS } from '../game/content.js';
import {
  applyCommand,
  buildObservableSummary,
  canPlaceItem,
  computeMetrics,
  createInitialState
} from '../game/rules.js';

let passed = 0;
function test(name, fn) {
  fn();
  passed++;
  console.log(`PASS: ${name}`);
}

test('1. Estado inicial possui todos os 9 itens manipuláveis + versão e seed', () => {
  const s = createInitialState({ journeyId: 'trilha_manha', modeId: 'livre' });
  assert.equal(Object.keys(s.sceneState.items).length, 9);
  assert.equal(ITEMS.length, 9);
  assert.equal(s.version, '2.0.0');
  assert.equal(s.mode, 'livre');
});

test('2. Itens não se sobrepõem em modo físico (strictPhysics: true)', () => {
  const s = createInitialState({ journeyId: 'rotina_cuidado', modeId: 'livre' });
  // Coloca cantil (2x1) em (0,0)
  const r1 = applyCommand(s, { type: 'PLACE_ITEM', itemId: 'cantil', pocket: 'principal', col: 0, row: 0, rotation: 0 });
  assert.equal(r1.feedback.ok, true);
  // Tenta colocar lanterna (2x1) sobrepondo (1,0)
  const overlap = canPlaceItem(r1.state, 'lanterna', 'principal', 1, 0, 0);
  assert.equal(overlap.ok, false);
  // Em (2,0) deve caber sem sobreposição
  const valid = canPlaceItem(r1.state, 'lanterna', 'principal', 2, 0, 0);
  assert.equal(valid.ok, true);
});

test('3. Volume, massa física e centro de massa coerentes', () => {
  let s = createInitialState({ journeyId: 'rotina_cuidado', modeId: 'livre' });
  assert.equal(computeMetrics(s).volumePct, 0);
  assert.equal(computeMetrics(s).physicalMassKg, 0);

  // Coloca cantil (0.85 kg) na esquerda (col 0)
  s = applyCommand(s, { type: 'PLACE_ITEM', itemId: 'cantil', pocket: 'principal', col: 0, row: 0, rotation: 0 }).state;
  const mLeft = computeMetrics(s);
  assert.equal(mLeft.physicalMassKg, 0.85);
  assert.ok(mLeft.volumePct > 0);
  assert.ok(mLeft.comX < -0.3, `Esperado centro de massa à esquerda, obteve ${mLeft.comX}`);

  // Equilibra com corda (0.72 kg) na direita (col 3)
  s = applyCommand(s, { type: 'PLACE_ITEM', itemId: 'corda', pocket: 'principal', col: 3, row: 0, rotation: 0 }).state;
  const mBal = computeMetrics(s);
  assert.equal(mBal.physicalMassKg, 1.57);
  assert.ok(Math.abs(mBal.comX) < 0.25, `Esperado equilibrado, obteve ${mBal.comX}`);
});

test('4. Objetos simbólicos (pedra e cartões) independentes de massa emocional', () => {
  let s = createInitialState({ journeyId: 'rotina_cuidado', modeId: 'travessia_simbolica' });
  s = applyCommand(s, { type: 'PLACE_ITEM', itemId: 'pedra', pocket: 'principal', col: 0, row: 0, rotation: 0 }).state;
  s = applyCommand(s, { type: 'PLACE_ITEM', itemId: 'cartoes_semanticos', pocket: 'frontal', col: 0, row: 0, rotation: 0 }).state;
  const m = computeMetrics(s);
  assert.equal(m.symbolicPackedCount, 2);
  assert.equal(m.physicalMassKg, 0, 'Objetos simbólicos não devem adicionar peso automático');
});

test('5. Girar 90° e mover entre bolsos atualizam footprint e estado físico', () => {
  let s = createInitialState({ journeyId: 'rotina_cuidado', modeId: 'livre' });
  s = applyCommand(s, { type: 'PLACE_ITEM', itemId: 'lanterna', pocket: 'principal', col: 0, row: 0, rotation: 0 }).state;
  s = applyCommand(s, { type: 'ROTATE_ITEM', itemId: 'lanterna' }).state;
  assert.equal(s.sceneState.items.lanterna.rotation, 1);
  // Mover lanterna para bolso frontal
  s = applyCommand(s, { type: 'MOVE_POCKET', itemId: 'lanterna', targetPocket: 'frontal' }).state;
  assert.equal(s.sceneState.items.lanterna.pocket, 'frontal');
});

test('6. Undo e Redo restauram estado físico exato', () => {
  let s = createInitialState({ journeyId: 'rotina_cuidado', modeId: 'livre' });
  s = applyCommand(s, { type: 'PLACE_ITEM', itemId: 'bussola', pocket: 'principal', col: 2, row: 2, rotation: 0 }).state;
  assert.equal(s.sceneState.items.bussola.location, 'backpack');
  s = applyCommand(s, { type: 'UNDO' }).state;
  assert.equal(s.sceneState.items.bussola.location, 'table');
  s = applyCommand(s, { type: 'REDO' }).state;
  assert.equal(s.sceneState.items.bussola.location, 'backpack');
  assert.equal(s.sceneState.items.bussola.col, 2);
});

test('7. Ações extremas: fechar/reabrir sem completar, pausa, alternância de modo e reset', () => {
  let s = createInitialState({ journeyId: 'trilha_manha', modeId: 'livre' });
  s = applyCommand(s, { type: 'SET_PAUSE', paused: true }).state;
  assert.equal(s.paused, true);
  s = applyCommand(s, { type: 'SET_PHASE', phase: 'seguir' }).state;
  assert.equal(s.flapClosed, true);
  // Reabrir mochila sem completar
  s = applyCommand(s, { type: 'SET_PHASE', phase: 'organizar' }).state;
  assert.equal(s.flapClosed, false);
  // Alternar modo e resetar
  s = applyCommand(s, { type: 'SET_MODE', modeId: 'desafio_organizacao' }).state;
  assert.equal(s.settings.maxMassKg, 3.5);
  s = applyCommand(s, { type: 'RESET' }).state;
  assert.equal(s.history.past.length, 0);
});

test('8. Resumo observável não vaza anotação voluntária por padrão e sem escore clínico', () => {
  let s = createInitialState({ journeyId: 'cabana_silencio', modeId: 'revisao_acompanhada' });
  s = applyCommand(s, { type: 'SET_CARD_CHOICE', cardId: 'broto', note: 'Nota pessoal privada' }).state;
  s = applyCommand(s, { type: 'RECORD_OBSERVATION', action: 'Colocou bússola', status: 'independente' }).state;
  const sum = buildObservableSummary(s);
  assert.equal(sum.anotacaoVoluntaria, undefined);
  assert.equal(sum.observaveis.length, 1);
  assert.ok(sum.disclaimer.includes('Não constitui avaliação clínica'));
});

console.log(`\nTODOS OS ${passed} TESTES PASSARAM.`);
