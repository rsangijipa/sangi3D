/**
 * Web Audio API procedural sound engine for warm, comforting diorama town sounds.
 */
export class CityAudio {
  private ctx: AudioContext | null = null
  private enabled = false
  private ambientGain: GainNode | null = null
  private ambientRunning = false

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
      this.startAmbience()
    } else {
      this.stopAmbience()
    }
    return this.enabled
  }

  isEnabled(): boolean {
    return this.enabled
  }

  setMuted(muted: boolean): void {
    this.enabled = !muted
    if (this.enabled) {
      this.initCtx()
      this.startAmbience()
    } else {
      this.stopAmbience()
    }
  }

  private startAmbience(): void {
    if (this.ambientRunning || !this.enabled) return
    const ctx = this.initCtx()
    if (!ctx) return

    try {
      this.ambientGain = ctx.createGain()
      this.ambientGain.gain.setValueAtTime(0.015, ctx.currentTime) // very subtle whisper of wind
      this.ambientGain.connect(ctx.destination)

      // Pinkish filtered noise for gentle town breeze
      const bufferSize = ctx.sampleRate * 2
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
      const output = noiseBuffer.getChannelData(0)
      let b0 = 0, b1 = 0, b2 = 0
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1
        b0 = 0.997 * b0 + white * 0.05
        b1 = 0.963 * b1 + white * 0.11
        b2 = 0.570 * b2 + white * 0.55
        output[i] = (b0 + b1 + b2) * 0.1
      }

      const whiteNoise = ctx.createBufferSource()
      whiteNoise.buffer = noiseBuffer
      whiteNoise.loop = true

      const filter = ctx.createBiquadFilter()
      filter.type = 'lowpass'
      filter.frequency.setValueAtTime(450, ctx.currentTime)

      whiteNoise.connect(filter)
      filter.connect(this.ambientGain)
      whiteNoise.start()

      this.ambientRunning = true
    } catch (_) {
      // Ignore background audio errors
    }
  }

  private stopAmbience(): void {
    if (this.ambientGain && this.ctx) {
      this.ambientGain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.2)
    }
    this.ambientRunning = false
  }

  play(sound: 'chime' | 'click' | 'page' | 'tick' | 'exit' | 'success'): void {
    if (!this.enabled) return
    const ctx = this.initCtx()
    if (!ctx) return

    const now = ctx.currentTime

    switch (sound) {
      case 'chime': {
        // High warm brass bell chime (E6 / 1318 Hz + 2637 Hz harmonic)
        const osc1 = ctx.createOscillator()
        const osc2 = ctx.createOscillator()
        const gain = ctx.createGain()

        osc1.type = 'sine'
        osc1.frequency.setValueAtTime(1318.5, now)
        osc2.type = 'triangle'
        osc2.frequency.setValueAtTime(2637.0, now)

        gain.gain.setValueAtTime(0.18, now)
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

      case 'click': {
        // Soft tactile wooden peg click
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = 'sine'
        osc.frequency.setValueAtTime(420, now)
        osc.frequency.exponentialRampToValueAtTime(120, now + 0.04)

        gain.gain.setValueAtTime(0.14, now)
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04)

        osc.connect(gain)
        gain.connect(ctx.destination)

        osc.start(now)
        osc.stop(now + 0.04)
        break
      }

      case 'page': {
        // Soft paper card flip
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = 'triangle'
        osc.frequency.setValueAtTime(280, now)
        osc.frequency.linearRampToValueAtTime(520, now + 0.07)

        gain.gain.setValueAtTime(0.08, now)
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08)

        osc.connect(gain)
        gain.connect(ctx.destination)

        osc.start(now)
        osc.stop(now + 0.08)
        break
      }

      case 'tick': {
        // Very gentle pocket watch tick during "Preciso de um tempo"
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = 'sine'
        osc.frequency.setValueAtTime(880, now)

        gain.gain.setValueAtTime(0.04, now)
        gain.gain.exponentialRampToValueAtTime(0.0005, now + 0.02)

        osc.connect(gain)
        gain.connect(ctx.destination)

        osc.start(now)
        osc.stop(now + 0.02)
        break
      }

      case 'exit': {
        // Calming downward chime for gentle respectful exit
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = 'sine'
        osc.frequency.setValueAtTime(659, now) // E5
        osc.frequency.exponentialRampToValueAtTime(440, now + 0.35) // A4

        gain.gain.setValueAtTime(0.12, now)
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4)

        osc.connect(gain)
        gain.connect(ctx.destination)

        osc.start(now)
        osc.stop(now + 0.4)
        break
      }

      case 'success': {
        // Harmonious major third chord (C5 - E5 - G5)
        ;[523.25, 659.25, 783.99].forEach((freq, idx) => {
          const osc = ctx.createOscillator()
          const gain = ctx.createGain()
          osc.type = 'sine'
          osc.frequency.setValueAtTime(freq, now + idx * 0.05)

          gain.gain.setValueAtTime(0.08, now + idx * 0.05)
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.05 + 0.6)

          osc.connect(gain)
          gain.connect(ctx.destination)

          osc.start(now + idx * 0.05)
          osc.stop(now + idx * 0.05 + 0.6)
        })
        break
      }
    }
  }
}
