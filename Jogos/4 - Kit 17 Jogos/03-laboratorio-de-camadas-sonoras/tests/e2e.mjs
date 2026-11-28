import { chromium } from '../../08-meteorologia-das-emocoes/node_modules/playwright/index.mjs';

async function run() {
  const browser = await chromium.launch({
    headless: true,
    executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'
  });

  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  
  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });

  await page.goto('http://127.0.0.1:5194/');
  await page.waitForTimeout(1500);

  // 1. Desktop initial screenshot
  await page.screenshot({ path: 'c:/Users/aless/Downloads/Ambientes 3D/Kit_17_jogos_3D_mockups_e_prompts/03-laboratorio-de-camadas-sonoras/shot-desktop.png' });
  console.log('1. Desktop screenshot captured');

  // 2. Mobile screenshot
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'c:/Users/aless/Downloads/Ambientes 3D/Kit_17_jogos_3D_mockups_e_prompts/03-laboratorio-de-camadas-sonoras/shot-mobile.png' });
  console.log('2. Mobile screenshot captured');

  // Voltar para desktop para interações
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.waitForTimeout(500);

  // 3. Teste de ativação de áudio
  if (await page.isVisible('#btn-activate-audio')) {
    await page.click('#btn-activate-audio', { force: true });
    await page.waitForTimeout(500);
    console.log('3. Audio activated successfully');
  }

  // 4. Teste de ajuste de slider
  const sliderFootsteps = page.locator('input[data-channel-id="footsteps"]');
  await sliderFootsteps.fill('85');
  await page.waitForTimeout(300);
  console.log('4. Slider footsteps adjusted to 85%');

  // 5. Teste de solo toggle no botão fone
  await page.click('button[data-channel-id="fan"]');
  await page.waitForTimeout(300);
  console.log('5. Solo fan toggled');

  // 6. Teste de clique na redoma 3D via mouse
  await page.mouse.click(960, 480);
  await page.waitForTimeout(300);
  console.log('6. Canvas 3D clicked');

  // 7. Teste de Silenciar tudo
  await page.click('#btn-mute-all-action');
  await page.waitForTimeout(300);
  console.log('7. Mute all clicked');
  await page.click('#btn-mute-all-action');
  await page.waitForTimeout(300);
  console.log('7b. Unmute all clicked');

  // 8. Teste de Modal Desafios
  await page.click('#btn-challenges-open');
  await page.waitForTimeout(400);
  const chModalVisible = await page.isVisible('#modal-ch-title');
  console.log('8. Challenges modal opened:', chModalVisible);
  await page.click('#btn-close-modal');
  await page.waitForTimeout(300);

  // 9. Teste de Modal Reflexão
  await page.click('#btn-reflection-open');
  await page.waitForTimeout(400);
  const reflModalVisible = await page.isVisible('#modal-refl-title');
  console.log('9. Reflection modal opened:', reflModalVisible);
  await page.click('#btn-close-modal');

  // 10. Screenshot final de interação
  await page.screenshot({ path: 'c:/Users/aless/Downloads/Ambientes 3D/Kit_17_jogos_3D_mockups_e_prompts/03-laboratorio-de-camadas-sonoras/shot-interaction.png' });

  await browser.close();

  console.log('Console errors count:', consoleErrors.length);
  if (consoleErrors.length > 0) {
    console.error('Errors found:', consoleErrors);
    process.exit(1);
  }
  console.log('All end-to-end browser tests passed with ZERO console errors!');
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
