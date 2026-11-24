# T10 — Meteorologia das Emoções | Produção 2.0

## Instruções para o agente de código
Implemente a experiência completa no repositório real; não entregue só mockup ou plano. Este arquivo reúne a decisão 2.0 e as referências específicas de produção. Leia o código existente, se houver. Se faltar a referência visual, siga a descrição textual e registre a ausência. Não simule testes nem aprovação. Execute em etapas pequenas: baseline → estado/regras → cena e assets → gesto principal → conteúdo/etapas → UI/áudio → persistência → testes → build e integração. Em cada etapa, valide o gesto e o estado antes de decorar. Anexe ao agente o mockup original e, para migração, o HTML/repositório correspondente.

## Escopo específico 2.0 — prevalece sobre versões antigas
- Verbo: compor clima. Dependência: efeitos.
- Assets prioritários: cúpula, dials cobre, céu, nuvens, chuva.
- Mecânica: Interpolar sol, nuvens, vento e chuva independentemente; boletim sem classificação.
- Aceite específico: Combinar sol, chuva e noite; reduzir movimento; salvar boletim opcional.

## Referência original de geometria, arte, materiais e interação (não normativa em conflitos)
# 10. METEOROLOGIA DAS EMOÇÕES

Categoria: Emoções e autorregulação
Público: 4+ e adultos

## REFERÊNCIA VISUAL
Utilizar como imagem-guia a prévia apresentada ao lado do recurso no atlas ou, preferencialmente, o arquivo original anexado. A referência é uma direção visual; coordenadas a seguir são proposta inicial de reconstrução, sujeitas a calibração visual.

## GEOMETRIA E CÂMERA
Ambiente: 14 × 10 × 8 m, estufa poética sob cúpula.
Câmera: FOV 40°, câmera (10,7,13) mirando (0,2,0).
Paleta e iluminação: vidro claro, cobre, areia, azul e cinza de nuvens, verde natural.

## MAPA ESPACIAL DOS OBJETOS
Jardim circular de raio 5 m sob estufa de vidro. Cúpula em (0,0,0) com topo Y=7,5; ilha central de grama e riacho em (0,0,0). Quatro colunas climáticas nos quadrantes X/Z ±3 guardam controles de sol, nuvem, chuva e vento. Banco em (-3,0,1), pequena árvore em (2,0,-2).

## MESHES E ASSETS QUE DEVEM SER MODELADOS
Cúpula com varetas de cobre, nuvens volumétricas low-poly suavizadas, gotas de chuva controladas, sol difuso representado por disco no céu, plumas de vento, pequenas plantas, caminhos de pedra e cartões de metáforas.

## MATERIAIS, TEXTURAS E ACABAMENTOS
Vidro com reflexos seletivos, metal de cobre, folhas translucência simulada; partículas translúcidas pequenas para chuva; nuvens shader dithered/volumetria falsa de baixa carga, evitando nuvens densas caras.

## INTERAÇÕES, REGRAS E FEEDBACK
Escolher combinações de clima como metáfora do estado atual, graduar cada componente, narrar o motivo, registrar mudanças, reconstruir versões anteriores, criar clima impossível sem erro; sem mapear emoções de forma fixa.

## ÁUDIO
Vento, chuva e folhas com controles de ganho separados, sem trovoadas ou picos inesperados.

## TECNOLOGIA E SISTEMAS ESPECÍFICOS
Three.js; shader procedimental leve para céu e nuvem; partículas instanciadas; animação climática com transições suaves e opção reduzir movimento.

## PROMPT INDIVIDUAL PARA GOOGLE NANO BANANA
Estufa de vidro geodésica realista com jardim circular, pequena árvore e banco, teto alto com nuvens suaves, chuva delicada, raios solares difusos e vento simbolizado por folhas; quatro pedestais ao redor, materiais vidro-cobre-pedra, atmosfera poética, alta qualidade PBR, sem relâmpagos, sem texto, 16:9.

## CRITÉRIOS DE ACEITAÇÃO
1. Cena realmente tridimensional, não apenas fundo estático em 2D; câmera, peças e volumes coerentes com a referência.
2. Cada objeto principal possui ID, posição, rotação, escala, material e função no manifesto da cena.
3. Interface completa em português com navegação por teclado/toque; áudio opcional e controle de intensidade.
4. Ações executadas têm efeito visual e lógico verificável; estado pode ser reiniciado e salvo quando apropriado.
5. Captura lado a lado (referência vs implementação), ajuste da câmera e relatório de divergências.
6. Modo baixo desempenho, sem efeitos que provoquem estímulos inesperados; sem resultados diagnósticos automáticos.

---

## Dinâmica ampliada do kit de 17 jogos (prioridade de conteúdo após decisão 2.0)
**Projeto 08/17** | Anexe `mockup.png`.

