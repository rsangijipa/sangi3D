# PROMPT MESTRE — ATELIÊ DO GESTO LENTO

## Como usar este pacote

Cole este arquivo inteiro na ferramenta de desenvolvimento e anexe a pasta assets. Depois, use 02_PROMPT_PRATICA_GUIADA.md como continuação. Os dois trechos enviados pela solicitante são idênticos: este projeto é uma aplicação com dois modos complementares, Modelagem livre e Prática guiada. Não criar dois aplicativos visualmente duplicados.

Este pacote contém especificações de implementação e assets raster originais. A prévia em referencia_3d demonstra a direção espacial e a modelagem inicial da oficina; não equivale à aplicação completa descrita abaixo. Imagens não são modelos GLB, e albedo não é um conjunto PBR completo.

---

Você é uma equipe de desenvolvimento de experiências interativas, computação gráfica e design de produto. Construa uma aplicação web em português brasileiro chamada **Ateliê do Gesto Lento**. Entregue código executável, sem controles decorativos. A experiência é uma oficina de cerâmica contemplativa, com modelagem real de uma malha de argila e atmosfera tátil. O uso proposto é expressão criativa, atenção ao gesto e exploração de imperfeições; não atribuir diagnósticos, interpretações psicológicas às formas ou resultados clínicos garantidos.

O centro da aplicação é uma peça tridimensional editável. O usuário pode abrir a boca, ampliar o corpo, estreitar o colo, alisar irregularidades, imprimir marcas e recomeçar. A peça precisa mudar sob o toque, conservar as alterações ao trocar ferramentas e permitir desfazer. Não substituir modelagem por uma imagem giratória nem por uma troca entre vasos prontos.

## 1. Direção artística

Referência: assets/01_atelie_referencia.png. O enquadramento tem uma bancada de madeira em primeiro plano e a argila no centro. Janela à esquerda, prateleiras ao fundo, tecidos de linho e cerâmicas discretas. Texturas com escala física e irregularidade sutil. O conjunto deve lembrar uma oficina real e silenciosa, sem decoração excessiva.

Paleta:
- Papel e painéis: #F4EDE2.
- Parede: #DCD1BC.
- Argila principal: #A95F43.
- Argila úmida nas áreas tocadas: #8E4C36.
- Madeira clara: #9A7251.
- Texto: #332C26.
- Acento oliva: #596344.
- Linho: #C9B99D.

Tipografia: títulos em Georgia ou serifada editorial local; interface em system-ui. Não depender de fontes remotas para abrir. Título desktop 38–48 px, corpo 15–17 px, rótulos 12–14 px. Contraste de texto pelo menos 4,5:1. Ícones SVG simples e consistentes; não usar emojis como ícones finais.

Sem cartões flutuantes em excesso, contornos neon, vidro fosco em todos os elementos, brilho místico ou efeitos que disputem atenção com a argila. A beleza está na luz, no enquadramento, na matéria e na resposta ao gesto.

## 2. Stack e arquitetura

Instalar e fixar three@0.180.0, versão usada na prévia do pacote. Usar React + TypeScript + Vite ou integrar aos equivalentes do projeto hospedeiro. Não migrar um projeto existente sem necessidade. Importar OrbitControls, RoomEnvironment, GLTFLoader e outros addons de three/addons quando usados. Usar BufferGeometry dinâmica para argila. Não adicionar um motor de corpos rígidos para fingir que resolve material plástico: a argila deve usar o solucionador específico descrito abaixo.

Estrutura sugerida:
- scene/WorkshopScene.ts: cena, iluminação, materiais e enquadramentos.
- scene/WorkshopProps.ts: bancada, janela, prateleira, ferramentas e cerâmicas.
- clay/ClayGeometry.ts: topologia, normais e UVs.
- clay/ClaySolver.ts: deformação, restrições e validação.
- clay/ClayHistory.ts: transações desfazer/refazer.
- interaction/PointerController.ts: raycasting, toque e separação câmera/ferramenta.
- audio/MaterialAudio.ts: contexto de áudio e sons.
- session/SessionStore.ts: persistência e recuperação.
- guided/GuidedSession.ts: estados da prática.
- ui/: controles e diálogos acessíveis.

