import * as THREE from '../../../shared/vendor/three.module.js';
import { CONFIG, ROOMS } from './config.js';

/**
 * Topologia de salas, zonas de gravidade local, portais matriciais (M_dest * R_180 * inv(M_src)),
 * colisores separados da malha visível e controlador em primeira pessoa orientado pelo vetor "up" local.
 */

export const GRAVITY_ZONES = {
  floor: {
    id: 'floor',
    label: 'Gravidade normal (chão)',
    up: new THREE.Vector3(0, 1, 0),
    forwardRef: new THREE.Vector3(0, 0, -1),
  },
  eastWall: {
    id: 'eastWall',
    label: 'Gravidade leste (parede)',
    up: new THREE.Vector3(-1, 0, 0),
    forwardRef: new THREE.Vector3(0, 1, 0),
  },
  ceiling: {
    id: 'ceiling',
    label: 'Gravidade invertida (teto)',
    up: new THREE.Vector3(0, -1, 0),
    forwardRef: new THREE.Vector3(0, 0, -1),
  },
  westWall: {
    id: 'westWall',
    label: 'Gravidade oeste (parede)',
    up: new THREE.Vector3(1, 0, 0),
    forwardRef: new THREE.Vector3(0, -1, 0),
  },
};

const R180 = new THREE.Matrix4().makeRotationY(Math.PI);

export function buildPortalMatrix(position, yaw) {
  const m = new THREE.Matrix4();
  const q = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), yaw);
  m.compose(new THREE.Vector3(...position), q, new THREE.Vector3(1, 1, 1));
  return m;
}

/**
 * Calcula matriz de transporte de portal: M_dest * R_180 * inverse(M_src)
 */
export function computePortalTransform(srcMatrix, destMatrix, target = new THREE.Matrix4()) {
  const invSrc = srcMatrix.clone().invert();
  return target.copy(destMatrix).multiply(R180).multiply(invSrc);
}

