# Auditoria dos menus para celulares

O menu foi integrado ao player do catálogo. Ele exibe atalhos para os controles disponíveis no jogo, com opções de som e abertura em outra aba. O painel pode ser rolado e fechado para liberar a cena. Barras horizontais que excedem a área do jogo recebem rolagem por toque. Controles que exigem segurar ou arrastar continuam na própria cena.

Em Chrome no Windows, com toque emulado a 360 × 800, o menu abriu nas 107 entradas do catálogo local. Em 105 delas apareceram atalhos, e em 22 foi detectada pelo menos uma barra que precisava de rolagem. O Terrário de Vidro disponível apenas no espelho estático também abriu o menu em 390 × 844.

A rede do navegador falhou ao resolver CDNs em 42 entradas. Em 23 houve erro de execução por ausência do Three.js. O Ateliê do Gesto Lento e o Correio das Palavras Não Ditas do Legado abriram o menu sem atalhos nesse cenário. A tabela registra o estado observado na abertura. O total de atalhos varia conforme o jogo avança.

A Colmeia Transparente foi pausada e retomada pelo menu em modo esquemático. O teste cobriu retrato em 360 × 800, 390 × 844 e 412 × 915, paisagem em 844 × 390, tablet em 768 × 1024 e desktop em 1366 × 768 e 1920 × 1080. A Meteorologia das Emoções também foi testada desde a tela inicial até o ajuste de um mostrador pelo menu, após a correção da inicialização. A interação de todos os jogos e o uso em aparelhos físicos seguem sem validação.

