

/**
 * Meteorologia das Emocoes — objetos 3D procedurais.
 * Gerados com Three.js: sem modelos externos, sem primitivas cruas no produto final.
 * Y-up, metros, nomes de nos estaveis, proxies para picking.
 */

import * as THREE from 'three';

// ---------------------------------------------------------------------------
// Paleta de cores (ajustada ao mockup)
// ---------------------------------------------------------------------------

export const PALETTE = {
  woodDark: 0x5b3a1e,
  wood: 0xa76c3d,
  woodLight: 0xb96a46,
  felt: 0x254533,
  sage: 0x79835a,
  cream: 0xf2e4cc,
  paper: 0xfaf5e9,
  brass: 0xd8ae66,
  brassDark: 0x8f6b3b,
  glass: 0xffffff,
  skyStorm: 0x263d4c,
  skySun: 0x254533,
  accentGold: 0xd8ae66,
} as const;

const deg = (d: number) => (d * Math.PI) / 180;

// ---------------------------------------------------------------------------
// Texturas geradas via Canvas 2D (sem arquivos externos)
// ---------------------------------------------------------------------------

function canvasTexture(
  draw: (ctx: CanvasRenderingContext2D, w: number, h: number) => void,
  w = 512,
  h = 512
): THREE.Texture {
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;
  draw(ctx, w, h);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}

function woodGrain(): THREE.Texture {
  return canvasTexture((ctx, w, h) => {
    const grad = ctx.createLinearGradient(0, 0, w, 0);
    grad.addColorStop(0, '#8c5a2b');
    grad.addColorStop(0.5, '#a76c3d');
    grad.addColorStop(1, '#8c5a2b');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);
    ctx.lineCap = 'round';
    for (let i = 0; i < 40; i++) {
      const x = Math.random() * w;
      const y1 = Math.random() * h * 0.3;
      const y2 = y1 + h * 0.7 + Math.random() * h * 0.3;
      ctx.strokeStyle = `rgba(60, 35, 15, ${0.15 + Math.random() * 0.15})`;
      ctx.lineWidth = 1 + Math.random() * 2;
      ctx.beginPath();
      ctx.moveTo(x, y1);
      ctx.bezierCurveTo(x + 40, y1 + h * 0.1, x - 20, y2 - h * 0.1, x + 10, y2);
      ctx.stroke();
    }
    ctx.fillStyle = 'rgba(0,0,0,0.04)';
    for (let i = 0; i < 15; i++) {
      ctx.beginPath();
      ctx.arc(Math.random() * w, Math.random() * h, 2 + Math.random() * 6, 0, Math.PI * 2);
      ctx.fill();
    }
  }, 512, 256);
}

function feltTexture(): THREE.Texture {
  return canvasTexture((ctx, w, h) => {
    ctx.fillStyle = '#254533';
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = 'rgba(255,255,255,0.03)';
    for (let i = 0; i < 400; i++) {
      ctx.fillRect(Math.random() * w, Math.random() * h, 1.5, 1.5);
    }
  }, 512, 512);
}

function brassTexture(): THREE.Texture {
  return canvasTexture((ctx, w, h) => {
    const grad = ctx.createRadialGradient(w * 0.5, h * 0.5, 0, w * 0.5, h * 0.5, w * 0.6);
    grad.addColorStop(0, '#e8c68c');
    grad.addColorStop(0.55, '#d8ae66');
    grad.addColorStop(1, '#9c7238');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = 'rgba(255,255,255,0.25)';
    ctx.lineWidth = 1.2;
    for (let i = 0; i < 60; i++) {
      const x = Math.random() * w;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x + (Math.random() - 0.5) * 10, h);
      ctx.stroke();
    }
  }, 512, 512);
}

function paperFiber(): THREE.Texture {
  return canvasTexture((ctx, w, h) => {
    ctx.fillStyle = '#f2e4cc';
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = 'rgba(130, 110, 80, 0.05)';
    for (let i = 0; i < 600; i++) {
      ctx.fillRect(Math.random() * w, Math.random() * h, 1, 2 + Math.random() * 3);
    }
  }, 512, 512);
}

