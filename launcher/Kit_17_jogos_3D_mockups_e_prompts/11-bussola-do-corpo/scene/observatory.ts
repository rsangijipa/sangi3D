import * as T from 'three';
import { boxUV, canvasTexture, cylinderBetween, ellipsoid, lathe, mergeStatic, mesh, rbox, taperedTube } from './core/model';
import { rng } from './core/noise';
import { materials, rugMaterial, softLight, type Materials } from './materials';
import { createDust } from './core/effects';

const v = (x: number, y: number, z: number) => new T.Vector3(x, y, z);
const group = (name: string, x = 0, y = 0, z = 0) => {
  const item = new T.Group();
  item.name = name;
  item.position.set(x, y, z);
  return item;
};
const sizes = { radius: 2.85, eave: 2.44, crown: 3.72 };
function radialBars(radius: number, y: number, material: T.Material, thickness: number) {
  const geo = new T.TorusGeometry(radius, thickness, 8, 96);
  geo.rotateX(Math.PI / 2);
  return mesh(geo, material, 0, y, 0);
}
function plank(w: number, h: number, d: number, mat: T.Material, x: number, y: number, z: number) {
  return mesh(rbox(w, h, d, .012, 2), mat, x, y, z);
}
function batch(item: T.Group) {
  const originals = new Set<T.BufferGeometry>();
  item.traverse(node => { if (node instanceof T.Mesh) originals.add(node.geometry); });
  const merged = mergeStatic(item, true, true);
  originals.forEach(geometry => geometry.dispose());
  item.clear();
  item.add(merged);
}

function makeSky(seed: number) {
  const sky = group('sky');
  const map = canvasTexture(256, 512, ctx => {
    const gradient = ctx.createLinearGradient(0, 0, 0, 512);
    gradient.addColorStop(0, '#0e1527');
    gradient.addColorStop(.32, '#14192a');
    gradient.addColorStop(.50, '#303650');
    gradient.addColorStop(.59, '#383546');
    gradient.addColorStop(.69, '#171c30');
    gradient.addColorStop(1, '#131729');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 256, 512);
  });
  sky.add(mesh(new T.SphereGeometry(28, 32, 24), new T.MeshBasicMaterial({ map, side: T.BackSide, toneMapped: false })));
  const random = rng(seed);
  const stars: number[] = [], colors: number[] = [];
  const bright: number[] = [], brightColors: number[] = [];
  for (let i = 0; i < 3850; i++) {
    const angle = random() * Math.PI * 2, y = -.08 + random() * 1.06;
    const d = Math.sqrt(1 - y * y), large = i % 13 === 0;
    (large ? bright : stars).push(Math.cos(angle) * d * 24, y * 24 + 2, Math.sin(angle) * d * 24);
    const r = (.23 + random() * .40) * (large ? 2.05 : 1);
    (large ? brightColors : colors).push(r * 1.5, r * 1.19, r * (.75 + random() * .45));
  }
  const star = canvasTexture(64, 64, ctx => {
    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 31);
    grad.addColorStop(0, '#fff'); grad.addColorStop(.19, '#fff9df'); grad.addColorStop(.44, '#ffdfad44'); grad.addColorStop(1, '#fff0');
    ctx.fillStyle = grad; ctx.fillRect(0, 0, 64, 64);
    ctx.strokeStyle = '#fff4db8a'; ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.moveTo(32, 8); ctx.lineTo(32, 56); ctx.moveTo(8, 32); ctx.lineTo(56, 32); ctx.stroke();
  });
  for (const [pos, col, size] of [[stars, colors, .095], [bright, brightColors, .263]] as const) {
    const geo = new T.BufferGeometry();
    geo.setAttribute('position', new T.Float32BufferAttribute(pos, 3));
    geo.setAttribute('color', new T.Float32BufferAttribute(col, 3));
    const field = new T.Points(geo, new T.PointsMaterial({ size, map: star, vertexColors: true,
      transparent: true, depthWrite: false, blending: T.AdditiveBlending, toneMapped: false }));
    field.userData.noAO = true;
    sky.add(field);
  }
  return sky;
}

