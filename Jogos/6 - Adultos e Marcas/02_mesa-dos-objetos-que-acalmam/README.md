# Mesa dos Objetos que Acalmam — Ambiente Interativo 3D Zen & Sensorial

Ambiente tridimensional interativo de alto realismo focado em pausas contemplativas, desaceleração do sistema nervoso e mindfulness sensorial para psicologia, terapia ocupacional, spas e escritórios.

Inspirado na identidade visual da **Clínica Ponto Quieto**, o espaço reproduz com fidelidade fotorealista uma mesa de nogueira escura iluminada pela luz lateral dourada de fim de tarde filtrada por uma persiana veneziana, projetando faixas suaves de sombra sobre os quatro objetos de foco sensorial: **pêndulo de areia**, **berço de Newton**, **ampulheta líquida** e **tigela tibetana**.

---

## 🧘 Visão Geral & Filosofia

- **Mecânica pura sem metas**: Ninguém precisa "fazer certo". Não há placar, contagem regressiva nem tela de erro. É uma experiência tátil, mecânica e calmante.
- **Os 4 Objetos Sensoriais**:
  1. **Pêndulo de Areia**: Oscilador harmônico 2D acoplado com frequências ligeiramente distintas que traça rosáceas e curvas de Lissajous orgânicas em um heightmap dinâmico de areia zen, com reentrâncias e sombras finas.
  2. **Berço de Newton**: 5 esferas espelhadas suspensas em V com simulação analítica de conservação de momento, colisões elásticas e cliques metálicos cristalinos.
  3. **Ampulheta Líquida**: Cilindro de acrílico com fluidos imiscíveis em dois tons (âmbar e azul oceano). Ao toque, gira suavemente 180° invertendo o fluxo de gotas relaxantes.
  4. **Tigela Tibetana**: Bronze martelado sobre almofada de brocado carmim. Toque simples emite sino modal com batimentos inarmônicos; gesto circular na borda com o bastão produz canto harmônico contínuo proporcional à velocidade.
  5. **Rastelo Zen ("Alisar areia")**: Rastelo em miniatura que atravessa a bandeja alisando suavemente o traçado na areia para um novo começo.
- **Áudio Seguro (Safe Audio)**: Síntese de áudio procedural via Web Audio API com limitador dinâmico estrito de pico em **-24 dBFS**, garantindo ausência de estalos ou ruídos agressivos.

---

## 🚀 Como Executar

### 1. Execução Standalone (Zero Dependências)
Abra diretamente o arquivo autocontido no navegador (funciona via duplo clique em `file://` ou em qualquer servidor HTTP sem necessidade de build):
```bash
# Windows
start mesa-dos-objetos-que-acalmam.html
```

### 2. Servidor de Desenvolvimento Local
```bash
# Iniciar servidor local
npm run preview
# ou via node:
node scripts/serve.mjs
```
Acesse `http://localhost:4420` no navegador.

### 3. Empacotamento do Bundle Standalone
Caso altere módulos em `src/`, gere novamente o arquivo autocontido com:
```bash
npm run pack
# ou:
node scripts/pack.mjs
```

### 4. Execução dos Testes Automatizados & Capturas
Executa a suíte de ponta a ponta com Playwright, gerando métricas de performance e capturas de tela:
```bash
npm test
# ou:
node scripts/verify.mjs
```

---

## 🖥️ Modo Embutido em Iframe (`?embed=1`)

O projeto pode ser integrado diretamente em portais de marcas e aplicativos web via query parameter:
```html
<iframe 
  src="mesa-dos-objetos-que-acalmam.html?embed=1" 
  width="100%" 
  height="700" 
  frameborder="0" 
  allow="autoplay"
></iframe>
```

### Comportamento no modo embed:
- Oculta automaticamente a barra de navegação superior institucional.
- Mantém a cena 3D interativa, o título editorial e o dock sensorial.
- Ao clicar no botão de ação, envia evento seguro via `postMessage`:
  ```javascript
  window.addEventListener('message', (event) => {
    if (event.data?.tipo === 'cta') {
      console.log('Ação do usuário no ambiente 3D:', event.data.acao);
    }
  });
  ```

---

## 🎮 Controles & Atalhos

