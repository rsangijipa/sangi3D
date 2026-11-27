# 09. Varanda dos Sinos de Vento

**Conceito.** Uma varanda de madeira ao entardecer com sinos de vento de bambu, metal e vidro. O visitante sopra o vento com o cursor (direção e força), troca os conjuntos de sinos e chama uma chuva fina no telhado de zinco. É uma paisagem sonora generativa: cada som nasce de uma colisão real entre os tubos.

**Grupo:** Sonoros e musicais · **Onde usar:** pousadas, decoração, espaços de meditação, psicologia · **Público:** todas as idades
**Passos:** Sopre o vento → Troque os sinos → Chame a chuva → Fique um pouco · **Marca fictícia do mockup:** Pousada Vento Leve

---

## Mockup 1 de 3: página inicial (desktop)
```
Crie uma imagem 16:9, em alta resolução, que seja o mockup de uma página de site com um ambiente 3D interativo em destaque (seção principal), para a marca fictícia "Pousada Vento Leve" (pousadas, decoração, espaços de meditação, psicologia).

CENA 3D (ocupa a tela inteira, atrás da interface):
Varanda de casa de madeira com beiral de zinco, três sinos de vento pendurados (bambu, tubos de alumínio, vidro marinho), uma rede, plantas em vasos, cortina leve balançando e vista para colinas e mar ao entardecer. Luz e cor: entardecer dourado e lilás, contraluz nos sinos; madeira, bambu, alumínio e vidro verde-água.

NÍVEL DE REALISMO:
Render 3D em tempo real com aparência de "miniatura premium fotorrealista": materiais PBR (madeira com veio, metal escovado, vidro com reflexo, tecido com trama), luz motivada com sombras suaves de contato, tonemapping cinematográfico e leve profundidade de campo no fundo. NÃO é cartoon plano, low-poly, ilustração 2D nem fotografia real. Sem pessoas fotorrealistas identificáveis e sem logotipos ou marcas reais (só a marca fictícia citada).

INTERFACE SOBREPOSTA (estilo madeira clara e linho cru com bordas desgastadas, botões redondos de bambu):
- Barra de navegação fina e translúcida no topo: o logotipo em texto "Pousada Vento Leve" à esquerda; os links "Início", "Serviços", "Sobre" e "Contato"; e o botão de destaque "Reservar estadia" à direita.
- À esquerda, sobre a cena: o título grande "Deixe o vento tocar.", uma frase de apoio curta e um cartão pequeno de passos com "1 · Sopre o vento" destacado e os outros 3 passos em tom suave.
- Na base, centralizado: um dock flutuante com botões "Vento", "Força", "Bambu", "Metal", "Vidro" e "Chuva".
- Um selo pequeno "Toque e experimente" perto do objeto principal.
Tipografia no espírito de Marcellus + Mulish. Rótulos curtos em português do Brasil, legíveis e com alto contraste.

Atmosfera convidativa, sofisticada e calma. Sem marcas d'água e sem logotipos reais.
```

## Mockup 2 de 3: momento de interação (desktop)
```
Agora gere a mesma cena, mesma luz, mesma paleta e mesma interface, em 16:9, mostrando o momento de interação: uma rajada visível nas folhas e na cortina, os tubos de metal balançando e se tocando com pequenos brilhos de luz nos pontos de contato, e gotas finas começando a cair do beiral. Mostre também um cartão "Troque os sinos" com 4 opções de conjunto e o controle "Força do vento". O cartão de passos agora destaca "Chame a chuva".
```

## Mockup 3 de 3: celular
```
Agora gere a mesma página adaptada para celular, em formato retrato 9:19,5: barra do topo só com o logotipo, um ícone de menu e o botão "Reservar estadia" compacto; a cena reenquadrada com o objeto principal no centro da metade superior; o título "Deixe o vento tocar." menor; o dock vira uma barra inferior com botões grandes e fáceis de tocar, rolável na horizontal se precisar; e o cartão do momento de interação aparece como uma folha inferior curta acima do dock.
```

> Cole as 3 mensagens na mesma conversa do ChatGPT, em sequência. Para outro cliente, troque o nome da marca, o botão e as cores no primeiro prompt.

---

