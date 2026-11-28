/**
 * js/water-stream.js
 * Shader realista de riacho noturno para WebGL (Three.js r187):
 * - Fluxo direcional contínuo com múltiplas escalas de onda e micro-ondulações normais
 * - Absorção dependente da profundidade sobre leito rochoso real
 * - Espuma não uniforme concentrada em margens e obstáculos (pedras de corredeira)
 * - Reflexo Fresnel do céu, coluna especular da Lua cheia e brilho quente dos lampiões
 */
import * as THREE from 'three';
import {
  WATER_LEVEL,
  streamCenterX,
  streamHalfWidth,
  terrainHeight,
} from './math-terrain.js';

export function createStreamSystem(scene, boulderObstacles = []) {
  const segW = 40;
  const segL = 148;
  const zMin = -62;
  const zMax = 18;

  const positions = [];
  const uvs = [];
  const depths = [];
  const edgeFoams = [];
  const rockWakes = [];
  const indices = [];

  for (let iz = 0; iz <= segL; iz++) {
    const tZ = iz / segL;
    const z = zMin + tZ * (zMax - zMin);
    const cx = streamCenterX(z);
    const hw = streamHalfWidth(z) * 1.18;

    for (let ix = 0; ix <= segW; ix++) {
      const tX = ix / segW;
      const lat = tX * 2 - 1;
      const x = cx + lat * hw;
      const bedY = terrainHeight(x, z);
      const depth = Math.max(0.0, WATER_LEVEL - bedY);

      // Espuma natural nas margens rasas e correnteza central
      const bankFactor = Math.exp(-Math.pow(Math.max(0, depth) / 0.14, 1.8));
      let wake = 0;
      for (let b = 0; b < boulderObstacles.length; b++) {
        const ob = boulderObstacles[b];
        const dx = x - ob.x;
        const dz = z - ob.z;
        const dist = Math.hypot(dx, dz);
        // Esteira alongada à jusante (+Z) ao redor da pedra
        const downstreamBias = dz > 0 ? 1.55 : 0.9;
        const eff = Math.max(0, 1 - dist / (ob.r * 2.05 * downstreamBias));
        wake = Math.max(wake, eff * eff);
      }

      positions.push(x, WATER_LEVEL, z);
      uvs.push(tX, tZ * 14.0);
      depths.push(depth);
      edgeFoams.push(bankFactor);
      rockWakes.push(wake);

      if (iz < segL && ix < segW) {
        const a = iz * (segW + 1) + ix;
        const b = a + segW + 1;
        indices.push(a, b, a + 1, b, b + 1, a + 1);
      }
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geo.setAttribute('aDepth', new THREE.Float32BufferAttribute(depths, 1));
  geo.setAttribute('aEdgeFoam', new THREE.Float32BufferAttribute(edgeFoams, 1));
  geo.setAttribute('aRockWake', new THREE.Float32BufferAttribute(rockWakes, 1));
  geo.setIndex(indices);
  geo.computeVertexNormals();

  const uniforms = {
    uTime: { value: 0 },
    uFlowSpeed: { value: 1.0 },
    uMotionScale: { value: 1.0 },
    uSkyZenith: { value: new THREE.Color(0x0c1e3a) },
    uSkyHorizon: { value: new THREE.Color(0x1f3d58) },
    uMoonDir: { value: new THREE.Vector3(0.28, 0.42, -0.86).normalize() },
    uMoonColor: { value: new THREE.Color(0xdce8ff) },
    uMoonStrength: { value: 1.0 },
    uLanternPos: { value: new THREE.Vector3(-2.6, 1.85, 3.6) },
    uLanternColor: { value: new THREE.Color(0xff9f38) },
    uLanternIntensity: { value: 1.0 },
    uFogColor: { value: new THREE.Color(0x0a1728) },
    uFogDensity: { value: 0.022 },
  };

  const mat = new THREE.ShaderMaterial({
    uniforms,
    transparent: true,
    depthWrite: false,
    vertexShader: /* glsl */ `
      uniform float uTime;
      uniform float uMotionScale;
      attribute float aDepth;
      attribute float aEdgeFoam;
      attribute float aRockWake;
      varying vec3 vWorldPos;
      varying vec2 vStreamUv;
      varying float vDepth;
      varying float vEdgeFoam;
      varying float vRockWake;

      void main() {
        vStreamUv = uv;
        vDepth = aDepth;
        vEdgeFoam = aEdgeFoam;
        vRockWake = aRockWake;

        vec3 p = position;
        float t = uTime * uMotionScale;
        // Ondas amplas e sutis só nas áreas com lâmina d'água real
        float damp = smoothstep(0.0, 0.18, aDepth);
        float swell = sin(p.z * 1.45 - t * 2.1 + p.x * 0.9) * 0.014
                    + cos(p.z * 2.65 - t * 3.0 - p.x * 1.4) * 0.008;
        p.y += swell * damp;

        vec4 wp = modelMatrix * vec4(p, 1.0);
        vWorldPos = wp.xyz;
        gl_Position = projectionMatrix * viewMatrix * wp;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform float uTime;
      uniform float uMotionScale;
      uniform vec3 uSkyZenith;
      uniform vec3 uSkyHorizon;
      uniform vec3 uMoonDir;
      uniform vec3 uMoonColor;
      uniform float uMoonStrength;
      uniform vec3 uLanternPos;
      uniform vec3 uLanternColor;
      uniform float uLanternIntensity;
      uniform vec3 uFogColor;
      uniform float uFogDensity;

      varying vec3 vWorldPos;
      varying vec2 vStreamUv;
      varying float vDepth;
      varying float vEdgeFoam;
      varying float vRockWake;

      float hash(vec2 p) {
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
      }
      float vnoise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(
          mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
          mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
          u.y
        );
      }

      float waveHeight(vec2 p, float t) {
        // Ondas analíticas multi-escala (4x mais rápidas em WebGL software/móvel que múltiplas fbm)
        float w1 = sin(p.x * 2.1 + p.y * 1.4 - t * 2.2) * 0.45
                 + cos(p.x * 1.3 - p.y * 2.3 + t * 1.8) * 0.32;
        float w2 = sin(p.x * 5.2 - p.y * 4.6 - t * 3.6) * 0.22
                 + cos(p.x * 6.8 + p.y * 5.1 - t * 4.1) * 0.14;
        float w3 = sin(p.x * 12.5 + p.y * 9.8 - t * 5.2) * 0.07;
        return w1 + w2 + w3;
      }

      void main() {
        float t = uTime * uMotionScale;
        vec2 wp = vWorldPos.xz;

        // Gradiente finito para normal realista das marolas
        float e = 0.08;
        float hC = waveHeight(wp, t);
        float hX = waveHeight(wp + vec2(e, 0.0), t);
        float hZ = waveHeight(wp + vec2(0.0, e), t);
        float rippleBoost = 0.22 + 0.35 * vRockWake;
        vec3 N = normalize(vec3((hC - hX) * rippleBoost / e, 1.0, (hC - hZ) * rippleBoost / e));

        vec3 V = normalize(cameraPosition - vWorldPos);
        float NoV = clamp(dot(N, V), 0.0, 1.0);
        // Fresnel Schlick para dielétrico água (F0 ~ 0.02)
        float fresnel = 0.02 + 0.98 * pow(1.0 - NoV, 4.6);

        // Absorção espectral por profundidade (beira rasa mostra pedras -> canal escuro)
        vec3 shallowTint = vec3(0.08, 0.16, 0.14);
        vec3 deepTint    = vec3(0.015, 0.045, 0.065);
        float depthMix   = smoothstep(0.04, 0.58, vDepth);
        vec3 waterBody   = mix(shallowTint, deepTint, depthMix);

        // Reflexo do céu e copa ao redor
        vec3 R = reflect(-V, N);
        float skyGrad = smoothstep(-0.05, 0.65, R.y);
        vec3 skyRefl = mix(uSkyHorizon * 0.55, uSkyZenith, skyGrad);

        // Coluna brilhante da Lua na água agitada
        vec3 Hmoon = normalize(uMoonDir + V);
        float moonSpec = pow(max(dot(N, Hmoon), 0.0), 140.0) * 1.9
                       + pow(max(dot(N, Hmoon), 0.0), 22.0) * 0.16;
        vec3 moonGlint = uMoonColor * moonSpec * uMoonStrength;

        // Reflexo quente âmbar do lampião próximo na correnteza
        vec3 Lvec = uLanternPos - vWorldPos;
        float lDist = length(Lvec);
        vec3 Ldir = Lvec / max(lDist, 0.001);
        vec3 Hlan = normalize(Ldir + V);
        float lanAtten = 1.0 / (1.0 + lDist * lDist * 0.085);
        float lanSpec = pow(max(dot(N, Hlan), 0.0), 64.0) * 1.65 + max(dot(N, Ldir), 0.0) * 0.18;
        vec3 lanternGlint = uLanternColor * lanSpec * lanAtten * uLanternIntensity;

        // Espuma orgânica somente em pedras submersas / obstáculos e beiradas
        float foamNoise = vnoise(vec2(wp.x * 3.8, wp.y * 2.8 - t * 2.6));
        float foamEdge = smoothstep(0.48, 0.88, vEdgeFoam * 0.72 + foamNoise * 0.48) * vEdgeFoam;
        float foamWake = smoothstep(0.42, 0.85, vRockWake * 0.92 + foamNoise * 0.42) * vRockWake;
        float foam = clamp(foamEdge * 0.55 + foamWake * 0.95, 0.0, 0.92);
        vec3 foamCol = mix(vec3(0.45, 0.55, 0.62), uMoonColor * 0.82, 0.5) + lanternGlint * 0.45;

        vec3 color = mix(waterBody, skyRefl, clamp(fresnel * 0.92, 0.08, 0.95))
                   + moonGlint + lanternGlint;
        color = mix(color, foamCol, foam);

        // Opacidade varia com profundidade e ângulo de visão (raso = deixa ver seixos no leito)
        float alpha = clamp(mix(0.42, 0.94, depthMix) + fresnel * 0.35 + foam * 0.5, 0.28, 0.98);
        // Sutura suave exatamente na linha seca da margem para zero degrau duro
        alpha *= smoothstep(0.0, 0.06, vDepth + vEdgeFoam * 0.05);

        // Neblina atmosférica do vale
        float camDist = length(cameraPosition - vWorldPos);
        float fogFactor = 1.0 - exp(-uFogDensity * uFogDensity * camDist * camDist);
        color = mix(color, uFogColor, clamp(fogFactor, 0.0, 1.0));

        gl_FragColor = vec4(color, alpha);
      }
    `,
  });

  const waterMesh = new THREE.Mesh(geo, mat);
  waterMesh.renderOrder = 2;
  scene.add(waterMesh);

  return {
    mesh: waterMesh,
    uniforms,
    update(time, state, envColors) {
      uniforms.uTime.value = time;
      uniforms.uMotionScale.value = state.reducedMotion ? 0.22 : 1.0;
      uniforms.uSkyZenith.value.copy(envColors.zenith);
      uniforms.uSkyHorizon.value.copy(envColors.horizon);
      uniforms.uMoonDir.value.copy(envColors.moonDir);
      uniforms.uMoonColor.value.copy(envColors.moonColor);
      uniforms.uMoonStrength.value = envColors.moonStrength;
      uniforms.uFogColor.value.copy(envColors.fog);
      uniforms.uLanternIntensity.value = 0.45 + state.brightness * 1.15;
    },
    dispose() {
      geo.dispose();
      mat.dispose();
    },
  };
}
