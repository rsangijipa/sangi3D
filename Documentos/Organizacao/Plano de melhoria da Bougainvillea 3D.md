# Plano de melhoria da Bougainvillea 3D — Quintal em Flor

## 00 — Resumo executivo

A Bougainvillea já funciona como uma experiência contemplativa com exploração em 3D, cinco enquadramentos, três condições de luz, inspeção por toque, áudio opcional e exportação PNG. A próxima versão deve aproveitar esses recursos em um percurso livre pelo quintal. A prioridade é corrigir a navegação e tornar a comparação com a foto confiável. Depois vêm composição, luz, detalhe botânico e expansão.

O anexo **Reconstrução Espacial de Alta Fidelidade** determinou o recorte da auditoria. A implementação ativa no launcher, **Quintal em Flor**, é a base proposta. Ela já incorpora recursos adicionais e usa o Three.js local. O restante do catálogo está fora deste recorte.

## 01 — Inventário técnico

| Entrada ou sistema | Evidência |
| --- | --- |
| Anexo HTML | Three.js r128 via CDN, CSS e código inline e foto embutida. Inspeção estática. |
| `Jogos/7 - Cenas 3D/11-bougainvillea/index.html` | HUD, ajuda, comparação, controles e entrada do módulo. Catálogo aponta para esta página. |
| `main.js` | Three.js r187 local confirmado por `REVISION`. `WebGLRenderer`, cor sRGB e tone mapping neutro. `AssetManager` controla o descarte, `TextureGenerator` e as factories constroem a arte. |
| Exploração | `CameraManager` oferece órbita, zoom, pan, teclas e presets. `InteractionSystem` faz raycast, aplica impulso e abre fichas. `UIManager` gerencia comparação, captura e contemplação. |
| Simulação e imersão | `PhysicsSystem` usa molas amortecidas e vento procedural. `ParticleSystem`, `AudioSystem` e `MacroLens` tratam partículas, áudio sintetizado e desfoque por profundidade. |
| Integração | `BougainvilleaApp` escuta eventos `sangi:*`, pausa quando a aba fica oculta, tenta recuperar o contexto WebGL e descarta recursos ao sair. |
| Recursos locais | `referencia.jpg` é a foto comparativa com 749 × 1000 px. `miniatura.png` é a capa. O cenário e seus materiais são gerados por código. |

## 02 — Achados e prioridades

| ID e prioridade | Evidência e impacto | Ação e aceite | Esforço aproximado |
| --- | --- | --- | --- |
| B01 · P1 | Navegador, confiança alta. Ao abrir Ajuda, o foco fica no botão de origem. Escape deixa o modal aberto. `main.js:2179`. | Transferir e conter o foco enquanto aberto, fechar por Escape e devolver o foco. Tab e Shift+Tab devem circular apenas no modal. | 0,5–1 dia |
| B02 · P1 | Navegador + código, confiança alta. `#compare-overlay` segue com `aria-hidden=true` ao mostrar a foto. A interface requisita o preset `reference`, enquanto a câmera mantém órbita e aproximação disponíveis. `index.html:702`, `main.js:2029`. | Expor a imagem e nomear o slider quando ativos. Travar a câmera durante a comparação alinhada e restaurar a pose anterior ao sair. Manter a mesma área útil para foto e render, com opção de ver a foto inteira. | 1–2 dias |
| B03 · P1 | Código, confiança alta. Inspeção usa `pointerdown`/`pointerup` e um único ponto de origem. O controle de câmera trata múltiplos ponteiros em outro sistema. As setas são registradas globalmente, inclusive enquanto um slider está focado. `main.js:1645`, `1712`, `1970`. Conflito de gestos requer teste dedicado. | Usar uma decisão comum de gesto. Inspeção só ao fim de toque primário simples. `pointercancel`, pinça e arraste cancelam seleção. Teclas de câmera só no canvas focado. Disponibilizar inspeção equivalente em botões. | 2–3 dias |
| B04 · P1 | Código, confiança alta. A preferência por menos movimento reduz o vento de `PhysicsSystem`, mas a órbita, o impulso e as partículas têm caminhos independentes. `main.js:1554`, `1722`, `1984`, `2440`. | Aplicar a preferência a todos os estímulos: órbita desligada, troca de vista direta, vento e partículas desativados, foco estável e feedback textual na inspeção. | 1–2 dias |
| B05 · P2 | Capturas desktop e retrato, confiança alta para os quadros revisados. O cacho superior direito fica mais cortado ou encostado à borda no render. O céu e o muro ganham peso no enquadramento largo, e as brácteas em primeiro plano aparecem mais escuras e uniformes que na foto. | Ajustar posição e distância por orientação, direção dos ramos, luz de preenchimento e variação das brácteas. Validar primeiro em retrato com captura alinhada, depois conferir paisagem e macro. | 3–5 dias |
| B06 · P2 | Código, confiança alta para a configuração. O perfil Baixo desliga sombras, reduz DPR e partículas e pula o passe da lente, embora o controle possa continuar visualmente ligado. `main.js:1898`, `2328`, `2378`. | Indicar quando a lente está desativada pelo perfil, preservar a preferência para os demais perfis, medir o custo e estabilizar as trocas do modo Auto. Aceite em hardware com o roteiro abaixo. | 2–4 dias |
| B07 · P2 | Navegador, confiança alta. No retrato, oito ações ficam em duas fileiras no topo e cinco vistas disputam o rodapé. As duas faixas encolhem a área útil para o cacho. | Deixar **Explorar** e **Comparar** visíveis, agrupar controles secundários no menu e manter a visualização totalmente livre em Contemplar. Validar foco, alcance e orientação. | 1–2 dias |
| B08 · P3 | Projeto atual, confiança alta. Os cinco presets dão acesso direto à cena, com fichas acionadas principalmente pelo toque sobre objetos. Há espaço para transformar as vistas em um percurso legível. | Introduzir quatro paradas opcionais que reutilizam os presets. Permitir pular, revisitar e sair do roteiro mantendo o controle da câmera. | 2–4 dias |

