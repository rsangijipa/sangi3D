import { THREE, clamp, rng } from '../runtime.js';
import { navigator, withNavigation, atmosphereAudio } from '../navigation.js';
import { atmosphere, mat, glow, wood, box, beam, orb, tube, boxes, group, sign, lamp, precip, teaSet, mesh, surfaceMaterial, cushion } from '../scenery.js';

function table(scene, material, x, z, w = 1.3, d = .75, y = .72) {
  box(scene, material, x, y, z, w, .09, d);
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) box(scene, material, x + sx * w * .39, y * .47, z + sz * d * .37, .08, y, .08);
}

function seat(scene, fabric, frame, x, z, rotation = 0) {
  const chair = group(scene, x, 0, z);
  chair.rotation.y = rotation;
  box(chair, frame, 0, .28, 0, .60, .42, .61);
  cushion(chair, fabric, 0, .48, .02, .64, .19, .67);
  cushion(chair, fabric, 0, .82, -.28, .64, .69, .21);
  for (const side of [-1, 1]) box(chair, frame, side * .32, .63, 0, .08, .07, .57);
}

function artworkTexture(seed, title, palette) {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 192;
  const c = canvas.getContext('2d');
  const rand = rng(seed);
  const grad = c.createLinearGradient(0, 0, 0, 192);
  grad.addColorStop(0, palette[0]);
  grad.addColorStop(1, palette[1]);
  c.fillStyle = grad;
  c.fillRect(0, 0, 256, 192);
  for (let i = 0; i < 18; i++) {
    c.fillStyle = palette[2 + (i % (palette.length - 2))];
    c.globalAlpha = .28 + rand() * .48;
    const w = 14 + rand() * 44, h = 24 + rand() * 96;
    c.fillRect(rand() * (256 - w), 170 - h - rand() * 35, w, h);
  }
  c.globalAlpha = .85;
  c.fillStyle = '#f4ede2';
  c.font = '600 13px system-ui, sans-serif';
  c.fillText(title, 14, 178);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function createMusicSynth(ctx) {
  let timer = null, track = 0, playing = false, muted = true, paused = false;
  let bus = null;
  const tracks = [
    { name: 'Chuva em Si Menor', tempo: 680, notes: [246.94, 293.66, 369.99, 440, 369.99, 293.66] },
    { name: 'Último Trem', tempo: 540, notes: [220, 261.63, 329.63, 392, 329.63, 261.63] },
    { name: 'Névoa de Neon', tempo: 610, notes: [196, 246.94, 293.66, 369.99, 329.63, 246.94] },
  ];
  let step = 0;

  function ensureBus() {
    if (bus) return bus;
    const { audio, master } = ctx.audio();
    bus = audio.createGain();
    bus.gain.value = 0;
    bus.connect(master);
    return bus;
  }

  function scheduleNote() {
    if (!playing || muted || paused) return;
    const { audio } = ctx.audio();
    const out = ensureBus();
    const t = tracks[track];
    const freq = t.notes[step % t.notes.length];
    step++;
    const now = audio.currentTime;
    const osc = audio.createOscillator();
    const env = audio.createGain();
    osc.type = track === 1 ? 'triangle' : 'sine';
    osc.frequency.setValueAtTime(freq, now);
    env.gain.setValueAtTime(.0005, now);
    env.gain.exponentialRampToValueAtTime(.09, now + .06);
    env.gain.exponentialRampToValueAtTime(.0005, now + .52);
    osc.connect(env).connect(out);
    osc.start(now);
    osc.stop(now + .56);
    osc.onended = () => { osc.disconnect(); env.disconnect(); };
  }

  function syncTimer() {
    if (timer) { clearInterval(timer); timer = null; }
    if (playing && !muted && !paused) {
      ensureBus().gain.setTargetAtTime(.35, ctx.audio().audio.currentTime, .08);
      scheduleNote();
      timer = setInterval(scheduleNote, tracks[track].tempo);
    } else if (bus) {
      bus.gain.setTargetAtTime(0, ctx.audio().audio.currentTime, .08);
    }
  }

  return {
    get playing() { return playing; },
    get trackName() { return tracks[track].name; },
    toggle() { playing = !playing; syncTimer(); return playing; },
    nextTrack() { track = (track + 1) % tracks.length; step = 0; playing = true; syncTimer(); return tracks[track].name; },
    mute(value) { muted = value; syncTimer(); },
    pause(value) { paused = value; syncTimer(); },
    dispose() { playing = false; if (timer) clearInterval(timer); timer = null; if (bus) bus.disconnect(); bus = null; },
  };
}

function buildVehicle(scene, bodyColor, x, z, dir) {
  const car = group(scene, x, 0, z);
  car.rotation.y = dir > 0 ? 0 : Math.PI;
  const paint = mat(bodyColor, { roughness: .35, metalness: .55 });
  const cabin = mat(0x1f2430, { roughness: .22, metalness: .45 });
  const wheel = mat(0x181a1f, { roughness: .85 });
  const head = glow(0xfff1c9, 1.8);
  const tail = glow(0xf33c34, 1.4);
  box(car, paint, 0, .44, 0, 1.72, .48, 3.85);
  box(car, cabin, 0, .86, -.12, 1.46, .42, 2.05);
  for (const wx of [-.84, .84]) for (const wz of [-1.18, 1.18]) tube(car, wheel, wx, .22, wz, .22, .18);
  for (const lx of [-.6, .6]) {
    box(car, head, lx, .46, 1.94, .28, .12, .05);
    box(car, tail, lx, .48, -1.94, .32, .11, .05);
  }
  return { mesh: car, x, z, dir, speed: 0, maxSpeed: 6.5 };
}

function buildInteriorBlock(scene, { x0, x1, z0, z1, doorZ0, doorZ1, floorMat, wallMat, trimMat, glassMat }) {
  const cx = (x0 + x1) / 2, cz = (z0 + z1) / 2, w = x1 - x0, d = z1 - z0;
  const streetX = x0 < 0 ? x1 : x0;
  const backX = x0 < 0 ? x0 : x1;
  box(scene, floorMat, cx, .02, cz, w, .15, d);
  box(scene, wallMat, cx, 3.44, cz, w, .20, d);
  box(scene, wallMat, backX, 1.71, cz, .18, 3.4, d);
  for (const z of [z0, z1]) box(scene, wallMat, cx, 1.71, z, w, 3.4, .20);
  // Front facade with doorway gap
  const seg1 = doorZ0 - z0, seg2 = z1 - doorZ1;
  if (seg1 > .1) {
    const zMid = z0 + seg1 / 2;
    box(scene, trimMat, streetX, .44, zMid, .18, .86, seg1);
    box(scene, glassMat, streetX, 1.78, zMid, .06, 1.78, seg1);
  }
  if (seg2 > .1) {
    const zMid = doorZ1 + seg2 / 2;
    box(scene, trimMat, streetX, .44, zMid, .18, .86, seg2);
    box(scene, glassMat, streetX, 1.78, zMid, .06, 1.78, seg2);
  }
  box(scene, trimMat, streetX, 2.79, cz, .22, .52, d + .1);
}

/**
 * Expands Cidade da Madrugada with navigable avenue, traffic, record shop,
 * art gallery, metro station plaza, rooftop lookout, and zone-reactive audio.
 */
export function midnight(ctx) {
  const scene = ctx.scene, random = rng(7591);
  atmosphere(ctx, 0x29263e, 0x37343d, 0xadb1cc, { fog: .028, fill: 1.25, intensity: 1.45 });

  const asphalt = surfaceMaterial(0x555866, 'asphalt', 18, { roughness: .32, metalness: .27 });
  const pavement = surfaceMaterial(0x98918f, 'stone', 13);
  const white = mat(0xddd5bd), dark = mat(0x3b3f47, { metalness: .43 });
  const brick = surfaceMaterial(0xb59585, 'brick', 4);
  const trim = wood(0x7a4b39);
  const tile = surfaceMaterial(0xa9876b, 'stone', 4);
  const windows = glow(0xffbb75, .47);
  const cyanNeon = glow(0x38bdf8, 1.35);
  const magentaNeon = glow(0xd946ef, 1.25);
  const glass = mat(0xa8c8cf, { transparent: true, opacity: .22, depthWrite: false });

  // Main avenue, sidewalks, center line, crosswalk & puddles
  box(scene, asphalt, 0, -.15, 0, 19, .25, 96);
  for (const x of [-8.9, 8.9]) box(scene, pavement, x, -.02, 0, 3.25, .27, 96);
  for (let z = -43; z < 45; z += 4) box(scene, white, 0, -.016, z, .112, .017, 1.75);
  for (let x = -7; x <= 7; x += 1.4) box(scene, white, x, -.013, 2, .66, .02, 2.95);
  for (let i = 0; i < 24; i++) {
    const x = (random() - .5) * 15, z = (random() - .5) * 76;
    orb(scene, mat(i % 3 === 0 ? 0x857287 : 0x5f687b, { roughness: .16, metalness: .42 }), x, -.012, z, .4 + random(), .008, .27 + random() * .69);
  }

  // City blocks (skipping Café, Loja de Discos, Galeria, and Metrô plaza)
  const mass = [], panes = [], sills = [], ledges = [];
  for (const side of [-1, 1]) for (let j = 0; j < 12; j++) {
    const z = j * 7 - 40;
    if (side === 1 && z > -7 && z < 9) continue; // Café da Esquina
    if (side === -1 && ((z > -16 && z < -2) || (z > 2 && z < 16) || (z > -32 && z < -20))) continue; // Vinyl, Gallery, Metro
    const x = side * (13.4 + random()), h = 5 + random() * 8;
    mass.push([x, h / 2, z, 5.8, h, 6.8, 0, [0xa78579, 0x7d747b, 0x938394][j % 3]]);
    for (const y of [.23, 1.1, h - .41]) ledges.push([side * (Math.abs(x) - 2.91), y, z, .29, .14, 6.89]);
    for (let row = 0; row < Math.floor(h / 2.25); row++) for (let col = 0; col < 4; col++) {
      const px = side * (Math.abs(x) - 2.94), py = 1.8 + row * 2.3, pz = z + (col - 1.5) * 1.43;
      panes.push([px, py, pz, .10, .94, .76, 0, random() > .6 ? 0xece0bf : 0x413e3b]);
      sills.push([px, py - .52, pz, .25, .09, .94]);
    }
  }
  boxes(scene, brick, mass); boxes(scene, windows, panes); boxes(scene, pavement, sills); boxes(scene, pavement, ledges);

  // Streetlamps
  for (const side of [-1, 1]) for (let i = 0; i < 6; i++) {
    const z = -36 + i * 14, x = side * 7.75;
    tube(scene, dark, x, 1.94, z, .061, 3.85);
    beam(scene, dark, [x, 3.82, z], [x - side * .82, 3.82, z], .041);
    box(scene, windows, x - side * .81, 3.76, z, .32, .10, .25);
    if (i > 0 && i < 5) lamp(scene, i % 2 === 0 ? 0xffc593 : 0x9ad8f5, 25, x - side * .76, 3.55, z, 11);
  }

  // --- Sector: Café da Esquina (East: x in [8.65, 15.3], z in [-5, 5]) ---
  box(scene, tile, 12, .02, 0, 6.6, .15, 10);
  box(scene, brick, 12, 3.44, 0, 6.6, .20, 10);
  box(scene, brick, 15.27, 1.71, 0, .18, 3.4, 10);
  for (const z of [-5, 5]) box(scene, brick, 12, 1.71, z, 6.58, 3.4, .20);
  const door = group(scene, 8.65, .14, 1.05);
  box(door, glass, 0, 1.19, .65, .07, 2.36, 1.30);
  for (const z of [0, 1.30]) box(door, trim, 0, 1.19, z, .10, 2.39, .09);
  box(door, trim, 0, .105, .65, .10, .14, 1.30);
  orb(door, mat(0xba9862, { metalness: .58 }), -.072, 1.06, 1.16, .053);
  for (const [z, w] of [[-1.98, 6.04], [3.68, 2.62]]) {
    box(scene, trim, 8.66, .44, z, .18, .86, w);
    box(scene, glass, 8.65, 1.78, z, .058, 1.78, w);
    for (let zz = z - w / 2; zz <= z + w / 2 + .02; zz += w / 4) box(scene, trim, 8.62, 1.76, zz, .12, 1.83, .08);
  }
  box(scene, trim, 8.61, 2.79, 0, .22, .52, 10.1);
  const marquee = sign(scene, 'CAFÉ DA ESQUINA', 8.46, 2.85, 0, 3.1, .47, { background: '#523122' });
  marquee.rotation.y = -Math.PI / 2;
  lamp(scene, 0xffbf71, 39, 11.7, 2.85, .01, 11);
  lamp(scene, 0xffb370, 18, 9.35, 2.72, 1.7, 5);
  for (const z of [-3.2, -.32, 3.35]) {
    table(scene, trim, 10.38, z, 1, .68);
    seat(scene, mat(0x935349), trim, 11.18, z, -Math.PI / 2);
    teaSet(scene, 10.40, .79, z, 0xcdac87);
  }
  box(scene, trim, 14.55, .56, -1.9, 1.20, 1.1, 4.9);
  box(scene, dark, 14.3, 1.32, -3.5, .45, .28, .28); // Café radio

  // --- Sector: Loja de Discos (West: x in [-15.3, -8.65], z in [-14, -4]) ---
  buildInteriorBlock(scene, {
    x0: -15.3, x1: -8.65, z0: -14, z1: -4, doorZ0: -9.9, doorZ1: -8.1,
    floorMat: tile, wallMat: brick, trimMat: dark, glassMat: glass,
  });
  const vinylSign = sign(scene, 'VINIL NOTURNO', -8.46, 2.85, -9, 3.1, .47, { background: '#3c1642' });
  vinylSign.rotation.y = Math.PI / 2;
  box(scene, magentaNeon, -8.52, 2.48, -9, .05, .05, 3.2);
  lamp(scene, 0xe879f9, 26, -11.8, 2.8, -9, 10);
  // Record bins & turntable counter
  for (const z of [-12.2, -6.0]) {
    box(scene, trim, -11.5, .55, z, 1.6, 1.0, .7);
    box(scene, magentaNeon, -11.5, 1.12, z, 1.3, .16, .08);
  }
  box(scene, dark, -14.1, .56, -9, 1.0, 1.1, 3.4);
  const platter = tube(scene, cyanNeon, -14.0, 1.16, -9, .24, .04);

  // --- Sector: Galeria Madrugada (West: x in [-15.3, -8.65], z in [4, 14]) ---
  buildInteriorBlock(scene, {
    x0: -15.3, x1: -8.65, z0: 4, z1: 14, doorZ0: 8.1, doorZ1: 9.9,
    floorMat: pavement, wallMat: mat(0x2c303b), trimMat: dark, glassMat: glass,
  });
  const gallerySign = sign(scene, 'GALERIA', -8.46, 2.85, 9, 2.5, .45, { background: '#163240' });
  gallerySign.rotation.y = Math.PI / 2;
  box(scene, cyanNeon, -8.52, 2.48, 9, .05, .05, 2.6);
  lamp(scene, 0xdbeafe, 28, -11.8, 2.85, 9, 10);
  const artworks = [
    { title: 'Chuva sobre o Asfalto', desc: 'Estudo em azul-chumbo e reflexos de sódio.', z: 6.4, palette: ['#1b2336', '#2e3854', '#f59e0b', '#38bdf8'] },
    { title: 'Luzes da Madrugada', desc: 'Fachadas úmidas e vitrines âmbar após a meia-noite.', z: 9.0, palette: ['#251736', '#3b1d4a', '#d946ef', '#fbbf24'] },
    { title: 'Plataforma Vazia', desc: 'Último metrô deixando rastro ciano no túnel.', z: 11.6, palette: ['#122630', '#1e3a4c', '#38bdf8', '#f43f5e'] },
  ];
  artworks.forEach((art, idx) => {
    const tex = artworkTexture(910 + idx * 37, art.title, art.palette);
    const frame = mesh(scene, new THREE.PlaneGeometry(1.85, 1.35), mat(0xffffff, { map: tex, roughness: .4 }), [-15.14, 1.75, art.z]);
    frame.rotation.y = Math.PI / 2;
    box(scene, dark, -15.17, 1.75, art.z, .04, 1.46, 1.96);
  });

  // --- Sector: Praça & Estação de Metrô (West North: x in [-14, -8], z in [-30, -22]) ---
  box(scene, pavement, -11.2, -.02, -26, 6.8, .27, 10);
  box(scene, dark, -11.2, 2.6, -26, 5.2, .16, 4.4);
  for (const x of [-13.4, -9.0]) for (const z of [-28, -24]) tube(scene, dark, x, 1.3, z, .08, 2.6);
  const metroSign = sign(scene, 'METRÔ', -8.7, 2.95, -26, 2.2, .45, { background: '#0e3347' });
  metroSign.rotation.y = Math.PI / 2;
  box(scene, cyanNeon, -8.85, 2.58, -26, .06, .06, 2.3);
  lamp(scene, 0x38bdf8, 24, -10.5, 2.3, -26, 10);
  // Subway steps & bench
  for (let s = 0; s < 5; s++) box(scene, pavement, -11.6 - s * .45, .06 - s * .14, -26, .46, .14, 2.8);
  box(scene, trim, -9.5, .42, -22.8, .55, .12, 1.9);

  // --- Sector: Mirante no Terraço (East Rooftop: x in [9.2, 15.0], z in [-15, -6], y = 8.4) ---
  box(scene, dark, 12.1, 8.28, -10.5, 6.2, .24, 9.4);
  for (const z of [-15.1, -5.9]) box(scene, glass, 12.1, 8.95, z, 6.1, 1.1, .06);
  box(scene, glass, 9.05, 8.95, -10.5, .06, 1.1, 9.3);
  box(scene, glass, 15.15, 8.95, -10.5, .06, 1.1, 9.3);
  box(scene, trim, 10.6, 8.85, -10.5, .6, .12, 2.0);
  lamp(scene, 0xffc69b, 16, 12.1, 10.2, -10.5, 9);
  // Street-level elevator/stair kiosk at x = 9.5, z = -9.5
  box(scene, dark, 10.2, 1.5, -9.5, 1.8, 3.0, 2.2);
  const roofSign = sign(scene, 'TERRAÇO', 9.25, 2.55, -9.5, 1.8, .38, { background: '#2e2438' });
  roofSign.rotation.y = -Math.PI / 2;

  // Traffic lights at crosswalk
  const red = glow(0xf33c34, 2), green = glow(0x4fb881, .1);
  for (const x of [-7.1, 7.1]) {
    tube(scene, dark, x, 1.47, 3.53, .069, 2.95);
    box(scene, dark, x, 2.81, 3.48, .33, .59, .27);
    orb(scene, red, x, 2.96, 3.30, .094);
    orb(scene, green, x, 2.70, 3.30, .094);
  }

  // Vehicles (light traffic respecting the crosswalk signal)
  const vehicles = [
    buildVehicle(scene, 0x3b4d63, 3.2, 22, -1),
    buildVehicle(scene, 0x5c374c, 3.2, 40, -1),
    buildVehicle(scene, 0x2f3e46, -3.2, -18, 1),
    buildVehicle(scene, 0x4a4056, -3.2, -38, 1),
  ];

  // Low-poly sidewalk pedestrians
  const walkers = [
    { x: -8.3, z: -18, dir: 1, min: -30, max: 18 },
    { x: 8.1, z: 14, dir: -1, min: -16, max: 24 },
  ].map((w, idx) => {
    const person = group(scene, w.x, .12, w.z);
    box(person, mat(idx ? 0x4b5563 : 0x6b4c5b), 0, .95, 0, .36, .75, .24);
    orb(person, mat(0xd6b49e), 0, 1.48, 0, .14);
    return { ...w, mesh: person };
  });

  const rain = precip(ctx, {
    size: 68, count: 1120,
    omit: (x, z) => (x > 8.5 && x < 15.4 && Math.abs(z) < 5.1) || (x < -8.5 && x > -15.4 && ((z > -14.2 && z < -3.8) || (z > 3.8 && z < 14.2))),
  });
  const audio = atmosphereAudio(ctx);
  const music = createMusicSynth(ctx);

  let open = false, rainLevel = .78, umbrellaOut = false, onTerrace = false, artIndex = 0, trainPulse = 0;
  const umbrella = group(scene);
  mesh(umbrella, new THREE.ConeGeometry(.49, .17, 12), mat(0x564a67, { side: THREE.DoubleSide }), [0, .49, -.44]);
  tube(umbrella, trim, 0, .13, -.44, .012, .65);
  umbrella.visible = false;

  const nav = navigator(ctx, {
    start: [-7.52, 1.61, 2.96], yaw: 1.63, bounds: [-14.7, 14.88, -32, 26], speed: 3.7,
    ground: (x, z) => {
      if (onTerrace) return 8.4;
      if (x > 8.7 && Math.abs(z) < 5) return .1;
      if (x < -8.7 && ((z > -14 && z < -4) || (z > 4 && z < 14))) return .1;
      return Math.abs(x) > 7.55 ? .11 : 0;
    },
    canWalk: (x, z) => {
      if (onTerrace) return x > 9.4 && x < 14.8 && z > -14.7 && z < -6.3;
      // Café walls & door
      if (x > 8.45 && x < 8.95 && Math.abs(z) < 5.15) return open && z > 1.16 && z < 2.25;
      if (x > 8.65 && Math.abs(Math.abs(z) - 5) < .28) return false;
      if (x > 9.87 && x < 10.88 && [-3.2, -.32, 3.35].some(y => Math.abs(z - y) < .5)) return false;
      // Record shop walls & open doorway
      if (x < -8.45 && x > -8.95 && z > -14.15 && z < -3.85) return z > -9.9 && z < -8.1;
      if (x < -8.65 && (Math.abs(z + 14) < .28 || Math.abs(z + 4) < .28)) return false;
      // Gallery walls & open doorway
      if (x < -8.45 && x > -8.95 && z > 3.85 && z < 14.15) return z > 8.1 && z < 9.9;
      if (x < -8.65 && (Math.abs(z - 4) < .28 || Math.abs(z - 14) < .28)) return false;
      // Solid west blocks outside interiors & plaza
      if (x < -8.95 && !((z > -14 && z < -4) || (z > 4 && z < 14) || (z > -30 && z < -22))) return false;
      // Solid east blocks outside café
      if (x > 8.95 && Math.abs(z) >= 5) return false;
      return true;
    },
  });

  const panel = ctx.group();
  const streetGuide = ctx.sceneGuide();
  function toggleDoor() {
    if (open && Math.abs(nav.pos.x - 8.65) < .43 && Math.abs(nav.pos.z - 1.7) < 1.2) {
      ctx.say('Afaste-se da passagem para fechar a porta.');
      return;
    }
    open = !open;
    door.rotation.y = open ? -1.47 : 0;
    doorButton.textContent = open ? 'Fechar porta' : 'Abrir porta';
    ctx.say(open ? 'Porta aberta. A entrada fica junto à faixa.' : 'Porta fechada.');
  }

  const doorButton = ctx.button('Abrir porta', toggleDoor, panel);
  ctx.button('Guarda-chuva', () => {
    umbrellaOut = !umbrellaOut;
    ctx.say(umbrellaOut ? 'Guarda-chuva aberto.' : 'Guarda-chuva fechado.');
  }, panel);
  ctx.button('Voltar à travessia', () => {
    onTerrace = false;
    nav.reset();
    sectorSelect.value = '0';
    ctx.say('Faixa principal.');
  }, panel);

  const direction = new THREE.Vector3();
  ctx.button('Atravessar na faixa', () => {
    onTerrace = false;
    if (nav.pos.x > 7.3 && Math.abs(nav.pos.z - 2) < 4) { ctx.say('Você já está do lado do café.'); return; }
    if (ctx.timers.time % 12 <= 6.5) { ctx.say('Aguarde a luz verde para atravessar pela faixa.'); return; }
    nav.place(7.78, 1.72, 1.73, Math.PI / 2);
    ctx.say('Travessia concluída. A entrada está à frente.');
  }, panel);

  const musicButton = ctx.button('Ouvir música', () => {
    const active = music.toggle();
    musicButton.textContent = active ? 'Pausar música' : 'Ouvir música';
    ctx.say(active ? `Tocando: ${music.trackName}.` : 'Música pausada.');
  }, panel);

  ctx.button('Trocar disco', () => {
    const name = music.nextTrack();
    musicButton.textContent = 'Pausar música';
    ctx.say(`Disco selecionado: ${name}.`);
  }, panel);

  const sectors = [
    ['Faixa principal', () => { onTerrace = false; nav.place(-7.52, 1.72, 2.96, 1.63); ctx.say('Faixa principal.'); }],
    ['Café da Esquina', () => { onTerrace = false; if (!open) toggleDoor(); nav.place(10.1, 1.71, 1.7, Math.PI / 2); ctx.say('Café da Esquina.'); }],
    ['Loja de Discos', () => { onTerrace = false; nav.place(-10.8, 1.71, -9, -Math.PI / 2); ctx.say('Loja de Discos Vinil Noturno.'); }],
    ['Galeria', () => { onTerrace = false; nav.place(-10.8, 1.71, 9, -Math.PI / 2); ctx.say('Galeria Madrugada.'); }],
    ['Estação de Metrô', () => { onTerrace = false; nav.place(-9.2, 1.72, -25.5, -Math.PI / 2); ctx.say('Praça da Estação de Metrô.'); }],
    ['Mirante do Terraço', () => { onTerrace = true; nav.place(10.6, 10.01, -10.5, -Math.PI / 2); ctx.say('Mirante do Terraço.'); }],
  ];
  const sectorSelect = ctx.select('Setor', sectors.map(s => s[0]), index => {
    sectors[index][1]();
  });

  ctx.range('Intensidade da chuva', 0, 1, .05, rainLevel, value => { rainLevel = value; });

  const cafeSeat = () => { nav.seat(11.09, 1.14, 3.32, -1.57); ctx.say('Mesa do café. Use Levantar para sair.'); };
  const inspectArt = () => {
    const art = artworks[artIndex % artworks.length];
    artIndex++;
    ctx.say(`${art.title} — ${art.desc}`);
  };
  const toggleTerrace = () => {
    if (onTerrace) {
      onTerrace = false;
      nav.place(8.4, 1.72, -9.5, -Math.PI / 2);
      sectorSelect.value = '0';
      ctx.say('De volta ao nível da rua.');
    } else {
      onTerrace = true;
      nav.place(10.6, 10.01, -10.5, -Math.PI / 2);
      sectorSelect.value = '5';
      ctx.say('Mirante do Terraço. Observe a avenida sob chuva.');
    }
  };

  nav.add(
    { x: 8.47, z: 1.77, range: 2, label: 'Abrir ou fechar a porta', action: toggleDoor },
    { x: 10.72, z: 3.9, range: 1.8, label: 'Escolher mesa', action: cafeSeat },
    { x: -12.6, z: -9, range: 2.6, label: 'Ouvir toca-discos', action: () => { const n = music.nextTrack(); musicButton.textContent = 'Pausar música'; ctx.say(`Disco selecionado: ${n}.`); } },
    { x: -13.2, z: 9, range: 2.8, label: 'Observar obra', action: inspectArt },
    { x: -10.2, z: -26, range: 2.5, label: 'Ouvir metrô', action: () => { trainPulse = 3.2; ctx.say('Trem passando sob a estação.'); } },
    { x: 8.8, z: -9.5, range: 2.2, label: 'Subir ao terraço', action: toggleTerrace, available: () => !onTerrace },
    { x: 10.6, y: 10.01, z: -10.5, range: 2.4, label: 'Descer à rua', action: toggleTerrace, available: () => onTerrace },
  );

  return withNavigation(nav, {
    mute(v) { audio.mute(v); music.mute(v); },
    pause(v) { music.pause(v); },
    dispose() { audio.dispose(); music.dispose(); },
    reset() {
      open = false; door.rotation.y = 0; doorButton.textContent = 'Abrir porta';
      umbrellaOut = false; onTerrace = false; trainPulse = 0;
      sectorSelect.value = '0';
      ctx.say('De volta à travessia.');
    },
    update(dt, time) {
      rain(ctx.reduced ? 0 : time, rainLevel);
      const greenLight = time % 12 > 6.5;
      red.emissiveIntensity = greenLight ? .12 : 2.1;
      green.emissiveIntensity = greenLight ? 2.2 : .09;

      // Traffic simulation (cars stop before crosswalk when pedestrians have green light)
      const stepDt = ctx.reduced ? dt * .25 : dt;
      for (let i = 0; i < vehicles.length; i++) {
        const car = vehicles[i];
        const stopLine = car.dir < 0 ? 5.6 : -1.6;
        const approachingCrosswalk = car.dir < 0 ? (car.z > stopLine && car.z < stopLine + 9) : (car.z < stopLine && car.z > stopLine - 9);
        const leadCar = vehicles.find((other, j) => j !== i && other.dir === car.dir && (car.dir < 0 ? other.z < car.z && car.z - other.z < 9 : other.z > car.z && other.z - car.z < 9));
        const shouldBrake = (greenLight && approachingCrosswalk) || Boolean(leadCar);
        car.speed = clamp(car.speed + (shouldBrake ? -8.5 : 4.2) * stepDt, 0, car.maxSpeed);
        car.z += car.dir * car.speed * stepDt;
        if (car.dir < 0 && car.z < -46) car.z = 46;
        if (car.dir > 0 && car.z > 46) car.z = -46;
        car.mesh.position.z = car.z;
      }

      // Sidewalk pedestrians
      if (!ctx.low) {
        for (const w of walkers) {
          w.mesh.visible = true;
          w.z += w.dir * 1.15 * stepDt;
          if (w.z > w.max) w.dir = -1;
          if (w.z < w.min) w.dir = 1;
          w.mesh.position.z = w.z;
        }
      } else {
        walkers.forEach(w => { w.mesh.visible = false; });
      }

      if (music.playing && !ctx.reduced) platter.rotation.y += dt * 1.8;
      if (trainPulse > 0) trainPulse = Math.max(0, trainPulse - dt);

      const inCafe = !onTerrace && nav.pos.x > 8.95 && Math.abs(nav.pos.z) < 5;
      const inVinyl = !onTerrace && nav.pos.x < -8.95 && nav.pos.z > -14 && nav.pos.z < -4;
      const inGallery = !onTerrace && nav.pos.x < -8.95 && nav.pos.z > 4 && nav.pos.z < 14;
      const inMetro = !onTerrace && nav.pos.z < -20;

      ctx.camera.getWorldDirection(direction);
      umbrella.position.copy(nav.pos).addScaledVector(direction, .5);
      umbrella.rotation.y = Math.atan2(-direction.x, -direction.z);
      umbrella.visible = umbrellaOut && !inCafe && !inVinyl && !inGallery;

      if (onTerrace) nav.position.textContent = 'Mirante · terraço';
      else if (inCafe) nav.position.textContent = 'Café · interior';
      else if (inVinyl) nav.position.textContent = 'Loja de Discos · interior';
      else if (inGallery) nav.position.textContent = 'Galeria · interior';
      else if (inMetro) nav.position.textContent = 'Estação de Metrô';
      else nav.position.textContent = 'Rua · pedestres ' + (greenLight ? 'podem atravessar' : 'aguardam o sinal');

      const inside = inCafe || inVinyl || inGallery;
      const nearCrosswalk = !inside && !onTerrace && Math.abs(nav.pos.z - 1.7) < 4.4;
      const instruction = !nav.interact.disabled ? nav.interact.textContent + ' · E ou Controles'
        : nearCrosswalk && nav.pos.x < 7.5 ? (greenLight ? 'Sinal aberto · atravesse pela faixa rumo ao café' : 'Faixa para o café · aguarde o sinal de pedestres')
        : nearCrosswalk ? 'Entrada do café ao lado da faixa'
        : nav.position.textContent;
      if (streetGuide.textContent !== instruction) streetGuide.textContent = instruction;
      const zoneGain = inside ? .13 : inMetro && trainPulse > 0 ? Math.max(rainLevel * .72, .55) : rainLevel * .72;
      const zoneCutoff = inside ? 340 : inMetro && trainPulse > 0 ? 520 : 1620;
      nav.zone(`${inside}-${inMetro && trainPulse > 0}-${rainLevel}`, () => audio.set(zoneGain, zoneCutoff));
    },
  });
}
