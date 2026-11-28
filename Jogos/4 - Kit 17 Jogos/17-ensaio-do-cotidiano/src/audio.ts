/**
 * Web Audio API procedural sound engine for warm, comforting everyday shop sounds.
 */
export class MarketAudio {
  private ctx: AudioContext | null = null
  private enabled = false

  private initCtx(): AudioContext | null {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      if (AudioCtx) {
        this.ctx = new AudioCtx()
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      void this.ctx.resume()
    }
    return this.ctx
  }

  async toggle(): Promise<boolean> {
    this.enabled = !this.enabled
    if (this.enabled) {
      this.initCtx()
      this.play('click')
    }
    return this.enabled
  }

  isEnabled(): boolean {
    return this.enabled
  }

  play(sound: 'step' | 'pick' | 'drop' | 'bell' | 'wheels' | 'success' | 'click'): void {
    if (!this.enabled) return
    const ctx = this.initCtx()
    if (!ctx) return

    const now = ctx.currentTime

    switch (sound) {
      case 'bell': {
        // Authentic brass service bell ring (High C - 2093 Hz with harmonic shimmer)
        const osc1 = ctx.createOscillator()
        const osc2 = ctx.createOscillator()
        const gain = ctx.createGain()
        osc1.type = 'sine'
        osc2.type = 'sine'
        osc1.frequency.setValueAtTime(2093, now)
        osc2.frequency.setValueAtTime(3135, now) // octave + fifth harmonic

        gain.gain.setValueAtTime(0.22, now)
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2)

        osc1.connect(gain)
        osc2.connect(gain)
        gain.connect(ctx.destination)

        osc1.start(now)
        osc2.start(now)
        osc1.stop(now + 1.2)
        osc2.stop(now + 1.2)
        break
      }
      case 'pick': {
        // Gentle organic pickup rustle / tactile pop
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = 'triangle'
        osc.frequency.setValueAtTime(420, now)
        osc.frequency.exponentialRampToValueAtTime(680, now + 0.08)
        gain.gain.setValueAtTime(0.12, now)
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1)

        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.start(now)
        osc.stop(now + 0.1)
        break
      }
      case 'drop': {
        // Soft wicker / wire basket settling
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = 'sine'
        osc.frequency.setValueAtTime(260, now)
        osc.frequency.exponentialRampToValueAtTime(140, now + 0.12)
        gain.gain.setValueAtTime(0.15, now)
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14)

        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.start(now)
        osc.stop(now + 0.14)
        break
      }
      case 'step': {
        // Soft footstep on moss rug
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = 'sine'
        osc.frequency.setValueAtTime(110, now)
        osc.frequency.exponentialRampToValueAtTime(70, now + 0.1)
        gain.gain.setValueAtTime(0.06, now)
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12)

        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.start(now)
        osc.stop(now + 0.12)
        break
      }
      case 'wheels': {
        // Low metal shopping cart wheel rumble
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = 'triangle'
        osc.frequency.setValueAtTime(180, now)
        osc.frequency.linearRampToValueAtTime(160, now + 0.25)
        gain.gain.setValueAtTime(0.05, now)
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3)

        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.start(now)
        osc.stop(now + 0.3)
        break
      }
      case 'success': {
        // Warm celebratory major chord (C - E - G - C)
        const freqs = [523.25, 659.25, 783.99, 1046.5]
        freqs.forEach((f, idx) => {
          const osc = ctx.createOscillator()
          const gain = ctx.createGain()
          osc.type = 'sine'
          osc.frequency.setValueAtTime(f, now + idx * 0.05)
          gain.gain.setValueAtTime(0.08 / (idx + 1), now + idx * 0.05)
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.4)

          osc.connect(gain)
          gain.connect(ctx.destination)
          osc.start(now + idx * 0.05)
          osc.stop(now + 1.4)
        })
        break
      }
      case 'click':
      default: {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = 'triangle'
        osc.frequency.setValueAtTime(500, now)
        gain.gain.setValueAtTime(0.05, now)
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04)

        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.start(now)
        osc.stop(now + 0.04)
        break
      }
    }
  }

  dispose(): void {
    this.enabled = false
    if (this.ctx) {
      const c = this.ctx
      this.ctx = null
      void c.close().catch(() => {})
    }
  }
}
