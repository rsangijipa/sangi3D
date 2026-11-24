# 02 — Trilha do Mestre Mandou

> **Ambiente 3D Interativo de Expressão e Desenvolvimento**  
> Coleção: *Expressão e desenvolvimento* · Verbo central: *percorrer e propor*  
> Tema visual: Parque florestal com riacho, ponte suspensa, sino azul, tambor e roda d'água.

---

## 🌲 Visão Geral do Projeto

O **02 — Trilha do Mestre Mandou** é uma aplicação interativa 3D desenvolvida para promover a atenção sustentada, planejamento motor e cognitivo, seguimento de instruções em etapas e criatividade motora/expressiva.

O ambiente foi desenhado sob princípios neuroafirmativos e de psicologia do desenvolvimento:
- **Sem penalidades ou estresse:** Não há pontuação decrescente, "game over" punitivo ou cronômetros coercitivos.
- **Retorno seguro com um clique:** Botão *Ponto Seguro* permite que o usuário retorne imediatamente a uma área segura e plana sem perdas de progresso.
- **Agência e protagonismo ("Minha vez de propor"):** Além de seguir as etapas guiadas pelo mestre, o usuário pode assumir a liderança e criar seus próprios desafios e percursos para amigos ou terapeutas.
- **Paisagem sensorial acolhedora:** Sintetizador de áudio procedural (Web Audio API) reproduzindo águas correntes suaves, estalar de madeira e cantos sutis de pássaros com limitador rígido a -24 dBFS.

---

## 🎮 Controles e Interação

| Ação | Teclado | Mouse / Touch |
| :--- | :--- | :--- |
| **Mover Personagem** | `W`, `A`, `S`, `D` ou `Setas` | Clique ou toque no terreno (Click-to-Move) |
| **Saltar** | `Espaço` | Botão no HUD |
| **Interagir / Tocar** | `E` | Clique direto no objeto ou botão *Tocar / Interagir (E)* |
| **Alternar Câmera** | `C` | 3ª Pessoa Elevada (padrão) ⇄ Visão Isométrica |
| **Mudar Áudio** | `M` | Ícone de alto-falante no topo |
| **Pausar / Acalmar** | `P` ou `Esc` | Botão *Pausa* no HUD |
| **Ponto Seguro** | Botão HUD | Reposiciona o explorador na entrada da ponte |

---

## 🎨 Paleta e Identidade Visual

O projeto implementa rigorosamente a paleta de cores acordada:
- **Verde Floresta Primário:** `#365A43`
- **Verde Oliva Musgo:** `#81945B`
- **Azul Celadon Riacho / Sino:** `#5599A5`
- **Marrom Madeira / Terra:** `#9A704A`
- **Dourado Suave / Destaques:** `#E5BC58`
- **Terracota / Couro Tambor:** `#B9634B`

### Sistema de Marca e Reskin (White-Label)
A aplicação conta com suporte nativo a personalização em tempo real via CSS Variables e `postMessage`:
- **Preset Padrão:** "Parque da Trilha Viva" (paleta florestal acolhedora).
- **Preset Neutro:** Paleta sóbria em tons minerais para clínicas e consultórios.
- **Integração Iframe:** Permite que sistemas de teleatendimento ou LMS configurem nome da instituição, logotipo, instrução ativa e paleta dinamicamente.

---

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18+ (recomendado Node 20+)
- Navegador moderno com suporte a WebGL 2.0 / WebGPU

### Instalação e Execução Local
```bash
# Entrar no diretório
cd "02-trilha-do-mestre-mandou"

# Iniciar servidor de desenvolvimento Vite
npm run dev

# Abrir no navegador
# http://localhost:5173 (ou a porta informada pelo terminal)
```

### Compilação de Produção
```bash
npm run build
```
Os arquivos otimizados e minificados serão gerados na pasta `dist/`.

---

## 🧪 Testes Automatizados

O projeto conta com baterias completas de testes unitários e de integração de ponta a ponta (E2E):

```bash
# 1. Testes Unitários de Lógica de Estado (FSM)
npm test

# 2. Testes de Navegador E2E e Geração de Screenshots (Playwright)
npm run test:e2e
```

### Saídas Geradas pelos Testes
- `capturas/desktop-inicial.png` (1920x1080 - 16:9, avatar no início da ponte voltado para o sino azul)
- `capturas/desktop-interacao.png` (1920x1080 - momento em que o sino é tocado e a etapa 3 é ativada)
- `capturas/celular.png` (390x844 - viewport retrato para smartphones)
- `capturas/medicoes.json` (métricas de telemetria de GPU, triângulos e draw calls)

---

## 📂 Estrutura de Arquivos

```
02-trilha-do-mestre-mandou/
├── capturas/                     # Screenshots oficiais e telemetria E2E
│   ├── desktop-inicial.png
│   ├── desktop-interacao.png
│   ├── celular.png
│   └── medicoes.json
├── dist/                         # Pacote estático compilado para produção
├── src/
│   ├── audio/                    # Síntese Web Audio API procedural
│   │   └── audio.ts
│   ├── brand/                    # White-label e gerenciador de marca
│   │   └── brand.ts
│   ├── game/                     # Máquina de estados finita e catálogo de alvos
│   │   ├── content.ts
│   │   └── state.ts
│   ├── input/                    # Controle de teclado e click-to-move
│   │   └── controls.ts
│   ├── scene/                    # Modelagem procedural Three.js
│   │   ├── avatar.ts             # Explorador com limbs articulados
│   │   ├── environment.ts        # Ponte suspensa, cabana, plataformas, árvores
│   │   ├── heroAssets.ts         # Sino Azul, Tambor da Clareira, Roda d'água
│   │   ├── scene.ts              # Iluminação, sombras e câmera
│   │   ├── terrain.ts            # Malha 64x64 com elevação de colina e leito
│   │   └── water.ts              # Riacho com textura de fluxo animado
│   ├── ui/                       # HUD acessível e modais responsivos
│   │   └── hud.ts
│   └── main.ts                   # Orquestrador da aplicação
├── tests/
│   ├── rules.test.mjs            # Testes unitários do GameStateManager
│   └── browser.mjs               # Testes de ponta a ponta Playwright
├── index.html                    # Ponto de entrada HTML
├── package.json
├── tsconfig.json
└── vite.config.mjs
```

---

## 🏛️ Créditos e Diretrizes
Desenvolvido com foco em acessibilidade neuroafirmativa, design calmo e expressividade lúdica. Compatível com os padrões de ambientes interativos 3D da coleção.
