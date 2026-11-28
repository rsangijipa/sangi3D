// Ateliê do Gesto Lento — orquestração: cena, argila, gestos, prática guiada, estante.
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Atelier, HEAD_Y, LIGHT_LABEL, type LightMode } from './scene';
import { Clay, RINGS, SECTORS, type MarkId, type ShapeId, type Snapshot, type ToolId } from './clay';
import { AtelierAudio } from './audio';
import { STEPS } from './guide';

declare global { interface Window { __SANGI_PAUSED__?: boolean; __SANGI_MUTED__?: boolean; __atelie?: unknown } }

const $ = <T extends HTMLElement = HTMLElement>(id: string) => document.getElementById(id) as T;
const canvas = $<HTMLCanvasElement>('c');
const world = new Atelier(canvas);
const audio = new AtelierAudio();
const clay = new Clay();
const clayMesh = new THREE.Mesh(clay.geometry, world.clayMat);
clayMesh.castShadow = clayMesh.receiveShadow = true;
world.clayRoot.add(clayMesh);

const controls = new OrbitControls(world.camera, canvas);
const TARGET = new THREE.Vector3(0, HEAD_Y + 0.2, 0);
controls.target.copy(TARGET);
controls.enableDamping = true;
controls.dampingFactor = 0.08;
controls.enablePan = false;
controls.minDistance = 0.75;
controls.maxDistance = 2.6;
controls.minPolarAngle = 0.35;
controls.maxPolarAngle = 1.48;
controls.rotateSpeed = 0.6;

// ---------- Estado ----------
type Glaze = 'terracota' | 'engobe' | 'celadon' | 'raku';
type Reach = 'auto' | 'faixa' | 'local';
const state = {
  tool: 'modelar' as ToolId,
  mark: 'sulco' as MarkId,
  reach: 'auto' as Reach,
  shape: 'bojo' as ShapeId,
  pressure: 0.45,
  light: 'tarde' as LightMode,
  sound: true,
  spinning: false,
  spinSpeed: 0,
  guided: false,
  step: 0,
  contemplar: false,
  focusRing: Math.round(RINGS * 0.6),
  marks: 0,
  // contadores para a prática guiada (observações objetivas, sem nota)
  spinTime: 0, shapeWork: 0, smoothWork: 0, saved: 0, wetted: 0, idleTime: 0,
};
const undo: Snapshot[] = [];
const redo: Snapshot[] = [];
const STORE = 'atelie-gesto-lento:v2';

function pushUndo() {
  undo.push(clay.snapshot());
  if (undo.length > 40) undo.shift();
  redo.length = 0;
  syncButtons();
}

// ---------- Toast ----------
let toastT = 0;
function toast(msg: string, ms = 2600) {
  const t = $('toast');
  t.textContent = msg;
  t.classList.add('on');
  clearTimeout(toastT);
  toastT = window.setTimeout(() => t.classList.remove('on'), ms);
}

// ---------- Indicador de toque e faixa ----------
const touchRing = new THREE.Mesh(
  new THREE.TorusGeometry(0.018, 0.0025, 8, 32),
  new THREE.MeshBasicMaterial({ color: '#ffe7c7', transparent: true, opacity: 0, depthWrite: false }),
);
world.scene.add(touchRing);
const bandRing = new THREE.Mesh(
  new THREE.TorusGeometry(1, 0.0022, 6, 96),
  new THREE.MeshBasicMaterial({ color: '#f0c79f', transparent: true, opacity: 0, depthWrite: false }),
);
bandRing.rotation.x = Math.PI / 2;
world.clayRoot.add(bandRing);
let bandShow = 0;

