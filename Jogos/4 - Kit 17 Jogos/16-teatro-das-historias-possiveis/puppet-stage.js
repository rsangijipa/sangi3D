import {
  THREE, mesh, profile, makePlant, materialKit, panel, extrude, line, rod, arch,
  drape, tieCurtain, floorBoards, room, bookcase, lightStage, seeded,
} from '../14-estudio-dos-limites/stage-kit.js';

function cut(parent, trace, material, x = 0, y = 0, z = 0, depth = .035) {
  const shape = new THREE.Shape();
  for (const [index, coordinates] of trace.entries()) {
    if (coordinates.length === 6) shape.bezierCurveTo(...coordinates);
    else if (coordinates.length === 4) shape.quadraticCurveTo(...coordinates);
    else if (index === 0) shape.moveTo(...coordinates);
    else shape.lineTo(...coordinates);
  }
  shape.closePath();
  return mesh(parent, extrude(shape, depth, .008), material, x, y, z);
}

function oval(parent, x, y, z, width, height, material, angle = 0) {
  const shape = new THREE.Shape();
  shape.absellipse(0, 0, width / 2, height / 2, 0, Math.PI * 2, false, angle);
  return mesh(parent, extrude(shape, .028, .008), material, x, y, z);
}

function tree(parent, x, y, z, tall, leaves, trunk) {
  const group = new THREE.Group();
  parent.add(group);
  group.position.set(x, y, z);
  group.scale.setScalar(tall);
  cut(group, [[-.12, 0], [-.11, .62], [-.38, 1.12], [-.31, 1.23], [-.08, .99], [.09, 1.68], [.18, 1.65], [.09, .89], [.34, 1.31], [.44, 1.28], [.16, .64], [.15, 0]], trunk, 0, 0, .03);
  const crowns = [[-.30, 1.3, .69, .56], [.29, 1.43, .76, .64], [.03, 1.65, .75, .68], [-.33, 1.62, .57, .52], [.30, 1.76, .64, .56]];
  crowns.forEach(([x, y, w, h], index) => oval(group, x, y, .04 + index * .017, w, h, leaves[index % leaves.length], index * .21));
}

function ridge(parent, material, z, points) {
  return cut(parent, [[-2.8, .44], [-2.8, points[0][1]], ...points, [2.8, .44]], material, 0, 0, z, .045);
}

function pine(parent, x, y, z, height, material) {
  const silhouette = [[-.23, 0], [-.05, .29], [-.18, .28], [-.03, .54], [-.12, .53], [0, .81],
    [.14, .52], [.06, .53], [.21, .28], [.09, .29], [.26, 0]];
  const shape = cut(parent, silhouette, material, x, y, z);
  shape.scale.set(height * .65, height, 1);
}

function house(parent, x, y, z, scale, colors) {
  const group = new THREE.Group();
  parent.add(group);
  group.position.set(x, y, z);
  group.scale.setScalar(scale);
  cut(group, [[-.37, .04], [.38, .04], [.38, .6], [0, .96], [-.37, .6]], colors.cream);
  cut(group, [[-.48, .57], [-.01, 1.04], [.48, .58], [.42, .51], [-.01, .87], [-.41, .52]], colors.orange, 0, 0, .034);
  panel(group, .19, .36, .025, .022, colors.wood, -.09, .22, .056);
  panel(group, .14, .16, .025, .012, colors.sky, .19, .62, .056);
  panel(group, .018, .14, .023, .005, colors.cream, .19, .62, .071);
  panel(group, .12, .018, .023, .005, colors.cream, .19, .62, .071);
}

