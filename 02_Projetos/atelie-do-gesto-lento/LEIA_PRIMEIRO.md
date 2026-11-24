# Ateliê do Gesto Lento

Os dois trechos enviados descrevem o mesmo recurso. O pacote detalha uma aplicação com dois modos: Modelagem livre e Prática guiada.

## Comece pelos prompts

1. Use **01_PROMPT_MESTRE.md** para construir a aplicação e a modelagem da argila.
2. Use **02_PROMPT_PRATICA_GUIADA.md** para adicionar a prática com cinco convites.
3. Anexe a pasta **assets** à ferramenta de desenvolvimento. Os prompts fazem referência aos nomes exatos dos arquivos.

O primeiro prompt define ambiente, geometria, limites físicos aproximados, layout, interação, áudio, dados, exportação e testes. O segundo define estados, etapas, textos, pausas, leitura opcional e encerramento. Ambos são especificações; o produto completo ainda depende da implementação desses prompts.

## Assets incluídos

| Arquivo | Uso | Resolução | Transparência |
|---|---|---|---|
| 01_atelie_referencia.png | Direção artística da oficina | 1536 × 1024 | Não |
| 02_vaso_argila_recorte.png | Interface / entrada / preset | 1295 × 1214 | Alpha real |
| 03_esteca_madeira_recorte.png | Interface / ferramenta | 1774 × 887 | Alpha real |
| 04_argila_albedo.png | Base de cor para material | 1254 × 1254 | Não |

Imagens originais geradas por IA para este projeto. Prompts de geração em assets/PROMPTS_DOS_ASSETS.md. Alpha verificado numericamente nos recortes, com pixels de 0 a 255. As imagens não incluem modelos 3D, áudio, HDR ou mapas PBR medidos. A textura albedo precisa de verificação de emendas quando aplicada com repetição.

## Prévia espacial 3D

Abra **referencia_3d/Atelie_Previa_3D.html** em navegador com WebGL. Three.js 0.180.0 e textura estão embutidos; não precisa de CDN, servidor ou instalação para abrir esse HTML. Não é a aplicação final: oferece órbita limitada, aproximação, giro da peça, ajuste de luz e vista geral. Não oferece escultura, som, salvamento ou prática guiada.

A oficina e os objetos são modelados por geometria: mesa com tábuas e travessas, janela, prateleira, cerâmicas, planta, disco, tigela, pano e estecas. A prévia é uma interpretação inicial da direção de arte, não uma reprodução fotográfica da imagem gerada.

Three.js foi instalado e fixado no package.json/package-lock.json. Para continuar desenvolvendo a cena, rode npm ci na pasta referencia_3d. A dependência node_modules não está no ZIP. O HTML autossuficiente já contém o código necessário e a licença está em THREE_LICENSE.txt.

**Validação:** instalação da dependência, sintaxe JavaScript, estrutura dos assets e alpha verificados. A renderização e os controles em navegador não foram validados nesta execução: o navegador de teste não pôde iniciar no ambiente disponível. Validar visualmente o HTML em desktop e celular antes de utilizá-lo como base de produção. Os critérios de aceite dos prompts são requisitos para o produto a implementar, não testes já executados da aplicação completa.
