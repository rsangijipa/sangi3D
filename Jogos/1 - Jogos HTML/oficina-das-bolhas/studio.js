import * as T from '../../../Sistema/shared/vendor/three.module.js';

function canvasMap(width, height, paint) {
  const canvas = Object.assign(document.createElement('canvas'), { width, height });
  paint(canvas.getContext('2d'), width, height);
  const texture = new T.CanvasTexture(canvas);
  texture.colorSpace = T.SRGBColorSpace;
  return texture;
}

function sampler(seed) {
  return () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 4294967296;
  };
}

function grain(base, seed, stretch = 1) {
  return canvasMap(512, 512, (ctx, width, height) => {
    const rand = sampler(seed);
    ctx.fillStyle = base;
    ctx.fillRect(0, 0, width, height);
    for (let i = 0; i < 12500; i++) {
      const alpha = rand() * .12;
      ctx.fillStyle = i % 3 ? `rgba(86,53,73,${alpha})` : `rgba(255,249,227,${alpha})`;
      ctx.fillRect(rand() * width, rand() * height, (1 + rand() * 3) * stretch, .4 + rand() * 1.6);
    }
  });
}

function stoneMap() {
  return canvasMap(1024, 512, (ctx, width, height) => {
    const rand = sampler(513);
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#e1b9ad');
    gradient.addColorStop(.38, '#edd3c1');
    gradient.addColorStop(1, '#c5948f');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    for (let i = 0; i < 8800; i++) {
      const x = rand() * width;
      const y = rand() * height;
      ctx.fillStyle = i % 3 ? 'rgba(110,60,70,.10)' : 'rgba(255,247,216,.45)';
      ctx.fillRect(x, y, 1 + rand() * 2.8, .5 + rand());
    }
    for (let i = 0; i < 18; i++) {
      const start = rand() * width;
      ctx.beginPath();
      ctx.moveTo(start, -25);
      ctx.bezierCurveTo(start + 190, 130, start - 175, 295, start + 240, height + 30);
      ctx.lineWidth = .5 + rand() * 3;
      ctx.strokeStyle = i % 2 ? 'rgba(255,239,210,.22)' : 'rgba(118,64,74,.09)';
      ctx.stroke();
    }
  });
}

function windowMap() {
  return canvasMap(384, 512, (ctx, width, height) => {
    const rand = sampler(72);
    const gradient = ctx.createLinearGradient(0, 0, width * .25, height);
    gradient.addColorStop(0, '#bbdcf7');
    gradient.addColorStop(.48, '#e9f1fa');
    gradient.addColorStop(1, '#fff2dc');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    ctx.filter = 'blur(14px)';
    for (let i = 0; i < 95; i++) {
      ctx.beginPath();
      const x = rand() * width;
      const y = height * (.49 + rand() * .58);
      ctx.fillStyle = ['#91aeb0', '#acc2b4', '#c2c5c6', '#e6ebd2', '#edefe3'][i % 5];
      ctx.ellipse(x, y, 6 + 38 * rand(), 6 + 22 * rand(), .2, 0, 2 * Math.PI);
      ctx.fill();
    }
    ctx.filter = 'none';
    const haze = ctx.createLinearGradient(0, height * .28, 0, height);
    haze.addColorStop(0, 'rgba(255,246,234,.05)');
    haze.addColorStop(1, 'rgba(255,246,234,.76)');
    ctx.fillStyle = haze;
    ctx.fillRect(0, 0, width, height);
  });
}

function printedLabel(title, sub, tint, ticks = false) {
  return canvasMap(384, 190, (ctx, width, height) => {
    ctx.fillStyle = '#f4e6ce';
    ctx.fillRect(0, 0, width, height);
    ctx.strokeStyle = tint;
    ctx.lineWidth = 2;
    ctx.strokeRect(13, 12, width - 26, height - 24);
    ctx.fillStyle = tint;
    ctx.font = '50px Georgia';
    ctx.textAlign = 'center';
    ctx.fillText(title, width / 2, 91);
    ctx.font = '22px Georgia';
    ctx.fillText(sub, width / 2, 135);
    if (ticks) {
      for (let i = 0; i < 20; i++) ctx.fillRect(39 + i * 16, 151, 2, i % 5 ? 5 : 10);
    }
  });
}

const envelope = new T.SphereGeometry(1, 40, 28);

