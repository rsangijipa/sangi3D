# 08. Toca-Discos de Vinil

**Conceito.** Um toca-discos de madeira ao lado de uma estante de discos com capas originais. O visitante escolhe uma capa, tira o vinil, coloca no prato, liga, desce o braço e ouve faixas instrumentais geradas pelo próprio site. Pode mudar a rotação (33/45), mexer no pitch, arranhar o disco e trocar de lado.

**Grupo:** Sonoros e musicais · **Onde usar:** cafés, bares, lojas de discos, rádios, estúdios · **Público:** adultos
**Passos:** Escolha um disco → Coloque no prato → Desça a agulha → Ajuste e arranhe · **Marca fictícia do mockup:** Café Lado B

---

## Mockup 1 de 3: página inicial (desktop)
```
Crie uma imagem 16:9, em alta resolução, que seja o mockup de uma página de site com um ambiente 3D interativo em destaque (seção principal), para a marca fictícia "Café Lado B" (cafés, bares, lojas de discos, rádios, estúdios).

CENA 3D (ocupa a tela inteira, atrás da interface):
Toca-discos vintage de nogueira com prato de alumínio e tapete de feltro, braço cromado em S, estante de discos com capas coloridas originais, caixas de som de madeira, uma planta e luz quente de café ao fim da tarde. Luz e cor: fim de tarde pela janela, reflexo anisotrópico nas ranhuras do vinil; nogueira, preto do vinil e capas vibrantes.

NÍVEL DE REALISMO:
Render 3D em tempo real com aparência de "miniatura premium fotorrealista": materiais PBR (madeira com veio, metal escovado, vidro com reflexo, tecido com trama), luz motivada com sombras suaves de contato, tonemapping cinematográfico e leve profundidade de campo no fundo. NÃO é cartoon plano, low-poly, ilustração 2D nem fotografia real. Sem pessoas fotorrealistas identificáveis e sem logotipos ou marcas reais (só a marca fictícia citada).

INTERFACE SOBREPOSTA (estilo botões circulares como rótulos de disco, painel em papelão kraft):
- Barra de navegação fina e translúcida no topo: o logotipo em texto "Café Lado B" à esquerda; os links "Início", "Serviços", "Sobre" e "Contato"; e o botão de destaque "Ver cardápio" à direita.
- À esquerda, sobre a cena: o título grande "Ponha um disco.", uma frase de apoio curta e um cartão pequeno de passos com "1 · Escolha um disco" destacado e os outros 3 passos em tom suave.
- Na base, centralizado: um dock flutuante com botões "Discos", "Ligar", "Braço", "33/45", "Pitch" e "Trocar lado".
- Um selo pequeno "Toque e experimente" perto do objeto principal.
Tipografia no espírito de Abril Fatface + DM Sans. Rótulos curtos em português do Brasil, legíveis e com alto contraste.

Atmosfera convidativa, sofisticada e calma. Sem marcas d'água e sem logotipos reais.
```

## Mockup 2 de 3: momento de interação (desktop)
```
Agora gere a mesma cena, mesma luz, mesma paleta e mesma interface, em 16:9, mostrando o momento de interação: o disco girando com reflexo anisotrópico nas ranhuras, o braço pousado na faixa 2, a capa encostada no aparelho e a luz âmbar da agulha. Mostre também um cartão "Ajuste e arranhe" com o seletor "33/45", o controle "Pitch ±8%" e a dica "Arraste o disco para arranhar". O cartão de passos agora destaca "Desça a agulha".
```

## Mockup 3 de 3: celular
```
Agora gere a mesma página adaptada para celular, em formato retrato 9:19,5: barra do topo só com o logotipo, um ícone de menu e o botão "Ver cardápio" compacto; a cena reenquadrada com o objeto principal no centro da metade superior; o título "Ponha um disco." menor; o dock vira uma barra inferior com botões grandes e fáceis de tocar, rolável na horizontal se precisar; e o cartão do momento de interação aparece como uma folha inferior curta acima do dock.
```

> Cole as 3 mensagens na mesma conversa do ChatGPT, em sequência. Para outro cliente, troque o nome da marca, o botão e as cores no primeiro prompt.

---

