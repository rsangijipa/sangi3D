/**
 * main.js
 * Orquestrador principal de # 071 — Estufa dos Sentimentos.
 * Three.js r187 WebGL + THREE.Timer + passo fixo 1/60s + privacidade local + SangiBridge.
 */
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { createStudioEnvironment } from '/Sistema/shared/engine/studio-environment.js';
import {
  CAMERA_MODES,
  PALETTE_SWATCHES,
  QUALITY_PROFILES,
  SEED,
  WEATHER_MODES,
  createDefaultState,
} from './js/state.js';
import { createGreenhouseMaterials } from './js/materials.js';
import { buildGreenhouseWorld } from './js/greenhouse-world.js';
import { createGreenhouseAudioEngine } from './js/audio-engine.js';
import { createUIController } from './js/ui-controller.js';

const STORAGE_KEY = 'sangi_estufa_071_local';
const canvas = document.getElementById('stage-canvas');
const webglStatus = document.getElementById('webgl-status');
const mobileCamPad = document.getElementById('mobile-cam-pad');

let renderer;
try {
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
} catch (err) {
  if (webglStatus) webglStatus.hidden = false;
  throw err;
}

renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xc9d7d4);
scene.fog = new THREE.FogExp2(0xc9d7d4, 0.015);

const envRT = createStudioEnvironment(renderer);
scene.environment = envRT.texture;
scene.environmentIntensity = 0.58;

const camera = new THREE.PerspectiveCamera(44, window.innerWidth / Math.max(1, window.innerHeight), 0.12, 70);
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.dampingFactor = 0.08;
controls.minDistance = 1.4;
controls.maxDistance = 7.8;
controls.minPolarAngle = 0.25;
controls.maxPolarAngle = Math.PI * 0.48;

const state = createDefaultState();
const mats = createGreenhouseMaterials(SEED);
const world = buildGreenhouseWorld(scene, mats, SEED);
const audio = createGreenhouseAudioEngine();

let disposed = false;
let fpsWindowTime = 0;
let fpsWindowFrames = 0;
let lowFpsStreak = 0;
const keysHeld = new Set();

function persistLocalEntriesOnlyIfNonEmpty() {
  // T02: ausência de registro por padrão; remove chave caso vazia
  try {
    if (!state.entries.length) {
      localStorage.removeItem(STORAGE_KEY);
    } else {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.entries));
    }
  } catch (_) {}
}

function applyCameraMode(modeId = 'bench') {
  const m = CAMERA_MODES[modeId] || CAMERA_MODES.bench;
  state.cameraMode = m.id;
  const src = window.innerWidth < 768 ? m.mobilePos : m.pos;
  camera.position.set(src[0], src[1], src[2]);
  controls.target.set(m.target[0], m.target[1], m.target[2]);
  controls.update();
}

function getEffectiveQualityKey() {
  return state.qualityMode !== 'auto' ? state.qualityMode : state.resolvedQuality;
}

function applyQualityNow() {
  const profile = QUALITY_PROFILES[getEffectiveQualityKey()] || QUALITY_PROFILES.medium;
  const dpr = Math.min(window.devicePixelRatio || 1, profile.dprCap);
  renderer.setPixelRatio(dpr);
  renderer.setSize(window.innerWidth, window.innerHeight, false);
  world.applyQuality(profile);
  renderer.shadowMap.enabled = profile.shadows;
}

function syncControlsLock() {
  const blocked = state.paused || state.settingsOpen || state.journalOpen;
  controls.enabled = !blocked;
  if (mobileCamPad) {
    const showPad = window.innerWidth < 900 && !state.contemplative && !blocked;
    mobileCamPad.classList.toggle('visible', showPad);
  }
}

function resetGreenhouse() {
  state.species = 'samambaia';
  state.colorHex = PALETTE_SWATCHES[0];
  state.weather = 'sun';
  state.tagText = '';
  state.moisture = 0.62;
  state.growth = 0.68;
  state.paused = false;
  state.journalOpen = false;
  state.settingsOpen = false;
  world.rebuildPlant(state.species);
  mats.applyColorChoice(state.colorHex, state.moisture);
  mats.updateTagCanvas('');
  world.applyAtmosphere(state);
  applyCameraMode('bench');
  ui.setJournalOpen(false);
  ui.setDrawerOpen(false);
  ui.syncAll();
  syncControlsLock();
  ui.showFeedback('Bancada restaurada ao estado inicial');
}

