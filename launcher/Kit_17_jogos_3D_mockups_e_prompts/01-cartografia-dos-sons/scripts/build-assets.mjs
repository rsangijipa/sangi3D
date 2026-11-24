// scripts/build-assets.mjs
// Procedurally generates authentic, high-quality GLB 2.0 assets matching mockup.png
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Polyfill FileReader for Node.js GLTFExporter
class FileReaderPolyfill {
  readAsArrayBuffer(blob) {
    blob.arrayBuffer().then((buf) => {
      this.result = buf;
      if (this.onloadend) this.onloadend();
    });
  }
}
globalThis.FileReader = FileReaderPolyfill;

import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outDir = path.resolve(__dirname, '../public/assets/models');

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const exporter = new GLTFExporter();

function exportGLB(object3d, filename) {
  return new Promise((resolve, reject) => {
    exporter.parse(
      object3d,
      (gltf) => {
        const fullPath = path.join(outDir, filename);
        fs.writeFileSync(fullPath, Buffer.from(gltf));
        const sizeKb = (fs.statSync(fullPath).size / 1024).toFixed(1);
        console.log(`[Asset Built] ${filename} (${sizeKb} KB)`);
        resolve(fullPath);
      },
      (error) => {
        console.error(`Error exporting ${filename}:`, error);
        reject(error);
      },
      { binary: true }
    );
  });
}

// ----------------------------------------------------------------------------
// Helper: create upright standing rounded arch token matching mockup.png
function createUprightToken(colorHex, iconBuilder) {
  const group = new THREE.Group();

  const tokenMat = new THREE.MeshStandardMaterial({
    color: colorHex,
    roughness: 0.35,
    metalness: 0.05
  });

  // Upright rounded arch block (tombstone arch)
  // Lower rectangular body
  const bodyW = 0.58;
  const bodyH = 0.44;
  const bodyD = 0.28;
  const body = new THREE.Mesh(new THREE.BoxGeometry(bodyW, bodyH, bodyD), tokenMat);
  body.position.y = bodyH / 2 + 0.04;
  body.castShadow = true;
  body.receiveShadow = true;
  group.add(body);

  // Upper semi-cylindrical arched top
  const archGeom = new THREE.CylinderGeometry(bodyW / 2, bodyW / 2, bodyD, 32, 1, false, 0, Math.PI);
  archGeom.rotateZ(Math.PI / 2);
  archGeom.rotateX(Math.PI / 2);
  const arch = new THREE.Mesh(archGeom, tokenMat);
  arch.position.set(0, bodyH + 0.04, 0);
  arch.castShadow = true;
  group.add(arch);

  // Wheel cutouts at bottom base (front and back) to create feet
  const cutoutMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.8 });
  const wheelArchF = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.04, 16), cutoutMat);
  wheelArchF.rotation.x = Math.PI / 2;
  wheelArchF.position.set(0, 0.04, bodyD / 2 + 0.005);
  group.add(wheelArchF);

  // Cyan glowing selection contour loop on ground
  const glowRingGeom = new THREE.TorusGeometry(0.38, 0.035, 16, 32);
  glowRingGeom.rotateX(Math.PI / 2);
  const glowMat = new THREE.MeshStandardMaterial({
    color: 0x00e5ff,
    emissive: 0x00e5ff,
    emissiveIntensity: 1.6,
    roughness: 0.2
  });
  const glowRing = new THREE.Mesh(glowRingGeom, glowMat);
  glowRing.scale.set(1.0, 1.0, 0.75); // Oval loop around token base
  glowRing.position.y = 0.02;
  glowRing.name = 'selection_glow';
  group.add(glowRing);

  // Build white icon graphics on front & back faces
  const whiteMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.2,
    metalness: 0.1
  });

  if (iconBuilder) {
    const iconF = iconBuilder(whiteMat, tokenMat);
    iconF.position.set(0, 0.38, bodyD / 2 + 0.015);
    group.add(iconF);

    const iconB = iconBuilder(whiteMat, tokenMat);
    iconB.position.set(0, 0.38, -bodyD / 2 - 0.015);
    iconB.rotation.y = Math.PI;
    group.add(iconB);
  }

  return group;
}

// ----------------------------------------------------------------------------
// 1. BUS TOKEN (Upright rounded blue arch token matching mockup.png)
function buildBusToken() {
  const group = createUprightToken(0x27679c, (whiteMat, accentMat) => {
    const icon = new THREE.Group();

    // Bus body outline / front face
    const busFace = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.32, 0.02), whiteMat);
    icon.add(busFace);

    // Dark windshield
    const darkMat = new THREE.MeshStandardMaterial({ color: 0x27679c, roughness: 0.4 });
    const windshield = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.12, 0.025), darkMat);
    windshield.position.set(0, 0.06, 0.005);
    icon.add(windshield);

    // Front headlights
    const lightL = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.025, 12), darkMat);
    lightL.rotation.x = Math.PI / 2;
    lightL.position.set(-0.09, -0.08, 0.005);
    const lightR = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.025, 12), darkMat);
    lightR.rotation.x = Math.PI / 2;
    lightR.position.set(0.09, -0.08, 0.005);
    icon.add(lightL, lightR);

    // Bumper line
    const bumper = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.02, 0.025), darkMat);
    bumper.position.set(0, -0.08, 0.005);
    icon.add(bumper);

    return icon;
  });

  group.name = 'bus_token';
  return group;
}

