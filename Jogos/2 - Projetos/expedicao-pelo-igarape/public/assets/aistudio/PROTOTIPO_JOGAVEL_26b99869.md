# 091 — Expedição pelo Igarapé | Especificação de protótipo jogável

**Prompt de implementação:** desenvolva uma experiência independente para Sangi3D, com HTML, CSS, JavaScript e Three.js (WebGL). Entregue um `index.html` executável em servidor HTTP local, código-fonte e recursos necessários. Não entregue apenas imagens, uma cena estática ou controles sem função. Se o mockup estiver disponível, use-o como referência de composição, sem sacrificar a interação.

## 1. Visão e direção de arte

O jogador deve poder **remar, navegar por curvas, observar fauna, parar em margens autorizadas e fotografar**. A proposta é: sessão de 5–15 minutos ou livre; mapa, pontos de retorno e exploração.

Cenário: Igarapé amazônico com canoa de madeira, raízes, folhas, água escura e raios de sol atravessando dossel. Câmera: Primeira pessoa na canoa e vista externa. Paisagem naturalista de grande profundidade, escala coerente, caminhos identificáveis, iluminação atmosférica e pontos de interesse legíveis.

## 2. Loop de interação e escopo mínimo jogável

1. Inicializar cena, oferecer dica curta e permitir ação imediatamente; áudio inicia somente após interação do usuário.
2. Implementar o ciclo específico: Remar, navegar por curvas, observar fauna, parar em margens autorizadas e fotografar.
3. Atualizar estado e apresentar feedback visual e sonoro proporcional à ação, incluindo indicação clara de operações inválidas quando aplicável.
4. Permitir repetir, pausar, retomar e reiniciar de forma segura. Disponibilizar ajuda contextual e controles de acessibilidade.

**Modos e progressão:** Três trechos e diário naturalista; espécies verificadas na implementação. Todo modo descrito deve ser acessível no protótipo; evitar objetivos e penalidades que contrariem sua finalidade.

## 3. Física, simulação e estado

Flutuação e arrasto aproximados, corrente vetorial, colisores de margem e agentes de fauna. Separar a representação gráfica do estado da simulação; avançar física com timestep fixo ou integração temporal estável, limitar substeps e interpolar quando necessário. Usar física analítica, grade, restrições ou motor de corpos rígidos conforme este modelo; não adicionar um motor complexo onde não houver benefício. Expor parâmetros relevantes ao HUD, limitar valores extremos e permitir reset determinístico. Documentar o que é aproximação, o que é animação e o que foi efetivamente medido.

## 4. Assets, gráficos e áudio

Modelar todos os elementos descritos na seção 1 e ferramentas listadas abaixo, com escala, origem, pivôs, UVs e colisores adequados. Priorizar geometria procedural e texturas originais; GLB/glTF otimizado quando a geometria exigir assets externos, com licença registrada. Aplicar PBR, luz ambiente, sombras suaves, reflexos e efeitos específicos da cena; partículas limitadas e instancing onde houver repetição. Evitar assets ausentes ou referências quebradas.

Áudio: Água, aves, insetos e remo. Vincular intensidade e posição sonora a eventos reais do estado quando pertinente, com volume geral, mute e alternativa visual para sinais essenciais. Não reproduzir áudio automaticamente nem usar música protegida sem autorização.

## 5. Controles e UX

Ferramentas: **Remar, observar, mapa, horário**. Cada ferramenta altera o estado descrito, com valor atual, feedback e rótulo acessível. Organizar uma barra periférica e controles avançados recolhíveis; preservar a área 3D. Desktop: mouse, teclado e comandos de câmera apropriados ao enquadramento. Mobile: toque com Pointer Events, arraste, zoom por pinça quando houver câmera orbital, botões equivalentes às teclas; para exploração, joystick ou controles direcionais e botão contextual. Bloquear órbita durante manipulação e enquanto menus estiverem abertos. Alvos de toque de 44–48 px, safe areas, suporte retrato/paisagem, painel inferior rolável e botão de saída sempre alcançável. Respeitar redução de movimento, permitir controle de volume e não depender somente da cor.
- Identificar parâmetros, unidades quando aplicáveis, limites e hipóteses do modelo. A experiência é didática; não apresentar aproximações como previsões científicas validadas.


## 6. Arquitetura e integração

Estruturar estado serializável, entrada, simulação, renderização, áudio, UI e diagnóstico em módulos ou seções isoladas. Fixar uma versão compatível de Three.js e seus addons; verificar contrato real do launcher antes de conectar eventos de pausa, retomada, mute, reset e descarte. O jogo deve abrir também sem o launcher. Empacotar dependências e assets necessários ou documentar claramente requisitos de rede. Não alegar funcionamento offline sem teste. Pausar em aba oculta, remover listeners e liberar geometria, materiais, texturas, áudio e render targets no descarte. Tratar falha de WebGL com mensagem e opção de retorno; recuperar contexto quando viável. Salvar apenas estados que façam sentido para esta proposta; não transmitir dados pessoais.

## 7. Performance e validação

Metas propostas, não resultados: 60 FPS desktop e 30 FPS mobile em dispositivos de referência definidos no teste; perfis baixo/médio/alto com redução de resolução, sombras, partículas, LOD e pós-processamento antes de remover mecânicas essenciais. Medir frame time, draw calls e memória, evitar recriação por frame. Validar viewport 390 × 844 e 844 × 390, além de 1440 × 900; registrar navegador, dispositivo, versão, duração e limitações.

**Testes específicos obrigatórios:**

- T01: Canoa deriva com corrente. 
- T02: remada muda velocidade. 
- T03: não atravessa margem. 
- T04: saída disponível. 
- T-UX: realizar o ciclo principal completo por mouse/teclado e por toque, sem conflitos de câmera e controles.
- T-STATE: pausar, retomar, reiniciar e reabrir; verificar consistência do estado, áudio e ausência de duplicação de loops.
- T-RENDER: inicialização sem erros bloqueantes, resize e troca de orientação; testar degradação gráfica e retorno ao launcher quando integrado.

## 8. Entregáveis e definição de pronto

`index.html`, fontes e assets (quando não incorporados), README com instruções de execução, manifesto de assets/licenças, relatório de testes e uma captura desktop/mobile do protótipo executado. Entregar todas as interações e modos mínimos funcionando; distinguir funcionalidades futuras, aproximações e testes não realizados. Não declarar pronto para produção sem evidências. O mockup visual não substitui testes.
