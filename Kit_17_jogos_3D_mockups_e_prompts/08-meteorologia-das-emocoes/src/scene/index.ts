/**
 * Meteorologia das Emocoes — cena 3D (Three.js).
 * Camera, luzes, objetos, animacao do clima e render loop.
 */

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import {
  buildDomeFrame,
  buildWindowGlass,
  buildConsole,
  buildDial,
  buildArmillary,
  buildTelescope,
  buildGlobe,
  buildPlants,
  buildDeskProps,
  PALETTE,
  setDialPointer,
} from './objects.js';
import { Sky } from './sky.js';
import { TweenManager, Tween, easeOutCubic } from './animation.js';
import type { Weather } from '../game/state.js';

type DialKind = 'sun' | 'cloud' | 'rain' | 'wind';

export interface SceneOptions {
  mobile: boolean;
  dpr: number;
}

export class Scene3D {
  renderer: THREE.WebGLRenderer;
  camera: THREE.PerspectiveCamera;
  scene: THREE.Scene;
  controls: OrbitControls;
  tweenManager = new TweenManager();

  public dials = new Map<DialKind, THREE.Group>();
  private sky!: Sky;
  private plantsObj!: THREE.Group;
  private light!: THREE.DirectionalLight;
  private ambient!: THREE.AmbientLight;

  private currentWeather: Weather = { sun: 2, cloud: 2, rain: 0, wind: 0 };

  private readonly dialPositions: Record<DialKind, { x: number; z: number }> = {
    sun: { x: -0.85, z: -0.25 },
    cloud: { x: -0.28, z: -0.25 },
    rain: { x: 0.28, z: -0.25 },
    wind: { x: 0.85, z: -0.25 },
  };

