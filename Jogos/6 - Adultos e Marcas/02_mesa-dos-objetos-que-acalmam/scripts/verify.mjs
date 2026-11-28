import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { access, mkdir, writeFile } from 'node:fs/promises';
import { chromium } from 'playwright';

const port = Number(process.env.MESA_TEST_PORT || 4422);
const base = 'http://127.0.0.1:' + port;
const server = spawn(process.execPath, ['scripts/serve.mjs'], {
  windowsHide: true,
  env: { ...process.env, MESA_PORT: String(port) },
});

const chromePath = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const output = 'capturas';

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

let browser;

try {
  // 1. Aguardar servidor local inicializar
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

  // 2. Teste Desktop Inicial (1440x810, 16:9)
  const page = await browser.newPage({ viewport: { width: 1440, height: 810 } });
  const consoleErrors = [];
  page.on('console', (msg) => {
    console.log('[CONSOLE ' + msg.type() + ']', msg.text());
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });
  page.on('pageerror', (err) => {
    console.log('[PAGE ERROR]', err.message, err.stack);
    consoleErrors.push(err.message);
  });
  page.on('response', (r) => {
    if (r.status() >= 400) console.warn('[HTTP ' + r.status() + ']', r.url());
  });

  await page.goto(base + '/');
  await page.waitForFunction(() => window.mesaQA);
  await wait(1000); // Aguardar renderização inicial dos materiais PBR

  assert.equal(consoleErrors.length, 0, `Erros encontrados no console: ${consoleErrors.join(', ')}`);
  const initialStats = await page.evaluate(() => window.mesaQA.stats());
  console.log('[Teste] Desktop carregado sem erros. Stats:', initialStats);

  // Captura 1: Desktop Inicial (Mockup 1)
  await page.screenshot({ path: `${output}/desktop-inicial.png` });
  console.log('✓ Captura 1 gerada: capturas/desktop-inicial.png');

  // 3. Teste do Momento de Interação (Mockup 2: Pêndulo desenhando rosáceas na areia, câmera próxima)
  console.log('[Teste] Ativando interação do pêndulo e desenho na areia...');
  await page.evaluate(() => {
    window.mesaQA.setCameraPreset('pendulo');
    window.mesaQA.triggerPendulum(0.18, 0.14, 0.08, -0.04);
  });

  // Aguardar o pêndulo traçar várias voltas de curvas de Lissajous na areia
  await wait(4200);

  // Destacar o passo 4 "Alise a areia" conforme Mockup 2
  await page.evaluate(() => {
    document.querySelectorAll('.passo-item').forEach(p => p.classList.remove('ativo'));
    document.querySelector('#passo-4')?.classList.add('ativo');
  });
  await wait(200);

  // Captura 2: Momento de Interação (desktop)
  await page.screenshot({ path: `${output}/desktop-interacao.png` });
  console.log('✓ Captura 2 gerada: capturas/desktop-interacao.png');

  // 4. Teste de Interação dos outros objetos
  console.log('[Teste] Testando Berço de Newton, Ampulheta Líquida e Tigela...');
  await page.evaluate(() => window.mesaQA.triggerNewton(0, -0.7));
  await wait(400);

  await page.evaluate(() => window.mesaQA.triggerHourglass());
  await wait(400);

  await page.evaluate(() => window.mesaQA.triggerBowl(0.9));
  await wait(400);

  // Testar alisamento da areia pelo rastelo
  console.log('[Teste] Ativando alisamento da areia...');
  await page.evaluate(() => window.mesaQA.triggerRake());
  await wait(800);
  assert.ok(await page.evaluate(() => window.mesaQA.stats().isRaking), 'Rastelo deve estar ativo');
  await wait(1800);

  // 5. Teste Celular Retrato (390x844, 9:19.5 - Mockup 3)
  const mobile = await browser.newPage({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  });

  await mobile.goto(base + '/');
  await mobile.waitForFunction(() => window.mesaQA);
  await wait(1000);

  // Captura 3: Celular
  await mobile.screenshot({ path: `${output}/celular.png` });
  console.log('✓ Captura 3 gerada: capturas/celular.png');
  await mobile.close();

  // 6. Teste de Modo Incorporado (?embed=1) e Evento CTA via postMessage
  const embedPage = await browser.newPage({ viewport: { width: 1024, height: 768 } });
  await embedPage.goto(base + '/teste-iframe');
  await wait(600);

  const frame = embedPage.frames().find((f) => f.url().includes('embed=1'));
  assert.ok(frame, 'Iframe incorporado encontrado');

  const postMessageReceived = await embedPage.evaluate(() => {
    return new Promise((resolve) => {
      window.addEventListener('message', (ev) => {
        if (ev.data && ev.data.tipo === 'cta') resolve(true);
      });
      const iframe = document.querySelector('iframe');
      const doc = iframe.contentDocument || iframe.contentWindow.document;
      const btn = doc.querySelector('#btn-cta-nav');
      if (btn) btn.click();
      setTimeout(() => resolve(false), 1200);
    });
  });

  assert.ok(postMessageReceived, 'Iframe deve enviar evento postMessage { tipo: "cta" }');
  console.log('[Teste] Modo incorporado ?embed=1 e postMessage verificados com sucesso');
  await embedPage.close();

  // 7. Teste de Troca de Preset de Marca (Reskin em tempo real)
  await page.evaluate(() => window.mesaQA.setPresetMarca('neutro'));
  await wait(200);
  const corFundoNeutro = await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--cor-fundo').trim());
  assert.equal(corFundoNeutro, '#121416', 'Cor de fundo deve atualizar para o preset neutro');

  await page.evaluate(() => window.mesaQA.setPresetMarca('pontoQuieto'));
  await wait(200);
  const corFundoPonto = await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--cor-fundo').trim());
  assert.equal(corFundoPonto, '#18120d', 'Cor de fundo deve retornar para o preset Ponto Quieto');
  console.log('[Teste] Reskin de marca em tempo de execução validado com sucesso');

  // 8. Coleta de Métricas de Desempenho
  const finalStats = await page.evaluate(() => window.mesaQA.stats());
  const measurements = {
    drawCalls: finalStats.drawCalls,
    triangles: finalStats.triangles,
    fps: finalStats.fps,
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
