import {writeFile,mkdir} from 'node:fs/promises';
const [tab]=await fetch('http://127.0.0.1:9227/json/list').then(r=>r.json());
const ws=new WebSocket(tab.webSocketDebuggerUrl);
const promises=new Map(),errors=[];
let key=0;
ws.onmessage=e=>{const msg=JSON.parse(e.data);if(msg.method==='Runtime.exceptionThrown')errors.push(msg.params.exceptionDetails.text+' '+msg.params.exceptionDetails.exception?.description);if(msg.method==='Log.entryAdded'&&msg.params.entry.level==='error')errors.push(msg.params.entry.text);if(msg.id){const [ok,no]=promises.get(msg.id);promises.delete(msg.id);msg.error?no(msg.error):ok(msg.result);}};
await new Promise((ok,no)=>{ws.onopen=ok;ws.onerror=no;});
const send=(method,params={})=>new Promise((ok,no)=>{const id=++key;promises.set(id,[ok,no]);ws.send(JSON.stringify({id,method,params}));});
const run=async expression=>{const r=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw Error(r.exceptionDetails.exception?.description);return r.result.value;};
const wait=ms=>new Promise(r=>setTimeout(r,ms));
const click=selector=>run('document.querySelector('+JSON.stringify(selector)+').click()');
const assert=async exp=>{if(!await run(exp))throw Error(exp);};
const shot=async name=>{await wait(350);const r=await send('Page.captureScreenshot',{format:'jpeg',quality:88});await writeFile('capturas/'+name+'.jpg',Buffer.from(r.data,'base64'));};
await mkdir('capturas',{recursive:true});
await send('Runtime.enable');await send('Log.enable');await send('Page.enable');
await send('Emulation.setDeviceMetricsOverride',{width:1280,height:720,deviceScaleFactor:1,mobile:false});
await send('Page.navigate',{url:'http://127.0.0.1:4379'});await wait(2500);
console.log(await run('location.href+" "+document.title')); await assert('document.querySelector("dialog").open && document.querySelector("#fallback").hidden');
await shot('desktop-entrada');
await run('document.querySelector("button[value=start]").focus()');
await send('Input.dispatchKeyEvent',{type:'keyDown',key:' ',code:'Space',windowsVirtualKeyCode:32});
await send('Input.dispatchKeyEvent',{type:'keyUp',key:' ',code:'Space',windowsVirtualKeyCode:32});
await wait(150);await assert('!document.querySelector("dialog").open');
await click('[data-key=stage-1]');await click('[data-key="rotate-15"]');
await assert('document.querySelector("#panel").textContent.includes("15°")');
await click('[data-key="zoom-0.5"]');await assert('document.querySelector("#panel").textContent.includes("1.5×")');
await click('[data-key="zoom--0.5"]');
await click('[data-key=stage-2]');await shot('desktop-luz-rasante');console.log('desktop',await run('JSON.stringify(document.querySelector("canvas").dataset)'));
await click('[data-key="light-25"]');await assert('document.querySelector("#panel").textContent.includes("−21°") || document.querySelector("#panel").textContent.includes("-21°")');
await click('[data-key=stage-3]');await click('[data-key=describe-rugoso]');await shot('desktop-comparacao');
await click('[data-key=stage-4]');await click('[data-key=save-now]');await click('[data-key=stage-5]');
await assert('document.querySelector(".entries").textContent.includes("rugoso")');await shot('desktop-revisao');
await click('[data-key=remove-cork]');await assert('!document.querySelector(".entries li")');
await run('window.dispatchEvent(new KeyboardEvent("keydown",{key:"Escape",bubbles:true}));document.dispatchEvent(new KeyboardEvent("keydown",{key:"Escape",bubbles:true}));');
await assert('document.querySelector("dialog").open');await click('button[value=resume]');
await click('[data-key=mute-toggle]');await assert('document.querySelector("[data-key=mute-toggle]").textContent.includes("Som ligado")');
for(const [w,h] of [[1920,1080],[390,844],[360,640],[430,932],[768,1024],[844,390]]){
 await send('Emulation.setDeviceMetricsOverride',{width:w,height:h,deviceScaleFactor:1,mobile:w<500});
 await click('[data-key=stage-2]');await assert('document.documentElement.scrollWidth===innerWidth && document.querySelector("canvas").width>0');
 if(w===390){await shot('mobile-luz-rasante');console.log('mobile',await run('JSON.stringify(document.querySelector("canvas").dataset)'));await click('[data-key=stage-1]');await click('[data-key="zoom-0.5"]');await shot('mobile-lupa');await click('[data-key=stage-5]');await shot('mobile-revisao');}
}
await run('window.restoreExtension=document.querySelector("canvas").getContext("webgl2").getExtension("WEBGL_lose_context");window.restoreExtension.loseContext()');await wait(300);
await assert('!document.querySelector("#fallback").hidden');
await run('window.restoreExtension.restoreContext()');await wait(900);
await assert('document.querySelector("#fallback").hidden');
await send('Page.reload');await wait(1000);
await assert('document.querySelector("dialog")?.open && document.querySelector("[data-key=mute-toggle]").textContent.includes("Som ligado")');
await click('button[value=start]');await click('[data-key=stage-5]');await assert('!document.querySelector(".entries li")');
console.log(JSON.stringify({viewportProfiles:7,errors}));ws.close();
if(errors.length)process.exitCode=1;