## 03 — Scorecard e cobertura

As notas são da amostra e usam escala 0–10. Pesos definidos para este recorte, com ênfase em imagem e acesso às interações.

| Categoria | Peso | Atual → meta | Evidência e confiança |
| --- | ---: | --- | --- |
| Arte e ambiente | 30 | 6 → 8 | Foto e três capturas iniciais. Alta para composição, parcial para outros presets. |
| Interface e controles | 20 | 6 → 8 | Preset, comparação, controles gráficos e captura observados. Média, gestos reais pendentes. |
| Acessibilidade | 20 | 4 → 8 | Foco, Escape, `aria-hidden` e preferência de movimento. Alta para achados, parcial para leitores de tela. |
| Performance e estabilidade | 20 | N/V → critérios da seção 10 | Abertura verificada, sem benchmark ou teste de recuperação. |
| Áudio e resposta física | 10 | N/V → critérios da seção 10 | Código lido, escuta e resposta a gestos pendentes. |

Média provisória **5,4/10**, cobertura ponderada **70%** dos critérios de nível de categoria. Cálculo `(6×30 + 6×20 + 4×20) / 70`. Nota voltada a este recorte, com cobertura parcial em cada categoria. Combate, IA adversária, placar e economia são N/A para a proposta contemplativa.

## 04 — Novas fases de exploração

| Parada | Base | Interação e retorno |
| --- | --- | --- |
| **1. Chegar ao quintal** | `garden` | Apresentar a planta, o muro, a telha e o caminho. **Explorar** abre a lista de paradas e **Contemplar** libera a tela. |
| **2. Ler a fotografia** | `reference` | Fixar a vista comparativa. A pessoa move o divisor e identifica o cacho alto, o ramo diagonal e a linha do muro. Ao sair, retorna ao enquadramento anterior. |
| **3. Aproximar da planta** | `macroTop`, `macroCenter` | Selecionar bráctea, flor ou ramo com botão ou toque. A câmera enquadra o ponto, apresenta a ficha e preserva o plano de foco. Uma reação breve é opcional. |
| **4. Ver a luz mudar** | `side` ou `garden` | Alternar nublado, sol e fim de tarde na mesma câmera. **Fotografar** exporta a vista; **Contemplar** permite permanecer no ambiente. |

O roteiro é optativo. A primeira visita mantém acesso ao enquadramento original, e as quatro paradas podem ser escolhidas em qualquer ordem. Um diário local de até três enquadramentos pode entrar em expansão posterior, armazenando apenas parâmetros de câmera, luz e lente. O download PNG existente continua como saída de imagem.

