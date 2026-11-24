import {writeFile,mkdir} from 'node:fs/promises';
const [tab]=await fetch('http://127.0.0.1:9236/json/list').then(r=>r.json());
const ws=new WebSocket(tab.webSocketDebuggerUrl),pending=new Map(),errors=[];
let key=0;
ws.onmessage=e=>{const m=JSON.parse(e.data);if(m.method==='Runtime.exceptionThrown')errors.push(m.params.exceptionDetails.exception?.description);if(m.method==='Log.entryAdded'&&m.params.entry.level==='error')errors.push(m.params.entry.text);if(m.id){const [ok,no]=pending.get(m.id);pending.delete(m.id);m.error?no(m.error):ok(m.result);}};
await new Promise((ok,no)=>{ws.onopen=ok;ws.onerror=no;});
const send=(method,params={})=>new Promise((ok,no)=>{const id=++key;pending.set(id,[ok,no]);ws.send(JSON.stringify({id,method,params}));});
const run=async expression=>{const r=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw Error(r.exceptionDetails.exception?.description);return r.result.value;};
const wait=ms=>new Promise(r=>setTimeout(r,ms));
const click=selector=>run('document.querySelector('+JSON.stringify(selector)+').click()');
const assert=async exp=>{if(!await run(exp))throw Error(exp);};
const shot=async name=>{await wait(750);const r=await send('Page.captureScreenshot',{format:'jpeg',quality:89});await writeFile('capturas/'+name+'.jpg',Buffer.from(r.data,'base64'));};
const viewport=async (w,h)=>send('Emulation.setDeviceMetricsOverride',{width:w,height:h,deviceScaleFactor:1,mobile:w<500});
await mkdir('capturas',{recursive:true});
await send('Runtime.enable');await send('Log.enable');await send('Page.enable');await viewport(1280,720);
await send('Page.navigate',{url:'http://127.0.0.1:4396'});await wait(2100);
const names=await run(`(async()=>{
 const [{GLTFExporter},{mount,token},{initial},T]=await Promise.all([import('/exporter.js'),import('/scene/house.js'),import('/game/state.js'),import('/assets/vendor/three.module.js')]);
 const host=document.createElement('div');host.style.cssText='position:fixed;width:640px;height:400px;left:-900px';document.body.append(host);
 const workshop=mount(host,()=>{},()=>{},false);
 workshop.apply({...initial(),drawer:true,caseOpen:true,reduced:true});
 await new Promise(r=>setTimeout(r,350));
 const models=workshop.exportables,world=models.house;
 for(const [name,source] of [['rugs','rug'],['lamps','lamp'],['plants','plant']]){
  const collection=new T.Group(),parts=[];
  world.traverse(o=>{if(o.name===source)parts.push(o);});
  for(const p of parts){const c=p.clone();c.traverse(o=>{if(o.isLight)o.visible=false;});collection.add(c);}
  collection.children.forEach((c,i)=>c.position.set(i*1.3,0,0));
  collection.name=name;models[name]=collection;
 }
 const symbols=new T.Group();['leaf','star','flower','stone','card'].forEach((kind,i)=>token(symbols,kind).position.x=i*.275);symbols.name='memory_tokens';models.memory_tokens=symbols;
 models.blanket=models.bed.getObjectByName('blanket');
 window.casaModels={models,exporter:new GLTFExporter()};
 return Object.keys(models).filter(key=>models[key]);
})()`);
await mkdir('assets/models',{recursive:true});
const modelIDs=[];
for(const name of names){
 const size=await run(`(async()=>{const c=window.casaModels;window.meshData=new Uint8Array(await c.exporter.parseAsync(c.models[${JSON.stringify(name)}],{binary:true,onlyVisible:true,maxTextureSize:512}));return window.meshData.length;})()`);
 const buffers=[];
 for(let i=0;i<size;i+=524288){
  const data=await run(`(()=>{const bytes=window.meshData.subarray(${i},${i+524288});let raw='';for(let j=0;j<bytes.length;j+=16384)raw+=String.fromCharCode(...bytes.subarray(j,j+16384));return btoa(raw);})()`);
  buffers.push(Buffer.from(data,'base64'));
 }
 const file=Buffer.concat(buffers);
 if(file.readUInt32LE(0)!==0x46546c67||file.readUInt32LE(4)!==2||file.readUInt32LE(8)!==size)throw Error(name+' GLB inválido');
 const json=JSON.parse(file.subarray(20,20+file.readUInt32LE(12)).toString('utf8'));
 if(!json.meshes?.length||!json.accessors?.every(x=>x.count>0))throw Error(name+' sem malhas válidas');
 await writeFile('assets/models/'+name+'.glb',file);
 modelIDs.push(name);console.log(name,size,json.meshes.length);
}
console.log('Exportados',modelIDs.length);ws.close();
