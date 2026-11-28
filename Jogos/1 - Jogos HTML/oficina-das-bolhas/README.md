# Oficina das Bolhas

Abra **Oficina das Bolhas** pelo launcher Sangi3D. Para execução direta, inicie `node Sistema/launcher/server.mjs --no-prebuild` a partir da raiz e abra o `index.html` da oficina pelo servidor. A página usa WebGL 2 e o Three.js do repositório, na revisão 187. Preserve a estrutura de pastas para que a oficina encontre o motor e os controles do launcher.

## Explorar a oficina

- Use **Mergulhar aro** e **Soprar** para criar bolhas. Também é possível arrastar o aro a partir da bancada e soltá-lo. O aro precisa estar molhado para cada criação.
- Toque ou clique numa bolha para estourar apenas aquela que estiver mais próxima da câmera sob o ponteiro. **Estourar uma** escolhe a bolha mais próxima do centro da vista. As teclas `M`, `S` e `E` acionam essas operações.
- Experimente **Composição livre** e **Bolha gigante**. Em **Controles do experimento**, varie o aro de 8 a 24 cm, o sopro de 10 a 100% e o vento de 80% para a esquerda a 80% para a direita.
- Arraste uma região livre da cena para girar a câmera. Use pinça ou a roda para aproximar. Setas do teclado e botões sob os indicadores giram a câmera horizontalmente.
- **Salvar cena** exporta um PNG. Volume, qualidade gráfica, reinício e som opcional ficam em **Menu**.

## Simulação e recursos

`simulation.js` mantém o estado e integra a subida em um passo fixo de 1/60 s. O arrasto aproxima a velocidade de cada bolha da corrente local. Duas bolhas recém-criadas podem se fundir após se sobreporem, conservando o volume da esfera no modelo. O diâmetro exibido é uma estimativa baseada na escala da bancada. As bolhas de demonstração sobem devagar para permanecerem visíveis quando a oficina abre.

`studio.js` gera o ateliê, o aro e as texturas no navegador. O shader aproxima a interferência de filme fino por três bandas de cor com espessura variável. Reflexos de janela, ondulação da película e respingos são efeitos visuais. A opção de movimento reduzido desativa a oscilação e os respingos e preserva a dinâmica do experimento.

O áudio é sintetizado no navegador. A qualidade baixa reduz a resolução e desliga as sombras dinâmicas. Os três perfis mantêm os controles e a física.

## Verificações

Execute `node --test "Jogos/1 - Jogos HTML/oficina-das-bolhas/simulation.test.mjs"` para verificar as regras de liberação, subida, vento, fusão, seleção e reinício.

Execute `node Sistema/test/sangi-workbenches-browser.mjs oficina-das-bolhas` para verificar os controles e a integração com o launcher em desktop, retrato e paisagem.
