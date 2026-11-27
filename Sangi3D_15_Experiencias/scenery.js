import { THREE, clamp, rng } from './runtime.js';
import { createWoodMaterial } from '../shared/engine/materials.js';

const unitBox = new THREE.BoxGeometry(1, 1, 1);
const unitRock = new THREE.IcosahedronGeometry(1, 1);
const unitSphere = new THREE.SphereGeometry(1, 20, 12);
const unitTube = new THREE.CylinderGeometry(1, 1, 1, 20, 1);
const unitCone = new THREE.CylinderGeometry(.025, 1, 1, 12, 1);
const cushionShape=new THREE.Shape();
cushionShape.moveTo(-.438,-.438);cushionShape.lineTo(.438,-.438);cushionShape.lineTo(.438,.438);
cushionShape.lineTo(-.438,.438);cushionShape.closePath();
const cushionGeo=new THREE.ExtrudeGeometry(cushionShape,{depth:.876,bevelEnabled:true,bevelThickness:.062,bevelSize:.062,bevelSegments:3,curveSegments:2});
cushionGeo.center();cushionGeo.computeVertexNormals();
const up = new THREE.Vector3(0, 1, 0);
export const mat = (color, options = {}) => new THREE.MeshStandardMaterial({ color, roughness: .73, ...options });
export const glow = (color, power = .75) => mat(color, { emissive: color, emissiveIntensity: power });
export const wood = (color, seed = 412) => createWoodMaterial({ color, seed, quality: 'LOW' });
const textured = new Map();
export function surfaceMaterial(color,type,repeat=3,options={}) {
  const key=type+'-'+repeat;
  if(!textured.has(key)){
    const n=256,canvas=document.createElement('canvas');
    canvas.width=canvas.height=n;
    const c=canvas.getContext('2d'),pixels=c.createImageData(n,n);
    const random=rng(type==='brick'?1069:2971);
    const spores=Array.from({length:16},()=>[random()*Math.PI*2,random()-.5,random()-.5]);
    for(let y=0;y<n;y++)for(let x=0;x<n;x++){
      const u=x/n,v=y/n;
      let coarse=0;
      for(let i=0;i<spores.length;i++){
        const [s,a,b]=spores[i];
        const freq=1+Math.floor(i/3);
        coarse+=Math.sin((u*Math.round(a*freq*3)+v*Math.round(b*freq*3))*Math.PI*2+s)*(10/(1+i*.22));
      }
      const fine=(random()-.5)*(type==='asphalt'?81:56);
      let color=204+coarse+fine;
      if(type==='brick'){
        const row=Math.floor(y/25.6),bx=(x+row%2*32)%64,by=y-row*25.6;
        if(bx<2.4||by<2.05)color=105+fine*.5+coarse*.4;
        else color=195+coarse*.6+fine+((Math.floor((x+row%2*32)/64)*19+row*23)%46);
      } else if(type==='bark'){
        color=169+coarse+fine+38*Math.sin((u*13+.073*Math.sin(v*34))*Math.PI*2);
      } else if(type==='soil'){
        color=168+coarse*1.25+fine+(random()>.95?50:0);
      }
      const i=(y*n+x)*4;
      pixels.data[i]=pixels.data[i+1]=pixels.data[i+2]=color;pixels.data[i+3]=255;
    }
    c.putImageData(pixels,0,0);
    const map=new THREE.CanvasTexture(canvas);
    map.colorSpace=THREE.SRGBColorSpace;
    map.wrapS=map.wrapT=THREE.RepeatWrapping;
    map.repeat.set(repeat,repeat);map.anisotropy=4;
    const bump=map.clone();
    bump.colorSpace=THREE.NoColorSpace;bump.needsUpdate=true;
    textured.set(key,{map,bump});
  }
  const {map,bump}=textured.get(key);
  return mat(color,{map,bumpMap:bump,bumpScale:type==='asphalt'?.032:.08,...options});
}

