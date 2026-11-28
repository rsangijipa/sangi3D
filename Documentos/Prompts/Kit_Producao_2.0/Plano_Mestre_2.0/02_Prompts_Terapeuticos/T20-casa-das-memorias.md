# T20 — Casa das Memórias | Produção 2.0

## Instruções para o agente de código
Implemente a experiência completa no repositório real; não entregue só mockup ou plano. Este arquivo reúne a decisão 2.0 e as referências específicas de produção. Leia o código existente, se houver. Se faltar a referência visual, siga a descrição textual e registre a ausência. Não simule testes nem aprovação. Execute em etapas pequenas: baseline → estado/regras → cena e assets → gesto principal → conteúdo/etapas → UI/áudio → persistência → testes → build e integração. Em cada etapa, valide o gesto e o estado antes de decorar. Anexe ao agente o mockup original e, para migração, o HTML/repositório correspondente.

## Escopo específico 2.0 — prevalece sobre versões antigas
- Verbo: organizar lembranças. Dependência: dados/construção.
- Assets prioritários: casa em corte, quatro cômodos, álbum, mala, molduras.
- Mecânica: Snap em prateleiras, gavetas, fotos locais opcionais, linha do tempo sem datas; privacidade forte.
- Aceite específico: Guardar/omitir, reorganizar, exportar seletivamente e apagar; sem inferências.

## Referência original de geometria, arte, materiais e interação (não normativa em conflitos)
# 20. CASA DAS MEMÓRIAS

Categoria: Expressão simbólica e narrativa
Público: adolescentes, adultos e idosos

## REFERÊNCIA VISUAL
Utilizar como imagem-guia a prévia apresentada ao lado do recurso no atlas ou, preferencialmente, o arquivo original anexado. A referência é uma direção visual; coordenadas a seguir são proposta inicial de reconstrução, sujeitas a calibração visual.

## GEOMETRIA E CÂMERA
Ambiente: 18 × 14 × 6 m, casa com três ambientes conectados.
Câmera: FOV 39°, overview em (14,10,17) olhando para (0,1,0); modo livre câmera 1,5m.
Paleta e iluminação: nogueira clara, tecidos creme, fotografia sépia suave, verde de plantas, luz natural.

## MAPA ESPACIAL DOS OBJETOS
Casa seccionada tipo dollhouse: sala principal 7 × 6m no centro, biblioteca/escritório 5 × 5m à esquerda X=-6, ateliê/galeria 5 × 5m à direita X=6. Porta entre salas no eixo X, escada decorativa ao fundo, janelas para uma paisagem neutra no Z=-6.

## MESHES E ASSETS QUE DEVEM SER MODELADOS
Estantes com livros sem títulos, caixas de lembrança, álbuns abertos de páginas em branco, molduras vazias, objetos personalizados escolhidos pelo usuário, planta, luminária de mesa, sofá e malas. Fotos reais nunca são carregadas em serviço externo sem consentimento.

## MATERIAIS, TEXTURAS E ACABAMENTOS
Madeira com veios e roughness 0,58; papel com bordas irregularmente finas; tecido bouclé com normal map; couro gasto moderado; vidro de quadros seletivo e metal discretamente envelhecido.

## INTERAÇÕES, REGRAS E FEEDBACK
Organizar objetos em cômodos, escolher o que deseja guardar ou omitir, associar narrativas, criar linhas do tempo sem datas obrigatórias, revisitar ambientes, desfazer e exportar somente mediante decisão explícita; botões grandes e texto ampliável.

## ÁUDIO
Ambiência leve opcional, leitura de textos em voz quando solicitada e silêncio por padrão.

## TECNOLOGIA E SISTEMAS ESPECÍFICOS
Three.js scene por cômodo com lazy loading, drag-drop 3D e snap em prateleira, dados locais IndexedDB criptografia no backend se sincronizado, screenshots locais opcionais.

