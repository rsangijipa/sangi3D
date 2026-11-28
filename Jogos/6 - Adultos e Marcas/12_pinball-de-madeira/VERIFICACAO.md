# Verificação do Pinball de Madeira

## Jogo e controles

Quatro testes de regras e física passaram. Eles cobrem carga do êmbolo, saída do canal, flippers cinemáticos, pontuação por colisão, entrada e retorno da rampa, dreno, terceira bola e modo relax.

O jogo foi testado no Chromium com Playwright em 1440×810, 1280×720, 390×844, 360×640 e 844×390. Foram verificados lançamento pelo ângulo do êmbolo, toque e teclado, troca de marca e de materiais 3D, fim da rodada, reinício, perda de contexto WebGL, fallback jogável, arquivo aberto diretamente do disco com a rede bloqueada e o evento do CTA no iframe. O fluxo principal não apresentou erros no console nem requisições HTTP a serviços externos. A versão testada do Rapier emite um aviso de depreciação na própria inicialização e conclui o carregamento.

## Capturas

- [Desktop inicial](capturas/desktop-inicial.png)
- [Desktop com bola em jogo](capturas/desktop-interacao.png)
- [Celular](capturas/celular.png)
- [Comparação com o mockup](capturas/comparacao-desktop.png)

A composição mantém título e passos à esquerda, letreiro, marchetaria, canais, bumpers e latão à direita, além do dock no rodapé. A mesa e os materiais são procedurais, com enquadramento um pouco mais aberto que a referência. A pontuação dinâmica ocupa o painel superior direito e o letreiro. O texto dos passos reflete as regras da rodada.

## Desempenho

O HTML autocontido tem cerca de 3,50 MB. A Intel UHD foi identificada pelo Chromium via ANGLE Direct3D 11. Cada valor é uma média de oito renderizações com sincronização por `readPixels`. O perfil móvel foi emulado no notebook. Um teste em celular físico segue pendente.

| Perfil | Chamadas | Triângulos | Tempo médio |
| --- | ---: | ---: | ---: |
| 1280×720 · Equilibrada | 83 | 53.644 | 15,7 ms |
| 1280×720 · Alta | 83 | 53.644 | 25,1 ms |
| 390×844 · Equilibrada | 83 | 53.644 | 10,1 ms |
| 390×844 · Leve | 83 | 53.644 | 12,6 ms |

Veja os [dados brutos](capturas/medicoes.json) para os outros enquadramentos.

## Demonstração

O [MP4](demonstracao/pinball-de-madeira-demo.mp4) foi renderizado no HyperFrames em 1280×720, 24 fps, com 12 segundos de duração, vídeo H.264 e som AAC. Os efeitos sonoros da mesa foram gravados no navegador. Os quadros inspecionados mostram [abertura](capturas/video-abertura.png), [interação](capturas/video-interacao.png) e [celular](capturas/video-celular.png).

A checagem HyperFrames passou em seis amostras, com zero erros de runtime, layout e movimento. Os 15 testes de contraste passaram. Os quatro avisos de lint descrevem a organização das faixas e dos grupos em subcomposições. O [log](capturas/check-video.txt) mantém a saída completa da checagem.

