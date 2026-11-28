/**
 * Aplicação Principal e Orquestrador Interativo 3D
 * Projeto: 02. Mesa dos Objetos que Acalmam
 */

import * as THREE from 'three';
import { MARCA, PRESETS_MARCA, aplicarMarca } from './brand.js';
import { createWalnutWoodTextures, ZenSandSystem } from './textures.js';
import {
  createTableEnvironment,
  createSandPendulum,
  createNewtonsCradle,
  createLiquidHourglass,
  createSingingBowl,
  createSandRake
} from './objects.js';
import {
  SandPendulumPhysics,
  NewtonsCradlePhysics,
  LiquidHourglassPhysics,
  SingingBowlPhysics
} from './physics.js';
import { CalmingAudioEngine } from './audio.js';
import { setupScene } from './scene.js';

// Estado global da aplicação
const state = {
  activeObject: 'pendulo',
  isDraggingPendulum: false,
  isDraggingBowl: false,
  isRaking: false,
  rakeProgress: 0,
  quality: 'alta',
  activeStep: 1
};

// 1. Inicialização do Container e Cena
const container = document.getElementById('canvas-container');
const sceneCtx = setupScene(container);
const { scene, camera, renderer, controls, switchCameraPreset, updateCameraTransition, validateSceneManifest } = sceneCtx;

// 2. Sistema de Áudio Seguro
const audio = new CalmingAudioEngine();

// 3. Texturas e Sistema de Areia Dinâmico
const textures = {
  walnut: createWalnutWoodTextures(1024, 1024)
};
const sandSystem = new ZenSandSystem(512);

// 4. Objetos 3D
const tableEnv = createTableEnvironment(textures);
scene.add(tableEnv);

const sandPendulum = createSandPendulum(textures, sandSystem);
scene.add(sandPendulum.group);

const newtonsCradle = createNewtonsCradle();
scene.add(newtonsCradle.group);

const liquidHourglass = createLiquidHourglass();
scene.add(liquidHourglass.group);

const singingBowl = createSingingBowl();
scene.add(singingBowl.group);

const sandRake = createSandRake();
scene.add(sandRake);

// Partículas de poeira dourada flutuando no facho de sol
const dustCount = 80;
const dustGeo = new THREE.BufferGeometry();
const dustPositions = new Float32Array(dustCount * 3);
for (let i = 0; i < dustCount * 3; i += 3) {
  dustPositions[i] = (Math.random() - 0.2) * 1.6;
  dustPositions[i + 1] = 0.05 + Math.random() * 0.9;
  dustPositions[i + 2] = (Math.random() - 0.5) * 1.2;
}
dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));
const dustMat = new THREE.PointsMaterial({
  color: 0xffe6b8,
  size: 0.006,
  transparent: true,
  opacity: 0.55,
  blending: THREE.AdditiveBlending
});
const dustParticles = new THREE.Points(dustGeo, dustMat);
scene.add(dustParticles);

// 5. Motores Físicos
const pendulumPhysics = new SandPendulumPhysics();

const newtonPhysics = new NewtonsCradlePhysics(5, (intensity) => {
  audio.playNewtonClick(intensity);
});

const hourglassPhysics = new LiquidHourglassPhysics((colorType) => {
  audio.playBubbleDrop(colorType);
});

const singingBowlPhysics = new SingingBowlPhysics(
  (force) => audio.playBowlStrike(force),
  (sustain, speed) => audio.updateBowlFriction(sustain, speed)
);

