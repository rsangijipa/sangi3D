export const BARBS = 156;
export const ROOT = 0.18;
export const LENGTH = 6.8;
export const clamp = (value, min = 0, max = 1) => Math.max(min, Math.min(value, max));
export const at = (index) => ROOT + (index / (BARBS - 1)) * (1 - ROOT);
export const axisY = (t) => 0.25 * Math.sin(t * 2.5) - 0.32 * t * t;

export function spanAt(t, side) {
  const along = clamp((t - ROOT) / (1 - ROOT));
  const profile = Math.sin(Math.PI * (along ** 0.79)) ** 0.72 * (1.14 - along * 0.3);
  return profile * (side > 0 ? 0.87 : 0.63);
}

export class FeatherState {
  constructor() {
    this.fibers = [new Float32Array(BARBS), new Float32Array(BARBS)];
    this.reset();
  }

  reset() {
    this.bend = 0;
    this.velocity = 0;
    this.target = 0;
    this.focus = 0.52;
    this.side = 1;
    this.repairing = false;
    for (const side of this.fibers) side.fill(0);
    this.revision = (this.revision ?? 0) + 1;
  }

  flex(value, station = this.focus) {
    this.target = clamp(value, -0.85, 0.85);
    this.focus = clamp(station, ROOT, 0.98);
  }

  release() { this.target = 0; }

  index(station) {
    return Math.round(clamp((station - ROOT) / (1 - ROOT)) * (BARBS - 1));
  }

  edit(station, side, open) {
    this.focus = clamp(station, ROOT, 0.98);
    this.side = side;
    this.repairing = false;
    const fibers = this.fibers[side > 0 ? 1 : 0];
    const center = this.index(this.focus);
    const radius = open ? 9 : 13;
    let changed = false;
    for (let i = Math.max(0, center - radius); i <= Math.min(BARBS - 1, center + radius); i++) {
      const distance = i - center;
      const next = open ? (distance < 0 ? -1 : 1) * (1 - Math.abs(distance) / (radius + 1)) ** 1.4 : 0;
      if (open && Math.abs(fibers[i]) >= Math.abs(next) - 0.0001) continue;
      if (fibers[i] === next) continue;
      fibers[i] = next;
      changed = true;
    }
    if (changed) this.revision++;
    return changed;
  }

  opening(station, side) {
    return Math.abs(this.fibers[side > 0 ? 1 : 0][this.index(station)]);
  }

  get openCount() {
    let count = 0;
    for (const side of this.fibers) for (const offset of side) if (Math.abs(offset) > 0.12) count++;
    return count;
  }

  recompose() {
    this.repairing = this.openCount > 0;
    if (!this.repairing) for (const side of this.fibers) side.fill(0);
    this.release();
    this.revision++;
  }

  step(dt) {
    const previous = this.bend;
    this.velocity += (86 * (this.target - this.bend) - 17 * this.velocity) * dt;
    this.bend = clamp(this.bend + this.velocity * dt, -0.85, 0.85);
    if (Math.abs(this.target - this.bend) < 0.0002 && Math.abs(this.velocity) < 0.002) {
      this.bend = this.target;
      this.velocity = 0;
    }
    if (previous !== this.bend) this.revision++;
    if (this.repairing) {
      let remaining = false;
      const decay = Math.exp(-9 * dt);
      for (const side of this.fibers) for (let i = 0; i < side.length; i++) {
        side[i] = Math.abs(side[i]) > 0.008 ? side[i] * decay : 0;
        remaining ||= side[i] !== 0;
      }
      this.repairing = remaining;
      this.revision++;
    }
  }

  snapshot() {
    return { bend: this.bend, focus: this.focus, side: this.side, fibers: this.fibers.flatMap(side => Array.from(side)) };
  }
}
