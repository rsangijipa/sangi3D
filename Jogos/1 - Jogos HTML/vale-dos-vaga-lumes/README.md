# 095 — Vale dos Vaga-lumes

Experiência interativa 3D noturna em Three.js (r187 WebGL) onde o jogador explora trilhas marginais, observa enxames de vaga-lumes bioluminescentes com osciladores de fase acoplados (Kuramoto) junto a um riacho iluminado pelo luar e ajusta brilho, horário noturno, áudio espacializado e fotografia.

## Execução local (100% offline)

1. Na raiz do projeto (`Ambientes 3D`), inicie o servidor estático HTTP local (ou use `node Sistema/launcher/server.mjs` / qualquer servidor HTTP estático na raiz):
   - Via launcher Sangi3D ou servidor Node/Python apontando para a raiz do repositório.
2. Abra `/Jogos/1%20-%20Jogos%20HTML/vale-dos-vaga-lumes/index.html`.
3. Todas as dependências (`three.module.js`, `OrbitControls.js` e `sangi-bridge.js`) são servidas localmente em `/Sistema/shared/`, sem requisições externas.

## Controles

- **Olhar / Orbitar**: Arrastar no cenário com mouse ou toque (`OrbitControls` no modo *Órbita Livre*; giro de olhar livre no modo *Caminhar Trilha*).
- **Caminhar na Trilha**: `W A S D` / Setas direcionais, toque curto no chão da trilha ou botões direcionais móveis (`▲ ◀ ▼ ▶`).
- **Ferramentas (Barra Inferior & Teclas `1–4`)**:
  - **Brilho (`1`)**: Ajusta emissão bioluminescente dos vaga-lumes e intensidade cálida dos lampiões.
  - **Hora (`2`)**: Altera o horário da noite (`18:30` crepúsculo → `22:00` noite clara → `04:30` alvorada), movendo a Lua e ajustando a atmosfera.
  - **Som (`3`)**: Ativa paisagem sonora procedural Web Audio (riacho espacializado por distância, grilos e brisa noturna).
  - **Fotografia (`4`)**: Captura a cena renderizada em PNG e salva o registro no *Diário de Padrões*.
- **Pausa (`P` / `Esc`)** e **Reinício Determinístico (`R`)**.

## Modelo Físico, Aproximações e Limites

- **Simulação em Timestep Fixo**: Integrador em passo fixo (`FIXED_DT = 1/60s`, limite de `4` substeps por quadro) com interpolação linear (`alpha`) entre estados `prev` e `curr`.
- **Osciladores de Kuramoto**: Modelo didático $d\theta_i/dt = \omega_i + \frac{K}{N_i}\sum_{j \in R}\sin(\theta_j - \theta_i)$ com acoplamento ajustável (`0–3.5 rad/s`) e medição do parâmetro de ordem $R \in [0,1]$. Não representa modelo biológico preditivo de espécie real.
- **Riacho WebGL (`/water`)**: Profundidade analítica $d(x,z) = \max(0, y_{\text{água}} - H(x,z))$, cor por absorção, reflexão Fresnel + coluna especular lunar e espuma localizada nas margens e esteira de rochas submersas.
- **Terreno e Colisores**: Funções analíticas contínuas `terrainHeight(x, z)` e `streamCenterX(z)` com restrição radial contra entrada profunda no leito e colisão com postes e troncos.
- **Acessibilidade**: Modo **Movimento Reduzido** (`prefers-reduced-motion` ou checkbox manual) estabiliza o brilho dos vaga-lumes sem cintilação rápida, paralisa cintilação estelar e atenua oscilações de vento.
