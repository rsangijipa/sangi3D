import * as THREE from 'three';

export const PALETTE = {
  sage: '#829477',
  terracotta: '#B86A4B',
  petrol: '#315E67',
  cream: '#F1E6D4',
  mustard: '#D3AC57',
  wood: '#775239',
  darkSage: '#2E3A28',
  warmWhite: '#FAF3E7'
} as const;

export const PIGMENT_COLORS = [
  { name: 'Azul Petróleo', hex: '#315E67' },
  { name: 'Turquesa', hex: '#4D8B93' },
  { name: 'Verde Sálvia', hex: '#829477' },
  { name: 'Mostarda', hex: '#D3AC57' },
  { name: 'Terracota', hex: '#B86A4B' },
  { name: 'Carmim Suave', hex: '#A94B4B' }
];

function makeCanvas(w: number, h: number): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const ctx = c.getContext('2d')!;
  return [c, ctx];
}

function seededNoise(x: number, y: number): number {
  const n = Math.sin(x * 127.1 + y * 311.7) * 43758.5453123;
  return n - Math.floor(n);
}

export function createWoodTextures(repeatX = 4, repeatY = 4): {
  map: THREE.CanvasTexture;
  roughnessMap: THREE.CanvasTexture;
  bumpMap: THREE.CanvasTexture;
} {
  const [c, ctx] = makeCanvas(512, 512);
  const [rc, rctx] = makeCanvas(512, 512);

  ctx.fillStyle = '#775239';
  ctx.fillRect(0, 0, 512, 512);
  rctx.fillStyle = '#a8a8a8';
  rctx.fillRect(0, 0, 512, 512);

  const planks = 6;
  const plankH = 512 / planks;
  for (let p = 0; p < planks; p++) {
    const y0 = p * plankH;
    const toneShift = (seededNoise(p, 3) - 0.5) * 26;
    const r = Math.min(255, Math.max(0, 119 + toneShift));
    const g = Math.min(255, Math.max(0, 82 + toneShift * 0.7));
    const b = Math.min(255, Math.max(0, 57 + toneShift * 0.5));
    ctx.fillStyle = `rgb(${r | 0},${g | 0},${b | 0})`;
    ctx.fillRect(0, y0, 512, plankH - 2);

    // Grain lines
    for (let i = 0; i < 42; i++) {
      const gy = y0 + seededNoise(p, i) * (plankH - 4);
      ctx.strokeStyle = i % 3 === 0 ? 'rgba(55,34,20,0.22)' : 'rgba(155,112,82,0.16)';
      ctx.lineWidth = 1 + seededNoise(i, p) * 2;
      ctx.beginPath();
      ctx.moveTo(0, gy);
      ctx.bezierCurveTo(170, gy + (seededNoise(i, 1) - 0.5) * 8, 340, gy + (seededNoise(i, 2) - 0.5) * 8, 512, gy);
      ctx.stroke();

      rctx.strokeStyle = 'rgba(190,190,190,0.2)';
      rctx.lineWidth = 1;
      rctx.beginPath();
      rctx.moveTo(0, gy);
      rctx.lineTo(512, gy);
      rctx.stroke();
    }

    // Plank seam
    ctx.fillStyle = 'rgba(38,22,12,0.75)';
    ctx.fillRect(0, y0 + plankH - 2, 512, 2);
    rctx.fillStyle = '#ffffff';
    rctx.fillRect(0, y0 + plankH - 2, 512, 2);
  }

  const map = new THREE.CanvasTexture(c);
  map.wrapS = map.wrapT = THREE.RepeatWrapping;
  map.repeat.set(repeatX, repeatY);
  map.encoding = THREE.sRGBEncoding;

  const roughnessMap = new THREE.CanvasTexture(rc);
  roughnessMap.wrapS = roughnessMap.wrapT = THREE.RepeatWrapping;
  roughnessMap.repeat.set(repeatX, repeatY);

  return { map, roughnessMap, bumpMap: roughnessMap };
}

