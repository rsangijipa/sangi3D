# Oficina de Mosaicos

Experiência Sangi3D 040. Monte um painel mediterrâneo com tesselas de cerâmica. A bancada abre com a Rosa dos Ventos e oferece Ramo de Limoeiro, Peixes da Maré e Composição Livre.

## Executar

Na raiz de Ambientes 3D, rode `node Sistema/launcher/server.mjs --no-prebuild` e abra **Oficina de Mosaicos** no catálogo. A entrada direta, na porta padrão, é `http://localhost:5170/Jogos/1%20-%20Jogos%20HTML/oficina-de-mosaicos/`. A página usa módulos JavaScript locais e requer um navegador com WebGL 2.

## Jogar

- **Começar guia** destaca um espaço livre e orienta o assentamento, o giro, o rejunte e a revisão em órbita. Use o painel 3D ou os botões do guia. Você pode sair a qualquer momento e continuar a obra na bancada livre.
- Em **Peça**, escolha o esmalte e a forma. Clique ou toque no espaço livre. Arraste para assentar várias tesselas na sequência. A bancada sinaliza sobreposição e mantém a peça assentada no lugar.
- **Girar** roda uma tessela 45°. **Cortar** abre uma junta entre os dois fragmentos. **Pintar** troca o esmalte de uma tessela. **Retirar** libera a posição.
- **Rejunte** oferece Areia, Cal e Ardósia. Aplique por toque ou arraste, ou use **Preencher tudo** para cobrir simultaneamente as juntas e os vazios.
- **Órbita** permite arrastar para observar a bancada. Use a pinça, a rolagem do mouse ou os botões de zoom para ajustar o enquadramento. **Vista superior** volta à edição.
- Pelo teclado, dê foco ao painel e use as setas para navegar e Enter para aplicar. Q e E giram a próxima tessela. Ctrl ou Command + Z desfaz. Com Shift, refaz.
- O progresso é salvo no navegador após cada operação. Em **Opções da peça e arquivos**, ajuste o giro e o pré-corte da próxima peça, exporte e importe a obra em JSON ou salve um PNG da bancada. **Menu** reúne áudio, volume, qualidade e reinício com confirmação.

## Implementação

`model.js` guarda o estado serializável. Cada tessela ocupa uma célula da grade de 21 × 21. A rotação e a extrusão respeitam o limite interno da célula. Uma posição ocupada rejeita outra tessela. O corte recorta o polígono em dois fragmentos com uma abertura visível. A máscara de rejunte registra o preenchimento por célula. `scene.js` usa instâncias com chanfro, reflexos e sombras e só renderiza quando a cena ou a câmera mudam. A qualidade altera resolução e sombras. A argamassa e o esmalte usam geometria e materiais procedurais. As mudanças são imediatas e dispensam integração física por quadro.

## Capturas

- [Desktop](capturas/desktop.jpg)
- [Celular em retrato](capturas/retrato.jpg)
- [Celular em paisagem](capturas/paisagem.jpg)

O [manifesto de recursos](ASSETS.md) registra a origem dos elementos. O [relatório de testes](TESTES.md) descreve as verificações e as condições de execução.

Na raiz, rode `node "Jogos/1 - Jogos HTML/oficina-de-mosaicos/guide.browser.test.mjs"` para verificar o guia com teclado e toque emulado.
