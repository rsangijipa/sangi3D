# Abrigos ao Vento

Use em conjunto com `00_PROMPT_BASE.md`. Implemente o ambiente com entrada `abrigos-ao-vento/index.html`.

## Objetivo

Construa um abrigo de lona e observe seu comportamento com vento variável.

## Cena, texturas e assets

Modele lonas com costura e ilhoses, mastros, estacas e cordas. Mostre a lona em contraluz e deixe a câmera ver as ancoragens.

## Fluxo jogável

Mover pontos de fixação, encurtar cordas, mudar a direção do vento e comparar uma rajada em duas montagens. Salvar as configurações.

## Física e estado

Use pano e cordas com restrições PBD ou Verlet, amortecimento e colisão simples com chão e postes. Permita preset leve com malha reduzida.

## Critérios de aceite

A rajada desloca mais os trechos livres. Encurtar uma corda altera a forma em repouso e o teste pode ser repetido com os mesmos parâmetros.
