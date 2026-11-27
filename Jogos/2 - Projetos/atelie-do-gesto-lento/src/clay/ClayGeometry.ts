import * as THREE from 'three';
import { ClayConfig } from '../types';

export class ClayGeometry {
  public geometry: THREE.BufferGeometry;
  public config: ClayConfig;

  // Stride counts
  public readonly M: number; // height rings
  public readonly N: number; // angular segments

  // Layout offsets
  private readonly outerOffset: number;
  private readonly innerOffset: number;
  private readonly totalVertices: number;

  // Attribute arrays
  private positions: Float32Array;
  private normals: Float32Array;
  private uvs: Float32Array;
  private wetness: Float32Array;
  private indices: Uint32Array;

  constructor(config: ClayConfig) {
    this.config = { ...config };
    this.M = config.rings;
    this.N = config.segments;

    // Topology:
    // Outer surface: M * (N + 1)
    // Inner surface: M * (N + 1)
    // Base center: 2 (outer center bottom, inner center bottom)
    const vertsPerSurface = this.M * (this.N + 1);
    this.outerOffset = 0;
    this.innerOffset = vertsPerSurface;
    const baseOuterCenter = vertsPerSurface * 2;
    const baseInnerCenter = baseOuterCenter + 1;
    this.totalVertices = baseInnerCenter + 1;

    this.positions = new Float32Array(this.totalVertices * 3);
    this.normals = new Float32Array(this.totalVertices * 3);
    this.uvs = new Float32Array(this.totalVertices * 2);
    this.wetness = new Float32Array(this.totalVertices);

    // Compute static UVs and Indices
    const indexList: number[] = [];

    // 1. Outer Surface Triangles
    for (let j = 0; j < this.M - 1; j++) {
      for (let i = 0; i < this.N; i++) {
        const a = this.outerOffset + j * (this.N + 1) + i;
        const b = this.outerOffset + j * (this.N + 1) + (i + 1);
        const c = this.outerOffset + (j + 1) * (this.N + 1) + (i + 1);
        const d = this.outerOffset + (j + 1) * (this.N + 1) + i;
        indexList.push(a, b, c);
        indexList.push(a, c, d);
      }
    }

    // 2. Inner Surface Triangles (Reversed winding to face interior)
    for (let j = 0; j < this.M - 1; j++) {
      for (let i = 0; i < this.N; i++) {
        const a = this.innerOffset + j * (this.N + 1) + i;
        const b = this.innerOffset + j * (this.N + 1) + (i + 1);
        const c = this.innerOffset + (j + 1) * (this.N + 1) + (i + 1);
        const d = this.innerOffset + (j + 1) * (this.N + 1) + i;
        indexList.push(a, c, b);
        indexList.push(a, d, c);
      }
    }

    // 3. Top Rim Triangles (Joining top outer ring with top inner ring)
    const topOuterBase = this.outerOffset + (this.M - 1) * (this.N + 1);
    const topInnerBase = this.innerOffset + (this.M - 1) * (this.N + 1);
    for (let i = 0; i < this.N; i++) {
      const o1 = topOuterBase + i;
      const o2 = topOuterBase + (i + 1);
      const in1 = topInnerBase + i;
      const in2 = topInnerBase + (i + 1);
      indexList.push(o1, in1, in2);
      indexList.push(o1, in2, o2);
    }

    // 4. Bottom Outer Disk (Closed base)
    const bottomOuterBase = this.outerOffset; // j = 0
    for (let i = 0; i < this.N; i++) {
      const v1 = bottomOuterBase + i;
      const v2 = bottomOuterBase + (i + 1);
      indexList.push(baseOuterCenter, v2, v1);
    }

    // 5. Bottom Inner Floor
    const bottomInnerBase = this.innerOffset; // j = 0
    for (let i = 0; i < this.N; i++) {
      const v1 = bottomInnerBase + i;
      const v2 = bottomInnerBase + (i + 1);
      indexList.push(baseInnerCenter, v1, v2);
    }

    this.indices = new Uint32Array(indexList);

    // Build UVs
    for (let j = 0; j < this.M; j++) {
      const v = j / (this.M - 1);
      for (let i = 0; i <= this.N; i++) {
        const u = i / this.N;
        // Outer UV
        const outIdx = (this.outerOffset + j * (this.N + 1) + i) * 2;
        this.uvs[outIdx] = u * 4.0;
        this.uvs[outIdx + 1] = v * 2.5;

        // Inner UV
        const inIdx = (this.innerOffset + j * (this.N + 1) + i) * 2;
        this.uvs[inIdx] = u * 4.0;
        this.uvs[inIdx + 1] = v * 2.5;
      }
    }
    // Base centers UV
    this.uvs[baseOuterCenter * 2] = 0.5;
    this.uvs[baseOuterCenter * 2 + 1] = 0.5;
    this.uvs[baseInnerCenter * 2] = 0.5;
    this.uvs[baseInnerCenter * 2 + 1] = 0.5;

    this.geometry = new THREE.BufferGeometry();
    this.geometry.setAttribute('position', new THREE.BufferAttribute(this.positions, 3));
    this.geometry.setAttribute('normal', new THREE.BufferAttribute(this.normals, 3));
    this.geometry.setAttribute('uv', new THREE.BufferAttribute(this.uvs, 2));
    this.geometry.setAttribute('aWetness', new THREE.BufferAttribute(this.wetness, 1));
    this.geometry.setIndex(new THREE.BufferAttribute(this.indices, 1));
  }

