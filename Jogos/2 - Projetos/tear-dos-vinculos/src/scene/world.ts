// Mundo 3D: monta cena, luz, câmera, visões nomeadas, animações das ferramentas e picking.
// Módulo com init/resize/pause/resume/dispose; recebe o estado e nunca o altera diretamente.
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RectAreaLightUniformsLib } from 'three/examples/jsm/lights/RectAreaLightUniformsLib.js';
import { YARNS, yarnById, type Crossing } from '../game/content.ts';
import { suggestedCrossing } from '../game/rules.ts';
import type { RowEntity, SceneState } from '../game/state.ts';
import { warpX } from '../sim/weavePath.ts';
import { Engine } from './engine.ts';
import { FabricView } from './fabric.ts';
import { LOOM, buildComb, buildLoom, buildShuttle, type LoomParts } from './loom.ts';
import { createMaterials, type MaterialKit } from './materials.ts';
import {
  buildBasket,
  buildBowl,
  buildFoldedCloths,
  buildLavenderVase,
  buildNeedle,
  buildScissors,
  buildSpool,
  buildTable,
  buildTag,
  buildTape,
  buildToolJar,
  buildYarnBall,
  contactShadow,
  type Scissors,
  type Tag,
} from './props.ts';
import { buildRoom, type RoomParts } from './room.ts';
import { setMaxAnisotropy } from './textures.ts';

export type ViewId = 'geral' | 'cruzamento' | 'tecido' | 'novelos';

export type PickResult =
  | { kind: 'yarn'; yarnId: string }
  | { kind: 'chip'; crossing: Crossing }
  | { kind: 'shuttle' }
  | { kind: 'pulley' }
  | { kind: 'row'; rowId: string }
  | { kind: 'end'; endId: string }
  | { kind: 'tool'; tool: 'pente' | 'tesoura' | 'agulha' };

interface Anim {
  t: number;
  dur: number;
  update: (k: number) => void;
  done?: () => void;
}

export const LOOM_POS = new THREE.Vector3(0.18, 0, -0.62);

const ease = (k: number) => (k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2);

export class World {
  readonly engine: Engine;
  readonly scene = new THREE.Scene();
  readonly camera: THREE.PerspectiveCamera;
  readonly controls: OrbitControls;
  readonly kit: MaterialKit;
  readonly loom: LoomParts;
  readonly fabric: FabricView;
  readonly room: RoomParts;
  private shuttle: { root: THREE.Group; bobbin: THREE.Mesh };
  private comb: THREE.Group;
  private scissors: Scissors;
  private needle: THREE.Group;
  private balls = new Map<string, THREE.Mesh>();
  private ballHome = new Map<string, THREE.Vector3>();
  private tags = new Map<string, Tag>();
  private selectRing: THREE.Mesh;
  private hitTargets: THREE.Object3D[] = [];
  private raycaster = new THREE.Raycaster();
  private anims: Anim[] = [];
  private combHome = new THREE.Matrix4();
  private scissorsHome = new THREE.Matrix4();
  private needleHome = new THREE.Matrix4();
  private shuttleX = 0;
  private shuttleTargetX = 0;
  readonly sun: THREE.DirectionalLight;
  private state: SceneState | null = null;
  private time = 0;
  private hovered: THREE.Object3D | null = null;
  private envRT: THREE.WebGLRenderTarget | null = null;
  reducedMotion = false;
  paused = false;
  /** sinalizado quando algo que projeta sombra se moveu */
  private shadowDirty = true;
  private view: ViewId = 'geral';
  private camAnim: Anim | null = null;
  private camLast = 0;
  private tensionShown = 0.55;

