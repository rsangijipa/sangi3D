/**
 * js/audio-engine.js
 * Síntese Web Audio para raspagem física da areia (proporcional à velocidade do rastelo),
 * assentamento de pedra no granito e brisa calma do pavilhão. Nunca inicia antes do gesto.
 */
export function createZenAudioEngine() {
  let ctx = null;
  let masterGain = null;
  let windGain = null;
  let sandGain = null;
  let sandFilter = null;
  let enabled = false;
  let muted = false;
  let volume = 0.55;

  function ensureInit() {
    if (ctx) return true;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return false;

    ctx = new AC();
    masterGain = ctx.createGain();
    masterGain.gain.value = 0.0001;
    masterGain.connect(ctx.destination);

    // Buffer de ruído granulado para areia e brisa
    const len = ctx.sampleRate * 3;
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = buf.getChannelData(0);
    let lp = 0;
    for (let i = 0; i < len; i++) {
      const w = Math.random() * 2 - 1;
      lp = lp * 0.68 + w * 0.32;
      data[i] = lp * 0.55 + w * 0.45;
    }

    const windSrc = ctx.createBufferSource();
    windSrc.buffer = buf;
    windSrc.loop = true;
    const windLP = ctx.createBiquadFilter();
    windLP.type = 'lowpass';
    windLP.frequency.value = 260;
    windGain = ctx.createGain();
    windGain.gain.value = 0.14;
    windSrc.connect(windLP).connect(windGain).connect(masterGain);
    windSrc.start();

    const sandSrc = ctx.createBufferSource();
    sandSrc.buffer = buf;
    sandSrc.loop = true;
    sandFilter = ctx.createBiquadFilter();
    sandFilter.type = 'bandpass';
    sandFilter.frequency.value = 2200;
    sandFilter.Q.value = 1.6;
    sandGain = ctx.createGain();
    sandGain.gain.value = 0.0001;
    sandSrc.connect(sandFilter).connect(sandGain).connect(masterGain);
    sandSrc.start();

    return true;
  }

  function applyMaster() {
    if (!ctx || !masterGain) return;
    const target = enabled && !muted ? volume * 0.55 : 0.0001;
    masterGain.gain.setTargetAtTime(target, ctx.currentTime, 0.08);
  }

  async function setEnabled(next) {
    if (next && !ensureInit()) return false;
    enabled = Boolean(next);
    if (ctx && enabled && ctx.state === 'suspended') {
      await ctx.resume().catch(() => {});
    }
    applyMaster();
    return enabled;
  }

  function setMuted(nextMuted) {
    muted = Boolean(nextMuted);
    applyMaster();
  }

  function setVolume(v) {
    volume = Math.max(0, Math.min(1, v));
    applyMaster();
  }

  function updateScrape(velocity, paused) {
    if (!ctx || !sandGain || !sandFilter) return;
    const active = enabled && !muted && !paused && ctx.state === 'running';
    const intensity = active ? Math.min(1, velocity / 4.2) : 0;
    sandGain.gain.setTargetAtTime(intensity * 0.42, ctx.currentTime, 0.045);
    sandFilter.frequency.setTargetAtTime(1600 + intensity * 1450, ctx.currentTime, 0.06);
  }

  function playStoneTap(blocked = false) {
    if (!ctx || !enabled || muted || ctx.state !== 'running') return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = blocked ? 'triangle' : 'sine';
    osc.frequency.setValueAtTime(blocked ? 185 : 120, now);
    osc.frequency.exponentialRampToValueAtTime(52, now + 0.14);
    g.gain.setValueAtTime(0.08, now);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 0.16);
    osc.connect(g).connect(masterGain);
    osc.start(now);
    osc.stop(now + 0.18);
  }

  function suspend() {
    if (ctx && ctx.state === 'running') ctx.suspend().catch(() => {});
  }
  function resume() {
    if (ctx && enabled && !muted && ctx.state === 'suspended') ctx.resume().catch(() => {});
  }
  function dispose() {
    if (ctx) { try { ctx.close(); } catch (_) {} ctx = null; }
  }

  return {
    setEnabled,
    setMuted,
    setVolume,
    updateScrape,
    playStoneTap,
    suspend,
    resume,
    dispose,
  };
}