function soapMaterial() {
  return new T.ShaderMaterial({
    transparent: true, depthWrite: false,
    uniforms: { filmTime: { value: 0 }, phase: { value: 0 }, intensity: { value: 1 }, flatFilm: { value: 0 } },
    vertexShader: `
      varying vec3 worldPosition;
      varying vec3 objectPoint;
      varying vec3 worldNormal;
      void main() {
        objectPoint = position;
        worldNormal = normalize(mat3(modelMatrix) * normal);
        worldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float filmTime;
      uniform float phase;
      uniform float intensity;
      uniform float flatFilm;
      varying vec3 worldPosition;
      varying vec3 objectPoint;
      varying vec3 worldNormal;
      float rectangle(vec2 uv, vec2 halfSize, float softness) {
        vec2 edge = abs(uv) - halfSize;
        return 1.0 - smoothstep(0.0, softness, max(edge.x, edge.y));
      }
      void main() {
        vec3 n = normalize(worldNormal);
        vec3 v = normalize(cameraPosition - worldPosition);
        vec3 p = objectPoint;
        float dotNV = clamp(dot(n, v), 0.0, 1.0);
        float rim = pow(1.0 - dotNV, 2.15);
        float liquidFlow = sin(p.x * 3.3 + p.y * 3.6 + phase + filmTime * .72);
        liquidFlow += .5 * sin(p.x * -5.9 + p.y * 6.4 + p.z * 1.8 - filmTime * .45 + phase);
        float film = 1.7 + .67 * (1.0 - p.y) + .41 * liquidFlow + .19 * sin(11.0 * p.y + 2.0 * p.x + liquidFlow);
        float optical = film * (0.75 + .25 * dotNV);
        vec3 spectrum = .5 + .5 * cos(6.28318 * (optical * vec3(.84, 1.09, 1.30) + vec3(.06, .18, .35)));
        spectrum = pow(spectrum, vec3(.60));
        vec3 direction = reflect(-v, n);
        vec3 windowAxis = normalize(vec3(-.73, .39, .56));
        vec3 horizontal = normalize(cross(vec3(0.,1.,0.), windowAxis));
        vec3 vertical = normalize(cross(windowAxis, horizontal));
        vec2 pane = vec2(dot(direction, horizontal), dot(direction, vertical));
        float wholeWindow = rectangle(pane, vec2(.32, .40), .11);
        float muntins = smoothstep(.014, .041, abs(pane.x + .018)) * smoothstep(.012, .040, abs(pane.y - .045));
        float windowLight = wholeWindow * muntins * smoothstep(.55, .96, dot(direction, windowAxis));
        float softbox = pow(max(0.0, dot(direction, normalize(vec3(.86, -.26, .48)))), 41.0);
        float glaze = pow(max(0.0, dot(direction, normalize(vec3(.60, .73, -.50)))), 13.0);
        float sheen = smoothstep(.57, .91, abs(liquidFlow) * .65) * (.11 + rim * .33);
        vec3 tint = mix(spectrum * .72 + vec3(.065, .035, .09), vec3(1.0, .89, .99), rim * .40);
        tint = mix(tint, vec3(1.0, .97, .89), clamp(windowLight * .97 + softbox * .62 + glaze * .22, 0.0, 1.0));
        float edge = smoothstep(.57, .91, rim);
        float alpha = .10 + rim * .64 + sheen + windowLight * .63 + softbox * .40 + glaze * .21;
        alpha += edge * .21;
        gl_FragColor = vec4(tint, min(.98, alpha) * intensity * mix(1.0, .62, flatFilm));
        #include <colorspace_fragment>
      }
    `
  });
}

export function bubbleMesh(scene, phase) {
  const mesh = new T.Mesh(envelope, soapMaterial());
  mesh.material.uniforms.phase.value = phase;
  scene.add(mesh);
  return mesh;
}

