# E04 — Cartografia do Corpo Sentido | Evolução 2.0

## Instruções para o agente de código
Implemente a experiência completa no repositório real; não entregue só mockup ou plano. Este arquivo reúne a decisão 2.0 e as referências específicas de produção. Leia o código existente, se houver. Se faltar a referência visual, siga a descrição textual e registre a ausência. Não simule testes nem aprovação. Execute em etapas pequenas: baseline → estado/regras → cena e assets → gesto principal → conteúdo/etapas → UI/áudio → persistência → testes → build e integração. Em cada etapa, valide o gesto e o estado antes de decorar. Anexe ao agente o mockup original e, para migração, o HTML/repositório correspondente.

## Baseline e escopo
- Fonte: `ambientes-html.7z/ambientes-html/cartografia-do-corpo-sentido.html` (41,037 bytes; SHA-256 `5943a26f9849e5b20c09804802ac4cfc4f05eb55df9369fe54102688d0affbad`).
- IDs de controles encontrados (amostra para regressão, não prova de funcionamento): `btn-sound-toggle`, `btn-apply-sensation`, `cam-avatar`, `cam-chest`, `cam-head`, `cam-room`, `btn-singing-bowl`, `btn-clear-map`, `btn-drawer-toggle`, `btn-close-drawer`, `btn-save-note`.
- Estado: código existente, execução não validada nesta entrega. Prioridade: migração.
- Identidade: preservar paleta e composição existentes, reconstruir close-ups usando materiais próprios; verbo central **localizar e nomear**.
- Assets prioritários: silhueta estilizada, anel de sensações, marcadores, plataforma.
- Evolução mecânica e funcional: Integrar Bússola do Corpo como modo observatório; regiões selecionáveis, intensidade autodeclarada, camadas, comparação opcional sem inferência.
- Migração: mapear handlers, estado e armazenamento atuais; escrever testes de caracterização; migrar gesto principal sem remover opções existentes; preservar/exportar dados anteriores com migração versionada e opção de rollback; não migrar automaticamente conteúdo sensível para outra finalidade.
- Aceite específico: Aplicar duas sensações em regiões distintas, comparar momentos, apagar registros, testar alternativa DOM.
- Entregar captura antes/depois em três enquadramentos, registro de regressões e justificativa das mudanças. 

# Modo integrado T09 — Bússola do Corpo
Preserve identidade visual própria deste modo; não substitua o ambiente antigo sem aprovação.
## Escopo específico 2.0 — prevalece sobre versões antigas
- Verbo: sentir e nomear. Dependência: dados/seleção.
- Assets prioritários: silhueta fosca, ícones, partículas, dimmer.
- Mecânica: Integrar ao E04; modo observatório com mapa de regiões e intensidade opcional.
- Aceite específico: Sobreposição de dois momentos, texto livre e exclusão voluntária.

## Referência original de geometria, arte, materiais e interação (não normativa em conflitos)
# 09. BÚSSOLA DO CORPO

Categoria: Emoções e autorregulação
Público: 6+ e adultos

## REFERÊNCIA VISUAL
Utilizar como imagem-guia a prévia apresentada ao lado do recurso no atlas ou, preferencialmente, o arquivo original anexado. A referência é uma direção visual; coordenadas a seguir são proposta inicial de reconstrução, sujeitas a calibração visual.

## GEOMETRIA E CÂMERA
Ambiente: 9 × 9 × 6 m, observatório corporal circular.
Câmera: FOV 37°, câmera (6,4.5,10) mirando (0,2.2,0).
Paleta e iluminação: marfim, areia, azul lavanda discreto, luz quente neutra.

## MAPA ESPACIAL DOS OBJETOS
Plataforma circular de raio 3,5 m em (0,0,0). Silhueta humana neutra, sem marcadores de gênero, ocupa centro (0,0,0) e mede 2,8 m de altura. Anel de oito ícones flutuantes forma raio 3,2 m a Y=1,2. Dois painéis informativos em semicírculo ficam atrás, sem obstruir a figura.

