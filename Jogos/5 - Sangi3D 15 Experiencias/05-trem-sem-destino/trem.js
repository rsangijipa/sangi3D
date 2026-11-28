// Trem sem Destino · Sangi3D — viagem panorâmica contemplativa (Three.js r187, WebGL2)
// Referencial local do trem: vagões fixos, mundo exterior desloca por s += v*dt.
import * as THREE from '../../../Sistema/shared/vendor/three.module.js';

const $ = (id) => document.getElementById(id);
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const lerp = (a, b, t) => a + (b - a) * t;
const smooth = (e0, e1, x) => { const t = clamp((x - e0) / (e1 - e0), 0, 1); return t * t * (3 - 2 * t); };
const damp = (a, b, k, dt) => lerp(a, b, 1 - Math.exp(-k * dt));

// ---------------------------------------------------------------- dados
const CAR_LEN = 22, CAR_GAP = 1.2, CAR_PITCH = CAR_LEN + CAR_GAP, HALF_W = 1.6, WALL_TOP = 2.75;
const carX = (i) => -i * CAR_PITCH;
const CAR_NAMES = ['Salão panorâmico', 'Café-restaurante', 'Cabine de leitura'];
const CAR_SHORT = ['Panorâmico', 'Café', 'Leitura'];
const CAR_TEXT = [
  'Poltronas capitonê viradas para as janelas altas. Sente-se e deixe a paisagem passar.',
  'Mesas com toalha de linho e o serviço de chá. Selecione a xícara e sirva com calma.',
  'Estantes de livros e luz baixa de leitura. Há um conto esperando sobre a mesa.',
];
const ROUTES = [
  { name: 'Alpes nevados', chip: 'Rota pelos Alpes', station: 'Vale Lumen', amp: 20, ridge: 62, sea: 0, lift: 2, snow: 16, sandAmt: 0,
    grass: 0x4a6236, rock: 0x6b6862, snowC: 0xf2f5f8, sand: 0xcbb68a, trees: { pine: 620, rock: 110 } , far: 'alps' },
  { name: 'Litoral atlântico', chip: 'Rota pelo litoral', station: 'Baía Serena', amp: 9, ridge: 16, sea: 16, lift: 1, snow: 999, sandAmt: 1,
    grass: 0x5d7a3c, rock: 0x7a7266, snowC: 0xffffff, sand: 0xdcc795, trees: { palm: 170, broad: 220, rock: 70 }, far: 'coast' },
  { name: 'Floresta antiga', chip: 'Rota pela floresta', station: 'Clareira Alta', amp: 13, ridge: 22, sea: 0, lift: 1.5, snow: 999, sandAmt: 0,
    grass: 0x3f5f2b, rock: 0x5b5a4f, snowC: 0xffffff, sand: 0xa89a70, trees: { broad: 520, pine: 300, rock: 40 }, far: 'forest' },
  { name: 'Deserto dourado', chip: 'Rota pelo deserto', station: 'Oásis Mirante', amp: 8, ridge: 34, sea: 0, lift: 0.5, snow: 999, sandAmt: 0,
    grass: 0xc99c62, rock: 0xa0623e, snowC: 0xffffff, sand: 0xd8b07a, trees: { cactus: 150, rock: 170 }, far: 'desert' },
];
const WEATHERS = [
  { name: 'Céu limpo', sunEl: 0.62, sunAz: 0.25, sunCol: 0xfff0d8, sunI: 3.4, hemiSky: 0xbdd6f0, hemiGround: 0x6b5a40, hemiI: 1.05,
    top: 0x3f78c4, hor: 0xcfe2f2, fog: 0xbfd2e2, fogD: 0.0011, rain: 0, stars: 0, cloud: 0.35, exposure: 1.0, lamp: 0.0, tint: 0xffffff },
  { name: 'Chuva', sunEl: 0.55, sunAz: 0.1, sunCol: 0xc8d2dc, sunI: 0.55, hemiSky: 0x8e9aa6, hemiGround: 0x3e3b36, hemiI: 0.9,
    top: 0x4f5964, hor: 0x8d98a2, fog: 0x7c8892, fogD: 0.0042, rain: 1, stars: 0, cloud: 1.0, exposure: 1.15, lamp: 1, tint: 0x9aa4ae },
  { name: 'Noite estrelada', sunEl: 0.7, sunAz: -0.3, sunCol: 0x8fa6d8, sunI: 0.32, hemiSky: 0x223354, hemiGround: 0x0c0e14, hemiI: 0.32,
    top: 0x050a18, hor: 0x1a2742, fog: 0x101a2c, fogD: 0.0022, rain: 0, stars: 1, cloud: 0.15, exposure: 1.25, lamp: 1, tint: 0x3b4a6a },
  { name: 'Amanhecer', sunEl: 0.07, sunAz: 0.55, sunCol: 0xffb070, sunI: 2.6, hemiSky: 0xf2b8a0, hemiGround: 0x4a3a40, hemiI: 0.8,
    top: 0x47609a, hor: 0xffc49a, fog: 0xe8b8a0, fogD: 0.0016, rain: 0, stars: 0.25, cloud: 0.5, exposure: 1.05, lamp: 0.5, tint: 0xf0c0a8 },
];
const BOOK = [
  'O bilhete dizia apenas “ida”. Não havia destino impresso, só um carimbo dourado com o desenho de uma xícara. Marta guardou-o no bolso do casaco e escolheu a poltrona junto à janela.',
  'A cada curva, a paisagem mudava de ideia: primeiro montanhas, depois um mar que ela nunca tinha visto, depois uma floresta tão antiga que parecia respirar. O cobrador passava sorrindo, sem pedir nada.',
  '— Qual é a próxima estação? — perguntou ela. — Aquela que a senhora precisar — respondeu ele, ajeitando o quepe. — Este trem não chega a lugares. Chega a momentos.',
  'Marta serviu o chá, viu o vapor desenhar letras no vidro e entendeu que não tinha pressa. Quando o trem enfim parou, a placa da estação estava em branco. Ela desceu mesmo assim, leve.',
];

// ---------------------------------------------------------------- estado
const state = {
  s: 0, v: 22, vTarget: 22, speedT: 0.45, paused: false, stable: false, reduced: false,
  route: 0, pendingRoute: -1, weather: 0, quality: 'BALANCED',
  tour: false, tourT: 0, tourIdx: 0, scenery: false,
  seated: -1, curtains: [0, 0, 0], curtainTarget: [0, 0, 0], lamps: [false, false, false], lampsUser: [false, false, false],
  tea: 0, teaFill: 0, pourT: 0, drinking: false,
  time: 0, joint: 0, car: 0, ready: false,
};
const W = { cur: {}, colors: {} }; // clima interpolado
const player = { pos: new THREE.Vector3(5, 0, 0), vel: new THREE.Vector3(), yaw: Math.PI / 2 + 0.55, pitch: -0.04, eye: 1.62 };
const camPose = { pos: new THREE.Vector3(), yaw: 0, pitch: 0 };
const sway = { y: 0, vy: 0, x: 0, vx: 0 };

// ---------------------------------------------------------------- renderer
const canvas = $('view');
let renderer;
try {
  renderer = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: 'high-performance', preserveDrawingBuffer: false });
} catch (err) {
  $('loading').textContent = 'WebGL indisponível neste navegador.';
  throw err;
}
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.NoToneMapping;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;
renderer.shadowMap.autoUpdate = true;
const maxAniso = renderer.capabilities.getMaxAnisotropy();
$('backend').textContent = 'WebGL2 · Three.js r' + THREE.REVISION;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(62, 1, 0.05, 2400);
camera.rotation.order = 'YXZ';
scene.fog = new THREE.FogExp2(0xbfd2e2, 0.0011);

// ---------------------------------------------------------------- texturas procedurais
function rng(seed) { let s = seed >>> 0; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }
function canvasTex(w, h, draw, { repeat = [1, 1], srgb = true, seed = 1 } = {}) {
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  const g = c.getContext('2d'); draw(g, w, h, rng(seed));
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(repeat[0], repeat[1]);
  t.anisotropy = Math.min(8, maxAniso);
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  return t;
}
function noiseFill(g, w, h, r, amt, size = 1) {
  const img = g.getImageData(0, 0, w, h), d = img.data;
  for (let i = 0; i < d.length; i += 4) { const n = (r() - 0.5) * amt; d[i] += n; d[i + 1] += n; d[i + 2] += n; }
  g.putImageData(img, 0, 0);
}
function woodDraw(base, dark, light) {
  return (g, w, h, r) => {
    g.fillStyle = base; g.fillRect(0, 0, w, h);
    for (let i = 0; i < 140; i++) {
      const y = r() * h, a = 0.05 + r() * 0.16, amp = 2 + r() * 6, f = 0.005 + r() * 0.02, ph = r() * 7;
      g.strokeStyle = (r() < 0.5 ? dark : light).replace('A', a.toFixed(3)); g.lineWidth = 0.6 + r() * 2.4;
      g.beginPath();
      for (let x = 0; x <= w; x += 8) g.lineTo(x, y + Math.sin(x * f + ph) * amp + Math.sin(x * f * 3.1) * amp * 0.3);
      g.stroke();
    }
    for (let k = 0; k < 4; k++) { // nós da madeira
      const x = r() * w, y = r() * h; const gr = g.createRadialGradient(x, y, 1, x, y, 16 + r() * 18);
      gr.addColorStop(0, dark.replace('A', '0.45')); gr.addColorStop(1, dark.replace('A', '0')); g.fillStyle = gr;
      g.beginPath(); g.ellipse(x, y, 34, 9, 0, 0, 7); g.fill();
    }
    noiseFill(g, w, h, r, 10);
  };
}
const T = {};
function buildTextures() {
  T.wood = canvasTex(512, 512, woodDraw('#6b3a1e', 'rgba(40,18,6,A)', 'rgba(150,90,50,A)'), { repeat: [3, 1], seed: 3 });
  T.woodLight = canvasTex(512, 512, woodDraw('#9a6236', 'rgba(60,30,12,A)', 'rgba(200,140,80,A)'), { repeat: [2, 1], seed: 7 });
  T.panel = canvasTex(512, 256, (g, w, h, r) => { // lambri com almofadas
    woodDraw('#5a2f17', 'rgba(30,12,4,A)', 'rgba(130,80,40,A)')(g, w, h, r);
    for (let i = 0; i < 2; i++) {
      const x0 = 18 + i * w / 2, y0 = 22, pw = w / 2 - 36, ph = h - 44;
      g.strokeStyle = 'rgba(20,8,2,.55)'; g.lineWidth = 6; g.strokeRect(x0, y0, pw, ph);
      g.strokeStyle = 'rgba(210,150,90,.35)'; g.lineWidth = 2; g.strokeRect(x0 + 5, y0 + 5, pw - 10, ph - 10);
    }
  }, { repeat: [8, 1], seed: 5 });
  T.fabric = canvasTex(256, 256, (g, w, h) => { // capitonê
    g.fillStyle = '#7a1f22'; g.fillRect(0, 0, w, h);
    const s = 64;
    for (let y = -s; y <= h + s; y += s / 2) for (let x = -s; x <= w + s; x += s) {
      const ox = ((y / (s / 2)) % 2) ? s / 2 : 0;
      const cx = x + ox, cy = y;
      const gr = g.createRadialGradient(cx, cy, 2, cx, cy, s * 0.55);
      gr.addColorStop(0, 'rgba(20,0,0,.75)'); gr.addColorStop(0.18, 'rgba(60,5,8,.25)'); gr.addColorStop(0.6, 'rgba(255,170,160,.12)'); gr.addColorStop(1, 'rgba(0,0,0,0)');
      g.fillStyle = gr; g.fillRect(cx - s, cy - s, s * 2, s * 2);
      g.fillStyle = '#d9b05c'; g.beginPath(); g.arc(cx, cy, 3, 0, 7); g.fill();
    }
    g.strokeStyle = 'rgba(25,0,2,.35)'; g.lineWidth = 2;
    for (let i = -8; i < 8; i++) { g.beginPath(); g.moveTo(i * s, 0); g.lineTo(i * s + h, h); g.stroke(); g.beginPath(); g.moveTo(i * s + h, 0); g.lineTo(i * s, h); g.stroke(); }
  }, { repeat: [2, 1], seed: 9 });
  T.fabricBump = canvasTex(256, 256, (g, w, h) => {
    g.fillStyle = '#888'; g.fillRect(0, 0, w, h); const s = 64;
    for (let y = -s; y <= h + s; y += s / 2) for (let x = -s; x <= w + s; x += s) {
      const cx = x + (((y / (s / 2)) % 2) ? s / 2 : 0), cy = y;
      const gr = g.createRadialGradient(cx, cy, 1, cx, cy, s * 0.5);
      gr.addColorStop(0, '#000'); gr.addColorStop(0.3, '#777'); gr.addColorStop(0.75, '#fff'); gr.addColorStop(1, '#999');
      g.fillStyle = gr; g.fillRect(cx - s, cy - s, s * 2, s * 2);
    }
  }, { repeat: [2, 1], srgb: false });
  T.carpet = canvasTex(512, 512, (g, w, h, r) => {
    g.fillStyle = '#4a1418'; g.fillRect(0, 0, w, h);
    g.strokeStyle = '#c99a4a'; g.lineWidth = 6; g.strokeRect(14, 14, w - 28, h - 28);
    g.strokeStyle = '#1f2a3a'; g.lineWidth = 10; g.strokeRect(34, 34, w - 68, h - 68);
    for (let k = 0; k < 4; k++) {
      const cx = (k % 2 + 0.5) * w / 2, cy = (Math.floor(k / 2) + 0.5) * h / 2;
      for (let j = 0; j < 8; j++) { const a = j * Math.PI / 4; g.fillStyle = j % 2 ? '#b8843f' : '#2c3d55';
        g.beginPath(); g.ellipse(cx + Math.cos(a) * 34, cy + Math.sin(a) * 34, 26, 10, a, 0, 7); g.fill(); }
      g.fillStyle = '#d8b46a'; g.beginPath(); g.arc(cx, cy, 14, 0, 7); g.fill();
    }
    noiseFill(g, w, h, r, 26);
  }, { repeat: [1, 6], seed: 11 });
  T.parquet = canvasTex(512, 512, (g, w, h, r) => {
    const bw = 64, bh = 16;
    for (let y = 0; y < h; y += bh) for (let x = -((y / bh) % 4) * 16; x < w; x += bw) {
      const l = 70 + r() * 50; g.fillStyle = `rgb(${l + 40},${l * 0.62 | 0},${l * 0.32 | 0})`; g.fillRect(x, y, bw - 1, bh - 1);
      g.fillStyle = 'rgba(30,12,4,.25)'; for (let i = 0; i < 3; i++) g.fillRect(x, y + r() * bh, bw, 1);
    }
    noiseFill(g, w, h, r, 14);
  }, { repeat: [10, 1.5], seed: 13 });
  T.damask = canvasTex(256, 256, (g, w, h, r) => {
    g.fillStyle = '#d9c9a6'; g.fillRect(0, 0, w, h); g.fillStyle = 'rgba(150,110,60,.18)';
    for (let y = 0; y < 2; y++) for (let x = 0; x < 2; x++) {
      const cx = x * 128 + 64 + (y % 2) * 64, cy = y * 128 + 64;
      g.beginPath(); for (let a = 0; a < 7; a += 0.05) { const rr = 26 + 14 * Math.cos(a * 4); g.lineTo(cx + Math.cos(a) * rr * 0.7, cy + Math.sin(a) * rr); } g.fill();
    }
    noiseFill(g, w, h, r, 8);
  }, { repeat: [10, 1], seed: 15 });
  T.bellows = canvasTex(64, 256, (g, w, h) => {
    for (let y = 0; y < h; y += 16) { const gr = g.createLinearGradient(0, y, 0, y + 16); gr.addColorStop(0, '#2a2522'); gr.addColorStop(0.5, '#4d4540'); gr.addColorStop(1, '#1a1614'); g.fillStyle = gr; g.fillRect(0, y, w, 16); }
  }, { repeat: [1, 4] });
  T.stone = canvasTex(512, 256, (g, w, h, r) => {
    g.fillStyle = '#4a4744'; g.fillRect(0, 0, w, h);
    for (let y = 0; y < h; y += 32) for (let x = -(y % 64); x < w; x += 64) { const l = 55 + r() * 40; g.fillStyle = `rgb(${l},${l * 0.96 | 0},${l * 0.9 | 0})`; g.fillRect(x + 2, y + 2, 60, 28); }
    noiseFill(g, w, h, r, 30);
  }, { repeat: [40, 2], seed: 17 });
  T.detail = canvasTex(256, 256, (g, w, h, r) => {
    g.fillStyle = '#808080'; g.fillRect(0, 0, w, h);
    for (let i = 0; i < 2600; i++) { const l = r() * 255 | 0; g.fillStyle = `rgba(${l},${l},${l},.35)`; const s = 1 + r() * 5; g.fillRect(r() * w, r() * h, s, s); }
    for (let i = 0; i < 40; i++) { const l = r() * 255 | 0; g.fillStyle = `rgba(${l},${l},${l},.18)`; g.beginPath(); g.arc(r() * w, r() * h, 8 + r() * 30, 0, 7); g.fill(); }
  }, { srgb: false, seed: 19 });
  T.sleeper = canvasTex(64, 64, woodDraw('#3b2a1e', 'rgba(15,8,4,A)', 'rgba(90,70,50,A)'), { seed: 21 });
  T.water = canvasTex(256, 256, (g, w, h, r) => {
    g.fillStyle = '#8080ff'; g.fillRect(0, 0, w, h);
    for (let i = 0; i < 400; i++) { const x = r() * w, y = r() * h, l = r(); g.strokeStyle = `rgba(${150 + l * 100 | 0},128,255,.4)`; g.lineWidth = 1 + r() * 2; g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + 10, y - 4, x + 22, y); g.stroke(); }
  }, { srgb: false, repeat: [60, 60], seed: 23 });
  T.glow = canvasTex(64, 64, (g, w) => { const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32); gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.4, 'rgba(255,255,255,.35)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(0, 0, w, w); });
}

