import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { createServer } from 'node:net';
import { fileURLToPath } from 'node:url';
import { launchBrowser } from '../../../Sistema/test/lib/playwright-resolver.mjs';
import { SIDE, STORAGE_KEY } from './model.js';

const root = fileURLToPath(new URL('../../../', import.meta.url));
const listener = createServer().listen(0, '127.0.0.1');
await once(listener, 'listening');
const { port } = listener.address();
await new Promise((resolve) => listener.close(resolve));
const base = `http://127.0.0.1:${port}`;
const server = spawn(process.execPath, ['Sistema/launcher/server.mjs', '--port', String(port), '--no-prebuild'], { cwd: root });

let browser;
try {
  await new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('Launcher indisponível.')), 15_000);
    server.once('error', reject);
    server.stdout.on('data', (chunk) => {
      if (!String(chunk).includes(base)) return;
      clearTimeout(timer);
      resolve();
    });
  });
  ({ browser } = await launchBrowser({ gpu: 'swiftshader' }));
  const viewports = [
    { width: 1440, height: 900 },
    { width: 390, height: 844 },
    { width: 844, height: 390 },
  ];
  for (const viewport of viewports) {
    const isMobile = viewport.width < 1000;
    const page = await browser.newPage({ viewport, isMobile, hasTouch: isMobile });
    const press = (control) => isMobile ? control.tap({ timeout: 4000 }) : control.click({ timeout: 4000 });
    const board = () => page.evaluate((key) => JSON.parse(localStorage.getItem(key)), STORAGE_KEY);
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    try {
      await page.goto(`${base}/Jogos/1%20-%20Jogos%20HTML/oficina-de-mosaicos/index.html`);
      await page.locator('#mosaic-preset').selectOption('livre');
      const before = await board();
      const start = page.getByRole('button', { name: 'Começar guia' });
      const canvas = page.locator('.mosaic-canvas');
      await press(start);
      assert.deepEqual(await board(), before, 'Abrir o guia preserva a obra');
      await press(page.getByRole('button', { name: 'Sair do guia' }));
      assert.deepEqual(await board(), before, 'Sair sem editar preserva a obra');
      await press(start);

      if (isMobile) await press(page.getByRole('button', { name: 'Assentar peça' }));
      else {
        await canvas.focus();
        await canvas.press('Enter');
      }
      const cell = Math.floor(SIDE * SIDE / 2);
      const placed = await board();
      assert.equal(placed.tiles.filter(Boolean).length, 1);
      assert.equal(placed.tiles[cell].angle, 0);

      if (isMobile) {
        const { width, height } = await canvas.boundingBox();
        await canvas.tap({ position: { x: width / 2, y: height / 2 } });
      } else await press(page.getByRole('button', { name: 'Girar peça 45°' }));
      assert.equal((await board()).tiles[cell].angle, 45);
      await press(page.getByRole('button', { name: 'Aplicar rejunte' }));
      assert.equal((await board()).filled[cell], true);
      assert.equal(await canvas.getAttribute('data-orbit'), 'true');
      await press(page.getByRole('button', { name: 'Concluir guia' }));
      assert.equal(await start.isVisible(), true);
      assert.equal(await canvas.getAttribute('data-orbit'), 'false');
      await press(page.getByRole('button', { name: /Desfazer/ }));
      assert.equal((await board()).filled[cell], false);
      await press(page.getByRole('button', { name: /Refazer/ }));
      assert.equal((await board()).filled[cell], true);
      assert.deepEqual(errors, []);
      console.log(`OK guia de mosaicos · ${viewport.width}×${viewport.height}`);
    } finally {
      await page.close();
    }
  }
} finally {
  await browser?.close();
  server.kill();
}