function setBackdrops(group, colors) {
  const scenes = Object.fromEntries(['forest', 'coast', 'village'].map(id => [id, new THREE.Group()]));
  group.add(...Object.values(scenes));
  const rand = seeded(5831);
  for (const [id, world] of Object.entries(scenes)) {
    world.visible = id === 'forest';
    panel(world, 5.47, 3.48, .072, .034, id === 'forest' ? colors.night : id === 'coast' ? colors.sunset : colors.sky, 0, 2.16, -1.41);
    const disc = oval(world, id === 'village' ? -1.37 : 1.03, id === 'coast' ? 2.73 : 3.19, -1.33, .54, .54, colors.moon);
    disc.castShadow = true;
    if (id === 'forest') {
      for (let i = 0; i < 18; i++) {
        const size = .017 + rand() * .032;
        oval(world, -2.58 + rand() * 5.16, 2.70 + rand() * .87, -1.325, size, size, colors.starlight);
      }
      ridge(world, colors.sky, -1.21, [[-2.38, 2.03], [-1.95, 2.16, -1.34, 2.65], [-1.05, 2.89, -.71, 2.58], [.09, 1.96], [.77, 2.35, 1.16, 2.73], [1.41, 2.93, 1.75, 2.57], [2.75, 1.97]]);
      ridge(world, colors.hill, -.97, [[-2.73, 1.96], [-2.01, 2.32, -1.15, 1.91], [-.74, 1.58, .02, 1.66], [.69, 1.72, 1.12, 2.14], [1.65, 2.12, 2.8, 1.67]]);
      tree(world, -2.23, .48, -.30, 1.5, colors.leaves, colors.wood);
      tree(world, 2.20, .48, -.38, 1.46, colors.leaves, colors.wood);
      for (let i = 0; i < 10; i++) pine(world, -2.6 + i * .56, .55, -.62 + (i % 2) * .1, 1.03 + rand() * .74, colors.leaves[i % 3]);
    } else if (id === 'coast') {
      ridge(world, colors.sky, -1.17, [[-2.8, 2.06], [-.3, 2.20, 2.8, 2.02]]);
      ridge(world, colors.hill, -.97, [[-2.8, 1.56], [-2.27, 1.88, -1.55, 1.65], [-.44, 1.20, .66, 1.60], [1.52, 1.90, 2.8, 1.57]]);
      ridge(world, colors.sand, -.70, [[-2.8, 1.18], [-2.15, 1.39, -1.19, 1.02], [.01, .75, .89, 1.20], [1.68, 1.51, 2.8, 1.37]]);
      for (let i = 0; i < 9; i++) {
        const x = -2.49 + i * .6;
        line(world, [[x, 1.49 + i % 2 * .3, -.85], [x + .13, 1.52 + i % 2 * .3, -.85], [x + .39, 1.48 + i % 2 * .3, -.85]], .013, colors.starlight);
      }
      cut(world, [[1.25, 1.9], [1.94, 1.9], [1.82, 1.72], [1.39, 1.72]], colors.wood, 0, 0, -.90);
      cut(world, [[1.55, 1.99], [1.55, 2.53], [1.81, 1.99]], colors.cream, 0, 0, -.90);
    } else {
      ridge(world, colors.hill, -1.13, [[-2.8, 1.81], [-1.44, 2.53, -.32, 1.79], [.52, 1.51, 1.35, 2.12], [1.86, 2.55, 2.8, 1.93]]);
      for (let i = 0; i < 4; i++) house(world, -2.0 + i * 1.3, .50 + rand() * .17, -.82 + (i % 2) * .11, .81 + rand() * .55, colors);
      tree(world, -2.28, .53, -.30, 1.24, colors.leaves, colors.wood);
      tree(world, 2.26, .48, -.30, 1.32, colors.leaves, colors.wood);
    }
    for (let i = 0; i < 10; i++) {
      const x = -2.50 + i * .56;
      const h = .40 + rand() * .30;
      oval(world, x, .64, -.47 + (i % 2) * .05, .68, h, id === 'coast' ? colors.sand : colors.leaves[i % 3], (rand() - .5));
    }
  }
  return scenes;
}

function fastener(pivot, x, y, z, colors) {
  const pin = mesh(pivot, new THREE.CylinderGeometry(.046, .058, .033, 24), colors.brass, x, y, z, false);
  pin.rotation.x = Math.PI / 2;
  panel(pivot, .042, .008, .005, .002, colors.dark, x, y, z + .018).rotation.z = -.46;
}

export const cast = {
  fox: { name: 'Raposa', x: -.86, y: .70, face: 1 },
  bird: { name: 'Pássaro', x: .91, y: 1.43, face: -1 },
  rabbit: { name: 'Coelho', x: -.45, y: .72, face: 1 },
  bear: { name: 'Urso', x: 1.36, y: .72, face: -1 },
  turtle: { name: 'Tartaruga', x: .43, y: .67, face: 1 },
};

