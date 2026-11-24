# Relatório de Análise e Mapeamento de Arquitetura — Sangi3D

**Subagente**: `explorer_survey_1`  
**Data**: 2026-11-24  
**Objetivo**: Mapear a arquitetura da plataforma Sangi3D, estrutura de catálogos, regras de validação automatizada, ciclo de vida da ponte (`sangi-bridge`), contratos de ciclo de vida e padrões dos ambientes de referência para orientar a implementação dos 17 ambientes conceituais pendentes.

---

## 1. Observation

### 1.1 Estrutura do Repositório e Scripts de Servidor/Validação
- **Diretório Raiz**: `c:\Users\aless\Downloads\Ambientes 3D`
- **Pastas Principais**:
  - `launcher/`: Contém `server.mjs`, `builder.mjs`, `loading.html`, `index.html` e `capas/`.
  - `scripts/`: Ferramentas de verificação e manutenção (`verify-catalog.mjs`, `smoke-test.mjs`, `inspect-pending.mjs`, `generate-catalog.mjs`, `prepare-online-build.mjs`, `sync-imersivo.mjs`).
  - `shared/`: Ponte universal e utilitários compartilhados (`sangi-bridge.js`, `ambientes-kit.js`, `imersivo.js`, `engine/renderer.js`, `engine/lighting.js`, `engine/materials.js`, `engine/physics.js`).
  - `api/`: Manifesto principal `apps.json` (97 entradas no total).
  - `launcher/api/`: Espelho direto de `apps.json`.
  - `Kit_17_jogos_3D_mockups_e_prompts/`: 17 diretórios (9 prontos compilados com Vite, 8 conceitos pendentes com `PROMPT.md` e mockups).
  - `ambientes-interativos-adultos-e-marcas/ambientes-interativos-adultos-e-marcas/`: 13 diretórios (4 prontos em HTML/esbuild, 9 conceitos pendentes com especificações `.md`).
  - `01_Jogos_HTML/`: Ambientes autocontidos em HTML único (como `oficina-do-ritmo/oficina-do-ritmo.html`).
  - `02_Projetos/`: Projetos em módulos.
  - `03_Colecoes/Expressao_e_Desenvolvimento/`: 15 projetos prontos.
  - `04-tear-dos-vinculos/`: Projeto com Vite.
  - `00_Organizacao/`: Documentação de catálogo, inventário e pendências (`PENDENTES.md`, `CATALOGO.html`, `prompts-e-status.csv`).

### 1.2 Regras de Validação de Catálogo (`scripts/verify-catalog.mjs`)
Arquivo inspecionado: `scripts/verify-catalog.mjs` (linhas 6-123).
- **Arquivos validados**:
  ```javascript
  const CATALOG_PATHS = [
    path.join(ROOT, 'api', 'apps.json'),
    path.join(ROOT, 'launcher', 'api', 'apps.json')
  ];
  ```
- **Critérios de Validação**:
  1. **Existência física e integridade do JSON**: Ambos os arquivos devem existir e ser arrays JSON parseáveis.
  2. **Identificador único e estável (`id`)**: Cada entrada deve conter campo `id` não-vazio. Se `idSet.has(app.id)`, acusa erro fatal `ID duplicado detectado: "${app.id}"`.
  3. **Autorreferência ao Launcher**: Se `app.name === 'Ambientes' || app.url === '/index.html' || app.url === 'index.html' || app.path === 'index.html'`, acusa erro fatal de autorreferência.
  4. **Status**:
     - `ready`: Ambientes executáveis prontos.
     - `concept`: Conceitos/prompts não implementados.
  5. **Verificação de arquivo no disco para status `ready`**:
     ```javascript
     const cleanUrl = app.url.split('?')[0].split('#')[0];
     const localFile = path.join(ROOT, decodeURIComponent(cleanUrl).replace(/^\//, ''));
     if (!fs.existsSync(localFile)) {
       const altFile = path.join(ROOT, 'launcher', decodeURIComponent(cleanUrl).replace(/^\//, ''));
       if (!fs.existsSync(altFile)) {
         logWarning(`Arquivo de execução não encontrado no disco para "${app.name}" (${app.id}): ${cleanUrl}`);
         missingFiles++;
       }
     }
     ```
  6. **Unicidade de URL**: Duas entradas com IDs distintos não podem apontar para a mesma `cleanUrl`.
  7. **Conceito sem URL ativa**: Se `app.status === 'concept' && app.url`, emite aviso `Conceito com URL de execução ativa`.
