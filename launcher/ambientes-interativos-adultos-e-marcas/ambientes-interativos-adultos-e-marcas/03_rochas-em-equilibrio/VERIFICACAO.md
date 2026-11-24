# Relatório de Verificação e Performance — 03. Rochas em Equilíbrio

Data da Verificação: 24 de Novembro de 2026  
Ambiente: Node.js v22.14.0, Three.js r160, Playwright Chromium Headless, Windows 11  
Arquivo Testado: [`rochas-em-equilibrio.html`](file:///c:/Users/aless/Downloads/Ambientes%203D/ambientes-interativos-adultos-e-marcas/ambientes-interativos-adultos-e-marcas/03_rochas-em-equilibrio/rochas-em-equilibrio.html)

---

## 📊 1. Resumo Executivo das Métricas

Os testes automatizados foram executados em ambiente isolado via [`scripts/verify.mjs`](file:///c:/Users/aless/Downloads/Ambientes%203D/ambientes-interativos-adultos-e-marcas/ambientes-interativos-adultos-e-marcas/03_rochas-em-equilibrio/scripts/verify.mjs) e registraram os seguintes resultados em [`capturas/medicoes.json`](file:///c:/Users/aless/Downloads/Ambientes%203D/ambientes-interativos-adultos-e-marcas/ambientes-interativos-adultos-e-marcas/03_rochas-em-equilibrio/capturas/medicoes.json):

| Métrica | Valor Obtido | Limite / Meta | Status |
| :--- | :---: | :---: | :---: |
| **Draw Calls por Quadro** | **16** | $\le 50$ | ✅ Aprovado com Folga |
| **Total de Triângulos** | **79.234** | $\le 120.000$ | ✅ Aprovado (Equilíbrio visual/peso) |
| **Taxa de Quadros (FPS)** | **60 FPS** | $\ge 60\text{ FPS}$ | ✅ Aprovado (Suavidade garantida) |
| **Tempo de Inicialização** | **310 ms** | $\le 1500\text{ ms}$ | ✅ Aprovado (Zero assets remotos) |
| **Tamanho do Arquivo Final** | **690 KB** | $\le 2000\text{ KB}$ | ✅ Aprovado (Single file autocontido) |
| **Falhas no Console / Erros** | **0** | $0$ | ✅ Aprovado |

---

## 🔍 2. Verificação de Casos de Teste Automatizados

A suíte de testes de ponta a ponta avaliou 8 cenários obrigatórios especificados no padrão do projeto:

### 1. Manifesto de Cena 3D (`SCENE_MANIFEST`)
- Verificação de nós no grafo de cena via asserções automáticas:
  - `rocha_base`: Presente e ancorada no leito do rio.
  - `rochas_empilhaveis` (6 rochas): `rocha_1` a `rocha_6` instanciadas com geometrias convexas deformadas por ruído orgânico.
  - `superficie_rio`: Malha de água translúcida com textura dinâmica de ondas.
  - `terreno_rio`: Vale fluvial de 38m x 34m com depressão de leito de rio.
  - `seixos_leito`: 280 seixos instanciados via `InstancedMesh` para enriquecimento do fundo d'água com draw call unitário.
  - `bambuzal`: 140 colmos e copas instanciados criando o cenário de fundo denso e acolhedor.
  - `sol_manha`: Luz direcional com sombras suaves configuradas.
  - `luz_ambiente`: Luz hemisférica para preenchimento celeste suave.
  - `ponto_equilibrio`: Indicador luminoso ativado durante a manipulação da pedra.
- **Resultado**: `14/14` objetos verificados com asserções válidas (`100% OK`).

### 2. Visão Inicial Desktop (1920x1080)
- Canvas webgl ocupa a viewport total sem transbordamento ou barras de rolagem.
- Título editorial "CASA SEIXO YOGA E TERAPIA" e subtítulo "Rochas em Equilíbrio" renderizados com tipografia Lora/Nunito Sans nítida e sombra legível contra a folhagem.
- Card de passos lateral ("1. Escolha a pedra", "2. Encontre o centro", "3. Respire e apoie") renderizado com vidro fosco linho.
- Dock inferior com 6 miniaturas de pedras e botões de atalho visíveis e acessíveis.
- **Artefato gerado**: [`capturas/desktop-inicial.png`](file:///c:/Users/aless/Downloads/Ambientes%203D/ambientes-interativos-adultos-e-marcas/ambientes-interativos-adultos-e-marcas/03_rochas-em-equilibrio/capturas/desktop-inicial.png)

### 3. Interação & Empilhamento Estável de Pedras
- Seleção da primeira pedra no dock ou leito fluvial.
- Elevação e posicionamento sobre a `rocha_base`.
- Ativação do anel de contato verde e do badge de estado `"Estável"`.
- Deposição da pedra: cálculo de centro de massa confirma repouso seguro, incrementando o contador da torre para `"1/6 rochas equilibradas"`.
- Emissão de impacto acústico sutil simulado com envelope de amortecimento cerâmico/mineral.
- **Artefato gerado**: [`capturas/desktop-interacao.png`](file:///c:/Users/aless/Downloads/Ambientes%203D/ambientes-interativos-adultos-e-marcas/ambientes-interativos-adultos-e-marcas/03_rochas-em-equilibrio/capturas/desktop-interacao.png)

### 4. Responsividade Mobile (390x844 — Proporção 9:19.5)
- Layout adaptativo: card de passos colapsado em pílula superior compacta para não obstruir o espaço 3D de empilhamento.
- Alvos de toque móveis com dimensão mínima de 44x44px.
- Dock inferior com rolagem horizontal suave permitindo seleção por polegar.
- Câmera móvel ajustada automaticamente via `aspect ratio` para manter o leito fluvial e a torre centralizados.
- **Artefato gerado**: [`capturas/celular.png`](file:///c:/Users/aless/Downloads/Ambientes%203D/ambientes-interativos-adultos-e-marcas/ambientes-interativos-adultos-e-marcas/03_rochas-em-equilibrio/capturas/celular.png)

### 5. Reinicialização Contemplativa (`R` / Botão Recomeçar)
- Pressionamento da tecla `R` ou clique no botão de recomeço: a torre é desfeita suavemente sem telas punitivas de derrota.
- Todas as pedras retornam ao berço natural à beira do leito do rio.
- Contador é redefinido para `"0/6 rochas equilibradas"`.

### 6. Modo Iframe / Incorporação (`?embed=1`)
- Ocultação automática de barras de navegação externas, cabeçalho institucional e rodapés.
- Disparo de evento `postMessage` (`{ tipo: 'cta', acao: 'agendamento' }`) verificado com sucesso pelo ouvinte da janela-mãe.

### 7. Reskin e Troca de Marca em Tempo Real
- Execução de `window.setPresetMarca('neutro')`:
  - Variáveis CSS `--cor-fundo`, `--cor-primaria` e `--cor-acento` atualizadas instantaneamente.
  - Cores dos indicadores 3D ajustadas em conformidade com o novo tema cromático.
- Retorno para `window.setPresetMarca('casaSeixo')` restaura a identidade da Casa Seixo sem recarregar a página.

### 8. Filosofia Zen & Áudio Seguro
- Verificação do nó limitador do Web Audio API com teto estrito em `-24 dBFS`.
- Sincronização do ciclo de respiração de 10 segundos com as oscilações cáusticas da água.

---

## 📸 3. Galeria de Capturas de Verificação

1. **Visão Inicial Desktop**:
   ![Visão Inicial Desktop](capturas/desktop-inicial.png)

2. **Interação de Empilhamento e Indicadores de Equilíbrio**:
   ![Interação de Empilhamento](capturas/desktop-interacao.png)

3. **Visão Móvel (Smartphone)**:
   ![Visão Móvel](capturas/celular.png)

---

## 🏆 4. Conclusão da Avaliação

O ambiente **03. Rochas em Equilíbrio** atende plenamente a todos os requisitos arquiteturais, de design e de experiência estipulados no briefing:
- O arquivo [`rochas-em-equilibrio.html`](file:///c:/Users/aless/Downloads/Ambientes%203D/ambientes-interativos-adultos-e-marcas/ambientes-interativos-adultos-e-marcas/03_rochas-em-equilibrio/rochas-em-equilibrio.html) é 100% autossuficiente e funciona perfeitamente sem necessidade de build ou rede.
- Os draw calls foram mantidos em 16 (abaixo de um terço do teto permitido de 50).
- A atmosfera visual alcançou alta fidelidade com iluminação matinal, água límpida, cáusticas dinâmicas e vegetação densa de bambuzal.
