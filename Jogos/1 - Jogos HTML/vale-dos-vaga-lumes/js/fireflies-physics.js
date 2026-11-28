/**
 * js/fireflies-physics.js
 * Simulação física em timestep fixo (dt = 1/60s, maxSubsteps = 4) com
 * interpolação visual entre ticks e osciladores de fase de Kuramoto acoplados.
 * Limite máximo de agentes: 360. Respeita colisores do terreno/riacho e
 * alterna para brilho estável sem cintilação em Movimento Reduzido (T02).
 */
import * as THREE from 'three';
import {
  WATER_LEVEL,
  clamp,
  lerp,
  streamCenterX,
  terrainHeight,
} from './math-terrain.js';
import { MAX_FIREFLIES, mulberry32 } from './state.js';

export function createFireflySimulation(scene, colliders = []) {
  const FIXED_DT = 1 / 60;
  const agents = [];

  const positions = new Float32Array(MAX_FIREFLIES * 3);
  const metaAttr = new Float32Array(MAX_FIREFLIES * 3); // glow, size, hueOffset

  const geo = new THREE.BufferGeometry();
  const posBuffer = new THREE.BufferAttribute(positions, 3);
  posBuffer.setUsage(THREE.DynamicDrawUsage);
  const metaBuffer = new THREE.BufferAttribute(metaAttr, 3);
  metaBuffer.setUsage(THREE.DynamicDrawUsage);
  geo.setAttribute('position', posBuffer);
  geo.setAttribute('aMeta', metaBuffer);

  const uniforms = {
    uPixelRatio: { value: 1.0 },
    uBrightness: { value: 0.74 },
  };

  const mat = new THREE.ShaderMaterial({
    uniforms,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexShader: /* glsl */ `
      attribute vec3 aMeta;
      uniform float uPixelRatio;
      varying float vGlow;
      varying float vHue;

      void main() {
        vGlow = aMeta.x;
        vHue = aMeta.z;
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        float baseSize = aMeta.y * (0.45 + 0.75 * vGlow);
        gl_PointSize = clamp(baseSize * uPixelRatio * (115.0 / max(-mv.z, 0.8)), 2.5, 42.0);
        gl_Position = projectionMatrix * mv;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform float uBrightness;
      varying float vGlow;
      varying float vHue;

      void main() {
        vec2 uv = gl_PointCoord - 0.5;
        float d = length(uv) * 2.0;
        if (d > 1.0) discard;

        // Núcleo incandescente quente + auréola suave realista de bioluminescência
        float core = exp(-d * d * 16.0);
        float halo = exp(-d * d * 3.4) * 0.72;
        vec3 warmGold = mix(vec3(1.0, 0.90, 0.34), vec3(0.84, 0.98, 0.28), vHue);
        vec3 col = mix(warmGold, vec3(1.0, 0.99, 0.88), core * 0.85);
        float alpha = (core + halo) * vGlow * (0.35 + uBrightness * 0.95);
        gl_FragColor = vec4(col * (0.9 + uBrightness * 0.65), clamp(alpha, 0.0, 1.0));
      }
    `,
  });

  const points = new THREE.Points(geo, mat);
  points.frustumCulled = false;
  points.renderOrder = 5;
  scene.add(points);

  let seedCounter = 1095;
  function reset(seed = 1095) {
    seedCounter = seed;
    const rnd = mulberry32(seedCounter);
    agents.length = 0;

    for (let i = 0; i < MAX_FIREFLIES; i++) {
      // Concentra enxames junto ao capim marginal, ao riacho distante e à clareira
      const zonePick = rnd();
      let x, z;
      if (zonePick < 0.55) {
        // Sobre capim da margem direita/esquerda do riacho (fidelidade ao mockup)
        z = lerp(-36, 9, Math.pow(rnd(), 0.72));
        const side = rnd() < 0.42 ? -1 : 1;
        x = streamCenterX(z) + side * lerp(0.9, 3.6, rnd());
      } else if (zonePick < 0.85) {
        // Nuvem luminosa no meandro distante do vale
        z = lerp(-44, -14, rnd());
        x = streamCenterX(z) + lerp(-6.5, 6.5, rnd());
      } else {
        // Borda próxima da trilha
        z = lerp(-24, 7, rnd());
        x = lerp(-4.5, 1.2, rnd());
      }
      const floorY = Math.max(terrainHeight(x, z), WATER_LEVEL);
      const y = floorY + lerp(0.28, 2.35, rnd());

      agents.push({
        anchorX: x,
        anchorZ: z,
        prev: new THREE.Vector3(x, y, z),
        curr: new THREE.Vector3(x, y, z),
        vel: new THREE.Vector3((rnd() - 0.5) * 0.4, (rnd() - 0.5) * 0.12, (rnd() - 0.5) * 0.4),
        phase: rnd() * Math.PI * 2,
        omega: lerp(1.85, 3.45, rnd()), // ~0.30 - 0.55 Hz natural
        dTheta: 0,
        size: lerp(1.1, 2.2, rnd()),
        hue: rnd(),
        prevGlow: 0.5,
        currGlow: 0.5,
      });
    }
  }

  reset(seedCounter);

  let accumulator = 0;

  function stepFixed(dt, state) {
    const activeCount = clamp(Math.round(state.density), 1, MAX_FIREFLIES);
    const couplingK = state.syncCoupling; // rad/s
    const speedScale = state.reducedMotion ? 0.18 : 1.0;

    // 1. Acumula acoplamento de Kuramoto entre vizinhos próximos (janela local O(N*k))
    let cosSum = 0;
    let sinSum = 0;

    // Passo médio global suave + vizinhança local (r <= 5.5m) para ondas naturais
    for (let i = 0; i < activeCount; i++) {
      const a = agents[i];
      a.prev.copy(a.curr);
      a.prevGlow = a.currGlow;

      let localTorque = 0;
      let neighbors = 0;
      // Subamostragem determinística em janela circular evita O(N^2) pesado
      const stride = Math.max(1, Math.floor(activeCount / 36));
      for (let j = i % stride; j < activeCount; j += stride) {
        if (i === j) continue;
        const b = agents[j];
        const dx = b.curr.x - a.curr.x;
        const dz = b.curr.z - a.curr.z;
        if (dx * dx + dz * dz < 36.0) {
          localTorque += Math.sin(b.phase - a.phase);
          neighbors++;
        }
      }

      if (state.reducedMotion) {
        // T02: elimina pulsação rápida — fixa brilho sereno sem oscilação
        a.phase = (a.phase + dt * 0.22) % (Math.PI * 2);
        a.currGlow = 0.72;
        a.prevGlow = 0.72;
      } else {
        const couplingTerm = neighbors > 0 ? (couplingK / neighbors) * localTorque : 0;
        a.phase = (a.phase + (a.omega + couplingTerm) * dt) % (Math.PI * 2);
        // Pulso biológico assimétrico (subida clara, decaimento suave)
        const pulse = Math.pow(0.5 + 0.5 * Math.sin(a.phase), 4.2);
        a.currGlow = 0.12 + 0.88 * pulse;
      }

      cosSum += Math.cos(a.phase);
      sinSum += Math.sin(a.phase);

      // 2. Dinâmica espacial 3D com força de retorno ao nicho e amortecimento
      const wanderX = Math.sin(a.curr.z * 0.45 + a.phase * 0.5) * 0.28;
      const wanderY = Math.cos(a.curr.x * 0.7 + a.phase) * 0.14;
      const wanderZ = Math.cos(a.curr.x * 0.4 + a.phase * 0.3) * 0.26;

      a.vel.x += ((a.anchorX - a.curr.x) * 0.18 + wanderX) * dt * speedScale;
      a.vel.y += wanderY * dt * speedScale;
      a.vel.z += ((a.anchorZ - a.curr.z) * 0.18 + wanderZ) * dt * speedScale;
      a.vel.multiplyScalar(1.0 - 0.85 * dt);

      a.curr.addScaledVector(a.vel, dt * speedScale);

      // Colisor de terreno e lâmina d'água (nunca submerge nem sobe demais)
      const groundFloor = Math.max(terrainHeight(a.curr.x, a.curr.z), WATER_LEVEL) + 0.22;
      const ceilingY = groundFloor + 2.6;
      if (a.curr.y < groundFloor) {
        a.curr.y = groundFloor;
        a.vel.y = Math.abs(a.vel.y) * 0.6 + 0.08;
      } else if (a.curr.y > ceilingY) {
        a.curr.y = ceilingY;
        a.vel.y = -Math.abs(a.vel.y) * 0.5;
      }

      // Colisores horizontais (postes e tronco frontal)
      for (let c = 0; c < colliders.length; c++) {
        const col = colliders[c];
        const dx = a.curr.x - col.x;
        const dz = a.curr.z - col.z;
        const minR = col.r + 0.25;
        const dSq = dx * dx + dz * dz;
        if (dSq < minR * minR && dSq > 1e-6) {
          const d = Math.sqrt(dSq);
          a.curr.x = col.x + (dx / d) * minR;
          a.curr.z = col.z + (dz / d) * minR;
        }
      }
    }

    // Parâmetro de ordem de Kuramoto R in [0, 1] medido em tempo real
    state.measuredOrderR = Math.hypot(cosSum / activeCount, sinSum / activeCount);
  }

  function update(frameDt, state, pixelRatio = 1) {
    const clamped = Math.min(Math.max(frameDt, 0), 0.1);
    accumulator += clamped;

    let steps = 0;
    const maxSubsteps = 4;
    while (accumulator >= FIXED_DT && steps < maxSubsteps) {
      stepFixed(FIXED_DT, state);
      accumulator -= FIXED_DT;
      steps++;
    }
    if (steps === maxSubsteps) accumulator = 0; // evita espiral da morte em CPU lento

    const alpha = accumulator / FIXED_DT;
    const activeCount = clamp(Math.round(state.density), 1, MAX_FIREFLIES);

    for (let i = 0; i < activeCount; i++) {
      const a = agents[i];
      positions[i * 3] = lerp(a.prev.x, a.curr.x, alpha);
      positions[i * 3 + 1] = lerp(a.prev.y, a.curr.y, alpha);
      positions[i * 3 + 2] = lerp(a.prev.z, a.curr.z, alpha);

      metaAttr[i * 3] = lerp(a.prevGlow, a.currGlow, alpha);
      metaAttr[i * 3 + 1] = a.size;
      metaAttr[i * 3 + 2] = a.hue;
    }

    posBuffer.needsUpdate = true;
    metaBuffer.needsUpdate = true;
    // T01: contagem visível controlada diretamente pelo drawRange!
    geo.setDrawRange(0, activeCount);

    uniforms.uPixelRatio.value = pixelRatio;
    uniforms.uBrightness.value = state.brightness;
  }

  return {
    points,
    update,
    reset,
    dispose() {
      geo.dispose();
      mat.dispose();
    },
  };
}
