# 18. Órgão do Perfumista

**Conceito.** O órgão do perfumista: uma estante em semicírculo com dezenas de frascos organizados em notas de saída, coração e fundo. O visitante escolhe até 6 essências, dosa gotas com uma pipeta, vê as cores se misturarem num frasco de cristal e recebe uma descrição poética da composição e a sugestão do produto mais próximo do catálogo.

**Grupo:** Marcas e nichos · **Onde usar:** perfumarias, cosméticos, velas aromáticas · **Público:** adultos
**Passos:** Escolha as notas → Dose as gotas → Equilibre → Nomeie e descubra · **Marca fictícia do mockup:** Maison Âmbar Perfumaria

---

## Mockup 1 de 3: página inicial (desktop)
```
Crie uma imagem 16:9, em alta resolução, que seja o mockup de uma página de site com um ambiente 3D interativo em destaque (seção principal), para a marca fictícia "Maison Âmbar Perfumaria" (perfumarias, cosméticos, velas aromáticas).

CENA 3D (ocupa a tela inteira, atrás da interface):
Órgão de perfumista em madeira escura em semicírculo com prateleiras de frascos âmbar com rótulos manuscritos, mesa central de mármore com balança, pipetas e fitas olfativas, e um frasco facetado de cristal sendo preenchido com líquido âmbar, sob luz dourada de ateliê. Luz e cor: luz dourada quente com cáusticas no cristal; âmbar, ébano, mármore e dourado.

NÍVEL DE REALISMO:
Render 3D em tempo real com aparência de "miniatura premium fotorrealista": materiais PBR (madeira com veio, metal escovado, vidro com reflexo, tecido com trama), luz motivada com sombras suaves de contato, tonemapping cinematográfico e leve profundidade de campo no fundo. NÃO é cartoon plano, low-poly, ilustração 2D nem fotografia real. Sem pessoas fotorrealistas identificáveis e sem logotipos ou marcas reais (só a marca fictícia citada).

INTERFACE SOBREPOSTA (estilo etiquetas de boticário em papel envelhecido com bordas recortadas, botões como rolhas):
- Barra de navegação fina e translúcida no topo: o logotipo em texto "Maison Âmbar Perfumaria" à esquerda; os links "Início", "Serviços", "Sobre" e "Contato"; e o botão de destaque "Descobrir fragrâncias" à direita.
- À esquerda, sobre a cena: o título grande "Componha um aroma.", uma frase de apoio curta e um cartão pequeno de passos com "1 · Escolha as notas" destacado e os outros 3 passos em tom suave.
- Na base, centralizado: um dock flutuante com botões "Saída", "Coração", "Fundo", "Pipeta", "Roda olfativa" e "Rótulo".
- Um selo pequeno "Toque e experimente" perto do objeto principal.
Tipografia no espírito de Bodoni Moda + Jost. Rótulos curtos em português do Brasil, legíveis e com alto contraste.

Atmosfera convidativa, sofisticada e calma. Sem marcas d'água e sem logotipos reais.
```

## Mockup 2 de 3: momento de interação (desktop)
```
Agora gere a mesma cena, mesma luz, mesma paleta e mesma interface, em 16:9, mostrando o momento de interação: a pipeta soltando uma gota no frasco de cristal, o líquido mostrando camadas de âmbar e rosa se misturando com brilho, uma aura suave nas cores das notas saindo do frasco e a roda olfativa ao lado. Mostre também um cartão "Equilibre" com a roda olfativa e a lista das 4 notas escolhidas com o número de gotas. O cartão de passos agora destaca "Equilibre".
```

## Mockup 3 de 3: celular
```
Agora gere a mesma página adaptada para celular, em formato retrato 9:19,5: barra do topo só com o logotipo, um ícone de menu e o botão "Descobrir fragrâncias" compacto; a cena reenquadrada com o objeto principal no centro da metade superior; o título "Componha um aroma." menor; o dock vira uma barra inferior com botões grandes e fáceis de tocar, rolável na horizontal se precisar; e o cartão do momento de interação aparece como uma folha inferior curta acima do dock.
```

> Cole as 3 mensagens na mesma conversa do ChatGPT, em sequência. Para outro cliente, troque o nome da marca, o botão e as cores no primeiro prompt.

---

