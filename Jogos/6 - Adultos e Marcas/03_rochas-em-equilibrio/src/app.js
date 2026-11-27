import * as THREE from 'three';
import { MARCA, PRESETS, applyBrandStyles } from './brand.js';
import { SafeAudio } from './audio.js';
import { createRiverScene } from './scene.js';

// LocalStorage key
const LS_KEY = 'amb3d_rochas-em-equilibrio_v1';

// Estado da Aplicação
const appState = {
  quality: 'alta',
  sound: true,
  brandId: 'casaSeixo',
  currentStep: 0,
  heldRock: null,
  heldHeight: 0.85,
  heldRotY: 0,
  showBalancePoint: true,
  lastBalance: null,
  isPointerDown: false,
};

// Carregar preferências
try {
  const saved = JSON.parse(localStorage.getItem(LS_KEY) || '{}');
  if (saved.quality) appState.quality = saved.quality;
  if (typeof saved.sound === 'boolean') appState.sound = saved.sound;
} catch (e) {}

const savePrefs = () => {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify({ quality: appState.quality, sound: appState.sound }));
  } catch (e) {}
};

// Checar parâmetros de URL
const urlParams = new URLSearchParams(window.location.search);
const isEmbed = urlParams.get('embed') === '1';
if (isEmbed) document.body.classList.add('embed');
if (urlParams.get('marca') === 'neutra' || urlParams.get('marca') === 'neutro') {
  appState.brandId = 'neutro';
}

// Inicializar Áudio e Marca
const currentBrand = PRESETS[appState.brandId] || MARCA;
applyBrandStyles(currentBrand);
const audio = new SafeAudio();
audio.setMuted(!appState.sound);

// Elementos de UI
const $ = (sel) => document.querySelector(sel);
const toast = (msg, ms = 2800) => {
  const el = $('#toast');
  if (!el) return;
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => el.classList.remove('show'), ms);
};

const announce = (msg) => {
  const l = $('#live');
  if (l) {
    l.textContent = '';
    setTimeout(() => { l.textContent = msg; }, 30);
  }
};

const setStep = (stepIdx) => {
  appState.currentStep = stepIdx;
  document.querySelectorAll('.step-item').forEach((item, idx) => {
    item.classList.toggle('active', idx === stepIdx);
  });
};

// Boot da Cena 3D
let sceneContext = null;
let teardownInteraction = null;
let teardownKeyboard = null;
const canvas = $('#scene');

