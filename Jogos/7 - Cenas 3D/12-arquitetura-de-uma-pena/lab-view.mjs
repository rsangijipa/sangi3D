import * as T from '../../../Sistema/shared/vendor/three.module.js';
import { at, axisY, BARBS, clamp, LENGTH, ROOT, spanAt } from './feather-state.mjs';

const segments = 8;
const tau = Math.PI * 2;
const random = (i) => {
  const x = Math.sin(i * 198.81 + 1.87) * 12909.53;
  return x - Math.floor(x);
};
const xAt = t => (t - 0.5) * LENGTH;
const axisZ = (t, bend) => 0.079 + 0.061 * t + bend * (t ** 2.4) * (bend < 0 ? 0.25 : 0.98);
const sweep = (t, side) => (side > 0 ? 0.77 : 0.69) * Math.sin(Math.PI * t) ** 0.69;

function surfacePoint(out, t, side, along, spread, bend, irregularity = 0) {
  const width = spanAt(t, side) * (1 + irregularity * 0.055);
  const open = along ** 1.45;
  return out.set(
    xAt(t) + sweep(t, side) * along ** 0.84 + spread * open * 0.23,
    axisY(t) + side * width * along,
    axisZ(t, bend) + (0.16 * Math.sin(along * Math.PI) - 0.13 * along ** 1.85) * width
      + Math.abs(spread) * open * 0.11 + irregularity * along * 0.035
      + bend * along * width * 0.12
  );
}

function drawTexture(size, paint) {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d');
  paint(ctx);
  return new T.CanvasTexture(canvas);
}

function deskMaterial(isWood) {
  const texture = drawTexture(512, ctx => {
    const image = ctx.createImageData(512, 512);
    for (let y = 0; y < 512; y++) {
      for (let x = 0; x < 512; x++) {
        const noise = random(x + y * 512) - 0.5;
        const grain = isWood
          ? 10 * Math.sin(y * 0.21 + Math.sin(x * 0.029) * 3) + 4 * Math.sin(y * 0.77 + x * 0.063)
          : 2.4 * Math.sin(y * 0.79) * Math.sin(x * 0.58);
        const fade = 5 * Math.sin(x * 0.028 + y * 0.038);
        const offset = 4 * (y * 512 + x);
        const bases = isWood ? [69, 43, 28] : [31, 37, 34];
        for (let c = 0; c < 3; c++) image.data[offset + c] = bases[c] + 11 * noise + grain + fade;
        image.data[offset + 3] = 255;
      }
    }
    ctx.putImageData(image, 0, 0);
  });
  texture.colorSpace = T.SRGBColorSpace;
  texture.wrapS = texture.wrapT = T.RepeatWrapping;
  texture.repeat.set(isWood ? 7 : 4, isWood ? 6 : 3);
  texture.anisotropy = 8;
  return new T.MeshStandardMaterial({ map: texture, bumpMap: texture, bumpScale: isWood ? 0.025 : 0.008, roughness: 0.93 });
}

function swatch(i, side, t, v, out) {
  const ripple = Math.sin(4.4 * t + 2.0 * v + side * 0.7) * 0.5 + 0.5;
  const band = Math.sin((t * 3.6 + v * 1.34) * tau) * 0.5 + 0.5;
  const outer = v ** 3;
  const hue = 0.10 + ripple * 0.32 + 0.072 * band - outer * 0.083;
  const brightness = 0.125 + ripple * 0.11 + band * 0.062 + 0.044 * random(i + side) + outer * 0.022;
  return out.setHSL(hue, 0.48 + 0.22 * band, brightness, T.SRGBColorSpace);
}