  constructor(canvas: HTMLCanvasElement, opts: SceneOptions) {
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(Math.min(opts.dpr, opts.mobile ? 1.5 : 2));
    this.renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;

    this.camera = new THREE.PerspectiveCamera(opts.mobile ? 45 : 40, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
    this.setupCamera(opts.mobile);

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(PALETTE.woodDark);

    this.ambient = new THREE.AmbientLight(0xfaf5e9, 0.55);
    this.scene.add(this.ambient);

    this.light = new THREE.DirectionalLight(0xfdf6e3, 0.9);
    this.light.position.set(-4, 6, 2);
    this.light.castShadow = true;
    this.light.shadow.mapSize.width = opts.mobile ? 1024 : 2048;
    this.light.shadow.mapSize.height = opts.mobile ? 1024 : 2048;
    this.light.shadow.camera.near = 0.5;
    this.light.shadow.camera.far = 20;
    this.light.shadow.camera.left = -7;
    this.light.shadow.camera.right = 7;
    this.light.shadow.camera.top = 7;
    this.light.shadow.camera.bottom = -7;
    this.light.shadow.bias = -0.0005;
    this.scene.add(this.light);

    this.buildWorld(opts.mobile);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.1;
    this.controls.enablePan = false;
    this.controls.minDistance = opts.mobile ? 3.5 : 4.5;
    this.controls.maxDistance = opts.mobile ? 9 : 14;
    this.controls.minPolarAngle = Math.PI / 6;
    this.controls.maxPolarAngle = Math.PI / 2 + Math.PI / 12;
    this.controls.target.set(0, 1, 0);

    window.addEventListener('resize', () => this.onResize(opts.mobile));
  }

  private setupCamera(mobile: boolean): void {
    if (mobile) {
      this.camera.position.set(0, 2.2, 5.2);
      this.camera.lookAt(0, 1.1, 0);
    } else {
      this.camera.position.set(0, 1.9, 6.4);
      this.camera.lookAt(0, 1.2, 0);
    }
  }

  private buildWorld(mobile: boolean): void {
    const dome = buildDomeFrame();
    this.scene.add(dome);
    const windowGlass = buildWindowGlass();
    this.scene.add(windowGlass);

    this.sky = new Sky(this.scene, mobile ? 200 : 500);
    this.sky.buildRain(mobile ? 200 : 500);

    const armillary = buildArmillary();
    this.scene.add(armillary);

    const telescope = buildTelescope();
    this.scene.add(telescope);

    const globe = buildGlobe();
    this.scene.add(globe);

    this.plantsObj = buildPlants(mobile ? 10 : 14);
    this.scene.add(this.plantsObj);

    const props = buildDeskProps();
    this.scene.add(props);

    this.scene.add(buildConsole());

    const kinds: DialKind[] = ['sun', 'cloud', 'rain', 'wind'];
    kinds.forEach((kind) => {
      const dial = buildDial(kind);
      const pos = this.dialPositions[kind];
      dial.position.set(pos.x, 1.12, pos.z);
      dial.rotation.x = -0.09;
      setDialPointer(dial, this.currentWeather[kind]);
      this.dials.set(kind, dial);
      this.scene.add(dial);
    });
  }

  // ------------------------------------------------------------------
  // Estado do clima -> 3D (interpolacao 0.8-1.5 s)
  // ------------------------------------------------------------------

  setTargetWeather(weather: Weather): void {
    const kinds: DialKind[] = ['sun', 'cloud', 'rain', 'wind'];
    kinds.forEach((kind) => {
      const dial = this.dials.get(kind)!;
      const pointer = dial.children.find((c) => c.name === `${kind}_pointer`) as THREE.Group | undefined;
      if (!pointer) return;
      const from = pointer.rotation.z;
      const to = this.angleForPosition(weather[kind]);
      const dur = 0.8 + (this.shortestDelta(from, to) / Math.PI) * 0.7;
      const tween = new Tween(from, to, dur, easeOutCubic, (v) => {
        pointer.rotation.z = v;
      });
      this.tweenManager.add(tween);
    });
  }

  private angleForPosition(p: number): number {
    return ((-110 + p * 55) * Math.PI) / 180;
  }

  private shortestDelta(a: number, b: number): number {
    let d = b - a;
    while (d > Math.PI) d -= Math.PI * 2;
    while (d < -Math.PI) d += Math.PI * 2;
    return Math.abs(d);
  }

  setMobileReduced(reduced: boolean): void {
    this.sky.setRainIntensity(this.currentWeather.rain);
    if (reduced && this.sky.rain) this.sky.rain.visible = false;
  }

  // ------------------------------------------------------------------
  // Loop
  // ------------------------------------------------------------------

  update(dt: number, weather: Weather): void {
    this.currentWeather = weather;
    this.tweenManager.step(dt);

    this.sky.setCloudOpacity(weather.cloud);
    this.sky.setRainIntensity(weather.rain);
    this.sky.setWindInfluence(weather.wind);
    this.sky.update(dt);

    const sunFactor = weather.sun / 4;
    this.light.color.setHex(0xfdf6e3).lerp(new THREE.Color(0xffb347), sunFactor * 0.6);
    this.light.intensity = 0.7 + sunFactor * 0.6;
    this.ambient.intensity = 0.55 + sunFactor * 0.25;

    const cloudFactor = weather.cloud / 4;
    this.light.intensity *= 1 - cloudFactor * 0.35;

    const t = performance.now() / 1000;
    this.updatePlantsWind(weather.wind, t);

    this.controls.update();
  }

  private plantDummy = new THREE.Object3D();

  private updatePlantsWind(wind: number, t: number): void {
    const inst = this.plantsObj.children[0] as THREE.InstancedMesh | undefined;
    if (!inst) return;
    const { mats, bases, radii, heights, scales } = (inst as any).userData as {
      mats: number[];
      bases: number[];
      radii: number[];
      heights: number[];
      scales: number[];
    };
    const strength = wind / 4;
    for (let i = 0; i < inst.count; i++) {
      const angle = bases[i];
      const r = radii ? radii[i] : 2.0;
      const h = heights ? heights[i] : 0.6;
      const sc = scales ? scales[i] : 1.0;
      const sway = Math.sin(t * 1.2 + i) * strength * 0.15 * mats[i];
      this.plantDummy.position.set(Math.cos(angle + sway) * r, h, Math.sin(angle + sway) * r);
      this.plantDummy.rotation.y = angle + sway * 0.5 + Math.PI;
      this.plantDummy.scale.setScalar(sc);
      this.plantDummy.updateMatrix();
      inst.setMatrixAt(i, this.plantDummy.matrix);
    }
    inst.instanceMatrix.needsUpdate = true;
  }

  onResize(mobile: boolean): void {
    const canvas = this.renderer.domElement;
    this.camera.aspect = canvas.clientWidth / canvas.clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
    this.controls.minDistance = mobile ? 3.5 : 4.5;
    this.controls.maxDistance = mobile ? 9 : 14;
  }

  render(): void {
    this.renderer.render(this.scene, this.camera);
  }

  setPointerLocked(locked: boolean): void {
    this.controls.enabled = !locked;
  }

  dispose(): void {
    this.controls.dispose();
    this.tweenManager.clear();
    this.sky.dispose();
    this.scene.traverse((c) => {
      if (c instanceof THREE.Mesh) {
        c.geometry.dispose();
        if (Array.isArray(c.material)) c.material.forEach((m) => m.dispose());
        else c.material.dispose();
      }
    });
    this.renderer.dispose();
  }
}
