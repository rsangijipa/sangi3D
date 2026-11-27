import * as THREE from '../vendor/three.module.js';
import { MaterialFactory } from './materials.js';
import { beam, makePlant, mesh, profile, roundedBox } from './scene-details.js';

export function buildWorkshop(workshop) {
  const oak = MaterialFactory.wood(0xb78756, .62);
  const trim = MaterialFactory.wood(0x8b5f3c, .63);
  const plaster = new THREE.MeshStandardMaterial({ color: 0xbca187, roughness: .98 });
  const clay = new THREE.MeshStandardMaterial({ color: 0xc9b398, roughness: .77 });
  const brass = MaterialFactory.brass(.35);
  mesh(workshop, new THREE.BoxGeometry(18, 7, .2), plaster, 0, 2.7, -3.4);
  mesh(workshop, new THREE.BoxGeometry(13, .2, 10), trim, 0, -.16, -.75, false);
  mesh(workshop, roundedBox(6.5, .14, 3.18, .055), oak, 0, .99, 0);
  mesh(workshop, roundedBox(6.15, .28, 2.95, .045), trim, 0, .80, 0);
  for (const x of [-2.84, 2.84]) {
    for (const z of [-1.28, 1.28]) mesh(workshop, roundedBox(.23, .84, .23, .05), trim, x, .42, z);
  }

  const window = new THREE.Group();
  window.position.set(-3.08, 2.4, -3.26);
  workshop.add(window);
  const view = document.createElement('canvas');
  view.width = view.height = 256;
  const context = view.getContext('2d');
  const sky = context.createLinearGradient(0, 0, 0, 256);
  sky.addColorStop(0, '#d1e0ce');
  sky.addColorStop(.55, '#fcf1c8');
  sky.addColorStop(1, '#8e9766');
  context.fillStyle = sky;
  context.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 90; i++) {
    const x = 128 + Math.sin(i * 8.78) * 152;
    const y = 256 - Math.sin(i * .71) ** 2 * 203;
    const size = 11 + 29 * Math.cos(i * .41) ** 2;
    const glow = context.createRadialGradient(x, y, 0, x, y, size);
    glow.addColorStop(0, i % 4 ? '#697d52a0' : '#fff9cbc7');
    glow.addColorStop(1, '#82916d00');
    context.fillStyle = glow;
    context.fillRect(x - size, y - size, size * 2, size * 2);
  }
  const texture = new THREE.CanvasTexture(view);
  texture.colorSpace = THREE.SRGBColorSpace;
  mesh(window, new THREE.PlaneGeometry(2.14, 2.82),
    new THREE.MeshBasicMaterial({ map: texture, toneMapped: false }), 0, 0, 0, false);
  for (const x of [-1.08, -.36, .36, 1.08]) mesh(window, new THREE.BoxGeometry(.083, 2.94, .11), oak, x, 0, .075);
  for (const y of [-1.42, -.46, .50, 1.42]) mesh(window, new THREE.BoxGeometry(2.23, .084, .11), oak, 0, y, .075);
  mesh(window, roundedBox(2.31, .105, .36, .035), trim, 0, -1.48, .16);
  makePlant(window, -.67, .23, .52, 2, clay, -1.426);

  for (const y of [1.47, 2.64, 3.72]) {
    mesh(workshop, roundedBox(3.18, .11, .57, .032), oak, 2.48, y, -2.99);
    for (const x of [1.17, 3.8]) beam(workshop, [x, y - .29, -3.21], [x, y - .05, -2.79], .07, .09, trim);
  }
  const palette = [0x826a46, 0x634d37, 0x52634d, 0xb0875c, 0x9a6249];
  for (let i = 0; i < 8; i++) {
    const h = .27 + .32 * Math.sin(i * 1.4 + .5) ** 2;
    const cover = new THREE.MeshStandardMaterial({ color: palette[i % palette.length], roughness: .82 });
    mesh(workshop, roundedBox(.14, h, .34, .017), cover, 2.21 + .178 * i, 3.77 + h / 2, -2.86);
  }
  for (const [x, y, radius, angle] of [[2.77, 1.55, .25, .6], [1.44, 2.71, .31, .1], [3.74, 2.71, .21, .8]]) {
    const instrument = new THREE.Group();
    instrument.position.set(x, y + radius, -2.9);
    workshop.add(instrument);
    makeDial(instrument, radius, trim, brass);
    for (const [length, a] of [[.65, angle], [.43, -.74]]) {
      const hand = mesh(instrument, new THREE.BoxGeometry(radius * .035, radius * length, .012), trim, 0, 0, .137);
      hand.rotation.z = a;
      hand.translateY(radius * length / 2);
    }
  }
  makePlant(workshop, 3.78, -2.72, .55, 5, clay, 1.53);
  return { oak, trim, clay, brass };
}