## PROMPT INDIVIDUAL PARA GOOGLE NANO BANANA
Casa de memórias 3D hiper-realista estilo dollhouse com três cômodos visíveis em corte: sala central com sofá e álbum, biblioteca íntima à esquerda com livros e caixas, pequeno ateliê à direita com molduras e objetos em branco, plantas e luz lateral delicada, madeira nogueira e tecidos creme, fotografia analógica suave sem fotos identificáveis, sem texto, 16:9.

## CRITÉRIOS DE ACEITAÇÃO
1. Cena realmente tridimensional, não apenas fundo estático em 2D; câmera, peças e volumes coerentes com a referência.
2. Cada objeto principal possui ID, posição, rotação, escala, material e função no manifesto da cena.
3. Interface completa em português com navegação por teclado/toque; áudio opcional e controle de intensidade.
4. Ações executadas têm efeito visual e lógico verificável; estado pode ser reiniciado e salvo quando apropriado.
5. Captura lado a lado (referência vs implementação), ajuste da câmera e relatório de divergências.
6. Modo baixo desempenho, sem efeitos que provoquem estímulos inesperados; sem resultados diagnósticos automáticos.

---

## Dinâmica ampliada do kit de 17 jogos (prioridade de conteúdo após decisão 2.0)
**Projeto 15/17** | Anexe `mockup.png`.

Implemente o jogo completo descrito abaixo usando o mockup como alvo visual. Os requisitos específicos têm prioridade em caso de adaptação de layout; mantenha o contrato técnico comum.

### Conceito e objetivo
Casa de bonecas para organizar memórias simbólicas, reais ou fictícias, escolhendo o que deixar à vista, guardar ou não criar. Atividade expressiva voluntária, sem sugerir que lembrar ou ocultar eventos seja obrigatório. Sessão 5–15 min.
### Cena, câmera e assets
Casa aberta em corte frontal com telhado de feltro verde, paredes creme/terracota, estrutura de madeira, quatro cômodos: sala de leitura com poltrona, estante e luminária; quarto com cama e cobertor; cômodo inferior esquerdo com cômoda, gaveta aberta, livro verde, moldura vazia e planta; depósito inferior direito com mala e prateleiras; escada central. Miniatura sobre mesa de madeira, luz doméstica âmbar. HUD “Guardar ou omitir”, “Deixar à vista”, “Guardar na gaveta”, “Pular”, etapa 4/6. Mobile aproxima cômodo ativo com navegação para voltar à casa. Assets `dollhouse_shell`, `roof`, `stairs`, `armchair`, `bookshelf`, `bed`, `blanket`, `dresser` com `drawer` deslizante, `memory_book`, `empty_frame`, `suitcase` articulada, `memory_tokens` (folha, estrela, flor, pedra, cartão), `rugs`, `lamps`, `plants`. Cada cômodo tem pontos de encaixe nomeados.
### Dinâmica completa
1. Escolher visitar casa ou usar história fictícia; não solicitar identificação nem evento traumático. 2. Escolher cômodo e objeto simbólico. 3. Opcionalmente nomear/desenhar/selecionar palavra para objeto, ou deixá-lo sem conteúdo. 4. Escolher deixar à vista, guardar na gaveta/mala ou omitir; pular sempre. 5. Reorganizar objetos, fechar/abrir gaveta voluntariamente, remover definitivamente objeto ou voltar à casa. 6. Revisar apenas itens que usuário escolhe mostrar, exportar explicitamente ou sair descartando dados. Guardar na gaveta é metáfora visual, não privacidade criptográfica; distinguir guardar durante sessão e persistir localmente.
### Lógica, física e interação
`rooms[]`, `slots[{id,room,visibility,capacity}]`, `tokens[{id,type,room,slot,visibility,optionalLabel,drawing}]`, `draft`, `saveConsent`. Drawer translação por trilho (0–0,3 m), mala dobradiça limitada, objetos snap por slot e trajetória curta; colisores impedem atravessar móveis. Ao guardar, abrir gaveta, mover objeto, fechar opcionalmente; não exibir conteúdo guardado em resumo sem autorização. Omitir descarta rascunho, excluir remove do estado e de persistência se existente. Câmera por hotspot com retorno visível e opção sem movimento. Não incluir compartilhamento automático nem recuperação de textos descartados.
### Critérios específicos
Quatro cômodos navegáveis, cinco tipos de símbolo, pelo menos dois mecanismos físicos; guardar/retirar/mover funciona sem duplicação; pular e apagar não exigem explicar; resumo respeita visibilidade; nenhuma informação sensível salva por padrão.

