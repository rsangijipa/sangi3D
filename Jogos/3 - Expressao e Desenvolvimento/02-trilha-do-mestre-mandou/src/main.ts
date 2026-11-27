/**
 * Ponto de Entrada Principal e Orquestrador
 * Projeto: 02. Trilha do Mestre Mandou
 */

import * as THREE from 'three';
import { setupScene } from './scene/scene.ts';
import { ForestAudioEngine } from './audio/audio.ts';
import { GameStateManager } from './game/state.ts';
import { createHUD } from './ui/hud.ts';
import { InputManager } from './input/controls.ts';
import { aplicarMarca } from './brand/brand.ts';

// 1. Inicialização do Container e da Cena 3D
const container = document.getElementById('canvas-container')!;
const sceneCtx = setupScene(container);
const {
  scene,
  camera,
  renderer,
  water,
  avatar,
  blueBell,
  drum,
  waterWheel,
  targetBeacon,
  setCameraMode,
  updateCamera,
  validateSceneManifest
} = sceneCtx;

// 2. Motores de Áudio e Estado do Jogo
const audio = new ForestAudioEngine();
const gameState = new GameStateManager();

// 3. Interface de Usuário (HUD)
const uiRoot = document.getElementById('ui-root')!;
createHUD(
  uiRoot,
  gameState,
  () => audio.toggleMute(),
  () => {
    gameState.toggleCameraMode();
    setCameraMode(gameState.getState().cameraMode);
  },
  () => {
    const cp = gameState.returnToSafeCheckpoint();
    avatar.pos.set(cp[0], cp[1], cp[2]);
  },
  () => {
    handleInteraction();
  }
);

// 4. Tratamento de Interações Físicas com os Objetos
function handleInteraction() {
  audio.ensureRunning();
  avatar.interact();

  const current = gameState.getCurrentTarget();
  const playerPos: [number, number, number] = [avatar.pos.x, avatar.pos.y, avatar.pos.z];

  // Distâncias para os objetos principais
  const distToBell = Math.hypot(avatar.pos.x - 14.0, avatar.pos.z - (-6.0));
  const distToDrum = Math.hypot(avatar.pos.x - 10.0, avatar.pos.z - 12.0);
  const distToWheel = Math.hypot(avatar.pos.x - (-8.0), avatar.pos.z - (-10.0));

  if (distToBell < 4.5) {
    blueBell.strike();
    audio.playBlueBell();
    if (current && current.id === 'sino_azul') {
      audio.playSuccessArpeggio();
      gameState.completeCurrentStep();
    }
    return;
  }

  if (distToDrum < 4.5) {
    drum.strike();
    audio.playDrum();
    if (current && current.id === 'tambor') {
      audio.playSuccessArpeggio();
      gameState.completeCurrentStep();
    }
    return;
  }

  if (distToWheel < 5.0) {
    waterWheel.boost();
    audio.playWaterWheel();
    if (current && current.id === 'roda_dagua') {
      audio.playSuccessArpeggio();
      gameState.completeCurrentStep();
    }
    return;
  }

  // Verificação geral de proximidade
  if (gameState.checkProximity(playerPos)) {
    audio.playSuccessArpeggio();
  }
}

// 5. Sistema de Entrada e Controles
const inputManager = new InputManager(
  container,
  camera,
  sceneCtx.terrain.terrainMesh,
  (point) => {
    audio.ensureRunning();
    avatar.setDestination(point.x, point.z);
    targetBeacon.position.set(point.x, point.y + 0.05, point.z);
  },
  (targetId) => {
    audio.ensureRunning();
    console.log('Alvo clicado:', targetId);
  },
  () => handleInteraction(),
  () => {
    audio.ensureRunning();
    avatar.jump();
  },
  () => {
    gameState.toggleCameraMode();
    setCameraMode(gameState.getState().cameraMode);
  },
  () => audio.toggleMute(),
  () => gameState.togglePause()
);

// 6. Monitoramento de FPS e Objeto de QA para Testes Automatizados
let frameCount = 0;
let lastFpsTime = performance.now();
let currentFps = 60;

