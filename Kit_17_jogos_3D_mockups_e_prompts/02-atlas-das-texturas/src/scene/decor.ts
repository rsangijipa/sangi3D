import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { boxUV, canvasTexture, lathe, mesh, rbox, taperedTube } from '../core/model';
import { fbmT, rng } from '../core/noise';
import { addWind, leafTexture } from '../core/effects';

/**
 * Cenário do ateliê: mesa de carvalho mel, parede de gesso, prateleiras com livros, jiboia pendente,
 * pote com pincéis, quadro botânico, casinha de madeira, globo e o gaveteiro de amostras (sample_drawer).
 * Peças estáticas são fundidas por material depois (mergeStatic) para economizar chamadas de desenho.
 */

export interface DecorMats {
  oak: THREE.Material;
  trayWood: THREE.Material;
  darkWood: THREE.Material;
  felt: THREE.Material;
  plaster: THREE.Material;
  steel: THREE.Material;
  brass: THREE.Material;
  paper: THREE.Material;
  ceramic: THREE.Material;
  cloth: THREE.MeshStandardMaterial;
}

export interface Wind {
  strength: { value: number };
  time: { value: number };
}

/* ------------------------------------------------------------------ */
/* Bandejas                                                            */
/* ------------------------------------------------------------------ */

/** Bandeja de madeira com aro arredondado e (opcional) feltro rebaixado. */
export function buildTray(w: number, d: number, mats: DecorMats, felt: boolean, name: string) {
  const g = new THREE.Group();
  g.name = name;
  const rim = 0.016;
  const h = 0.02;
  const baseT = 0.008;
  g.add(mesh(rbox(w, baseT, d, 0.004, 2), mats.trayWood, 0, baseT / 2, 0));
  const railW = (len: number, x: number, z: number, along: 'x' | 'z') => {
    const m = mesh(along === 'x' ? rbox(len, h, rim, 0.006, 3) : rbox(rim, h, len, 0.006, 3), mats.trayWood, x, h / 2, z);
    g.add(m);
  };
  railW(w, 0, d / 2 - rim / 2, 'x');
  railW(w, 0, -d / 2 + rim / 2, 'x');
  railW(d - rim * 2 + 0.002, w / 2 - rim / 2, 0, 'z');
  railW(d - rim * 2 + 0.002, -w / 2 + rim / 2, 0, 'z');
  if (felt) {
    const f = new THREE.Mesh(new THREE.PlaneGeometry(w - rim * 2, d - rim * 2), mats.felt);
    // UV em metros para o feltro
    const uv = f.geometry.attributes.uv as THREE.BufferAttribute;
    for (let i = 0; i < uv.count; i++) uv.setXY(i, (uv.getX(i) * (w - rim * 2)) / 0.12, (uv.getY(i) * (d - rim * 2)) / 0.12);
    f.rotation.x = -Math.PI / 2;
    f.position.y = baseT + 0.0012;
    f.receiveShadow = true;
    f.userData.keep = true;
    g.add(f);
  }
  return { group: g, surfaceY: felt ? baseT + 0.0015 : baseT };
}

/* ------------------------------------------------------------------ */
/* Sala: mesa e parede                                                  */
/* ------------------------------------------------------------------ */

export function buildRoom(mats: DecorMats) {
  const g = new THREE.Group();
  g.name = 'workbench';
  const top = new THREE.Mesh(boxUV(2.8, 0.045, 1.5, 0.9), mats.oak);
  top.position.set(0, -0.0225, -0.05);
  top.receiveShadow = true;
  top.castShadow = false;
  top.userData.keep = true;
  g.add(top);
  // borda frontal arredondada
  const lip = mesh(new THREE.CylinderGeometry(0.0225, 0.0225, 2.8, 16), mats.oak, 0, -0.0225, 0.7);
  lip.rotation.z = Math.PI / 2;
  g.add(lip);
  const wall = new THREE.Mesh(new THREE.PlaneGeometry(3.2, 1.8), mats.plaster);
  const uv = wall.geometry.attributes.uv as THREE.BufferAttribute;
  for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * 3.2, uv.getY(i) * 1.8);
  wall.position.set(0, 0.85, -0.66);
  wall.receiveShadow = true;
  wall.userData.keep = true;
  g.add(wall);
  // rodapé de madeira entre mesa e parede
  g.add(mesh(rbox(2.8, 0.05, 0.02, 0.005), mats.darkWood, 0, 0.025, -0.65));
  return g;
}

