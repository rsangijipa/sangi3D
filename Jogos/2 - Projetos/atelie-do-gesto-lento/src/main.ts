import { ClayConfig } from './types';
import { ClayGeometry } from './clay/ClayGeometry';
import { ClaySolver } from './clay/ClaySolver';
import { ClayHistory } from './clay/ClayHistory';
import { WorkshopScene } from './scene/WorkshopScene';
import { MaterialAudio } from './audio/MaterialAudio';
import { PointerController } from './interaction/PointerController';
import { SessionStore } from './session/SessionStore';
import { GuidedSession } from './guided/GuidedSession';
import { UIManager } from './ui/UIManager';

// Detect mobile screen for optimized ring/segment counts
const isMobile = window.innerWidth <= 768;
const clayConfig: ClayConfig = {
  rings: isMobile ? 28 : 40,
  segments: isMobile ? 64 : 96,
  height: 0.23,
  minThickness: 0.008,
  targetThickness: 0.012,
  baseThickness: 0.018,
  minRadius: 0.035,
  maxRadius: 0.22
};

// 1. Initialize Core Subsystems
const geometry = new ClayGeometry(clayConfig);
const solver = new ClaySolver(clayConfig);
const history = new ClayHistory();
const audio = new MaterialAudio();

const container = document.getElementById('stage') || document.body;
const scene = new WorkshopScene(container, geometry);

const pointerCtrl = new PointerController(scene, solver, geometry, history, audio);
const store = new SessionStore();
const guided = new GuidedSession();

// 2. Initialize UI Manager
const ui = new UIManager(scene, solver, geometry, history, pointerCtrl, audio, guided, store);

// 3. Connect storage debouncing to clay modifications
pointerCtrl.setCallbacks(
  () => {
    ui.updateUndoRedoButtons();
    guided.onSculptAction();
    store.saveDebounced(ui.buildSessionData());
  },
  () => {
    ui.showToast('Aqui a argila já está bem fina. Experimente outra região.');
  }
);

// 4. Try loading existing saved piece from IndexedDB
store.loadCurrent().then(saved => {
  if (saved && saved.radii && saved.radii.length === solver.radii.length) {
    solver.restoreFromSnapshot(
      new Float32Array(saved.radii),
      new Float32Array(saved.thickness),
      new Float32Array(saved.marks),
      saved.height,
      saved.rotation
    );
    scene.props.setWheelRotation(saved.rotation);
    geometry.updatePositions(solver.radii, solver.thickness, solver.marks, solver.height);
    ui.showToast('Peça recuperada deste dispositivo');
  } else {
    // Initial update from standard preset
    geometry.updatePositions(solver.radii, solver.thickness, solver.marks, solver.height);
  }
});

// 5. Main Animation Loop
let lastTime = performance.now();
let isPageVisible = true;

document.addEventListener('visibilitychange', () => {
  isPageVisible = !document.hidden;
  if (!isPageVisible) {
    audio.stopContact();
    if (guided.state !== 'IDLE' && guided.state !== 'PAUSED') {
      guided.pause();
    }
  } else {
    lastTime = performance.now();
  }
});

function animate(currentTime: number) {
  requestAnimationFrame(animate);

  if (!isPageVisible) return;

  const deltaSeconds = Math.min(0.1, (currentTime - lastTime) / 1000.0);
  lastTime = currentTime;

  // Relax wetness gloss over time
  geometry.relaxWetness(deltaSeconds);

  // Update guided session time
  guided.updateTime();

  // Update scene (camera transitions & orbit controls)
  scene.update();

  // Render frame
  scene.render();
}

requestAnimationFrame(animate);
console.log('Ateliê do Gesto Lento modular inicializado com sucesso.');
