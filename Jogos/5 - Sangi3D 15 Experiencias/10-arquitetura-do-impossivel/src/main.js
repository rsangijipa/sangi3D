import * as THREE from '../../../../Sistema/shared/vendor/three.module.js';
import { createStudioEnvironment } from '../../../../Sistema/shared/engine/studio-environment.js';
import { CONFIG, ROOMS } from './config.js';
import { createMaterialLibrary } from './textures.js';
import { createMuseumAudio } from './audio.js';
import { createPhysicsWorld, GRAVITY_ZONES } from './physics.js';
import { createMuseumWorld } from './world.js';
import {
  clearSavedState,
  defaultSavedState,
  loadSavedState,
  persistState,
  validateState,
} from './storage.js';

(function boot() {
  const $ = id => document.getElementById(id);
  const canvas = $('view');
  const viewWrap = $('viewportWrap');
  const sceneMsg = $('scene-message');
  const fadeEl = $('transitionFade');
  const statusEl = $('status');
  const bridgeReadout = $('bridgeReadout');
  const progressReadout = $('progressReadout');
  const backendEl = $('backend');
  const hudRoom = $('hudRoom');
  const hudGravity = $('hudGravity');
  const ctxInteract = $('ctxInteract');

  const saved = loadSavedState();
  const reducedQuery = matchMedia('(prefers-reduced-motion: reduce)');
  let paused = false;
  let disposed = false;
  let contextLost = false;
  let rafId = 0;
  let lastTime;
  let stepCarry = 0;
  let dprScale = 1;
  let perfAccum = 0;
  let perfFrames = 0;
  let initialized = false;

  const settings = {
    quality: saved.quality || (innerWidth <= 760 ? 'LOW' : 'BALANCED'),
    fov: saved.fov || CONFIG.defaultFov,
    smoothTransitions: saved.smoothTransitions !== false,
    reducedMotion: Boolean(saved.reducedMotion || reducedQuery.matches),
    volumeMaster: saved.volumeMaster ?? 0.8,
  };

  let renderer;
  let studioEnv = null;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.06;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.shadowMap.autoUpdate = false;
    renderer.shadowMap.needsUpdate = true;
  } catch {
    sceneMsg.hidden = false;
    sceneMsg.textContent = 'WebGL 2 indisponível neste dispositivo. Ative aceleração gráfica e recarregue.';
    return;
  }

  const scene = new THREE.Scene();
  studioEnv = createStudioEnvironment(renderer);
  scene.environment = studioEnv.texture;
  scene.environmentIntensity = 0.56;

  const camera = new THREE.PerspectiveCamera(settings.fov, 1, 0.08, 160);
  const mats = createMaterialLibrary();
  const audio = createMuseumAudio();
  const visitedRooms = new Set(saved.visitedRooms || ['hub']);
  const discoveries = new Set(saved.discoveries || []);

  function say(msg) {
    statusEl.textContent = msg;
  }

  function flashTransition() {
    fadeEl.classList.add('active');
    setTimeout(() => {
      if (!disposed) fadeEl.classList.remove('active');
    }, 220);
  }

  const physics = createPhysicsWorld({
    isSmooth: () => settings.smoothTransitions && !settings.reducedMotion,
    onMessage: msg => say(msg),
    onSafeReset: msg => {
      flashTransition();
      say(msg);
    },
    onRotate: deg => {
      audio.playStoneMechanism();
      renderer.shadowMap.needsUpdate = true;
      say(`Estrutura girada ${deg}°. Mesmo eixo, nova perspectiva.`);
    },
    onBridgeAligned: () => {
      audio.playChime([523.25, 659.25, 783.99]);
      discoveries.add('ponte');
      renderer.shadowMap.needsUpdate = true;
      say('Passagem alinhada. Avance para testar a travessia.');
    },
    onBridgeCrossed: () => {
      audio.playChime([659.25, 783.99, 1046.5]);
      discoveries.add('ponte');
      say('Travessia concluída. O portal em frente leva ao Corredor de Portais.');
    },
    onGalleryAligned: () => {
      audio.playChime([493.88, 659.25, 987.77]);
      discoveries.add('galeria');
      say('Perspectiva da Galeria alinhada! A rampa elevada foi conectada.');
    },
    onMirrorInspected: () => {
      audio.playChime([587.33, 739.99, 1174.66]);
      discoveries.add('espelhos');
      say('Selo da Percepção revelado nos espelhos. Vista panorâmica desbloqueada!');
    },
    onPanoramicToggle: active => {
      say(active ? 'Vista panorâmica do museu ativa. Pressione Vista panorâmica novamente para voltar.' : 'Retorno à câmera em primeira pessoa.');
    },
    onPortal: portal => {
      audio.playPortal();
      discoveries.add('portais');
      say(`Portal atravessado: ${portal.label}. Orientação preservada.`);
    },
    onGravityChange: zone => {
      audio.playGravityShift();
      discoveries.add('gravidade');
      say(`Gravidade alterada: ${zone.label}.`);
    },
    onTransitionFade: flashTransition,
    onFootstep: isStair => audio.playStep(isStair),
    onRoomChange: roomId => {
      visitedRooms.add(roomId);
      audio.setRoom(roomId);
      const info = ROOMS.find(r => r.id === roomId);
      if (info) hudRoom.innerHTML = `Sala: <strong>${info.shortName}</strong>`;
    },
  });

  // Restore saved milestone state while preserving default safe spawn
  physics.state.bridgePosition = saved.bridgePosition ?? 1;
  physics.state.bridgeYawGoal = (physics.state.bridgePosition * Math.PI) / 2;
  physics.state.bridgeYawVisual = physics.state.bridgeYawGoal;
  physics.state.bridgeAligned = Boolean(saved.bridgeAligned);
  physics.state.bridgeCrossed = Boolean(saved.bridgeCrossed);
  physics.state.galleryPosition = saved.galleryPosition ?? 1;
  physics.state.galleryYawGoal = (physics.state.galleryPosition * Math.PI) / 2;
  physics.state.galleryYawVisual = physics.state.galleryYawGoal;
  physics.state.galleryAligned = Boolean(saved.galleryAligned);
  physics.state.mirrorInspected = Boolean(saved.mirrorInspected);
  physics.state.panoramicUnlocked = Boolean(saved.panoramicUnlocked);

  const world = createMuseumWorld(scene, mats, physics);

  // Build Room Map buttons
  const roomList = $('roomList');
  const roomButtons = new Map();
  for (const room of ROOMS) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'room-btn';
    btn.innerHTML = `<span>${room.shortName}</span><span class="room-tag">Ir</span>`;
    btn.addEventListener('click', () => {
      flashTransition();
      physics.place(room.spawn.pos, room.spawn.yaw, room.spawn.pitch, room.spawn.gravityId, room.id);
      say(`${room.name}: ${room.rule}`);
    });
    roomList.append(btn);
    roomButtons.set(room.id, btn);
  }

  // Quality & Resize
  function applyQuality(nextTier) {
    const tier = CONFIG.qualityProfiles[nextTier] ? nextTier : 'BALANCED';
    settings.quality = tier;
    $('quality').value = tier;
    const profile = CONFIG.qualityProfiles[tier];
    dprScale = 1;
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, profile.maxDpr));
    renderer.shadowMap.enabled = profile.shadows;
    renderer.shadowMap.needsUpdate = true;
    world.applyQualityTier(profile);
    resize();
  }

  function resize() {
    if (disposed) return;
    const w = Math.max(1, viewWrap.clientWidth);
    const h = Math.max(1, viewWrap.clientHeight);
    camera.aspect = w / h;
    const baseFov = settings.fov;
    camera.fov = camera.aspect < 1 ? Math.min(82, baseFov / Math.sqrt(camera.aspect)) : baseFov;
    camera.updateProjectionMatrix();
    const profile = CONFIG.qualityProfiles[settings.quality];
    const targetDpr = Math.max(0.7, Math.min(devicePixelRatio || 1, profile.maxDpr) * dprScale);
    renderer.setPixelRatio(targetDpr);
    renderer.setSize(w, h, false);
    if (initialized && !paused && !contextLost) {
      physics.syncCamera(camera);
      renderer.render(scene, camera);
    }
  }

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(viewWrap);

  // Input Handling (Keyboard, Drag Look, D-Pad, Virtual Joystick)
  const keys = new Set();
  const heldMoves = new Set();
  const pointers = new Map();
  let stickVec = [0, 0];

  const signals = new AbortController();
  const on = (target, ev, fn, opts = {}) =>
    target.addEventListener(ev, fn, { ...opts, signal: signals.signal });

  on(canvas, 'contextmenu', e => e.preventDefault());
  on(canvas, 'pointerdown', e => {
    canvas.focus({ preventScroll: true });
    canvas.setPointerCapture(e.pointerId);
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
  });
  on(canvas, 'pointermove', e => {
    const prev = pointers.get(e.pointerId);
    if (!prev || paused) return;
    physics.lookDelta(e.clientX - prev.x, e.clientY - prev.y);
    prev.x = e.clientX;
    prev.y = e.clientY;
  });
  const clearPointer = e => pointers.delete(e.pointerId);
  on(canvas, 'pointerup', clearPointer);
  on(canvas, 'pointercancel', clearPointer);
  on(canvas, 'lostpointercapture', clearPointer);

  // Virtual touch joystick
  const touchStick = $('touchStick');
  const touchKnob = $('touchKnob');
  function updateStick(e) {
    const r = touchStick.getBoundingClientRect();
    const rx = (e.clientX - r.left - r.width * 0.5) / (r.width * 0.36);
    const ry = (e.clientY - r.top - r.height * 0.5) / (r.height * 0.36);
    const len = Math.max(1, Math.hypot(rx, ry));
    stickVec = [rx / len, ry / len];
    touchKnob.style.transform = `translate(${stickVec[0] * 24}px, ${stickVec[1] * 24}px)`;
  }
  on(touchStick, 'pointerdown', e => {
    touchStick.setPointerCapture(e.pointerId);
    updateStick(e);
  });
  on(touchStick, 'pointermove', e => {
    if (touchStick.hasPointerCapture(e.pointerId)) updateStick(e);
  });
  const releaseStick = () => {
    stickVec = [0, 0];
    touchKnob.style.transform = 'none';
  };
  on(touchStick, 'pointerup', releaseStick);
  on(touchStick, 'pointercancel', releaseStick);
  on(touchStick, 'lostpointercapture', releaseStick);

  // Panel D-pad buttons
  for (const btn of document.querySelectorAll('[data-move]')) {
    const k = btn.dataset.move;
    on(btn, 'pointerdown', e => {
      heldMoves.add(k);
      btn.setPointerCapture(e.pointerId);
    });
    const rel = () => heldMoves.delete(k);
    on(btn, 'pointerup', rel);
    on(btn, 'pointercancel', rel);
    on(btn, 'lostpointercapture', rel);
    on(btn, 'click', () => {
      const f = (k === 'w' ? 1 : 0) - (k === 's' ? 1 : 0);
      const r = (k === 'd' ? 1 : 0) - (k === 'a' ? 1 : 0);
      physics.moveLocal(f, r, 0.14, settings.smoothTransitions && !settings.reducedMotion);
    });
  }

  on(window, 'keydown', e => {
    if (e.altKey || e.ctrlKey || e.metaKey || e.target?.closest?.('input,select,textarea,button,dialog')) return;
    const k = e.key.toLowerCase();
    if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' '].includes(k)) e.preventDefault();
    keys.add(k);
    if (!e.repeat) {
      if (k === 'e') triggerContextAction();
      else if (k === 'p') setPaused(!paused);
      else if (k === 'r') physics.resetRoom(physics.state.roomId);
    }
  });
  on(window, 'keyup', e => keys.delete(e.key.toLowerCase()));
  on(window, 'blur', () => {
    keys.clear();
    heldMoves.clear();
    pointers.clear();
    releaseStick();
  });

  // UI Actions
  function triggerContextAction() {
    const cand = physics.getContextualCandidate();
    if (cand) cand.action();
  }

  function setPaused(next) {
    paused = Boolean(next);
    $('pause').textContent = paused ? 'Continuar' : 'Pausar';
    $('pause').setAttribute('aria-pressed', String(paused));
    keys.clear();
    heldMoves.clear();
    pointers.clear();
    stepCarry = 0;
    audio.setPause(paused);
    say(paused ? 'Simulação em pausa.' : 'Simulação retomada.');
  }

  function setMuted(nextMuted) {
    audio.setMuted(nextMuted);
    const isMuted = audio.isMuted();
    $('sound').textContent = isMuted ? 'Ativar som' : 'Silenciar';
    $('sound').setAttribute('aria-pressed', String(!isMuted));
  }

  on($('pause'), 'click', () => setPaused(!paused));
  on($('sound'), 'click', () => {
    try {
      if (audio.isMuted()) {
        audio.enable();
        setMuted(false);
        say('Áudio espacial do museu ativo.');
      } else {
        setMuted(true);
        say('Áudio silenciado.');
      }
    } catch (err) {
      say(err.message || 'Áudio indisponível.');
    }
  });
  on($('photo'), 'click', () => {
    physics.syncCamera(camera);
    renderer.render(scene, camera);
    canvas.toBlob(blob => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${CONFIG.slug}.png`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 2500);
    }, 'image/png');
  });
  on($('reset'), 'click', () => {
    physics.resetRoom(physics.state.roomId);
    say('Sala restaurada ao ponto inicial sem perder seu progresso.');
  });
  on($('quality'), 'change', e => applyQuality(e.target.value));
  on($('motion'), 'click', () => {
    settings.reducedMotion = !settings.reducedMotion;
    $('motion').setAttribute('aria-pressed', String(settings.reducedMotion));
    say(settings.reducedMotion ? 'Movimento reduzido ativo: transições por fade.' : 'Movimento reduzido desativado.');
  });
  $('motion').setAttribute('aria-pressed', String(settings.reducedMotion));

  on($('btnObserve'), 'click', () => {
    if (physics.state.roomId === 'galeria') {
      physics.place([CONFIG.galleryObservationPoint.x, 1.65, CONFIG.galleryObservationPoint.z], 0, -0.05, 'floor', 'galeria');
      say('Ponto azul da Galeria. Gire 90° e alinhe os degraus suspensos.');
    } else {
      physics.place([CONFIG.observationPoint.x, 1.65, CONFIG.observationPoint.z], 0, -0.04, 'floor', 'ponte');
      say('Gire a seção móvel em 90° e alinhe a ponte a partir deste ponto.');
    }
  });
  on($('btnRotate'), 'click', () => physics.rotateMechanism());
  on($('btnAlignBridge'), 'click', () => {
    if (physics.state.roomId === 'galeria') physics.alignGallery();
    else physics.alignBridge();
  });
  on($('btnPanorama'), 'click', () => physics.togglePanoramic());
  on($('btnSafe'), 'click', () => physics.restoreSafePoint('Retorno imediato ao último ponto seguro.'));
  on(ctxInteract, 'click', triggerContextAction);

  on($('fovRange'), 'input', e => {
    settings.fov = Number(e.target.value);
    $('fovVal').textContent = `${settings.fov}°`;
    resize();
  });
  on($('volRange'), 'input', e => {
    settings.volumeMaster = Number(e.target.value);
    $('volVal').textContent = `${Math.round(settings.volumeMaster * 100)}%`;
    audio.setVolumes({ master: settings.volumeMaster });
  });
  on($('btnTransitionMode'), 'click', () => {
    settings.smoothTransitions = !settings.smoothTransitions;
    $('btnTransitionMode').setAttribute('aria-pressed', String(settings.smoothTransitions));
    $('btnTransitionMode').textContent = settings.smoothTransitions ? 'Transição suave' : 'Transição por fade';
  });

  function snapshotPayload() {
    return {
      schemaVersion: CONFIG.schemaVersion,
      fov: settings.fov,
      quality: settings.quality,
      smoothTransitions: settings.smoothTransitions,
      reducedMotion: settings.reducedMotion,
      volumeMaster: settings.volumeMaster,
      visitedRooms: [...visitedRooms],
      discoveries: [...discoveries],
      bridgePosition: physics.state.bridgePosition,
      bridgeAligned: physics.state.bridgeAligned,
      bridgeCrossed: physics.state.bridgeCrossed,
      galleryPosition: physics.state.galleryPosition,
      galleryAligned: physics.state.galleryAligned,
      mirrorInspected: physics.state.mirrorInspected,
      panoramicUnlocked: physics.state.panoramicUnlocked,
      roomId: physics.state.roomId,
    };
  }

  on($('btnSaveLocal'), 'click', () => {
    say(persistState(snapshotPayload()) ? 'Progresso e ajustes salvos localmente.' : 'Falha ao salvar no armazenamento local.');
  });
  on($('btnExportJson'), 'click', () => {
    const blob = new Blob([JSON.stringify(snapshotPayload(), null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${CONFIG.slug}-estado.json`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 2500);
    say('Estado exportado em JSON.');
  });
  on($('btnImportJson'), 'click', () => $('importFile').click());
  on($('importFile'), 'change', async e => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file || file.size > 1_000_000) return;
    try {
      const parsed = validateState(JSON.parse(await file.text()));
      settings.fov = parsed.fov;
      $('fovRange').value = String(parsed.fov);
      $('fovVal').textContent = `${parsed.fov}°`;
      applyQuality(parsed.quality);
      visitedRooms.clear();
      parsed.visitedRooms.forEach(r => visitedRooms.add(r));
      discoveries.clear();
      parsed.discoveries.forEach(d => discoveries.add(d));
      physics.state.bridgePosition = parsed.bridgePosition;
      physics.state.bridgeYawGoal = (parsed.bridgePosition * Math.PI) / 2;
      physics.state.bridgeYawVisual = physics.state.bridgeYawGoal;
      physics.state.bridgeAligned = parsed.bridgeAligned;
      physics.state.bridgeCrossed = parsed.bridgeCrossed;
      physics.state.galleryPosition = parsed.galleryPosition;
      physics.state.galleryYawGoal = (parsed.galleryPosition * Math.PI) / 2;
      physics.state.galleryYawVisual = physics.state.galleryYawGoal;
      physics.state.galleryAligned = parsed.galleryAligned;
      physics.state.mirrorInspected = parsed.mirrorInspected;
      physics.state.panoramicUnlocked = parsed.panoramicUnlocked;
      say('Estado JSON importado com sucesso.');
    } catch (err) {
      say(err.message || 'Não foi possível importar este arquivo JSON.');
    }
  });
  on($('btnClearLocal'), 'click', () => {
    clearSavedState();
    visitedRooms.clear();
    visitedRooms.add('hub');
    discoveries.clear();
    physics.resetRoom('hub');
    say('Dados locais limpos e museu restaurado.');
  });

  on($('helpBtn'), 'click', () => $('helpDialog').showModal());
  on($('closeHelp'), 'click', () => $('helpDialog').close());

  // WebGL Context Loss & Restoration
  on(canvas, 'webglcontextlost', e => {
    e.preventDefault();
    contextLost = true;
    sceneMsg.hidden = false;
    sceneMsg.textContent = 'Contexto WebGL interrompido. Aguarde a restauração ou recarregue.';
  });
  on(canvas, 'webglcontextrestored', () => {
    contextLost = false;
    sceneMsg.hidden = true;
  });

  function updateHud() {
    const st = physics.state;
    const cand = physics.getContextualCandidate();
    const label = cand ? `${cand.label} (E)` : 'Aproxime-se de um ponto';
    if (ctxInteract.textContent !== label) ctxInteract.textContent = label;
    ctxInteract.disabled = !cand;

    // Exact readout string preserved for qa.cjs compatibility!
    let bText = 'Passagem fechada';
    if (st.bridgeCrossed) bText = 'Travessia concluída';
    else if (st.bridgeAligned) bText = 'Passagem aberta';
    if (bridgeReadout.textContent !== bText) bridgeReadout.textContent = bText;

    const pText = `Salas visitadas: ${visitedRooms.size} / ${ROOMS.length} · Marcos: ${discoveries.size} / 5`;
    if (progressReadout.textContent !== pText) progressReadout.textContent = pText;

    const gravZone = GRAVITY_ZONES[st.gravityId];
    if (gravZone) hudGravity.innerHTML = `Gravidade: <strong>${gravZone.label.split(' ')[1] || 'Normal'}</strong>`;

    // Update stepper: Observar (0) -> Alinhar (1) -> Atravessar (2)
    const stepNodes = document.querySelectorAll('#bridgeSteps li');
    const nearObs = Math.hypot(st.pos.x - CONFIG.observationPoint.x, st.pos.z - CONFIG.observationPoint.z) < 1.3;
    const activeIdx = st.bridgeCrossed ? 3 : st.bridgeAligned ? 2 : nearObs ? 1 : 0;
    stepNodes.forEach((li, i) => {
      li.classList.toggle('done', i < activeIdx);
      if (i === activeIdx) li.setAttribute('aria-current', 'step');
      else li.removeAttribute('aria-current');
    });

    for (const [id, btn] of roomButtons) {
      const tag = btn.querySelector('.room-tag');
      if (tag) tag.textContent = id === st.roomId ? 'Atual' : visitedRooms.has(id) ? '✓' : 'Ir';
    }
  }

  function dispose() {
    if (disposed) return;
    disposed = true;
    cancelAnimationFrame(rafId);
    resizeObserver.disconnect();
    signals.abort();
    audio.dispose();
    world.dispose();
    mats.dispose();
    studioEnv?.dispose();
    try { renderer.dispose(); } catch {}
  }

  on(window, 'sangi:pause', () => setPaused(true));
  on(window, 'sangi:resume', () => setPaused(false));
  on(window, 'sangi:mute', e => setMuted(Boolean(e.detail?.muted)));
  on(window, 'sangi:reset', () => physics.resetRoom('hub'));
  on(window, 'sangi:quality', e => applyQuality(e.detail?.quality));
  on(window, 'sangi:dispose', dispose);
  on(window, 'pagehide', e => {
    if (!e.persisted) dispose();
  });
  on(window, 'beforeunload', dispose);

  window.__SANGI_QA__ = {
    get stats() {
      return {
        room: physics.state.roomId,
        gravity: physics.state.gravityId,
        bridgeAligned: physics.state.bridgeAligned,
        bridgeCrossed: physics.state.bridgeCrossed,
        draws: renderer.info.render.calls,
        tris: renderer.info.render.triangles,
        disposed,
      };
    },
    pause: () => setPaused(true),
    resume: () => setPaused(false),
    dispose,
  };

  initialized = true;
  applyQuality(settings.quality);
  world.updateVisuals(0, settings.reducedMotion);
  physics.syncCamera(camera);
  world.renderPortalsAndMirrors(renderer, camera, CONFIG.qualityProfiles[settings.quality]);
  renderer.render(scene, camera);
  updateHud();
  sceneMsg.hidden = true;
  document.documentElement.dataset.ready = 'true';
  backendEl.textContent = `Three.js r${THREE.REVISION} · WebGL 2`;
  window.SangiBridge?.notifyReady({ title: CONFIG.title });

  let lastFpsShown = 0;
  function frame(now) {
    if (disposed) return;
    const rawDt = lastTime === undefined ? 0.016 : (now - lastTime) / 1000;
    const dt = Math.min(CONFIG.maxFrameDt, Math.max(0, rawDt));
    lastTime = now;

    if (!paused && !contextLost) {
      const pressed = (...cands) => Number(cands.some(k => keys.has(k) || heldMoves.has(k)));
      const fwd = pressed('w', 'arrowup') - pressed('s', 'arrowdown') - stickVec[1];
      const str = pressed('d', 'arrowright') - pressed('a', 'arrowleft') + stickVec[0];
      if (Math.abs(fwd) > 0.05 || Math.abs(str) > 0.05) {
        physics.moveLocal(fwd, str, dt, settings.smoothTransitions && !settings.reducedMotion);
      }

      stepCarry += dt;
      let steps = 0;
      while (stepCarry >= CONFIG.fixedDt && steps++ < CONFIG.maxSubsteps) {
        physics.step(CONFIG.fixedDt, settings.reducedMotion);
        stepCarry -= CONFIG.fixedDt;
      }

      world.updateVisuals(now * 0.001, settings.reducedMotion);
      physics.syncCamera(camera);

      if (physics.state.bridgeRotating || physics.state.galleryRotating || perfFrames % 30 === 0) {
        renderer.shadowMap.needsUpdate = true;
      }

      const profile = CONFIG.qualityProfiles[settings.quality];
      world.renderPortalsAndMirrors(renderer, camera, profile);
      renderer.render(scene, camera);

      // Adaptive DPR hysteresis & readout
      perfAccum += rawDt;
      perfFrames += 1;
      if (perfAccum >= 1.5) {
        const fps = perfFrames / perfAccum;
        if (fps < 27 && dprScale > 0.72) {
          dprScale = Math.max(0.72, dprScale - 0.14);
          resize();
        } else if (fps > 53 && dprScale < 1) {
          dprScale = Math.min(1, dprScale + 0.06);
          resize();
        }
        if (now - lastFpsShown > 1400) {
          lastFpsShown = now;
          backendEl.textContent = `Three.js r${THREE.REVISION} · WebGL 2 · ${Math.round(fps)} fps · ${renderer.info.render.calls} draws`;
        }
        perfAccum = 0;
        perfFrames = 0;
      }
      updateHud();
    }

    rafId = requestAnimationFrame(frame);
  }

  rafId = requestAnimationFrame(frame);
})();