Uma única malha autoritativa por peça. React não deve receber o array de vértices a cada frame. Usar refs/estado externo, arrays tipados reutilizados e atualizações parciais quando possível. Fechar áudio e liberar geometrias, texturas, render targets e event listeners no unmount.

## 3. Oficina 3D: escala e layout físico

Unidades em metros; eixo Y para cima. Oficina com 4,6 m de largura, 4,2 m de profundidade e 2,85 m de altura. Parede do fundo em z=-2,1. Mesa central: 2,4 × 0,88 m, superfície em y=0,78 m e espessura de 0,065 m. Pernas e travessas reais, bordas suavizadas por bevel; evitar cubos com bordas infinitamente afiadas em objetos próximos.

Janela esquerda: aproximadamente 1,35 × 1,50 m, peitoril 1,0 m, caixilhos de madeira, vidro com reflexo contido. Parede frontal removida como set de fotografia. Prateleira no fundo à direita, com 5–7 peças de cerâmica variadas, espaçamento e pequenas assimetrias. Planta próxima à janela, fora do campo de edição.

Centro da peça em (0; 0,865; 0). Disco manual de madeira/argila de raio 0,28 m e altura de 0,045 m; não girar automaticamente ao entrar. Bloco inicial: altura de 0,23 m, raio externo de 0,105 m, boca aberta com espessura visual aproximada de 0,012 m e fundo de 0,018 m. Escala visual pode ser ampliada no enquadramento de trabalho sem alterar as unidades da simulação.

À esquerda da peça: linho dobrado e esteca; à direita: tigela de água em torno de 0,17 m de diâmetro. Ferramentas têm malha 3D real, sombra e escala. Os recortes PNG servem às interfaces de seleção, não substituem modelos próximos na cena.

Câmeras:
1. Trabalho: perspectiva 38–42°, cerca de (0,65; 1,30; 1,25), mirando (0; 0,99; 0).
2. Detalhe: aproximação que mantém borda e corpo sem cortes, com dolly limitado.
3. Ambiente: cerca de (1,55; 1,65; 2,65), mirando (0; 1,05; -0,3).

Transições de 600–900 ms com smoothstep; instantâneas com movimento reduzido. Proibir atravessar mesa, paredes e peça; zoom limitado e target contido. Não iniciar câmera giratória. Não usar primeira pessoa, balanço de cabeça ou caminhada obrigatória.

## 4. Materiais e luz

Renderer com saída sRGB, ACESFilmicToneMapping, exposição calibrada e sombras suaves. Texturas de cor marcadas SRGBColorSpace; mapas de normal/roughness permanecem lineares. Renderer com antialias; DPR máximo 1,5 no celular e 2 no desktop. HDR não é requisito; gerar PMREM a partir de RoomEnvironment se não houver HDR local licenciado.

Argila: MeshPhysicalMaterial ou MeshStandardMaterial. Metalness=0. Roughness base 0,74–0,88; áreas úmidas 0,42–0,60. Sem transmissão e sem plástico brilhante. assets/04_argila_albedo.png como baseColor, repetição calibrada para granulação milimétrica. Expor intensidade de variação, não aplicar uma textura macro gigante sobre toda a peça. Normal procedural de baixa amplitude pode ser criada pelo código; não tratar a imagem albedo como normal. Se produzir normal derivada de luminância, chamá-la de aproximação visual, não de superfície medida.

Aproximação de umidade: atributo por vértice, valor 0–1. Aumentar suavemente no local tocado; relaxar ao longo de 20–40 s apenas no aspecto visual, sem endurecer ou alterar a forma por abandono. Distinguir essa variável estética de uma simulação química.