class FeatherMesh {
  constructor(group) {
    const geometry = new T.BufferGeometry();
    const count = BARBS * 2 * (segments + 1) * 2;
    const positions = new T.BufferAttribute(new Float32Array(count * 3), 3).setUsage(T.DynamicDrawUsage);
    const colors = new T.BufferAttribute(new Float32Array(count * 3), 3);
    const indices = [];
    const color = new T.Color();
    for (const side of [-1, 1]) for (let i = 0; i < BARBS; i++) {
      const offset = (side > 0 ? BARBS + i : i) * (segments + 1) * 2;
      for (let j = 0; j <= segments; j++) {
        const index = offset + j * 2;
        swatch(i, side, at(i), j / segments, color);
        colors.setXYZ(index, color.r, color.g, color.b);
        color.multiplyScalar(0.67 + 0.17 * random(i + 3));
        colors.setXYZ(index + 1, color.r, color.g, color.b);
        if (j < segments) indices.push(index, index + 1, index + 2, index + 1, index + 3, index + 2);
      }
    }
    geometry.setAttribute('position', positions);
    geometry.setAttribute('color', colors);
    geometry.setIndex(indices);
    const vane = new T.Mesh(geometry, new T.MeshPhysicalMaterial({
      vertexColors: true, side: T.DoubleSide, roughness: 0.46, metalness: 0.29,
      iridescence: 0.37, iridescenceIOR: 1.42, iridescenceThicknessRange: [165, 340],
      clearcoat: 0.11, sheen: 0.22, sheenColor: new T.Color(0x688e6a), envMapIntensity: 0.76
    }));
    vane.castShadow = vane.receiveShadow = true;
    vane.frustumCulled = false;
    group.add(vane);
    this.vane = vane;

    const shaftGeometry = new T.CylinderGeometry(1, 1, 1, 10, 80, true);
    this.shaft = new T.Mesh(shaftGeometry, new T.MeshStandardMaterial({
      color: 0xb89c64, roughness: 0.40, metalness: 0.04
    }));
    this.shaft.frustumCulled = false;
    this.shaft.castShadow = true;
    const source = shaftGeometry.attributes.position;
    this.shaftBase = source.array.slice();
    source.setUsage(T.DynamicDrawUsage);
    group.add(this.shaft);

    this.detail = new T.InstancedMesh(new T.CylinderGeometry(0.55, 1, 1, 4),
      new T.MeshStandardMaterial({ color: 0xb0ac80, roughness: 0.62, metalness: 0.11 }), 42 * 2 * 12);
    this.detail.instanceMatrix.setUsage(T.DynamicDrawUsage);
    this.detail.frustumCulled = false;
    this.detail.visible = false;
    group.add(this.detail);

    this.point = new T.Vector3();
    this.end = new T.Vector3();
    this.direction = new T.Vector3();
    this.dummy = new T.Object3D();
    this.up = new T.Vector3(0, 1, 0);
  }

  update(state, detail) {
    const pos = this.vane.geometry.attributes.position;
    for (const side of [-1, 1]) {
      const edits = state.fibers[side > 0 ? 1 : 0];
      for (let i = 0; i < BARBS; i++) {
        const station = at(i);
        const uneven = random(i + side * 33) * 2 - 1;
        const offset = (side > 0 ? BARBS + i : i) * (segments + 1) * 2;
        for (let j = 0; j <= segments; j++) {
          const along = j / segments;
          const ridge = (0.021 + 0.002 * uneven) * (1 - 0.20 * along - 0.55 * along ** 12);
          const point = surfacePoint(this.point, station, side, along, edits[i], state.bend, uneven);
          pos.setXYZ(offset + j * 2, point.x - ridge, point.y, point.z);
          pos.setXYZ(offset + j * 2 + 1, point.x + ridge, point.y, point.z - 0.012);
        }
      }
    }
    pos.needsUpdate = true;
    this.vane.geometry.computeVertexNormals();

    const shaft = this.shaft.geometry.attributes.position;
    for (let i = 0; i < shaft.count; i++) {
      const t = this.shaftBase[i * 3 + 1] + 0.5;
      const r = 0.004 + (1 - t) ** 1.46 * 0.039;
      shaft.setXYZ(i, xAt(t), axisY(t) - this.shaftBase[i * 3] * r,
        axisZ(t, state.bend) + 0.016 + this.shaftBase[i * 3 + 2] * r);
    }
    shaft.needsUpdate = true;
    this.shaft.geometry.computeVertexNormals();

    this.detail.visible = detail;
    if (detail) this.updateBarbules(state);
  }

