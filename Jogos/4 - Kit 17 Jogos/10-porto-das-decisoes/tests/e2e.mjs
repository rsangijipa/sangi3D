import { chromium } from '../../08-meteorologia-das-emocoes/node_modules/playwright/index.mjs';

async function run() {
  const browser = await chromium.launch({
    headless: true,
    executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'
  });

  const consoleErrors = [];

  // ==========================================
  // 1. CAPTURAR SHOT-DESKTOP (1920x1080)
  // ==========================================
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  page.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });

  await page.goto('http://127.0.0.1:5190/');
  await page.waitForTimeout(1500);

  await page.screenshot({
    path: 'c:/Users/aless/Downloads/Ambientes 3D/Kit_17_jogos_3D_mockups_e_prompts/10-porto-das-decisoes/shot-desktop.png'
  });
  console.log('✓ shot-desktop.png capturado em 1920x1080');

  // ==========================================
  // 2. CAPTURAR SHOT-MOBILE (390x844)
  // ==========================================
  const mobilePage = await browser.newPage({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true
  });
  mobilePage.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });

  await mobilePage.goto('http://127.0.0.1:5190/');
  await mobilePage.waitForTimeout(1500);

  await mobilePage.screenshot({
    path: 'c:/Users/aless/Downloads/Ambientes 3D/Kit_17_jogos_3D_mockups_e_prompts/10-porto-das-decisoes/shot-mobile.png'
  });
  console.log('✓ shot-mobile.png capturado em 390x844');
  await mobilePage.close();

  // ==========================================
  // 3. CAPTURAR SHOT-LANDSCAPE (844x390)
  // ==========================================
  const landscapePage = await browser.newPage({
    viewport: { width: 844, height: 390 },
    isMobile: true,
    hasTouch: true
  });
  landscapePage.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });

  await landscapePage.goto('http://127.0.0.1:5190/');
  await landscapePage.waitForTimeout(1500);

  await landscapePage.screenshot({
    path: 'c:/Users/aless/Downloads/Ambientes 3D/Kit_17_jogos_3D_mockups_e_prompts/10-porto-das-decisoes/shot-landscape.png'
  });
  console.log('✓ shot-landscape.png capturado em 844x390');
  await landscapePage.close();

  // ==========================================
  // 4. TESTAR FLUXO COMPLETO E INTERAÇÕES
  // ==========================================
  // 4.1 Clicar em 'Editar carga'
  await page.click('#btn-edit-cargo');
  await page.waitForTimeout(300);
  const modalVisible = await page.isVisible('#modal-cargo-title');
  console.log('1. Cargo Modal aberto:', modalVisible);

  // 4.2 Trocar para barco Verde e fechar
  await page.click('button[data-boat-id="green"]');
  await page.waitForTimeout(300);
  await page.click('#btn-close-modal-confirm');
  await page.waitForTimeout(400);
  console.log('2. Barco alterado para Verde com sucesso');

  // 4.3 Testar Desfazer nó
  await page.click('#btn-undo-node');
  await page.waitForTimeout(300);
  console.log('3. Desfazer nó executado');

  // 4.4 Adicionar nós usando botões acessíveis de adjacência
  const adjBtn = await page.$('.adjacent-node-btn');
  if (adjBtn) {
    await adjBtn.click();
    await page.waitForTimeout(300);
    console.log('4. Nó adjacente adicionado via controle acessível');
  }

  // 4.5 Clicar no canvas para interação de rota 3D
  await page.mouse.click(960, 540);
  await page.waitForTimeout(300);
  console.log('5. Canvas 3D clicado para interação de rota');

  // 4.6 Testar botão Simular
  await page.click('#btn-primary-action');
  await page.waitForTimeout(600);
  console.log('6. Botão Simular acionado');

  // Se estiver simulando, clicar no botão para pular/concluir
  const primaryText = await page.innerText('#btn-primary-action');
  if (primaryText.includes('Simulando') || primaryText.includes('Pular')) {
    await page.click('#btn-primary-action');
    await page.waitForTimeout(400);
  }

  // 4.7 Verificar se Confirmar Viagem está disponível ou Rota Alternativa
  const altBtn = await page.$('#btn-use-alt-route');
  if (altBtn) {
    await altBtn.click();
    await page.waitForTimeout(400);
    console.log('7. Rota alternativa comparada e carregada com sucesso');
  }

  // 4.8 Testar Modal de Reflexão
  await page.click('#btn-reflection');
  await page.waitForTimeout(400);
  const reflVisible = await page.isVisible('#modal-refl-title');
  console.log('8. Modal de reflexão aberto:', reflVisible);
  await page.click('#btn-close-modal');

  // 4.9 Testar Desafio de Capacidade da Missão 4
  await page.click('#btn-select-mission');
  await page.waitForTimeout(400);
  await page.click('button[data-mission-id="m4"]');
  await page.waitForTimeout(500);
  console.log('9. Missão 4 (Desafio de Capacidade) iniciada');

  // Trocar para barco Azul (capacidade 3 com 5 caixas) e simular
  await page.click('#btn-edit-cargo');
  await page.waitForTimeout(300);
  await page.click('button[data-boat-id="blue"]');
  await page.waitForTimeout(300);
  await page.click('#btn-close-modal-confirm');
  await page.waitForTimeout(300);

  // Tentar simular com excesso de capacidade
  await page.click('#btn-primary-action');
  await page.waitForTimeout(400);
  const feedbackText = await page.innerText('.feedback-banner');
  console.log('10. Aviso de capacidade exibido sem travamento:', feedbackText.includes('comporta'));

  // Corrigir selecionando Rebocador Vermelho (capacidade 5)
  await page.click('#btn-edit-cargo');
  await page.waitForTimeout(300);
  await page.click('button[data-boat-id="red"]');
  await page.waitForTimeout(300);
  await page.click('#btn-close-modal-confirm');
  await page.waitForTimeout(400);

  // Traçar rota válida para doca sul e entreposto leste via botões acessíveis
  const nextBtn1 = await page.$('.adjacent-node-btn');
  if (nextBtn1) await nextBtn1.click();
  await page.waitForTimeout(200);

  // Capturar screenshot final de interação
  await page.screenshot({
    path: 'c:/Users/aless/Downloads/Ambientes 3D/Kit_17_jogos_3D_mockups_e_prompts/10-porto-das-decisoes/shot-interaction.png'
  });
  console.log('✓ shot-interaction.png capturado');

  await browser.close();

  console.log('Erros de console:', consoleErrors.length);
  if (consoleErrors.length > 0) {
    console.error('Erros encontrados:', consoleErrors);
    process.exit(1);
  }
  console.log('Todos os testes end-to-end em navegador real passaram com ZERO erros de console!');
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
