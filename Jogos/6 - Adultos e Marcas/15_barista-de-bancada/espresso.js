import * as THREE from 'three';
import { box, brushed, contact, mesh, mineralWall, plate, profile, random, tableLabel, texture, tube, wood } from '/Sistema/shared/engine/craft-workbench.js';

export function buildEspresso(scene) {
  const steel = brushed('#dfd6c9', .27);
  const dialSteel = brushed('#eee7dc', .18);
  const castMetal = brushed('#6e6b5e', .49, .74);
  const brass = brushed('#c6915e', .34, .87);
  const enamel = new THREE.MeshPhysicalMaterial({ color: '#59644d', roughness: .46, metalness: .14, clearcoat: .95, clearcoatRoughness: .19 });
  const rubber = new THREE.MeshStandardMaterial({ color: '#23201b', roughness: .90 });
  const walnut = wood(0x80583b, .47);
  const oak = wood(0xb58960, .64);
  const tile = new THREE.MeshPhysicalMaterial({ color: '#b5bcaa', roughness: .39, clearcoat: .52 });
  const tileDark = new THREE.MeshPhysicalMaterial({ color: '#8b9c86', roughness: .49, clearcoat: .44 });
  const ceramic = new THREE.MeshPhysicalMaterial({ color: '#eee4cb', roughness: .29, clearcoat: .75, ior: 1.47 });
  const charcoal = new THREE.MeshPhysicalMaterial({ color: '#353931', roughness: .37, clearcoat: .6 });
  const coffee = new THREE.MeshPhysicalMaterial({ color: '#87501e', roughness: .45, clearcoat: .35 });
  const rng = random(89);
  const table = box(scene, oak, 0, -.11, .14, 4.6, .207, 3.14, .034);
  table.castShadow = false;
  box(scene, walnut, 0, -.18, 1.70, 4.61, .15, .031, .012);

  // Glazed tiles and a service shelf sit behind the working plane.
  const wall = mineralWall('#716c58');
  box(scene, wall, 0, 1.79, -1.36, 7.0, 3.68, .10, .015, false);
  box(scene, wall, -2.88, 1.76, .18, .14, 3.68, 3.12, .018, false);
  const tiled = new THREE.InstancedMesh(new THREE.BoxGeometry(.425, .177, .045), tile, 90);
  const shades = new THREE.Color();
  for (let i = 0; i < 90; i++) {
    const row = Math.floor(i / 15);
    const column = i % 15;
    tiled.setMatrixAt(i, new THREE.Matrix4().makeTranslation((column - 7) * .434 + (row % 2) * .217, .080 + row * .187, -1.28));
    shades.setScalar(.84 + rng() * .14);
    tiled.setColorAt(i, shades);
  }
  tiled.receiveShadow = true;
  scene.add(tiled);
  box(scene, walnut, 0, 1.22, -1.106, 4.38, .07, .455, .014);
  box(scene, oak, 0, 1.258, -1.102, 4.38, .021, .435, .008);
  const menu = plate(scene, .34, 1.87, -1.292, 1.24, .66, tableLabel('TORRA NORTE', 'ESPRESSO · CAFÉ DE ORIGEM', '#283026', '#e7d8b4'));
  menu.position.z = -1.296;
  box(scene, walnut, .34, 1.87, -1.32, 1.29, .70, .050, .02, false);

  const cupProfile = profile([[0, 0], [.107, 0], [.115, .018], [.123, .03], [.147, .067], [.162, .14], [.171, .198],
    [.172, .224], [.163, .228], [.154, .216], [.151, .179], [.141, .118], [.120, .073], [.09, .056], [0, .056]], 44);
  const shelfCup = cupProfile.clone();
  shelfCup.scale(.53, .53, .53);
  for (const [i, x] of [-1.55, -1.34, -1.13, 1.15, 1.36, 1.56].entries()) {
    mesh(scene, shelfCup, i % 3 === 0 ? tileDark : ceramic, x, 1.27, -1.03, false);
    tube(scene, i % 3 === 0 ? tileDark : ceramic, [[x + .081,1.372,-1.03],[x + .126,1.363,-1.03],[x + .125,1.326,-1.03],[x + .077,1.31,-1.03]], .010, 12, 6, false);
  }

  const machine = new THREE.Group();
  machine.position.set(.05, 0, .06);
  scene.add(machine);
  contact(machine, 0, 0, 1.87, 1.63, .62);
  box(machine, castMetal, 0, .081, .085, 1.36, .162, 1.16, .063);
  box(machine, rubber, 0, .026, .085, 1.28, .052, 1.027, .028);
  for (const x of [-.605, .605]) {
    const side = box(machine, enamel, x, .66, -.246, .109, .98, .61, .05);
    side.rotation.z = -.007 * Math.sign(x);
  }
  box(machine, enamel, 0, .70, -.378, 1.18, .916, .395, .079);
  box(machine, enamel, 0, 1.074, -.245, 1.34, .22, .83, .066);
  box(machine, steel, 0, 1.068, .177, 1.23, .162, .034, .014);
  box(machine, castMetal, 0, 1.19, -.161, 1.167, .026, .633, .010, false);
  for (let i = 0; i < 17; i++) {
    box(machine, steel, -.49 + i * .061, 1.207, -.17, .017, .014, .446, .006, false);
  }
  for (const x of [-.558, .558]) mesh(machine, new THREE.SphereGeometry(.017, 12, 10), dialSteel, x, 1.076, .201, false).scale.z = .36;
  plate(machine, 0, 1.075, .200, .20, .078, tableLabel('TORRA NORTE', 'ALAVANCA', '#60472c', '#f3dfb4'));
  for (const x of [-.61, .61]) {
    box(machine, brass, x, .735, .07, .071, .46, .052, .017);
    box(machine, enamel, x, .697, .096, .060, .41, .023, .009);
  }
  box(machine, brushed('#9c9c88', .43), 0, .132, .382, 1.27, .068, .595, .027);
  const slatGeo = new THREE.BoxGeometry(.016, .015, .43);
  const slats = new THREE.InstancedMesh(slatGeo, steel, 28);
  for (let i = 0; i < 28; i++) slats.setMatrixAt(i, new THREE.Matrix4().makeTranslation(-.55 + .041 * i, .172, .372));
  slats.receiveShadow = true;
  machine.add(slats);
  box(machine, steel, 0, .160, .600, 1.23, .027, .038, .008);

  const groupZ = .32;
  mesh(machine, profile([[0, .542], [.117, .542], [.146, .563], [.163, .605], [.163, .643], [.144, .669], [.131, .696],
    [.146, .723], [.145, .768], [.119, .805], [.11, .866], [.138, .900], [.15, .945], [0, .952]], 44), dialSteel, 0, 0, groupZ);
  mesh(machine, new THREE.TorusGeometry(.158, .013, 10, 41), brass, 0, .641, groupZ).rotation.x = Math.PI / 2;
  mesh(machine, new THREE.TorusGeometry(.117, .009, 9, 36), castMetal, 0, .877, groupZ).rotation.x = Math.PI / 2;
  const leverPivot = new THREE.Group();
  leverPivot.position.set(.103, .914, .334);
  machine.add(leverPivot);
  mesh(leverPivot, new THREE.SphereGeometry(.065, 22, 16), dialSteel, 0, 0, 0);
  tube(leverPivot, steel, [[0, 0, 0], [.072, .13, .08], [.162, .35, .18], [.179, .51, .22]], .018);
  const handle = mesh(leverPivot, profile([[0, 0], [.037, .006], [.048, .026], [.047, .114], [.033, .156], [0, .162]], 32), walnut, .175, .494, .221);
  handle.rotation.z = -.13;
  handle.rotation.x = .21;
  handle.userData.action = 'lever';
  const switchGroup = new THREE.Group();
  switchGroup.position.set(.481, .916, .194);
  machine.add(switchGroup);
  const knob = mesh(switchGroup, new THREE.CylinderGeometry(.062, .065, .08, 30), rubber, 0, 0, .034);
  knob.rotation.x = Math.PI / 2;
  knob.userData.action = 'steam';
  mesh(switchGroup, new THREE.SphereGeometry(.013, 12, 6), new THREE.MeshBasicMaterial({ color: '#ecaf58' }), 0, .106, .022);
  tube(machine, steel, [[.49, .858, .228], [.62, .695, .29], [.64, .44, .39], [.58, .32, .49]], .018);
  tube(machine, brass, [[.62, .421, .41], [.60, .348, .46], [.58, .32, .49]], .022, 14);

  const gauge = new THREE.Group();
  gauge.position.set(-.367, .900, .213);
  machine.add(gauge);
  mesh(gauge, new THREE.TorusGeometry(.104, .017, 10, 42), dialSteel, 0, 0, .030);
  const dial = texture(256, 256, (ctx) => {
    ctx.fillStyle = '#e8dbba';
    ctx.fillRect(0, 0, 256, 256);
    ctx.strokeStyle = '#4a3a2b';
    ctx.fillStyle = '#322b20';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = '15px Georgia';
    for (let i = 0; i <= 24; i++) {
      const a = Math.PI * (0.75 + i / 16);
      const r = i % 4 ? 92 : 86;
      ctx.beginPath();
      ctx.moveTo(128 + Math.cos(a) * r, 128 + Math.sin(a) * r);
      ctx.lineTo(128 + Math.cos(a) * 104, 128 + Math.sin(a) * 104);
      ctx.stroke();
      if (i % 4 === 0) ctx.fillText(String(i / 2), 128 + Math.cos(a) * 70, 128 + Math.sin(a) * 70);
    }
    ctx.fillText('bar', 128, 171);
  });
  mesh(gauge, new THREE.CircleGeometry(.102, 44), new THREE.MeshBasicMaterial({ map: dial }), 0, 0, .030, false);
  const needle = new THREE.Group();
  needle.position.z = .033;
  gauge.add(needle);
  mesh(needle, new THREE.BoxGeometry(.078, .006, .003), new THREE.MeshBasicMaterial({ color: '#8a2b21' }), .030, 0, 0, false);
  mesh(gauge, new THREE.SphereGeometry(.011, 12, 8), brass, 0, 0, .038, false).scale.z = .38;

  const filter = new THREE.Group();
  scene.add(filter);
  const basket = mesh(filter, profile([[0, 0], [.117, 0], [.144, .017], [.145, .069], [.155, .074], [.157, .089], [.135, .09],
    [.134, .078], [.125, .04], [0, .04]], 36), steel, 0, 0, 0);
  basket.userData.action = 'filter';
  const grounds = mesh(filter, new THREE.CylinderGeometry(.126, .118, .012, 30), new THREE.MeshStandardMaterial({ color: '#44301f', roughness: 1 }), 0, .061, 0, false);
  grounds.visible = false;
  tube(filter, brass, [[0, .038, .094], [0, .040, .215], [0, .039, .314]], .025, 12);
  const grip = mesh(filter, profile([[0, 0], [.031, 0], [.043, .021], [.045, .070], [.043, .180], [.037, .215], [0, .221]], 30), walnut, 0, .037, .267);
  grip.rotation.x = Math.PI / 2;
  grip.userData.action = 'filter';
  for (const x of [-.067, .067]) tube(filter, dialSteel, [[0, .003, 0], [x * .56, -.012, 0], [x, -.033, .010], [x, -.043, .01]], .017);
  const filterRest = new THREE.Vector3(-.75, .045, .83);
  const filterDock = new THREE.Vector3(.05, .547, .38);
  filter.position.copy(filterRest);
  filter.rotation.y = -.66;
  const tamp = new THREE.Group();
  tamp.position.set(-.44, .02, .98);
  scene.add(tamp);
  mesh(tamp, profile([[0, 0], [.09, 0], [.104, .008], [.105, .032], [.074, .039], [.042, .066]], 34), steel, 0, 0, 0);
  const tampGrip = mesh(tamp, profile([[.035, .055], [.039, .083], [.043, .105], [.066, .147], [.064, .184], [.046, .20], [0, .204]], 34), walnut, 0, 0, 0);
  tampGrip.userData.action = 'tamp';

  const cup = new THREE.Group();
  cup.position.set(.05, .183, .397);
  scene.add(cup);
  mesh(cup, profile([[0, 0], [.160, 0], [.223, .017], [.236, .033], [.232, .046], [.208, .053], [.172, .032], [.114, .019], [0, .019]], 44), ceramic, 0, -.005, 0);
  mesh(cup, cupProfile, ceramic, 0, .020, 0);
  tube(cup, ceramic, [[.151, .20, .005], [.214, .208, .012], [.259, .183, .013], [.244, .127, .011], [.165, .090, .005]], .019, 23);
  const crema = texture(320, 320, (ctx, w, h) => {
    const grad = ctx.createRadialGradient(w / 2, h * .44, 7, w / 2, h / 2, w * .54);
    grad.addColorStop(0, '#d59b54');
    grad.addColorStop(.62, '#b67437');
    grad.addColorStop(.92, '#955421');
    grad.addColorStop(1, '#6d3a17');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);
    for (let i = 0; i < 660; i++) {
      ctx.fillStyle = i % 3 ? '#efd29b41' : '#542f174b';
      ctx.fillRect(rng() * w, rng() * h, .55 + rng() * 2.0, .63 + rng() * 1.4);
    }
  });
  const liquidMaterial = new THREE.MeshPhysicalMaterial({ map: crema, roughness: .34, clearcoat: .55 });
  const liquid = mesh(cup, new THREE.CircleGeometry(.152, 44), liquidMaterial, 0, .107, 0, false);
  liquid.rotation.x = -Math.PI / 2;
  liquid.visible = false;
  const art = mesh(cup, new THREE.CircleGeometry(.145, 44), new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false }), 0, .218, 0, false);
  art.rotation.x = -Math.PI / 2;
  art.material.map = texture(256, 256, ctx => {
    ctx.fillStyle = '#e6c28b';
    for (let i = 0; i < 5; i++) {
      const scale = 1 - i * .125;
      ctx.save();
      ctx.translate(128, 138 - i * 10);
      ctx.scale(scale, scale);
      ctx.beginPath();
      ctx.moveTo(0, 52);
      ctx.bezierCurveTo(-30, 25, -91, -19, -58, -50);
      ctx.bezierCurveTo(-33, -71, -11, -45, 0, -37);
      ctx.bezierCurveTo(13, -49, 41, -72, 65, -48);
      ctx.bezierCurveTo(91, -18, 32, 23, 0, 52);
      ctx.fillStyle = i % 2 ? '#af6d37' : '#f0d6ac';
      ctx.fill();
      ctx.restore();
    }
  });
  const streams = [];
  for (const x of [-.067, .067]) {
    const stream = mesh(scene, new THREE.CylinderGeometry(.007, .010, 1, 12), coffee, .05 + x, .44, .39, false);
    stream.scale.y = .255;
    stream.visible = false;
    streams.push(stream);
  }

  const grinder = new THREE.Group();
  grinder.position.set(-1.04, .006, -.29);
  scene.add(grinder);
  box(grinder, castMetal, 0, .043, .028, .533, .082, .54, .038);
  mesh(grinder, profile([[0, .08], [.235, .08], [.242, .11], [.232, .36], [.218, .51], [.193, .58], [.189, .63], [0, .63]], 41), enamel, 0, 0, -.03);
  box(grinder, steel, 0, .206, .204, .286, .057, .122, .019);
  plate(grinder, 0, .43, .200, .166, .089, tableLabel('MOINHO', '18 g'));
  const grindKnob = mesh(grinder, new THREE.CylinderGeometry(.059, .063, .064, 24), rubber, 0, .302, .200);
  grindKnob.rotation.x = Math.PI / 2;
  grindKnob.userData.action = 'grind';
  const amberGlass = new THREE.MeshPhysicalMaterial({ color: '#b4a184', roughness: .27, transparent: true, opacity: .41, clearcoat: 1, ior: 1.49 });
  mesh(grinder, profile([[.115, .58], [.132, .627], [.169, .685], [.183, .774], [.188, .897], [.182, .934],
    [.16, .932], [.162, .773], [.14, .684], [.115, .623]], 36), amberGlass, 0, 0, -.03, false);
  mesh(grinder, profile([[0, .924], [.192, .924], [.2, .938], [.194, .963], [.179, .975], [0, .975]], 36), rubber, 0, 0, -.03);
  const beanMesh = new THREE.InstancedMesh(new THREE.SphereGeometry(1, 8, 6), coffee, 93);
  const dummy = new THREE.Object3D();
  for (let i = 0; i < 93; i++) {
    const a = rng() * Math.PI * 2, radius = Math.sqrt(rng()) * .14;
    dummy.position.set(Math.cos(a) * radius, .676 + rng() * .138, -.03 + Math.sin(a) * radius);
    dummy.rotation.set(rng() * 6, rng() * 6, rng() * 6);
    dummy.scale.set(.019, .012, .027);
    dummy.updateMatrix();
    beanMesh.setMatrixAt(i, dummy.matrix);
    beanMesh.setColorAt(i, shades.setRGB(.58 + rng() * .37, .52 + rng() * .31, .48 + rng() * .28));
  }
  grinder.add(beanMesh);

  const pitcher = new THREE.Group();
  pitcher.position.set(.68, .021, .58);
  scene.add(pitcher);
  const milkBody = mesh(pitcher, profile([[0, 0], [.103, 0], [.125, .024], [.136, .050], [.123, .176], [.114, .266], [.118, .274],
    [.106, .276], [.103, .259], [.111, .159], [.119, .056], [.108, .028], [0, .028]], 38), steel, 0, 0, 0);
  milkBody.userData.action = 'steam';
  tube(pitcher, steel, [[.111,.241,0],[.188,.238,0],[.214,.190,0],[.192,.095,0],[.121,.092,0]], .013, 28);
  const milkMaterial = new THREE.MeshPhysicalMaterial({ color: '#f3e2bc', roughness: .47 });
  const milk = mesh(pitcher, new THREE.CircleGeometry(.104, 32), milkMaterial, 0, .127, 0, false);
  milk.rotation.x = -Math.PI / 2;
  const spout = new THREE.Object3D();
  spout.position.set(-.12, .27, .025);
  pitcher.add(spout);
  const pour = mesh(scene, new THREE.CylinderGeometry(.0045, .009, 1, 10), milkMaterial, 0, 0, 0, false);
  pour.visible = false;

  const clothMap = texture(240, 180, (ctx, w, h) => {
    ctx.fillStyle = '#a58766'; ctx.fillRect(0, 0, w, h);
    for (let i = 0; i < w; i += 3) {
      ctx.fillStyle = i % 2 ? '#e7c8a76b' : '#624e368e';
      ctx.fillRect(i, 0, 1, h); ctx.fillRect(0, i, w, 1);
    }
    ctx.fillStyle = '#614b3b'; ctx.fillRect(10, 0, 6, h); ctx.fillRect(24, 0, 2, h);
  });
  const towel = box(scene, new THREE.MeshStandardMaterial({ map: clothMap, roughness: .94 }), 1.02, .017, .86, .47, .03, .34, .012);
  towel.rotation.y = -.25;
  mesh(scene, profile([[0, 0], [.118, 0], [.134, .020], [.138, .043], [.132, .054], [.122, .053], [.123, .035], [0, .024]], 38), charcoal, -1.22, .004, .56);
  for (let i = 0; i < 11; i++) {
    const a = i * 1.8;
    const bean = mesh(scene, new THREE.SphereGeometry(1, 12, 8), coffee, -1.22 + Math.sin(a) * .088, .034 + (i % 3) * .005, .56 + Math.cos(a) * .088, false);
    bean.scale.set(.022, .012, .032);
    bean.rotation.y = a;
  }
  contact(scene, -1.04, -.26, .83, .76, .49);
  contact(scene, -.75, .82, .48, .59, .30);
  return { leverPivot, needle, filter, filterRest, filterDock, grounds, tamp, pitcher, spout, pour, cup, liquid, art, streams,
    picks: [handle, knob, grindKnob, basket, grip, tampGrip, milkBody] };
}