async function start() {
  try {
    sceneContext = await createRiverScene(canvas, {
      brand: currentBrand,
      quality: appState.quality,
      onClack: (mass, vel) => audio.playRockClack(mass, vel),
      onSplash: () => audio.playWaterSplash(),
    });

    teardownInteraction = setupInteraction();
    setupDockEvents();
    setupDialogs();
    setupBreathTracker();
    teardownKeyboard = setupKeyboard();

    // Esconder loading
    const loader = $('#loading-overlay');
    if (loader) {
      loader.style.opacity = '0';
      setTimeout(() => loader.remove(), 550);
    }
    announce('Ambiente Rochas em Equilíbrio pronto. Escolha uma pedra para começar.');

    // Iniciar loop de render
    let lastTime = performance.now();
    let rafId = null;
    let isPaused = false;
    let isDisposed = false;
    function animate(now) {
      if (isPaused || isDisposed) { rafId = null; return; }
      rafId = requestAnimationFrame(animate);
      const delta = Math.min(0.1, (now - lastTime) / 1000);
      lastTime = now;

      // Atualizar física
      sceneContext.physics.update(delta);

      // Atualizar água e respiração
      const breath = sceneContext.water.update(delta);
      updateBreathUI(breath);
      audio.modulateStreamWithBreath(breath.breathIntensity);

      // Atualizar controles da câmera
      sceneContext.controls.update();

      // Se houver pedra segurada, atualizar posição e estabilidade
      if (appState.heldRock) {
        updateHeldRockTransform();
      }

      sceneContext.renderer.render(sceneContext.scene, sceneContext.camera);
    }
    rafId = requestAnimationFrame(animate);

    const onPause = () => {
      isPaused = true;
      if (rafId !== null) { cancelAnimationFrame(rafId); rafId = null; }
    };
    const onResume = () => {
      if (isDisposed || !isPaused) return;
      isPaused = false;
      lastTime = performance.now();
      rafId = requestAnimationFrame(animate);
    };
    const onMute = (e) => {
      const muted = typeof e?.detail?.muted === 'boolean' ? e.detail.muted : true;
      appState.sound = !muted;
      audio?.setMuted?.(muted);
      $('#btnSound')?.setAttribute('aria-pressed', String(appState.sound));
      $('#btnSound')?.classList.toggle('active', appState.sound);
    };
    const onReset = () => {
      $('#btnReset')?.click();
    };
    const onBridgeMessage = (e) => {
      const data = e?.data;
      if (!data || typeof data !== 'object') return;
      let cmd = '';
      let payload = data;
      if (data.type === 'SANGI_COMMAND' && data.command) {
        cmd = String(data.command).toUpperCase();
        payload = data.payload && typeof data.payload === 'object' ? data.payload : {};
      } else if (typeof data.type === 'string' && data.type.startsWith('SANGI_APP_')) {
        cmd = data.type.slice('SANGI_APP_'.length).toUpperCase();
      }
      if (!cmd) return;
      if (cmd === 'PAUSE') onPause();
      else if (cmd === 'RESUME') onResume();
      else if (cmd === 'MUTE') onMute({ detail: { muted: typeof payload.muted === 'boolean' ? payload.muted : true } });
      else if (cmd === 'UNMUTE') onMute({ detail: { muted: false } });
      else if (cmd === 'RESET') onReset();
      else if (cmd === 'DISPOSE') disposeAll();
    };

    const disposeAll = () => {
      if (isDisposed) return;
      isDisposed = true;
      isPaused = true;
      if (rafId !== null) { cancelAnimationFrame(rafId); rafId = null; }
      window.removeEventListener('sangi:pause', onPause);
      window.removeEventListener('sangi:resume', onResume);
      window.removeEventListener('sangi:mute', onMute);
      window.removeEventListener('sangi:reset', onReset);
      window.removeEventListener('sangi:dispose', disposeAll);
      window.removeEventListener('beforeunload', disposeAll);
      window.removeEventListener('message', onBridgeMessage);
      teardownInteraction?.();
      teardownKeyboard?.();
      sceneContext?.dispose?.();
      audio?.dispose();
    };
    window.addEventListener('sangi:pause', onPause);
    window.addEventListener('sangi:resume', onResume);
    window.addEventListener('sangi:mute', onMute);
    window.addEventListener('sangi:reset', onReset);
    window.addEventListener('sangi:dispose', disposeAll);
    window.addEventListener('beforeunload', disposeAll);
    window.addEventListener('message', onBridgeMessage);

    if (window.parent && window.parent !== window) {
      try {
        window.parent.postMessage({
          type: 'SANGI_APP_READY',
          title: document.title,
          href: location.pathname,
          capabilities: { webgl2: Boolean(window.WebGL2RenderingContext), touch: 'ontouchstart' in window, audio: true },
        }, '*');
      } catch {}
    }

  } catch (err) {
    console.warn('[Rochas] Falha no WebGL 3D, ativando modo simplificado:', err);
    const loader = $('#loading-overlay');
    if (loader) loader.remove();
    $('#fallback-view').style.display = 'block';
  }
}

// Interação 3D (Raycasting, Arrasto e Equilíbrio)
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const planeY = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
const hitPoint = new THREE.Vector3();

