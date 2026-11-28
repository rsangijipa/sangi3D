/**
 * Time-of-day & climate lighting presets with smooth ~3.5s transitions
 * and procedural sky-dome PMREM environment generation.
 */

import * as THREE from 'three';
import { GradeUniformValues } from './quality';

export type TimePresetId = 'manha' | 'meiodia' | 'pordosol' | 'crepusculo' | 'chuva';

export interface TimePresetConfig {
  id: TimePresetId;
  label: string;
  hourLabel: string;
  subtitle: string;
  sunDirection: [number, number, number];
  sunColor: number;
  sunIntensity: number;
  hemiSky: number;
  hemiGround: number;
  hemiIntensity: number;
  fogColor: number;
  fogDensity: number;
  skyTop: number;
  skyHorizon: number;
  skyGlow: number;
  shaftColor: number;
  shaftOpacity: number;
  fireflyIntensity: number;
  rainIntensity: number;
  lanternIntensity: number;
  waterTint: number;
  grade: GradeUniformValues;
}

export const TIME_PRESETS: Record<TimePresetId, TimePresetConfig> = {
  manha: {
    id: 'manha',
    label: 'Manhã Dourada',
    hourLabel: '07:20',
    subtitle: 'Raios dourados atravessando o dossel sobre a névoa matinal',
    sunDirection: [28, 34, -22],
    sunColor: 0xffe4aa,
    sunIntensity: 4.8,
    hemiSky: 0x89b99c,
    hemiGround: 0x26341d,
    hemiIntensity: 0.72,
    fogColor: 0x2a3b29,
    fogDensity: 0.0155,
    skyTop: 0x2d5e59,
    skyHorizon: 0xb9cf9a,
    skyGlow: 0xfff0be,
    shaftColor: 0xffe9a8,
    shaftOpacity: 0.24,
    fireflyIntensity: 0.0,
    rainIntensity: 0.0,
    lanternIntensity: 0.0,
    waterTint: 0x161c12,
    grade: {
      exposure: 1.06,
      saturation: 1.12,
      contrast: 1.06,
      vignette: 0.26,
      lift: [0.002, 0.005, -0.004],
      gain: [1.04, 1.01, 0.94],
    },
  },
  meiodia: {
    id: 'meiodia',
    label: 'Meio-dia Tropical',
    hourLabel: '12:15',
    subtitle: 'Luz vertical intensa filtrada pelas folhas e água cristalina',
    sunDirection: [12, 54, -10],
    sunColor: 0xfff7e2,
    sunIntensity: 5.2,
    hemiSky: 0xa4d6cf,
    hemiGround: 0x2c4220,
    hemiIntensity: 0.92,
    fogColor: 0x3b5443,
    fogDensity: 0.0125,
    skyTop: 0x2b7cb3,
    skyHorizon: 0x9cd2c8,
    skyGlow: 0xffffec,
    shaftColor: 0xf7ffd8,
    shaftOpacity: 0.16,
    fireflyIntensity: 0.0,
    rainIntensity: 0.0,
    lanternIntensity: 0.0,
    waterTint: 0x182419,
    grade: {
      exposure: 0.96,
      saturation: 1.06,
      contrast: 1.04,
      vignette: 0.2,
      lift: [0.0, 0.003, 0.0],
      gain: [1.0, 1.02, 0.99],
    },
  },
  pordosol: {
    id: 'pordosol',
    label: 'Pôr do Sol',
    hourLabel: '17:45',
    subtitle: 'Luz âmbar rasante tingindo os troncos e os reflexos do igarapé',
    sunDirection: [-34, 15, -24],
    sunColor: 0xff9a4d,
    sunIntensity: 5.0,
    hemiSky: 0x9b6e68,
    hemiGround: 0x251a14,
    hemiIntensity: 0.62,
    fogColor: 0x3a2a22,
    fogDensity: 0.0175,
    skyTop: 0x2d325a,
    skyHorizon: 0xd97d48,
    skyGlow: 0xffba6b,
    shaftColor: 0xffb366,
    shaftOpacity: 0.28,
    fireflyIntensity: 0.25,
    rainIntensity: 0.0,
    lanternIntensity: 1.2,
    waterTint: 0x1c140e,
    grade: {
      exposure: 1.04,
      saturation: 1.15,
      contrast: 1.08,
      vignette: 0.32,
      lift: [0.012, -0.002, -0.008],
      gain: [1.08, 0.98, 0.88],
    },
  },
  crepusculo: {
    id: 'crepusculo',
    label: 'Crepúsculo',
    hourLabel: '19:10',
    subtitle: 'Azul profundo da mata noturna, vaga-lumes e lanterna na proa',
    sunDirection: [-22, 18, -32],
    sunColor: 0x7aa4e6,
    sunIntensity: 1.65,
    hemiSky: 0x3c587a,
    hemiGround: 0x121c18,
    hemiIntensity: 0.56,
    fogColor: 0x111e24,
    fogDensity: 0.021,
    skyTop: 0x0b1628,
    skyHorizon: 0x213b4d,
    skyGlow: 0x4b7496,
    shaftColor: 0x8fbaff,
    shaftOpacity: 0.08,
    fireflyIntensity: 1.0,
    rainIntensity: 0.0,
    lanternIntensity: 5.5,
    waterTint: 0x0c1418,
    grade: {
      exposure: 1.16,
      saturation: 1.04,
      contrast: 1.08,
      vignette: 0.38,
      lift: [-0.006, 0.002, 0.014],
      gain: [0.92, 0.98, 1.08],
    },
  },
  chuva: {
    id: 'chuva',
    label: 'Chuva Amazônica',
    hourLabel: '15:30',
    subtitle: 'Pancada tropical com névoa baixa, gotas na água e folhas úmidas',
    sunDirection: [14, 42, -16],
    sunColor: 0xb6ccc9,
    sunIntensity: 2.2,
    hemiSky: 0x6e8b8a,
    hemiGround: 0x1d2b20,
    hemiIntensity: 0.88,
    fogColor: 0x263532,
    fogDensity: 0.024,
    skyTop: 0x33474a,
    skyHorizon: 0x6b8280,
    skyGlow: 0x8fa6a2,
    shaftColor: 0xb8d4cc,
    shaftOpacity: 0.05,
    fireflyIntensity: 0.0,
    rainIntensity: 1.0,
    lanternIntensity: 1.4,
    waterTint: 0x121b18,
    grade: {
      exposure: 1.04,
      saturation: 0.94,
      contrast: 1.02,
      vignette: 0.3,
      lift: [-0.004, 0.004, 0.006],
      gain: [0.95, 1.01, 1.03],
    },
  },
};

