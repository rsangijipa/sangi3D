# Vila de Palafitas

Use em conjunto com `00_PROMPT_BASE.md`. Implemente o ambiente com entrada `vila-de-palafitas/index.html`.

## Objetivo

Monte um pequeno conjunto de casas e passarelas que possa ser observado com níveis de rio diferentes.

## Cena, texturas e assets

Modele módulos de assoalho, estacas, escadas, telhas, vegetação de margem e passarelas. Varie as tábuas e destaque a linha de umidade nas estacas.

## Fluxo jogável

Arrastar módulos, ajustar altura em níveis discretos, ligar passarelas e alternar entre quatro níveis do rio. Salvar o arranjo em JSON.

## Física e estado

Rede de conexões verifica continuidade entre passarelas. Use corrente visual que contorna obstáculos e nível de água parametrizado.

## Critérios de aceite

Uma passagem sem conexão fica indicada. Quando o rio sobe, muda o trecho molhado das estacas. O arranjo carregado do JSON mantém módulos e ligações.
