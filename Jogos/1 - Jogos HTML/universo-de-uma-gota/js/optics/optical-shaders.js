/**
 * Shaders ópticos e materiais microscópicos para Universo de uma Gota 2.0.
 * Implementa aproximações ópticas para 5 modalidades:
 * 0: Campo escuro, 1: Campo claro, 2: Contraste de fase, 3: DIC, 4: Fluorescência simulada.
 * Nota: trata-se de aproximação computacional educativa, não de simulação física rigorosa de frente de onda.
 */

import * as THREE from '../../../../../Sistema/shared/vendor/three.module.js';

export const OPTIC_MODES = {
  darkfield: {id: 0, label: 'CAMPO ESCURO', bg: [0.005, 0.012, 0.02], description: 'Fundo escuro com espalhamento de luz nas bordas e estruturas refrativas.'},
  brightfield: {id: 1, label: 'CAMPO CLARO', bg: [0.91, 0.89, 0.82], description: 'Iluminação transmitida de condensador com absorção e pigmentação natural.'},
  phase: {id: 2, label: 'CONTRASTE DE FASE', bg: [0.38, 0.43, 0.45], description: 'Halos controlados e realce de estruturas transparentes por diferença de fase.'},
  dic: {id: 3, label: 'DIC (INTERFERÊNCIA)', bg: [0.45, 0.49, 0.52], description: 'Iluminação direcional oblíqua com relevo óptico aparente em membranas.'},
  fluorescence: {id: 4, label: 'FLUORESCÊNCIA SIMULADA', bg: [0.004, 0.007, 0.012], description: 'Simulação didática por canais: clorofila (vermelho), núcleo DAPI (azul) e membranas (verde).'},
};

export function createSharedOpticUniforms() {
  return {
    uTime: {value: 0},
    uLight: {value: 1.1},
    uOpticMode: {value: 0},
    uFluorescenceChannel: {value: 0}, // 0: todos, 1: clorofila, 2: núcleo, 3: membrana
    uFocus: {value: 0.2},
    uZoom: {value: 1.0},
    uNA: {value: 0.65},
    uAspect: {value: 1.0},
    uCenter: {value: new THREE.Vector2()},
    uWaterTint: {value: new THREE.Vector3(0.013, 0.056, 0.079)},
    uTurbidity: {value: 0.25},
  };
}

export const FIELD_VERTEX = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.9999, 1.0);
  }
`;

export const FIELD_FRAGMENT = `
  varying vec2 vUv;
  uniform float uAspect;
  uniform float uLight;
  uniform float uTime;
  uniform vec2 uCenter;
  uniform float uZoom;
  uniform int uOpticMode;
  uniform vec3 uWaterTint;
  uniform float uTurbidity;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }
  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
      f.y
    );
  }

  void main() {
    vec2 p = vUv - 0.5;
    vec2 lens = p * vec2(mix(1.14, 0.90, step(1.0, uAspect)), 0.96);
    vec2 drift = p * vec2(uAspect, 1.0) / uZoom + uCenter * 0.033;
    float dist = length(lens);
    float vignette = 1.0 - smoothstep(0.14, 0.76, dist);
    float flood = 1.0 - smoothstep(0.08, 0.65, length(drift - vec2(-0.16, 0.1)));
    float fibers = noise(drift * vec2(13.0, 31.0) + vec2(uTime * 0.04, 0.0)) * noise(drift * 29.0 + 32.0);
    float haze = noise(drift * 6.8 + 21.0) * 0.52 + noise(drift * 10.6 - 12.0) * 0.29 + fibers * 0.35;
    float ring = smoothstep(0.57, 0.587, dist) * (1.0 - smoothstep(0.587, 0.596, dist));

    vec3 color = vec3(0.0);
    if (uOpticMode == 0) {
      // Campo escuro
      color = vec3(0.005, 0.012, 0.02) + (uWaterTint * flood + uWaterTint * 0.75 * haze * (0.6 + uTurbidity)) * vignette * uLight;
      color += vec3(0.074, 0.17, 0.19) * ring * (0.22 + 0.1 * haze);
      color -= smoothstep(0.59, 0.72, dist) * vec3(0.004, 0.008, 0.012);
    } else if (uOpticMode == 1) {
      // Campo claro
      vec3 paper = vec3(0.92, 0.90, 0.83) * clamp(uLight * 0.95, 0.35, 1.2);
      color = paper * (0.72 + 0.28 * vignette) - haze * (0.04 + uTurbidity * 0.05);
      color -= smoothstep(0.56, 0.75, dist) * 0.18;
    } else if (uOpticMode == 2) {
      // Contraste de fase
      vec3 base = vec3(0.37, 0.42, 0.44) * clamp(uLight * 0.92, 0.3, 1.25);
      color = base * (0.76 + 0.24 * vignette) + (haze - 0.4) * 0.04;
      color -= smoothstep(0.56, 0.75, dist) * 0.10;
    } else if (uOpticMode == 3) {
      // DIC
      vec3 base = vec3(0.45, 0.49, 0.52) * clamp(uLight * 0.92, 0.3, 1.25);
      color = base * (0.78 + 0.22 * vignette) + (haze - 0.45) * 0.035;
      color -= smoothstep(0.56, 0.75, dist) * 0.11;
    } else {
      // Fluorescência simulada
      color = vec3(0.004, 0.007, 0.012) + vec3(0.005, 0.012, 0.022) * haze * vignette * 0.4;
      color += vec3(0.03, 0.06, 0.09) * ring * 0.2;
    }

    color += (hash(gl_FragCoord.xy) - 0.5) * 0.009 * vignette;
    gl_FragColor = vec4(max(color, 0.0), 1.0);
  }
