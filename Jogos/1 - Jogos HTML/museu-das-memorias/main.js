/**
 * main.js
 * Orquestrador principal de # 072 — Museu das Memórias.
 * Three.js r187 WebGL + THREE.Timer + timestep fixo 1/60s + privacidade estritamente local + SangiBridge.
 */
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { createStudioEnvironment } from '/Sistema/shared/engine/studio-environment.js';
import {
  CAMERA_MODES,
  FICTIONAL_DEMO_ITEMS,
  GALLERY_SLOTS,
  QUALITY_PROFILES,
  SEED,
  createDefaultState,
} from './js/state.js';
import { createMemoryMuseumMaterials } from './js/materials.js';
import { buildMemoryMuseumWorld } from './js/museum-world.js';
import { createGalleryAudioEngine } from './js/audio-engine.js';
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
scene.background = new THREE.Color(0x1b1714);
scene.fog = new THREE.FogExp2(0x1b1714, 0.025);

const envRT = createStudioEnvironment(renderer);
scene.environment = envRT.texture;
scene.environmentIntensity = 0.45;

const camera = new THREE.PerspectiveCamera(48, window.innerWidth / Math.max(1, window.innerHeight), 0.12, 50);
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.dampingFactor = 0.08;
controls.minDistance = 1.6;
controls.maxDistance = 9.5;
controls.minPolarAngle = 0.28;
controls.maxPolarAngle = Math.PI * 0.49;

const state = createDefaultState();
const mats = createMemoryMuseumMaterials(SEED);
const world = buildMemoryMuseumWorld(scene, mats, SEED);
const audio = createGalleryAudioEngine();

let disposed = false;
let fpsWindowTime = 0;
let fpsWindowFrames = 0;
let lowFpsStreak = 0;
const keysHeld = new Set();
const raycaster = new THREE.Raycaster();
const pointerNDC = new THREE.Vector2();

function revokeItemUrl(item) {
  if (item && item.localImageUrl && item.localImageUrl.startsWith('blob:')) {
    try { URL.revokeObjectURL(item.localImageUrl); } catch (_) {}
    item.localImageUrl = null;
  }
}

function clearAllItems() {
  Object.values(state.items).forEach(revokeItemUrl);
  state.items = {};
}

function applyCameraMode(modeId = 'walk') {
  const m = CAMERA_MODES[modeId] || CAMERA_MODES.walk;
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
  const blocked = state.paused || state.settingsOpen || state.privacyOpen;
  controls.enabled = !blocked;
  if (mobileCamPad) {
    const showPad = window.innerWidth < 900 && !state.contemplative && !blocked;
    mobileCamPad.classList.toggle('visible', showPad);
  }
}

function selectOrCompleteMove(slotId) {
  const targetSlot = GALLERY_SLOTS[slotId];
  if (!targetSlot) return;

  if (state.moveSourceSlotId !== null) {
    const srcId = state.moveSourceSlotId;
    const srcSlot = GALLERY_SLOTS[srcId];
    if (srcId === slotId) {
      state.moveSourceSlotId = null;
      ui.syncToolbar();
      return;
    }
    if (!srcSlot || srcSlot.kind !== targetSlot.kind) {
      ui.showFeedback(`Escolha outro ${srcSlot?.kind === 'pedestal' ? 'pedestal' : 'moldura'} compatível`);
      return;
    }
    // T01: Mover item preserva legenda e referência exatamente como está
    const moving = state.items[srcId];
    const swapped = state.items[slotId];
    if (swapped) state.items[srcId] = swapped;
    else delete state.items[srcId];
    state.items[slotId] = moving;
    state.selectedSlotId = slotId;
    state.moveSourceSlotId = null;
    world.syncAllSlots(state.items, state.selectedSlotId);
    ui.syncToolbar();
    audio.playPlaceTone(290);
    ui.showFeedback(`Item movido para ${targetSlot.label} mantendo a legenda`);
    return;
  }

  state.selectedSlotId = slotId;
  world.syncAllSlots(state.items, state.selectedSlotId);
  ui.syncToolbar();
}