function buildPuppet(id, colors, parent) {
  const root = new THREE.Group();
  root.name = id;
  const rig = new THREE.Group();
  root.add(rig);
  const body = new THREE.Group();
  rig.add(body);
  parent.add(root);
  const rodPart = rod(root, [0, -.51, -.016], [0, .32, -.016], .023, colors.wood);
  rodPart.name = 'haste';
  const pivot = (x, y, z) => {
    const group = new THREE.Group();
    group.position.set(x, y, z);
    body.add(group);
    return group;
  };
  let arm, head, tail;
  if (id === 'fox') {
    const orange = colors.orange;
    tail = pivot(-.13, .29, -.035);
    cut(tail, [[0, -.08], [-.21, -.12, -.37, .01], [-.48, .08, -.51, .33], [-.57, .43, -.69, .48], [-.49, .61, -.28, .49], [-.12, .42, -.11, .25], [.08, .11, 0, -.08]], orange);
    cut(tail, [[-.35, .32], [-.39, .35], [-.43, .30], [-.49, .37], [-.57, .43, -.69, .48], [-.50, .56, -.37, .54], [-.24, .51, -.19, .44], [-.31, .43], [-.30, .37]], colors.cream, 0, 0, .029, .012);
    cut(body, [[-.26, .05], [-.24, .36, -.17, .57], [-.13, .73, .08, .82], [.21, .88], [.22, .65, .17, .48], [.17, .25, .23, .05], [.02, .01, -.26, .05]], orange);
    cut(body, [[.035, .02], [.04, .26, .124, .49], [.17, .64, .225, .69], [.19, .50, .17, .33], [.22, .075], [.155, .03, .035, .02]], colors.cream, 0, 0, .038, .014);
    head = pivot(-.055, .70, .036);
    cut(head, [[-.14, .13], [-.29, .28, -.30, .67], [-.23, .62, -.06, .52], [.02, .47], [.07, .70], [.16, .68, .29, .43], [.32, .33, .62, .32], [.57, .23, .47, .18], [.36, .02, .095, -.015], [-.09, .025, -.14, .13]], orange);
    cut(head, [[-.151, .36], [-.223, .553], [-.045, .439], [-.08, .389]], colors.cream, 0, 0, .040, .012);
    cut(head, [[.114, .485], [.111, .617], [.212, .491]], colors.cream, 0, 0, .04, .012);
    cut(head, [[-.102, .04], [0, .092, .077, .163], [.19, .245, .37, .279], [.48, .298, .58, .319], [.534, .212, .44, .139], [.19, -.017, -.102, .04]], colors.cream, 0, 0, .039, .014);
    oval(head, .568, .305, .049, .118, .078, colors.dark, .3);
    line(head, [[.112, .23, .054], [.148, .278, .057], [.186, .248, .056]], .012, colors.dark);
    line(head, [[.365, .129, .060], [.453, .134, .06], [.493, .165, .06]], .008, colors.wood);
    fastener(head, -.08, .075, .062, colors);
    arm = pivot(.02, .485, .078);
    cut(arm, [[-.05, -.065], [-.04, .063, .07, .079], [.22, .057, .29, .095], [.43, .13, .47, .08], [.48, .04, .437, .008], [.36, -.008, .32, -.065], [.14, -.163, .01, -.112]], orange);
    fastener(arm, .024, -.015, .056, colors);
  } else if (id === 'bird') {
    const blue = colors.blue;
    tail = pivot(-.20, .30, -.026);
    cut(tail, [[-.02, -.07], [-.30, -.20, -.44, -.10], [-.34, -.04], [-.51, .035, -.43, .08], [-.31, .065], [-.46, .16, -.36, .18], [-.16, .17, .104, .065]], blue);
    cut(body, [[-.32, .25], [-.34, .475, -.209, .514], [-.048, .59, .075, .68], [.31, .67, .292, .424], [.27, .17, .031, .12], [-.19, .108, -.32, .25]], blue);
    oval(body, .029, .282, .035, .43, .265, colors.belly, .26);
    head = pivot(.165, .48, .035);
    oval(head, .059, .143, 0, .39, .35, blue, .10);
    cut(head, [[.224, .16], [.392, .131], [.245, .064]], colors.moon, 0, 0, .006);
    oval(head, .132, .175, .041, .055, .055, colors.dark);
    arm = pivot(-.017, .41, .075);
    cut(arm, [[.093, .008], [.05, .122, -.07, .153], [-.177, .24, -.271, .415], [-.411, .555, -.424, .456], [-.347, .302], [-.46, .348, -.445, .247], [-.332, .14], [-.421, .184, -.361, .071], [-.26, -.039, -.128, -.083], [.008, -.101, .093, .008]], colors.wing);
    for (let i = 0; i < 3; i++) line(arm, [[-.07 - i * .047, .024 + i * .038, .042], [-.19 - i * .05, .074 + i * .05, .048], [-.25 - i * .046, .117 + i * .068, .045]], .006, blue);
    fastener(arm, .020, .004, .051, colors);
  } else {
    const color = id === 'rabbit' ? colors.rabbit : id === 'bear' ? colors.bear : colors.turtle;
    const turtle = id === 'turtle';
    oval(body, turtle ? -.05 : -.02, turtle ? .28 : .36, 0, turtle ? .71 : .51, turtle ? .39 : .68, color, .10);
    oval(body, turtle ? -.08 : .02, turtle ? .31 : .40, .041, turtle ? .55 : .32, turtle ? .36 : .45, turtle ? colors.leaves[0] : colors.cream, .12);
    head = pivot(turtle ? .28 : .10, turtle ? .29 : .67, .045);
    if (id === 'rabbit') {
      oval(head, -.19, .35, -.009, .145, .55, color, .34);
      oval(head, -.04, .39, -.014, .142, .61, color, .09);
      oval(head, -.18, .37, .024, .068, .43, colors.orange, .34);
      oval(head, -.04, .42, .023, .071, .48, colors.orange, .09);
      oval(body, -.27, .21, -.015, .16, .17, colors.cream);
    } else if (!turtle) {
      oval(head, -.16, .29, -.005, .22, .24, color);
      oval(head, .16, .28, -.005, .21, .22, color);
      oval(head, -.157, .29, .025, .106, .11, colors.cream);
    }
    oval(head, .033, .097, .02, turtle ? .31 : .47, turtle ? .24 : .43, color, .19);
    oval(head, .155, .04, .051, .18, .123, colors.cream);
    oval(head, .204, .084, .091, .06, .046, colors.dark);
    oval(head, .106, .15, .071, .042, .045, colors.dark);
    arm = pivot(turtle ? -.04 : .095, turtle ? .21 : .45, .080);
    oval(arm, .11, -.03, 0, .30, .109, color, .35);
    fastener(arm, 0, 0, .051, colors);
    tail = pivot(-.24, .22, -.018);
    if (turtle) oval(tail, -.105, -.054, 0, .25, .081, color);
  }
  return { root, rig, head, arm, tail, rodPart };
}

