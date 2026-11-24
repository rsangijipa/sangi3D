import * as THREE from '/shared/vendor/three.module.js';
import { createStudioEnvironment } from '/shared/engine/studio-environment.js';
import { mesh, profile, makePlant } from '/shared/engine/scene-details.js';

export { THREE, mesh, profile, makePlant };

export function seeded(seed) {
  return () => ((seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0) / 4294967296);
}

export function materialKit() {
  const textures = new Map();
  const anisotropy = 8;
  function texture(kind) {
    if (textures.has(kind)) return textures.get(kind);
    const size = kind === 'wood' ? 1024 : 512;
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext('2d');
    const random = seeded(829);
    const off = Array.from({ length: 12 }, () => random() * 140);
    const image = ctx.createImageData(size, size);
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const u = x / size * Math.PI * 2;
        const v = y / size * Math.PI * 2;
        const noise = random() - .5;
        let value;
        if (kind === 'wood') {
          const twist = 1.2 * Math.sin(2 * v + 3 * u) + .54 * Math.sin(5 * v - 5 * u);
          const grain = Math.sin(31 * u + twist + 2.65 * Math.sin(3 * u - v));
          const pores = Math.abs(Math.sin(92 * u + 3 * twist)) ** 21;
          value = 212 + 13 * Math.sin(5 * u + .5 * Math.sin(v)) + 8 * grain - 9 * pores + noise * 10;
        } else if (kind === 'velvet' || kind === 'linen' || kind === 'felt') {
          const warp = Math.sin(x * Math.PI / 2);
          const weft = Math.sin(y * Math.PI / 2);
          const woven = kind === 'linen' ? 9 * warp + 8 * weft * (x % 8 < 4 ? 1 : -1) : 2 * warp * weft;
          value = 214 + woven + noise * 31 + 5 * Math.sin(8 * u + 3 * v) * Math.sin(12 * v);
        } else {
          value = 228 + 11 * Math.sin(9 * u + 4 * v) * Math.sin(7 * v - 3 * u) + noise * 22;
        }
        const index = (y * size + x) * 4;
        image.data[index] = image.data[index + 1] = image.data[index + 2] = value;
        image.data[index + 3] = 255;
      }
    }
    ctx.putImageData(image, 0, 0);
    if (kind !== 'wood') {
      ctx.globalAlpha = kind === 'felt' ? .26 : .19;
      ctx.lineWidth = .75;
      for (let i = 0; i < 8500; i++) {
        const x = random() * size;
        const y = random() * size;
        ctx.strokeStyle = i % 3 ? '#fff5dd' : '#64503c';
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.quadraticCurveTo(x + 1 + random() * 4, y - 1, x + 3 + random() * 6, y + (i % 8 - 4));
        ctx.stroke();
      }
    } else {
      for (let i = 0; i < off.length; i++) {
        ctx.strokeStyle = i % 2 ? '#fff1dc40' : '#32231845';
        ctx.lineWidth = 1.35;
        ctx.beginPath();
        const x = (i * 83 + off[i]) % size;
        ctx.moveTo(x, -10);
        ctx.bezierCurveTo(x - 11, 270, x + 19, 690, x, 1034);
        ctx.stroke();
      }
    }
    const color = new THREE.CanvasTexture(canvas);
    color.colorSpace = THREE.SRGBColorSpace;
    color.wrapS = color.wrapT = THREE.RepeatWrapping;
    color.anisotropy = anisotropy;
    const height = color.clone();
    height.colorSpace = THREE.NoColorSpace;
    textures.set(kind, { color, height });
    return { color, height };
  }
  function surface(kind, color, bumpScale, roughness = .88) {
    const maps = texture(kind);
    const props = { color, map: maps.color, bumpMap: maps.height, bumpScale, roughness };
    if (kind === 'velvet') {
      return new THREE.MeshPhysicalMaterial({ ...props, sheen: .78, sheenColor: color, sheenRoughness: .63 });
    }
    return new THREE.MeshStandardMaterial(props);
  }
  return {
    wood: color => surface('wood', color, .023, .54),
    velvet: color => surface('velvet', color, .025),
    linen: color => surface('linen', color, .024),
    felt: color => surface('felt', color, .017),
    paper: color => surface('paper', color, .019),
    brass: new THREE.MeshStandardMaterial({ color: 0xc69650, metalness: .79, roughness: .33 }),
    iron: new THREE.MeshStandardMaterial({ color: 0x2a2320, metalness: .56, roughness: .47 }),
  };
}

