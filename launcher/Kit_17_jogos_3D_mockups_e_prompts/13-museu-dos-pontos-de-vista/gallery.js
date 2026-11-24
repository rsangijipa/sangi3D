import * as T from '/shared/vendor/three.module.js';
import { MaterialFactory } from '/shared/engine/materials.js';
import { beam, makePlant, mesh, profile, roundedBox } from '/shared/engine/scene-details.js';
import { createStudioEnvironment } from '/shared/engine/studio-environment.js';

export function createGallery(host, onPerson) {
  window.THREE = T;
  const mobile = matchMedia('(max-width: 760px) and (orientation: portrait)');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const renderer = new T.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
  renderer.setClearColor(0x172d28);
  renderer.toneMapping = T.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.22;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = T.PCFShadowMap;
  host.prepend(renderer.domElement);
  const scene = new T.Scene();
  scene.background = new T.Color(0x152b29);
  const environment = createStudioEnvironment(renderer);
  scene.environment = environment.texture;
  scene.environmentIntensity = .74;
  scene.add(new T.HemisphereLight(0xe9f6e8, 0x544331, 1.35));
  const key = new T.DirectionalLight(0xffdfaa, 3);
  key.position.set(-3.2, 6, 4.7);
  key.castShadow = true;
  Object.assign(key.shadow.camera, { left: -4.5, right: 4.5, top: 4.3, bottom: -4.3, near: .5, far: 15 });
  key.shadow.mapSize.set(mobile.matches ? 1024 : 2048, mobile.matches ? 1024 : 2048);
  key.shadow.normalBias = .022;
  key.shadow.bias = -.00018;
  key.shadow.radius = 3;
  scene.add(key);
  const side = new T.DirectionalLight(0xb1d8d6, 1.1);
  side.position.set(5, 3, -2);
  scene.add(side);

  const solid = (color, roughness = .72, metalness = 0) => new T.MeshStandardMaterial({ color, roughness, metalness });
  const wood = MaterialFactory.wood(0xa86c3b, .54);
  const dark = MaterialFactory.wood(0x513526, .58);
  const oak = MaterialFactory.wood(0xc1905b, .61);
  const brass = solid(0xce9a49, .34, .78);
  const black = solid(0x242324);
  const teal = solid(0x173a34, .97);
  const lime = solid(0xe0c5a0, .89);
  const pot = solid(0xb17453, .69);
  const feltNoise = MaterialFactory.createNoiseTexture(128, 128, 5);
  teal.bumpMap = feltNoise;
  teal.bumpScale = .025;
  lime.bumpMap = feltNoise;
  lime.bumpScale = .013;
  const box = (parent, w, h, d, material, x, y, z, shadow = true) =>
    mesh(parent, new T.BoxGeometry(w, h, d), material, x, y, z, shadow);
  const bevel = (parent, w, h, d, r, material, x, y, z, shadow = true) =>
    mesh(parent, roundedBox(w, h, d, r), material, x, y, z, shadow);
  const lathe = (parent, points, material, x, y, z, shadow = true) =>
    mesh(parent, profile(points, 28), material, x, y, z, shadow);

  box(scene, 16, 8, .3, teal, 0, 3.7, -3.24, false);
  box(scene, .3, 8, 11, teal, -6.1, 3.7, -.6, false);
  box(scene, 16, .18, 12, dark, 0, -.115, .2, false);
  const boards = new T.InstancedMesh(new T.BoxGeometry(2.01, .04, .297), wood, 252);
  const plank = new T.Object3D();
  const stain = new T.Color();
  for (let row = 0; row < 36; row++) {
    for (let index = 0; index < 7; index++) {
      plank.position.set((index - 3) * 2.034 + (row % 3) * .47, -.02, row * .308 - 3.15);
      plank.updateMatrix();
      const i = row * 7 + index;
      boards.setMatrixAt(i, plank.matrix);
      boards.setColorAt(i, stain.setHSL(.075 + .025 * Math.cos(i * 31), .26, .66 + .13 * Math.sin(i * 8.3)));
    }
  }
  boards.receiveShadow = true;
  scene.add(boards);
  for (const [y, h] of [[.10,.2],[1.02,.068],[.98,.027],[4.58,.105],[4.68,.16]]) {
    box(scene, 15, h, .14, y > 4 ? lime : dark, 0, y, -3, false);
  }
  for (const x of [-5.3, 0, 5.3]) {
    const arch = new T.Shape();
    const width = x ? 1.1 : 1.59;
    const spring = x ? 2.4 : 2.68;
    arch.moveTo(-width, .23);
    arch.lineTo(-width, spring);
    arch.absarc(0, spring, width, Math.PI, 0, true);
    arch.lineTo(width, .23);
    arch.lineTo(width + .19, .23);
    arch.lineTo(width + .19, spring);
    arch.absarc(0, spring, width + .19, 0, Math.PI, false);
    arch.lineTo(-width - .19, .23);
    arch.closePath();
    const shape = new T.ExtrudeGeometry(arch, { depth: .12, bevelEnabled: true, bevelSize: .035, bevelThickness: .035, bevelSegments: 2, curveSegments: 36 });
    mesh(scene, shape, lime, x, 0, -3.025, false);
  }
  function art(x, y, title, glyph, tint) {
    bevel(scene, 1.19, .86, .10, .026, dark, x, y, -2.99, false);
    bevel(scene, 1.12, .79, .045, .014, brass, x, y, -2.932, false);
    const canvas = document.createElement('canvas');
    canvas.width = 768;
    canvas.height = 540;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#e1cfad';
    ctx.fillRect(0, 0, 768, 540);
    for (let i = 0; i < 7300; i++) {
      ctx.fillStyle = i % 2 ? '#34291b13' : '#fff9e228';
      ctx.fillRect((i * 319.7) % 768, (i * 57.13) % 540, 1 + i % 3, 2);
    }
    ctx.strokeStyle = '#75604c';
    ctx.lineWidth = 3;
    ctx.strokeRect(30, 30, 708, 480);
    ctx.fillStyle = tint;
    ctx.textAlign = 'center';
    ctx.font = '215px Georgia';
    ctx.fillText(glyph, 384, 315);
    ctx.font = '39px Georgia';
    ctx.fillText(title, 384, 422);
    const map = new T.CanvasTexture(canvas);
    map.colorSpace = T.SRGBColorSpace;
    mesh(scene, new T.PlaneGeometry(1.07, .746), new T.MeshStandardMaterial({ map, roughness: .92 }), x, y, -2.902, false);
  }
  art(-3.16, 2.52, 'ÂNGULO', '◒', '#335a51');
  art(3.18, 2.52, 'EVIDÊNCIA', '◇', '#7c5943');
  for (const x of [-2.26, 2.26]) {
    lathe(scene, [[.029,0],[.029,1.44]], black,x,3.29,-1.56,false);
    lathe(scene, [[.02,.35],[.097,.33],[.15,.23],[.26,.095],[.294,.046],[.296,.015],[.278,.009]], brass,x,3.02,-1.56,false);
    mesh(scene, new T.SphereGeometry(.101, 24, 12), new T.MeshStandardMaterial({color:0xffdf9d, emissive:0xf3ad46, emissiveIntensity:1.2}),x,3.066,-1.56,false);
    const lamp = new T.PointLight(0xffc77b, 8, 4);
    lamp.position.set(x, 2.99, -1.56);
    scene.add(lamp);
  }
  makePlant(scene, -2.92, -1.96, 1.02, 11, pot);
  makePlant(scene, 2.84, -1.98, 1.32, 22, lime);

  const deck = new T.Group();
  deck.name = 'Vitrine de carvalho';
  scene.add(deck);
  bevel(deck, 4.18, .14, 2.92, .045, dark, 0, .088, 0);
  bevel(deck, 4.01, .59, 2.75, .055, wood, 0, .416, 0);
  bevel(deck, 3.88, .42, .043, .017, dark, 0, .405, 1.386);
  for (const x of [-1.26, 0, 1.26]) {
    bevel(deck, 1.2, .315, .051, .02, wood, x, .405, 1.417);
  }
  bevel(deck, 4.14, .13, 2.88, .044, oak, 0, .772, 0);
  bevel(deck, 3.94, .045, 2.66, .015, solid(0x8e9073,.93), 0, .852, 0);
  const glass = new T.MeshPhysicalMaterial({ color: 0xb7d2cb, transparent: true, opacity: .065, roughness: .17, depthWrite: false, metalness: .24 });
  for (const x of [-2.02, 2.02]) {
    for (const z of [-1.39, 1.39]) {
      box(deck, .029, 1.49, .029, brass, x, 1.608, z, false);
      box(deck, .075, .095, .075, brass, x, .92, z, false);
    }
    box(deck,.013,1.48,2.77,glass,x,1.61,0,false);
    box(deck,.027,.025,2.79,brass,x,2.348,0,false);
  }
  for (const z of [-1.39, 1.39]) {
    box(deck,4.03,1.48,.013,glass,0,1.61,z,false);
    box(deck,4.05,.025,.027,brass,0,2.348,z,false);
  }
  const table = new T.Group();
  table.name = 'Mesa de exposição';
  deck.add(table);
  bevel(table,1.62,.10,1.2,.028,oak,0,1.201,.14);
  bevel(table,1.49,.11,1.06,.02,wood,0,1.126,.14);
  for (const x of [-.65,.65]) for (const z of [-.30,.58]) bevel(table,.09,.35,.09,.012,dark,x,1.035,z);
  const displayBox = new T.Group();
  displayBox.name = 'Caixa de latão e madeira';
  table.add(displayBox);
  bevel(displayBox,.39,.225,.32,.02,wood,0,.108,0);
  bevel(displayBox,.408,.052,.338,.017,oak,0,.237,0);
  for (const x of [-.132,.132]) {
    box(displayBox,.026,.004,.315,brass,x,.265,0,false);
    box(displayBox,.026,.211,.006,brass,x,.12,.162,false);
  }
  bevel(displayBox,.065,.072,.019,.008,brass,0,.176,.171,false);
  mesh(displayBox,new T.CircleGeometry(.009,12),black,0,.166,.182,false);
  const divider = new T.Group();
  divider.name = 'Divisória no trilho';
  deck.add(divider);
  for (const z of [-.345,.455]) bevel(table, 1.52,.022,.048,.008,brass,0,1.261,z,false);
  bevel(divider,.071,.64,.825,.016,dark,0,0,0);
  bevel(divider,.081,.553,.715,.014,wood,0,-.008,0);
  for (const z of [-.399,.399]) {
    bevel(divider,.145,.043,.077,.01,brass,0,-.314,z,false);
    bevel(divider,.076,.58,.049,.012,oak,0,.006,z,false);
  }
  const books = new T.Group();
  deck.add(books);
  books.position.set(.73,.875,.94);
  books.rotation.y = -.25;
  bevel(books,.28,.046,.22,.008,solid(0x234b4b),0,.057,0,false);
  box(books,.259,.032,.208,lime,.007,.057,0,false);
  bevel(books,.30,.043,.236,.008,solid(0x994d36),-.055,.022,0,false);
  box(books,.277,.029,.22,lime,-.046,.022,0,false);
  mesh(deck,new T.SphereGeometry(.095,26,18),solid(0x924837),-1.21,.971,.78);

  const selection = solid(0xf1cc80, .44, .58);
  const joint = solid(0x79553b,.76);
  const figures = [
    { name:'Mostarda', x:-1.46, z:.08, color:0xc39739, skin:0xc79362, hair:0x49372b },
    { name:'Terracota', x:.08, z:-.99, color:0xa65b46, skin:0x875535, hair:0x29282a },
    { name:'Verde', x:1.44, z:.32, color:0x47734b, skin:0xe6b281, hair:0x674531 }
  ];
  for (const figure of figures) {
    const group = new T.Group();
    group.name = figure.name;
    group.position.set(figure.x,.875,figure.z);
    group.rotation.y = Math.atan2(-figure.x, .21 - figure.z);
    deck.add(group);
    figure.group = group;
    const coat = new T.MeshPhysicalMaterial({color:figure.color,roughness:.91,bumpMap:feltNoise,bumpScale:.023,sheen:.78,sheenColor:new T.Color(figure.color),sheenRoughness:.83});
    const skin = solid(figure.skin);
    const hair = solid(figure.hair,.93);
    lathe(group,[[0,0],[.22,0],[.236,.018],[.236,.047],[.216,.063],[0,.064]],dark,0,0,0);
    figure.ring = mesh(group,new T.TorusGeometry(.224,.009,10,48),selection,0,.056,0,false);
    figure.ring.rotation.x = -Math.PI / 2;
    lathe(group,[[0,.09],[.129,.087],[.166,.15],[.185,.31],[.164,.49],[.127,.558],[.069,.578],[0,.574]],coat,0,0,0);
    for (const x of [-.075,.075]) {
      bevel(group,.113,.085,.18,.028,joint,x,.096,.036);
      const arm = mesh(group,new T.CapsuleGeometry(.045,.23,5,12),coat,x*2.22,.337,.015);
      arm.rotation.z = Math.sign(x)*.23;
      mesh(group,new T.SphereGeometry(.041,14,12),skin,x*2.59,.195,.03);
    }
    for (const y of [.260,.335,.410]) mesh(group,new T.SphereGeometry(.018,12,8),brass,0,y,.181,false);
    lathe(group,[[0,.528],[.082,.528],[.09,.551],[.071,.584],[0,.594]],lime,0,0,0,false);
    const head = mesh(group,new T.SphereGeometry(.132,26,18),skin,0,.678,.018);
    head.scale.set(1,1.02,.9);
    const crown = new T.SphereGeometry(.135,26,14,0,Math.PI*2,0,1.46);
    const cap = mesh(group,crown,hair,0,.701,.003);
    cap.rotation.x = -.32;
    for (const x of [-.044,.044]) mesh(group,new T.SphereGeometry(.011,12,8),black,x,.686,.127,false);
    mesh(group,new T.SphereGeometry(.017,12,8),skin,0,.661,.136,false);
    figure.eye = group.localToWorld(new T.Vector3(0,.686,.15));
    figure.forward = new T.Vector3(0,0,1).applyQuaternion(group.quaternion);
  }

  const fanCount = 31;
  const fanPoints = new Float32Array((fanCount + 1) * 3);
  const fanGeometry = new T.BufferGeometry();
  fanGeometry.setAttribute('position',new T.BufferAttribute(fanPoints,3));
  fanGeometry.setIndex(Array.from({length:fanCount - 1},(_,i)=>[0,i+1,i+2]).flat());
  const fan = new T.Mesh(fanGeometry,new T.MeshBasicMaterial({color:0xe9c178,transparent:true,opacity:.18,side:T.DoubleSide,depthWrite:false}));
  fan.frustumCulled = false;
  fan.renderOrder = 5;
  scene.add(fan);
  const traceGeometry = new T.BufferGeometry();
  traceGeometry.setAttribute('position',new T.BufferAttribute(new Float32Array(6),3));
  const trace = new T.Line(traceGeometry,new T.LineBasicMaterial({color:0xffda8b,transparent:true,opacity:.96,depthTest:true}));
  trace.frustumCulled = false;
  trace.renderOrder = 6;
  scene.add(trace);

  const camera = new T.PerspectiveCamera(41, 1, .025, 35);
  const diagnostics = new URLSearchParams(location.search).has('diagnostics');
  const cameraTarget = new T.Vector3();
  const to = new T.Vector3();
  const focus = new T.Vector3();
  const startCamera = new T.Vector3();
  const startTarget = new T.Vector3();
  let moveTime = 0;
  let frame = 0;
  let modelState;
  let paused = false;
  let lost = false;
  let dirty = true;
  let cameraMode = '';
  const pointer = new T.Vector2();
  const raycaster = new T.Raycaster();
  function resize() {
    dirty = true;
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1,mobile.matches ? 1.65 : 2));
    renderer.setSize(host.clientWidth,host.clientHeight,false);
    camera.aspect = host.clientWidth / Math.max(1,host.clientHeight);
    camera.updateProjectionMatrix();
    if (modelState) aim(modelState,true);
  }
  function aim(state, immediate = false) {
    const figure = figures[state.person];
    if (state.pov && state.present) {
      to.copy(figure.eye);
      focus.copy(figure.eye).addScaledVector(figure.forward,1.8);
      focus.y -= .255;
      camera.fov = mobile.matches ? 68 : 59;
    } else {
      const distance = mobile.matches ? 6.45 : camera.aspect > 1.12 ? 5.7 : 7.25;
      to.set(2.25,3.35,distance);
      focus.set(0,1.36,0);
      camera.fov = mobile.matches ? 49 : 43;
    }
    camera.updateProjectionMatrix();
    startCamera.copy(camera.position);
    startTarget.copy(cameraTarget);
    moveTime = immediate || reduce.matches ? -1 : performance.now();
  }
  function render(now) {
    frame = requestAnimationFrame(render);
    if (paused || lost || (!dirty && moveTime < 0)) return;
    const t = moveTime < 0 ? 1 : Math.min(1,(now-moveTime)/360);
    const eased = t*t*(3-2*t);
    camera.position.lerpVectors(startCamera,to,eased);
    cameraTarget.lerpVectors(startTarget,focus,eased);
    camera.lookAt(cameraTarget);
    renderer.render(scene,camera);
    dirty = false;
    if (t === 1) moveTime = -1;
    if (diagnostics) {
      renderer.domElement.dataset.drawCalls = renderer.info.render.calls;
      renderer.domElement.dataset.triangles = renderer.info.render.triangles;
    }
  }
  function update(state, blockedDistance) {
    dirty = true;
    const old = modelState;
    modelState = state;
    displayBox.position.set(state.boxX,1.258,.29);
    divider.position.set(state.divider,1.577,.055);
    for (const [i,figure] of figures.entries()) {
      figure.group.visible = state.present || i !== state.person;
      figure.ring.visible = i === state.person;
    }
    const figure = figures[state.person];
    fan.visible = state.present && !state.pov;
    trace.visible = fan.visible;
    const eye = figure.eye;
    fanGeometry.attributes.position.setXYZ(0,eye.x,1.31,eye.z);
    const direction = new T.Vector3();
    for (let i=0;i<fanCount;i++) {
      direction.copy(figure.forward).applyAxisAngle(T.Object3D.DEFAULT_UP,(i/(fanCount-1)-.5)*.95);
      const length = blockedDistance(eye,direction,2.6);
      fanGeometry.attributes.position.setXYZ(i+1,eye.x+direction.x*length,1.31,eye.z+direction.z*length);
    }
    fanGeometry.attributes.position.needsUpdate = true;
    const direct = new T.Vector3(state.boxX,1.43,.29).sub(eye);
    const length = direct.length();
    direct.normalize();
    const hit = blockedDistance(eye,direct,length);
    traceGeometry.attributes.position.setXYZ(0,eye.x,eye.y,eye.z);
    traceGeometry.attributes.position.setXYZ(1,eye.x+direct.x*hit,eye.y+direct.y*hit,eye.z+direct.z*hit);
    traceGeometry.attributes.position.needsUpdate = true;
    const nextMode = state.pov && state.present ? String(state.person) : 'overview';
    if (cameraMode !== nextMode) {
      aim(state,!old);
      cameraMode = nextMode;
    }
  }
  const onPointer = event => {
    if (modelState?.pov) return;
    const rect = renderer.domElement.getBoundingClientRect();
    pointer.set((event.clientX-rect.left)/rect.width*2-1,-((event.clientY-rect.top)/rect.height*2-1));
    raycaster.setFromCamera(pointer,camera);
    const active = figures.filter(figure=>figure.group.visible);
    const first = raycaster.intersectObjects(active.map(figure=>figure.group),true)[0];
    let parent = first?.object;
    while (parent && !figures.some(figure=>figure.group===parent)) parent=parent.parent;
    if (parent) onPerson(figures.findIndex(figure=>figure.group===parent));
  };
  renderer.domElement.addEventListener('pointerup',onPointer);
  const status = document.querySelector('#scene-status');
  renderer.domElement.addEventListener('webglcontextlost',event=>{
    event.preventDefault();
    lost = true;
    status.textContent = 'Visualização 3D interrompida. Você pode continuar pelo painel.';
    status.hidden = false;
  });
  renderer.domElement.addEventListener('webglcontextrestored',()=>{
    lost = false;
    dirty = true;
    status.hidden = true;
  });
  const observer = new ResizeObserver(resize);
  observer.observe(host);
  resize();
  frame = requestAnimationFrame(render);
  return {
    figures, update,
    pause(value) { paused = value; },
    dispose() {
      cancelAnimationFrame(frame);
      observer.disconnect();
      const resources = new Set();
      scene.traverse(object=>{
        if (object.geometry) resources.add(object.geometry);
        if (object.material) {
          for (const material of Array.isArray(object.material) ? object.material : [object.material]) {
            resources.add(material);
            for (const value of Object.values(material)) if (value?.isTexture) resources.add(value);
          }
        }
      });
      for (const resource of resources) resource.dispose();
      environment.dispose();
      renderer.dispose();
    }
  };
}