// Gotas de barbotina (partículas) ao alisar com o torno girando.
const SPRAY = 70;
const sprayGeo = new THREE.BufferGeometry();
const sprayPos = new Float32Array(SPRAY * 3);
const sprayVel = new Float32Array(SPRAY * 3);
const sprayLife = new Float32Array(SPRAY);
sprayGeo.setAttribute('position', new THREE.BufferAttribute(sprayPos, 3));
const spray = new THREE.Points(sprayGeo, new THREE.PointsMaterial({ color: '#9a5a3e', size: 0.007, transparent: true, opacity: 0.85, depthWrite: false }));
spray.frustumCulled = false;
world.scene.add(spray);
let sprayIdx = 0;
function emitSpray(p: THREE.Vector3, n: number, wetness: number) {
  for (let k = 0; k < n; k++) {
    const i = sprayIdx++ % SPRAY;
    sprayPos[i * 3] = p.x; sprayPos[i * 3 + 1] = p.y; sprayPos[i * 3 + 2] = p.z;
    const a = Math.random() * Math.PI * 2;
    sprayVel[i * 3] = Math.cos(a) * 0.35 * wetness; sprayVel[i * 3 + 1] = 0.2 + Math.random() * 0.3; sprayVel[i * 3 + 2] = Math.sin(a) * 0.35 * wetness;
    sprayLife[i] = 0.6 + Math.random() * 0.4;
  }
}
function updateSpray(dt: number) {
  for (let i = 0; i < SPRAY; i++) {
    if (sprayLife[i] <= 0) { sprayPos[i * 3 + 1] = -10; continue; }
    sprayLife[i] -= dt;
    sprayVel[i * 3 + 1] -= 2.5 * dt;
    sprayPos[i * 3] += sprayVel[i * 3] * dt; sprayPos[i * 3 + 1] += sprayVel[i * 3 + 1] * dt; sprayPos[i * 3 + 2] += sprayVel[i * 3 + 2] * dt;
    if (sprayPos[i * 3 + 1] < 0.805) { sprayPos[i * 3 + 1] = 0.805; sprayVel[i * 3] = sprayVel[i * 3 + 1] = sprayVel[i * 3 + 2] = 0; }
  }
  sprayGeo.attributes.position.needsUpdate = true;
}

// ---------- Interação ----------
const ray = new THREE.Raycaster();
const ndc = new THREE.Vector2();
let sculpting = false;
let lastX = 0, lastY = 0, lastT = 0, travel = 0;
let gestureSpeed = 0;
let contact = 0;
let lastHit: { ringF: number; sectorF: number } | null = null;
const tmpV = new THREE.Vector3();
let lastVibe = 0;

function pick(x: number, y: number) {
  const r = canvas.getBoundingClientRect();
  ndc.set(((x - r.left) / r.width) * 2 - 1, -((y - r.top) / r.height) * 2 + 1);
  ray.setFromCamera(ndc, world.camera);
}

function reachWhole() {
  if (state.reach === 'faixa') return true;
  if (state.reach === 'local') return false;
  return state.spinSpeed > 0.35;
}

canvas.addEventListener('pointerdown', (e) => {
  audio.start();
  closeMenu();
  pick(e.clientX, e.clientY);
  const hits = ray.intersectObject(clayMesh, false);
  if (hits.length) {
    sculpting = true;
    controls.enabled = false;
    canvas.setPointerCapture(e.pointerId);
    lastX = e.clientX; lastY = e.clientY; lastT = performance.now(); travel = 0;
    pushUndo();
    handleHit(hits[0], 0, 0, true);
    return;
  }
  const th = ray.intersectObjects(world.tools, true);
  if (th.length) {
    const tool = th[0].object.userData.tool as ToolId | undefined;
    if (tool) { setTool(tool); audio.tap(); if (tool === 'alisar') wetPiece(); }
  }
});

canvas.addEventListener('pointermove', (e) => {
  if (!sculpting) {
    if (e.pointerType === 'mouse') {
      pick(e.clientX, e.clientY);
      const h = ray.intersectObject(clayMesh, false);
      canvas.style.cursor = h.length ? 'crosshair' : ray.intersectObjects(world.tools, true).length ? 'pointer' : 'grab';
    }
    return;
  }
  const now = performance.now();
  const dx = e.clientX - lastX, dy = e.clientY - lastY;
  const dt = Math.max(1, now - lastT);
  const sp = Math.hypot(dx, dy) / dt; // px/ms
  gestureSpeed = gestureSpeed * 0.8 + sp * 0.2;
  lastX = e.clientX; lastY = e.clientY; lastT = now;
  travel += Math.hypot(dx, dy);
  pick(e.clientX, e.clientY);
  const hits = ray.intersectObject(clayMesh, false);
  if (hits.length) handleHit(hits[0], dx, dy, false);
  else contact = 0;
});

function endSculpt(e: PointerEvent) {
  if (!sculpting) return;
  sculpting = false;
  controls.enabled = !state.contemplar;
  contact = 0;
  try { canvas.releasePointerCapture(e.pointerId); } catch { /* ok */ }
  saveSession();
}
canvas.addEventListener('pointerup', endSculpt);
canvas.addEventListener('pointercancel', endSculpt);