- **Execução atual**:
  `node scripts/verify-catalog.mjs` relata:
  - Total listadas: 97
  - Prontos (ready): 80
  - Conceitos (concept): 17
  - Legado/arquivado: 15
  - Autorreferências: 0
  - Arquivos ausentes: 0
  - Total erros: 0, Total avisos: 0 (código de saída 0).

### 1.3 Smoke Test (`scripts/smoke-test.mjs`)
Arquivo inspecionado: `scripts/smoke-test.mjs` (linhas 8-93).
- **Mecanismo**:
  1. Lê `api/apps.json` e filtra `readyApps = apps.filter(a => a.status === 'ready' && a.url)`.
  2. Spawna servidor local de teste em processo filho: `node launcher/server.mjs --port 5178`.
  3. Aguarda detecção de string `http://` no stdout do servidor (timeout de 8 s).
  4. Dispara requisição HTTP GET para `/api/apps`, validando código HTTP 200.
  5. Itera por todas as `readyApps` fazendo requisição HTTP GET para cada `app.url`.
  6. Valida `res.status >= 200 && res.status < 400 && res.length > 0`.
  7. Finaliza o processo do servidor e encerra com código 0 (sucesso) ou 1 (falha).
- **Execução atual**:
  80 de 80 rotas executáveis responderam com HTTP 200 OK em ~1 segundo.

### 1.4 Contrato da Ponte Universal de Ciclo de Vida (`shared/sangi-bridge.js` e `shared/ambientes-kit.js`)
Arquivos inspecionados: `shared/sangi-bridge.js` (linhas 1-68) e `shared/ambientes-kit.js` (linhas 1-446).
- **Mensagem disparada pela aplicação para a plataforma** (`window.parent.postMessage`):
  - Tipo: `SANGI_APP_READY`
  - Payload padrão:
    ```javascript
    {
      type: 'SANGI_APP_READY',
      title: document.title,
      href: location.pathname,
      capabilities: {
        webgl2: !!window.WebGL2RenderingContext,
        touch: 'ontouchstart' in window,
        audio: !!(window.AudioContext || window.webkitAudioContext),
      }
    }
    ```
- **Mensagens recebidas pela aplicação** (`window.addEventListener('message')`):
  1. `SANGI_APP_PAUSE`:
     - Efeito: Atribui `window.__SANGI_PAUSED__ = true` e dispara `CustomEvent('sangi:pause')`.
     - Ação esperada: Suspender loop de renderização (RAF) e áudio.
  2. `SANGI_APP_RESUME`:
     - Efeito: Atribui `window.__SANGI_PAUSED__ = false` e dispara `CustomEvent('sangi:resume')`.
     - Ação esperada: Retomar loop de renderização e áudio.
  3. `SANGI_APP_MUTE`:
     - Efeito: Recebe `e.data.muted` (booleano), atribui `window.__SANGI_MUTED__` e dispara `CustomEvent('sangi:mute', { detail: { muted } })`.
     - Ação esperada: Silenciar ou restaurar o ganho mestre da Web Audio API com rampa suave.
  4. `SANGI_APP_DISPOSE`:
     - Efeito: Atribui `window.__SANGI_DISPOSED__ = true`, dispara `CustomEvent('sangi:dispose')` e executa perda forçada de contexto WebGL em todos os canvas (`gl.getExtension('WEBGL_lose_context')?.loseContext()`).
     - Ação esperada: Destruir geometrias, materiais, texturas, buffers e event listeners para liberar GPU e memória RAM.
