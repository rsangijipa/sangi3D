import { injectLauncherButton } from '/Sistema/shared/ambientes-kit.js';
import {
  THREE, mesh, profile, makePlant, materialKit, panel, extrude, line, rod, arch,
  drape, tieCurtain, floorBoards, room, bookcase, bootStage, lightStage,
} from './stage-kit.js';

injectLauncherButton({ label: '← Launcher', href: '/' });

const $ = id => document.getElementById(id);
const situations = [
  { name: 'Pedir espaço', prompt: 'A outra pessoa chegou mais perto.', soft: ['Preciso de um pouco mais de espaço.', 'Podemos conversar um pouco mais afastados?'], firm: ['Por favor, dê um passo para trás.', 'Quero ficar aqui com mais espaço.'] },
  { name: 'Encerrar uma conversa', prompt: 'A outra pessoa quer continuar conversando.', soft: ['Prefiro parar por aqui por enquanto.', 'Podemos continuar outro dia?'], firm: ['Preciso encerrar a conversa agora.', 'Vou sair da conversa agora.'] },
  { name: 'Recusar um empréstimo', prompt: 'A outra pessoa pede seu objeto emprestado.', soft: ['Hoje prefiro ficar com meu material.', 'Você pode procurar outro para usar?'], firm: ['Não vou emprestar esse objeto.', 'Quero que ele fique comigo.'] },
  { name: 'Pedir uma pausa no barulho', prompt: 'Há bastante barulho na sala.', soft: ['Vou lá fora respirar um pouco.', 'Podemos ir para um lugar mais tranquilo?'], firm: ['Preciso de silêncio agora.', 'Vou fazer uma pausa em outro lugar.'] },
  { name: 'Recusar um convite', prompt: 'A outra pessoa convida você para participar.', soft: ['Agradeço o convite, mas vou ficar aqui.', 'Hoje prefiro só observar.'], firm: ['Não vou participar agora.', 'Minha escolha é ficar de fora.'] },
  { name: 'Recusar um abraço', prompt: 'A outra pessoa pergunta se pode abraçar você.', soft: ['Hoje prefiro cumprimentar com a mão.', 'Podemos só dar oi?'], firm: ['Prefiro que você não me abrace.', 'Não quero um abraço agora.'] },
];
const state = { situation: 0, tone: 'suave', choice: 0, distance: 3, turn: 0, curtain: false, lateral: false, gesture: 'neutral', cue: 0 };
const from = (value, target, speed, dt, instant) => instant || Math.abs(value - target) < .001 ? target : THREE.MathUtils.damp(value, target, speed, dt);
const view = $('view');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x5a4233);
const camera = new THREE.PerspectiveCamera(37, 1, .1, 42);
const look = new THREE.Vector3(0, 1.96, -.05);
const position = new THREE.Vector3();
const moveTo = new THREE.Vector3();
const inkAnchor = new THREE.Vector3(0, 2.10, -.97);
const projected = new THREE.Vector3();
const materials = materialKit();
const colors = {
  oak: materials.wood(0xcf965a), trim: materials.wood(0xe4b47a), walnut: materials.wood(0x7e4c30),
  linen: materials.linen(0xfbe0ae), cloth: materials.velvet(0x7f303a), rope: materials.linen(0xd9b58a),
  paper: materials.paper(0xf6d7a8), red: materials.linen(0xb76850),
};
room(scene, materials, { wall: 0xa68465, floor: 0xa36e46, rug: 0xe6c59a });
const stage = new THREE.Group();
scene.add(stage);