/* ------------------------------------------------------------------ */
/* Prateleiras, livros e jiboia                                         */
/* ------------------------------------------------------------------ */

export function buildShelves(mats: DecorMats, wind: Wind, texSize: number) {
  const g = new THREE.Group();
  g.name = 'shelf_props';
  const animated = new THREE.Group();
  const shelf = (x: number, y: number, w: number) => {
    g.add(mesh(rbox(w, 0.022, 0.17, 0.005, 3), mats.darkWood, x, y, -0.575));
    for (const bx of [x - w / 2 + 0.06, x + w / 2 - 0.06]) {
      const br = new THREE.Shape();
      br.moveTo(0, 0);
      br.lineTo(0.09, 0);
      br.quadraticCurveTo(0.02, -0.01, 0, -0.09);
      br.closePath();
      const geo = new THREE.ExtrudeGeometry(br, { depth: 0.014, bevelEnabled: true, bevelSize: 0.002, bevelThickness: 0.002, bevelSegments: 2 });
      const m = mesh(geo, mats.darkWood, bx - 0.007, y - 0.011, -0.66);
      m.rotation.y = -Math.PI / 2;
      m.position.x = bx + 0.007;
      g.add(m);
    }
  };
  shelf(-0.55, 0.26, 0.9);
  shelf(-0.2, 0.6, 0.62);

  // livros instanciados com cor por instância
  const r = rng(12);
  const palette = ['#6e3b2a', '#2f4a3c', '#8a5a2b', '#3c4a5e', '#a5432f', '#5b4636', '#c19a5b', '#2d3b33', '#7b6a4e', '#4a2f2a'];
  const bookGeo = new RoundedBoxGeometry(1, 1, 1, 2, 0.06);
  const books: THREE.Matrix4[] = [];
  const colors: THREE.Color[] = [];
  let x = -0.97;
  while (x < -0.18) {
    const t = 0.018 + r() * 0.022;
    const h = 0.15 + r() * 0.07;
    const d = 0.12 + r() * 0.03;
    const lean = x > -0.3 ? 0 : r() < 0.08 ? 0.18 : (r() - 0.5) * 0.03;
    const m = new THREE.Matrix4().compose(
      new THREE.Vector3(x + t / 2, 0.271 + h / 2 - Math.abs(lean) * 0.01, -0.57 + (r() - 0.5) * 0.01),
      new THREE.Quaternion().setFromEuler(new THREE.Euler(0, (r() - 0.5) * 0.04, lean)),
      new THREE.Vector3(t, h, d),
    );
    books.push(m);
    colors.push(new THREE.Color(palette[Math.floor(r() * palette.length)]).multiplyScalar(0.85 + r() * 0.3));
    x += t + 0.0015 + (lean > 0.1 ? 0.03 : 0);
    if (r() < 0.06) x += 0.05;
  }
  // pilha deitada na prateleira de cima
  for (let i = 0; i < 4; i++) {
    const t = 0.022 + r() * 0.012;
    books.push(
      new THREE.Matrix4().compose(
        new THREE.Vector3(0.0 + (r() - 0.5) * 0.01, 0.611 + t / 2 + i * (t + 0.001) + i * 0.004, -0.57),
        new THREE.Quaternion().setFromEuler(new THREE.Euler(0, (r() - 0.5) * 0.25, 0)),
        new THREE.Vector3(0.17 - i * 0.012, t, 0.12),
      ),
    );
    colors.push(new THREE.Color(palette[Math.floor(r() * palette.length)]));
  }
  const inst = new THREE.InstancedMesh(bookGeo, mats.cloth, books.length);
  books.forEach((m, i) => {
    inst.setMatrixAt(i, m);
    inst.setColorAt(i, colors[i]);
  });
  inst.castShadow = true;
  inst.receiveShadow = true;
  g.add(inst);

  // pote de cerâmica com pincéis
  const jar = mesh(
    lathe([[0, 0], [0.034, 0], [0.037, 0.006], [0.038, 0.05], [0.036, 0.095], [0.039, 0.1], [0.035, 0.102], [0.032, 0.03], [0, 0.03]], 40),
    mats.ceramic,
    -0.37,
    0.611,
    -0.56,
  );
  g.add(jar);
  const handleMat = new THREE.MeshStandardMaterial({ color: '#7a4a2a', roughness: 0.45 });
  const bristleMat = new THREE.MeshStandardMaterial({ color: '#3a2a1e', roughness: 0.8 });
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    const tilt = 0.12 + r() * 0.15;
    const baseP = new THREE.Vector3(-0.37 + Math.cos(a) * 0.012, 0.64, -0.56 + Math.sin(a) * 0.012);
    const dir = new THREE.Vector3(Math.cos(a) * tilt, 1, Math.sin(a) * tilt).normalize();
    const len = 0.16 + r() * 0.06;
    const tip = baseP.clone().addScaledVector(dir, len);
    g.add(new THREE.Mesh(taperedTube([baseP, baseP.clone().addScaledVector(dir, len * 0.5), tip], (t) => 0.0042 * (1 - t * 0.35), { radial: 10, segments: 10 }), handleMat));
    const fer = mesh(new THREE.CylinderGeometry(0.0034, 0.0036, 0.02, 14), mats.brass);
    fer.position.copy(tip.clone().addScaledVector(dir, 0.01));
    fer.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
    g.add(fer);
    const tuft = mesh(lathe([[0.0033, 0], [0.0042, 0.008], [0.003, 0.02], [0.0, 0.028]], 12), bristleMat);
    tuft.position.copy(tip.clone().addScaledVector(dir, 0.02));
    tuft.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
    g.add(tuft);
  }

  // jiboia pendente: vasinho na prateleira de cima, ramos caindo pela borda
  const pot = mesh(lathe([[0, 0], [0.04, 0], [0.048, 0.07], [0.052, 0.075], [0.047, 0.076], [0.04, 0.012], [0, 0.012]], 40), mats.ceramic, -0.17, 0.611, -0.54);
  g.add(pot);
  const soil = mesh(new THREE.CircleGeometry(0.044, 24), new THREE.MeshStandardMaterial({ color: '#3b2a1e', roughness: 1 }), -0.17, 0.676, -0.54);
  soil.rotation.x = -Math.PI / 2;
  g.add(soil);
  const vineMat = new THREE.MeshStandardMaterial({ color: '#4c6b2c', roughness: 0.7 });
  const leafTex = leafTexture({ size: Math.min(256, texSize), palette: ['#4f7d32'], single: true, aspect: 0.62, seed: 4 });
  const leafMat = new THREE.MeshStandardMaterial({ map: leafTex, alphaTest: 0.45, side: THREE.DoubleSide, roughness: 0.55 });
  addWind(leafMat, { strength: wind.strength, time: wind.time, mode: 'leaves' });
  const leafDepth = new THREE.MeshDepthMaterial({ depthPacking: THREE.RGBADepthPacking, map: leafTex, alphaTest: 0.45 });
  addWind(leafDepth, { strength: wind.strength, time: wind.time, mode: 'leaves' });
  const leafGeo = new THREE.PlaneGeometry(1, 1, 3, 3);
  const lp = leafGeo.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < lp.count; i++) lp.setZ(i, Math.abs(lp.getX(i)) * 0.25 - lp.getY(i) * 0.1);
  leafGeo.translate(0, 0.5, 0);
  leafGeo.computeVertexNormals();
  const leafMs: THREE.Matrix4[] = [];
  const vines = [
    { dx: 0.0, fall: 0.55, out: 0.12 },
    { dx: 0.05, fall: 0.42, out: 0.1 },
    { dx: -0.05, fall: 0.48, out: 0.15 },
    { dx: 0.09, fall: 0.3, out: 0.08 },
    { dx: -0.1, fall: 0.25, out: 0.06 },
  ];
  for (const [vi, v] of vines.entries()) {
    const pts: THREE.Vector3[] = [];
    const sx = -0.17 + v.dx * 0.4;
    for (let k = 0; k <= 8; k++) {
      const t = k / 8;
      const over = Math.min(1, t * 3);
      pts.push(new THREE.Vector3(sx + v.dx * t * 1.4 + Math.sin(t * 5 + vi) * 0.02, 0.69 - Math.max(0, t - 0.25) * v.fall + Math.sin(over * Math.PI) * 0.015, -0.54 + over * v.out));
    }
    const curve = new THREE.CatmullRomCurve3(pts);
    g.add(new THREE.Mesh(taperedTube(pts, (t) => 0.0022 * (1 - t * 0.5), { radial: 6, segments: 40 }), vineMat));
    const n = 14 + vi * 2;
    for (let k = 1; k < n; k++) {
      const t = k / n;
      const p = curve.getPointAt(t);
      const tan = curve.getTangentAt(t);
      const side = k % 2 ? 1 : -1;
      const s = 0.028 + (1 - t) * 0.018 + r() * 0.01;
      const q = new THREE.Quaternion().setFromEuler(new THREE.Euler(-0.3 + r() * 0.5, Math.atan2(tan.x, tan.z) + side * 1.2, side * (0.5 + r() * 0.6)));
      leafMs.push(new THREE.Matrix4().compose(p, q, new THREE.Vector3(s * 0.75, s, s)));
    }
  }
  // folhas que sobem do vaso
  for (let k = 0; k < 10; k++) {
    const a = (k / 10) * Math.PI * 2;
    const p = new THREE.Vector3(-0.17 + Math.cos(a) * 0.025, 0.68, -0.54 + Math.sin(a) * 0.025);
    const q = new THREE.Quaternion().setFromEuler(new THREE.Euler(-0.4 + r() * 0.3, a + Math.PI / 2, 0.3));
    leafMs.push(new THREE.Matrix4().compose(p, q, new THREE.Vector3(0.04, 0.05, 0.05)));
  }
  const leaves = new THREE.InstancedMesh(leafGeo, leafMat, leafMs.length);
  leafMs.forEach((m, i) => leaves.setMatrixAt(i, m));
  leaves.customDepthMaterial = leafDepth;
  leaves.castShadow = true;
  leaves.receiveShadow = true;
  animated.add(leaves);

  return { group: g, animated };
}

