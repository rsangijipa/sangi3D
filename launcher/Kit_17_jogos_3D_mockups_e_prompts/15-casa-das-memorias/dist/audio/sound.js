let context                       ;
export function play(){try{context ||= new AudioContext();void context.resume().catch(()=>{});const o=context.createOscillator(),gain=context.createGain(),now=context.currentTime;o.type='triangle';o.frequency.setValueAtTime(244,now);o.frequency.exponentialRampToValueAtTime(115,now+.16);gain.gain.setValueAtTime(.001,now);gain.gain.linearRampToValueAtTime(.045,now+.016);gain.gain.exponentialRampToValueAtTime(.001,now+.19);o.connect(gain).connect(context.destination);o.onended=()=>{o.disconnect();gain.disconnect();};o.start();o.stop(now+.2);}catch{}}
export function dispose(){if(context)void context.close().catch(()=>{});}

