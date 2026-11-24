# Sangi3D — Arquitetura da Engine Compartilhada e Padrões de Produção

## 1. Visão Geral
A arquitetura do Sangi3D adota uma estratégia de módulos ES puros desacoplados, projetada para carregar nativamente tanto em bundles estáticos quanto via `<script type="module">` com Three.js local ou import maps.

## 2. Estrutura de Módulos (`shared/engine/`)
- `renderer.js`: WebGLRenderer com limite de pixel ratio (DPR 1 a 2), tonemapping ACESFilmic, SRGBColorSpace e redimensionamento automático.
- `physics.js`: Solvers computacionais:
  - Molas amortecidas (Spring-Damper com passo fixo 60Hz).
  - Integração de Verlet (cordas, nós e elásticos).
  - Ondulação de superfície líquida (equação de onda discreta 2D em malha heightfield).
  - Cinemática e inércia angular para mecanismos rotatórios.
- `materials.js`: PBR procedural com geração em runtime de mapas de normais, rugosidade e veios de madeira, vidro óptico com transmissão/clearcoat, latão escovado e cerâmica.
- `lighting.js`: Iluminação diorama de três pontos (Key, Fill, Rim) com transição de presets (Amanhecer, Estúdio Quente, Pôr do Sol, Noite).
- `input.js`: Gerenciador unificado de eventos de ponteiro (mouse, touch e caneta) com suporte a arrasto e raycasting 3D.
- `audio.js`: Sintetizador Web Audio API puro com feedback tátil (cliques, gotas, sinos, tiques mecânicos).
- `particles.js`: Poeira volumétrica e partículas instanciadas com iluminação responsiva.
- `performance.js`: Perfis de qualidade dinâmicos (`ULTRA`, `HIGH`, `BALANCED`, `LOW`, `AUTO`).
- `lifecycle.js`: Integração com `sangi-bridge.js` para manipulação de `SANGI_APP_READY`, `PAUSE`, `RESUME`, `MUTE` e `DISPOSE`.
- `assets.js`: Gerador de geometrias com chanfro e torno mecânico para evitar primitivas cruas.
