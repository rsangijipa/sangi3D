import * as T from '../../../Sistema/shared/vendor/three.module.js';
import { workbench } from '../../../Sistema/shared/sangi-workbench.js';
import { bubbleSimulation } from './simulation.js';
import { bubbleMesh, createStudio } from './studio.js';

const ui = workbench({
  title: 'Oficina das Bolhas',
  subtitle: 'Sangi3D · Laboratórios físicos',
  toolsLabel: 'Bancada',
  hint: 'Mergulhe o aro, sopre ou arraste-o para soltar bolhas. Toque numa bolha para estourá-la. Arraste o fundo para girar e use a pinça ou a roda para aproximar. No teclado, M mergulha, S sopra e E estoura.'
});
ui.setHint('Toque numa bolha para estourá-la. Arraste o fundo para girar.');

const controls = document.createElement('div');
controls.className = 'bubble-tools';
controls.innerHTML = `
  <div class="bubble-primary">
    <button type="button" id="dip" aria-keyshortcuts="M">Mergulhar aro</button>
    <button type="button" id="blow" class="blow-button" aria-keyshortcuts="S">Soprar</button>
    <button type="button" id="pop" aria-keyshortcuts="E">Estourar uma</button>
  </div>
  <div class="bubble-modes" role="group" aria-label="Modo de criação">
    <button type="button" id="composition" aria-pressed="true">Composição livre</button>
    <button type="button" id="giant" aria-pressed="false">Bolha gigante</button>
  </div>
  <details class="bubble-options">
    <summary>Controles do experimento</summary>
    <div class="bubble-options-inner">
      <label for="ring-size">Tamanho do aro <output id="ring-value" aria-hidden="true"></output>
        <input type="range" id="ring-size" min="8" max="24" step="1" value="14">
      </label>
      <label for="breath">Força do sopro <output id="breath-value" aria-hidden="true"></output>
        <input type="range" id="breath" min="10" max="100" step="5" value="45">
      </label>
      <label for="wind">Vento <output id="wind-value" aria-hidden="true"></output>
        <input type="range" id="wind" min="-80" max="80" step="5" value="0">
      </label>
      <p>O vento negativo sopra para a esquerda. A subida, a fusão e os diâmetros seguem um modelo aproximado.</p>
    </div>
  </details>
  <dl class="bubble-readings">
    <div><dt>Na cena</dt><dd id="live-count"></dd></div>
    <div><dt>Maior criada</dt><dd id="max-size"></dd></div>
    <div><dt>Estouradas</dt><dd id="popped-count"></dd></div>
  </dl>
  <div class="bubble-camera" role="group" aria-label="Câmera">
    <button type="button" id="camera-left" aria-label="Girar câmera para a esquerda">↶</button>
    <button type="button" id="camera-right" aria-label="Girar câmera para a direita">↷</button>
    <button type="button" id="camera-reset">Centralizar</button>
  </div>`;
ui.tools.append(controls);
const capture = document.createElement('button');
capture.type = 'button';
capture.textContent = 'Salvar cena';
ui.actions.append(capture);

try {
  start();
} catch (error) {
  console.error(error);
  controls.inert = true;
  capture.disabled = true;
  const notice = document.createElement('p');
  notice.className = 'bubble-error';
  notice.setAttribute('role', 'alert');
  notice.textContent = 'A cena 3D depende de WebGL 2. Verifique a aceleração gráfica do navegador e recarregue a oficina.';
  ui.stage.replaceChildren(notice);
  ui.setStatus('Renderização 3D indisponível.');
  ui.bind({});
}

