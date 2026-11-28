# Relatório de Testes — 095 Vale dos Vaga-lumes

- **Ambiente**: Chromium Headless (Playwright, WebGL com ANGLE SwiftShader em rasterização por software) sobre servidor HTTP local offline (zero requisições externas).
- **Rede externa**: 0 requisições externas (`externalRequests: []`, rotas externas abortadas).

## Desempenho e Viewports Validados

| Viewport | Canvas (px) | Draw Calls | Triângulos | FPS Observado (SwiftShader) | Erros |
| --- | --- | --- | --- | --- | --- |
| `1440 × 900` (Desktop) | `1440 × 900` | `80` | `88.198` | `2.1` (SW WebGL inicial) | `0` |
| `390 × 844` (Mobile Retrato) | `351 × 759` | `56` | `67.834` | `8.9` (SW WebGL) | `0` |
| `844 × 390` (Mobile Paisagem) | `759 × 351` | `72` | `69.778` | `6.4` (SW WebGL) | `0` |

> Nota: Os valores de FPS acima refletem rasterização por software (`ANGLE SwiftShader`) em ambiente headless sem GPU dedicada; a meta de 60 FPS desktop / 30 FPS mobile é proposta para hardware com aceleração WebGL e não foi medida em dispositivo físico neste ciclo.

## Testes Funcionais Obrigatórios

- **T01 (Densidade altera contagem visível)**: **Aprovado** — `drawRange.count` do sistema `THREE.Points` alterou de `220` para `350` e `40` ao mover o controle `#ctrl-density`.
- **T02 (Movimento Reduzido elimina cintilação rápida)**: **Aprovado** — Ao marcar `#ctrl-reduced`, `starUniforms.uTwinkle` foi zerado (`0`) e a variação de brilho dos vaga-lumes caiu para `0` (`spread: 0`).
- **T03 (Fotografia preserva cena)**: **Aprovado** — A ferramenta `Fotografia` disparou renderização imediata, gerou PNG (`data:image/png`) não vazio e salvou o registro com miniatura no Diário de Padrões (`photosTaken: 1`).
- **T-UX (Ferramentas & caminhada)**: **Aprovado** — Alternância das ferramentas do dock (`Brilho`, `Hora` para `25.5` / `01:30`, `Som`, `Fotografia`) e movimentação por teclado `WASD` sem conflitos com a câmera.
- **T-STATE (Ciclo SangiBridge PAUSE/RESUME/MUTE/RESET)**: **Aprovado** — `simTime` congelou em `7.3287` durante `PAUSE`, avançou para `7.4287` em `RESUME`, silenciou em `MUTE` (`muted: true`) e retornou deterministicamente à densidade `220` em `RESET`.
- **T-RENDER (Resize, orientação & DISPOSE)**: **Aprovado** — Redimensionamento dinâmico para `844 × 390` (`canvasW: 759`) e `DISPOSE` final com `errCount: 0`.
