import * as T from 'three/webgpu';

export const forms = ['Humana', 'Abstrata', 'Teatral'] as const;
export const features = ['Testa', 'Sobrancelhas', 'Olhos', 'Nariz', 'Maçãs do rosto', 'Boca', 'Queixo', 'Contorno'] as const;
export const materials = {
  Argila: ['#caa78b', .91, 0, .55],
  Porcelana: ['#f4e8d8', .23, 0, .13],
  Madeira: ['#9a5935', .71, 0, .7],
  'Papel machê': ['#e4cfad', .97, 0, .67],
  Gesso: ['#ead8c1', .86, 0, .43],
  Metal: ['#ceaa69', .39, .84, .35],
} as const;
export type MaterialName = keyof typeof materials;
export const decorations = ['Flor', 'Fita', 'Pena', 'Cerâmica', 'Pedra', 'Linha', 'Tecido', 'Abstrata'] as const;
export type Decoration = typeof decorations[number];
export const tools = ['Puxar', 'Pressionar', 'Inflar', 'Suavizar', 'Entalhar', 'Deformar'] as const;
export type Tool = typeof tools[number];
export const finishes = ['Fosco', 'Esmalte', 'Folha metálica'] as const;
export type Finish = typeof finishes[number];
export type Side = 0 | 1;
export type Dot = [number, number];
export interface Stroke {
  dots: Dot[];
  color: string;
  size: number;
  opacity: number;
  texture: string;
  finish: Finish;
  mix: boolean;
}
export interface Ornament { kind: Decoration; vertex: number; side: Side; color: string; size: number }
export interface MaskState {
  form: typeof forms[number];
  morph: number[];
  edits: [Float32Array, Float32Array];
  material: [MaterialName, MaterialName];
  paint: [Stroke[], Stroke[]];
  ornaments: Ornament[];
}
const columns = 120;
const rows = 136;
export const vertexCount = (columns + 1) * (rows + 1);
export const makeMask = (): MaskState => ({
  form: 'Humana', morph: features.map(() => 0),
  edits: [new Float32Array(vertexCount * 2), new Float32Array(vertexCount * 2)],
  material: ['Gesso', 'Argila'], paint: [[], []], ornaments: [],
});
const idx = (i: number, j: number) => j * (columns + 1) + i;
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const bell = (x: number, y: number, a: number, b: number) => Math.exp(-((x / a) ** 2 + (y / b) ** 2));
const smooth = (v: number) => v * v * (3 - 2 * v);
const holes = [34, 86].map(i => ({ i, j: 81, w: 16, h: 7 }));
const profile = [
  [[.25,.42],[.33,.58],[.30,.86],[.49,1.09],[.65,1.03]],
  [[.29,.33],[.47,.58],[.70,.78],[.82,.77]],
  [[.34,.30],[.53,.51],[.76,.58],[.87,.51]],
  [[.42,-.30],[.65,-.27],[.79,-.30],[.92,-.17],[.94,.10]],
  [[.35,-.34],[.54,-.44],[.57,-.66],[.44,-.86],[.26,-1.00]],
  [[.51,-.36],[.68,-.47],[.66,-.66],[.52,-.85]],
].map(points => new T.CatmullRomCurve3(points.map(([x,y]) => new T.Vector3(x,y,0))).getPoints(56));

const indices: number[] = [];
const boundary = new Map<string, [number,number]>();
function triangle(a: number, b: number, c: number) {
  indices.push(a, b, c);
  for (const edge of [[a,b], [b,c], [c,a]] as [number,number][]) {
    const key = edge.slice().sort((x,y) => x - y).join(',');
    if (boundary.has(key)) boundary.delete(key);
    else boundary.set(key, edge);
  }
}
for (let j = 0; j < rows; j++) {
  for (let i = 0; i < columns; i++) {
    if (holes.some(h => i >= h.i-h.w && i < h.i+h.w && j >= h.j-h.h && j < h.j+h.h)) continue;
    triangle(idx(i,j), idx(i+1,j), idx(i,j+1));
    triangle(idx(i+1,j), idx(i+1,j+1), idx(i,j+1));
  }
}
const activeVertices = new Set(indices);
const shellIndices = Array.from(boundary.values()).flatMap(([a,b]) => [b,a,b+vertexCount,a,a+vertexCount,b+vertexCount]);

