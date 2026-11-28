// Peça de argila: malha de parede dupla resolvida por anéis × setores.
import * as THREE from 'three';

export const RINGS = 56;
export const SECTORS = 112;
export const THICK = 0.034;
const MIN_R = 0.045, MAX_R = 0.36, MIN_H = 0.16, MAX_H = 0.78;

export type ShapeId = 'cilindro' | 'bojo' | 'cumbuca' | 'anfora';
export type MarkId = 'sulco' | 'onda' | 'folha' | 'espiral';
export type ToolId = 'modelar' | 'alisar' | 'marcar';

export const SHAPES: Record<ShapeId, { label: string; h: number; f: (t: number) => number }> = {
  cilindro: { label: 'Cilindro bruto', h: 0.4, f: (t) => 0.2 + 0.012 * Math.sin(t * 9) - 0.02 * t },
  bojo: { label: 'Vaso bojo', h: 0.48, f: (t) => 0.11 + 0.12 * Math.sin(Math.PI * Math.min(1, t * 1.05)) + (t > 0.85 ? (t - 0.85) * 0.5 : 0) },
  cumbuca: { label: 'Cumbuca baixa', h: 0.22, f: (t) => 0.12 + 0.15 * Math.pow(t, 0.55) },
  anfora: {
    label: 'Ânfora serena', h: 0.62,
    f: (t) => {
      const belly = 0.17 * Math.exp(-Math.pow((t - 0.38) / 0.24, 2));
      const neck = t > 0.7 ? 0.0 : 0;
      const lip = t > 0.9 ? (t - 0.9) * 0.9 : 0;
      return 0.07 + belly + neck + lip;
    },
  },
};

export interface Snapshot { rad: Float32Array; wet: Float32Array; height: number }

const L = 1 + RINGS + 1 + RINGS + 1; // profile length upper bound

export class Clay {
  rad = new Float32Array(RINGS * SECTORS);
  wet = new Float32Array(RINGS * SECTORS);
  height = 0.4;
  readonly floorRing = 4;
  readonly geometry = new THREE.BufferGeometry();
  private profLen: number;
  private pos: Float32Array;
  private wetAttr: Float32Array;
  private tmp = new Float32Array(RINGS * SECTORS);
  dirty = true;

  constructor() {
    this.profLen = 1 + RINGS + 1 + (RINGS - this.floorRing) + 1;
    const cols = SECTORS + 1;
    const n = cols * this.profLen;
    this.pos = new Float32Array(n * 3);
    this.wetAttr = new Float32Array(n);
    const uv = new Float32Array(n * 2);
    for (let s = 0; s < cols; s++) for (let i = 0; i < this.profLen; i++) {
      const k = s * this.profLen + i;
      uv[k * 2] = s / SECTORS * 3;
      uv[k * 2 + 1] = i / (this.profLen - 1) * 2.2;
    }
    const idx: number[] = [];
    for (let s = 0; s < SECTORS; s++) for (let i = 0; i < this.profLen - 1; i++) {
      const a = s * this.profLen + i, b = a + this.profLen, c = b + 1, d = a + 1;
      idx.push(a, b, d, c, d, b);
    }
    this.geometry.setIndex(idx);
    this.geometry.setAttribute('position', new THREE.BufferAttribute(this.pos, 3).setUsage(THREE.DynamicDrawUsage));
    this.geometry.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
    this.geometry.setAttribute('wet', new THREE.BufferAttribute(this.wetAttr, 1).setUsage(THREE.DynamicDrawUsage));
    this.reset('bojo');
    void L;
  }

  reset(shape: ShapeId) {
    const sh = SHAPES[shape];
    this.height = sh.h;
    for (let r = 0; r < RINGS; r++) {
      const t = r / (RINGS - 1);
      for (let s = 0; s < SECTORS; s++) {
        // Imperfeição viva: leve assimetria do gesto inicial.
        const wob = 0.004 * Math.sin(s / SECTORS * Math.PI * 2 * 3 + t * 4) + 0.003 * Math.sin(s / SECTORS * Math.PI * 2 * 5 - t * 7);
        this.rad[r * SECTORS + s] = Math.max(MIN_R, sh.f(t) + wob);
        this.wet[r * SECTORS + s] = 0.62;
      }
    }
    this.dirty = true;
  }

  snapshot(): Snapshot { return { rad: this.rad.slice(), wet: this.wet.slice(), height: this.height }; }
  restore(s: Snapshot) { this.rad.set(s.rad); this.wet.set(s.wet); this.height = s.height; this.dirty = true; }

  ringY(r: number) { return r / (RINGS - 1) * this.height; }

  /** Converte ponto local em coordenadas da malha (anel, setor). */
  locate(p: THREE.Vector3) {
    const ringF = THREE.MathUtils.clamp(p.y / this.height * (RINGS - 1), 0, RINGS - 1);
    let ang = Math.atan2(p.x, p.z);
    if (ang < 0) ang += Math.PI * 2;
    const sectorF = ang / (Math.PI * 2) * SECTORS;
    return { ringF, sectorF };
  }

