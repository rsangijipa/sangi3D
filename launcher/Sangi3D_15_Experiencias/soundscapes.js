import { THREE, clamp, rng, download } from './runtime.js';
import { atmosphere, box, group, glow, lamp, mat, mesh, orbit, orb, sign, specks, tube, wood } from './scenery.js';

function note(audio,destination,frequency,at,duration,volume,type='sine'){
  const osc=audio.createOscillator(),envelope=audio.createGain();
  osc.type=type;osc.frequency.value=frequency;
  envelope.gain.setValueAtTime(.001,at);
  envelope.gain.exponentialRampToValueAtTime(Math.max(volume,.0011),at+.028);
  envelope.gain.exponentialRampToValueAtTime(.001,at+Math.max(.065,duration));
  osc.connect(envelope).connect(destination);
  osc.start(at);osc.stop(at+Math.max(.07,duration+.015));
  osc.onended=()=>{osc.disconnect();envelope.disconnect();};
  return osc;
}

function motionCamera(ctx,onMotion) {
  const video=document.createElement('video');
  video.muted=true;video.playsInline=true;
  const canvas=document.createElement('canvas');canvas.width=44;canvas.height=32;
  const c=canvas.getContext('2d',{willReadFrequently:true});
  let stream, pending=false, previous, clock=0, running=true;
  async function toggle(){
    if(stream){stop();ctx.say('Câmera desligada.');return;}
    if(pending)return;
    if(!navigator.mediaDevices?.getUserMedia){ctx.say('Câmera indisponível. Use os controles manuais.');return;}
    pending=true;
    let next;
    try{
      next=await navigator.mediaDevices.getUserMedia({video:{width:{ideal:320},height:{ideal:240},facingMode:'user'},audio:false});
      if(!running){next.getTracks().forEach(track=>track.stop());return;}
      if(!ctx.track(next))return;
      stream=next;video.srcObject=stream;await video.play();
      button.textContent='Desligar câmera';
      ctx.say('Câmera ativa. O movimento é lido localmente em baixa resolução.');
    }catch{
      if(stream===next)stop();
      ctx.say('A câmera não pôde ser ativada. Os controles manuais continuam disponíveis.');
    }finally{pending=false;}
  }
  function stop(){ctx.stop(stream);stream=undefined;previous=undefined;video.pause();video.srcObject=null;button.textContent='Ativar câmera';}
  function update(dt){
    clock+=dt;
    if(!stream||video.readyState<2||clock<.08)return;
    clock=0;
    c.drawImage(video,0,0,44,32);
    const image=c.getImageData(0,0,44,32).data;
    const gray=new Uint8Array(44*32);
    let amount=0,x=0,y=0;
    for(let i=0;i<gray.length;i++){
      gray[i]=(image[i*4]+image[i*4+1]+image[i*4+2])/3;
      if(!previous)continue;
      const weight=Math.max(0,Math.abs(gray[i]-previous[i])-16);
      amount+=weight;x+=(i%44)*weight;y+=Math.floor(i/44)*weight;
    }
    if(amount>760)onMotion(1-x/amount/44,y/amount/32,clamp(amount/18000,0,1));
    previous=gray;
  }
  const button=ctx.button('Ativar câmera',toggle);
  return {update,stop,dispose(){running=false;stop();}};
}

