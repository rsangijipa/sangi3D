import * as THREE from 'three';
import { rng } from './noise';

/**
 * Efeitos de "motor de jogo": poeira suspensa iluminada pelos fachos de luz, fachos volumétricos,
 * chamas de vela, fumaça de incenso, vaga-lumes, chuva, folhas caindo e céu dinâmico.
 * Tudo roda na GPU via shaders (partículas) para manter a cena fluida.
 */

const GLSL_NOISE = /* glsl */ `
  float hash12(vec2 p){ vec3 p3 = fract(vec3(p.xyx) * .1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
  float vnoise(vec2 p){ vec2 i = floor(p); vec2 f = fract(p); vec2 u = f*f*(3.0-2.0*f);
    return mix(mix(hash12(i), hash12(i+vec2(1,0)), u.x), mix(hash12(i+vec2(0,1)), hash12(i+vec2(1,1)), u.x), u.y); }
  float fbm(vec2 p){ float s = 0.0; float a = 0.5; for(int i=0;i<5;i++){ s += a*vnoise(p); p = p*2.03 + 17.1; a *= 0.5; } return s; }
`;

function noAO<T extends THREE.Object3D>(o: T): T {
  o.userData.noAO = true;
  o.castShadow = false;
  o.receiveShadow = false;
  return o;
}

/* ------------------------------------------------------------------ */
/* Poeira em suspensão (brilha mais dentro dos fachos de luz)            */
/* ------------------------------------------------------------------ */

export interface Beam {
  origin: THREE.Vector3;
  dir: THREE.Vector3; // normalizado
  length: number;
  radius: number;
}

export function createDust(o: {
  count: number;
  min: THREE.Vector3;
  max: THREE.Vector3;
  color?: THREE.ColorRepresentation;
  size?: number;
  base?: number;
  beams?: Beam[];
  seed?: number;
}) {
  const r = rng(o.seed ?? 7);
  const pos = new Float32Array(o.count * 3);
  const rnd = new Float32Array(o.count);
  for (let i = 0; i < o.count; i++) {
    pos[i * 3] = o.min.x + r() * (o.max.x - o.min.x);
    pos[i * 3 + 1] = o.min.y + r() * (o.max.y - o.min.y);
    pos[i * 3 + 2] = o.min.z + r() * (o.max.z - o.min.z);
    rnd[i] = r();
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  g.setAttribute('aRand', new THREE.BufferAttribute(rnd, 1));
  const beams = (o.beams ?? []).slice(0, 4);
  const beamA = Array.from({ length: 4 }, (_, i) =>
    beams[i] ? new THREE.Vector4(beams[i].origin.x, beams[i].origin.y, beams[i].origin.z, beams[i].radius) : new THREE.Vector4(),
  );
  const beamB = Array.from({ length: 4 }, (_, i) =>
    beams[i] ? new THREE.Vector4(beams[i].dir.x, beams[i].dir.y, beams[i].dir.z, beams[i].length) : new THREE.Vector4(),
  );
  const mat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uTime: { value: 0 },
      uSize: { value: o.size ?? 9 },
      uPR: { value: Math.min(window.devicePixelRatio, 2) },
      uMin: { value: o.min },
      uMax: { value: o.max },
      uColor: { value: new THREE.Color(o.color ?? '#ffe2b8') },
      uBase: { value: o.base ?? (beams.length ? 0.06 : 0.6) },
      uOpacity: { value: 1 },
      uBeamA: { value: beamA },
      uBeamB: { value: beamB },
      uBeamCount: { value: beams.length },
    },
    vertexShader: /* glsl */ `
      uniform float uTime, uSize, uPR, uBase, uBeamCount;
      uniform vec3 uMin, uMax;
      uniform vec4 uBeamA[4];
      uniform vec4 uBeamB[4];
      attribute float aRand;
      varying float vAlpha;
      void main(){
        vec3 p = position;
        vec3 size = uMax - uMin;
        p += vec3(sin(uTime*0.11 + aRand*40.0)*0.35 + uTime*0.012,
                  sin(uTime*0.07 + aRand*13.0)*0.2 + uTime*0.008*(aRand-0.3),
                  cos(uTime*0.09 + aRand*23.0)*0.35);
        p = uMin + mod(p - uMin, size);
        float beam = 0.0;
        for (int i = 0; i < 4; i++) {
          if (float(i) >= uBeamCount) break;
          vec3 a = uBeamA[i].xyz; vec3 d = uBeamB[i].xyz;
          float t = dot(p - a, d);
          float dist = length((p - a) - d * t);
          float inside = smoothstep(uBeamA[i].w, uBeamA[i].w * 0.35, dist) * step(0.0, t) * step(t, uBeamB[i].w);
          beam = max(beam, inside * (1.0 - t / uBeamB[i].w * 0.6));
        }
        if (uBeamCount < 0.5) beam = 1.0;
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        gl_PointSize = uSize * uPR * (0.35 + aRand) / max(0.1, -mv.z);
        float tw = 0.55 + 0.45 * sin(uTime * (0.6 + aRand * 2.0) + aRand * 30.0);
        vAlpha = mix(uBase, 1.0, beam) * tw;
        gl_Position = projectionMatrix * mv;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform vec3 uColor; uniform float uOpacity; varying float vAlpha;
      void main(){
        float d = length(gl_PointCoord - 0.5);
        float a = smoothstep(0.5, 0.0, d); a *= a;
        gl_FragColor = vec4(uColor * 1.6, a * vAlpha * uOpacity);
      }
    `,
  });
  const points = noAO(new THREE.Points(g, mat));
  points.frustumCulled = false;
  return {
    object: points,
    material: mat,
    setBeams(list: Beam[]) {
      list.slice(0, 4).forEach((b, i) => {
        beamA[i].set(b.origin.x, b.origin.y, b.origin.z, b.radius);
        beamB[i].set(b.dir.x, b.dir.y, b.dir.z, b.length);
      });
    },
    update(t: number) {
      mat.uniforms.uTime.value = t;
    },
  };
}

