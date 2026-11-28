# # 053 — Jardim de Areia (Karesansui)

Experiência contemplativa 3D interativa de um jardim japonês de pedras e areia branca granítica (*Karesansui*), construída em Three.js r187 WebGL com foco em realismo material, luz solar rasante de alto contraste e interação tátil responsiva.

## Controles & Ferramentas

- **Rastelo (`1`)**: Arraste sobre o tanque de areia para esculpir sulcos paralelos alinhados à direção do gesto. Pedras bloqueiam o rastelo com desvio automático na borda e retorno visual/sonoro.
- **Largura**: Alterne entre `Estreito` (3 dentes), `Médio` (5 dentes) e `Largo` (7 dentes).
- **Pedra (`2`)**: Arraste as rochas basálticas pelo tanque (sem sobreposição) e use a roda do mouse ou `Q`/`E` para girá-las, criando um novo colar de areia ao redor.
- **Câmera (`3`)**: Arraste com o botão esquerdo para orbitar livremente (em qualquer ferramenta, o botão direito ou pinça com 2 dedos também orbita o cenário).
- **Limpar**: Aplique padrões base (`Ondas Zen`, `Anéis` ao redor das pedras ou `Nivelar` areia lisa).
- **Desfazer (`Z` / `Ctrl+Z`)**: Restaura instantaneamente o mapa de altura e normais anteriores.
- **Contemplação (`H`)**: Oculta os menus para observação pura do jardim.
- **Pausar (`P` / `Esc`)** e **Reiniciar (`R`)**.

## Arquitetura Técnica

- `main.js`: Inicialização WebGL r187 (`THREE.Timer`, ACESFilmic, PCFSoftShadowMap), raycasting areia/pedras, loop em timestep fixo `1/60s` (`max 4` substeps) e integração `SangiBridge`.
- `js/sand-physics.js`: Heightmap `192 × 128` em `Float32Array` sobre `10.6m × 7.0m`, recálculo parcial de normais dinâmicas na caixa modificada, colisão rastelo-rochas (`clampRakePosition`), pilha de desfazer e padrões Karesansui.
- `js/garden-world.js`: Pavilhão japonês com deck *engawa*, portas *shoji* translúcidas, beiral cerâmico, lanterna *tōrō*, bambus, 5 rochas Suiseki esculpidas com colar de musgo e rastelo dinâmico em madeira hinoki.
- `js/materials.js`: Texturas procedurais PBR geradas offline (areia granítica com microgrãos, madeira hinoki/cedro escuro, rocha basáltica estratificada, musgo aveludado e papel *shoji*).
- `js/audio-engine.js`: Síntese Web Audio de raspagem física proporcional à velocidade do rastelo e brisa calma (ativada somente após gesto explícito).
- `js/ui-controller.js`: HUD serena (`<= 20%` da vista desktop), painel secundário recolhido por padrão e alvos táteis `>= 44px`.
