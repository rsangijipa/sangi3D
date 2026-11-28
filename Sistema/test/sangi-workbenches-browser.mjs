import assert from 'node:assert/strict';
import { mkdir, readFile } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { createServer } from 'node:net';
import { once } from 'node:events';
import path from 'node:path';
import { launchBrowser } from './lib/playwright-resolver.mjs';

const root = process.env.SANGI_WORKBENCH_CAPTURES;
const profile = process.env.SANGI_WORKBENCH_PROFILE;
const selected = process.argv[2];
const dimensions = {
  desktop: { width: 1440, height: 900 },
  retrato: { width: 390, height: 844 },
  paisagem: { width: 844, height: 390 },
};
assert.ok(!profile || Object.hasOwn(dimensions, profile), `Viewport de teste desconhecido: ${profile}`);
const games = {
  'oficina-das-bolhas': async (page, press) => {
    const stage = page.locator('.wb-stage');
    await press(page.locator('#dip'));
    await page.waitForFunction(() => document.querySelector('.wb-stage')?.dataset.wet === 'true');
    await press(page.locator('#blow'));
    await page.waitForFunction(() => Number(document.querySelector('.wb-stage')?.dataset.maxDiameter) > 0);
    assert.equal(await stage.getAttribute('data-wet'), 'false');
    const diameter = Number(await stage.getAttribute('data-max-diameter'));
    await press(page.locator('#giant'));
    await press(page.locator('#dip'));
    await press(page.locator('#blow'));
    assert.ok(Number(await stage.getAttribute('data-max-diameter')) > diameter);
    const count = Number(await stage.getAttribute('data-popped'));
    await press(page.locator('#pop'));
    await page.waitForFunction((last) => Number(document.querySelector('.wb-stage')?.dataset.popped) > last, count);
  },
  'universo-de-uma-gota': async (page, press) => {
    const catalog = page.locator('#gota-catalogo');
    if (await catalog.isVisible()) await press(catalog);
    await press(page.locator('#gota-amostras button').first());
    assert.match(await page.locator('#gota-descobertos').innerText(), /^1\s*\/\s*[1-9]\d*$/);
    const zoom = Number(await page.locator('#gota-zoom').inputValue());
    await press(page.locator('#gota-ampliar'));
    assert.ok(Number(await page.locator('#gota-zoom').inputValue()) > zoom);
    const photo = page.locator('#gota-foto');
    const data = await download(page, press, photo);
    assert.deepEqual([...data.subarray(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10]);
    assert.ok(data.length > 10_000, 'A foto deve conter a cena renderizada.');
  },
  'oficina-de-mosaicos': async (page, press) => {
    await page.locator('#mosaic-preset').selectOption('mare');
    await press(page.locator('[data-mosaic-tool="grout"]'));
    const grout = page.locator('#mosaic-grout-all');
    await press(grout);
    await press(page.locator('#mosaic-undo'));
    await press(page.locator('#mosaic-redo'));
    const exportButton = page.locator('#mosaic-export');
    if (!(await exportButton.isVisible())) await press(page.locator('#mosaic-more summary'));
    const exported = JSON.parse(await download(page, press, exportButton));
    assert.equal(exported.preset, 'mare');
    assert.ok(exported.tiles.some(Boolean), 'O JSON deve incluir as peças da obra.');
    assert.ok(exported.filled.every(Boolean), 'Refazer deve recuperar o rejunte.');
    await page.reload();
    assert.equal(await page.locator('#mosaic-preset').inputValue(), 'mare');
  },
};
assert.ok(!selected || Object.hasOwn(games, selected), `Jogo de teste desconhecido: ${selected}`);

const probe = createServer().listen(0, '127.0.0.1');
await once(probe, 'listening');
const { port } = probe.address();
await new Promise((resolve) => probe.close(resolve));
const base = `http://127.0.0.1:${port}`;
const server = spawn(process.execPath, ['Sistema/launcher/server.mjs', '--port', String(port), '--no-prebuild']);
let browser;

async function prepare() {
  await new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('Launcher indisponível')), 15_000);
    server.once('error', (error) => { clearTimeout(timer); reject(error); });
    server.stdout.on('data', (chunk) => {
      if (String(chunk).includes(base)) { clearTimeout(timer); resolve(); }
    });
  });
  if (root) await mkdir(root, { recursive: true });
  const { browser: chromium, gpuMode } = await launchBrowser({ gpu: 'swiftshader' });
  browser = chromium;
  console.log(`Chromium ${browser.version()} · ${gpuMode}`);
  return (await (await fetch(`${base}/api/apps`)).json());
}

function observe(page) {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('response', (response) => {
    if (response.status() >= 400 && !response.url().endsWith('/favicon.ico')) errors.push(`${response.status()} ${response.url()}`);
  });
  page.on('request', (request) => {
    if (/^https?:/.test(request.url()) && new URL(request.url()).origin !== base) errors.push(`Rede externa: ${request.url()}`);
  });
  return errors;
}