const ui = createUIController({
  state,
  callbacks: {
    onSpeciesChange(speciesId) {
      world.rebuildPlant(speciesId);
      mats.applyColorChoice(state.colorHex, state.moisture);
      ui.showFeedback('Planta atualizada');
    },
    onColorChange(hex) {
      mats.applyColorChoice(hex, state.moisture);
    },
    onTagChange(txt) {
      mats.updateTagCanvas(txt);
    },
    onWeatherChange(wKey) {
      world.applyAtmosphere(state);
      ui.showFeedback(`Ambiente: ${(WEATHER_MODES[wKey] || WEATHER_MODES.sun).label}`);
    },
    onWaterPlant() {
      state.moisture = Math.min(1, state.moisture + 0.15);
      state.growth = Math.min(1.12, state.growth + 0.08);
      state.waterPulse = 1.0;
      mats.applyColorChoice(state.colorHex, state.moisture);
      audio.playWaterDrop();
      ui.showFeedback('Planta regada com calma');
    },
    onCameraModeChange(modeId) {
      applyCameraMode(modeId);
    },
    onSaveEntry(text) {
      state.entries.push({
        id: Date.now() + Math.floor(Math.random() * 1000),
        species: state.species,
        colorHex: state.colorHex,
        tag: state.tagText.trim(),
        text,
      });
      persistLocalEntriesOnlyIfNonEmpty();
      ui.showFeedback('Reflexão guardada apenas neste navegador');
    },
    onDeleteEntry(id) {
      state.entries = state.entries.filter((e) => e.id !== id);
      persistLocalEntriesOnlyIfNonEmpty();
      ui.renderJournal();
      ui.syncToolbar();
      ui.showFeedback('Registro apagado permanentemente');
    },
    onExportEntries() {
      if (!state.entries.length) {
        ui.showFeedback('Nada registrado para exportar');
        return;
      }
      const payload = JSON.stringify(state.entries, null, 2);
      const blob = new Blob([payload], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'estufa-registros-locais.json';
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      ui.showFeedback('Exportação local concluída');
    },
    onMenuStateChange() { syncControlsLock(); },
    onTogglePause(forceVal) {
      const next = typeof forceVal === 'boolean' ? forceVal : !state.paused;
      ui.setPaused(next);
      if (next) audio.suspend();
      else audio.resume();
    },
    onReset() { resetGreenhouse(); },
    onExit() {
      if (window.parent && window.parent !== window) window.parent.postMessage({ type: 'sangi:exit' }, '*');
      else window.history.back();
    },
    async onToggleSound(en) {
      state.soundEnabled = Boolean(en);
      if (state.soundEnabled) state.muted = false;
      await audio.setEnabled(state.soundEnabled);
      audio.setMuted(state.muted);
    },
    onVolumeChange(v) { audio.setVolume(v); },
    onQualityChange() { applyQualityNow(); },
  },
});

canvas.addEventListener('pointerdown', () => {
  ui.closePopovers();
  if (state.soundEnabled && !state.muted) audio.resume();
});

if (mobileCamPad) {
  mobileCamPad.querySelectorAll('[data-cam-nudge]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const dir = btn.dataset.camNudge;
      if (state.cameraMode === 'walk') {
        const fwd = new THREE.Vector3();
        camera.getWorldDirection(fwd);
        fwd.y = 0; fwd.normalize();
        const right = new THREE.Vector3().crossVectors(fwd, new THREE.Vector3(0, 1, 0));
        const delta = new THREE.Vector3();
        if (dir === 'up') delta.addScaledVector(fwd, 0.45);
        if (dir === 'down') delta.addScaledVector(fwd, -0.45);
        if (dir === 'left') delta.addScaledVector(right, -0.45);
        if (dir === 'right') delta.addScaledVector(right, 0.45);
        camera.position.add(delta);
        controls.target.add(delta);
      } else {
        const off = camera.position.clone().sub(controls.target);
        const sph = new THREE.Spherical().setFromVector3(off);
        if (dir === 'left') sph.theta -= 0.22;
        if (dir === 'right') sph.theta += 0.22;
        if (dir === 'up') sph.phi = Math.max(0.28, sph.phi - 0.14);
        if (dir === 'down') sph.phi = Math.min(Math.PI * 0.47, sph.phi + 0.14);
        off.setFromSpherical(sph);
        camera.position.copy(controls.target).add(off);
      }
      controls.update();
    });
  });
}

window.addEventListener('keydown', (e) => {
  keysHeld.add(e.code);
  if (e.target && ['INPUT', 'SELECT', 'TEXTAREA'].includes(e.target.tagName)) return;
  if (e.code === 'KeyH') ui.setContemplative(!state.contemplative);
  else if (e.code === 'KeyP' || e.code === 'Escape') {
    if (state.journalOpen) ui.setJournalOpen(false);
    else if (state.settingsOpen) ui.setDrawerOpen(false);
    else ui.setPaused(!state.paused);
  } else if (e.code === 'KeyR') resetGreenhouse();
});
window.addEventListener('keyup', (e) => keysHeld.delete(e.code));