export function panel(parent, width, height, depth, radius, material, x, y, z) {
  const outline = new THREE.Shape();
  const bevel = Math.min(radius * .32, depth * .27);
  const h = width / 2 - bevel;
  const v = height / 2 - bevel;
  const corner = Math.min(radius - bevel, h * .94, v * .94);
  outline.moveTo(-h + corner, -v);
  outline.lineTo(h - corner, -v);
  outline.quadraticCurveTo(h, -v, h, -v + corner);
  outline.lineTo(h, v - corner);
  outline.quadraticCurveTo(h, v, h - corner, v);
  outline.lineTo(-h + corner, v);
  outline.quadraticCurveTo(-h, v, -h, v - corner);
  outline.lineTo(-h, -v + corner);
  outline.quadraticCurveTo(-h, -v, -h + corner, -v);
  outline.closePath();
  const geometry = extrude(outline, depth - bevel * 2, bevel, 4);
  geometry.translate(0, 0, -depth / 2 + bevel);
  return mesh(parent, geometry, material, x, y, z);
}

export function extrude(shape, depth = .044, bevel = .009, curveSegments = 16) {
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth, bevelEnabled: bevel > 0, bevelThickness: bevel, bevelSize: bevel, bevelSegments: 2, curveSegments,
  });
  const position = geometry.attributes.position;
  const uv = geometry.attributes.uv;
  geometry.computeBoundingBox();
  const bounds = geometry.boundingBox;
  const width = bounds.max.x - bounds.min.x || 1;
  const height = bounds.max.y - bounds.min.y || 1;
  for (let i = 0; i < uv.count; i++) {
    uv.setXY(i, (position.getX(i) - bounds.min.x) / width, (position.getY(i) - bounds.min.y) / height);
  }
  return geometry;
}

export function line(parent, points, radius, material, shadow = false) {
  const curve = new THREE.CatmullRomCurve3(points.map(point => new THREE.Vector3(...point)));
  return mesh(parent, new THREE.TubeGeometry(curve, Math.max(9, points.length * 5), radius, 7, false), material, 0, 0, 0, shadow);
}

export function rod(parent, a, b, radius, material, taper = 1) {
  const start = new THREE.Vector3(...a);
  const end = new THREE.Vector3(...b);
  const middle = start.clone().lerp(end, .5);
  const part = mesh(parent, new THREE.CylinderGeometry(radius, radius * taper, start.distanceTo(end), 12), material, ...middle);
  part.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), end.sub(start).normalize());
  return part;
}

export function arch(parent, material, width, bottom, shoulder, crown, rail, depth, z) {
  const shape = new THREE.Shape();
  const h = width / 2;
  shape.moveTo(-h, bottom);
  shape.lineTo(-h, shoulder);
  shape.bezierCurveTo(-h, crown, -h * .45, crown, 0, crown);
  shape.bezierCurveTo(h * .45, crown, h, crown, h, shoulder);
  shape.lineTo(h, bottom);
  shape.lineTo(h - rail, bottom);
  shape.lineTo(h - rail, shoulder - rail * .18);
  shape.bezierCurveTo(h - rail, crown - rail, h * .45, crown - rail, 0, crown - rail);
  shape.bezierCurveTo(-h * .45, crown - rail, -h + rail, crown - rail, -h + rail, shoulder - rail * .18);
  shape.lineTo(-h + rail, bottom);
  shape.closePath();
  return mesh(parent, extrude(shape, depth, .024), material, 0, 0, z, false);
}

export function drape(parent, material, side, { top, bottom, open, z, pleats = 8, sway = .09 }) {
  const geometry = new THREE.PlaneGeometry(1, 1, pleats * 12, 28);
  const vertices = geometry.attributes.position;
  const uv = geometry.attributes.uv;
  const curtain = mesh(parent, geometry, material, 0, 0, z, false);
  curtain.frustumCulled = false;
  function tension(closed) {
    for (let i = 0; i < vertices.count; i++) {
      const u = uv.getX(i);
      const v = uv.getY(i);
      const pinch = Math.exp(-(((v - .30) * 3.7) ** 2));
      const opening = open * (.31 + v * .69 + .16 * (1 - v) ** 6) * (1 - pinch * .56);
      const width = THREE.MathUtils.lerp(opening, Math.abs(side) + .03, closed);
      const fold = Math.sin(u * Math.PI * pleats * 2 + .42 * Math.sin(v * 8 + u * 3));
      const billow = (sway * (1 - pinch * (1 - closed) * .66)) * (fold + .19 * Math.sin(u * 12));
      const remainder = side - Math.sign(side) * (width * u);
      vertices.setXYZ(i, remainder, bottom + (top - bottom) * v + Math.cos(u * 39) * .021 * (1 - v), billow);
    }
    vertices.needsUpdate = true;
    geometry.computeVertexNormals();
  }
  curtain.material.side = THREE.DoubleSide;
  tension(0);
  return { curtain, tension };
}