// ---------------------------------------------------------------- materiais
const M = {};
function buildMaterials() {
  const std = (o) => new THREE.MeshStandardMaterial(o);
  M.wood = std({ map: T.wood, bumpMap: T.wood, bumpScale: 0.6, roughness: 0.38, metalness: 0 });
  M.woodLight = std({ map: T.woodLight, bumpMap: T.woodLight, bumpScale: 0.4, roughness: 0.42 });
  M.panel = std({ map: T.panel, bumpMap: T.panel, bumpScale: 1.2, roughness: 0.34 });
  M.damask = std({ map: T.damask, roughness: 0.85 });
  M.ceiling = std({ color: 0xe9dcc0, roughness: 0.75 });
  M.brass = std({ color: 0xd2a75c, metalness: 1, roughness: 0.28 });
  M.brassDark = std({ color: 0x9a7438, metalness: 1, roughness: 0.42 });
  M.fabric = new THREE.MeshStandardMaterial({ map: T.fabric, bumpMap: T.fabricBump, bumpScale: 3, roughness: 0.78 });
  M.fabricGreen = M.fabric.clone(); M.fabricGreen.color = new THREE.Color(0x6fa08a);
  M.velvet = new THREE.MeshStandardMaterial({ color: 0x8a1c24, roughness: 0.72, side: THREE.DoubleSide, bumpMap: T.fabricBump, bumpScale: 0.4 });
  M.velvetGreen = M.velvet.clone(); M.velvetGreen.color = new THREE.Color(0x2c5a45);
  M.carpet = std({ map: T.carpet, roughness: 0.95 });
  M.parquet = std({ map: T.parquet, bumpMap: T.parquet, bumpScale: 0.5, roughness: 0.45 });
  M.cloth = std({ color: 0xf4efe6, roughness: 0.9 });
  M.porcelain = new THREE.MeshPhysicalMaterial({ color: 0xf8f6f2, roughness: 0.18, clearcoat: 1, clearcoatRoughness: 0.08 });
  M.porcelainBlue = new THREE.MeshPhysicalMaterial({ color: 0x2f4f8a, roughness: 0.25, clearcoat: 1 });
  M.tea = std({ color: 0x8a3f12, roughness: 0.05, metalness: 0, emissive: 0x200800 });
  M.shade = std({ color: 0xf6dfb0, roughness: 0.9, emissive: 0xffb860, emissiveIntensity: 0, side: THREE.DoubleSide });
  M.bulb = new THREE.MeshBasicMaterial({ color: 0xfff1d0 });
  M.dark = std({ color: 0x1c1a18, roughness: 0.6 });
  M.metal = std({ color: 0x5a5d60, metalness: 0.9, roughness: 0.45 });
  M.checker = std({ color: 0x55585a, metalness: 0.85, roughness: 0.35, bumpMap: T.detail, bumpScale: 2 });
  M.bellows = std({ map: T.bellows, roughness: 0.9 });
  M.stone = std({ map: T.stone, bumpMap: T.stone, bumpScale: 2, roughness: 0.95 });
  M.book = std({ roughness: 0.7 });
  M.paper = std({ color: 0xf3ead2, roughness: 0.9 });
  M.sleeper = std({ map: T.sleeper, roughness: 0.9 });
  M.rail = std({ color: 0x8a8a8c, metalness: 1, roughness: 0.3 });
  M.pole = std({ color: 0x5b4a3a, roughness: 0.9 });
  M.platform = std({ color: 0x9a948a, roughness: 0.9, bumpMap: T.detail, bumpScale: 1.5 });
  M.roofStation = std({ color: 0x3e5a4a, roughness: 0.6, metalness: 0.3 });
}

// ---------------------------------------------------------------- utilidades de cena
const interactables = [];
const shadowCasters = [];
function box(w, h, d, mat, x, y, z, parent, { cast = true, recv = true } = {}) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  m.position.set(x, y, z); m.castShadow = cast; m.receiveShadow = recv; parent.add(m); return m;
}
function cyl(rt, rb, h, seg, mat, x, y, z, parent, opt = {}) {
  const m = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, seg), mat);
  m.position.set(x, y, z); m.castShadow = opt.cast !== false; m.receiveShadow = true; parent.add(m); return m;
}
function tagAction(obj, action) { obj.userData.dyn = true; obj.traverse((o) => { if (o.isMesh) o.userData.action = action; }); interactables.push(obj); }

// ---------------------------------------------------------------- vagões
const train = new THREE.Group(); scene.add(train);
const cars = [];
const seats = []; // {pos, yaw, car, label}
const lampsByCar = [[], [], []];
const curtainsByCar = [[], [], []];
const doors = [];
const carLights = [];
let teaSet = null, bookMesh = null, boardTex = null, boardCanvas = null;

function lathe(points, seg, mat) { return new THREE.Mesh(new THREE.LatheGeometry(points.map((p) => new THREE.Vector2(p[0], p[1])), seg), mat); }

function makeArmchair(parent, x, z, rotY, mat) {
  const g = new THREE.Group(); g.position.set(x, 0, z); g.rotation.y = rotY; parent.add(g);
  box(0.72, 0.16, 0.66, mat, 0, 0.42, 0, g);
  box(0.72, 0.62, 0.14, mat, 0, 0.78, 0.3, g).rotation.x = -0.12;
  box(0.12, 0.28, 0.62, mat, -0.36, 0.58, 0.02, g); box(0.12, 0.28, 0.62, mat, 0.36, 0.58, 0.02, g);
  box(0.66, 0.08, 0.06, M.brass, 0, 1.1, 0.34, g, { cast: false });
  for (const sx of [-0.3, 0.3]) for (const sz of [-0.26, 0.26]) cyl(0.025, 0.02, 0.34, 8, M.brass, sx, 0.17, sz, g, { cast: false });
  return g;
}
function makeLamp(parent, x, y, z, car, tall = false) {
  const g = new THREE.Group(); g.position.set(x, y, z); parent.add(g);
  cyl(0.07, 0.09, 0.03, 16, M.brass, 0, 0.015, 0, g, { cast: false });
  cyl(0.012, 0.012, tall ? 1.35 : 0.34, 8, M.brass, 0, (tall ? 1.35 : 0.34) / 2, 0, g, { cast: false });
  const top = tall ? 1.35 : 0.34;
  const shade = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.15, 0.16, 20, 1, true), M.shade); shade.position.y = top + 0.04; g.add(shade);
  const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.03, 10, 8), M.bulb); bulb.position.y = top; bulb.visible = false; g.add(bulb);
  g.userData.bulb = bulb; lampsByCar[car].push(g);
  tagAction(g, { type: 'lamp', car });
  return g;
}
function makeSconce(parent, x, z, side, car) {
  const g = new THREE.Group(); g.position.set(x, 2.32, z); parent.add(g);
  box(0.06, 0.14, 0.03, M.brass, 0, 0, 0, g, { cast: false });
  const arm = cyl(0.01, 0.01, 0.16, 6, M.brass, 0, 0.02, -side * 0.08, g, { cast: false }); arm.rotation.x = Math.PI / 2;
  const shade = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.09, 0.11, 16, 1, true), M.shade); shade.position.set(0, 0.06, -side * 0.16); g.add(shade);
  const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.02, 8, 6), M.bulb); bulb.position.set(0, 0.04, -side * 0.16); bulb.visible = false; g.add(bulb);
  g.userData.bulb = bulb; lampsByCar[car].push(g);
  tagAction(g, { type: 'lamp', car });
}
function curtainGeometry(w, h) {
  const geo = new THREE.PlaneGeometry(w, h, 28, 1); geo.translate(w / 2, 0, 0);
  const p = geo.attributes.position;
  for (let i = 0; i < p.count; i++) { const x = p.getX(i); p.setZ(i, Math.sin(x / w * Math.PI * 7) * 0.035); }
  geo.computeVertexNormals(); return geo;
}

function buildCar(i) {
  const g = new THREE.Group(); g.position.x = carX(i); train.add(g);
  const pano = i === 0;
  const winTop = pano ? 2.5 : 2.18, winBot = pano ? 0.82 : 0.95, winW = pano ? 2.9 : 2.4;
  const pitch = 3.6, n = 6;
  const floorMat = i === 1 ? M.parquet : M.carpet;
  // piso
  box(CAR_LEN, 0.06, HALF_W * 2, floorMat, 0, -0.03, 0, g, { cast: false });
  if (i !== 1) { const runner = box(CAR_LEN - 0.4, 0.012, 1.0, M.carpet, 0, 0.006, 0, g, { cast: false }); runner.material = M.carpet; }
  // teto abobadado
  const vault = new THREE.Mesh(new THREE.CylinderGeometry(HALF_W + 0.04, HALF_W + 0.04, CAR_LEN, 28, 1, true, 0, Math.PI), M.ceiling);
  vault.material = M.ceiling.clone(); vault.material.side = THREE.BackSide;
  vault.rotation.z = Math.PI / 2; vault.scale.set(0.3, 1, 1); vault.position.y = WALL_TOP; vault.receiveShadow = true; g.add(vault);
  // invólucro de sombra (telhado opaco por fora)
  box(CAR_LEN + 0.2, 0.08, HALF_W * 2 + 0.3, M.dark, 0, WALL_TOP + 0.52, 0, g, { cast: true, recv: false });
  for (let k = 0; k < 12; k++) { // nervuras de latão
    const rib = new THREE.Mesh(new THREE.TorusGeometry(HALF_W, 0.02, 6, 30, Math.PI), M.brass);
    rib.rotation.y = Math.PI / 2; rib.scale.set(1, 0.3, 1); rib.position.set(-CAR_LEN / 2 + 0.9 + k * 1.84, WALL_TOP, 0); g.add(rib);
  }
  for (const side of [-1, 1]) {
    const z = side * HALF_W;
    // lambri inferior + friso + painel superior
    box(CAR_LEN, winBot, 0.08, M.panel, 0, winBot / 2, z + side * 0.04, g);
    const sill = box(CAR_LEN, 0.05, 0.16, M.wood, 0, winBot + 0.02, z - side * 0.03, g); sill.castShadow = true;
    box(CAR_LEN, 0.022, 0.03, M.brass, 0, winBot - 0.06, z - side * 0.01, g, { cast: false });
    box(CAR_LEN, WALL_TOP - winTop, 0.08, M.damask, 0, (winTop + WALL_TOP) / 2, z + side * 0.04, g);
    box(CAR_LEN, 0.06, 0.1, M.wood, 0, winTop + 0.02, z, g);
    // pilares entre janelas
    const xs = []; for (let k = 0; k < n; k++) xs.push(-9 + k * pitch);
    const edges = [-CAR_LEN / 2];
    xs.forEach((x) => { edges.push(x - winW / 2, x + winW / 2); }); edges.push(CAR_LEN / 2);
    for (let k = 0; k < edges.length; k += 2) {
      const a = edges[k], b = edges[k + 1], w = b - a; if (w <= 0.01) continue;
      box(w, winTop - winBot, 0.12, M.panel, (a + b) / 2, (winTop + winBot) / 2, z + side * 0.02, g);
      box(0.03, winTop - winBot, 0.03, M.brass, a + 0.02, (winTop + winBot) / 2, z - side * 0.045, g, { cast: false });
      box(0.03, winTop - winBot, 0.03, M.brass, b - 0.02, (winTop + winBot) / 2, z - side * 0.045, g, { cast: false });
    }
    // vidro com gotas (um painel por lado)
    const glass = new THREE.Mesh(new THREE.PlaneGeometry(CAR_LEN, winTop - winBot), glassMat);
    glass.position.set(0, (winTop + winBot) / 2, z + side * 0.03); glass.rotation.y = side > 0 ? Math.PI : 0; glass.renderOrder = 2; glass.userData.dyn = true; g.add(glass);
    // cortinas: duas folhas por janela
    xs.forEach((x) => {
      const h = winTop - winBot + 0.12, w2 = winW / 2 + 0.06;
      for (const dir of [-1, 1]) {
        const c = new THREE.Mesh(curtainGeometry(w2, h), pano ? M.velvetGreen : M.velvet);
        c.position.set(x + dir * (winW / 2 + 0.04), (winTop + winBot) / 2 + 0.02, z - side * 0.09);
        c.scale.x = -dir; c.userData.dir = dir; c.castShadow = true;
        g.add(c); curtainsByCar[i].push(c); tagAction(c, { type: 'curtain', car: i });
      }
      const rod = cyl(0.015, 0.015, winW + 0.5, 8, M.brass, x, winTop + 0.1, z - side * 0.09, g, { cast: false }); rod.rotation.z = Math.PI / 2;
      // bagageiro sobre janelas (café e leitura)
      if (!pano) {
        for (const dz of [0.1, 0.34]) { const bar = cyl(0.012, 0.012, winW + 0.3, 6, M.brass, x, 2.48, z - side * dz, g, { cast: false }); bar.rotation.z = Math.PI / 2; }
        if ((x * 7 + i) % 3 < 1.5) box(0.6, 0.28, 0.32, i === 2 ? M.woodLight : M.dark, x - 0.5, 2.64, z - side * 0.22, g);
      }
      makeSconce(g, x - winW / 2 - 0.25, z - side * 0.03, side, i);
    });
  }
  // paredes de topo com portas
  for (const end of [-1, 1]) {
    const x = end * (CAR_LEN / 2 - 0.05);
    const outerEnd = (i === 0 && end === 1) || (i === 2 && end === -1);
    box(0.1, WALL_TOP, HALF_W - 0.45, M.panel, x, WALL_TOP / 2, (HALF_W + 0.45) / 2, g);
    box(0.1, WALL_TOP, HALF_W - 0.45, M.panel, x, WALL_TOP / 2, -(HALF_W + 0.45) / 2, g);
    box(0.1, WALL_TOP - 2.1, 0.9, M.panel, x, 2.1 + (WALL_TOP - 2.1) / 2, 0, g);
    box(0.12, 0.05, 0.94, M.brass, x, 2.1, 0, g, { cast: false });
    const door = new THREE.Group(); door.userData.dyn = true; door.position.set(x - end * 0.02, 0, 0); g.add(door);
    box(0.05, 2.08, 0.9, M.wood, 0, 1.04, 0, door);
    const pane = box(0.055, 1.0, 0.6, glassMat, 0, 1.35, 0, door, { cast: false }); pane.renderOrder = 2;
    box(0.07, 0.03, 0.2, M.brass, 0, 1.0, 0.3, door, { cast: false });
    doors.push({ g: door, x: carX(i) + x, open: 0, locked: outerEnd });
    if (outerEnd) { // janela decorativa e placa de segurança
      box(0.02, 0.24, 0.5, M.brass, x - end * 0.06, 1.85, 0, g, { cast: false });
    }
  }
  // luz do vagão
  const light = new THREE.PointLight(0xffc98a, 0, 15, 2); light.position.set(0, 2.45, 0); g.add(light); carLights.push(light);
  // luminária de teto em tecido
  for (const lx of [-6, 0, 6]) {
    const sh = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.3, 0.2, 24, 1, true), M.shade); sh.position.set(lx, 2.7, 0); g.add(sh);
    const b = new THREE.Mesh(new THREE.SphereGeometry(0.05, 10, 8), M.bulb); b.position.set(lx, 2.66, 0); b.visible = false; b.userData.dyn = true; g.add(b);
    const grp = new THREE.Group(); grp.userData.bulb = b; lampsByCar[i].push(grp);
  }
  furnish(i, g);
  cars.push(g);
  mergeStatic(g);
  return g;
}