## Prompt de implementação
```
Você é um desenvolvedor sênior de experiências 3D para web (Three.js) e vai implementar o ambiente interativo **"Toca-Discos de Vinil"** (Sonoros e musicais; público: adultos). Ele precisa funcionar como **seção principal de um site** e ser reaproveitado por marcas diferentes (cafés, bares, lojas de discos, rádios, estúdios). Anexei os 3 mockups aprovados (referência visual primária: preserve paleta, enquadramento, materiais e interface) e o arquivo `oficina-do-ritmo.html` como referência de nível 3D e de código.

## Conceito
Um toca-discos de madeira ao lado de uma estante de discos com capas originais. O visitante escolhe uma capa, tira o vinil, coloca no prato, liga, desce o braço e ouve faixas instrumentais geradas pelo próprio site. Pode mudar a rotação (33/45), mexer no pitch, arranhar o disco e trocar de lado.

## Mecânica
- Escolher a capa na estante; o disco sai da capa.
- Colocar no prato (encaixa no pino).
- Ligar: o prato acelera com inércia.
- Arrastar o braço até a borda e descer a agulha.
- Arrastar o disco arranha; "Pitch" ±8%; "33/45"; "Trocar lado".

## Passos guiados (4)
1. Escolha um disco
2. Coloque no prato
3. Desça a agulha
4. Ajuste e arranhe
Mostre os passos num cartão discreto que se recolhe; o visitante pode ignorar e explorar livre.

## Cena
Toca-discos vintage de nogueira com prato de alumínio e tapete de feltro, braço cromado em S, estante de discos com capas coloridas originais, caixas de som de madeira, uma planta e luz quente de café ao fim da tarde. Luz e cor: fim de tarde pela janela, reflexo anisotrópico nas ranhuras do vinil; nogueira, preto do vinil e capas vibrantes. Monte cada objeto principal como peça própria, com pivô correto e nome semântico.

## Interface
Estilo: botões circulares como rótulos de disco, painel em papelão kraft. Tipografia: Abril Fatface + DM Sans. Barra de navegação de demonstração (escondida em `?embed=1`), título "Ponha um disco." com frase de apoio, dock com botões "Discos", "Ligar", "Braço", "33/45", "Pitch" e "Trocar lado", botão de ação "Ver cardápio" sempre visível e um modal "Sobre esta experiência" com os créditos e a explicação de privacidade.

## Áudio
Música instrumental original gerada proceduralmente (lo-fi: acordes, baixo, batida; cada disco com estilo e seed próprios), chiado e estalos de vinil; pitch e rotação aplicados à reprodução; scratch como varredura do buffer.

## Sistemas específicos
- Música gerada por padrões com seed por disco e renderizada num AudioBuffer (OfflineAudioContext), para permitir scratch e pitch.
- Inércia do prato na partida e na frenagem.
- Vinil com MeshPhysicalMaterial com anisotropia e normal map radial das ranhuras.
- Capas originais geradas proceduralmente (formas e cores), sem artes de terceiros.

## Cuidados
Nenhuma música, capa ou marca com direitos autorais.

## Padrão técnico (mesmo nível da série; use `oficina-do-ritmo.html` como referência de acabamento)
- **Um único arquivo** `toca-discos-de-vinil.html`, sem build, que funciona sozinho e também **embutido** num site: `?embed=1` esconde a barra de navegação de demonstração e deixa só a cena, o título e o dock; ao clicar no botão de ação, envia `postMessage({tipo:'cta'})` para a página-mãe e abre o link configurado.
- **Re-skin por configuração:** no topo do script, um objeto `MARCA` com `nome`, `logoTexto`, `cores` (primária, secundária, fundo, texto, destaque), `fontes` (título e texto), `cta` (texto e link), `textos` (título, frase de apoio, passos) e os catálogos do recurso. Trocar `MARCA` muda a interface **e** os acentos dos materiais 3D (tecidos, vernizes, luzes de destaque), sem mexer no código. Inclua dois presets prontos: o da marca fictícia "Café Lado B" e um preset neutro.
- **Three.js r160 por import dinâmico** a partir de um importmap (URLs num só bloco, trocáveis por `./vendor/` para uso offline). Se o import ou o WebGL falhar, mostrar uma imagem estática da cena com os controles 2D essenciais e o botão de ação.
- **Render:** `SRGBColorSpace`, `ACESFilmicToneMapping` (exposição ≈ 0,95–1,0), envMap `RoomEnvironment` via PMREM com `envMapIntensity ≈ 0,45`, hemisférica baixa, **uma luz-chave motivada** com sombras `PCFSoftShadowMap` (e paredes/objetos que projetam a mancha de luz quando houver janela), 1–2 luzes de acento, `FogExp2` leve, sombras de contato falsas sob os objetos.
- **Materiais e geometria:** texturas procedurais em `CanvasTexture`, peças chanfradas (`RoundedBoxGeometry`, `LatheGeometry` com perfil arredondado, `ExtrudeGeometry` com bevel), detalhes secundários, `InstancedMesh` para repetições.
- **Qualidade Alta / Equilibrada / Leve** (detecção + troca manual), bloom contido só na Alta, **render sob demanda**, meta < 150 draw calls e 30 fps no celular.
- **Câmera:** `OrbitControls` com limites e amortecimento; `camera.setViewOffset` para centralizar a cena fora da área do título (desktop) e acima do dock (celular).
- **Interação:** hitboxes invisíveis generosas, toque só conta sem arrasto, atalhos de teclado, todo controle 3D com botão equivalente no dock e anúncio em `aria-live`. Alvo de toque ≥ 48 px, foco visível, `prefers-reduced-motion` respeitado.
- **Áudio seguro:** Web Audio procedural (sem arquivos externos), começa só depois do primeiro toque, botão de som sempre visível, teto de ganho (≈ −24 dBFS), limitador e polifonia limitada.
- **Privacidade:** nenhum rastreamento ou analytics, nenhum dado pessoal coletado; só preferências em `localStorage` (`amb3d_toca-discos-de-vinil_v1`). Imagens geradas pelo visitante ficam no aparelho até ele baixar.
- **Autoverificação:** `SCENE_MANIFEST` (id, pos, rot, scale, material, função) com `console.assert` de cada id, e log de triângulos e draw calls.

## Entrega e aceite
Entregue o `.html`, a lista de chaves do objeto `MARCA` com um exemplo preenchido e 3 capturas no enquadramento dos mockups (desktop inicial, desktop no momento de interação, celular). Confirme: sem erros no console; todos os controles funcionam pelo 3D, pelo dock e pelo teclado; o re-skin troca cores, textos e acentos 3D; `?embed=1` funciona; a qualidade Leve fica fluida no celular; nenhuma requisição de rede além das bibliotecas e das fontes.
```