## Plano original de DNA, jornada e cena — referência de identidade; etapas antigas são substituídas pela sequência 2.0
# 20 · CASA DAS MEMÓRIAS — Plano de execução
Porte **XL** · Onda 4 · adolescentes, adultos e idosos · Expressão simbólica e narrativa

## 1. Tese
**Lembrar é também escolher o que guardar — e o que não mostrar.** A casa dá espaço físico à memória: a pessoa organiza objetos em cômodos, associa histórias e monta uma linha do tempo **sem datas obrigatórias**, com o direito explícito de **omitir**.
- Âncoras: revisão de vida e reminiscência (Butler, 1963); **identidade narrativa** (McAdams, 2001); memória autobiográfica (Conway); o espaço como âncora (método dos *loci*). A evidência de terapias de reminiscência é **modesta e variável** (p.ex. Woods et al., 2018, Cochrane) — por isso o recurso **não promete benefício**.
- **Não afirma:** terapia de luto ou trauma; que lembrar faça bem; interpretação de objetos ou arranjos.
- **Privacidade máxima:** fotos e textos **nunca saem do dispositivo** sem decisão explícita.

## 2. DNA exclusivo
| Campo | Definição |
|---|---|
| Mundo | **Casa-miniatura** em corte (*dollhouse*): sala central, biblioteca à esquerda, ateliê à direita |
| Verbo | **Guardar, omitir, reorganizar** |
| Assinatura técnica | **Cena por cômodo com carregamento sob demanda** + **molduras que recebem fotos locais** + **gaveta de omissões** + **cofre local cifrado** (WebCrypto) |
| Chrome | **Cantoneiras de álbum**, **fitas-marcador**, etiquetas de gaveta |
| Tipografia | Cardo (texto) + Public Sans (interface); **texto ampliável** |
| Luz/grade | Lateral suave, sépia delicada; nogueira clara, creme, verde de plantas |
| Áudio-assinatura | **Silêncio por padrão**; leitura em voz sob pedido |
| Artefato | **A casa organizada** + linha do tempo; exportar só por decisão |
| **Não pode parecer** | Teatro de fantoches (17); galeria de texturas (04); casa da árvore (existente) |

## 3. Jornada
1. Vê a casa em corte (*overview*); **entra** num cômodo (modo livre a 1,5 m) ou fica no corte.
2. **Escolhe objetos** (livro, caixa, álbum, moldura, mala, planta, luminária) e os **coloca** em prateleiras/superfícies (snap).
3. **Associa uma narrativa** a cada objeto (texto, opcional); pode **colocar uma foto local** numa moldura.
4. **Guarda** na gaveta de lembranças, **omite** (gaveta fechada, sem justificativa) ou **reorganiza**.
5. Monta a **linha do tempo** com fitas "antes / depois / ao mesmo tempo", **sem datas**.
6. **Exporta** (ou não), mediante decisão explícita.