export function createPhysicsWorld(callbacks) {
  const state = {
    pos: new THREE.Vector3(...CONFIG.initialPose.pos),
    yaw: CONFIG.initialPose.yaw,
    pitch: CONFIG.initialPose.pitch,
    gravityId: 'floor',
    roomId: 'hub',
    lastSafe: {
      pos: new THREE.Vector3(...CONFIG.initialPose.pos),
      yaw: CONFIG.initialPose.yaw,
      pitch: CONFIG.initialPose.pitch,
      gravityId: 'floor',
      roomId: 'hub',
    },
    bridgePosition: 1,
    bridgeYawVisual: Math.PI / 2,
    bridgeYawGoal: Math.PI / 2,
    bridgeAligned: false,
    bridgeRotating: false,
    bridgeCrossed: false,
    galleryPosition: 1,
    galleryYawVisual: Math.PI / 2,
    galleryYawGoal: Math.PI / 2,
    galleryAligned: false,
    galleryRotating: false,
    mirrorInspected: false,
    panoramicUnlocked: false,
    panoramicActive: false,
    portalCooldown: 0,
    strideAccum: 0,
    onStair: false,
  };

  // Smooth local-up basis tracking
  const currentUp = new THREE.Vector3(0, 1, 0);
  const currentQuat = new THREE.Quaternion();
  const targetQuat = new THREE.Quaternion();
  const baseBasisQuat = new THREE.Quaternion();
  const yawQuat = new THREE.Quaternion();
  const pitchQuat = new THREE.Quaternion();
  const worldUpY = new THREE.Vector3(0, 1, 0);
  const tmpVec = new THREE.Vector3();
  const tmpForward = new THREE.Vector3();
  const tmpRight = new THREE.Vector3();
  const tmpPos = new THREE.Vector3();

  // Portais com matrizes fonte/destino explícitas
  const PORTALS = [
    {
      id: 'ponte-to-portais',
      label: 'Entrar no Corredor de Portais (Sala 4)',
      srcPos: [0, 1.65, -10.8],
      srcYaw: 0, // normal points +Z towards bridge
      destPos: [0, 1.65, -16.8],
      destYaw: Math.PI, // exits facing -Z into corridor
      radius: 1.45,
      targetRoom: 'portais',
    },
    {
      id: 'portais-to-ponte',
      label: 'Retornar à Ponte Anamórfica (Sala 1)',
      srcPos: [0, 1.65, -15.4],
      srcYaw: Math.PI,
      destPos: [0, 1.65, -8.8],
      destYaw: Math.PI,
      radius: 1.4,
      targetRoom: 'ponte',
    },
    {
      id: 'corridor-to-gallery',
      label: 'Atravessar Dobra Espacial (+90°)',
      srcPos: [-3.9, 1.65, -25.5],
      srcYaw: Math.PI / 2,
      destPos: [-4.2, 5.85, -26.2],
      destYaw: -Math.PI / 2,
      radius: 1.35,
      targetRoom: 'portais',
    },
    {
      id: 'gallery-to-corridor',
      label: 'Retornar ao Corredor Inferior',
      srcPos: [-5.8, 5.85, -26.2],
      srcYaw: Math.PI / 2,
      destPos: [-2.1, 1.65, -25.5],
      destYaw: -Math.PI / 2,
      radius: 1.35,
      targetRoom: 'portais',
    },
    {
      id: 'portais-to-espelhos',
      label: 'Entrar no Salão de Espelhos (Sala 5)',
      srcPos: [0, 1.65, -34.8],
      srcYaw: 0,
      destPos: [0, 1.65, -42.5],
      destYaw: 0,
      radius: 1.45,
      targetRoom: 'espelhos',
    },
    {
      id: 'espelhos-to-hub',
      label: 'Retornar ao Hub Central',
      srcPos: [0, 1.65, -58.5],
      srcYaw: 0,
      destPos: [0, 1.65, 8.15],
      destYaw: 0,
      radius: 1.45,
      targetRoom: 'hub',
    },
  ].map(p => {
    const srcMat = buildPortalMatrix(p.srcPos, p.srcYaw);
    const destMat = buildPortalMatrix(p.destPos, p.destYaw);
    return {
      ...p,
      srcMat,
      destMat,
      transportMat: computePortalTransform(srcMat, destMat),
    };
  });

  function getFloorSurfaceAt(x, z, curY) {
    // 1. Hub Central (z: 0.72..11.5)
    if (x >= -7.4 && x <= 7.4 && z >= 0.72 && z <= 11.4) {
      return { ok: true, y: 0, stair: false, room: z > 4.9 ? 'hub' : 'ponte' };
    }
    // 2. Ponte Anamórfica (z: -3.85..0.72, x: -0.78..0.78)
    if (z >= -3.85 && z < 0.72 && Math.abs(x) <= 0.78) {
      const settled = state.bridgeAligned && !state.bridgeRotating && Math.abs(angleDiff(state.bridgeYawVisual, state.bridgeYawGoal)) < 0.08;
      return settled ? { ok: true, y: 0, stair: false, room: 'ponte' } : { ok: false };
    }
    // 3. Sala 1 Norte (Pátio após a ponte: z: -12.3..-3.85)
    if (x >= -6.4 && x <= 6.4 && z >= -12.3 && z <= -3.85) {
      return { ok: true, y: 0, stair: false, room: 'ponte' };
    }
    // 4. Passarela Oeste -> Sala 2 Galeria de Perspectivas
    if (x >= -18.5 && x <= -7.3 && z >= 3.6 && z <= 7.2) {
      return { ok: true, y: 0, stair: false, room: x < -13 ? 'galeria' : 'hub' };
    }
    // Sala 2 — Galeria de Perspectivas (x: -33.5..-18.0)
    if (x >= -33.5 && x <= -18.0) {
      // Pátio inferior (z: -3.2..8.5)
      if (z >= -3.2 && z <= 8.5) {
        return { ok: true, y: 0, stair: false, room: 'galeria' };
      }
      // Rampa anamórfica (z: -11.4..-3.2, x: -27.4..-24.6) -> sobe de y=0 a y=2.6
      if (z >= -11.4 && z < -3.2 && x >= -27.4 && x <= -24.6) {
        const settled = state.galleryAligned && !state.galleryRotating;
        if (!settled) return { ok: false };
        const t = THREE.MathUtils.clamp((-3.2 - z) / 8.2, 0, 1);
        return { ok: true, y: t * 2.6, stair: true, room: 'galeria' };
      }
      // Terraço elevado (z: -21.5..-11.4)
      if (z >= -21.5 && z < -11.4) {
        return { ok: true, y: 2.6, stair: false, room: 'galeria' };
      }
    }
    // 5. Passarela Leste -> Sala 3 Escada de Gravidade Variável
    if (x >= 7.3 && x <= 18.5 && z >= 3.6 && z <= 7.2) {
      return { ok: true, y: 0, stair: false, room: x > 13 ? 'gravidade' : 'hub' };
    }
    // Sala 3 — Chão plano + escada leste (x: 18.0..33.4, z: -11.5..8.5)
    if (x >= 18.0 && x <= 33.4 && z >= -11.5 && z <= 8.5) {
      // Escada até o selo da parede leste (x: 26.5..33.2, z: -6.2..-1.8)
      if (x >= 26.5 && x <= 33.2 && z >= -6.2 && z <= -1.8) {
        const t = THREE.MathUtils.clamp((x - 26.5) / 6.7, 0, 1);
        return { ok: true, y: t * 1.9, stair: true, room: 'gravidade' };
      }
      return { ok: true, y: 0, stair: false, room: 'gravidade' };
    }
    // 6. Sala 4 — Corredor de Portais (z: -35.6..-15.0)
    if (z >= -35.6 && z <= -15.0) {
      // Galeria superior ortogonal (y ~ 4.2)
      if (curY > 3.2 && x >= -7.8 && x <= 7.8 && z >= -28.8 && z <= -23.4) {
        return { ok: true, y: 4.2, stair: false, room: 'portais' };
      }
      // Corredor principal + recuo do Portal A
      if ((x >= -4.3 && x <= 4.3) || (x >= -4.8 && x <= -2.2 && z >= -27.5 && z <= -23.5)) {
        return { ok: true, y: 0, stair: false, room: 'portais' };
      }
    }
    // 7. Sala 5 — Salão de Espelhos (x: -8.6..8.6, z: -59.2..-40.8)
    if (x >= -8.6 && x <= 8.6 && z >= -59.2 && z <= -40.8) {
      // Colide com pedestal central do prisma
      if (Math.hypot(x, z + 50) < 1.15) return { ok: false };
      return { ok: true, y: 0, stair: false, room: 'espelhos' };
    }
    return { ok: false };
  }

  function getGravitySurface(posVec, gravityId) {
    if (gravityId === 'floor') {
      return getFloorSurfaceAt(posVec.x, posVec.z, posVec.y - CONFIG.eyeHeight);
    }
    if (gravityId === 'eastWall') {
      // Parede em x = 33.6, normal = (-1, 0, 0), player moves in Y & Z
      if (posVec.y >= 1.5 && posVec.y <= 11.4 && posVec.z >= -9.8 && posVec.z <= 2.2) {
        const stair = posVec.z >= -6.2 && posVec.z <= -1.8;
        return { ok: true, offset: 33.6, stair, room: 'gravidade' };
      }
      return { ok: false };
    }
    if (gravityId === 'ceiling') {
      // Teto em y = 11.8, normal = (0, -1, 0), player moves in X & Z
      if (posVec.x >= 18.8 && posVec.x <= 32.8 && posVec.z >= -9.8 && posVec.z <= 2.2) {
        return { ok: true, offset: 11.8, stair: false, room: 'gravidade' };
      }
      return { ok: false };
    }
    if (gravityId === 'westWall') {
      if (posVec.y >= 1.5 && posVec.y <= 11.4 && posVec.z >= -9.8 && posVec.z <= 2.2) {
        return { ok: true, offset: 18.6, stair: false, room: 'gravidade' };
      }
      return { ok: false };
    }
    return { ok: false };
  }

  function angleDiff(a, b) {
    return THREE.MathUtils.euclideanModulo(a - b + Math.PI, Math.PI * 2) - Math.PI;
  }

  function setBasisFromGravity(gravityId, instant = false) {
    const zone = GRAVITY_ZONES[gravityId] || GRAVITY_ZONES.floor;
    targetQuat.setFromUnitVectors(worldUpY, zone.up);
    if (instant) {
      currentUp.copy(zone.up);
      currentQuat.copy(targetQuat);
    }
  }

  function saveSafePoint() {
    state.lastSafe.pos.copy(state.pos);
    state.lastSafe.yaw = state.yaw;
    state.lastSafe.pitch = state.pitch;
    state.lastSafe.gravityId = state.gravityId;
    state.lastSafe.roomId = state.roomId;
  }

  function restoreSafePoint(reason = 'Reposicionado ao último ponto seguro.') {
    state.pos.copy(state.lastSafe.pos);
    state.yaw = state.lastSafe.yaw;
    state.pitch = state.lastSafe.pitch;
    state.gravityId = state.lastSafe.gravityId;
    state.roomId = state.lastSafe.roomId;
    setBasisFromGravity(state.gravityId, true);
    callbacks.onSafeReset?.(reason);
  }

  function place(pos, yaw = 0, pitch = -0.04, gravityId = 'floor', roomId = null) {
    state.panoramicActive = false;
    state.pos.set(pos[0], pos[1], pos[2]);
    state.yaw = yaw;
    state.pitch = pitch;
    state.gravityId = gravityId;
    if (roomId) state.roomId = roomId;
    setBasisFromGravity(gravityId, true);
    saveSafePoint();
    callbacks.onRoomChange?.(state.roomId);
  }

  function switchGravity(nextId, worldSurfacePos, smooth = true) {
    if (state.gravityId === nextId) return;
    const prevUp = GRAVITY_ZONES[state.gravityId].up;
    const nextZone = GRAVITY_ZONES[nextId];
    state.gravityId = nextId;
    state.pos.copy(worldSurfacePos).addScaledVector(nextZone.up, CONFIG.eyeHeight);
    if (!smooth) {
      setBasisFromGravity(nextId, true);
      callbacks.onTransitionFade?.();
    } else {
      setBasisFromGravity(nextId, false);
    }
    // Keep sensible pitch so user faces along new walkway
    state.pitch = -0.05;
    if (prevUp.dot(nextZone.up) < -0.5) state.yaw = Math.PI;
    saveSafePoint();
    callbacks.onGravityChange?.(nextZone);
  }

  function moveLocal(forwardAmt, rightAmt, dt, smoothTransitions) {
    if (state.panoramicActive) return;
    const mag = Math.hypot(forwardAmt, rightAmt);
    if (mag < 1e-4) return;
    const stepLen = (CONFIG.walkSpeed * dt) / Math.max(1, mag);

    const up = GRAVITY_ZONES[state.gravityId].up;
    // Build tangent vectors in current local frame
    baseBasisQuat.setFromUnitVectors(worldUpY, up);
    yawQuat.setFromAxisAngle(worldUpY, state.yaw);
    tmpForward.set(0, 0, -1).applyQuaternion(baseBasisQuat).applyAxisAngle(up, state.yaw);
    // Wait: let's compute clean tangent forward/right directly via yaw around local up:
    tmpForward.set(0, 0, -1).applyQuaternion(baseBasisQuat);
    tmpForward.applyAxisAngle(up, state.yaw).normalize();
    tmpRight.crossVectors(tmpForward, up).normalize();

    const moveX = (tmpForward.x * forwardAmt + tmpRight.x * rightAmt) * stepLen;
    const moveY = (tmpForward.y * forwardAmt + tmpRight.y * rightAmt) * stepLen;
    const moveZ = (tmpForward.z * forwardAmt + tmpRight.z * rightAmt) * stepLen;

    // Axis-separated sliding on tangent plane
    const tryMove = (dx, dy, dz) => {
      tmpPos.set(state.pos.x + dx, state.pos.y + dy, state.pos.z + dz);
      const res = getGravitySurface(tmpPos, state.gravityId);
      if (!res.ok) return false;
      state.pos.copy(tmpPos);
      if (state.gravityId === 'floor') {
        state.pos.y = res.y + CONFIG.eyeHeight;
      } else if (state.gravityId === 'eastWall') {
        state.pos.x = res.offset - CONFIG.eyeHeight;
      } else if (state.gravityId === 'ceiling') {
        state.pos.y = res.offset - CONFIG.eyeHeight;
      } else if (state.gravityId === 'westWall') {
        state.pos.x = res.offset + CONFIG.eyeHeight;
      }
      state.onStair = Boolean(res.stair);
      if (res.room && res.room !== state.roomId) {
        state.roomId = res.room;
        callbacks.onRoomChange?.(res.room);
      }
      return true;
    };

    let moved = false;
    if (state.gravityId === 'floor' || state.gravityId === 'ceiling') {
      if (tryMove(moveX, 0, 0)) moved = true;
      if (tryMove(0, 0, moveZ)) moved = true;
    } else {
      if (tryMove(0, moveY, 0)) moved = true;
      if (tryMove(0, 0, moveZ)) moved = true;
    }

    if (moved) {
      state.strideAccum += stepLen * mag;
      if (state.strideAccum > 0.78) {
        state.strideAccum = 0;
        callbacks.onFootstep?.(state.onStair);
      }
      // Update safe checkpoint when solidly on non-bridge ground
      if (
        !(state.roomId === 'ponte' && state.pos.z > -3.8 && state.pos.z < 0.72) &&
        !(state.roomId === 'galeria' && state.pos.z > -11.4 && state.pos.z < -3.2)
      ) {
        saveSafePoint();
      }

      if (state.bridgeAligned && !state.bridgeCrossed && state.pos.z < -4.15 && state.pos.z > -12.5 && Math.abs(state.pos.x) < 6.5) {
        state.bridgeCrossed = true;
        callbacks.onBridgeCrossed?.();
      }
    }

    // Check automatic portal crossing when walking into portal aperture
    if (state.portalCooldown <= 0 && state.gravityId === 'floor') {
      for (const portal of PORTALS) {
        const dx = state.pos.x - portal.srcPos[0];
        const dy = state.pos.y - portal.srcPos[1];
        const dz = state.pos.z - portal.srcPos[2];
        if (dx * dx + dy * dy + dz * dz < 1.05 * 1.05) {
          traversePortal(portal, smoothTransitions);
          break;
        }
      }
    }
  }

  function traversePortal(portal, smooth = true) {
    state.portalCooldown = 0.75;
    // Transform pose via M_dest * R_180 * inv(M_src)
    const pMat = new THREE.Matrix4();
    const pQuat = new THREE.Quaternion().setFromAxisAngle(worldUpY, state.yaw);
    pMat.compose(state.pos, pQuat, new THREE.Vector3(1, 1, 1));
    const outMat = new THREE.Matrix4().copy(portal.transportMat).multiply(pMat);

    const outPos = new THREE.Vector3();
    const outQuat = new THREE.Quaternion();
    const outScale = new THREE.Vector3();
    outMat.decompose(outPos, outQuat, outScale);

    // Ensure valid grounded height at destination
    const euler = new THREE.Euler().setFromQuaternion(outQuat, 'YXZ');
    state.pos.copy(outPos);
    state.yaw = portal.destYaw; // Preserve forward-into-destination orientation without wall bounce
    state.roomId = portal.targetRoom;
    state.gravityId = 'floor';
    setBasisFromGravity('floor', true);
    saveSafePoint();
    if (!smooth) callbacks.onTransitionFade?.();
    else callbacks.onTransitionFade?.();
    callbacks.onPortal?.(portal);
    callbacks.onRoomChange?.(state.roomId);
  }

  function getContextualCandidate() {
    // Ponto de observação (Sala 1)
    if (state.gravityId === 'floor' && Math.hypot(state.pos.x - CONFIG.observationPoint.x, state.pos.z - CONFIG.observationPoint.z) < 1.25) {
      return {
        id: 'align-bridge',
        label: 'Alinhar plataformas',
        action: () => alignBridge(),
      };
    }
    // Galeria de Perspectivas ponto de observação
    if (state.gravityId === 'floor' && Math.hypot(state.pos.x - CONFIG.galleryObservationPoint.x, state.pos.z - CONFIG.galleryObservationPoint.z) < 1.45) {
      return {
        id: 'align-gallery',
        label: 'Alinhar perspectiva',
        action: () => alignGallery(),
      };
    }
    // Terraço superior Sala 2 -> Vista panorâmica
    if (state.gravityId === 'floor' && state.pos.x < -18 && state.pos.z < -12 && state.pos.y > 3.2) {
      return {
        id: 'unlock-panorama',
        label: state.panoramicActive ? 'Sair da vista panorâmica' : 'Desbloquear vista panorâmica',
        action: () => togglePanoramic(),
      };
    }
    // Placas gravitacionais Sala 3
    if (state.gravityId === 'floor' && Math.hypot(state.pos.x - 32.3, state.pos.z + 4.0) < 2.2) {
      return {
        id: 'grav-east',
        label: 'Mudar gravidade: Parede Leste',
        action: () => switchGravity('eastWall', new THREE.Vector3(33.6, 2.5, -4.0), callbacks.isSmooth?.()),
      };
    }
    if (state.gravityId === 'eastWall' && Math.hypot(state.pos.y - 10.6, state.pos.z + 4.0) < 2.2) {
      return {
        id: 'grav-ceiling',
        label: 'Mudar gravidade: Teto',
        action: () => switchGravity('ceiling', new THREE.Vector3(31.2, 11.8, -4.0), callbacks.isSmooth?.()),
      };
    }
    if (state.gravityId === 'ceiling' && Math.hypot(state.pos.x - 20.0, state.pos.z + 4.0) < 2.2) {
      return {
        id: 'grav-floor',
        label: 'Retornar gravidade: Chão',
        action: () => switchGravity('floor', new THREE.Vector3(20.0, 0, -4.0), callbacks.isSmooth?.()),
      };
    }
    // Espelhos Sala 5 — Prisma central
    if (state.gravityId === 'floor' && Math.hypot(state.pos.x, state.pos.z + 50.0) < 3.2) {
      return {
        id: 'inspect-mirror',
        label: 'Alinhar reflexo do prisma',
        action: () => inspectMirror(),
      };
    }
    // Portais manuais
    if (state.gravityId === 'floor') {
      for (const p of PORTALS) {
        const d = Math.hypot(state.pos.x - p.srcPos[0], state.pos.z - p.srcPos[2]);
        if (d < p.radius + 0.65 && Math.abs(state.pos.y - p.srcPos[1]) < 1.5) {
          return {
            id: p.id,
            label: p.label,
            action: () => traversePortal(p, callbacks.isSmooth?.()),
          };
        }
      }
    }
    return null;
  }

  function isOnMovingStructure() {
    if (state.gravityId !== 'floor') return false;
    if (state.pos.z >= -3.85 && state.pos.z <= 0.72 && Math.abs(state.pos.x) < 1.3) return true;
    if (state.pos.x >= -27.5 && state.pos.x <= -24.5 && state.pos.z >= -11.4 && state.pos.z <= -3.2) return true;
    return false;
  }

  function rotateMechanism() {
    if (isOnMovingStructure()) {
      callbacks.onMessage?.('Saia da estrutura móvel antes de girar o mecanismo.');
      return false;
    }
    if (state.roomId === 'galeria') {
      state.galleryPosition = (state.galleryPosition + 1) % 4;
      state.galleryAligned = false;
      state.galleryRotating = true;
      state.galleryYawGoal = (state.galleryPosition * Math.PI) / 2;
      callbacks.onRotate?.(state.galleryPosition * 90);
      return true;
    }
    state.bridgePosition = (state.bridgePosition + 1) % 4;
    state.bridgeAligned = false;
    state.bridgeRotating = true;
    state.bridgeYawGoal = (state.bridgePosition * Math.PI) / 2;
    callbacks.onRotate?.(state.bridgePosition * 90);
    return true;
  }

  function alignBridge() {
    const nearObs = Math.hypot(state.pos.x - CONFIG.observationPoint.x, state.pos.z - CONFIG.observationPoint.z) < CONFIG.observationPoint.range;
    if (!nearObs) {
      callbacks.onMessage?.('Use o Ponto de Observação para alinhar as plataformas.');
      return false;
    }
    if (state.bridgePosition % 2 !== 0) {
      callbacks.onMessage?.('As plataformas ainda estão perpendiculares. Gire a estrutura em 90°.');
      return false;
    }
    state.bridgeAligned = true;
    callbacks.onBridgeAligned?.();
    return true;
  }

  function alignGallery() {
    const nearObs = Math.hypot(state.pos.x - CONFIG.galleryObservationPoint.x, state.pos.z - CONFIG.galleryObservationPoint.z) < CONFIG.galleryObservationPoint.range;
    if (!nearObs) {
      callbacks.onMessage?.('Aproxime-se do medalhão da Galeria para alinhar pela perspectiva.');
      return false;
    }
    if (state.galleryPosition % 2 !== 0) {
      callbacks.onMessage?.('Os degraus suspensos estão fora de eixo. Gire 90° primeiro.');
      return false;
    }
    state.galleryAligned = true;
    callbacks.onGalleryAligned?.();
    return true;
  }

  function inspectMirror() {
    state.mirrorInspected = true;
    state.panoramicUnlocked = true;
    callbacks.onMirrorInspected?.();
    return true;
  }

  function togglePanoramic() {
    state.panoramicUnlocked = true;
    state.panoramicActive = !state.panoramicActive;
    callbacks.onPanoramicToggle?.(state.panoramicActive);
  }

  function resetRoom(roomId = state.roomId) {
    const room = ROOMS.find(r => r.id === roomId) || ROOMS[0];
    if (roomId === 'ponte' || roomId === 'hub') {
      state.bridgePosition = 1;
      state.bridgeYawGoal = Math.PI / 2;
      state.bridgeYawVisual = Math.PI / 2;
      state.bridgeAligned = false;
      state.bridgeCrossed = false;
      state.bridgeRotating = false;
    }
    if (roomId === 'galeria') {
      state.galleryPosition = 1;
      state.galleryYawGoal = Math.PI / 2;
      state.galleryYawVisual = Math.PI / 2;
      state.galleryAligned = false;
      state.galleryRotating = false;
    }
    place(room.spawn.pos, room.spawn.yaw, room.spawn.pitch, room.spawn.gravityId, room.id);
  }

  function step(dt, reducedMotion) {
    if (state.portalCooldown > 0) state.portalCooldown = Math.max(0, state.portalCooldown - dt);

    // Smoothly rotate bridge
    const bErr = angleDiff(state.bridgeYawGoal, state.bridgeYawVisual);
    if (Math.abs(bErr) > 0.002) {
      state.bridgeYawVisual += reducedMotion ? bErr : bErr * Math.min(1, dt * 7.5);
      state.bridgeRotating = Math.abs(angleDiff(state.bridgeYawGoal, state.bridgeYawVisual)) > 0.03;
    } else {
      state.bridgeYawVisual = state.bridgeYawGoal;
      state.bridgeRotating = false;
    }

    // Smoothly rotate gallery sculpture
    const gErr = angleDiff(state.galleryYawGoal, state.galleryYawVisual);
    if (Math.abs(gErr) > 0.002) {
      state.galleryYawVisual += reducedMotion ? gErr : gErr * Math.min(1, dt * 7.5);
      state.galleryRotating = Math.abs(angleDiff(state.galleryYawGoal, state.galleryYawVisual)) > 0.03;
    } else {
      state.galleryYawVisual = state.galleryYawGoal;
      state.galleryRotating = false;
    }

    // Smooth local-up interpolation for comfortable gravity shifts
    const zone = GRAVITY_ZONES[state.gravityId];
    targetQuat.setFromUnitVectors(worldUpY, zone.up);
    if (reducedMotion || currentQuat.angleTo(targetQuat) < 0.002) {
      currentQuat.copy(targetQuat);
      currentUp.copy(zone.up);
    } else {
      currentQuat.slerp(targetQuat, Math.min(1, dt * 5.5));
      currentUp.set(0, 1, 0).applyQuaternion(currentQuat).normalize();
    }
  }

  function syncCamera(camera) {
    if (state.panoramicActive) {
      camera.position.set(...CONFIG.panoramicPose.pos);
      camera.up.set(0, 1, 0);
      camera.quaternion.setFromEuler(new THREE.Euler(CONFIG.panoramicPose.pitch, CONFIG.panoramicPose.yaw, 0, 'YXZ'));
      camera.updateMatrixWorld();
      return;
    }
    camera.position.copy(state.pos);
    camera.up.copy(currentUp);
    yawQuat.setFromAxisAngle(worldUpY, state.yaw);
    pitchQuat.setFromAxisAngle(new THREE.Vector3(1, 0, 0), state.pitch);
    camera.quaternion.copy(currentQuat).multiply(yawQuat).multiply(pitchQuat);
    camera.updateMatrixWorld();
  }

  setBasisFromGravity('floor', true);

  return {
    state,
    PORTALS,
    moveLocal,
    lookDelta(dx, dy) {
      if (state.panoramicActive) return;
      state.yaw -= dx * 0.0046;
      state.pitch = THREE.MathUtils.clamp(state.pitch - dy * 0.0042, -1.18, 1.18);
    },
    rotateMechanism,
    alignBridge,
    alignGallery,
    inspectMirror,
    togglePanoramic,
    getContextualCandidate,
    switchGravity,
    place,
    resetRoom,
    restoreSafePoint,
    step,
    syncCamera,
    isGravityZoneReady() {
      return state.gravityId;
    },
  };
}
