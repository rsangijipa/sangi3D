# T07 — Torre do Impulso | Produção 2.0

## Instruções para o agente de código
Implemente a experiência completa no repositório real; não entregue só mockup ou plano. Este arquivo reúne a decisão 2.0 e as referências específicas de produção. Leia o código existente, se houver. Se faltar a referência visual, siga a descrição textual e registre a ausência. Não simule testes nem aprovação. Execute em etapas pequenas: baseline → estado/regras → cena e assets → gesto principal → conteúdo/etapas → UI/áudio → persistência → testes → build e integração. Em cada etapa, valide o gesto e o estado antes de decorar. Anexe ao agente o mockup original e, para migração, o HTML/repositório correspondente.

## Escopo específico 2.0 — prevalece sobre versões antigas
- Verbo: aguardar o sinal. Dependência: física.
- Assets prioritários: torre, tubos, esferas, comportas, painel.
- Mecânica: Rapier fixed step, CCD para esferas, sinal textual e por forma, troca de regra anunciada, replay por seed.
- Aceite específico: Esfera não atravessa tubo; portão respeita estado; aguardar/liberar e resetar sem escore.

## Referência original de geometria, arte, materiais e interação (não normativa em conflitos)
# 07. TORRE DO IMPULSO

Categoria: Atenção, planejamento e funções executivas
Público: 5–15

## REFERÊNCIA VISUAL
Utilizar como imagem-guia a prévia apresentada ao lado do recurso no atlas ou, preferencialmente, o arquivo original anexado. A referência é uma direção visual; coordenadas a seguir são proposta inicial de reconstrução, sujeitas a calibração visual.

## GEOMETRIA E CÂMERA
Ambiente: 8 × 8 × 13 m, torre mecânica vertical.
Câmera: FOV 37°, câmera (10,8,15) mirando (0,6,0).
Paleta e iluminação: metal grafite, vidro esverdeado, esferas âmbar/azul, luz limpa de laboratório.

## MAPA ESPACIAL DOS OBJETOS
Torre cilíndrica de raio 2,6 m centrada (0,0,0), 11 m de altura. Três anéis de passarela circular em Y=2,5;5,5;8,5. Tubos espirais transparentes percorrem Y=9 até Y=1,2. Dois portões articulados ficam em (±1,5,4,0). Base de coleta com três nichos em Z=3.

## MESHES E ASSETS QUE DEVEM SER MODELADOS
Esferas distintas por cor e símbolo, tubos de vidro reforçado, portões com pivôs, sensores luminosos, alavancas grandes, painéis de estado e base para recolhimento das esferas.

## MATERIAIS, TEXTURAS E ACABAMENTOS
Aço metalness 0,8 roughness 0,35; tubos transmission 0,75 com espessura; borracha anticolisão; esferas cerâmicas roughness 0,38; LEDs emissivos discretos.

## INTERAÇÕES, REGRAS E FEEDBACK
Observar trajetórias e apertar liberar/aguardar segundo sinais configuráveis; alternar regras e permitir prática sem tempo; pausa obrigatória quando houver transições; explicar a escolha; registrar tipo de resposta e latência de interação sem comparações normativas.

## ÁUDIO
Clique mecânico e rolagem suaves e opcionais, sem alarmes súbitos.

## TECNOLOGIA E SISTEMAS ESPECÍFICOS
Rapier para esferas e colisões; simplificar tubos em colliders; animação determinística para modos mobile; estados de portões com tween.

## PROMPT INDIVIDUAL PARA GOOGLE NANO BANANA
Torre mecânica vertical 3D altamente realista com passarelas circulares, tubos de vidro em espiral, esferas coloridas descendo, duas comportas articuladas, base de coleta, metal grafite escovado e detalhes translúcidos, atmosfera científica lúdica com luz uniforme, vista três-quartos, sem texto, 16:9.