// fusão de geometria estática por material (reduz chamadas de desenho)
function mergeStatic(root) {
  root.updateMatrixWorld(true);
  const inv = new THREE.Matrix4().copy(root.matrixWorld).invert();
  const dynUp = (o) => { for (let p = o; p && p !== root; p = p.parent) if (p.userData.dyn) return true; return false; };
  const buckets = new Map(), victims = [];
  root.traverse((m) => {
    if (!m.isMesh || m.isInstancedMesh || dynUp(m) || !m.visible) return;
    const key = m.material.uuid + (m.castShadow ? 'c' : '') + (m.receiveShadow ? 'r' : '');
    if (!buckets.has(key)) buckets.set(key, { mat: m.material, cast: m.castShadow, recv: m.receiveShadow, geos: [] });
    const geo = (m.geometry.index ? m.geometry.toNonIndexed() : m.geometry.clone());
    geo.applyMatrix4(new THREE.Matrix4().multiplyMatrices(inv, m.matrixWorld));
    buckets.get(key).geos.push(geo); victims.push(m);
  });
  victims.forEach((m) => m.parent.remove(m));
  for (const b of buckets.values()) {
    let n = 0; b.geos.forEach((g) => (n += g.attributes.position.count));
    const pos = new Float32Array(n * 3), nor = new Float32Array(n * 3), uv = new Float32Array(n * 2); let o = 0;
    b.geos.forEach((g) => { pos.set(g.attributes.position.array, o * 3); nor.set(g.attributes.normal.array, o * 3); if (g.attributes.uv) uv.set(g.attributes.uv.array, o * 2); o += g.attributes.position.count; g.dispose(); });
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3)); geo.setAttribute('normal', new THREE.BufferAttribute(nor, 3)); geo.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
    geo.computeBoundingSphere();
    const mesh = new THREE.Mesh(geo, b.mat); mesh.castShadow = b.cast; mesh.receiveShadow = b.recv; root.add(mesh);
  }
}

function furnish(i, g) {
  if (i === 0) {
    for (const side of [-1, 1]) {
      [-7.2, -3.6, 0, 3.6, 7.2].forEach((x, k) => {
        makeArmchair(g, x, side * 1.05, side > 0 ? Math.PI : 0, M.fabricGreen);
        seats.push({ pos: new THREE.Vector3(carX(0) + x, 1.12, side * 0.98), yaw: side > 0 ? Math.PI : 0, car: 0 });
        if (k < 4) { // mesinha redonda com luminária
          const tx = x + 1.8; cyl(0.24, 0.24, 0.03, 24, M.wood, tx, 0.62, side * 1.18, g); cyl(0.03, 0.05, 0.6, 10, M.brass, tx, 0.31, side * 1.18, g, { cast: false });
          makeLamp(g, tx, 0.635, side * 1.22, 0);
        }
      });
    }
    // quadro de destinos
    boardCanvas = document.createElement('canvas'); boardCanvas.width = 512; boardCanvas.height = 256;
    boardTex = new THREE.CanvasTexture(boardCanvas); boardTex.colorSpace = THREE.SRGBColorSpace;
    const board = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 0.75), new THREE.MeshStandardMaterial({ map: boardTex, emissiveMap: boardTex, emissive: 0xffffff, emissiveIntensity: 0.55, roughness: 0.5 }));
    board.position.set(CAR_LEN / 2 - 0.12, 1.75, -0.95); board.rotation.y = -Math.PI / 2; g.add(board);
    box(0.04, 0.85, 1.6, M.brass, CAR_LEN / 2 - 0.1, 1.75, -0.95, g, { cast: false });
    tagAction(board, { type: 'board' });
  } else if (i === 1) {
    for (const side of [-1, 1]) {
      [-7.2, -2.4, 2.4, 7.2].forEach((x) => {
        box(0.75, 0.04, 0.8, M.wood, x, 0.74, side * 1.15, g);
        box(0.8, 0.012, 0.86, M.cloth, x, 0.765, side * 1.15, g, { cast: false });
        cyl(0.04, 0.06, 0.72, 10, M.brass, x, 0.36, side * 1.15, g, { cast: false });
        for (const dx of [-0.85, 0.85]) {
          const bench = new THREE.Group(); bench.position.set(x + dx, 0, side * 1.15); bench.rotation.y = dx < 0 ? -Math.PI / 2 : Math.PI / 2; g.add(bench);
          box(0.82, 0.14, 0.5, M.fabric, 0, 0.44, 0, bench); box(0.82, 0.7, 0.12, M.fabric, 0, 0.85, 0.24, bench);
          box(0.84, 0.05, 0.14, M.wood, 0, 1.22, 0.24, bench);
          seats.push({ pos: new THREE.Vector3(carX(1) + x + dx * 0.92, 1.12, side * 1.12), yaw: side > 0 ? Math.PI : 0, car: 1 });
        }
        makeLamp(g, x - 0.22, 0.77, side * 1.38, 1);
        if (!(side === -1 && x === -2.4)) { // pratos e xícara decorativa
          cyl(0.11, 0.09, 0.015, 20, M.porcelain, x + 0.15, 0.78, side * 1.0, g, { cast: false });
        }
      });
    }
    // serviço de chá interativo
    teaSet = buildTeaSet(); teaSet.group.position.set(-2.4, 0.772, -1.12); g.add(teaSet.group);
    // balcão de serviço
    box(1.6, 1.0, 0.5, M.panel, -CAR_LEN / 2 + 1.2, 0.5, 1.3, g); box(1.7, 0.05, 0.56, M.woodLight, -CAR_LEN / 2 + 1.2, 1.02, 1.3, g);
  } else {
    for (const side of [1]) [-7.2, -3.6, 3.6, 7.2].forEach((x) => {
      makeArmchair(g, x, 1.05, Math.PI, M.fabric);
      seats.push({ pos: new THREE.Vector3(carX(2) + x, 1.12, 0.98), yaw: Math.PI, car: 2 });
      makeLamp(g, x + 1.1, 0, 1.3, 2, true);
    });
    // estantes baixas sob as janelas do outro lado
    box(CAR_LEN - 1.4, 0.88, 0.04, M.woodLight, 0, 0.44, -1.56, g);
    for (const sy of [0.04, 0.45, 0.88]) box(CAR_LEN - 1.4, 0.03, 0.34, M.woodLight, 0, sy, -1.4, g);
    for (let k = 0; k <= 10; k++) box(0.03, 0.88, 0.34, M.woodLight, -CAR_LEN / 2 + 0.7 + k * (CAR_LEN - 1.4) / 10, 0.44, -1.4, g);
    const nb = 260, books = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), M.book, nb);
    const r = rng(77), m4 = new THREE.Matrix4(), col = new THREE.Color();
    const palette = [0x7a1f22, 0x1f3a5a, 0x2c5a45, 0x8a6a2a, 0x4a2a4a, 0xd8c8a0, 0x3a2a1a];
    let k = 0;
    for (const shelfY of [0.056, 0.466]) {
      let x = -CAR_LEN / 2 + 0.9;
      while (x < CAR_LEN / 2 - 0.9 && k < nb) {
        const w = 0.03 + r() * 0.04, h = 0.24 + r() * 0.12;
        if (Math.abs(x) < 0.9 && shelfY > 0.3) { x += 0.05; continue; }
        m4.makeScale(w, h, 0.22 + r() * 0.04); m4.setPosition(x, shelfY + h / 2, -1.4 + 0.02);
        books.setMatrixAt(k, m4); books.setColorAt(k, col.setHex(palette[(r() * palette.length) | 0]).multiplyScalar(0.6 + r() * 0.5));
        x += w + 0.004 + (r() < 0.05 ? 0.12 : 0); k++;
      }
    }
    books.count = k; books.castShadow = true; books.receiveShadow = true; g.add(books);
    // mesa de leitura com livro original
    box(0.9, 0.04, 0.4, M.wood, 0, 0.95, -0.98, g);
    for (const lx of [-0.4, 0.4]) cyl(0.015, 0.015, 0.95, 8, M.brass, lx, 0.475, -0.84, g, { cast: false });
    const book = new THREE.Group(); book.position.set(0, 0.985, -0.95); g.add(book);
    box(0.36, 0.03, 0.26, M.book, 0, 0, 0, book).material = new THREE.MeshStandardMaterial({ color: 0x6a1a1a, roughness: 0.6 });
    const pages = box(0.34, 0.012, 0.24, M.paper, 0, 0.02, 0, book); pages.rotation.z = 0.04;
    box(0.02, 0.005, 0.24, M.brass, 0.0, 0.03, 0, book, { cast: false });
    bookMesh = book; tagAction(book, { type: 'book' });
    makeLamp(g, 0.32, 0.97, -1.08, 2);
  }
  // cordão das cortinas (interativo) junto à porta
  const cord = new THREE.Group(); cord.position.set(CAR_LEN / 2 - 0.4, 1.5, HALF_W - 0.06); g.add(cord);
  cyl(0.006, 0.006, 0.6, 6, M.velvet, 0, 0, 0, cord, { cast: false });
  const tassel = new THREE.Mesh(new THREE.ConeGeometry(0.035, 0.1, 10), M.brass); tassel.position.y = -0.33; cord.add(tassel);
  tagAction(cord, { type: 'curtain', car: i });
}

function buildTeaSet() {
  const group = new THREE.Group();
  cyl(0.2, 0.2, 0.012, 32, M.brass, 0, 0.006, 0, group, { cast: false }); // bandeja
  const pot = new THREE.Group(); pot.position.set(-0.08, 0.012, 0.02); group.add(pot);
  const body = lathe([[0, 0], [0.06, 0], [0.085, 0.03], [0.09, 0.07], [0.075, 0.11], [0.04, 0.13], [0.035, 0.14], [0, 0.14]], 28, M.porcelainBlue); body.castShadow = true; pot.add(body);
  const lid = new THREE.Mesh(new THREE.SphereGeometry(0.015, 10, 8), M.brass); lid.position.y = 0.15; pot.add(lid);
  const spout = cyl(0.008, 0.016, 0.11, 10, M.porcelainBlue, 0.1, 0.08, 0, pot); spout.rotation.z = -0.9;
  const handle = new THREE.Mesh(new THREE.TorusGeometry(0.04, 0.008, 8, 16, Math.PI * 1.2), M.porcelainBlue); handle.position.set(-0.095, 0.075, 0); handle.rotation.z = Math.PI * 0.4; pot.add(handle);
  const cup = new THREE.Group(); group.add(cup);
  const saucer = cyl(0.06, 0.045, 0.01, 24, M.porcelain, 0.1, 0.017, 0.05, group, { cast: false });
  const cupBody = lathe([[0, 0], [0.025, 0], [0.04, 0.03], [0.045, 0.055], [0.043, 0.056], [0.038, 0.032], [0.022, 0.006], [0, 0.006]], 24, M.porcelain);
  cup.add(cupBody);
  const ch = new THREE.Mesh(new THREE.TorusGeometry(0.016, 0.005, 6, 12), M.porcelain); ch.position.set(0.048, 0.032, 0); cup.add(ch);
  const liquid = new THREE.Mesh(new THREE.CircleGeometry(1, 24), M.tea); liquid.rotation.x = -Math.PI / 2; liquid.visible = false; cup.add(liquid);
  const stream = new THREE.Mesh(new THREE.CylinderGeometry(0.004, 0.006, 1, 6), M.tea); stream.visible = false; group.add(stream);
  // vapor
  const steamGeo = new THREE.BufferGeometry(); const sp = new Float32Array(30 * 3); steamGeo.setAttribute('position', new THREE.BufferAttribute(sp, 3));
  const steam = new THREE.Points(steamGeo, new THREE.PointsMaterial({ map: T.glow, size: 0.06, transparent: true, opacity: 0, depthWrite: false, color: 0xffffff }));
  steam.frustumCulled = false; group.add(steam);
  const steamSeeds = Array.from({ length: 30 }, (_, k) => ({ t: k / 30, a: Math.random() * 6.28, r: Math.random() }));
  const home = new THREE.Vector3(0.1, 0.022, 0.05), serve = new THREE.Vector3(0.06, 0.03, -0.07);
  cup.position.copy(home);
  const set = { group, pot, cup, liquid, stream, steam, steamSeeds, home, serve };
  tagAction(group, { type: 'tea' });
  return set;
}

function buildVestibule(i) {
  const g = new THREE.Group(); g.position.x = carX(i) - CAR_LEN / 2 - CAR_GAP / 2; train.add(g);
  box(CAR_GAP + 0.2, 0.05, 1.0, M.checker, 0, -0.02, 0, g, { cast: false });
  for (const side of [-1, 1]) box(CAR_GAP + 0.1, 2.15, 0.06, M.bellows, 0, 1.07, side * 0.52, g);
  box(CAR_GAP + 0.1, 0.06, 1.1, M.bellows, 0, 2.16, 0, g);
  const b = new THREE.Mesh(new THREE.SphereGeometry(0.04, 8, 6), M.bulb); b.position.set(0, 2.08, 0); g.add(b);
}

// ---------------------------------------------------------------- vidro com chuva
const glassMat = new THREE.ShaderMaterial({
  transparent: true, depthWrite: false, side: THREE.DoubleSide,
  uniforms: { uTime: { value: 0 }, uRain: { value: 0 }, uSpeed: { value: 1 }, uSky: { value: new THREE.Color(0xcfe2f2) }, uNight: { value: 0 } },
  vertexShader: `varying vec3 vW; varying vec3 vN; void main(){ vec4 w = modelMatrix*vec4(position,1.); vW=w.xyz; vN=normalize(mat3(modelMatrix)*normal); gl_Position=projectionMatrix*viewMatrix*w; }`,
  fragmentShader: `uniform float uTime,uRain,uSpeed,uNight; uniform vec3 uSky; varying vec3 vW; varying vec3 vN;
    float h21(vec2 p){ p=fract(p*vec2(123.34,456.21)); p+=dot(p,p+45.32); return fract(p.x*p.y); }
    float drops(vec2 uv, float t){
      vec2 g = uv; g.x += t; vec2 id=floor(g); vec2 f=fract(g)-.5; float n=h21(id);
      vec2 o = vec2(n-.5, fract(n*13.7)-.5)*.6; f -= o;
      float d = length(f*vec2(1.,1.4)); float drop = smoothstep(.06,.02,d)*step(.45,n);
      float trail = (1.0-smoothstep(0.0,0.012,abs(f.y)))*smoothstep(.0,.4,f.x)*(1.0-smoothstep(.1,.5,f.x))*step(.45,n)*.35;
      return clamp(drop+trail,0.,1.);
    }
    void main(){
      vec3 V = normalize(cameraPosition - vW); float ndv = clamp(abs(dot(V, normalize(vN))),0.,1.);
      float fres = 0.04 + 0.5*pow(1.0-ndv, 4.0);
      float t = mod(uTime*uSpeed*.35, 200.);
      float d = 0.;
      if(uRain>0.01){ d = drops(vW.xy*vec2(3.,4.)+vec2(vW.z*7.,0.), t)*uRain + drops(vW.xy*vec2(6.,8.)+vec2(3.1,1.7), t*1.6)*uRain*.6; }
      vec3 refl = mix(uSky, vec3(1.0,0.86,0.62)*0.5, uNight*0.6);
      vec3 col = mix(refl, refl*0.55+vec3(0.25,0.28,0.3), clamp(d,0.,1.));
      float a = clamp(0.035 + fres*0.35 + d*0.22 + uNight*0.06, 0., 0.7);
      gl_FragColor = vec4(col*(0.6+0.4*(1.0-uNight)), a);
    }`,
});

