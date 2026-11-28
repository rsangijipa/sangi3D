# Laboratório de Camadas Sonoras — Projeto 03/17

> **Mesa de Mixagem Artesanal 3D para Seleção Auditiva e Controle de Estímulos**

Reconstrução tridimensional interativa de alta fidelidade baseada na referência visual `mockup.png`, projetada para explorar camadas sonoras sobrepostas, escolher o foco de atenção e regular o conforto auditivo em diorama artesanal.

---

## 🎯 Conceito e Objetivo

Explorar a sobreposição de 5 camadas sonoras cotidianas e musicais em uma bancada de estúdio em miniatura:
1. **Fala / Diálogo:** Murmúrio distante e caloroso de conversas em sala.
2. **Passos / Tênis:** Passadas cadenciadas com sola macia sobre madeira.
3. **Ventilador / Brisa:** Zumbido mecânico suave de 120 Hz com sopro contínuo de ar.
4. **Cidade / Trânsito:** Paisagem urbana ampla e difusa com tráfego distante.
5. **Melodia Suave:** Acordes relaxantes em teclado elétrico e vibrafone.

- **Sessão sugerida:** 4 a 10 minutos
- **Público:** Aberto / Acompanhado (crianças, adultos, sensibilidade sensorial)
- **Tom:** Investigação fenomenológica e convite à experimentação ("O que você percebe quando uma camada é silenciada?")
- **Sem penalidade, vidas ou ranking.**

---

## 🏗️ Arquitetura de Módulos

```
03-laboratorio-de-camadas-sonoras/
├── package.json
├── tsconfig.json
├── vite.config.ts
├── index.html
├── README.md
├── mockup.png
├── public/
│   └── favicon.svg
├── src/
│   ├── main.ts              # Coordenação principal, lifecycle e sync de áudio/cena
│   ├── style.css            # Estilos PBR artesanais e responsividade mobile
│   ├── game/
│   │   ├── state.ts         # Estado serializável e reducer puro (FSM)
│   │   ├── content.ts       # 5 canais, 6 desafios auditivos, reflexões
│   │   └── rules.ts         # Cálculo matemático de ganhos efetivos, solo e A/B
│   ├── scene/
│   │   ├── gameScene.ts     # Câmera 40°, luz motivada, render loop e picking
│   │   ├── workbench.ts     # Bancada de carvalho, pegboard, janela e bandeirolas
│   │   ├── mixer.ts         # Mesa de mixagem inclinada com 5 trilhos e faders
│   │   ├── cloches.ts       # 5 redomas de vidro com halo de emissão verde
│   │   ├── miniatures.ts    # Miniaturas: fala, tênis verde, ventilador móvel, cidade, nota
│   │   └── props.ts         # Abajur articulado com luz, microfone condensador vintage
│   ├── audio/
│   │   └── soundLayers.ts   # Web Audio API com 5 stems sintetizados em tempo real
│   ├── input/
│   │   └── controller.ts    # Teclado e atalhos acessíveis (1-5, S, M, A/B, setas)
│   ├── ui/
│   │   └── hud.ts           # Painel "Escolher o foco", sliders DOM e botões
│   └── assets/
│       ├── manifest.json    # Manifesto técnico de assets
│       └── credits.md       # Procedência e licenças
└── tests/
    ├── fsm.test.ts          # Testes de FSM, solo, mute e A/B
    ├── rules.test.ts        # Testes de cálculo de ganho e preservação nominal
    └── audio-logic.test.ts  # Testes de integridade dos 5 canais e desafios
```

---

## 🚀 Como Executar

### Instalação
```bash
npm install
```

### Desenvolvimento Local
```bash
npm run dev
```
Acesse em: `http://localhost:5174`

### Executar Testes Unitários
```bash
npm test
```

### Build Estático de Produção
```bash
npm run build
```

### Pré-visualização do Build
```bash
npm run preview
```

---

## ⌨️ Atalhos de Teclado e Acessibilidade

- **1 a 5:** Selecionar e focar nos canais (1: Fala, 2: Passos, 3: Ventilador, 4: Cidade, 5: Música)
- **S:** Alternar isolamento solo no canal ativo
- **M:** Silenciar tudo / reativar som global
- **Setas Cima / Direita:** Aumentar volume em passos de 5%
- **Setas Baixo / Esquerda:** Diminuir volume em passos de 5%
- **A / B:** Alternar instantaneamente entre os perfis de mixagem A e B
- **Espaço:** Ativar som inicial ou silenciar/desilenciar
- **Escape:** Fechar modais abertos
- **Tab / Shift+Tab:** Navegação completa por teclado com foco visível

---

## 🔒 Privacidade e Ética
- Sem coleta de dados pessoais, sem telemetria remota e sem uso de microfone.
- Sem diagnóstico ou conclusões psicológicas automáticas.
- *"Apenas descrição. O significado é de quem cria."*
