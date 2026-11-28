import { THREE, clamp, rng } from './runtime.js';
import { atmosphere, box, beam, glow, group, lamp, mat, mesh, orbit, orb, sign, specks, tube, wood } from './scenery.js';

export function chamber(ctx){
  const scene=ctx.scene,random=rng(7414);
  atmosphere(ctx,0x334450,0x39434d,0xdcecff,{fill:1.50,intensity:2.55});
  const steel=mat(0x7d8d92,{roughness:.37,metalness:.64}),rubber=mat(0x323d45);
  const amber=mat(0xd89251,{metalness:.43,roughness:.27}),white=glow(0xcfecf2,.6);
  box(scene,steel,0,-.16,0,12,.3,10);
  box(scene,steel,0,3.5,-4.98,12.1,7.1,.25);
  for(const x of [-6,6])box(scene,steel,x,3.5,-.35,.21,7.0,9.25);
  box(scene,steel,0,7.0,-1,12,.2,8);
  for(let i=0;i<8;i++){
    const x=(i-3.5)*1.5;
    box(scene,rubber,x,3.52,-4.82,1.40,6.81,.07);
    box(scene,steel,x,2.91,-4.72,1.18,4.14,.13);
    box(scene,rubber,x,.54,-4.71,1.12,.31,.13);
    for(const y of [.83,4.96]){
      box(scene,mat(0x6e7777),x,y,-4.59,1.32,.043,.14);
      orb(scene,amber,x+.37,y,-4.52,.042);
    }
    box(scene,white,x,6.8,-2.6,.145,.022,3.1);
  }
  for(const z of [-3.8,3.8]){
    const ring=mesh(scene,new THREE.TorusGeometry(2.10,.038,6,60),amber,[0,.011,z*.52]);
    ring.rotation.x=Math.PI/2;
  }
  sign(scene,'CÂMARA DE ENSAIOS',0,5.8,-4.64,4,.45);
  lamp(scene,0xd2e4ff,27,0,6.35,1.95,14);
  lamp(scene,0xffc88d,18,-3.4,4.46,-2.6,8);
  const camera=orbit(ctx,14,[0,3.0,-.30],.21,.04);
  let gravity=0, impulse=4.1, restitution=.78, active=0, field=0;
  const spheres=[];
  const mo=mat(0xeea05a,{metalness:.45,roughness:.31}),mg=mat(0x9eacaf,{roughness:.41,metalness:.60}),mr=mat(0x81d3e2,{metalness:.57,roughness:.24});
  const sphereGeo=new THREE.SphereGeometry(.37,28,18),cubeGeo=new THREE.BoxGeometry(.64,.64,.64),ringGeo=new THREE.TorusGeometry(.32,.084,10,30);
  const kinds=[[sphereGeo,mo,.37],[cubeGeo,mg,.54],[ringGeo,mr,.42]];
  for(let i=0;i<3;i++){
    const [geometry,material,r]=kinds[i], object=mesh(scene,geometry,material);
    spheres.push({object,r,mass:[1,2,1.4][i],v:new THREE.Vector3(),kind:i});
  }
  const initial=[[-2.10,2.84,.1],[1.43,2.89,.02],[.21,3.8,-1.47]];
  const guide=mesh(scene,new THREE.TorusGeometry(.67,.017,7,38),glow(0xf1ce86,.9));
  const trailCapacity=230,trailArray=new Float32Array(trailCapacity*3);
  const trail=specks(scene,trailArray,0xf4aa68,.065,.88);
  trail.geometry.setDrawRange(0,0);
  const referenceArray=new Float32Array(trailArray.length);
  const referenceTrail=specks(scene,referenceArray,0x7adff6,.075,.88);
  referenceTrail.geometry.setDrawRange(0,0);
  const status=ctx.reading();
  const comparison=ctx.reading('Trajetória atual em âmbar. Colisões aproximadas por raio em todos os corpos.');
  function place(){
    spheres.slice(3).forEach(body=>scene.remove(body.object));spheres.length=3;
    spheres.forEach((body,i)=>{body.object.position.fromArray(initial[i]);body.object.rotation.set(0,0,0);body.v.set(0,0,0);});
    active=0;choose.value='0';guide.visible=true;clearTrail();
  }
  let trailCount=0,trailIndex=0,traceClock=0,showTrail=true;
  function clearTrail(){trailCount=trailIndex=0;trail.geometry.setDrawRange(0,0);}
  const choose=ctx.select('Corpo',['Esfera','Cubo','Anel'],index=>{active=index;clearTrail();});
  ctx.range('Gravidade · g',0,1,.05,gravity,value=>{gravity=value;});
  ctx.range('Impulso · N·s',.6,9,.1,impulse,value=>{impulse=value;});
  ctx.range('Elasticidade',.1,1,.05,restitution,value=>{restitution=value;});
  ctx.select('Campo central',['Desligado','Atrator','Repulsor'],index=>{field=index;});
  const buttons=ctx.group();
  function launch(){
    const body=spheres[active];
    const direction=new THREE.Vector3(0,3,0).sub(body.object.position).normalize();
    if(direction.lengthSq()===0)direction.x=1;
    body.v.addScaledVector(direction,impulse/body.mass);
    ctx.say('Impulso aplicado. Compare trajetória, velocidade e colisões.');
  }
  ctx.button('Aplicar impulso',launch,buttons,true);
  ctx.button('Trajetória',()=>{showTrail=!showTrail;trail.visible=showTrail;},buttons);
  const trials=ctx.group();
  ctx.button('Guardar trajetória',()=>{
    if(!trailCount){ctx.say('Aplique um impulso para traçar o primeiro ensaio.');return;}
    referenceArray.set(trailArray);
    referenceTrail.geometry.attributes.position.needsUpdate=true;
    referenceTrail.geometry.setDrawRange(0,trailCount);
    comparison.textContent='Referência em azul: '+choose.selectedOptions[0].textContent+' · '+gravity+' g · '+impulse+' N·s. Trajetória atual em âmbar.';
    ctx.say('Referência guardada. Reposicione os corpos e ajuste os parâmetros para comparar.');
  },trials);
  ctx.button('Reposicionar corpos',()=>{
    place();ctx.say('Posições e velocidades restauradas. Parâmetros e referência preservados.');
  },trials);
  ctx.button('Limpar referência',()=>{
    referenceTrail.geometry.setDrawRange(0,0);
    comparison.textContent='Trajetória atual em âmbar. Colisões aproximadas por raio em todos os corpos.';
  },trials);
  ctx.button('Gerar esfera',()=>{
    if(spheres.length>=12){ctx.say('Limite de doze corpos. Reinicie para limpar a câmara.');return;}
    const object=mesh(scene,sphereGeo,mo,[(random()-.5)*4,4.2+random(),.9+random()*2]);
    spheres.push({object,v:new THREE.Vector3(),r:.37,mass:1,kind:0});ctx.say('Esfera adicionada à câmara.');
  },buttons);
  let drag;
  const cursor=new THREE.Raycaster(),point=new THREE.Vector2(),plane=new THREE.Plane(),hit=new THREE.Vector3();
  ctx.hint('Arraste um dos corpos para reposicionar. Arraste fora deles para orbitar. Espaço aplica o impulso.');
  ctx.paint((p,phase)=>{
    if(phase==='end'||phase==='cancel'){drag=undefined;return;}
    if(phase==='start'){
      point.set(p.x*2-1,1-p.y*2);cursor.setFromCamera(point,ctx.camera);
      const hits=cursor.intersectObjects(spheres.map(body=>body.object),false);
      const i=hits.length?spheres.findIndex(body=>body.object===hits[0].object):-1;
      if(i!==-1&&!p.alternate){
        drag=spheres[i];drag.v.set(0,0,0);
        plane.setFromNormalAndCoplanarPoint(ctx.camera.getWorldDirection(hit),drag.object.position);
        if(i<3){active=i;choose.value=String(i);clearTrail();}
      }
    }else if(drag){
      if(ctx.project(p,plane,hit))drag.object.position.set(clamp(hit.x,-5.2,5.2),clamp(hit.y,.6,6.3),clamp(hit.z,-4.4,4.1));
    }else camera.drag(p);
  });
  const delta=new THREE.Vector3(),normal=new THREE.Vector3(),attractor=new THREE.Vector3(0,3.3,0);
  const limits=[[-5.65,5.65],[.03,6.83],[-4.78,4.58]],axes=['x','y','z'];
  place();
  return {fov:51,key(key){if(key===' ')launch();},cancel(){drag=undefined;},pause(){drag=undefined;},
    reset(){place();camera.reset();referenceTrail.geometry.setDrawRange(0,0);comparison.textContent='Trajetória atual em âmbar. Colisões aproximadas por raio em todos os corpos.';ctx.say('Posições e velocidades restauradas.');},
    step(dt){
      for(const body of spheres){
        if(body===drag)continue;
        const p=body.object.position;
        body.v.y-=gravity*9.81*dt;
        if(field){
          delta.copy(attractor).sub(p);
          body.v.addScaledVector(delta.normalize(),(field===1?1:-1)*dt*3);
        }
        body.v.clampLength(0,16);
        p.addScaledVector(body.v,dt);
        for(let i=0;i<3;i++){
          const axis=axes[i],[min,max]=limits[i],lo=min+body.r,hi=max-body.r;
          if(p[axis]<lo||p[axis]>hi){p[axis]=clamp(p[axis],lo,hi);body.v[axis]*=-restitution;}
        }
      }
      for(let i=0;i<spheres.length;i++)for(let j=i+1;j<spheres.length;j++){
        const a=spheres[i],b=spheres[j];
        if(a===drag||b===drag)continue;
        normal.copy(b.object.position).sub(a.object.position);
        const distance=normal.length(), touch=a.r+b.r;
        if(distance>=touch)continue;
        normal.divideScalar(distance||1);
        if(distance<.00001)normal.set(1,0,0);
        const weightA=1/a.mass,weightB=1/b.mass,ratio=weightA+weightB;
        a.object.position.addScaledVector(normal,-(touch-distance)*weightA/ratio);
        b.object.position.addScaledVector(normal,(touch-distance)*weightB/ratio);
        const approach=delta.copy(b.v).sub(a.v).dot(normal);
        if(approach<0){
          const jolt=-(1+restitution)*approach/ratio;
          a.v.addScaledVector(normal,-jolt*weightA);b.v.addScaledVector(normal,jolt*weightB);
        }
      }
    },
    update(dt){
      guide.position.copy(spheres[active].object.position);guide.quaternion.copy(ctx.camera.quaternion);
      traceClock+=dt;
      if(traceClock>.045&&spheres[active].v.lengthSq()>.015){
        traceClock=0;
        spheres[active].object.position.toArray(trailArray,trailIndex*3);
        trailIndex=(trailIndex+1)%trailCapacity;trailCount=Math.min(trailCapacity,trailCount+1);
        trail.geometry.setDrawRange(0,trailCount);trail.geometry.attributes.position.needsUpdate=true;
      }
      spheres.forEach(body=>{if(!ctx.reduced)body.object.rotation.z+=dt*body.v.x*.18;});
      const body=spheres[active];
      status.textContent=body.mass+' kg · '+body.v.length().toFixed(2)+' m/s · '+spheres.length+' corpos';
    }};
}