// ---------------------------------------------------------------- céu
const sky = new THREE.Mesh(new THREE.SphereGeometry(2000, 48, 24), new THREE.ShaderMaterial({
  side: THREE.BackSide, depthWrite: false, fog: false,
  uniforms: { uTop: { value: new THREE.Color() }, uHor: { value: new THREE.Color() }, uSunDir: { value: new THREE.Vector3(0, 1, 0) }, uSunCol: { value: new THREE.Color() },
    uStars: { value: 0 }, uCloud: { value: 0.3 }, uTime: { value: 0 }, uScroll: { value: 0 }, uMoon: { value: 0 } },
  vertexShader: `varying vec3 vD; void main(){ vD = normalize(position); vec4 p = projectionMatrix*modelViewMatrix*vec4(position,1.); gl_Position=p.xyww; }`,
  fragmentShader: `uniform vec3 uTop,uHor,uSunDir,uSunCol; uniform float uStars,uCloud,uTime,uScroll,uMoon; varying vec3 vD;
    float h31(vec3 p){ p=fract(p*.3183099+.1); p*=17.; return fract(p.x*p.y*p.z*(p.x+p.y+p.z)); }
    float n2(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.-2.*f);
      float a=h31(vec3(i,1.)), b=h31(vec3(i+vec2(1,0),1.)), c=h31(vec3(i+vec2(0,1),1.)), d=h31(vec3(i+1.,1.));
      return mix(mix(a,b,f.x),mix(c,d,f.x),f.y); }
    float fbm(vec2 p){ float s=0., a=.5; for(int i=0;i<5;i++){ s+=a*n2(p); p*=2.03; a*=.5; } return s; }
    void main(){
      vec3 d = normalize(vD); float y = clamp(d.y, -1., 1.);
      float hz = pow(clamp(1.0 - max(y,0.0), 0.0, 1.0), 3.0);
      vec3 col = mix(uTop, uHor, hz);
      col = mix(col, uHor*0.55, smoothstep(0.0,-0.25,y));
      float sd = clamp(dot(d, normalize(uSunDir)), -1., 1.);
      float sunAmt = 1.0 - uMoon;
      col += uSunCol * (pow(max(sd,0.), 900.)*30.0*sunAmt + pow(max(sd,0.), 12.)*0.35*sunAmt + pow(max(sd,0.),3.)*0.12);
      col += vec3(0.85,0.9,1.0) * pow(max(sd,0.), 2400.)*14.0*uMoon;
      if(y>0.0){
        vec2 uv = d.xz/(y+0.12);
        float c = fbm(uv*1.4 + vec2(uScroll*0.002 + uTime*0.003, 0.));
        float cov = smoothstep(1.0-uCloud*0.75, 1.15-uCloud*0.4, c+0.25*uCloud);
        vec3 cc = mix(uHor*1.05, uSunCol*0.9+uHor*0.3, clamp(sd*0.5+0.5,0.,1.));
        col = mix(col, cc*mix(1.0,0.55,uCloud*uCloud), cov*smoothstep(0.0,0.18,y)*0.92);
        float st = h31(floor(d*420.));
        col += vec3(step(0.9975, st)*uStars*(1.0-cov)) * (0.6+0.4*sin(uTime*2.0+st*80.));
      }
      gl_FragColor = vec4(max(col, vec3(0.0)), 1.0);
    }`,
}));
sky.frustumCulled = false; sky.renderOrder = -10; scene.add(sky);

// ---------------------------------------------------------------- terreno contínuo
const L = 4096, KN = [7, 19, 37, 61, 97, 151].map((n) => (2 * Math.PI * n) / L);
const terr = { amp: 20, ridge: 62, sea: 0, lift: 2 };
function Hjs(x, z) {
  const az = Math.abs(z), m = smooth(10, 70, az);
  const a = Math.sin(KN[0] * x + 0.013 * z) * 0.55 + Math.sin(KN[1] * x - 0.021 * z + 1.3) * 0.3 + Math.sin(KN[2] * x + 0.034 * z + 2.1) * 0.18
    + Math.sin(KN[3] * x - 0.05 * z + 0.7) * 0.1 + Math.sin(KN[4] * x + 0.08 * z + 4.0) * 0.06 + Math.sin(KN[5] * x - 0.11 * z + 1.9) * 0.035;
  let r = 1 - Math.abs(Math.sin(KN[1] * x + 0.017 * z + 0.4)); r *= r;
  const hh = terr.amp * (a + 0.6) * (0.35 + 1.3 * smooth(20, 260, az)) + terr.ridge * r * smooth(50, 220, az);
  return -1.35 + m * (hh + terr.lift) - terr.sea * smooth(22, 90, -z);
}
const groundUniforms = {
  uS: { value: 0 }, uAmp: { value: 20 }, uRidge: { value: 62 }, uSea: { value: 0 }, uLift: { value: 2 },
  uGrass: { value: new THREE.Color() }, uRock: { value: new THREE.Color() }, uSnow: { value: new THREE.Color() }, uSand: { value: new THREE.Color() },
  uSnowLine: { value: 16 }, uSandAmt: { value: 0 }, uDetail: { value: null },
};
const GLSL_H = `uniform float uS,uAmp,uRidge,uSea,uLift; varying float vH; varying float vSlope; varying vec2 vWP;
  float H(vec2 p){ float x = p.x + uS; float z = p.y; float az = abs(z); float m = smoothstep(10.,70.,az);
    float a = sin(${KN[0].toFixed(8)}*x+0.013*z)*0.55 + sin(${KN[1].toFixed(8)}*x-0.021*z+1.3)*0.3 + sin(${KN[2].toFixed(8)}*x+0.034*z+2.1)*0.18
      + sin(${KN[3].toFixed(8)}*x-0.05*z+0.7)*0.1 + sin(${KN[4].toFixed(8)}*x+0.08*z+4.0)*0.06 + sin(${KN[5].toFixed(8)}*x-0.11*z+1.9)*0.035;
    float r = 1.0 - abs(sin(${KN[1].toFixed(8)}*x+0.017*z+0.4)); r*=r;
    float hh = uAmp*(a+0.6)*(0.35+1.3*smoothstep(20.,260.,az)) + uRidge*r*smoothstep(50.,220.,az);
    return -1.35 + m*(hh+uLift) - uSea*smoothstep(22.,90.,-z); }`;
let ground, groundMat;
function buildGround() {
  const geo = new THREE.PlaneGeometry(1500, 1000, 230, 120); geo.rotateX(-Math.PI / 2);
  groundMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.95, metalness: 0 });
  groundUniforms.uDetail.value = T.detail;
  groundMat.onBeforeCompile = (sh) => {
    Object.assign(sh.uniforms, groundUniforms);
    sh.vertexShader = sh.vertexShader
      .replace('#include <common>', '#include <common>\n' + GLSL_H)
      .replace('#include <beginnormal_vertex>', `vec2 gp = position.xz; float h0 = H(gp); float hx = H(gp+vec2(1.5,0.)); float hz = H(gp+vec2(0.,1.5));
        vec3 objectNormal = normalize(vec3(h0-hx, 1.5, h0-hz)); vH = h0; vSlope = 1.0-objectNormal.y; vWP = vec2(gp.x+uS, gp.y);`)
      .replace('#include <begin_vertex>', 'vec3 transformed = vec3(position.x, h0, position.z);');
    sh.fragmentShader = sh.fragmentShader
      .replace('#include <common>', `#include <common>
        uniform vec3 uGrass,uRock,uSnow,uSand; uniform float uSnowLine,uSandAmt; uniform sampler2D uDetail; varying float vH; varying float vSlope; varying vec2 vWP;`)
      .replace('#include <color_fragment>', `#include <color_fragment>
        float dt = texture2D(uDetail, vWP*0.0625).r; float dt2 = texture2D(uDetail, vWP*0.015625).r; float dt3 = texture2D(uDetail, vWP*0.00390625).r;
        vec3 gcol = uGrass*(0.7+0.6*dt2)*(0.85+0.3*dt3);
        gcol = mix(gcol, uRock*(0.75+0.5*dt), smoothstep(0.22,0.5,vSlope));
        float sn = smoothstep(uSnowLine, uSnowLine+10., vH + dt*8. - vSlope*12.);
        gcol = mix(gcol, uSnow*(0.9+0.1*dt), sn);
        gcol = mix(gcol, uSand*(0.85+0.3*dt), uSandAmt*(1.0-smoothstep(-0.4, 2.2, vH))*(1.0-smoothstep(-22.0, -10.0, vWP.y)));
        float bal = 1.0 - smoothstep(2.2, 3.4, min(abs(vWP.y), abs(vWP.y+5.2)));
        gcol = mix(gcol, vec3(0.30,0.28,0.26)*(0.55+0.9*dt), bal);
        diffuseColor.rgb = gcol*(0.8+0.4*dt);`)
      .replace('#include <roughnessmap_fragment>', '#include <roughnessmap_fragment>\nroughnessFactor = mix(0.95, 0.55, smoothstep(uSnowLine, uSnowLine+10., vH));');
  };
  ground = new THREE.Mesh(geo, groundMat); ground.receiveShadow = false; ground.frustumCulled = false; scene.add(ground);
}

// mar (litoral)
let sea;
function buildSea() {
  sea = new THREE.Mesh(new THREE.PlaneGeometry(1600, 900), new THREE.MeshStandardMaterial({ color: 0x1d4a66, roughness: 0.12, metalness: 0.1, normalMap: T.water, normalScale: new THREE.Vector2(0.35, 0.35), transparent: true, opacity: 0.94 }));
  sea.rotation.x = -Math.PI / 2; sea.position.set(0, -6.2, -500); sea.visible = false; scene.add(sea);
}

// montanhas distantes (faixas de silhueta)
const farRings = [];
function farTexture(kind, layer) {
  return canvasTex(2048, 256, (g, w, h, r) => {
    g.clearRect(0, 0, w, h);
    const peaks = kind === 'alps' ? 26 : kind === 'desert' ? 9 : kind === 'coast' ? 7 : 18;
    const hMax = kind === 'alps' ? 0.92 : kind === 'desert' ? 0.45 : kind === 'coast' ? 0.38 : 0.55;
    const pts = []; for (let i = 0; i <= 256; i++) {
      const x = i / 256; let y = 0;
      for (let k = 1; k <= 4; k++) y += Math.sin(x * Math.PI * 2 * Math.round(peaks / k) + k * 1.7 + layer * 3) / k;
      y = (y * 0.25 + 0.5); if (kind === 'alps') y = Math.pow(Math.abs(y), 0.75) * 1.05; if (kind === 'desert') y = y > 0.62 ? 0.62 + (y - 0.62) * 0.15 : y; // mesas
      if (kind === 'coast') y *= (Math.sin(x * Math.PI * 6) > 0.2 ? 1 : 0.25);
      pts.push(y * hMax * (layer ? 0.75 : 1));
    }
    const base = { alps: ['#8796ab', '#5d6b80'], desert: ['#c48a5a', '#a06a44'], coast: ['#6b8070', '#4f6656'], forest: ['#4b6a4e', '#344d38'] }[kind];
    const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, base[0]); gr.addColorStop(1, base[1]);
    g.fillStyle = gr; g.beginPath(); g.moveTo(0, h);
    pts.forEach((y, i) => g.lineTo(i / 256 * w, h - y * h)); g.lineTo(w, h); g.fill();
    if (kind === 'alps') { // neve nos picos
      g.save(); g.clip(); g.fillStyle = 'rgba(245,248,252,.92)';
      pts.forEach((y, i) => { if (y > 0.5) { const x = i / 256 * w; g.beginPath(); g.moveTo(x - 14, h - (y - 0.12) * h); g.lineTo(x, h - y * h - 2); g.lineTo(x + 14, h - (y - 0.12) * h); g.fill(); } });
      g.restore();
    }
    noiseFill(g, w, h, r, 12);
  }, { seed: 31 + layer });
}
function buildFar() {
  for (let layer = 0; layer < 2; layer++) {
    const radius = layer ? 650 : 1100, height = layer ? 170 : 360;
    const mat = new THREE.MeshBasicMaterial({ transparent: true, side: THREE.BackSide, depthWrite: false, fog: true, alphaTest: 0.02 });
    const ring = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, height, 96, 1, true), mat);
    ring.position.y = height / 2 - 12 - layer * 4; ring.renderOrder = -5 + layer; scene.add(ring); farRings.push(ring);
  }
}
const farCache = {};
function setFar(kind) {
  farRings.forEach((ring, layer) => {
    const key = kind + layer; if (!farCache[key]) { farCache[key] = farTexture(kind, layer); farCache[key].repeat.set(2, 1); }
    ring.material.map = farCache[key]; ring.material.needsUpdate = true;
  });
}

// ---------------------------------------------------------------- vegetação e objetos recicláveis
const flora = {};
function treeGeometries() {
  const merge = (parts) => {
    // fusão simples: concatena atributos de geometrias não indexadas
    const geos = parts.map((p) => (p.index ? p.toNonIndexed() : p));
    let count = 0; geos.forEach((g) => (count += g.attributes.position.count));
    const pos = new Float32Array(count * 3), nor = new Float32Array(count * 3), colr = new Float32Array(count * 3);
    let o = 0;
    geos.forEach((g, gi) => {
      pos.set(g.attributes.position.array, o * 3); nor.set(g.attributes.normal.array, o * 3);
      const c = parts[gi].userData.col || new THREE.Color(1, 1, 1);
      for (let i = 0; i < g.attributes.position.count; i++) { colr[(o + i) * 3] = c.r; colr[(o + i) * 3 + 1] = c.g; colr[(o + i) * 3 + 2] = c.b; }
      o += g.attributes.position.count;
    });
    const out = new THREE.BufferGeometry();
    out.setAttribute('position', new THREE.BufferAttribute(pos, 3)); out.setAttribute('normal', new THREE.BufferAttribute(nor, 3)); out.setAttribute('color', new THREE.BufferAttribute(colr, 3));
    return out;
  };
  const C = (hex) => new THREE.Color(hex);
  const part = (geo, col, x = 0, y = 0, z = 0, rx = 0, rz = 0) => { geo.rotateX(rx); geo.rotateZ(rz); geo.translate(x, y, z); geo.userData.col = C(col); return geo; };
  return {
    pine: merge([part(new THREE.CylinderGeometry(0.18, 0.28, 2.2, 6), 0x4a3424, 0, 1.1),
      part(new THREE.ConeGeometry(2.2, 3.6, 8), 0x22402a, 0, 3.4), part(new THREE.ConeGeometry(1.7, 3.0, 8), 0x284a30, 0, 5.0), part(new THREE.ConeGeometry(1.1, 2.4, 8), 0x2f5536, 0, 6.6)]),
    broad: merge([part(new THREE.CylinderGeometry(0.2, 0.32, 2.6, 6), 0x5a4030, 0, 1.3),
      part(new THREE.IcosahedronGeometry(2.1, 1), 0x3d6a2c, 0, 3.8), part(new THREE.IcosahedronGeometry(1.5, 1), 0x4f7a34, 1.1, 3.3), part(new THREE.IcosahedronGeometry(1.4, 1), 0x356026, -1.0, 4.4)]),
    palm: merge([part(new THREE.CylinderGeometry(0.14, 0.24, 6, 6), 0x8a6a4a, 0.3, 3, 0, 0, -0.1),
      ...[0, 1, 2, 3, 4, 5, 6].map((k) => { const g = new THREE.ConeGeometry(0.45, 3.2, 4); g.scale(1, 1, 0.15); g.rotateZ(Math.PI / 2 + 0.5); g.rotateY(k * 0.9); g.translate(0, 6, 0); g.userData.col = C(k % 2 ? 0x3f7a30 : 0x4f8a3a); return g; })]),
    cactus: merge([part(new THREE.CylinderGeometry(0.3, 0.36, 3.6, 8), 0x4f7a44, 0, 1.8),
      part(new THREE.CylinderGeometry(0.2, 0.22, 1.4, 8), 0x4a7440, 0.62, 2.2), part(new THREE.CylinderGeometry(0.22, 0.22, 0.6, 8), 0x4a7440, 0.38, 1.6, 0, 0, Math.PI / 2),
      part(new THREE.CylinderGeometry(0.18, 0.2, 1.1, 8), 0x4a7440, -0.56, 2.6), part(new THREE.CylinderGeometry(0.19, 0.19, 0.5, 8), 0x4a7440, -0.34, 2.1, 0, 0, Math.PI / 2)]),
    rock: merge([part(new THREE.DodecahedronGeometry(1.2, 0), 0x77736a, 0, 0.4)]),
  };
}
const SPAN = 760, XMIN = -420;
function buildFlora() {
  const geos = treeGeometries();
  const mat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.9, flatShading: true });
  for (const k of Object.keys(geos)) {
    const max = 700; const mesh = new THREE.InstancedMesh(geos[k], mat, max);
    mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage); mesh.frustumCulled = false; mesh.count = 0; scene.add(mesh);
    flora[k] = { mesh, items: [], max };
  }
}
let spawnSeed = 1;
function placeItem(kind, it, x) {
  const r = rng(spawnSeed++ * 2654435761);
  const rt = ROUTES[state.route];
  let z;
  for (let tries = 0; tries < 8; tries++) {
    const side = r() < 0.5 ? -1 : 1, d = 10 + Math.pow(r(), 1.7) * 330;
    z = side * d;
    if (rt.sea > 0 && z < -16) z = Math.abs(z);
    if (kind === 'palm' && rt.sea > 0 && r() < 0.6) z = 12 + r() * 30;
    if (Math.abs(z + 5.2) > 4 && Math.abs(z) > 9) break;
  }
  it.x = x; it.z = z; it.rot = r() * 6.28;
  it.s = kind === 'rock' ? 0.5 + r() * 2.2 * (Math.abs(z) > 60 ? 2 : 1) : 0.7 + r() * 0.8;
  it.y = Hjs(x + modS(), z) - 0.15;
  if (kind === 'pine' && it.y > rt.snow + 12) it.s *= 0.6;
}
const modS = () => state.s % L;
function populateFlora() {
  const rt = ROUTES[state.route];
  for (const k of Object.keys(flora)) {
    const f = flora[k]; const n = Math.min(f.max, rt.trees[k] || 0);
    f.items = []; f.mesh.count = n;
    for (let i = 0; i < n; i++) { const it = {}; placeItem(k, it, XMIN + (i / n) * SPAN + Math.random() * (SPAN / n)); f.items.push(it); }
  }
}
const _m4 = new THREE.Matrix4(), _q = new THREE.Quaternion(), _e = new THREE.Euler(), _v3 = new THREE.Vector3(), _s3 = new THREE.Vector3();
function updateFlora(dx) {
  for (const k of Object.keys(flora)) {
    const f = flora[k]; if (!f.items.length) continue;
    f.items.forEach((it, i) => {
      it.x -= dx; if (it.x < XMIN) placeItem(k, it, it.x + SPAN);
      _e.set(0, it.rot, 0); _q.setFromEuler(_e); _s3.setScalar(it.s); _v3.set(it.x, it.y, it.z);
      _m4.compose(_v3, _q, _s3); f.mesh.setMatrixAt(i, _m4);
    });
    f.mesh.instanceMatrix.needsUpdate = true;
  }
}

