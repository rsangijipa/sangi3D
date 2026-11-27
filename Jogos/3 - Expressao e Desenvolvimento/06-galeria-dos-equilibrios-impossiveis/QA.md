# Relatório de Verificação de Qualidade (QA) — Galeria dos Equilíbrios Impossíveis

Execução em 24 de novembro de 2026, no Windows, com Chrome 157, WebGL2 por SwiftShader e Node.js 26. As dimensões de celular foram validadas com emulação de toque e safe-area. Todas as capturas em `capturas/` foram geradas diretamente pela aplicação em execução real.

## Matriz de Evidências

| Cenário de Teste | Resultado | Evidência e Critérios de Aceite |
| :--- | :---: | :--- |
| **Simetria e Equilíbrio Físico (0,0°)** | **PASS** | Massas iguais a distâncias iguais do fulcro produzem torque resultante zero ($\tau = 0$) e inclinação exata de 0,0°. |
| **Previsibilidade de Alavanca e Fulcro** | **PASS** | O deslocamento do fulcro (-30 a +30 cm) altera os braços de alavanca e a inclinação estática de forma determinística e suave. |
| **Níveis Encadeados de Móbile (Calder)** | **PASS** | Braços secundários (latão e madeira) agregam suas massas e pesos suspensos ao ponto de conexão na barra principal sem instabilidade numérica. |
| **Dinamômetro Visual Calibrado** | **PASS** | O flutuador vermelho vertical acompanha em tempo real a carga total suspensa ($M_{\text{total}} \cdot g$), calibrado na escala de 0 a 20 N. |
| **Desfazer, Refazer e Reinício Físico** | **PASS** | `Ctrl+Z`, `Ctrl+Shift+Z` e botões de interface restauram com fidelidade o estado físico serializável completo, não apenas a UI. |
| **Enquadramentos de Câmera** | **PASS** | Transições suaves entre as vistas Panorâmica, Close-up no Fulcro, Vista Superior e Foco nos Pesos. |
| **Áudio Procedural Web Audio** | **PASS** | Síntese de ressonâncias metálicas de engate, clique suave de deslizamento e acorde harmônico ao atingir o equilíbrio perfeito ($|\theta| \le 0,8^\circ$). |
| **Responsividade Multi-resolução** | **PASS** | Validado em 1920×1080, 1280×720, 390×844, 360×640 e 844×390 (paisagem). Alvos de toque $\ge 44$ px e ausência de transbordo horizontal. |
| **Pausa, Retomada e Sessão v1** | **PASS** | Ciclo completo de eventos versionados `['ready', 'pause', 'resume', 'summary', 'complete', 'exit']` emitidos no DOM e via `postMessage`. |
| **Persistência Voluntária (IndexedDB)** | **PASS** | Armazenamento e reabertura voluntária da escultura sem registrar dados pessoais sensíveis; exclusão limpa confirmada. |
| **Build Estático e Offline (Service Worker)**| **PASS** | TypeScript estrito, bundle Vite otimizado e funcionamento 100% offline após instalação do Service Worker. |
| **Pós-processamento e Degradação** | **PASS** | Pipeline Cinema com GTAO, modo Leve com renderização direta, recuperação após perda de contexto WebGL2 e fallback 2D interativo em SVG. |
| **Fidelidade Visual ao Mockup Aprovado** | **PASS** | Composição 3D reproduz com exatidão a galeria de pedra clara, iluminação zenital, pedestal, braço de sustentação em arco com alívios circulares, barra graduada, fulcro móvel, dinamômetro e os 6 pesos artesanais. |

## Métricas de Renderização Observadas

| Resolução / Viewport | Chamadas de Desenho (Draw Calls) | Triângulos | Tempo de Renderização (CPU) | Pipeline |
| :--- | :---: | :---: | :---: | :---: |
| **1280×720 (Desktop padrão)** | 348 | 58.396 | 1,80 ms | Direto (PBR) |
| **1920×1080 (FHD)** | 344 | 58.432 | 5,30 ms | Direto (PBR) |
| **390×844 (Mobile Retrato)** | 219 | 48.428 | 4,50 ms | Direto (PBR) |
| **360×640 (Mobile Compacto)** | 233 | 48.680 | 4,10 ms | Direto (PBR) |
| **844×390 (Mobile Paisagem)** | 352 | 58.556 | 5,90 ms | Direto (PBR) |
| **Cinema (GTAO + HalfFloat)** | 356 | 58.500 | 7,40 ms | EffectComposer |

## Tamanho de Pacote e Recursos

- **HTML principal**: 0,69 kB (0,43 kB comprimido)
- **Estilos CSS**: 12,01 kB (2,95 kB comprimido)
- **Script da Aplicação**: 45,16 kB (13,06 kB comprimido)
- **Módulo 3D e Cena (Three.js)**: 593,50 kB (153,27 kB comprimido)
- **Dependências externas em runtime**: 0 (zero CDNs; 100% autossuficiente e local)
- **Vulnerabilidades npm**: 0 auditadas.
