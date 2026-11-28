/**
 * main.js
 * Orquestrador principal do jogo # 053 — Jardim de Areia (Karesansui).
 * Three.js r187 WebGL + THREE.Timer + timestep fixo (1/60s) + Web Audio + SangiBridge.
 */
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { createStudioEnvironment } from '/Sistema/shared/engine/studio-environment.js';
import {
  BASIN_D,
  BASIN_W,
  INITIAL_ROCKS,
  QUALITY_PROFILES,
  RAKE_WIDTHS,
  SEED,
  createDefaultState,
} from './js/state.js';
import { createZenMaterials } from './js/materials.js';
import { createSandSimulation } from './js/sand-physics.js';
import { buildGardenWorld } from './js/garden-world.js';
import { createZenAudioEngine } from './js/audio-engine.js';
import { createUIController } from './js/ui-controller.js';

const canvas = document.getElementById('stage-canvas');
const webglStatus = document.getElementById('webgl-status');
const mobileCamPad = document.getElementById('mobile-cam-pad');

let renderer;
try {
  renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    powerPreference: 'high-performance',
  });
} catch (err) {
  if (webglStatus) {
    webglStatus.hidden = false;
    webglStatus.querySelector('.webgl-msg').textContent =
      'Não foi possível iniciar o contexto WebGL 3D neste navegador.';
  }
  throw err;
}

renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.04;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xd6dbd6);
scene.fog = new THREE.FogExp2(0xd6dbd6, 0.017);

const envRT = createStudioEnvironment(renderer);
scene.environment = envRT.texture;
scene.environmentIntensity = 0.62;

const camera = new THREE.PerspectiveCamera(
  42,
  window.innerWidth / Math.max(1, window.innerHeight),
  0.15,
  90
);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.dampingFactor = 0.085;
controls.minDistance = 4.2;
controls.maxDistance = 17.5;
controls.minPolarAngle = 0.20;
controls.maxPolarAngle = Math.PI * 0.435;
controls.screenSpacePanning = false;

const state = createDefaultState();
const mats = createZenMaterials(SEED);
const world = buildGardenWorld(scene, mats);
const sand = createSandSimulation(scene, mats.sandMat, world.rocks);
const audio = createZenAudioEngine();

let disposed = false;
let dragState = null;
let lastWarnAt = 0;
let fpsWindowTime = 0;
let fpsWindowFrames = 0;
let lowFpsStreak = 0;
let currentFps = 60;
const keysHeld = new Set();

const CAMERA_PRESETS = {
  classic: { pos: [4.5, 5.5, 7.9], mobilePos: [5.4, 7.3, 9.2], target: [0.0, 0.20, -0.55] },
  grazing: { pos: [6.0, 2.35, 5.1], mobilePos: [6.4, 2.9, 6.2], target: [-0.45, 0.06, -0.25] },
  top:     { pos: [0.02, 10.8, 2.1], mobilePos: [0.02, 13.0, 2.6], target: [0.0, 0.0, -0.1] },
};

function applyCameraPreset(presetId = 'classic') {
  const p = CAMERA_PRESETS[presetId] || CAMERA_PRESETS.classic;
  const isNarrow = window.innerWidth < 768;
  const src = isNarrow ? p.mobilePos : p.pos;
  camera.position.set(src[0], src[1], src[2]);
  controls.target.set(p.target[0], p.target[1], p.target[2]);
  controls.update();
}

function getEffectiveQualityKey() {
  if (state.qualityMode !== 'auto') return state.qualityMode;
  return state.resolvedQuality;
}

function applyQualityNow() {
  const qKey = getEffectiveQualityKey();
  const profile = QUALITY_PROFILES[qKey] || QUALITY_PROFILES.medium;
  const dpr = Math.min(window.devicePixelRatio || 1, profile.dprCap);
  renderer.setPixelRatio(dpr);
  renderer.setSize(window.innerWidth, window.innerHeight, false);
  world.applyQuality(profile);
  renderer.shadowMap.enabled = profile.shadows;
}

