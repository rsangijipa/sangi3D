import { THREE, clamp, rng, readJSON, download } from './runtime.js';
import { atmosphere, box, group, lamp, mat, mesh, orbit, orb, specks, tube, wood } from './scenery.js';
import { createClayMaterial } from '../../Sistema/shared/engine/materials.js';

const PROFILE_SIZE=35;
const HEIGHT=2.25;
const makeProfile=()=>Array.from({length:PROFILE_SIZE},(_,i)=>.57+.25*Math.sin(i/(PROFILE_SIZE-1)*Math.PI*1.1)+.05*(i/(PROFILE_SIZE-1)));
const validProfile=value=>Array.isArray(value)&&value.length===PROFILE_SIZE&&value.every(n=>Number.isFinite(n)&&n>=.28&&n<=1.25);
function profileShape(profile) {
  const outer=profile.map((radius,i)=>new THREE.Vector2(radius,HEIGHT*i/(PROFILE_SIZE-1)));
  const inner=profile.slice(2).map((radius,i)=>new THREE.Vector2(radius-.085,HEIGHT*(i+2)/(PROFILE_SIZE-1))).reverse();
  return [new THREE.Vector2(0,0),...outer,...inner,new THREE.Vector2(0,HEIGHT*2/(PROFILE_SIZE-1))];
}

