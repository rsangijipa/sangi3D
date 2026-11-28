# Arquitetura do Impossível · Sangi3D

Experiência interativa 3D em Three.js (`r187`, WebGL 2) sobre percepção espacial, portais geométricos, pontes anamórficas e gravidade local variável.

## Como executar

A experiência utiliza ES Modules e requer servidor HTTP local a partir da raiz do repositório:

```bash
python -m http.server 8000
```

Acesse:
`http://localhost:8000/Sangi3D_15_Experiencias/10-arquitetura-do-impossivel/`

## Salas e mecânicas

- **Hub Central · Átrio do Compasso:** roda de latão, esfera armilar, mapa das 5 salas e acesso às galerias.
- **Sala 1 · Ponte Anamórfica:** gire a estrutura em incrementos de 90° e alinhe as metades a partir do **Ponto de Observação** para liberar o colisor de travessia.
- **Sala 2 · Galeria de Perspectivas:** alinhe os degraus suspensos do ponto azul e suba ao **Terraço Panorâmico**.
- **Sala 3 · Escada de Gravidade Variável:** ative as placas gravitacionais verdes (`E` ou botão contextual) para caminhar pela parede leste e pelo teto com orientação de câmera suave ou transição por fade em **Movimento reduzido**.
- **Sala 4 · Corredor de Portais:** portais com `WebGLRenderTarget` sem recursão e transformação matricial `M_dest · R_180 · inverse(M_src)`, preservando direção relativa com cooldown anti-loop.
- **Sala 5 · Salão de Espelhos:** dois espelhos planares ortogonais (RenderTarget ao vivo em Equilibrada/Alta e reflexo estilizado em Econômica) revelam o selo oculto no prisma central.

## Controles

- **Teclado / Mouse:** `WASD` ou `Setas` para caminhar · Arrastar na cena para olhar · `E` para ação contextual · `R` para reiniciar a sala atual · `P` para pausar.
- **Toque / Mobile:** joystick tátil esquerdo + direcionais + botão contextual (`>= 44 px`).
- **Acessibilidade e dados:** ajuste de FOV (`50°–84°`), modo de transição suave vs fade, Movimento reduzido, teleporte acessível pelo Mapa da Galeria, ponto seguro sem queda fatal, captura sem UI (`Fotografar`) e persistência JSON versionada (`sangi3d:15:10:v1`).
