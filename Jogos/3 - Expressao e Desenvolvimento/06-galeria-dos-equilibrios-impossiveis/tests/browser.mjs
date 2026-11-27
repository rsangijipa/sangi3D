import { chromium } from 'playwright'
import assert from 'node:assert/strict'
import { mkdir } from 'node:fs/promises'
import { preview } from 'vite'

const port = 5193
const server = process.env.GALERIA_URL ? undefined : await preview({ preview: { port, host: '127.0.0.1' } })
const base = process.env.GALERIA_URL ?? (server ? server.resolvedUrls.local[0] : `http://127.0.0.1:${port}`)

const browser = await chromium.launch({
  channel: process.env.GALERIA_CHANNEL ?? (process.platform === 'win32' ? 'chrome' : undefined),
  headless: true,
  args: [
    '--enable-webgl',
    '--enable-unsafe-swiftshader',
    '--use-angle=swiftshader',
    '--disable-background-timer-throttling',
    '--no-proxy-server'
  ]
})

const output = 'capturas'
await mkdir(output, { recursive: true })
const errors = []

const action = (page, name) => page.locator(`[data-action="${name}"]:visible`).last().click()
const visible = locator => locator.waitFor({ state: 'visible' })
const text = (page, selector) => page.locator(selector).innerText()
const shot = (page, name) => page.screenshot({ path: `${output}/${name}.png`, animations: 'disabled' })
const ready = page => page.waitForFunction(() => Number(document.querySelector('#world')?.dataset.calls) > 0)

const cleanPage = context =>
  context.newPage().then(page => {
    page.on('pageerror', err => errors.push(err.message))
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push([msg.text(), msg.location().url].filter(Boolean).join(' '))
    })
    page.on('response', resp => {
      if (resp.status() >= 400) errors.push(`${resp.status()} ${resp.url()}`)
    })
    return page
  })

