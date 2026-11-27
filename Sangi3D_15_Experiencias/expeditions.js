import { THREE, clamp, rng } from './runtime.js';
import { navigator, withNavigation, atmosphereAudio } from './navigation.js';
import { atmosphere, batch, box, boxes, beam, beams, group, glow, lamp, marker, mat, mesh, orb, rock, rocks, sign, specks, cuspTerrain, trees, tube, wood, surfaceMaterial } from './scenery.js';

function notebook(ctx, title, names, onChange) {
  const loaded = ctx.load([]);
  const entries = new Set(Array.isArray(loaded) ? loaded.filter(i => Number.isInteger(i) && i >= 0 && i < names.length) : []);
  const details = document.createElement('details');
  const summary = document.createElement('summary');
  const list = document.createElement('ol');
  details.append(summary, list); ctx.controls.append(details);
  function update() {
    summary.textContent = title + ' · ' + entries.size + ' de ' + names.length;
    const nodes = names.map((name, i) => {
      const line = document.createElement('li');
      line.textContent = entries.has(i) ? name : 'A descobrir';
      return line;
    });
    list.replaceChildren(...nodes);
    onChange?.(entries);
  }
  update();
  return {
    entries,
    discover(i, detail) {
      const had = entries.has(i); entries.add(i); if (!had) { ctx.save([...entries]); update(); }
      ctx.say((had ? 'Já registrado: ' : 'Registrado: ') + names[i] + '. ' + detail);
    },
    clear() { entries.clear(); ctx.save([]); update(); ctx.say('Descobertas removidas do registro local.'); },
  };
}