Madeira: veios longitudinais, repetição por tábua, roughness 0,65, metalness=0, sem brilho envernizado excessivo. Parede: roughness 0,95, ruído mineral baixo. Linho: trama fina, dobra geométrica, material dupla face só quando necessário.

Luz principal lateral: área aparente de janela à esquerda, temperatura visual quente moderada. Usar DirectionalLight com sombra 2048 no desktop e 1024 no celular, câmera de sombra apertada à bancada; luz ambiente de preenchimento fraca e ambiente PMREM. Contact shadow ou AO leve para ancorar a peça. Não simular luz volumétrica com dezenas de planos opacos. Poeira opcional, no máximo 60 pontos discretos, desligada com movimento reduzido.

## 5. Argila: modelo físico aproximado, estável e implementável

Implementar um modelo de deformação plástica baseado em uma superfície radial com restrições. Explicar nos comentários: aproximação interativa de argila, não FEM nem fluido real. Densidade e gravidade não precisam ser publicadas como grandezas científicas medidas.

### 5.1 Topologia

Armazenar R[j,i], raios externos, em 40 faixas de altura × 96 segmentos angulares no desktop; 28 × 64 no celular. Theta_i=2πi/N, y_j=h·j/(M−1). Cada faixa tem raio positivo. Interpolar altura quando necessário; preservar anel da base e manter y monotônico.

Construir superfície externa, superfície interna com espessura T[j,i], anel superior que une ambas e fundo fechado. UV externo u=theta/2π e v=y/h. Duplicar seam somente no BufferGeometry; manter os dados lógicos angulares únicos e copiar a amostra 0 para a amostra N na geração da malha. Soldar/médias de normais na costura e nas junções pertinentes para evitar linha vertical escura. Usar índices consistentes e material de uma face com normais corretas.

Espessura alvo 0,012 m, mínima 0,008 m. Raio externo limitado a 0,035–0,22 m. Altura total 0,10–0,38 m. Fundo com 0,018 m ou mais e abertura interna começando acima dele. Nenhuma face de tampa sobre a boca. Calcular normais após deformar; não recalcular texturas a cada frame.

### 5.2 Entrada e força

No pointerdown sobre a argila, capturar pointer e iniciar uma transação de histórico. Raycast retorna ponto local (x,y,z), theta=atan2(z,x) normalizado, faixa j aproximada e normal. Usar interseção com superfície externa apenas nas ferramentas externas; impedir que o raio acerte o interior e deforme o lado oposto inesperadamente.

Distância angular periódica:
dTheta=atan2(sin(theta−theta0),cos(theta−theta0)).
Distância de superfície aproximada:
d²=(y−y0)²+(r0·dTheta)².
Peso de pincel:
w=exp(−d²/(2·sigma²)), zerado fora de 3sigma.
Sigma controlado de 0,012–0,055 m, com padrão 0,025 m.

Normalizar deslocamentos pelo tamanho do canvas: dxN=dx/rect.width, dyN=dy/rect.height. Força ajustada pela sensibilidade escolhida e pressão da caneta, se existir. Mouse e toque comum usam pressão nominal constante, sem obrigar sensor. Limitar deformação por subpasso a 0,0015 m. Subdividir deslocamentos grandes em passos com intervalo menor que sigma/3 para evitar carimbos separados.

Tempo do solucionador em passo fixo de 1/60 s, até 4 subpassos por frame, delta acumulado limitado. A quantidade de argila modificada por um mesmo gesto deve ser aproximadamente igual a 30, 60 ou 120 FPS; não multiplicar uma deformação já baseada em deslocamento por dt duas vezes.

### 5.3 Ferramenta Modelar

Por padrão, gesto horizontal altera o raio: arrastar para a direita amplia e para a esquerda estreita a faixa em torno da altura tocada. Mostrar antes do primeiro gesto: “Arraste para a direita para abrir; para a esquerda para estreitar.”

Dois alcances explícitos:
- Faixa inteira: aplica kernel vertical a todos os ângulos; padrão para iniciantes, forma de torno previsível.
- Toque local: kernel angular e vertical para assimetria artesanal.