/* ------------------------------------------------------------------ */
/* Facho de luz volumétrico (janela → chão)                               */
/* ------------------------------------------------------------------ */

export function createLightShaft(o: {
  corners: THREE.Vector3[]; // 4 cantos da abertura, em ordem
  dir: THREE.Vector3; // direção da luz (normalizada)
  length: number;
  color?: THREE.ColorRepresentation;
  intensity?: number;
  spread?: number;
}) {
  const spread = o.spread ?? 1.08;
  const center = new THREE.Vector3();
  o.corners.forEach((c) => center.add(c));
  center.multiplyScalar(0.25);
  const uv: number[] = [];
  for (let i = 0; i < 4; i++) uv.push(i, 0, i + 1, 0, i + 1, 1, i, 0, i + 1, 1, i, 1);
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(new Float32Array(72), 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  const build = (dir: THREE.Vector3, length: number) => {
    const far = o.corners.map((c) => c.clone().sub(center).multiplyScalar(spread).add(center).addScaledVector(dir, length));
    const p = g.attributes.position as THREE.BufferAttribute;
    let k = 0;
    const put = (v: THREE.Vector3) => p.setXYZ(k++, v.x, v.y, v.z);
    for (let i = 0; i < 4; i++) {
      const a = o.corners[i];
      const b = o.corners[(i + 1) % 4];
      const c = far[(i + 1) % 4];
      const d = far[i];
      put(a);
      put(b);
      put(c);
      put(a);
      put(c);
      put(d);
    }
    p.needsUpdate = true;
    g.computeVertexNormals();
    g.computeBoundingSphere();
  };
  build(o.dir, o.length);
  const mat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uTime: { value: 0 },
      uColor: { value: new THREE.Color(o.color ?? '#ffd29a') },
      uIntensity: { value: o.intensity ?? 0.35 },
    },
    vertexShader: /* glsl */ `
      varying vec2 vUv; varying vec3 vN; varying vec3 vView; varying vec3 vW;
      void main(){
        vUv = uv;
        vec4 w = modelMatrix * vec4(position, 1.0);
        vW = w.xyz;
        vN = normalize(mat3(modelMatrix) * normal);
        vView = normalize(cameraPosition - w.xyz);
        gl_Position = projectionMatrix * viewMatrix * w;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform float uTime, uIntensity; uniform vec3 uColor;
      varying vec2 vUv; varying vec3 vN; varying vec3 vView; varying vec3 vW;
      ${GLSL_NOISE}
      void main(){
        float along = clamp(vUv.y, 0.0, 1.0);
        float fade = pow(1.0 - along, 1.6) * smoothstep(0.0, 0.08, along);
        float edge = pow(abs(dot(normalize(vN), normalize(vView))), 1.4);
        float side = fract(vUv.x);
        float soft = smoothstep(0.0, 0.18, side) * smoothstep(1.0, 0.82, side);
        float streak = 0.65 + 0.35 * fbm(vec2(vUv.x * 6.0 + vW.y * 0.3, along * 2.0 - uTime * 0.04));
        float near = smoothstep(0.4, 2.2, distance(cameraPosition, vW));
        float a = fade * edge * mix(0.55, 1.0, soft) * streak * uIntensity * near;
        gl_FragColor = vec4(uColor * a, a);
      }
    `,
  });
  const mesh = noAO(new THREE.Mesh(g, mat));
  mesh.renderOrder = 5;
  return {
    object: mesh,
    material: mat,
    setDir: build,
    update(t: number) {
      mat.uniforms.uTime.value = t;
    },
  };
}