// trilhos, dormentes e postes (paralaxe próxima)
let sleepers, poles, sleeperCount = 0;
function buildTrack() {
  const n = 2 * 180; sleepers = new THREE.InstancedMesh(new THREE.BoxGeometry(0.24, 0.14, 2.6), M.sleeper, n); sleepers.frustumCulled = false;
  sleeperCount = n; scene.add(sleepers);
  for (const tz of [0, -5.2]) for (const rz of [-0.72, 0.72]) {
    const rail = new THREE.Mesh(new THREE.BoxGeometry(800, 0.14, 0.08), M.rail); rail.position.set(-100, -1.08, tz + rz); scene.add(rail);
  }
  poles = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.1, 0.14, 7.5, 6), M.pole, 30); poles.frustumCulled = false; scene.add(poles);
  const arms = new THREE.InstancedMesh(new THREE.BoxGeometry(0.08, 0.08, 1.6), M.pole, 30); arms.frustumCulled = false; scene.add(arms); poles.userData.arms = arms;
}
function updateTrack() {
  const off = state.s % 0.65;
  let k = 0;
  for (const tz of [0, -5.2]) for (let i = 0; i < 180; i++) { _m4.makeTranslation(-90 + i * 0.65 - off, -1.22, tz); sleepers.setMatrixAt(k++, _m4); }
  sleepers.instanceMatrix.needsUpdate = true;
  const po = state.s % 45;
  for (let i = 0; i < 30; i++) {
    const x = -500 + i * 45 - po; const y = Hjs(x + modS(), -8.6);
    _m4.makeTranslation(x, Math.max(y, -1.4) + 3.6, -8.6); poles.setMatrixAt(i, _m4);
    _m4.makeTranslation(x, Math.max(y, -1.4) + 7.0, -8.0); poles.userData.arms.setMatrixAt(i, _m4);
  }
  poles.instanceMatrix.needsUpdate = true; poles.userData.arms.instanceMatrix.needsUpdate = true;
}

// túnel de transição e estação
const tunnel = { g: new THREE.Group(), x: 0, active: false, half: 95, swapped: false };
const station = { g: new THREE.Group(), x: 0, active: false, belled: false, signs: [] };
function buildTunnel() {
  const g = tunnel.g; scene.add(g); g.visible = false;
  const len = tunnel.half * 2;
  box(len, 9, 0.6, M.stone, 0, 3, 2.7, g, { cast: false, recv: true }); box(len, 9, 0.6, M.stone, 0, 3, -7.9, g, { cast: false });
  box(len, 0.6, 11.2, M.stone, 0, 7.3, -2.6, g, { cast: false });
  for (const end of [-1, 1]) { // portais na encosta
    box(1.5, 40, 120, M.stone, end * tunnel.half, 14, 62, g, { cast: false }); box(1.5, 40, 120, M.stone, end * tunnel.half, 14, -68, g, { cast: false });
    box(1.5, 30, 11, M.stone, end * tunnel.half, 22.6, -2.6, g, { cast: false });
  }
  const lampGeo = new THREE.BoxGeometry(0.5, 0.18, 0.1); const lampMat = new THREE.MeshBasicMaterial({ color: 0xffc070 });
  const lamps = new THREE.InstancedMesh(lampGeo, lampMat, 16);
  for (let i = 0; i < 16; i++) { _m4.makeTranslation(-tunnel.half + 6 + i * 12, 3.2, 2.35); lamps.setMatrixAt(i, _m4); }
  g.add(lamps);
}
function signTexture(text) {
  return canvasTex(512, 128, (g, w, h) => {
    g.fillStyle = '#1d3a2e'; g.fillRect(0, 0, w, h); g.strokeStyle = '#d9b05c'; g.lineWidth = 8; g.strokeRect(6, 6, w - 12, h - 12);
    g.fillStyle = '#f4e6c4'; g.font = 'bold 54px Georgia'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(text, w / 2, h / 2 + 2);
  });
}
function buildStation() {
  const g = station.g; scene.add(g); g.visible = false;
  box(130, 1.1, 5, M.platform, 0, -0.85, 5.0, g, { cast: false });
  box(130, 0.12, 0.25, new THREE.MeshStandardMaterial({ color: 0xd8c040, roughness: 0.6 }), 0, -0.24, 2.7, g, { cast: false });
  box(110, 0.2, 5.6, M.roofStation, 0, 4.4, 5.2, g, { cast: false });
  for (let i = 0; i < 12; i++) { const x = -55 + i * 10; cyl(0.12, 0.12, 4.6, 8, M.roofStation, x, 2.0, 6.6, g, { cast: false });
    const lamp = new THREE.Mesh(new THREE.SphereGeometry(0.22, 10, 8), new THREE.MeshBasicMaterial({ color: 0xffe2a8 })); lamp.position.set(x + 5, 3.9, 4.0); g.add(lamp);
    if (i % 3 === 0) box(1.8, 0.1, 0.5, M.wood, x + 5, -0.05, 6.8, g, { cast: false }); }
  for (let i = 0; i < 4; i++) {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(3.4, 0.85), new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide }));
    m.position.set(-45 + i * 30, 3.2, 3.2); m.rotation.y = Math.PI; g.add(m); station.signs.push(m);
  }
  box(8, 5, 4, M.panel, 20, 1.5, 10, g, { cast: false }); box(9, 0.4, 5, M.roofStation, 20, 4.2, 10, g, { cast: false });
}
function setStationName(name) {
  const tex = signTexture(name); station.signs.forEach((m) => { m.material.map = tex; m.material.needsUpdate = true; });
}

// chuva
let rain;
function buildRain() {
  const n = 1600, pos = new Float32Array(n * 6), geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  rain = new THREE.LineSegments(geo, new THREE.LineBasicMaterial({ color: 0xbfd0e0, transparent: true, opacity: 0, depthWrite: false }));
  rain.frustumCulled = false; rain.userData.drops = Array.from({ length: n }, () => ({ x: -80 + Math.random() * 110, y: Math.random() * 14 - 2, z: (Math.random() < 0.5 ? -1 : 1) * (2.0 + Math.pow(Math.random(), 1.4) * 26) }));
  scene.add(rain);
}
function updateRain(dt) {
  const amt = W.cur.rain || 0; rain.visible = amt > 0.02; if (!rain.visible) return;
  rain.material.opacity = 0.35 * amt * (1 - tunnelCoverage());
  const p = rain.geometry.attributes.position.array, sl = 0.9 + state.v * 0.02, vx = -state.v * 0.9;
  rain.userData.drops.forEach((d, i) => {
    d.y -= 18 * dt; d.x += vx * dt * 0.5;
    if (d.y < -1.4 || d.x < -85) { d.y = 12 + Math.random() * 3; d.x = -60 + Math.random() * 90; }
    const o = i * 6; p[o] = d.x; p[o + 1] = d.y; p[o + 2] = d.z; p[o + 3] = d.x - vx * 0.03 * sl; p[o + 4] = d.y + 0.55 * sl; p[o + 5] = d.z;
  });
  rain.geometry.attributes.position.needsUpdate = true;
}

// ---------------------------------------------------------------- luzes
const hemi = new THREE.HemisphereLight(0xbdd6f0, 0x6b5a40, 1.0); scene.add(hemi);
const sun = new THREE.DirectionalLight(0xfff0d8, 3.4); sun.castShadow = true; scene.add(sun); scene.add(sun.target);
sun.shadow.camera.left = -44; sun.shadow.camera.right = 44; sun.shadow.camera.top = 9; sun.shadow.camera.bottom = -9;
sun.shadow.camera.near = 1; sun.shadow.camera.far = 90; sun.shadow.bias = -0.0004; sun.shadow.normalBias = 0.03;
sun.target.position.set(-23, 1, 0);

// ---------------------------------------------------------------- pós-processamento estável
const post = { rtScene: null, rtA: null, rtB: null, quad: null, cam: new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1), bloom: true };
const VERT = 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }';
const SAFE = `vec3 safe3(vec3 c){ if(!(c.r==c.r) || !(c.g==c.g) || !(c.b==c.b)) return vec3(0.0); return clamp(c, vec3(0.0), vec3(60000.0)); }`;
const brightMat = new THREE.ShaderMaterial({ uniforms: { tDiffuse: { value: null }, uTh: { value: 0.9 } }, vertexShader: VERT, depthTest: false, depthWrite: false,
  fragmentShader: `uniform sampler2D tDiffuse; uniform float uTh; varying vec2 vUv; ${SAFE}
    void main(){ vec3 c = safe3(texture2D(tDiffuse, vUv).rgb); float l = dot(c, vec3(0.2126,0.7152,0.0722)); float k = max(l-uTh, 0.0)/max(l, 1e-4); gl_FragColor = vec4(min(c*k, vec3(24.0)), 1.0); }` });
const blurMat = new THREE.ShaderMaterial({ uniforms: { tDiffuse: { value: null }, uDir: { value: new THREE.Vector2() } }, vertexShader: VERT, depthTest: false, depthWrite: false,
  fragmentShader: `uniform sampler2D tDiffuse; uniform vec2 uDir; varying vec2 vUv; ${SAFE}
    void main(){ vec3 s = safe3(texture2D(tDiffuse, vUv).rgb)*0.227;
      s += safe3(texture2D(tDiffuse, vUv+uDir*1.385).rgb)*0.316; s += safe3(texture2D(tDiffuse, vUv-uDir*1.385).rgb)*0.316;
      s += safe3(texture2D(tDiffuse, vUv+uDir*3.231).rgb)*0.07; s += safe3(texture2D(tDiffuse, vUv-uDir*3.231).rgb)*0.07;
      gl_FragColor = vec4(s, 1.0); }` });
const compMat = new THREE.ShaderMaterial({
  uniforms: { tScene: { value: null }, tBloom: { value: null }, uBloom: { value: 0.6 }, uExposure: { value: 1 }, uTime: { value: 0 }, uVig: { value: 0.32 }, uRes: { value: new THREE.Vector2(1, 1) }, uDark: { value: 0 } },
  vertexShader: VERT, depthTest: false, depthWrite: false,
  fragmentShader: `uniform sampler2D tScene, tBloom; uniform float uBloom, uExposure, uTime, uVig, uDark; uniform vec2 uRes; varying vec2 vUv; ${SAFE}
    vec3 aces(vec3 x){ return clamp((x*(2.51*x+0.03))/(x*(2.43*x+0.59)+0.14), 0.0, 1.0); }
    float h(vec2 p){ return fract(sin(dot(p, vec2(12.9898,78.233)))*43758.5453); }
    void main(){
      vec3 c = safe3(texture2D(tScene, vUv).rgb);
      c += safe3(texture2D(tBloom, vUv).rgb) * uBloom;
      c *= uExposure;
      c = aces(c);
      c = c*vec3(1.02,1.0,0.97) + vec3(0.012,0.006,0.0);
      float d = length((vUv-0.5)*vec2(uRes.x/uRes.y, 1.0));
      c *= mix(1.0, 1.0-uVig, smoothstep(0.35, 1.05, d));
      c *= 1.0 - uDark;
      c = pow(clamp(c, 0.0, 1.0), vec3(1.0/2.2));
      c += (h(vUv*uRes + fract(uTime)*100.0)-0.5)*0.012;
      gl_FragColor = vec4(clamp(c,0.0,1.0), 1.0);
    }` });
post.quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), compMat); post.quad.frustumCulled = false;
const postScene = new THREE.Scene(); postScene.add(post.quad);
function makeTargets(w, h, samples) {
  ['rtScene', 'rtA', 'rtB'].forEach((k) => post[k] && post[k].dispose());
  post.rtScene = new THREE.WebGLRenderTarget(w, h, { type: THREE.HalfFloatType, samples, depthBuffer: true });
  const hw = Math.max(1, w >> 1), hh = Math.max(1, h >> 1);
  post.rtA = new THREE.WebGLRenderTarget(hw, hh, { type: THREE.HalfFloatType, depthBuffer: false });
  post.rtB = new THREE.WebGLRenderTarget(hw, hh, { type: THREE.HalfFloatType, depthBuffer: false });
}
function pass(mat, target) { post.quad.material = mat; renderer.setRenderTarget(target); renderer.render(postScene, post.cam); }
function renderFrame() {
  renderer.setRenderTarget(post.rtScene); renderer.render(scene, camera);
  const hw = post.rtA.width, hh = post.rtA.height;
  if (post.bloom) {
    brightMat.uniforms.tDiffuse.value = post.rtScene.texture; pass(brightMat, post.rtA);
    for (let i = 0; i < 2; i++) {
      blurMat.uniforms.tDiffuse.value = post.rtA.texture; blurMat.uniforms.uDir.value.set((1 + i * 1.5) / hw, 0); pass(blurMat, post.rtB);
      blurMat.uniforms.tDiffuse.value = post.rtB.texture; blurMat.uniforms.uDir.value.set(0, (1 + i * 1.5) / hh); pass(blurMat, post.rtA);
    }
  }
  compMat.uniforms.tScene.value = post.rtScene.texture; compMat.uniforms.tBloom.value = post.rtA.texture;
  compMat.uniforms.uBloom.value = post.bloom ? 0.55 : 0;
  pass(compMat, null);
}

