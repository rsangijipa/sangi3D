/**
 * Procedural Web Audio API sound generator for authentic stone, brass, ceramic and glass clicks.
 */
export class GalleryAudio {
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

  play(sound: 'hang' | 'unhang' | 'slide' | 'click' | 'equilibrium' | 'creak'): void {
    if (!this.enabled) return
    const ctx = this.initCtx()
    if (!ctx) return

    const now = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)

    switch (sound) {
      case 'hang': {
        // Metallic brass hook resonance
        osc.type = 'sine'
        osc.frequency.setValueAtTime(880, now)
        osc.frequency.exponentialRampToValueAtTime(440, now + 0.15)
        gain.gain.setValueAtTime(0.2, now)
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25)
        osc.start(now)
        osc.stop(now + 0.25)
        break
      }
      case 'unhang': {
        // Soft metallic ring release
        osc.type = 'triangle'
        osc.frequency.setValueAtTime(520, now)
        osc.frequency.exponentialRampToValueAtTime(320, now + 0.12)
        gain.gain.setValueAtTime(0.15, now)
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15)
        osc.start(now)
        osc.stop(now + 0.15)
        break
      }
      case 'slide': {
        // Gentle brass sliding click
        osc.type = 'sawtooth'
        osc.frequency.setValueAtTime(240, now)
        osc.frequency.linearRampToValueAtTime(360, now + 0.08)
        gain.gain.setValueAtTime(0.08, now)
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09)
        osc.start(now)
        osc.stop(now + 0.09)
        break
      }
      case 'equilibrium': {
        // Zen brass singing bowl chime (major triad)
        const freqs = [523.25, 659.25, 783.99, 1046.5]
        freqs.forEach((freq, idx) => {
          const o = ctx.createOscillator()
          const g = ctx.createGain()
          o.type = 'sine'
          o.frequency.setValueAtTime(freq, now)
          g.gain.setValueAtTime(0.08 / (idx + 1), now)
          g.gain.exponentialRampToValueAtTime(0.0001, now + 1.2)
          o.connect(g)
          g.connect(ctx.destination)
          o.start(now)
          o.stop(now + 1.2)
        })
        break
      }
      case 'creak': {
        // Low wood/pivot movement
        osc.type = 'sine'
        osc.frequency.setValueAtTime(140, now)
        osc.frequency.exponentialRampToValueAtTime(110, now + 0.3)
        gain.gain.setValueAtTime(0.06, now)
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35)
        osc.start(now)
        osc.stop(now + 0.35)
        break
      }
      case 'click':
      default: {
        osc.type = 'triangle'
        osc.frequency.setValueAtTime(440, now)
        gain.gain.setValueAtTime(0.05, now)
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05)
        osc.start(now)
        osc.stop(now + 0.05)
        break
      }
    }
  }
}