Implemente o jogo completo descrito abaixo usando o mockup como alvo visual. Os requisitos específicos têm prioridade em caso de adaptação de layout; mantenha o contrato técnico comum.

### Conceito e objetivo
Compor um clima simbólico para representar experiências emocionais mistas. Quatro controles independentes de sol, nuvens, chuva e vento, sem mapeamento obrigatório de clima para emoção; escrever boletim opcional. Sessão 5–10 min.
### Cena, câmera e assets
Observatório circular envidraçado com vigas curvas, estante, telescópio de latão, esfera armilar central e globo, janela com céu dividido entre chuva e pôr do sol. Console madeira/feltro com quatro manômetros circulares latão e ponteiros; duplicatas acessíveis no painel “Compor o clima”, “Escrever boletim”, “Recomeçar”. Câmera 40° com mesa no primeiro plano, céu e instrumentos ao fundo; mobile prioriza céu e painel com dials 2×2. Assets `dome_frame`, `window_glass`, `armillary`, `telescope`, `globe`, `console`, `dial_sun/cloud/rain/wind`, `pointer`, `cloud_layers`, `rain_particles`, `wind_foliage`, `sky_gradient`, `desk_props`. Chuva fica do lado externo do vidro, sem relâmpagos ou trovões.
### Dinâmica completa
1. Escolher começar com céu neutro ou preset. 2. Ajustar sol e nuvens separadamente. 3. Acrescentar chuva e vento em intensidades de 0 a 4; observar mistura, não tornar um controle exclusivo do outro. 4. Criar clima pessoal e, se desejar, associar palavras como “animado”, “cansado”, “confuso”, “outro” ou nenhuma. 5. “Escrever boletim” abre editor opcional com frases iniciais “Hoje meu clima está...”; permitir desenho por ícones e deixar em branco. 6. Revisar composição ou comparar duas versões, guardar somente por escolha, recomeçar com confirmação. Modo acompanhado pode oferecer perguntas abertas sem exigir relato íntimo.
### Lógica, física e interação
Cada dial tem 5 posições com snap e ponteiro em arco ±110°, arraste angular com zona morta e botões ±. `weather{sun,cloud,rain,wind}`, `emotionTags`, `bulletin`, `snapshots[]`. Sol controla iluminação quente/posição simbólica; nuvens alteram opacidade em camadas; chuva controla partículas exteriores e gotas estáticas/animadas no vidro; vento move folhas suavemente e inclina chuva; combinar sem condições meteorológicas rígidas (metáfora). Interpolar mudanças 0,8–1,5 s, limite partículas 200–600 mobile, modo reduzido usa imagens de camadas estáticas. Áudio chuva/vento só ativado manualmente e mute independente. Reset limpa composição e texto após consentimento.
### Critérios específicos
Quatro dials independentes e sincronizados com HUD; sol+chuva coexistem; sem flashes nem exigência de emoções; boletim aceita vazio e pode ser apagado/exportado explicitamente; cenário muda visivelmente e permanece legível no mobile.

## Plano original de DNA, jornada e cena — referência de identidade; etapas antigas são substituídas pela sequência 2.0
# 10 · METEOROLOGIA DAS EMOÇÕES — Plano de execução
Porte **L** · Onda 2 · 4+ e adultos · Emoções e autorregulação

## 1. Tese
**Dar nome e forma ao estado de agora ajuda a olhar para ele de fora.** A pessoa compõe um clima (sol, nuvem, chuva, vento) como metáfora — e pode criar um clima *impossível*, porque a metáfora é dela.
- Âncoras: **rotulagem de afeto** (Lieberman et al., 2007); granularidade emocional (Barrett); externalização (White & Epston, 1990); a metáfora ACT do **céu e do tempo** ("eu sou o céu; pensamentos e emoções são o clima", Hayes e col.).
- **Não afirma:** que chuva = tristeza, sol = alegria, vento = ansiedade. Nenhum mapeamento fixo; **sem leitura automática**.
- **Diferença do Jardim dos Ciclos:** lá é botânica; aqui o **clima é o espetáculo** e a estufa é só o mirante.

## 2. DNA exclusivo
| Campo | Definição |
|---|---|
| Mundo | **Estufa geodésica de vidro e cobre** como observatório de clima |
| Verbo | **Compor o clima** |
| Assinatura técnica | **Céu, nuvem, chuva e vento paramétricos** (shader de nuvem *dithered* + partículas instanciadas + **raios de luz volumétricos** falsos) interpolados suavemente |
| Chrome | **Instrumentos de cobre** (mostradores) e **prancha botânica** científica |
| Tipografia | Crimson Pro + Overpass Mono |
| Luz/grade | **Dirigida pelo clima** (azul/cinza das nuvens ↔ ouro do sol); vidro e cobre |
| Áudio-assinatura | Vento, chuva e folhas em **canais separados**; **sem trovoada** |
| Artefato | "Boletim" (clima + narração do motivo) e "diário do tempo" |
| **Não pode parecer** | Jardim dos Ciclos; Santuário; Casa da Árvore |