const QUALITY = {
  LOW: { pr: 1.25, shadow: false, samples: 2, bloom: false, map: [1024, 256] },
  BALANCED: { pr: 1.5, shadow: true, samples: 4, bloom: true, map: [2048, 512] },
  HIGH: { pr: 2, shadow: true, samples: 4, bloom: true, map: [4096, 1024] },
};
function applyQuality(q) {
  state.quality = QUALITY[q] ? q : 'BALANCED';
  const Q = QUALITY[state.quality];
  renderer.shadowMap.enabled = Q.shadow; sun.castShadow = Q.shadow;
  sun.shadow.mapSize.set(Q.map[0], Q.map[1]); if (sun.shadow.map) { sun.shadow.map.dispose(); sun.shadow.map = null; }
  post.bloom = Q.bloom;
  scene.traverse((o) => { if (o.material && o.material.needsUpdate !== undefined && o.isMesh) o.material.needsUpdate = true; });
  $('quality').value = state.quality;
  resize();
}
function resize() {
  const w = Math.max(1, canvas.clientWidth), h = Math.max(1, canvas.clientHeight);
  const pr = Math.min(window.devicePixelRatio || 1, QUALITY[state.quality].pr);
  renderer.setPixelRatio(pr); renderer.setSize(w, h, false);
  camera.aspect = w / h; camera.fov = w < h ? 74 : 62; camera.updateProjectionMatrix();
  makeTargets(Math.round(w * pr), Math.round(h * pr), QUALITY[state.quality].samples);
  compMat.uniforms.uRes.value.set(w * pr, h * pr);
  const ctx = $('context'); if (ctx) document.documentElement.style.setProperty('--ctx-h', ctx.offsetHeight + 'px');
}

// ---------------------------------------------------------------- ambiente para reflexos
function buildEnv() {
  const pm = new THREE.PMREMGenerator(renderer);
  const es = new THREE.Scene();
  const room = new THREE.Mesh(new THREE.BoxGeometry(20, 6, 6), new THREE.MeshBasicMaterial({ color: 0x3a2618, side: THREE.BackSide })); es.add(room);
  for (const s of [-1, 1]) for (let i = -2; i <= 2; i++) { const p = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 1.6), new THREE.MeshBasicMaterial({ color: 0xcfe0f0 })); p.position.set(i * 3.6, 0.6, s * 2.9); p.lookAt(i * 3.6, 0.6, 0); es.add(p); }
  const lamp = new THREE.Mesh(new THREE.SphereGeometry(0.6, 12, 8), new THREE.MeshBasicMaterial({ color: 0xffd8a0 })); lamp.position.set(0, 2.6, 0); es.add(lamp);
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(20, 6), new THREE.MeshBasicMaterial({ color: 0x5a1a1a })); floor.rotation.x = -Math.PI / 2; floor.position.y = -2.9; es.add(floor);
  scene.environment = pm.fromScene(es, 0.04).texture; scene.environmentIntensity = 0.55;
  pm.dispose();
}

// ---------------------------------------------------------------- clima interpolado
const KEYS_NUM = ['sunEl', 'sunAz', 'sunI', 'hemiI', 'fogD', 'rain', 'stars', 'cloud', 'exposure', 'lamp'];
const KEYS_COL = ['sunCol', 'hemiSky', 'hemiGround', 'top', 'hor', 'fog', 'tint'];
function initWeather() { const w = WEATHERS[state.weather]; KEYS_NUM.forEach((k) => (W.cur[k] = w[k])); KEYS_COL.forEach((k) => (W.colors[k] = new THREE.Color(w[k]))); }
const _c = new THREE.Color();
function updateWeather(dt) {
  const w = WEATHERS[state.weather], k = 1 - Math.exp(-dt * 0.9);
  KEYS_NUM.forEach((key) => (W.cur[key] = lerp(W.cur[key], w[key], k)));
  KEYS_COL.forEach((key) => W.colors[key].lerp(_c.setHex(w[key]), k));
  const cov = tunnelCoverage();
  const curve = Math.sin(state.s * 0.0016) * 0.35; // curvas suaves da via giram o sol
  const el = W.cur.sunEl, az = W.cur.sunAz + curve;
  const dir = new THREE.Vector3(Math.sin(az) * 0.9, Math.sin(el), Math.cos(az) * Math.cos(el)).normalize();
  sun.position.copy(sun.target.position).addScaledVector(dir, 50);
  sun.color.copy(W.colors.sunCol); sun.intensity = W.cur.sunI * (1 - cov * 0.95);
  hemi.color.copy(W.colors.hemiSky); hemi.groundColor.copy(W.colors.hemiGround); hemi.intensity = W.cur.hemiI * (1 - cov * 0.85);
  scene.fog.color.copy(W.colors.fog); scene.fog.density = W.cur.fogD;
  const night = state.weather === 2 ? 1 : 0;
  const su = sky.material.uniforms;
  su.uTop.value.copy(W.colors.top); su.uHor.value.copy(W.colors.hor); su.uSunDir.value.copy(dir); su.uSunCol.value.copy(W.colors.sunCol);
  su.uStars.value = W.cur.stars; su.uCloud.value = W.cur.cloud; su.uTime.value = state.time; su.uScroll.value = state.s % 100000;
  su.uMoon.value = lerp(su.uMoon.value, night, k);
  glassMat.uniforms.uRain.value = W.cur.rain; glassMat.uniforms.uSky.value.copy(W.colors.hor); glassMat.uniforms.uNight.value = clamp(W.cur.lamp * (1 - W.cur.sunI / 3.4), 0, 1);
  farRings.forEach((r) => r.material.color.copy(W.colors.tint));
  compMat.uniforms.uExposure.value = W.cur.exposure * (1 + cov * 0.25);
  // luminárias: automáticas no escuro, mas o jogador manda
  const auto = Math.max(W.cur.lamp, cov);
  for (let i = 0; i < 3; i++) {
    const on = state.lampsUser[i] ? state.lamps[i] : auto > 0.55;
    const target = on ? 1 : 0;
    carLights[i].userData.lv = damp(carLights[i].userData.lv || 0, target, 4, dt);
    const lv = carLights[i].userData.lv;
    carLights[i].intensity = lv * 9;
    lampsByCar[i].forEach((g) => { if (g.userData.bulb) g.userData.bulb.visible = lv > 0.3; });
  }
  const lvAll = (carLights[0].userData.lv + carLights[1].userData.lv + carLights[2].userData.lv) / 3;
  M.shade.emissiveIntensity = 0.15 + lvAll * 2.6;
  M.bulb.color.setRGB(1, 0.94, 0.82).multiplyScalar(1 + lvAll * 5);
}

// ---------------------------------------------------------------- rotas e transições
function applyRoute(i) {
  const r = ROUTES[i]; state.route = i;
  Object.assign(terr, { amp: r.amp, ridge: r.ridge, sea: r.sea, lift: r.lift });
  groundUniforms.uAmp.value = r.amp; groundUniforms.uRidge.value = r.ridge; groundUniforms.uSea.value = r.sea; groundUniforms.uLift.value = r.lift;
  groundUniforms.uGrass.value.setHex(r.grass); groundUniforms.uRock.value.setHex(r.rock); groundUniforms.uSnow.value.setHex(r.snowC); groundUniforms.uSand.value.setHex(r.sand);
  groundUniforms.uSnowLine.value = r.snow; groundUniforms.uSandAmt.value = r.sandAmt;
  sea.visible = r.sea > 0;
  setFar(r.far); populateFlora(); setStationName(r.station);
  $('chipRoute').textContent = r.chip; $('route').value = String(i);
  drawBoard();
}
function requestRoute(i) {
  if (i === state.route && state.pendingRoute < 0) { setStatus('Você já viaja pela rota ' + ROUTES[i].name + '.'); return; }
  state.pendingRoute = i;
  if (!tunnel.active) { tunnel.active = true; tunnel.swapped = false; tunnel.x = 380; tunnel.g.visible = true; }
  setStatus('Rota selecionada: ' + ROUTES[i].name + '. O trem vai atravessar um túnel até a nova paisagem.');
  drawBoard(); sfx.click();
}
function tunnelCoverage() {
  if (!tunnel.active) return 0;
  const a = tunnel.x - tunnel.half, b = tunnel.x + tunnel.half; const ov = Math.max(0, Math.min(b, 12) - Math.max(a, -58));
  return ov / 70;
}
function updateTransitions(dx) {
  if (tunnel.active) {
    tunnel.x -= dx; tunnel.g.position.x = tunnel.x;
    if (!tunnel.swapped && tunnel.x < -23 + 8) {
      tunnel.swapped = true;
      if (state.pendingRoute >= 0) { applyRoute(state.pendingRoute); state.pendingRoute = -1; }
      station.active = true; station.belled = false; station.x = tunnel.x - tunnel.half - 260; // após a saída
      station.x = 260 + tunnel.half; station.g.visible = true;
      showBanner(ROUTES[state.route].name, 'Saindo do túnel');
    }
    if (tunnel.x < -tunnel.half - 120) { tunnel.active = false; tunnel.g.visible = false; }
  }
  if (station.active) {
    station.x -= dx; station.g.position.x = station.x;
    if (!station.belled && station.x < -10) { station.belled = true; sfx.bell(); showBanner('Estação ' + ROUTES[state.route].station, 'Parada breve'); setStatus('Passando pela estação ' + ROUTES[state.route].station + '. Boa viagem pela rota ' + ROUTES[state.route].name + '.'); }
    if (station.x < -260) { station.active = false; station.g.visible = false; }
  }
  sfx.setTunnel(tunnelCoverage());
}

// ---------------------------------------------------------------- quadro de destinos
function drawBoard() {
  if (!boardCanvas) return;
  const g = boardCanvas.getContext('2d'), w = 512, h = 256;
  g.fillStyle = '#0f1512'; g.fillRect(0, 0, w, h);
  g.strokeStyle = '#d9b05c'; g.lineWidth = 6; g.strokeRect(8, 8, w - 16, h - 16);
  g.fillStyle = '#d9b05c'; g.font = 'bold 26px Georgia'; g.fillText('PRÓXIMOS DESTINOS', 28, 50);
  const next = state.pendingRoute >= 0 ? ROUTES[state.pendingRoute] : ROUTES[state.route];
  g.fillStyle = '#f4e6c4'; g.font = '34px Georgia'; g.fillText(next.station, 28, 104);
  g.font = '22px Georgia'; g.fillStyle = '#b8c4b0'; g.fillText('Rota: ' + next.name, 28, 140);
  g.fillText('Clima: ' + WEATHERS[state.weather].name, 28, 172);
  g.fillStyle = '#e7b46a'; g.fillText(state.pendingRoute >= 0 ? 'Túnel à frente · troca de paisagem' : 'Destino: nenhum. Só a viagem.', 28, 214);
  boardTex.needsUpdate = true;
}

// ---------------------------------------------------------------- áudio procedural
const sfx = (() => {
  let ctx = null, master, muffle, rumbleG, rumbleF, windG, rainG, padG, tunnelBoost = 0, enabled = false, started = false;
  const noiseBuf = (brown) => {
    const len = ctx.sampleRate * 2, b = ctx.createBuffer(1, len, ctx.sampleRate), d = b.getChannelData(0); let last = 0;
    for (let i = 0; i < len; i++) { const w = Math.random() * 2 - 1; if (brown) { last = (last + 0.02 * w) / 1.02; d[i] = last * 3.5; } else d[i] = w; }
    return b;
  };
  const loop = (buf, filter, gain) => { const s = ctx.createBufferSource(); s.buffer = buf; s.loop = true; s.connect(filter); filter.connect(gain); s.start(); };
  function start() {
    if (started) return; started = true;
    const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return;
    ctx = new AC();
    master = ctx.createGain(); master.gain.value = 0; master.connect(ctx.destination);
    muffle = ctx.createBiquadFilter(); muffle.type = 'lowpass'; muffle.frequency.value = 2400; muffle.connect(master);
    const brown = noiseBuf(true), white = noiseBuf(false);
    rumbleF = ctx.createBiquadFilter(); rumbleF.type = 'lowpass'; rumbleF.frequency.value = 160; rumbleG = ctx.createGain(); rumbleG.gain.value = 0.3; rumbleG.connect(muffle); loop(brown, rumbleF, rumbleG);
    const wf = ctx.createBiquadFilter(); wf.type = 'bandpass'; wf.frequency.value = 900; wf.Q.value = 0.6; windG = ctx.createGain(); windG.gain.value = 0.02; windG.connect(muffle); loop(white, wf, windG);
    const rf = ctx.createBiquadFilter(); rf.type = 'highpass'; rf.frequency.value = 1800; rainG = ctx.createGain(); rainG.gain.value = 0; rainG.connect(master); loop(white, rf, rainG);
    // trilha suave: acordes lentos
    padG = ctx.createGain(); padG.gain.value = 0.0; const pf = ctx.createBiquadFilter(); pf.type = 'lowpass'; pf.frequency.value = 900; padG.connect(pf); pf.connect(master);
    const chords = [[174.6, 220, 261.6, 329.6], [220, 261.6, 329.6, 392], [146.8, 220, 261.6, 349.2], [233.1, 293.7, 349.2, 440]];
    const oscs = chords[0].map((f) => { const o = ctx.createOscillator(); o.type = 'triangle'; o.frequency.value = f; const g = ctx.createGain(); g.gain.value = 0.25; o.connect(g); g.connect(padG); o.start(); return o; });
    let ci = 0; setInterval(() => { if (!ctx) return; ci = (ci + 1) % chords.length; oscs.forEach((o, i) => o.frequency.setTargetAtTime(chords[ci][i], ctx.currentTime, 1.5)); }, 9000);
    padG.gain.setTargetAtTime(0.035, ctx.currentTime, 3);
  }
  function setEnabled(on) {
    enabled = on; if (on) start(); if (!ctx) return;
    if (on && ctx.state === 'suspended') ctx.resume();
    master.gain.setTargetAtTime(on && !state.paused ? 0.8 : 0, ctx.currentTime, 0.25);
  }
  function update(dt, inVestibule) {
    if (!ctx || !enabled) return;
    const vn = state.paused ? 0 : clamp(state.v / 42, 0, 1), t = ctx.currentTime;
    rumbleF.frequency.setTargetAtTime(70 + vn * 220 + tunnelBoost * 60, t, 0.3);
    rumbleG.gain.setTargetAtTime((0.12 + vn * 0.5) * (1 + tunnelBoost * 0.8), t, 0.3);
    windG.gain.setTargetAtTime(vn * 0.05 * (inVestibule ? 2.5 : 1), t, 0.3);
    rainG.gain.setTargetAtTime((W.cur.rain || 0) * 0.07 * (inVestibule ? 1.8 : 1), t, 0.5);
    muffle.frequency.setTargetAtTime(inVestibule ? 7000 : 1900 - tunnelBoost * 700, t, 0.25);
    master.gain.setTargetAtTime(state.paused ? 0 : 0.8, t, 0.3);
  }
  function hit(time, f, g, d) {
    const o = ctx.createOscillator(); o.type = 'square'; o.frequency.setValueAtTime(f, time); o.frequency.exponentialRampToValueAtTime(f * 0.5, time + d);
    const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = f * 2; bp.Q.value = 2;
    const gg = ctx.createGain(); gg.gain.setValueAtTime(0, time); gg.gain.linearRampToValueAtTime(g, time + 0.004); gg.gain.exponentialRampToValueAtTime(0.0001, time + d);
    o.connect(bp); bp.connect(gg); gg.connect(muffle); o.start(time); o.stop(time + d + 0.05);
  }
  function clack() {
    if (!ctx || !enabled || state.paused) return; const t = ctx.currentTime, v = Math.max(state.v, 4), g = 0.07 + 0.12 * clamp(state.v / 42, 0, 1);
    [0, 2.5 / v, 17 / v, 19.5 / v].forEach((o, i) => hit(t + o, i % 2 ? 95 : 120, g * (i < 2 ? 1 : 0.6), 0.09));
  }
  function bell() {
    if (!ctx || !enabled) return; const t = ctx.currentTime;
    for (let k = 0; k < 3; k++) [880, 1320, 2210].forEach((f, j) => {
      const o = ctx.createOscillator(); o.type = 'sine'; o.frequency.value = f; const g = ctx.createGain();
      g.gain.setValueAtTime(0, t + k * 0.6); g.gain.linearRampToValueAtTime(0.12 / (j + 1), t + k * 0.6 + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t + k * 0.6 + 2.2);
      o.connect(g); g.connect(master); o.start(t + k * 0.6); o.stop(t + k * 0.6 + 2.3);
    });
  }
  function pour(d) {
    if (!ctx || !enabled) return; const t = ctx.currentTime, s = ctx.createBufferSource(); s.buffer = noiseBuf(false);
    const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.Q.value = 3; bp.frequency.setValueAtTime(700, t); bp.frequency.linearRampToValueAtTime(1500, t + d);
    const g = ctx.createGain(); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.18, t + 0.15); g.gain.setValueAtTime(0.18, t + d - 0.2); g.gain.linearRampToValueAtTime(0, t + d);
    s.connect(bp); bp.connect(g); g.connect(master); s.start(t); s.stop(t + d + 0.1);
  }
  function click() {
    if (!ctx || !enabled) return; const t = ctx.currentTime, o = ctx.createOscillator(), g = ctx.createGain();
    o.frequency.value = 1400; o.type = 'sine'; g.gain.setValueAtTime(0.06, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.07); o.connect(g); g.connect(master); o.start(t); o.stop(t + 0.08);
  }
  function shutter() { if (!ctx || !enabled) return; hit(ctx.currentTime, 1800, 0.12, 0.05); hit(ctx.currentTime + 0.07, 1200, 0.1, 0.05); }
  return { start, setEnabled, update, clack, bell, pour, click, shutter, setTunnel: (c) => (tunnelBoost = c), get enabled() { return enabled; } };
})();