## 4. Cena (manifesto)
| ID | Posição | Notas |
|---|---|---|
| `sala_principal` | centro, 7×6 m | sofá bouclé, luminária, álbum aberto (páginas em branco), planta |
| `biblioteca` | X=−6, 5×5 m | **estantes com livros sem títulos**, caixas de lembrança, escrivaninha |
| `atelie_galeria` | X=+6, 5×5 m | **molduras vazias**, objetos em branco, malas |
| `portas_X` | entre cômodos | no eixo X |
| `escada_decorativa` | fundo | |
| `janelas_Z−6` | parede fundo | **paisagem neutra** |
Câmera **overview** FOV 39°, (14,10,17)→(0,1,0); **modo livre** 1,5 m. Materiais: madeira 0,58; papel de bordas finas irregulares; bouclé com normal; couro gasto moderado; vidro seletivo; metal discretamente envelhecido.

## 5. Sistemas
- **Cena por cômodo** (3 *chunks*) com *lazy loading*; apenas o cômodo ativo em qualidade total.
- **Drag-and-drop 3D com snap** em prateleira (slots por prateleira) + alternativa por botões ("Guardar na estante 2").
- **Modelo:** `Objeto { id, tipo, comodo, slot, narrativa?, foto?, estado: guardado|visivel|omitido }`.
- **Linha do tempo:** fitas ordenadas por relação, sem datas.
- **Fotos locais:** carregadas do dispositivo, convertidas em textura e guardadas em IndexedDB; **nunca enviadas**.
- **Cofre cifrado opcional:** senha → PBKDF2 → AES-GCM; **sem recuperação** (avisar). Sincronização com servidor **fora do escopo**; se um dia existir, **só com cifragem no cliente**.
- **Desfazer** em pilha; **exportar** apenas após confirmação em dois passos.

## 6. Interface, bordas e ilustrações
- **Cantoneiras de fotografia** (SVG) nos painéis; **fita-marcador** como indicador de seção.
- **Etiquetas de gaveta** com caligrafia (nunca texto na textura 3D).
- **Ilustrações:** planta baixa da casa em **nanquim** para navegação entre cômodos.
- **Botões grandes**, tipografia **ampliável até 200 %**, alto contraste opcional (idosos).

## 7. Áudio
**Silêncio por padrão**; ambiência leve opcional (relógio distante, folhas); **leitura em voz** dos textos sob pedido.

## 8. Acessibilidade, conforto, ética
- **Omitir sem explicar**; nada é "esquecido por você": a gaveta existe, o app não oferece reabrir de surpresa.
- **Linguagem de convite** ("se quiser, guarde…"); sem lembrete automático de memórias.
- "Ajuda agora" visível; nenhum conteúdo gerado por IA sobre as memórias do usuário.
- Navegação por lista de cômodos e objetos; leitor de tela.

## 9. Etapas
| Etapa | Entrega | Aceite verificável |
|---|---|---|
| **E0** Conteúdo | Convites, vocabulário, textos de privacidade e cofre | **Aprovado por você** |
| **E1** Blocking | 3 cômodos em corte, portas, escada, câmeras | Validador; captura |
| **E2** Hero | Sofá, estantes, álbum, molduras, malas, planta, luminária | GLB; instancing de livros |
| **E3** Luz + assinatura | Luz lateral sépia, molduras com foto local, poeira no feixe | Foto local aparece e **não sai** (teste de rede) |
| **E4** Mecânica | Guardar/omitir/reorganizar, linha do tempo, desfazer, exportar | Vitest: snap/slots; cofre cifra/decifra; **nenhuma requisição de rede** |
| **E5** Interface | Cantoneiras, fitas, planta baixa | Contraste; texto 200 % |
| **E6** Áudio | Ambiência e leitura | Nada toca sozinho |
| **E7** Segurança | Cofre, retenção, sessão anônima, baixo desempenho | axe; 30 fps móvel |
| **E8** Entrega | Capturas, divergências, README | 6 critérios com evidência |

## 10. Riscos
**Perda de senha = perda de dados** (aviso claro) · fotos grandes (redimensionar localmente) · conteúdo emocionalmente pesado (omitir sempre possível; ajuda agora) · escopo de três cenas (carregamento por cômodo).


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
