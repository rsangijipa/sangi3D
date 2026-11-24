import { chromium } from 'playwright'
import assert from 'node:assert/strict'
import { mkdir } from 'node:fs/promises'
import { preview } from 'vite'
import { PerspectiveCamera, Spherical, Vector3 } from 'three'

const server=process.env.KINTSUGI_URL ? undefined : await preview({preview:{port:5191,host:'127.0.0.1'}})
const base=process.env.KINTSUGI_URL ?? server.resolvedUrls.local[0]
const browser=await chromium.launch({
  channel:process.env.KINTSUGI_CHANNEL ?? (process.platform==='win32'?'chrome':undefined),
  headless:true,
  args:['--enable-webgl','--enable-unsafe-swiftshader','--use-angle=swiftshader','--disable-background-timer-throttling','--no-proxy-server'],
})
const output='capturas'
await mkdir(output,{recursive:true})
const errors=[]
const action=(page,name)=>page.locator(`button[data-action="${name}"]:visible`).last().click()
const visible=locator=>locator.waitFor({state:'visible'})
const cleanPage=context=>context.newPage().then(page=>{
  page.on('pageerror',error=>errors.push(error.message))
  page.on('console',message=>{
    if(message.type()==='error') errors.push([message.text(),message.location().url].filter(Boolean).join(' '))
  })
  page.on('response',response=>{if(response.status()>=400)errors.push(`${response.status()} ${response.url()}`)})
  return page
})
const ready=page=>page.waitForFunction(()=>Number(document.querySelector('#world')?.dataset.calls)>0)
const shot=(page,name)=>page.screenshot({path:`${output}/${name}.png`,animations:'disabled'})
const shown=(page,text)=>visible(page.getByText(text,{exact:true}).first())
const text=(page,selector)=>page.locator(selector).innerText()
async function deskPixel(page,point) {
  const box=await page.locator('#world canvas').boundingBox()
  const target=new Vector3(0,1.01,.055)
  const relative=new Vector3(.45,1.53,1.67).sub(target)
  const spherical=new Spherical().setFromVector3(relative)
  spherical.phi=Math.min(1.20,spherical.phi)
  const camera=new PerspectiveCamera(40,box.width/box.height,.025,18)
  camera.position.setFromSpherical(spherical).add(target)
  camera.lookAt(target);camera.updateMatrixWorld()
  const projected=new Vector3(...point).project(camera)
  return [box.x+(projected.x+1)*box.width/2,box.y+(1-projected.y)*box.height/2]
}
async function drag(page,from,to) {
  await page.mouse.move(...from);await page.mouse.down()
  await page.mouse.move(...to,{steps:10});await page.mouse.up()
}
try {
  const context=await browser.newContext({viewport:{width:1280,height:720},reducedMotion:'reduce',acceptDownloads:true})
  const page=await cleanPage(context)
  await page.addInitScript(()=>{window.sessionEvents=[];addEventListener('kintsugi:session',event=>window.sessionEvents.push(event.detail))})
  await page.goto(base);await ready(page);await shot(page,'01-entrada-desktop')
  await action(page,'start')
  await action(page,'fit')
  assert.match(await text(page,'#status'),/alinhar/)
  await action(page,'align')
  const a=(2+.5)*Math.PI*2/5+.14
  await drag(page,await deskPixel(page,[-.64,.908,.43]),await deskPixel(page,[.243*Math.cos(a),1.0494,-.065+.243*Math.sin(a)]))
  assert.match(await text(page,'#status'),/encaixado/)
  await page.keyboard.press('Control+z')
  assert.equal(await page.locator('#fragment option[value="2"]').count(),1)
  assert.match(await text(page,'#status'),/desfeita/)
  await page.keyboard.press('Control+Shift+z')
  assert.match(await text(page,'#status'),/refeita/)
  await shot(page,'02-encaixe-desktop')
  await action(page,'tool-lacquer')
  const seamPoint=t=>{
    const profile=(.21+.79*t)*6-4
    const radius=.235+.03*profile
    const angle=2*Math.PI/5+.14+(.105*Math.sin(t*13+2.08)+.038*Math.sin(t*33+2.08))*Math.sin(t*2.5)
    return [radius*Math.cos(angle),1.037+.062*profile,-.065+radius*Math.sin(angle)]
  }
  await drag(page,await deskPixel(page,seamPoint(.57)),await deskPixel(page,seamPoint(.67)))
  assert.match(await text(page,'.coverage-text'),/[1-8] de 8/)
  while(!/^0 de 8/.test(await text(page,'.coverage-text'))) await action(page,'undo')
  await action(page,'section-0')
  await shown(page,'1 de 8 trechos cobertos')
  await action(page,'brush-all')
  await action(page,'tool-finish');await action(page,'brush-all')
  await shown(page,'8 de 8 trechos cobertos')
  await shot(page,'03-acabamento-desktop')
  await action(page,'tool-orbit');await action(page,'view-top');await action(page,'orbit-right')
  await shot(page,'04-vista-superior')
  await action(page,'view-detail');await shot(page,'05-detalhe')
  await action(page,'pause');await shown(page,'Bancada em pausa');await action(page,'resume')
  await action(page,'review');assert.match(await text(page,'dialog'),/3 \/ 5/)
  await action(page,'compare');await shown(page,'Ver peça atual')
  await action(page,'compare');await shown(page,'Comparar com o início')
  await shot(page,'06-revisao-parcial')
  const download=page.waitForEvent('download')
  await action(page,'capture')
  const piece=await download
  assert.equal(piece.suggestedFilename(),'kintsugi-peca.png')
  await piece.saveAs(`${output}/09-peca-exportada.png`)
  await action(page,'save');await action(page,'save-confirm')
  const exported=page.waitForEvent('download')
  await action(page,'export');await action(page,'export-confirm')
  assert.equal((await exported).suggestedFilename(),'kintsugi-resumo.json')
  await action(page,'finish')
  const events=await page.evaluate(()=>window.sessionEvents)
  assert.deepEqual(events.map(event=>event.type),['ready','pause','resume','summary','complete','exit'])
  assert.ok(events.every(event=>event.version===1 && !('observations' in event)))
  await page.reload();await ready(page);await action(page,'settings');await action(page,'load')
  await action(page,'review');assert.match(await text(page,'dialog'),/3 \/ 5/);await action(page,'resume')
  await action(page,'settings');await action(page,'reset');await action(page,'reset-confirm')
  await action(page,'review');assert.match(await text(page,'dialog'),/2 \/ 5/);await action(page,'resume')
  await action(page,'sound');assert.equal(await page.locator('[data-action="sound"]').getAttribute('aria-pressed'),'true')
  await action(page,'sound');assert.equal(await page.locator('[data-action="sound"]').getAttribute('aria-pressed'),'false')
  await action(page,'settings');await action(page,'delete-save');await action(page,'delete-confirm');await action(page,'load');await shown(page,'Não há peça guardada neste navegador.');await action(page,'close-dialog')
  await page.evaluate(async()=>{await navigator.serviceWorker.ready})
  await page.waitForFunction(()=>Boolean(navigator.serviceWorker.controller))
  await context.setOffline(true)
  await page.reload();await ready(page);await action(page,'start');await shown(page,'Encaixar fragmentos')
  await context.setOffline(false)
  console.log('Desktop, sessão parcial, desfazer/refazer, pausa, IndexedDB, exportação, eventos e offline: PASS')
  console.log('WebGL desktop:',await page.locator('#world').evaluate(node=>({...node.dataset})))
  await action(page,'settings');await page.locator('#quality').selectOption('cinema');await action(page,'close-dialog')
  await page.waitForFunction(()=>document.querySelector('#world').dataset.pipeline==='cinema')
  await shot(page,'10-cinema')
  await action(page,'settings');await page.locator('#quality').selectOption('light');await action(page,'close-dialog')
  await page.waitForFunction(()=>document.querySelector('#world').dataset.pipeline==='direct')
  const canvas=page.locator('#world canvas')
  await canvas.evaluate(node=>{
    window.glRecovery=node.getContext('webgl2').getExtension('WEBGL_lose_context')
    window.glRecovery.loseContext()
  })
  await visible(page.locator('#fallback'))
  await page.evaluate(()=>window.glRecovery.restoreContext())
  await page.locator('#fallback').waitFor({state:'hidden'})
  await action(page,'align');await action(page,'fit')
  assert.match(await text(page,'#status'),/encaixado/)
  console.log('Cinema, Leve e recuperação de contexto: PASS')
  await context.close()

  for(const [width,height] of [[1920,1080],[390,844],[360,640],[844,390]]) {
    const mobile=width<900
    const device=await browser.newContext({viewport:{width,height},hasTouch:mobile,isMobile:mobile,deviceScaleFactor:1,reducedMotion:'reduce'})
    const page=await cleanPage(device)
    await page.goto(base);await ready(page)
    if(width===390) await shot(page,'07-entrada-mobile')
    await action(page,'activity');await page.locator('#activity-vessel').selectOption(width===390?'vase':'plate')
    await page.locator('#activity-mode').selectOption(width===390?'alternate':'guided')
    await action(page,'start-custom')
    if(width!==390) {
      await shown(page,'Observe as bordas')
      await action(page,'demo-next');await shown(page,'Experimente o encaixe')
      await action(page,'demo-next');await shown(page,'Passe o pincel')
      await action(page,'close-dialog')
      assert.equal(await page.locator('#fragment').inputValue(),'2')
      await action(page,'align')
    }
    else await page.locator('#slot').selectOption('4')
    if(mobile) await page.locator('[data-action="fit"]:visible').tap();else await action(page,'fit')
    assert.match(await text(page,'#status'),/encaixado/)
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true)
    await action(page,'tool-orbit');await action(page,'view-desk')
    await shot(page,'08-bancada-'+width+'x'+height)
    console.log(`${width}×${height}: PASS`,await page.locator('#world').evaluate(node=>({...node.dataset})))
    await device.close()
  }

  const noGpu=await browser.newContext({viewport:{width:390,height:844}})
  const fallback=await cleanPage(noGpu)
  await fallback.addInitScript(()=>{
    const original=HTMLCanvasElement.prototype.getContext
    HTMLCanvasElement.prototype.getContext=function(type,...args){return type==='webgl2'?null:original.call(this,type,...args)}
  })
  await fallback.goto(base)
  await visible(fallback.locator('#fallback'))
  await action(fallback,'start');await action(fallback,'align');await action(fallback,'fit')
  assert.equal(await fallback.locator('#diagram .placed').count(),3)
  await noGpu.close()
  console.log('Fallback sem WebGL2: PASS')

  const embedding=await browser.newContext()
  const container=await cleanPage(embedding)
  await container.route('**/integration-shell',route=>route.fulfill({
    contentType:'text/html',
    body:`<link rel="icon" href="data:,"><script>window.received=[];addEventListener('message',e=>{if(e.origin===location.origin)received.push(e.data)})</script><iframe src="${base}?embed=1" title="Bancada" style="width:1000px;height:660px"></iframe>`,
  }))
  await container.goto(new URL('integration-shell',base).href)
  const frame=container.frameLocator('iframe')
  await container.waitForFunction(()=>window.received.some(event=>event.type==='ready'&&event.version===1))
  await frame.locator('[data-action="start"]').click()
  await frame.locator('[data-action="pause"]').click()
  await frame.locator('[data-action="resume"]').click()
  assert.deepEqual(await container.evaluate(()=>window.received.map(item=>item.type)),['ready','pause','resume'])
  console.log('Iframe de mesma origem e eventos v1: PASS')
  await embedding.close()
  assert.deepEqual(errors,[])
} finally {
  await browser.close()
  await server?.close()
}
