import * as THREE from '../../../Sistema/shared/vendor/three.module.js';

// =========================================================================
// DETERMINISTIC PRNG & NOISE HELPERS (Seeded for consistent botanical form)
// =========================================================================
function mulberry32(seed) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rng = mulberry32(24673);
const rand = (min = 0, max = 1) => min + rng() * (max - min);

function hash2(x, y) {
  const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453123;
  return s - Math.floor(s);
}

function valueNoise2D(x, y) {
  const ix = Math.floor(x), iy = Math.floor(y);
  const fx = x - ix, fy = y - iy;
  const ux = fx * fx * (3 - 2 * fx);
  const uy = fy * fy * (3 - 2 * fy);
  const a = hash2(ix, iy);
  const b = hash2(ix + 1, iy);
  const c = hash2(ix, iy + 1);
  const d = hash2(ix + 1, iy + 1);
  return a + (b - a) * ux + (c - a) * uy + (a - b - c + d) * ux * uy;
}

function fbm2D(x, y, octaves = 4) {
  let v = 0, amp = 0.5, freq = 1;
  for (let i = 0; i < octaves; i++) {
    v += amp * valueNoise2D(x * freq, y * freq);
    freq *= 2.02;
    amp *= 0.5;
  }
  return v;
}

// =========================================================================
// 1. ASSET MANAGER (Resource tracking & clean WebGL disposal)
// =========================================================================
class AssetManager {
  constructor() {
    this.geometries = new Set();
    this.materials = new Set();
    this.textures = new Set();
  }
  trackGeometry(g) { this.geometries.add(g); return g; }
  trackMaterial(m) { this.materials.add(m); return m; }
  trackTexture(t) { this.textures.add(t); return t; }
  disposeAll() {
    this.geometries.forEach(g => g.dispose());
    this.materials.forEach(m => m.dispose());
    this.textures.forEach(t => t.dispose());
    this.geometries.clear();
    this.materials.clear();
    this.textures.clear();
  }
}

// =========================================================================
// 2. TEXTURE GENERATOR (Procedural PBR Albedo, Bump, Roughness, Venation)
// =========================================================================
class TextureGenerator {
  constructor(assets) {
    this.assets = assets;
  }

  createBractTextures() {
    const size = 512;
    const cAlb = document.createElement("canvas");
    const cBump = document.createElement("canvas");
    const cRough = document.createElement("canvas");
    cAlb.width = cBump.width = cRough.width = size;
    cAlb.height = cBump.height = cRough.height = size;

    const gA = cAlb.getContext("2d");
    const gB = cBump.getContext("2d");
    const gR = cRough.getContext("2d");

    // Rich vivid magenta papery base gradient (matching 24673.jpg bracts)
    const grad = gA.createLinearGradient(0, size, 0, 0);
    grad.addColorStop(0.0, "#a60d49");
    grad.addColorStop(0.28, "#d91972");
    grad.addColorStop(0.68, "#eb308d");
    grad.addColorStop(1.0, "#e746a3");
    gA.fillStyle = grad;
    gA.fillRect(0, 0, size, size);

    // Papery cellular micro-grain
    const imgA = gA.getImageData(0, 0, size, size);
    const imgB = gB.createImageData(size, size);
    const imgR = gR.createImageData(size, size);
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const idx = (y * size + x) * 4;
        const n1 = fbm2D(x * 0.035, y * 0.035, 3);
        const n2 = hash2(x * 0.8, y * 0.8);
        const fold = fbm2D(x * 0.012 + y * 0.006, y * 0.018, 3);
        const grain = (n1 - 0.5) * 17 + (n2 - 0.5) * 8 + (fold - 0.5) * 40;

        imgA.data[idx] = Math.min(255, Math.max(0, imgA.data[idx] + grain * 0.7));
        imgA.data[idx + 1] = Math.min(255, Math.max(0, imgA.data[idx + 1] + grain * 0.35));
        imgA.data[idx + 2] = Math.min(255, Math.max(0, imgA.data[idx + 2] + grain * 0.6));

        const bVal = Math.min(255, Math.max(0, 128 + (n1 - 0.5) * 23 + (n2 - 0.5) * 8 + (fold - 0.5) * 35));
        imgB.data[idx] = imgB.data[idx + 1] = imgB.data[idx + 2] = bVal;
        imgB.data[idx + 3] = 255;

        const rVal = Math.min(255, Math.max(0, 155 + (n1 - 0.5) * 55));
        imgR.data[idx] = imgR.data[idx + 1] = imgR.data[idx + 2] = rVal;
        imgR.data[idx + 3] = 255;
      }
    }
    gA.putImageData(imgA, 0, 0);
    gB.putImageData(imgB, 0, 0);
    gR.putImageData(imgR, 0, 0);

    // Draw characteristic dark crimson-magenta midrib & reticulate venation
    const drawVeins = (ctx, colorMain, colorSub, widthScale) => {
      ctx.lineCap = "round";
      // Central midrib
      ctx.strokeStyle = colorMain;
      ctx.lineWidth = 5.2 * widthScale;
      ctx.beginPath();
      ctx.moveTo(size * 0.5, size * 0.98);
      ctx.quadraticCurveTo(size * 0.495, size * 0.5, size * 0.5, size * 0.04);
      ctx.stroke();

      // Primary lateral veins
      const pairs = 7;
      for (let i = 0; i < pairs; i++) {
        const t = 0.14 + (i / pairs) * 0.74;
        const y0 = size * (1 - t);
        const spread = Math.sin(t * Math.PI) * size * 0.44;
        const rise = size * (0.14 + (1 - t) * 0.08);
        for (const dir of [-1, 1]) {
          ctx.strokeStyle = colorMain;
          ctx.lineWidth = (3.4 - t * 1.8) * widthScale;
          ctx.beginPath();
          ctx.moveTo(size * 0.5, y0);
          const cx = size * 0.5 + dir * spread * 0.55;
          const cy = y0 - rise * 0.35;
          const ex = size * 0.5 + dir * spread;
          const ey = y0 - rise;
          ctx.quadraticCurveTo(cx, cy, ex, ey);
          ctx.stroke();

          // Secondary fine branching venation
          ctx.strokeStyle = colorSub;
          ctx.lineWidth = 1.2 * widthScale;
          for (let j = 1; j <= 3; j++) {
            const f = j * 0.28;
            const sx = size * 0.5 + dir * spread * f;
            const sy = y0 - rise * f * 0.65;
            ctx.beginPath();
            ctx.moveTo(sx, sy);
            const tipX = sx + dir * (16 + 13 * f);
            const tipY = sy - 21 - 9 * f;
            ctx.quadraticCurveTo(tipX - dir * 12, tipY + 6, tipX, tipY);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(tipX - dir * 8, tipY + 6);
            ctx.lineTo(tipX + dir * 9, tipY + 10);
            ctx.stroke();
          }
        }
      }
    };

    drawVeins(gA, "rgba(130, 9, 58, 0.44)", "rgba(102, 21, 63, 0.26)", 1.0);
    drawVeins(gB, "rgba(189, 189, 189, 0.70)", "rgba(166, 166, 166, 0.43)", 1.15);
    drawVeins(gR, "rgba(110, 110, 110, 0.6)", "rgba(135, 135, 135, 0.35)", 1.0);

    const map = this.assets.trackTexture(new THREE.CanvasTexture(cAlb));
    map.colorSpace = THREE.SRGBColorSpace;
    map.anisotropy = 4;

    const bumpMap = this.assets.trackTexture(new THREE.CanvasTexture(cBump));
    const roughnessMap = this.assets.trackTexture(new THREE.CanvasTexture(cRough));
    return { map, bumpMap, roughnessMap };
  }

  createLeafTextures() {
    const size = 256;
    const cAlb = document.createElement("canvas");
    const cBump = document.createElement("canvas");
    cAlb.width = cBump.width = size;
    cAlb.height = cBump.height = size;
    const gA = cAlb.getContext("2d");
    const gB = cBump.getContext("2d");

    const grad = gA.createLinearGradient(0, size, 0, 0);
    grad.addColorStop(0, "#475a29");
    grad.addColorStop(0.5, "#627b32");
    grad.addColorStop(1, "#768f43");
    gA.fillStyle = grad;
    gA.fillRect(0, 0, size, size);

    gB.fillStyle = "#808080";
    gB.fillRect(0, 0, size, size);

    // Organic mottling
    for (let i = 0; i < 180; i++) {
      const x = rand(0, size), y = rand(0, size), r = rand(4, 20);
      gA.fillStyle = rng() > 0.5 ? "rgba(136,150,78,0.09)" : "rgba(32,47,17,0.08)";
      gA.beginPath(); gA.arc(x, y, r, 0, Math.PI * 2); gA.fill();
    }

    // Midrib and veins
    gA.strokeStyle = "rgba(112, 146, 52, 0.72)";
    gA.lineWidth = 4;
    gA.beginPath(); gA.moveTo(size * 0.5, size); gA.lineTo(size * 0.5, 10); gA.stroke();

    gB.strokeStyle = "#d0d0d0";
    gB.lineWidth = 4;
    gB.beginPath(); gB.moveTo(size * 0.5, size); gB.lineTo(size * 0.5, 10); gB.stroke();

    for (let i = 1; i <= 5; i++) {
      const y = size * (1 - i * 0.16);
      for (const d of [-1, 1]) {
        gA.strokeStyle = "rgba(105, 138, 48, 0.45)";
        gA.lineWidth = 1.6;
        gA.beginPath();
        gA.moveTo(size * 0.5, y);
        gA.quadraticCurveTo(size * 0.5 + d * 42, y - 10, size * 0.5 + d * 88, y - 34);
        gA.stroke();
      }
    }

    const map = this.assets.trackTexture(new THREE.CanvasTexture(cAlb));
    map.colorSpace = THREE.SRGBColorSpace;
    const bumpMap = this.assets.trackTexture(new THREE.CanvasTexture(cBump));
    return { map, bumpMap };
  }

  createBarkTextures() {
    const size = 256;
    const cAlb = document.createElement("canvas");
    const cBump = document.createElement("canvas");
    cAlb.width = cBump.width = size;
    cAlb.height = cBump.height = size;
    const gA = cAlb.getContext("2d");
    const gB = cBump.getContext("2d");

    gA.fillStyle = "#777044";
    gA.fillRect(0, 0, size, size);
    gB.fillStyle = "#808080";
    gB.fillRect(0, 0, size, size);

    // Longitudinal olive-woody striations and lenticels
    for (let i = 0; i < 240; i++) {
      const x = rand(0, size);
      const w = rand(1, 5);
      const tone = rng();
      gA.fillStyle = tone > 0.6
        ? "rgba(102, 108, 48, 0.35)"
        : tone > 0.25
          ? "rgba(56, 54, 24, 0.42)"
          : "rgba(92, 74, 46, 0.3)";
      gA.fillRect(x, 0, w, size);

      gB.fillStyle = tone > 0.5 ? "rgba(210,210,210,0.35)" : "rgba(55,55,55,0.35)";
      gB.fillRect(x, 0, w, size);
    }

    // Small bark knots/lenticels
    for (let i = 0; i < 65; i++) {
      const x = rand(0, size), y = rand(0, size);
      gA.fillStyle = "rgba(138, 126, 88, 0.45)";
      gA.fillRect(x, y, rand(2, 6), rand(2, 3));
    }

    const map = this.assets.trackTexture(new THREE.CanvasTexture(cAlb));
    map.colorSpace = THREE.SRGBColorSpace;
    map.wrapS = map.wrapT = THREE.RepeatWrapping;
    map.repeat.set(1, 6);

    const bumpMap = this.assets.trackTexture(new THREE.CanvasTexture(cBump));
    bumpMap.wrapS = bumpMap.wrapT = THREE.RepeatWrapping;
    bumpMap.repeat.set(1, 6);
    return { map, bumpMap };
  }

  createSoilTexture() {
    const size = 256;
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext("2d");
    const image = ctx.createImageData(size, size);
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const offset = (y * size + x) * 4;
        const clods = fbm2D(x * 0.08, y * 0.08, 3);
        const grain = hash2(x, y);
        const value = 42 + clods * 54 + grain * 22;
        image.data.set([value * 1.15, value * 0.88, value * 0.62, 255], offset);
      }
    }
    ctx.putImageData(image, 0, 0);
    const map = this.assets.trackTexture(new THREE.CanvasTexture(canvas));
    map.colorSpace = THREE.SRGBColorSpace;
    map.wrapS = map.wrapT = THREE.RepeatWrapping;
    map.repeat.set(22, 22);
    map.anisotropy = 8;
    return map;
  }

  createWallTexture() {
    const size = 512;
    const c = document.createElement("canvas");
    c.width = c.height = size;
    const ctx = c.getContext("2d");

    const image = ctx.createImageData(size, size);
    for (let y = 0; y < size; y++) {
      const height = y / size;
      for (let x = 0; x < size; x++) {
        const offset = (y * size + x) * 4;
        const plaster = fbm2D(x * 0.019, y * 0.019, 4);
        const run = fbm2D(x * 0.081, y * 0.004, 3);
        const grit = hash2(x, y) - 0.5;
        const damp = THREE.MathUtils.smoothstep(height + (plaster - 0.5) * 0.34, 0.65, 1);
        const shade = 135 + plaster * 48 + grit * 22 - run * 26 - damp * 39;
        image.data[offset] = shade * (1.04 - damp * 0.13);
        image.data[offset + 1] = shade * (0.97 + damp * 0.02);
        image.data[offset + 2] = shade * (0.85 - damp * 0.06);
        image.data[offset + 3] = 255;
      }
    }
    ctx.putImageData(image, 0, 0);

    const tex = this.assets.trackTexture(new THREE.CanvasTexture(c));
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(3, 1);
    return tex;
  }

  createTerracottaTexture() {
    const size = 256;
    const c = document.createElement("canvas");
    c.width = c.height = size;
    const ctx = c.getContext("2d");

    ctx.fillStyle = "#bf6234";
    ctx.fillRect(0, 0, size, size);
    for (let i = 0; i < 180; i++) {
      ctx.fillStyle = rng() > 0.45 ? "rgba(218,124,72,0.22)" : "rgba(115,48,20,0.24)";
      ctx.fillRect(rand(0, size), rand(0, size), rand(4, 22), rand(4, 22));
    }
    const tex = this.assets.trackTexture(new THREE.CanvasTexture(c));
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }

  createSoftParticleTexture() {
    const size = 64;
    const c = document.createElement("canvas");
    c.width = c.height = size;
    const ctx = c.getContext("2d");
    const g = ctx.createRadialGradient(32, 32, 2, 32, 32, 30);
    g.addColorStop(0, "rgba(255, 250, 238, 0.95)");
    g.addColorStop(0.45, "rgba(255, 232, 240, 0.45)");
    g.addColorStop(1, "rgba(255, 220, 235, 0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);
    const tex = this.assets.trackTexture(new THREE.CanvasTexture(c));
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }
}

