/**
 * main.js
 * Orquestrador principal de # 073 — Jardim dos Caminhos Possíveis.
 * Three.js r187 WebGL + THREE.Timer + timestep fixo 1/60s + grafo editável + SangiBridge.
 */
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { createStudioEnvironment } from '/Sistema/shared/engine/studio-environment.js';
import {
  CAMERA_MODES,
  QUALITY_PROFILES,
  SEED,
  createDefaultState,
  createInitialNodes,
} from './js/state.js';
import { createPathsGardenMaterials } from './js/materials.js';
import { buildPathsGardenWorld } from './js/garden-world.js';
import { createGardenPathsAudio } from './js/audio-engine.js';
import { createUIController } from './js/ui-controller.js';

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
renderer.toneMappingExposure = 1.04;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xcfdcd6);
scene.fog = new THREE.FogExp2(0xcfdcd6, 0.016);

const envRT = createStudioEnvironment(renderer);
scene.environment = envRT.texture;
scene.environmentIntensity = 0.55;

const camera = new THREE.PerspectiveCamera(46, window.innerWidth / Math.max(1, window.innerHeight), 0.15, 80);
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.dampingFactor = 0.08;
controls.minDistance = 2.6;
controls.maxDistance = 24.0;
controls.minPolarAngle = 0.22;
controls.maxPolarAngle = Math.PI * 0.46;

const state = createDefaultState();
const mats = createPathsGardenMaterials(SEED);
const world = buildPathsGardenWorld(scene, mats, SEED);
const audio = createGardenPathsAudio();

let disposed = false;
let fpsWindowTime = 0;
let fpsWindowFrames = 0;
let lowFpsStreak = 0;
const raycaster = new THREE.Raycaster();
const pointerNDC = new THREE.Vector2();

function getNode(id) {
  return state.nodes.find((n) => n.id === id) || state.nodes[0];
}

function applyCameraToNode(modeId = state.cameraMode) {
  const m = CAMERA_MODES[modeId] || CAMERA_MODES.elevated;
  state.cameraMode = m.id;
  const off = window.innerWidth < 768 ? m.mobileOffset : m.offset;
  const cur = getNode(state.currentNodeId);
  const tx = cur.x;
  const tz = cur.z - (m.id === 'elevated' ? 2.5 : 1.0);
  camera.position.set(tx + off[0], off[1], cur.z + off[2]);
  controls.target.set(tx, m.id === 'elevated' ? 0.2 : 0.7, tz);
  controls.update();
}

function moveToNode(nodeId) {
  const target = state.nodes.find((n) => n.id === nodeId);
  if (!target) return;
  state.currentNodeId = target.id;
  if (!state.visitedIds.includes(target.id)) state.visitedIds.push(target.id);
  state.travelGoal = { x: target.x, z: target.z };

  if (state.reducedMotion) {
    state.travelerPos.x = target.x;
    state.travelerPos.z = target.z;
    state.travelGoal = null;
  }

  const crosses = Math.abs(target.z - 2.6) < 3.0;
  audio.playStep(crosses);
  world.rebuildPathGraph(state.nodes, state.currentNodeId, state.visitedIds);
  if (state.cameraMode === 'walk') applyCameraToNode('walk');
  ui.syncToolbar();
  ui.showFeedback(`Caminho: ${target.title}`);
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
  const blocked = state.paused || state.settingsOpen || state.notesOpen;
  controls.enabled = !blocked;
  if (mobileCamPad) {
    const showPad = window.innerWidth < 900 && !state.contemplative && !blocked;
    mobileCamPad.classList.toggle('visible', showPad);
  }
}

function resetGarden() {
  state.nodes = createInitialNodes();
  state.currentNodeId = 0;
  state.visitedIds = [0];
  state.travelerPos = { x: state.nodes[0].x, z: state.nodes[0].z };
  state.travelGoal = null;
  state.paused = false;
  state.settingsOpen = false;
  state.notesOpen = false;
  world.rebuildPathGraph(state.nodes, state.currentNodeId, state.visitedIds);
  applyCameraToNode('elevated');
  ui.setNotesOpen(false);
  ui.setDrawerOpen(false);
  ui.syncAll();
  syncControlsLock();
  ui.showFeedback('Jardim restaurado ao ponto de entrada');
}