// ---------------------------------------------------------------- interface
let toastTimer = 0, bannerTimer = 0;
function setStatus(t) { $('status').textContent = t; }
function toast(html, ms = 2600) { const el = $('toast'); el.innerHTML = html; el.classList.add('on'); clearTimeout(toastTimer); toastTimer = setTimeout(() => el.classList.remove('on'), ms); }
function showBanner(title, sub) { const el = $('banner'); el.innerHTML = `<small>${sub}</small>${title}`; el.classList.add('on'); clearTimeout(bannerTimer); bannerTimer = setTimeout(() => el.classList.remove('on'), 3200); }
function press(el, on) { el.setAttribute('aria-pressed', on ? 'true' : 'false'); }
function updateCarUI() {
  $('carName').textContent = CAR_NAMES[state.car];
  document.querySelectorAll('.steps li').forEach((li) => { if (+li.dataset.car === state.car) li.setAttribute('aria-current', 'step'); else li.removeAttribute('aria-current'); });
  if (state.seated < 0) { $('ctxTitle').textContent = CAR_NAMES[state.car]; $('ctxText').textContent = CAR_TEXT[state.car]; }
  $('curtainBtn').textContent = state.curtainTarget[state.car] > 0.5 ? 'Abrir cortinas' : 'Fechar cortinas';
  const lampOn = state.lampsUser[state.car] ? state.lamps[state.car] : (carLights[state.car].userData.lv || 0) > 0.5;
  $('lampBtn').textContent = lampOn ? 'Apagar luminárias' : 'Acender luminárias';
  $('walkBtn').textContent = state.car < 2 ? 'Ir ao próximo vagão' : 'Voltar ao salão';
}
function updateTeaUI() {
  const steps = [$('tea0'), $('tea1'), $('tea2')];
  steps.forEach((s, i) => { s.classList.toggle('done', i < state.tea); if (i === Math.min(state.tea, 2)) s.setAttribute('aria-current', 'step'); else s.removeAttribute('aria-current'); });
  $('cupBtn').textContent = state.tea >= 2 ? 'Beber chá' : 'Selecionar xícara';
  $('cupBtn').disabled = state.tea === 1 || state.pourT > 0;
  $('pourBtn').disabled = state.tea !== 1 || state.pourT > 0;
}

// ---------------------------------------------------------------- ações
function sitAt(idx) {
  const st = seats[idx]; if (!st) return;
  state.seated = idx; state.tour = false; press($('tourBtn'), false);
  player.pos.set(st.pos.x, 0, clamp(st.pos.z * 0.5, -0.7, 0.7)); player.yaw = st.yaw; player.pitch = -0.05; state.car = st.car;
  $('ctxPrimary').textContent = 'Sentar à janela'; $('ctxPrimary').disabled = true; $('standBtn').hidden = false;
  $('ctxTitle').textContent = 'À janela · ' + CAR_SHORT[st.car];
  $('ctxText').textContent = 'Arraste para olhar a paisagem. Toque em Levantar (ou Q) para voltar ao corredor.';
  setStatus('Você está sentado à janela do ' + CAR_NAMES[st.car].toLowerCase() + '. A paisagem segue ' + ROUTES[state.route].name.toLowerCase() + '.');
  updateCarUI(); sfx.click();
}
function nearestSeat() {
  let best = -1, bd = 1e9;
  seats.forEach((s, i) => { const d = Math.abs(s.pos.x - player.pos.x) + (s.car === state.car ? 0 : 50); if (d < bd) { bd = d; best = i; } });
  return best;
}
function stand() {
  if (state.seated < 0) return;
  const st = seats[state.seated]; state.seated = -1;
  player.pos.set(st.pos.x, 0, 0); player.yaw = Math.PI / 2; player.pitch = -0.03;
  $('ctxPrimary').disabled = false; $('standBtn').hidden = true;
  setStatus('De pé no corredor. Caminhe entre os vagões com WASD ou o joystick.');
  updateCarUI(); sfx.click();
}
function toggleCurtains(car = state.car) {
  state.curtainTarget[car] = state.curtainTarget[car] > 0.5 ? 0 : 1;
  setStatus(state.curtainTarget[car] ? 'Cortinas fechadas no ' + CAR_NAMES[car].toLowerCase() + '.' : 'Cortinas abertas. A paisagem volta a entrar.');
  updateCarUI(); sfx.click();
}
function toggleLamps(car = state.car) {
  const cur = state.lampsUser[car] ? state.lamps[car] : (carLights[car].userData.lv || 0) > 0.5;
  state.lampsUser[car] = true; state.lamps[car] = !cur;
  setStatus(state.lamps[car] ? 'Luminárias de tecido acesas.' : 'Luminárias apagadas.');
  updateCarUI(); sfx.click();
}
function teaStep() {
  if (state.pourT > 0) return;
  if (state.tea === 0) { state.tea = 1; setStatus('Xícara selecionada. Agora sirva o chá.'); }
  else if (state.tea === 1) { state.pourT = 2.4; sfx.pour(2.4); setStatus('Servindo o chá…'); }
  else { state.drinking = true; state.tea = 0; setStatus('Um gole quente. A xícara volta ao pires.'); }
  updateTeaUI(); sfx.click();
}
let bookPage = 0;
function openBook() { bookPage = 0; renderBook(); $('book').hidden = false; $('bookNext').focus(); setStatus('Lendo “A estação que não existia”.'); }
function renderBook() { $('bookPage').textContent = BOOK[bookPage]; $('bookNum').textContent = (bookPage + 1) + '/' + BOOK.length; $('bookPrev').disabled = bookPage === 0; $('bookNext').disabled = bookPage === BOOK.length - 1; }
function closeBook() { $('book').hidden = true; setStatus('Livro fechado. Ele continua sobre a mesa da cabine de leitura.'); canvas.focus(); }
function runAction(a) {
  if (!a) return;
  if (a.type === 'seat') sitAt(a.idx);
  else if (a.type === 'curtain') toggleCurtains(a.car);
  else if (a.type === 'lamp') toggleLamps(a.car);
  else if (a.type === 'tea') teaStep();
  else if (a.type === 'book') openBook();
  else if (a.type === 'board') { $('route').focus(); setStatus('Quadro de destinos: escolha a próxima rota no painel.'); openPanel(true); }
}
const ACTION_LABEL = { curtain: () => 'Abrir ou fechar cortinas', lamp: () => 'Acender ou apagar luminária', tea: () => state.tea === 0 ? 'Selecionar xícara' : state.tea === 1 ? 'Servir chá' : 'Beber chá', book: () => 'Ler o livro', board: () => 'Escolher destino', seat: () => 'Sentar aqui' };
function photo() {
  renderFrame();
  let url = '';
  try { url = canvas.toDataURL('image/jpeg', 0.92); } catch (e) { url = ''; }
  const f = $('flash'); f.classList.add('on'); requestAnimationFrame(() => requestAnimationFrame(() => f.classList.remove('on')));
  sfx.shutter();
  if (url) toast(`<img src="${url}" alt="Foto da janela"> <span>Foto da janela pronta.</span> <a href="${url}" download="trem-sem-destino.jpg">Salvar</a>`, 6000);
  setStatus('Foto tirada da paisagem ' + ROUTES[state.route].name.toLowerCase() + '.');
}
function setScenery(on) {
  state.scenery = on; press($('sceneryBtn'), on);
  $('app').classList.toggle('scenery', on); $('exitScenery').hidden = !on;
  if (on) { sitAt(seats.findIndex((s) => s.car === 0 && s.yaw === Math.PI)); state.curtainTarget[0] = 0; setStatus('Modo só paisagem.'); }
  resize();
}
function setTour(on) {
  state.tour = on; press($('tourBtn'), on);
  if (on) { stand(); state.tourIdx = 0; state.tourT = 0; setStatus('Passeio automático: o trem mostra cada vagão. Qualquer comando devolve o controle.'); }
  else setStatus('Passeio automático encerrado.');
}
function setReduced(on) {
  state.reduced = on; press($('motion'), on);
  if (on) { state.stable = true; press($('stableBtn'), true); }
  updateSpeed(); setStatus(on ? 'Movimento reduzido: velocidade limitada, sem balanço.' : 'Movimento completo restaurado.');
}
function updateSpeed() {
  const t = +$('speed').value / 100; state.speedT = t;
  let v = 6 + t * 36; if (state.reduced) v = Math.min(v, 14);
  state.vTarget = v;
  const kmh = Math.round(v * 3.6) + ' km/h'; $('speedOut').textContent = kmh;
}
function setPaused(on) {
  state.paused = on; press($('pause'), on); $('pause').textContent = on ? 'Retomar' : 'Pausar';
  sfx.setEnabled(sfx.enabled);
  setStatus(on ? 'Viagem pausada. A paisagem parou.' : 'Viagem retomada.');
}
function setWeather(i) {
  state.weather = i; document.querySelectorAll('[data-weather]').forEach((b) => press(b, +b.dataset.weather === i));
  $('chipWeather').textContent = WEATHERS[i].name; setStatus('Clima: ' + WEATHERS[i].name.toLowerCase() + '.'); drawBoard(); sfx.click();
}
function resetScene() {
  stand(); state.tour = false; press($('tourBtn'), false); setScenery(false);
  player.pos.set(5, 0, 0); player.yaw = Math.PI / 2 + 0.55; player.pitch = -0.04;
  state.curtainTarget = [0, 0, 0]; state.lampsUser = [false, false, false]; state.tea = 0; state.teaFill = 0; state.pourT = 0;
  $('speed').value = 45; updateSpeed(); setWeather(0);
  if (state.route !== 0) applyRoute(0);
  tunnel.active = false; tunnel.g.visible = false; station.active = false; station.g.visible = false; state.pendingRoute = -1;
  updateTeaUI(); updateCarUI(); setStatus('Cena reiniciada. Modo livre.');
}
function openPanel(open) { const p = $('panel'); p.classList.toggle('open', open); $('sheetToggle').setAttribute('aria-expanded', String(open)); $('sheetToggle').textContent = open ? 'Fechar' : 'Viagem'; }