export function particles(ctx){
  const scene=ctx.scene, random=rng(8623);
  atmosphere(ctx,0x10121e,0x302a39,0xa3d5f4,{fog:.032,fill:.89,intensity:1.9});
  box(scene,mat(0x252a36,{roughness:.32,metalness:.32}),0,-.16,0,25,.29,20);
  const floorRing=mesh(scene,new THREE.TorusGeometry(3.35,.014,6,100),glow(0x447699,.65),[0,.018,0]);
  floorRing.rotation.x=Math.PI/2;
  const back=mat(0x1b2030,{roughness:.53});
  box(scene,back,0,4.8,-5.4,20,10,.3);
  const rib=glow(0x6b89ac,.58);
  for(const side of [-1,1]){
    for(let j=0;j<6;j++){
      const x=side*(4.29+j*.67);
      box(scene,back,x,3.76,-4.9,.33,7.5,.22);
      box(scene,rib,x,3.33,-4.74,.022,6.7,.028);
    }
  }
  const dust=new Float32Array(2300*3);
  for(let i=0;i<dust.length;i+=3)dust.set([(random()-.5)*15,random()*8,random()*8-4.7],i);
  specks(scene,dust,0x95bdff,.025,.37);
  lamp(scene,0x6cc6ff,15,-4,4,-1,12);
  lamp(scene,0x9a77fc,12,4,3,-1,12);
  const count=16500;
  const base=new Float32Array(count*3),values=new Float32Array(count*3),color=new Float32Array(count*3),velocity=new Float32Array(count*3);
  const skeleton=[
    [-.22,4.6,.28,4.63,.30],[-.03,4.45,0,3.68,.28],[-.01,3.89,0,2.55,.53],
    [-.57,3.78,-1.34,3.45,.18],[-1.34,3.45,-2.1,3.56,.115],[.57,3.78,1.36,3.56,.18],[1.36,3.56,2.12,3.86,.11],
    [-.31,2.55,-.61,1.36,.22],[-.61,1.36,-.80,.27,.16],[.31,2.55,.61,1.30,.22],[.61,1.30,.74,.30,.16],
  ];
  const shades=[new THREE.Color(0x80e4f7),new THREE.Color(0xb3bfff),new THREE.Color(0xf3c77a)];
  for(let i=0;i<count;i++){
    const [x,y,X,Y,r]=skeleton[i%skeleton.length],l=random(),a=random()*Math.PI*2,d=Math.sqrt(random())*r;
    base.set([x+(X-x)*l+Math.cos(a)*d,y+(Y-y)*l+Math.sin(a)*d,(random()-.5)*r*1.5],i*3);
    shades[Math.min(2,Math.floor(random()*2.14))].toArray(color,i*3);
  }
  values.set(base);
  const points=specks(scene,values,0xffffff,.066,.68);
  points.geometry.setAttribute('color',new THREE.BufferAttribute(color,3));
  points.material.vertexColors=true;points.material.blending=THREE.AdditiveBlending;
  points.geometry.attributes.position.setUsage(THREE.DynamicDrawUsage);
  const trailBuffer=new Float32Array(3600*3);
  const trails=specks(scene,trailBuffer,0xffd48b,.052,.84);
  trails.material.blending=THREE.AdditiveBlending;trails.geometry.setDrawRange(0,0);
  let mode=0,strength=.58,trailCount=0,trailIndex=0,motion,energy=0;
  let audio,voice,bus,filter;
  function sound(muted){
    if(muted||voice)return;
    const graph=ctx.audio();
    audio=graph.audio;voice=audio.createOscillator();voice.type='triangle';voice.frequency.value=130.814;
    bus=audio.createGain();bus.gain.value=0;
    filter=audio.createBiquadFilter();filter.type='lowpass';filter.frequency.value=290;
    voice.connect(filter).connect(bus).connect(graph.master);voice.start();
  }
  const plane=new THREE.Plane(new THREE.Vector3(0,0,1),0);
  const pointerMap=new Map();
  const center=new THREE.Vector3();
  ctx.camera.position.set(0,2.55,8.9);ctx.camera.lookAt(0,2.46,0);ctx.camera.updateMatrixWorld();
  ctx.hint('Arraste para mover um atrator. Use dois dedos para dois atratores. A barra de espaço dispersa a silhueta.');
  const gauge=ctx.meter('Energia dos gestos');
  ctx.select('Modo',['Espelho','Dispersão','Órbita','Desenho'],i=>{mode=i;pointerMap.clear();});
  ctx.select('Paleta',['Ciano','Violeta','Ouro'],i=>{points.material.color.setHex([0xe4f4ff,0xb89dff,0xffbe71][i]);});
  ctx.range('Força dos atratores',.1,1,.05,strength,value=>{strength=value;});
  function imprint(at){
    for(let i=0;i<13;i++){
      trailBuffer.set([at.x+(random()-.5)*.19,at.y+(random()-.5)*.19,at.z+(random()-.5)*.16],trailIndex*3);
      trailIndex=(trailIndex+1)%3600;trailCount=Math.min(3600,trailCount+1);
    }
    trails.geometry.setDrawRange(0,trailCount);
    trails.geometry.attributes.position.needsUpdate=true;
  }
  function push(where=undefined){
    for(let i=0;i<velocity.length;i+=3){
      if(where&&Math.hypot(values[i]-where.x,values[i+1]-where.y)>1.16)continue;
      velocity[i]+=(random()-.5)*6;
      velocity[i+1]+=(random()-.5)*6;
      velocity[i+2]+=(random()-.5)*4;
    }
    energy=1;
  }
  function clear(){trailCount=trailIndex=0;trails.geometry.setDrawRange(0,0);}
  const tools=ctx.group();
  ctx.button('Dispersar',()=>{push();ctx.say('A silhueta se recompõe após o impulso.');},tools);
  ctx.button('Limpar rastros',()=>{clear();ctx.say('Rastros removidos.');},tools);
  ctx.button('Desenhar um oito',()=>{
    for(let i=0;i<110;i++){const t=i/110*Math.PI*2;center.set(Math.sin(t)*2.3,2.6+Math.sin(t*2)*.77,.40);imprint(center);}
    push();ctx.say('Trajeto em oito traçado. Use Fotografar para capturar a composição.');
  },tools);
  ctx.paint((p,phase)=>{
    if(phase==='end'||phase==='cancel'){pointerMap.delete(p.id);return;}
    if(!ctx.project(p,plane,center))return;
    let target=pointerMap.get(p.id);
    if(!target){target=new THREE.Vector3();pointerMap.set(p.id,target);}
    target.copy(center);
    if(mode===1&&(phase==='start'||Math.abs(p.dx)+Math.abs(p.dy)>15))push(target);
    if(mode===2||mode===3)imprint(target);
    energy=Math.min(1,energy+.15);
  });
  const camera=motionCamera(ctx,(x,y,power)=>{
    motion={x:(x-.5)*5.7,y:5.1-y*4.9,z:.1,ttl:.23};
    if(mode===1&&power>.51)push(motion);
    if(mode>=2)imprint(motion);
    energy=Math.max(energy,power);
  });
  return {fov:46,mute:sound,releaseMedia:camera.stop,key(key){if(key===' ')push();},cancel(){pointerMap.clear();},pause(){pointerMap.clear();},
    reset(){velocity.fill(0);values.set(base);clear();ctx.say('Silhueta inicial recomposta.');},
    update(dt){
      camera.update(dt);
      const anchors=[...pointerMap.values()];
      if(motion?.ttl>0){motion.ttl-=dt;anchors.push(motion);}
      const live=ctx.low?5500:count,decay=Math.exp(-dt*3.4);
      points.geometry.setDrawRange(0,live);
      for(let i=0;i<live*3;i+=3){
        let ax=(base[i]-values[i])*7,ay=(base[i+1]-values[i+1])*7,az=(base[i+2]-values[i+2])*7;
        for(const at of anchors){
          const dx=at.x-values[i],dy=at.y-values[i+1],dz=at.z-values[i+2];
          const n=(4*strength)/(dx*dx+dy*dy+dz*dz+.31);
          ax+=n*(mode===2?dy:dx)*(mode===1?-1:1);ay+=n*(mode===2?-dx:dy)*(mode===1?-1:1);az+=n*dz;
        }
        velocity[i]=(velocity[i]+ax*dt)*decay;velocity[i+1]=(velocity[i+1]+ay*dt)*decay;velocity[i+2]=(velocity[i+2]+az*dt)*decay;
        const factor=ctx.reduced?.45:1;
        values[i]+=velocity[i]*dt*factor;values[i+1]+=velocity[i+1]*dt*factor;values[i+2]+=velocity[i+2]*dt*factor;
      }
      energy*=Math.exp(-dt*1.8);gauge.value=energy;
      if(voice){
        bus.gain.setTargetAtTime(energy*.095,audio.currentTime,.12);
        filter.frequency.setTargetAtTime(245+energy*520,audio.currentTime,.13);
      }
      points.geometry.attributes.position.needsUpdate=true;
    },dispose(){camera.dispose();if(voice){voice.stop();voice.disconnect();filter.disconnect();bus.disconnect();}}};
}

