# Tear dos Vínculos

Oficina têxtil em 3D (Vite + TypeScript estrito + Three.js 0.180, WebGL 2). Verbo central: **entrelaçar**. A pessoa escolhe o fio e a espessura, passa a trama por cima ou por baixo de cada grupo de urdidura, ajusta a tensão, prende pontas, dá nós, separa um trecho com a tesoura e reconecta, e vê o tecido pronto.

Recurso expressivo complementar. Não é instrumento de avaliação, não gera escore, interpretação ou promessa de resultado clínico. O significado dos fios pertence a quem tece.

## Rodar

Requer Node.js 22 ou superior.

```powershell
npm ci
npm run dev
```

Abra `http://127.0.0.1:5194`. Para o build estático:

```powershell
npm run build
npm run preview
```

A pasta `dist/` é autocontida (HTML + assets locais, `base: './'`) e pode ser servida de qualquer subdiretório por HTTP. `file://` não é suportado. O service worker (`dist/sw.js`, versionado) guarda os arquivos visitados para uso offline depois da primeira visita. O launcher da coleção (`../launcher/server.mjs`) detecta e compila o projeto sozinho.

Parâmetros de URL: `?qualidade=cinema|equilibrada|leve|auto` força o nível nesta sessão; `?perf` mostra medições (quadro, p50/p95, chamadas, triângulos).

## Como usar

| Ferramenta | O que faz | Alternativas |
| --- | --- | --- |
| **Escolher fio** | Toque um novelo na cesta ou na doca; escolha Fina, Média ou Grossa. | ← → no painel, botões da doca |
| **Entrelaçar** | Arraste a lançadeira pela urdidura, toque nos chips 3D “cima/baixo” ao lado do próximo grupo, ou use os botões. Ao completar a passada, o pente bate a fileira. | ↑ por cima, ↓ por baixo, ⌫ desfazer cruzamento, “Completar passada” com padrão de apoio |
| **Tensionar** | Arraste a roldana à direita do tear, use o controle deslizante ou os atalhos. Toque numa fileira para ajustá-la. | + / − |
| **Separar** | Toque duas fileiras para marcar o trecho; “Cortar trecho” pede confirmação e remove só o trecho. “Reconectar” fecha a lacuna mantendo o desenho. Prenda pontas soltas (agulha) e dê nós. | lista de pontas no painel |
| **Ver tecido** | Visão próxima, revisão passo a passo, exportar PNG e resumo observável, salvar no navegador (opcional), recomeçar, sair. | — |

Barra superior: ajuda contextual, desfazer/refazer (Ctrl+Z / Ctrl+Y), visões nomeadas (V), som, ajustes, tela cheia (F), recolher HUD (H), pausa (P), sair. Esc fecha o painel. 1–5 trocam de ferramenta. No celular o painel vira bottom sheet e as ferramentas ficam na barra inferior; o centro óptico da câmera sobe para manter a área de manipulação livre.

### Modos

- **Livre** — sem etapas.
- **Padrão demonstrado** — demonstração pulável da lançadeira e pistas graduais (fio, direção, forte).
- **Tecelagem compartilhada** — passadas alternam entre pessoa A e B.
- **Experimentar tensão** — começa em Tensionar e lista as tensões das fileiras.
- **Mapa de vínculos** — nomes opcionais para cada fio, mostrados nas etiquetas dos novelos (somente em memória, salvos só se a pessoa marcar).
- **Acompanhado** — o profissional escolhe uma das 3 configurações iniciais (Faixa simples 12 fios, Listras de vínculo 18, Losangos 24), nível de pista, e registra por oportunidade: independente, com ajuda, não realizada, recusada. Nenhuma interpretação é gerada.

## Arquitetura

```
src/
  game/content.ts   fios, espessuras, padrões, configurações, convites, ajuda
  game/state.ts     tipos e estado serializável (version, seed, mode, phase, settings, sceneState, history, observations)
  game/rules.ts     comandos puros, idempotentes e validados (cross com índice, cut com confirmação…)
  game/store.ts     store único, undo/redo por snapshot, observações
  sim/verlet.ts     fio Verlet (passo fixo 1/60, dt limitado, amortecimento, limite de velocidade)
  sim/weavePath.ts  caminho da trama por/sob grupos de urdidura; tensão → curvatura e encolhimento de ourela
  scene/engine.ts   renderer, pós (GTAO só Cinema, bloom contido, OutputPass ACES/sRGB), tiers e escala adaptativa
  scene/world.ts    cena, luzes, PMREM do ateliê, câmeras nomeadas, picking, animações das ferramentas
  scene/loom.ts     tear, roldanas, catraca, urdidura com cala em shader, lançadeira, pente
  scene/fabric.ts   malha por fileira, passada ativa, fio livre, pontas, seleção, chips de cruzamento
  scene/props.ts    novelos, cesta, tesoura, agulha, fita, pote, tigela, carretéis, mantas, lavanda, etiquetas
  scene/room.ts     ateliê, janelas, terraço, campo de lavanda, colinas, céu, hera, fachos, poeira
  scene/textures.ts texturas PBR procedurais em canvas
  audio/audio.ts    síntese Web Audio com compressor/limitador e polifonia limitada
  ui/               HUD, ícones, estilo, alternativa DOM (rascunho SVG)
  persist/          preferências (localStorage) e acervo voluntário (IndexedDB)
  integration/      eventos versionados para o launcher
tests/rules.test.ts   unitários (node --test)
tests/e2e.mjs         interação automatizada (Playwright) + capturas em capturas/
manifest/             assets.json e scene.json
```

O módulo 3D é carregado sob demanda (`import('./scene/world.ts')`). Sem WebGL 2, ou após perda de contexto, a aplicação mostra um rascunho SVG funcional e a tecelagem continua pelos botões e teclado.

### Física

Fios como pontos Verlet com restrições só de tração (o fio não resiste à compressão): fio livre entre o último cruzamento e a lançadeira, e pontas soltas/atadas. Tensão encurta a folga e aumenta as iterações. As passadas concluídas usam um modelo determinístico (caminho por/sob com patamar sobre o grupo; tensão reduz a ondulação e puxa as ourelas). Rapier não foi usado: não há contatos de corpos rígidos que justifiquem o custo; o contrato permite aproximação explícita para tecidos.

## Integração com o launcher

`window.parent.postMessage` (apenas para origem local/permitida) e `CustomEvent('tear:event')` com `{ source: 'tear-dos-vinculos', version: 1, type, payload }`. Tipos: `ready`, `pause`, `resume`, `complete`, `exit`, `summary`. O `summary` contém apenas contagens (fileiras, cruzamentos, cortes, reconexões, pontas, nós, modo, duração). O pai pode enviar `{ target: 'tear-dos-vinculos', version: 1, type: 'pause'|'resume'|'exit' }`.

## Privacidade

Nada sai do dispositivo. Som começa desligado e só liga por gesto. localStorage guarda só preferências (qualidade, volume, movimento reduzido, nível de pista). Criações só vão para o IndexedDB quando a pessoa clica em “Salvar criação”, com aviso de dispositivo compartilhado; nomes dos fios só entram se marcados. “Ajustes → Apagar acervo e preferências” remove tudo.

## Testes

```powershell
npm test
npm run build
node tests/e2e.mjs
```

O E2E serve `dist/` num servidor local próprio, usa Chromium headless com SwiftShader e grava capturas e `capturas/resultado-e2e.json`. Ver `QA_REPORT.md`.
