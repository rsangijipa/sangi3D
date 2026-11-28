import * as THREE from '../../../Sistema/shared/vendor/three.module.js';
import {radius, randomGenerator} from './simulation.js';
import {createSpecimenArt} from './specimen-art.js';

const vertex = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.9999, 1.0);
  }
`;

const field = `
  varying vec2 vUv;
  uniform float aspect;
  uniform float lightLevel;
  uniform float time;
  uniform vec2 center;
  uniform float zoom;
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453);
  }
  float noise(vec2 p) {
    vec2 i=floor(p), f=fract(p);
    f=f*f*(3.0-2.0*f);
    return mix(mix(hash(i), hash(i+vec2(1.,0.)), f.x), mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.)),f.x), f.y);
  }
  void main() {
    vec2 p = vUv - .5;
    vec2 lens = p * vec2(mix(1.14, .90, step(1.0, aspect)), .96);
    vec2 drift = p * vec2(aspect, 1.) / zoom + center * .033;
    float dist = length(lens);
    float vignette = 1. - smoothstep(.13, .76, dist);
    float flood = 1. - smoothstep(.08, .65, length(drift - vec2(-.16,.1)));
    float fibers = noise(drift*vec2(13.,31.) + vec2(time*.054,0.)) * noise(drift*29. + 32.);
    float haze = noise(drift*6.8+21.)*.52 + noise(drift*10.6-12.)*.29 + fibers*.35;
    vec3 color = vec3(.005,.012,.02) + (vec3(.013,.056,.079) * flood + vec3(.015,.035,.068)*haze) * vignette*lightLevel;
    color += vec3(.074,.17,.19) * smoothstep(.57,.587,dist) * (1.-smoothstep(.587,.596,dist)) * (.22+.1*haze);
    color -= smoothstep(.59,.72,dist)*vec3(.004,.008,.012);
    color += (hash(gl_FragCoord.xy) - .5) * .011 * vignette;
    gl_FragColor = vec4(max(color, 0.0),1.0);
  }
`;

const meniscusVertex = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const meniscusFragment = `
  varying vec2 vUv;
  uniform float lightLevel;
  void main() {
    vec2 p = (vUv - .5) * 2.;
    float theta = atan(p.y, p.x);
    float d = length(p) + sin(theta * 6. + .25) * .007 + cos(theta * 11.) * .003;
    float shade = smoothstep(.87,.96,d) * (1. - smoothstep(.96,.997,d));
    float rim = smoothstep(.962,.979,d) * (1. - smoothstep(.979,.989,d));
    float glint = (sin(theta * 2. + .1) + 1.) * .30 + .23;
    vec3 color = mix(vec3(.06,.17,.23), vec3(.42,.68,.69), glint) * lightLevel;
    gl_FragColor = vec4(color, (shade * .28 + rim * .80) * glint);
  }
`;

const specimenVertex = `
  varying vec2 vUv;
  uniform float phase;
  uniform float time;
  uniform float flex;
  void main() {
    vUv = uv;
    vec3 pt = position;
    pt.y += sin(pt.x * 10.7 + time * 2.4 + phase) * flex * (pt.x * pt.x + .1);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pt, 1.0);
  }
`;

const specimenFragment = `
  varying vec2 vUv;
  uniform sampler2D sampleMap;
  uniform float blur;
  uniform float lightLevel;
  uniform float fade;
  uniform float flash;
  void main() {
    vec2 delta = vec2(.014,.024) * blur;
    vec4 pixel = texture2D(sampleMap, vUv) * .56;
    pixel += texture2D(sampleMap, vUv + vec2(delta.x,delta.y*.45)) * .11;
    pixel += texture2D(sampleMap, vUv - vec2(delta.x,delta.y*.45)) * .11;
    pixel += texture2D(sampleMap, vUv + vec2(-delta.x*.44,delta.y)) * .11;
    pixel += texture2D(sampleMap, vUv - vec2(-delta.x*.44,delta.y)) * .11;
    vec3 tint = vec3(.91,1.024,1.055);
    vec3 rgb = pixel.rgb * tint * lightLevel + vec3(.15,.22,.09) * flash * pixel.a;
    gl_FragColor = vec4(rgb, pixel.a * fade);
  }
`;

const debrisVertex = `
  attribute float diameter;
  attribute float variation;
  attribute vec3 tint;
  varying float vVariation;
  varying vec3 vTint;
  varying float vBlur;
  uniform float time;
  uniform float density;
  uniform float zoom;
  uniform float focus;
  void main() {
    vec3 pt = position;
    pt.xy += vec2(sin(time*.46+variation*390.), cos(time*.39+variation*318.)) * (.07+variation*.18);
    pt.xy += vec2(cos(time*1.6+variation*54.),sin(time*1.44+variation*582.))*.034;
    vBlur = min(1., abs(focus - pt.z) * .19);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pt, 1.0);
    gl_PointSize = clamp((diameter + vBlur*4.1) * density * zoom, 1., 22.);
    vVariation = variation;
    vTint = tint;
  }