// ----------------------------------------------------------------------------
// 2. BIRD TOKEN
function buildBirdToken() {
  const group = createUprightToken(0x2e7d32, (whiteMat) => {
    const icon = new THREE.Group();
    const body = new THREE.Mesh(new THREE.SphereGeometry(0.1, 16, 12), whiteMat);
    body.scale.set(1.2, 0.8, 0.3);
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.07, 16, 12), whiteMat);
    head.position.set(0.1, 0.08, 0);
    const beak = new THREE.Mesh(new THREE.ConeGeometry(0.03, 0.08, 8), whiteMat);
    beak.rotation.z = -Math.PI / 2;
    beak.position.set(0.18, 0.08, 0);
    icon.add(body, head, beak);
    return icon;
  });
  group.name = 'bird_token';
  return group;
}

// ----------------------------------------------------------------------------
// 3. BELL TOKEN
function buildBellToken() {
  const group = createUprightToken(0xd97706, (whiteMat) => {
    const icon = new THREE.Group();
    const bell = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.15, 0.2, 16), whiteMat);
    bell.position.y = 0.02;
    const rim = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.04, 0.02), whiteMat);
    rim.position.y = -0.08;
    const clapper = new THREE.Mesh(new THREE.SphereGeometry(0.035, 10, 10), whiteMat);
    clapper.position.y = -0.11;
    icon.add(bell, rim, clapper);
    return icon;
  });
  group.name = 'bell_token';
  return group;
}

// ----------------------------------------------------------------------------
// 4. WATER TOKEN
function buildWaterToken() {
  const group = createUprightToken(0x0284c7, (whiteMat) => {
    const icon = new THREE.Group();
    const drop = new THREE.Mesh(new THREE.SphereGeometry(0.1, 16, 12), whiteMat);
    drop.scale.set(0.9, 1.2, 0.3);
    const tip = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.12, 16), whiteMat);
    tip.scale.set(1.0, 1.0, 0.3);
    tip.position.y = 0.1;
    icon.add(drop, tip);
    return icon;
  });
  group.name = 'water_token';
  return group;
}

// ----------------------------------------------------------------------------
// 5. FOOTSTEP TOKEN
function buildFootstepToken() {
  const group = createUprightToken(0xb45309, (whiteMat) => {
    const icon = new THREE.Group();
    const foot1 = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.14, 0.02), whiteMat);
    foot1.position.set(-0.06, 0.04, 0);
    foot1.rotation.z = -0.1;
    const heel1 = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.05, 0.02), whiteMat);
    heel1.position.set(-0.06, -0.06, 0);
    const foot2 = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.14, 0.02), whiteMat);
    foot2.position.set(0.06, -0.02, 0);
    foot2.rotation.z = 0.1;
    const heel2 = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.05, 0.02), whiteMat);
    heel2.position.set(0.06, -0.12, 0);
    icon.add(foot1, heel1, foot2, heel2);
    return icon;
  });
  group.name = 'footstep_token';
  return group;
}

// ----------------------------------------------------------------------------
// 6. LISTENER MARKER
function buildListenerMarker() {
  const group = new THREE.Group();
  group.name = 'listener_marker';

  const brassMat = new THREE.MeshStandardMaterial({
    color: 0xd4af37,
    roughness: 0.28,
    metalness: 0.85
  });
  const woodMat = new THREE.MeshStandardMaterial({
    color: 0x6d4c41,
    roughness: 0.6,
    metalness: 0.1
  });

  const baseGeom = new THREE.CylinderGeometry(0.24, 0.28, 0.08, 24);
  const baseMesh = new THREE.Mesh(baseGeom, brassMat);
  baseMesh.position.y = 0.04;
  group.add(baseMesh);

  const shaftGeom = new THREE.CylinderGeometry(0.06, 0.09, 0.45, 16);
  const shaftMesh = new THREE.Mesh(shaftGeom, woodMat);
  shaftMesh.position.y = 0.3;
  group.add(shaftMesh);

  const topDisc = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.06, 24), brassMat);
  topDisc.position.y = 0.55;
  group.add(topDisc);

  const earMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.2,
    metalness: 0.1
  });
  const earC = new THREE.Mesh(new THREE.TorusGeometry(0.08, 0.02, 12, 18, Math.PI * 1.4), earMat);
  earC.rotation.x = Math.PI / 2;
  earC.position.set(0, 0.59, 0);
  group.add(earC);

  const selRing = new THREE.Mesh(
    new THREE.TorusGeometry(0.32, 0.025, 12, 32),
    new THREE.MeshStandardMaterial({ color: 0x22c55e, emissive: 0x16a34a, emissiveIntensity: 0.9 })
  );
  selRing.rotation.x = Math.PI / 2;
  selRing.position.y = 0.02;
  group.add(selRing);

  return group;
}

