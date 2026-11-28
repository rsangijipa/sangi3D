import * as T from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js'
import { whole, random } from './ceramic'
import type { Vessel } from '../game/content'

export const bench = .85
export const meshMaterial = (color:string, roughness=.7, metalness=0) => new T.MeshStandardMaterial({color,roughness,metalness})

function grain(base: string, cloth = false) {
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = 512
  const ctx = canvas.getContext('2d')!, rng = random(cloth ? 912 : 318)
  ctx.fillStyle = base; ctx.fillRect(0,0,512,512)
  for (let i = 0; i < (cloth ? 7500 : 1800); i++) {
    const x = rng()*512, y = rng()*512
    ctx.strokeStyle = rng() < .45 ? 'rgba(15,12,9,.12)' : 'rgba(249,210,166,.07)'
    ctx.beginPath(); ctx.moveTo(x,y)
    if (cloth) ctx.lineTo(x+(i%2 ? 10 : 0), y+(i%2 ? 0 : 10))
    else ctx.bezierCurveTo(x+70,y+5,x+150,y-6,x+250,y+rng()*4)
    ctx.stroke()
  }
  const map = new T.CanvasTexture(canvas); map.colorSpace = T.SRGBColorSpace; map.anisotropy = 8
  return map
}

export function box(parent:T.Object3D, size:[number,number,number], position:[number,number,number], material:T.Material, bevel=.006, shadow=true) {
  const mesh = new T.Mesh(bevel ? new RoundedBoxGeometry(...size,2,bevel) : new T.BoxGeometry(...size),material)
  mesh.position.set(...position); mesh.castShadow = shadow; mesh.receiveShadow = true; parent.add(mesh)
  return mesh
}

export const trays = [[-.64,.43],[-.36,.51],[-.06,.53],[.25,.5],[.56,.41]] as const
export function trayPosition(id:number) {
  const [x,z] = trays[(id-2+trays.length)%trays.length]
  return new T.Vector3(x,bench+.022,z)
}

