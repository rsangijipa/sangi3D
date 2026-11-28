import { THREE, readJSON, download } from './runtime.js';
import { navigator, withNavigation, atmosphereAudio } from './navigation.js';
import { atmosphere, box, group, lamp, marker, mat, mesh, orb, sign, tube, wood } from './scenery.js';

const names=['Momentos','Pessoas','Lugares','Futuro'];
const symbols=['Pedra','Livro','Esfera','Flor','Chave'];
const guideSlots=['01','02','03','04','05','06','07','08'];
const defaults={version:1,rooms:names,slots:Array(8).fill(null)};
function validState(data){
  return data?.version===1&&Array.isArray(data.rooms)&&data.rooms.length===4&&data.rooms.every(name=>typeof name==='string'&&name.trim()&&name.length<=34)
    &&Array.isArray(data.slots)&&data.slots.length===8&&data.slots.every(item=>item===null||item&&typeof item.title==='string'&&item.title.trim()&&item.title.length<=65
    &&typeof item.text==='string'&&item.text.length<=320&&Number.isInteger(item.symbol)&&item.symbol>=0&&item.symbol<5
    &&typeof item.image==='string'&&(!item.image||item.image.length<285_000&&/^data:image\/jpeg;base64,[A-Za-z0-9+/=]+$/.test(item.image)));
}
function imageFromFile(file){
  if(!['image/jpeg','image/png','image/webp'].includes(file.type)||file.size>12_000_000)throw new Error('Escolha JPG, PNG ou WebP de até 12 MB.');
  return createImageBitmap(file).then(bitmap=>{
    const scale=Math.min(1,520/Math.max(bitmap.width,bitmap.height));
    const surface=document.createElement('canvas');
    surface.width=Math.max(1,Math.round(bitmap.width*scale));surface.height=Math.max(1,Math.round(bitmap.height*scale));
    const g=surface.getContext('2d');g.fillStyle='#151617';g.fillRect(0,0,surface.width,surface.height);g.drawImage(bitmap,0,0,surface.width,surface.height);
    bitmap.close();
    return surface.toDataURL('image/jpeg',.73);
  });
}
function emblem(scene,kind){
  const ink=mat(0xc8ac78,{roughness:.34,metalness:.48});
  if(kind===0)return mesh(scene,new THREE.IcosahedronGeometry(.25,1),mat(0x898985),[0,.27,0],[1,.72,1.17]);
  if(kind===1){
    const b=group(scene);
    box(b,mat(0x53675e),0,.23,0,.44,.30,.13);
    box(b,ink,0,.27,.072,.32,.023,.016);
    return b;
  }
  if(kind===2)return orb(scene,ink,0,.29,0,.22);
  if(kind===3){
    const flower=group(scene);
    tube(flower,mat(0x72875d),0,.19,0,.021,.37);
    for(let i=0;i<5;i++)orb(flower,mat(0xc89186),Math.cos(i*1.257)*.079,.42+Math.sin(i*1.257)*.079,0,.079,.072,.04);
    orb(flower,ink,0,.41,.046,.051);
    return flower;
  }
  const key=group(scene);
  mesh(key,new THREE.TorusGeometry(.090,.024,9,29),ink,[-.18,.28,0]);
  box(key,ink,.01,.28,0,.25,.046,.048);
  box(key,ink,.105,.22,0,.041,.13,.048);
  return key;
}

