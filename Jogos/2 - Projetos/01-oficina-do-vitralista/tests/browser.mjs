import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile, mkdir } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import { pathToFileURL } from 'node:url';

const playwright = process.env.VITRAL_PLAYWRIGHT
  ? await import(pathToFileURL(process.env.VITRAL_PLAYWRIGHT).href)
  : await import('playwright');
const root = resolve('dist');
const mediaTypes = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css' };
const server = createServer(async (request, response) => {
  try {
    const { pathname } = new URL(request.url, 'http://localhost');
    const path = resolve(root, '.' + (pathname === '/' ? '/index.html' : pathname));
    if (!path.startsWith(root + sep)) return response.writeHead(404).end();
    const content = await readFile(path);
    response.writeHead(200, { 'Content-Type': mediaTypes[extname(path)] }).end(content);
  } catch {
    response.writeHead(404).end();
  }
});
await new Promise((done, reject) => {
  server.once('error', reject);
  server.listen(0, '127.0.0.1', done);
});
const url = `http://127.0.0.1:${server.address().port}/?verificar`;
let browser;
try {
  console.log('Iniciando Chromium de teste…');
  browser = await (playwright.chromium ?? playwright.default.chromium).launch({
    executablePath: process.env.VITRAL_CHROMIUM,
    args: process.env.VITRAL_NATIVE_GPU ? ['--enable-unsafe-swiftshader']
      : ['--enable-unsafe-swiftshader', '--use-gl=angle', '--use-angle=swiftshader'],
    headless: true,
  });
  console.log('Chromium iniciado em', url);
  await mkdir('capturas', { recursive: true });
  const errors = [];
  async function start(contextOptions, quality) {
    const context = await browser.newContext(contextOptions);
    await context.addInitScript(value => { localStorage.setItem('oficina-do-vitralista-v1', JSON.stringify({ quality: value })); }, quality);
    const page = await context.newPage();
    page.on('pageerror', error => { errors.push(String(error)); console.error(error); });
    page.on('console', message => {
      if (message.type() === 'warning' || message.type() === 'error') {
        errors.push(message.text());
        console.error(message.type(), message.text());
      }
    });
    await page.goto(url);
    await page.locator('#loading').waitFor({ state: 'hidden', timeout: 60000 }).catch(async error => {
      console.error('Estado da página:', await page.locator('#loading').textContent({ timeout: 2000 }).catch(() => 'renderização ocupada'));
      await page.screenshot({ path: 'capturas/diagnostico.png', timeout: 5000 }).catch(() => {});
      throw error;
    });
    await page.waitForFunction(() => window.verificarVitral.projection() !== 0);
    await page.waitForTimeout(650);
    return page;
  }
  const page = await start({ viewport: { width: 1280, height: 720 }, acceptDownloads: true }, 'media');
  await page.screenshot({ path: 'capturas/01-bancada.png' });
  console.log('Bancada carregada.');
  const initialProjection = await page.evaluate(() => window.verificarVitral.projection());
  const startPoint = await page.evaluate(() => window.verificarVitral.tray('rubi'));
  const destination = await page.evaluate(() => window.verificarVitral.pane('1-0'));
  await page.mouse.move(startPoint.x, startPoint.y);
  await page.mouse.down();
  await page.mouse.move(destination.x, destination.y, { steps: 12 });
  await page.mouse.up();
  await page.waitForFunction(() => window.verificarVitral.state().panes['1-0'] === 'rubi');
  await page.waitForFunction(initial => window.verificarVitral.projection() !== initial, initialProjection);
  console.log('Arraste do vidro e atualização da projeção confirmados.');
  await page.getByRole('button', { name: 'Soldar', exact: false }).first().click();
  const trace = await page.evaluate(() => Array.from({ length: 13 }, (_, index) => window.verificarVitral.seam('anel-0', 0.035 + index * 0.93 / 12)));
  await page.mouse.move(trace[0].x, trace[0].y);
  await page.mouse.down();
  for (const point of trace) await page.mouse.move(point.x, point.y);
  await page.screenshot({ path: 'capturas/02-solda.png' });
  await page.mouse.up();
  await page.waitForFunction(() => window.verificarVitral.state().solder['anel-0'] === 255);
  await page.waitForFunction(() => window.verificarVitral.heat('anel-0') === 0, null, { timeout: 12000 });
  console.log('Solda contínua por mouse e resfriamento confirmados.');
  const beforeLight = await page.evaluate(() => window.verificarVitral.projection());
  await page.getByLabel('Luz', { exact: true }).selectOption('noon');
  await page.waitForFunction(before => window.verificarVitral.projection() !== before, beforeLight);
  await page.getByRole('button', { name: 'Contra a luz' }).click();
  await page.waitForTimeout(3800);
  await page.screenshot({ path: 'capturas/03-vidro-e-junta.png' });
  await page.getByRole('slider', { name: 'Posição do sol' }).focus();
  const inspectionLight = await page.evaluate(() => window.verificarVitral.projection());
  await page.keyboard.press('End');
  await page.waitForFunction(before => window.verificarVitral.projection() !== before, inspectionLight);
  const downloaded = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Exportar PNG' }).click();
  const file = await downloaded;
  assert.equal(file.suggestedFilename(), 'oficina-do-vitralista.png');
  assert.equal(await file.failure(), null);
  assert.ok((await readFile(await file.path())).subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])));
  const desktop = await page.evaluate(() => window.medirVitral(24));
  assert.ok(desktop.drawCalls > 0 && desktop.medianMs > 0);
  console.log('Equilibrada:', JSON.stringify(desktop));
  await page.getByLabel('Molde', { exact: true }).selectOption('botanico');
  assert.equal(await page.evaluate(() => window.verificarVitral.state().panes['1-0']), undefined);
  await page.getByLabel('Molde', { exact: true }).selectOption('roseta');
  assert.equal(await page.evaluate(() => window.verificarVitral.state().panes['1-0']), 'rubi');
  await page.getByRole('button', { name: 'Trocar cor' }).click();
  await page.keyboard.press('3');
  await page.getByRole('button', { name: 'Ações do molde' }).click();
  await page.getByRole('button', { name: 'Aplicar cor' }).click();
  assert.equal(await page.evaluate(() => window.verificarVitral.state().panes.centro), 'esmeralda');
  await page.context().close();

  const cinema = await start({ viewport: { width: 1280, height: 720 }, reducedMotion: 'reduce' }, 'alta');
  const cinemaMetrics = await cinema.evaluate(() => window.medirVitral(24));
  assert.ok(cinemaMetrics.drawCalls > 0 && cinemaMetrics.medianMs > 0);
  console.log('Cinema:', JSON.stringify(cinemaMetrics));
  await cinema.context().close();

  const mobile = await start({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true, deviceScaleFactor: 1, reducedMotion: 'reduce' }, 'baixa');
  const mobilePoint = await mobile.evaluate(() => window.verificarVitral.pane('1-0'));
  await mobile.getByRole('button', { name: 'Azul-cobalto' }).tap();
  await mobile.touchscreen.tap(mobilePoint.x, mobilePoint.y);
  await mobile.waitForFunction(() => window.verificarVitral.state().panes['1-0'] === 'cobalto');
  await mobile.getByRole('button', { name: 'Ações do molde' }).tap();
  await mobile.getByRole('button', { name: 'Encaixar vidro' }).tap();
  await mobile.getByRole('button', { name: 'Ações do molde' }).tap();
  await mobile.screenshot({ path: 'capturas/04-mobile.png' });
  assert.equal(await mobile.evaluate(() => document.documentElement.scrollWidth), 390);
  console.log('Leve mobile:', JSON.stringify(await mobile.evaluate(() => window.medirVitral(24))));
  console.log('Toque no vidro e ações acessíveis confirmados.');
  assert.deepEqual(errors, []);
} finally {
  await browser?.close();
  server.close();
}
