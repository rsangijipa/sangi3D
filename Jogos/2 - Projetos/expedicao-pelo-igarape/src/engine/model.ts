/**
 * Composite procedural 3D modeling utilities & hero assets:
 * - Dugout wooden Amazonian canoe (hollow lofted hull, gunwales, thwarts, ribs,
 *   coiled hemp rope, olive canvas expedition backpack, bow lantern, carved wooden paddle)
 * - Giant buttress-rooted Samaúma hero tree with overhanging macaw branch
 * - Authorized docking station mooring posts
 * - 7 composite anatomical Amazonian fauna actors with subtle life animations
 */

import * as THREE from 'three';
import { MaterialLibrary } from './pbr';
import { DockZone, FaunaSpec, terrainHeightAt } from '../sim/river';

/**
 * Create a continuous smoothly tapered organic tube along 3D control points.
 */
export function createTaperedTube(
  points: THREE.Vector3[],
  radiusStart: number,
  radiusEnd: number,
  tubularSegments = 16,
  radialSegments = 8,
  twistNoise = 0
): THREE.BufferGeometry {
  const curve = new THREE.CatmullRomCurve3(points);
  const frames = curve.computeFrenetFrames(tubularSegments, false);
  const positions: number[] = [];
  const normals: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];

  const P = new THREE.Vector3();
  const N = new THREE.Vector3();
  const B = new THREE.Vector3();
  const v = new THREE.Vector3();

  for (let i = 0; i <= tubularSegments; i++) {
    const t = i / tubularSegments;
    curve.getPointAt(t, P);
    N.copy(frames.normals[i]);
    B.copy(frames.binormals[i]);

    const rBase = THREE.MathUtils.lerp(radiusStart, radiusEnd, Math.pow(t, 0.85));

    for (let j = 0; j <= radialSegments; j++) {
      const u = j / radialSegments;
      const theta = u * Math.PI * 2;
      const sin = Math.sin(theta);
      const cos = -Math.cos(theta);

      const flute =
        twistNoise > 0
          ? 1 + Math.sin(theta * 5 + t * 4.5) * twistNoise * (1 - t * 0.6)
          : 1;
      const r = Math.max(0.004, rBase * flute);

      const nx = cos * N.x + sin * B.x;
      const ny = cos * N.y + sin * B.y;
      const nz = cos * N.z + sin * B.z;

      v.set(P.x + r * nx, P.y + r * ny, P.z + r * nz);
      positions.push(v.x, v.y, v.z);
      normals.push(nx, ny, nz);
      uvs.push(u * 2, t * 4);
    }
  }

  const stride = radialSegments + 1;
  for (let i = 0; i < tubularSegments; i++) {
    for (let j = 0; j < radialSegments; j++) {
      const a = i * stride + j;
      const b = (i + 1) * stride + j;
      const c = (i + 1) * stride + (j + 1);
      const d = i * stride + (j + 1);
      indices.push(a, b, d);
      indices.push(b, c, d);
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  return geo;
}

/**
 * Create a soft radial contact shadow disc grounded just above floorY.
 */
export function createContactShadowDisc(
  mats: MaterialLibrary,
  radiusX: number,
  radiusZ = radiusX,
  opacity = 0.48
): THREE.Mesh {
  const geo = new THREE.PlaneGeometry(radiusX * 2, radiusZ * 2);
  geo.rotateX(-Math.PI / 2);
  const mat = new THREE.MeshBasicMaterial({
    map: mats.contactShadowMap,
    transparent: true,
    opacity,
    depthWrite: false,
    polygonOffset: true,
    polygonOffsetFactor: -1,
    polygonOffsetUnits: -1,
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.userData.noAO = true;
  mesh.renderOrder = 2;
  return mesh;
}

/**
 * Lofted hollow wooden dugout canoe hull with thick walls, upturned pointed prow,
 * and stern. Bow faces -Z (z = -2.85), stern at +Z (z = +2.35).
 */
function createCanoeHullGeometry(): THREE.BufferGeometry {
  const zStations = 28;
  const positions: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];

  const halfSamples = 7;

  for (let iz = 0; iz <= zStations; iz++) {
    const t = iz / zStations; // 0 = bow (-2.85), 1 = stern (+2.35)
    const z = THREE.MathUtils.lerp(-2.85, 2.35, t);
    // Pointed bow, fuller midship, cleanly tapered closed stern
    const sinProfile = Math.sin(Math.pow(t, 0.86) * Math.PI);
    const widthProfile = Math.pow(Math.max(0, sinProfile), 0.68);
    const halfBeam = Math.max(0.012, 0.68 * widthProfile);
    // Lift keel cleanly above waterline (water y=0) so water never clips inside the canoe
    const rocker = Math.pow(Math.abs(t - 0.5) * 2.0, 2.3) * 0.22;
    const gunwaleHeight = 0.5 + rocker * 0.58;
    const keelY = 0.015 + rocker;
    const wallThick = Math.min(halfBeam * 0.72, 0.058 * (0.4 + 0.6 * widthProfile));

    const ring: [number, number][] = [];

    // 1. Outer hull from port gunwale (-x) down to keel (0) up to starboard gunwale (+x)
    for (let k = 0; k <= halfSamples * 2; k++) {
      const s = k / (halfSamples * 2);
      const u = s * 2 - 1;
      const x = u * halfBeam;
      const y = keelY + Math.pow(Math.abs(u), 1.55) * (gunwaleHeight - keelY);
      ring.push([x, y]);
    }
    // 2. Inner hull from starboard gunwale back to port gunwale (floor cleanly above water)
    for (let k = halfSamples * 2; k >= 0; k--) {
      const s = k / (halfSamples * 2);
      const u = s * 2 - 1;
      const innerBeam = Math.max(0.004, halfBeam - wallThick);
      const x = u * innerBeam;
      const innerKeel = keelY + 0.055;
      const y = innerKeel + Math.pow(Math.abs(u), 1.65) * (gunwaleHeight - innerKeel);
      ring.push([x, y]);
    }

    for (let p = 0; p < ring.length; p++) {
      const [px, py] = ring[p];
      positions.push(px, py, z);
      uvs.push((p / ring.length) * 1.4, t * 2.4);
    }
  }

  const ringCount = (halfSamples * 2 + 1) * 2;
  for (let iz = 0; iz < zStations; iz++) {
    for (let p = 0; p < ringCount; p++) {
      const pn = (p + 1) % ringCount;
      const a = iz * ringCount + p;
      const b = (iz + 1) * ringCount + p;
      const c = (iz + 1) * ringCount + pn;
      const d = iz * ringCount + pn;
      indices.push(a, b, d);
      indices.push(b, c, d);
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  return geo;
}

export interface CanoeRig {
  root: THREE.Group;
  paddlePivot: THREE.Group;
  paddleBladeTip: THREE.Object3D;
  lanternLight: THREE.PointLight;
  lanternGlassMat: THREE.MeshStandardMaterial;
}

/**
 * Assemble the hero wooden Amazonian dugout canoe with thwarts, watertight floorboard deck,
 * coiled rope, olive canvas expedition backpack, bow lantern, and articulated hand-carved paddle.
 */
export function buildCanoeRig(mats: MaterialLibrary): CanoeRig {
  const root = new THREE.Group();
  root.name = 'CanoaAmazonica';

  const woodMat = new THREE.MeshStandardMaterial({
    color: 0xe6d6c3,
    map: mats.canoeWood.map,
    normalMap: mats.canoeWood.normalMap,
    normalScale: new THREE.Vector2(0.75, 0.75),
    roughnessMap: mats.canoeWood.roughnessMap,
    roughness: 0.86,
    metalness: 0.02,
  });

  const trimWoodMat = new THREE.MeshStandardMaterial({
    color: 0xd4b996,
    map: mats.canoeWood.map,
    normalMap: mats.canoeWood.normalMap,
    normalScale: new THREE.Vector2(0.6, 0.6),
    roughness: 0.74,
    metalness: 0.03,
  });

  const hullMesh = new THREE.Mesh(createCanoeHullGeometry(), woodMat);
  hullMesh.castShadow = true;
  hullMesh.receiveShadow = true;
  root.add(hullMesh);

  // Solid tapered inner floorboard deck cleanly above water (prevents any water bleed)
  const floorShape = new THREE.Shape();
  floorShape.moveTo(0, -2.35);
  floorShape.quadraticCurveTo(0.46, -1.1, 0.44, 0.0);
  floorShape.quadraticCurveTo(0.42, 1.1, 0, 1.92);
  floorShape.quadraticCurveTo(-0.42, 1.1, -0.44, 0.0);
  floorShape.quadraticCurveTo(-0.46, -1.1, 0, -2.35);
  const floorGeo = new THREE.ShapeGeometry(floorShape, 14);
  floorGeo.rotateX(Math.PI / 2);
  const floorMesh = new THREE.Mesh(floorGeo, woodMat);
  floorMesh.position.y = 0.085;
  floorMesh.receiveShadow = true;
  root.add(floorMesh);

  // Bow & stern solid stempost endcaps
  const stemPost = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.045, 0.44, 8), trimWoodMat);
  stemPost.position.set(0, 0.45, -2.83);
  stemPost.rotation.x = 0.22;
  root.add(stemPost);

  const sternPost = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.045, 0.44, 8), trimWoodMat);
  sternPost.position.set(0, 0.45, 2.33);
  sternPost.rotation.x = -0.22;
  root.add(sternPost);

  // Gunwale rails (left & right wooden strips accentuating the curved rim)
  for (const side of [-1, 1]) {
    const railPts: THREE.Vector3[] = [];
    for (let i = 0; i <= 16; i++) {
      const t = i / 16;
      const z = THREE.MathUtils.lerp(-2.83, 2.33, t);
      const w = Math.pow(Math.max(0, Math.sin(Math.pow(t, 0.86) * Math.PI)), 0.68);
      const halfBeam = Math.max(0.015, 0.66 * w);
      const rocker = Math.pow(Math.abs(t - 0.5) * 2.0, 2.3) * 0.22;
      const y = 0.505 + rocker * 0.58;
      railPts.push(new THREE.Vector3(side * halfBeam, y, z));
    }
    const railGeo = createTaperedTube(railPts, 0.034, 0.034, 24, 6);
    const rail = new THREE.Mesh(railGeo, trimWoodMat);
    rail.castShadow = true;
    rail.receiveShadow = true;
    root.add(rail);
  }

  // Bow deck plate (small triangular foredeck matching mockup)
  const bowShape = new THREE.Shape();
  bowShape.moveTo(0, -0.58);
  bowShape.lineTo(0.28, 0);
  bowShape.lineTo(-0.28, 0);
  bowShape.closePath();
  const bowDeckGeo = new THREE.ExtrudeGeometry(bowShape, {
    depth: 0.042,
    bevelEnabled: true,
    bevelThickness: 0.008,
    bevelSize: 0.008,
    bevelSegments: 2,
  });
  bowDeckGeo.rotateX(Math.PI / 2);
  const bowDeck = new THREE.Mesh(bowDeckGeo, trimWoodMat);
  bowDeck.position.set(0, 0.54, -2.18);
  bowDeck.castShadow = true;
  bowDeck.receiveShadow = true;
  root.add(bowDeck);

  // Three weathered wooden thwarts (benches)
  const thwartSpecs = [
    { z: -1.78, width: 0.72, depth: 0.22, y: 0.42 },
    { z: -0.82, width: 1.12, depth: 0.24, y: 0.36 },
    { z: 0.94, width: 1.06, depth: 0.26, y: 0.36 },
  ];
  for (const th of thwartSpecs) {
    const geo = new THREE.BoxGeometry(th.width, 0.048, th.depth);
    const mesh = new THREE.Mesh(geo, trimWoodMat);
    mesh.position.set(0, th.y, th.z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    root.add(mesh);
  }

  // Interior raised floorboard slats
  for (const xOff of [-0.18, 0, 0.18]) {
    const slat = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.022, 3.1), trimWoodMat);
    slat.position.set(xOff, 0.1, -0.22);
    slat.receiveShadow = true;
    root.add(slat);
  }

  // Coiled natural hemp rope resting visibly between bow & middle thwart (matching mockup!)
  const ropeMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    map: mats.ropeFiber.map,
    normalMap: mats.ropeFiber.normalMap,
    roughnessMap: mats.ropeFiber.roughnessMap,
    roughness: 0.92,
    metalness: 0.0,
  });
  const ropePts: THREE.Vector3[] = [];
  for (let i = 0; i <= 48; i++) {
    const a = (i / 48) * Math.PI * 6.5;
    const rad = 0.08 + (i / 48) * 0.16;
    const lift = Math.floor(i / 22) * 0.024;
    ropePts.push(
      new THREE.Vector3(
        Math.cos(a) * rad - 0.04,
        0.13 + lift,
        -1.32 + Math.sin(a) * rad * 0.85
      )
    );
  }
  const ropeMesh = new THREE.Mesh(createTaperedTube(ropePts, 0.019, 0.018, 48, 6), ropeMat);
  ropeMesh.castShadow = true;
  ropeMesh.receiveShadow = true;
  root.add(ropeMesh);

  // Olive canvas expedition backpack sitting neatly lower-left inside canoe (matching mockup!)
  const packGroup = new THREE.Group();
  packGroup.position.set(-0.15, 0.24, -0.34);
  packGroup.rotation.y = 0.16;

  const canvasMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    map: mats.canvasFabric.map,
    normalMap: mats.canvasFabric.normalMap,
    roughnessMap: mats.canvasFabric.roughnessMap,
    roughness: 0.9,
    metalness: 0.02,
  });
  const strapMat = new THREE.MeshStandardMaterial({
    color: 0x22201c,
    roughness: 0.72,
    metalness: 0.08,
  });
  const buckleMat = new THREE.MeshStandardMaterial({
    color: 0xc29e52,
    roughness: 0.34,
    metalness: 0.85,
  });

  // Main rounded pack torso
  const packBody = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.3, 0.38), canvasMat);
  packBody.position.y = 0.05;
  packBody.castShadow = true;
  packBody.receiveShadow = true;
  packGroup.add(packBody);

  // Rounded top hood flap
  const packHood = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.21, 0.44, 12), canvasMat);
  packHood.rotation.z = Math.PI / 2;
  packHood.position.set(0, 0.18, -0.02);
  packHood.scale.set(0.85, 1, 0.95);
  packHood.castShadow = true;
  packGroup.add(packHood);

  // Two side utility pouches
  for (const sx of [-0.25, 0.25]) {
    const pouch = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.18, 0.22), canvasMat);
    pouch.position.set(sx, 0.02, 0.02);
    pouch.castShadow = true;
    packGroup.add(pouch);
  }

  // Straps + brass buckles
  for (const sx of [-0.12, 0.12]) {
    const strap = new THREE.Mesh(new THREE.BoxGeometry(0.036, 0.34, 0.41), strapMat);
    strap.position.set(sx, 0.08, 0);
    packGroup.add(strap);

    const buckle = new THREE.Mesh(new THREE.BoxGeometry(0.048, 0.036, 0.028), buckleMat);
    buckle.position.set(sx, 0.06, 0.205);
    packGroup.add(buckle);
  }
  root.add(packGroup);

  // Subtle brass bow oil lantern (illuminates at Pôr do Sol & Crepúsculo)
  const lanternGroup = new THREE.Group();
  lanternGroup.position.set(0, 0.6, -2.32);
  const brassMat = new THREE.MeshStandardMaterial({
    color: 0x9b7939,
    roughness: 0.38,
    metalness: 0.82,
  });
  const lanternBase = new THREE.Mesh(new THREE.CylinderGeometry(0.048, 0.06, 0.045, 10), brassMat);
  lanternGroup.add(lanternBase);
  const lanternGlassMat = new THREE.MeshStandardMaterial({
    color: 0xffe4aa,
    emissive: 0xffa638,
    emissiveIntensity: 0.0,
    roughness: 0.15,
    metalness: 0.05,
    transparent: true,
    opacity: 0.85,
  });
  const lanternGlass = new THREE.Mesh(
    new THREE.CylinderGeometry(0.038, 0.042, 0.095, 10),
    lanternGlassMat
  );
  lanternGlass.position.y = 0.07;
  lanternGroup.add(lanternGlass);
  const lanternCap = new THREE.Mesh(new THREE.ConeGeometry(0.058, 0.042, 10), brassMat);
  lanternCap.position.y = 0.135;
  lanternGroup.add(lanternCap);
  root.add(lanternGroup);

  const lanternLight = new THREE.PointLight(0xffb454, 0, 14, 1.8);
  lanternLight.position.set(0, 0.76, -2.32);
  root.add(lanternLight);

  // Hand-carved wooden paddle angled cleanly along right side into water (matching mockup!)
  const paddlePivot = new THREE.Group();
  paddlePivot.position.set(0.38, 0.56, -0.08);

  const paddleMat = new THREE.MeshStandardMaterial({
    color: 0xf2dfc2,
    map: mats.paddleWood.map,
    normalMap: mats.paddleWood.normalMap,
    normalScale: new THREE.Vector2(0.7, 0.7),
    roughnessMap: mats.paddleWood.roughnessMap,
    roughness: 0.58,
    metalness: 0.02,
  });

  // Shaft extending diagonally forward-right from near hands out over gunwale
  const shaftPts = [
    new THREE.Vector3(-0.08, 0.18, 0.25),
    new THREE.Vector3(0.24, -0.02, -0.35),
    new THREE.Vector3(0.62, -0.26, -1.02),
  ];
  const shaftGeo = createTaperedTube(shaftPts, 0.022, 0.018, 14, 8);
  const shaft = new THREE.Mesh(shaftGeo, paddleMat);
  shaft.castShadow = true;
  paddlePivot.add(shaft);

  // T-handle grip
  const grip = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.13, 8), paddleMat);
  grip.rotation.z = Math.PI / 2;
  grip.position.set(-0.08, 0.18, 0.25);
  paddlePivot.add(grip);

  // Broad leaf-shaped Amazonian wooden paddle blade visible dipping near right-side water
  const bladeShape = new THREE.Shape();
  bladeShape.moveTo(0, 0);
  bladeShape.bezierCurveTo(0.055, -0.09, 0.145, -0.24, 0.12, -0.46);
  bladeShape.bezierCurveTo(0.095, -0.58, 0.04, -0.66, 0, -0.68);
  bladeShape.bezierCurveTo(-0.04, -0.66, -0.095, -0.58, -0.12, -0.46);
  bladeShape.bezierCurveTo(-0.145, -0.24, -0.055, -0.09, 0, 0);

  const bladeGeo = new THREE.ExtrudeGeometry(bladeShape, {
    depth: 0.018,
    bevelEnabled: true,
    bevelThickness: 0.006,
    bevelSize: 0.005,
    bevelSegments: 2,
  });
  bladeGeo.center();
  const blade = new THREE.Mesh(bladeGeo, paddleMat);
  blade.position.set(0.76, -0.36, -1.26);
  blade.rotation.set(1.06, -0.46, 0.34);
  blade.castShadow = true;
  paddlePivot.add(blade);

  const paddleBladeTip = new THREE.Object3D();
  paddleBladeTip.position.set(0.86, -0.48, -1.42);
  paddlePivot.add(paddleBladeTip);

  root.add(paddlePivot);

  return {
    root,
    paddlePivot,
    paddleBladeTip,
    lanternLight,
    lanternGlassMat,
  };
}

