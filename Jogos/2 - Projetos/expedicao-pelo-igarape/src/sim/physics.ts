/**
 * Pure deterministic fixed-timestep simulation for the wooden Amazonian canoe.
 *
 * Physical approximations (documented for didactic transparency in HUD/Settings):
 * - Planar hydrodynamics: linear + quadratic water drag relative to local river current.
 * - Buoyancy/seakeeping: harmonic heave, pitch, and roll response to speed, turns, and waves.
 * - Paddle strokes: discrete rhythmic thrust & yaw torque impulses (left/right/alternate/brake).
 * - Bank collisions: smooth lateral channel boundary constraint + velocity slide/restitution,
 *   guaranteeing the hull never penetrates the riverbank.
 */

import {
  DOCK_ZONES,
  DockZone,
  FAUNA_CATALOG,
  FaunaSpeciesId,
  RIVER_LENGTH,
  STRETCHES,
  Vec2,
  Vec3,
  currentAt,
  getFaunaWorldPosition,
  getStretchForS,
  projectToRiver,
  sampleRiver,
} from './river';

export const SIM_FIXED_DT = 1 / 60;
export const CANOE_HALF_BEAM = 0.78; // half-width of hull for bank collision clearance
export const CANOE_MIN_S = 3.5;
export const CANOE_MAX_S = RIVER_LENGTH - 6;
export const MAX_PADDLE_SPEED = 4.6; // m/s relative to water

export interface SimInput {
  forward: boolean;
  backward: boolean;
  turnLeft: boolean;
  turnRight: boolean;
  /** Optional continuous analog throttle [-1, 1] and steer [-1, 1] (mobile joystick / drag) */
  analogThrottle: number;
  analogSteer: number;
  /** Edge-triggered manual paddle impulse on side (-1 left, +1 right, 0 none) */
  manualStrokeSide: -1 | 0 | 1;
}

export interface PaddleAnimationState {
  side: -1 | 1; // -1 left, +1 right
  phase: number; // 0..1 stroke cycle
  active: boolean;
  dipIntensity: number; // 0..1 water immersion for splash/audio
}

export interface JournalPhotoEntry {
  speciesId: FaunaSpeciesId;
  timestamp: number;
  stretchId: number;
  timePreset: string;
  distanceMeters: number;
  thumbnailDataUrl: string | null;
}

export interface CanoeState {
  x: number;
  z: number;
  /** Yaw in radians: 0 faces -Z, positive turns left (CCW around +Y). */
  yaw: number;
  vx: number;
  vz: number;
  angularVelocity: number;
  /** River coordinates cached after each step */
  s: number;
  lateral: number;
  stretchId: number;
  /** Current velocity at canoe position (m/s) */
  currentVx: number;
  currentVz: number;
  /** Buoyancy visual offsets */
  heave: number;
  pitch: number;
  roll: number;
  /** Paddle stroke cooldown & animation */
  strokeTimer: number;
  nextAutoSide: -1 | 1;
  paddle: PaddleAnimationState;
  /** Docking state */
  dockedZoneId: string | null;
  nearbyDockId: string | null;
  /** Bank collision contact intensity [0..1] for feedback */
  bankContact: number;
  /** Total distance traveled (m) and elapsed sim time (s) */
  distanceTraveled: number;
  simTime: number;
  /** Stroke count (for telemetry & sound events) */
  strokeCount: number;
}

export interface StepResult {
  strokeTriggered: boolean;
  strokeSide: -1 | 1;
  strokeStrength: number;
  bankBumped: boolean;
}

export function createEmptyInput(): SimInput {
  return {
    forward: false,
    backward: false,
    turnLeft: false,
    turnRight: false,
    analogThrottle: 0,
    analogSteer: 0,
    manualStrokeSide: 0,
  };
}

/**
 * Deterministic initial state spawning the canoe in Stretch 1 (Remanso das Samaúmas)
 * aligned with the river tangent so the opening vista matches the mockup composition.
 */