function syncControlsLock() {
  const blockedByOverlay = state.paused || state.settingsOpen || Boolean(dragState);
  controls.enabled = !blockedByOverlay;
  // Apenas botão esquerdo orbita quando a ferramenta Câmera está ativa;
  // botão direito/2 dedos continuam livres para ajustar ângulo sem brigar com o rastelo.
  controls.mouseButtons = {
    LEFT: state.tool === 'orbita' ? THREE.MOUSE.ROTATE : null,
    MIDDLE: THREE.MOUSE.DOLLY,
    RIGHT: THREE.MOUSE.ROTATE,
  };
  controls.touches = {
    ONE: state.tool === 'orbita' ? THREE.TOUCH.ROTATE : null,
    TWO: THREE.TOUCH.DOLLY_ROTATE,
  };

  if (mobileCamPad) {
    const showPad = window.innerWidth < 900 || state.tool === 'orbita';
    mobileCamPad.classList.toggle('visible', showPad && !state.contemplative && !state.paused);
  }
}

function showThrottledWarn(msg) {
  const now = performance.now();
  if (now - lastWarnAt < 900) return;
  lastWarnAt = now;
  ui.showFeedback(msg, 'warn');
  audio.playStoneTap(true);
}

function resetGarden(keepUiState = true) {
  // Restaura rochas iniciais
  INITIAL_ROCKS.forEach((init, i) => {
    const rk = world.rocks[i];
    if (!rk) return;
    rk.x = init.x;
    rk.z = init.z;
    rk.rotY = init.rotY;
    world.syncRockTransform(rk);
  });
  state.selectedRockId = null;
  world.setSelectedRock(null, false);

  sand.applyPresetPattern('waves', false);
  sand.clearUndoHistory();
  state.undoDepth = 0;
  state.strokeCount = 0;
  state.blockedHits = 0;
  state.sunAngle = 0.26;
  world.updateSunLighting(state.sunAngle);

  world.rakePose.x = 0.4;
  world.rakePose.z = 1.55;
  world.rakePose.targetX = 0.4;
  world.rakePose.targetZ = 1.55;
  world.rakePose.yaw = 0.15;
  world.rakePose.targetYaw = 0.15;
  world.rakePose.activeDrag = false;

  if (!keepUiState) {
    state.tool = 'rastelo';
    state.rakeWidth = 'medio';
    world.buildRakeHead('medio');
  }
  state.paused = false;
  applyCameraPreset('classic');
  ui.syncAll();
  syncControlsLock();
  ui.showFeedback('Areia nivelada em ondas iniciais', 'info');
}

const ui = createUIController({
  state,
  callbacks: {
    onToolChange(tool) {
      if (tool !== 'pedra') {
        state.selectedRockId = null;
        world.setSelectedRock(null, false);
      }
      syncControlsLock();
    },
    onWidthChange(widthKey) {
      world.buildRakeHead(widthKey);
      syncControlsLock();
      const spec = RAKE_WIDTHS[widthKey] || RAKE_WIDTHS.medio;
      ui.showFeedback(`Rastelo ${spec.label} (${spec.tines} dentes)`, 'info');
    },
    onApplyPattern(patternKey) {
      state.undoDepth = sand.snapshotForUndo();
      sand.applyPresetPattern(patternKey, false);
      state.strokeCount++;
      ui.syncToolbar();
      const label =
        patternKey === 'flat' ? 'Areia nivelada' : patternKey === 'rings' ? 'Anéis Zen aplicados' : 'Ondas Zen aplicadas';
      ui.showFeedback(label, 'info');
    },
    onUndo() {
      if (sand.undo()) {
        state.undoDepth = Math.max(0, state.undoDepth - 1);
        ui.syncToolbar();
        ui.showFeedback('Último traço desfeito', 'info');
      }
    },
    onMenuStateChange() {
      syncControlsLock();
    },
    async onTogglePause(forceVal) {
      const next = typeof forceVal === 'boolean' ? forceVal : !state.paused;
      ui.setPaused(next);
      if (next) audio.suspend();
      else audio.resume();
    },
    onReset() {
      resetGarden(true);
    },
    onExit() {
      if (window.parent && window.parent !== window) {
        window.parent.postMessage({ type: 'sangi:exit' }, '*');
      } else {
        window.history.back();
      }
    },
    onSunChange(val01) {
      world.updateSunLighting(val01);
      // Ajusta suavemente atmosfera de fundo com a elevação solar
      const warm = Math.abs(val01 - 0.5) * 2;
      const r = 0.84 + warm * 0.04;
      const g = 0.86 - warm * 0.03;
      const b = 0.84 - warm * 0.09;
      scene.background.setRGB(r, g, b);
      scene.fog.color.setRGB(r, g, b);
    },
    async onToggleSound(enabledBool) {
      state.soundEnabled = Boolean(enabledBool);
      if (state.soundEnabled) state.muted = false;
      await audio.setEnabled(state.soundEnabled);
      audio.setMuted(state.muted);
    },
    onVolumeChange(val01) {
      audio.setVolume(val01);
    },
    onReducedMotionChange() {},
    onQualityChange() {
      applyQualityNow();
    },
    onCameraPreset(presetId) {
      applyCameraPreset(presetId);
    },
  },
});

