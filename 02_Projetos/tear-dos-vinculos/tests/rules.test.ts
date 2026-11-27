import { test } from 'node:test';
import assert from 'node:assert/strict';
import { applyCommand, type Command } from '../src/game/rules.ts';
import { createScene, crossingAtWarp, fabricHeight, validateScene, type RowEntity, type SceneState } from '../src/game/state.ts';
import { Store } from '../src/game/store.ts';
import { createAppState } from '../src/game/state.ts';
import { VerletRope } from '../src/sim/verlet.ts';
import { makeLayout, pathCurvature, weftPath } from '../src/sim/weavePath.ts';
import type { Crossing } from '../src/game/content.ts';

function run(s: SceneState, cmd: Command): SceneState {
  const r = applyCommand(s, cmd);
  assert.ok(r.ok, r.ok ? '' : r.reason);
  return r.state;
}

function weaveRow(s: SceneState, seq: Crossing[]): SceneState {
  for (const c of seq) {
    const idx = s.active ? s.active.crossings.length : 0;
    s = run(s, { type: 'cross', index: idx, crossing: c });
  }
  return s;
}

const alt = (n: number, start: Crossing = 'over'): Crossing[] =>
  Array.from({ length: n }, (_, i) => ((i % 2 === 0) === (start === 'over') ? 'over' : 'under'));

test('cruzamentos seguem a ordem escolhida', () => {
  let s = createScene(8);
  const seq: Crossing[] = ['over', 'over', 'under', 'over', 'under', 'under', 'over', 'under'];
  s = weaveRow(s, seq);
  const row = s.fabric[0] as RowEntity;
  assert.deepEqual(row.crossings, seq);
  assert.equal(row.direction, 1);
  // Segunda passada vai da direita para a esquerda; o primeiro cruzamento cai no último fio.
  s = weaveRow(s, ['under', 'over', 'over', 'over', 'over', 'over', 'over', 'over']);
  const row2 = s.fabric[1] as RowEntity;
  assert.equal(row2.direction, -1);
  assert.equal(crossingAtWarp(row2, 7, 8), 'under');
  assert.equal(crossingAtWarp(row2, 0, 8), 'over');
});

test('cruzamento fora de ordem é recusado e repetição é idempotente', () => {
  let s = createScene(8);
  s = run(s, { type: 'cross', index: 0, crossing: 'over' });
  const again = applyCommand(s, { type: 'cross', index: 0, crossing: 'over' });
  assert.ok(again.ok && !again.changed);
  const conflict = applyCommand(s, { type: 'cross', index: 0, crossing: 'under' });
  assert.ok(!conflict.ok);
  const skip = applyCommand(s, { type: 'cross', index: 3, crossing: 'under' });
  assert.ok(!skip.ok);
});

test('desfazer cruzamento volta um passo e reabre a fileira anterior', () => {
  let s = weaveRow(createScene(8), alt(8));
  assert.equal(s.fabric.length, 1);
  s = run(s, { type: 'unweave', index: 7 });
  assert.equal(s.fabric.length, 0);
  assert.equal(s.active?.crossings.length, 7);
  for (let i = 6; i >= 0; i--) s = run(s, { type: 'unweave', index: i });
  assert.equal(s.active, null);
  assert.equal(s.ends.length, 0, 'pontas criadas pela passada desfeita somem');
});

test('tensão altera curvatura sem instabilidade', () => {
  const layout = makeLayout(18);
  const base = { crossings: alt(18), direction: 1 as const, thickness: 'media' as const, y: 1, seed: 3 };
  const loose = pathCurvature(weftPath(layout, { ...base, tension: 0 }));
  const tight = pathCurvature(weftPath(layout, { ...base, tension: 1 }));
  assert.ok(loose > tight, `frouxo (${loose}) deve curvar mais que tenso (${tight})`);
  for (const t of [-5, 0, 0.5, 1, 9, Number.NaN]) {
    const pts = weftPath(layout, { ...base, tension: t });
    assert.ok(pts.every((p) => Number.isFinite(p.x) && Number.isFinite(p.y) && Number.isFinite(p.z)));
    assert.ok(pts.every((p) => Math.abs(p.y - 1) < 0.02), 'ondulação limitada');
  }
  // Verlet: extremos de tensão, dt enorme (após pausa) e muitas iterações continuam finitos.
  for (const tension of [0, 1]) {
    const rope = new VerletRope({ x: 0, y: 1, z: 0 }, { x: 0.5, y: 1, z: 0 }, { segments: 20, length: 0.5, tension });
    rope.pin(0, { x: 0, y: 1, z: 0 });
    rope.pin(20, { x: 0.5, y: 1, z: 0 });
    for (let i = 0; i < 600; i++) rope.update(i % 50 === 0 ? 5 : 1 / 60);
    assert.ok(rope.isFinite());
    assert.ok(rope.sag() < 0.3);
  }
  const ropeLoose = new VerletRope({ x: 0, y: 1, z: 0 }, { x: 0.5, y: 1, z: 0 }, { segments: 20, length: 0.5, tension: 0 });
  const ropeTight = new VerletRope({ x: 0, y: 1, z: 0 }, { x: 0.5, y: 1, z: 0 }, { segments: 20, length: 0.5, tension: 1 });
  for (const r of [ropeLoose, ropeTight]) { r.pin(0, { x: 0, y: 1, z: 0 }); r.pin(20, { x: 0.5, y: 1, z: 0 }); for (let i = 0; i < 300; i++) r.update(1 / 60); }
  assert.ok(ropeLoose.sag() > ropeTight.sag() * 2, 'tensão baixa gera mais flecha');
});

