import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { access,mkdir,writeFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
import { chromium } from 'playwright';
const port=Number(process.env.PINBALL_TEST_PORT||4422),base='http://127.0.0.1:'+port;
const server=spawn(process.execPath,['scripts/serve.mjs'],{windowsHide:true,env:{...process.env,PINBALL_PORT:String(port)}});
const chrome='C:/Program Files/Google/Chrome/Application/chrome.exe';
const output='capturas';
const button=(page,name)=>page.getByRole('button',{name,exact:true});
const open=async(page,url=base+'/?diagnostico=1')=>{
  await page.goto(url);
  await page.waitForFunction(()=>window.pinQA||window.pinballError);
  const fail=await page.evaluate(()=>window.pinballError||window.pinballStageError);
  assert(!fail,fail);
};
const wait=page=>page.waitForTimeout(250);
const physicalLaunch=async(page,key='Space',duration=470)=>{
  await page.keyboard.down(key);await page.waitForTimeout(duration);await page.keyboard.up(key);
};
const place=(page,...args)=>page.evaluate(values=>window.pinQA.place(...values),args);
const drain=async page=>{await place(page,0,2.26,0,4);await page.waitForTimeout(740);};
const state=page=>page.evaluate(()=>window.pinQA.state());
let browser;
try{
  for(let i=0;i<50;i++){
    if(await fetch(base).then(r=>r.ok,()=>false))break;
    await new Promise(r=>setTimeout(r,170));
  }
  await mkdir(output,{recursive:true});
  const executablePath=process.env.PINBALL_CHROME||await access(chrome).then(()=>chrome,()=>undefined);
  const software=process.env.PINBALL_SOFTWARE==='1';
  browser=await chromium.launch({headless:true,executablePath,args:software?['--enable-unsafe-swiftshader','--use-angle=swiftshader']:['--use-angle=d3d11','--enable-gpu']});
  if(process.argv.includes('--capturar')){
    const page=await browser.newPage({viewport:{width:1440,height:810}});
    await open(page);await wait(page);
    console.log(await page.evaluate(()=>({stats:window.pinQA.stats(),position:window.pinQA.point(),under:document.elementFromPoint(...window.pinQA.point())?.outerHTML.slice(0,120)})));
    assert(!await page.evaluate(()=>window.pinQA.mode()),'Captura da mesa 3D');
    await page.screenshot({path:output+'/desktop-inicial.png'});
    const img=await page.evaluate(()=>window.pinQA.photo());
    assert(img.startsWith('data:image/webp;'));
    await mkdir('assets',{recursive:true});await writeFile('assets/mesa-2d.webp',Buffer.from(img.split(',')[1],'base64'));
    await physicalLaunch(page);await drain(page);
    await place(page,-.49,-.63,0,-5.6);
    await page.waitForFunction(()=>window.pinQA.state().score>0);
    await page.keyboard.down('ArrowRight');await page.waitForTimeout(85);
    await page.screenshot({path:output+'/desktop-interacao.png'});await page.keyboard.up('ArrowRight');await page.close();
    const mobile=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
    await open(mobile);await wait(mobile);await mobile.screenshot({path:output+'/celular.png'});
    await mobile.close();
  }else if(process.argv.includes('--video')){
    const page=await browser.newPage({viewport:{width:1280,height:720}});
    await open(page);await button(page,'Ligar som').click();await wait(page);
    await page.evaluate(()=>{
      const stream=window.pinQA.canvas().captureStream(24), audio=window.pinQA.track();if(audio)stream.addTrack(audio);
      const mimeType='video/webm;codecs=vp8,opus';
      const recorder=new MediaRecorder(stream,{mimeType,videoBitsPerSecond:4200000,audioBitsPerSecond:96000});
      const chunks=[];recorder.ondataavailable=e=>{if(e.data.size)chunks.push(e.data);};
      window.take={stream,recorder,chunks,mimeType};recorder.start(300);
    });
    await page.waitForTimeout(450);await physicalLaunch(page,'Space',600);
    await page.waitForTimeout(1400);
    await page.keyboard.down('ArrowLeft');await page.waitForTimeout(460);await page.keyboard.up('ArrowLeft');
    await place(page,-.49,-.63,0,-4.1);
    await page.waitForTimeout(1750);await place(page,-.83,.045,0,-3.0);
    await page.waitForTimeout(2850);await place(page,.34,1.99,-1.3,-2);
    await page.keyboard.down('ArrowRight');await page.waitForTimeout(200);await page.keyboard.up('ArrowRight');
    await page.waitForTimeout(4550);
    const media=await page.evaluate(()=>new Promise(resolve=>{
      const {stream,recorder,chunks,mimeType}=window.take;
      recorder.onstop=()=>{
        stream.getTracks().forEach(track=>track.stop());
        const reader=new FileReader();
        reader.onload=()=>resolve(reader.result);reader.readAsDataURL(new Blob(chunks,{type:mimeType}));
      };
      recorder.stop();
    }));
    const bytes=Buffer.from(media.split(';base64,')[1],'base64');
    assert(bytes.length>12000&&bytes.subarray(0,4).toString('hex')==='1a45dfa3');
    await mkdir('demonstracao/media',{recursive:true});await writeFile('demonstracao/media/mesa.webm',bytes);
    console.log('Captura do jogo com a trilha de efeitos:',bytes.length);
  }else{
    const metrics=[];
    for(const [width,height] of [[1440,810],[1280,720],[390,844],[360,640],[844,390]]){
      const phone=width<500&&height>width;
      const page=await browser.newPage({viewport:{width,height},isMobile:phone,hasTouch:phone,reducedMotion:'reduce'});
      const errors=[],external=[];
      page.on('pageerror',e=>errors.push(e.message.slice(0,400)));
      page.on('console',m=>{if(m.type()==='error')errors.push(m.text().slice(0,400));});
      page.on('request',r=>{if(r.url().startsWith('http')&&!r.url().startsWith(base))external.push(r.url());});
      await open(page);
      assert(!await page.evaluate(()=>window.pinQA.mode()));
      const profile=width+'x'+height;
      await wait(page);const stats=await page.evaluate(()=>window.pinQA.stats());
      metrics.push({profile,...stats,syncMs:width===1280||width===390?await page.evaluate(()=>window.pinQA.measure(8)):null});
      assert(stats.calls<150);
      for(const label of ['Flipper esquerdo','Lançar','Modo relax','Ligar som','Flipper direito']){
        const rect=await button(page,label).boundingBox();
        assert(rect&&rect.width>=48&&rect.height>=48,profile+' '+label);
        assert(rect.x>=0&&rect.x+rect.width<=width+.5&&rect.y+rect.height<=height+.5);
      }
      if(phone)await button(page,'Lançar').tap();else await physicalLaunch(page);
      assert.equal((await state(page)).phase,'jogando');
      await page.keyboard.down('ArrowLeft');assert.equal((await state(page)).pressed[0],true);
      await page.keyboard.up('ArrowLeft');assert.equal((await state(page)).pressed[0],false);
      await page.keyboard.down('ArrowRight');assert.equal((await state(page)).pressed[1],true);
      await page.keyboard.up('ArrowRight');assert.equal((await state(page)).pressed[1],false);
      if(phone)await button(page,'Flipper esquerdo').tap();
      if(width===390){
        const touch=await page.context().newCDPSession(page);
        await touch.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[
          {x:width*.21,y:height*.55,id:1},{x:width*.79,y:height*.55,id:2},
        ]});
        assert.deepEqual((await state(page)).pressed,[true,true]);
        await touch.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
        assert.deepEqual((await state(page)).pressed,[false,false]);
        await touch.detach();
      }
      await button(page,'Modo relax').click();assert.equal((await state(page)).relax,true);
      await button(page,'Ligar som').click();await button(page,'Silenciar').click();
      await page.keyboard.press('h');await button(page,'Mostrar controles').waitFor();
      await page.keyboard.press('h');
      await button(page,'Ajustes').click();
      if(width===1280){
        await page.getByLabel('Qualidade gráfica').selectOption('alta');
        await wait(page);metrics.push({profile:profile+' alta',...await page.evaluate(()=>window.pinQA.stats()),syncMs:await page.evaluate(()=>window.pinQA.measure(8))});
      }
      await page.getByLabel('Qualidade gráfica').selectOption('leve');
      if(width===390){
        await wait(page);metrics.push({profile:profile+' leve',...await page.evaluate(()=>window.pinQA.stats()),syncMs:await page.evaluate(()=>window.pinQA.measure(8))});
      }
      const previousColors=await page.evaluate(()=>window.pinQA.colors());
      await page.getByLabel('Marca',{exact:true}).selectOption('neutra');
      await page.getByRole('heading',{level:1,name:'Dê o primeiro impulso.'}).waitFor();
      assert.equal(await page.evaluate(()=>getComputedStyle(document.documentElement).getPropertyValue('--primary')),'#266f64');
      await page.waitForFunction(old=>{
        const colors=window.pinQA.colors();
        return colors&&Object.entries(colors).every(([key,color])=>color!==old[key]);
      },previousColors);
      await button(page,'Fechar').click();
      await wait(page);
      assert.deepEqual(external,[],profile);assert.deepEqual(errors,[],profile);
      console.log('OK',profile);await page.close();
    }
    const game=await browser.newPage({viewport:{width:1440,height:810},reducedMotion:'reduce'});
    await open(game);
    const coordinates=await game.evaluate(()=>{
      const [x,y]=window.pinQA.point();
      const shifts=[0,12,-12,20,-20];
      for(const dy of shifts)for(const dx of shifts)if(document.elementFromPoint(x+dx,y+dy)?.tagName==='CANVAS')return [x+dx,y+dy];
      return null;
    });
    assert(coordinates,'Êmbolo visível no cenário');
    await game.mouse.move(...coordinates);await game.mouse.down();await game.waitForTimeout(430);await game.mouse.up();
    assert.equal((await state(game)).phase,'jogando');
    await game.mouse.move(1100,570);await game.mouse.down();
    assert.equal((await state(game)).pressed[1],true);await game.mouse.up();
    await place(game,-.49,-.63,0,-4.8);await game.waitForFunction(()=>window.pinQA.state().score>=120);
    await drain(game);assert.equal((await state(game)).ball,2);
    await drain(game);assert.equal((await state(game)).ball,3);
    await drain(game);assert.equal((await state(game)).phase,'fim');
    await button(game,'Jogar de novo').click();assert.equal((await state(game)).ball,1);
    await game.evaluate(()=>document.querySelector('#canvas canvas').getContext('webgl2').getExtension('WEBGL_lose_context').loseContext());
    await game.waitForFunction(()=>window.pinQA.mode());
    assert(await game.evaluate(()=>document.querySelector('#fallback-picture').naturalWidth>0));
    await physicalLaunch(game);assert.equal((await state(game)).phase,'jogando');
    await game.close();
    const iframe=await browser.newPage();
    await iframe.addInitScript(()=>window.ctaEvents=[]);
    await iframe.goto(base+'/teste-iframe');
    await iframe.evaluate(()=>window.addEventListener('message',e=>{
      if(e.origin===location.origin&&e.source===document.querySelector('iframe').contentWindow)window.ctaEvents.push(e.data);
    }));
    const frame=iframe.frameLocator('iframe');
    assert(!await frame.locator('.nav').isVisible());
    await frame.getByRole('link',{name:'Pedir agora',exact:true}).click();
    await frame.getByRole('heading',{name:'Contato',exact:true}).waitFor();
    await iframe.waitForFunction(()=>window.ctaEvents.some(o=>o.tipo==='cta'));
    await iframe.close();
    const offline=await browser.newPage({viewport:{width:1000,height:630}});
    await offline.context().setOffline(true);
    await open(offline,pathToFileURL(resolve('pinball-de-madeira.html')).href+'?diagnostico=1');
    await physicalLaunch(offline);assert.equal((await state(offline)).phase,'jogando');
    await offline.close();
    await writeFile(output+'/medicoes.json',JSON.stringify(metrics,null,2)+'\n');
    console.log('OK jogo 3D, round, fallback, iframe e arquivo offline');
  }
}finally{await browser?.close();server.kill();}

