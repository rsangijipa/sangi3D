import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { launchBrowser } from '../../../../Sistema/test/lib/playwright-resolver.mjs';

const root = fileURLToPath(new URL('../../../../', import.meta.url));
const evidence = new URL('../capturas/', import.meta.url);
const png = name => fileURLToPath(new URL(name + '.png', evidence));
const port = 5394;
const base = 'http://127.0.0.1:' + port;
const server = spawn(process.execPath, ['Sistema/launcher/server.mjs', '--port', String(port), '--no-prebuild'],
  { cwd: root, stdio: ['ignore', 'pipe', 'inherit'] });
let browser;
const failures = [];
const runtime = [];
const watchErrors = page => {
  page.on('pageerror', error => failures.push(error.message));
  page.on('console', message => {
    if (message.type() === 'error' && !/favicon/.test(message.location().url)) failures.push(message.text());
  });
  page.on('requestfailed', request => {
    if (request.failure()?.errorText !== 'net::ERR_ABORTED') failures.push(request.url() + ' ' + request.failure()?.errorText);
  });
  page.on('response', response => {
    if (response.status() >= 400 && !response.url().endsWith('/favicon.ico')) failures.push(response.url() + ' ' + response.status());
  });
};

const desktop = { width: 1440, height: 900 };
const portrait = { width: 390, height: 844 };
const landscape = { width: 844, height: 390 };
const fly = (page, text) => page.locator('#live').getByText(text, { exact: false }).waitFor({ timeout: 3000 });
const fibers = page => page.locator('#lab').getAttribute('data-open-fibers');

async function waitBend(page, condition) {
  await page.waitForFunction(type => {
    const bend = Math.abs(Number(document.querySelector('#lab').dataset.bend));
    return type === 'flex' ? bend > 0.075 : bend < 0.002;
  }, condition, { timeout: 6500 });
}

async function open(page, url) {
  watchErrors(page);
  await page.goto(base + url);
  await page.locator('#lab[data-detail]').waitFor({ timeout: 15000 });
}

async function touchDrag(page, points) {
  const session = await page.context().newCDPSession(page);
  const [start, ...moves] = points;
  await session.send('Input.dispatchTouchEvent', { type:'touchStart', touchPoints:start });
  for (const touchPoints of moves) {
    await session.send('Input.dispatchTouchEvent', { type:'touchMove', touchPoints });
    await page.waitForTimeout(55);
  }
  await page.waitForTimeout(240);
  return {
    end: async () => {
      await session.send('Input.dispatchTouchEvent', { type:'touchEnd', touchPoints:[] });
      await session.detach();
    }
  };
}

async function sampled(page, name, quality) {
  await page.waitForTimeout(2600);
  await page.waitForFunction(() => Number(document.querySelector('#lab').dataset.frameMs) > 0);
  const record = await page.locator('#lab').evaluate(element => {
    const { frameMs, drawCalls, geometries, textures } = element.dataset;
    const gl = document.querySelector('canvas').getContext('webgl2');
    const debug = gl.getExtension('WEBGL_debug_renderer_info');
    return { ms: Number(frameMs), calls: Number(drawCalls), geometries: Number(geometries), textures: Number(textures),
      gpu: debug ? gl.getParameter(debug.UNMASKED_RENDERER_WEBGL) : 'indisponível' };
  });
  runtime.push({ name, quality, ...record });
}

