import { spawn } from 'node:child_process';
import { access, mkdir, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { chromium } from 'playwright';
import validator from 'gltf-validator';

const base='http://127.0.0.1:4392';
const server=spawn(process.execPath,['node_modules/vite/bin/vite.js','--host','127.0.0.1','--port','4392','--strictPort'],{windowsHide:true});
const chrome='C:/Program Files/Google/Chrome/Application/chrome.exe';
let browser;
try {
  for (let i=0;i<50;i++) {
    if (await fetch(base).then(r=>r.ok,()=>false)) break;
    await new Promise(resolve=>setTimeout(resolve,200));
  }
  const executablePath=process.env.BUSSOLA_CHROME||await access(chrome).then(()=>chrome,()=>undefined);
  browser=await chromium.launch({executablePath,headless:true});
  const page=await browser.newPage({acceptDownloads:true});
  page.on('console',msg=>{ if(msg.type()==='error')console.error(msg.text()); });
  page.on('pageerror',err=>console.error(err));
  await page.goto(base+'/scripts/models.html');
  await page.waitForFunction(()=>!!window.compassModels);
  await mkdir('assets/modelos',{recursive:true});
  const models=await page.evaluate(()=>window.compassModels);
  const manifest=[];
  for (const id of models) {
    const [download, material]=await Promise.all([page.waitForEvent('download'),page.evaluate(id=>window.compassExport(id),id)]);
    const path=`assets/modelos/${id}.glb`;
    await download.saveAs(path);
    const bytes=await readFile(path);
    const report=await validator.validateBytes(new Uint8Array(bytes),{uri:path,maxIssues:20});
    if(report.issues.numErrors) {
      console.error(id,report.issues.messages);
      throw new Error('GLB com erros: '+id);
    }
    manifest.push({id,path,category:id==='region_proxy'?'picking':'modelo 3D',license:'Criação original deste projeto',
      size:bytes.length,sha256:createHash('sha256').update(bytes).digest('hex'),lod:0,material,
      pivot:['orbital_ring','sensation_tokens'].includes(id)?'Centro da órbita':'Plano de apoio da peça',
      animations:id==='body_neutral'?['Frente para costas']:[],collider:id==='body_neutral'?'region_proxy':null,
      fallback:id==='body_neutral'?'Mapa por lista em modo acessível':'Procedural em TypeScript',
      validator:{errors:report.issues.numErrors,warnings:report.issues.numWarnings,
        warningCodes:[...new Set(report.issues.messages.filter(issue=>issue.severity===1).map(issue=>issue.code))]},
    });
    console.log(id, bytes.length, report.issues.numErrors, 'erros', report.issues.numWarnings, 'avisos');
  }
  const path='assets/paper.webp';
  const bytes=await readFile(path);
  manifest.push({id:'paper',path,category:'textura da interface',license:'Criação original deste projeto',size:bytes.length,
    sha256:createHash('sha256').update(bytes).digest('hex'),lod:0,material:'Papel creme com fibras',animations:[],collider:null,fallback:'Cor de papel em CSS'});
  await writeFile('assets/manifest.json',JSON.stringify({version:1,units:'m',up:'Y',assets:manifest},null,2)+'\n');
} finally {
  await browser?.close();
  server.kill();
}