## 3. Jornada
1. Entra na estufa com **céu neutro**. Quatro colunas de cobre ao redor (sol, nuvem, chuva, vento).
2. Gira o **dial** de cada coluna (nada → um pouco → bastante); o céu responde em 2–4 s.
3. **Narra o motivo** ("hoje parece…") por texto ou áudio local opcional.
4. **Registra** o boletim; mais tarde, **reconstrói** um boletim anterior ou compara.
5. Pode fazer clima **impossível** (chuva sem nuvem, sol à noite) **sem aviso de erro**.

## 4. Cena (manifesto)
| ID | Posição | Notas |
|---|---|---|
| `cupula` | (0,0,0) topo y=7,5 | **varetas de cobre** em geodésica, vidro com reflexos seletivos |
| `jardim_circular` | r=5 | piso de pedra e grama |
| `ilha_riacho` | (0,0,0) | grama + riacho |
| `coluna_sol`, `coluna_nuvem`, `coluna_chuva`, `coluna_vento` | quadrantes X/Z=±3 | controle + **mostrador de cobre** |
| `banco` | (−3,0,1) | madeira |
| `arvore_pequena` | (2,0,−2) | folhas com translucidez simulada |
| `nuvens`, `sol_disco`, `plumas_vento`, `cartoes_metaforas` | interior da cúpula | nuvens **low-poly suavizadas / volumetria falsa** |
Câmera FOV 40°, (10,7,13)→(0,2,0). Folha de **cartões de metáforas** (convites).

## 5. Sistemas
- **`ClimaState {sol, nuvem, chuva, vento}`** 0–1 → céu (`createSky`/`lerpSky`), nuvens (shader), chuva (partículas instanciadas), vento (shader nas folhas) + luz.
- **Transições** com easing lento; **opção reduzir movimento** = salto suave sem partículas.
- **Diário:** lista de `{estado, motivo, quando?}`; "**reconstruir**" aplica o estado antigo; "**comparar**" mostra dois mini-boletins lado a lado.
- **Orçamento:** nuvens sem raymarch pesado (planos *dithered* + ruído), chuva instanciada com teto de partículas por tier.

## 6. Interface, bordas e ilustrações
- **Mostradores de cobre** em SVG (agulha, escala sem números clínicos; "nada · um pouco · bastante").
- **Prancha botânica:** moldura de papel de herbário com **ilustrações científicas** (folha, gota, nuvem, rajada) feitas em SVG de linha.
- **Boletim:** cartão de "estação meteorológica" com símbolos desenhados (não ícones de app de previsão).
- Modo infantil (4+): **4 botões grandes** com desenhos e três níveis.

## 7. Áudio
Vento (filtro com variação lenta), chuva (ruído filtrado, densidade por parâmetro), folhas (farfalhar leve). **Ganhos separados**; sem trovão; teto no limitador; ligar/desligar sem estalo.

## 8. Acessibilidade, conforto, ética
- Cada dial tem **teclado e texto**; descrição `aria-live` do clima atual ("céu parcialmente nublado, chuva fraca, vento calmo").
- **Nenhum flash** (nada de relâmpago); luz muda em rampas longas.
- Texto de convite sempre **aberto** ("Se quiser, escolha o clima que combina com agora…").
- Boletins não geram rótulo; ficam privados; sessão anônima.

## 9. Etapas
| Etapa | Entrega | Aceite verificável |
|---|---|---|
| **E0** Conteúdo | Convites, metáforas, modo infantil | Aprovado |
| **E1** Blocking | Cúpula, coluna x4, jardim, câmera | Validador; captura |
| **E2** Hero | Cúpula geodésica de cobre, colunas-instrumento, árvore, banco, cartões | GLB; orçamento |
| **E3** Luz + assinatura | Céu/nuvem/chuva/vento paramétricos, raios de luz | Combinações extremas rodam a 60 fps desktop |
| **E4** Mecânica | Dials, narração, diário, reconstruir, comparar | Vitest: interpolação e persistência; efeito visual e lógico |
| **E5** Interface | Mostradores, prancha, boletim | Contraste; teclado |
| **E6** Áudio | 3 canais | Pico ≤ teto |
| **E7** Segurança | Reduzir movimento, baixo desempenho (sem partículas), anônimo | axe; 30 fps móvel |
| **E8** Entrega | Capturas, divergências, README | 6 critérios com evidência |

## 10. Riscos
Vidro com transmissão cara (opaco no tier baixo) · nuvens que parecem "fumaça" (calibrar com capturas) · tentação de rotular clima = emoção (revisão de texto).


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
