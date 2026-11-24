import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { access, mkdir, writeFile } from 'node:fs/promises';
import { chromium } from 'playwright';

const port = Number(process.env.PORT || 5174);
const base = `http://127.0.0.1:${port}`;
const chromePath = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const output = 'capturas';

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

let server;
let browser;

try {
  console.log('[E2E] Iniciando servidor Vite...');
  server = spawn(process.execPath, ['./node_modules/vite/bin/vite.js', '--port', String(port), '--host', '127.0.0.1'], {
    windowsHide: true,
    stdio: 'pipe'
  });

  // Aguardar servidor inicializar
  for (let i = 0; i < 40; i++) {
    if (await fetch(base).then(r => r.ok, () => false)) break;
    await wait(200);
  }

  await mkdir(output, { recursive: true });

  const executablePath = await access(chromePath).then(() => chromePath, () => undefined);
  browser = await chromium.launch({
    headless: true,
    executablePath,
    args: ['--use-angle=d3d11', '--enable-gpu', '--no-sandbox']
  });

  console.log('[E2E] Chromium iniciado com aceleração gráfica');

  // 1. Teste Desktop Inicial (1920x1080, 16:9 - Mockup 1)
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });

  await page.goto(base + '/');
  await page.waitForFunction(() => window.trilhaQA);
  await wait(1200); // Aguardar compilação de shaders e render PBR

  assert.equal(consoleErrors.length, 0, `Erros encontrados no console: ${consoleErrors.join(', ')}`);
  const initialStats = await page.evaluate(() => window.trilhaQA.stats());
  console.log('[E2E] Desktop carregado sem erros. Stats:', initialStats);

  // Captura 1: Desktop Inicial (Mockup 1)
  await page.screenshot({ path: `${output}/desktop-inicial.png` });
  console.log('✓ Captura 1 gerada: capturas/desktop-inicial.png');

  // 2. Teste do Momento de Interação (Mockup 2: Personagem interagindo com o Sino Azul)
  console.log('[E2E] Movendo personagem até o Sino Azul e tocando o sino...');
  await page.evaluate(() => {
    window.trilhaQA.triggerTarget('sino_azul');
  });
  await wait(800);

  // Captura 2: Momento de Interação (Mockup 2)
  await page.screenshot({ path: `${output}/desktop-interacao.png` });
  console.log('✓ Captura 2 gerada: capturas/desktop-interacao.png');

  // 3. Teste Celular Retrato (390x844, 9:19.5 - Mockup 3)
  const mobile = await browser.newPage({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true
  });

  await mobile.goto(base + '/');
  await mobile.waitForFunction(() => window.trilhaQA);
  await wait(1000);

  // Captura 3: Celular
  await mobile.screenshot({ path: `${output}/celular.png` });
  console.log('✓ Captura 3 gerada: capturas/celular.png');
  await mobile.close();

  // 4. Teste de Troca de Marca (Reskin em tempo real)
  await page.evaluate(() => window.trilhaQA.setPresetMarca('neutro'));
  await wait(200);
  const corPrimariaNeutro = await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--cor-primaria').trim());
  assert.equal(corPrimariaNeutro, '#2b3036', 'Cor primária deve atualizar para o preset neutro');

  await page.evaluate(() => window.trilhaQA.setPresetMarca('original'));
  await wait(200);
  const corPrimariaOriginal = await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--cor-primaria').trim());
  assert.equal(corPrimariaOriginal, '#365A43', 'Cor primária deve retornar ao original');
  console.log('[E2E] Reskin de marca validado com sucesso');

  // 5. Coleta de Métricas de Desempenho
  const finalStats = await page.evaluate(() => window.trilhaQA.stats());
  const measurements = {
    drawCalls: finalStats.drawCalls,
    triangles: finalStats.triangles,
    fps: finalStats.fps,
    qualidade: 'alta',
    timestamp: new Date().toISOString()
  };
  await writeFile(`${output}/medicoes.json`, JSON.stringify(measurements, null, 2), 'utf8');
  console.log('[E2E] Medições salvas em capturas/medicoes.json:', measurements);

  await page.close();
  console.log('\n==========================================');
  console.log(' TODOS OS TESTES PASSARAM COM SUCESSO! 🎯 ');
  console.log('==========================================\n');

} catch (err) {
  console.error('[Erro nos Testes E2E]', err);
  process.exitCode = 1;
} finally {
  if (browser) await browser.close();
  if (server) server.kill();
}
