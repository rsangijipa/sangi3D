import test from 'node:test';
import assert from 'node:assert/strict';
import { initial, reducer } from '../game/state.ts';
import { readEntries } from '../game/rules.ts';

test('seed, exemplo e semântica de lado são repetíveis',()=>{
  assert.deepEqual(initial(901),initial(901));
  const demo=reducer(initial(901),{type:'demo'});
  assert.equal(demo.seed,901);
  assert.equal(demo.phase,'sensation');
  assert.deepEqual(demo.draft.regionIds,['foreL']);
  assert.deepEqual(demo.draft.sensationIds,['waves']);
});

test('vários pontos e edição sem perder um ponto anterior',()=>{
  let state=reducer(initial(),{type:'start',fictional:false});
  for(const id of ['foreL','head'] as const)state=reducer(state,{type:'region',id});
  state=reducer(state,{type:'next'});
  state=reducer(state,{type:'sensation',id:'cold'});
  state=reducer(state,{type:'word',word:'  ar  '});
  state=reducer(state,{type:'next'});
  state=reducer(state,{type:'intensity',value:0});
  state=reducer(state,{type:'another'});
  assert.deepEqual(state.entries,[{regionIds:['foreL','head'],sensationIds:['cold'],customWord:'ar',intensity:0}]);
  state=reducer(state,{type:'region',id:'footL'});
  state=reducer(state,{type:'next'});
  state=reducer(state,{type:'skip'});
  state=reducer(state,{type:'next'});
  state=reducer(state,{type:'edit',index:0});
  state=reducer(state,{type:'region',id:'unknown'});
  assert.deepEqual(state.draft.regionIds,['unknown']);
  state=reducer(state,{type:'cancelEdit'});
  assert.deepEqual(state.entries[0].regionIds,['foreL','head']);
  assert.deepEqual(state.entries[1].regionIds,['footL']);
});

test('pular limpa só a etapa, intensidade inválida não altera estado',()=>{
  let state=reducer(initial(),{type:'demo'});
  state=reducer(state,{type:'skip'});
  assert.deepEqual(state.draft.sensationIds,[]);
  assert.deepEqual(state.draft.regionIds,['foreL']);
  assert.equal(reducer(state,{type:'intensity',value:-1 as never}),state);
  assert.equal(reducer(state,{type:'intensity',value:5 as never}),state);
  state=reducer(state,{type:'intensity',value:4});
  state=reducer(state,{type:'skip'});
  assert.equal(state.entries[0].intensity,null);
  assert.equal(state.phase,'review');
});

test('pausa bloqueia escolhas e reset e saída limpam dados',()=>{
  let state=reducer(initial(71),{type:'demo'});
  state=reducer(state,{type:'pause',value:true});
  assert.equal(reducer(state,{type:'sensation',id:'heat'}),state);
  assert.deepEqual(reducer(state,{type:'reset'}),initial(71));
  state=reducer(state,{type:'exit'});
  assert.deepEqual(state,{...initial(71),phase:'done',exited:true});
});

test('registros antigos passam por validação de regiões, sensações e limite de texto',()=>{
  const row=readEntries([{regionIds:['__proto__','legL','legL',{toString:null}],sensationIds:['heat','bad'],customWord:'x'.repeat(100),intensity:9}])[0];
  assert.deepEqual(row.regionIds,['legL']);
  assert.deepEqual(row.sensationIds,['heat']);
  assert.equal(row.intensity,null);
  assert.equal(row.customWord.length,80);
  assert.deepEqual(readEntries([null,false,{regionIds:[],sensationIds:[]}]),[]);
});
