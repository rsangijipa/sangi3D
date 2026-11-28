# Oficina de Estofados

Use em conjunto com `00_PROMPT_BASE.md`. Implemente o ambiente com entrada `oficina-de-estofados/index.html`.

## Objetivo

Estofe o assento e o encosto de uma poltrona com tensão e costuras visíveis.

## Cena, texturas e assets

Modele armação, espuma, tecido, costura, grampeador e grampos. Dê ao linho trama orientada e à imitação de couro um mapa próprio de rugosidade.

## Fluxo jogável

Selecionar tecido, alinhar a trama, fixar dois lados, esticar cantos e observar a resposta a uma pressão no centro.

## Física e estado

Use uma malha de pano com restrições nas bordas, colisão simplificada com a espuma e deformação local na pressão. Limite iterações por frame.

## Critérios de aceite

Dois padrões de grampeamento geram dobras diferentes. Uma pressão desloca o revestimento e a recuperação respeita o ajuste de amortecimento.
