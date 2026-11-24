import * as T from '../assets/vendor/three.module.js';
import {roomKeys,type Room,type Kind} from '../game/content.ts';
import type {State,Entry} from '../game/state.ts';

const v=(x:number,y:number,z:number)=>new T.Vector3(x,y,z);
let seed=61;
const rand=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
const mat=(color:number,roughness=.78,metalness=0)=>new T.MeshStandardMaterial({color,roughness,metalness});
function surface(color:number,style:string,repeatX=1,repeatY=1){
 const n=512,canvas=document.createElement('canvas');canvas.width=canvas.height=n;
 const ctx=canvas.getContext('2d')!,image=ctx.createImageData(n,n),[r,g,b]=[color>>16,(color>>8)&255,color&255];
 const grain=(u:number,w:number)=>Math.sin(w*98+2*Math.sin(u*5)+2*Math.sin(w*13+u*8))*.065+Math.sin(w*255+u*6+Math.sin(u*21))*.044;
 for(let j=0;j<n;j++)for(let i=0;i<n;i++){
  const u=i/n,w=j/n,noise=rand()-.5,index=(j*n+i)*4;
  const weave=.05*(Math.sin(i*1.57)+Math.cos(j*1.57));
  const h=1+noise*(style==='felt'?.36:style==='plaster'?.12:.15)+(style==='wood'?grain(u,w):style==='weave'?weave:Math.sin(u*28+w*14)*.019);
  image.data[index]=r*h;image.data[index+1]=g*h;image.data[index+2]=b*h;image.data[index+3]=255;
 }
 ctx.putImageData(image,0,0);
 if(style==='wood'){
  ctx.strokeStyle='rgba(66,32,17,.15)';ctx.lineWidth=.7;
  for(let i=0;i<48;i++){const y=rand()*n;ctx.beginPath();ctx.moveTo(0,y);ctx.bezierCurveTo(155,y+rand()*16-8,340,y+rand()*17-8,n,y);ctx.stroke();}
 }
 const map=new T.CanvasTexture(canvas),bumpMap=map.clone();
 for(const t of [map,bumpMap]){t.wrapS=t.wrapT=T.RepeatWrapping;t.repeat.set(repeatX,repeatY);t.anisotropy=4;t.needsUpdate=true;}
 map.colorSpace=T.SRGBColorSpace;
 return new T.MeshStandardMaterial({map,bumpMap,bumpScale:style==='plaster'?.012:style==='wood'?.011:.018,roughness:style==='wood'?.65:.89});
}
const oak=surface(0xad744b,'wood'), walnut=surface(0x754526,'wood'), lightly=surface(0xd6ab79,'wood');
const cream=surface(0xe3caaa,'plaster'), clay=surface(0xb57359,'plaster'), sand=surface(0xcbb28e,'plaster');
const moss=surface(0x55604a,'felt'), upholstery=surface(0x666846,'weave'), pillow=surface(0xc08465,'weave'), linen=surface(0xe5d5b9,'weave');
const canvasMat=surface(0xd4be90,'weave'), leather=surface(0x743f2a,'plaster'), leatherEdge=surface(0xa37248,'plaster');
const brass=mat(0xb99a60,.29,.7), iron=mat(0x38261d,.48,.42), white=mat(0xe7d8b9), foliage=mat(0x476035,.61), leafLight=mat(0x718a40,.67);
const shadeMaterial=surface(0xe3b06a,'weave');shadeMaterial.side=T.DoubleSide;shadeMaterial.emissive.set(0xffa54a);shadeMaterial.emissiveIntensity=.48;
const bookMaterials=[0x58604a,0x7a4534,0x5a5447,0xb58a64,0x677674,0x8f694c,0xa17250].map(x=>mat(x,.92));
const boxCache=new Map<string,any>();
function rounded(w:number,h:number,d:number,r=.025){
 const key=[w,h,d,r].join('/');
 if(boxCache.has(key))return boxCache.get(key);
 r=Math.min(r,w*.17,h*.17,d*.42);
 const x=w/2-r,y=h/2-r,a=Math.min(x,y,r*1.4),outline=new T.Shape();
 outline.moveTo(-x+a,-y);outline.lineTo(x-a,-y);outline.quadraticCurveTo(x,-y,x,-y+a);outline.lineTo(x,y-a);outline.quadraticCurveTo(x,y,x-a,y);
 outline.lineTo(-x+a,y);outline.quadraticCurveTo(-x,y,-x,y-a);outline.lineTo(-x,-y+a);outline.quadraticCurveTo(-x,-y,-x+a,-y);
 const geo=new T.ExtrudeGeometry(outline,{depth:d-2*r,bevelEnabled:true,bevelSegments:2,bevelSize:r,bevelThickness:r,curveSegments:5});
 geo.translate(0,0,-d/2+r);
 const uv=geo.attributes.uv;for(let i=0;i<uv.count;i++)uv.setXY(i,uv.getX(i)/Math.max(w,.15)+.5,uv.getY(i)/Math.max(h,.15)+.5);
 boxCache.set(key,geo);return geo;
}
function piece(g:any,geo:any,m:any,x=0,y=0,z=0,shadow=true){const mesh=new T.Mesh(geo,m);mesh.position.set(x,y,z);mesh.castShadow=shadow;mesh.receiveShadow=true;g.add(mesh);return mesh;}
function block(g:any,m:any,x:number,y:number,z:number,w:number,h:number,d:number,r=.025,shadow=true){return piece(g,rounded(w,h,d,r),m,x,y,z,shadow);}
function group(parent:any,name:string,x=0,y=0,z=0){const g=new T.Group();g.name=name;g.position.set(x,y,z);parent.add(g);return g;}
const sphere=new T.SphereGeometry(1,16,10);
function orb(g:any,m:any,x:number,y:number,z:number,a:number,b:number,c:number,sh=true){const o=piece(g,sphere,m,x,y,z,sh);o.scale.set(a,b,c);return o;}
function beam(g:any,a:any,b:any,thick:number,depth:number,m=oak){
 const diff=b.clone().sub(a),p=a.clone().lerp(b,.5);
 const obj=block(g,m,p.x,p.y,p.z,thick,diff.length(),depth,Math.min(.019,thick*.2));
 obj.quaternion.setFromUnitVectors(v(0,1,0),diff.normalize());return obj;
}
function lathe(g:any,m:any,x:number,y:number,z:number,profile:number[][],segments=22){return piece(g,new T.LatheGeometry(profile.map(([a,b])=>new T.Vector2(a,b)),segments),m,x,y,z);}
function tube(g:any,m:any,points:any[],radius:number,segments=12){return piece(g,new T.TubeGeometry(new T.CatmullRomCurve3(points),segments,radius,5,false),m);}
function book(g:any,x:number,y:number,z:number,w:number,h:number,d:number,m:any){
 const b=group(g,'book',x,y,z);
 block(b,white,0,0,0,w*.9,h*.88,d*.89,.012,false);
 block(b,m,-w*.47,0,0,w*.10,h,d,.009,false);block(b,m,w*.47,0,0,w*.10,h,d,.009,false);
 block(b,m,0,0,d*.45,w,h,.044,.012,false);
 return b;
}
function rug(g:any,x:number,y:number,z:number,w:number,d:number,m=linen){
 const r=group(g,'rug',x,y,z);
 orb(r,m,0,0,0,w/2,.023,d/2,false);
 const rings=new T.InstancedMesh(new T.TorusGeometry(1,.012,5,54),m,10),o=new T.Object3D();r.add(rings);
 for(let i=0;i<10;i++){const f=.11+i*.087;o.position.set(0,.021+i*.0002,0);o.rotation.x=-Math.PI/2;o.scale.set(w/2*f,d/2*f,.72);o.updateMatrix();rings.setMatrixAt(i,o.matrix);}
 return r;
}
function frame(g:any,x:number,y:number,z:number,w:number,h:number,art=false){
 const f=group(g,'frame',x,y,z);const m=art?walnut:brass;
 for(const side of [-1,1]){block(f,m,side*w/2,0,0,.06,h+.06,.047,.012);block(f,m,0,side*h/2,0,w+.055,.06,.047,.011);}
 if(art){block(f,white,0,0,-.01,w,h,.025,.014);const stem=v(0,-h*.33,.012);tube(f,foliage,[stem,v(0,0,.012),v(.03,h*.31,.012)],.008);
  for(let i=0;i<5;i++){const s=i%2?1:-1;orb(f,foliage,s*.078,-h*.2+i*h*.125,.015,.083,.029,.006,false).rotation.z=s*.5;}}
 return f;
}
function windowUnit(g:any,x:number,y:number,z:number,w:number,h:number,curtains=false){
 const o=group(g,'window',x,y,z),pane=new T.MeshStandardMaterial({color:0xa0b5bc,emissive:0x73919b,emissiveIntensity:.32,roughness:.31});
 block(o,walnut,0,0,0,w+.11,h+.1,.045,.016);
 block(o,pane,0,0,.034,w-.04,h-.045,.027,.009,false);
 for(const side of [-1,1]){block(o,oak,side*w/2,0,.069,.055,h+.07,.045,.012);block(o,oak,0,side*h/2,.069,w+.04,.052,.046,.012);}
 block(o,oak,0,0,.071,.044,h,.05,.011);block(o,oak,0,0,.071,w,.041,.05,.011);
 if(curtains){
  beam(o,v(-w*.72,h*.58,.13),v(w*.72,h*.58,.13),.03,.03,iron);
  for(const side of [-1,1])for(let i=0;i<7;i++){const x=side*(w*.35+i*.031);orb(o,linen,x,.04,.142+Math.sin(i*1.4)*.035,.038,h*.54,.039,false).rotation.z=side*.06;}
 }
 return o;
}
function lamp(g:any,x:number,y:number,z:number,size=1,floor=false){
 const o=group(g,'lamp',x,y,z);o.scale.setScalar(size);
 const h=floor?.72:.32;
 lathe(o,walnut,0,0,0,[[0,0],[.155,0],[.158,.021],[.136,.046],[0,.055]]);
 if(floor)beam(o,v(0,.05,0),v(0,h,0),.034,.034,brass);
 else lathe(o,white,0,.04,0,[[0,0],[.09,0],[.118,.046],[.122,.105],[.105,.16],[.048,.2],[.035,.235]]);
 lathe(o,shadeMaterial,0,h-.055,0,[[.209,0],[.203,.035],[.172,.14],[.129,.29],[.12,.30]],44);
 for(let i=0;i<14;i++){const a=i*Math.PI*2/14;beam(o,v(.206*Math.sin(a),h-.045,.206*Math.cos(a)),v(.121*Math.sin(a),h+.245,.121*Math.cos(a)),.009,.009,shadeMaterial);}
 const rim=piece(o,new T.TorusGeometry(.205,.008,6,36),brass,0,h-.05,0,false);rim.rotation.x=Math.PI/2;
 orb(o,new T.MeshBasicMaterial({color:0xffd38c}),0,h-.043,0,.058,.035,.058,false);
 const l=new T.PointLight(0xffbb6c,floor?4.6:3.45,2.85,2);l.position.set(0,h-.073,.046);o.add(l);return o;
}
const leafGeo=(()=>{
 const positions:number[]=[],indices:number[]=[];
 for(let i=0;i<=16;i++){
  const t=i/16,wide=Math.pow(Math.sin(t*Math.PI),.82)*.425;
  for(let j=0;j<=8;j++){const u=j/4-1,camber=.177*Math.sin(Math.PI*t)*(1-Math.abs(u)*.86);
   positions.push(u*wide,t,camber+.051*Math.sin(t*Math.PI*2)+.037*u*Math.sin(t*5));
   if(i<16&&j<8){const k=i*9+j;indices.push(k,k+1,k+9,k+1,k+10,k+9);}
  }
 }
 const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(positions,3));g.setIndex(indices);g.computeVertexNormals();return g;
})();
foliage.side=leafLight.side=T.DoubleSide;
function plant(g:any,x:number,y:number,z:number,s=1,hang=false){
 const p=group(g,'plant',x,y,z);p.scale.setScalar(s);
 lathe(p,clay,0,0,0,[[0,0],[.123,0],[.152,.19],[.151,.22],[.168,.23],[.16,.256],[.139,.258],[.132,.222],[0,.221]]);
 orb(p,walnut,0,.222,0,.138,.012,.138);
 for(let b=0;b<5;b++){
  const side=Math.cos(b*2.4),front=Math.sin(b*2.4);
  const q=[v(0,.212,0),v(side*.17,.41,front*.14),v(side*.27,.47,front*.24)];
  if(hang)q.push(v(side*.37,.2,front*.31+.1),v(side*.41,-.11,front*.38+.21),v(side*.43,-.39,front*.44+.22));
  tube(p,foliage,q,.008);
  for(let i=1;i<q.length;i++){
   const n=q[i];
   for(let k=0;k<2;k++){
    const leaf=piece(p,leafGeo,k?foliage:leafLight,n.x,n.y,n.z,false);
    leaf.rotation.set((rand()-.5)*2,rand()*3,side*(k?1.1:-.94)+i*.39);leaf.scale.setScalar(.17+rand()*.15);
   }
  }
 }
 return p;
}
function armchair(g:any,x:number,y:number,z:number){
 const a=group(g,'armchair',x,y,z);
 for(const i of [-1,1])for(const j of [-1,1])beam(a,v(i*.32,.025,j*.26),v(i*.28,.19,j*.22),.071,.068,walnut);
 block(a,upholstery,0,.26,0,.73,.23,.63,.095);
 block(a,upholstery,0,.53,-.24,.72,.66,.21,.1).rotation.x=-.12;
 block(a,upholstery,0,.425,.065,.57,.144,.54,.06);
 for(const i of [-1,1]){block(a,upholstery,i*.349,.46,.015,.174,.285,.62,.082);tube(a,moss,[v(i*.37,.32,.31),v(i*.43,.46,.305),v(i*.35,.61,.29)],.009);}
 const p=block(a,pillow,-.08,.59,-.08,.35,.34,.13,.057);p.rotation.set(-.31,.14,.22);
 block(a,linen,-.33,.58,.109,.19,.064,.38,.029).rotation.x=-.08;
 const cloth=block(a,linen,-.385,.425,.307,.17,.30,.057,.025);cloth.rotation.z=-.06;
 for(let i=0;i<10;i++)beam(a,v(-.46+i*.015,.293,.33),v(-.46+i*.015,.226+rand()*.025,.346),.012,.012,canvasMat);
 return a;
}
function bed(g:any,x:number,y:number,z:number){
 const o=group(g,'bed',x,y,z);
 for(const a of [-1,1])for(const b of [-1,1])beam(o,v(a*.47,0,b*.67),v(a*.47,.29,b*.67),.072,.071,walnut);
 block(o,walnut,0,.195,0,1.08,.19,1.52,.045);
 block(o,oak,0,.38,-.72,1.08,.61,.11,.063); for(let i=-3;i<=3;i++)block(o,walnut,i*.13,.405,-.657,.018,.44,.012,.006,false);
 block(o,linen,0,.353,0,1.06,.23,1.44,.085);
 block(o,linen,0,.47,-.46,.79,.129,.39,.058).rotation.x=-.105;
 block(o,linen,0,.462,.22,1.095,.142,.95,.048);
 const blanket=group(o,"blanket");const cover=block(blanket,moss,0,.555,.364,1.124,.055,.57,.023);cover.rotation.y=.04;
 for(let i=0;i<14;i++){const x=-.53+i*.081;const len=.24+rand()*.073;block(blanket,i%3?moss:upholstery,x,.392,.686,.091,len,.043,.012,false).rotation.x=.1;beam(blanket,v(x,.299,.703),v(x+.009,.225+rand()*.02,.71),.012,.012,moss);}
 return o;
}
function shelves(g:any,x:number,y:number,z:number){
 const o=group(g,'bookshelf',x,y,z),w=1.12,d=.34,h=1.44;
 block(o,walnut,0,h/2,-.137,w,h,.063,.02);
 for(const x of [-.55,.55])block(o,walnut,x,h/2,0,.083,h,d,.019);
 for(let j=0;j<4;j++){
  block(o,oak,0,.12+j*.42,0,w,.075,d,.023);
  if(j===3)continue;
  let x=-.48;
  for(let i=0;i<10;i++){
   const width=.064+rand()*.035, hh=.22+rand()*.12;
   book(o,x+width/2,.158+j*.42+hh/2,.024,width,hh,.235,bookMaterials[(i+j*3)%7]).rotation.z=(rand()-.5)*.095;
   x+=width+.012;
  }
 }
 return o;
}
function dresser(g:any,x:number,y:number,z:number){
 const o=group(g,'dresser',x,y,z);
 for(const i of [-1,1])for(const j of [-1,1])beam(o,v(i*.57,.015,j*.28),v(i*.56,.69,j*.28),.082,.084,walnut);
 block(o,oak,0,.757,.022,1.42,.085,.73,.024);
 for(const i of [-1,1])block(o,walnut,i*.61,.43,0,.086,.60,.622,.018);
 block(o,walnut,0,.45,-.29,1.23,.6,.066,.018);
 block(o,walnut,0,.217,.016,1.25,.071,.623,.018);
 block(o,oak,0,.598,.344,1.17,.175,.072,.019);
 for(const i of [-1,1])orb(o,brass,i*.395,.597,.392,.034,.032,.027);
 const drawer=group(o,'drawer',0,.292,.025);
 block(drawer,oak,0,.07,.318,1.16,.211,.084,.018);
 block(drawer,lightly,0,-.012,.026,1.075,.053,.58,.016);
 for(const x of [-.538,.538])block(drawer,oak,x,.06,.019,.049,.15,.546,.014);
 block(drawer,oak,0,.06,-.25,1.05,.15,.042,.014);
 orb(drawer,brass,0,.076,.371,.04,.038,.033);
 return {o,drawer};
}
function suitcase(g:any,x:number,y:number,z:number){
 const base=group(g,'suitcase',x,y,z);
 block(base,leather,0,.125,0,1.04,.25,.50,.061);
 block(base,canvasMat,0,.252,0,.91,.025,.395,.015);
 for(const i of [-1,1]){
  block(base,leatherEdge,i*.32,.14,.242,.09,.229,.037,.016);
  orb(base,brass,i*.32,.21,.271,.03,.034,.021);
  for(const j of [-1,1])orb(base,iron,i*.465,.06,j*.2,.058,.056,.053);
 }
 const lid=group(base,'case_lid',0,.267,-.242);
 block(lid,leather,0,.073,.24,1.05,.153,.50,.062);
 for(const i of [-1,1])block(lid,leatherEdge,i*.32,.15,.235,.081,.027,.48,.011);
 tube(lid,leatherEdge,[v(-.14,.14,.43),v(-.10,.224,.455),v(.10,.224,.455),v(.14,.14,.43)],.024,12);
 return {base,lid};
}
function memoryBook(g:any,x:number,y:number,z:number){
 const o=group(g,'memory_book',x,y,z);o.rotation.y=-.18;
 block(o,moss,0,.02,0,.55,.038,.385,.017);block(o,linen,.014,.056,0,.51,.054,.351,.014);
 block(o,moss,0,.092,0,.555,.044,.386,.016);block(o,moss,-.249,.058,0,.085,.1,.379,.023);
 tube(o,brass,[v(-.11,.117,-.006),v(-.015,.118,0),v(.127,.118,-.043)],.005);
 for(let i=0;i<4;i++){const x=-.075+i*.049;for(const s of [-1,1])orb(o,brass,x,.12,s*.028-.009,.035,.004,.009,false).rotation.y=s*.58;}
 return o;
}
export function token(g:any,id:Kind){
 const o=group(g,id);const colors={leaf:leafLight,star:brass,flower:pillow,stone:sand,card:linen};
 if(id==='leaf'){const leaf=piece(o,leafGeo,colors[id],0,.016,.081);leaf.rotation.x=-Math.PI/2;leaf.scale.setScalar(.16);}
 if(id==='star'){const s=new T.Shape();for(let i=0;i<10;i++){const a=i*Math.PI/5,r=i%2?.048:.102;i?s.lineTo(r*Math.cos(a),r*Math.sin(a)):s.moveTo(r,0);}s.closePath();const geo=new T.ExtrudeGeometry(s,{depth:.025,bevelSize:.005,bevelThickness:.005,bevelSegments:1});geo.rotateX(-Math.PI/2);piece(o,geo,brass);}
 if(id==='flower'){orb(o,brass,0,.035,0,.035,.025,.035);for(let i=0;i<6;i++){const a=i*Math.PI/3;orb(o,pillow,Math.cos(a)*.055,.021,Math.sin(a)*.055,.039,.023,.037);}}
 if(id==='stone'){const stone=piece(o,new T.IcosahedronGeometry(.091,1),sand,0,.04,0);stone.scale.set(1,.52,.81);}
 if(id==='card'){block(o,linen,0,.018,0,.19,.023,.128,.009);for(let i=0;i<3;i++)block(o,oak,-.011,.031,-.031+i*.029,.101-i*.012,.003,.005,.002,false);}
 return o;
}
const centers:Record<Room,any>={reading:v(-1.34,2.9,.04),bedroom:v(1.36,2.88,.04),studio:v(-1.34,1,.12),storage:v(1.4,.97,.12)};
const front={reading:[[-1.54,2.11,.91],[-.68,2.12,.75],[-2.06,2.12,.72]],bedroom:[[1.45,2.12,.86],[.78,2.12,.68],[1.97,2.12,.63]],studio:[[-1.36,.981,.26],[-1.1,.981,.52],[-.94,.981,.29]],storage:[[1.44,.17,.77],[.91,.17,.59],[1.86,.17,.68]]};
function batchStatic(root:any,excluded:Set<any>){
 root.updateWorldMatrix(true,true);
 const inverse=root.matrixWorld.clone().invert(),buckets=new Map<string,any[]>();
 function walk(group:any){
  if(excluded.has(group))return;
  for(const o of group.children){
   if(o.isMesh&&!o.isInstancedMesh&&o.material.visible&&!o.material.transparent&&!Array.isArray(o.material)){
    const id=o.material.uuid+':'+Number(o.castShadow)+':'+Number(o.receiveShadow);
    if(!buckets.has(id))buckets.set(id,[]);buckets.get(id)!.push(o);
   }
   if(o.children.length)walk(o);
  }
 }
 walk(root);
 for(const objects of buckets.values()){
  if(objects.length<2)continue;
  const count=objects.reduce((n,o)=>n+(o.geometry.index?.count??o.geometry.attributes.position.count),0);
  const pos=new Float32Array(count*3),nor=new Float32Array(count*3),uv=new Float32Array(count*2);
  let offset=0;
  for(const o of objects){
   const geometry=o.geometry.index?o.geometry.toNonIndexed():o.geometry.clone();
   geometry.applyMatrix4(new T.Matrix4().multiplyMatrices(inverse,o.matrixWorld));
   const a=geometry.attributes;pos.set(a.position.array,offset*3);nor.set(a.normal.array,offset*3);
   if(a.uv)uv.set(a.uv.array,offset*2);
   offset+=a.position.count;geometry.dispose();o.removeFromParent();
  }
  const merged=new T.BufferGeometry();merged.setAttribute('position',new T.BufferAttribute(pos,3));merged.setAttribute('normal',new T.BufferAttribute(nor,3));merged.setAttribute('uv',new T.BufferAttribute(uv,2));
  const combined=piece(root,merged,objects[0].material,0,0,0,objects[0].castShadow);combined.receiveShadow=objects[0].receiveShadow;
 }
}
export function mount(host:HTMLElement,select:(room:Room)=>void,fallback:(value:boolean)=>void,optimize=true){
 const renderer=new T.WebGLRenderer({antialias:true});
 renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.14;
 renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFShadowMap;
 const canvas=renderer.domElement;host.prepend(canvas);canvas.setAttribute('aria-hidden','true');
 const scene=new T.Scene();scene.background=new T.Color(0x6e5141);scene.fog=new T.FogExp2(0x745845,.052);
 const cam=new T.PerspectiveCamera(40,1,.08,60);
 const ambient=new T.HemisphereLight(0xf5dec4,0x6b5349,1.24);scene.add(ambient);
 const key=new T.DirectionalLight(0xffdfbe,1.96);key.position.set(-3.2,7.8,7);key.castShadow=true;key.shadow.mapSize.setScalar(1536);Object.assign(key.shadow.camera,{left:-5,right:5,top:6,bottom:-5,near:.4,far:18});key.shadow.normalBias=.02;key.shadow.bias=-.0002;scene.add(key);
 const rim=new T.DirectionalLight(0xb6cee0,.74);rim.position.set(4,5,-3);scene.add(rim);
 block(scene,oak,0,-.20,-.1,19,.38,11,.065);
 block(scene,sand,0,4.0,-4.0,28,9,.22,.025);
 const ambientWindow=windowUnit(scene,-4.3,3.3,-3.83,2.3,3.07,true);
 ambientWindow.rotation.y=.055;
 const tabletopPlant=plant(scene,-3.72,-.011,.17,2.65,true);tabletopPlant.rotation.y=-.8;
 const prop=group(scene,'desk_objects',3.65,.02,.15);
 for(let i=0;i<3;i++){const b=book(prop,.15,i*.16+.09,-.1,.196,1.27,.87,bookMaterials[i]);b.rotation.z=Math.PI/2;b.rotation.y=i*.16;}
 const shell=group(scene,'dollhouse_shell');
 block(shell,walnut,0,.035,.035,5.23,.13,2.46,.056);
 block(shell,oak,0,.13,.04,5.13,.11,2.32,.038);
 for(const [x,c] of [[-1.28,clay],[1.28,sand]] as const)block(shell,c,x,1.03,-.957,2.48,1.84,.115,.022);
 block(shell,cream,0,2.89,-.957,4.79,1.77,.116,.02);
 const gable=new T.Shape();gable.moveTo(-2.37,3.62);gable.lineTo(-1.28,4.26);gable.lineTo(1.28,4.26);gable.lineTo(2.37,3.62);gable.closePath();
 piece(shell,new T.ExtrudeGeometry(gable,{depth:.10,bevelEnabled:false}),cream,0,0,-1.003);
 for(const x of [-2.39,2.39]){block(shell,cream,x,1.85,0,.17,3.41,1.97,.027);block(shell,oak,x,1.86,1.015,.103,3.42,.111,.023);}
 block(shell,oak,0,2.021,0,4.83,.154,2.02,.032);
 block(shell,lightly,0,2.096,0,4.66,.025,1.91,.009);
 block(shell,oak,0,2.018,1.041,4.87,.107,.093,.016);
 block(shell,oak,0,1.073,-.121,.106,1.83,1.73,.021);
 block(shell,oak,-.43,1.08,.73,.109,1.84,.525,.018);
 block(shell,oak,.43,1.08,.73,.109,1.84,.525,.018);
 block(shell,oak,0,3.097,-.01,.11,2.005,1.99,.026);
 for(let i=0;i<11;i++){
  const z=-.872+i*.172;block(shell,lightly,0,.187,z,4.62,.023,.168,.007,false);
  block(shell,lightly,0,2.106,z,4.63,.022,.168,.007,false);
 }
 const roof=group(scene,'roof');
 for(const side of [-1,1]){
  const a=v(side*2.54,3.56,0),b=v(side*1.18,4.31,0);
  beam(roof,a,b,.14,2.23,oak);beam(roof,a.clone().add(v(0,.105,0)),b.clone().add(v(0,.105,0)),.133,2.3,moss);
  for(const z of [-1.13,1.14])beam(roof,v(a.x,a.y-.04,z),v(b.x,b.y-.04,z),.10,.095,lightly);
 }
 block(roof,oak,0,4.285,0,2.47,.115,2.22,.027);block(roof,moss,0,4.386,0,2.52,.115,2.29,.042);
 const stairs=group(scene,'stairs');
 for(let i=0;i<10;i++){const y=.248+i*.19,z=.85-i*.146;block(stairs,oak,0,y,z,.762,.099,.238,.018);block(stairs,lightly,0,y+.041,z+.026,.77,.025,.237,.009);}
 beam(stairs,v(-.381,.24,.96),v(-.381,2.015,-.43),.072,.089,walnut);beam(stairs,v(.381,.24,.96),v(.381,2.015,-.43),.072,.089,walnut);
 const reading=group(scene,'reading',0,2.12,0);armchair(reading,-1.83,0,.42);shelves(reading,-.85,0,-.60);lamp(reading,-1.93,0,-.592,.96,true);
 const pouf=group(reading,'side_table',-1.08,0,.66);
 lathe(pouf,oak,0,0,0,[[0,.38],[.235,.38],[.248,.397],[.238,.439],[0,.439]]);
 for(let i=0;i<3;i++){const a=i*2.094;beam(pouf,v(Math.cos(a)*.20,.023,Math.sin(a)*.2),v(Math.cos(a)*.136,.387,Math.sin(a)*.136),.055,.06,walnut);}
 lathe(pouf,white,.027,.438,-.026,[[0,0],[.061,0],[.069,.095],[.065,.103],[.054,.103],[.054,.038],[0,.037]]);
 plant(reading,-.53,1.427,-.55,.85,true);rug(reading,-1.41,.016,.54,1.25,.73);
 const bedroom=group(scene,'bedroom',0,2.12,0);
 windowUnit(bedroom,.71,.94,-.883,.62,.92,true);frame(bedroom,1.59,1.10,-.867,.37,.48,true);
 const b=bed(bedroom,1.41,0,.157);b.rotation.y=.112;
 const side=group(bedroom,'nightstand',2.087,0,.56);
 for(const i of [-1,1])for(const j of [-1,1])beam(side,v(i*.15,.025,j*.15),v(i*.15,.43,j*.15),.045,.043,walnut);
 block(side,oak,0,.405,0,.386,.18,.39,.021);orb(side,brass,0,.408,.203,.019,.019,.014);lamp(side,0,.504,0,.64);
 rug(bedroom,1.49,.018,.61,1.16,.64);
 const studio=group(scene,'studio',0,.207,0);
 const {drawer,o}=dresser(studio,-1.35,0,-.067);frame(studio,-1.32,1.338,-.858,.44,.47);
 lamp(o,-.436,.807,-.06,.78);memoryBook(o,.213,.807,.091);plant(studio,-2.13,.018,.57,1.0,true);
 rug(studio,-1.38,.02,.8,1.59,.37,linen);
 const storage=group(scene,'storage',0,.207,0);
 const {base,lid}=suitcase(storage,1.438,.014,-.017);
 windowUnit(storage,2.13,.95,-.866,.37,.87);
 block(storage,oak,1.473,1.321,-.674,1.24,.078,.453,.021);
 for(const s of [-1,1])beam(storage,v(1.47+s*.41,1.081,-.879),v(1.47+s*.41,1.281,-.55),.061,.073,walnut);
 for(let i=0;i<3;i++)block(storage,i%2?oak:lightly,1.24+i*.015,1.417+i*.115,-.688,.53-i*.016,.105,.32,.024);
 plant(storage,1.94,1.36,-.605,.77,true);rug(storage,1.5,.019,.69,1.25,.56);
 const invisible=new T.MeshBasicMaterial({visible:false});
 if(optimize){const excluded=new Set([drawer,lid,reading,bedroom,studio,storage]);batchStatic(scene,excluded);for(const root of [reading,bedroom,studio,storage]){excluded.delete(root);batchStatic(root,excluded);}}
 const pick=roomKeys.map(room=>{const p=piece(scene,new T.BoxGeometry(1.95,1.65,.17),invisible,centers[room].x,centers[room].y,1.055,false);p.userData.room=room;return p;});
 const mobile=matchMedia('(max-width:720px) and (orientation:portrait)');
 const visual=new Map<number,{object:any;from:any;target:any;at:number;slot:string;entry:Entry}>();
 let state:State,cw=1,ch=1,render=true,raf=0,last=0,deadline=0,lost=false,preview:any;
 const aim=new T.Vector3(),targetAim=new T.Vector3(),targetPos=new T.Vector3();
 const ray=new T.Raycaster(),pointer=new T.Vector2();
 const abort=new AbortController(),listen={signal:abort.signal};
 function resize(){cw=host.clientWidth;ch=host.clientHeight;if(!cw||!ch)return;
  cam.aspect=cw/ch;renderer.setPixelRatio(Math.min(devicePixelRatio,mobile.matches?1.25:1.65));renderer.setSize(cw,ch);
  cam.updateProjectionMatrix();render=true;deadline=performance.now()+540;
 }
 const observer=new ResizeObserver(resize);observer.observe(host);resize();
 function positions(){const s=state;if(!s)return;
  if(s.focused){const c=centers[s.room];targetAim.copy(c).add(v(.035,mobile.matches?.009:-.02,.09));
   targetPos.copy(c).add(v(-.28,.46,mobile.matches?4.15:3.55));}
  else{targetAim.set(0,2.20,0);targetPos.set(mobile.matches?-1.14:-1.58,mobile.matches?3.46:3.63,mobile.matches?11.3:8.8);}
  if(mobile.matches)cam.clearViewOffset();else cam.setViewOffset(cw,ch,cw*(s.focused?.145:.126),0,cw,ch);
 }
 function destination(t:Entry){
  const number=Number(t.slot.split('-').at(-1));if(t.visibility==='visible')return v(...front[t.room][number] as [number,number,number]);
  const dx=((t.id%5)-2)*.136;
  if(t.room==='studio')return drawer.getWorldPosition(v(0,0,0)).add(v(dx,.026,.065));
  return base.getWorldPosition(v(0,0,0)).add(v(dx,.277,.018));
 }
 function apply(s:State){
  const first=!state;
  const viewChanged=first||s.room!==state.room||s.focused!==state.focused;
  state=s;positions();
  if(first||s.reduced){cam.position.copy(targetPos);aim.copy(targetAim);}
  if(viewChanged)deadline=performance.now()+590;
  const now=performance.now();
  for(const [id,e] of visual){if(!s.tokens.some(t=>t.id===id)){e.object.removeFromParent();visual.delete(id);}}
  for(const entry of s.tokens){
   const next=destination(entry),old=visual.get(entry.id);
   if(!old){const object=token(scene,entry.type),from=next.clone().add(v(-.15,.37,.14));object.position.copy(from);visual.set(entry.id,{object,from,target:next,at:now,slot:entry.slot,entry});}
   else if(old.slot!==entry.slot){old.from.copy(old.object.position);old.target.copy(next);old.at=now;old.slot=entry.slot;old.entry=entry;}
  }
  const marker=s.draft&&s.stage>=2&&s.stage<=3?s.draft.type:null;
  if(preview?.name!==marker){preview?.removeFromParent();preview=marker?token(scene,marker):null;}
  if(preview){const [x,y,z]=front[s.room][0];preview.position.set(x+.19,y+.13,z+.11);preview.scale.setScalar(1.18);}
  if(s.reduced){drawer.position.z=s.drawer?.317:.025;lid.rotation.x=s.caseOpen?-.98:0;}
  render=true;deadline=Math.max(deadline,now+590);
 }
 function animate(now:number){
  raf=requestAnimationFrame(animate);
  if(!state||state.paused||document.hidden||lost||(!render&&deadline===0))return;
  const dt=Math.min(.05,(now-last)/1000||.016),blend=state.reduced||now>=deadline?1:1-Math.exp(-dt*11);last=now;
  positions();cam.position.lerp(targetPos,blend);aim.lerp(targetAim,blend);cam.lookAt(aim);
  drawer.position.z=T.MathUtils.lerp(drawer.position.z,state.drawer?.317:.025,blend);
  lid.rotation.x=T.MathUtils.lerp(lid.rotation.x,state.caseOpen?-.98:0,blend);
  scene.updateMatrixWorld();
  for(const e of visual.values()){
   const progress=state.reduced?1:Math.min(1,(now-e.at)/490),ease=progress*progress*(3-2*progress);
   e.target.copy(destination(e.entry));e.object.position.copy(e.from).lerp(e.target,ease);e.object.position.y+=Math.sin(progress*Math.PI)*.26;
   e.object.visible=e.entry.visibility==='visible'||progress<1||(e.entry.room==='studio'?drawer.position.z>.17:lid.rotation.x<-.50);
  }
  renderer.render(scene,cam);canvas.dataset.drawCalls=String(renderer.info.render.calls);canvas.dataset.triangles=String(renderer.info.render.triangles);render=false;if(now>=deadline)deadline=0;
 }
 raf=requestAnimationFrame(animate);
 function readRoom(e:PointerEvent){
  const r=canvas.getBoundingClientRect();pointer.set(2*(e.clientX-r.left)/r.width-1,-2*(e.clientY-r.top)/r.height+1);
  ray.setFromCamera(pointer,cam);return ray.intersectObjects(pick)[0]?.object.userData.room as Room|undefined;
 }
 canvas.addEventListener('pointerup',e=>{const r=readRoom(e);if(r&&!state?.paused)select(r);},listen);
 canvas.addEventListener('pointermove',e=>{canvas.style.cursor=readRoom(e)?'pointer':'default';},listen);
 canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();lost=true;fallback(true);},listen);
 canvas.addEventListener('webglcontextrestored',()=>{lost=false;render=true;fallback(false);},listen);
 return {apply,exportables:{dollhouse_shell:shell,roof,stairs,armchair:reading.getObjectByName('armchair'),bookshelf:reading.getObjectByName('bookshelf'),bed:b,dresser:o,memory_book:o.getObjectByName('memory_book'),empty_frame:studio.getObjectByName('frame'),suitcase:base,house:scene},dispose(){
  cancelAnimationFrame(raf);observer.disconnect();abort.abort();
  const resources=new Set<any>();
  scene.traverse((o:any)=>{if(o.geometry)resources.add(o.geometry);if(o.material){resources.add(o.material);if(o.material.map)resources.add(o.material.map);if(o.material.bumpMap)resources.add(o.material.bumpMap);}});
  for(const r of resources)r.dispose();renderer.dispose();canvas.remove();
 }};
}