// =========================================================================
// 3. MATERIAL FACTORY (PBR + Custom Subsurface Scattering Shader Injection)
// =========================================================================
class MaterialFactory {
  constructor(assets, texGen) {
    this.assets = assets;
    this.texGen = texGen;
    this.sssUniforms = {
      uLightDir: { value: new THREE.Vector3(-0.35, 0.82, -0.45).normalize() },
      uSssColor: { value: new THREE.Color("#ff96c3") },
      uSssIntensity: { value: 0.72 },
      uTime: { value: 0 },
      uWindStrength: { value: 0.35 }
    };
    this.leafSssUniforms = {
      uLightDir: this.sssUniforms.uLightDir,
      uTime: this.sssUniforms.uTime,
      uWindStrength: this.sssUniforms.uWindStrength,
      uSssColor: { value: new THREE.Color("#b9e875") },
      uSssIntensity: { value: 0.38 }
    };
    this.initMaterials();
  }

  injectTranslucency(material, uniforms, isBract) {
    material.customProgramCacheKey = () => isBract ? "papery-bract" : "leaf";
    material.onBeforeCompile = (shader) => {
      Object.assign(shader.uniforms, uniforms);
      shader.vertexShader = shader.vertexShader
        .replace("#include <common>", `
          #include <common>
          uniform float uTime;
          uniform float uWindStrength;
        `)
        .replace("#include <begin_vertex>", `
          #include <begin_vertex>
          float phase = 0.0;
          #ifdef USE_INSTANCING
            phase = dot(instanceMatrix[3].xyz, vec3(3.9, 8.3, 2.8));
          #endif
          transformed.z += sin(uTime * 3.0 + phase + uv.y * 3.6)
            * uWindStrength * smoothstep(0.05, 1.0, uv.y) * ${isBract ? '0.023' : '0.055'};
        `);
      shader.fragmentShader = shader.fragmentShader
        .replace("#include <common>", `
          #include <common>
          uniform vec3 uLightDir;
          uniform vec3 uSssColor;
          uniform float uSssIntensity;
        `)
        .replace("#include <opaque_fragment>", `
          vec3 lightView = normalize(mat3(viewMatrix) * uLightDir);
          float backLight = pow(max(0.0, dot(-normal, lightView)), 0.75);
          float forward = max(0.0, dot(normalize(vViewPosition), -lightView));
          outgoingLight += diffuseColor.rgb * uSssColor * uSssIntensity
            * backLight * (0.35 + forward * 0.65);
          #include <opaque_fragment>
        `);
    };
  }

  initMaterials() {
    const bractTex = this.texGen.createBractTextures();
    const leafTex = this.texGen.createLeafTextures();
    const barkTex = this.texGen.createBarkTextures();

    // 3 subtle hue/luminance variants of magenta bracts for natural non-uniformity
    const bractTints = ["#ffffff", "#ffd0df", "#f3b9ff"];
    this.bractMaterials = bractTints.map((hex, i) => {
      const mat = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(hex),
        map: bractTex.map,
        bumpMap: bractTex.bumpMap,
        bumpScale: 0.0032,
        roughnessMap: bractTex.roughnessMap,
        roughness: 0.86 + i * 0.04,
        metalness: 0.0,
        clearcoat: 0.015,
        clearcoatRoughness: 0.7,
        side: THREE.DoubleSide,
        vertexColors: true
      });
      this.injectTranslucency(mat, this.sssUniforms, true);
      return this.assets.trackMaterial(mat);
    });

    // True flower tube (deep crimson-magenta stalk)
    this.flowerTubeMat = this.assets.trackMaterial(new THREE.MeshStandardMaterial({
      color: new THREE.Color("#b0144c"),
      roughness: 0.52,
      metalness: 0.02
    }));

    // True flower creamy-white 5-lobed star corolla
    this.flowerTipMat = this.assets.trackMaterial(new THREE.MeshStandardMaterial({
      color: new THREE.Color("#f3f1dc"),
      emissive: new THREE.Color("#423f2a"),
      emissiveIntensity: 0.18,
      roughness: 0.48,
      metalness: 0.0,
      side: THREE.DoubleSide
    }));

    // Foliage leaf material (supports instancing colors)
    this.leafMat = this.assets.trackMaterial(new THREE.MeshStandardMaterial({
      color: new THREE.Color("#ffffff"),
      map: leafTex.map,
      bumpMap: leafTex.bumpMap,
      bumpScale: 0.0025,
      roughness: 0.55,
      side: THREE.DoubleSide
    }));
    this.injectTranslucency(this.leafMat, this.leafSssUniforms, false);

    // Woody stem & thorn materials
    this.barkMat = this.assets.trackMaterial(new THREE.MeshStandardMaterial({
      color: new THREE.Color("#c2ba86"),
      map: barkTex.map,
      bumpMap: barkTex.bumpMap,
      bumpScale: 0.006,
      roughness: 0.78,
      metalness: 0.0
    }));

    this.darkBarkMat = this.assets.trackMaterial(new THREE.MeshStandardMaterial({
      color: new THREE.Color("#a28b65"),
      map: barkTex.map,
      bumpMap: barkTex.bumpMap,
      bumpScale: 0.009,
      roughness: 0.85,
      metalness: 0.0
    }));

    this.greenShootMat = this.assets.trackMaterial(new THREE.MeshStandardMaterial({
      color: new THREE.Color("#76873e"),
      roughness: 0.62,
      metalness: 0.0
    }));

    // Architectural background materials
    this.wallMat = this.assets.trackMaterial(new THREE.MeshStandardMaterial({
      color: new THREE.Color("#c2b5a1"),
      map: this.texGen.createWallTexture(),
      roughness: 0.94,
      metalness: 0.0
    }));

    this.terracottaMat = this.assets.trackMaterial(new THREE.MeshStandardMaterial({
      color: new THREE.Color("#e6ae8d"),
      map: this.texGen.createTerracottaTexture(),
      roughness: 0.76,
      metalness: 0.02
    }));

    this.buildingMat = this.assets.trackMaterial(new THREE.MeshStandardMaterial({
      color: new THREE.Color("#c6c8c1"),
      roughness: 0.88,
      metalness: 0.02
    }));

    this.wireMat = this.assets.trackMaterial(new THREE.MeshStandardMaterial({
      color: new THREE.Color("#9aa0a6"),
      roughness: 0.42,
      metalness: 0.78
    }));

    this.soilMat = this.assets.trackMaterial(new THREE.MeshStandardMaterial({
      color: new THREE.Color("#c1aa8c"),
      map: this.texGen.createSoilTexture(),
      roughness: 0.96,
      metalness: 0.0
    }));

    this.eaveMat = this.assets.trackMaterial(new THREE.MeshStandardMaterial({
      color: new THREE.Color("#2a2c2b"),
      roughness: 0.82,
      metalness: 0.05
    }));
  }
}

// =========================================================================
// 4. GEOMETRY FACTORY (Parametric Botanical Bracts, Flowers, Stems, Leaves)
// =========================================================================
class GeometryFactory {
  constructor(assets, matFactory) {
    this.assets = assets;
    this.mats = matFactory;
    this.shared = {};
    this.buildSharedGeometries();
  }

  // Parametric ovate-acuminate cupped Bougainvillea bract with ruffled edges
  createBractGeometry(seedOffset = 0) {
    const segU = 14, segV = 18;
    const geo = new THREE.PlaneGeometry(1, 1, segU, segV);
    const pos = geo.attributes.position;
    const colors = new Float32Array(pos.count * 3);
    const col = new THREE.Color();

    for (let i = 0; i < pos.count; i++) {
      // u in [-0.5, 0.5], v in [0, 1] from base to pointed tip
      const u = pos.getX(i);
      const v = pos.getY(i) + 0.5;

      // Classic Bougainvillea ovate-acuminate heart/teardrop silhouette
      const side = Math.sign(u);
      const margin = Math.pow(Math.abs(u) * 2, 2);
      const widthProfile = Math.sin(Math.pow(v, 0.71) * Math.PI);
      const irregularity = 1 + margin * (
        0.07 * Math.sin(v * 20 + seedOffset + side) +
        0.045 * Math.sin(v * 39 - seedOffset * side)
      );
      const x = u * 1.04 * widthProfile * irregularity
        + Math.sin(seedOffset + 0.8) * v * v * 0.15;
      const y = v * 1.17 - 0.08 * margin * Math.sin(v * Math.PI) * (1 - v);

      // Organic central crease + longitudinal cupping + subtle ruffled margin
      const absU = Math.abs(u) * 2.0; // 0 at midrib, 1 at edge
      const crease = Math.pow(absU, 1.35) * 0.14 * Math.sin(v * Math.PI);
      const arch = -Math.pow(v, 1.7) * 0.16 + Math.sin(v * Math.PI) * 0.05;
      const ruffle = Math.sin(v * 11.0 + seedOffset + u * 6.0) * 0.022 * absU * Math.sin(v * Math.PI);
      const pleat = 0.031 * Math.sin(v * 23 + Math.abs(u) * 13 + seedOffset)
        * Math.sin(v * Math.PI) * absU;
      const twist = u * v * Math.sin(seedOffset + 0.6) * 0.30;
      const z = crease + arch + ruffle + pleat + twist;

      pos.setXYZ(i, x, y, z);

      // Vertex color gradient: slightly deeper near base/midrib, luminous at upper edges
      const shade = 0.70 + 0.24 * v + 0.06 * absU + 0.055 * Math.sin(v * 19 + u * 15 + seedOffset);
      col.setRGB(Math.min(1, shade), Math.min(1, shade * 0.94), Math.min(1, shade * 0.98));
      colors[i * 3] = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;
    }

    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    geo.computeVertexNormals();
    return this.assets.trackGeometry(geo);
  }

