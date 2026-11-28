# Arquitetura de uma Pena

Experiência independente em Three.js r187 e WebGL 2. Disponível no launcher em **Cenas** e em **Explorar → Natureza e cultivo**.

## Executar

Na raiz de Ambientes 3D, rode `node Sistema/launcher/server.mjs --no-prebuild` e abra o endereço impresso. A página funciona também em aba avulsa pelo botão de abrir em nova aba do catálogo. Para servir sem executar o launcher, rode `python -m http.server 8000` na raiz e abra o `index.html` desta pasta pela URL correspondente. Os módulos usam a cópia de Three.js em `Sistema/shared/vendor`. Preserve a estrutura das pastas ao usar outro servidor HTTP.

## Explorar

- **Flexão**. Arraste a cena sobre a pena e solte para observar o retorno.
- **Separar**. Toque ou passe a ferramenta na lateral da pena para ver a abertura entre as barbas.
- **Recuperar forma**. Passe a ponta pela abertura para alinhar aquele trecho. **Recompor** alinha a pena inteira.
- **Macro lateral e Microscópio**. Use a roda, a pinça ou o controle de zoom. A vista microscópica revela as bárbulas ao redor da posição de foco.
- **Foto**. Ajuste posição, ampliação, foco e exposição. Fixe uma referência para comparar dois estados na mesma sessão ou exporte um PNG sem a interface.
- **Teclado**. Tab percorre a interface. Com foco no canvas, use as setas para mudar o ponto ao longo da raque e alternar o lado, Espaço para aplicar a ferramenta e + ou − para ampliar ou afastar.
- **Ajustes**. O som começa silenciado. Há controles de volume, redução de movimento, qualidade e desfoque. O botão Pausa permite retomar, reiniciar ou voltar ao catálogo.

## Modelo e evidências

`feather-state.mjs` guarda a curvatura e o estado das fibras em um modelo serializável. A flexão usa uma mola amortecida com limite de deformação e passo fixo de 120 Hz. As barbas seguem curvas e se deslocam localmente na separação. O reencaixe completo faz sua amplitude decair até zero. As bárbulas são uma representação instanciada da estrutura fina. As dimensões, o atrito e a elasticidade são aproximações interativas sem calibração biológica.

Os mockups em `mockups/` são referências de arte em 1920 × 1080 e 1080 × 1920. `capturas/` contém imagens do protótipo executado. Os resultados e o ambiente de teste estão em `RELATORIO_TESTES.md`.

Execute `node --test "Jogos/7 - Cenas 3D/12-arquitetura-de-uma-pena/test/state.test.mjs"` para testar a simulação. Execute `node "Jogos/7 - Cenas 3D/12-arquitetura-de-uma-pena/test/browser.mjs"` para testar a integração com Playwright e Chrome. O script de navegador atualiza as evidências em `capturas/`.
