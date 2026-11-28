# 091 — Expedição pelo Igarapé

Experiência 3D interativa em **Three.js (WebGL) + React + TypeScript** de navegação em canoa amazônica por um igarapé de águas escuras, com observação de fauna nativa, fotografia no diário naturalista, atracagem em margens autorizadas, física de correnteza e iluminação atmosférica.

## Como executar

```bash
npm install
npm run dev      # servidor local na porta 3000
npm run build    # gera bundle de produção em dist/
npx tsx --test src/sim/simulation.test.ts  # testes automatizados da simulação
```

Parâmetros de URL suportados:
- `?autostart=1` — entra diretamente na expedição (pula a tela inicial).
- `?embed=1` — habilita envio de `postMessage({ tipo: 'sair', origem: 'expedicao-igarape' })` e escuta `pausar`, `retomar`, `mute` e `reset` do launcher pai.

## Controles

- **Remar / Navegar:** `W`/`S` ou `↑`/`↓` (avançar/frear), `A`/`D` ou `←`/`→` (virar), clique na água esquerda/direita (remada lateral), ou controles direcionais no celular.
- **Olhar / Orbitar:** arrastar com mouse ou toque; roda do mouse aproxima/afasta na vista externa.
- **Observar & Fotografar:** `Tab` ou `O` (ou botão **Observar**), arraste para enquadrar um animal e pressione `Espaço` / clique em **Fotografar**.
- **Atracar / Desatracar:** `E` quando próximo de uma das 3 margens autorizadas e em baixa velocidade.
- **Câmera:** `C` ou botão no canto inferior direito alterna **Primeira Pessoa** ↔ **Vista Externa**.
- **Interface & Áudio:** `H` recolhe/exibe controles, `M` silencia áudio, `P`/`Esc` pausa ou fecha painéis, `R` reinicia expedição.

## Modelo físico e aproximações didáticas

- **Correnteza vetorial (`src/sim/river.ts`):** perfil analítico parabólico ao longo do canal sinuoso (0,16–0,62 m/s), mais intenso no centro e mais calmo junto às margens e na lagoa final.
- **Hidrodinâmica planar (`src/sim/physics.ts`):** integração de passo fixo (`60 Hz`, substeps limitados a 4) com arrasto linear e quadrático separado em eixo longitudinal (quilha) e lateral, além de impulsos discretos de remada.
- **Flutuação:** balanço harmônico aproximado de *heave*, *pitch* e *roll* proporcional à velocidade, guinada e mergulho do remo (não é CFD 3D).
- **Colisão de margens:** projeção contínua na largura navegável do canal com deslizamento tangencial, impedindo a canoa de atravessar qualquer margem.

## Manifesto de assets e licenças

Todos os recursos visuais e sonoros são **100% gerados proceduralmente em tempo de execução** (zero dependências externas ou arquivos quebrados):
- **Geometria 3D (`src/engine/model.ts`):** canoa amazônica escavada, remo, mochila de lona, corda enrolada, samaúma com raízes tabulares, estações de atracagem e 7 espécies de fauna nativa (*Arara-canindé, Capivara, Borboleta Morpho-azul, Garça-branca-grande, Tucano-toco, Preguiça-de-três-dedos, Boto-cor-de-rosa*).
- **Texturas PBR (`src/engine/pbr.ts`):** mapas periódicos sem emenda (cor sRGB, mapa de normais por diferenças centrais e rugosidade) via HTML5 Canvas 2D.
- **Áudio (`src/engine/audio.ts`):** síntese procedural Web Audio API (fluxo d’água, aves, insetos, chuva, remadas, obturador e atracagem), ativada somente após interação do usuário.
- **Bibliotecas:** Three.js (MIT), React (MIT), Lucide React (ISC), Tailwind CSS (MIT).