// ----------------------------------------------------------------------------
// 7. SOUND RINGS (Concentric translucent cyan-blue arcs opening towards the right)
function buildSoundRings() {
  const group = new THREE.Group();
  group.name = 'sound_rings';

  const ringCount = 3;
  // Arc angle ~120 degrees (Math.PI * 0.66) centered facing +X (towards plaza)
  for (let i = 0; i < ringCount; i++) {
    const radius = 0.65 + i * 0.42;
    const ringGeom = new THREE.TorusGeometry(radius, 0.028, 12, 48, Math.PI * 0.65);
    ringGeom.rotateX(Math.PI / 2);
    ringGeom.rotateZ(-Math.PI * 0.325); // center arc towards positive X
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x00e5ff,
      emissiveIntensity: 0.8 - i * 0.18,
      transparent: true,
      opacity: 0.75 - i * 0.18,
      roughness: 0.2
    });
    const ringMesh = new THREE.Mesh(ringGeom, ringMat);
    ringMesh.position.y = 0.04;
    ringMesh.name = `ring_${i}`;
    group.add(ringMesh);
  }

  return group;
}

// ----------------------------------------------------------------------------
// 8. MAP BOARD (Wooden tabletop, honey oak tray frame, topographic parchment map)
function buildMapBoard() {
  const group = new THREE.Group();
  group.name = 'map_board';

  // Warm honey-brown wood table surface
  const tableMat = new THREE.MeshStandardMaterial({
    color: 0x6e4324,
    roughness: 0.55,
    metalness: 0.05
  });
  const table = new THREE.Mesh(new THREE.BoxGeometry(22, 0.6, 16), tableMat);
  table.position.y = -0.35;
  table.receiveShadow = true;
  group.add(table);

  // Diorama Tray frame (Honey Oak with rounded feel)
  const trayMat = new THREE.MeshStandardMaterial({
    color: 0x93592d,
    roughness: 0.45,
    metalness: 0.08
  });
  const trayBase = new THREE.Mesh(new THREE.BoxGeometry(14.8, 0.22, 10.8), trayMat);
  trayBase.position.y = -0.04;
  trayBase.receiveShadow = true;
  group.add(trayBase);

  // Tray raised border lips
  const lipH = 0.28;
  const lipT = 0.4;
  const lipN = new THREE.Mesh(new THREE.BoxGeometry(14.8, lipH, lipT), trayMat);
  lipN.position.set(0, 0.1, -5.2);
  const lipS = new THREE.Mesh(new THREE.BoxGeometry(14.8, lipH, lipT), trayMat);
  lipS.position.set(0, 0.1, 5.2);
  const lipW = new THREE.Mesh(new THREE.BoxGeometry(lipT, lipH, 10.8), trayMat);
  lipW.position.set(-7.2, 0.1, 0);
  const lipE = new THREE.Mesh(new THREE.BoxGeometry(lipT, lipH, 10.8), trayMat);
  lipE.position.set(7.2, 0.1, 0);
  group.add(lipN, lipS, lipW, lipE);

  // Topographic parchment map sheet
  const paperMat = new THREE.MeshStandardMaterial({
    color: 0xf5eedc,
    roughness: 0.9,
    metalness: 0.02
  });
  const paper = new THREE.Mesh(new THREE.BoxGeometry(14.0, 0.06, 10.0), paperMat);
  paper.position.y = 0.03;
  paper.receiveShadow = true;
  group.add(paper);

  // Topographic contour curves (delicate ink lines)
  const inkMat = new THREE.MeshStandardMaterial({
    color: 0xbfb39e,
    roughness: 0.8
  });
  for (let r = 1.8; r <= 5.8; r += 0.8) {
    const curveGeom = new THREE.TorusGeometry(r, 0.012, 6, 48, Math.PI * 1.5);
    curveGeom.rotateX(Math.PI / 2);
    const curveMesh = new THREE.Mesh(curveGeom, inkMat);
    curveMesh.position.set(-1.0, 0.065, -0.5);
    curveMesh.scale.set(1.2, 1.0, 0.8);
    group.add(curveMesh);
  }

  // Brass clipboard clip (top left)
  const clipMat = new THREE.MeshStandardMaterial({
    color: 0xd4af37,
    roughness: 0.25,
    metalness: 0.85
  });
  const clip = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.2, 0.8), clipMat);
  clip.position.set(-6.2, 0.2, -4.5);
  clip.rotation.y = 0.15;
  group.add(clip);

  // Ceramic pencil cup (bottom left)
  const ceramicMat = new THREE.MeshStandardMaterial({ color: 0xf7f3ea, roughness: 0.25 });
  const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.36, 0.85, 20), ceramicMat);
  cup.position.set(-6.8, 0.42, 4.6);
  group.add(cup);

  const pencilColors = [0x254533, 0xb96a46, 0xd8ae66, 0x263d4c];
  for (let i = 0; i < 4; i++) {
    const pencilMat = new THREE.MeshStandardMaterial({ color: pencilColors[i], roughness: 0.5 });
    const pencil = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.1, 8), pencilMat);
    pencil.position.set(-6.8 + (i - 1.5) * 0.12, 0.72, 4.6 + ((i % 2) - 0.5) * 0.1);
    pencil.rotation.z = (i - 1.5) * 0.14;
    group.add(pencil);
  }

  // Brass magnifying glass resting over bottom-left border
  const glassRim = new THREE.Mesh(new THREE.TorusGeometry(0.68, 0.075, 16, 32), clipMat);
  glassRim.rotation.x = Math.PI / 2;
  glassRim.position.set(-4.2, 0.14, 4.4);
  const handleMat = new THREE.MeshStandardMaterial({ color: 0x4a2a18, roughness: 0.6 });
  const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.085, 1.3, 16), handleMat);
  handle.rotation.z = Math.PI / 3;
  handle.position.set(-5.1, 0.14, 4.9);
  const lensMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.35,
    roughness: 0.1,
    metalness: 0.1
  });
  const lens = new THREE.Mesh(new THREE.CylinderGeometry(0.66, 0.66, 0.02, 32), lensMat);
  lens.position.set(-4.2, 0.14, 4.4);
  group.add(glassRim, handle, lens);

  // Vintage cloth-bound book (bottom right)
  const bookCover = new THREE.MeshStandardMaterial({ color: 0x2e4a36, roughness: 0.65 });
  const bookPages = new THREE.MeshStandardMaterial({ color: 0xf3eedb, roughness: 0.8 });
  const book = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.45, 1.8), bookCover);
  book.position.set(6.8, 0.24, 4.0);
  book.rotation.y = -0.22;
  const pages = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.38, 1.65), bookPages);
  pages.position.set(6.82, 0.24, 4.0);
  pages.rotation.y = -0.22;
  group.add(book, pages);

  return group;
}

