import * as THREE from '../vendor/three.module.js';
import { MaterialFactory } from './materials.js';
import { mesh, profile, roundedBox } from './scene-details.js';

export { mesh, profile, roundedBox };

export function texture(width, height, draw, color = true) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  draw(canvas.getContext('2d'), width, height);
  const map = new THREE.CanvasTexture(canvas);
  if (color) map.colorSpace = THREE.SRGBColorSpace;
  map.anisotropy = 4;
  return map;
}

export function random(seed = 25) {
  let value = seed;
  return () => {
    value = (Math.imul(value, 1664525) + 1013904223) >>> 0;
    return value / 4294967296;
  };
}

export function wood(tint, roughness = 0.51, repeat = [1, 1]) {
  const material = MaterialFactory.wood(tint, roughness);
  material.map.repeat.set(...repeat);
  material.bumpScale = 0.008;
  return material;
}

export function stone(tint = 0xe9d3ac) {
  const map = texture(512, 512, (ctx, w, h) => {
    const rng = random(58);
    ctx.fillStyle = '#dbceb7';
    ctx.fillRect(0, 0, w, h);
    for (let i = 0; i < 32; i++) {
      const x = rng() * w, y = rng() * h, r = 20 + rng() * 85;
      const cloud = ctx.createRadialGradient(x, y, 0, x, y, r);
      cloud.addColorStop(0, i % 3 ? '#fcf3de92' : '#8c827847');
      cloud.addColorStop(1, '#d3c1a900');
      ctx.fillStyle = cloud;
      ctx.fillRect(x - r, y - r, r * 2, r * 2);
    }
    for (let line = 0; line < 17; line++) {
      const offset = (line - 4) * 56;
      ctx.beginPath();
      for (let u = 0; u <= w; u += 2) {
        const v = offset + u * 0.54 + Math.sin(u * .025 + line) * 10 + Math.sin(u * .076 + line) * 3;
        if (u === 0) ctx.moveTo(u, v); else ctx.lineTo(u, v);
      }
      ctx.strokeStyle = line % 3 ? '#61544747' : '#9c73535a';
      ctx.lineWidth = 0.4 + rng() * 2.1;
      ctx.stroke();
    }
  });
  map.wrapS = map.wrapT = THREE.RepeatWrapping;
  return new THREE.MeshPhysicalMaterial({ color: tint, map, roughness: .49, clearcoat: .43, clearcoatRoughness: .37, bumpMap: map, bumpScale: .005 });
}

export function brushed(color, roughness, metalness = .88) {
  const streaks = texture(256, 128, (ctx, w, h) => {
    const rng = random(87);
    ctx.fillStyle = '#dadada';
    ctx.fillRect(0, 0, w, h);
    for (let i = 0; i < 415; i++) {
      const x = rng() * w, y = rng() * h;
      ctx.fillStyle = i % 3 ? '#ffffff14' : '#33333316';
      ctx.fillRect(x, y, w * (.1 + rng() * .65), .36 + rng() * .62);
    }
  }, false);
  streaks.wrapS = streaks.wrapT = THREE.RepeatWrapping;
  return new THREE.MeshStandardMaterial({ color, roughness, metalness, roughnessMap: streaks, bumpMap: streaks, bumpScale: .0025 });
}

export function mineralWall(color) {
  const map = texture(256, 256, (ctx, w, h) => {
    const rng = random(79);
    const data = ctx.createImageData(w, h);
    const pixels = data.data;
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const value = 229 + Math.sin(x * .032 + Math.sin(y * .04) * 2.1) * 6
          + Math.sin((x + y) * .071) * 4 + (rng() - .5) * 13;
        const i = (x + y * w) * 4;
        pixels[i] = value;
        pixels[i + 1] = value;
        pixels[i + 2] = value;
        pixels[i + 3] = 255;
      }
    }
    ctx.putImageData(data, 0, 0);
  });
  map.wrapS = map.wrapT = THREE.RepeatWrapping;
  return new THREE.MeshStandardMaterial({ color, map, roughness: .93, bumpMap: map, bumpScale: .011 });
}

export function plate(parent, x, y, z, w, h, map, color = 0xffffff) {
  return mesh(parent, new THREE.PlaneGeometry(w, h),
    new THREE.MeshStandardMaterial({ map, color, roughness: .72, polygonOffset: true, polygonOffsetFactor: -1 }), x, y, z, false);
}

export function box(parent, material, x, y, z, w, h, d, radius = .014, shadow = true) {
  return mesh(parent, roundedBox(w, h, d, Math.min(radius, w * .35, h * .35, d * .35)), material, x, y, z, shadow);
}

export function tube(parent, material, positions, radius = .015, length = 28, radial = 9, castShadow = true) {
  const path = new THREE.CatmullRomCurve3(positions.map(point => new THREE.Vector3(...point)));
  return mesh(parent, new THREE.TubeGeometry(path, length, radius, radial, false), material, 0, 0, 0, castShadow);
}

export function contact(parent, x, z, width, depth, opacity = .4) {
  const map = texture(64, 64, (ctx) => {
    const shadow = ctx.createRadialGradient(32, 32, 3, 32, 32, 32);
    shadow.addColorStop(0, '#1c130e');
    shadow.addColorStop(.47, '#1c130e9d');
    shadow.addColorStop(1, '#1c130e00');
    ctx.fillStyle = shadow;
    ctx.fillRect(0, 0, 64, 64);
  });
  const material = new THREE.MeshBasicMaterial({ map, transparent: true, opacity, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -1 });
  const object = new THREE.Mesh(new THREE.PlaneGeometry(width, depth), material);
  object.rotation.x = -Math.PI / 2;
  object.position.set(x, .005, z);
  parent.add(object);
}

export function tableLabel(text, subtitle, background = '#e0ca9e', ink = '#3a261a') {
  return texture(256, 144, (ctx, w, h) => {
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = ink;
    ctx.lineWidth = 2;
    ctx.strokeRect(10, 10, w - 20, h - 20);
    ctx.strokeRect(14, 14, w - 28, h - 28);
    ctx.textAlign = 'center';
    ctx.fillStyle = ink;
    ctx.font = '24px Georgia';
    ctx.fillText(text, w / 2, 69, w - 41);
    ctx.font = '14px Georgia';
    ctx.fillText(subtitle, w / 2, 98, w - 32);
  });
}