  stats() {
    let w = 0, asym = 0, maxR = 0, topR = 0;
    for (let r = 0; r < RINGS; r++) {
      let m = 0;
      for (let s = 0; s < SECTORS; s++) m += this.rad[r * SECTORS + s];
      m /= SECTORS;
      let v = 0;
      for (let s = 0; s < SECTORS; s++) { const d = this.rad[r * SECTORS + s] - m; v += d * d; w += this.wet[r * SECTORS + s]; }
      asym += Math.sqrt(v / SECTORS) / Math.max(m, 0.01);
      maxR = Math.max(maxR, m);
      if (r === RINGS - 1) topR = m;
    }
    return { wet: w / (RINGS * SECTORS), asym: asym / RINGS, maxR, topR, height: this.height };
  }

  /** Aplica uma ferramenta. amount em unidades de mundo (positivo = abrir). */
  apply(tool: ToolId, ringF: number, sectorF: number, amount: number, opts: { whole: boolean; pressure: number; mark: MarkId; phase: number }) {
    const sigR = tool === 'marcar' ? 1.1 : 2.2 + opts.pressure * 2.2;
    const sigS = tool === 'marcar' ? 2.2 : 4 + opts.pressure * 5;
    const r0 = Math.max(0, Math.floor(ringF - sigR * 3)), r1 = Math.min(RINGS - 1, Math.ceil(ringF + sigR * 3));
    let moved = 0;
    if (tool === 'modelar') {
      for (let r = r0; r <= r1; r++) {
        const wr = Math.exp(-Math.pow((r - ringF) / sigR, 2)) * THREE.MathUtils.smoothstep(r, 0, 5);
        if (wr < 0.01) continue;
        for (let s = 0; s < SECTORS; s++) {
          const ws = opts.whole ? 1 : Math.exp(-Math.pow(this.sdist(s, sectorF) / sigS, 2));
          const w = wr * ws;
          if (w < 0.01) continue;
          const k = r * SECTORS + s;
          const plastic = 0.35 + this.wet[k] * 0.9; // argila seca resiste
          const d = amount * w * plastic;
          const nr = THREE.MathUtils.clamp(this.rad[k] + d, MIN_R, MAX_R);
          moved += (nr - this.rad[k]) / SECTORS;
          this.rad[k] = nr;
          this.wet[k] = Math.max(0, this.wet[k] - Math.abs(d) * 0.9);
        }
      }
      // Conservação aproximada de volume: estreitar empurra o barro para cima.
      this.height = THREE.MathUtils.clamp(this.height - moved * 0.55, MIN_H, MAX_H);
      this.relax(r0, r1, 0.12);
    } else if (tool === 'alisar') {
      this.tmp.set(this.rad);
      for (let r = r0; r <= r1; r++) {
        const wr = Math.exp(-Math.pow((r - ringF) / (sigR * 1.4), 2));
        for (let s = 0; s < SECTORS; s++) {
          const ws = opts.whole ? 1 : Math.exp(-Math.pow(this.sdist(s, sectorF) / (sigS * 1.4), 2));
          const w = wr * ws;
          if (w < 0.01) continue;
          const k = r * SECTORS + s;
          const up = Math.min(RINGS - 1, r + 1), dn = Math.max(0, r - 1);
          const avg = (this.tmp[up * SECTORS + s] + this.tmp[dn * SECTORS + s] + this.tmp[r * SECTORS + (s + 1) % SECTORS] + this.tmp[r * SECTORS + (s - 1 + SECTORS) % SECTORS]) / 4;
          this.rad[k] = THREE.MathUtils.lerp(this.tmp[k], avg, Math.min(1, 0.45 * w * (0.6 + opts.pressure)));
          this.wet[k] = Math.min(1, this.wet[k] + 0.03 * w);
        }
      }
    } else {
      this.mark(ringF, sectorF, opts);
    }
    this.dirty = true;
  }

  private mark(ringF: number, sectorF: number, o: { whole: boolean; pressure: number; mark: MarkId; phase: number }) {
    const depth = 0.004 + o.pressure * 0.007;
    const carve = (r: number, s: number, w: number) => {
      if (r < 1 || r >= RINGS) return;
      const k = r * SECTORS + (((s % SECTORS) + SECTORS) % SECTORS);
      this.rad[k] = Math.max(MIN_R, this.rad[k] - depth * w * 0.25);
    };
    const span = o.whole ? SECTORS : 9;
    for (let ds = -span / 2; ds <= span / 2; ds++) {
      const s = Math.round(sectorF + ds);
      const fade = o.whole ? 1 : Math.cos(ds / span * Math.PI);
      let rc = ringF;
      if (o.mark === 'onda') rc = ringF + 1.8 * Math.sin((s / SECTORS) * Math.PI * 2 * 7);
      if (o.mark === 'espiral') rc = ringF + ((s + SECTORS * 4) % SECTORS) / SECTORS * 6 - 3;
      if (o.mark === 'folha') {
        // Folha: elipse + nervura central, carimbada localmente.
        for (let dr = -4; dr <= 4; dr++) {
          const ex = ds / (span / 2), ey = dr / 4;
          const inside = ex * ex + ey * ey * (1 + ex * ex);
          if (inside < 1) carve(Math.round(ringF + dr), s, (dr === 0 ? 1.6 : 0.7) * fade);
        }
        continue;
      }
      for (let dr = -2; dr <= 2; dr++) {
        const r = Math.round(rc) + dr;
        carve(r, s, Math.exp(-Math.pow((r - rc) / 0.8, 2)) * fade);
      }
    }
  }

