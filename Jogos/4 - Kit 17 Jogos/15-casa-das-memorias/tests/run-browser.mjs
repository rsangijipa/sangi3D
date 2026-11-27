import {spawn} from 'node:child_process';
import {resolve,join} from 'node:path';
import {mkdtemp} from 'node:fs/promises';
import {tmpdir} from 'node:os';
const profile=await mkdtemp(join(tmpdir(),'casa-chrome-'));
const browser=spawn((process.env.CASA_CHROME || 'C:/Program Files/Google/Chrome/Application/chrome.exe'),['--headless=new','--no-sandbox','--disable-dev-shm-usage','--remote-debugging-port=9235','--enable-unsafe-swiftshader','--use-angle=swiftshader','--disable-background-networking','--no-first-run','--user-data-dir='+profile,'about:blank'],{windowsHide:true,stdio:'ignore'});
const server=spawn(process.execPath,['scripts/serve.mjs'],{cwd:resolve('.'),windowsHide:true,stdio:'ignore',env:{...process.env,CASA_PORT:'4395'}});
try{
 for(let i=0;i<30;i++){
  try{const results=await Promise.all([fetch('http://127.0.0.1:9235/json/list'),fetch('http://127.0.0.1:4395')]);if(results.every(r=>r.ok))break;}catch{}
  await new Promise(r=>setTimeout(r,400));
 }
 await import('./browser.mjs');
}finally{browser.kill();server.kill();}