- **Utilitários em `shared/ambientes-kit.js`**:
  - `injectLauncherButton({ label, href })`: Injeta botão estilizado flutuante `← Launcher` no canto superior esquerdo.
  - `ZenAudioEngine`: Gerador procedural de áudio zen em Web Audio API sem arquivos externos (`playShears()`, `playWireTension()`, `playChime()`, `playStoneTap()`, `startWind()`).
  - `capturePhoto({ canvas, renderer, scene, camera, title, hankoText, filename, hideElementsSelector })`: Oculta interface DOM, renderiza frame limpo, adiciona carimbo tradicional Hanko e baixa PNG.
  - `setupEnvironmentLifecycle({ onPause, onResume, onReducedMotionChange })`: Monitora `visibilitychange` da aba e acessibilidade (`prefers-reduced-motion`).
  - `setupSangiBridge({ id, capabilities, onPause, onResume, onMute, onDispose })`: Encapsula a escuta dos eventos da ponte e emite o `SANGI_APP_READY`.
  - `disposeScene(renderer, scene)` e `disposeMaterial(mat)`: Descarte profundo de cenas Three.js, percorrendo materiais e mapas de textura (`map`, `normalMap`, `roughnessMap`, `envMap`, etc.).
- **Utilitários em `shared/engine/`**:
  - `EngineRenderer`: Gerenciador de WebGLRenderer com suporte a sRGB/SRGBColorSpace, ACESFilmicToneMapping, PCFShadowMap e redimensionamento automático.
  - `LightingRig`: Presets de iluminação (`warm_studio`, `sunset`, `night`, `dawn`) com luz hemisférica e direcional geradora de sombras suaves.
  - `MaterialFactory`: Geração procedural de texturas de madeira e ruído em canvas 2D, e materiais PBR (`wood`, `brass`, `metal`, `glass` via `MeshPhysicalMaterial`, `stone`).
  - `PhysicsSolver`: Mola amortecida harmônica (`addSpring`), onda em superfície líquida 2D por heightfield (`createHeightfieldWave`), e cadeia de simulação Verlet (`createVerletChain`).

### 1.5 Mapeamento dos 17 Ambientes Conceituais no Catálogo
Verificação realizada em `api/apps.json`: exatamente as 17 entradas com `status: "concept"`, `url: null` e `isConcept: true`:

