# Sala de Espera Sonora

Abra [sala-de-espera-sonora.html](sala-de-espera-sonora.html) no navegador. O arquivo inclui o cenário 3D, a imagem de fallback, as fontes e o áudio procedural. Funciona por HTTP(S) e ao ser aberto diretamente do disco. O vídeo em [demonstracao/](demonstracao/) é uma apresentação em HyperFrames que usa imagens e a mixagem do ambiente.

## Interação

Toque no objeto ou no botão correspondente para ligar ou desligar um canal. Arraste para cima ou para baixo sobre o objeto para ajustar seu volume. O painel **Volumes** oferece controles equivalentes, inclusive para a cortina. A vitrola move o braço e gira o disco enquanto toca. A opção **Respirar 1 minuto** usa seis ciclos de luz sem retenção e pode ser encerrada a qualquer momento.

| Atalho | Ação |
| --- | --- |
| `1` a `5` | Chuva, lareira, vitrola, relógio e plantas |
| `M` | Ligar ou silenciar o som |
| `R` | Iniciar ou encerrar a pausa |
| `V` | Abrir ou fechar o painel de volumes |
| `H` | Recolher ou mostrar os controles |
| `Esc` | Fechar o painel ativo ou encerrar a pausa |
| Tab e Enter | Navegar e acionar botões. As setas também navegam entre os cinco canais. |

O áudio começa após uma ação do visitante. A sala grava apenas preferências de volume, cortina e qualidade no navegador. O modo 2D mantém os controles e o botão de ação se o WebGL estiver indisponível.

## Personalizar a marca

O objeto `MARCA` fica no primeiro bloco de script do HTML, antes do código compilado. O exemplo a seguir resume o preset ativo, com as mesmas chaves do arquivo.

```js
const MARCA = {
  nome: 'Espaço Travessia Psicologia',
  logoTexto: 'Espaço Travessia Psicologia',
  cores: {
    primaria: '#d1ac74', secundaria: '#68503d', fundo: '#221914',
    texto: '#fff1dd', destaque: '#ebc690',
    tecido: '#676437', verniz: '#9b6644', luz: '#ffca86',
  },
  fontes: { titulo: 'Fraunces', texto: 'Inter' },
  cta: { texto: 'Agendar conversa', link: '#contato', origemPai: '' },
  textos: {
    titulo: 'Antes de entrar,\nchegue.',
    apoio: 'Reserve um momento para si mesmo. Interaja com o ambiente e prepare sua mente para o que está por vir.',
    passos: ['Escolha um som', 'Ajuste o volume', 'Respire 1 minuto', 'Siga quando quiser'],
    convite: 'Toque e experimente',
  },
  catalogo: { chuva: 'Chuva', lareira: 'Lareira', vitrola: 'Vitrola', relogio: 'Relógio', plantas: 'Plantas' },
};
```

- `nome` e `logoTexto` aparecem no título da página e na navegação. `fontes` escolhe a tipografia. Fraunces e Inter já estão incorporadas.
- `cores` muda o vidro, a tipografia e o CTA. `tecido`, `verniz` e `luz` colorem os acentos no 3D.
- `textos` configura o título, a frase de apoio, os quatro passos e o convite. `catalogo` altera o rótulo de cada canal.
- `cta.link` recebe o endereço público da marca. No preset fictício, `#contato` abre a apresentação do contato. `origemPai` pode fixar a origem que recebe o evento no modo incorporado.
- O preset neutro está disponível em **Ajustes** e em `?marca=neutra`. `?modo=2d` abre o fallback. `?qualidade=leve` seleciona o perfil gráfico mais econômico.

## Incorporar no site

Hospede o HTML e aponte o iframe para `sala-de-espera-sonora.html?embed=1`. A versão incorporada esconde a navegação de demonstração e mantém o CTA. O botão envia `{ tipo: 'cta' }` para a página-mãe e abre o link configurado. Ao receber o evento, valide a origem e confira se `event.source` corresponde à janela do seu iframe.

```html
<iframe
  title="Sala de Espera Sonora"
  src="/sala-de-espera-sonora.html?embed=1"
  allow="autoplay"
  style="width:100%;height:100dvh;border:0">
</iframe>
```

## Fontes editáveis

`src/` contém os arquivos de autoria. Para regenerar a versão autocontida, execute `npm ci` e `npm run pack` nesta pasta. `npm run preview` serve a prévia local. `npm test` executa o fluxo de verificação. As licenças do Three.js e das fontes seguem incorporadas no HTML.

Os arquivos de campanha usam marca fictícia. A cena, a textura da janela e os sons são procedurais. As técnicas de materiais e modelagem foram reaproveitadas do núcleo do Território dos Vínculos. Os dados de ajuda no Brasil foram conferidos com [CVV](https://www.cvv.org.br/?oai_link_source=model_response_hotline) e [Ministério da Saúde](https://www.gov.br/saude/pt-br/composicao/saes/samu-192/).

