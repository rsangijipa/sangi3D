import { chromium } from 'file:///C:/Users/aless/Downloads/Sitefiguraviva/node_modules/playwright-core/index.mjs';
import { spawn } from 'node:child_process';
import assert from 'node:assert/strict';
const server=spawn(process.execPath,['launcher/server.mjs','--port','5297','--no-prebuild']);
let browser;
try {
  const base='http://127.0.0.1:5297';
  for(let i=0;i<50;i++){
    if(await fetch(base).then(r=>r.ok,()=>false)) break;
    await new Promise(r=>setTimeout(r,100));
  }
  browser=await chromium.launch({channel:'chrome',args:['--enable-unsafe-swiftshader']});
  for(const [name,slug] of [['studio','14-estudio-dos-limites'],['theater','16-teatro-das-historias-possiveis']]){
    for(const viewport of [{width:1280,height:800},{width:390,height:844}]){
      const mobile=viewport.width===390;
      const page=await browser.newPage({viewport,deviceScaleFactor:mobile?2:1,hasTouch:mobile,isMobile:mobile});
      const errors=[];
      page.on('pageerror',e=>errors.push(e.message));
      page.on('response',r=>{if(r.status()>=400&&!r.url().endsWith('/favicon.ico'))errors.push(r.status()+' '+r.url())});
      await page.goto(base+'/Kit_17_jogos_3D_mockups_e_prompts/'+slug+'/index.html');
      await page.locator('canvas').waitFor();
      await page.waitForTimeout(800);
      await page.screenshot({path:process.argv[2]+'/'+name+'-'+viewport.width+'.jpg',type:'jpeg',quality:82});
      console.log(name,viewport.width,await page.locator('canvas').evaluate(c=>[c.width,c.height,c.clientWidth,c.clientHeight]));
      if(name==='studio'){
        await page.locator('#farther').click();
        assert.equal(await page.locator('#distance-text').textContent(),'4 de 5');
        await page.locator('[data-tone=firme]').click();
        await page.locator('#phrasing-options summary').click();
        await page.locator('[data-choice="2"]').click();
        await page.locator('#custom').fill('Preciso de um intervalo curto.');
        await page.locator('#rehearse').click();
        assert.equal(await page.locator('#caption').textContent(),'Preciso de um intervalo curto.');
        await page.keyboard.press('Escape');
        assert.ok(await page.locator('#rehearse').isDisabled());
        await page.locator('#curtain').click();
        assert.ok(await page.locator('#rehearse').isEnabled());
      } else {
        const drawer=page.locator('details').first();
        await drawer.locator('summary').click();
        await page.locator('#backdrop').selectOption('coast');
        await page.locator('[data-actor=bear]').click();
        await page.locator('#toggle-actor').click();
        await page.locator('#record').click();
        await page.locator('[data-action=cumprimentar]').click();
        await page.locator('[data-action=caminho]').click();
        await page.locator('#record').click();
        assert.match(await page.locator('#status').textContent(),/2 mudanças/);
        await page.locator('#timeline img[src]').waitFor();
        await page.locator('#play').click();
        await page.locator('#play').click();
        assert.equal(await page.locator('#play').innerText(),'Continuar');
        await page.locator('#play').click();
        await page.getByText('A peça terminou.',{exact:false}).waitFor({timeout:22000});
        await page.locator('#cut-tools summary').click();
        const event=page.waitForEvent('download');
        await page.locator('#export').click();
        const download=await event;
        const stream=await download.createReadStream();
        let body='';
        for await(const chunk of stream) body+=chunk;
        const data=JSON.parse(body);
        assert.equal(data.scenes[0].events[1].values.pose,'caminho');
        assert.equal(data.scenes[0].initial.backdrop,'coast');
      }
      assert.deepEqual(errors,[]);
      console.log('PASS',name,viewport.width);
      await page.close();
    }
  }
} finally { await browser?.close(); server.kill(); }