export function ferrofluid(ctx){
  const scene=ctx.scene;
  atmosphere(ctx,0x303840,0x5a4940,0xeaf3ff,{fill:1.6,intensity:3.6});
  const steel=mat(0xabaeab,{metalness:.84,roughness:.28});
  const dark=mat(0x343e43,{roughness:.42,metalness:.58}),rubber=mat(0x282c2e);
  box(scene,steel,0,-.19,0,11,.30,8.5);
  box(scene,rubber,0,-.34,0,11,.12,8.5);
  for(const x of [-2.65,2.65]){
    box(scene,dark,x,.03,-.87,.56,.13,.48);
    tube(scene,steel,x,1.71,-.87,.095,3.42);
    tube(scene,dark,x,2.93,-.87,.16,.20);
  }
  beam(scene,steel,[-2.65,2.95,-.87],[2.65,2.95,-.87],.10);
  for(let i=0;i<19;i++)box(scene,rubber,(i-9)*.26,.002,2.16,.013,.013,i%3===0?.35:.20);
  const glass=mat(0xa4d6da,{roughness:.16,metalness:.23,transparent:true,opacity:.38,depthWrite:false});
  tube(scene,dark,0,.08,0,2.14,.17);
  const rim=mesh(scene,new THREE.TorusGeometry(2.08,.065,12,76),glass,[0,.245,0]);
  rim.rotation.x=Math.PI/2;
  const fluid=mat(0xffffff,{metalness:.43,roughness:.24,vertexColors:true,side:THREE.DoubleSide});
  const geometry=new THREE.PlaneGeometry(4.15,4.15,100,100);
  geometry.rotateX(-Math.PI/2);
  const indices=[];
  const pos=geometry.attributes.position;
  const reliefColors=new THREE.Float32BufferAttribute(new Float32Array(pos.count*3),3);
  geometry.setAttribute('color',reliefColors);
  const baseColor=new THREE.Color(0x203943),peakColor=new THREE.Color(0x8cc6c9),reliefColor=new THREE.Color();
  for(let i=0;i<geometry.index.count;i+=3){
    const triangle=[geometry.index.getX(i),geometry.index.getX(i+1),geometry.index.getX(i+2)];
    if(triangle.every(j=>Math.hypot(pos.getX(j),pos.getZ(j))<=2.06))indices.push(...triangle);
  }
  geometry.setIndex(indices);
  mesh(scene,geometry,fluid,[0,.184,0]);
  const camera=orbit(ctx,6.25,[0,.72,0],.49,.18);
  const defaults=[[-.84,-.34,1.21,1,1],[.90,.29,1.38,.72,-1]];
  const sources=defaults.map((source,i)=>{
    const g=group(scene);
    if(i===0){
      tube(g,dark,0,.20,0,.27,.43);
      tube(g,steel,0,.43,0,.26,.12);
      tube(g,mat(0xb4514a),0,.03,0,.275,.10);
    }else{
      box(g,dark,0,.15,0,.71,.31,.48);
      box(g,mat(0x5c81a4),.29,.15,0,.14,.32,.49);
      box(g,steel,-.22,.15,0,.30,.31,.48);
    }
    tube(g,steel,0,.79,0,.058,.94);
    orb(g,steel,0,1.28,0,.11);
    return {g,params:source.slice()};
  });
  lamp(scene,0xffe4c0,46,-3,5,1,13);
  lamp(scene,0xc2e9ff,19,3.4,1.6,1.5,9);
  const probe=ctx.reading();
  const scale=ctx.sceneGuide();
  let selected=0,mode=0,dirty=true,dragging=false;
  let reference,peak=0,previewTime=0;
  const validated=s=>Array.isArray(s)&&s.length===2&&s.every(p=>Array.isArray(p)&&p.length===5&&p.every(Number.isFinite)&&Math.hypot(p[0],p[1])<=1.82&&p[2]>=.35&&p[2]<=2.6&&p[3]>=.2&&p[3]<=1.5&&[1,-1].includes(p[4]));
  const saved=ctx.load({});
  if(validated(saved?.sources))sources.forEach((source,i)=>source.params=saved.sources[i].slice());
  const modes=ctx.select('Padrão',['Livre · duas fontes','Coroa simétrica','Campo rotativo'],i=>{
    mode=i;if(i===1){sources[0].params[0]=sources[0].params[1]=0;}
    sync();refreshExperiment();
  });
  ctx.select('Fonte',['Ímã cilíndrico','Ímã em barra'],i=>{selected=i;sync();});
  const height=ctx.range('Altura',.35,2.6,.05,sources[0].params[2],v=>{sources[selected].params[2]=v;refreshExperiment();});
  const strength=ctx.range('Força',.2,1.5,.05,sources[0].params[3],v=>{sources[selected].params[3]=v;refreshExperiment();});
  const xPosition=ctx.range('Posição horizontal',-1.6,1.6,.05,sources[0].params[0],v=>{
    const p=sources[selected].params;
    const limit=Math.sqrt(Math.max(0,1.79**2-p[1]**2));
    p[0]=clamp(v,-limit,limit);sync();refreshExperiment();
  });
  function sync(){
    const p=sources[selected].params;
    [height,strength,xPosition].forEach((el,i)=>{
      el.value=String(p[[2,3,0][i]]);
      el.parentElement.querySelector('.field-label span:last-child').textContent=Number(el.value).toFixed(2);
    });
  }
  const options=ctx.group();
  ctx.button('Inverter polaridade',()=>{sources[selected].params[4]*=-1;refreshExperiment();ctx.say('Polaridade invertida.');},options);
  ctx.button('Salvar preset',()=>{if(ctx.save({sources:sources.map(x=>x.params),mode}))ctx.say('Parâmetros magnéticos salvos localmente.');},options);
  const trials=ctx.group();
  ctx.button('Registrar referência',()=>{
    if(dirty)refreshExperiment();
    reference={peak,time:previewTime};
    refreshExperiment();
    ctx.say('Pico registrado. Altere altura, força ou polaridade para comparar na mesma fase.');
  },trials);
  ctx.button('Limpar referência',()=>{
    reference=undefined;refreshExperiment();
  },trials);
  const pointer=new THREE.Vector3(),plane=new THREE.Plane(new THREE.Vector3(0,1,0),-.19);
  ctx.hint('Os tons claros indicam relevo mais alto. Arraste para mover o ímã ou use os ajustes abaixo. Shift ou botão direito orbita.');
  ctx.paint((p,phase)=>{
    if(phase==='end'||phase==='cancel'){dragging=false;return;}
    if(p.alternate){if(phase==='move')camera.drag(p);return;}
    if(ctx.project(p,plane,pointer)&&(phase==='start'||dragging)&&Math.hypot(pointer.x,pointer.z)<2.5){
      const factor=Math.min(1,1.78/Math.max(.1,Math.hypot(pointer.x,pointer.z)));
      sources[selected].params[0]=pointer.x*factor;sources[selected].params[1]=pointer.z*factor;
      dragging=true;sync();dirty=true;
    }else if(phase==='move'&&!dragging)camera.drag(p);
  });
  let elapsed=0;
  function refreshExperiment(){updateSurface(ctx.reduced?0:ctx.timers.time);}
  function updateSurface(time){
    previewTime=reference?.time??time;
    const data=sources.map(({g,params:[x,z,h,power,polarity]},i)=>{
      if(mode===2){x=Math.cos(previewTime*.61+i*Math.PI)*.92;z=Math.sin(previewTime*.61+i*Math.PI)*.92;}
      g.position.set(x,h,z);g.visible=mode!==1||i===0;
      return [x,z,h,power,polarity];
    });
    peak=0;
    for(let i=0;i<pos.count;i++){
      const x=pos.getX(i),z=pos.getZ(i),outside=Math.hypot(x,z);
      // Sobrepõe os campos de um dipolo vertical e um horizontal antes de calcular o relevo.
      let bx=0,by=0,bz=0;
      for(let j=0;j<(mode===1?1:2);j++){
        const [sx,sz,h,power,polarity]=data[j],dx=x-sx,dz=z-sz;
        const distanceSquared=.20+h*h+dx*dx+dz*dz;
        const moment=power*polarity/Math.pow(distanceSquared,1.5);
        const projection=3*(j===0?-h:dx)/distanceSquared;
        bx+=moment*(projection*dx-(j===1?1:0));
        by+=moment*(-projection*h-(j===0?1:0));
        bz+=moment*projection*dz;
      }
      const field=Math.hypot(bx,by,bz);
      const relief=field*field/(1+field*field);
      // Os picos hexagonais são uma aproximação visual da instabilidade da superfície.
      const lattice=Math.cos(x*21)+2*Math.cos(x*10.5)*Math.cos(z*18.19);
      const spikes=Math.max(0,lattice/3)**3*clamp((Math.abs(by)-.22)*1.6,0,1);
      const y=relief*(.21+.35*spikes)*clamp((2.10-outside)*2.8,0,1);
      pos.setY(i,y);peak=Math.max(peak,y);
      reliefColor.copy(baseColor).lerp(peakColor,clamp(y/.48,0,1));
      reliefColors.setXYZ(i,reliefColor.r,reliefColor.g,reliefColor.b);
    }
    pos.needsUpdate=reliefColors.needsUpdate=true;geometry.computeVertexNormals();
    probe.textContent='Pico da superfície: '+peak.toFixed(2)+' u. · modelo visual aproximado';
    let legend='Pico '+peak.toFixed(3)+' u. · azul-escuro: 0 · azul-claro: 0,48 u.';
    if(reference){
      const delta=peak-reference.peak;
      legend='Referência '+reference.peak.toFixed(3)+' u. · atual '+peak.toFixed(3)+' u. · diferença '+(delta>=0?'+':'')+delta.toFixed(3)+' u.';
    }
    if(scale.textContent!==legend)scale.textContent=legend;
    dirty=false;
  }
  if(Number.isInteger(saved?.mode)&&saved.mode>=0&&saved.mode<3)mode=saved.mode;
  modes.value=String(mode);
  updateSurface(0);
  return {reset(){sources.forEach((src,i)=>{src.params=defaults[i].slice();});mode=0;modes.value='0';camera.reset();sync();refreshExperiment();ctx.say('Campo restaurado.');},
    update(dt,time){if(dirty||(mode===2&&!reference&&(elapsed+=dt)>.055)){elapsed=0;updateSurface(ctx.reduced?0:time);}}};
}

