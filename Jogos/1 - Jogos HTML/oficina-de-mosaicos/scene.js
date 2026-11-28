import * as THREE from '../../../Sistema/shared/vendor/three.module.js';
import { SIDE, CELL, TOTAL, colors, shapes, grouts, noise } from './model.js';

const WIDTH = SIDE * CELL;
const TILE_Y = .327;
const groutPlaneY = .324;
const topTilt = .24;

function texture(size, sample, srgb = false) {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  const pixels = ctx.createImageData(size, size);
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    const [r, g, b] = sample(x / size, y / size, noise(x + y * size));
    pixels.data.set([r, g, b, 255], (x + y * size) * 4);
  }
  ctx.putImageData(pixels, 0, 0);
  const result = new THREE.CanvasTexture(canvas);
  if (srgb) result.colorSpace = THREE.SRGBColorSpace;
  result.anisotropy = 4;
  return result;
}

function wood(x, y, grit) {
  const board = Math.floor(y * 13);
  const along = y * 13 - board;
  const wave = y + Math.sin(x * 22 + board * 1.31) * .003 + Math.cos(x * 8 - board) * .007;
  const fiber = Math.sin(wave * 2157) * 4 + Math.cos(wave * 1860) * 5;
  const tone = fiber + 15 * noise(board + 21) + (grit - .5) * 10;
  const joint = along < .024 ? 20 : 0;
  return [112 + tone - joint, 75 + tone - joint, 48 + tone - joint];
}

function cutAt(points, side) {
  const output = [];
  const signed = ([x, y]) => side * (x - y * .23) - .052;
  for (let i = 0; i < points.length; i++) {
    const a = points[i];
    const b = points[(i + 1) % points.length];
    const start = signed(a);
    const end = signed(b);
    if (start >= 0) output.push(a);
    if ((start >= 0) !== (end >= 0)) {
      const progress = start / (start - end);
      output.push([a[0] + (b[0] - a[0]) * progress, a[1] + (b[1] - a[1]) * progress]);
    }
  }
  return output;
}

function ceramicGeometry(points) {
  const form = new THREE.Shape(points.map(([x, y]) => new THREE.Vector2(x * CELL, y * CELL)));
  const geometry = new THREE.ExtrudeGeometry(form, {
    depth: .043,
    bevelEnabled: true,
    bevelSegments: 2,
    bevelSize: .011,
    bevelThickness: .01,
    steps: 1,
  });
  geometry.rotateX(-Math.PI / 2);
  return geometry;
}

function roundedBox(width, height, depth, radius) {
  const x = width / 2;
  const z = depth / 2;
  const shape = new THREE.Shape();
  shape.moveTo(-x + radius, -z);
  shape.lineTo(x - radius, -z);
  shape.quadraticCurveTo(x, -z, x, -z + radius);
  shape.lineTo(x, z - radius);
  shape.quadraticCurveTo(x, z, x - radius, z);
  shape.lineTo(-x + radius, z);
  shape.quadraticCurveTo(-x, z, -x, z - radius);
  shape.lineTo(-x, -z + radius);
  shape.quadraticCurveTo(-x, -z, -x + radius, -z);
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: height - .04,
    bevelEnabled: true,
    bevelSize: .022,
    bevelThickness: .02,
    bevelSegments: 2,
    curveSegments: 4,
  });
  geometry.rotateX(-Math.PI / 2);
  return geometry;
}

function mesh(geometry, material, x, y, z) {
  const object = new THREE.Mesh(geometry, material);
  object.position.set(x, y, z);
  object.castShadow = true;
  object.receiveShadow = true;
  return object;
}

function shadow() {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 128;
  const ctx = canvas.getContext('2d');
  const gradient = ctx.createRadialGradient(64, 64, 10, 64, 64, 64);
  gradient.addColorStop(0, 'rgba(39,24,13,.72)');
  gradient.addColorStop(.66, 'rgba(39,24,13,.49)');
  gradient.addColorStop(1, 'rgba(39,24,13,0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 128, 128);
  return new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(canvas), transparent: true, depthWrite: false });
}

