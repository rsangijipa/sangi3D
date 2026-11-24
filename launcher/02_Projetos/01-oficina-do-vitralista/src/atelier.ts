import * as T from 'three';
import { boxUV, canvasTexture, cylinderBetween, lathe, mergeStatic, mesh, rbox } from './core/model';
import { bronzeSampler, hammeredSampler, makeTexSet, pbrMaterial, plasterSampler, woodSampler } from './core/pbr';
import { rng } from './core/noise';

export const tableY = 0.91;
export const tableWidth = 3.48;
export const tableDepth = 1.98;
export const tableZ = 0.14;

function gardenTexture() {
  return canvasTexture(768, 640, ctx => {
    const random = rng(34);
    const sky = ctx.createLinearGradient(0, 0, 0, 640);
    sky.addColorStop(0, '#bfcfcc');
    sky.addColorStop(0.58, '#e3dfbc');
    sky.addColorStop(1, '#706a46');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, 768, 640);
    ctx.filter = 'blur(2px)';
    const trees = [[35, 330, 175], [232, 492, 189], [680, 275, 212], [485, 545, 125]];
    const leaves = ['#747854', '#52604a', '#8c8959', '#a4a56a', '#5d704d', '#767a5e', '#aead78'];
    for (const [rootX, crownY, crown] of trees) {
      ctx.strokeStyle = '#635746';
      ctx.lineCap = 'round';
      for (let branch = 0; branch < 18; branch++) {
        ctx.lineWidth = 2 + random() * 9;
        ctx.beginPath();
        ctx.moveTo(rootX, 680);
        ctx.quadraticCurveTo(rootX + (random() - 0.5) * 50, crownY + 60, rootX + (random() - 0.5) * crown * 1.65, crownY + (random() - 0.5) * crown);
        ctx.stroke();
      }
      for (let i = 0; i < 1190; i++) {
        const theta = random() * Math.PI * 2;
        const distance = Math.sqrt(random());
        ctx.fillStyle = leaves[Math.floor(random() * leaves.length)];
        ctx.globalAlpha = 0.25 + random() * 0.6;
        ctx.beginPath();
        ctx.ellipse(rootX + Math.cos(theta) * distance * crown, crownY + Math.sin(theta) * distance * crown * 0.79, 2 + random() * 13, 1 + random() * 8, theta, 0, 7);
        ctx.fill();
      }
    }
    ctx.globalAlpha = 1;
  });
}

function sunPatch() {
  return canvasTexture(128, 128, ctx => {
    ctx.filter = 'blur(8px)';
    ctx.fillStyle = '#fff0cb9c';
    ctx.fillRect(15, 14, 97, 101);
    ctx.clearRect(60, 14, 7, 101);
  });
}