/* ------------------------------------------------------------------ */
/* Quadro botânico, casinha de madeira e globo                          */
/* ------------------------------------------------------------------ */

function botanicalDrawing(size: number) {
  return canvasTexture(size, Math.round(size * 1.3), (ctx) => {
    const w = size;
    const h = Math.round(size * 1.3);
    ctx.fillStyle = '#f1e5c9';
    ctx.fillRect(0, 0, w, h);
    // fibras discretas
    for (let i = 0; i < 900; i++) {
      ctx.strokeStyle = `rgba(150,120,80,${0.03 + Math.random() * 0.04})`;
      ctx.lineWidth = 0.6;
      const x = Math.random() * w;
      const y = Math.random() * h;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + (Math.random() - 0.5) * 14, y + (Math.random() - 0.5) * 6);
      ctx.stroke();
    }
    ctx.save();
    ctx.translate(w / 2, h * 0.86);
    ctx.rotate(-0.12);
    const L = h * 0.7;
    const W = w * 0.3;
    const grad = ctx.createLinearGradient(-W, 0, W, 0);
    grad.addColorStop(0, '#5e8a4a');
    grad.addColorStop(0.5, '#7aa05c');
    grad.addColorStop(1, '#4d763c');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(W * 1.3, -L * 0.3, W * 0.9, -L * 0.8, 0, -L);
    ctx.bezierCurveTo(-W * 0.9, -L * 0.8, -W * 1.3, -L * 0.3, 0, 0);
    ctx.fill();
    ctx.strokeStyle = '#e9e2c4';
    ctx.lineWidth = w * 0.012;
    ctx.beginPath();
    ctx.moveTo(0, h * 0.05);
    ctx.lineTo(0, -L * 0.96);
    ctx.stroke();
    ctx.lineWidth = w * 0.006;
    for (let k = 1; k < 9; k++) {
      const y = -L * k * 0.1;
      const s = Math.sin((k / 9) * Math.PI);
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.quadraticCurveTo(W * 0.5 * s, y - L * 0.04, W * 0.95 * s, y - L * 0.12);
      ctx.moveTo(0, y);
      ctx.quadraticCurveTo(-W * 0.5 * s, y - L * 0.04, -W * 0.95 * s, y - L * 0.12);
      ctx.stroke();
    }
    ctx.restore();
    ctx.fillStyle = 'rgba(60,50,35,0.7)';
    ctx.font = `italic ${Math.round(w * 0.045)}px Georgia, serif`;
    ctx.textAlign = 'center';
    ctx.fillText('Folium · estudo de nervuras', w / 2, h * 0.95);
  });
}

