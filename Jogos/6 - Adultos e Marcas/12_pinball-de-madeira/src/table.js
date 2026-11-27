import * as T from 'three';
import { canvasTexture, mesh, rbox, lathe, cylinderBetween, taperedTube, mergeStatic } from './core/model';
import { makeTexSet, woodSampler, bronzeSampler, pbrMaterial, fabricSampler } from './core/pbr';
import { rng } from './core/noise';
import { rails, posts, flippers, radius, rampPath, start } from './layout.js';

const v=(x,y,z)=>new T.Vector3(x,y,z);
const G=(name,x=0,y=0,z=0)=>{const g=new T.Group();g.name=name;g.position.set(x,y,z);return g;};
const B=(w,h,d,mat,x,y,z,r=.021)=>mesh(rbox(w,h,d,r,2),mat,x,y,z);
const mat=(color,roughness=.7,metalness=0)=>new T.MeshStandardMaterial({color,roughness,metalness});
const emissive=(color,power=1)=>new T.MeshStandardMaterial({color,emissive:color,emissiveIntensity:power,roughness:.38,metalness:.08});
function batch(group,cast=true){
  const found=new Set();
  group.traverse(o=>{if(o.isMesh)found.add(o.geometry);});
  const result=mergeStatic(group,cast,true);
  found.forEach(geo=>geo.dispose());
  group.clear();group.add(result);
}
function hsl(color, amount){
  return new T.Color(color).lerp(new T.Color(amount<0?'#23110c':'#ffffff'),Math.abs(amount)).getStyle();
}
function materials(brand){
  const wood=makeTexSet({size:512,aniso:4,sample:woodSampler({light:'#bd8d59',dark:'#5b2e18',seed:192}),normalStrength:.78});
  const brass=makeTexSet({size:256,aniso:2,sample:bronzeSampler(33)});
  const cloth=makeTexSet({size:256,aniso:2,sample:fabricSampler('#504038',11,100)});
  return {
    wood:pbrMaterial(wood,{color:new T.Color(brand.cores.verniz).lerp(new T.Color('#fff0dc'),.36),roughness:.57},.42),
    woodEdge:pbrMaterial(wood,{color:'#d0a376',roughness:.56},.38),
    leg:pbrMaterial(wood,{color:'#573322',roughness:.72},.55),
    brass:pbrMaterial(brass,{color:brand.cores.metal,metalness:.80,roughness:.36},.29),
    bright:mat('#c1b2a1',.25,.92), dark:mat('#211b1a',.57,.39),
    black:mat('#171213',.78), rubber:mat('#381e18',.94), cream:mat('#ffe3ae',.44),
    rail:mat('#d4a166',.20,.92), red:mat(brand.cores.primaria,.49,.21),
    cloth:pbrMaterial(cloth,{roughness:.96},.56), floor:mat('#140b08',.92),
    score:emissive('#f6732a',.98),
  };
}
const W=1024,H=1840;
function art(brand){
  return canvasTexture(W,H,ctx=>{
    const rand=rng(23);
    const tone=brand.cores.madeira;
    const main=ctx.createLinearGradient(0,0,W,H);
    main.addColorStop(0,hsl(tone,-.24));main.addColorStop(.48,hsl(tone,.22));main.addColorStop(1,hsl(tone,-.12));
    ctx.fillStyle=main;ctx.fillRect(0,0,W,H);
    for(let i=0;i<3350;i++){
      const x=rand()*W,y=rand()*H, len=34+rand()*1050;
      ctx.strokeStyle=i%4===0?'rgba(255,228,175,.19)':'rgba(83,45,22,.15)';
      ctx.lineWidth=.45+rand()*1.6;
      ctx.beginPath();ctx.moveTo(x,y);ctx.bezierCurveTo(x+rand()*20-10,y+len*.3,x-12+rand()*27,y+len*.79,x+6,y+len);ctx.stroke();
    }
    for(let i=0;i<13;i++){
      const x=i*84;
      ctx.fillStyle=i%3===0?'#4f251817':'#fff3ca20';ctx.fillRect(x,0,82,H);
      ctx.fillStyle='#3c211c36';ctx.fillRect(x,0,2,H);
    }
    for(const [x,y] of [[476,525],[810,667],[254,1194],[604,1439],[878,1608],[143,401]]){
      ctx.save();ctx.translate(x,y);ctx.rotate(.14);
      for(let n=0;n<18;n++){
        ctx.strokeStyle='rgba(95,45,19,'+(.22-n*.009)+')';
        ctx.lineWidth=n%3===0?1.6:.8;
        ctx.beginPath();ctx.ellipse(0,0,2+n*1.14,13+n*5.0,0,.05,Math.PI*2);ctx.stroke();
      }
      ctx.restore();
    }
    const dark=hsl(brand.cores.verniz,-.45);
    ctx.strokeStyle=dark;ctx.lineWidth=24;
    ctx.strokeRect(19,20,W-38,H-40);
    ctx.strokeStyle='#f2c983';ctx.lineWidth=5;ctx.strokeRect(35,38,W-70,H-76);
    for(const flip of [false,true]){
      ctx.save();if(flip){ctx.translate(W,0);ctx.scale(-1,1);}
      ctx.beginPath();ctx.moveTo(43,28);ctx.lineTo(315,51);ctx.bezierCurveTo(211,310,180,524,164,730);
      ctx.bezierCurveTo(123,1007,173,1249,49,1493);ctx.lineTo(44,1652);ctx.closePath();
      ctx.fillStyle=dark;ctx.fill();ctx.strokeStyle='#8b512f';ctx.lineWidth=8;ctx.stroke();
      ctx.strokeStyle='#e6af65';ctx.lineWidth=3;
      ctx.beginPath();ctx.moveTo(65,49);ctx.bezierCurveTo(212,395,106,1009,89,1387);ctx.stroke();
      for(let y=590;y<1400;y+=126){
        ctx.beginPath();ctx.moveTo(74,y-18);ctx.lineTo(101,y);ctx.lineTo(74,y+18);ctx.lineTo(55,y);ctx.closePath();
        ctx.fillStyle=brand.cores.primaria;ctx.fill();ctx.strokeStyle='#f3b870';ctx.stroke();
      }
      ctx.restore();
    }
    ctx.fillStyle=dark;
    ctx.beginPath();ctx.moveTo(36,H-32);ctx.lineTo(36,H-237);ctx.lineTo(247,H-162);ctx.lineTo(W-240,H-162);ctx.lineTo(W-35,H-236);ctx.lineTo(W-35,H-33);ctx.closePath();ctx.fill();
    ctx.strokeStyle='#dfad65';ctx.lineWidth=5;ctx.stroke();
    for(let i=0;i<9;i++){
      const x=263+i*62,y=H-176+Math.sin(i*1.4)*20;
      ctx.beginPath();ctx.moveTo(x-22,H-162);ctx.bezierCurveTo(x-21,y-39,x+11,y-28,x-3,y-95);
      ctx.bezierCurveTo(x+26,y-81,x+8,y-49,x+33,y-51);ctx.quadraticCurveTo(x+16,y-15,x+35,H-161);ctx.fill();
    }
    ctx.fillStyle='#e7bb78';ctx.textAlign='center';ctx.font='bold 25px Georgia';
    ctx.letterSpacing='5px';ctx.fillText(brand.mesa.arte.inscricao,W/2,H-93);
    ctx.save();ctx.translate(W*.477,H*.641);
    ctx.lineWidth=13;ctx.strokeStyle=dark;
    ctx.beginPath();ctx.ellipse(0,0,166,129,0,0,Math.PI*2);ctx.stroke();
    ctx.beginPath();ctx.ellipse(0,0,137,102,0,0,Math.PI*2);ctx.fillStyle=hsl(brand.cores.primaria,-.16);ctx.fill();
    ctx.strokeStyle='#efbc70';ctx.lineWidth=4;ctx.stroke();
    if(brand.mesa.arte.emblema==='hamburguer'){
      const bun='#efb772';
      ctx.strokeStyle='#512717';ctx.lineWidth=8;ctx.lineJoin='round';
      ctx.beginPath();ctx.moveTo(-101,16);ctx.bezierCurveTo(-106,-80,104,-103,102,14);
      ctx.quadraticCurveTo(96,27,-96,25);ctx.closePath();ctx.fillStyle=bun;ctx.fill();ctx.stroke();
      ctx.beginPath();ctx.moveTo(-112,34);ctx.quadraticCurveTo(-65,18,-22,40);ctx.lineTo(18,27);ctx.lineTo(109,35);
      ctx.quadraticCurveTo(116,50,91,58);ctx.lineTo(-100,58);ctx.closePath();ctx.fillStyle='#64502e';ctx.fill();ctx.stroke();
      ctx.beginPath();ctx.moveTo(-96,64);ctx.lineTo(98,64);ctx.quadraticCurveTo(93,102,20,101);ctx.quadraticCurveTo(-99,104,-96,64);ctx.fillStyle=bun;ctx.fill();ctx.stroke();
      for(let i=0;i<22;i++){
        const x=rand()*151-75,y=-44+rand()*55;
        ctx.beginPath();ctx.ellipse(x,y,4,2,rand(),0,Math.PI*2);ctx.fillStyle='#664125';ctx.fill();
      }
    }else{
      ctx.beginPath();
      for(let i=0;i<=12;i++){
        const angle=i/12*Math.PI*2-Math.PI/2,r=i%2?44:91;
        ctx.lineTo(Math.cos(angle)*r,Math.sin(angle)*r);
      }
      ctx.fillStyle='#f1cb93';ctx.fill();
    }
    ctx.restore();
    for(const [x,y] of [[.39,.54],[.53,.52],[.62,.57],[.25,.50],[.75,.52],[.55,.77],[.44,.77]]){
      ctx.save();ctx.translate(x*W,y*H);
      ctx.beginPath();ctx.roundRect(-37,-15,74,30,12);ctx.fillStyle=dark;ctx.fill();ctx.strokeStyle='#e9b77c';ctx.lineWidth=3;ctx.stroke();
      ctx.beginPath();ctx.moveTo(-15,-4);ctx.lineTo(15,-4);ctx.lineTo(0,7);ctx.closePath();ctx.fillStyle=brand.cores.destaque;ctx.fill();
      ctx.restore();
    }
  });
}
function sign(brand){
  return canvasTexture(960,430,ctx=>{
    const dark=ctx.createLinearGradient(0,0,0,430);
    dark.addColorStop(0,'#120b0a');dark.addColorStop(.5,hsl(brand.cores.verniz,-.41));dark.addColorStop(1,'#120d0c');
    ctx.fillStyle=dark;ctx.fillRect(0,0,960,430);
    for(let x=0;x<960;x+=8){
      ctx.fillStyle=x%16?'#ffce8c06':'#00000028';ctx.fillRect(x,0,3,430);
    }
    ctx.lineWidth=6;ctx.strokeStyle=brand.cores.destaque;ctx.shadowColor=brand.cores.luz;ctx.shadowBlur=25;
    ctx.beginPath();ctx.roundRect(21,21,918,388,43);ctx.stroke();
    ctx.textAlign='center';ctx.textBaseline='middle';ctx.lineJoin='round';
    const [first,second]=brand.textos.letreiro;
    ctx.font='700 105px Rubik, sans-serif';
    ctx.fillStyle=brand.cores.destaque;ctx.shadowColor=brand.cores.primaria;ctx.shadowBlur=31;
    ctx.fillText(first,480,144,860);
    ctx.font='700 182px Rubik, sans-serif';ctx.lineWidth=7;ctx.strokeStyle='#ffdf9a';ctx.shadowColor=brand.cores.luz;ctx.shadowBlur=27;
    ctx.strokeText(second,480,271,850);
    ctx.lineWidth=2;ctx.strokeStyle='#fff4cd';ctx.shadowBlur=10;ctx.strokeText(second,480,271,850);
  });
}
function dialTexture(){
  return canvasTexture(128,128,ctx=>{
    const grd=ctx.createRadialGradient(64,64,1,64,64,64);
    grd.addColorStop(0,'#fffbde');grd.addColorStop(.40,'#ffd98c');grd.addColorStop(.77,'#df8035');grd.addColorStop(1,'#a55c28');
    ctx.fillStyle=grd;ctx.fillRect(0,0,128,128);
    ctx.strokeStyle='#ffedbc80';ctx.lineWidth=2;
    for(let i=18;i<63;i+=6){ctx.beginPath();ctx.arc(64,64,i,0,Math.PI*2);ctx.stroke();}
  });
}
function glowTexture(color='#ffb354'){
  return canvasTexture(128,128,ctx=>{
    const gradient=ctx.createRadialGradient(64,64,1,64,64,63);
    gradient.addColorStop(0,color+'96');gradient.addColorStop(.29,color+'55');gradient.addColorStop(1,color+'00');
    ctx.fillStyle=gradient;ctx.fillRect(0,0,128,128);
  });
}
function backdrop(scene, m){
  const room=G('oficina');
  const floor=B(20,.16,18,m.floor,0,-1.15,0);
  floor.receiveShadow=true;room.add(floor);
  const rnd=rng(72);
  for(let i=0;i<15;i++){
    const g=B(9,.03,.018,m.black,(rnd()-.5)*1.2,-1.055,-4+i*.67,.005);
    room.add(g);
  }
  for(let i=0;i<9;i++){
    const back=B(1.04,5,.15,i%2?m.leg:m.wood,-5.3+i*1.08,1.05,-4.9,.028);
    room.add(back);
  }
  batch(room,false);scene.add(room);
}
function casework(m){
  const g=G('gabinete');
  g.add(B(2.94,.46,5.13,m.wood,0,-.31,-.025,.052),B(2.84,.110,4.99,m.woodEdge,0,-.075,0,.035));
  g.add(B(2.99,.135,.25,m.dark,0,-.063,2.457,.035),B(2.82,.053,.134,m.bright,0,.014,2.496,.019));
  for(const x of [-1.42,1.42]){
    g.add(B(.21,.44,4.93,m.wood,x,.149,-.026,.042),B(.112,.067,4.97,m.bright,x,.385,-.025,.028));
    g.add(B(.023,.082,4.62,m.brass,x*.957,.247,.002,.010));
    for(let z=-2.18;z<2.30;z+=.57){
      g.add(mesh(new T.CylinderGeometry(.027,.022,.017,12),m.brass,x,.429,z));
    }
  }
  for(const [x,z,s] of [[-1.15,2.1,-1],[1.15,2.1,1],[-1.15,-2.04,-1],[1.15,-2.04,1]]){
    const y=z>0?-1.43:-1.84;
    g.add(cylinderBetween(v(x,-.39,z),v(x+s*.16,y,z+.12),.066,m.leg,8));
    g.add(cylinderBetween(v(x+s*.14,y+.13,z+.105),v(x+s*.16,y,z+.12),.073,m.bright,8));
  }
  for(const x of [-1.49,1.49]){
    const button=mesh(new T.CylinderGeometry(.099,.099,.039,28),m.red,x,.067,1.85);
    button.rotation.z=Math.PI/2;g.add(button);
  }
  batch(g);return g;
}
function speaker(x,m) {
  const s=G('grade',x,.87,-2.47);
  const grid=canvasTexture(160,160,ctx=>{
    ctx.fillStyle='#3b241c';ctx.fillRect(0,0,160,160);
    for(let row=0;row<20;row++)for(let i=0;i<20;i++){
      const x=i*8+(row%2)*4,y=row*8;
      ctx.fillStyle='#140e0d';ctx.beginPath();ctx.arc(x,y,2.65,0,Math.PI*2);ctx.fill();
    }
  });
  s.add(mesh(new T.CircleGeometry(.178,42),new T.MeshStandardMaterial({map:grid,roughness:.79,metalness:.43})));
  s.add(mesh(new T.TorusGeometry(.185,.015,9,47),m.brass,0,0,.008));
  s.add(mesh(new T.TorusGeometry(.163,.004,6,43),m.rail,0,0,.010));
  return s;
}
function backbox(m,brand){
  const g=G('backbox');
  g.add(B(3.01,1.42,.35,m.wood,0,.74,-2.69,.065),B(2.88,1.29,.10,m.dark,0,.78,-2.467,.055));
  batch(g);
  g.add(speaker(-1.13,m),speaker(1.13,m));
  const signMaterial=new T.MeshBasicMaterial({map:sign(brand),toneMapped:false});
  const panel=mesh(new T.PlaneGeometry(1.86,.83),signMaterial,0,.963,-2.399);
  g.add(panel);
  const digits=canvasTexture(512,95,ctx=>{ctx.fillStyle='#160e0a';ctx.fillRect(0,0,512,95);});
  const score=mesh(new T.PlaneGeometry(1.65,.195),new T.MeshBasicMaterial({map:digits,toneMapped:false}),0,.251,-2.390);
  g.add(score);
  const glass=canvasTexture(256,256,ctx=>{
    ctx.clearRect(0,0,256,256);
    const shine=ctx.createLinearGradient(0,0,256,155);
    shine.addColorStop(0,'#fff1d322');shine.addColorStop(.47,'#ffdeb202');shine.addColorStop(.53,'#fff8ec2a');shine.addColorStop(.64,'#fff8ec05');shine.addColorStop(1,'#ffffff00');
    ctx.fillStyle=shine;ctx.fillRect(0,0,256,256);
  });
  g.add(mesh(new T.PlaneGeometry(2.82,1.22),new T.MeshBasicMaterial({map:glass,transparent:true,depthWrite:false}),0,.80,-2.383));
  return {g,signMaterial,digits};
}
function bumpers(brand,m){
  const root=G('bumpers'), parts={};
  const diffuse=dialTexture();
  for(const spec of brand.mesa.bumpers){
    const group=G(spec.id,spec.x,0,spec.z);
    group.add(mesh(lathe([[0,0],[.246,0],[.247,.023],[.222,.046],[.154,.057],[.153,.136],[.217,.173],[.238,.203],[.229,.221],[.185,.243],[0,.243]],56),m.brass));
    group.add(mesh(lathe([[.185,.224],[.211,.232],[.220,.257],[.213,.283],[.172,.300],[0,.300]],48),m.cream));
    group.add(mesh(new T.TorusGeometry(.229,.012,8,54),m.rail,0,.187,0));
    group.children[2].rotation.x=Math.PI/2;
    const cap=new T.MeshStandardMaterial({map:diffuse,color:spec.color,emissive:spec.color,emissiveMap:diffuse,emissiveIntensity:.58,roughness:.31});
    group.add(mesh(lathe([[.202,.267],[.203,.285],[.168,.305],[0,.305]],48),cap));
    const halo=new T.Sprite(new T.SpriteMaterial({map:glowTexture(),color:spec.color,transparent:true,opacity:.40,depthWrite:false,blending:T.AdditiveBlending}));
    halo.position.y=.28;halo.scale.set(.92,.92,1);group.add(halo);
    parts[spec.id]={cap,halo,group};root.add(group);
  }
  return {root,parts};
}
function targets(brand,m){
  const g=G('alvos');const parts={};
  for(const key of brand.mesa.alvos){
    const target=G(key.id,key.x,0,key.z);
    const facing=emissive('#e8a751',.31);
    target.add(B(.207,.035,.17,m.brass,0,.026,0,.02),B(.172,.171,.077,m.cream,0,.119,0,.025),B(.139,.117,.012,facing,0,.133,.044,.014));
    target.add(mesh(new T.CylinderGeometry(.014,.014,.017,10),m.dark,0,.208,0));
    g.add(target);parts[key.id]={group:target,cap:facing};
  }
  return {g,parts};
}
function guides(m){
  const g=G('guias');
  for(const rail of rails){
    if(rail.id==='borda')continue;
    const shape=rail.points;
    for(let i=1;i<shape.length;i++){
      const [ax,az]=shape[i-1],[bx,bz]=shape[i];
      const angle=Math.atan2(bz-az,bx-ax);
      const h=rail.id==='canal'?.121:.093;
      const upper=B(Math.hypot(bx-ax,bz-az)+.04,h,rail.width*1.9,m.brass,(ax+bx)/2,h*.53,(az+bz)/2,.016);
      upper.rotation.y=-angle;g.add(upper);
    }
    if(rail.id.startsWith('defletor')){
      const figure=new T.Shape();
      for(const [index,[x,z]] of shape.entries())if(index===0)figure.moveTo(x,-z);else figure.lineTo(x,-z);
      figure.closePath();
      const geo=new T.ExtrudeGeometry(figure,{depth:.095,bevelEnabled:true,bevelSegments:3,steps:1,bevelSize:.023,bevelThickness:.014});
      geo.rotateX(-Math.PI/2);
      g.add(mesh(geo,m.wood,0,.113,0));
    }
  }
  for(const [x,z] of posts){
    g.add(mesh(lathe([[0,.001],[.064,.001],[.065,.024],[.043,.035],[.042,.104],[.054,.112],[.052,.137],[0,.137]],18),m.brass,x,0,z));
    g.add(mesh(new T.CylinderGeometry(.019,.019,.013,10),m.dark,x,.143,z));
  }
  for(const [x,z,d] of [[-.54,.80,.28],[.43,.62,.32],[-.61,-.15,.22],[.64,-.25,.20]]){
    const bulb=B(.163,.019,d,m.cream,x,.015,z,.043);g.add(bulb);
  }
  batch(g);return g;
}
function ramp(m){
  const g=G('rampa');
  const curve=new T.CatmullRomCurve3(rampPath.map(([x,y,z])=>v(x,y+.085,z)));
  g.add(mesh(taperedTube(rampPath.map(([x,y,z])=>v(x,y-.012,z)),()=>.060,{radial:7,segments:90}),m.dark));
  for(const shift of [-.114,.114]){
    for(const dy of [0,.117]){
      const path=rampPath.map(([x,y,z],i)=>{
        const previous=rampPath[Math.max(0,i-1)],next=rampPath[Math.min(rampPath.length-1,i+1)];
        const dx=next[0]-previous[0],dz=next[2]-previous[2],norm=Math.hypot(dx,dz)||1;
        return v(x-dz/norm*shift,y+dy,z+dx/norm*shift);
      });
      g.add(mesh(taperedTube(path,()=>dy?.014:.018,{radial:7,segments:88}),m.bright));
    }
  }
  for(const [i,[x,y,z]] of rampPath.entries()){
    if(i%2===0||i===rampPath.length-1){
      g.add(cylinderBetween(v(x,.010,z),v(x,y-.011,z),.021,m.brass,9));
      g.add(mesh(new T.CylinderGeometry(.047,.054,.024,14),m.brass,x,.021,z));
      const hoop=mesh(new T.TorusGeometry(.15,.009,6,24),m.bright,x,y+.031,z);
      const tangent=curve.getTangent(i/(rampPath.length-1));
      hoop.quaternion.setFromUnitVectors(v(0,0,1),tangent);
      g.add(hoop);
    }
  }
  batch(g);
  return {g,curve};
}
function paddle(f,m){
  const g=G('flipper-'+f.id,f.x,0,f.z);
  const shape=new T.Shape();
  shape.moveTo(-.027,.083);shape.bezierCurveTo(-.100,.073,-.096,-.075,-.027,-.082);
  shape.lineTo(.481,-.044);shape.bezierCurveTo(.573,-.040,.576,.041,.481,.056);shape.closePath();
  for(const [height,material,size] of [[.044,m.rubber,1],[.079,m.cream,.96]]){
    const geo=new T.ExtrudeGeometry(shape,{depth:.029,bevelSegments:3,steps:1,bevelSize:.015,bevelThickness:.009,bevelEnabled:true});
    geo.rotateX(-Math.PI/2);
    const flipper=mesh(geo,material,0,height,0);
    flipper.scale.set(size,1,size);g.add(flipper);
  }
  const screw=mesh(new T.CylinderGeometry(.024,.024,.017,15),m.brass,0,.12,0);g.add(screw);
  return g;
}