  updateBarbules(state) {
    const first = clamp(state.index(state.focus) - 21, 0, BARBS - 42);
    let index = 0;
    for (const side of [-1, 1]) {
      const edits = state.fibers[side > 0 ? 1 : 0];
      for (let i = first; i < first + 42; i++) {
        for (let j = 0; j < 12; j++) {
          const v = 0.20 + 0.053 * j;
          const t = at(i);
          const uneven = random(i + side * 33) * 2 - 1;
          surfacePoint(this.point, t, side, v, edits[i], state.bend, uneven);
          surfacePoint(this.end, t, side, v + 0.036, edits[i], state.bend, uneven);
          this.point.z += 0.014;
          this.end.x += (j % 2 ? -1 : 1) * (0.028 + random(i + j) * 0.016);
          this.end.z += 0.018;
          this.direction.subVectors(this.end, this.point);
          this.dummy.position.copy(this.point).lerp(this.end, 0.5);
          const length = this.direction.length();
          this.dummy.quaternion.setFromUnitVectors(this.up, this.direction.normalize());
          this.dummy.scale.set(0.0020, length, 0.0020);
          this.dummy.updateMatrix();
          this.detail.setMatrixAt(index++, this.dummy.matrix);
        }
      }
    }
    this.detail.instanceMatrix.needsUpdate = true;
  }
}

class DepthOfField {
  constructor(renderer) {
    this.renderer = renderer;
    this.target = new T.WebGLRenderTarget(1, 1, {
      type: renderer.extensions.has('EXT_color_buffer_float') ? T.HalfFloatType : T.UnsignedByteType,
      depthTexture: new T.DepthTexture(1, 1, T.UnsignedIntType),
      generateMipmaps: true,
      minFilter: T.LinearMipmapLinearFilter
    });
    this.size = new T.Vector2();
    this.scene = new T.Scene();
    this.camera = new T.Camera();
    this.screen = new T.Mesh(new T.PlaneGeometry(2, 2), new T.ShaderMaterial({
      depthTest: false, depthWrite: false,
      uniforms: {
        image: { value: this.target.texture }, depth: { value: this.target.depthTexture },
        resolution: { value: this.size }, focus: { value: 4 }, aperture: { value: 0.014 },
        nearPlane: { value: 0.06 }, farPlane: { value: 40 }
      },
      vertexShader: 'varying vec2 coord; void main(){coord=uv;gl_Position=vec4(position.xy,0.,1.);}',
      fragmentShader: `
        #include <packing>
        varying vec2 coord;
        uniform sampler2D image, depth;
        uniform vec2 resolution;
        uniform float focus, aperture, nearPlane, farPlane;
        void main(){
          float z=-perspectiveDepthToViewZ(texture2D(depth,coord).r,nearPlane,farPlane);
          float radius=min(aperture*max(0.,abs(1.-focus/max(z,0.01))-0.035),0.018)*resolution.y;
          float mip=log2(max(1.,radius*0.42));
          vec3 color=textureLod(image,coord,mip).rgb;
          for(int i=0;i<8;i++){
            float angle=float(i)*2.39996;
            vec2 here=clamp(coord+vec2(cos(angle),sin(angle))*radius/resolution*.72,0.,1.);
            color+=textureLod(image,here,mip).rgb;
          }
          gl_FragColor=vec4(color/9.,1.);
          #include <tonemapping_fragment>
          #include <colorspace_fragment>
        }
      `
    }));
    this.screen.frustumCulled = false;
    this.scene.add(this.screen);
  }