export class Materials {
  wood: THREE.MeshStandardMaterial;
  woodLight: THREE.MeshStandardMaterial;
  woodDark: THREE.MeshStandardMaterial;
  felt: THREE.MeshStandardMaterial;
  sage: THREE.MeshStandardMaterial;
  brass: THREE.MeshStandardMaterial;
  brassDark: THREE.MeshStandardMaterial;
  glass: THREE.MeshPhysicalMaterial;
  paper: THREE.MeshStandardMaterial;
  cream: THREE.MeshStandardMaterial;
  cloud: THREE.MeshStandardMaterial;
  rain: THREE.MeshBasicMaterial;

  constructor() {
    const mat = (color: number, opts: Partial<THREE.MeshStandardMaterialParameters> = {}) =>
      new THREE.MeshStandardMaterial({ color, roughness: 0.85, metalness: 0.1, ...opts });

    this.wood = mat(PALETTE.wood, { map: woodGrain(), roughness: 0.8 });
    this.woodLight = mat(PALETTE.woodLight, { map: woodGrain(), roughness: 0.75 });
    this.woodDark = mat(PALETTE.woodDark, { map: woodGrain(), roughness: 0.85 });
    this.felt = mat(PALETTE.felt, { map: feltTexture(), roughness: 1, metalness: 0 });
    this.sage = mat(PALETTE.sage, { roughness: 0.9 });
    this.brass = mat(PALETTE.brass, { map: brassTexture(), roughness: 0.4, metalness: 0.85 });
    this.brassDark = mat(PALETTE.brassDark, { roughness: 0.5, metalness: 0.8 });
    this.glass = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      metalness: 0,
      roughness: 0.1,
      transmission: 0.85,
      transparent: true,
      opacity: 0.75,
      thickness: 0.5,
      side: THREE.DoubleSide,
    });
    this.paper = mat(PALETTE.cream, { map: paperFiber(), roughness: 0.9 });
    this.cream = mat(PALETTE.paper, { roughness: 0.9 });
    this.cloud = new THREE.MeshStandardMaterial({
      color: 0xe4eaf0,
      transparent: true,
      opacity: 0.85,
      roughness: 1,
      metalness: 0,
      side: THREE.DoubleSide,
    });
    this.rain = new THREE.MeshBasicMaterial({ color: 0x9ec8d8, transparent: true, opacity: 0.55 });
  }
}

export const materials = new Materials();

export function group(name: string): THREE.Group {
  const g = new THREE.Group();
  g.name = name;
  return g;
}

export function mesh(
  geometry: THREE.BufferGeometry,
  material: THREE.Material,
  name: string
): THREE.Mesh {
  const m = new THREE.Mesh(geometry, material);
  m.name = name;
  m.castShadow = true;
  m.receiveShadow = true;
  return m;
}

export function cylinder(
  name: string,
  material: THREE.Material,
  rTop: number,
  rBottom: number,
  height: number,
  segments = 24
): THREE.Mesh {
  return mesh(new THREE.CylinderGeometry(rTop, rBottom, height, segments), material, name);
}

export function latheShape(
  name: string,
  material: THREE.Material,
  points: { x: number; y: number }[],
  segments = 24
): THREE.Mesh {
  return mesh(
    new THREE.LatheGeometry(points.map((p) => new THREE.Vector2(p.x, p.y)), segments),
    material,
    name
  );
}

export function setPivot(mesh: THREE.Mesh, pivot: THREE.Vector3): void {
  mesh.geometry.translate(-pivot.x, -pivot.y, -pivot.z);
}

export function buildDomeFrame(): THREE.Group {
  const g = group('dome_frame');
  const radius = 7;
  const height = 5;
  const segments = 10;
  const beamMat = materials.brass;
  const woodMat = materials.wood;

  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(radius * 0.9, height * 0.5, 0),
    new THREE.Vector3(0, height, 0),
    new THREE.Vector3(-radius * 0.9, height * 0.5, 0),
    new THREE.Vector3(0, 0, 0),
  ]);
  const points = curve.getPoints(70);

  for (let j = 0; j <= 36; j++) {
    const b = (j / 36) * Math.PI * 2;
    const line = new THREE.Group();
    points.forEach((p) => {
      const x = p.x * Math.cos(b) - p.z * Math.sin(b);
      const z = p.x * Math.sin(b) + p.z * Math.cos(b);
      const cyl = cylinder(`beam_${j}`, beamMat, 0.05, 0.05, 0.35, 8);
      cyl.position.set(x, p.y, z);
      line.add(cyl);
    });
    g.add(line);
  }

  for (let i = 0; i < segments; i++) {
    const a = (i / segments) * Math.PI * 2;
    const beam = cylinder(`radial_${i}`, woodMat, 0.07, 0.04, height + 0.6, 12);
    beam.position.set(radius * Math.cos(a), height / 2 + 0.3, radius * Math.sin(a));
    beam.rotation.z = deg(-90);
    g.add(beam);
  }

  g.traverse((c) => {
    if (c instanceof THREE.Mesh) c.castShadow = true;
  });
  return g;
}