export function makeTable(scene,brand){
  const m=materials(brand);
  backdrop(scene,m);
  const table=G('mesa');table.position.y=.59;table.rotation.x=.13;scene.add(table);
  const cabinetry=casework(m);table.add(cabinetry);
  const artMaterial=new T.MeshStandardMaterial({map:art(brand),roughness:.58,metalness:.04});
  const board=mesh(new T.PlaneGeometry(2.68,4.86),artMaterial,0,.003,0);
  board.name='tampo';board.rotation.x=-Math.PI/2;board.receiveShadow=true;table.add(board);
  const box=backbox(m,brand);table.add(box.g);
  const bumps=bumpers(brand,m), targets_ = targets(brand,m), wire=ramp(m), trim=guides(m);
  table.add(bumps.root,targets_.g,wire.g,trim);
  const boundary=G('trilho-da-borda');
  const rim=rails[0].points.map(([x,z])=>v(x,.102,z));
  boundary.add(mesh(taperedTube(rim,()=>.027,{radial:8,segments:118}),m.brass));
  for(const [x,z] of rails[0].points){
    boundary.add(mesh(lathe([[0,0],[.045,0],[.044,.074],[.034,.107],[0,.107]],12),m.brass,x,0,z));
  }
  batch(boundary);table.add(boundary);
  const sticks=flippers.map(f=>paddle(f,m));table.add(...sticks);
  const plunger=G('embolo',start.x,.139,2.29);
  const grip=G('puxador',0,0,.07);
  grip.add(cylinderBetween(v(0,0,-.29),v(0,0,.28),.037,m.bright,18));
  grip.add(cylinderBetween(v(0,0,.21),v(0,0,.34),.082,m.brass,26));
  grip.add(cylinderBetween(v(0,0,.292),v(0,0,.384),.084,m.woodEdge,24));
  for(let z=-.12;z<.16;z+=.034){
    const washer=mesh(new T.TorusGeometry(.049,.012,7,20),m.rail,0,0,z);
    grip.add(washer);
  }
  plunger.add(grip);table.add(plunger);
  const drain=B(.46,.017,.34,m.black,0,.015,2.223,.048);drain.name='dreno';table.add(drain);
  const steel=new T.MeshStandardMaterial({color:'#e2dadd',metalness:1,roughness:.145,envMapIntensity:1.25});
  const ball=mesh(new T.SphereGeometry(radius,30,22),steel);
  ball.name='bola-de-aco';ball.castShadow=true;table.add(ball);
  const soft=glowTexture('#271610');
  const contact=mesh(new T.PlaneGeometry(.26,.23),new T.MeshBasicMaterial({map:soft,transparent:true,depthWrite:false,opacity:.80}));
  contact.rotation.x=-Math.PI/2;table.add(contact);

  const specks=new T.Points(new T.BufferGeometry(),new T.PointsMaterial({color:brand.cores.destaque,size:.052,map:glowTexture('#fff2cd'),
    transparent:true,opacity:.92,depthWrite:false,blending:T.AdditiveBlending}));
  const points=new Float32Array(26*3);
  specks.geometry.setAttribute('position',new T.BufferAttribute(points,3));specks.frustumCulled=false;specks.visible=false;table.add(specks);
  const flare=new T.PointLight(brand.cores.luz,1.2,2.28,2);
  flare.position.set(0,.69,-1);table.add(flare);
  const scoreContext=box.digits.image.getContext('2d');
  let lastScore=-1,lastHit=-2;
  const ids={
    mesa:[table,'carvalho e metal','sustenta o tabuleiro'],tampo:[board,'marchetaria em carvalho','superfície de jogo'],
    gabinete:[cabinetry,'madeira envernizada e aço','estrutura'],backbox:[box.g,'madeira, vidro e letreiro emissivo','placar'],
    rampa:[wire.g,'trilhos de aço polido','trajeto elevado'],embolo:[plunger,'mola, aço e madeira','lançar bola'],
    esquerdo:[sticks[0],'marfim e borracha','rebater a bola'],direito:[sticks[1],'marfim e borracha','rebater a bola'],
    bola:[ball,'aço polido','bola em jogo'],alvos:[targets_.g,'latão e acrílico','marcar pontos'],bumpers:[bumps.root,'latão e acrílico','impulsionar a bola'],
  };
  function update(state, reduced=false){
    const {phase,x,z,time}=state;
    const elevated=phase==='rampa';
    if(elevated)wire.curve.getPointAt(state.ramp,ball.position);
    else ball.position.set(x,radius+.007,z);
    ball.visible=phase!=='fim'&&phase!=='dreno';
    contact.position.set(ball.position.x,.010,ball.position.z);contact.visible=ball.visible&&!elevated;
    for(let i=0;i<2;i++)sticks[i].rotation.y=-state.angles[i];
    grip.position.z=.07+state.charge*.24;
    let latest=null, amount=0;
    for(const [id,p] of Object.entries({...bumps.parts,...targets_.parts})){
      const elapsed=time-(state.hits[id]??-10), fade=Math.max(0,1-elapsed/.68);
      p.cap.emissiveIntensity=.51+4*fade;
      if(p.halo){p.halo.material.opacity=.28+.57*fade; p.halo.scale.setScalar(.73+fade*.44);}
      if(fade>amount){amount=fade;latest=p.group;}
    }
    if(time-(state.hits.rampa??-10)<.65){amount=.84;latest=ball;}
    flare.intensity=1.14+amount*2.0;
    if(latest){
      if(!reduced)flare.position.lerp(v(latest.position.x,.62,latest.position.z),.25);
      else flare.position.set(0,.69,-1);
    }
    specks.visible=amount>.14&&!reduced&&!!latest;
    if(specks.visible){
      const e=(1-amount)*.60;
      const rnd=rng(208);
      for(let i=0;i<26;i++){
        const a=rnd()*2*Math.PI,r=(.15+rnd()*.69)*e;
        points[i*3]=latest.position.x+Math.cos(a)*r;points[i*3+1]=.29+Math.sin(a*2)*r*.43+r*.76;points[i*3+2]=latest.position.z+Math.sin(a)*r;
      }
      specks.geometry.getAttribute('position').needsUpdate=true;specks.material.opacity=amount;
    }
    if(state.score!==lastScore){
      scoreContext.fillStyle='#1b0e0a';scoreContext.fillRect(0,0,512,95);
      scoreContext.textAlign='center';scoreContext.textBaseline='middle';scoreContext.font='bold 67px monospace';
      scoreContext.fillStyle='#ffaf59';scoreContext.shadowColor='#ffa44d';scoreContext.shadowBlur=14;
      scoreContext.fillText(String(state.score).padStart(6,'0'),256,52);box.digits.needsUpdate=true;lastScore=state.score;
    }
    lastHit=amount;
  }
  return {m,table,board,update,manifest:Object.fromEntries(Object.entries(ids).map(([id,[obj,material,funcao]])=>{
    console.assert(table.getObjectByName(obj.name)===obj,'Peça ausente:',id);
    return [id,{id,pos:obj.position.toArray(),rot:obj.rotation.toArray().slice(0,3),scale:obj.scale.toArray(),material,funcao}];
  })),glowing:()=>lastHit>.04};
}
