import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {createServer} from 'node:net';
import {once} from 'node:events';
import {mkdir, readFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {launchBrowser} from '../../../../Sistema/test/lib/playwright-resolver.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const gameDir = path.resolve(__dirname, '..');
const repoRoot = path.resolve(gameDir, '..', '..', '..');
const captureRoot = process.env.SANGI_GOTA_CAPTURES;

async function freePort() {
  const srv = createServer();
  srv.listen(0, '127.0.0.1');
  await once(srv, 'listening');
  const {port} = srv.address();
  srv.close();
  return port;
}

async function waitReady(url) {
  for (let i = 0; i < 40; i++) {
    try {
      const res = await fetch(url);
      if (res.ok) return;
    } catch {}
    await new Promise((r) => setTimeout(r, 150));
  }
  throw new Error('Servidor não respondeu');
}

const port = await freePort();
const baseUrl = `http://127.0.0.1:${port}`;
const server = spawn(process.execPath, ['Sistema/launcher/server.mjs', '--port', String(port), '--no-prebuild'], {
  cwd: repoRoot,
  stdio: 'ignore',
});
let browser;

try {
  await waitReady(`${baseUrl}/Jogos/1%20-%20Jogos%20HTML/universo-de-uma-gota/index.html`);
  ({browser} = await launchBrowser({gpu: 'swiftshader'}));
  if (captureRoot) await mkdir(captureRoot, {recursive: true});

  const viewports = [
    {name: 'desktop', width: 1440, height: 900, hasTouch: false, capture: 'capturas/desktop.jpg'},
    {name: 'retrato', width: 390, height: 844, hasTouch: true, capture: 'capturas/retrato.jpg'},
    {name: 'paisagem', width: 844, height: 390, hasTouch: true, capture: 'capturas/paisagem.jpg'},
    {name: 'mobile-360', width: 360, height: 640, hasTouch: true},
    {name: 'fullhd', width: 1920, height: 1080, hasTouch: false},
  ];

  for (const vp of viewports) {
    const context = await browser.newContext({viewport: {width: vp.width, height: vp.height}, hasTouch: vp.hasTouch, acceptDownloads: true});
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });

    await page.goto(`${baseUrl}/Jogos/1%20-%20Jogos%20HTML/universo-de-uma-gota/index.html`, {waitUntil: 'networkidle'});
    const canvas = page.locator('.wb-stage canvas');
    await canvas.waitFor({state: 'visible'});

    // Verifica ausência de rolagem horizontal
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
    assert.equal(overflow, false, `Overflow horizontal em ${vp.name}`);

    if (vp.name === 'desktop') {
      // Testa catálogo e identificação
      await page.locator('#gota-catalogo').click();
      await page.locator('#gota-amostras button').first().click();
      assert.match(await page.locator('#gota-descobertos').innerText(), /^1\s*\/\s*20$/);

      // Testa ampliação e objetivas
      await page.locator('#gota-objetivas button').nth(2).click();
      assert.match(await page.locator('#gota-obj-val').innerText(), /20×/);

      // Testa captura de miniatura (campo escuro com organismo selecionado)
      if (captureRoot) await canvas.screenshot({path: path.join(captureRoot, 'miniatura.jpg'), type: 'jpeg', quality: 88});

      // Testa Fotografia PNG
      const [photo] = await Promise.all([page.waitForEvent('download'), page.locator('#gota-foto').click()]);
      assert.equal(photo.suggestedFilename(), 'universo-de-uma-gota-01.png');
      const png = await readFile(await photo.path());
      assert.deepEqual([...png.subarray(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10]);

      // Testa modalidades ópticas
      for (const mode of ['brightfield', 'phase', 'dic', 'fluorescence', 'darkfield']) {
        await page.locator('#gota-modalidade').selectOption(mode);
        await page.waitForTimeout(80);
      }

      // Testa troca de amostra
      await page.locator('#gota-amostra-select').selectOption('musgo');
      assert.match(await page.locator('#gota-sample-pill').innerText(), /Musgo úmido/);

      // Testa Anatomia, Ecossistema e Ferramentas
      await page.locator('.gota-tabs button[data-mode="anatomia"]').click();
      await page.locator('.gota-tabs button[data-mode="ecossistema"]').click();
      await page.locator('#gota-tempo-vel').selectOption('2');
      await page.locator('#gota-tempo-vel').selectOption('1');
      await page.locator('.gota-tabs button[data-mode="pesquisador"]').click();
      await page.locator('#tool-count').click();
      assert.match(await page.locator('#gota-tool-output').innerText(), /Contagem no campo/);
      await page.locator('.gota-tabs button[data-mode="observacao"]').click();

      const guide = page.locator('#gota-guide');
      const next = guide.locator('#gota-guide-next');
      await next.click({timeout: 4000});
      assert.match(await guide.innerText(), /1 de 3/);
      await page.locator('#gota-lab-sample').selectOption('lago');
      await next.click();
      await page.locator('#gota-lab-next').click();
      await page.locator('#gota-lab-next').click();
      await page.locator('#gota-lab-next').click();
      await page.locator('#gota-amostra-select').waitFor();
      assert.equal(await page.locator('#gota-amostra-select').inputValue(), 'lago');
      assert.match(await guide.innerText(), /2 de 3/);

      await next.click();
      await page.locator('#gota-amostras button').first().click();
      const focus = page.locator('#gota-foco');
      await focus.fill('0.4');
      await next.click();
      assert.match(await guide.innerText(), /3 de 3/);
      const note = page.locator('#gota-journal-note');
      await note.fill('Teste do percurso: foco no plano escolhido.');
      let startedDownload = false;
      page.once('download', () => { startedDownload = true; });
      await next.click();
      const card = page.locator('.gota-journal-card').first();
      await card.getByText('Teste do percurso: foco no plano escolhido.').waitFor();
      assert.match(await guide.innerText(), /Percurso concluído/);
      assert.equal(startedDownload, false);
      await page.reload();
      await page.locator('[data-mode="diario"]').click();
      await card.getByText('Teste do percurso: foco no plano escolhido.').waitFor();
      await card.getByRole('button', {name: 'Excluir registro'}).click();
      await card.waitFor({state: 'detached'});
    }

    if (vp.name === 'retrato') {
      const next = page.locator('#gota-guide-next');
      await next.tap();
      await page.locator('#gota-lab-sample').selectOption('musgo');
      await next.tap();
      await page.locator('#gota-lab-skip').tap();
      assert.equal(await page.locator('#gota-amostra-select').inputValue(), 'musgo');
      await page.locator('#gota-guide-exit').tap();
      assert.equal(await next.textContent(), 'Iniciar percurso');
      assert.equal(await page.locator('[data-mode="observacao"]').getAttribute('aria-pressed'), 'true');
    }

    if (captureRoot && vp.capture) {
      await page.screenshot({path: path.join(captureRoot, path.basename(vp.capture)), type: 'jpeg', quality: 86});
    }

    assert.deepEqual(errors, [], `Erros em ${vp.name}: ${errors.join('; ')}`);
    await context.close();
    console.log(`OK ${vp.name} (${vp.width}x${vp.height})`);
  }

} finally {
  await browser?.close();
  server.kill();
}