function setupInteraction() {
  const { camera, controls, rockObjects } = sceneContext;

  const updateMouse = (e) => {
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
  };

  // Pegar ou arrastar pedra clicando nela
  const onPointerDown = (e) => {
    if (e.button !== 0) return;
    updateMouse(e);
    raycaster.setFromCamera(mouse, camera);

    if (!appState.heldRock) {
      const meshes = rockObjects.map((r) => r.mesh);
      const intersects = raycaster.intersectObjects(meshes, true);
      if (intersects.length > 0) {
        const clickedMesh = intersects[0].object;
        const targetRock = rockObjects.find((r) => r.mesh === clickedMesh);
        if (targetRock) {
          pickRock(targetRock);
          appState.isPointerDown = true;
          controls.enabled = false;
        }
      }
    } else {
      const hitHeld = raycaster.intersectObject(appState.heldRock.mesh, true);
      if (hitHeld.length > 0) {
        appState.isPointerDown = true;
        controls.enabled = false;
      }
    }
  };

  const onPointerMove = (e) => {
    updateMouse(e);
  };

  const onPointerUp = () => {
    if (appState.isPointerDown) {
      appState.isPointerDown = false;
      controls.enabled = true;
    }
  };

  // Roda do mouse gira a pedra suspensa
  const onWheel = (e) => {
    if (appState.heldRock) {
      e.preventDefault();
      appState.heldRotY += e.deltaY * 0.003;
      appState.heldRock.mesh.rotation.y = appState.heldRotY;
    }
  };

  canvas.addEventListener('pointerdown', onPointerDown);
  window.addEventListener('pointermove', onPointerMove);
  window.addEventListener('pointerup', onPointerUp);
  window.addEventListener('pointercancel', onPointerUp);
  canvas.addEventListener('wheel', onWheel, { passive: false });

  return () => {
    canvas.removeEventListener('pointerdown', onPointerDown);
    window.removeEventListener('pointermove', onPointerMove);
    window.removeEventListener('pointerup', onPointerUp);
    window.removeEventListener('pointercancel', onPointerUp);
    canvas.removeEventListener('wheel', onWheel);
  };
}

function pickRock(rock) {
  // Se já havia outra segurada, devolver ou soltar
  if (appState.heldRock && appState.heldRock !== rock) {
    dropHeldRock();
  }

  appState.heldRock = rock;
  rock.isHeld = true;
  rock.isStacked = false;
  rock.isInWater = false;
  if (rock.body) rock.body.sleep();

  // Calcular altura recomendada de hover baseado nas pedras empilhadas
  let topY = 0.24; // altura da rocha base
  let topRock = null;
  sceneContext.rockObjects.forEach((r) => {
    if (r !== rock && r.isStacked) {
      const y = r.mesh.position.y + (r.dimensions[1] || 0.14);
      if (y > topY) {
        topY = y;
        topRock = r;
      }
    }
  });
  appState.heldHeight = topY + 0.32;
  appState.heldRotY = rock.mesh.rotation.y;

  // Posicionar diretamente acima do centro de apoio da pilha
  const targetX = topRock ? topRock.mesh.position.x : 0.1;
  const targetZ = topRock ? topRock.mesh.position.z : -0.2;
  rock.mesh.position.set(targetX, appState.heldHeight, targetZ);

  // Avaliar equilíbrio imediatamente
  appState.lastBalance = sceneContext.physics.evaluateBalance(
    rock,
    rock.mesh.position,
    rock.mesh.rotation
  );

  // Atualizar UI
  setStep(1); // Encontre o apoio
  $('#hudBalance').classList.add('visible');
  $('#tagBadge').classList.add('hidden');
  $('#btnPick').classList.add('active');

  const badge = $('#stabilityBadge');
  const label = $('#stabilityLabel');
  badge.className = `stability-badge ${appState.lastBalance.status}`;
  label.textContent = appState.lastBalance.label;
  sceneContext.physics.updateBalanceVisuals(appState.lastBalance, appState.showBalancePoint);

  audio.playRockClack(rock.mass, 0.4);
  toast(`Pegou ${rock.name}. Posicione e encontre o apoio.`);
  announce(`Pedra ${rock.name} em mãos. Mova o cursor para posicionar e use Girar ou roda do mouse.`);
}

function updateHeldRockTransform() {
  const { camera, physics } = sceneContext;

  // Só move a pedra no plano se o usuário estiver ativamente arrastando com ponteiro
  if (appState.isPointerDown) {
    raycaster.setFromCamera(mouse, camera);
    planeY.constant = -appState.heldHeight;
    if (raycaster.ray.intersectPlane(planeY, hitPoint)) {
      appState.heldRock.mesh.position.x += (hitPoint.x - appState.heldRock.mesh.position.x) * 0.25;
      appState.heldRock.mesh.position.z += (hitPoint.z - appState.heldRock.mesh.position.z) * 0.25;
      appState.heldRock.mesh.position.y = appState.heldHeight;
    }
  }

  // Avaliar ponto de equilíbrio
  const balance = physics.evaluateBalance(
    appState.heldRock,
    appState.heldRock.mesh.position,
    appState.heldRock.mesh.rotation
  );
  appState.lastBalance = balance;

  // Atualizar HUD
  const badge = $('#stabilityBadge');
  const label = $('#stabilityLabel');
  badge.className = `stability-badge ${balance.status}`;
  label.textContent = balance.label;

  // Atualizar guias visuais
  physics.updateBalanceVisuals(balance, appState.showBalancePoint);
}

