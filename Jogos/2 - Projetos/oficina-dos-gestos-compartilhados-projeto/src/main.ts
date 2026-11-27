import * as THREE from 'three';
import { AtelierAudioEngine } from './core/audio';
import {
  MODE_META,
  SessionStore,
  STATION_META,
  THERAPEUTIC_PROMPTS,
  TOOLS_BY_STATION
} from './core/state';
import { PIGMENT_COLORS } from './core/textures';
import { buildAtelierEnvironment } from './scene/atelierEnvironment';
import { createClayStation } from './stations/clayStation';
import { createPaintStation } from './stations/paintStation';
import { createRhythmStation } from './stations/rhythmStation';
import { createRibbonsStation } from './stations/ribbonsStation';
import { createSandStation } from './stations/sandStation';
import { ExperienceMode, QualityPreset, StationId } from './types';

export function initOficinaApp(): void {
  const container = document.getElementById('canvas-container');
  if (!container) return;

  const store = new SessionStore();
  const audio = new AtelierAudioEngine();

  // Renderer & Scene
  const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.08;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#E8D7BC');
  scene.fog = new THREE.FogExp2('#E8D7BC', 0.024);

  const camera = new THREE.PerspectiveCamera(44, window.innerWidth / window.innerHeight, 0.1, 45);
  const camTarget = new THREE.Vector3(0, 1.05, 0.65);
  const desiredCamPos = new THREE.Vector3(0, 2.38, 3.05);
  const desiredCamTarget = new THREE.Vector3(0, 1.02, 0.72);
  camera.position.copy(desiredCamPos);
  camera.lookAt(camTarget);

  // Build Environment & 5 Interactive Stations
  const env = buildAtelierEnvironment(scene);
  const paintStation = createPaintStation(scene);
  const clayStation = createClayStation(scene);
  const sandStation = createSandStation(scene);
  const ribbonsStation = createRibbonsStation(scene);
  const rhythmStation = createRhythmStation(scene);

  // Visual Demonstration Guide Ring (for Imitação / Complete meu gesto)
  const guideMesh = new THREE.Mesh(
    new THREE.RingGeometry(0.05, 0.075, 28),
    new THREE.MeshBasicMaterial({ color: '#D3AC57', transparent: true, opacity: 0.85, side: THREE.DoubleSide })
  );
  guideMesh.visible = false;
  scene.add(guideMesh);

  const applyQuality = (q: QualityPreset) => {
    const isMobile = window.innerWidth < 768;
    const baseDpr = window.devicePixelRatio || 1;
    const dpr = q === 'cinema' ? Math.min(2, baseDpr) : q === 'equilibrada' ? Math.min(1.5, baseDpr) : 1;
    renderer.setPixelRatio(isMobile && q !== 'cinema' ? Math.min(1.25, dpr) : dpr);
    renderer.setSize(window.innerWidth, window.innerHeight);
    env.setQuality(q);
  };

  const updateCameraTargetForStation = (station: StationId) => {
    const preset = store.state.cameraPreset;
    const isMobile = window.innerWidth < 768;
    const distBoost = isMobile ? 0.55 : 0;

    if (preset === 'visao_geral') {
      desiredCamPos.set(0, 2.75, 4.45 + distBoost);
      desiredCamTarget.set(0, 1.15, -0.5);
      return;
    }

    const map: Record<StationId, { pos: THREE.Vector3; tgt: THREE.Vector3 }> = {
      pintura: { pos: paintStation.cameraPosition, tgt: paintStation.cameraTarget },
      argila: { pos: clayStation.cameraPosition, tgt: clayStation.cameraTarget },
      areia: { pos: sandStation.cameraPosition, tgt: sandStation.cameraTarget },
      fitas: { pos: ribbonsStation.cameraPosition, tgt: ribbonsStation.cameraTarget },
      ritmo: { pos: rhythmStation.cameraPosition, tgt: rhythmStation.cameraTarget }
    };

    const chosen = map[station];
    desiredCamPos.copy(chosen.pos);
    desiredCamTarget.copy(chosen.tgt);

    if (preset === 'topo') {
      desiredCamPos.set(chosen.tgt.x, chosen.tgt.y + 1.85 + distBoost, chosen.tgt.z + 0.55);
    } else if (isMobile) {
      desiredCamPos.z += distBoost;
    }
  };

  // Raycaster & Pointer Interaction
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  let isPointerDown = false;
  let prevUv: THREE.Vector2 | null = null;
  let lastWorldPt: THREE.Vector3 | null = null;

  const setPointerNDC = (clientX: number, clientY: number) => {
    pointer.x = (clientX / window.innerWidth) * 2 - 1;
    pointer.y = -(clientY / window.innerHeight) * 2 + 1;
  };

  const interactAt = (clientX: number, clientY: number, phase: 'start' | 'move' | 'end') => {
    setPointerNDC(clientX, clientY);
    raycaster.setFromCamera(pointer, camera);

    const st = store.state.activeStation;
    const toolId = store.state.activeToolByStation[st];
    const part = store.state.activeParticipant;
    const mirror = store.state.mirrorEnabled || store.state.activeMode === 'espelhamento';

    if (st === 'pintura') {
      // Check pigment bowl click on start
      if (phase === 'start') {
        const bowlHits = raycaster.intersectObjects(paintStation.pigmentBowls, false);
        if (bowlHits.length > 0) {
          const idx = bowlHits[0].object.userData.pigmentIndex as number;
          if (idx < store.state.aba.materialsCount) {
            store.state.activeColorIndex = idx;
            paintStation.setActiveColor(idx);
            audio.playInstrument('wood_tap', idx, 0.5);
            store.emit();
            return;
          }
        }
      }
      const hits = raycaster.intersectObject(paintStation.canvasMesh, false);
      if (hits.length > 0 && hits[0].uv) {
        const colHex = PIGMENT_COLORS[store.state.activeColorIndex]?.hex ?? '#315E67';
        paintStation.handlePointer(hits[0].uv, prevUv, phase, toolId, colHex, part, mirror);
        if (phase === 'move') audio.playFriction('paint', 0.65);
        prevUv = hits[0].uv.clone();
        if (phase === 'end') store.recordAction(`Pintura (${toolId})`);
      }
    } else if (st === 'argila') {
      const hits = raycaster.intersectObject(clayStation.clayMesh, false);
      if (hits.length > 0 && hits[0].uv) {
        clayStation.handlePointer(hits[0].uv, prevUv, phase, toolId, part, mirror);
        if (phase === 'move') audio.playFriction('clay', 0.7);
        prevUv = hits[0].uv.clone();
        if (phase === 'end') store.recordAction(`Argila (${toolId})`);
      }
    } else if (st === 'areia') {
      const hits = raycaster.intersectObject(sandStation.sandMesh, false);
      if (hits.length > 0 && hits[0].uv) {
        sandStation.handlePointer(hits[0].uv, prevUv, phase, toolId, part, mirror);
        if (phase === 'move') audio.playFriction('sand', 0.75);
        prevUv = hits[0].uv.clone();
        if (phase === 'end') store.recordAction(`Areia (${toolId})`);
      }
    } else if (st === 'fitas') {
      const hits = raycaster.intersectObject(ribbonsStation.hitPlane, false);
      if (hits.length > 0) {
        const pt = hits[0].point;
        const vel = lastWorldPt ? pt.clone().sub(lastWorldPt) : new THREE.Vector3(0.05, 0.02, 0);
        ribbonsStation.applyGesture(pt, vel, toolId, mirror);
        if (phase === 'move') audio.playFriction('ribbon', Math.min(1.2, vel.length() * 8));
        lastWorldPt = pt.clone();
        if (phase === 'end') store.recordAction(`Fitas (${toolId})`);
      }
    } else if (st === 'ritmo' && phase === 'start') {
      const hits = raycaster.intersectObjects(rhythmStation.hitMeshes, false);
      if (hits.length > 0) {
        const res = rhythmStation.triggerMesh(hits[0].object as THREE.Mesh, audio);
        if (res) {
          store.recordAction(`Ritmo (${res.label})`);
        }
      }
    }

    if (phase === 'end') {
      prevUv = null;
      lastWorldPt = null;
    }
  };

  renderer.domElement.addEventListener('pointerdown', (e) => {
    audio.unlock();
    isPointerDown = true;
    interactAt(e.clientX, e.clientY, 'start');
  });

  window.addEventListener('pointermove', (e) => {
    if (!isPointerDown) return;
    interactAt(e.clientX, e.clientY, 'move');
  });

  window.addEventListener('pointerup', (e) => {
    if (!isPointerDown) return;
    isPointerDown = false;
    interactAt(e.clientX, e.clientY, 'end');
  });

  // UI Bindings
  const toastEl = document.getElementById('toast')!;
  const showToast = (msg: string) => {
    toastEl.textContent = msg;
    toastEl.classList.remove('hidden');
    window.setTimeout(() => toastEl.classList.add('hidden'), 2400);
  };

  const sidePanel = document.getElementById('side-panel')!;
  const togglePanelBtn = document.getElementById('btn-panel')!;
  togglePanelBtn.addEventListener('click', () => {
    sidePanel.classList.toggle('collapsed');
    togglePanelBtn.classList.toggle('active');
  });

  // Station dock
  document.querySelectorAll<HTMLButtonElement>('[data-station]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const st = btn.dataset.station as StationId;
      store.setStation(st);
      updateCameraTargetForStation(st);
    });
  });

  // Top action buttons
  document.getElementById('btn-camera')?.addEventListener('click', () => {
    const order: Array<'estacao' | 'topo' | 'visao_geral'> = ['estacao', 'topo', 'visao_geral'];
    const idx = (order.indexOf(store.state.cameraPreset) + 1) % order.length;
    store.state.cameraPreset = order[idx];
    updateCameraTargetForStation(store.state.activeStation);
    showToast(`Câmera: ${order[idx].replace('_', ' ')}`);
    store.emit();
  });

  document.getElementById('btn-mute')?.addEventListener('click', () => {
    store.state.muted = !store.state.muted;
    audio.setMuted(store.state.muted);
    store.emit();
  });

  document.getElementById('btn-quality')?.addEventListener('click', () => {
    const order: QualityPreset[] = ['equilibrada', 'cinema', 'leve'];
    const next = order[(order.indexOf(store.state.quality) + 1) % order.length];
    store.setQuality(next);
    applyQuality(next);
    showToast(`Qualidade: ${next}`);
  });

  const runUndo = () => {
    const st = store.state.activeStation;
    const ok = st === 'pintura' ? paintStation.undo() : st === 'argila' ? clayStation.undo() : st === 'areia' ? sandStation.undo() : false;
    showToast(ok ? 'Ação desfeita' : 'Nada para desfazer');
  };
  const runRedo = () => {
    const st = store.state.activeStation;
    const ok = st === 'pintura' ? paintStation.redo() : st === 'argila' ? clayStation.redo() : st === 'areia' ? sandStation.redo() : false;
    showToast(ok ? 'Ação refeita' : 'Nada para refazer');
  };

  document.getElementById('btn-undo')?.addEventListener('click', runUndo);
  document.getElementById('btn-redo')?.addEventListener('click', runRedo);

  document.getElementById('btn-save')?.addEventListener('click', () => {
    const ok = store.saveToStorage({ savedStation: store.state.activeStation });
    showToast(ok ? 'Criação salva localmente' : 'Não foi possível salvar');
  });

  document.getElementById('btn-export')?.addEventListener('click', () => {
    renderer.render(scene, camera);
    const dataUrl = renderer.domElement.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `oficina-gestos-${store.state.activeStation}.png`;
    a.click();
    showToast('Imagem PNG exportada');
  });

  // Clear Surface Modal
  const clearModal = document.getElementById('clear-modal')!;
  document.getElementById('btn-clear')?.addEventListener('click', () => clearModal.classList.remove('hidden'));
  document.getElementById('btn-clear-cancel')?.addEventListener('click', () => clearModal.classList.add('hidden'));
  document.getElementById('btn-clear-confirm')?.addEventListener('click', () => {
    const st = store.state.activeStation;
    if (st === 'pintura') paintStation.clear();
    else if (st === 'argila') clayStation.clear();
    else if (st === 'areia') sandStation.clear();
    else if (st === 'fitas') ribbonsStation.clear();
    else rhythmStation.clear();
    clearModal.classList.add('hidden');
    showToast(`Superfície de ${STATION_META[st].label} limpa`);
  });

  // Return to Catalog
  document.getElementById('btn-catalog')?.addEventListener('click', () => {
    const imersivo = (window as unknown as { Imersivo?: { returnToCatalog?: () => void } }).Imersivo;
    if (imersivo && typeof imersivo.returnToCatalog === 'function') {
      imersivo.returnToCatalog();
    }
    window.dispatchEvent(new CustomEvent('imersivo:return-catalog', { detail: { app: 'oficina-dos-gestos-compartilhados' } }));
    showToast('Retornando ao catálogo...');
  });

  // Turn switcher
  document.getElementById('btn-turn')?.addEventListener('click', () => {
    const next = store.toggleParticipant();
    showToast(`Vez de Participante ${next}`);
  });

  // Render UI state
  const renderUI = () => {
    const s = store.state;
    document.querySelectorAll<HTMLButtonElement>('[data-station]').forEach((b) => {
      b.classList.toggle('active', b.dataset.station === s.activeStation);
    });

    const muteBtn = document.getElementById('btn-mute');
    if (muteBtn) muteBtn.textContent = s.muted ? '🔇 Mudo' : '🔊 Áudio';
    const qBtn = document.getElementById('btn-quality');
    if (qBtn) qBtn.textContent = `✨ ${s.quality.charAt(0).toUpperCase() + s.quality.slice(1)}`;

    // Turn card
    const modeLabelEl = document.getElementById('hud-mode-label');
    if (modeLabelEl) modeLabelEl.textContent = MODE_META[s.activeMode].label;
    const turnBtn = document.getElementById('btn-turn');
    if (turnBtn) {
      turnBtn.textContent =
        s.activeMode === 'criacao_compartilhada' || s.activeMode === 'complete_meu_gesto'
          ? s.activeParticipant === 'A'
            ? '✋ Sua vez (A)'
            : '🤝 Vez de B'
          : `Participante ${s.activeParticipant}`;
      turnBtn.classList.toggle('participant-b', s.activeParticipant === 'B');
    }

    // Mode Banner
    const banner = document.getElementById('mode-banner')!;
    const bannerText = document.getElementById('mode-banner-text')!;
    if (s.activeMode === 'exploracao_livre') {
      banner.classList.add('hidden');
    } else if (s.activeMode === 'experimentacao_terapeutica') {
      banner.classList.remove('hidden');
      bannerText.textContent = `💭 ${THERAPEUTIC_PROMPTS[s.therapeuticPromptIndex % THERAPEUTIC_PROMPTS.length]}`;
    } else if (s.activeMode === 'imitacao') {
      banner.classList.remove('hidden');
      bannerText.textContent = `👀 Imitação (${s.aba.complexity}) — Etapa ${s.stepProgress + 1} de ${s.aba.stepsCount}`;
    } else {
      banner.classList.remove('hidden');
      bannerText.textContent = `${MODE_META[s.activeMode].label} — ${MODE_META[s.activeMode].desc}`;
    }

    // Tool & Color Subdock
    const subdock = document.getElementById('tool-subdock')!;
    subdock.innerHTML = '';
    const tools = TOOLS_BY_STATION[s.activeStation];
    tools.forEach((tool) => {
      const btn = document.createElement('button');
      btn.className = `tool-btn ${s.activeToolByStation[s.activeStation] === tool.id ? 'active' : ''}`;
      btn.textContent = `${tool.icon} ${tool.label}`;
      btn.title = tool.description;
      btn.addEventListener('click', () => {
        store.setTool(s.activeStation, tool.id);
        if (s.activeStation === 'ritmo' && tool.id === 'sequenciador') {
          rhythmStation.playDemoPattern(audio, s.stepProgress);
        }
      });
      subdock.appendChild(btn);
    });

    if (s.activeStation === 'pintura') {
      PIGMENT_COLORS.slice(0, s.aba.materialsCount).forEach((col, i) => {
        const sw = document.createElement('button');
        sw.className = `color-swatch ${s.activeColorIndex === i ? 'active' : ''}`;
        sw.style.backgroundColor = col.hex;
        sw.title = col.name;
        sw.addEventListener('click', () => {
          s.activeColorIndex = i;
          paintStation.setActiveColor(i);
          store.emit();
        });
        subdock.appendChild(sw);
      });
    }

    paintStation.setVisibleMaterialsCount(s.aba.materialsCount);
    ribbonsStation.setVisibleMaterialsCount(s.aba.materialsCount);

    // Mode buttons inside side panel
    document.querySelectorAll<HTMLButtonElement>('[data-mode]').forEach((b) => {
      b.classList.toggle('active', b.dataset.mode === s.activeMode);
    });

    // Observation log
    const obsList = document.getElementById('obs-log');
    if (obsList) {
      if (s.observations.length === 0) {
        obsList.textContent = 'Nenhum registro nesta sessão.';
      } else {
        obsList.innerHTML = s.observations
          .slice(-6)
          .reverse()
          .map((o) => `<div>• [${o.participant}] ${o.action} — <em>${o.responseType.replace('_', ' ')}</em></div>`)
          .join('');
      }
    }
  };

  // Populate Modes & ABA controls in Side Panel
  const modeGrid = document.getElementById('mode-grid')!;
  (Object.keys(MODE_META) as ExperienceMode[]).forEach((mKey) => {
    const btn = document.createElement('button');
    btn.className = 'mode-pill';
    btn.dataset.mode = mKey;
    btn.innerHTML = `<strong>${MODE_META[mKey].label}</strong><small>${MODE_META[mKey].desc}</small>`;
    btn.addEventListener('click', () => {
      store.setMode(mKey);
      if (mKey === 'experimentacao_terapeutica') {
        store.state.therapeuticPromptIndex = (store.state.therapeuticPromptIndex + 1) % THERAPEUTIC_PROMPTS.length;
        store.emit();
      }
    });
    modeGrid.appendChild(btn);
  });

  // ABA Inputs binding
  function bindInput(id: string, handler: (el: HTMLInputElement | HTMLSelectElement) => void): void {
    const el = document.getElementById(id) as HTMLInputElement | HTMLSelectElement | null;
    if (!el) return;
    el.addEventListener('change', () => {
      handler(el);
      store.emit();
    });
  };
  bindInput('aba-steps', (el) => {
    store.state.aba.stepsCount = Number(el.value);
  });
  bindInput('aba-complexity', (el) => {
    store.state.aba.complexity = el.value as 'simples' | 'moderado' | 'composto';
  });
  bindInput('aba-materials', (el) => {
    store.state.aba.materialsCount = Number(el.value);
  });
  bindInput('aba-cues', (el) => {
    store.state.aba.visualCues = (el as HTMLInputElement).checked;
  });
  bindInput('aba-nopressure', (el) => {
    store.state.aba.responseTimeNoPressure = (el as HTMLInputElement).checked;
  });
  bindInput('aba-turns', (el) => {
    store.state.aba.turnAlternation = (el as HTMLInputElement).checked;
  });
  bindInput('aba-record', (el) => {
    store.state.aba.recordObservations = (el as HTMLInputElement).checked;
  });
  bindInput('opt-reduced-motion', (el) => {
    store.state.reducedMotion = (el as HTMLInputElement).checked;
  });

  document.querySelectorAll<HTMLButtonElement>('[data-obs-type]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const rType = btn.dataset.obsType as 'independente' | 'com_ajuda' | 'pausa';
      const prev = store.state.aba.recordObservations;
      store.state.aba.recordObservations = true;
      store.recordAction(`Registro manual (${STATION_META[store.state.activeStation].label})`, rType);
      store.state.aba.recordObservations = prev;
      showToast(`Registrado: ${rType.replace('_', ' ')}`);
    });
  });

  document.getElementById('btn-export-json')?.addEventListener('click', () => {
    const blob = new Blob([JSON.stringify(store.state, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'oficina-gestos-sessao.json';
    a.click();
    URL.revokeObjectURL(url);
    showToast('Sessão JSON exportada');
  });

  // Keyboard Accessibility
  window.addEventListener('keydown', (e) => {
    if (e.key >= '1' && e.key <= '5') {
      const stations: StationId[] = ['pintura', 'argila', 'areia', 'fitas', 'ritmo'];
      const st = stations[Number(e.key) - 1];
      store.setStation(st);
      updateCameraTargetForStation(st);
    } else if (e.key === ' ') {
      e.preventDefault();
      store.toggleParticipant();
    } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
      e.preventDefault();
      runUndo();
    } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
      e.preventDefault();
      runRedo();
    } else if (e.key.toLowerCase() === 'r') {
      updateCameraTargetForStation(store.state.activeStation);
      showToast('Câmera recentrada');
    } else if (e.key.toLowerCase() === 'm') {
      store.state.muted = !store.state.muted;
      audio.setMuted(store.state.muted);
      store.emit();
    }
  });

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    applyQuality(store.state.quality);
  });

  store.subscribe(renderUI);
  applyQuality(store.state.quality);
  updateCameraTargetForStation(store.state.activeStation);
  renderUI();

  // Main Animation Loop
  let rafId = 0;
  const clock = new THREE.Clock();

  const animate = () => {
    rafId = requestAnimationFrame(animate);
    const t = clock.getElapsedTime();
    const reduced = store.state.reducedMotion;

    // Smooth camera interpolation
    const lerpFactor = reduced ? 0.25 : 0.08;
    camera.position.lerp(desiredCamPos, lerpFactor);
    camTarget.lerp(desiredCamTarget, lerpFactor);
    camera.lookAt(camTarget);

    // Visual Imitation Guide animation
    const showGuide = store.state.activeMode === 'imitacao' && store.state.aba.visualCues;
    guideMesh.visible = showGuide;
    if (showGuide) {
      const tgt = desiredCamTarget;
      guideMesh.position.set(tgt.x + Math.sin(t * 1.4) * 0.35, tgt.y + 0.18 + Math.cos(t * 1.4) * 0.12, tgt.z + 0.15);
      guideMesh.lookAt(camera.position);
    }

    env.update(t, reduced);
    ribbonsStation.update(t, reduced);
    rhythmStation.update(t, reduced);

    renderer.render(scene, camera);
  };
  animate();

  // Clean disposal hook
  window.addEventListener('beforeunload', () => {
    cancelAnimationFrame(rafId);
    env.dispose();
    paintStation.dispose();
    clayStation.dispose();
    sandStation.dispose();
    ribbonsStation.dispose();
    rhythmStation.dispose();
    audio.dispose();
    renderer.dispose();
  });
}

if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', () => initOficinaApp());
}
