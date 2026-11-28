import * as T from 'three';
import { bronzeSampler, fabricSampler, hammeredSampler, makeTexSet, pbrMaterial, stoneSampler, withRepeat, woodSampler } from './core/pbr';
import { canvasTexture } from './core/model';
import { rng } from './core/noise';

export function materials() {
  const wood = makeTexSet({ size: 512, aniso: 4, sample: woodSampler({ light: '#9b643d', dark: '#45291e', seed: 19 }) });
  const floorSet = makeTexSet({ size: 512, aniso: 4, sample: stoneSampler('#70594b', '#392f38', 8, 0) });
  const cloth = makeTexSet({ size: 512, aniso: 4, sample: fabricSampler('#655b36', 8, 116) });
  const brassSet = makeTexSet({ size: 256, aniso: 4, sample: bronzeSampler(43) });
  const darkMetalSet = makeTexSet({ size: 256, aniso: 4, sample: hammeredSampler('#49312a', 31) });
  return {
    oak: pbrMaterial(wood, { roughness: .86 }),
    trim: pbrMaterial(wood, { color: '#aa7951', roughness: .72 }),
    floor: pbrMaterial(withRepeat(floorSet, 4, 4), { roughness: .87 }, .46),
    stone: pbrMaterial(floorSet, { color: '#987e6a', roughness: .95 }),
    felt: pbrMaterial(cloth, { roughness: .97 }),
    brass: pbrMaterial(brassSet, { metalness: .76, roughness: .42 }),
    brownMetal: pbrMaterial(darkMetalSet, { metalness: .53, roughness: .57 }),
    cream: new T.MeshStandardMaterial({ color: '#d8bc92', roughness: .91 }),
    thread: new T.MeshStandardMaterial({ color: '#9f8250', roughness: 1 }),
    pot: new T.MeshStandardMaterial({ color: '#956447', roughness: .84 }),
  };
}
export type Materials = ReturnType<typeof materials>;

export function softLight(color: string) {
  return canvasTexture(128, 128, ctx => {
    const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    gradient.addColorStop(0, color);
    gradient.addColorStop(.36, color);
    gradient.addColorStop(1, 'transparent');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 128, 128);
  });
}

export function rugMaterial() {
  const map = canvasTexture(768, 768, ctx => {
    const random = rng(420);
    ctx.fillStyle = '#aa774e';
    ctx.fillRect(0, 0, 768, 768);
    for (let radius = 1; radius < 384; radius += 2.15) {
      const count = Math.max(5, Math.floor(radius * 3.25));
      for (let j = 0; j < count; j++) {
        const angle = j / count * Math.PI * 2 + radius * .08;
        const value = 57 + random() * 18 - (radius > 361 && radius < 372 ? 12 : 0);
        ctx.strokeStyle = `hsl(${31 + random() * 7} 37% ${value}%)`;
        ctx.beginPath();
        ctx.moveTo(384 + Math.cos(angle) * radius, 384 + Math.sin(angle) * radius);
        ctx.lineTo(384 + Math.cos(angle + .008) * (radius + 1.6), 384 + Math.sin(angle + .008) * (radius + 1.6));
        ctx.stroke();
      }
    }
  });
  return new T.MeshStandardMaterial({ map, bumpMap: map, bumpScale: .017, roughness: 1 });
}

