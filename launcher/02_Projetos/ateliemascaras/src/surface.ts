import * as T from 'three/webgpu';
import { materials, type MaterialName, type Stroke } from './mask.ts';

export const textureSize = 1024;
const textureCache = new Map<MaterialName, [ImageData,ImageData,ImageData]>();
export function canvas(size = textureSize) {
  const el = document.createElement('canvas');
  el.width = el.height = size;
  return el;
}
export function random(seed: number) {
  return () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 4294967296;
  };
}
function maps(name: MaterialName) {
  const cached = textureCache.get(name);
  if (cached) return cached;
  const [hex, roughness, metalness, grain] = materials[name];
  const rgb = hex.match(/\w\w/g)!.map(c => parseInt(c,16));
  const rng = random(8181);
  const color = new ImageData(textureSize,textureSize);
  const pbr = new ImageData(textureSize,textureSize);
  const height = new Float32Array(textureSize*textureSize);
  for (let y=0;y<textureSize;y++) {
    for (let x=0;x<textureSize;x++) {
      const n = rng()-.5;
      const broad = Math.sin(x*.021 + Math.sin(y*.014)*2.4) * Math.cos(y*.036-x*.014);
      const mid = Math.sin(x*.115 + y*.096 + Math.sin(y*.028)*2)*Math.cos(x*.16-y*.09);
      const pores = rng()>.968 ? -rng() : 0;
      const fibers = name === 'Madeira' ? Math.sin(x*.083 + Math.sin(y*.009)*3+Math.sin(y*.026)*.8)*12 : 0;
      const variation = broad*6 + mid*4 + (n*22+pores*35)*grain + fibers;
      const pixel = y*textureSize+x;
      const index = pixel*4;
      for (let i=0;i<3;i++) color.data[index+i] = rgb[i]+variation*(1-i*.12);
      color.data[index+3] = pbr.data[index+3] = 255;
      pbr.data[index+1] = roughness*255 + variation*1.08;
      pbr.data[index+2] = metalness*255;
      height[pixel] = broad*.29 + mid*.25 + n*.095 + pores*.19 + fibers*.025;
    }
  }
  const normal = new ImageData(textureSize,textureSize);
  for (let y=0;y<textureSize;y++) {
    for (let x=0;x<textureSize;x++) {
      const pixel = y*textureSize+x;
      const dx = height[pixel]-height[y*textureSize+Math.min(x+1,textureSize-1)];
      const dy = height[Math.min(y+1,textureSize-1)*textureSize+x]-height[pixel];
      const index = pixel*4;
      normal.data.set([128+dx*140,128+dy*140,250,255],index);
    }
  }
  const result: [ImageData,ImageData,ImageData] = [color,pbr,normal];
  textureCache.set(name,result);
  return result;
}

export class Surface {
  private colorCanvas = canvas();
  private pbrCanvas = canvas();
  private normalCanvas = canvas();
  private color = this.colorCanvas.getContext('2d')!;
  private pbr = this.pbrCanvas.getContext('2d')!;
  private normal = this.normalCanvas.getContext('2d')!;
  private colorTexture = new T.CanvasTexture(this.colorCanvas);
  private pbrTexture = new T.CanvasTexture(this.pbrCanvas);
  private normalTexture = new T.CanvasTexture(this.normalCanvas);
  readonly material = new T.MeshStandardMaterial({
    map: this.colorTexture, roughnessMap: this.pbrTexture, metalnessMap: this.pbrTexture,
    normalMap: this.normalTexture, roughness: 1, metalness: 1, envMapIntensity: .6,
  });
  constructor() { this.colorTexture.colorSpace = T.SRGBColorSpace; }
  reset(material: MaterialName, strokes: Stroke[]) {
    const [color,pbr,normal] = maps(material);
    this.color.putImageData(color,0,0);
    this.pbr.putImageData(pbr,0,0);
    this.normal.putImageData(normal,0,0);
    const grain = materials[material][3];
    this.material.normalScale.setScalar(.17+grain*.78);
    for (const stroke of strokes) for (let i=0;i<stroke.dots.length;i++) this.draw(stroke,i);
    this.normalTexture.needsUpdate = true;
    this.upload();
  }
  draw(stroke: Stroke, index: number) {
    const [u,v] = stroke.dots[index];
    const [prevU,prevV] = stroke.dots[index-1] ?? [u,v];
    const radius = stroke.size * textureSize * .115;
    const distance = Math.hypot(u-prevU,v-prevV)*textureSize;
    const steps = Math.min(120,Math.max(1,Math.ceil(distance / Math.max(1,radius*.37))));
    const rng = random(index + 923);
    for (let step=1;step<=steps;step++) {
      const x = (prevU+(u-prevU)*step/steps)*textureSize;
      const y = (1-prevV-(v-prevV)*step/steps)*textureSize;
      const opacity = stroke.opacity * (stroke.texture === 'Seco' ? .54 : .78);
      const rough = stroke.finish === 'Fosco' ? 226 : stroke.finish === 'Esmalte' ? 48 : 83;
      const metal = stroke.finish === 'Folha metálica' ? 211 : 0;
      this.dab(this.color,x,y,radius,stroke.color,opacity,stroke.mix ? 'multiply' : 'source-over');
      this.dab(this.pbr,x,y,radius,`rgb(0,${rough},${metal})`,opacity,'source-over');
      if (stroke.texture !== 'Liso') {
        const count = stroke.texture === 'Granulado' ? 17 : 11;
        for (let i=0;i<count;i++) {
          const a = rng()*Math.PI*2;
          const d = Math.sqrt(rng()) * radius * 1.06;
          this.dab(this.color,x+Math.cos(a)*d,y+Math.sin(a)*d,radius*(.035+rng()*.11),stroke.color,opacity*.58,'source-over');
        }
      }
    }
  }
  upload() {
    this.colorTexture.needsUpdate = true;
    this.pbrTexture.needsUpdate = true;
  }
  private dab(ctx: CanvasRenderingContext2D,x: number,y: number,r: number,color: string,alpha: number,mode: GlobalCompositeOperation) {
    const grad = ctx.createRadialGradient(x,y,r*.37,x,y,r);
    grad.addColorStop(0,color);
    grad.addColorStop(1,'transparent');
    ctx.globalAlpha = alpha;
    ctx.globalCompositeOperation = mode;
    ctx.fillStyle = grad;
    ctx.fillRect(x-r,y-r,r*2,r*2);
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
  }
}