export function tieCurtain(parent, side, y, z, length, material) {
  const tie = new THREE.Group();
  parent.add(tie);
  for (let strand = 0; strand < 2; strand++) {
    const points = Array.from({ length: 12 }, (_, index) => {
      const t = index / 11;
      return [side - Math.sign(side) * t * length, y - Math.sin(t * Math.PI) * .035 + strand * .035 + Math.sin(t * Math.PI * 13) * .006, z + Math.sin(t * Math.PI) * .035];
    });
    line(tie, points, .026, material);
  }
  const end = side - Math.sign(side) * length * .58;
  for (let i = 0; i < 3; i++) {
    line(tie, [[end + i * .025, y, z], [end + .025 + i * .029, y - .08, z + .025], [end + .060 + i * .025, y - .18, z]], .013, material);
  }
  return tie;
}

export function floorBoards(parent, materials, width, count, depth, y, z) {
  const stride = width / count;
  const geometry = new THREE.BoxGeometry(stride - .013, .045, depth);
  const floor = new THREE.InstancedMesh(geometry, materials, count);
  const dummy = new THREE.Object3D();
  const random = seeded(57);
  const shade = new THREE.Color();
  for (let i = 0; i < count; i++) {
    dummy.position.set(-width / 2 + stride * (i + .5), y, z);
    dummy.rotation.y = i % 2 ? Math.PI : 0;
    dummy.updateMatrix();
    floor.setMatrixAt(i, dummy.matrix);
    const value = .83 + .17 * random();
    floor.setColorAt(i, shade.setRGB(value, value * (.95 + random() * .05), value));
  }
  floor.receiveShadow = true;
  parent.add(floor);
  return floor;
}

export function room(parent, materials, style) {
  mesh(parent, new THREE.PlaneGeometry(28, 14), materials.paper(style.wall), 0, 4, -4.5, false);
  const floor = mesh(parent, new THREE.PlaneGeometry(30, 22), materials.wood(style.floor), 0, -.05, 0, false);
  floor.rotation.x = -Math.PI / 2;
  floor.material.map = floor.material.map.clone();
  floor.material.map.repeat.set(2, 4);
  panel(parent, 22, .20, .12, .017, materials.wood(0x8a5b3d), 0, .11, -4.42);
  const mat = materials.linen(style.rug);
  const rug = mesh(parent, new THREE.CircleGeometry(2.65, 96), mat, -.35, -.018, 3.6, false);
  rug.rotation.x = -Math.PI / 2;
  rug.scale.y = .44;
  return floor;
}

export function bookcase(parent, materials, x, z, side) {
  const group = new THREE.Group();
  group.position.set(x, 0, z);
  group.rotation.y = side * .075;
  parent.add(group);
  const wood = materials.wood(0x9f6b42);
  const old = materials.wood(0x684129);
  panel(group, 1.28, 3.16, .095, .02, old, 0, 1.59, -.36);
  for (const x of [-.59, .59]) panel(group, .11, 3.32, .60, .022, wood, x, 1.66, -.08);
  for (const y of [.11, .83, 1.58, 2.34, 3.29]) panel(group, 1.31, .11, .69, .022, wood, 0, y, -.06);
  const covers = [0x344e4d, 0x863c3e, 0x4d5941, 0xac744e, 0x536073, 0x9f8865].map(color => materials.linen(color));
  const pages = materials.paper(0xd7bb92);
  const random = seeded(76);
  for (const level of [1.65, 2.40]) {
    for (let i = 0; i < 6; i++) {
      const h = .32 + random() * .23;
      const x = -.46 + i * .161;
      panel(group, .145, h, .30, .012, covers[(i + (level > 2 ? 2 : 0)) % covers.length], x, level + h / 2, -.09).rotation.z = (i % 2) * .075;
      panel(group, .10, .047, .013, .005, pages, x, level + h * .75, .067);
    }
  }
  const basket = materials.linen(0xab7955);
  panel(group, .86, .45, .45, .064, basket, -.04, .39, -.04);
  panel(group, .27, .07, .023, .022, old, -.04, .51, .196);
  const ceramic = materials.paper(0xd8b98f);
  const base = profile([[0, 0], [.13, 0], [.18, .04], [.17, .19], [.09, .24], [0, .25]], 28);
  mesh(group, base, ceramic, .03, .89, .12);
  rod(group, [.03, 1.08, .12], [.03, 1.23, .12], .025, materials.brass);
  const shade = new THREE.MeshStandardMaterial({ color: 0xecc28b, emissive: 0xf7a547, emissiveIntensity: .65, roughness: .91 });
  mesh(group, profile([[.24, 0], [.23, .04], [.17, .16], [.07, .205], [0, .212]], 36), shade, .03, 1.14, .12);
  const light = new THREE.PointLight(0xffb769, .75, 2, 2);
  light.position.set(.03, 1.18, .24);
  group.add(light);
  makePlant(group, -.30, -.03, .68, 10, ceramic, 3.35);
  return group;
}

