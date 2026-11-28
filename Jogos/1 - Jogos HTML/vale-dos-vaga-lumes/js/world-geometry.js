/**
 * js/world-geometry.js
 * Construção procedural fiel ao mockup: trilha esquerda, postes de madeira com
 * corda trançada e lampiões a óleo, riacho rochoso com pedras úmidas, árvores
 * tortas na margem, folhagens tropicais, vegetação ripária e céu noturno dinâmico.
 */
import * as THREE from 'three';
import {
  WATER_LEVEL,
  clamp,
  lerp,
  smoothstep,
  streamCenterX,
  streamHalfWidth,
  trailCenterX,
  trailMask,
  terrainHeight,
} from './math-terrain.js';
import { mulberry32 } from './state.js';

function mergeGeometries(geos) {
  let totalVerts = 0;
  let totalIdx = 0;
  for (const g of geos) {
    totalVerts += g.attributes.position.count;
    totalIdx += g.index ? g.index.count : g.attributes.position.count;
  }
  const pos = new Float32Array(totalVerts * 3);
  const norm = new Float32Array(totalVerts * 3);
  const uv = new Float32Array(totalVerts * 2);
  const idx = new Uint32Array(totalIdx);

  let vOff = 0;
  let iOff = 0;
  for (const g of geos) {
    const p = g.attributes.position;
    const n = g.attributes.normal;
    const u = g.attributes.uv;
    pos.set(p.array, vOff * 3);
    if (n) norm.set(n.array, vOff * 3);
    if (u) uv.set(u.array, vOff * 2);
    if (g.index) {
      const ix = g.index.array;
      for (let k = 0; k < ix.length; k++) idx[iOff + k] = ix[k] + vOff;
      iOff += ix.length;
    } else {
      for (let k = 0; k < p.count; k++) idx[iOff + k] = k + vOff;
      iOff += p.count;
    }
    vOff += p.count;
    g.dispose();
  }
  const out = new THREE.BufferGeometry();
  out.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  out.setAttribute('normal', new THREE.BufferAttribute(norm, 3));
  out.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
  out.setIndex(new THREE.BufferAttribute(idx, 1));
  return out;
}

