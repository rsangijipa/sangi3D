# Casa das Memórias

Casa de bonecas web 3D em português brasileiro. Visite quatro cômodos e organize cinco símbolos opcionais. Explore com ou sem uma história fictícia.

## Jogar

No Windows, clique duas vezes em **Jogar.cmd** dentro desta pasta. É necessário ter o Node.js 24 ou posterior. O lançador escolhe uma porta livre, abre o navegador e mantém o servidor ativo enquanto a janela do terminal estiver aberta.

Para iniciar pelo terminal, execute **nesta pasta**, a que contém `package.json`:

```powershell
npm run dev
```

Abra http://127.0.0.1:4195. Se essa porta estiver ocupada, escolha outra com `$env:CASA_PORT = '4196'` antes de executar o comando.

A pasta `dist` pode ser publicada em qualquer servidor HTTP estático. O jogo funciona sem login, CDN ou API.

## Controles

- Clique em um cômodo, ou use seu botão no painel. **Ver a casa** retorna à vista geral.
- Escolha um símbolo. Nome, palavra e desenho são opcionais. **Pular** permite seguir sem preenchê-los.
- Deixe o símbolo à vista ou guarde-o na gaveta ou na mala. Em **Reorganizar**, você pode abrir e fechar os móveis, mover um símbolo ou removê-lo.
- A etapa de revisão inclui somente a seleção explícita. O JSON é gerado apenas após confirmar a exportação.
- **Esc** pausa a visita. O painel oferece ajustes de movimento e de som.
- A coleção permanece em memória. As preferências de som e movimento não incluem símbolos nem textos. Guardar no móvel é uma escolha visual da sessão.

## Projeto

- `game/` contém estado serializável, regras e conteúdo.
- `scene/` contém a maquete procedural, luzes, câmeras e animação cinemática.
- `ui/`, `input/` e `audio/` contêm interface, desenho e som.
- `assets/models/` contém os modelos glTF binários suplementares. O runtime constrói a maquete a partir da fonte. O manifesto descreve os arquivos e seus hashes.
- `capturas/` contém capturas de execução no Chrome.
- `VERIFICACAO.md` descreve os testes e pendências.

```powershell
npm run build
npm test
npm run test:browser
npm run preview
```

O teste de navegador usa Chrome em Windows. A variável `CASA_CHROME` permite indicar o caminho do navegador em outra instalação. Use `npm run models` para reexportar os GLB com o Chrome local.

