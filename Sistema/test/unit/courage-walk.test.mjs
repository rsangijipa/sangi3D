import assert from 'node:assert/strict';
import { test } from 'node:test';
import '../../../Jogos/1 - Jogos HTML/escada-da-coragem/courage-walk.js';

const { createRoute, advance, trails } = globalThis.CourageWalk;
const stairs = Array.from({ length: 7 }, (_, i) => ({ z: 2 - i * 1.02, y: (i + 1) * 0.38 }));
const route = createRoute(stairs);

test('the stair surface has seven ascending treads and stays within the path', () => {
  assert.equal(route.floor(0, 5, 0), 0);
  for (const stair of stairs) assert.equal(route.floor(0, stair.z, 0), stair.y);
  assert.equal(route.floor(8, 1, 0), null);
  assert.equal(route.floor(0.7, -6.85, 0), null);
});

test('both paths lead through the checkpoints to the lookout without skipping phases', () => {
  assert.equal(advance(0, 0, -28).phase, 0);
  for (const branch of trails.slice(1, 3)) {
    let phase = 0;
    let previousHeight = 0;
    for (const trail of [trails[0], branch, trails[3]]) {
      for (let i = 1; i < trail.points.length; i++) {
        const [ax, az] = trail.points[i - 1];
        const [bx, bz] = trail.points[i];
        for (let j = 0; j <= 40; j++) {
          const x = ax + (bx - ax) * j / 40;
          const z = az + (bz - az) * j / 40;
          const floor = route.floor(x, z, 0);
          assert.notEqual(floor, null, `path blocked at ${x}, ${z}`);
          assert.ok(Math.abs(floor - previousHeight) <= 0.41);
          previousHeight = floor;
          phase = advance(phase, x, z).phase;
        }
      }
    }
    assert.equal(phase, 3);
    assert.equal(advance(phase, 0, 5).phase, 3);
  }
});