document.addEventListener('visibilitychange', () => {
  if (document.hidden) audio.suspend();
  else if (!state.paused && state.soundEnabled && !state.muted) audio.resume();
});
canvas.addEventListener('webglcontextlost', (e) => { e.preventDefault(); if (!disposed && webglStatus) webglStatus.hidden = false; });
canvas.addEventListener('webglcontextrestored', () => { if (webglStatus) webglStatus.hidden = true; });

function handleResize() {
  if (disposed) return;
  camera.aspect = window.innerWidth / Math.max(1, window.innerHeight);
  camera.updateProjectionMatrix();
  applyQualityNow();
  syncControlsLock();
}
window.addEventListener('resize', handleResize);

window.addEventListener('sangi:pause', () => { ui.setPaused(true); audio.suspend(); });
window.addEventListener('sangi:resume', () => { ui.setPaused(false); audio.resume(); });
window.addEventListener('sangi:mute', (e) => { state.muted = Boolean(e?.detail?.muted); audio.setMuted(state.muted); ui.syncAll(); });
window.addEventListener('sangi:reset', () => resetGreenhouse());
window.addEventListener('sangi:quality', (e) => {
  const q = e?.detail?.quality;
  if (q && QUALITY_PROFILES[q]) { state.qualityMode = q; applyQualityNow(); ui.syncAll(); }
});
window.addEventListener('sangi:dispose', () => disposeAll());
if (window.SangiBridge && typeof window.SangiBridge.notifyReady === 'function') {
  window.SangiBridge.notifyReady({ title: '# 071 — Estufa dos Sentimentos', appId: 'estufa-dos-sentimentos' });
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

// Inicialização
world.rebuildPlant(state.species);
mats.applyColorChoice(state.colorHex, state.moisture);
world.applyAtmosphere(state);
applyCameraMode('bench');
applyQualityNow();
syncControlsLock();
ui.syncAll();

const FIXED_DT = 1 / 60;
let accum = 0;
const timer = new THREE.Timer();
timer.connect(document);

function stepKeyboardWalk(dt) {
  if (state.paused || state.settingsOpen || state.journalOpen) return;
  let mx = 0; let mz = 0;
  if (keysHeld.has('KeyA') || keysHeld.has('ArrowLeft')) mx -= 1;
  if (keysHeld.has('KeyD') || keysHeld.has('ArrowRight')) mx += 1;
  if (keysHeld.has('KeyW') || keysHeld.has('ArrowUp')) mz += 1;
  if (keysHeld.has('KeyS') || keysHeld.has('ArrowDown')) mz -= 1;
  if (!mx && !mz) return;

  const fwd = new THREE.Vector3();
  camera.getWorldDirection(fwd); fwd.y = 0; fwd.normalize();
  const right = new THREE.Vector3().crossVectors(fwd, new THREE.Vector3(0, 1, 0));
  const step = 2.4 * dt;
  const move = new THREE.Vector3().addScaledVector(fwd, mz * step).addScaledVector(right, mx * step);
  camera.position.x = THREE.MathUtils.clamp(camera.position.x + move.x, -3.6, 3.6);
  camera.position.z = THREE.MathUtils.clamp(camera.position.z + move.z, -4.4, 5.2);
  controls.target.add(move);
}

renderer.setAnimationLoop((ts) => {
  if (disposed) return;
  timer.update(ts);
  const frameDt = Math.min(timer.getDelta(), 0.1);
  if (!state.paused) {
    accum += frameDt;
    let sub = 0;
    while (accum >= FIXED_DT && sub < 4) {
      world.stepPhysics(FIXED_DT, state);
      stepKeyboardWalk(FIXED_DT);
      accum -= FIXED_DT;
      sub++;
    }
    if (accum > FIXED_DT * 2) accum = 0;
  }
  const wSpec = WEATHER_MODES[state.weather] || WEATHER_MODES.sun;
  audio.updateClimate(wSpec.rainRate, state.paused);
  controls.update();
  renderer.render(scene, camera);

  fpsWindowTime += frameDt;
  fpsWindowFrames++;
  if (fpsWindowTime >= 0.75) {
    const fps = fpsWindowFrames / fpsWindowTime;
    ui.updateDiagnostics(fps, renderer.info.render.calls, renderer.info.render.triangles);
    if (state.qualityMode === 'auto') {
      if (fps < 24) {
        lowFpsStreak++;
        if (lowFpsStreak >= 2 && state.resolvedQuality !== 'low') {
          state.resolvedQuality = state.resolvedQuality === 'high' ? 'medium' : 'low';
          applyQualityNow(); lowFpsStreak = 0;
        }
      } else lowFpsStreak = 0;
    }
    fpsWindowTime = 0; fpsWindowFrames = 0;
  }
});

window.__ESTUFA__ = { renderer, scene, camera, controls, state, world, mats, dispose: disposeAll };
