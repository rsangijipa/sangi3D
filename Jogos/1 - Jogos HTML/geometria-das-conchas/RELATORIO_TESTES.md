# Relatório de Testes — `# 025 — Geometria das Conchas`

## 1. Suíte Funcional, Geometria Paramétrica e UX (`test_conchas.mjs` / Chromium WebGL)

- **Ambiente**: Chromium headless (`--use-gl=angle --use-angle=swiftshader --enable-webgl`), bloqueio estrito de rede externa (`externalRequests = 0`), servidor HTTP local `127.0.0.1`.
- **Desktop (`1440×900`)**:
  - Área ocupada pela HUD: `4.72%` da vista (limite `<= 20%`).
  - Menor alvo tátil ativo: `44px` (`>= 44px`).
  - Painel secundário (`#settings-drawer`): inicia fechado (`hidden: true`).
  - Telemetria WebGL observada: `56832` triângulos, `118` draw calls, `0` erros de console e `0` erros de página.
- **T01 — Continuidade da Malha nas Faixas Válidas**:
  - Testada variação extrema de `Espiral` (`4.30` voltas, elevação `0.48`), `Abertura` (`88%`), `Escala` (`1.25x`) e textura `Costelas Radiais`.
  - Resultado: `15231` vértices finitos (`nanCount: 0`), dimensões normalizadas sobre a bancada (`width: 1.64m`, `height: 0.71m`, `depth: 2.37m`, razão `L/P: 0.70`), parede dupla fechada sem buracos.
- **T02 — Corte Anatômico Revela Câmaras**:
  - Modo `Corte`: gerou `39` septos camerais curvos internos no Náutilo inicial e `55` câmaras na espiral expandida.
  - Modo `Inteira`: removeu integralmente os septos de seção (`wholeChambers: 0`), exibindo o exterior calcificado contínuo.
- **T-UX & T-STATE (Catálogo de 3 Formas, Modo Fotografia e SangiBridge)**:
  - Catalogação e comparação lado a lado de `3` formas (`compareCards: 3`) com métricas e restauração em 1 clique.
  - Modo Fotografia testado com Foco, Exposição, alternância acessível `Desfoque DoF` (`dofEnabled: false`), enquadramento `Corte` e captura real (`hasPng: true`).
  - Eventos `sangi:pause`, `sangi:resume`, `sangi:mute`, `sangi:reset` e `sangi:dispose` validados sem erros ou duplicação de loops.
- **T-RENDER (Viewports Responsivos)**:
  - Mobile retrato (`390×844`): sem overflow horizontal (`scrollW: 390 / innerW: 390`, `exitRight: 382 <= 390`).
  - Mobile paisagem (`844×390`): sem overflow horizontal (`scrollW: 844 / innerW: 844`).

## 2. Harness Oficial Sangi3D (`Sistema/test/v2-qa-runner.mjs`)

Comando executado:
`node "c:\Users\aless\Downloads\Ambientes 3D\Sistema\test\v2-qa-runner.mjs" --offline --strict-lifecycle --viewports=desktop-1366,mobile-390 --url="/Jogos/1%20-%20Jogos%20HTML/geometria-das-conchas/index.html"`

Resultado observado (`1/1 apps aprovados`):
- `desktop-1366`: `fps=83.84 avg=11.93ms p95=16.8ms draws=118.6 tris=57103 canvas=true err=0`
- `mobile-390`: `fps=120.27 avg=8.31ms p95=8.5ms draws=111 tris=46900 canvas=true err=0`

## 3. Aproximações Documentadas e Limitações

- A morfologia segue equações de espiral logarítmica normalizadas (modelo de Raup adaptado para bancada contínua), com septos internos curvos paramétricos e iridescência fina PBR (`MeshPhysicalMaterial`) aproximando a madrepérola natural.
- O desfoque seletivo (`DoF`) do Modo Fotografia emprega shader radial centrado configurável em pós-processamento leve (desligável para inspeção), em vez de mapa de profundidade de múltiplos passos pesados para preservar `>= 60 FPS`.
- Testes automatizados executados em Chromium WebGL (SwiftShader/ANGLE) simulando resoluções `1366×768`, `1440×900`, `390×844` e `844×390`.