| # | Coleção | ID Atual no Catálogo | Nome | Ordem | Caminho no Disco |
|---|---|---|---|---|---|
| #20 | Kit 17 jogos 3D | `kit_17_jogos_3d_mockups_e_prompts-04-observatorio-da-luz` | Observatório da Luz | 4 | `Kit_17_jogos_3D_mockups_e_prompts\04-observatorio-da-luz` |
| #21 | Kit 17 jogos 3D | `kit_17_jogos_3d_mockups_e_prompts-05-oficina-do-tempo` | Oficina do Tempo | 5 | `Kit_17_jogos_3D_mockups_e_prompts\05-oficina-do-tempo` |
| #22 | Kit 17 jogos 3D | `kit_17_jogos_3d_mockups_e_prompts-06-torre-do-impulso` | Torre do Impulso | 6 | `Kit_17_jogos_3D_mockups_e_prompts\06-torre-do-impulso` |
| #23 | Kit 17 jogos 3D | `kit_17_jogos_3d_mockups_e_prompts-07-ilha-das-pausas` | Ilha das Pausas | 7 | `Kit_17_jogos_3D_mockups_e_prompts\07-ilha-das-pausas` |
| #25 | Kit 17 jogos 3D | `kit_17_jogos_3d_mockups_e_prompts-09-estacao-das-trocas` | Estação das Trocas | 9 | `Kit_17_jogos_3D_mockups_e_prompts\09-estacao-das-trocas` |
| #29 | Kit 17 jogos 3D | `kit_17_jogos_3d_mockups_e_prompts-13-museu-dos-pontos-de-vista` | Museu dos Pontos de Vista | 13 | `Kit_17_jogos_3D_mockups_e_prompts\13-museu-dos-pontos-de-vista` |
| #30 | Kit 17 jogos 3D | `kit_17_jogos_3d_mockups_e_prompts-14-estudio-dos-limites` | Estúdio dos Limites | 14 | `Kit_17_jogos_3D_mockups_e_prompts\14-estudio-dos-limites` |
| #32 | Kit 17 jogos 3D | `kit_17_jogos_3d_mockups_e_prompts-16-teatro-das-historias-possiveis` | Teatro das Histórias Possíveis | 16 | `Kit_17_jogos_3D_mockups_e_prompts\16-teatro-das-historias-possiveis` |
| #59 | Adultos e marcas | `ambientes-interativos-adultos-e-marcas-ambientes-interativos-adultos-e-marcas-04_maquina-de-escrever-das-intencoes` | Máquina de Escrever das Intenções | 4 | `ambientes-interativos-adultos-e-marcas\ambientes-interativos-adultos-e-marcas\04_maquina-de-escrever-das-intencoes` |
| #60 | Adultos e marcas | `ambientes-interativos-adultos-e-marcas-ambientes-interativos-adultos-e-marcas-05_clepsidra-do-foco` | Clepsidra do Foco | 5 | `ambientes-interativos-adultos-e-marcas\ambientes-interativos-adultos-e-marcas\05_clepsidra-do-foco` |
| #61 | Adultos e marcas | `ambientes-interativos-adultos-e-marcas-ambientes-interativos-adultos-e-marcas-07_copos-musicais` | Copos Musicais | 7 | `ambientes-interativos-adultos-e-marcas\ambientes-interativos-adultos-e-marcas\07_copos-musicais` |
| #62 | Adultos e marcas | `ambientes-interativos-adultos-e-marcas-ambientes-interativos-adultos-e-marcas-08_toca-discos-de-vinil` | Toca-Discos de Vinil | 8 | `ambientes-interativos-adultos-e-marcas\ambientes-interativos-adultos-e-marcas\08_toca-discos-de-vinil` |
| #63 | Adultos e marcas | `ambientes-interativos-adultos-e-marcas-ambientes-interativos-adultos-e-marcas-10_maquina-de-reacao-em-cadeia` | Máquina de Reação em Cadeia | 10 | `ambientes-interativos-adultos-e-marcas\ambientes-interativos-adultos-e-marcas\10_maquina-de-reacao-em-cadeia` |
| #64 | Adultos e marcas | `ambientes-interativos-adultos-e-marcas-ambientes-interativos-adultos-e-marcas-11_relogio-aberto` | Relógio Aberto | 11 | `ambientes-interativos-adultos-e-marcas\ambientes-interativos-adultos-e-marcas\11_relogio-aberto` |
| #66 | Adultos e marcas | `ambientes-interativos-adultos-e-marcas-ambientes-interativos-adultos-e-marcas-14_bancada-da-manicure` | Bancada da Manicure | 14 | `ambientes-interativos-adultos-e-marcas\ambientes-interativos-adultos-e-marcas\14_bancada-da-manicure` |
| #67 | Adultos e marcas | `ambientes-interativos-adultos-e-marcas-ambientes-interativos-adultos-e-marcas-15_barista-de-bancada` | Barista de Bancada | 15 | `ambientes-interativos-adultos-e-marcas\ambientes-interativos-adultos-e-marcas\15_barista-de-bancada` |
| #68 | Adultos e marcas | `ambientes-interativos-adultos-e-marcas-ambientes-interativos-adultos-e-marcas-18_orgao-do-perfumista` | Órgão do Perfumista | 18 | `ambientes-interativos-adultos-e-marcas\ambientes-interativos-adultos-e-marcas\18_orgao-do-perfumista` |

### 1.6 Análise dos Padrões de Ambientes de Referência
Foram inspecionadas 3 famílias de ambientes totalmente funcionais:

1. **Kit 17 Jogos 3D (ex.: `01-cartografia-dos-sons` e `02-atlas-das-texturas`)**:
   - Arquitetura: Projeto Vite + TypeScript com empacotamento em `dist/`.
   - Importação Three.js: Bundled internamente pelo Vite (`base: './'`), gerando ativos estáticos com caminhos relativos em `dist/assets/`.
   - Renderização: `THREE.WebGLRenderer`, `toneMapping: THREE.ACESFilmicToneMapping`, `outputColorSpace: THREE.SRGBColorSpace`, sombras suaves `THREE.PCFSoftShadowMap`.
   - Áudio: Motor Web Audio sintetizado (`soundEngine.ts`) com nós de ganho espaciais e osciladores.
   - Interface: HUD em DOM sobreposto (`ui/hud.ts`), com layout CSS responsivo para desktop e mobile (`safe-area-inset`, botões touch ≥ 44px).
   - Integração Ponte: `window.parent.postMessage({ type: 'SANGI_APP_READY' })` ao carregar a cena, e emissão de eventos de ciclo de vida.

2. **Adultos e Marcas (ex.: `01_sala-de-espera-sonora` e `12_pinball-de-madeira`)**:
   - Arquitetura: Arquivo HTML de entrada servido diretamente pelo servidor. Em `12_pinball-de-madeira`, há script `scripts/pack.mjs` que usa `esbuild` para compilar código TypeScript/ESM e gerar o bundle HTML completo com fontes base64.
   - Física: Rapier2D / física rígida 2D ou equações cinemáticas analíticas.
   - PBR: Uso de materiais padrão/físicos com texturas procedurais geradas via Canvas 2D (`CanvasTexture`).

3. **Ambientes Autocontidos em HTML único (ex.: `oficina-do-ritmo.html` e `Colmeia Transparente.html`)**:
   - Arquitetura: Arquivo único `.html` de alta robustez com CSS, HTML DOM e JavaScript integrados.
   - Importação Three.js: Módulos ES via `<script type="importmap">`:
     ```html
     <script type="importmap">
     {
       "imports": {
         "three": "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js",
         "three/addons/": "https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/"
       }
     }
     </script>
     ```
     Possui suporte a fallback local e modo esquemático caso o WebGL não esteja disponível.
   - Áudio: 100% procedural com Web Audio API nativa sem requisição de arquivos externos.
   - Servidor local: Como o servidor `launcher/server.mjs` bloqueia requisições HTTP para caminhos contendo `node_modules` (linha 338), soluções em HTML único com import map ou arquivos empacotados com scripts inline/dist resolvem o runtime sem quebras de rota HTTP 404.

---

## 2. Logic Chain

1. **Passo 1 (Validação)**: A verificação em `scripts/verify-catalog.mjs` exige que toda entrada com `status: 'ready'` possua uma rota `url` válida apontando para um arquivo existente no disco (seja em `ROOT` ou em `launcher/`).
2. **Passo 2 (Smoke Test)**: `scripts/smoke-test.mjs` inicializa `launcher/server.mjs` e submete cada `app.url` de `status === 'ready'` a uma requisição HTTP. O servidor atende arquivos estáticos mapeando diretamente `pathname` relativo a `ROOT` (`c:\Users\aless\Downloads\Ambientes 3D`).
3. **Passo 3 (Segurança e Módulos)**: O servidor bloqueia ativamente requisições para URLs contendo `node_modules` (`if (p.split(sep).includes('node_modules')) { res.writeHead(404); return; }`). Portanto, qualquer aplicação web executada diretamente no navegador deve possuir dependências empacotadas (bundled), usar import maps para ES modules via CDN/vendor seguro, ou ser autocontida em arquivo HTML executável.
4. **Passo 4 (Contrato de Ciclo de Vida)**: Para que as experiências interajam perfeitamente com o Launcher do Sangi3D, é imperativo que cada ambiente:
   - Notifique a prontidão via `window.parent.postMessage({ type: 'SANGI_APP_READY', ... }, '*')`.
   - Implemente listeners para `SANGI_APP_PAUSE`, `SANGI_APP_RESUME`, `SANGI_APP_MUTE` e `SANGI_APP_DISPOSE` (conforme implementado em `shared/sangi-bridge.js` e `shared/ambientes-kit.js`).
