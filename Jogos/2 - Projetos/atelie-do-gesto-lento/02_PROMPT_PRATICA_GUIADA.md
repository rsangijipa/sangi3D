# PROMPT DE CONTINUAÇÃO — PRÁTICA GUIADA DO GESTO LENTO

Use após 01_PROMPT_MESTRE.md. Este é o segundo modo da mesma aplicação e reutiliza oficina, argila, física, ferramentas, assets, persistência e acessibilidade. A duplicação textual no pedido não define um segundo recurso diferente; não inventar uma outra aplicação como se tivesse sido solicitada.

## 1. Objetivo e comportamento

Implemente uma prática opcional que oferece convites curtos para tocar, experimentar, observar e encerrar. A pessoa pode permanecer numa etapa, pular, pausar ou sair para a modelagem livre preservando sua peça. Não avaliar desenho, rapidez, simetria, quantidade de gestos ou “grau de relaxamento”. A experiência não depende de seguir comandos respiratórios.

Duração sugerida escolhida na entrada: “Breve · cerca de 3 minutos”, “Com tempo · cerca de 7 minutos” ou “Sem relógio”. Os tempos são sugestões, sem contagem regressiva visível por padrão. A duração escolhida ajusta quando oferecer o próximo convite, não força transições. Não exigir conclusão.

## 2. Layout e entrada

Botão “Experimentar uma prática” abre um painel de papel com título “Como você quer chegar?”. Mostrar os três tempos, botão “Começar” e “Voltar ao ateliê”. A peça atual permanece intacta. Se não houver peça, criar bloco inicial do prompt mestre.

Modo guiado mantém canvas e dock. Substituir o cartão de orientação por um cartão de convite com rótulo “Convite 1 de 5”, texto de até três linhas, botão principal “Seguir” e ação discreta “Pular”. Na parte superior: “Pausar prática” e “Sair da prática”. Não duplicar painéis de ajustes. No celular, cartão recolhível acima das ferramentas com altura máxima de 30dvh; texto ampliado usa rolagem e não cobre toda a peça.

Transição entre convites com crossfade de 200 ms, zero animação com movimento reduzido. Não trocar câmera automaticamente a cada passo. A primeira aproximação pode ser oferecida pelo botão “Ver de perto”.

## 3. Máquina de estados

Estados explícitos:
IDLE → SETUP → ARRIVE → TOUCH → EXPERIMENT → OBSERVE → CLOSE → FINISHED.
De cada estado ativo é possível ir a PAUSED ou retornar ao modo livre.

Guardar previousState ao pausar. “Retomar” volta ao estado anterior com a peça inalterada e zera delta de tempo. “Sair da prática” não apaga dados nem chama recomeço. Navegação por “Voltar” pode retornar ao convite anterior sem desfazer gestos já realizados. Histórico da argila é independente da navegação da prática.

Ações:
- BEGIN configura duração e entra ARRIVE.
- NEXT avança somente por ação da pessoa.
- SKIP avança sem registrar falha.
- PREVIOUS volta um convite.
- PAUSE congela tempo e áudio da prática; edição suspensa com overlay discreto.
- RESUME retoma.
- EXIT vai a IDLE, mantém a peça, encerra apenas a orientação.
- FINISH oferece encerramento e exportação opcional.

Tempo acumulado conta somente enquanto visível, em estado ativo e não pausado. Uma aba em segundo plano não acumula “tempo de prática”. Usar performance.now e ajustar ao retomar; não depender de setInterval como relógio autoritativo. Nenhum passo avança automaticamente por inatividade.

Para modo Breve, oferecer próximo convite após aproximadamente [20,35,55,40,30] s por etapa; para Com tempo, [45,80,140,90,65] s. Quando o tempo sugerido passar, apenas destacar “Seguir quando quiser”, sem alerta sonoro. O próximo botão já fica disponível desde o início. “Sem relógio” não exibe duração nem oferece avanço por tempo.

## 4. Conteúdo completo dos cinco convites

### Convite 1 — Chegar
Texto principal: “Antes de fazer alguma coisa, encontre um jeito confortável de ficar. Olhe a luz, a bancada e a argila.”
Texto auxiliar opcional: “Se quiser, perceba o apoio dos pés e das mãos onde você está.”
Botão: “Me aproximar da argila”.
Ação secundária: “Seguir sem aproximação”.
Atividade: observar; não exigir clique na peça. Câmera aproxima somente ao clicar no botão, respeitando movimento reduzido. A conclusão depende de “Seguir”, não de uma postura inferida.

### Convite 2 — Encontrar o gesto
Texto principal: “Faça um gesto pequeno. Veja o que muda e o que continua.”
Texto auxiliar: “Arraste para a direita para abrir; para a esquerda para estreitar. Você pode desfazer.”
Ferramenta sugerida: Modelar, alcance Faixa inteira. Se a pessoa usa outra, não bloquear.
Botões: “Seguir” e “Pular este convite”.
Depois do primeiro gesto concluído, mostrar uma vez: “A forma pode ir aparecendo aos poucos.” Não mostrar elogio por desempenho.