/* ------------------------------------------------------------------ */
/* Chama de vela com luz pontual cintilante                               */
/* ------------------------------------------------------------------ */

const flameGeometry = (() => {
  const g = new THREE.SphereGeometry(1, 20, 16);
  const p = g.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < p.count; i++) {
    const y = p.getY(i);
    const k = y > 0 ? 1 - Math.pow(y, 1.5) * 0.92 : 1 - Math.pow(-y, 2) * 0.35;
    p.setXYZ(i, p.getX(i) * k, y * (y > 0 ? 2.6 : 0.9), p.getZ(i) * k);
  }
  g.computeVertexNormals();
  return g;
})();

export function createFlame(o: { size?: number; light?: boolean; lightIntensity?: number; seed?: number; distance?: number }) {
  const size = o.size ?? 0.012;
  const seed = o.seed ?? Math.random() * 100;
  const group = new THREE.Group();
  const mat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: { uTime: { value: 0 }, uSeed: { value: seed }, uLit: { value: 1 } },
    vertexShader: /* glsl */ `
      uniform float uTime, uSeed, uLit;
      varying float vY; varying vec3 vN; varying vec3 vV;
      void main(){
        vec3 p = position;
        float h = clamp(p.y / 2.6, 0.0, 1.0);
        p.x += sin(uTime * 9.0 + uSeed + p.y * 2.0) * 0.12 * h * h + sin(uTime * 23.0 + uSeed * 3.0) * 0.04 * h;
        p.z += cos(uTime * 7.0 + uSeed * 2.0 + p.y * 1.5) * 0.1 * h * h;
        p.y *= 0.92 + 0.12 * sin(uTime * 13.0 + uSeed);
        p *= uLit;
        vY = position.y;
        vec4 w = modelMatrix * vec4(p, 1.0);
        vN = normalize(mat3(modelMatrix) * normal);
        vV = normalize(cameraPosition - w.xyz);
        gl_Position = projectionMatrix * viewMatrix * w;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform float uLit;
      varying float vY; varying vec3 vN; varying vec3 vV;
      void main(){
        float h = clamp((vY + 0.9) / 3.5, 0.0, 1.0);
        float rim = pow(abs(dot(normalize(vN), normalize(vV))), 1.2);
        vec3 blue = vec3(0.15, 0.25, 1.0) * 1.2;
        vec3 core = vec3(4.2, 3.2, 1.8);
        vec3 edge = vec3(3.0, 1.1, 0.25);
        vec3 col = mix(blue, core, smoothstep(0.08, 0.3, h));
        col = mix(col, edge, smoothstep(0.45, 1.0, h) * (1.0 - rim * 0.5));
        col = mix(edge * 0.8, col, rim);
        float a = rim * (1.0 - smoothstep(0.7, 1.0, h)) * uLit;
        gl_FragColor = vec4(col * a, a);
      }
    `,
  });
  const flame = noAO(new THREE.Mesh(flameGeometry, mat));
  flame.scale.setScalar(size);
  flame.position.y = size * 0.9;
  group.add(flame);
  let light: THREE.PointLight | null = null;
  const base = o.lightIntensity ?? 0.6;
  if (o.light !== false) {
    light = new THREE.PointLight('#ffae5c', base, o.distance ?? 3, 2);
    light.position.y = size * 2.5;
    group.add(light);
  }
  let lit = 1;
  let target = 1;
  return {
    object: group,
    light,
    setLit(v: boolean) {
      target = v ? 1 : 0;
    },
    get lit() {
      return target > 0.5;
    },
    update(t: number, dt: number) {
      lit += (target - lit) * Math.min(1, dt * 4);
      mat.uniforms.uTime.value = t;
      mat.uniforms.uLit.value = lit;
      flame.visible = lit > 0.01;
      if (light) {
        const flick = 0.82 + 0.1 * Math.sin(t * 11 + seed) + 0.06 * Math.sin(t * 27.3 + seed * 2) + 0.04 * Math.sin(t * 3.1);
        light.intensity = base * flick * lit;
        light.position.x = Math.sin(t * 9 + seed) * size * 0.4;
      }
    },
  };
}

