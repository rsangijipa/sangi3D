import assert from 'node:assert/strict'
import { test } from 'node:test'
import { coverage, dispatch, jointAvailable } from '../src/game/rules.ts'
import { initial } from '../src/game/state.ts'

const start = (mode='free', vessel='bowl', count=5) => {
  const state=initial(true)
  dispatch(state,{type:'start',vessel,count,mode})
  return state
}

test('encaixe valida distância, ângulo, compatibilidade, ocupação e pausa', () => {
  const state=start()
  const fit=(properties={})=>dispatch(state,{type:'fit',id:2,slot:2,...properties})
  assert.match(fit(),/alinhar/)
  assert.match(fit({angle:0,distance:.3}),/Aproxime/)
  assert.match(fit({angle:0,slot:4}),/disponível/)
  assert.match(fit({angle:NaN}),/alinhar/)
  dispatch(state,{type:'pause'})
  assert.match(fit({angle:0}),/Retome/)
  dispatch(state,{type:'resume'})
  assert.equal(fit({angle:0}),'Fragmento encaixado.')
  assert.equal(state.sceneState.fragments[2].slot,2)
  assert.match(fit(),/solto/)
})

test('laca e pigmento são independentes por junta e só registram mudança', () => {
  const state=start()
  assert.equal(jointAvailable(state.sceneState,0),true)
  assert.equal(jointAvailable(state.sceneState,1),false)
  const brush=(layer,id=0,section)=>dispatch(state,{type:'brush',id,layer,section})
  assert.match(brush('gold'),/antes/)
  assert.match(brush('lacquer',1),/duas bordas/)
  assert.match(brush('lacquer',0,8),/inválido/)
  brush('lacquer',0,3)
  assert.equal(coverage(state.sceneState.joints[0].lacquer),1)
  const history=state.history.length
  brush('lacquer',0,3)
  assert.equal(state.history.length,history)
  brush('lacquer');brush('gold',0,7)
  assert.equal(coverage(state.sceneState.joints[0].gold),1)
  dispatch(state,{type:'undo'})
  assert.equal(state.sceneState.joints[0].gold,0)
  dispatch(state,{type:'redo'})
  assert.equal(state.sceneState.joints[0].gold,128)
})

test('revisão parcial, reset e refazer preservam montagem real', () => {
  const state=start()
  dispatch(state,{type:'fit',id:2,slot:2,angle:0})
  dispatch(state,{type:'review'})
  assert.equal(state.phase,'review')
  assert.equal(state.sceneState.fragments.filter(part=>part.slot!==null).length,3)
  dispatch(state,{type:'resume'})
  dispatch(state,{type:'reset'})
  assert.equal(state.sceneState.fragments[2].slot,null)
  dispatch(state,{type:'undo'})
  assert.equal(state.sceneState.fragments[2].slot,2)
  dispatch(state,{type:'redo'})
  assert.equal(state.sceneState.fragments[2].slot,null)
})

test('composição alternativa usa posições vagas e configurações distintas', () => {
  const state=start('alternate','vase',20)
  assert.equal(state.sceneState.count,7)
  assert.match(dispatch(state,{type:'fit',id:2,slot:0}),/disponível/)
  assert.match(dispatch(state,{type:'fit',id:2,slot:6}),/encaixado/)
  assert.equal(state.sceneState.fragments[2].slot,6)
  dispatch(state,{type:'start',mode:'guided',vessel:'plate',count:2})
  assert.equal(state.sceneState.vessel,'plate')
  assert.equal(state.sceneState.count,3)
  assert.equal(state.history.length,0)
})

test('modo acompanhado valida e atualiza a oportunidade sem nota subjetiva', () => {
  const state=start('facilitated')
  dispatch(state,{type:'observe',opportunity:4,result:'Recusada'})
  assert.equal(state.sceneState.observations.length,0)
  dispatch(state,{type:'observe',opportunity:1,result:'Independente'})
  dispatch(state,{type:'observe',opportunity:1,result:'Recusada'})
  assert.deepEqual(state.sceneState.observations,[{opportunity:1,result:'Recusada'}])
})
