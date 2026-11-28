# Rua Depois da Chuva

Use em conjunto com `00_PROMPT_BASE.md`. Implemente o ambiente com entrada `rua-depois-da-chuva/index.html`.

## Objetivo

Modele o desnível de um trecho de rua e observe o escoamento.

## Cena, texturas e assets

Crie meio-fio, blocos de pavimento, grelhas, sarjetas e desníveis. Use mapas de umidade para variar o brilho e o tom conforme a altura da lâmina.

## Fluxo jogável

Ajustar o abaulamento, mover grelhas, iniciar chuva e comparar onde se acumulam poças com a drenagem aberta ou bloqueada.

## Física e estado

Use grade rasa de escoamento por diferença de altura, sumidouros nas grelhas e limite de volume por célula. Exiba entrada, drenagem e água acumulada em modo de inspeção.

## Critérios de aceite

Em uma rampa a água desce. Uma grelha aberta reduz a poça sem drenar células desconectadas. Teste chuva zero e chuva máxima.
