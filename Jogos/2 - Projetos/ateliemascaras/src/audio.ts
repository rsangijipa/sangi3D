export class WorkshopAudio {
  private context?: AudioContext;
  private noise?: AudioBuffer;
  private last = 0;
  private ambience?: GainNode;
  enabled = false;
  async toggle() {
    if (this.enabled) {
      this.enabled = false;
      if (this.context && this.ambience) this.ambience.gain.setTargetAtTime(0,this.context.currentTime,.4);
      return false;
    }
    this.context ??= new AudioContext();
    await this.context.resume();
    if (!this.noise) {
      this.noise = this.context.createBuffer(1,Math.ceil(this.context.sampleRate*.25),this.context.sampleRate);
      const data = this.noise.getChannelData(0);
      for(let i=0;i<data.length;i++) data[i] = Math.random()*2-1;
    }
    this.enabled = true;
    this.startAmbience();
    return true;
  }
  private startAmbience() {
    const ctx = this.context!;
    if (!this.ambience) {
      this.ambience = ctx.createGain();
      this.ambience.gain.value = 0;
      this.ambience.connect(ctx.destination);
      // Ar do ateliê: ruído marrom filtrado, bem baixo.
      const room = ctx.createBuffer(1,ctx.sampleRate*4,ctx.sampleRate);
      const data = room.getChannelData(0);
      let last = 0;
      for (let i=0;i<data.length;i++) { last = (last + .02*(Math.random()*2-1))/1.02; data[i] = last*3.2; }
      const air = ctx.createBufferSource();
      air.buffer = room; air.loop = true;
      const low = ctx.createBiquadFilter();
      low.type = 'lowpass'; low.frequency.value = 420;
      const airGain = ctx.createGain(); airGain.gain.value = .35;
      air.connect(low).connect(airGain).connect(this.ambience);
      air.start();
      // Pad suave em quintas, com respiração lenta.
      for (const [f,g] of [[110,.022],[164.8,.016],[220.6,.011],[329.6,.006]] as const) {
        const osc = ctx.createOscillator();
        osc.type = 'sine'; osc.frequency.value = f;
        const vol = ctx.createGain(); vol.gain.value = g;
        const lfo = ctx.createOscillator(); lfo.frequency.value = .05 + f/9000;
        const depth = ctx.createGain(); depth.gain.value = g*.6;
        lfo.connect(depth).connect(vol.gain);
        osc.connect(vol).connect(this.ambience);
        osc.start(); lfo.start();
      }
    }
    this.ambience.gain.setTargetAtTime(.9,ctx.currentTime,1.2);
  }
  chime(pitch = 0) {
    if (!this.enabled || !this.context) return;
    const ctx = this.context, at = ctx.currentTime;
    for (const [ratio,amp] of [[1,.05],[2.76,.018],[5.4,.008]] as const) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.value = 784*Math.pow(2,pitch/12)*ratio;
      gain.gain.setValueAtTime(.0001,at);
      gain.gain.exponentialRampToValueAtTime(amp,at+.01);
      gain.gain.exponentialRampToValueAtTime(.0001,at+1.1/ratio+.2);
      osc.connect(gain).connect(ctx.destination);
      osc.start(at); osc.stop(at+1.4);
    }
  }
  play(kind: 'paint'|'sculpt'|'decorate'|'rotate') {
    if (!this.enabled || !this.context || !this.noise) return;
    const ctx = this.context;
    const at = ctx.currentTime;
    if (at-this.last < .055) return;
    this.last = at;
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    const source = ctx.createBufferSource();
    const [frequency,peak,end] = kind === 'paint' ? [2200,.041,.08] :
      kind === 'sculpt' ? [730,.075,.12] : kind === 'rotate' ? [270,.12,.21] : [3450,.06,.11];
    source.buffer = this.noise;
    filter.type = 'bandpass';
    filter.frequency.value = frequency;
    filter.Q.value = kind === 'decorate' ? 5 : .8;
    gain.gain.setValueAtTime(.001,at);
    gain.gain.exponentialRampToValueAtTime(peak,at+.012);
    gain.gain.exponentialRampToValueAtTime(.001,at+end);
    source.connect(filter).connect(gain).connect(ctx.destination);
    source.start(at);
    source.stop(at+end);
  }
  dispose() {
    this.enabled = false;
    if (this.context) {
      const ctx = this.context;
      this.context = undefined;
      void ctx.close().catch(() => {});
    }
  }
}