function room(m: Materials) {
  const shell = group('observatory');
  const floor = mesh(boxUV(10, .16, 9, 3), m.floor, 0, -.092, .2);
  shell.add(floor);
  // A circular sill and a dome carried by tapered radial timbers.
  const wallGeo = new T.CylinderGeometry(sizes.radius, sizes.radius, .33, 72, 1, true, Math.PI / 2, Math.PI);
  const wallMaterial = m.stone.clone(); wallMaterial.side = T.DoubleSide;
  shell.add(mesh(wallGeo, wallMaterial, 0, .148, 0));
  for (const y of [.31, .36, sizes.eave, 2.48, 3.10]) {
    const radius = y > 2.8 ? 2.17 : sizes.radius;
    shell.add(radialBars(radius, y, y < 1 ? m.trim : m.oak, y === sizes.eave ? .076 : .031));
  }
  const random = rng(18);
  const shaft = [
    [2.86, .33], [2.85, 1.26], [2.80, 2.23], [2.59, 2.68], [2.18, 3.10], [1.42, 3.49], [.06, sizes.crown],
  ];
  for (let i = 0; i < 9; i++) {
    const a = Math.PI * (i / 8 + 1) + .11;
    const pts = shaft.map(([r, y]) => v(Math.cos(a) * r, y, Math.sin(a) * r));
    const beam = taperedTube(pts, t => .069 + (1 - t) * .034, { radial: 8, segments: 42, uvScale: .85, noise: .025, seed: i });
    shell.add(mesh(beam, m.oak));
    const footing = plank(.22, .18, .21, m.stone, pts[0].x, .355, pts[0].z);
    footing.rotation.y = -a;
    shell.add(footing);
  }
  for (let i = 0; i < 16; i++) {
    const x = (i % 8 - 3.5) * .78, z = Math.floor(i / 8) * 1.6 - 2.2;
    const geo = rbox(.775, .018, 1.59, .006, 1);
    const flagstone = mesh(geo, m.floor, x, -.009 + random() * .002, z);
    shell.add(flagstone);
  }
  batch(shell);
  return shell;
}

function shelf(m: Materials) {
  const item = group('shelf', -1.72, 0, -.88);
  item.rotation.y = .18;
  item.add(plank(.74, 2.46, .08, m.oak, 0, 1.24, -.19));
  for (const x of [-.385, .385]) item.add(plank(.073, 2.52, .42, m.oak, x, 1.25, 0));
  const bookColors = ['#59624a', '#784d42', '#8f7255', '#454d50', '#977d51', '#525743'];
  const covers = bookColors.map(color => new T.MeshStandardMaterial({ color, roughness: .95, bumpMap: m.felt.normalMap }));
  const rand = rng(213);
  for (const [row, y] of [.17, .65, 1.12, 1.61, 2.13, 2.49].entries()) {
    item.add(plank(.82, .061, .44, m.trim, 0, y, .007));
    if (row === 5) continue;
    for (let i = 0; i < (row === 2 ? 4 : 9); i++) {
      const x = -.30 + i * .073, h = .22 + rand() * .19, width = .055 + rand() * .016;
      const object = group('book', x, y + h / 2 + .035, .035 - rand() * .04);
      const cover = covers[(i + row * 2) % covers.length];
      object.rotation.z = (rand() - .5) * .085;
      object.add(plank(width, h, .22, cover, 0, 0, 0));
      object.add(plank(width * .76, h * .93, .195, m.cream, 0, 0, -.018));
      for (const height of [.33, .40, -.29]) object.add(plank(width * .78, .007, .008, m.thread, 0, h * height, .112));
      item.add(object);
    }
  }
  batch(item);
  return item;
}

