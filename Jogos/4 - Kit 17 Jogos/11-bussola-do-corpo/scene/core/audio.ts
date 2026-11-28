/**
 * Paisagem sonora sintetizada (Web Audio): nada é baixado, tudo é gerado em tempo real.
 * Camadas: ambiente de sala, vento, chuva, pássaros, grilos — e a tigela tibetana.
 */

type LayerName = 'room' | 'wind' | 'rain' | 'birds' | 'crickets';

interface Layer {
  gain: GainNode;
  level: number;
  stop: () => void;
}

export class Ambience {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private noise: AudioBuffer | null = null;
  private layers = new Map<LayerName, Layer>();
  private wanted = new Map<LayerName, number>();
  private timers: number[] = [];
  private _enabled = false;
  private volume = 0.6;

  get enabled() {
    return this._enabled;
  }

  private ensure() {
    if (this.ctx) return this.ctx;
    const ctx = new AudioContext();
    this.ctx = ctx;
    this.master = ctx.createGain();
    this.master.gain.value = 0;
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -18;
    this.master.connect(comp).connect(ctx.destination);
    const len = ctx.sampleRate * 4;
    const buf = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const d = buf.getChannelData(ch);
      let b = 0;
      for (let i = 0; i < len; i++) {
        // ruído "rosado" aproximado
        const w = Math.random() * 2 - 1;
        b = 0.97 * b + 0.03 * w;
        d[i] = w * 0.5 + b * 2.2;
      }
    }
    this.noise = buf;
    return ctx;
  }

  setEnabled(on: boolean) {
    this._enabled = on;
    if (on) {
      const ctx = this.ensure();
      void ctx.resume();
      this.master!.gain.setTargetAtTime(this.volume, ctx.currentTime, 0.6);
      this.wanted.forEach((lvl, name) => this.apply(name, lvl));
    } else if (this.ctx && this.master) {
      this.master.gain.setTargetAtTime(0, this.ctx.currentTime, 0.25);
    }
  }

  setVolume(v: number) {
    this.volume = v;
    if (this.ctx && this.master && this._enabled) this.master.gain.setTargetAtTime(v, this.ctx.currentTime, 0.2);
  }

  /** Define o nível desejado (0..1) de uma camada; aplicado quando o som estiver ligado. */
  layer(name: LayerName, level: number) {
    this.wanted.set(name, level);
    if (this._enabled) this.apply(name, level);
  }

  private apply(name: LayerName, level: number) {
    const ctx = this.ensure();
    let l = this.layers.get(name);
    if (!l && level <= 0) return;
    if (!l) {
      l = this.create(name);
      this.layers.set(name, l);
    }
    l.level = level;
    l.gain.gain.setTargetAtTime(level, ctx.currentTime, 1.2);
  }

  private noiseSource() {
    const ctx = this.ctx!;
    const src = ctx.createBufferSource();
    src.buffer = this.noise;
    src.loop = true;
    src.loopStart = Math.random();
    src.start(0, Math.random() * 3);
    return src;
  }

  private create(name: LayerName): Layer {
    const ctx = this.ctx!;
    const gain = ctx.createGain();
    gain.gain.value = 0;
    gain.connect(this.master!);
    const stops: (() => void)[] = [];
    if (name === 'room') {
      const src = this.noiseSource();
      const lp = ctx.createBiquadFilter();
      lp.type = 'lowpass';
      lp.frequency.value = 260;
      const g = ctx.createGain();
      g.gain.value = 0.08;
      src.connect(lp).connect(g).connect(gain);
      stops.push(() => src.stop());
    } else if (name === 'wind') {
      const src = this.noiseSource();
      const bp = ctx.createBiquadFilter();
      bp.type = 'bandpass';
      bp.frequency.value = 420;
      bp.Q.value = 0.7;
      const lfo = ctx.createOscillator();
      lfo.frequency.value = 0.09;
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 260;
      lfo.connect(lfoGain).connect(bp.frequency);
      const amp = ctx.createGain();
      amp.gain.value = 0.22;
      const lfo2 = ctx.createOscillator();
      lfo2.frequency.value = 0.13;
      const lfo2g = ctx.createGain();
      lfo2g.gain.value = 0.12;
      lfo2.connect(lfo2g).connect(amp.gain);
      src.connect(bp).connect(amp).connect(gain);
      lfo.start();
      lfo2.start();
      stops.push(() => {
        src.stop();
        lfo.stop();
        lfo2.stop();
      });
    } else if (name === 'rain') {
      const src = this.noiseSource();
      const hp = ctx.createBiquadFilter();
      hp.type = 'highpass';
      hp.frequency.value = 900;
      const lp = ctx.createBiquadFilter();
      lp.type = 'lowpass';
      lp.frequency.value = 7000;
      const g = ctx.createGain();
      g.gain.value = 0.16;
      src.connect(hp).connect(lp).connect(g).connect(gain);
      // gotas próximas
      const drip = () => {
        if (!this.ctx) return;
        const t = ctx.currentTime;
        const o = ctx.createOscillator();
        const e = ctx.createGain();
        o.frequency.setValueAtTime(1800 + Math.random() * 1600, t);
        o.frequency.exponentialRampToValueAtTime(600, t + 0.05);
        e.gain.setValueAtTime(0.0001, t);
        e.gain.exponentialRampToValueAtTime(0.025, t + 0.005);
        e.gain.exponentialRampToValueAtTime(0.0001, t + 0.07);
        o.connect(e).connect(gain);
        o.start(t);
        o.stop(t + 0.08);
      };
      const id = window.setInterval(() => {
        if (Math.random() < 0.6) drip();
      }, 140);
      this.timers.push(id);
      stops.push(() => {
        src.stop();
        clearInterval(id);
      });
    } else if (name === 'birds') {
      const chirp = (t: number, f: number) => {
        const o = ctx.createOscillator();
        const e = ctx.createGain();
        const pan = ctx.createStereoPanner();
        pan.pan.value = Math.random() * 1.6 - 0.8;
        o.type = 'sine';
        o.frequency.setValueAtTime(f, t);
        o.frequency.exponentialRampToValueAtTime(f * (1.3 + Math.random() * 0.5), t + 0.06);
        o.frequency.exponentialRampToValueAtTime(f * 0.9, t + 0.12);
        e.gain.setValueAtTime(0.0001, t);
        e.gain.exponentialRampToValueAtTime(0.05, t + 0.015);
        e.gain.exponentialRampToValueAtTime(0.0001, t + 0.13);
        o.connect(e).connect(pan).connect(gain);
        o.start(t);
        o.stop(t + 0.15);
      };
      const id = window.setInterval(() => {
        if (Math.random() > 0.45) return;
        const t = ctx.currentTime + 0.05;
        const base = 2200 + Math.random() * 2000;
        const n = 2 + Math.floor(Math.random() * 4);
        for (let i = 0; i < n; i++) chirp(t + i * (0.13 + Math.random() * 0.06), base * (0.9 + Math.random() * 0.25));
      }, 1100);
      this.timers.push(id);
      stops.push(() => clearInterval(id));
    } else if (name === 'crickets') {
      const o = ctx.createOscillator();
      o.frequency.value = 4400;
      const am = ctx.createGain();
      am.gain.value = 0;
      const pulse = ctx.createOscillator();
      pulse.type = 'square';
      pulse.frequency.value = 28;
      const pg = ctx.createGain();
      pg.gain.value = 0.5;
      const gate = ctx.createOscillator();
      gate.type = 'square';
      gate.frequency.value = 1.6;
      const gg = ctx.createGain();
      gg.gain.value = 0.5;
      const sum = ctx.createGain();
      sum.gain.value = 0.012;
      pulse.connect(pg).connect(am.gain);
      gate.connect(gg).connect(am.gain);
      o.connect(am).connect(sum).connect(gain);
      o.start();
      pulse.start();
      gate.start();
      stops.push(() => {
        o.stop();
        pulse.stop();
        gate.stop();
      });
    }
    return { gain, level: 0, stop: () => stops.forEach((s) => s()) };
  }

  /** Tigela tibetana: parciais inarmônicos com batimento lento e decaimento longo. */
  bowl(strength = 1, base = 196) {
    if (!this._enabled) return;
    const ctx = this.ensure();
    const t = ctx.currentTime + 0.01;
    const partials = [
      [1, 1, 14],
      [2.71, 0.55, 10],
      [5.15, 0.28, 7],
      [8.17, 0.12, 4.5],
      [11.9, 0.06, 3],
    ];
    const out = ctx.createGain();
    out.gain.value = 0.22 * strength;
    out.connect(this.master!);
    for (const [ratio, amp, decay] of partials) {
      for (const detune of [-1.2, 1.2]) {
        const o = ctx.createOscillator();
        const e = ctx.createGain();
        o.frequency.value = base * ratio + detune * ratio * 0.6;
        e.gain.setValueAtTime(0.0001, t);
        e.gain.exponentialRampToValueAtTime(amp * 0.5, t + 0.012);
        e.gain.exponentialRampToValueAtTime(0.0001, t + decay);
        o.connect(e).connect(out);
        o.start(t);
        o.stop(t + decay + 0.1);
      }
    }
    // ataque do bastão
    const click = ctx.createBufferSource();
    click.buffer = this.noise;
    const ce = ctx.createGain();
    const bp = ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.value = 2400;
    ce.gain.setValueAtTime(0.25 * strength, t);
    ce.gain.exponentialRampToValueAtTime(0.0001, t + 0.05);
    click.connect(bp).connect(ce).connect(this.master!);
    click.start(t);
    click.stop(t + 0.06);
  }

  /** Pequeno "toc" de madeira/areia ao posicionar miniaturas. */
  tap(pitch = 1) {
    if (!this._enabled) return;
    const ctx = this.ensure();
    const t = ctx.currentTime;
    const src = ctx.createBufferSource();
    src.buffer = this.noise;
    const bp = ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.value = 900 * pitch;
    bp.Q.value = 3;
    const e = ctx.createGain();
    e.gain.setValueAtTime(0.3, t);
    e.gain.exponentialRampToValueAtTime(0.0001, t + 0.09);
    src.connect(bp).connect(e).connect(this.master!);
    src.start(t, Math.random());
    src.stop(t + 0.1);
  }

  dispose() {
    this.timers.forEach((id) => clearInterval(id));
    this.layers.forEach((l) => {
      try {
        l.stop();
      } catch {
        /* já parado */
      }
    });
    this.layers.clear();
    void this.ctx?.close();
    this.ctx = null;
  }
}
