import * as THREE from '../../../Sistema/shared/vendor/three.module.js';
import {SLIDE_RADIUS} from './js/ecosystem.js';
import {createPRNG} from './js/ecosystem.js';
import {
  OPTIC_MODES,
  createSharedOpticUniforms,
  FIELD_VERTEX,
  FIELD_FRAGMENT,
} from './js/optics/optical-shaders.js';
import {createOrganismAssembly, updateOrganismAssembly} from './js/organisms/organism-meshes.js';

export const OBJECTIVES = [
  {power: 4, total: 40, na: 0.10, zoom: 0.72, label: '4× (NA 0,10)'},
  {power: 10, total: 100, na: 0.25, zoom: 1.0, label: '10× (NA 0,25)'},
  {power: 20, total: 200, na: 0.40, zoom: 1.55, label: '20× (NA 0,40)'},
  {power: 40, total: 400, na: 0.65, zoom: 2.35, label: '40× (NA 0,65)'},
  {power: 60, total: 600, na: 0.85, zoom: 3.10, label: '60× (NA 0,85)'},
  {power: 100, total: 1000, na: 1.25, zoom: 4.10, label: '100× (NA 1,25 · imersão)'},
];

const meniscusVertex = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const meniscusFragment = `
  varying vec2 vUv;
  uniform float uLight;
  uniform int uOpticMode;
  void main() {
    vec2 p = (vUv - 0.5) * 2.0;
    float theta = atan(p.y, p.x);
    float d = length(p) + sin(theta * 6.0 + 0.25) * 0.006 + cos(theta * 11.0) * 0.003;
    float shade = smoothstep(0.88, 0.96, d) * (1.0 - smoothstep(0.96, 0.997, d));
    float rim = smoothstep(0.962, 0.979, d) * (1.0 - smoothstep(0.979, 0.989, d));
    float glint = (sin(theta * 2.0 + 0.1) + 1.0) * 0.30 + 0.23;
    vec3 darkCol = mix(vec3(0.06, 0.17, 0.23), vec3(0.42, 0.68, 0.69), glint) * uLight;
    vec3 brightCol = vec3(0.25, 0.30, 0.32);
    vec3 color = uOpticMode == 1 ? brightCol : darkCol;
    gl_FragColor = vec4(color, (shade * 0.28 + rim * 0.80) * glint);
  }
`;

const debrisVertex = `
  attribute float diameter;
  attribute float variation;
  attribute float kind; // 0: detrito, 1: mineral, 2: microbolha, 3: fibra
  attribute vec3 tint;
  varying float vVariation;
  varying vec3 vTint;
  varying float vBlur;
  varying float vKind;
  uniform float time;
  uniform float density;
  uniform float zoom;
  uniform float focus;
  uniform float na;
  void main() {
    vec3 pt = position;
    float brown = (kind > 1.5 && kind < 2.5) ? 0.03 : (0.06 + variation * 0.14);
    pt.xy += vec2(sin(time * 0.44 + variation * 390.0), cos(time * 0.37 + variation * 318.0)) * brown;
    pt.xy += vec2(cos(time * 1.5 + variation * 54.0), sin(time * 1.38 + variation * 582.0)) * 0.028;
    vBlur = min(1.0, abs(focus - pt.z) * (0.14 + na * 0.25));
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pt, 1.0);
    gl_PointSize = clamp((diameter + vBlur * 4.5) * density * zoom, 1.0, 26.0);
    vVariation = variation;
    vTint = tint;
    vKind = kind;
  }
`;