  // Parametric ovate leaf geometry
  createLeafGeometry() {
    const geo = new THREE.PlaneGeometry(1, 1, 8, 10);
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const u = pos.getX(i);
      const v = pos.getY(i) + 0.5;
      const w = Math.sin(Math.pow(v, 0.72) * Math.PI);
      const x = u * 0.62 * w;
      const y = v * 1.0;
      const z = Math.abs(u) * 0.12 * Math.sin(v * Math.PI) - Math.pow(v, 1.8) * 0.16;
      pos.setXYZ(i, x, y, z);
    }
    geo.computeVertexNormals();
    return this.assets.trackGeometry(geo);
  }

  // 5-lobed creamy-white star corolla at the tip of each true flower tube
  createTrueFlowerCorollaGeometry() {
    const shape = new THREE.Shape();
    const lobes = 5;
    const outerR = 0.043, innerR = 0.024;
    for (let i = 0; i <= lobes * 2; i++) {
      const ang = (i / (lobes * 2)) * Math.PI * 2;
      const r = i % 2 === 0 ? outerR : innerR;
      const px = Math.cos(ang) * r;
      const py = Math.sin(ang) * r;
      if (i === 0) shape.moveTo(px, py);
      else {
        const midAngle = ang - Math.PI / (lobes * 2);
        const midRadius = (outerR + innerR) * 0.56;
        shape.quadraticCurveTo(Math.cos(midAngle) * midRadius, Math.sin(midAngle) * midRadius, px, py);
      }
    }
    const geo = new THREE.ShapeGeometry(shape, 4);
    // Slightly cup the tiny corolla
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const d = Math.hypot(pos.getX(i), pos.getY(i));
      pos.setZ(i, d * 0.35);
    }
    geo.computeVertexNormals();
    return this.assets.trackGeometry(geo);
  }

  buildSharedGeometries() {
    this.shared.bracts = [
      this.createBractGeometry(0.0),
      this.createBractGeometry(2.1),
      this.createBractGeometry(4.3)
    ];
    this.shared.leaf = this.createLeafGeometry();
    this.shared.corolla = this.createTrueFlowerCorollaGeometry();
    this.shared.thorn = this.assets.trackGeometry(new THREE.ConeGeometry(0.011, 0.065, 7));
    this.shared.thorn.translate(0, 0.032, 0);
  }

  // Build a tapered organic branch along CatmullRomCurve3
  createTaperedBranch(points, rStart, rEnd, tubularSegs = 22, radialSegs = 8, material = null) {
    const curve = new THREE.CatmullRomCurve3(points);
    const geo = new THREE.TubeGeometry(curve, tubularSegs, 1, radialSegs, false);
    const pos = geo.attributes.position;
    const p = new THREE.Vector3();
    const n = new THREE.Vector3();

    for (let i = 0; i <= tubularSegs; i++) {
      const t = i / tubularSegs;
      curve.getPointAt(t, p);
      const radius = THREE.MathUtils.lerp(rEnd, rStart, (1 - t) ** 1.3);
      for (let j = 0; j <= radialSegs; j++) {
        const idx = i * (radialSegs + 1) + j;
        n.fromBufferAttribute(pos, idx).sub(p).normalize();
        const ridge = 1 + 0.055 * Math.sin(j / radialSegs * Math.PI * 6 + t * 4)
          + 0.071 * Math.sin(t * 19.0);
        const r = radius * ridge;
        pos.setXYZ(idx, p.x + n.x * r, p.y + n.y * r, p.z + n.z * r);
      }
    }
    geo.computeVertexNormals();
    this.assets.trackGeometry(geo);
    const mesh = new THREE.Mesh(geo, material || this.mats.barkMat);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    return { mesh, curve };
  }

  // Build a complete 3-bract Bougainvillea flower cluster with tubular true flowers
  createBougainvilleaCluster(options = {}) {
    const {
      scale = 0.24,
      bractCount = 3,
      spread = 0.72,
      showTrueFlowers = true,
      tubeLength = 0.65,
      inspectInfo = null
    } = options;

    const group = new THREE.Group();

    // Pedicel stem at base
    const pedCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, -0.18, 0),
      new THREE.Vector3(0.02, -0.08, 0.01),
      new THREE.Vector3(0, 0.02, 0)
    ]);
    const pedGeo = this.assets.trackGeometry(new THREE.TubeGeometry(pedCurve, 6, 0.016, 5, false));
    const pedMesh = new THREE.Mesh(pedGeo, this.mats.greenShootMat);
    group.add(pedMesh);

    // 3 papery bracts arranged in a natural 120-degree whorl
    for (let i = 0; i < bractCount; i++) {
      const ang = (i / bractCount) * Math.PI * 2 + rand(-0.22, 0.22);
      const bractHolder = new THREE.Group();
      bractHolder.rotation.y = ang;

      const bGeo = this.shared.bracts[(i + Math.floor(rand(0, 3))) % 3];
      const bMat = this.mats.bractMaterials[Math.floor(rand(0, this.mats.bractMaterials.length))];
      const bract = new THREE.Mesh(bGeo, bMat);

      // Tilt outward naturally
      bract.rotation.x = spread + rand(-0.27, 0.23);
      bract.rotation.z = rand(-0.14, 0.14);
      const s = rand(0.88, 1.14);
      bract.scale.set(s * rand(0.82, 1.16), s * rand(0.84, 1.07), s);
      bract.castShadow = true;
      bract.receiveShadow = true;
      if (inspectInfo) bract.userData.inspect = inspectInfo;

      bractHolder.add(bract);
      group.add(bractHolder);

      // Each bract subtends a slender tubular true flower emerging from its midrib
      if (showTrueFlowers) {
        const tLen = tubeLength * rand(0.85, 1.18);
        const tubeCurve = new THREE.CatmullRomCurve3([
          new THREE.Vector3(0, 0.04, 0.02),
          new THREE.Vector3(rand(-0.04, 0.04), tLen * 0.5, 0.12),
          new THREE.Vector3(rand(-0.06, 0.06), tLen, 0.22 + rand(-0.04, 0.05))
        ]);
        const tubeGeo = this.assets.trackGeometry(new THREE.TubeGeometry(tubeCurve, 8, 0.022, 6, false));
        const tubeMesh = new THREE.Mesh(tubeGeo, this.mats.flowerTubeMat);
        tubeMesh.castShadow = true;
        if (inspectInfo) tubeMesh.userData.inspect = inspectInfo;
        bractHolder.add(tubeMesh);

        // Creamy-white 5-lobed star corolla at the tip
        const endPt = tubeCurve.getPoint(1);
        const endTan = tubeCurve.getTangent(1);
        const corolla = new THREE.Mesh(this.shared.corolla, this.mats.flowerTipMat);
        corolla.position.copy(endPt);
        corolla.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), endTan);
        corolla.scale.setScalar(rand(0.9, 1.35));
        bractHolder.add(corolla);
      }
    }

    group.scale.setScalar(scale);
    return group;
  }
}

// =========================================================================
// 5. ENVIRONMENT SYSTEM (Sky Dome, Clouds, Wall, Terracotta Roof, Context)
// =========================================================================
class EnvironmentSystem {
  constructor(scene, assets, mats) {
    this.scene = scene;
    this.fog = scene.fog;
    this.assets = assets;
    this.mats = mats;
    this.skyUniforms = {
      uTopColor: { value: new THREE.Color("#9db7cf") },
      uHorizonColor: { value: new THREE.Color("#dce3e8") },
      uCloudColor: { value: new THREE.Color("#eef1f4") },
      uTime: { value: 0 }
    };
    this.buildSkyDome();
    this.buildArchitecturalContext();
  }

  buildSkyDome() {
    const skyGeo = this.assets.trackGeometry(new THREE.SphereGeometry(42, 32, 20));
    const skyMat = this.assets.trackMaterial(new THREE.ShaderMaterial({
      side: THREE.BackSide,
      depthWrite: false,
      uniforms: this.skyUniforms,
      vertexShader: `
        varying vec3 vWorldPos;
        void main() {
          vec4 wp = modelMatrix * vec4(position, 1.0);
          vWorldPos = wp.xyz;
          gl_Position = projectionMatrix * viewMatrix * wp;
        }
      `,
      fragmentShader: `
        uniform vec3 uTopColor;
        uniform vec3 uHorizonColor;
        uniform vec3 uCloudColor;
        uniform float uTime;
        varying vec3 vWorldPos;

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
        float fbm(vec2 p) {
          float v = 0.0, a = 0.5;
          for (int i = 0; i < 4; i++) {
            v += a * noise(p);
            p *= 2.04;
            a *= 0.5;
          }
          return v;
        }

        void main() {
          vec3 dir = normalize(vWorldPos - cameraPosition);
          float h = clamp(dir.y * 1.45, 0.0, 1.0);
          vec3 sky = mix(uHorizonColor, uTopColor, pow(h, 0.72));

          // Soft tropical overcast cloud layer matching 24673.jpg
          vec2 uv = dir.xz / (max(dir.y, 0.12) + 0.35) * 1.6 + vec2(uTime * 0.008, uTime * 0.004);
          float c = fbm(uv + vec2(fbm(uv * 0.8), fbm(uv * 0.7 + 9.1)) * 0.54);
          float cloudMask = smoothstep(0.30, 0.68, c) * smoothstep(-0.03, 0.23, dir.y);
          sky = mix(sky, uCloudColor * mix(0.72, 1.0, c), cloudMask * 0.90);

          // Lower hemisphere garden bounce
          if (dir.y < 0.0) {
            sky = mix(uHorizonColor * 0.85, vec3(0.14, 0.18, 0.10), clamp(-dir.y * 3.0, 0.0, 1.0));
          }
          gl_FragColor = vec4(sky, 1.0);
          #include <tonemapping_fragment>
          #include <colorspace_fragment>
        }
      `
    }));
    this.skyMesh = new THREE.Mesh(skyGeo, skyMat);
    this.skyMesh.frustumCulled = false;
    this.scene.add(this.skyMesh);
  }

  buildArchitecturalContext() {
    const envGroup = new THREE.Group();
    envGroup.name = "NeighborhoodContext";

    // 1. Inferred garden soil & lawn plane below the Bougainvillea bush
    const groundGeo = this.assets.trackGeometry(new THREE.CircleGeometry(18, 32));
    groundGeo.rotateX(-Math.PI / 2);
    const ground = new THREE.Mesh(groundGeo, this.mats.soilMat);
    ground.position.set(0, -1.65, -2.5);
    ground.receiveShadow = true;
    envGroup.add(ground);
    this.buildGroundDetails(envGroup);

    // 2. Weathered Concrete Boundary Wall (visible horizontal band in midground/background)
    const wallGeo = this.assets.trackGeometry(new THREE.BoxGeometry(22, 2.5, 0.32));
    const wall = new THREE.Mesh(wallGeo, this.mats.wallMat);
    wall.position.set(0, -0.45, -5.8);
    wall.receiveShadow = true;
    wall.castShadow = true;
    envGroup.add(wall);

    // Side return walls (inferred 3D continuity when orbiting)
    const sideWallL = new THREE.Mesh(this.assets.trackGeometry(new THREE.BoxGeometry(0.32, 2.5, 16)), this.mats.wallMat);
    sideWallL.position.set(-10.8, -0.45, 2.0);
    envGroup.add(sideWallL);

    const sideWallR = new THREE.Mesh(this.assets.trackGeometry(new THREE.BoxGeometry(0.32, 2.5, 16)), this.mats.wallMat);
    sideWallR.position.set(10.8, -0.45, 2.0);
    sideWallL.receiveShadow = sideWallR.receiveShadow = true;
    envGroup.add(sideWallR);

    const coping = new THREE.Mesh(
      this.assets.trackGeometry(new THREE.BoxGeometry(21.8, 0.08, 0.44)),
      this.mats.wallMat
    );
    coping.position.set(0, 0.81, -5.8);
    coping.receiveShadow = true;
    envGroup.add(coping);

    // 3. Terracotta Brazilian Roof Tiles (Telha Colonial) along top of wall (orange horizontal band)
    const tileGeo = this.assets.trackGeometry(new THREE.CylinderGeometry(0.11, 0.13, 0.58, 15, 1, true, 0, Math.PI));
    tileGeo.rotateX(Math.PI / 2);
    const tileCount = 96;
    const tileInst = new THREE.InstancedMesh(tileGeo, this.mats.terracottaMat, tileCount);
    const dummy = new THREE.Object3D();
    for (let i = 0; i < tileCount; i++) {
      const x = -10.65 + i * 0.224;
      const weathering = hash2(i, 11);
      dummy.position.set(x, 0.88 + weathering * 0.018, -5.78);
      dummy.rotation.set(0.17, (weathering - 0.5) * 0.07, 0);
      dummy.scale.set(1.05, 0.98 + weathering * 0.13, 1);
      tileInst.setColorAt(i, new THREE.Color().setRGB(
        0.67 + weathering * 0.33, 0.59 + weathering * 0.38, 0.49 + weathering * 0.39
      ));
      dummy.updateMatrix();
      tileInst.setMatrixAt(i, dummy.matrix);
    }
    tileInst.instanceMatrix.needsUpdate = true;
    envGroup.add(tileInst);

    // 4. Neighboring Light-Gray Stucco Building (visible on right background behind wall)
    const bldgGeo = this.assets.trackGeometry(new THREE.BoxGeometry(5.5, 3.6, 4.2));
    const bldg = new THREE.Mesh(bldgGeo, this.mats.buildingMat);
    bldg.position.set(3.8, 1.35, -8.8);
    bldg.receiveShadow = true;
    envGroup.add(bldg);
    const lintel = new THREE.Mesh(
      this.assets.trackGeometry(new THREE.BoxGeometry(5.7, 0.12, 4.35)), this.mats.wallMat
    );
    lintel.position.set(3.8, 3.08, -8.8);
    envGroup.add(lintel);

    // Coiled concertina wire loops along right wall top
    const coilGeo = this.assets.trackGeometry(new THREE.TorusGeometry(0.24, 0.006, 6, 32));
    const coilCount = 14;
    const coilInst = new THREE.InstancedMesh(coilGeo, this.mats.wireMat, coilCount);
    for (let i = 0; i < coilCount; i++) {
      dummy.position.set(1.2 + i * 0.32, 1.15, -5.85);
      dummy.rotation.set(0.15, 0.45, 0);
      dummy.scale.setScalar(1);
      dummy.updateMatrix();
      coilInst.setMatrixAt(i, dummy.matrix);
    }
    coilInst.instanceMatrix.needsUpdate = true;
    envGroup.add(coilInst);

    // 5. Distant Utility Pole on far-left background (visible in 24673.jpg)
    const poleGeo = this.assets.trackGeometry(new THREE.CylinderGeometry(0.07, 0.11, 8.5, 8));
    const pole = new THREE.Mesh(poleGeo, this.mats.buildingMat);
    pole.position.set(-5.6, 2.2, -10.5);
    envGroup.add(pole);

    const crossArm = new THREE.Mesh(this.assets.trackGeometry(new THREE.BoxGeometry(1.1, 0.09, 0.09)), this.mats.buildingMat);
    crossArm.position.set(-5.6, 5.2, -10.5);
    envGroup.add(crossArm);

    // 6. Subtle Dark Roof Eave Corner at top-right (visible in 24673.jpg)
    const eaveGeo = this.assets.trackGeometry(new THREE.BoxGeometry(1.5, 0.11, 1.4));
    const eave = new THREE.Mesh(eaveGeo, this.mats.eaveMat);
    eave.position.set(2.10, 2.90, -2.15);
    eave.rotation.set(0.08, -0.35, 0.18);
    envGroup.add(eave);

    this.scene.add(envGroup);
  }