// ---------------------------------------------------------------- entrada
const keys = new Set();
const joy = { active: false, x: 0, y: 0, id: -1 };
const look = { id: -1, x: 0, y: 0, moved: 0, sx: 0, sy: 0, t: 0 };
const raycaster = new THREE.Raycaster(); raycaster.far = 3.6;
function pickAt(nx, ny) {
  raycaster.setFromCamera(new THREE.Vector2(nx, ny), camera);
  const hits = raycaster.intersectObjects(interactables, true);
  for (const h of hits) if (h.object.userData.action) return h.object.userData.action;
  // assentos: aproximação por distância do raio
  return null;
}
function userTookControl() { if (state.tour) setTour(false); sfx.setEnabled(true); syncSoundBtn(); }
window.addEventListener('keydown', (e) => {
  if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') && !['KeyW', 'KeyA', 'KeyS', 'KeyD'].includes(e.code)) return;
  if (!$('book').hidden) { if (e.code === 'Escape') closeBook(); if (e.code === 'ArrowRight' && bookPage < BOOK.length - 1) { bookPage++; renderBook(); } if (e.code === 'ArrowLeft' && bookPage > 0) { bookPage--; renderBook(); } return; }
  keys.add(e.code);
  if (['KeyW', 'KeyA', 'KeyS', 'KeyD', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) { userTookControl(); if (state.seated >= 0 && ['KeyW', 'KeyS', 'ArrowUp', 'ArrowDown'].includes(e.code)) stand(); }
  if (e.code === 'KeyE') { const a = focusAction || null; if (a) runAction(a); else if (state.seated < 0) sitAt(nearestSeat()); }
  if (e.code === 'KeyQ') stand();
  if (e.code === 'KeyF') photo();
  if (e.code === 'KeyP') setPaused(!state.paused);
  if (e.code === 'Escape' && state.scenery) setScenery(false);
  if (e.code.startsWith('Arrow') || e.code === 'Space') e.preventDefault();
});
window.addEventListener('keyup', (e) => keys.delete(e.code));
window.addEventListener('blur', () => keys.clear());
canvas.addEventListener('pointerdown', (e) => {
  canvas.focus(); sfx.setEnabled(true); syncSoundBtn();
  if (look.id !== -1) return; look.id = e.pointerId; look.x = look.sx = e.clientX; look.y = look.sy = e.clientY; look.moved = 0; look.t = performance.now();
  canvas.setPointerCapture(e.pointerId);
});
canvas.addEventListener('pointermove', (e) => {
  if (e.pointerId !== look.id) return;
  const dx = e.clientX - look.x, dy = e.clientY - look.y; look.x = e.clientX; look.y = e.clientY; look.moved += Math.abs(dx) + Math.abs(dy);
  const k = e.pointerType === 'touch' ? 0.0055 : 0.0042;
  player.yaw += dx * k; player.pitch = clamp(player.pitch - dy * k, -1.1, 1.0);
  if (look.moved > 6 && state.tour) setTour(false);
});
const endLook = (e) => {
  if (e.pointerId !== look.id) return; look.id = -1;
  if (look.moved < 8 && performance.now() - look.t < 450) { // toque/clique curto = interagir no ponto
    const r = canvas.getBoundingClientRect(); const a = pickAt(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    if (a) runAction(a);
  }
};
canvas.addEventListener('pointerup', endLook); canvas.addEventListener('pointercancel', endLook);
const joyEl = $('joy'), knob = $('knob');
joyEl.addEventListener('pointerdown', (e) => { joy.active = true; joy.id = e.pointerId; joyEl.setPointerCapture(e.pointerId); moveJoy(e); userTookControl(); });
joyEl.addEventListener('pointermove', (e) => { if (joy.active && e.pointerId === joy.id) moveJoy(e); });
const endJoy = () => { joy.active = false; joy.x = joy.y = 0; knob.style.transform = ''; };
joyEl.addEventListener('pointerup', endJoy); joyEl.addEventListener('pointercancel', endJoy);
function moveJoy(e) {
  const r = joyEl.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2, R = r.width / 2;
  let dx = (e.clientX - cx) / R, dy = (e.clientY - cy) / R; const l = Math.hypot(dx, dy); if (l > 1) { dx /= l; dy /= l; }
  joy.x = dx; joy.y = dy; knob.style.transform = `translate(${dx * R * 0.6}px,${dy * R * 0.6}px)`;
  if (state.seated >= 0 && Math.abs(dy) > 0.5) stand();
}

// ---------------------------------------------------------------- simulação do jogador
const TOUR = [{ x: 4, look: 1 }, { x: -3, look: -1 }, { x: -18, look: 1 }, { x: -25.6, look: -1 }, { x: -40, look: 1 }, { x: -46.4, look: -1 }, { x: -30, look: 1 }, { x: 0, look: -1 }];
function carAt(x) { return clamp(Math.round(-x / CAR_PITCH), 0, 2); }
function zoneHalfWidth(x) {
  const i = carAt(x), cx = carX(i);
  return Math.abs(x - cx) <= CAR_LEN / 2 - 0.25 ? 0.72 : 0.36;
}
let inVestibule = false;
function updatePlayer(dt) {
  if (state.seated >= 0) return;
  let fx = 0, fz = 0;
  if (keys.has('KeyW') || keys.has('ArrowUp')) fz += 1;
  if (keys.has('KeyS') || keys.has('ArrowDown')) fz -= 1;
  if (keys.has('KeyD')) fx += 1; if (keys.has('KeyA')) fx -= 1;
  if (keys.has('ArrowLeft')) player.yaw += 1.8 * dt; if (keys.has('ArrowRight')) player.yaw -= 1.8 * dt;
  if (joy.active) { fx += joy.x; fz -= joy.y; }
  if (state.tour) { // passeio automático
    const wp = TOUR[state.tourIdx]; const d = wp.x - player.pos.x;
    if (Math.abs(d) > 0.3) { player.yaw = damp(player.yaw, d < 0 ? Math.PI / 2 : -Math.PI / 2, 2.5, dt); fz = 0.55; }
    else { state.tourT += dt; player.yaw = damp(player.yaw, wp.look > 0 ? Math.PI : 0, 1.6, dt); player.pitch = damp(player.pitch, -0.05, 2, dt); if (state.tourT > 4.5) { state.tourT = 0; state.tourIdx = (state.tourIdx + 1) % TOUR.length; } }
    // passeio anda sempre ao longo do corredor
    if (fz) { player.pos.z = damp(player.pos.z, 0, 3, dt); }
  }
  const len = Math.hypot(fx, fz); if (len > 1) { fx /= len; fz /= len; }
  const sp = keys.has('ShiftLeft') ? 3.6 : 2.4;
  const fwd = new THREE.Vector3(-Math.sin(player.yaw), 0, -Math.cos(player.yaw)), right = new THREE.Vector3(Math.cos(player.yaw), 0, -Math.sin(player.yaw));
  const want = fwd.multiplyScalar(fz * sp).add(right.multiplyScalar(fx * sp));
  if (state.tour && fz) want.set(Math.sign(TOUR[state.tourIdx].x - player.pos.x) * 1.6, 0, 0);
  player.vel.x = damp(player.vel.x, want.x, 10, dt); player.vel.z = damp(player.vel.z, want.z, 10, dt);
  // colisão por zonas: corredor dos vagões e passagens estreitas
  let nx = clamp(player.pos.x + player.vel.x * dt, carX(2) - CAR_LEN / 2 + 0.45, CAR_LEN / 2 - 0.45);
  let nz = player.pos.z + player.vel.z * dt;
  const hwNext = zoneHalfWidth(nx);
  if (Math.abs(nz) > hwNext) {
    if (zoneHalfWidth(player.pos.x) > hwNext && Math.abs(player.pos.z) > hwNext + 0.02) {
      // perto da porta: centraliza suavemente em vez de travar
      nz = damp(player.pos.z, 0, 6, dt); if (Math.abs(nz) > hwNext) nx = player.pos.x;
    } else nz = clamp(nz, -hwNext, hwNext);
  }
  player.pos.x = nx; player.pos.z = nz;
  const c = carAt(player.pos.x); if (c !== state.car) { state.car = c; updateCarUI(); }
  inVestibule = zoneHalfWidth(player.pos.x) < 0.5;
}
function updateDoors(dt) {
  doors.forEach((d) => {
    const near = !d.locked && Math.abs(camPose.pos.x - d.x) < 2.4 && state.seated < 0;
    d.open = damp(d.open, near ? 1 : 0, 6, dt); d.g.position.z = d.open * 0.86;
  });
}
function updateCamera(dt) {
  const seated = state.seated >= 0;
  let target = player.pos.clone(); target.y = seated ? 1.12 : 1.62;
  if (seated) { const st = seats[state.seated]; target.copy(st.pos); }
  // bob ao caminhar
  const spd = Math.hypot(player.vel.x, player.vel.z);
  if (!seated && spd > 0.2 && !state.stable) target.y += Math.sin(state.time * 8) * 0.025 * Math.min(1, spd / 2.4);
  // suspensão: mola amortecida excitada pelas juntas dos trilhos
  if (!state.stable && !state.paused) {
    sway.vy += (-60 * sway.y - 7 * sway.vy) * dt; sway.y += sway.vy * dt;
    sway.vx += (-25 * sway.x - 4 * sway.vx) * dt; sway.x += sway.vx * dt;
    target.y += sway.y; target.z += sway.x;
  } else { sway.y = damp(sway.y, 0, 6, dt); sway.x = damp(sway.x, 0, 6, dt); }
  const k = seated ? 5 : 14;
  camPose.pos.x = damp(camPose.pos.x, target.x, k, dt); camPose.pos.y = damp(camPose.pos.y, target.y, k, dt); camPose.pos.z = damp(camPose.pos.z, target.z, k, dt);
  if (seated) { // limita olhar para não atravessar o vidro
    const base = seats[state.seated].yaw; let d = player.yaw - base; d = Math.atan2(Math.sin(d), Math.cos(d)); player.yaw = base + clamp(d, -1.5, 1.5);
  }
  camera.position.copy(camPose.pos); camera.rotation.y = player.yaw; camera.rotation.x = player.pitch;
}
function kick() { if (state.stable) return; const a = clamp(state.v / 42, 0.15, 1); sway.vy += (Math.random() * 0.5 + 0.5) * 0.09 * a; sway.vx += (Math.random() - 0.5) * 0.05 * a; }

// ---------------------------------------------------------------- animações de objetos
function updateCurtains(dt) {
  for (let i = 0; i < 3; i++) {
    state.curtains[i] = damp(state.curtains[i], state.curtainTarget[i], 3, dt);
    const c = state.curtains[i], sx = lerp(0.2, 1.02, c);
    curtainsByCar[i].forEach((m) => { m.scale.x = -m.userData.dir * sx; });
  }
}
function updateTea(dt) {
  const t = teaSet; if (!t) return;
  const target = state.tea >= 1 || state.pourT > 0 ? t.serve : t.home;
  t.cup.position.lerp(target, 1 - Math.exp(-dt * 6));
  if (state.pourT > 0) {
    state.pourT -= dt; const p = 1 - Math.max(state.pourT, 0) / 2.4;
    state.teaFill = Math.min(0.82, state.teaFill + dt * 0.4); // volume nunca passa do limite
    t.pot.rotation.z = damp(t.pot.rotation.z, -0.75, 6, dt);
    t.stream.visible = p > 0.1 && p < 0.92;
    const sp = new THREE.Vector3(0.068, 0.15, -0.002).add(t.pot.position); // aproximação do bico inclinado
    const cp = t.cup.position.clone().add(new THREE.Vector3(0, 0.05, 0));
    t.stream.position.copy(sp).add(cp).multiplyScalar(0.5); t.stream.scale.y = Math.max(0.01, sp.distanceTo(cp));
    t.stream.lookAt(t.group.localToWorld(cp.clone())); t.stream.rotateX(Math.PI / 2);
    if (state.pourT <= 0) { state.pourT = 0; state.tea = 2; t.stream.visible = false; setStatus('Chá servido. Observe o vapor subir da xícara.'); updateTeaUI(); }
  } else t.pot.rotation.z = damp(t.pot.rotation.z, 0, 5, dt);
  if (state.drinking) { state.teaFill = Math.max(0, state.teaFill - dt * 0.35); if (state.teaFill <= 0) state.drinking = false; }
  t.liquid.visible = state.teaFill > 0.01;
  const f = state.teaFill; t.liquid.position.y = 0.008 + f * 0.05; t.liquid.scale.setScalar(0.024 + f * 0.022);
  $('teaMeter').value = Math.round(f / 0.82 * 100);
  // vapor
  const hot = state.tea === 2 || (f > 0.2 && !state.drinking) ? 1 : 0;
  t.steam.material.opacity = damp(t.steam.material.opacity, hot * 0.35, 2, dt);
  const arr = t.steam.geometry.attributes.position.array, cp = t.cup.position;
  t.steamSeeds.forEach((s, i) => {
    s.t = (s.t + dt * 0.35) % 1; const h = s.t * 0.28;
    arr[i * 3] = cp.x + Math.sin(s.a + state.time * 1.3 + h * 9) * 0.012 * (1 + h * 6) - h * 0.04;
    arr[i * 3 + 1] = cp.y + 0.06 + h; arr[i * 3 + 2] = cp.z + Math.cos(s.a + h * 7) * 0.01 * (1 + h * 4);
  });
  t.steam.geometry.attributes.position.needsUpdate = true;
}

// ---------------------------------------------------------------- foco contextual
let focusAction = null, focusTimer = 0;
function updateFocus(dt) {
  focusTimer -= dt; if (focusTimer > 0) return; focusTimer = 0.12;
  const a = pickAt(0, 0); focusAction = a;
  $('crosshair').classList.toggle('hot', !!a);
  const btn = $('ctxFocus');
  if (a) { btn.hidden = false; btn.textContent = 'E · ' + ACTION_LABEL[a.type](); } else btn.hidden = true;
  const dot = $('miniDot'); dot.style.left = (clamp((CAR_LEN / 2 - camPose.pos.x) / (CAR_PITCH * 2 + CAR_LEN), 0, 1) * 100) + '%';
  $('chipSpeed').textContent = Math.round((state.paused ? 0 : state.v) * 3.6) + ' km/h';
}

// ---------------------------------------------------------------- laço principal
let last = performance.now(), frames = 0, firstFrame = true;
function tick(now) {
  requestAnimationFrame(tick);
  if (window.__SANGI_DISPOSED__) return;
  const dt = Math.min(0.05, Math.max(0.0001, (now - last) / 1000)); last = now;
  const paused = state.paused || window.__SANGI_PAUSED__;
  if (!paused) {
    state.time += dt;
    // aproxima velocidade (desacelera na estação e no túnel de troca)
    let vt = state.vTarget; if (station.active && Math.abs(station.x) < 140) vt = Math.min(vt, 9);
    state.v = damp(state.v, vt, 0.8, dt);
    const dx = state.v * dt; state.s += dx;
    groundUniforms.uS.value = modS();
    updateFlora(dx); updateTrack(); updateTransitions(dx); updateRain(dt);
    farRings.forEach((r, l) => { if (r.material.map) r.material.map.offset.x = (state.s * (l ? 0.0000045 : 0.0000018)) % 1; });
    if (sea.visible) sea.material.normalMap.offset.x = (state.s * 0.0008) % 1;
    const j = Math.floor(state.s / 25); if (j !== state.joint) { state.joint = j; kick(); sfx.clack(); }
    glassMat.uniforms.uTime.value = state.time; glassMat.uniforms.uSpeed.value = 0.4 + state.v / 30;
    updateTea(dt);
  }
  updateWeather(dt);
  updatePlayer(dt); updateCamera(dt); updateDoors(dt); updateCurtains(dt); updateFocus(dt);
  sfx.update(dt, inVestibule);
  compMat.uniforms.uTime.value = state.time;
  renderFrame();
  if (firstFrame) { firstFrame = false; $('loading').classList.add('done'); setTimeout(() => $('loading').remove(), 900); document.documentElement.dataset.ready = 'true'; state.ready = true; }
  if ((frames++ & 63) === 0) drawBoardClock();
}
function drawBoardClock() {
  if (!boardCanvas) return; const g = boardCanvas.getContext('2d');
  const km = (state.s / 1000).toFixed(1);
  g.fillStyle = '#0f1512'; g.fillRect(330, 20, 170, 40); g.fillStyle = '#e7b46a'; g.font = '20px Georgia'; g.fillText(km + ' km', 360, 48);
  boardTex.needsUpdate = true;
}

// ---------------------------------------------------------------- ligação da UI
function syncSoundBtn() { const on = sfx.enabled; press($('sound'), on); $('sound').textContent = on ? 'Silenciar' : 'Ativar som'; }
function bindUI() {
  // botão de foco contextual
  const focusBtn = document.createElement('button'); focusBtn.id = 'ctxFocus'; focusBtn.className = 'ghost'; focusBtn.hidden = true;
  $('ctxPrimary').after(focusBtn);
  focusBtn.addEventListener('click', () => runAction(focusAction));
  $('ctxPrimary').addEventListener('click', () => { sfx.setEnabled(true); syncSoundBtn(); if (state.seated < 0) sitAt(nearestSeat()); });
  $('standBtn').addEventListener('click', stand);
  $('route').addEventListener('change', (e) => requestRoute(+e.target.value));
  $('route').addEventListener('input', (e) => requestRoute(+e.target.value));
  document.querySelectorAll('[data-weather]').forEach((b) => b.addEventListener('click', () => setWeather(+b.dataset.weather)));
  $('speed').addEventListener('input', () => { updateSpeed(); setStatus('Velocidade visual: ' + $('speedOut').textContent + '.'); });
  $('curtainBtn').addEventListener('click', () => toggleCurtains());
  $('lampBtn').addEventListener('click', () => toggleLamps());
  $('readBtn').addEventListener('click', openBook);
  $('walkBtn').addEventListener('click', () => { stand(); const target = state.car < 2 ? state.car + 1 : 0; player.pos.set(carX(target) + (target ? 8 : 4), 0, 0); player.yaw = Math.PI / 2; state.car = target; updateCarUI(); setStatus('Você atravessou para o ' + CAR_NAMES[target].toLowerCase() + '.'); });
  $('cupBtn').addEventListener('click', teaStep);
  $('pourBtn').addEventListener('click', teaStep);
  $('stableBtn').addEventListener('click', () => { state.stable = !state.stable; press($('stableBtn'), state.stable); setStatus(state.stable ? 'Vista estável: balanço desligado.' : 'Balanço suave do vagão ligado.'); });
  $('tourBtn').addEventListener('click', () => setTour(!state.tour));
  $('sceneryBtn').addEventListener('click', () => setScenery(!state.scenery));
  $('exitScenery').addEventListener('click', () => setScenery(false));
  $('motion').addEventListener('click', () => setReduced(!state.reduced));
  $('sound').addEventListener('click', () => { sfx.setEnabled(!sfx.enabled); syncSoundBtn(); });
  $('pause').addEventListener('click', () => setPaused(!state.paused));
  $('photo').addEventListener('click', photo);
  $('reset').addEventListener('click', resetScene);
  $('quality').addEventListener('change', (e) => applyQuality(e.target.value));
  $('sheetToggle').addEventListener('click', () => openPanel(!$('panel').classList.contains('open')));
  $('welcomeClose').addEventListener('click', () => $('welcome').classList.add('hide'));
  setTimeout(() => $('welcome').classList.add('hide'), 14000);
  $('bookPrev').addEventListener('click', () => { if (bookPage > 0) { bookPage--; renderBook(); } });
  $('bookNext').addEventListener('click', () => { if (bookPage < BOOK.length - 1) { bookPage++; renderBook(); } });
  $('bookClose').addEventListener('click', closeBook);
  window.addEventListener('resize', resize);
  // ponte do launcher
  window.addEventListener('sangi:pause', () => setPaused(true));
  window.addEventListener('sangi:resume', () => setPaused(false));
  window.addEventListener('sangi:mute', (e) => { sfx.setEnabled(!(e.detail && e.detail.muted)); syncSoundBtn(); });
  window.addEventListener('sangi:reset', resetScene);
  window.addEventListener('sangi:quality', (e) => { const q = String((e.detail && e.detail.quality) || '').toUpperCase(); if (QUALITY[q]) applyQuality(q); });
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) setReduced(true);
}

// ---------------------------------------------------------------- montagem
buildTextures(); buildMaterials();
for (let i = 0; i < 3; i++) buildCar(i);
buildVestibule(0); buildVestibule(1);
buildGround(); buildSea(); buildFar(); buildFlora(); buildTrack(); buildTunnel(); buildStation(); buildRain(); buildEnv();
train.traverse((o) => { if (o.isMesh && o.castShadow) shadowCasters.push(o); });
initWeather(); applyRoute(0); bindUI(); updateSpeed(); state.v = state.vTarget;
const coarse = window.matchMedia && window.matchMedia('(pointer:coarse)').matches;
applyQuality(window.__SANGI_QUALITY__ && QUALITY[String(window.__SANGI_QUALITY__).toUpperCase()] ? String(window.__SANGI_QUALITY__).toUpperCase() : (coarse ? 'LOW' : 'BALANCED'));
camPose.pos.set(player.pos.x, 1.62, 0);
updateCarUI(); updateTeaUI(); drawBoard();
window.__trem = { scene, renderer, state, player, seats, snapWeather: initWeather, applyRoute, tunnel, station, requestRoute, setWeather, sitAt, stand, teaStep };
requestAnimationFrame((t) => { last = t; tick(t); });