const debrisFragment = `
  varying float vVariation;
  varying float vBlur;
  varying vec3 vTint;
  varying float vKind;
  uniform float lightLevel;
  uniform int opticMode;
  void main() {
    vec2 pt = gl_PointCoord - 0.5;
    float d = length(pt * vec2(1.0, vKind > 2.5 ? 2.2 : 0.85 + vVariation * 0.35));
    if (d > 0.5) discard;
    float core = 1.0 - smoothstep(0.03, 0.28 + vBlur * 0.12, d);
    float ring = smoothstep(0.24, 0.38, d) * (1.0 - smoothstep(0.39, 0.50, d));
    float alpha = 0.0;
    vec3 col = vTint;
    if (vKind > 1.5 && vKind < 2.5) {
      // Microbolha refrativa
      alpha = (ring * 0.85 + core * 0.12) * (1.0 - vBlur * 0.35);
      col = mix(vTint, vec3(0.88, 0.98, 1.0), 0.65);
    } else {
      alpha = (core * (0.70 - vBlur * 0.35) + ring * 0.22) * (0.42 + vVariation * 0.55);
    }
    if (opticMode == 1) {
      col = mix(vec3(0.25, 0.26, 0.22), col * 0.5, 0.5);
      alpha *= 0.65;
    } else if (opticMode == 4) {
      alpha *= 0.18;
    }
    gl_FragColor = vec4(col * lightLevel, alpha);
  }
`;

function shortestAngleLerp(a, b, t) {
  const diff = Math.atan2(Math.sin(b - a), Math.cos(b - a));
  return a + diff * t;
}

