import R from '@dimforge/rapier2d-compat/rapier.es.js';
import { flippers, rails, radius, start, rampEntry, posts } from './layout.js';

export const dt=1/180;
const clamp=(n,a,b)=>Math.min(b,Math.max(a,n));
let ready;
export async function createPhysics(mesa, emit=()=>{}, relax=false) {
  ready??=R.init();
  await ready;
  const world=new R.World({x:0,y:2.75});
  world.timestep=dt;
  world.maxCcdSubsteps=4;
  const events=new R.EventQueue(true);
  const named=new Map();
  const lastHit=new Map();
  const state={
    phase:'pronta', ball:1, score:0, relax, charge:0, holding:false,
    x:start.x,z:start.z,speed:0,vx:0,vz:0, ramp:0, angles:flippers.map(f=>f.idle),
    pressed:[false,false], hits:{}, time:0, stuck:false,
  };
  let drainTime=0, quietTime=0, accumulator=0, freed=false, rampTime=0;
  let launchedAt=0;
  function segment(a,b,r,restitution=.64) {
    const dx=b[0]-a[0],dy=b[1]-a[1];
    const def=R.ColliderDesc.capsule(Math.hypot(dx,dy)*.5,r)
      .setTranslation((a[0]+b[0])*.5,(a[1]+b[1])*.5).setRotation(Math.atan2(dy,dx)-Math.PI*.5)
      .setRestitution(restitution).setFriction(.07);
    world.createCollider(def);
  }
  for(const rail of rails){
    for(let i=1;i<rail.points.length;i++)segment(rail.points[i-1],rail.points[i],rail.width);
  }
  for(const [x,z] of posts)world.createCollider(R.ColliderDesc.ball(.046).setTranslation(x,z).setRestitution(.67));
  for(const b of mesa.bumpers){
    const collider=world.createCollider(R.ColliderDesc.ball(.208).setTranslation(b.x,b.z)
      .setRestitution(1).setActiveEvents(R.ActiveEvents.COLLISION_EVENTS));
    named.set(collider.handle,{...b,type:'bumper'});
  }
  for(const b of mesa.alvos){
    const collider=world.createCollider(R.ColliderDesc.cuboid(.091,.038).setTranslation(b.x,b.z)
      .setRestitution(.75).setActiveEvents(R.ActiveEvents.COLLISION_EVENTS));
    named.set(collider.handle,{...b,type:'alvo'});
  }
  const rampCollider=world.createCollider(R.ColliderDesc.ball(rampEntry.r)
    .setTranslation(rampEntry.x,rampEntry.z).setSensor(true).setActiveEvents(R.ActiveEvents.COLLISION_EVENTS));
  named.set(rampCollider.handle,{id:'rampa',type:'rampa',points:mesa.rampa.points});
  const moving=flippers.map(f=>{
    const body=world.createRigidBody(R.RigidBodyDesc.kinematicPositionBased().setTranslation(f.x,f.z).setRotation(f.idle));
    world.createCollider(R.ColliderDesc.capsule(.225,.062).setRotation(-Math.PI*.5).setTranslation(.257,0)
      .setFriction(.10).setRestitution(.80),body);
    return body;
  });
  const ball=world.createRigidBody(R.RigidBodyDesc.dynamic().setTranslation(start.x,start.z)
    .setCcdEnabled(true).setLinearDamping(.11).setAngularDamping(.4).setCanSleep(false));
  const ballShape=world.createCollider(R.ColliderDesc.ball(radius).setFriction(.075).setRestitution(.64).setDensity(6.3),ball);
  ball.setEnabled(false);

  function score(thing) {
    const delta=state.time-(lastHit.get(thing.id)??-10);
    if(delta<.22)return false;
    lastHit.set(thing.id,state.time);
    state.score+=thing.points;
    state.hits[thing.id]=state.time;
    emit(thing.type,thing);
    return true;
  }
  function clearBall() {
    ball.setEnabled(false);
    ball.setTranslation({x:start.x,y:start.z},true);
    ball.setLinvel({x:0,y:0},true);
    Object.assign(state,{x:start.x,z:start.z,vx:0,vz:0,speed:0,charge:0,holding:false,ramp:0,stuck:false});
    quietTime=0;
  }
  function drain(){
    if(state.phase!=='jogando')return;
    ball.setEnabled(false);
    state.phase='dreno';state.speed=0;state.stuck=false;drainTime=.57;
    emit('dreno',{});
  }
  function setRelax(next){
    state.relax=!!next;
    if(!state.relax)state.ball=Math.min(3,state.ball);
    if(state.relax&&state.phase==='fim')reset();
    else emit('mudanca',{});
  }
  function reset(){
    clearBall();Object.assign(state,{phase:'pronta',score:0,ball:1,hits:{}});
    state.pressed.fill(false);lastHit.clear();
    emit('mudanca',{});
  }
  function beginCharge(){
    if(state.phase!=='pronta'||state.holding)return false;
    state.holding=true;state.charge=0;emit('mudanca',{});return true;
  }
  function cancelCharge(){
    if(!state.holding)return;
    state.holding=false;state.charge=0;emit('mudanca',{});
  }
  function releaseCharge(){
    if(!state.holding||state.phase!=='pronta')return false;
    const force=clamp(state.charge,.22,1);
    state.phase='jogando';state.holding=false;state.charge=0;
    ball.setEnabled(true);ball.setTranslation({x:start.x,y:start.z},true);
    ball.setLinvel({x:.035+force*.024,y:-(6.45+6.2*force)},true);
    launchedAt=state.time;emit('lancar',{force});return true;
  }
  function flip(index,on){
    if(index<0||index>1||state.pressed[index]===on)return;
    state.pressed[index]=on;
    if(on)emit('flipper',{index});
  }
  function nudge(automatic=false) {
    if(state.phase!=='jogando')return;
    ball.setLinvel({x:state.x>.0?-1.3:1.3,y:-2.4},true);
    quietTime=0;state.stuck=false;
    emit('destravar',{automatic});
  }
  function update(){
    state.time+=dt;
    for(let i=0;i<2;i++){
      const def=flippers[i], aim=state.pressed[i]?def.up:def.idle;
      const change=aim-state.angles[i], speed=state.pressed[i]?23:15;
      state.angles[i]+=clamp(change,-speed*dt,speed*dt);
      moving[i].setNextKinematicRotation(state.angles[i]);
    }
    if(state.phase==='pronta'&&state.holding)state.charge=Math.min(1,state.charge+dt/.91);
    if(state.phase==='rampa'){
      rampTime+=dt;
      state.ramp=clamp(rampTime/1.20,0,1);
      if(state.ramp>=1){
        ball.setEnabled(true);ball.setTranslation({x:.53,y:.62},true);
        ball.setLinvel({x:-.70,y:2.85},true);
        state.phase='jogando';state.x=.53;state.z=.62;state.ramp=0;
      }
    }
    if(state.phase==='dreno'){
      drainTime-=dt;
      if(drainTime<=0){
        clearBall();
        if(!state.relax&&state.ball>=3){state.phase='fim';emit('fim',{});}
        else{ state.ball++;state.phase='pronta';emit('proxima',{}); }
      }
    }
    world.step(events);
    if(state.phase==='jogando'){
      let enterRamp=false;
      events.drainCollisionEvents((a,b,started)=>{
        if(!started)return;
        const handle=a===ballShape.handle?b:b===ballShape.handle?a:null;
        const thing=named.get(handle);
        if(!thing)return;
        if(thing.type==='rampa'){
          const vel=ball.linvel();
          if(vel.y<-.46&&score(thing))enterRamp=true;
          return;
        }
        if(score(thing)&&thing.type==='bumper'){
          const p=ball.translation();
          const dx=p.x-thing.x,dy=p.y-thing.z;
          const len=Math.hypot(dx,dy)||1;
          const velocity=ball.linvel();
          ball.setLinvel({x:velocity.x*.47+dx/len*4.25,y:velocity.y*.47+dy/len*4.25},true);
        }
      });
      if(enterRamp){state.phase='rampa';rampTime=0;state.ramp=0;ball.setEnabled(false);return;}
      const p=ball.translation(), velocity=ball.linvel();
      Object.assign(state,{x:p.x,z:p.y,vx:velocity.x,vz:velocity.y,speed:Math.hypot(velocity.x,velocity.y)});
      if(state.z>2.32||state.z< -2.9||Math.abs(state.x)>1.57){drain();return;}
      if(state.x>1.05&&state.z>1.99&&state.vz>.12&&state.time-launchedAt>.8){
        ball.setEnabled(false);clearBall();state.phase='pronta';emit('retorno',{});return;
      }
      quietTime=state.speed<.26?quietTime+dt:0;
      state.stuck=quietTime>1.5;
      if(quietTime>3.1)nudge(true);
      if(state.speed>15){
        const factor=15/state.speed;ball.setLinvel({x:state.vx*factor,y:state.vz*factor},true);
      }
    }else events.drainCollisionEvents(()=>{});
  }
  const isActive=()=>state.phase==='jogando'||state.phase==='rampa'||state.phase==='dreno'||state.holding||
    state.angles.some((angle,i)=>Math.abs(angle-(state.pressed[i]?flippers[i].up:flippers[i].idle))>.001);
  return {state,dt,setRelax,reset,beginCharge,cancelCharge,releaseCharge,flip,nudge,isActive,
    step(seconds){accumulator+=clamp(seconds,0,.10);while(accumulator+1e-9>=dt){update();accumulator-=dt;}},
    place(x,z,vx=0,vz=0){state.phase='jogando';ball.setEnabled(true);ball.setTranslation({x,y:z},true);ball.setLinvel({x:vx,y:vz},true);launchedAt=state.time-1;},
    free(){ if(!freed){freed=true;events.free();world.free();} },
  };
}