const platform = new THREE.Shape();
platform.moveTo(-3.05, -1.36);
platform.lineTo(3.05, -1.36);
platform.lineTo(3.05, .57);
platform.bezierCurveTo(3.05, 1.87, -3.05, 1.87, -3.05, .57);
platform.closePath();
const riser = mesh(stage, extrude(platform, .27, .038), colors.oak, 0, .30, 0);
riser.rotation.x = Math.PI / 2;
floorBoards(stage, colors.trim, 6.02, 23, 2.07, .305, -.31);
const bentEdge = [[-3, .19, .52], [-2.65, .19, .92], [-1.6, .19, 1.20], [0, .19, 1.31], [1.6, .19, 1.20], [2.65, .19, .92], [3, .19, .52]];
line(stage, bentEdge, .027, colors.walnut);
for (const x of [-1, 1]) panel(stage, .24, 3.74, 1.65, .025, colors.walnut, x * 3.07, 1.87, -.42);
panel(stage, 6.22, 3.74, .18, .035, colors.walnut, 0, 1.86, -1.59);
const rearSlats = new THREE.InstancedMesh(new THREE.BoxGeometry(.23, 3.28, .028), colors.walnut, 25);
const dummy = new THREE.Object3D();
for (let i = 0; i < 25; i++) {
  dummy.position.set((i - 12) * .242, 1.96, -1.48);
  dummy.updateMatrix();
  rearSlats.setMatrixAt(i, dummy.matrix);
  rearSlats.setColorAt(i, new THREE.Color().setScalar(.8 + (i * 13 % 17) / 90));
}
rearSlats.receiveShadow = true;
stage.add(rearSlats);
arch(stage, colors.walnut, 6.70, .12, 2.98, 4.00, .34, .63);
arch(stage, colors.oak, 6.48, .19, 2.91, 3.92, .26, .80);
arch(stage, colors.trim, 6.29, .29, 2.85, 3.81, .059, .86);
panel(stage, 6.06, .36, .24, .030, colors.walnut, 0, 3.67, .31).castShadow = false;
panel(stage, 5.98, .06, .17, .015, colors.trim, 0, 3.55, .37).castShadow = false;
const left = drape(stage, colors.cloth, -2.98, { top: 3.64, bottom: .32, open: 1.70, z: .51 });
const right = drape(stage, colors.cloth, 2.98, { top: 3.64, bottom: .32, open: 1.70, z: .51 });
const ties = [-1, 1].map(side => tieCurtain(stage, side * 2.99, 1.18, .68, .62, colors.rope));

bookcase(scene, materials, -3.93, -.44, -1);
bookcase(scene, materials, 3.95, -1.52, 1);
const pot = materials.paper(0xe2c5a4);
makePlant(scene, 3.48, 1.21, 1.3, 19, pot);
makePlant(scene, -3.49, -.66, .73, 3, pot, 3.31);
mesh(scene, profile([[0, 0], [.37, .01], [.42, .11], [.41, .25], [.29, .33], [0, .36]], 36), materials.linen(0x5b6043), -3.30, 0, 2.07);

function chair(x) {
  const chair = new THREE.Group();
  chair.position.set(x, .334, .365);
  stage.add(chair);
  const bent = colors.oak;
  const seat = panel(chair, .76, .70, .083, .032, bent, 0, .62, 0);
  seat.rotation.x = -Math.PI / 2;
  const cushion = panel(chair, .71, .64, .10, .045, colors.linen, 0, .687, .018);
  cushion.rotation.x = -Math.PI / 2;
  const piping = [
    [-.324, .704, .257], [0, .722, .313], [.324, .704, .257], [.348, .704, .01], [.317, .704, -.26],
    [0, .705, -.285], [-.317, .704, -.26], [-.348, .704, .01], [-.324, .704, .257],
  ];
  line(chair, piping, .013, colors.rope);
  for (const side of [-1, 1]) {
    const x = side * .285;
    rod(chair, [x, .63, .24], [x * 1.14, .035, .31], .049, bent, .78);
    line(chair, [[x * 1.13, .045, -.32], [x, .53, -.235], [x, .92, -.29], [x, 1.22, -.34]], .044, bent, true);
    rod(chair, [x, .29, -.27], [x, .32, .28], .018, colors.walnut);
    const rivet = mesh(chair, new THREE.SphereGeometry(.024, 12, 8), materials.brass, x, .59, .334, false);
    rivet.scale.z = .45;
  }
  const back = panel(chair, .72, .51, .10, .048, bent, 0, 1.13, -.32);
  back.rotation.x = -.15;
  const pillow = panel(chair, .64, .45, .08, .037, colors.linen, 0, 1.14, -.24);
  pillow.rotation.x = -.15;
  return chair;
}
const chairA = chair(-1.23);
const chairB = chair(1.23);

const easel = new THREE.Group();
stage.add(easel);
rod(easel, [-.71, .34, -1.17], [-.27, 2.53, -1.09], .058, colors.oak);
rod(easel, [.71, .34, -1.17], [.27, 2.53, -1.09], .058, colors.oak);
rod(easel, [.12, .35, -1.50], [0, 2.49, -.98], .044, colors.walnut);
panel(easel, 1.65, .09, .16, .02, colors.oak, 0, 1.61, -.96);
panel(easel, 2.23, 1.04, .061, .045, colors.paper, 0, 2.14, -.98);
for (const x of [-.91, .91]) mesh(easel, new THREE.SphereGeometry(.033, 10, 8), materials.brass, x, 2.59, -.934, false).scale.z = .35;

