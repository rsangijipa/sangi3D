# Cartografia dos Sons — Jogo Web 3D (01/17)

Experiência interativa de exploração, discriminação auditiva e percepção espacial em uma cidade em miniatura tridimensional.

## 🎯 Conceito e Dinâmica
Explore um diorama urbano como cartógrafo sonoro:
- **Etapa 1 (Descobrir as fontes):** Ative sons voluntariamente e associe cada timbre visualmente ao seu elemento no diorama.
- **Etapa 2 (Ponto de escuta):** Desloque o marcador de escuta (pino de latão e madeira com símbolo de ouvido) e perceba a variação contínua de ganho por atenuação espacial.
- **Etapa 3 (Mover e comparar — Alvo Visual do Mockup):** Conduza o ônibus azul pela via de asfalto demarcada, observando a modulação de ganho e anéis de ondas sonoras acompanhando a viagem.
- **Etapa 4 (Comparar distâncias):** Discrimine fontes A e B sem loops concorrentes desordenados.
- **Etapa 5 (Compor paisagem sonora):** Combine harmoniosamente até 3 fontes sonoras e exporte o resumo da sua cartografia.

## 🚀 Como Executar Localmente

### Pré-requisitos
- Node.js (v18+) e npm

### Instalação e Desenvolvimento
```bash
# 1. Instalar dependências
npm install

# 2. Iniciar servidor local de desenvolvimento
npm run dev

# 3. Executar suíte de testes unitários e de regras
npm test

# 4. Gerar build estático para produção
npm run build

# 5. Visualizar build de produção
npm run preview
```

A aplicação não requer login, chaves de API nem credenciais remotas. Todos os assets e sínteses de áudio são autossuficientes e operam localmente via HTTP.

## 📁 Arquitetura do Projeto
- `src/game/state.ts`: Estado serializável e máquina de estados finitos (FSM / Reducer).
- `src/game/content.ts`: Cenários, fontes sonoras, áreas urbanas, textos em pt-BR e legendas acessíveis.
- `src/game/rules.ts`: Física determinística, snap a grid (0.25 m), projeção na malha viária e atenuação acústica Euclidiana.
- `src/scene/gameScene.ts`: Diorama Three.js com câmera isométrica ortográfica, iluminação híbrida e carregamento de GLB 2.0.
- `src/audio/soundEngine.ts`: Motor de áudio espacial via Web Audio API, `PannerNode`, crossfade suave (150–300 ms) e síntese procedimental.
- `src/input/keyboardController.ts`: Acessibilidade motora completa via teclado (Setas/WASD, Espaço, 1/2/3, M, Esc).
- `src/ui/hud.ts` e `src/ui/styles.css`: HUD DOM responsivo (desktop com card flutuante à direita e mobile com bottom sheet expansível).
- `public/assets/models/`: Modelos GLB 2.0 dos 16 assets especificados.
- `public/assets/manifest.json`: Manifesto com categorias, materiais e especificações técnicas de cada asset.
- `src/assets/credits.md`: Proveniência e licenciamento de todos os assets.
- `src/tests/`: Cobertura profunda de testes com Vitest.

## ♿ Acessibilidade (WCAG 2.1 AA)
- Legendas sonoras visuais na base da tela (funciona inclusive com áudio desativado).
- Alternativa por teclado para todas as ações do mouse e toque no canvas 3D.
- Contraste visual superior a 4,5:1 em todos os textos da interface.
- Modos: Livre, Guiado (com pistas graduais) e Acompanhado (parâmetros para mediadores).