function globeTexture(size: number) {
  return canvasTexture(size * 2, size, (ctx) => {
    const w = size * 2;
    const h = size;
    const img = ctx.createImageData(w, h);
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const u = x / w;
        const v = y / h;
        const n = fbmT(u * 6, v * 3, 6, 5, 77);
        const land = n > 0.53;
        const i = (y * w + x) * 4;
        const shade = 0.9 + fbmT(u * 30, v * 15, 30, 3, 5) * 0.15;
        const c = land ? [196, 160, 104] : [120, 150, 140];
        img.data[i] = c[0] * shade;
        img.data[i + 1] = c[1] * shade;
        img.data[i + 2] = c[2] * shade;
        img.data[i + 3] = 255;
      }
    }
    ctx.putImageData(img, 0, 0);
    ctx.strokeStyle = 'rgba(70,55,35,0.35)';
    ctx.lineWidth = 1;
    for (let k = 1; k < 12; k++) {
      ctx.beginPath();
      ctx.moveTo((k / 12) * w, 0);
      ctx.lineTo((k / 12) * w, h);
      ctx.stroke();
    }
    for (let k = 1; k < 6; k++) {
      ctx.beginPath();
      ctx.moveTo(0, (k / 6) * h);
      ctx.lineTo(w, (k / 6) * h);
      ctx.stroke();
    }
  });
}

