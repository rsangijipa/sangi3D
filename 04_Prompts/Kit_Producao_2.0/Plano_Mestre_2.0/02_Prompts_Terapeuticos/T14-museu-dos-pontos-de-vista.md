# T14 — Museu dos Pontos de Vista | Produção 2.0

## Instruções para o agente de código
Implemente a experiência completa no repositório real; não entregue só mockup ou plano. Este arquivo reúne a decisão 2.0 e as referências específicas de produção. Leia o código existente, se houver. Se faltar a referência visual, siga a descrição textual e registre a ausência. Não simule testes nem aprovação. Execute em etapas pequenas: baseline → estado/regras → cena e assets → gesto principal → conteúdo/etapas → UI/áudio → persistência → testes → build e integração. Em cada etapa, valide o gesto e o estado antes de decorar. Anexe ao agente o mockup original e, para migração, o HTML/repositório correspondente.

## Escopo específico 2.0 — prevalece sobre versões antigas
- Verbo: ver pelos olhos do outro. Dependência: câmera/oclusão.
- Assets prioritários: vitrines, personagens, divisórias, cartões.
- Mecânica: Câmera por personagem, cone de visão, raycast de oclusão e cartões de informação.
- Aceite específico: Mover divisória altera visibilidade; separar viu/ouviu/não dá para saber.

## Referência original de geometria, arte, materiais e interação (não normativa em conflitos)
# 14. MUSEU DOS PONTOS DE VISTA

Categoria: Habilidades sociais e cotidiano
Público: 8+ e adultos

## REFERÊNCIA VISUAL
Utilizar como imagem-guia a prévia apresentada ao lado do recurso no atlas ou, preferencialmente, o arquivo original anexado. A referência é uma direção visual; coordenadas a seguir são proposta inicial de reconstrução, sujeitas a calibração visual.

## GEOMETRIA E CÂMERA
Ambiente: 14 × 12 × 6 m, museu de quadros e cenas.
Câmera: FOV 39°, câmera (10,7.5,13) mirando (0,1.5,0).
Paleta e iluminação: paredes marfim, madeira nogueira, bronze, veludo cinza e luz de galeria.

## MAPA ESPACIAL DOS OBJETOS
Salão central com vitrine rotativa em (0,0,0), três mini-dioramas em pedestais nos pontos (-4,0,-3),(4,0,-3),(0,0,4); espelhos em paredes laterais. Uma tela de leitura HTML ocupa lateral externa do canvas, sem competir com a cena.

## MESHES E ASSETS QUE DEVEM SER MODELADOS
Vitrine giratória com engrenagens, miniaturas de situações sociais, molduras vazadas, janelas de observação, móveis de cenário, três personagens por diorama com linha de visão representável sem afirmar mente.

## MATERIAIS, TEXTURAS E ACABAMENTOS
Base de pedra; moldura bronze metalness 0,8; espelhos por environment reflection pré-renderizada para reduzir custo; painéis madeira; personagens em material cloth.

## INTERAÇÕES, REGRAS E FEEDBACK
Alternar câmeras de diferentes pessoas, revelar campo de visão geométrico, separar o que foi visto do que foi contado, comparar relatos, testar hipóteses e reconhecer informação desconhecida. Não definir uma interpretação universal.

## ÁUDIO
Voz narrativa opcional e sons contextuais específicos por diorama, botão para desativar.

## TECNOLOGIA E SISTEMAS ESPECÍFICOS
Three.js múltiplas PerspectiveCamera, layers e oclusão por raycast, FSM narrativo, snapshots das escolhas e análise descritiva.

## PROMPT INDIVIDUAL PARA GOOGLE NANO BANANA
Museu de perspectivas 3D fotorrealista e elegante, sala marfim com piso de madeira, vitrine rotativa central em vidro e bronze, três pedestais contendo pequenas cenas sociais, molduras e espelhos arquitetônicos nas laterais, luz direcionada de galeria e sombras suaves, composição três-quartos, sem texto, 16:9.

## CRITÉRIOS DE ACEITAÇÃO
1. Cena realmente tridimensional, não apenas fundo estático em 2D; câmera, peças e volumes coerentes com a referência.
2. Cada objeto principal possui ID, posição, rotação, escala, material e função no manifesto da cena.
3. Interface completa em português com navegação por teclado/toque; áudio opcional e controle de intensidade.
4. Ações executadas têm efeito visual e lógico verificável; estado pode ser reiniciado e salvo quando apropriado.
5. Captura lado a lado (referência vs implementação), ajuste da câmera e relatório de divergências.
6. Modo baixo desempenho, sem efeitos que provoquem estímulos inesperados; sem resultados diagnósticos automáticos.

---

## Dinâmica ampliada do kit de 17 jogos (prioridade de conteúdo após decisão 2.0)
**Projeto 13/17** | Anexe `mockup.png`.

