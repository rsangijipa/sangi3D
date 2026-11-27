# Porto das Decisões — Projeto 10/17

> **Jogo Web 3D de Planejamento de Cargas e Rotas Náuticas em Diorama Isométrico**

Reconstrução interativa em 3D em tempo real baseada na referência visual `mockup.png`, seguindo as diretrizes técnicas de acabamento, acessibilidade, privacidade e fundamentação fenomenológica.

---

## 🎯 Conceito e Objetivo

Planejar o carregamento de pequenas embarcações e desenhar rotas conectando cais e entrepostos marítimos.
Explorar decisões sequenciais, capacidade do barco e consequências previsíveis com simulação antes de confirmar a viagem oficial.

- **Sessão sugerida:** 5 a 15 minutos
- **Público:** Aberto / Acompanhado (crianças, adultos, ambientes educativos e corporativos)
- **Tom:** Investigação fenomenológica e convite à experimentação ("O que você percebe ao testar essa rota?", "Como a capacidade influenciou a escolha?")
- **Sem penalidade, vidas ou ranking.**

---

## 🏗️ Arquitetura de Módulos

```
10-porto-das-decisoes/
├── package.json
├── tsconfig.json
├── vite.config.ts
├── index.html
├── README.md
├── mockup.png
├── public/
│   └── favicon.svg
├── src/
│   ├── main.ts              # Coordenação principal e ciclo de vida
│   ├── style.css            # Estilos PBR artesanais e responsividade mobile
│   ├── game/
│   │   ├── state.ts         # Estado serializável e reducer puro (FSM)
│   │   ├── content.ts       # 6 missões náuticas, catálogo de barcos, grafo de nós
│   │   └── rules.ts         # Validação de grafo, adjacência, capacidade e simulação
│   ├── scene/
│   │   ├── gameScene.ts     # Câmera ortográfica 38°, luz solar com sombras, render loop
│   │   ├── water.ts         # Água turquesa procedural com normal animada e ondulação
│   │   ├── environment.ts   # Cais de pedra/madeira, armazéns terracota, defensas, postes
│   │   ├── crane.ts         # Guindaste amarelo articulado com gancho içando caixas
│   │   ├── boats.ts         # Barco Azul, Verde e Vermelho com vigias, boias e slots
│   │   └── routeView.ts     # Fita Catmull-Rom creme, boias e halo com traços de foco
│   ├── input/
│   │   └── controller.ts    # Teclado e atalhos acessíveis
│   ├── audio/
│   │   └── soundEngine.ts   # Web Audio API procedural (mar, sino, buzina, guindaste)
│   ├── ui/
│   │   └── hud.ts           # Painel de rota, placa de título e modais acessíveis
│   └── assets/
│       ├── manifest.json    # Manifesto técnico de assets
│       └── credits.md       # Procedência e licenças
└── tests/
    ├── fsm.test.ts          # Testes de transição de estado, deadlock prevention e undo
    ├── rules.test.ts        # Testes de grafo, adjacência, rotas em loop e capacidade
    ├── simulation.test.ts   # Testes de fidelidade da simulação, missões e entrega em cais
    ├── boats.test.ts        # Testes de posicionamento sem colisão e prevenção de vazamento 3D
    └── e2e.mjs              # Testes ponta a ponta com Playwright em navegador real Edge
```

---

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18+ (recomendado Node 20+)
- npm ou pnpm

### Instalação
```bash
npm install
```

### Desenvolvimento Local
```bash
npm run dev
```
Acesse em: `http://localhost:5173`

### Executar Testes Unitários
```bash
npm test
```

### Build Estático de Produção
```bash
npm run build
```
Os arquivos otimizados serão gerados em `dist/`.

### Pré-visualização do Build
```bash
npm run preview
```

---

## ⌨️ Atalhos de Teclado e Acessibilidade

- **Enter / S:** Executar simulação ou confirmar viagem
- **Setas Direita / Cima:** Avançar e conectar próximo nó adjacente da rota
- **Setas Esquerda / Baixo / U / Backspace:** Desfazer última parada
- **C:** Abrir/fechar gerenciador de carga e embarcações
- **B:** Alternar entre Barco Azul (cap 3), Verde (cap 4) e Vermelho (cap 5)
- **M:** Ligar / silenciar áudio
- **1 a 6:** Trocar rapidamente para a Missão 1 a 6
- **Escape:** Fechar modais abertos
- **Tab / Shift+Tab:** Navegação completa por teclado com anel de foco visível e botões DOM acessíveis para seleção de nós sem depender exclusivamente de raycasting no canvas 3D

---

## 🔒 Privacidade e Ética
- Sem coleta de dados pessoais, telemetria remota ou rastreamento.
- Sem diagnóstico ou conclusões psicológicas automáticas.
- *"Apenas descrição. O significado é de quem cria."*
