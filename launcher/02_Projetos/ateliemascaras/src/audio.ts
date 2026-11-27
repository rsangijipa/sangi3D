export class WorkshopAudio {
  private context?: AudioContext;
  private noise?: AudioBuffer;
  private last = 0;
  enabled = false;
  async toggle() {
    if (this.enabled) { this.enabled = false; return false; }
    this.context ??= new AudioContext();
    await this.context.resume();
    if (!this.noise) {
      this.noise = this.context.createBuffer(1,Math.ceil(this.context.sampleRate*.25),this.context.sampleRate);
      const data = this.noise.getChannelData(0);
      for(let i=0;i<data.length;i++) data[i] = Math.random()*2-1;
    }
    this.enabled = true;
    return true;
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