export function buildWindowGlass(): THREE.Group {
  const g = group('window_glass');
  const radius = 6.6;
  const height = 4.6;
  const glass = mesh(
    new THREE.CylinderGeometry(radius, radius, height, 32, 1, true),
    materials.glass,
    'glass_pane'
  );
  glass.rotation.y = deg(90);
  glass.position.set(0, height / 2, 0);
  g.add(glass);
  return g;
}

export function buildConsole(): THREE.Group {
  const g = group('console');
  const body = mesh(new THREE.BoxGeometry(3.4, 0.9, 1.1), materials.wood, 'console_body');
  body.position.set(0, 0.45, 0);
  g.add(body);

  const top = mesh(new THREE.BoxGeometry(3.5, 0.18, 1.25), materials.felt, 'console_top_felt');
  top.position.set(0, 1.0, 0.05);
  g.add(top);

  const frame = mesh(new THREE.BoxGeometry(3.2, 0.12, 1.05), materials.woodDark, 'console_frame');
  frame.position.set(0, 1.09, 0.12);
  g.add(frame);

  const drawer = mesh(new THREE.BoxGeometry(3.0, 0.5, 0.85), materials.wood, 'console_drawer');
  drawer.position.set(0, 0.18, 0.45);
  g.add(drawer);
  const handle = cylinder('drawer_handle', materials.brassDark, 0.02, 0.02, 0.3, 12);
  handle.rotation.z = deg(90);
  handle.position.set(-0.6, 0.18, 0.89);
  g.add(handle);

  return g;
}

export function buildDial(kind: 'sun' | 'cloud' | 'rain' | 'wind'): THREE.Group {
  const g = group(`dial_${kind}`);
  const faceMat = materials.cream;
  const ringMat = materials.brass;
  const markMat = materials.brassDark;

  const outer = cylinder(`dial_${kind}_ring`, ringMat, 0.42, 0.39, 0.14, 32);
  g.add(outer);
  const face = mesh(new THREE.CircleGeometry(0.38, 64), faceMat, `dial_${kind}_face`);
  face.rotation.x = deg(-90);
  face.position.z = 0.071;
  g.add(face);

  const icon = buildDialIcon(kind);
  icon.position.z = 0.072;
  g.add(icon);

  for (let i = 0; i < 5; i++) {
    const a = deg(-110 + i * 55);
    const mark = cylinder(`dial_${kind}_mark_${i}`, markMat, 0.018, 0.018, 0.025, 8);
    mark.rotation.x = deg(-90);
    const r = 0.30;
    mark.position.set(Math.cos(a) * r, 0.072, Math.sin(a) * r);
    g.add(mark);
  }

  const pointer = buildDialPointer();
  pointer.name = `dial_${kind}_pointer`;
  g.add(pointer);

  g.userData = { kind, pointerRadius: 0.28 };
  return g;
}

