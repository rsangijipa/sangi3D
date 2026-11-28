export interface HeightmapConfig {
  cols: number;
  rows: number;
  baseHeight: number;
  minHeight: number;
  maxHeight: number;
}

export type SculptOp = 'press' | 'pull' | 'flatten' | 'smooth' | 'add' | 'remove' | 'rake' | 'stamp' | 'level';

export interface HeightmapSnapshot {
  heights: Float32Array;
  owners: Uint8Array;
}

export class HeightmapField {
  public readonly cols: number;
  public readonly rows: number;
  public readonly baseHeight: number;
  public readonly minHeight: number;
  public readonly maxHeight: number;
  public heights: Float32Array;
  public owners: Uint8Array;

  constructor(config: HeightmapConfig) {
    this.cols = config.cols;
    this.rows = config.rows;
    this.baseHeight = config.baseHeight;
    this.minHeight = config.minHeight;
    this.maxHeight = config.maxHeight;
    this.heights = new Float32Array(this.cols * this.rows);
    this.owners = new Uint8Array(this.cols * this.rows);
    this.reset();
  }

  public reset(initialShape?: (nx: number, ny: number) => number): void {
    for (let y = 0; y < this.rows; y++) {
      const ny = y / (this.rows - 1);
      for (let x = 0; x < this.cols; x++) {
        const nx = x / (this.cols - 1);
        const idx = y * this.cols + x;
        this.heights[idx] = initialShape ? initialShape(nx, ny) : this.baseHeight;
        this.owners[idx] = 0;
      }
    }
  }

  public snapshot(): HeightmapSnapshot {
    return {
      heights: new Float32Array(this.heights),
      owners: new Uint8Array(this.owners)
    };
  }

  public restore(snap: HeightmapSnapshot): void {
    if (snap.heights.length === this.heights.length) {
      this.heights.set(snap.heights);
      this.owners.set(snap.owners);
    }
  }

  public applyBrush(params: {
    u: number;
    v: number;
    prevU?: number;
    prevV?: number;
    radius: number;
    strength: number;
    op: SculptOp;
    ownerId: 1 | 2;
    tines?: number;
  }): boolean {
    const { u, v, prevU, prevV, radius, strength, op, ownerId, tines = 4 } = params;
    const cx = u * (this.cols - 1);
    const cy = v * (this.rows - 1);
    const rCells = Math.max(1, radius * Math.max(this.cols, this.rows));
    const minX = Math.max(0, Math.floor(cx - rCells));
    const maxX = Math.min(this.cols - 1, Math.ceil(cx + rCells));
    const minY = Math.max(0, Math.floor(cy - rCells));
    const maxY = Math.min(this.rows - 1, Math.ceil(cy + rCells));

    let dx = (u - (prevU ?? u));
    let dy = (v - (prevV ?? v));
    const len = Math.hypot(dx, dy);
    if (len > 1e-5) {
      dx /= len;
      dy /= len;
    } else {
      dx = 1;
      dy = 0;
    }
    const perpX = -dy;
    const perpY = dx;

    let targetAvg = this.baseHeight;
    if (op === 'flatten' || op === 'level') {
      let sum = 0;
      let count = 0;
      for (let y = minY; y <= maxY; y++) {
        for (let x = minX; x <= maxX; x++) {
          const dist = Math.hypot(x - cx, y - cy);
          if (dist <= rCells) {
            sum += this.heights[y * this.cols + x];
            count++;
          }
        }
      }
      targetAvg = op === 'level' ? this.baseHeight : (count > 0 ? sum / count : this.baseHeight);
    }

    const copyForSmooth = op === 'smooth' ? new Float32Array(this.heights) : null;
    let modified = false;

    for (let y = minY; y <= maxY; y++) {
      for (let x = minX; x <= maxX; x++) {
        const offX = x - cx;
        const offY = y - cy;
        const dist = Math.hypot(offX, offY);
        if (dist > rCells) continue;

        const norm = dist / rCells;
        const falloff = 0.5 * (1 + Math.cos(Math.PI * norm)); // smooth cosine kernel
        const idx = y * this.cols + x;
        let h = this.heights[idx];

        if (op === 'press' || op === 'remove') {
          h -= strength * falloff;
          if (op === 'press' && norm > 0.55) {
            h += strength * 0.28 * (1 - Math.abs(norm - 0.78) / 0.25);
          }
        } else if (op === 'pull' || op === 'add') {
          h += strength * falloff;
        } else if (op === 'flatten' || op === 'level') {
          h += (targetAvg - h) * Math.min(1, strength * 3.0 * falloff);
        } else if (op === 'smooth' && copyForSmooth) {
          let sum = 0;
          let cnt = 0;
          for (let sy = Math.max(0, y - 1); sy <= Math.min(this.rows - 1, y + 1); sy++) {
            for (let sx = Math.max(0, x - 1); sx <= Math.min(this.cols - 1, x + 1); sx++) {
              sum += copyForSmooth[sy * this.cols + sx];
              cnt++;
            }
          }
          const avg = sum / cnt;
          h += (avg - h) * Math.min(1, strength * 3.5 * falloff);
        } else if (op === 'rake') {
          const across = (offX * perpX + offY * perpY) / rCells;
          const wave = Math.cos(across * Math.PI * tines);
          h += wave * strength * falloff;
        } else if (op === 'stamp') {
          const rim = norm > 0.65 ? (1 - Math.abs(norm - 0.82) / 0.2) * strength * 0.65 : -strength * falloff;
          h += rim;
        }

        const clamped = Math.max(this.minHeight, Math.min(this.maxHeight, h));
        if (Math.abs(clamped - this.heights[idx]) > 1e-6) {
          this.heights[idx] = clamped;
          this.owners[idx] = ownerId;
          modified = true;
        }
      }
    }

    return modified;
  }
}

