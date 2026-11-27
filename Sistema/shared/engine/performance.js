/**
 * shared/engine/performance.js
 * Monitor bidirecional de frame time, FPS, perfis adaptativos e telemetria __SANGI_QA__
 */

export const QUALITY_ORDER = ['ULTRA', 'HIGH', 'BALANCED', 'LOW'];

export const QUALITY_PROFILES = {
  ULTRA: {
    maxDpr: 2.0,
    shadowEnabled: true,
    shadowMapSize: 2048,
    particleScale: 1.0,
    materialTier: 'ultra',
    lodBias: 0
  },
  HIGH: {
    maxDpr: 1.5,
    shadowEnabled: true,
    shadowMapSize: 1024,
    particleScale: 0.85,
    materialTier: 'high',
    lodBias: 0
  },
  BALANCED: {
    maxDpr: 1.25,
    shadowEnabled: true,
    shadowMapSize: 512,
    particleScale: 0.5,
    materialTier: 'balanced',
    lodBias: 1
  },
  LOW: {
    maxDpr: 1.0,
    shadowEnabled: false,
    shadowMapSize: 0,
    particleScale: 0.25,
    materialTier: 'low',
    lodBias: 2
  }
};

function detectMobile() {
  if (typeof window === 'undefined') return false;
  const ua = typeof globalThis.navigator?.userAgent === 'string' ? globalThis.navigator.userAgent : '';
  return window.innerWidth <= 768 || /Mobi|Android|iPhone|iPad/i.test(ua);
}

export class PerformanceMonitor {
  constructor(renderer, onQualityChange, options = {}) {
    this.renderer = renderer;
    this.onQualityChange = onQualityChange;
    this.isMobile = typeof options.isMobile === 'boolean' ? options.isMobile : detectMobile();
    this.targetFps = options.targetFps ?? (this.isMobile ? 30 : 60);
    this.budgetMs = 1000 / this.targetFps;

    const initial = QUALITY_ORDER.includes(options.initialQuality) ? options.initialQuality : 'HIGH';
    this.quality = initial;
    this.fps = this.targetFps;
    this.frameTime = this.budgetMs;
    this.frames = 0;
    this.lastTime = options.startTime ?? performance.now();
    this.lastQualityChange = this.lastTime;
    this.cooldownMs = options.cooldownMs ?? 8000;
    this.downgradeStreakThreshold = options.downgradeStreakThreshold ?? 2;
    this.upgradeStreakThreshold = options.upgradeStreakThreshold ?? 5;
    this.autoAdjust = options.autoAdjust !== undefined ? Boolean(options.autoAdjust) : true;
    this.badFramesStreak = 0;
    this.goodFramesStreak = 0;
    this.qaTarget = options.qaTarget ?? globalThis;

    this._publishTelemetry(this.lastTime);
  }

  tick(currentTime = performance.now()) {
    this.frames++;
    const delta = currentTime - this.lastTime;

    if (delta >= 1000) {
      this.fps = Math.round((this.frames * 1000) / delta);
      this.frameTime = delta / this.frames;
      this.frames = 0;
      this.lastTime = currentTime;

      if (this.autoAdjust) {
        this.evaluatePerformance(currentTime);
      }
      this._publishTelemetry(currentTime);
    }
  }

  evaluatePerformance(currentTime = performance.now()) {
    const idx = QUALITY_ORDER.indexOf(this.quality);
    if (this.frameTime > this.budgetMs * 1.35) {
      this.badFramesStreak++;
      this.goodFramesStreak = 0;
      if (this.badFramesStreak >= this.downgradeStreakThreshold && idx < QUALITY_ORDER.length - 1) {
        this.setQuality(QUALITY_ORDER[idx + 1], currentTime);
        this.badFramesStreak = 0;
      }
    } else if (this.frameTime < this.budgetMs * 0.90) {
      this.badFramesStreak = Math.max(0, this.badFramesStreak - 1);
      this.goodFramesStreak++;
      if (
        this.goodFramesStreak >= this.upgradeStreakThreshold &&
        idx > 0 &&
        currentTime - this.lastQualityChange >= this.cooldownMs
      ) {
        this.setQuality(QUALITY_ORDER[idx - 1], currentTime);
        this.goodFramesStreak = 0;
      }
    } else {
      this.badFramesStreak = 0;
      this.goodFramesStreak = 0;
    }
  }

  setQuality(profile, currentTime = performance.now()) {
    const resolved = QUALITY_ORDER.includes(profile) ? profile : 'HIGH';
    this.quality = resolved;
    this.lastQualityChange = currentTime;
    if (this.renderer && typeof this.renderer.setQuality === 'function') {
      this.renderer.setQuality(resolved);
    }
    if (this.onQualityChange) {
      this.onQualityChange(resolved, QUALITY_PROFILES[resolved]);
    }
    this._publishTelemetry(currentTime);
  }

  getTelemetry() {
    const stats = typeof this.renderer?.getStats === 'function'
      ? this.renderer.getStats()
      : {
          drawCalls: this.renderer?.renderer?.info?.render?.calls ?? 0,
          triangles: this.renderer?.renderer?.info?.render?.triangles ?? 0,
          geometries: this.renderer?.renderer?.info?.memory?.geometries ?? 0,
          textures: this.renderer?.renderer?.info?.memory?.textures ?? 0
        };
    const heapBytes = globalThis.performance?.memory?.usedJSHeapSize ?? null;
    return {
      fps: this.fps,
      avgFrameMs: Number(this.frameTime.toFixed(2)),
      quality: this.quality,
      targetFps: this.targetFps,
      profile: QUALITY_PROFILES[this.quality],
      drawCalls: stats?.drawCalls ?? 0,
      triangles: stats?.triangles ?? 0,
      geometries: stats?.geometries ?? 0,
      textures: stats?.textures ?? 0,
      heapMB: heapBytes !== null ? Number((heapBytes / (1024 * 1024)).toFixed(2)) : null
    };
  }

  _publishTelemetry(currentTime = performance.now()) {
    if (!this.qaTarget || typeof this.qaTarget !== 'object') return;
    const snapshot = this.getTelemetry();
    snapshot.updatedAt = currentTime;
    this.qaTarget.__SANGI_QA__ = snapshot;
  }
}