Implemente o jogo completo descrito abaixo usando o mockup como alvo visual. Os requisitos específicos têm prioridade em caso de adaptação de layout; mantenha o contrato técnico comum.

### Conceito e objetivo
Vitrines interativas para explorar o que cada personagem consegue ver, ouviu contar ou não tem como saber, distinguindo fatos observáveis de inferências. Não presumir pensamentos nem avaliar empatia. Sessão 5–12 min.
### Cena, câmera e assets
Galeria com paredes verde-petróleo, arcos creme, pendentes metálicos quentes, placa de feltro/papel, vitrine de vidro sobre base de madeira. Três bonecos de feltro/wood: mostarda à esquerda, terracota ao fundo e verde à direita; mesa com caixa e divisória de madeira móvel. Cone visual translúcido indica campo de visão do personagem selecionado, bloqueado pela divisória. HUD “O que cada um viu?”, cartões “Viu”, “Ouviu contar”, “Não dá para saber”, “Ver outra pessoa”, “Mover divisória”. Câmera externa ortográfica/perspectiva leve; visão do personagem em modo explícito; mobile preserva vitrine e painel. Assets `gallery`, `display_case`, `table`, `box`, `divider` deslizante, `character_set`, `eye_anchor`, `view_cone`, `objects_set` (bola, livro, caixa, brinquedo), `wall_art`, `lamp`, `plant`. Vidro simplificado sem impedir picking; cone com oclusão aproximada pela barreira.
### Dinâmica completa
1. Demonstrar dois personagens com posições distintas. 2. Escolher personagem, ver pela câmera dele e marcar se viu objeto. 3. Mover divisória, comparar oclusão antes/depois e mudar posição da caixa. 4. Ativar evento explícito “contar sobre a caixa” para um personagem; distinguir informação ouvida de visual. 5. Resolver 6 vitrines com variantes de posição, barreira, observador ausente e relato; permitir “não dá para saber” quando evidência não existe. 6. Revisar evidências e criar vitrine livre. Perguntas distinguem “viu agora”, “viu antes”, “ouviu contar” e “o que sabe não dá para concluir”.
### Lógica, física e interação
Cada personagem tem eyeAnchor, direção, FOV e posição; `visibleNow` testa distância, ângulo e raycast entre olho e pontos-alvo do objeto contra divisória/mesa; amostrar centro e cantos, regra de visibilidade explícita (ao menos um ponto relevante dentro do FOV sem oclusão). `seenEvents` persiste se objeto muda; `heardEvents` apenas em evento narrado ao personagem. Não usar ausência de visão atual como prova de desconhecimento. Divisória arrasta em trilho limitado, snap e collider atualizados antes de avaliar; mover câmera não altera perspectiva lógica. Cone cortado no primeiro obstáculo por malha/linhas discretas. `sceneId`, `selectedPerson`, `objects`, `dividerPos`, `events`, `answers[]`; explicar com replay de evidência, não inferir estados mentais.
### Critérios específicos
Barreira oculta caixa conforme raycast; mudar divisória atualiza cone e resposta; personagem que ouviu não é marcado como viu; histórico distingue antes/agora; 6 vitrines com respostas verificáveis e evidência; texto admite incerteza quando necessário.

## Plano original de DNA, jornada e cena — referência de identidade; etapas antigas são substituídas pela sequência 2.0
# 14 · MUSEU DOS PONTOS DE VISTA — Plano de execução
Porte **L** · Onda 3 · 8+ e adultos · Habilidades sociais e cotidiano

## 1. Tese
**O que alguém vê, o que lhe contaram e o que ele não tem como saber são coisas diferentes — e dá para olhar isso com geometria.** O museu mostra o *campo de visão* de cada personagem numa cena em miniatura e separa **viu · ouviu contar · não dá para saber**.
- Âncoras: tomada de perspectiva visual níveis 1–2 (Flavell et al., 1981); tarefa das **três montanhas** (Piaget & Inhelder, 1948); "ver leva a saber" (Pratt & Bryant, 1990); estados epistêmicos; a lógica da falsa crença (Wimmer & Perner, 1983) como inspiração de cenário.
- **Não afirma:** avaliação de teoria da mente; que linha de visão = o que a pessoa pensa. A visão é **geometria**; interpretar é do usuário.
- **Não define uma interpretação universal.**