function tabletop(scene, ceramic, frameMaterial) {
  const timber = texture(512, wood, true);
  const table = mesh(new THREE.PlaneGeometry(29, 24), new THREE.MeshStandardMaterial({
    map: timber, roughness: .83, bumpMap: timber, bumpScale: .03,
  }), 0, 0, 0);
  table.rotation.x = -Math.PI / 2;
  table.castShadow = false;
  scene.add(table);

  const occlusion = shadow();
  function contact(x, z, w, d) {
    const plane = mesh(new THREE.PlaneGeometry(w, d), occlusion, x, .006, z);
    plane.rotation.x = -Math.PI / 2;
    plane.castShadow = false;
    plane.receiveShadow = false;
    scene.add(plane);
  }
  contact(-.12, .22, 9.2, 8.4);

  const linen = texture(256, (x, y, grain) => {
    const fibers = Math.sin(x * 762) * 6 + Math.cos(y * 765) * 7 + grain * 6;
    const stripe = Math.min(x, 1 - x) < .12 && Math.sin(x * 108) > 0;
    return stripe ? [93 + fibers, 100 + fibers, 78 + fibers] : [172 + fibers, 153 + fibers, 119 + fibers];
  }, true);
  const ragGeometry = new THREE.PlaneGeometry(3.7, 4.8, 32, 32);
  const positions = ragGeometry.attributes.position;
  for (let i = 0; i < positions.count; i++) {
    const x = positions.getX(i);
    const y = positions.getY(i);
    positions.setXYZ(i, x + Math.sin(y * 5) * .045, y + Math.cos(x * 7) * .033,
      Math.abs(Math.sin(x * 4 - y * .75) * .068 + Math.sin(y * 6) * .031));
  }
  ragGeometry.computeVertexNormals();
  const rag = mesh(ragGeometry, new THREE.MeshStandardMaterial({
    map: linen, bumpMap: linen, bumpScale: .031, side: THREE.DoubleSide,
  }), 5.08, .026, 1.83);
  rag.rotation.set(-Math.PI / 2, 0, .23);
  scene.add(rag);

  const bowlMaterial = new THREE.MeshPhysicalMaterial({ color: '#b56e4f', clearcoat: .67, roughness: .46 });
  const bowlProfile = [[0, .035], [.53, .035], [.73, .13], [.88, .3], [.93, .43], [.897, .47], [.862, .44],
    [.79, .3], [.66, .18], [.51, .13], [0, .13]].map(([x, y]) => new THREE.Vector2(x, y));
  const bowl = new THREE.Group();
  bowl.position.set(-4.56, .026, -2.04);
  bowl.add(mesh(new THREE.LatheGeometry(bowlProfile, 54), bowlMaterial, 0, 0, 0));
  const lip = mesh(new THREE.TorusGeometry(.905, .023, 8, 55), new THREE.MeshStandardMaterial({
    color: '#e2af76', roughness: .62,
  }), 0, .444, 0);
  lip.rotation.x = Math.PI / 2;
  bowl.add(lip);
  const fragmentMaterials = Object.values(colors).map(({hex}) => {
    const material = ceramic.clone();
    material.color.set(hex);
    return material;
  });
  const glass = new THREE.MeshPhysicalMaterial({
    color: '#489d93', transparent: true, opacity: .74, roughness: .17,
    clearcoat: 1, clearcoatRoughness: .12, ior: 1.46,
  });
  const fragmentGeometries = Object.values(shapes).map(({points}) => ceramicGeometry(points));
  for (let i = 0; i < 22; i++) {
    const angle = i * 2.39;
    const radius = Math.sqrt(i / 24) * .68;
    const piece = mesh(fragmentGeometries[i % 3], fragmentMaterials[i % fragmentMaterials.length],
      Math.cos(angle) * radius, .17 + noise(i) * .11, Math.sin(angle) * radius);
    piece.rotation.set(noise(i + 88) * .5, angle, noise(i + 201) * .7);
    piece.scale.setScalar(.65 + noise(i + 74) * .45);
    bowl.add(piece);
  }
  scene.add(bowl);
  contact(-4.61, -1.96, 2.45, 2.25);
  for (let i = 0; i < 21; i++) {
    const angle = i * 2.39;
    const radius = Math.sqrt(i / 21) * 1.6;
    const material = i % 5 === 0 ? glass : fragmentMaterials[(i + 3) % fragmentMaterials.length];
    const piece = mesh(fragmentGeometries[i % 3], material,
      -4.91 + Math.cos(angle) * radius * .61, .025, .35 + Math.sin(angle) * radius);
    piece.rotation.set(.08 * noise(i + 6), angle, .08 * noise(i + 95));
    piece.scale.setScalar(.54 + noise(i + 52) * .68);
    scene.add(piece);
  }
  for (let i = 0; i < 9; i++) {
    const piece = mesh(fragmentGeometries[i % 3], fragmentMaterials[(i * 3 + 2) % fragmentMaterials.length],
      -2.8 + i * .255, .024, 3.62 + noise(i + 632) * .32);
    piece.rotation.set(.03, i * 2.38, .035);
    piece.scale.setScalar(.54 + noise(i + 53) * .43);
    scene.add(piece);
  }

  const jar = new THREE.Group();
  jar.position.set(4.53, .006, -2.39);
  const crock = new THREE.MeshPhysicalMaterial({ color: '#9da79b', roughness: .49, clearcoat: .5 });
  const jarProfile = [[0,.025],[.47,.025],[.52,.085],[.61,.46],[.58,.65],[.53,.73],[.45,.73],
    [.48,.62],[.51,.49],[.46,.37],[0,.36]].map(([x, y]) => new THREE.Vector2(x, y));
  jar.add(mesh(new THREE.LatheGeometry(jarProfile, 42), crock, 0, 0, 0));
  const plaster = mesh(new THREE.SphereGeometry(.497, 28, 14), frameMaterial, 0, .515, 0);
  plaster.scale.y = .145;
  jar.add(plaster);
  for (const y of [.23, .31]) {
    const line = mesh(new THREE.TorusGeometry(y === .23 ? .553 : .575, .014, 6, 42), ceramic, 0, y, 0);
    line.rotation.x = Math.PI / 2;
    jar.add(line);
  }
  scene.add(jar);
  contact(4.5, -2.3, 1.9, 1.67);

  const steel = new THREE.MeshStandardMaterial({ color: '#8e9590', roughness: .33, metalness: .65 });
  const darkSteel = new THREE.MeshStandardMaterial({ color: '#444947', roughness: .46, metalness: .62 });
  const handle = new THREE.MeshStandardMaterial({ color: '#81482f', roughness: .68 });
  const trowel = new THREE.Group();
  trowel.position.set(4.5, .167, .92);
  trowel.rotation.y = -.54;
  const paddle = ceramicGeometry([[-1.2, -1.4], [1.2, -1.4], [.96, .7], [.32, 1.52], [-.34, 1.6], [-.98, .65]]);
  const blade = mesh(paddle, steel, 0, 0, 0);
  blade.scale.y = .28;
  trowel.add(blade);
  const tang = mesh(new THREE.CylinderGeometry(.055, .065, .46, 14), darkSteel, 0, .09, .48);
  tang.rotation.x = Math.PI / 2;
  trowel.add(tang);
  const grip = mesh(new THREE.CapsuleGeometry(.116, .7, 5, 12), handle, 0, .12, 1.02);
  grip.rotation.x = Math.PI / 2;
  trowel.add(grip);
  scene.add(trowel);

  const nippers = new THREE.Group();
  nippers.position.set(-4.1, .108, 2.53);
  nippers.rotation.y = .77;
  for (const side of [-1, 1]) {
    const arm = mesh(new THREE.CapsuleGeometry(.087, .79, 5, 12), handle, side * .19, 0, .46);
    arm.rotation.set(Math.PI / 2, 0, side * .32);
    const jaw = mesh(new THREE.BoxGeometry(.172, .103, .49), steel, side * .102, .042, -.225);
    jaw.rotation.y = side * .28;
    nippers.add(arm, jaw);
  }
  nippers.add(mesh(new THREE.CylinderGeometry(.14, .14, .142, 22), darkSteel, 0, .057, 0));
  scene.add(nippers);
  contact(-4.13, 2.7, 1.58, 2.22);
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

export function createScene(stage) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.17;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.shadowMap.autoUpdate = false;
  const canvas = renderer.domElement;
  canvas.className = 'mosaic-canvas';
  canvas.tabIndex = 0;
  canvas.setAttribute('aria-label', 'Painel do mosaico. Setas escolhem uma posição. Enter aplica a ferramenta.');
  stage.append(canvas);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#7b553b');
  scene.add(new THREE.HemisphereLight('#ffebc4', '#856553', 1.52));
  const key = new THREE.DirectionalLight('#ffe2ba', 2.68);
  key.position.set(-5, 8, -4);
  key.castShadow = true;
  Object.assign(key.shadow.camera, { near: .3, far: 23, left: -9, right: 9, top: 9, bottom: -9 });
  key.shadow.normalBias = .018;
  key.shadow.bias = -.0003;
  key.shadow.radius = 3;
  scene.add(key);
  const fill = new THREE.DirectionalLight('#b9d8ed', .48);
  fill.position.set(5, 6, 3);
  scene.add(fill);

  const reflectionScene = new THREE.Scene();
  reflectionScene.background = new THREE.Color('#695742');
  const lightPanel = new THREE.Mesh(new THREE.PlaneGeometry(5.5, 3.8), new THREE.MeshBasicMaterial({
    color: new THREE.Color('#fff0d1').multiplyScalar(3.3), side: THREE.DoubleSide,
  }));
  lightPanel.position.set(-3, 5, -3);
  lightPanel.lookAt(0, 0, 0);
  reflectionScene.add(lightPanel);
  const pmrem = new THREE.PMREMGenerator(renderer);
  let reflections = pmrem.fromScene(reflectionScene, .11, .1, 30, { size: 64 });
  scene.environment = reflections.texture;
  scene.environmentIntensity = .46;
  pmrem.dispose();

  const speckle = texture(128, (x, y, grain) => {
    const wave = (Math.sin(x * 92 + y * 27) + Math.cos(x * 53 - y * 79)) * 6;
    const value = 212 + wave + 25 * grain;
    return [value, value, value];
  });
  const ceramic = new THREE.MeshPhysicalMaterial({
    color: '#ffffff', roughness: .39, clearcoat: .57, clearcoatRoughness: .24,
    bumpMap: speckle, bumpScale: .008, roughnessMap: speckle,
  });
  const stone = new THREE.MeshStandardMaterial({
    color: '#b49970', roughness: .9, bumpMap: speckle, bumpScale: .039,
  });
  tabletop(scene, ceramic, stone);
  scene.add(mesh(roundedBox(WIDTH + .48, .285, WIDTH + .48, .15), new THREE.MeshStandardMaterial({
    color: '#7c482d', roughness: .81, bumpMap: speckle, bumpScale: .034,
  }), 0, .035, 0));
  scene.add(mesh(roundedBox(WIDTH + .21, .063, WIDTH + .21, .105), stone, 0, .277, 0));
  const bed = mesh(new THREE.PlaneGeometry(WIDTH + .024, WIDTH + .024), new THREE.MeshStandardMaterial({
    color: '#a0845e', roughness: .92, map: speckle, bumpMap: speckle, bumpScale: .036,
  }), 0, .313, 0);
  bed.rotation.x = -Math.PI / 2;
  bed.castShadow = false;
  scene.add(bed);
  const gridVertices = [];
  for (let line = 1; line < SIDE; line++) {
    const offset = line * CELL - WIDTH / 2;
    gridVertices.push(
      new THREE.Vector3(-WIDTH / 2, .316, offset), new THREE.Vector3(WIDTH / 2, .316, offset),
      new THREE.Vector3(offset, .316, -WIDTH / 2), new THREE.Vector3(offset, .316, WIDTH / 2),
    );
  }
  scene.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(gridVertices),
    new THREE.LineBasicMaterial({ color: '#aa8e69', opacity: .56, transparent: true })));

  const groutGeometry = new THREE.PlaneGeometry(CELL + .0002, CELL + .0002);
  groutGeometry.rotateX(-Math.PI / 2);
  const grout = new THREE.InstancedMesh(groutGeometry, new THREE.MeshStandardMaterial({
    color: '#ffffff', roughness: 1, map: speckle, bumpMap: speckle, bumpScale: .036,
  }), TOTAL);
  grout.receiveShadow = true;
  grout.frustumCulled = false;
  grout.count = 0;
  scene.add(grout);

  const pieceBatches = new Map();
  for (const [shapeKey, {points}] of Object.entries(shapes)) {
    const variations = [
      [points],
      [cutAt(points, -1), cutAt(points, 1)],
    ];
    for (const [cut, polygons] of variations.entries()) {
      const batch = polygons.map((polygon) => {
        const instance = new THREE.InstancedMesh(ceramicGeometry(polygon), ceramic, TOTAL);
        instance.frustumCulled = false;
        instance.castShadow = true;
        instance.receiveShadow = true;
        instance.count = 0;
        scene.add(instance);
        return instance;
      });
      pieceBatches.set(shapeKey + cut, batch);
    }
  }

  const cursor = new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(-CELL * .48, 0, -CELL * .48),
    new THREE.Vector3(CELL * .48, 0, -CELL * .48),
    new THREE.Vector3(CELL * .48, 0, CELL * .48),
    new THREE.Vector3(-CELL * .48, 0, CELL * .48),
  ]), new THREE.LineBasicMaterial({ color: '#fff1bd', depthTest: false }));
  cursor.renderOrder = 6;
  cursor.visible = false;
  scene.add(cursor);

  const guideOutline = new THREE.Mesh(new THREE.RingGeometry(CELL * .59, CELL * .70, 4, 1, Math.PI / 4),
    new THREE.MeshBasicMaterial({ color: '#fff38f', depthTest: false, depthWrite: false }));
  guideOutline.rotation.x = -Math.PI / 2;
  guideOutline.renderOrder = 7;
  guideOutline.visible = false;
  scene.add(guideOutline);

  const ghost = new THREE.Group();
  ghost.visible = false;
  const ghostMaterial = new THREE.MeshBasicMaterial({ transparent: true, opacity: .62, depthWrite: false });
  const ghostMeshes = new Map();
  for (const [id, batches] of pieceBatches) {
    const pieces = batches.map((batch) => new THREE.Mesh(batch.geometry, ghostMaterial));
    for (const piece of pieces) {
      piece.visible = false;
      piece.renderOrder = 5;
      ghost.add(piece);
    }
    ghostMeshes.set(id, pieces);
  }
  scene.add(ghost);

  const matrix = new THREE.Object3D();
  const color = new THREE.Color();
  const camera = new THREE.OrthographicCamera(-5, 5, 5, -5, .01, 65);
  const target = new THREE.Vector3(0, .22, 0);
  const raycaster = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
  const hit = new THREE.Vector3();
  const workPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -.376);
  let aspect = 1;
  let viewWidth = 0;
  let viewHeight = 0;
  let qualityLevel = 'medium';
  let pitch = topTilt;
  let azimuth = 0;
  let zoom = 1;
  let orbitMode = false;
  let guidedCell = null;
  let frame = 0;
  let disposed = false;
  let suspended = false;
  let contextLost = false;
  let pendingBoard = null;

  function frameCamera() {
    const span = Math.max(4.03, 3.75 / aspect);
    const height = span / zoom;
    camera.left = -height * aspect;
    camera.right = height * aspect;
    camera.top = height;
    camera.bottom = -height;
    camera.position.set(
      Math.sin(pitch) * Math.sin(azimuth) * 13,
      Math.cos(pitch) * 13,
      Math.sin(pitch) * Math.cos(azimuth) * 13,
    ).add(target);
    camera.up.set(0, 1, 0);
    camera.lookAt(target);
    camera.updateProjectionMatrix();
    camera.updateMatrixWorld();
  }

  function renderNow() {
    if (disposed || contextLost || !viewWidth || !viewHeight || document.hidden) return;
    if (pendingBoard) {
      updateMeshes(pendingBoard);
      pendingBoard = null;
    }
    renderer.render(scene, camera);
  }

  function invalidate() {
    if (frame || disposed || suspended || contextLost || document.hidden) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      renderNow();
    });
  }

  function resize() {
    const rect = stage.getBoundingClientRect();
    viewWidth = Math.floor(rect.width);
    viewHeight = Math.floor(rect.height);
    if (!viewWidth || !viewHeight) return;
    aspect = viewWidth / viewHeight;
    renderer.setSize(viewWidth, viewHeight, false);
    frameCamera();
    invalidate();
  }

  function quality(level) {
    qualityLevel = level;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, { low: .85, medium: 1.4, high: 1.9 }[level] ?? 1.4));
    renderer.shadowMap.enabled = level !== 'low';
    const size = level === 'high' ? 2048 : 1024;
    if (key.shadow.mapSize.width !== size) {
      key.shadow.map?.dispose();
      key.shadow.map = null;
      key.shadow.mapSize.set(size, size);
    }
    renderer.shadowMap.needsUpdate = true;
    resize();
  }

  function coordinates(index) {
    return [(index % SIDE + .5) * CELL - WIDTH / 2, (Math.floor(index / SIDE) + .5) * CELL - WIDTH / 2];
  }

  function cellAt(clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return null;
    ndc.set((clientX - rect.left) / rect.width * 2 - 1, 1 - (clientY - rect.top) / rect.height * 2);
    raycaster.setFromCamera(ndc, camera);
    if (!raycaster.ray.intersectPlane(workPlane, hit)) return null;
    const x = Math.floor((hit.x + WIDTH / 2) / CELL);
    const y = Math.floor((hit.z + WIDTH / 2) / CELL);
    return x >= 0 && y >= 0 && x < SIDE && y < SIDE ? y * SIDE + x : null;
  }

  function fit(shape, rotation) {
    const sine = Math.sin(rotation);
    const cosine = Math.cos(rotation);
    const extent = Math.max(...shapes[shape].points.map(([x, y]) =>
      Math.max(Math.abs(x * cosine - y * sine), Math.abs(x * sine + y * cosine))));
    return Math.min(1, .436 / extent);
  }

  function update(board) {
    pendingBoard = board;
    invalidate();
  }

  function updateMeshes(board) {
    grout.count = 0;
    for (const batches of pieceBatches.values()) for (const batch of batches) batch.count = 0;
    for (const [index, tile] of board.tiles.entries()) {
      const [x, z] = coordinates(index);
      if (board.filled[index]) {
        matrix.position.set(x, groutPlaneY, z);
        matrix.rotation.set(0, 0, 0);
        matrix.scale.set(1, 1, 1);
        matrix.updateMatrix();
        grout.setMatrixAt(grout.count, matrix.matrix);
        grout.setColorAt(grout.count++, color.set(grouts[board.grout].hex).multiplyScalar(.91 + noise(index + 21) * .18));
      }
      if (!tile) continue;
      const angle = -THREE.MathUtils.degToRad(tile.angle) + (noise(index + 901) - .5) * .105;
      const scale = fit(tile.shape, angle) * (.925 + noise(index + 67) * .072);
      matrix.position.set(x + (noise(index + 50) - .5) * .012, TILE_Y + noise(index + 132) * .016,
        z + (noise(index + 140) - .5) * .012);
      matrix.rotation.set((noise(index + 330) - .5) * .07, angle, (noise(index + 400) - .5) * .08);
      matrix.scale.set(scale, .8 + noise(index + 87) * .47, scale);
      matrix.updateMatrix();
      color.set(colors[tile.color].hex).multiplyScalar(.78 + noise(index + 187) * .41);
      for (const batch of pieceBatches.get(tile.shape + Number(tile.cut))) {
        batch.setMatrixAt(batch.count, matrix.matrix);
        batch.setColorAt(batch.count++, color);
      }
    }
    for (const batch of [grout, ...Array.from(pieceBatches.values()).flat()]) {
      batch.instanceMatrix.needsUpdate = true;
      if (batch.instanceColor) batch.instanceColor.needsUpdate = true;
    }
    renderer.shadowMap.needsUpdate = true;
  }

  function preview(index, brush, tool, occupied) {
    if (index === null || orbitMode) {
      cursor.visible = false;
      ghost.visible = false;
      invalidate();
      return;
    }
    const [x, z] = coordinates(index);
    cursor.visible = true;
    cursor.material.color.set(occupied && tool === 'place' ? '#f27759' : '#fff2b6');
    cursor.position.set(x, .408, z);
    ghost.visible = tool === 'place' && !occupied;
    if (ghost.visible) {
      for (const [id, pieces] of ghostMeshes) for (const piece of pieces) {
        piece.visible = id === brush.shape + Number(brush.cut);
      }
      const angle = -THREE.MathUtils.degToRad(brush.angle);
      const scale = fit(brush.shape, angle);
      ghostMaterial.color.set(colors[brush.color].hex);
      ghost.position.set(x, .36, z);
      ghost.rotation.y = angle;
      ghost.scale.set(scale, 1, scale);
    }
    invalidate();
  }

  function guideTarget(index) {
    guidedCell = index;
    guideOutline.visible = index !== null && !orbitMode;
    if (guideOutline.visible) {
      const [x, z] = coordinates(index);
      guideOutline.position.set(x, .409, z);
    }
    invalidate();
  }

  function setOrbit(enabled) {
    orbitMode = enabled;
    canvas.dataset.orbit = String(enabled);
    pitch = enabled ? .64 : topTilt;
    azimuth = enabled ? .26 : 0;
    zoom = 1;
    frameCamera();
    guideTarget(guidedCell);
  }

  function moveOrbit(dx, dy) {
    azimuth -= dx * .009;
    pitch = clamp(pitch - dy * .007, .09, 1.12);
    frameCamera();
    invalidate();
  }

  function zoomBy(factor) {
    zoom = clamp(zoom * factor, .78, 2.7);
    frameCamera();
    invalidate();
  }

  function suspend(enable) {
    suspended = enable;
    if (enable) {
      cancelAnimationFrame(frame);
      frame = 0;
    } else invalidate();
  }

  function onLost(event) {
    event.preventDefault();
    contextLost = true;
    canvas.dispatchEvent(new Event('mosaico-contexto-perdido'));
  }

  function onRestored() {
    contextLost = false;
    const restored = new THREE.PMREMGenerator(renderer);
    reflections.dispose();
    reflections = restored.fromScene(reflectionScene, .11, .1, 30, { size: 64 });
    scene.environment = reflections.texture;
    restored.dispose();
    quality(qualityLevel);
    canvas.dispatchEvent(new Event('mosaico-contexto-restaurado'));
  }

  const onVisibility = () => { if (!document.hidden) invalidate(); };
  const observer = new ResizeObserver(resize);
  observer.observe(stage);
  canvas.addEventListener('webglcontextlost', onLost);
  canvas.addEventListener('webglcontextrestored', onRestored);
  document.addEventListener('visibilitychange', onVisibility);
  quality('medium');

  function dispose() {
    disposed = true;
    cancelAnimationFrame(frame);
    observer.disconnect();
    canvas.removeEventListener('webglcontextlost', onLost);
    canvas.removeEventListener('webglcontextrestored', onRestored);
    document.removeEventListener('visibilitychange', onVisibility);
    const geoms = new Set();
    const materials = new Set();
    scene.traverse((object) => {
      if (object.geometry) geoms.add(object.geometry);
      if (object.material) for (const material of [object.material].flat()) materials.add(material);
      if (object.isInstancedMesh) object.dispose();
    });
    const textures = new Set();
    for (const material of materials) {
      for (const value of Object.values(material)) if (value?.isTexture) textures.add(value);
      material.dispose();
    }
    for (const geometry of geoms) geometry.dispose();
    for (const map of textures) map.dispose();
    key.shadow.dispose();
    reflections.dispose();
    lightPanel.geometry.dispose();
    lightPanel.material.dispose();
    renderer.dispose();
    canvas.remove();
  }

  return { canvas, update, preview, guideTarget, cellAt, setOrbit, moveOrbit, zoomBy, suspend, quality, renderNow, dispose };
}
