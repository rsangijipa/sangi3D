# Galeria dos Equilíbrios Impossíveis

Ambiente 3D contemporâneo em Three.js/WebGL2 com móbiles cinéticos de inspiração calderiana, alavancas e balanças em galeria de pedra clara, teto alto e iluminação zenital. Componha arranjos escultóricos com pesos de latão, cerâmica, travertino e vidro, desloque o ponto de apoio (fulcro) e explore níveis encadeados de móbiles.

## Abrir

No Launcher dos Ambientes 3D, selecione **Galeria dos Equilíbrios Impossíveis**. Também é possível servir a pasta `dist/` por qualquer servidor HTTP local.

Para desenvolvimento:

```powershell
npm install
npm run dev
```

Para gerar e testar o build estático:

```powershell
npm run build
npm run preview
```

O cache offline (Service Worker) é registrado automaticamente pelo build de produção em `localhost` ou HTTPS.

## Controles e Gestos

- **Adicionar peso**: Selecione um dos 6 pesos artesanais (Vaso de terracota, Esfera canelada verde, Esfera de vidro, Anel de pedra, Cúpula craquelada, Peso de latão), escolha o furo na barra (-40 a +40 cm) ou um braço secundário encadeado e pendure o objeto.
- **Mover fulcro**: Desloque o cursor de apoio ao longo da barra graduada para alterar os braços de alavanca e o equilíbrio físico.
- **Observar movimento**: Acompanhe o dinamômetro vertical calibrado em Newtons, a inclinação em graus (com régua de nível visual) e alterne entre as vistas de câmera (Panorâmica, Fulcro, Superior, Pesos).
- **Equilíbrio livre**: Alterne entre as modalidades (Escultura livre, Desafio de equilíbrio, Assimetria intencional, Composição em parceria) e carregue composições predefinidas.
- **Atalhos**: Use `Ctrl+Z` / `Ctrl+Shift+Z` para desfazer e refazer, `H` para recolher a interface e `Esc` para fechar painéis contextuais.

## Integração e Eventos

A aplicação expõe integração compatível com o Launcher por iframe (`?embed=1`) e DOM local (`galeria:session`), emitindo os eventos de ciclo de vida:
- `ready`: Renderer inicializado (WebGL2 ou Fallback DOM).
- `pause` / `resume`: Pausa da simulação cinética.
- `summary`: Resumo dos parâmetros físicos (massa total, inclinação).
- `complete` / `exit`: Encerramento voluntário da sessão.

## Testes e Validação

```powershell
npm test          # 5 testes unitários de regras, física e torque (Node.js test runner)
npm run build     # Verificação de tipos estritos TypeScript e empacotamento Vite
npm run test:browser # Teste automatizado com Playwright (Desktop, Mobile, Offline, Fallback, Iframe)
```