export interface VerletNode {
  x: number;
  y: number;
  z: number;
  oldX: number;
  oldY: number;
  oldZ: number;
  pinned: boolean;
}

export class VerletRibbon {
  public readonly nodes: VerletNode[] = [];
  public readonly segmentLength: number;
  public readonly damping: number;
  public readonly gravity: number;

  constructor(
    anchor: { x: number; y: number; z: number },
    segments: number,
    segmentLength: number,
    damping = 0.975,
    gravity = -0.0085
  ) {
    this.segmentLength = segmentLength;
    this.damping = damping;
    this.gravity = gravity;

    for (let i = 0; i <= segments; i++) {
      const y = anchor.y - i * segmentLength;
      this.nodes.push({
        x: anchor.x,
        y,
        z: anchor.z,
        oldX: anchor.x,
        oldY: y,
        oldZ: anchor.z,
        pinned: i === 0
      });
    }
  }

  public applyImpulse(nodeIndex: number, ix: number, iy: number, iz: number): void {
    const idx = Math.max(1, Math.min(this.nodes.length - 1, nodeIndex));
    const n = this.nodes[idx];
    if (n.pinned) return;
    n.oldX -= ix;
    n.oldY -= iy;
    n.oldZ -= iz;
  }

  public step(windX = 0, windZ = 0, iterations = 6): void {
    for (let i = 0; i < this.nodes.length; i++) {
      const n = this.nodes[i];
      if (n.pinned) continue;
      const vx = (n.x - n.oldX) * this.damping;
      const vy = (n.y - n.oldY) * this.damping;
      const vz = (n.z - n.oldZ) * this.damping;
      n.oldX = n.x;
      n.oldY = n.y;
      n.oldZ = n.z;
      n.x += vx + windX;
      n.y += vy + this.gravity;
      n.z += vz + windZ;
    }

    for (let iter = 0; iter < iterations; iter++) {
      for (let i = 0; i < this.nodes.length - 1; i++) {
        const a = this.nodes[i];
        const b = this.nodes[i + 1];
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const dz = b.z - a.z;
        const dist = Math.hypot(dx, dy, dz) || 1e-6;
        const diff = (dist - this.segmentLength) / dist;
        if (a.pinned) {
          b.x -= dx * diff;
          b.y -= dy * diff;
          b.z -= dz * diff;
        } else {
          const half = diff * 0.5;
          a.x += dx * half;
          a.y += dy * half;
          a.z += dz * half;
          b.x -= dx * half;
          b.y -= dy * half;
          b.z -= dz * half;
        }
      }
    }
  }

  public reset(): void {
    const anchor = this.nodes[0];
    for (let i = 1; i < this.nodes.length; i++) {
      const n = this.nodes[i];
      n.x = anchor.x;
      n.y = anchor.y - i * this.segmentLength;
      n.z = anchor.z;
      n.oldX = n.x;
      n.oldY = n.y;
      n.oldZ = n.z;
    }
  }
}

export function blendPigments(
  baseRgb: [number, number, number],
  strokeRgb: [number, number, number],
  alpha: number,
  mixFactor = 0.55
): [number, number, number] {
  const t = Math.max(0, Math.min(1, alpha * mixFactor));
  // Subtractive-inspired perceptual blend
  const r = Math.sqrt((1 - t) * baseRgb[0] * baseRgb[0] + t * strokeRgb[0] * strokeRgb[0]);
  const g = Math.sqrt((1 - t) * baseRgb[1] * baseRgb[1] + t * strokeRgb[1] * strokeRgb[1]);
  const b = Math.sqrt((1 - t) * baseRgb[2] * baseRgb[2] + t * strokeRgb[2] * strokeRgb[2]);
  return [Math.round(r), Math.round(g), Math.round(b)];
}

export function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace('#', '');
  const n = parseInt(clean, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
