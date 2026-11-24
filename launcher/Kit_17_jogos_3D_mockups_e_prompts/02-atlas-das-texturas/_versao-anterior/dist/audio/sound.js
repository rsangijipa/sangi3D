let context                       ;
export function chime(){
 try {
 context ||= new AudioContext(); void context.resume().catch(()=>{});
 const o=context.createOscillator(),g=context.createGain(),t=context.currentTime;
 o.type='triangle';o.frequency.setValueAtTime(208,t);o.frequency.exponentialRampToValueAtTime(116,t+.13);
 g.gain.setValueAtTime(.001,t);g.gain.linearRampToValueAtTime(.07,t+.013);g.gain.exponentialRampToValueAtTime(.001,t+.19);
 o.connect(g).connect(context.destination);o.onended=()=>{o.disconnect();g.disconnect();};o.start(t);o.stop(t+.2);
 }catch{}
}
export function disposeAudio(){if(context){void context.close().catch(()=>{});context=undefined;}}
