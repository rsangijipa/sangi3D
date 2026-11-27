// Mochila da Travessia — Estado Serializável, Regras de Packing 3D e Comandos Idempotentes

import { ITEMS, ITEM_BY_ID, JOURNEYS, MODES, POCKETS, VERSION } from './content.js';

export function cloneState(obj) {
  return JSON.parse(JSON.stringify(obj));
}

export function getFootprint(item, rotation = 0) {
  const rot = ((rotation % 2) + 2) % 2;
  return rot === 1
    ? { w: item.gridH, h: item.gridW }
    : { w: item.gridW, h: item.gridH };
}

export function createInitialState({ journeyId = 'trilha_manha', modeId = 'livre', seed = 1901 } = {}) {
  const journey = JOURNEYS.find((j) => j.id === journeyId) || JOURNEYS[0];
  const mode = MODES.find((m) => m.id === modeId) || MODES[0];

  const itemsState = {};
  for (const item of ITEMS) {
    const preset = journey.initialPacked[item.id];
    if (preset) {
      itemsState[item.id] = {
        location: 'backpack',
        pocket: preset.pocket,
        col: preset.col,
        row: preset.row,
        rotation: preset.rotation || 0
      };
    } else {
      itemsState[item.id] = {
        location: 'table',
        pocket: null,
        col: 0,
        row: 0,
        rotation: 0
      };
    }
  }

  return {
    version: VERSION,
    seed,
    mode: mode.id,
    phase: 'organizar',
    journeyId: journey.id,
    selectedItemId: 'cantil',
    inspectingItemId: null,
    paused: false,
    flapClosed: false,
    flashlightOn: true,
    settings: {
      strictPhysics: mode.strictPhysics,
      maxMassKg: mode.maxMassKg,
      quality: 'equilibrada',
      audioEnabled: false,
      masterVolume: 0.6,
      reducedMotion: false,
      includeSymbolicMass: false,
      accompaniedOpportunities: 3,
      accompaniedInstruction: 'visual_textual',
      hudCollapsed: false
    },
    sceneState: {
      items: itemsState,
      cameraPreset: 'mesa',
      selectedCardId: 'montanha',
      voluntaryCardNote: ''
    },
    history: {
      past: [],
      future: []
    },
    observations: []
  };
}

export function buildOccupancyGrid(state, pocketId, excludeItemId = null) {
  const pocket = POCKETS[pocketId];
  const grid = Array.from({ length: pocket.rows }, () => Array(pocket.cols).fill(null));
  for (const [id, placement] of Object.entries(state.sceneState.items)) {
    if (id === excludeItemId) continue;
    if (placement.location !== 'backpack' || placement.pocket !== pocketId) continue;
    const item = ITEM_BY_ID[id];
    if (!item) continue;
    const { w, h } = getFootprint(item, placement.rotation);
    for (let r = placement.row; r < placement.row + h; r++) {
      for (let c = placement.col; c < placement.col + w; c++) {
        if (r >= 0 && r < pocket.rows && c >= 0 && c < pocket.cols) {
          grid[r][c] = id;
        }
      }
    }
  }
  return grid;
}

export function canPlaceItem(state, itemId, pocketId, col, row, rotation = 0) {
  const item = ITEM_BY_ID[itemId];
  const pocket = POCKETS[pocketId];
  if (!item || !pocket) return { ok: false, reason: 'Objeto ou bolso inválido.' };
  if (!item.allowedPockets.includes(pocketId)) {
    return { ok: false, reason: `${item.name} não cabe no ${pocket.name}.` };
  }

  const { w, h } = getFootprint(item, rotation);
  if (col < 0 || row < 0 || col + w > pocket.cols || row + h > pocket.rows) {
    return { ok: false, reason: 'Fora dos limites internos do compartimento.' };
  }

  if (state.settings.strictPhysics) {
    const grid = buildOccupancyGrid(state, pocketId, itemId);
    for (let r = row; r < row + h; r++) {
      for (let c = col; c < col + w; c++) {
        if (grid[r][c] !== null) {
          const blocker = ITEM_BY_ID[grid[r][c]];
          return {
            ok: false,
            reason: `Espaço ocupado por ${blocker ? blocker.name : 'outro objeto'}.`
          };
        }
      }
    }
  }

  // Optional max mass check (only for physical mass; symbolic items never add emotional weight)
  if (state.settings.strictPhysics && state.settings.maxMassKg !== null) {
    const currentMetrics = computeMetrics(state);
    const alreadyPacked = state.sceneState.items[itemId]?.location === 'backpack';
    const itemMass = getEffectivePhysicalMass(item, state.settings.includeSymbolicMass);
    const nextMass = alreadyPacked ? currentMetrics.physicalMassKg : currentMetrics.physicalMassKg + itemMass;
    if (nextMass > state.settings.maxMassKg + 0.001) {
      return {
        ok: false,
        reason: `Ultrapassa o limite configurado de ${state.settings.maxMassKg.toFixed(1)} kg.`
      };
    }
  }

  return { ok: true, reason: null };
}

