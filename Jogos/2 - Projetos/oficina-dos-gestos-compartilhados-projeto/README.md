# Oficina dos Gestos Compartilhados

Ateliê artístico 3D interativo construído com **Three.js** e **TypeScript**, projetado para experimentação tátil-visual, imitação motora, alternância de turnos e criação colaborativa.

> **Aviso de uso profissional**: Este recurso é complementar à prática profissional e educacional e **não constitui instrumento de avaliação psicológica validado**. As criações artísticas nunca são classificadas como certas ou erradas.

## Estações Interativas

1. **Estação A — Pintura gestual**: Cavalete inclinado com tela de algodão, pincéis de diferentes cerdas, espátulas e 6 tigelas de pigmentos (mistura de cores, pressão simulada, espessura de tinta e marcas de cerdas).
2. **Estação B — Escultura colaborativa**: Bancada de madeira com torno de oleiro e argila deformável por heightmap volumétrico (pressionar, puxar, achatar, alisar, acrescentar e remover, preservando contribuições por participante).
3. **Estação C — Desenho na areia**: Bandeja de areia fina com rastelos (estreito e largo), pedras de rio, pincel e nivelador (sulcos, deslocamento lateral de grãos, marcas de pressão e alisamento).
4. **Estação D — Gestos no ar**: Instalação suspensa com 5 fitas de seda simuladas por restrições de distância (Verlet), elasticidade, amortecimento, gravidade e trajetórias 3D luminosas.
5. **Estação E — Ritmo compartilhado**: Xilofone de madeira, sinos tubulares suspensos, tambor de pele e djembê com animações físicas de impacto sincronizadas à síntese Web Audio API.

## Modos de Experiência

- **Exploração livre**: todos os materiais disponíveis, sem objetivos obrigatórios.
- **Imitação**: demonstração de gesto com guia visual opcional para reprodução.
- **Criação compartilhada**: alternância de turnos entre Participante A e Participante B na mesma composição.
- **Complete meu gesto**: um participante inicia o traço/forma/sequência e o outro continua.
- **Espelhamento**: gestos reproduzidos simetricamente na superfície ou entre estações.
- **Experimentação terapêutica**: perguntas abertas sobre o processo criativo, sem interpretação automática.

## Recursos de Acompanhamento (ABA / Mediação)

Painel configurável com: número de etapas, complexidade dos gestos, pistas/demonstrações visuais, tempo de resposta sem pressão, alternância entre participantes, quantidade de materiais disponíveis e registro local opcional de ações observáveis (independentes, com ajuda e pausas), exportável em JSON ou imagem PNG.

## Integração ao Catálogo

Compatível com `window.Imersivo` (botão **Catálogo** na barra superior e eventos `imersivo:return-catalog`).

## Execução e Build

```bash
npm install
npm run dev      # servidor local de desenvolvimento
npm run build    # verificação TypeScript + build estático em dist/
npm test         # suíte de testes unitários
```

O arquivo `dist/index.html` (e `oficina-dos-gestos-compartilhados.html`) é autocontido e pode ser aberto diretamente em qualquer navegador moderno com suporte a WebGL.

## Passe premium (2026-11)

- **Render**: reflexos de ambiente (PMREM/RoomEnvironment, intensidade por papel de material), bloom suave, gradação quente com vinheta e grão leve (`src/core/premium.ts`). Shader final com `clamp` em todas as etapas para evitar NaN em amostras MSAA de borda. Qualidade "leve" desliga o pós-processamento.
- **Luz**: sol mais quente e contrastado, hemisférica reduzida, exposição 0.94.
- **Câmera**: enquadramentos de Argila, Areia, Fitas e Ritmo corrigidos; em retrato o FOV abre e a câmera recua para manter a estação inteira; interpolação independente de FPS.
- **VFX**: respingos de pigmento, poeira de argila, grãos de areia, rastro nas fitas e anel + faíscas nos instrumentos.
- **Selos de descoberta**: um selo por estação (salvo localmente) com arpejo, explosão dourada e anel de progresso no cartão de turno.
- **Áudio**: ambiente do ateliê (vento filtrado + pad suave) com botão 🍃.
- **UI**: barra superior compacta em ícones (rótulos ≥1500px), alvos de toque ≥38px, faixa de modo reposicionada no celular, docas roláveis, safe-area.
- **Diagnóstico**: `?debug` grava `renderer.info` em `document.documentElement.dataset.stats` (desktop: ~196 draw calls incluindo sombra/bloom, ~35k triângulos, 32 texturas).

Scorecard (0–3): Direção de arte 2.5 · Estações/herói 2 · Ferramentas/restrições 2 · Interativos 2.5 · Mundo 2.5 · Materiais 2 · Luz/render 2.5 · VFX 2 · UI 2.5 · Desempenho 2 — média 2.3.