/**
 * Giant iconic Samaúma tree with dramatic splayed buttress roots entering the igarapé
 * and an overhanging mossy perch branch for the Arara-canindé (matching the mockup left bank).
 */
export function buildSamaumaHero(
  mats: MaterialLibrary,
  foliageMat: THREE.Material,
  origin: THREE.Vector3,
  perchWorldPos: THREE.Vector3
): THREE.Group {
  const group = new THREE.Group();
  group.position.copy(origin);

  const barkMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    map: mats.mossyBark.map,
    normalMap: mats.mossyBark.normalMap,
    normalScale: new THREE.Vector2(1.4, 1.4),
    roughnessMap: mats.mossyBark.roughnessMap,
    roughness: 0.92,
    metalness: 0.0,
  });

  // Massive fluted trunk
  const trunkPts = [
    new THREE.Vector3(0, -0.6, 0),
    new THREE.Vector3(0.15, 2.2, -0.1),
    new THREE.Vector3(0.05, 5.8, -0.25),
    new THREE.Vector3(-0.2, 10.5, -0.4),
    new THREE.Vector3(-0.4, 15.0, -0.3),
  ];
  const trunk = new THREE.Mesh(createTaperedTube(trunkPts, 1.35, 0.62, 18, 12, 0.14), barkMat);
  trunk.castShadow = true;
  trunk.receiveShadow = true;
  group.add(trunk);

  // 9 splayed buttress roots reaching dramatically toward and into the dark water!
  const rootAngles = [-0.95, -0.58, -0.24, 0.08, 0.36, 0.68, 1.05, 1.65, 2.55];
  for (let i = 0; i < rootAngles.length; i++) {
    const a = rootAngles[i];
    const reachesWater = a > -1.0 && a < 1.1;
    const reach = reachesWater ? 3.8 + (i % 3) * 0.65 : 2.6;
    const dirX = Math.cos(a);
    const dirZ = Math.sin(a);
    const startY = reachesWater ? 2.8 + (i % 2) * 0.75 : 2.1;

    const rPts = [
      new THREE.Vector3(dirX * 0.45, startY, dirZ * 0.45),
      new THREE.Vector3(dirX * (reach * 0.42), startY * 0.52, dirZ * (reach * 0.42)),
      new THREE.Vector3(dirX * (reach * 0.78), 0.38, dirZ * (reach * 0.78)),
      new THREE.Vector3(dirX * reach, -0.48, dirZ * reach),
    ];
    const rootMesh = new THREE.Mesh(
      createTaperedTube(rPts, 0.44, 0.11, 14, 7, 0.08),
      barkMat
    );
    rootMesh.castShadow = true;
    rootMesh.receiveShadow = true;
    group.add(rootMesh);
  }

  // Exact overhanging branch reaching to the Arara-canindé perch world position
  const localPerch = perchWorldPos.clone().sub(origin);
  const branchPts = [
    new THREE.Vector3(0.25, 4.15, 0.1),
    new THREE.Vector3(localPerch.x * 0.48, localPerch.y + 0.35, localPerch.z * 0.45),
    new THREE.Vector3(localPerch.x, localPerch.y - 0.05, localPerch.z),
    new THREE.Vector3(localPerch.x + 1.1, localPerch.y + 0.18, localPerch.z - 0.35),
  ];
  const perchBranch = new THREE.Mesh(
    createTaperedTube(branchPts, 0.24, 0.055, 16, 8, 0.05),
    barkMat
  );
  perchBranch.castShadow = true;
  perchBranch.receiveShadow = true;
  group.add(perchBranch);

  // Upper arching canopy boughs + leafy clusters overhead
  const boughDirs = [
    [4.6, 8.6, -1.2],
    [5.8, 10.2, 1.4],
    [-2.5, 11.4, -2.6],
    [2.4, 12.2, -4.4],
  ];
  const cardGeo = new THREE.PlaneGeometry(3.8, 3.8);
  for (const [bx, by, bz] of boughDirs) {
    const bPts = [
      new THREE.Vector3(0, by - 2.6, 0),
      new THREE.Vector3(bx * 0.55, by - 0.8, bz * 0.55),
      new THREE.Vector3(bx, by, bz),
    ];
    const bough = new THREE.Mesh(createTaperedTube(bPts, 0.36, 0.1, 10, 6), barkMat);
    bough.castShadow = true;
    group.add(bough);

    for (let c = 0; c < 4; c++) {
      const card = new THREE.Mesh(cardGeo, foliageMat);
      card.position.set(
        bx + (c - 1.5) * 1.1,
        by - 0.4 + (c % 2) * 0.85,
        bz + ((c * 37) % 3 - 1) * 1.1
      );
      card.rotation.set(-0.45 + c * 0.18, c * 1.15, (c % 2 - 0.5) * 0.5);
      group.add(card);
    }
  }

  return group;
}

