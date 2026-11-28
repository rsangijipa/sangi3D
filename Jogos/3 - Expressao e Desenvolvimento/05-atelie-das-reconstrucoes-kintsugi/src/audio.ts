export class BenchAudio {
  #context?: AudioContext
  #volume?: GainNode
  #enabled = false
  #last = 0

  get enabled() { return this.#enabled }

  async toggle() {
    if (!this.#context) {
      this.#context = new AudioContext()
      const limiter = this.#context.createDynamicsCompressor()
      limiter.threshold.value = -20
      limiter.ratio.value = 12
      this.#volume = this.#context.createGain()
      this.#volume.gain.value = 0
      this.#volume.connect(limiter).connect(this.#context.destination)
    }
    await this.#context.resume()
    this.#enabled = !this.#enabled
    this.#volume!.gain.setTargetAtTime(this.#enabled ? .13 : 0,this.#context.currentTime,.035)
    if (this.#enabled) this.play('fit')
    return this.#enabled
  }

  play(kind:'fit'|'lacquer'|'gold') {
    if (!this.#enabled || !this.#context || !this.#volume) return
    const now=this.#context.currentTime
    if(now-this.#last<.085 && this.#last!==0) return
    this.#last=now
    const tone=this.#context.createOscillator(), envelope=this.#context.createGain()
    tone.type=kind==='lacquer'?'sine':'triangle'
    tone.frequency.setValueAtTime(kind==='fit'?536:kind==='gold'?740:205,now)
    tone.frequency.exponentialRampToValueAtTime(kind==='fit'?440:kind==='gold'?554:140,now+.16)
    envelope.gain.setValueAtTime(.001,now)
    envelope.gain.exponentialRampToValueAtTime(.23,now+.017)
    envelope.gain.exponentialRampToValueAtTime(.001,now+.24)
    tone.connect(envelope).connect(this.#volume)
    tone.start(now);tone.stop(now+.245)
    tone.onended=()=>{tone.disconnect();envelope.disconnect()}
  }
}
