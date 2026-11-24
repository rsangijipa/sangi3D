/**
 * shared/engine/performance.js
 * Monitor de frame time, FPS e perfil adaptativo
 */

export class PerformanceMonitor {
  constructor(renderer, onQualityChange) {
    this.renderer = renderer;
    this.onQualityChange = onQualityChange;
    this.fps = 60;
    this.frameTime = 16.6;
    this.frames = 0;
    this.lastTime = performance.now();
    this.quality = 'HIGH';
    this.autoAdjust = true;
    this.badFramesStreak = 0;
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
        this.evaluatePerformance();
      }
    }
  }

  evaluatePerformance() {
    if (this.frameTime > 24) {
      this.badFramesStreak++;
      if (this.badFramesStreak >= 2 && this.quality !== 'LOW') {
        this.setQuality(this.quality === 'HIGH' ? 'BALANCED' : 'LOW');
        this.badFramesStreak = 0;
      }
    } else if (this.frameTime < 16.5) {
      this.badFramesStreak = Math.max(0, this.badFramesStreak - 1);
    }
  }

  setQuality(profile) {
    this.quality = profile;
    if (this.renderer && typeof this.renderer.setQuality === 'function') {
      this.renderer.setQuality(profile);
    }
    if (this.onQualityChange) {
      this.onQualityChange(profile);
    }
  }
}
