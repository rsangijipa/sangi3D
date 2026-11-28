import * as T from '../assets/vendor/three.module.js';
import {random} from '../game/rules.ts';
import type {SampleId} from '../game/content.ts';
import type {State} from '../game/state.ts';

const rng=random(104);
const mk=(color:number, roughness=.78, metalness=0)=>new T.MeshStandardMaterial({color,roughness,metalness});
function grain(color:number, kind:string) {
 const n=256, pixels=new Uint8Array(n*n*4), base=new T.Color(color);
 for(let y=0;y<n;y++)for(let x=0;x<n;x++){
  const i=(y*n+x)*4, wave=kind==='wood'? .065*Math.sin(y*.39+3*Math.sin(x*.017)+1.6*Math.sin(y*.038+x*.031)) : kind==='linen'? .16*(Math.cos(x*Math.PI/2)+Math.cos(y*Math.PI/2)) : 0;
  const r=rng(),pore=kind==='cork' && Math.sin(x*1.38+Math.cos(y*.95))*Math.cos(y*.93+Math.sin(x*.67))>.58; const a= .85+wave+(r-.5)*(kind==='cork'?.66:.28)-(pore?.37:0);
  pixels[i]=255*base.r*a; pixels[i+1]=255*base.g*a; pixels[i+2]=255*base.b*a; pixels[i+3]=255;
 }
 const tex=new T.DataTexture(pixels,n,n); tex.wrapS=tex.wrapT=T.RepeatWrapping;
 tex.magFilter=T.LinearFilter; tex.minFilter=T.LinearMipmapLinearFilter; tex.generateMipmaps=true;
 tex.anisotropy=4; tex.needsUpdate=true;
 return new T.MeshStandardMaterial({map:tex,bumpMap:tex,bumpScale:kind==='cork'?.075:.013,roughness:.84});
}
const wood=grain(0xc38a57,'wood'), felt=grain(0x5c6732,'felt'), trim=grain(0xa3643e,'wood');
const cork=grain(0x9c5e36,'cork'), linen=grain(0xe4c9a0,'linen'), stone=grain(0x6a6261,'stone');
const sandstone=grain(0xcb9a77,'stone'), bronze=mk(0x9c7961,.32,.75), warmMetal=mk(0xb89678,.28,.72);
const cream=mk(0xece0c0), leafMat=mk(0x617434), vein=mk(0xafaf59);
function mesh(parent:any, geometry:any, material:any,x=0,y=0,z=0) {
 const m=new T.Mesh(geometry,material); m.position.set(x,y,z); m.castShadow=true; m.receiveShadow=true; parent.add(m); return m;
}
function rounded(w:number,d:number,r:number) {
 const s=new T.Shape(); s.moveTo(-w/2+r,-d/2); s.lineTo(w/2-r,-d/2); s.quadraticCurveTo(w/2,-d/2,w/2,-d/2+r);
 s.lineTo(w/2,d/2-r); s.quadraticCurveTo(w/2,d/2,w/2-r,d/2); s.lineTo(-w/2+r,d/2);
 s.quadraticCurveTo(-w/2,d/2,-w/2,d/2-r); s.lineTo(-w/2,-d/2+r); s.quadraticCurveTo(-w/2,-d/2,-w/2+r,-d/2); return s;
}
function slab(p:any,w:number,d:number,h:number,m:any,x=0,y=0,z=0,r=.12) {
 const geo=new T.ExtrudeGeometry(rounded(w,d,r),{depth:h,bevelEnabled:true,bevelThickness:.028,bevelSize:.028,bevelSegments:2,curveSegments:5});
 geo.rotateX(-Math.PI/2); return mesh(p,geo,m,x,y,z);
}
function tray(p:any,x:number,z:number,w:number,d:number) {
 const g=new T.Group(); g.position.set(x,.035,z); p.add(g);
 slab(g,w,d,.14,trim); slab(g,w-.19,d-.19,.026,felt,0,.14,0,.1);
 return g;
}
function rod(p:any,a:any,b:any,r:number,m:any) {
 const v=new T.Vector3().subVectors(b,a); const o=mesh(p,new T.CylinderGeometry(r,r,v.length(),12),m);
 o.position.copy(a).addScaledVector(v,.5); o.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),v.normalize()); return o;
}
const V=(x:number,y:number,z:number)=>new T.Vector3(x,y,z);
function tube(p:any, points:any[], radius:number, mat:any, segments=12) {
 return mesh(p,new T.TubeGeometry(new T.CatmullRomCurve3(points),segments,radius,5,false),mat);
}
function rock(p:any,w:number,d:number,h:number,m:any,x=0,y=0,z=0,steps=9) {
 const vertices:number[]=[]; const indices:number[]=[]; const border=Array.from({length:steps},()=>.77+rng()*.26);
 for(let j=0;j<4;j++)for(let i=0;i<steps;i++){
  const a=i*2*Math.PI/steps; const f=border[i]*[.84,1,.9,.45][j];
  vertices.push(Math.cos(a)*w*f,[0,.22,.78,1][j]*h+(j?rng()*h*.28:0),Math.sin(a)*d*f);
 }
 for(let j=0;j<3;j++)for(let i=0;i<steps;i++){
  const a=j*steps+i,b=j*steps+(i+1)%steps; indices.push(a,a+steps,b,b,a+steps,b+steps);
 }
 for(let i=1;i<steps-1;i++)indices.push(3*steps,3*steps+i+1,3*steps+i);
 const geo=new T.BufferGeometry(); geo.setAttribute('position',new T.Float32BufferAttribute(vertices,3)); geo.setIndex(indices);
 geo.setAttribute('uv',new T.Float32BufferAttribute(vertices.flatMap((v,i)=>i%3===0?[v+.5,vertices[i+2]+.5+vertices[i+1]]:[]),2));
 const hard=geo.toNonIndexed(); hard.computeVertexNormals(); geo.dispose();
 return mesh(p,hard,m,x,y,z);
}
function batch(group:any, material:any) {
 const sources=group.children.filter((o:any)=>o.material===material&&!o.isInstancedMesh);
 if(sources.length<2)return;
 const arrays={position:[] as number[],normal:[] as number[],uv:[] as number[]};
 for(const object of sources){
  object.updateMatrix();
  const geo=object.geometry.index?object.geometry.toNonIndexed():object.geometry.clone();
  geo.applyMatrix4(object.matrix);
  for(const key of ['position','normal','uv'] as const)for(const value of geo.attributes[key].array) arrays[key].push(value);
  geo.dispose();object.geometry.dispose();group.remove(object);
 }
 const geometry=new T.BufferGeometry();
 for(const key of ['position','normal','uv'] as const)geometry.setAttribute(key,new T.Float32BufferAttribute(arrays[key],key==='uv'?2:3));
 mesh(group,geometry,material);
}
export function sample(id:SampleId) {
 const g=new T.Group(); g.name=id;
 if(id==='cork'){
  rock(g,1.05,.66,.27,cork,0,0,0,18);
  for(let row=-3;row<=3;row++)for(let col=-5;col<=5;col++){
   const x=col*.173+(rng()-.5)*.1,z=row*.166+(rng()-.5)*.08;
   if((x/1.06)**2+(z/.67)**2>1.04)continue;
   const h=.05+rng()*.17;
   rock(g,.087+rng()*.087,.092+rng()*.06,h,cork,x,.15+rng()*.084,z,5+Math.floor(rng()*3)).rotation.y=rng()*.9;
  }
 } else if(id==='slate'||id==='sandstone') {
  for(let i=0;i<5;i++)rock(g,1-i*.035,.62-i*.022,.075,id==='slate'?stone:sandstone,(rng()-.5)*.09,i*.045,(rng()-.5)*.05,13);
 } else if(id==='wool') {
  const geo=new T.SphereGeometry(1,11,8);
  const cloud=new T.InstancedMesh(geo,cream,150), obj=new T.Object3D();
  for(let i=0;i<150;i++){
   const a=rng()*6.283,r=Math.sqrt(rng()); obj.position.set(Math.cos(a)*r*.87,.09+rng()*.15+(1-r)*.16,Math.sin(a)*r*.48);
   obj.rotation.set(rng(),rng()*6,rng()); obj.scale.set(.09+rng()*.15,.055+rng()*.065,.058+rng()*.085); obj.updateMatrix();
   cloud.setMatrixAt(i,obj.matrix); cloud.setColorAt(i,new T.Color().setScalar(.72+rng()*.28));
  }
  cloud.castShadow=true; cloud.receiveShadow=true; g.add(cloud);
  for(let i=0;i<28;i++){const a=rng()*6.28,r=rng(),x=Math.cos(a)*r*.82,z=Math.sin(a)*r*.47;
   tube(g,[V(x,.23,z),V(x+.08,.36,z+.047),V(x+.13,.28,z+.10),V(x+.08,.22,z+.13)],.014,cream,8);}
 } else if(id==='linen'||id==='wood') {
  slab(g,1.95,1.16,id==='wood'?.18:.068,id==='wood'?wood:linen,0,0,0,.15);
  if(id==='linen'){
   const fringe=new T.InstancedMesh(new T.CylinderGeometry(.009,.009,.13,5),cream,76), o=new T.Object3D();
   for(let i=0;i<76;i++){o.position.set((i%38-18.5)*.048,.063,i<38?-.6:.6);o.rotation.x=Math.PI/2+(rng()-.5)*.3;o.updateMatrix();fringe.setMatrixAt(i,o.matrix);}
   fringe.castShadow=true;g.add(fringe);
  }
 } else if(id==='leaf') {
  const positions:number[]=[]; const indices:number[]=[];
  for(let i=0;i<=20;i++){
   const t=i/20,x=t*1.92-.98,w=Math.sin(Math.PI*t)**.76*(.49+i%2*.017);
   positions.push(x,.065+Math.sin(t*3.14)*.09,-w,x,.115+Math.sin(t*3.14)*.10,0,x,.067+Math.sin(t*3.14)*.10,w);
   if(i<20)for(let k=0;k<2;k++){const a=i*3+k;indices.push(a,a+1,a+3,a+1,a+4,a+3);}
  }
  const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(positions,3));geo.setIndex(indices);geo.computeVertexNormals();
  mesh(g,geo,leafMat); tube(g,[V(-1.13,.096,0),V(-.55,.19,0),V(.13,.225,0),V(.94,.117,0)],.015,vein);
  for(let i=0;i<10;i++)for(const sign of [-1,1]){
   const t=.08+i*.077,x=t*1.92-.98,w=Math.sin(Math.PI*t)**.76*.45;
   tube(g,[V(x,.125+Math.sin(t*Math.PI)*.105,0),V(x+.12,.12+Math.sin(t*Math.PI)*.09,w*.52*sign),V(x+.235,.088+Math.sin(t*Math.PI)*.09,w*sign)],.006,vein,5);
  }
 } else {
  const ceramic=mk(0xc6d0bb,.25);
  mesh(g,new T.LatheGeometry([[0,0],[.35,0],[.42,.035],[.42,.075],[.52,.12],[.69,.24],[.73,.3],[.71,.33],[.67,.32],[.61,.24],[.42,.12],[.21,.1],[0,.1]].map(([x,y])=>new T.Vector2(x,y)),42),ceramic);
 }
 if(id==="cork")batch(g,cork);
 if(id==="leaf")batch(g,vein);
 if(id==="wool")batch(g,cream);
 if(id==="slate"||id==="sandstone")batch(g,id==="slate"?stone:sandstone);
 return g;
}
export function mount(stage:HTMLElement,onFallback:()=>void,onRestore:()=>void) {
 const renderer=new T.WebGLRenderer({antialias:true,alpha:false});stage.prepend(renderer.domElement);
 renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.34;
 renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFShadowMap;
 const scene=new T.Scene();scene.background=new T.Color(0x786052); scene.fog=new T.FogExp2(0x8b7160,.049);
 const camera=new T.PerspectiveCamera(41,1,.05,40), close=new T.PerspectiveCamera(31,1,.025,20);
 const ambient=new T.HemisphereLight(0xffe4c5,0x5b4943,1.55);scene.add(ambient);
 const fill=new T.DirectionalLight(0xffe2bc,1.65);fill.position.set(5,8,4);scene.add(fill);
 const comparisonLight=new T.DirectionalLight(0xffc27d,0);comparisonLight.castShadow=true;comparisonLight.shadow.mapSize.setScalar(1024);comparisonLight.shadow.normalBias=.017;comparisonLight.shadow.camera.left=-3;comparisonLight.shadow.camera.right=3;comparisonLight.shadow.camera.top=3;comparisonLight.shadow.camera.bottom=-3;scene.add(comparisonLight,comparisonLight.target); comparisonLight.target.position.set(-.23,.2,.36);
 const light=new T.SpotLight(0xffc27d,115,13,.64,.64,2);light.castShadow=true;
 const mobile=matchMedia('(max-width:740px) and (orientation:portrait)');
 light.shadow.mapSize.setScalar(mobile.matches?768:1536);light.shadow.bias=-.00035;light.shadow.normalBias=.012;scene.add(light,light.target);
 slab(scene,15,7,.35,wood,0,-.38,-.65,.29);
 slab(scene,16,9,.12,grain(0x947560,'wall'),0,2.5,-4.3,.08).rotation.x=Math.PI/2;
 const shelf=new T.Group();shelf.name="shelf_props";scene.add(shelf);
 slab(shelf,7,.8,.12,trim,-1,2,-3.69);
 slab(shelf,7,.8,.12,trim,-1,3.5,-3.69);
 for(let i=0;i<20;i++){
  const h=.51+rng()*.54,x=-4.22+i*.232;
  const book=mesh(shelf,new T.BoxGeometry(.18,h,.46),mk([0x764631,0x9b7452,0xb4956b,0x475a50,0x624331][i%5]),x,2.14+h/2,-3.67);book.rotation.z=(rng()-.5)*.12;
  for(let n=0;n<2;n++)mesh(book,new T.BoxGeometry(.16,.017,.012),warmMetal,0,-h*.31+n*.052,.236);
 }
 const cabinet=new T.Group();cabinet.name="sample_drawer";cabinet.position.set(3.5,0,-3.16);scene.add(cabinet);
 for(let i=0;i<5;i++){slab(cabinet,1.85,.91,.247,trim,0,.07+i*.28,0);mesh(cabinet,new T.BoxGeometry(.26,.055,.049),warmMetal,0,.2+i*.28,.489);}
 const frame=mesh(scene,new T.BoxGeometry(1.32,1.5,.15),wood,3.34,2.62,-4.03);
 mesh(frame,new T.BoxGeometry(1.12,1.28,.015),cream,0,0,.084);
 const pressed=sample('leaf');pressed.rotation.x=Math.PI/2;pressed.rotation.y=.36;pressed.scale.setScalar(.48);pressed.position.set(0,0,.16);frame.add(pressed);
 const globe=mesh(scene,new T.SphereGeometry(.34,30,20),mk(0xbb8d52),3.63,1.91,-3.12);
 for(let i=0;i<3;i++){const ring=mesh(globe,new T.TorusGeometry(.344,.008,6,36),bronze);ring.rotation.y=i*Math.PI/3;}
 mesh(scene,new T.CylinderGeometry(.055,.2,.26,20),bronze,3.63,1.49,-3.12);
 for(let i=0;i<12;i++){const x=.08+Math.sin(i)*.54,y=3.68-i*.19,z=-3.22+(i%3)*.11;
  if(i)rod(scene,V(.08+Math.sin(i-1)*.54,y+.19,-3.22+((i-1)%3)*.11),V(x,y,z),.025,leafMat);
  const l=sample('leaf');l.scale.setScalar(.29+rng()*.12);l.rotation.set(-.62-rng(),.32,i*.91);l.position.set(x,y,z);shelf.add(l);}
 const main=tray(scene,-.23,.36,3.17,2.28);main.name="tray_felt";
 const drawerTray=tray(scene,-.23,.36,1.55,1.06);drawerTray.visible=false;
 const savePath=new T.CubicBezierCurve3(V(-.23,.2,.36),V(1.11,1.35,.32),V(3.02,1.46,-1.45),V(3.5,.81,-2.69));
 let storedModel:any;
 for(const [id,x,z] of [['wool',-3.19,-1.57],['slate',-.97,-1.77],['linen',1.25,-1.63],['leaf',-3.15,1.3]] as const){
  const t=tray(scene,x,z,1.91,1.31); const g=sample(id);g.position.y=.19;g.scale.setScalar(.81);t.add(g);
 }
 const lamp=new T.Group();lamp.name="lamp_arm";scene.add(lamp);
 mesh(scene,new T.CylinderGeometry(.43,.47,.11,36),bronze,-2.55,.06,.04);
 const glass=new T.Group();glass.name="magnifier";scene.add(glass);
 mesh(glass,new T.CylinderGeometry(.27,.30,.09,32),bronze,0,.05,0);
 rod(glass,V(0,.1,0),V(0,.71,0),.033,warmMetal);
 const rim=mesh(glass,new T.TorusGeometry(.4,.04,12,48),warmMetal,0,.93,0);
 rim.rotation.set(-.51,-.36,0);
 const lens=mesh(rim,new T.CircleGeometry(.375,48),new T.MeshPhysicalMaterial({color:0xc7d8cb,transparent:true,opacity:.15,roughness:.12,metalness:.12,side:T.DoubleSide}),0,0,.012);lens.castShadow=false;
 const armMesh=()=>mesh(lamp,new T.CylinderGeometry(.046,.046,1,12),bronze);
 const arms=[armMesh(),armMesh(),armMesh(),armMesh()];
 const joints=[0,1,2].map(()=>mesh(lamp,new T.CylinderGeometry(.14,.14,.14,24),warmMetal));
 joints.forEach(j=>j.rotation.x=Math.PI/2);
 const shade=new T.Group();lamp.add(shade);
 const profile=[[0,.22],[.10,.21],[.18,.16],[.24,.08],[.33,-.15],[.36,-.19],[.34,-.21],[.32,-.18],[.23,.065],[.12,.17],[0,.18]];
 mesh(shade,new T.LatheGeometry(profile.map(([x,y])=>new T.Vector2(x,y)),40),bronze);
 mesh(shade,new T.CylinderGeometry(.31,.31,.013,36),new T.MeshBasicMaterial({color:0xffd299}),0,-.18,0);
 const models=new Map<SampleId,any>();
 let left:any,right:any, signature='', state:State, id=0, last=0, savedAt=-Infinity, lost=false, dirty=true;
 let cw=1,ch=1,dpr=1;
 function resize(){cw=stage.clientWidth;ch=stage.clientHeight;if(!cw||!ch)return;
  dpr=Math.min(devicePixelRatio,mobile.matches?1.25:1.65);renderer.setPixelRatio(dpr);renderer.setSize(cw,ch);
  camera.aspect=cw/ch;camera.updateProjectionMatrix();dirty=true;}
 const observer=new ResizeObserver(resize);observer.observe(stage);resize();
 function model(key:SampleId){if(!models.has(key))models.set(key,sample(key));return models.get(key).clone();}
 function apply(s:State,save=false){
  const next=s.stage===3?s.pair.join(','):s.sampleId;
  if(next!==signature){
   left?.removeFromParent();right?.removeFromParent();right=undefined;
   left=model(s.stage===3?s.pair[0]:s.sampleId);main.add(left);
   if(s.stage===3){right=model(s.pair[1]);main.add(right);}
   signature=next;
  }
  if(save&&!s.reduced){savedAt=performance.now();storedModel?.removeFromParent();storedModel=model(s.sampleId);storedModel.scale.setScalar(.57);storedModel.position.y=.17;drawerTray.add(storedModel);}
  if(s.reduced){savedAt=-Infinity;drawerTray.visible=false;}
  state=s;dirty=true;
 }
 function update(t:number){
  if(!state||!cw||!ch)return;
  const s=state, compare=!!right, portrait=mobile.matches;
  camera.position.set(portrait?.7:.25,portrait?2.45:3.3,portrait?4.65:6.1);
  camera.lookAt(portrait?-.56:.57,portrait?.57:.89,portrait?.33:-.42);
  if(!portrait) {camera.setViewOffset(cw,ch,cw*.057,0,cw,ch);}else camera.clearViewOffset();
  const cx=-.23,cz=.36;
  const az=T.MathUtils.degToRad(s.lampAngle),el=T.MathUtils.degToRad(s.lampElevation);
  const spot=V(cx+Math.sin(az)*1.91*Math.cos(el),.76+Math.sin(el)*1.91,cz-.31+Math.cos(az)*1.91*Math.cos(el));
  const grazing=s.stage===2||compare||s.stage===4;
  light.position.copy(spot); light.target.position.set(cx,.22,cz); light.intensity=compare?0:grazing?43:20; comparisonLight.intensity=compare?2.4:0; comparisonLight.position.copy(spot); fill.intensity=grazing?.85:1.75;
  const top=spot.clone().add(V(-.13,.23,-.05)),base=V(-2.55,.15,.04),elbow=V(-2.76,1.88,-.16);
  for(let i=0;i<4;i++){
   const a=(i<2?base:elbow).clone().add(V(0,(i%2)*.092,(i%2)*.045));
   const b=(i<2?elbow:top).clone().add(V(0,(i%2)*.092,(i%2)*.045));
   const d=b.clone().sub(a);arms[i].position.copy(a).lerp(b,.5);arms[i].scale.y=d.length();arms[i].quaternion.setFromUnitVectors(V(0,1,0),d.normalize());
  }
  [base,elbow,top].forEach((v,i)=>joints[i].position.copy(v));shade.position.copy(spot);shade.quaternion.setFromUnitVectors(V(0,-1,0),light.target.position.clone().sub(spot).normalize());
  glass.position.set(1.46+s.magnifierPos[0]*.3,.025,.83+s.magnifierPos[1]*.4);
  const progress=T.MathUtils.clamp((t-savedAt)/580,0,1);
  drawerTray.visible=progress<1;
  if(drawerTray.visible){drawerTray.position.copy(savePath.getPoint(progress*progress*(3-2*progress)));drawerTray.scale.setScalar(1-progress*.45);}
  left.position.set(compare?-.75:0,.193,0);
  left.scale.setScalar(compare?.61:1);left.rotation.y=s.rotation*Math.PI/180;
  if(right){right.position.set(.75,.193,0);right.scale.setScalar(.61);right.rotation.y=left.rotation.y;}
  renderer.setScissorTest(false);renderer.setViewport(0,0,cw,ch);renderer.render(scene,camera);
  renderer.domElement.dataset.drawCalls=String(renderer.info.render.calls);
  renderer.domElement.dataset.triangles=String(renderer.info.render.triangles);
  if(s.zoom>1){
   const side=Math.min(cw*.34,ch*.36,250),x=Math.max(10,cw*(portrait?.56:.52)),y=ch*(portrait?.49:.12);
   const center=V(cx+s.magnifierPos[0]+(compare?-.75:0),.26,cz+s.magnifierPos[1]);
   close.position.copy(center).add(V(.2,1.8/s.zoom,1.16/s.zoom));close.lookAt(center);
   renderer.setScissorTest(true);renderer.setScissor(x,y,side,side);renderer.setViewport(x,y,side,side);renderer.render(scene,close);renderer.setScissorTest(false);
  }
  dirty=progress<1;
 }
 function loop(t:number){id=requestAnimationFrame(loop);if(dirty&&!lost&&!document.hidden&&(!state?.paused||last===0)){update(t);last=t;}}
 id=requestAnimationFrame(loop);
 const abort=new AbortController();
 renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();lost=true;onFallback();},{signal:abort.signal});
 renderer.domElement.addEventListener('webglcontextrestored',()=>{lost=false;dirty=true;onRestore();},{signal:abort.signal});
 return {apply,exportables:{workbench:scene,get tray_felt(){return tray(new T.Group(),0,0,3.17,2.28);},lamp_arm:lamp,magnifier:glass,sample_drawer:cabinet,shelf_props:shelf},canvas:renderer.domElement,dispose(){abort.abort();observer.disconnect();cancelAnimationFrame(id);
  const resources=new Set<any>(); const collect=(o:any)=>{if(o.geometry)resources.add(o.geometry);if(o.material){resources.add(o.material);if(o.material.map)resources.add(o.material.map);}};
  scene.traverse(collect);models.forEach(m=>m.traverse(collect));resources.forEach(o=>o.dispose());renderer.dispose();renderer.domElement.remove();
 }};
}




