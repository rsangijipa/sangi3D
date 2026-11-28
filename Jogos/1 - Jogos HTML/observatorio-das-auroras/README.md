# # 054 — Observatório das Auroras

Experiência interativa 3D contemplativa do **Sangi3D** em Three.js r187 WebGL2/GLSL. Permite observar auroras boreais paramétricas a partir de uma cabana alpina com varanda em madeira, lareira interna e teto panorâmico inclinado em vidro.

## Controles & Modos

- **Aurora**: Alterna a formação geomagnética (`Coroa Verde-Violeta`, `Arco Clássico`, `Tempestade Solar`).
- **Hora**: Regula a progressão da noite ártica (`20:00` crepúsculo até `04:00` alvorada).
- **Intensidade**: Controla a emissão das cortinas e o reflexo sobre a neve (`0%` desliga completamente a emissão).
- **Fotografia (`F` / `Espaço`)**: Registra o enquadramento atual diretamente no **Álbum de Céus (`A`)**, sem pontuação.
- **Observação (`1` Varanda · `2` Interior · `3` Celeste)**: Alterna entre vista externa da varanda, vista interna através da claraboia panorâmica e câmera celeste panorâmica.
- **Contemplação (`H`)**, **Pausa (`P` / `Esc`)**, **Reiniciar (`R`)**.

## Aproximação Física & Shaders

- **Cortinas de Aurora (`js/shaders.js`)**: Modelo paramétrico artístico em malha arqueada multi-camada com estrias verticais em FBM, espectro aproximado O (`557.7 nm` verde) e N2+ (violeta/carmim) avançado em timestep fixo (`1/60s`, máximo `4` substeps).
- **Cúpula Celeste Independente da Câmera (`T03`)**: A cúpula atmosférica, as `1800` estrelas Planckianas e os arcos aurorais acompanham a posição da câmera mantendo direção constante no infinito.
- **Execução Local / Offline**: Abra pelo Launcher Sangi3D ou sirva a raiz do workspace via HTTP local (`node Sistema/launcher/server.mjs`); zero dependências externas em runtime.