function handleHit(hit: THREE.Intersection, dx: number, dy: number, first: boolean) {
  const local = clayMesh.worldToLocal(hit.point.clone());
  const { ringF, sectorF } = clay.locate(local);
  lastHit = { ringF, sectorF };
  state.focusRing = Math.round(ringF);
  // Indicador visual de contato.
  touchRing.position.copy(hit.point);
  if (hit.face) {
    tmpV.copy(hit.face.normal).transformDirection(clayMesh.matrixWorld);
    touchRing.lookAt(hit.point.clone().add(tmpV));
  }
  const slow = 1 / (1 + gestureSpeed * 1.6); // o barro responde melhor a gestos lentos
  const whole = reachWhole();
  const opts = { whole, pressure: state.pressure, mark: state.mark, phase: 0 };
  let intensity = 0;
  if (state.tool === 'modelar') {
    if (first) return;
    // Lado da peça na tela: arrastar para fora abre, para dentro fecha.
    const axis = new THREE.Vector3(0, hit.point.y, 0).project(world.camera);
    const r = canvas.getBoundingClientRect();
    const axisX = (axis.x * 0.5 + 0.5) * r.width + r.left;
    const side = Math.sign(lastX - axisX) || 1;
    const amt = dx * side * 0.0009 * (0.5 + state.pressure) * slow;
    if (Math.abs(amt) > 0) { clay.apply('modelar', ringF, sectorF, amt, opts); state.shapeWork += Math.abs(amt); }
    intensity = Math.min(1, Math.abs(dx) / 14);
  } else if (state.tool === 'alisar') {
    const moveLen = Math.hypot(dx, dy);
    if (first || moveLen > 0) clay.apply('alisar', ringF, sectorF, 0, opts);
    state.smoothWork += moveLen * 0.01;
    intensity = Math.min(1, moveLen / 10 + 0.15);
    audio.water(intensity * 0.6);
    if (state.spinSpeed > 0.4 && Math.random() < 0.35) emitSpray(hit.point, 1, state.spinSpeed);
  } else {
    const every = state.mark === 'folha' ? 46 : 7;
    if (first || travel >= every || whole) {
      travel = 0;
      clay.apply('marcar', ringF, sectorF, 0, opts);
      state.marks += state.mark === 'folha' ? 3 : whole ? 2 : 0.4;
      if (state.mark === 'folha') audio.tap();
    }
    intensity = 0.5;
  }
  contact = Math.max(contact, intensity);
  const now = performance.now();
  if (navigator.vibrate && now - lastVibe > 140 && intensity > 0.2 && matchMedia('(pointer: coarse)').matches) {
    navigator.vibrate(6); lastVibe = now;
  }
}

// ---------- Ferramentas / UI ----------
function setPressed(sel: string, attr: string, val: string) {
  document.querySelectorAll<HTMLElement>(sel).forEach((b) => b.setAttribute('aria-pressed', String(b.dataset[attr] === val)));
}
function setTool(t: ToolId) {
  state.tool = t;
  setPressed('[data-tool]', 'tool', t);
  $('markPanel').classList.toggle('on', t === 'marcar');
  const quotes: Record<ToolId, string> = {
    modelar: '“Arraste para fora para abrir, para dentro para acinturar. O barro sobe quando você o abraça.”',
    alisar: '“A água desfaz arestas. Deixe a esponja passear sem pressa.”',
    marcar: '“Toda marca é um rastro do encontro. Não há sulco errado.”',
  };
  $('gQuote').textContent = quotes[t];
}
document.querySelectorAll<HTMLElement>('[data-tool]').forEach((b) => b.addEventListener('click', () => { audio.start(); setTool(b.dataset.tool as ToolId); }));
document.querySelectorAll<HTMLElement>('[data-mark]').forEach((b) => b.addEventListener('click', () => { state.mark = b.dataset.mark as MarkId; setPressed('[data-mark]', 'mark', state.mark); }));
document.querySelectorAll<HTMLElement>('[data-reach]').forEach((b) => b.addEventListener('click', () => { state.reach = b.dataset.reach as Reach; setPressed('[data-reach]', 'reach', state.reach); }));
document.querySelectorAll<HTMLElement>('[data-shape]').forEach((b) => b.addEventListener('click', () => {
  const s = b.dataset.shape as ShapeId;
  askConfirm(`Trocar por uma nova semente de barro (${b.textContent})? A peça atual pode ser desfeita depois.`, () => {
    pushUndo();
    state.shape = s; clay.reset(s); state.marks = 0;
    setPressed('[data-shape]', 'shape', s);
    toast('Barro novo sobre o torno.');
  }, 'Sim, trocar');
}));
const pressure = $<HTMLInputElement>('pressure');
pressure.addEventListener('input', () => {
  state.pressure = +pressure.value;
  $('pressTxt').textContent = state.pressure < 0.33 ? 'leve' : state.pressure < 0.66 ? 'suave' : 'firme';
});