export function buildAtelier(scene: T.Scene) {
  const grain = makeTexSet({ size: 512, aniso: 4, sample: woodSampler({ light: '#aa7b51', dark: '#674a35', seed: 9, planks: 0, weathered: 0.46 }) });
  const shelfGrain = makeTexSet({ size: 256, aniso: 4, sample: woodSampler({ light: '#745137', dark: '#3a2b1d', seed: 18, weathered: 0.58 }) });
  const plaster = makeTexSet({ size: 256, aniso: 2, sample: plasterSampler('#756b56', 17, 0.8) });
  const brassSet = makeTexSet({ size: 256, aniso: 2, sample: bronzeSampler(17) });
  const leadSet = makeTexSet({ size: 128, aniso: 2, sample: hammeredSampler('#75706a', 32) });
  const oak = pbrMaterial(grain, { roughness: 0.79 }, 0.46);
  const darkWood = pbrMaterial(shelfGrain, { roughness: 0.8 }, 0.53);
  const wall = pbrMaterial(plaster, {}, 0.5);
  const brass = pbrMaterial(brassSet, { metalness: 0.82, roughness: 0.63 }, 0.25);
  const lead = pbrMaterial(leadSet, { metalness: 0.64, roughness: 0.73 }, 0.28);
  const steel = new T.MeshStandardMaterial({ color: '#929191', metalness: 0.94, roughness: 0.29 });
  const ceramic = new T.MeshPhysicalMaterial({ color: '#c8bc9f', roughness: 0.31, clearcoat: 0.27 });
  const rubber = new T.MeshStandardMaterial({ color: '#261915', roughness: 0.83 });
  const mahogany = new T.MeshPhysicalMaterial({ color: '#6c3b2a', roughness: 0.55, clearcoat: 0.19 });
  const addBox = (parent: T.Object3D, w: number, h: number, d: number, material: T.Material, x: number, y: number, z: number, bevel = 0.012) => {
    const object = mesh(rbox(w, h, d, bevel), material, x, y, z);
    parent.add(object);
    return object;
  };
  const round = (parent: T.Object3D, profile: [number, number][], material: T.Material, x: number, y: number, z: number) => {
    const object = mesh(lathe(profile, 36), material, x, y, z);
    parent.add(object);
    return object;
  };

  const worktop = new T.Group();
  scene.add(worktop);
  addBox(worktop, tableWidth, 0.09, tableDepth, oak, 0, tableY - 0.048, tableZ, 0.018);
  // Tábuas inteiriças, com variação de tom entre elas.
  const tones = ['#f8dfc4', '#d7b88f', '#f2d9bd', '#f7dfc0', '#dfc2a6', '#f1e0cb'];
  for (const [index, tone] of tones.entries()) {
    const board = oak.clone();
    board.color.set(tone);
    const depth = tableDepth / tones.length;
    const surface = mesh(new T.PlaneGeometry(tableWidth - 0.026, depth - 0.0021), board,
      0, tableY + 0.0005, tableZ - tableDepth / 2 + (index + 0.5) * depth);
    surface.rotation.x = -Math.PI / 2;
    surface.castShadow = false;
    worktop.add(surface);
  }
  addBox(worktop, tableWidth - 0.14, 0.14, 0.07, darkWood, 0, tableY - 0.15, 1.058);
  for (const x of [-1.57, 1.57]) addBox(worktop, 0.14, 0.86, 0.14, darkWood, x, 0.421, 0.94);
  const tabletopMarks = canvasTexture(768, 416, ctx => {
    const random = rng(38);
    for (let i = 0; i < 340; i++) {
      const x = random() * 768;
      const y = random() * 416;
      ctx.strokeStyle = i % 3 ? '#4d301226' : '#ffe0a324';
      ctx.lineWidth = random() * 0.68 + 0.24;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + 4 + random() * 90, y + (random() - 0.5) * 3);
      ctx.stroke();
    }
    for (const [x, y] of [[99, 89], [645, 249], [580, 208], [397, 330]]) {
      ctx.strokeStyle = '#48311936';
      ctx.beginPath();
      ctx.ellipse(x, y, 18, 11, 0.12, 0.2, 5.8);
      ctx.stroke();
    }
  });
  const wear = new T.Mesh(new T.PlaneGeometry(tableWidth - 0.026, tableDepth - 0.026), new T.MeshBasicMaterial({ map: tabletopMarks, transparent: true, depthWrite: false }));
  wear.rotation.x = -Math.PI / 2;
  wear.position.set(0, tableY + 0.001, tableZ);
  scene.add(wear);

  const facade = new T.Group();
  scene.add(facade);
  const windowWidth = 3.36;
  const windowBottom = 1.09;
  const windowTop = 2.98;
  addBox(facade, 9, 1.08, 0.14, wall, 0, 0.55, -1.33);
  addBox(facade, 9, 2, 0.14, wall, 0, 3.99, -1.33);
  for (const side of [-1, 1]) {
    addBox(facade, 2.8, 1.94, 0.14, wall, side * 3.08, 2.04, -1.33);
    addBox(facade, 0.07, 1.95, 0.19, darkWood, side * windowWidth / 2, 2.04, -1.30);
    addBox(facade, 0.04, 1.92, 0.11, oak, side * 0.56, 2.04, -1.29, 0.006);
  }
  addBox(facade, 3.52, 0.066, 0.36, oak, 0, windowBottom, -1.27);
  addBox(facade, 3.48, 0.068, 0.13, darkWood, 0, windowTop, -1.29);
  addBox(facade, 3.34, 0.048, 0.1, darkWood, 0, 2.30, -1.32, 0.005);
  const outdoors = new T.Mesh(new T.PlaneGeometry(7.8, 4.8), new T.MeshBasicMaterial({ map: gardenTexture(), toneMapped: false }));
  outdoors.position.set(0.1, 2.33, -2.9);
  scene.add(outdoors);
  const floor = mesh(boxUV(14, 0.12, 12), darkWood, 0, -0.07, 1);
  floor.castShadow = false;
  scene.add(floor);

  const windowGlow = new T.Mesh(new T.PlaneGeometry(2.52, 1.53), new T.MeshBasicMaterial({
    map: sunPatch(), transparent: true, depthWrite: false, blending: T.AdditiveBlending, opacity: 0.24, color: '#ffc996',
  }));
  windowGlow.rotation.x = -Math.PI / 2;
  windowGlow.rotation.z = -0.15;
  windowGlow.position.set(0.53, tableY + 0.0015, 0.38);
  windowGlow.renderOrder = 1;
  scene.add(windowGlow);

  const stand = new T.Group();
  stand.position.set(-0.31, tableY, -0.31);
  scene.add(stand);
  for (const side of [-1, 1]) {
    addBox(stand, 0.071, 0.046, 0.42, darkWood, side * 0.32, 0.030, -0.04);
    const leg = addBox(stand, 0.056, 0.49, 0.066, darkWood, side * 0.32, 0.25, -0.17);
    leg.rotation.x = 0.32;
    const stop = addBox(stand, 0.096, 0.085, 0.13, oak, side * 0.32, 0.102, 0.045);
    stop.rotation.x = -0.2;
    const screw = mesh(new T.SphereGeometry(0.013, 10, 8), brass, side * 0.32, 0.13, 0.111);
    screw.scale.z = 0.3;
    stand.add(screw);
  }
  addBox(stand, 0.82, 0.049, 0.105, darkWood, 0, 0.105, 0.035);

  const tray = new T.Group();
  tray.position.set(-1.10, tableY + 0.013, 0.36);
  tray.rotation.y = 0.16;
  scene.add(tray);
  addBox(tray, 0.74, 0.043, 0.44, darkWood, 0, 0, 0);
  for (const z of [-0.21, 0.21]) addBox(tray, 0.75, 0.062, 0.023, oak, 0, 0.032, z, 0.008);
  for (const x of [-0.368, 0.368]) addBox(tray, 0.025, 0.063, 0.43, oak, x, 0.032, 0, 0.007);
  for (const x of [-0.224, -0.075, 0.075, 0.224]) addBox(tray, 0.014, 0.036, 0.405, darkWood, x, 0.036, 0, 0.004);

  const station = new T.Group();
  station.position.set(1.04, tableY, 0.26);
  station.rotation.y = -0.39;
  scene.add(station);
  addBox(station, 0.39, 0.036, 0.23, ceramic, 0, 0.023, 0, 0.015);
  for (const x of [-0.105, 0.1]) addBox(station, 0.028, 0.034, 0.151, lead, x, 0.053, 0.0);
  const coil = mesh(new T.TorusGeometry(0.055, 0.008, 7, 24), steel, 0.12, 0.091, -0.01);
  coil.scale.set(0.85, 0.65, 1);
  coil.rotation.y = Math.PI / 2;
  station.add(coil);

  const iron = new T.Group();
  const end = (y: number) => new T.Vector3(0, y, 0);
  iron.add(cylinderBetween(end(0.006), end(0.089), 0.010, steel, 12));
  const tip = mesh(new T.ConeGeometry(0.013, 0.023, 12), steel, 0, 0.012, 0);
  tip.rotation.x = Math.PI;
  iron.add(tip);
  round(iron, [[0, 0.075], [0.016, 0.076], [0.019, 0.085], [0.019, 0.133], [0.015, 0.138]], brass, 0, 0, 0);
  round(iron, [[0.016, 0.127], [0.026, 0.139], [0.030, 0.158], [0.028, 0.237], [0.022, 0.259], [0.015, 0.271]], mahogany, 0, 0, 0);
  for (let i = 0; i < 5; i++) round(iron, [[0.028, 0.155 + 0.012 * i], [0.030, 0.157 + 0.012 * i], [0.028, 0.159 + 0.012 * i]], rubber, 0, 0, 0);
  iron.add(cylinderBetween(end(0.259), end(0.304), 0.009, rubber));
  scene.add(iron);
  const ironRest = station.localToWorld(new T.Vector3(0.16, 0.083, -0.006));

  const spool = new T.Group();
  spool.position.set(1.18, tableY, -0.12);
  scene.add(spool);
  round(spool, [[0.034, 0.003], [0.074, 0.003], [0.078, 0.011], [0.072, 0.020], [0.046, 0.020], [0.046, 0.077], [0.073, 0.077], [0.075, 0.086], [0.068, 0.092], [0.034, 0.092]], mahogany, 0, 0, 0);
  for (let i = 0; i < 13; i++) {
    const ring = mesh(new T.TorusGeometry(0.054, 0.0027, 6, 28), steel, 0, 0.023 + i * 0.0042, 0);
    ring.rotation.x = -Math.PI / 2;
    spool.add(ring);
  }
  const bottle = new T.MeshPhysicalMaterial({ color: '#5c3f20', roughness: 0.24, clearcoat: 0.9, transparent: true, opacity: 0.88 });
  round(scene, [[0, 0.005], [0.055, 0.005], [0.061, 0.017], [0.057, 0.13], [0.051, 0.144], [0.029, 0.163], [0.027, 0.193]], bottle, 1.32, tableY, -0.39);
  round(scene, [[0, 0.197], [0.031, 0.197], [0.032, 0.188], [0.032, 0.168]], rubber, 1.32, tableY, -0.39);
  const fluxLabel = canvasTexture(260, 108, ctx => {
    ctx.fillStyle = '#cbb390'; ctx.fillRect(0, 0, 260, 108);
    ctx.strokeStyle = '#907349'; ctx.strokeRect(8, 8, 244, 92);
    ctx.fillStyle = '#493521'; ctx.textAlign = 'center'; ctx.font = '29px Georgia'; ctx.fillText('FLUXO', 130, 63);
  });
  scene.add(mesh(new T.CylinderGeometry(0.059, 0.06, 0.044, 32, 1, true), new T.MeshStandardMaterial({ map: fluxLabel, roughness: 0.87 }), 1.32, tableY + 0.086, -0.39));
  const tweezers = new T.Group();
  scene.add(tweezers);
  tweezers.position.set(0.88, tableY + 0.016, 0.68);
  tweezers.rotation.y = 0.39;
  for (const factor of [-1, 1]) {
    const arm = addBox(tweezers, 0.013, 0.008, 0.31, brass, factor * 0.009, 0, 0, 0.003);
    arm.rotation.y = factor * 0.043;
  }
  for (const group of [facade, stand, station, spool, iron, tray, tweezers]) {
    const batch = mergeStatic(group);
    group.traverse(object => { if (object instanceof T.Mesh) object.geometry.dispose(); });
    group.clear();
    group.add(batch);
  }
  return { oak, darkWood, brass, lead, steel, tray, stand, iron, ironRest, outdoors, windowGlow };
}