export function ceramics(ctx) {
  const scene=ctx.scene;
  atmosphere(ctx,0x4b3f35,0x785232,0xffebd0,{fog:.041,fill:1.8,intensity:3});
  const walnut=wood(0x8a5c3e), shelf=wood(0x704931), metal=mat(0x6e777a,{metalness:.73,roughness:.33});
  const terracotta=mat(0xa96242), cream=mat(0xd9c9a5), chalk=mat(0xe0c29b);
  box(scene,mat(0x76644e),0,-1.28,0,34,.18,34);
  box(scene,walnut,0,-.18,0,8,.23,5.3);
  for(const x of [-3.6,3.6])for(const z of [-2.24,2.24])box(scene,shelf,x,-.76,z,.25,1.03,.24);
  tube(scene,mat(0x3d4243,{roughness:.34,metalness:.51}),0,.07,0,1.22,.29);
  const platter=tube(scene,metal,0,.23,0,1.17,.12);
  for(const r of [.89,1.04,1.13]){
    const line=mesh(scene,new THREE.TorusGeometry(r,.009,5,56),mat(0xa8a7a1),[0,.292,0]);
    line.rotation.x=Math.PI/2;
  }
  box(scene,cream,-1.9,-.015,1.18,.46,.16,.32).rotation.y=.31;
  for(let i=0;i<4;i++){
    const tool=box(scene,shelf,1.74+i*.18,-.01,1.21,.084,.085,.79);
    tool.rotation.y=(i-1.3)*.19;
    box(scene,metal,1.75+i*.19,.014,1.53,.12,.021,.19).rotation.y=(i-1.3)*.19;
  }
  tube(scene,terracotta,-2.2,.13,-1.3,.43,.43);
  tube(scene,mat(0x555e56,{roughness:.13}),-2.2,.35,-1.3,.398,.014);
  box(scene,shelf,1.6,.81,-5.6,9,.15,.77);
  box(scene,shelf,1.6,2.01,-5.6,9,.15,.77);
  for(let i=0;i<14;i++){
    const y=i<7?.9:2.10,x=(i%7-3)*1.08+1.35,z=-5.57;
    const height=.37+(i%4)*.14,r=.22+(i%3)*.055;
    const points=[[0,0],[r*.64,0],[r,height*.46],[r*.86,height*.78],[r*.61,height],[r*.52,height],[r*.51,height*.74],[0,.04]];
    mesh(scene,new THREE.LatheGeometry(points.map(v=>new THREE.Vector2(...v)),28),[terracotta,cream,chalk][i%3],[x,y,z]);
  }
  lamp(scene,0xffd4a1,24,-2.4,3.75,1.8,8);
  const bare=createClayMaterial({color:0xb67655,seed:171,quality:'LOW'});
  const glaze=new THREE.MeshPhysicalMaterial({color:0x568987,roughness:.22,clearcoat:.89,clearcoatRoughness:.25});
  let profile=makeProfile(), finish=0, rpm=42, pressure=.55, tool=0, fired=false;
  const loaded=ctx.load({});
  if(validProfile(loaded?.profile))profile=loaded.profile.slice();
  if(Number.isInteger(loaded?.finish)&&loaded.finish>=0&&loaded.finish<=3)finish=loaded.finish;
  fired=loaded?.fired===true;
  const pot=mesh(scene,new THREE.LatheGeometry(profileShape(profile),80),bare,[0,.29,0]);
  const camera=orbit(ctx,5.65,[0,1.40,0],.34,.33);
  const ray=new THREE.Raycaster(),cursor=new THREE.Vector2();
  const pressureRing=mesh(scene,new THREE.TorusGeometry(1,.012,6,72),new THREE.MeshBasicMaterial({color:0xffdaab}));
  pressureRing.rotation.x=Math.PI/2;
  pressureRing.visible=false;
  const history=[],redo=[];
  const finishes=[0xb67655,0x568987,0xa55649,0xd9d0b5];
  const gauge=ctx.reading();
  function refreshMesh(){
    pressureRing.visible=false;
    pot.geometry.dispose();
    pot.geometry=new THREE.LatheGeometry(profileShape(profile),80);
    pot.material=finish?glaze:bare;
    glaze.color.setHex(finishes[finish]);
    glaze.roughness=fired?.16:.32;
    bare.roughness=fired?.67:.86;
    gauge.textContent='Altura 22,5 cm · Parede 8,5 mm'+(fired?' · Queima concluída':'');
  }
  ctx.hint('Arraste sobre a peça para trabalhar o perfil. Use Shift ou botão direito para orbitar. No toque, selecione Orbitar.');
  ctx.select('Ferramenta',['Puxar','Comprimir','Alisar','Orbitar'],index=>{tool=index;});
  ctx.range('Rotação do torno · rpm',0,100,1,rpm,value=>{rpm=value;});
  ctx.range('Pressão',.1,1,.05,pressure,value=>{pressure=value;});
  const toolButtons=ctx.group();
  function remember(){history.push(profile.slice());if(history.length>35)history.shift();redo.length=0;}
  function shape(y,strength){
    fired=false;
    const at=clamp(y,0,1)*(PROFILE_SIZE-1);
    const previous=profile.slice();
    for(let i=1;i<PROFILE_SIZE;i++){
      const weight=Math.exp(-((i-at)**2)/15);
      const average=(previous[i-1]+previous[i]+previous[Math.min(i+1,PROFILE_SIZE-1)])/3;
      const delta=tool===2?(average-previous[i])*pressure*weight*strength:weight*pressure*.071*strength*(tool===1?-1:1);
      profile[i]=clamp(previous[i]+delta,.28,1.25);
    }
    refreshMesh();
    pressureRing.position.set(0,pot.position.y+HEIGHT*at/(PROFILE_SIZE-1),0);
    const ringRadius=profile[Math.round(at)]+.022;
    pressureRing.scale.set(ringRadius,ringRadius,1);
    pressureRing.visible=true;
  }
  function drawAt(p,strength,initial=false){
    cursor.set(p.x*2-1,1-p.y*2);
    ray.setFromCamera(cursor,ctx.camera);
    const hit=ray.intersectObject(pot,false)[0];
    pressureRing.visible=false;
    if(!hit)return false;
    if(initial)remember();
    shape((hit.point.y-pot.position.y)/HEIGHT,strength);
    return true;
  }
  let brushing=false;
  ctx.paint((p,phase)=>{
    if(phase==='end'||phase==='cancel'){brushing=false;pressureRing.visible=false;return;}
    if(tool===3||p.alternate){if(phase==='move')camera.drag(p);return;}
    if(phase==='start')brushing=drawAt(p,1,true);
    else if(brushing)drawAt(p,clamp(Math.hypot(p.dx,p.dy)/12,.16,1.2));
  });
  ctx.button('Modelar região central',()=>{if(tool===3)return;remember();shape(.56,2.5);ctx.say('Perfil central modelado.');},toolButtons,true);
  function undo(){
    if(!history.length)return;
    redo.push(profile.slice());profile=history.pop();refreshMesh();ctx.say('Deformação desfeita.');
  }
  ctx.button('Desfazer',undo,toolButtons);
  ctx.button('Refazer',()=>{if(redo.length){history.push(profile.slice());profile=redo.pop();refreshMesh();}},toolButtons);
  const paints=ctx.select('Acabamento',['Argila crua','Esmalte verde','Esmalte terracota','Esmalte marfim'],index=>{finish=index;fired=false;refreshMesh();});
  paints.value=String(finish);
  const molds=[
    makeProfile(),
    Array.from({length:PROFILE_SIZE},(_,i)=>.62+.34*Math.sin(i/(PROFILE_SIZE-1)*Math.PI)),
    Array.from({length:PROFILE_SIZE},(_,i)=>.44+.48*(i/(PROFILE_SIZE-1))),
    Array.from({length:PROFILE_SIZE},(_,i)=>.66+.04*Math.sin(i/(PROFILE_SIZE-1)*Math.PI*2)),
  ];
  ctx.select('Molde base',['Ânfora clássica','Vaso largo','Taça aberta','Cilindro'],index=>{
    remember();profile=molds[index].slice();fired=false;refreshMesh();ctx.say('Molde base aplicado.');
  });
  const files=ctx.group();
  function state(){return {version:1,profile:profile.slice(),finish,fired};}
  ctx.button('Simular queima',()=>{
    fired=true;refreshMesh();
    ctx.say(finish?'Queima concluída. O esmalte revelou um acabamento mais brilhante.':'Queima concluída. A peça mantém o aspecto da argila sem esmalte.');
  },files);
  ctx.button('Expor e salvar peça',()=>{
    if(ctx.save(state()))ctx.say('Peça exposta. O perfil e o acabamento foram salvos neste navegador.');
  },files);
  ctx.button('Exportar perfil',()=>download(JSON.stringify(state(),null,2),'perfil-ceramica.json'),files);
  ctx.file('Importar perfil JSON','.json',async file=>{
    const parsed=await readJSON(file);
    if(parsed?.version!==1||!validProfile(parsed.profile)||!Number.isInteger(parsed.finish)||parsed.finish<0||parsed.finish>3)throw new Error('Perfil ou acabamento inválido.');
    remember();profile=parsed.profile.slice();finish=parsed.finish;fired=parsed.fired===true;paints.value=String(finish);refreshMesh();
    ctx.say('Perfil importado.');
  });
  refreshMesh();
  return {
    key(key){if(key==='u')undo();},
    reset(){remember();profile=makeProfile();fired=false;camera.reset();refreshMesh();ctx.say('Perfil inicial restaurado. Use Desfazer para recuperar a forma anterior.');},
    update(dt){const angle=ctx.reduced?0:rpm*dt*Math.PI/30;platter.rotation.y+=angle;pot.rotation.y+=angle;},
    dispose(){bare.dispose();glaze.dispose();},
  };
}