`;

const debrisFragment = `
  varying float vVariation;
  varying float vBlur;
  varying vec3 vTint;
  uniform float lightLevel;
  void main() {
    vec2 pt = gl_PointCoord - .5;
    float d = length(pt * vec2(1.0, .8+vVariation*.43));
    float core = 1.-smoothstep(.03,.28+vBlur*.10,d);
    float ring = smoothstep(.21,.36,d)*(1.-smoothstep(.37,.50,d));
    float bokeh = (core * (.72-vBlur*.36) + ring*.27) * (.45+vVariation*.55);
    gl_FragColor = vec4(vTint*lightLevel,bokeh);
  }
`;

const backgroundForms = [
  [1, -4.6, 0.26, -2.4, 2.7, .74, .44], [1, -4.05, -0.9, -1.8, 1.68, .7, .68],
  [4, 4.3, -0.2, -2.3, 2.45, 0.8, .52], [2, 6.5, 2.52, -1.8, 6.8, .91, .38],
  [3, -7.75, 2.17, -3.5, 4.0, -.23, .54], [1, 6.3, -.8, -.8, 3.23, -.46, .76],
  [2, -6.2, -2.63, -1.5, 7.3, .34, .55], [0, 7.7, -2.84, -3.45, 4.18, .1, .42],
  [1, -1.95, -3.66, -0.65, 1.43, -.8, .77], [1, 0.37, 3.45, -1.6, 1.29, .34, .64],
  [4, -2.44, 1.35, -2.1, 1.3, .9, .55], [2, 6.22, -4.1, -2.1, 6.2, -.2, .43],
  [1, -7.15, 0.36, -.27, 2.09, .2, .54], [1, 9.26, 1.68, -1.56, 2.79, 0.6, .41],
  [3, .02, -2.28, -2.78, 1.93, -1.7, .36], [4, -5.93, 3.94, -1.83, 2.37, 0.6, .68],
  [1, 3.83, 0.7, -1.76, 1.92, -1.12, .66], [1, 1.13, -3.98, -2.8, 1.37, -.36, .64],
  [2, -4.07, 5.25, -2.2, 6.1, -.42, .38], [1, 4.45, 4.24, -.45, 2.76, .7, .57],
  [1, 2.12, .42, -2.53, 1.03, -1.3, .58], [4, 2.26, -4.26, -1.68, 1.5, .29, .54],
  [3, 4.17, -3.6, -3.48, 2.57, .9, .51], [1, -9.9, -2.08, -1.1, 2.01, -1.1, .5],
];

export function microscope(stage) {
  const renderer = new THREE.WebGLRenderer({antialias: true, alpha: false, powerPreference: 'high-performance'});
  const canvas = renderer.domElement;
  canvas.tabIndex = 0;
  canvas.setAttribute('aria-label', 'Campo do microscópio. Setas deslocam a lâmina e Enter identifica o organismo central.');
  stage.prepend(canvas);

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 150);
  const fieldUniforms = {aspect: {value: 1}, lightLevel: {value: 1}, time: {value: 0}, center: {value: new THREE.Vector2()}, zoom: {value: 1}};
  const backdrop = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), new THREE.ShaderMaterial({
    uniforms: fieldUniforms, vertexShader: vertex, fragmentShader: field, depthWrite: false, depthTest: false,
  }));
  backdrop.frustumCulled = false;
  backdrop.renderOrder = -100;
  scene.add(backdrop);
  const meniscus = new THREE.Mesh(new THREE.PlaneGeometry(radius * 2.04, radius * 2.04), new THREE.ShaderMaterial({
    uniforms: {lightLevel: fieldUniforms.lightLevel}, vertexShader: meniscusVertex, fragmentShader: meniscusFragment, transparent: true, depthWrite: false,
  }));
  meniscus.position.z = -2.9;
  meniscus.renderOrder = -40;
  scene.add(meniscus);

  const art = createSpecimenArt().map((canvasTexture) => {
    const texture = new THREE.CanvasTexture(canvasTexture);
    texture.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy());
    return texture;
  });
  const plane = new THREE.PlaneGeometry(1, 0.6, 14, 8);
  function specimen(type, size, fade, flex) {
    const uniforms = {
      sampleMap: {value: art[type]}, blur: {value: 0}, lightLevel: {value: 1}, fade: {value: fade}, flash: {value: 0},
      phase: {value: type * 1.65}, time: {value: 0}, flex: {value: flex},
    };
    const material = new THREE.ShaderMaterial({uniforms, vertexShader: specimenVertex, fragmentShader: specimenFragment, transparent: true, depthWrite: false, side: THREE.DoubleSide});
    const mesh = new THREE.Mesh(plane, material);
    mesh.userData = {size, fade};
    mesh.scale.set(size, size, 1);
    scene.add(mesh);
    return mesh;
  }

  const forms = backgroundForms.map(([type, x, y, z, size, angle, fade]) => {
    const mesh = specimen(type, size, fade, type === 2 ? 0.10 : 0.04);
    mesh.position.set(x, y, z);
    mesh.rotation.z = angle;
    return mesh;
  });
  const active = [null, null, null, null, null];
  const random = randomGenerator(158354);
  const baseCount = 970;
  const dustPos = new Float32Array(baseCount * 3);
  const dustColors = new Float32Array(baseCount * 3);
  const dustSize = new Float32Array(baseCount);
  const dustVar = new Float32Array(baseCount);
  for (let i = 0; i < baseCount; i++) {
    const angle = random() * Math.PI * 2;
    const distance = (radius - .35) * Math.sqrt(random());
    const color = [[.22, .52, .61], [.45, .60, .68], [.63, .46, .25], [.34, .57, .40], [.65, .77, .77]][i % 5];
    dustPos.set([Math.cos(angle) * distance, Math.sin(angle) * distance, (random() - .56) * 9.7], i * 3);
    dustColors.set(color, i * 3);
    dustSize[i] = .9 + random() ** 4 * 5.35;
    dustVar[i] = random();
  }
  const dustGeometry = new THREE.BufferGeometry();
  dustGeometry.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
  dustGeometry.setAttribute('diameter', new THREE.BufferAttribute(dustSize, 1));
  dustGeometry.setAttribute('variation', new THREE.BufferAttribute(dustVar, 1));
  dustGeometry.setAttribute('tint', new THREE.BufferAttribute(dustColors, 3));
  const dustUniforms = {time: {value: 0}, density: {value: 1}, zoom: {value: 1}, focus: {value: 0}, lightLevel: {value: 1}};
  const dust = new THREE.Points(dustGeometry, new THREE.ShaderMaterial({uniforms: dustUniforms, vertexShader: debrisVertex, fragmentShader: debrisFragment, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending}));
  dust.renderOrder = -25;
  scene.add(dust);

  const foodGeometry = new THREE.BufferGeometry();
  const foodCount = 90;
  const foodPosition = new THREE.BufferAttribute(new Float32Array(foodCount * 3), 3).setUsage(THREE.DynamicDrawUsage);
  foodGeometry.setAttribute('position', foodPosition);
  foodGeometry.setAttribute('diameter', new THREE.BufferAttribute(Float32Array.from({length: foodCount}, () => 2.4 + random() * 4), 1));
  foodGeometry.setAttribute('variation', new THREE.BufferAttribute(Float32Array.from({length: foodCount}, random), 1));
  foodGeometry.setAttribute('tint', new THREE.BufferAttribute(Float32Array.from({length: foodCount * 3}, (_, index) => [.9, .94, .36][index % 3]), 3));
  const foodPoints = new THREE.Points(foodGeometry, dust.material);
  foodPoints.frustumCulled = false;
  foodPoints.renderOrder = 5;
  scene.add(foodPoints);

  let width = 0;
  let height = 0;
  let density = 1;
  let profile = 'high';
  const observer = new ResizeObserver(resize);
  observer.observe(stage);

  function resize() {
    const nextWidth = Math.max(1, stage.clientWidth);
    const nextHeight = Math.max(1, stage.clientHeight);
    const nextDensity = Math.min(window.devicePixelRatio || 1, {low: .85, medium: 1.25, high: 1.7}[profile]);
    if (width === nextWidth && height === nextHeight && density === nextDensity) return;
    width = nextWidth;
    height = nextHeight;
    density = nextDensity;
    renderer.setPixelRatio(density);
    renderer.setSize(width, height, false);
    fieldUniforms.aspect.value = width / height;
  }

  const pivot = new THREE.Vector3();
  const projected = new THREE.Vector3();
  const pointer = new THREE.Vector2();
  const ray = new THREE.Raycaster();
  const slide = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);

  function unitsPerPixel() {
    return (camera.top - camera.bottom) / height;
  }

  function worldAt(x, y) {
    const bounds = canvas.getBoundingClientRect();
    pointer.set(2 * (x - bounds.left) / bounds.width - 1, 1 - 2 * (y - bounds.top) / bounds.height);
    ray.setFromCamera(pointer, camera);
    return ray.ray.intersectPlane(slide, new THREE.Vector3());
  }

  function targetAt(x, y) {
    let best = null;
    let nearest = 1;
    for (let i = 0; i < active.length; i++) {
      const mesh = active[i];
      if (!mesh) continue;
      projected.copy(mesh.position).project(camera);
      const screenX = (projected.x * 0.5 + 0.5) * width;
      const screenY = (-projected.y * 0.5 + 0.5) * height;
      const dx = x - screenX;
      const dy = y - screenY;
      const angle = mesh.rotation.z;
      const extent = mesh.userData.size / unitsPerPixel();
      const ratio = [[.39, .21], [.39, .12], [.45, .22], [.34, .23], [.24, .24]][i];
      const lx = (dx * Math.cos(angle) - dy * Math.sin(angle)) / Math.max(extent * ratio[0], 23);
      const ly = (dx * Math.sin(angle) + dy * Math.cos(angle)) / Math.max(extent * ratio[1], 23);
      const distance = Math.hypot(lx, ly);
      if (distance < nearest) {
        best = i;
        nearest = distance;
      }
    }
    return best;
  }

  function render(simulation, view, alpha) {
    const {zoom, light, focus, tiltX, tiltY} = view;
    const aspect = width / Math.max(height, 1);
    const halfHeight = Math.max(4.43, 4.17 / aspect) / zoom;
    camera.left = -halfHeight * aspect;
    camera.right = halfHeight * aspect;
    camera.top = halfHeight;
    camera.bottom = -halfHeight;
    camera.updateProjectionMatrix();
    pivot.set(view.x, view.y, 0);
    camera.position.set(view.x + tiltX * 22, view.y + tiltY * 22, 24);
    camera.lookAt(pivot);
    camera.updateMatrixWorld();
    const t = simulation.time;
    fieldUniforms.time.value = t;
    fieldUniforms.lightLevel.value = light;
    fieldUniforms.center.value.set(view.x, view.y);
    fieldUniforms.zoom.value = zoom;
    const animationTime = view.reduced ? 0 : t;
    dustUniforms.time.value = animationTime;
    dustUniforms.density.value = density;
    dustUniforms.zoom.value = zoom;
    dustUniforms.focus.value = focus;
    dustUniforms.lightLevel.value = Math.min(1.18, light);
    dustGeometry.setDrawRange(0, {low: 410, medium: 690, high: baseCount}[profile]);

    for (const mesh of forms) {
      const uniforms = mesh.material.uniforms;
      uniforms.time.value = animationTime;
      uniforms.blur.value = Math.min(.99, .30 + Math.abs(mesh.position.z - focus) * .29);
      uniforms.lightLevel.value = light * .88;
    }
    for (const agent of simulation.agents) {
      const {index, previous, size, phase} = agent;
      const mesh = active[index] ?? (active[index] = specimen(index, size, 1, [0.034, 0, 0.15, 0.09, 0.012][index]));
      mesh.position.set(THREE.MathUtils.lerp(previous.x, agent.x, alpha), THREE.MathUtils.lerp(previous.y, agent.y, alpha), THREE.MathUtils.lerp(previous.z, agent.z, alpha));
      mesh.rotation.z = THREE.MathUtils.lerp(previous.angle, agent.angle, alpha);
      mesh.rotation.x = Math.sin(animationTime * (.38 + index * .09) + phase) * (index === 1 ? .23 : .14);
      mesh.rotation.y = Math.cos(animationTime * .6 + phase) * .26;
      mesh.scale.y = size * (1 + Math.sin(animationTime * 1.25 + phase) * (index === 3 ? .073 : .022));
      const uniforms = mesh.material.uniforms;
      uniforms.time.value = animationTime;
      uniforms.blur.value = Math.min(1.9, Math.abs(mesh.position.z - focus) * .37);
      uniforms.lightLevel.value = light;
      uniforms.flash.value = agent.energy;
    }

    let point = 0;
    for (const item of simulation.food) {
      for (let i = 0; i < 18; i++) {
        const angle = i * 2.399963 + t * .42;
        const spread = .08 + (22 - item.remaining) * .005 + i / 57;
        foodPosition.setXYZ(point++, item.x + Math.cos(angle) * spread, item.y + Math.sin(angle) * spread, .45);
      }
    }
    foodGeometry.setDrawRange(0, point);
    foodPosition.needsUpdate = true;
    renderer.render(scene, camera);
  }

  resize();
  return {
    canvas,
    render,
    worldAt,
    targetAt,
    unitsPerPixel,
    quality(value) {
      if (!(value in {low: 1, medium: 1, high: 1})) return;
      profile = value;
      resize();
    },
    dispose() {
      observer.disconnect();
      const resource = new Set();
      scene.traverse((object) => {
        if (object.geometry) resource.add(object.geometry);
        if (object.material) resource.add(object.material);
      });
      for (const item of [...resource, ...art]) item.dispose();
      renderer.dispose();
      canvas.remove();
    },
  };
}
