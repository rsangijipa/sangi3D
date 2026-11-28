# Pinball de Madeira

Abra [pinball-de-madeira.html](pinball-de-madeira.html) em um navegador compatível. O HTML incorpora a cena, a física, as fontes, o áudio procedural e a imagem usada no modo 2D. Pode ser servido por HTTP(S) ou aberto diretamente do disco, inclusive offline.

## Jogar

| Ação | Comando |
| --- | --- |
| Lançar a bola | Segure e solte **Espaço**, o botão **Lançar** ou o êmbolo na mesa. A força aumenta enquanto você segura. |
| Rebater | Use **← / →**, **A / D**, os botões do dock ou as duas metades do cenário. |
| Modo relax | Use **R** ou **Modo relax** para jogar com bolas livres. A rodada comum tem três bolas. |
| Som e tela | **M** liga ou silencia o som. **H** recolhe ou mostra os controles. **Esc** fecha um diálogo. |
| Nova rodada | Use **Jogar de novo** após a terceira bola ou o botão **Reiniciar rodada** no placar. |

Bumpers, alvos e rampa somam pontos ao placar local. A pontuação dura a rodada. Apenas a qualidade gráfica e a preferência pelo modo relax ficam no navegador. O modo 2D usa o mesmo tabuleiro físico.

## Personalizar a marca

No HTML entregue, edite o objeto **MARCA** no primeiro bloco de script. Ele aponta para o preset Brasa ou pode receber um objeto com as mesmas chaves. Há um preset neutro em **Ajustes** e no endereço `?marca=neutra`.

```js
const MARCA = {
  nome: 'Hamburgueria Brasa',
  logoTexto: 'Hamburgueria Brasa',
  cores: {
    primaria: '#e35429', secundaria: '#2d231e', fundo: '#190f0b',
    texto: '#fff6e6', destaque: '#ffc46a', madeira: '#c69766',
    verniz: '#4d2117', metal: '#c48644', luz: '#ffa238',
  },
  fontes: { titulo: 'Bungee', texto: 'Rubik' },
  cta: { texto: 'Pedir agora', link: '#contato', origemPai: '' },
  textos: {
    titulo: 'Jogue uma\nrodada.',
    apoio: 'Puxe o êmbolo, acerte os alvos e sinta o ritmo do pinball de madeira.',
    passos: ['Puxe o êmbolo', 'Use os flippers', 'Acerte os alvos', 'Jogue de novo'],
    letreiro: ['Hamburgueria', 'Brasa'],
  },
  mesa: {
    bumpers: [
      { id: 'bumper-esquerdo', x: -.49, z: -1.02, color: '#ffb14d', points: 120 },
      { id: 'bumper-central', x: .01, z: -1.50, color: '#ffc36a', points: 120 },
      { id: 'bumper-direito', x: .54, z: -1.02, color: '#ff963d', points: 120 },
    ],
    alvos: [
      { id: 'alvo-1', x: -.45, z: -1.91, points: 250 },
      { id: 'alvo-2', x: -.13, z: -1.99, points: 250 },
      { id: 'alvo-3', x: .19, z: -1.98, points: 250 },
      { id: 'alvo-4', x: .51, z: -1.84, points: 250 },
    ],
    rampa: { points: 500 },
    arte: { emblema: 'hamburguer', inscricao: 'NA BRASA' },
  },
};
```

- **Marca e tipografia** · `nome`, `logoTexto` e `fontes` controlam o título e a navegação. Bungee e Rubik estão incorporadas.
- **Materiais** · `cores` também altera a marchetaria, o verniz, o latão e as luzes da mesa.
- **Tabuleiro** · Ajuste posições `x` e `z`, pontos e cores no catálogo. As posições em metros movem a geometria e os colisores juntos. Mantenha o canal do êmbolo à direita e o dreno livre na base. `emblema` aceita `hamburguer` ou `estrela`.
- **CTA** · `#contato` abre o contato fictício. Substitua `cta.link` pelo endereço da marca. `cta.origemPai` permite fixar o destino do evento do iframe.

## Incorporar no site

```html
<iframe
  title="Pinball de Madeira"
  src="/pinball-de-madeira.html?embed=1"
  allow="autoplay"
  style="width:100%;height:100dvh;border:0">
</iframe>
```

`?embed=1` esconde a navegação de demonstração e mantém o CTA. O clique envia `{ tipo: 'cta' }` à página-mãe. Ao usar o evento, valide a origem e compare `event.source` com a janela do iframe. Os parâmetros `?modo=2d` e `?qualidade=leve` selecionam o modo acessível ou a qualidade mais econômica.

## Autoria e demonstração

O arquivo jogável dispensa instalação. Para editar as fontes, execute `npm ci` e `npm run pack` nesta pasta. `npm run preview` inicia o servidor local e `npm test` verifica a física. `npm run test:browser` verifica a experiência no Chromium. A demonstração editável está em `demonstracao/index.html`.

O projeto usa [Three.js](https://threejs.org/) e [Rapier 2D](https://rapier.rs/javascript2d/). As licenças do Three.js, Rapier, Bungee e Rubik estão incorporadas no HTML. A cena e os sons são originais e procedurais. O núcleo de materiais e modelagem reaproveita as técnicas do Território dos Vínculos.

Veja as capturas e medições no [relatório de verificação](VERIFICACAO.md).