  private sdist(s: number, c: number) {
    let d = Math.abs(s - c) % SECTORS;
    return d > SECTORS / 2 ? SECTORS - d : d;
  }

  private relax(r0: number, r1: number, k: number) {
    for (let r = Math.max(1, r0); r <= Math.min(RINGS - 2, r1); r++) for (let s = 0; s < SECTORS; s++) {
      const i = r * SECTORS + s;
      const avg = (this.rad[i - SECTORS] + this.rad[i + SECTORS]) * 0.5;
      this.rad[i] += (avg - this.rad[i]) * k;
    }
  }

  dry(dt: number, spinning: boolean) {
    const rate = dt * (spinning ? 0.006 : 0.003);
    for (let i = 0; i < this.wet.length; i++) this.wet[i] = Math.max(0.05, this.wet[i] - rate);
    this.dirty = true;
  }

  wetAll(amount: number) {
    for (let i = 0; i < this.wet.length; i++) this.wet[i] = Math.min(1, this.wet[i] + amount);
    this.dirty = true;
  }

  rebuild() {
    if (!this.dirty) return;
    this.dirty = false;
    const P = this.profLen, pos = this.pos, wa = this.wetAttr;
    const fy = this.ringY(this.floorRing) * 0.75 + 0.012;
    for (let c = 0; c <= SECTORS; c++) {
      const s = c % SECTORS;
      const a = s / SECTORS * Math.PI * 2;
      const sx = Math.sin(a), cz = Math.cos(a);
      let i = c * P;
      const put = (r: number, y: number, w: number) => {
        pos[i * 3] = r * sx; pos[i * 3 + 1] = y; pos[i * 3 + 2] = r * cz; wa[i] = w; i++;
      };
      put(0, 0, this.wet[s]);
      for (let r = 0; r < RINGS; r++) put(this.rad[r * SECTORS + s], this.ringY(r), this.wet[r * SECTORS + s]);
      const top = (RINGS - 1) * SECTORS + s;
      put(this.rad[top] - THICK * 0.5, this.height + THICK * 0.42, this.wet[top]);
      for (let r = RINGS - 1; r >= this.floorRing; r--) {
        const k = r * SECTORS + s;
        put(Math.max(0.012, this.rad[k] - THICK), Math.max(fy, this.ringY(r)), this.wet[k]);
      }
      put(0, fy, this.wet[this.floorRing * SECTORS + s]);
    }
    const g = this.geometry;
    g.attributes.position.needsUpdate = true;
    g.attributes.wet.needsUpdate = true;
    g.computeVertexNormals();
    // Costura: média das normais da coluna 0 e da coluna final.
    const nrm = g.attributes.normal.array as Float32Array;
    for (let i = 0; i < P; i++) {
      const a = i * 3, b = (SECTORS * P + i) * 3;
      for (let j = 0; j < 3; j++) { const m = (nrm[a + j] + nrm[b + j]) * 0.5; nrm[a + j] = nrm[b + j] = m; }
    }
    g.attributes.normal.needsUpdate = true;
    g.computeBoundingSphere();
    g.computeBoundingBox();
  }

  toOBJ() {
    this.rebuild();
    const p = this.pos, idx = this.geometry.index!.array;
    const lines = ['# Ateliê do Gesto Lento — peça exportada', 'o peca_argila'];
    for (let i = 0; i < p.length; i += 3) lines.push(`v ${p[i].toFixed(5)} ${p[i + 1].toFixed(5)} ${p[i + 2].toFixed(5)}`);
    for (let i = 0; i < idx.length; i += 3) lines.push(`f ${idx[i] + 1} ${idx[i + 1] + 1} ${idx[i + 2] + 1}`);
    return lines.join('\n');
  }

  serialize() {
    const q = new Uint16Array(this.rad.length);
    for (let i = 0; i < q.length; i++) q[i] = Math.round(this.rad[i] / MAX_R * 65535);
    let bin = '';
    const u8 = new Uint8Array(q.buffer);
    for (let i = 0; i < u8.length; i++) bin += String.fromCharCode(u8[i]);
    return { h: this.height, r: btoa(bin) };
  }

  static decode(d: { h: number; r: string }): Snapshot | null {
    try {
      const bin = atob(d.r);
      const u8 = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; i++) u8[i] = bin.charCodeAt(i);
      const q = new Uint16Array(u8.buffer);
      if (q.length !== RINGS * SECTORS) return null;
      const rad = new Float32Array(q.length);
      for (let i = 0; i < q.length; i++) rad[i] = q[i] / 65535 * MAX_R;
      return { rad, wet: new Float32Array(q.length).fill(0.1), height: d.h };
    } catch { return null; }
  }
}
