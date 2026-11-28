/**
 * main.js
 * Orquestrador principal de # 054 — Observatório das Auroras.
 * Three.js r187 WebGL + THREE.Timer + timestep fixo (1/60s) + shaders GLSL + SangiBridge.
 */
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { createStudioEnvironment } from '/Sistema/shared/engine/studio-environment.js';
import {
  AURORA_PATTERNS,
  QUALITY_PROFILES,
  SEED,
  VIEW_MODES,
  createDefaultState,
} from './js/state.js';
import { createObservatoryMaterials } from './js/materials.js';
import { buildObservatoryWorld } from './js/observatory-world.js';
import { createObservatoryAudioEngine } from './js/audio-engine.js';
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
renderer.toneMappingExposure = 1.08;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x09111f);
scene.fog = new THREE.FogExp2(0x0b1526, 0.0095);

const envRT = createStudioEnvironment(renderer);
scene.environment = envRT.texture;
scene.environmentIntensity = 0.28;

const camera = new THREE.PerspectiveCamera(
  50,
  window.innerWidth / Math.max(1, window.innerHeight),
  0.15,
  240
);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.dampingFactor = 0.08;
controls.enablePan = false;
controls.minDistance = 2.0;
controls.maxDistance = 38.0;
controls.minPolarAngle = 0.16;
controls.maxPolarAngle = Math.PI * 0.62;

const state = createDefaultState();
const mats = createObservatoryMaterials(SEED);
const world = buildObservatoryWorld(scene, mats, SEED);
const audio = createObservatoryAudioEngine();

let disposed = false;
let fpsWindowTime = 0;
let fpsWindowFrames = 0;
let lowFpsStreak = 0;
let currentFps = 60;
const keysHeld = new Set();

// Interpolação suave da transição entre Varanda, Interior e Celeste
const camGoalPos = new THREE.Vector3();
const camGoalTarget = new THREE.Vector3();
let camTransitioning = false;

function applyViewMode(modeId, instant = false) {
  const vm = VIEW_MODES[modeId] || VIEW_MODES.veranda;
  state.viewMode = vm.id;
  const isNarrow = window.innerWidth < 768;
  const src = isNarrow ? vm.mobilePos : vm.pos;

  camGoalPos.set(src[0], src[1], src[2]);
  camGoalTarget.set(vm.target[0], vm.target[1], vm.target[2]);

  if (instant || state.reducedMotion) {
    camera.position.copy(camGoalPos);
    controls.target.copy(camGoalTarget);
    controls.update();
    camTransitioning = false;
  } else {
    camTransitioning = true;
  }

  // Ajusta distância mínima para não sair pela parede na vista Interior
  controls.maxDistance = vm.id === 'interior' ? 18 : 38;
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
  const blocked = state.paused || state.settingsOpen || state.albumOpen;
  controls.enabled = !blocked;
  if (mobileCamPad) {
    const showPad = window.innerWidth < 900 && !state.contemplative && !blocked;
    mobileCamPad.classList.toggle('visible', showPad);
  }
}

function takePhoto() {
  if (disposed) return null;
  world.updateAtmosphereUniforms(state);
  world.syncSkyToCamera(camera);
  renderer.render(scene, camera);

  const url = canvas.toDataURL('image/jpeg', 0.88);
  const pat = (AURORA_PATTERNS[state.auroraPattern] || AURORA_PATTERNS.crown).short;
  const view = (VIEW_MODES[state.viewMode] || VIEW_MODES.veranda).label;
  const pct = Math.round(state.intensity * 100);
  const photo = {
    id: state.photos.length + 1,
    url,
    label: `#${state.photos.length + 1} · ${view} · ${pat} (${pct}%)`,
  };
  state.photos.push(photo);
  if (state.photos.length > 18) state.photos.shift();

  audio.playShutter();
  ui.triggerShutterFlash();
  ui.syncToolbar();
  if (state.albumOpen) ui.renderAlbum();
  ui.showFeedback(`Fotografia #${photo.id} salva no Álbum de Céus`, 'info');
  return photo;
}

function resetObservatory() {
  state.auroraPattern = 'crown';
  state.hourNorm = 0.52;
  state.intensity = 0.82;
  state.curtainPhase = 0;
  state.simTime = 0;
  state.paused = false;
  state.albumOpen = false;
  state.settingsOpen = false;
  applyViewMode('veranda', true);
  world.updateAtmosphereUniforms(state);
  ui.setAlbumOpen(false);
  ui.setDrawerOpen(false);
  ui.syncAll();
  syncControlsLock();
  ui.showFeedback('Condições atmosféricas restauradas', 'info');
}

