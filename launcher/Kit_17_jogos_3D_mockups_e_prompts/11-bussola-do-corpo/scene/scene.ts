import * as T from 'three';
import { Engine, detectQuality, nextFrame, type Quality } from './core/engine';
import { buildObservatory } from './observatory';
import { makeBody, zoneIds } from './body';
import type { State } from '../game/state';
import type { Region } from '../game/content';
import { bindBodyPointer } from '../input/pointer';

export type QualitySetting = Quality | 'auto';
export type LightSetting = 'noite' | 'lunar' | 'lampadas';
const ringY = .99, ringZ = .19, radius = .948;
const motion = matchMedia('(prefers-reduced-motion: reduce)');
const v = (x: number, y: number, z: number) => new T.Vector3(x,y,z);

export async function createScene(
  world: HTMLElement, orbit: HTMLElement, state: () => State, quality: QualitySetting,
  onPick: (region: Region) => void, onHover: (region: Region | null) => void,
  onLoss: () => void, progress: (text: string) => void, signal: AbortSignal, light: () => LightSetting,
) {
  const gl = document.createElement('canvas').getContext('webgl2');
  if (!gl) throw new Error('WebGL2');
  gl.getExtension('WEBGL_lose_context')?.loseContext();
  const tier = quality === 'auto' ? detectQuality() : quality;
  const engine = new Engine(world, { quality: tier, fov: 40, exposure: 1.08,
    bloom: { threshold: 1.15, strength: .18, radius: .37 }, ao: { radius: .25, intensity: .47 }, });
  try {
    engine.controls.enabled = false;
    engine.grade.uniforms.uVignette.value = .31;
    engine.grade.uniforms.uGrain.value = .027;
    engine.grade.uniforms.uSat.value = 1.045;
    engine.grade.uniforms.uContrast.value = 1.075;
    engine.scene.fog = new T.FogExp2('#1e263a', .033);
    const canvas = engine.renderer.domElement;
    canvas.setAttribute('aria-hidden','true');
    canvas.addEventListener('webglcontextlost', event => {
      event.preventDefault();
      if (!signal.aborted) onLoss();
    }, { signal });

    progress('Acendendo as luminárias…');
    await nextFrame();
    signal.throwIfAborted();
    const room = buildObservatory(engine.scene, state().seed);
    progress('Preparando o mapa do corpo…');
    await nextFrame();
    signal.throwIfAborted();
    const body = makeBody();
    const anchor = new T.Group();
    anchor.add(body.surface,body.proxyGroup);
    engine.scene.add(anchor);
    const orbitMaterial = new T.MeshBasicMaterial({ color: '#dbb576', transparent: true, opacity: .80 });
    const ring = new T.Mesh(new T.TorusGeometry(radius,.0033,6,120), orbitMaterial);
    ring.position.set(0,ringY,ringZ);
    ring.rotation.x = -.075;
    ring.name = 'orbital_ring';
    engine.scene.add(ring);

    const key = new T.DirectionalLight('#f8d2ab', 1.62);
    key.position.set(-2.7,3.8,2.15); key.target.position.set(.18,.55,0);
    engine.configureShadow(key, tier === 'alta' ? 1536 : tier === 'media' ? 1024 : 512, 3);
    Object.assign(key.shadow.camera,{ left:-3.2,right:3.2,top:3.2,bottom:-3.0,near:.5,far:9.5 });
    key.shadow.camera.updateProjectionMatrix();
    key.shadow.bias = -.00035;
    key.shadow.normalBias = .028;
    const rim = new T.DirectionalLight('#99adff', 1.36);
    rim.position.set(.55,3.2,-2.6);
    const warmRim = new T.DirectionalLight('#f2b474', .72);
    warmRim.position.set(2.5,1.65,-.78);
    const lamp = new T.PointLight('#ffb162', 3.35, 3.3, 2);
    lamp.position.set(-1.52,1.34,-.52);
    const starLamp = new T.PointLight('#ffc17f', 3.4, 3, 2);
    starLamp.position.set(1.44,.82,-.44);
    engine.scene.add(key,key.target,rim,warmRim,lamp,starLamp,new T.HemisphereLight('#a8b5df','#b97b4e',.85));

    // PMREM from the dome and the three luminous openings in the observatory.
    const env = new T.Scene();
    env.background = new T.Color('#47536f');
    const environmentPanels = [
      [v(-3,2,2),new T.Color(2.7,1.83,1.0),2.8],
      [v(2,1,-2),new T.Color(1.65,.94,.51),1.7],
      [v(0,3,-2),new T.Color(.56,.73,1.1),3.6],
    ] as const;
    for (const [position, color, size] of environmentPanels) {
      const panel = new T.Mesh(new T.PlaneGeometry(size,size),new T.MeshBasicMaterial({color}));
      panel.position.copy(position); panel.lookAt(0,0,0); env.add(panel);
    }
    engine.scene.environment = engine.envFrom(env,.13);
    engine.scene.environmentIntensity = .48;
    env.traverse(node => { if (node instanceof T.Mesh) { node.geometry.dispose(); node.material.dispose(); } });

    const center = v(0,ringY,ringZ), edge = v(radius,ringY,ringZ);
    const projected = v(0,0,0);
    function frame() {
      const w = world.clientWidth, h = world.clientHeight;
      if (!w || !h) return;
      const narrow = innerWidth <= 849 && innerHeight > innerWidth;
      orbit.dataset.narrow = String(narrow);
      const relative = narrow ? .5 : w <= 849 ? .40 : .46;
      const headerRoom = narrow ? 126 : 92;
      const diameter = narrow ? Math.min(w - 69, h - headerRoom - 42) : Math.min(w * .52, h * .66);
      const distance = Math.max(2.75, radius * h / Math.max(155,diameter) / Math.tan(T.MathUtils.degToRad(20)));
      const top = narrow ? (headerRoom + diameter/2 + 10) / h : .53;
      engine.setView({ label:'Mapa corporal', position:[0,1.32,distance+ringZ], target:[0,.98,0] }, false);
      engine.camera.setViewOffset(w,h,(.5-relative)*w,(.5-top)*h,w,h);
      engine.camera.updateMatrixWorld(true);
      const place = (point: T.Vector3) => {
        projected.copy(point).project(engine.camera);
        return [(projected.x + 1) * w / 2, (1-projected.y)*h/2];
      };
      const [x,y] = place(center);
      const [right] = place(edge);
      orbit.style.setProperty('--orbit-x', `${x}px`);
      orbit.style.setProperty('--orbit-y', `${y}px`);
      orbit.style.setProperty('--orbit-radius', `${right-x}px`);
      orbit.style.setProperty('--token-size', `${Math.max(44, Math.min(narrow ? 61 : 83, (right-x)*.35))}px`);
    }
    frame();
    const resize = new ResizeObserver(frame);
    resize.observe(world);
    signal.addEventListener('abort', () => resize.disconnect(), { once: true });
    const pick = (x: number,y: number) => {
      if (state().phase !== 'region' || state().paused || Math.abs(anchor.rotation.y - targetAngle()) > .14) return null;
      const hit = engine.pick(x,y,body.proxies,false)[0];
      return hit ? hit.object.userData.region as Region : null;
    };
    let hover: Region | null = null;
    bindBodyPointer(canvas,pick,onPick,id => { hover = id; onHover(id); },signal);
    const targetAngle = () => state().bodyView === 'back' ? Math.PI : 0;
    let rotation = anchor.rotation.y, lastCommand = rotation, from = rotation, turnTime = .43;
    const goalWeights = new Float32Array(zoneIds.length);
    const fromWeights = new Float32Array(zoneIds.length), times = new Float32Array(zoneIds.length).fill(.2);
    const presets = {
      noite: [1.62,1.36,3.35,3.40,1.08],
      lunar: [1.24,2.05,1.65,1.45,1.07],
      lampadas: [1.66,.90,4.75,4.65,1.02],
    } as const;
    const lighting: number[] = [...presets[light()]];
    let previousPhase = state().phase;
    engine.onUpdate((dt,t) => {
      const current = state();
      ring.visible = !current.exited;
      if (current.phase !== previousPhase) { hover = null; previousPhase = current.phase; }
      if (current.paused || current.exited) return;
      const angle = targetAngle();
      if (angle !== lastCommand) {
        from = rotation;
        turnTime = 0;
        lastCommand = angle;
      }
      if (turnTime < .43) {
        turnTime = motion.matches ? .43 : Math.min(.43,turnTime+dt);
        const f=turnTime/.43;
        rotation = T.MathUtils.lerp(from,angle,f*f*(3-2*f));
        anchor.rotation.y=rotation;
        if (turnTime === .43) engine.refreshShadows();
      }
      const selected = current.phase === 'review' ? current.entries.flatMap(entry => entry.regionIds) : current.draft.regionIds;
      for (const [i,id] of zoneIds.entries()) {
        const goal = selected.includes(id) ? 1 : hover === id ? .25 : 0;
        if (goal !== goalWeights[i]) {
          fromWeights[i] = body.weights[i]; goalWeights[i] = goal; times[i] = 0;
        }
        if (times[i] < .20) {
          times[i] = motion.matches ? .20 : Math.min(.20,times[i]+dt);
          body.weights[i] = T.MathUtils.lerp(fromWeights[i],goal,times[i]/.20);
        }
      }
      const testPreset = presets[light()];
      for (let i=0;i<lighting.length;i++) lighting[i] = T.MathUtils.lerp(lighting[i],testPreset[i],motion.matches ? 1 : 1-Math.exp(-dt*1.1));
      key.intensity = lighting[0];
      rim.intensity = lighting[1];
      lamp.intensity = lighting[2];
      starLamp.intensity = lighting[3] + (motion.matches ? 0 : .14 * Math.sin(t*1.13) + .05*Math.sin(t*4.2));
      engine.grade.uniforms.toneMappingExposure.value = lighting[4];
      if (!motion.matches) room.dust.update(t);
    });
    await engine.start();
    signal.throwIfAborted();
    const context = engine.renderer.getContext();
    const debug = context.getExtension('WEBGL_debug_renderer_info');
    const gpu = String(context.getParameter(debug ? debug.UNMASKED_RENDERER_WEBGL : context.RENDERER));
    return {
      tier, canvas, pause: (paused: boolean) => engine.setPaused(paused),
      dispose: () => { resize.disconnect(); engine.dispose(); },
      metrics: () => ({ ...engine.sceneRenderInfo, width: canvas.width, height: canvas.height, gpu, tier }),
      inspect: (name: string) => {
        if (name === 'geral') { frame(); return; }
        const asset = name === body.surface.name ? body.surface : room.heroAssets.find(item => item.name === name);
        if (!asset) return;
        const bounds = new T.Box3().setFromObject(asset);
        const center = bounds.getCenter(new T.Vector3());
        const size = bounds.getSize(new T.Vector3());
        const reach = Math.max(.54, size.x * 1.14, size.y * 1.46, size.z * 1.05);
        engine.camera.clearViewOffset();
        engine.setView({ label:name, target:center.toArray(),
          position:[center.x+.22*reach,center.y+(name==='rug'?.94:.22)*reach,center.z+reach] },false);
        engine.composer.render(0);
      },
      measure: (samples: number, native = false) => {
        const gl = engine.renderer.getContext();
        const pixel = new Uint8Array(4);
        const w = world.clientWidth, h = world.clientHeight;
        const previous = engine.renderer.getPixelRatio();
        function resizeTarget(ratio: number) {
          engine.renderer.setPixelRatio(ratio);
          engine.renderer.setSize(w,h,false);
          engine.composer.setPixelRatio(ratio);
          engine.composer.setSize(w,h);
          engine.grade.uniforms.uRes.value.set(w*ratio,h*ratio);
        }
        if (native) resizeTarget(1);
        engine.composer.render(0);
        gl.readPixels(0,0,1,1,gl.RGBA,gl.UNSIGNED_BYTE,pixel);
        const start = performance.now();
        const count = Math.trunc(T.MathUtils.clamp(samples,1,36));
        for (let i=0;i<count;i++) {
          engine.composer.render(0);
          gl.readPixels(0,0,1,1,gl.RGBA,gl.UNSIGNED_BYTE,pixel);
        }
        const ms = (performance.now()-start)/count;
        if (native) resizeTarget(previous);
        return ms;
      },
    };
  } catch (error) {
    engine.dispose();
    throw error;
  }
}