export function museum(ctx){
  const scene=ctx.scene;
  atmosphere(ctx,0x4b4945,0x655f55,0xffebd6,{fog:.029,fill:1.58,intensity:2.55});
  const plaster=mat(0xbeb3a0),walnut=wood(0xa47751),woodDark=wood(0x574234);
  const trim=mat(0xa99c87),glass=mat(0xb5d4d8,{opacity:.19,transparent:true,roughness:.14,metalness:.22,depthWrite:false});
  const oak=mat(0x8a6148);
  box(scene,trim,0,4.40,-12,12,.18,46);
  for(const x of [-6.0,6.0])box(scene,plaster,x,2.16,-12,.21,4.32,46);
  box(scene,plaster,0,2.14,-34.9,12,.0+4.28,.21);
  box(scene,plaster,0,2.14,9.8,12,4.28,.21);
  for(let z=-34;z<=9;z+=.4)box(scene,walnut,0,-.07,z,12,.15,.39);
  for(let z=-33;z<11;z+=1.24)box(scene,woodDark,0,4.20,z,12,.12,.145);
  for(const x of [-3.7,3.7])box(scene,oak,x,3.96,-12,.07,.07,42.4);
  for(let r=0;r<4;r++){
    const z=1.2-r*9.1;
    for(const x of [-3.86,3.86]){
      box(scene,plaster,x,2.02,z+3.18,4.29,4.05,.24);
      box(scene,woodDark,x,3.68,z+3.21,4.29,.12,.27);
      lamp(scene,0xffddb5,21,x,3.6,z-.22,7.6);
    }
    box(scene,woodDark,0,.35,z-3.7,1.4,.16,.49);
    for(const x of [-.5,.5])box(scene,woodDark,x,.16,z-3.7,.11,.29,.43);
  }
  let data=ctx.load(defaults);
  data=validState(data)?structuredClone(data):structuredClone(defaults);
  const gallerySigns=[];
  const exhibits=[];
  for(let i=0;i<8;i++){
    const side=i%2===0?-1:1, z=1.6-Math.floor(i/2)*9.1;
    const x=side*4.02;
    const root=group(scene,x,0,z);
    root.rotation.y=-side*Math.PI*.43;
    box(root,woodDark,0,.42,0,1.12,.85,.81);
    box(root,trim,0,.86,0,1.18,.10,.85);
    box(root,glass,0,1.18,-.34,1.11,.58,.028);
    box(root,glass,0,1.18,.34,1.11,.58,.028);
    for(const s of [-1,1])box(root,glass,s*.54,1.18,0,.025,.58,.69);
    box(root,glass,0,1.48,0,1.11,.027,.69);
    const panel=group(root,0,1.96,-.45);
    box(panel,woodDark,0,.18,0,1.38,1.04,.075);
    box(panel,mat(0xe0d0b8),0,.18,.047,1.28,.91,.021);
    const object=group(root,0,.94,0),plot=group(panel,0,.18,.069);
    marker(scene,0xf1ce9e,side*2.91,.029,z);
    exhibits.push({object,plot,content:null,image:null});
  }
  function roomSigns(){
    gallerySigns.forEach(item=>{scene.remove(item);item.geometry.dispose();item.material.map.dispose();item.material.dispose();});
    gallerySigns.length=0;
    data.rooms.forEach((name,i)=>gallerySigns.push(sign(scene,name,0,2.7,4.15-i*9.1,2.0,.36)));
  }
  roomSigns();
  const status=ctx.reading();
  function counts(){
    const n=data.slots.filter(Boolean).length;
    status.textContent=n+' '+(n===1?'memória exposta':'memórias expostas')+' · Galeria local';
  }
  function drawSlot(index){
    const item=data.slots[index], target=exhibits[index];
    if(target.content){
      target.content.traverse(node=>{node.geometry?.dispose();node.material?.dispose();});
      target.object.remove(target.content);target.content=null;
    }
    if(target.image){
      target.image.material.map?.dispose();target.image.material.dispose();target.image.geometry.dispose();
      target.plot.remove(target.image);target.image=null;
    }
    target.plot.userData.generation=(target.plot.userData.generation||0)+1;
    if(!item)return;
    target.content=emblem(target.object,item.symbol);
    target.image=sign(target.plot,item.title,0,0,.003,1.1,.28,{background:'#41382e',ink:'#f3d6ad'});
    if(item.image){
      const generation=target.plot.userData.generation;
      const image=new Image();
      image.onload=()=>{
        if(generation!==target.plot.userData.generation)return;
        const previous=target.image;
        target.plot.remove(previous);previous.material.map.dispose();previous.material.dispose();previous.geometry.dispose();
        const map=new THREE.Texture(image);map.colorSpace=THREE.SRGBColorSpace;map.needsUpdate=true;
        const ratio=image.width/image.height;
        const w=Math.min(1.18,.77*ratio),h=w/ratio;
        target.image=mesh(target.plot,new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map}),[0,0,.002]);
      };
      image.src=item.image;
    }
  }
  const audio=atmosphereAudio(ctx,{cutoff:360});
  const nav=navigator(ctx,{start:[0,1.62,7.42],bounds:[-5.40,5.40,-34.1,9.4],speed:3.15,canWalk:(x,z)=>{
    for(let i=0;i<4;i++){
      const home=1.6-i*9.1;
      if(Math.abs(z-(home+2.78))<.28&&Math.abs(x)>1.66)return false;
      if(Math.abs(z-home)<.57&&Math.abs(Math.abs(x)-4.02)<.75)return false;
      if(Math.abs(z-(home-4.10))<.28&&Math.abs(x)<.75)return false;
    }
    return true;
  }});
  let selected=0,draftImage='',hidden=false,imageToken=0;
  const room=ctx.select('Galeria',data.rooms,index=>{
    nav.place(.21,1.62,3.1-index*9.1,0);ctx.say(data.rooms[index]+'. Selecione um espaço para curadoria.');
  });
  const slot=ctx.select('Espaço de exposição',guideSlots.map((name,i)=>name+' · '+data.rooms[Math.floor(i/2)]),index=>{selected=index;readSlot();});
  const title=ctx.input('Título da memória','text',{maxLength:65});
  const text=ctx.input('Legenda','text',{maxLength:320});
  const symbol=ctx.select('Objeto simbólico',symbols,()=>{});
  const file=ctx.file('Imagem local opcional','image/jpeg,image/png,image/webp',async file=>{
    const ticket=++imageToken;
    const image=await imageFromFile(file);
    if(ticket!==imageToken)return;
    draftImage=image;ctx.say('Imagem carregada localmente. Salve para expor.');
  });
  function readSlot(){
    imageToken++;
    const current=data.slots[selected];
    title.value=current?.title||'';text.value=current?.text||'';
    symbol.value=String(current?.symbol||0);draftImage=current?.image||'';
  }
  function labels(){
    [...room.options].forEach((option,i)=>{option.textContent=data.rooms[i];});
    [...slot.options].forEach((option,i)=>{option.textContent=guideSlots[i]+' · '+data.rooms[Math.floor(i/2)];});
  }
  const edits=ctx.group();
  function saveMemory(){
    const name=title.value.trim();
    if(!name){ctx.say('Preencha o título da memória.');title.focus();return;}
    const item={title:name,text:text.value.trim(),symbol:Number(symbol.value),image:draftImage};
    data.slots[selected]=item;drawSlot(selected);counts();
    if(ctx.save(data))ctx.say('Memória exposta e salva: '+name+'.');
  }
  const save=ctx.button('Salvar memória',saveMemory,edits,true);
  const clearImage=ctx.button('Remover imagem',()=>{imageToken++;draftImage='';ctx.say('Imagem removida do rascunho. Use Salvar memória para aplicar.');},edits);
  const erase=ctx.button('Remover memória',()=>{
    if(erase.dataset.slot!==String(selected)){
      erase.dataset.slot=String(selected);erase.textContent='Confirmar remoção';return;
    }
    data.slots[selected]=null;ctx.save(data);drawSlot(selected);counts();readSlot();
    erase.textContent='Remover memória';delete erase.dataset.slot;ctx.say('Espaço liberado.');
  },edits);
  ctx.on(slot,'change',()=>{erase.textContent='Remover memória';delete erase.dataset.slot;});
  const visit=ctx.button('Modo visita',()=>{
    hidden=!hidden;
    [title,text,symbol,file].forEach(input=>{input.parentElement.hidden=hidden;});
    [save,clearImage,erase].forEach(button=>{button.hidden=hidden;});
    visit.textContent=hidden?'Editar acervo':'Modo visita';
    ctx.say(hidden?'Visita ativa. Aproxime-se para ler a memória.':'Curadoria ativa.');
  },edits);
  ctx.button('Mover para o próximo espaço',()=>{
    const next=(selected+1)%8;
    [data.slots[selected],data.slots[next]]=[data.slots[next],data.slots[selected]];
    drawSlot(selected);drawSlot(next);selected=next;slot.value=String(next);readSlot();ctx.save(data);
    ctx.say('Ordem dos espaços atualizada.');
  },edits);
  const settings=document.createElement('details'),summary=document.createElement('summary');
  summary.textContent='Nome e arquivo do acervo';settings.append(summary);ctx.controls.append(settings);
  const roomName=ctx.input('Novo nome da galeria','text',{maxLength:34});
  settings.append(roomName.parentElement);
  ctx.button('Renomear galeria',()=>{
    if(!roomName.value.trim()){ctx.say('Informe um nome para a galeria.');return;}
    data.rooms[Number(room.value)]=roomName.value.trim();roomSigns();labels();ctx.save(data);ctx.say('Galeria renomeada.');
  },settings);
  ctx.button('Exportar acervo',()=>download(JSON.stringify(data,null,2),'museu-das-memorias.json'),settings);
  const imports=ctx.file('Importar acervo JSON','.json',async file=>{
    const parsed=await readJSON(file);
    if(!validState(parsed))throw new Error('Acervo inválido. As obras atuais foram preservadas.');
    data=parsed;roomSigns();labels();exhibits.forEach((_,i)=>drawSlot(i));counts();readSlot();ctx.save(data);
    ctx.say('Acervo importado com os oito espaços.');
  });
  settings.append(imports.parentElement);
  exhibits.forEach((_,i)=>{
    const s=i%2?-1:1;
    const z=1.6-Math.floor(i/2)*9.1;
    nav.add({x:-s*3.25,z,range:1.8,label:'Examinar espaço '+guideSlots[i],action:()=>{
      const item=data.slots[i];
      if(item)ctx.say(item.title+(item.text?' · '+item.text:'')+' · '+symbols[item.symbol]);
      else ctx.say('Espaço vazio na galeria '+data.rooms[Math.floor(i/2)]+'.');
    }});
    drawSlot(i);
  });
  roomName.value=data.rooms[0];
  ctx.on(room,'change',()=>{roomName.value=data.rooms[Number(room.value)];});
  readSlot();counts();audio.set(.11,380);
  return withNavigation(nav,{mute:audio.mute,dispose(){audio.dispose();exhibits.forEach(item=>{item.plot.userData.generation++;});},
    reset(){ctx.say('Visita reiniciada. O acervo permanece disponível.');},
    update(){nav.position.textContent='Galeria '+data.rooms[Math.min(3,Math.max(0,Math.floor((4.18-nav.pos.z)/9.1)))];}});
}