export function createInitialCanoeState(spawnS = STRETCHES[0].spawnS): CanoeState {
  const clampedS = Math.max(CANOE_MIN_S, Math.min(CANOE_MAX_S, spawnS));
  const sample = sampleRiver(clampedS);
  const yaw = Math.atan2(-sample.tangent.x, -sample.tangent.z);
  const cur = currentAt(sample.center.x, sample.center.z);
  return {
    x: sample.center.x,
    z: sample.center.z,
    yaw,
    vx: cur.x * 0.45,
    vz: cur.z * 0.45,
    angularVelocity: 0,
    s: clampedS,
    lateral: 0,
    stretchId: getStretchForS(clampedS).id,
    currentVx: cur.x,
    currentVz: cur.z,
    heave: 0,
    pitch: 0,
    roll: 0,
    strokeTimer: 0,
    nextAutoSide: 1,
    paddle: {
      side: 1,
      phase: 0.35,
      active: false,
      dipIntensity: 0,
    },
    dockedZoneId: null,
    nearbyDockId: null,
    bankContact: 0,
    distanceTraveled: 0,
    simTime: 0,
    strokeCount: 0,
  };
}

/**
 * Forward unit vector for a given yaw (yaw=0 -> (0, -1), yaw=+pi/2 -> (-1, 0)).
 */
export function forwardFromYaw(yaw: number): Vec2 {
  return {
    x: -Math.sin(yaw),
    z: -Math.cos(yaw),
  };
}

/**
 * Find the closest authorized docking zone if within range.
 */
export function findNearbyDock(x: number, z: number): DockZone | null {
  let best: DockZone | null = null;
  let bestDist = Infinity;
  for (const zone of DOCK_ZONES) {
    const d = Math.hypot(x - zone.position.x, z - zone.position.z);
    if (d <= zone.radius && d < bestDist) {
      bestDist = d;
      best = zone;
    }
  }
  return best;
}

/**
 * Attempt to dock or undock the canoe. Returns status message and whether state changed.
 */
export function toggleDocking(state: CanoeState): {
  changed: boolean;
  docked: boolean;
  zone: DockZone | null;
  message: string;
} {
  if (state.dockedZoneId) {
    const prev = DOCK_ZONES.find((z) => z.id === state.dockedZoneId) ?? null;
    state.dockedZoneId = null;
    return {
      changed: true,
      docked: false,
      zone: prev,
      message: 'Canoa desatracada. Você voltou à correnteza do igarapé.',
    };
  }

  const nearby = findNearbyDock(state.x, state.z);
  if (!nearby) {
    return {
      changed: false,
      docked: false,
      zone: null,
      message: 'Atracagem permitida apenas nas margens autorizadas e sinalizadas no mapa.',
    };
  }

  const speed = Math.hypot(state.vx, state.vz);
  if (speed > 2.35) {
    return {
      changed: false,
      docked: false,
      zone: nearby,
      message: 'Reduza a velocidade (S) para atracar com segurança na margem.',
    };
  }

  state.dockedZoneId = nearby.id;
  state.vx = 0;
  state.vz = 0;
  state.angularVelocity = 0;
  return {
    changed: true,
    docked: true,
    zone: nearby,
    message: `Atracado em ${nearby.name}. Aproveite para observar a fauna com calma.`,
  };
}

/**
 * Advance the canoe physics by a single fixed timestep dt (in seconds).
 * Mutates `state` in place for zero-GC simulation.
 */
