import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { access, mkdir, writeFile } from 'node:fs/promises';
import { chromium } from 'playwright';

const port = Number(process.env.BUSSOLA_TEST_PORT ?? 4391);
const base = `http://127.0.0.1:${port}`;
const server = spawn(process.execPath,['node_modules/vite/bin/vite.js','preview','--host','127.0.0.1','--port',String(port),'--strictPort'],{windowsHide:true});
const localChrome = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const executablePath = process.env.BUSSOLA_CHROME || await access(localChrome).then(()=>localChrome,()=>undefined);
let browser;
const sizes = (process.env.BUSSOLA_VIEWPORT ? [process.env.BUSSOLA_VIEWPORT.split('x').map(Number)] :
  [[1280,720],[1920,1080],[390,844],[360,640],[430,932],[768,1024],[844,390]]);
const metrics = [];
try {
  for (let i=0;i<50;i++) {
    if (await fetch(base).then(r=>r.ok,()=>false)) break;
    await new Promise(resolve=>setTimeout(resolve,200));
  }
  await mkdir('capturas',{recursive:true});
  browser = await chromium.launch({
    executablePath, headless:true,
    args:process.env.BUSSOLA_HARDWARE==='1' ? ['--use-angle=d3d11','--enable-gpu'] : ['--enable-unsafe-swiftshader','--use-angle=swiftshader'],
  });
  for (const [width,height] of sizes) {
    const profile=`${width}x${height}${process.env.BUSSOLA_QUALITY ? '-'+process.env.BUSSOLA_QUALITY : ''}`;
    const mobile=width<500 && height>width;
    const page=await browser.newPage({viewport:{width,height},reducedMotion:'reduce',isMobile:mobile,hasTouch:mobile});
    page.setDefaultTimeout(30000);
    const errors=[];
    page.on('pageerror',err=>errors.push(err.message));
    page.on('console',msg=>{ if(msg.type()==='error') errors.push(msg.text()); });
    page.on('response',response=>{ if(response.status()>=400)errors.push(`HTTP ${response.status()} ${response.url()}`); });
    if (process.env.BUSSOLA_QUALITY) await page.addInitScript(level=>{
      localStorage.setItem('bussola-do-corpo:preferencias:v1',JSON.stringify({version:1,quality:level}));
    },process.env.BUSSOLA_QUALITY);
    await page.goto(base+'/?diagnostico=1');
    await page.waitForFunction(()=>!!window.bussolaMetrics);
    await page.locator('#loading').waitFor({state:'hidden'});
    await page.waitForFunction(()=>window.bussolaMetrics().calls>0);
    await page.screenshot({path:`capturas/${profile}-entrada.png`});
    const btn=name=>page.getByRole('button',{name,exact:true});
    if (mobile) await btn('Ver exemplo').tap();
    else await btn('Ver exemplo').click();
    await page.getByRole('heading',{name:'Que sensação?'}).waitFor();
    await page.locator('#orbit [data-id=waves][aria-pressed=true]').waitFor();
    await page.waitForTimeout(300);
    await page.screenshot({path:`capturas/${profile}-sensacao.png`});
    const stats=await page.evaluate(()=>window.bussolaMetrics());
    const averageMs=(width===1280 || width===390) ? await page.evaluate(native=>window.bussolaMeasure(8,native),process.env.BUSSOLA_HARDWARE==='1') : null;
    metrics.push({profile,...stats,averageMs});
    const geometry=await page.locator('.token').evaluateAll(items=>items.map(item=>{
      const b=item.getBoundingClientRect();
      const panel=document.querySelector('#panel').getBoundingClientRect();
      return [b.left,b.top,b.right,b.bottom,b.width,b.height,b.right>panel.left&&b.left<panel.right&&b.bottom>panel.top&&b.top<panel.bottom];
    }));
    assert(geometry.every(([l,t,r,b,w,h,covered])=>l>=-.5&&t>=-.5&&r<=width+.5&&b<=height+.5&&w>=44&&h>=44&&!covered),`posição dos oito alvos em ${profile} ${JSON.stringify(geometry)}`);
    if (height > width && width <= 849) {
      const unobstructed = await page.evaluate(() => {
        const targets = ['#panel [data-action="next"]','#panel [data-action="skip"]','#orbit [data-id="energy"]'];
        return targets.every(selector => {
          const item = document.querySelector(selector);
          const box = item.getBoundingClientRect();
          return item.contains(document.elementFromPoint(box.x+box.width/2,box.y+box.height/2));
        });
      });
      assert(unobstructed, `controles principais visíveis em ${profile}`);
    }
    await btn('Usar minha palavra').click();
    await page.getByLabel('Minha palavra',{exact:true}).fill('<teste>');
    await btn('Registrar').click();
    await btn('0').click();
    await btn('Rever mapa').click();
    await page.getByText('<teste>',{exact:false}).waitFor();
    await btn('Concluir sem salvar').click();
    await page.getByRole('heading',{name:'Mapa encerrado'}).waitFor();
    assert.equal(await page.evaluate(()=>localStorage.getItem('bussola-do-corpo:registro:v1')),null);
    await page.screenshot({path:`capturas/${profile}-fim.png`});
    assert.deepEqual(errors,[],profile);
    await page.close();
    console.log(`OK ${profile}`);
  }

  if (process.env.BUSSOLA_VIEWPORT) {
    await writeFile(`capturas/medicoes-${process.env.BUSSOLA_QUALITY ?? 'auto'}-${process.env.BUSSOLA_VIEWPORT}.json`,JSON.stringify(metrics,null,2)+'\n');
    console.log(JSON.stringify(metrics,null,2));
  } else {
  const page=await browser.newPage({viewport:{width:1280,height:720},reducedMotion:'reduce'});
  page.setDefaultTimeout(30000);
  await page.goto(base+'/?diagnostico=1');
  await page.waitForFunction(()=>!!window.bussolaMetrics);
  const btn=name=>page.getByRole('button',{name,exact:true});
  await btn('Guiado').click();
  await btn('Observar meu corpo').click();
  const point=await page.locator('#orbit').evaluate(el=>{
    const s=el.style;
    const x=parseFloat(s.getPropertyValue('--orbit-x'));
    const y=parseFloat(s.getPropertyValue('--orbit-y'));
    const r=parseFloat(s.getPropertyValue('--orbit-radius'));
    return [x+r*.324,y-r*.100];
  });
  await page.mouse.click(...point);
  await page.getByText('Antebraço esquerdo · selecionado',{exact:true}).waitFor();
  await page.screenshot({path:'capturas/1280x720-toque.png'});
  await page.locator('#panel [data-action=flip]').click();
  await page.getByText('Vista de costas',{exact:true}).waitFor();
  await page.waitForTimeout(250);
  await page.screenshot({path:'capturas/1280x720-costas.png'});
  await btn('Lista de regiões').click();
  await btn('Costas').click();
  await btn('Continuar').click();
  const heat=page.locator('#orbit [data-id=heat]');
  await heat.focus();
  await page.keyboard.press('ArrowRight');
  assert.equal(await page.evaluate(()=>document.activeElement.dataset.id),'lightness');
  await page.keyboard.press('Enter');
  await page.keyboard.press('Escape');
  await page.getByRole('heading',{name:'Sessão em pausa'}).waitFor();
  await btn('Retomar').click();
  await page.keyboard.press('h');
  await btn('Mostrar controles').waitFor();
  await page.keyboard.press('h');
  await btn('Ligar som').click();
  await btn('Desligar som').click();
  await btn('Pular').click();
  await btn('Pular etapa').click();
  await btn('Adicionar outro ponto').click();
  await btn('Não sei onde').click();
  await btn('Continuar').click();
  await page.locator('#orbit [data-id=cold]').click();
  await btn('Registrar').click();
  await btn('Não sei').click();
  await btn('Rever mapa').click();
  await btn('Editar ponto 1').click();
  await btn('Continuar').click();
  await page.locator('#orbit [data-id=waves]').click();
  await btn('Registrar').click();
  await btn('4').click();
  await btn('Rever mapa').click();
  await page.getByText('Intensidade 4 de 4').waitFor();
  await btn('Registrar neste dispositivo').click();
  await btn('Registrar mapa').click();
  const record=await page.evaluate(()=>JSON.parse(localStorage.getItem('bussola-do-corpo:registro:v1')));
  assert.equal(record.entries.length,2);
  assert.deepEqual(record.entries[0].regionIds,['foreL','back']);
  assert.deepEqual(record.entries[0].sensationIds,['waves']);
  await page.reload();
  await page.waitForFunction(()=>!!window.bussolaMetrics);
  await btn('Abrir registro deste dispositivo').click();
  await btn('Apagar mapa').click();
  await page.getByRole('dialog').getByRole('button',{name:'Apagar mapa',exact:true}).click();
  assert.equal(await page.evaluate(()=>localStorage.getItem('bussola-do-corpo:registro:v1')),null);
  await page.evaluate(()=>document.querySelector('canvas').getContext('webgl2').getExtension('WEBGL_lose_context').loseContext());
  await page.getByText(/O 3D foi interrompido/).waitFor();
  await btn('Adicionar ponto').click();
  await btn('Cabeça').click();
  await btn('Sair').click();
  await btn('Sair sem salvar').click();
  await page.getByText(/O rascunho foi apagado/).waitFor();
  await page.close();
  const mobilePage=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true,reducedMotion:'reduce'});
  await mobilePage.goto(base+'/?diagnostico=1');
  await mobilePage.waitForFunction(()=>!!window.bussolaMetrics);
  await mobilePage.getByRole('button',{name:'Usar mapa fictício'}).tap();
  const touch=await mobilePage.locator('#orbit').evaluate(el=>{
    const r=parseFloat(el.style.getPropertyValue('--orbit-radius'));
    return [parseFloat(el.style.getPropertyValue('--orbit-x'))+r*.324,parseFloat(el.style.getPropertyValue('--orbit-y'))-r*.10];
  });
  await mobilePage.touchscreen.tap(...touch);
  await mobilePage.getByText('Antebraço esquerdo · selecionado',{exact:true}).waitFor();
  await mobilePage.close();
  const bridge=await browser.newPage({viewport:{width:1280,height:720}});
  await bridge.goto(base+'/launcher.html');
  await bridge.evaluate(()=>{
    window.gameEvents=[];
    const frame=document.createElement('iframe');
    frame.id='integration';
    frame.title='Jogo integrado';
    frame.style.cssText='width:100%; height:440px';
    frame.src='./?embed=1&acessivel=1';
    window.addEventListener('message',event=>{
      if (event.origin===location.origin && event.source===frame.contentWindow) window.gameEvents.push(event.data);
    });
    document.body.append(frame);
  });
  await bridge.waitForFunction(()=>window.gameEvents.some(event=>event.event==='ready'&&event.version===1));
  const game=bridge.frameLocator('#integration');
  await game.getByRole('button',{name:'Pular',exact:true}).click();
  await bridge.evaluate(()=>document.querySelector('#integration').contentWindow.postMessage(
    {source:'ambientes',version:1,event:'pause'},location.origin));
  await game.locator('#panel[inert]').waitFor();
  await bridge.evaluate(()=>document.querySelector('#integration').contentWindow.postMessage(
    {source:'ambientes',version:1,event:'resume'},location.origin));
  await game.locator('#panel:not([inert])').waitFor();
  await game.getByRole('button',{name:'Concluir sem salvar'}).click();
  await bridge.waitForFunction(()=>window.gameEvents.some(event=>event.event==='summary'&&event.summary.points===0));
  await bridge.close();
  if (process.env.BUSSOLA_DETAIL==='1') {
    const details=await browser.newPage({viewport:{width:1280,height:720},reducedMotion:'reduce'});
    await details.goto(base+'/?diagnostico=1');
    await details.waitForFunction(()=>!!window.bussolaInspect);
    await details.getByRole('button',{name:'Ajustes',exact:true}).click();
    for (const preset of ['lunar','lampadas','noite']) {
      await details.getByLabel('Luz do observatório').selectOption(preset);
      await details.getByRole('button',{name:'Voltar ao mapa'}).click();
      await details.keyboard.press('h');
      await details.waitForTimeout(200);
      await details.screenshot({path:`capturas/luz-${preset}.png`});
      await details.keyboard.press('h');
      if (preset!=='noite') await details.getByRole('button',{name:'Ajustes',exact:true}).click();
    }
    await details.keyboard.press('h');
    for (const name of ['body_neutral','rug','telescope','moon_lamp','star_lamp','shelf','plant','pouf']) {
      await details.evaluate(name=>window.bussolaInspect(name),name);
      await details.screenshot({path:`capturas/detalhe-${name}.png`});
    }
    await details.close();
  }
  await writeFile('capturas/medicoes.json',JSON.stringify(metrics,null,2)+'\n');
  console.log('OK toque 3D, costas, teclado, pausa, som, revisão, edição, armazenamento e perda de contexto');
  }
} finally {
  await browser?.close();
  server.kill();
}
