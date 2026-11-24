import * as T from 'three'
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js'
import { presets, Tau, type Vessel } from '../game/content'

export function random(seed: number) {
  return () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0
    return seed / 4294967296
  }
}

export function profile(vessel: Vessel, y: number) {
  const curve = presets[vessel].profile
  const index = Math.min(5, Math.floor(y * 6))
  const left = curve[index], right = curve[index + 1]
  const t = y * 6 - index
  return [T.MathUtils.lerp(left[0], right[0], t), T.MathUtils.lerp(left[1], right[1], t)] as const
}

export function surface(vessel: Vessel, y: number, angle: number, offset = 0) {
  const [r, height] = profile(vessel, y)
  return new T.Vector3((r + offset) * Math.cos(angle), height, (r + offset) * Math.sin(angle))
}

function boundary(index: number, count: number, t: number) {
  const base = index * Tau / count + .14
  const phase = (index % count) * 2.08
  return base + (.105 * Math.sin(t * 13 + phase) + .038 * Math.sin(t * 33 + phase)) * Math.sin(t * 2.5)
}

export function seam(vessel: Vessel, count: number, id: number, t: number, offset = .002) {
  return surface(vessel, .21 + .79 * t, boundary(id + 1, count, t), offset)
}

export function glaze(vessel: Vessel) {
  const canvas = document.createElement('canvas')
  canvas.width = 768; canvas.height = 384
  const ctx = canvas.getContext('2d')!
  const w = canvas.width, h = canvas.height
  const rng = random(118)
  ctx.fillStyle = presets[vessel].color
  ctx.fillRect(0, 0, w, h)
  for (let i = 0; i < 13000; i++) {
    ctx.fillStyle = rng() < .42 ? 'rgba(19,22,30,.12)' : 'rgba(249,237,205,.16)'
    ctx.fillRect(rng() * w, rng() * h, .5 + rng() * 2.6, 1 + rng() * 2)
  }
  for (const v of [.05,.063,.12,.15,.69,.72,.86,.94]) {
    ctx.fillStyle = vessel === 'plate' ? '#5b6271' : '#dec7a1'
    ctx.fillRect(0, h*v, w, v === .86 ? 13 : 2)
  }
  ctx.strokeStyle = vessel === 'plate' ? '#596676' : '#c9bec0'
  ctx.lineWidth = 1.35
  for (let row = 0; row < 5; row++) {
    for (let col = -1; col < 25; col++) {
      const x = col * 32 + ((row % 2) * 16), y = 101 + row * 32
      for (let ring = 0; ring < 4; ring++) {
        ctx.beginPath()
        ctx.arc(x,y,4.8 + ring * 4.3,Math.PI,2*Math.PI)
        ctx.stroke()
      }
    }
  }
  const map = new T.CanvasTexture(canvas)
  map.colorSpace = T.SRGBColorSpace
  map.wrapS = T.RepeatWrapping
  map.anisotropy = 8
  return new T.MeshPhysicalMaterial({map, roughness:.29, clearcoat:.45, clearcoatRoughness:.28, side:T.DoubleSide})
}

function sheet(point: (u:number,v:number)=>T.Vector3, uv: (u:number,v:number)=>number[], across: number, down: number) {
  const vertices:number[] = [], texture:number[] = [], indices:number[] = []
  for (let j = 0; j <= down; j++) for (let i = 0; i <= across; i++) {
    const u = i/across, v = j/down
    vertices.push(...point(u,v).toArray()); texture.push(...uv(u,v))
    if (i < across && j < down) {
      const a = j * (across + 1) + i, b = a + across + 1
      indices.push(a,b,a+1,b,b+1,a+1)
    }
  }
  const geometry = new T.BufferGeometry()
  geometry.setAttribute('position',new T.Float32BufferAttribute(vertices,3))
  geometry.setAttribute('uv',new T.Float32BufferAttribute(texture,2))
  geometry.setIndex(indices); geometry.computeVertexNormals()
  return geometry
}

export function shard(vessel: Vessel, count: number, slot: number, coat: T.Material, clay: T.Material) {
  const result = new T.Group()
  const angle = (u:number,v:number) => T.MathUtils.lerp(boundary(slot,count,v),boundary(slot+1,count,v),u)
  const point = (u:number,v:number,offset:number) => surface(vessel,.21 + v*.79,angle(u,v),offset)
  const tex = (u:number,v:number) => [angle(u,v)/Tau,.19 + v*.81]
  const glazed:T.BufferGeometry[] = [], exposed:T.BufferGeometry[] = []
  for (const depth of [0,-.009]) {
    glazed.push(sheet((u,v)=>point(depth === 0 ? 1-u : u,v,depth),(u,v)=>tex(depth === 0 ? 1-u : u,v),15,24))
  }
  for (const side of [0,1]) {
    exposed.push(sheet((u,v)=>point(side,v,u*-.009),tex,1,24))
  }
  for (const edge of [0,1]) {
    exposed.push(sheet((u,v)=>point(u,edge,v*-.009),tex,15,1))
  }
  for (const [surfaces,material] of [[glazed,coat],[exposed,clay]] as const) {
    const mesh=new T.Mesh(mergeGeometries(surfaces),material)
    mesh.castShadow=true;mesh.receiveShadow=true;result.add(mesh)
    surfaces.forEach(geometry=>geometry.dispose())
  }
  return result
}

export function whole(vessel: Vessel, material: T.Material, top = 1, steps = 32) {
  const rim = Array.from({length:19},(_,i)=> {
    const [r,y] = profile(vessel,i/18*top)
    return new T.Vector2(r,y)
  })
  const points = [new T.Vector2(0,.012), ...rim, ...rim.slice().reverse().map(v=>new T.Vector2(v.x-.008,v.y+.005)), new T.Vector2(0,.021)]
  const object = new T.Mesh(new T.LatheGeometry(points,steps),material)
  object.castShadow = true; object.receiveShadow = true
  return object
}