function buildDialIcon(kind: 'sun' | 'cloud' | 'rain' | 'wind'): THREE.Group {
  const g = group(`dial_${kind}_icon`);
  const ink = materials.brassDark;
  if (kind === 'sun') {
    const core = mesh(new THREE.CircleGeometry(0.05, 12), ink, 'sun_core');
    core.position.z = 0.001;
    g.add(core);
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      const ray = cylinder(`sun_ray_${i}`, ink, 0.014, 0.006, 0.14, 6);
      ray.rotation.x = deg(-90);
      ray.position.set(Math.cos(a) * 0.11, 0.001, Math.sin(a) * 0.11);
      g.add(ray);
    }
  } else if (kind === 'cloud') {
    const puffs = [
      [-0.08, 0], [0, 0.04], [0.08, 0], [-0.04, -0.04], [0.04, -0.04],
    ];
    puffs.forEach(([x, y], i) => {
      const puff = mesh(new THREE.CircleGeometry(0.075, 10), ink, `cloud_puff_${i}`);
      puff.rotation.x = deg(-90);
      puff.position.set(x, 0.001 + y, 0);
      g.add(puff);
    });
  } else if (kind === 'rain') {
    const cloud = mesh(new THREE.CircleGeometry(0.06, 10), ink, 'rain_cloud');
    cloud.rotation.x = deg(-90);
    cloud.position.set(-0.06, 0.03, 0.001);
    g.add(cloud);
    for (let i = 0; i < 3; i++) {
      const drop = mesh(new THREE.BoxGeometry(0.014, 0.05, 0.002), ink, `rain_drop_${i}`);
      drop.position.set(-0.06 + i * 0.06, 0.001 - 0.085, 0);
      g.add(drop);
    }
  } else {
    for (let i = 0; i < 3; i++) {
      const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-0.09 - i * 0.04, 0.001, 0.06 - i * 0.05),
        new THREE.Vector3(0, 0.001, 0),
        new THREE.Vector3(0.09 + i * 0.04, 0.001, -0.06 + i * 0.05),
      ]);
      const pts = curve.getPoints(8);
      const geo = new THREE.BufferGeometry().setFromPoints(pts);
      const line = new THREE.Line(geo, new THREE.LineBasicMaterial({ color: 0x6b6b6b }));
      line.name = `wind_line_${i}`;
      g.add(line);
    }
  }
  return g;
}

export function buildDialPointer(): THREE.Group {
  const g = group('dial_pointer');
  const needle = cylinder('needle', materials.brassDark, 0.022, 0.006, 0.24, 10);
  needle.rotation.x = deg(-90);
  needle.position.y = 0.12;
  g.add(needle);
  const cap = mesh(new THREE.SphereGeometry(0.035, 12, 8), materials.brass, 'pointer_cap');
  cap.position.y = 0;
  g.add(cap);
  g.rotation.z = 0;
  return g;
}

export function setDialPointer(dial: THREE.Group, position: number): void {
  const p = Math.min(4, Math.max(0, Math.round(position)));
  const angle = deg(-110 + p * 55);
  const pointer = dial.children.find(
    (c) => c.name === `${dial.userData.kind}_pointer`
  ) as THREE.Group | undefined;
  if (pointer) pointer.rotation.z = angle;
}

export function buildArmillary(): THREE.Group {
  const g = group('armillary');
  const r = 1.05;
  const mat = materials.brass;
  const dark = materials.brassDark;

  const ring = (rx: number, ry: number, rz: number, s: number) => {
    const torus = new THREE.TorusGeometry(s, 0.025, 12, 36, 4);
    const m = mesh(torus, mat, 'armillary_ring');
    m.rotation.set(rx, ry, rz);
    return m;
  };

  g.add(ring(0, 0, deg(90), r));
  g.add(ring(deg(90), 0, 0, r));
  g.add(ring(0, deg(45), 0, r));
  g.add(ring(0, deg(-45), 0, r));

  const center = mesh(new THREE.SphereGeometry(0.18, 24, 16), dark, 'armillary_center');
  g.add(center);

  g.position.set(0, 1.45, 0);
  return g;
}

export function buildTelescope(): THREE.Group {
  const g = group('telescope');
  const tube = cylinder('telescope_tube', materials.brass, 0.1, 0.13, 1.6, 24);
  tube.rotation.z = deg(-45);
  tube.position.set(0.65, 0.6, -0.55);
  g.add(tube);
  const eyepiece = cylinder('eyepiece', materials.brassDark, 0.05, 0.05, 0.2, 16);
  eyepiece.rotation.z = deg(-45);
  eyepiece.position.set(1.05, 0.3, -0.9);
  g.add(eyepiece);

  for (let i = 0; i < 3; i++) {
    const a = (i / 3) * Math.PI * 2;
    const leg = cylinder(`tripod_leg_${i}`, materials.wood, 0.045, 0.015, 1.1, 12);
    leg.position.set(Math.cos(a) * 0.35, 0.55, Math.sin(a) * 0.35);
    g.add(leg);
  }
  const head = mesh(new THREE.SphereGeometry(0.09, 16, 12), materials.brass, 'tripod_head');
  head.position.set(0, 1.1, 0);
  g.add(head);
  return g;
}

