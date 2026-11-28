/**
 * js/audio-engine.js
 * Áudio ambiental silencioso e passos discretos de madeira no Museu das Memórias.
 * Nunca reproduz automaticamente antes do gesto explícito do usuário.
 */
export function createGalleryAudioEngine() {
  let ctx = null;
  let masterGain = null;
  let roomGain = null;
  let enabled = false;
  let muted = false;
  let volume = 0.40;

  function ensureInit() {
    if (ctx) return true;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return false;
    ctx = new AC();
    masterGain = ctx.createGain();
    masterGain.gain.value = 0.0001;
    masterGain.connect(ctx.destination);

    // Ambiência silenciosa quente de sala de madeira
    const len = ctx.sampleRate * 3;
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = buf.getChannelData(0);
    let lp = 0;
    for (let i = 0; i < len; i++) {
      const w = Math.random() * 2 - 1;
      lp = lp * 0.96 + w * 0.04;
      data[i] = lp * 0.8;
    }
    const src = ctx.createBufferSource();
    src.buffer = buf;
    src.loop = true;
    const lpF = ctx.createBiquadFilter();
    lpF.type = 'lowpass';
    lpF.frequency.value = 210;
    roomGain = ctx.createGain();
    roomGain.gain.value = 0.14;
    src.connect(lpF).connect(roomGain).connect(masterGain);
    src.start();
    return true;
  }

  function applyMaster() {
    if (!ctx || !masterGain) return;
    masterGain.gain.setTargetAtTime(enabled && !muted ? volume * 0.5 : 0.0001, ctx.currentTime, 0.1);
  }

  async function setEnabled(next) {
    if (next && !ensureInit()) return false;
    enabled = Boolean(next);
    if (ctx && enabled && ctx.state === 'suspended') await ctx.resume().catch(() => {});
    applyMaster();
    return enabled;
  }

  function setMuted(m) { muted = Boolean(m); applyMaster(); }
  function setVolume(v) { volume = Math.max(0, Math.min(1, v)); applyMaster(); }

  function playPlaceTone(freq = 240) {
    if (!ctx || !enabled || muted || ctx.state !== 'running') return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, now);
    osc.frequency.exponentialRampToValueAtTime(95, now + 0.09);
    g.gain.setValueAtTime(0.08, now);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 0.11);
    osc.connect(g).connect(masterGain);
    osc.start(now);
    osc.stop(now + 0.12);
  }

  function suspend() { if (ctx && ctx.state === 'running') ctx.suspend().catch(() => {}); }
  function resume() { if (ctx && enabled && !muted && ctx.state === 'suspended') ctx.resume().catch(() => {}); }
  function dispose() { if (ctx) { try { ctx.close(); } catch (_) {} ctx = null; } }

  return { setEnabled, setMuted, setVolume, playPlaceTone, suspend, resume, dispose };
}