export const TIME_PRESET_LIST: readonly TimePresetConfig[] = [
  TIME_PRESETS.manha,
  TIME_PRESETS.meiodia,
  TIME_PRESETS.pordosol,
  TIME_PRESETS.crepusculo,
  TIME_PRESETS.chuva,
];

const _cA = new THREE.Color();
const _cB = new THREE.Color();
const _vA = new THREE.Vector3();
const _vB = new THREE.Vector3();

export class LightingRig {
  readonly sunLight: THREE.DirectionalLight;
  readonly hemiLight: THREE.HemisphereLight;
  readonly skyMesh: THREE.Mesh;
  readonly skyUniforms: {
    uTopColor: { value: THREE.Color };
    uHorizonColor: { value: THREE.Color };
    uGlowColor: { value: THREE.Color };
    uSunDir: { value: THREE.Vector3 };
  };
  readonly fog: THREE.FogExp2;

  private currentPreset: TimePresetId = 'manha';
  private fromPreset: TimePresetConfig = TIME_PRESETS.manha;
  private toPreset: TimePresetConfig = TIME_PRESETS.manha;
  private transitionT = 1;
  private readonly transitionDuration = 3.5;

  private envTexture: THREE.Texture | null = null;
  private pmremGenerator: THREE.PMREMGenerator;
  private scene: THREE.Scene;

