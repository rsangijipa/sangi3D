# Ateliê das Máscaras Emocionais

Aplicação local em Three.js e TypeScript. A máscara de duas faces, o pedestal e os adornos são renderizados em 3D. O cenário usa uma imagem fotográfica e o espelho recebe uma réplica renderizada da máscara. O arquivo de referência original está na raiz.

## Abrir o ateliê

Com Node.js 22.18 ou superior e npm, execute na pasta do projeto.

```powershell
npm.cmd ci
npm.cmd run dev
```

Abra [o ateliê local](http://127.0.0.1:5187). Para servir o build de produção, use `npm.cmd run build` e depois `npm.cmd run preview`. Também é possível publicar somente a pasta `dist` em hospedagem estática.

O renderizador usa WebGPU quando disponível e WebGL 2 como alternativa. A qualidade adaptativa ajusta a resolução nos dispositivos com renderização mais lenta. O áudio começa desligado. A câmera e os ajustes de luz estão no alto da tela.

## Trabalhar na bancada

- Em **Esculpir**, escolha uma ferramenta e arraste sobre a máscara. **Forma e simetria** reúne três formatos e oito ajustes anatômicos. A escultura combina ajustes procedurais e deformação localizada de vértices. As normais são recalculadas após cada edição.
- Em **Pintar**, arraste para aplicar pigmentos em camada sobre a superfície UV. Alterne entre pigmento fosco, esmalte e folha metálica, com controle de textura, intensidade, mistura e opacidade.
- Em **Decorar**, clique ou toque para encaixar o adorno na superfície. Os adornos acompanham as deformações e a rotação da máscara. Fitas e tecidos usam deformação animada simplificada.
- **Dentro e fora** alterna a superfície em edição. As duas faces têm materiais, camadas de pintura e adornos próprios, conectados pela borda da máscara.
- **Experiências** dá acesso aos modos, à comparação de duas máscaras, ao teatro e às perguntas opcionais. Os atalhos ficam no ícone de teclado da bancada.
- **Salvar** grava uma nova versão no IndexedDB do navegador. A galeria abre, duplica e exclui criações, e permite voltar a versões anteriores. Para levar a criação para fora do navegador, use **Exportar**. O PNG captura a composição, o GLB inclui geometria e texturas, e o OBJ contém a malha.

O aplicativo funciona sem serviços remotos. Nome, descrição e criações só são persistidos ao salvar. Limpar os dados do navegador remove a galeria daquele navegador.

## Testes

`npm.cmd test` verifica as aberturas, a geometria fechada, a separação das faces, os formatos e a simetria. Para rodar o teste no navegador com Playwright instalado, execute `node tests/browser.mjs` com o servidor em execução. A variável `ATELIER_DIST=1` permite testar o build já gerado por interceptação local dos arquivos, e `ATELIER_WEBGPU=1` habilita o teste com WebGPU. O roteiro verifica os fluxos de desktop e celular, persistência, modos e os downloads PNG, GLB e OBJ. As capturas são geradas em `tests/artifacts`.

## Cenário

`public/atelier.webp` foi gerado com a ferramenta integrada ImageGen a partir da referência do projeto, com este prompt.

> Create a new photorealistic wide 16:9 cinematic environment plate for a web 3D experience, based on the attached design solely as reference for scenery, palette and camera. No UI, text, symbols, borders, central mask or central pedestal anywhere in image. A dark antique Venetian mask maker's workshop in warm window light. Preserve layout: tall leaded sunlit window left with a few falling ivy leaves, ornate oval bronze mirror on the left third reflecting a soft window and antique objects, burgundy curtains, moody petrol blue-green wall in the exact center with just warm ambience. On right back shelves with smaller antique theatrical masks, glass lantern, plants and small ceramic pots. Foreground full width richly textured dark walnut workbench starts about 69% down frame, large central clear area of tabletop from x32% to x66% for a virtual brass pedestal; at far left cloth, little pottery with paintbrushes and hand tools, at far right pigment pots, paint palette and little bronze bowl. Warm romantic side light from upper left, physically realistic surfaces and wear, lovely depth of field but background still readable, a photographic dark amber antique painter's studio. Camera slightly above bench, straight on. Full bleed. Wide 16:9.

## Upgrade premium (2026-11)
- Sombras suaves (PCF) da máscara, adornos e personagem; resolução da sombra segue a qualidade escolhida.
- Luz de vela com cintilação e poeira dourada no ar (respeita `prefers-reduced-motion`).
- Adornos com material físico: verniz em cerâmica/pedra, brilho de tecido em fita/tecido/pena.
- Expressões prontas (Neutra, Alegria, Tristeza, Raiva, Surpresa, Serenidade) com transição suave e desfazer.
- Trilha ambiente do ateliê (ar + pad em quintas) e sino ao encaixar adornos/expressões quando o som está ligado.
