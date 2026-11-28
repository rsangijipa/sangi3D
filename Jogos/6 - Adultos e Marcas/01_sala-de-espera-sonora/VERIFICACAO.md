# Verificação da Sala de Espera Sonora

## Ambiente interativo

O fluxo foi executado no Chromium com Playwright em 1440×810, 1280×720, 390×844, 360×640 e 844×390. A verificação cobriu os cinco canais pelo dock e por clique e arrasto no cenário, os controles de volume por teclado, a cortina, o acionamento pela luminária, a subida e a descida da luz durante a pausa e seu encerramento manual ou automático. Foram exercitados o mudo, o recolhimento, a troca de preset gráfico, a troca de marca e a mudança de materiais.

Foram verificados o HTML aberto por `file://` com o navegador offline, a perda de contexto WebGL com continuidade pelo dock e o iframe com `?embed=1` emitindo o evento do CTA. O fluxo principal passou sem erros de console e sem requisições HTTP externas. O HTML final mede aproximadamente 1,28 MB sem compressão de transferência.

## Capturas e comparação

- [Desktop inicial](capturas/desktop-inicial.png)
- [Desktop com canais ativos e pausa guiada](capturas/desktop-interacao.png)
- [Celular em 390×844](capturas/celular.png)
- [Comparação com o mockup fornecido](capturas/comparacao-desktop.png)

A composição mantém a lareira e o aparador à esquerda, a janela entre as duas áreas e a poltrona com a luminária à direita. A interface mantém o título editorial, a navegação, o cartão de passos e o dock. No celular, o enquadramento aproxima a poltrona e os controles ocupam duas linhas para ter espaço de toque. A cena em tempo real tem materiais e silhuetas procedurais. A chama, a trama do veludo e as folhas têm acabamento mais estilizado que o da referência.

## Medições

Medições no notebook com Intel UHD Graphics, via ANGLE Direct3D 11. A média usa dez renderizações sincronizadas por `readPixels`. As contagens são do passe da cena. Os números refletem enquadramentos e estados de interação específicos.

| Perfil | Chamadas | Triângulos | Tempo médio |
| --- | ---: | ---: | ---: |
| 1280×720 · Equilibrada | 94 | 150.380 | 25,7 ms |
| 1280×720 · Alta | 92 | 150.140 | 24,8 ms |
| 390×844 · Equilibrada | 40 | 73.296 | 11,2 ms |
| 390×844 · Leve | 40 | 73.296 | 12,7 ms |

Os [resultados brutos](capturas/medicoes.json) incluem as outras resoluções verificadas. A medição móvel foi feita no notebook com toque e viewport emulados. Taxa de quadros e desempenho em celular físico seguem sem medição.

## Demonstração HyperFrames

O [vídeo final](demonstracao/sala-de-espera-sonora-demo.mp4) tem 12 segundos, 1280×720 a 24 fps, vídeo H.264 e áudio AAC. A trilha usa o som gravado do próprio ambiente, com pico medido em −28,7 dBFS.

O HyperFrames verificou seis amostras com zero erros de runtime, layout e movimento. Os 15 testes de contraste passaram. Quatro avisos de lint indicam oportunidades de agrupar as faixas e os cartões em subcomposições. Foram inspecionados quadros decodificados da [abertura](capturas/video-abertura.png), da [interação](capturas/video-interacao.png) e do [celular](capturas/video-celular.png).

