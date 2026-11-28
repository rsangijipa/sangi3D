import * as THREE from 'three';
import { box, brushed, contact, mesh, mineralWall, plate, profile, random, stone, tableLabel, texture, tube, wood } from '/Sistema/shared/engine/craft-workbench.js';

function shelfGeometry(inner, outer, span, depth) {
  const shape = new THREE.Shape();
  shape.absarc(0, 0, outer, Math.PI / 2 - span, Math.PI / 2 + span, false);
  const end = Math.PI / 2 + span;
  shape.lineTo(inner * Math.cos(end), inner * Math.sin(end));
  shape.absarc(0, 0, inner, end, Math.PI / 2 - span, true);
  shape.closePath();
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth, bevelEnabled: true, bevelSegments: 2, bevelThickness: .01, bevelSize: .012, curveSegments: 26,
  });
  geometry.rotateX(-Math.PI / 2);
  return geometry;
}

export function buildPerfumery(scene, essences) {
  const rng = random(80);
  const walnut = wood(0x79523d, .55);
  const cabinet = wood(0x4f3125, .50);
  const edge = wood(0xae754f, .42);
  const wall = mineralWall('#4f352e');
  const felt = new THREE.MeshStandardMaterial({ color: '#4b2621', roughness: .95 });
  const brass = brushed('#cc9b5a', .40);
  const black = new THREE.MeshStandardMaterial({ color: '#201511', roughness: .69 });
  const marble = stone();
  box(scene, walnut, 0, -.165, -.28, 4.9, .28, 3.45, .035);
  box(scene, marble, 0, -.043, -.28, 4.84, .083, 3.35, .021);
  box(scene, edge, 0, -.109, 1.45, 4.75, .025, .039);
  box(scene, wall, 0, 1.54, -2.15, 7, 4.03, .12, .03, false);
  for (const x of [-2.35, -1.45, -.51, .51, 1.45, 2.35]) {
    box(scene, walnut, x, 1.38, -2.06, .041, 2.80, .04, .009, false);
  }
  for (const y of [.34, 1.94, 2.53]) box(scene, edge, 0, y, -2.05, 5.1, .044, .041, .008, false);
  box(scene, wall, -2.54, 1.41, -.43, .13, 3.58, 3.28, .015, false);
  const daylight = texture(256, 320, (ctx, w, h) => {
    const sky = ctx.createLinearGradient(0, 0, 0, h);
    sky.addColorStop(0, '#b3cfd0');
    sky.addColorStop(.68, '#efdfad');
    sky.addColorStop(1, '#9ba477');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, w, h);
    ctx.filter = 'blur(4px)';
    for (let i = 0; i < 150; i++) {
      ctx.fillStyle = i % 3 ? '#5162384e' : '#80784475';
      ctx.beginPath();
      ctx.ellipse(rng() * w, 134 + rng() * h, 3 + rng() * 19, 4 + rng() * 16, i * .5, 0, Math.PI * 2);
      ctx.fill();
    }
  });
  const window = new THREE.MeshBasicMaterial({ map: daylight, color: '#fff1cc', toneMapped: false });
  const glassWindow = box(scene, window, -1.51, 1.43, -2.035, .74, 1.00, .02, .006, false);
  glassWindow.receiveShadow = false;
  for (const x of [-1.89, -1.51, -1.13]) box(scene, cabinet, x, 1.43, -1.99, .038, 1.05, .061, .007, false);
  for (const y of [.90, 1.39, 1.95]) box(scene, cabinet, -1.51, y, -1.99, .77, .042, .061, .008, false);

  const arcs = new THREE.Group();
  arcs.position.z = .19;
  scene.add(arcs);
  box(arcs, cabinet, 0, .79, -1.84, 2.10, 1.44, .10, .034);
  box(arcs, felt, 0, .84, -1.768, 1.85, 1.32, .05, .02, false);
  for (const x of [-1.09, 1.09]) {
    box(arcs, edge, x, .82, -1.77, .13, 1.62, .14, .027);
    box(arcs, cabinet, x, .35, -1.17, .105, .69, .13, .019);
    box(arcs, brass, x, 1.57, -1.67, .14, .027, .15, .008);
  }
  const arc = new THREE.Shape();
  arc.moveTo(-1.15, 0);
  arc.lineTo(1.15, 0);
  arc.bezierCurveTo(1.13, .35, .63, .55, 0, .57);
  arc.bezierCurveTo(-.63, .55, -1.13, .35, -1.15, 0);
  const crown = new THREE.ExtrudeGeometry(arc, { depth: .043, bevelEnabled: true, bevelSize: .019, bevelThickness: .018, bevelSegments: 3 });
  mesh(arcs, crown, walnut, 0, 1.48, -1.78);
  plate(arcs, 0, 1.73, -1.702, .52, .20, tableLabel('MAISON ÂMBAR', 'ATELIÊ DE PERFUMARIA', '#34221a', '#e1b577'));
  const families = ['NOTAS DE SAÍDA', 'NOTAS DE CORAÇÃO', 'NOTAS DE FUNDO'];
  const bottleBodies = [
    profile([[0, 0], [.06, 0], [.072, .015], [.072, .12], [.065, .16], [.044, .181], [.035, .19], [.035, .22], [0, .22]], 24),
    profile([[0, 0], [.056, 0], [.070, .03], [.062, .13], [.057, .16], [.029, .193], [.028, .222], [0, .222]], 12),
    profile([[0, 0], [.062, 0], [.067, .015], [.069, .132], [.060, .163], [.034, .187], [.033, .225], [0, .225]], 8),
  ];
  const cap = profile([[0, 0], [.034, 0], [.037, .009], [.037, .039], [.031, .049], [0, .049]], 20);
  const caps = new THREE.InstancedMesh(cap, brass, 24);
  const labels = ['Bergamota', 'Limão', 'Néroli', 'Rosa', 'Jasmim', 'Laranjeira', 'Âmbar', 'Sândalo', 'Baunilha', 'Cedro'];
  const labelMaterials = new Map(essences.map((essence, i) => [
    essence, new THREE.MeshStandardMaterial({ map: tableLabel(labels[i], String(i + 11)), roughness: .80 }),
  ]));
  const clickable = [];
  let selectedBottle;
  const ring = mesh(arcs, new THREE.TorusGeometry(.096, .004, 8, 30), new THREE.MeshBasicMaterial({ color: '#fdd495' }), 0, .14, 0, false);
  ring.rotation.x = -Math.PI / 2;
  ring.visible = false;
  const matrix = new THREE.Matrix4();
  const glassColors = ['#8a4725', '#ab6938', '#76512f', '#465634', '#a76448', '#473723'];
  const glasses = glassColors.map(color => new THREE.MeshPhysicalMaterial({
    color, roughness: .19, metalness: .06, clearcoat: .92, clearcoatRoughness: .11, envMapIntensity: 1.6,
  }));
  for (let row = 0; row < 3; row++) {
    const h = .24 + row * .36;
    const r = 1.03 + row * .25;
    mesh(arcs, shelfGeometry(r - .21, r + .17, 1.14, .053), walnut, 0, h - .059, 0);
    mesh(arcs, shelfGeometry(r + .153, r + .174, 1.14, .018), brass, 0, h - .047, 0, false);
    plate(arcs, 0, h - .023, -r + .21, .22, .044, tableLabel(families[row], ''), 0xdcb37b);
    for (let i = 0; i < 8; i++) {
      const a = (i - 3.5) / 3.5 * 1.04;
      const x = Math.sin(a) * r;
      const z = -Math.cos(a) * r;
      const dy = .012 + (i % 3) * .006;
      const bottle = mesh(arcs, bottleBodies[(i + row) % 3], glasses[(i * 3 + row * 2 + Math.floor(rng() * 3)) % glasses.length], x, h, z);
      const notes = essences.filter(essence => essence.tier === row);
      bottle.userData.essence = notes[i % notes.length];
      clickable.push(bottle);
      caps.setMatrixAt(row * 8 + i, matrix.makeTranslation(x, h + .211 + dy, z));
      const label = mesh(arcs, new THREE.PlaneGeometry(.105, .067), labelMaterials.get(bottle.userData.essence), x, h + .080, z + .071, false);
      label.rotation.y = -a * .25;
    }
  }
  arcs.add(caps);
  for (const x of [-1.11, 1.11]) {
    const support = mesh(scene, profile([[0, 0], [.19, 0], [.21, .02], [.16, .04], [.12, .26], [.10, .34], [0, .34]], 26), brass, x, 0, -.94);
    support.scale.set(.40, 1, .40);
  }

  // Lapidated, open-neck flacon with a hollow inner cavity.
  const flacon = new THREE.Group();
  flacon.position.set(-.17, .024, .59);
  scene.add(flacon);
  contact(scene, -.17, .59, .91, .64, .56);
  mesh(flacon, profile([[0, 0], [.32, 0], [.34, .018], [.34, .035], [.29, .046], [0, .046]], 44), walnut, 0, 0, 0);
  mesh(flacon, new THREE.TorusGeometry(.31, .010, 9, 44), brass, 0, .038, 0).rotation.x = Math.PI / 2;
  const crystal = new THREE.MeshPhysicalMaterial({
    color: '#ffefd8', metalness: .02, roughness: .09, transmission: .97, thickness: .18, ior: 1.52,
    envMapIntensity: 1.5, clearcoat: 1, attenuationColor: new THREE.Color('#ffe8b5'), attenuationDistance: .62,
  });
  const body = profile([[0, .047], [.152, .047], [.208, .071], [.227, .119], [.225, .307], [.211, .365],
    [.166, .424], [.071, .471], [.062, .491], [.062, .549], [.050, .553], [.043, .543], [.044, .508],
    [.049, .457], [.155, .394], [.183, .344], [.195, .292], [.194, .125], [.183, .102], [0, .102]], 12);
  const focal = mesh(flacon, body, crystal, 0, 0, 0, false);
  focal.material.flatShading = true;
  mesh(flacon, profile([[.056, .490], [.069, .493], [.072, .507], [.071, .52], [.058, .523]], 28), brass, 0, 0, 0, false);
  const liquidMaterial = new THREE.MeshPhysicalMaterial({ color: '#ca812b', roughness: .19, clearcoat: .73, metalness: .02 });
  const liquid = mesh(flacon, new THREE.CylinderGeometry(.187, .176, 1, 32), liquidMaterial, 0, .107, 0, false);
  liquid.visible = false;
  const nameMap = texture(256, 128, ctx => { ctx.fillStyle = '#dbbc80'; ctx.fillRect(0, 0, 256, 128); });
  const label = plate(flacon, 0, .241, .229, .231, .108, nameMap);
  label.visible = false;
  function nameFlacon(name) {
    const context = nameMap.image.getContext('2d');
    context.fillStyle = '#e2c287';
    context.fillRect(0, 0, 256, 128);
    context.strokeStyle = '#74532c';
    context.lineWidth = 2;
    context.strokeRect(9, 9, 238, 110);
    context.textAlign = 'center';
    context.font = '28px Georgia';
    context.fillStyle = '#382319';
    context.fillText(name, 128, 64, 216);
    context.font = '12px Georgia';
    context.fillText('MAISON ÂMBAR', 128, 92);
    nameMap.needsUpdate = true;
    label.visible = Boolean(name);
  }

  const pipette = new THREE.Group();
  pipette.position.set(-.17, .682, .59);
  scene.add(pipette);
  const pipetteGlass = new THREE.MeshPhysicalMaterial({ color: '#dfecdf', transparent: true, opacity: .55, roughness: .11, clearcoat: 1, clearcoatRoughness: .05 });
  mesh(pipette, profile([[.004, 0], [.007, .018], [.012, .055], [.014, .271], [.024, .291], [.023, .305], [0, .305]], 24), pipetteGlass, 0, 0, 0, false);
  mesh(pipette, profile([[0, .292], [.048, .292], [.049, .336], [.042, .365], [.037, .423], [.025, .445], [0, .452]], 28), black, 0, 0, 0);
  mesh(pipette, new THREE.TorusGeometry(.042, .010, 10, 34), brass, 0, .303, 0).rotation.x = Math.PI / 2;
  tube(scene, brass, [[.20, .034, .51], [.20, .63, .51], [.20, 1.03, .51], [.13, 1.11, .53], [-.16, 1.11, .59]], .012, 23);
  mesh(scene, profile([[0, 0], [.082, 0], [.090, .013], [.080, .036], [0, .036]], 30), brass, .20, .003, .51);
  const dropMaterial = new THREE.MeshPhysicalMaterial({ color: '#d0953d', clearcoat: 1, emissive: '#9b541a', emissiveIntensity: .17, roughness: .21 });
  const drop = mesh(scene, new THREE.SphereGeometry(.018, 16, 12), dropMaterial, -.17, .677, .59, false);
  drop.visible = false;

  const linen = texture(256, 256, (ctx, w, h) => {
    ctx.fillStyle = '#bf9e73';
    ctx.fillRect(0, 0, w, h);
    for (let i = 1; i < w; i += 3) {
      ctx.fillStyle = i % 2 ? '#e4cdab62' : '#70543b36';
      ctx.fillRect(i, 0, 1, h);
      ctx.fillRect(0, i, w, 1);
    }
  });
  const textile = new THREE.MeshStandardMaterial({ map: linen, color: '#cbb193', roughness: .96 });
  const cloth = box(scene, textile, -.90, .014, .61, .54, .025, .46, .01);
  cloth.rotation.y = .17;
  const book = new THREE.Group();
  book.position.set(-.90, .039, .62);
  book.rotation.y = .25;
  scene.add(book);
  box(book, cabinet, 0, 0, 0, .36, .036, .27, .009);
  box(book, new THREE.MeshStandardMaterial({ color: '#e5cc9b', roughness: .84 }), .012, .022, 0, .325, .022, .23, .005);
  box(book, cabinet, 0, .040, 0, .36, .016, .27, .007);
  const cover = plate(book, 0, .049, 0, .238, .119, tableLabel('FORMULES', 'CAHIER DU PARFUMEUR', '#452b20', '#d4a76c'));
  cover.rotation.x = -Math.PI / 2;
  const strip = box(scene, new THREE.MeshStandardMaterial({ color: '#eee1bf', roughness: .94 }), .58, .014, .72, .35, .009, .047, .002);
  strip.rotation.y = -.34;
  const rest = mesh(scene, profile([[0, 0], [.22, 0], [.235, .015], [.238, .033], [.225, .045], [.211, .038], [.197, .023], [0, .023]], 36),
    new THREE.MeshPhysicalMaterial({ color: '#563d2d', roughness: .24, clearcoat: .9 }), .75, .006, .52);
  rest.scale.set(1, 1, .79);
  for (let i = 0; i < 10; i++) {
    const a = i * .86;
    const petal = mesh(scene, new THREE.SphereGeometry(1, 10, 7), new THREE.MeshStandardMaterial({ color: i % 2 ? '#91643f' : '#9e6b61', roughness: .89 }),
      .75 + Math.sin(a) * .105, .048, .52 + Math.sin(a * 2) * .100, false);
    petal.scale.set(.046, .008, .021);
    petal.rotation.set(a * .12, a, a * .04);
  }
  function selectBottle(essence, chosenBottle) {
    selectedBottle = chosenBottle || clickable.find(bottle => bottle.userData.essence === essence);
    ring.visible = Boolean(selectedBottle);
    if (selectedBottle) ring.position.copy(selectedBottle.position).add(new THREE.Vector3(0, .004, 0));
  }

  return { clickable, selectBottle, liquid, liquidMaterial, drop, pipette, nameFlacon, strip };
}