## MESHES E ASSETS QUE DEVEM SER MODELADOS
Silhueta translúcida e rotacionável segmentada em cabeça, tronco, braços, mãos, pernas e pés; marcadores de sensação reconfiguráveis; partículas lentas opcionais; pedestal circular; mapa de legenda HTML externo.

## MATERIAIS, TEXTURAS E ACABAMENTOS
Silhueta não anatômica em material translúcido roughness 0,4, transmission moderada; plataforma de calcário roughness 0,85; marcadores emissivos suaves, sem flashes; grãos de luz opcionais.

## INTERAÇÕES, REGRAS E FEEDBACK
Escolher região, sensação e intensidade autorrelatada, anotar palavras próprias, indicar conforto/desconforto/sem sensação, comparar dois momentos com transparência; opção sem silhueta humana usando mapa abstrato; nenhuma interpretação automática.

## ÁUDIO
Paisagem ambiente opcional e silenciosa por padrão; leitura em voz sob demanda.

## TECNOLOGIA E SISTEMAS ESPECÍFICOS
Three.js picking por malha segmentada, projeção de marcadores em UV ou world coords, persistência com controle de privacidade, acessibilidade por lista de regiões.

## PROMPT INDIVIDUAL PARA GOOGLE NANO BANANA
Observatório corporal meditativo 3D realista, plataforma circular de pedra em sala acolhedora de luz difusa, figura humana neutra estilizada de vidro fosco no centro, pequenos marcadores luminosos suaves nas regiões, anel discreto de elementos abstratos ao redor, composição limpa, sem anatomia médica realista, sem textos, sem logos, 16:9.

## CRITÉRIOS DE ACEITAÇÃO
1. Cena realmente tridimensional, não apenas fundo estático em 2D; câmera, peças e volumes coerentes com a referência.
2. Cada objeto principal possui ID, posição, rotação, escala, material e função no manifesto da cena.
3. Interface completa em português com navegação por teclado/toque; áudio opcional e controle de intensidade.
4. Ações executadas têm efeito visual e lógico verificável; estado pode ser reiniciado e salvo quando apropriado.
5. Captura lado a lado (referência vs implementação), ajuste da câmera e relatório de divergências.
6. Modo baixo desempenho, sem efeitos que provoquem estímulos inesperados; sem resultados diagnósticos automáticos.

---

## Dinâmica ampliada do kit de 17 jogos (prioridade de conteúdo após decisão 2.0)
**Projeto 11/17** | Anexe `mockup.png`.

Implemente o jogo completo descrito abaixo usando o mockup como alvo visual. Os requisitos específicos têm prioridade em caso de adaptação de layout; mantenha o contrato técnico comum.