export function findFirstValidSlot(state, itemId, preferredPocketId = null) {
  const item = ITEM_BY_ID[itemId];
  if (!item) return null;
  const pocketsToTry = preferredPocketId && item.allowedPockets.includes(preferredPocketId)
    ? [preferredPocketId, ...item.allowedPockets.filter((p) => p !== preferredPocketId)]
    : item.allowedPockets;

  for (const pocketId of pocketsToTry) {
    const pocket = POCKETS[pocketId];
    for (const rot of [0, 1]) {
      for (let r = 0; r < pocket.rows; r++) {
        for (let c = 0; c < pocket.cols; c++) {
          if (canPlaceItem(state, itemId, pocketId, c, r, rot).ok) {
            return { pocket: pocketId, col: c, row: r, rotation: rot };
          }
        }
      }
    }
  }
  return null;
}

export function getEffectivePhysicalMass(item, includeSymbolicMass = false) {
  if (item.symbolic) {
    return includeSymbolicMass ? (item.physicalReferenceKg || 0) : 0;
  }
  return item.massKg;
}

export function computeMetrics(state) {
  let totalCells = POCKETS.principal.cols * POCKETS.principal.rows + POCKETS.frontal.cols * POCKETS.frontal.rows;
  let occupiedCells = 0;
  let physicalMassKg = 0;
  let packedCount = 0;
  let tableCount = 0;
  let symbolicPackedCount = 0;
  let symbolicTableCount = 0;

  let weightedX = 0;
  let weightedY = 0;
  let totalWeightForCom = 0;

  for (const item of ITEMS) {
    const st = state.sceneState.items[item.id];
    if (!st) continue;
    if (st.location === 'backpack') {
      packedCount++;
      if (item.symbolic) symbolicPackedCount++;
      const { w, h } = getFootprint(item, st.rotation);
      occupiedCells += w * h;
      const m = getEffectivePhysicalMass(item, state.settings.includeSymbolicMass);
      physicalMassKg += m;

      const pocket = POCKETS[st.pocket];
      if (pocket && m > 0) {
        const cx = ((st.col + w / 2) / pocket.cols) * 2 - 1; // -1 left .. +1 right
        const cy = ((st.row + h / 2) / pocket.rows) * 2 - 1; // -1 top .. +1 bottom
        weightedX += cx * m;
        weightedY += cy * m;
        totalWeightForCom += m;
      }
    } else {
      tableCount++;
      if (item.symbolic) symbolicTableCount++;
    }
  }

  const comX = totalWeightForCom > 0 ? weightedX / totalWeightForCom : 0;
  const comY = totalWeightForCom > 0 ? weightedY / totalWeightForCom : 0;

  let balanceLabel = 'Equilibrada';
  if (totalWeightForCom === 0) {
    balanceLabel = 'Sem carga física';
  } else if (Math.abs(comX) > 0.35) {
    balanceLabel = comX < 0 ? 'Mais peso à esquerda' : 'Mais peso à direita';
  } else if (Math.abs(comY) > 0.38) {
    balanceLabel = comY < 0 ? 'Mais peso no topo' : 'Mais peso na base';
  }

  const volumePct = Math.min(100, Math.round((occupiedCells / totalCells) * 100));

  return {
    occupiedCells,
    totalCells,
    volumePct,
    physicalMassKg: Number(physicalMassKg.toFixed(2)),
    packedCount,
    tableCount,
    symbolicPackedCount,
    symbolicTableCount,
    comX: Number(comX.toFixed(3)),
    comY: Number(comY.toFixed(3)),
    balanceLabel
  };
}