function resetGallery() {
  clearAllItems();
  state.roomMode = 'personal';
  state.selectedSlotId = 0;
  state.moveSourceSlotId = null;
  state.paused = false;
  state.settingsOpen = false;
  state.privacyOpen = false;
  world.syncAllSlots(state.items, state.selectedSlotId);
  applyCameraMode('walk');
  ui.setPrivacyOpen(false);
  ui.setDrawerOpen(false);
  ui.syncAll();
  syncControlsLock();
  ui.showFeedback('Exposição pessoal esvaziada com segurança');
}

const ui = createUIController({
  state,
  callbacks: {
    onSelectSlot(slotId) {
      selectOrCompleteMove(slotId);
    },
    onPlaceObject(objectType) {
      let slot = GALLERY_SLOTS[state.selectedSlotId] || GALLERY_SLOTS[0];
      // Se uma moldura estiver selecionada, redireciona para o primeiro pedestal livre ou pedestal 0
      if (slot.kind !== 'pedestal') {
        slot = GALLERY_SLOTS.find((s) => s.kind === 'pedestal' && !state.items[s.id]) || GALLERY_SLOTS[0];
        state.selectedSlotId = slot.id;
      }
      const prevCaption = state.items[slot.id]?.caption || '';
      state.items[slot.id] = { type: objectType, caption: prevCaption, localImageUrl: null };
      world.syncAllSlots(state.items, state.selectedSlotId);
      ui.syncToolbar();
      audio.playPlaceTone(260);
      ui.showFeedback(`Objeto colocado em ${slot.label}`);
    },
    onImportLocalPhoto(file) {
      let slot = GALLERY_SLOTS[state.selectedSlotId];
      if (!slot || slot.kind !== 'frame') {
        slot = GALLERY_SLOTS.find((s) => s.kind === 'frame');
        state.selectedSlotId = slot.id;
      }
      const prev = state.items[slot.id];
      if (prev) revokeItemUrl(prev);
      // T03: Leitura local via ObjectURL sem nenhum upload externo
      const localUrl = URL.createObjectURL(file);
      state.items[slot.id] = {
        type: 'foto',
        caption: prev?.caption || '',
        localImageUrl: localUrl,
      };
      world.syncAllSlots(state.items, state.selectedSlotId);
      ui.syncToolbar();
      audio.playPlaceTone(320);
      ui.showFeedback('Imagem carregada apenas localmente');
    },
    onUpdateCaption(caption) {
      const slot = GALLERY_SLOTS[state.selectedSlotId];
      if (!slot) return;
      if (!state.items[slot.id]) {
        state.items[slot.id] = { type: slot.kind === 'pedestal' ? 'livreto' : 'foto', caption, localImageUrl: null };
      } else {
        state.items[slot.id].caption = caption;
      }
      world.syncAllSlots(state.items, state.selectedSlotId);
      ui.syncToolbar();
      ui.showFeedback('Legenda atualizada');
    },
    onStartMove() {
      const item = state.items[state.selectedSlotId];
      if (!item) return;
      state.moveSourceSlotId = state.selectedSlotId;
      ui.syncToolbar();
    },
    onDeleteSelectedItem() {
      const slotId = state.selectedSlotId;
      const item = state.items[slotId];
      if (!item) return;
      // T02: Apagar remove referência, legenda e blob local associado
      revokeItemUrl(item);
      delete state.items[slotId];
      state.moveSourceSlotId = null;
      world.syncAllSlots(state.items, state.selectedSlotId);
      ui.syncToolbar();
      audio.playPlaceTone(180);
      ui.showFeedback('Item e referência local removidos');
    },
    onRoomModeChange(mode) {
      clearAllItems();
      state.roomMode = mode;
      state.moveSourceSlotId = null;
      if (mode === 'fictional') {
        Object.entries(FICTIONAL_DEMO_ITEMS).forEach(([k, v]) => {
          state.items[Number(k)] = { ...v };
        });
      }
      world.syncAllSlots(state.items, state.selectedSlotId);
      ui.syncToolbar();
      ui.showFeedback(mode === 'fictional' ? 'Acervo fictício carregado' : 'Exposição pessoal aberta (vazia)');
    },
    onCameraModeChange(camMode) {
      applyCameraMode(camMode);
      ui.syncToolbar();
    },
    onWipeAll() {
      resetGallery();
    },
    onMenuStateChange() { syncControlsLock(); },
    onTogglePause(forceVal) {
      const next = typeof forceVal === 'boolean' ? forceVal : !state.paused;
      ui.setPaused(next);
      if (next) audio.suspend();
      else audio.resume();
    },
    onReset() { resetGallery(); },
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
  if (state.paused || state.settingsOpen || state.privacyOpen) return;
  if (Math.hypot(e.clientX - downX, e.clientY - downY) > 6) return;
  const rect = canvas.getBoundingClientRect();
  pointerNDC.x = ((e.clientX - rect.left) / Math.max(1, rect.width)) * 2 - 1;
  pointerNDC.y = -((e.clientY - rect.top) / Math.max(1, rect.height)) * 2 + 1;
  raycaster.setFromCamera(pointerNDC, camera);
  const hits = raycaster.intersectObjects(world.pickables, false);
  if (hits.length > 0) {
    const slotId = hits[0].object.userData.slotId;
    if (slotId !== undefined) selectOrCompleteMove(slotId);
  }
});

if (mobileCamPad) {
  mobileCamPad.querySelectorAll('[data-cam-nudge]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const dir = btn.dataset.camNudge;
      const fwd = new THREE.Vector3();
      camera.getWorldDirection(fwd); fwd.y = 0; fwd.normalize();
      const right = new THREE.Vector3().crossVectors(fwd, new THREE.Vector3(0, 1, 0));
      const d = new THREE.Vector3();
      if (dir === 'up') d.addScaledVector(fwd, 0.5);
      if (dir === 'down') d.addScaledVector(fwd, -0.5);
      if (dir === 'left') d.addScaledVector(right, -0.5);
      if (dir === 'right') d.addScaledVector(right, 0.5);
      camera.position.add(d);
      controls.target.add(d);
      controls.update();
    });
  });
}