## Prompt de implementação
```
Você é um desenvolvedor sênior de experiências 3D para web (Three.js) e vai implementar o ambiente interativo **"Varanda dos Sinos de Vento"** (Sonoros e musicais; público: todas as idades). Ele precisa funcionar como **seção principal de um site** e ser reaproveitado por marcas diferentes (pousadas, decoração, espaços de meditação, psicologia). Anexei os 3 mockups aprovados (referência visual primária: preserve paleta, enquadramento, materiais e interface) e o arquivo `oficina-do-ritmo.html` como referência de nível 3D e de código.

## Conceito
Uma varanda de madeira ao entardecer com sinos de vento de bambu, metal e vidro. O visitante sopra o vento com o cursor (direção e força), troca os conjuntos de sinos e chama uma chuva fina no telhado de zinco. É uma paisagem sonora generativa: cada som nasce de uma colisão real entre os tubos.

## Mecânica
- Arrastar no céu cria uma rajada na direção do gesto.
- Controle "Força" do vento de fundo.
- Trocar o conjunto: bambu, metal afinado, vidro marinho ou conchas.
- "Chuva" liga e desliga a chuva no zinco.
- Controle de hora: pôr do sol até a noite.

## Passos guiados (4)
1. Sopre o vento
2. Troque os sinos
3. Chame a chuva
4. Fique um pouco
Mostre os passos num cartão discreto que se recolhe; o visitante pode ignorar e explorar livre.

## Cena
Varanda de casa de madeira com beiral de zinco, três sinos de vento pendurados (bambu, tubos de alumínio, vidro marinho), uma rede, plantas em vasos, cortina leve balançando e vista para colinas e mar ao entardecer. Luz e cor: entardecer dourado e lilás, contraluz nos sinos; madeira, bambu, alumínio e vidro verde-água. Monte cada objeto principal como peça própria, com pivô correto e nome semântico.

## Interface
Estilo: madeira clara e linho cru com bordas desgastadas, botões redondos de bambu. Tipografia: Marcellus + Mulish. Barra de navegação de demonstração (escondida em `?embed=1`), título "Deixe o vento tocar." com frase de apoio, dock com botões "Vento", "Força", "Bambu", "Metal", "Vidro" e "Chuva", botão de ação "Reservar estadia" sempre visível e um modal "Sobre esta experiência" com os créditos e a explicação de privacidade.

## Áudio
Síntese modal por tubo (metal afinado em escala pentatônica; bambu e vidro inarmônicos) disparada pelas colisões; vento (ruído com rajadas); chuva no zinco (granular). Polifonia com prioridade e limitador.

## Sistemas específicos
- Pêndulos acoplados com física leve (Verlet com restrições, ou Rapier) e colisão entre cilindros e badalo central.
- Vento como campo de força com rajadas e ruído.
- Cortina por deformação de vértices no shader.
- Render contínuo leve só enquanto há movimento; sob demanda quando parado.

## Cuidados
Nenhum cuidado especial.

## Padrão técnico (mesmo nível da série; use `oficina-do-ritmo.html` como referência de acabamento)
- **Um único arquivo** `varanda-dos-sinos-de-vento.html`, sem build, que funciona sozinho e também **embutido** num site: `?embed=1` esconde a barra de navegação de demonstração e deixa só a cena, o título e o dock; ao clicar no botão de ação, envia `postMessage({tipo:'cta'})` para a página-mãe e abre o link configurado.
- **Re-skin por configuração:** no topo do script, um objeto `MARCA` com `nome`, `logoTexto`, `cores` (primária, secundária, fundo, texto, destaque), `fontes` (título e texto), `cta` (texto e link), `textos` (título, frase de apoio, passos) e os catálogos do recurso. Trocar `MARCA` muda a interface **e** os acentos dos materiais 3D (tecidos, vernizes, luzes de destaque), sem mexer no código. Inclua dois presets prontos: o da marca fictícia "Pousada Vento Leve" e um preset neutro.
- **Three.js r160 por import dinâmico** a partir de um importmap (URLs num só bloco, trocáveis por `./vendor/` para uso offline). Se o import ou o WebGL falhar, mostrar uma imagem estática da cena com os controles 2D essenciais e o botão de ação.
- **Render:** `SRGBColorSpace`, `ACESFilmicToneMapping` (exposição ≈ 0,95–1,0), envMap `RoomEnvironment` via PMREM com `envMapIntensity ≈ 0,45`, hemisférica baixa, **uma luz-chave motivada** com sombras `PCFSoftShadowMap` (e paredes/objetos que projetam a mancha de luz quando houver janela), 1–2 luzes de acento, `FogExp2` leve, sombras de contato falsas sob os objetos.
- **Materiais e geometria:** texturas procedurais em `CanvasTexture`, peças chanfradas (`RoundedBoxGeometry`, `LatheGeometry` com perfil arredondado, `ExtrudeGeometry` com bevel), detalhes secundários, `InstancedMesh` para repetições.
- **Qualidade Alta / Equilibrada / Leve** (detecção + troca manual), bloom contido só na Alta, **render sob demanda**, meta < 150 draw calls e 30 fps no celular.
- **Câmera:** `OrbitControls` com limites e amortecimento; `camera.setViewOffset` para centralizar a cena fora da área do título (desktop) e acima do dock (celular).
- **Interação:** hitboxes invisíveis generosas, toque só conta sem arrasto, atalhos de teclado, todo controle 3D com botão equivalente no dock e anúncio em `aria-live`. Alvo de toque ≥ 48 px, foco visível, `prefers-reduced-motion` respeitado.
- **Áudio seguro:** Web Audio procedural (sem arquivos externos), começa só depois do primeiro toque, botão de som sempre visível, teto de ganho (≈ −24 dBFS), limitador e polifonia limitada.
- **Privacidade:** nenhum rastreamento ou analytics, nenhum dado pessoal coletado; só preferências em `localStorage` (`amb3d_varanda-dos-sinos-de-vento_v1`). Imagens geradas pelo visitante ficam no aparelho até ele baixar.
- **Autoverificação:** `SCENE_MANIFEST` (id, pos, rot, scale, material, função) com `console.assert` de cada id, e log de triângulos e draw calls.

## Entrega e aceite
Entregue o `.html`, a lista de chaves do objeto `MARCA` com um exemplo preenchido e 3 capturas no enquadramento dos mockups (desktop inicial, desktop no momento de interação, celular). Confirme: sem erros no console; todos os controles funcionam pelo 3D, pelo dock e pelo teclado; o re-skin troca cores, textos e acentos 3D; `?embed=1` funciona; a qualidade Leve fica fluida no celular; nenhuma requisição de rede além das bibliotecas e das fontes.
```
