const Context=window.AudioContext||window.webkitAudioContext;
export class PinAudio{
  constructor(){this.ctx=null;this.enabled=false;this.voices=new Set();this.record=null;}
  async enable(flag){
    this.enabled=flag;if(!flag){this.master?.gain.setTargetAtTime(0,this.ctx.currentTime,.07);return true;}
    if(!Context){this.enabled=false;return false;}
    if(!this.ctx){
      const a=this.ctx=new Context(), root=a.createGain(), master=this.master=a.createGain(), comp=a.createDynamicsCompressor();
      this.in=root;this.out=a.createWaveShaper();root.gain.value=.32;master.gain.value=0;
      comp.threshold.value=-19;comp.ratio.value=8;comp.knee.value=5;
      const peak=10**(-24/20);this.out.curve=Float32Array.from({length:2049},(_,i)=>peak*Math.tanh((i/1024-1)*5));
      root.connect(master).connect(comp).connect(this.out).connect(a.destination);
      const size=a.sampleRate*2,noise=a.createBuffer(1,size,a.sampleRate);const data=noise.getChannelData(0);
      let n=4,v=0;
      for(let i=0;i<size;i++){n=(Math.imul(n,1664525)+1013904223)|0;v=v*.72+((n>>>0)/2147483648-1)*.28;data[i]=v;}
      const source=a.createBufferSource(),gain=a.createGain(),filter=a.createBiquadFilter();
      gain.gain.value=.0001;filter.type='lowpass';filter.frequency.value=347;
      source.buffer=noise;source.loop=true;source.connect(filter).connect(gain).connect(root);source.start();
      this.rollGain=gain;this.rollFilter=filter;
    }
    try{await this.ctx.resume();this.master.gain.setTargetAtTime(this.enabled?1:0,this.ctx.currentTime,.08);return true;}
    catch{this.enabled=false;return false;}
  }
  tone(f0,f1,duration,volume,type='sine',offset=0){
    if(!this.enabled||!this.ctx||this.voices.size>=9||document.hidden)return;
    const a=this.ctx,t=a.currentTime+offset,osc=a.createOscillator(),gain=a.createGain();
    osc.type=type;osc.frequency.setValueAtTime(f0,t);osc.frequency.exponentialRampToValueAtTime(f1,t+duration*.87);
    gain.gain.setValueAtTime(.0001,t);gain.gain.exponentialRampToValueAtTime(volume,t+.008);
    gain.gain.exponentialRampToValueAtTime(.0001,t+duration);
    osc.connect(gain).connect(this.in);osc.start(t);osc.stop(t+duration+.006);
    this.voices.add(osc);osc.onended=()=>{this.voices.delete(osc);gain.disconnect();osc.disconnect();};
  }
  sound(type){
    if(type==='flipper')this.tone(139,40,.092,.57,'triangle');
    if(type==='lancar')this.tone(81,176,.15,.40,'triangle');
    if(type==='bumper')this.tone(517,111,.15,.48,'triangle');
    if(type==='alvo'){this.tone(661,656,.27,.27);this.tone(993,980,.33,.20,'sine',.035);}
    if(type==='rampa'){this.tone(500,750,.22,.40,'triangle');this.tone(980,880,.37,.20,'sine',.10);}
    if(type==='dreno')this.tone(178,47,.25,.30,'triangle');
  }
  roll(speed){
    if(!this.ctx)return;
    const t=this.ctx.currentTime;
    this.rollGain.gain.setTargetAtTime(this.enabled&&!document.hidden?Math.min(.18,speed*.016):0,t,.09);
    this.rollFilter.frequency.setTargetAtTime(180+speed*70,t,.09);
  }
  track(){
    if(!this.ctx)return null;
    if(!this.record){this.record=this.ctx.createMediaStreamDestination();this.out.connect(this.record);}
    return this.record.stream.getAudioTracks()[0];
  }
  close(){if(this.ctx&&this.ctx.state!=='closed')void this.ctx.close();}
}