## 2. DNA exclusivo
| Campo | Definição |
|---|---|
| Mundo | **Museu de dioramas** marfim e nogueira, luz de galeria |
| Verbo | **Ver pelos olhos de outra pessoa** |
| Assinatura técnica | **Câmera por personagem** (visão em quadro dentro do quadro) + **cone de visão** com oclusão por *raycast* + **vitrine rotativa** com engrenagens + **espelhos por reflexão pré-renderizada** |
| Chrome | **Molduras douradas/bronze**, plaquetas de museu, **audioguia** como controle |
| Tipografia | Bodoni Moda (títulos) + Libre Franklin (leitura) |
| Luz/grade | Galeria direcional, sombras suaves; marfim, nogueira, bronze, veludo cinza |
| Áudio-assinatura | Narração opcional + som contextual de **cada diorama** |
| Artefato | "Livro de observações" (viu/ouviu/não sabe + hipóteses) |
| **Não pode parecer** | Galeria de texturas (04); cidade (13); palco (15) |

## 3. Jornada
1. No salão, a **vitrine rotativa** apresenta os três dioramas; escolhe um pedestal.
2. **Alterna entre as câmeras** das três pessoas do diorama; vê a cena do ponto de vista de cada uma.
3. **Revela o cone de visão** (geometria) e vê o que fica fora dele.
4. **Arrasta cartões de fatos** para as colunas **viu · ouviu contar · não dá para saber**.
5. **Testa hipóteses** movendo uma peça (uma divisória, uma caixa) e vendo o que muda; **compara relatos** que divergem e reconhece **informação desconhecida**.

## 4. Cena (manifesto)
| ID | Posição | Notas |
|---|---|---|
| `vitrine_rotativa` | (0,0,0) | vidro e bronze; **engrenagens** visíveis |
| `diorama_A` | (−4,0,−3) | "Duas cadeiras e uma divisória" (visão) |
| `diorama_B` | (4,0,−3) | "Quem viu e quem soube" (viu × ouviu contar) |
| `diorama_C` | (0,0,4) | "A caixa fechada" (informação desconhecida) |
| `espelhos_L/R` | paredes laterais | **cube probes** estáticos |
| `molduras_vazadas`, `janelas_observacao` | paredes | |
| `personagens` | 3 por diorama | material tecido; **linha de visão** representável |
**Tela de leitura** em HTML fora do canvas. Câmera FOV 39°, (10,7.5,13)→(0,1.5,0).

## 5. Sistemas
- **Múltiplas `PerspectiveCamera`**; *picture-in-picture* por *render target* pequeno (256²), **atualizado só sob demanda**.
- **Cone de visão:** frustum limitado em ângulo + **raycast de oclusão**; objetos fora/ocultos recebem sombreamento "não visto".
- **FSM narrativa** por diorama; **cartões de fatos** com tipos de evidência ("vi", "me contaram", "não sei").
- **Snapshots** de escolhas + **análise descritiva** ("você colocou 3 fatos em *viu*, 1 em *não sei*") — sem avaliação.
- **Espelhos:** *CubeCamera* renderizada uma vez por diorama.

## 6. Interface, bordas e ilustrações
- **Moldura dourada** (SVG, relevo) em torno da tela de leitura; **plaquetas** com número de sala.
- **Audioguia:** botão redondo e display "analógico" em DOM (sem texto embutido em textura).
- Ilustração de **olho/cone** em linhas finas; diagramas "vista de cima" do campo de visão.
- Livro de observações com **colunas** pintadas à mão.

## 7. Áudio
Narração opcional em voz sintetizada local, **sons contextuais por diorama** (conversa abafada, objetos), botão para desativar; legendas.

## 8. Acessibilidade, conforto, ética
- Cada câmera tem **botão e teclado**; descrição textual do que cada pessoa vê.
- Linguagem de **hipótese**: "pode ser que…"; nunca "ele sabe".
- Sem escores; sem "resposta certa"; **"não dá para saber"** é resposta legítima.
- Crianças 8+: poucos fatos por vez; adulto edita cartões.

## 9. Etapas
| Etapa | Entrega | Aceite verificável |
|---|---|---|
| **E0** Conteúdo | 3 cenários, cartões de fatos, textos neutros | Aprovado |
| **E1** Blocking | Salão, vitrine, 3 pedestais, câmera | Validador; captura |
| **E2** Hero | Vitrine com engrenagens, 3 dioramas, personagens, molduras | GLB; orçamento |
| **E3** Luz + assinatura | Luz de galeria, PiP, **cone de visão** | Cone **bloqueado** por divisória (teste de oclusão) |
| **E4** Mecânica | Câmeras, cartões, hipóteses, relatos | Vitest: classificação de fatos; visibilidade geométrica |
| **E5** Interface | Molduras, audioguia, livro | Contraste; teclado |
| **E6** Áudio | Narração + contextual | Pico ≤ teto |
| **E7** Segurança | Render sob demanda, retenção, baixo desempenho (sem PiP) | axe; 30 fps móvel |
| **E8** Entrega | Capturas, divergências, README | 6 critérios com evidência |

## 10. Riscos
Custo de PiP (resolução baixa + sob demanda) · tentação de "tirar conclusão" sobre a mente → texto revisado · conteúdo de falsa crença muito "escolar" (variar cenários).


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
