/**
 * main.js
 * Orquestrador principal de # 025 — Geometria das Conchas.
 * Three.js r187 WebGL + THREE.Timer + timestep fixo (1/60s) + concha paramétrica dupla
 * com corte anatômico, modo fotografia macro com DoF opcional e SangiBridge.
 */
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { createStudioEnvironment } from '/Sistema/shared/engine/studio-environment.js';
import {
  PHOTO_FRAMINGS,
  QUALITY_PROFILES,
  SEED,
  TEXTURE_STYLES,
  createDefaultState,
} from './js/state.js';
import { createShellMuseumMaterials } from './js/materials.js';
import { createShellAnatomyController } from './js/shell-anatomy.js';
import { buildMuseumWorld } from './js/museum-world.js';
import { createShellAudioEngine } from './js/audio-engine.js';
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
renderer.toneMappingExposure = 1.12;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0c1016);
scene.fog = new THREE.FogExp2(0x0c1016, 0.065);

const envRT = createStudioEnvironment(renderer);
scene.environment = envRT.texture;
scene.environmentIntensity = 0.72;

const camera = new THREE.PerspectiveCamera(
  38,
  window.innerWidth / Math.max(1, window.innerHeight),
  0.1,
  60
);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.dampingFactor = 0.08;
controls.minDistance = 1.65;
controls.maxDistance = 8.2;
controls.minPolarAngle = 0.14;
controls.maxPolarAngle = Math.PI * 0.47;

const state = createDefaultState();
const mats = createShellMuseumMaterials(SEED);
const world = buildMuseumWorld(scene, mats, SEED);
const shell = createShellAnatomyController(scene, mats);
const audio = createShellAudioEngine();