// ============================================================================
// RAYCASTING & INTERAÇÃO COM AREIA (T01/T02) E PEDRAS
// ============================================================================
const raycaster = new THREE.Raycaster();
const pointerNDC = new THREE.Vector2();
const dragPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
const planeHit = new THREE.Vector3();

function updatePointerNDC(clientX, clientY) {
  const rect = canvas.getBoundingClientRect();
  pointerNDC.x = ((clientX - rect.left) / Math.max(1, rect.width)) * 2 - 1;
  pointerNDC.y = -((clientY - rect.top) / Math.max(1, rect.height)) * 2 + 1;
}

function raycastSandPoint(clientX, clientY) {
  updatePointerNDC(clientX, clientY);
  raycaster.setFromCamera(pointerNDC, camera);
  const hits = raycaster.intersectObject(sand.mesh, false);
  if (hits.length > 0) return hits[0].point;
  if (raycaster.ray.intersectPlane(dragPlane, planeHit)) {
    return planeHit;
  }
  return null;
}

function canPlaceRockAt(rk, nx, nz) {
  const limitX = BASIN_W * 0.5 - rk.r - 0.22;
  const limitZ = BASIN_D * 0.5 - rk.r - 0.22;
  if (Math.abs(nx) > limitX || Math.abs(nz) > limitZ) {
    return { ok: false, reason: 'wall' };
  }
  for (let i = 0; i < world.rocks.length; i++) {
    const other = world.rocks[i];
    if (other.id === rk.id) continue;
    const minDist = rk.r + other.r + 0.14;
    if (Math.hypot(nx - other.x, nz - other.z) < minDist) {
      return { ok: false, reason: 'rock' };
    }
  }
  return { ok: true, reason: null };
}

canvas.addEventListener('pointerdown', (e) => {
  if (disposed || state.paused || state.settingsOpen) return;
  if (e.pointerType === 'mouse' && e.button !== 0) return;

  ui.closePopovers();
  if (state.soundEnabled && !state.muted) audio.resume();

  if (state.tool === 'orbita') return;

  if (state.tool === 'rastelo') {
    const pt = raycastSandPoint(e.clientX, e.clientY);
    if (!pt) return;

    const spec = RAKE_WIDTHS[state.rakeWidth] || RAKE_WIDTHS.medio;
    const col = sand.testRakeCollision(pt.x, pt.z, spec.headWidth * 0.5);
    const clamped = sand.clampRakePosition(pt.x, pt.z, spec.headWidth);

    state.undoDepth = sand.snapshotForUndo();
    world.rakePose.targetX = clamped.x;
    world.rakePose.targetZ = clamped.z;
    world.rakePose.activeDrag = true;

    dragState = {
      mode: 'rake',
      pointerId: e.pointerId,
      lastX: clamped.x,
      lastZ: clamped.z,
      lastTime: performance.now(),
      moved: false,
    };

    try { canvas.setPointerCapture(e.pointerId); } catch (_) {}
    syncControlsLock();
    ui.syncToolbar();

    if (col.blocked && col.reason === 'rock') {
      state.blockedHits++;
      showThrottledWarn('Pedra bloqueia o rastelo — contorne a rocha');
    }
    return;
  }

  if (state.tool === 'pedra') {
    updatePointerNDC(e.clientX, e.clientY);
    raycaster.setFromCamera(pointerNDC, camera);
    const rockHits = raycaster.intersectObjects(world.rockPickables, false);
    if (rockHits.length > 0) {
      const rockId = rockHits[0].object.userData.rockId;
      const rk = world.rocks[rockId];
      if (!rk) return;
      state.selectedRockId = rockId;
      world.setSelectedRock(rockId, true);
      audio.playStoneTap(false);

      dragState = {
        mode: 'rock',
        pointerId: e.pointerId,
        rockId,
      };
      try { canvas.setPointerCapture(e.pointerId); } catch (_) {}
      syncControlsLock();
    } else {
      state.selectedRockId = null;
      world.setSelectedRock(null, false);
    }
  }
});

