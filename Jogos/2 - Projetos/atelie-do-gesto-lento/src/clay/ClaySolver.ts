import { ClayConfig, ToolType, ScopeType } from '../types';

export class ClaySolver {
  public config: ClayConfig;
  public radii: Float32Array;
  public thickness: Float32Array;
  public marks: Float32Array;
  public height: number;
  public rotation: number; // Pottery wheel angle in radians

  private initialVolume: number;
  private tempBuffer: Float32Array;

  constructor(config?: Partial<ClayConfig>) {
    this.config = {
      rings: 40,
      segments: 96,
      height: 0.23,
      minThickness: 0.008,
      targetThickness: 0.012,
      baseThickness: 0.018,
      minRadius: 0.035,
      maxRadius: 0.22,
      ...config
    };

    const count = this.config.rings * this.config.segments;
    this.radii = new Float32Array(count);
    this.thickness = new Float32Array(count);
    this.marks = new Float32Array(count);
    this.tempBuffer = new Float32Array(count);
    this.height = this.config.height;
    this.rotation = 0;

    this.loadPreset('bloco');
    this.initialVolume = this.estimateVolume();
  }

  /**
   * Initializes geometry from built-in archetypal presets:
   * 'bloco' (standard raw cylinder), 'tigela' (wide bowl), 'vaso' (sculpted vase)
   */
  public loadPreset(presetName: 'bloco' | 'tigela' | 'vaso'): void {
    const M = this.config.rings;
    const N = this.config.segments;
    this.marks.fill(0);
    this.thickness.fill(this.config.targetThickness);

    if (presetName === 'bloco') {
      this.height = 0.23;
      const baseR = 0.105;
      for (let j = 0; j < M; j++) {
        const t = j / (M - 1);
        // Slight organic taper
        const r = baseR * (1.0 - t * 0.06);
        for (let i = 0; i < N; i++) {
          this.radii[j * N + i] = r;
        }
      }
    } else if (presetName === 'tigela') {
      this.height = 0.16;
      for (let j = 0; j < M; j++) {
        const t = j / (M - 1);
        // Flaring curved bowl
        const r = 0.075 + Math.sin(t * Math.PI * 0.5) * 0.095;
        for (let i = 0; i < N; i++) {
          this.radii[j * N + i] = r;
        }
      }
    } else if (presetName === 'vaso') {
      this.height = 0.27;
      for (let j = 0; j < M; j++) {
        const t = j / (M - 1);
        // Harmonic vase with belly, neck and rim
        let r = 0.082 + Math.sin(t * Math.PI) * 0.058;
        if (t > 0.65) {
          const nt = (t - 0.65) / 0.35;
          r = 0.088 - Math.sin(nt * Math.PI) * 0.024 + nt * 0.015;
        }
        for (let i = 0; i < N; i++) {
          this.radii[j * N + i] = r;
        }
      }
    }

    this.initialVolume = this.estimateVolume();
  }