export function workshop(scene:T.Group) {
  const woodMap = grain('#523422')
  const wood = new T.MeshStandardMaterial({map:woodMap, bumpMap:woodMap,bumpScale:.004,roughness:.63})
  const dark = meshMaterial('#39291f'), plaster = meshMaterial('#a39074'), iron = meshMaterial('#2a302e')
  const linenMap = grain('#2b3438',true)
  const linen = new T.MeshStandardMaterial({map:linenMap,bumpMap:linenMap,bumpScale:.0015,roughness:.93})
  const ochre = meshMaterial('#ba8c52',.45,.42), black = meshMaterial('#311c20',.28)
  const colors = ['#516b75','#d5b892','#773d31','#667660'].map(c => meshMaterial(c,.33))
  box(scene,[3.3,.1,1.56],[0,bench-.05,.06],wood,.017)
  box(scene,[1.84,.024,1.11],[0,bench+.002,.16],linen,.025)
  box(scene,[1.91,.012,1.18],[0,bench-.004,.16],dark,.023)
  for (const x of [-1.36,1.36]) for (const z of [-.54,.61]) box(scene,[.11,.82,.12],[x,.4,z],dark,.012)
  box(scene,[12,.1,8],[0,-.07,-.3],meshMaterial('#564033'),0)
  for (let x = -5; x <= 5; x += .28) box(scene,[.008,.001,8],[x,-.018,-.3],dark,0,false)
  const windowX=-.69, windowY=1.69, wallZ=-1.38, radius=.72
  const wall = new T.Shape()
  wall.moveTo(-6,-.06); wall.lineTo(6,-.06); wall.lineTo(6,4.2); wall.lineTo(-6,4.2); wall.closePath()
  const opening=new T.Path(); opening.absarc(windowX,windowY,radius,0,Math.PI*2,true); wall.holes.push(opening)
  const facade=new T.Mesh(new T.ExtrudeGeometry(wall,{depth:.13,bevelEnabled:false,curveSegments:42}),plaster)
  facade.position.z=wallZ-.13; facade.receiveShadow=true; scene.add(facade)
  for (const [r,t,z] of [[radius,.028,wallZ],[radius+.061,.014,wallZ+.012],[radius-.03,.018,wallZ-.1]]) {
    const rim=new T.Mesh(new T.TorusGeometry(r,t,8,72),wood); rim.position.set(windowX,windowY,z); scene.add(rim)
  }
  for (const offset of [-.4,0,.4]) {
    const length=2*Math.sqrt((radius-.023)**2-offset**2)
    box(scene,[.018,length,.026],[windowX+offset,windowY,wallZ-.06],dark,0,false)
    box(scene,[length,.014,.026],[windowX,windowY+offset,wallZ-.06],dark,0,false)
  }
  box(scene,[12,5,.01],[0,2,-6.3],new T.MeshBasicMaterial({color:'#aca786'}),0,false)
  const rng=random(515)
  const leaf=new T.Shape()
  const outline=[[0,-1],[.17,-.45],[.68,-.18],[.44,.03],[.83,.39],[.36,.31],[0,1],[-.35,.32],[-.82,.39],[-.45,.03],[-.67,-.18],[-.16,-.45]]
  outline.forEach(([x,y],id)=>id===0?leaf.moveTo(x,y):leaf.lineTo(x,y))
  leaf.closePath()
  const leafMaterial=meshMaterial('#fff4d9',.94); leafMaterial.side=T.DoubleSide
  const leaves = new T.InstancedMesh(new T.ShapeGeometry(leaf),leafMaterial,2400)
  const pose=new T.Object3D()
  const leafColors=['#ce7e3a','#b65630','#e0a146','#92503a','#727a55','#ac8644']
  for (let i=0;i<leaves.count;i++) {
    const grove = (i%4)*.74-1.95
    const crown = i%3
    pose.position.set(grove+(rng()-.5)*(.56+crown*.21),.82+crown*.68+rng()*.65,-2.3-rng()*3.3)
    const scale=.048+rng()*.12
    pose.scale.set(scale,scale*(.62+rng()*.48),scale*.55)
    pose.rotation.set(rng()*5,rng()*5,rng()*5); pose.updateMatrix()
    leaves.setMatrixAt(i,pose.matrix); leaves.setColorAt(i,new T.Color(leafColors[i%leafColors.length]))
  }
  scene.add(leaves)
  const bark=meshMaterial('#5b3d2d')
  for(let i=0;i<10;i++) {
    const x=-2.8+rng()*4.4, z=-2.7-rng()*2
    const trunk=new T.Mesh(new T.CylinderGeometry(.024,.081,3.4,8),bark)
    trunk.position.set(x,1.45,z); trunk.rotation.z=(rng()-.5)*.45; scene.add(trunk)
  }
  box(scene,[2.3,.052,.38],[1.63,1.21,-1.12],wood,.008)
  box(scene,[2.3,.052,.38],[1.63,1.79,-1.12],wood,.008)
  for (const x of [.57,2.69]) box(scene,[.06,1.1,.37],[x,1.41,-1.12],dark,.006)
  const forms:Vessel[]=['plate','bowl','vase']
  for(let i=0;i<10;i++) {
    const pot=whole(forms[i%3],colors[i%4],1,24)
    pot.scale.setScalar(.52+(i%3)*.09)
    pot.position.set(.75+(i%5)*.40,i<5 ? 1.24 : 1.82,-1.10)
    scene.add(pot)
    if (i%2) {
      const ring=new T.Mesh(new T.TorusGeometry(.138,.0025,6,40),ochre)
      ring.rotation.x=Math.PI/2; ring.position.set(pot.position.x,pot.position.y+.06,-1.10); scene.add(ring)
    }
  }
  const trayWood=meshMaterial('#4a3228')
  const tray=box(scene,[.38,.027,.38],[.97,bench+.014,.055],trayWood,.016)
  tray.rotation.y=.08
  for (const [x,z,material] of [[.91,.015,black],[1.02,.15,ochre],[1.15,-.15,colors[3]]] as [number,number,T.Material][]) {
    const pot=new T.Mesh(new T.LatheGeometry([new T.Vector2(0,0),new T.Vector2(.049,0),new T.Vector2(.055,.015),new T.Vector2(.052,.061),new T.Vector2(.046,.067),new T.Vector2(.043,.058),new T.Vector2(.042,.018),new T.Vector2(0,.018)],32),material)
    pot.position.set(x,bench+.036,z); pot.castShadow=true; scene.add(pot)
    const fill=new T.Mesh(new T.CylinderGeometry(.041,.041,.003,32),material === ochre ? meshMaterial('#e1b258',.37,.61) : black)
    fill.position.set(x,bench+.082,z); scene.add(fill)
  }
  const hair=meshMaterial('#b3a079')
  for (let i=0;i<3;i++) {
    const group = new T.Group()
    const handle=new T.Mesh(new T.CylinderGeometry(.006,.009,.195,10),i===2 ? dark : wood)
    const ferrule=new T.Mesh(new T.CylinderGeometry(.011,.008,.033,12),i===2 ? iron : ochre); ferrule.position.y=.106
    const tip=i===2 ? new T.Mesh(new T.BoxGeometry(.031,.06,.006),iron) : new T.Mesh(new T.ConeGeometry(.012,.049,12),hair)
    tip.position.y=.143
    group.add(handle,ferrule,tip); group.rotation.set(Math.PI/2,0,-.5+i*.13)
    group.position.set(-.97+i*.06,bench+.025,.14+i*.048); scene.add(group)
  }
  for (const [x,z] of trays) {
    const rest = box(scene,[.23,.011,.17],[x,bench+.017,z],linen,.023,false)
    rest.rotation.y=-.13
  }
  const clothSeat=box(scene,[.62,.017,.60],[0,bench+.018,-.065],wood,.021)
  clothSeat.rotation.y=-.1
  const stand=new T.Mesh(new T.CylinderGeometry(.219,.229,.024,56),dark)
  stand.position.set(0,bench+.041,-.065); stand.receiveShadow=true; stand.castShadow=true; scene.add(stand)
}

export function batchWorkshop(group:T.Group) {
  const batches=new Map<string,T.Mesh<T.BufferGeometry,T.Material>[]>()
  group.updateMatrixWorld(true)
  group.traverse(object=>{
    if(!(object instanceof T.Mesh)||object instanceof T.InstancedMesh||Array.isArray(object.material)) return
    const key=object.material.uuid+'-'+Number(object.castShadow)+'-'+Number(object.receiveShadow)
    const batch=batches.get(key)??[]
    batch.push(object);batches.set(key,batch)
  })
  for(const batch of batches.values()) {
    if(batch.length<2) continue
    const geometry=batch.map(object=>{
      const copy=object.geometry.index?object.geometry.toNonIndexed():object.geometry.clone()
      return copy.applyMatrix4(object.matrixWorld)
    })
    const merged=mergeGeometries(geometry)
    geometry.forEach(item=>item.dispose())
    if(!merged) continue
    const first=batch[0]
    const object=new T.Mesh(merged,first.material)
    object.castShadow=first.castShadow;object.receiveShadow=first.receiveShadow;group.add(object)
    batch.forEach(item=>{item.removeFromParent();item.geometry.dispose()})
  }
}
