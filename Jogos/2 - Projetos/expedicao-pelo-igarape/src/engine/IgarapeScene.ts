/**
 * Main Three.js scene controller for Expedição pelo Igarapé.
 * Isolates all WebGL, fixed-timestep simulation, procedural environment,
 * camera rigs, input handling, and audio behind a clean imperative API.
 */

import * as THREE from 'three';
import {
  DOCK_ZONES,
  FAUNA_CATALOG,
  FaunaSpeciesId,
  RIVER_LENGTH,
  STRETCHES,
  getFaunaWorldPosition,
  getStretchForS,
  riverToWorld,
  sampleRiver,
  terrainHeightAt,
} from '../sim/river';
import {
  CanoeState,
  FramedFaunaResult,
  JournalPhotoEntry,
  SIM_FIXED_DT,
  SimInput,
  createEmptyInput,
  createInitialCanoeState,
  findFramedFauna,
  stepCanoePhysics,
  toggleDocking,
} from '../sim/physics';
import { MaterialLibrary, createMaterialLibrary } from './pbr';
import {
  CanoeRig,
  FaunaActor,
  buildCanoeRig,
  buildDockingStation,
  buildFaunaActor,
  buildSamaumaHero,
  createTaperedTube,
} from './model';
import { LightingRig, TimePresetId } from './lighting';
import {
  AtmosphereParticles,
  IgarapeWater,
  VolumetricSunbeams,
  WakeAndSplashSystem,
} from './effects';
import { IgarapeAudioEngine } from './audio';
import {
  QualityLevel,
  QualitySetting,
  RenderPipeline,
  detectQuality,
  scheduleAfterSoftwareDraw,
} from './quality';

export type GamePhase = 'title' | 'playing' | 'paused';
export type ToolMode = 'remar' | 'observar';
export type CameraViewMode = 'first_person' | 'external';

export interface HudSnapshot {
  phase: GamePhase;
  toolMode: ToolMode;
  cameraMode: CameraViewMode;
  timePreset: TimePresetId;
  qualitySetting: QualitySetting;
  activeQuality: QualityLevel;
  detectedQuality: QualityLevel;
  isSoftwareGl: boolean;
  gpuString: string;
  // Live canoe physics & river progress
  s: number;
  lateral: number;
  x: number;
  z: number;
  yaw: number;
  speedMs: number;
  currentSpeedMs: number;
  stretchId: number;
  stretchName: string;
  distanceTraveled: number;
  strokeCount: number;
  dockedZoneId: string | null;
  dockedZoneName: string | null;
  nearbyDockId: string | null;
  nearbyDockName: string | null;
  // Fauna observation & naturalist journal
  framedFauna: FramedFaunaResult | null;
  journal: JournalPhotoEntry[];
  // Audio & accessibility
  muted: boolean;
  volume: number;
  reducedMotion: boolean;
  // Diagnostics
  frameTimeMs: number;
  drawCalls: number;
  adaptiveScale: number;
}

export interface SceneCallbacks {
  onHudUpdate: (snapshot: HudSnapshot) => void;
  onStatusMessage: (message: string, tone?: 'info' | 'success' | 'warn') => void;
  onPhotoFlash: () => void;
  onContextLost: (lost: boolean) => void;
  onHotkeyToggleHud: () => void;
  onHotkeyEscape: () => void;
}

// Module-scope scratch objects for zero-GC render loop
const _v3A = new THREE.Vector3();
const _v3B = new THREE.Vector3();
const _v3C = new THREE.Vector3();
const _v3CamTarget = new THREE.Vector3();
const _v3LookTarget = new THREE.Vector3();
const _v3CamFwd = new THREE.Vector3();
const _mat4 = new THREE.Matrix4();
const _quat = new THREE.Quaternion();
const _scale = new THREE.Vector3();
const _euler = new THREE.Euler();
const _color = new THREE.Color();