  buildGroundDetails(group) {
    const scatter = mulberry32(745);
    const dummy = new THREE.Object3D();
    const shade = new THREE.Color();
    const stoneMaterial = this.assets.trackMaterial(new THREE.MeshStandardMaterial({
      color: 0x9b8b73, roughness: 0.97
    }));
    const stoneShape = this.assets.trackGeometry(new THREE.IcosahedronGeometry(1, 0));
    const gravel = new THREE.InstancedMesh(stoneShape, stoneMaterial, 165);
    for (let i = 0; i < gravel.count; i++) {
      const angle = scatter() * Math.PI * 2;
      const radius = 0.45 + Math.sqrt(scatter()) * 4.1;
      const size = 0.012 + scatter() * 0.048;
      dummy.position.set(Math.cos(angle) * radius, -1.642, Math.sin(angle) * radius - 0.5);
      dummy.rotation.set(scatter(), scatter() * 6.28, scatter());
      dummy.scale.set(size, size * 0.45, size * 0.65);
      dummy.updateMatrix();
      gravel.setMatrixAt(i, dummy.matrix);
      gravel.setColorAt(i, shade.setScalar(0.36 + scatter() * 0.59));
    }
    gravel.receiveShadow = true;
    group.add(gravel);

    const trailShape = this.assets.trackGeometry(new THREE.CylinderGeometry(0.46, 0.48, 0.087, 7));
    const trail = new THREE.InstancedMesh(trailShape, stoneMaterial, 9);
    for (let i = 0; i < trail.count; i++) {
      dummy.position.set(3.06 + Math.sin(i * 0.6) * 0.36, -1.62, 3.9 - i * 1.01);
      dummy.rotation.set(0, scatter() * Math.PI, 0);
      dummy.scale.set(0.9 + scatter() * 0.3, 1, 0.8 + scatter() * 0.27);
      dummy.updateMatrix();
      trail.setMatrixAt(i, dummy.matrix);
      trail.setColorAt(i, shade.setScalar(0.57 + scatter() * 0.32));
    }
    trail.receiveShadow = true;
    group.add(trail);
  }

  update(dt) {
    this.skyUniforms.uTime.value += dt;
  }
}

// =========================================================================
// 6. LIGHTING SYSTEM (Overcast Natural Daylight + Sunlit + Golden Hour)
// =========================================================================
class LightingSystem {
  constructor(scene, mats, envSys) {
    this.scene = scene;
    this.mats = mats;
    this.envSys = envSys;

    // Soft sky-ground hemisphere illumination
    this.hemi = new THREE.HemisphereLight(0xdbe7f2, 0x2c4218, 1.15);
    this.scene.add(this.hemi);

    // Primary key directional light (high behind-left for realistic bract backlighting)
    this.keyLight = new THREE.DirectionalLight(0xfffaf0, 1.55);
    this.keyLight.position.set(-2.4, 5.6, -2.8);
    this.keyLight.castShadow = true;
    this.keyLight.shadow.mapSize.set(1024, 1024);
    this.keyLight.shadow.camera.near = 0.5;
    this.keyLight.shadow.camera.far = 14;
    this.keyLight.shadow.camera.left = -2.8;
    this.keyLight.shadow.camera.right = 2.8;
    this.keyLight.shadow.camera.top = 2.8;
    this.keyLight.shadow.camera.bottom = -2.8;
    this.keyLight.shadow.bias = -0.0002;
    this.keyLight.shadow.normalBias = 0.009;
    this.scene.add(this.keyLight);

    // Gentle front-sky bounce fill so foreground woody stems & petals have natural detail
    this.fillLight = new THREE.DirectionalLight(0xdce8f8, 0.72);
    this.fillLight.position.set(1.8, 2.4, 3.6);
    this.scene.add(this.fillLight);

    this.setPreset("overcast");
  }

  setPreset(mode) {
    if (mode === "overcast") {
      this.hemi.color.set("#dbe7f2");
      this.hemi.groundColor.set("#968778");
      this.hemi.intensity = 1.85;
      this.keyLight.color.set("#fffaf2");
      this.keyLight.intensity = 1.65;
      this.keyLight.shadow.radius = 4;
      this.keyLight.position.set(-2.2, 5.8, -2.6);
      this.fillLight.color.set("#d8e6f6");
      this.fillLight.intensity = 1.02;
      this.mats.sssUniforms.uSssIntensity.value = 0.76;
      this.envSys.skyUniforms.uTopColor.value.set("#9db7cf");
      this.envSys.skyUniforms.uHorizonColor.value.set("#dce3e8");
      this.envSys.skyUniforms.uCloudColor.value.set("#eef1f4");
      this.envSys.fog.color.set("#cfd9e2");
    } else if (mode === "sunlit") {
      this.hemi.color.set("#b9dcff");
      this.hemi.groundColor.set("#364f18");
      this.hemi.intensity = 0.95;
      this.keyLight.color.set("#fff4d8");
      this.keyLight.intensity = 3.0;
      this.keyLight.shadow.radius = 2.1;
      this.keyLight.position.set(-3.2, 6.2, -1.8);
      this.fillLight.color.set("#b8d6f8");
      this.fillLight.intensity = 0.85;
      this.mats.sssUniforms.uSssIntensity.value = 0.96;
      this.envSys.skyUniforms.uTopColor.value.set("#5c98d8");
      this.envSys.skyUniforms.uHorizonColor.value.set("#cde2f4");
      this.envSys.skyUniforms.uCloudColor.value.set("#ffffff");
      this.envSys.fog.color.set("#c8ddf0");
    } else if (mode === "golden") {
      this.hemi.color.set("#ffd9b8");
      this.hemi.groundColor.set("#2e2912");
      this.hemi.intensity = 0.9;
      this.keyLight.color.set("#ffb86c");
      this.keyLight.intensity = 2.6;
      this.keyLight.shadow.radius = 2.9;
      this.keyLight.position.set(-4.5, 2.6, -2.5);
      this.fillLight.color.set("#b8b2d8");
      this.fillLight.intensity = 0.73;
      this.mats.sssUniforms.uSssIntensity.value = 1.05;
      this.envSys.skyUniforms.uTopColor.value.set("#6a7ca8");
      this.envSys.skyUniforms.uHorizonColor.value.set("#f2be94");
      this.envSys.skyUniforms.uCloudColor.value.set("#ffe0c2");
      this.envSys.fog.color.set("#dfbea6");
    }
    this.mats.sssUniforms.uLightDir.value.copy(this.keyLight.position).normalize();
  }
}

// =========================================================================
// 7. SCENE MANAGER (Full Botanical Reconstruction of 24673.jpg)
// =========================================================================
class SceneManager {
  constructor(scene, assets, geoFactory, mats) {
    this.scene = scene;
    this.assets = assets;
    this.geo = geoFactory;
    this.mats = mats;
    this.springNodes = []; // Dynamic spring-damper branches & hero clusters
    this.interactiveMeshes = [];
    this.buildBougainvilleaWorld();
  }

  registerSpringNode(object, stiffness = 24, damping = 4.2, windFactor = 1.0, phase = 0) {
    this.springNodes.push({
      obj: object,
      baseRot: object.rotation.clone(),
      angleX: 0,
      angleZ: 0,
      velX: 0,
      velZ: 0,
      stiffness,
      damping,
      windFactor,
      phase
    });
  }

