import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { createServer } from 'node:net';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { launchBrowser } from '../../../Sistema/test/lib/playwright-resolver.mjs';

const root = fileURLToPath(new URL('../../../', import.meta.url));
const entry = '/Jogos/1%20-%20Jogos%20HTML/moinho-hidraulico/moinho_hidr_ulico_simulador_3d_interativo.html';

test('Moinho abre sem CDN e o guia acompanha a aceleração e a parada reais', { timeout: 90000 }, async (t) => {
  const probe = createServer().listen(0, '127.0.0.1');
  await once(probe, 'listening');
  const { port } = probe.address();
  await new Promise(resolve => probe.close(resolve));
  const base = `http://127.0.0.1:${port}`;
  const server = spawn(process.execPath, ['Sistema/launcher/server.mjs', '--port', String(port), '--no-prebuild'], { cwd: root });
  t.after(() => server.kill());

  await new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('Launcher indisponível')), 10000);
    server.once('error', reject);
    server.once('exit', code => reject(new Error(`Launcher encerrou com código ${code}`)));
    server.stdout.on('data', chunk => {
      if (!String(chunk).includes(base)) return;
      clearTimeout(timer);
      resolve();
    });
  });

  const { browser } = await launchBrowser({ gpu: 'swiftshader' });
  t.after(() => browser.close());
  const page = await browser.newPage({ viewport: { width: 900, height: 720 }, reducedMotion: 'reduce' });
  const errors = [];
  const remote = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.route('**/*', route => {
    const url = route.request().url();
    if (new URL(url).origin === base) return route.continue();
    remote.push(url);
    return route.abort();
  });
  const response = await page.goto(base + entry);
  assert.equal(response.status(), 200);
  await page.waitForFunction(() => document.querySelector('#fallback-screen').classList.contains('visible')
    || Number(document.querySelector('#val-wheel-rpm').textContent) > 1);
  assert.equal(await page.locator('#fallback-screen').isVisible(), false, await page.locator('#fallback-msg').textContent());
  assert.deepEqual(remote, []);
  await page.locator('#sel-quality').selectOption('leve');

  await page.locator('#mode-guiado').click();
  const next = page.locator('#btn-guide-next');
  const title = page.locator('#guide-title');
  const rpm = () => page.locator('#val-wheel-rpm').textContent().then(Number);
  const waitForNext = () => page.waitForFunction(() => !document.querySelector('#btn-guide-next').disabled, null, { timeout: 15000 });
  assert.match(await title.textContent(), /ponto de partida/i);
  assert.equal(await next.isDisabled(), true);
  await page.locator('#btn-guide-action').click();
  assert.equal(await page.locator('#sel-camera').inputValue(), 'roda');
  const gate = page.locator('#inp-gate');
  await gate.press('Home');
  assert.equal(await gate.inputValue(), '0');
  assert.equal(await page.locator('#inp-gate:focus').count(), 1);
  await waitForNext();
  assert.ok(await rpm() < 0.5);

  await next.click();
  assert.match(await title.textContent(), /abrir a comporta/i);
  assert.equal(await next.isDisabled(), true);
  await page.locator('[data-gate-preset="1"]').click();
  await waitForNext();
  const running = await rpm();
  assert.ok(running >= 1);

  await next.click();
  assert.match(await title.textContent(), /desaceleração/i);
  await page.locator('[data-gate-preset="0"]').click();
  await waitForNext();
  assert.ok(await rpm() < 0.5 && await rpm() < running);

  await page.locator('#tool-opcoes').click();
  await page.locator('#btn-open-reset').click();
  await page.locator('#btn-reset-empty').click();
  assert.equal(await page.locator('#mode-guiado').getAttribute('aria-selected'), 'true');
  assert.equal(await page.locator('#sel-camera').inputValue(), 'geral');
  assert.match(await title.textContent(), /ponto de partida/i);
  assert.ok(await rpm() < 0.5);

  await page.locator('#mode-desafios').click();
  assert.equal(await page.locator('#mode-desafios').getAttribute('aria-selected'), 'true');
  await page.locator('#mode-livre').click();
  assert.equal(await page.locator('#guide-card').isVisible(), false);
  await page.locator('#tool-vazao').click();
  const flow = page.locator('#inp-flow');
  assert.equal(await flow.inputValue(), '50');
  await flow.press('ArrowRight');
  assert.equal(await flow.inputValue(), '55');
  assert.equal(await page.locator('#inp-flow:focus').count(), 1);
  await page.locator('#tool-opcoes').click();
  await page.locator('#btn-undo').click();
  await page.locator('#tool-vazao').click();
  assert.equal(await flow.inputValue(), '50');
  assert.equal(await page.evaluate(() => window.__MOINHO_DIAG__().allPassed), true);
  assert.deepEqual(errors, []);

  await page.route('**/vendor/three.module.js', route => route.abort());
  await page.reload();
  await page.locator('#fallback-screen').waitFor({ state: 'visible' });
  assert.match(await page.locator('#fallback-msg').textContent(), /módulos gráficos locais/i);
  assert.equal(await page.locator('#btn-fallback-retry').isVisible(), true);
  assert.deepEqual(remote, []);
});