const ui = createUIController({
  state,
  callbacks: {
    onCreateBranch(title) {
      const parent = getNode(state.currentNodeId);
      const siblings = state.nodes.filter((n) => n.parentId === parent.id);
      if (siblings.length >= 4) {
        ui.showFeedback('Esta clareira já possui 4 bifurcações abertas');
        return;
      }
      // Calcula leque espacial natural evitando sobreposição
      const angleOffsets = [-0.62, 0.62, -1.12, 1.12];
      const ang = angleOffsets[siblings.length % angleOffsets.length];
      const stepDist = 4.3;
      const nx = Number((parent.x + Math.sin(ang) * stepDist).toFixed(2));
      const nz = Number((parent.z - Math.cos(ang) * stepDist).toFixed(2));
      const nextId = state.nodes.reduce((m, n) => Math.max(m, n.id), 0) + 1;
      state.nodes.push({ id: nextId, parentId: parent.id, x: nx, z: nz, title, note: '' });

      world.rebuildPathGraph(state.nodes, state.currentNodeId, state.visitedIds);
      audio.playStep(false);
      ui.syncToolbar();
      ui.showFeedback(`Novo caminho "${title}" aberto adiante`);
    },
    onChooseNode(targetId) {
      moveToNode(targetId);
    },
    onGoBack() {
      const cur = getNode(state.currentNodeId);
      if (cur.parentId === null) return;
      // T01: Voltar retorna à bifurcação anterior mantendo alternativas exploráveis
      moveToNode(cur.parentId);
    },
    onUpdateCurrentNodeInfo(newTitle, newNote) {
      const cur = getNode(state.currentNodeId);
      if (newTitle) cur.title = newTitle;
      cur.note = newNote;
      world.rebuildPathGraph(state.nodes, state.currentNodeId, state.visitedIds);
      ui.syncToolbar();
      ui.showFeedback('Placa e anotação atualizadas');
    },
    onDeleteNodeNote(nodeId) {
      const n = state.nodes.find((item) => item.id === nodeId);
      if (!n) return;
      // T03: notas são apagáveis sem avaliação automática
      n.note = '';
      ui.renderNotesModal();
      ui.syncToolbar();
      ui.showFeedback('Anotação removida');
    },
    onCameraModeChange(modeId) {
      applyCameraToNode(modeId);
      ui.syncToolbar();
    },
    onMenuStateChange() { syncControlsLock(); },
    onTogglePause(forceVal) {
      const next = typeof forceVal === 'boolean' ? forceVal : !state.paused;
      ui.setPaused(next);
      if (next) audio.suspend();
      else audio.resume();
    },
    onReset() { resetGarden(); },
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

let downX = 0;
let downY = 0;
canvas.addEventListener('pointerdown', (e) => {
  ui.closePopovers();
  downX = e.clientX;
  downY = e.clientY;
  if (state.soundEnabled && !state.muted) audio.resume();
});

canvas.addEventListener('pointerup', (e) => {
  if (state.paused || state.settingsOpen || state.notesOpen) return;
  if (Math.hypot(e.clientX - downX, e.clientY - downY) > 6) return;
  const rect = canvas.getBoundingClientRect();
  pointerNDC.x = ((e.clientX - rect.left) / Math.max(1, rect.width)) * 2 - 1;
  pointerNDC.y = -((e.clientY - rect.top) / Math.max(1, rect.height)) * 2 + 1;
  raycaster.setFromCamera(pointerNDC, camera);
  const hits = raycaster.intersectObjects(world.pickables, false);
  if (hits.length > 0) {
    const nodeId = hits[0].object.userData.nodeId;
    if (nodeId !== undefined) moveToNode(nodeId);
  }
});

if (mobileCamPad) {
  mobileCamPad.querySelectorAll('[data-cam-nudge]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const dir = btn.dataset.camNudge;
      const off = camera.position.clone().sub(controls.target);
      const sph = new THREE.Spherical().setFromVector3(off);
      if (dir === 'left') sph.theta -= 0.22;
      if (dir === 'right') sph.theta += 0.22;
      if (dir === 'up') sph.phi = Math.max(0.24, sph.phi - 0.14);
      if (dir === 'down') sph.phi = Math.min(Math.PI * 0.45, sph.phi + 0.14);
      off.setFromSpherical(sph);
      camera.position.copy(controls.target).add(off);
      controls.update();
    });
  });
}

