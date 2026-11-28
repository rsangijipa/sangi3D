/**
 * main.js
 * Orquestrador modular de Vale dos Vaga-lumes (#095) sobre Three.js r187 WebGL.
 * Integra Timer r187, Probe HDR noturno, simulação física fixa, riacho shader,
 * controles Walk/Orbit unificados, Web Audio e ciclo SangiBridge completo.
 */
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import {
  INITIAL_SEED,
  QUALITY_PROFILES,
  WAYPOINTS,
  createDefaultState,
  formatNightHour,
} from './js/state.js';
import {
  clamp,
  createStaticColliders,
  resolvePlayerConstraints,
  terrainHeight,
} from './js/math-terrain.js';
import { createNightEnvironment, createWorldMaterials } from './js/materials.js';
import { buildWorldScene } from './js/world-geometry.js';
import { createStreamSystem } from './js/water-stream.js';
import { createFireflySimulation } from './js/fireflies-physics.js';
import { createAudioEngine } from './js/audio-engine.js';
import { createUIController } from './js/ui-controller.js';

(function bootstrap() {
  const stage = document.getElementById('stage-canvas-wrap');
  const statusBanner = document.getElementById('webgl-status');

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
    });
  } catch (err) {
    statusBanner.hidden = false;
    statusBanner.textContent = 'WebGL não disponível neste dispositivo ou navegador.';
    return;
  }

  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.06;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  stage.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x07101c);
  scene.fog = new THREE.FogExp2(0x07111e, 0.015);

  const nightEnvRT = createNightEnvironment(renderer);
  scene.environment = nightEnvRT.texture;
  scene.environmentIntensity = 0.34;

  const camera = new THREE.PerspectiveCamera(48, window.innerWidth / window.innerHeight, 0.1, 200);

  const state = createDefaultState();
  const colliders = createStaticColliders();
  const mats = createWorldMaterials(INITIAL_SEED);
  const world = buildWorldScene(scene, mats, state);
  const stream = createStreamSystem(scene, world.boulderObstacles);
  const fireflies = createFireflySimulation(scene, colliders);
  const audio = createAudioEngine();

  // Controles de Órbita (habilitados somente no modo Orbit ou quando menus fechados)
  const orbit = new OrbitControls(camera, renderer.domElement);
  orbit.enableDamping = true;
  orbit.dampingFactor = 0.07;
  orbit.minDistance = 2.0;
  orbit.maxDistance = 32.0;
  orbit.maxPolarAngle = Math.PI * 0.485;
  orbit.enabled = false;

  // Estado da câmera Walk (trilha e olhar livre)
  const walkCam = {
    pos: new THREE.Vector3(-2.05, 1.56, 6.45),
    targetPos: null,
    yaw: 0.0,
    pitch: 0.0,
    bobPhase: 0,
  };

  function jumpToWaypoint(wpId) {
    const wp = WAYPOINTS.find((w) => w.id === wpId) || WAYPOINTS[0];
    state.waypointId = wp.id;
    walkCam.pos.set(wp.pos.x, terrainHeight(wp.pos.x, wp.pos.z) + 1.55, wp.pos.z);
    walkCam.targetPos = null;
    const dx = wp.look.x - walkCam.pos.x;
    const dy = wp.look.y - walkCam.pos.y;
    const dz = wp.look.z - walkCam.pos.z;
    const horiz = Math.hypot(dx, dz);
    walkCam.yaw = Math.atan2(-dx, -dz);
    walkCam.pitch = clamp(Math.atan2(dy, horiz), -0.65, 0.75);

    if (state.cameraMode === 'orbit') {
      camera.position.copy(walkCam.pos);
      orbit.target.set(wp.look.x, wp.look.y, wp.look.z);
      orbit.update();
    } else {
      syncWalkCamera(0);
    }
  }

  function syncWalkCamera(bobOffset = 0) {
    camera.position.set(walkCam.pos.x, walkCam.pos.y + bobOffset, walkCam.pos.z);
    const cosP = Math.cos(walkCam.pitch);
    const lookX = camera.position.x - Math.sin(walkCam.yaw) * cosP * 5.0;
    const lookY = camera.position.y + Math.sin(walkCam.pitch) * 5.0;
    const lookZ = camera.position.z - Math.cos(walkCam.yaw) * cosP * 5.0;
    camera.lookAt(lookX, lookY, lookZ);
  }

  function handleResize() {
    const w = Math.max(1, stage.clientWidth || window.innerWidth);
    const h = Math.max(1, stage.clientHeight || window.innerHeight);
    const aspect = w / h;
    camera.aspect = aspect;
    // Em telas retrato estreitas amplia o campo vertical para não cortar poste e riacho
    camera.fov = aspect < 0.75 ? clamp(48 / (aspect / 0.75), 48, 66) : 48;
    camera.updateProjectionMatrix();
    applyQualityProfile(state.qualityMode, w, h);
  }

  function applyQualityProfile(modeOrTier, widthOverride, heightOverride) {
    const w = Math.max(1, widthOverride || stage.clientWidth || window.innerWidth);
    const h = Math.max(1, heightOverride || stage.clientHeight || window.innerHeight);
    const isNarrow = w < 900;
    const resolved = modeOrTier === 'auto' ? (isNarrow ? 'low' : 'medium') : modeOrTier;
    state.resolvedQuality = QUALITY_PROFILES[resolved] ? resolved : 'medium';
    const p = QUALITY_PROFILES[state.resolvedQuality];

    const dpr = Math.min(window.devicePixelRatio || 1, p.dprCap);
    renderer.setPixelRatio(dpr);
    renderer.setSize(w, h, false);
    renderer.shadowMap.enabled = p.shadows;
    world.applyQualityCounts(p);
  }

  // Entrada de caminhada + olhar por ponteiro e D-pad móvel
  const keys = new Set();
  const moveIntent = { x: 0, z: 0 };
  const activePointers = new Map();
  let dragStart = null;
  let movedDrag = false;
  const raycaster = new THREE.Raycaster();
  const pointerNdc = new THREE.Vector2();

  function syncOrbitPermission() {
    const blocked = state.paused || state.settingsOpen || state.journalOpen;
    orbit.enabled = !blocked && state.cameraMode === 'orbit';
  }

  const canvas = renderer.domElement;
  function onPointerDown(e) {
    if (state.paused || state.settingsOpen || state.journalOpen) return;
    canvas.setPointerCapture(e.pointerId);
    activePointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (activePointers.size === 1) {
      dragStart = { x: e.clientX, y: e.clientY };
      movedDrag = false;
    }
  }

  function onPointerMove(e) {
    if (state.cameraMode !== 'walk' || state.paused || state.settingsOpen || state.journalOpen) return;
    const prev = activePointers.get(e.pointerId);
    if (!prev) return;
    const dx = e.clientX - prev.x;
    const dy = e.clientY - prev.y;
    if (dragStart && Math.hypot(e.clientX - dragStart.x, e.clientY - dragStart.y) > 6) {
      movedDrag = true;
    }
    if (activePointers.size === 1) {
      walkCam.yaw += dx * 0.0042;
      walkCam.pitch = clamp(walkCam.pitch + dy * 0.0036, -0.65, 0.72);
    }
    activePointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
  }

  function onPointerUp(e) {
    const wasSingle = activePointers.size === 1 && dragStart && !movedDrag;
    activePointers.delete(e.pointerId);
    if (wasSingle && state.cameraMode === 'walk' && !state.paused && !state.settingsOpen && !state.journalOpen) {
      // Toque curto no terreno leva suavemente pela trilha até o ponto clicado
      const rect = canvas.getBoundingClientRect();
      pointerNdc.set(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -((e.clientY - rect.top) / rect.height) * 2 + 1
      );
      raycaster.setFromCamera(pointerNdc, camera);
      const hitPt = new THREE.Vector3();
      if (raycaster.ray.intersectPlane(new THREE.Plane(new THREE.Vector3(0, 1, 0), 0), hitPt)) {
        if (hitPt.z < 14 && hitPt.z > -38 && Math.abs(hitPt.x) < 12) {
          walkCam.targetPos = resolvePlayerConstraints(hitPt.clone(), colliders, 0.5);
        }
      }
    }
    if (activePointers.size === 0) dragStart = null;
  }

  canvas.addEventListener('pointerdown', onPointerDown);
  canvas.addEventListener('pointermove', onPointerMove);
  ['pointerup', 'pointercancel', 'lostpointercapture'].forEach((ev) => {
    canvas.addEventListener(ev, onPointerUp);
  });

  function onKeyDown(e) {
    if (e.target && e.target.matches && e.target.matches('input,select,textarea')) return;
    const code = e.code;
    keys.add(code);
    if (code === 'Escape') {
      if (state.settingsOpen) ui.setDrawerOpen(false);
      else if (state.journalOpen) ui.setJournalOpen(false);
      else togglePause(!state.paused);
    } else if (code === 'KeyP') {
      togglePause(!state.paused);
    } else if (code === 'KeyR') {
      resetAll();
    } else if (code === 'Digit1') {
      state.activeTool = 'brilho'; ui.renderDockSubpanel();
    } else if (code === 'Digit2') {
      state.activeTool = 'hora'; ui.renderDockSubpanel();
    } else if (code === 'Digit3') {
      state.activeTool = 'som'; ui.renderDockSubpanel();
    } else if (code === 'Digit4') {
      capturePhoto();
    }
  }
  function onKeyUp(e) {
    keys.delete(e.code);
  }
  window.addEventListener('keydown', onKeyDown);
  window.addEventListener('keyup', onKeyUp);
  window.addEventListener('blur', () => {
    keys.clear();
    activePointers.clear();
  });

  // D-pad móvel (eventos Pointer para segurar caminhada sem interferir na órbita)
  document.querySelectorAll('[data-move-dir]').forEach((btn) => {
    const dir = btn.dataset.moveDir;
    const setDir = (on) => {
      if (dir === 'fwd') moveIntent.z = on ? -1 : 0;
      if (dir === 'back') moveIntent.z = on ? 1 : 0;
      if (dir === 'left') moveIntent.x = on ? -1 : 0;
      if (dir === 'right') moveIntent.x = on ? 1 : 0;
      btn.classList.toggle('pressed', on);
    };
    btn.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      e.stopPropagation();
      btn.setPointerCapture(e.pointerId);
      setDir(true);
    });
    ['pointerup', 'pointercancel', 'lostpointercapture'].forEach((ev) => {
      btn.addEventListener(ev, () => setDir(false));
    });
  });

  // ============================================================================
  // AÇÕES DO JOGADOR & TESTES T01 / T02 / T03 / T-STATE
  // ============================================================================
  let ui;

  function renderOnce() {
    const env = world.updateAtmosphere(state.simTime, state);
    stream.update(state.simTime, state, env);
    renderer.render(scene, camera);
  }

  function capturePhoto() {
    // T03: garante um passe limpo imediato antes de extrair a imagem PNG da cena
    ui.flashShutter();
    renderOnce();
    let dataUrl = '';
    try {
      dataUrl = renderer.domElement.toDataURL('image/png');
    } catch (_) {}

    state.photosTaken++;
    const wp = WAYPOINTS.find((w) => w.id === state.waypointId) || WAYPOINTS[0];
    state.observedRecords.push({
      waypoint: wp.name,
      hourStr: formatNightHour(state.hour),
      count: state.density,
      orderR: state.measuredOrderR.toFixed(2),
      thumb: dataUrl || null,
    });
    if (state.observedRecords.length > 12) state.observedRecords.shift();

    if (dataUrl) {
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `vale-vagalumes-${String(state.photosTaken).padStart(2, '0')}.png`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    }
    ui.renderDockSubpanel();
    ui.showToast('📸 Fotografia salva no Diário de Campo e baixada em PNG!');
  }

  function recordPattern() {
    const wp = WAYPOINTS.find((w) => w.id === state.waypointId) || WAYPOINTS[0];
    state.observedRecords.push({
      waypoint: wp.name,
      hourStr: formatNightHour(state.hour),
      count: state.density,
      orderR: state.measuredOrderR.toFixed(2),
      thumb: null,
    });
    if (state.observedRecords.length > 12) state.observedRecords.shift();
    audio.playRecordChime();
    ui.renderJournalEntries();
    ui.showToast(`✦ Padrão registrado: R=${state.measuredOrderR.toFixed(2)} (${state.density} vaga-lumes)`);
  }

  function togglePause(force) {
    const next = typeof force === 'boolean' ? force : !state.paused;
    ui.setPauseOverlay(next);
    if (next) audio.suspend();
    else if (state.soundEnabled && !state.muted) audio.resume();
  }

  function resetAll() {
    const prevSound = state.soundEnabled;
    const prevMuted = state.muted;
    const fresh = createDefaultState();
    Object.assign(state, fresh);
    state.soundEnabled = prevSound;
    state.muted = prevMuted;

    fireflies.reset(INITIAL_SEED);
    jumpToWaypoint('poste');
    handleResize();
    ui.syncAll();
    ui.showToast('↺ Vale restaurado para o estado inicial determinístico');
  }

  ui = createUIController({
    state,
    callbacks: {
      onBrightnessChange() {},
      onHourChange() {},
      onVolumeChange(v) { audio.setVolume(v); },
      async onToggleSound(forceOn) {
        const next = typeof forceOn === 'boolean' ? forceOn : !(state.soundEnabled && !state.muted);
        state.muted = false;
        const ok = await audio.setEnabled(next);
        state.soundEnabled = ok;
        audio.setVolume(state.volume);
        ui.renderDockSubpanel();
        ui.showToast(ok ? '🔊 Som ambiente noturno ativado' : '🔇 Som ambiente silenciado');
      },
      onCapturePhoto: capturePhoto,
      onRecordPattern: recordPattern,
      onDensityChange() {
        fireflies.update(0, state, renderer.getPixelRatio());
      },
      onReducedMotionChange(on) {
        world.updateAtmosphere(state.simTime, state);
        fireflies.update(0.02, state, renderer.getPixelRatio());
        ui.showToast(on ? '♿ Movimento reduzido: cintilação atenuada' : '✨ Cintilação natural reativada');
      },
      onQualityChange(q) {
        applyQualityProfile(q);
      },
      onCameraModeChange(mode) {
        syncOrbitPermission();
        if (mode === 'orbit') {
          orbit.target.set(0.2, 0.9, -4.0);
          orbit.update();
          ui.showToast('🛰 Modo Órbita: arraste para girar e pinça/scroll para zoom');
        } else {
          jumpToWaypoint(state.waypointId);
          ui.showToast('🥾 Modo Trilha: arraste para olhar e clique/use teclas para caminhar');
        }
      },
      onWaypointSelect(id) {
        jumpToWaypoint(id);
        const wp = WAYPOINTS.find((w) => w.id === id);
        if (wp) ui.showToast(`📍 ${wp.name}`);
      },
      onTogglePause: togglePause,
      onMenuStateChange: syncOrbitPermission,
      onReset: resetAll,
      onExit() {
        if (window.parent && window.parent !== window) {
          window.parent.postMessage({ type: 'SANGI_EXIT_REQUEST' }, '*');
        }
        window.location.href = '/';
      },
    },
  });

  // Inicializa câmera, enquadramento inicial fiel ao mockup e listeners
  handleResize();
  jumpToWaypoint('poste');
  window.addEventListener('resize', handleResize);
  const stageObserver = typeof ResizeObserver === 'function'
    ? new ResizeObserver(() => handleResize())
    : null;
  if (stageObserver) stageObserver.observe(stage);

  // ============================================================================
  // LOOP PRINCIPAL COM THREE.Timer (r187)
  // ============================================================================
  const timer = new THREE.Timer();
  timer.connect(document);

  let disposed = false;
  let sangiPaused = false;
  let fpsTimer = 0;
  let frameCounter = 0;
  let autoLowStreak = 0;
  let hintHidden = false;

  renderer.setAnimationLoop(() => {
    if (disposed || sangiPaused || state.paused || document.hidden) {
      timer.update();
      return;
    }

    timer.update();
    const dt = Math.min(Math.max(timer.getDelta(), 0), 0.1);
    state.simTime += dt;

    // Movimento na trilha (teclado, D-pad ou clique no chão)
    if (state.cameraMode === 'walk' && !state.settingsOpen && !state.journalOpen) {
      let fwd = moveIntent.z;
      let strafe = moveIntent.x;
      if (keys.has('KeyW') || keys.has('ArrowUp')) fwd -= 1;
      if (keys.has('KeyS') || keys.has('ArrowDown')) fwd += 1;
      if (keys.has('KeyA') || keys.has('ArrowLeft')) strafe -= 1;
      if (keys.has('KeyD') || keys.has('ArrowRight')) strafe += 1;

      const moving = fwd !== 0 || strafe !== 0;
      if (moving) {
        walkCam.targetPos = null;
        const speed = 2.85;
        const len = Math.hypot(fwd, strafe) || 1;
        const nf = fwd / len;
        const ns = strafe / len;
        const sinY = Math.sin(walkCam.yaw);
        const cosY = Math.cos(walkCam.yaw);
        // Frente na direção da câmera (-sinY, -cosY)
        walkCam.pos.x += (sinY * nf + cosY * ns) * speed * dt;
        walkCam.pos.z += (cosY * nf - sinY * ns) * speed * dt;
        resolvePlayerConstraints(walkCam.pos, colliders, 0.48);
        walkCam.bobPhase += dt * 7.2;
      } else if (walkCam.targetPos) {
        const d = walkCam.pos.distanceTo(walkCam.targetPos);
        if (d < 0.08) {
          walkCam.targetPos = null;
        } else {
          const step = Math.min(d, 2.5 * dt);
          walkCam.pos.addScaledVector(
            walkCam.targetPos.clone().sub(walkCam.pos).normalize(),
            step
          );
          resolvePlayerConstraints(walkCam.pos, colliders, 0.48);
          walkCam.bobPhase += dt * 6.4;
        }
      }

      const groundY = terrainHeight(walkCam.pos.x, walkCam.pos.z);
      walkCam.pos.y = groundY + 1.56;
      const bob = state.reducedMotion ? 0 : Math.sin(walkCam.bobPhase) * (moving || walkCam.targetPos ? 0.032 : 0.0);
      syncWalkCamera(bob);
    } else if (state.cameraMode === 'orbit') {
      orbit.update();
    }

    // Avança física fixa dos vaga-lumes, shader de água, atmosfera e áudio espacial
    fireflies.update(dt, state, renderer.getPixelRatio());
    const envColors = world.updateAtmosphere(state.simTime, state);
    stream.update(state.simTime, state, envColors);
    audio.updateSpatial(camera.position, state);

    renderer.render(scene, camera);

    if (!hintHidden && state.simTime > 6.0) {
      hintHidden = true;
      const h = document.getElementById('intro-hint');
      if (h) h.classList.add('fade');
    }

    // Telemetria e ajuste adaptativo de qualidade
    frameCounter++;
    fpsTimer += dt;
    if (fpsTimer >= 0.65) {
      const fps = frameCounter / fpsTimer;
      ui.updateTelemetry(fps, renderer.info.render.calls, state);
      if (state.qualityMode === 'auto' && state.resolvedQuality !== 'low') {
        autoLowStreak = fps < 24 ? autoLowStreak + 1 : 0;
        if (autoLowStreak >= 2) {
          autoLowStreak = 0;
          applyQualityProfile(state.resolvedQuality === 'high' ? 'medium' : 'low');
        }
      }
      frameCounter = 0;
      fpsTimer = 0;
    }
  });

  // ============================================================================
  // CICLO DE VIDA SANGI BRIDGE + CONTEXT RECOVERY + DISPOSE COMPLETO
  // ============================================================================
  function onContextLost(e) {
    e.preventDefault();
    statusBanner.hidden = false;
    statusBanner.textContent = 'Contexto WebGL suspenso pelo navegador. Aguardando recuperação...';
  }
  function onContextRestored() {
    statusBanner.hidden = true;
  }
  function onVisibilityChange() {
    if (document.hidden) {
      audio.suspend();
    } else if (!state.paused && !sangiPaused && state.soundEnabled && !state.muted) {
      audio.resume();
    }
  }

  function cleanup() {
    if (disposed) return;
    disposed = true;
    renderer.setAnimationLoop(null);
    timer.dispose();
    if (stageObserver) stageObserver.disconnect();
    window.removeEventListener('resize', handleResize);
    window.removeEventListener('keydown', onKeyDown);
    window.removeEventListener('keyup', onKeyUp);
    document.removeEventListener('visibilitychange', onVisibilityChange);
    canvas.removeEventListener('pointerdown', onPointerDown);
    canvas.removeEventListener('pointermove', onPointerMove);
    ['pointerup', 'pointercancel', 'lostpointercapture'].forEach((ev) => {
      canvas.removeEventListener(ev, onPointerUp);
    });
    canvas.removeEventListener('webglcontextlost', onContextLost);
    canvas.removeEventListener('webglcontextrestored', onContextRestored);
    window.removeEventListener('sangi:pause', onSangiPause);
    window.removeEventListener('sangi:resume', onSangiResume);
    window.removeEventListener('sangi:mute', onSangiMute);
    window.removeEventListener('sangi:reset', resetAll);
    window.removeEventListener('sangi:quality', onSangiQuality);
    window.removeEventListener('sangi:dispose', cleanup);
    window.removeEventListener('pagehide', onPageHide);

    audio.dispose();
    orbit.dispose();
    fireflies.dispose();
    stream.dispose();
    world.dispose();
    mats.dispose();
    nightEnvRT.dispose();
    renderer.dispose();
  }

  function onSangiPause() { sangiPaused = true; togglePause(true); }
  function onSangiResume() { sangiPaused = false; togglePause(false); }
  function onSangiMute(e) {
    state.muted = Boolean(e && e.detail ? e.detail.muted : true);
    audio.setMuted(state.muted);
    ui.renderDockSubpanel();
  }
  function onSangiQuality(e) {
    const q = e && e.detail && e.detail.quality;
    if (q) { state.qualityMode = q; applyQualityProfile(q); }
  }
  function onPageHide(e) { if (!e.persisted) cleanup(); }

  canvas.addEventListener('webglcontextlost', onContextLost);
  canvas.addEventListener('webglcontextrestored', onContextRestored);
  document.addEventListener('visibilitychange', onVisibilityChange);
  window.addEventListener('sangi:pause', onSangiPause);
  window.addEventListener('sangi:resume', onSangiResume);
  window.addEventListener('sangi:mute', onSangiMute);
  window.addEventListener('sangi:reset', resetAll);
  window.addEventListener('sangi:quality', onSangiQuality);
  window.addEventListener('sangi:dispose', cleanup);
  window.addEventListener('pagehide', onPageHide);

  // Expõe leitura para diagnósticos e smoke tests automatizados
  Object.assign(window, {
    renderer,
    scene,
    __VALE_STATE__: state,
    __VALE_RENDER__: renderOnce,
    __VALE_CAPTURE__: capturePhoto,
  });
})();