function plant(m: Materials) {
  const ivy = group('plant', -1.73, 2.52, -.79);
  ivy.add(mesh(lathe([[.01,0],[.11,0],[.129,.02],[.17,.19],[.174,.205],[.158,.215],[.143,.201],[.141,.174],[0,.174]], 36), m.pot));
  const r = rng(15);
  const leaves = ['#515b26', '#767433', '#333e21', '#7b8140'].map(color => new T.MeshStandardMaterial({ color, roughness: .85, side: T.DoubleSide }));
  const stemMat = new T.MeshStandardMaterial({ color: '#55532a', roughness: 1 });
  const outline = new T.Shape();
  outline.moveTo(0, 0);
  outline.bezierCurveTo(-.053,.082,-.138,.074,-.114,-.018);
  outline.bezierCurveTo(-.076,-.108,-.011,-.122,0,-.182);
  outline.bezierCurveTo(.011,-.122,.081,-.108,.112,-.018);
  outline.bezierCurveTo(.144,.073,.054,.078,0,0);
  const leafGeo = new T.ShapeGeometry(outline, 12);
  const attr = leafGeo.getAttribute('position');
  for (let i = 0; i < attr.count; i++) attr.setZ(i, -.7 * Math.abs(attr.getX(i)) + .016 * Math.sin(attr.getY(i) * 18));
  leafGeo.computeVertexNormals();
  const vineCount = 9;
  for (let i = 0; i < vineCount; i++) {
    const spread = (i / (vineCount - 1) - .5) * .98;
    const end = .29 + (i % 4) * .23;
    const points = [v(0,.17,0), v(spread*.55,.22,.12), v(spread,.04,.24), v(spread*1.15,-end*.5,.27), v(spread*.96,-end,.27)];
    const curve = new T.CatmullRomCurve3(points);
    ivy.add(mesh(taperedTube(points, t => .012 - t * .008, { radial: 6, segments: 15 }), stemMat));
    for (let j = 0; j < 6; j++) {
      const pt = curve.getPoint(.22 + j * .146);
      const leaf = mesh(leafGeo, leaves[(j + i) % leaves.length], pt.x, pt.y, pt.z);
      leaf.rotation.set((r() - .5) * 1.8, (r() - .5) * 1.5, (j % 2 ? 1 : -1) * (.24 + r() * .9));
      leaf.scale.setScalar(.65 + r() * .58);
      ivy.add(leaf);
    }
  }
  batch(ivy);
  return ivy;
}

function telescope(m: Materials) {
  const item = group('telescope', -1.36, 0, .54);
  const top = v(0, .61, 0);
  item.add(mesh(lathe([[0,0],[.07,0],[.081,.015],[.068,.037],[.046,.041]], 24), m.brass, 0, .59, 0));
  for (let i = 0; i < 3; i++) {
    const a = i * Math.PI * 2 / 3 + .33;
    const foot = v(Math.cos(a) * .23, .022, Math.sin(a) * .23);
    item.add(cylinderBetween(top, foot, .023, m.oak, 10));
    item.add(cylinderBetween(top.clone().lerp(foot, .88), foot, .026, m.brownMetal, 10));
    item.add(cylinderBetween(top.clone().lerp(foot,.52), v(0,.27,0), .009, m.brass, 8));
  }
  const tube = group('barrel', 0, .68, 0);
  tube.quaternion.setFromUnitVectors(v(0,1,0), v(.83,.54,-.16).normalize());
  const profile: [number,number][] = [[.022,-.34],[.038,-.34],[.039,-.30],[.036,-.292],[.055,-.24],[.055,-.20],[.068,-.19],[.071,.08],[.080,.095],[.082,.25],[.097,.255],[.098,.30],[.094,.331],[.075,.331],[.073,.309]];
  tube.add(mesh(lathe(profile, 48), m.brass));
  for (const [y,r] of [[-.28,.040],[-.19,.069],[.092,.086],[.303,.099]]) {
    tube.add(radialBars(r, y, m.brownMetal, .006));
  }
  const lens = new T.MeshPhysicalMaterial({ color: '#2c3844', metalness: .56, roughness: .22, clearcoat: .65, iridescence: .5 });
  tube.add(mesh(new T.CylinderGeometry(.075,.075,.013,32), lens,0,.312,0));
  tube.add(mesh(new T.CylinderGeometry(.022,.022,.012,24), lens,0,-.335,0));
  item.add(tube);
  batch(item);
  return item;
}

