import * as THREE from '../../../shared/vendor/three.module.js';
import { CONFIG, rng } from './config.js';
import { buildPortalMatrix, computePortalTransform } from './physics.js';

/**
 * Constrói o museu monumental completo (Hub + 5 Salas conectadas), usando InstancedMesh
 * para juntas, degraus, pilares e vegetação dos jardins suspensos, além de RenderTargets
 * para portais espaciais e espelhos planares sem recursão.
 */
export function createMuseumWorld(scene, mats, physics) {
  const disposables = [];
  const trackGeo = g => {
    disposables.push(g);
    return g;
  };

  const unitBox = trackGeo(new THREE.BoxGeometry(1, 1, 1));
  const unitCyl = trackGeo(new THREE.CylinderGeometry(1, 1, 1, 16, 1));
  const unitSphere = trackGeo(new THREE.SphereGeometry(1, 14, 10));
  const unitCone = trackGeo(new THREE.ConeGeometry(1, 1, 10));

  function addMesh(parent, geo, mat, pos = [0, 0, 0], scale = [1, 1, 1], shadow = true) {
    const m = new THREE.Mesh(geo, mat);
    m.position.fromArray(pos);
    m.scale.fromArray(scale);
    m.castShadow = shadow;
    m.receiveShadow = shadow;
    parent.add(m);
    return m;
  }

  function addBox(parent, mat, x, y, z, w, h, d, shadow = true) {
    return addMesh(parent, unitBox, mat, [x, y, z], [w, h, d], shadow);
  }

  function addBeam(parent, mat, from, to, r) {
    const a = new THREE.Vector3(...from);
    const b = new THREE.Vector3(...to);
    const d = b.clone().sub(a);
    const len = d.length();
    const m = new THREE.Mesh(unitCyl, mat);
    m.position.copy(a).lerp(b, 0.5);
    m.scale.set(r, len, r);
    m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.normalize());
    m.castShadow = true;
    m.receiveShadow = true;
    parent.add(m);
    return m;
  }

  function addBatch(parent, geo, mat, items, shadow = true) {
    if (!items.length) return null;
    const inst = new THREE.InstancedMesh(geo, mat, items.length);
    const dummy = new THREE.Object3D();
    const color = new THREE.Color();
    let hasColor = false;
    items.forEach((it, idx) => {
      dummy.position.set(it.x, it.y, it.z);
      dummy.scale.set(it.sx ?? 1, it.sy ?? 1, it.sz ?? 1);
      dummy.rotation.set(it.rx ?? 0, it.ry ?? 0, it.rz ?? 0);
      dummy.updateMatrix();
      inst.setMatrixAt(idx, dummy.matrix);
      if (it.color !== undefined) {
        hasColor = true;
        inst.setColorAt(idx, color.set(it.color));
      }
    });
    inst.instanceMatrix.needsUpdate = true;
    if (hasColor && inst.instanceColor) inst.instanceColor.needsUpdate = true;
    inst.castShadow = shadow;
    inst.receiveShadow = shadow;
    parent.add(inst);
    return inst;
  }

  // ---------- Atmospheric Sky, Fog, Sun & Fill Lights ----------
  scene.background = new THREE.Color(0x475a75);
  scene.fog = new THREE.FogExp2(0x475a75, 0.0135);

  const hemi = new THREE.HemisphereLight(0xa7c8f5, 0x6b5842, 1.35);
  scene.add(hemi);

  const sun = new THREE.DirectionalLight(0xffead1, 3.05);
  sun.position.set(-14, 24, 14);
  sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024);
  sun.shadow.bias = -0.0004;
  sun.shadow.normalBias = 0.03;
  sun.shadow.camera.near = 2;
  sun.shadow.camera.far = 75;
  sun.shadow.camera.left = -22;
  sun.shadow.camera.right = 22;
  sun.shadow.camera.top = 22;
  sun.shadow.camera.bottom = -22;
  scene.add(sun);
  scene.add(sun.target);

  const rim = new THREE.DirectionalLight(0x98bcff, 0.85);
  rim.position.set(16, 12, -18);
  scene.add(rim);

  // Subtle volumetric light shafts matching cena.png
  const godrayGroup = new THREE.Group();
  scene.add(godrayGroup);
  const rayGeo = trackGeo(new THREE.CylinderGeometry(0.9, 3.4, 26, 16, 1, true));
  for (const [rx, ry, rz] of [[-2.5, 9.5, -18], [1.2, 10.5, -28], [-25, 9.0, -8], [26, 9.0, -4]]) {
    const shaft = new THREE.Mesh(rayGeo, mats.godrayMat);
    shaft.position.set(rx, ry, rz);
    shaft.rotation.z = -0.26;
    shaft.rotation.x = 0.14;
    godrayGroup.add(shaft);
  }

  // Deep chasm base floor far below
  addBox(scene, mats.concrete, 0, -14, -20, 120, 1.0, 120, false);

  // Collectors for instancing
  const seamTiles = [];
  const columnShafts = [];
  const columnBases = [];
  const columnCaps = [];
  const glassSlits = [];
  const gardenLeaves = [];

  const rand = rng(CONFIG.seed);

  function queueFloorGrid(x0, z0, xCount, zCount, y = 0.012, tileW = 1.25, tileD = 1.25) {
    const shades = [0xefe4d4, 0xe4d5be, 0xd8c6ad, 0xe9dbc7];
    for (let j = 0; j < zCount; j++) {
      for (let i = 0; i < xCount; i++) {
        const x = x0 + (i - (xCount - 1) / 2) * tileW;
        const z = z0 + (j - (zCount - 1) / 2) * tileD;
        seamTiles.push({
          x,
          y,
          z,
          sx: tileW - 0.035,
          sy: 0.03,
          sz: tileD - 0.035,
          color: shades[Math.floor(rand() * shades.length)],
        });
      }
    }
  }

  function queueColumn(x, y, z, h = 6.8) {
    columnShafts.push({ x, y: y + h * 0.5, z, sx: 0.62, sy: h, sz: 0.74 });
    columnBases.push({ x, y: y + 0.24, z, sx: 0.94, sy: 0.48, sz: 1.02 });
    columnCaps.push({ x, y: y + h - 0.18, z, sx: 0.88, sy: 0.34, sz: 1.04 });
    glassSlits.push({ x: x - Math.sign(x || 1) * 0.33, y: y + h * 0.54, z, sx: 0.05, sy: h * 0.44, sz: 0.12 });
  }

  function addArch(parent, x, y, z, width = 5.0, height = 6.4, ry = 0) {
    const g = new THREE.Group();
    g.position.set(x, y, z);
    g.rotation.y = ry;
    parent.add(g);
    const half = width * 0.5;
    const wallH = height * 0.56;
    addBox(g, mats.travertine, -half, wallH * 0.5, 0, 0.88, wallH, 0.96);
    addBox(g, mats.travertine, half, wallH * 0.5, 0, 0.88, wallH, 0.96);
    addBox(g, mats.concrete, -half, 0.22, 0, 1.08, 0.44, 1.15);
    addBox(g, mats.concrete, half, 0.22, 0, 1.08, 0.44, 1.15);
    const voussoir = [];
    for (let i = 0; i <= 12; i++) {
      const a = (i / 12) * Math.PI;
      const r = half;
      voussoir.push({
        x: Math.cos(a) * r,
        y: wallH + Math.sin(a) * r * 0.88,
        z: 0,
        sx: 0.46,
        sy: 0.68,
        sz: 0.92,
        rz: a - Math.PI / 2,
      });
    }
    addBatch(g, unitBox, mats.travertine, voussoir);
    return g;
  }

  function addHangingPlanter(x, y, z) {
    addBox(scene, mats.travertine, x, y, z, 2.2, 0.42, 1.1);
    addBox(scene, mats.brass, x, y + 0.23, z, 2.26, 0.05, 1.16);
    for (let i = 0; i < 16; i++) {
      gardenLeaves.push({
        x: x + (rand() - 0.5) * 1.8,
        y: y + 0.35 + rand() * 0.55,
        z: z + (rand() - 0.5) * 0.75,
        sx: 0.22 + rand() * 0.24,
        sy: 0.28 + rand() * 0.42,
        sz: 0.22 + rand() * 0.24,
        ry: rand() * Math.PI * 2,
        color: [0x50764d, 0x678f5c, 0x456b49][i % 3],
      });
    }
  }

  function addPlaque(title, subtitle, x, y, z, w = 2.6, h = 0.58, ry = 0) {
    const tex = mats.createPlaqueTexture(title, subtitle);
    const mat = mats.trackMat(new THREE.MeshBasicMaterial({ map: tex, side: THREE.DoubleSide }));
    const plane = new THREE.Mesh(trackGeo(new THREE.PlaneGeometry(w, h)), mat);
    plane.position.set(x, y, z);
    plane.rotation.y = ry;
    scene.add(plane);
    return plane;
  }

  // =========================================================================
  // 0. HUB CENTRAL & SALA 1 — PONTE ANAMÓRFICA (z: +11.8 .. -12.8)
  // =========================================================================
  addBox(scene, mats.concrete, 0, -0.34, 6.2, 15.2, 0.68, 11.0); // South atrium slab
  queueFloorGrid(0, 6.2, 11, 8, 0.015, 1.32, 1.32);

  addBox(scene, mats.concrete, 0, -0.34, -8.1, 13.4, 0.68, 8.6); // North landing slab
  queueFloorGrid(0, -8.1, 10, 6, 0.015, 1.28, 1.34);

  // Forecourt curved brass balustrade & foreground wheel (cena.png focal!)
  const wheelGroup = new THREE.Group();
  wheelGroup.position.set(0, 0.02, 5.4);
  scene.add(wheelGroup);
  addMesh(wheelGroup, trackGeo(new THREE.CylinderGeometry(0.95, 1.05, 0.14, 24)), mats.brass, [0, 0.07, 0]);
  addMesh(wheelGroup, trackGeo(new THREE.TorusGeometry(0.68, 0.05, 10, 28)), mats.brass, [0, 0.25, 0]).rotation.x = Math.PI / 2;
  addBox(wheelGroup, mats.darkBrass, 0, 0.45, 0, 0.12, 0.65, 0.12);
  addBox(wheelGroup, mats.brass, 0, 0.78, 0, 0.68, 0.07, 0.07);
  for (let i = -3; i <= 3; i++) {
    const ang = i * 0.24;
    const rx = Math.sin(ang) * 2.35;
    const rz = 6.35 - Math.cos(ang) * 0.7;
    addMesh(scene, unitCyl, mats.darkBrass, [rx, 0.48, rz], [0.04, 0.96, 0.04]);
  }
  const railCurve = new THREE.CatmullRomCurve3(
    Array.from({ length: 7 }, (_, i) => {
      const ang = (i - 3) * 0.24;
      return new THREE.Vector3(Math.sin(ang) * 2.35, 0.96, 6.35 - Math.cos(ang) * 0.7);
    })
  );
  addMesh(scene, trackGeo(new THREE.TubeGeometry(railCurve, 24, 0.045, 8, false)), mats.brass);

  // Colonnades left & right + tall sapphire arch window & armillary sphere (cena.png)
  for (const x of [-6.9, 6.9]) {
    for (let z = -11; z <= 10; z += 4.2) queueColumn(x, 0, z, 7.2);
    addBox(scene, mats.travertine, x, 7.35, -0.5, 0.92, 0.78, 25.5);
  }
  // Left arched sapphire window + rotating brass armillary sphere
  addArch(scene, -6.9, 0.8, 2.2, 2.8, 5.4, Math.PI / 2);
  addBox(scene, mats.sapphireGlass, -7.1, 3.3, 2.2, 0.12, 4.4, 2.35, false);
  const armillary = new THREE.Group();
  armillary.position.set(-6.55, 3.25, 2.2);
  scene.add(armillary);
  for (const [rx, ry, rz, r] of [[0, 0, 0, 0.86], [0.6, 0.7, 0, 0.68], [1.1, 0, 0.7, 0.5]]) {
    const ring = new THREE.Mesh(trackGeo(new THREE.TorusGeometry(r, 0.035, 10, 36)), mats.brass);
    ring.rotation.set(rx, ry, rz);
    armillary.add(ring);
  }
  addMesh(armillary, unitSphere, mats.brass, [0, 0, 0], [0.16, 0.16, 0.16]);

  // Embedded abutment hinges & glowing bridge status strips (cena.png)
  for (const z of [0.72, -3.86]) {
    addBox(scene, mats.darkBrass, 0, -0.36, z, 4.4, 0.36, 0.36);
    addMesh(scene, unitCyl, mats.brass, [-0.65, -0.32, z], [0.16, 0.52, 0.16]).rotation.z = Math.PI / 2;
    addMesh(scene, unitCyl, mats.brass, [0.65, -0.32, z], [0.16, 0.52, 0.16]).rotation.z = Math.PI / 2;
  }
  const bridgeStatusStrips = [
    addBox(scene, mats.amberGlow, -1.25, 0.025, 0.72, 0.22, 0.025, 0.26, false),
    addBox(scene, mats.amberGlow, 1.25, 0.025, 0.72, 0.22, 0.025, 0.26, false),
    addBox(scene, mats.amberGlow, -1.25, 0.025, -3.86, 0.22, 0.025, 0.26, false),
    addBox(scene, mats.amberGlow, 1.25, 0.025, -3.86, 0.22, 0.025, 0.26, false),
  ];

  // Rotating Bridge Group (2 cantilevered halves + handrails + pivot drum)
  const bridgeGroup = new THREE.Group();
  bridgeGroup.position.set(0, -0.1, -1.56);
  bridgeGroup.rotation.y = Math.PI / 2;
  scene.add(bridgeGroup);
  for (let i = 0; i < 10; i++) {
    addBox(bridgeGroup, mats.travertine, 0, 0, (i - 4.5) * 0.45, 1.72, 0.22, 0.42);
  }
  for (const x of [-0.9, 0.9]) {
    for (let i = 0; i < 6; i++) {
      addBox(bridgeGroup, mats.darkBrass, x, 0.42, (i - 2.5) * 0.76, 0.04, 0.82, 0.05);
    }
    addBeam(bridgeGroup, mats.brass, [x, 0.84, -2.1], [x, 0.84, 2.1], 0.042);
  }
  const bridgePivot = addMesh(scene, unitCyl, mats.brass, [0, -0.42, -1.56], [0.58, 0.62, 0.58]);
  const bridgeCenterGlow = addBox(bridgeGroup, mats.amberGlow, 0, 0.115, 0, 0.1, 0.015, 4.1, false);

  // Viewpoint medallion & high overhead arch plaque (clear of sightline!)
  const viewpointRing = new THREE.Mesh(trackGeo(new THREE.RingGeometry(0.68, 0.84, 40)), mats.trackMat(new THREE.MeshBasicMaterial({
    color: 0xffd289, transparent: true, opacity: 0.82, side: THREE.DoubleSide,
  })));
  viewpointRing.rotation.x = -Math.PI / 2;
  viewpointRing.position.set(0, 0.028, 3.8);
  scene.add(viewpointRing);
  addPlaque('PONTO DE OBSERVAÇÃO', 'Alinhe o eixo da ponte antes de cruzar', 0, 4.2, 0.6, 3.2, 0.64, 0);

  // Right-wall staircase & left overhanging canted staircase (signature Escher silhouette)
  function buildStairGroup(parent, count, dir) {
    const stepList = [];
    for (let i = 0; i < count; i++) {
      stepList.push({ x: 0, y: i * 0.2, z: i * 0.34 * dir, sx: 1.9, sy: 0.22, sz: 0.36 });
      if (i % 3 === 0) {
        addBox(parent, mats.darkBrass, -0.88, i * 0.2 + 0.48, i * 0.34 * dir, 0.04, 0.85, 0.04);
        addBox(parent, mats.darkBrass, 0.88, i * 0.2 + 0.48, i * 0.34 * dir, 0.04, 0.85, 0.04);
      }
    }
    addBatch(parent, unitBox, mats.travertine, stepList);
    addBeam(parent, mats.brass, [-0.88, 0.92, 0], [-0.88, 0.92 + (count - 1) * 0.2, (count - 1) * 0.34 * dir], 0.04);
    addBeam(parent, mats.brass, [0.88, 0.92, 0], [0.88, 0.92 + (count - 1) * 0.2, (count - 1) * 0.34 * dir], 0.04);
  }
  const cantedStairL = new THREE.Group();
  cantedStairL.position.set(-5.3, 2.8, -3.8);
  cantedStairL.rotation.z = Math.PI / 2.6;
  scene.add(cantedStairL);
  buildStairGroup(cantedStairL, 12, -1);

  const wallStairR = new THREE.Group();
  wallStairR.position.set(5.4, 0.3, -1.6);
  wallStairR.rotation.y = Math.PI / 2;
  wallStairR.rotation.z = 0.22;
  scene.add(wallStairR);
  buildStairGroup(wallStairR, 14, 1);

  // Distant Chasm Monumental Background (cena.png depth!)
  const bgSteps = [];
  const bgCols = [];
  for (let k = 0; k < 5; k++) {
    const depth = -14 - k * 9;
    const altY = -4 + (k % 2) * 3.5;
    bgCols.push({ x: -8.5 + (k % 2) * 2, y: altY + 4, z: depth, sx: 1.1, sy: 18, sz: 1.1 });
    bgCols.push({ x: 8.5 - (k % 2) * 2, y: altY + 5, z: depth, sx: 1.1, sy: 18, sz: 1.1 });
    for (let s = 0; s < 10; s++) {
      bgSteps.push({ x: -5 + s * 1.1, y: altY + s * 0.42, z: depth - 2, sx: 1.15, sy: 0.35, sz: 1.4 });
    }
  }
  addBatch(scene, unitBox, mats.concrete, bgCols, false);
  addBatch(scene, unitBox, mats.travertine, bgSteps, false);

  // =========================================================================
  // PASSARELA OESTE & SALA 2 — GALERIA DE PERSPECTIVAS (x: -34 .. -7.4)
  // =========================================================================
  addBox(scene, mats.concrete, -12.8, -0.34, 5.4, 11.4, 0.68, 4.0);
  queueFloorGrid(-12.8, 5.4, 8, 3, 0.015, 1.35, 1.28);
  addPlaque('SALA 2 · GALERIA DE PERSPECTIVAS', 'Caminhe a oeste →', -8.0, 3.0, 5.4, 2.5, 0.56, Math.PI / 2);
  addHangingPlanter(-12.8, 0.2, 3.2);
  addHangingPlanter(-12.8, 0.2, 7.6);

  // Pátio inferior Sala 2
  addBox(scene, mats.concrete, -26.0, -0.34, 2.8, 16.5, 0.68, 12.6);
  queueFloorGrid(-26.0, 2.8, 12, 9, 0.015, 1.32, 1.34);
  // Terraço elevado Sala 2 (y = 2.6)
  addBox(scene, mats.concrete, -26.0, 2.26, -16.5, 16.5, 0.68, 10.6);
  queueFloorGrid(-26.0, -16.5, 12, 8, 2.615, 1.32, 1.28);
  for (const x of [-33.5, -18.5]) {
    queueColumn(x, 0, 6.0, 7.4);
    queueColumn(x, 0, -1.5, 7.4);
    queueColumn(x, 2.6, -13.0, 6.2);
    queueColumn(x, 2.6, -20.0, 6.2);
  }
  addHangingPlanter(-21.0, 2.8, -19.5);
  addHangingPlanter(-31.0, 2.8, -19.5);

  const galleryViewRing = new THREE.Mesh(trackGeo(new THREE.RingGeometry(0.68, 0.84, 40)), mats.trackMat(new THREE.MeshBasicMaterial({
    color: 0xa8bfff, transparent: true, opacity: 0.82, side: THREE.DoubleSide,
  })));
  galleryViewRing.rotation.x = -Math.PI / 2;
  galleryViewRing.position.set(-26, 0.028, 0.5);
  scene.add(galleryViewRing);
  addPlaque('GALERIA ANAMÓRFICA', 'Alinhe os degraus suspensos do ponto azul', -26, 3.9, -2.8, 3.2, 0.62, 0);

  // Escada anamórfica rotativa Sala 2
  const galleryGroup = new THREE.Group();
  galleryGroup.position.set(-26, 1.3, -7.3);
  galleryGroup.rotation.y = Math.PI / 2;
  scene.add(galleryGroup);
  const gSteps = [];
  for (let i = 0; i < 14; i++) {
    const t = i / 13;
    gSteps.push({
      x: 0,
      y: THREE.MathUtils.lerp(-1.25, 1.32, t),
      z: THREE.MathUtils.lerp(4.0, -4.0, t),
      sx: 2.6,
      sy: 0.24,
      sz: 0.62,
    });
  }
  addBatch(galleryGroup, unitBox, mats.travertine, gSteps);
  const galleryStrip = addBox(galleryGroup, mats.amberGlow, 0, 0.15, 0, 0.12, 0.05, 8.2, false);
  galleryStrip.rotation.x = Math.atan2(2.57, 8.0);
  // Panoramic terrace marker
  const panoramaRing = new THREE.Mesh(trackGeo(new THREE.RingGeometry(0.65, 0.82, 36)), mats.trackMat(new THREE.MeshBasicMaterial({
    color: 0xffe29a, transparent: true, opacity: 0.85, side: THREE.DoubleSide,
  })));
  panoramaRing.rotation.x = -Math.PI / 2;
  panoramaRing.position.set(-26, 2.63, -15.5);
  scene.add(panoramaRing);
  addPlaque('TERRAÇO PANORÂMICO', 'Pressione E para vista panorâmica', -26, 4.4, -20.5, 3.1, 0.6, 0);

  // =========================================================================
  // PASSARELA LESTE & SALA 3 — ESCADA DE GRAVIDADE VARIÁVEL (x: +7.4 .. +34.2)
  // =========================================================================
  addBox(scene, mats.concrete, 12.8, -0.34, 5.4, 11.4, 0.68, 4.0);
  queueFloorGrid(12.8, 5.4, 8, 3, 0.015, 1.35, 1.28);
  addPlaque('SALA 3 · GRAVIDADE VARIÁVEL', '← Caminhe a leste', 8.0, 3.0, 5.4, 2.5, 0.56, -Math.PI / 2);

  // Vault floor, ceiling & east/west walls
  addBox(scene, mats.concrete, 26.0, -0.34, -1.5, 16.8, 0.68, 21.0);
  queueFloorGrid(26.0, -1.5, 12, 15, 0.015, 1.34, 1.34);
  addBox(scene, mats.travertine, 26.0, 12.15, -4.0, 16.5, 0.68, 16.5); // Teto caminhável (y=11.8)
  addBox(scene, mats.travertine, 34.0, 6.0, -4.0, 0.68, 12.4, 16.5); // Parede leste (x=33.6)
  addBox(scene, mats.travertine, 18.2, 6.0, -4.0, 0.68, 12.4, 16.5); // Parede oeste superior

  // Floor stair leading to East Wall pad
  const eastFloorStair = new THREE.Group();
  eastFloorStair.position.set(26.5, 0.1, -4.0);
  eastFloorStair.rotation.y = Math.PI / 2;
  scene.add(eastFloorStair);
  buildStairGroup(eastFloorStair, 10, 1);

  // Vertical staircase mounted on East Wall (walking "up" Y along X = 33.6!)
  const wallStairV = [];
  for (let i = 0; i < 16; i++) {
    wallStairV.push({ x: 33.4, y: 2.2 + i * 0.52, z: -4.0, sx: 0.45, sy: 0.24, sz: 3.4 });
  }
  addBatch(scene, unitBox, mats.travertine, wallStairV);
  addBeam(scene, mats.brass, [32.9, 2.2, -5.6], [32.9, 10.4, -5.6], 0.045);
  addBeam(scene, mats.brass, [32.9, 2.2, -2.4], [32.9, 10.4, -2.4], 0.045);

  // Inverted hanging arches & planters on ceiling
  addBox(scene, mats.emeraldGlow, 32.3, 1.92, -4.0, 1.4, 0.08, 1.8, false); // Pad Chão -> Parede
  addBox(scene, mats.emeraldGlow, 33.55, 10.6, -4.0, 0.08, 1.5, 1.8, false); // Pad Parede -> Teto
  addBox(scene, mats.emeraldGlow, 20.0, 11.74, -4.0, 1.5, 0.08, 1.8, false); // Pad Teto -> Chão
  addPlaque('SELOS GRAVITACIONAIS', 'Suba a escada e pressione E nas placas verdes', 26.0, 4.8, -10.8, 3.8, 0.68, 0);

  // =========================================================================
  // SALA 4 — CORREDOR DE PORTAIS (z: -15 .. -36)
  // =========================================================================
  addArch(scene, 0, 0, -10.9, 4.9, 6.4, 0);
  addBox(scene, mats.concrete, 0, -0.34, -25.4, 10.0, 0.68, 21.8);
  queueFloorGrid(0, -25.4, 7, 16, 0.015, 1.32, 1.32);
  // Elevated Orthogonal Gallery inside Room 4 (y = 4.2)
  addBox(scene, mats.concrete, 0, 3.92, -26.2, 16.2, 0.54, 5.6);
  addBox(scene, mats.brass, 0, 4.65, -23.5, 16.0, 0.06, 0.08);
  addBox(scene, mats.brass, 0, 4.65, -28.9, 16.0, 0.06, 0.08);
  for (let z = -34; z <= -16; z += 4.5) {
    queueColumn(-4.8, 0, z, 7.2);
    queueColumn(4.8, 0, z, 7.2);
  }
  addPlaque('CORREDOR DE PORTAIS', 'Portais preservam orientação por M_dest · R_180 · inv(M_src)', 0, 4.6, -15.3, 4.2, 0.64, Math.PI);

  // =========================================================================
  // SALA 5 — SALÃO DE ESPELHOS (z: -41 .. -59)
  // =========================================================================
  addBox(scene, mats.concrete, 0, -0.34, -50.0, 18.0, 0.68, 19.2);
  queueFloorGrid(0, -50.0, 13, 14, 0.015, 1.34, 1.34);
  for (let z = -58; z <= -42; z += 4) {
    queueColumn(-8.0, 0, z, 7.4);
    queueColumn(8.0, 0, z, 7.4);
  }
  // Central Obsidian & Brass Prism Pedestal with hidden glyph facing mirrors
  addBox(scene, mats.concrete, 0, 0.6, -50.0, 1.4, 1.2, 1.4);
  const prismGroup = new THREE.Group();
  prismGroup.position.set(0, 2.1, -50.0);
  scene.add(prismGroup);
  addMesh(prismGroup, trackGeo(new THREE.OctahedronGeometry(0.68, 0)), mats.brass, [0, 0, 0], [1, 1.4, 1]);
  const secretGlyph = addBox(prismGroup, mats.amberGlow, 0, 0, 0.56, 0.45, 0.65, 0.06, false);
  addPlaque('SALÃO DE ESPELHOS', 'Compare o prisma nos reflexos laterais', 0, 4.4, -41.4, 3.4, 0.62, 0);

  // Flush all instanced geometry batches!
  addBatch(scene, unitBox, mats.travertineFloor, seamTiles, false);
  addBatch(scene, unitBox, mats.travertine, columnShafts, true);
  addBatch(scene, unitBox, mats.concrete, columnBases, true);
  addBatch(scene, unitBox, mats.travertine, columnCaps, true);
  addBatch(scene, unitBox, mats.cobaltGlow, glassSlits, false);
  addBatch(scene, unitCone, mats.foliage, gardenLeaves, true);

  // ---------- PORTAIS COM RENDER TARGET VIRTUAL (ZERO RECURSÃO) & ESPELHOS PLANARES ----------
  const portalSurfaces = [];
  const portalRTs = [];
  const portalFrames = [];

  for (const p of physics.PORTALS) {
    const rt = new THREE.WebGLRenderTarget(256, 340, { depthBuffer: true });
    portalRTs.push(rt);

    const frameGroup = new THREE.Group();
    frameGroup.position.set(...p.srcPos);
    frameGroup.rotation.y = p.srcYaw;
    scene.add(frameGroup);

    // Brass arched aperture frame
    const ring = addMesh(frameGroup, trackGeo(new THREE.TorusGeometry(1.12, 0.065, 10, 48)), mats.cobaltGlow, [0, 0, 0]);
    const backingMat = mats.trackMat(new THREE.MeshBasicMaterial({
      map: rt.texture,
      side: THREE.DoubleSide,
    }));
    const disk = new THREE.Mesh(trackGeo(new THREE.CircleGeometry(1.06, 42)), backingMat);
    disk.position.set(0, 0, 0.02);
    frameGroup.add(disk);

    portalFrames.push({ portal: p, disk, backingMat, rt, ring });
    portalSurfaces.push(disk);
  }

  // Planar Mirrors in Sala 5
  const mirrors = [
    { pos: new THREE.Vector3(-6.2, 2.7, -50.0), normal: new THREE.Vector3(1, 0, 0), rotY: Math.PI / 2 },
    { pos: new THREE.Vector3(6.2, 2.7, -50.0), normal: new THREE.Vector3(-1, 0, 0), rotY: -Math.PI / 2 },
  ].map(cfg => {
    const rt = new THREE.WebGLRenderTarget(256, 340, { depthBuffer: true });
    const texMat = mats.trackMat(new THREE.MeshBasicMaterial({ map: rt.texture }));
    const plane = new THREE.Mesh(trackGeo(new THREE.PlaneGeometry(5.6, 5.2)), texMat);
    plane.position.copy(cfg.pos);
    plane.rotation.y = cfg.rotY;
    scene.add(plane);
    // Brass bezel frame around mirror
    const bezel = addBox(scene, mats.brass, cfg.pos.x - cfg.normal.x * 0.08, cfg.pos.y, cfg.pos.z, 0.14, 5.45, 5.85);
    bezel.castShadow = true;
    return { ...cfg, rt, plane, texMat };
  });

  const virtualCam = new THREE.PerspectiveCamera(60, 256 / 340, 0.25, 140);
  const tmpTarget = new THREE.Vector3();
  const tmpUp = new THREE.Vector3();
  const tmpFwd = new THREE.Vector3();
  const tmpMat = new THREE.Matrix4();
  const tmpPos = new THREE.Vector3();
  const tmpQuat = new THREE.Quaternion();
  const tmpScale = new THREE.Vector3();
  let rtFrameCounter = 0;

  function renderPortalsAndMirrors(renderer, playerCam, profile) {
    rtFrameCounter++;
    const prevTarget = renderer.getRenderTarget();
    const prevShadowAuto = renderer.shadowMap.autoUpdate;

    // Update live portals (throttled and only close to active player camera)
    const activePortals = profile.portalsLive
      ? portalFrames.filter(item => playerCam.position.distanceToSquared(tmpPos.fromArray(item.portal.srcPos)) < 400)
      : [];

    for (const item of portalFrames) {
      if (profile.portalsLive) {
        item.backingMat.map = item.rt.texture;
        item.backingMat.color.setHex(0xffffff);
      } else {
        item.backingMat.map = null;
        item.backingMat.color.setHex(0x3a6ce0);
      }
    }

    if (activePortals.length > 0 && (rtFrameCounter <= 2 || rtFrameCounter % 3 === 0)) {
      renderer.shadowMap.autoUpdate = false;
      portalSurfaces.forEach(s => { s.visible = false; });
      mirrors.forEach(m => { m.plane.visible = false; });
      for (const item of activePortals.slice(0, 1)) {
        tmpMat.copy(item.portal.transportMat).multiply(playerCam.matrixWorld);
        tmpMat.decompose(tmpPos, tmpQuat, tmpScale);
        virtualCam.position.copy(tmpPos);
        virtualCam.quaternion.copy(tmpQuat);
        virtualCam.fov = playerCam.fov;
        virtualCam.aspect = 256 / 340;
        virtualCam.updateProjectionMatrix();
        virtualCam.updateMatrixWorld();

        renderer.setRenderTarget(item.rt);
        renderer.clear();
        renderer.render(scene, virtualCam);
      }
      portalSurfaces.forEach(s => { s.visible = true; });
      mirrors.forEach(m => { m.plane.visible = true; });
    }

    // Update planar mirrors only inside Sala 5
    const inMirrorRoom = physics.state.roomId === 'espelhos' && playerCam.position.z < -39;
    for (const m of mirrors) {
      m.plane.material = profile.mirrorsLive && inMirrorRoom ? m.texMat : mats.mirrorFallback;
    }

    if (profile.mirrorsLive && inMirrorRoom && (rtFrameCounter <= 2 || rtFrameCounter % 2 === 0)) {
      renderer.shadowMap.autoUpdate = false;
      mirrors.forEach(m => { m.plane.visible = false; });
      portalSurfaces.forEach(s => { s.visible = false; });

      playerCam.getWorldDirection(tmpFwd);
      for (const m of mirrors) {
        // Reflect camera position, look target & up vector across mirror plane
        const dPos = tmpPos.copy(playerCam.position).sub(m.pos).dot(m.normal);
        virtualCam.position.copy(playerCam.position).addScaledVector(m.normal, -2 * dPos);

        tmpTarget.copy(playerCam.position).add(tmpFwd);
        const dTgt = tmpScale.copy(tmpTarget).sub(m.pos).dot(m.normal);
        tmpTarget.addScaledVector(m.normal, -2 * dTgt);

        tmpUp.set(0, 1, 0).applyQuaternion(playerCam.quaternion);
        const dUp = tmpUp.dot(m.normal);
        tmpUp.addScaledVector(m.normal, -2 * dUp).normalize();

        virtualCam.up.copy(tmpUp);
        virtualCam.lookAt(tmpTarget);
        virtualCam.fov = playerCam.fov;
        virtualCam.aspect = 256 / 340;
        virtualCam.updateProjectionMatrix();
        virtualCam.updateMatrixWorld();

        renderer.setRenderTarget(m.rt);
        renderer.clear();
        renderer.render(scene, virtualCam);
      }
      mirrors.forEach(m => { m.plane.visible = true; });
      portalSurfaces.forEach(s => { s.visible = true; });
    }

    renderer.shadowMap.autoUpdate = prevShadowAuto;
    renderer.setRenderTarget(prevTarget);
  }

  function applyQualityTier(profile) {
    godrayGroup.visible = Boolean(profile.godrays);
    sun.castShadow = Boolean(profile.shadows);
    if (sun.shadow.mapSize.x !== profile.shadowSize) {
      sun.shadow.mapSize.set(profile.shadowSize, profile.shadowSize);
      if (sun.shadow.map) {
        sun.shadow.map.dispose();
        sun.shadow.map = null;
      }
    }
  }

  function updateVisuals(time, reducedMotion) {
    const st = physics.state;
    bridgeGroup.rotation.y = st.bridgeYawVisual;
    bridgePivot.rotation.y = st.bridgeYawVisual;
    wheelGroup.rotation.y = st.bridgeYawVisual;
    galleryGroup.rotation.y = st.galleryYawVisual;

    // Color state cues on bridges
    const bMat = st.bridgeAligned ? mats.cobaltGlow : mats.amberGlow;
    bridgeCenterGlow.material = bMat;
    bridgeStatusStrips.forEach(s => { s.material = bMat; });
    galleryStrip.material = st.galleryAligned ? mats.cobaltGlow : mats.amberGlow;
    secretGlyph.material = st.mirrorInspected ? mats.emeraldGlow : mats.amberGlow;

    if (!reducedMotion) {
      armillary.rotation.y = time * 0.25;
      armillary.rotation.x = Math.sin(time * 0.18) * 0.14;
      prismGroup.rotation.y = time * 0.4;
      viewpointRing.material.opacity = 0.62 + Math.sin(time * 2.2) * 0.2;
      galleryViewRing.material.opacity = 0.62 + Math.sin(time * 2.2 + 1) * 0.2;
    } else {
      viewpointRing.material.opacity = 0.85;
      galleryViewRing.material.opacity = 0.85;
    }

    // Keep shadow frustum anchored near player
    sun.target.position.set(st.pos.x * 0.7, 0, st.pos.z * 0.7);
    sun.position.set(st.pos.x * 0.7 - 14, 24, st.pos.z * 0.7 + 14);
  }

  return {
    sun,
    updateVisuals,
    renderPortalsAndMirrors,
    applyQualityTier,
    dispose() {
      portalRTs.forEach(rt => rt.dispose());
      mirrors.forEach(m => m.rt.dispose());
      disposables.forEach(g => g.dispose());
    },
  };
}