export function mesh(group, geometry, material, pos, scale) {
  const obj = new THREE.Mesh(geometry, material);
  if (pos) obj.position.fromArray(pos);
  if (scale) obj.scale.fromArray(scale);
  group.add(obj);
  return obj;
}
export const box = (group, material, x, y, z, w, h, d) => mesh(group, unitBox, material, [x,y,z], [w,h,d]);
export const cushion = (group, material, x,y,z,w,h,d) => mesh(group,cushionGeo,material,[x,y,z],[w,h,d]);
export const orb = (group, material, x, y, z, r, h = r, d = r) => mesh(group, unitSphere, material, [x,y,z], [r,h,d]);
export const rock = (group, material, x, y, z, w, h, d) => mesh(group, unitRock, material, [x,y,z], [w,h,d]);
export const tube = (group, material, x, y, z, r, h) => mesh(group, unitTube, material, [x,y,z], [r,h,r]);
export function beam(group, material, from, to, radius, taper = false) {
  const a = new THREE.Vector3().fromArray(from), b = new THREE.Vector3().fromArray(to);
  const obj = mesh(group, taper ? unitCone : unitTube, material);
  obj.position.copy(a).lerp(b, .5);
  obj.quaternion.setFromUnitVectors(up, b.sub(a).normalize());
  obj.scale.set(radius, a.distanceTo(new THREE.Vector3().fromArray(to)), radius);
  return obj;
}
export function beams(scene,material,segments,taper=false){
  const result=new THREE.InstancedMesh(taper?unitCone:unitTube,material,segments.length);
  const start=new THREE.Vector3(),end=new THREE.Vector3(),delta=new THREE.Vector3(),item=new THREE.Object3D();
  segments.forEach(([from,to,r],i)=>{
    start.fromArray(from);end.fromArray(to);delta.copy(end).sub(start);
    item.position.copy(start).lerp(end,.5);
    item.scale.set(r,delta.length(),r);
    item.quaternion.setFromUnitVectors(up,delta.normalize());
    item.updateMatrix();result.setMatrixAt(i,item.matrix);
  });
  result.instanceMatrix.needsUpdate=true;
  scene.add(result);
  return result;
}
export function group(scene, x = 0, y = 0, z = 0) {
  const object = new THREE.Group();
  object.position.set(x,y,z);
  scene.add(object);
  return object;
}
export function atmosphere(ctx, background, floor, key, options = {}) {
  ctx.scene.background = new THREE.Color(background);
  if (options.fog) ctx.scene.fog = new THREE.FogExp2(background, options.fog);
  ctx.scene.add(new THREE.HemisphereLight(options.sky || 0xc3dbff, floor, options.fill ?? 1.75));
  const light = new THREE.DirectionalLight(key, options.intensity ?? 2.4);
  light.position.set(-3, 7, 4);
  ctx.scene.add(light);
  return light;
}
export function lamp(scene, color, intensity, x,y,z, distance = 12) {
  const light = new THREE.PointLight(color, intensity, distance);
  light.position.set(x,y,z);
  scene.add(light);
  return light;
}
export function marker(scene, color, x,y,z) {
  const material = new THREE.MeshBasicMaterial({color,transparent:true,opacity:.78,depthWrite:false});
  const ring = mesh(scene,new THREE.TorusGeometry(.21,.014,6,32),material,[x,y,z]);
  ring.rotation.x = -Math.PI / 2;
  return ring;
}
export function batch(scene, geometry, material, transforms) {
  const obj = new THREE.InstancedMesh(geometry, material, transforms.length);
  const dummy = new THREE.Object3D();
  transforms.forEach(([x,y,z,sx,sy,sz, ry = 0, color], index) => {
    dummy.position.set(x,y,z);
    dummy.scale.set(sx,sy,sz);
    dummy.rotation.set(0,ry,0);
    dummy.updateMatrix();
    obj.setMatrixAt(index,dummy.matrix);
    if (color !== undefined) obj.setColorAt(index,new THREE.Color(color));
  });
  obj.instanceMatrix.needsUpdate = true;
  scene.add(obj);
  return obj;
}
export const boxes = (scene, material, list) => batch(scene,unitBox,material,list);
export const rocks = (scene, material, list) => batch(scene,unitRock,material,list);
export const cones = (scene, material, list) => batch(scene,unitCone,material,list);
export const cylinders = (scene, material, list) => batch(scene,unitTube,material,list);
export function specks(scene, coords, color, size = .03, opacity = .8) {
  let map=textured.get('point')?.map;
  if(!map){
    const canvas=document.createElement('canvas');canvas.width=canvas.height=32;
    const context=canvas.getContext('2d');
    const gradient=context.createRadialGradient(16,16,0,16,16,15.7);
    gradient.addColorStop(0,'rgba(255,255,255,1)');
    gradient.addColorStop(.30,'rgba(255,255,255,.95)');
    gradient.addColorStop(.58,'rgba(255,255,255,.50)');
    gradient.addColorStop(1,'rgba(255,255,255,0)');
    context.fillStyle=gradient;context.fillRect(0,0,32,32);
    map=new THREE.CanvasTexture(canvas);
    textured.set('point',{map});
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(coords,3));
  const points = new THREE.Points(geometry,new THREE.PointsMaterial({color,size,map,transparent:true,opacity,depthWrite:false}));
  points.frustumCulled = false;
  scene.add(points);
  return points;
}
export function sign(scene, label, x,y,z, w = 2.3, h = .45, options = {}) {
  const canvas = document.createElement('canvas');
  canvas.width = 512; canvas.height = 115;
  const context = canvas.getContext('2d');
  context.fillStyle = options.background || '#1e3035';
  context.fillRect(0,0,512,115);
  context.strokeStyle = options.ink || '#f1d4a4';
  context.lineWidth = 3;
  context.strokeRect(12,11,488,93);
  context.font = '600 42px system-ui';
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillStyle = context.strokeStyle;
  context.fillText(label,256,59,465);
  const map = new THREE.CanvasTexture(canvas);
  map.colorSpace = THREE.SRGBColorSpace;
  return mesh(scene,new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map,side:THREE.DoubleSide}),[x,y,z]);
}
export function cuspTerrain(scene, material, width, depth, height, steps = 55) {
  const geo = new THREE.PlaneGeometry(width, depth, steps, steps);
  geo.rotateX(-Math.PI / 2);
  const points = geo.attributes.position;
  const colors = new Float32Array(points.count * 3);
  const tint = new THREE.Color();
  for (let i = 0; i < points.count; i++) {
    const x=points.getX(i), z=points.getZ(i);
    points.setY(i,height(x,z));
    tint.setHSL(.30 + Math.sin(x*.21)*.03,.15,.68 + Math.sin(x*1.17+z*.83)*.19);
    tint.toArray(colors,i*3);
  }
  geo.setAttribute('color',new THREE.BufferAttribute(colors,3));
  geo.computeVertexNormals();
  return mesh(scene,geo,material);
}
export function trees(scene, list, style = 'pine') {
  const trunks=[], crowns=[];
  const bark = surfaceMaterial(0x79543c,'bark',2);
  const leaf = surfaceMaterial(0x87a479,'soil',1,{bumpScale:.055});
  const shades=[0x41634b,0x607e52,0x86946a,0x567b68,0x728b77];
  for (const [x,y,z,height,rotation = 0] of list) {
    trunks.push([x,y+height*.40,z,height*.047,height*.83,height*.04,rotation]);
    if (style === 'pine') {
      for (let i=0;i<6;i++){
        const s=.26-i*.034;
        crowns.push([x+Math.sin(rotation+i)*height*.016,y+height*(.44+i*.113),z+Math.cos(rotation+i)*height*.013,height*s,height*(.38-i*.026),height*s*.86,rotation+i,shades[(i+Math.floor(rotation*2))%shades.length]]);
      }
    } else {
      for(let i=0;i<12;i++){
        const angle=rotation+i*2.4, radial=.09+(i%4)*.062;
        crowns.push([x+Math.cos(angle)*height*radial,y+height*(.72+(i%6)*.064),z+Math.sin(angle)*height*radial,height*(.11+i%4*.027),height*.135,height*.13,rotation+i,shades[(i+Math.floor(rotation*2))%shades.length]]);
      }
    }
  }
  cones(scene,bark,trunks);
  return style === 'pine' ? cones(scene,leaf,crowns) : batch(scene,new THREE.IcosahedronGeometry(1,2),leaf,crowns);
}
export function precip(ctx, { size = 40, height = 8, count = 600, y = 0, color = 0xbcd7eb, omit = () => false } = {}) {
  const random = rng(8472);
  const values = new Float32Array(count * 6);
  const data = [];
  for(let i=0;i<count;i++){
    const x=(random()-.5)*size, z=(random()-.5)*size;
    data.push([x,z,random()*height,omit(x,z)]);
  }
  const geometry = new THREE.BufferGeometry();
  const attribute = new THREE.BufferAttribute(values,3).setUsage(THREE.DynamicDrawUsage);
  geometry.setAttribute('position',attribute);
  const lines = new THREE.LineSegments(geometry,new THREE.LineBasicMaterial({color,transparent:true,opacity:.45,depthWrite:false}));
  lines.frustumCulled = false;
  ctx.scene.add(lines);
  return (time, strength) => {
    lines.visible = strength > 0;
    if (!lines.visible) return;
    const active = Math.floor(count * strength * (ctx.low ? .45 : 1));
    geometry.setDrawRange(0,active*2);
    for(let i=0;i<active;i++){
      const [x,z,offset,hidden] = data[i];
      const v = hidden ? -100 : y + ((offset - time * 9) % height + height) % height;
      values.set([x,v,z,x+.035,v+.18+strength*.10,z+.015],i*6);
    }
    attribute.needsUpdate = true;
  };
}
export function teaSet(scene, x,y,z, color = 0xd5a26c) {
  const ceramic = mat(color,{roughness:.29});
  const cup = group(scene,x,y,z);
  const rim = [[0,0],[.09,0],[.115,.03],[.135,.15],[.125,.15],[.105,.04],[0,.028]];
  mesh(cup,new THREE.LatheGeometry(rim.map(v => new THREE.Vector2(...v)),32),ceramic);
  const handle = mesh(cup,new THREE.TorusGeometry(.064,.014,7,22),ceramic,[.135,.09,0]);
  handle.scale.x = .72;
  tube(cup,ceramic,0,-.014,0,.169,.023);
  const liquid = tube(cup,mat(0x623719,{roughness:.19}),0,.085,0,.111,.006);
  liquid.visible = false;
  return { cup, liquid };
}
export function orbit(ctx, radius, target = [0,1,0], elevation = .23, startYaw = 0) {
  let yaw = startYaw, pitch = elevation, distance = radius;
  const focus = new THREE.Vector3(...target);
  function look() {
    const flat = Math.cos(pitch)*distance;
    ctx.camera.position.set(focus.x+Math.sin(yaw)*flat,focus.y+Math.sin(pitch)*distance,focus.z+Math.cos(yaw)*flat);
    ctx.camera.lookAt(focus);
    ctx.camera.updateMatrixWorld();
  }
  function drag(p) {
    yaw -= p.dx*.009;
    pitch = clamp(pitch+p.dy*.007,-.27,1.38);
    look();
  }
  function zoom(factor) {
    distance=clamp(distance*factor,radius*.63,radius*2.2); look();
  }
  ctx.on(ctx.canvas,'wheel',event => { if (!event.ctrlKey) { event.preventDefault(); zoom(Math.exp(event.deltaY*.001)); } },{passive:false});
  look();
  return { drag, look, zoom, reset(){yaw=startYaw;pitch=elevation;distance=radius;look();} };
}
