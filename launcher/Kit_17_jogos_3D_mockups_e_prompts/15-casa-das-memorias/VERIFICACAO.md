# Verificação da Casa das Memórias

## Evidências

- Quatro testes unitários aprovados. Exercitam a seleção explícita para revisão, capacidade, movimentos, remoção, descarte e pausa.
- Teste em Chrome headless com WebGL por software nos perfis 1280×720, 1920×1080, 390×844, 360×640, 430×932, 768×1024 e 844×390. Foram verificados os quatro cômodos, a gaveta, a mala, o movimento de símbolo, a remoção, a seleção para revisar, a pausa e a recuperação após perda do contexto WebGL.
- Capturas revisadas em desktop e celular emulado. Foram ajustados enquadramento, luz, acabamento das folhas e contraste dos materiais. A maquete mantém um acabamento procedural estilizado.
- 16 arquivos GLB 2.0 exportados. Foram verificados cabeçalho binário, comprimento, malhas e contagem positiva de accessors. O manifesto registra tamanhos e hashes SHA-256.

## Orçamento observado

Na captura da casa inteira em 1280×720, o agrupamento por material reduziu de 966 para cerca de 161 chamadas de desenho. Foram observados cerca de 284 mil triângulos. No cômodo da cômoda em 390×844, foram observadas cerca de 119 chamadas e 211 mil triângulos. São contagens do renderizador em enquadramentos específicos. Os alvos de móvel do briefing ainda não foram atingidos.

O build estático tem aproximadamente 2,2 MB sem compressão. Os modelos GLB adicionais somam cerca de 45,8 MB e ficam fora da carga inicial.

## Pendências

- A avaliação em celular físico, a taxa de quadros em hardware real e a validação com Khronos glTF Validator ainda faltam.
- Os GLB são exportações suplementares. As animações da gaveta, mala e símbolos vivem no runtime. Clips exportados, LOD alternativo, compressão Meshopt/KTX2 e colisão contínua ainda faltam. O jogo usa pontos fixos de encaixe e mecanismos cinemáticos.
- O ambiente local disponibilizava Three.js e Node. O build usa o Node, e o teste de navegador usa o protocolo Chrome DevTools. Não foi usado o CLI game-dev, que estava indisponível.
- Cache offline, integração por eventos com host e áudio comprimido não estão incluídos. O som opcional é gerado pela Web Audio API.