  /**
   * Reconstruct vertex positions from logical radius and thickness grids.
   */
  public updatePositions(
    radii: Float32Array,
    thickness: Float32Array,
    marks: Float32Array,
    currentHeight: number
  ): void {
    const h = currentHeight;
    const baseThickness = this.config.baseThickness;

    // Outer & Inner Vertices
    for (let j = 0; j < this.M; j++) {
      const t = j / (this.M - 1);
      const yOuter = h * t;
      const yInner = baseThickness + (h - baseThickness) * t;

      for (let i = 0; i <= this.N; i++) {
        const logicalI = i % this.N;
        const gridIdx = j * this.N + logicalI;

        const theta = (logicalI / this.N) * Math.PI * 2;
        const sinT = Math.sin(theta);
        const cosT = Math.cos(theta);

        const rExt = radii[gridIdx] - marks[gridIdx];
        const thick = Math.max(this.config.minThickness, thickness[gridIdx]);
        const rInt = Math.max(0.008, rExt - thick);

        // Outer Vertex
        const outVertIdx = (this.outerOffset + j * (this.N + 1) + i) * 3;
        this.positions[outVertIdx] = cosT * rExt;
        this.positions[outVertIdx + 1] = yOuter;
        this.positions[outVertIdx + 2] = sinT * rExt;

        // Inner Vertex
        const inVertIdx = (this.innerOffset + j * (this.N + 1) + i) * 3;
        this.positions[inVertIdx] = cosT * rInt;
        this.positions[inVertIdx + 1] = yInner;
        this.positions[inVertIdx + 2] = sinT * rInt;
      }
    }

    // Base Centers
    const baseOuterIdx = (this.outerOffset + this.M * (this.N + 1) * 2) * 3;
    this.positions[baseOuterIdx] = 0;
    this.positions[baseOuterIdx + 1] = 0;
    this.positions[baseOuterIdx + 2] = 0;

    const baseInnerIdx = (baseOuterIdx / 3 + 1) * 3;
    this.positions[baseInnerIdx] = 0;
    this.positions[baseInnerIdx + 1] = baseThickness;
    this.positions[baseInnerIdx + 2] = 0;

    this.geometry.attributes.position.needsUpdate = true;
    this.computeSmoothNormals();
  }

  /**
   * Computes face normals and stitches the seam vertices at col 0 and col N
   * so lighting does not create a dark vertical boundary.
   */
  public computeSmoothNormals(): void {
    this.geometry.computeVertexNormals();

    const normalAttr = this.geometry.attributes.normal as THREE.BufferAttribute;
    const nArray = normalAttr.array as Float32Array;

    // Stitch seam for outer and inner surfaces
    for (let surface = 0; surface < 2; surface++) {
      const offset = surface === 0 ? this.outerOffset : this.innerOffset;
      for (let j = 0; j < this.M; j++) {
        const idx0 = (offset + j * (this.N + 1) + 0) * 3;
        const idxN = (offset + j * (this.N + 1) + this.N) * 3;

        // Average normals
        const nx = (nArray[idx0] + nArray[idxN]) * 0.5;
        const ny = (nArray[idx0 + 1] + nArray[idxN + 1]) * 0.5;
        const nz = (nArray[idx0 + 2] + nArray[idxN + 2]) * 0.5;
        const len = Math.sqrt(nx * nx + ny * ny + nz * nz) || 1.0;

        const avgX = nx / len;
        const avgY = ny / len;
        const avgZ = nz / len;

        nArray[idx0] = avgX;
        nArray[idx0 + 1] = avgY;
        nArray[idx0 + 2] = avgZ;

        nArray[idxN] = avgX;
        nArray[idxN + 1] = avgY;
        nArray[idxN + 2] = avgZ;
      }
    }

    normalAttr.needsUpdate = true;
  }

  /**
   * Adds wetness to vertices touched by the sculpting tool.
   */
  public addWetness(centerJ: number, centerI: number, radiusGrid: number): void {
    const rSq = radiusGrid * radiusGrid;
    for (let dj = -radiusGrid; dj <= radiusGrid; dj++) {
      const j = centerJ + dj;
      if (j < 0 || j >= this.M) continue;

      for (let di = -radiusGrid; di <= radiusGrid; di++) {
        const distSq = dj * dj + di * di;
        if (distSq > rSq) continue;

        const i = (centerI + di + this.N * 10) % this.N;
        const factor = Math.exp(-distSq / (2 * (radiusGrid * 0.5) ** 2));

        const vIdx = this.outerOffset + j * (this.N + 1) + i;
        this.wetness[vIdx] = Math.min(1.0, this.wetness[vIdx] + factor * 0.45);
        if (i === 0) {
          // Sync seam
          this.wetness[this.outerOffset + j * (this.N + 1) + this.N] = this.wetness[vIdx];
        }
      }
    }
    this.geometry.attributes.aWetness.needsUpdate = true;
  }

  /**
   * Relaxes wetness back to dry clay appearance over 20-40 seconds.
   */
  public relaxWetness(deltaSeconds: number): void {
    const decay = Math.exp(-deltaSeconds / 28.0);
    let changed = false;
    for (let k = 0; k < this.totalVertices; k++) {
      if (this.wetness[k] > 0.001) {
        this.wetness[k] *= decay;
        changed = true;
      } else {
        this.wetness[k] = 0;
      }
    }
    if (changed) {
      this.geometry.attributes.aWetness.needsUpdate = true;
    }
  }

  public dispose(): void {
    this.geometry.dispose();
  }
}
