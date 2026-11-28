import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

describe('PerformanceMonitor & QUALITY_PROFILES (shared/engine/performance.js)', () => {
  it('exposes ULTRA, HIGH, BALANCED, LOW profiles and enforces 60 FPS desktop vs 30 FPS mobile budgets', async () => {
    const mod = await import('../../shared/engine/performance.js');
    assert.ok(mod.QUALITY_PROFILES, 'QUALITY_PROFILES must be exported');
    assert.deepStrictEqual(Object.keys(mod.QUALITY_PROFILES), ['ULTRA', 'HIGH', 'BALANCED', 'LOW']);
    assert.equal(mod.QUALITY_PROFILES.LOW.shadowEnabled, false);
    assert.equal(mod.QUALITY_PROFILES.ULTRA.shadowMapSize, 2048);

    const qaTarget = {};
    const desktopMonitor = new mod.PerformanceMonitor(null, null, { isMobile: false, qaTarget, startTime: 0 });
    assert.equal(desktopMonitor.targetFps, 60);

    const mobileMonitor = new mod.PerformanceMonitor(null, null, { isMobile: true, qaTarget, startTime: 0 });
    assert.equal(mobileMonitor.targetFps, 30);
  });

  it('downgrades on sustained slow frames, upgrades only after cooldown + good streak, and updates __SANGI_QA__', async () => {
    const { PerformanceMonitor } = await import('../../shared/engine/performance.js');
    const changes = [];
    const qaTarget = {};
    const fakeRenderer = {
      setQuality(q) { changes.push(`renderer:${q}`); },
      getStats() { return { drawCalls: 42, triangles: 12000, geometries: 15, textures: 6 }; }
    };

    const monitor = new PerformanceMonitor(
      fakeRenderer,
      (q) => changes.push(`cb:${q}`),
      {
        isMobile: false,
        initialQuality: 'HIGH',
        cooldownMs: 4000,
        downgradeStreakThreshold: 2,
        upgradeStreakThreshold: 3,
        qaTarget,
        startTime: 0
      }
    );

    // 2 slow 1-second windows (25 frames in 1000ms => 40ms/frame > 16.67*1.35=22.5ms) -> downgrade HIGH -> BALANCED
    let t = 0;
    for (let sec = 0; sec < 2; sec++) {
      for (let f = 0; f < 25; f++) {
        t += 40;
        monitor.tick(t);
      }
    }
    assert.equal(monitor.quality, 'BALANCED');
    assert.deepStrictEqual(changes, ['renderer:BALANCED', 'cb:BALANCED']);
    assert.equal(qaTarget.__SANGI_QA__.quality, 'BALANCED');
    assert.equal(qaTarget.__SANGI_QA__.drawCalls, 42);
    assert.equal(qaTarget.__SANGI_QA__.triangles, 12000);

    // Fast frames (75 fps => 13.3ms < 15ms) for 3 windows, but within cooldown (only 3000ms < 4000ms) -> NO upgrade yet
    for (let sec = 0; sec < 3; sec++) {
      for (let f = 0; f < 75; f++) {
        t += 1000 / 75;
        monitor.tick(t);
      }
    }
    assert.equal(monitor.quality, 'BALANCED');

    // Two more fast windows passes 4000ms cooldown -> upgrades BALANCED -> HIGH
    for (let sec = 0; sec < 2; sec++) {
      for (let f = 0; f < 75; f++) {
        t += 1000 / 75;
        monitor.tick(t);
      }
    }
    assert.equal(monitor.quality, 'HIGH');
    assert.equal(qaTarget.__SANGI_QA__.quality, 'HIGH');
  });

  it('on mobile (30 FPS budget = 33.3ms), 30 FPS frames do NOT trigger downgrade', async () => {
    const { PerformanceMonitor } = await import('../../shared/engine/performance.js');
    const qaTarget = {};
    const monitor = new PerformanceMonitor(null, null, {
      isMobile: true,
      initialQuality: 'HIGH',
      qaTarget,
      startTime: 0
    });

    let t = 0;
    for (let sec = 0; sec < 3; sec++) {
      for (let f = 0; f < 30; f++) {
        t += 1000 / 30;
        monitor.tick(t);
      }
    }
    assert.equal(monitor.quality, 'HIGH');
    assert.equal(qaTarget.__SANGI_QA__.targetFps, 30);
  });
});
