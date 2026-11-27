# 01. Sala de Espera Sonora

**Conceito.** Uma sala de espera aconchegante ao anoitecer onde o visitante monta a própria paisagem sonora: chuva na janela, lareira, vitrola, relógio de parede e plantas ao vento. Cada objeto é um canal de som: tocar liga ou desliga, arrastar para cima e para baixo ajusta o volume. Um botão "Respirar 1 minuto" baixa a luz e guia uma respiração lenta pelo brilho da luminária. É o acolhimento do site antes do contato.

**Grupo:** Psicologia e bem-estar (adultos) · **Onde usar:** site de psicólogo, clínica, coach, terapias · **Público:** adultos
**Passos:** Escolha um som → Ajuste o volume → Respire 1 minuto → Siga quando quiser · **Marca fictícia do mockup:** Espaço Travessia Psicologia

---

## Mockup 1 de 3: página inicial (desktop)
```
Crie uma imagem 16:9, em alta resolução, que seja o mockup de uma página de site com um ambiente 3D interativo em destaque (seção principal), para a marca fictícia "Espaço Travessia Psicologia" (site de psicólogo, clínica, coach, terapias).

CENA 3D (ocupa a tela inteira, atrás da interface):
Sala de espera de consultório ao anoitecer, poltrona de veludo verde-oliva, lareira de tijolo acesa à esquerda, janela grande com gotas de chuva escorrendo e luzes da cidade desfocadas, vitrola de madeira sobre um aparador, relógio de parede, costela-de-adão em vaso de cerâmica, luminária de piso com cúpula de linho e tapete de lã suave. Luz e cor: âmbar da lareira e da luminária contra o azul frio da chuva; verde-oliva, terracota, creme e madeira.

NÍVEL DE REALISMO:
Render 3D em tempo real com aparência de "miniatura premium fotorrealista": materiais PBR (madeira com veio, metal escovado, vidro com reflexo, tecido com trama), luz motivada com sombras suaves de contato, tonemapping cinematográfico e leve profundidade de campo no fundo. NÃO é cartoon plano, low-poly, ilustração 2D nem fotografia real. Sem pessoas fotorrealistas identificáveis e sem logotipos ou marcas reais (só a marca fictícia citada).

INTERFACE SOBREPOSTA (estilo vidro fosco escuro e quente, com bordas finas douradas e botões redondos com ícones de linha fina):
- Barra de navegação fina e translúcida no topo: o logotipo em texto "Espaço Travessia Psicologia" à esquerda; os links "Início", "Serviços", "Sobre" e "Contato"; e o botão de destaque "Agendar conversa" à direita.
- À esquerda, sobre a cena: o título grande "Antes de entrar, chegue.", uma frase de apoio curta e um cartão pequeno de passos com "1 · Escolha um som" destacado e os outros 3 passos em tom suave.
- Na base, centralizado: um dock flutuante com cinco botões redondos com ícone e rótulo ("Chuva", "Lareira", "Vitrola", "Relógio", "Plantas"), um botão maior "Respirar 1 minuto" e um botão de som.
- Um selo pequeno "Toque e experimente" perto do objeto principal.
Tipografia no espírito de Fraunces + Inter. Rótulos curtos em português do Brasil, legíveis e com alto contraste.

Atmosfera convidativa, sofisticada e calma. Sem marcas d'água e sem logotipos reais.
```

## Mockup 2 de 3: momento de interação (desktop)
```
Agora gere a mesma cena, mesma luz, mesma paleta e mesma interface, em 16:9, mostrando o momento de interação: chuva e lareira ligadas (gotas escorrendo no vidro e chamas vivas), o braço da vitrola pousado no disco girando, anéis de luz muito sutis ao redor de cada objeto ligado e a luminária com o brilho baixando no ritmo da respiração. Mostre também um cartão flutuante "Respirar 1 minuto" com um anel que expande e a frase "Inspire enquanto a luz cresce"; no dock, "Chuva", "Lareira" e "Vitrola" aparecem acesos. O cartão de passos agora destaca "Respire 1 minuto".
```