// ----------------------------------------------------------------------------
// 9. ROAD TILES (Asphalt roads, curbs, center dashes, zebra crossing)
function buildRoadTiles() {
  const group = new THREE.Group();
  group.name = 'road_tiles';

  const asphaltMat = new THREE.MeshStandardMaterial({
    color: 0x35383b,
    roughness: 0.85,
    metalness: 0.05
  });
  const curbMat = new THREE.MeshStandardMaterial({
    color: 0xd8d1c4,
    roughness: 0.7,
    metalness: 0.02
  });
  const paintMat = new THREE.MeshStandardMaterial({
    color: 0xf8f8f8,
    roughness: 0.4
  });

  // Main avenue past bakery towards plaza
  const road1 = new THREE.Mesh(new THREE.BoxGeometry(6.6, 0.05, 1.8), asphaltMat);
  road1.position.set(-2.4, 0.08, 1.4);
  road1.receiveShadow = true;
  group.add(road1);

  // Plaza circular loop road
  const plazaRoad = new THREE.Mesh(new THREE.CylinderGeometry(2.8, 2.8, 0.045, 36), asphaltMat);
  plazaRoad.position.set(1.5, 0.075, 0.6);
  plazaRoad.receiveShadow = true;
  group.add(plazaRoad);

  // North avenue towards school
  const roadNorth = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.05, 4.6), asphaltMat);
  roadNorth.position.set(-1.2, 0.08, -1.8);
  roadNorth.receiveShadow = true;
  group.add(roadNorth);

  // East road past houses
  const roadEast = new THREE.Mesh(new THREE.BoxGeometry(4.4, 0.05, 1.8), asphaltMat);
  roadEast.position.set(4.2, 0.08, 0.6);
  roadEast.receiveShadow = true;
  group.add(roadEast);

  // Curbs / stone sidewalk borders
  const curb1 = new THREE.Mesh(new THREE.BoxGeometry(6.6, 0.07, 0.18), curbMat);
  curb1.position.set(-2.4, 0.09, 2.34);
  const curb2 = new THREE.Mesh(new THREE.BoxGeometry(6.6, 0.07, 0.18), curbMat);
  curb2.position.set(-2.4, 0.09, 0.46);
  group.add(curb1, curb2);

  // Dashed center line markings
  for (let x = -5.2; x <= -0.6; x += 0.9) {
    const dash = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.055, 0.08), paintMat);
    dash.position.set(x, 0.086, 1.4);
    group.add(dash);
  }

  // Pedestrian zebra crossing near bakery
  for (let z = 0.65; z <= 2.15; z += 0.3) {
    const stripe = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.055, 0.18), paintMat);
    stripe.position.set(-1.8, 0.086, z);
    group.add(stripe);
  }

  return group;
}

