# Oficina do Vitralista

Monte um vitral na bancada, una as peças com estanho e experimente três posições de luz. A Rosácea começa parcialmente montada para que a projeção já possa ser observada ao abrir.

## Abrir

No Windows, abra **Abrir Oficina.cmd**. A versão compilada está em `dist` e roda sem baixar recursos. Mantenha a janela do servidor aberta. O endereço local `http://127.0.0.1:4179/` permanece o mesmo entre sessões para preservar o trabalho no navegador. Requer Node.js.

Para desenvolver, execute `npm ci` e `npm run dev`. Para refazer o build, use `npm run build`.

## Usar

- Escolha um vidro na barra e toque em um vão. Também é possível arrastar um caco da bandeja 3D.
- Use **Soldar** e percorra uma junta entre duas peças encaixadas. O estanho fica incandescente e esfria em cerca de quatro segundos.
- Use **Trocar cor** para reaproveitar uma peça instalada. Os três moldes guardam o progresso individualmente.
- Em **Contra a luz**, ajuste a posição do sol e acompanhe a projeção. **Exportar PNG** salva a cena sem a interface.
- **Ações do molde** oferece encaixe, soldagem e troca de cor por teclado. As teclas `1` a `5` escolhem o vidro. `E`, `S`, `C`, `V` e `H` acionam as ferramentas, a inspeção e o recolhimento da interface.

## Verificação

`npm test` cobre a geometria dos moldes, as regras da solda e a restauração do progresso. O teste `tests/browser.mjs` usa Playwright para testar o build em Chromium. Com Playwright e Chromium instalados, execute `node tests/browser.mjs`. Ele também aceita os caminhos `VITRAL_PLAYWRIGHT` para o módulo e `VITRAL_CHROMIUM` para o executável. Use `VITRAL_NATIVE_GPU=1` para medir com o backend gráfico disponível na máquina.

As capturas estão em `capturas`. A medição no navegador usa 24 quadros com uma leitura WebGL de um pixel ao final de cada quadro. A medição inclui o bloqueio da leitura e usa a resolução interna efetiva da cena.

Em Chrome no Windows, com **Intel UHD Graphics via ANGLE/D3D11**, o build passou no TypeScript e os testes de navegador passaram com console limpo. Foram exercitados arraste, encaixe por toque, solda contínua, resfriamento, atualização da projeção, troca de molde e cor, ações por teclado e exportação PNG.

| Qualidade | Janela | Resolução interna | Mediana | P95 | Chamadas de desenho |
| --- | --- | --- | --- | --- | --- |
| Equilibrada | 1280 × 720 | 1152 × 648 | 17,6 ms | 22,0 ms | 80 |
| Cinema | 1280 × 720 | 1280 × 720 | 33,1 ms | 40,4 ms | 153 |
| Leve | 390 × 844 emulado | 390 × 844 | 6,8 ms | 9,3 ms | 68 |

O teste móvel emulou toque e resolução no Chrome de desktop.
