# S3D-117 — Folha em Contraluz

Cena macro contemplativa: uma folha translúcida atravessada pelo sol. Sem placar, sem cronômetro.

## Execução
- Pelo launcher: `node Sistema/launcher/server.mjs --port 5170` → aba **Cenas 3D**.
- URL direta: `http://localhost:5170/Jogos/7%20-%20Cenas%203D/01-folha-em-contraluz/index.html`
- Dependências: `/Sistema/shared/vendor/three-r128.min.js`, `/Sistema/shared/sangi-bridge.js` (compartilhados, não alterados).

## Fluxo
Carregamento (com mensagem de erro + "Tentar novamente" se Three.js/WebGL falhar ou o contexto for perdido)
→ tutorial de 3 passos (pulável, lembrado) → exploração livre + **Diário de campo** opcional (6 descobertas)
→ pausa/retomada/reiniciar/ver tutorial → foto voluntária (PNG baixado localmente).

## Controles
| Ação | Mouse/teclado | Toque |
|---|---|---|
| Orbitar | arrastar · setas | 1 dedo |
| Zoom | scroll · `+`/`-` | pinça |
| Inspecionar | clique na folha | toque na folha |
| Empurrar folha | `Espaço` · "Tocar Folha" | botão |
| Foto | `P` · "📷 Foto" | botão |
| Pausa | `Esc` · botão ⏸ | botão |
| Som / Cinema / Câmera padrão | `M` / `H` / `R` | botões |

## Mecânicas adicionadas (S3D-117)
- **Contraluz medida**: métrica 0–1 (sol atrás da folha × proximidade em tela), exibida no diário; meta só conta após o visitante mover o sol.
- **Inspeção**: toque classifica o ponto pelas próprias texturas procedurais (alpha → mordida/furo; faixa da nervura central; mapa de nervuras → lateral; senão lâmina) e mostra nota botânica.
- **Gotas aderentes**: 4 gotas presas à superfície da lâmina (mesma função da geometria). Escorrem quando vento + velocidade angular da folha superam a adesão (maior em gotas pequenas), convergem para a nervura central e pingam da ponta; reaparecem depois. Passo fixo 1/60 s, máx. 4 subpassos. Aproximação visual, não simulação de fluidos.
- **Pecíolo**: folha e pecíolo compartilham o mesmo pivô; ângulos da mola limitados (±0,55/±0,6 rad) — a lâmina dobra mas nunca se separa nem vira.
- **Qualidade** LOW/BALANCED/HIGH/AUTO (pixel ratio, nº de bokeh, partículas). AUTO ajusta por média de frame time com histerese. Aceita `SET_QUALITY` do host.
- **Ciclo de vida**: pausa do host, do usuário e aba oculta são independentes; `RESET` volta sol/vento/bokeh/câmera/gotas (diário é preservado); `DISPOSE` libera GPU/áudio/listeners.
- **Acessibilidade**: alvos ≥44 px em `pointer: coarse`, foco visível, alternativas de teclado a gestos, `prefers-reduced-motion` reduz balanço, áudio só após gesto.
- **Persistência** (`localStorage` `sangi.s3d117.folha.v1`): tutorial visto, diário, qualidade, diário recolhido. Dados inválidos/bloqueados são ignorados.

## QA
Hook somente-leitura `window.__S3D117__` (`stats`, `backlight`, `goals`, `dew`, `petioleGap`, `lastPhotoMean`…). Ver `RELATORIO_QA.md`.