## CRITÉRIOS DE ACEITAÇÃO
1. Cena realmente tridimensional, não apenas fundo estático em 2D; câmera, peças e volumes coerentes com a referência.
2. Cada objeto principal possui ID, posição, rotação, escala, material e função no manifesto da cena.
3. Interface completa em português com navegação por teclado/toque; áudio opcional e controle de intensidade.
4. Ações executadas têm efeito visual e lógico verificável; estado pode ser reiniciado e salvo quando apropriado.
5. Captura lado a lado (referência vs implementação), ajuste da câmera e relatório de divergências.
6. Modo baixo desempenho, sem efeitos que provoquem estímulos inesperados; sem resultados diagnósticos automáticos.

---

## Dinâmica ampliada do kit de 17 jogos (prioridade de conteúdo após decisão 2.0)
**Projeto 06/17** | Anexe `mockup.png`.

Implemente o jogo completo descrito abaixo usando o mockup como alvo visual. Os requisitos específicos têm prioridade em caso de adaptação de layout; mantenha o contrato técnico comum.

### Conceito e objetivo
Brinquedo mecânico de liberar esfera após sinal e observar percurso. Praticar aguardar, responder a pistas e interromper uma ação sem punição. Sessão 3–8 min com rounds curtos configuráveis, sem classificação clínica.
### Cena, câmera e assets
Torre de madeira com coluna vertical, tigela transparente no topo, esfera de latão, comporta de madeira e tubo helicoidal transparente em torno de haste metálica, base circular sobre tapete musgo. Sinal luminoso em placa aparafusada: losango âmbar “Liberar”, círculo azul “Aguardar”. Fundo de oficina com janela, livros, lápis, planta e mini casa. Câmera 35–42° quase frontal para ver espiral completa; título topo direito e painel “Veja o sinal”, “Liberar esfera”, “Pausa”, etapa 2/5. Mobile preserva topo e saída do tubo, sem recortar sinal. Assets `tower_frame`, `funnel_glass`, `brass_ball`, `gate` pivot, `helix_tube`, `support_rod`, `signal_lamp`, `catch_tray`, `base`, `rug`. Tubo por curva helicoidal com espessura, 3–4 voltas e entrada/saída tangentes, transparência controlada.
### Dinâmica completa
1. Demonstração dos dois símbolos e liberação em ritmo livre. 2. Rodadas com sinal alternando após intervalo configurável de 1–4 s, sem limite de resposta por padrão. 3. Variar espera e, em modo opcional, sequência de duas esferas com alternância. 4. Oferecer pausa voluntária, escolher cor/forma da próxima esfera ou modo observação. 5. Revisão descritiva: esferas liberadas, aguardadas, tentativas antecipadas e pausas, sem pontuação. Em sinal de aguardar, toque não libera esfera; feedback discreto “Ainda estamos aguardando” e opção de dica. Em liberar, janela permanece até toque, sem susto. Modo livre elimina regra do sinal.
### Lógica, física e interação
FSM `idle → awaiting → ready → releasing → rolling → caught → next`, pausa congela o tempo restante. Seed para intervalos reproduzíveis. Input antecipado contabilizado uma vez por toque, não encerrar rodada. Gate abre 45–70° em 250 ms; esfera entra no tubo e percorre curva por comprimento de arco, velocidade derivada de gravidade tangencial/fricção limitada; rotação de rolling coerente, chegada amortecida. Prefira esfera guiada por spline determinística para não atravessar tubo; colisores estáticos na base, Rapier opcional só na saída. Animação de queda sem som alto, volume controlável. Bloquear nova liberação enquanto esfera está em trânsito; reset restaura posição/comporta/sinal. Estado `signal`, `round`, `remainingMs`, `ballProgress`, `earlyPresses`, `released`, `pauses`.
### Critérios específicos
Losango/círculo e texto distinguíveis sem cor; esfera nunca atravessa tubo; 20 rodadas seguidas sem travar; pausa congela esfera e espera; toque duplo não duplica esferas; antecipação não penaliza e permite seguir.

