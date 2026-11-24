import * as T from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { buildAtelier, tableDepth, tableWidth, tableY, tableZ } from './atelier';
import { Engine, nextFrame, type Quality } from './core/engine';
import { canvasTexture, mesh } from './core/model';
import { fbmT, rng } from './core/noise';
import { makeTexSet, physicalMaterial } from './core/pbr';
import { colors, radius, type Color, type Pane, type Point, type Seam, type Work } from './panel';

const presets = {
  morning: { color: '#ffd49a', power: 3.3, x: -1.24, y: 1.52, z: -1.50, sky: '#ffffff' },
  noon: { color: '#fff4db', power: 3.55, x: -0.27, y: 2.18, z: -1.44, sky: '#f9fdfd' },
  dusk: { color: '#ffab62', power: 2.96, x: 0.98, y: 1.14, z: -1.72, sky: '#f7ce9e' },
};
export type Light = keyof typeof presets;
type Panel = { panes: Pane[]; seams: Seam[] };
const restCenter = new T.Vector3(-0.31, 1.51, -0.34);
const raisedCenter = new T.Vector3(-0.26, 1.73, -0.40);
const frameRotation = -0.21;
const mapSize = 512;

function shape(points: Point[], center?: Point, inset = 0) {
  return new T.Shape(points.map(([x, y]) => {
    if (!center) return new T.Vector2(x, y);
    const distance = Math.hypot(x - center[0], y - center[1]);
    const factor = Math.max(0, 1 - inset / Math.max(distance, 0.00001));
    return new T.Vector2(center[0] + (x - center[0]) * factor, center[1] + (y - center[1]) * factor);
  }));
}

function paneGeometry(points: Point[], center?: Point, inset = 0) {
  const geometry = new T.ExtrudeGeometry(shape(points, center, inset), {
    depth: 0.008, bevelEnabled: true, bevelSegments: 2, bevelSize: 0.003, bevelThickness: 0.002, steps: 1,
  });
  const a = geometry.attributes.position;
  const uv = geometry.attributes.uv;
  for (let i = 0; i < a.count; i++) uv.setXY(i, a.getX(i) * 2.1 + 0.5, a.getY(i) * 2.1 + 0.5);
  return geometry;
}

function curveFor(points: Point[], z: number) {
  return new T.CatmullRomCurve3(points.map(([x, y]) => new T.Vector3(x, y, z)), false, 'centripetal');
}