try {
  for (let attempt = 0; attempt < 40; attempt++) {
    if (await fetch(base + '/api/ping').then(response => response.ok, () => false)) break;
    await new Promise(resolve => setTimeout(resolve, 150));
  }
  const entries = await fetch(base + '/api/apps').then(response => response.json());
  const app = entries.find(entry => entry.id === '7-cenas-3d-12-arquitetura-de-uma-pena');
  const hibiscus = entries.find(entry => entry.id === '7-cenas-3d-08-hibiscus-rosa-sinensis');
  assert.equal(app.collection, 'Cenas 3D');
  assert.equal(hibiscus.collection, 'Cenas 3D');
  assert.ok(hibiscus.versions.some(version => version.url.endsWith('/versao-anterior.html')));

  ({ browser } = await launchBrowser({ gpu: 'chrome' }));

  const page = await browser.newPage({ viewport: desktop, acceptDownloads: true });
  await open(page, app.url);
  await sampled(page, '1440 × 900 desktop', 'alta');
  await page.screenshot({ path: png('desktop') });
  if (process.argv.includes('--capture')) {
    await page.locator('#workbench').screenshot({
      path: fileURLToPath(new URL('../miniatura.png', import.meta.url)),
      style: '.mast,.view-rail,.dock,.panel {visibility:hidden !important}'
    });
  }
  await page.mouse.move(765, 435);
  await page.mouse.down();
  await page.mouse.move(785, 337, { steps: 6 });
  await waitBend(page, 'flex');
  await page.mouse.up();
  await waitBend(page, 'released');
  await fly(page, 'Curvatura restaurada');

  await page.locator('#split').click();
  for (const [x, y] of [[800, 393], [970, 348], [744, 472], [700, 430]]) {
    await page.mouse.click(x, y);
    await page.waitForTimeout(140);
    if (Number(await fibers(page))) break;
  }
  await page.waitForFunction(() => Number(document.querySelector('#lab').dataset.openFibers) > 0);
  await page.locator('#repair').click();
  await page.waitForFunction(() => document.querySelector('#lab').dataset.openFibers === '0');
  await fly(page, 'Pena alinhada');

  await page.locator('#split').click();
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('Space');
  await page.waitForFunction(() => Number(document.querySelector('#lab').dataset.openFibers) > 0);
  await page.locator('#recover').click();
  await page.keyboard.press('Space');
  await page.waitForFunction(() => document.querySelector('#lab').dataset.openFibers === '0');
  await page.locator('#micro').click();
  await page.locator('#lab[data-detail="bárbulas"]').waitFor();
  await sampled(page, '1440 × 900 microscópio', 'alta');
  await page.screenshot({ path: png('microscopio') });
  await page.locator('#light').click();
  await page.locator('#light-angle').focus();
  await page.keyboard.press('ArrowRight');
  assert.equal(await page.locator('#light-value').textContent(), '39°');
  await page.locator('#panel-close').click();
  await page.locator('#photo').click();
  await page.locator('#focus').focus();
  await page.keyboard.press('End');
  await page.locator('#exposure').focus();
  await page.keyboard.press('ArrowRight');
  await page.locator('#photo-dof').uncheck();
  await page.locator('#pin-reference').click();
  assert.ok(await page.locator('#photo-reference').evaluate(img => img.src.startsWith('data:image/png')));
  await page.locator('#compare').click();
  await page.locator('#photo-reference').waitFor({state:'hidden'});
  const downloadPromise = page.waitForEvent('download');
  await page.locator('#capture').click();
  const download = await downloadPromise;
  assert.equal(download.suggestedFilename(), 'arquitetura-de-uma-pena.png');
  await page.locator('#panel-close').click();
  await page.locator('#settings').click();
  await page.locator('#quality').selectOption('low');
  assert.equal(await page.locator('#quality').inputValue(), 'low');
  await page.locator('#mute').uncheck();
  await page.locator('#volume').focus();
  await page.keyboard.press('ArrowRight');
  assert.equal(await page.locator('#volume-value').textContent(), '36%');
  await page.evaluate(() => window.SangiBridge.handleMessage({ command: 'MUTE', type: 'SANGI_COMMAND', payload: { muted: true } }));
  assert.equal(await page.evaluate(() => window.SangiBridge.getState().muted), true);
  await page.locator('#mute').check();
  await page.locator('#open-help').click();
  await page.locator('#help-dialog[open]').waitFor();
  await page.locator('#help-close').click();
  await page.locator('#panel-close').click();
  await page.locator('#pause').click();
  await page.locator('#pause-dialog[open]').waitFor();
  await page.locator('#resume').click();
  await page.locator('#pause').click();
  await page.locator('#restart').click();
  assert.equal(await page.locator('#lab').getAttribute('data-detail'), 'barbas');
  await page.close();

  const mobile = await browser.newPage({ viewport: portrait, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
  await open(mobile, app.url);
  await sampled(mobile, '390 × 844 retrato emulado', 'média');
  await mobile.screenshot({ path: png('mobile') });
  await mobile.locator('#flex').tap();
  const flex = await touchDrag(mobile, [[{ x: 204, y: 425 }], [{ x: 208, y: 392 }], [{ x: 213, y: 348 }]]);
  await waitBend(mobile, 'flex');
  await flex.end();
  await waitBend(mobile, 'released');
  await mobile.locator('#split').tap();
  for (const [x, y] of [[222, 424], [164, 443], [208, 400], [245, 391]]) {
    await mobile.touchscreen.tap(x, y);
    await mobile.waitForTimeout(140);
    if (Number(await fibers(mobile))) break;
  }
  assert.ok(Number(await fibers(mobile)) > 0);
  await mobile.locator('#repair').tap();
  await mobile.waitForFunction(() => document.querySelector('#lab').dataset.openFibers === '0');
  const pinch = await touchDrag(mobile, [
    [{ x: 145, y: 411 }, { x: 245, y: 411 }],
    [{ x: 106, y: 410 }, { x: 283, y: 410 }],
    [{ x: 76, y: 409 }, { x: 313, y: 409 }]
  ]);
  await pinch.end();
  assert.ok(Number(await mobile.locator('#zoom-factor').inputValue()) > 1.5);
  await mobile.locator('#macro').tap();
  await mobile.setViewportSize(landscape);
  await mobile.waitForFunction(() => innerWidth === 844 && innerHeight === 390);
  assert.equal(await mobile.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
  await sampled(mobile, '844 × 390 paisagem emulada', 'média');
  await mobile.screenshot({ path: png('mobile-paisagem') });
  await mobile.close();

  const launcher = await browser.newPage({ viewport: desktop });
  await launcher.route('https://fonts.googleapis.com/**', route =>
    route.fulfill({ contentType: 'text/css', body: '' }));
  watchErrors(launcher);
  await launcher.goto(base + '/');
  await launcher.locator('button[data-view="scenes"]').click();
  for (const item of [app, hibiscus, app]) {
    await launcher.locator('button.btn[data-play="' + item.id + '"]').first().click();
    const frame = launcher.frameLocator('.player-frame');
    if (item === hibiscus) {
      await frame.locator('#loading-screen.hidden').waitFor();
      await frame.locator('#btn-compare').click();
      assert.ok(await frame.locator('img[src="referencia.jpg"]').evaluate(img => img.naturalWidth > 0));
      await frame.locator('#btn-compare').click();
      await frame.locator('[data-cam="stamen"]').click();
      await frame.locator('[data-cam="stamen"].active').waitFor();
      await frame.locator('#btn-gust').click();
    } else {
      await frame.locator('#lab[data-detail="barbas"]').waitFor();
      assert.equal(await frame.locator('#lab').getAttribute('data-open-fibers'), '0');
    }
    await launcher.locator('#closePlayerBtn').click();
    await launcher.locator('.player-frame').waitFor({ state: 'detached' });
  }
  assert.deepEqual(failures, []);
  console.log(JSON.stringify({ chromium: browser.version(), os: process.platform, runtime,
    checks: 'T01, T02, T03, mouse, teclado, toque, pinça, pausa, reset, foto, áudio, 3 viewports, catálogo e reabertura' }, null, 2));
} finally {
  await browser?.close();
  server.kill();
}