| Jogo | Coleção | Atalhos | Barras adaptadas | Observação |
| --- | --- | ---: | ---: | --- |
| Escada da Coragem | Jardins da TCC | 23 | — | Menu aberto |
| Pensar, Sentir e Agir | Jardins da TCC | 3 | — | Requisição de script externo falhou |
| Termômetro da Ansiedade | Jardins da TCC | 8 | — | Requisição de script externo falhou |
| Tribunal dos Pensamentos | Jardins da TCC | 9 | — | Cena interrompida por dependência externa |
| Ateliê dos Remendos e Transformações | Jardins do Sentir | 18 | — | Cena interrompida por dependência externa |
| Biblioteca das Histórias Inacabadas | Jardins do Sentir | 12 | — | Cena interrompida por dependência externa |
| Casa da Árvore das Emoções | Jardins do Sentir | 10 | — | Cena interrompida por dependência externa |
| Cidade das Conexões | Jardins do Sentir | 5 | — | Menu aberto |
| Correio das Palavras Não Ditas | Jardins do Sentir | 13 | — | Cena interrompida por dependência externa |
| Oficina do Vitralista | Projetos 3D | 13 | 1 | Menu aberto |
| Tear dos Vínculos | Projetos 3D | 6 | — | Menu aberto |
| Ateliê das Máscaras Emocionais | Projetos 3D | 10 | — | Menu aberto |
| Ateliê do Gesto Lento | Projetos 3D | 0 | — | Cena interrompida por dependência externa |
| Jardim dos Ciclos | Projetos 3D | 5 | — | Menu aberto |
| Mochila da Travessia | Projetos 3D | 3 | — | Cena interrompida por dependência externa |
| Oficina dos Gestos Compartilhados | Projetos 3D | 10 | 1 | Cena interrompida por dependência externa |
| Território dos Vínculos | Projetos 3D | 11 | — | Menu aberto |
| Cartografia dos Sons | Kit 17 jogos 3D | 12 | — | Menu aberto |
| Atlas das Texturas | Kit 17 jogos 3D | 5 | — | Menu aberto |
| Laboratório de Camadas Sonoras | Kit 17 jogos 3D | 11 | — | Menu aberto |
| Observatório da Luz | Kit 17 jogos 3D | 7 | — | Menu aberto |
| Oficina do Tempo | Kit 17 jogos 3D | 6 | — | Menu aberto |
| Torre do Impulso | Kit 17 jogos 3D | 2 | — | Menu aberto |
| Ilha das Pausas | Kit 17 jogos 3D | 5 | — | Menu aberto |
| Meteorologia das Emoções | Kit 17 jogos 3D | 6 | — | Menu aberto |
| Estação das Trocas | Kit 17 jogos 3D | 3 | — | Menu aberto |
| Porto das Decisões | Kit 17 jogos 3D | 9 | — | Menu aberto |
| Bússola do Corpo | Kit 17 jogos 3D | 10 | — | Menu aberto |
| 12. Cidade das Conversas | Kit 17 jogos 3D | 6 | — | Menu aberto |
| Museu dos Pontos de Vista | Kit 17 jogos 3D | 7 | — | Menu aberto |
| Estúdio dos Limites | Kit 17 jogos 3D | 7 | — | Menu aberto |
| Casa das Memórias | Kit 17 jogos 3D | 4 | — | Menu aberto |
| Teatro das Histórias Possíveis | Kit 17 jogos 3D | 13 | — | Menu aberto |
| 17. Ensaio do Cotidiano | Kit 17 jogos 3D | 7 | — | Menu aberto |
| Arquipélago Celestial | Ambientes avulsos | 9 | — | Menu aberto |
| Bancada do Florista | Ambientes avulsos | 14 | 1 | Menu aberto |
| Biblioteca Infinita | Ambientes avulsos | 4 | — | Menu aberto |
| Caixa de Música Perfurada | Ambientes avulsos | 15 | 1 | Requisição de script externo falhou |
| Cidade Submersa | Ambientes avulsos | 6 | — | Menu aberto |
| Colmeia Transparente | Ambientes avulsos | 10 | 1 | Requisição de script externo falhou |
| Confeitaria de Bolos | Ambientes avulsos | 14 | 1 | Requisição de script externo falhou |
| Cozinha das Descobertas | Ambientes avulsos | 10 | — | Menu aberto |
| Estufa das Borboletas | Ambientes avulsos | 25 | 1 | Requisição de script externo falhou |
| Gerador de Mundos Climáticos | Ambientes avulsos | 24 | 2 | Requisição de script externo falhou |
| Jardim dos Fungos | Ambientes avulsos | 11 | 1 | Requisição de script externo falhou |
| Lago 3D Interativo | Ambientes avulsos | 17 | — | Menu aberto |
| Maquete que se Monta | Ambientes avulsos | 13 | 1 | Requisição de script externo falhou |
| Máquina de Garra de Brindes | Ambientes avulsos | 7 | 1 | Requisição de script externo falhou |
| Moinho Hidráulico | Ambientes avulsos | 13 | 1 | Requisição de script externo falhou |
| Observatório da Luz (HTML) | Ambientes avulsos | 5 | — | Menu aberto |
| Oficina das Velas Artesanais | Ambientes avulsos | 19 | 1 | Requisição de script externo falhou |
| Oficina de Bonsais | Ambientes avulsos | 17 | 1 | Requisição de script externo falhou |
| Oficina de Estofados | Ambientes avulsos | 17 | — | Menu aberto |
| Oficina do Ritmo Compartilhado | Ambientes avulsos | 21 | — | Requisição de script externo falhou |
| Oficina do Vitralista (HTML) | Ambientes avulsos | 12 | — | Menu aberto |
| Paisagem Sonora | Ambientes avulsos | 5 | — | Menu aberto |
| Pousada Vento Leve | Ambientes avulsos | 13 | 1 | Requisição de script externo falhou |
| Restauro de Azulejos | Ambientes avulsos | 11 | — | Menu aberto |
| Semáforo das Emoções | Ambientes avulsos | 8 | — | Requisição de script externo falhou |
| Terrário de Vidro (Ateliê Expandido) | Ambientes avulsos | 10 | — | Menu aberto |
| Trem de Engrenagens | Ambientes avulsos | 9 | — | Requisição de script externo falhou |
| Trem sem Destino | Ambientes avulsos | 5 | — | Menu aberto |
| Universo Audioreativo | Ambientes avulsos | 4 | — | Menu aberto |
| Vulcão em Miniatura | Ambientes avulsos | 16 | 1 | Requisição de script externo falhou |
| Sala de Espera Sonora | Adultos e marcas | 13 | — | Menu aberto |
| Mesa dos Objetos que Acalmam | Adultos e marcas | 6 | 1 | Menu aberto |
| Casa Seixo Yoga e Terapia | Adultos e marcas | 8 | 1 | Requisição de script externo falhou |
| Máquina de Escrever das Intenções | Adultos e marcas | 4 | — | Menu aberto |
| Clepsidra do Foco | Adultos e marcas | 4 | — | Menu aberto |
| Copos Musicais | Adultos e marcas | 12 | — | Menu aberto |
| Toca-Discos de Vinil | Adultos e marcas | 5 | — | Menu aberto |
| Máquina de Reação em Cadeia | Adultos e marcas | 8 | — | Menu aberto |
| Relógio Aberto | Adultos e marcas | 5 | — | Menu aberto |
| Pinball de Madeira | Adultos e marcas | 8 | — | Menu aberto |
| Bancada da Manicure | Adultos e marcas | 16 | — | Menu aberto |
| Barista de Bancada | Adultos e marcas | 3 | — | Menu aberto |
| Órgão do Perfumista | Adultos e marcas | 9 | — | Menu aberto |
| Trilha do Mestre Mandou | Expressão e desenvolvimento | 8 | — | Menu aberto |
| Ateliê das Reconstruções | Expressão e desenvolvimento | 4 | — | Menu aberto |
| Galeria dos Equilíbrios Impossíveis | Expressão e desenvolvimento | 2 | — | Menu aberto |
| Sala das Cadeiras Possíveis | Expressão e desenvolvimento | 13 | — | Menu aberto |
| Sopraria das Transformações | Expressão e desenvolvimento | 14 | 1 | Menu aberto |
| Pavilhão dos Tecidos Flutuantes | Expressão e desenvolvimento | 14 | 1 | Menu aberto |
| Agência de Investigação dos Pensamentos | Expressão e desenvolvimento | 14 | 1 | Menu aberto |
| Rádio dos Pensamentos | Expressão e desenvolvimento | 13 | — | Menu aberto |
| Máquina das Consequências | Expressão e desenvolvimento | 13 | — | Menu aberto |
| Central dos Planos Alternativos | Expressão e desenvolvimento | 13 | — | Menu aberto |
| Relojoaria das Prioridades | Expressão e desenvolvimento | 13 | — | Menu aberto |
| Farol da Atenção | Expressão e desenvolvimento | 13 | — | Menu aberto |
| Vale dos Balões Passageiros | Expressão e desenvolvimento | 13 | — | Menu aberto |
| Navegador dos Valores | Expressão e desenvolvimento | 13 | — | Menu aberto |
| Areias do Impermanente | Expressão e desenvolvimento | 14 | 1 | Menu aberto |
| Ateliê dos Remendos e Transformações | Legado arquivado | 14 | — | Cena interrompida por dependência externa |
| Biblioteca das Histórias Inacabadas | Legado arquivado | 4 | — | Cena interrompida por dependência externa |
| Cartografia do Corpo Sentido | Legado arquivado | 17 | — | Cena interrompida por dependência externa |
| Cidade das Conexões | Legado arquivado | 14 | — | Cena interrompida por dependência externa |
| Correio das Palavras Não Ditas | Legado arquivado | 0 | — | Cena interrompida por dependência externa |
| Estação das Escolhas | Legado arquivado | 7 | — | Cena interrompida por dependência externa |
| Estúdio das Sombras e da Luz | Legado arquivado | 12 | — | Cena interrompida por dependência externa |
| Laboratório das Leis Imaginárias | Legado arquivado | 15 | — | Cena interrompida por dependência externa |
| Laboratório dos Sons e Silêncios | Legado arquivado | 12 | — | Cena interrompida por dependência externa |
| Museu das Perspectivas | Legado arquivado | 9 | — | Cena interrompida por dependência externa |
| Oficina dos Robôs Imperfeitos | Legado arquivado | 12 | — | Cena interrompida por dependência externa |
| Planetário das Memórias | Legado arquivado | 10 | — | Cena interrompida por dependência externa |
| Santuário Zen | Legado arquivado | 5 | — | Cena interrompida por dependência externa |
| Teatro das Possibilidades | Legado arquivado | 15 | — | Cena interrompida por dependência externa |
| Vila dos Encontros | Legado arquivado | 6 | — | Cena interrompida por dependência externa |
| Terrário de Vidro | Ambientes avulsos · espelho estático | 12 | — | Menu aberto |
