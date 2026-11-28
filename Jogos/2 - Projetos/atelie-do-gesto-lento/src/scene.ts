// Cena do ateliê: sala, bancada, torno, ferramentas, luz e pós-processamento.
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { clayDetail, floorTiles, linen, oakWood, plaster, skyGradient, softDot, sponge } from './textures';
import type { ToolId } from './clay';

export type LightMode = 'tarde' | 'manha' | 'noite';
export const LIGHT_LABEL: Record<LightMode, string> = { tarde: 'Sol da tarde', manha: 'Manhã clara', noite: 'Noite de lâmpada' };

export const BENCH_Y = 0.8;
export const HEAD_Y = BENCH_Y + 0.105;

const VignetteShader = {
  uniforms: { tDiffuse: { value: null }, uTime: { value: 0 }, uStrength: { value: 0.32 } },
  vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
  fragmentShader: `
    uniform sampler2D tDiffuse; uniform float uTime; uniform float uStrength; varying vec2 vUv;
    float hash(vec2 p){ return fract(sin(dot(p, vec2(12.9898,78.233))) * 43758.5453); }
    void main(){
      vec4 c = texture2D(tDiffuse, vUv);
      vec3 col = c.rgb;
      // Guarda contra NaN/Inf vindos de amostras de borda MSAA.
      if (any(isnan(col)) || any(isinf(col))) col = vec3(0.0);
      col = clamp(col, 0.0, 1.0);
      vec2 d = vUv - 0.5;
      float v = clamp(1.0 - dot(d, d) * uStrength * 2.2, 0.0, 1.0);
      col *= mix(0.78, 1.0, v);
      col += (hash(vUv * 900.0 + uTime) - 0.5) * 0.012;
      gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
    }`,
};

export class Atelier {
  renderer: THREE.WebGLRenderer;
  scene = new THREE.Scene();
  camera: THREE.PerspectiveCamera;
  composer: EffectComposer;
  bloom: UnrealBloomPass;
  vignette: ShaderPass;
  sun: THREE.DirectionalLight;
  hemi: THREE.HemisphereLight;
  lamp: THREE.PointLight;
  lampBulb: THREE.Mesh;
  skyMat: THREE.MeshBasicMaterial;
  wheelHead = new THREE.Group();
  clayRoot = new THREE.Group();
  clayMat: THREE.MeshPhysicalMaterial;
  tools: THREE.Object3D[] = [];
  shelfSlots: THREE.Vector3[] = [];
  shelfGroup = new THREE.Group();
  dust: THREE.Points;
  waterSurface: THREE.Mesh;
  hands: THREE.Group;
  private toolBase = new Map<THREE.Object3D, THREE.Vector3>();
  lowPower: boolean;

