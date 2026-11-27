import { THREE, rng } from './runtime.js';
import { navigator, withNavigation, atmosphereAudio } from './navigation.js';
import { atmosphere, mat, glow, wood, box, beam, orb, tube, rocks, boxes, group, sign, lamp, precip, teaSet, mesh, cuspTerrain, trees, surfaceMaterial, specks, cushion } from './scenery.js';
export { midnight } from './04-cidade-da-madrugada/city.js';

function table(scene, material,x,z,w=1.3,d=.75,y=.72) {
  box(scene,material,x,y,z,w,.09,d);
  for (const sx of [-1,1]) for (const sz of [-1,1]) box(scene,material,x+sx*w*.39,y*.47,z+sz*d*.37,.08,y,.08);
}
function seat(scene,fabric,frame,x,z,rotation=0) {
  const chair=group(scene,x,0,z);
  chair.rotation.y=rotation;
  box(chair,frame,0,.28,0,.60,.42,.61);
  cushion(chair,fabric,0,.48,.02,.64,.19,.67);
  cushion(chair,fabric,0,.82,-.28,.64,.69,.21);
  for(const side of [-1,1])box(chair,frame,side*.32,.63,0,.08,.07,.57);
}

function hearthFire(parent){
  const shader=new THREE.ShaderMaterial({
    depthWrite:false,side:THREE.DoubleSide,transparent:true,
    uniforms:{time:{value:0}},
    vertexShader:'varying vec2 vUv; void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
    fragmentShader:`
      uniform float time; varying vec2 vUv;
      void main(){
        vec2 uv=vUv;
        float field=0.;
        for(int i=0;i<5;i++){
          float j=float(i);
          float cx=.17+j*.16+sin(time*3.+j*3.+uv.y*7.)*.075*uv.y+sin(time*4.1+j*2.-uv.y*13.)*.028;
          float height=.46+.25*sin(time*2.2+j*2.1)+.17*sin(time*4.+j*3.1);
          float taper=clamp(1.-uv.y/max(.22,height),0.,1.);
          float core=exp(-pow(abs(uv.x-cx)/(taper*.126+.011),1.65))*taper;
          field+=core*(.53+.47*abs(sin(uv.y*12.-time*2.8+j)));
        }
        float alpha=smoothstep(.045,.57,field)*smoothstep(0.,.063,uv.y);
        vec3 heat=mix(vec3(.96,.23,.025),vec3(1.,.75,.30),clamp(field*.86+(1.-uv.y)*.13,0.,1.));
        gl_FragColor=vec4(heat,alpha*.90);
      }`,
  });
  const live=mesh(parent,new THREE.PlaneGeometry(1.33,1.26),shader,[0,.83,.52]);
  return live;
}
function teaActivity(ctx,scene,panel,x,z) {
  const tea=teaSet(scene,x,.78,z,0xe1d8b6);
  const enamel=mat(0x596267,{metalness:.68,roughness:.24});
  orb(scene,enamel,x-.46,.94,z,.19,.16,.19);
  mesh(scene,new THREE.TorusGeometry(.15,.017,8,28),enamel,[x-.46,1.04,z]);
  beam(scene,enamel,[x-.31,.91,z],[x-.19,1.04,z],.045,true);
  let stage=0;
  const labels=['Selecionar xícara','Servir chá','Esvaziar xícara'];
  const mistCoords = new Float32Array(46*3);
  const mist=specks(scene,mistCoords,0xf7e4bc,.055,.37);
  mist.visible=false;
  function next(){
    stage=(stage+1)%3;
    tea.liquid.visible=stage===2;
    mist.visible=stage===2;
    button.textContent=labels[stage];
    ctx.say(['Xícara vazia.','Xícara selecionada.','Chá servido. A xícara está cheia.'][stage]);
  }
  const button=ctx.button(labels[0],next,panel);
  return {next,reset(){stage=0;mist.visible=false;tea.liquid.visible=false;button.textContent=labels[0];},
    update(time){
      if(!mist.visible)return;
      for(let i=0;i<46;i++){
        const dy=((i*.013+time*.13)% .45);
        mistCoords.set([x+Math.sin(i*3.7+time)*dy*.35,.91+dy,z+Math.cos(i*4.2+time)*dy*.29],i*3);
      }
      mist.geometry.attributes.position.needsUpdate=true;
    }};
}

