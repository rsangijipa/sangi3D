import { injectLauncherButton } from '/Sistema/shared/ambientes-kit.js';
import { THREE, bootStage } from '../14-estudio-dos-limites/stage-kit.js';
import { buildStage, cast } from './puppet-stage.js';

injectLauncherButton({ label: '← Launcher', href: '/' });
const $ = id => document.getElementById(id);
const view = $('view');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x5b4535);
const camera = new THREE.PerspectiveCamera(36, 1, .1, 45);
const stage = buildStage(scene);
const $status = $('status');
const ids = Object.keys(cast);
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const copy = data => structuredClone(data);
const clamp = THREE.MathUtils.clamp;
const initial = () => ({
  backdrop: 'forest',
  light: 'amber',
  actors: Object.fromEntries(ids.map((id, i) => {
    const { x, y, face } = cast[id];
    return [id, { x, y, face, shown: i < 2, pose: 'esperar' }];
  })),
});
const makeAct = world => ({ world: copy(world), initial: null, events: [], duration: 0, narration: '', image: '' });
const acts = Array.from({ length: 3 }, () => makeAct(initial()));
const titles = ['Início', 'Meio', 'Fim', 'Cena 4', 'Cena 5', 'Cena 6'];
let index = 0;
let selected = 'fox';
let world = acts[index].world;
let recording = null;
let playback = null;
let drag = null;
let stageApi;
let thumbnail = false;
let ticking = 0;
let thumbnailFrame = 0;
const history = [];
const poses = Object.fromEntries(ids.map(id => [id, 0]));
const raycaster = new THREE.Raycaster();
const point = new THREE.Vector2();
const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), -.15);
const intersection = new THREE.Vector3();
const posedX = id => world.actors[id].x;

function draw(dt, instant) {
  if (playback && !playback.paused) advancePlayback(dt);
  let moving = !!playback && !playback.paused;
  for (const id of ids) {
    const { root, rig, head, arm, tail, rodPart } = stage.puppets[id];
    const actor = world.actors[id];
    root.visible = actor.shown;
    if (!actor.shown) continue;
    const z = .235 - ids.indexOf(id) * .09;
    const t = poses[id];
    poses[id] = Math.max(0, t - dt);
    const p = Math.min(1, t / .88);
    const arc = instant ? (t > 0 ? .63 : 0) : Math.sin(Math.PI * p);
    const wave = actor.pose === 'cumprimentar' ? (instant ? .60 : Math.sin(p * 5 * Math.PI) * arc) : 0;
    const open = actor.pose === 'ajudar' ? .87 * arc : 0;
    const hop = ['chegar', 'caminho', 'direita', 'esquerda', 'sair'].includes(actor.pose);
    const lift = hop ? arc * .085 : id === 'bird' ? wave * .063 : 0;
    const blend = (a, b) => instant || Math.abs(a - b) < .001 ? b : THREE.MathUtils.damp(a, b, 12, dt);
    root.position.set(blend(root.position.x, actor.x), blend(root.position.y, actor.y + lift), z);
    root.rotation.z = hop ? actor.face * -.15 * arc : .027 * wave;
    rig.scale.x = actor.face;
    arm.rotation.z = id === 'bird' ? clamp(wave * .61 + open * .53, -.74, .74) : .87 * wave + open;
    head.rotation.z = actor.pose === 'olhar' ? arc * .45 : -open * .29;
    tail.rotation.z = actor.pose === 'olhar' ? arc * -.17 : .32 * wave + .19 * arc;
    rodPart.scale.y = Math.max(.75, (root.position.y - .41) * 1.22 + .5);
    rodPart.position.y = (0.51 - root.position.y) * .55;
    moving ||= t > 0 || root.position.x !== actor.x || root.position.y !== actor.y;
  }
  for (const [id, part] of Object.entries(stage.backdrops)) part.visible = id === world.backdrop;
  const glow = { amber: [0xffbc78, 27], daylight: [0xffeee0, 31], moonlight: [0x96bcff, 22] }[world.light];
  stage.stageLight.color.setHex(glow[0]);
  stage.stageLight.intensity = glow[1];
  stage.mark.visible = !playback && world.actors[selected].shown;
  stage.mark.position.x = posedX(selected);
  if (thumbnail) { thumbnail = false; queueThumbnail(); }
  return moving;
}

function layout(aspect) {
  camera.aspect = aspect;
  camera.position.set(.19, 2.57, Math.max(7.80, 8.25 / aspect));
  camera.lookAt(0, 2.06, .0);
  camera.updateProjectionMatrix();
  camera.updateMatrixWorld();
}