const markers = new THREE.Group();
stage.add(markers);
const mark = new THREE.MeshStandardMaterial({ color: 0xf9e4ae, emissive: 0xb07943, emissiveIntensity: .26, roughness: .8 });
for (const side of [-1, 1]) {
  const arrow = new THREE.Shape();
  arrow.moveTo(0, -.055); arrow.lineTo(side * .14, 0); arrow.lineTo(0, .055);
  arrow.lineTo(0, .017); arrow.lineTo(side * -.21,.017); arrow.lineTo(side * -.21,-.017); arrow.lineTo(0,-.017);
  const point = mesh(markers, extrude(arrow, .006, .004), mark, side * .47, .352, .74, false);
  point.rotation.x = -Math.PI / 2.8;
}
for (let i = -2; i <= 2; i++) mesh(markers, new THREE.SphereGeometry(.023 - Math.abs(i) * .002, 10, 7), mark, i * .099, .354, .741, false).scale.y = .45;

const bulb = new THREE.MeshStandardMaterial({ color: 0xffe1aa, emissive: 0xffb05e, emissiveIntensity: 2.7, roughness: .5 });
rod(stage, [-1.97, 3.42, .14], [1.97, 3.42, .14], .033, materials.brass);
for (const x of [-1.37, 0, 1.37]) {
  const housing = new THREE.Group();
  housing.position.set(x, 3.21, .12);
  housing.rotation.set(-.42, 0, -x * .14);
  stage.add(housing);
  mesh(housing, profile([[0, .11], [.06, .11], [.10, .045], [.098, -.012], [.155, -.16], [.16, -.181], [.137, -.181], [.126, -.151], [.055, -.038], [0, -.038]], 40), materials.brass, 0, 0, 0);
  mesh(housing, new THREE.SphereGeometry(.098, 20, 12), bulb, 0, -.143, 0).scale.y = .28;
  const lamp = new THREE.SpotLight(0xffbe76, 14, 7, .43, .73, 1.2);
  lamp.position.set(x, 3.04, .16);
  lamp.target.position.set(x * .79, .27, -.35);
  stage.add(lamp, lamp.target);
}
const keyLight = lightStage(scene, [0, 1.52, .12], { key: 3.5, fill: .83, position: [-3, 6, 6], shadow: innerWidth <= 680 ? 1024 : 2048 });

let curtain = 0;
let aspect = 1;
let cue = 0;
let variant = 0;
let previous = null;
let stageApi;
function layout(nextAspect) {
  aspect = nextAspect;
  camera.aspect = aspect;
  camera.updateProjectionMatrix();
}
function draw(dt, instant) {
  const target = state.curtain ? 1 : 0;
  const offset = 0.64 + state.distance * .195 + (state.gesture === 'step' && state.cue ? .18 : 0);
  const nextCurtain = from(curtain, target, 10, dt, instant);
  if (nextCurtain !== curtain || !previous) {
    curtain = nextCurtain;
    left.tension(curtain);
    right.tension(curtain);
    ties.forEach(tie => { tie.visible = curtain < .11; });
  }
  cue = from(cue, state.cue, 7, dt, instant);
  variant = from(variant, state.lateral ? 1 : 0, 8, dt, instant);
  chairA.position.x = from(chairA.position.x, -offset, 12, dt, instant);
  chairB.position.x = from(chairB.position.x, offset, 12, dt, instant);
  const turn = state.tone === 'firme' ? .09 : .04;
  chairA.rotation.y = .36 + cue * turn;
  chairB.rotation.y = -.40;
  chairA.rotation.z = state.gesture === 'open' ? cue * .077 : 0;
  markers.scale.x = offset * .72;
  keyLight.intensity = 56 + cue * 5 - curtain * 12;
  const distance = Math.max(8.88, 9.45 / aspect);
  position.set(variant * 3.85, 2.85 + variant * .28, distance - variant * .35);
  moveTo.set(-variant * .30, 1.96, -.03);
  camera.position.copy(position);
  camera.lookAt(look.copy(moveTo));
  camera.updateMatrixWorld();
  projected.copy(inkAnchor).project(camera);
  $('stage-card').style.left = `${(projected.x * .5 + .5) * 100}%`;
  $('stage-card').style.top = `${(.5 - projected.y * .5) * 100}%`;
  $('stage-card').hidden = curtain > .16 || variant > .65 || Math.abs(projected.x) > 1;
  const values = [curtain, cue, variant, chairA.position.x, chairB.position.x];
  const moving = !previous || values.some((value, i) => value !== previous[i]);
  previous = values;
  return moving;
}

