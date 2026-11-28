import * as T from 'three/webgpu';
import { mx_noise_float, positionLocal, color, mix, smoothstep } from 'three/tsl';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { canvas, Surface, random } from './surface.ts';
import { createGeometry, updateGeometry, deform, type MaskState, type Ornament, type Tool, type Side } from './mask.ts';

export const backdrop = import.meta.env.BASE_URL + 'atelier.webp';
const brass = new T.MeshStandardNodeMaterial({ metalness: .84, roughness: .36, envMapIntensity: 1.2 });
const metalGrain = mx_noise_float(positionLocal.mul(24));
brass.colorNode = mix(color('#9a713d'),color('#b48a4f'),smoothstep(-.66,.66,metalGrain));
brass.roughnessNode = metalGrain.mul(.057).add(.37);
const gold = new T.MeshStandardMaterial({ color: 0xe9b76c, metalness: .80, roughness: .33 });
const darkBrass = new T.MeshStandardMaterial({ color: 0x644222, metalness: .77, roughness: .41 });
const normalZ = new T.Vector3(0,0,1);

function environment() {
  const map = canvas(512);
  map.height = 256;
  const ctx = map.getContext('2d')!;
  const fill = ctx.createLinearGradient(0,0,0,256);
  for (const [at, shade] of [[0,'#514c48'],[.4,'#7a6b57'],[.58,'#493526'],[.73,'#241912'],[1,'#100c0a']] as const) fill.addColorStop(at,shade);
  ctx.fillStyle = fill;
  ctx.fillRect(0,0,512,256);
  ctx.fillStyle = '#fff0cf';
  for (let i=0;i<3;i++) ctx.fillRect(55+i*12,55,9,68);
  ctx.fillStyle = '#b88d5c';
  ctx.fillRect(251,69,42,8);
  ctx.fillStyle = '#d79a54';
  ctx.fillRect(422,111,18,33);
  const texture = new T.CanvasTexture(map);
  texture.mapping = T.EquirectangularReflectionMapping;
  texture.colorSpace = T.SRGBColorSpace;
  return texture;
}

function pedestal() {
  const root = new T.Group();
  const profile = [
    [0,-1.72],[.75,-1.72],[.80,-1.71],[.83,-1.68],[.83,-1.61],[.8,-1.58],[.68,-1.56],[.62,-1.53],
    [.62,-1.48],[.74,-1.45],[1.17,-1.42],[1.25,-1.39],[1.28,-1.35],[1.28,-1.15],[1.26,-1.12],[1.20,-1.10],[1.08,-1.09],[.16,-1.09],[0,-1.09],
  ].map(([x,y])=>new T.Vector2(x,y));
  const base = new T.Mesh(new T.LatheGeometry(profile,128),brass);
  root.add(base);
  for (const [radius,y,width] of [[1.27,-1.16,.014],[1.26,-1.37,.012],[1.17,-1.094,.010],[1.07,-1.092,.008],[.82,-1.665,.011],[.72,-1.58,.009]]) {
    const ring = new T.Mesh(new T.TorusGeometry(radius,width,8,128),gold);
    ring.rotation.x = Math.PI/2; ring.position.y = y;
    root.add(ring);
  }
  const pin = new T.Mesh(new T.CylinderGeometry(.094,.14,.28,40),darkBrass);
  pin.position.set(0,-1.01,.04);
  root.add(pin);
  const engravings: T.BufferGeometry[] = [];
  const place = (angle: number,y: number,r=1.281) => new T.Vector3(r*Math.sin(angle),y,r*Math.cos(angle));
  for (let k=0;k<12;k++) {
    const a = k*Math.PI/6;
    const points = Array.from({length:12},(_,i) => place(a+(i-5.5)*.034,-1.30+(i-5.5)*.005));
    engravings.push(new T.TubeGeometry(new T.CatmullRomCurve3(points),16,.005,5));
    for (let i=0;i<5;i++) {
      const t = a-.15+i*.064;
      for (const sign of [-1,1]) {
        const y = -1.32+i*.009;
        const points = [place(t,y),place(t+sign*.04,y+sign*.023,1.287),place(t+sign*.084,y+sign*.035)];
        engravings.push(new T.TubeGeometry(new T.CatmullRomCurve3(points),7,.006,5));
      }
    }
  }
  const filigree = mergeGeometries(engravings);
  engravings.forEach(g=>g.dispose());
  root.add(new T.Mesh(filigree,gold));
  return root;
}

