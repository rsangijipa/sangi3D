import * as T from 'three';
import { MarchingCubes } from 'three/addons/objects/MarchingCubes.js';
import { regions, type Region } from '../game/content';

export const zoneIds = Object.keys(regions) as Region[];
const blend = (a: number, b: number, radius: number) => {
  const h = Math.max(radius - Math.abs(a - b), 0) / radius;
  return Math.min(a, b) - h * h * radius * .25;
};
const ellipse = (x: number, y: number, z: number, a: number, b: number, c: number) =>
  (Math.hypot(x / a, y / b, z / c) - 1) * Math.min(a, b, c);
function limb(x: number, y: number, z: number, ax: number, ay: number, az: number, bx: number, by: number, bz: number, a: number, b: number, depth = 1) {
  const dx = bx - ax, dy = by - ay, dz = bz - az;
  const s = Math.max(0, Math.min(1, ((x - ax) * dx + (y - ay) * dy + (z - az) * dz) / (dx * dx + dy * dy + dz * dz)));
  return Math.hypot(x - ax - dx * s, y - ay - dy * s, (z - az - dz * s) / depth) - T.MathUtils.lerp(a, b, s);
}
function silhouette(px: number, y: number, z: number) {
  const x = Math.abs(px);
  let distance = ellipse(x, y - 1.673, z - .015, .113, .130, .111);
  distance = blend(distance, ellipse(x, y - 1.603, z - .032, .078, .067, .084), .024);
  distance = blend(distance, limb(x, y, z, 0, 1.463, 0, 0, 1.570, 0, .055, .045), .024);
  distance = blend(distance, ellipse(x, y - 1.365, z, .192, .162, .109), .067);
  distance = blend(distance, ellipse(x, y - 1.195, z + .004, .137, .221, .086), .064);
  distance = blend(distance, ellipse(x, y - 1.005, z + .008, .16, .155, .102), .048);
  distance = blend(distance, limb(x, y, z, .164, 1.407, 0, .259, 1.191, .002, .073, .047, .94), .056);
  distance = blend(distance, limb(x, y, z, .255, 1.197, .002, .366, .985, .031, .049, .027), .024);
  distance = blend(distance, limb(x, y, z, .369, .989, .032, .410, .919, .046, .027, .034, .57), .019);
  distance = blend(distance, limb(x, y, z, .392, .944, .040, .365, .902, .054, .014, .010), .012);
  for (let i = 0; i < 4; i++) {
    distance = blend(distance, limb(x, y, z, .395 + i * .013, .917 + i * .003, .048,
      .414 + i * .018, .851 + Math.abs(i - 1) * .010, .059, .010, .008), .004);
  }
  distance = blend(distance, limb(x, y, z, .084, .952, -.004, .095, .560, .007, .081, .050, 1.19), .039);
  distance = blend(distance, limb(x, y, z, .095, .558, .005, .106, .406, -.009, .051, .055, 1.11), .020);
  distance = blend(distance, limb(x, y, z, .106, .404, -.012, .111, .104, .008, .055, .030), .021);
  distance = blend(distance, ellipse(x - .117, y - .065, z - .063, .049, .044, .104), .025);
  return distance;
}

export function regionAt(x: number, y: number, z: number): Region {
  if (y > 1.565) return 'head';
  if (y > 1.479) return 'neck';
  const side = x > 0 ? 'L' : 'R';
  const armEdge = T.MathUtils.clamp(.191 + (1.38 - y) * .29, .174, .30);
  if (y > .83 && Math.abs(x) > armEdge) {
    if (y < .978) return `hand${side}`;
    if (y < 1.196) return `fore${side}`;
    return `upper${side}`;
  }
  if (y < .117) return `foot${side}`;
  if (y < .927) return `leg${side}`;
  return z < -.014 ? 'back' : y > 1.192 ? 'chest' : 'belly';
}

