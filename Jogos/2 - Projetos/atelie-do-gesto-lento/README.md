# Ateliê do Gesto Lento — Aplicação Modular

Aplicação web interativa de oficina de cerâmica e modelagem de argila em 3D, construída de forma estritamente modular em TypeScript, Three.js 0.180.0 e Vite, atendendo integralmente às especificações de [01_PROMPT_MESTRE.md](01_PROMPT_MESTRE.md) e [02_PROMPT_PRATICA_GUIADA.md](02_PROMPT_PRATICA_GUIADA.md).

---

## 📁 Estrutura Modular (`src/`)

```
src/
├── types/
│   └── index.ts                 # Tipagens centrais: ClayConfig, ToolType, ScopeType, GuidedState, Snapshot
├── clay/
│   ├── ClayGeometry.ts          # Malha radial dinâmica (BufferGeometry 40x96), UVs, normais e aWetness
│   ├── ClaySolver.ts            # Físicas de deformação plástica: Modelar, Alisar, Marcar e volume
│   └── ClayHistory.ts           # Pilha transacional de Undo / Redo (até 30 snapshots)
├── scene/
│   ├── WorkshopProps.ts         # Cenografia: bancada com 5 tábuas, janela, disco manual, estecas, linho, vasos
│   └── WorkshopScene.ts         # Renderer sRGB, iluminação solar suave, câmeras (Trabalho, Detalhe, Ambiente)
├── interaction/
│   └── PointerController.ts     # Raycasting na argila, separação gesto/órbita, multi-toque e deadzone
├── audio/
│   └── MaterialAudio.ts         # Web Audio API: atrito tátil úmido da argila e ambiência da janela
├── session/
│   └── SessionStore.ts          # Persistência IndexedDB (debounce 600ms), exportação PNG e JSON
├── guided/
│   └── GuidedSession.ts         # Máquina de estados da Prática Guiada com os 5 convites meditativos
├── ui/
│   └── UIManager.ts             # Dock de ferramentas, painel 'Seu gesto', modais e acessibilidade por teclado
└── main.ts                      # Bootstrap e loop de animação a 60 FPS com desaceleração de umidade
```

---

## 🚀 Como Executar

### 1. Modo de Desenvolvimento (Vite Dev Server)
Para rodar localmente com recarregamento rápido (Hot Module Replacement):
```bash
npm run dev
```
Abra o link exibido no terminal (geralmente `http://localhost:5173`).

### 2. Compilação de Produção
Para verificar tipos em TypeScript e gerar o pacote minificado em `dist/`:
```bash
npm run build
```

### 3. Pré-visualização da Produção
Para testar a compilação localmente:
```bash
npm run preview
```

---

## 🎨 Recursos Implementados

1. **Modelagem Real da Argila (`ClaySolver` + `ClayGeometry`):**
   * Malha radial de $40$ faixas verticais $\times 96$ segmentos angulares no desktop ($28 \times 64$ no celular).
   * Parede interna com espessura mínima de $8\text{ mm}$ e base fechada de $18\text{ mm}$.
   * Soldagem de normais no *seam* para iluminação contínua sem linhas verticais escuras.
   * Ferramentas funcionais:
     * **🖐️ Modelar:** Arraste horizontal abre ou estreita o bojo com kernel Gaussiano $w = e^{-d^2 / 2\sigma^2}$ (alcance "Faixa inteira" para torno ou "Toque local").
     * **✨ Alisar:** Suavização Laplaciana local dos vizinhos em buffer duplo temporário.
     * **✏️ Marcar:** Entalhe contínuo de sulcos com a esteca de madeira respeitando espessura mínima.
   * Estimativa e redistribuição plástica sutil de volume para conservação da peça.
2. **Áudio Procedimental Tátil (`MaterialAudio`):**
   * Filtro biquad passa-baixa modulado em tempo real por velocidade e pressão do gesto.
   * Diferenciação acústica: *Modelar* produz atrito plástico úmido, *Alisar* é mais abafado e suave, *Marcar* tem corte nítido.
   * Ambiência calma de ar suave na janela.
3. **Prática Guiada dos 5 Convites (`GuidedSession`):**
   * *Convite 1 — Chegar:* Encontrar uma postura confortável e observar luz e argila.
   * *Convite 2 — Encontrar o gesto:* Gesto inicial na argila com confirmação suave.
   * *Convite 3 — Experimentar:* Alisar uma região ou deixar uma marca.
   * *Convite 4 — Olhar de novo:* Pausa contemplativa e rotação da peça.
   * *Convite 5 — Deixar por hoje:* Conclusão sem julgamentos, com campo de anotação pessoal opcional.
   * Temporização flexível: "Breve (3 min)", "Com tempo (7 min)" ou "Sem relógio".
   * Leitura em voz alta via Web Speech API (`speechSynthesis`) em português brasileiro.
4. **Persistência e Exportação Segura (`SessionStore`):**
   * Salvamento automático no navegador via **IndexedDB** após 600ms de inatividade do gesto.
   * Exportação de capturas de tela limpas em alta resolução ($2048 \times 2048\text{ px}$) sem elementos de interface.
   * Exportação e importação de arquivo JSON estruturado com validação de limites físicos.
5. **Acessibilidade Universal (`UIManager`):**
   * Painel de "Ajustes precisos por teclado" para ampliar/estreitar regiões (Base, Bojo, Colo, Borda) sem necessidade de mouse.
   * Paleta terrosa com alto contraste ($\ge 4{,}5:1$): Papel `#F4EDE2`, Argila `#A95F43`, Oliva `#596344`, Parede `#DCD1BC`.