export function forest(ctx) {
  const scene = ctx.scene, random = rng(50931);
  atmosphere(ctx, 0x182e38, 0x333e35, 0xabc8e5, { fog: .038, fill: 1.18, intensity: 1.9, sky: 0xaccbea });
  const moss = surfaceMaterial(0x78946b, 'soil', 23, { vertexColors: true }), trail = surfaceMaterial(0x9a7958, 'soil', 1), rockMat = surfaceMaterial(0x8c9487, 'stone', 2);
  const water = mat(0x3d7180, { roughness: .22, metalness: .43, transparent: true, opacity: .87 });
  const trailCenter = z => Math.sin((z + 4) * .16) * 1.25;
  const bank = (x, z) => {
    const river = Math.exp(-((z + 4) ** 2) / 3.8) * .67;
    const relief = (Math.sin(x * .45) * .50 + Math.cos(z * .22) * .26 + Math.sin(z * .56 + x * .27) * .18) * clamp((Math.abs(x - trailCenter(z)) - 1.5) / 4, 0, 1);
    return relief - river;
  };
  cuspTerrain(scene, moss, 74, 82, bank, 85);
  const pathGeo = new THREE.BufferGeometry(), surface = [], uv = [];
  for (let z = -28; z < 12; z += .27) {
    for (const [side, zOff] of [[-1, 0], [1, 0], [-1, .27], [1, 0], [1, .27], [-1, .27]]) {
      const zz = z + zOff;
      const x = trailCenter(zz) + side * (1.18 + .08 * Math.sin(zz * 1.7));
      surface.push(x, bank(x, zz) + .025, zz);
      uv.push(side * .5 + .5, zz * .47);
    }
  }
  pathGeo.setAttribute('position', new THREE.Float32BufferAttribute(surface, 3));
  pathGeo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  pathGeo.computeVertexNormals(); trail.side = THREE.DoubleSide;
  mesh(scene, pathGeo, trail);
  box(scene, water, 0, -.21, -4, 65, .04, 4.35);
  const trunks = [], stones = [];
  for (let i = 0; i < 270; i++) {
    const x = (random() - .5) * 70, z = (random() - .5) * 78;
    if (Math.abs(x - trailCenter(z)) > 2.1 && Math.abs(z + 4) > 2.5) trunks.push([x, bank(x, z), z, 3.5 + random() * 9, random() * 6.2]);
  }
  trees(scene, trunks, 'broad');
  const branches = [];
  for (const [x, y, z, height] of trunks.filter(([x, , z]) => Math.abs(x) < 11 && Math.abs(z) < 20).slice(0, 36)) {
    const width = height * .065;
    for (let i = 0; i < 4; i++) {
      const angle = i * 1.58 + random() * .4, length = height * (.13 + random() * .11);
      branches.push([[x, y + height * (.40 + i * .075), z],
      [x + Math.cos(angle) * length, y + height * (.58 + i * .082), z + Math.sin(angle) * length], width * .43],
        [[x, y + height * .08, z], [x + Math.cos(angle) * width * 3.2, y + .10, z + Math.sin(angle) * width * 3.2], width * .38]);
    }
  }
  beams(scene, surfaceMaterial(0x70513f, 'bark', 2), branches, true);
  const blade = new THREE.BufferGeometry();
  blade.setAttribute('position', new THREE.Float32BufferAttribute([-.08, 0, 0, .08, 0, 0, .055, .49, .11, -.08, 0, 0, .055, .49, .11, -.02, .53, .11, -.02, .53, .11, .055, .49, .11, 0, .94, .36], 3));
  blade.computeVertexNormals();
  const cover = [];
  for (let i = 0; i < 950; i++) {
    const z = 12 - random() * 39, x = trailCenter(z) + (i % 2 ? 1 : -1) * (1.35 + random() * 15);
    if (Math.abs(z + 4) < 2.1) continue;
    for (let j = 0; j < 4; j++) {
      const scale = .27 + random() * .40;
      cover.push([x + random() * .22, bank(x, z), z + random() * .15, scale, scale, scale, random() * 6.3, [0x5d8667, 0x7c9d6d, 0x78845e][j % 3]]);
    }
  }
  const blades = batch(scene, blade, mat(0xa9b69b, { side: THREE.DoubleSide }), cover);
  for (let i = 0; i < 140; i++) {
    const x = (random() - .5) * 49, z = (random() - .5) * 61;
    if (Math.abs(x - trailCenter(z)) > 1.5) stones.push([x, bank(x, z) - .02, z, .22 + random() * .74, .12 + random() * .33, .21 + random() * .63, random() * 5]);
  }
  rocks(scene, rockMat, stones);
  const deck = wood(0x85644d), rail = wood(0x594536);
  for (let i = 0; i < 13; i++)box(scene, deck, 0, .09, -6.10 + i * .357, 2.49, .135, .335, 0);
  for (const x of [-1.18, 1.18]) {
    beam(scene, rail, [x, .91, -6.35], [x, .91, -1.62], .059);
    beam(scene, rail, [x, .34, -6.35], [x, .34, -1.62], .051);
    for (const z of [-6.3, -4.78, -3.2, -1.72]) box(scene, rail, x, .52, z, .13, 1.04, .14);
  }
  const species = ['Lúmina azul', 'Samambaia-prata', 'Lanterna-rubra', 'Crista de jade', 'Flor do riacho', 'Véu lunar'];
  const flowers = [[-1.36, 3], [1.47, -.42], [-1.35, -8.1], [1.66, -12.35], [-1.2, -17.5], [1.7, -21.75]];
  const colors = [0x70cbef, 0x96d2c2, 0xea8c8e, 0x86f2b3, 0x8c9cef, 0xd7c3ff];
  let flare = -1, until = 0;
  const plantLights = [];
  flowers.forEach(([dx, z], i) => {
    const x = trailCenter(z) + dx, y = bank(x, z);
    const top = glow(colors[i], .78), stem = mat(0x648579);
    for (let j = 0; j < 9; j++) {
      const a = j * 2.399, d = .10 + random() * .51, px = x + Math.cos(a) * d, pz = z + Math.sin(a) * d, ht = .15 + random() * .54;
      tube(scene, stem, px, y + ht * .5, pz, .021 + ht * .035, ht);
      const cap = orb(scene, top, px, y + ht, pz, .11 + ht * .12, .052 + ht * .044, .11 + ht * .12);
      cap.rotation.z = (random() - .5) * .38;
      for (let q = 0; q < 5; q++) {
        const a = q / 5 * Math.PI * 2;
        beam(scene, stem, [px, y + ht - .033, pz], [px + Math.sin(a) * .12, y + ht - .028, pz + Math.cos(a) * .12], .007);
      }
    }
    marker(scene, colors[i], x, y + .058, z);
    const light = lamp(scene, colors[i], i < 3 ? 1.8 : 1.2, x, y + .58, z, 2.6);
    plantLights.push(light);
  });
  const fire = new Float32Array(180 * 3), origin = fire.slice();
  for (let i = 0; i < fire.length; i += 3) { const z = 10 - random() * 38; origin.set([trailCenter(z) + (random() - .5) * 5, .22 + random() * 2, z], i); }
  fire.set(origin);
  const points = specks(scene, fire, 0xa2efbe, .053, .85);
  const wave = mesh(scene, new THREE.TorusGeometry(.29, .013, 6, 40), glow(0x93eae9, 1.1));
  wave.rotation.x = -Math.PI / 2; wave.visible = false;
  sign(scene, 'CLAREIRA · PONTE · LAGO', -2.13, 1.33, 5.4, 1.55, .28);
  box(scene, rail, -2.15, .68, 5.25, .09, 1.38, .10);
  const audio = atmosphereAudio(ctx, { cutoff: 1100 });
  const nav = navigator(ctx, {
    start: [0, 1.61, 8.8], bounds: [-5.3, 5.3, -38, 11.8], speed: 3.5, ground: (x, z) => Math.abs(z + 4) < 2.43 ? .15 : bank(x, z),
    canWalk: (x, z) => Math.abs(z + 4) > 2.44 || Math.abs(x) < 1.10
  });
    // Cascata lunar at far north (z = -35)
    const cascadeX = trailCenter(-35);
    box(scene, mat(0x6ad7e6, { emissive: 0x3bb8d0, emissiveIntensity: .85, transparent: true, opacity: .72 }), cascadeX, 2.4, -36.2, 3.4, 5.2, .25);
  box(scene, water, cascadeX, -.15, -34.2, 6.2, .05, 4.2);
  lamp(scene, 0x7ce6f5, 18, cascadeX, 2.1, -34.8, 9);
  sign(scene, 'CASCATA LUNAR', cascadeX, 2.2, -35.6, 2.2, .32, { background: '#163442' });
  const book = notebook(ctx, 'Caderno', species);
  flowers.forEach(([dx, z], i) => {
    const x = trailCenter(z) + dx;
    nav.add({
      x, z, range: 2.23, label: 'Registrar ' + species[i], action: () => {
        book.discover(i, 'A colônia respondeu com um pulso curto de luz.');
        flare = i; until = ctx.timers.time + 2;
      }
    });
  });
  nav.add({ x: cascadeX, z: -32.8, range: 2.4, label: 'Contemplar cascata', action: () => ctx.say('Cascata lunar. A névoa fria reflete o brilho das colônias.') });
  const options = ctx.group();
  ctx.button('Voltar à clareira', () => { nav.reset(); ctx.say('Clareira inicial. Siga a trilha até a ponte.'); }, options);
  ctx.button('Observar riacho', () => {
    nav.place(-.42, 1.76, -2.20, 0); ctx.say('Ponte do riacho. Continue em frente para a outra margem.');
  }, options);
  ctx.select('Marco', ['Clareira', 'Ponte do riacho', 'Bosque profundo', 'Cascata lunar'], idx => {
    const pts = [[0, 1.71, 8.8, 0], [-.42, 1.76, -2.20, 0], [trailCenter(-17), 1.71, -16.5, 0], [cascadeX, 1.71, -31.5, 0]];
    nav.place(...pts[idx]);
    ctx.say(['Clareira inicial.', 'Ponte do riacho.', 'Bosque profundo.', 'Cascata lunar no extremo norte.'][idx]);
  });
  ctx.button('Lançar seixo', () => {
    if (Math.abs(nav.pos.z + 4) > 4) { ctx.say('Aproxime-se da ponte para alcançar a água.'); return; }
    wave.position.set(nav.pos.x + 2, -.167, -4);
    wave.visible = true; wave.scale.setScalar(.4); ctx.say('Ondulação no riacho.');
  }, options);
  const confirmClear = ctx.button('Limpar caderno', () => {
    if (confirmClear.dataset.confirm === 'yes') { book.clear(); delete confirmClear.dataset.confirm; confirmClear.textContent = 'Limpar caderno'; }
    else { confirmClear.dataset.confirm = 'yes'; confirmClear.textContent = 'Confirmar limpeza'; }
  }, options);
  return withNavigation(nav, {
    mute: audio.mute, dispose: audio.dispose, quality(low) { blades.count = low ? 1900 : cover.length; },
    reset() { flare = -1; wave.visible = false; ctx.say('De volta à clareira. O caderno foi preservado.'); },
    update(dt, time) {
      const t = ctx.reduced ? 0 : time;
      for (let i = 0; i < fire.length; i += 3) { fire[i] = origin[i] + Math.sin(i + t * .71) * .45; fire[i + 1] = origin[i + 1] + Math.cos(i * .8 + t * 1.04) * .37; fire[i + 2] = origin[i + 2] + Math.sin(i * .24 + t * .49) * .38; }
      points.geometry.attributes.position.needsUpdate = true;
      points.geometry.setDrawRange(0, ctx.low ? 75 : 180);
      if (wave.visible) { wave.scale.multiplyScalar(1 + dt * 1.75); if (wave.scale.x > 5) wave.visible = false; }
      plantLights.forEach((light, i) => { light.intensity = 1.40 + (i === flare && time < until ? (until - time) * 2.8 : 0); });
      const near = Math.abs(nav.pos.z + 4) < 4.5;
      nav.zone(near, () => audio.set(near ? .49 : .16, near ? 800 : 1420));
      nav.position.textContent = (near ? 'Ponte do riacho' : nav.pos.z > 0 ? 'Clareira' : 'Bosque luminoso') + ' · ' + book.entries.size + ' espécies';
    }
  });
}