// ----------------------------------------------------------------------------
// 10. BAKERY (Terracotta facade, striped awning, hanging coffee sign, cafe patio)
function buildBakery() {
  const group = new THREE.Group();
  group.name = 'bakery';

  const stuccoMat = new THREE.MeshStandardMaterial({ color: 0xb96a46, roughness: 0.72 });
  const roofMat = new THREE.MeshStandardMaterial({ color: 0x9a4428, roughness: 0.62 });
  const creamMat = new THREE.MeshStandardMaterial({ color: 0xfaf5e9, roughness: 0.4 });
  const windowGlowMat = new THREE.MeshStandardMaterial({
    color: 0xffe6a3,
    emissive: 0xff9922,
    emissiveIntensity: 0.85,
    roughness: 0.2
  });

  // Main building body
  const base = new THREE.Mesh(new THREE.BoxGeometry(3.0, 1.6, 2.4), stuccoMat);
  base.position.set(0, 0.8, 0);
  base.castShadow = true;
  base.receiveShadow = true;
  group.add(base);

  // Pitched roof
  const roofGeom = new THREE.ConeGeometry(2.3, 1.2, 4);
  roofGeom.rotateY(Math.PI / 4);
  const roof = new THREE.Mesh(roofGeom, roofMat);
  roof.scale.set(1.05, 1.0, 0.85);
  roof.position.set(0, 2.2, 0);
  roof.castShadow = true;
  group.add(roof);

  // Large glowing display window
  const windowBox = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.8, 0.1), windowGlowMat);
  windowBox.position.set(0.2, 0.75, 1.22);
  group.add(windowBox);

  // Window mullions (frame grid)
  const frameMat = new THREE.MeshStandardMaterial({ color: 0x4a2e22, roughness: 0.5 });
  const frameH = new THREE.Mesh(new THREE.BoxGeometry(1.65, 0.05, 0.12), frameMat);
  frameH.position.set(0.2, 0.75, 1.23);
  const frameV1 = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.82, 0.12), frameMat);
  frameV1.position.set(-0.3, 0.75, 1.23);
  const frameV2 = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.82, 0.12), frameMat);
  frameV2.position.set(0.7, 0.75, 1.23);
  group.add(frameH, frameV1, frameV2);

  // Striped Awning (cream & terracotta stripes)
  const stripeOrangeMat = new THREE.MeshStandardMaterial({ color: 0xc86d48, roughness: 0.5 });
  const awningW = 1.9;
  const stripeW = 0.2;
  const numStripes = 9;
  for (let i = 0; i < numStripes; i++) {
    const sMat = i % 2 === 0 ? stripeOrangeMat : creamMat;
    const stripe = new THREE.Mesh(new THREE.BoxGeometry(stripeW, 0.04, 0.7), sMat);
    stripe.position.set(-awningW / 2 + (i + 0.5) * stripeW + 0.2, 1.35, 1.5);
    stripe.rotation.x = 0.35;
    stripe.castShadow = true;
    group.add(stripe);
  }

  // HANGING CAFE SIGN WITH COFFEE CUP (Prominent in mockup.png!)
  const ironMat = new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.8, roughness: 0.3 });
  const signBracket = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.03, 0.45), ironMat);
  signBracket.position.set(1.52, 1.4, 0.8);
  const signRing = new THREE.Mesh(new THREE.TorusGeometry(0.18, 0.02, 12, 24), ironMat);
  signRing.position.set(1.52, 1.2, 0.95);
  const signDisc = new THREE.Mesh(
    new THREE.CylinderGeometry(0.17, 0.17, 0.02, 24),
    new THREE.MeshStandardMaterial({ color: 0x7c4328, roughness: 0.4 })
  );
  signDisc.rotation.z = Math.PI / 2;
  signDisc.position.set(1.52, 1.2, 0.95);
  // Coffee cup icon
  const cupMesh = new THREE.Mesh(
    new THREE.CylinderGeometry(0.06, 0.04, 0.08, 12),
    new THREE.MeshStandardMaterial({ color: 0xfaf5e9, roughness: 0.3 })
  );
  cupMesh.rotation.z = Math.PI / 2;
  cupMesh.position.set(1.535, 1.2, 0.95);
  group.add(signBracket, signRing, signDisc, cupMesh);

  // Bistro patio: table & chairs
  const tableTop = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.04, 20), creamMat);
  tableTop.position.set(0.5, 0.4, 2.0);
  const tableLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.05, 0.4, 12), frameMat);
  tableLeg.position.set(0.5, 0.2, 2.0);
  group.add(tableTop, tableLeg);

  for (const dx of [-0.35, 0.35]) {
    const seat = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.03, 12), frameMat);
    seat.position.set(0.5 + dx, 0.25, 2.0);
    const chairBack = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.3, 0.2), frameMat);
    chairBack.position.set(0.5 + dx * 1.2, 0.4, 2.0);
    group.add(seat, chairBack);
  }

  // Chalkboard sidewalk easel
  const chalkFrame = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.55, 0.4), frameMat);
  chalkFrame.position.set(1.4, 0.28, 1.8);
  chalkFrame.rotation.y = 0.3;
  const chalkBoard = new THREE.Mesh(
    new THREE.BoxGeometry(0.02, 0.45, 0.32),
    new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.85 })
  );
  chalkBoard.position.set(1.41, 0.28, 1.8);
  chalkBoard.rotation.y = 0.3;
  group.add(chalkFrame, chalkBoard);

  // Potted lavender plant
  const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.1, 0.22, 16), stuccoMat);
  pot.position.set(-1.0, 0.11, 1.5);
  const bush = new THREE.Mesh(
    new THREE.SphereGeometry(0.18, 12, 12),
    new THREE.MeshStandardMaterial({ color: 0x7c3aed, roughness: 0.6 })
  );
  bush.position.set(-1.0, 0.28, 1.5);
  group.add(pot, bush);

  return group;
}