window.addEventListener('keydown', (e) => {
  keysHeld.add(e.code);
  if (e.target && ['INPUT', 'SELECT', 'TEXTAREA'].includes(e.target.tagName)) return;
  if (e.code === 'KeyH') ui.setContemplative(!state.contemplative);
  else if (e.code === 'KeyP' || e.code === 'Escape') {
    if (state.privacyOpen) ui.setPrivacyOpen(false);
    else if (state.settingsOpen) ui.setDrawerOpen(false);
    else ui.setPaused(!state.paused);
  } else if (e.code === 'KeyR') resetGallery();
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
window.addEventListener('sangi:reset', () => resetGallery());
window.addEventListener('sangi:quality', (e) => {
  const q = e?.detail?.quality;
  if (q && QUALITY_PROFILES[q]) { state.qualityMode = q; applyQualityNow(); ui.syncAll(); }
});
window.addEventListener('sangi:dispose', () => disposeAll());
if (window.SangiBridge && typeof window.SangiBridge.notifyReady === 'function') {
  window.SangiBridge.notifyReady({ title: '# 072 — Museu das Memórias', appId: 'museu-das-memorias' });
}

function disposeAll() {
  if (disposed) return;
  disposed = true;
  clearAllItems();
  renderer.setAnimationLoop(null);
  window.removeEventListener('resize', handleResize);
  controls.dispose();
  world.dispose();
  mats.dispose();
  envRT.dispose();
  audio.dispose();
  renderer.dispose();
}

// Inicialização em Exposição Pessoal limpa (sem registro por padrão -> T03)
world.syncAllSlots(state.items, state.selectedSlotId);
applyCameraMode('walk');
applyQualityNow();
syncControlsLock();
ui.syncAll();

const FIXED_DT = 1 / 60;
let accum = 0;
const timer = new THREE.Timer();
timer.connect(document);

function stepKeyboardWalk(dt) {
  if (state.paused || state.settingsOpen || state.privacyOpen) return;
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
  camera.position.x = THREE.MathUtils.clamp(camera.position.x + move.x, -4.0, 4.0);
  camera.position.z = THREE.MathUtils.clamp(camera.position.z + move.z, -3.5, 4.2);
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
      state.simTime += FIXED_DT;
      stepKeyboardWalk(FIXED_DT);
      accum -= FIXED_DT;
      sub++;
    }
    if (accum > FIXED_DT * 2) accum = 0;
  }
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

window.__MUSEU__ = {
  renderer, scene, camera, controls, state, world, selectOrCompleteMove, dispose: disposeAll,
};
