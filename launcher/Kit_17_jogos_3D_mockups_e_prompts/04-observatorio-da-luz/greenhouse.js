import * as THREE from '/shared/vendor/three.module.js';
import { MaterialFactory } from '/shared/engine/materials.js';
import { beam, makePlant, mesh, profile, roundedBox } from '/shared/engine/scene-details.js';

function paintedSky() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const context = canvas.getContext('2d');
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  const presets = {
    sunset: ['#626b8b', '#c58273', '#ffc081', '#b8977d'],
    dawn: ['#697d97', '#d5a7a1', '#ffdaaf', '#b5afa0'],
    diffuse: ['#8299a3', '#b5c4c7', '#e1dcce', '#bfc7b7'],
    night: ['#14223b', '#27374f', '#635b72', '#505367'],
  };
  function update(preset) {
    const palette = presets[preset];
    const gradient = context.createLinearGradient(0, 0, 0, 256);
    for (const [i, stop] of [0, .47, .62, 1].entries()) gradient.addColorStop(stop, palette[i]);
    context.fillStyle = gradient;
    context.fillRect(0, 0, 512, 256);
    if (preset !== 'diffuse') {
      const x = preset === 'dawn' ? 337 : 178;
      const y = preset === 'night' ? 107 : 153;
      const halo = context.createRadialGradient(x, y, 0, x, y, 90);
      halo.addColorStop(0, preset === 'night' ? '#ede1d3aa' : '#fff1becd');
      halo.addColorStop(1, '#ffd19b00');
      context.fillStyle = halo;
      context.fillRect(0, 0, 512, 256);
      context.beginPath();
      context.arc(x, y, preset === 'night' ? 5 : 10, 0, 2 * Math.PI);
      context.fillStyle = preset === 'night' ? '#e5dcd2' : '#fff0ca';
      context.fill();
    }
    texture.needsUpdate = true;
  }
  update('sunset');
  return { texture, update };
}

