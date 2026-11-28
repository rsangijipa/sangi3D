/**
 * Motor de ecossistema microscópico dinâmico para Universo de uma Gota 2.0.
 * Suporta populações dinâmicas com IDs estáveis, grade espacial O(n),
 * física de baixo Reynolds, predação, alimentação multi-tipo, reprodução gradual
 * e respostas ambientais simplificadas.
 */

import {ORGANISMS} from './organisms/organism-registry.js';
import {SAMPLES} from './sample-registry.js';
import {createFluidField} from './fluid-field.js';

export const SLIDE_RADIUS = 12.5;
export const Z_LIMIT = 3.2;
export const FIXED_STEP = 1 / 60;

export function createPRNG(seed) {
  let value = seed >>> 0;
  return () => {
    value = (Math.imul(1664525, value) + 1013904223) >>> 0;
    return value / 4294967296;
  };
}

function shortestAngleDiff(from, to) {
  return Math.atan2(Math.sin(to - from), Math.cos(to - from));
}

export function createEcosystemSimulation(options = {}) {
  const sample = SAMPLES[options.sampleId] || SAMPLES.lago;
  const seed = options.seed ?? sample.seed ?? 29611;
  const random = createPRNG(seed);
  const fluid = createFluidField(SLIDE_RADIUS, 16);

  const env = {...sample.env, ...(options.env || {})};
  const initialEnv = {...env};
  let maxAgents = options.maxAgents ?? 60;
  let reproductionEnabled = options.reproductionEnabled ?? true;
  let nextNumericId = 1;
  let time = 0;
  let historyTimer = 0;

  const agents = [];
  const food = [];
  const history = []; // [{time, population, avgEnergy, activity, nutrients}]
  const fluidVel = {x: 0, y: 0, z: 0};

  // Grade espacial para consultas O(n)
  const gridCells = 12;
  const gridSpan = (SLIDE_RADIUS * 2) / gridCells;
  const buckets = Array.from({length: gridCells * gridCells}, () => []);

  function makeChain(x, y, z, angle, count, spacing) {
    const pts = [];
    for (let i = 0; i < count; i++) {
      pts.push({
        x: x - Math.cos(angle) * (i - (count - 1) * 0.5) * spacing,
        y: y - Math.sin(angle) * (i - (count - 1) * 0.5) * spacing,
        z,
      });
    }
    return pts;
  }

  function spawnAgent(speciesId, x, y, z, angle, scaleFactor = 1) {
    const spec = ORGANISMS[speciesId] || ORGANISMS.paramecium;
    const size = spec.worldSize * (0.86 + random() * 0.28) * scaleFactor;
    const id = `org-${nextNumericId++}`;
    const isFilament = spec.id === 'spirogyra' || spec.id === 'cyanobacteria' || spec.id === 'nematode';
    const chainCount = spec.id === 'nematode' ? 11 : 9;
    const spacing = size / (chainCount - 1);
    const agent = {
      id,
      speciesId: spec.id,
      name: spec.name,
      scientificName: spec.scientificName,
      group: spec.group,
      form: spec.form,
      detail: spec.detail,
      x,
      y,
      z: Math.max(-Z_LIMIT, Math.min(Z_LIMIT, z)),
      vx: 0,
      vy: 0,
      vz: 0,
      angle,
      heading: angle,
      size,
      baseSize: size,
      speed: spec.baseSpeed * (0.88 + random() * 0.24),
      energy: 0.45 + random() * 0.35,
      age: random() * 40,
      state: 'exploring',
      phase: random() * Math.PI * 2,
      target: null,
      preyId: null,
      captureProgress: 0,
      divisionProgress: 0,
      maturity: 0.55 + random() * 0.45,
      stalkExtension: 1.0,
      contraction: 0,
      lobes: spec.group === 'amoeba' ? Array.from({length: 8}, () => 1 + (random() - 0.5) * 0.3) : null,
      chain: isFilament ? makeChain(x, y, z, angle, chainCount, spacing) : null,
      chainSpacing: spacing,
      vacuoles: [],
      trail: [],
      morphVariant: Math.floor(random() * 5),
      previous: {x, y, z, angle},
      start: {x, y, z},
    };
    agents.push(agent);
    return agent;
  }

  // Popula a amostra inicial respeitando maxAgents
  const densityScale = Math.max(0.4, Math.min(1.8, options.densityScale ?? 1));
  for (const entry of sample.composition) {
    const targetCount = Math.max(1, Math.round(entry.count * densityScale));
    for (let i = 0; i < targetCount; i++) {
      if (agents.length >= maxAgents) break;
      const spec = ORGANISMS[entry.speciesId];
      if (!spec) continue;
      const r = (SLIDE_RADIUS - spec.worldSize * 0.55 - 0.6) * Math.sqrt(random());
      const theta = random() * Math.PI * 2;
      const z = (random() - 0.5) * 2 * Math.min(Z_LIMIT - 0.3, spec.zRange);
      spawnAgent(entry.speciesId, Math.cos(theta) * r, Math.sin(theta) * r, z, random() * Math.PI * 2);
    }
  }

  // Sementes iniciais de alimento natural conforme matéria orgânica da amostra
  const initialFoodCount = Math.round(6 * env.foodAvailability);
  const foodTypes = ['organic', 'bacteria', 'microalgae', 'detritus'];
  for (let i = 0; i < initialFoodCount; i++) {
    const r = (SLIDE_RADIUS - 1.5) * Math.sqrt(random());
    const theta = random() * Math.PI * 2;
    dropFood(Math.cos(theta) * r, Math.sin(theta) * r, foodTypes[i % foodTypes.length]);
  }

  function dropFood(x, y, type = 'organic', z = 0) {
    if (food.length >= 48 || Math.hypot(x, y) > SLIDE_RADIUS - 0.42) return false;
    const item = {
      id: `food-${nextNumericId++}`,
      x,
      y,
      z: Math.max(-Z_LIMIT + 0.3, Math.min(Z_LIMIT - 0.3, z)),
      type,
      remaining: type === 'nutrients' ? 18 : 28,
      maxRemaining: type === 'nutrients' ? 18 : 28,
      amount: 1.0,
    };
    food.push(item);
    if (type === 'nutrients' || type === 'organic') {
      fluid.addNutrientPulse(x, y, 0.7);
    }
    return true;
  }

  function rebuildGrid() {
    for (let i = 0; i < buckets.length; i++) buckets[i].length = 0;
    for (let i = 0; i < agents.length; i++) {
      const a = agents[i];
      const gx = Math.max(0, Math.min(gridCells - 1, Math.floor((a.x + SLIDE_RADIUS) / gridSpan)));
      const gy = Math.max(0, Math.min(gridCells - 1, Math.floor((a.y + SLIDE_RADIUS) / gridSpan)));
      buckets[gy * gridCells + gx].push(a);
    }
  }

  function queryNeighbors(x, y, range, out) {
    out.length = 0;
    const minX = Math.max(0, Math.floor((x - range + SLIDE_RADIUS) / gridSpan));
    const maxX = Math.min(gridCells - 1, Math.floor((x + range + SLIDE_RADIUS) / gridSpan));
    const minY = Math.max(0, Math.floor((y - range + SLIDE_RADIUS) / gridSpan));
    const maxY = Math.min(gridCells - 1, Math.floor((y + range + SLIDE_RADIUS) / gridSpan));
    for (let gy = minY; gy <= maxY; gy++) {
      for (let gx = minX; gx <= maxX; gx++) {
        const list = buckets[gy * gridCells + gx];
        for (let i = 0; i < list.length; i++) out.push(list[i]);
      }
    }
    return out;
  }

  const neighborScratch = [];
  const toRemove = new Set();
  const pendingSpawns = [];

  function updateChain(agent, dt) {
    const pts = agent.chain;
    if (!pts || pts.length < 2) return;
    const spec = ORGANISMS[agent.speciesId];
    if (spec.id === 'nematode') {
      // Onda muscular senoidal ao longo da espinha
      pts[0].x = agent.x;
      pts[0].y = agent.y;
      pts[0].z = agent.z;
      for (let i = 1; i < pts.length; i++) {
        const prev = pts[i - 1];
        const cur = pts[i];
        const wave = Math.sin(time * 7.2 - i * 0.85 + agent.phase) * 0.09 * agent.chainSpacing;
        const dx = cur.x - prev.x;
        const dy = cur.y - prev.y;
        const d = Math.hypot(dx, dy) || 0.001;
        const nx = -dy / d;
        const ny = dx / d;
        cur.x = prev.x + (dx / d) * agent.chainSpacing + nx * wave * dt * 18;
        cur.y = prev.y + (dy / d) * agent.chainSpacing + ny * wave * dt * 18;
        cur.z += (prev.z - cur.z) * dt * 3;
      }
    } else {
      // Filamentos flexíveis (espirógira / cianobactéria) seguem centro + corrente local
      const mid = Math.floor(pts.length / 2);
      pts[mid].x = agent.x;
      pts[mid].y = agent.y;
      pts[mid].z = agent.z;
      for (let dir = -1; dir <= 1; dir += 2) {
        for (let i = mid + dir; i >= 0 && i < pts.length; i += dir) {
          const prev = pts[i - dir];
          const cur = pts[i];
          fluid.sampleVelocity(cur.x, cur.y, fluidVel);
          cur.x += fluidVel.x * dt * 0.7;
          cur.y += fluidVel.y * dt * 0.7;
          const dx = cur.x - prev.x;
          const dy = cur.y - prev.y;
          const d = Math.hypot(dx, dy) || 0.001;
          cur.x = prev.x + (dx / d) * agent.chainSpacing;
          cur.y = prev.y + (dy / d) * agent.chainSpacing;
          cur.z += (prev.z - cur.z) * dt * 2.5;
        }
      }
    }
  }

  function updateAmoebaLobes(agent, targetDir, hasTarget, dt) {
    if (!agent.lobes) return;
    const lobes = agent.lobes;
    const n = lobes.length;
    let sum = 0;
    for (let i = 0; i < n; i++) {
      const lobeAngle = agent.angle + (i / n) * Math.PI * 2;
      const align = Math.cos(lobeAngle - targetDir);
      const wave = Math.sin(time * 1.4 + i * 1.7 + agent.phase) * 0.22;
      const desired = 1.0 + (hasTarget ? Math.max(-0.22, align * 0.42) : align * 0.16) + wave;
      lobes[i] += (desired - lobes[i]) * dt * 2.2;
      sum += lobes[i] * lobes[i];
    }
    // Conservação aproximada da área celular (soma dos quadrados dos raios = n)
    const norm = Math.sqrt(n / Math.max(0.001, sum));
    for (let i = 0; i < n; i++) lobes[i] *= norm;
  }

  function update(dt = FIXED_STEP) {
    time += dt;
    fluid.update(time, env.current, dt);
    rebuildGrid();
    toRemove.clear();
    pendingSpawns.length = 0;

    // Fator metabólico térmico simplificado (Q10 aproximado)
    const tempFactor = Math.max(0.35, Math.min(1.65, 0.55 + (env.temperature - 10) * 0.032));
    const o2Factor = Math.max(0.3, Math.min(1.15, 0.4 + env.oxygen * 0.75));
    const salinityStress = Math.abs(env.salinity - sample.env.salinity) * 0.02;
    const phStress = Math.abs(env.ph - 7.0) * 0.08;

    let eatenEvent = null;

    for (let idx = 0; idx < agents.length; idx++) {
      const agent = agents[idx];
      if (toRemove.has(agent.id)) continue;

      const spec = ORGANISMS[agent.speciesId];
      Object.assign(agent.previous, {x: agent.x, y: agent.y, z: agent.z, angle: agent.angle});
      agent.age += dt;
      agent.maturity = Math.min(1, agent.maturity + dt * 0.015);

      // Digestão de vacúolos internos
      for (let v = agent.vacuoles.length - 1; v >= 0; v--) {
        agent.vacuoles[v].digestion += dt * 0.12;
        if (agent.vacuoles[v].digestion >= 1) {
          agent.vacuoles.splice(v, 1);
          agent.energy = Math.min(1, agent.energy + 0.12);
        }
      }

      // Metabolismo basal
      const isPhototroph = spec.diet.length === 1 && spec.diet[0] === 'nutrients';
      if (isPhototroph) {
        const localLight = fluid.sampleLight(agent.x, agent.y, env.light);
        const localNutrients = fluid.sampleNutrient(agent.x, agent.y);
        agent.energy = Math.min(1, Math.max(0.05, agent.energy + (localLight * 0.035 + localNutrients * 0.04 - 0.016) * dt));
      } else {
        agent.energy = Math.max(0, agent.energy - dt * 0.018 * tempFactor);
      }

      // Corrente do fluido local
      fluid.sampleVelocity(agent.x, agent.y, fluidVel);

      // Busca por alimento compatível ou presa (predação)
      let targetPos = null;
      let targetDist = 5.2;
      let targetFood = null;
      let targetPrey = null;

      if (spec.diet.includes('ciliate')) {
        const nearby = queryNeighbors(agent.x, agent.y, 5.5, neighborScratch);
        for (let i = 0; i < nearby.length; i++) {
          const other = nearby[i];
          if (other.id === agent.id || toRemove.has(other.id)) continue;
          if (other.speciesId === 'paramecium' || other.speciesId === 'coleps') {
            const d = Math.hypot(other.x - agent.x, other.y - agent.y);
            if (d < targetDist) {
              targetDist = d;
              targetPrey = other;
              targetPos = other;
            }
          }
        }
      } else if (!isPhototroph) {
        for (let i = 0; i < food.length; i++) {
          const item = food[i];
          if (item.remaining <= 0) continue;
          if (!spec.diet.includes(item.type)) continue;
          const d = Math.hypot(item.x - agent.x, item.y - agent.y);
          if (d < targetDist) {
            targetDist = d;
            targetFood = item;
            targetPos = item;
          }
        }
      }

      agent.target = targetFood || targetPrey;

      // Interação alimentar / predação
      const captureRadius = Math.max(0.55, agent.size * 0.28);
      if (targetFood && targetDist < captureRadius) {
        agent.state = 'feeding';
        agent.captureProgress = Math.min(1, agent.captureProgress + dt * 2.2);
        if (agent.captureProgress >= 1) {
          targetFood.remaining = 0;
          agent.captureProgress = 0;
          agent.energy = Math.min(1, agent.energy + 0.42);
          if (agent.vacuoles.length < 6) {
            agent.vacuoles.push({
              x: (random() - 0.5) * 0.35,
              y: (random() - 0.5) * 0.25,
              r: 0.14 + random() * 0.08,
              digestion: 0,
            });
          }
          eatenEvent = agent;
        }
      } else if (targetPrey && targetDist < captureRadius * 1.15) {
        agent.state = 'predating';
        agent.captureProgress = Math.min(1, agent.captureProgress + dt * 1.6);
        if (agent.captureProgress >= 1) {
          toRemove.add(targetPrey.id);
          agent.captureProgress = 0;
          agent.energy = 1;
          eatenEvent = agent;
        }
      } else {
        agent.captureProgress = Math.max(0, agent.captureProgress - dt * 2.5);
      }

      // Locomoção em baixo Reynolds (arrasto viscoso dominante)
      const activityFactor = Math.max(0.25, tempFactor * o2Factor - salinityStress - phStress);
      let desiredHeading = agent.heading;
      let thrust = agent.speed * activityFactor;

      if (spec.id === 'vorticella') {
        // Vorticela é séssil: oscila suavemente presa ao ponto de ancoragem e contrai em estímulos
        const distAnchor = Math.hypot(agent.x - agent.start.x, agent.y - agent.start.y);
        if (distAnchor > 0.4) {
          agent.x += (agent.start.x - agent.x) * dt * 2;
          agent.y += (agent.start.y - agent.y) * dt * 2;
        }
        agent.stalkExtension = Math.min(1, agent.stalkExtension + dt * 0.35);
        agent.state = agent.stalkExtension < 0.45 ? 'contracted' : 'feeding';
        thrust = 0.02;
      } else if (targetPos) {
        agent.state = targetPrey ? 'predating' : 'approaching';
        desiredHeading = Math.atan2(targetPos.y - agent.y, targetPos.x - agent.x);
        thrust *= spec.motility === 'amoeboid' ? 1.55 : 1.4;
      } else if (spec.phototaxis === 'positive' && env.light > 0.25) {
        const toLight = Math.atan2(2.0 - agent.y, 2.5 - agent.x);
        desiredHeading += shortestAngleDiff(desiredHeading, toLight) * dt * 0.85;
        agent.state = 'exploring';
      } else if (spec.phototaxis === 'negative' && env.light > 0.7) {
        const awayLight = Math.atan2(agent.y - 2.0, agent.x - 2.5);
        desiredHeading += shortestAngleDiff(desiredHeading, awayLight) * dt * 0.7;
        agent.state = 'fleeing';
      } else if (spec.motility === 'run-tumble') {
        if (random() < dt * 1.1) {
          desiredHeading += (random() - 0.5) * Math.PI * 1.4;
        }
        agent.state = 'foraging';
      } else if (spec.motility === 'drifting') {
        desiredHeading += Math.sin(time * 0.25 + agent.phase) * dt * 0.15;
        agent.state = 'drifting';
      } else {
        // Exploração orgânica suave com ruído browniano rotacional
        desiredHeading += Math.sin(time * 0.65 + agent.phase) * dt * 0.55 + (random() - 0.5) * dt * 0.9;
        agent.state = 'exploring';
      }

      // Separação suave entre vizinhos (O(n) via grade espacial)
      const neighbors = queryNeighbors(agent.x, agent.y, agent.size * 0.75 + 1.2, neighborScratch);
      let sepX = 0;
      let sepY = 0;
      for (let i = 0; i < neighbors.length; i++) {
        const other = neighbors[i];
        if (other.id === agent.id || toRemove.has(other.id)) continue;
        const dx = agent.x - other.x;
        const dy = agent.y - other.y;
        const d = Math.hypot(dx, dy);
        const minSep = (agent.size + other.size) * 0.26;
        if (d > 0.001 && d < minSep) {
          const push = (minSep - d) / minSep;
          sepX += (dx / d) * push * 0.9;
          sepY += (dy / d) * push * 0.9;
        }
      }

      agent.heading += shortestAngleDiff(agent.heading, desiredHeading) * dt * 2.8;
      agent.angle += shortestAngleDiff(agent.angle, agent.heading) * dt * 3.2;

      // Movimento browniano inversamente proporcional ao tamanho
      const brownian = 0.06 / Math.sqrt(Math.max(0.4, agent.size));
      const bx = (random() - 0.5) * brownian;
      const by = (random() - 0.5) * brownian;

      const targetVx = Math.cos(agent.heading) * thrust + fluidVel.x + sepX + bx;
      const targetVy = Math.sin(agent.heading) * thrust + fluidVel.y + sepY + by;
      const drag = 6.5; // Amortecimento viscoso alto
      agent.vx += (targetVx - agent.vx) * Math.min(1, drag * dt);
      agent.vy += (targetVy - agent.vy) * Math.min(1, drag * dt);

      agent.x += agent.vx * dt;
      agent.y += agent.vy * dt;

      // Movimento em profundidade Z
      const zTarget = Math.sin(time * 0.28 + agent.phase) * Math.min(Z_LIMIT - 0.4, spec.zRange * 0.65);
      agent.vz += ((zTarget - agent.z) * 0.6 + fluidVel.z - agent.vz) * dt * 2.0;
      agent.z = Math.max(-Z_LIMIT, Math.min(Z_LIMIT, agent.z + agent.vz * dt));

      // Confinamento suave na gota
      const dist = Math.hypot(agent.x, agent.y);
      const limit = Math.max(1.5, SLIDE_RADIUS - agent.size * 0.46);
      if (dist > limit) {
        const nx = agent.x / dist;
        const ny = agent.y / dist;
        agent.x = nx * limit;
        agent.y = ny * limit;
        // Desvia suavemente para dentro da gota
        const inward = Math.atan2(-ny, -nx);
        agent.heading += shortestAngleDiff(agent.heading, inward) * 0.35;
      }

      // Atualizações morfológicas específicas
      if (agent.lobes) updateAmoebaLobes(agent, desiredHeading, Boolean(targetPos), dt);
      if (agent.chain) updateChain(agent, dt);

      // Registro de trajetória (máx 48 pontos, a cada ~0.25s)
      if (Math.floor((time + agent.phase) * 4) !== Math.floor((time - dt + agent.phase) * 4)) {
        agent.trail.push({x: agent.x, y: agent.y, z: agent.z});
        if (agent.trail.length > 48) agent.trail.shift();
      }

      // Reprodução didática gradual quando habilitada e abaixo do teto
      if (
        reproductionEnabled &&
        spec.reproductionMode !== 'none' &&
        agents.length + pendingSpawns.length < maxAgents &&
        agent.energy > 0.86 &&
        agent.maturity > 0.85
      ) {
        const sameSpeciesCount = agents.filter((a) => a.speciesId === agent.speciesId).length;
        if (sameSpeciesCount < spec.maxPop) {
          agent.state = 'dividing';
          agent.divisionProgress += dt * 0.14;
          if (agent.divisionProgress >= 1) {
            agent.divisionProgress = 0;
            agent.energy = 0.48;
            agent.maturity = 0.45;
            const perp = agent.angle + Math.PI * 0.5;
            const offset = agent.size * 0.24;
            pendingSpawns.push({
              speciesId: agent.speciesId,
              x: agent.x + Math.cos(perp) * offset,
              y: agent.y + Math.sin(perp) * offset,
              z: agent.z + (random() - 0.5) * 0.2,
              angle: agent.angle + 0.25,
              scaleFactor: 0.78,
            });
          }
        }
      } else if (agent.divisionProgress > 0) {
        agent.divisionProgress = Math.max(0, agent.divisionProgress - dt * 0.2);
      }
    }

    // Remove predados
    if (toRemove.size > 0) {
      for (let i = agents.length - 1; i >= 0; i--) {
        if (toRemove.has(agents[i].id)) agents.splice(i, 1);
      }
    }
    // Adiciona filhos divididos
    for (const s of pendingSpawns) {
      if (agents.length < maxAgents) {
        spawnAgent(s.speciesId, s.x, s.y, s.z, s.angle, s.scaleFactor);
      }
    }

    // Atualiza partículas de alimento
    for (let i = food.length - 1; i >= 0; i--) {
      const f = food[i];
      fluid.sampleVelocity(f.x, f.y, fluidVel);
      f.x += fluidVel.x * dt * 0.65;
      f.y += fluidVel.y * dt * 0.65;
      f.remaining -= dt;
      if (f.remaining <= 0 || Math.hypot(f.x, f.y) > SLIDE_RADIUS - 0.2) {
        food.splice(i, 1);
      }
    }

    // Série temporal para gráficos (a cada 1s simulado)
    historyTimer += dt;
    if (historyTimer >= 1.0) {
      historyTimer = 0;
      let sumEnergy = 0;
      let sumSpeed = 0;
      for (let i = 0; i < agents.length; i++) {
        sumEnergy += agents[i].energy;
        sumSpeed += Math.hypot(agents[i].vx, agents[i].vy);
      }
      const n = Math.max(1, agents.length);
      history.push({
        time,
        population: agents.length,
        avgEnergy: sumEnergy / n,
        activity: sumSpeed / n,
        foodCount: food.length,
      });
      if (history.length > 90) history.shift();
    }

    return eatenEvent;
  }

  function triggerStimulus(x, y, radius = 3.5) {
    for (const agent of agents) {
      const d = Math.hypot(agent.x - x, agent.y - y);
      if (d < radius) {
        if (agent.speciesId === 'vorticella') agent.stalkExtension = 0.15;
        if (agent.speciesId === 'stentor') agent.contraction = 1.0;
        const away = Math.atan2(agent.y - y, agent.x - x);
        agent.heading = away;
      }
    }
  }

  function getAgentById(id) {
    return agents.find((a) => a.id === id) || null;
  }

  return {
    sample,
    seed,
    agents,
    food,
    env,
    initialEnv,
    history,
    fluid,
    dropFood,
    update,
    spawnAgent,
    triggerStimulus,
    getAgentById,
    setMaxAgents(v) { maxAgents = Math.max(5, Math.min(200, v)); },
    setReproductionEnabled(v) { reproductionEnabled = Boolean(v); },
    get time() { return time; },
  };
}