### Conceito e objetivo
Mapa corporal voluntário para localizar sensações e descrevê-las com símbolos ou palavras. Apoiar comunicação interoceptiva sem interpretar sintomas, atribuir emoções ou dar diagnóstico. Sessão 3–10 min e saída livre.
### Cena, câmera e assets
Observatório noturno circular com céu estrelado, vigas de madeira, estante com livros, luminária lunar, telescópio de latão, tapete circular de juta e puff musgo. No centro, silhueta humana 3D neutra, sem nudez anatômica detalhada, material translúcido fosco, braços ligeiramente abertos, região selecionada iluminada em âmbar. Oito símbolos circulares em órbita fina: calor, frio, peso, leveza, ondas, pontadas, formigamento e expansão/energia (nomes propostos, permitir significado próprio). Painel “Que sensação?”, “Usar minha palavra”, “Registrar”, “Pular”, etapa 3/5. Câmera frontal ~40°, círculo inteiro à esquerda; mobile mantém corpo da cabeça aos pés e anel de ícones com áreas tocáveis. Assets `observatory`, `body_neutral` com regiões nomeadas, `region_proxy` cabeça, pescoço, tórax, abdômen, costas, braços, mãos, pernas, pés; `orbital_ring`, `sensation_tokens`×8, `rug`, `telescope`, `moon_lamp`, `star_lamp`, `shelf`, `plant`, `pouf`. Alternar frente/costas sem exigir orbit manual.
### Dinâmica completa
1. Escolher observar corpo, usar mapa fictício ou pular. 2. Selecionar uma ou várias regiões por toque ou lista; permitir “não sei onde”. 3. Escolher sensação no anel, usar palavra própria ou nenhuma; mostrar rótulo acessível, possibilidade múltipla. 4. Indicar intensidade opcional em escala de 0–4 ou “não sei”, adicionar outro ponto ou remover. 5. Rever mapa e escolher apagar, registrar explicitamente ou sair sem salvar. Modo acompanhado permite oferecer vocabulário, nunca exigir relato ou induzir localização. Modo livre com corpo fictício para ensaio.
### Lógica, física e interação
Raycast usa proxies corporais não sobrepostos e IDs anatômicos neutros; seleção por lista equivalente. Highlight em material emissivo local ou máscara sobre mesh, fade 200 ms e sem brilho forte; não alterar forma corporal. Tokens orbitais estáticos por padrão, seleção com borda e texto; toque não deve girar cena. `entries[{regionIds,sensationIds,customWord,intensity}]`, `draft`, `bodyView`, `fictionalMode`, `saveConsent`; registrar consolida rascunho, edição reabre, pular descarta apenas etapa atual com aviso se houver conteúdo. Texto sensível fica em memória e não vai para logs; exportar opcional com aviso. Sem áudio obrigatório; narração local opcional sem ler termos pessoais em voz alta automaticamente.
### Critérios específicos
Seleção de antebraço no mockup destaca região correspondente; lado esquerdo/direito explicado na perspectiva da figura; múltiplos pontos editáveis; pular, sair e apagar funcionam; nenhuma mensagem converte sensação em diagnóstico; mobile mantém todos os ícones acessíveis via lista se necessário.

## Plano original de DNA, jornada e cena — referência de identidade; etapas antigas são substituídas pela sequência 2.0
# 09 · BÚSSOLA DO CORPO — Plano de execução
Porte **M** · Onda 2 · 6+ e adultos · Emoções e autorregulação

## 1. Tese
**Sensações corporais ganham vocabulário quando são nomeadas, localizadas e dosadas por quem as sente.** A pessoa escolhe uma região, uma sensação, uma intensidade e as próprias palavras — sem que o app diga o que significa.
- Âncoras: interocepção (Craig, 2002); *focusing* e "sentido sentido" (Gendlin, 1978) e *continuum de consciência* (Gestalt) como forma de convite; mapas corporais de emoção (Nummenmaa et al., 2014) **apenas como inspiração do formato — nenhum mapeamento pré-definido é usado**.
- **Não afirma:** que determinada sensação "é" determinada emoção; nenhuma interpretação automática; nenhuma norma de intensidade.
- **Cuidado central:** atenção ao corpo pode ser aversiva para algumas pessoas (p.ex. histórias de trauma). Por isso o recurso nasce com **saídas explícitas** (ver §8).

## 2. DNA exclusivo
| Campo | Definição |
|---|---|
| Mundo | **Observatório corporal circular**: plataforma de calcário, sala acolhedora de luz difusa |
| Verbo | **Sentir e nomear** a região |
| Assinatura técnica | **Corpo de vidro fosco** (transmissão moderada + fresnel suave) + **partículas-sensação** cujo movimento é escolhido pelo usuário + **camada-fantasma** para comparar dois momentos |
| Chrome | **Anel finíssimo**, quase sem moldura; sem cartões pesados; lavanda discreta |
| Tipografia | Albert Sans leve + Newsreader itálico (palavras do usuário) |
| Luz/grade | Quente neutra, marfim/areia, lavanda mínima |
| Áudio | Ambiente opcional, **silêncio por padrão**; leitura sob demanda |
| Artefato | "Momento" (mapa de sensações salvo) + comparação de dois momentos |
| **Não pode parecer** | Anatomia médica; escaner de saúde; painel clínico |

## 3. Jornada
1. Chega à sala em silêncio; a silhueta **neutra e sem marcadores de gênero** gira devagar (ou fica parada).
2. Escolhe uma **região** (toque na silhueta ou lista).
3. Escolhe uma sensação do **anel de oito ícones** — *pressão · formigamento · calor · frescor · aperto · leveza · pulsação · vazio* — ou digita **outra palavra**.
4. Ajusta a **intensidade** num *dimmer* (0–10, sem "bom/ruim") e marca *confortável · desconfortável · sem sensação*.
5. Compara **dois momentos** (camada transparente) e salva.

