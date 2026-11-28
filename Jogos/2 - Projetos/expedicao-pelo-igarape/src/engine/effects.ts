/**
 * Atmospheric & physical GPU effects for the Amazonian Igarapé:
 * - Animated tannin-dark reflective water surface following the river spline
 * - Diagonal volumetric sunbeams with distance + near-camera fade (no white veil)
 * - Floating golden dust/pollen motes illuminated inside sunbeams
 * - Pooled paddle water splashes & concentric wake rings (zero GC)
 * - Fireflies (Crepúsculo) & GPU falling rain streaks (Chuva Amazônica)
 *
 * All atmospheric effects are tagged userData.noAO = true and castShadow = false.
 */

import * as THREE from 'three';
import { MaterialLibrary } from './pbr';
import { RIVER_LENGTH, sampleRiver } from '../sim/river';

export class IgarapeWater {
  readonly mesh: THREE.Mesh;
  readonly material: THREE.MeshStandardMaterial;
  private normalMap: THREE.CanvasTexture;
  private uniforms = {
    uTime: { value: 0 },
    uRain: { value: 0 },
  };

  constructor(mats: MaterialLibrary) {
    this.normalMap = mats.waterNormal;
    this.normalMap.repeat.set(12, 86);

    // Build curved river surface ribbon matching the igarapé spline
    const segmentsS = 140;
    const segmentsW = 8;
    const positions: number[] = [];
    const normals: number[] = [];
    const uvs: number[] = [];
    const indices: number[] = [];

    for (let i = 0; i <= segmentsS; i++) {
      const s = -14 + (i / segmentsS) * (RIVER_LENGTH + 28);
      const sample = sampleRiver(s);
      const span = sample.halfWidth + 4.8; // extend under banks so edges never crack
      for (let j = 0; j <= segmentsW; j++) {
        const u = j / segmentsW;
        const lat = (u * 2 - 1) * span;
        const wx = sample.center.x + sample.right.x * lat;
        const wz = sample.center.z + sample.right.z * lat;
        positions.push(wx, 0, wz);
        normals.push(0, 1, 0);
        uvs.push(u * 2.2, (s + 14) * 0.14);
      }
    }

    const stride = segmentsW + 1;
    for (let i = 0; i < segmentsS; i++) {
      for (let j = 0; j < segmentsW; j++) {
        const a = i * stride + j;
        const b = (i + 1) * stride + j;
        const c = (i + 1) * stride + (j + 1);
        const d = i * stride + (j + 1);
        indices.push(a, d, b);
        indices.push(b, d, c);
      }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geo.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
    geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    geo.setIndex(indices);

    this.material = new THREE.MeshStandardMaterial({
      color: 0x0c130a,
      roughness: 0.12,
      metalness: 0.24,
      normalMap: this.normalMap,
      normalScale: new THREE.Vector2(0.32, 0.32),
      envMapIntensity: 1.45,
    });

    // Multi-directional organic ripples (zero straight horizontal banding)
    this.material.onBeforeCompile = (shader) => {
      shader.uniforms.uTime = this.uniforms.uTime;
      shader.uniforms.uRain = this.uniforms.uRain;
      shader.vertexShader = shader.vertexShader
        .replace(
          '#include <common>',
          `#include <common>
           varying vec3 vWaterWorldPos;`
        )
        .replace(
          '#include <worldpos_vertex>',
          `#include <worldpos_vertex>
           vWaterWorldPos = (modelMatrix * vec4(transformed, 1.0)).xyz;`
        );
      shader.fragmentShader = shader.fragmentShader
        .replace(
          '#include <common>',
          `#include <common>
           uniform float uTime;
           uniform float uRain;
           varying vec3 vWaterWorldPos;`
        )
        .replace(
          '#include <normal_fragment_maps>',
          `#include <normal_fragment_maps>
           vec2 wp = vWaterWorldPos.xz;
           float w1 = sin(dot(wp, vec2(1.4, 2.3)) + uTime * 1.2) * 0.018;
           float w2 = cos(dot(wp, vec2(-2.1, 1.7)) - uTime * 1.55) * 0.016;
           float w3 = sin(dot(wp, vec2(3.6, -2.9)) + uTime * 2.1) * 0.012;
           float rainRip = uRain * sin(length(fract(wp * 0.85) - 0.5) * 34.0 - uTime * 11.0) * 0.075;
           normal = normalize(normal + vec3(w1 + w3 + rainRip, 0.0, w2 - w3 + rainRip));`
        );
    };

    this.mesh = new THREE.Mesh(geo, this.material);
    this.mesh.receiveShadow = true;
    this.mesh.castShadow = false;
    this.mesh.userData.noAO = true;
  }

  update(dt: number, elapsed: number, waterTint: THREE.Color, rainIntensity: number) {
    this.uniforms.uTime.value = elapsed;
    this.uniforms.uRain.value = rainIntensity;
    // Scroll normal map gently downstream to match the vector current
    this.normalMap.offset.y -= dt * 0.045;
    this.normalMap.offset.x = Math.sin(elapsed * 0.22) * 0.03;
    this.material.color.copy(waterTint).multiplyScalar(0.68);
    this.material.roughness = THREE.MathUtils.lerp(0.11, 0.25, rainIntensity);
  }

  dispose() {
    this.mesh.geometry.dispose();
    this.material.dispose();
  }
}

/**
 * Volumetric sunbeam shafts slanting through canopy gaps.
 * Uses near-camera fade so entering a beam never turns into a flat white veil.
 */
export class VolumetricSunbeams {
  readonly group: THREE.Group;
  private material: THREE.ShaderMaterial;