/* ------------------------------------------------------------------ */
/* Fumaça de incenso: fio contínuo que ondula e se abre ao subir          */
/* ------------------------------------------------------------------ */

export function createSmoke(o: { origin: THREE.Vector3; height?: number; count?: number; color?: THREE.ColorRepresentation }) {
  const count = o.count ?? 320;
  const r = rng(91);
  const seeds = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    seeds[i * 3] = r();
    seeds[i * 3 + 1] = r();
    seeds[i * 3 + 2] = r();
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(count * 3), 3));
  g.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 3));
  const mat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    uniforms: {
      uTime: { value: 0 },
      uOrigin: { value: o.origin.clone() },
      uH: { value: o.height ?? 1.1 },
      uPR: { value: Math.min(window.devicePixelRatio, 2) },
      uColor: { value: new THREE.Color(o.color ?? '#d9d4cc') },
      uOn: { value: 1 },
    },
    vertexShader: /* glsl */ `
      uniform float uTime, uH, uPR, uOn;
      uniform vec3 uOrigin;
      attribute vec3 aSeed;
      varying float vA; varying float vSeed; varying float vLife;
      void main(){
        float life = fract(uTime * 0.09 * (0.75 + aSeed.x * 0.5) + aSeed.y);
        float h = life * uH;
        float t = uTime;
        vec3 off = vec3(
          sin(h * 4.1 - t * 0.9) * 0.035 * h + sin(h * 9.3 - t * 1.7 + 1.3) * 0.05 * h * h,
          h,
          cos(h * 3.3 - t * 0.7) * 0.035 * h + sin(h * 7.7 - t * 1.3) * 0.04 * h * h);
        float spread = 0.004 + h * h * 0.12;
        off.x += (aSeed.z - 0.5) * spread;
        off.z += (fract(aSeed.z * 7.13) - 0.5) * spread;
        vec4 mv = modelViewMatrix * vec4(uOrigin + off, 1.0);
        gl_PointSize = (0.012 + life * life * 0.32) * 260.0 * uPR / max(0.05, -mv.z);
        vA = smoothstep(0.0, 0.05, life) * pow(1.0 - life, 1.8) * uOn;
        vSeed = aSeed.x; vLife = life;
        gl_Position = projectionMatrix * mv;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform vec3 uColor; uniform float uTime;
      varying float vA; varying float vSeed; varying float vLife;
      ${GLSL_NOISE}
      void main(){
        vec2 c = gl_PointCoord - 0.5;
        float d = length(c);
        float n = fbm(c * 3.0 + vSeed * 13.0 + uTime * 0.05);
        float a = smoothstep(0.5, 0.05, d) * (0.45 + 0.75 * n);
        a *= vA * mix(0.55, 0.18, vLife);
        gl_FragColor = vec4(uColor, a);
      }
    `,
  });
  const pts = noAO(new THREE.Points(g, mat));
  pts.frustumCulled = false;
  pts.renderOrder = 6;
  let on = 1;
  let target = 1;
  return {
    object: pts,
    material: mat,
    setOn(v: boolean) {
      target = v ? 1 : 0;
    },
    get on() {
      return target > 0.5;
    },
    update(t: number, dt: number) {
      on += (target - on) * Math.min(1, dt * 0.8);
      mat.uniforms.uTime.value = t;
      mat.uniforms.uOn.value = on;
      pts.visible = on > 0.01;
    },
  };
}

/* ------------------------------------------------------------------ */
/* Vaga-lumes / brilhos mágicos                                          */
/* ------------------------------------------------------------------ */

