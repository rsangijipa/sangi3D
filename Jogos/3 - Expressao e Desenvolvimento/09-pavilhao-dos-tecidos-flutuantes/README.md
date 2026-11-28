# Pavilhão dos Tecidos Flutuantes

Entre em uma instalação de seda e linho. Puxe os tecidos, mova seus apoios e experimente vento, camadas e aberturas.

Abra pelo launcher na raiz de Ambientes 3D ou sirva `dist/` por HTTP. Não é necessário CDN, conta ou conexão depois do cache instalado. Para desenvolver, `npm ci`, `npm run dev`; para exportar, `npm run build`.

Os arquivos desta pasta são independentes dos outros jogos. Nesta máquina, as dependências locais são compartilhadas na pasta superior; o build dist é autônomo.

Mouse/toque: selecionar e arrastar objetos. Câmera: arrastar fora dos objetos e zoom. Alternativas por botões e teclado nos controles. Espaço pausa; H recolhe; Esc fecha painel; Ctrl+Z desfaz. Opções oferece qualidade, captura, importação, exportação, salvamento voluntário e exclusão.

A física visual é uma aproximação para interação: não representa ensaio físico nem avaliação clínica. Sem pontuação de escolhas pessoais, microfone, analytics ou gravação automática. Consultar QA.md para os limites efetivamente verificados.

## Upgrade premium (2026-11)

- **Gráficos:** céu em gradiente com halo solar; pavilhão reconstruído (piso de terrazo com juntas e mapa de rugosidade + clearcoat, reboco de cal, colunas de travertino, nichos em arco, pergolado de latão, toldos de seda em catenária animados, bancos, jardim com sebes). Feixes de luz aditivos e poeira dourada. Tecidos em `MeshPhysicalMaterial` com sheen, normal de trama procedural e, no véu, opacidade listrada; argolas de latão instanciadas; poças de luz colorida projetadas no piso pela direção do sol.
- **Pós-processamento estável:** alvo HalfFloat com MSAA → *sanitize* (zera NaN/Inf por teste de bits, já que o ANGLE/D3D remove `isnan`) → bloom → gradação (vinheta, grão) → OutputPass. Normais degeneradas da malha recebem fallback.
- **Simulação:** Verlet com alongamento, cisalhamento e dobra; vento empurra conforme a normal da face, com rajadas e tremulação; aberturas viram fendas (bordas seguem costuradas).
- **Jogabilidade:** 7 descobertas opcionais (Puxar e soltar, Vento forte, Calmaria, Respirar junto, Camadas de cor, Abertura, Entre os véus) com progresso no HUD e painel “Achados”; vento que respira (4 s · 6 s); rajada; novo percurso “Sob o pergolado”; deslizar à direita.
- **Áudio (Web Audio, desligado ao entrar):** ambiência de vento que acompanha a intensidade, tom grave de sala, sinos pentatônicos nas descobertas e farfalhar ao puxar/mover.
- **UI/UX:** dock de 6 ferramentas cabe em 360 px sem rolagem; selo de progresso; painel menor em telas baixas; câmera do celular mais próxima; correção do controle deslizante que arredondava o valor inicial.
- **Qualidade:** padrão “Automática” (desliga bloom e reduz DPR se o quadro passar de 26 ms); sem renders antes de entrar em GL por software; texturas de canvas limitadas à área de cada mancha (carregamento em SwiftShader caiu de ~45 s para ~3 s).

### Verificação

- `npm run build`, `npm test` e `node tests/browser.mjs` (7 verificações, 5 viewports, offline) passando; `capturas/qa-browser.json`.
- GPU real (Intel UHD, ANGLE D3D11): 0 pixels pretos/NaN no canvas, sem erros no console; ~206 draw calls / 70 k triângulos no desktop, ~166 / 58 k no celular. Capturas `capturas/gpu-*.png`.

### Scorecard premium (0–3)

| Categoria | Nota |
|---|---|
| Direção de arte / coesão | 2.5 |
| Iluminação | 2.5 |
| Materiais PBR | 2.5 |
| Texturas procedurais | 2.5 |
| Pós-processamento | 2.5 |
| Animação / VFX | 2.5 |
| Jogabilidade / recursos | 2.5 |
| UI/UX desktop | 2.5 |
| UI/UX celular | 2.0 |
| Áudio | 2.0 |
| Desempenho / estabilidade | 2.0 |
| **Média** | **2.36** |