function toggleSpin(on = !state.spinning) {
  audio.start();
  state.spinning = on;
  $('btnSpin').setAttribute('aria-pressed', String(on));
  $('btnSpin').lastChild!.textContent = on ? 'Parar' : 'Girar';
}
$('btnSpin').addEventListener('click', () => toggleSpin());

function wetPiece() {
  audio.start();
  pushUndo();
  clay.wetAll(0.28);
  state.wetted++;
  audio.drip(); setTimeout(() => audio.drip(), 140);
  toast('A esponja devolve umidade ao barro.');
}
$('btnWater').addEventListener('click', wetPiece);

function doUndo() { const s = undo.pop(); if (!s) return; redo.push(clay.snapshot()); clay.restore(s); syncButtons(); audio.tap(); }
function doRedo() { const s = redo.pop(); if (!s) return; undo.push(clay.snapshot()); clay.restore(s); syncButtons(); audio.tap(); }
$('btnUndo').addEventListener('click', doUndo);
$('btnRedo').addEventListener('click', doRedo);
function syncButtons() {
  ($('btnUndo') as HTMLButtonElement).disabled = !undo.length;
  ($('btnRedo') as HTMLButtonElement).disabled = !redo.length;
}

const LIGHTS: LightMode[] = ['tarde', 'manha', 'noite'];
function setLight(m: LightMode) {
  state.light = m; world.setLight(m);
  $('lightLbl').textContent = LIGHT_LABEL[m];
}
$('btnLight').addEventListener('click', () => { setLight(LIGHTS[(LIGHTS.indexOf(state.light) + 1) % 3]); toast(`Luz: ${LIGHT_LABEL[state.light]}`); });
function setSound(on: boolean) {
  state.sound = on; audio.setEnabled(on && !window.__SANGI_MUTED__);
  $('btnSound').setAttribute('aria-pressed', String(on));
}
$('btnSound').addEventListener('click', () => { audio.start(); setSound(!state.sound); });

function setContemplar(on: boolean) {
  state.contemplar = on;
  document.body.classList.toggle('contemplar', on);
  controls.autoRotate = on;
  controls.autoRotateSpeed = 0.5;
  if (on) { toggleSpin(true); toast('Contemplar: só olhar. Toque em “Voltar” quando quiser.', 3200); }
}
$('btnContemplar').addEventListener('click', () => setContemplar(true));
$('contemplarExit').addEventListener('click', () => setContemplar(false));

$('mobToggle').addEventListener('click', () => {
  const on = !document.body.classList.contains('drawer');
  document.body.classList.toggle('drawer', on);
  $('mobToggle').setAttribute('aria-pressed', String(on));
});

// Menu "Mais"
function closeMenu() { $('menu').classList.remove('on'); $('btnMore').setAttribute('aria-pressed', 'false'); }
$('btnMore').addEventListener('click', (e) => {
  e.stopPropagation();
  const on = !$('menu').classList.contains('on');
  $('menu').classList.toggle('on', on);
  $('btnMore').setAttribute('aria-pressed', String(on));
});
document.addEventListener('click', (e) => { if (!(e.target as HTMLElement).closest('#menu, #btnMore')) closeMenu(); });