  buildBougainvilleaWorld() {
    const bushRoot = new THREE.Group();
    const foliageCurves = [];
    bushRoot.name = "BougainvilleaBush";
    this.scene.add(bushRoot);

    // ---------------------------------------------------------------------
    // A. FOREGROUND HERO WOODY STEMS (Exact structural match to 24673.jpg)
    // ---------------------------------------------------------------------
    // 1. Thick olive-green diagonal branch entering from right edge with thorns
    const diagBranchGroup = new THREE.Group();
    const diagPts = [
      new THREE.Vector3(1.15, 0.16, 0.28),
      new THREE.Vector3(0.74, -0.02, 0.42),
      new THREE.Vector3(0.46, -0.22, 0.54),
      new THREE.Vector3(0.26, -0.34, 0.62)
    ];
    const diagRes = this.geo.createTaperedBranch(diagPts, 0.026, 0.015, 22, 8, this.mats.barkMat);
    diagRes.mesh.userData.inspect = {
      title: "Ramo Lenhoso com Espinhos",
      body: "Caule semilenhoso verde-oliva típico da Bougainvillea, equipado com espinhos axilares cônicos que auxiliam a planta a se apoiar como trepadeira."
    };
    this.interactiveMeshes.push(diagRes.mesh);
    diagBranchGroup.add(diagRes.mesh);

    // Characteristic sharp conical thorns along the diagonal stem
    const thornT = [0.22, 0.52, 0.78];
    thornT.forEach((t, idx) => {
      const pt = diagRes.curve.getPoint(t);
      const thorn = new THREE.Mesh(this.geo.shared.thorn, this.mats.barkMat);
      thorn.position.copy(pt);
      thorn.rotation.set(0.3, idx * 1.6, -0.95);
      diagBranchGroup.add(thorn);
    });

    // Side offshoot going up-right to Hero Cluster #1
    const subDiagPts = [
      new THREE.Vector3(0.76, -0.01, 0.42),
      new THREE.Vector3(0.68, 0.16, 0.50),
      new THREE.Vector3(0.48, 0.34, 0.62)
    ];
    const subDiag = this.geo.createTaperedBranch(subDiagPts, 0.013, 0.007, 14, 6, this.mats.greenShootMat);
    diagBranchGroup.add(subDiag.mesh);
    bushRoot.add(diagBranchGroup);
    const diagonalRoot = this.geo.createTaperedBranch([
      new THREE.Vector3(-0.1, -1.63, 0.30), new THREE.Vector3(0.2, -1.06, 0.15),
      new THREE.Vector3(0.84, -0.36, 0.18), diagPts[0]
    ], 0.034, 0.025, 18, 8, this.mats.barkMat);
    bushRoot.add(diagonalRoot.mesh);
    foliageCurves.push(diagonalRoot.curve);
    diagRes.mesh.userData.springIndex = this.springNodes.length;
    this.registerSpringNode(diagBranchGroup, 26, 4.4, 0.65, 0.4);

    // 2. Central vertical gnarled woody stem with pruned tip (left-center foreground)
    const mainStemPts = [
      new THREE.Vector3(-0.08, -1.65, 0.30),
      new THREE.Vector3(-0.14, -1.05, 0.36),
      new THREE.Vector3(-0.18, -0.58, 0.42),
      new THREE.Vector3(-0.17, -0.22, 0.46),
      new THREE.Vector3(-0.20, -0.07, 0.44)
    ];
    const mainStem = this.geo.createTaperedBranch(mainStemPts, 0.036, 0.017, 24, 8, this.mats.darkBarkMat);
    bushRoot.add(mainStem.mesh);
    foliageCurves.push(mainStem.curve);
    const cutFace = new THREE.Mesh(
      this.assets.trackGeometry(new THREE.CircleGeometry(0.018, 11)),
      this.assets.trackMaterial(new THREE.MeshStandardMaterial({
        color: 0xb8a176, roughness: 0.87, side: THREE.DoubleSide
      }))
    );
    cutFace.position.copy(mainStemPts.at(-1));
    cutFace.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), mainStem.curve.getTangent(1));
    cutFace.receiveShadow = true;
    bushRoot.add(cutFace);

    // Lateral shoots off the central stem
    const shootConfigs = [
      [[-0.17, -0.45, 0.43], [-0.42, -0.35, 0.52], [-0.62, -0.42, 0.62]],
      [[-0.17, -0.64, 0.41], [-0.45, -0.70, 0.55], [-0.65, -0.78, 0.64]],
      [[-0.18, -0.28, 0.45], [-0.36, -0.02, 0.32], [-0.48, 0.48, 0.14], [-0.56, 1.05, -0.05]],
      [[-0.15, -0.82, 0.38], [0.16, -0.66, 0.48], [0.34, -0.52, 0.56]]
    ];
    shootConfigs.forEach((pts) => {
      const vecs = pts.map(p => new THREE.Vector3(p[0], p[1], p[2]));
      const b = this.geo.createTaperedBranch(vecs, 0.014, 0.005, 16, 6, this.mats.greenShootMat);
      bushRoot.add(b.mesh);
      foliageCurves.push(b.curve);
    });

    // 3. Tall slender skyward leafy stems (upper-left & upper-center silhouette against sky)
    const tallStems = [
      [[-0.36, -0.4, -0.35], [-0.42, 0.35, -0.42], [-0.52, 1.15, -0.55], [-0.66, 1.75, -0.68]],
      [[-0.08, -0.5, -0.65], [-0.04, 0.42, -0.72], [0.06, 1.25, -0.82], [0.16, 1.95, -0.92]],
      [[0.48, -0.6, -0.95], [0.62, 0.25, -1.05], [0.76, 1.05, -1.18]],
      [[-0.85, -0.7, -0.55], [-1.05, 0.15, -0.65], [-1.18, 0.85, -0.78]]
    ];
    tallStems.forEach((pts) => {
      const vecs = pts.map(p => new THREE.Vector3(p[0], p[1], p[2]));
      const b = this.geo.createTaperedBranch(vecs, 0.015, 0.004, 18, 6, this.mats.greenShootMat);
      bushRoot.add(b.mesh);
      foliageCurves.push(b.curve);
    });

    // ---------------------------------------------------------------------
    // B. HERO FOREGROUND BOUGAINVILLEA CLUSTERS (Exact composition match)
    // ---------------------------------------------------------------------
    const heroConfigs = [
      // Hero #1: Upper-Right large luminous magenta cluster
      {
        pos: [0.46, 0.39, 0.68],
        rot: [0.65, -0.55, 0.42],
        scale: 0.34,
        spread: 0.78,
        tubeLength: 0.58,
        info: {
          title: "Brácteas Translúcidas (Cacho Superior)",
          body: "As estruturas magenta vibrantes não são pétalas, mas folhas modificadas (brácteas) de textura papirácea com nervuras reticuladas que filtram a luz natural."
        }
      },
      // Hero #2: Lower-Center-Right forward-facing cluster with vivid veins & tubes
      {
        pos: [0.22, -0.35, 0.72],
        rot: [1.18, -0.25, 0.32],
        scale: 0.31,
        spread: 0.82,
        tubeLength: 0.66,
        info: {
          title: "Flor Verdadeira Tubular",
          body: "No centro das três brácteas surgem as flores verdadeiras da Bougainvillea: tubos delicados coroados por pequenas estrelas branco-creme de cinco lóbulos."
        }
      },
      // Single upright catching-light bract just above Hero #2
      {
        pos: [0.06, -0.02, 0.52],
        rot: [0.18, 0.35, 0.18],
        scale: 0.24,
        bractCount: 1,
        showTrueFlowers: false,
        spread: 0.35,
        info: {
          title: "Bráctea Jovem em Contraluz",
          body: "Bráctea isolada captando luz difusa do céu nublado, destacando o efeito de espalhamento subsuperficial (SSS) nas bordas finas."
        }
      },
      // Hero #3: Lower-Left cluster with long protruding cream-tipped flower tubes
      {
        pos: [-0.46, -0.68, 0.66],
        rot: [0.95, 0.62, 0.88],
        scale: 0.29,
        spread: 0.75,
        tubeLength: 0.78,
        info: {
          title: "Inflorescência em Abertura (Inferior Esquerda)",
          body: "Cacho em ângulo lateral revelando os longos tubos florais projetados para fora, prontos para polinizadores como beija-flores e borboletas."
        }
      },
      // Far Bottom-Left companion cluster
      {
        pos: [-0.72, -0.78, 0.42],
        rot: [0.85, 0.75, 0.4],
        scale: 0.23,
        spread: 0.76,
        tubeLength: 0.55
      },
      // Far Upper-Right partial edge bract
      {
        pos: [0.98, 0.68, 0.56],
        rot: [0.6, -0.9, 0.35],
        scale: 0.32,
        bractCount: 2,
        showTrueFlowers: false,
        spread: 0.65
      },
      // Lower-Right nestled cluster
      {
        pos: [0.74, -0.44, 0.46],
        rot: [0.95, -0.65, -0.3],
        scale: 0.25,
        spread: 0.78,
        tubeLength: 0.52
      }
    ];

    heroConfigs.forEach((cfg, idx) => {
      const cluster = this.geo.createBougainvilleaCluster({
        scale: cfg.scale,
        bractCount: cfg.bractCount || 3,
        spread: cfg.spread,
        showTrueFlowers: cfg.showTrueFlowers !== false,
        tubeLength: cfg.tubeLength || 0.62,
        inspectInfo: cfg.info || null
      });
      cluster.position.set(cfg.pos[0], cfg.pos[1], cfg.pos[2]);
      cluster.rotation.set(cfg.rot[0], cfg.rot[1], cfg.rot[2]);
      const anchor = idx === 0 ? subDiagPts.at(-1) : idx === 1 ? diagPts.at(-1)
        : new THREE.Vector3(cfg.pos[0] * 0.62 - 0.08, cfg.pos[1] - 0.25, cfg.pos[2] - 0.29);
      const length = anchor.distanceTo(cluster.position);
      const mid = anchor.clone().lerp(cluster.position, 0.53);
      mid.y -= length * 0.12;
      const spur = this.geo.createTaperedBranch(
        [anchor, mid, cluster.position.clone()], 0.008, 0.004, 8, 5, this.mats.greenShootMat
      );
      bushRoot.add(spur.mesh, cluster);

      cluster.traverse(child => {
        if (child.isMesh && child.userData.inspect) {
          child.userData.springIndex = this.springNodes.length;
          this.interactiveMeshes.push(child);
        }
      });
      this.registerSpringNode(cluster, 22, 3.6, 0.95, idx * 0.9);
    });

    // ---------------------------------------------------------------------
    // C. MIDGROUND & FULL 3D BUSH CLUSTERS (Depth + 360° inferred continuity)
    // ---------------------------------------------------------------------
    const midClusters = [
      // Left-mid cascade (matches left side of 24673.jpg)
      [-0.78, 0.24, -0.18, 0.24],
      [-0.62, -0.05, -0.08, 0.27],
      [-0.68, -0.26, -0.12, 0.28],
      [-0.74, -0.44, -0.22, 0.26],
      // Upper-left-center bloom
      [-0.42, 0.62, -0.28, 0.28],
      [-0.22, 0.72, -0.58, 0.22],
      // Central vertical column of magenta blooms (rich midground core)
      [-0.12, 0.45, -0.48, 0.28],
      [-0.08, 0.26, -0.42, 0.30],
      [-0.18, 0.14, -0.52, 0.27],
      [0.02, 0.08, -0.38, 0.29],
      [-0.15, -0.12, -0.46, 0.28],
      [0.14, 0.22, -0.62, 0.26],
      // High skyward buds
      [0.12, 1.18, -0.82, 0.17],
      [0.08, 1.48, -0.92, 0.14],
      [-0.36, 1.12, -0.65, 0.15],
      // Right & rear 3D bush continuity (inferred for orbit exploration)
      [0.65, -0.18, -0.45, 0.26],
      [0.95, -0.32, -0.65, 0.27],
      [1.25, -0.10, -0.85, 0.26],
      [-1.15, -0.22, -0.75, 0.27],
      [-0.95, 0.12, -1.15, 0.26],
      [0.25, -0.25, -1.25, 0.28],
      [-0.35, -0.15, -1.35, 0.28],
      [0.75, 0.15, -1.35, 0.26],
      [0.05, 0.45, -1.45, 0.25]
    ];

    midClusters.forEach((c, idx) => {
      const cl = this.geo.createBougainvilleaCluster({
        scale: c[3],
        bractCount: 3,
        spread: rand(0.65, 0.88),
        showTrueFlowers: idx < 12,
        tubeLength: 0.48
      });
      cl.position.set(c[0], c[1], c[2]);
      cl.rotation.set(rand(0.2, 1.3), rand(-Math.PI, Math.PI), rand(-0.5, 0.5));
      const tip = cl.position.clone();
      const base = new THREE.Vector3(tip.x * 0.38 - 0.11, Math.max(-1.57, tip.y - 0.94), tip.z * 0.48 - 0.08);
      const bend = base.clone().lerp(tip, 0.58);
      bend.x += rand(-0.19, 0.19);
      bend.z -= 0.12;
      const stem = this.geo.createTaperedBranch(
        [base, bend, tip], 0.012, 0.003, 11, 5, this.mats.greenShootMat
      );
      bushRoot.add(stem.mesh, cl);
      foliageCurves.push(stem.curve);
      this.registerSpringNode(cl, 16, 3.4, 1.1, idx * 0.7);
    });

    // ---------------------------------------------------------------------
    // D. Attach alternating foliage to stems throughout the canopy.
    const canopyRng = mulberry32(22673);
    for (let i = 0; i < 31; i++) {
      const a = i * 2.39996;
      const r = 0.62 + canopyRng() * 1.24;
      const height = -1.1 + canopyRng() * 1.38;
      const tip = new THREE.Vector3(Math.cos(a) * r, height, Math.sin(a) * r * 0.80 - 0.5);
      const base = new THREE.Vector3(tip.x * 0.26 - 0.10, -1.62, tip.z * 0.27);
      const mid = base.clone().lerp(tip, 0.62);
      mid.y += 0.22;
      const branch = this.geo.createTaperedBranch(
        [base, mid, tip], 0.015 + canopyRng() * 0.013, 0.0025, 13, 6, this.mats.barkMat
      );
      bushRoot.add(branch.mesh);
      foliageCurves.push(branch.curve);
    }

    const leavesPerStem = 9;
    const leafCount = foliageCurves.length * leavesPerStem;
    const leafInst = new THREE.InstancedMesh(this.geo.shared.leaf, this.mats.leafMat, leafCount);
    const petioleShape = this.assets.trackGeometry(new THREE.CylinderGeometry(0.002, 0.0036, 1, 5));
    petioleShape.translate(0, 0.5, 0);
    const petioles = new THREE.InstancedMesh(petioleShape, this.mats.greenShootMat, leafCount);
    const dummy = new THREE.Object3D();
    const point = new THREE.Vector3();
    const tangent = new THREE.Vector3();
    const lateral = new THREE.Vector3();
    const heading = new THREE.Vector3();
    const up = new THREE.Vector3(0, 1, 0);
    const palette = ["#bbbc87", "#cee39c", "#e1d997", "#a7b877", "#8ca769"].map(hex => new THREE.Color(hex));
    leafInst.castShadow = leafInst.receiveShadow = true;

    foliageCurves.forEach((curve, branchIndex) => {
      for (let i = 0; i < leavesPerStem; i++) {
        const index = branchIndex * leavesPerStem + i;
        const t = (i + 1 + canopyRng() * 0.7) / (leavesPerStem + 1);
        curve.getPointAt(t, point);
        curve.getTangentAt(t, tangent);
        lateral.crossVectors(tangent, up).normalize().applyAxisAngle(tangent, i * 2.39996);
        heading.copy(lateral).multiplyScalar(0.95).addScaledVector(tangent, 0.38);
        heading.y -= 0.17;
        heading.normalize();
        const size = (0.13 + canopyRng() * 0.17) * (1.10 - t * 0.36);
        const stalkLength = size * (0.12 + canopyRng() * 0.13);
        dummy.position.copy(point);
        dummy.quaternion.setFromUnitVectors(up, heading);
        dummy.scale.set(1, stalkLength, 1);
        dummy.updateMatrix();
        petioles.setMatrixAt(index, dummy.matrix);

        dummy.position.addScaledVector(heading, stalkLength);
        dummy.rotateY((canopyRng() - 0.5) * 1.8);
        dummy.scale.set(size * (0.76 + canopyRng() * 0.45), size, size);
        dummy.updateMatrix();
        leafInst.setMatrixAt(index, dummy.matrix);
        leafInst.setColorAt(index, palette[Math.floor(canopyRng() * palette.length)]);
      }
    });
    bushRoot.add(petioles, leafInst);
  }
}

// =========================================================================
// 8. PARTICLE SYSTEM (Floating Pollen & Drifting Micro-Petals)
// =========================================================================
class ParticleSystem {
  constructor(scene, assets, texGen) {
    this.scene = scene;
    this.enabled = true;
    this.maxCount = 90;
    this.activeCount = 65;

    const geo = assets.trackGeometry(new THREE.BufferGeometry());
    this.positions = new Float32Array(this.maxCount * 3);
    this.velocities = new Float32Array(this.maxCount * 3);
    this.phases = new Float32Array(this.maxCount);

    for (let i = 0; i < this.maxCount; i++) {
      this.positions[i * 3] = rand(-2.2, 2.2);
      this.positions[i * 3 + 1] = rand(-1.1, 1.8);
      this.positions[i * 3 + 2] = rand(-1.8, 1.5);
      this.velocities[i * 3] = rand(0.03, 0.09);
      this.velocities[i * 3 + 1] = rand(-0.02, 0.025);
      this.velocities[i * 3 + 2] = rand(-0.02, 0.02);
      this.phases[i] = rand(0, Math.PI * 2);
    }

    geo.setAttribute("position", new THREE.BufferAttribute(this.positions, 3));
    geo.setDrawRange(0, this.activeCount);

    const mat = assets.trackMaterial(new THREE.PointsMaterial({
      size: 0.032,
      map: texGen.createSoftParticleTexture(),
      transparent: true,
      opacity: 0.62,
      depthWrite: false,
      blending: THREE.NormalBlending,
      color: new THREE.Color("#fff4f8")
    }));

    this.points = new THREE.Points(geo, mat);
    this.scene.add(this.points);
  }

  setDensity(count) {
    this.activeCount = Math.min(this.maxCount, count);
    this.points.geometry.setDrawRange(0, this.activeCount);
  }

  burstAt(worldPos) {
    if (!this.enabled) return;
    for (let i = 0; i < 8; i++) {
      const idx = Math.floor(rand(0, this.activeCount));
      this.positions[idx * 3] = worldPos.x + rand(-0.12, 0.12);
      this.positions[idx * 3 + 1] = worldPos.y + rand(-0.12, 0.12);
      this.positions[idx * 3 + 2] = worldPos.z + rand(-0.12, 0.12);
    }
    this.points.geometry.attributes.position.needsUpdate = true;
  }

  update(dt, time, windStrength) {
    this.points.visible = this.enabled;
    if (!this.enabled) return;
    const pos = this.positions;
    for (let i = 0; i < this.activeCount; i++) {
      const ix = i * 3;
      const ph = this.phases[i];
      pos[ix] += (this.velocities[ix] * (0.4 + windStrength * 2.2)) * dt;
      pos[ix + 1] += (Math.sin(time * 1.1 + ph) * 0.035 + this.velocities[ix + 1]) * dt;
      pos[ix + 2] += (Math.cos(time * 0.9 + ph) * 0.025 + this.velocities[ix + 2]) * dt;

      if (pos[ix] > 2.4) pos[ix] = -2.4;
      if (pos[ix + 1] > 2.0) pos[ix + 1] = -1.1;
      if (pos[ix + 1] < -1.2) pos[ix + 1] = 1.9;
    }
    this.points.geometry.attributes.position.needsUpdate = true;
  }
}