export function buildGlobe(): THREE.Group {
  const g = group('globe');
  const sphere = mesh(new THREE.SphereGeometry(0.5, 32, 24), materials.cream, 'globe_sphere');
  const cont = mesh(new THREE.IcosahedronGeometry(0.51, 2), materials.woodDark, 'globe_continents');
  cont.scale.setScalar(1.005);
  g.add(sphere);
  g.add(cont);
  const stand = cylinder('globe_stand', materials.brassDark, 0.05, 0.05, 0.5, 16);
  stand.position.set(0, -0.25, 0);
  g.add(stand);
  g.position.set(-1.6, 0.95, 0.4);
  g.rotation.y = deg(20);
  return g;
}

export function buildPlants(count = 14): THREE.Group {
  const g = group('plants');
  const leafMat = materials.sage;
  const leafGeo = new THREE.PlaneGeometry(0.12, 0.22, 2);
  const inst = new THREE.InstancedMesh(leafGeo, leafMat, count);
  const dummy = new THREE.Object3D();
  const mats: number[] = [];
  const bases: number[] = [];
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2;
    const r = 1.5 + Math.random() * 1.2;
    const h = 0.4 + Math.random() * 0.6;
    dummy.position.set(Math.cos(angle) * r, h, Math.sin(angle) * r);
    dummy.rotation.y = angle + Math.PI;
    dummy.scale.setScalar(0.7 + Math.random() * 0.6);
    dummy.updateMatrix();
    inst.setMatrixAt(i, dummy.matrix);
    mats.push(0.4 + Math.random() * 0.6);
    bases.push(angle);
  }
  inst.instanceMatrix.needsUpdate = true;
  (inst as any).userData = { mats, bases, count };
  g.add(inst);
  return g;
}

export function updatePlantsWind(plants: THREE.Group, wind: number, t: number): void {
  const inst = plants.children[0] as THREE.InstancedMesh | undefined;
  if (!inst) return;
  const mats: number[] = (inst as any).userData.mats;
  const bases: number[] = (inst as any).userData.bases;
  const strength = wind / 4;
  for (let i = 0; i < inst.count; i++) {
    const dummy = new THREE.Object3D();
    const angle = bases[i];
    const r = 1.5 + Math.random() * 1.2;
    const h = 0.4 + Math.random() * 0.6;
    const sway = Math.sin(t * 1.2 + i) * strength * 0.15 * mats[i];
    dummy.position.set(Math.cos(angle + sway) * r, h, Math.sin(angle + sway) * r);
    dummy.rotation.y = angle + sway * 0.5 + Math.PI;
    dummy.scale.setScalar(0.7 + Math.random() * 0.6);
    dummy.updateMatrix();
    inst.setMatrixAt(i, dummy.matrix);
  }
  inst.instanceMatrix.needsUpdate = true;
}

export function buildDeskProps(): THREE.Group {
  const g = group('desk_props');
  const stack = group('books_stack');
  const sizes = [
    { w: 0.5, h: 0.05, d: 0.32, y: 0 },
    { w: 0.45, h: 0.045, d: 0.3, y: 0.05 },
    { w: 0.42, h: 0.04, d: 0.28, y: 0.095 },
  ];
  sizes.forEach((s, i) => {
    const b = mesh(new THREE.BoxGeometry(s.w, s.h, s.d), materials.wood, `book_${i}`);
    b.position.set(0, s.y, 0);
    stack.add(b);
  });
  stack.position.set(-1.35, 1.06, -0.35);
  stack.rotation.y = deg(15);
  g.add(stack);

  const mug = cylinder('mug', materials.cream, 0.07, 0.07, 0.16, 24);
  mug.position.set(-1.15, 1.065, -0.05);
  g.add(mug);
  const liquid = cylinder('mug_liquid', materials.brassDark, 0.065, 0.065, 0.14, 24);
  liquid.position.set(-1.15, 1.075, -0.05);
  g.add(liquid);

  const colors = [0xe85d5d, 0x5d9ee8, 0x5dd88c, 0xe8c05d];
  colors.forEach((c, i) => {
    const p = cylinder(
      `pencil_${i}`,
      new THREE.MeshStandardMaterial({ color: c, roughness: 0.9 }),
      0.012,
      0.012,
      0.14,
      8
    );
    p.position.set(-1.05 + i * 0.03, 1.065 + 0.07, -0.05);
    p.rotation.x = deg(-10);
    g.add(p);
  });

  const map = mesh(new THREE.PlaneGeometry(0.9, 0.7), materials.paper, 'map');
  map.rotation.x = deg(-90);
  map.position.set(1.05, 1.061, 0.15);
  map.rotation.y = deg(-10);
  g.add(map);

  return g;
}