window.addEventListener('keydown', (e) => {
  if (e.target && ['INPUT', 'SELECT', 'TEXTAREA'].includes(e.target.tagName)) return;
  if (e.code === 'KeyB' || e.code === 'Backspace') {
    const cur = getNode(state.currentNodeId);
    if (cur.parentId !== null) moveToNode(cur.parentId);
  } else if (e.code === 'KeyH') ui.setContemplative(!state.contemplative);
  else if (e.code === 'KeyP' || e.code === 'Escape') {
    if (state.notesOpen) ui.setNotesOpen(false);
    else if (state.settingsOpen) ui.setDrawerOpen(false);
    else ui.setPaused(!state.paused);
  } else if (e.code === 'KeyR') resetGarden();
});

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
window.addEventListener('sangi:reset', () => resetGarden());
window.addEventListener('sangi:quality', (e) => {
  const q = e?.detail?.quality;
  if (q && QUALITY_PROFILES[q]) { state.qualityMode = q; applyQualityNow(); ui.syncAll(); }
});
window.addEventListener('sangi:dispose', () => disposeAll());
if (window.SangiBridge && typeof window.SangiBridge.notifyReady === 'function') {
  window.SangiBridge.notifyReady({ title: '# 073 — Jardim dos Caminhos Possíveis', appId: 'jardim-dos-caminhos-possiveis' });
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
world.rebuildPathGraph(state.nodes, state.currentNodeId, state.visitedIds);
world.syncTraveler(state.travelerPos.x, state.travelerPos.z, 0, state.reducedMotion);
applyCameraToNode('elevated');
applyQualityNow();
syncControlsLock();
ui.syncAll();

const FIXED_DT = 1 / 60;
let accum = 0;
const timer = new THREE.Timer();
timer.connect(document);

function stepTravelerPhysics(fixedDt) {
  state.simTime += fixedDt;
  if (state.travelGoal) {
    const dx = state.travelGoal.x - state.travelerPos.x;
    const dz = state.travelGoal.z - state.travelerPos.z;
    const dist = Math.hypot(dx, dz);
    const speed = 4.6 * fixedDt;
    if (dist <= speed) {
      state.travelerPos.x = state.travelGoal.x;
      state.travelerPos.z = state.travelGoal.z;
      state.travelGoal = null;
    } else {
      state.travelerPos.x += (dx / dist) * speed;
      state.travelerPos.z += (dz / dist) * speed;
    }
  }
  world.syncTraveler(state.travelerPos.x, state.travelerPos.z, state.simTime, state.reducedMotion);
}

renderer.setAnimationLoop((ts) => {
  if (disposed) return;
  timer.update(ts);
  const frameDt = Math.min(timer.getDelta(), 0.1);
  if (!state.paused) {
    accum += frameDt;
    let sub = 0;
    while (accum >= FIXED_DT && sub < 4) {
      stepTravelerPhysics(FIXED_DT);
      accum -= FIXED_DT;
      sub++;
    }
    if (accum > FIXED_DT * 2) accum = 0;
  }
  audio.tickBirds(state.paused, state.reducedMotion);
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

window.__CAMINHOS__ = {
  renderer, scene, camera, controls, state, world, moveToNode, dispose: disposeAll,
};
