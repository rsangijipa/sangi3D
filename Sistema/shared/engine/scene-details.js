import * as THREE from '../vendor/three.module.js';

export function roundedBox(width, height, depth, radius) {
  const x = width / 2 - radius;
  const y = height / 2 - radius;
  const outline = new THREE.Shape();
  outline.moveTo(-x, -y);
  outline.lineTo(x, -y);
  outline.lineTo(x, y);
  outline.lineTo(-x, y);
  outline.closePath();
  const geometry = new THREE.ExtrudeGeometry(outline, {
    depth: depth - 2 * radius, bevelThickness: radius, bevelSize: radius,
    bevelEnabled: true, bevelSegments: 3, steps: 1,
  });
  geometry.translate(0, 0, radius - depth / 2);
  return geometry;
}

export function mesh(parent, geometry, material, x, y, z, shadow = true) {
  const object = new THREE.Mesh(geometry, material);
  object.position.set(x, y, z);
  object.castShadow = shadow;
  object.receiveShadow = true;
  parent.add(object);
  return object;
}

export function profile(points, segments = 40) {
  return new THREE.LatheGeometry(points.map(([radius, y]) => new THREE.Vector2(radius, y)), segments);
}

export function beam(parent, a, b, width, depth, material, shadow = true) {
  const start = new THREE.Vector3(...a);
  const end = new THREE.Vector3(...b);
  const center = start.clone().lerp(end, 0.5);
  const section = mesh(parent, new THREE.BoxGeometry(width, start.distanceTo(end), depth), material, ...center, shadow);
  section.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), end.sub(start).normalize());
  return section;
}

export function makePlant(parent, x, z, scale, seed, potMaterial, y = 0) {
  const plant = new THREE.Group();
  plant.position.set(x, y, z);
  plant.scale.setScalar(scale);
  parent.add(plant);
  const pot = profile([[0, 0], [.21, 0], [.24, .024], [.29, .33], [.30, .34],
    [.30, .38], [.28, .39], [.265, .35], [.24, .12], [0, .11]]);
  mesh(plant, pot, potMaterial, 0, 0, 0);
  const soil = new THREE.MeshStandardMaterial({ color: 0x3d2a1e, roughness: 1 });
  mesh(plant, new THREE.CylinderGeometry(.266, .263, .025, 28), soil, 0, .327, 0);

  const leaf = new THREE.Shape();
  leaf.moveTo(0, 0);
  leaf.bezierCurveTo(-.17, .1, -.12, .33, 0, .49);
  leaf.bezierCurveTo(.18, .31, .15, .09, 0, 0);
  const geometry = new THREE.ShapeGeometry(leaf, 12);
  geometry.translate(0, -.05, 0);
  const vertices = geometry.getAttribute('position');
  for (let i = 0; i < vertices.count; i++) {
    vertices.setZ(i, Math.sin(vertices.getY(i) * 7) * .08 - Math.abs(vertices.getX(i)) * .22);
  }
  geometry.computeVertexNormals();
  const material = new THREE.MeshStandardMaterial({ side: THREE.DoubleSide, roughness: .6 });
  const leaves = new THREE.InstancedMesh(geometry, material, 30);
  const stem = new THREE.MeshStandardMaterial({ color: 0x726238, roughness: .82 });
  const color = new THREE.Color();
  const dummy = new THREE.Object3D();
  for (let i = 0; i < 6; i++) {
    const angle = (i + seed * .05) * 2.39996;
    const dx = Math.cos(angle);
    const dz = Math.sin(angle);
    const height = .75 + (i % 3) * .24;
    beam(plant, [0, .32, 0], [dx * .33, height + .32, dz * .33], .014, .014, stem, false);
    for (let j = 0; j < 5; j++) {
      const t = .26 + j * .17;
      dummy.position.set(dx * .33 * t, .32 + height * t, dz * .33 * t);
      dummy.rotation.set(.65 + (j % 3) * .27, -angle + j * 1.65, .65 * (j % 2 ? 1 : -1));
      dummy.scale.setScalar(.66 + .27 * Math.sin((i + j) * 1.91) + j * .055);
      dummy.updateMatrix();
      const index = i * 5 + j;
      leaves.setMatrixAt(index, dummy.matrix);
      leaves.setColorAt(index, color.setHSL(.22 + .05 * Math.sin(i + j), .37, .21 + .055 * Math.cos(index)));
    }
  }
  leaves.castShadow = true;
  leaves.receiveShadow = true;
  plant.add(leaves);
  return plant;
}