try {
  console.log('--- Iniciando Testes Automatizados da Galeria dos Equilíbrios Impossíveis ---')

  // 1. Cenário Principal Desktop (1280x720)
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    reducedMotion: 'reduce',
    acceptDownloads: true
  })
  const page = await cleanPage(context)
  await page.addInitScript(() => {
    window.sessionEvents = []
    window.addEventListener('galeria:session', e => window.sessionEvents.push(e.detail))
  })

  await page.goto(base)
  await ready(page)
  await shot(page, '01-entrada-desktop')
  assert.equal(await page.title(), 'Galeria dos Equilíbrios Impossíveis')

  // Iniciar exploração
  await action(page, 'start')
  await page.waitForSelector('#dock:not([hidden])')

  // Adicionar peso na barra
  await action(page, 'tool-add-weight')
  await page.locator('[data-action="select-weight-type"][data-type="cylinder"]').click()
  await page.locator('#slot-select').selectOption('25')
  await action(page, 'hang-weight')
  assert.match(await text(page, '#status'), /adicionado/)

  // Mover fulcro
  await action(page, 'tool-move-fulcrum')
  await action(page, 'fulcrum-right')
  assert.match(await text(page, '#status'), /Fulcro ajustado/)
  await shot(page, '02-interacao-desktop')

  // Desfazer e refazer via teclado
  await page.keyboard.press('Control+z')
  assert.match(await text(page, '#status'), /desfeita/)
  await page.keyboard.press('Control+Shift+z')
  assert.match(await text(page, '#status'), /refeita/)

  // Observar movimento e alternar enquadramentos de câmera
  await action(page, 'tool-observe')
  await action(page, 'view-fulcrum')
  await page.waitForTimeout(400)
  await shot(page, '03-close-up-fulcro')

  await action(page, 'view-top')
  await page.waitForTimeout(400)
  await shot(page, '04-vista-superior')

  // Som toggle
  await action(page, 'sound')
  assert.equal(await page.locator('[data-action="sound"]').getAttribute('aria-pressed'), 'true')
  await action(page, 'sound')
  assert.equal(await page.locator('[data-action="sound"]').getAttribute('aria-pressed'), 'false')

  // Pausa e retomada
  await action(page, 'pause')
  await visible(page.locator('dialog[open]'))
  await action(page, 'resume')

  // Revisar e capturar imagem
  await action(page, 'tool-observe')
  await action(page, 'review')
  await visible(page.locator('dialog[open]'))
  await shot(page, '05-revisao-escultura')

  // Salvar no dispositivo local
  await action(page, 'save-local')

  // Download do resumo JSON
  const downloadJSON = page.waitForEvent('download')
  await action(page, 'export-summary')
  const jsonFile = await downloadJSON
  assert.equal(jsonFile.suggestedFilename(), 'galeria-resumo.json')

  // Concluir sessão e verificar eventos v1
  await action(page, 'finish-session')
  const events = await page.evaluate(() => window.sessionEvents)
  assert.deepEqual(
    events.map(e => e.type),
    ['ready', 'pause', 'resume', 'summary', 'complete', 'exit']
  )
  assert.ok(events.every(e => e.version === 1))

  // Teste de recarregamento e abertura da peça salva
  await page.reload()
  await ready(page)
  await action(page, 'start')
  await action(page, 'tool-free-balance')
  await action(page, 'settings')
  await action(page, 'load-save')
  await page.waitForFunction(() => /Peça carregada/.test(document.querySelector('#status')?.innerText || ''))

  // Limpar peça salva
  await action(page, 'settings')
  await action(page, 'delete-save')
  await page.waitForFunction(() => /excluída/.test(document.querySelector('#status')?.innerText || ''))

  // Modo Cinema & Leve
  await action(page, 'settings')
  await page.locator('#quality-select').selectOption('cinema')
  await action(page, 'close-dialog')
  await page.waitForFunction(() => document.querySelector('#world')?.dataset.pipeline === 'cinema')
  await shot(page, '10-cinema-gtao')

  await action(page, 'settings')
  await page.locator('#quality-select').selectOption('light')
  await action(page, 'close-dialog')
  await page.waitForFunction(() => document.querySelector('#world')?.dataset.pipeline === 'direct')

  // Perda e recuperação de contexto WebGL2
  const canvas = page.locator('#world canvas')
  await canvas.evaluate(node => {
    window.glRecovery = node.getContext('webgl2').getExtension('WEBGL_lose_context')
    window.glRecovery.loseContext()
  })
  await visible(page.locator('#fallback'))
  await page.evaluate(() => window.glRecovery.restoreContext())
  await page.locator('#fallback').waitFor({ state: 'hidden' })

  // Service Worker Offline
  await page.evaluate(async () => {
    if ('serviceWorker' in navigator) await navigator.serviceWorker.ready
  })
  await context.setOffline(true)
  await page.reload()
  await ready(page)
  await action(page, 'start')
  assert.equal(await page.locator('.dock-pill').count(), 4)
  await context.setOffline(false)

  console.log('✓ Desktop 1280x720, FSM, Undo/Redo, Cinema, ContextLoss, Offline: PASS')
  console.log('  Métricas WebGL Desktop:', await page.locator('#world').evaluate(n => ({ ...n.dataset })))
  await context.close()

  // 2. Testes de Responsividade em Múltiplos Viewports
  const viewports = [
    { width: 1920, height: 1080, name: '08-galeria-desktop-1920x1080' },
    { width: 390, height: 844, name: '07-galeria-mobile-390x844' },
    { width: 360, height: 640, name: 'mobile-360x640' },
    { width: 844, height: 390, name: 'landscape-844x390' }
  ]

  for (const vp of viewports) {
    const isMobile = vp.width < 900
    const devContext = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      hasTouch: isMobile,
      isMobile,
      reducedMotion: 'reduce'
    })
    const devPage = await cleanPage(devContext)
    await devPage.goto(base)
    await ready(devPage)

    if (vp.width === 390) {
      await shot(devPage, '06-entrada-mobile')
    }

    await action(devPage, 'start')
    await devPage.waitForSelector('#dock:not([hidden])')
    await shot(devPage, vp.name)

    // Sem overflow horizontal
    const noOverflow = await devPage.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)
    assert.ok(noOverflow, `Sem rolagem horizontal em ${vp.width}x${vp.height}`)

    console.log(`✓ Viewport ${vp.width}x${vp.height}: PASS`, await devPage.locator('#world').evaluate(n => ({ ...n.dataset })))
    await devContext.close()
  }

  // 3. Fallback sem WebGL2
  const fallbackCtx = await browser.newContext({ viewport: { width: 390, height: 844 } })
  const fallbackPage = await cleanPage(fallbackCtx)
  await fallbackPage.addInitScript(() => {
    const orig = HTMLCanvasElement.prototype.getContext
    HTMLCanvasElement.prototype.getContext = function (type, ...args) {
      return type === 'webgl2' ? null : orig.call(this, type, ...args)
    }
  })
  await fallbackPage.goto(base)
  await visible(fallbackPage.locator('#fallback'))
  await action(fallbackPage, 'start')
  await shot(fallbackPage, '09-fallback-2d')
  assert.ok(await fallbackPage.locator('#diagram svg').count() > 0)
  console.log('✓ Fallback DOM / SVG sem WebGL2: PASS')
  await fallbackCtx.close()

  // 4. Integração Iframe e postMessage
  const iframeCtx = await browser.newContext()
  const iframePage = await cleanPage(iframeCtx)
  await iframePage.route('**/shell', r =>
    r.fulfill({
      contentType: 'text/html',
      body: `
        <script>window.received=[];addEventListener('message', e=>{if(e.origin===location.origin)received.push(e.data)})</script>
        <iframe src="${base}?embed=1" style="width:1000px;height:700px"></iframe>
      `
    })
  )
  await iframePage.goto(new URL('shell', base).href)
  await iframePage.waitForFunction(() => window.received?.some(e => e.type === 'ready'))
  const frame = iframePage.frameLocator('iframe')
  await frame.locator('[data-action="start"]').click()
  await frame.locator('[data-action="pause"]').click()
  await frame.locator('[data-action="resume"]').click()
  await iframePage.waitForFunction(() => window.received?.some(e => e.type === 'resume'))
  assert.deepEqual(
    await iframePage.evaluate(() => window.received.map(e => e.type)),
    ['ready', 'pause', 'resume']
  )
  console.log('✓ Integração com Iframe e Eventos de Sessão v1: PASS')
  await iframeCtx.close()

  assert.deepEqual(errors, [])
  console.log('--- TODOS OS TESTES PASSARAM COM SUCESSO ---')
} finally {
  await browser.close()
  await server?.close()
}