/**
 * Authorized riverbank docking station with weathered mooring post, rope collar,
 * rustic green-accent marker board, and subtle lantern.
 */
export function buildDockingStation(mats: MaterialLibrary, zone: DockZone): THREE.Group {
  const group = new THREE.Group();
  const groundY = Math.max(0.05, terrainHeightAt(zone.postPosition.x, zone.postPosition.z));
  group.position.set(zone.postPosition.x, groundY, zone.postPosition.z);

  const barkMat = new THREE.MeshStandardMaterial({
    color: 0xc2b29a,
    map: mats.canoeWood.map,
    normalMap: mats.canoeWood.normalMap,
    roughness: 0.86,
  });
  const ropeMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    map: mats.ropeFiber.map,
    roughness: 0.92,
  });

  // Main weathered timber mooring post
  const post = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.14, 1.55, 8), barkMat);
  post.position.y = 0.65;
  post.rotation.z = zone.side * -0.08;
  post.castShadow = true;
  post.receiveShadow = true;
  group.add(post);

  // Secondary mooring cleat stake closer to water
  const stake = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.09, 0.95, 7), barkMat);
  stake.position.set(-zone.side * 0.52, 0.25, 0.28);
  stake.rotation.z = zone.side * 0.12;
  stake.castShadow = true;
  group.add(stake);

  // Coiled rope collar around post
  for (let r = 0; r < 3; r++) {
    const torus = new THREE.Mesh(new THREE.TorusGeometry(0.125, 0.022, 6, 14), ropeMat);
    torus.rotation.x = Math.PI / 2;
    torus.position.set(zone.side * -0.05, 0.72 + r * 0.045, 0);
    group.add(torus);
  }

  // Naturalist reserve marker plaque (dark forest green & warm cream symbol)
  const board = new THREE.Mesh(
    new THREE.BoxGeometry(0.54, 0.32, 0.04),
    new THREE.MeshStandardMaterial({ color: 0x1d4e2c, roughness: 0.72 })
  );
  board.position.set(zone.side * -0.1, 1.24, 0.04);
  board.rotation.y = zone.side > 0 ? -Math.PI * 0.52 : Math.PI * 0.52;
  board.castShadow = true;
  group.add(board);

  // Warm beacon glass cap on top of post (glows gently so docking zones are legible)
  const cap = new THREE.Mesh(
    new THREE.CylinderGeometry(0.085, 0.095, 0.12, 8),
    new THREE.MeshStandardMaterial({
      color: 0xbef2b0,
      emissive: 0x56c96e,
      emissiveIntensity: 0.85,
      roughness: 0.25,
    })
  );
  cap.position.set(zone.side * -0.11, 1.46, 0);
  group.add(cap);

  const shadow = createContactShadowDisc(mats, 0.85, 0.85, 0.42);
  shadow.position.y = 0.02;
  group.add(shadow);

  return group;
}