function pushUndoSnapshot(state) {
  const snap = cloneState(state.sceneState);
  state.history.past.push(snap);
  if (state.history.past.length > 40) state.history.past.shift();
  state.history.future = [];
}

export function applyCommand(state, cmd) {
  const next = cloneState(state);
  let feedback = { ok: true, message: '' };

  switch (cmd.type) {
    case 'SELECT_ITEM': {
      if (cmd.itemId && !ITEM_BY_ID[cmd.itemId]) {
        return { state, feedback: { ok: false, message: 'Objeto não encontrado.' } };
      }
      next.selectedItemId = cmd.itemId || null;
      feedback.message = cmd.itemId ? `${ITEM_BY_ID[cmd.itemId].name} selecionado.` : 'Seleção limpa.';
      break;
    }

    case 'INSPECT_ITEM': {
      const target = cmd.itemId || next.selectedItemId;
      if (target && !ITEM_BY_ID[target]) {
        return { state, feedback: { ok: false, message: 'Objeto inválido para inspeção.' } };
      }
      next.inspectingItemId = next.inspectingItemId === target ? null : target;
      if (target) next.selectedItemId = target;
      feedback.message = next.inspectingItemId
        ? `Inspecionando ${ITEM_BY_ID[next.inspectingItemId].name}.`
        : 'Inspeção encerrada.';
      break;
    }

    case 'PLACE_ITEM': {
      const { itemId, pocket, col, row, rotation = 0 } = cmd;
      const check = canPlaceItem(next, itemId, pocket, col, row, rotation);
      if (!check.ok) {
        return { state, feedback: { ok: false, message: check.reason } };
      }
      pushUndoSnapshot(next);
      next.sceneState.items[itemId] = {
        location: 'backpack',
        pocket,
        col,
        row,
        rotation: ((rotation % 2) + 2) % 2
      };
      next.selectedItemId = itemId;
      next.flapClosed = false;
      feedback.message = `${ITEM_BY_ID[itemId].name} acomodado no ${POCKETS[pocket].name}.`;
      break;
    }

    case 'AUTO_PACK_ITEM': {
      const itemId = cmd.itemId || next.selectedItemId;
      const slot = findFirstValidSlot(next, itemId, cmd.preferredPocket || null);
      if (!slot) {
        return {
          state,
          feedback: { ok: false, message: 'Não há espaço livre com as restrições atuais. Gire ou reorganize outro item.' }
        };
      }
      return applyCommand(next, {
        type: 'PLACE_ITEM',
        itemId,
        pocket: slot.pocket,
        col: slot.col,
        row: slot.row,
        rotation: slot.rotation
      });
    }

    case 'REMOVE_TO_TABLE': {
      const itemId = cmd.itemId || next.selectedItemId;
      if (!ITEM_BY_ID[itemId]) return { state, feedback: { ok: false, message: 'Objeto inválido.' } };
      if (next.sceneState.items[itemId].location === 'table') {
        return { state, feedback: { ok: true, message: `${ITEM_BY_ID[itemId].name} já está sobre a mesa.` } };
      }
      pushUndoSnapshot(next);
      next.sceneState.items[itemId] = {
        location: 'table',
        pocket: null,
        col: 0,
        row: 0,
        rotation: 0
      };
      next.flapClosed = false;
      feedback.message = `${ITEM_BY_ID[itemId].name} voltou para a mesa.`;
      break;
    }

    case 'ROTATE_ITEM': {
      const itemId = cmd.itemId || next.selectedItemId;
      const item = ITEM_BY_ID[itemId];
      if (!item) return { state, feedback: { ok: false, message: 'Selecione um objeto para girar.' } };
      const cur = next.sceneState.items[itemId];
      const nextRot = (cur.rotation + 1) % 2;
      if (cur.location === 'table') {
        pushUndoSnapshot(next);
        cur.rotation = nextRot;
        feedback.message = `${item.name} girado 90° sobre a mesa.`;
      } else {
        const check = canPlaceItem(next, itemId, cur.pocket, cur.col, cur.row, nextRot);
        if (check.ok) {
          pushUndoSnapshot(next);
          cur.rotation = nextRot;
          feedback.message = `${item.name} girado 90° no compartimento.`;
        } else {
          // Try finding a nearby valid cell in the same pocket with rotated orientation
          const pocket = POCKETS[cur.pocket];
          let placed = false;
          for (let r = 0; r < pocket.rows && !placed; r++) {
            for (let c = 0; c < pocket.cols && !placed; c++) {
              if (canPlaceItem(next, itemId, cur.pocket, c, r, nextRot).ok) {
                pushUndoSnapshot(next);
                cur.col = c;
                cur.row = r;
                cur.rotation = nextRot;
                placed = true;
              }
            }
          }
          if (!placed) {
            return { state, feedback: { ok: false, message: `Não foi possível girar ${item.name} neste espaço.` } };
          }
          feedback.message = `${item.name} girado e reacomodado no ${pocket.name}.`;
        }
      }
      break;
    }

    case 'MOVE_POCKET': {
      const itemId = cmd.itemId || next.selectedItemId;
      const item = ITEM_BY_ID[itemId];
      if (!item) return { state, feedback: { ok: false, message: 'Selecione um objeto.' } };
      const cur = next.sceneState.items[itemId];
      const targetPocket = cmd.targetPocket || (cur.pocket === 'principal' ? 'frontal' : 'principal');
      if (!item.allowedPockets.includes(targetPocket)) {
        return { state, feedback: { ok: false, message: `${item.name} só pode ir no Compartimento Principal.` } };
      }
      const slot = findFirstValidSlot(next, itemId, targetPocket);
      if (!slot || slot.pocket !== targetPocket) {
        return { state, feedback: { ok: false, message: `Sem espaço livre no ${POCKETS[targetPocket].name}.` } };
      }
      return applyCommand(next, {
        type: 'PLACE_ITEM',
        itemId,
        pocket: targetPocket,
        col: slot.col,
        row: slot.row,
        rotation: slot.rotation
      });
    }

    case 'SELECT_JOURNEY': {
      const fresh = createInitialState({
        journeyId: cmd.journeyId,
        modeId: next.mode,
        seed: next.seed
      });
      fresh.settings = cloneState(next.settings);
      fresh.observations = cloneState(next.observations);
      const j = JOURNEYS.find((x) => x.id === fresh.journeyId);
      return {
        state: fresh,
        feedback: { ok: true, message: `Viagem selecionada: ${j ? j.name : fresh.journeyId}.` }
      };
    }

    case 'SET_MODE': {
      const mode = MODES.find((m) => m.id === cmd.modeId);
      if (!mode) return { state, feedback: { ok: false, message: 'Modo desconhecido.' } };
      next.mode = mode.id;
      next.settings.strictPhysics = mode.strictPhysics;
      next.settings.maxMassKg = mode.maxMassKg;
      feedback.message = `Modo alterado para ${mode.label}.`;
      break;
    }

    case 'SET_PHASE': {
      next.phase = cmd.phase;
      next.flapClosed = cmd.phase === 'seguir';
      if (cmd.phase !== 'organizar') next.inspectingItemId = null;
      feedback.message = `Etapa: ${cmd.phase}.`;
      break;
    }

    case 'SET_SETTINGS': {
      next.settings = { ...next.settings, ...cmd.patch };
      feedback.message = 'Configurações atualizadas.';
      break;
    }

    case 'TOGGLE_FLASHLIGHT': {
      next.flashlightOn = !next.flashlightOn;
      feedback.message = next.flashlightOn ? 'Lanterna acesa.' : 'Lanterna apagada.';
      break;
    }

    case 'SET_CAMERA': {
      next.sceneState.cameraPreset = cmd.presetId;
      feedback.message = `Câmera ajustada.`;
      break;
    }

    case 'SET_PAUSE': {
      next.paused = Boolean(cmd.paused);
      feedback.message = next.paused ? 'Experiência pausada.' : 'Experiência retomada.';
      break;
    }

    case 'SET_CARD_CHOICE': {
      if (cmd.cardId) next.sceneState.selectedCardId = cmd.cardId;
      if (typeof cmd.note === 'string') next.sceneState.voluntaryCardNote = cmd.note.slice(0, 140);
      feedback.message = 'Cartão simbólico atualizado.';
      break;
    }

    case 'RECORD_OBSERVATION': {
      // Only observables — never psychological inference or scoring
      const allowedStatus = ['independente', 'com_ajuda', 'nao_realizada', 'recusada'];
      if (!allowedStatus.includes(cmd.status)) {
        return { state, feedback: { ok: false, message: 'Status observável inválido.' } };
      }
      next.observations.push({
        id: `obs_${Date.now()}_${next.observations.length + 1}`,
        timestamp: new Date().toISOString(),
        action: String(cmd.action || 'Ação observada').slice(0, 80),
        status: cmd.status,
        note: String(cmd.note || '').slice(0, 160)
      });
      feedback.message = 'Registro observável adicionado.';
      break;
    }

    case 'UNDO': {
      if (next.history.past.length === 0) {
        return { state, feedback: { ok: false, message: 'Nada para desfazer.' } };
      }
      const prev = next.history.past.pop();
      next.history.future.push(cloneState(next.sceneState));
      next.sceneState = prev;
      next.flapClosed = false;
      feedback.message = 'Última ação desfeita.';
      break;
    }

    case 'REDO': {
      if (next.history.future.length === 0) {
        return { state, feedback: { ok: false, message: 'Nada para refazer.' } };
      }
      const restored = next.history.future.pop();
      next.history.past.push(cloneState(next.sceneState));
      next.sceneState = restored;
      feedback.message = 'Ação refeita.';
      break;
    }

    case 'RESET': {
      const fresh = createInitialState({
        journeyId: next.journeyId,
        modeId: next.mode,
        seed: next.seed
      });
      fresh.settings = cloneState(next.settings);
      return {
        state: fresh,
        feedback: { ok: true, message: 'Mesa e mochila restauradas ao estado inicial.' }
      };
    }

    default:
      return { state, feedback: { ok: false, message: `Comando desconhecido: ${cmd.type}` } };
  }

  return { state: next, feedback };
}