## 4. Cena (manifesto)
| ID | Posição | Notas |
|---|---|---|
| `plataforma` | (0,0,0) r=3,5 | calcário 0,85 |
| `silhueta` | (0,0,0) h=2,8 | **monumental e não anatômica**; segmentos: cabeça, tronco, braços, mãos, pernas, pés; roughness 0,4 |
| `anel_icones` | r=3,2, y=1,2 | oito ícones flutuantes (um por sensação) |
| `paineis_semicirculo` | atrás | informativos; **sem obstruir** a figura |
| `marcadores` | sobre a silhueta | emissivos suaves, **sem flashes** |
Câmera FOV 37°, (6,4.5,10)→(0,2.2,0). **Mapa abstrato** alternativo (campo de formas concêntricas) sem figura humana.

## 5. Sistemas
- **Picking por malha segmentada**; marcador projetado em coordenada de mundo/UV.
- **Partículas-sensação:** 8 "movimentos" (pulso, vibração, fluxo, ponto fixo, nó, brisa, ondulação, vazio) escolhidos por ícone; velocidade ligada à intensidade — **e o usuário vê e muda o mapeamento**.
- **Comparação:** dois *snapshots* sobrepostos em transparência ajustável.
- **Persistência com privacidade:** `momentos.json`; retenção escolhida; apagar tudo.
- **Acessibilidade:** lista de regiões com `aria` ("mão direita — formigamento, intensidade 3").

## 6. Interface, bordas e ilustrações
- **Anel de ícones** feitos como **linhas únicas** (um traço contínuo por sensação), sem preenchimento.
- Moldura: um **círculo hairline** em torno do painel, sem sombra pesada; cores sempre com texto.
- Mapa abstrato como **ilustração generativa** (formas concêntricas) em vez de corpo.
- Textos de convite curtos, em **tom de experimento** ("Se quiser, repare no que acontece na sua mão").

## 7. Áudio
Silêncio por padrão; ambiente (ar leve) opcional; **leitura em voz** dos convites sob demanda, com velocidade ajustável.

## 8. Acessibilidade, conforto, ética (centrais aqui)
- **Saídas sempre visíveis:** *Pular esta região* · *Prefiro não olhar para o corpo agora* (troca para o **mapa abstrato**) · *Olhar para o ambiente* (a câmera se afasta para a sala) · *Sair*.
- Nunca usa o termo "corpo errado", "tensão ruim", "emoção".
- Sem comparação com normas; sem "resumo emocional".
- Crianças 6+: vocabulário simples e ícones; adulto vê o registro.

## 9. Etapas
| Etapa | Entrega | Aceite verificável |
|---|---|---|
| **E0** Conteúdo | Convites, 8 sensações, vocabulário, saídas | Aprovado por você (prioridade) |
| **E1** Blocking | Plataforma, silhueta segmentada, anel | Validador; captura |
| **E2** Hero | Silhueta de vidro segmentada, 8 ícones, painéis | Segmentos pickáveis; GLB; estados idle/hover/selected/active |
| **E3** Luz + assinatura | Vidro fosco, partículas-sensação, camada-fantasma | Fantasma e atual distinguíveis |
| **E4** Mecânica | Região→sensação→intensidade→palavras→conforto; comparar | Vitest: persistência; selecionar via lista = via 3D |
| **E5** Interface | Anel, círculo hairline, mapa abstrato | Contraste; teclado |
| **E6** Áudio | Ambiente + leitura | Nada toca sozinho |
| **E7** Segurança | Saídas, retenção, anônimo, render sob demanda | axe; 30 fps móvel |
| **E8** Entrega | Capturas, divergências, README | 6 critérios com evidência |

## 10. Riscos
Material translúcido caro (tier: opaco fosco) · figura humana pode incomodar → mapa abstrato desde o início · interpretação de cor/intensidade pelo usuário final (deixar explícito que **é dele**).


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