// 6. Callback de atualização de materiais 3D para troca de marca em tempo real
window.__atualizarMateriais3D = (mat3D) => {
  if (!mat3D) return;
  if (singingBowl.cushionMat) singingBowl.cushionMat.color.setHex(mat3D.almofadaTigela);
  if (singingBowl.bronzeMat) singingBowl.bronzeMat.color.setHex(mat3D.metalTigela);
  if (newtonsCradle.chromeMat) newtonsCradle.chromeMat.color.setHex(mat3D.metalNewton);
  if (liquidHourglass.blueMat) liquidHourglass.blueMat.color.setHex(mat3D.liquidoAzul);
  if (liquidHourglass.amberMat) liquidHourglass.amberMat.color.setHex(mat3D.liquidoAmbar);
  if (sandPendulum.brassMat) sandPendulum.brassMat.color.setHex(mat3D.metalTigela);
};

// 7. Raycasting e Manipulação Tátil / Mouse
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const dragPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -0.05);
const planeIntersect = new THREE.Vector3();

let dragStartPos = { x: 0, y: 0 };
let lastPointerTime = 0;

function updatePointerCoords(e) {
  const rect = renderer.domElement.getBoundingClientRect();
  const clientX = e.touches ? e.touches[0].clientX : e.clientX;
  const clientY = e.touches ? e.touches[0].clientY : e.clientY;
  mouse.x = ((clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((clientY - rect.top) / rect.height) * 2 + 1;
}

function onPointerDown(e) {
  audio.ensureRunning();
  updatePointerCoords(e);
  raycaster.setFromCamera(mouse, camera);

  // Ocultar selo flutuante no primeiro toque
  const selo = document.getElementById('selo-dica');
  if (selo) selo.style.opacity = '0';

  // Verificar interações com hitboxes
  const interactiveObjects = [
    sandPendulum.hitbox,
    ...newtonsCradle.spherePivots.map(p => p.getObjectByName(/^hitbox_esfera_/)),
    liquidHourglass.hitbox,
    singingBowl.hitbox
  ].filter(Boolean);

  const intersects = raycaster.intersectObjects(interactiveObjects, true);

  if (intersects.length > 0) {
    const hit = intersects[0].object;

    // A) Pêndulo de Areia
    if (hit === sandPendulum.hitbox) {
      state.isDraggingPendulum = true;
      pendulumPhysics.isDragging = true;
      controls.enabled = false;
      dragStartPos = { x: sandPendulum.bobGroup.position.x, y: sandPendulum.bobGroup.position.z };
      lastPointerTime = performance.now();
      setActiveStep(1);
      return;
    }

    // B) Berço de Newton
    if (hit.name && hit.name.startsWith('hitbox_esfera_')) {
      const sphereIdx = hit.userData.sphereIndex !== undefined ? hit.userData.sphereIndex : 0;
      const angle = sphereIdx <= 2 ? -0.7 : 0.7;
      newtonPhysics.pullSphere(sphereIdx, angle);
      setActiveStep(4);
      return;
    }

    // C) Ampulheta Líquida
    if (hit === liquidHourglass.hitbox) {
      hourglassPhysics.flip();
      setActiveStep(3);
      return;
    }

    // D) Tigela Tibetana
    if (hit === singingBowl.hitbox) {
      state.isDraggingBowl = true;
      controls.enabled = false;
      singingBowlPhysics.strike(0.85);

      // Animação de impacto do bastão
      singingBowl.strikerGroup.position.x = 0.07;
      setTimeout(() => {
        singingBowl.strikerGroup.position.x = 0.085;
      }, 120);

      setActiveStep(2);
      return;
    }
  }
}

function onPointerMove(e) {
  updatePointerCoords(e);

  if (state.isDraggingPendulum) {
    raycaster.setFromCamera(mouse, camera);
    if (raycaster.ray.intersectPlane(dragPlane, planeIntersect)) {
      // Converte coordenadas globais para relativas à bandeja
      const relX = planeIntersect.x - sandPendulum.group.position.x;
      const relZ = planeIntersect.z - sandPendulum.group.position.z;

      // Limitar ao raio da bandeja (0.24m)
      const dist = Math.hypot(relX, relZ);
      const maxR = 0.22;
      const factor = dist > maxR ? maxR / dist : 1.0;

      pendulumPhysics.currentPos.x = relX * factor;
      pendulumPhysics.currentPos.y = relZ * factor;

      sandPendulum.bobGroup.position.x = relX * factor;
      sandPendulum.bobGroup.position.z = relZ * factor;
    }
  } else if (state.isDraggingBowl) {
    // Rastreia ângulo circular do bastão na borda da tigela
    raycaster.setFromCamera(mouse, camera);
    if (raycaster.ray.intersectPlane(dragPlane, planeIntersect)) {
      const relX = planeIntersect.x - singingBowl.group.position.x;
      const relZ = planeIntersect.z - singingBowl.group.position.z;
      const angle = Math.atan2(relZ, relX);

      // Posiciona bastão na borda
      const bowlRadius = 0.088;
      singingBowl.strikerGroup.position.x = Math.cos(angle) * bowlRadius;
      singingBowl.strikerGroup.position.z = Math.sin(angle) * bowlRadius;
      singingBowl.strikerGroup.rotation.y = -angle;

      const now = performance.now();
      const dt = (now - lastPointerTime) / 1000;
      lastPointerTime = now;
      singingBowlPhysics.trackCircularMotion(angle, Math.max(0.001, dt));
    }
  }
}

function onPointerUp() {
  if (state.isDraggingPendulum) {
    state.isDraggingPendulum = false;
    pendulumPhysics.isDragging = false;
    controls.enabled = true;

    // Dispara o pêndulo a partir da posição solta
    const px = sandPendulum.bobGroup.position.x;
    const py = sandPendulum.bobGroup.position.z;
    pendulumPhysics.setImpulse(px, py, 0, 0);
  }

  if (state.isDraggingBowl) {
    state.isDraggingBowl = false;
    singingBowlPhysics.releaseStriker();
    controls.enabled = true;
    // Retorna bastão à posição de repouso
    singingBowl.strikerGroup.position.set(0.085, 0.065, 0.06);
    singingBowl.strikerGroup.rotation.set(-0.35, 0.4, 0.85);
  }
}

window.addEventListener('pointerdown', onPointerDown);
window.addEventListener('pointermove', onPointerMove);
window.addEventListener('pointerup', onPointerUp);
window.addEventListener('pointercancel', onPointerUp);

// 8. Ações dos Passos e Dock
function setActiveStep(stepNum) {
  state.activeStep = stepNum;
  document.querySelectorAll('.passo-item').forEach((item, idx) => {
    item.classList.toggle('ativo', idx + 1 === stepNum);
  });
}

function startRaking() {
  if (state.isRaking) return;
  state.isRaking = true;
  state.rakeProgress = 0;
  audio.playRakeSweep();
  sandRake.visible = true;
  setActiveStep(4);
}

// Botões do Dock
document.getElementById('dock-pendulo')?.addEventListener('click', () => {
  audio.ensureRunning();
  switchCameraPreset('pendulo');
  setActiveStep(1);
  if (!pendulumPhysics.isActive) {
    pendulumPhysics.setImpulse(0.16, 0.12, 0.05, 0.02);
  }
  updateDockActive('dock-pendulo');
});

document.getElementById('dock-newton')?.addEventListener('click', () => {
  audio.ensureRunning();
  switchCameraPreset('berco');
  newtonPhysics.pullSphere(0, -0.68);
  updateDockActive('dock-newton');
});

document.getElementById('dock-ampulheta')?.addEventListener('click', () => {
  audio.ensureRunning();
  switchCameraPreset('ampulheta');
  hourglassPhysics.flip();
  setActiveStep(3);
  updateDockActive('dock-ampulheta');
});

document.getElementById('dock-tigela')?.addEventListener('click', () => {
  audio.ensureRunning();
  switchCameraPreset('tigela');
  singingBowlPhysics.strike(0.9);
  setActiveStep(2);
  updateDockActive('dock-tigela');
});

document.getElementById('dock-alisar')?.addEventListener('click', () => {
  audio.ensureRunning();
  startRaking();
  updateDockActive('dock-alisar');
});

function updateDockActive(activeId) {
  document.querySelectorAll('.dock-btn').forEach(btn => {
    btn.classList.toggle('ativo', btn.id === activeId);
  });
}

// Passos clicáveis no card
document.querySelectorAll('.passo-item').forEach(item => {
  item.addEventListener('click', () => {
    const obj = item.dataset.objeto;
    if (obj === 'pendulo') document.getElementById('dock-pendulo')?.click();
    else if (obj === 'tigela') document.getElementById('dock-tigela')?.click();
    else if (obj === 'ampulheta') document.getElementById('dock-ampulheta')?.click();
    else if (obj === 'alisar') document.getElementById('dock-alisar')?.click();
  });
});

// Botão de Áudio
const btnAudio = document.getElementById('btn-audio');
btnAudio?.addEventListener('click', () => {
  audio.ensureRunning();
  const isMuted = audio.toggleMute();
  btnAudio.style.opacity = isMuted ? '0.5' : '1.0';
});

// Alternador de Câmera
let cameraModeIdx = 0;
const cameraModes = ['geral', 'pendulo', 'berco', 'ampulheta', 'tigela'];
document.getElementById('btn-camera')?.addEventListener('click', () => {
  cameraModeIdx = (cameraModeIdx + 1) % cameraModes.length;
  switchCameraPreset(cameraModes[cameraModeIdx]);
});

// Fotografia Zen em PNG
document.getElementById('btn-foto')?.addEventListener('click', () => {
  const dataUrl = renderer.domElement.toDataURL('image/png');
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = `ponto-quieto-zen-${Date.now()}.png`;
  a.click();
});

// Modais
const modalSobre = document.getElementById('modal-sobre');
const modalAjustes = document.getElementById('modal-ajustes');

document.getElementById('btn-sobre')?.addEventListener('click', () => modalSobre?.classList.add('aberto'));
document.getElementById('fechar-sobre')?.addEventListener('click', () => modalSobre?.classList.remove('aberto'));
document.getElementById('btn-entendido-sobre')?.addEventListener('click', () => modalSobre?.classList.remove('aberto'));

document.getElementById('btn-ajustes')?.addEventListener('click', () => modalAjustes?.classList.add('aberto'));
document.getElementById('fechar-ajustes')?.addEventListener('click', () => modalAjustes?.classList.remove('aberto'));

// Presets de Marca via modal
document.getElementById('btn-marca-ponto')?.addEventListener('click', () => {
  aplicarMarca('pontoQuieto');
  modalAjustes?.classList.remove('aberto');
});
document.getElementById('btn-marca-neutro')?.addEventListener('click', () => {
  aplicarMarca('neutro');
  modalAjustes?.classList.remove('aberto');
});

// Qualidade Gráfica
document.getElementById('btn-qualidade-alta')?.addEventListener('click', () => {
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.shadowMap.enabled = true;
  state.quality = 'alta';
  modalAjustes?.classList.remove('aberto');
});
document.getElementById('btn-qualidade-equilibrada')?.addEventListener('click', () => {
  renderer.setPixelRatio(1);
  renderer.shadowMap.enabled = true;
  state.quality = 'equilibrada';
  modalAjustes?.classList.remove('aberto');
});
document.getElementById('btn-qualidade-leve')?.addEventListener('click', () => {
  renderer.setPixelRatio(0.85);
  renderer.shadowMap.enabled = false;
  state.quality = 'leve';
  modalAjustes?.classList.remove('aberto');
});

// 9. Atalhos de Teclado
window.addEventListener('keydown', (e) => {
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

  switch (e.key) {
    case '1':
      document.getElementById('dock-pendulo')?.click();
      break;
    case '2':
      document.getElementById('dock-tigela')?.click();
      break;
    case '3':
      document.getElementById('dock-ampulheta')?.click();
      break;
    case '4':
    case 'b':
    case 'B':
      document.getElementById('dock-newton')?.click();
      break;
    case ' ':
    case 'Enter':
      e.preventDefault();
      pendulumPhysics.setImpulse(0.18, 0.14, 0.08, -0.04);
      setActiveStep(1);
      break;
    case 'r':
    case 'R':
    case 'a':
    case 'A':
      startRaking();
      break;
    case 'c':
    case 'C':
      document.getElementById('btn-camera')?.click();
      break;
    case 'm':
    case 'M':
      document.getElementById('btn-audio')?.click();
      break;
    case 'f':
    case 'F':
    case 'p':
    case 'P':
      document.getElementById('btn-foto')?.click();
      break;
    case 'Escape':
      modalSobre?.classList.remove('aberto');
      modalAjustes?.classList.remove('aberto');
      switchCameraPreset('geral');
      break;
  }
});

// 10. Suporte ao Modo Embed (?embed=1)
const isEmbed = new URLSearchParams(window.location.search).get('embed') === '1';
if (isEmbed) {
  document.body.classList.add('modo-embed');
  document.getElementById('btn-cta-nav')?.addEventListener('click', (e) => {
    e.preventDefault();
    window.parent.postMessage({ tipo: 'cta', acao: 'conhecer_espaco' }, '*');
  });
}

// 11. Validação de Manifesto na Inicialização e Objeto QA para Testes Automatizados
validateSceneManifest();

let frameCount = 0;
let lastFpsTime = performance.now();
let currentFps = 60;

window.mesaQA = {
  stats: () => ({
    drawCalls: renderer.info.render.calls,
    triangles: renderer.info.render.triangles,
    fps: currentFps,
    activeStep: state.activeStep,
    isRaking: state.isRaking,
    pendulumActive: pendulumPhysics.isActive
  }),
  triggerPendulum: (x = 0.16, y = 0.12, vx = 0.05, vy = 0.02) => {
    pendulumPhysics.setImpulse(x, y, vx, vy);
    setActiveStep(1);
  },
  triggerNewton: (sphereIdx = 0, angle = -0.7) => {
    newtonPhysics.pullSphere(sphereIdx, angle);
    setActiveStep(4);
  },
  triggerHourglass: () => {
    hourglassPhysics.flip();
    setActiveStep(3);
  },
  triggerBowl: (force = 0.85) => {
    singingBowlPhysics.strike(force);
    setActiveStep(2);
  },
  triggerRake: () => {
    startRaking();
  },
  setCameraPreset: (presetKey) => {
    switchCameraPreset(presetKey);
  },
  setPresetMarca: (key) => {
    return aplicarMarca(key);
  }
};

// 12. Loop Principal de Renderização
const clock = new THREE.Clock();
let rafId = null;
let isPaused = false;
let isDisposed = false;

function animate() {
  if (isPaused || isDisposed) { rafId = null; return; }
  rafId = requestAnimationFrame(animate);

  frameCount++;
  const now = performance.now();
  if (now - lastFpsTime >= 500) {
    currentFps = Math.round((frameCount * 1000) / (now - lastFpsTime));
    frameCount = 0;
    lastFpsTime = now;
  }

  const dt = Math.min(clock.getDelta(), 0.1);

  // A) Atualização do Pêndulo de Areia
  const pos = pendulumPhysics.update(dt);
  sandPendulum.bobGroup.position.x = pos.x;
  sandPendulum.bobGroup.position.z = pos.y;

  // Orientação da corda em direção ao ápice
  const apexPos = new THREE.Vector3(0, 0, 0);
  const bobPos = sandPendulum.bobGroup.position;
  sandPendulum.pendulumPivot.children[0].quaternion.setFromUnitVectors(
    new THREE.Vector3(0, -1, 0),
    bobPos.clone().sub(apexPos).normalize()
  );

  // Se o estilete estiver em movimento próximo à areia, grava sulco
  if (pendulumPhysics.isActive || pendulumPhysics.isDragging) {
    const normX = pos.x / 0.24;
    const normY = pos.y / 0.24;
    sandSystem.carveAt(normX, normY, 5.0);
    audio.updateSandFriction(pendulumPhysics.getSpeed());
  } else {
    sandSystem.releaseCarve();
    audio.updateSandFriction(0);
  }

  // B) Atualização do Berço de Newton
  newtonPhysics.update(dt);
  for (let i = 0; i < newtonsCradle.spherePivots.length; i++) {
    newtonsCradle.spherePivots[i].rotation.z = -newtonPhysics.theta[i];
  }

  // C) Atualização da Ampulheta Líquida
  hourglassPhysics.update(dt);
  liquidHourglass.flipPivot.rotation.z = hourglassPhysics.rotation;

  // Atualização das gotas da ampulheta
  for (let i = 0; i < liquidHourglass.dropMeshes.length; i++) {
    const drop = liquidHourglass.dropMeshes[i];
    const simDrop = hourglassPhysics.drops[i];
    drop.position.y = simDrop.y;
  }

  // D) Atualização da Tigela Tibetana
  singingBowlPhysics.update(dt);

  // E) Animação do Rastelo de Areia
  if (state.isRaking) {
    state.rakeProgress += dt * 0.45;
    const rakeX = -0.22 + state.rakeProgress * 0.44;
    sandRake.position.set(rakeX + sandPendulum.group.position.x, 0.024, sandPendulum.group.position.z);
    sandSystem.smoothStep(0.045);

    if (state.rakeProgress >= 1.0) {
      state.isRaking = false;
      sandRake.position.set(-0.38, 0.018, 0.32);
    }
  }

  // F) Partículas de poeira nos fachos solares
  const dustPosArr = dustParticles.geometry.attributes.position.array;
  for (let i = 1; i < dustCount * 3; i += 3) {
    dustPosArr[i] += dt * 0.015;
    if (dustPosArr[i] > 0.95) dustPosArr[i] = 0.05;
  }
  dustParticles.geometry.attributes.position.needsUpdate = true;

  // G) Transição de Câmera e Controles
  updateCameraTransition(dt);
  controls.update();

  renderer.render(scene, camera);
}

// Inicializa com o preset da marca
aplicarMarca('pontoQuieto');
animate();

function disposeAll() {
  if (isDisposed) return;
  isDisposed = true;
  isPaused = true;
  if (rafId !== null) { cancelAnimationFrame(rafId); rafId = null; }
  controls?.dispose();
  renderer?.dispose();
  audio?.dispose();
}

window.__SANGI_QA__ = {
  get info() {
    return {
      calls: renderer?.info?.render?.calls ?? 0,
      triangles: renderer?.info?.render?.triangles ?? 0,
      paused: isPaused,
      disposed: isDisposed,
    };
  }
};

window.addEventListener('sangi:pause', () => {
  isPaused = true;
  if (rafId !== null) { cancelAnimationFrame(rafId); rafId = null; }
});
window.addEventListener('sangi:resume', () => {
  if (isDisposed || !isPaused) return;
  isPaused = false;
  clock.getDelta();
  animate();
});
window.addEventListener('sangi:mute', (e) => {
  const muted = !!e?.detail?.muted;
  if (audio.setMuted) audio.setMuted(muted);
  else audio.isMuted = muted;
});
window.addEventListener('sangi:dispose', disposeAll);
window.addEventListener('beforeunload', disposeAll);
window.addEventListener('message', (e) => {
  if (e.data?.type === 'SANGI_APP_DISPOSE' || (e.data?.type === 'SANGI_COMMAND' && String(e.data?.command).toUpperCase() === 'DISPOSE')) {
    disposeAll();
  }
});