function contactShadow() {
  const texture = canvas(128);
  const ctx = texture.getContext('2d')!;
  const shadow = ctx.createRadialGradient(64,64,9,64,64,63);
  shadow.addColorStop(0,'rgba(8,4,2,.88)');
  shadow.addColorStop(.46,'rgba(10,5,2,.73)');
  shadow.addColorStop(1,'rgba(10,5,2,0)');
  ctx.fillStyle = shadow; ctx.fillRect(0,0,128,128);
  const plane = new T.Mesh(new T.PlaneGeometry(3.6,2.9), new T.MeshBasicMaterial({
    map: new T.CanvasTexture(texture), transparent: true, depthWrite: false,
  }));
  plane.rotation.x = -Math.PI/2;
  plane.position.set(.13,-1.73,.085);
  return plane;
}

function ornamentMesh(item: Ornament) {
  const glossy = item.kind === 'Cerâmica' || item.kind === 'Pedra' || item.kind === 'Abstrata';
  const soft = item.kind === 'Tecido' || item.kind === 'Fita' || item.kind === 'Pena';
  const m = new T.MeshPhysicalMaterial({
    color: item.color, metalness: item.kind === 'Linha' ? .65 : .08,
    roughness: glossy ? .28 : soft ? .78 : .5,
    clearcoat: glossy ? .85 : 0, clearcoatRoughness: .18,
    sheen: soft ? .8 : 0, sheenColor: new T.Color(item.color).lerp(new T.Color('#ffffff'),.4), sheenRoughness: .5,
    side: T.DoubleSide,
  });
  const group = new T.Group();
  if (item.kind === 'Flor') {
    for (let i=0;i<8;i++) {
      const theta = i*Math.PI/4;
      const petal = new T.Mesh(new T.SphereGeometry(.09,12,8),m);
      petal.scale.set(.48,1,.22);
      petal.position.set(Math.cos(theta)*.071,Math.sin(theta)*.071,.042);
      petal.rotation.z = theta-Math.PI/2;
      group.add(petal);
    }
    group.add(new T.Mesh(new T.SphereGeometry(.045,12,8),gold));
  } else if (item.kind === 'Fita' || item.kind === 'Tecido') {
    const cloth = new T.Mesh(new T.PlaneGeometry(item.kind === 'Fita' ? .078 : .23,.44,5,18),m);
    group.add(cloth);
    cloth.userData.fabric = true;
  } else if (item.kind === 'Pena' || item.kind === 'Linha') {
    const points = [new T.Vector3(0,0,.015),new T.Vector3(.04,.13,.09),new T.Vector3(.12,.29,.14),new T.Vector3(.26,.45,.14)];
    const spine = new T.CatmullRomCurve3(points);
    group.add(new T.Mesh(new T.TubeGeometry(spine,24,item.kind === 'Pena' ? .009 : .016,6),m));
    if (item.kind === 'Pena') {
      const barbs: T.BufferGeometry[] = [];
      for (let i=2;i<26;i++) {
        const p=spine.getPoint(i/28);
        for (const sign of [-1,1]) {
          const span=.085*sign*Math.sin(i/28*Math.PI);
          const end=p.clone().add(new T.Vector3(span,.055,.011));
          barbs.push(new T.TubeGeometry(new T.LineCurve3(p,end),1,.0048,4));
        }
      }
      group.add(new T.Mesh(mergeGeometries(barbs),m));
      barbs.forEach(g=>g.dispose());
    }
  } else {
    const geo = item.kind === 'Pedra' ? new T.DodecahedronGeometry(.11,0) : item.kind === 'Cerâmica' ? new T.OctahedronGeometry(.13,0) : new T.TorusKnotGeometry(.075,.022,40,6);
    const stone = new T.Mesh(geo,m);
    stone.position.z = .04;
    stone.scale.z = .58;
    group.add(stone);
  }
  group.scale.setScalar(item.size);
  return group;
}