Não inverter direção ao girar a câmera. O mapeamento horizontal é da tela e permanece previsível. Resposta básica dR=k·dxN·w, k inicial em torno de 0,35 m e sensibilidade de 0,25–1. Aplicar deadzone de 2 px para mouse e 5 px em toque, depois iniciar gesto.

A altura é uma ação separada por slider acessível “Altura da peça”, não misturada ao arraste da câmera. Ao mudar altura, reposicionar y_j, ajustar raios proporcionalmente a sqrt(hAnterior/hNova) para aproximação de volume e validar limites. A base fica apoiada no disco.

### 5.4 Ferramenta Alisar

Aplicar Laplaciano suave no campo de raios, com vizinhos angulares periódicos e verticais:
Rnovo=R+lambda·w·(mediaVizinhos−R).
Lambda por subpasso entre 0,06 e 0,16, limitado. Usar buffer temporário; nunca atualizar vizinhos em cascata no mesmo passe. Preservar a silhueta ampla e reduzir apenas irregularidades locais. Não converter a peça inteira em um vaso perfeito em um clique. Um clique aplica um passe pequeno; arraste aplica vários com integração por tempo ou distância consistente.

### 5.5 Ferramenta Marcar

Esteca imprime sulco contínuo seguindo o ponto de contato. Reduzir raio no kernel local com profundidade máxima acumulada de 0,004 m em relação à superfície anterior ao traço. Largura 0,003–0,009 m, orientada pela trajetória. Usar matriz de profundidade ou campo auxiliar para marcas finas se a malha de base não tiver densidade suficiente; normal map dinâmico em UV pode complementar o relevo sem fingir alteração de silhueta. Não subdividir toda a malha a cada toque.

Respeitar espessura mínima; quando atingir limite, saturar a marca suavemente. Não perfurar a peça. Pontos e linhas são livres, sem avaliação de desenho.

### 5.6 Restrições, volume e estabilidade

O material conserva a forma ao soltar: deformação plástica, sem mola que reconstrua o vaso inicial. Gravidade só entra como relaxamento sutil opcional de regiões muito alargadas, máximo 0,5 mm por segundo durante manipulação, nunca como desmoronamento punitivo após parar.

Base: fixar as duas faixas inferiores. Limitar diferença radial entre faixas para evitar degraus impossíveis; usar projeções suaves para inclinação e espessura. Nunca gerar NaN, raio negativo, inversão de triângulo ou auto-interseção visível.

Estimar volume de material por soma de anéis:
V≈Σj (π/N)·Σi [Rext²−Rint²]·Δy,
com tratamento separado do fundo. Atualizar após gesto e comparar ao volume inicial. Redistribuir parte da diferença para faixas vizinhas não tocadas com ganho baixo, respeitando limites de espessura e raios. Alvo de variação até 8% em operações moderadas, validado por teste; se incompatível com limites, priorizar integridade da malha e aceitar aproximação maior. Não corrigir volume com mudança brusca global de silhueta nem afirmar conservação perfeita.

Quando um gesto atingir limite físico, reduzir gradualmente a resposta e exibir uma vez: “Aqui a argila já está bem fina. Experimente outra região.” Não exibir erro, pontuação ou som de falha.

## 6. Interação, jogabilidade e controles

Fluxo livre: entrar → experimentar → escolher ferramenta → observar → continuar, guardar ou recomeçar. Não há vencer, perder, cronômetro obrigatório, medalhas, meta de simetria ou comparação entre usuários. Presets iniciais Bloco, Tigela e Vaso são pontos de partida, escolhidos antes de substituir a peça atual.

