# Universo de uma Gota

Microscópio interativo de campo escuro para explorar cinco formas vivas em uma lâmina fictícia. Use a lente, ajuste a iluminação, acompanhe um organismo, observe a resposta ao alimento e guarde fotografias em PNG. As fichas identificam os grupos usados como referência visual.

## Abrir

Na raiz do repositório, rode `node Sistema/launcher/server.mjs` e abra a experiência pelo catálogo Sangi3D. O mesmo jogo funciona pela rota direta do `index.html` servido pelo launcher. Requer navegador com WebGL 2. Os módulos Three.js e Sangi3D são servidos pelo próprio repositório.

## Controles

- Arraste o campo para deslocar a lâmina. Use a roda, uma pinça de dois dedos ou os botões de ampliação. A posição da lâmina também tem botões direcionais e controle de inclinação.
- Selecione um organismo no campo ou use **Organismos** para localizar uma amostra. **Acompanhar** mantém o organismo selecionado sob a lente.
- Com foco no campo, as setas deslocam a lâmina, `+` e `−` ajustam a ampliação e `Enter` identifica a forma central. Use `Alt` com o arraste ou as setas para inclinar.
- Mova **Foco** para alterar o plano de nitidez e **Luz** para variar a intensidade. **Fotografar** exporta o enquadramento atual.
- Ative **Alimento** e toque perto de um ciliado ou de uma ameba. No teclado, ative a ferramenta, focalize o campo e pressione `Enter` para depositar a porção no centro da lente.
- **Menu** oferece ajuste de som, qualidade e reinício. A pausa é acionada pelo cabeçalho ou pelo launcher. Áudio só é ativado explicitamente.

## Modelo e recursos

O campo usa cinco agentes em uma região circular com profundidade limitada. O passo da simulação é de 1/60 s, com até seis passos por quadro e interpolação gráfica. Ciliado e ameba podem desviar para uma porção próxima. A deriva, a aproximação browniana e a alimentação são ilustrativas. Ciliação, deformação, refração aparente e movimento de partículas são recursos de renderização. Ampliação e profundidade usam uma escala aproximada de 40 µm por unidade virtual.

| Recurso | Origem |
| --- | --- |
| Cinco formas, membranas, estruturas internas e cerdas | Texturas procedurais originais em `specimen-art.js` |
| Menisco, iluminação e partículas | Geometria e shaders originais em `microscope.js` |
| Ícones e áudio | SVGs e síntese Web Audio incluídos no código local e no shell Sangi3D |
| Three.js r187 | `Sistema/shared/vendor/three.module.js`, licença MIT |

## Verificação

Na raiz do repositório, rode `node --test "Jogos/1 - Jogos HTML/universo-de-uma-gota/simulation.test.mjs"` para verificar contenção, resposta ao alimento e determinismo. O teste de navegador do launcher aceita `node Sistema/test/sangi-workbenches-browser.mjs universo-de-uma-gota`. Os resultados e as limitações estão em [RELATORIO_TESTES.md](RELATORIO_TESTES.md). As capturas do navegador estão em `capturas/`.
