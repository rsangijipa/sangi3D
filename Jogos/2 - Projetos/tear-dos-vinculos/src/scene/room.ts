// Ateliê: piso, paredes com aberturas reais, janela gradeada, arco para o campo de lavanda,
// colinas, ciprestes, céu, prateleira, tapeçaria de parede, hera, fachos de luz e poeira.
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { mulberry } from '../sim/weavePath.ts';
import { boxUV, scaleUV, type MaterialKit } from './materials.ts';
import { lathe } from './loom.ts';
import { buildLavenderVase, buildSpool, buildYarnBall, mesh, shellLathe } from './props.ts';
import { hillTexture, lavenderCardTexture, leafTexture } from './textures.ts';

export const ROOM = {
  backZ: -1.75,
  wallT: 0.32,
  leftX: -2.7,
  height: 3.3,
  /** janela gradeada à esquerda do tear */
  win: { x: -1.15, w: 0.95, sill: 0.98, h: 1.55 },
  /** arco aberto à direita, para o terraço e o campo */
  arch: { x: 1.72, w: 1.35, sill: 0.0, h: 2.45 },
  /** janela na parede lateral esquerda */
  side: { z: 0.55, w: 0.9, sill: 0.95, h: 1.55 },
} as const;

export interface RoomParts {
  root: THREE.Group;
  beams: THREE.Mesh[];
  dust: THREE.Points;
  update: (t: number, camera: THREE.Camera) => void;
}

function archPath<T extends THREE.Path>(p: T, cx: number, w: number, sill: number, h: number, arched: boolean): T {
  const r = w / 2;
  p.moveTo(cx - r, sill);
  p.lineTo(cx + r, sill);
  if (arched) {
    p.lineTo(cx + r, sill + h - r);
    p.absarc(cx, sill + h - r, r, 0, Math.PI, false);
  } else {
    p.lineTo(cx + r, sill + h);
    p.lineTo(cx - r, sill + h);
  }
  p.lineTo(cx - r, sill);
  return p;
}

