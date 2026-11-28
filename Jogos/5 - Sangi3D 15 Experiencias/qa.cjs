const assert = require('node:assert/strict');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const { chromium } = require('playwright');

const repository = path.resolve(__dirname, '..');
const appPath = '/Jogos/5%20-%20Sangi3D%2015%20Experiencias/';
const mime = { '.js':'text/javascript', '.html':'text/html', '.css':'text/css', '.png':'image/png' };
const server = http.createServer(async (req,res) => {
  try {
    const request = new URL(req.url,'http://localhost');
    let file = path.resolve(repository,'.'+decodeURIComponent(request.pathname));
    if (!file.startsWith(repository+path.sep)) { res.writeHead(404).end(); return; }
    if (request.pathname.endsWith('/')) file = path.join(file,'index.html');
    res.writeHead(200, { 'Content-Type':mime[path.extname(file)] || 'text/plain' });
    res.end(await fs.promises.readFile(file));
  } catch { if(!res.headersSent)res.writeHead(404); res.end(); }
});

const cases = {
  '01-corpo-de-particulas':async p=>{
    await p.evaluate(()=>{navigator.mediaDevices.getUserMedia=()=>Promise.reject(new DOMException('denied','NotAllowedError'));});
    await click(p,'Ativar câmera');await status(p,/controles manuais continuam/);
    await click(p,'Desenhar um oito');await status(p,/oito traçado/);
    await click(p,'Limpar rastros');await status(p,/Rastros removidos/);
  },
  '02-oceano-de-tinta':async p=>{
    await click(p,'Pausar');
    await click(p,'Injetar da esquerda');await click(p,'Avançar um passo');
    await p.waitForFunction(()=>Number(document.querySelector('.readout').textContent.match(/[\d.]+/)[0])>0);
    await click(p,'Retirar barreira');await click(p,'Avançar um passo');
    assert.match(await p.locator('.readout').textContent(),/retirada/);
    await click(p,'Limpar tanque');assert.match(await p.locator('.readout').textContent(),/0\.0/);
    await click(p,'Continuar');
  },
  '03-floresta-bioluminescente':async p=>{
    await click(p,'Observar riacho');
    await holdUntil(p,'w',()=>[...document.querySelectorAll('button')].some(b=>b.textContent==='Registrar Lanterna-rubra'&&!b.disabled));
    await click(p,'Registrar Lanterna-rubra');await status(p,/Registrado/);
    await click(p,'Voltar à clareira');await status(p,/Clareira/);
    await p.reload();await ready(p);
    assert.match(await p.locator('summary').textContent(),/1 de 6/);
  },
  '04-cidade-da-madrugada':async p=>{
    await click(p,'Atravessar na faixa');await status(p,/Aguarde a luz verde/);
    await click(p,'Abrir porta');await status(p,/Porta aberta/);
    await click(p,'Guarda-chuva');await status(p,/Guarda-chuva aberto/);
    await change(p,'Intensidade da chuva',.3);
    await p.waitForFunction(()=>document.querySelector('.readout').textContent.includes('podem atravessar'),undefined,{timeout:30000,polling:220});
    await click(p,'Atravessar na faixa');await status(p,/Travessia concluída/);
    await holdUntil(p,'w',()=>document.querySelector('.readout').textContent==='Café · interior');
    await p.getByLabel('Setor').selectOption('2');
    await p.waitForFunction(()=>document.querySelector('.readout').textContent.includes('Loja de Discos'));
    await click(p,'Trocar disco');await status(p,/Disco selecionado/);
    await p.getByLabel('Setor').selectOption('3');
    await p.waitForFunction(()=>document.querySelector('.readout').textContent.includes('Galeria'));
    await p.getByLabel('Setor').selectOption('4');
    await p.waitForFunction(()=>document.querySelector('.readout').textContent.includes('Estação de Metrô'));
    await p.getByLabel('Setor').selectOption('5');
    await p.waitForFunction(()=>document.querySelector('.readout').textContent.includes('Mirante'));
    await click(p,'Voltar à travessia');await status(p,/Faixa principal/);
  },
  '05-trem-sem-destino':async p=>{
    await p.getByLabel('Rota').selectOption('2');await status(p,/Rota selecionada/);
    await click(p,'Sentar à janela');await status(p,/sentado/);await click(p,'Levantar');
    await p.getByRole('button',{name:'Selecionar xícara',exact:true}).first().click();
    await p.getByRole('button',{name:'Servir chá',exact:true}).first().click();await status(p,/Chá servido/);
    await holdUntil(p,'w',()=>[...document.querySelectorAll('.readout')].some(n=>n.textContent.startsWith('Café')));
  },
  '06-cidade-submersa':async p=>{
    const before=await p.locator('.readout').textContent();
    await click(p,'Descer');
    await p.waitForFunction(previous=>document.querySelector('.readout').textContent!==previous,before);
    await click(p,'Desligar lanterna');await click(p,'Ligar lanterna');
    await holdUntil(p,'w',()=>[...document.querySelectorAll('button')].some(b=>b.textContent==='Examinar Ânfora'&&!b.disabled));
    await click(p,'Examinar Ânfora');await status(p,/Registrado: Ânfora/);
    await click(p,'Retornar à entrada');await status(p,/Entrada do recife/);
  },
  '07-laboratorio-de-ferrofluido':async p=>{
    await p.getByLabel('Padrão').selectOption('1');
    await change(p,'Altura',.35);
    await p.waitForFunction(()=>Number(document.querySelector('.readout').textContent.match(/[\d.]+/)[0])>.2);
    const old=await peak(p);
    await change(p,'Altura',2.6);
    await p.waitForFunction(old=>Number(document.querySelector('.readout').textContent.match(/[\d.]+/)[0])<old-.1,old);
    await click(p,'Salvar preset');await status(p,/salvos/);
  },
  '08-universo-audioreativo':async p=>{
    await p.getByLabel('Fonte integrada').selectOption('1');
    await click(p,'Reproduzir faixa');
    await p.waitForFunction(()=>[...document.querySelectorAll('meter')][0].value>.30);
    await p.getByLabel('Fonte integrada').selectOption('2');
    await p.waitForFunction(()=>{const v=[...document.querySelectorAll('meter')].map(m=>m.value);return v[2]>.3&&v[2]>v[0]+.2;});
    await click(p,'Pausar faixa');
    await p.waitForFunction(()=>[...document.querySelectorAll('meter')].every(m=>m.value<.16));
    await click(p,'Salvar preset');await status(p,/Preset visual salvo/);
  },
  '09-escultor-de-planetas':async p=>{
    await click(p,'Aplicar no centro');
    await p.waitForFunction(()=>document.querySelector('.readout').textContent.includes('1 alteração'));
    await click(p,'Desfazer');await p.waitForFunction(()=>document.querySelector('.readout').textContent.includes('0 alterações'));
    await click(p,'Refazer');await click(p,'Salvar planeta');await status(p,/Mundo salvo/);
    const record=JSON.parse(await p.evaluate(()=>localStorage.getItem('sangi3d:15:09:v1')));
    assert.equal(record.strokes.length,1);
    await p.reload();await ready(p);
    assert.match(await p.locator('.readout').textContent(),/1 alteração/);
  },
  '10-arquitetura-do-impossivel':async p=>{
    await click(p,'Ir ao ponto de observação');
    const alignment=p.getByRole('button',{name:'Alinhar plataformas',exact:true}).last();
    await alignment.click();await status(p,/perpendiculares/);
    await click(p,'Girar 90°');
    await alignment.click();
    await holdUntil(p,'w',()=>[...document.querySelectorAll('.readout')].some(n=>n.textContent==='Travessia concluída'));
  },
  '11-museu-das-memorias':async p=>{
    await p.getByLabel('Título da memória').fill('Praia antiga');
    await p.getByLabel('Legenda').fill('Uma lembrança local.');
    await click(p,'Salvar memória');await status(p,/Praia antiga/);
    await p.getByLabel('Espaço de exposição').selectOption('1');
    await p.getByLabel('Título da memória').fill('Segundo espaço');
    await click(p,'Salvar memória');
    await p.reload();await ready(p);
    assert.equal(await p.getByLabel('Título da memória').inputValue(),'Praia antiga');
    await click(p,'Modo visita');assert(await p.getByLabel('Título da memória').isHidden());
  },
  '12-camara-antigravitacional':async p=>{
    await click(p,'Aplicar impulso');
    await p.waitForFunction(()=>/4\.10 m\/s/.test(document.querySelector('.readout').textContent));
    await click(p,'Gerar esfera');
    await p.waitForFunction(()=>document.querySelector('.readout').textContent.includes('4 corpos'));
    await click(p,'Reiniciar cena');await status(p,/Posições e velocidades/);
    await p.waitForFunction(()=>/0\.00 m\/s/.test(document.querySelector('.readout').textContent));
  },
  '13-atelie-de-ceramica':async p=>{
    await click(p,'Modelar região central');await status(p,/modelado/);
    await click(p,'Desfazer');await status(p,/desfeita/);await click(p,'Refazer');
    await p.getByLabel('Acabamento').selectOption('1');
    await click(p,'Expor e salvar peça');await status(p,/Peça exposta/);
    const craft=JSON.parse(await p.evaluate(()=>localStorage.getItem('sangi3d:15:13:v1')));
    assert(craft.profile.every(n=>Number.isFinite(n)&&n>=.28&&n<=1.25));
    assert.equal(craft.finish,1);
  },
  '14-refugio-da-chuva':async p=>{
    await click(p,'Selecionar xícara');await click(p,'Servir chá');await status(p,/Chá servido/);
    await click(p,'Sentar à janela');await status(p,/Canto de leitura/);
    await click(p,'Abrir janela');await status(p,/Janela aberta/);
    await click(p,'Levantar');await status(p,/levantou/);
    await p.getByLabel('Clima').selectOption('3');await click(p,'Fechar janela');await status(p,/Janela fechada/);
    const [photo]=await Promise.all([p.waitForEvent('download'),click(p,'Fotografar')]);
    assert.equal(photo.suggestedFilename(),'refugio-da-chuva.png');
    assert((await fs.promises.stat(await photo.path())).size>1024);
  },
  '15-maestro-invisivel':async p=>{
    await p.getByRole('button',{name:'Marcar pulso',exact:true}).focus();
    await p.evaluate(async ()=>{
      const button=[...document.querySelectorAll('button')].find(b=>b.textContent==='Marcar pulso');
      for(let i=0;i<4;i++){button.click();await new Promise(resolve=>setTimeout(resolve,500));}
    });
    await p.waitForFunction(()=>document.querySelector('.readout').textContent.match(/1[12][\d] BPM/));
    await p.getByLabel('Seção em destaque').selectOption('1');
    await click(p,'Percussão');
    await click(p,'Reouvir sequência');await status(p,/Reproduzindo a sequência/);
  },
};