export function buildWallProps(mats: DecorMats, texSize: number) {
  const g = new THREE.Group();
  // quadro botânico na parede
  const fw = 0.26;
  const fh = 0.33;
  const frame = new THREE.Group();
  const b = 0.022;
  frame.add(mesh(rbox(fw, b, 0.018, 0.004), mats.trayWood, 0, fh / 2 - b / 2, 0));
  frame.add(mesh(rbox(fw, b, 0.018, 0.004), mats.trayWood, 0, -fh / 2 + b / 2, 0));
  frame.add(mesh(rbox(b, fh, 0.018, 0.004), mats.trayWood, fw / 2 - b / 2, 0, 0));
  frame.add(mesh(rbox(b, fh, 0.018, 0.004), mats.trayWood, -fw / 2 + b / 2, 0, 0));
  const drawing = new THREE.Mesh(
    new THREE.PlaneGeometry(fw - b * 2, fh - b * 2),
    new THREE.MeshStandardMaterial({ map: botanicalDrawing(Math.min(512, texSize)), roughness: 0.92 }),
  );
  drawing.position.z = -0.002;
  drawing.receiveShadow = true;
  frame.add(drawing);
  frame.position.set(0.3, 0.62, -0.645);
  g.add(frame);

  // casinha de madeira
  const s = new THREE.Shape();
  s.moveTo(-0.035, 0);
  s.lineTo(0.035, 0);
  s.lineTo(0.035, 0.05);
  s.lineTo(0, 0.08);
  s.lineTo(-0.035, 0.05);
  s.closePath();
  const house = mesh(new THREE.ExtrudeGeometry(s, { depth: 0.05, bevelEnabled: true, bevelSize: 0.003, bevelThickness: 0.003, bevelSegments: 3 }), mats.trayWood, 0.08, 0.611, -0.6);
  g.add(house);
  for (const [wx, wy] of [
    [-0.012, 0.03],
    [0.012, 0.03],
    [0, 0.058],
  ]) {
    g.add(mesh(rbox(0.009, 0.012, 0.004, 0.001), mats.darkWood, 0.08 + wx, 0.611 + wy, -0.546));
  }
  return g;
}