function fluidGrid(w,h){
  const n=w*h;
  let u=new Float32Array(n),v=new Float32Array(n),dye=new Float32Array(n*3);
  let nextU=new Float32Array(n),nextV=new Float32Array(n),nextDye=new Float32Array(n*3);
  let pressure=new Float32Array(n),nextPressure=new Float32Array(n);
  const div=new Float32Array(n),solid=new Uint8Array(n);
  const id=(x,y)=>y*w+x;
  function sample(data,x,y,channels,c){
    x=clamp(x,1,w-2.001);y=clamp(y,1,h-2.001);
    const a=Math.floor(x),b=Math.floor(y),fx=x-a,fy=y-b;
    const i=id(a,b)*channels+c,step=w*channels;
    return (data[i]*(1-fx)+data[i+channels]*fx)*(1-fy)+(data[i+step]*(1-fx)+data[i+step+channels]*fx)*fy;
  }
  function barrier(enabled,cx){
    solid.fill(0);
    if(!enabled)return;
    for(let y=1;y<h-1;y++)for(let x=1;x<w-1;x++){
      const dx=(x-cx)/(w*.047),dy=(y-h*.50)/(h*.19);
      if(dx*dx+dy*dy<1)solid[id(x,y)]=1;
    }
  }
  function splash(x,y,dx,dy,radius,color,amount=1){
    for(let yy=Math.max(1,Math.floor(y-radius*2));yy<=Math.min(h-2,Math.ceil(y+radius*2));yy++)
      for(let xx=Math.max(1,Math.floor(x-radius*2));xx<=Math.min(w-2,Math.ceil(x+radius*2));xx++){
        const k=id(xx,yy);
        if(solid[k])continue;
        const a=Math.exp(-((x-xx)**2+(y-yy)**2)/(radius*radius*.61));
        u[k]=clamp(u[k]+dx*a,-4,4);v[k]=clamp(v[k]+dy*a,-4,4);
        if(color)for(let c=0;c<3;c++)dye[k*3+c]=clamp(dye[k*3+c]+color[c]*a*amount,0,2.35);
      }
  }
  function tick(flow,viscosity,decay,vorticity){
    for(let y=1;y<h-1;y++)for(let x=1;x<w-1;x++){
      const k=id(x,y);
      if(solid[k]){nextU[k]=nextV[k]=0;continue;}
      const a=x-u[k],b=y-v[k];
      nextU[k]=sample(u,a,b,1,0)*(1-viscosity)+flow*.022;
      nextV[k]=sample(v,a,b,1,0)*(1-viscosity);
      if(vorticity){
        const dx=x-w*.52,dy=y-h*.49,r=dx*dx+dy*dy+16;
        nextU[k]-=dy/r*.24;nextV[k]+=dx/r*.24;
      }
    }
    [u,nextU]=[nextU,u];[v,nextV]=[nextV,v];
    pressure.fill(0);nextPressure.fill(0);
    for(let y=1;y<h-1;y++)for(let x=1;x<w-1;x++){
      const k=id(x,y);
      if(solid[k])continue;
      if(solid[k+1]||solid[k-1])u[k]=0;
      if(solid[k+w]||solid[k-w])v[k]=0;
      div[k]=-.5*(u[k+1]-u[k-1]+v[k+w]-v[k-w]);
    }
    for(let pass=0;pass<9;pass++){
      for(let y=1;y<h-1;y++)for(let x=1;x<w-1;x++){
        const k=id(x,y);
        nextPressure[k]=solid[k]?0:(div[k]+pressure[k+1]+pressure[k-1]+pressure[k+w]+pressure[k-w])*.25;
      }
      [pressure,nextPressure]=[nextPressure,pressure];
    }
    for(let y=1;y<h-1;y++)for(let x=1;x<w-1;x++){
      const k=id(x,y);
      if(solid[k]){
        nextDye.fill(0,k*3,k*3+3);
        continue;
      }
      u[k]-=.5*(pressure[k+1]-pressure[k-1]);
      v[k]-=.5*(pressure[k+w]-pressure[k-w]);
      if(solid[k+1]||solid[k-1])u[k]=0;
      if(solid[k+w]||solid[k-w])v[k]=0;
      const a=x-u[k],b=y-v[k];
      for(let c=0;c<3;c++)nextDye[k*3+c]=sample(dye,a,b,3,c)*decay;
    }
    [dye,nextDye]=[nextDye,dye];
  }
  return {barrier,splash,tick,blocks:solid,ink:()=>dye,
    clear(){[u,v,nextU,nextV,dye,nextDye].forEach(buffer=>buffer.fill(0));}};
}