function queueThumbnail() {
  const act = acts[index];
  if (!stageApi || !act.duration || playback) return;
  cancelAnimationFrame(thumbnailFrame);
  thumbnailFrame = requestAnimationFrame(() => {
    if (acts[index] !== act || playback) return;
    const canvas = document.createElement('canvas');
    canvas.width = 208;
    canvas.height = 110;
    stageApi.renderer.render(scene, camera);
    const source = stageApi.renderer.domElement;
    const sx = source.width * .12;
    const sy = source.height * .10;
    canvas.getContext('2d').drawImage(source, sx, sy, source.width - sx * 2, source.height - sy * 2, 0, 0, 208, 110);
    act.image = canvas.toDataURL('image/jpeg', .76);
    updateTimeline();
  });
}

function redraw() { stageApi?.redraw(); }
function status(text) { $status.textContent = text; }
function updateTimeline() {
  $('timeline').replaceChildren();
  for (const [i, act] of acts.entries()) {
    const button = document.createElement('button');
    const image = new Image();
    image.alt = '';
    if (act.image) image.src = act.image;
    const label = document.createElement('span');
    label.textContent = titles[i];
    button.className = 'act';
    button.type = 'button';
    button.setAttribute('aria-label', act.duration ? `${titles[i]}, cena gravada` : titles[i]);
    if (index === i) button.setAttribute('aria-current', 'step');
    button.disabled = !!(recording || playback);
    button.append(image, label);
    button.addEventListener('click', () => openAct(i));
    $('timeline').append(button);
  }
}
function updateControls(refreshTimeline = true) {
  if (refreshTimeline) updateTimeline();
  const blocked = !!playback;
  for (const button of $('actors').children) {
    const actor = world.actors[button.dataset.actor];
    button.setAttribute('aria-pressed', button.dataset.actor === selected);
    button.setAttribute('aria-label', `${button.textContent}, ${actor.shown ? 'no palco' : 'nos bastidores'}`);
    button.disabled = blocked;
  }
  const shown = world.actors[selected].shown;
  for (const button of document.querySelectorAll('[data-action]')) {
    button.disabled = blocked || (!shown && button.dataset.action !== 'chegar');
  }
  $('toggle-actor').textContent = shown ? 'Tirar do palco' : 'Colocar no palco';
  $('toggle-actor').disabled = blocked;
  $('backdrop').value = world.backdrop;
  $('light').value = world.light;
  $('backdrop').disabled = blocked;
  $('light').disabled = blocked;
  $('narration').disabled = blocked;
  $('narration').value = acts[index].narration;
  $('caption').textContent = acts[index].narration;
  $('add-scene').disabled = blocked || !!recording || acts.length >= 6;
  $('remove-scene').disabled = blocked || !!recording || acts.length <= 1;
  $('alternate').disabled = $('add-scene').disabled;
  $('undo').disabled = blocked || !history.length;
  $('export').disabled = blocked || !!recording;
  $('record').disabled = blocked;
  $('record').textContent = recording ? 'Parar gravação' : acts[index].duration ? 'Regravar cena' : 'Gravar cena';
  $('record').classList.toggle('recording', !!recording);
  $('play').disabled = !!recording || !acts.some(act => act.duration);
  $('play').textContent = playback ? (playback.paused ? 'Continuar' : 'Pausar') : 'Assistir';
  redraw();
}
function openAct(next) {
  index = next;
  world = acts[next].world;
  history.length = 0;
  drag = null;
  status(acts[index].duration ? 'Cena gravada. Você pode editar e regravar.' : 'Posicione os fantoches ou comece a gravar.');
  updateControls();
}
function elapsed() {
  return recording ? Math.min(30, recording.used + (recording.started ? (performance.now() - recording.started) / 1000 : 0)) : 0;
}
function recordEvent(actor, values) {
  if (!recording || recording.events.length >= 360) return;
  recording.events.push({ t: Number(elapsed().toFixed(3)), actor, values: copy(values) });
}
function snapshot() {
  history.push({ world: copy(world), events: recording?.events.length ?? 0 });
  if (history.length > 40) history.shift();
}
function applyEvent(event, target) {
  if (event.actor) {
    Object.assign(target.actors[event.actor], event.values);
    if (event.values.pose) poses[event.actor] = .88;
  } else Object.assign(target, event.values);
}
function command(action) {
  if (playback) return;
  const actor = world.actors[selected];
  if (!actor.shown && action !== 'chegar') return;
  snapshot();
  const next = { pose: action };
  if (action === 'chegar') {
    next.shown = true;
    next.x = actor.x < 0 ? -.65 : .65;
  } else if (action === 'caminho') {
    next.face = actor.face * -1;
    next.x = clamp(actor.x + next.face * .48, -1.93, 1.93);
  } else if (action === 'sair') {
    next.face = actor.x < 0 ? -1 : 1;
    next.x = next.face * 1.91;
  } else if (action === 'esquerda' || action === 'direita') {
    next.face = action === 'esquerda' ? -1 : 1;
    next.x = clamp(actor.x + next.face * .33, -1.93, 1.93);
  }
  applyEvent({ actor: selected, values: next }, world);
  recordEvent(selected, next);
  const description = { chegar: 'entrou no palco', cumprimentar: 'cumprimentou', ajudar: 'ofereceu ajuda', caminho: 'mudou de caminho', esquerda: 'se moveu à esquerda', direita: 'se moveu à direita', olhar: 'olhou em volta', esperar: 'ficou à espera', sair: 'se despediu' };
  status(`${cast[selected].name} ${description[action]}.`);
  updateControls(false);
}
function stopRecording() {
  if (!recording) return;
  const act = acts[index];
  act.initial = recording.initial;
  act.events = recording.events;
  act.duration = Math.max(1.2, Math.min(30, elapsed() + .8));
  recording = null;
  clearInterval(ticking);
  thumbnail = true;
  status(`Cena ${index + 1} gravada com ${act.events.length} ${act.events.length === 1 ? 'mudança' : 'mudanças'}.`);
  updateControls();
}
function toggleRecording() {
  if (recording) {
    stopRecording();
    return;
  }
  history.length = 0;
  recording = { initial: copy(world), events: [], started: performance.now(), used: 0 };
  ticking = setInterval(() => {
    if (elapsed() >= 29.2) stopRecording();
  }, 250);
  status('Gravando os movimentos e as mudanças de cenário.');
  updateControls();
}
function playNext() {
  playback.position++;
  if (playback.position >= playback.list.length) {
    endPlayback('A peça terminou. Você pode editar as cenas ou montar outro final.');
    return;
  }
  index = playback.list[playback.position];
  const act = acts[index];
  world = copy(act.initial);
  for (const id of ids) {
    poses[id] = 0;
    const actor = world.actors[id];
    stage.puppets[id].root.position.set(actor.x, actor.y, .235 - ids.indexOf(id) * .09);
  }
  playback.time = 0;
  playback.event = 0;
  status(`Reproduzindo a cena ${index + 1}.`);
  updateControls();
}
function advancePlayback(dt) {
  if (!playback || playback.paused) return;
  playback.time += dt;
  const act = acts[index];
  while (playback.event < act.events.length && act.events[playback.event].t <= playback.time) {
    applyEvent(act.events[playback.event++], world);
    if (!stageApi) updateControls(false);
  }
  if (playback.time >= act.duration) playNext();
}
function endPlayback(message) {
  const original = playback.original;
  playback = null;
  clearInterval(ticking);
  index = original;
  world = acts[index].world;
  status(message);
  updateControls();
}
function togglePlayback() {
  if (playback) {
    playback.paused = !playback.paused;
    status(playback.paused ? 'Reprodução em pausa. Pressione Esc para encerrar.' : `Reproduzindo a cena ${index + 1}.`);
    updateControls(false);
    return;
  }
  const list = acts.map((act, i) => act.duration > 0 ? i : -1).filter(i => i >= 0);
  if (!list.length) return;
  playback = { list, original: index, position: -1, event: 0, time: 0, paused: false };
  playNext();
  if (!stageApi) ticking = setInterval(() => advancePlayback(.033), 33);
}