function sculpturalRelief(x: number, y: number) {
  if (x < .19) return 0;
  let total = 0;
  for (const curve of profile) {
    let distanceSquared = Infinity;
    let nearest = 0;
    for (let i = 0; i < curve.length; i++) {
      const p = curve[i];
      const d = (x-p.x)**2 + (y-p.y)**2;
      if (d < distanceSquared) { distanceSquared = d; nearest = i; }
    }
    const fade = smooth(clamp(Math.min(nearest / 10, (curve.length - 1 - nearest) / 11)));
    total += fade * (.062 * Math.exp(-distanceSquared / .00105) - .018 * Math.exp(-distanceSquared / .0038));
  }
  return total;
}

const relief = new Float32Array(vertexCount);
const plane = new Float32Array(vertexCount * 3);
const eyeRims = new Float32Array(vertexCount);
const uv = new Float32Array(vertexCount * 2);
for (let j = 0; j <= rows; j++) {
  for (let i = 0; i <= columns; i++) {
    const v = idx(i,j);
    let u = (i / columns) * 2 - 1;
    let t = (j / rows) * 2 - 1;
    for (const h of holes) {
      const dx = (i - h.i) / h.w;
      const dy = (j - h.j) / h.h;
      const d = Math.max(Math.abs(dx), Math.abs(dy));
      if (d < .001 || d > 1.84) continue;
      const angle = Math.atan2(dy, dx);
      const blend = smooth(clamp((1.84-d)/.84));
      const eyeX = Math.cos(angle);
      const eyeY = Math.sin(angle) * (1 - .39 * Math.abs(eyeX));
      const centerX = h.i / columns * 2 - 1;
      const centerY = h.j / rows * 2 - 1;
      const tilt = .040 * eyeX * Math.sign(centerX);
      u += (eyeX * d * h.w * 2 / columns - dx * h.w * 2 / columns) * blend;
      t += ((eyeY * h.h * 2 / rows + tilt + centerY) - t) * blend;
      eyeRims[v] = Math.exp(-(((d - 1.06) / .19) ** 2));
    }
    const width = Math.sqrt(Math.max(.00012, 1-t*t)) ** .92 * (.86 + .13*t - .04*Math.exp(-(((t+.45)/.2)**2)));
    const x = u * width;
    const y = t * 1.24;
    plane.set([x,y,u],v*3);
    relief[v] = sculpturalRelief(x,y);
    uv.set([.5+x*.52,.5+y*.389],v*2);
  }
}

export function createGeometry() {
  const outer = new T.BufferGeometry();
  const inner = new T.BufferGeometry();
  const rim = new T.BufferGeometry();
  for (const g of [outer,inner]) {
    g.setAttribute('position', new T.BufferAttribute(new Float32Array(vertexCount*3),3).setUsage(T.DynamicDrawUsage));
    g.setAttribute('uv', new T.BufferAttribute(uv,2));
  }
  outer.setIndex(indices);
  inner.setIndex(indices.map((_,i) => indices[i-i%3 + (2-i%3)]));
  rim.setAttribute('position', new T.BufferAttribute(new Float32Array(vertexCount*6),3).setUsage(T.DynamicDrawUsage));
  rim.setIndex(shellIndices);
  return { outer, inner, rim };
}