## Prompt de implementação
```
Você é um desenvolvedor sênior de experiências 3D para web (Three.js) e vai implementar o ambiente interativo **"Órgão do Perfumista"** (Marcas e nichos; público: adultos). Ele precisa funcionar como **seção principal de um site** e ser reaproveitado por marcas diferentes (perfumarias, cosméticos, velas aromáticas). Anexei os 3 mockups aprovados (referência visual primária: preserve paleta, enquadramento, materiais e interface) e o arquivo `oficina-do-ritmo.html` como referência de nível 3D e de código.

## Conceito
O órgão do perfumista: uma estante em semicírculo com dezenas de frascos organizados em notas de saída, coração e fundo. O visitante escolhe até 6 essências, dosa gotas com uma pipeta, vê as cores se misturarem num frasco de cristal e recebe uma descrição poética da composição e a sugestão do produto mais próximo do catálogo.

## Mecânica
- Navegar as notas por família (cítrico, floral, amadeirado, especiado, gourmand, aquático).
- Pipeta: segurar solta gotas.
- O frasco enche em camadas coloridas.
- Roda olfativa mostra o equilíbrio da composição.
- Dar nome, criar o rótulo e ver a sugestão do catálogo.

## Passos guiados (4)
1. Escolha as notas
2. Dose as gotas
3. Equilibre
4. Nomeie e descubra
Mostre os passos num cartão discreto que se recolhe; o visitante pode ignorar e explorar livre.

## Cena
Órgão de perfumista em madeira escura em semicírculo com prateleiras de frascos âmbar com rótulos manuscritos, mesa central de mármore com balança, pipetas e fitas olfativas, e um frasco facetado de cristal sendo preenchido com líquido âmbar, sob luz dourada de ateliê. Luz e cor: luz dourada quente com cáusticas no cristal; âmbar, ébano, mármore e dourado. Monte cada objeto principal como peça própria, com pivô correto e nome semântico.

## Interface
Estilo: etiquetas de boticário em papel envelhecido com bordas recortadas, botões como rolhas. Tipografia: Bodoni Moda + Jost. Barra de navegação de demonstração (escondida em `?embed=1`), título "Componha um aroma." com frase de apoio, dock com botões "Saída", "Coração", "Fundo", "Pipeta", "Roda olfativa" e "Rótulo", botão de ação "Descobrir fragrâncias" sempre visível e um modal "Sobre esta experiência" com os créditos e a explicação de privacidade.

## Áudio
Tilintar de vidro, gota, ambiente sutil de ateliê.

## Sistemas específicos
- Catálogo de notas em JSON (família, cor, intensidade, descrição).
- Cor do líquido por média ponderada das gotas, com shader de camadas.
- Roda olfativa em SVG.
- Descrição gerada por modelos de frase (sem IA externa) e recomendação por semelhança de famílias com o catálogo da marca.

## Cuidados
Sem alegações de saúde ou de aromaterapia.

## Padrão técnico (mesmo nível da série; use `oficina-do-ritmo.html` como referência de acabamento)
- **Um único arquivo** `orgao-do-perfumista.html`, sem build, que funciona sozinho e também **embutido** num site: `?embed=1` esconde a barra de navegação de demonstração e deixa só a cena, o título e o dock; ao clicar no botão de ação, envia `postMessage({tipo:'cta'})` para a página-mãe e abre o link configurado.
- **Re-skin por configuração:** no topo do script, um objeto `MARCA` com `nome`, `logoTexto`, `cores` (primária, secundária, fundo, texto, destaque), `fontes` (título e texto), `cta` (texto e link), `textos` (título, frase de apoio, passos) e os catálogos do recurso. Trocar `MARCA` muda a interface **e** os acentos dos materiais 3D (tecidos, vernizes, luzes de destaque), sem mexer no código. Inclua dois presets prontos: o da marca fictícia "Maison Âmbar Perfumaria" e um preset neutro.
- **Three.js r160 por import dinâmico** a partir de um importmap (URLs num só bloco, trocáveis por `./vendor/` para uso offline). Se o import ou o WebGL falhar, mostrar uma imagem estática da cena com os controles 2D essenciais e o botão de ação.
- **Render:** `SRGBColorSpace`, `ACESFilmicToneMapping` (exposição ≈ 0,95–1,0), envMap `RoomEnvironment` via PMREM com `envMapIntensity ≈ 0,45`, hemisférica baixa, **uma luz-chave motivada** com sombras `PCFSoftShadowMap` (e paredes/objetos que projetam a mancha de luz quando houver janela), 1–2 luzes de acento, `FogExp2` leve, sombras de contato falsas sob os objetos.
- **Materiais e geometria:** texturas procedurais em `CanvasTexture`, peças chanfradas (`RoundedBoxGeometry`, `LatheGeometry` com perfil arredondado, `ExtrudeGeometry` com bevel), detalhes secundários, `InstancedMesh` para repetições.
- **Qualidade Alta / Equilibrada / Leve** (detecção + troca manual), bloom contido só na Alta, **render sob demanda**, meta < 150 draw calls e 30 fps no celular.
- **Câmera:** `OrbitControls` com limites e amortecimento; `camera.setViewOffset` para centralizar a cena fora da área do título (desktop) e acima do dock (celular).
- **Interação:** hitboxes invisíveis generosas, toque só conta sem arrasto, atalhos de teclado, todo controle 3D com botão equivalente no dock e anúncio em `aria-live`. Alvo de toque ≥ 48 px, foco visível, `prefers-reduced-motion` respeitado.
- **Áudio seguro:** Web Audio procedural (sem arquivos externos), começa só depois do primeiro toque, botão de som sempre visível, teto de ganho (≈ −24 dBFS), limitador e polifonia limitada.
- **Privacidade:** nenhum rastreamento ou analytics, nenhum dado pessoal coletado; só preferências em `localStorage` (`amb3d_orgao-do-perfumista_v1`). Imagens geradas pelo visitante ficam no aparelho até ele baixar.
- **Autoverificação:** `SCENE_MANIFEST` (id, pos, rot, scale, material, função) com `console.assert` de cada id, e log de triângulos e draw calls.

## Entrega e aceite
Entregue o `.html`, a lista de chaves do objeto `MARCA` com um exemplo preenchido e 3 capturas no enquadramento dos mockups (desktop inicial, desktop no momento de interação, celular). Confirme: sem erros no console; todos os controles funcionam pelo 3D, pelo dock e pelo teclado; o re-skin troca cores, textos e acentos 3D; `?embed=1` funciona; a qualidade Leve fica fluida no celular; nenhuma requisição de rede além das bibliotecas e das fontes.
```
