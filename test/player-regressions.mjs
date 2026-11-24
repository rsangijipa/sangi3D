import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { setTimeout as delay } from 'node:timers/promises';
import { pathToFileURL } from 'node:url';

const { chromium } = process.env.SANGI_PLAYWRIGHT
  ? await import(pathToFileURL(process.env.SANGI_PLAYWRIGHT).href)
  : await import('playwright');
const base = 'http://127.0.0.1:5294';
const server = spawn(process.execPath, ['launcher/server.mjs', '--port', '5294', '--no-prebuild']);
let browser;
try {
  let ready = false;
  for (let i = 0; i < 80 && !ready; i++) {
    ready = await fetch(base).then(response => response.ok, () => false);
    if (!ready) await delay(100);
  }
  assert.ok(ready);
  browser = await chromium.launch({ channel: 'chrome', args: ['--enable-unsafe-swiftshader'] });
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 }, reducedMotion: 'reduce' });
  await page.addInitScript(() => {
    window.renderedDraws = 0;
    const gl = WebGL2RenderingContext.prototype;
    for (const name of ['drawArrays', 'drawElements']) {
      const draw = gl[name];
      gl[name] = function (...args) { window.renderedDraws++; return draw.apply(this, args); };
    }
  });
  const errors = [];
  const appErrors = [];
  page.on('pageerror', error => appErrors.push(error.message));
  page.on('console', message => {
    const text = message.text();
    if (/Unrecognized feature: 'execution-while|Blocked aria-hidden|Permissions policy violation: focus-without-user-activation/i.test(text)) errors.push(text);
    if (/Shader Error|computeBoundingSphere.*NaN|context could not be created|WebGLRenderer: Context Lost/i.test(text)) {
      appErrors.push(text);
    }
  });
  const catalog = await fetch(base + '/api/apps').then(response => response.json());
  const oficina = catalog.find(entry => /02_Projetos.+01-oficina-do-vitralista/i.test(entry.url) && entry.status === 'ready');
  assert.ok(oficina, 'Oficina moderna ausente no catálogo');
  await page.goto(base);
  await page.locator('#q').fill('Oficina do Vitralista');
  const card = page.locator('.card.ready').filter({ has: page.locator('[data-play=' + JSON.stringify(oficina.id) + ']') });
  const open = card.getByRole('button', { name: 'Abrir', exact: true });
  for (let i = 0; i < 3; i++) {
    await open.click();
    const player = page.locator('iframe.player-frame');
    assert.doesNotMatch(await player.getAttribute('allow'), /execution-while/);
    const frame = page.frameLocator('iframe.player-frame');
    await frame.locator('#scene canvas').waitFor();
    await frame.locator('#loading').waitFor({ state: 'hidden' });
    await frame.locator('body').evaluate(() => new Promise(done => requestAnimationFrame(() => requestAnimationFrame(done))));
    assert.ok(await frame.locator('body').evaluate(() => window.renderedDraws > 0));
    await page.locator('#closePlayerBtn').click();
    await player.waitFor({ state: 'detached' });
    assert.ok(await open.evaluate(element => document.activeElement === element));
  }
  assert.deepEqual(errors, []);
  assert.deepEqual(appErrors, []);
  for (const slug of ['casa-da-arvore-das-emocoes', 'cozinha-das-descobertas', 'lago-3d-interativo', 'paisagem-sonora-3d']) {
    const entry = catalog.find(item => item.status === 'ready' && item.url.startsWith('/01_Jogos_HTML/' + slug + '/'));
    assert.ok(entry, slug);
    const url = base + entry.url;
    const html = await fetch(url).then(response => response.text());
    const assets = [...html.matchAll(/['"]([^'"\s]*imersivo\.(?:css|js)\?v=3)['"]/g)];
    assert.equal(assets.length, 2, slug);
    for (const [, asset] of assets) {
      assert.equal((await fetch(new URL(asset, url))).status, 200, asset);
    }
  }
  console.log('OK: três ciclos do player, foco restaurado, Oficina sem erros WebGL e Barra Imersiva em quatro páginas.');

  for (const [slug, builtUrl] of [
    ['02-atlas-das-texturas', '/Kit_17_jogos_3D_mockups_e_prompts/02-atlas-das-texturas/dist/'],
    ['jardim-dos-ciclos', '/02_Projetos/jardim-dos-ciclos/dist/'],
    ['pousada-vento-leve'], ['03_rochas-em-equilibrio'],
  ]) {
    const url = builtUrl ?? catalog.find(item => item.kind === 'standalone' && item.url.includes('/' + slug + '/'))?.url
      ?? catalog.find(item => item.url.includes('/' + slug + '/') && item.url.endsWith('.html'))?.url;
    assert.ok(url, slug);
    assert.ok((await page.goto(base + url)).ok());
    await page.waitForFunction(() => window.renderedDraws > 0);
    await page.waitForTimeout(750);
    assert.deepEqual(appErrors, []);
    console.log('OK: cena renderizada sem erro de shader ou geometria:', slug);
  }

  const tear = base + '/04-tear-dos-vinculos/dist/';
  const tearHtml = await fetch(tear).then(response => response.text());
  const tearAssets = [...tearHtml.matchAll(/(?:href|src)="(\.\/assets\/[^"]+)"/g)];
  assert.ok(tearAssets.length >= 2);
  for (const [, asset] of tearAssets) assert.equal((await fetch(new URL(asset, tear))).status, 200, asset);
  console.log('OK: arquivos de entrada do build atual do Tear respondem HTTP 200.');

  await page.goto(base);
  await page.evaluate(() => {
    const frame = document.createElement('iframe');
    frame.className = 'atlas-focus-test';
    frame.setAttribute('sandbox', 'allow-scripts allow-same-origin');
    frame.src = '/Kit_17_jogos_3D_mockups_e_prompts/02-atlas-das-texturas/dist/';
    document.body.prepend(frame);
  });
  await page.frameLocator('.atlas-focus-test').locator('canvas').first().waitFor();
  await page.waitForTimeout(750);
  assert.deepEqual(errors, []);
  assert.deepEqual(appErrors, []);
  console.log('OK: Atlas em iframe sem tentativa de foco antes da interação.');
} finally {
  await browser?.close();
  server.kill();
}