export function stepCanoePhysics(
  state: CanoeState,
  input: SimInput,
  dt: number = SIM_FIXED_DT
): StepResult {
  const safeDt = Math.max(0.001, Math.min(0.05, dt));
  state.simTime += safeDt;
  state.bankContact = Math.max(0, state.bankContact - safeDt * 2.5);

  const cur = currentAt(state.x, state.z);
  state.currentVx = cur.x;
  state.currentVz = cur.z;

  const nearbyDock = findNearbyDock(state.x, state.z);
  state.nearbyDockId = nearbyDock ? nearbyDock.id : null;

  let strokeTriggered = false;
  let strokeSide: -1 | 1 = state.paddle.side;
  let strokeStrength = 0;
  let bankBumped = false;

  // If docked, smoothly moor near the docking anchor point and sway gently
  if (state.dockedZoneId) {
    const zone = DOCK_ZONES.find((z) => z.id === state.dockedZoneId);
    if (zone) {
      const pull = 1 - Math.exp(-4 * safeDt);
      state.x += (zone.position.x - state.x) * pull;
      state.z += (zone.position.z - state.z) * pull;
      state.vx *= 0.8;
      state.vz *= 0.8;
      state.angularVelocity *= 0.8;
    }
    state.paddle.active = false;
    state.paddle.dipIntensity = Math.max(0, state.paddle.dipIntensity - safeDt * 3);
    state.heave = Math.sin(state.simTime * 1.4) * 0.025;
    state.roll = Math.sin(state.simTime * 0.95) * 0.018;
    state.pitch = Math.cos(state.simTime * 1.15) * 0.012;
    const proj = projectToRiver(state.x, state.z);
    state.s = proj.s;
    state.lateral = proj.lateral;
    state.stretchId = getStretchForS(proj.s).id;
    return { strokeTriggered, strokeSide, strokeStrength, bankBumped };
  }

  const fwd = forwardFromYaw(state.yaw);
  const right = { x: -fwd.z, z: fwd.x };

  // Combine keyboard & analog inputs
  const throttleIntent = Math.max(
    -1,
    Math.min(1, (input.forward ? 1 : 0) - (input.backward ? 1 : 0) + input.analogThrottle)
  );
  const steerIntent = Math.max(
    -1,
    Math.min(1, (input.turnLeft ? 1 : 0) - (input.turnRight ? 1 : 0) + input.analogSteer)
  );

  // Rhythmic paddle strokes
  state.strokeTimer = Math.max(0, state.strokeTimer - safeDt);

  if (input.manualStrokeSide !== 0 && state.strokeTimer <= 0.12) {
    strokeTriggered = true;
    strokeSide = input.manualStrokeSide;
    strokeStrength = 1.0;
    state.strokeTimer = 0.62;
    state.paddle.side = strokeSide;
    state.paddle.phase = 0;
    state.paddle.active = true;
    state.strokeCount += 1;
    // Paddling on the right pushes bow slightly left (+yaw) and thrusts forward
    state.vx += fwd.x * 1.38;
    state.vz += fwd.z * 1.38;
    state.angularVelocity += strokeSide * 0.42;
  } else if (Math.abs(throttleIntent) > 0.12 && state.strokeTimer <= 0) {
    strokeTriggered = true;
    strokeSide =
      steerIntent > 0.25 ? 1 : steerIntent < -0.25 ? -1 : state.nextAutoSide;
    state.nextAutoSide = strokeSide === 1 ? -1 : 1;
    strokeStrength = Math.abs(throttleIntent);
    state.strokeTimer = 0.68;
    state.paddle.side = strokeSide;
    state.paddle.phase = 0;
    state.paddle.active = true;
    state.strokeCount += 1;

    const impulse = throttleIntent > 0 ? 1.28 * throttleIntent : 0.92 * throttleIntent;
    state.vx += fwd.x * impulse;
    state.vz += fwd.z * impulse;
    // Subtle natural yaw sway from alternating side strokes
    state.angularVelocity += strokeSide * 0.085 * throttleIntent;
  }

  // Continuous hydrodynamic thrust & rudder/paddle steering assist so controls feel crisp and responsive
  const continuousThrust = throttleIntent * 2.15;
  state.vx += fwd.x * continuousThrust * safeDt;
  state.vz += fwd.z * continuousThrust * safeDt;

  const steerTorque = steerIntent * 2.65;
  state.angularVelocity += steerTorque * safeDt;

  // Paddle stroke animation progression
  if (state.paddle.active) {
    state.paddle.phase += safeDt / 0.64;
    if (state.paddle.phase >= 1) {
      state.paddle.phase = 1;
      state.paddle.active = false;
      state.paddle.dipIntensity = 0;
    } else {
      state.paddle.dipIntensity = Math.sin(state.paddle.phase * Math.PI);
    }
  } else {
    state.paddle.dipIntensity = Math.max(0, state.paddle.dipIntensity - safeDt * 4);
  }

  // Water velocity relative to the local river current (key to T01 drift!)
  const relVx = state.vx - cur.x;
  const relVz = state.vz - cur.z;

  // Decompose relative velocity into longitudinal (low drag) and lateral (keel high drag)
  const relFwd = relVx * fwd.x + relVz * fwd.z;
  const relLat = relVx * right.x + relVz * right.z;

  // Hydrodynamic drag forces (linear + quadratic)
  const dragFwd = -relFwd * (1.28 + 0.36 * Math.abs(relFwd));
  const dragLat = -relLat * (5.2 + 1.4 * Math.abs(relLat));

  const ax = fwd.x * dragFwd + right.x * dragLat;
  const az = fwd.z * dragFwd + right.z * dragLat;

  state.vx += ax * safeDt;
  state.vz += az * safeDt;

  // Clamp maximum relative water speed to physical canoe range
  const newRelVx = state.vx - cur.x;
  const newRelVz = state.vz - cur.z;
  const relSpeed = Math.hypot(newRelVx, newRelVz);
  if (relSpeed > MAX_PADDLE_SPEED) {
    const scale = MAX_PADDLE_SPEED / relSpeed;
    state.vx = cur.x + newRelVx * scale;
    state.vz = cur.z + newRelVz * scale;
  }

  // Gentle weathervane alignment toward river current when drifting freely
  const projBefore = projectToRiver(state.x, state.z);
  const currentYaw = Math.atan2(-projBefore.sample.tangent.x, -projBefore.sample.tangent.z);
  const yawDiff = normalizeAngle(currentYaw - state.yaw);
  if (Math.abs(steerIntent) < 0.05) {
    state.angularVelocity += yawDiff * 0.22 * safeDt;
  }

  // Angular damping
  state.angularVelocity *= Math.exp(-3.4 * safeDt);
  state.angularVelocity = Math.max(-2.0, Math.min(2.0, state.angularVelocity));

  // Integrate pose
  const prevX = state.x;
  const prevZ = state.z;
  state.x += state.vx * safeDt;
  state.z += state.vz * safeDt;
  state.yaw = normalizeAngle(state.yaw + state.angularVelocity * safeDt);

  // Enforce bank colliders & upstream/downstream soft bounds (T03)
  const proj = projectToRiver(state.x, state.z);
  const maxLateral = Math.max(1.5, proj.sample.halfWidth - CANOE_HALF_BEAM);
  let clampedS = proj.s;
  let clampedLat = proj.lateral;
  let collided = false;

  if (Math.abs(clampedLat) > maxLateral) {
    const sign = clampedLat >= 0 ? 1 : -1;
    clampedLat = sign * maxLateral;
    collided = true;
    // Remove outward velocity component along bank normal, slide smoothly along tangent
    const outwardSpeed = state.vx * proj.sample.right.x + state.vz * proj.sample.right.z;
    if (outwardSpeed * sign > 0) {
      state.vx -= proj.sample.right.x * outwardSpeed * 1.15;
      state.vz -= proj.sample.right.z * outwardSpeed * 1.15;
    }
    // Gently nudge bow away from bank
    state.angularVelocity -= sign * 0.35 * safeDt * 6;
    bankBumped = Math.abs(outwardSpeed) > 0.25;
  }

  if (clampedS < CANOE_MIN_S) {
    clampedS = CANOE_MIN_S;
    collided = true;
    const along = state.vx * proj.sample.tangent.x + state.vz * proj.sample.tangent.z;
    if (along < 0) {
      state.vx -= proj.sample.tangent.x * along;
      state.vz -= proj.sample.tangent.z * along;
    }
  } else if (clampedS > CANOE_MAX_S) {
    clampedS = CANOE_MAX_S;
    collided = true;
    const along = state.vx * proj.sample.tangent.x + state.vz * proj.sample.tangent.z;
    if (along > 0) {
      state.vx -= proj.sample.tangent.x * along;
      state.vz -= proj.sample.tangent.z * along;
    }
  }

  if (collided) {
    const corrected = sampleRiver(clampedS);
    state.x = corrected.center.x + corrected.right.x * clampedLat;
    state.z = corrected.center.z + corrected.right.z * clampedLat;
    state.bankContact = Math.min(1, state.bankContact + 0.65);
  }

  const finalProj = projectToRiver(state.x, state.z);
  state.s = finalProj.s;
  state.lateral = finalProj.lateral;
  state.stretchId = getStretchForS(finalProj.s).id;

  const stepDist = Math.hypot(state.x - prevX, state.z - prevZ);
  state.distanceTraveled += stepDist;

  // Buoyancy & gentle wave seakeeping response
  const speed = Math.hypot(state.vx, state.vz);
  const targetHeave =
    Math.sin(state.simTime * 1.7 + state.s * 0.35) * 0.028 +
    Math.cos(state.simTime * 2.9) * 0.01;
  const targetPitch =
    Math.min(0.055, speed * 0.011) +
    Math.sin(state.simTime * 1.3) * 0.012 +
    state.paddle.dipIntensity * 0.012;
  const targetRoll =
    -state.angularVelocity * 0.085 +
    state.paddle.side * state.paddle.dipIntensity * 0.025 +
    Math.sin(state.simTime * 1.15 + 0.8) * 0.016;

  const damp = 1 - Math.exp(-6.5 * safeDt);
  state.heave += (targetHeave - state.heave) * damp;
  state.pitch += (targetPitch - state.pitch) * damp;
  state.roll += (targetRoll - state.roll) * damp;

  return { strokeTriggered, strokeSide, strokeStrength, bankBumped };
}