## Plano original de DNA, jornada e cena — referência de identidade; etapas antigas são substituídas pela sequência 2.0
# 07 · TORRE DO IMPULSO — Plano de execução
Porte **XL** · Onda 4 · 5–15 · Atenção, planejamento e funções executivas

## 1. Tese
**Entre o sinal e a ação cabe uma pausa que se pode treinar.** A criança observa esferas descendo e decide *liberar* ou *aguardar* segundo um sinal, praticando "parar, pensar, agir".
- Âncoras: formato inspirado em *Go/No-Go* e *Stop-signal* (Logan & Cowan, 1984) como **mecânica**; autoinstrução verbal "pare–pense–aja" (Meichenbaum & Goodman, 1971); intenções "se–então" (Gollwitzer). Adiamento de gratificação (Mischel) **não é usado** como mecânica, por ressalvas de replicação (Watts, Duncan & Quan, 2018).
- **Não afirma:** teste de atenção/impulsividade, TDAH, "latência normal". A latência registrada é **descritiva e sem comparação**.

## 2. DNA exclusivo
| Campo | Definição |
|---|---|
| Mundo | **Torre mecânica de laboratório** (grafite, vidro esverdeado, luz uniforme) |
| Verbo | **Esperar o sinal** |
| Assinatura técnica | **Física real (Rapier)**: esferas rolando em **tubos espirais**, **comportas articuladas** e **luzes-torre de sinal** (formas + cores) |
| Chrome | **Painéis de instrumento** (estilo cabine) com lâmpadas e interruptores grandes |
| Tipografia | B612 + B612 Mono (desenhada para legibilidade em cabine) |
| Luz/grade | Uniforme de laboratório, esferas âmbar/azul como únicos acentos |
| Áudio-assinatura | Clique mecânico + rolagem **suaves**; **sem alarmes** |
| Artefato | "Registro de respostas" (tipo + latência) sem comparação |
| **Não pode parecer** | Estação (05); relógio (06); parque de diversões |

## 3. Jornada
1. Vê a torre; as esferas **ainda não** descem. Treino: o sinal aparece e a esfera segura.
2. Com o sinal **A** (símbolo ◆ âmbar): *liberar*. Com o sinal **B** (símbolo ● azul): *aguardar*. Regras configuráveis.
3. **Pausa de transição**: ao trocar de regra, a torre **para** e o painel convida a "respirar e reler a regra" (sem tempo), com botão **Pronto**.
4. Depois de cada escolha, **explica** a decisão com cartões (*vi o sinal · quis tentar · não tenho certeza*), sem julgamento.
5. Vê seu registro de hoje (descritivo).

## 4. Cena (manifesto)
| ID | Posição | Notas |
|---|---|---|
| `torre_corpo` | (0,0,0) r=2,6; h=11 | aço grafite metal 0,8/0,35 |
| `anel_passarela_1..3` | Y=2,5 · 5,5 · 8,5 | passarelas circulares |
| `tubo_espiral` | Y=9→1,2 | vidro reforçado `transmission` 0,75, **espessura** |
| `comporta_L/R` | (±1,5, 4, 0) ⚠ ambiguidade | articuladas com **pivôs** |
| `base_coleta` | Z=3 | **3 nichos** |
| `esferas` | no topo | cerâmica 0,38; cor + **símbolo** |
| `sensores`, `alavancas`, `paineis_estado` | anéis | LEDs emissivos **discretos** |
Câmera FOV 37°, (10,8,15)→(0,6,0).

## 5. Sistemas
- **Rapier** (carregado sob demanda, ~WASM): esferas dinâmicas; tubo como **cadeia de colliders simples** (cápsulas), não malha triangulada; comportas cinemáticas.
- **Modo determinístico (móvel/baixo):** esferas seguem **spline** com gravidade simulada por curva — mesma regra, sem WASM.
- **RuleEngine:** sinais → ação esperada; resultado = *acordou com a regra / não*, mas apresentado como **evento neutro** ("liberou com o sinal azul").
- **Registro:** tipo de resposta + latência de interação (ms) — **não comparado**, não exibido como "lento/rápido".
- **Estado:** `respostas.json`; reiniciar zera.

