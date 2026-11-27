// Fio como curva de pontos Verlet com restrições de comprimento.
// Passo fixo, dt limitado, amortecimento, limite de velocidade e colisão com planos simples.
// Sem dependência de Three.js: testável em Node.

export interface Vec3 { x: number; y: number; z: number }

export interface RopeOptions {
  segments: number;
  length: number;
  /** 0 = frouxo (muita folga), 1 = tenso (comprimento ~ distância entre âncoras) */
  tension: number;
  damping?: number;
  gravity?: number;
  iterations?: number;
  /** velocidade máxima por passo (m/s) */
  maxSpeed?: number;
}

export const FIXED_DT = 1 / 60;
const MAX_STEPS = 4;

export class VerletRope {
  readonly n: number;
  pos: Float64Array;
  prev: Float64Array;
  pinned: Uint8Array;
  restLength: number;
  baseLength: number;
  tension: number;
  damping: number;
  gravity: number;
  iterations: number;
  maxSpeed: number;
  /** planos de colisão: ponto mínimo de z (frente do tecido) e chão */
  floorY = -Infinity;
  minZ = -Infinity;
  private acc = 0;

  constructor(start: Vec3, end: Vec3, opts: RopeOptions) {
    this.n = Math.max(2, Math.floor(opts.segments) + 1);
    this.pos = new Float64Array(this.n * 3);
    this.prev = new Float64Array(this.n * 3);
    this.pinned = new Uint8Array(this.n);
    this.baseLength = Math.max(0.001, opts.length);
    this.tension = clamp01(opts.tension);
    this.restLength = this.segLength();
    this.damping = opts.damping ?? 0.985;
    this.gravity = opts.gravity ?? -9.8;
    this.iterations = opts.iterations ?? 14;
    this.maxSpeed = opts.maxSpeed ?? 6;
    this.reset(start, end);
  }

  /** Comprimento de cada segmento: mais folga com tensão baixa. */
  private segLength(): number {
    const slack = 1 + (1 - this.tension) * 0.45;
    return (this.baseLength * slack) / (this.n - 1);
  }

  reset(start: Vec3, end: Vec3): void {
    for (let i = 0; i < this.n; i++) {
      const t = i / (this.n - 1);
      const x = start.x + (end.x - start.x) * t;
      const y = start.y + (end.y - start.y) * t;
      const z = start.z + (end.z - start.z) * t;
      this.pos[i * 3] = this.prev[i * 3] = x;
      this.pos[i * 3 + 1] = this.prev[i * 3 + 1] = y;
      this.pos[i * 3 + 2] = this.prev[i * 3 + 2] = z;
    }
    this.acc = 0;
  }

  setTension(t: number): void {
    this.tension = clamp01(t);
    this.restLength = this.segLength();
  }

  setLength(len: number): void {
    this.baseLength = Math.max(0.001, len);
    this.restLength = this.segLength();
  }

  pin(i: number, p: Vec3): void {
    const k = i * 3;
    this.pinned[i] = 1;
    this.pos[k] = p.x; this.pos[k + 1] = p.y; this.pos[k + 2] = p.z;
    this.prev[k] = p.x; this.prev[k + 1] = p.y; this.prev[k + 2] = p.z;
  }

  unpin(i: number): void { this.pinned[i] = 0; }

  /** Avança com passo fixo. dt é limitado para evitar explosão após pausa. */
  update(dt: number): number {
    this.acc += Math.min(Math.max(dt, 0), FIXED_DT * MAX_STEPS);
    let steps = 0;
    while (this.acc >= FIXED_DT && steps < MAX_STEPS) {
      this.step(FIXED_DT);
      this.acc -= FIXED_DT;
      steps++;
    }
    return steps;
  }

  step(h: number): void {
    const { pos, prev, pinned, n } = this;
    const vmax = this.maxSpeed * h;
    for (let i = 0; i < n; i++) {
      if (pinned[i]) continue;
      const k = i * 3;
      for (let c = 0; c < 3; c++) {
        let v = (pos[k + c] - prev[k + c]) * this.damping;
        if (v > vmax) v = vmax; else if (v < -vmax) v = -vmax;
        prev[k + c] = pos[k + c];
        pos[k + c] += v + (c === 1 ? this.gravity * h * h : 0);
      }
    }
    // Tensão alta = restrições mais rígidas (mais iterações efetivas).
    const iters = Math.round(this.iterations * (0.6 + this.tension * 0.8));
    const L = this.restLength;
    for (let it = 0; it < iters; it++) {
      for (let i = 0; i < n - 1; i++) {
        const a = i * 3;
        const b = a + 3;
        const dx = pos[b] - pos[a];
        const dy = pos[b + 1] - pos[a + 1];
        const dz = pos[b + 2] - pos[a + 2];
        const d = Math.sqrt(dx * dx + dy * dy + dz * dz) || 1e-9;
        // Fio não resiste à compressão: só corrige se esticar além do repouso.
        if (d <= L) continue;
        const diff = (d - L) / d;
        const wa = pinned[i] ? 0 : 1;
        const wb = pinned[i + 1] ? 0 : 1;
        const w = wa + wb;
        if (w === 0) continue;
        const fa = (diff * wa) / w;
        const fb = (diff * wb) / w;
        pos[a] += dx * fa; pos[a + 1] += dy * fa; pos[a + 2] += dz * fa;
        pos[b] -= dx * fb; pos[b + 1] -= dy * fb; pos[b + 2] -= dz * fb;
      }
      for (let i = 0; i < n; i++) {
        if (pinned[i]) continue;
        const k = i * 3;
        if (pos[k + 1] < this.floorY) pos[k + 1] = this.floorY;
        if (pos[k + 2] < this.minZ) pos[k + 2] = this.minZ;
      }
    }
  }

  point(i: number, out: Vec3): Vec3 {
    const k = i * 3;
    out.x = this.pos[k]; out.y = this.pos[k + 1]; out.z = this.pos[k + 2];
    return out;
  }

  /** Flecha máxima (distância do ponto mais afastado à corda entre extremidades). */
  sag(): number {
    const { pos, n } = this;
    const ax = pos[0], ay = pos[1], az = pos[2];
    const bx = pos[(n - 1) * 3], by = pos[(n - 1) * 3 + 1], bz = pos[(n - 1) * 3 + 2];
    const lx = bx - ax, ly = by - ay, lz = bz - az;
    const ll = lx * lx + ly * ly + lz * lz || 1e-9;
    let max = 0;
    for (let i = 1; i < n - 1; i++) {
      const k = i * 3;
      const px = pos[k] - ax, py = pos[k + 1] - ay, pz = pos[k + 2] - az;
      const t = (px * lx + py * ly + pz * lz) / ll;
      const cx = px - lx * t, cy = py - ly * t, cz = pz - lz * t;
      max = Math.max(max, Math.sqrt(cx * cx + cy * cy + cz * cz));
    }
    return max;
  }

  isFinite(): boolean {
    for (let i = 0; i < this.pos.length; i++) if (!Number.isFinite(this.pos[i])) return false;
    return true;
  }
}

function clamp01(v: number): number {
  return Number.isFinite(v) ? Math.max(0, Math.min(1, v)) : 0.5;
}
