# Relatório de testes

Testes realizados em 28 de novembro de 2026 no Windows, Chrome 158.0.8127.37, Playwright e WebGL 2 com SwiftShader. Viewports de 1440 × 900 (desktop), 390 × 844 (retrato com toque emulado) e 844 × 390 (paisagem com toque emulado). A abertura da oficina e os fluxos abaixo foram exercitados por servidor HTTP local.

| Caso | Resultado |
| --- | --- |
| T01 · Sobreposição | A primeira tessela é assentada. A segunda tentativa na mesma célula sinaliza espaço ocupado e conserva a cor da peça original. Verificado no desktop e no toque. |
| T02 · Rejunte | Uma célula vazia permaneceu sem tessela e recebeu preenchimento na cor Cal. O preenchimento geral marcou todas as 441 posições. |
| T03 · Restauração | Reabrir a página recuperou a tessela Oliva com rotação de 45° e corte. O JSON baixado e reimportado correspondeu ao estado local. A captura PNG resultou em um arquivo com 1.173.573 bytes. |
| T-UX · Edição | Clique e teclado assentaram, giraram, cortaram e pintaram. O toque assentou, girou, cortou e rejuntou. Um arraste em tela emulada assentou cinco tesselas. Em órbita, a pinça mudou o enquadramento sem editar a obra. Em paisagem, o painel de ferramentas rolou até o botão de exportação. |
| T-STATE · Histórico | Desfazer recuperou o esmalte original, refazer recuperou o esmalte novo e um comando restaurou as cinco tesselas do arraste. A pausa exibiu a camada de pausa, retomar reabriu o painel e o reinício confirmado limpou a composição livre. |
| T-RENDER · Visualização | A cena iniciou sem exceções no JavaScript nem falhas de carregamento de recursos, permaneceu utilizável ao mudar a orientação e aceitou o perfil gráfico Baixa. |
| Estado isolado | Node.js 26.5.0 confirmou geração determinística, quatro padrões distintos, rejeição por ocupação, rotação, corte, remoção, máscara, exportação e validação do JSON. |

A geometria da peça é mantida por posição na grade e o rejunte é uma superfície por célula. O vidro colorido usa transparência e reflexos aproximados. A instrumentação contou 61 chamadas de desenho no gesto de pinça em retrato e zero nas duas solicitações consecutivas de quadro em repouso. Os testes rodaram em navegador automatizado. Desempenho sustentado em GPU física, consumo de memória de vídeo, fidelidade sonora em aparelho móvel e recuperação de perda real do contexto WebGL permanecem sem medição.