export function buildStage(scene) {
  const materials = materialKit();
  const colors = {
    trim: materials.wood(0xe3b37b), wood: materials.wood(0xa8764c), walnut: materials.wood(0x69402d),
    cream: materials.felt(0xf8dbac), rope: materials.linen(0xe0b281), dark: materials.felt(0x352821),
    orange: materials.felt(0xdc743d), blue: materials.felt(0x739dc6), wing: materials.felt(0x506f9e),
    belly: materials.felt(0x9dbbd3), bear: materials.felt(0x9f6545), rabbit: materials.felt(0xceaa88),
    turtle: materials.felt(0x74915c), hill: materials.felt(0x446365), night: materials.felt(0x273d53),
    sky: materials.felt(0x6a859b), moon: materials.felt(0xf4c773), starlight: materials.felt(0xc8bea0),
    leaves: [materials.felt(0x566143), materials.felt(0x424f39), materials.felt(0x788052)],
    sand: materials.felt(0xc39b68), sunset: materials.felt(0xa76551),
    cloth: materials.velvet(0xaa5140), brass: materials.brass,
  };
  room(scene, materials, { wall: 0x967c65, floor: 0xa37151, rug: 0xe6c798 });
  bookcase(scene, materials, 3.66, -1.84, 1);
  const stage = new THREE.Group();
  scene.add(stage);
  const backdrops = setBackdrops(stage, colors);
  panel(stage, 5.46, .41, 2.04, .047, colors.wood, 0, .24, -.10);
  panel(stage, 5.53, .16, .20, .034, colors.trim, 0, .44, .91);
  panel(stage, 5.58, .11, .18, .025, colors.walnut, 0, .127, .96);
  floorBoards(stage, colors.trim, 5.39, 24, 1.89, .480, -.095);
  for (const x of [-2.53, 2.53]) panel(stage, .32, .30, .54, .051, colors.wood, x, .155, .60);
  for (const x of [-2.70, 2.70]) panel(stage, .18, 3.42, 1.98, .025, colors.walnut, x, 1.86, -.21);
  arch(stage, colors.walnut, 5.73, .182, 2.98, 4.03, .32, .69);
  arch(stage, colors.trim, 5.68, .37, 2.95, 4.01, .28, .81);
  arch(stage, colors.wood, 5.52, .50, 2.89, 3.91, .052, .876);
  const top = [[-2.49, 3.32], [-1.95, 3.70, -1.35, 3.74], [-.68, 3.87, 0, 3.88],
    [.68, 3.87, 1.35, 3.74], [1.95, 3.70, 2.49, 3.32], [2.32, 3.29, 2.14, 3.40],
    [1.77, 3.56, 1.49, 3.50], [1.14, 3.38, .73, 3.56], [.34, 3.49, 0, 3.64],
    [-.34, 3.49, -.73, 3.56], [-1.14, 3.38, -1.49, 3.50], [-1.77, 3.56, -2.14, 3.40], [-2.32, 3.29, -2.49, 3.32]];
  cut(stage, top, colors.cream, 0, 0, .885, .083).castShadow = false;
  for (const side of [-1, 1]) {
    line(stage, [[side * 1.33, 3.65, .981], [side * 1.74, 3.58, .981], [side * 2.12, 3.45, .981]], .010, colors.leaves[1]);
    for (let i = 0; i < 6; i++) {
      const x = side * (1.48 + i * .123);
      oval(stage, x, 3.64 - i * .031 + (i % 2 ? -.08 : .045), .975, .26, .102, colors.leaves[i % 3], side * (i % 2 ? -.61 : .54));
    }
    drape(stage, colors.cloth, side * 2.55, { top: 3.64, bottom: .49, open: 1.42, z: .62, pleats: 7 });
    tieCurtain(stage, side * 2.57, 1.34, .77, .51, colors.rope);
    for (let i = 0; i < 4; i++) {
      oval(stage, side * (1.83 + i * .14), .60 + (i % 2) * .08, .43, .37, .30, colors.leaves[i % 3], i * .72);
    }
  }
  const book = panel(scene, .77, .17, 1.05, .045, materials.linen(0x476251), -2.95, .125, 1.60);
  book.rotation.y = .24;
  panel(book, .70, .112, 1.01, .025, materials.paper(0xe1c3a0), 0, .008, .045);
  const ceramic = materials.paper(0xd0ae8b);
  makePlant(scene, -3.44, -.34, 1.1, 2, ceramic);
  mesh(scene, profile([[0, 0], [.13, 0], [.15, .037], [.20, .27], [.194, .30], [.16, .283], [.11, .045], [0, .045]], 32), ceramic, -2.99, .22, 1.56);
  for (let i = 0; i < 5; i++) {
    const x = -3.14 + i * .063;
    const y = .66 + Math.sin(i * 2.2) * .11;
    rod(scene, [-2.99, .41, 1.56], [x, y, 1.55 + i * .02], .021, i % 2 ? colors.wing : colors.orange);
    rod(scene, [x, y, 1.55 + i * .02], [x, y + .055, 1.55 + i * .02], .018, colors.wood, .43);
  }
  for (let i = 0; i < 2; i++) {
    const ball = mesh(scene, new THREE.SphereGeometry(.19 - i * .034, 22, 16), i ? colors.moon : colors.orange, 2.84 + i * .31, .17, 1.62 - i * .14);
    ball.scale.y = .91;
  }

  const key = lightStage(scene, [0, 1.80, -.10], { fill: .80, key: 4.2, position: [-3.2, 6.5, 5], shadow: innerWidth <= 680 ? 1024 : 2048 });
  const stageLight = new THREE.SpotLight(0xffbc78, 27, 9, .59, .70, 1.4);
  stageLight.position.set(.25, 3.48, .78);
  stageLight.target.position.set(.10, 1.25, -.4);
  stage.add(stageLight, stageLight.target);
  const puppets = Object.fromEntries(Object.keys(cast).map(id => [id, buildPuppet(id, colors, stage)]));
  const mark = mesh(stage, new THREE.TorusGeometry(.13, .009, 8, 40), new THREE.MeshStandardMaterial({
    color: 0xffce79, emissive: 0xebaa55, emissiveIntensity: 1.2, roughness: .67,
  }), 0, .513, .17, false);
  mark.rotation.x = -Math.PI / 2;
  return { backdrops, puppets, key, stageLight, mark };
}