export function buildGreenhouse(scene) {
  const greenhouse = new THREE.Group();
  scene.add(greenhouse);
  const oak = MaterialFactory.wood(0x9f6843, .57);
  const walnut = MaterialFactory.wood(0x6b422d, .71);
  const clay = new THREE.MeshStandardMaterial({ color: 0xb67450, roughness: .92 });
  const ceramic = new THREE.MeshPhysicalMaterial({ color: 0xd1b792, roughness: .53, clearcoat: .24 });
  const brass = MaterialFactory.brass(.31, .87);
  brass.color.setHex(0xc19b5f);
  const floor = new THREE.InstancedMesh(new THREE.BoxGeometry(9.7, .11, .232), oak, 37);
  const plank = new THREE.Object3D();
  const color = new THREE.Color();
  for (let i = 0; i < floor.count; i++) {
    plank.position.set(0, -.055, -.96 + (i - 18) * .24);
    plank.updateMatrix();
    floor.setMatrixAt(i, plank.matrix);
    floor.setColorAt(i, color.setRGB(.72 + .23 * Math.sin(i * 2.71) ** 2, .68 + .25 * Math.sin(i * 2.71) ** 2, .62 + .26 * Math.sin(i * 2.71) ** 2));
  }
  floor.receiveShadow = true;
  greenhouse.add(floor);

  const sky = paintedSky();
  const skyMaterial = new THREE.MeshBasicMaterial({ map: sky.texture, toneMapped: false, fog: false });
  mesh(greenhouse, new THREE.PlaneGeometry(50, 22), skyMaterial, 0, 5.7, -27, false);
  const ground = mesh(greenhouse, new THREE.PlaneGeometry(44, 38),
    new THREE.MeshStandardMaterial({ color: 0x46513b, roughness: 1 }), 0, -.17, -12, false);
  ground.rotation.x = -Math.PI / 2;

  // Layered crowns sit behind the glazing, with clear gaps for the sky.
  const crown = new THREE.SphereGeometry(1, 13, 9);
  const crownPositions = crown.getAttribute('position');
  for (let i = 0; i < crownPositions.count; i++) {
    const x = crownPositions.getX(i);
    const y = crownPositions.getY(i);
    const z = crownPositions.getZ(i);
    const contour = 1 + .13 * Math.sin(7 * x + 3 * y) * Math.cos(8 * z + 5 * y);
    crownPositions.setXYZ(i, x * contour, y * contour, z * contour);
  }
  crown.computeVertexNormals();
  const foliage = new THREE.InstancedMesh(crown, new THREE.MeshStandardMaterial({ roughness: .98 }), 738);
  const branch = new THREE.MeshStandardMaterial({ color: 0x4d3b2c, roughness: .95 });
  const dummy = new THREE.Object3D();
  let index = 0;
  for (let i = 0; i < 18; i++) {
    const x = (i - 8.5) * 1.43;
    const z = -7.2 - (i % 5) * 1.37;
    const h = 1.35 + Math.abs(Math.sin(i * 1.87)) * 4.6;
    beam(greenhouse, [x, -.2, z], [x + .17, h - .25, z], .10, .12, branch, false);
    for (let j = 0; j < 27; j++) {
      const angle = j * 2.39996 + i;
      const spread = .24 + Math.sin(j * 1.94) ** 2;
      dummy.position.set(x + Math.sin(angle) * spread, h + Math.sin(j * 1.94) * .91, z + Math.cos(angle) * spread);
      dummy.scale.set(.37 + .23 * Math.sin(j + i) ** 2, .43 + .36 * Math.cos(j * 2.6) ** 2, .41);
      dummy.rotation.set(j, angle, i);
      dummy.updateMatrix();
      foliage.setMatrixAt(index, dummy.matrix);
      foliage.setColorAt(index++, color.setHSL(.17 + .12 * Math.sin(i * 2 + j) ** 2, .22 + .13 * Math.sin(i) ** 2, .21 + .14 * Math.cos(i + j) ** 2));
    }
  }
  while (index < foliage.count) {
    const i = index - 486;
    const x = ((i * 43) % 131) * .23 - 15;
    const z = -5.3 - (i % 23) * .51;
    dummy.position.set(x, .12 + .47 * Math.sin(i * 3.58) ** 2, z);
    dummy.rotation.set(i, .67 * i, i * .35);
    dummy.scale.set(.26 + .50 * Math.sin(i) ** 2, .46 + .29 * Math.sin(i * 5) ** 2, .48);
    dummy.updateMatrix();
    foliage.setMatrixAt(index++, dummy.matrix);
    foliage.setColorAt(index - 1, color.setHSL(.19 + .08 * Math.sin(i) ** 2, .30, .14 + .16 * Math.sin(i * 15) ** 2));
  }
  greenhouse.add(foliage);

  const back = -4.6;
  const eaves = 3.6;
  const ridge = 5.08;
  const side = 4.65;
  const glaze = new THREE.MeshPhysicalMaterial({
    color: 0xb0c3ae, side: THREE.DoubleSide, roughness: .2, metalness: .18,
    transparent: true, opacity: .075, depthWrite: false,
  });
  const pane = new THREE.PlaneGeometry(2.26, 3.18);
  for (let bay = 0; bay < 4; bay++) {
    const left = -side + bay * side / 2;
    mesh(greenhouse, pane, glaze, left + side / 4, 1.83, back - .02, false);
    beam(greenhouse, [left, .02, back], [left, eaves, back], .17, .19, walnut);
    beam(greenhouse, [left, eaves, back], [left + side / 2, eaves, back], .18, .19, walnut);
    beam(greenhouse, [left, 1.02, back], [left + side / 2, 1.02, back], .115, .16, oak);
  }
  beam(greenhouse, [side, .02, back], [side, eaves, back], .18, .19, walnut);
  for (const x of [-side, side]) {
    for (const z of [-4.6, -2.4, -.2, 2]) {
      beam(greenhouse, [x, 0, z], [x, eaves, z], .17, .18, walnut);
    }
    beam(greenhouse, [x, eaves, back], [x, eaves, 2.15], .18, .19, walnut);
    beam(greenhouse, [x, .13, back], [x, .13, 2.15], .23, .24, walnut);
    for (const z of [-4.6, -2.4, -.2, 2]) {
      beam(greenhouse, [x, eaves, z], [0, ridge, z], .165, .19, walnut);
    }
  }
  beam(greenhouse, [0, ridge, back], [0, ridge, 2.15], .2, .2, walnut);
  for (const sign of [-1, 1]) {
    const glassRoof = mesh(greenhouse, new THREE.PlaneGeometry(4.84, 6.75), glaze,
      sign * side / 2, (eaves + ridge) / 2, -1.22, false);
    glassRoof.rotation.set(-Math.PI / 2, 0, -sign * Math.atan2(ridge - eaves, side));
  }

  const blindSlats = { A: [], B: [] };
  const slat = roundedBox(3, .042, .17, .016);
  for (let i = 0; i < 15; i++) {
    const blade = mesh(greenhouse, slat, oak, -3.85, 1.1 + i * .157, -2.25);
    blade.rotation.order = 'YXZ';
    blade.rotation.y = Math.PI / 2;
    blindSlats.A.push(blade);
    const rightBlade = mesh(greenhouse, slat, oak, 3.85, blade.position.y, -2.25);
    rightBlade.rotation.order = 'YXZ';
    rightBlade.rotation.y = -Math.PI / 2;
    blindSlats.B.push(rightBlade);
  }
  for (const z of [-3.63, -.87]) beam(greenhouse, [-3.84, 1.03, z], [-3.84, 3.43, z], .012, .012, walnut);

  const table = profile([[0, 1.10], [1.45, 1.10], [1.53, 1.094], [1.57, 1.066], [1.57, .994],
    [1.54, .967], [1.4, .957], [0, .957]].reverse(), 84);
  const uv = table.getAttribute('uv');
  const vertices = table.getAttribute('position');
  for (let i = 0; i < uv.count; i++) uv.setXY(i, (vertices.getX(i) + 1.57) / 3.14, (vertices.getZ(i) + 1.57) / 3.14);
  mesh(greenhouse, table, MaterialFactory.wood(0xaf754c, .66), 0, .04, 0);
  mesh(greenhouse, new THREE.CylinderGeometry(1.33, 1.28, .095, 64), walnut, 0, .957, 0);
  for (let i = 0; i < 4; i++) {
    const angle = Math.PI * (.25 + i * .5);
    const x = Math.cos(angle), z = Math.sin(angle);
    beam(greenhouse, [x * 1.34, .008, z * 1.34], [x * .99, 1, z * .99], .15, .17, walnut);
  }

  const rugMaterial = MaterialFactory.wood(0x777052, .97);
  rugMaterial.map.repeat.set(4, 5);
  rugMaterial.bumpScale = .022;
  mesh(greenhouse, new THREE.CylinderGeometry(2.2, 2.21, .022, 64), rugMaterial, .25, .011, .30, false);
  const seam = mesh(greenhouse, new THREE.TorusGeometry(2.13, .022, 6, 80),
    new THREE.MeshStandardMaterial({ color: 0x8d805c, roughness: .95 }), .25, .027, .30, false);
  seam.rotation.x = Math.PI / 2;

  const shelf = roundedBox(1.85, .085, .58, .025);
  for (const y of [.15, .74, 1.26]) mesh(greenhouse, shelf, oak, -2.87, y, -1.45);
  for (const x of [-3.78, -1.95]) mesh(greenhouse, roundedBox(.08, 1.25, .58, .028), walnut, x, .64, -1.45);
  const bookColors = [0x315048, 0x7b5740, 0x7a784d, 0x7a4637, 0xb69a72];
  for (let i = 0; i < 9; i++) {
    const cover = new THREE.MeshStandardMaterial({ color: bookColors[i % bookColors.length], roughness: .75 });
    const h = .26 + .22 * Math.sin(i + 1) ** 2;
    mesh(greenhouse, roundedBox(.09, h, .32, .016), cover, -3.57 + i * .126, .20 + h / 2, -1.37);
  }
  makePlant(greenhouse, -3.47, -1.53, .57, 1, clay, 1.305);
  makePlant(greenhouse, 2.31, -2.6, 1.2, 4, ceramic);
  makePlant(greenhouse, -2.72, -3.58, 1.29, 7, clay);
  makePlant(greenhouse, 3.44, -3.85, 1.36, 13, clay);

  const lamp = new THREE.Group();
  lamp.position.set(-2.56, 1.30, -1.43);
  greenhouse.add(lamp);
  mesh(lamp, profile([[0, 0], [.16, 0], [.18, .036], [.13, .24], [.08, .37], [0, .37]]), ceramic, 0, 0, 0);
  const shade = new THREE.MeshPhysicalMaterial({ color: 0xffdb9e, emissive: 0xef9d4c, emissiveIntensity: .37, roughness: .78 });
  mesh(lamp, profile([[.30, .29], [.312, .32], [.30, .39], [.24, .48], [.12, .545], [0, .566]]), shade, 0, 0, 0, false);
  const lampLight = new THREE.PointLight(0xffc487, 5, 3.8, 2);
  lampLight.position.y = .295;
  lamp.add(lampLight);

  const paper = MaterialFactory.paper(0xf3e4c9);
  mesh(greenhouse, roundedBox(.68, .035, .58, .014), walnut, .08, 1.152, .84);
  mesh(greenhouse, roundedBox(.62, .012, .53, .004), paper, .08, 1.175, .84);
  mesh(greenhouse, roundedBox(.23, .025, .06, .01), brass, .08, 1.19, .59);
  const trackMaterial = new THREE.MeshStandardMaterial({ color: 0x775d40, roughness: .76 });
  const knobMaterial = new THREE.MeshStandardMaterial({ color: 0xddba81, roughness: .46 });
  const deskSliders = [
    { key: 'intensity', min: 0, max: 100, z: .78 },
    { key: 'warmth', min: 2200, max: 6500, z: .965 },
  ].map(({ key, min, max, z }) => {
    const track = mesh(greenhouse, roundedBox(.43, .012, .040, .005), trackMaterial, .08, 1.184, z, false);
    const knob = mesh(greenhouse, new THREE.CylinderGeometry(.033, .035, .018, 24), knobMaterial, .08, 1.201, z);
    return { key, min, max, track, knob };
  });
  const pencil = mesh(greenhouse, new THREE.CylinderGeometry(.014, .014, .34, 6),
    new THREE.MeshStandardMaterial({ color: 0x35584f, roughness: .6 }), -.34, 1.16, .83);
  pencil.rotation.set(Math.PI / 2, 0, .33);
  makePlant(greenhouse, 1.13, .58, .39, 9, ceramic, 1.14);
  const cushion = new THREE.MeshPhysicalMaterial({ color: 0x77744c, roughness: .95, sheen: .8, sheenColor: 0x715f42 });
  const stool = mesh(greenhouse, roundedBox(1.49, .35, .91, .14), walnut, 2.88, .26, -.67);
  mesh(stool, roundedBox(1.42, .22, .88, .095), cushion, 0, .254, 0);
  const pillow = mesh(stool, roundedBox(.60, .55, .28, .11),
    new THREE.MeshPhysicalMaterial({ color: 0xc9ad8e, roughness: .93, sheen: .71 }), .26, .58, -.1);
  pillow.rotation.set(-.24, -.08, -.18);
  return { greenhouse, sky, blindSlats, lampLight, brass, deskSliders };
}

