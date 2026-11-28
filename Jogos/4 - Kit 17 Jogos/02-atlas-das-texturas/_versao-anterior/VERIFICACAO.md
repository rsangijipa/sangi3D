# Verificação do Atlas das Texturas

## Evidências

- Build estático gerado e quatro testes unitários executados. Cobertura de progressão, pausa, pulo, reset, limites de manipulação, atualização e retirada no atlas, modo acompanhado e repetibilidade do gerador.
- Chrome em modo headless com WebGL por software. Perfis de 1920×1080, 1280×720, 390×844, 360×640, 430×932, 768×1024 e 844×390.
- Fluxo verificado da entrada à revisão, com rotação, lupa, luz rasante, comparação, descritor, registro, retirada, pausa e retorno do WebGL após perda de contexto simulada. O código do teste de navegador está em `tests/`.
- Capturas revisadas diante do mockup. Foram ajustados enquadramento móvel, posição da luminária e intensidade da luz na cortiça. A direção de arte mantém a composição geral com uma interpretação estilizada.
- 14 arquivos GLB exportados. Foi verificado o cabeçalho binário glTF 2.0, o comprimento declarado, a presença de malhas e contagens positivas nos accessors. O manifesto contém tamanho e SHA-256 de cada arquivo.

## Orçamento observado

| Cena de luz rasante | Chamadas de desenho (Three.js) | Triângulos (Three.js) |
|---|---:|---:|
| Desktop 1280×720 | 234 | 118.685 |
| Celular emulado 390×844 | 129 | 95.013 |

Arquivos da aplicação estática somam cerca de 2,19 MB sem compressão, excluindo os GLB suplementares. O conjunto de GLB soma cerca de 7,68 MB e não entra na carga inicial. As chamadas de desenho ficaram acima dos alvos do briefing. As contagens são do renderizador, em câmera e condição específicas.

## Itens pendentes

- Teste em celular físico, medição de FPS em hardware real e validação formal com Khronos glTF Validator.
- Os GLB são exportações dos modelos procedurais. Texturas normais e AO dedicadas, LODs alternativos, colisores e clips exportados ainda faltam. O jogo usa textura de relevo e animação cinemática diretamente no runtime.
- O build entregue usa o Node local. Vite, Playwright, empacotamento Meshopt/KTX2, integração com host via eventos, cache offline e arquivos de áudio comprimidos ainda faltam. O som de interação é sintetizado com Web Audio após ação do jogador.
- O CLI game-dev não estava disponível. A bancada foi construída com Three.js e ativos locais.
