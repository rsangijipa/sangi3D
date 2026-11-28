// Áudio procedural (Web Audio): ambiente de casa antiga + efeitos curtos por ação. Nada toca até o som ser ligado.
export type Cue='place'|'store'|'drawer'|'case'|'room'|'ui'|'remove'|'finish';
let context:AudioContext|undefined,master:GainNode|undefined,ambient:{stop:()=>void}|undefined;
function ctx(){
 if(!context){context=new AudioContext();master=context.createGain();master.gain.value=.9;const comp=context.createDynamicsCompressor();master.connect(comp).connect(context.destination);}
 void context.resume().catch(()=>{});return context;
}
function noiseBuffer(c:AudioContext,seconds:number){const b=c.createBuffer(1,Math.floor(c.sampleRate*seconds),c.sampleRate),d=b.getChannelData(0);let last=0;for(let i=0;i<d.length;i++){last=(last+.02*(Math.random()*2-1))/1.02;d[i]=last*3.5;}return b;}
function tone(freq:number,at:number,len:number,vol:number,type:OscillatorType='sine',glide=0){
 const c=ctx(),o=c.createOscillator(),g=c.createGain();o.type=type;o.frequency.setValueAtTime(freq,at);if(glide)o.frequency.exponentialRampToValueAtTime(Math.max(30,freq*glide),at+len);
 g.gain.setValueAtTime(.0001,at);g.gain.linearRampToValueAtTime(vol,at+.012);g.gain.exponentialRampToValueAtTime(.0001,at+len);
 o.connect(g).connect(master!);o.onended=()=>{o.disconnect();g.disconnect();};o.start(at);o.stop(at+len+.02);
}
function scrape(at:number,len:number,vol:number,freq:number){
 const c=ctx(),s=c.createBufferSource(),f=c.createBiquadFilter(),g=c.createGain();s.buffer=noiseBuffer(c,len+.05);f.type='bandpass';f.frequency.value=freq;f.Q.value=1.4;
 g.gain.setValueAtTime(.0001,at);g.gain.linearRampToValueAtTime(vol,at+len*.25);g.gain.exponentialRampToValueAtTime(.0001,at+len);
 s.connect(f).connect(g).connect(master!);s.onended=()=>{s.disconnect();f.disconnect();g.disconnect();};s.start(at);s.stop(at+len+.05);
}
const chime=[523.25,659.25,783.99,987.77,1174.66];
export function play(cue:Cue='ui'){
 try{
  const c=ctx(),t=c.currentTime+.01;
  switch(cue){
   case 'place':chime.slice(0,3).forEach((f,i)=>tone(f,t+i*.07,.9,.05,'sine'));tone(1567.98,t+.22,.6,.012,'triangle');break;
   case 'store':tone(392,t,.5,.05,'triangle');tone(293.66,t+.09,.7,.04,'sine');break;
   case 'drawer':scrape(t,.38,.11,700);tone(110,t+.34,.15,.06,'triangle',.6);break;
   case 'case':tone(1800,t,.05,.03,'square',.5);tone(1300,t+.06,.05,.025,'square',.5);scrape(t+.08,.3,.06,420);break;
   case 'room':tone(440,t,.25,.025,'sine',1.25);break;
   case 'remove':tone(330,t,.3,.04,'triangle',.55);break;
   case 'finish':[0,2,4,3,4].forEach((n,i)=>tone(chime[n],t+i*.13,1.1,.045,'sine'));break;
   default:tone(244,t,.18,.04,'triangle',.47);
  }
 }catch{}
}
// Ambiente: drone quente em acorde suave + ruído de vento filtrado + "tique" de relógio distante.
export function setAmbient(on:boolean){
 if(!on){ambient?.stop();ambient=undefined;return;}
 if(ambient)return;
 try{
  const c=ctx(),bus=c.createGain();bus.gain.setValueAtTime(.0001,c.currentTime);bus.gain.linearRampToValueAtTime(.5,c.currentTime+2.5);bus.connect(master!);
  const nodes:AudioNode[]=[bus],sources:(OscillatorNode|AudioBufferSourceNode)[]=[];
  for(const [f,v] of [[130.81,.018],[196,.012],[261.63,.008],[329.63,.005]] as const){
   const o=c.createOscillator(),g=c.createGain(),lfo=c.createOscillator(),lg=c.createGain();o.type='sine';o.frequency.value=f;g.gain.value=v;lfo.frequency.value=.05+f/4000;lg.gain.value=v*.6;
   lfo.connect(lg).connect(g.gain);o.connect(g).connect(bus);o.start();lfo.start();sources.push(o,lfo);nodes.push(g,lg);
  }
  const wind=c.createBufferSource(),wf=c.createBiquadFilter(),wg=c.createGain();wind.buffer=noiseBuffer(c,6);wind.loop=true;wf.type='lowpass';wf.frequency.value=420;wg.gain.value=.05;
  wind.connect(wf).connect(wg).connect(bus);wind.start();sources.push(wind);nodes.push(wf,wg);
  const tick=setInterval(()=>{if(c.state==='running'){const t=c.currentTime;const o=c.createOscillator(),g=c.createGain();o.type='square';o.frequency.value=2400;g.gain.setValueAtTime(.0001,t);g.gain.linearRampToValueAtTime(.004,t+.003);g.gain.exponentialRampToValueAtTime(.0001,t+.03);o.connect(g).connect(bus);o.start(t);o.stop(t+.04);o.onended=()=>{o.disconnect();g.disconnect();};}},1000);
  ambient={stop(){clearInterval(tick);const t=c.currentTime;bus.gain.cancelScheduledValues(t);bus.gain.setValueAtTime(bus.gain.value,t);bus.gain.linearRampToValueAtTime(.0001,t+.6);setTimeout(()=>{for(const s of sources){try{s.stop();}catch{}s.disconnect();}for(const n of nodes)n.disconnect();},700);}};
 }catch{}
}
export function dispose(){setAmbient(false);if(context)void context.close().catch(()=>{});context=undefined;}
