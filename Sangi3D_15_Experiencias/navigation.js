import { THREE, clamp, rng } from './runtime.js';

export function navigator(ctx, settings) {
  const { start, yaw: originYaw = 0, speed = 3.2, canWalk = () => true, ground = () => 0, swim = false } = settings;
  const pos = new THREE.Vector3(...start);
  const forward = new THREE.Vector3();
  const target = new THREE.Vector3();
  const held = new Set();
  const spots = [];
  let yaw = originYaw, pitch = -.07, seated, inside, candidate;
  ctx.hint((swim ? 'WASD ou setas para nadar. Suba e desça com Q e Z.' : 'WASD ou setas para andar.') + ' Arraste na cena para olhar. E interage com o ponto próximo.',true);
  const pad = ctx.group('walk');
  for (const [symbol,label,key] of [['↑','Avançar','w'],['←','Ir à esquerda','a'],['↓','Recuar','s'],['→','Ir à direita','d']]){
    const button = ctx.button(symbol, () => {
      if (!button.dataset.drag) advance(key,.13);
      delete button.dataset.drag;
    },pad);
    button.setAttribute('aria-label',label);
    ctx.on(button,'pointerdown',event => { held.add(key); button.setPointerCapture(event.pointerId); });
    const release = () => { if (held.delete(key)) { button.dataset.drag = 'true'; setTimeout(() => delete button.dataset.drag,300); } };
    ctx.on(button,'pointerup',release);
    ctx.on(button,'pointercancel',release);
    ctx.on(button,'lostpointercapture',release);
  }
  if (swim) {
    const panel = ctx.group();
    for (const [label,key] of [['Subir','q'],['Descer','z']]) {
      const button = ctx.button(label,() => advance(key,.3),panel);
      ctx.on(button,'pointerdown',event => { held.add(key); button.setPointerCapture(event.pointerId); });
      for(const name of ['pointerup','pointercancel','lostpointercapture']) ctx.on(button,name,() => held.delete(key));
    }
  }
  const interact = ctx.button('Interagir',perform,ctx.controls,true);
  interact.disabled = true;
  const position = ctx.reading();
  function look() {
    forward.set(Math.sin(yaw)*Math.cos(pitch),Math.sin(pitch),-Math.cos(yaw)*Math.cos(pitch));
    target.copy(pos).add(forward);
    ctx.camera.position.copy(pos);
    ctx.camera.lookAt(target);
    ctx.camera.updateMatrixWorld();
  }
  function updateContext() {
    let best = Infinity;
    candidate = undefined;
    for (const spot of spots) {
      const dx=spot.x-pos.x, dy=(spot.y??1.6)-pos.y, dz=spot.z-pos.z;
      const dist = dx*dx+dy*dy+dz*dz;
      if (dist < (spot.range || 2.4)**2 && dist < best && (!spot.available || spot.available())) {
        best = dist;
        candidate = spot;
      }
    }
    const label = seated ? 'Levantar' : candidate?.label || 'Aproxime-se de um ponto';
    if (interact.textContent !== label) interact.textContent = label;
    interact.disabled = !candidate && !seated;
  }
  function perform() {
    if (seated) {
      pos.copy(seated); seated=undefined;
      ctx.say('Você se levantou.');
      updateContext(); look();
    } else if (candidate) candidate.action();
  }
  function translate(forwardAmount, sideAmount, vertical, dt) {
    if (seated || ctx.timers.paused) return;
    const scale = dt * speed / Math.max(1,Math.hypot(forwardAmount,sideAmount,vertical));
    const dx=(Math.sin(yaw)*forwardAmount+Math.cos(yaw)*sideAmount)*scale;
    const dz=(-Math.cos(yaw)*forwardAmount+Math.sin(yaw)*sideAmount)*scale;
    const bounds = settings.bounds || [-30,30,-30,30];
    const x=clamp(pos.x+dx,bounds[0],bounds[1]);
    const z=clamp(pos.z+dz,bounds[2],bounds[3]);
    if (canWalk(x,pos.z,pos.y)) pos.x=x;
    if (canWalk(pos.x,z,pos.y)) pos.z=z;
    if (swim) pos.y=clamp(pos.y+vertical*scale,settings.minY ?? 1,settings.maxY ?? 10);
    else pos.y=ground(pos.x,pos.z)+1.61;
    look();
  }
  function advance(key, dt) {
    translate(Number(key==='w')-Number(key==='s'),Number(key==='d')-Number(key==='a'),Number(key==='q')-Number(key==='z'),dt);
    updateContext();
  }
  function update(dt) {
    const pressed = (...keys) => Number(keys.some(key => ctx.keys.has(key)||held.has(key)));
    const f=pressed('w','arrowup')-pressed('s','arrowdown');
    const s=pressed('d','arrowright')-pressed('a','arrowleft');
    const v=swim ? pressed('q','pageup')-pressed('z','pagedown') : 0;
    if (f || s || v) translate(f,s,v,dt);
    updateContext();
  }
  function place(x,y,z,orientation=yaw) {
    seated=undefined;
    pos.set(x,y,z); yaw=orientation; pitch=-.065;
    look(); updateContext();
  }
  ctx.move(p => {
    yaw -= p.dx*.005;
    pitch = clamp(pitch-p.dy*.0045,-1.15,1.14);
    look();
  });
  place(...start,originYaw);
  return {
    pos, position, spots, update, place, look, interact,
    add(...items) { spots.push(...items); updateContext(); },
    key(key){if(key==='e')perform();},
    clear(){held.clear();},
    reset(){held.clear();place(...start,originYaw);},
    seat(x,y,z,orientation=yaw){seated=pos.clone();pos.set(x,y,z);yaw=orientation;pitch=-.05;look();updateContext();},
    zone(name, onEnter){if(name!==inside){inside=name;onEnter(name);}},
  };
}

export function withNavigation(nav, game = {}) {
  return {
    ...game,
    update(dt,time){nav.update(dt);game.update?.(dt,time);},
    key(key){nav.key(key);game.key?.(key);},
    reset(){nav.reset();game.reset?.();},
    cancel(){nav.clear();game.cancel?.();},
    pause(value){nav.clear();game.pause?.(value);},
  };
}

export function atmosphereAudio(ctx, options = {}) {
  let filter, gain, source, volume = 0, cutoff = options.cutoff || 500, active = false;
  function ensure() {
    if (source) return;
    const {audio,master} = ctx.audio();
    const random = rng(7601);
    const data = audio.createBuffer(1, audio.sampleRate*3, audio.sampleRate);
    const signal=data.getChannelData(0);
    let sample=0;
    for(let i=0;i<signal.length;i++){
      sample=sample*.77+(random()*2-1)*.23;
      signal[i]=sample*(.72+.28*Math.sin(i/3400)**2);
    }
    filter=audio.createBiquadFilter();
    filter.type='lowpass'; filter.frequency.value=cutoff;
    gain=audio.createGain(); gain.gain.value=volume;
    source=audio.createBufferSource(); source.buffer=data; source.loop=true;
    source.connect(filter).connect(gain).connect(master);
    source.start();
  }
  function set(level,frequency) {
    volume=level; cutoff=frequency;
    if(active && !source)ensure();
    if(!source)return;
    filter.frequency.setTargetAtTime(cutoff,filter.context.currentTime,.23);
    gain.gain.setTargetAtTime(volume,gain.context.currentTime,.23);
  }
  return {
    set,
    mute(muted){active=!muted;if(active)ensure();},
    dispose(){if(source){source.stop();source.disconnect();filter.disconnect();gain.disconnect();}},
  };
}