const phrasing = () => {
  const current = situations[state.situation];
  return current[state.tone === 'suave' ? 'soft' : 'firm'];
};
function phrase() {
  if (state.choice < 2) return phrasing()[state.choice];
  if (state.choice === 2) return $('custom').value.trim();
  if (state.choice === 3) return 'Pedir ajuda ou buscar companhia.';
  return 'Escolho não responder.';
}
function feedback(text = '') {
  $('status').textContent = text;
}
function update() {
  const selected = phrase();
  const names = [...phrasing(), 'Escrever minha frase', 'Pedir ajuda', 'Não responder'];
  $('prompt').textContent = state.turn
    ? (state.turn === 1 ? 'A outra pessoa pergunta: “Você quer dizer mais alguma coisa?”' : 'A outra pessoa pergunta: “Você quer retomar outro dia?”')
    : situations[state.situation].prompt;
  for (const button of $('choices').children) {
    const index = Number(button.dataset.choice);
    button.textContent = names[index];
    button.setAttribute('aria-pressed', index === state.choice);
    button.disabled = state.curtain;
  }
  for (const button of $('tones').children) {
    button.setAttribute('aria-pressed', button.dataset.tone === state.tone);
    button.disabled = state.curtain;
  }
  $('custom-wrap').hidden = state.choice !== 2;
  $('stage-card').textContent = selected;
  $('distance-text').value = `${state.distance} de 5`;
  $('closer').disabled = state.curtain || state.distance === 1;
  $('farther').disabled = state.curtain || state.distance === 5;
  $('rehearse').disabled = state.curtain || !selected;
  $('rehearse').textContent = state.choice === 4 ? 'Ensaiar sem fala' : 'Ensaiar frase';
  $('curtain').textContent = state.curtain ? 'Reabrir cortina' : 'Fechar cortina';
  $('curtain').setAttribute('aria-pressed', state.curtain);
  $('situation').disabled = state.curtain;
  $('custom').disabled = state.curtain;
  $('leave').hidden = !state.curtain;
  $('camera').setAttribute('aria-pressed', state.lateral);
  stageApi?.redraw();
}
function clearCue() {
  state.cue = 0;
  $('caption').textContent = '';
}
for (const [index, situation] of situations.entries()) $('situation').add(new Option(situation.name, index));
for (let index = 0; index < 5; index++) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'choice';
  button.dataset.choice = index;
  button.addEventListener('click', () => {
    state.choice = index;
    clearCue();
    update();
    if (index === 2) $('custom').focus();
  });
  $('choices').append(button);
}
$('situation').addEventListener('change', event => {
  state.situation = Number(event.target.value);
  state.choice = 0;
  state.turn = 0;
  clearCue();
  feedback('');
  update();
});
$('tones').addEventListener('click', event => {
  if (!event.target.dataset.tone) return;
  state.tone = event.target.dataset.tone;
  clearCue();
  update();
});
$('custom').addEventListener('input', () => { clearCue(); update(); });
$('gesture').addEventListener('change', event => { state.gesture = event.target.value; update(); });
$('level').addEventListener('change', () => { state.turn = 0; clearCue(); update(); });
$('closer').addEventListener('click', () => { state.distance--; update(); });
$('farther').addEventListener('click', () => { state.distance++; update(); });
$('camera').addEventListener('click', () => { state.lateral = !state.lateral; update(); });
$('repeat').addEventListener('click', () => { state.turn = 0; clearCue(); feedback('A situação está pronta para um novo ensaio.'); update(); });
$('rehearse').addEventListener('click', () => {
  if (state.curtain || !phrase()) return;
  state.cue = 1;
  $('caption').textContent = phrase();
  if (state.turn + 1 < Number($('level').value) && state.choice < 3) {
    state.turn++;
    feedback('Leia a próxima fala ou feche a cortina quando quiser.');
  } else {
    state.turn = 0;
    feedback('Ensaio concluído. Você pode repetir, experimentar uma alternativa ou fechar a cortina.');
  }
  update();
});
function setCurtain(closed) {
  state.curtain = closed;
  clearCue();
  feedback(closed ? 'Ensaio em pausa. Você pode reabrir a cortina ou sair da cena.' : 'Cortina aberta. Continue quando quiser.');
  update();
}
$('curtain').addEventListener('click', () => setCurtain(!state.curtain));
$('leave').addEventListener('click', () => { location.assign('/'); });
window.addEventListener('keydown', event => {
  if (event.key === 'Escape' && !state.curtain) {
    setCurtain(true);
    $('curtain').focus();
  }
});
stageApi = bootStage(view, scene, { camera, draw, layout, environment: .33, exposure: 1.06 });
update();
