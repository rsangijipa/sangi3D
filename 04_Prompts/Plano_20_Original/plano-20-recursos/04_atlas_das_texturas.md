# 04 · ATLAS DAS TEXTURAS — Plano de execução
Porte **L** · Onda 2 · 3+ e adultos · Percepção e processamento sensorial

## 1. Tese
**Tocar é um conjunto de gestos, cada um revela uma propriedade.** Em vez de "ver" a textura, a pessoa a **explora com gestos distintos** e depois agrupa por preferência e memória.
- Âncoras: procedimentos exploratórios manuais (Lederman & Klatzky, 1987): movimento lateral → rugosidade; pressão → dureza; contato estático → temperatura; envolvimento → forma/volume; seguimento de contorno → borda. Preferências táteis como **vocabulário descritivo**; associação livre de lembranças (abordagem fenomenológica).
- **Não afirma:** defensividade tátil, integração sensorial, perfil sensorial.
- Opção com **materiais físicos reais** mediada por você, o app guia a conversa.

## 2. DNA exclusivo
| Campo | Definição |
|---|---|
| Mundo | **Galeria de espécimes** com bancada de exame |
| Verbo | **Tocar** (5 gestos exploratórios) |
| Assinatura técnica | **Micro-relevo** (normal + paralaxe) + **luz rasante real** controlável + **rastros persistentes** na superfície (cabelo do veludo penteado, sulcos na areia, impressão na argila) |
| Chrome | **Fichas catalográficas** e etiquetas de museu amarradas aos pedestais |
| Tipografia | Spectral + Karla (versaletes nas etiquetas) |
| Luz/grade | Galeria: spots de baixo ângulo, paredes creme, piso areia |
| Áudio-assinatura | Sons de **manuseio muito baixos** por material (veludo, areia, vidro, madeira...) |
| Artefato | "Coleção": materiais agrupados + lembranças (texto livre) |
| **Não pode parecer** | Museu do 14; estúdio; ateliê (cerâmica já existente) |

## 3. Jornada
1. Escolhe um pedestal; o objeto sobe/gira suavemente até a **bancada** (arrastar).
2. A bancada mostra **cinco gestos** (ícones): deslizar, apertar, apoiar, envolver, contornar. Cada um **muda a imagem e o som** (ex.: apoiar cria um halo térmico, **sem** afirmar temperatura medida).
3. **Luz rasante**: o usuário gira a luz e o relevo salta.
4. **Zoom macro** (a amostra esférica/cúbica aproxima a superfície).
5. Agrupa os materiais ("gosto / evito / depende / curioso") e **anota lembranças**; salva a coleção.

## 4. Cena (manifesto)
| ID | Posição | Notas |
|---|---|---|
| `pedestal_L1..4`, `pedestal_R1..4` | X=±3,2 · Z=−2,7 · −0,8 · 1,1 · 3,0 | calcário com borda arredondada, **instanciados** |
| `bancada_exame` | (0,0,0) 2×1 m | superfície de trabalho + suporte de rotação |
| `parede_tatil` | fundo | **quadrados táteis sem legenda** |
| 8 espécimes | nos pedestais | veludo, argila, vidro, madeira, metal escovado, pedra, couro vegetal, areia simulada; cada um com **versão ampliada rotacionável** + **amostra** esférica/cúbica |
Câmera FOV 39°, (8,5.2,10)→(0,1.1,0). Materiais: sheen+trama no veludo; veios orientados 0,55; cerâmica 0,38 com micro-arranhões; vidro transmission; metal 0,9/0,28; pedra 0,9 + displacement discreto.

## 5. Sistemas
- **Gestos → propriedades** (tabela dirigida por dados): cada espécime declara `rugosidade, dureza, temperatura-visual, forma` como **parâmetros de render** (não de "medida").
- **Rastros persistentes:** textura de "estado" por objeto (RenderTarget pequeno) que alimenta normal/roughness; veludo tem **direção de cabelo** (escurece a contrapelo).
- **Luz rasante:** `DirectionalLight` livre, com sombra de contato; AO econômico.
- **Texturas** com anisotropia e compressão KTX2 em 1–2 k por material; 4 k só nos espécimes hero.
- **Coleção:** `colecao.json` (material, grupo, nota).

## 6. Interface, bordas e ilustrações
- **Ficha catalográfica** como painel: número de tombo fictício (sem texto na textura 3D), campos "Nome que eu dou", "Lembra de...".
- Etiquetas de pedestal em **cartão com furo e barbante** (SVG), **ilustração de mão** com os cinco gestos (desenho de linha, uma mão por gesto).
- Moldura de **linho e latão**, sem brilho de "cromado".
- Botões do estilo "gaveta de arquivo".

## 7. Áudio
Foleys **procedurais** de muito baixa energia (ruído filtrado por material: farfalhar de veludo, areia deslizando, tilintar de vidro, madeira); legenda "[som de veludo, suave]"; controle individual por material; teto fixo de volume.

## 8. Acessibilidade, conforto, ética
- Gestos têm **alternativa de botão**; tudo por teclado (setas giram; Enter "apoia").
- **Preferências ≠ avaliação**: sem somas, sem "perfil". Aviso: "estas são suas escolhas de hoje".
- Crianças 3+: materiais com cores de objeto real (sem abstração); texto mínimo; modo adulto para anotações.
- Respeitar quem **evita** alguns materiais: opção "esconder este material" na coleção.

## 9. Etapas
| Etapa | Entrega | Aceite verificável |
|---|---|---|
| **E0** Conteúdo | 8 materiais, 5 gestos, vocabulário de preferência | Aprovado |
| **E1** Blocking | Sala, 8 pedestais instanciados, bancada | Validador verde; captura |
| **E2** Hero | 8 espécimes + amostras; UV; PBR compartilhada | Orçamento; GLB dos hero |
| **E3** Luz + assinatura | Luz rasante, micro-relevo, **rastros persistentes** | Arrastar no veludo muda tom e **permanece** após soltar (teste de imagem) |
| **E4** Mecânica | Bancada, gestos, agrupamento, coleção | Vitest do mapa gesto→parâmetro; coleção persiste |
| **E5** Interface | Ficha, etiquetas, ilustrações das mãos | Contraste; teclado |
| **E6** Áudio | Foleys por material | Pico ≤ teto; legenda |
| **E7** Segurança | Render sob demanda, baixo desempenho (sem displacement) | 30 fps móvel; axe |
| **E8** Entrega | Capturas, divergências, README | 6 critérios com evidência |

## 10. Riscos
Rastros persistentes por objeto aumentam memória (limitar a 256² por espécime) · displacement em móvel (trocar por normal) · conteúdo sensorial intenso para alguns → opção de ocultar.
