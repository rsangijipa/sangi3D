# C12 — Pinball de Madeira | Produção comercial 2.0

## Instruções para o agente de código
Implemente a experiência completa no repositório real; não entregue só mockup ou plano. Este arquivo reúne a decisão 2.0 e as referências específicas de produção. Leia o código existente, se houver. Se faltar a referência visual, siga a descrição textual e registre a ausência. Não simule testes nem aprovação. Execute em etapas pequenas: baseline → estado/regras → cena e assets → gesto principal → conteúdo/etapas → UI/áudio → persistência → testes → build e integração. Em cada etapa, valide o gesto e o estado antes de decorar. Anexe ao agente o mockup original e, para migração, o HTML/repositório correspondente.

## Decisão específica 2.0
- Verbo: rebater. Dependência: física.
- Assets prioritários: mesa, flippers, bumpers, rampas, lançador.
- Mecânica: Rapier fixed step, CCD, flippers motorizados, reset de bola, placar opcional apenas comercial.
- Aceite específico: Lançar, rebater, colidir com bumpers, perder e reiniciar bola; placar coerente.
- Validar dois presets de marca, CTA real configurável, embed e fallback DOM; nenhuma oferta real sem integração validada.

## Especificação original específica (stack e contrato substituídos pelo 2.0)
Você é um desenvolvedor sênior de experiências 3D para web (Three.js) e vai implementar o ambiente interativo **"Pinball de Madeira"** (Mecânica das coisas; público: todas as idades). Ele precisa funcionar como **seção principal de um site** e ser reaproveitado por marcas diferentes (qualquer marca (re-skin), bares, hamburguerias, eventos, campanhas). Anexei os 3 mockups aprovados (referência visual primária: preserve paleta, enquadramento, materiais e interface) e o arquivo `oficina-do-ritmo.html` como referência de nível 3D e de código.

## Conceito
Uma mesa de pinball artesanal de madeira e latão, com rampas, bumpers que acendem e um painel retrô. O visitante lança a bola com o êmbolo e usa os flippers pelo teclado ou tocando nas laterais da tela. Alvos, ilustrações e cores mudam conforme a marca. Sem dinheiro e sem prêmio aleatório.

## Mecânica
- Êmbolo: segurar e soltar (força pela duração).
- Flippers: teclas laterais ou toque nas metades da tela.
- Bumpers, alvos e rampa com efeitos de luz.
- 3 bolas por rodada, placar só local.
- "Modo relax": sem fim de jogo.

## Passos guiados (4)
1. Puxe o êmbolo
2. Use os flippers
3. Acerte os alvos
4. Jogue de novo
Mostre os passos num cartão discreto que se recolhe; o visitante pode ignorar e explorar livre.

## Cena
Mesa de pinball vista de cima em perspectiva, tampo de madeira clara com marchetaria, bumpers cilíndricos de latão com topo de acrílico iluminado, flippers marfim, rampa de arame cromado, backbox com letreiro de neon da marca fictícia e vidro com reflexos. Luz e cor: neon quente e luzes dos bumpers com reflexos no vidro; madeira, latão e as cores da marca. Monte cada objeto principal como peça própria, com pivô correto e nome semântico.

## Interface
Estilo: fliperama retrô com bordas cromadas e placar de dígitos que viram. Tipografia: Bungee + Rubik. Barra de navegação de demonstração (escondida em `?embed=1`), título "Jogue uma rodada." com frase de apoio, dock com botões grandes "Flipper esquerdo" e "Flipper direito" nas laterais, "Lançar", "Modo relax" e som, botão de ação "Pedir agora" sempre visível e um modal "Sobre esta experiência" com os créditos e a explicação de privacidade.

## Áudio
Bumper (pop elétrico), flipper (solenoide), bola rolando, sino de pontos; trilha opcional.

## Sistemas específicos
- Física restrita ao plano inclinado (Rapier 2D ou 3D travado), CCD para a bola, flippers cinemáticos com alta velocidade angular, impulso nos bumpers.
- Bola de aço espelhada pelo envMap.
- Layout da mesa e tema (cores, imagens, textos) num JSON de configuração da marca.

## Cuidados
Nada de aposta, compra ou prêmio aleatório; placar só local.

