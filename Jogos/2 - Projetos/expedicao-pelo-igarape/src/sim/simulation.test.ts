import test from 'node:test';
import assert from 'node:assert/strict';
import {
  DOCK_ZONES,
  FAUNA_CATALOG,
  currentAt,
  getFaunaWorldPosition,
  projectToRiver,
  sampleRiver,
} from './river';
import {
  CANOE_HALF_BEAM,
  SIM_FIXED_DT,
  createEmptyInput,
  createInitialCanoeState,
  findFramedFauna,
  stepCanoePhysics,
  toggleDocking,
} from './physics';

test('T01: Canoa deriva com a corrente vetorial sem entrada do jogador', () => {
  const state = createInitialCanoeState();
  const initialS = state.s;
  const initialX = state.x;
  const initialZ = state.z;
  const input = createEmptyInput();

  // Simulate 4 seconds with zero player input
  for (let i = 0; i < 240; i++) {
    stepCanoePhysics(state, input, SIM_FIXED_DT);
  }

  const moved = Math.hypot(state.x - initialX, state.z - initialZ);
  assert.ok(moved > 0.8, `Expected canoe to drift > 0.8m, got ${moved.toFixed(3)}m`);
  assert.ok(state.s > initialS + 0.7, `Expected downstream s to increase from ${initialS} to > ${initialS + 0.7}, got ${state.s.toFixed(3)}`);
});

test('T02: Remada altera velocidade e direção da canoa', () => {
  const driftState = createInitialCanoeState();
  const paddleState = createInitialCanoeState();
  const idleInput = createEmptyInput();
  const forwardInput = { ...createEmptyInput(), forward: true };

  let strokes = 0;
  for (let i = 0; i < 120; i++) {
    stepCanoePhysics(driftState, idleInput, SIM_FIXED_DT);
    const res = stepCanoePhysics(paddleState, forwardInput, SIM_FIXED_DT);
    if (res.strokeTriggered) strokes += 1;
  }

  const driftSpeed = Math.hypot(driftState.vx, driftState.vz);
  const paddleSpeed = Math.hypot(paddleState.vx, paddleState.vz);

  assert.ok(strokes >= 2, `Expected rhythmic strokes >= 2, got ${strokes}`);
  assert.ok(
    paddleSpeed > driftSpeed + 1.0,
    `Expected paddling speed (${paddleSpeed.toFixed(2)}) > drift speed (${driftSpeed.toFixed(2)}) + 1.0`
  );
  assert.ok(
    paddleState.s > driftState.s + 2.5,
    `Expected paddled canoe to advance significantly further than drifting canoe`
  );

  // Verify steering changes yaw
  const steerState = createInitialCanoeState();
  const initialYaw = steerState.yaw;
  const leftInput = { ...createEmptyInput(), forward: true, turnLeft: true };
  for (let i = 0; i < 60; i++) {
    stepCanoePhysics(steerState, leftInput, SIM_FIXED_DT);
  }
  assert.ok(
    Math.abs(steerState.yaw - initialYaw) > 0.25,
    `Expected turning input to change canoe yaw significantly`
  );
});

test('T03: Colisor de margem impede a canoa de atravessar qualquer margem do igarapé', () => {
  const state = createInitialCanoeState();
  // Push hard to the right bank while moving forward for 6 seconds
  const hardRightInput = { ...createEmptyInput(), forward: true, turnRight: true };

  for (let i = 0; i < 360; i++) {
    stepCanoePhysics(state, hardRightInput, SIM_FIXED_DT);
    const proj = projectToRiver(state.x, state.z);
    const limit = proj.sample.halfWidth - CANOE_HALF_BEAM + 0.05;
    assert.ok(
      Math.abs(proj.lateral) <= limit,
      `Canoe crossed bank at step ${i}: |lateral|=${Math.abs(proj.lateral).toFixed(3)} > limit=${limit.toFixed(3)}`
    );
  }

  // Push hard to the left bank as well
  const leftState = createInitialCanoeState(60);
  const hardLeftInput = { ...createEmptyInput(), forward: true, turnLeft: true };
  for (let i = 0; i < 360; i++) {
    stepCanoePhysics(leftState, hardLeftInput, SIM_FIXED_DT);
    const proj = projectToRiver(leftState.x, leftState.z);
    const limit = proj.sample.halfWidth - CANOE_HALF_BEAM + 0.05;
    assert.ok(
      Math.abs(proj.lateral) <= limit,
      `Canoe crossed left bank at step ${i}: |lateral|=${Math.abs(proj.lateral).toFixed(3)} > limit=${limit.toFixed(3)}`
    );
  }
});

test('Atracagem permitida apenas em margens autorizadas e trava deriva quando atracada', () => {
  const state = createInitialCanoeState();
  // At spawn (s=12), not near any authorized dock
  const invalidAttempt = toggleDocking(state);
  assert.equal(invalidAttempt.changed, false);
  assert.equal(invalidAttempt.docked, false);

  // Move canoe to first authorized dock at low speed
  const dock = DOCK_ZONES[0];
  state.x = dock.position.x;
  state.z = dock.position.z;
  state.vx = 0.2;
  state.vz = 0.2;

  const validDock = toggleDocking(state);
  assert.equal(validDock.changed, true);
  assert.equal(validDock.docked, true);
  assert.equal(state.dockedZoneId, dock.id);

  // Simulate 2 seconds docked: should remain moored without drifting downstream
  const mooredX = state.x;
  const mooredZ = state.z;
  for (let i = 0; i < 120; i++) {
    stepCanoePhysics(state, createEmptyInput(), SIM_FIXED_DT);
  }
  const driftWhileDocked = Math.hypot(state.x - mooredX, state.z - mooredZ);
  assert.ok(driftWhileDocked < 0.05, `Docked canoe should not drift, moved ${driftWhileDocked}`);

  // Undock cleanly
  const undock = toggleDocking(state);
  assert.equal(undock.changed, true);
  assert.equal(undock.docked, false);
  assert.equal(state.dockedZoneId, null);
});

test('Enquadramento fotográfico detecta fauna no campo de visão e rejeita enquadramento vazio', () => {
  const arara = FAUNA_CATALOG.find((f) => f.id === 'arara_caninde')!;
  const araraPos = getFaunaWorldPosition(arara, 0);
  const spawn = sampleRiver(12);
  const camPos = { x: spawn.center.x, y: 1.25, z: spawn.center.z };
  const dirToArara = {
    x: araraPos.x - camPos.x,
    y: araraPos.y + 0.35 - camPos.y,
    z: araraPos.z - camPos.z,
  };

  const framed = findFramedFauna(camPos, dirToArara, 0);
  assert.ok(framed !== null, 'Expected Arara-canindé to be detected when camera aims directly at it');
  assert.equal(framed?.speciesId, 'arara_caninde');

  // Aim straight up at empty sky -> null
  const emptyFrame = findFramedFauna(camPos, { x: 0, y: 1, z: 0 }, 0);
  assert.equal(emptyFrame, null);
});

test('Corrente vetorial é mais forte no centro do canal do que junto às margens', () => {
  const s = 40;
  const sample = sampleRiver(s);
  const centerCur = currentAt(sample.center.x, sample.center.z);
  const bankX = sample.center.x + sample.right.x * (sample.halfWidth - 0.6);
  const bankZ = sample.center.z + sample.right.z * (sample.halfWidth - 0.6);
  const bankCur = currentAt(bankX, bankZ);

  assert.ok(
    Math.hypot(centerCur.x, centerCur.z) > Math.hypot(bankCur.x, bankCur.z),
    'River center current should be stronger than near-bank current'
  );
});