canvas.addEventListener('pointermove', (e) => {
  if (!dragState || dragState.pointerId !== e.pointerId || state.paused) return;

  if (dragState.mode === 'rake') {
    const pt = raycastSandPoint(e.clientX, e.clientY);
    if (!pt) return;

    const spec = RAKE_WIDTHS[state.rakeWidth] || RAKE_WIDTHS.medio;
    const clamped = sand.clampRakePosition(pt.x, pt.z, spec.headWidth);
    const dx = clamped.x - dragState.lastX;
    const dz = clamped.z - dragState.lastZ;
    const dist = Math.hypot(dx, dz);

    world.rakePose.targetX = clamped.x;
    world.rakePose.targetZ = clamped.z;

    if (dist > 0.025) {
      world.rakePose.targetYaw = Math.atan2(dx, dz);
      const res = sand.carveStrokeSegment(
        dragState.lastX,
        dragState.lastZ,
        clamped.x,
        clamped.z,
        state.rakeWidth
      );
      const now = performance.now();
      const dtMs = Math.max(8, now - dragState.lastTime);
      const vel = dist / (dtMs / 1000);
      state.rakeVelocity = vel;

      if (!state.reducedMotion && res.carved) {
        world.emitSandGrains(clamped.x, clamped.z, vel);
      }
      if (clamped.hitRock || res.hitRock) {
        state.blockedHits++;
        showThrottledWarn('Pedra no caminho — rastelo desviado pela borda');
      }

      dragState.lastX = clamped.x;
      dragState.lastZ = clamped.z;
      dragState.lastTime = now;
      dragState.moved = true;
    }
    return;
  }

  if (dragState.mode === 'rock') {
    const pt = raycastSandPoint(e.clientX, e.clientY);
    if (!pt) return;
    const rk = world.rocks[dragState.rockId];
    if (!rk) return;

    const check = canPlaceRockAt(rk, pt.x, pt.z);
    if (check.ok) {
      rk.x = pt.x;
      rk.z = pt.z;
      world.syncRockTransform(rk);
      world.setSelectedRock(rk.id, true);
      sand.stampRockCollar(rk);
    } else {
      showThrottledWarn(
        check.reason === 'rock' ? 'As pedras não podem se sobrepor' : 'Limite da moldura de cedro'
      );
    }
  }
});

function endDrag(e) {
  if (!dragState || dragState.pointerId !== e.pointerId) return;

  if (dragState.mode === 'rake') {
    if (!dragState.moved) {
      // Pequeno assentamento direcional mesmo em toque curto
      const fx = Math.sin(world.rakePose.yaw) * 0.06;
      const fz = Math.cos(world.rakePose.yaw) * 0.06;
      sand.carveStrokeSegment(
        dragState.lastX - fx,
        dragState.lastZ - fz,
        dragState.lastX + fx,
        dragState.lastZ + fz,
        state.rakeWidth
      );
    }
    state.strokeCount++;
    world.rakePose.activeDrag = false;
    state.rakeVelocity = 0;
    ui.syncToolbar();
  } else if (dragState.mode === 'rock') {
    const rk = world.rocks[dragState.rockId];
    if (rk) sand.stampRockCollar(rk);
    audio.playStoneTap(false);
  }

  try { canvas.releasePointerCapture(e.pointerId); } catch (_) {}
  dragState = null;
  syncControlsLock();
}

canvas.addEventListener('pointerup', endDrag);
canvas.addEventListener('pointercancel', endDrag);

canvas.addEventListener(
  'wheel',
  (e) => {
    if (state.tool === 'pedra' && state.selectedRockId !== null && !state.paused) {
      e.preventDefault();
      e.stopPropagation();
      const rk = world.rocks[state.selectedRockId];
      if (rk) {
        rk.rotY += e.deltaY * 0.0024;
        world.syncRockTransform(rk);
      }
    }
  },
  { passive: false }
);

// Pad de câmera mobile
if (mobileCamPad) {
  mobileCamPad.querySelectorAll('[data-cam-nudge]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const dir = btn.dataset.camNudge;
      const offset = camera.position.clone().sub(controls.target);
      const spherical = new THREE.Spherical().setFromVector3(offset);
      if (dir === 'left') spherical.theta -= 0.22;
      if (dir === 'right') spherical.theta += 0.22;
      if (dir === 'up') spherical.phi = Math.max(0.24, spherical.phi - 0.14);
      if (dir === 'down') spherical.phi = Math.min(Math.PI * 0.42, spherical.phi + 0.14);
      offset.setFromSpherical(spherical);
      camera.position.copy(controls.target).add(offset);
      controls.update();
    });
  });
}