`;

export const ORGANISM_VERTEX = `
  varying vec3 vNormalView;
  varying vec3 vViewDir;
  varying vec3 vLocalPos;
  varying vec2 vUv;

  uniform float uTime;
  uniform float uPhase;
  uniform float uDeformAmp;
  uniform float uDeformFreq;
  uniform float uConstriction;

  void main() {
    vUv = uv;
    vec3 pos = position;
    vec3 norm = normal;

    // Deformação orgânica suave e constrição de divisão celular
    if (uDeformAmp > 0.0001) {
      float w = sin(pos.x * uDeformFreq + uTime * 2.6 + uPhase) * cos(pos.y * uDeformFreq * 0.8 - uTime * 1.9);
      pos += norm * w * uDeformAmp;
    }
    if (uConstriction > 0.01) {
      float pinch = exp(-pos.x * pos.x * 18.0) * uConstriction * 0.58;
      pos.yz *= (1.0 - pinch);
    }

    vLocalPos = pos;
    vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
    vNormalView = normalize(normalMatrix * norm);
    vViewDir = normalize(-mvPos.xyz);
    gl_Position = projectionMatrix * mvPos;
  }
`;

export const ORGANISM_FRAGMENT = `
  varying vec3 vNormalView;
  varying vec3 vViewDir;
  varying vec3 vLocalPos;
  varying vec2 vUv;

  uniform vec3 uBaseColor;
  uniform vec3 uRimColor;
  uniform float uOpacity;
  uniform float uBlur;
  uniform float uLight;
  uniform float uTime;
  uniform float uNoiseScale;
  uniform float uStriae;
  uniform int uOpticMode;
  uniform int uFluorescenceChannel;
  uniform int uOrganelleTag; // 0: citoplasma, 1: cloroplasto, 2: núcleo, 3: membrana, 4: vacúolo, 5: sílica/cutícula
  uniform float uHighlight;
  uniform float uFlash;

  float fastGrain(vec3 p) {
    float a = sin(p.x * 3.7 + cos(p.y * 4.3 + p.z * 2.9));
    float b = cos(p.y * 5.1 - sin(p.z * 3.3 + p.x * 4.1));
    return 0.5 + 0.25 * (a + b);
  }

  void main() {
    vec3 N = normalize(vNormalView);
    vec3 V = normalize(vViewDir);
    float ndv = abs(dot(N, V));
    float fresnel = pow(1.0 - ndv, 2.1);

    // Microestrutura celular procedural (grânulos + estrias para diatomáceas)
    float gran = fastGrain(vLocalPos * uNoiseScale + vec3(uTime * 0.15, 0.0, 0.0));
    float stria = uStriae > 0.5 ? (sin(vLocalPos.x * 48.0) * 0.5 + 0.5) * 0.35 + (sin(vLocalPos.y * 36.0) * 0.5 + 0.5) * 0.2 : 0.0;
    float focusSoft = 1.0 - clamp(uBlur * 0.45, 0.0, 0.65);

    vec3 rgb = uBaseColor;
    float alpha = uOpacity;

    if (uOpticMode == 0) {
      // Campo escuro: bordas iluminadas + espalhamento translúcido
      vec3 interior = uBaseColor * (0.45 + 0.55 * gran + stria);
      vec3 rim = uRimColor * (0.65 + 0.75 * fresnel) * focusSoft;
      rgb = mix(interior, rim, clamp(fresnel * 1.15, 0.0, 1.0)) * uLight;
      alpha = mix(uOpacity * 0.52, min(0.96, uOpacity + 0.36), fresnel);
    } else if (uOpticMode == 1) {
      // Campo claro: absorção óptica sobre fundo claro
      float absorb = 0.25 + (1.0 - ndv) * 0.45 + gran * 0.2 + stria * 0.3;
      rgb = mix(vec3(0.88, 0.87, 0.80), uBaseColor * 0.72, absorb) * clamp(uLight * 0.92, 0.35, 1.2);
      alpha = mix(uOpacity * 0.48, min(0.92, uOpacity + 0.25), fresnel * 0.7 + 0.2);
    } else if (uOpticMode == 2) {
      // Contraste de fase: halo brilhante na borda e interior contrastado
      float halo = smoothstep(0.12, 0.35, fresnel) * (1.0 - smoothstep(0.55, 0.92, fresnel));
      vec3 darkCore = uBaseColor * 0.48 + vec3(0.10, 0.14, 0.15) * (gran - 0.3);
      rgb = mix(darkCore, vec3(0.86, 0.93, 0.94), halo * focusSoft + fresnel * 0.35) * clamp(uLight * 0.95, 0.35, 1.2);
      alpha = mix(uOpacity * 0.65, 0.95, fresnel + halo * 0.4);
    } else if (uOpticMode == 3) {
      // DIC: relevo direcional oblíquo
      vec3 shearDir = normalize(vec3(0.72, 0.66, 0.20));
      float relief = dot(N, shearDir) + stria * 0.45 + (gran - 0.5) * 0.25;
      vec3 baseGray = mix(vec3(0.42, 0.46, 0.49), uBaseColor * 0.65 + 0.25, 0.45);
      rgb = (baseGray + relief * 0.34 * focusSoft) * clamp(uLight * 0.95, 0.35, 1.2);
      alpha = mix(uOpacity * 0.7, 0.96, fresnel * 0.6 + 0.25);
    } else {
      // Fluorescência simulada por tag de organela
      vec3 emit = vec3(0.02, 0.04, 0.05);
      float activeMask = 0.08;
      if (uOrganelleTag == 1 && (uFluorescenceChannel == 0 || uFluorescenceChannel == 1)) {
        emit = vec3(0.96, 0.15, 0.16); // Clorofila
        activeMask = 0.95;
      } else if (uOrganelleTag == 2 && (uFluorescenceChannel == 0 || uFluorescenceChannel == 2)) {
        emit = vec3(0.24, 0.56, 1.0); // Núcleo DAPI
        activeMask = 0.98;
      } else if (uOrganelleTag == 3 && (uFluorescenceChannel == 0 || uFluorescenceChannel == 3)) {
        emit = vec3(0.28, 0.92, 0.60); // Membrana
        activeMask = 0.55 + fresnel * 0.45;
      } else if (uOrganelleTag == 4 && uFluorescenceChannel == 0) {
        emit = vec3(0.88, 0.68, 0.26); // Vacúolo
        activeMask = 0.72;
      } else if (uOrganelleTag == 5) {
        emit = vec3(0.38, 0.84, 0.78); // Sílica / Cutícula
        activeMask = 0.38 + fresnel * 0.4;
      }
      rgb = emit * activeMask * uLight * (0.7 + 0.3 * gran);
      alpha = clamp(activeMask * (0.55 + fresnel * 0.45), 0.12, 0.96);
    }

    // Realce de organela selecionada / alimentação
    rgb += vec3(0.25, 0.75, 0.65) * uHighlight * (0.35 + fresnel * 0.65);
    rgb += vec3(0.18, 0.26, 0.10) * uFlash;

    // Atenuação suave quando fora de foco
    alpha *= (1.0 - clamp(uBlur * 0.34, 0.0, 0.52));
    gl_FragColor = vec4(max(rgb, 0.0), clamp(alpha, 0.02, 0.98));
  }