function lampGlow(color: string, size: number, x: number, y: number, z: number) {
  const sprite = new T.Sprite(new T.SpriteMaterial({
    map: softLight(color), transparent: true, depthWrite: false, blending: T.AdditiveBlending,
  }));
  sprite.position.set(x,y,z); sprite.scale.setScalar(size);
  sprite.userData.noAO = true;
  return sprite;
}
function moon(m: Materials) {
  const item = group('moon_lamp', -1.54, 1.17, -.79);
  const lunar = canvasTexture(512, 256, ctx => {
    const random = rng(462);
    ctx.fillStyle = '#ffda9a'; ctx.fillRect(0,0,512,256);
    for (let i = 0; i < 4000; i++) {
      const x = random() * 512, y = random() * 256;
      const r = i < 50 ? 8 + random()*40 : .4 + random()*4;
      const grad = ctx.createRadialGradient(x,y,0,x,y,r);
      grad.addColorStop(0, i < 50 ? '#94604477' : '#8b642b73'); grad.addColorStop(1,'#ffb05200');
      ctx.fillStyle = grad; ctx.fillRect(x-r,y-r,2*r,2*r);
    }
  });
  item.add(mesh(lathe([[0,0],[.137,0],[.144,.018],[.118,.033],[.076,.040]], 36), m.brass));
  item.add(mesh(new T.SphereGeometry(.134, 40, 24), new T.MeshStandardMaterial({
    color: '#483021', map: lunar, emissiveMap: lunar, emissive: '#ffe0b3', emissiveIntensity: 1.08, roughness: .92,
  }), 0,.164,0));
  item.add(lampGlow('#f6aa691f', .46, 0,.172,.03));
  return item;
}

function makeLantern(m: Materials) {
  const item = group('star_lamp', 1.44, .57, -.62);
  const glass = new T.MeshPhysicalMaterial({ color: '#c7966c', transparent: true, opacity: .23, side: T.FrontSide,
    roughness: .28, metalness: .35, clearcoat: .65, depthWrite: false });
  const table = group('wood_stool', 0,-.57,0);
  table.add(mesh(lathe([[0,.52],[.31,.52],[.324,.55],[.315,.588],[0,.588]], 40), m.trim));
  for (let i=0;i<3;i++) {
    const a = i * Math.PI * 2/3;
    table.add(cylinderBetween(v(Math.cos(a)*.20,.54,Math.sin(a)*.20),v(Math.cos(a)*.24,.022,Math.sin(a)*.24),.047,m.oak,10));
  }
  batch(table);
  item.add(table);
  item.add(mesh(lathe([[0,0],[.15,0],[.162,.018],[.159,.065],[.136,.079],[.129,.106]], 44), m.brass));
  item.add(mesh(lathe([[.144,.08],[.148,.261],[.143,.31],[.127,.35],[.094,.382],[.045,.402],[0,.406]], 42), glass));
  item.add(mesh(taperedTube([v(-.13,.09,-.015),v(-.162,.36,-.02),v(-.08,.49,-.02),v(.08,.49,-.02),v(.158,.36,-.02),v(.13,.09,-.015)], () => .009, { segments: 34, radial: 7 }), m.brownMetal));
  const stars = new T.Shape();
  for (let i = 0; i < 10; i++) {
    const a = Math.PI / 2 + i * Math.PI / 5, r = i % 2 ? .014 : .031;
    if (i === 0) stars.moveTo(Math.cos(a) * r, Math.sin(a) * r);
    else stars.lineTo(Math.cos(a) * r, Math.sin(a) * r);
  }
  stars.closePath();
  const gold = new T.MeshBasicMaterial({ color: new T.Color(2.6,1.5,.48), side: T.DoubleSide });
  const random = rng(7);
  for (let i=0;i<12;i++) {
    const a = random()*Math.PI*2, r = .077 * Math.sqrt(random());
    const star = mesh(new T.ExtrudeGeometry(stars,{ depth:.003, bevelEnabled:false }),gold, Math.cos(a)*r,.135+random()*.20,Math.sin(a)*r);
    star.rotation.set(.1, a, (random()-.5)*.8); star.scale.setScalar(.32+random()*.65);
    item.add(star);
  }
  item.add(lampGlow('#ffb06a38',.46,0,.219,.03));
  return item;
}