// ============================================================================
// TECLADO & CONTEXTO WEBGL
// ============================================================================
window.addEventListener('keydown', (e) => {
  keysHeld.add(e.code);
  if (e.target && ['INPUT', 'SELECT', 'TEXTAREA'].includes(e.target.tagName)) return;

  if ((e.ctrlKey || e.metaKey) && e.code === 'KeyZ') {
    e.preventDefault();
    if (sand.undo()) {
      state.undoDepth = Math.max(0, state.undoDepth - 1);
      ui.syncToolbar();
      ui.showFeedback('Último traço desfeito', 'info');
    }
    return;
  }

  if (e.code === 'KeyZ') {
    if (sand.undo()) {
      state.undoDepth = Math.max(0, state.undoDepth - 1);
      ui.syncToolbar();
      ui.showFeedback('Último traço desfeito', 'info');
    }
  } else if (e.code === 'Digit1') {
    state.tool = 'rastelo';
    world.setSelectedRock(null, false);
    ui.syncToolbar();
    syncControlsLock();
  } else if (e.code === 'Digit2') {
    state.tool = 'pedra';
    ui.syncToolbar();
    syncControlsLock();
  } else if (e.code === 'Digit3') {
    state.tool = 'orbita';
    world.setSelectedRock(null, false);
    ui.syncToolbar();
    syncControlsLock();
  } else if (e.code === 'KeyH') {
    ui.setContemplative(!state.contemplative);
  } else if (e.code === 'KeyP' || e.code === 'Escape') {
    if (state.settingsOpen) ui.setDrawerOpen(false);
    else ui.setPaused(!state.paused);
  } else if (e.code === 'KeyR') {
    resetGarden(true);
  } else if (e.code === 'KeyQ' || e.code === 'KeyE') {
    if (state.tool === 'pedra' && state.selectedRockId !== null) {
      const rk = world.rocks[state.selectedRockId];
      if (rk) {
        rk.rotY += e.code === 'KeyQ' ? -0.18 : 0.18;
        world.syncRockTransform(rk);
      }
    }
  }
});

window.addEventListener('keyup', (e) => keysHeld.delete(e.code));

canvas.addEventListener('webglcontextlost', (e) => {
  e.preventDefault();
  if (!disposed && webglStatus) webglStatus.hidden = false;
});
canvas.addEventListener('webglcontextrestored', () => {
  if (webglStatus) webglStatus.hidden = true;
});

function handleResize() {
  if (disposed) return;
  camera.aspect = window.innerWidth / Math.max(1, window.innerHeight);
  camera.updateProjectionMatrix();
  applyQualityNow();
  syncControlsLock();
}
window.addEventListener('resize', handleResize);

// ============================================================================
// CICLO DE VIDA SANGI BRIDGE
// ============================================================================
window.addEventListener('sangi:pause', () => {
  ui.setPaused(true);
  audio.suspend();
});
window.addEventListener('sangi:resume', () => {
  ui.setPaused(false);
  audio.resume();
});
window.addEventListener('sangi:mute', (e) => {
  state.muted = Boolean(e?.detail?.muted);
  audio.setMuted(state.muted);
  ui.syncAll();
});
window.addEventListener('sangi:reset', () => {
  resetGarden(true);
});
window.addEventListener('sangi:quality', (e) => {
  const q = e?.detail?.quality;
  if (q && QUALITY_PROFILES[q]) {
    state.qualityMode = q;
    applyQualityNow();
    ui.syncAll();
  }
});
window.addEventListener('sangi:dispose', () => {
  disposeAll();
});
if (window.SangiBridge && typeof window.SangiBridge.notifyReady === 'function') {
  window.SangiBridge.notifyReady({ title: '# 053 — Jardim de Areia', appId: 'jardim-de-areia' });
}

function disposeAll() {
  if (disposed) return;
  disposed = true;
  renderer.setAnimationLoop(null);
  window.removeEventListener('resize', handleResize);
  controls.dispose();
  sand.dispose();
  world.dispose();
  mats.dispose();
  envRT.dispose();
  audio.dispose();
  renderer.dispose();
}

