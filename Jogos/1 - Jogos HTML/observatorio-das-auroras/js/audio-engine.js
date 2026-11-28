/**
 * js/audio-engine.js
 * Síntese Web Audio procedural para vento ártico distante, crepitar sutil da lareira
 * (mais presente na vista interna) e clique mecânico do obturador ao fotografar.
 * Nunca inicia antes do gesto explícito do usuário.
 */
export function createObservatoryAudioEngine() {
  let ctx = null;
  let masterGain = null;
  let windGain = null;
  let windFilter = null;
  let hearthGain = null;
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

    // Ruído rosa suave para vento subártico em vale nevado
    const len = ctx.sampleRate * 4;
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = buf.getChannelData(0);
    let b0 = 0;
    let b1 = 0;
    let b2 = 0;
    for (let i = 0; i < len; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99765 * b0 + white * 0.099046;
      b1 = 0.96300 * b1 + white * 0.2965164;
      b2 = 0.57000 * b2 + white * 1.0526913;
      data[i] = (b0 + b1 + b2 + white * 0.1848) * 0.14;
    }

    const windSrc = ctx.createBufferSource();
    windSrc.buffer = buf;
    windSrc.loop = true;
    windFilter = ctx.createBiquadFilter();
    windFilter.type = 'bandpass';
    windFilter.frequency.value = 340;
    windFilter.Q.value = 1.4;
    windGain = ctx.createGain();
    windGain.gain.value = 0.26;
    windSrc.connect(windFilter).connect(windGain).connect(masterGain);
    windSrc.start();

    // Brasa suave da lareira no interior da cabana
    const hearthSrc = ctx.createBufferSource();
    hearthSrc.buffer = buf;
    hearthSrc.loop = true;
    const hearthBP = ctx.createBiquadFilter();
    hearthBP.type = 'lowpass';
    hearthBP.frequency.value = 180;
    hearthGain = ctx.createGain();
    hearthGain.gain.value = 0.05;
    hearthSrc.connect(hearthBP).connect(hearthGain).connect(masterGain);
    hearthSrc.start();

    return true;
  }

  function applyMaster() {
    if (!ctx || !masterGain) return;
    const target = enabled && !muted ? volume * 0.65 : 0.0001;
    masterGain.gain.setTargetAtTime(target, ctx.currentTime, 0.1);
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

  function updateAtmosphere(gustSpeed, isInterior, paused) {
    if (!ctx || !windGain || !windFilter || !hearthGain) return;
    const active = enabled && !muted && !paused && ctx.state === 'running';
    if (!active) {
      windGain.gain.setTargetAtTime(0.0001, ctx.currentTime, 0.08);
      hearthGain.gain.setTargetAtTime(0.0001, ctx.currentTime, 0.08);
      return;
    }
    // Vento mais abafado dentro da cabana panorâmica
    const extFactor = isInterior ? 0.32 : 1.0;
    windGain.gain.setTargetAtTime((0.18 + gustSpeed * 0.22) * extFactor, ctx.currentTime, 0.15);
    windFilter.frequency.setTargetAtTime((240 + gustSpeed * 280) * (isInterior ? 0.65 : 1.0), ctx.currentTime, 0.2);
    hearthGain.gain.setTargetAtTime(isInterior ? 0.18 : 0.03, ctx.currentTime, 0.15);
  }

  function playShutter() {
    if (!ctx || !enabled || muted || ctx.state !== 'running') return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(920, now);
    osc.frequency.exponentialRampToValueAtTime(160, now + 0.045);
    g.gain.setValueAtTime(0.14, now);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 0.06);
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
    updateAtmosphere,
    playShutter,
    suspend,
    resume,
    dispose,
  };
}