(window as any).trilhaQA = {
  stats: () => ({
    drawCalls: renderer.info.render.calls,
    triangles: renderer.info.render.triangles,
    fps: currentFps,
    stepIndex: gameState.getState().currentStepIndex,
    stepCount: gameState.getState().sequence.length,
    mode: gameState.getState().mode,
    avatarPos: [avatar.pos.x, avatar.pos.y, avatar.pos.z],
    isPaused: gameState.getState().isPaused
  }),
  moveTo: (x: number, z: number) => {
    avatar.setDestination(x, z);
  },
  jump: () => {
    avatar.jump();
  },
  interact: () => {
    handleInteraction();
  },
  triggerTarget: (targetId: string) => {
    if (targetId === 'sino_azul') {
      avatar.pos.set(13.2, 3.2, -5.5);
      handleInteraction();
    } else if (targetId === 'tambor') {
      avatar.pos.set(9.5, 0.8, 11.5);
      handleInteraction();
    } else if (targetId === 'roda_dagua') {
      avatar.pos.set(-7.5, 0.6, -9.5);
      handleInteraction();
    } else if (targetId === 'plataforma_estrela') {
      avatar.pos.set(2.0, 2.2, -8.0);
      handleInteraction();
    }
  },
  setCameraMode: (mode: 'follow' | 'isometric') => {
    gameState.toggleCameraMode();
    setCameraMode(mode);
  },
  setPresetMarca: (key: string) => {
    return aplicarMarca(key);
  }
};

// 7. Validação do Manifesto na Inicialização
validateSceneManifest();

// 8. Loop Principal de Renderização
const clock = new THREE.Clock();
let rafId = 0;
let isPaused = false;
let isDisposed = false;

function animate() {
  if (isPaused || isDisposed) { rafId = 0; return; }
  rafId = requestAnimationFrame(animate);

  frameCount++;
  const now = performance.now();
  if (now - lastFpsTime >= 500) {
    currentFps = Math.round((frameCount * 1000) / (now - lastFpsTime));
    frameCount = 0;
    lastFpsTime = now;
  }

  const dt = Math.min(clock.getDelta(), 0.1);

  if (!gameState.getState().isPaused) {
    // Atualização de entrada
    inputManager.update();

    // Atualização do Avatar
    avatar.update(
      dt,
      inputManager.state.forward,
      inputManager.state.strafe,
      (isWood) => audio.playFootstep(isWood)
    );

    // Verificação contínua de proximidade com o objetivo
    gameState.checkProximity([avatar.pos.x, avatar.pos.y, avatar.pos.z]);
    gameState.updateTime(dt);

    // Atualização dos Hero Assets e Água
    water.update(dt);
    blueBell.update(dt);
    drum.update(dt);
    waterWheel.update(dt);

    // Efeito de pulso suave no marcador de destino
    if (targetBeacon.position.y > -5) {
      targetBeacon.rotation.z += dt * 2.0;
    }
  }

  // Atualização da Câmera e Renderização
  updateCamera(dt);
  renderer.render(scene, camera);
}

// Inicializar marca
aplicarMarca('original');

// Notificar página-mãe se estiver embutido em iframe
if (window.parent && window.parent !== window) {
  window.parent.postMessage({ type: 'ready', app: 'trilha-do-mestre-mandou' }, '*');
}

function disposeAll() {
  if (isDisposed) return;
  isDisposed = true;
  isPaused = true;
  if (rafId) { cancelAnimationFrame(rafId); rafId = 0; }
  renderer.dispose();
  (audio as unknown as { dispose?: () => void })?.dispose?.();
}

window.addEventListener('sangi:pause', () => {
  isPaused = true;
  if (rafId) { cancelAnimationFrame(rafId); rafId = 0; }
});
window.addEventListener('sangi:resume', () => {
  if (isDisposed || !isPaused) return;
  isPaused = false;
  clock.getDelta();
  animate();
});
window.addEventListener('sangi:mute', () => { audio.toggleMute(); });
window.addEventListener('sangi:dispose', disposeAll);
window.addEventListener('beforeunload', disposeAll);
window.addEventListener('message', (e) => {
  if (e.data?.type === 'SANGI_APP_DISPOSE' || (e.data?.type === 'SANGI_COMMAND' && String(e.data?.command).toUpperCase() === 'DISPOSE')) {
    disposeAll();
  }
});

animate();