Desktop:
- Arraste esquerdo sobre a peça usa a ferramenta atual.
- Arraste em área vazia orbita a câmera; alternativa explícita botão “Olhar ao redor”.
- Scroll ajusta zoom com limites; não sequestrar scroll de um painel.
- Arrastar controle “Girar peça” rotaciona a peça sobre o disco, independente de órbita da câmera.
- Teclas 1/2/3 selecionam Modelar/Alisar/Marcar; Z com Ctrl/Cmd desfaz; Shift+Ctrl/Cmd+Z refaz; Esc cancela modal e devolve foco.
- Não interceptar atalhos em campos de texto.

Celular:
- Um dedo sobre argila esculpe, em área vazia orbita.
- Dois dedos ajustam câmera/zoom e suspendem a escultura. Restaurar somente após levantar todos os dedos; evitar salto no retorno.
- touch-action:none apenas no canvas e nos controles gestuais apropriados. Textos, formulários e painel devem continuar roláveis.
- pointercancel, blur e perda de captura finalizam a transação com segurança e desligam som de contato.

Acesso por teclado: oferecer painel “Ajustes precisos”, selecionando faixa Baixo/Meio/Colo/Borda e botões “Ampliar”, “Estreitar”, “Alisar região” com passos de 0,5–1 mm. Altura e giro por sliders nativos. Foco visível, ordem lógica, nomes acessíveis; não declarar canvas inteiro como solução de acessibilidade. Textos de status em aria-live polite sem anunciar cada frame.

Histórico: transação por gesto, não por frame. Guardar até 30 snapshots de R, espessura, marcas, altura e orientação relevantes. Refazer limpo após nova ação. Troca de preset e recomeço entram no histórico. “Desfazer” deve recuperar o estado visual exato, inclusive marcas. Memória máxima definida e testada.

## 7. Layout de interface

Desktop >=1024 px:
- Topo esquerdo: pequeno rótulo “UM TEMPO PARA CRIAR”, título “Ateliê do Gesto Lento”, subtítulo “A argila acompanha o seu ritmo.”
- Topo direito: Som, Ambiente e menu de preferências, com rótulos.
- Canvas ocupa todo o fundo. Argila no centro, com 55–65% da altura útil no enquadramento de trabalho.
- Barra inferior central em fundo de papel: Modelar, Alisar, Marcar, divisor, Desfazer, Refazer. Ferramenta ativa com cor oliva, rótulo textual e aria-pressed.
- Canto inferior esquerdo: cartão estreito de orientação com uma frase; pode recolher.
- Lateral direita: painel recolhível “Seu gesto”: Tamanho do toque, Sensibilidade, Alcance, Altura e Girar peça. Não abrir todos os controles avançados na primeira visita.
- Rodapé discreto com “Guardado neste dispositivo” ou estado real de persistência.

Celular <=767 px:
- Título em uma linha ou duas, sem ocupar mais de 15% da tela.
- Ferramentas em dock inferior com alvos de no mínimo 44×44 px.
- Painel de ajustes como bottom sheet com max-height:65dvh, rolagem vertical e respeito a safe-area-inset-bottom.
- Instrução em uma linha acima do dock, dispensável pelo usuário.
- Canvas em 100dvh com reserva para áreas seguras; garantir peça e dock visíveis em 360×640, 390×844 e paisagem.

Preferências: sons independentes, volume, movimento reduzido, qualidade Automática/Leve/Alta, instruções e tamanho de texto. Não chamar desempenho de “física realista” na interface. Botões técnicos de FPS/debug só em modo desenvolvimento.

## 8. Textos finais em português

Entrada:
Título: “Ateliê do Gesto Lento”
Corpo: “Um pouco de argila, um gesto de cada vez. Você pode experimentar, mudar de ideia e deixar marcas.”
Ações: “Criar livremente” e “Experimentar uma prática”.
Nota curta: “Não há uma forma certa para chegar.”

Primeiro gesto: “Toque na argila e arraste devagar. Você pode desfazer quando quiser.”
Modelar: “Abra ou estreite a forma no seu ritmo.”
Alisar: “Passe pela superfície. Algumas marcas podem continuar.”
Marcar: “Desenhe uma linha, um ponto ou um caminho.”
Observar: “Você pode apenas olhar por um instante.”