`;

export function createOrganismMaterial(sharedUniforms, opts = {}) {
  return new THREE.ShaderMaterial({
    uniforms: {
      uTime: sharedUniforms.uTime,
      uLight: sharedUniforms.uLight,
      uOpticMode: sharedUniforms.uOpticMode,
      uFluorescenceChannel: sharedUniforms.uFluorescenceChannel,
      uBaseColor: {value: new THREE.Color(opts.baseColor || '#3c7a7e')},
      uRimColor: {value: new THREE.Color(opts.rimColor || '#a5edda')},
      uOpacity: {value: opts.opacity ?? 0.62},
      uBlur: {value: 0},
      uPhase: {value: opts.phase ?? 0},
      uDeformAmp: {value: opts.deformAmp ?? 0.015},
      uDeformFreq: {value: opts.deformFreq ?? 4.0},
      uConstriction: {value: 0},
      uNoiseScale: {value: opts.noiseScale ?? 6.5},
      uStriae: {value: opts.striae ?? 0.0},
      uOrganelleTag: {value: opts.organelleTag ?? 0},
      uHighlight: {value: 0},
      uFlash: {value: 0},
    },
    vertexShader: ORGANISM_VERTEX,
    fragmentShader: ORGANISM_FRAGMENT,
    transparent: true,
    depthWrite: opts.depthWrite ?? false,
    side: opts.side ?? THREE.FrontSide,
  });
}