export function updateGeometry(geometry: ReturnType<typeof createGeometry>, state: MaskState) {
  const outer = geometry.outer.getAttribute('position') as T.BufferAttribute;
  const inner = geometry.inner.getAttribute('position') as T.BufferAttribute;
  const rim = geometry.rim.getAttribute('position') as T.BufferAttribute;
  const [forehead,brow,eye,nose,cheek,mouth,chin,edge] = state.morph;
  for (let v = 0; v < vertexCount; v++) {
    let x = plane[v*3];
    let y = plane[v*3+1];
    const u = plane[v*3+2];
    const ax = Math.abs(x);
    const dome = .56 * Math.sqrt(Math.max(0, 1-u*u)) * Math.sqrt(Math.max(0,1-(y/1.24)**2));
    const facial =
        .12*bell(x,y-.71,.57,.44)
      + .118*bell(ax-.39,y-.40,.245,.10)
      - .10*bell(ax-.42,y-.21,.255,.17)
      + .14*bell(ax-.51,y+.08,.24,.21)
      - .07*bell(ax-.50,y+.40,.28,.20)
      + .142*bell(x,y-.149,.10,.39)
      + .275*bell(x,y+.197,.114,.140)
      + .114*bell(ax-.11,y+.232,.08,.070)
      - .058*bell(ax-.088,y+.258,.034,.026)
      - .037*bell(x,y+.338,.043,.06)
      + .108*bell(x,y+.482,.281,.16)
      + .039*bell(ax-.070,y+.491 + .018*Math.cos(x*15),.127,.035)
      - .034*bell(x,y+.533 + .015*Math.cos(x*13),.224,.019)
      + .055*bell(x,y+.579,.214,.050)
      - .026*bell(x,y+.680,.21,.062)
      + .117*bell(x,y+.874,.29,.207);
    const detail = state.form === 'Abstrata' ? .48 : 1;
    const z = dome + facial * detail + relief[v] * (state.form === 'Teatral' ? 1.45 : 1)
      + eyeRims[v]*.036 + .00085*Math.sin(x*38+y*21)*Math.sin(y*39-x*13)
      + .17*forehead*bell(x,y-.72,.6,.37)
      + .15*brow*bell(ax-.39,y-.40,.24,.115)
      + .14*nose*bell(x,y+.16,.15,.29)
      + .16*cheek*bell(ax-.48,y+.08,.22,.21)
      + .16*mouth*bell(x,y+.53,.25,.13)
      + .18*chin*bell(x,y+.87,.30,.23);
    x *= 1 + .17*edge + (state.form === 'Abstrata' ? .11*Math.sin(y*3.4+x*2) : 0);
    y += (state.form === 'Teatral' ? .19*bell(ax-.59,y-.77,.28,.33) : 0)
      + eye*Math.sign(y-.24)*.08*bell(ax-.39,y-.235,.25,.14);
    const [front,back] = state.edits;
    const thickness = .054 + .024*bell(x,y,.47,.66);
    const xOffset = (front[v*2]+back[v*2])*.5;
    const frontZ = z + front[v*2+1];
    const backZ = Math.min(frontZ-.025,z-thickness+back[v*2+1]);
    outer.setXYZ(v,x+xOffset,y,frontZ);
    inner.setXYZ(v,x+xOffset,y,backZ);
    rim.setXYZ(v,x+xOffset,y,frontZ);
    rim.setXYZ(v+vertexCount,x+xOffset,y,backZ);
  }
  for (const g of [geometry.outer,geometry.inner,geometry.rim]) {
    g.getAttribute('position').needsUpdate = true;
    g.computeVertexNormals();
    const normals = g.getAttribute('normal');
    for (let i=0;i<normals.count;i++) {
      if (normals.getX(i)===0 && normals.getY(i)===0 && normals.getZ(i)===0) normals.setZ(i,g===geometry.inner?-1:1);
    }
    g.computeBoundingSphere();
  }
}

export function deform(state: MaskState, side: Side, point: T.Vector3, tool: Tool, radius: number, pressure: number, mirror: boolean, lateral: number, surface?: T.BufferAttribute) {
  const offsets = state.edits[side];
  const previous = tool === 'Suavizar' && !surface ? offsets.slice() : offsets;
  for (const v of activeVertices) {
    const x = plane[v*3];
    const y = plane[v*3+1];
    const nearestX = mirror && x * point.x < 0 ? -point.x : point.x;
    const d = Math.hypot(x-nearestX,y-point.y);
    if (d >= radius) continue;
    const weight = (1-d*d/(radius*radius)) ** (tool === 'Entalhar' ? 5 : tool === 'Inflar' ? 1.18 : 2);
    const strength = pressure * weight;
    const zIndex = v*2+1;
    if (tool === 'Suavizar') {
      const neighbors = [v-1,v+1,v-columns-1,v+columns+1].filter(n => activeVertices.has(n));
      const surfaceZ = (vertex: number) => surface?.getZ(vertex) ?? previous[vertex*2+1];
      const average = neighbors.reduce((sum,n) => sum + surfaceZ(n),0) / (neighbors.length || 1);
      offsets[zIndex] = clamp(offsets[zIndex]+(average-surfaceZ(v))*Math.min(1,strength*29),-.32,.32);
    } else if (tool === 'Deformar') {
      offsets[v*2] = clamp(offsets[v*2] + lateral*strength*(nearestX === point.x ? 1 : -1),-.21,.21);
    } else {
      const sign = (tool === 'Pressionar' || tool === 'Entalhar' ? -1 : 1) * (side ? -1 : 1);
      offsets[zIndex] = clamp(offsets[zIndex] + sign*strength*(tool === 'Inflar' ? 1.35 : 1),-.32,.32);
    }
  }
}

export function nearestVertex(uvPoint: T.Vector2) {
  let nearest = 0;
  let best = Infinity;
  for (const v of activeVertices) {
    const d = (uvPoint.x-uv[v*2])**2 + (uvPoint.y-uv[v*2+1])**2;
    if (d < best) { best = d; nearest = v; }
  }
  return nearest;
}