  /**
   * Deforms clay radius using the Modelar tool.
   * Maps horizontal screen motion dxNorm to radial expansion (>0) or narrowing (<0).
   */
  public applyModelar(
    touchY: number,
    touchTheta: number,
    dxNorm: number,
    scope: ScopeType = 'ring',
    sigma: number = 0.025,
    sensitivity: number = 0.55
  ): { changed: boolean; atLimit: boolean } {
    const M = this.config.rings;
    const N = this.config.segments;

    // k determines physical meter change per normalized canvas drag
    const k = 0.35 * sensitivity;
    const rawDeltaR = k * dxNorm;
    // Sub-step clamping to avoid jumping
    const maxDeltaPerStep = 0.0018;
    const deltaR = Math.max(-maxDeltaPerStep, Math.min(maxDeltaPerStep, rawDeltaR));

    if (Math.abs(deltaR) < 0.00001) return { changed: false, atLimit: false };

    let changed = false;
    let hitLimit = false;

    // Fixed base rings: j=0 and j=1 cannot be altered
    for (let j = 2; j < M; j++) {
      const ringY = (j / (M - 1)) * this.height;
      const dy = ringY - touchY;
      const dySq = dy * dy;

      if (dySq > 9 * sigma * sigma) continue; // Outside 3*sigma

      for (let i = 0; i < N; i++) {
        let weight = 0;

        if (scope === 'ring') {
          // Wheel-centric deformation: applies evenly around the whole height band
          weight = Math.exp(-dySq / (2 * sigma * sigma));
        } else {
          // Handcrafted asymmetric local pinch
          const theta = (i / N) * Math.PI * 2;
          const dTheta = Math.atan2(Math.sin(theta - touchTheta), Math.cos(theta - touchTheta));
          const currentR = this.radii[j * N + i];
          const dSq = dySq + (currentR * dTheta) * (currentR * dTheta);

          if (dSq <= 9 * sigma * sigma) {
            weight = Math.exp(-dSq / (2 * sigma * sigma));
          }
        }

        if (weight > 0.001) {
          const idx = j * N + i;
          const oldR = this.radii[idx];
          let newR = oldR + deltaR * weight;

          // Boundary checks
          if (newR < this.config.minRadius) {
            newR = this.config.minRadius;
            hitLimit = true;
          } else if (newR > this.config.maxRadius) {
            newR = this.config.maxRadius;
            hitLimit = true;
          }

          if (newR !== oldR) {
            this.radii[idx] = newR;
            changed = true;
          }
        }
      }
    }

    if (changed) {
      this.redistributeVolumeSoft();
    }

    return { changed, atLimit: hitLimit };
  }

  /**
   * Alisar (Smoothing) tool:
   * Applies localized Laplacian smoothing over neighboring radii in double buffer.
   */
  public applyAlisar(
    touchY: number,
    touchTheta: number,
    sigma: number = 0.035,
    lambda: number = 0.12
  ): { changed: boolean } {
    const M = this.config.rings;
    const N = this.config.segments;

    this.tempBuffer.set(this.radii);
    let changed = false;

    for (let j = 2; j < M - 1; j++) {
      const ringY = (j / (M - 1)) * this.height;
      const dy = ringY - touchY;
      const dySq = dy * dy;
      if (dySq > 9 * sigma * sigma) continue;

      for (let i = 0; i < N; i++) {
        const theta = (i / N) * Math.PI * 2;
        const dTheta = Math.atan2(Math.sin(theta - touchTheta), Math.cos(theta - touchTheta));
        const currentR = this.radii[j * N + i];
        const dSq = dySq + (currentR * dTheta) * (currentR * dTheta);

        if (dSq <= 9 * sigma * sigma) {
          const weight = Math.exp(-dSq / (2 * sigma * sigma));

          // 4-neighbor average (periodic in azimuth i, clamped in height j)
          const iPrev = (i - 1 + N) % N;
          const iNext = (i + 1) % N;
          const jPrev = j - 1;
          const jNext = j + 1;

          const neighborAvg = (
            this.radii[j * N + iPrev] +
            this.radii[j * N + iNext] +
            this.radii[jPrev * N + i] +
            this.radii[jNext * N + i]
          ) * 0.25;

          const delta = lambda * weight * (neighborAvg - currentR);
          this.tempBuffer[j * N + i] = currentR + delta;
          changed = true;
        }
      }
    }

    if (changed) {
      this.radii.set(this.tempBuffer);
    }

    return { changed };
  }