## 05 — UI, UX e direção de arte

- **Desktop**. Ações principais no topo, seletor das paradas no rodapé. A ficha abre em painel lateral e deixa o alvo em área livre. Separar dados técnicos de FPS e draw calls nas configurações.
- **Celular**. Ações visíveis com texto, alvos de 44 × 44 px como meta de projeto, menu rolável com limite ao viewport e áreas seguras. Cabeçalho de uma fileira nas larguras suportadas e folha inferior para vistas e fichas, com fechamento por botão e Escape.
- **Arte**. Magenta concentrado na Bougainvillea, verde no segundo plano e tons minerais no muro, piso e telha. Usar desfoque para separar planos e manter flor ou bráctea principal na faixa nítida. Partir da composição em retrato e adaptar cada vista horizontalmente.

## 06 — Física, renderização e áudio

- Manter a resposta por mola e amortecimento. Limitar o impulso por ramo, calibrar a recuperação em torno de 2 s e evitar novo impulso ao soltar pinça. Em movimento reduzido, apresentar apenas destaque e ficha.
- Começar pela câmera, posição dos cachos e luz. No macro, variar curvatura, espessura aparente, rugosidade, cor e nervuras. Ajustar contraluz para as brácteas com as técnicas já disponíveis no renderizador. Preservar o shader da lente enquanto se mede custo e se calibra o plano de foco.
- Reusar os três presets existentes e calibrar intensidade/direção da luz para que variem mantendo leitura do alvo. Trabalhar com contraste e luz difusa antes de acrescentar efeitos. Manter áudio de ativação explícita, rampa de ganho e silêncio durante pausa, aba oculta e movimento de saída do launcher.

## 07 — Manifesto de assets e ambiente

| Asset | Origem | Tratamento proposto e verificação |
| --- | --- | --- |
| Foto de referência | `referencia.jpg`, existente | Usar como guia de composição e no comparador. Verificar enquadramento natural e estado alternativo se a imagem falhar. |
| Brácteas, flores, folhas e ramos | `GeometryFactory`, `MaterialFactory` e `SceneManager` | Concentrar variação nos cachos em macro. Reutilizar malhas distantes e manter folhas/petíolos instanciados. Conferir silhuetas e pontos de inserção de perto e de perfil. |
| Muro, telhas, brita e caminho | `EnvironmentSystem` | Reforçar contato com o solo, desgaste perto da base do muro e escala da telha. Manter a edificação e o poste como fundo secundário. |
| Céu, névoa e pólen | Shaders e partículas locais | Limitar fumaça/névoa na frente da planta. Usar cópias dos mesmos enquadramentos com o efeito ligado e desligado para revisar. |
| Áudio e capa | `AudioSystem` e `miniatura.png` | Calibrar volume da brisa, ambiente e toque. Atualizar a capa a partir de uma captura da versão aprovada, com o cacho legível em tamanho de cartão. |

## 08 — Mobile, acessibilidade e orçamento

- Suporte inicial a desktop, retrato e paisagem. Testar 320 × 568, 390 × 844, 844 × 390 e 1366 × 768 via emulação e registrar pelo menos um Android e um iPhone físicos. Em touch, restringir a captura de gestos ao canvas e preservar rolagem e ampliação da interface.
- Nomear controles, espelhar estados em atributos acessíveis e oferecer uma lista de partes da planta acionável por teclado. Validar foco visível, navegação completa e respeito à redução de movimento. Preservar rótulos e fichas quando WebGL estiver indisponível, com a foto ocupando o lugar da cena.
- Medir 30 s depois de 5 s de aquecimento em **Jardim Amplo** e **Macro Flores**. Registrar dispositivo, navegador, resolução, DPR, perfil, tempo de quadro p95, draw calls e triângulos. Metas iniciais propostas: p95 ≤ 33,3 ms em celular no Baixo, p95 ≤ 20 ms em desktop no Alto. O Auto desce após degradação sustentada e só recupera qualidade após janela maior de estabilidade. Baixo começa com lente desativada e preserva contraste e foco do assunto.

## 09 — Roadmap