export function createFireflies(o: { count: number; center: THREE.Vector3; radius: number; height: [number, number]; color?: THREE.ColorRepresentation; size?: number }) {
  const r = rng(55);
  const pos = new Float32Array(o.count * 3);
  const seeds = new Float32Array(o.count);
  for (let i = 0; i < o.count; i++) {
    const a = r() * Math.PI * 2;
    const rad = Math.sqrt(r()) * o.radius;
    pos[i * 3] = o.center.x + Math.cos(a) * rad;
    pos[i * 3 + 1] = o.height[0] + r() * (o.height[1] - o.height[0]);
    pos[i * 3 + 2] = o.center.z + Math.sin(a) * rad;
    seeds[i] = r();
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  g.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1));
  const mat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uTime: { value: 0 },
      uColor: { value: new THREE.Color(o.color ?? '#d8ff6a') },
      uPR: { value: Math.min(window.devicePixelRatio, 2) },
      uSize: { value: o.size ?? 40 },
      uOn: { value: 0 },
    },
    vertexShader: /* glsl */ `
      uniform float uTime, uPR, uSize, uOn; attribute float aSeed; varying float vB;
      void main(){
        vec3 p = position;
        float t = uTime * 0.25 + aSeed * 50.0;
        p += vec3(sin(t * 1.3) * 0.9 + sin(t * 3.1) * 0.25, sin(t * 0.9) * 0.45, cos(t * 1.1) * 0.9 + cos(t * 2.7) * 0.25);
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        float blink = pow(max(0.0, sin(uTime * (0.7 + aSeed) + aSeed * 40.0)), 6.0);
        vB = (0.15 + blink) * uOn;
        gl_PointSize = uSize * uPR * (0.6 + blink * 0.6) / max(0.1, -mv.z);
        gl_Position = projectionMatrix * mv;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform vec3 uColor; varying float vB;
      void main(){
        float d = length(gl_PointCoord - 0.5);
        float core = smoothstep(0.12, 0.0, d);
        float glow = smoothstep(0.5, 0.0, d) * 0.35;
        float a = (core + glow) * vB;
        gl_FragColor = vec4(uColor * (2.5 * core + glow) * vB, a);
      }
    `,
  });
  const pts = noAO(new THREE.Points(g, mat));
  pts.frustumCulled = false;
  return { object: pts, material: mat, update: (t: number) => (mat.uniforms.uTime.value = t) };
}

/* ------------------------------------------------------------------ */
/* Chuva                                                                 */
/* ------------------------------------------------------------------ */

export function createRain(o: { count: number; center: THREE.Vector3; radius: number; top: number; bottom: number }) {
  const r = rng(23);
  const pos = new Float32Array(o.count * 3);
  const seeds = new Float32Array(o.count);
  for (let i = 0; i < o.count; i++) {
    const a = r() * Math.PI * 2;
    const rad = Math.sqrt(r()) * o.radius;
    pos[i * 3] = o.center.x + Math.cos(a) * rad;
    pos[i * 3 + 1] = 0;
    pos[i * 3 + 2] = o.center.z + Math.sin(a) * rad;
    seeds[i] = r();
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  g.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1));
  const mat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    uniforms: {
      uTime: { value: 0 },
      uTop: { value: o.top },
      uBottom: { value: o.bottom },
      uPR: { value: Math.min(window.devicePixelRatio, 2) },
      uAmount: { value: 0 },
      uWind: { value: 0.15 },
      uColor: { value: new THREE.Color('#c9d6e6') },
    },
    vertexShader: /* glsl */ `
      uniform float uTime, uTop, uBottom, uPR, uAmount, uWind; attribute float aSeed; varying float vA;
      void main(){
        float H = uTop - uBottom;
        float fall = mod(uTime * (9.0 + aSeed * 3.0) + aSeed * H * 7.0, H);
        vec3 p = position;
        p.y = uTop - fall;
        p.x += uWind * fall;
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        gl_PointSize = 22.0 * uPR / max(0.2, -mv.z) * 6.0;
        vA = step(aSeed, uAmount) * 0.4;
        gl_Position = projectionMatrix * mv;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform vec3 uColor; varying float vA;
      void main(){
        vec2 c = gl_PointCoord - 0.5;
        float a = smoothstep(0.035, 0.0, abs(c.x + c.y * 0.15)) * smoothstep(0.5, 0.1, abs(c.y));
        if (a * vA < 0.003) discard;
        gl_FragColor = vec4(uColor, a * vA);
      }
    `,
  });
  const pts = noAO(new THREE.Points(g, mat));
  pts.frustumCulled = false;
  return { object: pts, material: mat, update: (t: number) => (mat.uniforms.uTime.value = t) };
}

/* ------------------------------------------------------------------ */
/* Textura de folha (cor + alfa) desenhada no canvas                     */
/* ------------------------------------------------------------------ */