export function buildRoom(mat: MaterialKit, lite: boolean): RoomParts {
  const root = new THREE.Group();
  root.name = 'atelie';
  const { backZ, wallT, height } = ROOM;
  const rnd = mulberry(99);

  // Piso de terracota (interior) e laje do terraço.
  const floorGeo = new THREE.PlaneGeometry(9, 7);
  floorGeo.rotateX(-Math.PI / 2);
  const fp = floorGeo.getAttribute('position');
  const fuv = floorGeo.getAttribute('uv') as THREE.BufferAttribute;
  for (let i = 0; i < fp.count; i++) fuv.setXY(i, fp.getX(i), fp.getZ(i));
  const floor = mesh(floorGeo, mat.floor, 'piso', false);
  floor.position.set(0, 0, 1.2);
  root.add(floor);

  // Parede do fundo: extrusão com aberturas reais (dá espessura e profundidade às janelas).
  const wallShape = new THREE.Shape();
  wallShape.moveTo(-4.5, 0); wallShape.lineTo(4.5, 0); wallShape.lineTo(4.5, height); wallShape.lineTo(-4.5, height); wallShape.closePath();
  wallShape.holes.push(archPath(new THREE.Path(), ROOM.win.x, ROOM.win.w, ROOM.win.sill, ROOM.win.h, true));
  wallShape.holes.push(archPath(new THREE.Path(), ROOM.arch.x, ROOM.arch.w, ROOM.arch.sill + 0.001, ROOM.arch.h, true));
  const wallGeo = new THREE.ExtrudeGeometry(wallShape, { depth: wallT, bevelEnabled: false, curveSegments: 24 });
  boxUV(wallGeo, 'y');
  const wall = mesh(wallGeo, mat.plaster, 'parede_fundo');
  wall.position.z = backZ - wallT;
  root.add(wall);
  // rodapé de madeira escura
  const base = mesh(boxUV(new RoundedBoxGeometry(2.6, 0.12, 0.03, 2, 0.006), 'x'), mat.darkWood, 'rodape');
  base.position.set(-2.75 + 1.3 + 0.0, 0.06, backZ + 0.015);
  root.add(base);

  // Parede lateral esquerda com janela (motiva a luz de preenchimento pela esquerda).
  const sideShape = new THREE.Shape();
  sideShape.moveTo(-2.1, 0); sideShape.lineTo(2.1, 0); sideShape.lineTo(2.1, height); sideShape.lineTo(-2.1, height); sideShape.closePath();
  sideShape.holes.push(archPath(new THREE.Path(), -ROOM.side.z + (backZ + 2.1), ROOM.side.w, ROOM.side.sill, ROOM.side.h, true));
  const sideGeo = new THREE.ExtrudeGeometry(sideShape, { depth: wallT, bevelEnabled: false, curveSegments: 20 });
  boxUV(sideGeo, 'y');
  const side = mesh(sideGeo, mat.plasterShade, 'parede_lateral');
  side.rotation.y = Math.PI / 2;
  side.position.set(ROOM.leftX - wallT, 0, backZ + 2.1);
  root.add(side);
  const sideGlass = new THREE.Mesh(new THREE.ShapeGeometry(archPath(new THREE.Shape(), -ROOM.side.z + (backZ + 2.1), ROOM.side.w, ROOM.side.sill, ROOM.side.h, true), 20), mat.glass);
  sideGlass.rotation.y = Math.PI / 2;
  sideGlass.position.set(ROOM.leftX - wallT * 0.5, 0, backZ + 2.1);
  sideGlass.name = 'janela_lateral_vidro';
  root.add(sideGlass);

  // Teto com vigas aparentes (aparece no alto do quadro e fecha a luz).
  const ceiling = mesh(new THREE.BoxGeometry(9, 0.1, 4.6), mat.plasterShade, 'teto', false);
  ceiling.position.set(0, height + 0.05, backZ + 2.3);
  root.add(ceiling);
  const beamGeo = boxUV(new RoundedBoxGeometry(0.16, 0.2, 4.6, 2, 0.02), 'z');
  for (let i = 0; i < 5; i++) {
    const b = mesh(beamGeo, mat.darkWood, 'viga');
    b.position.set(-3 + i * 1.5, height - 0.1, backZ + 2.3);
    root.add(b);
  }

  // Janela gradeada: caixilho de madeira + grade de ferro + vidro.
  const win = new THREE.Group();
  win.name = 'janela';
  const { x: wx, w: ww, sill: ws, h: wh } = ROOM.win;
  const frameParts: THREE.BufferGeometry[] = [];
  const bar = (w: number, h: number, x: number, y: number) => {
    const g = boxUV(new RoundedBoxGeometry(w, h, 0.05, 2, 0.006), h > w ? 'y' : 'x');
    g.translate(x, y, 0);
    frameParts.push(g);
  };
  bar(ww + 0.06, 0.06, wx, ws + 0.03);
  bar(0.05, wh - ww / 2, wx - ww / 2 + 0.025, ws + (wh - ww / 2) / 2);
  bar(0.05, wh - ww / 2, wx + ww / 2 - 0.025, ws + (wh - ww / 2) / 2);
  bar(0.04, wh, wx, ws + wh / 2);
  for (let i = 1; i < 4; i++) bar(ww, 0.035, wx, ws + (i * (wh - ww / 2)) / 4 + 0.04);
  const frame = mesh(mergeGeometries(frameParts)!, mat.darkWood, 'janela_caixilho');
  frame.position.z = backZ - wallT * 0.55;
  win.add(frame);
  // arco do caixilho
  const archCurve = new THREE.EllipseCurve(wx, ws + wh - ww / 2, ww / 2 - 0.025, ww / 2 - 0.025, 0, Math.PI, false);
  const archPts = archCurve.getPoints(32).map((p) => new THREE.Vector3(p.x, p.y, 0));
  const archTube = mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(archPts), 48, 0.022, 8), mat.darkWood, 'janela_arco');
  archTube.position.z = backZ - wallT * 0.55;
  win.add(archTube);
  const glassGeo = new THREE.ShapeGeometry(archPath(new THREE.Shape(), wx, ww, ws, wh, true), 24);
  const glass = new THREE.Mesh(glassGeo, mat.glass);
  glass.name = 'janela_vidro';
  glass.position.z = backZ - wallT * 0.55 - 0.01;
  win.add(glass);
  // peitoril de madeira com vasos
  const sill = mesh(boxUV(new RoundedBoxGeometry(ww + 0.25, 0.045, wallT + 0.12, 2, 0.01), 'x'), mat.tableWood, 'peitoril');
  sill.position.set(wx, ws - 0.02, backZ - wallT / 2 + 0.06);
  win.add(sill);
  const v1 = buildLavenderVase(mat, 3, 0.85);
  v1.position.set(wx - 0.28, ws, backZ - 0.03);
  const pot = mesh(shellLathe([[0.05, 0], [0.06, 0.06], [0.065, 0.09]], 0.006, 24), mat.terracotta, 'vaso_barro');
  pot.position.set(wx + 0.3, ws, backZ - 0.05);
  win.add(v1, pot);
  root.add(win);

  // Arco direito: moldura de pedra clara (aduelas) e soleira.
  const archFrame = new THREE.Shape();
  const { x: ax, w: aw, h: ah } = ROOM.arch;
  const ro = aw / 2 + 0.12, ri = aw / 2;
  archFrame.moveTo(ax - ro, 0); archFrame.lineTo(ax - ro, ah - ri); archFrame.absarc(ax, ah - ri, ro, Math.PI, 0, true);
  archFrame.lineTo(ax + ro, 0); archFrame.lineTo(ax + ri, 0); archFrame.lineTo(ax + ri, ah - ri);
  archFrame.absarc(ax, ah - ri, ri, 0, Math.PI, false); archFrame.lineTo(ax - ri, 0); archFrame.closePath();
  const afGeo = new THREE.ExtrudeGeometry(archFrame, { depth: 0.06, bevelEnabled: true, bevelSize: 0.012, bevelThickness: 0.012, bevelSegments: 2, curveSegments: 24 });
  boxUV(afGeo, 'y');
  const af = mesh(afGeo, mat.plasterShade, 'arco_moldura');
  af.position.z = backZ - 0.02;
  root.add(af);

  // Terraço: guarda-corpo baixo de madeira e pérgula com hera.
  const terrace = new THREE.Group();
  terrace.name = 'terraco';
  const tfloor = mesh(new THREE.BoxGeometry(5, 0.06, 2.2), mat.floor, 'terraco_piso', false);
  tfloor.position.set(1.8, -0.03, backZ - wallT - 1.1);
  terrace.add(tfloor);
  const railParts: THREE.BufferGeometry[] = [];
  for (let i = 0; i < 14; i++) {
    const p = boxUV(new RoundedBoxGeometry(0.05, 0.85, 0.05, 2, 0.008), 'y');
    p.translate(0.3 + i * 0.25, 0.425, backZ - wallT - 2.0);
    railParts.push(p);
  }
  const top = boxUV(new RoundedBoxGeometry(3.4, 0.06, 0.08, 2, 0.01), 'x');
  top.translate(1.95, 0.88, backZ - wallT - 2.0);
  railParts.push(top);
  terrace.add(mesh(mergeGeometries(railParts)!, mat.tableWood, 'guarda_corpo'));
  root.add(terrace);

  // ---------- Paisagem: campo de lavanda, colinas, ciprestes, céu ----------
  const outside = new THREE.Group();
  outside.name = 'paisagem';
  const sky = new THREE.Mesh(
    new THREE.SphereGeometry(60, 32, 16),
    new THREE.ShaderMaterial({
      name: 'ceu',
      side: THREE.BackSide,
      depthWrite: false,
      uniforms: { uTop: { value: new THREE.Color('#7FA7C9') }, uHorizon: { value: new THREE.Color('#F4D9A6') }, uSun: { value: new THREE.Vector3(0.758, 0.172, -0.63).normalize() } },
      vertexShader: 'varying vec3 vDir; void main(){ vDir = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
      fragmentShader: `uniform vec3 uTop; uniform vec3 uHorizon; uniform vec3 uSun; varying vec3 vDir;
        void main(){ float h = clamp(vDir.y*1.6+0.08,0.0,1.0); vec3 c = mix(uHorizon, uTop, pow(h,0.7));
        float s = max(dot(normalize(vDir), uSun),0.0); c += vec3(1.0,0.85,0.6)*pow(s,24.0)*0.9 + vec3(1.0,0.8,0.55)*pow(s,4.0)*0.18;
        gl_FragColor = vec4(c,1.0);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
        }`,
    }),
  );
  sky.name = 'ceu';
  outside.add(sky);

  // Chão do campo.
  const fieldGeo = new THREE.PlaneGeometry(40, 30, 40, 30);
  fieldGeo.rotateX(-Math.PI / 2);
  const fpos = fieldGeo.getAttribute('position');
  for (let i = 0; i < fpos.count; i++) {
    const x = fpos.getX(i), z = fpos.getZ(i);
    const far = Math.max(0, -z - 4) / 12;
    fpos.setY(i, -0.35 + Math.sin(x * 0.3) * 0.15 * far + far * far * 1.2);
  }
  fieldGeo.computeVertexNormals();
  const fieldMat = new THREE.MeshStandardMaterial({ name: 'campo', map: hillTexture(3, '#7A6A4A', '#5E6B3C'), roughness: 1 });
  fieldMat.map!.repeat.set(6, 6);
  const field = mesh(fieldGeo, fieldMat, 'campo_chao', false);
  field.position.set(2, 0, backZ - 17);
  outside.add(field);

  // Fileiras de lavanda: cartões cruzados instanciados com alfa.
  const card = new THREE.PlaneGeometry(0.42, 0.62);
  card.translate(0, 0.31, 0);
  const card2 = card.clone().rotateY(Math.PI / 2);
  const cross = mergeGeometries([card, card2])!;
  const lavMat = new THREE.MeshStandardMaterial({ name: 'lavanda_campo', map: lavenderCardTexture(8), alphaTest: 0.45, side: THREE.DoubleSide, roughness: 0.9 });
  const rows = lite ? 9 : 14;
  const perRow = lite ? 60 : 110;
  const lav = new THREE.InstancedMesh(cross, lavMat, rows * perRow);
  lav.name = 'campo_lavanda';
  const m = new THREE.Matrix4();
  let k = 0;
  for (let r = 0; r < rows; r++) {
    const z = backZ - wallT - 2.6 - r * 0.95;
    const far = Math.max(0, -z - 4) / 12;
    for (let i = 0; i < perRow; i++) {
      const x = -4 + (i / perRow) * 16 + (rnd() - 0.5) * 0.12;
      const s = 0.8 + rnd() * 0.45 + r * 0.03;
      m.compose(new THREE.Vector3(x, -0.3 + far * far * 1.2 + Math.sin(x * 0.3) * 0.15 * far, z + (rnd() - 0.5) * 0.2),
        new THREE.Quaternion().setFromEuler(new THREE.Euler(0, rnd() * Math.PI, 0)), new THREE.Vector3(s, s, s));
      lav.setMatrixAt(k++, m);
    }
  }
  lav.count = k;
  lav.castShadow = false;
  lav.receiveShadow = true;
  outside.add(lav);

  // Colinas distantes em camadas de névoa atmosférica.
  const hillColors: [string, string, number, number][] = [['#8EA0A6', '#B7B7A0', -26, 3.2], ['#7F8F6A', '#A6A57A', -20, 2.2], ['#6E7B4F', '#94925F', -15, 1.3]];
  hillColors.forEach(([a, b, z, hh], i) => {
    const hg = new THREE.PlaneGeometry(60, 8, 80, 1);
    const hp = hg.getAttribute('position');
    for (let v = 0; v < hp.count; v++) {
      if (hp.getY(v) > 0) {
        const x = hp.getX(v);
        hp.setY(v, hh * (0.55 + 0.45 * Math.sin(x * 0.11 + i * 2.1) * Math.cos(x * 0.05 + i)) + Math.sin(x * 0.7 + i) * 0.12);
      } else hp.setY(v, -2);
    }
    hg.computeVertexNormals();
    const hm = new THREE.MeshBasicMaterial({ name: `colina_${i}`, map: hillTexture(20 + i, a, b), fog: false });
    const hill = new THREE.Mesh(hg, hm);
    hill.name = `colina_${i}`;
    hill.position.set(3, -0.2, backZ + z);
    outside.add(hill);
  });

  // Ciprestes (lathe alongado) e oliveiras como silhuetas de média distância.
  const cyp = lathe([[0, 0], [0.05, 0], [0.05, 0.2], [0.32, 0.6], [0.36, 1.6], [0.25, 2.8], [0.08, 3.6], [0, 3.8]], 10);
  const cypMat = new THREE.MeshStandardMaterial({ name: 'cipreste', color: '#3E4E2C', roughness: 1 });
  const cyps = new THREE.InstancedMesh(cyp, cypMat, 9);
  cyps.name = 'ciprestes';
  for (let i = 0; i < 9; i++) {
    const s = 0.7 + rnd() * 0.6;
    m.compose(new THREE.Vector3(-3 + i * 1.6 + rnd(), -0.2 + i * 0.05, backZ - 11 - rnd() * 4), new THREE.Quaternion(), new THREE.Vector3(s, s * (0.9 + rnd() * 0.4), s));
    cyps.setMatrixAt(i, m);
  }
  outside.add(cyps);
  root.add(outside);

  // ---------- Prateleira à esquerda com novelos e potes ----------
  const shelf = new THREE.Group();
  shelf.name = 'prateleira';
  for (let i = 0; i < 3; i++) {
    const board = mesh(boxUV(new RoundedBoxGeometry(1.05, 0.035, 0.32, 2, 0.008), 'x'), mat.tableWood, 'prateleira_tabua');
    board.position.set(0, 0.55 + i * 0.48, 0);
    shelf.add(board);
  }
  for (const sx of [-1, 1]) {
    const up = mesh(boxUV(new RoundedBoxGeometry(0.04, 1.6, 0.3, 2, 0.008), 'y'), mat.tableWood, 'prateleira_lateral');
    up.position.set(sx * 0.52, 0.8, 0);
    shelf.add(up);
  }
  const ids = ['telha', 'linho', 'telha', 'areia', 'mostarda', 'telha', 'linho', 'salvia'];
  ids.forEach((id, i) => {
    const b = buildYarnBall(mat, id, i + 3, 0.06, true);
    const row = i < 4 ? 0 : 1;
    b.position.set(-0.36 + (i % 4) * 0.2, 0.5675 + row * 0.48 + 0.06, (i % 2) * 0.04 - 0.02);
    shelf.add(b);
  });
  for (let i = 0; i < 3; i++) {
    const s = buildSpool(mat, ['mostarda', 'salvia', 'lavanda'][i], 0.11);
    s.position.set(-0.3 + i * 0.12, 1.5275, 0.02);
    shelf.add(s);
  }
  const jar = mesh(shellLathe([[0.06, 0], [0.08, 0.05], [0.08, 0.16], [0.05, 0.2], [0.055, 0.22]], 0.006, 28), mat.ceramicBlue, 'jarro');
  jar.position.set(0.3, 1.5275, 0);
  shelf.add(jar);
  shelf.position.set(-2.05, 0, backZ + 0.2);
  root.add(shelf);

  // ---------- Tapeçaria de parede (losangos telha/creme) ----------
  const hanging = new THREE.Group();
  hanging.name = 'tapecaria_parede';
  const hc = document.createElement('canvas');
  hc.width = 256; hc.height = 384;
  const hx = hc.getContext('2d')!;
  hx.fillStyle = '#E9DFC9'; hx.fillRect(0, 0, 256, 384);
  for (let y = 0; y < 384; y += 4) {
    for (let x = 0; x < 256; x += 4) {
      const d = Math.abs(((x - 128) / 128)) + Math.abs(((y % 128) - 64) / 64);
      const v = y < 260 ? (d < 0.55 ? '#AA584D' : d < 0.75 ? '#E9DFC9' : d < 1.1 ? '#8E4439' : '#E9DFC9') : (Math.floor(y / 16) % 2 ? '#536E68' : '#D7B86D');
      hx.fillStyle = v;
      hx.fillRect(x + ((y / 4) % 2), y, 4, 4);
      hx.fillStyle = 'rgba(0,0,0,0.08)';
      hx.fillRect(x, y + 3, 4, 1);
    }
  }
  const ht = new THREE.CanvasTexture(hc);
  ht.colorSpace = THREE.SRGBColorSpace;
  ht.anisotropy = 4;
  const hMat = new THREE.MeshStandardMaterial({ name: 'tapecaria', map: ht, normalMap: mat.fiber.normalMap, normalScale: new THREE.Vector2(0.6, 0.6), roughness: 0.95 });
  const panelGeo = new THREE.PlaneGeometry(0.46, 0.66, 1, 12);
  const pp = panelGeo.getAttribute('position');
  for (let i = 0; i < pp.count; i++) pp.setZ(i, Math.sin((pp.getY(i) + 0.33) * 4) * 0.006);
  panelGeo.computeVertexNormals();
  const panel = mesh(panelGeo, hMat, 'tapecaria_painel');
  hanging.add(panel);
  const rod = mesh(scaleUV(new THREE.CylinderGeometry(0.011, 0.011, 0.6, 12), 0.07, 0.6), mat.loomWood, 'tapecaria_vara');
  rod.rotation.z = Math.PI / 2;
  rod.position.y = 0.34;
  hanging.add(rod);
  const fringeGeo = new THREE.CylinderGeometry(0.0022, 0.0014, 0.12, 4);
  fringeGeo.translate(0, -0.06, 0);
  const fringe = new THREE.InstancedMesh(fringeGeo, mat.warp, 30);
  fringe.name = 'tapecaria_franja';
  for (let i = 0; i < 30; i++) { m.makeRotationZ((rnd() - 0.5) * 0.15).setPosition(-0.22 + i * 0.0152, -0.33, 0.003); fringe.setMatrixAt(i, m); }
  hanging.add(fringe);
  hanging.position.set(-0.5, 2.08, backZ + 0.02);
  root.add(hanging);

  // ---------- Hera: ramos pendentes com folhas (cartões instanciados) ----------
  const leafMat = new THREE.MeshStandardMaterial({ name: 'folha_hera', map: leafTexture(), alphaTest: 0.5, side: THREE.DoubleSide, roughness: 0.7 });
  const leafGeo = new THREE.PlaneGeometry(0.07, 0.07);
  const vines: [THREE.Vector3, THREE.Vector3, number][] = [
    [new THREE.Vector3(ROOM.arch.x - 0.8, 3.2, backZ + 0.05), new THREE.Vector3(ROOM.arch.x - 0.65, 2.25, backZ + 0.08), 40],
    [new THREE.Vector3(ROOM.arch.x + 0.75, 3.2, backZ + 0.05), new THREE.Vector3(ROOM.arch.x + 0.82, 1.6, backZ + 0.08), 60],
    [new THREE.Vector3(ROOM.win.x - 0.7, 3.25, backZ + 0.05), new THREE.Vector3(ROOM.win.x - 0.62, 2.0, backZ + 0.08), 45],
    [new THREE.Vector3(-1.8, 3.3, 1.2), new THREE.Vector3(-1.55, 2.62, 1.3), 38],
    [new THREE.Vector3(1.2, 3.3, 1.0), new THREE.Vector3(1.0, 2.75, 1.05), 30],
  ];
  const totalLeaves = vines.reduce((a, v) => a + v[2], 0) + 160;
  const leaves = new THREE.InstancedMesh(leafGeo, leafMat, totalLeaves);
  leaves.name = 'hera_folhas';
  const stemParts: THREE.BufferGeometry[] = [];
  let li = 0;
  const q = new THREE.Quaternion();
  for (const [a, b, count] of vines) {
    const mid = a.clone().lerp(b, 0.5).add(new THREE.Vector3((rnd() - 0.5) * 0.3, 0, 0.1));
    const curve = new THREE.CatmullRomCurve3([a, mid, b]);
    stemParts.push(new THREE.TubeGeometry(curve, 20, 0.004, 4));
    for (let i = 0; i < count; i++) {
      const t = i / count;
      const p = curve.getPointAt(t);
      p.x += (rnd() - 0.5) * 0.12; p.z += (rnd() - 0.2) * 0.08; p.y += (rnd() - 0.5) * 0.05;
      q.setFromEuler(new THREE.Euler((rnd() - 0.5) * 1.2, (rnd() - 0.5) * 1.5, rnd() * Math.PI * 2));
      const s = 0.7 + rnd() * 0.7;
      m.compose(p, q, new THREE.Vector3(s, s, s));
      leaves.setMatrixAt(li++, m);
    }
  }
  // Ramagem ao longo do alto da parede do fundo.
  for (let i = 0; i < 160; i++) {
    const p = new THREE.Vector3(-3.5 + rnd() * 7, 3.0 + rnd() * 0.3, backZ + 0.06 + rnd() * 0.12);
    q.setFromEuler(new THREE.Euler((rnd() - 0.5), (rnd() - 0.5), rnd() * Math.PI * 2));
    const s = 0.8 + rnd() * 0.8;
    m.compose(p, q, new THREE.Vector3(s, s, s));
    leaves.setMatrixAt(li++, m);
  }
  leaves.count = li;
  leaves.castShadow = true;
  root.add(leaves);
  root.add(mesh(mergeGeometries(stemParts)!, new THREE.MeshStandardMaterial({ color: '#5A4A32', roughness: 0.9 }), 'hera_ramos'));

  // ---------- Fachos de luz (desaparecem perto da câmera) ----------
  const beamMat = new THREE.ShaderMaterial({
    name: 'facho_luz',
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
    uniforms: { uColor: { value: new THREE.Color('#FFD9A0') }, uIntensity: { value: 0.16 }, uTime: { value: 0 } },
    vertexShader: `varying vec2 vUv; varying float vCamDist; void main(){ vUv = uv; vec4 mv = modelViewMatrix * vec4(position,1.0); vCamDist = -mv.z; gl_Position = projectionMatrix * mv; }`,
    fragmentShader: `uniform vec3 uColor; uniform float uIntensity; uniform float uTime; varying vec2 vUv; varying float vCamDist;
      void main(){ float edge = smoothstep(0.0,0.25,vUv.x)*smoothstep(1.0,0.75,vUv.x);
        float along = smoothstep(0.0,0.2,vUv.y)*smoothstep(1.0,0.55,vUv.y);
        float near = smoothstep(0.6,1.8,vCamDist);
        float flick = 0.92 + 0.08*sin(uTime*0.4 + vUv.x*6.0);
        gl_FragColor = vec4(uColor * uIntensity * edge * along * near * flick, 1.0); }`,
  });
  const beams: THREE.Mesh[] = [];
  const mkBeam = (from: THREE.Vector3, to: THREE.Vector3, w: number) => {
    const len = from.distanceTo(to);
    const g = new THREE.PlaneGeometry(w, len);
    g.translate(0, -len / 2, 0);
    const b = new THREE.Mesh(g, beamMat);
    b.position.copy(from);
    b.lookAt(to);
    b.rotateX(Math.PI / 2);
    b.name = 'facho';
    b.renderOrder = 5;
    beams.push(b);
    root.add(b);
  };
  mkBeam(new THREE.Vector3(ROOM.arch.x + 0.1, 2.2, backZ - 0.1), new THREE.Vector3(0.4, 0.0, 0.6), 1.1);
  mkBeam(new THREE.Vector3(ROOM.arch.x - 0.3, 1.8, backZ - 0.1), new THREE.Vector3(-0.2, 0.2, 0.9), 0.8);
  mkBeam(new THREE.Vector3(ROOM.win.x, 2.0, backZ - 0.1), new THREE.Vector3(-1.9, 0.0, 0.4), 0.7);

  // ---------- Poeira e fibras em suspensão ----------
  const dustCount = lite ? 120 : 320;
  const dGeo = new THREE.BufferGeometry();
  const dp = new Float32Array(dustCount * 3);
  const seeds = new Float32Array(dustCount);
  for (let i = 0; i < dustCount; i++) {
    dp[i * 3] = -1.5 + rnd() * 3.8; dp[i * 3 + 1] = 0.6 + rnd() * 2.2; dp[i * 3 + 2] = backZ + 0.2 + rnd() * 2.2;
    seeds[i] = rnd() * 100;
  }
  dGeo.setAttribute('position', new THREE.BufferAttribute(dp, 3));
  dGeo.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1));
  const dMat = new THREE.ShaderMaterial({
    name: 'poeira',
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: { uTime: { value: 0 }, uScale: { value: 300 } },
    vertexShader: `attribute float aSeed; uniform float uTime; uniform float uScale; varying float vA;
      void main(){ vec3 p = position; p.y += sin(uTime*0.1 + aSeed)*0.08; p.x += sin(uTime*0.07 + aSeed*1.7)*0.12; p.z += cos(uTime*0.05 + aSeed)*0.06;
        vec4 mv = modelViewMatrix * vec4(p,1.0); gl_PointSize = uScale * (0.006 + fract(aSeed)*0.006) / -mv.z;
        vA = smoothstep(0.5, 1.6, -mv.z) * (0.4 + 0.6*fract(aSeed*3.1)); gl_Position = projectionMatrix * mv; }`,
    fragmentShader: `varying float vA; void main(){ vec2 c = gl_PointCoord - 0.5; float d = length(c); float a = smoothstep(0.5,0.0,d) * vA; gl_FragColor = vec4(vec3(1.0,0.9,0.72)*a*0.5, 1.0); }`,
  });
  const dust = new THREE.Points(dGeo, dMat);
  dust.name = 'poeira_fibras';
  dust.frustumCulled = false;
  root.add(dust);

  const update = (t: number) => {
    beamMat.uniforms.uTime.value = t;
    dMat.uniforms.uTime.value = t;
    dMat.uniforms.uScale.value = innerHeight * 0.6;
  };
  return { root, beams, dust, update };
}
