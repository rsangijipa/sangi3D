import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { mkdir, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.ATELIER_PLAYWRIGHT || 'playwright');
const root = process.env.ATELIER_URL || 'http://127.0.0.1:5187/';
const artifacts = resolve(process.env.ATELIER_ARTIFACTS || 'tests/artifacts');
await mkdir(artifacts,{recursive:true});
const browser = await chromium.launch({
  executablePath:process.env.ATELIER_CHROME,
  headless:true,
  args:['--no-sandbox','--enable-unsafe-swiftshader',process.env.ATELIER_WEBGPU==='1'?'--enable-unsafe-webgpu':'--disable-webgpu'],
});
async function testPage(options) {
  const page=await browser.newPage(options);
  if (process.env.ATELIER_WEBGPU !== '1') {
    await page.addInitScript(()=>Object.defineProperty(Navigator.prototype,'gpu',{get:()=>undefined,configurable:true}));
  }
  if (process.env.ATELIER_DIST === '1') {
    const mime={html:'text/html',js:'application/javascript',css:'text/css',png:'image/png',webp:'image/webp'};
    await page.route('http://127.0.0.1:5187/**',async route=>{
      const path=new URL(route.request().url()).pathname.slice(1)||'index.html';
      if (path==='favicon.ico') { await route.fulfill({status:204}); return; }
      const body=await readFile(resolve('dist',path));
      await route.fulfill({body,contentType:mime[path.split('.').at(-1)]});
    });
  }
  return page;
}
try {
  const desktop = await testPage({viewport:{width:1440,height:900},acceptDownloads:true});
  const errors=[];
  desktop.on('pageerror',error=>errors.push(error.message));
  desktop.on('console',message=>{
    if (message.type()==='error' || message.type()==='warning') console.log(message.type(),message.text());
  });
  await desktop.goto(root,{waitUntil:'networkidle'});
  await desktop.locator('#stage canvas').waitFor({timeout:35000});
  await desktop.locator('#loading').waitFor({state:'hidden'});
  await desktop.screenshot({path:resolve(artifacts,'desktop.png')});
  const backend=await desktop.locator('#stage canvas').evaluate(el=>el.getContext('webgpu') ? 'WebGPU' : 'WebGL 2');
  assert.equal(backend,process.env.ATELIER_WEBGPU==='1'?'WebGPU':'WebGL 2');
  console.log('Renderizador confirmado:',backend);
  const canvasBefore=await desktop.screenshot({clip:{x:560,y:250,width:240,height:300}});
  await desktop.mouse.move(648,350);
  await desktop.mouse.down();
  await desktop.mouse.move(668,477,{steps:16});
  await desktop.mouse.up();
  assert.equal(await desktop.locator('#undo').isEnabled(),true);
  await desktop.click('[data-mode="paint"]');
  await desktop.click('[data-pigment="3"]');
  await desktop.mouse.move(630,423);await desktop.mouse.down();
  await desktop.mouse.move(721,478,{steps:12});await desktop.mouse.up();
  assert.notDeepEqual(await desktop.screenshot({clip:{x:560,y:250,width:240,height:300}}),canvasBefore);
  await desktop.click('#undo');await desktop.click('#redo');
  await desktop.click('#flip');
  await desktop.waitForTimeout(850);
  assert.equal(await desktop.locator('#face-label').textContent(),'Face interna');
  await desktop.mouse.click(666,405);
  await desktop.click('#flip');
  await desktop.waitForTimeout(850);
  await desktop.click('[data-mode="decorate"]');
  await desktop.mouse.click(727,431);
  assert.equal(await desktop.locator('#remove-ornament').isEnabled(),true);
  await desktop.click('#save');
  await desktop.fill('#creation-name','Teste da bancada');
  await desktop.fill('#creation-description','Versão de teste');
  await desktop.click('#save-form button[type=submit]');
  await desktop.locator('#dialog').waitFor({state:'hidden'});
  await desktop.click('#save');await desktop.click('#save-form button[type=submit]');
  await desktop.locator('#dialog').waitFor({state:'hidden'});
  await desktop.click('#gallery');
  await desktop.getByText('2 versões',{exact:true}).waitFor();
  await desktop.click('#close-dialog');
  await desktop.click('#export');
  for (const [button,ext] of [['#png','png'],['#glb','glb'],['#obj','obj']]) {
    const [download]=await Promise.all([desktop.waitForEvent('download'),desktop.click(button)]);
    assert.ok(download.suggestedFilename().endsWith('.'+ext));
    const file=await readFile(await download.path());
    assert.ok(file.length>1000);
    if (ext==='glb') {
      assert.equal(file.subarray(0,4).toString(),'glTF');
      const model=JSON.parse(file.subarray(20,20+file.readUInt32LE(12)));
      assert.ok(model.meshes.length>=4 && model.images.length>=2);
      assert.ok(model.nodes.some(node=>node.name==='Interior'));
    }
    if (ext==='png') assert.equal(file.subarray(1,4).toString(),'PNG');
  }
  await desktop.click('#close-dialog');
  await desktop.click('#experiences');
  await desktop.click('[data-exp="3"]');
  await desktop.click('#switch-mask');
  await desktop.click('#experiences');
  await desktop.click('[data-exp="5"]');
  await desktop.selectOption('#movement','Dança');
  await desktop.click('#close-dialog');
  await desktop.screenshot({path:resolve(artifacts,'theater.png')});
  await desktop.reload({waitUntil:'networkidle'});
  await desktop.locator('#loading').waitFor({state:'hidden'});
  await desktop.click('#gallery');
  await desktop.getByText('Teste da bancada',{exact:true}).waitFor();
  await desktop.click('#load-0');
  await desktop.locator('#dialog').waitFor({state:'hidden'});
  assert.deepEqual(errors,[]);
  const mobile = await testPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true,deviceScaleFactor:1});
  await mobile.goto(root,{waitUntil:'networkidle'});
  await mobile.locator('#stage canvas').waitFor({timeout:35000});
  await mobile.locator('#loading').waitFor({state:'hidden'});
  await mobile.screenshot({path:resolve(artifacts,'mobile.png')});
  await mobile.tap('#disclosure');
  assert.equal(await mobile.locator('#disclosure').getAttribute('aria-expanded'),'true');
  assert.equal(await mobile.locator('[data-mode="paint"]').isVisible(),true);
  await mobile.tap('#disclosure');
  await mobile.touchscreen.tap(194,390);
  assert.equal(await mobile.locator('#undo').isEnabled(),true);
  console.log('Fluxos desktop, celular, galeria, modos e exportações verificados.');
} finally { await browser.close(); }
