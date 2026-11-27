# Rochas em Equilíbrio — Ambiente Interativo 3D Zen & Mindfulness

Ambiente tridimensional interativo e contemplativo de empilhamento de pedras de rio (*rock balancing*), projetado para práticas de atenção plena, psicologia positiva, estúdios de yoga e retiros de bem-estar.

Inspirado na estética da **Casa Seixo Yoga e Terapia**, o espaço reproduz com alto realismo um leito de rio sereno sob a luz matinal filtrada por um bambuzal denso, água rasa cristalina com cáusticas animadas e pedras fluviais com peso físico e texturas PBR orgânicas.

---

## 🧘 Visão Geral & Filosofia

- **Sem derrota, apenas recomeço**: Diferente de jogos convencionais de física punitiva, o ambiente não possui pontuação, cronômetro regressivo ou tela de *game over*. Se uma pedra desequilibrar, ela rola suavemente até o remanso do leito do rio, emitindo um plop aquático sereno e retornando ao berço de pedras.
- **Micro-interações meditativas**: Ponto de equilíbrio luminoso guia sutilmente o alinhamento do centro de massa em relação ao polígono de contato da torre.
- **Ritmo de respiração (Pranayama)**: O sistema de água e o gerador de áudio modulam uma respiração suave de 10 segundos (4s inspiração, 2s retenção, 4s expiração) sincronizada com o pulso visual das cáusticas.
- **Áudio Seguro (Safe Audio)**: Síntese procedural via Web Audio API com limitador dinâmico estrito de pico em **-24 dBFS**, garantindo ausência de estalos ou ruídos agressivos.

---

## 🚀 Como Executar

### 1. Execução Standalone (Zero Dependências)
Abra diretamente o arquivo autocontido no navegador (suporta dois cliques via `file://` ou qualquer servidor web):
```bash
# Windows
start rochas-em-equilibrio.html
```

### 2. Servidor de Desenvolvimento Local
```bash
# Iniciar servidor local com suporte a ES Modules
npm run preview
# ou diretamente via node:
node scripts/serve.mjs
```
Acesse `http://localhost:3000` no navegador.

### 3. Empacotamento do Bundle Standalone
Caso faça alterações no código-fonte modular em `src/`, gere novamente o arquivo autocontido com:
```bash
npm run pack
# ou:
node scripts/pack.mjs
```

### 4. Execução dos Testes Automatizados & Capturas
Executa a suíte de testes de ponta a ponta com Playwright, gerando métricas de performance e capturas de tela:
```bash
npm test
# ou:
node scripts/verify.mjs
```

---

## 🖥️ Modo Embutido em Iframe (`?embed=1`)

O projeto suporta integração direta em portais de marcas e aplicativos web via query parameter:
```html
<iframe 
  src="rochas-em-equilibrio.html?embed=1" 
  width="100%" 
  height="700" 
  frameborder="0" 
  allow="autoplay"
></iframe>
```