## Direção de arte e prompts originais de mockup (referência, não captura real)
**Conceito.** Uma mesa de pinball artesanal de madeira e latão, com rampas, bumpers que acendem e um painel retrô. O visitante lança a bola com o êmbolo e usa os flippers pelo teclado ou tocando nas laterais da tela. Alvos, ilustrações e cores mudam conforme a marca. Sem dinheiro e sem prêmio aleatório.

**Grupo:** Mecânica das coisas · **Onde usar:** qualquer marca (re-skin), bares, hamburguerias, eventos, campanhas · **Público:** todas as idades
**Passos:** Puxe o êmbolo → Use os flippers → Acerte os alvos → Jogue de novo · **Marca fictícia do mockup:** Hamburgueria Brasa

---

## Mockup 1 de 3: página inicial (desktop)
```
Crie uma imagem 16:9, em alta resolução, que seja o mockup de uma página de site com um ambiente 3D interativo em destaque (seção principal), para a marca fictícia "Hamburgueria Brasa" (qualquer marca (re-skin), bares, hamburguerias, eventos, campanhas).

CENA 3D (ocupa a tela inteira, atrás da interface):
Mesa de pinball vista de cima em perspectiva, tampo de madeira clara com marchetaria, bumpers cilíndricos de latão com topo de acrílico iluminado, flippers marfim, rampa de arame cromado, backbox com letreiro de neon da marca fictícia e vidro com reflexos. Luz e cor: neon quente e luzes dos bumpers com reflexos no vidro; madeira, latão e as cores da marca.

NÍVEL DE REALISMO:
Render 3D em tempo real com aparência de "miniatura premium fotorrealista": materiais PBR (madeira com veio, metal escovado, vidro com reflexo, tecido com trama), luz motivada com sombras suaves de contato, tonemapping cinematográfico e leve profundidade de campo no fundo. NÃO é cartoon plano, low-poly, ilustração 2D nem fotografia real. Sem pessoas fotorrealistas identificáveis e sem logotipos ou marcas reais (só a marca fictícia citada).

INTERFACE SOBREPOSTA (estilo fliperama retrô com bordas cromadas e placar de dígitos que viram):
- Barra de navegação fina e translúcida no topo: o logotipo em texto "Hamburgueria Brasa" à esquerda; os links "Início", "Serviços", "Sobre" e "Contato"; e o botão de destaque "Pedir agora" à direita.
- À esquerda, sobre a cena: o título grande "Jogue uma rodada.", uma frase de apoio curta e um cartão pequeno de passos com "1 · Puxe o êmbolo" destacado e os outros 3 passos em tom suave.
- Na base, centralizado: um dock flutuante com botões grandes "Flipper esquerdo" e "Flipper direito" nas laterais, "Lançar", "Modo relax" e som.
- Um selo pequeno "Toque e experimente" perto do objeto principal.
Tipografia no espírito de Bungee + Rubik. Rótulos curtos em português do Brasil, legíveis e com alto contraste.

Atmosfera convidativa, sofisticada e calma. Sem marcas d'água e sem logotipos reais.
```

## Mockup 2 de 3: momento de interação (desktop)
```
Agora gere a mesma cena, mesma luz, mesma paleta e mesma interface, em 16:9, mostrando o momento de interação: a bola de aço em pleno voo entre dois bumpers acesos com faíscas de luz, o flipper direito levantado e o placar no backbox subindo. Mostre também um placar de dígitos que viram com "Bola 2 de 3" e os botões grandes dos flippers nas laterais. O cartão de passos agora destaca "Acerte os alvos".
```

## Mockup 3 de 3: celular
```
Agora gere a mesma página adaptada para celular, em formato retrato 9:19,5: barra do topo só com o logotipo, um ícone de menu e o botão "Pedir agora" compacto; a cena reenquadrada com o objeto principal no centro da metade superior; o título "Jogue uma rodada." menor; o dock vira uma barra inferior com botões grandes e fáceis de tocar, rolável na horizontal se precisar; e o cartão do momento de interação aparece como uma folha inferior curta acima do dock.
```

> Cole as 3 mensagens na mesma conversa do ChatGPT, em sequência. Para outro cliente, troque o nome da marca, o botão e as cores no primeiro prompt.

---

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