export function buildWorldScene(scene, mats, state) {
  const rnd = mulberry32(95420);
  const disposableGeos = [];
  const disposableMats = [];
  const trackGeo = (g) => (disposableGeos.push(g), g);
  const trackMat = (m) => (disposableMats.push(m), m);

  // ============================================================================
  // 1. CÉU ESTRELADO, NUVENS ILUMINADAS PELA LUA & LUA CHEIA DINÂMICA
  // ============================================================================
  const skyUniforms = {
    uZenith: { value: new THREE.Color(0x09162e) },
    uHorizon: { value: new THREE.Color(0x1b3754) },
    uMoonDir: { value: new THREE.Vector3(0.28, 0.42, -0.86).normalize() },
    uTime: { value: 0 },
    uMotion: { value: 1.0 },
  };
  const skyGeo = trackGeo(new THREE.SphereGeometry(140, 32, 20));
  const skyMat = trackMat(new THREE.ShaderMaterial({
    uniforms: skyUniforms,
    side: THREE.BackSide,
    depthWrite: false,
    vertexShader: /* glsl */ `
      varying vec3 vDir;
      void main() {
        vDir = normalize(position);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: /* glsl */ `
      uniform vec3 uZenith;
      uniform vec3 uHorizon;
      uniform vec3 uMoonDir;
      uniform float uTime;
      uniform float uMotion;
      varying vec3 vDir;

      void main() {
        vec3 d = normalize(vDir);
        float h = clamp(d.y, 0.0, 1.0);
        vec3 col = mix(uHorizon, uZenith, pow(h, 0.62));

        // Halo lunar e nuvens suaves sem loop pesado por pixel
        float mu = max(dot(d, normalize(uMoonDir)), 0.0);
        col += vec3(0.42, 0.54, 0.78) * pow(mu, 18.0) * 0.42;

        if (d.y > 0.04) {
          vec2 cuv = d.xz / (d.y + 0.42) * 1.3 + vec2(uTime * 0.008 * uMotion, uTime * 0.003 * uMotion);
          float w = sin(cuv.x * 2.1 + sin(cuv.y * 1.7)) * cos(cuv.y * 2.3 - cos(cuv.x * 1.4));
          float cloudMask = smoothstep(0.15, 0.85, w * 0.5 + 0.42) * smoothstep(0.04, 0.28, d.y);
          vec3 cloudCol = mix(uZenith * 1.25, vec3(0.36, 0.48, 0.66), pow(mu, 4.0) * 0.75 + 0.15);
          col = mix(col, cloudCol, cloudMask * 0.32);
        }
        gl_FragColor = vec4(col, 1.0);
      }
    `,
  }));
  const skyDome = new THREE.Mesh(skyGeo, skyMat);
  scene.add(skyDome);

  // Campo de estrelas com cintilação configurável (zero cintilação rápida em T02)
  const MAX_STARS = 950;
  const starPos = new Float32Array(MAX_STARS * 3);
  const starAttr = new Float32Array(MAX_STARS * 2); // size, phase
  for (let i = 0; i < MAX_STARS; i++) {
    const theta = rnd() * Math.PI * 2;
    const phi = Math.acos(lerp(0.14, 0.99, rnd()));
    const r = 122;
    starPos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    starPos[i * 3 + 1] = r * Math.cos(phi);
    starPos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
    starAttr[i * 2] = 1.6 + rnd() * 2.4;
    starAttr[i * 2 + 1] = rnd() * Math.PI * 2;
  }
  const starGeo = trackGeo(new THREE.BufferGeometry());
  starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
  starGeo.setAttribute('aMeta', new THREE.BufferAttribute(starAttr, 2));
  const starUniforms = {
    uTime: { value: 0 },
    uTwinkle: { value: 1.0 },
    uVisibility: { value: 1.0 },
  };
  const starMat = trackMat(new THREE.ShaderMaterial({
    uniforms: starUniforms,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexShader: /* glsl */ `
      attribute vec2 aMeta;
      uniform float uTime;
      uniform float uTwinkle;
      varying float vAlpha;
      void main() {
        vAlpha = 0.65 + 0.35 * sin(uTime * (1.2 + aMeta.x * 0.4) * uTwinkle + aMeta.y);
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = aMeta.x * (90.0 / max(-mv.z, 1.0));
        gl_Position = projectionMatrix * mv;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform float uVisibility;
      varying float vAlpha;
      void main() {
        float d = length(gl_PointCoord - 0.5) * 2.0;
        float a = smoothstep(1.0, 0.15, d) * vAlpha * uVisibility;
        gl_FragColor = vec4(0.88, 0.94, 1.0, a);
      }
    `,
  }));
  const starPoints = new THREE.Points(starGeo, starMat);
  scene.add(starPoints);

  // Lua cheia nítida com crateras sutis + halo atmosférico comedido
  const moonTex = (function () {
    const c = document.createElement('canvas');
    c.width = c.height = 256;
    const ctx = c.getContext('2d');
    const g = ctx.createRadialGradient(128, 128, 18, 128, 128, 124);
    g.addColorStop(0, '#fffef7');
    g.addColorStop(0.24, '#f2f6ff');
    g.addColorStop(0.29, 'rgba(185,208,255,0.42)');
    g.addColorStop(0.55, 'rgba(110,148,215,0.12)');
    g.addColorStop(1, 'rgba(70,105,170,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 256, 256);
    ctx.globalAlpha = 0.22;
    for (let i = 0; i < 14; i++) {
      ctx.fillStyle = '#7e8ba8';
      ctx.beginPath();
      ctx.arc(128 + (rnd() - 0.5) * 44, 128 + (rnd() - 0.5) * 44, 3 + rnd() * 9, 0, Math.PI * 2);
      ctx.fill();
    }
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  })();
  const moonSpriteMat = trackMat(new THREE.SpriteMaterial({
    map: moonTex,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    fog: false,
  }));
  const moonSprite = new THREE.Sprite(moonSpriteMat);
  moonSprite.scale.set(11.5, 11.5, 1);
  scene.add(moonSprite);

  // ============================================================================
  // 2. ILUMINAÇÃO ATMOSFÉRICA + SOMBRAS
  // ============================================================================
  const hemiLight = new THREE.HemisphereLight(0x4b70a8, 0x162214, 0.72);
  scene.add(hemiLight);

  const moonLight = new THREE.DirectionalLight(0xbcd2ff, 1.55);
  moonLight.castShadow = true;
  moonLight.shadow.mapSize.set(1024, 1024);
  moonLight.shadow.camera.near = 2;
  moonLight.shadow.camera.far = 70;
  moonLight.shadow.camera.left = -16;
  moonLight.shadow.camera.right = 16;
  moonLight.shadow.camera.top = 18;
  moonLight.shadow.camera.bottom = -18;
  moonLight.shadow.bias = -0.0005;
  moonLight.shadow.normalBias = 0.025;
  scene.add(moonLight, moonLight.target);
  moonLight.target.position.set(0, 0, -6);

  // ============================================================================
  // 3. TERRENO ANALÍTICO + COLINAS DO VALE
  // ============================================================================
  const tSegX = 88;
  const tSegZ = 132;
  const terrainGeo = trackGeo(new THREE.PlaneGeometry(52, 82, tSegX, tSegZ));
  terrainGeo.rotateX(-Math.PI / 2);
  terrainGeo.translate(0, 0, -23); // cobre Z de -64 a +18
  const tPos = terrainGeo.attributes.position;
  const tColors = new Float32Array(tPos.count * 3);

  for (let i = 0; i < tPos.count; i++) {
    const x = tPos.getX(i);
    const z = tPos.getZ(i);
    const y = terrainHeight(x, z);
    tPos.setY(i, y);

    const tm = trailMask(x, z);
    const sub = clamp((WATER_LEVEL + 0.08 - y) / 0.35, 0, 1);
    const slope = Math.abs(x - streamCenterX(z) * 0.35);

    // Cor base por bioma local: terra batida da trilha, várzea verde-musgo ou leito escuro úmido
    let r = 0.34, g = 0.46, b = 0.25;
    // Trilha amarronzada cálida
    r = lerp(r, 0.56, tm);
    g = lerp(g, 0.39, tm);
    b = lerp(b, 0.26, tm);
    // Leito submerso escuro para destaque da absorção da água
    r = lerp(r, 0.14, sub);
    g = lerp(g, 0.17, sub);
    b = lerp(b, 0.15, sub);
    // Encostas distantes mais escuras
    const shadeHill = clamp(slope * 0.035, 0, 0.35);
    tColors[i * 3] = r * (1 - shadeHill);
    tColors[i * 3 + 1] = g * (1 - shadeHill * 0.8);
    tColors[i * 3 + 2] = b * (1 - shadeHill * 0.7);
  }
  terrainGeo.setAttribute('color', new THREE.BufferAttribute(tColors, 3));
  terrainGeo.computeVertexNormals();

  const terrainMesh = new THREE.Mesh(terrainGeo, mats.terrainMat);
  terrainMesh.receiveShadow = true;
  scene.add(terrainMesh);

  // Cadeia de montanhas distantes em camadas (silhueta envolvente do vale)
  const ridgeGeo = trackGeo(new THREE.PlaneGeometry(180, 54, 48, 12));
  ridgeGeo.rotateX(-Math.PI / 2);
  ridgeGeo.translate(0, 0, -76);
  const rPos = ridgeGeo.attributes.position;
  for (let i = 0; i < rPos.count; i++) {
    const x = rPos.getX(i);
    const z = rPos.getZ(i);
    const valleyDip = smoothstep(4, 28, Math.abs(x + 2));
    const backRise = smoothstep(-52, -100, z);
    const peak =
      (Math.sin(x * 0.08) * 3.8 + Math.cos(x * 0.19 - z * 0.07) * 2.2 + 5.5) *
      (0.35 + 0.65 * valleyDip) *
      (0.35 + 0.9 * backRise);
    rPos.setY(i, -0.4 + peak + backRise * 9.5);
  }
  ridgeGeo.computeVertexNormals();
  const ridgeMat = trackMat(new THREE.MeshStandardMaterial({
    color: 0x101c26,
    roughness: 0.98,
    metalness: 0,
    envMapIntensity: 0.2,
  }));
  const ridgeMesh = new THREE.Mesh(ridgeGeo, ridgeMat);
  scene.add(ridgeMesh);

  // ============================================================================
  // 4. ROCHAS DO RIACHO, SEIXOS SUBMERSOS E MUSGO NAS MARGENS (INSTANCED)
  // ============================================================================
  const boulderObstacles = [];
  const rockGeo = trackGeo(new THREE.IcosahedronGeometry(1, 1));
  const rp = rockGeo.attributes.position;
  const rockCols = new Float32Array(rp.count * 3);
  for (let i = 0; i < rp.count; i++) {
    const vx = rp.getX(i), vy = rp.getY(i), vz = rp.getZ(i);
    const n = 0.82 + 0.28 * Math.sin(vx * 3.7 + vz * 2.9 + vy * 4.1);
    rp.setXYZ(i, vx * n, vy * n, vz * n);
    // Topo verde musgo, base úmida mais escura
    const topMix = smoothstep(-0.1, 0.65, vy);
    rockCols[i * 3] = lerp(0.32, 0.56, topMix);
    rockCols[i * 3 + 1] = lerp(0.34, 0.72, topMix);
    rockCols[i * 3 + 2] = lerp(0.31, 0.36, topMix);
  }
  rockGeo.setAttribute('color', new THREE.BufferAttribute(rockCols, 3));
  rockGeo.computeVertexNormals();

  // Grandes pedras de margem + corredeira (alimentam a esteira de espuma na água)
  const bankRocks = [
    // Pedras grandes em destaque (como no mockup à direita e esquerda)
    { x: streamCenterX(3.8) + 1.55, z: 3.8, sx: 1.25, sy: 0.72, sz: 1.05, wake: true },
    { x: streamCenterX(1.2) - 1.52, z: 1.2, sx: 1.10, sy: 0.58, sz: 0.92, wake: true },
    { x: streamCenterX(-1.4) + 0.42, z: -1.4, sx: 0.58, sy: 0.34, sz: 0.52, wake: true },
    { x: streamCenterX(-3.6) - 0.52, z: -3.6, sx: 0.65, sy: 0.36, sz: 0.58, wake: true },
    { x: streamCenterX(-7.8) + 1.48, z: -7.8, sx: 1.05, sy: 0.62, sz: 0.92, wake: true },
    { x: streamCenterX(-11.5) - 0.35, z: -11.5, sx: 0.56, sy: 0.32, sz: 0.48, wake: true },
    { x: streamCenterX(-15.5) + 0.65, z: -15.5, sx: 0.72, sy: 0.38, sz: 0.62, wake: true },
    // Pedras de encosta esquerda junto ao poste
    { x: trailCenterX(4.4) - 0.85, z: 4.4, sx: 0.95, sy: 0.48, sz: 0.84, wake: false },
    { x: trailCenterX(2.0) + 0.95, z: 2.0, sx: 0.72, sy: 0.38, sz: 0.68, wake: false },
  ];

  const dummy = new THREE.Object3D();
  const bankRockInst = new THREE.InstancedMesh(rockGeo, mats.mossRockMat, bankRocks.length);
  bankRockInst.castShadow = true;
  bankRockInst.receiveShadow = true;
  bankRocks.forEach((b, idx) => {
    const y = terrainHeight(b.x, b.z) + b.sy * 0.28;
    dummy.position.set(b.x, y, b.z);
    dummy.rotation.set((rnd() - 0.5) * 0.3, rnd() * Math.PI * 2, (rnd() - 0.5) * 0.3);
    dummy.scale.set(b.sx, b.sy, b.sz);
    dummy.updateMatrix();
    bankRockInst.setMatrixAt(idx, dummy.matrix);
    if (b.wake) boulderObstacles.push({ x: b.x, z: b.z, r: Math.max(b.sx, b.sz) });
  });
  bankRockInst.instanceMatrix.needsUpdate = true;
  scene.add(bankRockInst);

  // Seixos úmidos e submersos no leito do riacho (visíveis através da água transparente)
  const MAX_PEBBLES = 620;
  const pebbleGeo = trackGeo(new THREE.IcosahedronGeometry(1, 0));
  const pebbleInst = new THREE.InstancedMesh(pebbleGeo, mats.wetRockMat, MAX_PEBBLES);
  pebbleInst.receiveShadow = true;
  for (let i = 0; i < MAX_PEBBLES; i++) {
    const z = lerp(-46, 13, rnd());
    const cx = streamCenterX(z);
    const hw = streamHalfWidth(z);
    const x = cx + (rnd() - 0.5) * 2.35 * hw;
    const y = terrainHeight(x, z) + 0.02;
    const sc = 0.07 + Math.pow(rnd(), 2.2) * 0.24;
    dummy.position.set(x, y, z);
    dummy.rotation.set(rnd() * 3, rnd() * 6, rnd() * 3);
    dummy.scale.set(sc * (0.9 + rnd() * 0.5), sc * 0.48, sc * (0.8 + rnd() * 0.5));
    dummy.updateMatrix();
    pebbleInst.setMatrixAt(i, dummy.matrix);
  }
  pebbleInst.instanceMatrix.needsUpdate = true;
  scene.add(pebbleInst);

  // ============================================================================
  // 5. POSTES RÚSTICOS DE MADEIRA + CORDA TRANÇADA + LAMPIÕES A ÓLEO (HERO)
  // ============================================================================
  const flameMeshes = [];
  const lanternLights = [];
  const lanternSpec = [
    { z: 3.6, power: 1.0, shadow: true },
    { z: -5.8, power: 0.72, shadow: false },
    { z: -17.5, power: 0.55, shadow: false },
  ];

  const lanBaseGeo = trackGeo(new THREE.LatheGeometry([
    new THREE.Vector2(0.0, 0.0),
    new THREE.Vector2(0.11, 0.0),
    new THREE.Vector2(0.125, 0.04),
    new THREE.Vector2(0.095, 0.09),
    new THREE.Vector2(0.105, 0.11),
  ], 14));
  const lanTopGeo = trackGeo(new THREE.LatheGeometry([
    new THREE.Vector2(0.105, 0.32),
    new THREE.Vector2(0.135, 0.34),
    new THREE.Vector2(0.095, 0.39),
    new THREE.Vector2(0.06, 0.44),
    new THREE.Vector2(0.065, 0.49),
    new THREE.Vector2(0.0, 0.51),
  ], 14));
  const lanGlassGeo = trackGeo(new THREE.CylinderGeometry(0.088, 0.076, 0.23, 12));
  const lanStrutGeo = trackGeo(new THREE.CylinderGeometry(0.006, 0.006, 0.25, 5));
  const flameGeo = trackGeo(new THREE.SphereGeometry(0.036, 10, 8));
  flameGeo.scale(0.82, 1.55, 0.82);

  const glowCanvasTex = (function () {
    const c = document.createElement('canvas');
    c.width = c.height = 128;
    const ctx = c.getContext('2d');
    const g = ctx.createRadialGradient(64, 64, 2, 64, 64, 62);
    g.addColorStop(0, 'rgba(255,245,195,1)');
    g.addColorStop(0.28, 'rgba(255,175,65,0.62)');
    g.addColorStop(0.65, 'rgba(255,115,20,0.16)');
    g.addColorStop(1, 'rgba(255,95,0,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 128, 128);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  })();

  let primaryLanternWorldPos = new THREE.Vector3(-2.6, 1.85, 3.6);

  lanternSpec.forEach((spec, idx) => {
    const px = trailCenterX(spec.z) - 1.05;
    const py = terrainHeight(px, spec.z);
    const postGroup = new THREE.Group();
    postGroup.position.set(px, py, spec.z);
    postGroup.rotation.y = 0.25 + idx * 0.12;

    // Poste vertical chanfrado/natural + braço horizontal + mão-francesa
    const upright = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.115, 0.145, 2.55, 10)),
      mats.barkMat
    );
    upright.position.y = 1.22;
    upright.castShadow = true;
    upright.receiveShadow = true;
    postGroup.add(upright);

    const crossArm = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.068, 0.082, 0.88, 9)),
      mats.barkMat
    );
    crossArm.rotation.z = Math.PI / 2;
    crossArm.position.set(0.32, 2.28, 0);
    crossArm.castShadow = true;
    postGroup.add(crossArm);

    const brace = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.042, 0.048, 0.56, 7)),
      mats.barkMat
    );
    brace.position.set(0.22, 2.03, 0);
    brace.rotation.z = -Math.PI * 0.24;
    postGroup.add(brace);

    // Voltas helicoidais de corda de sisal amarrando o braço
    const ropePts = [];
    for (let k = 0; k <= 36; k++) {
      const a = (k / 36) * Math.PI * 6;
      ropePts.push(new THREE.Vector3(Math.cos(a) * 0.135, 2.15 + (k / 36) * 0.26, Math.sin(a) * 0.135));
    }
    const ropeCoil = new THREE.Mesh(
      trackGeo(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(ropePts), 32, 0.024, 6, false)),
      mats.ropeMat
    );
    postGroup.add(ropeCoil);

    // Lampião suspenso com alça, proteção em ferro, vidro âmbar e chama
    const lanternPivot = new THREE.Group();
    lanternPivot.position.set(0.66, 2.26, 0);
    postGroup.add(lanternPivot);

    const hook = new THREE.Mesh(trackGeo(new THREE.TorusGeometry(0.055, 0.011, 6, 14)), mats.bronzeMat);
    hook.position.y = -0.05;
    lanternPivot.add(hook);

    const lanAssembly = new THREE.Group();
    lanAssembly.position.y = -0.58;
    lanternPivot.add(lanAssembly);

    lanAssembly.add(new THREE.Mesh(lanBaseGeo, mats.bronzeMat));
    lanAssembly.add(new THREE.Mesh(lanTopGeo, mats.bronzeMat));
    const glass = new THREE.Mesh(lanGlassGeo, mats.lanternGlassMat);
    glass.position.y = 0.205;
    lanAssembly.add(glass);

    for (let s = 0; s < 4; s++) {
      const ang = (s / 4) * Math.PI * 2 + 0.4;
      const strut = new THREE.Mesh(lanStrutGeo, mats.bronzeMat);
      strut.position.set(Math.cos(ang) * 0.098, 0.205, Math.sin(ang) * 0.098);
      lanAssembly.add(strut);
    }

    const flameMat = trackMat(new THREE.MeshBasicMaterial({ color: 0xffe49e }));
    const flame = new THREE.Mesh(flameGeo, flameMat);
    flame.position.y = 0.19;
    lanAssembly.add(flame);

    const haloMat = trackMat(new THREE.SpriteMaterial({
      map: glowCanvasTex,
      color: 0xffb347,
      transparent: true,
      opacity: 0.78,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    }));
    const halo = new THREE.Sprite(haloMat);
    halo.position.y = 0.20;
    halo.scale.set(1.15, 1.15, 1);
    lanAssembly.add(halo);

    // Luz pontual quente local iluminando trilha, folhas e água
    const ptLight = new THREE.PointLight(0xff9f3a, 5.2 * spec.power, 14.5, 1.55);
    ptLight.position.set(0, 0.22, 0);
    lanAssembly.add(ptLight);

    scene.add(postGroup);
    postGroup.updateMatrixWorld(true);
    if (idx === 0) {
      flame.getWorldPosition(primaryLanternWorldPos);
    }

    flameMeshes.push({
      flame,
      haloMat,
      pivot: lanternPivot,
      phase: idx * 2.1,
    });
    lanternLights.push({
      light: ptLight,
      baseIntensity: 5.2 * spec.power,
      phase: idx * 1.73,
    });
  });

  // ============================================================================
  // 6. ÁRVORES DA MATA CILIAR, RAÍZES EXPOSTAS & FOLHAGEM DE BORDA
  // ============================================================================
  function buildTreeParts(x, z, height, leanX, leanZ, trunkR, canopyLeavesCount, addToGeos) {
    const baseY = terrainHeight(x, z) - 0.12;
    const pts = [
      new THREE.Vector3(x, baseY, z),
      new THREE.Vector3(x + leanX * 0.35, baseY + height * 0.38, z + leanZ * 0.3),
      new THREE.Vector3(x + leanX * 0.78, baseY + height * 0.76, z + leanZ * 0.72),
      new THREE.Vector3(x + leanX, baseY + height, z + leanZ),
    ];
    const curve = new THREE.CatmullRomCurve3(pts);
    const trunkGeo = new THREE.TubeGeometry(curve, 14, trunkR, 8, false);
    const tp = trunkGeo.attributes.position;
    for (let i = 0; i < tp.count; i++) {
      const yFrac = clamp((tp.getY(i) - baseY) / height, 0, 1);
      const center = curve.getPointAt(yFrac);
      const taper = 1.0 - yFrac * 0.65;
      tp.setXYZ(
        i,
        center.x + (tp.getX(i) - center.x) * taper,
        tp.getY(i),
        center.z + (tp.getZ(i) - center.z) * taper
      );
    }
    trunkGeo.computeVertexNormals();
    addToGeos.bark.push(trunkGeo);

    // Galhos secundários alcançando sobre a trilha/riacho
    for (let b = 0; b < 3; b++) {
      const startT = 0.56 + b * 0.15;
      const bStart = curve.getPointAt(startT);
      const bAng = (b * 2.2) + rnd() * 0.6;
      const reach = height * (0.34 + rnd() * 0.18);
      const bEnd = new THREE.Vector3(
        bStart.x + Math.cos(bAng) * reach + leanX * 0.35,
        bStart.y + height * (0.14 + rnd() * 0.12),
        bStart.z + Math.sin(bAng) * reach
      );
      const bMid = bStart.clone().lerp(bEnd, 0.5).add(new THREE.Vector3(0, 0.25, 0));
      const bGeo = new THREE.TubeGeometry(new THREE.CatmullRomCurve3([bStart, bMid, bEnd]), 7, trunkR * 0.38, 6, false);
      addToGeos.bark.push(bGeo);

      for (let l = 0; l < canopyLeavesCount; l++) {
        dummy.position.copy(bEnd).add(new THREE.Vector3((rnd() - 0.5) * 1.45, (rnd() - 0.4) * 0.85, (rnd() - 0.5) * 1.45));
        dummy.rotation.set(rnd() * 0.9 - 0.45, rnd() * 6.28, rnd() * 0.8 - 0.4);
        const s = 0.55 + rnd() * 0.65;
        dummy.scale.set(s, s, s);
        dummy.updateMatrix();
        addToGeos.leafMatrices.push(dummy.matrix.clone());
      }
    }
  }

  const treeAccumulator = { bark: [], leafMatrices: [] };

  // Árvore grande inclinada em primeiro plano (compõe a moldura esquerda do mockup)
  buildTreeParts(trailCenterX(2.1) - 2.35, 2.1, 6.2, 2.7, 0.4, 0.34, 24, treeAccumulator);
  // Árvores menores espalhadas ao longo das margens do vale
  const treeSites = [
    [-4.8, -6.5, 4.8, 1.1, 0.2, 0.22, 16],
    [-6.2, -16.0, 5.2, 0.8, -0.3, 0.24, 15],
    [6.4, -4.5, 4.4, -0.9, 0.2, 0.20, 14],
    [7.2, -14.0, 5.6, -1.2, -0.2, 0.25, 16],
    [1.4, -18.5, 3.6, 0.4, 0.3, 0.14, 14], // pequena árvore central vista ao longe no vale
    [-3.8, -28.0, 5.4, 0.9, 0.1, 0.24, 15],
    [6.8, -29.0, 6.0, -0.8, 0.0, 0.26, 15],
  ];
  treeSites.forEach((s) => buildTreeParts(s[0], s[1], s[2], s[3], s[4], s[5], s[6], treeAccumulator));

  // Raízes retorcidas cruzando levemente a beira da trilha
  for (let rIdx = 0; rIdx < 6; rIdx++) {
    const rz = 4.6 - rIdx * 2.4;
    const rx = trailCenterX(rz) - 0.95;
    const ry = terrainHeight(rx, rz);
    const rPts = [];
    for (let k = 0; k <= 5; k++) {
      const px = rx + k * 0.36;
      const pz = rz + Math.sin(k * 1.4 + rIdx) * 0.22;
      rPts.push(new THREE.Vector3(px, terrainHeight(px, pz) + 0.045 - k * 0.01, pz));
    }
    const rGeo = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(rPts), 12, 0.048, 6, false);
    treeAccumulator.bark.push(rGeo);
  }

  const mergedWoodGeo = trackGeo(mergeGeometries(treeAccumulator.bark));
  const valleyTreesMesh = new THREE.Mesh(mergedWoodGeo, mats.barkMat);
  valleyTreesMesh.castShadow = true;
  valleyTreesMesh.receiveShadow = true;
  scene.add(valleyTreesMesh);

  // Folhagens em buquê 3D esculpido (6 folhas pontudas em leque, sem blocos quadrados e sem alphaTest lento)
  const leafClusterGeo = trackGeo((function () {
    const pos = [], nrm = [], idx = [];
    const blades = 6;
    for (let b = 0; b < blades; b++) {
      const yaw = (b / blades) * Math.PI * 2;
      const pitch = 0.25 + (b % 2) * 0.22;
      const ca = Math.cos(yaw), sa = Math.sin(yaw);
      const cp = Math.cos(pitch), sp = Math.sin(pitch);
      const len = 0.72 + (b % 3) * 0.14;
      const wid = 0.24;
      const pts = [
        [0, 0, 0],
        [-wid, sp * len * 0.45, cp * len * 0.45],
        [wid, sp * len * 0.45, cp * len * 0.45],
        [0, sp * len * 0.88 - 0.08, cp * len],
      ].map(([x, y, z]) => [x * ca - z * sa, y, x * sa + z * ca]);
      const base = pos.length / 3;
      pts.forEach((p) => { pos.push(p[0], p[1], p[2]); nrm.push(0, 1, 0); });
      idx.push(base, base + 1, base + 2, base + 1, base + 3, base + 2);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    g.setAttribute('normal', new THREE.Float32BufferAttribute(nrm, 3));
    g.setIndex(idx);
    g.computeVertexNormals();
    return g;
  })());

  const canopyInst = new THREE.InstancedMesh(
    leafClusterGeo,
    mats.leafMat,
    treeAccumulator.leafMatrices.length
  );
  treeAccumulator.leafMatrices.forEach((m, i) => canopyInst.setMatrixAt(i, m));
  canopyInst.instanceMatrix.needsUpdate = true;
  canopyInst.castShadow = false;
  scene.add(canopyInst);

  // Heliconia & grandes folhas tropicais em destaque no canto inferior esquerdo (mockup)
  const fgPlantGroup = new THREE.Group();
  const basePlantX = trailCenterX(4.4) - 1.55;
  const basePlantZ = 4.4;
  const basePlantY = terrainHeight(basePlantX, basePlantZ);
  fgPlantGroup.position.set(basePlantX, basePlantY, basePlantZ);

  const broadLeafGeo = trackGeo(new THREE.PlaneGeometry(0.46, 1.05, 6, 10));
  broadLeafGeo.translate(0, 0.52, 0);
  const bp = broadLeafGeo.attributes.position;
  for (let i = 0; i < bp.count; i++) {
    const x = bp.getX(i), y = bp.getY(i);
    const env = Math.sin(clamp(y / 1.05, 0, 1) * Math.PI);
    bp.setX(i, x * (0.25 + 0.98 * env));
    bp.setZ(i, -0.20 * y * y);
  }
  broadLeafGeo.computeVertexNormals();

  for (let i = 0; i < 9; i++) {
    const lm = new THREE.Mesh(broadLeafGeo, mats.broadLeafMat);
    lm.rotation.y = (i / 9) * Math.PI * 2 + 0.35;
    lm.rotation.x = 0.52 + (i % 3) * 0.22;
    lm.scale.setScalar(0.75 + (i % 3) * 0.22);
    lm.castShadow = false;
    fgPlantGroup.add(lm);
  }
  // Inflorescência vermelha curva tipo helicônia ("bico-de-papagaio")
  const bractGeo = trackGeo(new THREE.SphereGeometry(0.065, 8, 6));
  bractGeo.scale(0.55, 1.55, 0.42);
  for (let b = 0; b < 6; b++) {
    const bract = new THREE.Mesh(bractGeo, mats.heliconiaMat);
    bract.position.set((b % 2 === 0 ? -1 : 1) * 0.055, 0.72 + b * 0.11, -0.18);
    bract.rotation.z = (b % 2 === 0 ? 1 : -1) * 0.62;
    bract.rotation.x = 0.2;
    fgPlantGroup.add(bract);
  }
  scene.add(fgPlantGroup);

  // ============================================================================
  // 7. CAPIM & JUNCO MARGINAL INSTANCIADO COM VENTO NO VERTEX SHADER
  // ============================================================================
  const MAX_GRASS = 5200;
  const grassBladeGeo = trackGeo(new THREE.PlaneGeometry(0.065, 0.78, 1, 4));
  grassBladeGeo.translate(0, 0.39, 0);
  const gp = grassBladeGeo.attributes.position;
  for (let i = 0; i < gp.count; i++) {
    const yFrac = gp.getY(i) / 0.78;
    // Afila até a ponta e arqueia naturalmente
    gp.setX(i, gp.getX(i) * (1.0 - yFrac * 0.88));
    gp.setZ(i, yFrac * yFrac * 0.16);
  }
  grassBladeGeo.computeVertexNormals();

  const grassUniforms = {
    uTime: { value: 0 },
    uMotionScale: { value: 1.0 },
    uLanternPos: { value: primaryLanternWorldPos },
    uBrightness: { value: 0.74 },
  };
  const grassMat = trackMat(new THREE.ShaderMaterial({
    uniforms: grassUniforms,
    side: THREE.DoubleSide,
    vertexShader: /* glsl */ `
      uniform float uTime;
      uniform float uMotionScale;
      varying float vHeight;
      varying vec3 vWorldPos;
      varying vec3 vCol;

      void main() {
        vHeight = clamp(position.y / 0.78, 0.0, 1.0);
        #ifdef USE_INSTANCING_COLOR
          vCol = instanceColor;
        #else
          vCol = vec3(0.16, 0.34, 0.14);
        #endif
        vec3 p = position;
        vec4 worldBase = instanceMatrix * vec4(0.0, 0.0, 0.0, 1.0);
        float phase = worldBase.x * 0.7 + worldBase.z * 0.45;
        float sway = sin(uTime * 1.65 * uMotionScale + phase) * 0.14
                   + cos(uTime * 2.75 * uMotionScale - phase * 1.4) * 0.05;
        p.x += sway * vHeight * vHeight * uMotionScale;
        p.z += sway * 0.45 * vHeight * vHeight * uMotionScale;

        vec4 wp = modelMatrix * instanceMatrix * vec4(p, 1.0);
        vWorldPos = wp.xyz;
        gl_Position = projectionMatrix * viewMatrix * wp;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform vec3 uLanternPos;
      uniform float uBrightness;
      varying float vHeight;
      varying vec3 vWorldPos;
      varying vec3 vCol;

      void main() {
        // Luz fria noturna + luz dourada do lampião + ponta iluminada
        vec3 base = vCol * mix(0.32, 1.05, vHeight);
        float lDist = length(uLanternPos - vWorldPos);
        float warm = exp(-lDist * 0.24) * (0.4 + uBrightness * 0.9);
        vec3 col = base + vec3(0.95, 0.62, 0.18) * warm * (0.35 + 0.65 * vHeight);
        // Neblina noturna à distância
        float dist = length(cameraPosition - vWorldPos);
        float fog = 1.0 - exp(-0.021 * 0.021 * dist * dist);
        col = mix(col, vec3(0.04, 0.09, 0.16), clamp(fog, 0.0, 1.0));
        gl_FragColor = vec4(col, 1.0);
      }
    `,
  }));

  const grassInst = new THREE.InstancedMesh(grassBladeGeo, grassMat, MAX_GRASS);
  const gCol = new THREE.Color();
  let placed = 0;
  let attempts = 0;
  while (placed < MAX_GRASS && attempts < MAX_GRASS * 4) {
    attempts++;
    const z = lerp(-44, 12, Math.pow(rnd(), 0.78)); // maior densidade no primeiro plano e várzea média
    const x = lerp(-13, 13, rnd());
    const tm = trailMask(x, z);
    const y = terrainHeight(x, z);
    // Deixa a calha central e a beirada molhada livres para exibir o espelho d'água
    const distToStream = Math.abs(x - streamCenterX(z));
    if (tm > 0.36 || y < WATER_LEVEL + 0.14 || distToStream < streamHalfWidth(z) * 0.96) continue;
    dummy.position.set(x, y - 0.03, z);
    dummy.rotation.set(0, rnd() * Math.PI * 2, (rnd() - 0.5) * 0.18);
    const scH = (0.55 + rnd() * 0.92) * (distToStream < streamHalfWidth(z) + 1.5 ? 1.15 : 0.85);
    dummy.scale.set(0.85 + rnd() * 0.5, scH, 1.0);
    dummy.updateMatrix();
    grassInst.setMatrixAt(placed, dummy.matrix);
    gCol.setHSL(0.25 + (rnd() - 0.5) * 0.06, 0.42 + rnd() * 0.22, 0.18 + rnd() * 0.16);
    grassInst.setColorAt(placed, gCol);
    placed++;
  }
  grassInst.count = placed;
  grassInst.instanceMatrix.needsUpdate = true;
  if (grassInst.instanceColor) grassInst.instanceColor.needsUpdate = true;
  scene.add(grassInst);

  // ============================================================================
  // 8. NÉVOA NOTURNA BAIXA NAS MARGENS DO VALE AO FUNDO
  // ============================================================================
  const mistMat = trackMat(new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
    uniforms: {
      uTime: { value: 0 },
      uMotionScale: { value: 1.0 },
      uColor: { value: new THREE.Color(0x527499) },
    },
    vertexShader: /* glsl */ `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: /* glsl */ `
      uniform float uTime;
      uniform float uMotionScale;
      uniform vec3 uColor;
      varying vec2 vUv;
      void main() {
        float w = sin(vUv.x * 11.0 + uTime * 0.18 * uMotionScale) * 0.5 + 0.5;
        float edge = sin(vUv.x * 3.14159) * sin(vUv.y * 3.14159);
        float a = edge * (0.09 + 0.11 * w);
        gl_FragColor = vec4(uColor, a);
      }
    `,
  }));
  const mistGeo = trackGeo(new THREE.PlaneGeometry(36, 5.5));
  for (let m = 0; m < 3; m++) {
    const mist = new THREE.Mesh(mistGeo, mistMat);
    mist.position.set(streamCenterX(-26 - m * 12), 1.3 + m * 0.75, -26 - m * 11);
    scene.add(mist);
  }

  // ============================================================================
  // 9. ATUALIZAÇÃO ATMOSFÉRICA POR HORÁRIO, BRILHO E PERFIL GRÁFICO
  // ============================================================================
  const envColors = {
    zenith: new THREE.Color(),
    horizon: new THREE.Color(),
    moonColor: new THREE.Color(),
    moonDir: new THREE.Vector3(),
    fog: new THREE.Color(),
    moonStrength: 1.0,
  };

  function updateAtmosphere(elapsed, state) {
    // Mapeia hora [18.5..28.5] para ângulo lunar e cor atmosférica
    const h = state.hour;
    const duskT = clamp(1 - (h - 18.5) / 2.2, 0, 1);        // entardecer 18:30 -> 20:42
    const dawnT = clamp((h - 26.2) / 2.3, 0, 1);            // aurora   02:12 -> 04:30
    const nightWeight = 1 - Math.max(duskT, dawnT);

    // Zênite e horizonte
    envColors.zenith.setRGB(
      lerp(0.035, 0.14, duskT) + dawnT * 0.08,
      lerp(0.085, 0.11, duskT) + dawnT * 0.14,
      lerp(0.185, 0.25, duskT) + dawnT * 0.30
    );
    envColors.horizon.setRGB(
      lerp(0.10, 0.42, duskT) + dawnT * 0.22,
      lerp(0.22, 0.24, duskT) + dawnT * 0.32,
      lerp(0.34, 0.36, duskT) + dawnT * 0.48
    );
    envColors.fog.copy(envColors.horizon).multiplyScalar(0.18);
    scene.fog.color.copy(envColors.fog);
    scene.background.copy(envColors.fog);

    // Órbita suave da Lua ao longo da noite (enquadramento do mockup em ~22h no quadrante superior direito)
    const moonPhase = (h - 19.0) / 10.0;
    const moonAz = lerp(0.10, 0.56, moonPhase);
    const moonEl = 0.24 + Math.sin(clamp(moonPhase, 0.05, 0.95) * Math.PI) * 0.14;
    envColors.moonDir.set(Math.sin(moonAz), Math.sin(moonEl), -Math.cos(moonAz) * Math.cos(moonEl)).normalize();

    moonSprite.position.copy(envColors.moonDir).multiplyScalar(110);
    envColors.moonStrength = clamp(0.45 + nightWeight * 0.72, 0.3, 1.15);
    moonSpriteMat.opacity = clamp(0.55 + nightWeight * 0.45, 0.35, 1.0);
    envColors.moonColor.setHex(0xc8dcff).lerp(new THREE.Color(0xffdfc4), duskT * 0.35);

    moonLight.position.copy(envColors.moonDir).multiplyScalar(32);
    moonLight.color.copy(envColors.moonColor);
    moonLight.intensity = 0.45 + envColors.moonStrength * 0.35;
    hemiLight.intensity = 0.32 + duskT * 0.22 + dawnT * 0.32;

    // Céu, estrelas, grama e névoa
    skyUniforms.uTime.value = elapsed;
    skyUniforms.uMotion.value = state.reducedMotion ? 0.15 : 1.0;
    skyUniforms.uZenith.value.copy(envColors.zenith);
    skyUniforms.uHorizon.value.copy(envColors.horizon);
    skyUniforms.uMoonDir.value.copy(envColors.moonDir);

    starUniforms.uTime.value = elapsed;
    starUniforms.uTwinkle.value = state.reducedMotion ? 0.0 : 1.0; // T02: elimina cintilação!
    starUniforms.uVisibility.value = clamp(0.25 + nightWeight * 0.85, 0.15, 1.0);

    grassUniforms.uTime.value = elapsed;
    grassUniforms.uMotionScale.value = state.reducedMotion ? 0.12 : 1.0;
    grassUniforms.uBrightness.value = state.brightness;

    mistMat.uniforms.uTime.value = elapsed;
    mistMat.uniforms.uMotionScale.value = state.reducedMotion ? 0.15 : 1.0;
    mistMat.uniforms.uColor.value.copy(envColors.horizon).multiplyScalar(0.9);

    // Lampiões a óleo: cintilação orgânica suave (anulada em Movimento Reduzido T02)
    const brightFactor = 0.35 + state.brightness * 0.95;
    lanternLights.forEach((l, i) => {
      const flicker = state.reducedMotion
        ? 1.0
        : 1.0 + Math.sin(elapsed * 9.5 + l.phase) * 0.05 + Math.cos(elapsed * 16.3 + i) * 0.035;
      l.light.intensity = l.baseIntensity * brightFactor * flicker;
      const fm = flameMeshes[i];
      if (fm) {
        fm.flame.scale.set(0.82 * flicker, 1.55 * flicker, 0.82 * flicker);
        fm.haloMat.opacity = (0.45 + state.brightness * 0.48) * flicker;
        if (!state.reducedMotion) {
          fm.pivot.rotation.z = Math.sin(elapsed * 1.1 + fm.phase) * 0.025;
        }
      }
    });

    return envColors;
  }

  function applyQualityCounts(profile) {
    grassInst.count = Math.min(placed, profile.grassCount);
    pebbleInst.count = Math.min(MAX_PEBBLES, profile.pebbleCount);
    starGeo.setDrawRange(0, Math.min(MAX_STARS, profile.starCount));
  }

  return {
    boulderObstacles,
    primaryLanternWorldPos,
    updateAtmosphere,
    applyQualityCounts,
    dispose() {
      moonTex.dispose();
      glowCanvasTex.dispose();
      disposableGeos.forEach((g) => g.dispose());
      disposableMats.forEach((m) => m.dispose());
    },
  };
}