## 6. Interface, bordas e ilustrações
- Painéis em **metal escovado** com parafusos; **lâmpadas-torre** (3 níveis) em SVG animado; interruptores grandes ("LIBERAR", "AGUARDAR", "PRONTO").
- **Selo "pausa"** (SVG) que aparece nas transições.
- Ilustração: **diagrama do trajeto** (esfera → tubo → comporta → nicho).
- Nenhum vermelho de alerta; **forma + posição + texto** carregam o sinal, a cor apenas apoia.

## 7. Áudio
Clique mecânico grave e curto; rolagem em rampa; feedback de encaixe suave; **sem buzina/alarme**. Tudo opcional; modo sem som.

## 8. Acessibilidade, conforto, ética
- **Sem tempo** por padrão; "Prática" e "Jogo livre" separados.
- Alternativa por teclado (Espaço = liberar; "A" = aguardar) e botões grandes.
- Reduzir movimento: esferas viram **passos discretos** em vez de queda contínua.
- A criança nunca "perde": esferas não liberadas são reaproveitadas.
- Linguagem de pausa como **conquista de escolha**, não de controle.

## 9. Etapas
| Etapa | Entrega | Aceite verificável |
|---|---|---|
| **E0** Conteúdo | Sinais, regras, textos de pausa, vocabulário de explicação | Aprovado |
| **E1** Blocking | Torre, anéis, tubo (caixa), câmera; resolver ambiguidade dos portões | Validador; captura |
| **E2** Hero | Torre, tubos espirais, comportas, esferas, painéis | Pivôs; GLB; orçamento |
| **E3** Luz + assinatura | Luz uniforme, lâmpadas-torre, brilho discreto | Sem flicker; bloom contido |
| **E4** Mecânica | Rapier + modo determinístico, RuleEngine, pausas, registro | Vitest: regras e transição; **mesmo resultado nos dois modos** |
| **E5** Interface | Painéis, selos, diagrama | Contraste; teclado |
| **E6** Áudio | Cliques/rolagem | Pico ≤ teto |
| **E7** Segurança | Reduzir movimento, baixo desempenho, retenção | axe; 30 fps móvel |
| **E8** Entrega | Capturas, divergências, README | 6 critérios com evidência |

## 10. Riscos
Estabilidade de esferas em tubo espiral (colisores simples + limite de velocidade + *failsafe* de teletransporte para a base) · peso do WASM (sob demanda + modo determinístico) · interpretação clínica da latência (deixar claro "descritivo, sem norma").


---
# Contrato de produção 2.0 — obrigatório

**Precedência:** este contrato define tecnologia, privacidade e aceite. As decisões específicas 2.0 do projeto prevalecem sobre versões antigas de conteúdo. As referências preservadas orientam cena e identidade, não impõem stack antiga, dimensões não confirmadas ou funcionalidades incompatíveis. Em caso de conflito não resolvido, registre e preserve o comportamento existente até validação. Não declare implementação ou teste sem evidência.

