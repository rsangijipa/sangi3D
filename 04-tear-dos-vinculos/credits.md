# Créditos e proveniência

| Item | Origem | Licença |
| --- | --- | --- |
| Modelos 3D (tear, travessas, roldanas, catraca, lançadeira, pente, tesoura, agulha, novelos, cesta, bancada, potes, carretéis, mantas, vasos, ateliê, paisagem) | Gerados por código neste projeto (`src/scene/*.ts`) | Do projeto |
| Texturas (madeira, reboco, terracota, vime, cerâmica, linho, fibra torcida, etiquetas, folhas, lavanda, colinas) | Canvas procedural em tempo de carga (`src/scene/textures.ts`) | Do projeto |
| Sons (pente, cruzamento, tesoura, nó, agulha, seleção, rangido, ambiente com pássaros) | Síntese Web Audio (`src/audio/audio.ts`) | Do projeto |
| Ícones do HUD | SVG desenhados à mão (`src/ui/icons.ts`) | Do projeto |
| three.js 0.180.0 | npm `three` | MIT |
| Vite 6.2.7, TypeScript 5.6.3 | npm (somente build) | MIT / Apache-2.0 |

Nenhum arquivo é carregado de CDN ou servidor externo em tempo de execução. Não foram usados serviços de geração externa (chaves `TRIPO_API_KEY`, `GEMINI_API_KEY`, `ELEVENLABS_API_KEY` ausentes); todo o conteúdo é procedural.

A imagem `Tear dos Vínculos no Ateliê.png` é o mockup de referência fornecido; não é usada pela aplicação.