const ui = createUIController({
  state,
  callbacks: {
    onAtmosphereChange() {
      world.updateAtmosphereUniforms(state);
    },
    onTakePhoto() {
      takePhoto();
    },
    onViewModeChange(modeId) {
      applyViewMode(modeId, false);
      const label = (VIEW_MODES[modeId] || VIEW_MODES.veranda).label;
      ui.showFeedback(`Observação: ${label}`, 'info');
    },
    onMenuStateChange() {
      syncControlsLock();
    },
    onTogglePause(forceVal) {
      const next = typeof forceVal === 'boolean' ? forceVal : !state.paused;
      ui.setPaused(next);
      if (next) audio.suspend();
      else audio.resume();
    },
    onReset() {
      resetObservatory();
    },
    onExit() {
      if (window.parent && window.parent !== window) {
        window.parent.postMessage({ type: 'sangi:exit' }, '*');
      } else {
        window.history.back();
      }
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
    onReducedMotionChange() {
      if (state.reducedMotion) camTransitioning = false;
      world.updateAtmosphereUniforms(state);
    },
    onQualityChange() {
      applyQualityNow();
    },
  },
});

// Cancela transição automática caso o usuário pegue a câmera manualmente
canvas.addEventListener('pointerdown', () => {
  ui.closePopovers();
  camTransitioning = false;
  if (state.soundEnabled && !state.muted) audio.resume();
});

// Pad mobile direcional de câmera
if (mobileCamPad) {
  mobileCamPad.querySelectorAll('[data-cam-nudge]').forEach((btn) => {
    btn.addEventListener('click', () => {
      camTransitioning = false;
      const dir = btn.dataset.camNudge;
      const offset = camera.position.clone().sub(controls.target);
      const sph = new THREE.Spherical().setFromVector3(offset);
      if (dir === 'left') sph.theta -= 0.18;
      if (dir === 'right') sph.theta += 0.18;
      if (dir === 'up') sph.phi = Math.max(0.18, sph.phi - 0.12);
      if (dir === 'down') sph.phi = Math.min(Math.PI * 0.60, sph.phi + 0.12);
      offset.setFromSpherical(sph);
      camera.position.copy(controls.target).add(offset);
      controls.update();
    });
  });
}

// ============================================================================
// TECLADO, VISIBILIDADE E CONTEXTO WEBGL
// ============================================================================
window.addEventListener('keydown', (e) => {
  keysHeld.add(e.code);
  if (e.target && ['INPUT', 'SELECT', 'TEXTAREA'].includes(e.target.tagName)) return;

  if (e.code === 'Digit1') {
    applyViewMode('veranda', false);
    ui.syncToolbar();
  } else if (e.code === 'Digit2') {
    applyViewMode('interior', false);
    ui.syncToolbar();
  } else if (e.code === 'Digit3') {
    applyViewMode('sky', false);
    ui.syncToolbar();
  } else if (e.code === 'KeyF' || e.code === 'Space') {
    e.preventDefault();
    takePhoto();
  } else if (e.code === 'KeyA') {
    ui.setAlbumOpen(!state.albumOpen);
  } else if (e.code === 'KeyH') {
    ui.setContemplative(!state.contemplative);
  } else if (e.code === 'KeyP' || e.code === 'Escape') {
    if (state.albumOpen) ui.setAlbumOpen(false);
    else if (state.settingsOpen) ui.setDrawerOpen(false);
    else ui.setPaused(!state.paused);
  } else if (e.code === 'KeyR') {
    resetObservatory();
  }
});
window.addEventListener('keyup', (e) => keysHeld.delete(e.code));

document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    audio.suspend();
  } else if (!state.paused && state.soundEnabled && !state.muted) {
    audio.resume();
  }
});

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
  resetObservatory();
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
  window.SangiBridge.notifyReady({ title: '# 054 — Observatório das Auroras', appId: 'observatorio-das-auroras' });
}

function disposeAll() {
  if (disposed) return;
  disposed = true;
  renderer.setAnimationLoop(null);
  window.removeEventListener('resize', handleResize);
  controls.dispose();
  world.dispose();
  mats.dispose();
  envRT.dispose();
  audio.dispose();
  renderer.dispose();
}

// ============================================================================
// INICIALIZAÇÃO & LOOP DE TIMESTEP FIXO (1/60s)
// ============================================================================
applyViewMode('veranda', true);
applyQualityNow();
world.updateAtmosphereUniforms(state);
syncControlsLock();
ui.syncAll();

const FIXED_DT = 1 / 60;
let accum = 0;
const timer = new THREE.Timer();
timer.connect(document);

function stepKeyboardOrbit(dt) {
  if (state.paused || state.settingsOpen || state.albumOpen) return;
  let dx = 0;
  let dy = 0;
  if (keysHeld.has('ArrowLeft')) dx -= 1;
  if (keysHeld.has('ArrowRight')) dx += 1;
  if (keysHeld.has('ArrowUp')) dy -= 1;
  if (keysHeld.has('ArrowDown')) dy += 1;
  if (dx === 0 && dy === 0) return;

  camTransitioning = false;
  const offset = camera.position.clone().sub(controls.target);
  const sph = new THREE.Spherical().setFromVector3(offset);
  sph.theta += dx * dt * 0.95;
  sph.phi = Math.max(0.18, Math.min(Math.PI * 0.60, sph.phi + dy * dt * 0.72));
  offset.setFromSpherical(sph);
  camera.position.copy(controls.target).add(offset);
}

renderer.setAnimationLoop((timestamp) => {
  if (disposed) return;

  timer.update(timestamp);
  const frameDt = Math.min(timer.getDelta(), 0.1);

  if (!state.paused) {
    accum += frameDt;
    let sub = 0;
    while (accum >= FIXED_DT && sub < 4) {
      world.stepPhysics(FIXED_DT, state);
      stepKeyboardOrbit(FIXED_DT);
      accum -= FIXED_DT;
      sub++;
    }
    if (accum > FIXED_DT * 2) accum = 0;
  }

  if (camTransitioning) {
    const lerpT = Math.min(1, frameDt * 5.2);
    camera.position.lerp(camGoalPos, lerpT);
    controls.target.lerp(camGoalTarget, lerpT);
    if (camera.position.distanceTo(camGoalPos) < 0.04) {
      camTransitioning = false;
    }
  }

  world.updateAtmosphereUniforms(state);
  controls.update();
  world.syncSkyToCamera(camera);

  audio.updateAtmosphere(state.gustSpeed, state.viewMode === 'interior', state.paused);
  renderer.render(scene, camera);

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

window.__OBSERVATORIO__ = {
  renderer,
  scene,
  camera,
  controls,
  state,
  world,
  takePhoto,
  applyViewMode,
  dispose: disposeAll,
};