  constructor(host: HTMLElement, lite: boolean) {
    this.engine = new Engine(host);
    setMaxAnisotropy(this.engine.renderer.capabilities.getMaxAnisotropy());
    this.camera = new THREE.PerspectiveCamera(38, innerWidth / innerHeight, 0.05, 120);
    this.camera.name = 'camera';
    this.kit = createMaterials(lite);
    const s = this.scene;
    s.background = new THREE.Color('#E9D6B4');
    s.fog = new THREE.Fog('#E6D3B2', 9, 46);

    // Luz principal motivada: sol de fim de tarde entrando pelo arco do terraço.
    RectAreaLightUniformsLib.init();
    // Sol de fim de tarde entrando pela lateral aberta (loggia à direita): luz rasante e quente.
    const sun = new THREE.DirectionalLight('#FFD49C', 3.8);
    sun.name = 'sol';
    const sunTarget = new THREE.Vector3(0.18, 1.0, -0.62);
    const sunDir = new THREE.Vector3(0.8, 0.5, 0.38).normalize();
    sun.position.copy(sunTarget).addScaledVector(sunDir, 9);
    sun.target.position.copy(sunTarget);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    sun.shadow.camera.left = -2.6; sun.shadow.camera.right = 2.6;
    sun.shadow.camera.top = 2.2; sun.shadow.camera.bottom = -2.2;
    sun.shadow.camera.near = 3; sun.shadow.camera.far = 16;
    sun.shadow.bias = -0.00025;
    sun.shadow.normalBias = 0.012;
    sun.shadow.radius = 3;
    s.add(sun, sun.target);
    this.sun = sun;
    const hemi = new THREE.HemisphereLight('#F6E7CC', '#7A4A2E', 0.6);
    hemi.name = 'ceu_hemisferio';
    s.add(hemi);
    // Abertura do arco e janela emitem luz difusa para dentro (área retangular).
    const archLight = new THREE.RectAreaLight('#FFE6C2', 3.2, 1.3, 2.2);
    archLight.name = 'luz_arco';
    archLight.position.set(1.72, 1.2, -1.6);
    archLight.lookAt(0.6, 1.0, 1.0);
    s.add(archLight);
    const winLight = new THREE.RectAreaLight('#FFEBD0', 2.2, 0.9, 1.4);
    winLight.name = 'luz_janela';
    winLight.position.set(-1.15, 1.75, -1.6);
    winLight.lookAt(-0.4, 1.0, 1.0);
    s.add(winLight);
    // Janela lateral esquerda: luz difusa de céu sobre a bancada (sem sombra, barata).
    const sideLight = new THREE.DirectionalLight('#FFF0DA', 1.5);
    sideLight.name = 'luz_janela_lateral';
    sideLight.position.set(-6, 3.6, 1.6);
    sideLight.target.position.set(-0.2, 0.8, 0.2);
    s.add(sideLight, sideLight.target);
    const sideArea = new THREE.RectAreaLight('#FFF1DE', 2.6, 0.9, 1.4);
    sideArea.name = 'luz_area_janela_lateral';
    sideArea.position.set(-2.55, 1.7, 0.55);
    sideArea.lookAt(0, 1.0, 0.4);
    s.add(sideArea);
    // Rebatimento quente da bancada e paredes (sem sombra).
    const bounce = new THREE.DirectionalLight('#FFD9B0', 0.45);
    bounce.name = 'rebatimento';
    bounce.position.set(-1, 2.2, 4);
    s.add(bounce);

    this.room = buildRoom(this.kit, lite);
    s.add(this.room.root);

    this.loom = buildLoom(this.kit, 18);
    this.loom.root.position.copy(LOOM_POS);
    s.add(this.loom.root);
    this.fabric = new FabricView(this.kit, 18, lite);
    this.loom.root.add(this.fabric.group);
    const loomShadow = contactShadow(0.9, 0.5);
    loomShadow.scale.set(1.1, 0.7, 1);
    loomShadow.position.set(0, 0.003, -0.18);
    this.loom.root.add(loomShadow);

    this.shuttle = buildShuttle(this.kit);
    this.loom.root.add(this.shuttle.root);

    // Bancada principal e objetos
    const table = buildTable(this.kit, 2.75, 0.78, 0.74, 'bancada');
    table.position.set(-0.25, 0, 0.12);
    s.add(table);
    const side = buildTable(this.kit, 0.8, 0.6, 0.72, 'aparador');
    side.position.set(1.72, 0, -0.05);
    s.add(side);
    const TOP = 0.74;

    const basket = buildBasket(this.kit);
    basket.position.set(-0.98, TOP, 0.06);
    s.add(basket);
    const bs = contactShadow(0.33, 0.55);
    bs.position.set(-0.98, TOP + 0.002, 0.06);
    s.add(bs);
    const ballPos: [number, number, number][] = [
      [-0.1, 0.075, 0.08], [0.08, 0.072, 0.1], [0.12, 0.078, -0.08], [-0.06, 0.08, -0.12], [-0.17, 0.07, -0.02], [0.0, 0.16, -0.01],
    ];
    YARNS.forEach((y, i) => {
      const b = buildYarnBall(this.kit, y.id, i + 1, 0.068, lite);
      const p = new THREE.Vector3(...ballPos[i]).add(basket.position);
      b.position.copy(p);
      b.userData.yarnId = y.id;
      s.add(b);
      this.balls.set(y.id, b);
      this.ballHome.set(y.id, p.clone());
      const hit = new THREE.Mesh(new THREE.SphereGeometry(0.08, 10, 8), new THREE.MeshBasicMaterial({ visible: false }));
      hit.name = `hit_novelo_${y.id}`;
      hit.userData.pick = { kind: 'yarn', yarnId: y.id } satisfies PickResult;
      b.add(hit);
      this.hitTargets.push(hit);
      const tag = buildTag(this.kit, y.nome, '');
      tag.root.position.set(p.x + (i % 2 ? 0.1 : -0.1), p.y + 0.03, p.z + 0.08);
      tag.root.rotation.set(-0.5, (i - 2.5) * 0.12, (i % 2 ? -0.25 : 0.25));
      tag.root.visible = false;
      s.add(tag.root);
      this.tags.set(y.id, tag);
    });
    this.selectRing = new THREE.Mesh(new THREE.TorusGeometry(0.082, 0.0035, 8, 48), new THREE.MeshBasicMaterial({ color: '#FFD27A', transparent: true, opacity: 0.9, toneMapped: false }));
    this.selectRing.name = 'selecao_novelo';
    this.selectRing.rotation.x = Math.PI / 2;
    s.add(this.selectRing);

    const jar = buildToolJar(this.kit);
    jar.position.set(-0.52, TOP, -0.14);
    s.add(jar);
    this.comb = buildComb(this.kit);
    this.comb.position.set(-0.36, TOP + 0.012, 0.26);
    this.comb.rotation.set(-Math.PI / 2, 0, 0.35);
    s.add(this.comb);
    this.combHome.copy(this.comb.matrix.compose(this.comb.position, this.comb.quaternion, this.comb.scale));
    this.scissors = buildScissors(this.kit);
    this.scissors.root.position.set(-0.05, TOP + 0.004, 0.36);
    this.scissors.root.rotation.y = 0.5;
    s.add(this.scissors.root);
    this.scissorsHome.compose(this.scissors.root.position, this.scissors.root.quaternion, this.scissors.root.scale);
    this.needle = buildNeedle(this.kit);
    this.needle.position.set(0.26, TOP + 0.004, 0.3);
    this.needle.rotation.set(0, -0.3, -Math.PI / 2);
    s.add(this.needle);
    this.needleHome.compose(this.needle.position, this.needle.quaternion, this.needle.scale);
    const tape = buildTape();
    tape.position.set(-0.72, TOP + 0.001, 0.42);
    tape.rotation.y = 0.15;
    s.add(tape);
    const bowl = buildBowl(this.kit);
    bowl.position.set(0.62, TOP, 0.2);
    s.add(bowl);
    const spool = buildSpool(this.kit, 'linho', 0.08);
    spool.position.set(0.6, TOP + 0.01, 0.18);
    spool.rotation.z = 1.3;
    spool.position.y += 0.04;
    s.add(spool);
    for (const [x, z, id] of [[0.88, 0.0, 'telha'], [0.98, 0.14, 'mostarda']] as [number, number, string][]) {
      const sp = buildSpool(this.kit, id, 0.09);
      sp.position.set(x, TOP, z);
      s.add(sp);
    }
    const cloths = buildFoldedCloths(this.kit);
    cloths.position.set(1.82, 0.72, 0.02);
    cloths.rotation.y = -0.3;
    s.add(cloths);
    const vase = buildLavenderVase(this.kit, 1, 1.25);
    vase.position.set(1.52, 0.72, -0.18);
    s.add(vase);
    const vase2 = buildLavenderVase(this.kit, 2, 1.6);
    vase2.position.set(-2.2, 0, 0.9);
    s.add(vase2);
    for (const [obj, r] of [[jar, 0.09], [bowl, 0.14], [vase, 0.12], [cloths, 0.3]] as [THREE.Object3D, number][]) {
      const cs = contactShadow(r, 0.45);
      cs.position.set(obj.position.x, obj.position.y + 0.002, obj.position.z);
      s.add(cs);
    }

    // Alvos de ferramentas (separados dos visuais)
    const hitBox = (w: number, h: number, d: number, pick: PickResult, at: THREE.Object3D) => {
      const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), new THREE.MeshBasicMaterial({ visible: false }));
      m.userData.pick = pick;
      m.position.copy(at.position);
      m.name = `hit_${'tool' in pick ? pick.tool : pick.kind}`;
      s.add(m);
      this.hitTargets.push(m);
    };
    hitBox(0.24, 0.05, 0.14, { kind: 'tool', tool: 'pente' }, this.comb);
    hitBox(0.26, 0.05, 0.12, { kind: 'tool', tool: 'tesoura' }, this.scissors.root);
    hitBox(0.22, 0.04, 0.06, { kind: 'tool', tool: 'agulha' }, this.needle);
    const shHit = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.07, 0.08), new THREE.MeshBasicMaterial({ visible: false }));
    shHit.userData.pick = { kind: 'shuttle' } satisfies PickResult;
    shHit.name = 'hit_lancadeira';
    this.shuttle.root.add(shHit);
    this.hitTargets.push(shHit);
    this.loom.hitPulley.userData.pick = { kind: 'pulley' } satisfies PickResult;
    this.hitTargets.push(this.loom.hitPulley);
    this.fabric.chipOver.userData.pick = { kind: 'chip', crossing: 'over' } satisfies PickResult;
    this.fabric.chipUnder.userData.pick = { kind: 'chip', crossing: 'under' } satisfies PickResult;

    this.scene.traverse((o) => {
      const m = o as THREE.Mesh;
      if (m.isMesh && m.castShadow === undefined) m.castShadow = true;
    });
    this.room.root.traverse((o) => { if ((o as THREE.Mesh).isMesh && o.name.startsWith('campo')) o.castShadow = false; });

    this.engine.attach(this.scene, this.camera);
    this.buildEnvironment();

    this.controls = new OrbitControls(this.camera, this.engine.canvas);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.08;
    this.controls.minDistance = 0.32;
    this.controls.maxDistance = 3.4;
    this.controls.minPolarAngle = 0.55;
    this.controls.maxPolarAngle = 1.66;
    this.controls.minAzimuthAngle = -0.95;
    this.controls.maxAzimuthAngle = 0.75;
    this.controls.screenSpacePanning = true;
    this.controls.zoomToCursor = true;
    this.controls.addEventListener('change', () => this.clampCamera());
    this.setView('geral', true);
  }

  /** PMREM do próprio ateliê simplificado: paredes quentes e aberturas claras. */
  private buildEnvironment(): void {
    const envScene = new THREE.Scene();
    const box = new THREE.Mesh(new THREE.BoxGeometry(8, 4, 6), new THREE.MeshBasicMaterial({ color: '#8E6A4C', side: THREE.BackSide }));
    box.position.y = 1.5;
    envScene.add(box);
    const floorM = new THREE.Mesh(new THREE.PlaneGeometry(8, 6), new THREE.MeshBasicMaterial({ color: '#7A4630' }));
    floorM.rotation.x = -Math.PI / 2;
    floorM.position.y = -0.49;
    envScene.add(floorM);
    const opening = (x: number, w: number, h: number, y: number, c: string, k: number) => {
      const p = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: new THREE.Color(c).multiplyScalar(k) }));
      p.position.set(x, y, -2.95);
      envScene.add(p);
    };
    opening(1.7, 1.4, 2.4, 0.7, '#FFE7C4', 5);
    opening(-1.1, 1, 1.5, 1.2, '#FFF0D8', 3.5);
    const ceiling = new THREE.Mesh(new THREE.PlaneGeometry(8, 6), new THREE.MeshBasicMaterial({ color: '#C9A57E' }));
    ceiling.rotation.x = Math.PI / 2;
    ceiling.position.y = 3.4;
    envScene.add(ceiling);
    const pmrem = new THREE.PMREMGenerator(this.engine.renderer);
    this.envRT = pmrem.fromScene(envScene, 0.035);
    this.scene.environment = this.envRT.texture;
    this.scene.environmentIntensity = 0.55;
    pmrem.dispose();
    envScene.traverse((o) => { const m = o as THREE.Mesh; if (m.isMesh) { m.geometry.dispose(); (m.material as THREE.Material).dispose(); } });
  }

  // ---------- câmera ----------

  private isPortrait(): boolean {
    return innerHeight > innerWidth * 1.05;
  }

  private loomPoint(x: number, y: number, z: number): THREE.Vector3 {
    return new THREE.Vector3(x, y, z).add(LOOM_POS);
  }

  viewPose(v: ViewId): { pos: THREE.Vector3; target: THREE.Vector3; fov: number } {
    const portrait = this.isPortrait();
    const fell = this.fabric.info.activeY;
    switch (v) {
      case 'cruzamento': {
        const s = this.state;
        const w = s ? this.fabric.nextCrossingWarp(s) : null;
        const x = w === null ? 0 : warpX(this.fabric.layout, w);
        const t = this.loomPoint(x * 0.8, fell + 0.03, 0);
        return { target: t, pos: t.clone().add(new THREE.Vector3(-0.1, 0.08, portrait ? 0.95 : 0.46)), fov: portrait ? 70 : 36 };
      }
      case 'tecido': {
        const mid = (LOOM.fabricBase + Math.max(fell, LOOM.fabricBase + 0.12)) / 2;
        const t = this.loomPoint(0, mid + 0.02, 0);
        return { target: t, pos: t.clone().add(new THREE.Vector3(0.0, 0.1, portrait ? 1.7 : 0.86)), fov: portrait ? 76 : 36 };
      }
      case 'novelos': {
        const t = new THREE.Vector3(-0.95, 0.84, 0.06);
        return { target: t, pos: new THREE.Vector3(-0.62, 1.35, portrait ? 1.2 : 0.82), fov: portrait ? 72 : 40 };
      }
      case 'geral':
      default:
        if (portrait) return { target: this.loomPoint(0, 1.02, 0), pos: new THREE.Vector3(-0.08, 1.48, 1.5), fov: 78 };
        return { target: new THREE.Vector3(0.02, 1.06, -0.6), pos: new THREE.Vector3(-0.44, 1.28, 0.74), fov: 46 };
    }
  }

  /** No retrato, desloca o centro óptico para cima: a zona de manipulação fica acima do bottom sheet. */
  private applyViewOffset(): void {
    const w = Math.max(1, this.engine.canvas.clientWidth || innerWidth);
    const h = Math.max(1, this.engine.canvas.clientHeight || innerHeight);
    if (this.isPortrait()) this.camera.setViewOffset(w, h * 1.42, 0, h * 0.42, w, h);
    else this.camera.clearViewOffset();
    this.camera.updateProjectionMatrix();
  }

  setView(v: ViewId, instant = false): void {
    this.view = v;
    this.applyViewOffset();
    const pose = this.viewPose(v);
    const fromPos = this.camera.position.clone();
    const fromT = this.controls?.target.clone() ?? pose.target.clone();
    const fromFov = this.camera.fov;
    if (instant || this.reducedMotion) {
      this.camera.position.copy(pose.pos);
      this.controls?.target.copy(pose.target);
      this.camera.fov = pose.fov;
      this.camera.updateProjectionMatrix();
      this.controls?.update();
      return;
    }
    this.camLast = performance.now();
    this.camAnim = {
      t: 0,
      dur: 1.0,
      update: (k) => {
        const e = ease(k);
        this.camera.position.lerpVectors(fromPos, pose.pos, e);
        this.controls.target.lerpVectors(fromT, pose.target, e);
        this.camera.fov = fromFov + (pose.fov - fromFov) * e;
        this.camera.updateProjectionMatrix();
      },
    };
  }

  get currentView(): ViewId { return this.view; }

  /** Câmera não atravessa a urdidura, paredes ou o piso. */
  private clampCamera(): void {
    const c = this.camera.position;
    c.y = THREE.MathUtils.clamp(c.y, 0.82, 2.9);
    c.x = THREE.MathUtils.clamp(c.x, -2.4, 2.6);
    c.z = THREE.MathUtils.clamp(c.z, LOOM_POS.z + 0.16, 3.4);
    const t = this.controls.target;
    t.x = THREE.MathUtils.clamp(t.x, -1.6, 1.8);
    t.y = THREE.MathUtils.clamp(t.y, 0.6, 1.9);
    t.z = THREE.MathUtils.clamp(t.z, -1.0, 0.9);
  }

  resize(): void {
    this.engine.resize();
    this.applyViewOffset();
    if (!this.camAnim) {
      const pose = this.viewPose(this.view);
      this.camera.fov = pose.fov;
      this.camera.updateProjectionMatrix();
    }
  }

  // ---------- estado ----------

  sync(s: SceneState, instant = false): void {
    const warpChanged = !this.state || this.state.warpCount !== s.warpCount;
    this.state = s;
    if (warpChanged) this.loom.rebuildWarps(s.warpCount);
    this.fabric.sync(s, instant);
    // Cala: fios cruzados abrem conforme a escolha; os demais seguem a sugestão (meia abertura).
    const signs = new Array<number>(s.warpCount).fill(0);
    const sug = this.suggestionFor(s);
    for (let w = 0; w < s.warpCount; w++) signs[w] = sug[w] === 'over' ? -0.35 : 0.35;
    if (s.active) {
      for (let i = 0; i < s.active.crossings.length; i++) {
        const w = s.active.direction === 1 ? i : s.warpCount - 1 - i;
        signs[w] = s.active.crossings[i] === 'over' ? -1 : 1;
      }
    }
    this.loom.setWarpPattern(signs);
    this.loom.warpUniforms.uFell.value = this.fabric.info.fellY;
    // novelo escolhido e bobina da lançadeira
    const yarn = s.active?.yarnId ?? s.selectedYarn;
    this.shuttle.bobbin.material = this.kit.yarn.get(yarn)!;
    for (const [id, tag] of this.tags) {
      const name = s.names[id];
      tag.root.visible = Boolean(name);
      if (name) tag.setText(name, yarnById(id).nome);
    }
    this.shuttleTargetX = this.shuttleRestX(s);
    this.shadowDirty = true;
  }

  private suggestionFor(s: SceneState): Crossing[] {
    const out: Crossing[] = [];
    let probe: SceneState = s;
    // sugestão por fio para a passada corrente (sem alterar o estado)
    const idx = s.active ? s.active.crossings.length : 0;
    for (let w = 0; w < s.warpCount; w++) out.push(((w + idx) % 2 === 0) ? 'over' : 'under');
    const c = suggestedCrossing(probe);
    if (c) {
      const dir = s.active?.direction ?? nextDir(s);
      const next = dir === 1 ? idx : s.warpCount - 1 - idx;
      out[next] = c;
    }
    probe = s;
    return out;
  }

  private shuttleRestX(s: SceneState): number {
    const n = s.warpCount;
    const idx = s.active ? s.active.crossings.length : 0;
    const dir = s.active?.direction ?? nextDir(s);
    if (!s.active || idx === 0) return dir === 1 ? warpX(this.fabric.layout, 0) - 0.17 : warpX(this.fabric.layout, n - 1) + 0.17;
    const w = dir === 1 ? idx : n - 1 - idx;
    const gap = this.fabric.layout.width / n;
    return warpX(this.fabric.layout, Math.max(0, Math.min(n - 1, w))) - dir * gap * 0.5 + dir * 0.13;
  }

  /** Lançadeira acompanha o arraste (coordenada x local do tear). */
  dragShuttleTo(x: number): void {
    this.shuttleTargetX = THREE.MathUtils.clamp(x, -0.7, 0.7);
  }

  get shuttleLocalX(): number { return this.shuttleX; }

  /** Converte um raio de tela em x local do plano da urdidura. */
  pointerToLoomX(ndc: THREE.Vector2): number | null {
    this.raycaster.setFromCamera(ndc, this.camera);
    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), -LOOM_POS.z - 0.02);
    const p = new THREE.Vector3();
    if (!this.raycaster.ray.intersectPlane(plane, p)) return null;
    return p.x - LOOM_POS.x;
  }

  setTensionVisual(t: number): void {
    this.tensionShown = t;
  }

  setSelectedYarn(id: string): void {
    const b = this.balls.get(id);
    if (!b) return;
    this.selectRing.position.set(b.position.x, b.position.y - 0.045, b.position.z);
  }

  // ---------- picking ----------

  pick(ndc: THREE.Vector2): PickResult | null {
    this.raycaster.setFromCamera(ndc, this.camera);
    const sprites = [this.fabric.chipOver, this.fabric.chipUnder].filter((c) => c.visible);
    const chipHit = this.raycaster.intersectObjects(sprites, false)[0];
    if (chipHit) return chipHit.object.userData.pick as PickResult;
    const ends = this.fabric.group.children.filter((o) => o.userData.endId);
    const rows = this.fabric.rowMeshes();
    const hits = this.raycaster.intersectObjects([...this.hitTargets, ...ends, ...rows], false);
    for (const h of hits) {
      const o = h.object;
      if (o.userData.pick) return o.userData.pick as PickResult;
      if (o.userData.endId) return { kind: 'end', endId: o.userData.endId };
      if (o.userData.rowId) return { kind: 'row', rowId: o.userData.rowId };
    }
    return null;
  }

  hover(ndc: THREE.Vector2 | null): PickResult | null {
    const r = ndc ? this.pick(ndc) : null;
    const ball = r?.kind === 'yarn' ? this.balls.get(r.yarnId) ?? null : null;
    if (this.hovered !== ball) {
      if (this.hovered) this.hovered.scale.setScalar(1);
      if (ball) ball.scale.setScalar(1.06);
      this.hovered = ball;
    }
    return r;
  }

  // ---------- animações de ferramentas (não bloqueiam pausa nem saída) ----------

  private play(a: Anim): void { this.anims.push(a); }

  private flyTool(obj: THREE.Object3D, home: THREE.Matrix4, path: (k: number, pos: THREE.Vector3, q: THREE.Quaternion) => void, dur: number, onDone?: () => void): void {
    const hp = new THREE.Vector3(), hq = new THREE.Quaternion(), hs = new THREE.Vector3();
    home.decompose(hp, hq, hs);
    if (this.reducedMotion) { onDone?.(); return; }
    this.play({
      t: 0, dur,
      update: (k) => {
        const p = new THREE.Vector3(), q = new THREE.Quaternion();
        path(k, p, q);
        // ida (0–0.25), ação (0.25–0.75), volta (0.75–1)
        const out = k < 0.25 ? ease(k / 0.25) : k > 0.75 ? 1 - ease((k - 0.75) / 0.25) : 1;
        obj.position.lerpVectors(hp, p, out);
        obj.quaternion.slerpQuaternions(hq, q, out);
        this.shadowDirty = true;
      },
      done: () => { obj.position.copy(hp); obj.quaternion.copy(hq); onDone?.(); },
    });
  }

  /** Pente bate a fileira recém-concluída contra o tecido. */
  beat(onContact?: () => void): void {
    const fell = this.fabric.info.fellY;
    let fired = false;
    const q = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 0));
    this.flyTool(this.comb, this.combHome, (k, p, qq) => {
      const local = new THREE.Vector3(0, fell + 0.075, 0.05);
      const press = k > 0.3 && k < 0.7 ? Math.sin(((k - 0.3) / 0.4) * Math.PI * 2) : 0;
      local.y -= Math.max(0, press) * 0.05;
      local.z -= Math.max(0, press) * 0.03;
      if (!fired && k > 0.42) { fired = true; onContact?.(); }
      p.copy(local).add(LOOM_POS);
      qq.copy(q);
    }, 1.1);
    if (this.reducedMotion) onContact?.();
  }

  snip(localY: number, onCut?: () => void): void {
    let cuts = 0;
    const q = new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.PI / 2, Math.PI, 0.1));
    const x = -LOOM.warpWidth / 2 - 0.05;
    this.flyTool(this.scissors.root, this.scissorsHome, (k, p, qq) => {
      p.set(x + LOOM_POS.x + (k > 0.25 && k < 0.75 ? (k - 0.25) * 0.5 : 0), localY, LOOM_POS.z + 0.05);
      qq.copy(q);
      const open = k > 0.25 && k < 0.75 ? 0.12 + Math.abs(Math.sin((k - 0.25) * Math.PI * 4)) * 0.5 : 0.12;
      this.scissors.setOpen(open);
      if (k > 0.35 + cuts * 0.12 && cuts < 3) { cuts++; onCut?.(); }
    }, 1.6);
    if (this.reducedMotion) onCut?.();
  }

  tuck(endId: string, onDone?: () => void): void {
    const at = new THREE.Vector3();
    if (!this.fabric.endPosition(endId, at)) { onDone?.(); return; }
    const q = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, at.x < 0 ? -Math.PI / 2 - 0.5 : Math.PI / 2 + 0.5));
    this.flyTool(this.needle, this.needleHome, (k, p, qq) => {
      const wig = k > 0.25 && k < 0.75 ? Math.sin((k - 0.25) * Math.PI * 4) * 0.02 : 0;
      p.copy(at).add(LOOM_POS).add(new THREE.Vector3(at.x < 0 ? -0.06 : 0.06, -0.01 + wig, 0.03));
      qq.copy(q);
    }, 1.2, onDone);
  }

  /** Pulso visual do nó apertando. */
  knotPulse(): void {
    if (this.reducedMotion) return;
    const g = this.fabric.group;
    this.play({ t: 0, dur: 0.5, update: (k) => { const s = 1 + Math.sin(k * Math.PI) * 0.02; g.scale.set(1, 1, s); }, done: () => g.scale.set(1, 1, 1) });
  }

  /** Captura apenas do tecido para exportar a composição. */
  captureFabric(): string {
    const prev = this.view;
    const pose = this.viewPose('tecido');
    const savePos = this.camera.position.clone();
    const saveT = this.controls.target.clone();
    const saveFov = this.camera.fov;
    this.camera.position.copy(pose.pos);
    this.camera.fov = pose.fov;
    this.camera.lookAt(pose.target);
    this.camera.updateProjectionMatrix();
    this.fabric.chipOver.visible = this.fabric.chipUnder.visible = this.fabric.nextRing.visible = false;
    const url = this.engine.capture();
    this.camera.position.copy(savePos);
    this.controls.target.copy(saveT);
    this.camera.fov = saveFov;
    this.camera.updateProjectionMatrix();
    this.controls.update();
    this.view = prev;
    return url;
  }

  // ---------- quadro ----------

  update(dt: number): void {
    const s = this.state;
    if (!s) return;
    if (!this.paused) {
      this.time += dt;
      for (const a of [...this.anims]) {
        a.t += dt;
        const k = Math.min(1, a.t / a.dur);
        a.update(k);
        if (k >= 1) { this.anims.splice(this.anims.indexOf(a), 1); a.done?.(); }
      }
      // Lançadeira
      const k = this.reducedMotion ? 1 : 1 - Math.exp(-dt * 10);
      this.shuttleX += (this.shuttleTargetX - this.shuttleX) * k;
      const inShed = Boolean(s.active && s.active.crossings.length > 0 && s.active.crossings.length < s.warpCount);
      const y = this.fabric.info.activeY + (inShed ? 0.03 : 0.018);
      const z = inShed ? 0.0 : 0.045;
      this.shuttle.root.position.set(this.shuttleX, y, z);
      // Inclinada para a câmera: o barco e a bobina ficam legíveis.
      this.shuttle.root.rotation.set(inShed ? 0.55 : 1.0, 0, inShed ? 0 : 0.06);
      const dir = s.active?.direction ?? nextDir(s);
      this.fabric.shuttleTip.set(this.shuttleX - dir * 0.05, y, z);
      this.fabric.update(dt, s, this.reducedMotion);
      // Cala abre durante a passada
      const u = this.loom.warpUniforms;
      const targetOpen = LOOM.shedOpen * (0.6 + (1 - this.tensionShown) * 0.6) * (inShed || s.active ? 1 : 0.45);
      u.uOpen.value += (targetOpen - u.uOpen.value) * (1 - Math.exp(-dt * 6));
      u.uFell.value += (this.fabric.info.fellY - u.uFell.value) * (1 - Math.exp(-dt * 8));
      this.loom.heddleBar.position.z = 0.05 + u.uOpen.value * 0.8;
      // Roldanas e contrapeso seguem a tensão
      const tw = this.tensionShown;
      for (const p of this.loom.pulleys) p.rotation.x += ((tw * Math.PI * 3) - p.rotation.x) * (1 - Math.exp(-dt * 5));
      const wy = 1.24 - tw * 0.34;
      this.loom.counterweight.position.y += (wy - this.loom.counterweight.position.y) * (1 - Math.exp(-dt * 5));
      const ropeLen = LOOM.shedRodY - this.loom.counterweight.position.y;
      this.loom.tensionRope.scale.y = Math.max(0.05, ropeLen);
      this.loom.clothRoll.visible = this.fabric.info.shift > 0.001;
      const rs = 1 + this.fabric.info.shift * 0.45;
      this.loom.clothRoll.scale.set(rs, 1, rs);
      // Seleção do novelo
      const ringMat = this.selectRing.material as THREE.MeshBasicMaterial;
      ringMat.opacity = 0.55 + 0.35 * (0.5 + 0.5 * Math.sin(this.time * 3));
      this.room.update(this.time, this.camera);
      if (this.camAnim) {
        // Tempo de parede (limitado): a transição dura o mesmo em máquinas lentas.
        const now = performance.now();
        this.camAnim.t += Math.min(0.25, (now - (this.camLast || now)) / 1000);
        this.camLast = now;
        const kk = Math.min(1, this.camAnim.t / this.camAnim.dur);
        this.camAnim.update(kk);
        if (kk >= 1) this.camAnim = null;
      }
    }
    this.controls.update();
    // Sombras sob demanda: só quando algo que projeta sombra se moveu.
    // Fios finos (Verlet) não projetam sombra; só ferramentas e lançadeira em movimento invalidam o mapa.
    const moving = this.anims.length > 0 || Math.abs(this.shuttleTargetX - this.shuttleX) > 1e-4;
    if (this.shadowDirty || moving) { this.engine.invalidateShadows(); this.shadowDirty = false; }
  }

  render(frameMs: number): void {
    this.engine.render(frameMs);
  }

  /** Posição em pixels (CSS) de um alvo 3D — usada pelos testes de interação e pela acessibilidade. */
  screenPoint(target: 'chipOver' | 'chipUnder' | 'shuttle' | 'pulley' | `row:${string}` | `yarn:${string}`): { x: number; y: number } | null {
    let p: THREE.Vector3 | null = null;
    if (target === 'chipOver') p = this.fabric.chipOver.getWorldPosition(new THREE.Vector3());
    else if (target === 'chipUnder') p = this.fabric.chipUnder.getWorldPosition(new THREE.Vector3());
    else if (target === 'shuttle') p = this.shuttle.root.getWorldPosition(new THREE.Vector3());
    else if (target === 'pulley') p = this.loom.hitPulley.getWorldPosition(new THREE.Vector3());
    else if (target.startsWith('row:')) {
      const id = target.slice(4);
      const m = this.fabric.rowMeshes().find((o) => o.userData.rowId === id);
      const row = this.state?.fabric.find((e): e is RowEntity => e.kind === 'row' && e.id === id);
      if (m && row) {
        // Ponto sobre um grupo em que a passada está por cima (visível e clicável).
        let w = Math.floor(row.crossings.length / 2);
        for (let k = 0; k < row.crossings.length; k++) {
          const ww = Math.floor(row.crossings.length / 2) + (k % 2 ? -1 : 1) * Math.ceil(k / 2);
          const i = row.direction === 1 ? ww : row.crossings.length - 1 - ww;
          if (ww >= 0 && ww < row.crossings.length && row.crossings[i] === 'over') { w = ww; break; }
        }
        p = new THREE.Vector3(warpX(this.fabric.layout, w), m.position.y, 0.006).applyMatrix4(this.loom.root.matrixWorld);
      }
    } else if (target.startsWith('yarn:')) {
      const b = this.balls.get(target.slice(5));
      if (b) p = b.position.clone();
    }
    if (!p) return null;
    const v = p.project(this.camera);
    const r = this.engine.canvas.getBoundingClientRect();
    return { x: r.left + ((v.x + 1) / 2) * r.width, y: r.top + ((1 - v.y) / 2) * r.height };
  }

  pickableYarnScreen(id: string): THREE.Vector3 | null {
    const b = this.balls.get(id);
    return b ? b.position.clone().project(this.camera) : null;
  }

  lastRow(): RowEntity | null {
    const s = this.state;
    if (!s) return null;
    for (let i = s.fabric.length - 1; i >= 0; i--) { const e = s.fabric[i]; if (e.kind === 'row') return e; }
    return null;
  }

  dispose(): void {
    this.controls.dispose();
    this.scene.traverse((o) => {
      const m = o as THREE.Mesh;
      if (m.isMesh) {
        m.geometry?.dispose();
        const mats = Array.isArray(m.material) ? m.material : [m.material];
        for (const mm of mats) (mm as THREE.Material)?.dispose?.();
      }
    });
    for (const t of this.kit.textures) t.dispose();
    this.envRT?.dispose();
    this.engine.dispose();
  }
}

function nextDir(s: SceneState): 1 | -1 {
  for (let i = s.fabric.length - 1; i >= 0; i--) {
    const e = s.fabric[i];
    if (e.kind === 'row') return e.direction === 1 ? -1 : 1;
  }
  return 1;
}