## 1. Arquitetura e entrega
- Inventariar repositório e executar baseline antes de editar; preservar rota, slug, integrações e funcionalidades existentes. Trabalhar em branch própria; migração incremental, rollback e snapshots de estados reais. Não sobrescrever outros jogos.
- Vite + TypeScript estrito + Three.js WebGL2, versão compatível fixada no lockfile após teste de API. React Three Fiber somente se host já for React e se não houver dois renderers. Dependências, fontes, decoders e assets locais; nenhum CDN em runtime. Não presumir acesso a caminhos Windows. Se disponíveis, reutilizar `engine.ts`, `pbr.ts`, `effects.ts`, `model.ts`, `audio.ts` e Barra Imersiva; senão implementar equivalentes, não alegar cópia.
- Separar `game/{state,content,rules}.ts`, `scene/`, `input/`, `audio/`, `ui/`, `assets/`, `tests/`; módulo de cena lazy-load com init, resize, pause, resume, dispose. Um estado serializável e comandos únicos; simulação determinística onde útil. Não persistir objetos Three. Entregar código, package.json/lockfile, README, manifestos, testes, build estático e relatório.
- HTML legado: manter entrada compatível, permitir exportar build estático para subdiretório; distribuição em pasta HTML+assets local é padrão. Arquivo HTML único só como export adicional quando realmente viável (bibliotecas/asset embutidos e testados). `file://` não é pressuposto; documentar servidor HTTP. Offline após instalação/cache validado, com service worker versionado, fallback e teste sem rede.
- Integração: rota ou iframe isolado, eventos `ready`, `pause`, `resume`, `complete`, `exit`, `summary` versionados e origem permitida. Não enviar textos ou dados pessoais por padrão. Launcher com id, título, categoria, descrição, entrada, thumbnail própria, capabilities e status.

## 2. Motor e identidade
- Núcleo invisível comum; cada projeto preserva verbo, paleta, composição, materiais, tipografia e ferramentas contextuais do mockup aprovado. Não reaproveitar tema visual por conveniência. Reconstruir em 3D real, nunca imagem inteira clicável. Coordenadas originais são propostas; calibrar com referência real. Se mockup faltar, usar texto e declarar fidelidade visual não verificada.
- Pipeline: WebGLRenderer + EffectComposer quando suportado, alvo HalfFloat/MSAA com fallback testado, RenderPass, GTAO meia resolução só Cinema, bloom contido opcional, um pass final ACES/sRGB/gradação (sem dupla conversão). PCFShadowMap se compatível com versão; sombras sob demanda com invalidação por movimento/luz, câmera de sombra atualizada após alteração. PMREM do cenário; luz principal motivada; contato sob objetos, fachos que desaparecem perto da câmera. Sem flashes. Grão e aberração desativados por padrão; conforto prevalece.
- Cinema / Equilibrada / Leve + Automática; detectar capacidades e medir, não só nome da GPU. Orçamento inicial 3,6 / 1,15 / 0,55 MP, reduzir escala após custo sustentado acima de 24 ms e aumentar lentamente com histerese abaixo de 17 ms; Leve sem pós pesado. Pause quando aba oculta ou canvas fora de tela; recuperar contexto ou fallback DOM funcional.
- Geometria detalhada procedural para comuns; GLB para hero/rig quando justificado. Bevel, lathe, tubos afunilados, pivôs por função, metros/Y-up, IDs e colliders separados. Texturas PBR com cor sRGB e mapas de dados lineares; veios e micro-relevo, UV em metros; cache, atlas, instancing, merge estático, LOD. 512–1024 px comuns, 2k hero só com justificativa. Vidro/transparência barata em mobile; evitar transmission em Leve. Manifesto por asset: id, caminho, licença, tamanho, LOD, materiais, pivô, colisão, clips, fallback; `scene.json` com pos/rot/scale/função. Gerar modelos efetivos, não placeholders. Proveniência e licença em credits.md.

## 3. Mecânica e controles
- Ação central muda estado e cena; feedback por objeto, texto e som opcional. Raycast em hitboxes; pointer capture; separar toque de arraste, câmera e HUD; teclado e botões equivalentes. Orbit limitado; câmera não atravessa objetos. Zoom/visões nomeadas, reduz movimento e transições sem tremor. Undo/redo para criação, reset destrutivo confirmado.
- Física: usar Rapier para contatos/corpos rígidos necessários, passo fixo 1/60 s, substeps/CCD quando necessário, limite de delta após pausa; parâmetros em unidades coerentes. Mecanismos de engrenagem, trilho, dobradiça e animação guiada usam cinemática determinística se suficiente. Fluidos, tecidos, aroma e sensação tátil podem ser aproximações explícitas. Deformações locais recalculam somente região alterada; meta <6 ms por gesto medido.
- Fluxo: entrada → modo livre/guiado/acompanhado quando apropriado → demonstração pulável → interações com feedback → revisão → repetir ou sair. Pausa e saída sempre acessíveis. Não forçar completar etapas subjetivas. Estados extremos e resets devem manter consistência.