function arch(scene, material, x, y, z, width = 4.7, height = 5.0) {
  const col = width * .12, center = height * .55, r = width * .40;
  for (const side of [-1, 1]) {
    for (let i = 0; i < 6; i++) {
      const yy = y + center * (i + .5) / 6;
      box(scene, material, x + side * r, yy, z, col + (i === 0 ? .24 : .05), center / 6 - .03, 1.15 + (i === 0 ? .24 : 0));
    }
    box(scene, material, x + side * r, y + center - .055, z, col + .32, .14, 1.22);
  }
  for (let j = 0; j < 12; j++) {
    const angle = (j + .5) / 12 * Math.PI;
    const block = box(scene, material, x + Math.cos(angle) * r, y + center + Math.sin(angle) * r, z, r * .258, .54, 1.16);
    block.rotation.z = angle + Math.PI / 2;
  }
}
function relic(scene, surface, accent, x, y, z, kind) {
  const base = mat(0x7c7771);
  rock(scene, base, x, y - .17, z, .69, .21, .66);
  if (kind % 3 === 0) {
    const shape = [[0, 0], [.24, 0], [.31, .18], [.34, .42], [.26, .65], [.13, .77], [.14, .89], [.105, .89], [.089, .74], [0, .63]];
    const vase = mesh(scene, new THREE.LatheGeometry(shape.map(p => new THREE.Vector2(...p)), 35), surface, [x, y, z]);
    vase.rotation.z = .18;
    for (const side of [-1, 1]) {
      const handle = mesh(scene, new THREE.TorusGeometry(.17, .032, 6, 21, Math.PI * 1.45), accent, [x + side * .26, y + .61, z]);
      handle.rotation.z = side > 0 ? -.9 : 1.6;
    }
  } else if (kind % 3 === 1) {
    const slab = box(scene, surface, x, y + .37, z, .60, .77, .14);
    slab.rotation.z = .14;
    for (let i = 0; i < 4; i++)box(scene, accent, x, y + .18 + i * .13, z + .08, .25 + i * .05, .022, .022);
  } else {
    const gem = rock(scene, accent, x, y + .36, z, .36, .32, .29);
    gem.rotation.z = .72;
  }
}

