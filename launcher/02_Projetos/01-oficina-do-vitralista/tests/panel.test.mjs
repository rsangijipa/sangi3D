import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createPanel, createWorkshop } from '../src/panel.ts';

test('each mold has well-formed panes and solder seams', () => {
  for (const mold of ['roseta', 'botanico', 'geometrico']) {
    const { panes, seams } = createPanel(mold);
    assert.ok(panes.length >= 13);
    assert.equal(new Set(seams.map(seam => seam.id)).size, seams.length);
    for (const seam of seams) {
      assert.ok(seam.panes.every(id => panes.some(pane => pane.id === id)));
      assert.notEqual(seam.panes[0], seam.panes[1]);
      assert.ok(seam.path.length > 1);
    }
  }
});

test('solder only joins installed glass and combines both drag directions', () => {
  const studio = createWorkshop();
  const { seams } = studio.panel;
  const seam = seams.find(entry => entry.panes.every(id => !studio.work.panes[id]));
  assert.ok(seam);
  assert.equal(studio.solder(seam.id, 0, 1), false);
  seam.panes.forEach(id => studio.place(id, 'rubi'));
  assert.equal(studio.solder(seam.id, 1, 0.5), true);
  assert.notEqual(studio.work.solder[seam.id], 255);
  studio.solder(seam.id, 0, 0.5);
  assert.equal(studio.work.solder[seam.id], 255);
  studio.place(seam.panes[0], 'ambar');
  assert.equal(studio.work.solder[seam.id], 255);
});

test('molds keep separate progress and stored values are validated', () => {
  const studio = createWorkshop();
  const id = studio.panel.panes.find(pane => !studio.work.panes[pane.id]).id;
  studio.place(id, 'opalino');
  studio.useMold('botanico');
  studio.useMold('roseta');
  assert.equal(studio.work.panes[id], 'opalino');
  const saved = JSON.parse(JSON.stringify(studio.snapshot()));
  saved.roseta.panes.unknown = 'rubi';
  saved.roseta.panes[id] = 'invalid';
  saved.roseta.solder.unknown = 255;
  const restored = createWorkshop(saved);
  assert.equal(restored.work.panes[id], undefined);
  assert.equal(restored.work.panes.unknown, undefined);
  assert.equal(restored.work.solder.unknown, undefined);
});