## Mockup 3 de 3: celular
```
Agora gere a mesma página adaptada para celular, em formato retrato 9:19,5: barra do topo só com o logotipo, um ícone de menu e o botão "Agendar conversa" compacto; a cena reenquadrada com o objeto principal no centro da metade superior; o título "Antes de entrar, chegue." menor; o dock vira uma barra inferior com botões grandes e fáceis de tocar, rolável na horizontal se precisar; e o cartão do momento de interação aparece como uma folha inferior curta acima do dock.
```

> Cole as 3 mensagens na mesma conversa do ChatGPT, em sequência. Para outro cliente, troque o nome da marca, o botão e as cores no primeiro prompt.

---

## Prompt de implementação
```
Você é um desenvolvedor sênior de experiências 3D para web (Three.js) e vai implementar o ambiente interativo **"Sala de Espera Sonora"** (Psicologia e bem-estar (adultos); público: adultos). Ele precisa funcionar como **seção principal de um site** e ser reaproveitado por marcas diferentes (site de psicólogo, clínica, coach, terapias). Anexei os 3 mockups aprovados (referência visual primária: preserve paleta, enquadramento, materiais e interface) e o arquivo `oficina-do-ritmo.html` como referência de nível 3D e de código.

## Conceito
Uma sala de espera aconchegante ao anoitecer onde o visitante monta a própria paisagem sonora: chuva na janela, lareira, vitrola, relógio de parede e plantas ao vento. Cada objeto é um canal de som: tocar liga ou desliga, arrastar para cima e para baixo ajusta o volume. Um botão "Respirar 1 minuto" baixa a luz e guia uma respiração lenta pelo brilho da luminária. É o acolhimento do site antes do contato.

## Mecânica
- Tocar num objeto liga ou desliga o canal dele, com entrada suave (fade).
- Arrastar na vertical sobre o objeto ajusta o volume do canal.
- Vitrola: o braço desce no disco e a música começa; levantar o braço para.
- Cortina: puxar abre a janela e aumenta a chuva.
- "Respirar 1 minuto": a luminária cresce e diminui devagar (cerca de 6 ciclos por minuto, sem prender o ar) e a sala escurece um pouco.

## Passos guiados (4)
1. Escolha um som
2. Ajuste o volume
3. Respire 1 minuto
4. Siga quando quiser
Mostre os passos num cartão discreto que se recolhe; o visitante pode ignorar e explorar livre.

## Cena
Sala de espera de consultório ao anoitecer, poltrona de veludo verde-oliva, lareira de tijolo acesa à esquerda, janela grande com gotas de chuva escorrendo e luzes da cidade desfocadas, vitrola de madeira sobre um aparador, relógio de parede, costela-de-adão em vaso de cerâmica, luminária de piso com cúpula de linho e tapete de lã suave. Luz e cor: âmbar da lareira e da luminária contra o azul frio da chuva; verde-oliva, terracota, creme e madeira. Monte cada objeto principal como peça própria, com pivô correto e nome semântico.

## Interface
Estilo: vidro fosco escuro e quente, com bordas finas douradas e botões redondos com ícones de linha fina. Tipografia: Fraunces + Inter. Barra de navegação de demonstração (escondida em `?embed=1`), título "Antes de entrar, chegue." com frase de apoio, dock com cinco botões redondos com ícone e rótulo ("Chuva", "Lareira", "Vitrola", "Relógio", "Plantas"), um botão maior "Respirar 1 minuto" e um botão de som, botão de ação "Agendar conversa" sempre visível e um modal "Sobre esta experiência" com os créditos e a explicação de privacidade.

## Áudio
Chuva (ruído rosa filtrado + gotas granulares), lareira (crepitar por ruído impulsivo), vitrola (chiado + acordes lentos lo-fi gerados proceduralmente), relógio (tique suave), vento nas folhas. Tudo começa mudo e cada canal entra com fade.

## Sistemas específicos
- Gotas na janela por shader de normal animado sobre o vidro.
- Chamas por shader em billboard com ruído; luz da lareira com intensidade levemente variável (sem flicker forte).
- Vitrola com prato girando e braço com pivô real.
- Respiração: modulação do emissivo da luminária e da exposição em ciclos de ~10 s, com saída a qualquer momento.

## Cuidados
Não é intervenção clínica e não coleta dados. Incluir no rodapé o botão discreto "Preciso de ajuda agora" (CVV 188 · SAMU 192). Respiração sempre opcional e sem retenção.

## Padrão técnico (mesmo nível da série; use `oficina-do-ritmo.html` como referência de acabamento)
- **Um único arquivo** `sala-de-espera-sonora.html`, sem build, que funciona sozinho e também **embutido** num site: `?embed=1` esconde a barra de navegação de demonstração e deixa só a cena, o título e o dock; ao clicar no botão de ação, envia `postMessage({tipo:'cta'})` para a página-mãe e abre o link configurado.
- **Re-skin por configuração:** no topo do script, um objeto `MARCA` com `nome`, `logoTexto`, `cores` (primária, secundária, fundo, texto, destaque), `fontes` (título e texto), `cta` (texto e link), `textos` (título, frase de apoio, passos) e os catálogos do recurso. Trocar `MARCA` muda a interface **e** os acentos dos materiais 3D (tecidos, vernizes, luzes de destaque), sem mexer no código. Inclua dois presets prontos: o da marca fictícia "Espaço Travessia Psicologia" e um preset neutro.
- **Three.js r160 por import dinâmico** a partir de um importmap (URLs num só bloco, trocáveis por `./vendor/` para uso offline). Se o import ou o WebGL falhar, mostrar uma imagem estática da cena com os controles 2D essenciais e o botão de ação.
- **Render:** `SRGBColorSpace`, `ACESFilmicToneMapping` (exposição ≈ 0,95–1,0), envMap `RoomEnvironment` via PMREM com `envMapIntensity ≈ 0,45`, hemisférica baixa, **uma luz-chave motivada** com sombras `PCFSoftShadowMap` (e paredes/objetos que projetam a mancha de luz quando houver janela), 1–2 luzes de acento, `FogExp2` leve, sombras de contato falsas sob os objetos.
- **Materiais e geometria:** texturas procedurais em `CanvasTexture`, peças chanfradas (`RoundedBoxGeometry`, `LatheGeometry` com perfil arredondado, `ExtrudeGeometry` com bevel), detalhes secundários, `InstancedMesh` para repetições.
- **Qualidade Alta / Equilibrada / Leve** (detecção + troca manual), bloom contido só na Alta, **render sob demanda**, meta < 150 draw calls e 30 fps no celular.
- **Câmera:** `OrbitControls` com limites e amortecimento; `camera.setViewOffset` para centralizar a cena fora da área do título (desktop) e acima do dock (celular).
- **Interação:** hitboxes invisíveis generosas, toque só conta sem arrasto, atalhos de teclado, todo controle 3D com botão equivalente no dock e anúncio em `aria-live`. Alvo de toque ≥ 48 px, foco visível, `prefers-reduced-motion` respeitado.
- **Áudio seguro:** Web Audio procedural (sem arquivos externos), começa só depois do primeiro toque, botão de som sempre visível, teto de ganho (≈ −24 dBFS), limitador e polifonia limitada.
- **Privacidade:** nenhum rastreamento ou analytics, nenhum dado pessoal coletado; só preferências em `localStorage` (`amb3d_sala-de-espera-sonora_v1`). Imagens geradas pelo visitante ficam no aparelho até ele baixar.
- **Autoverificação:** `SCENE_MANIFEST` (id, pos, rot, scale, material, função) com `console.assert` de cada id, e log de triângulos e draw calls.

## Entrega e aceite
Entregue o `.html`, a lista de chaves do objeto `MARCA` com um exemplo preenchido e 3 capturas no enquadramento dos mockups (desktop inicial, desktop no momento de interação, celular). Confirme: sem erros no console; todos os controles funcionam pelo 3D, pelo dock e pelo teclado; o re-skin troca cores, textos e acentos 3D; `?embed=1` funciona; a qualidade Leve fica fluida no celular; nenhuma requisição de rede além das bibliotecas e das fontes.
```