export function makeBody() {
  const material = new T.MeshPhysicalMaterial({
    color: '#a4a3b1', roughness: .48, metalness: .12, clearcoat: .2, clearcoatRoughness: .58,
    transparent: true, opacity: .93,
  });
  const weights = new Float32Array(zoneIds.length);
  material.onBeforeCompile = shader => {
    shader.uniforms.uZones = { value: weights };
    shader.vertexShader = 'attribute float zone; attribute float zoneEdge; varying float vSelection; uniform float uZones[16];\n' + shader.vertexShader;
    shader.vertexShader = shader.vertexShader.replace('#include <begin_vertex>', '#include <begin_vertex>\nvSelection = zoneEdge * uZones[int(zone)];');
    shader.fragmentShader = 'varying float vSelection;\n' + shader.fragmentShader;
    shader.fragmentShader = shader.fragmentShader.replace('#include <emissivemap_fragment>',
      '#include <emissivemap_fragment>\nfloat rim = pow(1.0 - max(dot(normal, normalize(vViewPosition)), 0.0), 2.4);\n totalEmissiveRadiance += vec3(.53,.39,.25)*rim*.38 + vec3(1.35,.62,.20)*vSelection*(.51+.28*rim);');
  };
  const field = new MarchingCubes(102, material, false, false, 54000);
  field.isolation = 0;
  const n = field.resolution;
  for (let z = 0; z < n; z++) for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
    field.field[x + y * n + z * n * n] = -silhouette((x - n / 2) * 2 / n, y * 2 / n, (z - n / 2) * 2 / n);
  }
  field.update();
  const size = field.geometry.drawRange.count;
  const geometry = new T.BufferGeometry();
  const pos = field.geometry.getAttribute('position').array.slice(0, size * 3) as Float32Array;
  const normal = field.geometry.getAttribute('normal').array.slice(0, size * 3) as Float32Array;
  const zones = new Float32Array(size);
  const edges = new Float32Array(size);
  const uv = new Float32Array(size * 2);
  for (let i = 0; i < size; i++) {
    const offset = i * 3;
    pos[offset + 1] += 1;
    const [x, y, z] = pos.subarray(offset, offset + 3);
    const id = regionAt(x,y,z);
    zones[i] = zoneIds.indexOf(id);
    const nearby = [regionAt(x-.032,y,z),regionAt(x+.032,y,z),regionAt(x,y-.037,z),
      regionAt(x,y+.037,z),regionAt(x,y,z-.036),regionAt(x,y,z+.036)];
    edges[i] = .26 + .74 * Math.pow(nearby.filter(region => region===id).length/6,2.2);
    uv[i * 2] = Math.atan2(x, z) / (Math.PI * 2) + .5;
    uv[i * 2 + 1] = y / 1.8;
    const mag = Math.hypot(...normal.subarray(offset, offset + 3)) || 1;
    for (let a = 0; a < 3; a++) normal[offset + a] /= mag;
  }
  geometry.setAttribute('position', new T.BufferAttribute(pos, 3));
  geometry.setAttribute('normal', new T.BufferAttribute(normal, 3));
  geometry.setAttribute('zone', new T.BufferAttribute(zones, 1));
  geometry.setAttribute('zoneEdge', new T.BufferAttribute(edges, 1));
  geometry.setAttribute('uv', new T.BufferAttribute(uv, 2));
  field.geometry.dispose();
  const surface = new T.Mesh(geometry, material);
  surface.name = 'body_neutral';
  surface.userData.regionIds = zoneIds;
  surface.castShadow = true;
  // Cada face pertence a uma região. Os proxies seguem a pele visível e não se cruzam.
  const buckets = new Map<Region, number[]>();
  for (let i = 0; i < pos.length; i += 9) {
    const id = regionAt(
      (pos[i] + pos[i + 3] + pos[i + 6]) / 3,
      (pos[i + 1] + pos[i + 4] + pos[i + 7]) / 3,
      (pos[i + 2] + pos[i + 5] + pos[i + 8]) / 3,
    );
    const faces = buckets.get(id) ?? [];
    faces.push(...pos.subarray(i, i + 9));
    buckets.set(id, faces);
  }
  const proxyMaterial = new T.MeshBasicMaterial();
  const proxyGroup = new T.Group();
  proxyGroup.name = 'region_proxy';
  const proxies = [...buckets].map(([id, faces]) => {
    const geometry = new T.BufferGeometry();
    geometry.setAttribute('position', new T.Float32BufferAttribute(faces, 3));
    const proxy = new T.Mesh(geometry, proxyMaterial);
    proxy.name = id;
    proxy.userData.region = id;
    proxy.visible = false;
    return proxy;
  });
  proxyGroup.add(...proxies);
  return { surface, weights, proxies, proxyGroup };
}
