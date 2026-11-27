// Tubo de topologia fixa atualizado in-place a partir de pontos (sem realocar a cada quadro).
import * as THREE from 'three';

export class RopeMesh extends THREE.Mesh<THREE.BufferGeometry, THREE.Material> {
  readonly points: number;
  readonly radial: number;
  radius: number;
  private pos: Float32Array;
  private nor: Float32Array;

  constructor(points: number, radius: number, material: THREE.Material, radial = 6) {
    const geo = new THREE.BufferGeometry();
    const n = points * (radial + 1);
    const pos = new Float32Array(n * 3);
    const nor = new Float32Array(n * 3);
    const uv = new Float32Array(n * 2);
    const idx: number[] = [];
    for (let i = 0; i < points; i++) for (let j = 0; j <= radial; j++) {
      uv[(i * (radial + 1) + j) * 2] = i;
      uv[(i * (radial + 1) + j) * 2 + 1] = j / radial;
      if (i < points - 1 && j < radial) {
        const a = i * (radial + 1) + j, b = a + radial + 1;
        idx.push(a, b, a + 1, b, b + 1, a + 1);
      }
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3).setUsage(THREE.DynamicDrawUsage));
    geo.setAttribute('normal', new THREE.BufferAttribute(nor, 3).setUsage(THREE.DynamicDrawUsage));
    geo.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
    geo.setIndex(idx);
    super(geo, material);
    this.points = points;
    this.radial = radial;
    this.radius = radius;
    this.pos = pos;
    this.nor = nor;
    this.frustumCulled = false;
    this.castShadow = false;
  }

  /** Atualiza a partir de coordenadas xyz planas (Float64Array ou number[]). */
  setFromArray(src: ArrayLike<number>, count = this.points, uvScale = 1 / 0.011): void {
    const P = this.points, R = this.radial;
    const tmpT = new THREE.Vector3(), tmpN = new THREE.Vector3(), tmpB = new THREE.Vector3();
    let prevN: THREE.Vector3 | null = null;
    const uv = this.geometry.getAttribute('uv') as THREE.BufferAttribute;
    let acc = 0;
    for (let i = 0; i < P; i++) {
      const k = Math.min(i, count - 1) * 3;
      const x = src[k], y = src[k + 1], z = src[k + 2];
      const ka = Math.max(0, Math.min(i, count - 1) - 1) * 3, kb = Math.min(count - 1, Math.min(i, count - 1) + 1) * 3;
      tmpT.set(src[kb] - src[ka], src[kb + 1] - src[ka + 1], src[kb + 2] - src[ka + 2]);
      if (tmpT.lengthSq() < 1e-14) tmpT.set(1, 0, 0);
      tmpT.normalize();
      if (!prevN) {
        tmpN.set(0, 0, 1);
        if (Math.abs(tmpN.dot(tmpT)) > 0.9) tmpN.set(0, 1, 0);
      } else tmpN.copy(prevN);
      tmpN.addScaledVector(tmpT, -tmpN.dot(tmpT)).normalize();
      tmpB.crossVectors(tmpT, tmpN);
      prevN = prevN ?? new THREE.Vector3();
      prevN.copy(tmpN);
      if (i > 0) {
        const kp = Math.min(i - 1, count - 1) * 3;
        acc += Math.hypot(x - src[kp], y - src[kp + 1], z - src[kp + 2]);
      }
      for (let j = 0; j <= R; j++) {
        const a = (j / R) * Math.PI * 2;
        const c = Math.cos(a), s = Math.sin(a);
        const nx = tmpN.x * c + tmpB.x * s, ny = tmpN.y * c + tmpB.y * s, nz = tmpN.z * c + tmpB.z * s;
        const v = (i * (R + 1) + j) * 3;
        this.nor[v] = nx; this.nor[v + 1] = ny; this.nor[v + 2] = nz;
        this.pos[v] = x + nx * this.radius; this.pos[v + 1] = y + ny * this.radius; this.pos[v + 2] = z + nz * this.radius;
        uv.setX(i * (R + 1) + j, acc * uvScale);
      }
    }
    this.geometry.attributes.position.needsUpdate = true;
    this.geometry.attributes.normal.needsUpdate = true;
    uv.needsUpdate = true;
    this.geometry.computeBoundingSphere();
  }
}