5. **Passo 5 (Atualização dos Manifestos)**: Os 17 ambientes já possuem entradas pré-cadastradas nos manifestos `api/apps.json` e `launcher/api/apps.json` com `status: "concept"`. Ao implementar cada ambiente, o manifesto deve ser atualizado para `"status": "ready"`, `"kind": "html"` (ou `"project"`), definindo a `url` correta para o arquivo executável no disco e removendo `"isConcept": true`.
6. **Passo 6 (Sincronização Online e Local)**: O script `scripts/prepare-online-build.mjs` espelha o conteúdo do diretório raiz para `launcher/` e sincroniza os manifestos `api/apps.json` e `launcher/api/apps.json`. Portanto, manter ambos os manifestos perfeitamente espelhados garante conformidade em desenvolvimento e em produção.

---

## 3. Caveats

1. **Dependências Externas em Runtime**: O uso de import maps apontando para CDNs (ex.: `cdn.jsdelivr.net`) funciona em ambientes com acesso à internet, mas em cenários estritamente offline sem cache prévio, a plataforma prevê fallback ou bundles locais com caminhos relativos (como o `dist/` do Vite ou compilação esbuild).
2. **Imagens de Capa (`capas/`)**: Nem todos os conceitos possuem webp na pasta `launcher/capas/` (alguns apontam para `mockup.png` local ou imagem webp específica na pasta do app). `verify-catalog.mjs` não quebra na ausência de capa, mas recomenda-se manter a referência correta do mockup como `thumb`.
3. **Execução de Build sob Demanda**: O servidor `launcher/server.mjs` possui uma rota `/play/<id>` com builder sob demanda (`launcher/builder.mjs`), mas para o modo produção estático e smoke-test, rotas com `url` direta para o arquivo HTML executável são mais previsíveis e não dependem do tempo de build em runtime.

---

## 4. Conclusion

- A plataforma Sangi3D possui uma arquitetura clara e padronizada.
- Os 17 ambientes pendentes estão identificados com precisão nos manifestos `api/apps.json` e `launcher/api/apps.json`, onde atualmente aguardam como `concept`.
- A implementação dos 17 ambientes deve ser organizada nos dois lotes:
  - **Lote 1 (8 ambientes - Kit 17 Jogos 3D)**: Pastas `Kit_17_jogos_3D_mockups_e_prompts/04-...`, `05-...`, `06-...`, `07-...`, `09-...`, `13-...`, `14-...`, `16-...`.
  - **Lote 2 (9 ambientes - Adultos e Marcas)**: Pastas `ambientes-interativos-adultos-e-marcas/ambientes-interativos-adultos-e-marcas/04_...`, `05_...`, `07_...`, `08_...`, `10_...`, `11_...`, `14_...`, `15_...`, `18_...`.
- Cada ambiente deve fornecer seu arquivo executável principal (ex.: `index.html`), integrar a ponte universal `sangi-bridge`, implementar renderização PBR Three.js com sombras suaves e adaptação de layout mobile/desktop, síntese de áudio Web Audio responsiva e simulação física estável.
- Ao atualizar o status dos 17 ambientes para `ready` e registrar seus caminhos em `api/apps.json` e `launcher/api/apps.json`, `verify-catalog.mjs` e `smoke-test.mjs` atestarão a conclusão com 97 rotas ativas e zero erros.

---

## 5. Verification Method

Para verificar de forma independente e contínua as afirmações deste relatório:

1. **Validação do Catálogo**:
   ```powershell
   node scripts/verify-catalog.mjs
   ```
   *Critério de aceitação*: Zero erros (`❌ [ERRO]`), zero autorreferências e zero arquivos ausentes.

2. **Teste de Fumaça das Rotas HTTP**:
   ```powershell
   node scripts/smoke-test.mjs
   ```
   *Critério de aceitação*: Todas as rotas de apps prontos retornam código HTTP 200 OK e tamanho > 0 bytes.

3. **Inspeção das Pastas Pendentes**:
   ```powershell
   node scripts/inspect-pending.mjs
   ```
   *Critério de aceitação*: Lista os arquivos físicos presentes nas 8 pastas do Kit 17 e nas 9 pastas de Adultos e Marcas.
