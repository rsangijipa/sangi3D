import {writeFile,mkdir} from 'node:fs/promises';
const [tab]=await fetch('http://127.0.0.1:9235/json/list').then(r=>r.json());
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
await send('Page.navigate',{url:'http://127.0.0.1:4395'});await wait(2100);
await assert('document.querySelector("#fallback").hidden && document.querySelector("#scene canvas")');
await shot('desktop-casa');console.log('casa',await run('JSON.stringify(document.querySelector("#scene canvas").dataset)'));
await click('[data-key=open-start]');await click('button[value=story]');await click('[data-key=room-studio]');await click('[data-key=symbol-leaf]');
await run('document.querySelector("#label").value="folha de papel";document.querySelector("#label").dispatchEvent(new Event("input",{bubbles:true}));');
await click('[data-key=stage-3]');await shot('desktop-guardar');
await click('[data-key=place-stored]');await assert('document.querySelector("#panel h2").textContent==="Reorganizar"');
await assert('document.querySelector(".entries").textContent.includes("folha de papel")');await shot('desktop-gaveta');
await click('[data-key=drawer-toggle]');await assert('!document.querySelector(".entries").textContent.includes("folha de papel")');
await click('[data-key=stage-5]');await assert('!document.querySelector(".review")');await click('[data-action=show]');
await assert('document.querySelector(".review").textContent.includes("folha de papel")');await shot('desktop-revisao');
await click('[data-key=stage-4]');await run('const el=document.querySelector("select[data-action=move]");el.value="storage|stored";el.dispatchEvent(new Event("change",{bubbles:true}));');
await assert('document.querySelector("#room-name").textContent==="Depósito"');await shot('desktop-mala');
await click('[data-key=case-toggle]');await assert('!document.querySelector(".entries").textContent.includes("folha de papel")');
await click('[data-key=delete-1]');await click('button[value=delete-1]');await assert('!document.querySelector(".entries")');
await click('[data-key=stage-1]');
for(const room of ['reading','bedroom','studio','storage']){await click('[data-key=room-'+room+']');await assert('!document.querySelector("#home").hidden');}
for(const [w,h] of [[1920,1080],[390,844],[360,640],[430,932],[768,1024],[844,390]]){
 await viewport(w,h);await assert('document.documentElement.scrollWidth===innerWidth');
 if(w===390){await click('[data-key=room-studio]');await click('[data-key=symbol-card]');await click('[data-key=stage-3]');await shot('mobile-guardar');console.log('mobile',await run('JSON.stringify(document.querySelector("#scene canvas").dataset)'));await click('[data-key=place-stored]');await shot('mobile-gaveta');await click('[data-key=stage-1]');}
}
await run('document.dispatchEvent(new KeyboardEvent("keydown",{key:"Escape",bubbles:true}));');await assert('document.querySelector("dialog").open');await click('button[value=resume]');
await run('window.restoreExtension=document.querySelector("#scene canvas").getContext("webgl2").getExtension("WEBGL_lose_context");window.restoreExtension.loseContext()');await wait(400);
await assert('!document.querySelector("#fallback").hidden');await run('window.restoreExtension.restoreContext()');await wait(800);
await assert('document.querySelector("#fallback").hidden');
console.log(JSON.stringify({viewports:7,errors}));ws.close();if(errors.length)process.exitCode=1;