function download(name: string, url: string) {
  const a = document.createElement('a');
  a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove();
}
$('mPhoto').addEventListener('click', () => {
  closeMenu();
  world.render();
  download('atelie-gesto-lento.png', canvas.toDataURL('image/png'));
  audio.tap();
  toast('Fotografia guardada.');
});
$('mObj').addEventListener('click', () => {
  closeMenu();
  const url = URL.createObjectURL(new Blob([clay.toOBJ()], { type: 'text/plain' }));
  download('peca-gesto-lento.obj', url);
  setTimeout(() => URL.revokeObjectURL(url), 2000);
  toast('Malha 3D exportada (.OBJ).');
});
$('mRecenter').addEventListener('click', () => { closeMenu(); recenter(); });
$('mReset').addEventListener('click', () => {
  closeMenu();
  askConfirm('Devolver o barro à forma inicial? Você ainda pode desfazer.', () => {
    pushUndo(); clay.reset(state.shape); state.marks = 0; toast('Recomeçar também é parte do gesto.');
  });
});
$('mClear').addEventListener('click', () => {
  closeMenu();
  askConfirm('Esvaziar a estante? As peças guardadas voltam ao barro e não podem ser recuperadas.', () => {
    shelf.splice(0).forEach((p) => disposePiece(p.mesh));
    persistShelf(); updateShelfInfo(); toast('Estante vazia, pronta para novas peças.');
  }, 'Sim, esvaziar');
});

// Modais
let confirmFn: (() => void) | null = null;
function askConfirm(text: string, fn: () => void, yes = 'Sim, recomeçar') {
  $('confirmText').textContent = text;
  $('confirmYes').textContent = yes;
  confirmFn = fn;
  $('confirmModal').classList.add('on');
  ($('confirmNo') as HTMLButtonElement).focus();
}
$('confirmYes').addEventListener('click', () => { $('confirmModal').classList.remove('on'); confirmFn?.(); confirmFn = null; });
$('confirmNo').addEventListener('click', () => { $('confirmModal').classList.remove('on'); confirmFn = null; });
$('btnHelp').addEventListener('click', () => $('helpModal').classList.add('on'));
$('helpClose').addEventListener('click', () => $('helpModal').classList.remove('on'));

// ---------- Estante ----------
interface Piece { mesh: THREE.Mesh; glaze: Glaze; data: { h: number; r: string } }
const shelf: Piece[] = [];
const GLAZE_LABEL: Record<Glaze, string> = { terracota: 'terracota natural', engobe: 'engobe branco', celadon: 'celadon vítreo', raku: 'raku esfumaçado' };
function glazeMat(g: Glaze) {
  switch (g) {
    case 'engobe': return new THREE.MeshPhysicalMaterial({ color: '#e6dccb', roughness: 0.62, sheen: 0.3, side: THREE.DoubleSide });
    case 'celadon': return new THREE.MeshPhysicalMaterial({ color: '#86ad98', roughness: 0.12, clearcoat: 1, clearcoatRoughness: 0.08, side: THREE.DoubleSide });
    case 'raku': return new THREE.MeshPhysicalMaterial({ color: '#2a2522', roughness: 0.32, metalness: 0.35, iridescence: 0.6, iridescenceIOR: 1.6, side: THREE.DoubleSide });
    default: return new THREE.MeshPhysicalMaterial({ color: '#b4643f', roughness: 0.86, side: THREE.DoubleSide });
  }
}
function makePieceMesh(geo: THREE.BufferGeometry, g: Glaze) {
  const m = new THREE.Mesh(geo, glazeMat(g));
  m.castShadow = m.receiveShadow = true;
  return m;
}
function disposePiece(m: THREE.Mesh) { world.shelfGroup.remove(m); m.geometry.dispose(); (m.material as THREE.Material).dispose(); }
function layoutShelf(animateLast = false) {
  shelf.forEach((p, i) => {
    const slot = world.shelfSlots[i];
    p.mesh.geometry.computeBoundingBox();
    const bb = p.mesh.geometry.boundingBox!;
    const size = Math.max(bb.max.x - bb.min.x, bb.max.y - bb.min.y);
    const s = Math.min(0.42, 0.3 / Math.max(size, 0.01));
    p.mesh.scale.setScalar(s);
    p.mesh.userData.target = slot.clone();
    if (!(animateLast && i === shelf.length - 1)) p.mesh.position.copy(slot);
  });
}
function updateShelfInfo() { $('shelfN').textContent = String(shelf.length); }
function persistShelf() {
  try { localStorage.setItem(STORE + ':shelf', JSON.stringify(shelf.map((p) => ({ g: p.glaze, d: p.data })))); } catch { /* armazenamento indisponível */ }
}
function loadShelf() {
  try {
    const raw = localStorage.getItem(STORE + ':shelf');
    if (!raw) return;
    const arr = JSON.parse(raw) as { g: Glaze; d: { h: number; r: string } }[];
    for (const it of arr.slice(0, 4)) {
      const snap = Clay.decode(it.d);
      if (!snap) continue;
      const c = new Clay(); c.restore(snap); c.rebuild();
      const mesh = makePieceMesh(c.geometry, it.g);
      world.shelfGroup.add(mesh);
      shelf.push({ mesh, glaze: it.g, data: it.d });
    }
    layoutShelf();
    updateShelfInfo();
  } catch { /* ignora dados antigos */ }
}
$('btnSave').addEventListener('click', () => { audio.start(); $('glazeModal').classList.add('on'); });
$('glazeCancel').addEventListener('click', () => $('glazeModal').classList.remove('on'));
document.querySelectorAll<HTMLElement>('[data-glaze]').forEach((b) => b.addEventListener('click', () => {
  $('glazeModal').classList.remove('on');
  savePiece(b.dataset.glaze as Glaze);
}));
function savePiece(g: Glaze) {
  clay.rebuild();
  if (shelf.length >= 4) { const old = shelf.shift()!; disposePiece(old.mesh); }
  const geo = clay.geometry.clone();
  const mesh = makePieceMesh(geo, g);
  const start = new THREE.Vector3();
  clayMesh.getWorldPosition(start);
  mesh.position.copy(start);
  world.shelfGroup.add(mesh);
  shelf.push({ mesh, glaze: g, data: clay.serialize() });
  layoutShelf(true);
  mesh.userData.fly = 0;
  mesh.userData.from = start.clone();
  persistShelf(); updateShelfInfo();
  state.saved++;
  audio.chime();
  toast(`Peça guardada na estante em ${GLAZE_LABEL[g]}.`);
}