  constructor() {
    this.group = new THREE.Group();
    this.group.userData.noAO = true;

    this.material = new THREE.ShaderMaterial({
      uniforms: {
        uColor: { value: new THREE.Color(0xffe9a8) },
        uOpacity: { value: 0.24 },
        uTime: { value: 0 },
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      vertexShader: /* glsl */ `
        varying vec2 vUv;
        varying vec3 vWorldPos;
        varying vec3 vNormalDir;
        void main() {
          vUv = uv;
          vec4 wp = modelMatrix * vec4(position, 1.0);
          vWorldPos = wp.xyz;
          vNormalDir = normalize(mat3(modelMatrix) * normal);
          gl_Position = projectionMatrix * viewMatrix * wp;
        }
      `,
      fragmentShader: /* glsl */ `
        uniform vec3 uColor;
        uniform float uOpacity;
        uniform float uTime;
        varying vec2 vUv;
        varying vec3 vWorldPos;
        varying vec3 vNormalDir;
        void main() {
          vec3 viewDir = normalize(cameraPosition - vWorldPos);
          float fresnel = pow(abs(dot(viewDir, vNormalDir)), 1.35);
          // Vertical fade: soft top & dissipates near water
          float vFade = smoothstep(0.0, 0.28, vUv.y) * smoothstep(1.0, 0.22, vUv.y);
          // Subtle dappled ray streaks
          float ray = 0.65 + 0.35 * sin(vUv.x * 18.85 + sin(uTime * 0.35 + vWorldPos.z * 0.1));
          // Near-camera & far-distance fade so shafts never blind the player
          float camDist = length(cameraPosition - vWorldPos);
          float nearFade = smoothstep(2.2, 7.0, camDist);
          float farFade = smoothstep(78.0, 32.0, camDist);
          float alpha = fresnel * vFade * ray * nearFade * farFade * uOpacity;
          gl_FragColor = vec4(uColor, alpha);
        }
      `,
    });

    const shaftGeo = new THREE.CylinderGeometry(0.65, 2.55, 16.5, 12, 1, true);
    // Place key shafts along all 3 stretches, with primary dramatic shafts matching the mockup
    const shaftPlacements: [number, number, number][] = [
      [25.5, 4.4, 1.15], // Hero shaft illuminating right clearing / capybara (mockup!)
      [29.5, 2.2, 0.95],
      [42.0, -1.8, 1.05],
      [62.0, 2.5, 1.1],
      [96.0, 1.6, 1.2],
      [126.0, -2.1, 1.0],
      [152.0, 2.8, 1.15],
      [186.0, 0.6, 1.35],
      [208.0, -1.5, 1.25],
    ];

    for (let i = 0; i < shaftPlacements.length; i++) {
      const [s, lat, scale] = shaftPlacements[i];
      const sample = sampleRiver(s);
      const mesh = new THREE.Mesh(shaftGeo, this.material);
      mesh.position.set(
        sample.center.x + sample.right.x * lat,
        6.6,
        sample.center.z + sample.right.z * lat
      );
      mesh.rotation.z = 0.42; // slanting from upper-right to lower-left like mockup
      mesh.rotation.x = 0.14;
      mesh.scale.set(scale, 1, scale);
      mesh.userData.noAO = true;
      mesh.castShadow = false;
      this.group.add(mesh);
    }
  }

  update(elapsed: number, color: THREE.Color, opacity: number) {
    this.material.uniforms.uTime.value = elapsed;
    this.material.uniforms.uColor.value.copy(color);
    this.material.uniforms.uOpacity.value = opacity;
    this.group.visible = opacity > 0.01;
  }

  dispose() {
    this.group.traverse((obj) => {
      if (obj instanceof THREE.Mesh) obj.geometry.dispose();
    });
    this.material.dispose();
  }
}

/**
 * Ambient golden dust motes + dusk fireflies + falling rain streaks.
 */
export class AtmosphereParticles {
  readonly group: THREE.Group;
  private dustPoints: THREE.Points;
  private dustMat: THREE.PointsMaterial;
  private fireflyPoints: THREE.Points;
  private fireflyMat: THREE.PointsMaterial;
  private fireflyBase: Float32Array;
  private rainLines: THREE.LineSegments;
  private rainMat: THREE.LineBasicMaterial;
  private rainPos: Float32Array;