function sampleTrack(audio,index){
  const seconds=index===0?16:4,rate=audio.sampleRate;
  const buffer=audio.createBuffer(1,seconds*rate,rate);
  const data=buffer.getChannelData(0);
  for(let i=0;i<data.length;i++){
    const t=i/rate;
    if(index>0){data[i]=Math.sin(t*Math.PI*2*[0,82,3750][index])*.41;continue;}
    const beat=t%.5,bar=Math.floor(t/2)%4;
    const bass=Math.sin(t*Math.PI*2*[65.4,55,73.4,49][bar])*.29*Math.exp(-beat*8);
    const chord=[130.8,164.8,196,261.6].reduce((sum,f,j)=>sum+Math.sin(t*(f+bar*3)*Math.PI*2)*(.055+j*.006),0);
    const highs=Math.sin(t*8447)*Math.sin(t*5992)*.14*Math.exp(-((t+.25)%.5)*24);
    data[i]=(bass+chord+highs)*Math.min(1,t*12,(seconds-t)*12);
  }
  return buffer;
}

export function visualizer(ctx){
  const scene=ctx.scene,random=rng(23501);
  atmosphere(ctx,0x101b26,0x343240,0xbcd2f1,{fog:.028,fill:1.20,intensity:2.4});
  const base=mat(0x183037,{metalness:.66,roughness:.33});
  const tunnel=group(scene),wave=group(scene),nebula=group(scene),city=group(scene);
  const copper=glow(0xd98a47,1.22),jade=glow(0x50e4dc,1),violet=glow(0xa285e3,1.15);
  const rings=[],bays=[],bars=[];
  for(let i=0;i<18;i++){
    const g=group(tunnel,0,0,-i*2.7);
    for(let j=0;j<6;j++){
      const angle=(j+.5)*Math.PI/3;
      const frame=box(g,base,Math.cos(angle)*3.45,Math.sin(angle)*3.45,0,3.99,.31,.27);
      frame.rotation.z=angle+Math.PI/2;
      const light=box(g,j%3===0?copper:jade,Math.cos(angle)*3.29,Math.sin(angle)*3.29,.15,3.66,.034,.071);
      light.rotation.z=frame.rotation.z;
    }
    rings.push(g);
  }
  for(let i=0;i<20;i++){
    const g=group(wave,0,0,-i*2.8);
    for(let j=0;j<5;j++){
      const arc=mesh(g,new THREE.TorusGeometry(2+j*.43,.022,5,35,Math.PI),j%2?violet:jade);
      arc.position.y=-1.20;
    }
    bays.push(g);
  }
  const stars=new Float32Array(9400*3);
  for(let i=0;i<stars.length;i+=3){
    const r=1+random()*4, a=random()*Math.PI*2;
    stars.set([Math.cos(a)*r,Math.sin(a)*r,-1-random()*30],i);
  }
  const starCloud=specks(nebula,stars,0x92a8ff,.05,.71);
  for(let i=0;i<132;i++){
    const side=i%2===0?1:-1;
    bars.push(box(city,i%4===0?copper:i%3===0?violet:jade,side*(1.05+random()*5),-2,-2-random()*40,.25,.25,.29));
  }
  box(scene,mat(0x24343c,{metalness:.45,roughness:.19}),0,-3.18,-25,35,.13,61);
  const visual=[tunnel,wave,nebula,city];
  let preset=0,sensitivity=1,moving=false;
  const saved=ctx.load({});
  if(Number.isInteger(saved?.preset)&&saved.preset>=0&&saved.preset<4)preset=saved.preset;
  if(Number.isFinite(saved?.sensitivity))sensitivity=clamp(saved.sensitivity,.3,2.5);
  const dimensions=['Túnel hexagonal','Catedral de ondas','Nebulosa','Cidade de barras'];
  function show(){visual.forEach((obj,i)=>obj.visible=i===preset);}
  const choose=ctx.select('Cenário',dimensions,i=>{preset=i;show();});choose.value=String(preset);
  ctx.range('Sensibilidade',.3,2.5,.05,sensitivity,value=>{sensitivity=value;});
  const bandMeters=['Graves','Médios','Agudos'].map(name=>ctx.meter(name));
  const state=ctx.reading('Faixa demonstrativa pronta.');
  const camera=orbit(ctx,5.8,[0,0,-9],.018,0);
  camera.zoom(2.2);
  ctx.move(p=>{if(!moving)camera.drag(p);});
  let audio,analyser,monitor,mic,source,buffer,fft,started=0,offset=0,length=16,kind=0,playing=false,token=0;
  const graph=()=>{
    const base=ctx.audio();
    if(!audio){
      audio=base.audio;analyser=audio.createAnalyser();analyser.fftSize=2048;analyser.smoothingTimeConstant=.53;
      monitor=audio.createGain();monitor.connect(base.master);
      fft=new Uint8Array(analyser.frequencyBinCount);
    }
  };
  function stop(){
    if(source){
      if(!mic)try{source.stop();}catch{}
      source.disconnect();source=null;
    }
    if(mic){ctx.stop(mic);mic=null;}
    playing=false;
  }
  function updateButtons(){play.textContent=playing?'Pausar faixa':'Reproduzir faixa';}
  function playBuffer(){
    if(!buffer)buffer=sampleTrack(audio,kind);
    source=audio.createBufferSource();source.buffer=buffer;source.loop=true;
    source.connect(analyser);source.connect(monitor);
    offset%=buffer.duration;
    source.start(0,offset);
    playing=true;started=audio.currentTime;length=buffer.duration;
    ctx.unmute();updateButtons();
  }
  const h=ctx.group();
  const play=ctx.button('Reproduzir faixa',()=>{
    ++token;
    graph();
    if(playing){
      if(!mic)offset=(offset+audio.currentTime-started)%length;
      stop();updateButtons();
    }else playBuffer();
  },h,true);
  const sourceChoice=ctx.select('Fonte integrada',['Demonstração','Tom grave · 82 Hz','Tom agudo · 3750 Hz'],index=>{
    ++token;const resume=playing;stop();kind=index;buffer=null;offset=0;length=index===0?16:4;
    if(resume){graph();playBuffer();}
    updateButtons();ctx.say('Fonte integrada selecionada.');
  });
  ctx.file('Abrir faixa local','audio/*',async file=>{
    if(file.size>38_000_000)throw new Error('Use um arquivo de até 38 MB.');
    const request=++token;graph();
    const decoded=await audio.decodeAudioData(await file.arrayBuffer());
    if(request!==token)return;
    stop();buffer=decoded;offset=0;playBuffer();ctx.say('Arquivo reproduzido localmente.');
  });
  ctx.button('Ouvir microfone',async()=>{
    if(mic){++token;stop();updateButtons();return;}
    if(!navigator.mediaDevices?.getUserMedia)throw new Error('Microfone indisponível. Escolha uma faixa.');
    const request=++token;graph();
    try{
      const stream=await navigator.mediaDevices.getUserMedia({audio:true});
      if(request!==token){stream.getTracks().forEach(track=>track.stop());return;}
      if(!ctx.track(stream))return;
      stop();mic=stream;source=audio.createMediaStreamSource(stream);source.connect(analyser);
      playing=true;updateButtons();ctx.say('Microfone analisado localmente. O sinal fica fora da saída de áudio.');
    }catch{if(request===token)ctx.say('Microfone não disponível. A faixa original continua como alternativa.');}
  });
  const save=ctx.group();
  ctx.button('Salvar preset',()=>{if(ctx.save({preset,sensitivity}))ctx.say('Preset visual salvo.');},save);
  const toggle=ctx.button('Travar câmera',()=>{
    moving=!moving;toggle.textContent=moving?'Liberar câmera':'Travar câmera';toggle.setAttribute('aria-pressed',String(moving));
  },save);
  show();
  const energy=[0,0,0];
  return {fov:57,audio:true,releaseMedia(){if(mic){++token;stop();updateButtons();}},reset(){
    ++token;stop();kind=0;offset=0;length=16;buffer=null;sourceChoice.value='0';
    energy.fill(0);camera.reset();camera.zoom(2.2);updateButtons();ctx.say('Faixa e câmera reiniciadas.');
  },dispose(){++token;stop();},update(dt,time){
    if(playing&&analyser)analyser.getByteFrequencyData(fft);
    const bands=[[40,210],[210,1700],[1700,8000]];
    bands.forEach(([lo,hi],index)=>{
      let peak=0;
      if(playing&&fft){
        const hz=audio.sampleRate/analyser.fftSize;
        for(let i=Math.max(1,Math.ceil(lo/hz));i<=Math.floor(hi/hz)&&i<fft.length;i++)peak=Math.max(peak,fft[i]/255);
      }
      energy[index]+=(clamp(peak*sensitivity,0,1)-energy[index])*Math.min(1,dt*8);
      bandMeters[index].value=energy[index];
    });
    const motion=ctx.reduced?.19:1;
    const stages=[energy[0],energy[1],energy[2]];
    rings.forEach((r,i)=>{r.scale.setScalar(1+stages[0]*.105*motion*Math.cos(i*.32));r.rotation.z=(ctx.reduced?0:Math.sin(time*.45-i*.19)*stages[1]*.13);});
    bays.forEach((r,i)=>{r.scale.y=1+Math.sin(i*.32+time)*stages[1]*.25*motion;});
    bars.forEach((b,i)=>{b.scale.y=.17+stages[i%3]*(.6+(i%12)*.13)*motion;});
    starCloud.material.opacity=.43+stages[2]*.47;starCloud.rotation.z+=dt*stages[0]*.035*motion;
    jade.emissiveIntensity=.74+stages[1]*1.8*motion;copper.emissiveIntensity=.95+stages[0]*1.8*motion;
    if(mic)state.textContent='Entrada: microfone local';
    else if(playing){const seconds=(offset+audio.currentTime-started)%length;state.textContent='Reproduzindo · '+seconds.toFixed(1)+' / '+length.toFixed(1)+' s';}
    else state.textContent='Faixa parada · '+offset.toFixed(1)+' s';
  }};
}

