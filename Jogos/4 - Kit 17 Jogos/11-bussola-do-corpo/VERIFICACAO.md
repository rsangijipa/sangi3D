# Verificação da Bússola do Corpo

## Resultado

- Build estático concluído e TypeScript verificado. A aplicação e o Launcher local carregam por HTTP.
- Cinco testes unitários verificam seed, exemplo, múltiplas regiões e pontos, edição, descarte por etapa, intensidade 0–4, pausa, reset, saída e leitura de registros inválidos.
- Playwright percorreu entrada, sensação, intensidade, revisão e conclusão em 1280×720, 1920×1080, 390×844, 360×640, 430×932, 768×1024 e 844×390. O fluxo principal monitorou erros do console, exceções da página e respostas HTTP de erro.
- Testes adicionais exercitaram seleção por mouse e por toque emulado, frente e costas, lista, seleção por teclado, pausa, som opcional, H, confirmação de descarte, edição de múltiplos pontos, salvamento explícito, reabertura, remoção do registro, perda de contexto e saída no modo acessível. A integração no iframe local verifica os eventos de entrada, pausa, retomada e resumo.
- As capturas documentam a entrada, seleção, conclusão, frente e costas, os três presets de luz e detalhes dos modelos. A comparação com o mockup está no [relatório visual](design-qa.md).

## Renderização e tamanho

Medição no Chromium com ANGLE Direct3D 11 e Intel UHD Graphics. O teste síncrono chama o compositor oito vezes com `readPixels` e escala interna 1. Os valores variam conforme o estado do hardware.

| Perfil e renderização | Tempo médio observado | Chamadas da cena | Triângulos da cena |
| --- | ---: | ---: | ---: |
| 1280×720 · Equilibrada | 20,8 ms | 62 | 122.109 |
| 1280×720 · Cinema | 34,4 ms | 62 | 122.109 |
| 390×844 emulado no notebook · Equilibrada | 7,9 ms | 52 | 121.209 |

As contagens são do passe da cena. O tempo inclui composição e sincronização. A área 3D em 390×844 tinha 390×515. Os arquivos brutos de medição estão em [medicoes.json](capturas/medicoes.json) e [medicoes-alta-1280x720.json](capturas/medicoes-alta-1280x720.json).

O build servido soma aproximadamente **809 KB** sem compressão de transferência. Os 12 arquivos GLB suplementares somam **15,7 MB** e ficam fora da carga do jogo. Todos passaram pelo Khronos glTF Validator com zero erros e zero avisos. O [manifesto](assets/manifest.json) inclui materiais, tamanhos, hashes, pivôs por peça e o clipe de giro da figura.

## Limites da verificação

- Os perfis móveis foram emulados no Chromium. Falta testar em um celular físico. Os tempos do perfil móvel registram a Intel UHD do notebook.
- A integração foi verificada com o Launcher independente e com iframe no mesmo servidor. O Launcher de referência em outra pasta permanece fora deste build.
- O build web usa WebGL conforme o motor de referência. Os modelos suplementares usam GLB com texturas embutidas. Meshopt, KTX2 e cache offline ficaram fora da entrega.

