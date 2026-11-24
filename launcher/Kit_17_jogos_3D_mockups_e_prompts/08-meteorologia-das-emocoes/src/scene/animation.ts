/**
 * Meteorologia das Emocoes — interpolacao e tweens leves.
 * Mudancas de clima interpolar em 0.8-1.5 s. Transicoes de camera 300-600 ms.
 */

export type Easing = (t: number) => number;

export const easeOutCubic: Easing = (t) => 1 - Math.pow(1 - t, 3);
export const easeInOutQuad: Easing = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

export class Tween {
  from: number;
  to: number;
  duration: number;
  elapsed: number;
  easing: Easing;
  onUpdate: (v: number) => void;
  onEnd?: () => void;

  running = true;

  constructor(from: number, to: number, duration: number, easing: Easing, onUpdate: (v: number) => void, onEnd?: () => void) {
    this.from = from;
    this.to = to;
    this.duration = duration;
    this.easing = easing;
    this.onUpdate = onUpdate;
    this.onEnd = onEnd;
    this.elapsed = 0;
    this.onUpdate(from);
  }

  step(dt: number): boolean {
    if (!this.running) return false;
    this.elapsed += dt;
    const t = Math.min(1, this.elapsed / this.duration);
    const v = this.from + (this.to - this.from) * this.easing(t);
    this.onUpdate(v);
    if (t >= 1) {
      this.running = false;
      this.onEnd?.();
      return false;
    }
    return true;
  }
}

export class TweenManager {
  private tweens: Tween[] = [];

  add(tween: Tween): void {
    this.tweens.push(tween);
  }

  step(dt: number): void {
    for (let i = this.tweens.length - 1; i >= 0; i--) {
      if (!this.tweens[i].step(dt)) this.tweens.splice(i, 1);
    }
  }

  get active(): number {
    return this.tweens.length;
  }

  clear(): void {
    this.tweens = [];
  }
}

/**
 * Interpola um angulo pela menor distancia com step fixo.
 */
export function shortestAngleDelta(from: number, to: number): number {
  let d = to - from;
  while (d > Math.PI) d -= Math.PI * 2;
  while (d < -Math.PI) d += Math.PI * 2;
  return d;
}

/**
 * Limite de delta de tempo apos suspensao (aba oculta).
 */
export function clampDelta(dt: number, max = 0.25): number {
  return Math.min(dt, max);
}