const click=(p,name)=>p.getByRole('button',{name,exact:true}).click();
const ready=p=>p.locator('html[data-ready="true"]').waitFor({timeout:20000});
const peak=async p=>Number((await p.locator('.readout').textContent()).match(/[\d.]+/)[0]);
const status=(p,expected)=>p.waitForFunction(({pattern,flags})=>new RegExp(pattern,flags).test(document.querySelector('#status').textContent),
  {pattern:expected.source,flags:expected.flags});
const change=(p,label,value)=>p.getByLabel(label,{exact:true}).evaluate((element,n)=>{element.value=n;element.dispatchEvent(new Event('input'));},value);
async function holdUntil(page,key,fn){
  await page.locator('#view').focus();
  await page.keyboard.down(key);
  try{await page.waitForFunction(fn,undefined,{timeout:28000,polling:100});}
  finally{await page.keyboard.up(key);}
}

const viewports=[
  {width:1366,height:768},
  {width:360,height:800},
  {width:390,height:844},
  {width:412,height:915},
  {width:844,height:390},
  {width:768,height:1024},
  {width:1920,height:1080},
];
async function validate(){
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  const url='http://127.0.0.1:'+server.address().port+appPath;
  const browser=await chromium.launch({channel:'chrome',headless:true,args:['--enable-unsafe-swiftshader','--use-angle=swiftshader','--autoplay-policy=no-user-gesture-required']});
  const failures=[];
  const shots=process.env.SANGI_QA_DIR;
  if(shots)fs.mkdirSync(shots,{recursive:true});
  try{
    const requested=process.argv.slice(2);
    for(const [slug,run] of Object.entries(cases)){
      if(requested.length&&!requested.some(id=>slug.startsWith(id)))continue;
      const context=await browser.newContext({viewport:viewports[0],acceptDownloads:true});
      const page=await context.newPage();
      page.setDefaultTimeout(14500);
      const issues=[];
      page.on('pageerror',e=>issues.push(e.message));
      page.on('console',m=>{if(m.type()==='error')issues.push(m.text());});
      page.on('response',r=>{if(r.status()>=400)issues.push(r.status()+' '+r.url());});
      try{
        await page.goto(url+slug+'/');
        await ready(page);
        assert.match(await page.locator('#backend').textContent(),/r187/);
        await page.getByLabel('Qualidade gráfica').selectOption('LOW');
        for(const viewport of viewports){
          await page.setViewportSize(viewport);
          await page.waitForFunction(()=>!!document.querySelector('canvas').width);
          assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),slug+' overflow');
        }
        await page.setViewportSize(viewports[0]);
        if(shots){
          const clip=await page.locator('.viewport').boundingBox();
          await page.screenshot({path:path.join(shots,slug+'.png'),clip});
        }
        await run(page);
        await click(page,'Pausar');await click(page,'Continuar');
        assert.deepEqual(issues,[]);
        console.log('OK '+slug);
      }catch(error){
        failures.push(slug);
        if(shots)await page.screenshot({path:path.join(shots,slug+'-falha.png'),fullPage:true}).catch(()=>{});
        console.error('FAIL '+slug+' '+error.message+' '+issues.join(' | '));
      }finally{await context.close();}
    }
    if(!requested.length||requested.includes('touch')){
      const context=await browser.newContext({viewport:{width:390,height:844},hasTouch:true,isMobile:true});
      try{
        const page=await context.newPage();
        await page.goto(url+'03-floresta-bioluminescente/');
        await ready(page);
        const advance=page.getByRole('button',{name:'Avançar',exact:true});
        const register=page.getByRole('button',{name:'Registrar Lúmina azul',exact:true});
        for(let i=0;i<13&&!(await register.isVisible());i++)await advance.tap();
        await register.tap();
        await status(page,/Registrado: Lúmina azul/);
        console.log('OK navegação com toque emulado · Floresta');
      }finally{await context.close();}
    }
  }finally{await browser.close();server.close();}
  assert.deepEqual(failures,[],'Experiências com falhas');
}
validate().catch(error=>{console.error(error);server.close();process.exitCode=1;});