export function submerged(ctx) {
  const scene = ctx.scene, random = rng(19015);
  atmosphere(ctx, 0x164653, 0x426254, 0x92d8ea, { fog: .051, fill: 1.50, intensity: 2.3, sky: 0x97ddee });
  const sand = surfaceMaterial(0x879b83, 'soil', 21, { vertexColors: true }), stone = surfaceMaterial(0xa2ab94, 'stone', 3, { roughness: .93 });
  cuspTerrain(scene, sand, 70, 82, (x, z) => Math.sin(x * .42) * .10 + Math.cos(z * .32) * .08, 73);
  const rows = [0, -8, -15, -22, -31];
  rows.forEach((z, i) => {
    for (const x of [-6.7, 0, 6.7]) if (!(i === 3 && x === 0)) arch(scene, stone, x, 0, z, 5.90, i % 2 ? 5.5 : 5.75);
  });
  const debris = [];
  for (let i = 0; i < 193; i++) {
    const x = (random() - .5) * 46, z = -38 + random() * 58;
    if (Math.abs(x) > 2.3) debris.push([x, .045, z, random() * .77 + .25, random() * .64 + .07, random() * .85 + .3, random() * 6.2,
      [0x859483, 0x9c9e86, 0x6b8e7c][i % 3]]);
  }
  rocks(scene, stone, debris);
  const coral = [mat(0xc47761), mat(0xb07883), mat(0xc6a178)], leaves = mat(0x537b59);
  const branches = [[], [], []], seaGrass = [];
  const shoals = [];
  for (let i = 0; i < 42; i++) {
    const z = 9 - random() * 45, x = (i % 2 ? 1 : -1) * (2 + random() * 9.4), h = .27 + random() * .77;
    const x2 = x + (random() - .5) * .45, z2 = z + (random() - .5) * .45;
    branches[i % 3].push([[x, .02, z], [x2, h, z2], .075]);
    for (let j = 0; j < 4; j++) {
      const a = j * Math.PI * .5 + i;
      branches[i % 3].push([[x2, h * .45, z2], [x2 + Math.cos(a) * h * .55, h * .87, z2 + Math.sin(a) * h * .55], .048]);
    }
    for (let j = 0; j < 3; j++)seaGrass.push([[x + .42, .02, z], [x + .38 + j * .13, h * .65, z + .39 - j * .21], .028]);
  }
  branches.forEach((branch, i) => beams(scene, coral[i], branch, true));
  beams(scene, leaves, seaGrass, true);
  for (let i = 0; i < 28; i++)shoals.push({ fish: orb(scene, mat(i % 3 === 0 ? 0xb89462 : 0x668f96, { roughness: .39, metalness: .32 }), 0, 0, 0, .17, .073, .047), a: i * .31, b: random() * 3, h: 2 + random() * 4 });
  const silt = new Float32Array(1800 * 3);
  for (let i = 0; i < silt.length; i += 3)silt.set([(random() - .5) * 39, random() * 11, 24 - random() * 69], i);
  const particulate = specks(scene, silt, 0xa8c6b2, .041, .36);
  const roof = mat(0x65b5bc, { metalness: .25, roughness: .34, transparent: true, opacity: .37, side: THREE.DoubleSide, depthWrite: false });
  box(scene, roof, 0, 10.4, -6, 72, .05, 95);
  const samples = [[-3.1, .38, 3.3], [3.5, .70, -4], [-2.2, .40, -9.8], [4.5, 1.37, -16.4], [-4.25, .72, -23.3], [2.8, .35, -29.3]];
  const names = ['Ânfora', 'Estela', 'Vidro marinho', 'Urna de sal', 'Placa da praça', 'Selo do jardim'];
  const finishes = [mat(0xa07451), mat(0x7c9690), mat(0x90b9ad, { metalness: .17 })];
  samples.forEach(([x, y, z], i) => {
    relic(scene, finishes[i % 3], mat(0x577c6c), x, y, z, i); marker(scene, 0x81dad6, x, Math.max(.14, y - .01), z);
  });
  const door = box(scene, mat(0x717e71), 0, 1.17, -21.8, 2.25, 2.32, .35);
  const beacon = lamp(scene, 0x89f6ea, 16, 0, 2, -21, 7);
  // Altar do Recife inside the temple chamber (z = -31)
  box(scene, stone, 0, .45, -31, 1.8, .9, 1.8);
  const altarCore = orb(scene, glow(0x7cf5ea, 1.4), 0, 1.35, -31, .32, .46, .32);
  lamp(scene, 0x7cf5ea, 18, 0, 2.2, -31, 9);
  const flash = new THREE.SpotLight(0xd2f6fb, 19, 17, Math.PI * .19, .65, 1.6);
  ctx.camera.add(flash); flash.position.set(.22, -.23, -.09);
  ctx.camera.add(flash.target); flash.target.position.set(.0, -.10, -6.2);
  scene.add(ctx.camera);
  let light = true, gate = false;
  const nav = navigator(ctx, {
    start: [-1.5, 2, 6.55], bounds: [-13.5, 13.5, -35.7, 11.9], swim: true, speed: 3.4, minY: .65, maxY: 9.2,
    canWalk: (x, z, y) => !(Math.abs(x) < 1.36 && Math.abs(z + 21.8) < .42 && y < 2.53 && !gate)
  });
  const book = notebook(ctx, 'Diário de campo', names);
  const audio = atmosphereAudio(ctx, { cutoff: 270 });
  const options = ctx.group();
  const lantern = ctx.button('Desligar lanterna', () => {
    light = !light; flash.visible = light; lantern.textContent = light ? 'Desligar lanterna' : 'Ligar lanterna';
  }, options);
  ctx.button('Sonar do recife', () => {
    const pending = samples.map((s, i) => ({ s, i })).filter(({ i }) => !book.entries.has(i));
    if (!pending.length) { ctx.say('Todas as 6 peças já foram catalogadas. Explore o altar do templo.'); return; }
    pending.sort((a, b) => Math.hypot(a.s[0] - nav.pos.x, a.s[2] - nav.pos.z) - Math.hypot(b.s[0] - nav.pos.x, b.s[2] - nav.pos.z));
    const nearest = pending[0];
    const dist = Math.round(Math.hypot(nearest.s[0] - nav.pos.x, nearest.s[2] - nav.pos.z));
    ctx.say(`Sonar: ${names[nearest.i]} a cerca de ${dist} m.`);
  }, options);
  ctx.button('Retornar à entrada', () => { nav.reset(); ctx.say('Entrada do recife. O diário está disponível.'); }, options);
  const clear = ctx.button('Limpar diário', () => {
    if (clear.dataset.confirm === '1') { book.clear(); clear.textContent = 'Limpar diário'; delete clear.dataset.confirm; }
    else { clear.dataset.confirm = '1'; clear.textContent = 'Confirmar limpeza'; }
  }, options);
  samples.forEach(([x, y, z], i) => nav.add({
    x, y: y + .5, z, range: 2.33, label: 'Examinar ' + names[i], action: () => {
      if (!light && i % 2 === 0) { ctx.say('Ligue a lanterna para examinar os detalhes.'); return; }
      book.discover(i, ['A borda conserva marcas da antiga queima.', 'As linhas se repetem nas pedras da praça.', 'A água arredondou as bordas.'][i % 3]);
    }
  }));
  nav.add({
    x: -.7, y: 1.75, z: -20.35, range: 2.4, label: 'Ativar painel do templo', action: () => {
      gate = !gate; door.position.y = gate ? 3.76 : 1.17; beacon.intensity = gate ? 26 : 12; ctx.say(gate ? 'Passagem do templo aberta.' : 'Passagem do templo fechada.');
    }
  }, {
    x: 0, y: 1.6, z: -29.5, range: 2.6, label: 'Examinar altar', action: () => {
      altarCore.material.emissiveIntensity = 2.6;
      ctx.say('Altar do Recife: o núcleo pulsa em sintonia com as correntes profundas.');
    }
  });
  return withNavigation(nav, {
    fov: 60, mute: audio.mute, dispose: audio.dispose,
    reset() { if (!light) lantern.click(); gate = false; door.position.y = 1.17; ctx.say('De volta à entrada. As descobertas permanecem no diário.'); },
    update(_, time) {
      const t = ctx.reduced ? 0 : time;
      shoals.forEach(({ fish, a, b, h }, i) => { fish.position.set(Math.sin(t * .48 + a) * (3 + b), h + Math.sin(t * .61 + a) * .34, -14 + i * .69 + Math.cos(t * .48 + a) * 2.7); fish.rotation.y = -(t * .48 + a); });
      particulate.geometry.setDrawRange(0, ctx.low ? 240 : 600);
      particulate.position.y = Math.sin(t * .14) * .24;
      const depth = (10.4 - nav.pos.y) * 2.6;
      nav.position.textContent = depth.toFixed(1) + ' m abaixo da superfície · ' + book.entries.size + ' descobertas';
      nav.zone(depth > 14, () => audio.set(depth > 14 ? .42 : .31, depth > 14 ? 195 : 440));
    }
  });
}

