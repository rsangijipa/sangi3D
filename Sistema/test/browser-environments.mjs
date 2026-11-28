import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { readFile, mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { setTimeout as delay } from 'node:timers/promises';
import { fileURLToPath } from 'node:url';

import { resolvePlaywright } from './lib/playwright-resolver.mjs';

const root = fileURLToPath(new URL('../..', import.meta.url));
const { chromium } = await resolvePlaywright();
const entries = JSON.parse(await readFile(new URL('../api/apps.json', import.meta.url), 'utf8'));
const kit = /\/(04-observatorio|05-oficina|06-torre|07-ilha|09-estacao|13-museu|14-estudio|16-teatro)[^/]+\/index\.html$/;
const commercial = /\/(04_maquina|05_clepsidra|07_copos|08_toca|10_maquina|11_relogio|14_bancada|15_barista|18_orgao)[^/]+\/index\.html$/;
const launcherOnly = process.argv.includes('--launcher-only');
const selected = process.argv.slice(2).filter(arg => arg !== '--launcher-only');
const games = entries.filter(({ url = '' }) =>
  (kit.test(url) || commercial.test(url)) && (!selected.length || selected.some(slug => url.includes(slug))));
assert.ok(games.length, 'Nenhum ambiente selecionado');
const port = Number(process.env.SANGI_TEST_PORT || 5298);
const base = `http://127.0.0.1:${port}`;
const server = spawn(process.execPath, ['Sistema/launcher/server.mjs', '--port', String(port), '--no-prebuild'], { cwd: root });
const captures = process.env.SANGI_CAPTURE_DIR;
let browser;
let failed = false;

try {
  let ready = false;
  for (let i = 0; i < 50 && !ready; i++) {
    ready = await fetch(base).then(response => response.ok, () => false);
    if (!ready) await delay(100);
  }
  assert.ok(ready, 'Launcher indisponível');
  browser = await chromium.launch({
    channel: 'chrome', args: ['--enable-unsafe-swiftshader', '--use-angle=swiftshader'],
  });
  const viewport = { width: Number(process.env.SANGI_VIEWPORT_WIDTH || 1280), height: Number(process.env.SANGI_VIEWPORT_HEIGHT || 720) };
  if (captures) await mkdir(captures, { recursive: true });
  for (const { name, url } of launcherOnly ? [] : games) {
    const page = await browser.newPage({ viewport, reducedMotion: 'reduce' });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('requestfailed', request => errors.push(request.method() + ' ' + request.url() + ' | ' + request.failure()?.errorText));
    page.on('console', message => {
      if (message.type() === 'error' && /THREE|WebGL|VALIDATE_STATUS/i.test(message.text())) errors.push(message.text());
    });
    await page.route('**/*', route => new URL(route.request().url()).origin === base ? route.continue() : route.abort());
    await page.addInitScript(() => {
      window.sangiDraws = 0;
      const methods = ['drawArrays', 'drawElements', 'drawArraysInstanced', 'drawElementsInstanced'];
      for (const name of methods) {
        const prototype = WebGL2RenderingContext.prototype;
        const original = prototype[name];
        prototype[name] = function (...args) {
          window.sangiDraws++;
          return original.apply(this, args);
        };
      }
    });
    try {
      await page.goto(base + url);
      await page.waitForFunction(() => window.sangiDraws > 0, null, { timeout: 12000 });
      assert.deepEqual(errors, []);
      const canvas = page.locator('canvas').first();
      assert.ok(await canvas.isVisible());
      if (captures && (selected.length || /04-observatorio|05-oficina|06-torre|07-ilha|09-estacao/.test(url))) {
        await page.screenshot({ path: resolve(captures, url.split('/').at(-2) + '.png') });
      }
      if (url.includes('04-observatorio')) {
        await page.locator('#tab-B').click();
        await page.locator('#sl-intensity').fill('20');
        assert.deepEqual(await page.evaluate(() => [window.state.A.intensity, window.state.B.intensity]), [75, 20]);
        await page.locator('#btn-prism').click();
        await page.locator('#pre-night').click();
        assert.deepEqual(await page.evaluate(() => [window.state.prismActive, window.state.preset]), [false, 'night']);
      }
      if (url.includes('05-oficina')) {
        await page.locator('#task-2').click();
        await page.locator('#btn-start').click();
        await page.getByRole('button', { name: 'Guardar Estojo' }).click();
        await page.getByRole('button', { name: 'Guardar Garrafa' }).click();
        await page.getByRole('button', { name: 'Guardar Caderno' }).click();
        await page.waitForFunction(() => document.querySelector('#btn-start').textContent === 'Concluído');
        await page.getByRole('button', { name: 'Ver sequência' }).click();
        assert.match(await page.locator('#sequence').innerText(), /Estojo[\s\S]*Garrafa[\s\S]*Caderno/);
        await page.getByRole('button', { name: 'Reiniciar' }).click();
        assert.equal(await page.locator('#digital-clock').innerText(), '00:00');
      }
      if (url.includes('06-torre')) {
        await page.locator('#btn-pause').click();
        const waiting = await page.evaluate(() => window.game.remaining);
        await page.waitForTimeout(250);
        assert.equal(await page.evaluate(() => window.game.remaining), waiting);
        await page.locator('#btn-pause').click();
        await page.waitForFunction(() => window.game.fsm === 'ready');
        await page.locator('#btn-release').click();
        await page.waitForFunction(() => window.game.progress > .05);
        await page.locator('#btn-pause').click();
        const position = await page.evaluate(() => window.game.progress);
        await page.waitForTimeout(250);
        assert.equal(await page.evaluate(() => window.game.progress), position);
        await page.locator('#btn-pause').click();
        await page.waitForFunction(() => window.game.round === 2);
        assert.equal(await page.locator('#lbl-released').innerText(), '1');
      }
      if (url.includes('07-ilha')) {
        assert.equal(await page.locator('#btn-breathe').getAttribute('aria-pressed'), 'false');
        await page.locator('#btn-breathe').click();
        assert.equal(await page.locator('#btn-breathe').getAttribute('aria-pressed'), 'true');
        await page.locator('#btn-spot-2').click();
        const paper = page.locator('#draw-canvas');
        const blank = await paper.evaluate(element => element.toDataURL());
        const bounds = await paper.boundingBox();
        assert.ok(bounds);
        await page.mouse.move(bounds.x + 10, bounds.y + 10);
        await page.mouse.down();
        await page.mouse.move(bounds.x + 40, bounds.y + 35);
        await page.mouse.up();
        const hasDrawing = async () => (await paper.evaluate(element => element.toDataURL())) !== blank;
        assert.ok(await hasDrawing());
        await page.getByRole('button', { name: 'Limpar' }).click();
        assert.ok(!(await hasDrawing()));
        await page.locator('#btn-spot-1').click();
        assert.equal(await page.locator('#btn-breathe').getAttribute('aria-pressed'), 'false');
      }
      if (url.includes('09-estacao')) {
        await page.locator('#btn-car-blue').click();
        await page.locator('#btn-board').click();
        assert.equal(await page.evaluate(() => window.stationState.isBoarding), false);
        await page.locator('#btn-car-green').click();
        await page.locator('#btn-board').click();
        await page.waitForFunction(() => document.querySelector('#ticket-id').textContent === '#02');
        for (let i = 0; i < 5; i++) await page.getByRole('button', { name: 'Pular bilhete' }).click();
        assert.match(await page.locator('#lbl-rule').innerText(), /Cor do Selo/);
        await page.getByRole('button', { name: 'Continuar com nova regra' }).click();
        assert.equal(await page.locator('#ticket-id').innerText(), '#07');
        assert.equal(await page.locator('#ticket-color').innerText(), 'Azul');
        await page.locator('#btn-car-green').click();
        await page.locator('#btn-board').click();
        assert.equal(await page.evaluate(() => window.stationState.isBoarding), false);
        await page.locator('#btn-car-blue').click();
        await page.locator('#btn-board').click();
        await page.waitForFunction(() => document.querySelector('#ticket-id').textContent === '#08');
      }
      assert.deepEqual(errors, []);
      console.log(`OK ${name}`);
    } catch (error) {
      failed = true;
      console.error(`FALHOU ${name} | ${errors.join(' | ') || error.message}`);
      if (captures) await page.screenshot({ path: resolve(captures, url.split('/').at(-2) + '-falha.png') });
    } finally {
      await page.close();
    }
  }
  if (!selected.length) {
    const page = await browser.newPage({ viewport, reducedMotion: 'reduce' });
    await page.route('**/*', route => new URL(route.request().url()).origin === base ? route.continue() : route.abort());
    try {
      const [catalogResponse] = await Promise.all([
        page.waitForResponse(response => response.url() === base + '/api/apps' && response.ok(), { timeout: 60000 }),
        page.goto(base + '/?acervo=aprimorar', { waitUntil: 'domcontentloaded' }),
      ]);
      const published = await catalogResponse.json();
      const playable = new Set(published.filter(entry => entry.status === 'ready').map(entry => entry.url));
      assert.deepEqual(games.filter(game => !playable.has(game.url)).map(game => game.name), []);
      await page.locator('#q').fill('Observatório da Luz');
      const card = page.locator('.card.ready').filter({ has: page.getByRole('heading', { name: 'Observatório da Luz', exact: true }) });
      await card.getByRole('button', { name: 'Abrir', exact: true }).click();
      const frame = page.frameLocator('iframe.player-frame');
      await frame.locator('#canvas-container canvas').waitFor({ state: 'visible' });
      await frame.locator('#btn-prism').click();
      assert.equal(await frame.locator('#btn-prism').innerText(), 'Oculto');
      await page.locator('#closePlayerBtn').click();
      await page.locator('iframe.player-frame').waitFor({ state: 'detached' });
      console.log('OK abertura, interação e saída pelo launcher');
    } catch (error) {
      failed = true;
      console.error('FALHOU ciclo do launcher | ' + error.message);
    } finally {
      await page.close();
    }
  }
} finally {
  await browser?.close();
  server.kill();
}
process.exitCode = Number(failed);
