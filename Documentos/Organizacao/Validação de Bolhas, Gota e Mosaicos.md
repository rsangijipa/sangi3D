# Validação das três experiências Sangi3D

Em 28 de novembro de 2026, as três experiências foram executadas no Chromium 158.0.8127.37 com ANGLE SwiftShader. O launcher serviu todos os recursos pelo endereço local. A mesma implementação abriu diretamente por HTTP e pela tela do launcher.

| Experiência | Fluxo verificado | Capturas do jogo |
| --- | --- | --- |
| Oficina das Bolhas | Mergulhar, soprar, arrastar o aro, criar bolha gigante, estourar uma bolha por mouse ou toque, pausar, retomar, confirmar reinício e salvar PNG. A simulação foi testada para subida, alteração pelo sopro, fusão, estalos e reinício. | [Desktop](../../Jogos/1%20-%20Jogos%20HTML/oficina-das-bolhas/capturas/desktop.jpg) · [Retrato](../../Jogos/1%20-%20Jogos%20HTML/oficina-das-bolhas/capturas/retrato.jpg) · [Paisagem](../../Jogos/1%20-%20Jogos%20HTML/oficina-das-bolhas/capturas/paisagem.jpg) |
| Universo de uma Gota | Localizar e identificar um organismo, ampliar e baixar uma foto PNG. Os testes de simulação cobrem permanência dentro da gota, reação a alimento e sequência determinística. | [Desktop](../../Jogos/1%20-%20Jogos%20HTML/universo-de-uma-gota/capturas/desktop.jpg) · [Retrato](../../Jogos/1%20-%20Jogos%20HTML/universo-de-uma-gota/capturas/retrato.jpg) · [Paisagem](../../Jogos/1%20-%20Jogos%20HTML/universo-de-uma-gota/capturas/paisagem.jpg) |
| Oficina de Mosaicos | Assentar, rejeitar sobreposição, pintar, girar, cortar, aplicar rejunte, desfazer e refazer. Os testes também conferiram arraste e pinça, restauração após reabertura, JSON exportado e reimportado e PNG da obra. | [Desktop](../../Jogos/1%20-%20Jogos%20HTML/oficina-de-mosaicos/capturas/desktop.jpg) · [Retrato](../../Jogos/1%20-%20Jogos%20HTML/oficina-de-mosaicos/capturas/retrato.jpg) · [Paisagem](../../Jogos/1%20-%20Jogos%20HTML/oficina-de-mosaicos/capturas/paisagem.jpg) |

O teste comum conferiu inicialização do canvas, controles e pausa em desktop 1440 × 900, retrato 390 × 844 e paisagem 844 × 390. O retorno pelo launcher foi testado em retrato. O toque foi emulado no Chromium. As metas de FPS, Safari e aparelhos físicos ficam fora desta rodada. O CLI `game-dev` estava indisponível e as capturas foram obtidas pelo Playwright local.

Os materiais e os modelos foram produzidos em código, usando o Three.js 0.187.0 local. Os efeitos ópticos e a física das bolhas são aproximações. Na Gota, as formas se inspiram em organismos de água doce e a escala é ilustrativa. No Mosaicos, as peças encaixam em células da bancada.

```powershell
node --test Sistema/test/sangi-workbenches.test.mjs
node Sistema/test/sangi-workbenches-browser.mjs
node Sistema/scripts/verify-catalog.mjs
```