| Entrada | Ação |
| :--- | :--- |
| **Arrastar no Pêndulo** | Define direção e força inicial para desenhar na areia |
| **Arrastar Esferas de Newton** | Puxa 1 a 3 esferas e solta para transferir momento |
| **Clique na Ampulheta** | Gira 180° invertendo o fluxo de gotas líquidas |
| **Toque na Tigela** | Golpeia a tigela com o bastão para emitir sino modal |
| **Gesto Circular na Borda** | Faz a tigela tibetana cantar continuamente por fricção |
| **Roda do Mouse (Wheel)** | Zoom e ajuste fino do enquadramento |
| **Botão Direito + Arrastar** | Orbita a câmera suavemente ao redor da mesa |
| **Teclas `1` a `4`** | Foco imediato nos objetos sensoriais |
| **Espaço / Enter** | Dá impulso inicial ao pêndulo de areia |
| **Tecla `R` ou `A`** | Passa o rastelo alisando a areia zen |
| **Tecla `C`** | Alterna enquadramento da câmera (Geral, Pêndulo, Berço, Ampulheta, Tigela) |
| **Tecla `M`** | Liga / desliga o som relaxante |
| **Tecla `F` ou `P`** | Captura fotografia zen da mesa (download em PNG limpo) |
| **Tecla `Esc`** | Fecha modais abertos e retorna à visão geral |

---

## 🏷️ Customização de Marca (`MARCA`)

Toda a identidade visual, paleta cromática, tipografia e acentos dos materiais 3D são configurados em [`src/brand.js`](file:///c:/Users/aless/Downloads/Ambientes%203D/ambientes-interativos-adultos-e-marcas/ambientes-interativos-adultos-e-marcas/02_mesa-dos-objetos-que-acalmam/src/brand.js) e exportados no objeto global `window.MARCA`.

### Presets inclusos:
1. **`pontoQuieto` (Padrão)**: Tons terrosos de nogueira, latão dourado, linho cru e brocado carmim.
2. **`neutro`**: Tons monocromáticos de ardósia, grafite escuro, aço escovado e linho claro.

### Alternando presets em tempo de execução:
No console do desenvolvedor:
```javascript
// Ativar preset neutro
window.setPresetMarca('neutro');

// Retornar ao preset Clínica Ponto Quieto
window.setPresetMarca('pontoQuieto');
```

---

## 🏗️ Estrutura de Arquivos

```
02_mesa-dos-objetos-que-acalmam/
├── mesa-dos-objetos-que-acalmam.html  # Executável autocontido final (zero-build)
├── package.json                       # Scripts de automação e dependências
├── README.md                          # Esta documentação
├── VERIFICACAO.md                     # Relatório de testes, benchmarks e capturas
├── 02_mesa-dos-objetos-que-acalmam.md # Especificação original do projeto
├── capturas/                          # Screenshots de verificação e métricas
│   ├── desktop-inicial.png            # Visão inicial desktop 1440x810 (Mockup 1)
│   ├── desktop-interacao.png          # Momento de interação do pêndulo (Mockup 2)
│   ├── celular.png                    # Responsividade mobile 390x844 (Mockup 3)
│   └── medicoes.json                  # Métricas de renderização (draw calls, fps)
├── scripts/                           # Ferramentas de automação
│   ├── serve.mjs                      # Servidor de preview local
│   ├── pack.mjs                       # Empacotador do bundle único
│   └── verify.mjs                     # Suíte de validação automatizada Playwright
└── src/                               # Código-fonte modular
    ├── brand.js                       # Configuração e presets de marca
    ├── textures.js                    # Texturas PBR procedurais e heightmap dinâmico
    ├── objects.js                     # Modelagem procedural dos 4 objetos e persiana
    ├── physics.js                     # Motores analíticos (Lissajous, Newton, Gotas, Tigela)
    ├── audio.js                       # Síntese sonora procedural com Safe Audio
    ├── scene.js                       # Cena Three.js, iluminação solar e manifesto
    ├── style.css                      # Sistema de design papel linho e vidro fosco
    ├── page.html                      # Estrutura HTML semântica e acessível
    └── app.js                         # Controlador principal e orquestração
```

---

## ⚙️ Arquitetura Técnica & Performance

- **Zero Assets Externos**: Todas as geometrias de madeira, metais, areia, persiana e folhagem são geradas proceduralmente. Texturas de nogueira, latão escovado, bronze martelado e brocado são sintetizadas via Canvas 2D.
- **Faixas de Sombra Motivadas**: 26 lâminas físicas de persiana veneziana com rotação motivada projetam faixas de sombra diagonais autênticas sobre a mesa e a parede via `PCFShadowMap` de alta resolução.
- **Métricas Registradas**:
  - Draw Calls: **57 a 104** (orçamento do projeto: < 150)
  - Triângulos: **25.982** (orçamento do projeto: < 120.000)
  - Taxa de Quadros: Suave e estável em 60 FPS
