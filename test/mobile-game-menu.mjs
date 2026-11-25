import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { setTimeout as delay } from 'node:timers/promises';
import { launchBrowser } from './lib/playwright-resolver.mjs';

const port = 5298;
const base = 'http://127.0.0.1:' + port;
const server = spawn(process.execPath, ['launcher/server.mjs', '--port', String(port), '--no-prebuild']);
let browser;

try {
  let ready = false;
  for (let attempt = 0; attempt < 40 && !ready; attempt++) {
    ready = await fetch(base + '/api/apps').then(response => response.ok, () => false);
    if (!ready) await delay(100);
  }
  assert.ok(ready, 'O launcher deve estar disponível.');

  ({ browser } = await launchBrowser());
  const mobile = await browser.newPage({
    viewport: { width: 360, height: 800 },
    hasTouch: true,
    isMobile: true,
    reducedMotion: 'reduce',
  });
  const pageErrors = [];
  mobile.on('pageerror', error => pageErrors.push(error.message));

  const toggle = mobile.locator('#gameMenuToggle');
  const sheet = mobile.locator('#gameMenu');
  const frame = mobile.frameLocator('iframe.player-frame');
  await mobile.goto(base + '/#play=colmeia-transparente-html', { waitUntil: 'domcontentloaded' });
  await frame.locator('#sangi-mobile-game-style').waitFor({ state: 'attached' });

  for (const [width, height] of [[360, 800], [390, 844], [412, 915], [844, 390], [768, 1024]]) {
    await mobile.setViewportSize({ width, height });
    await toggle.tap();
    assert.equal(await toggle.getAttribute('aria-expanded'), 'true');
    const box = await sheet.boundingBox();
    assert.ok(box.x >= 0 && box.x + box.width <= width + 1 && box.y > 0 && box.y + box.height <= height + 1,
      'O menu deve caber em ' + width + ' × ' + height + '.');

    const pause = sheet.getByRole('button', { name: /pausar/i }).first();
    await pause.waitFor();
    if (width === 390) {
      await pause.tap();
      assert.ok(await sheet.isHidden());
      await frame.getByRole('button', { name: /retomar|continuar/i }).first().waitFor();
      await toggle.tap();
      await sheet.getByRole('button', { name: /retomar|continuar/i }).first().tap();
      assert.ok(await sheet.isHidden());
      await toggle.tap();
    }
    await mobile.locator('#closeGameMenu').tap();
    assert.equal(await toggle.getAttribute('aria-expanded'), 'false');
  }
  assert.deepEqual(pageErrors, [], 'A Colmeia deve permitir pausar e retomar a simulação.');

  await mobile.locator('#closePlayerBtn').tap();
  assert.ok(await mobile.locator('#playerModal').isHidden());
  await mobile.locator('#menuBtn').tap();
  assert.equal(await mobile.locator('#menuBtn').getAttribute('aria-expanded'), 'true');
  await mobile.keyboard.press('Escape');
  assert.equal(await mobile.locator('#menuBtn').getAttribute('aria-expanded'), 'false');
  await mobile.close();

  const desktop = await browser.newPage({ viewport: { width: 1366, height: 768 } });
  await desktop.goto(base + '/#play=colmeia-transparente-html', { waitUntil: 'domcontentloaded' });
  await desktop.locator('#closePlayerBtn').waitFor();
  for (const [width, height] of [[1366, 768], [1920, 1080]]) {
    await desktop.setViewportSize({ width, height });
    assert.ok(await desktop.locator('#gameMenuToggle').isHidden());
    assert.ok(await desktop.locator('#mutePlayerBtn').isVisible());
    assert.ok(await desktop.locator('#openTabBtn').isVisible());
  }
  console.log('OK: menu e ações da Colmeia em cinco tamanhos com toque e dois tamanhos desktop.');
} finally {
  await browser?.close();
  server.kill();
}