export async function createScene(container: HTMLElement, selectedQuality: Quality | undefined, reducedMotion: boolean) {
  const engine = new Engine(container, { quality: selectedQuality, fov: 36, exposure: 1.09, bloom: { strength: 0.24, radius: 0.37, threshold: 0.92 }, ao: { radius: 0.12, intensity: 0.47 } });
  const { scene, renderer, controls, camera, quality } = engine;
  const canvas = renderer.domElement;
  canvas.tabIndex = 0;
  canvas.setAttribute('aria-label', 'Bancada 3D. Use Ações do molde para operar com teclado.');
  scene.background = new T.Color('#251b15');
  engine.grade.uniforms.uVignette.value = 0.34;
  engine.grade.uniforms.uGrain.value = reducedMotion ? 0 : 0.016;
  engine.grade.uniforms.uContrast.value = 1.04;
  engine.grade.uniforms.uSat.value = 1.08;
  controls.minDistance = 1.12;
  controls.maxDistance = 4.2;
  controls.minPolarAngle = 0.48;
  controls.maxPolarAngle = 1.56;
  controls.minAzimuthAngle = -0.75;
  controls.maxAzimuthAngle = 0.75;
  controls.enablePan = false;
  controls.enableDamping = !reducedMotion;
  await nextFrame();

  const stage = buildAtelier(scene);
  const sun = new T.DirectionalLight(presets.morning.color, 3.3);
  sun.target.position.set(0, 1.16, -0.12);
  sun.position.set(presets.morning.x, 1.16 + presets.morning.y, -0.12 + presets.morning.z);
  engine.configureShadow(sun, engine.softwareRenderer ? 512 : 2048, 2.8);
  Object.assign(sun.shadow.camera, { left: -2.2, right: 2.2, top: 1.8, bottom: -1.8, near: 0.15, far: 8 });
  sun.shadow.camera.updateProjectionMatrix();
  sun.shadow.bias = -0.00032;
  sun.shadow.normalBias = 0.014;
  const fill = new T.HemisphereLight('#e4e4da', '#635248', 1.64);
  scene.add(sun, sun.target, fill);
  const env = new T.Scene();
  env.background = new T.Color(0.25, 0.22, 0.18);
  const card = (color: T.Color, width: number, height: number, x: number, y: number, z: number) => {
    const panel = new T.Mesh(new T.PlaneGeometry(width, height), new T.MeshBasicMaterial({ color, side: T.DoubleSide }));
    panel.position.set(x, y, z);
    panel.lookAt(0, 0, 0);
    env.add(panel);
    return panel.material;
  };
  const envWindow = card(new T.Color(4.5, 4, 3.25), 3.0, 2, -0.4, 1.5, -2.2);
  card(new T.Color(1.7, 1.6, 1.35), 2, 1, 1.1, 1.1, 2.2);
  function refreshEnvironment() {
    const old = scene.environment;
    scene.environment = engine.envFrom(env, 0.055);
    scene.environmentIntensity = 0.68;
    old?.dispose();
  }
  refreshEnvironment();

  const gl = renderer.getContext();
  const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
  const gpu = String(gl.getParameter(debugInfo ? debugInfo.UNMASKED_RENDERER_WEBGL : gl.RENDERER));
  const glassSet = makeTexSet({
    size: 256, aniso: engine.aniso, normalStrength: 2.65,
    sample(u, v, out) {
      const ripple = Math.sin((u * 14 + v * 4 + fbmT(u * 3, v * 3, 3, 3, 60) * 0.87) * Math.PI * 2);
      const broad = fbmT(u * 6, v * 6, 6, 4, 53);
      const small = fbmT(u * 40, v * 40, 40, 2, 54);
      const bubble = Math.max(0, small - 0.68) * 3;
      out.h = broad * 0.55 + ripple * 0.14 + bubble * 0.8;
      const value = 0.70 + broad * 0.25 + ripple * 0.043 - bubble * 0.13;
      out.r = value; out.g = value; out.b = value; out.rough = 0.14 + small * 0.26;
    },
  });
  const glass = Object.fromEntries(Object.entries(colors).map(([key, entry]) => {
    const color = new T.Color(entry.glass);
    return [key, physicalMaterial(glassSet, {
      color, roughness: 0.49, opacity: key === 'opalino' ? 0.92 : 0.81,
      side: T.FrontSide, transparent: true, depthWrite: true, metalness: 0.09,
      ior: 1.52, clearcoat: 0.93, clearcoatRoughness: 0.16, clearcoatNormalMap: glassSet.normalMap,
      clearcoatNormalScale: new T.Vector2(0.33, 0.33), emissive: color.clone(), emissiveIntensity: 0.42,
    }, 0.61)];
  })) as Record<Color, T.MeshPhysicalMaterial>;
  const random = rng(24);
  const trayPieces: T.Mesh[] = [];
  for (const [i, color] of (Object.keys(colors) as Color[]).entries()) {
    const trayGlass = glass[color].clone();
    trayGlass.clearcoat = 0.36;
    trayGlass.specularIntensity = 0.38;
    trayGlass.roughness = 0.78;
    const parts: T.BufferGeometry[] = [];
    for (let j = 0; j < 4; j++) {
      const points: Point[] = Array.from({ length: 5 + (j % 2) }, (_, k) => {
        const theta = k / (5 + (j % 2)) * Math.PI * 2;
        const r = 0.035 + random() * 0.023;
        return [Math.cos(theta) * r, Math.sin(theta) * r * 0.72];
      });
      const piece = new T.Mesh(paneGeometry(points), trayGlass);
      piece.position.set(-0.295 + i * 0.148 + (random() - 0.5) * 0.029, 0.051 + j * 0.007, -0.137 + j * 0.082);
      piece.rotation.set(-Math.PI / 2 + (random() - 0.5) * 0.2, (random() - 0.5) * 0.2, random() * Math.PI);
      piece.userData.color = color;
      piece.visible = false;
      piece.updateMatrix();
      parts.push(piece.geometry.clone().applyMatrix4(piece.matrix));
      stage.tray.add(piece);
      trayPieces.push(piece);
    }
    const cluster = mergeGeometries(parts);
    parts.forEach(part => part.dispose());
    if (cluster) stage.tray.add(new T.Mesh(cluster, trayGlass));
  }

  const frame = new T.Group();
  frame.position.copy(restCenter);
  frame.rotation.x = frameRotation;
  scene.add(frame);
  const rim = mesh(new T.TorusGeometry(radius + 0.022, 0.032, 10, 112), stage.darkWood);
  rim.scale.z = 0.65;
  const brassRim = mesh(new T.TorusGeometry(radius + 0.005, 0.008, 8, 112), stage.brass, 0, 0, 0.018);
  const outerBead = mesh(new T.TorusGeometry(radius + 0.041, 0.005, 7, 112), stage.brass, 0, 0, 0.015);
  frame.add(rim, brassRim, outerBead);
  const screws = new T.InstancedMesh(new T.SphereGeometry(0.008, 9, 6), stage.brass, 8);
  for (let i = 0; i < 8; i++) {
    const angle = i / 8 * Math.PI * 2;
    const matrix = new T.Matrix4().makeScale(1, 1, 0.42);
    matrix.setPosition(Math.cos(angle) * (radius + 0.025), Math.sin(angle) * (radius + 0.025), 0.020);
    screws.setMatrixAt(i, matrix);
  }
  frame.add(screws);
  const inserts = new T.Group();
  frame.add(inserts);
  const anchor = new T.Plane();
  const localHit = new T.Vector3();
  const clear = new T.MeshBasicMaterial({ visible: false, side: T.DoubleSide });
  const empty = new T.MeshBasicMaterial({ color: '#d3b28a', transparent: true, opacity: 0.10, depthWrite: false, side: T.DoubleSide });
  const outline = new T.LineBasicMaterial({ color: '#f7da96', transparent: true, opacity: 0.9, depthTest: false });
  const halo = new T.LineLoop(new T.BufferGeometry(), outline);
  halo.position.z = 0.023;
  halo.visible = false;
  frame.add(halo);
  const hoverPoint = new T.Vector3();
  const segmentStart = new T.Vector2();
  const segmentEnd = new T.Vector2();
  const difference = new T.Vector2();
  const candidate = new T.Vector2();
  const paneMeshes = new Map<string, { glass: T.Mesh; hit: T.Mesh; empty: T.Mesh }>();
  const seamMeshes = new Map<string, { mesh: T.Mesh<T.BufferGeometry, T.MeshStandardMaterial>; paths: T.CatmullRomCurve3[]; mask: number; heat: number; curve: T.CatmullRomCurve3 }>();
  let activePanel: Panel = { panes: [], seams: [] };
  let activeWork: Work = { panes: {}, solder: {} };
  let hovered = '';
  let entry: { id: string; time: number } | undefined;

  const projected = document.createElement('canvas');
  projected.width = projected.height = mapSize;
  const ctx = projected.getContext('2d', { willReadFrequently: true })!;
  const projectionMap = new T.CanvasTexture(projected);
  projectionMap.colorSpace = T.SRGBColorSpace;
  projectionMap.minFilter = T.LinearFilter;
  projectionMap.generateMipmaps = false;
  const projection = new T.Mesh(new T.PlaneGeometry(tableWidth - 0.025, tableDepth - 0.025), new T.MeshBasicMaterial({
    map: projectionMap, transparent: true, blending: T.AdditiveBlending, depthWrite: false, opacity: 0.79, toneMapped: true,
  }));
  projection.rotation.x = -Math.PI / 2;
  projection.position.set(0, tableY + 0.0024, tableZ);
  projection.renderOrder = 2;
  scene.add(projection);
  const sunDirection = new T.Vector3();
  const samplePosition = new T.Vector3();
  let projectionDirty = true;
  let projectionWait = 0;
  function updateProjection() {
    frame.updateMatrixWorld(true);
    sunDirection.copy(sun.target.position).sub(sun.position).normalize();
    ctx.clearRect(0, 0, mapSize, mapSize);
    for (const pane of activePanel.panes) {
      const color = activeWork.panes[pane.id];
      if (!color) continue;
      ctx.beginPath();
      for (const [index, point] of pane.outline.entries()) {
        const x = point[0] * 0.984 + pane.center[0] * 0.016;
        const y = point[1] * 0.984 + pane.center[1] * 0.016;
        samplePosition.set(x, y, 0).applyMatrix4(frame.matrixWorld);
        samplePosition.addScaledVector(sunDirection, (tableY - samplePosition.y) / sunDirection.y);
        const px = (0.5 + samplePosition.x / tableWidth) * mapSize;
        const py = (0.5 + (samplePosition.z - tableZ) / tableDepth) * mapSize;
        if (index === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.filter = 'blur(2px)';
      ctx.globalAlpha = 0.65;
      ctx.fillStyle = colors[color].light;
      ctx.fill();
      ctx.filter = 'blur(0.7px)';
      ctx.globalAlpha = color === 'opalino' ? 0.12 : 0.3;
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    ctx.filter = 'none';
    projectionMap.needsUpdate = true;
    projectionDirty = false;
  }

  function setPanel(panel: Panel, work: Work) {
    inserts.traverse(object => {
      if (!(object instanceof T.Mesh)) return;
      object.geometry.dispose();
      if (object.userData.solder) object.material.dispose();
    });
    inserts.clear();
    paneMeshes.clear();
    seamMeshes.clear();
    activePanel = panel;
    activeWork = work;
    const strips: T.BufferGeometry[] = [];
    for (const pane of panel.panes) {
      const paneMesh = new T.Mesh(paneGeometry(pane.outline, pane.center, 0.008), glass[pane.proposed]);
      const opening = new T.Mesh(new T.ShapeGeometry(shape(pane.outline, pane.center, 0.008)), empty);
      const hit = new T.Mesh(new T.ShapeGeometry(shape(pane.outline)), clear);
      hit.userData.pane = pane.id;
      opening.position.z = -0.014;
      inserts.add(paneMesh, opening, hit);
      paneMeshes.set(pane.id, { glass: paneMesh, empty: opening, hit });
    }
    for (const seam of panel.seams) {
      strips.push(new T.TubeGeometry(curveFor(seam.path, 0.005), seam.path.length + 2, 0.0062, 6, false));
      const curve = curveFor(seam.path, 0.012);
      const paths = Array.from({ length: 8 }, (_, i) => new T.CatmullRomCurve3(Array.from({ length: 5 }, (_, j) => {
        const t = Math.min(1, (i + j / 4) / 8);
        const p = curve.getPointAt(t);
        p.z += Math.sin((i * 4 + j) * 1.7) * 0.0011;
        return p;
      })));
      const solder = new T.Mesh(new T.BufferGeometry(), new T.MeshStandardMaterial({ color: '#c1b6aa', roughness: 0.32, metalness: 0.88 }));
      solder.userData.solder = true;
      solder.visible = false;
      inserts.add(solder);
      seamMeshes.set(seam.id, { mesh: solder, paths, mask: 0, heat: -9, curve });
    }
    const stripsGeometry = mergeGeometries(strips);
    strips.forEach(strip => strip.dispose());
    if (stripsGeometry) inserts.add(mesh(stripsGeometry, stage.lead));
    updateWork(work);
    setHighlight('');
    engine.refreshShadows();
  }

  function updateWork(work: Work, newPane?: string, heated?: string) {
    activeWork = work;
    for (const [id, pane] of paneMeshes) {
      const color = work.panes[id];
      pane.glass.visible = Boolean(color);
      pane.empty.visible = !color;
      if (color) pane.glass.material = glass[color];
    }
    for (const [id, seam] of seamMeshes) {
      const mask = work.solder[id] ?? 0;
      if (mask === seam.mask) continue;
      seam.mask = mask;
      const parts = seam.paths.flatMap((path, i) => mask & (1 << i) ? [new T.TubeGeometry(path, 5, 0.0059, 7, false)] : []);
      seam.mesh.geometry.dispose();
      seam.mesh.geometry = parts.length ? mergeGeometries(parts)! : new T.BufferGeometry();
      seam.mesh.visible = parts.length > 0;
      parts.forEach(part => part.dispose());
      if (id === heated) seam.heat = elapsed;
    }
    if (newPane) {
      const previous = entry && paneMeshes.get(entry.id);
      if (previous) previous.glass.position.z = 0;
      entry = { id: newPane, time: elapsed };
    }
    if (!heated || newPane) projectionDirty = true;
  }

  function pickPane(x: number, y: number) {
    const hit = engine.pick(x, y, [...paneMeshes.values()].map(pane => pane.hit), false)[0];
    return hit?.object.userData.pane as string | undefined;
  }

  function pickSeam(x: number, y: number, eligible: (seam: Seam) => boolean, threshold: number) {
    const normal = new T.Vector3(0, 0, 1).applyQuaternion(frame.quaternion);
    anchor.setFromNormalAndCoplanarPoint(normal, frame.position);
    const point = engine.ray(x, y).intersectPlane(anchor, localHit);
    if (!point) return;
    frame.worldToLocal(point);
    let closest: { id: string; t: number; distance: number } | undefined;
    for (const seam of activePanel.seams) {
      if (!eligible(seam)) continue;
      const curve = seamMeshes.get(seam.id)!.curve;
      const points = curve.getSpacedPoints(12);
      for (let i = 0; i < 12; i++) {
        segmentStart.set(points[i].x, points[i].y);
        segmentEnd.set(points[i + 1].x, points[i + 1].y);
        difference.copy(segmentEnd).sub(segmentStart);
        const part = T.MathUtils.clamp(((point.x - segmentStart.x) * difference.x + (point.y - segmentStart.y) * difference.y) / difference.lengthSq(), 0, 1);
        candidate.copy(segmentStart).addScaledVector(difference, part);
        const distance = Math.hypot(point.x - candidate.x, point.y - candidate.y);
        if (distance < (closest?.distance ?? threshold)) closest = { id: seam.id, t: (i + part) / 12, distance };
      }
    }
    return closest;
  }

  function setHighlight(id: string) {
    if (hovered === id) return;
    hovered = id;
    const pane = activePanel.panes.find(piece => piece.id === id);
    halo.visible = Boolean(pane);
    if (!pane) return;
    halo.geometry.dispose();
    halo.geometry = new T.BufferGeometry().setFromPoints(pane.outline.map(([x, y]) => new T.Vector3(x, y)));
  }

  const smokeMap = canvasTexture(64, 64, context => {
    const gradient = context.createRadialGradient(32, 32, 2, 32, 32, 32);
    gradient.addColorStop(0, '#d9e0de88'); gradient.addColorStop(0.44, '#cbd7d73b'); gradient.addColorStop(1, '#cbd7d700');
    context.fillStyle = gradient; context.fillRect(0, 0, 64, 64);
  });
  const wisps = Array.from({ length: 12 }, () => {
    const sprite = new T.Sprite(new T.SpriteMaterial({ map: smokeMap, transparent: true, depthWrite: false, opacity: 0 }));
    sprite.userData.noAO = true;
    sprite.visible = false;
    scene.add(sprite);
    return { sprite, age: 3, seed: random() };
  });
  const dustPositions = new Float32Array(65 * 3);
  for (let i = 0; i < dustPositions.length; i += 3) {
    dustPositions[i] = (random() - 0.5) * 3;
    dustPositions[i + 1] = 1.1 + random() * 1.65;
    dustPositions[i + 2] = -0.8 + random() * 1.3;
  }
  const dustGeometry = new T.BufferGeometry().setAttribute('position', new T.BufferAttribute(dustPositions, 3));
  const dust = new T.Points(dustGeometry, new T.PointsMaterial({ color: '#ffe8b2', size: 0.009, map: smokeMap, transparent: true, opacity: 0.37, depthWrite: false, blending: T.AdditiveBlending }));
  dust.visible = quality !== 'baixa' && !reducedMotion;
  dust.userData.noAO = true;
  scene.add(dust);

  const ironRestDirection = new T.Vector3(-0.61, 0.19, 0.77).normalize();
  const ironTarget = stage.ironRest.clone();
  const ironDirection = ironRestDirection.clone();
  const ironAxis = new T.Vector3(0, 1, 0);
  stage.iron.position.copy(ironTarget);
  stage.iron.quaternion.setFromUnitVectors(ironAxis, ironDirection);
  let soldering = false;
  let lastSmoke = 0;
  function aimIron(hit?: { id: string; t: number }, applying = false) {
    const entry = hit ? seamMeshes.get(hit.id) : null;
    soldering = Boolean(applying && entry);
    if (entry && hit) {
      entry.curve.getPointAt(hit.t, hoverPoint);
      hoverPoint.z += 0.014;
      frame.localToWorld(hoverPoint);
      ironTarget.copy(hoverPoint);
      ironDirection.set(0.34, 0.29, 0.89).normalize();
    } else {
      ironTarget.copy(stage.ironRest);
      ironDirection.copy(ironRestDirection);
    }
  }

  const ghost = new T.Mesh(new T.BufferGeometry(), new T.MeshBasicMaterial({ color: '#ffbc6d', opacity: 0.68, transparent: true, depthWrite: false, side: T.DoubleSide }));
  ghost.visible = false;
  ghost.renderOrder = 10;
  scene.add(ghost);
  let ghostPane = '';
  function dragGlass(x: number, y: number, color: Color, paneId?: string) {
    const pane = activePanel.panes.find(item => item.id === paneId);
    if (ghostPane !== (paneId ?? 'loose') || !ghost.visible) {
      ghost.geometry.dispose();
      ghost.geometry = pane ? paneGeometry(pane.outline, pane.center, 0.01) : new T.CircleGeometry(0.055, 5);
      ghostPane = paneId ?? 'loose';
    }
    ghost.material.color.set(colors[color].light);
    ghost.visible = true;
    if (pane) {
      ghost.position.copy(frame.position);
      ghost.position.z += 0.03;
      ghost.quaternion.copy(frame.quaternion);
    } else {
      anchor.setFromNormalAndCoplanarPoint(new T.Vector3(0, 0, 1), frame.position.clone().add(new T.Vector3(0, 0, 0.2)));
      if (engine.ray(x, y).intersectPlane(anchor, localHit)) ghost.position.copy(localHit);
      ghost.quaternion.copy(camera.quaternion);
    }
  }

  let elapsed = 0;
  let inspect = false;
  let light: Light = 'morning';
  let lightShift = 0;
  let lightTransition = 1;
  const oldSun = sun.position.clone();
  const oldColor = sun.color.clone();
  const oldSky = stage.outdoors.material.color.clone();
  let oldIntensity = sun.intensity;
  const sunGoal = sun.position.clone();
  const skyGoal = new T.Color(presets.morning.sky);
  const colorGoal = new T.Color(presets.morning.color);
  function setLight(next: Light, shift = lightShift, animate = true) {
    light = next;
    lightShift = shift;
    const preset = presets[light];
    sunGoal.set(preset.x + shift, preset.y, preset.z).add(sun.target.position);
    oldSun.copy(sun.position);
    oldColor.copy(sun.color);
    oldSky.copy(stage.outdoors.material.color);
    oldIntensity = sun.intensity;
    colorGoal.set(preset.color);
    skyGoal.set(preset.sky);
    lightTransition = animate && !reducedMotion ? 0 : 0.99999;
  }

  function setView(raised: boolean, animate = true) {
    inspect = raised;
    const narrow = container.clientWidth / container.clientHeight < 0.90;
    engine.setView({
      label: raised ? 'Contra a luz' : 'Bancada',
      position: raised ? (narrow ? [-0.05, 1.85, 3.62] : [0.33, 1.97, 2.12])
        : (narrow ? [0.12, 2.04, 3.67] : [0.68, 2.11, 2.76]),
      target: raised ? [narrow ? -0.3 : -0.11, 1.59, -0.22] : [narrow ? -0.3 : -0.13, 1.33, -0.11],
    }, animate && !reducedMotion);
  }
  let narrowLayout = container.clientWidth / container.clientHeight < 0.90;
  const responsiveView = new ResizeObserver(() => {
    const next = container.clientWidth / container.clientHeight < 0.90;
    if (next !== narrowLayout) { narrowLayout = next; setView(inspect, false); }
  });
  responsiveView.observe(container);
  setView(false, false);

  engine.onUpdate((dt, time) => {
    elapsed = time;
    projectionWait -= dt;
    if (lightTransition < 1) {
      lightTransition = Math.min(1, lightTransition + dt / 3.5);
      const t = T.MathUtils.smoothstep(lightTransition, 0, 1);
      sun.position.lerpVectors(oldSun, sunGoal, t);
      sun.color.copy(oldColor).lerp(colorGoal, t);
      sun.intensity = T.MathUtils.lerp(oldIntensity, presets[light].power, t);
      stage.outdoors.material.color.copy(oldSky).lerp(skyGoal, t);
      stage.windowGlow.position.x = 0.25 - (sun.position.x - sun.target.position.x) * 0.28;
      stage.windowGlow.material.color.copy(sun.color);
      projectionDirty = true;
      if (projectionWait <= 0) engine.refreshShadows();
      if (lightTransition >= 1) {
        envWindow.color.copy(sun.color).multiplyScalar(4.6);
        refreshEnvironment();
        engine.refreshShadows();
      }
    }
    const target = inspect ? raisedCenter : restCenter;
    if (frame.position.distanceToSquared(target) > 0.0000001) {
      frame.position.lerp(target, reducedMotion ? 1 : 1 - Math.exp(-dt * 4.4));
      frame.rotation.x = T.MathUtils.lerp(frame.rotation.x, inspect ? -0.075 : frameRotation, reducedMotion ? 1 : 1 - Math.exp(-dt * 4.4));
      projectionDirty = true;
      if (projectionWait <= 0) engine.refreshShadows();
    }
    if (projectionDirty && projectionWait <= 0) {
      updateProjection();
      projectionWait = quality === 'baixa' ? 0.09 : 0.043;
    }
    if (entry) {
      const glassMesh = paneMeshes.get(entry.id)?.glass;
      if (glassMesh) glassMesh.position.z = reducedMotion ? 0 : 0.048 * Math.exp(-(time - entry.time) * 11);
      if (time - entry.time > 0.48 || !glassMesh) {
        if (glassMesh) glassMesh.position.z = 0;
        entry = undefined;
      }
    }
    for (const solder of seamMeshes.values()) {
      if (solder.heat === -9) continue;
      const age = elapsed - solder.heat;
      const heat = Math.max(0, 1 - age / 4) ** 1.55;
      solder.mesh.material.emissive.setRGB(1, 0.18, 0.019);
      solder.mesh.material.emissiveIntensity = heat * 2.1;
      solder.mesh.material.roughness = 0.32 - heat * 0.16;
      if (age >= 4) solder.heat = -9;
    }
    stage.iron.position.lerp(ironTarget, reducedMotion ? 1 : 1 - Math.exp(-dt * 22));
    stage.iron.quaternion.slerp(new T.Quaternion().setFromUnitVectors(ironAxis, ironDirection), reducedMotion ? 1 : 1 - Math.exp(-dt * 13));
    if (soldering && !reducedMotion && time - lastSmoke > 0.10) {
      const next = wisps.find(wisp => wisp.age > 1.15);
      if (next) { next.age = 0; next.sprite.position.copy(stage.iron.position); }
      lastSmoke = time;
    }
    for (const wisp of wisps) {
      wisp.age += dt;
      wisp.sprite.visible = wisp.age <= 1.15;
      if (!wisp.sprite.visible) continue;
      wisp.sprite.position.x += Math.sin(wisp.seed * 11 + wisp.age * 3) * dt * 0.05;
      wisp.sprite.position.y += dt * 0.14;
      wisp.sprite.scale.setScalar(0.021 + wisp.age * 0.096);
      wisp.sprite.material.opacity = Math.sin(Math.PI * wisp.age / 1.15) * 0.34;
    }
    if (dust.visible) {
      dust.rotation.y = Math.sin(time * 0.08) * 0.055;
      dust.position.y = Math.sin(time * 0.2) * 0.04;
    }
  });

  function screen(point: T.Vector3) {
    point.project(camera);
    const bounds = canvas.getBoundingClientRect();
    return { x: bounds.left + (point.x + 1) * bounds.width / 2, y: bounds.top + (1 - point.y) * bounds.height / 2 };
  }

  return {
    canvas, gpu, quality, start: () => engine.start(), setPanel, updateWork, setHighlight, aimIron, setLight, setView,
    dispose() { responsiveView.disconnect(); engine.dispose(); },
    pickPane, pickSeam, dragGlass,
    pickTray(x: number, y: number) { return engine.pick(x, y, trayPieces, false)[0]?.object.userData.color as Color | undefined; },
    stopDrag() { ghost.visible = false; },
    orbit(enabled: boolean) { controls.enabled = enabled; },
    exportImage() { engine.exportImage('oficina-do-vitralista'); },
    diagnostics: {
      pane(id: string) {
        const entry = activePanel.panes.find(pane => pane.id === id);
        if (!entry) return;
        return screen(frame.localToWorld(new T.Vector3(...entry.center, 0)));
      },
      tray(color: Color) {
        const object = trayPieces.find(piece => piece.userData.color === color);
        return object ? screen(object.getWorldPosition(new T.Vector3())) : undefined;
      },
      seam(id: string, t: number) {
        const entry = seamMeshes.get(id);
        return entry ? screen(frame.localToWorld(entry.curve.getPointAt(t))) : undefined;
      },
      heat(id: string) { return seamMeshes.get(id)?.mesh.material.emissiveIntensity; },
      projection() {
        const pixels = ctx.getImageData(0, 0, mapSize, mapSize).data;
        let checksum = 0;
        for (let i = 0; i < pixels.length; i += 17) checksum = (checksum * 31 + pixels[i]) | 0;
        return checksum;
      },
    },
    measure(frames = 30) {
      const values: number[] = [];
      const pixel = new Uint8Array(4);
      return new Promise<{ gpu: string; medianMs: number; p95Ms: number; width: number; height: number; pixelRatio: number; drawCalls: number }>(resolve => {
        const render = engine.composer.render.bind(engine.composer);
        engine.composer.render = delta => {
          const autoReset = renderer.info.autoReset;
          renderer.info.autoReset = false;
          renderer.info.reset();
          const start = performance.now();
          render(delta);
          const calls = renderer.info.render.calls;
          gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixel);
          values.push(performance.now() - start);
          renderer.info.autoReset = autoReset;
          if (values.length < frames) return;
          engine.composer.render = render;
          values.sort((a, b) => a - b);
          resolve({ gpu, medianMs: values[Math.floor(values.length / 2)], p95Ms: values[Math.ceil(values.length * 0.95) - 1], width: canvas.width, height: canvas.height, pixelRatio: renderer.getPixelRatio(), drawCalls: calls });
        };
      });
    },
  };
}