// =========================================================================
// 9. PHYSICS & ANIMATION SYSTEM (Spring-Damper Branches + Organic Wind)
// =========================================================================
class PhysicsSystem {
  constructor(sceneMgr, mats) {
    this.sceneMgr = sceneMgr;
    this.mats = mats;
    this.windStrength = 0.35;
    this.reducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  impulse(springIndex, forceX, forceZ) {
    const node = this.sceneMgr.springNodes[springIndex];
    if (!node) return;
    node.velX += forceX;
    node.velZ += forceZ;
  }

  update(dt, time) {
    const w = this.reducedMotion ? 0.05 : this.windStrength;
    this.mats.sssUniforms.uTime.value = time;
    this.mats.sssUniforms.uWindStrength.value = w;

    const clampedDt = Math.min(dt, 0.04);
    const gust = Math.sin(time * 0.72) * 0.5 + Math.sin(time * 1.85) * 0.25 + 0.35;

    for (let i = 0; i < this.sceneMgr.springNodes.length; i++) {
      const n = this.sceneMgr.springNodes[i];
      const targetX = Math.sin(time * 1.35 + n.phase) * 0.038 * w * n.windFactor * gust;
      const targetZ = Math.cos(time * 1.12 + n.phase * 1.3) * 0.045 * w * n.windFactor * gust;

      const accX = (targetX - n.angleX) * n.stiffness - n.velX * n.damping;
      const accZ = (targetZ - n.angleZ) * n.stiffness - n.velZ * n.damping;

      n.velX += accX * clampedDt;
      n.velZ += accZ * clampedDt;
      n.angleX += n.velX * clampedDt;
      n.angleZ += n.velZ * clampedDt;

      n.obj.rotation.x = n.baseRot.x + n.angleX;
      n.obj.rotation.z = n.baseRot.z + n.angleZ;
    }
  }
}

// =========================================================================
// 10. CAMERA MANAGER & MOBILE CONTROLS (Orbit, Pan, Pinch, Presets, WASD)
// =========================================================================
class CameraManager {
  constructor(camera, domElement) {
    this.camera = camera;
    this.dom = domElement;

    // Reference-inspired view and separate macro viewpoints.
    this.presets = {
      reference: { pos: new THREE.Vector3(0.13, 0.06, 2.67), target: new THREE.Vector3(0.08, 0.22, 0.15) },
      macroTop: { pos: new THREE.Vector3(0.52, 0.48, 1.61), target: new THREE.Vector3(0.45, 0.49, 0.70) },
      macroCenter: { pos: new THREE.Vector3(0.18, -0.28, 1.55), target: new THREE.Vector3(0.20, -0.27, 0.77) },
      side: { pos: new THREE.Vector3(-2.15, 0.18, 1.25), target: new THREE.Vector3(0.05, -0.10, 0.12) },
      garden: { pos: new THREE.Vector3(2.32, 1.02, 4.36), target: new THREE.Vector3(-0.05, -0.06, -0.40) }
    };

    this.preset = "reference";
    this.target = this.presets.reference.target.clone();
    this.desiredTarget = this.target.clone();

    this.spherical = new THREE.Spherical();
    this.desiredSpherical = new THREE.Spherical();
    this.syncSphericalFromPos(this.presets.reference.pos, this.presets.reference.target);

    this.cinematic = false;
    this.isDragging = false;
    this.dragMode = "orbit";
    this.pointerDownPos = { x: 0, y: 0 };
    this.lastPointer = { x: 0, y: 0 };
    this.touches = new Map();
    this.prevPinchDist = 0;
    this.keys = new Set();

    this.bindEvents();
    this.applyToCamera();
  }

  syncSphericalFromPos(pos, target) {
    const offset = pos.clone().sub(target);
    this.spherical.setFromVector3(offset);
    this.desiredSpherical.copy(this.spherical);
  }

  goToPreset(name) {
    const p = this.presets[name];
    if (!p) return;
    this.preset = name;
    this.desiredTarget.copy(p.target);
    const offset = p.pos.clone().sub(p.target);
    this.desiredSpherical.setFromVector3(offset);
  }

  bindEvents() {
    this.dom.addEventListener("pointerdown", (e) => {
      this.dom.setPointerCapture(e.pointerId);
      this.touches.set(e.pointerId, { x: e.clientX, y: e.clientY });
      this.pointerDownPos = { x: e.clientX, y: e.clientY };
      this.lastPointer = { x: e.clientX, y: e.clientY };

      if (this.touches.size === 1) {
        this.isDragging = true;
        this.dragMode = (e.button === 2 || e.shiftKey) ? "pan" : "orbit";
      } else if (this.touches.size === 2) {
        const pts = Array.from(this.touches.values());
        this.prevPinchDist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
      }
    });

    this.dom.addEventListener("pointermove", (e) => {
      if (!this.touches.has(e.pointerId)) return;
      this.touches.set(e.pointerId, { x: e.clientX, y: e.clientY });

      if (this.touches.size === 2) {
        const pts = Array.from(this.touches.values());
        const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
        if (this.prevPinchDist > 0) {
          const delta = (this.prevPinchDist - dist) * 0.008;
          this.desiredSpherical.radius = THREE.MathUtils.clamp(this.desiredSpherical.radius + delta, 0.55, 6.2);
        }
        this.prevPinchDist = dist;
        return;
      }

      if (!this.isDragging) return;
      const dx = e.clientX - this.lastPointer.x;
      const dy = e.clientY - this.lastPointer.y;
      this.lastPointer = { x: e.clientX, y: e.clientY };

      if (this.dragMode === "orbit") {
        this.desiredSpherical.theta -= dx * 0.0055;
        this.desiredSpherical.phi = THREE.MathUtils.clamp(
          this.desiredSpherical.phi - dy * 0.0055,
          0.38,
          Math.PI * 0.62
        );
      } else {
        const panScale = this.desiredSpherical.radius * 0.0014;
        const right = new THREE.Vector3().setFromMatrixColumn(this.camera.matrix, 0);
        const up = new THREE.Vector3().setFromMatrixColumn(this.camera.matrix, 1);
        this.desiredTarget.addScaledVector(right, -dx * panScale);
        this.desiredTarget.addScaledVector(up, dy * panScale);
        this.desiredTarget.clamp(new THREE.Vector3(-2.0, -1.1, -2.0), new THREE.Vector3(2.0, 1.5, 1.5));
      }
    });

    const endPointer = (e) => {
      this.touches.delete(e.pointerId);
      if (this.touches.size < 2) this.prevPinchDist = 0;
      if (this.touches.size === 0) this.isDragging = false;
    };
    this.dom.addEventListener("pointerup", endPointer);
    this.dom.addEventListener("pointercancel", endPointer);
    this.dom.addEventListener("contextmenu", (e) => e.preventDefault());

    this.dom.addEventListener("wheel", (e) => {
      e.preventDefault();
      const zoomDelta = e.deltaY * 0.0018;
      this.desiredSpherical.radius = THREE.MathUtils.clamp(this.desiredSpherical.radius + zoomDelta, 0.55, 6.2);
    }, { passive: false });

    window.addEventListener("keydown", (e) => this.keys.add(e.code));
    window.addEventListener("keyup", (e) => this.keys.delete(e.code));
  }

  applyToCamera() {
    const offset = new THREE.Vector3().setFromSpherical(this.spherical);
    this.camera.position.copy(this.target).add(offset);
    this.camera.lookAt(this.target);
  }

  update(dt) {
    if (this.cinematic && !this.isDragging) {
      this.desiredSpherical.theta += dt * 0.16;
    }

    // Smooth keyboard WASD / Arrow movement
    const moveSpeed = dt * 1.15;
    if (this.keys.has("KeyW") || this.keys.has("ArrowUp")) {
      this.desiredSpherical.radius = Math.max(0.55, this.desiredSpherical.radius - moveSpeed);
    }
    if (this.keys.has("KeyS") || this.keys.has("ArrowDown")) {
      this.desiredSpherical.radius = Math.min(6.2, this.desiredSpherical.radius + moveSpeed);
    }
    if (this.keys.has("KeyA") || this.keys.has("ArrowLeft")) {
      this.desiredSpherical.theta -= moveSpeed * 0.7;
    }
    if (this.keys.has("KeyD") || this.keys.has("ArrowRight")) {
      this.desiredSpherical.theta += moveSpeed * 0.7;
    }

    const damp = 1 - Math.exp(-7.5 * Math.min(dt, 0.05));
    this.spherical.radius += (this.desiredSpherical.radius - this.spherical.radius) * damp;
    this.spherical.phi += (this.desiredSpherical.phi - this.spherical.phi) * damp;
    this.spherical.theta += (this.desiredSpherical.theta - this.spherical.theta) * damp;
    this.target.lerp(this.desiredTarget, damp);

    this.applyToCamera();
  }
}

// =========================================================================
// 11. SPATIAL PROCEDURAL AUDIO SYSTEM (Web Audio API — Breeze & Birds)
// =========================================================================
class AudioSystem {
  constructor() {
    this.ctx = null;
    this.enabled = false;
    this.volume = 0.55;
    this.masterGain = null;
    this.windFilter = null;
    this.birdTimer = null;
  }

  init() {
    if (this.ctx) return;
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    this.ctx = new AudioCtx();
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.value = 0.0001;
    this.masterGain.connect(this.ctx.destination);

    // Filtered pink/brown noise for gentle foliage breeze
    const bufSize = this.ctx.sampleRate * 3;
    const buf = this.ctx.createBuffer(1, bufSize, this.ctx.sampleRate);
    const data = buf.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0;
    for (let i = 0; i < bufSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.997 * b0 + white * 0.029;
      b1 = 0.985 * b1 + white * 0.032;
      b2 = 0.950 * b2 + white * 0.048;
      data[i] = (b0 + b1 + b2) * 0.45;
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buf;
    noise.loop = true;

    this.windFilter = this.ctx.createBiquadFilter();
    this.windFilter.type = "bandpass";
    this.windFilter.frequency.value = 420;
    this.windFilter.Q.value = 0.9;

    const windGain = this.ctx.createGain();
    windGain.gain.value = 0.32;

    noise.connect(this.windFilter);
    this.windFilter.connect(windGain);
    windGain.connect(this.masterGain);
    noise.start();
  }

  toggle() {
    this.init();
    if (!this.ctx) return false;
    if (this.ctx.state === "suspended") this.ctx.resume();
    this.enabled = !this.enabled;
    const now = this.ctx.currentTime;
    this.masterGain.gain.cancelScheduledValues(now);
    this.updateGain();

    if (this.enabled) {
      this.scheduleBird();
    } else if (this.birdTimer) {
      clearTimeout(this.birdTimer);
      this.birdTimer = null;
    }
    return this.enabled;
  }

  setVolume(value) {
    this.volume = value;
    this.updateGain();
  }

  updateGain() {
    if (!this.ctx || !this.masterGain) return;
    const audible = this.enabled && !window.__SANGI_MUTED__ && !window.__SANGI_PAUSED__ && !this.userPaused;
    this.masterGain.gain.setTargetAtTime(audible ? this.volume : 0.0001, this.ctx.currentTime, 0.17);
  }

  dispose() {
    this.enabled = false;
    clearTimeout(this.birdTimer);
    this.ctx?.close().catch(() => {});
  }

  updateWind(windStrength, time) {
    if (!this.ctx || !this.enabled || !this.windFilter) return;
    const targetFreq = 260 + windStrength * 520 + Math.sin(time * 0.7) * 90;
    this.windFilter.frequency.setTargetAtTime(targetFreq, this.ctx.currentTime, 0.2);
  }

  playRustle() {
    if (!this.ctx || !this.enabled) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(680 + Math.random() * 240, now);
    osc.frequency.exponentialRampToValueAtTime(220, now + 0.12);
    g.gain.setValueAtTime(0.06, now);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 0.14);
    osc.connect(g);
    g.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.15);
  }

  scheduleBird() {
    if (!this.enabled || !this.ctx) return;
    this.birdTimer = setTimeout(() => {
      if (!this.enabled || !this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      const base = 2400 + Math.random() * 1100;
      osc.type = "sine";
      osc.frequency.setValueAtTime(base, now);
      osc.frequency.exponentialRampToValueAtTime(base * 1.32, now + 0.07);
      osc.frequency.exponentialRampToValueAtTime(base * 0.92, now + 0.16);
      g.gain.setValueAtTime(0.0001, now);
      g.gain.linearRampToValueAtTime(0.045, now + 0.03);
      g.gain.exponentialRampToValueAtTime(0.0001, now + 0.19);
      osc.connect(g);
      g.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.21);
      this.scheduleBird();
    }, 3800 + Math.random() * 6500);
  }
}

