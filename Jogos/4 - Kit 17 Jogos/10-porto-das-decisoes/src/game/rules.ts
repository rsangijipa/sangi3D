/**
 * Porto das Decisões — Regras Náuticas, Validação de Grafo e Simulação Preditiva
 * Módulo puro em TypeScript sem dependências Three.js para garantir testabilidade 100%
 */

import { BoatConfig, CargoItem, SimulationResult } from './state';
import { HARBOR_EDGES, MissionDefinition, getNodeById } from './content';

export function isEdgeConnected(nodeA: string, nodeB: string): boolean {
  if (nodeA === nodeB) return true;
  return HARBOR_EDGES.some(
    e => (e.from === nodeA && e.to === nodeB) || (e.from === nodeB && e.to === nodeA)
  );
}

export function getEdgeLength(nodeA: string, nodeB: string): number {
  if (nodeA === nodeB) return 0;
  const edge = HARBOR_EDGES.find(
    e => (e.from === nodeA && e.to === nodeB) || (e.from === nodeB && e.to === nodeA)
  );
  if (edge) return edge.length;
  // Fallback: distância euclidiana direta
  const a = getNodeById(nodeA);
  const b = getNodeById(nodeB);
  if (!a || !b) return 1.0;
  const dx = a.pos[0] - b.pos[0];
  const dz = a.pos[2] - b.pos[2];
  return Math.sqrt(dx * dx + dz * dz);
}

export function getAdjacentNodes(nodeId: string): string[] {
  const neighbors: string[] = [];
  for (const edge of HARBOR_EDGES) {
    if (edge.from === nodeId && !neighbors.includes(edge.to)) {
      neighbors.push(edge.to);
    } else if (edge.to === nodeId && !neighbors.includes(edge.from)) {
      neighbors.push(edge.from);
    }
  }
  return neighbors;
}

export function calculateRouteDistance(route: string[]): number {
  if (route.length < 2) return 0;
  let total = 0;
  for (let i = 0; i < route.length - 1; i++) {
    total += getEdgeLength(route[i], route[i + 1]);
  }
  return Number(total.toFixed(2));
}

/**
 * Valida a rota quanto a adjacência e conectividade
 */
export function validateAdjacency(route: string[]): { valid: boolean; brokenAtIndex?: number; errorMsg?: string } {
  if (route.length <= 1) {
    return { valid: true };
  }
  for (let i = 0; i < route.length - 1; i++) {
    const from = route[i];
    const to = route[i + 1];
    if (!isEdgeConnected(from, to)) {
      const fromNode = getNodeById(from)?.name || from;
      const toNode = getNodeById(to)?.name || to;
      return {
        valid: false,
        brokenAtIndex: i,
        errorMsg: `Não há canal navegável direto entre ${fromNode} e ${toNode}. Use as boias intermediárias.`
      };
    }
  }
  return { valid: true };
}

/**
 * Simula a viagem em uma cópia determinística do estado sem alterar o estado confirmado.
 */