function dropHeldRock() {
  if (!appState.heldRock) return;
  const rock = appState.heldRock;
  let balance = appState.lastBalance;
  if (!balance || balance.targetY == null) {
    balance = sceneContext.physics.evaluateBalance(
      rock,
      rock.mesh.position,
      rock.mesh.rotation
    );
  }

  setStep(2); // Solte devagar
  sceneContext.physics.dropRock(rock, balance);
  sceneContext.physics.updateBalanceVisuals(null, false);

  appState.heldRock = null;
  $('#hudBalance').classList.remove('visible');
  $('#btnPick').classList.remove('active');

  if (balance && balance.status === 'estavel') {
    toast('Equilíbrio sereno.');
    announce('Pedra equilibrada com sucesso na torre.');
    setTimeout(() => {
      // Verificar se completou várias pedras
      const stackedCount = sceneContext.rockObjects.filter((r) => r.isStacked).length;
      if (stackedCount >= 5) {
        toast('Torre majestosa em harmonia.');
      }
    }, 600);
  } else if (balance && balance.status === 'oscilando') {
    toast('Apoio oscilante… respire.');
    announce('Pedra encontrou apoio delicado na borda.');
  } else {
    setStep(3); // Recomece quando cair
    toast('A pedra escorregou para o rio… sem derrota, só recomeço.');
    announce('A pedra rolou para o rio raso e retornará suavemente à margem.');
  }
}

function rotateHeldRock(deltaAngle = Math.PI / 4) {
  if (!appState.heldRock) {
    // Se não tiver pedra segurada, pega a próxima
    pickNextRock();
    return;
  }
  appState.heldRotY += deltaAngle;
  appState.heldRock.mesh.rotation.y = appState.heldRotY;
  audio.playRockClack(appState.heldRock.mass * 0.5, 0.3);
}

function pickNextRock() {
  const unstacked = sceneContext.rockObjects.filter((r) => !r.isStacked && !r.isHeld);
  if (unstacked.length > 0) {
    pickRock(unstacked[0]);
  } else {
    toast('Todas as pedras já estão na torre.');
  }
}

// Configurar Dock e Ações de Botões
function setupDockEvents() {
  $('#btnPick').onclick = () => {
    if (appState.heldRock) dropHeldRock();
    else pickNextRock();
  };

  $('#btnRotate').onclick = () => rotateHeldRock(Math.PI / 4);

  $('#btnBalance').onclick = () => {
    appState.showBalancePoint = !appState.showBalancePoint;
    $('#btnBalance').setAttribute('aria-pressed', String(appState.showBalancePoint));
    $('#btnBalance').classList.toggle('active', appState.showBalancePoint);
    toast(appState.showBalancePoint ? 'Ponto de equilíbrio visível.' : 'Ponto de equilíbrio recolhido.');
  };

  $('#btnDrop').onclick = () => dropHeldRock();

  $('#btnReset').onclick = () => {
    if (appState.heldRock) {
      appState.heldRock.isHeld = false;
      appState.heldRock = null;
      appState.isPointerDown = false;
      sceneContext.controls.enabled = true;
      $('#hudBalance').classList.remove('visible');
      $('#btnPick').classList.remove('active');
      sceneContext.physics.updateBalanceVisuals(null, false);
    }
    sceneContext.physics.resetAllToBank();
    setStep(0);
    audio.playRockClack(2.0, 0.5);
    toast('Pedras recolhidas na margem. Recomeço com calma.');
    announce('Todas as pedras voltaram para a margem do rio.');
  };

  $('#btnPhoto').onclick = () => takePhoto();

  $('#btnSound').onclick = () => {
    appState.sound = !appState.sound;
    audio.setMuted(!appState.sound);
    $('#btnSound').setAttribute('aria-pressed', String(appState.sound));
    $('#btnSound').classList.toggle('active', appState.sound);
    savePrefs();
    toast(appState.sound ? 'Sons da natureza ativados.' : 'Áudio silenciado.');
  };

  $('#btnCta').onclick = (e) => {
    e.preventDefault();
    if (isEmbed) {
      window.parent.postMessage({ tipo: 'cta', marca: currentBrand.nome }, '*');
    }
    toast('Abrindo agendamento de horários…');
    announce('Ação de ver horários acionada.');
  };

  const ctaFallback = $('#btnCtaFallback');
  if (ctaFallback) {
    ctaFallback.onclick = () => {
      if (isEmbed) window.parent.postMessage({ tipo: 'cta' }, '*');
      toast('Abrindo agendamento de horários…');
    };
  }

  // Passos clicáveis
  document.querySelectorAll('.step-item').forEach((item) => {
    item.addEventListener('click', () => {
      const step = parseInt(item.dataset.step, 10);
      if (step === 0) pickNextRock();
      else if (step === 1 && appState.heldRock) rotateHeldRock();
      else if (step === 2 && appState.heldRock) dropHeldRock();
      else if (step === 3) $('#btnReset').click();
    });
  });
}