// Pós-processamento seletivo macro DoF leve para Modo Fotografia (desligável p/ inspeção)
const dofRT = new THREE.WebGLRenderTarget(1024, 1024, {
  type: THREE.HalfFloatType,
});
const dofScene = new THREE.Scene();
const dofCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
const dofMat = new THREE.ShaderMaterial({
  uniforms: {
    tDiffuse: { value: dofRT.texture },
    uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
    uFocusDist: { value: state.focusDist },
  },
  vertexShader: /* glsl */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = vec4(position.xy, 0.0, 1.0);
    }
  `,
  fragmentShader: /* glsl */ `
    precision highp float;
    varying vec2 vUv;
    uniform sampler2D tDiffuse;
    uniform vec2 uResolution;
    uniform float uFocusDist;

    void main() {
      vec2 offset = vUv - vec2(0.5);
      offset.x *= uResolution.x / max(1.0, uResolution.y);
      float r = length(offset);
      float clearRadius = mix(0.24, 0.42, clamp(uFocusDist, 0.0, 1.0));
      float blurAmt = smoothstep(clearRadius, 0.92, r) * 0.0042;

      vec4 col = texture2D(tDiffuse, vUv) * 0.28;
      col += texture2D(tDiffuse, vUv + vec2( blurAmt, 0.0)) * 0.12;
      col += texture2D(tDiffuse, vUv + vec2(-blurAmt, 0.0)) * 0.12;
      col += texture2D(tDiffuse, vUv + vec2(0.0,  blurAmt)) * 0.12;
      col += texture2D(tDiffuse, vUv + vec2(0.0, -blurAmt)) * 0.12;
      col += texture2D(tDiffuse, vUv + vec2( blurAmt * 0.7,  blurAmt * 0.7)) * 0.06;
      col += texture2D(tDiffuse, vUv + vec2(-blurAmt * 0.7,  blurAmt * 0.7)) * 0.06;
      col += texture2D(tDiffuse, vUv + vec2( blurAmt * 0.7, -blurAmt * 0.7)) * 0.06;
      col += texture2D(tDiffuse, vUv + vec2(-blurAmt * 0.7, -blurAmt * 0.7)) * 0.06;
      gl_FragColor = col;
    }
  `,
  depthTest: false,
  depthWrite: false,
});
const dofQuadGeo = new THREE.PlaneGeometry(2, 2);
dofScene.add(new THREE.Mesh(dofQuadGeo, dofMat));

let disposed = false;
let fpsWindowTime = 0;
let fpsWindowFrames = 0;
let lowFpsStreak = 0;
let currentFps = 60;
let lastCapturedPNG = null;
const keysHeld = new Set();

function getEffectiveQualityKey() {
  if (state.qualityMode !== 'auto') return state.qualityMode;
  return state.resolvedQuality;
}

function rebuildShellNow() {
  const qProf = QUALITY_PROFILES[getEffectiveQualityKey()] || QUALITY_PROFILES.medium;
  const texture = TEXTURE_STYLES[state.textureStyle] || TEXTURE_STYLES.banded;
  mats.setOuterTexture(state.textureStyle);
  const metrics = shell.rebuild({
    ...state,
    viewMode: state.cutaway ? 'cutaway' : 'whole',
    ribsCount: texture.ribFreq,
    ribsIntensity: texture.ribAmp,
  }, qProf.segU, qProf.segV);
  world.syncCaliperToShellWidth(metrics.width);
  ui.syncToolbar(metrics);
  return metrics;
}

function applyFraming(framingId = 'table') {
  const f = PHOTO_FRAMINGS[framingId] || PHOTO_FRAMINGS.table;
  state.framing = f.id;
  const isNarrow = window.innerWidth < 768;
  const src = isNarrow ? f.mobilePos : f.pos;
  camera.position.set(src[0], src[1], src[2]);
  controls.target.set(f.target[0], f.target[1], f.target[2]);
  controls.update();
}

function applyQualityNow() {
  const qKey = getEffectiveQualityKey();
  const profile = QUALITY_PROFILES[qKey] || QUALITY_PROFILES.medium;
  const dpr = Math.min(window.devicePixelRatio || 1, profile.dprCap);
  renderer.setPixelRatio(dpr);
  renderer.setSize(window.innerWidth, window.innerHeight, false);
  const w = Math.max(1, Math.floor(window.innerWidth * dpr));
  const h = Math.max(1, Math.floor(window.innerHeight * dpr));
  dofRT.setSize(w, h);
  dofMat.uniforms.uResolution.value.set(w, h);
  world.applyQuality(profile);
  renderer.shadowMap.enabled = profile.shadows;
}

function syncControlsLock() {
  const blocked = state.paused || state.settingsOpen || state.compareOpen;
  controls.enabled = !blocked;
  if (mobileCamPad) {
    const showPad = window.innerWidth < 900 && !state.contemplative && !blocked;
    mobileCamPad.classList.toggle('visible', showPad);
  }
}

function renderFrame() {
  renderer.toneMappingExposure = state.exposure;
  const useDof = state.photoMode && state.dofEnabled && !state.reducedMotion;
  if (useDof) {
    dofMat.uniforms.uFocusDist.value = state.focusDist;
    renderer.setRenderTarget(dofRT);
    renderer.render(scene, camera);
    renderer.setRenderTarget(null);
    renderer.render(dofScene, dofCam);
  } else {
    renderer.setRenderTarget(null);
    renderer.render(scene, camera);
  }
}

function capturePNG() {
  if (disposed) return null;
  renderFrame();
  const pngUrl = canvas.toDataURL('image/png');
  lastCapturedPNG = pngUrl;
  audio.playClick(680);
  ui.triggerShutterFlash();
  ui.showFeedback('Captura PNG realizada', 'info');

  // Oferece download discreto sem bloquear fluxo headless
  try {
    const a = document.createElement('a');
    a.href = pngUrl;
    a.download = `geometria-das-conchas-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  } catch (_) {}
  return pngUrl;
}