export function leafTexture(o: { size?: number; leaves?: number; palette: string[]; seed?: number; single?: boolean; aspect?: number; spread?: number }) {
  const size = o.size ?? 512;
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const ctx = c.getContext('2d')!;
  const r = rng(o.seed ?? 3);
  const drawLeaf = (x: number, y: number, len: number, ang: number, col: string) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(ang);
    const w = len * (o.aspect ?? 0.42);
    const grad = ctx.createLinearGradient(-w, 0, w, 0);
    grad.addColorStop(0, col);
    grad.addColorStop(0.5, shade(col, 1.18));
    grad.addColorStop(1, shade(col, 0.82));
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(w, -len * 0.25, w * 0.8, -len * 0.75, 0, -len);
    ctx.bezierCurveTo(-w * 0.8, -len * 0.75, -w, -len * 0.25, 0, 0);
    ctx.fill();
    ctx.strokeStyle = shade(col, 0.7);
    ctx.lineWidth = Math.max(1, len * 0.025);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -len * 0.95);
    ctx.stroke();
    ctx.lineWidth = Math.max(0.6, len * 0.012);
    for (let k = 1; k < 6; k++) {
      const yy = -len * k * 0.15;
      ctx.beginPath();
      ctx.moveTo(0, yy);
      ctx.lineTo(w * 0.6, yy - len * 0.1);
      ctx.moveTo(0, yy);
      ctx.lineTo(-w * 0.6, yy - len * 0.1);
      ctx.stroke();
    }
    ctx.restore();
  };
  if (o.single) {
    drawLeaf(size / 2, size * 0.95, size * 0.9, 0, o.palette[0]);
  } else {
    const n = o.leaves ?? 26;
    for (let i = 0; i < n; i++) {
      const a = r() * Math.PI * 2;
      const rad = Math.sqrt(r()) * size * (o.spread ?? 0.32);
      const x = size / 2 + Math.cos(a) * rad;
      const y = size / 2 + Math.sin(a) * rad;
      const col = o.palette[Math.floor(r() * o.palette.length)];
      drawLeaf(x, y + size * 0.08, size * (0.16 + r() * 0.1), a + Math.PI / 2 + (r() - 0.5) * 0.9, col);
    }
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

function shade(hex: string, k: number) {
  const c = new THREE.Color(hex);
  c.r = Math.min(1, c.r * k);
  c.g = Math.min(1, c.g * k);
  c.b = Math.min(1, c.b * k);
  return '#' + c.getHexString();
}

/* ------------------------------------------------------------------ */
/* Folhas / pétalas caindo (instanciadas)                                */
/* ------------------------------------------------------------------ */

export function createFallingLeaves(o: { count: number; center: THREE.Vector3; radius: number; top: number; texture: THREE.Texture; colors: string[] }) {
  const geo = new THREE.PlaneGeometry(0.16, 0.16);
  const mat = new THREE.MeshStandardMaterial({ map: o.texture, alphaTest: 0.5, side: THREE.DoubleSide, roughness: 0.8 });
  const mesh = new THREE.InstancedMesh(geo, mat, o.count);
  mesh.castShadow = false;
  mesh.userData.noAO = true;
  const r = rng(77);
  const items = Array.from({ length: o.count }, () => ({
    p: new THREE.Vector3(o.center.x + (r() - 0.5) * o.radius * 2, r() * o.top, o.center.z + (r() - 0.5) * o.radius * 2),
    rot: new THREE.Euler(r() * 6, r() * 6, r() * 6),
    spin: new THREE.Vector3((r() - 0.5) * 3, (r() - 0.5) * 3, (r() - 0.5) * 3),
    speed: 0.35 + r() * 0.4,
    phase: r() * 10,
  }));
  const col = new THREE.Color();
  items.forEach((_, i) => mesh.setColorAt(i, col.set(o.colors[i % o.colors.length])));
  const dummy = new THREE.Object3D();
  let amount = 0;
  let wind = 0.3;
  return {
    object: mesh,
    setAmount(v: number) {
      amount = v;
    },
    setWind(v: number) {
      wind = v;
    },
    update(t: number, dt: number) {
      const visible = Math.floor(o.count * amount);
      mesh.count = visible;
      mesh.visible = visible > 0;
      for (let i = 0; i < visible; i++) {
        const it = items[i];
        it.p.y -= it.speed * dt;
        it.p.x += (Math.sin(t * 1.3 + it.phase) * 0.35 + wind) * dt;
        it.p.z += Math.cos(t * 1.1 + it.phase) * 0.3 * dt;
        it.rot.x += it.spin.x * dt;
        it.rot.y += it.spin.y * dt;
        it.rot.z += it.spin.z * dt;
        if (it.p.y < 0.02 || Math.abs(it.p.x - o.center.x) > o.radius * 1.5) {
          it.p.set(o.center.x + (Math.random() - 0.5) * o.radius * 2, o.top * (0.6 + Math.random() * 0.4), o.center.z + (Math.random() - 0.5) * o.radius * 2);
        }
        dummy.position.copy(it.p);
        dummy.rotation.copy(it.rot);
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
      }
      mesh.instanceMatrix.needsUpdate = true;
    },
  };
}

/* ------------------------------------------------------------------ */
/* Céu dinâmico (gradiente físico aproximado + sol + nuvens + estrelas) */
/* ------------------------------------------------------------------ */

export interface SkyParams {
  top: THREE.Color;
  horizon: THREE.Color;
  bottom: THREE.Color;
  sunColor: THREE.Color;
  sunDir: THREE.Vector3;
  sunSize: number;
  cloudCover: number;
  cloudColor: THREE.Color;
  stars: number;
}

export function skyParams(p: {
  top: string;
  horizon: string;
  bottom: string;
  sun: string;
  sunDir: [number, number, number];
  sunSize?: number;
  clouds?: number;
  cloudColor?: string;
  stars?: number;
}): SkyParams {
  return {
    top: new THREE.Color(p.top),
    horizon: new THREE.Color(p.horizon),
    bottom: new THREE.Color(p.bottom),
    sunColor: new THREE.Color(p.sun),
    sunDir: new THREE.Vector3(...p.sunDir).normalize(),
    sunSize: p.sunSize ?? 0.03,
    cloudCover: p.clouds ?? 0.3,
    cloudColor: new THREE.Color(p.cloudColor ?? '#ffffff'),
    stars: p.stars ?? 0,
  };
}

export function createSky(radius = 400) {
  const mat = new THREE.ShaderMaterial({
    side: THREE.BackSide,
    depthWrite: false,
    fog: false,
    uniforms: {
      uTop: { value: new THREE.Color() },
      uHorizon: { value: new THREE.Color() },
      uBottom: { value: new THREE.Color() },
      uSunColor: { value: new THREE.Color() },
      uSunDir: { value: new THREE.Vector3(0, 1, 0) },
      uSunSize: { value: 0.03 },
      uCloud: { value: 0.3 },
      uCloudColor: { value: new THREE.Color() },
      uStars: { value: 0 },
      uTime: { value: 0 },
    },
    vertexShader: /* glsl */ `
      varying vec3 vDir;
      void main(){ vDir = normalize(position); vec4 p = projectionMatrix * modelViewMatrix * vec4(position, 1.0); gl_Position = p.xyww; }
    `,
    fragmentShader: /* glsl */ `
      uniform vec3 uTop, uHorizon, uBottom, uSunColor, uSunDir, uCloudColor;
      uniform float uSunSize, uCloud, uStars, uTime;
      varying vec3 vDir;
      ${GLSL_NOISE}
      void main(){
        vec3 d = normalize(vDir);
        float y = d.y;
        vec3 col = y > 0.0 ? mix(uHorizon, uTop, pow(y, 0.8)) : mix(uHorizon, uBottom, pow(-y, 0.4));
        col += uSunColor * pow(1.0 - abs(y), 10.0) * 0.18;
        float sd = dot(d, normalize(uSunDir));
        float disc = smoothstep(cos(uSunSize), cos(uSunSize * 0.7), sd);
        float glow = pow(max(sd, 0.0), 6.0) * 0.45 + pow(max(sd, 0.0), 64.0) * 0.8;
        col += uSunColor * glow;
        // estrelas
        if (uStars > 0.0 && y > 0.0) {
          vec2 sp = d.xz / (y + 0.2) * 90.0;
          float s = hash12(floor(sp));
          float tw = 0.6 + 0.4 * sin(uTime * 2.0 + s * 60.0);
          col += vec3(1.0) * step(0.9965, s) * smoothstep(0.35, 0.0, length(fract(sp) - 0.5)) * uStars * tw * smoothstep(0.0, 0.3, y) * 2.0;
        }
        // nuvens planas projetadas
        if (y > 0.0 && uCloud > 0.0) {
          vec2 uv = d.xz / (y + 0.12) * 1.4 + vec2(uTime * 0.006, uTime * 0.002);
          float n = fbm(uv * 1.3);
          float n2 = fbm(uv * 3.1 + 4.0);
          float c = smoothstep(1.0 - uCloud, 1.0 - uCloud + 0.35, n * 0.75 + n2 * 0.35);
          c *= smoothstep(0.0, 0.18, y);
          float lit = 0.6 + 0.4 * pow(max(sd, 0.0), 3.0);
          vec3 cc = uCloudColor * lit + uSunColor * pow(max(sd, 0.0), 12.0) * 0.6;
          col = mix(col, cc, c * 0.92);
          disc *= 1.0 - c;
        }
        col += uSunColor * disc * 14.0;
        gl_FragColor = vec4(col, 1.0);
      }
    `,
  });
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(radius, 64, 32), mat);
  mesh.frustumCulled = false;
  mesh.renderOrder = -10;
  noAO(mesh);
  const set = (p: SkyParams) => {
    const u = mat.uniforms;
    u.uTop.value.copy(p.top);
    u.uHorizon.value.copy(p.horizon);
    u.uBottom.value.copy(p.bottom);
    u.uSunColor.value.copy(p.sunColor);
    u.uSunDir.value.copy(p.sunDir);
    u.uSunSize.value = p.sunSize;
    u.uCloud.value = p.cloudCover;
    u.uCloudColor.value.copy(p.cloudColor);
    u.uStars.value = p.stars;
  };
  return { object: mesh, material: mat, set, update: (t: number) => (mat.uniforms.uTime.value = t) };
}

