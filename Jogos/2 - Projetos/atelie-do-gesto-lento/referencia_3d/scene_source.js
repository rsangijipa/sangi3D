import * as THREE from '__THREE__';
const $=s=>document.querySelector(s), stage=$('#stage');
let renderer;
try{renderer=new THREE.WebGLRenderer({antialias:true,alpha:false});}catch(e){$('#status').textContent='A prévia precisa de WebGL. Consulte a imagem de referência na pasta assets.';throw e;}
renderer.setPixelRatio(Math.min(devicePixelRatio,1.7));renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.12;stage.append(renderer.domElement);
const scene=new THREE.Scene();scene.background=new THREE.Color('#d3c7b3');scene.fog=new THREE.Fog('#d3c7b3',7,15);
const camera=new THREE.PerspectiveCamera(41,1,.02,30);let angle=.22,distance=1.38,elevation=.49,wide=false;
const target=new THREE.Vector3(0,1.03,0);function updateCamera(){camera.position.set(target.x+Math.sin(angle)*distance,target.y+elevation,target.z+Math.cos(angle)*distance);camera.lookAt(target);}
function mat(color,roughness=.8){return new THREE.MeshStandardMaterial({color,roughness,metalness:0});}
function texture(kind){const c=document.createElement('canvas');c.width=c.height=512;const x=c.getContext('2d');x.fillStyle=kind==='wood'?'#a6815e':'#ddd2bc';x.fillRect(0,0,512,512);let seed=53;const rand=()=>{seed=(seed*16807)%2147483647;return(seed-1)/2147483646;};for(let i=0;i<3000;i++){const p=rand()*512,q=rand()*512;x.strokeStyle=kind==='wood'?`rgba(54,29,12,${rand()*.12})`:`rgba(80,64,42,${rand()*.06})`;x.lineWidth=rand()*1.5+.3;x.beginPath();x.moveTo(p,q);x.lineTo(p+(kind==='wood'?rand()*180:2),q+(kind==='wood'?rand()*2:1));x.stroke();}const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(kind==='wood'?3:2,2);return t;}
const wood=mat('#b18c69',.72);wood.map=texture('wood');const dark=mat('#66503b');const wall=mat('#e7ddcb');wall.map=texture('wall');const clay=mat('#a86344',.8);const cream=mat('#c7b99c',.9);const olive=mat('#68734a',.9);
const tex=new THREE.TextureLoader().load('__CLAY__');tex.colorSpace=THREE.SRGBColorSpace;tex.wrapS=tex.wrapT=THREE.RepeatWrapping;tex.repeat.set(3,2);clay.map=tex;clay.color.set('#eee4d9');clay.bumpMap=tex;clay.bumpScale=.00065;
function mesh(g,m,x=0,y=0,z=0,parent=scene){const o=new THREE.Mesh(g,m);o.position.set(x,y,z);o.castShadow=o.receiveShadow=true;parent.add(o);return o;}
function box(w,h,d,m,x,y,z,parent=scene){return mesh(new THREE.BoxGeometry(w,h,d),m,x,y,z,parent);}
function cyl(rt,rb,h,m,x,y,z,parent=scene){return mesh(new THREE.CylinderGeometry(rt,rb,h,64),m,x,y,z,parent);}
box(5,.08,5,mat('#9d927e'),0,-.04,0);box(4.6,2.85,.10,wall,0,1.425,-2.1);box(.1,2.85,4.2,wall,2.3,1.425,0);
// Left wall divided around a real opening.
box(.1,1,4.2,wall,-2.3,.5,0);box(.1,.35,4.2,wall,-2.3,2.675,0);box(.1,1.5,.8,wall,-2.3,1.75,-1.7);box(.1,1.5,1.55,wall,-2.3,1.75,1.325);
const outdoor=mesh(new THREE.PlaneGeometry(2.3,1.65),new THREE.MeshBasicMaterial({color:'#e9e9cb'}),-2.36,1.75,-.25);outdoor.rotation.y=Math.PI/2;
for(const z of [-1.32,-.64,.08,.82])box(.14,1.58,.045,dark,-2.24,1.76,z);
for(const y of [1,1.73,2.5])box(.15,.055,2.25,dark,-2.24,y,-.25);box(.25,.08,2.4,wood,-2.2,.98,-.25);
// Workbench with separated boards and structural rails.
for(let n=0;n<5;n++)box(2.4,.065,.173,wood,0,.78,(n-2)*.176);
for(const x of [-1.02,1.02])for(const z of [-.31,.31])box(.09,.74,.09,dark,x,.37,z);
box(2.13,.09,.06,dark,0,.28,-.31);box(2.13,.09,.06,dark,0,.28,.31);
cyl(.265,.27,.038,dark,0,.832,0);cyl(.25,.25,.018,wood,0,.86,0);
const pottery=new THREE.Group();pottery.position.y=.87;scene.add(pottery);
function potMaterial(c){return mat(c,.82);}
function vessel(parent,r,h,m,style=0){const pts=[];const bottom=.018;pts.push(new THREE.Vector2(0,0),new THREE.Vector2(r*.68,0));for(let j=0;j<=36;j++){const t=j/36;let rad=r*(.70+.32*Math.sin(t*Math.PI)-.10*t);if(style===1)rad=r*(.4+.65*t);pts.push(new THREE.Vector2(rad,h*t));}const top=pts[pts.length-1].x;pts.push(new THREE.Vector2(top-.012,h));for(let j=35;j>=0;j--){const t=j/36;let rad=r*(.70+.32*Math.sin(t*Math.PI)-.10*t)-.012;if(style===1)rad=r*(.4+.65*t)-.012;pts.push(new THREE.Vector2(Math.max(.008,rad),bottom+(h-bottom)*t));}pts.push(new THREE.Vector2(0,bottom));const g=new THREE.LatheGeometry(pts,112);const a=g.attributes.position;for(let i=0;i<a.count;i++){const y=a.getY(i),x=a.getX(i),z=a.getZ(i);const theta=Math.atan2(z,x);const f=1+.008*Math.sin(theta*3+y*33)+.003*Math.sin(y*280);a.setXYZ(i,x*f,y,z*f);}g.computeVertexNormals();return mesh(g,m,0,0,0,parent);}
vessel(pottery,.148,.30,clay);pottery.rotation.y=.4;
// Recessed turning rings.
for(let r=.17;r<.247;r+=.018){const o=mesh(new THREE.TorusGeometry(r,.0009,5,100),dark,0,.87,0);o.rotation.x=Math.PI/2;}
// Linen with geometric folds.
const clothG=new THREE.PlaneGeometry(.53,.36,36,28);clothG.rotateX(-Math.PI/2);const cp=clothG.attributes.position;for(let i=0;i<cp.count;i++){const x=cp.getX(i),z=cp.getZ(i);cp.setY(i,.004+Math.sin(x*70+z*12)*.0025+Math.sin(z*31)*.002);}clothG.computeVertexNormals();const cloth=mesh(clothG,cream,-.62,.819,.08);cloth.material.side=THREE.DoubleSide;
function tool(x,z,rot){const g=new THREE.Group();g.position.set(x,.831,z);g.rotation.y=rot;scene.add(g);const h=mesh(new THREE.CapsuleGeometry(.008,.19,5,10),wood,0,.007,0,g);h.rotation.z=Math.PI/2;const b=mesh(new THREE.SphereGeometry(.022,20,12),wood,.118,.006,0,g);b.scale.set(1.8,.15,.65);}tool(-.62,.07,.2);tool(-.67,.16,-.09);
const bowl=new THREE.Group();bowl.position.set(.55,.818,.07);scene.add(bowl);vessel(bowl,.105,.055,mat('#c6b58c'),1);const water=cyl(.09,.09,.002,new THREE.MeshPhysicalMaterial({color:'#b3b8a2',roughness:.17,transparent:true,opacity:.7}),0,.047,0,bowl);
// Background shelves and varied pieces.
for(const y of [1.25,1.88]){box(1.6,.055,.30,wood,.90,y,-1.87);for(const x of [.25,1.55])box(.045,.28,.25,dark,x,y-.16,-1.88);for(let n=0;n<4;n++){const g=new THREE.Group();g.position.set(.30+n*.38,y+.028,-1.85);scene.add(g);vessel(g,.065+(n%2)*.025,.10+(n%3)*.045,potMaterial(['#a4684c','#d1c3a2','#6a7053','#8e7154'][n]),n%2);}}
// Stool and plant.
cyl(.22,.23,.06,wood,-1.12,.49,-.92);for(let n=0;n<3;n++){const a=n*Math.PI*2/3;const leg=box(.045,.49,.045,dark,-1.12+Math.cos(a)*.14,.245,-.92+Math.sin(a)*.14);leg.rotation.z=.08;}
const plant=new THREE.Group();plant.position.set(-1.77,0,-1.35);scene.add(plant);cyl(.18,.135,.29,mat('#b58b69'),0,.145,0,plant);for(let i=0;i<17;i++){const a=i*2.399,h=.45+(i%5)*.13;const stem=mesh(new THREE.CylinderGeometry(.002,.003,h,5),olive,Math.sin(a)*.10,.27+h/2,Math.cos(a)*.10,plant);stem.rotation.z=Math.sin(a)*.22;const leaf=mesh(new THREE.SphereGeometry(.10,14,10),olive,Math.sin(a)*.19,.27+h,Math.cos(a)*.19,plant);leaf.scale.set(.55,1.7,.10);leaf.rotation.set(.6,a,.3);}
const sun=new THREE.DirectionalLight('#ffe2b4',3.5);sun.position.set(-3,4,2);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);sun.shadow.camera.left=-3;sun.shadow.camera.right=3;sun.shadow.camera.top=3;sun.shadow.camera.bottom=-3;sun.shadow.normalBias=.015;sun.shadow.bias=-.0001;scene.add(sun);scene.add(new THREE.HemisphereLight('#ede5d0','#88715c',2));const fill=new THREE.DirectionalLight('#dbe5eb',.5);fill.position.set(2,3,3);scene.add(fill);
function resize(){renderer.setSize(innerWidth,innerHeight);camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();updateCamera();}addEventListener('resize',resize);resize();
$('#turn').oninput=e=>pottery.rotation.y=Number(e.target.value)*Math.PI/180;$('#light').oninput=e=>sun.intensity=Number(e.target.value);$('#view').onclick=()=>{wide=!wide;distance=wide?3.4:1.38;elevation=wide?.9:.49;$('#view').textContent=wide?'Ver a peça':'Ver o ambiente';updateCamera();};$('#reset').onclick=()=>{angle=.22;distance=1.38;elevation=.49;wide=false;$('#view').textContent='Ver o ambiente';updateCamera();};
let drag=null;renderer.domElement.addEventListener('pointerdown',e=>{drag={x:e.clientX,y:e.clientY};renderer.domElement.setPointerCapture(e.pointerId);});renderer.domElement.addEventListener('pointermove',e=>{if(!drag)return;angle-=.004*(e.clientX-drag.x);angle=THREE.MathUtils.clamp(angle,-.8,.8);elevation=THREE.MathUtils.clamp(elevation+.002*(e.clientY-drag.y),.2,1.25);drag={x:e.clientX,y:e.clientY};updateCamera();});for(const k of ['pointerup','pointercancel'])renderer.domElement.addEventListener(k,()=>drag=null);renderer.domElement.addEventListener('wheel',e=>{e.preventDefault();distance=THREE.MathUtils.clamp(distance+e.deltaY*.001, .85,3.6);updateCamera();},{passive:false});
let active=true;document.addEventListener('visibilitychange',()=>active=!document.hidden);renderer.setAnimationLoop(()=>{if(active)renderer.render(scene,camera);});$('#status').textContent='Arraste para observar • role para aproximar';window.previewReady=true;