Recomeço:
Título: “Começar outra forma?”
Corpo: “Sua peça atual será substituída. Você pode guardar uma imagem antes de continuar.”
Ações: “Continuar nesta peça”, “Guardar imagem”, “Recomeçar”.

Exportação: “Guardar imagem” e “Exportar peça editável”.
Sucesso de imagem: “Imagem preparada para salvar.” Evitar afirmar que um download foi salvo se só iniciou.
Persistência: “Guardado neste dispositivo”, “Não foi possível guardar neste dispositivo. Você ainda pode exportar a peça.”
Fim: “Por hoje, pode ser assim.” / “Quer dar um nome à sua peça?” / campo opcional “Nome da peça” / ações “Continuar criando” e “Guardar e encerrar”.

Não elogiar automaticamente a forma como perfeita. Não usar frases que mandem relaxar, controlem emoções ou tratem o resultado como indicador de personalidade.

## 9. Áudio e sensação material

Áudio desligado ao abrir. Iniciar AudioContext só após gesto em “Ativar som”. Separar Ambiente e Contato. Volume padrão moderado, fades de 150–350 ms, limiter/compressor no master e sem autoplay de voz.

Contato: ruído filtrado gerado em Web Audio, low-pass em torno de 1200 Hz, ganho baixo modulado por velocidade suavizada e força. Alisar mais abafado, esteca ligeiramente mais aguda. Só produzir som ao tocar de fato na argila, com ataque/decay que não cliquem. Não gerar oscilador novo a cada pointermove. Reutilizar fonte de ruído e envelopes.

Ambiente: silêncio como opção válida. Camada discreta de ar na janela e um eventual som de madeira sem sustos; não incluir sinos ou música continuamente por padrão. Arquivos gravados só se locais e licenciados. Não afirmar áudio binaural ou efeito de frequência terapêutica quando só há estéreo/síntese.

Vibração opcional via navigator.vibrate, se disponível e ativada, limitada a breve contato de ferramenta; não requisito para usar o recurso.

## 10. Salvamento, exportação e privacidade

Persistir peça em IndexedDB com debounce de 600 ms após o fim do gesto. Schema versionado: version, timestamp, name opcional, rings, segments, height, radii, thickness, marks, rotation, materialVariant e preferences. Não gravar arrays de Three.js não serializáveis. Não armazenar informações clínicas nem exigir cadastro.

Se storage falhar/quota exceder, manter sessão em memória e oferecer exportação. Ao reabrir, oferecer “Continuar minha peça” e “Começar outra”; não sobrescrever silenciosamente o trabalho salvo.

Exportar JSON validado com schemaVersion e limites; importar validando tipos, comprimento dos arrays, números finitos, tamanho máximo 5 MB e limites geométricos. Nunca executar conteúdo do arquivo. Dados inválidos devem produzir mensagem clara e manter peça atual.

Exportar PNG da cena sem interface usando render dedicado, com dimensões máximas 2048×2048 e opção de fundo do ateliê ou transparente. RenderTarget temporário e limpeza; não manter preserveDrawingBuffer ligado só para download. Sem imagens remotas que contaminem o canvas. Exportação GLB opcional via GLTFExporter: geometria real editada, material e licença; não condição para o fluxo básico.

Botão “Apagar minha peça deste dispositivo” com confirmação específica. A reflexão do modo guiado só é salva quando a pessoa escolher; conteúdo não sai do dispositivo sem ação explícita de exportar.

## 11. Assets e modelos

Usar assets/manifest.json como fonte dos nomes reais. assets/01_atelie_referencia.png: direção de arte/abertura, nunca fingir que o fundo 2D é a oficina navegável. assets/02_vaso_argila_recorte.png: cartão de entrada ou preset. assets/03_esteca_madeira_recorte.png: miniatura de ferramenta. assets/04_argila_albedo.png: base de material; verificar seams no objeto real, pois tileability gerada não é garantia técnica.