export function makeOpticalPanel(parent, x, tint, brass) {
  const panel = new THREE.Group();
  panel.position.set(x, 1.14, -.10);
  parent.add(panel);
  const glass = new THREE.MeshPhysicalMaterial({
    color: tint, roughness: .16, metalness: .16, clearcoat: .8, clearcoatRoughness: .11,
    transparent: true, opacity: .72, depthWrite: false,
  });
  const finish = new THREE.MeshPhysicalMaterial({ color: tint, emissive: tint, emissiveIntensity: .32, roughness: .35, metalness: .12 });
  const plate = mesh(panel, roundedBox(.71, 1.0, .047, .019), finish, 0, .66, -.041, false);
  mesh(panel, roundedBox(.71, 1.0, .026, .010), glass, 0, .66, .001, false);
  const rib = new THREE.CylinderGeometry(.0165, .0165, .972, 7);
  const ribs = new THREE.InstancedMesh(rib, glass, 23);
  const placement = new THREE.Matrix4();
  for (let i = 0; i < ribs.count; i++) ribs.setMatrixAt(i, placement.makeTranslation((i - 11) * .0294, .66, .029));
  panel.add(ribs);
  for (const sign of [-1, 1]) {
    mesh(panel, roundedBox(.050, 1.07, .071, .019), brass, sign * .369, .66, 0);
    mesh(panel, roundedBox(.735, .050, .071, .019), brass, 0, .66 + sign * .51, 0);
    const hinge = mesh(panel, new THREE.CylinderGeometry(.051, .051, .052, 18), brass, sign * .41, .64, 0);
    hinge.rotation.z = Math.PI / 2;
  }
  mesh(panel, profile([[0, 0], [.24, 0], [.25, .015], [.25, .052], [.234, .064], [.074, .066],
    [.068, .157], [.09, .168], [0, .168]]), brass, 0, 0, 0);
  const light = new THREE.SpotLight(tint, 8, 3.5, Math.PI / 3.3, .72, 2);
  light.position.set(0, .48, .12);
  light.target.position.set(0, -.17, 1.18);
  panel.add(light, light.target);
  return { panel, glass, finish: plate.material, light };
}
