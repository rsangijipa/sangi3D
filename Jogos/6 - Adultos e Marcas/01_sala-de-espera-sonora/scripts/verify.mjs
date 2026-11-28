import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { access,mkdir,writeFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
import { chromium } from 'playwright';

const port=Number(process.env.SALA_TEST_PORT || 4412);
const base='http://127.0.0.1:'+port;
const smoke=process.argv.includes('--capturar');
const record=process.argv.includes('--video');
const software=process.env.SALA_SOFTWARE==='1';
const server=spawn(process.execPath,['scripts/serve.mjs'],{windowsHide:true,env:{...process.env,SALA_PORT:String(port)}});
const chrome='C:/Program Files/Google/Chrome/Application/chrome.exe';
const executablePath=process.env.SALA_CHROME||await access(chrome).then(()=>chrome,()=>undefined);
let browser;
const stats=[];
const out='capturas';
const settle=page=>page.waitForTimeout(300);
const runState=page=>page.evaluate(()=>window.salaQA.state());
const button=(page,name)=>page.getByRole('button',{name,exact:true});
try{
  for(let attempts=0;attempts<50;attempts++){
    if(await fetch(base).then(r=>r.ok,()=>false))break;
    await new Promise(r=>setTimeout(r,160));
  }
  await mkdir(out,{recursive:true});
  browser=await chromium.launch({headless:true,executablePath,args:software?
    ['--enable-unsafe-swiftshader','--use-angle=swiftshader']:['--use-angle=d3d11','--enable-gpu']});
  if(record){
    const page=await browser.newPage({viewport:{width:1280,height:720}});
    await page.goto(base+'/?diagnostico=1');
    await page.waitForFunction(()=>window.salaQA);
    await button(page,'Chuva').click();
    await page.waitForFunction(()=>window.salaQA.state().audio.state==='running');
    await page.evaluate(()=>{
      const video=document.querySelector('canvas').captureStream(24);
      const sound=window.salaQA.demoTrack();
      if(sound)video.addTrack(sound);
      const mimeType='video/webm;codecs=vp8,opus';
      const recorder=new MediaRecorder(video,{mimeType,videoBitsPerSecond:4400000,audioBitsPerSecond:96000});
      const parts=[];
      recorder.ondataavailable=event=>{if(event.data.size)parts.push(event.data);};
      window.take={recorder,video,parts,mimeType};
      recorder.start(300);
    });
    await page.waitForTimeout(1000);
    await button(page,'Lareira').click();
    await page.waitForTimeout(1000);
    await button(page,'Vitrola').click();
    await page.waitForTimeout(3600);
    await button(page,'Respirar 1 minuto').click();
    await page.waitForTimeout(6850);
    const media=await page.evaluate(()=>new Promise(resolve=>{
      const {recorder,video,parts,mimeType}=window.take;
      recorder.onstop=()=>{
        video.getTracks().forEach(track=>track.stop());
        const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.readAsDataURL(new Blob(parts,{type:mimeType}));
      };
      recorder.stop();
    }));
    await mkdir('demonstracao/media',{recursive:true});
    const bytes=Buffer.from(media.split(';base64,')[1],'base64');
    assert(bytes.length>12000&&bytes.subarray(0,4).toString('hex')==='1a45dfa3','Captura WebM válida');
    await writeFile('demonstracao/media/sala.webm',bytes);
    await page.close();
    console.log('Vídeo da cena gravado com a mixagem do ambiente.');
  }else if(smoke){
    const page=await browser.newPage({viewport:{width:1440,height:810}});
    page.on('pageerror',error=>console.error(error.message));
    page.on('console',msg=>{if(msg.type()==='error')console.error(msg.text().slice(0,2500));});
    await page.goto(base+'/?diagnostico=1');
    await page.waitForFunction(()=>window.salaQA||window.salaBootError);
    const error=await page.evaluate(()=>window.salaBootError?.split('\n').slice(0,2).map(x=>x.split('data:')[0]).join('\n'));
    assert(!error,error);
    await settle(page);
    await page.screenshot({path:out+'/desktop-inicial.png'});
    const img=await page.evaluate(()=>window.salaQA.photo());
    assert(img.startsWith('data:image/webp;'));
    await mkdir('assets',{recursive:true});
    await writeFile('assets/sala-2d.webp',Buffer.from(img.split(',')[1],'base64'));
    console.log(await page.evaluate(()=>({stats:window.salaQA.stats(),points:Object.keys(window.SCENE_MANIFEST).map(k=>{
      const p=window.salaQA.point(k);
      return [k,p,p&&window.salaQA.hit(...p),p&&document.elementFromPoint(...p)?.tagName];
    })})));
    for(const name of ['Chuva','Lareira','Vitrola'])await button(page,name).click();
    await button(page,'Respirar 1 minuto').click();
    await page.waitForTimeout(1250);
    await page.screenshot({path:out+'/desktop-interacao.png'});
    await page.close();
    const mobile=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
    await mobile.goto(base+'/?diagnostico=1');
    await mobile.waitForFunction(()=>window.salaQA||window.salaBootError);
    assert(await mobile.evaluate(()=>!!window.salaQA));
    await settle(mobile);
    await mobile.screenshot({path:out+'/celular.png'});
    process.exitCode=0;
  }else{
    for(const [width,height] of [[1440,810],[1280,720],[390,844],[360,640],[844,390]]){
      const phone=height>width && width<=480;
      const page=await browser.newPage({viewport:{width,height},isMobile:phone,hasTouch:phone,reducedMotion:'reduce'});
      const errors=[],requests=[];
      page.on('pageerror',error=>errors.push(error.message.slice(0,300)));
      page.on('console',msg=>{if(msg.type()==='error')errors.push(msg.text().slice(0,300));});
      page.on('request',request=>{if(request.url().startsWith('http')&&!request.url().startsWith(base))requests.push(request.url());});
      page.on('response',response=>{if(response.status()>=400)errors.push('HTTP '+response.status()+' '+response.url());});
      await page.goto(base+'/?diagnostico=1');
      await page.waitForFunction(()=>window.salaQA||window.salaBootError);
      const error=await page.evaluate(()=>window.salaBootError?.split('\n')[0]);
      assert(!error,error);
      await settle(page);
      assert.equal((await runState(page)).audio.state,'unstarted');
      for(const name of ['Chuva','Lareira','Vitrola','Relógio','Plantas']){
        const element=button(page,name);
        const box=await element.boundingBox();
        assert(box&&box.height>=48&&box.width>=48);
        if(phone)await element.tap();else await element.click();
        assert.equal(await element.getAttribute('aria-pressed'),'true');
      }
      await page.waitForFunction(()=>window.salaQA.state().audio.state==='running');
      assert.equal((await runState(page)).audio.ceilingDb,-24);
      const period=width===1280||phone&&width===390?await page.evaluate(()=>window.salaQA.measure(10)):null;
      stats.push({profile:width+'x'+height,...await page.evaluate(()=>window.salaQA.stats()),measureMs:period});
      await button(page,'Respirar 1 minuto').click();
      await page.waitForFunction(()=>document.querySelector('#breath-instruction').textContent==='Inspire enquanto a luz cresce');
      await page.evaluate(()=>window.salaQA.seekBreath(5.5));
      await page.waitForFunction(()=>document.querySelector('#breath-instruction').textContent==='Solte o ar enquanto a luz baixa');
      if(width===1280){
        await page.evaluate(()=>window.salaQA.seekBreath(60));
        await page.getByText('4 · Siga quando quiser',{exact:true}).waitFor();
      }else await button(page,'Encerrar').click();
      await button(page,'Silenciar').click();
      assert.equal((await runState(page)).sound,false);
      await page.keyboard.press('2');
      assert.equal(await button(page,'Lareira').getAttribute('aria-pressed'),'false');
      await button(page,'Volumes').click();
      const slider=page.locator('#volume-chuva');
      await slider.focus();
      await page.keyboard.press('Home');
      assert.equal((await runState(page)).mix.chuva.volume,0);
      await page.keyboard.press('End');
      assert.equal((await runState(page)).mix.chuva.volume,1);
      await page.getByRole('button',{name:'Fechar volumes'}).click();
      await page.keyboard.press('h');
      await button(page,'Mostrar controles').waitFor();
      await page.keyboard.press('h');
      await button(page,'Ajustes').click();
      if(width===1280){
        await page.getByLabel('Qualidade gráfica').selectOption('alta');
        assert.equal(await page.evaluate(()=>window.salaQA.stats().level),'alta');
        await settle(page);
        stats.push({profile:'1280x720 alta',...await page.evaluate(()=>window.salaQA.stats()),measureMs:await page.evaluate(()=>window.salaQA.measure(10))});
      }
      await page.getByLabel('Qualidade gráfica').selectOption('leve');
      assert.equal(await page.evaluate(()=>window.salaQA.stats().level),'leve');
      if(width===390)stats.push({profile:'390x844 leve',...await page.evaluate(()=>window.salaQA.stats()),measureMs:await page.evaluate(()=>window.salaQA.measure(10))});
      const old=await page.evaluate(()=>window.salaQA.colors());
      await page.getByLabel('Marca de demonstração').selectOption('neutra');
      assert.notDeepEqual(old,await page.evaluate(()=>window.salaQA.colors()));
      assert.equal(await page.getByRole('heading',{level:1}).textContent(),'Uma pausa\nantes de seguir.');
      await button(page,'Fechar').click();
      if(phone){
        await button(page,'Menu').click();
        await page.getByRole('link',{name:'Sobre',exact:true}).click();
        await page.getByRole('heading',{name:'Sobre esta experiência'}).waitFor();
        await button(page,'Fechar').click();
      }
      assert.deepEqual(requests,[],width+'×'+height);
      assert.deepEqual(errors,[],width+'×'+height);
      await page.close();
      console.log('OK',width+'×'+height);
    }
    const page=await browser.newPage({viewport:{width:1440,height:810},reducedMotion:'reduce'});
    await page.goto(base+'/?diagnostico=1');
    await page.waitForFunction(()=>window.salaQA);
    for(const id of ['chuva','lareira','vitrola','relogio','plantas','cortina','luminaria']){
      const p=await page.evaluate(id=>{
        const origin=window.salaQA.point(id);
        const ring=[0,5,-5,15,-15,25,-25,38,-38,55,-55,75,-75];
        for(const y of ring)for(const x of ring){
          const at=[origin[0]+x,origin[1]+y];
          if(window.salaQA.hit(...at)===id&&document.elementFromPoint(...at)?.tagName==='CANVAS')return at;
        }
        return null;
      },id);
      assert(p,'Alvo 3D acessível: '+id);
      if(id==='cortina'){
        const old=(await runState(page)).curtain;
        await page.mouse.move(...p);await page.mouse.down();await page.mouse.move(p[0]+28,p[1]-56,{steps:8});await page.mouse.up();
        assert((await runState(page)).curtain>old);
      }else{
        await page.mouse.click(...p);
        if(id==='luminaria'){
          await page.waitForFunction(()=>document.querySelector('#breath-instruction').textContent==='Inspire enquanto a luz cresce');
          await button(page,'Encerrar').click();
        }else{
          const old=(await runState(page)).mix[id].volume;
          assert.equal((await runState(page)).mix[id].active,true,id);
          await page.mouse.move(...p);await page.mouse.down();await page.mouse.move(p[0],p[1]-28,{steps:7});await page.mouse.up();
          assert((await runState(page)).mix[id].volume>old,id+' volume');
        }
      }
    }
    await page.evaluate(()=>document.querySelector('canvas').getContext('webgl2').getExtension('WEBGL_lose_context').loseContext());
    await page.locator('#still').waitFor({state:'visible'});
    await page.waitForFunction(()=>document.querySelector('#still').naturalWidth>0);
    await button(page,'Chuva').click();
    assert.equal(await button(page,'Chuva').getAttribute('aria-pressed'),'false');
    await button(page,'Preciso de ajuda agora').click();
    await page.getByRole('link',{name:'SAMU · 192'}).waitFor();
    await button(page,'Fechar').click();
    await page.close();

    const embed=await browser.newPage();
    await embed.addInitScript(()=>window.events=[],{});
    await embed.goto(base+'/teste-iframe');
    await embed.evaluate(()=>window.addEventListener('message',event=>{
      if(event.origin===location.origin&&event.source===document.querySelector('iframe').contentWindow)window.events.push(event.data);
    }));
    const frame=embed.frameLocator('iframe');
    assert.equal(await frame.locator('.navigation').isVisible(),false);
    await frame.getByRole('link',{name:'Agendar conversa',exact:true}).click();
    await frame.getByRole('heading',{name:'Contato',exact:true}).waitFor();
    await embed.waitForFunction(()=>window.events.some(event=>event.tipo==='cta'));
    await embed.close();

    const offline=await browser.newPage({viewport:{width:1050,height:590}});
    await offline.context().setOffline(true);
    await offline.goto(pathToFileURL(resolve('sala-de-espera-sonora.html')).href+'?diagnostico=1');
    await offline.waitForFunction(()=>window.salaQA||window.salaBootError);
    assert(await offline.evaluate(()=>!!window.salaQA),'Executável por file:// sem rede');
    await button(offline,'Chuva').click();
    assert.equal(await button(offline,'Chuva').getAttribute('aria-pressed'),'true');
    await offline.close();
    await writeFile(out+'/medicoes.json',JSON.stringify(stats,null,2)+'\n');
    console.log('OK', 'gestos, respiração, via arquivo offline, fallback e iframe');
  }
}finally{await browser?.close();server.kill();}

