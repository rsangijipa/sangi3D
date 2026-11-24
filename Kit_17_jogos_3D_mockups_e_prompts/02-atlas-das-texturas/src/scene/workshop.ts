import * as THREE from 'three';
import { Engine, nextFrame, type View } from '../core/engine';
import { fabricSampler, makeTexSet, pbrMaterial, physicalMaterial, woodSampler, type TexSet } from '../core/pbr';
import { canvasTexture, mergeStatic } from '../core/model';
import { createDust } from '../core/effects';
import { SAMPLE_IDS, SAMPLES, LOADING_LINES, type LightPreset, type SampleId } from '../game/content';
import { buildSample, type SampleModel } from './samples';
import { buildLamp, type LampParts } from './lamp';
import { buildMagnifier, LENS_R, type Magnifier } from './magnifier';
import { buildCabinet, buildRoom, buildShelves, buildTray, buildWallProps, type DecorMats } from './decor';
import { brushedSampler, creamPaperSampler, feltSampler, troweledSampler } from './surfaces';

/**
 * Bancada do Atlas das Texturas. Monta a cena, consome o estado (sem guardá-lo) e expõe comandos
 * de câmera, picking e animação. Toda a lógica de regras fica em game/.
 */

export type ViewName = 'bancada' | 'geral' | 'perto' | 'rente' | 'luz';

export interface SceneInput {
  stepId: string;
  sampleId: SampleId | null;
  chosen: SampleId[];
  allowed: SampleId[];
  compare: [SampleId, SampleId] | null;
  rotation: number;
  lampOn: boolean;
  lampAngle: number;
  lampElevation: number;
  lampSweep: boolean;
  magnifierOn: boolean;
  magnifierPos: [number, number];
  zoom: number;
  preset: LightPreset;
}

export interface PickHit {
  kind: 'tray' | 'hero' | 'lamp' | 'magnifier' | 'drawer';
  id?: SampleId;
  point: THREE.Vector3;
}

const MAIN = new THREE.Vector3(0, 0, 0.05);
const MAIN_W = 0.52;
const MAIN_D = 0.37;
const HOME: Record<SampleId, [number, number, number]> = {
  wool: [-0.47, -0.36, 0.05],
  slate: [-0.17, -0.4, 0.0],
  linen: [0.14, -0.39, -0.03],
  sandstone: [0.42, -0.36, -0.08],
  leaf: [-0.53, 0.3, 0.1],
  ceramic: [0.62, -0.06, -0.3],
  smooth_wood: [0.58, 0.3, -0.18],
  cork: [0.32, 0.4, 0.12],
};
const TRAY_W = 0.23;
const TRAY_D = 0.18;
const LAMP_BASE = new THREE.Vector3(-0.47, 0, -0.02);
const MAG_BASE = new THREE.Vector3(0.36, 0, 0.12);
const CABINET = new THREE.Vector3(0.66, 0, -0.5);
const LIGHT_R = 0.31;

interface PresetParams {
  sunColor: THREE.Color;
  sunInt: number;
  sunPos: THREE.Vector3;
  sky: THREE.Color;
  ground: THREE.Color;
  hemiInt: number;
  exposure: number;
  lampColor: THREE.Color;
  gain: THREE.Vector3;
  lift: THREE.Vector3;
  sat: number;
  envInt: number;
}

const PRESETS: Record<LightPreset, () => PresetParams> = {
  sala: () => ({
    sunColor: new THREE.Color('#fff0dc'),
    sunInt: 3.2,
    sunPos: new THREE.Vector3(-1.1, 1.9, 1.3),
    sky: new THREE.Color('#e9eef3'),
    ground: new THREE.Color('#8b6a48'),
    hemiInt: 0.62,
    exposure: 0.95,
    lampColor: new THREE.Color('#ffe6c4'),
    gain: new THREE.Vector3(1.0, 0.995, 0.975),
    lift: new THREE.Vector3(0.012, 0.01, 0.008),
    sat: 1.04,
    envInt: 0.55,
  }),
  tarde: () => ({
    sunColor: new THREE.Color('#ffbe82'),
    sunInt: 3.0,
    sunPos: new THREE.Vector3(-1.7, 1.05, 0.7),
    sky: new THREE.Color('#f1d3b3'),
    ground: new THREE.Color('#6d4a2e'),
    hemiInt: 0.5,
    exposure: 1.0,
    lampColor: new THREE.Color('#ffd9a8'),
    gain: new THREE.Vector3(1.04, 0.985, 0.92),
    lift: new THREE.Vector3(0.018, 0.01, 0.0),
    sat: 1.06,
    envInt: 0.5,
  }),
  noite: () => ({
    sunColor: new THREE.Color('#9fb2d6'),
    sunInt: 0.35,
    sunPos: new THREE.Vector3(-0.8, 1.7, 1.1),
    sky: new THREE.Color('#3b4762'),
    ground: new THREE.Color('#2b2019'),
    hemiInt: 0.22,
    exposure: 1.18,
    lampColor: new THREE.Color('#ffd49a'),
    gain: new THREE.Vector3(1.02, 0.98, 0.94),
    lift: new THREE.Vector3(0.01, 0.008, 0.012),
    sat: 1.0,
    envInt: 0.28,
  }),
};

function lerpPreset(a: PresetParams, b: PresetParams, t: number, out: PresetParams) {
  out.sunColor.lerpColors(a.sunColor, b.sunColor, t);
  out.sunInt = THREE.MathUtils.lerp(a.sunInt, b.sunInt, t);
  out.sunPos.lerpVectors(a.sunPos, b.sunPos, t);
  out.sky.lerpColors(a.sky, b.sky, t);
  out.ground.lerpColors(a.ground, b.ground, t);
  out.hemiInt = THREE.MathUtils.lerp(a.hemiInt, b.hemiInt, t);
  out.exposure = THREE.MathUtils.lerp(a.exposure, b.exposure, t);
  out.lampColor.lerpColors(a.lampColor, b.lampColor, t);
  out.gain.lerpVectors(a.gain, b.gain, t);
  out.lift.lerpVectors(a.lift, b.lift, t);
  out.sat = THREE.MathUtils.lerp(a.sat, b.sat, t);
  out.envInt = THREE.MathUtils.lerp(a.envInt, b.envInt, t);
  return out;
}

const clonePreset = (p: PresetParams): PresetParams => ({
  ...p,
  sunColor: p.sunColor.clone(),
  sunPos: p.sunPos.clone(),
  sky: p.sky.clone(),
  ground: p.ground.clone(),
  lampColor: p.lampColor.clone(),
  gain: p.gain.clone(),
  lift: p.lift.clone(),
});