export function shelter(ctx) {
  const scene=ctx.scene, random=rng(104);
  const sky=atmosphere(ctx,0x425656,0x3f3028,0xc2d7ec,{fog:.041,fill:1.3,intensity:1.3});
  const pine=wood(0x946848), joints=wood(0x563a2b), stone=surfaceMaterial(0xa29282,'stone',2);
  const cloth=mat(0xbfc0a4);
  cuspTerrain(scene,mat(0x4e6849,{vertexColors:true}),100,100,(x,z)=>Math.max(0,Math.min(1,(Math.hypot(x,z)-8)/9))*(Math.sin(x*.23)*1.1+Math.cos(z*.27)*.65)-.06,49);
  const stems=[];
  for(let i=0;i<145;i++){
    const x=(random()-.5)*88,z=(random()-.5)*88;
    if(Math.abs(x)>9 || z>12 || z<-9.9)stems.push([x,-.3,z,3+random()*11,random()*6]);
  }
  trees(scene,stems);
  rocks(scene,stone,Array.from({length:60},()=>[(random()-.5)*53,0,-7-random()*25,.2+random(),random()*.38,.4+random(),random()*6]));
  boxes(scene,pine,Array.from({length:18},(_,i)=>[0,.045,3.83-i*.456,10,.13,.446,0,i%3===0?0xc2aa8d:0xf4e6d3]));
  box(scene,pine,0,3.4,.15,10.35,.2,8.5);
  for(const x of [-5,5])box(scene,pine,x,1.7,0,.22,3.4,8);
  box(scene,pine,0,1.73,4,10,3.45,.18);
  box(scene,joints,3.46,.98,.75,1.58,1.92,.39);
  const shelfBooks=[mat(0x9c815b),mat(0x827957),mat(0x9b5e43),mat(0x587075)];
  for(let i=0;i<14;i++){
    const row=Math.floor(i/7),x=2.90+i%7*.158;
    box(scene,shelfBooks[i%4],x,.67+row*.67,.996,.123,.25+(i%3)*.048,.22);
  }
  for(const y of [.43,1.10,1.77])box(scene,pine,3.46,y,.85,1.54,.085,.43);
  const wall=[];
  for(let i=0;i<17;i++){
    const y=.15+i*.20;
    for(const x of [-3.75,3.75])wall.push([x,y,-4,2.5,.20,.25]);
    if(y<.82 || y>2.73)wall.push([0,y,-4,5,.20,.25]);
  }
  boxes(scene,pine,wall);
  for(const x of [-2.5,0,2.5])box(scene,joints,x,1.78,-3.96,.15,2.05,.22);
  for(const y of [.82,1.72,2.76])box(scene,joints,0,y,-3.95,5.2,.13,.22);
  for(let z=-3.6;z<4;z+=1.16)box(scene,joints,0,3.22,z,10,.2,.18);
  const glass=mat(0xaed8df,{roughness:.14,metalness:.28,transparent:true,opacity:.15,depthWrite:false});
  const pane=group(scene,0,1.8,-4.06);
  box(pane,glass,-1.22,0,0,2.4,1.88,.035);
  box(pane,joints,-2.42,0,0,.09,1.85,.1);
  box(scene,glass,1.24,1.8,-4.06,2.4,1.88,.035);
  const streaks=new THREE.BufferGeometry(), streakArray=new Float32Array(540);
  for(let i=0;i<90;i++){
    const x=(random()-.5)*4.9,y=.91+random()*1.8;
    streakArray.set([x,y,-3.98,x+.014,y+.03+random()*.20,-3.98],i*6);
  }
  streaks.setAttribute('position',new THREE.BufferAttribute(streakArray,3));
  const windowRain=new THREE.LineSegments(streaks,new THREE.LineBasicMaterial({color:0xa9d9ec,opacity:.44,transparent:true}));
  scene.add(windowRain);
  const curtains=[-1,1].map(side=>{
    const curtain=group(scene,side*2.46,1.8,-3.80);
    for(let i=0;i<10;i++)box(curtain,cloth,side*i*.039,0,Math.sin(i*1.3)*.045,.061,2.13,.08);
    return curtain;
  });
  const chimney=group(scene,-3.44,0,-3.22);
  box(chimney,stone,0,.10,0,2.63,.18,1.2);
  box(chimney,mat(0x242327),0,.76,-.24,1.48,1.18,.16);
  const bricks=[];
  for(let j=0;j<10;j++)for(let i=0;i<6;i++){
    if(j<4&&i>0&&i<5)continue;
    bricks.push([(i-2.5)*.39+(j%2)*.06,.24+j*.267,(random()-.5)*.1,.36+random()*.04,.245,.54,0,random()>.5?0xcabaaa:0xf7f0df]);
  }
  boxes(chimney,stone,bricks);
  box(chimney,joints,0,1.43,.34,2.65,.14,.48);
  for(let i=0;i<7;i++)beam(chimney,joints,[-.47,.2+i*.025,.2-i*.058],[.48,.2+i*.025,.2-i*.057],.07);
  const coals=glow(0xe06828,.49);
  const embers=Array.from({length:16},()=>orb(chimney,coals,(random()-.5)*1.18,.22+random()*.14,.27+random()*.14,.041,.029,.049));
  const fire=hearthFire(chimney);
  const warm=lamp(scene,0xffa34e,17,-3.37,.82,-2.55,7);
  const readingLight=lamp(scene,0xffdc97,17,2.9,2.25,-1.5,7);
  beam(scene,joints,[2.9,.15,-1.5],[2.9,2.27,-1.5],.035);
  mesh(scene,new THREE.CylinderGeometry(.17,.35,.33,24),mat(0xc9a173),[2.9,2.32,-1.5]);
  table(scene,joints,0,-1.85,1.45,.84);
  seat(scene,cloth,joints,1.86,-2.56,Math.PI*.52);
  seat(scene,cloth,joints,-2.8,-.9,Math.PI*.34);
  box(scene,mat(0x745248),.1,.125,-1.76,4.05,.025,2.42);
  const rain=precip(ctx,{count:980,size:42,omit:(x,z)=>Math.abs(x)<5.4&&Math.abs(z)<4.5});
  const audio=atmosphereAudio(ctx);
  const nav=navigator(ctx,{start:[.2,1.71,2.8],bounds:[-4.67,4.67,-3.65,3.6],ground:()=>.10,canWalk:(x,z)=>!(Math.abs(x)<.85&&Math.abs(z+1.85)<.48)&&!(x<-2.3&&z<-2.5)});
  const saved=ctx.load({});
  let weather=Number.isInteger(saved?.weather)&&saved.weather>=0&&saved.weather<4?saved.weather:1;
  let opened=false,lit=true,shade=false,timeOfDay=0,candleLit=true;
  const candleLight=lamp(scene,0xffbe73,7,-.35,1.02,-1.85,4.2);
  box(scene,mat(0xe7dec8),-.35,.86,-1.85,.07,.16,.07);
  const candleFlame=orb(scene,glow(0xffb558,1.8),-.35,.97,-1.85,.026,.045,.026);
  function applyWeather(){
    const baseColors=[0x536765,0x44595d,0x354953,0x627f9c][weather];
    const moodMul=[1,.58,1.22][timeOfDay];
    const c=new THREE.Color(baseColors).multiplyScalar(moodMul);
    scene.background.copy(c);scene.fog.color.copy(c);
    scene.fog.density=[.05,.065,.082,.031][weather];
    sky.intensity=[1.7,1.35,.9,2.5][weather]*moodMul;
    windowRain.material.opacity=[.27,.47,.63,0][weather];
    audio.set([.30,.47,.76,.0][weather],opened?1750:350);
  }
  const climate=ctx.select('Clima',['Garoa','Chuva moderada','Chuva forte','Céu aberto'],value=>{weather=value;applyWeather();ctx.save({weather});});
  climate.value=String(weather);
  ctx.select('Horário',['Entardecer','Madrugada','Amanhecer'],value=>{timeOfDay=value;applyWeather();ctx.say(['Luz de entardecer.','Madrugada silenciosa.','Primeiras luzes do amanhecer.'][value]);});
  const panel=ctx.group();
  function toggleWindow(){
    opened=!opened;pane.rotation.y=opened?-.65:0;
    windowButton.textContent=opened?'Fechar janela':'Abrir janela';
    applyWeather();
    ctx.say(opened?'Janela aberta. As frequências altas da chuva ficam mais nítidas.':'Janela fechada. O vidro abafa o exterior.');
  }
  const windowButton=ctx.button('Abrir janela',toggleWindow,panel);
  const fireplace=ctx.button('Apagar lareira',()=>{lit=!lit;fireplace.textContent=lit?'Apagar lareira':'Acender lareira';},panel);
  ctx.button('Cortinas',()=>{shade=!shade;curtains.forEach((item,i)=>{item.scale.x=shade?4.8:1;item.position.x=(i?1:-1)*(shade?.77:2.46);});},panel);
  ctx.button('Luminária',()=>{readingLight.visible=!readingLight.visible;},panel);
  const candleButton=ctx.button('Apagar vela',()=>{candleLit=!candleLit;candleFlame.visible=candleLit;candleLight.intensity=candleLit?7:0;candleButton.textContent=candleLit?'Apagar vela':'Acender vela';},panel);
  const tea=teaActivity(ctx,scene,panel,.38,-1.78);
  const sit=()=>{nav.seat(1.78,1.14,-2.47,-.22);ctx.say('Canto de leitura. Use Levantar para voltar ao passeio.');};
  ctx.button('Sentar à janela',sit,panel);
  nav.add({x:0,z:-2.9,label:'Abrir ou fechar janela',action:toggleWindow,range:1.6},
    {x:.22,z:-1,label:'Preparar chá',action:tea.next,range:1.1},
    {x:1.84,z:-2.28,label:'Sentar',action:sit,range:1.2});
  applyWeather();
  return withNavigation(nav,{mute:audio.mute,dispose:audio.dispose,
    reset(){if(opened)toggleWindow();if(!lit)fireplace.click();tea.reset();ctx.say('Cabana pronta para explorar.');},
    update(_,t){
      rain(ctx.reduced?0:t,[.32,.61,1,0][weather]);
      tea.update(ctx.reduced?0:t);
      warm.intensity=lit?16+(ctx.reduced?0:Math.sin(t*8)*1.8+Math.sin(t*5.3)):0;
      fire.visible=lit;fire.material.uniforms.time.value=ctx.reduced?1:t;
      embers.forEach(ember=>{ember.visible=lit;});
      nav.position.textContent=opened?'Janela aberta':'Janela fechada';
    }});
}