test('tensão é limitada a [0,1] e aplicada por fileira', () => {
  let s = weaveRow(createScene(8), alt(8));
  const id = s.fabric[0].id;
  s = run(s, { type: 'setTension', target: id, value: 7 });
  assert.equal((s.fabric[0] as RowEntity).tension, 1);
  s = run(s, { type: 'setTension', target: 'active', value: -2 });
  assert.equal(s.tension, 0);
});

test('prender ponta antes do nó; nó exige ponta presa', () => {
  let s = weaveRow(createScene(8), alt(8));
  const end = s.ends[0];
  assert.equal(end.state, 'solta');
  const early = applyCommand(s, { type: 'tieKnot', endId: end.id });
  assert.ok(!early.ok);
  s = run(s, { type: 'secureEnd', endId: end.id });
  const twice = applyCommand(s, { type: 'secureEnd', endId: end.id });
  assert.ok(twice.ok && !twice.changed);
  s = run(s, { type: 'tieKnot', endId: end.id });
  assert.equal(s.ends[0].state, 'atada');
});

test('troca de fio cria pontas nos dois lados da troca', () => {
  let s = weaveRow(createScene(8), alt(8));
  s = run(s, { type: 'chooseYarn', yarnId: 'telha' });
  s = weaveRow(s, alt(8, 'under'));
  assert.equal(s.ends.length, 3);
  assert.ok(s.ends.some((e) => e.yarnId === 'salvia' && e.side === 'right'));
  assert.ok(s.ends.some((e) => e.yarnId === 'telha' && e.side === 'right'));
});

test('corte remove só o trecho escolhido e reconectar preserva o desenho restante', () => {
  let s = createScene(8);
  const yarns = ['salvia', 'telha', 'mostarda', 'linho', 'lavanda', 'areia'];
  for (let r = 0; r < 6; r++) {
    s = run(s, { type: 'chooseYarn', yarnId: yarns[r] });
    s = weaveRow(s, alt(8, r % 2 ? 'under' : 'over'));
  }
  const before = s.fabric.map((e) => structuredClone(e));
  const heightBefore = fabricHeight(s);
  const notConfirmed = applyCommand(s, { type: 'cutSelection', fromId: before[2].id, toId: before[3].id, confirmed: false });
  assert.ok(!notConfirmed.ok);
  s = run(s, { type: 'selectRow', rowId: before[3].id });
  s = run(s, { type: 'selectRow', rowId: before[2].id });
  s = run(s, { type: 'cutSelection', fromId: s.selection!.fromId, toId: s.selection!.toId!, confirmed: true });
  assert.equal(s.fabric.length, 5);
  assert.equal(s.fabric[2].kind, 'gap');
  assert.ok(Math.abs(fabricHeight(s) - heightBefore) < 1e-9, 'lacuna mantém a altura até reconectar');
  // Fileiras fora do trecho permanecem idênticas.
  assert.deepEqual(s.fabric[0], before[0]);
  assert.deepEqual(s.fabric[1], before[1]);
  assert.deepEqual(s.fabric[3], before[4]);
  assert.deepEqual(s.fabric[4], before[5]);
  const gapId = s.fabric[2].id;
  s = run(s, { type: 'reconnect', gapId });
  assert.deepEqual(s.fabric, [before[0], before[1], before[4], before[5]]);
  assert.ok(s.ends.filter((e) => e.originId === gapId).every((e) => e.state === 'atada'));
});

test('undo/redo restauram o estado do tecido', () => {
  const store = new Store(createAppState());
  store.app.sceneState = createScene(8);
  for (const c of alt(8)) store.dispatch({ type: 'cross', index: store.scene.active?.crossings.length ?? 0, crossing: c });
  const full = structuredClone(store.scene);
  store.undo();
  assert.equal(store.scene.active?.crossings.length, 7);
  store.redo();
  assert.deepEqual(store.scene, full);
});

test('reset exige confirmação e serialização valida o estado', () => {
  let s = weaveRow(createScene(10), alt(10));
  assert.ok(!applyCommand(s, { type: 'reset', warpCount: 12, confirmed: false }).ok);
  const copy = validateScene(JSON.parse(JSON.stringify(s)));
  assert.deepEqual(copy, s);
  assert.throws(() => validateScene({ ...s, warpCount: 3 }));
  s = run(s, { type: 'reset', warpCount: 12, confirmed: true });
  assert.equal(s.fabric.length, 0);
  assert.equal(s.warpCount, 12);
});

test('padrão de apoio completa a passada de forma determinística', () => {
  let s = run(createScene(12), { type: 'setAssist', pattern: 'sarja' });
  s = run(s, { type: 'fillRow' });
  const a = (s.fabric[0] as RowEntity).crossings.join();
  let s2 = run(createScene(12), { type: 'setAssist', pattern: 'sarja' });
  s2 = run(s2, { type: 'fillRow' });
  assert.equal((s2.fabric[0] as RowEntity).crossings.join(), a);
});

test('modo compartilhado alterna participantes por passada', () => {
  let s = run(createScene(8), { type: 'setShared', shared: true });
  s = weaveRow(s, alt(8));
  s = weaveRow(s, alt(8, 'under'));
  assert.deepEqual(s.fabric.map((e) => (e as RowEntity).participant), ['A', 'B']);
});