function dust() {
  const rng = random(4242);
  const count = 140;
  const pos = new Float32Array(count*3);
  for (let i=0;i<count;i++) pos.set([(rng()-.5)*5.2,(rng()-.25)*3.6,(rng()-.5)*2.4+.6],i*3);
  const geo = new T.BufferGeometry();
  geo.setAttribute('position',new T.BufferAttribute(pos,3));
  geo.setAttribute('uv',new T.BufferAttribute(new Float32Array(count*2),2));
  const points = new T.Points(geo,new T.PointsMaterial({
    color: 0xffe2aa, size: .022, transparent: true, opacity: .5, depthWrite: false, blending: T.AdditiveBlending, sizeAttenuation: true,
  }));
  points.renderOrder = 2;
  return points;
}

function puppet() {
  const group = new T.Group();
  const fabric = new T.MeshStandardMaterial({ color: 0x643e49, roughness: .92 });
  const collar = new T.MeshStandardMaterial({ color: 0xd6bc91, roughness: .86 });
  const body = new T.Mesh(new T.LatheGeometry([[0,-.6],[.54,-.6],[.49,-.35],[.42,-.12],[.28,.13],[.17,.18],[0,.19]].map(([x,y])=>new T.Vector2(x,y)),48),fabric);
  group.add(body);
  const ruff = new T.Mesh(new T.TorusGeometry(.28,.085,10,40),collar);
  ruff.rotation.x = Math.PI/2;
  ruff.position.y = .16;
  group.add(ruff);
  for (const x of [-.44,.44]) {
    const arm = new T.Mesh(new T.CapsuleGeometry(.086,.41,6,12),fabric);
    arm.position.set(x,-.23,0);
    arm.rotation.z = Math.sign(x)*.38;
    group.add(arm);
  }
  return group;
}