export function makeDial(parent, radius, wood, brass) {
  const geometry = profile([[0, -.10], [.95 * radius, -.10], [radius, -.076], [radius, .05],
    [.975 * radius, .088], [.932 * radius, .102], [.898 * radius, .086], [.874 * radius, .051],
    [.874 * radius, .016], [0, .016]], 92);
  const rim = mesh(parent, geometry, wood, 0, 0, 0);
  rim.rotation.x = Math.PI / 2;
  const ring = mesh(parent, new THREE.TorusGeometry(radius * .875, radius * .009, 8, 80), brass, 0, 0, .062);
  ring.castShadow = false;
  const faceCanvas = document.createElement('canvas');
  faceCanvas.width = faceCanvas.height = 512;
  const context = faceCanvas.getContext('2d');
  const texture = new THREE.CanvasTexture(faceCanvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  function draw(minutes) {
    const paper = context.createRadialGradient(227, 202, 65, 256, 256, 265);
    paper.addColorStop(0, '#fff5df');
    paper.addColorStop(1, '#d5bb91');
    context.fillStyle = paper;
    context.fillRect(0, 0, 512, 512);
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillStyle = '#283d2d';
    context.strokeStyle = '#574d3a';
    for (let i = 0; i < 60; i++) {
      const a = i * Math.PI / 30;
      const x = Math.sin(a), y = -Math.cos(a);
      const main = i % 5 === 0;
      const length = main ? 214 : 225;
      context.beginPath();
      context.lineWidth = main ? 3.5 : 1.4;
      context.moveTo(256 + x * 239, 256 + y * 239);
      context.lineTo(256 + x * length, 256 + y * length);
      context.stroke();
      if (main) {
        context.font = 'bold 35px Georgia';
        const value = minutes ? Math.round((i || 60) * minutes / 60) : (i / 5 || 12);
        context.fillText(String(value), 256 + x * 181, 258 + y * 181);
      }
    }
    context.font = '600 16px sans-serif';
    if (minutes) context.fillText('MINUTOS', 256, 314);
    texture.needsUpdate = true;
  }
  draw(0);
  mesh(parent, new THREE.CircleGeometry(radius * .881, 88),
    new THREE.MeshStandardMaterial({ map: texture, roughness: .88 }), 0, 0, .065, false);
  return draw;
}

export function makeBackpack(group, trim, brass) {
  const cloth = document.createElement('canvas');
  cloth.width = cloth.height = 32;
  const ctx = cloth.getContext('2d');
  ctx.fillStyle = '#858585';
  ctx.fillRect(0, 0, 32, 32);
  for (let y = 0; y < 32; y += 4) {
    for (let x = 0; x < 32; x += 4) {
      ctx.fillStyle = (x + y) % 8 ? '#b1b1b1' : '#656565';
      ctx.fillRect(x, y, 3, 3);
    }
  }
  const weave = new THREE.CanvasTexture(cloth);
  weave.wrapS = weave.wrapT = THREE.RepeatWrapping;
  weave.repeat.set(14, 14);
  const canvas = new THREE.MeshPhysicalMaterial({
    color: 0x536448, sheen: .85, sheenColor: 0x596e46, roughness: .94,
    bumpMap: weave, bumpScale: .009
  });
  mesh(group, roundedBox(1.02, .84, .60, .17), canvas, 0, 0, 0);
  mesh(group, roundedBox(.73, .38, .17, .075), canvas, 0, -.125, .317);
  for (const x of [-.28, .28]) {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(x, .33, -.19), new THREE.Vector3(x, .15, -.49),
      new THREE.Vector3(x, -.19, -.46), new THREE.Vector3(x, -.35, -.23)
    ]);
    mesh(group, new THREE.TubeGeometry(curve, 16, .045, 9, false), trim, 0, 0, 0);
  }
  const flap = new THREE.Group();
  flap.position.set(0, .35, .26);
  group.add(flap);
  mesh(flap, roundedBox(.97, .40, .10, .043), canvas, 0, -.15, 0);
  mesh(flap, roundedBox(.11, .28, .035, .016), trim, 0, -.28, .06);
  mesh(flap, roundedBox(.14, .085, .03, .013), brass, 0, -.35, .078);
  return flap;
}