  render(scene, camera, focus, aperture) {
    this.renderer.getDrawingBufferSize(this.size);
    if (this.size.x !== this.target.width || this.size.y !== this.target.height) {
      this.target.setSize(this.size.x, this.size.y);
    }
    this.screen.material.uniforms.focus.value = focus;
    this.screen.material.uniforms.aperture.value = aperture;
    this.renderer.setRenderTarget(this.target);
    this.renderer.render(scene, camera);
    this.renderer.setRenderTarget(null);
    this.renderer.render(this.scene, this.camera);
  }

  dispose() {
    this.target.dispose();
    this.screen.geometry.dispose();
    this.screen.material.dispose();
  }
}

export class LabView {
  constructor(canvas) {
    this.canvas = canvas;
    this.renderer = new T.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
    this.renderer.outputColorSpace = T.SRGBColorSpace;
    this.renderer.toneMapping = T.ACESFilmicToneMapping;
    this.renderer.shadowMap.type = T.PCFShadowMap;
    this.renderer.shadowMap.autoUpdate = false;
    this.renderer.info.autoReset = false;
    this.camera = new T.PerspectiveCamera(38, 1, 0.06, 40);
    this.scene = new T.Scene();
    this.scene.background = new T.Color(0x171915);
    const lights = new T.HemisphereLight(0xc5dad1, 0x40342f, 1.45);
    this.scene.add(lights);
    this.key = new T.DirectionalLight(0xffe6bb, 3.15);
    this.key.castShadow = true;
    Object.assign(this.key.shadow.camera, { left: -5, right: 5, top: 4, bottom: -4, near: 0.5, far: 16 });
    this.key.shadow.camera.updateProjectionMatrix();
    this.key.shadow.bias = -0.00025;
    this.key.shadow.normalBias = 0.012;
    this.key.shadow.radius = 3;
    this.scene.add(this.key);
    const fill = new T.DirectionalLight(0x8dbbc3, 1.15);
    fill.position.set(2.5, 4.2, 4.0);
    this.scene.add(fill);

    const pmrem = new T.PMREMGenerator(this.renderer);
    const studio = new T.Scene();
    studio.background = new T.Color(0x2a312d);
    const card = new T.Mesh(new T.PlaneGeometry(8, 3), new T.MeshBasicMaterial({
      color: new T.Color(1.6, 1.43, 1.13), side: T.DoubleSide
    }));
    card.position.set(-2, 1.6, 6.7);
    studio.add(card);
    this.env = pmrem.fromScene(studio, 0.14);
    pmrem.dispose();
    card.geometry.dispose();
    card.material.dispose();
    this.scene.environment = this.env.texture;
    this.scene.environmentIntensity = 0.65;

    this.specimen = new T.Group();
    this.scene.add(this.specimen);
    this.mesh = new FeatherMesh(this.specimen);
    this.buildWorkbench();
    this.buildProbe();
    this.lens = new DepthOfField(this.renderer);
    this.ray = new T.Raycaster();
    this.stage = new T.Plane(new T.Vector3(0, 0, 1), -0.17);
    this.pointer = new T.Vector2();
    this.hit = new T.Vector3();
    this.eyeTarget = new T.Vector3();
    this.cameraBand = 'overview';
    this.lastRevision = -1;
    this.lastDetail = false;
    this.lastFocus = -1;
    this.lastLight = -1;
  }