export class Studio {
  private renderer = new T.WebGPURenderer({ antialias: true, alpha: true, forceWebGL: !navigator.gpu });
  private scene = new T.Scene();
  private camera = new T.OrthographicCamera();
  private stage = new T.Group();
  private turntable = new T.Group();
  private mask = new T.Group();
  private body = puppet();
  private mirror = new T.Group();
  private mirrorMask: T.Mesh;
  private mirrorPosition = new T.Vector3();
  private stand = pedestal();
  private surfaces = [new Surface(),new Surface()] as const;
  private geos = createGeometry();
  private faces = [
    new T.Mesh(this.geos.outer,this.surfaces[0].material),
    new T.Mesh(this.geos.inner,this.surfaces[1].material),
  ] as const;
  private edge = new T.Mesh(this.geos.rim,new T.MeshStandardMaterial({color:0xcfb393,roughness:.86}));
  private ornaments = new T.Group();
  private sun = new T.DirectionalLight(0xffdbb6,2.58);
  private fill = new T.DirectionalLight(0xccd9e4,.82);
  private rimLight = new T.DirectionalLight(0xffae63,1.55);
  private candle = new T.PointLight(0xff9a4a,1.1,9,1.6);
  private motes: T.Points;
  private ray = new T.Raycaster();
  private warm = new T.Color();
  private dirty = true;
  private startTime = performance.now();
  private previousTime = 0;
  private rotation = 0;
  private zoom = 1;
  private deviceScale = 1;
  private ready = false;
  private disposed = false;
  private paused = false;
  private resizeObserver?: ResizeObserver;
  private fps = 60;
  private automatic = true;
  private adaptiveAt = 0;
  private backdropImage = new Image();
  private ambientAt = 0;
  private candleBase = 1.1;
  targetRotation = 0;
  theater = false;
  movement = 'Balanço';
  constructor(private host: HTMLElement) {
    this.renderer.domElement.setAttribute('aria-label','Máscara 3D interativa');
    this.renderer.domElement.tabIndex = 0;
    this.renderer.domElement.setAttribute('aria-describedby','stage-help');
    this.renderer.toneMapping = T.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.04;
    this.scene.environment = environment();
    this.scene.environmentIntensity = .82;
    this.scene.add(new T.HemisphereLight(0xd8e1de,0x7a4e35,.41));
    this.sun.position.set(-3.8,4.5,5);
    this.sun.castShadow = true;
    this.sun.shadow.mapSize.set(1024,1024);
    this.sun.shadow.bias = -.0006;
    this.sun.shadow.normalBias = .02;
    this.sun.shadow.radius = 4;
    Object.assign(this.sun.shadow.camera,{left:-2.2,right:2.2,top:2.4,bottom:-2.2,near:.5,far:16});
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = T.PCFSoftShadowMap;
    this.candle.position.set(-2.4,.4,2.2);
    this.motes = dust();
    this.scene.add(this.candle,this.motes);
    this.fill.position.set(4,1,4);
    this.rimLight.position.set(1.9,2,-3);
    this.scene.add(this.sun,this.fill,this.rimLight,this.stage,this.mirror);
    this.stage.add(contactShadow(),this.turntable);
    this.turntable.add(this.stand,this.mask,this.body);
    this.mask.position.set(0,.232,-.15);
    this.mask.add(...this.faces,this.edge,this.ornaments);
    for (const m of [...this.faces,this.edge]) { m.castShadow = true; m.receiveShadow = true; }
    this.stand.traverse(o=>{ if (o instanceof T.Mesh) o.receiveShadow = true; });
    this.body.traverse(o=>{ if (o instanceof T.Mesh) { o.castShadow = true; o.receiveShadow = true; } });
    this.mirrorMask = new T.Mesh(this.geos.outer, new T.MeshStandardMaterial({
      color: 0xc1a58c, map: this.surfaces[0].material.map, roughness: .85, transparent: true, opacity: .66,
    }));
    this.mirrorMask.scale.x = -1;
    this.mirror.add(this.mirrorMask);
    this.mirror.scale.setScalar(.43);
    this.body.position.set(0,-.46,.04);
    this.body.visible = false;
    this.backdropImage.src = backdrop;
  }
  get element() { return this.renderer.domElement; }
  async init() {
    if (this.disposed) return;
    await this.renderer.init();
    this.host.append(this.element);
    this.ready = true;
    this.resizeObserver = new ResizeObserver(()=>this.resize());
    this.resizeObserver.observe(this.host);
    this.resize();
    void this.renderer.setAnimationLoop(this.frame);
  }
  pause() {
    this.paused = true;
    if (this.ready) void this.renderer.setAnimationLoop(null);
  }
  resume() {
    if (this.disposed || !this.paused || !this.ready) return;
    this.paused = false;
    this.previousTime = performance.now();
    this.dirty = true;
    void this.renderer.setAnimationLoop(this.frame);
  }
  dispose() {
    if (this.disposed) return;
    this.disposed = true;
    this.paused = true;
    this.resizeObserver?.disconnect();
    if (this.ready) {
      void this.renderer.setAnimationLoop(null);
      this.renderer.dispose();
    }
  }
  get qaInfo() {
    const r = this.renderer.info?.render as { calls?: number; triangles?: number } | undefined;
    return { calls: r?.calls ?? 0, triangles: r?.triangles ?? 0, paused: this.paused, disposed: this.disposed };
  }
  resize() {
    if (!this.ready) return;
    const width = this.host.clientWidth;
    const height = this.host.clientHeight;
    if (!width || !height) return;
    const mobile = width < 760;
    const span = (mobile ? (width / height < .60 ? 5.25 : 4.93) : 4.83) / this.zoom;
    const ratio = width/height;
    const shift = mobile ? 0 : span*ratio*.033;
    const lift = mobile ? -.19 : 0;
    Object.assign(this.camera, {left:-span*ratio/2+shift,right:span*ratio/2+shift,top:span/2+lift,bottom:-span/2+lift,near:.05,far:45});
    this.camera.position.set(0,1.28,8.6);
    this.camera.lookAt(0,.00,0);
    this.camera.updateProjectionMatrix();
    this.camera.updateMatrixWorld();
    this.mirror.visible = !mobile && ratio > 1.35 && this.zoom === 1;
    const backdropRatio = 1672/941;
    const backdropWidth = Math.max(width,height*backdropRatio);
    const left = (width-backdropWidth)/2;
    const mirrorX = (left+backdropWidth*.195)/width*2-1;
    this.mirrorPosition.set(mirrorX,.137,.35).unproject(this.camera);
    this.mirror.position.copy(this.mirrorPosition);
    this.renderer.setPixelRatio(this.deviceScale);
    this.renderer.setSize(width,height);
    this.dirty=true;
  }
  quality(value: string) {
    this.automatic = value === 'auto';
    const cap = value === 'low' ? .78 : value === 'high' ? 2 : 1.45;
    this.deviceScale = Math.min(devicePixelRatio,cap);
    const shadowSize = value === 'low' ? 512 : value === 'high' ? 2048 : 1024;
    if (this.sun.shadow.mapSize.x !== shadowSize) {
      this.sun.shadow.mapSize.set(shadowSize,shadowSize);
      this.sun.shadow.map?.dispose();
      this.sun.shadow.map = null;
    }
    this.resize();
  }
  toggleZoom() { this.zoom = this.zoom === 1 ? 1.22 : 1; this.resize(); return this.zoom > 1; }
  light(intensity: number, temperature: number) {
    this.warm.set('#ff9d59').lerp(new T.Color('#d2e6ff'),temperature);
    this.sun.color.copy(this.warm);
    this.sun.intensity = intensity * 2.8;
    this.rimLight.intensity = intensity * 1.42;
    this.candleBase = intensity * 1.1;
    this.dirty = true;
  }
  setState(state: MaskState) {
    this.updateForm(state);
    for (const side of [0,1] as const) this.surfaces[side].reset(state.material[side],state.paint[side]);
    for (const group of [...this.ornaments.children]) {
      group.traverse(o=>{ if (o instanceof T.Mesh) { o.geometry.dispose(); if (o.material !== gold) o.material.dispose(); } });
      group.removeFromParent();
    }
    for (const item of state.ornaments) {
      const mesh = ornamentMesh(item);
      mesh.traverse(o=>{ if (o instanceof T.Mesh) o.castShadow = true; });
      this.ornaments.add(mesh);
    }
    this.positionOrnaments(state);
    this.dirty = true;
  }
  sculpt(state: MaskState, side: Side, point: T.Vector3, tool: Tool, radius: number, pressure: number, mirror: boolean, lateral: number) {
    const surface = this.faces[side].geometry.getAttribute('position') as T.BufferAttribute;
    deform(state,side,point,tool,radius,pressure,mirror,lateral,surface);
    this.updateForm(state);
  }
  updateForm(state: MaskState) { updateGeometry(this.geos,state); this.positionOrnaments(state); this.dirty = true; }
  positionOrnaments(state: MaskState) {
    state.ornaments.forEach((item,index)=>{
      const mesh = this.ornaments.children[index];
      if (!mesh) return;
      const geometry = this.faces[item.side].geometry;
      const normal = new T.Vector3().fromBufferAttribute(geometry.getAttribute('normal'),item.vertex).normalize();
      mesh.position.fromBufferAttribute(geometry.getAttribute('position'),item.vertex).addScaledVector(normal,.019);
      mesh.quaternion.setFromUnitVectors(normalZ,normal);
    });
  }
  paint(state: MaskState, side: 0 | 1) {
    const stroke = state.paint[side].at(-1)!;
    this.surfaces[side].draw(stroke,stroke.dots.length-1);
    this.surfaces[side].upload();
    this.dirty = true;
  }
  hit(clientX: number,clientY: number,side: 0 | 1) {
    const rect = this.element.getBoundingClientRect();
    this.ray.setFromCamera(new T.Vector2((clientX-rect.left)/rect.width*2-1,1-(clientY-rect.top)/rect.height*2),this.camera);
    const hit = this.ray.intersectObject(this.faces[side],false)[0];
    if (!hit?.uv) return null;
    return { point: this.mask.worldToLocal(hit.point.clone()), uv: hit.uv };
  }
  refresh() { this.dirty = true; }
  private frame = (now: number) => {
    const dt = Math.min(100,now-this.previousTime || 16);
    this.previousTime = now;
    const t = (now - this.startTime)*.001;
    const anim = Math.abs(this.rotation-this.targetRotation) > .0005;
    const cloth = this.ornaments.children.some(g=>g.children.some(o=>o.userData.fabric));
    const motion = !matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!this.dirty && !anim && !motion && !this.theater && !cloth) return;
    if (!this.dirty && !anim && !this.theater && !cloth && now-this.ambientAt < 66) return;
    this.ambientAt = now;
    if (motion) {
      this.candle.intensity = this.candleBase*(.86 + Math.sin(t*7.3)*.06 + Math.sin(t*13.1+1.7)*.05 + Math.sin(t*2.1)*.04);
      this.motes.rotation.y = t*.018;
      this.motes.position.y = Math.sin(t*.21)*.05;
    }
    this.rotation = T.MathUtils.damp(this.rotation,this.targetRotation,10,dt*.001);
    this.turntable.rotation.y = this.rotation;
    this.mirror.rotation.y = Math.PI*.19 - this.rotation*.72;
    this.body.visible = this.theater;
    this.mask.scale.setScalar(this.theater ? .64 : 1.025);
    this.mask.position.y = this.theater ? .47 : .258;
    const action = this.theater && motion ? Math.sin(t*(this.movement === 'Dança' ? 3.3 : 1.6)) : 0;
    this.turntable.rotation.z = action * (this.movement === 'Dança' ? .19 : .075);
    this.turntable.position.y = this.theater && this.movement === 'Dança' ? Math.abs(action)*.11 : 0;
    this.mask.rotation.x = this.theater && this.movement === 'Reverência' ? Math.max(0,action)*.37 : 0;
    if (cloth && motion) for (const group of this.ornaments.children) for (const object of group.children) {
      if (!(object instanceof T.Mesh) || !object.userData.fabric) continue;
      const pos = object.geometry.getAttribute('position') as T.BufferAttribute;
      for(let i=0;i<pos.count;i++) {
        const y = pos.getY(i);
        const hanging = (.22-y)/.44;
        pos.setZ(i,.035 + hanging * (.095+Math.sin(hanging*6-t*3)*.061 + Math.cos(pos.getX(i)*31)*.021));
      }
      object.position.y = -.22;
      pos.needsUpdate = true;
      object.geometry.computeVertexNormals();
    }
    const before = performance.now();
    this.renderer.render(this.scene,this.camera);
    const frameCost = performance.now()-before;
    this.fps = this.fps*.94 + Math.min(60,1000/Math.max(16,frameCost))*.06;
    if (this.automatic && this.fps < 35 && this.deviceScale > .76 && now-this.adaptiveAt > 2000) {
      this.adaptiveAt = now;
      this.deviceScale *= .82;
      this.resize();
    }
    this.dirty = false;
  };
  image(width = 1600) {
    if (!this.ready) throw new Error('O ateliê ainda está carregando.');
    const source = this.element;
    const output = canvas(width);
    output.height = Math.round(width*source.height/source.width);
    const ctx = output.getContext('2d')!;
    if (this.backdropImage.complete && this.backdropImage.naturalWidth) {
      const img = this.backdropImage;
      const scale = Math.max(output.width/img.width,output.height/img.height);
      ctx.drawImage(img,(output.width-img.width*scale)/2,(output.height-img.height*scale)/2,img.width*scale,img.height*scale);
    }
    this.renderer.render(this.scene,this.camera);
    ctx.drawImage(source,0,0,output.width,output.height);
    return output;
  }
  exportGroup() {
    const group = new T.Group();
    group.name = 'Máscara';
    for (const o of [...this.faces,this.edge,this.ornaments]) group.add(o.clone(true));
    group.children[0].name = 'Exterior';
    group.children[1].name = 'Interior';
    group.children[2].name = 'Espessura';
    return group;
  }
}
