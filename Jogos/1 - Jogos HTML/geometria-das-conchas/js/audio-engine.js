/**
 * js/audio-engine.js
 * Síntese Web Audio opcional para mar distante sereno e clique tátil de catalogação/obturador.
 * Nunca inicia antes do gesto do usuário.
 */
export function createShellAudioEngine() {
  let ctx = null;
  let masterGain = null;
  let surfGain = null;
  let surfFilter = null;
  let enabled = false;
  let muted = false;
  let volume = 0.48;

  function ensureInit() {
    if (ctx) return true;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return false;

    ctx = new AC();
    masterGain = ctx.createGain();
    masterGain.gain.value = 0.0001;
    masterGain.connect(ctx.destination);

    // Ruído filtrado simulando ondas calmas de mar distante
    const len = ctx.sampleRate * 4;
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = buf.getChannelData(0);
    let lp = 0;
    for (let i = 0; i < len; i++) {
      const w = Math.random() * 2 - 1;
      lp = lp * 0.94 + w * 0.06;
      data[i] = lp * 2.2;
    }

    const src = ctx.createBufferSource();
    src.buffer = buf;
    src.loop = true;
    surfFilter = ctx.createBiquadFilter();
    surfFilter.type = 'lowpass';
    surfFilter.frequency.value = 280;
    surfGain = ctx.createGain();
    surfGain.gain.value = 0.22;
    src.connect(surfFilter).connect(surfGain).connect(masterGain);
    src.start();
    return true;
  }

  function applyMaster() {
    if (!ctx || !masterGain) return;
    const target = enabled && !muted ? volume * 0.6 : 0.0001;
    masterGain.gain.setTargetAtTime(target, ctx.currentTime, 0.12);
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

  function setMuted(next) {
    muted = Boolean(next);
    applyMaster();
  }

  function setVolume(v) {
    volume = Math.max(0, Math.min(1, v));
    applyMaster();
  }

  function updateSurf(simTime, paused, reduced) {
    if (!ctx || !surfGain || !surfFilter) return;
    if (!enabled || muted || paused || ctx.state !== 'running') {
      surfGain.gain.setTargetAtTime(0.0001, ctx.currentTime, 0.1);
      return;
    }
    const swell = reduced ? 0.5 : 0.5 + 0.5 * Math.sin(simTime * 0.45);
    surfGain.gain.setTargetAtTime(0.14 + swell * 0.14, ctx.currentTime, 0.25);
    surfFilter.frequency.setTargetAtTime(210 + swell * 180, ctx.currentTime, 0.25);
  }

  function playClick(toneHz = 540) {
    if (!ctx || !enabled || muted || ctx.state !== 'running') return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(toneHz, now);
    osc.frequency.exponentialRampToValueAtTime(140, now + 0.055);
    g.gain.setValueAtTime(0.09, now);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 0.065);
    osc.connect(g).connect(masterGain);
    osc.start(now);
    osc.stop(now + 0.07);
  }

  function suspend() {
    if (ctx && ctx.state === 'running') ctx.suspend().catch(() => {});
  }

  function resume() {
    if (ctx && enabled && !muted && ctx.state === 'suspended') ctx.resume().catch(() => {});
  }

  function dispose() {
    if (ctx) {
      try { ctx.close(); } catch (_) {}
      ctx = null;
    }
  }

  return {
    setEnabled,
    setMuted,
    setVolume,
    updateSurf,
    playClick,
    suspend,
    resume,
    dispose,
  };
}