  constructor(canvas: HTMLCanvasElement) {
    this.lowPower = matchMedia('(pointer: coarse)').matches || Math.min(innerWidth, innerHeight) < 700;
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: 'high-performance', preserveDrawingBuffer: false });
    this.renderer.setPixelRatio(Math.min(devicePixelRatio, this.lowPower ? 1.5 : 2));
    this.renderer.setSize(innerWidth, innerHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.0;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;

    this.camera = new THREE.PerspectiveCamera(38, innerWidth / innerHeight, 0.05, 40);
    this.camera.position.set(0, 1.5, 1.35);

    const pmrem = new THREE.PMREMGenerator(this.renderer);
    this.scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    this.scene.environmentIntensity = 0.32;
    this.scene.background = new THREE.Color('#1b1511');
    this.scene.fog = new THREE.Fog('#2a2019', 5, 12);

    // Luzes
    this.hemi = new THREE.HemisphereLight('#ffe9cf', '#4a3424', 0.45);
    this.scene.add(this.hemi);
    this.sun = new THREE.DirectionalLight('#ffc88f', 3.4);
    this.sun.position.set(-3.2, 2.9, 0.6);
    this.sun.target.position.set(0, BENCH_Y, 0);
    this.sun.castShadow = true;
    const sm = this.lowPower ? 1024 : 2048;
    this.sun.shadow.mapSize.set(sm, sm);
    const sc = this.sun.shadow.camera;
    sc.left = -1.6; sc.right = 1.6; sc.top = 1.6; sc.bottom = -1.2; sc.near = 0.5; sc.far = 9;
    this.sun.shadow.bias = -0.0004;
    this.sun.shadow.normalBias = 0.025;
    this.sun.shadow.radius = 4;
    this.scene.add(this.sun, this.sun.target);
    this.lamp = new THREE.PointLight('#ffb36b', 0, 4.5, 1.6);
    this.lamp.position.set(0.15, 1.95, 0.05);
    this.scene.add(this.lamp);

    this.skyMat = new THREE.MeshBasicMaterial({ map: skyGradient('#9cc1d9', '#ffd2a0'), fog: false });
    this.lampBulb = new THREE.Mesh(new THREE.SphereGeometry(0.04, 20, 14), new THREE.MeshStandardMaterial({ color: '#fff3dd', emissive: '#ffcf91', emissiveIntensity: 0.4 }));

    this.clayMat = this.makeClayMaterial();
    this.buildRoom();
    this.buildBench();
    this.buildWheel();
    this.buildTools();
    this.buildShelf();
    this.waterSurface = this.scene.getObjectByName('agua') as THREE.Mesh;
    this.dust = this.buildDust();
    this.hands = new THREE.Group();

    // Pós-processamento estável: MSAA + bloom suave + vinheta com guarda de NaN.
    const rt = new THREE.WebGLRenderTarget(innerWidth, innerHeight, { type: THREE.HalfFloatType, samples: this.lowPower ? 2 : 4 });
    this.composer = new EffectComposer(this.renderer, rt);
    this.composer.addPass(new RenderPass(this.scene, this.camera));
    this.bloom = new UnrealBloomPass(new THREE.Vector2(innerWidth / 2, innerHeight / 2), 0.28, 0.55, 0.9);
    this.composer.addPass(this.bloom);
    this.composer.addPass(new OutputPass());
    this.vignette = new ShaderPass(VignetteShader);
    this.composer.addPass(this.vignette);
    this.resize();
  }

  private makeClayMaterial() {
    const det = clayDetail();
    const m = new THREE.MeshPhysicalMaterial({
      color: '#b06a48', roughness: 0.82, metalness: 0,
      normalMap: det.normalMap, normalScale: new THREE.Vector2(0.28, 0.28),
      roughnessMap: det.roughnessMap,
      sheen: 0.35, sheenColor: new THREE.Color('#e8b79b'), sheenRoughness: 0.7,
      clearcoat: 0.0, side: THREE.DoubleSide,
    });
    m.onBeforeCompile = (sh) => {
      sh.vertexShader = sh.vertexShader
        .replace('#include <common>', '#include <common>\nattribute float wet;\nvarying float vWet;')
        .replace('#include <begin_vertex>', '#include <begin_vertex>\nvWet = clamp(wet, 0.0, 1.0);');
      sh.fragmentShader = sh.fragmentShader
        .replace('#include <common>', '#include <common>\nvarying float vWet;')
        .replace('#include <roughnessmap_fragment>', '#include <roughnessmap_fragment>\nfloat wk = clamp(vWet, 0.0, 1.0);\nroughnessFactor = clamp(roughnessFactor * mix(1.08, 0.3, wk), 0.12, 1.0);')
        .replace('#include <color_fragment>', '#include <color_fragment>\n{ float wc = clamp(vWet, 0.0, 1.0); diffuseColor.rgb *= mix(1.12, 0.66, wc); diffuseColor.rgb = mix(diffuseColor.rgb, diffuseColor.rgb * vec3(1.05, 0.98, 0.92), 1.0 - wc); }');
    };
    return m;
  }

  private std(set: { map?: THREE.Texture; normalMap: THREE.Texture; roughnessMap?: THREE.Texture }, o: THREE.MeshStandardMaterialParameters = {}) {
    return new THREE.MeshStandardMaterial({ map: set.map, normalMap: set.normalMap, roughnessMap: set.roughnessMap, ...o });
  }

  private buildRoom() {
    const floorSet = floorTiles();
    [floorSet.map, floorSet.normalMap, floorSet.roughnessMap].forEach((t) => t?.repeat.set(3, 3));
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(8, 8), this.std(floorSet, { roughness: 1 }));
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    this.scene.add(floor);

    const wallSet = plaster();
    [wallSet.map, wallSet.normalMap].forEach((t) => t?.repeat.set(2, 1.2));
    const wallMat = this.std(wallSet, { roughness: 0.95, normalScale: new THREE.Vector2(0.6, 0.6) });
    const back = new THREE.Mesh(new THREE.PlaneGeometry(5, 3.2), wallMat);
    back.position.set(0, 1.6, -1.6);
    back.receiveShadow = true;
    this.scene.add(back);

    // Parede esquerda com janela (abertura real para a luz entrar).
    const wx = -1.9, wy0 = 1.0, wy1 = 2.1, wz0 = -0.9, wz1 = 0.5;
    const addWall = (w: number, h: number, y: number, z: number) => {
      const m = new THREE.Mesh(new THREE.BoxGeometry(0.12, h, w), wallMat);
      m.position.set(wx, y, z); m.receiveShadow = true; m.castShadow = true;
      this.scene.add(m);
    };
    addWall(4.2, wy0, wy0 / 2, -0.2);
    addWall(4.2, 3.2 - wy1, (wy1 + 3.2) / 2, -0.2);
    addWall(wz0 + 2.3, wy1 - wy0, (wy0 + wy1) / 2, (-2.3 + wz0) / 2);
    addWall(1.9 - wz1, wy1 - wy0, (wy0 + wy1) / 2, (wz1 + 1.9) / 2);
    const frameMat = this.std(oakWood(), { color: '#d9c3a5', roughness: 0.7 });
    const fw = 0.05;
    const bar = (sx: number, sy: number, sz: number, y: number, z: number) => {
      const m = new THREE.Mesh(new THREE.BoxGeometry(sx, sy, sz), frameMat);
      m.position.set(wx + 0.02, y, z); m.castShadow = true; this.scene.add(m);
    };
    bar(0.16, fw, wz1 - wz0, wy0, (wz0 + wz1) / 2);
    bar(0.16, fw, wz1 - wz0, wy1, (wz0 + wz1) / 2);
    bar(0.16, wy1 - wy0, fw, (wy0 + wy1) / 2, wz0);
    bar(0.16, wy1 - wy0, fw, (wy0 + wy1) / 2, wz1);
    bar(0.08, wy1 - wy0, 0.03, (wy0 + wy1) / 2, (wz0 + wz1) / 2);
    bar(0.08, 0.03, wz1 - wz0, (wy0 + wy1) / 2 + 0.1, (wz0 + wz1) / 2);
    const sill = new THREE.Mesh(new RoundedBoxGeometry(0.34, 0.04, wz1 - wz0 + 0.2, 2, 0.01), frameMat);
    sill.position.set(wx + 0.1, wy0 - 0.02, (wz0 + wz1) / 2); sill.castShadow = sill.receiveShadow = true;
    this.scene.add(sill);
    const sky = new THREE.Mesh(new THREE.PlaneGeometry(6, 4), this.skyMat);
    sky.position.set(wx - 2.2, 1.6, -0.2); sky.rotation.y = Math.PI / 2;
    this.scene.add(sky);
    // Folhagem distante recortada na janela.
    const leafMat = new THREE.MeshBasicMaterial({ color: '#4f6340', fog: false });
    for (let i = 0; i < 26; i++) {
      const l = new THREE.Mesh(new THREE.CircleGeometry(0.12 + Math.random() * 0.2, 7), leafMat);
      l.position.set(wx - 2.0, 1.0 + Math.random() * 0.5, -1.2 + Math.random() * 2.2);
      l.rotation.y = Math.PI / 2; l.scale.y = 0.7;
      this.scene.add(l);
    }
    // Vaso com planta no parapeito.
    const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.055, 0.12, 24), new THREE.MeshStandardMaterial({ color: '#a4583a', roughness: 0.85 }));
    pot.position.set(wx + 0.12, wy0 + 0.06, 0.2); pot.castShadow = true;
    this.scene.add(pot);
    const leaf = new THREE.MeshStandardMaterial({ color: '#5c7a45', roughness: 0.6, side: THREE.DoubleSide });
    for (let i = 0; i < 9; i++) {
      const g = new THREE.Mesh(new THREE.SphereGeometry(0.06, 10, 6), leaf);
      g.scale.set(0.35, 1, 0.12);
      const a = i / 9 * Math.PI * 2;
      g.position.set(wx + 0.12 + Math.cos(a) * 0.04, wy0 + 0.18, 0.2 + Math.sin(a) * 0.04);
      g.rotation.set(Math.sin(a) * 0.6, a, Math.cos(a) * 0.6);
      g.castShadow = true;
      this.scene.add(g);
    }

    // Luminária pendente.
    const cord = new THREE.Mesh(new THREE.CylinderGeometry(0.004, 0.004, 1.1), new THREE.MeshStandardMaterial({ color: '#222' }));
    cord.position.set(0.15, 2.6, 0.05);
    const shade = new THREE.Mesh(new THREE.ConeGeometry(0.16, 0.14, 32, 1, true), new THREE.MeshStandardMaterial({ color: '#5a6a4c', roughness: 0.5, metalness: 0.4, side: THREE.DoubleSide }));
    shade.position.set(0.15, 2.03, 0.05);
    this.lampBulb.position.set(0.15, 1.98, 0.05);
    this.scene.add(cord, shade, this.lampBulb);
  }

  private buildBench() {
    const wood = oakWood();
    const mat = this.std(wood, { roughness: 0.75, normalScale: new THREE.Vector2(0.5, 0.5) });
    const top = new THREE.Mesh(new RoundedBoxGeometry(2.0, 0.07, 0.95, 3, 0.012), mat);
    top.position.set(0, BENCH_Y - 0.035, -0.05);
    top.castShadow = top.receiveShadow = true;
    this.scene.add(top);
    for (const [x, z] of [[-0.92, 0.35], [0.92, 0.35], [-0.92, -0.45], [0.92, -0.45]]) {
      const leg = new THREE.Mesh(new RoundedBoxGeometry(0.07, BENCH_Y - 0.07, 0.07, 2, 0.01), mat);
      leg.position.set(x, (BENCH_Y - 0.07) / 2, z); leg.castShadow = true;
      this.scene.add(leg);
    }
    const stretcher = new THREE.Mesh(new RoundedBoxGeometry(1.84, 0.05, 0.05, 2, 0.01), mat);
    stretcher.position.set(0, 0.18, -0.45); stretcher.castShadow = true;
    this.scene.add(stretcher);
    // Pano de linho sob o torno.
    const ln = linen();
    const cloth = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 0.7, 24, 18), this.std(ln, { roughness: 1, side: THREE.DoubleSide }));
    const p = cloth.geometry.attributes.position;
    for (let i = 0; i < p.count; i++) p.setZ(i, Math.sin(p.getX(i) * 9) * 0.002 + Math.cos(p.getY(i) * 13) * 0.0015);
    cloth.geometry.computeVertexNormals();
    cloth.rotation.x = -Math.PI / 2; cloth.rotation.z = 0.04;
    cloth.position.set(0, BENCH_Y + 0.003, 0.0);
    cloth.receiveShadow = true;
    this.scene.add(cloth);
    // Bloco de barro cru embrulhado ao fundo.
    const lump = new THREE.Mesh(new RoundedBoxGeometry(0.26, 0.16, 0.18, 4, 0.05), this.clayMat.clone());
    (lump.material as THREE.MeshPhysicalMaterial).onBeforeCompile = () => {};
    (lump.material as THREE.MeshPhysicalMaterial).color.set('#8f533b');
    lump.position.set(0.7, BENCH_Y + 0.08, -0.38); lump.rotation.y = 0.4;
    lump.castShadow = lump.receiveShadow = true;
    this.scene.add(lump);
  }

  private buildWheel() {
    const iron = new THREE.MeshStandardMaterial({ color: '#3b463a', metalness: 0.55, roughness: 0.48 });
    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.21, 0.06, 48), iron);
    base.position.set(0, BENCH_Y + 0.03, 0); base.castShadow = base.receiveShadow = true;
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.04, 0.04, 24), iron);
    stem.position.set(0, BENCH_Y + 0.075, 0);
    this.scene.add(base, stem);
    // Cabeça de alumínio com sulcos concêntricos.
    const c = document.createElement('canvas'); c.width = c.height = 256;
    const g = c.getContext('2d')!;
    g.fillStyle = '#9a9a9a'; g.fillRect(0, 0, 256, 256);
    for (let r = 4; r < 128; r += 3.2) { g.strokeStyle = r % 19 < 3 ? '#4a4a4a' : `rgb(${120 + Math.random() * 60},${120 + Math.random() * 60},${120 + Math.random() * 60})`; g.lineWidth = 1.2; g.beginPath(); g.arc(128, 128, r, 0, Math.PI * 2); g.stroke(); }
    const tex = new THREE.CanvasTexture(c);
    const head = new THREE.Mesh(new THREE.CylinderGeometry(0.27, 0.265, 0.03, 72), [
      new THREE.MeshStandardMaterial({ color: '#b9bcbf', metalness: 0.9, roughness: 0.42 }),
      new THREE.MeshStandardMaterial({ color: '#c4c7ca', metalness: 0.9, roughness: 0.35, roughnessMap: tex }),
      new THREE.MeshStandardMaterial({ color: '#8f9296', metalness: 0.9, roughness: 0.5 }),
    ]);
    head.castShadow = head.receiveShadow = true;
    head.position.y = -0.015;
    // Marca de referência para perceber o giro.
    const notch = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.004, 0.01), new THREE.MeshStandardMaterial({ color: '#b85d3b' }));
    notch.position.set(0, 0.001, 0.25);
    this.wheelHead.add(head, notch, this.clayRoot);
    this.wheelHead.position.y = HEAD_Y;
    this.scene.add(this.wheelHead);
    // Respingos de barbotina no linho ao redor.
    const slip = new THREE.MeshStandardMaterial({ color: '#7a4632', roughness: 0.9, transparent: true, opacity: 0.5, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2 });
    for (let i = 0; i < 14; i++) {
      const s = new THREE.Mesh(new THREE.CircleGeometry(0.006 + Math.random() * 0.012, 10), slip);
      const a = Math.random() * Math.PI * 2, r = 0.3 + Math.random() * 0.14;
      s.rotation.x = -Math.PI / 2; s.position.set(Math.cos(a) * r, BENCH_Y + 0.0045, Math.sin(a) * r);
      this.scene.add(s);
    }
  }

  private tagTool(obj: THREE.Object3D, tool: ToolId) {
    obj.userData.tool = tool;
    obj.traverse((o) => { o.userData.tool = tool; if ((o as THREE.Mesh).isMesh) { o.castShadow = true; o.receiveShadow = true; } });
    this.tools.push(obj);
    this.toolBase.set(obj, obj.position.clone());
    this.scene.add(obj);
  }

  private buildTools() {
    // Tigela de água (Alisar).
    const bowlPts: THREE.Vector2[] = [];
    for (let i = 0; i <= 14; i++) { const t = i / 14; bowlPts.push(new THREE.Vector2(0.03 + Math.sin(t * Math.PI * 0.5) * 0.09, t * 0.07)); }
    for (let i = 14; i >= 0; i--) { const t = i / 14; bowlPts.push(new THREE.Vector2(0.024 + Math.sin(t * Math.PI * 0.5) * 0.084, 0.006 + t * 0.064)); }
    const bowl = new THREE.Group();
    const glaze = new THREE.MeshPhysicalMaterial({ color: '#5f8a8b', roughness: 0.18, clearcoat: 1, clearcoatRoughness: 0.1, side: THREE.DoubleSide });
    bowl.add(new THREE.Mesh(new THREE.LatheGeometry(bowlPts, 48), glaze));
    const water = new THREE.Mesh(new THREE.CircleGeometry(0.103, 40), new THREE.MeshPhysicalMaterial({ color: '#7a8f8c', roughness: 0.04, metalness: 0, transmission: 0, transparent: true, opacity: 0.75, clearcoat: 1 }));
    water.name = 'agua'; water.rotation.x = -Math.PI / 2; water.position.y = 0.05;
    bowl.add(water);
    bowl.position.set(0.56, BENCH_Y, 0.16);
    // Esponja.
    const sp = sponge();
    const spongeMesh = new THREE.Mesh(new RoundedBoxGeometry(0.1, 0.035, 0.07, 3, 0.012), this.std(sp, { roughness: 0.95, normalScale: new THREE.Vector2(1.5, 1.5) }));
    spongeMesh.position.set(0.12, 0.018, -0.14); spongeMesh.rotation.y = 0.5;
    bowl.add(spongeMesh);
    this.tagTool(bowl, 'alisar');

    // Esteca de madeira (Marcar).
    const est = new THREE.Group();
    const woodM = this.std(oakWood(256), { color: '#e8cfa8', roughness: 0.55 });
    const shaft = new THREE.Mesh(new THREE.CapsuleGeometry(0.008, 0.2, 6, 12), woodM);
    shaft.rotation.z = Math.PI / 2;
    const tip = new THREE.Mesh(new THREE.SphereGeometry(0.016, 14, 10), woodM);
    tip.scale.set(2.2, 0.35, 1); tip.position.x = 0.12;
    est.add(shaft, tip);
    // Rolo de carimbo.
    const roller = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.07, 24), new THREE.MeshStandardMaterial({ color: '#c79a6a', roughness: 0.6 }));
    roller.rotation.x = Math.PI / 2; roller.position.set(-0.02, 0.014, -0.12);
    est.add(roller);
    est.position.set(-0.56, BENCH_Y + 0.009, 0.16); est.rotation.y = 0.35;
    this.tagTool(est, 'marcar');

    // Mãos de oleiro? Usamos um anel de madeira (costela) para Modelar.
    const rib = new THREE.Mesh(new THREE.TorusGeometry(0.05, 0.008, 10, 36, Math.PI * 1.6), woodM);
    rib.rotation.x = -Math.PI / 2;
    const ribG = new THREE.Group(); ribG.add(rib);
    ribG.position.set(-0.5, BENCH_Y + 0.009, -0.18);
    this.tagTool(ribG, 'modelar');
  }

  private buildShelf() {
    const mat = this.std(oakWood(), { roughness: 0.7 });
    const board = new THREE.Mesh(new RoundedBoxGeometry(2.0, 0.035, 0.24, 2, 0.008), mat);
    board.position.set(0, 1.62, -1.47); board.castShadow = board.receiveShadow = true;
    this.scene.add(board);
    for (const x of [-0.85, 0.85]) {
      const br = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.14, 0.18), new THREE.MeshStandardMaterial({ color: '#3a3430', metalness: 0.6, roughness: 0.5 }));
      br.position.set(x, 1.55, -1.5); this.scene.add(br);
    }
    for (let i = 0; i < 4; i++) this.shelfSlots.push(new THREE.Vector3(-0.66 + i * 0.44, 1.64, -1.45));
    this.scene.add(this.shelfGroup);
  }

  private buildDust() {
    const n = this.lowPower ? 160 : 360;
    const g = new THREE.BufferGeometry();
    const p = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      p[i * 3] = -1.7 + Math.random() * 1.9;
      p[i * 3 + 1] = 0.8 + Math.random() * 1.4;
      p[i * 3 + 2] = -0.9 + Math.random() * 1.4;
    }
    g.setAttribute('position', new THREE.BufferAttribute(p, 3));
    const m = new THREE.PointsMaterial({ size: 0.012, map: softDot(), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0.55, color: '#ffe2bd' });
    const pts = new THREE.Points(g, m);
    this.scene.add(pts);
    return pts;
  }

  setLight(mode: LightMode) {
    const cfg = {
      tarde: { sun: 3.4, sunC: '#ffc88f', pos: [-3.2, 2.9, 0.6], hemi: 0.42, lamp: 0, sky: ['#9cc1d9', '#ffcf9a'], exp: 1.0, env: 0.32, bulb: 0.4, dust: 0.55 },
      manha: { sun: 2.8, sunC: '#fff2df', pos: [-3.0, 4.0, -0.4], hemi: 0.6, lamp: 0, sky: ['#7fb2dc', '#e4f0f7'], exp: 1.05, env: 0.45, bulb: 0.3, dust: 0.35 },
      noite: { sun: 0.35, sunC: '#8fa6d6', pos: [-3.2, 3.4, 0.2], hemi: 0.08, lamp: 2.4, sky: ['#0b1426', '#22304d'], exp: 1.1, env: 0.12, bulb: 6, dust: 0.15 },
    }[mode];
    this.sun.intensity = cfg.sun;
    this.sun.color.set(cfg.sunC);
    this.sun.position.set(cfg.pos[0], cfg.pos[1], cfg.pos[2]);
    this.hemi.intensity = cfg.hemi;
    this.lamp.intensity = cfg.lamp;
    this.lamp.castShadow = false;
    (this.lampBulb.material as THREE.MeshStandardMaterial).emissiveIntensity = cfg.bulb;
    this.skyMat.map?.dispose();
    this.skyMat.map = skyGradient(cfg.sky[0], cfg.sky[1]);
    this.skyMat.needsUpdate = true;
    this.renderer.toneMappingExposure = cfg.exp;
    this.scene.environmentIntensity = cfg.env;
    (this.dust.material as THREE.PointsMaterial).opacity = cfg.dust;
  }

  highlightTool(active: ToolId, t: number) {
    for (const o of this.tools) {
      const base = this.toolBase.get(o)!;
      const on = o.userData.tool === active;
      o.position.y = THREE.MathUtils.lerp(o.position.y, base.y + (on ? 0.02 + Math.sin(t * 2) * 0.004 : 0), 0.12);
    }
  }

  animate(t: number, dt: number) {
    const p = this.dust.geometry.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < p.count; i++) {
      let y = p.getY(i) + dt * 0.012 * (0.5 + (i % 7) / 7);
      if (y > 2.3) y = 0.8;
      p.setY(i, y);
      p.setX(i, p.getX(i) + Math.sin(t * 0.3 + i) * dt * 0.006);
    }
    p.needsUpdate = true;
    this.vignette.uniforms.uTime.value = t % 100;
    if (this.waterSurface) this.waterSurface.position.y = 0.05 + Math.sin(t * 1.3) * 0.0008;
  }

  resize() {
    const w = innerWidth, h = innerHeight;
    if (w < 2 || h < 2) return;
    this.camera.aspect = w / h;
    this.camera.fov = w < h ? 52 : 38;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
    this.composer.setSize(w, h);
    this.composer.setPixelRatio(this.renderer.getPixelRatio());
    this.bloom.setSize(w / 2, h / 2);
  }

  render() {
    if (innerWidth < 2 || innerHeight < 2 || this.renderer.domElement.width < 2) return;
    this.composer.render();
  }
}