export function createPlasterTextures(): {
  map: THREE.CanvasTexture;
  bumpMap: THREE.CanvasTexture;
} {
  const [c, ctx] = makeCanvas(512, 512);
  const [bc, bctx] = makeCanvas(512, 512);

  ctx.fillStyle = '#EFE3CF';
  ctx.fillRect(0, 0, 512, 512);
  bctx.fillStyle = '#808080';
  bctx.fillRect(0, 0, 512, 512);

  for (let i = 0; i < 400; i++) {
    const x = seededNoise(i, 11) * 512;
    const y = seededNoise(i, 23) * 512;
    const rad = 12 + seededNoise(i, 37) * 45;
    const warm = seededNoise(i, 41) > 0.5;
    ctx.fillStyle = warm ? 'rgba(225,205,178,0.10)' : 'rgba(255,248,236,0.12)';
    ctx.beginPath();
    ctx.arc(x, y, rad, 0, Math.PI * 2);
    ctx.fill();

    const g = (118 + seededNoise(i, 51) * 20) | 0;
    bctx.fillStyle = `rgba(${g},${g},${g},0.16)`;
    bctx.beginPath();
    bctx.arc(x, y, rad * 0.7, 0, Math.PI * 2);
    bctx.fill();
  }

  const map = new THREE.CanvasTexture(c);
  map.wrapS = map.wrapT = THREE.RepeatWrapping;
  map.repeat.set(3, 2);
  map.encoding = THREE.sRGBEncoding;

  const bumpMap = new THREE.CanvasTexture(bc);
  bumpMap.wrapS = bumpMap.wrapT = THREE.RepeatWrapping;
  bumpMap.repeat.set(3, 2);

  return { map, bumpMap };
}

export function createJuteRugTexture(): {
  map: THREE.CanvasTexture;
  bumpMap: THREE.CanvasTexture;
} {
  const [c, ctx] = makeCanvas(512, 512);
  const [bc, bctx] = makeCanvas(512, 512);

  ctx.fillStyle = '#C6A982';
  ctx.fillRect(0, 0, 512, 512);
  bctx.fillStyle = '#808080';
  bctx.fillRect(0, 0, 512, 512);

  const cx = 256;
  const cy = 256;
  for (let r = 8; r < 252; r += 6) {
    const shade = (seededNoise(r, 7) - 0.5) * 20;
    ctx.strokeStyle = `rgb(${(194 + shade) | 0},${(164 + shade) | 0},${(122 + shade) | 0})`;
    ctx.lineWidth = 4.5;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();

    bctx.strokeStyle = r % 12 === 0 ? '#a8a8a8' : '#646464';
    bctx.lineWidth = 3;
    bctx.beginPath();
    bctx.arc(cx, cy, r, 0, Math.PI * 2);
    bctx.stroke();
  }

  const map = new THREE.CanvasTexture(c);
  map.encoding = THREE.sRGBEncoding;
  const bumpMap = new THREE.CanvasTexture(bc);
  return { map, bumpMap };
}

export function createCanvasWeaveTexture(): THREE.CanvasTexture {
  const [c, ctx] = makeCanvas(256, 256);
  ctx.fillStyle = '#888888';
  ctx.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 256; i += 4) {
    ctx.fillStyle = i % 8 === 0 ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)';
    ctx.fillRect(i, 0, 2, 256);
    ctx.fillRect(0, i, 256, 2);
  }
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(8, 6);
  return tex;
}

export function createSandGrainTexture(): THREE.CanvasTexture {
  const [c, ctx] = makeCanvas(256, 256);
  const img = ctx.createImageData(256, 256);
  for (let i = 0; i < img.data.length; i += 4) {
    const n = seededNoise(i * 0.17, i * 0.31);
    const v = (212 + (n - 0.5) * 38) | 0;
    img.data[i] = v;
    img.data[i + 1] = (v - 14) | 0;
    img.data[i + 2] = (v - 42) | 0;
    img.data[i + 3] = 255;
  }
  ctx.putImageData(img, 0, 0);
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(5, 5);
  tex.encoding = THREE.sRGBEncoding;
  return tex;
}

export function createSoftGlowTexture(): THREE.CanvasTexture {
  const [c, ctx] = makeCanvas(128, 128);
  const g = ctx.createRadialGradient(64, 64, 4, 64, 64, 64);
  g.addColorStop(0, 'rgba(255,244,218,0.95)');
  g.addColorStop(0.45, 'rgba(255,232,190,0.35)');
  g.addColorStop(1, 'rgba(255,232,190,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 128, 128);
  const tex = new THREE.CanvasTexture(c);
  return tex;
}