export interface FaunaActor {
  spec: FaunaSpec;
  group: THREE.Group;
  update: (elapsed: number, worldPos: THREE.Vector3) => void;
}

/**
 * Build composite multi-part 3D Amazonian fauna actors.
 * Every actor has 6–12 distinct anatomical sub-meshes with varied roughness,
 * clear silhouette readability, and subtle procedural life animation.
 */
export function buildFaunaActor(spec: FaunaSpec, mats: MaterialLibrary): FaunaActor {
  const group = new THREE.Group();
  group.name = `Fauna_${spec.id}`;
  group.scale.setScalar(spec.scale);

  let animUpdate: (elapsed: number) => void = () => {};

  if (spec.id === 'arara_caninde') {
    const blueMat = new THREE.MeshStandardMaterial({ color: 0x1472c8, roughness: 0.58 });
    const yellowMat = new THREE.MeshStandardMaterial({ color: 0xf4b622, roughness: 0.55 });
    const turquoiseMat = new THREE.MeshStandardMaterial({ color: 0x22999e, roughness: 0.52 });
    const cheekMat = new THREE.MeshStandardMaterial({ color: 0xf2efe4, roughness: 0.72 });
    const beakMat = new THREE.MeshStandardMaterial({ color: 0x181a1c, roughness: 0.22, metalness: 0.12 });

    // Torso (golden breast + cobalt back)
    const breast = new THREE.Mesh(new THREE.SphereGeometry(0.14, 12, 10), yellowMat);
    breast.scale.set(0.85, 1.45, 0.92);
    breast.position.set(0, 0.26, 0.02);
    breast.castShadow = true;
    group.add(breast);

    const back = new THREE.Mesh(new THREE.SphereGeometry(0.145, 12, 10), blueMat);
    back.scale.set(0.92, 1.48, 0.88);
    back.position.set(0, 0.28, -0.04);
    back.castShadow = true;
    group.add(back);

    // Folded wings
    for (const s of [-1, 1]) {
      const wing = new THREE.Mesh(new THREE.SphereGeometry(0.085, 10, 8), blueMat);
      wing.scale.set(0.55, 2.2, 0.95);
      wing.position.set(s * 0.11, 0.21, -0.04);
      wing.rotation.x = 0.18;
      group.add(wing);
    }

    // Long tapered tail feathers hanging below perch
    const tailPts = [
      new THREE.Vector3(0, 0.12, -0.08),
      new THREE.Vector3(0, -0.18, -0.18),
      new THREE.Vector3(0, -0.58, -0.26),
    ];
    const tail = new THREE.Mesh(createTaperedTube(tailPts, 0.052, 0.014, 10, 6), blueMat);
    tail.castShadow = true;
    group.add(tail);

    // Articulated head with turquoise crown, white cheek patch, glossy hooked beak
    const headGroup = new THREE.Group();
    headGroup.position.set(0, 0.46, 0.03);
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.098, 12, 10), turquoiseMat);
    head.scale.set(0.95, 0.98, 1.05);
    headGroup.add(head);

    for (const s of [-1, 1]) {
      const cheek = new THREE.Mesh(new THREE.SphereGeometry(0.058, 8, 8), cheekMat);
      cheek.position.set(s * 0.056, -0.01, 0.035);
      headGroup.add(cheek);

      const eye = new THREE.Mesh(new THREE.SphereGeometry(0.017, 8, 6), beakMat);
      eye.position.set(s * 0.075, 0.01, 0.058);
      headGroup.add(eye);
    }

    const beakPts = [
      new THREE.Vector3(0, 0.02, 0.07),
      new THREE.Vector3(0, 0.01, 0.155),
      new THREE.Vector3(0, -0.06, 0.165),
    ];
    const beak = new THREE.Mesh(createTaperedTube(beakPts, 0.044, 0.008, 8, 6), beakMat);
    headGroup.add(beak);
    group.add(headGroup);

    // Claws gripping branch
    for (const s of [-1, 1]) {
      const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.016, 0.09, 6), beakMat);
      foot.position.set(s * 0.055, 0.04, 0);
      group.add(foot);
    }

    animUpdate = (t) => {
      headGroup.rotation.y = Math.sin(t * 1.15) * 0.35;
      headGroup.rotation.z = Math.sin(t * 0.72) * 0.08;
      tail.rotation.x = Math.sin(t * 1.6) * 0.05;
    };
  } else if (spec.id === 'capivara') {
    const furMat = new THREE.MeshStandardMaterial({ color: 0x73563a, roughness: 0.92 });
    const darkFurMat = new THREE.MeshStandardMaterial({ color: 0x4b3826, roughness: 0.88 });
    const eyeMat = new THREE.MeshStandardMaterial({ color: 0x121210, roughness: 0.18 });

    // Heavy barrel torso
    const body = new THREE.Mesh(new THREE.SphereGeometry(0.38, 14, 12), furMat);
    body.scale.set(0.86, 0.88, 1.48);
    body.position.set(0, 0.46, 0);
    body.castShadow = true;
    body.receiveShadow = true;
    group.add(body);

    // Rump mass
    const rump = new THREE.Mesh(new THREE.SphereGeometry(0.32, 12, 10), darkFurMat);
    rump.scale.set(0.85, 0.92, 1.05);
    rump.position.set(0, 0.44, -0.34);
    rump.castShadow = true;
    group.add(rump);

    // Distinctive rectangular-snout capybara head
    const headGroup = new THREE.Group();
    headGroup.position.set(0, 0.62, 0.52);

    const skull = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.24, 0.36), furMat);
    skull.position.set(0, 0, 0.08);
    skull.castShadow = true;
    headGroup.add(skull);

    const snout = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.2, 0.18), darkFurMat);
    snout.position.set(0, -0.02, 0.28);
    headGroup.add(snout);

    for (const s of [-1, 1]) {
      const ear = new THREE.Mesh(new THREE.SphereGeometry(0.045, 8, 6), darkFurMat);
      ear.scale.set(0.6, 1.0, 0.9);
      ear.position.set(s * 0.11, 0.12, -0.04);
      headGroup.add(ear);

      const eye = new THREE.Mesh(new THREE.SphereGeometry(0.024, 8, 6), eyeMat);
      eye.position.set(s * 0.125, 0.055, 0.12);
      headGroup.add(eye);
    }
    group.add(headGroup);

    // 4 sturdy grounded legs
    const legCoords: [number, number][] = [
      [-0.17, 0.32],
      [0.17, 0.32],
      [-0.18, -0.32],
      [0.18, -0.32],
    ];
    for (const [lx, lz] of legCoords) {
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.072, 0.058, 0.38, 8), darkFurMat);
      leg.position.set(lx, 0.19, lz);
      leg.castShadow = true;
      group.add(leg);
    }

    const shadow = createContactShadowDisc(mats, 0.72, 0.92, 0.5);
    shadow.position.y = 0.02;
    group.add(shadow);

    animUpdate = (t) => {
      headGroup.rotation.x = Math.sin(t * 0.85) * 0.09 + 0.04;
      headGroup.rotation.y = Math.sin(t * 0.45) * 0.16;
    };
  } else if (spec.id === 'garca_branca') {
    const whiteMat = new THREE.MeshStandardMaterial({ color: 0xf6f7f2, roughness: 0.65 });
    const beakMat = new THREE.MeshStandardMaterial({ color: 0xe69f1e, roughness: 0.32 });
    const legMat = new THREE.MeshStandardMaterial({ color: 0x262825, roughness: 0.72 });

    // Long wading legs
    for (const s of [-1, 1]) {
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.012, 0.66, 6), legMat);
      leg.position.set(s * 0.055, 0.33, 0);
      group.add(leg);
    }
    // Slender white body
    const body = new THREE.Mesh(new THREE.SphereGeometry(0.16, 12, 10), whiteMat);
    body.scale.set(0.75, 0.92, 1.75);
    body.position.set(0, 0.72, -0.02);
    body.rotation.x = 0.25;
    body.castShadow = true;
    group.add(body);

    // Graceful S-curved neck + head + dagger beak
    const neckGroup = new THREE.Group();
    neckGroup.position.set(0, 0.82, 0.16);
    const neckPts = [
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 0.18, 0.08),
      new THREE.Vector3(0, 0.36, -0.04),
      new THREE.Vector3(0, 0.5, 0.06),
    ];
    const neck = new THREE.Mesh(createTaperedTube(neckPts, 0.042, 0.028, 12, 7), whiteMat);
    neck.castShadow = true;
    neckGroup.add(neck);

    const head = new THREE.Mesh(new THREE.SphereGeometry(0.052, 10, 8), whiteMat);
    head.scale.set(0.85, 0.85, 1.35);
    head.position.set(0, 0.52, 0.09);
    neckGroup.add(head);

    const beak = new THREE.Mesh(new THREE.ConeGeometry(0.024, 0.22, 6), beakMat);
    beak.rotation.x = Math.PI / 2 + 0.08;
    beak.position.set(0, 0.51, 0.24);
    neckGroup.add(beak);

    group.add(neckGroup);

    const shadow = createContactShadowDisc(mats, 0.34, 0.42, 0.4);
    shadow.position.y = 0.02;
    group.add(shadow);

    animUpdate = (t) => {
      neckGroup.rotation.x = Math.sin(t * 0.7) * 0.08;
      neckGroup.rotation.y = Math.sin(t * 0.48) * 0.22;
    };
  } else if (spec.id === 'tucano_toco') {
    const blackMat = new THREE.MeshStandardMaterial({ color: 0x17181a, roughness: 0.52 });
    const whiteMat = new THREE.MeshStandardMaterial({ color: 0xf7f3dc, roughness: 0.65 });
    const orangeMat = new THREE.MeshStandardMaterial({ color: 0xf27d16, roughness: 0.28 });
    const blueRingMat = new THREE.MeshStandardMaterial({ color: 0x2f8de0, roughness: 0.4 });

    const body = new THREE.Mesh(new THREE.SphereGeometry(0.135, 12, 10), blackMat);
    body.scale.set(0.85, 1.38, 1.0);
    body.position.set(0, 0.24, 0);
    body.castShadow = true;
    group.add(body);

    const bib = new THREE.Mesh(new THREE.SphereGeometry(0.115, 10, 8), whiteMat);
    bib.scale.set(0.82, 1.05, 0.75);
    bib.position.set(0, 0.32, 0.065);
    group.add(bib);

    const tail = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.28, 0.025), blackMat);
    tail.position.set(0, 0.05, -0.14);
    tail.rotation.x = 0.22;
    group.add(tail);

    const headGroup = new THREE.Group();
    headGroup.position.set(0, 0.42, 0.04);
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.088, 10, 8), blackMat);
    headGroup.add(head);

    for (const s of [-1, 1]) {
      const ring = new THREE.Mesh(new THREE.SphereGeometry(0.024, 8, 6), blueRingMat);
      ring.position.set(s * 0.072, 0.015, 0.042);
      headGroup.add(ring);
    }

    // Iconic large curved orange toucan beak
    const beakPts = [
      new THREE.Vector3(0, 0.01, 0.06),
      new THREE.Vector3(0, 0.02, 0.22),
      new THREE.Vector3(0, -0.02, 0.35),
    ];
    const beak = new THREE.Mesh(createTaperedTube(beakPts, 0.052, 0.016, 10, 7), orangeMat);
    beak.castShadow = true;
    headGroup.add(beak);

    const beakTip = new THREE.Mesh(new THREE.SphereGeometry(0.022, 8, 6), blackMat);
    beakTip.position.set(0, -0.024, 0.355);
    headGroup.add(beakTip);
    group.add(headGroup);

    animUpdate = (t) => {
      headGroup.rotation.y = Math.sin(t * 1.35) * 0.4;
      headGroup.rotation.x = Math.sin(t * 0.9) * 0.1;
    };
  } else if (spec.id === 'boto_rosa') {
    const pinkMat = new THREE.MeshStandardMaterial({
      color: 0xd9929c,
      roughness: 0.22,
      metalness: 0.05,
    });
    const bellyMat = new THREE.MeshStandardMaterial({
      color: 0xe6b5bc,
      roughness: 0.24,
    });

    // Streamlined dolphin spine body
    const spinePts = [
      new THREE.Vector3(0, 0.04, 1.05),
      new THREE.Vector3(0, 0.14, 0.55),
      new THREE.Vector3(0, 0.2, 0.0),
      new THREE.Vector3(0, 0.1, -0.65),
      new THREE.Vector3(0, -0.05, -1.2),
    ];
    const body = new THREE.Mesh(createTaperedTube(spinePts, 0.06, 0.22, 16, 10), pinkMat);
    // Use a fuller mid-body ellipsoid + tapered tail
    const torso = new THREE.Mesh(new THREE.SphereGeometry(0.28, 14, 10), pinkMat);
    torso.scale.set(0.82, 0.78, 2.35);
    torso.position.set(0, 0.14, 0.05);
    torso.castShadow = true;
    group.add(torso);
    group.add(body);

    // Bulbous melon forehead + long slender rostrum
    const melon = new THREE.Mesh(new THREE.SphereGeometry(0.16, 10, 8), bellyMat);
    melon.position.set(0, 0.18, 0.66);
    group.add(melon);

    const rostrum = new THREE.Mesh(new THREE.CylinderGeometry(0.026, 0.055, 0.44, 8), pinkMat);
    rostrum.rotation.x = Math.PI / 2;
    rostrum.position.set(0, 0.12, 0.96);
    group.add(rostrum);

    // Pectoral flippers + tail fluke
    for (const s of [-1, 1]) {
      const fin = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.03, 0.16), pinkMat);
      fin.position.set(s * 0.26, 0.06, 0.25);
      fin.rotation.set(0.1, -s * 0.35, -s * 0.28);
      group.add(fin);
    }
    const fluke = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.03, 0.2), pinkMat);
    fluke.position.set(0, -0.05, -1.22);
    group.add(fluke);

    animUpdate = (t) => {
      // Gentle surfacing pitch arc
      group.rotation.x = Math.cos(t * 0.85) * 0.26;
      group.rotation.y = -t * 0.24 + Math.PI / 2;
    };
  } else if (spec.id === 'preguica') {
    const coatMat = new THREE.MeshStandardMaterial({ color: 0x6f6e59, roughness: 0.94 });
    const faceMat = new THREE.MeshStandardMaterial({ color: 0xcfc7b0, roughness: 0.85 });
    const darkMat = new THREE.MeshStandardMaterial({ color: 0x2b241d, roughness: 0.7 });

    // Clinging torso hanging under branch
    const body = new THREE.Mesh(new THREE.SphereGeometry(0.24, 12, 10), coatMat);
    body.scale.set(0.88, 0.82, 1.35);
    body.position.set(0, -0.26, 0);
    body.castShadow = true;
    group.add(body);

    const head = new THREE.Mesh(new THREE.SphereGeometry(0.13, 10, 8), faceMat);
    head.position.set(0, -0.18, 0.3);
    group.add(head);

    for (const s of [-1, 1]) {
      const mask = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.035, 0.05), darkMat);
      mask.position.set(s * 0.055, -0.16, 0.39);
      group.add(mask);
    }

    // 4 curved limbs reaching upward to grip branch
    const limbOffsets: [number, number][] = [
      [-0.14, 0.22],
      [0.14, 0.22],
      [-0.14, -0.22],
      [0.14, -0.22],
    ];
    for (const [lx, lz] of limbOffsets) {
      const pts = [
        new THREE.Vector3(lx, -0.22, lz),
        new THREE.Vector3(lx * 1.15, -0.06, lz),
        new THREE.Vector3(lx * 0.4, 0.06, lz),
      ];
      const limb = new THREE.Mesh(createTaperedTube(pts, 0.052, 0.035, 8, 6), coatMat);
      group.add(limb);
    }

    animUpdate = (t) => {
      group.rotation.z = Math.sin(t * 0.42) * 0.045;
      head.rotation.y = Math.sin(t * 0.3) * 0.25;
    };
  } else {
    // Borboleta Morpho-azul
    const wingMat = new THREE.MeshStandardMaterial({
      color: 0x1688ff,
      emissive: 0x0a3d8f,
      emissiveIntensity: 0.45,
      roughness: 0.22,
      metalness: 0.35,
      side: THREE.DoubleSide,
    });
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0x181b22, roughness: 0.7 });

    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.014, 0.14, 6), bodyMat);
    body.rotation.x = Math.PI / 2;
    group.add(body);

    const wingShape = new THREE.Shape();
    wingShape.moveTo(0, 0);
    wingShape.bezierCurveTo(0.14, 0.14, 0.24, 0.06, 0.18, -0.04);
    wingShape.bezierCurveTo(0.22, -0.14, 0.1, -0.18, 0, -0.06);
    wingShape.closePath();
    const wingGeo = new THREE.ShapeGeometry(wingShape);
    wingGeo.rotateX(-Math.PI / 2);

    const leftWing = new THREE.Mesh(wingGeo, wingMat);
    const rightWing = new THREE.Mesh(wingGeo, wingMat);
    rightWing.scale.x = -1;
    group.add(leftWing, rightWing);

    animUpdate = (t) => {
      const flap = Math.sin(t * 11.5) * 0.78 + 0.15;
      leftWing.rotation.z = flap;
      rightWing.rotation.z = -flap;
      group.rotation.y = Math.atan2(-Math.sin(t * 0.9 + spec.s), Math.cos(t * 1.35 + spec.s));
    };
  }

  return {
    spec,
    group,
    update: (elapsed: number, worldPos: THREE.Vector3) => {
      group.position.copy(worldPos);
      animUpdate(elapsed);
    },
  };
}