export function trainJourney(ctx) {
  const scene=ctx.scene,random=rng(5517);
  atmosphere(ctx,0x91b0c4,0x66543e,0xffe4bd,{fog:.024,fill:1.65,intensity:2.6});
  const frame=wood(0x73503b),slats=wood(0xb08962);
  const brass=mat(0xd0ab6c,{metalness:.59,roughness:.31});
  const glass=mat(0xb6cadd,{transparent:true,opacity:.14,depthWrite:false,roughness:.22,metalness:.25});
  const velvet=mat(0x42645b),carpet=mat(0x766353),light=glow(0xffe3a2,.75);
  for(const [i,z] of [[0,8],[1,-3],[2,-14]]){
    box(scene,slats,0,-.1,z,3.1,.2,10.4);
    box(scene,frame,0,2.92,z,3.1,.17,10.4);
    box(scene,carpet,0,.012,z,.96,.019,10.4);
    for(const x of [-1.52,1.52]){
      box(scene,frame,x,.32,z,.13,.65,10.4);
      box(scene,frame,x,2.59,z,.13,.58,10.4);
      for(let j=-4.15;j<5;j+=1.86){
        box(scene,slats,x,1.51,z+j,.16,1.8,.16);
        if(j<4)box(scene,glass,x,1.51,z+j+.82,.035,1.78,1.62);
      }
      box(scene,brass,x,2.32,z,.09,.04,10.4);
    }
    for(let j=-4;j<=4;j+=2.4){
      box(scene,light,0,2.81,z+j,.08,.025,1.4);
      if(i===1)table(scene,frame,.94,z+j,.60,.63);
      seat(scene,velvet,frame,-1.08,z+j,Math.PI*.4);
      if(i!==1)seat(scene,velvet,frame,1.1,z+j+.32,-Math.PI*.4);
    }
    sign(scene,['Panorâmico','Café','Leitura'][i],0,2.39,z+4.79,1.12,.22);
    lamp(scene,0xffd79b,11,0,2.55,z,6);
  }
  for(const z of [2.5,-8.5]){
    box(scene,frame,0,-.08,z,2.9,.2,.8);
    for(const x of [-1.39,1.39])box(scene,frame,x,1.4,z,.15,2.8,1);
    box(scene,frame,0,2.83,z,2.85,.18,1);
  }
  for(const z of [13.15,-19.21])box(scene,frame,0,1.47,z,3.18,2.84,.13);
  table(scene,frame,1.02,8.15,.67,.69);
  table(scene,frame,1.02,-3.6,.67,.69);
  const land=surfaceMaterial(0x78806b,'soil',12),far=surfaceMaterial(0xc0c8c0,'stone',3),rail=mat(0x777c7c,{metalness:.73});
  box(scene,mat(0x4a4e46),0,-.8,0,4.7,.37,210);
  for(const x of [-.72,.72])box(scene,rail,x,-.51,0,.11,.09,215);
  const segments=[];
  for(let k=0;k<5;k++){
    const sub=group(scene);
    box(sub,land,0,-2.7,0,220,2.6,40.2);
    const mountains=[],pines=[];
    for(let i=0;i<36;i++)pines.push([(i%2?1:-1)*(8+random()*35),-1.35,(random()-.5)*39,2.7+random()*5.2,random()*5]);
    for(let i=0;i<14;i++)mountains.push([(i%2?1:-1)*(32+random()*39),-4,(random()-.5)*42,11+random()*20,9+random()*20,14+random()*18,random()*5,
      [0xc3c5b4,0xb5c5c7,0xa4a593,0xdce3dc][i%4]]);
    const woods=group(sub);trees(woods,pines);rocks(sub,far,mountains);
    segments.push({sub,woods});
  }
  const colorways=[[0x91b0c4,0x78806b,0xc0c6c2],[0x719da9,0x4b7773,0x9bb1ab],[0x9ea99d,0x526c43,0x8e9b85],[0xcaa990,0xb69b6d,0xcdad91]];
  const audio=atmosphereAudio(ctx);
  const nav=navigator(ctx,{start:[0,1.62,11.2],bounds:[-.54,.54,-18.75,12.74],speed:3.2});
  let speed=5,distance=0,shade=false,routeIdx=0,lightMode=0;
  const curtain=box(scene,mat(0x877056),1.43,1.68,8.56,.035,1.52,1.68);
  curtain.visible=false;
  function applyTrainMood(){
    const [skyHex,ground,peak]=colorways[routeIdx];
    const tint=[1,.72,.34][lightMode];
    const c=new THREE.Color(skyHex).multiplyScalar(tint);
    scene.background.copy(c);scene.fog.color.copy(c);
    land.color.setHex(ground);far.color.setHex(peak);
    light.emissiveIntensity=[.75,1.15,1.6][lightMode];
  }
  ctx.select('Rota',['Alpes','Litoral','Floresta','Deserto'],index=>{
    routeIdx=index;
    applyTrainMood();
    segments.forEach(({woods})=>woods.visible=index!==3);
    ctx.say('Rota selecionada. Céu, solo e vegetação acompanham a paisagem.');
  });
  ctx.select('Iluminação',['Dia','Entardecer','Noturno'],index=>{
    lightMode=index;
    applyTrainMood();
    ctx.say(['Claridade diurna.','Luz dourada de fim de tarde.','Viagem noturna com cabines aquecidas.'][index]);
  });
  ctx.range('Velocidade',0,17,.5,speed,value=>{speed=value;});
  const buttons=ctx.group();
  const sit=()=>{nav.seat(.84,1.22,8.18,Math.PI*.45);ctx.say('Você está sentado no salão panorâmico.');};
  ctx.button('Sentar à janela',sit,buttons);
  ctx.button('Cortina',()=>{shade=!shade;curtain.visible=shade;ctx.say(shade?'Cortina fechada.':'Cortina aberta.');},buttons);
  const tea=teaActivity(ctx,scene,buttons,1.12,8.06);
  const cafe=teaActivity(ctx,scene,ctx.group(),1.12,-3.69);
  cafe.reset();
  nav.add({x:0,z:8.1,range:1.4,label:'Sentar à janela',action:sit},
    {x:0,z:-3.6,range:1.8,label:'Preparar chá',action:cafe.next},
    {x:0,z:-15.1,range:1.6,label:'Ler à janela',action:()=>ctx.say('O vale mudava de cor entre uma página e outra. A viagem já era o destino.')});
  return withNavigation(nav,{mute:audio.mute,dispose:audio.dispose,
    reset(){distance=0;tea.reset();cafe.reset();curtain.visible=shade=false;ctx.say('De volta ao vagão panorâmico.');},
    update(dt,time){
      distance+=dt*speed*(ctx.reduced?.35:1);
      tea.update(ctx.reduced?0:time);cafe.update(ctx.reduced?0:time);
      segments.forEach(({sub},index)=>sub.position.z=((index*40+distance)%200)-100);
      const name=nav.pos.z>2.5?'Salão panorâmico':nav.pos.z>-8.5?'Café':'Cabine de leitura';
      nav.position.textContent=name+' · '+Math.round(speed*3.6)+' km/h';
      nav.zone(name+' '+speed,()=>audio.set(.24+speed*.024,name==='Cabine de leitura'?270:620));
    }});
}

