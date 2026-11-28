# Relatório de Testes — Universo de uma Gota 2.0

Execução em 28 de novembro de 2026 no Windows com Node.js v26.5.0, Chromium (Playwright) e renderização por software SwiftShader.

## Testes Computacionais (Node `--test`)

| Suíte | Resultado | Cobertura |
| --- | --- | --- |
| `simulation.test.mjs` | 3/3 aprovados | Contenção 15 min (T01), atração/ingestão de alimento (T03), determinismo e reinicialização (T-STATE). |
| `tests/organisms.test.mjs` | 3/3 aprovados | 20 organismos com anatomia e referências válidas, 10 amostras coerentes e 5 modalidades ópticas. |
| `tests/ecosystem.test.mjs` | 4/4 aprovados | Simulação longa (10 min / 36.000 passos) sem NaN, contenção X/Y/Z, teto populacional, conservação de área em pseudópodes da ameba, determinismo por seed e formação de vacúolo alimentar. |

## Testes de Navegador (`tests/browser.test.mjs`)

- Viewports verificados: `1440×900` (desktop), `390×844` (retrato móvel), `844×390` (paisagem móvel), `360×640` (mobile compacto) e `1920×1080` (Full HD).
- Fluxos verificados: renderização WebGL 2 sem erros de página ou console, ausência de rolagem horizontal, identificação de organismos no catálogo (`1 / 20`), troca de objetivas, alternância entre as 5 modalidades ópticas, troca de amostra, modos Anatomia / Ecossistema / Ferramentas e exportação de fotografia PNG.
- Capturas geradas: `capturas/desktop.jpg`, `capturas/retrato.jpg`, `capturas/paisagem.jpg` e `miniatura.jpg`.

## Limitações conhecidas

- Os testes automatizados de navegador rodaram em SwiftShader (software rendering), não representando medição de FPS sustentado em hardware móvel físico Android/iOS.
- O teste legado `Sistema/test/sangi-workbenches-browser.mjs` espera a contagem fixa `/^1\s*\/\s*5$/` da versão 1.0, enquanto a versão 2.0 exibe `1 / 20` conforme a expansão do catálogo para 20 organismos.