export function buildObservableSummary(state, { includeVoluntaryNote = false, includeObservations = true } = {}) {
  const metrics = computeMetrics(state);
  const packed = [];
  const onTable = [];
  for (const item of ITEMS) {
    const st = state.sceneState.items[item.id];
    const entry = {
      id: item.id,
      nome: item.name,
      categoria: item.symbolic ? 'simbolico' : 'pratico',
      bolso: st.location === 'backpack' ? st.pocket : 'mesa'
    };
    if (st.location === 'backpack') packed.push(entry);
    else onTable.push(entry);
  }

  const summary = {
    schemaVersion: VERSION,
    app: 'mochila-da-travessia',
    mode: state.mode,
    journeyId: state.journeyId,
    phase: state.phase,
    disclaimer: 'Resumo descritivo de escolhas observáveis. Não constitui avaliação clínica ou pontuação subjetiva.',
    metricasFisicas: {
      volumeOcupadoPct: metrics.volumePct,
      massaFisicaKg: metrics.physicalMassKg,
      equilibrioCentroMassa: metrics.balanceLabel,
      objetosSimbolicosNaMochila: metrics.symbolicPackedCount,
      objetosSimbolicosNaMesa: metrics.symbolicTableCount
    },
    naMochila: packed,
    naMesa: onTable
  };

  if (includeVoluntaryNote && state.sceneState.voluntaryCardNote.trim()) {
    summary.anotacaoVoluntaria = state.sceneState.voluntaryCardNote.trim();
  }
  if (includeObservations && state.observations.length > 0) {
    summary.observaveis = state.observations;
  }
  return summary;
}