function rug() {
  const item = group('rug', 0,.003,.07);
  const mat = rugMaterial();
  const surface = mesh(new T.CircleGeometry(1.08, 85), mat, 0,.013,0);
  surface.rotation.x = -Math.PI/2;
  surface.receiveShadow = true;
  item.add(surface);
  for (const [r, width] of [[1.068,.016],[1.026,.008],[.995,.005]]) item.add(radialBars(r,.006,mat,width));
  return item;
}

function pouf(m: Materials) {
  const item = group('pouf', 1.27, 0, .59);
  const p = [[0,.013],[.185,.013],[.247,.022],[.291,.043],[.31,.10],[.314,.191],[.297,.260],[.25,.301],[.157,.323],[0,.333]] as [number,number][];
  const geo = lathe(p,64);
  const pos = geo.getAttribute('position');
  for (let i=0;i<pos.count;i++) {
    const a = Math.atan2(pos.getX(i),pos.getZ(i)), ripple = 1 + Math.cos(a*8)*.034;
    pos.setX(i,pos.getX(i)*ripple); pos.setZ(i,pos.getZ(i)*ripple);
  }
  geo.computeVertexNormals();
  item.add(mesh(geo,m.felt));
  item.add(radialBars(.289,.267,m.thread,.006));
  for (let i=0;i<8;i++) {
    const a = (i+.5)*Math.PI/4;
    for (let j=0;j<8;j++) {
      const t=j/8, r=.308 + Math.sin(t*Math.PI)*.012 - t*.026;
      item.add(cylinderBetween(v(Math.cos(a)*r,.042+t*.224,Math.sin(a)*r),v(Math.cos(a+.021)*r,.057+t*.224,Math.sin(a+.021)*r),.0038,m.thread,5));
    }
  }
  batch(item);
  return item;
}

export function buildObservatory(scene: T.Scene, seed: number) {
  const m = materials();
  const heroAssets = [room(m), shelf(m), plant(m), telescope(m), moon(m), makeLantern(m), rug(), pouf(m)];
  scene.background = new T.Color('#161b2e');
  scene.add(makeSky(seed), ...heroAssets);
  const contactMap = softLight('#210f12cf');
  const shared = new T.MeshBasicMaterial({ map: contactMap, transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2 });
  for (const [x,z,w,h,y] of [[0,.036,.67,.39,.019],[-1.36,.53,.69,.69,.003],[1.27,.59,.86,.79,.003],[1.44,-.62,.82,.72,.003]]) {
    const shadow = mesh(new T.PlaneGeometry(w,h),shared,x,y,z);
    shadow.rotation.x=-Math.PI/2;
    shadow.userData.noAO=true;
    scene.add(shadow);
  }
  const dust = createDust({ seed, count: 95, min: v(-2,.38,-.70), max: v(.4,2.44,.30), color: '#f4c990', base: .07, size: 4,
    beams: [{ origin: v(-1.54,1.29,-.79), dir: v(.82,.25,.18).normalize(), length: 2.03, radius: .69 }] });
  scene.add(dust.object);
  return { dust, heroAssets };
}