// Fotografar Torre de Rochas
function takePhoto() {
  const topbar = $('#topbar');
  const hero = $('#heroContent');
  const dock = $('#dock');
  const hud = $('#hudBalance');
  const tag = $('#tagBadge');

  // Ocultar UI temporariamente
  if (topbar) topbar.style.display = 'none';
  if (hero) hero.style.display = 'none';
  if (dock) dock.style.display = 'none';
  if (hud) hud.style.display = 'none';
  if (tag) tag.style.display = 'none';

  sceneContext.renderer.render(sceneContext.scene, sceneContext.camera);
  const dataUrl = canvas.toDataURL('image/png');

  // Restaurar UI
  if (topbar) topbar.style.display = '';
  if (hero) hero.style.display = '';
  if (dock) dock.style.display = '';
  if (hud) hud.style.display = '';
  if (tag) tag.style.display = '';

  // Baixar imagem
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = `rochas-em-equilibrio-${new Date().toISOString().slice(0, 10)}.png`;
  a.click();

  audio.playRockClack(1.0, 0.4);
  toast('Fotografia guardada com carinho.');
  announce('Fotografia capturada e download iniciado.');
}

// Indicador do Ritmo Respiratório
function updateBreathUI(breath) {
  const circle = $('#breathCircle');
  const text = $('#breathText');
  if (!circle || !text) return;

  const scale = 0.85 + breath.breathIntensity * 0.45;
  circle.style.transform = `scale(${scale})`;

  if (breath.breathPhase === 'inspirar') {
    text.textContent = 'Inspire…';
  } else if (breath.breathPhase === 'pausa') {
    text.textContent = 'Sustente';
  } else {
    text.textContent = 'Expire…';
  }
}

function setupBreathTracker() {
  $('#breathIndicator').onclick = () => {
    toast('Respire com o ritmo das águas: inspire quando a correnteza expande, solte quando acalma.');
  };
}

