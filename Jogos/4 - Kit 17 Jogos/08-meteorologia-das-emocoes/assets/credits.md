# Creditos e proveniencia de assets — Meteorologia das Emocoes

Todos os assets deste jogo sao gerados proceduralmente em tempo de execucao
com Three.js (geometrias construtivas, texturas de canvas geradas via API
Canvas 2D e audio sintetizado com Web Audio API). Nenhum modelo, textura ou
audio externo foi baixado nem depende de CDN, servico de nuvem ou credenciais.

## Modelos 3D (procedurais, gerados em src/scene/objects.ts)
- dome_frame: vigas curvas do observatorio (curva + extrusao geometrica)
- window_glass: painel de vidro do grande domo envidraçado
- armillary: esfera armilar central de latão (aroes + esfera pequena)
- telescope: luniao de latão sobre tripé (cilindros + base)
- globe: globo terrestre (esfera + continentes simplificados)
- console: mesa madeira com feltro verde e 4 mostradores
- dial_sun/cloud/rain/wind: mostradores circulares latao com ponteiro
- pointer: ponteiro dos mostradores
- cloud_layers: nuvens estratificadas (esferas agrupadas)
- rain_particles: particulas de chuva exterior ao vidro
- wind_foliage: folhas de planta que reagem ao vento
- sky_gradient: degradê do céu (dividido chuva / por do sol)
- desk_props: livros, canecas, lapiseiras, mapa sobre a mesa

Todas as geometrias usam Y-up, unidades em metros, escala aplicada, nomes de
nos estaveis e proxies simples para picking.

## Texturas (geradas via Canvas 2D, sem arquivos externos)
- madeira carvalho mel, linho, feltro musgo, cortica, ceramica, latao escovado,
  papel creme com fibras, vidro, ceu, chuva, folhas

## Audio (sintetizado com Web Audio API, sem arquivos externos)
- chuva (ruido rosa filtrado), vento (ruido filtrado com modulacao),
- interface (cliques suaves), transicoes

Tudo reproduzido apenas apos gesto do usuario, com mute global visível,
fade curto, limite de ganho e sem surprises sonoras. Nao ha uso de microfone
nem camera.

## Fontes
Nenhum arquivo de fonte externo e obrigatorio. Usa-se pilha de fontes do
sistema com fallback: serifa editoral (Georgia, serif) para titulos e
sans humanista arredondada (system-ui, -apple-system, Segoe UI, Roboto,
Helvetica, Arial, sans-serif) para o restante. Contraste minimo 4,5:1.

## Licenca
Codigo e assets gerados: de propriedade do projeto, uso livre no escopo do
Kit 17 jogos 3D. Nao contem modelos de marca nem conteudo sem licenca.