function catalogCurrentSpecimen() {
  renderFrame();
  const thumbUrl = canvas.toDataURL('image/jpeg', 0.86);
  const metrics = shell.getMetrics();
  const tSpec = TEXTURE_STYLES[state.textureStyle] || TEXTURE_STYLES.banded;
  const entry = {
    id: Date.now(),
    name: `${tSpec.short} (${state.spiralTurns.toFixed(1)}v)`,
    spiralTurns: state.spiralTurns,
    aperture: state.aperture,
    scaleRatio: state.scaleRatio,
    textureStyle: state.textureStyle,
    cutaway: state.cutaway,
    spirePitch: state.spirePitch,
    ratioWH: metrics.ratioWH,
    chamberCount: metrics.chamberCount,
    thumbUrl,
  };

  if (state.catalog.length >= 3) {
    state.catalog.shift();
  }
  state.catalog.push(entry);
  audio.playClick(520);
  ui.syncToolbar(metrics);
  if (state.compareOpen) ui.renderCompareModal();
  ui.showFeedback(`Espécime catalogado (${state.catalog.length}/3)`, 'info');
  return entry;
}

function resetWorkbench() {
  state.spiralTurns = 3.15;
  state.aperture = 0.62;
  state.scaleRatio = 1.0;
  state.textureStyle = 'banded';
  state.cutaway = true;
  state.spirePitch = 0.22;
  state.exposure = 1.12;
  state.focusDist = 0.45;
  state.photoMode = false;
  state.paused = false;
  state.settingsOpen = false;
  state.compareOpen = false;
  applyFraming('table');
  const m = rebuildShellNow();
  ui.setCompareOpen(false);
  ui.setDrawerOpen(false);
  ui.syncAll(m);
  syncControlsLock();
  ui.showFeedback('Bancada restaurada ao Náutilo padrão', 'info');
}

const ui = createUIController({
  state,
  callbacks: {
    onGeometryChange(withSound = false) {
      const m = rebuildShellNow();
      if (withSound) audio.playClick(460);
      return m;
    },
    onCatalogSpecimen() {
      catalogCurrentSpecimen();
    },
    onLoadSpecimen(item) {
      state.spiralTurns = item.spiralTurns;
      state.aperture = item.aperture;
      state.scaleRatio = item.scaleRatio;
      state.textureStyle = item.textureStyle;
      state.cutaway = item.cutaway;
      state.spirePitch = item.spirePitch ?? 0.22;
      rebuildShellNow();
      audio.playClick(500);
      ui.showFeedback(`Espécime "${item.name}" restaurado na bancada`, 'info');
    },
    onClearCatalog() {
      state.catalog = [];
      ui.syncToolbar(shell.getMetrics());
      ui.renderCompareModal();
      ui.showFeedback('Catálogo de comparação limpo', 'info');
    },
    onPhotoConfigChange() {
      syncControlsLock();
    },
    onFramingChange(framingId) {
      applyFraming(framingId);
    },
    onCapturePNG() {
      capturePNG();
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
      resetWorkbench();
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
      if (state.reducedMotion) state.dofEnabled = false;
      ui.syncAll(shell.getMetrics());
    },
    onQualityChange() {
      applyQualityNow();
      rebuildShellNow();
    },
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
      const offset = camera.position.clone().sub(controls.target);
      const sph = new THREE.Spherical().setFromVector3(offset);
      if (dir === 'left') sph.theta -= 0.22;
      if (dir === 'right') sph.theta += 0.22;
      if (dir === 'up') sph.phi = Math.max(0.16, sphericalClamp(sph.phi - 0.14));
      if (dir === 'down') sph.phi = Math.min(Math.PI * 0.45, sphericalClamp(sph.phi + 0.14));
      offset.setFromSpherical(sph);
      camera.position.copy(controls.target).add(offset);
      controls.update();
    });
  });
}

function sphericalClamp(v) {
  return Math.max(0.16, Math.min(Math.PI * 0.45, v));
}