// ---------- Prática guiada ----------
const stepsEl = $('gSteps');
STEPS.forEach(() => stepsEl.appendChild(document.createElement('i')));
const stepDone = STEPS.map(() => false);
function renderGuide() {
  const s = STEPS[state.step];
  $('gStep').textContent = `Convite ${state.step + 1} / ${STEPS.length}`;
  $('gTitle').textContent = s.title;
  $('gText').textContent = s.text;
  $('gNote').textContent = stepDone[state.step] ? s.done : '';
  [...stepsEl.children].forEach((el, i) => { el.className = stepDone[i] ? 'done' : i === state.step ? 'cur' : ''; });
  ($('gPrev') as HTMLButtonElement).disabled = state.step === 0;
  $('gNext').textContent = state.step === STEPS.length - 1 ? 'Concluir' : 'Próximo →';
  if (s.tool) setTool(s.tool);
}
function setGuided(on: boolean) {
  state.guided = on;
  $('guide').classList.toggle('on', on);
  $('btnGuide').setAttribute('aria-pressed', String(on));
  if (on) { state.step = 0; stepDone.fill(false); resetCounters(); renderGuide(); }
}
function resetCounters() { state.spinTime = 0; state.shapeWork = 0; state.smoothWork = 0; state.wetted = 0; state.idleTime = 0; state.saved = 0; state.marks = 0; }
$('btnGuide').addEventListener('click', () => setGuided(!state.guided));
$('gPrev').addEventListener('click', () => { if (state.step > 0) { state.step--; renderGuide(); } });
$('gNext').addEventListener('click', () => {
  if (state.step < STEPS.length - 1) { state.step++; renderGuide(); }
  else { setGuided(false); audio.chime(); toast('Prática concluída. O ateliê continua aberto, sem pressa.', 3600); }
});
function checkGuide() {
  if (!state.guided || stepDone[state.step]) return;
  if (STEPS[state.step].check(state)) {
    stepDone[state.step] = true;
    audio.chime(false);
    renderGuide();
  }
}