export function createStudio(renderer) {
  const scene = new T.Scene();
  const textures = new Set();
  const texture = (map) => { textures.add(map); return map; };
  const map = (base, seed, stretch) => texture(grain(base, seed, stretch));
  const standard = (color, roughness, extra = {}) => new T.MeshStandardMaterial({ color, roughness, ...extra });
  const porcelain = (color) => new T.MeshPhysicalMaterial({ color, roughness: .24, clearcoat: .65, clearcoatRoughness: .19 });
  const add = (geometry, material, parent, x, y, z) => {
    const mesh = new T.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    mesh.receiveShadow = true;
    parent.add(mesh);
    return mesh;
  };
  const cast = mesh => { mesh.castShadow = true; return mesh; };
  const box = (w, h, d, material, parent, x, y, z) => add(new T.BoxGeometry(w, h, d), material, parent, x, y, z);
  const turn = (profile, material, parent, x, y, z) => add(new T.LatheGeometry(profile.map(([a,b]) => new T.Vector2(a,b)), 48), material, parent, x,y,z);
  const torus = (radius, tube, material, parent, x,y,z) => add(new T.TorusGeometry(radius, tube, 12, 56), material, parent, x,y,z);
  const plane = (w,h,material,parent,x,y,z) => add(new T.PlaneGeometry(w,h),material,parent,x,y,z);
  const room = new T.Group();
  scene.add(room);

  const wall = standard(0xffffff, .88, { map: map('#ad98a4', 39) });
  const plaster = standard(0xffffff, .9, { map: map('#dbc1b8', 931) });
  const trim = standard('#ead6c9', .63);
  const sill = standard('#dec4b7', .63);
  const walnut = standard(0xffffff, .63, { map: map('#5c3441', 71, 7) });
  const brass = standard('#c3894c', .28, { metalness: .88 });
  const copper = standard('#96504c', .34, { metalness: .76 });
  const chrome = standard('#d2d4e6', .19, { metalness: .91 });
  const cloth = standard(0xffffff, .94, { map: map('#849196', 413, 3) });
  const pink = porcelain('#aa586b');
  const lilac = porcelain('#b39bb4');
  const mint = porcelain('#73998c');
  const white = porcelain('#e2c7b5');
  const black = standard('#3c333e', .54);
  const liquid = new T.MeshPhysicalMaterial({ color: '#7aa89b', metalness: .19, roughness: .14, clearcoat: 1, clearcoatRoughness: .05 });

  // The window and illuminated panels also drive image-based reflections on the tabletop objects.
  const reflectionRoom = new T.Scene();
  reflectionRoom.background = new T.Color('#9a8589');
  const panel = (w,h,x,y,z, color, strength) => {
    const mat = new T.MeshBasicMaterial({ color: new T.Color(color).multiplyScalar(strength), side: T.DoubleSide });
    const light = plane(w,h,mat,reflectionRoom,x,y,z);
    light.lookAt(0, .65, 0);
  };
  panel(3.2,4.7,-4,3,2,'#f4fbff',3.8);
  panel(3.5,1.8,.7,4,-3,'#fae8dc',2.0);
  panel(1.9,4.0,3,2,1,'#ffbddd',1.55);
  panel(2.8,1.5,0,-1,1,'#e6aa91',.9);
  const pmrem = new T.PMREMGenerator(renderer);
  const reflections = pmrem.fromScene(reflectionRoom, .025, .1, 24);
  scene.environment = reflections.texture;
  scene.environmentIntensity = .86;
  reflectionRoom.traverse(o => { o.geometry?.dispose(); o.material?.dispose(); });
  pmrem.dispose();

  scene.background = new T.Color('#ac99a2');
  scene.fog = new T.Fog('#b29fa7', 10, 24);
  scene.add(new T.HemisphereLight('#e6edff', '#b78e80', 1.24));
  const daylight = new T.DirectionalLight('#fff2df', 2.6);
  daylight.position.set(-3.7, 5.5, 2.2);
  daylight.target.position.set(0,.6,0);
  daylight.castShadow = true;
  daylight.shadow.camera.left = -4;
  daylight.shadow.camera.right = 4;
  daylight.shadow.camera.top = 4.3;
  daylight.shadow.camera.bottom = -3.4;
  daylight.shadow.camera.near = .8;
  daylight.shadow.camera.far = 12;
  daylight.shadow.mapSize.set(1024,1024);
  daylight.shadow.normalBias = .023;
  daylight.shadow.radius = 3;
  scene.add(daylight, daylight.target);
  const bounce = new T.DirectionalLight('#d7cdff', .88);
  bounce.position.set(4, 3, -2);
  scene.add(bounce);

  box(17, 6.8, .18, wall, room, 0, 2.27, -3.0);
  box(.18, 6.8, 11, plaster, room, -4.72, 2.27, 1.8);
  box(16, .16, 13, plaster, room, 0, -1.1, 1.1);
  box(16, .14, .12, trim, room, 0, -1.0, -2.84);
  box(16, .09, .1, trim, room, 0, .60, -2.84);
  for (let i = -8; i <= 8; i++) box(.028, 1.62, .06, wall, room, i * .59, -.19, -2.86);

  const window = new T.Group();
  window.position.set(-2.25, 2.48, -2.79);
  room.add(window);
  box(2.86, 3.36, .15, trim, window, 0,0,-.02);
  const glassView = new T.MeshBasicMaterial({ map: texture(windowMap()), toneMapped: false });
  plane(2.57, 3.05, glassView, window, 0,0,.09);
  for (const x of [-1.29, 0, 1.29]) box(.064, 3.14, .088, trim, window, x,0,.14);
  for (const y of [-1.53, .48, 1.53]) box(2.66, .063, .088, trim, window, 0,y,.14);
  box(3.04, .113, .47, sill, window, 0,-1.59,.23);
  box(2.87, .057, .13, white, window, 0,-1.65,.38);

  const shadowTexture = texture(canvasMap(128,128,(ctx,w,h) => {
    const fade = ctx.createRadialGradient(w/2,h/2,2,w/2,h/2,w/2);
    fade.addColorStop(0,'rgba(51,25,44,.64)');
    fade.addColorStop(.48,'rgba(51,25,44,.36)');
    fade.addColorStop(1,'rgba(51,25,44,0)');
    ctx.fillStyle = fade;
    ctx.fillRect(0,0,w,h);
  }));
  const shade = new T.MeshBasicMaterial({ map: shadowTexture, transparent:true, depthWrite:false, toneMapped:false });
  function contact(x,z,width,depth) {
    const shadow = plane(width,depth,shade,room,x,.018,z);
    shadow.rotation.x = -Math.PI / 2;
  }

  const marbleMap = texture(stoneMap());
  const marble = new T.MeshPhysicalMaterial({ map: marbleMap,color: '#ffffff',roughness:.4,clearcoat:.36,clearcoatRoughness:.28 });
  function slab(w,d,h,r,mat,parent,x,y,z) {
    const shape = new T.Shape();
    const a = w / 2, b = d / 2;
    shape.moveTo(-a+r,-b);
    shape.lineTo(a-r,-b); shape.quadraticCurveTo(a,-b,a,-b+r);
    shape.lineTo(a,b-r); shape.quadraticCurveTo(a,b,a-r,b);
    shape.lineTo(-a+r,b); shape.quadraticCurveTo(-a,b,-a,b-r);
    shape.lineTo(-a,-b+r); shape.quadraticCurveTo(-a,-b,-a+r,-b);
    const g = new T.ExtrudeGeometry(shape,{ depth:h, bevelEnabled:true,bevelThickness:.019,bevelSize:.023,bevelSegments:3,curveSegments:7 });
    g.rotateX(-Math.PI / 2);
    const uv = g.attributes.uv;
    for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i)/w + .5, uv.getY(i)/d + .5);
    return add(g,mat,parent,x,y,z);
  }

  slab(5.72,3.02,.15,.16,marble,room,0,-.17,.0);
  slab(5.56,2.87,.09,.10,walnut,room,0,-.30,0);
  box(5.19,.48,2.66,walnut,room,0,-.55,0);
  box(5.20,.022,.03,brass,room,0,-.32,1.35);
  for (const x of [-1.63,0,1.63]) {
    box(1.56,.32,.04,walnut,room,x,-.53,1.35);
    const handle = torus(.078,.012,brass,room,x,-.53,1.403);
    handle.scale.x = 1.45;
  }

  const shelf = (x,y,width) => {
    box(width,.103,.55,walnut,room,x,y,-2.58);
    box(width,.023,.035,brass,room,x,y+.042,-2.286);
    for (const dx of [-width*.32,width*.32]) box(.052,.22,.33,brass,room,x+dx,y-.13,-2.72);
  };
  shelf(2.53,1.03,2.15);
  shelf(2.53,2.31,2.15);
  function bottle(x,y,z,scale,material,label,cap = brass) {
    const bottleGroup = new T.Group();
    room.add(bottleGroup);
    bottleGroup.position.set(x,y,z);
    bottleGroup.scale.setScalar(scale);
    cast(turn([[.0,0],[.17,0],[.205,.045],[.205,.37],[.20,.43],[.16,.49],[.10,.54],[.094,.58],[.094,.65]],material,bottleGroup,0,0,0));
    add(new T.CylinderGeometry(.103,.101,.10,32),cap,bottleGroup,0,.67,0);
    for (const h of [.631,.654,.677,.70]) {
      const lip = torus(.104,.004,cap,bottleGroup,0,h,0);
      lip.rotation.x = Math.PI / 2;
    }
    if (label) {
      const paper = new T.MeshBasicMaterial({ map:texture(printedLabel(...label)) });
      const wrap = new T.CylinderGeometry(.207,.207,.20,25,1,true,-.82,1.64);
      add(wrap,paper,bottleGroup,0,.263,0);
    }
    return bottleGroup;
  }
  bottle(1.78,1.09,-2.54,.94,mint,['Sabão','SOLUÇÃO','#4a6361']);
  bottle(2.29,1.09,-2.53,.64,pink);
  bottle(2.78,1.09,-2.52,.86,white);
  bottle(3.15,1.09,-2.52,.57,lilac);
  bottle(1.76,2.37,-2.56,.72,white);
  bottle(2.08,2.37,-2.56,.58,mint);
  bottle(3.14,2.37,-2.56,.97,pink);

  const framed = new T.MeshBasicMaterial({ map: texture(printedLabel('Película', 'OFICINA DAS BOLHAS', '#584057', true)) });
  box(1.30, .73, .09, walnut, room, .55, 2.89, -2.81);
  plane(1.17,.60,framed,room,.55,2.89,-2.759);

  // A glazed bath, folded linen and dispensing bottles furnish the working surface.
  const bath = new T.Group();
  bath.position.set(-.92, 0, .78);
  room.add(bath);
  contact(-.92,.78,1.55,1.30);
  cast(turn([[0,.018],[.40,.018],[.47,.039],[.51,.095],[.57,.19],[.61,.27],[.61,.31],[.59,.326],[.55,.321],[.54,.30],[.52,.24],[.46,.13],[.37,.10],[0,.10]],pink,bath,0,0,0));
  const bathRim = torus(.589,.014,brass,bath,0,.313,0);
  bathRim.rotation.x = Math.PI / 2;
  add(new T.CylinderGeometry(.538,.515,.025,56),liquid,bath,0,.256,0);
  const bathRipples = [];
  for (let i=0;i<3;i++) {
    const material = new T.MeshBasicMaterial({ color: '#e0f8ed', transparent:true, opacity:0, depthWrite:false });
    const ripple = torus(.47,.0035,material,bath,0,.271+i*.0006,0);
    ripple.rotation.x = Math.PI / 2;
    ripple.visible = false;
    bathRipples.push(ripple);
  }
  const foamRandom = sampler(38);
  const foam = new T.InstancedMesh(new T.SphereGeometry(1,10,8), porcelain('#e9e3da'), 47);
  const transform = new T.Object3D();
  for (let i=0;i<foam.count;i++) {
    const a = (2.65 + foamRandom() * 4.31);
    const r = .438 + foamRandom()*.095;
    const s = .009 + foamRandom()*.026;
    transform.position.set(Math.cos(a)*r,.266+s*.34,Math.sin(a)*r);
    transform.scale.set(s,s*.56,s);
    transform.updateMatrix();
    foam.setMatrixAt(i,transform.matrix);
  }
  bath.add(foam);

  const towel = slab(1.30,.82,.029,.11,cloth,room,1.02,.01,.70);
  towel.rotation.y = -.18;
  contact(1.17,.71,1.52,.83);
  const folded = slab(1.22,.66,.033,.11,cloth,room,1.02,.045,.76);
  folded.rotation.y = -.18;
  const seam = standard('#a9aca9', .9);
  for (const x of [.49,1.51]) {
    const strip = box(.015,.007,.53,seam,room,x,.100,.77+(x-1)*.18);
    strip.rotation.y = -.18;
  }

  contact(-1.94,-.48,1.22,.95);
  bottle(-1.94,.02,-.48,1.57,mint,['Sabão','SOLUÇÃO PARA BOLHAS','#425d54'],chrome);
  contact(-1.35,-.81,1.06,.78);
  bottle(-1.35,.02,-.81,1.06,pink,['Glicerina','ATELIÊ','#7c4352']);
  contact(1.65,-.58,1.07,.85);
  bottle(1.65,.02,-.58,1.1,lilac,['Líquido','DE BOLHAS','#614b68']);

  const beaker = new T.Group();
  beaker.position.set(.87,.02,-.68);
  room.add(beaker);
  contact(.87,-.68,1.01,.90);
  const glass = new T.MeshPhysicalMaterial({ color:'#e7f1fc', roughness:.13, transparent:true, opacity:.31,
    metalness:.22, clearcoat:1, clearcoatRoughness:.06, side:T.DoubleSide, depthWrite:false, iridescence:.34 });
  turn([[0,.014],[.224,.014],[.237,.035],[.239,.62],[.234,.65],[.219,.654],[.216,.624],[.216,.050],[0,.050]],glass,beaker,0,0,0);
  const lip = torus(.230,.009,glass,beaker,0,.648,0);
  lip.rotation.x = Math.PI / 2;
  turn([[0,.052],[.216,.052],[.216,.33],[.209,.345],[0,.337]],glass,beaker,0,0,0);
  for (let index=0;index<6;index++) {
    box(index%2 ? .054 : .087,.008,.006,white,beaker,.045,.125+index*.07,.234);
  }

  const ring = new T.Group();
  const ringHead = new T.Group();
  torus(.32,.027,brass,ringHead,0,0,0);
  torus(.324,.008,chrome,ringHead,0,0,.018);
  const pinch = torus(.305,.006,copper,ringHead,0,0,.009);
  pinch.scale.y = .99;
  ring.add(ringHead);
  const stem = cast(add(new T.CylinderGeometry(.018,.021,.75,12),brass,ring,.113,-.59,0));
  stem.rotation.z = .24;
  const grip = cast(add(new T.CapsuleGeometry(.052,.30,8,14), pink,ring,.205,-.948,0));
  grip.rotation.z = .24;
  const ringFilm = new T.Mesh(new T.CircleGeometry(.305,56), soapMaterial());
  ringFilm.position.z = .018;
  ringFilm.material.side = T.DoubleSide;
  ringFilm.material.uniforms.flatFilm.value = 1;
  ringFilm.visible = false;
  ringHead.add(ringFilm);
  scene.add(ring);

  const lamp = new T.Group();
  lamp.position.set(2.11, .015, -.62);
  room.add(lamp);
  contact(2.11,-.62,1.10,1.0);
  turn([[0,.011],[.32,.011],[.33,.041],[.29,.079],[0,.086]],brass,lamp,0,0,0);
  const neck = new T.CatmullRomCurve3([new T.Vector3(0,.068,0), new T.Vector3(.045,.92,-.04),new T.Vector3(-.09,1.48,-.04),new T.Vector3(-.39,1.52,.015)]);
  cast(add(new T.TubeGeometry(neck,28,.021,12,false),brass,lamp,0,0,0));
  const shadeGroup = new T.Group();
  shadeGroup.position.set(-.37,1.44,.014);
  shadeGroup.rotation.z = -.25;
  lamp.add(shadeGroup);
  turn([[.06,.15],[.10,.15],[.12,.11],[.19,.065],[.25,-.05],[.27,-.117],[.259,-.123],[.23,-.065],[.185,.043],[.08,.114]],mint,shadeGroup,0,0,0);
  const diffuser = new T.MeshBasicMaterial({ color:'#ffecd0' });
  add(new T.CylinderGeometry(.247,.247,.012,44),diffuser,shadeGroup,0,-.112,0);
  const taskLight = new T.PointLight('#ffd7aa', 7, 3.1, 2);
  taskLight.position.set(-.41,1.24,.02);
  lamp.add(taskLight);

  const ruler = slab(.86,.115,.017,.024,brass,room,-.04,.02,1.19);
  ruler.rotation.y = -.20;
  for (let i=0;i<16;i++) box(.004,.002,i%5 ? .023 : .040,black,room,-.428+i*.049,.057,1.169+(-.39+i*.049)*.197);

  const spare = new T.Group();
  spare.position.set(-1.72,.044,.43);
  spare.rotation.set(-Math.PI/2,0,.18);
  room.add(spare);
  torus(.19,.018,chrome,spare,0,0,0);
  add(new T.CylinderGeometry(.015,.019,.48,10),copper,spare,0,-.41,0);

  return { scene, ring, ringHead, ringFilm, bathRipples, daylight, reflections, textures };
}
