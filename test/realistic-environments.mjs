import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { setTimeout as delay } from 'node:timers/promises';

const { chromium } = process.env.SANGI_PLAYWRIGHT
  ? await import(pathToFileURL(process.env.SANGI_PLAYWRIGHT).href)
  : await import('playwright');

const port = Number(process.env.SANGI_TEST_PORT || 5296);
const base = `http://127.0.0.1:${port}`;
const server = spawn(process.execPath, ['launcher/server.mjs', '--port', String(port), '--no-prebuild']);
const slugs = [
  '18_orgao-do-perfumista', '15_barista-de-bancada', '14_bancada-da-manicure', '07_copos-musicais',
  '04_maquina-de-escrever-das-intencoes', '16-teatro-das-historias-possiveis',
  '14-estudio-dos-limites', '13-museu-dos-pontos-de-vista',
  'oficina-de-estofados', 'restauro-de-azulejos',
];
const selection = process.argv.slice(2);
const captures = process.env.SANGI_CAPTURE_DIR;
let browser;
let failed = false;
try {
  let ready = false;
  for (let i = 0; i < 80 && !ready; i++) {
    ready = await fetch(base).then(response => response.ok, () => false);
    if (!ready) await delay(100);
  }
  assert.ok(ready, 'Launcher indisponível');
  browser = await chromium.launch({ channel: 'chrome', args: ['--enable-unsafe-swiftshader'] });
  const catalog = await fetch(base + '/api/apps').then(response => response.json());
  if (captures) await mkdir(captures, { recursive: true });
  for (const slug of slugs.filter(item => !selection.length || selection.some(part => item.includes(part)))) {
    const app = catalog.find(entry => entry.url.endsWith('/' + slug + '/index.html') && entry.status === 'ready');
    assert.ok(app, slug + ' ausente do Launcher');
    for (const viewport of [{ width: 1280, height: 800 }, { width: 390, height: 844 }]) {
      const mobile = viewport.width < 500;
      const page = await browser.newPage({ viewport, reducedMotion: 'reduce', hasTouch: mobile, isMobile: mobile });
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      page.on('console', message => {
        if (/Shader Error|computeBoundingSphere.*NaN|context could not be created|WebGLRenderer: Context Lost/i.test(message.text())) errors.push(message.text());
      });
      page.on('response', response => {
        if (response.url().startsWith(base) && response.status() >= 400 && !response.url().endsWith('/favicon.ico')) {
          errors.push(`HTTP ${response.status()} ${response.url()}`);
        }
      });
      await page.addInitScript(() => {
        window.renderedDraws = 0;
        const methods = ['drawArrays', 'drawElements', 'drawElementsInstanced', 'drawArraysInstanced'];
        for (const name of methods) {
          const method = WebGL2RenderingContext.prototype[name];
          WebGL2RenderingContext.prototype[name] = function (...args) { window.renderedDraws++; return method.apply(this, args); };
        }
      });
      try {
        // Open the same deep link offered by the catalog.
        await page.goto(base + '/#play=' + encodeURIComponent(app.id));
        const iframe = page.locator('iframe.player-frame');
        await iframe.waitFor({ state: 'visible' });
        const frame = page.frameLocator('iframe.player-frame');
        const game = page.frames().find(candidate => candidate.url().endsWith(app.url));
        assert.ok(game, app.url);
        if (slug === 'restauro-de-azulejos') {
          await frame.getByRole('heading', { name: 'Rosácea de Cobalto' }).waitFor({ timeout: 5000 });
          await frame.getByRole('button', { name: /Jardim de Açafrão/ }).click();
          assert.equal(await frame.locator('#puzzle-board button').count(), 16);
          assert.match(await frame.locator('#puzzle-progress').innerText(), /0 de 6/);
          await frame.getByRole('button', { name: 'Pedir dica' }).click();
          assert.equal(await frame.locator('#puzzle-board .is-hinted').count(), 1);
          assert.equal(await frame.locator('#puzzle-tray .is-hinted').count(), 1);
          await frame.getByRole('button', { name: 'Ver referência' }).click();
          await frame.getByRole('dialog', { name: 'Jardim de Açafrão' }).waitFor();
          await frame.getByRole('button', { name: 'Fechar referência' }).click();
          await frame.getByRole('button', { name: 'Reiniciar', exact: true }).click();
          await frame.getByRole('button', { name: 'Reiniciar painel', exact: true }).click();
          await game.waitForFunction(() => document.getElementById('puzzle-status').textContent.includes('Peças embaralhadas'));
          if (captures) await page.screenshot({ path: resolve(captures, slug + (mobile ? '-puzzle-mobile' : '-puzzle') + '.png') });
          await frame.getByRole('link', { name: 'Oficina 3D' }).click();
        }
        await frame.locator('canvas').first().waitFor({ state: 'visible' });
        await game.waitForFunction(() => window.renderedDraws > 0);
        assert.deepEqual(errors, []);
        await page.waitForTimeout(550);
        if (captures) await page.screenshot({ path: resolve(captures, slug + (mobile ? '-mobile' : '') + '.png') });
        if (slug.startsWith('18_')) {
          await frame.getByRole('button', { name: /coração/i }).click();
          await frame.getByRole('button', { name: /rosa centifólia/i }).click();
          await frame.locator('#btn-drop').click();
          await game.waitForFunction(() => document.getElementById('drops-count').textContent === '1 gota');
          await frame.locator('#btn-sniff').click();
          assert.match(await frame.locator('#result-line').innerText(), /Rosa Centifólia/);
          await frame.locator('#btn-name').click();
          await frame.locator('#formula-name').fill('Flor de Manaus');
          await frame.getByRole('button', { name: 'Gravar no frasco' }).click();
          await game.waitForFunction(() => document.getElementById('result-line').textContent.includes('Flor de Manaus'));
        }
        if (slug.startsWith('15_')) {
          for (const id of ['grind', 'tamp', 'dock-filter', 'lever', 'steam', 'latte']) {
            await frame.locator('#btn-' + id).click({ timeout: 16000 });
          }
          await game.waitForFunction(() => /finalizada/.test(document.getElementById('status-card').textContent));
          assert.equal(await frame.locator('#volume-val').innerText(), '36 ml');
          if (captures && !mobile) await page.screenshot({ path: resolve(captures, slug + '-latte.png') });
          await frame.locator('#btn-clean').click();
          await game.waitForFunction(() => document.getElementById('volume-val').textContent === '0 ml');
        }
        if (slug.startsWith('14_bancada')) {
          await frame.locator('#shape-2').click();
          await frame.locator('#art-glitter').click();
          await frame.locator('#btn-paint').click();
          await frame.locator('#btn-uv').click();
          assert.equal(await frame.locator('#btn-uv').getAttribute('aria-pressed'), 'true');
        }
        if (slug.startsWith('07_')) {
          await frame.locator('#tool-pitcher').click();
          assert.equal(await frame.locator('#tool-pitcher').getAttribute('aria-pressed'), 'true');
          await frame.locator('#tune').click();
          assert.match(await frame.locator('#help-msg').innerText(), /afinadas/i);
        }
        if (slug.startsWith('04_')) {
          await frame.locator('#keyboard-toggle').click();
          assert.equal(await frame.locator('#keyboard-toggle').getAttribute('aria-expanded'), 'true');
          await frame.locator('#keyboard button').filter({ hasText: /^A$/ }).click();
          assert.ok(await frame.locator('#stamp').isEnabled());
          await frame.locator('#stamp').click();
        }
        if (slug.startsWith('16-')) {
          await frame.locator('#record').click();
          await frame.locator('[data-action="chegar"]').click();
          await frame.locator('#record').click();
          assert.match(await frame.locator('#record').innerText(), /Regravar/);
        }
        if (slug.startsWith('14-estudio')) {
          await frame.locator('#rehearse').click();
          assert.notEqual(await frame.locator('#caption').innerText(), '');
          await frame.locator('#curtain').click();
          assert.equal(await frame.locator('#curtain').getAttribute('aria-pressed'), 'true');
        }
        if (slug.startsWith('13-')) {
          await frame.locator('#btn-pov').click();
          assert.equal(await frame.locator('#btn-pov').getAttribute('aria-pressed'), 'true');
          await frame.locator('#mode').click();
          assert.match(await frame.locator('#progress').innerText(), /LIVRE/);
        }
        if (slug === 'oficina-de-estofados') {
          await frame.locator('[data-fabric="linho_salvia"]').click();
          assert.match(await frame.locator('#fabricBadge').innerText(), /Linho Sálvia/i);
          await frame.locator('[data-cam="assento"]').click();
          assert.match(await frame.locator('[data-cam="assento"]').getAttribute('class'), /btn-active/);
        }
        if (slug === 'restauro-de-azulejos') {
          await frame.locator('#btn-toggle-raking').click();
          assert.match(await frame.locator('#btn-toggle-raking').innerText(), /OFF/);
          await frame.locator('#btn-go-clean').click();
          assert.match(await frame.locator('#step-clean').getAttribute('class'), /active/);
        }
        assert.deepEqual(errors, []);
        await page.locator('#closePlayerBtn').click();
        await iframe.waitFor({ state: 'detached' });
        console.log('OK', slug, viewport.width);
      } catch (error) {
        failed = true;
        console.error('FALHOU', slug, viewport.width, errors.join(' | ') || error.message);
      } finally {
        await page.close();
      }
    }
  }
} finally {
  await browser?.close();
  server.kill();
}
process.exitCode = Number(failed);