// ---------- Teclado ----------
addEventListener('keydown', (e) => {
  if ((e.target as HTMLElement).tagName === 'INPUT') return;
  const k = e.key.toLowerCase();
  if (document.querySelector('.modal.on')) { if (k === 'escape') document.querySelectorAll('.modal.on').forEach((m) => { if (m.id !== 'intro') m.classList.remove('on'); }); return; }
  if ((e.ctrlKey || e.metaKey) && k === 'z') { e.preventDefault(); e.shiftKey ? doRedo() : doUndo(); return; }
  if ((e.ctrlKey || e.metaKey) && k === 'y') { e.preventDefault(); doRedo(); return; }
  audio.start();
  if (k === '1') setTool('modelar');
  else if (k === '2') setTool('alisar');
  else if (k === '3') setTool('marcar');
  else if (k === ' ') { e.preventDefault(); toggleSpin(); }
  else if (k === 'w') wetPiece();
  else if (k === 's') $('glazeModal').classList.add('on');
  else if (k === 'l') $('btnLight').click();
  else if (k === 'm') setSound(!state.sound);
  else if (k === 'g') setGuided(!state.guided);
  else if (k === 'c') setContemplar(!state.contemplar);
  else if (k === 'escape' && state.contemplar) setContemplar(false);
  else if (k === 'h') $('helpModal').classList.add('on');
  else if (k === 'arrowup' || k === 'arrowdown') { e.preventDefault(); state.focusRing = THREE.MathUtils.clamp(state.focusRing + (k === 'arrowup' ? 2 : -2), 2, RINGS - 1); bandShow = 2; }
  else if (k === '+' || k === '=' || k === '-' || k === '_') {
    pushUndo();
    const amt = (k === '+' || k === '=' ? 1 : -1) * 0.006;
    clay.apply('modelar', state.focusRing, 0, amt, { whole: true, pressure: state.pressure, mark: state.mark, phase: 0 });
    state.shapeWork += 0.006; bandShow = 2; saveSession();
  }
});

// ---------- Sessão ----------
function saveSession() {
  try { localStorage.setItem(STORE + ':peca', JSON.stringify({ shape: state.shape, light: state.light, ...clay.serialize() })); } catch { /* ok */ }
}
function loadSession() {
  try {
    const raw = localStorage.getItem(STORE + ':peca');
    if (!raw) return;
    const d = JSON.parse(raw);
    const snap = Clay.decode(d);
    if (snap) { snap.wet.fill(0.5); clay.restore(snap); }
    if (d.shape) { state.shape = d.shape; setPressed('[data-shape]', 'shape', d.shape); }
    if (d.light && LIGHTS.includes(d.light)) setLight(d.light);
  } catch { /* ok */ }
}

// ---------- Câmera ----------
let camAnim = 0;
const camFrom = new THREE.Vector3(), camTo = new THREE.Vector3();
function homeCam() {
  const portrait = innerWidth < innerHeight;
  return portrait ? new THREE.Vector3(0, 1.66, 2.05) : new THREE.Vector3(0.1, 1.52, 1.62);
}
function recenter() { camFrom.copy(world.camera.position); camTo.copy(homeCam()); camAnim = 1; controls.target.copy(TARGET); }
world.camera.position.copy(homeCam()).add(new THREE.Vector3(0.6, 0.5, 1.2));
recenter();

// ---------- Intro ----------
function begin(guided: boolean) {
  audio.start();
  setSound(state.sound);
  $('intro').classList.remove('on');
  setGuided(guided);
  canvas.focus();
}
$('startGuided').addEventListener('click', () => begin(true));
$('startFree').addEventListener('click', () => begin(false));

// ---------- Laço ----------
const clock = new THREE.Clock();
let elapsed = 0;
let hudT = 0;
let paused = false;
document.addEventListener('visibilitychange', () => { if (document.hidden) audio.suspend(); else if (!window.__SANGI_PAUSED__) audio.resume(); });
addEventListener('sangi:pause', () => { paused = true; audio.suspend(); });
addEventListener('sangi:resume', () => { paused = false; audio.resume(); });
addEventListener('sangi:mute', () => audio.setEnabled(false));
addEventListener('sangi:unmute', () => audio.setEnabled(state.sound));
addEventListener('resize', () => { world.resize(); });