export function bootStage(view, scene, { camera, draw, layout, exposure = 1, environment = .55 }) {
  const fallback = view.querySelector('.fallback');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
  } catch {
    fallback.hidden = false;
    return null;
  }
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = exposure;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.domElement.setAttribute('aria-hidden', 'true');
  view.prepend(renderer.domElement);
  const probe = createStudioEnvironment(renderer);
  scene.environment = probe.texture;
  scene.environmentIntensity = environment;
  let dirty = true;
  let last = 0;
  let active = false;
  let animation = 0;
  let visible = !document.hidden;
  let hostPaused = false;
  const resize = () => {
    const { clientWidth: width, clientHeight: height } = view;
    if (!width || !height) return;
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, width < 600 ? 1.5 : 2));
    renderer.setSize(width, height, false);
    layout(width / height);
    dirty = true;
    request();
  };
  const contextLost = event => {
    event.preventDefault();
    fallback.hidden = false;
  };
  const contextRestored = () => {
    fallback.hidden = true;
    dirty = true;
    request();
  };
  function request() {
    if (!animation) animation = requestAnimationFrame(frame);
  }
  function frame(now) {
    animation = 0;
    if (!visible || hostPaused || !view.isConnected) {
      last = 0;
      return;
    }
    const dt = last ? Math.min((now - last) / 1000, .065) : 0;
    last = now;
    active = draw(dt, reduced.matches);
    if (dirty || active) {
      renderer.render(scene, camera);
      dirty = false;
    }
    if (active) request();
    else last = 0;
  }
  const changeVisibility = () => {
    visible = !document.hidden;
    if (visible) request();
  };
  const pause = () => { hostPaused = true; };
  const resume = () => {
    hostPaused = false;
    dirty = true;
    request();
  };
  const observer = new ResizeObserver(resize);
  observer.observe(view);
  renderer.domElement.addEventListener('webglcontextlost', contextLost);
  renderer.domElement.addEventListener('webglcontextrestored', contextRestored);
  document.addEventListener('visibilitychange', changeVisibility);
  window.addEventListener('sangi:pause', pause);
  window.addEventListener('sangi:resume', resume);
  window.addEventListener('sangi:dispose', () => {
    cancelAnimationFrame(animation);
    observer.disconnect();
    document.removeEventListener('visibilitychange', changeVisibility);
    window.removeEventListener('sangi:pause', pause);
    window.removeEventListener('sangi:resume', resume);
    const disposed = new Set();
    const free = resource => {
      if (resource && !disposed.has(resource)) {
        disposed.add(resource);
        resource.dispose();
      }
    };
    scene.traverse(object => {
      free(object.geometry);
      if (!object.material) return;
      for (const material of [object.material].flat()) {
        free(material.map);
        free(material.bumpMap);
        free(material);
      }
    });
    probe.dispose();
    renderer.dispose();
  }, { once: true });
  resize();
  return { renderer, redraw() { dirty = true; request(); } };
}

export function lightStage(scene, lookAt, { key = 5.5, fill = 1.15, shadow = 2048, position = [-3, 7, 5] } = {}) {
  scene.add(new THREE.HemisphereLight(0xffead0, 0x674135, fill));
  const light = new THREE.SpotLight(0xffe2be, key * 16, 24, .59, .77, 1.5);
  light.position.set(...position);
  light.target.position.set(...lookAt);
  light.castShadow = true;
  light.shadow.mapSize.set(shadow, shadow);
  light.shadow.camera.near = .3;
  light.shadow.camera.far = 18;
  light.shadow.normalBias = .022;
  light.shadow.bias = -.00012;
  light.shadow.radius = 2.3;
  scene.add(light, light.target);
  const bounce = new THREE.DirectionalLight(0xd2dded, .68);
  bounce.position.set(5, 3, 2);
  scene.add(bounce);
  return light;
}