/** Interpola parâmetros de céu (para transições suaves entre climas). */
export function lerpSky(a: SkyParams, b: SkyParams, t: number, out: SkyParams): SkyParams {
  out.top.copy(a.top).lerp(b.top, t);
  out.horizon.copy(a.horizon).lerp(b.horizon, t);
  out.bottom.copy(a.bottom).lerp(b.bottom, t);
  out.sunColor.copy(a.sunColor).lerp(b.sunColor, t);
  out.sunDir.copy(a.sunDir).lerp(b.sunDir, t).normalize();
  out.sunSize = a.sunSize + (b.sunSize - a.sunSize) * t;
  out.cloudCover = a.cloudCover + (b.cloudCover - a.cloudCover) * t;
  out.cloudColor.copy(a.cloudColor).lerp(b.cloudColor, t);
  out.stars = a.stars + (b.stars - a.stars) * t;
  return out;
}

export function cloneSky(p: SkyParams): SkyParams {
  return {
    top: p.top.clone(),
    horizon: p.horizon.clone(),
    bottom: p.bottom.clone(),
    sunColor: p.sunColor.clone(),
    sunDir: p.sunDir.clone(),
    sunSize: p.sunSize,
    cloudCover: p.cloudCover,
    cloudColor: p.cloudColor.clone(),
    stars: p.stars,
  };
}

