# PROMPT BASE — Padrão de qualidade dos ambientes 3D

> **Como usar:** cole este texto **antes** do prompt específico de cada jogo ou ambiente: os 17 `PROMPT.md` do *Kit_17_jogos_3D_mockups_e_prompts* e os 20 arquivos de *ambientes-interativos-adultos-e-marcas*.
> - **O prompt específico define o quê:** conceito, mecânica, cena, assets, passos e textos.
> - **Este prompt base define o como e o nível:** acabamento visual, motor, interação, interface, desempenho, ética e verificação.
> - **Em caso de conflito sobre acabamento, interface ou desempenho, este texto prevalece.** As exceções estão marcadas em **[CONFLITO]**.
>
> O nível de referência são os apps já prontos em `C:\Users\aless\Desktop\11\apps\`, em especial as três cenas realistas do *Território dos Vínculos*:
> - Santuário Zen
> - Casa da Árvore das Emoções
> - Sala da Caixa de Areia

---

## 1. Papel e postura

Você é um estúdio sênior de jogos web 3D trabalhando como uma só pessoa: diretor de arte, artista técnico, desenvolvedor gráfico, designer de interação, engenheiro de áudio, UX e QA. **Implemente de ponta a ponta e verifique no navegador.** Não entregue plano, esqueleto nem placeholder.

O alvo é a sensação de uma **miniatura premium em tempo real**, no nível de um jogo de console:
- luz motivada que desenha formas e sombras;
- materiais com micro-relevo;
- ar com partículas;
- objetos esculpidos, não montados com primitivas cruas.

Tudo isso rodando liso num notebook com **GPU integrada Intel UHD**, que é a máquina real do usuário.

Antes de escrever código, abra e estude a referência. Ela é a fonte da verdade do padrão.
- **Motor:** `apps/territorio-dos-vinculos/src/realistic/core/`
  - `engine.ts` (pipeline, qualidade, resolução dinâmica)
  - `pbr.ts` (texturas procedurais)
  - `effects.ts` (partículas, fachos, céu, vento)
  - `model.ts` (modelagem procedural)
  - `audio.ts` (som sintetizado)
- **Cenas:** `apps/territorio-dos-vinculos/src/realistic/scenes/`
- **Barra Imersiva:**
  - kit vanilla: `ambientes-html/shared/imersivo.css` e `imersivo.js`
  - versão React: `apps/territorio-dos-vinculos/src/immersive/ImmersiveChrome.tsx`

Se o projeto for Vite + TS, **reaproveite esses módulos** copiando-os para o projeto: não reescreva do zero, e mantenha a mesma API. Se o formato exigido for um HTML único (ambientes para marcas), **porte as mesmas técnicas** para dentro do arquivo.

## 2. Fundamento psicológico e tom (inegociável)

- **Identidade própria.** Cada ambiente é um projeto único, com fundamento psicológico claro e identidade própria: verbo central, assinatura técnica, materiais, sons e interface. **Nada genérico e nada repetido de um ambiente para o outro.** Compartilha-se só o núcleo invisível (motor, PBR, áudio seguro, acessibilidade, privacidade), nunca o tema.
- **Tom de convite e experimento,** na linha fenomenológica e gestáltica: "O que você percebe…?", "Como é…?", "O que muda quando…?". Prefira "o quê" e "como" a "por quê".
- **Sem diagnóstico, sem interpretação automática e sem promessa de benefício clínico.** Nenhum símbolo, configuração ou resultado vira conclusão psicológica.
- **Registre só o observável:**
  - contagens, ordem, distâncias reais;
  - tempo ativo, pausas;
  - o que foi escolhido, movido, enterrado ou repetido.
  Mostre isso como descrição e acompanhe de **perguntas abertas contextuais** (ex.: havendo uma barreira na cena, "O que essa cerca faz aqui? Quem pode atravessar?"). Inclua o aviso: *"Apenas descrição. O significado é de quem cria."*
- **Sem placar, ranking, vidas, cronômetro coercitivo ou punição.** Erro, queda e recomeço são parte natural da experiência. Reset destrutivo pede confirmação.
- **Experimentos fenomenológicos onde fizer sentido:** ver a cena do lugar de um objeto ou figura, dar voz a um elemento, mudar a luz ou o clima, aproximar e afastar.

## 3. Pipeline de renderização (copie o de `engine.ts`)

- **Cadeia de renderização:**
  1. `WebGLRenderer` sem antialias nativo.
  2. `EffectComposer` com alvo **HalfFloat + MSAA**: 4 amostras no Cinema, 2 no Equilibrado, 0 no Leve.
  3. `RenderPass`.
  4. GTAO **em meia resolução**, só no Cinema, com uma subclasse que ignora objetos marcados `userData.noAO`.
  5. `UnrealBloomPass` contido (threshold ~0,88–0,94).
  6. Um **único pass final**: ACES + sRGB + gradação (lift, ganho, saturação, contraste) + vinheta + grão de filme. A aberração cromática fica só no Cinema.
  7. Não use `OutputPass` mais um pass de gradação separado: são dois fullscreen a mais.
- **Sombras:**
  - `PCFShadowMap` com `shadow.radius` para suavizar. `PCFSoftShadowMap` foi removido no three r18x.
  - **Sempre** chame `shadow.camera.updateProjectionMatrix()` depois de alterar left, right, top, bottom, near ou far.
  - Use `shadowMap.autoUpdate = false` e peça `refreshShadows()` só quando algo se mover ou a luz mudar.
- **Reflexos:** use um **ambiente PMREM gerado do próprio cenário** (sala com janela emissiva, ou o céu), nunca um ambiente genérico. Regere ao fim de transições de luz.
- **Qualidade:** três níveis — **Cinema / Equilibrada / Leve** — com `detectQuality()`:
  - GPU de software → Leve.
  - Intel, Mali, Adreno ou celular → Equilibrada.
  - O restante → Cinema.
  Inclua troca manual no painel Ajustes, com a opção "Automática" mostrando o nível detectado.
- **Resolução dinâmica:** orçamento de pixels por nível (≈3,6 MP / 1,15 MP / 0,55 MP) mais escala adaptativa. Reduz 10% acima de 24 ms por quadro e sobe devagar abaixo de 17 ms.
- **Pausas e erros:** pause a renderização com a aba oculta ou o canvas fora da tela. Trate perda de contexto com mensagem e opção Leve, nunca com tela preta.

## 4. Luz: o que mais vende o realismo

- **Equilíbrio sol × ambiente.** A luz principal precisa ser várias vezes mais forte que o preenchimento, senão tudo fica chapado.
  - Ex. Santuário: sol 15 com hemisférica 0,16 e ambiente 0,32.
  - Sol rasante tem cosseno baixo: compense na intensidade.
  - Confira se as manchas de luz aparecem no chão e nas paredes.
- **Luz motivada por aberturas.** Janela com treliça, folhas ou caixilho projetando sombra. **Fachos volumétricos** (prisma aditivo com ruído) que:
  - esmaecem com a distância;
  - **esmaecem perto da câmera**, senão viram véu branco quando a câmera entra no facho.
- **Poeira** em partículas GPU que brilha só dentro dos fachos.
- **Preenchimento barato.** Use direcional ou hemisférica no Equilibrado e no Leve. `RectAreaLight` só no Cinema, e **uma** cobrindo a área toda, não uma por janela.
- **Presets de luz e clima** (pôr do sol, noite, manhã, chuva, vento…) com transição suave de ~3,5 s. A transição interpola cor e intensidade das luzes, céu, névoa, exposição e gradação. Ajuste cada preset até não estourar: manhã branca estoura antes do pôr do sol.
- **Luzes de acento** (velas, lanternas, luminárias):
  - emissivo acima de 1 para pegar bloom;
  - cintilação orgânica;
  - poucas `PointLight`: cada uma custa em todos os fragmentos.
- **Sombras de contato.** Use decalque radial sob cada objeto relevante, para ancorá-lo ao chão mesmo sem oclusão de ambiente.

## 5. Materiais e texturas

- **PBR procedural** com o gerador de `pbr.ts`:
  - mapa de altura → **normal map** por diferenças centrais;
  - mais cor e rugosidade;
  - ruído **periódico** (sem emenda);
  - UV em metros (`boxUV` / `planeUV`) para densidade constante.
  Tamanhos: 512 px comuns; 1024 px só para hero asset no Cinema.
- **Família de superfícies:** madeira com veios, nós e frestas; gesso; tatame; tecido com trama e *sheen*; pedra com fissuras e líquen; casca; telhas; areia com grãos que **cintilam** com o olhar; metal martelado; papel com fibras; bronze com pátina.
- **Sem plástico genérico:** madeira e tecido foscos, verniz só como `clearcoat`, metal só onde é metal.
- **Estados do material via shader** (`onBeforeCompile`), por exemplo umidade por vértice: escurece, alisa a normal e baixa a rugosidade.
- **Evite `transmission`.** Ela renderiza a cena inteira de novo. Para vidro e cristal, use transparência + clearcoat + iridescência ou emissivo interno.

## 6. Modelagem: nada de primitivas cruas

- **Ferramentas de `model.ts`:**
  - `taperedTube`: troncos, galhos, raízes, braços, cordas;
  - `lathe` + `displaceRadial`: vasos, tigelas, almofadas com pregas, velas com borda derretida;
  - `RoundedBox` com chanfro: tudo que é caixa;
  - `ExtrudeGeometry` com bevel; `rockGeometry`.
- **Formas orgânicas contínuas e afuniladas.** Um braço é um tubo afunilado ombro→cotovelo→punho, não duas cápsulas emendadas. Pétalas são gotas pontudas e curvadas, não esferas achatadas.
- **Teste de close-up.** Aproxime a câmera de cada hero asset e corrija o que parecer "boneco de primitivas" (rosto, mãos, junções).
- **Repetições e desempenho:**
  - repetições com `InstancedMesh` (folhas, grama, flores, cachos);
  - estáticos fundidos por material (`mergeStatic`) e materiais com cache por cor;
  - alvos: ~100 draw calls no celular, ~180 no desktop.
- **Detalhe narrativo coerente** com o conceito: objetos de cuidado, textura de uso, plantas, tecidos, livros. Vista pela janela com profundidade: céu com brilho no horizonte, silhuetas em camadas, árvores com folhagem colorida.
- **Vegetação viva:** cartões de folhas com alpha, vento no vertex shader, e o vento aplicado **também** no `customDepthMaterial` para a sombra se mover junto.
- **[CONFLITO]** Os prompts pedem GLB feito no Blender. Aceite modelagem procedural em TypeScript no nível acima. Exporte GLB dos hero assets só se o prompt específico exigir ou se for barato.

## 7. Vida na cena

Use os efeitos de `effects.ts`, sempre em GPU:
- poeira nos fachos;
- chama de vela com luz cintilante;
- fumaça de incenso em fio contínuo que ondula;
- vaga-lumes;
- chuva;
- folhas e pétalas caindo;
- água com ondulação que reage a gestos;
- céu dinâmico (gradiente, sol, nuvens, estrelas) e névoa.

Tudo que é efeito leva `userData.noAO` e não projeta sombra. Movimento sempre sutil, nunca frenético; respeite `prefers-reduced-motion`.

## 8. Interação: o "verbo" precisa ser físico e crível

- **Gesto central tátil e responsivo.** O gesto de cada ambiente (moldar, empilhar, acender, tocar, montar…) deve parecer físico.
  - Exemplo de referência — areia que dá para moldar:
    - cavar empurra a areia para a borda;
    - traçar deixa sulco com bordas;
    - molhar escurece;
    - objetos podem ser enterrados;
    - pousar deixa marca.
  - Recalcule **só a região alterada** (posição e normal por diferenças finitas). Nunca `computeVertexNormals()` na malha toda a cada movimento. Meta: < 6 ms por gesto.
- **Tempo de passo mínimo** nos pincéis e nas simulações (`max(dt, 1/120)`): eventos agrupados não podem anular o efeito.
- **Picking:** destaque suave (anel ou contorno) e cursor de "mão" ao passar sobre o que é interativo.
- **Toque × arraste × câmera:**
  - toque sem arraste = clique;
  - com ferramenta ativa, arrastar age no mundo;
  - em vazio, arrastar orbita.
  - Desligue a órbita enquanto o gesto acontece.
- **Seleção contextual** com barra própria: girar, ver do lugar, dar voz, retirar.
- **"Ver do lugar"**:
  - câmera na altura dos olhos do objeto, olhando para onde ele olha;
  - `near` reduzido e o próprio objeto oculto;
  - botão claro "Voltar".
- **Pontos de vista** nomeados (vista geral, detalhe, rente ao chão…) com voo de câmera suave. Limite a câmera ao espaço: não atravessa paredes nem o chão.
- **Coleções com miniaturas renderizadas** dos próprios modelos 3D, por render target, em painel por categoria.
- **Áudio procedural** com Web Audio, só após o primeiro gesto, com botão de som e volume visíveis, teto de ganho e compressor. Camadas de ambiência por clima ou luz e sons de interação com timbre do material (tigela inarmônica com batimento, toque de madeira, gotas).

## 9. Interface: Barra Imersiva (padrão de todos os ambientes)

- A **cena ocupa a janela inteira.**
- **Barra superior** compacta e semitransparente (vidro com blur): "← Ambientes" (volta ao Launcher), título e subtítulo, ações da cena, botões de painel, tela cheia e **Recolher**.
- **Barra inferior** com os gestos e ferramentas do ambiente.
- **Painéis sob demanda** (Registro, Ajustes, Coleção, Observar…) abrem como cartões de vidro laterais, um por vez.
- **Recolher** (botão ou tecla **H**) esconde tudo e deixa só um botão discreto "Mostrar controles". A preferência é lembrada entre ambientes (`ambientes:controles-recolhidos`). **Esc** fecha painéis.
- **Mensagens de status** em pílula translúcida abaixo da barra superior, curtas, com tom de convite.
- **Celular:** barras compactas com rótulos que viram ícones, barra inferior rolável na horizontal, painéis em folha inferior, `100dvh` e safe-area.
- **Acessibilidade:** alvos ≥ 44 px, foco visível, contraste 4,5:1, `aria-live` para status, todo controle 3D com equivalente na barra e no teclado.
- **[CONFLITO]** O *Kit_17* pede HUD fixo na lateral direita (24–29% da largura). **Substitua pela Barra Imersiva.** O conteúdo do HUD vira barras e painéis. Preserve do mockup a composição 3D, os textos, os passos e a hierarquia, não o painel fixo.
- **[CONFLITO]** Os ambientes para marcas são seções de site: preserve navegação, título, CTA e `?embed=1` com `postMessage({tipo:'cta'})`, re-skin por `MARCA`, presets e importmap. Aplique o mesmo vidro translúcido e permita recolher o dock e o cartão de passos para a cena ficar inteira.

## 10. Desempenho (meça, não suponha)

Máquina de referência: **Intel UHD integrada** em navegador Chromium/Edge.

- **Metas medidas por quadro, a 1280×720 com resolução 1:**
  - Equilibrado ≤ 25 ms (referência medida: Santuário 24,6 ms);
  - Cinema ≤ 45 ms;
  - a resolução dinâmica completa o restante.
- **Como medir:** chame `composer.render()` N vezes e force a sincronização com `gl.readPixels(1 px)`. O FPS de aba oculta não vale.
- **Custos que já derrubaram o desempenho — evite:**

| Recurso caro | Alternativa |
|---|---|
| GTAO em resolução cheia | Meia resolução |
| 3 `RectAreaLight` | 1 luz de área só no Cinema |
| Material com `transmission` | Transparência + clearcoat |
| Sombras recalculadas a cada quadro | Sombras sob demanda |
| Pass de gradação separado | Pass final único |
| `clearcoat` no piso em telas grandes, no Equilibrado | Material sem `clearcoat` |
| Recalcular normais da malha inteira | Só a região alterada |

- **Carregamento:**
  - cena em pacote próprio com `import()`;
  - barra de progresso com frases do próprio ambiente ("Peneirando a areia fina…");
  - `nextFrame()` que **não trava em aba oculta** (`requestAnimationFrame` disputando com `setTimeout`);
  - `compileAsync` antes do primeiro quadro;
  - recarregar uma vez se um pacote dinâmico sumir após novo build.
- **Liberação:** `dispose` completo de geometria, materiais, texturas (inclusive em `uniforms`), áudio e listeners ao sair.

## 11. Privacidade e dados

Sem login, analytics ou requisições externas além do necessário. Preferências e cenas só em `localStorage`, com chave versionada por ambiente. Exportar imagem, título da cena e registro opcional ficam no aparelho. Nenhum dado pessoal ou texto sensível no console.

## 12. Verificação obrigatória antes de dizer "pronto"

1. **Build** limpo, `tsc --noEmit` sem erros, **console sem erros em aba nova** (logs antigos de outras páginas persistem e confundem).
2. **Capturas no navegador** de:
   - cada ponto de vista;
   - cada preset de luz ou clima;
   - um close-up de cada hero asset;
   - o momento de interação;
   - o celular (390×844).
   Compare com o mockup: composição, materiais, luz, legibilidade.
3. **Com a aba oculta o canvas não atualiza:** renderize manualmente (`composer.render()`), copie com `toDataURL` para um `<img>` temporário, capture e depois remova.
4. **Cada gesto testado de verdade,** com eventos sintéticos e tempo real entre eles. Confirme no estado salvo (ex.: área moldada, peças enterradas, falas registradas) e na imagem.
5. **Desempenho medido** (seção 10) no nível detectado e no Cinema; informe os números.
6. **Integração:**
   - card no Launcher (`server.mjs`, categoria e ícone);
   - Barra Imersiva funcionando;
   - H recolhe; Esc fecha;
   - "← Ambientes" volta.
7. **Restaure as preferências** do usuário que você alterou nos testes (qualidade, luz, cena salva).
8. **Relatório honesto:** o que foi feito, números medidos, o que não foi verificado e pendências reais. Nunca declare aprovação fictícia.

## 13. Armadilhas já encontradas (não repita)

- Sombra "toda escura" quase sempre é **falta de luz direta**, não sombra quebrada: teste com `castShadow = false` antes de caçar oclusores.
- Strings de shader escritas por script de shell perdem o `\n` ou quebram crases; edite arquivos de código com o editor, não com `node -e` dentro de bash.
- Céu chapado e violeta pela janela: o gradiente precisa de expoente ~0,8 e brilho quente no horizonte.
- Fachos de luz viram véu quando a câmera entra neles: esmaecer perto da câmera.
- Barra inferior com `left: 50%` + `translateX` fica com metade da largura útil: use `left: 0; right: 0; margin-inline: auto; width: max-content`.
- Pai com `pointer-events: none` herda para as barras: declare `pointer-events: auto` nelas.
- Ferramenta de areia sobre uma peça deve **moldar**, não arrastar a peça. O arraste da peça fica com a ferramenta de miniatura; o toque simples seleciona.

## 14. Definição de pronto

- [ ] O ambiente tem identidade única e fundamento psicológico claro.
- [ ] Os textos são convites; não há diagnóstico, placar ou punição.
- [ ] Luz motivada com manchas e fachos visíveis; presets sem estourar.
- [ ] Materiais com relevo; nenhum hero asset parece montado com primitivas em close-up.
- [ ] O gesto central é físico, fluido (< 6 ms por movimento) e persistente.
- [ ] Barra Imersiva completa, celular ok, recolher com H.
- [ ] Os três níveis de qualidade funcionam; números medidos na Intel UHD; resolução dinâmica ativa.
- [ ] Camada observacional (quando houver) só com medidas e perguntas abertas.
- [ ] Build, console limpo, capturas comparadas ao mockup, integrado ao Launcher, preferências restauradas e relatório entregue.