### Convite 3 — Experimentar
Texto principal: “Escolha uma região para alisar ou uma marca para deixar. Não é preciso resolver a peça inteira.”
Texto auxiliar: “Você pode trocar de ferramenta e mudar de ideia.”
Oferecer botões contextuais “Experimentar alisar” e “Experimentar marcar”; apenas selecionam ferramentas reais, não aplicam um efeito automático.
Se quiser recomeçar, reutilizar confirmação do prompt mestre com opção de guardar imagem. Não reiniciar a prática junto com a peça; são estados separados.
Sem inferência: assimetria não significa desregulação; marcas não significam sintomas; peça polida não significa progresso emocional.

### Convite 4 — Olhar de novo
Texto principal: “Pare por um instante e olhe o que ficou. Há alguma parte que você quer manter assim?”
Texto auxiliar: “Você pode girar a peça, continuar criando ou apenas observar.”
Ações contextuais: “Girar a peça” expõe slider nativo; “Voltar a tocar” retorna ao editor mantendo o convite.
Não ativar rotação contínua. Não escurecer o ambiente para sugerir sucesso. Manter criação acessível.

### Convite 5 — Deixar por hoje
Texto principal: “Por hoje, pode ser assim. Você pode continuar outra hora.”
Pergunta opcional: “Como foi criar sem precisar chegar a uma forma certa?”
Campo de texto opcional até 500 caracteres, rótulo “Uma anotação para você”, sem placeholder que substitua rótulo.
Checkbox desmarcado: “Guardar esta anotação neste dispositivo”. Se desmarcado, a nota fica só em memória e é descartada ao sair com aviso claro, sem insistência.
Ações: “Guardar imagem”, “Continuar criando”, “Encerrar por hoje”. Exportação não obrigatória. Não exigir nome da peça ou avaliação emocional.
Encerramento mostra “Sua peça pode esperar por você.” somente se a persistência estiver confirmada; caso contrário “Você pode exportar sua peça para continuar depois.”

## 5. Recursos de orientação

Leitura por voz opcional, desligada por padrão. Usar speechSynthesis quando disponível, preferir voz pt-BR do dispositivo; não exigir download de voz ou serviço externo. Ao trocar convite, cancelar fala anterior antes de iniciar a próxima. Pausa, saída, aba oculta e fechamento devem interromper a fala. Se não houver voz adequada, manter texto e informar “A leitura por voz não está disponível neste navegador”. Não impedir a prática.

Textos devem continuar acessíveis a leitores de tela. Não anunciar cada atualização de timer. Quando houver voz sintetizada, permitir desativá-la separadamente do áudio material. Não falar sobre instruções de movimento simultaneamente com mensagens de alerta.

Opção “Menos instruções” reduz o cartão à frase principal. Botão “Ler mais” recupera texto auxiliar. Manter “Sair da prática” acessível com no máximo dois toques.

## 6. Pausa e interrupção

Overlay:
Título: “Uma pausa também faz parte.”
Corpo: “A sua peça fica aqui enquanto você faz uma pausa.”
Ações: “Retomar”, “Continuar sem orientação”, “Encerrar por hoje”.

Não usar contagem regressiva para voltar, streak, sequência diária perdida, lembrete insistente ou animação para recuperar atenção. Nenhum estímulo inesperado ao retomar uma aba. Se a pessoa sair durante um gesto, finalizar uma única transação estável, salvar quando possível e interromper sons.

## 7. Modo acompanhado

Preferência opcional “Uso acompanhado”, com configuração de ritmo Livre/Sugestões e leitura por voz. Destinada a facilitar mediação em sessão, sem painel diagnóstico, escore de ansiedade ou relatório de personalidade. Pode ocultar duração e perguntas finais, mantendo ferramentas e orientação visual.

Uma pessoa mediadora pode escolher convites, mas o editor não controla nem registra a pessoa atendida. Não criar campos de paciente, prontuário, gravação de tela ou upload de notas automaticamente. Se uma integração futura demandar isso, tratar como outro escopo.

## 8. Dados e exportação

guidedState: schemaVersion, currentStep, durationChoice, activeElapsedMs, narrationEnabled, reducedInstructions. Guardar somente ao salvar a peça; não persistir timestamps de cada toque como rastreamento comportamental.

Anotação final em estrutura separada, apenas com checkbox selecionado e indicação de persistência real. Exportação da peça não inclui reflexão por padrão; oferecer escolha explícita “Incluir minha anotação”. Apagar dados locais remove peça e nota associada após confirmação.

Nenhuma classificação automática por emoções, gestos ou conteúdo da reflexão. Não enviar texto a uma IA externa como condição de uso.

## 9. Testes e aceite específicos

- Próximo, voltar e pular preservam a malha e histórico.
- Pausar não acumula tempo nem deixa contato/voz tocando.
- Encerrar não dispara recomeço nem remove peça salva.
- Todos os convites podem ser pulados; ainda assim a pessoa chega ao encerramento.
- Aba oculta e retorno não avançam estado.
- Alterar tempo não reinicia peça; aplicar a duração somente às sugestões futuras.
- Reflexão desmarcada não reaparece depois de fechar/reabrir; marcada pode ser restaurada e apagada.
- Leitor de tela acompanha troca de convite sem repetição excessiva.
- Texto em 200% e teclado continuam permitindo pausa, avanço e saída.
- Sem som e sem voz, todo o fluxo continua compreensível.
- Nenhum texto diz que o usuário relaxou, melhorou ou concluiu uma meta emocional por ter terminado.

Entregar este modo integrado ao projeto do prompt mestre. Não criar uma nova oficina com outro pacote duplicado de Three.js, geometria ou assets.