for (const id of ids) {
  const button = document.createElement('button');
  button.type = 'button';
  button.dataset.actor = id;
  button.textContent = cast[id].name;
  button.addEventListener('click', () => { selected = id; updateControls(false); });
  $('actors').append(button);
}
for (const group of ['moves', 'extra-moves']) {
  $(group).addEventListener('click', event => {
    if (event.target.dataset.action) command(event.target.dataset.action);
  });
}
for (const id of ['backdrop', 'light']) {
  $(id).addEventListener('change', event => {
    snapshot();
    world[id] = event.target.value;
    recordEvent(null, { [id]: world[id] });
    status(id === 'backdrop' ? `Cenário: ${event.target.selectedOptions[0].text}.` : `Luz: ${event.target.selectedOptions[0].text}.`);
    updateControls(false);
  });
}
$('toggle-actor').addEventListener('click', () => {
  snapshot();
  const actor = world.actors[selected];
  actor.shown = !actor.shown;
  recordEvent(selected, { shown: actor.shown });
  status(`${cast[selected].name} ${actor.shown ? 'entrou no palco' : 'foi aos bastidores'}.`);
  updateControls(false);
});
$('narration').addEventListener('input', event => {
  acts[index].narration = event.target.value;
  $('caption').textContent = acts[index].narration;
});
$('undo').addEventListener('click', () => {
  const previous = history.pop();
  if (!previous) return;
  world = acts[index].world = previous.world;
  if (recording) recording.events.length = previous.events;
  status('Última mudança desfeita.');
  updateControls(false);
});
$('add-scene').addEventListener('click', () => { acts.push(makeAct(world)); openAct(acts.length - 1); });
$('remove-scene').addEventListener('click', () => {
  if (!confirm('Excluir esta cena do roteiro?')) return;
  acts.splice(index, 1);
  openAct(Math.min(index, acts.length - 1));
});
$('alternate').addEventListener('click', () => {
  const alternate = copy(acts[index]);
  alternate.initial = null;
  alternate.events = [];
  alternate.duration = 0;
  alternate.image = '';
  acts.push(alternate);
  openAct(acts.length - 1);
  status('Cena duplicada. Mude os fantoches, a narração ou o cenário para criar outro final.');
});
$('export').addEventListener('click', () => {
  const data = { version: 1, scenes: acts.map(({ image, ...act }) => act) };
  const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = 'roteiro-da-historia.json';
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  status('Roteiro salvo em JSON.');
});
$('record').addEventListener('click', toggleRecording);
$('play').addEventListener('click', togglePlayback);
window.addEventListener('keydown', event => {
  if (event.key !== 'Escape') return;
  if (playback) endPlayback('Reprodução encerrada.');
  else if (recording) stopRecording();
});
function setPoint(event, canvas) {
  const { left, top, width, height } = canvas.getBoundingClientRect();
  point.set((event.clientX - left) / width * 2 - 1, 1 - (event.clientY - top) / height * 2);
  raycaster.setFromCamera(point, camera);
}
function listenDrag(canvas) {
  canvas.addEventListener('pointerdown', event => {
    if (playback || drag || event.button !== 0) return;
    setPoint(event, canvas);
    const visible = ids.filter(id => world.actors[id].shown).map(id => stage.puppets[id].rig);
    const hit = raycaster.intersectObjects(visible, true)[0];
    if (!hit) return;
    let object = hit.object;
    while (!ids.includes(object.name)) object = object.parent;
    selected = object.name;
    plane.constant = -object.position.z;
    if (!raycaster.ray.intersectPlane(plane, intersection)) return;
    drag = { pointer: event.pointerId, x: world.actors[selected].x - intersection.x, y: world.actors[selected].y - intersection.y, last: -1, saved: false };
    canvas.setPointerCapture(event.pointerId);
    view.classList.add('dragging');
    updateControls(false);
  });
  canvas.addEventListener('pointermove', event => {
    if (event.pointerId !== drag?.pointer) return;
    setPoint(event, canvas);
    if (!raycaster.ray.intersectPlane(plane, intersection)) return;
    if (!drag.saved) { snapshot(); drag.saved = true; }
    const actor = world.actors[selected];
    actor.x = clamp(intersection.x + drag.x, -1.91, 1.91);
    actor.y = clamp(intersection.y + drag.y, .66, selected === 'bird' ? 2.18 : 1.57);
    if (elapsed() - drag.last >= .09) {
      drag.last = elapsed();
      recordEvent(selected, { x: actor.x, y: actor.y });
    }
    redraw();
  });
  const release = event => {
    if (event.pointerId !== drag?.pointer) return;
    if (drag.saved) {
      const { x, y } = world.actors[selected];
      recordEvent(selected, { x, y });
      status(`Posição de ${cast[selected].name} ajustada.`);
    }
    drag = null;
    view.classList.remove('dragging');
    updateControls(false);
  };
  canvas.addEventListener('pointerup', release);
  canvas.addEventListener('pointercancel', release);
  canvas.addEventListener('lostpointercapture', release);
}
function pauseTimer() {
  if (recording?.started) {
    recording.used = elapsed();
    recording.started = 0;
  }
}
function resumeTimer() {
  if (recording && !recording.started) recording.started = performance.now();
}
document.addEventListener('visibilitychange', () => document.hidden ? pauseTimer() : resumeTimer());
window.addEventListener('sangi:pause', pauseTimer);
window.addEventListener('sangi:resume', resumeTimer);
window.addEventListener('sangi:dispose', () => {
  clearInterval(ticking);
  cancelAnimationFrame(thumbnailFrame);
  window.removeEventListener('sangi:pause', pauseTimer);
  window.removeEventListener('sangi:resume', resumeTimer);
}, { once: true });
stageApi = bootStage(view, scene, { camera, draw, layout, environment: .38, exposure: 1.04 });
if (stageApi) listenDrag(stageApi.renderer.domElement);
if (reduced.matches) {
  const still = 'Escolha movimentos ou mude as posições. A reprodução respeita a preferência de movimento reduzido.';
  status(still);
}
updateControls();
