import {spawn} from 'node:child_process';
import {resolve,join} from 'node:path';
import {mkdtemp} from 'node:fs/promises';
import {tmpdir} from 'node:os';
const profile=await mkdtemp(join(tmpdir(),'atlas-chrome-'));
const browser=spawn((process.env.ATLAS_CHROME || 'C:/Program Files/Google/Chrome/Application/chrome.exe'),['--headless=new','--no-sandbox','--disable-dev-shm-usage','--remote-debugging-port=9227','--enable-unsafe-swiftshader','--use-angle=swiftshader','--disable-background-networking','--no-first-run','--user-data-dir='+profile,'about:blank'],{windowsHide:true,stdio:'ignore'});
const server=spawn(process.execPath,['scripts/serve.mjs'],{cwd:resolve('.'),windowsHide:true,stdio:'ignore',env:{...process.env,ATLAS_PORT:'4379'}});
try{
 for(let i=0;i<30;i++){
  try{const results=await Promise.all([fetch('http://127.0.0.1:9227/json/list'),fetch('http://127.0.0.1:4379')]);if(results.every(r=>r.ok))break;}catch{}
  await new Promise(r=>setTimeout(r,400));
 }
 await import('./browser.mjs');
}finally{browser.kill();server.kill();}