function start() {
  const renderer = new T.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
  renderer.toneMapping = T.AgXToneMapping;
  renderer.toneMappingExposure = 1.04;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = T.PCFShadowMap;
  renderer.shadowMap.autoUpdate = false;
  renderer.shadowMap.needsUpdate = true;

  const canvas = renderer.domElement;
  canvas.className = 'bubble-stage-canvas';
  canvas.setAttribute('aria-label', 'Ateliê 3D com bancada, aro de metal e bolhas de sabão');
  canvas.setAttribute('role', 'img');
  ui.stage.append(canvas);
  const { scene, ring, ringHead, ringFilm, bathRipples, daylight, reflections, textures } = createStudio(renderer);
  const simulation = bubbleSimulation();
  const { state } = simulation;
  const find = id => controls.querySelector(`#${id}`);
  const ringHome = new T.Vector3(-.64, 1.16, 1.38);
  const ringBath = new T.Vector3(-.92, .281, .78);
  const ringDrag = ringHome.clone();
  const camera = new T.PerspectiveCamera(35, 1, .08, 37);
  const cameraTarget = new T.Vector3(.07, 1.26, -.15);
  const ray = new T.Raycaster();
  const normalized = new T.Vector2();
  const dragPlane = new T.Plane(new T.Vector3(0, 0, 1), -ringHome.z);
  const point = new T.Vector3();
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const controller = new AbortController();
  const bubbles = new Map();
  const fingers = new Map();
  const sparkles = [];
  const sparkGeometry = new T.BufferGeometry();
  const sparkPosition = new Float32Array(120 * 3);
  sparkGeometry.setAttribute('position', new T.BufferAttribute(sparkPosition, 3).setUsage(T.DynamicDrawUsage));
  const sparkMaterial = new T.PointsMaterial({ color: '#ffd5de', size:.036, transparent:true, opacity:.82, depthWrite:false });
  const sparks = new T.Points(sparkGeometry, sparkMaterial);
  sparks.frustumCulled = false;
  sparkGeometry.setDrawRange(0, 0);
  scene.add(sparks);

  let yaw = .23, pitch = .22, distance = 6.52, width = 1, height = 1;
  let paused = true, frame = 0, previous = 0, accumulator = 0, disposed = false;
  let ringAnimation = 0, lastDip = -Infinity, quality = 'high', gesture = null, pinch = 0, lastDiagnostics = -1;
  const fixedStep = 1 / 60;

  const listen = (target, event, callback, options = {}) => target.addEventListener(event, callback, { ...options, signal: controller.signal });

  function applyCamera() {
    camera.position.set(
      cameraTarget.x + Math.sin(yaw) * Math.cos(pitch) * distance,
      cameraTarget.y + Math.sin(pitch) * distance,
      cameraTarget.z + Math.cos(yaw) * Math.cos(pitch) * distance
    );
    camera.lookAt(cameraTarget);
    camera.updateMatrixWorld();
  }

  function resize() {
    width = Math.max(1, ui.stage.clientWidth);
    height = Math.max(1, ui.stage.clientHeight);
    camera.aspect = width / height;
    camera.fov = camera.aspect < 1 ? T.MathUtils.clamp(33 / camera.aspect, 37, 51) : 36;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
    render();
  }

  function readouts() {
    Object.assign(ui.stage.dataset, {
      bubbles: state.bubbles.length, wet: state.wet, popped: state.popped,
      maxDiameter: state.maxDiameter, merges: state.merges, simTime: state.time.toFixed(2)
    });
    find('live-count').textContent = state.bubbles.length;
    find('popped-count').textContent = state.popped;
    find('max-size').textContent = state.maxDiameter ? `≈ ${state.maxDiameter} cm` : '—';
  }

  function refreshControls() {
    const { ring: diameter, breath, wind, mode } = state.settings;
    find('ring-size').value = diameter;
    find('breath').value = breath;
    find('wind').value = wind;
    const windLabel = wind === 0 ? 'Calmo' : `${wind < 0 ? '←' : '→'} ${Math.abs(wind)}%`;
    find('ring-value').value = `${diameter} cm`;
    find('breath-value').value = `${breath}%`;
    find('wind-value').value = windLabel;
    find('ring-size').setAttribute('aria-valuetext', `${diameter} centímetros`);
    find('breath').setAttribute('aria-valuetext', `${breath} por cento`);
    find('wind').setAttribute('aria-valuetext', wind === 0 ? 'Calmo' : `${Math.abs(wind)} por cento para a ${wind < 0 ? 'esquerda' : 'direita'}`);
    find('composition').setAttribute('aria-pressed', String(mode === 'free'));
    find('giant').setAttribute('aria-pressed', String(mode === 'giant'));
    find('dip').classList.toggle('is-active', state.wet);
  }

  function dip() {
    if (paused) return;
    simulation.dip();
    ringAnimation = reducedMotion.matches ? 0 : .72;
    lastDip = state.time;
    ui.setStatus('Aro molhado. Sopre ou arraste o aro para liberar a película.');
    ui.sound({ frequency:430,end:230,duration:.24,volume:.13,type:'sine' });
    readouts();
    refreshControls();
  }

  function release(origin = ringHome, drag) {
    if (paused) return;
    const released = simulation.release(origin, drag);
    if (released.length === 0) {
      ui.setStatus('Mergulhe o aro na solução antes de soprar.');
      return;
    }
    ringAnimation = 0;
    const summary = state.settings.mode === 'giant' ? 'Bolha gigante liberada.' : released.length === 1 ? 'Uma bolha liberada.' : `${released.length} bolhas liberadas.`;
    ui.setStatus(`${summary} Mergulhe o aro para repetir.`);
    ui.sound({ frequency:190 + state.settings.breath * 1.35,end:110,duration:.38,volume:.10,type:'triangle' });
    refreshControls();
    readouts();
  }

  function pop(id) {
    if (paused) return;
    const target = simulation.pop(id);
    if (!target) { ui.setStatus('Crie uma bolha para estourar.'); return; }
    if (!reducedMotion.matches) {
      const amount = { low: 12, medium: 22, high: 32 }[quality];
      for (let i = 0; i < amount; i++) {
        const angle = i * Math.PI * 2 / amount;
        const speed = .52 + target.radius * 1.35 + .1 * Math.sin(i * 789);
        sparkles.push({ x:target.x + Math.cos(angle) * target.radius * .52, y:target.y + Math.sin(angle) * target.radius * .52,
          z:target.z+.11, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, vz: Math.sin(i * 46) * .4, life:.22 + (i % 5) * .036 });
      }
    }
    const tone = T.MathUtils.clamp(780 - target.radius * 480, 180, 720);
    ui.sound({ frequency:tone,end:tone*.33,duration:.115,volume:.19,type:'triangle' });
    ui.setStatus('Bolha estourada.');
    readouts();
  }

  function popNearest() {
    let nearest = null;
    let lowest = Infinity;
    for (const bubble of state.bubbles) {
      point.set(bubble.x,bubble.y,bubble.z).project(camera);
      if (Math.abs(point.x) > 1 || Math.abs(point.y) > 1) continue;
      const score = point.x ** 2 + point.y ** 2;
      if (score < lowest) { lowest = score; nearest = bubble; }
    }
    pop(nearest?.id);
  }

  function rayFrom(x, y) {
    const rect = canvas.getBoundingClientRect();
    normalized.set((x-rect.left)/rect.width*2-1, -(y-rect.top)/rect.height*2+1);
    ray.setFromCamera(normalized, camera);
  }

  function sphereHit(x,y,z,radius) {
    const sphere = new T.Sphere(point.set(x,y,z), radius);
    return ray.ray.intersectSphere(sphere, new T.Vector3())?.distanceToSquared(ray.ray.origin) ?? Infinity;
  }

  function pointerStart(event) {
    if (paused || event.button !== 0) return;
    fingers.set(event.pointerId, { x:event.clientX,y:event.clientY });
    canvas.setPointerCapture(event.pointerId);
    if (fingers.size === 2) {
      const [a,b] = fingers.values();
      pinch = Math.hypot(a.x-b.x,a.y-b.y);
      gesture = null;
      return;
    }
    if (fingers.size > 2) return;
    rayFrom(event.clientX,event.clientY);
    const hit = sphereHit(ring.position.x, ring.position.y, ring.position.z, .4 * ringHead.scale.x) !== Infinity
      || sphereHit(ring.position.x + .19, ring.position.y - .73, ring.position.z,.18) !== Infinity;
    gesture = { id:event.pointerId, x:event.clientX, y:event.clientY, startX:event.clientX, startY:event.clientY, moved:false, wand:hit, speedX:0,speedY:0 };
    if (hit) ringDrag.copy(ring.position);
  }

  function pointerMove(event) {
    if (!fingers.has(event.pointerId) || paused) return;
    fingers.set(event.pointerId, { x:event.clientX,y:event.clientY });
    if (fingers.size >= 2) {
      const [a,b] = fingers.values();
      const next = Math.hypot(a.x-b.x,a.y-b.y);
      if (pinch > 0) distance = T.MathUtils.clamp(distance * pinch / Math.max(1,next), 4.55, 9.8);
      pinch = next;
      applyCamera();
      return;
    }
    if (!gesture || gesture.id !== event.pointerId) return;
    const dx = event.clientX-gesture.x, dy = event.clientY-gesture.y;
    if (Math.hypot(event.clientX-gesture.startX,event.clientY-gesture.startY) > 6) gesture.moved = true;
    if (!gesture.moved) return;
    gesture.x = event.clientX; gesture.y = event.clientY;
    if (gesture.wand) {
      rayFrom(gesture.x,gesture.y);
      if (ray.ray.intersectPlane(dragPlane, point)) {
        ringDrag.set(T.MathUtils.clamp(point.x,-2.1,2.1), T.MathUtils.clamp(point.y,.26,3.25),ringHome.z);
        gesture.speedX = T.MathUtils.clamp(dx * .02,-.85,.85);
        gesture.speedY = T.MathUtils.clamp(-dy * .015,-.25,.55);
        if (inBath(ringDrag) && !state.wet) dip();
      }
      return;
    }
    yaw = T.MathUtils.clamp(yaw - dx*.007,-.77,.77);
    pitch = T.MathUtils.clamp(pitch + dy*.006,-.022,.72);
    applyCamera();
  }

  function inBath(position) {
    return Math.hypot(position.x - ringBath.x, position.y - ringBath.y) < .39;
  }

  function pointerEnd(event) {
    fingers.delete(event.pointerId);
    if (fingers.size < 2) pinch = 0;
    if (!gesture || gesture.id !== event.pointerId) return;
    const finished = gesture;
    gesture = null;
    if (paused || event.type !== 'pointerup') return;
    if (finished.wand && finished.moved) {
      if (inBath(ringDrag)) { dip(); return; }
      release(ringDrag, { x:finished.speedX,y:finished.speedY });
      return;
    }
    if (finished.moved) return;
    rayFrom(event.clientX,event.clientY);
    let id = null;
    let nearest = Infinity;
    for (const bubble of state.bubbles) {
      const hit = sphereHit(bubble.x,bubble.y,bubble.z,bubble.radius);
      if (hit < nearest) { id = bubble.id; nearest = hit; }
    }
    if (id !== null) pop(id);
    else if (finished.wand) dip();
  }

  function orbit(degrees) {
    yaw = T.MathUtils.clamp(yaw + degrees,-.77,.77);
    applyCamera();
    render();
  }

  function center() { yaw=.23; pitch=.22; distance=6.52; applyCamera(); render(); }

  function drawSparks(dt) {
    let count = 0;
    for (let i = sparkles.length-1; i >= 0; i--) {
      const particle = sparkles[i];
      particle.life -= dt;
      if (particle.life <= 0 || count >= 120) { sparkles.splice(i,1); continue; }
      particle.x += particle.vx * dt;
      particle.y += particle.vy * dt;
      particle.z += particle.vz * dt;
      particle.vy -= dt * 1.1;
      const offset = count++ * 3;
      sparkPosition[offset] = particle.x;
      sparkPosition[offset+1] = particle.y;
      sparkPosition[offset+2] = particle.z;
    }
    sparkGeometry.attributes.position.needsUpdate = true;
    sparkGeometry.setDrawRange(0,count);
  }

  function syncMeshes(dt) {
    const ids = new Set();
    const filmTime = reducedMotion.matches ? 0 : state.time;
    for (const bubble of state.bubbles) {
      ids.add(bubble.id);
      let mesh = bubbles.get(bubble.id);
      if (!mesh) {
        mesh = bubbleMesh(scene,bubble.phase);
        bubbles.set(bubble.id,mesh);
      }
      mesh.position.set(bubble.x,bubble.y,bubble.z);
      const wobble = reducedMotion.matches ? 0 : Math.sin(bubble.phase + bubble.age*3.6) * Math.min(.024, bubble.radius*.12);
      const settling = bubble.demonstration || reducedMotion.matches ? 1 : T.MathUtils.clamp(bubble.age*3.8,.15,1);
      mesh.scale.set(bubble.radius * settling * (1+wobble),bubble.radius * settling * (1-wobble),bubble.radius * settling);
      mesh.material.uniforms.filmTime.value = filmTime;
      mesh.material.uniforms.intensity.value = Math.min(1,(bubble.lifetime-bubble.age)*1.7);
    }
    for (const [id,mesh] of bubbles) {
      if (ids.has(id)) continue;
      scene.remove(mesh);
      mesh.material.dispose();
      bubbles.delete(id);
    }

    ringAnimation = Math.max(0,ringAnimation-dt);
    const dipping = Math.sin(Math.PI * ringAnimation/.72);
    if (gesture?.wand && gesture.moved) ring.position.copy(ringDrag);
    else ring.position.copy(ringHome).lerp(ringBath,dipping);
    ring.scale.setScalar(1 - dipping*.36);
    ring.rotation.set(-.19 - dipping*1.31, .18, -.18 + dipping*.19);
    ringHead.scale.setScalar(.72 + (state.settings.ring-8)*.047);
    ringFilm.visible = state.wet;
    ringFilm.material.uniforms.filmTime.value = filmTime;
    ringFilm.material.uniforms.intensity.value = .88;
    for (const [index,ripple] of bathRipples.entries()) {
      const elapsed = state.time - lastDip - .22 - index*.21;
      ripple.visible = !reducedMotion.matches && elapsed > 0 && elapsed < 1.02;
      if (!ripple.visible) continue;
      ripple.scale.setScalar(Math.min(.98, .16 + elapsed*.83));
      ripple.material.opacity = .64 * (1 - elapsed/1.02);
    }
    drawSparks(dt);
  }

  function render() { renderer.render(scene,camera); }

  function tick(now) {
    if (paused || disposed) return;
    const dt = previous ? Math.min(.07,(now-previous)/1000) : 0;
    previous = now;
    accumulator = Math.min(accumulator+dt,.1);
    while (accumulator >= fixedStep) { simulation.step(fixedStep); accumulator -= fixedStep; }
    syncMeshes(dt);
    if (state.time-lastDiagnostics >= .15) { lastDiagnostics = state.time; readouts(); }
    render();
    frame = requestAnimationFrame(tick);
  }

  function reset() {
    simulation.reset();
    for (const mesh of bubbles.values()) { scene.remove(mesh); mesh.material.dispose(); }
    bubbles.clear();
    sparkles.length = 0;
    previous = 0;
    accumulator = 0;
    ringAnimation = 0;
    lastDip = -Infinity;
    lastDiagnostics = -1;
    controls.querySelector('details').open = false;
    syncMeshes(0);
    center();
    refreshControls();
    readouts();
    ui.setStatus('Mergulhe o aro para começar.');
  }

  const observer = new ResizeObserver(resize);
  observer.observe(ui.stage);
  listen(find('dip'),'click',dip);
  listen(find('blow'),'click',() => release());
  listen(find('pop'),'click',popNearest);
  listen(find('camera-left'),'click',() => orbit(-.27));
  listen(find('camera-right'),'click',() => orbit(.27));
  listen(find('camera-reset'),'click',center);
  listen(capture,'click',() => { render(); ui.capture(canvas,'oficina-das-bolhas.png'); });
  for (const [id,key] of [['ring-size','ring'],['breath','breath'],['wind','wind']]) {
    listen(find(id),'input',event => { state.settings[key] = Number(event.target.value); refreshControls(); });
  }
  for (const [id,mode] of [['composition','free'],['giant','giant']]) {
    listen(find(id),'click',() => {
      state.settings.mode = mode;
      refreshControls();
      ui.setStatus(mode === 'giant' ? 'Modo bolha gigante. O próximo sopro libera uma única bolha grande.' : 'Modo composição livre. Varie a força do sopro para formar grupos de bolhas.');
    });
  }
  listen(canvas,'pointerdown',pointerStart);
  listen(canvas,'pointermove',pointerMove);
  listen(canvas,'pointerup',pointerEnd);
  listen(canvas,'pointercancel',pointerEnd);
  listen(canvas,'lostpointercapture',pointerEnd);
  listen(canvas,'wheel',event => {
    if (paused) return;
    event.preventDefault();
    distance = T.MathUtils.clamp(distance * Math.exp(event.deltaY*.0011),4.55,9.8);
    applyCamera();
  },{ passive:false });
  listen(window,'keydown',event => {
    if (paused || event.repeat || event.ctrlKey || event.metaKey || event.altKey || /^(INPUT|TEXTAREA|SELECT)$/.test(event.target.tagName)) return;
    const action = { m:dip, s:() => release(), e:popNearest, arrowleft:() => orbit(-.2), arrowright:() => orbit(.2) }[event.key.toLowerCase()];
    if (action) { event.preventDefault(); action(); }
  });
  reset();

  ui.bind({
    pause(value) {
      paused = value;
      cancelAnimationFrame(frame);
      previous = 0;
      fingers.clear();
      gesture = null;
      pinch = 0;
      if (!paused) frame = requestAnimationFrame(tick);
    },
    reset,
    quality(value) {
      quality = value;
      renderer.setPixelRatio(Math.min(devicePixelRatio, { low: .90, medium: 1.25, high: 1.7 }[value]));
      renderer.shadowMap.enabled = value !== 'low';
      daylight.castShadow = value !== 'low';
      daylight.shadow.map?.dispose();
      daylight.shadow.map = null;
      const size = value === 'high' ? 1024 : 512;
      daylight.shadow.mapSize.set(size,size);
      renderer.shadowMap.needsUpdate = true;
      resize();
    },
    dispose() {
      disposed = true;
      cancelAnimationFrame(frame);
      controller.abort();
      observer.disconnect();
      scene.traverse(object => { object.geometry?.dispose(); object.material?.dispose(); });
      for (const texture of textures) texture.dispose();
      daylight.shadow.dispose();
      reflections.dispose();
      renderer.dispose();
    }
  });
}