## 4. Interface, áudio e privacidade
- Barra Imersiva: cena inteira; topo compacto com título, voltar, ações, tela cheia, recolher H; Esc fecha painel; barra inferior de ferramentas; um painel contextual por vez. Mobile 100dvh, safe-area, bottom sheet, câmera reenquadrada, alvos >=44 px (48 px preferível), foco visível, contraste 4,5:1, aria-live, navegação por teclado e alternativa DOM para ações essenciais. Não copiar HUD fixo do mockup: manter textos, hierarquia e composição 3D.
- Web Audio só após gesto explícito de som; mixer/master mute, fades, compressor/limitador e teto digital conservador, polifonia limitada. Não prometer segurança auditiva baseada apenas em dBFS. Silêncio inicial e alternativas visuais. Sem microfone/câmera por padrão. Assets sonoros locais e licenciados/originais.
- Terapêuticos: convites fenomenológicos, sem diagnóstico, interpretação, benefício clínico garantido, ranking, escore subjetivo, punição ou cronômetro coercitivo. Regras objetivas podem receber feedback descritivo. Registre só observáveis e autorrelatos voluntários; significado pertence a quem cria. Mediação configurável, especialmente com crianças; evitar estímulos inesperados. Dados sensíveis em memória por padrão, persistência somente opt-in, exportação seletiva e exclusão. localStorage apenas preferências não sensíveis; IndexedDB para acervo voluntário com proteção adequada e aviso de dispositivo compartilhado. Não logar conteúdo pessoal. Sem analytics remoto.
- Comerciais: `MARCA` com nome, logoTexto, cores, fontes, textos, CTA, catálogo, dois presets (original e neutro). Re-skin também altera acentos 3D. Preservar nav/título/CTA em site; `?embed=1` oculta navegação demo. CTA por evento versionado com `tipo:'cta'`, origem validada e link configurado; evitar abertura duplicada; sem dados pessoais por padrão. Placar permitido somente entretenimento comercial não clínico, opcional. Prêmios reais dependem de sistema e regras verificados, nunca inventar emissão.

## 5. Aceite e orçamento
- Metas iniciais, não garantias: 60 fps desktop, 30 fps celular intermediário real; Intel UHD Equilibrada <=25 ms a 1280×720 na medição de referência e Cinema <=45 ms, separados de FPS sustentado; draw calls ~100 mobile / 180 desktop, triângulos ~150k / 350k, primeira cena jogável ~5 MB transferidos. Medir em dispositivo real quando disponível, registrar hardware, browser, tier, resolução, p50/p95 frame time, chamadas, tris, bytes, memória aproximada, tempo de carregamento. Explicar exceções com perfil e justificativa. Não usar FPS de aba oculta.
- Testes: unitário (FSM, regras, reset, pausa, extremos), integração (picking, toque, teclado, mute, reload, resize, context loss, dispose, persistência), Playwright 1920×1080, 1280×720, 390×844, 360×640, tablet/landscape; axe quando aplicável. Testar sessões repetidas e offline. Build/tsc limpos, sem console errors/404. Verificar acessibilidade e ausência de dados sensíveis em eventos/logs.
- Capturas: entrada, interação principal, conclusão, mobile, cada preset/visão e close-up dos hero assets. Comparar lado a lado com mockup aprovado se disponível; registrar desvios. Sem referência não declare fidelidade visual. Restaurar preferências alteradas nos testes. Entregar matriz de evidências com PASS/FAIL/NÃO TESTADO, medições reais e pendências. Só declarar pronto após critérios específicos e comuns; bloqueios não podem ser mascarados com placeholder.
