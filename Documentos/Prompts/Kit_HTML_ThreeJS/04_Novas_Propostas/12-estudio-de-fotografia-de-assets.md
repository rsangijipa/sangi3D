# Estúdio de Fotografia de Assets

Use em conjunto com `00_PROMPT_BASE.md`. Implemente o ambiente com entrada `estudio-de-fotografia-de-assets/index.html`.

## Objetivo

Inspecione um modelo 3D e exporte fotografias padronizadas do asset.

## Cena, texturas e assets

Use fundo infinito, régua, bases neutras, três luzes e painéis de comparação. Inclua um GLB demonstrativo próprio com madeira, metal e cerâmica.

## Fluxo jogável

Importar GLB local, reenquadrar, alternar luz difusa, lateral e contraluz, comparar duas vistas e exportar PNG com fundo sólido ou transparente.

## Física e estado

Calcule enquadramento pela caixa delimitadora. Preserve o modelo durante a troca de luz e renderize a exportação em alvo com resolução escolhida.

## Critérios de aceite

O GLB demonstra enquadramento consistente de frente e de lado. O PNG preserva enquadramento e fundo escolhidos. Um arquivo inválido mostra erro e o modelo atual permanece aberto.
