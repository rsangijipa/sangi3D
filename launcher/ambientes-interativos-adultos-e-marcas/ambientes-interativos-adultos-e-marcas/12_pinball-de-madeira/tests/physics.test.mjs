import assert from 'node:assert/strict';
import test from 'node:test';
import {createPhysics,dt} from '../src/physics.js';
const mesa={
  bumpers:[{id:'bumper-esquerdo',x:-.49,z:-1.02,points:120},{id:'bumper-central',x:.01,z:-1.50,points:120},{id:'bumper-direito',x:.54,z:-1.02,points:120}],
  alvos:[{id:'alvo-1',x:-.45,z:-1.91,points:250}], rampa:{points:500},
};
const advance=(sim,seconds)=>{for(let t=0;t<seconds;t+=dt)sim.step(dt);};
function drain(sim){sim.place(0,2.26,0,4);advance(sim,.79);}
test('lança por pressão, sai do canal e mantém a velocidade limitada',async()=>{
  const sim=await createPhysics(mesa);
  try{
    assert(sim.beginCharge());
    advance(sim,.51);assert(sim.state.charge>.5&&sim.state.charge<.65);
    assert(sim.releaseCharge());
    let escaped=false;
    for(let i=0;i<380;i++){sim.step(dt);if(sim.state.x<.95&&sim.state.z<0)escaped=true;}
    assert(escaped,'Lançamento deixou o canal e entrou na área de jogo.');
    assert(sim.state.speed<15.1);
  }finally{sim.free();}
});
test('flippers cinemáticos aceitam os dois lados e retornam aos pivôs',async()=>{
  const sim=await createPhysics(mesa);
  try{
    sim.flip(0,true);sim.flip(1,true);advance(sim,.08);
    assert(sim.state.angles[0]<-.5&&sim.state.angles[1]>3.65);
    sim.flip(0,false);sim.flip(1,false);advance(sim,.12);
    assert(Math.abs(sim.state.angles[0]-.29)<.001);
    assert(Math.abs(sim.state.angles[1]-(Math.PI-.29))<.001);
  }finally{sim.free();}
});
test('sensor da rampa e colisão com bumper confirmam pontos',async()=>{
  const sim=await createPhysics(mesa);
  try{
    sim.place(-.49,-.60,0,-4.6);advance(sim,.12);
    assert(sim.state.score>=120);
    sim.place(-.83,.01,0,-3.1);advance(sim,.15);
    assert.equal(sim.state.phase,'rampa');assert(sim.state.score>=620);
    advance(sim,1.31);assert.equal(sim.state.phase,'jogando');
  }finally{sim.free();}
});
test('três bolas encerram a rodada; modo relax permite outras bolas',async()=>{
  const sim=await createPhysics(mesa);
  try{
    drain(sim);assert.equal(sim.state.ball,2);assert.equal(sim.state.phase,'pronta');
    drain(sim);assert.equal(sim.state.ball,3);drain(sim);assert.equal(sim.state.phase,'fim');
    sim.setRelax(true);for(let i=0;i<5;i++)drain(sim);
    assert.equal(sim.state.ball,6);assert.equal(sim.state.phase,'pronta');
    sim.setRelax(false);assert.equal(sim.state.ball,3);
    sim.reset();assert.deepEqual([sim.state.ball,sim.state.score,sim.state.phase],[1,0,'pronta']);
  }finally{sim.free();}
});