async function download(page, press, control) {
  const [file] = await Promise.all([page.waitForEvent('download'), press(control)]);
  assert.equal(await file.failure(), null);
  return readFile(await file.path());
}

async function verifyLayout(page, dimensions) {
  const canvas = page.locator('.wb-stage canvas');
  await canvas.waitFor({ state: 'visible' });
  const rect = await canvas.boundingBox();
  assert.ok(rect && rect.width >= 240 && rect.height >= 180, 'A cena deve ocupar uma área utilizável.');
  assert.ok(rect.x >= -1 && rect.y >= -1 && rect.x + rect.width <= dimensions.width + 1 && rect.y + rect.height <= dimensions.height + 1);
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'A página não pode ter rolagem horizontal.');
}

async function verifyGame(app, slug, label, viewport, play) {
  const mobile = label !== 'desktop';
  const page = await browser.newPage({ viewport, isMobile: mobile, hasTouch: mobile, acceptDownloads: true });
  page.setDefaultTimeout(20_000);
  const errors = observe(page);
  const press = (locator) => mobile ? locator.tap() : locator.click();
  try {
    const response = await page.goto(base + app.url);
    assert.equal(response.status(), 200);
    await page.getByRole('heading', { level: 1, name: app.name }).waitFor();
    await verifyLayout(page, viewport);
    if (root && label === 'desktop') {
      await page.locator('.wb-stage').screenshot({ path: path.join(root, `${slug}-capa.jpg`), type: 'jpeg', quality: 83, timeout: 45_000 });
    }
    await play(page, press);
    const pause = page.locator('.wb-pause');
    await press(pause);
    assert.equal(await pause.getAttribute('aria-pressed'), 'true');
    await page.getByText('Experiência pausada', { exact: true }).waitFor();
    await press(pause);
    assert.equal(await pause.getAttribute('aria-pressed'), 'false');
    await press(page.getByRole('button', { name: 'Menu', exact: true }));
    await page.getByRole('dialog', { name: 'Menu da experiência' }).waitFor();
    if (!mobile) await page.getByLabel('Qualidade gráfica').selectOption('low');
    await press(page.getByRole('button', { name: 'Fechar menu' }));
    if (root) await page.screenshot({ path: path.join(root, `${slug}-${label}.jpg`), type: 'jpeg', quality: 86, timeout: 45_000 });
    if (label === 'desktop') {
      await page.evaluate(() => window.postMessage({ type: 'SANGI_APP_PAUSE' }, location.origin));
      await page.getByText('Experiência pausada', { exact: true }).waitFor();
      await page.evaluate(() => window.postMessage({ type: 'SANGI_APP_RESUME' }, location.origin));
      await page.getByText('Experiência pausada', { exact: true }).waitFor({ state: 'hidden' });
    }
    assert.deepEqual(errors, []);
    console.log(`OK ${app.name} · ${label} ${viewport.width}×${viewport.height}`);
  } finally {
    await page.close();
  }
}

async function verifyEmbedded(app) {
  const page = await browser.newPage({ viewport: dimensions.retrato, isMobile: true, hasTouch: true });
  try {
    await page.goto(`${base}/#play=${app.id}`);
    const frame = page.frameLocator('iframe.player-frame');
    await frame.locator('.wb-stage canvas').waitFor({ state: 'visible' });
    await frame.getByRole('link', { name: 'Voltar ao catálogo' }).tap();
    await page.locator('#playerModal').waitFor({ state: 'hidden' });
    console.log(`OK ${app.name} · abrir e voltar pelo launcher`);
  } finally {
    await page.close();
  }
}

async function verifyReleaseCards(apps) {
  const page = await browser.newPage({ viewport: dimensions.desktop });
  try {
    await page.goto(base + '/');
    await page.getByRole('button', { name: 'Lançamentos', exact: true }).click();
    for (const filter of ['Todos', 'Novos']) {
      await page.locator('#releaseFilters').getByRole('button', { name: filter, exact: true }).click();
      for (const slug of Object.keys(games)) {
        const app = apps.find(({ id }) => id.endsWith(`-${slug}-index-html`));
        assert.ok(app, `Entrada ausente para ${slug}`);
        await page.locator('#list').getByRole('heading', { name: app.name, exact: true }).waitFor({ timeout: 5000 });
      }
    }
    console.log('OK Lançamentos · os três jogos em Todos e Novos');
  } finally {
    await page.close();
  }
}

try {
  const apps = await prepare();
  if (!selected) await verifyReleaseCards(apps);
  for (const [slug, play] of Object.entries(games)) {
    if (selected && selected !== slug) continue;
    const app = apps.find(({ id }) => id.endsWith(`-${slug}-index-html`));
    assert.ok(app, `Entrada ausente para ${slug}`);
    for (const [label, viewport] of Object.entries(dimensions)) {
      if (!profile || profile === label) await verifyGame(app, slug, label, viewport, play);
    }
    if (!profile) await verifyEmbedded(app);
  }
} finally {
  await browser?.close();
  server.kill();
}