// ============================================================================
// INICIALIZAÇÃO & LOOP PRINCIPAL COM TIMESTEP FIXO (1/60s)
// ============================================================================
world.buildRakeHead(state.rakeWidth);
world.updateSunLighting(state.sunAngle);
sand.applyPresetPattern('waves', false);
sand.clearUndoHistory();
applyCameraPreset('classic');
applyQualityNow();
syncControlsLock();
ui.syncAll();

const FIXED_DT = 1 / 60;
let accum = 0;
const timer = new THREE.Timer();
timer.connect(document);

function stepKeyboardNudge(dt) {
  if (state.paused || state.settingsOpen) return;
  let mx = 0;
  let mz = 0;
  if (keysHeld.has('KeyA') || keysHeld.has('ArrowLeft')) mx -= 1;
  if (keysHeld.has('KeyD') || keysHeld.has('ArrowRight')) mx += 1;
  if (keysHeld.has('KeyW') || keysHeld.has('ArrowUp')) mz -= 1;
  if (keysHeld.has('KeyS') || keysHeld.has('ArrowDown')) mz += 1;
  if (mx === 0 && mz === 0) return;

  const mag = Math.hypot(mx, mz);
  mx /= mag;
  mz /= mag;
  const speed = 2.6 * dt;

  if (state.tool === 'orbita') {
    const offset = camera.position.clone().sub(controls.target);
    const sph = new THREE.Spherical().setFromVector3(offset);
    sph.theta -= mx * dt * 1.1;
    sph.phi = Math.max(0.22, Math.min(Math.PI * 0.43, sph.phi + mz * dt * 0.8));
    offset.setFromSpherical(sph);
    camera.position.copy(controls.target).add(offset);
    return;
  }

  if (state.tool === 'rastelo') {
    const spec = RAKE_WIDTHS[state.rakeWidth] || RAKE_WIDTHS.medio;
    const prevX = world.rakePose.targetX;
    const prevZ = world.rakePose.targetZ;
    const clamped = sand.clampRakePosition(prevX + mx * speed, prevZ + mz * speed, spec.headWidth);
    world.rakePose.targetX = clamped.x;
    world.rakePose.targetZ = clamped.z;
    world.rakePose.targetYaw = Math.atan2(clamped.x - prevX, clamped.z - prevZ);
    world.rakePose.activeDrag = true;
    sand.carveStrokeSegment(prevX, prevZ, clamped.x, clamped.z, state.rakeWidth);
  }
}

renderer.setAnimationLoop((timestamp) => {
  if (disposed) return;

  timer.update(timestamp);
  const frameDt = Math.min(timer.getDelta(), 0.1);

  if (!state.paused) {
    accum += frameDt;
    let sub = 0;
    while (accum >= FIXED_DT && sub < 4) {
      state.simTime += FIXED_DT;
      stepKeyboardNudge(FIXED_DT);
      world.stepAnimation(FIXED_DT, state);
      accum -= FIXED_DT;
      sub++;
    }
    if (accum > FIXED_DT * 2) accum = 0;
    state.rakeVelocity = Math.max(0, state.rakeVelocity * (1 - Math.min(1, frameDt * 8)));
  }

  audio.updateScrape(state.rakeVelocity, state.paused);
  controls.update();
  renderer.render(scene, camera);

  // Auto-qualidade & telemetria discreta no painel de ajustes
  fpsWindowTime += frameDt;
  fpsWindowFrames++;
  if (fpsWindowTime >= 0.75) {
    currentFps = fpsWindowFrames / fpsWindowTime;
    ui.updateDiagnostics(currentFps, renderer.info.render.calls, renderer.info.render.triangles);

    if (state.qualityMode === 'auto') {
      if (currentFps < 24) {
        lowFpsStreak++;
        if (lowFpsStreak >= 2 && state.resolvedQuality !== 'low') {
          state.resolvedQuality = state.resolvedQuality === 'high' ? 'medium' : 'low';
          applyQualityNow();
          lowFpsStreak = 0;
        }
      } else {
        lowFpsStreak = 0;
      }
    }
    fpsWindowTime = 0;
    fpsWindowFrames = 0;
  }
});

// Expõe handles determinísticos de diagnóstico/QA para leitura controlada
window.__JARDIM__ = {
  renderer,
  scene,
  camera,
  controls,
  state,
  sand,
  world,
  dispose: disposeAll,
};