// ============================================================================
// TECLADO, VISIBILIDADE E CONTEXTO WEBGL
// ============================================================================
window.addEventListener('keydown', (e) => {
  keysHeld.add(e.code);
  if (e.target && ['INPUT', 'SELECT', 'TEXTAREA'].includes(e.target.tagName)) return;

  if (e.code === 'KeyC') {
    state.cutaway = !state.cutaway;
    rebuildShellNow();
    audio.playClick(460);
  } else if (e.code === 'KeyF') {
    capturePNG();
  } else if (e.code === 'KeyH') {
    ui.setContemplative(!state.contemplative);
  } else if (e.code === 'KeyP' || e.code === 'Escape') {
    if (state.compareOpen) ui.setCompareOpen(false);
    else if (state.settingsOpen) ui.setDrawerOpen(false);
    else ui.setPaused(!state.paused);
  } else if (e.code === 'KeyR') {
    resetWorkbench();
  }
});
window.addEventListener('keyup', (e) => keysHeld.delete(e.code));

document.addEventListener('visibilitychange', () => {
  if (document.hidden) audio.suspend();
  else if (!state.paused && state.soundEnabled && !state.muted) audio.resume();
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
  ui.syncAll(shell.getMetrics());
});
window.addEventListener('sangi:reset', () => {
  resetWorkbench();
});
window.addEventListener('sangi:quality', (e) => {
  const q = e?.detail?.quality;
  if (q && QUALITY_PROFILES[q]) {
    state.qualityMode = q;
    applyQualityNow();
    rebuildShellNow();
    ui.syncAll(shell.getMetrics());
  }
});
window.addEventListener('sangi:dispose', () => {
  disposeAll();
});
if (window.SangiBridge && typeof window.SangiBridge.notifyReady === 'function') {
  window.SangiBridge.notifyReady({ title: '# 025 — Geometria das Conchas', appId: 'geometria-das-conchas' });
}

function disposeAll() {
  if (disposed) return;
  disposed = true;
  renderer.setAnimationLoop(null);
  window.removeEventListener('resize', handleResize);
  controls.dispose();
  shell.dispose();
  world.dispose();
  mats.dispose();
  dofRT.dispose();
  dofMat.dispose();
  dofQuadGeo.dispose();
  envRT.dispose();
  audio.dispose();
  renderer.dispose();
}

// ============================================================================
// INICIALIZAÇÃO & LOOP DE TIMESTEP FIXO (1/60s)
// ============================================================================
applyQualityNow();
applyFraming('table');
const initMetrics = rebuildShellNow();
syncControlsLock();
ui.syncAll(initMetrics);

const FIXED_DT = 1 / 60;
let accum = 0;
const timer = new THREE.Timer();
timer.connect(document);

function stepKeyboardOrbit(dt) {
  if (state.paused || state.settingsOpen || state.compareOpen) return;
  let dx = 0;
  let dy = 0;
  if (keysHeld.has('ArrowLeft')) dx -= 1;
  if (keysHeld.has('ArrowRight')) dx += 1;
  if (keysHeld.has('ArrowUp')) dy -= 1;
  if (keysHeld.has('ArrowDown')) dy += 1;
  if (dx === 0 && dy === 0) return;

  const offset = camera.position.clone().sub(controls.target);
  const sph = new THREE.Spherical().setFromVector3(offset);
  sph.theta += dx * dt * 1.1;
  sph.phi = sphericalClamp(sph.phi + dy * dt * 0.85);
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
      world.stepAnimation(FIXED_DT, state);
      stepKeyboardOrbit(FIXED_DT);
      accum -= FIXED_DT;
      sub++;
    }
    if (accum > FIXED_DT * 2) accum = 0;
  }

  audio.updateSurf(state.simTime, state.paused, state.reducedMotion);
  controls.update();
  renderFrame();

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
          rebuildShellNow();
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

window.__CONCHAS__ = {
  renderer,
  scene,
  camera,
  controls,
  state,
  shell,
  world,
  capturePNG,
  catalogCurrentSpecimen,
  getLastPNG: () => lastCapturedPNG,
  dispose: disposeAll,
};
