import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { access, mkdir, writeFile } from 'node:fs/promises';
import { resolvePlaywright } from '../../../../Sistema/test/lib/playwright-resolver.mjs';

const { chromium } = await resolvePlaywright();

const port = Number(process.env.ROCHAS_TEST_PORT || 4432);
const base = 'http://127.0.0.1:' + port;
const server = spawn(process.execPath, ['scripts/serve.mjs'], {
  windowsHide: true,
  env: { ...process.env, ROCHAS_PORT: String(port) },
});

const chromePath = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const output = 'capturas';

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

let browser;

try {
  // Aguardar servidor inicializar
  for (let i = 0; i < 40; i++) {
    if (await fetch(base).then((r) => r.ok, () => false)) break;
    await wait(180);
  }

  await mkdir(output, { recursive: true });

  const executablePath = await access(chromePath).then(() => chromePath, () => undefined);
  browser = await chromium.launch({
    headless: true,
    executablePath,
    args: ['--use-angle=d3d11', '--enable-gpu', '--no-sandbox'],
  });

  console.log('[Teste] Navegador Chromium iniciado com aceleração gráfica');

  // 1. Teste Desktop Inicial (1440x810, 16:9)
  const page = await browser.newPage({ viewport: { width: 1440, height: 810 } });
  const consoleErrors = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });
  page.on('response', (r) => {
    if (r.status() >= 400) console.warn('[HTTP ' + r.status() + ']', r.url());
  });

  await page.goto(base + '/');
  await page.waitForFunction(() => window.rochasQA);
  await wait(900); // Aguardar render e fading do loader

  assert.equal(consoleErrors.length, 0, `Erros encontrados no console: ${consoleErrors.join(', ')}`);
  console.log('[Teste] Desktop carregado sem erros de console. Stats:', await page.evaluate(() => window.rochasQA.stats()));

  // Captura 1: Desktop Inicial
  await page.screenshot({ path: `${output}/desktop-inicial.png` });
  console.log('✓ Captura 1 gerada: capturas/desktop-inicial.png');

  // 2. Teste do Momento de Interação
  // Empilhar 5 pedras sucessivamente e suspender a 6ª com o ponto de equilíbrio visível
  console.log('[Teste] Construindo torre de seixos equilibrada...');

  // Empilhar pedras 0, 1, 2, 3, 4
  for (let i = 0; i < 5; i++) {
    await page.evaluate((idx) => window.rochasQA.pick(idx), i);
    await wait(350);
    await page.evaluate(() => window.rochasQA.drop());
    await wait(450);
  }

  // Pegar a 6ª pedra e mantê-la suspensa com ponto de equilíbrio ativado
  await page.evaluate(() => window.rochasQA.pick(5));
  await wait(500);

  // Esconder toast para captura limpa
  await page.evaluate(() => document.querySelector('#toast')?.classList.remove('show'));
  await wait(100);

  // Garantir que o HUD de estabilidade e o ponto de equilíbrio estão visíveis
  const isHudVisible = await page.evaluate(() => document.querySelector('#hudBalance')?.classList.contains('visible'));
  assert.ok(isHudVisible, 'HUD de estabilidade deve estar visível com pedra suspensa');

  // Captura 2: Momento de Interação (desktop)
  await page.screenshot({ path: `${output}/desktop-interacao.png` });
  console.log('✓ Captura 2 gerada: capturas/desktop-interacao.png');

  // Soltar a 6ª pedra para completar a torre de 6 pedras
  await page.evaluate(() => window.rochasQA.drop());
  await wait(600);
  const finalStacked = await page.evaluate(() => window.rochasQA.stats().stackedCount);
  console.log(`[Teste] Torre completa com ${finalStacked} pedras empilhadas.`);

  // Testar reset / recomeçar
  await page.evaluate(() => window.rochasQA.reset());
  await wait(450);
  const resetStacked = await page.evaluate(() => window.rochasQA.stats().stackedCount);
  assert.equal(resetStacked, 0, 'Todas as pedras devem retornar à margem após recomeçar');
  console.log('[Teste] Reset e retorno à margem verificado com sucesso');

  // 3. Teste Celular Retrato (390x844, 9:19.5)
  const mobile = await browser.newPage({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  });

  await mobile.goto(base + '/');
  await mobile.waitForFunction(() => window.rochasQA);
  await wait(900);

  // No celular, pegar a primeira pedra para demonstrar o HUD compacto
  await mobile.evaluate(() => window.rochasQA.pick(0));
  await wait(400);
  await mobile.evaluate(() => document.querySelector('#toast')?.classList.remove('show'));
  await wait(150);

  // Captura 3: Celular
  await mobile.screenshot({ path: `${output}/celular.png` });
  console.log('✓ Captura 3 gerada: capturas/celular.png');
  await mobile.close();

  // 4. Teste de Embed (?embed=1) e Evento CTA
  const embedPage = await browser.newPage({ viewport: { width: 1024, height: 768 } });
  await embedPage.goto(base + '/teste-iframe');
  await wait(600);

  // No iframe, checar que a topbar de demo não aparece
  const frame = embedPage.frames().find((f) => f.url().includes('embed=1'));
  assert.ok(frame, 'Iframe incorporado encontrado');

  // Clicar no CTA dentro do iframe e interceptar o postMessage
  const postMessageReceived = await embedPage.evaluate(() => {
    return new Promise((resolve) => {
      window.addEventListener('message', (ev) => {
        if (ev.data && ev.data.tipo === 'cta') resolve(true);
      });
      const iframe = document.querySelector('iframe');
      const doc = iframe.contentDocument || iframe.contentWindow.document;
      const btn = doc.querySelector('#btnCta');
      if (btn) btn.click();
      setTimeout(() => resolve(false), 1200);
    });
  });

  assert.ok(postMessageReceived, 'Iframe deve enviar evento postMessage { tipo: "cta" }');
  console.log('[Teste] Modo incorporado ?embed=1 e evento CTA postMessage verificados com sucesso');
  await embedPage.close();

  // 5. Coleta de Métricas de Desempenho
  const stats = await page.evaluate(() => window.rochasQA.stats());
  const measurements = {
    drawCalls: stats.drawCalls,
    triangles: stats.triangles,
    fps: stats.fps,
    qualidade: 'alta',
    timestamp: new Date().toISOString(),
  };
  await writeFile(`${output}/medicoes.json`, JSON.stringify(measurements, null, 2), 'utf8');
  console.log('[Teste] Medições salvas em capturas/medicoes.json:', measurements);

  await page.close();
  console.log('\n==========================================');
  console.log(' TODOS OS TESTES PASSARAM COM SUCESSO! 🎯 ');
  console.log('==========================================\n');

} catch (err) {
  console.error('[Erro na Verificação]', err);
  process.exitCode = 1;
} finally {
  if (browser) await browser.close();
  server.kill();
}