export function microscope(stage) {
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: false,
    preserveDrawingBuffer: true,
    powerPreference: 'high-performance',
  });
  const canvas = renderer.domElement;
  canvas.tabIndex = 0;
  canvas.setAttribute('aria-label', 'Campo do microscópio. Setas deslocam a lâmina e Enter identifica o organismo central.');
  stage.prepend(canvas);

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 150);
  const sharedUniforms = createSharedOpticUniforms();

  const backdrop = new THREE.Mesh(
    new THREE.PlaneGeometry(2, 2),
    new THREE.ShaderMaterial({
      uniforms: sharedUniforms,
      vertexShader: FIELD_VERTEX,
      fragmentShader: FIELD_FRAGMENT,
      depthWrite: false,
      depthTest: false,
    }),
  );
  backdrop.frustumCulled = false;
  backdrop.renderOrder = -100;
  scene.add(backdrop);

  const meniscus = new THREE.Mesh(
    new THREE.PlaneGeometry(SLIDE_RADIUS * 2.04, SLIDE_RADIUS * 2.04),
    new THREE.ShaderMaterial({
      uniforms: {uLight: sharedUniforms.uLight, uOpticMode: sharedUniforms.uOpticMode},
      vertexShader: meniscusVertex,
      fragmentShader: meniscusFragment,
      transparent: true,
      depthWrite: false,
    }),
  );
  meniscus.position.z = -3.3;
  meniscus.renderOrder = -40;
  scene.add(meniscus);

  // Partículas diferenciadas: detritos, minerais, microbolhas refrativas, fibras
  const random = createPRNG(158354);
  const maxParticles = 2200;
  const pPos = new Float32Array(maxParticles * 3);
  const pCol = new Float32Array(maxParticles * 3);
  const pSize = new Float32Array(maxParticles);
  const pVar = new Float32Array(maxParticles);
  const pKind = new Float32Array(maxParticles);
  const palette = [
    [0.34, 0.56, 0.50], // detrito orgânico
    [0.62, 0.54, 0.36], // sedimento mineral
    [0.72, 0.92, 0.96], // microbolha
    [0.44, 0.65, 0.42], // microalga/fibra
  ];
  for (let i = 0; i < maxParticles; i++) {
    const angle = random() * Math.PI * 2;
    const distance = (SLIDE_RADIUS - 0.35) * Math.sqrt(random());
    const kind = i % 9 === 0 ? 2 : i % 5 === 0 ? 1 : i % 7 === 0 ? 3 : 0;
    pPos.set([Math.cos(angle) * distance, Math.sin(angle) * distance, (random() - 0.5) * 6.4], i * 3);
    pCol.set(palette[kind], i * 3);
    pSize[i] = kind === 2 ? 2.8 + random() * 4.5 : 0.9 + Math.pow(random(), 3) * 4.6;
    pVar[i] = random();
    pKind[i] = kind;
  }
  const dustGeo = new THREE.BufferGeometry();
  dustGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
  dustGeo.setAttribute('diameter', new THREE.BufferAttribute(pSize, 1));
  dustGeo.setAttribute('variation', new THREE.BufferAttribute(pVar, 1));
  dustGeo.setAttribute('kind', new THREE.BufferAttribute(pKind, 1));
  dustGeo.setAttribute('tint', new THREE.BufferAttribute(pCol, 3));

  const dustUniforms = {
    time: sharedUniforms.uTime,
    density: {value: 1},
    zoom: sharedUniforms.uZoom,
    focus: sharedUniforms.uFocus,
    na: sharedUniforms.uNA,
    lightLevel: sharedUniforms.uLight,
    opticMode: sharedUniforms.uOpticMode,
  };
  const dustMat = new THREE.ShaderMaterial({
    uniforms: dustUniforms,
    vertexShader: debrisVertex,
    fragmentShader: debrisFragment,
    transparent: true,
    depthWrite: false,
    blending: THREE.NormalBlending,
  });
  const dust = new THREE.Points(dustGeo, dustMat);
  dust.renderOrder = -25;
  scene.add(dust);

  // Partículas de alimento depositado (multi-tipo)
  const foodGeo = new THREE.BufferGeometry();
  const maxFoodPts = 48 * 16;
  const foodPos = new THREE.BufferAttribute(new Float32Array(maxFoodPts * 3), 3).setUsage(THREE.DynamicDrawUsage);
  const foodTint = new THREE.BufferAttribute(new Float32Array(maxFoodPts * 3), 3).setUsage(THREE.DynamicDrawUsage);
  foodGeo.setAttribute('position', foodPos);
  foodGeo.setAttribute('diameter', new THREE.BufferAttribute(Float32Array.from({length: maxFoodPts}, () => 2.2 + random() * 3.4), 1));
  foodGeo.setAttribute('variation', new THREE.BufferAttribute(Float32Array.from({length: maxFoodPts}, random), 1));
  foodGeo.setAttribute('kind', new THREE.BufferAttribute(new Float32Array(maxFoodPts), 1));
  foodGeo.setAttribute('tint', foodTint);
  const foodPoints = new THREE.Points(foodGeo, dustMat);
  foodPoints.frustumCulled = false;
  foodPoints.renderOrder = 5;
  scene.add(foodPoints);

  // Linha de trajetória do organismo selecionado
  const trailGeo = new THREE.BufferGeometry();
  const trailPos = new Float32Array(64 * 3);
  trailGeo.setAttribute('position', new THREE.BufferAttribute(trailPos, 3).setUsage(THREE.DynamicDrawUsage));
  const trailLine = new THREE.Line(
    trailGeo,
    new THREE.LineBasicMaterial({color: 0x84ced6, transparent: true, opacity: 0.65}),
  );
  trailLine.frustumCulled = false;
  trailLine.visible = false;
  scene.add(trailLine);

  // Grade calibrada opcional (espaçamento de 40 µm = 1 unidade)
  const gridVerts = [];
  for (let i = -12; i <= 12; i++) {
    gridVerts.push(i, -12, -3.1, i, 12, -3.1);
    gridVerts.push(-12, i, -3.1, 12, i, -3.1);
  }
  const gridGeo = new THREE.BufferGeometry();
  gridGeo.setAttribute('position', new THREE.Float32BufferAttribute(gridVerts, 3));
  const gridLines = new THREE.LineSegments(
    gridGeo,
    new THREE.LineBasicMaterial({color: 0x69b88b, transparent: true, opacity: 0.20}),
  );
  gridLines.visible = false;
  scene.add(gridLines);

  // Registro de malhas 3D ativas indexado por agent.id estável
  const assemblies = new Map();
  let width = 0;
  let height = 0;
  let density = 1;
  let profile = 'high';
  let opticMode = 'darkfield';
  let objectiveIndex = 1;
  let anatomyState = {
    active: false,
    selectedId: null,
    highlightOrganelle: null,
    membraneAlpha: 1.0,
    pitch: 0,
    yaw: 0,
  };
  let trailsVisible = false;

  const observer = new ResizeObserver(resize);
  observer.observe(stage);

  function resize() {
    const nextWidth = Math.max(1, stage.clientWidth);
    const nextHeight = Math.max(1, stage.clientHeight);
    const maxDpr = {low: 1.0, medium: 1.25, high: 1.75, ultra: 2.0}[profile] || 1.5;
    const nextDensity = Math.min(window.devicePixelRatio || 1, maxDpr);
    if (width === nextWidth && height === nextHeight && density === nextDensity) return;
    width = nextWidth;
    height = nextHeight;
    density = nextDensity;
    renderer.setPixelRatio(density);
    renderer.setSize(width, height, false);
    sharedUniforms.uAspect.value = width / height;
  }

  const pivot = new THREE.Vector3();
  const projected = new THREE.Vector3();
  const pointer = new THREE.Vector2();
  const ray = new THREE.Raycaster();
  const slide = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);

  function unitsPerPixel() {
    return (camera.top - camera.bottom) / Math.max(1, height);
  }

  function worldAt(x, y) {
    const bounds = canvas.getBoundingClientRect();
    pointer.set((2 * (x - bounds.left)) / bounds.width - 1, 1 - (2 * (y - bounds.top)) / bounds.height);
    ray.setFromCamera(pointer, camera);
    return ray.ray.intersectPlane(slide, new THREE.Vector3());
  }

  function targetCandidatesAt(x, y, simulation) {
    const candidates = [];
    const upp = unitsPerPixel();
    for (const agent of simulation.agents) {
      const asm = assemblies.get(agent.id);
      if (!asm) continue;
      projected.set(agent.x, agent.y, agent.z).project(camera);
      const sx = (projected.x * 0.5 + 0.5) * width;
      const sy = (-projected.y * 0.5 + 0.5) * height;
      const extent = (agent.size * 0.45) / Math.max(0.0001, upp);
      const hitR = Math.max(22, extent);
      const dist = Math.hypot(x - sx, y - sy) / hitR;
      if (dist <= 1.0) {
        candidates.push({agent, dist, zDiff: Math.abs(agent.z - sharedUniforms.uFocus.value)});
      }
    }
    candidates.sort((a, b) => a.zDiff - b.zDiff || a.dist - b.dist);
    return candidates.map((c) => c.agent);
  }

  function targetAt(x, y, simulation) {
    if (!simulation) return null;
    const list = targetCandidatesAt(x, y, simulation);
    return list.length > 0 ? list[0] : null;
  }

  function render(simulation, view, alpha = 1) {
    const {zoom, light, focus, tiltX, tiltY} = view;
    const aspect = width / Math.max(height, 1);
    const halfHeight = Math.max(4.43, 4.17 / aspect) / zoom;
    camera.left = -halfHeight * aspect;
    camera.right = halfHeight * aspect;
    camera.top = halfHeight;
    camera.bottom = -halfHeight;
    camera.updateProjectionMatrix();

    pivot.set(view.x, view.y, 0);
    camera.position.set(view.x + tiltX * 22, view.y + tiltY * 22, 24);
    camera.lookAt(pivot);
    camera.updateMatrixWorld();

    const t = simulation.time;
    const animTime = view.reduced ? 0 : t;
    sharedUniforms.uTime.value = animTime;
    sharedUniforms.uLight.value = light;
    sharedUniforms.uFocus.value = focus;
    sharedUniforms.uZoom.value = zoom;
    sharedUniforms.uCenter.value.set(view.x, view.y);
    sharedUniforms.uNA.value = OBJECTIVES[objectiveIndex]?.na || 0.65;
    if (simulation.sample) {
      sharedUniforms.uWaterTint.value.set(...simulation.sample.waterTint);
      sharedUniforms.uTurbidity.value = simulation.sample.turbidity;
    }

    dustUniforms.density.value = density;
    const particleBudget = {low: 400, medium: 700, high: 950, ultra: 1600}[profile] || 950;
    dustGeo.setDrawRange(0, particleBudget);

    // Sincroniza organismos ativos
    const activeIds = new Set();
    const selectedId = anatomyState.selectedId;
    for (const agent of simulation.agents) {
      activeIds.add(agent.id);
      let asm = assemblies.get(agent.id);
      if (!asm) {
        asm = createOrganismAssembly(agent, sharedUniforms, profile);
        assemblies.set(agent.id, asm);
        scene.add(asm.group);
      }

      const isolatedOut = anatomyState.active && selectedId && agent.id !== selectedId;
      asm.group.visible = !isolatedOut;
      if (!asm.group.visible) continue;

      const lx = THREE.MathUtils.lerp(agent.previous.x, agent.x, alpha);
      const ly = THREE.MathUtils.lerp(agent.previous.y, agent.y, alpha);
      const lz = THREE.MathUtils.lerp(agent.previous.z, agent.z, alpha);
      const lAngle = shortestAngleLerp(agent.previous.angle, agent.angle, alpha);

      if (!asm.dynamicParts.filamentSegments) {
        asm.group.position.set(lx, ly, lz);
        if (anatomyState.active && agent.id === selectedId) {
          asm.group.rotation.set(anatomyState.pitch, anatomyState.yaw, lAngle);
        } else {
          asm.group.rotation.set(
            Math.sin(animTime * 0.45 + agent.phase) * 0.14,
            Math.cos(animTime * 0.55 + agent.phase) * 0.18,
            lAngle,
          );
        }
      }

      const dofFactor = 0.22 + sharedUniforms.uNA.value * 0.36;
      const blur = anatomyState.active && agent.id === selectedId ? 0 : Math.min(1.85, Math.abs(lz - focus) * dofFactor);
      const isSelected = agent.id === selectedId;
      updateOrganismAssembly(
        asm,
        agent,
        animTime,
        blur,
        light,
        isSelected ? anatomyState.highlightOrganelle : null,
        isSelected && anatomyState.active ? anatomyState.membraneAlpha : 1.0,
      );
    }

    // Remove organismos que saíram da simulação (predados/reset)
    for (const [id, asm] of assemblies.entries()) {
      if (!activeIds.has(id)) {
        scene.remove(asm.group);
        for (const m of asm.materials) m.dispose();
        assemblies.delete(id);
      }
    }

    // Trajetória do selecionado
    const selAgent = selectedId ? simulation.getAgentById(selectedId) : null;
    if (trailsVisible && selAgent && selAgent.trail.length > 1) {
      trailLine.visible = true;
      const len = Math.min(64, selAgent.trail.length);
      for (let i = 0; i < len; i++) {
        const p = selAgent.trail[selAgent.trail.length - len + i];
        trailPos[i * 3] = p.x;
        trailPos[i * 3 + 1] = p.y;
        trailPos[i * 3 + 2] = p.z;
      }
      trailGeo.setDrawRange(0, len);
      trailGeo.attributes.position.needsUpdate = true;
    } else {
      trailLine.visible = false;
    }

    // Alimento suspenso colorido por categoria
    const foodPalette = {
      organic: [0.90, 0.88, 0.42],
      bacteria: [0.68, 0.92, 0.78],
      microalgae: [0.42, 0.86, 0.48],
      detritus: [0.76, 0.58, 0.38],
      nutrients: [0.50, 0.86, 0.94],
    };
    let ptIdx = 0;
    for (const item of simulation.food) {
      const col = foodPalette[item.type] || foodPalette.organic;
      for (let i = 0; i < 14 && ptIdx < maxFoodPts; i++) {
        const ang = i * 2.399963 + t * 0.42;
        const spread = 0.07 + (item.maxRemaining - item.remaining) * 0.008 + i / 65;
        foodPos.setXYZ(ptIdx, item.x + Math.cos(ang) * spread, item.y + Math.sin(ang) * spread, item.z + 0.25);
        foodTint.setXYZ(ptIdx, col[0], col[1], col[2]);
        ptIdx++;
      }
    }
    foodGeo.setDrawRange(0, ptIdx);
    foodPos.needsUpdate = true;
    foodTint.needsUpdate = true;

    renderer.render(scene, camera);
  }

  // Empilhamento de foco (focus stacking) em 5 planos Z
  function focusStack(simulation, view) {
    const originalFocus = view.focus;
    const planes = [-1.4, -0.7, 0, 0.7, 1.4].map((d) => THREE.MathUtils.clamp(originalFocus + d, -3.2, 3.2));
    const w = canvas.width;
    const h = canvas.height;
    const buffers = [];

    for (const z of planes) {
      render(simulation, {...view, focus: z}, 1);
      const off = document.createElement('canvas');
      off.width = w;
      off.height = h;
      const ctx = off.getContext('2d');
      ctx.drawImage(canvas, 0, 0);
      buffers.push(ctx.getImageData(0, 0, w, h).data);
    }
    view.focus = originalFocus;
    render(simulation, view, 1);

    const outCanvas = document.createElement('canvas');
    outCanvas.width = w;
    outCanvas.height = h;
    const outCtx = outCanvas.getContext('2d');
    const outImg = outCtx.createImageData(w, h);
    const out = outImg.data;
    const stride = w * 4;

    for (let y = 1; y < h - 1; y++) {
      for (let x = 1; x < w - 1; x++) {
        const idx = (y * w + x) * 4;
        let bestBuf = buffers[2];
        let bestScore = -1;
        for (let b = 0; b < buffers.length; b++) {
          const data = buffers[b];
          const c = data[idx] + data[idx + 1] + data[idx + 2];
          const gx = Math.abs(c - (data[idx + 4] + data[idx + 5] + data[idx + 6]));
          const gy = Math.abs(c - (data[idx + stride] + data[idx + stride + 1] + data[idx + stride + 2]));
          const score = gx + gy;
          if (score > bestScore) {
            bestScore = score;
            bestBuf = data;
          }
        }
        out[idx] = bestBuf[idx];
        out[idx + 1] = bestBuf[idx + 1];
        out[idx + 2] = bestBuf[idx + 2];
        out[idx + 3] = 255;
      }
    }
    outCtx.putImageData(outImg, 0, 0);
    return outCanvas;
  }

  resize();

  return {
    canvas,
    render,
    worldAt,
    targetAt,
    targetCandidatesAt,
    unitsPerPixel,
    focusStack,
    setOpticMode(mode) {
      if (!(mode in OPTIC_MODES)) return;
      opticMode = mode;
      sharedUniforms.uOpticMode.value = OPTIC_MODES[mode].id;
    },
    getOpticMode() { return opticMode; },
    setFluorescenceChannel(ch) {
      sharedUniforms.uFluorescenceChannel.value = ch;
    },
    setObjective(idx) {
      objectiveIndex = Math.max(0, Math.min(OBJECTIVES.length - 1, idx));
      return OBJECTIVES[objectiveIndex];
    },
    setAnatomyState(next) {
      Object.assign(anatomyState, next);
    },
    setTrailsVisible(v) { trailsVisible = Boolean(v); },
    setGridVisible(v) { gridLines.visible = Boolean(v); },
    quality(value) {
      if (!(value in {low: 1, medium: 1, high: 1, ultra: 1})) return;
      profile = value;
      resize();
    },
    dispose() {
      observer.disconnect();
      const resource = new Set();
      scene.traverse((object) => {
        if (object.geometry) resource.add(object.geometry);
        if (object.material) resource.add(object.material);
      });
      for (const item of resource) item.dispose();
      assemblies.clear();
      renderer.dispose();
      canvas.remove();
    },
  };
}
