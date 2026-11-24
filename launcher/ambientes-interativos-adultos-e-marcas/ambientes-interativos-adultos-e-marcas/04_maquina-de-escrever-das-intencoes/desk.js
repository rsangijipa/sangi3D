import * as T from '/shared/vendor/three.module.js';
import { MaterialFactory } from '/shared/engine/materials.js';
import { beam, makePlant, mesh, profile, roundedBox } from '/shared/engine/scene-details.js';
import { createStudioEnvironment } from '/shared/engine/studio-environment.js';

const rows = ['QWERTYUIOP','ASDFGHJKLÇ','ZXCVBNM,.?'];
export const keyRows = rows;

export function createDesk(host, sheetTexture, actions) {
  window.THREE = T;
  const mobile = matchMedia('(max-width:760px) and (orientation:portrait)');
  const reducedMotion = matchMedia('(prefers-reduced-motion:reduce)');
  const renderer=new T.WebGLRenderer({antialias:true,powerPreference:'high-performance'});
  renderer.toneMapping=T.ACESFilmicToneMapping;
  renderer.toneMappingExposure=1.12;
  renderer.shadowMap.enabled=true;
  renderer.shadowMap.type=T.PCFShadowMap;
  host.prepend(renderer.domElement);
  const scene=new T.Scene();
  const environment=createStudioEnvironment(renderer);
  scene.environment=environment.texture;
  scene.environmentIntensity=.66;
  scene.background=new T.Color(0x242621);
  scene.add(new T.HemisphereLight(0xdce8e3,0x553324,1.0));
  const keyLight=new T.DirectionalLight(0xffd9a4,2.8);
  keyLight.position.set(-2.2,4.9,2.8);
  keyLight.castShadow=true;
  Object.assign(keyLight.shadow.camera,{left:-3.2,right:3.2,top:3,bottom:-2.7,near:.5,far:10});
  keyLight.shadow.mapSize.set(mobile.matches?1024:2048,mobile.matches?1024:2048);
  keyLight.shadow.bias=-.00024;
  keyLight.shadow.normalBias=.016;
  keyLight.shadow.radius=3;
  scene.add(keyLight);
  const fill=new T.DirectionalLight(0x97c5de,1.4);
  fill.position.set(3.2,3,-2.5);
  scene.add(fill);
  const standard=(color,roughness=.74,metalness=0)=>new T.MeshStandardMaterial({color,roughness,metalness});
  const grain=MaterialFactory.createWoodTexture(1024,512,47);
  const wood=(color,roughness)=>new T.MeshStandardMaterial({color,roughness,map:grain,bumpMap:grain,bumpScale:.010});
  const oak=wood(0xad723f,.53);
  const trim=wood(0x5b3a28,.55);
  const black=standard(0x211f1b,.82);
  const rubber=standard(0x1d2523,.87);
  const chrome=standard(0xd4d5cc,.27,.92);
  const brass=standard(0xcca054,.38,.86);
  const ink=standard(0x632d28,.5);
  const microsurface=MaterialFactory.createNoiseTexture(256,256,8);
  const veneer=new T.MeshPhysicalMaterial({color:0x397d6b,roughness:.45,metalness:.19,clearcoat:.57,
    clearcoatRoughness:.29,bumpMap:microsurface,bumpScale:.0025});
  const enamel=veneer.clone();
  enamel.color.set(0x2d665b);
  const cream=new T.MeshPhysicalMaterial({color:0xe1c998,roughness:.35,clearcoat:.7});
  const ceramic=new T.MeshPhysicalMaterial({color:0xdbceac,roughness:.27,clearcoat:.79});
  const wall=standard(0x3f5049,.96);
  wall.bumpMap=microsurface;
  wall.bumpScale=.026;
  const bevel=(parent,w,h,d,r,material,x,y,z,shadow=true)=>mesh(parent,roundedBox(w,h,d,r),material,x,y,z,shadow);
  const box=(parent,w,h,d,material,x,y,z,shadow=true)=>mesh(parent,new T.BoxGeometry(w,h,d),material,x,y,z,shadow);
  const lathe=(parent,points,mat,x,y,z,shadow=true)=>mesh(parent,profile(points,38),mat,x,y,z,shadow);
  function cylinder(parent,radius,height,mat,x,y,z,horizontal=false,shadow=true) {
    const part=mesh(parent,new T.CylinderGeometry(radius,radius,height,28),mat,x,y,z,shadow);
    if(horizontal) part.rotation.z=Math.PI/2;
    return part;
  }
  function plate(parent, w,h,canvas,x,y,z) {
    const texture=new T.CanvasTexture(canvas);
    texture.colorSpace=T.SRGBColorSpace;
    texture.anisotropy=4;
    return mesh(parent,new T.PlaneGeometry(w,h),new T.MeshStandardMaterial({map:texture,roughness:.69}),x,y,z,false);
  }
  const canvas=(w,h)=>{
    const output=document.createElement('canvas');
    output.width=w;
    output.height=h;
    return output;
  };

  box(scene,16,7,.16,wall,0,2.95,-2.8,false);
  box(scene,16,.16,12,trim,0,-.13,-.9,false);
  box(scene,13,.68,.15,trim,0,.37,-2.68,false);
  for(const y of [.69,.74]) box(scene,13,.06,.13,oak,0,y,-2.58,false);
  const planks=new T.InstancedMesh(new T.BoxGeometry(4.85,.12,.444),oak,7);
  const m=new T.Matrix4();
  for (let i=0;i<7;i++){
    planks.setMatrixAt(i,m.makeTranslation(0,1.01,(i-3)*.45));
    planks.setColorAt(i,new T.Color().setHSL(.078,.24,.78+.07*Math.sin(i*3.2)));
  }
  planks.receiveShadow=true;
  scene.add(planks);
  bevel(scene,4.93,.14,3.19,.05,oak,0,.976,0);
  bevel(scene,4.63,.33,2.98,.063,trim,0,.777,0);
  for(const x of [-2.2,2.2]) for(const z of [-1.37,1.37]) bevel(scene,.21,.74,.21,.046,trim,x,.37,z);
  bevel(scene,1.17,.21,.046,.025,oak,0,.784,1.511,false);
  bevel(scene,.24,.054,.072,.019,brass,0,.779,1.554,false);

  const sky=canvas(768,1024);
  const skyCtx=sky.getContext('2d');
  const dusk=skyCtx.createLinearGradient(0,0,0,1024);
  dusk.addColorStop(0,'#253741');
  dusk.addColorStop(.74,'#455e5c');
  dusk.addColorStop(1,'#838275');
  skyCtx.fillStyle=dusk;
  skyCtx.fillRect(0,0,768,1024);
  const glow=skyCtx.createRadialGradient(575,230,1,575,230,180);
  glow.addColorStop(0,'#d3e4d1b3');
  glow.addColorStop(1,'#779ca000');
  skyCtx.fillStyle=glow;
  skyCtx.fillRect(390,40,380,380);
  skyCtx.fillStyle='#cddacc';
  skyCtx.beginPath();
  skyCtx.arc(575,230,30,0,Math.PI*2);
  skyCtx.fill();
  for(let i=0;i<60;i++){
    const x=(i*231.12)%768, height=100+(i*81)%430;
    skyCtx.fillStyle=i%4?'#253930':'#314541';
    skyCtx.fillRect(x,1024-height,19+i%9,height);
    if(i%3===0) { skyCtx.fillStyle='#d2a86a7d'; skyCtx.fillRect(x+4,1032-height,2.5,4); }
  }
  const pane=plate(scene,2.1,2.85,sky,-2.84,2.49,-2.665);
  pane.material.emissiveMap=pane.material.map;
  pane.material.emissive.set(0x647b7c);
  pane.material.emissiveIntensity=.55;
  for (const x of [-3.91,-2.84,-1.77]) bevel(scene,.089,2.98,.13,.022,trim,x,2.49,-2.59,false);
  for (const y of [1,1.96,2.95,3.96]) bevel(scene,2.21,.084,.13,.021,trim,-2.84,y,-2.59,false);
  bevel(scene,2.29,.085,.35,.025,oak,-2.84,.97,-2.50,false);
  makePlant(scene,2.12,-2.36,1.07,15,ceramic);
  bevel(scene,2.75,.10,.44,.032,trim,1.62,2.15,-2.52,false);
  for(let i=0;i<9;i++){
    const h=.22+.24*Math.sin(i*5.3)**2;
    const color=[0x69503a,0x676144,0x394c43,0x9a6e49,0x4a3429][i%5];
    bevel(scene,.128,h,.23,.013,standard(color),.45+i*.166,2.2+h/2,-2.42,false);
  }

  const lamp=new T.Group();
  lamp.position.set(-1.54,1.072,-.49);
  lamp.name='Luminária de latão';
  scene.add(lamp);
  lathe(lamp,[[0,0],[.27,0],[.29,.021],[.282,.059],[.226,.088],[.102,.116],[.065,.156],[0,.161]],brass,0,0,0);
  lathe(lamp,[[.044,.13],[.061,.17],[.046,.22],[.028,.28],[.029,.96],[.05,1]],brass,0,0,0);
  const arm=new T.CatmullRomCurve3([[0,.95,0],[.015,1.20,0],[.14,1.36,0],[.32,1.36,0],[.45,1.23,0]].map(a=>new T.Vector3(...a)));
  mesh(lamp,new T.TubeGeometry(arm,28,.029,10,false),brass,0,0,0);
  const shade=lathe(lamp,[[.063,.30],[.12,.294],[.18,.25],[.25,.174],[.34,.096],[.382,.061],
    [.383,.035],[.365,.033],[.359,.058],[.321,.081],[.229,.167],[.157,.224],[.064,.272]],brass,.48,.946,0);
  shade.rotation.z=.14;
  lathe(lamp,[[.089,.148],[.105,.095],[.096,.061],[.061,.041],[0,.034]],new T.MeshStandardMaterial({color:0xffe4a1,emissive:0xffcc76,emissiveIntensity:2}),.49,.957,0,false);
  const lampLight=new T.PointLight(0xffc37a,16,4);
  lampLight.position.set(.52,1.015,.058);
  lamp.add(lampLight);

  const writer=new T.Group();
  writer.position.set(.08,1.071,.04);
  writer.name='Máquina Atelier Palavra Viva';
  scene.add(writer);
  for(const x of [-.85,.85]) for(const z of [-.52,.61]) cylinder(writer,.091,.07,rubber,x,.04,z);
  bevel(writer,2.19,.105,1.54,.049,black,0,.111,0);
  function housing(w,material,shape,offset) {
    const form=new T.Shape();
    shape.forEach(([z,y],i)=>i?form.lineTo(-z,y):form.moveTo(-z,y));
    form.closePath();
    const geometry=new T.ExtrudeGeometry(form,{depth:w-.052,steps:1,bevelEnabled:true,bevelSize:.026,bevelThickness:.026,bevelSegments:4});
    geometry.translate(0,0,-w/2+.026);
    geometry.rotateY(Math.PI/2);
    return mesh(writer,geometry,material,...offset);
  }
  housing(2.13,veneer,[[-.73,.13],[.72,.13],[.735,.24],[.59,.30],[.06,.431],[-.25,.48],[-.69,.45]],[0,0,0]);
  const railProfile=[[-.71,.19],[.70,.19],[.714,.258],[.58,.31],[.21,.41],[-.18,.52],[-.65,.56],[-.715,.48]];
  for(const x of [-.969,.969]) housing(.20,enamel,railProfile,[x,.014,0]);
  bevel(writer,1.78,.23,.52,.079,veneer,0,.449,-.45);
  const deck=bevel(writer,1.76,.048,.79,.018,rubber,0,.353,.227);
  deck.rotation.x=.244;
  bevel(writer,1.81,.077,.061,.023,veneer,0,.217,.748);
  bevel(writer,2.025,.025,.024,.007,brass,0,.170,.760,false);

  const manufacturer=canvas(768,165);
  const maker=manufacturer.getContext('2d');
  maker.fillStyle='#20493d';
  maker.fillRect(0,0,768,165);
  maker.strokeStyle='#c6a273';
  maker.lineWidth=5;
  maker.strokeRect(7,7,754,151);
  maker.fillStyle='#e5c994';
  maker.font='67px Georgia';
  maker.textAlign='center';
  maker.fillText('PALAVRA VIVA',384,83);
  maker.font='24px Courier New';
  maker.fillText('MÁQUINA DE ESCRITA',384,124);
  plate(writer,.53,.112,manufacturer,0,.492,-.173).rotation.x=-.57;
  for(const x of [-.52,.52]) {
    cylinder(writer,.208,.016,black,x,.566,-.37,false,false);
    const spool=mesh(writer,new T.TorusGeometry(.167,.025,10,30),chrome,x,.578,-.37,false);
    spool.rotation.x=-Math.PI/2;
    cylinder(writer,.146,.018,ink,x,.580,-.37,false,false);
    cylinder(writer,.031,.033,brass,x,.602,-.37,false,false);
  }
  box(writer,.82,.018,.061,ink,0,.585,-.34,false);
  const bars=new T.InstancedMesh(new T.BoxGeometry(.016,.016,.28),chrome,21);
  const dummy=new T.Object3D();
  for(let i=0;i<21;i++){
    const spread=(i-10)/10;
    dummy.position.set(spread*.22,.528,.025+Math.abs(spread)*.037);
    dummy.rotation.set(-.15,-spread*.69,0);
    dummy.updateMatrix();
    bars.setMatrixAt(i,dummy.matrix);
  }
  writer.add(bars);
  const typeBar=new T.Group();
  typeBar.position.set(0,.49,.127);
  writer.add(typeBar);
  bevel(typeBar,.029,.025,.35,.007,chrome,0,0,-.171,false);
  bevel(typeBar,.041,.042,.044,.007,brass,0,0,-.352,false);

  const keyRims=new T.InstancedMesh(new T.CylinderGeometry(.070,.064,.035,24),chrome,30);
  const stems=new T.InstancedMesh(new T.CylinderGeometry(.021,.017,.071,12),black,30);
  writer.add(keyRims,stems);
  keyRims.castShadow=true;
  const keyArt=canvas(1024,384);
  const letters=keyArt.getContext('2d');
  letters.textAlign='center';
  letters.textBaseline='middle';
  letters.font='bold 53px Georgia';
  for(const [row,chars] of rows.entries()){
    for(const [column,char] of [...chars].entries()){
      const x=column*102.4+51.2,y=row*128+64;
      letters.beginPath();
      letters.arc(x,y,42,0,Math.PI*2);
      letters.fillStyle='#25281f';
      letters.fill();
      letters.strokeStyle='#716951';
      letters.lineWidth=2.4;
      letters.stroke();
      letters.fillStyle='#f6e2af';
      letters.fillText(char,x,y+2);
    }
  }
  const keyMap=new T.CanvasTexture(keyArt);
  keyMap.colorSpace=T.SRGBColorSpace;
  keyMap.anisotropy=6;
  const letterMaterial=new T.MeshStandardMaterial({map:keyMap,roughness:.65,alphaTest:.45,side:T.DoubleSide});
  const keyPositions=[];
  const keyTops=[];
  function keyAt(i,drop) {
    const {x,y,z}=keyPositions[i];
    dummy.position.set(x,y-drop,z);
    dummy.rotation.set(.18,0,0);
    dummy.updateMatrix();
    keyRims.setMatrixAt(i,dummy.matrix);
    dummy.position.y=y-.039-drop*.6;
    dummy.updateMatrix();
    stems.setMatrixAt(i,dummy.matrix);
    keyTops[i].position.y=y+.018-drop;
    keyRims.instanceMatrix.needsUpdate=true;
    stems.instanceMatrix.needsUpdate=true;
  }
  for(const [row,chars] of rows.entries()){
    for(const [column,char] of [...chars].entries()){
      const x=(column-4.5)*.166+row*.027-.025;
      const y=.448-row*.047,z=.15+row*.185;
      const face=new T.PlaneGeometry(.154,.154);
      const uv=face.attributes.uv;
      for(let i=0;i<uv.count;i++) uv.setXY(i,(column+uv.getX(i))/10,(2-row+uv.getY(i))/3);
      const top=mesh(writer,face,letterMaterial,x,y+.018,z,false);
      top.rotation.x=-Math.PI/2+.18;
      keyPositions.push({x,y,z,char});
      keyTops.push(top);
      keyAt(keyPositions.length-1,0);
    }
  }
  const space=bevel(writer,.88,.052,.115,.026,black,0,.3,.713);
  const carriage=new T.Group();
  carriage.name='Carro, rolo e folha';
  carriage.position.set(0,.642,-.59);
  writer.add(carriage);
  bevel(carriage,2.27,.056,.139,.018,chrome,0,-.085,.066,false);
  for(const x of [-1.02,1.02]) bevel(carriage,.128,.231,.278,.035,veneer,x,-.027,.005);
  cylinder(carriage,.115,2,rubber,0,0,0,true);
  for(const x of [-1.13,1.13]){
    cylinder(carriage,.086,.29,chrome,x,0,0,true,false);
    cylinder(carriage,.119,.12,rubber,x*1.12,0,0,true);
    cylinder(carriage,.064,.019,chrome,x*1.18,0,0,true,false);
  }
  cylinder(carriage,.018,1.81,chrome,0,.083,.112,true,false);
  const lever=new T.Group();
  lever.position.set(-1.04,.026,-.07);
  carriage.add(lever);
  beam(lever,[0,0,0],[-.23,.13,.08],.039,.043,chrome);
  beam(lever,[-.23,.13,.08],[-.32,.149,.25],.038,.041,chrome);
  bevel(lever,.15,.061,.093,.023,black,-.358,.15,.272);
  const paper=new T.Group();
  paper.name='Folha datilografada';
  carriage.add(paper);
  const paperGeometry=new T.PlaneGeometry(1.37,1.13,20,24);
  const vertices=paperGeometry.attributes.position;
  for(let i=0;i<vertices.count;i++){
    const x=vertices.getX(i),y=vertices.getY(i);
    vertices.setZ(i,-.065*(y+.24)**2-.028*(x/.685)**2);
  }
  paperGeometry.computeVertexNormals();
  const sheet=mesh(paper,paperGeometry,new T.MeshStandardMaterial({map:sheetTexture,side:T.DoubleSide,roughness:.87,bumpMap:microsurface,bumpScale:.002}),0,.582,.069);
  paper.rotation.x=-.24;

  const journal=new T.Group();
  journal.position.set(1.68,1.074,-.47);
  journal.rotation.y=.22;
  scene.add(journal);
  bevel(journal,.68,.11,.83,.025,trim,0,.065,0);
  bevel(journal,.637,.081,.81,.019,cream,.018,.074,0,false);
  box(journal,.59,.015,.744,standard(0x674733),.044,.133,0,false);
  const saucer=new T.Group();
  saucer.position.set(1.59,1.071,.64);
  scene.add(saucer);
  lathe(saucer,[[0,0],[.283,0],[.326,.022],[.344,.053],[.36,.085],[.348,.087],[.307,.043],[.211,.029],[0,.032]],ceramic,0,0,0);
  lathe(saucer,[[0,.041],[.122,.041],[.145,.06],[.175,.134],[.214,.266],[.217,.289],[.203,.297],
    [.191,.279],[.167,.154],[.117,.079],[0,.079]],ceramic,0,0,0);
  const tea=new T.MeshPhysicalMaterial({color:0x69411d,roughness:.19,clearcoat:1});
  cylinder(saucer,.186,.008,tea,0,.246,0,false,false);
  const handle=mesh(saucer,new T.TorusGeometry(.092,.023,12,36),ceramic,.207,.183,-.05);
  handle.scale.y=1.14;
  const teaspoon=new T.Group();
  teaspoon.position.set(.218,.057,.195);
  teaspoon.rotation.y=-.41;
  saucer.add(teaspoon);
  bevel(teaspoon,.025,.016,.25,.006,chrome,0,0,0,false);
  const spoon=mesh(teaspoon,new T.SphereGeometry(.052,18,10),chrome,0,.012,.15,false);
  spoon.scale.set(.66,.18,1.12);

  const envelope=new T.Group();
  envelope.position.set(-1.43,1.083,.75);
  envelope.rotation.y=-.28;
  scene.add(envelope);
  const kraft=standard(0xb78b55,.89);
  kraft.bumpMap=microsurface;
  kraft.bumpScale=.008;
  bevel(envelope,.79,.041,.50,.015,kraft,0,.008,0);
  const triangular=new T.Shape();
  triangular.moveTo(-.387,0);
  triangular.lineTo(.387,0);
  triangular.quadraticCurveTo(.364,.05,0,.236);
  triangular.quadraticCurveTo(-.364,.05,-.387,0);
  const flapGeometry=new T.ShapeGeometry(triangular,14);
  flapGeometry.rotateX(Math.PI/2);
  const flap=mesh(envelope,flapGeometry,standard(0xcb9f63,.91),0,.03,-.244,false);
  flap.material.side=T.DoubleSide;
  beam(envelope,[-.366,.033,.22],[0,.033,.045],.009,.009,trim,false);
  beam(envelope,[.366,.033,.22],[0,.033,.045],.009,.009,trim,false);
  const stored=mesh(envelope,new T.PlaneGeometry(.61,.37),sheet.material,0,.046,.02,false);
  stored.rotation.x=-Math.PI/2;
  stored.visible=false;
  const stamp=new T.Group();
  stamp.name='Carimbo de madeira';
  const stampRest=new T.Vector3(-1.43,1.077,.28);
  stamp.position.copy(stampRest);
  scene.add(stamp);
  bevel(stamp,.26,.049,.20,.018,ink,0,.031,0);
  bevel(stamp,.29,.066,.22,.021,trim,0,.081,0);
  lathe(stamp,[[0,.104],[.046,.104],[.053,.14],[.042,.176],[.08,.215],[.086,.261],[.066,.30],[0,.32]],oak,0,0,0);
  const pen=new T.Group();
  pen.position.set(-.72,1.11,1.085);
  pen.rotation.y=.68;
  scene.add(pen);
  const penBody=lathe(pen,[[0,0],[.019,0],[.026,.083],[.031,.37],[.034,.43],[.034,.52],[.027,.55],[0,.558]],black,0,0,0,false);
  penBody.rotation.x=-Math.PI/2;
  for(const z of [-.35,-.41,-.515]) cylinder(pen,.035,.013,brass,0,0,z,false,false).rotation.x=Math.PI/2;
  bevel(pen,.021,.018,.18,.007,brass,.021,.026,-.44,false);

  const camera=new T.PerspectiveCamera(44,1,.045,35);
  const observer=new ResizeObserver(resize);
  const focus=new T.Vector3(.08,1.51,.065);
  const diagnostics=new URLSearchParams(location.search).has('diagnostics');
  let frame;
  let pause=false;
  let lost=false;
  let dirty=true;
  let previous=0;
  let position=0;
  let paperHeight=0;
  let activeKey=-1;
  let keyElapsed=0;
  let action='';
  let actionElapsed=0;
  let folded=false;
  const foldFrom=new T.Vector3();
  const foldTo=new T.Vector3();
  const contact=new T.Vector3(.0,1.79,.3);
  function resize() {
    dirty=true;
    renderer.setPixelRatio(Math.min(devicePixelRatio||1,mobile.matches?1.65:2));
    renderer.setSize(host.clientWidth,host.clientHeight,false);
    camera.aspect=host.clientWidth/Math.max(1,host.clientHeight);
    if(mobile.matches) camera.position.set(.8,2.73,3.54);
    else camera.position.set(1.26,2.64,camera.aspect>1.1?3.65:4.55);
    camera.fov=mobile.matches?49:43;
    camera.updateProjectionMatrix();
    camera.lookAt(focus);
  }
  function loop(now){
    frame=requestAnimationFrame(loop);
    const dt=Math.min(.05,(now-previous)*.001);
    previous=now;
    if(pause||lost) return;
    const moving=Math.abs(position-carriage.position.x)>.0005 ||
      (!folded&&Math.abs(paperHeight-paper.position.y)>.0005);
    if(!dirty&&!moving&&!action&&keyElapsed<=0) return;
    dirty=false;
    const snappy=reducedMotion.matches?1:Math.min(1,dt*17);
    carriage.position.x+=(position-carriage.position.x)*snappy;
    if(action!=='fold'&&!folded) paper.position.y+=(paperHeight-paper.position.y)*snappy;
    keyElapsed=Math.max(0,keyElapsed-dt);
    const hit=reducedMotion.matches?0:Math.sin(keyElapsed/.135*Math.PI);
    if(activeKey>=0) keyAt(activeKey,hit*.051);
    if(activeKey===-2) space.position.y=.30-hit*.034;
    typeBar.rotation.x=hit*1.12;
    actionElapsed+=dt;
    if(action==='return'){
      const t=Math.min(1,actionElapsed/.42);
      lever.rotation.y=-Math.sin(t*Math.PI)*.39;
      if(t===1) action='';
    }
    if(action==='stamp'){
      const t=Math.min(1,actionElapsed/.60);
      const lift=Math.sin(t*Math.PI);
      stamp.position.lerpVectors(stampRest,contact,lift);
      stamp.rotation.x=-lift*.74;
      if(t===1) action='';
    }
    if(action==='fold'){
      const t=Math.min(1,actionElapsed/.8);
      paper.scale.setScalar(Math.max(.18,1-t*.82));
      paper.position.lerpVectors(foldFrom,foldTo,t*t*(3-2*t));
      paper.position.y+=.19*Math.sin(Math.PI*t);
      paper.rotation.x=-.24-t*1.32;
      paper.rotation.z=t*.7;
      flap.rotation.x=-Math.sin(t*Math.PI)*1.8;
      stored.visible=t>.7&&t<.92;
      if (t===1) { paper.visible=false; action=''; }
    }
    renderer.render(scene,camera);
    if(diagnostics){
      renderer.domElement.dataset.drawCalls=renderer.info.render.calls;
      renderer.domElement.dataset.triangles=renderer.info.render.triangles;
    }
  }
  const ray=new T.Raycaster();
  const pointer=new T.Vector2();
  const targets=[
    [stamp,actions.stamp],[envelope,actions.fold],[lever,actions.returnCarriage],[writer,actions.focus],
  ];
  renderer.domElement.addEventListener('pointerup',event=>{
    const rect=renderer.domElement.getBoundingClientRect();
    pointer.set((event.clientX-rect.left)/rect.width*2-1,1-(event.clientY-rect.top)/rect.height*2);
    ray.setFromCamera(pointer,camera);
    for(const [group,callback] of targets) {
      if(ray.intersectObject(group,true).length) { callback(); return; }
    }
  });
  const status=document.querySelector('#scene-status');
  renderer.domElement.addEventListener('webglcontextlost',event=>{
    event.preventDefault();
    lost=true;
    status.textContent='A visualização 3D foi interrompida. Sua folha continua disponível.';
    status.hidden=false;
  });
  renderer.domElement.addEventListener('webglcontextrestored',()=>{lost=false;dirty=true;status.hidden=true;});
  observer.observe(host);
  resize();
  frame=requestAnimationFrame(loop);
  function clearMotion() {
    action='';
    stamp.position.copy(stampRest);
    stamp.rotation.x=0;
    lever.rotation.y=0;
    flap.rotation.x=0;
    stored.visible=false;
  }
  return {
    update({column,line,character,stored}) {
      dirty=true;
      position=-column*.018;
      paperHeight=Math.min(.47,line*.063);
      if(character){
        if(activeKey>=0) keyAt(activeKey,0);
        if(activeKey===-2) space.position.y=.3;
        const normalized=character.toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
        activeKey=character===' '?-2:keyPositions.findIndex(key=>key.char===character.toUpperCase()||key.char===normalized);
        keyElapsed=.135;
      }
      if(!stored && folded) {
        clearMotion();
        paper.visible=true;
        paper.scale.setScalar(1);
        paper.position.set(0,paperHeight,0);
        paper.rotation.set(-.24,0,0);
      }
      folded=stored;
    },
    animate(next) {
      clearMotion();
      dirty=true;
      if(reducedMotion.matches) {
        if(next==='fold') paper.visible=false;
        return;
      }
      if(next==='fold'){
        foldFrom.copy(paper.position);
        envelope.getWorldPosition(foldTo);
        carriage.worldToLocal(foldTo);
        foldTo.y+=.096;
      }
      action=next;
      actionElapsed=0;
    },
    pause(value) { pause=value; },
    dispose() {
      cancelAnimationFrame(frame);
      observer.disconnect();
      const resources=new Set();
      scene.traverse(object=>{
        if(object.geometry) resources.add(object.geometry);
        if(object.material) {
          for (const material of Array.isArray(object.material)?object.material:[object.material]){
            resources.add(material);
            for(const value of Object.values(material)) if(value?.isTexture) resources.add(value);
          }
        }
      });
      for(const resource of resources) resource.dispose();
      environment.dispose();
      renderer.dispose();
    }
  };
}