/** Deterministic PRNG so rainforest placement is rich, natural, and reproducible */
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export class IgarapeScene {
  private container: HTMLElement;
  private callbacks: SceneCallbacks;

  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private pipeline: RenderPipeline;
  private mats: MaterialLibrary;
  private lighting: LightingRig;
  private water: IgarapeWater;
  private sunbeams: VolumetricSunbeams;
  private atmosphere: AtmosphereParticles;
  private wakes: WakeAndSplashSystem;
  private canoeRig: CanoeRig;
  private faunaActors: FaunaActor[] = [];
  private audio: IgarapeAudioEngine;

  private qualityProbe = detectQuality();
  private qualitySetting: QualitySetting = 'auto';

  private phase: GamePhase = 'title';
  private toolMode: ToolMode = 'remar';
  private cameraMode: CameraViewMode = 'first_person';
  private reducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  private canoeState: CanoeState = createInitialCanoeState();
  private input: SimInput = createEmptyInput();
  private journal: JournalPhotoEntry[] = [];
  private framedFauna: FramedFaunaResult | null = null;

  // Camera look / orbit offsets (smoothly damped)
  private lookYaw = 0;
  private lookPitch = -0.02;
  private targetLookYaw = 0;
  private targetLookPitch = -0.02;
  private extOrbitYaw = 0;
  private extOrbitPitch = 0.28;
  private extOrbitDist = 5.2;
  private currentFov = 54;

  // Pointer drag tracking
  private pointerDown = false;
  private pointerDragged = false;
  private pointerDownX = 0;
  private pointerDownY = 0;
  private lastPointerX = 0;
  private lastPointerY = 0;

  // Loop & timing state
  private rafId = 0;
  private timerId = 0;
  private disposed = false;
  private tabHidden = false;
  private contextLost = false;
  private lastTimeMs = 0;
  private simAccumulator = 0;
  private elapsed = 0;
  private hudThrottleTimer = 0;
  private wakeEmitTimer = 0;
  private lastShadowAnchor = new THREE.Vector2(999, 999);
  private lastFrameMs = 16.6;
  private muted = false;
  private volume = 0.65;

  // Disposable environment meshes
  private envDisposables: Array<{ dispose: () => void }> = [];
  private resizeObserver: ResizeObserver | null = null;
  private foliageUniforms = { uTime: { value: 0 }, uWind: { value: 1.0 } };

  constructor(container: HTMLElement, callbacks: SceneCallbacks, autostart = false) {
    this.container = container;
    this.callbacks = callbacks;
    this.phase = autostart ? 'playing' : 'title';

    const { detected, isSoftwareGl } = this.qualityProbe;
    this.renderer = new THREE.WebGLRenderer({
      antialias: false,
      powerPreference: 'high-performance',
      preserveDrawingBuffer: false,
    });
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.06;

    const canvas = this.renderer.domElement;
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.display = 'block';
    canvas.dataset.testid = 'igarape-canvas';
    container.appendChild(canvas);

    this.scene = new THREE.Scene();
    const w = Math.max(1, container.clientWidth || window.innerWidth);
    const h = Math.max(1, container.clientHeight || window.innerHeight);
    this.camera = new THREE.PerspectiveCamera(54, w / h, 0.14, 240);

    this.pipeline = new RenderPipeline(
      this.renderer,
      this.scene,
      this.camera,
      detected,
      isSoftwareGl
    );
    this.pipeline.resize(w, h);

    this.mats = createMaterialLibrary(this.renderer, isSoftwareGl);
    this.lighting = new LightingRig(
      this.scene,
      this.renderer,
      this.pipeline.getProfile().shadowMapSize
    );
    this.audio = new IgarapeAudioEngine();

    // Build Amazonian igarapé world
    this.water = new IgarapeWater(this.mats);
    this.scene.add(this.water.mesh);

    this.buildTerrainAndRainforest(isSoftwareGl);
    this.buildDockingStations();
    this.buildFauna();

    this.canoeRig = buildCanoeRig(this.mats);
    this.scene.add(this.canoeRig.root);

    this.sunbeams = new VolumetricSunbeams();
    this.scene.add(this.sunbeams.group);

    this.atmosphere = new AtmosphereParticles(this.mats, isSoftwareGl);
    this.scene.add(this.atmosphere.group);

    this.wakes = new WakeAndSplashSystem();
    this.scene.add(this.wakes.group);

    // Sync initial transforms & initial shadow pass
    this.syncCanoeTransform();
    this.updateFauna(0);
    this.lighting.update(0, this.canoeState.x, this.canoeState.z);
    this.updateCamera(1.0, true);
    this.refreshShadows();

    // Pre-warm shaders on GPU (skip on software WebGL for snappy boot)
    if (!isSoftwareGl) {
      this.renderer.compile(this.scene, this.camera);
    }

    this.bindEvents();
    this.pushHudSnapshot();

    this.lastTimeMs = performance.now();
    this.scheduleNextFrame();
  }

  private buildTerrainAndRainforest(isSoftwareGl: boolean) {
    const rand = mulberry32(91042);

    // 1. Continuous curved riverbank terrain matching terrainHeightAt(x, z)
    const segS = isSoftwareGl ? 96 : 140;
    const segW = 24;
    const positions: number[] = [];
    const uvs: number[] = [];
    const colors: number[] = [];
    const indices: number[] = [];

    for (let i = 0; i <= segS; i++) {
      const s = -16 + (i / segS) * (RIVER_LENGTH + 32);
      const sample = sampleRiver(s);
      for (let j = 0; j <= segW; j++) {
        const u = j / segW; // 0..1
        // Non-uniform spacing: denser near riverbanks for crisp shoreline contour
        const signed = u * 2 - 1;
        const lat = Math.sign(signed) * Math.pow(Math.abs(signed), 1.35) * 32;
        const wx = sample.center.x + sample.right.x * lat;
        const wz = sample.center.z + sample.right.z * lat;
        const wy = terrainHeightAt(wx, wz);

        positions.push(wx, wy, wz);
        uvs.push(wx * 0.24, wz * 0.24);

        // Deep humid Amazonian riverbank shading (darker wet margin + rich mossy earth)
        const wet = THREE.MathUtils.smoothstep(wy, -0.35, 0.48);
        const shade = THREE.MathUtils.lerp(0.24, 0.72, wet);
        const mossTint = wy > 0.16 && wy < 1.35 ? 1.15 : 0.94;
        colors.push(shade * 0.86, shade * mossTint, shade * 0.76);
      }
    }

    const stride = segW + 1;
    for (let i = 0; i < segS; i++) {
      for (let j = 0; j < segW; j++) {
        const a = i * stride + j;
        const b = (i + 1) * stride + j;
        const c = (i + 1) * stride + (j + 1);
        const d = i * stride + (j + 1);
        indices.push(a, d, b);
        indices.push(b, d, c);
      }
    }

    const terrainGeo = new THREE.BufferGeometry();
    terrainGeo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    terrainGeo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    terrainGeo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    terrainGeo.setIndex(indices);
    terrainGeo.computeVertexNormals();

    const terrainMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      vertexColors: true,
      map: this.mats.bankGround.map,
      normalMap: this.mats.bankGround.normalMap,
      normalScale: new THREE.Vector2(1.2, 1.2),
      roughnessMap: this.mats.bankGround.roughnessMap,
      roughness: 0.9,
      metalness: 0.0,
    });

    const terrainMesh = new THREE.Mesh(terrainGeo, terrainMat);
    terrainMesh.receiveShadow = true;
    terrainMesh.castShadow = false;
    this.scene.add(terrainMesh);
    this.envDisposables.push(terrainGeo, terrainMat);

    // 2. Shared wind-swaying foliage material (alpha-cutout cards)
    const leafMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      map: this.mats.tropicalLeafMap,
      alphaTest: 0.38,
      side: THREE.DoubleSide,
      roughness: 0.68,
      metalness: 0.0,
    });
    const attachWind = (mat: THREE.MeshStandardMaterial) => {
      mat.onBeforeCompile = (shader) => {
        shader.uniforms.uTime = this.foliageUniforms.uTime;
        shader.uniforms.uWind = this.foliageUniforms.uWind;
        shader.vertexShader = shader.vertexShader
          .replace(
            '#include <common>',
            `#include <common>
             uniform float uTime;
             uniform float uWind;`
          )
          .replace(
            '#include <begin_vertex>',
            `#include <begin_vertex>
             float sway = sin(uTime * 1.45 + position.x * 2.0 + position.y * 1.3) * 0.085 * uWind * uv.y;
             transformed.x += sway;
             transformed.z += sway * 0.6;`
          );
      };
    };
    attachWind(leafMat);

    const fernMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      map: this.mats.fernFrondMap,
      alphaTest: 0.35,
      side: THREE.DoubleSide,
      roughness: 0.72,
      metalness: 0.0,
    });
    attachWind(fernMat);
    this.envDisposables.push(leafMat, fernMat);

    // 3. Hero Samaúma buttress-root tree on left bank of Stretch 1 (exact mockup centerpiece!)
    const araraSpec = FAUNA_CATALOG.find((f) => f.id === 'arara_caninde')!;
    const araraPos = getFaunaWorldPosition(araraSpec, 0);
    const samaumaBase2D = riverToWorld(21.2, -7.2);
    const samaumaY = Math.max(0.12, terrainHeightAt(samaumaBase2D.x, samaumaBase2D.z));
    const samauma = buildSamaumaHero(
      this.mats,
      leafMat,
      new THREE.Vector3(samaumaBase2D.x, samaumaY, samaumaBase2D.z),
      new THREE.Vector3(araraPos.x, araraPos.y, araraPos.z)
    );
    this.scene.add(samauma);

    // Dedicated overhanging branches for Tucano-toco and Preguiça so they perch naturally
    const branchBarkMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      map: this.mats.mossyBark.map,
      normalMap: this.mats.mossyBark.normalMap,
      roughness: 0.92,
    });
    this.envDisposables.push(branchBarkMat);
    for (const speciesId of ['tucano_toco', 'preguica'] as const) {
      const sp = FAUNA_CATALOG.find((f) => f.id === speciesId)!;
      const p = getFaunaWorldPosition(sp, 0);
      const bankPt = riverToWorld(sp.s, sp.lateral < 0 ? -sampleRiver(sp.s).halfWidth - 2.6 : sampleRiver(sp.s).halfWidth + 2.6);
      const bPts = [
        new THREE.Vector3(bankPt.x, p.y + 0.65, bankPt.z),
        new THREE.Vector3((bankPt.x + p.x) * 0.5, p.y + 0.12, (bankPt.z + p.z) * 0.5),
        new THREE.Vector3(p.x, p.y - 0.05, p.z),
        new THREE.Vector3(p.x + (sp.lateral < 0 ? 1.2 : -1.2), p.y + 0.15, p.z - 0.4),
      ];
      const bGeo = createTaperedTube(bPts, 0.22, 0.05, 12, 6);
      const bMesh = new THREE.Mesh(bGeo, branchBarkMat);
      bMesh.castShadow = true;
      this.scene.add(bMesh);
      this.envDisposables.push(bGeo);
    }

    // 4. Instanced rainforest trunks flanking the entire igarapé corridor
    const trunkGeo = new THREE.CylinderGeometry(0.18, 0.36, 12.5, 7, 3);
    trunkGeo.translate(0, 6.25, 0);
    const trunkMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      map: this.mats.mossyBark.map,
      normalMap: this.mats.mossyBark.normalMap,
      roughnessMap: this.mats.mossyBark.roughnessMap,
      roughness: 0.92,
    });

    const treeCount = isSoftwareGl ? 150 : 210;
    const trunkInst = new THREE.InstancedMesh(trunkGeo, trunkMat, treeCount);
    trunkInst.castShadow = true;
    trunkInst.receiveShadow = true;

    // 5. Dense multi-tier Amazonian foliage: lush bankside wall + mid-story + overarching canopy
    const leafGeo = new THREE.PlaneGeometry(4.4, 4.4);
    const canopyCount = isSoftwareGl ? 680 : 960;
    const canopyInst = new THREE.InstancedMesh(leafGeo, leafMat, canopyCount);
    canopyInst.castShadow = false;
    canopyInst.receiveShadow = true;

    let canopyIdx = 0;
    const capyPos = getFaunaWorldPosition(FAUNA_CATALOG.find((f) => f.id === 'capivara')!, 0);

    for (let i = 0; i < treeCount; i++) {
      const s = -8 + (i / treeCount) * (RIVER_LENGTH + 18) + (rand() - 0.5) * 3.0;
      const sample = sampleRiver(s);
      const side = i % 2 === 0 ? -1 : 1;
      const depthBand = i % 3 === 0 ? 0.9 + rand() * 2.4 : 3.2 + rand() * 9.5;
      const lat = side * (sample.halfWidth + depthBand);
      const wx = sample.center.x + sample.right.x * lat;
      const wz = sample.center.z + sample.right.z * lat;

      // Keep the Capybara's sunlit clearing open and clear on the right bank at s≈26.5!
      const distToCapy = Math.hypot(wx - capyPos.x, wz - capyPos.z);
      const distToSamauma = Math.hypot(wx - samaumaBase2D.x, wz - samaumaBase2D.z);
      const finalLat =
        distToCapy < 3.6 || distToSamauma < 3.8 ? side * (sample.halfWidth + 7.2 + rand() * 5) : lat;
      const fx = sample.center.x + sample.right.x * finalLat;
      const fz = sample.center.z + sample.right.z * finalLat;
      const fy = terrainHeightAt(fx, fz) - 0.35;

      const scaleXZ = 0.72 + rand() * 1.15;
      const scaleY = 0.75 + rand() * 0.75;
      const lean = depthBand < 3.2 ? -side * (0.08 + rand() * 0.14) : (rand() - 0.5) * 0.08;

      _euler.set((rand() - 0.5) * 0.08, rand() * Math.PI * 2, lean);
      _quat.setFromEuler(_euler);
      _scale.set(scaleXZ, scaleY, scaleXZ);
      _mat4.compose(_v3A.set(fx, fy, fz), _quat, _scale);
      trunkInst.setMatrixAt(i, _mat4);

      const tint = 0.74 + rand() * 0.34;
      _color.setRGB(tint, tint * (0.98 + rand() * 0.08), tint * 0.88);
      trunkInst.setColorAt(i, _color);

      // Attach 3–4 multi-height foliage cards (mid-story green wall + upper crown)
      const cardsForTree = canopyIdx + 4 <= canopyCount ? (i % 2 === 0 ? 4 : 3) : 0;
      for (let c = 0; c < cardsForTree && canopyIdx < canopyCount; c++) {
        const isMidWall = c === 0;
        const crownY = isMidWall
          ? fy + 2.2 + rand() * 2.8
          : fy + 5.4 * scaleY + rand() * 4.4;
        const inward = isMidWall
          ? -side * (0.3 + rand() * 1.6)
          : -side * (1.2 + rand() * 4.2);
        const cx = fx + sample.right.x * inward + (rand() - 0.5) * 2.8;
        const cz = fz + sample.right.z * inward + (rand() - 0.5) * 2.8;
        const cs = isMidWall ? 0.95 + rand() * 0.75 : 1.15 + rand() * 1.15;

        _euler.set(-0.28 + (rand() - 0.5) * 0.8, rand() * Math.PI * 2, (rand() - 0.5) * 0.55);
        _quat.setFromEuler(_euler);
        _scale.set(cs, cs, cs);
        _mat4.compose(_v3A.set(cx, crownY, cz), _quat, _scale);
        canopyInst.setMatrixAt(canopyIdx, _mat4);

        // Deep emerald understory -> warm sunlit chartreuse high canopy
        const lightness = isMidWall ? 0.24 + rand() * 0.16 : 0.34 + rand() * 0.24;
        _color.setHSL(0.24 + rand() * 0.075, 0.46 + rand() * 0.18, lightness);
        canopyInst.setColorAt(canopyIdx, _color);
        canopyIdx++;
      }
    }
    // Fill remaining canopy slots with dense overarching jungle roof & mid-bank green backdrop
    while (canopyIdx < canopyCount) {
      const s = 4 + rand() * (RIVER_LENGTH - 8);
      const sample = sampleRiver(s);
      const isBackdrop = canopyIdx % 2 === 0;
      const side = canopyIdx % 4 < 2 ? -1 : 1;
      const lat = isBackdrop
        ? side * (sample.halfWidth + 2.4 + rand() * 6.5)
        : (rand() - 0.5) * (sample.halfWidth * 1.55);
      const cx = sample.center.x + sample.right.x * lat;
      const cz = sample.center.z + sample.right.z * lat;
      const cy = isBackdrop ? 1.8 + rand() * 4.8 : 7.6 + rand() * 3.8;
      const cs = isBackdrop ? 1.1 + rand() * 0.9 : 1.3 + rand() * 1.0;
      _euler.set(isBackdrop ? (rand() - 0.5) * 0.5 : -0.6 + (rand() - 0.5) * 0.45, rand() * Math.PI * 2, (rand() - 0.5) * 0.4);
      _quat.setFromEuler(_euler);
      _scale.set(cs, cs, cs);
      _mat4.compose(_v3A.set(cx, cy, cz), _quat, _scale);
      canopyInst.setMatrixAt(canopyIdx, _mat4);
      _color.setHSL(0.23 + rand() * 0.08, 0.48, isBackdrop ? 0.26 + rand() * 0.14 : 0.42 + rand() * 0.22);
      canopyInst.setColorAt(canopyIdx, _color);
      canopyIdx++;
    }

    trunkInst.instanceMatrix.needsUpdate = true;
    if (trunkInst.instanceColor) trunkInst.instanceColor.needsUpdate = true;
    trunkInst.computeBoundingSphere();

    canopyInst.instanceMatrix.needsUpdate = true;
    if (canopyInst.instanceColor) canopyInst.instanceColor.needsUpdate = true;
    canopyInst.computeBoundingSphere();

    this.scene.add(trunkInst, canopyInst);
    this.envDisposables.push(trunkGeo, trunkMat, leafGeo);

    // 6. Dense instanced riverbank ferns & lush tropical understory
    const fernGeo = new THREE.PlaneGeometry(1.85, 1.85);
    fernGeo.translate(0, 0.8, 0);
    const fernCount = isSoftwareGl ? 360 : 520;
    const fernInst = new THREE.InstancedMesh(fernGeo, fernMat, fernCount);
    fernInst.receiveShadow = true;

    for (let i = 0; i < fernCount; i++) {
      const s = 2 + rand() * (RIVER_LENGTH - 4);
      const sample = sampleRiver(s);
      const side = i % 2 === 0 ? -1 : 1;
      const lat = side * (sample.halfWidth + 0.05 + rand() * 5.2);
      const fx = sample.center.x + sample.right.x * lat;
      const fz = sample.center.z + sample.right.z * lat;
      // Leave small opening immediately around Capybara so it stays silhouetted cleanly
      if (Math.hypot(fx - capyPos.x, fz - capyPos.z) < 1.35) {
        _scale.setScalar(0.001);
        _mat4.compose(_v3A.set(fx, -10, fz), _quat.identity(), _scale);
        fernInst.setMatrixAt(i, _mat4);
        continue;
      }
      const fy = Math.max(0.02, terrainHeightAt(fx, fz)) - 0.08;
      const sc = 0.72 + rand() * 1.15;

      _euler.set(-0.18 - rand() * 0.35, rand() * Math.PI * 2, (rand() - 0.5) * 0.3);
      _quat.setFromEuler(_euler);
      _scale.set(sc, sc, sc);
      _mat4.compose(_v3A.set(fx, fy, fz), _quat, _scale);
      fernInst.setMatrixAt(i, _mat4);

      _color.setHSL(0.25 + rand() * 0.06, 0.48 + rand() * 0.16, 0.32 + rand() * 0.22);
      fernInst.setColorAt(i, _color);
    }
    fernInst.instanceMatrix.needsUpdate = true;
    if (fernInst.instanceColor) fernInst.instanceColor.needsUpdate = true;
    fernInst.computeBoundingSphere();
    this.scene.add(fernInst);
    this.envDisposables.push(fernGeo);

    // 7. Composite Amazonian Heliconia flower spikes (curved multi-bract profile, not raw cones)
    const helShape = new THREE.Shape();
    helShape.moveTo(0, 0);
    helShape.lineTo(0.09, 0.14);
    helShape.lineTo(0.02, 0.22);
    helShape.lineTo(0.11, 0.34);
    helShape.lineTo(0.02, 0.44);
    helShape.lineTo(0.08, 0.56);
    helShape.lineTo(0, 0.72);
    helShape.lineTo(-0.08, 0.56);
    helShape.lineTo(-0.02, 0.44);
    helShape.lineTo(-0.11, 0.34);
    helShape.lineTo(-0.02, 0.22);
    helShape.lineTo(-0.09, 0.14);
    helShape.closePath();
    const heliconiaGeo = new THREE.ExtrudeGeometry(helShape, {
      depth: 0.045,
      bevelEnabled: true,
      bevelThickness: 0.014,
      bevelSize: 0.012,
      bevelSegments: 1,
    });
    heliconiaGeo.translate(0, 0.32, -0.02);
    const heliconiaMat = new THREE.MeshStandardMaterial({
      color: 0xe8481c,
      emissive: 0x451104,
      emissiveIntensity: 0.3,
      roughness: 0.42,
    });
    const helCount = 48;
    const helInst = new THREE.InstancedMesh(heliconiaGeo, heliconiaMat, helCount);
    for (let i = 0; i < helCount; i++) {
      let s: number;
      let side: number;
      if (i < 4) {
        // Hero heliconia cluster on right bank near capybara (matching mockup!)
        s = 23.0 + i * 0.9;
        side = 1;
      } else {
        s = 78 + rand() * 90;
        side = i % 2 === 0 ? -1 : 1;
      }
      const sample = sampleRiver(s);
      const lat = side * (sample.halfWidth + 0.85 + rand() * 1.9);
      const hx = sample.center.x + sample.right.x * lat;
      const hz = sample.center.z + sample.right.z * lat;
      const hy = Math.max(0.1, terrainHeightAt(hx, hz));
      const sc = 0.85 + rand() * 0.5;
      _euler.set((rand() - 0.5) * 0.22, rand() * Math.PI * 2, (rand() - 0.5) * 0.22);
      _quat.setFromEuler(_euler);
      _scale.set(sc, sc, sc);
      _mat4.compose(_v3A.set(hx, hy, hz), _quat, _scale);
      helInst.setMatrixAt(i, _mat4);
    }
    helInst.instanceMatrix.needsUpdate = true;
    helInst.computeBoundingSphere();
    this.scene.add(helInst);
    this.envDisposables.push(heliconiaGeo, heliconiaMat);

    // 8. Giant Vitória-Régia lily pads floating in Stretch 3 lagoon & coves
    const padShape = new THREE.Shape();
    padShape.absarc(0, 0, 0.68, 0.14, Math.PI * 2 - 0.14, false);
    padShape.lineTo(0, 0);
    padShape.closePath();
    const padGeo = new THREE.ExtrudeGeometry(padShape, {
      depth: 0.035,
      bevelEnabled: true,
      bevelThickness: 0.012,
      bevelSize: 0.015,
      bevelSegments: 1,
    });
    padGeo.rotateX(-Math.PI / 2);
    const padMat = new THREE.MeshStandardMaterial({
      color: 0x3f6e2d,
      roughness: 0.58,
      metalness: 0.02,
    });
    const padCount = 46;
    const padInst = new THREE.InstancedMesh(padGeo, padMat, padCount);
    padInst.receiveShadow = true;
    for (let i = 0; i < padCount; i++) {
      const inLagoon = i >= 12;
      const s = inLagoon ? 166 + rand() * 62 : 34 + rand() * 115;
      const sample = sampleRiver(s);
      const side = i % 2 === 0 ? -1 : 1;
      const lat = side * (sample.halfWidth - 0.95 - rand() * (inLagoon ? 3.4 : 1.1));
      const px = sample.center.x + sample.right.x * lat;
      const pz = sample.center.z + sample.right.z * lat;
      const sc = 0.65 + rand() * 0.85;
      _euler.set(0, rand() * Math.PI * 2, 0);
      _quat.setFromEuler(_euler);
      _scale.set(sc, 1, sc);
      _mat4.compose(_v3A.set(px, 0.02, pz), _quat, _scale);
      padInst.setMatrixAt(i, _mat4);
      _color.setHSL(0.26 + rand() * 0.05, 0.44, 0.34 + rand() * 0.14);
      padInst.setColorAt(i, _color);
    }
    padInst.instanceMatrix.needsUpdate = true;
    if (padInst.instanceColor) padInst.instanceColor.needsUpdate = true;
    padInst.computeBoundingSphere();
    this.scene.add(padInst);
    this.envDisposables.push(padGeo, padMat);

    // 9. Hanging jungle vines / lianas from overhead boughs
    const vineGeo = new THREE.CylinderGeometry(0.018, 0.012, 4.8, 5);
    const vineMat = new THREE.MeshStandardMaterial({ color: 0x3b4e2b, roughness: 0.88 });
    const vineCount = 60;
    const vineInst = new THREE.InstancedMesh(vineGeo, vineMat, vineCount);
    for (let i = 0; i < vineCount; i++) {
      const s = 14 + rand() * (RIVER_LENGTH - 24);
      const sample = sampleRiver(s);
      const side = i % 2 === 0 ? -1 : 1;
      const lat = side * (sample.halfWidth * (0.55 + rand() * 0.55));
      const vx = sample.center.x + sample.right.x * lat;
      const vz = sample.center.z + sample.right.z * lat;
      const vy = 5.4 + rand() * 3.0;
      _euler.set((rand() - 0.5) * 0.14, 0, (rand() - 0.5) * 0.14);
      _quat.setFromEuler(_euler);
      _scale.set(1, 0.65 + rand() * 0.85, 1);
      _mat4.compose(_v3A.set(vx, vy, vz), _quat, _scale);
      vineInst.setMatrixAt(i, _mat4);
    }
    vineInst.instanceMatrix.needsUpdate = true;
    vineInst.computeBoundingSphere();
    this.scene.add(vineInst);
    this.envDisposables.push(vineGeo, vineMat);
  }

  private buildDockingStations() {
    for (const zone of DOCK_ZONES) {
      const station = buildDockingStation(this.mats, zone);
      this.scene.add(station);
    }
  }

  private buildFauna() {
    for (const spec of FAUNA_CATALOG) {
      const actor = buildFaunaActor(spec, this.mats);
      const sample = sampleRiver(spec.s);
      const riverYaw = Math.atan2(-sample.tangent.x, -sample.tangent.z);
      actor.group.rotation.y = riverYaw + spec.facingYawOffset;
      this.scene.add(actor.group);
      this.faunaActors.push(actor);
    }
  }

  private bindEvents() {
    const canvas = this.renderer.domElement;

    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);
    window.addEventListener('blur', this.handleWindowBlur);
    document.addEventListener('visibilitychange', this.handleVisibilityChange);

    canvas.addEventListener('pointerdown', this.handlePointerDown);
    window.addEventListener('pointermove', this.handlePointerMove);
    window.addEventListener('pointerup', this.handlePointerUp);
    canvas.addEventListener('wheel', this.handleWheel, { passive: true });
    canvas.addEventListener('webglcontextlost', this.handleContextLost, false);
    canvas.addEventListener('webglcontextrestored', this.handleContextRestored, false);

    this.resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const { width, height } = entry.contentRect;
      if (width > 0 && height > 0) {
        this.pipeline.resize(width, height);
      }
    });
    this.resizeObserver.observe(this.container);
  }

  private handleKeyDown = (e: KeyboardEvent) => {
    const tag = (e.target as HTMLElement | null)?.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

    this.audio.unlock();
    const code = e.code;

    if (this.phase === 'title') {
      if (code === 'Enter' || code === 'Space') {
        e.preventDefault();
        this.startExpedition();
      }
      return;
    }

    if (code === 'Escape') {
      e.preventDefault();
      this.callbacks.onHotkeyEscape();
      return;
    }

    if (code === 'KeyP') {
      e.preventDefault();
      this.setPaused(this.phase !== 'paused');
      return;
    }

    if (code === 'KeyH') {
      e.preventDefault();
      this.callbacks.onHotkeyToggleHud();
      return;
    }

    if (code === 'KeyM') {
      e.preventDefault();
      this.setMuted(!this.muted);
      return;
    }

    if (this.phase !== 'playing') return;

    if (code === 'KeyW' || code === 'ArrowUp') {
      e.preventDefault();
      this.input.forward = true;
    } else if (code === 'KeyS' || code === 'ArrowDown') {
      e.preventDefault();
      this.input.backward = true;
    } else if (code === 'KeyA' || code === 'ArrowLeft') {
      e.preventDefault();
      this.input.turnLeft = true;
    } else if (code === 'KeyD' || code === 'ArrowRight') {
      e.preventDefault();
      this.input.turnRight = true;
    } else if (code === 'Space') {
      e.preventDefault();
      if (this.toolMode === 'observar') {
        this.capturePhoto();
      } else {
        this.input.manualStrokeSide = this.canoeState.nextAutoSide;
      }
    } else if (code === 'KeyE') {
      e.preventDefault();
      this.toggleDock();
    } else if (code === 'KeyC') {
      e.preventDefault();
      this.setCameraMode(this.cameraMode === 'first_person' ? 'external' : 'first_person');
    } else if (code === 'Tab' || code === 'KeyO') {
      e.preventDefault();
      this.setToolMode(this.toolMode === 'observar' ? 'remar' : 'observar');
    } else if (code === 'KeyR') {
      e.preventDefault();
      this.resetExpedition();
    }
  };

  private handleKeyUp = (e: KeyboardEvent) => {
    const code = e.code;
    if (code === 'KeyW' || code === 'ArrowUp') this.input.forward = false;
    else if (code === 'KeyS' || code === 'ArrowDown') this.input.backward = false;
    else if (code === 'KeyA' || code === 'ArrowLeft') this.input.turnLeft = false;
    else if (code === 'KeyD' || code === 'ArrowRight') this.input.turnRight = false;
  };

  private clearInputs() {
    this.input.forward = false;
    this.input.backward = false;
    this.input.turnLeft = false;
    this.input.turnRight = false;
    this.input.analogThrottle = 0;
    this.input.analogSteer = 0;
    this.input.manualStrokeSide = 0;
    this.pointerDown = false;
  }

  private handleWindowBlur = () => {
    this.clearInputs();
  };

  private handleVisibilityChange = () => {
    this.tabHidden = document.hidden;
    this.clearInputs();
    this.audio.setPaused(this.tabHidden || this.phase === 'paused');
    if (!this.tabHidden && !this.disposed) {
      this.lastTimeMs = performance.now();
      this.scheduleNextFrame();
    }
  };

  private handlePointerDown = (e: PointerEvent) => {
    if (this.phase !== 'playing') return;
    this.audio.unlock();
    this.pointerDown = true;
    this.pointerDragged = false;
    this.pointerDownX = e.clientX;
    this.pointerDownY = e.clientY;
    this.lastPointerX = e.clientX;
    this.lastPointerY = e.clientY;
  };

  private handlePointerMove = (e: PointerEvent) => {
    if (!this.pointerDown || this.phase !== 'playing') return;
    const dx = e.clientX - this.lastPointerX;
    const dy = e.clientY - this.lastPointerY;
    this.lastPointerX = e.clientX;
    this.lastPointerY = e.clientY;

    if (Math.hypot(e.clientX - this.pointerDownX, e.clientY - this.pointerDownY) > 6) {
      this.pointerDragged = true;
    }

    const sens = this.toolMode === 'observar' ? 0.0026 : 0.0038;
    if (this.cameraMode === 'external' && this.toolMode !== 'observar') {
      this.extOrbitYaw -= dx * sens * 1.15;
      this.extOrbitPitch = THREE.MathUtils.clamp(this.extOrbitPitch + dy * sens, 0.08, 0.92);
    } else {
      const maxYaw = this.toolMode === 'observar' ? 1.65 : 1.15;
      this.targetLookYaw = THREE.MathUtils.clamp(this.targetLookYaw - dx * sens, -maxYaw, maxYaw);
      this.targetLookPitch = THREE.MathUtils.clamp(
        this.targetLookPitch - dy * sens,
        -0.42,
        0.58
      );
    }
  };

  private handlePointerUp = (e: PointerEvent) => {
    if (!this.pointerDown) return;
    this.pointerDown = false;
    if (this.phase !== 'playing') return;

    // Clean tap/click without drag:
    if (!this.pointerDragged) {
      if (this.toolMode === 'observar') {
        this.capturePhoto();
      } else {
        // Click left or right half of viewport performs a tactile paddle stroke on that side
        const rect = this.renderer.domElement.getBoundingClientRect();
        const relX = (e.clientX - rect.left) / Math.max(1, rect.width);
        this.input.manualStrokeSide = relX < 0.5 ? -1 : 1;
      }
    }
  };

  private handleWheel = (e: WheelEvent) => {
    if (this.phase !== 'playing') return;
    if (this.cameraMode === 'external') {
      this.extOrbitDist = THREE.MathUtils.clamp(this.extOrbitDist + e.deltaY * 0.004, 3.2, 10.5);
    }
  };

  private handleContextLost = (e: Event) => {
    e.preventDefault();
    this.contextLost = true;
    this.callbacks.onContextLost(true);
  };

  private handleContextRestored = () => {
    this.contextLost = false;
    this.callbacks.onContextLost(false);
    this.lighting.regenerateEnvironment();
    this.refreshShadows();
    this.lastTimeMs = performance.now();
    this.scheduleNextFrame();
  };

  // --- Public imperative API for React shell ---

  startExpedition() {
    this.audio.unlock();
    this.phase = 'playing';
    this.clearInputs();
    this.audio.setPaused(false);
    this.targetLookYaw = 0;
    this.targetLookPitch = -0.02;
    this.callbacks.onStatusMessage(
      'Use W/A/S/D ou clique na água para remar. Troque para Observar para fotografar a fauna.',
      'info'
    );
    this.pushHudSnapshot();
  }

  returnToTitle() {
    this.phase = 'title';
    this.toolMode = 'remar';
    this.cameraMode = 'first_person';
    this.clearInputs();
    this.canoeState = createInitialCanoeState();
    this.targetLookYaw = 0;
    this.targetLookPitch = -0.02;
    this.syncCanoeTransform();
    this.updateCamera(1, true);
    this.refreshShadows();
    this.pushHudSnapshot();
  }

  setPaused(paused: boolean) {
    if (this.phase === 'title') return;
    this.phase = paused ? 'paused' : 'playing';
    if (paused) this.clearInputs();
    this.audio.setPaused(paused || this.tabHidden);
    this.pushHudSnapshot();
  }

  resetExpedition() {
    this.audio.unlock();
    this.canoeState = createInitialCanoeState();
    this.journal = [];
    this.framedFauna = null;
    this.toolMode = 'remar';
    this.cameraMode = 'first_person';
    this.targetLookYaw = 0;
    this.targetLookPitch = -0.02;
    this.extOrbitYaw = 0;
    this.phase = 'playing';
    this.clearInputs();
    this.audio.setPaused(false);
    this.syncCanoeTransform();
    this.updateCamera(1, true);
    this.refreshShadows();
    this.callbacks.onStatusMessage(
      'Expedição reiniciada no Remanso das Samaúmas.',
      'info'
    );
    this.pushHudSnapshot();
  }

  setToolMode(mode: ToolMode) {
    this.audio.unlock();
    this.toolMode = mode;
    if (mode === 'observar') {
      // Gently orient toward nearest visible fauna if in front hemisphere so observing feels intuitive
      this.callbacks.onStatusMessage(
        'Modo Observar ativo: arraste para enquadrar a fauna e clique ou pressione Espaço para fotografar.',
        'info'
      );
    } else {
      this.targetLookYaw = 0;
      this.targetLookPitch = -0.02;
    }
    this.pushHudSnapshot();
  }

  setCameraMode(mode: CameraViewMode) {
    this.audio.unlock();
    this.cameraMode = mode;
    if (mode === 'external') {
      this.extOrbitYaw = 0;
      this.extOrbitPitch = 0.28;
      this.callbacks.onStatusMessage('Vista externa da canoa ativada. Arraste para orbitar.', 'info');
    } else {
      this.targetLookYaw = 0;
      this.targetLookPitch = -0.02;
      this.callbacks.onStatusMessage('Câmera em primeira pessoa na canoa.', 'info');
    }
    this.pushHudSnapshot();
  }

  setTimePreset(preset: TimePresetId) {
    this.audio.unlock();
    this.lighting.setPreset(preset, false);
    this.pushHudSnapshot();
  }

  setQualitySetting(setting: QualitySetting) {
    this.qualitySetting = setting;
    const target: QualityLevel = setting === 'auto' ? this.qualityProbe.detected : setting;
    this.pipeline.setQuality(target);
    this.refreshShadows();
    this.pushHudSnapshot();
  }

  setMuted(muted: boolean) {
    this.muted = muted;
    this.audio.setMuted(muted);
    this.pushHudSnapshot();
  }

  setVolume(volume: number) {
    this.volume = Math.max(0, Math.min(1, volume));
    this.audio.setVolume(this.volume);
    this.pushHudSnapshot();
  }

  setReducedMotion(reduced: boolean) {
    this.reducedMotion = reduced;
    this.foliageUniforms.uWind.value = reduced ? 0.2 : 1.0;
    this.pushHudSnapshot();
  }

  setAnalogControl(throttle: number, steer: number) {
    this.audio.unlock();
    this.input.analogThrottle = Math.max(-1, Math.min(1, throttle));
    this.input.analogSteer = Math.max(-1, Math.min(1, steer));
  }

  triggerManualStroke(side: -1 | 1) {
    this.audio.unlock();
    this.input.manualStrokeSide = side;
  }

  toggleDock() {
    this.audio.unlock();
    const res = toggleDocking(this.canoeState);
    if (res.changed) {
      this.audio.playMooringSound(res.docked);
      this.callbacks.onStatusMessage(res.message, 'success');
    } else {
      this.callbacks.onStatusMessage(res.message, 'warn');
    }
    this.pushHudSnapshot();
  }

  teleportToStretch(stretchId: number) {
    this.audio.unlock();
    const st = STRETCHES.find((x) => x.id === stretchId);
    if (!st) return;
    const fresh = createInitialCanoeState(st.spawnS);
    // Preserve journey progress & journal while moving canoe cleanly to the chosen stretch
    fresh.distanceTraveled = this.canoeState.distanceTraveled;
    fresh.strokeCount = this.canoeState.strokeCount;
    fresh.simTime = this.canoeState.simTime;
    this.canoeState = fresh;
    this.targetLookYaw = 0;
    this.targetLookPitch = -0.02;
    this.syncCanoeTransform();
    this.updateCamera(1, true);
    this.refreshShadows();
    this.callbacks.onStatusMessage(`Navegando em ${st.name}.`, 'info');
    this.pushHudSnapshot();
  }

  /** Smoothly aim first-person observation view at a nearby species (accessibility & mobile helper) */
  aimAtNearestFauna() {
    let bestActor: FaunaActor | null = null;
    let bestDist = Infinity;
    for (const actor of this.faunaActors) {
      const d = actor.group.position.distanceTo(this.camera.position);
      if (d < 42 && d < bestDist) {
        bestDist = d;
        bestActor = actor;
      }
    }
    if (!bestActor) {
      this.callbacks.onStatusMessage('Reme um pouco mais adiante para avistar a fauna deste trecho.', 'info');
      return;
    }
    // Compute local yaw & pitch relative to canoe yaw
    const dx = bestActor.group.position.x - this.camera.position.x;
    const dy = bestActor.group.position.y + 0.32 - this.camera.position.y;
    const dz = bestActor.group.position.z - this.camera.position.z;
    const horiz = Math.hypot(dx, dz) || 1;
    const worldYaw = Math.atan2(-dx, -dz);
    let diffYaw = worldYaw - this.canoeState.yaw;
    while (diffYaw > Math.PI) diffYaw -= Math.PI * 2;
    while (diffYaw < -Math.PI) diffYaw += Math.PI * 2;
    this.targetLookYaw = THREE.MathUtils.clamp(diffYaw, -1.65, 1.65);
    this.targetLookPitch = THREE.MathUtils.clamp(Math.atan2(dy, horiz), -0.4, 0.55);
  }

  capturePhoto() {
    this.audio.unlock();
    this.camera.getWorldDirection(_v3CamFwd);
    const framed = findFramedFauna(
      { x: this.camera.position.x, y: this.camera.position.y, z: this.camera.position.z },
      { x: _v3CamFwd.x, y: _v3CamFwd.y, z: _v3CamFwd.z },
      this.canoeState.simTime,
      40,
      0.89
    );

    if (!framed) {
      this.audio.playPhotoShutter(false);
      this.callbacks.onStatusMessage(
        'Nenhuma espécie enquadrada. Mire em um animal no visor antes de fotografar.',
        'warn'
      );
      return;
    }

    // Render once immediately and capture crisp thumbnail data URL from canvas
    this.pipeline.render();
    let thumbUrl: string | null = null;
    try {
      const srcCanvas = this.renderer.domElement;
      const thumb = document.createElement('canvas');
      thumb.width = 320;
      thumb.height = 180;
      const ctx = thumb.getContext('2d');
      if (ctx) {
        ctx.drawImage(srcCanvas, 0, 0, thumb.width, thumb.height);
        thumbUrl = thumb.toDataURL('image/jpeg', 0.78);
      }
    } catch {
      thumbUrl = null;
    }

    const existingIdx = this.journal.findIndex((j) => j.speciesId === framed.speciesId);
    const entry: JournalPhotoEntry = {
      speciesId: framed.speciesId as FaunaSpeciesId,
      timestamp: Date.now(),
      stretchId: this.canoeState.stretchId,
      timePreset: this.lighting.getPresetId(),
      distanceMeters: Math.round(framed.distance),
      thumbnailDataUrl: thumbUrl,
    };

    if (existingIdx >= 0) {
      this.journal = this.journal.map((j, idx) => (idx === existingIdx ? entry : j));
      this.callbacks.onStatusMessage(
        `Novo registro atualizado: ${framed.name} (${framed.scientificName}) a ${Math.round(framed.distance)} m.`,
        'success'
      );
    } else {
      this.journal = [...this.journal, entry];
      this.callbacks.onStatusMessage(
        `Espécie catalogada (${this.journal.length}/${FAUNA_CATALOG.length}): ${framed.name}!`,
        'success'
      );
    }

    this.audio.playPhotoShutter(true);
    this.callbacks.onPhotoFlash();
    this.pushHudSnapshot();
  }

  // --- Internal per-frame loop ---

  private refreshShadows() {
    if (!this.renderer.shadowMap.enabled) return;
    this.renderer.shadowMap.needsUpdate = true;
    this.lastShadowAnchor.set(this.canoeState.x, this.canoeState.z);
  }

  private syncCanoeTransform() {
    const st = this.canoeState;
    const motionScale = this.reducedMotion ? 0.3 : 1.0;

    this.canoeRig.root.position.set(st.x, st.heave * motionScale, st.z);
    this.canoeRig.root.rotation.order = 'YXZ';
    this.canoeRig.root.rotation.set(
      st.pitch * motionScale,
      st.yaw,
      st.roll * motionScale
    );

    // Animate carved wooden paddle smoothly along active stroke side
    const side = st.paddle.side;
    const phase = st.paddle.phase;
    const strokeSweep = st.paddle.active ? Math.sin(phase * Math.PI) : 0;
    const strokePull = st.paddle.active ? Math.cos(phase * Math.PI) : 0.35;

    // Position paddle visibly along right (+1) or left (-1) gunwale dipping toward water
    this.canoeRig.paddlePivot.scale.x = side;
    this.canoeRig.paddlePivot.position.set(
      side * 0.32,
      0.55 - strokeSweep * 0.14,
      -0.02 + strokePull * 0.24
    );
    this.canoeRig.paddlePivot.rotation.set(
      -0.12 + strokePull * 0.34,
      side * (-0.08 + strokeSweep * 0.16),
      side * (0.04 - strokeSweep * 0.16)
    );

    // Update bow lantern glow during dusk/sunset
    const flicker = 0.92 + Math.sin(this.elapsed * 7.5) * 0.08;
    const li = this.lighting.lanternIntensity * flicker;
    this.canoeRig.lanternLight.intensity = li;
    this.canoeRig.lanternGlassMat.emissiveIntensity = li > 0.05 ? 1.2 + li * 0.35 : 0;
  }

  private updateFauna(elapsed: number) {
    for (const actor of this.faunaActors) {
      const p = getFaunaWorldPosition(actor.spec, elapsed);
      actor.update(elapsed, _v3A.set(p.x, p.y, p.z));
    }
  }

  private updateCamera(dt: number, snap = false) {
    const st = this.canoeState;
    const damp = snap ? 1 : 1 - Math.exp(-8.5 * dt);

    // Gently re-center free-look slightly when actively paddling forward in Remar mode
    if (this.toolMode === 'remar' && !this.pointerDown && (this.input.forward || Math.abs(this.input.analogThrottle) > 0.2)) {
      this.targetLookYaw *= Math.exp(-1.5 * dt);
      this.targetLookPitch += (-0.04 - this.targetLookPitch) * (1 - Math.exp(-1.5 * dt));
    }

    this.lookYaw += (this.targetLookYaw - this.lookYaw) * damp;
    this.lookPitch += (this.targetLookPitch - this.lookPitch) * damp;

    const targetFov = this.toolMode === 'observar' ? 34 : this.cameraMode === 'external' ? 52 : 55;
    this.currentFov += (targetFov - this.currentFov) * (snap ? 1 : 1 - Math.exp(-7 * dt));
    if (Math.abs(this.camera.fov - this.currentFov) > 0.05) {
      this.camera.fov = this.currentFov;
      this.camera.updateProjectionMatrix();
    }

    if (this.phase === 'title') {
      // Live atmospheric breathing vantage from inside the canoe matching the mockup composition!
      const sway = this.reducedMotion ? 0 : Math.sin(this.elapsed * 0.35) * 0.05;
      const localEye = _v3A.set(sway, 1.2, 0.88);
      this.canoeRig.root.updateMatrixWorld();
      localEye.applyMatrix4(this.canoeRig.root.matrixWorld);
      this.camera.position.copy(localEye);

      const lookLocal = _v3B.set(sway * 1.4, 0.72, -14.0);
      lookLocal.applyMatrix4(this.canoeRig.root.matrixWorld);
      this.camera.lookAt(lookLocal);
      return;
    }

    if (this.cameraMode === 'first_person' || this.toolMode === 'observar') {
      this.canoeRig.root.updateMatrixWorld();
      const eyeLocal = _v3A.set(0, 1.2, 0.88);
      eyeLocal.applyMatrix4(this.canoeRig.root.matrixWorld);
      if (snap) this.camera.position.copy(eyeLocal);
      else this.camera.position.lerp(eyeLocal, 1 - Math.exp(-14 * dt));

      const totalYaw = st.yaw + this.lookYaw;
      const cosP = Math.cos(this.lookPitch);
      _v3LookTarget.set(
        this.camera.position.x - Math.sin(totalYaw) * cosP * 12,
        this.camera.position.y + Math.sin(this.lookPitch) * 12,
        this.camera.position.z - Math.cos(totalYaw) * cosP * 12
      );
      this.camera.lookAt(_v3LookTarget);
    } else {
      // External damped orbital camera clamped safely above water & inside forest corridor
      const orbitAngle = st.yaw + this.extOrbitYaw;
      const horiz = Math.cos(this.extOrbitPitch) * this.extOrbitDist;
      const vert = Math.sin(this.extOrbitPitch) * this.extOrbitDist + 1.1;

      _v3CamTarget.set(
        st.x + Math.sin(orbitAngle) * horiz,
        Math.max(0.65, vert),
        st.z + Math.cos(orbitAngle) * horiz
      );

      // Clamp camera above riverbank terrain so it never clips into ground
      const groundAtCam = terrainHeightAt(_v3CamTarget.x, _v3CamTarget.z);
      if (_v3CamTarget.y < groundAtCam + 0.75) {
        _v3CamTarget.y = groundAtCam + 0.75;
      }

      if (snap) this.camera.position.copy(_v3CamTarget);
      else this.camera.position.lerp(_v3CamTarget, damp);

      _v3LookTarget.set(st.x, 0.55, st.z);
      this.camera.lookAt(_v3LookTarget);
    }
  }

  private scheduleNextFrame() {
    if (this.disposed || this.tabHidden || this.contextLost) return;
    if (this.qualityProbe.isSoftwareGl) {
      scheduleAfterSoftwareDraw(this.renderer, this.tick, (id) => {
        this.timerId = id;
      });
    } else {
      this.rafId = requestAnimationFrame(this.tick);
    }
  }

  private tick = () => {
    if (this.disposed || this.tabHidden || this.contextLost) return;

    const now = performance.now();
    const rawDt = Math.max(0.001, (now - this.lastTimeMs) / 1000);
    const dt = Math.min(rawDt, 0.05);
    this.lastTimeMs = now;

    if (this.phase !== 'paused') {
      this.elapsed += dt;
      this.foliageUniforms.uTime.value = this.elapsed;

      if (this.phase === 'playing') {
        this.simAccumulator += dt;
        let substeps = 0;
        while (this.simAccumulator >= SIM_FIXED_DT && substeps < 4) {
          const stepRes = stepCanoePhysics(this.canoeState, this.input, SIM_FIXED_DT);
          // Clear edge-triggered manual stroke after consumption
          this.input.manualStrokeSide = 0;

          if (stepRes.strokeTriggered) {
            this.audio.playPaddleStroke(stepRes.strokeStrength);
            // Spawn water splash & expanding ring at the paddle blade world position
            this.canoeRig.root.updateMatrixWorld();
            this.canoeRig.paddleBladeTip.getWorldPosition(_v3C);
            this.wakes.spawnPaddleSplash(_v3C.x, _v3C.z, this.qualityProbe.isSoftwareGl ? 6 : 12, stepRes.strokeStrength);
          }
          if (stepRes.bankBumped) {
            this.audio.playBankBrush();
          }

          this.simAccumulator -= SIM_FIXED_DT;
          substeps++;
        }

        // Gentle bow wake ripples while moving
        const spd = Math.hypot(this.canoeState.vx, this.canoeState.vz);
        this.wakeEmitTimer -= dt;
        if (spd > 0.45 && this.wakeEmitTimer <= 0) {
          this.wakeEmitTimer = Math.max(0.28, 0.85 - spd * 0.14);
          const bx = this.canoeState.x - Math.sin(this.canoeState.yaw) * 2.1;
          const bz = this.canoeState.z - Math.cos(this.canoeState.yaw) * 2.1;
          this.wakes.spawnWakeRing(bx, bz, 0.65, 1.45);
        }

        this.audio.update(
          dt,
          spd,
          this.lighting.rainIntensity,
          this.lighting.getPresetId()
        );
      } else {
        // Gentle idle bobbing on Title screen
        this.canoeState.heave = Math.sin(this.elapsed * 1.3) * 0.025;
        this.canoeState.roll = Math.sin(this.elapsed * 0.85) * 0.015;
        this.canoeState.pitch = Math.cos(this.elapsed * 1.05) * 0.01;
      }

      this.syncCanoeTransform();
      this.updateFauna(this.elapsed);
      this.updateCamera(dt, false);

      const lightChanged = this.lighting.update(dt, this.canoeState.x, this.canoeState.z);
      this.water.update(dt, this.elapsed, this.lighting.waterTint, this.lighting.rainIntensity);
      this.sunbeams.update(this.elapsed, this.lighting.shaftColor, this.lighting.shaftOpacity);
      this.atmosphere.update(
        dt,
        this.elapsed,
        this.canoeState.x,
        this.canoeState.z,
        this.lighting.shaftOpacity,
        this.lighting.fireflyIntensity,
        this.lighting.rainIntensity,
        this.reducedMotion
      );
      this.wakes.update(dt);
      this.pipeline.updateGrading(this.lighting.grade, this.elapsed);

      // Update shadows only on demand (light change or canoe moved > 3.5m)
      if (
        lightChanged ||
        this.lastShadowAnchor.distanceTo(_v3A.set(this.canoeState.x, this.canoeState.z, 0) as unknown as THREE.Vector2) > 3.5
      ) {
        const distSq =
          (this.canoeState.x - this.lastShadowAnchor.x) ** 2 +
          (this.canoeState.z - this.lastShadowAnchor.y) ** 2;
        if (lightChanged || distSq > 12.25) {
          this.refreshShadows();
        }
      }

      // Check framed fauna in Observe mode (or passive glance)
      if (this.phase === 'playing') {
        this.camera.getWorldDirection(_v3CamFwd);
        this.framedFauna = findFramedFauna(
          { x: this.camera.position.x, y: this.camera.position.y, z: this.camera.position.z },
          { x: _v3CamFwd.x, y: _v3CamFwd.y, z: _v3CamFwd.z },
          this.canoeState.simTime,
          40,
          this.toolMode === 'observar' ? 0.89 : 0.96
        );
      }
    }

    const renderStart = performance.now();
    this.pipeline.render();
    this.lastFrameMs = performance.now() - renderStart;
    this.pipeline.recordFrameMs(this.lastFrameMs);

    // Throttle React HUD updates to ~8 Hz
    this.hudThrottleTimer += dt;
    if (this.hudThrottleTimer >= 0.125) {
      this.hudThrottleTimer = 0;
      this.pushHudSnapshot();
    }

    this.scheduleNextFrame();
  };

  private pushHudSnapshot() {
    const st = this.canoeState;
    const stretch = getStretchForS(st.s);
    const dockedZone = st.dockedZoneId
      ? DOCK_ZONES.find((z) => z.id === st.dockedZoneId) ?? null
      : null;
    const nearbyDock = st.nearbyDockId
      ? DOCK_ZONES.find((z) => z.id === st.nearbyDockId) ?? null
      : null;

    this.callbacks.onHudUpdate({
      phase: this.phase,
      toolMode: this.toolMode,
      cameraMode: this.cameraMode,
      timePreset: this.lighting.getPresetId(),
      qualitySetting: this.qualitySetting,
      activeQuality: this.pipeline.getProfile().level,
      detectedQuality: this.qualityProbe.detected,
      isSoftwareGl: this.qualityProbe.isSoftwareGl,
      gpuString: this.qualityProbe.gpuString,
      s: st.s,
      lateral: st.lateral,
      x: st.x,
      z: st.z,
      yaw: st.yaw,
      speedMs: Math.hypot(st.vx, st.vz),
      currentSpeedMs: Math.hypot(st.currentVx, st.currentVz),
      stretchId: stretch.id,
      stretchName: stretch.shortName,
      distanceTraveled: st.distanceTraveled,
      strokeCount: st.strokeCount,
      dockedZoneId: st.dockedZoneId,
      dockedZoneName: dockedZone?.name ?? null,
      nearbyDockId: st.nearbyDockId,
      nearbyDockName: nearbyDock?.name ?? null,
      framedFauna: this.framedFauna,
      journal: this.journal,
      muted: this.muted,
      volume: this.volume,
      reducedMotion: this.reducedMotion,
      frameTimeMs: this.lastFrameMs,
      drawCalls: this.renderer.info.render.calls,
      adaptiveScale: this.pipeline.getAdaptiveScale(),
    });
  }

  dispose() {
    this.disposed = true;
    cancelAnimationFrame(this.rafId);
    clearTimeout(this.timerId);

    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
    window.removeEventListener('blur', this.handleWindowBlur);
    document.removeEventListener('visibilitychange', this.handleVisibilityChange);

    const canvas = this.renderer.domElement;
    canvas.removeEventListener('pointerdown', this.handlePointerDown);
    window.removeEventListener('pointermove', this.handlePointerMove);
    window.removeEventListener('pointerup', this.handlePointerUp);
    canvas.removeEventListener('wheel', this.handleWheel);
    canvas.removeEventListener('webglcontextlost', this.handleContextLost);
    canvas.removeEventListener('webglcontextrestored', this.handleContextRestored);

    this.resizeObserver?.disconnect();
    this.audio.dispose();
    this.water.dispose();
    this.sunbeams.dispose();
    this.atmosphere.dispose();
    this.wakes.dispose();
    this.lighting.dispose();
    this.pipeline.dispose();
    this.mats.dispose();

    for (const d of this.envDisposables) {
      d.dispose();
    }
    this.scene.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        obj.geometry?.dispose();
        if (Array.isArray(obj.material)) {
          obj.material.forEach((m) => m.dispose());
        } else {
          obj.material?.dispose();
        }
      }
    });

    this.renderer.dispose();
    if (canvas.parentElement === this.container) {
      this.container.removeChild(canvas);
    }
  }
}
