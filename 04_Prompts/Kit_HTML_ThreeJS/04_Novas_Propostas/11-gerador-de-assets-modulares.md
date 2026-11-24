# Gerador de Assets Modulares

Use em conjunto com `00_PROMPT_BASE.md`. Implemente o ambiente com entrada `gerador-de-assets-modulares/index.html`.

## Objetivo

Gere componentes de arquitetura que outras cenas Three.js possam carregar diretamente.

## Cena, texturas e assets

Modele quatro famílias paramétricas: porta com batente, janela de guilhotina, escada reta e corrimão. Dê escala às UVs de madeira, metal e vidro e inclua guias de montagem.

## Fluxo jogável

Escolher a família, editar dimensões em metros, verificar encaixe com uma peça vizinha e exportar GLB e manifesto JSON.

## Física e estado

Referencie o módulo no nível do piso ou no eixo de articulação, conforme a peça. Exporte medidas, pontos de encaixe e colisores simplificados com nomes estáveis.

## Critérios de aceite

Reimporte cada GLB em uma cena limpa: dimensões, pivô e material conferem. A alteração de largura durante a edição preserva o ponto de encaixe e a escala da textura.
