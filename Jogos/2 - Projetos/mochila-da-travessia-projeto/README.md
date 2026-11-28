# 19. Mochila da Travessia

**Coleção:** ACT · **Verbo central:** escolher e carregar  
**Versão:** 2.0.0

## Visão geral
Aplicação 3D interativa em WebGL (Three.js r128) ambientada em uma cabana de montanha com mesa de preparação, mochila de lona aberta, janela com montanhas nevadas e 10 assets 3D procedurais PBR (`mochila_com_compartimentos_e_fivelas`, `cantil`, `livro`, `pedra`, `lanterna`, `bussola`, `corda`, `casaco`, `cartoes_semanticos` e `mapa`).

## Como executar
- **Preview imediato:** abra `mochila-da-travessia.html` em servidor HTTP local (ex.: `npx serve .` ou `python3 -m http.server 8080`).
- **Testes automatizados de domínio:** `node tests/run_tests.mjs`

## Estrutura do pacote
- `mochila-da-travessia.html` — Aplicação autocontida pronta para execução em navegador/Canvas.
- `game/content.js` — Catálogo de assets, cenários de viagem, bolsos e modos.
- `game/rules.js` — Motor de estado serializável, grade 3D de ocupação, centro de massa, comandos idempotentes e resumo observável.
- `assets/assets_manifest.json` — Manifesto completo dos assets, dimensões em metros, materiais, colisores e fallbacks.
- `scene/scene.json` — Composição espacial e iluminação da cabana.
- `tests/run_tests.mjs` — Testes automatizados de aceite.
- `credits.md` — Proveniência e licenças.
- `QA_REPORT.md` — Relatório real de verificação e matriz de evidências.

## Upgrade premium (v2.1)
- Pós-processamento HDR estável (RT MSAA HalfFloat, bloom leve, ACES, vinheta, grão) com saneamento de NaN; desligado em "Leve".
- Iluminação baseada em imagem procedural (PMREM), céu com nuvens em shader, poeira no feixe de luz da janela, troncos com casca procedural.
- Clima por viagem (manhã, montanha, rotina, entardecer de inverno) afeta luz, céu, lanterna e áudio.
- Ambiência sonora procedural (vento, estalos da lanterna, pássaros) e acorde ao fechar as fivelas.
- Layout de telefone mais compacto; correção do mapeamento de qualidade vindo do launcher (`HIGH` → Cinema).