/* ------------------------------------------------------------------ */
/* Gaveteiro de amostras (sample_drawer) com globo                       */
/* ------------------------------------------------------------------ */

export function buildCabinet(mats: DecorMats, texSize: number) {
  const g = new THREE.Group();
  g.name = 'sample_drawer';
  const W = 0.36;
  const H = 0.3;
  const D = 0.24;
  g.add(mesh(rbox(W, H, D, 0.008, 3), mats.trayWood, 0, H / 2, 0));
  g.add(mesh(rbox(W + 0.02, 0.016, D + 0.02, 0.005, 3), mats.trayWood, 0, H + 0.008, 0));
  const rows = 3;
  const cols = 2;
  const dw = (W - 0.03) / cols;
  const dh = (H - 0.04) / rows;
  const labelTex = canvasTexture(128, 48, (ctx) => {
    ctx.fillStyle = '#efe3c6';
    ctx.fillRect(0, 0, 128, 48);
    ctx.fillStyle = 'rgba(60,45,30,0.75)';
    ctx.font = 'italic 22px Georgia, serif';
    ctx.textAlign = 'center';
    ctx.fillText('amostras', 64, 32);
  });
  const labelMat = new THREE.MeshStandardMaterial({ map: labelTex, roughness: 0.9 });
  let animDrawer: THREE.Group | null = null;
  for (let rI = 0; rI < rows; rI++) {
    for (let c = 0; c < cols; c++) {
      const drawer = new THREE.Group();
      const x = -W / 2 + 0.015 + dw * (c + 0.5);
      const y = 0.02 + dh * (rI + 0.5);
      drawer.position.set(x, y, D / 2);
      drawer.add(mesh(rbox(dw - 0.008, dh - 0.008, 0.016, 0.004, 2), mats.trayWood, 0, 0, 0.004));
      // corpo da gaveta (visível quando abre)
      drawer.add(mesh(rbox(dw - 0.02, dh - 0.02, D - 0.04, 0.002, 1), mats.darkWood, 0, -0.002, -(D - 0.04) / 2));
      const holder = mesh(rbox(0.05, 0.022, 0.003, 0.001), mats.brass, 0, 0.012, 0.0135);
      drawer.add(holder);
      const label = new THREE.Mesh(new THREE.PlaneGeometry(0.042, 0.015), labelMat);
      label.position.set(0, 0.012, 0.0152);
      drawer.add(label);
      const pull = mesh(new THREE.TorusGeometry(0.009, 0.0018, 8, 20, Math.PI), mats.brass, 0, -0.014, 0.0145);
      pull.rotation.z = Math.PI;
      drawer.add(pull);
      if (rI === rows - 1 && c === 0) {
        animDrawer = drawer;
        drawer.userData.keep = true;
        drawer.traverse((o) => (o.userData.keep = true));
      }
      g.add(drawer);
    }
  }
  // globo sobre o gaveteiro
  const globe = new THREE.Group();
  globe.add(mesh(lathe([[0, 0], [0.045, 0], [0.047, 0.006], [0.03, 0.014], [0.008, 0.02], [0.006, 0.05], [0, 0.05]], 32), mats.darkWood));
  const sphere = mesh(new THREE.SphereGeometry(0.075, 48, 32), new THREE.MeshPhysicalMaterial({ map: globeTexture(Math.min(256, texSize)), roughness: 0.5, clearcoat: 0.6, clearcoatRoughness: 0.3 }), 0, 0.13, 0);
  sphere.rotation.z = 0.4;
  globe.add(sphere);
  const meridian = mesh(new THREE.TorusGeometry(0.082, 0.0026, 10, 64, Math.PI * 1.25), mats.brass, 0, 0.13, 0);
  meridian.rotation.set(0, Math.PI / 2, 0.4 - 0.4);
  globe.add(meridian);
  globe.position.set(0.06, H + 0.016, 0);
  g.add(globe);
  return { group: g, drawer: animDrawer as unknown as THREE.Group, drawerFront: new THREE.Vector3(-W / 2 + 0.015 + dw * 0.5, 0.02 + dh * (rows - 0.5), D / 2) };
}