  constructor(mats: MaterialLibrary, isSoftwareGl: boolean) {
    this.group = new THREE.Group();
    this.group.userData.noAO = true;

    // 1. Dust / pollen motes floating around the river corridor
    const dustCount = isSoftwareGl ? 90 : 200;
    const dustPos = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount; i++) {
      const s = 6 + Math.random() * (RIVER_LENGTH - 12);
      const sample = sampleRiver(s);
      const lat = (Math.random() - 0.5) * (sample.halfWidth * 1.7);
      dustPos[i * 3] = sample.center.x + sample.right.x * lat;
      dustPos[i * 3 + 1] = 0.8 + Math.random() * 6.5;
      dustPos[i * 3 + 2] = sample.center.z + sample.right.z * lat;
    }
    const dustGeo = new THREE.BufferGeometry();
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
    this.dustMat = new THREE.PointsMaterial({
      color: 0xffeeb3,
      map: mats.softParticleMap,
      size: 0.14,
      transparent: true,
      opacity: 0.5,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    this.dustPoints = new THREE.Points(dustGeo, this.dustMat);
    this.dustPoints.userData.noAO = true;
    this.group.add(this.dustPoints);

    // 2. Fireflies along riverbanks (visible in Pôr do Sol & Crepúsculo)
    const ffCount = isSoftwareGl ? 60 : 140;
    const ffPos = new Float32Array(ffCount * 3);
    this.fireflyBase = new Float32Array(ffCount * 3);
    for (let i = 0; i < ffCount; i++) {
      const s = 8 + Math.random() * (RIVER_LENGTH - 16);
      const sample = sampleRiver(s);
      const side = i % 2 === 0 ? -1 : 1;
      const lat = side * (sample.halfWidth * (0.75 + Math.random() * 0.55));
      const x = sample.center.x + sample.right.x * lat;
      const y = 0.5 + Math.random() * 3.4;
      const z = sample.center.z + sample.right.z * lat;
      ffPos[i * 3] = x;
      ffPos[i * 3 + 1] = y;
      ffPos[i * 3 + 2] = z;
      this.fireflyBase[i * 3] = x;
      this.fireflyBase[i * 3 + 1] = y;
      this.fireflyBase[i * 3 + 2] = z;
    }
    const ffGeo = new THREE.BufferGeometry();
    ffGeo.setAttribute('position', new THREE.BufferAttribute(ffPos, 3));
    this.fireflyMat = new THREE.PointsMaterial({
      color: 0xc8ff68,
      map: mats.softParticleMap,
      size: 0.24,
      transparent: true,
      opacity: 0.0,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    this.fireflyPoints = new THREE.Points(ffGeo, this.fireflyMat);
    this.fireflyPoints.userData.noAO = true;
    this.fireflyPoints.visible = false;
    this.group.add(this.fireflyPoints);

    // 3. Pooled rain streaks around canoe (visible in Chuva Amazônica)
    const rainCount = isSoftwareGl ? 140 : 320;
    this.rainPos = new Float32Array(rainCount * 6);
    for (let i = 0; i < rainCount; i++) {
      const rx = (Math.random() - 0.5) * 28;
      const ry = Math.random() * 14;
      const rz = (Math.random() - 0.5) * 28;
      this.rainPos[i * 6] = rx;
      this.rainPos[i * 6 + 1] = ry;
      this.rainPos[i * 6 + 2] = rz;
      this.rainPos[i * 6 + 3] = rx - 0.08;
      this.rainPos[i * 6 + 4] = ry - 0.65;
      this.rainPos[i * 6 + 5] = rz;
    }
    const rainGeo = new THREE.BufferGeometry();
    rainGeo.setAttribute('position', new THREE.BufferAttribute(this.rainPos, 3));
    this.rainMat = new THREE.LineBasicMaterial({
      color: 0xc5dcd8,
      transparent: true,
      opacity: 0.0,
      depthWrite: false,
    });
    this.rainLines = new THREE.LineSegments(rainGeo, this.rainMat);
    this.rainLines.frustumCulled = false;
    this.rainLines.userData.noAO = true;
    this.rainLines.visible = false;
    this.group.add(this.rainLines);
  }

  update(
    dt: number,
    elapsed: number,
    anchorX: number,
    anchorZ: number,
    shaftOpacity: number,
    fireflyIntensity: number,
    rainIntensity: number,
    reducedMotion: boolean
  ) {
    const motionScale = reducedMotion ? 0.25 : 1.0;

    // Dust drifts gently
    this.dustMat.opacity = Math.min(0.58, shaftOpacity * 2.1);
    this.dustPoints.position.y = Math.sin(elapsed * 0.35 * motionScale) * 0.18;

    // Fireflies bob gently when active
    this.fireflyPoints.visible = fireflyIntensity > 0.02;
    if (this.fireflyPoints.visible) {
      this.fireflyMat.opacity = fireflyIntensity * (0.72 + Math.sin(elapsed * 3.2) * 0.22);
      const attr = this.fireflyPoints.geometry.getAttribute('position') as THREE.BufferAttribute;
      const arr = attr.array as Float32Array;
      for (let i = 0; i < arr.length; i += 3) {
        const idx = i * 0.37;
        arr[i] = this.fireflyBase[i] + Math.sin(elapsed * 0.8 * motionScale + idx) * 0.45;
        arr[i + 1] = this.fireflyBase[i + 1] + Math.cos(elapsed * 1.1 * motionScale + idx) * 0.3;
        arr[i + 2] = this.fireflyBase[i + 2] + Math.cos(elapsed * 0.65 * motionScale + idx) * 0.45;
      }
      attr.needsUpdate = true;
    }

    // Rain falls continuously around canoe
    this.rainLines.visible = rainIntensity > 0.02;
    if (this.rainLines.visible) {
      this.rainMat.opacity = rainIntensity * 0.36;
      this.rainLines.position.set(anchorX, 0, anchorZ);
      const fall = dt * 15.5 * motionScale;
      const arr = this.rainPos;
      for (let i = 0; i < arr.length; i += 6) {
        arr[i + 1] -= fall;
        arr[i + 4] -= fall;
        if (arr[i + 1] < 0) {
          const ny = 12 + Math.random() * 4;
          arr[i + 1] = ny;
          arr[i + 4] = ny - 0.65;
        }
      }
      (this.rainLines.geometry.getAttribute('position') as THREE.BufferAttribute).needsUpdate = true;
    }
  }

  dispose() {
    this.dustPoints.geometry.dispose();
    this.dustMat.dispose();
    this.fireflyPoints.geometry.dispose();
    this.fireflyMat.dispose();
    this.rainLines.geometry.dispose();
    this.rainMat.dispose();
  }
}

/**
 * Zero-GC pooled water splash droplets & expanding concentric wake rings
 * triggered by paddle dips and canoe movement.
 */
interface WakeRing {
  active: boolean;
  age: number;
  maxAge: number;
  x: number;
  z: number;
  baseScale: number;
}

interface SplashDrop {
  active: boolean;
  age: number;
  maxAge: number;
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
}

const _dummy = new THREE.Object3D();

export class WakeAndSplashSystem {
  readonly group: THREE.Group;
  private ringMesh: THREE.InstancedMesh;
  private rings: WakeRing[];
  private ringCursor = 0;

  private dropMesh: THREE.InstancedMesh;
  private drops: SplashDrop[];
  private dropCursor = 0;

  constructor() {
    this.group = new THREE.Group();
    this.group.userData.noAO = true;

    const ringCount = 28;
    const ringGeo = new THREE.RingGeometry(0.26, 0.295, 24);
    ringGeo.rotateX(-Math.PI / 2);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xe6f0df,
      transparent: true,
      opacity: 0.19,
      depthWrite: false,
    });
    this.ringMesh = new THREE.InstancedMesh(ringGeo, ringMat, ringCount);
    this.ringMesh.frustumCulled = false;
    this.ringMesh.userData.noAO = true;
    this.rings = Array.from({ length: ringCount }, () => ({
      active: false,
      age: 0,
      maxAge: 1.4,
      x: 0,
      z: 0,
      baseScale: 1,
    }));
    this.group.add(this.ringMesh);

    const dropCount = 48;
    const dropGeo = new THREE.SphereGeometry(0.032, 6, 5);
    const dropMat = new THREE.MeshBasicMaterial({
      color: 0xecf4e8,
      transparent: true,
      opacity: 0.72,
      depthWrite: false,
    });
    this.dropMesh = new THREE.InstancedMesh(dropGeo, dropMat, dropCount);
    this.dropMesh.frustumCulled = false;
    this.dropMesh.userData.noAO = true;
    this.drops = Array.from({ length: dropCount }, () => ({
      active: false,
      age: 0,
      maxAge: 0.55,
      x: 0,
      y: -10,
      z: 0,
      vx: 0,
      vy: 0,
      vz: 0,
    }));
    this.group.add(this.dropMesh);

    // Hide all instances initially
    _dummy.position.set(0, -20, 0);
    _dummy.scale.setScalar(0.001);
    _dummy.updateMatrix();
    for (let i = 0; i < ringCount; i++) this.ringMesh.setMatrixAt(i, _dummy.matrix);
    for (let i = 0; i < dropCount; i++) this.dropMesh.setMatrixAt(i, _dummy.matrix);
    this.ringMesh.instanceMatrix.needsUpdate = true;
    this.dropMesh.instanceMatrix.needsUpdate = true;
  }

  spawnWakeRing(x: number, z: number, baseScale = 0.85, maxAge = 1.55) {
    const r = this.rings[this.ringCursor];
    this.ringCursor = (this.ringCursor + 1) % this.rings.length;
    r.active = true;
    r.age = 0;
    r.maxAge = maxAge;
    r.x = x;
    r.z = z;
    r.baseScale = baseScale;
  }

  spawnPaddleSplash(x: number, z: number, count = 10, strength = 1.0) {
    this.spawnWakeRing(x, z, 0.9 * strength, 1.4);
    for (let i = 0; i < count; i++) {
      const d = this.drops[this.dropCursor];
      this.dropCursor = (this.dropCursor + 1) % this.drops.length;
      const angle = Math.random() * Math.PI * 2;
      const spd = (0.55 + Math.random() * 1.15) * strength;
      d.active = true;
      d.age = 0;
      d.maxAge = 0.36 + Math.random() * 0.28;
      d.x = x + (Math.random() - 0.5) * 0.16;
      d.y = 0.04;
      d.z = z + (Math.random() - 0.5) * 0.16;
      d.vx = Math.cos(angle) * spd;
      d.vy = (1.35 + Math.random() * 1.25) * strength;
      d.vz = Math.sin(angle) * spd;
    }
  }

  update(dt: number) {
    let dirtyRings = false;
    for (let i = 0; i < this.rings.length; i++) {
      const r = this.rings[i];
      if (!r.active) continue;
      dirtyRings = true;
      r.age += dt;
      if (r.age >= r.maxAge) {
        r.active = false;
        _dummy.position.set(0, -20, 0);
        _dummy.scale.setScalar(0.001);
        _dummy.updateMatrix();
        this.ringMesh.setMatrixAt(i, _dummy.matrix);
      } else {
        const p = r.age / r.maxAge;
        const sc = r.baseScale * (0.65 + p * 3.4);
        _dummy.position.set(r.x, 0.018 + p * 0.002, r.z);
        _dummy.rotation.set(0, 0, 0);
        _dummy.scale.set(sc, 1, sc);
        _dummy.updateMatrix();
        this.ringMesh.setMatrixAt(i, _dummy.matrix);
      }
    }
    if (dirtyRings) this.ringMesh.instanceMatrix.needsUpdate = true;

    let dirtyDrops = false;
    for (let i = 0; i < this.drops.length; i++) {
      const d = this.drops[i];
      if (!d.active) continue;
      dirtyDrops = true;
      d.age += dt;
      if (d.age >= d.maxAge || d.y < -0.05) {
        d.active = false;
        _dummy.position.set(0, -20, 0);
        _dummy.scale.setScalar(0.001);
        _dummy.updateMatrix();
        this.dropMesh.setMatrixAt(i, _dummy.matrix);
      } else {
        d.vy -= 7.8 * dt;
        d.x += d.vx * dt;
        d.y += d.vy * dt;
        d.z += d.vz * dt;
        const life = 1 - d.age / d.maxAge;
        _dummy.position.set(d.x, d.y, d.z);
        _dummy.rotation.set(0, 0, 0);
        _dummy.scale.setScalar(Math.max(0.2, life * 1.15));
        _dummy.updateMatrix();
        this.dropMesh.setMatrixAt(i, _dummy.matrix);
      }
    }
    if (dirtyDrops) this.dropMesh.instanceMatrix.needsUpdate = true;
  }

  dispose() {
    this.ringMesh.geometry.dispose();
    (this.ringMesh.material as THREE.Material).dispose();
    this.dropMesh.geometry.dispose();
    (this.dropMesh.material as THREE.Material).dispose();
  }
}
