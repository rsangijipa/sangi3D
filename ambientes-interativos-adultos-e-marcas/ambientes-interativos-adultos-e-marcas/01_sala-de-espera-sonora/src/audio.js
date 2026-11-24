const native=window.AudioContext||window.webkitAudioContext;
const note=(midi)=>440*2**((midi-69)/12);
const chords=[[48,55,59,62],[45,52,55,59],[41,48,52,55],[43,50,53,57]];
const ceiling=10**(-24/20);

export class RoomAudio {
  constructor(){this.ctx=null;this.graph=new Map();this.master=null;this.voices=new Set();this.timer=0;this.nextChord=0;this.chord=0;}
  async unlock(){
    if(!native)return false;
    if(!this.ctx){
      const a=this.ctx=new native();
      const mix=a.createGain(),level=a.createGain(),limiter=a.createDynamicsCompressor(),safety=a.createWaveShaper();
      mix.gain.value=.41;level.gain.value=0;limiter.threshold.value=-21;limiter.knee.value=9;limiter.ratio.value=12;
      limiter.attack.value=.008;limiter.release.value=.22;
      safety.curve=Float32Array.from({length:2049},(_,i)=>Math.tanh((i/1024-1)*5.5)*ceiling);
      mix.connect(level).connect(limiter).connect(safety).connect(a.destination);
      this.bus=mix;this.master=level;this.output=safety;
      for(const id of ['chuva','lareira','vitrola','relogio','plantas'])this.makeChannel(id);
    }
    try{await this.ctx.resume();return this.ctx.state==='running';}catch{return false;}
  }
  makeChannel(id){
    const a=this.ctx;
    const {sampler,seconds,cut,high}=({
      chuva:{sampler:(t,p,w)=>.22*p+.16*w+.42*t.drip,seconds:13,cut:1270,high:135},
      lareira:{sampler:(t,p,w)=>.16*p+.056*w+.66*t.crackle,seconds:11,cut:1280,high:98},
      vitrola:{sampler:(t,p,w)=>.032*p+.050*w+.15*t.click,seconds:19,cut:990,high:210},
      relogio:{sampler:(t,p,w)=>t.tick*(.59*w+.41*Math.sin(t.x*2*Math.PI*(t.flip?956:1132))),seconds:2,cut:1940,high:380},
      plantas:{sampler:(t,p,w)=>(.51*p+.10*w)*(.68+.24*Math.sin(2*Math.PI*t.x/8)+.08*Math.sin(2*Math.PI*t.x/2)),seconds:16,cut:650,high:85},
    })[id];
    const out=a.createGain();out.gain.value=0;out.connect(this.bus);
    const trim=a.createGain();trim.gain.value={chuva:.69,lareira:.64,vitrola:.65,relogio:.36,plantas:.59}[id];
    trim.connect(out);
    const low=a.createBiquadFilter();low.type='lowpass';low.frequency.value=cut;low.Q.value=.38;
    const hp=a.createBiquadFilter();hp.type='highpass';hp.frequency.value=high;hp.Q.value=.44;
    low.connect(hp).connect(trim);
    const n=a.sampleRate*seconds, buffer=a.createBuffer(2,n,a.sampleRate);
    for(let channel=0;channel<2;channel++){
      const data=buffer.getChannelData(channel);
      let pink=0,crackle=0,drip=0,click=0, phase=173+93*channel+seconds*6;
      const random=()=>{phase=(Math.imul(1664525,phase)+1013904223)|0;return (phase>>>0)/2**32;};
      for(let i=0;i<n;i++){
        const x=i/a.sampleRate, w=random()*2-1;
        pink=.957*pink+.043*w;
        if(random()<8/a.sampleRate)crackle=.6+random()*.34;
        if(random()<24/a.sampleRate)drip=(random()-.5)*.66;
        if(random()<3/a.sampleRate)click=(random()-.5)*.49;
        crackle*=.9924;drip*=.9961;click*=.978;
        const beat=x%1;const tick=beat<.046?Math.exp(-beat/.009):0;
        data[i]=sampler({x,crackle:crackle*w,drip:drip*w,click:click*w,tick,flip:x>1},pink,w);
      }
      const wrap=Math.min(4096,Math.floor(a.sampleRate*.044));
      for(let i=0;i<wrap;i++)data[n-wrap+i]=data[n-wrap+i]*(1-i/wrap)+data[i]*(i/wrap);
    }
    const source=a.createBufferSource();source.buffer=buffer;source.loop=true;source.loopStart=Math.min(.044,buffer.duration/4);
    source.connect(low);source.start();
    this.graph.set(id,{out,source});
  }
  pad() {
    const a=this.ctx, dest=this.graph.get('vitrola').out;
    const when=Math.max(this.nextChord||0,a.currentTime+.044);
    const chord=chords[this.chord++%chords.length];
    for(const [i,n] of chord.entries()){
      const t=when+i*.121;
      const osc=a.createOscillator(), low=a.createBiquadFilter(), env=a.createGain();
      osc.type=i===0?'sine':'triangle';
      osc.frequency.value=note(n);osc.detune.value=[-4,3,-2,4][i];
      low.type='lowpass';low.frequency.value=1130;
      env.gain.setValueAtTime(.0001,t);
      env.gain.exponentialRampToValueAtTime(i===0?.055:.036,t+.31);
      env.gain.exponentialRampToValueAtTime(.0001,t+2.63);
      osc.connect(low).connect(env).connect(dest);
      this.voices.add(osc);
      osc.onended=()=>{this.voices.delete(osc);osc.disconnect();low.disconnect();env.disconnect();};
      osc.start(t);osc.stop(t+2.75);
    }
    this.nextChord=when+3.12;
  }
  sync(state){
    if(!this.ctx||this.ctx.state==='closed')return;
    const time=this.ctx.currentTime, audible=state.sound&&!document.hidden;
    this.master.gain.setTargetAtTime(audible?1:0,time,.17);
    for(const [id,{out}] of this.graph){
      const track=state.mix[id];
      const opening=id==='chuva'?.69+.31*state.curtain:1;
      out.gain.setTargetAtTime(track.active?track.volume*opening:0,time,.125);
    }
    const vinyl=audible&&state.mix.vitrola.active;
    if(vinyl&&!this.timer){
      this.nextChord=time;this.pad();
      this.timer=window.setInterval(()=>{if(this.nextChord<this.ctx.currentTime+.2&&this.voices.size<8)this.pad();},190);
    }else if(!vinyl&&this.timer){clearInterval(this.timer);this.timer=0;}
  }
  dispose(){
    clearInterval(this.timer);this.timer=0;
    if(this.ctx&&this.ctx.state!=='closed')void this.ctx.close();
    this.ctx=null;
  }
  demoTrack(){
    if(!this.ctx)return null;
    this.recording??=this.ctx.createMediaStreamDestination();
    this.output.connect(this.recording);
    return this.recording.stream.getAudioTracks()[0];
  }
  diagnostics(){return {state:this.ctx?.state??'unstarted',ceilingDb:-24,voices:this.voices.size};}
}

