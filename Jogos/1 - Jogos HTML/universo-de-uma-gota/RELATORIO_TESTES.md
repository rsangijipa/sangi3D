# Verificação de Universo de uma Gota

Execução em 28 de novembro de 2026 no Windows com Node.js 26.5.0, Chromium 158.0.8127.37, Playwright e SwiftShader. Os contextos do navegador cobriram 1440 × 900 com mouse e teclado, 390 × 844 em retrato com toque emulado e 844 × 390 em paisagem com toque emulado. A verificação da contenção cobriu 15 min de simulação. Cada sessão de navegador executou um fluxo funcional curto.

| Teste | Resultado observado |
| --- | --- |
| T01 · Volume | Cinco organismos permaneceram dentro do raio e dos limites de profundidade no teste de 15 min com deposição intermitente de alimento. |
| T02 · Ampliação | O controle aumentou a ampliação nos três tamanhos; na captura, o enquadramento mais próximo preservou membrana, cílios e detalhes internos do ciliado. A pinça também aumentou o zoom com dois pontos de toque emulados. |
| T03 · Alimentação | O ciliado alterou a trajetória em relação à execução sem alimento. Ingestão setou a energia para 1 e removeu a porção. A mudança de estado também foi confirmada pelo aviso de ingestão na interface. |
| T-UX · Observação | Identificação pelo toque, pelo catálogo e pelo teclado, deslocamento por setas e exportação de PNG com imagem capturada. Área do campo e ausência de rolagem horizontal conferidas nos três tamanhos. |
| T-STATE · Ciclo de vida | Pausa e retomada pela interface e pelo bridge. Reinício restaurou 40× e limpou o catálogo. Uma nova lâmina reproduziu o estado inicial e a mesma evolução sem entradas. |
| T-RENDER · Entrada e saída | Campo inicial renderizado sem erros de página ou requisições externas. Perfil baixo alternado pelo menu no desktop. Retorno ao catálogo verificado no launcher. |

Os testes de navegador usaram renderização por software. Não houve medição de FPS sustentado, consumo de memória de GPU ou validação em aparelho físico. As duas orientações foram verificadas em contextos separados. A resposta dos organismos é um modelo didático.

Capturas da execução em [desktop](capturas/desktop.jpg), [retrato](capturas/retrato.jpg) e [paisagem](capturas/paisagem.jpg).
