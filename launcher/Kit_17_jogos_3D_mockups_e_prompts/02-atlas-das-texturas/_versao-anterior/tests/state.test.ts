import {test} from 'node:test';
import assert from 'node:assert/strict';
import {initial,reduce} from '../game/state.ts';
import {random} from '../game/rules.ts';
test('progressão, pausa, pulo e reset',()=>{
 const start=reduce(initial(7),{type:'start',mode:'guiado',pool:[]});
 let s=reduce(start,{type:'skip'});assert.equal(s.stage,1);assert.equal(s.skips,1);
 s=reduce(s,{type:'pause'});assert.equal(reduce(s,{type:'skip'}),s);
 s=reduce(s,{type:'resume'});assert.equal(s.pauses,1);
 assert.deepEqual(reduce(s,{type:'reset'}),initial(7));
});
test('limites de luz, ampliação e posição',()=>{
 let s=reduce(initial(),{type:'light',value:100});assert.equal(s.lampAngle,75);
 s=reduce(s,{type:'elevation',value:-1});assert.equal(s.lampElevation,15);
 s=reduce(s,{type:'zoom',value:9});assert.equal(s.zoom,3);
 s=reduce(s,{type:'move',x:-4,z:3});assert.deepEqual(s.magnifierPos,[-.75,.5]);
});
test('atlas atualiza sem duplicar e permite retirar',()=>{
 let s=reduce(initial(),{type:'save'});s=reduce(s,{type:'describe',value:'rugoso'});
 s=reduce(s,{type:'prefer',value:'gostei'});s=reduce(s,{type:'save'});
 assert.deepEqual(s.collection,[{id:'cork',descriptors:['rugoso'],preference:'gostei'}]);
 assert.equal(reduce(s,{type:'remove',id:'cork'}).collection.length,0);
});
test('modo acompanhado e sorteio repetível',()=>{
 const s=initial();assert.equal(reduce(s,{type:'start',mode:'acompanhado',pool:['cork','cork']}),s);
 assert.deepEqual(reduce(s,{type:'start',mode:'acompanhado',pool:['wool','wood']}).pair,['wool','wood']);
 const a=random(33),b=random(33);assert.deepEqual([a(),a(),a()],[b(),b(),b()]);
});