  buildWorkbench() {
    const createSurface = (width, height, mat, x, y, z) => {
      const surface = new T.Mesh(new T.PlaneGeometry(width, height), mat);
      surface.position.set(x, y, z);
      surface.receiveShadow = true;
      this.scene.add(surface);
    };
    createSurface(46, 34, deskMaterial(true), 0, 0, -0.145);
    const mat = deskMaterial(false);
    createSurface(12.2, 7.85, mat, 0, 0, -0.117);
    const border = new T.LineLoop(new T.BufferGeometry().setFromPoints([
      new T.Vector3(-5.83, -3.67, -0.113), new T.Vector3(5.83, -3.67, -0.113),
      new T.Vector3(5.83, 3.67, -0.113), new T.Vector3(-5.83, 3.67, -0.113)
    ]), new T.LineBasicMaterial({ color: 0x575748 }));
    this.scene.add(border);

    const reticle = new T.Group();
    const gold = new T.MeshStandardMaterial({ color: 0x8f744d, metalness: 0.75, roughness: 0.42 });
    const rim = new T.Mesh(new T.TorusGeometry(0.39, 0.041, 9, 60), gold);
    const disk = new T.Mesh(new T.CircleGeometry(0.36, 60),
      new T.MeshPhysicalMaterial({ color: 0x293e39, roughness: 0.15, clearcoat: 0.72, metalness: 0.29 }));
    disk.position.z = -0.029;
    reticle.add(rim, disk);
    const marks = [];
    for (let i = 0; i < 32; i++) {
      const angle = tau * i / 32;
      const end = i % 4 === 0 ? 0.258 : 0.297;
      marks.push(new T.Vector3(Math.cos(angle) * 0.348, Math.sin(angle) * 0.348, -0.01),
        new T.Vector3(Math.cos(angle) * end, Math.sin(angle) * end, -0.01));
    }
    reticle.add(new T.LineSegments(new T.BufferGeometry().setFromPoints(marks),
      new T.LineBasicMaterial({ color: 0x697e71 })));
    reticle.position.set(3.8, 2.16, 0);
    this.scene.add(reticle);
  }

  buildProbe() {
    this.probe = new T.Group();
    const steel = new T.MeshStandardMaterial({ color: 0xb0aa9a, roughness: 0.27, metalness: 0.88 });
    const brass = new T.MeshStandardMaterial({ color: 0x92704b, roughness: 0.41, metalness: 0.73 });
    const rubber = new T.MeshStandardMaterial({ color: 0x292c25, roughness: 0.77 });
    const part = (top, bottom, length, center, material) => {
      const mesh = new T.Mesh(new T.CylinderGeometry(top, bottom, length, 14), material);
      mesh.rotation.z = -Math.PI / 2;
      mesh.position.x = center;
      mesh.castShadow = true;
      this.probe.add(mesh);
    };
    part(0.024, 0.001, 0.30, 0.15, steel);
    part(0.038, 0.023, 0.23, 0.415, steel);
    part(0.058, 0.038, 0.17, 0.615, brass);
    part(0.056, 0.058, 0.62, 1.01, rubber);
    part(0.037, 0.058, 0.12, 1.38, brass);
    for (let i = 0; i < 7; i++) part(0.0595, 0.0595, 0.008, 0.76 + i * 0.037, brass);
    this.scene.add(this.probe);
  }

  resize(width, height, quality) {
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    const dprLimit = { low: 1, medium: 1.3, high: 1.8 }[quality];
    this.renderer.setPixelRatio(Math.min(dprLimit, window.devicePixelRatio || 1));
    this.renderer.setSize(width, height, false);
    this.specimen.rotation.z = this.camera.aspect < 0.84 ? 0.89 : 0.40;
    const shadowSize = quality === 'high' ? 2048 : 1024;
    this.renderer.shadowMap.enabled = quality !== 'low';
    if (shadowSize !== this.key.shadow.mapSize.x) {
      this.key.shadow.mapSize.set(shadowSize, shadowSize);
      this.key.shadow.map?.dispose();
      this.key.shadow.map = null;
    }
    this.renderer.shadowMap.needsUpdate = true;
    this.specimen.updateMatrixWorld();
  }

  pick(clientX, clientY) {
    const rect = this.canvas.getBoundingClientRect();
    this.pointer.set((clientX - rect.left) / rect.width * 2 - 1, 1 - (clientY - rect.top) / rect.height * 2);
    this.ray.setFromCamera(this.pointer, this.camera);
    if (!this.ray.ray.intersectPlane(this.stage, this.hit)) return null;
    this.specimen.worldToLocal(this.hit);
    const raw = this.hit.x / LENGTH + 0.5;
    const side = this.hit.y >= axisY(clamp(raw)) ? 1 : -1;
    const approximateWidth = spanAt(clamp(raw - 0.055), side);
    const along = Math.abs(this.hit.y - axisY(clamp(raw))) / Math.max(approximateWidth, 0.12);
    const station = raw - clamp(along) * sweep(clamp(raw), side) / LENGTH;
    return {
      station: clamp(station, ROOT, 0.98), side, along,
      onVane: station >= ROOT && station <= 1 && along > 0.19 && along <= 1.14,
      onFeather: raw >= 0.01 && raw < 1.08 && along < 1.22
    };
  }

