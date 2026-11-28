# # 025 — Geometria das Conchas

Experiência interativa 3D de bancada museológica para investigação paramétrica de conchas marinhas em Three.js r187 WebGL2/PBR.

## Ferramentas & Modos

- **Espiral**: Ajusta o número de voltas logarítmicas (`1.8` a `4.6`) e a elevação helicoidal (`0` planar tipo Náutilo até `0.65` caracol).
- **Abertura**: Controla a taxa de expansão radial do tubo (`30%` a `95%`).
- **Escala**: Modifica a proporção geral com paquímetro métrico de latão na areia ajustado automaticamente à largura do espécime.
- **Textura**: Alterna superfícies PBR procedurais (`Listras Náutilo`, `Costelas Radiais`, `Nacarado Liso`) com camada de iridescência nacarada.
- **Corte / Inteira (`C`)**: Alterna entre a concha fechada e o corte anatômico sólido revelando parede dupla nacarada e câmaras internas côncavas.
- **+ Catalogar / Comparar (`⚖`)**: Salva e compara até **3 formas catalogadas** lado a lado com suas razões de largura/profundidade e número de câmaras.
- **Fotografia (`F` captura PNG)**: Habilita barra macro com foco seletivo, exposição, desfoque DoF desativável para acessibilidade e captura PNG do canvas.
- **Contemplação (`H`)**, **Pausa (`P` / `Esc`)**, **Reiniciar (`R`)**.

## Execução Local

Sirva a raiz do workspace via HTTP (`node Sistema/launcher/server.mjs`) ou abra diretamente pelo Launcher Sangi3D. Funciona 100% offline usando `/Sistema/shared/vendor/three.module.js`.