export function simulateVoyage(
  route: string[],
  cargoOnboard: CargoItem[],
  boat: BoatConfig,
  mission: MissionDefinition
): SimulationResult {
  const adjCheck = validateAdjacency(route);
  if (!adjCheck.valid) {
    return {
      valid: false,
      canExecute: false,
      totalDistance: calculateRouteDistance(route),
      estimatedTimeSec: 0,
      unvisitedDestinations: mission.requiredDestinations,
      capacityExceeded: cargoOnboard.length > boat.capacity,
      excessCratesCount: Math.max(0, cargoOnboard.length - boat.capacity),
      deliveries: [],
      explanation: adjCheck.errorMsg || 'A rota contém nós desconectados.',
      alternativeRoutePossible: false
    };
  }

  // 1. Checagem de capacidade do barco
  const capacityExceeded = cargoOnboard.length > boat.capacity;
  const excessCratesCount = Math.max(0, cargoOnboard.length - boat.capacity);

  // 2. Simular entregas passo a passo
  const remainingCargo = [...cargoOnboard];
  const deliveries: Array<{ nodeId: string; nodeName: string; unloadedCargo: CargoItem[] }> = [];
  const visitedDestinations = new Set<string>();

  for (const nodeId of route) {
    visitedDestinations.add(nodeId);
    const nodeObj = getNodeById(nodeId);
    if (!nodeObj || !nodeObj.dock) continue;

    // Descarregar caixas destinadas a este cais
    const matching = remainingCargo.filter(c => c.destinationNodeId === nodeId);
    if (matching.length > 0) {
      deliveries.push({
        nodeId,
        nodeName: nodeObj.name,
        unloadedCargo: matching
      });
      // Remover do barco simulado
      for (const m of matching) {
        const idx = remainingCargo.findIndex(c => c.id === m.id);
        if (idx !== -1) remainingCargo.splice(idx, 1);
      }
    }
  }

  // 3. Destinos requeridos não visitados
  const unvisitedDestinations = mission.requiredDestinations.filter(d => !visitedDestinations.has(d));

  // 4. Distância e tempo estimado
  const totalDistance = calculateRouteDistance(route);
  const estimatedTimeSec = totalDistance > 0 ? Number((totalDistance / (boat.speed * 0.45)).toFixed(1)) : 0;

  // 5. Verificar se há rota alternativa válida disponível
  const altRoute = findAlternativeValidRoute(route, mission.requiredDestinations);

  // 6. Formular explicações compreensivas sem bloquear
  let valid = true;
  let canExecute = true;
  let explanation = '';

  if (capacityExceeded) {
    valid = false;
    canExecute = false;
    explanation = `O ${boat.name} comporta ${boat.capacity} caixas, mas há ${cargoOnboard.length} caixas a bordo (${excessCratesCount} em excesso). Ajuste a carga ou escolha um barco maior.`;
  } else if (route.length < 2) {
    valid = false;
    canExecute = false;
    explanation = 'A rota precisa de pelo menos uma boia ou cais de destino além do porto de partida.';
  } else if (unvisitedDestinations.length > 0) {
    const unvisitedNames = unvisitedDestinations.map(id => getNodeById(id)?.name || id).join(', ');
    valid = false;
    canExecute = false;
    explanation = `A rota ainda não visita os seguintes cais necessários: ${unvisitedNames}. Adicione os nós correspondentes.`;
  } else if (cargoOnboard.length < mission.targetBoxes) {
    // Aviso brando
    explanation = `Aviso: Foram carregadas ${cargoOnboard.length} de ${mission.targetBoxes} caixas sugeridas. A viagem pode partir, mas algumas encomendas ficarão no porto.`;
  } else {
    explanation = `Rota excelente! Distância: ${totalDistance} m | Tempo aprox: ${estimatedTimeSec} s | Entregas completas nos cais previstos.`;
  }

  return {
    valid,
    canExecute,
    totalDistance,
    estimatedTimeSec,
    unvisitedDestinations,
    capacityExceeded,
    excessCratesCount,
    deliveries,
    explanation,
    alternativeRoutePossible: altRoute.length > 0,
    alternativeRoutePath: altRoute.length > 0 ? altRoute : undefined
  };
}

/**
 * Encontra uma rota alternativa válida que visite os destinos exigidos partindo de 'node_harbor'
 */
export function findAlternativeValidRoute(currentRoute: string[], requiredDocks: string[]): string[] {
  const currentKey = currentRoute.join('->');
  const maxDepth = 8;
  const validRoutes: string[][] = [];
  const lastNodeMustBeHarbor = requiredDocks.includes('node_harbor');

  function dfs(curr: string, path: string[], visited: Set<string>) {
    if (path.length > maxDepth) return;
    
    // Verificar se todos os requiredDocks foram visitados e se retornou ao porto caso exigido
    const returnedToHarborIfRequired = !lastNodeMustBeHarbor || (path.length > 1 && curr === 'node_harbor');
    const allVisited = requiredDocks.every(d => 
      d === 'node_harbor' ? (path.length > 1 && curr === 'node_harbor') : path.includes(d)
    );

    if (allVisited && returnedToHarborIfRequired && path.length >= 2) {
      const key = path.join('->');
      if (key !== currentKey) {
        validRoutes.push([...path]);
        return; // achamos uma
      }
    }

    const neighbors = getAdjacentNodes(curr);
    for (const next of neighbors) {
      // Evitar loops imediatos
      if (path.length >= 2 && path[path.length - 2] === next) continue;
      // Limitar repetições do mesmo nó
      const count = path.filter(p => p === next).length;
      if (count >= 2) continue;

      path.push(next);
      dfs(next, path, visited);
      path.pop();

      if (validRoutes.length > 0) return;
    }
  }

  dfs('node_harbor', ['node_harbor'], new Set(['node_harbor']));
  return validRoutes[0] || [];
}