// ----------------------------------------------------------------------------
// 11. SCHOOL (Red brick facade, clock pediment, flagpole with golden flag, green door)
function buildSchool() {
  const group = new THREE.Group();
  group.name = 'school';

  const brickMat = new THREE.MeshStandardMaterial({ color: 0x994231, roughness: 0.8 });
  const stoneMat = new THREE.MeshStandardMaterial({ color: 0xe5dfd3, roughness: 0.5 });
  const roofMat = new THREE.MeshStandardMaterial({ color: 0x3d4451, roughness: 0.6 });
  const doorMat = new THREE.MeshStandardMaterial({ color: 0x254533, roughness: 0.4 });
  const windowMat = new THREE.MeshStandardMaterial({
    color: 0xfff0c2,
    emissive: 0xffb84d,
    emissiveIntensity: 0.65,
    roughness: 0.2
  });

  // Main civic building body
  const body = new THREE.Mesh(new THREE.BoxGeometry(4.2, 1.8, 2.6), brickMat);
  body.position.set(0, 0.9, 0);
  body.castShadow = true;
  body.receiveShadow = true;
  group.add(body);

  // Stone basement plinth
  const plinth = new THREE.Mesh(new THREE.BoxGeometry(4.35, 0.2, 2.75), stoneMat);
  plinth.position.set(0, 0.1, 0);
  group.add(plinth);

  // Hipped slate roof
  const roofGeom = new THREE.ConeGeometry(3.1, 1.3, 4);
  roofGeom.rotateY(Math.PI / 4);
  const roof = new THREE.Mesh(roofGeom, roofMat);
  roof.scale.set(1.1, 1.0, 0.75);
  roof.position.set(0, 2.45, 0);
  roof.castShadow = true;
  group.add(roof);

  // Central Clock Pediment (Clean rectangular tower with stone cornice)
  const pediment = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.85, 0.5), brickMat);
  pediment.position.set(0, 2.05, 1.15);
  const cornice = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.1, 0.55), stoneMat);
  cornice.position.set(0, 2.5, 1.15);
  const pedimentRoof = new THREE.Mesh(new THREE.ConeGeometry(1.1, 0.5, 4), roofMat);
  pedimentRoof.rotateY(Math.PI / 4);
  pedimentRoof.position.set(0, 2.8, 1.15);
  group.add(pediment, cornice, pedimentRoof);

  // Clock face
  const clockRim = new THREE.Mesh(
    new THREE.TorusGeometry(0.24, 0.03, 12, 24),
    new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.85, roughness: 0.25 })
  );
  clockRim.position.set(0, 2.1, 1.42);
  const clockFace = new THREE.Mesh(new THREE.CylinderGeometry(0.23, 0.23, 0.02, 24), stoneMat);
  clockFace.rotation.x = Math.PI / 2;
  clockFace.position.set(0, 2.1, 1.41);
  const handH = new THREE.Mesh(
    new THREE.BoxGeometry(0.02, 0.1, 0.02),
    new THREE.MeshStandardMaterial({ color: 0x111111 })
  );
  handH.position.set(0, 2.13, 1.43);
  const handM = new THREE.Mesh(
    new THREE.BoxGeometry(0.12, 0.02, 0.02),
    new THREE.MeshStandardMaterial({ color: 0x111111 })
  );
  handM.position.set(0.04, 2.1, 1.43);
  group.add(clockRim, clockFace, handH, handM);

  // Flagpole and Yellow Swallowtail Flag
  const poleMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.85 });
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.03, 1.2, 12), poleMat);
  pole.position.set(0, 3.5, 0);
  const flagMat = new THREE.MeshStandardMaterial({ color: 0xeab308, roughness: 0.4 });
  const flag = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.28, 0.02), flagMat);
  flag.position.set(0.29, 3.9, 0);
  group.add(pole, flag);

  // Front Green Double Doors and Stone Entrance Steps
  const door = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.85, 0.08), doorMat);
  door.position.set(0, 0.52, 1.32);
  const doorStone = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.15, 0.4), stoneMat);
  doorStone.position.set(0, 0.1, 1.45);
  group.add(door, doorStone);

  // Symmetrical Multi-pane Windows
  for (const dx of [-1.4, -0.7, 0.7, 1.4]) {
    for (const dy of [0.6, 1.25]) {
      const win = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.45, 0.06), windowMat);
      win.position.set(dx, dy, 1.31);
      const lintel = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.06, 0.08), stoneMat);
      lintel.position.set(dx, dy + 0.26, 1.32);
      group.add(win, lintel);
    }
  }

  return group;
}