function radialTexture() {
  return canvasTexture(128, 128, (ctx) => {
    const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    g.addColorStop(0, 'rgba(0,0,0,1)');
    g.addColorStop(0.55, 'rgba(0,0,0,0.55)');
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 128, 128);
  }, false);
}

function tagTexture(name: string, chosen: boolean) {
  return canvasTexture(256, 72, (ctx) => {
    ctx.fillStyle = chosen ? '#f6edd8' : '#efe3c6';
    ctx.fillRect(0, 0, 256, 72);
    ctx.strokeStyle = 'rgba(120,95,60,0.35)';
    ctx.lineWidth = 2;
    ctx.strokeRect(5, 5, 246, 62);
    ctx.fillStyle = '#2b3a2e';
    ctx.font = '600 30px Georgia, "Times New Roman", serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(name, chosen ? 140 : 128, 38);
    if (chosen) {
      ctx.fillStyle = '#254533';
      ctx.beginPath();
      ctx.arc(30, 36, 13, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#f6edd8';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(23, 36);
      ctx.lineTo(28, 42);
      ctx.lineTo(38, 30);
      ctx.stroke();
    }
  });
}

/** Ângulo mais curto entre dois valores em graus. */
const angDelta = (a: number, b: number) => ((((b - a) % 360) + 540) % 360) - 180;

export class Workshop {
  readonly engine: Engine;
  readonly samples = new Map<SampleId, SampleModel>();
  private textures: TexSet[] = [];
  private lamp!: LampParts;
  private mag!: Magnifier;
  private sun!: THREE.DirectionalLight;
  private hemi!: THREE.HemisphereLight;
  private envScene!: THREE.Scene;
  private envMats: { wall: THREE.MeshBasicMaterial; window: THREE.MeshBasicMaterial; glow: THREE.MeshBasicMaterial } | null = null;
  private dust!: ReturnType<typeof createDust>;
  private wind = { strength: { value: 0.5 }, time: { value: 0 } };
  private heroRoot = new THREE.Group();
  private slots: THREE.Group[] = [new THREE.Group(), new THREE.Group()];
  private slotContent: (SampleId | null)[] = [null, null];
  private slotPop = [1, 1];
  private minis = new Map<SampleId, THREE.Object3D>();
  private trays = new Map<SampleId, THREE.Group>();
  private tags = new Map<SampleId, { mesh: THREE.Mesh; normal: THREE.Texture; chosen: THREE.Texture }>();
  private colliders: THREE.Object3D[] = [];
  private heroColliders: THREE.Mesh[] = [];
  private contact: THREE.Mesh[] = [];
  private ring!: THREE.Mesh;
  private ringTarget: THREE.Object3D | null = null;
  private drawer!: THREE.Group;
  private drawerFront = new THREE.Vector3();
  private drawerOpen = 0;
  private drawerWant = 0;
  private input: SceneInput | null = null;
  private rot = 0;
  private az = -35;
  private el = 28;
  private lampLevel = 1;
  private roomMode = 1; // 1 = luz rasante (sala mais escura), 0 = luz difusa
  private magT = 0;
  private sweepPhase = 0;
  private presetFrom!: PresetParams;
  private presetTo!: PresetParams;
  private presetCur!: PresetParams;
  private presetT = 1;
  private presetName: LightPreset = 'tarde';
  private envDirty = false;
  private shadowDirty = true;
  private viewName: ViewName = 'bancada';
  private insets = { right: 0, bottom: 0 };
  private saving: { obj: THREE.Object3D; curve: THREE.CatmullRomCurve3; t: number; dur: number; s0: number; resolve: () => void } | null = null;
  private hiddenForView: THREE.Object3D[] = [];
  private tmpV = new THREE.Vector3();
  private tmpV2 = new THREE.Vector3();
  private plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
  reducedMotion = false;
  /** Ângulo atual do giro automático (para a UI registrar). */
  sweepAngle = 0;

  constructor(engine: Engine) {
    this.engine = engine;
  }

  /* ---------------------------------------------------------------- */
  /* Construção                                                        */
  /* ---------------------------------------------------------------- */

  async build(onProgress: (f: number, line: string) => void) {
    const e = this.engine;
    const q = e.quality;
    const size = q === 'baixa' ? 256 : 512;
    const big = q === 'alta' ? 1024 : 512;
    const aniso = e.aniso;
    let step = 0;
    const total = 22;
    const tick = async () => {
      step++;
      onProgress(Math.min(1, step / total), LOADING_LINES[Math.min(LOADING_LINES.length - 1, Math.floor((step / total) * LOADING_LINES.length))]);
      await nextFrame();
    };
    const keep = (t: TexSet) => {
      this.textures.push(t);
      return t;
    };

    // materiais do cenário
    const oak = keep(makeTexSet({ size: big, aniso, normalStrength: 1.6, sample: woodSampler({ light: '#e0a868', dark: '#a76c3d', planks: 4, grainScale: 0.9, gloss: 0.45, seed: 5 }) }));
    await tick();
    const trayT = keep(makeTexSet({ size, aniso, normalStrength: 1.4, sample: woodSampler({ light: '#e2b27a', dark: '#a8713f', grainScale: 1.3, gloss: 0.5, seed: 9 }) }));
    await tick();
    const darkT = keep(makeTexSet({ size, aniso, normalStrength: 1.4, sample: woodSampler({ light: '#9a6438', dark: '#5a3418', grainScale: 1.1, gloss: 0.35, seed: 13 }) }));
    await tick();
    const feltT = keep(makeTexSet({ size, aniso, normalStrength: 2.2, sample: feltSampler('#566f36') }));
    await tick();
    const plasterT = keep(makeTexSet({ size, aniso, normalStrength: 1.8, sample: troweledSampler('#dcc7a8') }));
    await tick();
    const steelT = keep(makeTexSet({ size, aniso, normalStrength: 0.6, sample: brushedSampler('#d2d0cc') }));
    await tick();
    const brassT = keep(makeTexSet({ size: Math.min(256, size), aniso, normalStrength: 0.6, sample: brushedSampler('#caa064', 61) }));
    const paperT = keep(makeTexSet({ size: Math.min(256, size), aniso, normalStrength: 1, sample: creamPaperSampler() }));
    const clothT = keep(makeTexSet({ size: Math.min(256, size), aniso, normalStrength: 1.6, sample: fabricSampler('#ffffff', 3, 96) }));
    await tick();

    const mats: DecorMats = {
      oak: pbrMaterial(oak, { roughness: 1 }, 0.8),
      trayWood: pbrMaterial(trayT, { roughness: 1 }, 0.7),
      darkWood: pbrMaterial(darkT, { roughness: 1 }, 0.7),
      felt: pbrMaterial(feltT, { roughness: 1 }, 1.2),
      plaster: pbrMaterial(plasterT, { roughness: 1 }, 1),
      steel: pbrMaterial(steelT, { metalness: 1, roughness: 1, color: '#e4e2de' }, 0.4),
      brass: pbrMaterial(brassT, { metalness: 1, roughness: 1 }, 0.4),
      paper: pbrMaterial(paperT, { roughness: 1 }),
      ceramic: physicalMaterial(paperT, { color: '#f0e6d4', roughness: 0.45, clearcoat: 0.5, clearcoatRoughness: 0.35 }, 0.2),
      cloth: pbrMaterial(clothT, { roughness: 1 }, 0.8) as THREE.MeshStandardMaterial,
    };
    (mats.plaster as THREE.MeshStandardMaterial).map!.repeat.set(1 / 0.7, 1 / 0.7);
    (mats.plaster as THREE.MeshStandardMaterial).normalMap!.repeat.set(1 / 0.7, 1 / 0.7);
    (mats.plaster as THREE.MeshStandardMaterial).roughnessMap!.repeat.set(1 / 0.7, 1 / 0.7);
    for (const m of [mats.trayWood, mats.darkWood] as THREE.MeshStandardMaterial[]) {
      for (const t of [m.map, m.normalMap, m.roughnessMap]) t!.repeat.set(4, 4);
    }
    const darkMetal = new THREE.MeshStandardMaterial({ color: '#2e2a27', roughness: 0.45, metalness: 0.6 });

    // amostras
    for (const id of SAMPLE_IDS) {
      const model = buildSample(id, { size, heroSize: id === 'cork' ? big : size, aniso });
      model.textures.forEach(keep);
      this.samples.set(id, model);
      await tick();
    }

    const scene = e.scene;
    scene.background = new THREE.Color('#2a211b');
    scene.fog = new THREE.Fog('#2a211b', 2.6, 6);

    // sala e decoração (estáticos fundidos por material)
    const statics = new THREE.Group();
    statics.add(buildRoom(mats));
    const shelves = buildShelves(mats, this.wind, size);
    statics.add(shelves.group);
    statics.add(buildWallProps(mats, size));
    const cab = buildCabinet(mats, size);
    cab.group.position.copy(CABINET);
    cab.group.rotation.y = -0.38;
    this.drawer = cab.drawer;
    cab.group.remove(cab.drawer);
    statics.add(cab.group);
    await tick();

    // bandeja principal (tray_felt)
    const main = buildTray(MAIN_W, MAIN_D, mats, true, 'tray_felt');
    main.group.position.copy(MAIN);
    statics.add(main.group);
    this.heroRoot.position.set(MAIN.x, main.surfaceY, MAIN.z);
    for (const s of this.slots) this.heroRoot.add(s);
    scene.add(this.heroRoot);

    // bandejas das amostras + etiquetas de papel
    for (const id of SAMPLE_IDS) {
      const [x, z, yaw] = HOME[id];
      const felt = id === 'cork' || id === 'sandstone' || id === 'ceramic';
      const tray = buildTray(TRAY_W, TRAY_D, mats, felt, `tray_${id}`);
      const holder = new THREE.Group();
      holder.position.set(x, 0, z);
      holder.rotation.y = yaw;
      holder.add(tray.group);
      const mini = this.samples.get(id)!.object.clone(true);
      const s = Math.min(0.62, (TRAY_W - 0.05) / this.samples.get(id)!.size);
      mini.scale.setScalar(s);
      mini.position.y = tray.surfaceY;
      holder.add(mini);
      this.minis.set(id, mini);
      const normal = tagTexture(SAMPLES[id].name, false);
      const chosen = tagTexture(SAMPLES[id].name, true);
      const tag = new THREE.Mesh(new THREE.PlaneGeometry(0.075, 0.021), new THREE.MeshStandardMaterial({ map: normal, roughness: 0.9 }));
      tag.rotation.x = -Math.PI / 2;
      tag.position.set(0, 0.0012, TRAY_D / 2 + 0.022);
      tag.receiveShadow = true;
      holder.add(tag);
      this.tags.set(id, { mesh: tag, normal, chosen });
      const col = new THREE.Mesh(new THREE.BoxGeometry(TRAY_W, 0.09, TRAY_D + 0.05), new THREE.MeshBasicMaterial({ visible: false }));
      col.position.set(0, 0.045, 0.02);
      col.userData.pick = { kind: 'tray', id };
      holder.add(col);
      this.colliders.push(col);
      this.trays.set(id, holder);
      scene.add(holder);
    }

    // estáticos fundidos
    const merged = mergeStatic(statics);
    merged.name = 'statics';
    scene.add(merged);
    scene.add(shelves.animated);
    // gaveta animável fica fora da fusão
    const drawerParent = new THREE.Group();
    drawerParent.position.copy(CABINET);
    drawerParent.rotation.y = -0.38;
    drawerParent.add(this.drawer);
    scene.add(drawerParent);
    drawerParent.updateMatrixWorld(true);
    this.drawerFront.copy(cab.drawerFront).applyMatrix4(drawerParent.matrixWorld);
    const dcol = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.3, 0.25), new THREE.MeshBasicMaterial({ visible: false }));
    dcol.position.set(0, 0.15, 0);
    dcol.userData.pick = { kind: 'drawer' };
    drawerParent.add(dcol);
    this.colliders.push(dcol);
    await tick();

    // luminária
    this.lamp = buildLamp({ steel: mats.steel, dark: darkMetal, shadowSize: q === 'alta' ? 2048 : 1024, quality: q });
    this.lamp.root.position.copy(LAMP_BASE);
    scene.add(this.lamp.root);
    for (const p of this.lamp.picks) p.userData.pick = { kind: 'lamp' };
    this.colliders.push(...this.lamp.picks);

    // lupa
    this.mag = buildMagnifier({ steel: mats.steel, dark: darkMetal, rtSize: q === 'baixa' ? 256 : 512, samples: q === 'baixa' ? 0 : 4 });
    this.mag.stand.position.copy(MAG_BASE);
    this.mag.stand.rotation.y = -0.5;
    scene.add(this.mag.stand);
    scene.add(this.mag.lens);
    for (const p of this.mag.picks) p.userData.pick = { kind: 'magnifier' };
    this.colliders.push(...this.mag.picks);
    this.mag.stand.updateMatrixWorld(true);
    this.mag.restPos.applyMatrix4(this.mag.stand.matrixWorld);
    this.mag.restQuat.premultiply(new THREE.Quaternion().setFromEuler(this.mag.stand.rotation));
    this.mag.lens.position.copy(this.mag.restPos);
    this.mag.lens.quaternion.copy(this.mag.restQuat);
    await tick();

    // colisores dos heróis (caixa simples por vaga)
    for (let i = 0; i < 2; i++) {
      const col = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({ visible: false }));
      col.userData.pick = { kind: 'hero' };
      this.slots[i].add(col);
      this.heroColliders.push(col);
      this.colliders.push(col);
    }

    // sombras de contato (decalque radial) sob os objetos relevantes
    const radial = radialTexture();
    const contactMat = new THREE.MeshBasicMaterial({ map: radial, transparent: true, depthWrite: false, opacity: 0.4, color: '#000000' });
    const addContact = (parent: THREE.Object3D, w: number, d: number, y = 0.0008, op = 0.4) => {
      const m = new THREE.Mesh(new THREE.PlaneGeometry(w, d), op === 0.4 ? contactMat : contactMat.clone());
      (m.material as THREE.MeshBasicMaterial).opacity = op;
      m.rotation.x = -Math.PI / 2;
      m.position.y = y;
      m.userData.noAO = true;
      m.renderOrder = 1;
      m.raycast = () => {};
      parent.add(m);
      return m;
    };
    for (const s of this.slots) this.contact.push(addContact(s, 0.3, 0.24, 0.0006, 0.32));
    addContact(this.lamp.root, 0.24, 0.24, 0.0004, 0.5);
    const magContact = addContact(scene, 0.17, 0.17, 0.0004, 0.45);
    magContact.position.set(MAG_BASE.x, 0.0004, MAG_BASE.z);
    const mainContact = addContact(scene, MAIN_W + 0.1, MAIN_D + 0.1, 0.0003, 0.35);
    mainContact.position.set(MAIN.x, 0.0003, MAIN.z);
    for (const id of SAMPLE_IDS) addContact(this.trays.get(id)!, TRAY_W + 0.07, TRAY_D + 0.07, 0.0003, 0.3);

    // anel de destaque (hover)
    this.ring = new THREE.Mesh(
      new THREE.RingGeometry(0.5, 0.53, 96),
      new THREE.MeshBasicMaterial({ color: '#fff2d2', transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending }),
    );
    this.ring.rotation.x = -Math.PI / 2;
    this.ring.userData.noAO = true;
    this.ring.raycast = () => {};
    this.ring.renderOrder = 7;
    scene.add(this.ring);

    // luzes
    this.sun = new THREE.DirectionalLight('#fff0dc', 3);
    this.engine.configureShadow(this.sun, q === 'alta' ? 2048 : 1024, 4);
    const sc = this.sun.shadow.camera;
    sc.left = -1.05;
    sc.right = 1.05;
    sc.top = 0.95;
    sc.bottom = -0.95;
    sc.near = 0.2;
    sc.far = 5;
    sc.updateProjectionMatrix();
    this.sun.shadow.bias = -0.0004;
    this.sun.shadow.normalBias = 0.003;
    this.sun.target.position.set(0, 0, -0.15);
    scene.add(this.sun, this.sun.target);
    this.hemi = new THREE.HemisphereLight('#e9eef3', '#8b6a48', 0.6);
    scene.add(this.hemi);

    // poeira no facho da luminária
    this.dust = createDust({
      count: q === 'baixa' ? 160 : q === 'media' ? 320 : 520,
      min: new THREE.Vector3(-0.6, 0.02, -0.4),
      max: new THREE.Vector3(0.35, 0.55, 0.45),
      size: 0.55,
      base: 0.0,
      color: '#ffe0b4',
      beams: [{ origin: new THREE.Vector3(), dir: new THREE.Vector3(1, -1, 0).normalize(), length: 0.5, radius: 0.11 }],
    });
    scene.add(this.dust.object);
    await tick();

    // ambiente PMREM gerado do próprio ateliê (paredes quentes, janela, brilho da luminária)
    this.envScene = new THREE.Scene();
    const wallM = new THREE.MeshBasicMaterial({ color: '#7d6550', side: THREE.BackSide });
    const room = new THREE.Mesh(new THREE.BoxGeometry(6, 3, 6), wallM);
    room.position.y = 1.2;
    this.envScene.add(room);
    const winM = new THREE.MeshBasicMaterial({ color: '#ffe8c8' });
    const win = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 1.2), winM);
    win.position.set(-2.95, 1.4, 0.6);
    win.rotation.y = Math.PI / 2;
    this.envScene.add(win);
    const glowM = new THREE.MeshBasicMaterial({ color: '#ffd9a0' });
    const glow = new THREE.Mesh(new THREE.SphereGeometry(0.25, 16, 12), glowM);
    glow.position.set(-0.8, 1.0, 0.2);
    this.envScene.add(glow);
    const tableM = new THREE.Mesh(new THREE.PlaneGeometry(6, 6), new THREE.MeshBasicMaterial({ color: '#a26b3d' }));
    tableM.rotation.x = -Math.PI / 2;
    tableM.position.y = -0.2;
    this.envScene.add(tableM);
    this.envMats = { wall: wallM, window: winM, glow: glowM };

    this.presetCur = PRESETS[this.presetName]();
    this.presetFrom = clonePreset(this.presetCur);
    this.presetTo = clonePreset(this.presetCur);
    this.applyPreset(this.presetCur);
    this.regenEnv();

    this.engine.controls.enablePan = false;
    this.engine.controls.minDistance = 0.16;
    this.engine.controls.maxDistance = 1.7;
    this.engine.controls.minPolarAngle = 0.2;
    this.engine.controls.maxPolarAngle = 1.45;
    this.engine.controls.minAzimuthAngle = -1.15;
    this.engine.controls.maxAzimuthAngle = 1.15;
    this.engine.onResize(() => this.applyFraming());
    this.setView('bancada', false);

    this.engine.onUpdate((dt, t) => this.update(dt, t));
    this.built = true;
    if (this.pending) this.apply(this.pending);
    await tick();
  }

  /* ---------------------------------------------------------------- */
  /* Luz e clima                                                       */
  /* ---------------------------------------------------------------- */

  private applyPreset(p: PresetParams) {
    const lampFactor = this.lampLevel;
    // luz rasante: a sala escurece para a luminária desenhar o relevo; luz difusa: preenchimento maior
    const room = THREE.MathUtils.lerp(1.0, 0.42, this.roomMode * lampFactor);
    const diffuse = 1 - this.roomMode;
    this.sun.color.copy(p.sunColor);
    this.sun.intensity = p.sunInt * room * (1 - diffuse * 0.25);
    this.sun.position.copy(p.sunPos);
    this.sun.shadow.radius = 4 + diffuse * 6;
    this.hemi.color.copy(p.sky);
    this.hemi.groundColor.copy(p.ground);
    this.hemi.intensity = p.hemiInt * (0.75 + room * 0.25) * (1 + diffuse * 0.7);
    this.engine.renderer.toneMappingExposure = p.exposure;
    const u = this.engine.grade.uniforms;
    u.uGain.value.copy(p.gain);
    u.uLift.value.copy(p.lift);
    u.uSat.value = p.sat;
    u.uContrast.value = 1.05;
    u.uVignette.value = 0.42;
    this.engine.scene.environmentIntensity = p.envInt * (0.7 + room * 0.3);
    this.lamp.setLevel(this.lampLevel, p.lampColor);
  }

  private regenEnv() {
    if (!this.envMats) return;
    const p = this.presetCur;
    this.envMats.wall.color.copy(p.ground).lerp(new THREE.Color('#a08870'), 0.5).multiplyScalar(0.6 + p.hemiInt * 0.5);
    this.envMats.window.color.copy(p.sunColor).multiplyScalar(0.6 + p.sunInt * 0.4);
    this.envMats.glow.color.copy(p.lampColor).multiplyScalar(1 + this.lampLevel * 2);
    const old = this.engine.scene.environment;
    this.engine.scene.environment = this.engine.envFrom(this.envScene, 0.06);
    old?.dispose();
  }

  setPreset(name: LightPreset, instant = false) {
    if (name === this.presetName && this.presetT >= 1) return;
    this.presetName = name;
    this.presetFrom = clonePreset(this.presetCur);
    this.presetTo = PRESETS[name]();
    this.presetT = instant ? 1 : 0;
    if (instant) {
      lerpPreset(this.presetFrom, this.presetTo, 1, this.presetCur);
      this.envDirty = true;
    }
  }

  /* ---------------------------------------------------------------- */
  /* Estado → cena                                                     */
  /* ---------------------------------------------------------------- */

  private built = false;
  private pending: SceneInput | null = null;

  apply(input: SceneInput) {
    if (!this.built) {
      this.pending = input;
      return;
    }
    const prev = this.input;
    this.input = input;
    if (!prev || prev.preset !== input.preset) this.setPreset(input.preset, !prev);
    if (!prev) {
      this.rot = input.rotation;
      this.az = input.lampAngle;
      this.el = input.lampElevation;
      this.lampLevel = input.lampOn ? 1 : 0;
      this.roomMode = input.lampOn ? 1 : 0;
    }
    if (input.lampSweep && (!prev || !prev.lampSweep)) this.sweepPhase = Math.asin(THREE.MathUtils.clamp(this.az / 70, -1, 1));
    // vagas da bandeja principal
    const want: (SampleId | null)[] = input.compare ? [input.compare[0], input.compare[1]] : [input.sampleId, null];
    for (let i = 0; i < 2; i++) {
      if (want[i] !== this.slotContent[i]) this.fillSlot(i, want[i]);
    }
    this.layoutSlots();
    // miniaturas: some da bandeja de origem quem está na bandeja principal
    for (const id of SAMPLE_IDS) {
      const onMain = want.includes(id);
      const mini = this.minis.get(id)!;
      mini.visible = !onMain;
      const tag = this.tags.get(id)!;
      const chosen = input.chosen.includes(id);
      const mat = tag.mesh.material as THREE.MeshStandardMaterial;
      const tex = chosen ? tag.chosen : tag.normal;
      if (mat.map !== tex) {
        mat.map = tex;
        mat.needsUpdate = true;
      }
      const holder = this.trays.get(id)!;
      const allowed = input.allowed.includes(id);
      holder.visible = true;
      holder.position.y = chosen && input.stepId === 'escolher' ? 0.004 : 0;
      mini.traverse((o) => {
        if ((o as THREE.Mesh).isMesh) o.visible = allowed || onMain;
      });
    }
    this.shadowDirty = true;
  }

  private fillSlot(i: number, id: SampleId | null) {
    const slot = this.slots[i];
    const prev = this.slotContent[i];
    if (prev) {
      const o = this.samples.get(prev)!.object;
      if (o.parent === slot) slot.remove(o);
    }
    this.slotContent[i] = id;
    if (id) {
      const o = this.samples.get(id)!.object;
      // se estava na outra vaga, retira de lá
      o.removeFromParent();
      const other = this.slotContent[1 - i];
      if (other === id) this.slotContent[1 - i] = null;
      slot.add(o);
      this.slotPop[i] = this.reducedMotion ? 1 : 0;
    }
    slot.visible = !!id;
  }

  private layoutSlots() {
    const compare = !!(this.input && this.input.compare);
    let s = 1;
    if (compare) {
      const a = this.slotContent[0] ? this.samples.get(this.slotContent[0])!.size : 0.2;
      const b = this.slotContent[1] ? this.samples.get(this.slotContent[1])!.size : 0.2;
      // mesma escala para as duas: comparação justa
      s = Math.min(1, 0.215 / Math.max(a, b));
    }
    for (let i = 0; i < 2; i++) {
      const id = this.slotContent[i];
      const slot = this.slots[i];
      slot.position.set(compare ? (i === 0 ? -0.118 : 0.118) : 0, 0, 0);
      slot.visible = !!id;
      if (!id) continue;
      const model = this.samples.get(id)!;
      const single = compare ? s : Math.min(1, (MAIN_W - 0.09) / model.size);
      model.object.scale.setScalar(single);
      slot.userData.scale = single;
      const col = this.heroColliders[i];
      col.scale.set(model.size * single, Math.max(0.03, model.height * single), model.size * single * 0.8);
      col.position.y = (model.height * single) / 2;
      this.contact[i].scale.set((model.size * single) / 0.26, (model.size * single) / 0.3, 1);
    }
  }

  /* ---------------------------------------------------------------- */
  /* Câmera e enquadramento                                            */
  /* ---------------------------------------------------------------- */

  private viewFor(name: ViewName): View {
    const aspect = this.engine.camera.aspect;
    const portrait = aspect < 0.85;
    const target = this.heroCenter(this.tmpV);
    let v: View;
    switch (name) {
      case 'geral':
        v = { label: 'Vista geral', position: [0.06, 0.78, 1.08], target: [0.02, 0.04, -0.14] };
        break;
      case 'perto':
        v = { label: 'Perto', position: [target.x + 0.02, target.y + 0.2, target.z + 0.23], target: [target.x, target.y, target.z] };
        break;
      case 'rente':
        v = { label: 'Rente à mesa', position: [target.x + 0.3, 0.075, target.z + 0.34], target: [target.x - 0.02, target.y * 0.6, target.z - 0.02] };
        break;
      case 'luz': {
        const b = this.lamp.bulbWorld(new THREE.Vector3());
        const aim = this.lamp.aimWorld(new THREE.Vector3());
        const p = b.clone().addScaledVector(aim, 0.03);
        const tt = p.clone().addScaledVector(aim, 0.3);
        v = { label: 'Do lugar da luz', position: [p.x, p.y, p.z], target: [tt.x, tt.y, tt.z] };
        break;
      }
      default:
        v = { label: 'Bancada', position: [0.04, 0.44, 0.76], target: [0.0, 0.05, -0.04] };
    }
    if (portrait && name !== 'luz') {
      // celular em pé: recua a câmera ao longo do mesmo eixo para manter luminária e superfície
      const p = new THREE.Vector3(...v.position);
      const t = new THREE.Vector3(...v.target);
      const k = name === 'perto' ? 1.45 : name === 'rente' ? 1.5 : 1.95;
      const dir = p.clone().sub(t);
      if (name === 'bancada') {
        t.x -= 0.1;
        dir.y *= 1.25;
      }
      p.copy(t).addScaledVector(dir, k);
      v = { ...v, position: [p.x, p.y, p.z], target: [t.x, t.y, t.z] };
    }
    return v;
  }

  get currentView() {
    return this.viewName;
  }

  setView(name: ViewName, animate = !this.reducedMotion) {
    const cam = this.engine.camera;
    // sair do ponto de vista da luz restaura o que foi escondido
    if (this.viewName === 'luz' && name !== 'luz') {
      this.hiddenForView.forEach((o) => (o.visible = true));
      this.hiddenForView = [];
      cam.near = 0.05;
      cam.updateProjectionMatrix();
      this.engine.controls.enabled = true;
    }
    this.viewName = name;
    if (name === 'luz') {
      this.hiddenForView = [this.lamp.head];
      this.lamp.head.visible = false;
      cam.near = 0.004;
      cam.updateProjectionMatrix();
      this.engine.controls.enabled = false;
      // a sombra continua projetada pela cúpula mesmo oculta? não: refaz sombras
      this.shadowDirty = true;
    }
    this.engine.setView(this.viewFor(name), animate);
  }

  /** Reposiciona a vista atual (após resize ou troca de amostra). */
  refreshView(animate = false) {
    this.setView(this.viewName, animate);
  }

  setInsets(right: number, bottom: number) {
    this.insets = { right, bottom };
    this.applyFraming();
  }

  private applyFraming() {
    const cam = this.engine.camera;
    const r = this.engine.renderer.domElement.getBoundingClientRect();
    const w = Math.max(1, r.width);
    const h = Math.max(1, r.height);
    const ox = Math.min(this.insets.right * 0.5, w * 0.22);
    const oy = Math.min(this.insets.bottom * 0.5, h * 0.3);
    if (ox < 1 && oy < 1) cam.clearViewOffset();
    else cam.setViewOffset(w, h, ox, oy, w, h);
    cam.updateProjectionMatrix();
  }

  private heroCenter(out: THREE.Vector3) {
    let hgt = 0.04;
    const id = this.slotContent[0];
    if (id) hgt = this.samples.get(id)!.height * (this.slots[0].userData.scale ?? 1);
    return out.set(MAIN.x, this.heroRoot.position.y + hgt * 0.5, MAIN.z);
  }

  /* ---------------------------------------------------------------- */
  /* Picking                                                           */
  /* ---------------------------------------------------------------- */

  pick(clientX: number, clientY: number): PickHit | null {
    const hits = this.engine.pick(clientX, clientY, this.colliders, false);
    for (const h of hits) {
      let o: THREE.Object3D | null = h.object;
      while (o && !o.userData.pick) o = o.parent;
      if (!o || !o.visible || (o.parent && !o.parent.visible)) continue;
      const info = o.userData.pick as { kind: PickHit['kind']; id?: SampleId };
      if (info.kind === 'hero') {
        const idx = this.heroColliders.indexOf(o as THREE.Mesh);
        const id = this.slotContent[idx];
        if (!id) continue;
        return { kind: 'hero', id, point: h.point.clone() };
      }
      return { kind: info.kind, id: info.id, point: h.point.clone() };
    }
    return null;
  }

  /** Ponto do plano da bandeja (coordenadas locais da bandeja principal) sob o cursor. */
  trayPoint(clientX: number, clientY: number): [number, number] | null {
    const ray = this.engine.ray(clientX, clientY);
    this.plane.constant = -(this.heroRoot.position.y + 0.02);
    const p = ray.intersectPlane(this.plane, this.tmpV2);
    if (!p) return null;
    return [p.x - MAIN.x, p.z - MAIN.z];
  }

  /** Destaque suave sob o objeto apontado (anel elíptico). */
  highlight(hit: PickHit | null) {
    let target: THREE.Object3D | null = null;
    if (hit?.kind === 'tray' && hit.id) target = this.trays.get(hit.id)!;
    else if (hit?.kind === 'hero') target = this.heroRoot;
    else if (hit?.kind === 'lamp') target = this.lamp.root;
    else if (hit?.kind === 'magnifier') target = this.mag.stand;
    this.ringTarget = target;
    if (!target) return;
    const wp = target.getWorldPosition(this.tmpV);
    this.ring.position.set(wp.x, 0.002, wp.z);
    if (hit?.kind === 'tray') this.ring.scale.set((TRAY_W + 0.04) / 1, (TRAY_D + 0.06) / 1, 1).multiplyScalar(1.02);
    else if (hit?.kind === 'hero') this.ring.scale.set(MAIN_W + 0.04, MAIN_D + 0.04, 1);
    else this.ring.scale.set(0.2, 0.2, 1);
    this.ring.rotation.z = target === this.trays.get(hit?.id as SampleId) ? -(target.rotation.y) : 0;
  }

  /** Posição na tela (px) de um objeto, para rótulos DOM. */
  screenOf(hit: PickHit) {
    const p = hit.point.clone().project(this.engine.camera);
    const r = this.engine.renderer.domElement.getBoundingClientRect();
    return { x: r.left + ((p.x + 1) / 2) * r.width, y: r.top + ((1 - p.y) / 2) * r.height };
  }

  /* ---------------------------------------------------------------- */
  /* Guardar (bandeja → gaveta por spline)                             */
  /* ---------------------------------------------------------------- */

  playSave(id: SampleId): Promise<void> {
    const model = this.samples.get(id)!;
    const slotIdx = this.slotContent.indexOf(id);
    const from = new THREE.Vector3();
    let s0 = 0.6;
    if (slotIdx >= 0) {
      this.slots[slotIdx].getWorldPosition(from);
      s0 = this.slots[slotIdx].userData.scale ?? 1;
    } else {
      this.trays.get(id)!.getWorldPosition(from);
    }
    const clone = model.object.clone(true);
    clone.scale.setScalar(s0);
    clone.position.copy(from);
    clone.rotation.y = THREE.MathUtils.degToRad(this.rot);
    this.engine.scene.add(clone);
    const front = this.drawerFront.clone();
    const out = front.clone().add(new THREE.Vector3(Math.sin(-0.38) * 0.12, 0.02, Math.cos(-0.38) * 0.12));
    const curve = new THREE.CatmullRomCurve3([
      from.clone(),
      from.clone().lerp(out, 0.3).add(new THREE.Vector3(0, 0.22, 0)),
      out.clone().add(new THREE.Vector3(0, 0.12, 0)),
      out.clone().add(new THREE.Vector3(0, 0.01, -0.04)),
    ]);
    this.drawerWant = 1;
    return new Promise((resolve) => {
      if (this.reducedMotion) {
        clone.removeFromParent();
        this.drawerWant = 1;
        window.setTimeout(() => {
          this.drawerWant = 0;
          resolve();
        }, 350);
        return;
      }
      this.saving = { obj: clone, curve, t: 0, dur: 1.25, s0, resolve };
    });
  }

  /* ---------------------------------------------------------------- */
  /* Miniaturas renderizadas dos próprios modelos                      */
  /* ---------------------------------------------------------------- */

  renderThumbs(size = 224, closeup = false): Record<SampleId, string> {
    const r = this.engine.renderer;
    const studio = new THREE.Scene();
    studio.environment = this.engine.scene.environment;
    studio.environmentIntensity = 0.7;
    studio.background = new THREE.Color('#e9dcc2');
    const key = new THREE.DirectionalLight('#ffe9cc', 3.2);
    key.position.set(-0.6, 0.35, 0.3);
    studio.add(key, new THREE.HemisphereLight('#f4ead8', '#6d5440', 0.9));
    const cam = new THREE.PerspectiveCamera(closeup ? 16 : 30, 1, 0.01, 5);
    const out = {} as Record<SampleId, string>;
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext('2d')!;
    const prevTarget = r.getRenderTarget();
    const prevScissor = r.getScissorTest();
    const dom = r.domElement;
    const pr = r.getPixelRatio();
    const px = Math.round(size / pr);
    const prevAuto = r.autoClear;
    r.autoClear = true;
    for (const id of SAMPLE_IDS) {
      const model = this.samples.get(id)!;
      const clone = model.object.clone(true);
      clone.scale.setScalar(1);
      clone.rotation.y = 0;
      clone.position.set(0, 0, 0);
      studio.add(clone);
      const c = new THREE.Vector3(0, model.height * 0.45, 0);
      const d = closeup ? model.size * 0.9 : model.size * 2.1 + 0.02;
      cam.position.set(c.x + d * 0.05, c.y + d * 0.75, c.z + d * 0.7);
      cam.lookAt(c);
      r.setRenderTarget(null);
      r.setScissorTest(true);
      r.setViewport(0, 0, px, px);
      r.setScissor(0, 0, px, px);
      r.render(studio, cam);
      ctx.clearRect(0, 0, size, size);
      ctx.drawImage(dom, 0, dom.height - px * pr, px * pr, px * pr, 0, 0, size, size);
      out[id] = canvas.toDataURL('image/jpeg', 0.86);
      studio.remove(clone);
    }
    r.setScissorTest(prevScissor);
    r.setRenderTarget(prevTarget);
    r.autoClear = prevAuto;
    const size2 = r.getSize(new THREE.Vector2());
    r.setViewport(0, 0, size2.x, size2.y);
    key.dispose();
    return out;
  }

  /* ---------------------------------------------------------------- */
  /* Laço por quadro                                                   */
  /* ---------------------------------------------------------------- */

  private lampHead(az: number, el: number, out: THREE.Vector3) {
    const a = THREE.MathUtils.degToRad(az);
    const e = THREE.MathUtils.degToRad(el);
    const c = this.lampTarget(this.tmpV);
    return out.set(c.x - Math.cos(e) * Math.cos(a) * LIGHT_R, c.y + Math.sin(e) * LIGHT_R, c.z + Math.cos(e) * Math.sin(a) * LIGHT_R);
  }

  private lampTarget(out: THREE.Vector3) {
    return out.set(MAIN.x, this.heroRoot.position.y + 0.018, MAIN.z);
  }

  private lastPose = { az: 1e9, el: 1e9 };

  private update(dt: number, time: number) {
    const inp = this.input;
    if (!inp) return;
    const k = (rate: number) => (this.reducedMotion ? 1 : 1 - Math.exp(-dt * rate));

    // preset de luz com transição de ~3,5 s
    if (this.presetT < 1) {
      this.presetT = Math.min(1, this.presetT + dt / (this.reducedMotion ? 0.3 : 3.5));
      const s = this.presetT * this.presetT * (3 - 2 * this.presetT);
      lerpPreset(this.presetFrom, this.presetTo, s, this.presetCur);
      this.shadowDirty = true;
      if (this.presetT >= 1) this.envDirty = true;
    }

    // luminária: giro automático lento ou alvo do estado
    let targetAz = inp.lampAngle;
    if (inp.lampSweep) {
      this.sweepPhase += dt * (this.reducedMotion ? 0 : 0.32);
      targetAz = Math.sin(this.sweepPhase) * 70;
      this.sweepAngle = targetAz;
    }
    this.az += (targetAz - this.az) * (inp.lampSweep ? 1 : k(7));
    this.el += (inp.lampElevation - this.el) * k(7);
    const wantLevel = inp.lampOn ? 1 : 0;
    const prevLevel = this.lampLevel;
    this.lampLevel += (wantLevel - this.lampLevel) * k(4);
    this.roomMode += (wantLevel - this.roomMode) * k(2.2);
    if (Math.abs(prevLevel - this.lampLevel) > 1e-4) this.shadowDirty = true;
    this.applyPreset(this.presetCur);
    if (this.envDirty) {
      this.envDirty = false;
      this.regenEnv();
    }

    if (Math.abs(this.az - this.lastPose.az) > 0.01 || Math.abs(this.el - this.lastPose.el) > 0.01) {
      const head = this.lampHead(this.az, this.el, this.tmpV2);
      this.lamp.pose(head.clone(), this.lampTarget(new THREE.Vector3()));
      this.lastPose.az = this.az;
      this.lastPose.el = this.el;
      this.shadowDirty = true;
      const b = this.lamp.bulbWorld(new THREE.Vector3());
      const d = this.lamp.aimWorld(new THREE.Vector3());
      this.dust.setBeams([{ origin: b, dir: d, length: 0.48, radius: 0.1 }]);
      if (this.viewName === 'luz') this.engine.setView(this.viewFor('luz'), false);
    }
    (this.dust.material as THREE.ShaderMaterial).uniforms.uOpacity.value = this.lampLevel * (this.reducedMotion ? 0.4 : 1);
    this.dust.update(this.reducedMotion ? 0 : time);

    // rotação das amostras na bandeja principal
    const dr = angDelta(this.rot, inp.rotation);
    if (Math.abs(dr) > 0.01) {
      this.rot += dr * k(9);
      this.shadowDirty = true;
    }
    const rad = THREE.MathUtils.degToRad(this.rot);
    for (let i = 0; i < 2; i++) {
      const id = this.slotContent[i];
      if (!id) continue;
      const o = this.samples.get(id)!.object;
      o.rotation.y = rad;
      if (this.slotPop[i] < 1) {
        this.slotPop[i] = Math.min(1, this.slotPop[i] + dt / 0.28);
        const p = this.slotPop[i];
        const e = 1 - Math.pow(1 - p, 3);
        o.position.y = (1 - e) * 0.012;
        o.scale.setScalar((this.slots[i].userData.scale ?? 1) * (0.9 + 0.1 * e));
        this.shadowDirty = true;
      } else {
        o.position.y = 0;
      }
    }

    // lupa: sai do suporte e flutua sobre a amostra
    const wantMag = inp.magnifierOn ? 1 : 0;
    const prevMag = this.magT;
    this.magT += (wantMag - this.magT) * k(6);
    if (Math.abs(this.magT - wantMag) < 0.002) this.magT = wantMag;
    const cam = this.engine.camera;
    const top = this.heroTop();
    const P = new THREE.Vector3(MAIN.x + inp.magnifierPos[0], top, MAIN.z + inp.magnifierPos[1]);
    if (this.magT > 0.001 || prevMag > 0.001) {
      const toCam = cam.position.clone().sub(P).normalize();
      const active = P.clone().addScaledVector(toCam, 0.1);
      const qActive = new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().lookAt(active, cam.position, new THREE.Vector3(0, 1, 0)));
      // lookAt de Matrix4 aponta -Z para o alvo: gira para a face +Z da lente ficar voltada à câmera
      qActive.multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI));
      const t = this.magT;
      const lift = Math.sin(t * Math.PI) * 0.08;
      this.mag.lens.position.lerpVectors(this.mag.restPos, active, t).y += lift;
      this.mag.lens.quaternion.slerpQuaternions(this.mag.restQuat, qActive, t);
      if (Math.abs(prevMag - this.magT) > 1e-4) this.shadowDirty = true;
    }
    const lensMat = this.mag.lensMesh.material as THREE.ShaderMaterial;
    lensMat.uniforms.uOn.value = this.magT;
    if (this.magT > 0.05) this.renderLens(P, inp.zoom);

    // gaveta
    this.drawerOpen += (this.drawerWant - this.drawerOpen) * k(8);
    this.drawer.position.z = 0.12 + this.drawerOpen * 0.13;
    if (this.saving) {
      const s = this.saving;
      s.t = Math.min(1, s.t + dt / s.dur);
      const e = s.t < 0.5 ? 2 * s.t * s.t : 1 - Math.pow(-2 * s.t + 2, 2) / 2;
      s.curve.getPointAt(e, s.obj.position);
      s.obj.scale.setScalar(s.s0 * (1 - e * 0.55));
      s.obj.rotation.y += dt * 0.8;
      this.shadowDirty = true;
      if (s.t >= 1) {
        s.obj.removeFromParent();
        this.saving = null;
        this.drawerWant = 0;
        window.setTimeout(s.resolve, 250);
      }
    }

    // vento suave na jiboia
    this.wind.time.value = this.reducedMotion ? 0 : time;

    // destaque
    const ringMat = this.ring.material as THREE.MeshBasicMaterial;
    const ringWant = this.ringTarget ? 0.35 + (this.reducedMotion ? 0 : Math.sin(time * 3) * 0.08) : 0;
    ringMat.opacity += (ringWant - ringMat.opacity) * k(10);
    this.ring.visible = ringMat.opacity > 0.01;

    // translucidez da folha e demais atualizações das amostras
    const toLight = this.lamp.bulbWorld(new THREE.Vector3()).sub(P).normalize();
    const toCamera = cam.position.clone().sub(P).normalize();
    for (const id of SAMPLE_IDS) this.samples.get(id)!.update?.({ time, toLight, toCamera, lampLevel: this.lampLevel });

    if (this.shadowDirty) {
      this.engine.refreshShadows();
      this.shadowDirty = false;
    }
  }

  private heroTop() {
    let h = 0.03;
    for (let i = 0; i < 2; i++) {
      const id = this.slotContent[i];
      if (id) h = Math.max(h, this.samples.get(id)!.height * (this.slots[i].userData.scale ?? 1));
    }
    return this.heroRoot.position.y + h * 0.85;
  }

  /** Vista ampliada real: câmera secundária mira o ponto sob a lente com FOV reduzido pelo zoom. */
  private renderLens(P: THREE.Vector3, zoom: number) {
    const r = this.engine.renderer;
    const cam = this.engine.camera;
    const lens = this.mag.lens;
    const lc = this.mag.cam;
    const dist = cam.position.distanceTo(lens.position);
    const natural = 2 * Math.atan(LENS_R / Math.max(0.05, dist));
    lc.fov = THREE.MathUtils.radToDeg(natural / (1 + zoom * 0.9));
    lc.position.copy(cam.position);
    lc.up.set(0, 1, 0);
    lc.lookAt(P);
    lc.near = 0.01;
    lc.updateProjectionMatrix();
    const prevT = r.getRenderTarget();
    lens.visible = false;
    this.lamp.cone.visible = false;
    r.setRenderTarget(this.mag.rt);
    r.render(this.engine.scene, lc);
    r.setRenderTarget(prevT);
    lens.visible = true;
    this.lamp.cone.visible = this.lampLevel > 0.01;
  }

  /** Estado vivo (para depuração e testes de navegador). */
  debug() {
    return {
      az: this.az,
      el: this.el,
      rot: this.rot,
      lampLevel: this.lampLevel,
      magT: this.magT,
      slots: [...this.slotContent],
      view: this.viewName,
      spotPos: this.lamp.spot.getWorldPosition(new THREE.Vector3()).toArray(),
    };
  }

  dispose() {
    this.textures.forEach((t) => t.dispose());
    this.mag?.dispose();
    this.tags.forEach((t) => {
      t.normal.dispose();
      t.chosen.dispose();
    });
    this.envScene?.traverse((o) => {
      const m = o as THREE.Mesh;
      m.geometry?.dispose();
      (m.material as THREE.Material | undefined)?.dispose?.();
    });
  }
}