1. **Estabilizar interação e medição · P1 · 2–4 dias.** Criar regressões para modal, comparação, gestos, movimento reduzido e ciclo do launcher. Capturar baseline e consolidar os estados dos controles em `index.html` e `main.js`. Saída: fluxos acessíveis e referência para antes/depois.
2. **Polir um trecho completo · P2 · 4–7 dias.** Fazer a passagem **Quintal → Comparação → Macro Flores**, com a câmera, o cacho principal, o muro e a iluminação revisados. Testar em retrato e desktop antes de aplicar a outras vistas. Saída: pares foto/render e perfis validados para o trecho.
3. **Expandir as paradas · P2/P3 · 3–5 dias.** Aplicar o padrão às demais vistas, finalizar fichas, revisar áudio e rodar QA das três condições de luz. Liberar o roteiro com exploração livre em todos os pontos.
4. **Consolidar e publicar no catálogo · P2 · 1–3 dias.** Testar rota direta e abertura pelo launcher, atualizar capa e documentação de uso, repetir o benchmark e registrar pendências. A publicação depende da autorização e do fluxo normal do projeto.

As faixas são estimativas para uma pessoa e têm sobreposição com os achados. O principal fator de variação é a calibração artística e o acesso a dispositivos físicos. A escolha técnica inicial é manter o Three.js r187 local em WebGL. Os princípios de escala, luz, geometria e materiais das skills Three.js se aplicam a essa base. Adoção de WebGPU ou TSL fica condicionada a um experimento separado com benefício mensurável e paridade nos fluxos existentes.

## 10 — QA e critérios de aceitação

| Verificação | Aceite |
| --- | --- |
| Abertura e integração | Rota direta e catálogo abrem o mesmo jogo. Pausar, retomar, silenciar, reenquadrar e sair funcionam em sequência, inclusive após alternar de aba. Simular indisponibilidade ou perda de WebGL e validar recuperação ou modo foto. |
| Controles | Teclado chega a todos os recursos. Esc fecha o painel ativo e devolve foco. Setas no slider alteram o slider. Toque simples inspeciona; pinça, pan, arraste e cancelamento não selecionam. |
| Comparação | Slider responde em 0%, 50% e 100% nos dois formatos. Cacho alto, diagonal e topo do muro mantêm correspondência visual no enquadramento de comparação. Sair restaura câmera e controles. |
| Gráficos | Capturar as cinco vistas nas três luzes para triagem visual. Revisar Jardim e Macro com lente ligada/desligada, sem recortes acidentais do alvo, e comparar perfis pelo roteiro de medição. |
| Imersão | Áudio só começa por ação explícita, respeita volume e silencia em pausa. O ramo recupera a pose sem acumular oscilação após vários toques. O modo de menos movimento mantém a inspeção disponível. |
| Captura e recurso ausente | PNG abre com imagem válida, sem HUD, e corresponde à vista e luz ativas. Se a foto faltar, o comparador explica a indisponibilidade e a exploração segue acessível. |

**Verificação realizada.** Chrome 158.0.8127.37 headless, opção Chrome do Playwright local, rota direta servida por `Sistema/launcher/server.mjs --no-prebuild`. Desktop 1366 × 768, retrato 390 × 844 e paisagem 844 × 390, com toque emulado nos dois últimos. Cada viewport retornou HTTP 200 e exibiu canvas, respondeu à abertura da vista Macro Flores, ao comparador e ao ajuste Baixo, sem erros de página, console no nível error ou respostas HTTP 4xx/5xx observados nesse fluxo. O teste também acionou Fim de Tarde e o controle de lente. No desktop, observou-se evento de download PNG e confirmou-se a falha de foco/Escape da Ajuda. A imagem da foto carregou nas três vistas. As capturas verificadas foram as da vista inicial. Inspeção botânica por gesto, render sob todas as luzes, bytes do PNG, áudio, ciclo completo do launcher, render do anexo, recuperação de contexto, medição de performance e dispositivos físicos seguem pendentes de teste.

## 11 — Prompt de implementação

Use [PROMPT_MESTRE_IMPLEMENTACAO_BOUGAINVILLEA.md](PROMPT_MESTRE_IMPLEMENTACAO_BOUGAINVILLEA.md) com o repositório. O prompt contém os achados, a ordem de trabalho e os testes de aceitação necessários para iniciar a implementação.
