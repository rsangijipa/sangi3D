# Relatório de Testes — `# 053 — Jardim de Areia`

## 1. Suíte Funcional, Física e UX (`test_jardim.mjs` / Playwright Chromium WebGL)

- **Ambiente**: Chromium headless (`--use-gl=angle --use-angle=swiftshader --enable-webgl`), bloqueio estrito de rede externa (`externalRequests = 0`), servidor local `127.0.0.1`.
- **Desktop (`1440×900`)**:
  - Área ocupada pela HUD: `3.51%` da tela (limite `<= 20%`).
  - Menor alvo tátil ativo: `44px` (`>= 44px`).
  - Painel secundário (`#settings-drawer`): inicia recolhido (`hidden: true`).
  - Telemetria WebGL observada: `138632` triângulos, `297` draw calls, `0` erros de console e `0` erros de página.
- **T01 — Traçado do Rastelo na Direção do Gesto**:
  - `Nivelar` zerou o relevo (`< 0.002m`).
  - Arrasto horizontal criou `741` células escavadas com amplitude medida entre `-0.0254m` e `+0.0335m` (`strokeCount: 2`, `undoDepth: 2`).
- **T02 — Colisão Rastelo-Pedra**:
  - Arrasto sobre a posição da rocha 0 foi bloqueado/desviado (`blockedHits: 5`) mantendo o centro sob a rocha intacto (`centerH: 0.00142m`).
- **T03 — Pilha de Desfazer**:
  - Acionamento de `#btn-undo` restaurou o mapa de altura anterior ao traço (`afterUndoMax: 0.0018m`).
- **T-UX & T-STATE (Largura, Pedra, Contemplação e SangiBridge)**:
  - Alternância de largura `Médio` → `Largo` atualizada na interface (`Largo`).
  - Arrasto da rocha 4 em modo `Pedra` deslocou `0.389m` sem sobreposição.
  - Modo contemplação ocultou e restaurou HUD sem conflito com câmera.
  - Eventos `sangi:pause`, `sangi:resume`, `sangi:mute`, `sangi:reset` e `sangi:dispose` validados com sucesso.
- **Viewports Responsivos (`T-RENDER`)**:
  - Mobile retrato (`390×844`): sem overflow horizontal (`scrollW: 390 / innerW: 390`). Todos os 5 botões superiores visíveis e alinhados sem recorte.
  - Mobile paisagem (`844×390`): sem overflow horizontal (`scrollW: 844 / innerW: 844`).

## 2. Harness Oficial Sangi3D (`Sistema/test/v2-qa-runner.mjs`)

Comando executado:
`node "c:\Users\aless\Downloads\Ambientes 3D\Sistema\test\v2-qa-runner.mjs" --offline --strict-lifecycle --viewports=desktop-1366,mobile-390 --url="/Jogos/1%20-%20Jogos%20HTML/jardim-de-areia/index.html"`

Resultado observado (`1/1 apps aprovados`):
- `desktop-1366`: `fps=29.35 avg=34.08ms p95=41.7ms draws=299 tris=138656 canvas=true err=0`
- `mobile-390`: `fps=71.26 avg=14.03ms p95=16.8ms draws=277.5 tris=139113 canvas=true err=0`