// =========================================================================
// 12. QUALITY MANAGER & PERFORMANCE MONITOR (Auto + Low/Med/High/Ultra)
// =========================================================================
class QualityManager {
  constructor(renderer, lighting, particles) {
    this.renderer = renderer;
    this.lighting = lighting;
    this.particles = particles;
    this.mode = "auto";
    this.currentTier = "high";
    this.fpsSamples = [];
    this.lastAutoCheck = 0;

    this.profiles = {
      low:    { dpr: 1.0,  shadows: false, shadowSize: 512,  particles: 20, label: "Baixo" },
      medium: { dpr: 1.35, shadows: true,  shadowSize: 1024, particles: 45, label: "Médio" },
      high:   { dpr: 1.75, shadows: true,  shadowSize: 1024, particles: 65, label: "Alto" },
      ultra:  { dpr: 2.0,  shadows: true,  shadowSize: 2048, particles: 90, label: "Ultra" }
    };

    const isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);
    this.applyTier(isMobile ? "medium" : "high");
  }

  setMode(mode) {
    this.mode = mode;
    if (mode !== "auto") {
      this.applyTier(mode);
    }
  }

  applyTier(tier) {
    const p = this.profiles[tier];
    if (!p) return;
    this.currentTier = tier;
    this.fpsSamples.length = 0;
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, p.dpr));
    this.renderer.shadowMap.enabled = p.shadows;
    if (this.lighting.keyLight.shadow.mapSize.x !== p.shadowSize) {
      this.lighting.keyLight.shadow.mapSize.set(p.shadowSize, p.shadowSize);
      if (this.lighting.keyLight.shadow.map) {
        this.lighting.keyLight.shadow.map.dispose();
        this.lighting.keyLight.shadow.map = null;
      }
    }
    this.particles.setDensity(p.particles);
  }

  recordFrame(fps, nowMs) {
    this.fpsSamples.push(fps);
    if (this.fpsSamples.length > 12) this.fpsSamples.shift();

    if (this.mode === "auto" && nowMs - this.lastAutoCheck > 3200 && this.fpsSamples.length >= 8) {
      this.lastAutoCheck = nowMs;
      const avg = this.fpsSamples.reduce((a, b) => a + b, 0) / this.fpsSamples.length;
      if (avg < 26 && this.currentTier !== "low") {
        this.applyTier(this.currentTier === "ultra" ? "high" : this.currentTier === "high" ? "medium" : "low");
      } else if (avg > 54 && this.currentTier === "medium") {
        this.applyTier("high");
      }
    }
  }

  getDisplayLabel() {
    const name = this.profiles[this.currentTier].label;
    return this.mode === "auto" ? `Auto (${name})` : name;
  }
}

// =========================================================================
// 13. INTERACTION SYSTEM (Raycasting, Touch/Click Impulse & Inspection)
// =========================================================================
class InteractionSystem {
  constructor(camera, dom, sceneMgr, physics, particles, audio, ui) {
    this.camera = camera;
    this.dom = dom;
    this.sceneMgr = sceneMgr;
    this.physics = physics;
    this.particles = particles;
    this.audio = audio;
    this.ui = ui;
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.downPos = { x: 0, y: 0 };

    this.dom.addEventListener("pointerdown", (e) => {
      this.downPos = { x: e.clientX, y: e.clientY };
    });

    this.dom.addEventListener("pointerup", (e) => {
      const moved = Math.hypot(e.clientX - this.downPos.x, e.clientY - this.downPos.y);
      if (moved > 8) return; // Ignore orbit drags
      const rect = this.dom.getBoundingClientRect();
      this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      this.raycaster.setFromCamera(this.mouse, this.camera);
      const hits = this.raycaster.intersectObjects(this.sceneMgr.interactiveMeshes, false);
      if (hits.length > 0) {
        const hit = hits[0];
        if (typeof hit.object.userData.springIndex === "number") {
          this.physics.impulse(hit.object.userData.springIndex, rand(-2.2, 2.2), rand(-2.2, 2.2));
        }
        this.particles.burstAt(hit.point);
        this.audio.playRustle();
        if (hit.object.userData.inspect) {
          this.ui.showInspectCard(hit.object.userData.inspect);
          const info = hit.object.userData.inspect;
          const key = (info && (info.title || info.name)) || JSON.stringify(info).slice(0, 40);
          this.seenParts = this.seenParts || new Set();
          this.seenParts.add(key);
          if (window.__s3dKit) {
            window.__s3dKit.goal('inspect1');
            if (this.seenParts.size >= 3) window.__s3dKit.goal('inspect3', '<b>Anatomia.</b> Brácteas coloridas envolvem 3 flores tubulares brancas — as flores verdadeiras.');
          }
        }
      }
    });
  }
}

// =========================================================================
// 14. UI MANAGER (HUD, Comparison Slider, Shortcuts, Capture, Toast)
// =========================================================================
class UIManager {
  constructor(app) {
    this.app = app;
    this.compareActive = false;
    this.toastTimer = null;
    this.bindUI();
  }

  toast(msg) {
    const el = document.getElementById("toast");
    el.textContent = msg;
    el.classList.add("show");
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => el.classList.remove("show"), 2200);
  }

  showInspectCard(info) {
    document.getElementById("inspect-title").textContent = info.title;
    document.getElementById("inspect-body").textContent = info.body;
    document.getElementById("inspect-card").classList.add("open");
  }

  setCompareSplit(pct) {
    const wrap = document.getElementById("compare-img-wrap");
    const div = document.getElementById("compare-divider");
    wrap.style.clipPath = `inset(0 0 0 ${100 - pct}%)`;
    div.style.left = `${100 - pct}%`;
  }

  toggleCompare() {
    this.compareActive = !this.compareActive;
    const overlay = document.getElementById("compare-overlay");
    const ctrls = document.getElementById("compare-controls");
    const div = document.getElementById("compare-divider");
    const btn = document.getElementById("btn-compare");

    overlay.classList.toggle("active", this.compareActive);
    ctrls.classList.toggle("open", this.compareActive);
    btn.classList.toggle("active", this.compareActive);
    div.style.display = this.compareActive ? "block" : "none";

    if (this.compareActive) {
      this.app.camMgr.goToPreset("reference");
      this.setCompareSplit(Number(document.getElementById("slider-compare").value));
      this.toast("Compare a cena 3D com a foto de referência");
    }
  }

  bindUI() {
    const $ = (id) => document.getElementById(id);

    // Reset camera
    $("btn-reset-cam").addEventListener("click", () => {
      this.app.camMgr.goToPreset("reference");
      document.querySelectorAll(".dock-btn").forEach(b => b.classList.toggle("active", b.dataset.cam === "reference"));
      this.toast("Enquadramento original restaurado");
    });

    // Compare toggle & slider
    $("btn-compare").addEventListener("click", () => { this.toggleCompare(); if (window.__s3dKit) window.__s3dKit.goal('compare', '<b>Comparação.</b> Arraste a divisória para comparar a cena 3D com a foto de referência.'); });
    $("slider-compare").addEventListener("input", (e) => this.setCompareSplit(Number(e.target.value)));

    // Audio toggle
    const updateAudioIcon = (on) => {
      $("btn-audio").classList.toggle("active", on);
      $("icon-audio-svg").innerHTML = on
        ? '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>'
        : '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/>';
    };
    $("btn-audio").addEventListener("click", () => {
      const on = this.app.audio.toggle();
      updateAudioIcon(on);
      this.toast(on ? "Áudio ambiente ativado" : "Áudio silenciado");
    });

    // Capture screenshot
    $("btn-capture").addEventListener("click", () => {
      if (window.__s3dKit) window.__s3dKit.goal('photo');
      this.app.render(0);
      const url = this.app.renderer.domElement.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = url;
      a.download = "bougainvillea_3d_capture.png";
      a.click();
      this.toast("Captura PNG salva");
    });

    // Contemplation mode
    const toggleContemplation = () => {
      const hud = $("hud");
      hud.classList.toggle("contemplation");
      if (hud.classList.contains("contemplation")) {
        $("settings-panel").classList.remove("open");
        $("btn-settings").classList.remove("active");
      }
    };
    $("btn-contemplation").addEventListener("click", toggleContemplation);
    $("btn-exit-contemplation").addEventListener("click", toggleContemplation);

    // Fullscreen
    $("btn-fullscreen").addEventListener("click", () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen && document.documentElement.requestFullscreen().catch(() => {});
      } else {
        document.exitFullscreen && document.exitFullscreen().catch(() => {});
      }
    });

    // Settings drawer
    $("btn-settings").addEventListener("click", () => {
      const open = $("settings-panel").classList.toggle("open");
      $("btn-settings").classList.toggle("active", open);
    });

    // Quality buttons
    $("quality-group").addEventListener("click", (e) => {
      const btn = e.target.closest("[data-quality]");
      if (!btn) return;
      $("quality-group").querySelectorAll(".seg-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      this.app.qualityMgr.setMode(btn.dataset.quality);
      $("lbl-quality-active").textContent = this.app.qualityMgr.getDisplayLabel();
    });

    // Lighting buttons
    $("lighting-group").addEventListener("click", (e) => {
      const btn = e.target.closest("[data-light]");
      if (!btn) return;
      $("lighting-group").querySelectorAll(".seg-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      this.app.lighting.setPreset(btn.dataset.light);
      this.lightsSeen = this.lightsSeen || new Set(['overcast']);
      this.lightsSeen.add(btn.dataset.light);
      if (this.lightsSeen.size === 3 && window.__s3dKit) window.__s3dKit.goal('lights', '<b>Três luzes.</b> Nublado, sol vivo e fim de tarde: as nervuras da bráctea continuam legíveis em todas.');
    });

    // Sliders
    $("slider-wind").addEventListener("input", (e) => {
      const val = Number(e.target.value);
      $("lbl-wind").textContent = val + "%";
      this.app.physics.windStrength = val / 100;
    });

    $("slider-volume").addEventListener("input", (e) => {
      const val = Number(e.target.value);
      $("lbl-vol").textContent = val + "%";
      this.app.audio.setVolume(val / 100);
    });

    // Toggles
    $("toggle-cinematic").addEventListener("click", (e) => {
      const on = e.currentTarget.classList.toggle("on");
      this.app.camMgr.cinematic = on;
    });

    $("toggle-particles").addEventListener("click", (e) => {
      const on = e.currentTarget.classList.toggle("on");
      this.app.particles.enabled = on;
    });

    $("toggle-fog").addEventListener("click", (e) => {
      const on = e.currentTarget.classList.toggle("on");
      this.app.scene.fog = on ? this.app.atmosphericFog : null;
    });

    $("toggle-lens").addEventListener("click", (e) => {
      const on = e.currentTarget.classList.toggle("on");
      e.currentTarget.setAttribute("aria-pressed", String(on));
      this.app.lensEnabled = on;
    });

    // Bottom camera presets
    document.querySelectorAll(".dock-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".dock-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        this.app.camMgr.goToPreset(btn.dataset.cam);
      });
    });

    // Inspect card close
    $("btn-close-inspect").addEventListener("click", () => $("inspect-card").classList.remove("open"));

    // Help modal
    $("btn-help").addEventListener("click", () => $("help-modal").classList.add("open"));
    $("btn-close-help").addEventListener("click", () => $("help-modal").classList.remove("open"));
    $("help-modal").addEventListener("click", (e) => {
      if (e.target === $("help-modal")) $("help-modal").classList.remove("open");
    });

    // Keyboard shortcuts
    window.addEventListener("keydown", (e) => {
      if (e.target.tagName === "INPUT") return;
      const k = e.key.toLowerCase();
      if (k === "r") $("btn-reset-cam").click();
      else if (k === "c") this.toggleCompare();
      else if (k === "h") toggleContemplation();
      else if (k === "f") $("btn-fullscreen").click();
      else if (k === "m") $("btn-audio").click();
      else if (k === "p") $("btn-capture").click();
    });
  }
}

// =========================================================================
// 15. MAIN APPLICATION BOOTSTRAP & RENDER LOOP
// =========================================================================
class MacroLens {
  constructor(renderer, camera) {
    this.renderer = renderer;
    this.camera = camera;
    this.target = new THREE.WebGLRenderTarget(1, 1, {
      type: renderer.extensions.has("EXT_color_buffer_float") ? THREE.HalfFloatType : THREE.UnsignedByteType,
      generateMipmaps: true,
      minFilter: THREE.LinearMipmapLinearFilter,
      depthTexture: new THREE.DepthTexture(1, 1, THREE.UnsignedIntType)
    });
    this.material = new THREE.ShaderMaterial({
      depthTest: false,
      depthWrite: false,
      uniforms: {
        sceneColor: { value: this.target.texture },
        sceneDepth: { value: this.target.depthTexture },
        resolution: { value: new THREE.Vector2() },
        focus: { value: 1.7 },
        aperture: { value: 0.014 },
        cameraNear: { value: camera.near },
        cameraFar: { value: camera.far }
      },
      vertexShader: `
        varying vec2 coords;
        void main() {
          coords = uv;
          gl_Position = vec4(position.xy, 0.0, 1.0);
        }
      `,
      fragmentShader: `
        #include <packing>
        uniform sampler2D sceneColor;
        uniform sampler2D sceneDepth;
        uniform vec2 resolution;
        uniform float focus;
        uniform float aperture;
        uniform float cameraNear;
        uniform float cameraFar;
        varying vec2 coords;

        float distanceAt(vec2 uv) {
          return -perspectiveDepthToViewZ(texture2D(sceneDepth, uv).r, cameraNear, cameraFar);
        }

        void main() {
          float depth = distanceAt(coords);
          float defocus = abs(1.0 - focus / max(depth, 0.01));
          float radius = min(aperture * max(0.0, defocus - 0.075), 0.025) * resolution.y;
          vec3 sharp = texture2D(sceneColor, coords).rgb;
          float mip = max(0.0, log2(max(1.0, radius * 0.37)));
          vec3 color = textureLod(sceneColor, coords, mip).rgb * 1.8;
          float weight = 1.8;
          for (int i = 0; i < 10; i++) {
            float index = float(i) + 0.5;
            float angle = index * 2.399963;
            vec2 sampleUV = clamp(coords + vec2(cos(angle), sin(angle))
              * sqrt(index / 10.0) * radius / resolution, 0.0, 1.0);
            float sampleDepth = distanceAt(sampleUV);
            float coverage = mix(0.28, 1.0, smoothstep(depth * 0.52, depth * 0.9, sampleDepth));
            color += textureLod(sceneColor, sampleUV, mip).rgb * coverage;
            weight += coverage;
          }
          gl_FragColor = vec4(mix(sharp, color / weight, smoothstep(0.4, 2.6, radius)), 1.0);
          #include <tonemapping_fragment>
          #include <colorspace_fragment>
        }
      `
    });
    this.scene = new THREE.Scene();
    this.screen = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), this.material);
    this.screen.frustumCulled = false;
    this.scene.add(this.screen);
    this.screenCamera = new THREE.Camera();
    this.size = new THREE.Vector2();
  }

  render(scene, focus, aperture) {
    this.renderer.getDrawingBufferSize(this.size);
    if (this.target.width !== this.size.x || this.target.height !== this.size.y) {
      this.target.setSize(this.size.x, this.size.y);
      this.material.uniforms.resolution.value.copy(this.size);
    }
    this.material.uniforms.focus.value = focus;
    this.material.uniforms.aperture.value = aperture;
    this.renderer.setRenderTarget(this.target);
    this.renderer.render(scene, this.camera);
    this.renderer.setRenderTarget(null);
    this.renderer.render(this.scene, this.screenCamera);
  }

  dispose() {
    this.target.dispose();
    this.material.dispose();
    this.screen.geometry.dispose();
  }
}