let lastWet = 0.6;
function updateHUD() {
  const st = clay.stats();
  lastWet = st.wet;
  $('wetTxt').textContent = st.wet > 0.7 ? 'brilhante, úmida' : st.wet > 0.4 ? 'macia' : st.wet > 0.2 ? 'firme' : 'seca — pede água';
  ($('wetBar') as HTMLElement).style.width = `${Math.round(st.wet * 100)}%`;
  const mk = Math.min(1, state.marks / 40);
  $('markTxt').textContent = mk < 0.05 ? 'liso' : mk < 0.4 ? 'alguns rastros' : mk < 0.8 ? 'texturizada' : 'muito marcada';
  ($('markBar') as HTMLElement).style.width = `${Math.max(4, mk * 100)}%`;
  $('dimH').textContent = `${(st.height * 50).toFixed(1)} cm`;
  $('dimW').textContent = `${(st.topR * 2 * 50).toFixed(1)} cm`;
  const g = $('gState'), s = $('gSpeed');
  if (sculpting && contact > 0.05) {
    g.textContent = gestureSpeed > 1.2 ? 'Gesto apressado' : gestureSpeed > 0.45 ? 'Gesto em fluxo' : 'Gesto lento';
    s.textContent = gestureSpeed > 1.2 ? 'o barro escorrega' : 'o barro acompanha';
  } else { g.textContent = state.spinSpeed > 0.3 ? 'Torno girando' : 'Em repouso'; s.textContent = state.spinSpeed > 0.3 ? 'presença no giro' : '—'; }
}

function loop() {
  requestAnimationFrame(loop);
  const dt = Math.min(clock.getDelta(), 1 / 20);
  if (paused || window.__SANGI_PAUSED__) return;
  elapsed += dt;
  // Torno com inércia.
  const target = state.spinning ? 1 : 0;
  state.spinSpeed += (target - state.spinSpeed) * Math.min(1, dt * (state.spinning ? 1.4 : 0.8));
  world.wheelHead.rotation.y -= state.spinSpeed * 3.4 * dt;
  if (state.spinSpeed > 0.3) state.spinTime += dt;
  audio.wheel(state.spinSpeed);
  // Contato contínuo com o torno girando: segurar o toque também modela.
  if (sculpting && lastHit && state.spinSpeed > 0.4 && state.tool === 'alisar') {
    clay.apply('alisar', lastHit.ringF, lastHit.sectorF, 0, { whole: true, pressure: state.pressure * 0.4, mark: state.mark, phase: 0 });
    contact = Math.max(contact, 0.3);
  }
  if (!sculpting) { contact *= 0.85; state.idleTime += dt; } else state.idleTime = 0;
  audio.clay(contact * (state.tool === 'alisar' ? 0.6 : 1), lastWet);
  if (!sculpting) audio.water(0);
  clay.dry(dt, state.spinSpeed > 0.3);
  clay.rebuild();

  // Indicadores.
  const tm = touchRing.material as THREE.MeshBasicMaterial;
  tm.opacity += ((sculpting ? 0.85 : 0) - tm.opacity) * 0.2;
  bandShow = Math.max(0, bandShow - dt);
  const bm = bandRing.material as THREE.MeshBasicMaterial;
  bm.opacity += ((bandShow > 0 ? 0.8 : 0) - bm.opacity) * 0.15;
  if (bm.opacity > 0.01) {
    const r = state.focusRing;
    let m = 0; for (let s = 0; s < SECTORS; s++) m += clay.rad[r * SECTORS + s];
    m /= SECTORS;
    bandRing.scale.setScalar(m + 0.006);
    bandRing.position.y = clay.ringY(r);
  }
  updateSpray(dt);

  // Peças voando para a estante.
  for (const p of shelf) {
    const u = p.mesh.userData;
    if (u.fly === undefined) continue;
    u.fly = Math.min(1, u.fly + dt * 0.7);
    const e = 1 - Math.pow(1 - u.fly, 3);
    p.mesh.position.lerpVectors(u.from, u.target, e);
    p.mesh.position.y += Math.sin(e * Math.PI) * 0.35;
    if (u.fly >= 1) delete u.fly;
  }

  world.highlightTool(state.tool, elapsed);
  world.animate(elapsed, dt);
  if (camAnim > 0) {
    camAnim = Math.max(0, camAnim - dt * 0.9);
    const e = 1 - camAnim * camAnim;
    world.camera.position.lerpVectors(camFrom, camTo, e);
  }
  controls.update();
  world.render();

  hudT += dt;
  if (hudT > 0.2) { hudT = 0; updateHUD(); checkGuide(); }
}

// ---------- Início ----------
setTool('modelar');
setLight('tarde');
loadSession();
loadShelf();
syncButtons();
updateHUD();
world.render();
$('loader').classList.add('off');
loop();
window.__atelie = { state, clay, world };