  /** Interpolated dynamic values exposed to effects/water/audio */
  shaftColor = new THREE.Color(TIME_PRESETS.manha.shaftColor);
  shaftOpacity = TIME_PRESETS.manha.shaftOpacity;
  fireflyIntensity = TIME_PRESETS.manha.fireflyIntensity;
  rainIntensity = TIME_PRESETS.manha.rainIntensity;
  lanternIntensity = TIME_PRESETS.manha.lanternIntensity;
  waterTint = new THREE.Color(TIME_PRESETS.manha.waterTint);
  grade: GradeUniformValues = {
    ...TIME_PRESETS.manha.grade,
    lift: [...TIME_PRESETS.manha.grade.lift],
    gain: [...TIME_PRESETS.manha.grade.gain],
  };

  constructor(
    scene: THREE.Scene,
    renderer: THREE.WebGLRenderer,
    shadowMapSize: number
  ) {
    this.scene = scene;
    this.pmremGenerator = new THREE.PMREMGenerator(renderer);

    const init = TIME_PRESETS.manha;
    this.fog = new THREE.FogExp2(init.fogColor, init.fogDensity);
    scene.fog = this.fog;
    scene.background = new THREE.Color(init.fogColor);

    this.sunLight = new THREE.DirectionalLight(init.sunColor, init.sunIntensity);
    this.sunLight.position.set(...init.sunDirection);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.mapSize.set(shadowMapSize, shadowMapSize);
    this.sunLight.shadow.camera.near = 2;
    this.sunLight.shadow.camera.far = 115;
    const d = 28;
    this.sunLight.shadow.camera.left = -d;
    this.sunLight.shadow.camera.right = d;
    this.sunLight.shadow.camera.top = d;
    this.sunLight.shadow.camera.bottom = -d;
    this.sunLight.shadow.camera.updateProjectionMatrix();
    this.sunLight.shadow.bias = -0.0006;
    this.sunLight.shadow.normalBias = 0.035;
    this.sunLight.shadow.radius = 3;
    scene.add(this.sunLight);
    scene.add(this.sunLight.target);

    this.hemiLight = new THREE.HemisphereLight(
      init.hemiSky,
      init.hemiGround,
      init.hemiIntensity
    );
    scene.add(this.hemiLight);

    // Sky dome shader
    this.skyUniforms = {
      uTopColor: { value: new THREE.Color(init.skyTop) },
      uHorizonColor: { value: new THREE.Color(init.skyHorizon) },
      uGlowColor: { value: new THREE.Color(init.skyGlow) },
      uSunDir: { value: new THREE.Vector3(...init.sunDirection).normalize() },
    };

    const skyGeo = new THREE.SphereGeometry(190, 24, 16);
    const skyMat = new THREE.ShaderMaterial({
      uniforms: this.skyUniforms,
      side: THREE.BackSide,
      depthWrite: false,
      fog: false,
      vertexShader: /* glsl */ `
        varying vec3 vWorldDir;
        void main() {
          vWorldDir = normalize(position);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: /* glsl */ `
        uniform vec3 uTopColor;
        uniform vec3 uHorizonColor;
        uniform vec3 uGlowColor;
        uniform vec3 uSunDir;
        varying vec3 vWorldDir;
        void main() {
          vec3 dir = normalize(vWorldDir);
          float h = clamp(dir.y * 1.45, 0.0, 1.0);
          vec3 col = mix(uHorizonColor, uTopColor, pow(h, 0.62));
          float sunDot = max(dot(dir, normalize(uSunDir)), 0.0);
          col += uGlowColor * pow(sunDot, 10.0) * 0.55;
          col += uGlowColor * pow(sunDot, 72.0) * 0.9;
          gl_FragColor = vec4(col, 1.0);
        }
      `,
    });
    this.skyMesh = new THREE.Mesh(skyGeo, skyMat);
    this.skyMesh.userData.noAO = true;
    this.skyMesh.frustumCulled = false;
    scene.add(this.skyMesh);

    this.regenerateEnvironment();
  }

  getPresetId(): TimePresetId {
    return this.currentPreset;
  }

  setPreset(id: TimePresetId, instant = false) {
    if (id === this.currentPreset && !instant) return;
    this.fromPreset = this.snapshotCurrent();
    this.toPreset = TIME_PRESETS[id];
    this.currentPreset = id;
    this.transitionT = instant ? 1 : 0;
    if (instant) {
      this.applyBlend(1);
      this.regenerateEnvironment();
    }
  }

  private snapshotCurrent(): TimePresetConfig {
    return {
      ...this.toPreset,
      sunDirection: [
        this.sunLight.position.x - this.sunLight.target.position.x,
        this.sunLight.position.y - this.sunLight.target.position.y,
        this.sunLight.position.z - this.sunLight.target.position.z,
      ],
      sunColor: this.sunLight.color.getHex(),
      sunIntensity: this.sunLight.intensity,
      hemiSky: this.hemiLight.color.getHex(),
      hemiGround: this.hemiLight.groundColor.getHex(),
      hemiIntensity: this.hemiLight.intensity,
      fogColor: this.fog.color.getHex(),
      fogDensity: this.fog.density,
      skyTop: this.skyUniforms.uTopColor.value.getHex(),
      skyHorizon: this.skyUniforms.uHorizonColor.value.getHex(),
      skyGlow: this.skyUniforms.uGlowColor.value.getHex(),
      shaftColor: this.shaftColor.getHex(),
      shaftOpacity: this.shaftOpacity,
      fireflyIntensity: this.fireflyIntensity,
      rainIntensity: this.rainIntensity,
      lanternIntensity: this.lanternIntensity,
      waterTint: this.waterTint.getHex(),
      grade: {
        ...this.grade,
        lift: [...this.grade.lift],
        gain: [...this.grade.gain],
      },
    };
  }

  /**
   * Generate a procedural PMREM environment from a miniature scene matching
   * the current sky gradient and dark emerald rainforest surround (no generic RoomEnvironment).
   */
  regenerateEnvironment() {
    const envScene = new THREE.Scene();
    const domeGeo = new THREE.SphereGeometry(12, 16, 12);
    const domeMat = new THREE.ShaderMaterial({
      side: THREE.BackSide,
      uniforms: {
        uTop: { value: this.skyUniforms.uTopColor.value.clone() },
        uHorizon: { value: this.skyUniforms.uHorizonColor.value.clone() },
        uGlow: { value: this.skyUniforms.uGlowColor.value.clone() },
        uGround: { value: this.hemiLight.groundColor.clone() },
        uSunDir: { value: this.skyUniforms.uSunDir.value.clone() },
      },
      vertexShader: /* glsl */ `
        varying vec3 vDir;
        void main() {
          vDir = normalize(position);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: /* glsl */ `
        uniform vec3 uTop;
        uniform vec3 uHorizon;
        uniform vec3 uGlow;
        uniform vec3 uGround;
        uniform vec3 uSunDir;
        varying vec3 vDir;
        void main() {
          vec3 d = normalize(vDir);
          vec3 col;
          if (d.y >= 0.0) {
            // Canopy shadow ring near horizon, golden sky gap overhead
            vec3 sky = mix(uHorizon, uTop, pow(d.y, 0.6));
            float canopyMask = smoothstep(0.02, 0.36, d.y);
            col = mix(uGround * 1.35, sky, canopyMask);
            float sunDot = max(dot(d, normalize(uSunDir)), 0.0);
            col += uGlow * pow(sunDot, 12.0) * 1.4;
          } else {
            col = uGround * 0.7;
          }
          gl_FragColor = vec4(col, 1.0);
        }
      `,
    });
    const dome = new THREE.Mesh(domeGeo, domeMat);
    envScene.add(dome);

    const rt = this.pmremGenerator.fromScene(envScene, 0.04);
    if (this.envTexture) {
      this.envTexture.dispose();
    }
    this.envTexture = rt.texture;
    this.scene.environment = this.envTexture;
    domeGeo.dispose();
    domeMat.dispose();
  }

  /**
   * Update smooth preset transition and keep sun shadow frustum centered around canoe.
   * Returns true if lighting changed and shadows should refresh.
   */
  update(dt: number, anchorX: number, anchorZ: number): boolean {
    let changed = false;
    if (this.transitionT < 1) {
      this.transitionT = Math.min(1, this.transitionT + dt / this.transitionDuration);
      const s = this.transitionT * this.transitionT * (3 - 2 * this.transitionT);
      this.applyBlend(s);
      changed = true;
      if (this.transitionT >= 1) {
        this.regenerateEnvironment();
      }
    }

    // Center sky dome & shadow frustum on canoe so shadows stay crisp across all 240m
    this.skyMesh.position.set(anchorX, 0, anchorZ);

    const sunDir = this.skyUniforms.uSunDir.value;
    this.sunLight.target.position.set(anchorX, 0, anchorZ);
    this.sunLight.position.set(
      anchorX + sunDir.x * 46,
      Math.max(12, sunDir.y * 46),
      anchorZ + sunDir.z * 46
    );
    this.sunLight.target.updateMatrixWorld();
    return changed;
  }

  private applyBlend(t: number) {
    const a = this.fromPreset;
    const b = this.toPreset;

    _vA.set(...a.sunDirection).normalize();
    _vB.set(...b.sunDirection).normalize();
    this.skyUniforms.uSunDir.value.copy(_vA).lerp(_vB, t).normalize();

    this.sunLight.color.copy(_cA.setHex(a.sunColor)).lerp(_cB.setHex(b.sunColor), t);
    this.sunLight.intensity = THREE.MathUtils.lerp(a.sunIntensity, b.sunIntensity, t);

    this.hemiLight.color.copy(_cA.setHex(a.hemiSky)).lerp(_cB.setHex(b.hemiSky), t);
    this.hemiLight.groundColor
      .copy(_cA.setHex(a.hemiGround))
      .lerp(_cB.setHex(b.hemiGround), t);
    this.hemiLight.intensity = THREE.MathUtils.lerp(a.hemiIntensity, b.hemiIntensity, t);

    this.fog.color.copy(_cA.setHex(a.fogColor)).lerp(_cB.setHex(b.fogColor), t);
    this.fog.density = THREE.MathUtils.lerp(a.fogDensity, b.fogDensity, t);
    if (this.scene.background instanceof THREE.Color) {
      this.scene.background.copy(this.fog.color);
    }

    this.skyUniforms.uTopColor.value.copy(_cA.setHex(a.skyTop)).lerp(_cB.setHex(b.skyTop), t);
    this.skyUniforms.uHorizonColor.value
      .copy(_cA.setHex(a.skyHorizon))
      .lerp(_cB.setHex(b.skyHorizon), t);
    this.skyUniforms.uGlowColor.value
      .copy(_cA.setHex(a.skyGlow))
      .lerp(_cB.setHex(b.skyGlow), t);

    this.shaftColor.copy(_cA.setHex(a.shaftColor)).lerp(_cB.setHex(b.shaftColor), t);
    this.shaftOpacity = THREE.MathUtils.lerp(a.shaftOpacity, b.shaftOpacity, t);
    this.fireflyIntensity = THREE.MathUtils.lerp(a.fireflyIntensity, b.fireflyIntensity, t);
    this.rainIntensity = THREE.MathUtils.lerp(a.rainIntensity, b.rainIntensity, t);
    this.lanternIntensity = THREE.MathUtils.lerp(a.lanternIntensity, b.lanternIntensity, t);
    this.waterTint.copy(_cA.setHex(a.waterTint)).lerp(_cB.setHex(b.waterTint), t);

    this.grade.exposure = THREE.MathUtils.lerp(a.grade.exposure, b.grade.exposure, t);
    this.grade.saturation = THREE.MathUtils.lerp(a.grade.saturation, b.grade.saturation, t);
    this.grade.contrast = THREE.MathUtils.lerp(a.grade.contrast, b.grade.contrast, t);
    this.grade.vignette = THREE.MathUtils.lerp(a.grade.vignette, b.grade.vignette, t);
    for (let i = 0; i < 3; i++) {
      this.grade.lift[i] = THREE.MathUtils.lerp(a.grade.lift[i], b.grade.lift[i], t);
      this.grade.gain[i] = THREE.MathUtils.lerp(a.grade.gain[i], b.grade.gain[i], t);
    }
  }

  dispose() {
    this.skyMesh.geometry.dispose();
    (this.skyMesh.material as THREE.Material).dispose();
    if (this.envTexture) {
      this.envTexture.dispose();
    }
    this.pmremGenerator.dispose();
  }
}