const defaults={version:1,seed:2751,level:.013,preset:0,strokes:[]};
const brushes=['Elevar','Rebaixar','Suavizar','Pintar bioma','Orbitar'];
const limitStrokes=180;
const biomeColors=[0x7b8c62,0x9d794e,0x8095a1,0x518568];
const validWorld=w=>w?.version===1&&Number.isInteger(w.seed)&&w.seed>=0&&w.seed<=999999&&Number.isFinite(w.level)&&Math.abs(w.level)<=.08&&Number.isInteger(w.preset)&&w.preset>=0&&w.preset<4&&Array.isArray(w.strokes)&&w.strokes.length<=limitStrokes&&w.strokes.every(s=>Array.isArray(s)&&s.length===6&&s.every(Number.isFinite)&&Math.abs(Math.hypot(s[0],s[1],s[2])-1)<.015&&s[3]>=.05&&s[3]<=.5&&s[4]>=0&&s[4]<=3&&Number.isInteger(s[4])&&s[5]>.0&&s[5]<=.1);

export function planet(ctx) {
  const scene=ctx.scene, random=rng(8454);
  atmosphere(ctx,0x070d17,0x182132,0xffddb0,{fill:.73,intensity:3.7,sky:0x759ec9});
  const starPositions=new Float32Array(2400);
  for(let i=0;i<starPositions.length;i+=3){
    const u=random()*2-1,phi=random()*Math.PI*2,r=76+random()*32,h=Math.sqrt(1-u*u)*r;
    starPositions.set([Math.cos(phi)*h,u*r,Math.sin(phi)*h],i);
  }
  specks(scene,starPositions,0xd8e8ff,.109,.81);
  const geo=new THREE.SphereGeometry(2,104,72);
  const positions=geo.attributes.position;
  const original=new Float32Array(positions.array);
  const colors=new THREE.BufferAttribute(new Float32Array(positions.count*3),3);
  geo.setAttribute('color',colors);
  const earth=mesh(scene,geo,mat(0xffffff,{vertexColors:true,roughness:.81}));
  const water=orb(scene,mat(0x2c7190,{roughness:.28,metalness:.12}),0,0,0,2);
  const air=mesh(scene,new THREE.SphereGeometry(2.07,56,34),new THREE.ShaderMaterial({
    transparent:true,side:THREE.BackSide,depthWrite:false,blending:THREE.AdditiveBlending,
    uniforms:{tint:{value:new THREE.Color(0x5cadf0)}},
    vertexShader:'varying vec3 n; varying vec3 v; void main(){vec4 p=modelViewMatrix*vec4(position,1.);n=normalize(normalMatrix*normal);v=normalize(-p.xyz);gl_Position=projectionMatrix*p;}',
    fragmentShader:'uniform vec3 tint; varying vec3 n; varying vec3 v; void main(){float g=pow(1.-abs(dot(normalize(n),normalize(v))),4.);gl_FragColor=vec4(tint,g*.65);}',
  }));
  air.renderOrder=3;
  const reticle=mesh(scene,new THREE.TorusGeometry(.27,.011,6,42),new THREE.MeshBasicMaterial({color:0xffdf8d,depthWrite:false}));
  reticle.visible=false;
  const camera=orbit(ctx,6.2,[0,0,0],.16,.47);
  const nz=new THREE.Vector3(0,0,1),point=new THREE.Vector3();
  const cursorRay=new THREE.Raycaster(),cursor=new THREE.Vector2(),surface=new THREE.Sphere(new THREE.Vector3(),2.02);
  let world=ctx.load(defaults);
  if(!validWorld(world))world=structuredClone(defaults);
  else world=structuredClone(world);
  let radius=.22,tool=0,painting=false,dirty=true,cut=0,compare=false;
  const redo=[];
  const gauges=ctx.reading();
  const color=new THREE.Color(),land=new THREE.Color();
  const shore=new THREE.Color(0xc8ad78),ice=new THREE.Color(0xd9e8e8);
  function baseHeight(x,y,z,seed){
    const shift=(seed%1903)*.017;
    return Math.sin(x*4.8+z*2.9+shift)*Math.cos(y*5.03-x*2.52)*.079
      +Math.cos(z*8.3+y*7.5+shift*.6)*Math.sin(x*8.2+z*4.3)*.026
      +Math.sin(x*33+y*38+z*23)*Math.cos(y*28-z*31+shift)*.007;
  }
  function rebuild(){
    const strokes=compare?[]:world.strokes.slice(0,cut);
    for(let i=0;i<positions.count;i++){
      const off=i*3,x=original[off]/2,y=original[off+1]/2,z=original[off+2]/2;
      let h=baseHeight(x,y,z,world.seed),painted=false;
      for(const [sx,sy,sz,r,mode,delta] of strokes){
        const dist=2-2*(x*sx+y*sy+z*sz);
        if(dist>r*r)continue;
        const influence=(1-dist/(r*r))**2;
        if(mode===2)h*=1-influence*.65;
        else if(mode===3)painted ||= influence>.17;
        else h+=influence*delta*(mode===1?-1:1);
      }
      h=clamp(h,-.18,.24);
      const r=2+h;
      positions.setXYZ(i,x*r,y*r,z*r);
      const texture=.90+Math.sin(x*17+y*11+z*15)*Math.cos(z*12-y*9)*.06+h*1.6;
      land.setHex(biomeColors[world.preset]).multiplyScalar(texture);
      const coast=THREE.MathUtils.smoothstep(h,world.level-.004,world.level+.044);
      const snow=Math.max(THREE.MathUtils.smoothstep(Math.abs(y),.73,.86),THREE.MathUtils.smoothstep(h,.093,.141));
      if(painted)color.setHex(0xd9a456);
      else color.lerpColors(shore,land,coast).lerp(ice,snow);
      colors.setXYZ(i,color.r,color.g,color.b);
    }
    positions.needsUpdate=true;colors.needsUpdate=true;geo.computeVertexNormals();
    water.scale.setScalar(2+world.level);
    gauges.textContent=(compare?'Antes das pinceladas · ':cut+' '+(cut===1?'alteração':'alterações')+' · ')+'Seed '+world.seed;
    dirty=false;
  }
  cut=world.strokes.length;
  ctx.hint('Arraste sobre o globo para pintar. Shift ou botão direito orbita. No toque, alterne para Orbitar.');
  ctx.select('Ferramenta',brushes,index=>{tool=index;reticle.visible=false;});
  const preset=ctx.select('Bioma base',['Oceânico','Árido','Glacial','Tropical'],index=>{world.preset=index;dirty=true;});
  const seed=ctx.input('Seed','number',{min:0,max:999999,step:1,value:String(world.seed)});
  ctx.on(seed,'change',()=>{
    const value=seed.valueAsNumber;
    if(Number.isInteger(value)&&value>=0&&value<=999999){world.seed=value;dirty=true;}
    else seed.value=String(world.seed);
  });
  const level=ctx.range('Nível do mar',-.075,.075,.001,world.level,value=>{world.level=value;dirty=true;});
  ctx.range('Raio do pincel',.05,.5,.01,radius,value=>{radius=value;});
  function sync(){
    preset.value=String(world.preset);seed.value=String(world.seed);
    level.value=String(world.level);
    level.dispatchEvent(new Event('input'));
    dirty=true;
  }
  function add(direction){
    if(tool===4)return;
    if(compare){ctx.say('Volte à versão editada para aplicar o pincel.');return;}
    if(cut>=limitStrokes){ctx.say('Limite de 180 pinceladas. Exporte ou desfaça uma alteração para continuar.');return;}
    redo.length=0;
    world.strokes.length=cut;
    world.strokes.push([...direction,radius,tool,.069]);
    cut=world.strokes.length;dirty=true;
  }
  let lastStroke=new THREE.Vector3();
  ctx.paint((p,phase)=>{
    if(phase==='end'||phase==='cancel'){painting=false;return;}
    if(tool===4||p.alternate){if(phase==='move')camera.drag(p);return;}
    cursor.set(p.x*2-1,1-p.y*2);
    cursorRay.setFromCamera(cursor,ctx.camera);
    if(!cursorRay.ray.intersectSphere(surface,point)){reticle.visible=false;return;}
    point.normalize();
    reticle.position.copy(point).multiplyScalar(2.25);
    reticle.quaternion.setFromUnitVectors(nz,point);
    reticle.scale.setScalar(radius/.17);
    reticle.visible=true;
    if(phase==='start'||painting&&lastStroke.distanceToSquared(point)>.024){
      add(point.toArray());lastStroke.copy(point); painting=true;
    }
  });
  const ring=mesh(scene,new THREE.RingGeometry(2.55,3.35,64),mat(0xc8d8e6,{side:THREE.DoubleSide,transparent:true,opacity:.32,depthWrite:false}),[0,0,0]);
  ring.rotation.x=Math.PI/2.3;ring.visible=false;
  const actions=ctx.group();
  ctx.button('Aplicar no centro',()=>{
    point.copy(ctx.camera.position).normalize();add(point.toArray());ctx.say('Pincel aplicado no hemisfério visível.');
  },actions,true);
  ctx.button('Desfazer',()=>{if(cut){redo.push(world.strokes[--cut]);dirty=true;}},actions);
  ctx.button('Refazer',()=>{if(redo.length){world.strokes[cut++]=redo.pop();dirty=true;}},actions);
  ctx.button('Nova seed',()=>{world.seed=Math.floor(Math.random()*900000)+10000;sync();ctx.say('Nova seed gerada: '+world.seed+'.');},actions);
  ctx.button('Anel orbital',()=>{ring.visible=!ring.visible;ctx.say(ring.visible?'Anel orbital ativado.':'Anel orbital ocultado.');},actions);
  const compareButton=ctx.button('Comparar com a base',()=>{
    compare=!compare;
    compareButton.setAttribute('aria-pressed',String(compare));
    compareButton.textContent=compare?'Voltar à versão editada':'Comparar com a base';
    dirty=true;
  },actions);
  const files=ctx.group();
  const state=()=>({...world,strokes:world.strokes.slice(0,cut)});
  ctx.button('Salvar planeta',()=>{if(ctx.save(state()))ctx.say('Mundo salvo neste navegador.');},files);
  ctx.button('Exportar mundo',()=>download(JSON.stringify(state(),null,2),'planeta.json'),files);
  ctx.file('Importar mundo JSON','.json',async file=>{
    const data=await readJSON(file);
    if(!validWorld(data))throw new Error('Mundo inválido ou incompatível.');
    world=data;cut=world.strokes.length;redo.length=0;sync();ctx.say('Mundo importado com a seed e as pinceladas.');
  });
  sync();rebuild();
  return {reset(){cut=0;redo.length=0;world=structuredClone(defaults);camera.reset();sync();ctx.say('Planeta restaurado. O arquivo salvo permanece disponível.');},
    update(){if(dirty)rebuild();},dispose(){earth.material.dispose();}};
}