  render(state, controls) {
    const detail = controls.zoom >= 2.55;
    if (state.revision !== this.lastRevision || detail !== this.lastDetail || (detail && state.focus !== this.lastFocus)) {
      this.mesh.update(state, detail);
      this.lastRevision = state.revision;
      this.lastDetail = detail;
      this.lastFocus = state.focus;
      this.renderer.shadowMap.needsUpdate = true;
    }
    if (controls.light !== this.lastLight) {
      const angle = controls.light * Math.PI / 180;
      this.key.position.set(Math.cos(angle) * 5, Math.sin(angle) * 5, 3.3);
      this.renderer.shadowMap.needsUpdate = true;
      this.lastLight = controls.light;
    }

    const probeHit = controls.probe;
    if (probeHit) {
      const station = probeHit.station;
      const gap = state.fibers[probeHit.side > 0 ? 1 : 0][state.index(station)];
      surfacePoint(this.probe.position, station, probeHit.side, clamp(probeHit.along, 0.2, 0.95), gap, state.bend);
      this.specimen.localToWorld(this.probe.position);
      this.probe.position.z += 0.014;
      this.probe.rotation.set(0, -0.24, probeHit.side > 0 ? 0.54 : -0.68);
      this.renderer.shadowMap.needsUpdate = true;
    } else {
      const changed = this.probe.position.x !== 2.36;
      this.probe.position.set(2.36, -1.62, -0.033);
      this.probe.rotation.set(0, 0, -0.41);
      this.renderer.shadowMap.needsUpdate ||= changed;
    }

    this.eyeTarget.set(0.12, 0.06, 0.05);
    if (controls.zoom > 1) {
      this.hit.set(xAt(state.focus) + 0.38, axisY(state.focus) + state.side * 0.25, 0.12);
      this.specimen.localToWorld(this.hit);
      this.eyeTarget.lerp(this.hit, Math.min(1, (controls.zoom - 1) / 1.25));
    }
    const distance = (this.camera.aspect < 0.84 ? 12.65 : 8.15) / controls.zoom;
    const tilt = controls.tilt;
    this.camera.position.set(Math.sin(controls.orbit) * distance * 0.48, -Math.sin(tilt) * distance, Math.cos(tilt) * distance)
      .add(this.eyeTarget);
    this.camera.lookAt(this.eyeTarget);
    this.camera.updateMatrixWorld();
    this.renderer.toneMappingExposure = controls.exposure;
    this.renderer.info.reset();
    if (controls.dof && controls.quality !== 'low') {
      const lensFocus = this.camera.position.distanceTo(this.eyeTarget) * controls.focus;
      this.lens.render(this.scene, this.camera, lensFocus, detail ? 0.040 : 0.018);
    } else {
      this.renderer.render(this.scene, this.camera);
    }
    return detail;
  }

  dispose() {
    this.lens.dispose();
    this.env.dispose();
    const geometries = new Set();
    const materials = new Set();
    const textures = new Set();
    this.scene.traverse(object => {
      if (object.isInstancedMesh) object.dispose();
      if (object.geometry) geometries.add(object.geometry);
      if (object.material) materials.add(object.material);
    });
    for (const material of materials) {
      for (const value of Object.values(material)) if (value?.isTexture) textures.add(value);
      material.dispose();
    }
    for (const geometry of geometries) geometry.dispose();
    for (const texture of textures) texture.dispose();
    this.renderer.dispose();
  }
}