class BougainvilleaApp {
  constructor() {
    this.container = document.getElementById("canvas-container");
    this.assets = new AssetManager();

    this.scene = new THREE.Scene();
    this.atmosphericFog = new THREE.FogExp2(0xcfd9e2, 0.029);
    this.scene.fog = this.atmosphericFog;

    const w = this.container.clientWidth || window.innerWidth;
    const h = this.container.clientHeight || window.innerHeight;
    this.camera = new THREE.PerspectiveCamera(w / h < 0.8 ? 54 : 46, w / h, 0.05, 90);

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: "high-performance",
      alpha: false
    });
    this.renderer.setSize(w, h);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.NeutralToneMapping;
    this.renderer.toneMappingExposure = 1.0;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowMap;
    this.renderer.info.autoReset = false;
    this.container.appendChild(this.renderer.domElement);
    this.lens = new MacroLens(this.renderer, this.camera);
    this.lensEnabled = true;
    this.focusDistance = 1.73;

    // Systems initialization
    this.texGen = new TextureGenerator(this.assets);
    this.mats = new MaterialFactory(this.assets, this.texGen);
    this.geoFactory = new GeometryFactory(this.assets, this.mats);
    this.envSys = new EnvironmentSystem(this.scene, this.assets, this.mats);
    this.lighting = new LightingSystem(this.scene, this.mats, this.envSys);
    this.sceneMgr = new SceneManager(this.scene, this.assets, this.geoFactory, this.mats);
    this.particles = new ParticleSystem(this.scene, this.assets, this.texGen);
    this.physics = new PhysicsSystem(this.sceneMgr, this.mats);
    this.camMgr = new CameraManager(this.camera, this.renderer.domElement);
    this.audio = new AudioSystem();
    this.qualityMgr = new QualityManager(this.renderer, this.lighting, this.particles);
    this.ui = new UIManager(this);
    this.interaction = new InteractionSystem(
      this.camera, this.renderer.domElement, this.sceneMgr,
      this.physics, this.particles, this.audio, this.ui
    );

    // Perf monitor state
    this.lastFrameTime = performance.now();
    this.elapsed = 0;
    this.frameCount = 0;
    this.lastPerfUpdate = performance.now();
    this.paused = false;
    this.disposed = false;
    this.focusPoint = new THREE.Vector3();

    this.bindLifecycle();

    // Initial render + hide loader
    this.render(0);
    setTimeout(() => {
      document.getElementById("loader").classList.add("hidden");
    }, 280);

    this.animate();
  }

  render(dt) {
    this.renderer.info.reset();
    const { preset, target, spherical } = this.camMgr;
    this.camera.updateMatrixWorld();
    const desiredFocus = preset === "reference" ?
      -this.focusPoint.set(0.24, -0.18, 0.64).applyMatrix4(this.camera.matrixWorldInverse).z :
      this.camera.position.distanceTo(target) - (preset.startsWith("macro") ? 0.045 : 0);
    const focus = desiredFocus > 0.25 ? desiredFocus : spherical.radius;
    this.focusDistance = THREE.MathUtils.lerp(this.focusDistance, focus, dt ? 1 - Math.exp(-8 * dt) : 1);
    if (this.lensEnabled && this.qualityMgr.currentTier !== "low") {
      const aperture = preset === "garden" || spherical.radius > 3.4 ? 0.0055 : 0.023;
      this.lens.render(this.scene, Math.max(0.25, this.focusDistance), aperture);
    } else {
      this.renderer.render(this.scene, this.camera);
    }
  }

  bindLifecycle() {
    window.addEventListener("resize", () => {
      const w = this.container.clientWidth || window.innerWidth;
      const h = this.container.clientHeight || window.innerHeight;
      this.camera.aspect = w / h;
      this.camera.fov = w / h < 0.8 ? 54 : 46;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(w, h);
    });

    document.addEventListener("visibilitychange", () => {
      this.paused = document.hidden || !!this.audio.userPaused; // respeita pausa do usuário (S3DKit)
      if (!this.paused) this.lastFrameTime = performance.now();
    });

    this.renderer.domElement.addEventListener("webglcontextlost", (e) => {
      e.preventDefault();
      this.paused = true;
      this.ui.toast("Contexto WebGL pausado — tentando restaurar...");
    });

    this.renderer.domElement.addEventListener("webglcontextrestored", () => {
      this.paused = false;
      this.ui.toast("Contexto WebGL restaurado");
    });

    window.addEventListener("sangi:reset", () => document.getElementById("btn-reset-cam").click());
    window.addEventListener("sangi:mute", () => this.audio.updateGain());
    window.addEventListener("sangi:pause", () => this.audio.updateGain());
    window.addEventListener("sangi:resume", () => {
      this.frameCount = 0;
      this.lastPerfUpdate = performance.now();
      this.audio.updateGain();
    });
    window.addEventListener("sangi:dispose", () => this.disposeAll(), { once: true });
    this.createKit();
  }

  // Varre a cena e lista recursos que NÃO passaram pelo AssetManager (devem ser 0 para o descarte ser completo).
  untrackedResources() {
    const geos = new Set(), mats = new Set(), texs = new Set();
    this.scene.traverse((o) => {
      if (o.geometry && !this.assets.geometries.has(o.geometry)) geos.add(o.geometry);
      const list = Array.isArray(o.material) ? o.material : (o.material ? [o.material] : []);
      for (const m of list) {
        if (!this.assets.materials.has(m)) mats.add(m);
        for (const v of Object.values(m)) if (v && v.isTexture && !this.assets.textures.has(v)) texs.add(v);
      }
    });
    return { geometries: geos, materials: mats, textures: texs };
  }

  disposeAll() {
    if (this.disposed) return;
    this.disposed = true;
    // Rede de segurança: adota o que ficou fora do AssetManager antes de liberar tudo
    const u = this.untrackedResources();
    u.geometries.forEach(g => this.assets.trackGeometry(g));
    u.materials.forEach(m => this.assets.trackMaterial(m));
    u.textures.forEach(t => this.assets.trackTexture(t));
    if (this.scene.environment) this.assets.trackTexture(this.scene.environment);
    if (this.scene.background && this.scene.background.isTexture) this.assets.trackTexture(this.scene.background);
    this.lens.dispose();
    this.audio.dispose();
    this.assets.disposeAll();
    this.renderer.renderLists.dispose();
    this.renderer.dispose();
    if (window.__s3dKit) window.__s3dKit.dispose();
  }

  createKit() {
    const app = this;
    window.__s3dKit = S3DKit.create({
      id: 's3d127', title: 'Bougainvillea · Quintal em Flor', photoName: 'bougainvillea',
      noQuality: true, noPhoto: true, side: 'left', top: 'calc(max(12px, env(safe-area-inset-top)) + 96px)',
      tutorial: [
        'Uma bougainvillea num quintal. Arraste para girar; pinça ou scroll para aproximar. Toque nas brácteas para inspecionar.',
        'Troque a <b>luz</b> (nublado, sol, fim de tarde) e use <b>Comparar</b> para ver a fotografia de referência.',
        'Complete o <b>Diário de campo</b> e capture composições macro. Sem tempo, sem pontuação.'
      ],
      goals: [
        { id: 'inspect1', label: 'Inspecione uma estrutura' },
        { id: 'inspect3', label: 'Inspecione 3 estruturas diferentes' },
        { id: 'lights', label: 'Compare as 3 luzes' },
        { id: 'compare', label: 'Compare com a foto de referência' },
        { id: 'photo', label: 'Capture uma composição' }
      ],
      canvas: () => app.renderer.domElement,
      render: () => app.render(0),
      rendererInfo: () => app.renderer.info,
      setPaused: (p) => { app.paused = p; app.audio.userPaused = p; app.lastFrameTime = performance.now(); app.audio.updateGain(); },
      applyQuality: (lvl) => { const b = document.querySelector('#quality-group [data-quality="' + (lvl === 'balanced' ? 'medium' : lvl) + '"]') || document.querySelector('#quality-group [data-quality="' + lvl + '"]'); if (b) b.click(); },
      onReset: () => document.getElementById('btn-reset-cam').click(),
      qa: {
        untracked: () => { const u = app.untrackedResources(); return { geometries: u.geometries.size, materials: u.materials.size, textures: u.textures.size, tracked: { g: app.assets.geometries.size, m: app.assets.materials.size, t: app.assets.textures.size } }; },
        memory: () => ({ geometries: app.renderer.info.memory.geometries, textures: app.renderer.info.memory.textures }),
        disposeNow: () => { app.disposeAll(); return { geometries: app.renderer.info.memory.geometries, textures: app.renderer.info.memory.textures, trackedLeft: app.assets.geometries.size + app.assets.materials.size + app.assets.textures.size }; },
        // Para cada preset de luz: % de pixels estourados (>=250) e esmagados (<=5) e contraste (desvio-padrão de luminância)
        lightingDetail: () => {
          const out = {}, presets = ['overcast', 'sunlit', 'golden'];
          for (const p of presets) {
            app.lighting.setPreset(p);
            app.render(0);
            const src = app.renderer.domElement, c = document.createElement('canvas'); c.width = 160; c.height = Math.round(160 * src.height / src.width);
            const x = c.getContext('2d'); x.drawImage(src, 0, 0, c.width, c.height);
            const d = x.getImageData(0, 0, c.width, c.height).data; let hi = 0, lo = 0, sum = 0, sum2 = 0, n = d.length / 4;
            for (let i = 0; i < d.length; i += 4) { const L = 0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2]; if (L >= 250) hi++; if (L <= 5) lo++; sum += L; sum2 += L * L; }
            const mean = sum / n; out[p] = { clippedHighPct: +(100 * hi / n).toFixed(2), crushedLowPct: +(100 * lo / n).toFixed(2), mean: +mean.toFixed(1), stdev: +Math.sqrt(sum2 / n - mean * mean).toFixed(1) };
          }
          app.lighting.setPreset('overcast');
          return out;
        }
      }
    });
  }

  animate() {
    if (this.disposed) return;
    requestAnimationFrame(() => this.animate());
    const frameTime = performance.now();
    const dt = Math.min((frameTime - this.lastFrameTime) / 1000, 0.05);
    this.lastFrameTime = frameTime;
    if (this.paused || window.__SANGI_PAUSED__) return;
    if (window.__s3dKit) window.__s3dKit.frame();
    this.elapsed += dt;

    this.camMgr.update(dt);
    this.physics.update(dt, this.elapsed);
    this.particles.update(dt, this.elapsed, this.physics.windStrength);
    this.envSys.update(dt);
    this.audio.updateWind(this.physics.windStrength, this.elapsed);

    this.render(dt);

    // PerformanceMonitor
    this.frameCount++;
    const now = performance.now();
    if (now - this.lastPerfUpdate >= 650) {
      const fps = Math.round((this.frameCount * 1000) / (now - this.lastPerfUpdate));
      this.frameCount = 0;
      this.lastPerfUpdate = now;
      this.qualityMgr.recordFrame(fps, now);

      const info = this.renderer.info.render;
      document.getElementById("perf-fps").textContent = `${fps} FPS`;
      document.getElementById("perf-draws").textContent = `${info.calls} draws`;
      document.getElementById("perf-tris").textContent = `${(info.triangles / 1000).toFixed(1)}k tris`;
      document.getElementById("lbl-quality-active").textContent = this.qualityMgr.getDisplayLabel();
    }
  }
}

window.addEventListener("DOMContentLoaded", () => {
  try {
    new BougainvilleaApp();
  } catch (error) {
    document.getElementById("loader-status").textContent = "A cena 3D precisa de um navegador com WebGL 2 disponível.";
    console.error(error);
  }
});
