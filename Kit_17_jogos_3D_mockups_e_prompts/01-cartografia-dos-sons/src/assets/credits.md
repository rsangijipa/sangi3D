# Créditos e Proveniência de Assets — Cartografia dos Sons

Todos os assets tridimensionais e sonoros foram criados proceduralmente e são 100% livres de dependências externas ou licenças de terceiros restritivas.

## Modelos 3D (GLB 2.0)
- `map_board.glb`: Base diorama de carvalho mel, folha cartográfica topográfica em papel creme, e itens de mesa (prancheta, pote de cerâmica com lápis, lupa de latão e livros encapados).
- `school.glb`: Escola cívica em alvenaria de tijolos vermelhos com cunhais em pedra, telhado em ardósia, torre de relógio com quadrante analógico, pórtico e mastro com bandeira dourada.
- `bakery.glb`: Padaria/café terracota com toldo listrado, vitrine aquecida iluminada, esplanada com mesa redonda e cadeiras, lousa de menu e vaso de lavanda.
- `house_set.glb`: Conjunto de casas residenciais em reboco ocre/amarelo, telhados cerâmicos, chaminés e janelas iluminadas.
- `road_tiles.glb`: Malha viária em asfalto cinza escuro, faixas seccionadas, faixa de pedestres (zebra) e guias em granito/pedra.
- `fountain.glb`: Fonte circular clássica em pedra esculpida com dois níveis e espelho d'água com ondulações.
- `tree_set.glb`: Árvores estilizadas em feltro musgo com troncos naturais de madeira e arbustos de canteiro.
- `bench.glb`: Bancos de praça com ripas de teca e laterais em ferro fundido trabalhado.
- `lamppost.glb`: Lampiões vitorianos em ferro fundido com luminárias sextavadas de luz quente.
- `bus_token.glb`: Peça arredondada em esmalte azul cerúleo com ícone vazado de ônibus e aro de seleção ciano.
- `bird_token.glb`: Peça arredondada em esmalte verde musgo com ícone de pássaro silvestre.
- `bell_token.glb`: Peça arredondada em esmalte dourado/terracota com ícone de sino escolar.
- `water_token.glb`: Peça arredondada em esmalte azul água com ícone de gota d'água fluida.
- `footstep_token.glb`: Peça arredondada em madeira/âmbar com ícone de pegadas na calçada.
- `listener_marker.glb`: Marcador de escuta do cartógrafo em latão usinado e madeira torneada com símbolo de ouvido.
- `sound_rings.glb`: Anéis concêntricos translúcidos ciano para visualização de alcance e propagação acústica.

## Áudio Procedural (Web Audio API)
- Motores de som gerados em tempo de execução via síntese determinística:
  - Ônibus: Síntese de baixa frequência (combinação de ondas triangulares/senoidais com filtro passa-baixa e ruído modulado).
  - Água da Fonte: Filtros passa-faixa em cascata sobre gerador de ruído rosa, simulando borbulhar e respingos contínuos.
  - Pássaros do Parque: Modulação de frequência (FM) aleatorizada em intervalos melódicos suaves.
  - Sino da Escola: Síntese aditiva com série harmônica de sino com atenuação exponencial natural.
  - Passos na Calçada: Ruído percussivo filtrado simulando solado sobre pedra.
  - Vento e Ambiente: Filtro ressonante lento sobre ruído rosa suave.
- Posicionamento sonoro estéreo e 3D através de `PannerNode` e atenuação contínua por distância Euclidiana.