Modelar em Three.js: oficina, mesa, caixilhos, prateleira, disco, tigela, ferramentas e cerâmicas de fundo. Usar LatheGeometry para peças estáticas; peça editável usa BufferGeometry própria. Para ferramenta 3D, perfil extrudado bevelado. Jarros de fundo com paredes internas e boca real. Linho com plano subdividido e dobras baixas. Plantas com folhas curvas de espessura visual sutil, sem milhares de cones.

Melhorias opcionais por GLB: pincel de fibras, esteca detalhada e folhagem. Incluir arquivo local e licença se utilizados; nenhum asset comprado ou externo é obrigatório. Nada de texturas com marcas d'água. Imagens recortadas não são modelos 3D. Não inventar que existem normal, roughness, HDR, áudio WAV ou GLB no pacote se não constarem do manifest.

## 12. Desempenho e robustez

Meta a validar: 50–60 FPS em desktop comum e 30 FPS em celular intermediário. Não prometer sem medir. Uma luz com sombra, menos de 120 draw calls em qualidade leve e menos de 250 mil triângulos na cena completa como orçamento inicial. Pausar render ao ocultar aba, manter estado de edição, retomar com delta resetado. Render por demanda quando a cena estiver estática; durante gesto/áudio/transição, loop contínuo.

Qualidade automática reduz DPR, sombra, segmentos e poeira antes de reduzir precisão lógica da peça salva; manter representação autoritativa ou converter resoluções com interpolação explícita. Uma malha salva de alta resolução deve poder abrir em modo leve sem corromper seu conteúdo.

WebGL indisponível: mostrar “Este navegador não conseguiu abrir a oficina 3D” com “Tentar novamente” e “Usar bancada 2D”. Bancada 2D oferece edição do perfil radial por controles acessíveis e desenho 2D próprio, com exportação; não apresentar tela vazia. Perda de contexto pausa interação e tenta restaurar buffers sem perder a peça.

## 13. Critérios de aceite

1. A oficina tem profundidade real, materiais táteis, luz lateral e contato visual da peça com o disco.
2. Um gesto altera vértices; trocar câmera ou ferramenta preserva o resultado.
3. Modelar, alisar e marcar têm resultados diferentes, persistentes e reversíveis.
4. Boca aberta, fundo e espessura permanecem válidos após 100 gestos extremos.
5. Históricos recuperam forma, altura e marcas; refazer é invalidado por nova edição.
6. Um gesto equivalente em 30/60/120 FPS produz deformação equivalente dentro de tolerância definida.
7. Giro da peça não muda o sentido do arraste horizontal; câmera não orbita durante modelagem.
8. Toque com dois dedos, pointercancel e retomada não criam marcas involuntárias.
9. Salvar/restaurar e JSON round-trip mantêm os dados; arquivo inválido não apaga o estado atual.
10. PNG exporta a peça atual e abre corretamente; transparência tem alpha real quando solicitada.
11. Som começa só quando ativado, cessa ao perder contato e não continua ao sair.
12. Navegação por teclado e controles precisos permitem criar uma forma sem mouse.
13. Celular não tem sobreposição entre peça, dock e bottom sheet; painéis rolam normalmente.
14. Movimento reduzido elimina poeira e transições longas; toda prática pode ser pausada/encerrada.
15. Nenhum botão sem efeito, erro de console, asset ausente ou chamada remota desnecessária.

## 14. Ordem de implementação e entrega

Primeiro construir malha editável com testes de integridade, depois controles e histórico, depois persistência, depois oficina e luz, depois áudio, então modo guiado do segundo prompt. Validar em cada etapa. Não sacrificar o editor para entregar apenas uma sala bonita.

Entregar projeto instalável, comandos reais de execução/build, dependências fixadas, assets locais, instruções de abertura, breve lista do que está implementado e do que permanece aproximação. Se houver versão HTML única, embutir dependências licenciadas ou documentar conexão necessária. No resultado final, diferenciar com clareza prévia visual e recurso funcional.