export function impossible(ctx) {
  const scene = ctx.scene, random = rng(44391);
  atmosphere(ctx, 0x535d6e, 0x7c705f, 0xffecd4, { fog: .023, fill: 1.76, intensity: 3.3 });
  const travertine = surfaceMaterial(0xe2cdb3, 'stone', 2, { roughness: .86 }), joints = mat(0x85796c), iron = mat(0x8c795e, { metalness: .54, roughness: .3 });
  const strip = glow(0x6daaff, 1.12), gold = glow(0xe8c38b, .45), floor = mat(0xb5a48e);
  box(scene, floor, 0, -.22, 4.95, 12, .43, 8.5);
  box(scene, floor, 0, -.22, -8.13, 12, .43, 8.5);
  box(scene, joints, 0, -4.3, -2.2, 55, .55, 63);
  const seams = [];
  for (const z0 of [4.94, -8.13]) for (let j = 0; j < 10; j++)for (let i = 0; i < 13; i++) {
    const z = z0 + (j - 4.5) * .824, x = (i - 6) * .915;
    seams.push([x, .015, z, .890, .024, .801, 0, [0xd9cdbb, 0xd1c2ae, 0xb8ab9f][Math.floor(random() * 3)]]);
  }
  boxes(scene, travertine, seams);
  for (const x of [-6.2, 6.2]) {
    for (let z = -13; z < 10; z += 4) {
      box(scene, travertine, x, 3.30, z, .58, 6.59, .69);
      box(scene, joints, x, 0.24, z, .89, .39, .95);
      box(scene, travertine, x, 5.79, z, .81, .27, .98);
      box(scene, strip, x - Math.sign(x) * .30, 4.3, z, .043, 2.7, .103);
    }
    box(scene, travertine, x, 6.41, -1.5, .62, .71, 24);
  }
  arch(scene, travertine, 0, 0, -10.45, 5.1, 6.4);
  const skyBridge = group(scene, -4.6, 2.25, -3.56);
  skyBridge.rotation.z = Math.PI / 2.65;
  const overhang = group(scene, 4.62, 3.5, -4.2);
  overhang.rotation.z = -Math.PI / 2;
  function stairs(parent, startX, startY, startZ, direction) {
    for (let i = 0; i < 11; i++) {
      const y = startY + i * .182, z = startZ + i * .33 * direction;
      box(parent, travertine, startX, y, z, 1.87, .225, .36);
      box(parent, joints, startX, y + .109, z + .101 * direction, 1.77, .012, .066);
      if (i % 3 === 0) for (const side of [-1, 1]) box(parent, iron, startX + side * .86, y + .48, z, .045, .85, .042);
    }
    for (const side of [-1, 1]) beam(parent, iron, [startX + side * .86, startY + .95, startZ], [startX + side * .86, startY + 2.77, startZ + 3.3 * direction], .042);
  }
  stairs(skyBridge, 0, 0, 0, -1); stairs(overhang, 0, 0, 0, 1);
  for (const z of [.75, -3.89]) {
    box(scene, iron, 0, -.35, z, 4.2, .35, .30);
    for (const x of [-1.27, 1.27]) box(scene, strip, x, .023, z, .18, .023, .29);
  }
  const moving = group(scene, 0, -.1, -1.58);
  for (let i = 0; i < 10; i++)box(moving, travertine, 0, 0, (i - 4.5) * .45, 1.69, .21, .43);
  for (const x of [-.90, .90]) for (let i = 0; i < 6; i++)box(moving, iron, x, .37, (i - 2.5) * .77, .038, .78, .068);
  for (const x of [-.90, .90]) beam(moving, iron, [x, .79, -2.1], [x, .79, 2.1], .038);
  const hinge = tube(scene, iron, 0, -.41, -1.58, .56, .59);
  const viewpoint = marker(scene, 0xffce8a, 0, .025, 3.8);
  viewpoint.scale.setScalar(2.3);
  sign(scene, 'PONTO DE OBSERVAÇÃO', 0, 1.25, -.2, 2.65, .30);
  const portal = mesh(scene, new THREE.TorusGeometry(.94, .045, 8, 58), strip, [0, 1.45, -10.9]);
  box(scene, mat(0x5a7096, { metalness: .73, roughness: .14 }), 2.95, 1.50, -10.84, 1.7, 2.85, .06);
  lamp(scene, 0x7198f2, 25, 0, 2.5, -10.7, 8);
  // Sala 2 — Pátio dos Arcos Invertidos (z in [-26, -13])
  box(scene, floor, 0, -.22, -15.2, 10, .43, 5.2);
  box(scene, floor, 0, -.22, -24.6, 10, .43, 5.2);
  const bridge2 = group(scene, 0, -.1, -19.9);
  for (let i = 0; i < 10; i++)box(bridge2, travertine, 0, 0, (i - 4.5) * .45, 1.69, .21, .43);
  for (const x of [-.90, .90]) beam(bridge2, iron, [x, .79, -2.1], [x, .79, 2.1], .038);
  arch(scene, travertine, 0, 0, -26.4, 5.1, 6.4);
  const obelisk = box(scene, gold, 0, 1.4, -25.2, .65, 2.8, .65);
  lamp(scene, 0xf5d093, 22, 0, 3.2, -24.5, 10);
  let position = 1, aligned = false, yawGoal = Math.PI / 2, walked = false, room = 0, aligned2 = false;
  moving.rotation.y = yawGoal;
  bridge2.rotation.y = Math.PI / 2;
  const audio = atmosphereAudio(ctx, { cutoff: 640 });
  const state = ctx.reading('A ponte está fora de alinhamento.');
  const nearMark = () => Math.hypot(nav.pos.x, nav.pos.z - 3.8) < .84 || Math.hypot(nav.pos.x, nav.pos.z + 14.5) < 1.4;
  const nav = navigator(ctx, {
    start: [0, 1.61, 7.6], bounds: [-5.8, 5.8, -26.2, 8.5], speed: 3.15,
    canWalk: (x, z) => {
      if (z > .70 || (z < -3.89 && z > -12.4)) return true;
      if (z <= -12.4 && z >= -17.6) return true;
      if (z < -22.1) return true;
      if (z <= -17.6 && z >= -22.1) return aligned2 && Math.abs(x) < .72;
      return aligned && Math.abs(x) < .72;
    }
  });
  const tools = ctx.group();
  function observe() {
    if (room === 1) { nav.place(0, 1.61, -14.5, 0); ctx.say('Ponto da Sala 2. Alinhe a segunda passarela.'); return; }
    nav.place(0, 1.61, 3.8, 0); ctx.say('Gire a seção móvel e alinhe a ponte neste ponto.');
  }
  function turn() {
    if (nav.pos.z <= .70 && nav.pos.z >= -3.89) { ctx.say('Saia da ponte antes de girar o mecanismo.'); return; }
    position = (position + 1) % 4; aligned = false;
    if ((nav.pos.z <= .70 && nav.pos.z >= -3.89) || (nav.pos.z <= -17.6 && nav.pos.z >= -22.1)) { ctx.say('Saia da ponte antes de girar o mecanismo.'); return; }
    position = (position + 1) % 4; aligned = false; aligned2 = false;
    yawGoal = position * Math.PI / 2;
    ctx.say('Estrutura girada ' + position * 90 + '°. Mesmo eixo, mesma passagem.');
  }
  function align() {
    if (!nearMark()) { ctx.say('Use o ponto de observação para alinhar as plataformas.'); return; }
    if (position % 2 !== 0) { ctx.say('As plataformas ainda estão perpendiculares. Gire a estrutura em 90°.'); return; }
    if (nav.pos.z < -12) { aligned2 = true; ctx.say('Passarela da Sala 2 alinhada.'); return; }
    aligned = true; ctx.say('Passagem alinhada. Avance para testar a travessia.');
  }
  function portalAction() {
    nav.place(.5, 1.61, 6.18, Math.PI);
    if (nav.pos.z > -12) {
      room = 1; nav.place(0, 1.61, -14.5, 0);
      ctx.say('Portal ativado. Você entrou na Sala 2 · Pátio Invertido.');
    } else {
      room = 0; nav.place(.5, 1.61, 6.18, Math.PI);
      ctx.say('Portal ativado. Você voltou ao átrio da Sala 1.');
    }
    if (!ctx.reduced) ctx.canvas.animate([{ opacity: .06 }, { opacity: 1 }], { duration: 460, easing: 'ease-out' });
  }
  ctx.button('Ir ao ponto de observação', observe, tools);
  ctx.button('Girar 90°', turn, tools);
  ctx.button('Alinhar plataformas', align, tools, true);
  ctx.select('Sala', ['Sala 1 · Travessia', 'Sala 2 · Pátio Invertido'], idx => {
    room = idx;
    if (idx === 0) { nav.place(0, 1.61, 7.6, 0); ctx.say('Sala 1 · Travessia.'); }
    else { nav.place(0, 1.61, -14.5, 0); ctx.say('Sala 2 · Pátio Invertido.'); }
  });
  nav.add({ x: 0, z: 3.8, range: 1.02, label: 'Alinhar plataformas', action: align },
    { x: 0, z: -10.55, range: 1.83, label: 'Entrar na Sala 2', action: portalAction },
    { x: 0, z: -14.5, range: 1.2, label: 'Alinhar passarela', action: align },
    { x: 0, z: -24.8, range: 2.0, label: 'Retornar à Sala 1', action: portalAction });
  return withNavigation(nav, {
    mute: audio.mute, dispose: audio.dispose, fov: 61,
    reset() { position = 1; aligned = aligned2 = walked = false; room = 0; yawGoal = Math.PI / 2; moving.rotation.y = yawGoal; bridge2.rotation.y = yawGoal; ctx.say('Mecanismo e travessia restaurados.'); },
    update(dt, time) {
      const error = THREE.MathUtils.euclideanModulo(yawGoal - moving.rotation.y + Math.PI, Math.PI * 2) - Math.PI;
      moving.rotation.y += error * (ctx.reduced ? 1 : Math.min(1, dt * 8));
      bridge2.rotation.y = moving.rotation.y;
      if (!ctx.reduced) obelisk.rotation.y = time * .35;
      if (aligned && !walked && nav.pos.z < -4.15) { walked = true; ctx.say('Travessia concluída. O portal em frente leva à Sala 2.'); }
      state.textContent = nav.pos.z < -12 ? (aligned2 ? 'Sala 2 · passarela aberta' : 'Sala 2 · passarela fechada') : (walked ? 'Travessia concluída' : aligned ? 'Passagem aberta' : 'Passagem fechada');
      viewpoint.material.opacity = ctx.reduced ? .85 : .62 + Math.sin(time * 1.6) * .22;
      portal.material.emissiveIntensity = ctx.reduced ? .71 : .63 + Math.sin(time * 1.45) * .21;
      hinge.rotation.y = moving.rotation.y;
      nav.zone(nav.pos.z < -4, () => audio.set(.12, nav.pos.z < -4 ? 620 : 355));
    }
  });
}
