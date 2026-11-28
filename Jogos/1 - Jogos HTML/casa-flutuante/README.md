# 055 — Casa Flutuante no Lago
Protótipo independente Sangi3D. HTML/CSS/JavaScript, Three.js 0.160.1, sem build. Todos os modelos, texturas e sons da cena são produzidos proceduralmente. Requer conexão com jsDelivr e WebGL habilitado.

## Executar
1. Extraia o ZIP.
2. Abra um terminal na pasta contendo index.html e execute `python -m http.server 8000` (no Windows, `py -m http.server 8000` também funciona).
3. Abra http://localhost:8000 no navegador. Para celular na mesma rede, use o IP local do computador e permita o acesso no firewall. Também pode hospedar em servidor HTTPS estático.

## Controles
WASD/setas: caminhar. Arraste com mouse/toque para olhar; Q/R giram a vista. E ou botão contextual: abrir/fechar cortinas e sentar/levantar ao se aproximar. Celular: setas na tela e arraste. Esc fecha painel ou pausa. Som inicia somente mediante ativação. Clima, Luz, Balanço e Som são painéis independentes; Configurações contém qualidade, diagnóstico, reset e contemplação. Pausa inclui saída (standalone pausa; fechar aba fica a cargo do usuário).

## Arquitetura e limites
Estado serializável em S; simulação fixa a 60 Hz com no máximo cinco subpassos; colisão analítica AABB em coordenadas da plataforma. Ondas e balanço são aproximações, não hidrodinâmica; cortinas são deformação procedural, não simulação de tecido; som usa ruído filtrado e oscilador. Água usa shader Fresnel e render target de câmera espelhada, sem refração volumétrica. O código inclui geometria instanciada de árvores, materiais standard com mapas de cor/relevo, três perfis de resolução/sombras/partículas e pausa em aba oculta. Não há telemetria remota nem persistência do progresso.

Integração potencial: `window.sangi3d` expõe pause(), resume(), reset(), mute(), dispose(), getState(), getDiagnostics(). Não existe contrato real do launcher fornecido; nenhum evento específico foi presumido. Dispose libera recursos gráficos e áudio; listeners de página permanecem até o descarregamento. O protótipo deve ser montado em página/iframe dedicado.

Para uma versão offline, obtenha legalmente o módulo Three.js 0.160.1 e seu arquivo LICENSE, coloque ao lado do index.html e substitua a URL de importação por `./three.module.js`. Essa variante não foi testada.
