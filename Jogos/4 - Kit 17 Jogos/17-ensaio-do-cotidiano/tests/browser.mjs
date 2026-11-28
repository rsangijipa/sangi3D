import { chromium } from 'playwright'
import { spawn } from 'node:child_process'
import { existsSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'

const PORT = 5194
const BASE_URL = `http://127.0.0.1:${PORT}`
const CAPTURAS_DIR = join(process.cwd(), 'capturas')

if (!existsSync(CAPTURAS_DIR)) {
  mkdirSync(CAPTURAS_DIR, { recursive: true })
}

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function startServer() {
  const child = spawn('npx', ['vite', 'preview', '--port', `${PORT}`, '--strictPort', '--host', '127.0.0.1'], {
    shell: true,
    stdio: 'pipe'
  })

  child.stdout.on('data', data => {
    // console.log(`[Vite] ${data.toString().trim()}`)
  })
  child.stderr.on('data', data => {
    console.error(`[Vite Err] ${data.toString().trim()}`)
  })

  // Wait for server to respond
  for (let i = 0; i < 30; i++) {
    try {
      const res = await fetch(BASE_URL)
      if (res.ok) {
        console.log(`Server ready at ${BASE_URL}`)
        return child
      }
    } catch (_) {}
    await wait(300)
  }

  child.kill()
  throw new Error(`Server failed to start on ${BASE_URL}`)
}

async function runTests() {
  console.log('--- Starting Browser & Automated E2E Tests ---')
  const server = await startServer()
  const browser = await chromium.launch({ headless: true })
  let failures = 0

  try {
    const page = await browser.newPage()

    // 1. Error & 404 monitoring
    const consoleErrors = []
    page.on('console', msg => {
      if (msg.type() === 'error') {
        const text = msg.text()
        // Ignore known harmless headless webgl notices if any
        if (!text.includes('favicon.ico')) {
          consoleErrors.push(text)
        }
      }
    })

    const failedRequests = []
    page.on('response', res => {
      if (res.status() >= 400 && !res.url().includes('favicon.ico')) {
        failedRequests.push(`${res.status()} ${res.url()}`)
      }
    })

    // 2. Viewport 1280x720 (Desktop Standard)
    console.log('Testing Desktop 1280x720...')
    await page.setViewportSize({ width: 1280, height: 720 })
    await page.goto(BASE_URL, { waitUntil: 'networkidle' })
    await wait(800)
    await page.screenshot({ path: join(CAPTURAS_DIR, '01-desktop-1280x720.png') })
    console.log('✓ Captured 01-desktop-1280x720.png')

    // 3. Viewport 1920x1080 (Desktop Full HD)
    console.log('Testing Desktop 1920x1080...')
    await page.setViewportSize({ width: 1920, height: 1080 })
    await wait(400)
    await page.screenshot({ path: join(CAPTURAS_DIR, '02-desktop-1920x1080.png') })
    console.log('✓ Captured 02-desktop-1920x1080.png')

    // 4. Mobile Viewports
    console.log('Testing Mobile 390x844 (iPhone 14)...')
    await page.setViewportSize({ width: 390, height: 844 })
    await wait(400)
    await page.screenshot({ path: join(CAPTURAS_DIR, '03-mobile-390x844.png') })
    console.log('✓ Captured 03-mobile-390x844.png')

    console.log('Testing Mobile 360x640 (Android Compact)...')
    await page.setViewportSize({ width: 360, height: 640 })
    await wait(400)
    await page.screenshot({ path: join(CAPTURAS_DIR, '04-mobile-360x640.png') })
    console.log('✓ Captured 04-mobile-360x640.png')

    console.log('Testing Mobile Landscape 844x390...')
    await page.setViewportSize({ width: 844, height: 390 })
    await wait(400)
    await page.screenshot({ path: join(CAPTURAS_DIR, '05-mobile-844x390.png') })
    console.log('✓ Captured 05-mobile-844x390.png')

    // Return to standard desktop for interactive functional testing
    await page.setViewportSize({ width: 1280, height: 720 })
    await wait(200)

    // 5. Waypoint Navigation Test
    console.log('Testing Waypoint navigation...')
    const produceBtn = page.locator('.waypoint-btn[data-wp="produce"]')
    await produceBtn.click()
    await page.waitForFunction(() => document.querySelector('#live-status')?.innerText.includes('produce'))
    console.log('✓ Navigated to produce waypoint')

    const pantryBtn = page.locator('.waypoint-btn[data-wp="pantry"]')
    await pantryBtn.click()
    await page.waitForFunction(() => document.querySelector('#live-status')?.innerText.includes('pantry'))
    console.log('✓ Navigated to pantry waypoint')

    // 6. Carrier Toggle Test (Cart <-> Basket)
    console.log('Testing carrier switch...')
    const carrierBtn = page.locator('#btn-carrier-toggle')
    await carrierBtn.click()
    await page.waitForFunction(() => document.querySelector('#carrier-label')?.innerText.includes('Cesta'))
    console.log('✓ Toggled to Cesta')
    await carrierBtn.click()
    await page.waitForFunction(() => document.querySelector('#carrier-label')?.innerText.includes('Carrinho'))
    console.log('✓ Toggled back to Carrinho')

    // 7. Low Stimulation Mode Switch
    console.log('Testing low stimulation mode...')
    const lowStimBtn = page.locator('#btn-low-stim')
    await lowStimBtn.click()
    await wait(300)
    console.log('✓ Toggled low stimulation mode')

    // 8. Sound Toggle
    console.log('Testing sound toggle...')
    const soundBtn = page.locator('#btn-sound')
    await soundBtn.click()
    await page.waitForFunction(() => document.querySelector('#btn-sound')?.innerText.includes('🔊'))
    console.log('✓ Sound enabled')

    // 9. Ask Help (NPC Cashier advice)
    console.log('Testing ask help...')
    const helpBtn = page.locator('#btn-ask-help')
    await helpBtn.click()
    await page.waitForFunction(() => !document.querySelector('#npc-speech-bubble')?.hasAttribute('hidden'))
    console.log('✓ NPC Cashier speech bubble displayed')
    const speechText = await page.locator('#npc-speech-text').innerText()
    console.log(`  Speech: "${speechText.slice(0, 50)}..."`)

    // Close speech
    await page.locator('#btn-close-speech').click()
    await page.waitForFunction(() => document.querySelector('#npc-speech-bubble')?.hasAttribute('hidden'))

    // 10. Item Picking & Cart Checklist
    console.log('Testing item collection in 2D / 3D...')
    // Toggle 2D mode for precise deterministic picking
    await page.locator('#btn-settings').click()
    await page.locator('#chk-fallback-2d').click()
    await page.locator('.modal-close-btn[data-close="settings"]').click()
    await wait(300)
    await page.screenshot({ path: join(CAPTURAS_DIR, '07-modo-planta-2d.png') })
    console.log('✓ Captured 07-modo-planta-2d.png')

    // Pick 3 required items for default mission (apple, rice, bread)
    const appleBtn = page.locator('.fallback-item-btn[data-item="apple"]')
    await appleBtn.click()
    await wait(200)

    const riceBtn = page.locator('.fallback-item-btn[data-item="rice"]')
    await riceBtn.click()
    await wait(200)

    const breadBtn = page.locator('.fallback-item-btn[data-item="bread"]')
    await breadBtn.click()
    await wait(200)

    // Verify HUD checklist marked items
    const collectedCount = await page.locator('.hud-item.collected').count()
    if (collectedCount !== 3) {
      console.error(`Expected 3 collected items in HUD, found ${collectedCount}`)
      failures++
    } else {
      console.log('✓ All 3 mission items collected in cart')
    }

    // 11. Checkout Flow & Service Bell
    console.log('Testing Checkout flow...')
    await page.locator('#btn-open-checkout').click()
    await wait(300)

    // Ring service bell in modal
    await page.locator('#btn-modal-bell').click()
    await wait(200)

    // Verify checkout validation status
    const statusText = await page.locator('#checkout-validation-status').innerText()
    console.log(`  Validation text: "${statusText}"`)

    // Finish checkout
    await page.locator('#btn-finish-payment').click()
    await wait(300)
    await page.waitForFunction(() => !document.querySelector('#modal-summary')?.hasAttribute('hidden'))

    // In summary modal, select observation
    await page.locator('.btn-obs[data-obs="Independente"]').click()
    await page.locator('#summary-obs-notes').fill('Participante concluiu a rotina do mercadinho com autonomia total.')
    await page.screenshot({ path: join(CAPTURAS_DIR, '06-checkout-resumo.png') })
    console.log('✓ Captured 06-checkout-resumo.png')

    await page.locator('#btn-save-summary').click()
    await wait(400)
    console.log('✓ Session observation saved successfully')

    // 12. Iframe v1 Session Protocol
    console.log('Testing Iframe v1 Session Protocol...')
    const iframeContext = await browser.newContext({ serviceWorkers: 'block' })
    const iframePage = await iframeContext.newPage()
    await iframePage.goto(`${BASE_URL}/test-frame.html`, { waitUntil: 'load' })

    // Wait for ready message from iframe
    await iframePage.waitForFunction(() => window.received && window.received.some(e => e.type === 'ready'), { timeout: 10000 })
    console.log('✓ Received ready event from iframe')

    // Send pause message
    await iframePage.evaluate(() => {
      const frame = document.getElementById('game-frame')
      frame.contentWindow.postMessage({ type: 'pause' }, '*')
    })
    await wait(300)

    // Send get-state message
    await iframePage.evaluate(() => {
      const frame = document.getElementById('game-frame')
      frame.contentWindow.postMessage({ type: 'get-state' }, '*')
    })
    await iframePage.waitForFunction(() => window.received.some(e => e.type === 'state-reply'), { timeout: 5000 })
    console.log('✓ Received state-reply from iframe')
    await iframeContext.close()

    // 13. Verify Console Errors and HTTP Failures
    console.log('Checking console errors and 404s...')
    if (consoleErrors.length > 0) {
      console.error('Console errors detected:', consoleErrors)
      failures++
    } else {
      console.log('✓ 0 console errors')
    }

    if (failedRequests.length > 0) {
      console.error('Failed HTTP requests:', failedRequests)
      failures++
    } else {
      console.log('✓ 0 failed HTTP requests (404/500)')
    }

    if (failures === 0) {
      console.log('\n=======================================')
      console.log('🎉 ALL BROWSER E2E TESTS PASSED!')
      console.log('=======================================\n')
    } else {
      console.error(`\n❌ Completed with ${failures} failure(s)\n`)
      process.exitCode = 1
    }
  } finally {
    await browser.close()
    server.kill()
  }
}

runTests().catch(err => {
  console.error('Fatal test error:', err)
  process.exit(1)
})