export function normalizeAngle(angle: number): number {
  let a = angle;
  while (a > Math.PI) a -= Math.PI * 2;
  while (a < -Math.PI) a += Math.PI * 2;
  return a;
}

/**
 * Evaluate which fauna species (if any) is currently framed inside the camera's
 * observation cone. Used for the naturalist viewfinder and photo capture validation.
 */
export interface FramedFaunaResult {
  speciesId: FaunaSpeciesId;
  name: string;
  scientificName: string;
  distance: number;
  alignment: number; // dot product [0..1]
}

export function findFramedFauna(
  cameraPos: Vec3,
  cameraForward: Vec3,
  simTime: number,
  maxDistance = 38,
  minCosAngle = 0.92
): FramedFaunaResult | null {
  const fwdLen = Math.hypot(cameraForward.x, cameraForward.y, cameraForward.z) || 1;
  const fx = cameraForward.x / fwdLen;
  const fy = cameraForward.y / fwdLen;
  const fz = cameraForward.z / fwdLen;

  let best: FramedFaunaResult | null = null;
  let bestScore = -Infinity;

  for (const spec of FAUNA_CATALOG) {
    const pos = getFaunaWorldPosition(spec, simTime);
    const dx = pos.x - cameraPos.x;
    const dy = pos.y + 0.35 - cameraPos.y;
    const dz = pos.z - cameraPos.z;
    const dist = Math.hypot(dx, dy, dz);
    if (dist < 1.0 || dist > maxDistance) continue;
    const dot = (dx * fx + dy * fy + dz * fz) / dist;
    if (dot >= minCosAngle) {
      // Prefer tighter alignment and closer species
      const score = dot * 100 - dist * 0.5;
      if (score > bestScore) {
        bestScore = score;
        best = {
          speciesId: spec.id,
          name: spec.name,
          scientificName: spec.scientificName,
          distance: dist,
          alignment: dot,
        };
      }
    }
  }
  return best;
}