  /**
   * Marcar (Carving) tool:
   * Carves continuous grooves into clay surface without piercing through the wall.
   */
  public applyMarcar(
    touchY: number,
    touchTheta: number,
    sigma: number = 0.016,
    depthInc: number = 0.0006
  ): { changed: boolean; atLimit: boolean } {
    const M = this.config.rings;
    const N = this.config.segments;
    const maxMarkDepth = 0.004; // 4 mm maximum groove depth
    let changed = false;
    let atLimit = false;

    for (let j = 2; j < M; j++) {
      const ringY = (j / (M - 1)) * this.height;
      const dy = ringY - touchY;
      const dySq = dy * dy;
      if (dySq > 9 * sigma * sigma) continue;

      for (let i = 0; i < N; i++) {
        const theta = (i / N) * Math.PI * 2;
        const dTheta = Math.atan2(Math.sin(theta - touchTheta), Math.cos(theta - touchTheta));
        const currentR = this.radii[j * N + i];
        const dSq = dySq + (currentR * dTheta) * (currentR * dTheta);

        if (dSq <= 9 * sigma * sigma) {
          const weight = Math.exp(-dSq / (2 * sigma * sigma));
          const idx = j * N + i;
          const currentMark = this.marks[idx];

          // Check remaining wall thickness
          const availableThickness = this.thickness[idx] - currentMark;
          if (availableThickness <= this.config.minThickness) {
            atLimit = true;
            continue;
          }

          let newMark = currentMark + depthInc * weight;
          if (newMark > maxMarkDepth) {
            newMark = maxMarkDepth;
            atLimit = true;
          }

          // Ensure we don't penetrate past minThickness
          if (this.thickness[idx] - newMark < this.config.minThickness) {
            newMark = this.thickness[idx] - this.config.minThickness;
            atLimit = true;
          }

          if (newMark !== currentMark) {
            this.marks[idx] = newMark;
            changed = true;
          }
        }
      }
    }

    return { changed, atLimit };
  }

  /**
   * Adjusts total clay height, preserving volume by scaling radial rings.
   */
  public setHeight(newHeight: number): void {
    const clampedH = Math.max(0.10, Math.min(0.38, newHeight));
    if (Math.abs(clampedH - this.height) < 0.001) return;

    // Volume scaling heuristic: V = pi * r^2 * h => r_new = r_old * sqrt(h_old / h_new)
    const ratio = Math.sqrt(this.height / clampedH);
    this.height = clampedH;

    const count = this.config.rings * this.config.segments;
    for (let k = 0; k < count; k++) {
      this.radii[k] = Math.max(this.config.minRadius, Math.min(this.config.maxRadius, this.radii[k] * ratio));
    }
  }

  /**
   * Approximates solid clay volume in cubic meters.
   */
  public estimateVolume(): number {
    const M = this.config.rings;
    const N = this.config.segments;
    const dy = this.height / (M - 1);
    let volume = 0;

    for (let j = 0; j < M; j++) {
      let ringOuterSqSum = 0;
      let ringInnerSqSum = 0;

      for (let i = 0; i < N; i++) {
        const rExt = this.radii[j * N + i] - this.marks[j * N + i];
        const rInt = Math.max(0.008, rExt - this.thickness[j * N + i]);
        ringOuterSqSum += rExt * rExt;
        ringInnerSqSum += rInt * rInt;
      }

      const meanOuterSq = ringOuterSqSum / N;
      const meanInnerSq = ringInnerSqSum / N;
      volume += Math.PI * (meanOuterSq - meanInnerSq) * dy;
    }

    // Add base disk volume
    const baseR = this.radii[0];
    volume += Math.PI * baseR * baseR * this.config.baseThickness;

    return volume;
  }

  /**
   * Gentle plastic redistribution of volume differences to maintain stability.
   */
  private redistributeVolumeSoft(): void {
    const currentVol = this.estimateVolume();
    const volDiff = currentVol - this.initialVolume;
    if (Math.abs(volDiff) < 0.00005) return;

    // Subtle radial compensation across middle rings
    const M = this.config.rings;
    const N = this.config.segments;
    const factor = 1.0 - (volDiff / (this.initialVolume * 24.0));

    for (let j = 2; j < M - 1; j++) {
      for (let i = 0; i < N; i++) {
        const idx = j * N + i;
        this.radii[idx] = Math.max(
          this.config.minRadius,
          Math.min(this.config.maxRadius, this.radii[idx] * factor)
        );
      }
    }
  }

  /**
   * Resets entire clay to a specific snapshot.
   */
  public restoreFromSnapshot(
    radii: Float32Array,
    thickness: Float32Array,
    marks: Float32Array,
    height: number,
    rotation: number
  ): void {
    this.radii.set(radii);
    this.thickness.set(thickness);
    this.marks.set(marks);
    this.height = height;
    this.rotation = rotation;
  }
}