### Comportamento no modo embed:
- Oculta cabeçalho superior institucional, cards de passos e dock de pedras inferior.
- Mantém o canvas 3D responsivo com drag & drop das pedras do rio.
- Comunicação via `postMessage`:
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
| **Clique / Toque na Rocha** | Seleciona e eleva a rocha do berço fluvial |
| **Arrastar (Mouse / Touch)** | Movimenta a rocha no espaço 3D sobre a torre |
| **Roda do Mouse (Wheel)** | Gira a rocha ao longo do eixo vertical (Y) para encaixe preciso |
| **Soltar Clique / Espaço / Enter** | Deposita a rocha sobre a rocha base ou topo da torre |
| **Botão Direito + Arrastar** | Orbita a câmera ao redor da torre de pedras |
| **Teclas `1` a `6`** | Seleciona diretamente uma das 6 pedras fluviais |
| **Tecla `R`** | Reorganiza as pedras de volta ao leito do rio |
| **Tecla `E`** | Ativa / desativa o guia visual de respiração consciente |
| **Tecla `F` ou `P`** | Captura fotografia zen da composição (download em PNG limpo) |
| **Tecla `C`** | Alterna enquadramento da câmera (Foco na Torre / Visão Ampla) |
| **Tecla `M`** | Liga / desliga a paisagem sonora (leito d'água e pássaros) |
| **Tecla `Esc`** | Cancela a pedra em mãos ou fecha diálogos abertos |

---

## 🏷️ Customização de Marca (`MARCA`)

Toda a identidade visual, paleta cromática, tipografia e dados de contato são configurados no arquivo [`src/brand.js`](file:///c:/Users/aless/Downloads/Ambientes%203D/ambientes-interativos-adultos-e-marcas/ambientes-interativos-adultos-e-marcas/03_rochas-em-equilibrio/src/brand.js) e exportados no objeto global `window.MARCA`.

### Presets inclusos:
1. **`casaSeixo` (Padrão)**: Tons terrosos quentes, verde musgo zen, linho cru e ardósia fluvial.
2. **`neutro`**: Tons monocromáticos de grafite, cinza neutro e branco puro.

### Alternando presets em tempo de execução:
No console do desenvolvedor:
```javascript
// Ativar preset neutro
window.setPresetMarca('neutro');

// Retornar ao preset Casa Seixo
window.setPresetMarca('casaSeixo');
```

---

## 🏗️ Estrutura de Arquivos

```
03_rochas-em-equilibrio/
├── rochas-em-equilibrio.html      # Executável autocontido final (zero-build)
├── package.json                   # Scripts de empacotamento e testes
├── README.md                      # Esta documentação
├── VERIFICACAO.md                 # Relatório de testes, benchmarks e capturas
├── 03_rochas-em-equilibrio.md     # Especificação original do projeto
├── capturas/                      # Screenshots de verificação e métricas
│   ├── desktop-inicial.png        # Visão inicial desktop 1920x1080
│   ├── desktop-interacao.png      # Interação e empilhamento estável
│   ├── celular.png                # Responsividade mobile 390x844
│   └── medicoes.json              # Métricas de renderização (draw calls, fps)
├── scripts/                       # Ferramentas de automação
│   ├── serve.mjs                  # Servidor de preview local
│   ├── pack.mjs                   # Empacotador do bundle único
│   └── verify.mjs                 # Suíte de validação automatizada Playwright
└── src/                           # Código-fonte modular
    ├── brand.js                   # Configuração e presets de marca
    ├── rocks.js                   # Geometrias e materiais PBR procedurais de rochas
    ├── environment.js             # Vale fluvial, seixos dispersos e bambuzal
    ├── water.js                   # Sistema de água, ondas, cáusticas e pranayama
    ├── physics.js                 # Solver de equilíbrio (Rapier3D + Cinemático)
    ├── audio.js                   # Motor de áudio zen procedural com Safe Audio
    ├── scene.js                   # Cena Three.js, iluminação matinal e manifesto
    ├── style.css                  # Sistema de design responsivo e linho fosco
    ├── page.html                  # Estrutura HTML semântica e acessível
    └── app.js                     # Controlador principal e orquestração
```

---

## ⚙️ Arquitetura Técnica & Performance

- **Zero Assets Externos**: Todas as geometrias de rochas fluviais, seixos, bambuzal e leito do rio são geradas proceduralmente via simplex/FBM noise e normais centrais. Texturas de granito, arenito, basalto, musgo e estratos fluviais são sintetizadas em memória via Canvas 2D.
- **Física Dupla (Dual Engine)**: Utiliza `@dimforge/rapier3d-compat` (WASM) com hulls convexos em tempo real e fallback cinemático instantâneo de polígono de suporte quando WASM não estiver disponível.
- **Iluminação & Atmosfera**: Sol matinal direcional (`sol_manha`) com sombras suaves, luz hemisférica celeste, ambiente PMREM RoomEnvironment de reflexão de estúdio e névoa exponencial suave (`FogExp2`).
- **Performance Monitorada**:
  - Draw Calls: **16** (orçamento: < 50)
  - Triângulos: **79.234** (orçamento: < 120.000)
  - Taxa de Quadros: **60 FPS** estável
