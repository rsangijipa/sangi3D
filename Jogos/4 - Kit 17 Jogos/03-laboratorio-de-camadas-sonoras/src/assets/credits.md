# Créditos e Procedência de Assets — Laboratório de Camadas Sonoras (Projeto 03/17)

## Origem e Licenças
- **Geometria 3D:** Modelagem procedural nativa em Three.js (`src/scene/`), construída especificamente para reproduzir cada detalhe artesanal do `mockup.png` (mesa de mixagem chanfrada, 5 redomas de vidro com miniaturas, luminária articulada, microfone de estúdio vintage e pegboard).
- **Materiais e Texturas:** PBR gerado proceduralmente com `MeshPhysicalMaterial` e `MeshStandardMaterial` (vidro com transmissão e refração física, carvalho mel com relevo, metal escovado, cerâmica esmaltada e feltro).
- **Design Visual & Mockup:** Baseado no arquivo de arte de produção `mockup.png` do Kit 17 Jogos 3D.
- **Áudio Sintetizado:** 100% sintetizado em tempo real com Web Audio API (`src/audio/soundLayers.ts`) — 5 stems independentes (fala com filtros formantes, passos com sola e fricção, ventilador com harmônicos de 120Hz e sopro, cidade com ruído browniano e melodia suave com progressão harmônica de Rhodes em Cmaj7). Sem dependência de MP3 externos que possam falhar.
- **Tipografia:** Tipografia de sistema com fallback elegante (`Georgia` para títulos serifados de editorial, e sans humanista arredondada do sistema para controles e botões).

## Licença
Código e assets desenvolvidos sob os termos do projeto Kit 17 Jogos 3D.
