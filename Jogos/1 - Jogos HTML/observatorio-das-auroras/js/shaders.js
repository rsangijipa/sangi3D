/**
 * js/shaders.js
 * Shaders GLSL dedicados:
 *  1) Cúpula do céu ártico responsivo à hora (crepúsculo / meia-noite / aurora difusa no horizonte)
 *  2) Cortinas paramétricas de Aurora Boreal (espectro O 557.7nm verde + N2+ violeta/carmim)
 *  3) Campo de estrelas com temperatura de cor Planckiana e cintilação controlada
 *
 * Todos os shaders evitam inicialização em uniforms, normalizam vetores no fragment
 * e mantêm smoothstep estritamente monotônico (e0 < e1) para portabilidade WebGL2.
 */
import * as THREE from 'three';

export function createNightSkyMaterial() {
  return new THREE.ShaderMaterial({
    side: THREE.BackSide,
    depthWrite: false,
    uniforms: {
      uHour: { value: 0.52 },
      uIntensity: { value: 0.82 },
      uSimTime: { value: 0.0 },
    },
    vertexShader: /* glsl */ `
      varying vec3 vLocalDir;
      void main() {
        vLocalDir = normalize(position);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: /* glsl */ `
      precision highp float;
      varying vec3 vLocalDir;

      uniform float uHour;
      uniform float uIntensity;
      uniform float uSimTime;

      float hash21(vec2 p) {
        p = fract(p * vec2(123.34, 456.21));
        p += dot(p, p + 45.32);
        return fract(p.x * p.y);
      }

      float noise2(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        vec2 u = f * f * (3.0 - 2.0 * f);
        float a = hash21(i);
        float b = hash21(i + vec2(1.0, 0.0));
        float c = hash21(i + vec2(0.0, 1.0));
        float d = hash21(i + vec2(1.0, 1.0));
        return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
      }

      void main() {
        vec3 dir = normalize(vLocalDir);
        float elev = clamp(dir.y, -0.2, 1.0);

        // Crepúsculo (0) -> Meia-noite (0.5) -> Alvorada ártica (1.0)
        float dusk = 1.0 - smoothstep(0.0, 0.36, uHour);
        float dawn = smoothstep(0.70, 1.0, uHour);
        float twilight = clamp(dusk + dawn, 0.0, 1.0);

        vec3 zenithNight = vec3(0.015, 0.028, 0.072);
        vec3 horizonNight = vec3(0.062, 0.110, 0.195);

        vec3 zenithTwilight = vec3(0.055, 0.085, 0.195);
        vec3 horizonDusk = vec3(0.24, 0.19, 0.34);
        vec3 horizonDawn = vec3(0.22, 0.25, 0.38);

        vec3 zenithCol = mix(zenithNight, zenithTwilight, twilight * 0.72);
        vec3 horizBase = mix(horizonDusk, horizonDawn, step(0.5, uHour));
        vec3 horizCol = mix(horizonNight, horizBase, twilight * 0.85);

        float grad = pow(clamp(1.0 - max(elev, 0.0), 0.0, 1.0), 2.15);
        vec3 sky = mix(zenithCol, horizCol, grad);

        // Faixa sutil da Via Láctea visível sobretudo na meia-noite escura
        float milkyMask = (1.0 - twilight * 0.75) * smoothstep(0.05, 0.38, elev);
        float bandCoord = dir.x * 0.55 + dir.y * 0.45 - dir.z * 0.35;
        float milkyBand = exp(-abs(bandCoord) * 5.2);
        float dust = noise2(dir.xz * 7.0 + vec2(uSimTime * 0.002, 1.4));
        sky += vec3(0.045, 0.062, 0.095) * milkyBand * dust * milkyMask;

        // Airglow esmeralda discreto próximo ao norte proporcional à atividade geomagnética
        float northFactor = smoothstep(-0.2, 0.85, -dir.z);
        float glowBand = exp(-pow((elev - 0.12) * 5.0, 2.0));
        sky += vec3(0.04, 0.17, 0.13) * glowBand * northFactor * clamp(uIntensity, 0.0, 1.0);

        gl_FragColor = vec4(sky, 1.0);
      }
    `,
  });
}

export function createAuroraCurtainMaterial(layerSeed = 0.0) {
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uSimTime: { value: 0.0 },
      uPhase: { value: 0.0 },
      uIntensity: { value: 0.82 },
      uWaveAmp: { value: 1.35 },
      uWaveFreq: { value: 1.15 },
      uVioletMix: { value: 0.58 },
      uLayerSeed: { value: layerSeed },
      uMotionScale: { value: 1.0 },
    },
    vertexShader: /* glsl */ `
      varying vec2 vUv;
      varying vec3 vWorldPos;

      uniform float uPhase;
      uniform float uWaveAmp;
      uniform float uWaveFreq;
      uniform float uLayerSeed;
      uniform float uMotionScale;

      void main() {
        vUv = uv;
        vec3 pos = position;

        float h = uv.y;
        float p = uv.x * 6.28318 * uWaveFreq + uLayerSeed * 2.4;
        float t = uPhase * (0.65 + uLayerSeed * 0.15) * uMotionScale;

        // Ondulação contínua de cortina em dois harmônicos + leve cisalhamento vertical
        float swayZ = sin(p + t) * uWaveAmp * 2.1 + cos(p * 2.1 - t * 0.72) * uWaveAmp * 0.85;
        float swayX = cos(p * 1.4 + t * 0.55) * uWaveAmp * 0.65;

        pos.z += swayZ * (0.45 + 0.55 * h);
        pos.x += swayX * (0.35 + 0.65 * h);
        // Cortinas sobem alongadas para o alto do céu
        pos.y += sin(p * 0.8 + t * 0.4) * 1.25 * h;

        vec4 wp = modelMatrix * vec4(pos, 1.0);
        vWorldPos = wp.xyz;
        gl_Position = projectionMatrix * viewMatrix * wp;
      }
    `,
    fragmentShader: /* glsl */ `
      precision highp float;
      varying vec2 vUv;
      varying vec3 vWorldPos;

      uniform float uSimTime;
      uniform float uPhase;
      uniform float uIntensity;
      uniform float uVioletMix;
      uniform float uLayerSeed;
      uniform float uMotionScale;

      float hash(vec2 p) {
        p = fract(p * vec2(234.34, 435.345));
        p += dot(p, p + 34.23);
        return fract(p.x * p.y);
      }

      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        vec2 u = f * f * (3.0 - 2.0 * f);
        float a = hash(i);
        float b = hash(i + vec2(1.0, 0.0));
        float c = hash(i + vec2(0.0, 1.0));
        float d = hash(i + vec2(1.0, 1.0));
        return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
      }

      float fbm(vec2 p) {
        float v = 0.0;
        float amp = 0.5;
        for (int i = 0; i < 4; i++) {
          v += amp * noise(p);
          p = p * 2.03 + vec2(13.1, 7.7);
          amp *= 0.5;
        }
        return v;
      }

      void main() {
        float inten = clamp(uIntensity, 0.0, 1.0);
        if (inten <= 0.001) {
          discard;
        }

        float t = uPhase * 0.38 * uMotionScale;

        // Estrias verticais características da precipitação eletrônica
        float rayA = fbm(vec2(vUv.x * 24.0 + t * 0.45 + uLayerSeed * 4.1, vUv.y * 1.6 - t * 0.18));
        float rayB = fbm(vec2(vUv.x * 52.0 - t * 0.72 + uLayerSeed * 7.3, vUv.y * 2.8));
        float rays = pow(clamp(rayA * 0.68 + rayB * 0.42, 0.0, 1.0), 1.65);

        // Envelopes suaves nas extremidades laterais e vertical (sem bordas duras)
        float edgeX = smoothstep(0.0, 0.16, vUv.x) * (1.0 - smoothstep(0.84, 1.0, vUv.x));
        float lowerCut = smoothstep(0.0, 0.14, vUv.y);
        float upperFade = pow(1.0 - smoothstep(0.18, 1.0, vUv.y), 1.35);
        float brightCore = exp(-pow((vUv.y - 0.18) * 4.5, 2.0)) * 0.55 + 0.45;

        // Espectro físico aproximado: verde 557.7nm dominante + topo violeta + franja baixa rosada
        vec3 greenBand = vec3(0.16, 0.96, 0.54);
        vec3 tealMid   = vec3(0.14, 0.80, 0.78);
        vec3 violetTop = vec3(0.64, 0.25, 1.00);
        vec3 crimsonEdge = vec3(0.86, 0.24, 0.52);

        float altMix = smoothstep(0.18, 0.56, vUv.y);
        vec3 col = mix(greenBand, tealMid, smoothstep(0.08, 0.30, vUv.y));
        col = mix(col, violetTop, altMix * clamp(uVioletMix, 0.20, 1.0));

        float lowFringe = exp(-pow((vUv.y - 0.06) * 14.0, 2.0)) * smoothstep(0.45, 1.0, inten);
        col = mix(col, crimsonEdge, lowFringe * 0.48);

        float alpha = edgeX * lowerCut * upperFade * brightCore * (0.28 + rays * 0.95) * inten;
        alpha = clamp(alpha, 0.0, 0.92);

        // T01: uIntensity == 0 remove completamente qualquer emissão
        vec3 emission = col * alpha * (1.15 + inten * 0.55);
        gl_FragColor = vec4(emission, alpha);
      }
    `,
  });
}

export function createStarfieldMaterial() {
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uSimTime: { value: 0.0 },
      uMotionScale: { value: 1.0 },
      uVisibility: { value: 1.0 },
    },
    vertexShader: /* glsl */ `
      attribute float aSize;
      attribute float aPhase;
      attribute vec3 aColor;

      varying vec3 vColor;
      varying float vTwinkle;

      uniform float uSimTime;
      uniform float uMotionScale;

      void main() {
        vColor = aColor;
        float speed = (1.1 + fract(aPhase) * 1.4) * uMotionScale;
        vTwinkle = 0.72 + 0.28 * sin(uSimTime * speed + aPhase * 6.28318);

        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = aSize * (280.0 / max(20.0, -mvPosition.z));
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: /* glsl */ `
      precision highp float;
      varying vec3 vColor;
      varying float vTwinkle;
      uniform float uVisibility;

      void main() {
        vec2 c = gl_PointCoord - vec2(0.5);
        float d = length(c) * 2.0;
        if (d > 1.0) discard;
        float core = exp(-d * d * 4.5);
        float alpha = core * vTwinkle * clamp(uVisibility, 0.0, 1.0);
        gl_FragColor = vec4(vColor * alpha, alpha);
      }
    `,
  });
}