export function ink(ctx){
  const scene=ctx.scene;
  atmosphere(ctx,0x1d373d,0x4d413b,0xc9eafa,{fill:1.5,intensity:2.8});
  const teak=wood(0x745649),steel=mat(0x889ba1,{metalness:.68,roughness:.31}),glass=mat(0x9ddce2,{transparent:true,opacity:.24,roughness:.13,metalness:.25,depthWrite:false});
  box(scene,teak,0,-.18,0,10,.3,6.25);
  box(scene,steel,0,.04,0,6.30,.22,1.5);
  const width=5.8,height=3.4,mid=1.94;
  for(const x of [-2.96,2.96])box(scene,glass,x,mid,0,.13,height+.14,1.16);
  for(const y of [.19,3.7])box(scene,glass,0,y,0,6.03,.095,1.16);
  box(scene,glass,0,mid,-.5,5.95,3.45,.05);
  for(const x of [-2.76,2.76])box(scene,steel,x,.14,.57,.26,.21,.18);
  for(let i=0;i<4;i++){
    const x=3.52+i*.28;
    beam(scene,steel,[x,.02,.69],[x,.02,1.61],.036);
    orb(scene,mat([0x3b9ab6,0xc7794e,0xc46b9d,0xcddad3][i]),x,.045,1.59,.081,.06,.104);
  }
  lamp(scene,0xd3edf6,20,-3.35,3.35,2.34,9);
  const w=104,h=62,grid=fluidGrid(w,h);
  const pixels=new Uint8Array(w*h*4),texture=new THREE.DataTexture(pixels,w,h);
  texture.colorSpace=THREE.SRGBColorSpace;
  texture.magFilter=THREE.LinearFilter;texture.minFilter=THREE.LinearFilter;
  mesh(scene,new THREE.PlaneGeometry(width,height),new THREE.MeshBasicMaterial({map:texture,side:THREE.DoubleSide}),[0,mid,.34]);
  const barrierMesh=orb(scene,mat(0x70808a,{metalness:.38,roughness:.24}),0,mid,.41,.27,.65,.04);
  const camera=orbit(ctx,6.45,[0,1.88,0],.085,.045);
  const plane=new THREE.Plane(new THREE.Vector3(0,0,1),-.34);
  const point=new THREE.Vector3();
  let tool=0,palette=0,direction=.6,viscosity=.031,decay=.992,brush=4.1,enabled=true,barrierX=w*.52;
  let softTime=0,dirty=true;
  const pigment=[[.10,.58,.88],[1,.52,.17],[.97,.22,.61],[.83,.92,1],[.33,.73,.63]];
  const state=ctx.reading();
  const tankGuide=ctx.sceneGuide('Arraste no tanque para injetar tinta ou abra Controles e escolha Ensaio da barreira.');
  function setBarrier(){
    grid.barrier(enabled,barrierX);
    barrierMesh.visible=enabled;
    barrierMesh.position.x=(barrierX/(w-1)-.5)*width;
    dirty=true;
  }
  function draw(){
    const dye=grid.ink(),blocks=grid.blocks;
    let mass=0;
    for(let i=0;i<w*h;i++){
      const k=i*3,at=i*4;
      const y=Math.floor(i/w)/h,edge=Math.sin(i%w/w*Math.PI)*Math.sin(y*Math.PI);
      mass+=dye[k]+dye[k+1]+dye[k+2];
      for(let c=0;c<3;c++){
        const lit=(1-Math.exp(-dye[k+c]*1.9))*204;
        pixels[at+c]=Math.min(255,(blocks[i]?38:17+edge*16)+c*9+lit);
      }
      pixels[at+3]=255;
    }
    texture.needsUpdate=true;
    state.textContent='Pigmento na água: '+(mass/(w*h)*100).toFixed(1)+' · Barreira '+(enabled?'ativa':'retirada');
    dirty=false;
  }
  const splat=(x,y,dx,dy)=>{grid.splash(x,y,dx,dy,brush,tool===0?pigment[palette]:null,1);tankGuide.hidden=true;dirty=true;};
  ctx.hint('Experimente o ensaio da barreira ou arraste no tanque para injetar pigmento. Compare o caminho com e sem o obstáculo.');
  const experiment=ctx.group();
  ctx.button('Ensaio da barreira',()=>{
    grid.clear();camera.reset();flow.value='0.6';flow.dispatchEvent(new Event('input'));
    enabled=true;barrierX=w*.52;barrier.textContent='Retirar barreira';setBarrier();
    for(const y of [.4,.5,.6])grid.splash(w*.31,h*y,2.8,0,brush,pigment[palette],1.7);
    tankGuide.hidden=true;
    draw();ctx.say('Observe a tinta contornar a barreira. Retire o obstáculo e injete de novo para comparar.');
  },experiment,true);
  ctx.select('Ferramenta',['Injetar pigmento','Agitar','Mover barreira','Orbitar'],index=>{tool=index;});
  ctx.select('Pigmento',['Azul-petróleo','Cobre','Magenta','Marfim','Jade'],index=>{palette=index;});
  const flow=ctx.range('Corrente',-1.5,1.5,.1,direction,v=>{direction=v;});
  ctx.range('Viscosidade',.01,.16,.005,viscosity,v=>{viscosity=v;});
  ctx.range('Persistência',.975,.999,.001,decay,v=>{decay=v;});
  ctx.range('Pincel',2,9,.2,brush,v=>{brush=v;});
  const group=ctx.group();
  const barrier=ctx.button('Retirar barreira',()=>{enabled=!enabled;barrier.textContent=enabled?'Retirar barreira':'Colocar barreira';setBarrier();},group);
  ctx.button('Injetar da esquerda',()=>{
    grid.splash(w*.27,h*.49,2.1,.48,brush,pigment[palette],1.55);
    tankGuide.hidden=true;
    dirty=true;ctx.say('Pigmento injetado na corrente.');
  },group,true);
  let vortex=false;
  const vortexButton=ctx.button('Vórtice',()=>{vortex=!vortex;vortexButton.setAttribute('aria-pressed',String(vortex));},group);
  ctx.button('Avançar um passo',()=>{grid.tick(direction,viscosity,decay,vortex);draw();},group);
  ctx.button('Limpar tanque',()=>{grid.clear();draw();ctx.say('Pigmento e velocidade removidos da grade.');},group);
  ctx.paint((p,phase)=>{
    if(phase==='end'||phase==='cancel')return;
    if(p.alternate||tool===3){if(phase==='move')camera.drag(p);return;}
    if(!ctx.project(p,plane,point))return;
    const x=(point.x/width+.5)*(w-1),y=((point.y-mid)/height+.5)*(h-1);
    if(x<1||x>w-2||y<1||y>h-2)return;
    if(tool===2){barrierX=clamp(x,w*.20,w*.80);setBarrier();}
    else splat(x,y,clamp(p.dx*.105+.58,-2.8,2.8),clamp(-p.dy*.15+.11,-2.8,2.8));
  });
  setBarrier();
  for(let i=0;i<21;i++){
    const t=i*.39,r=1.4+i*.53;
    grid.splash(w*.33+Math.cos(t)*r,h*.53+Math.sin(t)*r,-Math.sin(t)*.8,Math.cos(t)*.8,3.3,pigment[0],.22);
    grid.splash(w*.63-Math.cos(t)*r,h*.45+Math.sin(t)*r,-Math.sin(t)*.74,-Math.cos(t)*.78,2.6,pigment[1],.24);
  }
  draw();
  return {reset(){grid.clear();camera.reset();draw();tankGuide.hidden=false;ctx.say('Tanque limpo. Injete tinta para iniciar uma composição.');},
    update(dt){
      softTime+=dt;
      const frame=ctx.low?1/24:1/30;
      if(softTime>=frame){
        softTime%=frame;
        grid.tick(direction,viscosity,decay,vortex&&!ctx.reduced);
        dirty=true;
      }
      if(dirty)draw();
    }};
}