// ----------------------------------------------------------------------------
// 12. HOUSE SET (Warm ochre houses, terracotta roofs, chimneys, glowing windows)
function buildHouseSet() {
  const group = new THREE.Group();
  group.name = 'house_set';

  const ochreMat = new THREE.MeshStandardMaterial({ color: 0xdeb86e, roughness: 0.7 });
  const roofMat = new THREE.MeshStandardMaterial({ color: 0xb55338, roughness: 0.65 });
  const winMat = new THREE.MeshStandardMaterial({
    color: 0xfff3c4,
    emissive: 0xffb833,
    emissiveIntensity: 0.7
  });
  const chimneyMat = new THREE.MeshStandardMaterial({ color: 0x7c2d12, roughness: 0.8 });

  // House 1
  const h1 = new THREE.Mesh(new THREE.BoxGeometry(2.2, 1.7, 2.0), ochreMat);
  h1.position.set(-1.2, 0.85, 0);
  h1.castShadow = true;
  h1.receiveShadow = true;
  const r1Geom = new THREE.ConeGeometry(1.7, 0.9, 4);
  r1Geom.rotateY(Math.PI / 4);
  const r1 = new THREE.Mesh(r1Geom, roofMat);
  r1.scale.set(1.05, 1.0, 0.85);
  r1.position.set(-1.2, 2.15, 0);
  r1.castShadow = true;
  const chim1 = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.8, 0.3), chimneyMat);
  chim1.position.set(-0.6, 2.3, 0.4);
  group.add(h1, r1, chim1);

  // House 2
  const h2 = new THREE.Mesh(new THREE.BoxGeometry(2.0, 1.5, 2.0), ochreMat);
  h2.position.set(1.1, 0.75, 0.3);
  h2.castShadow = true;
  h2.receiveShadow = true;
  const r2Geom = new THREE.ConeGeometry(1.6, 0.85, 4);
  r2Geom.rotateY(Math.PI / 4);
  const r2 = new THREE.Mesh(r2Geom, roofMat);
  r2.scale.set(1.05, 1.0, 0.85);
  r2.position.set(1.1, 2.0, 0.3);
  r2.castShadow = true;
  group.add(h2, r2);

  // Windows with warm light
  for (const pos of [
    [-1.5, 0.7, 1.02],
    [-0.9, 0.7, 1.02],
    [-1.2, 1.3, 1.02],
    [0.7, 0.65, 1.32],
    [1.4, 0.65, 1.32],
    [1.1, 1.2, 1.32]
  ]) {
    const w = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.36, 0.05), winMat);
    w.position.set(pos[0], pos[1], pos[2]);
    group.add(w);
  }

  return group;
}

// ----------------------------------------------------------------------------
// 13. FOUNTAIN (Circular tiered stone fountain with water plume)
function buildFountain() {
  const group = new THREE.Group();
  group.name = 'fountain';

  const stoneMat = new THREE.MeshStandardMaterial({ color: 0xded8ce, roughness: 0.6 });
  const waterMat = new THREE.MeshStandardMaterial({
    color: 0x38bdf8,
    emissive: 0x0284c7,
    emissiveIntensity: 0.45,
    transparent: true,
    opacity: 0.75,
    roughness: 0.1
  });

  // Base terrace
  const base = new THREE.Mesh(new THREE.CylinderGeometry(1.3, 1.35, 0.15, 24), stoneMat);
  base.position.y = 0.075;
  group.add(base);

  // Lower basin wall
  const wallGeom = new THREE.TorusGeometry(1.05, 0.15, 16, 32);
  wallGeom.rotateX(Math.PI / 2);
  const wall = new THREE.Mesh(wallGeom, stoneMat);
  wall.position.y = 0.25;
  group.add(wall);

  // Lower water
  const waterLower = new THREE.Mesh(new THREE.CylinderGeometry(1.0, 1.0, 0.05, 32), waterMat);
  waterLower.position.y = 0.22;
  waterLower.name = 'fountain_water';
  group.add(waterLower);

  // Pedestal
  const pedestal = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.35, 0.7, 16), stoneMat);
  pedestal.position.y = 0.55;
  group.add(pedestal);

  // Upper bowl
  const upperBowl = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.25, 0.25, 24), stoneMat);
  upperBowl.position.y = 0.95;
  group.add(upperBowl);

  // Upper water
  const upperWater = new THREE.Mesh(new THREE.CylinderGeometry(0.48, 0.48, 0.04, 24), waterMat);
  upperWater.position.y = 1.05;
  group.add(upperWater);

  // Water plume
  const spout = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.35, 12), waterMat);
  spout.position.y = 1.25;
  group.add(spout);

  return group;
}

