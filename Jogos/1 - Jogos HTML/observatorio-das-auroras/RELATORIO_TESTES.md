# Relatório de Testes — `# 054 — Observatório das Auroras`

## 1. Suíte Funcional, Shaders, Física e UX (`test_observatorio.mjs` / Chromium WebGL)

- **Ambiente**: Chromium headless (`--use-gl=angle --use-angle=swiftshader --enable-webgl`), bloqueio estrito de rede externa (`externalRequests = 0`), servidor HTTP local `127.0.0.1`.
- **Desktop (`1440×900`)**:
  - Área ocupada pela HUD: `4.45%` da viewport (limite `<= 20%`).
  - Menor alvo tátil ativo: `44px` (`>= 44px`).
  - Painel secundário (`#settings-drawer`): inicia recolhido (`hidden: true`).
  - Telemetria WebGL observada: `55688` triângulos, `158` draw calls, `0` erros de console e `0` erros de página.
- **T01 — Intensidade Zero Remove Emissão**:
  - Ajuste de `#pop-intensity-range` para `0%` zerou `uIntensity = 0` e desativou visibilidade das 3 camadas de cortina (`anyLayerVisible: false`), removendo também a emissão e o bounce esmeralda sobre a neve.
- **T02 — Movimento Reduzido Desacelera Simulação**:
  - Comparação de avanço de `curtainPhase` em 12 frames reais: normal `0.1776` vs reduzido `0.0216` (`ratio: 0.121`), confirmando desaceleração efetiva na simulação e nos shaders.
- **T03 — Céu Não Depende da Câmera**:
  - Distância entre `camera.position` e `world.skyGroup.position` medida em `0` após alternar para `Interior` e `Celeste`, mantendo cúpula celeste, `1800` estrelas e cortinas fixos no infinito direcional.
- **T-UX & T-STATE (Ciclo Completo e SangiBridge)**:
  - Troca de formação (`Tempestade Solar`), `Hora` (`00:10` / crepúsculo), `Intensidade` (`92%`), registro de foto em tempo real via `Fotografia` (`photosSaved: 1`) e visualização no `Álbum de Céus`.
  - Alternância entre `Varanda`, `Interior` e `Celeste`, modo `Contemplação`, mais eventos `sangi:pause`, `sangi:resume`, `sangi:mute`, `sangi:reset` e `sangi:dispose` validados sem erros.
- **T-RENDER (Viewports Responsivos)**:
  - Mobile retrato (`390×844`): sem overflow horizontal (`scrollW: 390 / innerW: 390`), botão sair com borda direita em `382px <= 390px`.
  - Mobile paisagem (`844×390`): sem overflow horizontal (`scrollW: 844 / innerW: 844`).

## 2. Harness Oficial Sangi3D (`Sistema/test/v2-qa-runner.mjs`)

Comando executado:
`node "c:\Users\aless\Downloads\Ambientes 3D\Sistema\test\v2-qa-runner.mjs" --offline --strict-lifecycle --viewports=desktop-1366,mobile-390 --url="/Jogos/1%20-%20Jogos%20HTML/observatorio-das-auroras/index.html"`

Resultado observado (`1/1 apps aprovados`):
- `desktop-1366`: `fps=60.1 avg=16.64ms p95=17ms draws=162.1 tris=56093 canvas=true err=0`
- `mobile-390`: `fps=120.21 avg=8.32ms p95=8.5ms draws=142 tris=55456 canvas=true err=0`

## 3. Aproximações Documentadas e Limitações

- As cortinas de aurora e o espectro verde/violeta (`557.7 nm` + faixas N2+) utilizam ruído FBM paramétrico e malhas arqueadas com mistura aditiva, representando uma aproximação artística e não previsão geomagnética física real.
- O ambiente de teste headless utilizou SwiftShader WebGL via ANGLE em desktop simulado (`1366×768`, `1440×900`, `390×844`, `844×390`); validação tátil em hardware móvel físico não foi executada nesta sessão.
