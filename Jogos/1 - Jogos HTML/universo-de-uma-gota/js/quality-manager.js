/**
 * Gerenciador de qualidade adaptativa com histerese e intervalo mínimo entre alterações.
 */

export const QUALITY_BUDGETS = {
  low: {label: 'Econômico', maxAgents: 20, particles: 400, maxDpr: 1.0},
  medium: {label: 'Equilibrado', maxAgents: 60, particles: 950, maxDpr: 1.25},
  high: {label: 'Alto', maxAgents: 120, particles: 1600, maxDpr: 1.75},
  ultra: {label: 'Ultra', maxAgents: 200, particles: 2200, maxDpr: 2.0},
};

export function createQualityManager(initialProfile = 'high', onProfileChange) {
  let current = initialProfile in QUALITY_BUDGETS ? initialProfile : 'high';
  let autoEnabled = false;
  let lastSwitch = 0;
  let avgFrameMs = 16.6;
  const order = ['low', 'medium', 'high', 'ultra'];

  function recordFrame(deltaMs) {
    avgFrameMs = avgFrameMs * 0.92 + deltaMs * 0.08;
    if (!autoEnabled) return;
    const now = performance.now();
    if (now - lastSwitch < 3500) return;

    const idx = order.indexOf(current);
    if (avgFrameMs > 36 && idx > 0) {
      current = order[idx - 1];
      lastSwitch = now;
      onProfileChange?.(current);
    } else if (avgFrameMs < 18 && idx < order.length - 1) {
      current = order[idx + 1];
      lastSwitch = now;
      onProfileChange?.(current);
    }
  }

  return {
    recordFrame,
    setAuto(v) { autoEnabled = Boolean(v); },
    isAuto() { return autoEnabled; },
    setProfile(p) {
      if (p in QUALITY_BUDGETS) {
        current = p;
        lastSwitch = performance.now();
      }
    },
    getProfile() { return current; },
    getBudget() { return QUALITY_BUDGETS[current]; },
    getAvgFps() { return Math.round(1000 / Math.max(1, avgFrameMs)); },
  };
}
