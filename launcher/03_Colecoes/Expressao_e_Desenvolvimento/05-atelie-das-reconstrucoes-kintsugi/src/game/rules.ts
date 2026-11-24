import { creation, type Atelier, type Creation, type Observation } from './state.ts'
import type { Mode, Vessel } from './content.ts'

type Command =
  | {type:'start'; vessel:Vessel; count:number; mode:Mode}
  | {type:'turn'; id:number; degrees:number}
  | {type:'fit'; id:number; slot:number; distance?:number; angle?:number}
  | {type:'brush'; id:number; layer:'lacquer'|'gold'; section?:number}
  | {type:'observe'; opportunity:number; result:Observation}
  | {type:'undo'|'redo'|'reset'|'review'|'pause'|'resume'|'exit'}

export const full = 255
export function jointAvailable(data: Creation, id: number) {
  const occupants = new Set(data.fragments.flatMap(fragment => fragment.slot === null ? [] : [fragment.slot]))
  return Number.isInteger(id) && id >= 0 && id < data.count && occupants.has(id) && occupants.has((id + 1) % data.count)
}
export function coverage(mask: number) {
  return Array.from({length:8}, (_, i) => (mask >> i) & 1).reduce((a,b) => a+b,0)
}
export const fragmentAngle = (angle: number) => ((angle + 180) % 360 + 360) % 360 - 180

export function dispatch(state: Atelier, command: Command): string {
  if (command.type === 'start') {
    state.mode = command.mode
    state.sceneState = creation(command.vessel, command.count, command.mode === 'alternate')
    state.history = []; state.future = []; state.phase = 'work'
    return 'A bancada está pronta.'
  }
  if (command.type === 'exit') { state.phase = 'exit'; return 'Você saiu da bancada.' }
  if (command.type === 'resume' && (state.phase === 'paused' || state.phase === 'review')) { state.phase = 'work'; return 'Bancada retomada.' }
  if (state.phase !== 'work') return 'Retome a bancada para continuar.'
  if (command.type === 'pause') { state.phase = 'paused'; return 'Bancada em pausa.' }
  if (command.type === 'review') { state.phase = 'review'; return 'Você pode guardar a peça como ela está.' }
  if (command.type === 'undo' || command.type === 'redo') {
    const source = command.type === 'undo' ? state.history : state.future
    const target = command.type === 'undo' ? state.future : state.history
    const next = source.pop()
    if (!next) return 'Não há ações nesse sentido.'
    target.push(state.sceneState)
    state.sceneState = next
    return command.type === 'undo' ? 'Última ação desfeita.' : 'Ação refeita.'
  }
  const data = structuredClone(state.sceneState)
  const save = (result: string, updated = data) => {
    state.history.push(state.sceneState)
    if (state.history.length > 100) state.history.shift()
    state.future = []; state.sceneState = updated
    return result
  }
  if (command.type === 'reset') return save('Peça reiniciada.', creation(data.vessel, data.count, state.mode === 'alternate'))
  if (command.type === 'observe') {
    if (state.mode !== 'facilitated' || !Number.isInteger(command.opportunity) || command.opportunity < 1 || command.opportunity > state.settings.opportunities) return 'Escolha uma oportunidade disponível.'
    data.observations = data.observations.filter(item => item.opportunity !== command.opportunity)
    data.observations.push({opportunity:command.opportunity, result:command.result})
    return save('Observação registrada nesta sessão.')
  }
  if (command.type === 'turn' || command.type === 'fit') {
    const fragment = data.fragments[command.id]
    if (!fragment || fragment.slot !== null) return 'Escolha um fragmento solto.'
    if (command.type === 'turn') {
      if (!Number.isFinite(command.degrees) || fragmentAngle(command.degrees) === 0) return 'O ângulo não mudou.'
      fragment.angle = fragmentAngle(fragment.angle + command.degrees)
      return save('Fragmento girado.')
    }
    const compatible = command.slot === command.id || state.mode === 'alternate'
    if (!compatible || !Number.isInteger(command.slot) || command.slot < 0 || command.slot >= data.count || data.fragments.some(part => part.slot === command.slot)) return 'Essa posição não está disponível para o fragmento.'
    const angle = command.angle ?? fragment.angle
    const distance = command.distance ?? 0
    if (!Number.isFinite(distance) || distance < 0 || distance > .035 + state.settings.tolerance / 600) return 'Aproxime o fragmento da junta.'
    if (!Number.isFinite(angle) || Math.abs(fragmentAngle(angle)) > state.settings.tolerance) return 'Gire o fragmento até alinhar as bordas.'
    fragment.angle = 0
    fragment.slot = command.slot
    return save('Fragmento encaixado.')
  }
  if (command.type === 'brush') {
    if (!jointAvailable(data, command.id)) return 'Encaixe as duas bordas antes de usar esta junta.'
    const joint = data.joints[command.id]
    if (command.layer === 'gold' && joint.lacquer !== full) return 'Cubra a junta com laca antes do pigmento.'
    if (command.section !== undefined && (!Number.isInteger(command.section) || command.section < 0 || command.section > 7)) return 'Trecho de junta inválido.'
    const mask = command.section === undefined ? full : 1 << command.section
    if ((joint[command.layer] & mask) === mask) return 'A área já está coberta.'
    joint[command.layer] |= mask
    return save(command.layer === 'gold' ? 'Pigmento aplicado.' : 'Laca aplicada.')
  }
  return 'Ação indisponível.'
}