/** Injeta animação de vento em materiais de vegetação (folhas/grama), incluindo a sombra. */
export function addWind(
  mat: THREE.Material,
  o: { strength: { value: number }; time: { value: number }; mode: 'grass' | 'leaves'; heightScale?: number },
) {
  mat.onBeforeCompile = (shader) => {
    shader.uniforms.uWind = o.strength;
    shader.uniforms.uWTime = o.time;
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>\nuniform float uWind; uniform float uWTime;')
      .replace(
        '#include <begin_vertex>',
        o.mode === 'grass'
          ? `#include <begin_vertex>
             {
               vec4 wp = vec4(transformed, 1.0);
               #ifdef USE_INSTANCING
                 wp = instanceMatrix * wp;
               #endif
               wp = modelMatrix * wp;
               float h = clamp(position.y * ${(o.heightScale ?? 1).toFixed(3)}, 0.0, 1.0);
               float w = sin(uWTime * 1.6 + wp.x * 0.35 + wp.z * 0.25) * 0.6 + sin(uWTime * 3.7 + wp.x * 1.3) * 0.25 + 0.35;
               transformed.x += w * uWind * h * h * 0.35;
               transformed.z += sin(uWTime * 2.1 + wp.z * 0.7) * uWind * h * h * 0.12;
             }`
          : `#include <begin_vertex>
             {
               vec4 wp = vec4(0.0, 0.0, 0.0, 1.0);
               #ifdef USE_INSTANCING
                 wp = instanceMatrix * wp;
               #endif
               wp = modelMatrix * wp;
               float ph = wp.x * 0.37 + wp.y * 0.21 + wp.z * 0.29;
               float sway = sin(uWTime * 1.7 + ph) * 0.6 + sin(uWTime * 4.3 + ph * 2.3) * 0.3;
               transformed.x += sway * uWind * 0.06;
               transformed.y += sin(uWTime * 2.9 + ph * 1.7) * uWind * 0.03;
               transformed.z += cos(uWTime * 1.9 + ph) * uWind * 0.05;
             }`,
      );
  };
  mat.customProgramCacheKey = () => `wind-${o.mode}`;
  return mat;
}