export function conductor(ctx){
  const scene=ctx.scene;
  atmosphere(ctx,0x1d2334,0x594236,0xffe0a9,{fog:.025,fill:1.08,intensity:2.3});
  const stage=wood(0x805940),piano=mat(0x241d24,{roughness:.32}),velvet=mat(0x533841),brass=mat(0xcc9d58,{metalness:.67,roughness:.31});
  tube(scene,stage,0,-.12,-3,10.2,.24);
  box(scene,stage,0,.06,2.7,2.4,.17,1.62);
  box(scene,piano,0,1.04,2.25,.8,.046,.48).rotation.x=-.31;
  tube(scene,brass,0,.54,2.25,.035,.96);
  const positions=[[-4.35,-1.5],[0,-4.9],[4.4,-1.5]];
  const names=['Cordas','Sopros','Percussão'];
  const cues=[0xffad60,0x70cdf3,0xbb91ff];
  const sections=positions.map(([x,z],i)=>{
    const g=group(scene,x,0,z), highlight=glow(cues[i],.18), instruments=[];
    sign(g,names[i],0,.28,.74,1.35,.23);
    for(let j=0;j<7;j++){
      const slot=group(g,(j%4-1.5)*.92,0,-Math.floor(j/4)*1.28-.43);
      box(slot,velvet,0,.45,0,.55,.14,.47);
      box(slot,velvet,0,.77,-.21,.57,.54,.12);
      for(const a of [-1,1])for(const b of [-1,1])box(slot,brass,a*.22,.22,b*.18,.034,.43,.034);
      tube(slot,piano,.12,.53,.46,.019,1.04);
      box(slot,mat(0xeee4d1),.12,1.06,.44,.40,.28,.035).rotation.x=.32;
      if(i===0){
        const instrument=group(slot,-.27,.48,-.06);
        orb(instrument,stage,0,.24,0,.16,.24,.073);
        orb(instrument,stage,0,.49,0,.124,.17,.069);
        box(instrument,piano,0,.67,.024,.04,.34,.045);
        tube(instrument,brass,.15,.30,.08,.009,.71).rotation.z=-.3;
        instruments.push(instrument);
      }else if(i===1){
        const instrument=group(slot,-.28,.56,-.03);
        tube(instrument,brass,0,.15,0,.039,.50).rotation.z=.47;
        mesh(instrument,new THREE.CylinderGeometry(.09,.04,.14,16),brass,[-.101,.39,0]).rotation.z=.47;
        instruments.push(instrument);
      }else{
        const instrument=group(slot,-.30,.38,-.04);
        tube(instrument,stage,0,.11,0,.19,.25);
        tube(instrument,mat(0xe1ceb0),0,.25,0,.195,.026);
        instruments.push(instrument);
      }
      box(slot,highlight,0,.018,.15,.30,.018,.26);
    }
    return {g,highlight,instruments};
  });
  for(let i=0;i<13;i++){
    const a=i/12*Math.PI;
    const x=Math.cos(a)*10.6,z=-3-Math.sin(a)*10.6;
    box(scene,stage,x,2.8,z,.29,5.6,.66);
    box(scene,velvet,x,1.8,z-.12,.19,3.5,.98);
  }
  lamp(scene,0xe9b171,45,0,5,1,14);
  lamp(scene,0x83a7ef,29,-3,3,-8,11);
  const camera=orbit(ctx,10,[0,1,-2.2],.27,0);
  ctx.hint('Espaço ou Marcar pulso define o andamento. Arrastar orbita. A câmera opcional reage à direção do movimento.');
  ctx.move(p=>camera.drag(p));
  let bpm=96, volume=.65, meter=4, beat=0, current=0, running=false, next=0, atTap, replaying=false, replayIndex=0;
  let requested=0, audio, master, replayStart=0;
  const active=[true,true,true], taps=[], recorded=[], scheduled=[];
  const reading=ctx.reading('96 BPM · Compasso de 4 tempos');
  function setup(){
    ({audio,master}=ctx.audio());
    ctx.unmute();
  }
  function bpmFromTaps(interval){
    if(interval<.30||interval>1.54){taps.length=0;return;}
    taps.push(interval);if(taps.length>7)taps.shift();
    const sorted=taps.slice().sort((a,b)=>a-b);
    bpm=Math.round(60/sorted[Math.floor(sorted.length/2)]);
  }
  function tap(){
    if(ctx.timers.paused)return;
    if(!audio||audio.state!=='running')setup();
    const at=performance.now()/1000;
    if(atTap!==undefined)bpmFromTaps(at-atTap);
    atTap=at;
    if(!running){running=true;beat=0;next=audio.currentTime+.06;}
    ctx.say('Pulso marcado · '+bpm+' BPM.');
  }
  const top=ctx.group();
  ctx.button('Marcar pulso',tap,top,true);
  const play=ctx.button('Iniciar ensaio',()=>{
    if(running||replaying){halt();ctx.say('Ensaio interrompido.');return;}
    setup();beat=0;next=audio.currentTime+.08;running=true;ctx.say('Ensaio em andamento.');
  },top);
  ctx.select('Compasso',['2 tempos','3 tempos','4 tempos'],i=>{meter=i+2;}).value='2';
  ctx.range('Dinâmica',.15,1,.05,volume,value=>{volume=value;});
  ctx.select('Seção em destaque',names,i=>{requested=i;ctx.say(names[i]+' entram no próximo compasso.');});
  const sectionButtons=ctx.group();
  for(let i=0;i<names.length;i++){
    const button=ctx.button(names[i],()=>{
      active[i]=!active[i];button.setAttribute('aria-pressed',String(active[i]));
      ctx.say(names[i]+(active[i]?' presentes.':' em silêncio.'));
    },sectionButtons);
    button.setAttribute('aria-pressed','true');
  }
  const data=ctx.group();
  ctx.button('Reouvir sequência',()=>{
    if(!recorded.length){ctx.say('Marque pulsos para gravar uma sequência.');return;}
    halt();setup();replaying=true;replayIndex=0;replayStart=audio.currentTime+.12;
    ctx.say('Reproduzindo a sequência gravada.');
  },data);
  ctx.button('Exportar sequência',()=>{
    if(!recorded.length){ctx.say('A sequência está vazia.');return;}
    download(JSON.stringify({version:1,events:recorded},null,2),'sequencia-do-maestro.json');
  },data);
  let firstBeat;
  const pulses=[-9,-9,-9];
  const voices=new Set();
  function cue(event,at){
    const harmony=[130.814,146.83,164.81,98][event.bar%4];
    event.on.forEach((on,i)=>{
      if(!on)return;
      const strength=event.dynamic*(event.focus===i?.32:.14);
      const frequency=harmony*[event.beat%2?1.5:1,2,0.62][i];
      const voice=note(audio,master,frequency,at,i===0?.38:i===1?.29:.14,strength,i===0?'triangle':'sine');
      voices.add(voice);
      voice.addEventListener('ended',()=>voices.delete(voice),{once:true});
    });
    scheduled.push([at,event.on.slice()]);
  }
  function halt(){
    running=replaying=false;
    for(const voice of voices)try{voice.stop();}catch{}
    scheduled.length=0;
  }
  let vertical=0,lastGesture=0;
  const gesture=motionCamera(ctx,(_,y,intensity)=>{
    const now=performance.now(), delta=y-vertical;
    if(intensity>.25&&delta<-.10&&now-lastGesture>330){lastGesture=now;tap();}
    vertical=y;
  });
  return {audio:true,releaseMedia:gesture.stop,key(key){if(key===' ')tap();},pause(value){if(value){taps.length=0;atTap=undefined;}},dispose(){gesture.dispose();halt();},
    reset(){halt();recorded.length=0;firstBeat=undefined;beat=0;bpm=96;taps.length=0;atTap=undefined;camera.reset();ctx.say('Ensaio reiniciado.');},
    update(dt){
      gesture.update(dt);
      play.textContent=running||replaying?'Parar ensaio':'Iniciar ensaio';
      reading.textContent=bpm+' BPM · Compasso de '+meter+' tempos · '+(beat%meter+1);
      if(!audio)return;
      const now=audio.currentTime;
      if(running&&next<now-.12)next=now+.03;
      while(running&&next<now+.106){
        if(beat%meter===0)current=requested;
        const event={t:next-(firstBeat??=next),beat:beat%meter,bar:Math.floor(beat/meter),focus:current,on:active.slice(),dynamic:volume};
        cue(event,next);
        if(recorded.length<512)recorded.push(event);
        beat++;next+=60/bpm;
      }
      while(replaying&&replayIndex<recorded.length&&replayStart+recorded[replayIndex].t<now+.106){
        const event=recorded[replayIndex++];cue(event,Math.max(now+.01,replayStart+event.t));
      }
      if(replaying&&replayIndex===recorded.length&&now>replayStart+recorded.at(-1).t+.4)replaying=false;
      while(scheduled.length&&scheduled[0][0]<=now){
        const [at,on]=scheduled.shift();on.forEach((value,i)=>{if(value)pulses[i]=at;});
      }
      sections.forEach(({highlight,instruments},i)=>{
        const amp=Math.exp(-Math.max(0,now-pulses[i])*7);
        highlight.emissiveIntensity=.14+amp*.85;
        instruments.forEach((instrument,j)=>{instrument.rotation.z=ctx.reduced?0:amp*.08*Math.sin(j+now*24);});
      });
    }};
}
