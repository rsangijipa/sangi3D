export function createSound() {
  let audio: AudioContext | undefined;
  let output: GainNode;
  let noise: AudioBuffer;
  let volume = 0.55;
  let muted = false;
  let lastHiss = 0;

  function prepare() {
    if (muted || typeof AudioContext === 'undefined') return;
    if (!audio) {
      audio = new AudioContext();
      output = audio.createGain();
      output.gain.value = volume * 0.28;
      const compressor = audio.createDynamicsCompressor();
      compressor.threshold.value = -23;
      compressor.ratio.value = 6;
      output.connect(compressor).connect(audio.destination);
      noise = audio.createBuffer(1, Math.floor(audio.sampleRate * 0.24), audio.sampleRate);
      const data = noise.getChannelData(0);
      for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * 0.5;
    }
    if (audio.state === 'suspended') void audio.resume().catch(() => {});
    return audio;
  }

  return {
    dispose() { if (audio && audio.state !== 'closed') void audio.close().catch(() => {}); },
    configure(nextVolume: number, nextMuted: boolean) {
      volume = nextVolume;
      muted = nextMuted;
      if (audio) output.gain.setTargetAtTime(muted ? 0 : volume * 0.28, audio.currentTime, 0.025);
    },
    glass(placed: boolean) {
      const context = prepare();
      if (!context) return;
      const time = context.currentTime;
      for (const [i, pitch] of (placed ? [1093, 1859, 2837] : [1452, 2294]).entries()) {
        const oscillator = context.createOscillator();
        const gain = context.createGain();
        oscillator.frequency.value = pitch;
        gain.gain.setValueAtTime(0.0001, time);
        gain.gain.exponentialRampToValueAtTime(0.21 / (i + 1), time + 0.008);
        gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.26 - i * 0.045);
        oscillator.connect(gain).connect(output);
        oscillator.start(time);
        oscillator.stop(time + 0.28);
      }
    },
    solder() {
      const context = prepare();
      if (!context || context.currentTime - lastHiss < 0.15) return;
      const time = context.currentTime;
      lastHiss = time;
      const source = context.createBufferSource();
      source.buffer = noise;
      const filter = context.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 2050;
      filter.Q.value = 0.8;
      const gain = context.createGain();
      gain.gain.setValueAtTime(0, time);
      gain.gain.linearRampToValueAtTime(0.21, time + 0.017);
      gain.gain.linearRampToValueAtTime(0, time + 0.219);
      source.connect(filter).connect(gain).connect(output);
      source.start(time);
    },
  };
}