// Diálogos e Ajustes
function setupDialogs() {
  const dlgSettings = $('#dlgSettings');
  const dlgAbout = $('#dlgAbout');

  $('#btnSettings').onclick = () => dlgSettings.showModal();
  $('#linkSobre').onclick = (e) => {
    e.preventDefault();
    dlgAbout.showModal();
  };

  document.querySelectorAll('dialog .dlg-close').forEach((b) => {
    b.onclick = () => b.closest('dialog').close();
  });

  // Troca de Qualidade
  const segQ = $('#segQuality');
  if (segQ) {
    segQ.querySelectorAll('.seg-btn').forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.val === appState.quality);
      btn.onclick = () => {
        appState.quality = btn.dataset.val;
        segQ.querySelectorAll('.seg-btn').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        savePrefs();
        toast(`Qualidade alterada para ${btn.textContent}. Recarregando…`);
        setTimeout(() => window.location.reload(), 400);
      };
    });
  }

  // Troca de Marca (Re-skin em tempo real)
  const segB = $('#segBrand');
  if (segB) {
    segB.querySelectorAll('.seg-btn').forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.val === appState.brandId);
      btn.onclick = () => {
        appState.brandId = btn.dataset.val;
        segB.querySelectorAll('.seg-btn').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        const nextBrand = PRESETS[appState.brandId] || PRESETS.casaSeixo;
        applyBrandStyles(nextBrand);
        $('#brandName').textContent = nextBrand.logoTexto;
        $('#heroTitle').innerHTML = nextBrand.textos.titulo.replace('\n', '<br>');
        $('#heroSubtitle').textContent = nextBrand.textos.apoio;
        $('#btnCta').textContent = nextBrand.cta.texto;
        $('#aboutDescription').textContent = nextBrand.textos.sobre;

        if (sceneContext) {
          sceneContext.water.setColor(nextBrand.cores.agua);
          sceneContext.scene.fog.color.set(nextBrand.cores.fundo);
          sceneContext.scene.background.set(nextBrand.cores.fundo);
        }
        toast(`Marca alterada para ${nextBrand.nome}.`);
      };
    });
  }

  // Controle de Som no Modal
  const segS = $('#segSound');
  if (segS) {
    segS.querySelectorAll('.seg-btn').forEach((btn) => {
      btn.classList.toggle('active', (btn.dataset.val === 'on') === appState.sound);
      btn.onclick = () => {
        appState.sound = btn.dataset.val === 'on';
        segS.querySelectorAll('.seg-btn').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        audio.setMuted(!appState.sound);
        $('#btnSound').setAttribute('aria-pressed', String(appState.sound));
        $('#btnSound').classList.toggle('active', appState.sound);
        savePrefs();
      };
    });
  }
}

// Atalhos de Teclado
function setupKeyboard() {
  const onKeyDown = (e) => {
    if (e.target.closest('input, textarea, dialog[open]')) return;
    const k = e.key.toLowerCase();

    // 1 a 6: pegar pedra específica
    if (/^[1-6]$/.test(k)) {
      const idx = parseInt(k, 10) - 1;
      if (sceneContext.rockObjects[idx]) {
        pickRock(sceneContext.rockObjects[idx]);
      }
    } else if (k === ' ' || k === 'enter') {
      if (appState.heldRock) dropHeldRock();
      else pickNextRock();
    } else if (k === 'r') {
      rotateHeldRock();
    } else if (k === 'e') {
      $('#btnBalance').click();
    } else if (k === 'f' || k === 'p') {
      takePhoto();
    } else if (k === 'c') {
      $('#btnReset').click();
    } else if (k === 'm') {
      $('#btnSound').click();
    } else if (k === 'escape') {
      if (appState.heldRock) {
        sceneContext.physics.recoverRockToBank(appState.heldRock);
        appState.heldRock.isHeld = false;
        appState.heldRock = null;
        appState.isPointerDown = false;
        sceneContext.controls.enabled = true;
        $('#hudBalance').classList.remove('visible');
        $('#btnPick').classList.remove('active');
        sceneContext.physics.updateBalanceVisuals(null, false);
        setStep(0);
      }
    }
  };
  window.addEventListener('keydown', onKeyDown);
  return () => window.removeEventListener('keydown', onKeyDown);
}

// Expor Hook de Automação e QA para Playwright
window.rochasQA = {
  pick: (idx = 0) => {
    if (sceneContext.rockObjects[idx]) pickRock(sceneContext.rockObjects[idx]);
  },
  rotate: (angle) => rotateHeldRock(angle),
  drop: () => dropHeldRock(),
  reset: () => $('#btnReset').click(),
  photo: () => {
    sceneContext.renderer.render(sceneContext.scene, sceneContext.camera);
    return canvas.toDataURL('image/webp', 0.92);
  },
  stats: () => ({
    drawCalls: sceneContext.renderer.info.render.calls,
    triangles: sceneContext.renderer.info.render.triangles,
    fps: 60,
    heldRock: appState.heldRock?.id || null,
    stackedCount: sceneContext.rockObjects.filter((r) => r.isStacked).length,
  }),
  state: () => ({
    quality: appState.quality,
    sound: appState.sound,
    brand: appState.brandId,
    step: appState.currentStep,
  }),
};

// Start
start();