// ----------------------------------------------------------------------------
// 14. TREE SET (Fluffy felt/moss trees on grass mounds)
function buildTreeSet() {
  const group = new THREE.Group();
  group.name = 'tree_set';

  const trunkMat = new THREE.MeshStandardMaterial({ color: 0x5d4037, roughness: 0.7 });
  const mossFeltMat1 = new THREE.MeshStandardMaterial({ color: 0x3f7247, roughness: 0.9 });
  const mossFeltMat2 = new THREE.MeshStandardMaterial({ color: 0x4f8858, roughness: 0.85 });

  // Tree 1
  const t1Trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.18, 1.3, 12), trunkMat);
  t1Trunk.position.set(-1.0, 0.65, 0);
  t1Trunk.castShadow = true;
  group.add(t1Trunk);

  const c1Center = new THREE.Mesh(new THREE.SphereGeometry(0.7, 16, 14), mossFeltMat1);
  c1Center.position.set(-1.0, 1.8, 0);
  c1Center.castShadow = true;
  const c1Top = new THREE.Mesh(new THREE.SphereGeometry(0.55, 14, 12), mossFeltMat2);
  c1Top.position.set(-1.0, 2.2, 0.1);
  c1Top.castShadow = true;
  const c1Side = new THREE.Mesh(new THREE.SphereGeometry(0.48, 14, 12), mossFeltMat1);
  c1Side.position.set(-1.4, 1.7, -0.2);
  c1Side.castShadow = true;
  group.add(c1Center, c1Top, c1Side);

  // Tree 2
  const t2Trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.14, 1.0, 12), trunkMat);
  t2Trunk.position.set(0.9, 0.5, 0.5);
  t2Trunk.castShadow = true;
  const c2Foliage = new THREE.Mesh(new THREE.SphereGeometry(0.55, 14, 12), mossFeltMat2);
  c2Foliage.position.set(0.9, 1.4, 0.5);
  c2Foliage.castShadow = true;
  group.add(t2Trunk, c2Foliage);

  return group;
}

// ----------------------------------------------------------------------------
// 15. BENCH (Curved park bench)
function buildBench() {
  const group = new THREE.Group();
  group.name = 'bench';

  const woodMat = new THREE.MeshStandardMaterial({ color: 0x935626, roughness: 0.55 });
  const ironMat = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.4, metalness: 0.8 });

  for (let i = 0; i < 3; i++) {
    const slat = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.04, 0.12), woodMat);
    slat.position.set(0, 0.35, -0.15 + i * 0.14);
    slat.castShadow = true;
    group.add(slat);
  }

  for (let i = 0; i < 2; i++) {
    const slat = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.12, 0.04), woodMat);
    slat.position.set(0, 0.55 + i * 0.16, -0.22);
    slat.castShadow = true;
    group.add(slat);
  }

  for (const dx of [-0.55, 0.55]) {
    const legF = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.35, 8), ironMat);
    legF.position.set(dx, 0.18, 0.12);
    const legB = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.7, 8), ironMat);
    legB.position.set(dx, 0.35, -0.22);
    const arm = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.04, 0.35), ironMat);
    arm.position.set(dx, 0.45, -0.05);
    group.add(legF, legB, arm);
  }

  return group;
}

// ----------------------------------------------------------------------------
// 16. LAMPPOST (Victorian street lantern)
function buildLamppost() {
  const group = new THREE.Group();
  group.name = 'lamppost';

  const ironMat = new THREE.MeshStandardMaterial({ color: 0x1c1e21, roughness: 0.35, metalness: 0.85 });
  const lanternMat = new THREE.MeshStandardMaterial({
    color: 0xffefb8,
    emissive: 0xffaa00,
    emissiveIntensity: 1.2,
    roughness: 0.1
  });

  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.18, 0.25, 12), ironMat);
  base.position.y = 0.125;
  group.add(base);

  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.06, 1.8, 12), ironMat);
  pole.position.y = 1.05;
  group.add(pole);

  const crossbar = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.03, 0.03), ironMat);
  crossbar.position.y = 1.8;
  group.add(crossbar);

  const casing = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.1, 0.28, 6), ironMat);
  casing.position.y = 2.05;
  group.add(casing);

  const bulb = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.08, 0.22, 6), lanternMat);
  bulb.position.y = 2.05;
  group.add(bulb);

  const cap = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.15, 6), ironMat);
  cap.position.y = 2.26;
  group.add(cap);

  return group;
}

// ----------------------------------------------------------------------------
// EXECUTE GENERATION OF ALL 16 ASSETS
async function buildAll() {
  console.log('Generating GLB 2.0 assets in:', outDir);

  await exportGLB(buildMapBoard(), 'map_board.glb');
  await exportGLB(buildSchool(), 'school.glb');
  await exportGLB(buildBakery(), 'bakery.glb');
  await exportGLB(buildHouseSet(), 'house_set.glb');
  await exportGLB(buildRoadTiles(), 'road_tiles.glb');
  await exportGLB(buildFountain(), 'fountain.glb');
  await exportGLB(buildTreeSet(), 'tree_set.glb');
  await exportGLB(buildBench(), 'bench.glb');
  await exportGLB(buildLamppost(), 'lamppost.glb');
  await exportGLB(buildBusToken(), 'bus_token.glb');
  await exportGLB(buildBirdToken(), 'bird_token.glb');
  await exportGLB(buildBellToken(), 'bell_token.glb');
  await exportGLB(buildWaterToken(), 'water_token.glb');
  await exportGLB(buildFootstepToken(), 'footstep_token.glb');
  await exportGLB(buildListenerMarker(), 'listener_marker.glb');
  await exportGLB(buildSoundRings(), 'sound_rings.glb');

  console.log('All 16 assets successfully built!');
}

buildAll().catch((err) => {
  console.error('Asset build failed:', err);
  process.exit(1);
});
