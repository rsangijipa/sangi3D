# Relatório de validação — protótipo 055
Ambiente: Node.js 22.16.0, contêiner Linux, Chromium disponível via Playwright. Não houve execução gráfica bem-sucedida.

| Teste | Resultado |
|---|---|
| Sintaxe JavaScript (node --check) | Aprovado |
| T01: limites e colisores da plataforma | Aprovado em teste isolado de lógica: 2400 passos fixos (40 segundos simulados), posição permaneceu válida. Não valida câmera/renderização. |
| T02: estabilização | Implementada; não validada visualmente |
| T03: cortina | Aprovado em teste isolado: troca do estado e convergência de animação; não valida geometria |
| Sentar/levantar | Aprovado em teste isolado: estado sentado, levantar e restauração da posição |
| T-UX desktop/toque | Não executado |
| T-STATE pausa/reset/reabertura/áudio | Não executado de ponta a ponta |
| T-RENDER, 390×844, 844×390 e 1440×900 | Bloqueado: navegação Chromium retornou ERR_BLOCKED_BY_ADMINISTRATOR (file e HTTP local). CDN também inacessível (DNS). |
| FPS, memória de GPU, captura desktop/mobile | Não medidos; nenhuma captura de jogo executado disponível |
| Integração launcher | Não realizada: contrato não fornecido |

O CLI game-dev não foi encontrado no PATH; não foram executados workflows de captura/normalização/benchmark do plugin. Os testes unitários não substituem playtest. Metas de 60 FPS desktop e 30 FPS mobile ainda não comprovadas. Shader, reflexos, materiais, entrada real, áudio e layout precisam ser testados em navegador com rede e GPU. Não classificado como pronto para produção.
