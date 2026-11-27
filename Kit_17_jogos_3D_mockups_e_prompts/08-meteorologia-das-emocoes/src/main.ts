/**
 * Meteorologia das Emocoes — ponto de entrada.
 * Orquestra estado, cena 3D, entrada e UI. Um comando por interacao.
 */

import './style.css';
import { createState, reducer, type GameState, type Action } from './game/state.js';
import { Scene3D } from './scene/index.js';
import { InputController } from './input/actions.js';
import { UIManager, type UiCallbacks } from './ui/index.js';
import { audioManager } from './audio/index.js';
import { readableSummary } from './game/rules.js';

const APP_CONTAINER = 'app';
const CANVAS_ID = 'glcanvas';

function isMobile(): boolean {
  return window.innerWidth <= 720;
}

function main(): void {
  const app = document.getElementById(APP_CONTAINER)!;
  const canvas = document.getElementById(CANVAS_ID)! as HTMLCanvasElement;
  const loader = document.getElementById('loader')!;
  const hud = document.getElementById('hud')!;
  const overlays = document.getElementById('overlays')!;

  if (!window.WebGLRenderingContext && !(window as any).WebGL2RenderingContext) {
    loader.remove();
    app.innerHTML = '<div class="overlay" style="margin:40px"><p>Seu navegador nao suporta WebGL.</p><p>Tente outro navegador ou dispositivo.</p></div>';
    return;
  }
  const glCanvas = document.createElement('canvas');
  const gl = glCanvas.getContext('webgl') || glCanvas.getContext('webgl2');
  if (!gl) {
    loader.remove();
    app.innerHTML = '<div class="overlay" style="margin:40px"><p>Nao foi possivel inicializar o WebGL.</p></div>';
    return;
  }

  const mobile = isMobile();
  const dpr = Math.min(window.devicePixelRatio || 1, mobile ? 1.5 : 2);
  loader.style.display = 'none';

  let state: GameState = createState();
  const scene = new Scene3D(canvas, { mobile, dpr });
  let input: InputController | null = new InputController(scene, dispatch, () => state);

  const ui: UiCallbacks = {
    onWeatherChange: (kind, delta) => {
      const cur = state.weather[kind];
      const next = Math.min(4, Math.max(0, cur + delta));
      dispatch({ type: 'SET_WEATHER', kind, value: next });
    },
    onTagToggle: (tag) => {
      dispatch({ type: state.emotionTags.includes(tag) ? 'REMOVE_TAG' : 'ADD_TAG', tag });
    },
    onBulletinChange: (text) => dispatch({ type: 'SET_BULLETIN', text }),
    onSaveBulletin: () => {
      dispatch({ type: 'SAVE_SNAPSHOT', label: `Composicao ${state.snapshots.length + 1}` });
    },
    onClearBulletin: () => {
      dispatch({ type: 'CLEAR_BULLETIN' });
    },
    onRestart: (confirmed) => {
      dispatch({ type: 'RESET_SESSION', confirmed });
      if (confirmed) {
        scene.setTargetWeather(state.weather);
        syncAudio();
        if (input) input.destroy();
        input = new InputController(scene, dispatch, () => state);
      }
    },
    onExport: () => {
      const summary = {
        version: state.version,
        seed: state.seed,
        mode: state.mode,
        step: state.step,
        weather: state.weather,
        emotionTags: state.emotionTags,
        bulletin: state.bulletin,
        snapshots: state.snapshots,
        counters: state.counters,
        startedAt: state.startedAt,
        completedAt: state.completedAt,
        readable: readableSummary(state),
      };
      const blob = new Blob([JSON.stringify(summary, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'meteorologia-das-emocoes-resumo.json';
      a.click();
      URL.revokeObjectURL(url);
      audioManager.playUiClick('confirm');
    },
    onStart: (mode) => {
      state = reducer(state, { type: 'START_SESSION' });
      state = reducer(state, { type: 'SET_MODE', mode });
      ensureAudio();
      dispatch({ type: 'TOGGLE_STEP', step: 'compose' });
    },
    onStepChange: (step) => dispatch({ type: 'TOGGLE_STEP', step }),
  };

  function syncAudio(): void {
    if (state.audio.master) {
      audioManager.setRain(state.audio.rain);
      audioManager.setWind(state.audio.wind);
    } else {
      audioManager.setRain(false);
      audioManager.setWind(false);
    }
  }
  function dispatch(action: Action): void {
    if (disposed) return;
    state = reducer(state, action);
    scene.setTargetWeather(state.weather);
    syncAudio();
    uiManager?.render(state);

    if (state.step === 'exit') {
      state.completedAt = Date.now();
      uiManager?.openSummary(state);
      scene.render();
      return;
    }
    scene.render();
  }

  let audioStarted = false;
  function ensureAudio(): void {
    if (audioStarted) return;
    if (audioManager.ensureStarted()) {
      audioStarted = true;
      syncAudio();
    }
  }
  window.addEventListener('pointerdown', ensureAudio, { once: true });
  window.addEventListener('keydown', ensureAudio, { once: true });

  let uiManager: UIManager | null = null;
  let last = performance.now();
  let paused = false;
  let disposed = false;
  let rafId = 0;
  function frame(now: number): void {
    if (disposed || paused) { rafId = 0; return; }
    rafId = requestAnimationFrame(frame);
    const dt = Math.min((now - last) / 1000, 0.25);
    last = now;
    if (document.visibilityState !== 'hidden') {
      scene.update(dt, state.weather);
      scene.render();
    }
  }
  rafId = requestAnimationFrame(frame);

  window.addEventListener('visibilitychange', () => {
    paused = document.visibilityState === 'hidden';
    if (!paused && !disposed) {
      last = performance.now();
      if (!rafId) rafId = requestAnimationFrame(frame);
    }
  });

  const disposeAll = (): void => {
    if (disposed) return;
    disposed = true;
    paused = true;
    if (rafId) { cancelAnimationFrame(rafId); rafId = 0; }
    scene.dispose();
    audioManager.dispose();
  };
  window.addEventListener('sangi:pause', () => {
    paused = true;
    if (rafId) { cancelAnimationFrame(rafId); rafId = 0; }
  });
  window.addEventListener('sangi:resume', () => {
    if (disposed || !paused) return;
    paused = false;
    last = performance.now();
    rafId = requestAnimationFrame(frame);
  });
  window.addEventListener('sangi:mute', (e) => {
    const muted = Boolean((e as CustomEvent<{ muted?: boolean }>)?.detail?.muted);
    audioManager.setRain(!muted && state.audio.rain);
    audioManager.setWind(!muted && state.audio.wind);
  });
  window.addEventListener('sangi:dispose', disposeAll);
  window.addEventListener('beforeunload', disposeAll);
  (window as unknown as { __SANGI_QA__?: unknown }).__SANGI_QA__ = {
    get info() {
      return {
        calls: scene.renderer.info.render.calls,
        triangles: scene.renderer.info.render.triangles,
        paused,
        disposed,
      };
    },
  };

  uiManager = new UIManager(hud, overlays, ui, () => state);
  uiManager.openStartOverlay();

  window.addEventListener('resize', () => {
    if (disposed) return;
    scene.onResize(isMobile());
  });
}

document.addEventListener('DOMContentLoaded', main);

