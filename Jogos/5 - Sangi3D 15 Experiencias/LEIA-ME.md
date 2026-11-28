# 15 experiências Sangi3D

No Windows, abra [Jogar.cmd](Jogar.cmd). O script inicia o servidor em `http://127.0.0.1:8765` e abre o catálogo. Para iniciar pelo terminal a partir do workspace, use `python Sangi3D_15_Experiencias/jogar.py`. Use Ctrl+C para encerrar. Preserve o mesmo endereço e a mesma porta ao reabrir o catálogo para acessar os dados locais. O parâmetro `--porta` permite trocar a porta quando necessário.

Cada subpasta tem um `index.html` jogável servido por HTTP, um mockup, a referência visual em PNG e o prompt de produção. A implementação usa HTML, módulos JavaScript, Web Audio e o Three.js r187 já disponível em `shared/vendor`. O renderizador é WebGL 2. As cenas, modelos, texturas e sons integrados são gerados em código, sem CDN ou credenciais. Mantenha a pasta `shared` ao copiar o pacote dentro de outro workspace.

## Conteúdo jogável

| Experiência | Fluxo disponível |
|---|---|
| [Refúgio da Chuva](14-refugio-da-chuva/index.html) | Andar pela cabana, alternar quatro climas, mover janela e cortina, operar lareira e luminária, preparar chá e sentar. |
| [Ateliê de Cerâmica](13-atelie-de-ceramica/index.html) | Esculpir o perfil com parede interna e fundo fechado, desfazer e refazer, aplicar esmalte, simular queima e exportar o perfil. |
| [Universo Audioreativo](08-universo-audioreativo/index.html) | Reproduzir a demonstração, tons de teste ou arquivo local, analisar microfone opcional, trocar entre quatro cenas e salvar preset. |
| [Floresta Bioluminescente](03-floresta-bioluminescente/index.html) | Cruzar a ponte, observar a água, registrar seis espécies e regressar à clareira com o caderno preservado. |
| [Câmara Antigravitacional](12-camara-antigravitacional/index.html) | Arrastar corpos, lançar, comparar velocidade, testar colisões, alterar gravidade, elasticidade e campo central. |
| [Museu das Memórias](11-museu-das-memorias/index.html) | Visitar quatro galerias, editar oito espaços e guardar texto, símbolo ou foto local. Exportar e importar acervo. |
| [Corpo de Partículas](01-corpo-de-particulas/index.html) | Dispersar a silhueta de partículas, mover atratores, desenhar rastros e usar câmera opcional como entrada de movimento. |
| [Laboratório de Ferrofluido](07-laboratorio-de-ferrofluido/index.html) | Mover duas fontes, alterar altura, força e polaridade, comparar coroa e campo rotativo e salvar preset. |
| [Oceano de Tinta](02-oceano-de-tinta/index.html) | Injetar pigmento em uma grade de advecção, agitar, mover barreira, alterar viscosidade e avançar um passo durante a pausa. |
| [Maestro Invisível](15-maestro-invisivel/index.html) | Marcar pulso, escolher compasso, alterar dinâmica, silenciar seções, reouvir e exportar eventos musicais. |
| [Escultor de Planetas](09-escultor-de-planetas/index.html) | Aplicar pincéis a um globo, ajustar o mar, comparar estados e importar ou exportar seed e pinceladas. |
| [Trem sem Destino](05-trem-sem-destino/index.html) | Percorrer três vagões, escolher paisagem e velocidade, sentar, mudar cortina, ler e preparar chá. |
| [Cidade da Madrugada](04-cidade-da-madrugada/index.html) | Usar o semáforo da travessia, explorar a rua sob chuva, abrir o café, entrar e escolher mesa. |
| [Cidade Submersa](06-cidade-submersa/index.html) | Nadar em três eixos, alternar lanterna, catalogar seis peças, abrir a passagem do templo e retornar ao recife. |
| [Arquitetura do Impossível](10-arquitetura-do-impossivel/index.html) | Girar uma estrutura, alinhar uma ponte pelo ponto de observação, atravessar e voltar pelo portal. |

Os circuitos jogáveis correspondem aos recortes da [sequência de execução](SEQUENCIA-DE-EXECUCAO.md). O escopo de expansão continua detalhado nos 15 prompts. Entre os itens de expansão estão percursos maiores na Cidade da Madrugada e na Floresta, as demais salas de Arquitetura do Impossível, rastreamento por landmarks e empacotamento em HTML único. Os sensores de câmera atuais usam movimento de imagem em resolução reduzida processado no navegador. A simulação de ferrofluido é aproximada e a Câmara usa volumes esféricos para os contatos entre corpos.

## Dados e assets

- Preferências, perfis, diários e acervos persistidos ficam no navegador. Exporte JSON nos editores ou no Museu para transportar suas criações entre origens. Use o catálogo em loopback para liberar o contexto seguro exigido pela câmera e pelo microfone.
- As artes `cena.png` foram geradas com ImageGen para o catálogo e os mockups. Os jogos constroem as suas cenas em tempo real. Formas e materiais procedurais estão em `scenery.js` e nos módulos de cena. Objetos navegáveis usam unidades próximas a metros e os editores exibem as unidades específicas de suas ferramentas.
- O Three.js e os módulos regionais do Sangi3D vêm do workspace. A licença do motor está em [shared/vendor/LICENSE](../../Sistema/shared/vendor/LICENSE). As animações e o áudio sintetizado são produzidos pelos módulos, e arquivos de mídia adicionados pelo usuário ficam na sessão ou no acervo local conforme o recurso.
- O ciclo de vida escuta eventos existentes de pausa, retomada, mudo, reset, qualidade e descarte do bridge Sangi3D. O acesso pelo catálogo da coleção é independente do catálogo global.

## Reproduzir os testes

Com Chrome e Playwright disponíveis, execute `node Sangi3D_15_Experiencias/qa.cjs` a partir do workspace. O script serve o mesmo conjunto de arquivos em loopback e abre o Chromium com renderização por software. Passe prefixos como `03 06 10` para testar cenas específicas. A variável `SANGI_QA_DIR` habilita a gravação de screenshots em um diretório escolhido.

A validação automatizada cobre carregamento local, dimensões responsivas, pausa, fluxos principais e casos pontuais de persistência. Fluidez em aparelhos físicos, fidelidade às artes conceituais e paridade entre navegadores exigem testes próprios de produção. As capturas e medições do Game Development Studio dependem do CLI `game-dev`.
